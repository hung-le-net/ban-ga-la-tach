const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

// IMPORT CÁC HANDLERS ĐÃ TÁCH
const handleRoomEvents = require("./handlers/roomHandler");
const handleActionEvents = require("./handlers/actionHandler");
const handleCombatEvents = require("./handlers/combatHandler");

const app = express();
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "../assets")));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

// Biến lưu trữ Toàn cục (Global State)
const rooms = {};
const games = {};

io.on("connection", (socket) => {
  console.log(`[+] Kết nối: ${socket.id}`);

  // Gọi các luồng xử lý riêng biệt
  handleRoomEvents(io, socket, rooms, games);
  handleActionEvents(io, socket, rooms, games);
  handleCombatEvents(io, socket, rooms, games);
});

server.listen(3000, () =>
  console.log(`🚀 Server chạy tại http://localhost:3000`),
);
