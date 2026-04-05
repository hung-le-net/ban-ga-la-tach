import React from "react";

function ActionBtn({ direction, onClick, turnPhase }) {
  const isAttack = turnPhase === "attacking";
  const bgColor = isAttack ? "#c0392b" : "#2980b9";
  const boxShadowColor = isAttack ? "#922b21" : "#1f618d";
  const icons = { up: "⬆️", down: "⬇️", left: "⬅️", right: "➡️" };

  return (
    <button
      onClick={onClick}
      style={{
        width: "50px",
        height: "50px",
        background: bgColor,
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "24px",
        boxShadow: `0 4px 0 ${boxShadowColor}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icons[direction]}
    </button>
  );
}

export default function PlayerDashboard({
  myPlayer,
  isMyTurn,
  turnPhase,
  stepsLeft,
  handleAction,
  handleStopMoving,
  handleSkipAttack,
  selectedWeaponIdx,
  setSelectedWeaponIdx,
  socket,
  roomId,
  currentMaxWeight,
  armorPoints,
}) {
  return (
    <div
      style={{
        flex: "0 0 320px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {/* Thông tin Máu & Giáp */}
      <div
        style={{
          backgroundColor: "#1e2124",
          borderRadius: "8px",
          border: "1px solid #4f545c",
          padding: "15px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <h3
          style={{
            margin: 0,
            color: "#3498db",
            fontSize: "18px",
            borderBottom: "1px solid #4f545c",
            paddingBottom: "10px",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          👤 {myPlayer.name}{" "}
          <span
            style={{
              color: "#bdc3c7",
              fontSize: "13px",
              textTransform: "none",
              fontWeight: "normal",
            }}
          >
            ({myPlayer.charName})
          </span>
        </h3>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "20px" }}>❤️</span>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "11px", color: "#bdc3c7" }}>MÁU</span>
              <span
                style={{
                  fontSize: "16px",
                  color: "#e74c3c",
                  fontWeight: "bold",
                }}
              >
                {myPlayer.hp}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "20px" }}>🛡️</span>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "11px", color: "#bdc3c7" }}>GIÁP</span>
              <span
                style={{
                  fontSize: "16px",
                  color: "#f1c40f",
                  fontWeight: "bold",
                }}
              >
                {armorPoints}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cụm Nút Điều Khiển */}
      <div
        style={{
          backgroundColor: "#2c3036",
          borderRadius: "8px",
          border: "1px solid #4f545c",
          padding: "15px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          opacity: isMyTurn ? 1 : 0.4,
          pointerEvents: isMyTurn ? "auto" : "none",
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            color: isMyTurn ? "#27ae60" : "#7f8c8d",
            textAlign: "center",
            marginBottom: "5px",
          }}
        >
          {isMyTurn
            ? turnPhase === "moving"
              ? `Giai đoạn Di Chuyển (${stepsLeft} bước)`
              : "Giai đoạn Tấn Công ⚔️"
            : "Đang chờ lượt..."}
        </div>
        <ActionBtn
          direction="up"
          onClick={() => handleAction(0, -1)}
          turnPhase={turnPhase}
        />
        <div style={{ display: "flex", gap: "8px" }}>
          <ActionBtn
            direction="left"
            onClick={() => handleAction(-1, 0)}
            turnPhase={turnPhase}
          />
          <button
            onClick={
              turnPhase === "moving" ? handleStopMoving : handleSkipAttack
            }
            style={{
              width: "50px",
              height: "50px",
              background: "#4f545c",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "bold",
              boxShadow: "0 4px 0 #2f3136",
            }}
          >
            {turnPhase === "moving" ? "Dừng" : "Bỏ qua"}
          </button>
          <ActionBtn
            direction="right"
            onClick={() => handleAction(1, 0)}
            turnPhase={turnPhase}
          />
        </div>
        <ActionBtn
          direction="down"
          onClick={() => handleAction(0, 1)}
          turnPhase={turnPhase}
        />
      </div>

      {/* Kho Đồ (Ba Lô) */}
      <div
        style={{
          backgroundColor: "#1e2124",
          borderRadius: "8px",
          border: "1px solid #4f545c",
          padding: "15px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #4f545c",
            paddingBottom: "10px",
            marginBottom: "15px",
          }}
        >
          <strong
            style={{
              color: "#bdc3c7",
              fontSize: "14px",
              textTransform: "uppercase",
            }}
          >
            🎒 Ba Lô
          </strong>
          <span
            style={{
              fontSize: "13px",
              fontWeight: "bold",
              color:
                myPlayer.currentWeight >= currentMaxWeight
                  ? "#e74c3c"
                  : "#2ecc71",
              backgroundColor: "#2c3036",
              padding: "4px 8px",
              borderRadius: "4px",
            }}
          >
            {myPlayer.currentWeight} / {currentMaxWeight} kg
          </span>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <div
            style={{
              color: "#e74c3c",
              fontSize: "12px",
              fontWeight: "bold",
              marginBottom: "6px",
            }}
          >
            VŨ KHÍ (2 SLOT)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {Array.from({ length: 2 }).map((_, i) => {
              const item = myPlayer.inventory.weapons[i];
              const isSelected = selectedWeaponIdx === i;
              const canSelect = isMyTurn && turnPhase === "attacking" && item;
              return (
                <div
                  key={`wpn-${i}`}
                  onClick={() => {
                    if (canSelect) setSelectedWeaponIdx(i);
                  }}
                  style={{
                    padding: "8px",
                    backgroundColor: item
                      ? isSelected
                        ? "#d35400"
                        : "#2c3036"
                      : "#17191c",
                    borderRadius: "6px",
                    border: isSelected
                      ? "1px solid #f39c12"
                      : "1px solid #42464d",
                    cursor: canSelect ? "pointer" : "default",
                  }}
                >
                  {item ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "white",
                        fontSize: "13px",
                      }}
                    >
                      {item.icon ? (
                        <img
                          src={item.icon}
                          alt=""
                          style={{
                            width: "20px",
                            height: "20px",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        "🔫"
                      )}
                      <span style={{ flex: 1 }}>
                        {item.name}{" "}
                        <span style={{ color: "#7f8c8d" }}>
                          ({item.weight}kg)
                        </span>
                      </span>
                    </div>
                  ) : (
                    <div
                      style={{
                        color: "#4f545c",
                        fontSize: "13px",
                        fontStyle: "italic",
                      }}
                    >
                      [Trống]
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <div
            style={{
              color: "#2ecc71",
              fontSize: "12px",
              fontWeight: "bold",
              marginBottom: "6px",
            }}
          >
            HỖ TRỢ (2 SLOT)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {Array.from({ length: 2 }).map((_, i) => {
              const item = myPlayer.inventory.supports[i];
              return (
                <div
                  key={`sup-${i}`}
                  onClick={() => {
                    if (isMyTurn && item)
                      socket.emit("action_use_item", { roomId, itemIndex: i });
                  }}
                  style={{
                    padding: "8px",
                    backgroundColor: item ? "#2c3036" : "#17191c",
                    borderRadius: "6px",
                    border: "1px solid #42464d",
                    cursor: isMyTurn && item ? "pointer" : "default",
                  }}
                >
                  {item ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "white",
                        fontSize: "13px",
                      }}
                    >
                      {item.icon ? (
                        <img
                          src={item.icon}
                          alt=""
                          style={{
                            width: "20px",
                            height: "20px",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        "💊"
                      )}
                      <span style={{ flex: 1 }}>
                        {item.name}{" "}
                        <span style={{ color: "#7f8c8d" }}>
                          ({item.weight}kg)
                        </span>
                      </span>
                    </div>
                  ) : (
                    <div
                      style={{
                        color: "#4f545c",
                        fontSize: "13px",
                        fontStyle: "italic",
                      }}
                    >
                      [Trống]
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div
            style={{
              color: "#dbca34",
              fontSize: "12px",
              fontWeight: "bold",
              marginBottom: "6px",
            }}
          >
            PHƯƠNG TIỆN (1 SLOT)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {Array.from({ length: 1 }).map((_, i) => {
              const item = myPlayer.inventory.vehicles[i];
              return (
                <div
                  key={`veh-${i}`}
                  style={{
                    padding: "8px",
                    backgroundColor: item ? "#2c3036" : "#17191c",
                    borderRadius: "6px",
                    border: "1px solid #42464d",
                  }}
                >
                  {item ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "white",
                        fontSize: "13px",
                      }}
                    >
                      {item.icon ? (
                        <img
                          src={item.icon}
                          alt=""
                          style={{
                            width: "20px",
                            height: "20px",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        "🛹"
                      )}
                      <span style={{ flex: 1 }}>
                        {item.name}{" "}
                        <span style={{ color: "#7f8c8d" }}>
                          ({item.weight}kg)
                        </span>
                      </span>
                    </div>
                  ) : (
                    <div
                      style={{
                        color: "#4f545c",
                        fontSize: "13px",
                        fontStyle: "italic",
                      }}
                    >
                      [Trống]
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
