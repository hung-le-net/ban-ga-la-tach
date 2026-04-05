// client/src/components/InfoDashboard.jsx
import React, { useState } from "react";
const ASSETS_URL = "http://localhost:3000/assets";
// --- DỮ LIỆU ĐÃ ĐỒNG BỘ TỪ SERVER ---
const DB_CHARACTERS = [
  {
    id: "c1",
    name: "Tuấn Tập Tạ",
    hp: 10,
    maxWeight: 9,
    icon: "🏋️‍♂️",
    color: "#e82a15",
    skill: "Chảo Ngàn Cân",
    skillDesc: "Sát thương Chảo mặc định là 2 (thay vì 1).",
  },
  {
    id: "c2",
    name: "Hải Hầm Hố",
    hp: 9,
    maxWeight: 8,
    icon: "🦏",
    color: "#f58516",
    skill: "Mặc Áo Phao",
    skillDesc: "Khởi đầu game luôn có sẵn 1 Áo Giáp.",
  },
  {
    id: "c3",
    name: "Cường Cục Súc",
    hp: 8,
    maxWeight: 8,
    icon: "💢",
    color: "#9e330c",
    skill: "Liều Mạng",
    skillDesc: "Khi HP từ 4 trở xuống, mọi đòn đánh được +1 Sát thương.",
  },

  // --- NHÓM CƠ ĐỘNG & NHẶT MÓT ---
  {
    id: "c4",
    name: "Linh Lỉnh Kỉnh",
    hp: 5,
    maxWeight: 10,
    icon: "🎒",
    color: "#27ae60",
    skill: "Chạy Bộ Nhanh",
    skillDesc: "Mỗi lượt có tới 6 bước di chuyển (thay vì 5).",
  },
  {
    id: "c5",
    name: "Tài Tốc Độ",
    hp: 7,
    maxWeight: 8,
    icon: "🛹",
    color: "#2980b9",
    skill: "Chuẩn Bị Kỹ",
    skillDesc: "Khởi đầu game luôn có sẵn 1 Ván Trượt.",
  },
  {
    id: "c6",
    name: "Phát Phong Thủy",
    hp: 7,
    maxWeight: 7,
    icon: "🎲",
    color: "#f3d912",
    skill: "Trúng Số",
    skillDesc: "Khởi đầu game được hệ thống phát ngẫu nhiên 1 Vũ khí.",
  },

  // --- NHÓM CHIẾN THUẬT & TRÍ TUỆ ---
  {
    id: "c7",
    name: "Tiến Tinh Tường",
    hp: 6,
    maxWeight: 7,
    icon: "🦅",
    color: "#60b6ef",
    skill: "Mắt Cú Vọ",
    skillDesc: "Bán kính tầm nhìn rộng 3 ô (hơn người thường 1 ô).",
  },
  {
    id: "c8",
    name: "Lan Lành Lặn",
    hp: 8,
    maxWeight: 7,
    icon: "⛑️",
    color: "#31ea7e",
    skill: "Bàn Tay Vàng",
    skillDesc: "Dùng vật phẩm y tế luôn được hồi thêm +1 HP.",
  },
  {
    id: "c9",
    name: "Trí Trốn Tìm",
    hp: 5,
    maxWeight: 8,
    icon: "🥷",
    color: "#a355c4",
    skill: "Bậc Thầy Núp Lùm",
    skillDesc: "Đứng trong bụi cây sẽ né được 100% đạn bắn xa.",
  },
  {
    id: "c10",
    name: "Thảo Thó Đồ",
    hp: 6,
    maxWeight: 9,
    icon: "🧤",
    color: "#ff91d7",
    skill: "Bàn Tay Hư Hỏng",
    skillDesc: "Tấn công cận chiến có 50% tỉ lệ trộm 1 món đồ của nạn nhân.",
  },
];

