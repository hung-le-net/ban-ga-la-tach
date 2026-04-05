import React from "react";

export default function Lobby({
  playerName,
  setPlayerName,
  roomId,
  setRoomId,
  onJoinRoom,
  onShowLore,
  onShowDashboard,
}) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "500px",
        backgroundColor: "#2c3036",
        padding: "40px 30px",
        borderRadius: "12px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
        border: "1px solid #4f545c",
        color: "white",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#f1c40f",
          textTransform: "uppercase",
          letterSpacing: "2px",
          marginTop: 0,
          marginBottom: "25px",
          textShadow: "0 2px 4px rgba(0,0,0,0.5)",
        }}
      >
        Bắn Gà Là Tạch
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "30px",
        }}
      >
        <button
          onClick={onShowLore}
          style={{
            flex: 1,
            padding: "10px",
            backgroundColor: "#e67e22",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "13px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
          }}
        >
          📖 Cốt Truyện
        </button>
        <button
          onClick={onShowDashboard}
          style={{
            flex: 1,
            padding: "10px",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "13px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
          }}
        >
          📚 Từ Điển
        </button>
      </div>

      <form
        onSubmit={onJoinRoom}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        <div>
          <label
            style={{ fontSize: "14px", fontWeight: "bold", color: "#bdc3c7" }}
          >
            TÊN ĐẶC NHIỆM:
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              boxSizing: "border-box",
              borderRadius: "6px",
              border: "1px solid #4f545c",
              backgroundColor: "#23272a",
              color: "white",
              outline: "none",
              fontSize: "16px",
            }}
          />
        </div>
        <div>
          <label
            style={{ fontSize: "14px", fontWeight: "bold", color: "#bdc3c7" }}
          >
            MÃ PHÒNG CHIẾN DỊCH:
          </label>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              boxSizing: "border-box",
              borderRadius: "6px",
              border: "1px solid #4f545c",
              backgroundColor: "#23272a",
              color: "white",
              outline: "none",
              fontSize: "16px",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "15px",
            backgroundColor: "#27ae60",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginTop: "10px",
            boxShadow: "0 4px 10px rgba(39, 174, 96, 0.4)",
          }}
        >
          Xông Pha ⚔️
        </button>
      </form>
    </div>
  );
}
