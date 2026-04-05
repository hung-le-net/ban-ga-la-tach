import React from "react";

// Hàm hỗ trợ lấy Icon cho vật phẩm rơi trên đất
export const getItemIcon = (item) => {
  if (!item) return "";
  if (item.icon) {
    return (
      <img
        src={item.icon}
        alt={item.name}
        style={{
          width: "24px",
          height: "24px",
          display: "block",
          objectFit: "contain",
        }}
      />
    );
  }
  if (item.type === "weapon") return "🔫";
  if (item.type === "support") return "💊";
  if (item.type === "vehicle") return "🛹";
  return "📦";
};

// Hàm hỗ trợ lấy màu và icon theo từng loại địa hình
export const getTerrainStyle = (type, mapName) => {
  switch (type) {
    case "obstacle":
      return { bg: "#7f8c8d", icon: "🪨" };
    case "water":
      return { bg: "#3498db", icon: "🌊" };
    case "ice":
      return { bg: "#c0e0f5", icon: "🌊" };
    case "swamp":
      return { bg: "#bd08cd", icon: "🌊" };
    case "bridge":
      return { bg: "#d35400", icon: "🌉" };
    case "bush":
      return { bg: "#229954", icon: "🌿" };
    case "warehouse":
      return { bg: "#8d6e63", icon: "🛖" };
    case "barrel":
      return { bg: "#fa8824", icon: "🛢️" };
    case "oasis":
      return { bg: "#1abc9c", icon: "🌴" };
    default:
      if (mapName === "Sa Mạc Hoang Vu") return { bg: "#e6c27a", icon: "" };
      if (mapName === "Núi Tuyết Tử Thần") return { bg: "#ecf0f1", icon: "" };
      if (mapName === "Khu Công Nghiệp") return { bg: "#aeb6bf", icon: "" };
      return { bg: "#2ecc71", icon: "" };
  }
};
