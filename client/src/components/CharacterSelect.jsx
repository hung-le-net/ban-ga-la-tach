import React, { useEffect, useState } from "react";

// Đường dẫn trỏ tới thư mục chứa ảnh avatar nhân vật
const ASSETS_URL = "http://localhost:3000/assets/characters";

// Đã đồng bộ dữ liệu mới nhất và thay icon bằng avatar
const CHARACTERS = [
  {
    id: "c1",
    name: "Tuấn Tập Tạ",
    hp: 10,
    maxWeight: 9,
    avatar: `${ASSETS_URL}/tuan.png`,
    color: "#e82a15",
    skill: "Chảo Ngàn Cân: Sát thương Chảo mặc định là 2.",
    quote: "Đi nhẹ, nói khẽ, cười duyên... và đánh u đầu bằng chảo thép!",
  },
  {
    id: "c2",
    name: "Hải Hầm Hố",
    hp: 9,
    maxWeight: 8,

    avatar: `${ASSETS_URL}/hai.png`,
    color: "#f58516",
    skill: "Mặc Áo Phao: Khởi đầu game luôn có sẵn 1 Áo Giáp.",
    quote:
      "Áo phao anh mặc sẵn rồi, mấy đứa cứ bơi hết vào đây! Khum sợ mưa rơi!",
  },
  {
    id: "c3",
    name: "Cường Cục Súc",
    hp: 8,
    maxWeight: 8,

    avatar: `${ASSETS_URL}/cuong.png`,
    color: "#9e330c",
    skill: "Liều Mạng: Khi HP từ 4 trở xuống, mọi đòn đánh được +1 ST.",
    quote:
      "Sắp hết máu mới là lúc anh múa. Đừng thấy anh đỏ mà tưởng anh chín nha!",
  },
  {
    id: "c4",
    name: "Linh Lỉnh Kỉnh",
    hp: 5,
    maxWeight: 10,

    avatar: `${ASSETS_URL}/linh.png`,
    color: "#27ae60",
    skill: "Chạy Bộ Nhanh: Mỗi lượt có tới 6 bước di chuyển.",
    quote:
      "Riêng khoản chạy bo thì chị đây number one. Đố ai bắt được chị đấy!",
  },
  {
    id: "c5",
    name: "Tài Tốc Độ",
    hp: 7,
    maxWeight: 8,

    avatar: `${ASSETS_URL}/tai.png`,
    color: "#2980b9",
    skill: "Chuẩn Bị Kỹ: Khởi đầu game luôn có sẵn 1 Ván Trượt.",
    quote: "Đường đua này là của anh! Á á á... vấp cục đá, từ từ mấy má ơi!",
  },
  {
    id: "c6",
    name: "Phát Phong Thủy",
    hp: 7,
    maxWeight: 7,

    avatar: `${ASSETS_URL}/phat.png`,
    color: "#f3d912",
    skill: "Trúng Số: Khởi đầu game được phát ngẫu nhiên 1 Vũ khí.",
    quote:
      "Hôm nay anh soi tử vi rồi, kiểu gì cũng sẽ nhặt được của ngon vật lạ. Tin anh đi!",
  },
  {
    id: "c7",
    name: "Tiến Tinh Tường",
    hp: 6,
    maxWeight: 7,

    avatar: `${ASSETS_URL}/tien.png`,
    color: "#60b6ef",
    skill: "Mắt Cú Vọ: Bán kính tầm nhìn rộng 3 ô.",
    quote:
      "Trốn kỹ vào mấy bé, đôi mắt diều hâu của anh thấy hết gót chân rồi kìa!",
  },
  {
    id: "c8",
    name: "Lan Lành Lặn",
    hp: 8,
    maxWeight: 7,

    avatar: `${ASSETS_URL}/lan.png`,
    color: "#31ea7e",
    skill: "Bàn Tay Vàng: Dùng vật phẩm y tế luôn được hồi thêm +1 HP.",
    quote:
      "Bắn nhau sứt đầu mẻ trán rốt cuộc cũng kêu chị. Đứng im đấy chị dán Urgo cho!",
  },
  {
    id: "c9",
    name: "Trí Trốn Tìm",
    hp: 5,
    maxWeight: 8,

    avatar: `${ASSETS_URL}/tri.png`,
    color: "#a355c4",
    skill: "Bậc Thầy Núp Lùm: Đứng trong bụi cây sẽ né được đạn bắn xa.",
    quote:
      "Hehe xài thuật ẩn thân của ninja quá đã. Đố biết tôi đang ở đâu đấy!",
  },
  {
    id: "c10",
    name: "Thảo Thó Đồ",
    hp: 6,
    maxWeight: 9,

    avatar: `${ASSETS_URL}/thao.png`,
    color: "#ff91d7",
    skill: "Bàn Tay Hư Hỏng: Đánh cận chiến có 50% trộm đồ nạn nhân.",
    quote:
      "Cây súng này đẹp dã man, cho mượn xài tí nha! Đừng có đòi, đòi là block bo xì á!",
  },
];

