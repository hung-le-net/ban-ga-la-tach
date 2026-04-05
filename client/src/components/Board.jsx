import React, { useRef, useEffect, useState } from "react";
import { getItemIcon, getTerrainStyle } from "../utils/boardHelpers";
import PlayerDashboard from "./PlayerDashboard";
import GamePopups from "./GamePopups";

export default function Board({
  gameState,
  myId,
  socket,
  roomId,
  onLeaveRoom,
}) {
  const { map, players, turnOrder, currentTurnIndex, stepsLeft, turnPhase } =
    gameState;
  const mapSize = map.length;

  const currentPlayerId = turnOrder[currentTurnIndex];
  const isMyTurn = currentPlayerId === myId;
  const myPlayer = players[myId];

  // --- Nhận kết quả trực tiếp từ Server ---
  const isGameOver = gameState.status === "game_over";
  const winner = gameState.winner;

  const [selectedWeaponIdx, setSelectedWeaponIdx] = useState(null);
  const logsEndRef = useRef(null);
  const [effects, setEffects] = useState([]);

  useEffect(() => {
    if (logsEndRef.current)
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [gameState.logs]);

  useEffect(() => {
    socket.on("play_effect", (data) => {
      const id = Date.now() + Math.random();
      setEffects((prev) => [...prev, { ...data, id }]);
      setTimeout(
        () => setEffects((prev) => prev.filter((e) => e.id !== id)),
        1000,
      );
    });
    return () => socket.off("play_effect");
  }, [socket]);

  const handleAction = (dx, dy) => {
    if (!isMyTurn) return;
    if (turnPhase === "moving") socket.emit("action_move", { roomId, dx, dy });
    else {
      socket.emit("action_attack", {
        roomId,
        dx,
        dy,
        weaponIndex: selectedWeaponIdx,
      });
      setSelectedWeaponIdx(null);
    }
  };

  const handleStopMoving = () => socket.emit("action_stop_moving", roomId);
  const handleSkipAttack = () =>
    socket.emit("action_attack", { roomId, dx: 0, dy: 0 });

  if (!myPlayer) return null;

  const armorPoints = myPlayer.inventory.supports.reduce(
    (total, item) => total + (item.defense || 0),
    0,
  );
  const capacityBonus = myPlayer.inventory.supports.reduce(
    (total, item) => total + (item.capacityBonus || 0),
    0,
  );
  const currentMaxWeight = myPlayer.maxWeight + capacityBonus;
  const isBoShrinkingNext = (gameState.currentRound - 1) % 3 === 2;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "10px",
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @keyframes bawk { 0%, 100% { transform: scale(1) rotate(0deg); } 25% { transform: scale(1.2) rotate(-15deg); } 50% { transform: scale(1) rotate(15deg); } 75% { transform: scale(1.2) rotate(-15deg); } }
        .chicken-anim { animation: bawk 0.5s infinite; box-shadow: 0 0 10px #f1c40f; }
        @keyframes poisonPulse { 0% { background-color: rgba(142, 68, 173, 0.4); } 50% { background-color: rgba(231, 76, 60, 0.6); } 100% { background-color: rgba(142, 68, 173, 0.4); } }
        .danger-zone { animation: poisonPulse 2s infinite; }
        @keyframes gunTrace { 0% { background-color: rgba(241, 196, 15, 0.9); transform: scale(0.5); border-radius: 50%; } 100% { background-color: transparent; transform: scale(1); } }
        @keyframes explosionBlast { 0% { background-color: rgba(231, 76, 60, 0.8); box-shadow: 0 0 20px #e74c3c; transform: scale(1.1); z-index: 20;} 100% { background-color: transparent; box-shadow: none; transform: scale(1); z-index: 10;} }
        @keyframes meleeSlash { 0% { background-color: rgba(255, 255, 255, 0.9); transform: scale(1.2) rotate(45deg); box-shadow: 0 0 10px #fff; } 100% { background-color: transparent; transform: scale(1) rotate(45deg); } }
        .effect-gun { animation: gunTrace 0.3s ease-out forwards; }
        .effect-bomb { animation: explosionBlast 0.4s ease-out forwards; border-radius: 6px; }
        .effect-melee { animation: meleeSlash 0.2s ease-out forwards; clip-path: polygon(0 40%, 100% 40%, 100% 60%, 0 60%); }
      `}</style>

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#17191c",
          padding: "15px 20px",
          borderRadius: "10px",
          border: "1px solid #4f545c",
          borderBottom: "3px solid #e67e22",
          marginBottom: "20px",
          gap: "10px",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#f1c40f",
            textTransform: "uppercase",
            letterSpacing: "1px",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          🗺️ {gameState.mapName || "ĐẢO HÒN GÀ"}
        </h2>
        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#23272a",
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid #42464d",
              color: "white",
              fontSize: "14px",
            }}
          >
            <span style={{ color: "#bdc3c7" }}>Vòng:</span>{" "}
            <strong>{gameState.currentRound}</strong>
            <span style={{ margin: "0 8px", color: "#4f545c" }}>|</span>
            {isBoShrinkingNext ? (
              <span
                style={{
                  color: "#e74c3c",
                  fontWeight: "bold",
                  animation: "bawk 1s infinite",
                }}
              >
                Bo sắp thu!
              </span>
            ) : (
              <span style={{ color: "#2ecc71" }}>Bo an toàn</span>
            )}
          </div>
          <div
            style={{
              backgroundColor: isMyTurn ? "#27ae6022" : "#23272a",
              border: `1px solid ${isMyTurn ? "#27ae60" : "#42464d"}`,
              padding: "6px 12px",
              borderRadius: "6px",
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            Lượt của:{" "}
            <span style={{ color: isMyTurn ? "#2ecc71" : "#e67e22" }}>
              {isMyTurn ? "BẠN" : "KHÔNG PHẢI BẠN"}
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        {/* CỘT TRÁI (LƯỚI BẢN ĐỒ + NHẬT KÝ) */}
        <div
          style={{
            flex: "1 1 auto",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            position: "relative",
            maxWidth: "100%",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${mapSize}, 36px)`,
              gap: "2px",
              background: "#2c3036",
              padding: "6px",
              border: "2px solid #4f545c",
              borderRadius: "10px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
              overflow: "hidden",
            }}
          >
            {map.map((row, y) =>
              row.map((cell, x) => {
                let isVisible = false;
                const myCellType = map[myPlayer.y][myPlayer.x].type;
                const isMeInSmoke = gameState.smokes?.some((smoke) =>
                  smoke.cells.some(
                    (c) => c.x === myPlayer.x && c.y === myPlayer.y,
                  ),
                );

                if (myPlayer.isChicken) isVisible = true;
                else if (isMeInSmoke)
                  isVisible = x === myPlayer.x && y === myPlayer.y;
                else if (myCellType === "warehouse")
                  isVisible = cell.type === "warehouse";
                else {
                  const dx = Math.abs(myPlayer.x - x),
                    dy = Math.abs(myPlayer.y - y);
                  let visionRange = myPlayer.charId === "c7" ? 3 : 2;
                  if (
                    myPlayer.inventory.supports.some((item) => item.visionBonus)
                  )
                    visionRange += 1;
                  isVisible = dx <= visionRange && dy <= visionRange;
                }

                const playerHere = Object.values(players).find(
                  (p) => p.x === x && p.y === y,
                );
                const terrain = getTerrainStyle(cell.type, gameState.mapName);
                const sz = gameState.safeZone;
                const isOutsideSafeZone =
                  x < sz.xMin || x > sz.xMax || y < sz.yMin || y > sz.yMax;

                let cellEffect = null;
                effects.forEach((eff) => {
                  if (eff.type.includes("Bom") || eff.type.includes("bomb")) {
                    if (eff.affectedCells) {
                      if (eff.affectedCells.some((c) => c.x === x && c.y === y))
                        cellEffect = "bomb";
                    } else if (
                      Math.abs(eff.impactX - x) <= 1 &&
                      Math.abs(eff.impactY - y) <= 1
                    )
                      cellEffect = "bomb";
                  } else if (
                    eff.type.includes("Súng") ||
                    eff.type.includes("gun")
                  ) {
                    if (eff.path.some((p) => p.x === x && p.y === y))
                      cellEffect = "gun";
                  } else {
                    if (eff.impactX === x && eff.impactY === y)
                      cellEffect = "melee";
                  }
                });

                return (
                  <div
                    key={`${x}-${y}`}
                    onClick={() => {}}
                    style={{
                      width: "35px",
                      height: "35px",
                      backgroundColor: terrain.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      fontSize: "18px",
                    }}
                  >
                    <span style={{ position: "absolute", opacity: 0.8 }}>
                      {terrain.icon}
                    </span>
                    {isOutsideSafeZone && (
                      <div
                        className="danger-zone"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          zIndex: 2,
                          pointerEvents: "none",
                        }}
                      />
                    )}
                    {gameState.smokes?.some((smoke) =>
                      smoke.cells.some((c) => c.x === x && c.y === y),
                    ) && (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: "rgba(200, 214, 229, 0.85)",
                          zIndex: 2,
                          pointerEvents: "none",
                        }}
                      />
                    )}
                    {!isVisible && (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: "rgba(10, 10, 12, 0.8)",
                          zIndex: 3,
                        }}
                      />
                    )}
                    {isVisible && cell.item && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "2px",
                          right: "2px",
                          fontSize: "12px",
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          borderRadius: "3px",
                          padding: "1px",
                          zIndex: 4,
                        }}
                      >
                        {getItemIcon(cell.item)}
                      </div>
                    )}
                    {playerHere && (
                      <div
                        className={playerHere.isChicken ? "chicken-anim" : ""}
                        style={{
                          width: "26px",
                          height: "26px",
                          backgroundColor: playerHere.isChicken
                            ? "#f1c40f"
                            : playerHere.id === myId
                              ? "#3498db"
                              : "#e74c3c",
                          borderRadius: "50%",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: playerHere.isChicken ? "16px" : "12px",
                          fontWeight: "bold",
                          border: "2px solid white",
                          zIndex: 5,
                          transition: "all 0.3s",
                        }}
                      >
                        {playerHere.isChicken
                          ? "🐔"
                          : playerHere.name.charAt(0)}
                      </div>
                    )}
                    {cellEffect && (
                      <div
                        className={`effect-${cellEffect}`}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          zIndex: 10,
                          pointerEvents: "none",
                        }}
                      />
                    )}
                  </div>
                );
              }),
            )}
          </div>

          <div
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#1e2124",
              borderRadius: "8px",
              border: "1px solid #4f545c",
              display: "flex",
              flexDirection: "column",
              height: "250px",
              boxSizing: "border-box",
            }}
          >
            <h3
              style={{
                margin: "0 0 8px 0",
                color: "#f1c40f",
                fontSize: "14px",
                textTransform: "uppercase",
                borderBottom: "1px solid #4f545c",
                paddingBottom: "8px",
              }}
            >
              📜 Nhật Ký Chiến Trường
            </h3>
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                paddingRight: "5px",
              }}
            >
              {gameState.logs && gameState.logs.length > 0 ? (
                gameState.logs.map((log, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: "13px",
                      color: "#dcddde",
                      lineHeight: "1.4",
                      borderBottom: "1px solid #2f3136",
                      paddingBottom: "4px",
                    }}
                  >
                    <span
                      style={{
                        color: "#72767d",
                        fontSize: "11px",
                        marginRight: "6px",
                      }}
                    >
                      [{log.time}]
                    </span>
                    <span dangerouslySetInnerHTML={{ __html: log.msg }} />
                  </div>
                ))
              ) : (
                <div
                  style={{
                    color: "#7f8c8d",
                    textAlign: "center",
                    fontStyle: "italic",
                    marginTop: "10px",
                    fontSize: "13px",
                  }}
                >
                  Chưa có sự kiện nào...
                </div>
              )}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>

        {/* CỘT PHẢI (CHỨA THÔNG TIN & NÚT BẤM) */}
        <PlayerDashboard
          myPlayer={myPlayer}
          isMyTurn={isMyTurn}
          turnPhase={turnPhase}
          stepsLeft={stepsLeft}
          handleAction={handleAction}
          handleStopMoving={handleStopMoving}
          handleSkipAttack={handleSkipAttack}
          selectedWeaponIdx={selectedWeaponIdx}
          setSelectedWeaponIdx={setSelectedWeaponIdx}
          socket={socket}
          roomId={roomId}
          currentMaxWeight={currentMaxWeight}
          armorPoints={armorPoints}
        />
      </div>

      {/* POPUPS ĐÈ LÊN TRÊN */}
      <GamePopups
        gameState={gameState}
        myPlayer={myPlayer}
        isMyTurn={isMyTurn}
        socket={socket}
        roomId={roomId}
        currentMaxWeight={currentMaxWeight}
        onLeaveRoom={onLeaveRoom}
        isGameOver={isGameOver}
        winner={winner}
      />
    </div>
  );
}
