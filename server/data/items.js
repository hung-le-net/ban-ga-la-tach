const ASSETS_URL = "http://localhost:3000/assets";
const ITEMS = [
  // --- 1. VŨ KHÍ (Weapons) ---
  // Nhóm Súng (Guns)
  {
    id: "wpn_pistol",
    name: "Súng Nước",
    type: "weapon",
    subType: "gun",
    weight: 1,
    damage: 2,
    range: 2,
    desc: "Bắn gần, nhẹ gọn. Bị chặn bởi đá.",
    icon: `${ASSETS_URL}/weapons/water-gun.png`,
  },
  {
    id: "wpn_shotgun",
    name: "Súng Hoa Cải",
    type: "weapon",
    subType: "gun",
    weight: 2,
    damage: 3,
    range: 2,
    desc: "Sát thương cao ở cự ly gần.",
    icon: `${ASSETS_URL}/weapons/shotgun.png`,
  },
  {
    id: "wpn_ak47",
    name: "AK-47",
    type: "weapon",
    subType: "gun",
    weight: 2,
    damage: 2,
    range: 3,
    desc: "Cân bằng giữa tầm bắn và sát thương.",
    icon: `${ASSETS_URL}/weapons/ak-47.png`,
  },
  {
    id: "wpn_sniper",
    name: "Súng Ngắm",
    type: "weapon",
    subType: "gun",
    weight: 3,
    damage: 4,
    range: 4,
    desc: "Bắn tỉa từ xa, cực nặng.",
    icon: `${ASSETS_URL}/weapons/sniper.png`,
  },
  {
    id: "wpn_bazooka",
    name: "Bazooka",
    type: "weapon",
    subType: "gun", // Vẫn là súng: bị chặn bởi đá
    weight: 3,
    damage: 3,
    range: 3,
    explosion: "cross", // Nổ hình chữ thập (trên, dưới, trái, phải)
    desc: "Nổ lan hình chữ thập (+). Bị chặn bởi đá.",
    icon: `${ASSETS_URL}/weapons/bazooka.png`,
  },

  // Nhóm Cận Chiến (Melee)
  {
    id: "wpn_chao",
    name: "Chảo",
    type: "weapon",
    subType: "melee",
    weight: 0,
    damage: 1,
    range: 1,
    desc: "Vũ khí mặc định. Có thể chiên trứng.",
    icon: `${ASSETS_URL}/weapons/frying-pan.png`,
  },
  {
    id: "wpn_knife",
    name: "Tông Lào",
    type: "weapon",
    subType: "melee",
    weight: 1,
    damage: 2,
    range: 1,
    desc: "Vừa nhẹ vừa thấm.",
    icon: `${ASSETS_URL}/weapons/flip-flops.png`,
  },
  {
    id: "wpn_sword",
    name: "Điếu Cày",
    type: "weapon",
    subType: "melee",
    weight: 2,
    damage: 3,
    range: 1,
    desc: "Không chỉ để rít.",
    icon: `${ASSETS_URL}/weapons/man.png`,
  },

  // Nhóm Bom (Bombs)
  {
    id: "wpn_grenade",
    name: "Lựu Đạn Nổ",
    type: "weapon",
    subType: "bomb",
    weight: 1,
    damage: 2,
    range: 3,
    explosion: "cross",
    desc: "Ném vượt địa hình. Dùng 1 lần là mất.",
    icon: `${ASSETS_URL}/weapons/grenade.png`,
  },
  {
    id: "wpn_big_bomb",
    name: "Bom Đại",
    type: "weapon",
    subType: "bomb", // Là bom: ném xuyên vật cản
    weight: 3,
    damage: 3,
    range: 3,
    explosion: "3x3", // Nổ diện rộng 3x3 xung quanh tâm
    desc: "Sức công phá lớn. Nổ diện rộng 3x3.",
    icon: `${ASSETS_URL}/weapons/bomb.png`,
  },

  // --- 2. HỖ TRỢ (Support) ---
  {
    id: "sup_bandage",
    name: "Băng Gạc",
    type: "support",
    weight: 1,
    heal: 1,
    desc: "Sơ cứu vết thương nhẹ.",
    icon: `${ASSETS_URL}/supports/band-aid.png`,
  },
  {
    id: "sup_medkit",
    name: "Hộp Cứu Thương",
    type: "support",
    weight: 2,
    heal: 3,
    desc: "Đầy máu nhanh chóng.",
    icon: `${ASSETS_URL}/supports/medkit.png`,
  },
  {
    id: "sup_smoke",
    name: "Lựu Đạn Khói",
    type: "support",
    weight: 1,
    effect: "smoke",
    desc: "Ném mạnh xuống đất tạo vùng sương mù 3x3 để tẩu thoát.",
    icon: `${ASSETS_URL}/supports/smoke-bomb.png`,
  },
  {
    id: "sup_mu",
    name: "Mũ Cối",
    type: "support",
    weight: 1,
    defense: 1,
    desc: "Giảm 1 sát thương nhận vào (Hỏng khi hết độ bền).",
    icon: `${ASSETS_URL}/supports/military-hat.png`,
  },
  {
    id: "sup_armor",
    name: "Áo Giáp",
    type: "support",
    weight: 2,
    defense: 2,
    desc: "Đạn vô bay tứ tung.",
    icon: `${ASSETS_URL}/supports/bulletproof-vest.png`,
  },
  {
    id: "sup_binocular",
    name: "Ống Nhòm",
    type: "support",
    weight: 2,
    visionBonus: 1, // Tăng 1 ô tầm nhìn
    desc: "Mở rộng tầm nhìn thêm 1 ô.",
    icon: `${ASSETS_URL}/supports/binoculars.png`,
  },
  {
    id: "sup_super_backpack",
    name: "Túi Đeo Chéo",
    type: "support",
    weight: 1,
    capacityBonus: 3, // Tăng 3kg sức chứa
    desc: "Nâng cấp sức chứa tối đa của ba lô thêm 3kg.",
    icon: `${ASSETS_URL}/supports/crossbody-bag.png`,
  },

  // --- 3. PHƯƠNG TIỆN (Vehicles) ---
  {
    id: "veh_skate",
    name: "Ván Trượt",
    type: "vehicle",
    weight: 1,
    bonusStep: 1,
    desc: "Cộng 1 bước di chuyển mỗi lượt.",
    icon: `${ASSETS_URL}/vehicles/skateboard.png`,
  },
  {
    id: "veh_bike",
    name: "Xe Máy",
    type: "vehicle",
    weight: 3,
    bonusStep: 2,
    desc: "Lướt nhẹ như bay.",
    icon: `${ASSETS_URL}/vehicles/scooter.png`,
  },
  {
    id: "veh_car",
    name: "Ô Tô",
    type: "vehicle",
    weight: 5,
    bonusStep: 2,
    desc: "Có thể lội qua sông nước nhưng tốn rất nhiều chỗ.",
    icon: `${ASSETS_URL}/vehicles/military-jeep.png`,
  },
];

function getRandomItem() {
  // Lọc bỏ "Chảo" (id: wpn_chao) ra khỏi danh sách bốc thăm
  const lootableItems = ITEMS.filter(item => item.id !== "wpn_chao");
  
  const randomIndex = Math.floor(Math.random() * lootableItems.length);
  return lootableItems[randomIndex];
}

module.exports = { ITEMS, getRandomItem };

