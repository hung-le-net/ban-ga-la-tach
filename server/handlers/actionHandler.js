const { getRandomItem } = require("../data/items");
const { CHARACTERS } = require("../data/characters");
const {
  addGameLog,
  sendFilteredGameState,
  calculateSteps,
  getMaxWeight,
} = require("../utils/gameHelpers");

function handleActionEvents(io, socket, rooms, games) {
  // --- 1. NHẬN LỆNH DI CHUYỂN ---
  socket.on("action_move", ({ roomId, dx, dy }) => {
    const game = games[roomId];
    if (!game) return;

    const currentPlayerId = game.turnOrder[game.currentTurnIndex];
    if (socket.id !== currentPlayerId) return;
    if (game.turnPhase !== "moving") return;

    const player = game.players[socket.id];
    const newX = player.x + dx;
    const newY = player.y + dy;

    const mapSize = game.map.length;
    if (newX < 0 || newX >= mapSize || newY < 0 || newY >= mapSize) return;

    const targetCell = game.map[newY][newX];

    if (targetCell.type === "obstacle" || targetCell.type === "ice") return;

    if (targetCell.type === "water") {
      const hasCar = player.inventory.vehicles.some((v) => v.name === "Ô Tô");
      if (!hasCar) return;
    }

    const isOccupied = Object.values(game.players).some(
      (p) => p.x === newX && p.y === newY,
    );
    if (isOccupied) return;

    if (targetCell.type === "bush" || targetCell.type === "warehouse") {
      if (player.inventory.vehicles.length > 0) {
        const currentVehicle = player.inventory.vehicles[0];
        const isSkateboard = currentVehicle.name === "Ván Trượt";

        if (!isSkateboard) {
          const droppedVehicle = player.inventory.vehicles.pop();
          player.currentWeight -= droppedVehicle.weight;
          game.map[player.y][player.x].item = droppedVehicle;
          addGameLog(
            game,
            `🚗 <b>${player.name}</b> phải để <b>${droppedVehicle.name}</b> ở ngoài để chui vào ${targetCell.type === "bush" ? "bụi rậm" : "nhà kho"}!`,
          );
        }
      }
    }

    player.x = newX;
    player.y = newY;
    game.stepsLeft -= 1;

    if (targetCell.hasRobber) {
      targetCell.hasRobber = false;
      game.turnPhase = "robbed";
      addGameLog(
        game,
        `⚠️ <b>${player.name}</b> đã giẫm phải bẫy của BĂNG CƯỚP trên đảo!`,
      );
      sendFilteredGameState(io, roomId, game, rooms);
      return;
    }

    let foundItem = null;
    if (targetCell.hasSecretCrate) {
      targetCell.hasSecretCrate = false;
      foundItem = getRandomItem();
      addGameLog(
        game,
        `📦 <b>${player.name}</b> khui hòm vô hình được: ${foundItem.name}`,
      );
    } else if (targetCell.item) {
      foundItem = targetCell.item;
      targetCell.item = null;
      addGameLog(
        game,
        `🔍 <b>${player.name}</b> nhặt mót được đồ rơi: ${foundItem.name}`,
      );
    }

    if (foundItem) {
      game.turnPhase = "looting";
      game.pendingLoot = foundItem;
    }

    if (game.stepsLeft === 0 && game.turnPhase === "moving") {
      game.turnPhase = "attacking";
    }

    sendFilteredGameState(io, roomId, game, rooms);
  });

  // --- 2. GIẢI QUYẾT BẪY CƯỚP ---
  socket.on(
    "action_resolve_robber",
    ({ roomId, choice, category, itemIndex }) => {
      const game = games[roomId];
      if (!game || game.turnPhase !== "robbed") return;

      const player = game.players[socket.id];
      if (socket.id !== game.turnOrder[game.currentTurnIndex]) return;

      if (choice === "hp") {
        player.hp -= 1;
        addGameLog(
          game,
          `🩸 <b>${player.name}</b> chọn mất 1 Máu để bảo toàn tài sản.`,
        );
        if (player.hp <= 0) {
          player.isChicken = true;
          player.hp = 0;
          addGameLog(
            game,
            `🐔 <b>${player.name}</b> đã gục ngã vì bị băng cướp hội đồng!`,
          );
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
      } else if (choice === "item") {
        if (
          category &&
          itemIndex !== undefined &&
          player.inventory[category][itemIndex]
        ) {
          const droppedItem = player.inventory[category][itemIndex];
          player.currentWeight -= droppedItem.weight;
          player.inventory[category].splice(itemIndex, 1);
          addGameLog(
            game,
            `🎒 <b>${player.name}</b> ngậm ngùi nộp <b>${droppedItem.name}</b> cho băng cướp.`,
          );
        }
      }

      if (player.isChicken) {
        do {
          if (game.smokes) {
            game.smokes.forEach((s) => s.duration--);
            game.smokes = game.smokes.filter((s) => s.duration > 0);
          }
          game.currentTurnIndex++;
          if (game.currentTurnIndex >= game.turnOrder.length) {
            game.currentTurnIndex = 0;
            game.currentRound++;
            addGameLog(
              game,
              `🌀 ====== BẮT ĐẦU VÒNG ${game.currentRound} ======`,
            );
            if ((game.currentRound - 1) % 3 === 0) {
              game.safeZone.xMin++;
              game.safeZone.xMax--;
              game.safeZone.yMin++;
              game.safeZone.yMax--;
            }
          }
        } while (game.players[game.turnOrder[game.currentTurnIndex]].isChicken);

        game.stepsLeft = calculateSteps(
          game.players[game.turnOrder[game.currentTurnIndex]],
        );
        game.turnPhase = "moving";
      } else {
        const targetCell = game.map[player.y][player.x];
        let foundItem = null;
        if (targetCell.item) {
          foundItem = targetCell.item;
          targetCell.item = null;
          addGameLog(
            game,
            `🔍 <b>${player.name}</b> nhặt mót được đồ rơi: ${foundItem.name}`,
          );
        }
        if (foundItem) {
          game.turnPhase = "looting";
          game.pendingLoot = foundItem;
        } else {
          game.turnPhase = game.stepsLeft > 0 ? "moving" : "attacking";
        }
      }
      sendFilteredGameState(io, roomId, game, rooms);
    },
  );

  // --- 3. NHẬN QUYẾT ĐỊNH: NHẶT ĐỒ ---
  socket.on("action_accept_loot", (roomId) => {
    const game = games[roomId];
    if (!game || game.turnPhase !== "looting") return;

    const player = game.players[socket.id];
    const item = game.pendingLoot;
    const SLOTS = { weapon: 2, support: 2, vehicle: 1 };
    const category =
      item.type === "weapon"
        ? "weapons"
        : item.type === "support"
          ? "supports"
          : "vehicles";

    if (
      player.inventory[category].length < SLOTS[item.type] &&
      player.currentWeight + item.weight <= getMaxWeight(player)
    ) {
      player.inventory[category].push(item);
      player.currentWeight += item.weight;
      addGameLog(
        game,
        `🎒 <b>${player.name}</b> đã bỏ <b>${item.name}</b> vào ba lô.`,
      );

      if (item.type === "vehicle" && item.bonusStep) {
        game.stepsLeft += item.bonusStep;
        addGameLog(
          game,
          `⚡ <b>${player.name}</b> lập tức được cộng thêm ${item.bonusStep} bước di chuyển nhờ ${item.name}!`,
        );
      }
      game.pendingLoot = null;
      game.turnPhase = game.stepsLeft > 0 ? "moving" : "attacking";
      sendFilteredGameState(io, roomId, game, rooms);
    }
  });

  // --- 4. NHẬN QUYẾT ĐỊNH: TRÁO ĐỒ ---
  socket.on("action_swap_loot", ({ roomId, itemIndex }) => {
    const game = games[roomId];
    if (!game || game.turnPhase !== "looting") return;

    const player = game.players[socket.id];
    const newItem = game.pendingLoot;
    const category =
      newItem.type === "weapon"
        ? "weapons"
        : newItem.type === "support"
          ? "supports"
          : "vehicles";
    const oldItem = player.inventory[category][itemIndex];
    if (!oldItem) return;

    let futureMaxWeight = player.maxWeight;
    player.inventory.supports.forEach((item, idx) => {
      if (category === "supports" && idx === itemIndex) return;
      futureMaxWeight += item.capacityBonus || 0;
    });
    if (category === "supports" && newItem.capacityBonus) {
      futureMaxWeight += newItem.capacityBonus;
    }

    if (
      player.currentWeight - oldItem.weight + newItem.weight <=
      futureMaxWeight
    ) {
      game.map[player.y][player.x].item = oldItem;
      addGameLog(
        game,
        `🔄 <b>${player.name}</b> vứt <b>${oldItem.name}</b> để lấy <b>${newItem.name}</b>.`,
      );

      player.inventory[category].splice(itemIndex, 1);
      player.inventory[category].push(newItem);
      player.currentWeight =
        player.currentWeight - oldItem.weight + newItem.weight;

      if (newItem.type === "vehicle") {
        const extraSteps = (newItem.bonusStep || 0) - (oldItem.bonusStep || 0);
        game.stepsLeft += extraSteps;
        if (game.stepsLeft < 0) game.stepsLeft = 0;
      }
      game.pendingLoot = null;
      game.turnPhase = game.stepsLeft > 0 ? "moving" : "attacking";
      sendFilteredGameState(io, roomId, game, rooms);
    }
  });

  // --- 5. NHẬN QUYẾT ĐỊNH: BỎ QUA ĐỒ ---
  socket.on("action_skip_loot", (roomId) => {
    const game = games[roomId];
    if (!game || game.turnPhase !== "looting") return;

    const player = game.players[socket.id];
    const item = game.pendingLoot;

    game.map[player.y][player.x].item = item;
    addGameLog(
      game,
      `❌ <b>${player.name}</b> chê <b>${item.name}</b> và vứt lại trên đất.`,
    );

    game.pendingLoot = null;
    game.turnPhase = game.stepsLeft > 0 ? "moving" : "attacking";
    sendFilteredGameState(io, roomId, game, rooms);
  });

  // --- 6. DỪNG DI CHUYỂN SỚM ---
  socket.on("action_stop_moving", (roomId) => {
    const game = games[roomId];
    if (game && socket.id === game.turnOrder[game.currentTurnIndex]) {
      game.turnPhase = "attacking";
      sendFilteredGameState(io, roomId, game, rooms);
    }
  });

  // --- 7. DÙNG ITEM HỖ TRỢ (Máu, Khói...) ---
  socket.on("action_use_item", ({ roomId, itemIndex }) => {
    const game = games[roomId];
    if (!game || game.turnPhase !== "moving") return;

    const player = game.players[socket.id];
    if (socket.id !== game.turnOrder[game.currentTurnIndex]) return;

    const item = player.inventory.supports[itemIndex];
    if (!item) return;

    if (item.heal) {
      let healAmount = item.heal;
      if (player.charId === "c8") healAmount += 1;
      const charData = CHARACTERS.find((c) => c.id === player.charId);
      const maxHP = charData ? charData.hp : 10;

      player.hp = Math.min(player.hp + healAmount, maxHP);
      addGameLog(
        game,
        `💖 <b>${player.name}</b> dùng <b>${item.name}</b> hồi ${healAmount} máu.`,
      );

      player.currentWeight -= item.weight;
      player.inventory.supports.splice(itemIndex, 1);
      sendFilteredGameState(io, roomId, game, rooms);
    } else if (item.effect === "smoke") {
      addGameLog(
        game,
        `💨 <b>${player.name}</b> ném Lựu Đạn Khói xuống chân! Một vùng mù mịt 3x3 xuất hiện.`,
      );

      let smokeCells = [];
      for (let yy = player.y - 1; yy <= player.y + 1; yy++) {
        for (let xx = player.x - 1; xx <= player.x + 1; xx++) {
          if (
            xx >= 0 &&
            xx < game.map[0].length &&
            yy >= 0 &&
            yy < game.map.length
          ) {
            smokeCells.push({ x: xx, y: yy });
          }
        }
      }

      if (!game.smokes) game.smokes = [];
      game.smokes.push({ cells: smokeCells, duration: game.turnOrder.length });

      io.to(roomId).emit("play_effect", {
        type: "bomb",
        path: [],
        impactX: player.x,
        impactY: player.y,
        affectedCells: smokeCells,
      });

      player.currentWeight -= item.weight;
      player.inventory.supports.splice(itemIndex, 1);
      sendFilteredGameState(io, roomId, game, rooms);
    }
  });
}

module.exports = handleActionEvents;
