const CHARACTERS = [
  // --- NHÓM TRÂU BÒ & CẬN CHIẾN ---
  {
    id: "c1",
    name: "Tuấn Tập Tạ",
    hp: 10,
    maxWeight: 9,
    icon: "🏋️‍♂️",
    color: "#e82a15",
    skill: "Chảo Ngàn Cân: Sát thương Chảo mặc định là 2 (thay vì 1).",
  },
  {
    id: "c2",
    name: "Hải Hầm Hố",
    hp: 9,
    maxWeight: 8,
    icon: "🦏",
    color: "#f58516",
    skill: "Mặc Áo Phao: Khởi đầu game luôn có sẵn 1 Áo Giáp.",
  },
  {
    id: "c3",
    name: "Cường Cục Súc",
    hp: 8,
    maxWeight: 8,
    icon: "💢",
    color: "#9e330c",
    skill: "Liều Mạng: Khi HP từ 4 trở xuống, mọi đòn đánh được +1 Sát thương.",
  },

  // --- NHÓM CƠ ĐỘNG & NHẶT MÓT ---
  {
    id: "c4",
    name: "Linh Lỉnh Kỉnh",
    hp: 5,
    maxWeight: 10,
    icon: "🎒",
    color: "#27ae60",
    skill: "Chạy Bộ Nhanh: Mỗi lượt có tới 6 bước di chuyển (thay vì 5).",
  },
  {
    id: "c5",
    name: "Tài Tốc Độ",
    hp: 7,
    maxWeight: 8,
    icon: "🛹",
    color: "#2980b9",
    skill: "Chuẩn Bị Kỹ: Khởi đầu game luôn có sẵn 1 Ván Trượt.",
  },
  {
    id: "c6",
    name: "Phát Phong Thủy",
    hp: 7,
    maxWeight: 7,
    icon: "🎲",
    color: "#f3d912",
    skill: "Trúng Số: Khởi đầu game được hệ thống phát ngẫu nhiên 1 Vũ khí.",
  },

  // --- NHÓM CHIẾN THUẬT & TRÍ TUỆ ---
  {
    id: "c7",
    name: "Tiến Tinh Tướng",
    hp: 6,
    maxWeight: 7,
    icon: "🦅",
    color: "#60b6ef",
    skill: "Mắt Cú Vọ: Bán kính tầm nhìn rộng 3 ô (hơn người thường 1 ô).",
  },
  {
    id: "c8",
    name: "Lan Lành Lặn",
    hp: 8,
    maxWeight: 7,
    icon: "⛑️",
    color: "#31ea7e",
    skill: "Bàn Tay Vàng: Dùng vật phẩm y tế luôn được hồi thêm +1 HP.",
  },
  {
    id: "c9",
    name: "Trí Trốn Tìm",
    hp: 5,
    maxWeight: 8,
    icon: "🥷",
    color: "#a355c4",
    skill: "Bậc Thầy Núp Lùm: Đứng trong bụi cây sẽ né được 100% đạn bắn xa.",
  },
  {
    id: "c10",
    name: "Thảo Thó Đồ",
    hp: 6,
    maxWeight: 9,
    icon: "🧤",
    color: "#ff91d7",
    skill:
      "Bàn Tay Hư Hỏng: Tấn công cận chiến có 50% tỉ lệ trộm 1 món đồ của nạn nhân.",
  },
];

module.exports = { CHARACTERS };
