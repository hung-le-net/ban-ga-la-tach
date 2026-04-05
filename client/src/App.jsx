import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Import các Component con
import Board from "./components/Board";
import CharacterSelect from "./components/CharacterSelect";
import InfoDashboard from "./components/InfoDashboard";
import LoreModal from "./components/LoreModal";
import Lobby from "./components/Lobby";

const socket = io("http://192.168.1.5:3000");

function App() {
  // Trạng thái (State)
  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [inRoom, setInRoom] = useState(false);
  const [players, setPlayers] = useState([]);
  const [gameState, setGameState] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showLore, setShowLore] = useState(false);

  // Lắng nghe Socket
  useEffect(() => {
    socket.on("room_updated", (playerList) => setPlayers(playerList));
    socket.on("game_updated", (updatedGameState) =>
      setGameState(updatedGameState),
    );

    return () => {
      socket.off("room_updated");
      socket.off("game_updated");
    };
  }, []);

  // Hành động (Actions)
  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (playerName.trim() && roomId.trim()) {
      socket.emit("join_room", { roomId, playerName });
      setInRoom(true);
    }
  };

  const handleLeaveRoom = () => {
    socket.emit("leave_room", roomId);
    setInRoom(false);
    setGameState(null);
    setRoomId("");
  };

  // --- RENDERING TÙY THEO TRẠNG THÁI ---

  // 1. Đang trong trận đấu
  if (gameState) {
    return (
      <Board
        gameState={gameState}
        myId={socket.id}
        socket={socket}
        roomId={roomId}
        onLeaveRoom={handleLeaveRoom}
      />
    );
  }

  // 2. Màn hình chờ (Đăng nhập / Chọn tướng)
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#1e2124",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        boxSizing: "border-box",
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      }}
    >
      {!inRoom ? (
        <Lobby
          playerName={playerName}
          setPlayerName={setPlayerName}
          roomId={roomId}
          setRoomId={setRoomId}
          onJoinRoom={handleJoinRoom}
          onShowLore={() => setShowLore(true)}
          onShowDashboard={() => setShowDashboard(true)}
        />
      ) : (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "1000px",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginBottom: "15px",
            }}
          >
            <button
              onClick={() => setShowLore(true)}
              style={{
                padding: "8px 15px",
                backgroundColor: "#e67e22",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "13px",
              }}
            >
              📖 Cốt Truyện
            </button>
            <button
              onClick={() => setShowDashboard(true)}
              style={{
                padding: "8px 15px",
                backgroundColor: "#3498db",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "13px",
              }}
            >
              📚 Từ Điển
            </button>
          </div>
          <CharacterSelect
            socket={socket}
            roomId={roomId}
            myId={socket.id}
            playersInRoom={players}
          />
        </div>
      )}

      {/* Hiển thị Popup tĩnh khi được gọi */}
      {showDashboard && (
        <InfoDashboard onClose={() => setShowDashboard(false)} />
      )}
      {showLore && <LoreModal onClose={() => setShowLore(false)} />}
    </div>
  );
}

export default App;
