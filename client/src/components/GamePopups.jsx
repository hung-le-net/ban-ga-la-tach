import React from "react";

export default function GamePopups({
  gameState,
  myPlayer,
  isMyTurn,
  socket,
  roomId,
  currentMaxWeight,
  onLeaveRoom,
  isGameOver,
  winner,
}) {
  const { turnPhase } = gameState;

  return (
    <>
      {/* 1. HÓA GÀ */}
      {myPlayer.isChicken && !isGameOver && (
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(231, 76, 60, 0.95)",
            color: "white",
            padding: "15px 30px",
            borderRadius: "12px",
            zIndex: 100,
            boxShadow: "0 10px 25px rgba(0,0,0,0.8)",
            textAlign: "center",
            border: "4px solid #c0392b",
            minWidth: "320px",
            animation: "bawk 1s ease-in-out",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "26px",
              textTransform: "uppercase",
              textShadow: "2px 2px 0 #000",
            }}
          >
            🐔 BẠN ĐÃ HÓA GÀ! 🐔
          </h2>
          <p
            style={{
              margin: "8px 0 0 0",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            Đồ đạc đã rơi hết. Giờ bạn là khán giả!
          </p>
        </div>
      )}

      {/* 2. BỊ CƯỚP */}
      {isMyTurn && turnPhase === "robbed" && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#1e2124",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.9)",
            zIndex: 105,
            textAlign: "center",
            minWidth: "320px",
            border: "2px solid #e74c3c",
            color: "white",
          }}
        >
          <h3 style={{ color: "#e74c3c", marginTop: 0, fontSize: "22px" }}>
            🦹 BĂNG CƯỚP ĐẢO!
          </h3>
          <p
            style={{ fontSize: "14px", color: "#bdc3c7", marginBottom: "15px" }}
          >
            Xui quá. Bạn đã đụng vô ổ cướp. Nộp mạng hay nộp tài sản?
          </p>
          {(() => {
            const hasItems =
              myPlayer.inventory.weapons.length > 0 ||
              myPlayer.inventory.supports.length > 0 ||
              myPlayer.inventory.vehicles.length > 0;
            if (!hasItems) {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <p
                    style={{
                      color: "#f39c12",
                      fontSize: "14px",
                      fontStyle: "italic",
                      padding: "10px",
                      backgroundColor: "#34495e",
                      borderRadius: "8px",
                    }}
                  >
                    Ba lô trống không! Bọn cướp tức giận tát bạn 1 cái.
                  </p>
                  <button
                    onClick={() =>
                      socket.emit("action_resolve_robber", {
                        roomId,
                        choice: "hp",
                      })
                    }
                    style={{
                      padding: "12px",
                      backgroundColor: "#c0392b",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      fontSize: "15px",
                    }}
                  >
                    🩸 Chịu mất 1 Máu
                  </button>
                </div>
              );
            }
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <button
                  onClick={() =>
                    socket.emit("action_resolve_robber", {
                      roomId,
                      choice: "hp",
                    })
                  }
                  style={{
                    padding: "12px",
                    backgroundColor: "#c0392b",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    marginBottom: "10px",
                    fontSize: "15px",
                  }}
                >
                  🩸 Mất 1 Máu (Bảo toàn trang bị)
                </button>
                <div
                  style={{
                    height: "1px",
                    backgroundColor: "#4f545c",
                    margin: "5px 0",
                  }}
                ></div>
                <p style={{ color: "#95a5a6", fontSize: "12px", margin: "0" }}>
                  HOẶC CHỌN GIAO NỘP 1 MÓN ĐỒ LẠI:
                </p>
                <div
                  style={{
                    maxHeight: "150px",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    paddingRight: "5px",
                  }}
                >
                  {["weapons", "supports", "vehicles"].map((category) =>
                    myPlayer.inventory[category].map((item, idx) => (
                      <button
                        key={`${category}-${idx}`}
                        onClick={() =>
                          socket.emit("action_resolve_robber", {
                            roomId,
                            choice: "item",
                            category,
                            itemIndex: idx,
                          })
                        }
                        style={{
                          padding: "10px",
                          backgroundColor: "#34495e",
                          color: "white",
                          border: "1px solid #4f545c",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "13px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
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
                            "📦"
                          )}{" "}
                          {item.name}
                        </span>
                        <span style={{ color: "#e74c3c", fontWeight: "bold" }}>
                          Nộp
                        </span>
                      </button>
                    )),
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 3. LƯỢM ĐỒ */}
      {isMyTurn && turnPhase === "looting" && gameState.pendingLoot && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#1e2124",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.8)",
            zIndex: 100,
            textAlign: "center",
            minWidth: "300px",
            border: "1px solid #4f545c",
            color: "white",
          }}
        >
          {(() => {
            const newItem = gameState.pendingLoot;
            const limitMap = { weapon: 2, support: 2, vehicle: 1 };
            const category =
              newItem.type === "weapon"
                ? "weapons"
                : newItem.type === "support"
                  ? "supports"
                  : "vehicles";
            const myCurrentItems = myPlayer.inventory[category];
            const isSlotFull = myCurrentItems.length >= limitMap[newItem.type];
            const canCarryWeight =
              myPlayer.currentWeight + newItem.weight <= currentMaxWeight;

            return (
              <>
                <h3 style={{ color: "#f39c12", marginTop: 0 }}>
                  📦 Nhặt Vật Phẩm!
                </h3>
                <div
                  style={{
                    backgroundColor: "#2c3036",
                    padding: "15px",
                    borderRadius: "8px",
                    marginBottom: "15px",
                    border: "1px solid #42464d",
                  }}
                >
                  <h4
                    style={{
                      margin: "0 0 10px 0",
                      color: "#fff",
                      fontSize: "18px",
                    }}
                  >
                    {newItem.name}
                  </h4>
                  <p
                    style={{
                      margin: "5px 0",
                      fontSize: "13px",
                      color: "#bdc3c7",
                    }}
                  >
                    Nặng: {newItem.weight} kg
                  </p>
                  <p
                    style={{
                      margin: "5px 0",
                      fontStyle: "italic",
                      color: "#95a5a6",
                      fontSize: "13px",
                    }}
                  >
                    {newItem.desc}
                  </p>
                </div>
                <p
                  style={{
                    fontWeight: "bold",
                    color: "#bdc3c7",
                    fontSize: "14px",
                    margin: "10px",
                  }}
                >
                  🎒 Ba lô: {myPlayer.currentWeight}/{currentMaxWeight} kg
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {isSlotFull ? (
                    <div
                      style={{
                        border: "1px dashed #e74c3c",
                        padding: "10px",
                        borderRadius: "8px",
                      }}
                    >
                      <p
                        style={{
                          color: "#e74c3c",
                          margin: "0 0 10px 0",
                          fontSize: "13px",
                        }}
                      >
                        ⚠️ Slot đầy! Chọn đồ cũ để vứt:
                      </p>
                      {myCurrentItems.map((oldItem, index) => {
                        let futureMaxW = myPlayer.maxWeight;
                        myPlayer.inventory.supports.forEach((sup, supIdx) => {
                          if (category === "supports" && supIdx === index)
                            return;
                          futureMaxW += sup.capacityBonus || 0;
                        });
                        if (category === "supports" && newItem.capacityBonus)
                          futureMaxW += newItem.capacityBonus;

                        const isValidSwap =
                          myPlayer.currentWeight -
                            oldItem.weight +
                            newItem.weight <=
                          futureMaxW;
                        return (
                          <button
                            key={index}
                            disabled={!isValidSwap}
                            onClick={() =>
                              socket.emit("action_swap_loot", {
                                roomId,
                                itemIndex: index,
                              })
                            }
                            style={{
                              width: "100%",
                              padding: "8px",
                              marginBottom: "5px",
                              borderRadius: "4px",
                              cursor: isValidSwap ? "pointer" : "not-allowed",
                              backgroundColor: isValidSwap
                                ? "#d35400"
                                : "#4f545c",
                              color: "white",
                              border: "none",
                              fontSize: "13px",
                            }}
                          >
                            🔄 Vứt {oldItem.name} {!isValidSwap && "(Lố cân)"}
                          </button>
                        );
                      })}
                    </div>
                  ) : canCarryWeight ? (
                    <button
                      onClick={() => socket.emit("action_accept_loot", roomId)}
                      style={{
                        padding: "10px",
                        backgroundColor: "#27ae60",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      ✅ NHẶT VÀO BA LÔ
                    </button>
                  ) : (
                    <p
                      style={{
                        color: "#e74c3c",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      ❌ Quá nặng, không lượm được!
                    </p>
                  )}
                  <button
                    onClick={() => socket.emit("action_skip_loot", roomId)}
                    style={{
                      padding: "10px",
                      backgroundColor: "#7f8c8d",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    ⏭️ BỎ QUA
                  </button>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* 4. GAME OVER MÀN HÌNH CHÍNH */}
      {isGameOver && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.92)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontFamily: '"Segoe UI", sans-serif',
          }}
        >
          {winner ? (
            <>
              <h1
                style={{
                  fontSize: "50px",
                  color: "#f1c40f",
                  margin: "0 0 20px 0",
                  textShadow: "0 4px 20px rgba(241, 196, 15, 0.7)",
                  textAlign: "center",
                }}
              >
                🏆 NGƯỜI SỐNG SÓT CUỐI CÙNG 🏆
              </h1>
              <h2
                style={{
                  fontSize: "60px",
                  color: "#2ecc71",
                  margin: "0 0 10px 0",
                  textTransform: "uppercase",
                }}
              >
                {winner.name}
              </h2>
              <p
                style={{
                  fontSize: "22px",
                  color: "#bdc3c7",
                  fontStyle: "italic",
                }}
              >
                Đặc nhiệm{" "}
                <strong style={{ color: "#e67e22" }}>{winner.charName}</strong>{" "}
                đã ẵm trọn 100 Tỷ Đồng!
              </p>
            </>
          ) : (
            <>
              <h1
                style={{
                  fontSize: "60px",
                  color: "#e74c3c",
                  margin: "0 0 20px 0",
                  textShadow: "0 4px 20px rgba(231, 76, 60, 0.7)",
                }}
              >
                🐔 TOÀN DIỆT! 🐔
              </h1>
              <p style={{ fontSize: "22px", color: "#bdc3c7" }}>
                Không một ai sống sót rời khỏi Đảo Hòn Gà...
              </p>
            </>
          )}
          <button
            onClick={onLeaveRoom}
            style={{
              marginTop: "50px",
              padding: "18px 40px",
              fontSize: "22px",
              fontWeight: "bold",
              backgroundColor: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(52, 152, 219, 0.6)",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          >
            🔄 RỜI PHÒNG & CHƠI LẠI
          </button>
        </div>
      )}
    </>
  );
}