const DB_WEAPONS = [
  {
    name: "Chảo",
    subType: "Cận Chiến",
    weight: 0,
    damage: 1,
    range: 1,
    desc: "Vũ khí mặc định. Có thể chiên trứng.",
    icon: `${ASSETS_URL}/weapons/frying-pan.png`,
  },
  {
    name: "Tông Lào",
    subType: "Cận Chiến",
    weight: 1,
    damage: 2,
    range: 1,
    desc: "Vừa nhẹ vừa thấm.",
    icon: `${ASSETS_URL}/weapons/flip-flops.png`,
  },
  {
    name: "Điếu Cày",
    subType: "Cận Chiến",
    weight: 2,
    damage: 3,
    range: 1,
    desc: "Không chỉ để rít. Phang cực đau.",
    icon: `${ASSETS_URL}/weapons/man.png`,
  },
  {
    name: "Súng Nước",
    subType: "Súng",
    weight: 1,
    damage: 2,
    range: 2,
    desc: "Bắn gần, nhẹ gọn. Bị chặn bởi đá.",
    icon: `${ASSETS_URL}/weapons/water-gun.png`,
  },
  {
    name: "Súng Hoa Cải",
    subType: "Súng",
    weight: 2,
    damage: 3,
    range: 2,
    desc: "Sát thương cao ở cự ly gần.",
    icon: `${ASSETS_URL}/weapons/shotgun.png`,
  },
  {
    name: "AK-47",
    subType: "Súng",
    weight: 2,
    damage: 2,
    range: 3,
    desc: "Cân bằng giữa tầm bắn và sát thương.",
    icon: `${ASSETS_URL}/weapons/ak-47.png`,
  },
  {
    name: "Súng Ngắm",
    subType: "Súng",
    weight: 3,
    damage: 4,
    range: 4,
    desc: "Bắn tỉa từ xa, cực nặng.",
    icon: `${ASSETS_URL}/weapons/sniper.png`,
  },
  {
    name: "Bazooka",
    subType: "Súng",
    weight: 3,
    damage: 3,
    range: 3,
    desc: "Nổ lan hình chữ thập (+). Bị chặn bởi đá.",
    icon: `${ASSETS_URL}/weapons/bazooka.png`,
  },
  {
    name: "Lựu Đạn Nổ",
    subType: "Bom",
    weight: 1,
    damage: 2,
    range: 3,
    desc: "Ném vượt địa hình. Dùng 1 lần là mất.",
    icon: `${ASSETS_URL}/weapons/grenade.png`,
  },

  {
    name: "Bom Đại",
    subType: "Bom",
    weight: 3,
    damage: 3,
    range: 3,
    desc: "Sức công phá lớn. Nổ diện rộng 3x3.",
    icon: `${ASSETS_URL}/weapons/bomb.png`,
  },
];

const DB_SUPPORTS = [
  {
    name: "Băng Gạc",
    weight: 1,
    effect: "Hồi 1 HP",
    desc: "Sơ cứu vết thương nhẹ.",
    icon: `${ASSETS_URL}/supports/band-aid.png`,
  },
  {
    name: "Hộp Cứu Thương",
    weight: 2,
    effect: "Hồi 3 HP",
    desc: "Đầy máu nhanh chóng.",
    icon: `${ASSETS_URL}/supports/medkit.png`,
  },
  {
    name: "Lựu Đạn Khói",
    weight: 1,
    effect: "Tạo Khói",
    desc: "Tạo sương mù để tẩu thoát.",
    icon: `${ASSETS_URL}/supports/smoke-bomb.png`,
  },
  {
    name: "Mũ Cối",
    weight: 1,
    effect: "Đỡ 1 ST",
    desc: "Giảm 1 sát thương nhận vào (Hỏng khi hết độ bền).",
    icon: `${ASSETS_URL}/supports/military-hat.png`,
  },
  {
    name: "Áo Giáp",
    weight: 2,
    effect: "Đỡ 2 ST",
    desc: "Bắn vô đạn văng tứ tung.",
    icon: `${ASSETS_URL}/supports/bulletproof-vest.png`,
  },
  {
    name: "Ống Nhòm",
    weight: 2,
    effect: "+1 Tầm",
    desc: "Mở rộng tầm nhìn thêm 1 ô.",
    icon: `${ASSETS_URL}/supports/binoculars.png`,
  },
  {
    name: "Túi Đeo Chéo",
    weight: 1,
    effect: "+3 Sức chứa",
    desc: "Nâng cấp sức chứa tối đa của ba lô thêm 3kg.",
    icon: `${ASSETS_URL}/supports/crossbody-bag.png`,
  },
];

const DB_VEHICLES = [
  {
    name: "Ván Trượt",
    weight: 1,
    effect: "+1 Bước",
    desc: "Cộng 1 bước di chuyển mỗi lượt.",
    icon: `${ASSETS_URL}/vehicles/skateboard.png`,
  },
  {
    name: "Xe Máy",
    weight: 3,
    effect: "+2 Bước",
    desc: "Lướt nhẹ như bay.",
    icon: `${ASSETS_URL}/vehicles/scooter.png`,
  },
  {
    name: "Ô Tô",
    weight: 5,
    effect: "+2 Bước",
    desc: "Có thể lội qua sông nước nhưng tốn rất nhiều chỗ.",
    icon: `${ASSETS_URL}/vehicles/military-jeep.png`,
  },
];

