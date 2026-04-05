const MAP_TEMPLATES = {
  
  // 1. Núi Tuyết TỬ Thần (Có dải núi đá dày đặc và dòng sông băng rộng)
  map_snow: [
    ".iii.rrrrrtii..",
    "..i.........ii.",
    ".....t.......i.",
    "r...ttiiiitt...",
    "rr..iiiiiit....",
    "rr..i...b.....r",
    "rr..i...i....rr",
    "r...ii.ii.rrrrr",
    "r....iii....rrr",
    "r..ttt.....t..r",
    "iiiitt....i....",
    "iiiiii...ti..t.",
    "...r.b..tii..tr",
    "...ttii..tt.rrr",
    ".rrr.ii.tttrrrr",
  ],

  // 2. Rừng Nhiệt Đới (Bụi rậm bao quanh, ở giữa là đầm lầy độc khổng lồ)
  map_jungle: [
    "tttt....r..tttt",
    "ttt..r....t.ttt",
    "tt....p....tttt",
    "t....ppp......r",
    "...pppppp.....r",
    "t...pppppppp...",
    "t....pppppp...t",
    "r.....pppp.....",
    "r......prp...tr",
    "t..tt....t....t",
    "r..tt..........",
    "t.......t...r..",
    "tt...r.......tt",
    "ttt........tttt",
    "ttttwwwwwwwtttt",
  ],

  // 3. Khu Công Nghiệp (Nhiều nhà kho, tường rào và thùng xăng rải rác)
  map_factory: [
    "tt...rrr..hhh..",
    "t..x.....hhhhh.",
    "..........hhh..",
    "r.....x.......r",
    "rt.w.......w..r",
    ".....t.......tr",
    "..wt....x....hh",
    "h....r.......hh",
    "hh..r...tt...hh",
    "hh..r......r...",
    "hh.......x.r...",
    "h..........rt..",
    "..x....ww.....t",
    "....hhhhhhh...t",
    "rt..hhhhhhh..tt",
  ],

  // 4. Sa Mạc Hoang Vu (Rất ít vật cản, ở giữa là ốc đảo)
  map_desert: [
    "............r..",
    "..r............",
    ".....r.........",
    "..............r",
    ".......t.......",
    "......owo......",
    ".....oowto.....",
    "....oowwwoo....",
    ".....otwoo.....",
    "......ooo......",
    ".........r.....",
    ".............r.",
    "r..............",
    "..........r....",
    "...r...........",
  ],
};

// Hàm dịch bản đồ từ chuỗi văn bản sang mảng Object cho Server
function loadMapData(mapId) {
  const template = MAP_TEMPLATES[mapId] || MAP_TEMPLATES['map_snow'];
  const map = [];

  for (let y = 0; y < template.length; y++) {
    const row = [];
    for (let x = 0; x < template[y].length; x++) {
      const char = template[y][x];
      let type = "empty";

      // Phân loại địa hình dựa trên ký tự
      if (char === "w") type = "water";
      else if (char === "b") type = "bridge";
      else if (char === "r")
        type = "obstacle"; // Đá / Núi / Tường
      else if (char === "t")
        type = "bush"; // Bụi cây
      else if (char === "h")
        type = "warehouse"; // Nhà kho
      else if (char === "i")
        type = "ice"; // Sông băng
      else if (char === "p")
        type = "swamp"; // Đầm lầy độc
      else if (char === "x")
        type = "barrel"; // Thùng xăng
      else if (char === "o") type = "oasis"; // Ốc đảo

      row.push({ x, y, type, item: null });
    }
    map.push(row);
  }
  return map;
}

module.exports = { loadMapData, MAP_TEMPLATES }; // Export thêm MAP_TEMPLATES để Lobby có thể lấy danh sách map
