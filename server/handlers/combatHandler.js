const { CHARACTERS } = require("../data/characters");
const {
  addGameLog,
  sendFilteredGameState,
  calculateSteps,
  getMaxWeight,
} = require("../utils/gameHelpers");

function handleCombatEvents(io, socket, rooms, games) {
  socket.on("action_attack", ({ roomId, dx, dy, weaponIndex }) => {
    const game = games[roomId];
    if (!game || game.turnPhase !== "attacking") return;

    const player = game.players[socket.id];
    if (socket.id !== game.turnOrder[game.currentTurnIndex]) return;

    if (dx === 0 && dy === 0) {
      addGameLog(
        game,
        `💨 <b>${player.name}</b> quyết định bỏ qua lượt tấn công.`,
      );
    } else {
      let weapon = { name: "Chảo", damage: 1, range: 1, subType: "Cận Chiến" };
      if (weaponIndex !== null && player.inventory.weapons[weaponIndex]) {
        weapon = player.inventory.weapons[weaponIndex];
      }
      if (!weapon.subType) weapon.subType = "Cận Chiến";

      if (player.charId === "c1" && weapon.name === "Chảo") weapon.damage = 2;
      if (player.charId === "c3" && player.hp <= 4) weapon.damage += 1;

      addGameLog(
        game,
        `⚔️ <b>${player.name}</b> dùng <b>${weapon.name}</b> tấn công!`,
      );

      // 1. TÌM ĐIỂM RƠI & ĐƯỜNG ĐẠN
      let impactX = player.x;
      let impactY = player.y;
      let hitBarrel = false;
      let bulletPath = [];

      for (let step = 1; step <= weapon.range; step++) {
        let nextX = impactX + dx;
        let nextY = impactY + dy;

        if (
          nextX < 0 ||
          nextX >= game.map[0].length ||
          nextY < 0 ||
          nextY >= game.map.length
        )
          break;

        if (weapon.subType.includes("Súng") || weapon.subType.includes("gun")) {
          if (game.map[nextY][nextX].type === "obstacle") break;
        }

        impactX = nextX;
        impactY = nextY;
        bulletPath.push({ x: impactX, y: impactY });

        if (game.map[impactY][impactX].type === "barrel") {
          hitBarrel = true;
          break;
        }

        const victim = Object.values(game.players).find(
          (p) =>
            p.x === impactX &&
            p.y === impactY &&
            !p.isChicken &&
            p.id !== player.id,
        );

        if (victim) {
          if (
            victim.charId === "c9" &&
            game.map[impactY][impactX].type === "bush" &&
            step > 1 &&
            !(weapon.subType.includes("Bom") || weapon.subType.includes("bomb"))
          ) {
            addGameLog(
              game,
              `🍃 Đạn xẹt qua lùm cây, <b>Trí Trốn Tìm</b> né gọn!`,
            );
            continue;
          }
          break;
        }
      }

      // 2. TÍNH TOÁN VÙNG NỔ (AoE)
      let finalAffectedCells = [{ x: impactX, y: impactY }];
      let finalDamage = weapon.damage;
      let effectType = weapon.subType;

      if (hitBarrel) {
        addGameLog(
          game,
          `💥 <b>${player.name}</b> đã bắn trúng THÙNG XĂNG gây nổ diện rộng!`,
        );
        game.map[impactY][impactX].type = "empty";
        finalDamage = 2;
        effectType = "Bom";
        finalAffectedCells = [];
        for (let yy = impactY - 1; yy <= impactY + 1; yy++) {
          for (let xx = impactX - 1; xx <= impactX + 1; xx++) {
            finalAffectedCells.push({ x: xx, y: yy });
          }
        }
      } else if (weapon.explosion === "3x3") {
        finalAffectedCells = [];
        for (let yy = impactY - 1; yy <= impactY + 1; yy++) {
          for (let xx = impactX - 1; xx <= impactX + 1; xx++) {
            finalAffectedCells.push({ x: xx, y: yy });
          }
        }
        effectType = "Bom";
      } else if (weapon.explosion === "cross") {
        finalAffectedCells = [
          { x: impactX, y: impactY },
          { x: impactX, y: impactY - 1 },
          { x: impactX, y: impactY + 1 },
          { x: impactX - 1, y: impactY },
          { x: impactX + 1, y: impactY },
        ];
        effectType = "Bom";
      }

      io.to(roomId).emit("play_effect", {
        type: effectType,
        path: bulletPath,
        impactX: impactX,
        impactY: impactY,
        affectedCells: finalAffectedCells,
      });

      // 3. GÂY SÁT THƯƠNG
      let hitSomeone = false;
      Object.values(game.players).forEach((target) => {
        if (target.isChicken) return;

        const isInBlast = finalAffectedCells.some(
          (cell) => cell.x === target.x && cell.y === target.y,
        );

        if (isInBlast) {
          if (target.id === player.id && finalAffectedCells.length === 1)
            return;

          const dist = Math.max(
            Math.abs(player.x - target.x),
            Math.abs(player.y - target.y),
          );
          if (
            target.charId === "c9" &&
            game.map[target.y][target.x].type === "bush" &&
            dist > 1 &&
            !(weapon.subType.includes("Bom") || weapon.subType.includes("bomb"))
          ) {
            return;
          }

          hitSomeone = true;
          let incomingDamage = finalDamage;

          let armorItems = target.inventory.supports.filter(
            (item) => item.defense,
          );
          let nonArmorItems = target.inventory.supports.filter(
            (item) => !item.defense,
          );
          for (let i = 0; i < armorItems.length; i++) {
            if (incomingDamage <= 0) break;
            let armor = armorItems[i];
            if (incomingDamage >= armor.defense) {
              incomingDamage -= armor.defense;
              target.currentWeight -= armor.weight;
              armor.defense = 0;
              addGameLog(
                game,
                `🛡️ Áo giáp của <b>${target.name}</b> đã bị vỡ nát!`,
              );
            } else {
              armor.defense -= incomingDamage;
              incomingDamage = 0;
            }
          }
          target.inventory.supports = [
            ...nonArmorItems,
            ...armorItems.filter((a) => a.defense > 0),
          ];

          if (incomingDamage > 0) {
            target.hp -= incomingDamage;
            addGameLog(
              game,
              target.id === player.id
                ? `🔥 <b>${target.name}</b> tự hủy sấp mặt mất ${incomingDamage} máu do đứng trong vùng nổ!`
                : `🩸 <b>${target.name}</b> dính chưởng mất ${incomingDamage} máu!`,
            );
          }

          if (
            player.charId === "c10" &&
            (weapon.subType === "Cận Chiến" || weapon.subType === "melee") &&
            !hitBarrel &&
            target.id !== player.id &&
            Math.random() < 0.5 &&
            target.hp > 0
          ) {
            const validCategories = ["weapons", "supports", "vehicles"].filter(
              (cat) => target.inventory[cat].length > 0,
            );
            if (validCategories.length > 0) {
              const randomCat =
                validCategories[
                  Math.floor(Math.random() * validCategories.length)
                ];
              const stolenItem = target.inventory[randomCat].pop();
              target.currentWeight -= stolenItem.weight;

              const SLOTS = { weapon: 2, support: 2, vehicle: 1 };
              if (
                player.inventory[randomCat].length < SLOTS[stolenItem.type] &&
                player.currentWeight + stolenItem.weight <= getMaxWeight(player)
              ) {
                player.inventory[randomCat].push(stolenItem);
                player.currentWeight += stolenItem.weight;
                addGameLog(
                  game,
                  `🧤 <b>Thảo Thó Đồ</b> đã nẫng mất <b>${stolenItem.name}</b> của <b>${target.name}</b>!`,
                );
              } else {
                game.map[player.y][player.x].item = stolenItem;
              }
            }
          }

          if (target.hp <= 0) {
            target.isChicken = true;
            target.hp = 0;
            addGameLog(
              game,
              target.id === player.id
                ? `🐔 Đỉnh cao trí tuệ! <b>${target.name}</b> đã tự đưa mình vào ô HÓA GÀ!`
                : `🐔 K.O! <b>${target.name}</b> đã bay màu và hóa thành GÀ!`,
            );
            const allLoot = [
              ...target.inventory.weapons,
              ...target.inventory.supports,
              ...target.inventory.vehicles,
            ];
            if (allLoot.length > 0)
              game.map[target.y][target.x].item = allLoot[0];
            target.inventory = { weapons: [], supports: [], vehicles: [] };
            target.currentWeight = 0;
          }
        }
      });

      if (!hitSomeone && !hitBarrel) {
        addGameLog(game, `😅 <b>${player.name}</b> tấn công trượt lất!`);
      }

      if (
        weapon.subType &&
        (weapon.subType.includes("Bom") || weapon.subType.includes("bomb"))
      ) {
        if (weaponIndex !== null) {
          player.currentWeight -= weapon.weight;
          player.inventory.weapons.splice(weaponIndex, 1);
          addGameLog(
            game,
            `💨 <b>${player.name}</b> đã tiêu hao 1 ${weapon.name}.`,
          );
        }
      }
    }

    // 4. KIỂM TRA ĐẦM LẦY VÀ BO KHÍ ĐỘC
    const currentCell = game.map[player.y][player.x];
    if (currentCell.type === "swamp" && !player.isChicken) {
      player.hp -= 1;
      addGameLog(
        game,
        `🤢 <b>${player.name}</b> mất 1 HP do hít phải khí độc đầm lầy!`,
      );

      if (player.hp <= 0) {
        player.isChicken = true;
        player.hp = 0;
        addGameLog(game, `🐔 <b>${player.name}</b> đã gục ngã vì Đầm Lầy Độc!`);
        const allLoot = [
          ...player.inventory.weapons,
          ...player.inventory.supports,
          ...player.inventory.vehicles,
        ];
        if (allLoot.length > 0) game.map[player.y][player.x].item = allLoot[0];
        player.inventory = { weapons: [], supports: [], vehicles: [] };
        player.currentWeight = 0;
      }
    }

    const sz = game.safeZone;
    if (
      player.x < sz.xMin ||
      player.x > sz.xMax ||
      player.y < sz.yMin ||
      player.y > sz.yMax
    ) {
      if (!player.isChicken) {
        player.hp -= 3;
        addGameLog(
          game,
          `☠️ <b>${player.name}</b> bị sặc khí độc ngoài vòng Bo (Mất 3 HP)!`,
        );

        if (player.hp <= 0) {
          player.isChicken = true;
          player.hp = 0;
          addGameLog(game, `🐔 <b>${player.name}</b> đã gục ngã vì vòng Bo!`);
          const allLoot = [
            ...player.inventory.weapons,
            ...player.inventory.supports,
            ...player.inventory.vehicles,
          ];
          if (allLoot.length > 0)
            game.map[player.y][player.x].item = allLoot[0];
          player.inventory = { weapons: [], supports: [], vehicles: [] };
          player.currentWeight = 0;
        }
      }
    }

    // 5. CHUYỂN LƯỢT THÔNG MINH
    do {
      if (game.smokes) {
        game.smokes.forEach((s) => s.duration--);
        game.smokes = game.smokes.filter((s) => s.duration > 0);
      }

      game.currentTurnIndex++;
      if (game.currentTurnIndex >= game.turnOrder.length) {
        game.currentTurnIndex = 0;
        game.currentRound++;
        addGameLog(game, `🌀 ====== BẮT ĐẦU VÒNG ${game.currentRound} ======`);

        if ((game.currentRound - 1) % 3 === 0) {
          game.safeZone.xMin++;
          game.safeZone.xMax--;
          game.safeZone.yMin++;
          game.safeZone.yMax--;
          addGameLog(game, `🚨 CẢNH BÁO: Vòng Bo khí độc đã thu hẹp!`);
        }
      }
    } while (game.players[game.turnOrder[game.currentTurnIndex]].isChicken);

    game.stepsLeft = calculateSteps(
      game.players[game.turnOrder[game.currentTurnIndex]],
    );
    game.turnPhase = "moving";

    sendFilteredGameState(io, roomId, game, rooms);
  });
}

module.exports = handleCombatEvents;