export default function CharacterSelect({
  socket,
  roomId,
  myId,
  playersInRoom,
}) {
  const myPlayer = playersInRoom.find((p) => p.id === myId);
  const myHoveredCharId = myPlayer?.hoveredCharId;
  const isMyReady = myPlayer?.isReady;

  const hoveredChar =
    CHARACTERS.find((c) => c.id === myHoveredCharId) || CHARACTERS[0];

  const lockedChars = {};
  playersInRoom.forEach((p) => {
    if (p.hoveredCharId && p.id !== myId) {
      lockedChars[p.hoveredCharId] = { lockedBy: p.id, lockedByName: p.name };
    }
  });

  const handleSelect = (charId) => {
    if (!isMyReady && !lockedChars[charId]) {
      socket.emit("hover_character", { roomId, charId });
    }
  };

  const handleReady = () => {
    if (myHoveredCharId && !isMyReady) {
      socket.emit("ready_character", roomId);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "90vh",
        width: "100%",
        maxWidth: "1000px",
        margin: "0 auto",
        backgroundColor: "#fff",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        fontFamily: "sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          padding: "20px",
          backgroundColor: "#2c3e50",
          color: "white",
          textAlign: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>CHỌN ĐẶC NHIỆM TÁC CHIẾN</h2>
        <p style={{ margin: "5px 0 0 0", color: "#bdc3c7" }}>
          Phòng: {roomId} | Sẵn sàng:{" "}
          {playersInRoom.filter((p) => p.isReady).length}/{playersInRoom.length}
        </p>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* CỘT TRÁI: DANH SÁCH */}
        <div
          style={{
            flex: "6",
            padding: "20px",
            backgroundColor: "#ecf0f1",
            overflowY: "auto",
            borderRight: "2px solid #bdc3c7",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: "14px",
            }}
          >
            {CHARACTERS.map((char) => {
              const isLockedByOther = !!lockedChars[char.id];
              const isSelectedByMe = myHoveredCharId === char.id;

              return (
                <div
                  key={char.id}
                  onClick={() => handleSelect(char.id)}
                  style={{
                    backgroundColor: isLockedByOther ? "#bdc3c7" : "#fff",
                    border: isSelectedByMe
                      ? `3px solid ${char.color}`
                      : "3px solid transparent",
                    borderRadius: "10px",
                    padding: "15px 10px",
                    textAlign: "center",
                    cursor:
                      isLockedByOther || isMyReady ? "not-allowed" : "pointer",
                    opacity: isLockedByOther ? 0.6 : 1,
                    boxShadow: isSelectedByMe
                      ? `0 0 15px ${char.color}66`
                      : "0 4px 6px rgba(0,0,0,0.1)",
                    position: "relative",
                    transition: "all 0.2s",
                  }}
                >
                  {/* HIỂN THỊ AVATAR TRÊN DANH SÁCH */}
                  <div
                    style={{
                      width: "95px",
                      height: "95px",
                      margin: "0 auto 10px auto",
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: `2px solid ${char.color}88`,
                      backgroundColor: char.color + "22",
                    }}
                  >
                    <img
                      src={char.avatar}
                      alt={char.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  <strong
                    style={{
                      display: "block",
                      color: "#2c3e50",
                      fontSize: "14px",
                    }}
                  >
                    {char.name}
                  </strong>
              

                  {isLockedByOther && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: "rgba(231, 76, 60, 0.9)",
                        color: "white",
                        fontSize: "11px",
                        padding: "4px",
                        borderBottomLeftRadius: "7px",
                        borderBottomRightRadius: "7px",
                      }}
                    >
                      🔒 {lockedChars[char.id].lockedByName}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CỘT PHẢI: CHI TIẾT */}
        <div
          style={{
            flex: "4",
            padding: "30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#fff",
          }}
        >
          <div>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              {/* HIỂN THỊ AVATAR LỚN */}
              <div
                style={{
                  width: "200px",
                  height: "200px",
                  margin: "0 auto",
                  backgroundColor: hoveredChar.color + "33",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: `4px solid ${hoveredChar.color}`,
                  boxShadow: `0 10px 20px ${hoveredChar.color}44`,
                }}
              >
                <img
                  src={hoveredChar.avatar}
                  alt={hoveredChar.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <h2
                style={{
                  margin: "15px 0 5px 0",
                  color: "#2c3e50",
                  fontSize: "28px",
                }}
              >
                {hoveredChar.name}
              </h2>
              

              {/* --- THÊM KHUNG QUOTE (BONG BÓNG CHAT) VÀO ĐÂY --- */}
              <div
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  backgroundColor: "#f1f2f6",
                  borderRadius: "12px",
                  fontStyle: "italic",
                  color: "#57606f",
                  fontSize: "15px",
                  borderLeft: `4px solid ${hoveredChar.color}`,
                  boxShadow: "inset 0 0 10px rgba(0,0,0,0.05)",
                }}
              >
                "{hoveredChar.quote}"
              </div>
              {/* ----------------------------------------------- */}
            </div>

            {/* BẢNG CHỈ SỐ VÀ KỸ NĂNG Ở DƯỚI GIỮ NGUYÊN */}
            <div
              style={{
                backgroundColor: "#f9f9f9",
                padding: "20px",
                borderRadius: "10px",
                border: "1px solid #eee",
              }}
            >
              <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                ❤️ Máu khởi điểm:{" "}
                <span style={{ color: "#e74c3c" }}>{hoveredChar.hp} HP</span>
              </p>

              <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                🎒 Sức chứa ba lô:{" "}
                <span style={{ color: "#5098f5" }}>
                  {hoveredChar.maxWeight} HP
                </span>
              </p>
              <h3
                style={{
                  marginTop: "20px",
                  borderBottom: "2px solid #ddd",
                  paddingBottom: "10px",
                  color: hoveredChar.color,
                }}
              >
                🌟 Kỹ năng đặc biệt
              </h3>
              <p
                style={{
                  fontSize: "16px",
                  lineHeight: "1.5",
                  color: "#34495e",
                }}
              >
                {hoveredChar.skill}
              </p>
            </div>
          </div>

          <button
            onClick={handleReady}
            disabled={isMyReady || !myHoveredCharId}
            style={{
              padding: "20px",
              width: "100%",
              fontSize: "18px",
              fontWeight: "bold",
              borderRadius: "10px",
              backgroundColor: isMyReady ? "#95a5a6" : "#27ae60",
              color: "white",
              border: "none",
              cursor: isMyReady || !myHoveredCharId ? "not-allowed" : "pointer",
              boxShadow: isMyReady
                ? "none"
                : "0 5px 15px rgba(39, 174, 96, 0.4)",
            }}
          >
            {isMyReady ? "ĐÃ SẴN SÀNG ✅" : "CHỐT NHÂN VẬT & SẴN SÀNG ⚔️"}
          </button>
        </div>
      </div>
    </div>
  );
}