export default function InfoDashboard({ onClose }) {
  const [activeTab, setActiveTab] = useState("characters");

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(10, 10, 10, 0.85)",
        backdropFilter: "blur(4px)",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      }}
    >
      <div
        style={{
          backgroundColor: "#1e2124",
          width: "95%",
          maxWidth: "900px",
          height: "95%",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid #42464d",
          boxShadow: "0 0 30px rgba(0,0,0,0.8)",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "15px 20px",
            backgroundColor: "#17191c",
            borderBottom: "2px solid #e67e22",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#f1c40f",
              textTransform: "uppercase",
              letterSpacing: "2px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            📚 TỪ ĐIỂN TÁC CHIẾN
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "#e74c3c",
              color: "white",
              border: "none",
              padding: "8px 20px",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              textTransform: "uppercase",
              boxShadow: "0 2px 5px rgba(231, 76, 60, 0.4)",
            }}
          >
            Đóng [Esc]
          </button>
        </div>

        {/* TABS CỰC CHIẾN */}
        <div style={{ display: "flex", backgroundColor: "#23272a" }}>
          <TabButton
            label="Nhân Vật"
            icon="👤"
            isActive={activeTab === "characters"}
            onClick={() => setActiveTab("characters")}
          />
          <TabButton
            label="Vũ Khí"
            icon="🔫"
            isActive={activeTab === "weapons"}
            onClick={() => setActiveTab("weapons")}
          />
          <TabButton
            label="Hỗ Trợ"
            icon="💊"
            isActive={activeTab === "supports"}
            onClick={() => setActiveTab("supports")}
          />
          <TabButton
            label="Phương Tiện"
            icon="🛹"
            isActive={activeTab === "vehicles"}
            onClick={() => setActiveTab("vehicles")}
          />
        </div>

        {/* KHU VỰC NỘI DUNG MÀU TỐI */}
        <div
          style={{
            padding: "20px",
            overflowY: "auto",
            flex: 1,
            backgroundColor: "#2c2f33",
            color: "#dcddde",
          }}
        >
          {/* TAB NHÂN VẬT */}
          {activeTab === "characters" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "20px",
              }}
            >
              {DB_CHARACTERS.map((char, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: "#202225",
                    border: `1px solid ${char.color}55`,
                    borderRadius: "8px",
                    overflow: "hidden",
                    transition: "transform 0.2s",
                    cursor: "default",
                  }}
                >
                  {/* Băng rôn tên & Icon */}
                  <div
                    style={{
                      padding: "10px 15px",
                      backgroundColor: char.color + "22",
                      borderBottom: `2px solid ${char.color}`,
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span style={{ fontSize: "30px" }}>{char.icon}</span>
                    <h3 style={{ margin: 0, color: "#fff", fontSize: "18px" }}>
                      {char.name}
                    </h3>
                  </div>
                  <div style={{ padding: "15px" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "5px",
                        marginBottom: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      <Badge bg="#e74c3c" text={`HP: ${char.hp}`} icon="❤️" />
                      <Badge
                        bg="#f39c12"
                        text={`Ba lô: ${char.maxWeight}kg`}
                        icon="🎒"
                      />
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "14px",
                        lineHeight: "1.5",
                        color: "#b9bbbe",
                      }}
                    >
                      <strong style={{ color: char.color }}>
                        {char.skill}
                      </strong>{" "}
                      {char.skillDesc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB VŨ KHÍ */}
          {activeTab === "weapons" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "10px 15px",
              }}
            >
              {DB_WEAPONS.map((wpn, i) => {
                const isGun = wpn.subType.includes("Súng");
                const isBomb = wpn.subType.includes("Bom");
                const isMelee = wpn.subType.includes("Cận Chiến");

                return (
                  <div
                    key={i}
                    style={{
                      backgroundColor: "#202225",
                      padding: "15px",
                      borderRadius: "8px",
                      borderLeft: "4px solid #e74c3c",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <strong
                        style={{
                          fontSize: "18px",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {/* HIỂN THỊ HÌNH ẢNH THAY VÌ EMOJI */}
                        {wpn.icon && (
                          <img
                            src={wpn.icon}
                            alt={wpn.name}
                            style={{
                              width: "30px",
                              height: "30px",
                              objectFit: "contain",
                            }}
                          />
                        )}
                        {wpn.name}
                      </strong>
                      <span
                        style={{
                          fontSize: "12px",
                          padding: "3px 8px",
                          borderRadius: "4px",
                          backgroundColor: "#36393f",
                          color: "#a3a6aa",
                          border: "1px solid #4f545c",
                        }}
                      >
                        {wpn.weight} kg
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "10px",
                      }}
                    >
                      <Badge bg="#c0392b" text={`ST: ${wpn.damage}`} />
                      <Badge bg="#2980b9" text={`Tầm: ${wpn.range} ô`} />
                      <Badge
                        bg={isBomb ? "#f39c12" : isGun ? "#079f07":"#7f8c8d"}
                        text={wpn.subType}
                      />
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        color: "#99aab5",
                        fontStyle: "italic",
                      }}
                    >
                      {wpn.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB HỖ TRỢ */}
          {activeTab === "supports" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "10px 15px",
              }}
            >
              {DB_SUPPORTS.map((sup, i) => {
                const isSmoke = sup.name.includes("Lựu Đạn Khói");

                return (
                  <div
                    key={i}
                    style={{
                      backgroundColor: "#202225",
                      padding: "15px",
                      borderRadius: "8px",
                      borderLeft: "4px solid #2ecc71",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <strong
                        style={{
                          fontSize: "18px",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {/* Đã sửa biến wpn thành sup */}
                        {sup.icon && (
                          <img
                            src={sup.icon}
                            alt={sup.name}
                            style={{
                              width: "30px",
                              height: "30px",
                              objectFit: "contain",
                            }}
                          />
                        )}
                        {sup.name}
                      </strong>
                      <span
                        style={{
                          fontSize: "12px",
                          padding: "3px 8px",
                          borderRadius: "4px",
                          backgroundColor: "#36393f",
                          color: "#a3a6aa",
                          border: "1px solid #4f545c",
                        }}
                      >
                        {sup.weight} kg
                      </span>
                    </div>
                    <Badge
                      bg={isSmoke ? "#7ff7e7" : "#27ae60"}
                      text={sup.effect}
                    />
                    <p
                      style={{
                        margin: "10px 0 0 0",
                        fontSize: "13px",
                        color: "#99aab5",
                      }}
                    >
                      {sup.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB PHƯƠNG TIỆN */}
          {activeTab === "vehicles" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "10px 15px",
              }}
            >
              {DB_VEHICLES.map((veh, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: "#202225",
                    padding: "15px",
                    borderRadius: "8px",
                    borderLeft: "4px solid #f1c40f",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <strong
                      style={{
                        fontSize: "18px",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {/* Đã sửa biến wpn thành veh */}
                      {veh.icon && (
                        <img
                          src={veh.icon}
                          alt={veh.name}
                          style={{
                            width: "30px",
                            height: "30px",
                            objectFit: "contain",
                          }}
                        />
                      )}
                      {veh.name}
                    </strong>
                    <span
                      style={{
                        fontSize: "12px",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        backgroundColor: "#36393f",
                        color: "#a3a6aa",
                        border: "1px solid #4f545c",
                      }}
                    >
                      {veh.weight} kg
                    </span>
                  </div>
                  <Badge bg="#f39c12" text={veh.effect} />
                  <p
                    style={{
                      margin: "10px 0 0 0",
                      fontSize: "13px",
                      color: "#99aab5",
                    }}
                  >
                    {veh.desc}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-component cho Nút Tab phong cách Game
function TabButton({ label, icon, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: "15px 10px",
        border: "none",
        cursor: "pointer",
        fontSize: "15px",
        fontWeight: "bold",
        textTransform: "uppercase",
        backgroundColor: isActive ? "#2c2f33" : "transparent",
        color: isActive ? "#e67e22" : "#8e9297",
        borderBottom: isActive ? "3px solid #e67e22" : "3px solid transparent",
        transition: "all 0.2s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
      }}
    >
      <span>{icon}</span> {label}
    </button>
  );
}

// Sub-component cho các Badge chỉ số
function Badge({ bg, text, icon }) {
  return (
    <span
      style={{
        backgroundColor: bg,
        color: "#fff",
        fontSize: "12px",
        fontWeight: "bold",
        padding: "4px 8px",
        borderRadius: "4px",
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        textShadow: "0 1px 2px rgba(0,0,0,0.5)",
      }}
    >
      {icon && <span>{icon}</span>} {text}
    </span>
  );
}
