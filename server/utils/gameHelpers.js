// 1. Ghi log sự kiện
function addGameLog(game, msg) {
  if (!game) return;
  if (!game.logs) game.logs = [];

  const time = new Date().toLocaleTimeString("vi-VN", { hour12: false });
  game.logs.push({ time, msg });

  if (game.logs.length > 50) game.logs.shift();
  console.log(`[Log] ${msg}`);
}

// 2. Gửi dữ liệu game đã được che giấu tầm nhìn
function sendFilteredGameState(io, roomId, game, rooms) {
  const playersInRoom = rooms[roomId];
  if (!playersInRoom) return;

  // =====================================
  // --- TÍNH TOÁN GAME OVER TỪ SERVER ---
  // =====================================
  const fullPlayersList = Object.values(game.players);
  const alivePlayers = fullPlayersList.filter((p) => !p.isChicken);
  const totalPlayers = fullPlayersList.length;

  let isGameOver = false;
  let winner = null;

  // Tính Game Over dựa trên TẤT CẢ người chơi trong dữ liệu gốc
  if (totalPlayers > 1 && alivePlayers.length <= 1) {
    isGameOver = true;
    winner = alivePlayers.length === 1 ? alivePlayers[0] : null;
  } else if (totalPlayers === 1 && alivePlayers.length === 0) {
    isGameOver = true;
  }

  // Cập nhật trạng thái
  if (isGameOver) {
    game.status = "game_over";
    game.winner = winner;
  }

  playersInRoom.forEach((roomPlayer) => {
    const socketId = roomPlayer.id;
    const myPlayer = game.players[socketId];

    const customizedGame = { ...game, players: {} };

    if (myPlayer) {
      const myCellType = game.map[myPlayer.y][myPlayer.x].type;
      const isMeInSmoke =
        game.smokes &&
        game.smokes.some((smoke) =>
          smoke.cells.some((c) => c.x === myPlayer.x && c.y === myPlayer.y),
        );

      Object.values(game.players).forEach((otherPlayer) => {
        let canSee = false;

        // --- Lật bài ngửa (Thấy toàn map) khi Game Over ---
        if (isGameOver || myPlayer.isChicken) {
          canSee = true;
        } else if (isMeInSmoke) {
          canSee = otherPlayer.id === myPlayer.id;
        } else if (myCellType === "warehouse") {
          const otherCellType = game.map[otherPlayer.y][otherPlayer.x].type;
          const dx = Math.abs(myPlayer.x - otherPlayer.x);
          const dy = Math.abs(myPlayer.y - otherPlayer.y);
          canSee = otherCellType === "warehouse" && dx <= 2 && dy <= 2;
        } else {
          const dx = Math.abs(myPlayer.x - otherPlayer.x);
          const dy = Math.abs(myPlayer.y - otherPlayer.y);
          let visionRange = myPlayer.charId === "c7" ? 3 : 2;

          const hasBinocular = myPlayer.inventory.supports.some(
            (item) => item.visionBonus,
          );
          if (hasBinocular) visionRange += 1;

          canSee = dx <= visionRange && dy <= visionRange;

          const otherCellType = game.map[otherPlayer.y][otherPlayer.x].type;
          if (otherCellType === "bush" && otherPlayer.id !== myPlayer.id) {
            if (dx > 1 || dy > 1) {
              canSee = false;
            }
          }
        }

        if (canSee) {
          customizedGame.players[otherPlayer.id] = otherPlayer;
        }
      });
    } else {
      customizedGame.players = game.players;
    }

    io.to(socketId).emit("game_updated", customizedGame);
  });
}

// 3. Tính toán số bước di chuyển
function calculateSteps(player) {
  if (!player) return 0;
  let steps = player.charId === "c4" ? 6 : 5;
  if (player.inventory.vehicles.length > 0) {
    steps += player.inventory.vehicles[0].bonusStep || 0;
  }
  return steps;
}

// 4. Tính toán sức chứa balo
function getMaxWeight(player) {
  let bonus = 0;
  player.inventory.supports.forEach((item) => {
    if (item.capacityBonus) bonus += item.capacityBonus;
  });
  return player.maxWeight + bonus;
}

module.exports = {
  addGameLog,
  sendFilteredGameState,
  calculateSteps,
  getMaxWeight,
};
