const { loadMapData } = require("../data/maps");
const { ITEMS } = require("../data/items");
const { CHARACTERS } = require("../data/characters");
const {
  addGameLog,
  sendFilteredGameState,
  calculateSteps,
} = require("../utils/gameHelpers");

function handleRoomEvents(io, socket, rooms, games) {
  // 1. NGƯỜI CHƠI VÀO PHÒNG
  socket.on("join_room", ({ roomId, playerName }) => {
    socket.join(roomId);
    if (!rooms[roomId]) rooms[roomId] = [];

    rooms[roomId].push({
      id: socket.id,
      name: playerName,
      hoveredCharId: null,
      isReady: false,
    });

    io.to(roomId).emit("room_updated", rooms[roomId]);
  });

  // 2. NGƯỜI CHƠI LƯỚT CHỌN TƯỚNG
  socket.on("hover_character", ({ roomId, charId }) => {
    const playersInRoom = rooms[roomId];
    if (!playersInRoom) return;

    const isTaken = playersInRoom.some(
      (p) => p.id !== socket.id && p.hoveredCharId === charId,
    );

    if (!isTaken) {
      const myPlayer = playersInRoom.find((p) => p.id === socket.id);
      if (myPlayer && !myPlayer.isReady) {
        myPlayer.hoveredCharId = charId;
        io.to(roomId).emit("room_updated", playersInRoom);
      }
    }
  });

  // 3. NGƯỜI CHƠI CHỐT TƯỚNG & KHỞI TẠO GAME NẾU TẤT CẢ SẴN SÀNG
  socket.on("ready_character", (roomId) => {
    const playersInRoom = rooms[roomId];
    if (!playersInRoom) return;

    const myPlayer = playersInRoom.find((p) => p.id === socket.id);
    if (myPlayer && myPlayer.hoveredCharId) {
      myPlayer.isReady = true;
      io.to(roomId).emit("room_updated", playersInRoom);

      const allReady = playersInRoom.every((p) => p.isReady === true);
      if (allReady && playersInRoom.length > 0) {
        console.log(`[Lobby] Phòng ${roomId} đã chốt. Bắt đầu Game!`);

        const mapKeys = ["map_snow", "map_jungle", "map_factory", "map_desert"];
        const mapNames = {
          map_snow: "Núi Tuyết Tử Thần",
          map_jungle: "Rừng Nhiệt Đới",
          map_factory: "Khu Công Nghiệp",
          map_desert: "Sa Mạc Hoang Vu",
        };
        const randomMapId = mapKeys[Math.floor(Math.random() * mapKeys.length)];

        games[roomId] = {
          map: loadMapData(randomMapId),
          mapName: mapNames[randomMapId],
          players: {},
          turnOrder: [],
          currentTurnIndex: 0,
          stepsLeft: 5,
          turnPhase: "moving",
          status: "playing",
          currentRound: 1,
          logs: [],
          smokes: [],
          safeZone: { xMin: 0, xMax: 14, yMin: 0, yMax: 14 },
        };

        const mapSize = games[roomId].map.length;
        games[roomId].safeZone.xMax = mapSize - 1;
        games[roomId].safeZone.yMax = mapSize - 1;

        const validCells = [];
        for (let y = 0; y < mapSize; y++) {
          for (let x = 0; x < mapSize; x++) {
            const cellType = games[roomId].map[y][x].type;
            if (["empty", "bush", "warehouse", "oasis"].includes(cellType)) {
              validCells.push(games[roomId].map[y][x]);
            }
          }
        }

        validCells.sort(() => Math.random() - 0.5);

        playersInRoom.forEach((p) => {
          games[roomId].turnOrder.push(p.id);
          const spawnCell = validCells.pop();
          const charData =
            CHARACTERS.find((c) => c.id === p.hoveredCharId) || CHARACTERS[0];

          games[roomId].players[p.id] = {
            id: p.id,
            name: p.name,
            charId: charData.id,
            charName: charData.name,
            hp: charData.hp,
            maxWeight: charData.maxWeight,
            isChicken: false,
            x: spawnCell.x,
            y: spawnCell.y,
            currentWeight: 0,
            inventory: { weapons: [], supports: [], vehicles: [] },
          };

          const newPlayer = games[roomId].players[p.id];
          if (newPlayer.charId === "c2") {
            const armor = ITEMS.find((i) => i.id === "sup_armor");
            newPlayer.inventory.supports.push({ ...armor });
            newPlayer.currentWeight += armor.weight;
          }
          if (newPlayer.charId === "c5") {
            const skate = ITEMS.find((i) => i.id === "veh_skate");
            newPlayer.inventory.vehicles.push({ ...skate });
            newPlayer.currentWeight += skate.weight;
          }

          if (newPlayer.charId === "c6") {
            // Lọc ra các vũ khí VÀ loại trừ cái Chảo ra (id: wpn_chao)
            const weapons = ITEMS.filter(
              (i) => i.type === "weapon" && i.id !== "wpn_chao",
            );
            const randomWpn =
              weapons[Math.floor(Math.random() * weapons.length)];
            newPlayer.inventory.weapons.push({ ...randomWpn });
            newPlayer.currentWeight += randomWpn.weight;
          }
        });

        const cratesToSpawn = Math.min(20, validCells.length);
        for (let i = 0; i < cratesToSpawn; i++) {
          validCells[i].hasSecretCrate = true;
        }

        const emptyForRobber = validCells.slice(cratesToSpawn);
        const robbersToSpawn = Math.min(5, emptyForRobber.length);
        for (let i = 0; i < robbersToSpawn; i++) {
          emptyForRobber[i].hasRobber = true;
        }

        games[roomId].turnOrder.sort(() => Math.random() - 0.5);

        const firstPlayerId = games[roomId].turnOrder[0];
        games[roomId].stepsLeft = calculateSteps(
          games[roomId].players[firstPlayerId],
        );

        addGameLog(
          games[roomId],
          `🚀 Trận đấu bắt đầu! Chúc các đặc nhiệm sống sót.`,
        );

        sendFilteredGameState(io, roomId, games[roomId], rooms);
      }
    }
  });

  // 4. RỜI PHÒNG
  socket.on("leave_room", (roomId) => {
    socket.leave(roomId);
    if (rooms[roomId]) {
      rooms[roomId] = rooms[roomId].filter((p) => p.id !== socket.id);
      io.to(roomId).emit("room_updated", rooms[roomId]);
    }
    if (rooms[roomId] && rooms[roomId].length === 0) {
      delete games[roomId];
    }
  });

  // 5. NGẮT KẾT NỐI (DISCONNECT)
  socket.on("disconnect", () => {
    // Logic xử lý khi người chơi đột ngột tắt trình duyệt có thể thêm ở đây sau
    console.log(`[-] Ngắt kết nối: ${socket.id}`);
  });
}

module.exports = handleRoomEvents;
