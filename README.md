# 🐔 BẮN GÀ LÀ TẠCH - TURN-BASED BATTLE ROYALE LITE 🐔

![React](https://img.shields.io/badge/Client-React.js-61DAFB?style=flat-square&logo=react)
![Nodejs](https://img.shields.io/badge/Server-Node.js-339933?style=flat-square&logo=node.js)
![Socket.io](https://img.shields.io/badge/Realtime-Socket.io-010101?style=flat-square&logo=socket.io)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)

**Bắn Gà Là Tạch** không chỉ là một tựa game Web thông thường. Đây là một dự án **Boardgame Sinh Tồn Chiến Thuật (Turn-based Tactical Battle Royale)** kết nối thời gian thực, nơi tư duy logic, khả năng tính toán lượt đi và một chút "nhân phẩm" sẽ quyết định ai là kẻ cầm lấy 100 Tỷ Đồng, và ai sẽ phải mọc lông hóa gà!

---

## 📸 MỘT SỐ HÌNH ẢNH TRONG GAME

*(Thay thế link ảnh của bạn vào đây)*

| Sảnh Chờ & Chọn Tướng | Bản Đồ Chiến Thuật & Sương Mù |
| :---: | :---: |
| ![Lobby]([ĐIỀN-LINK-ẢNH-LOBBY-VÀO-ĐÂY]) | ![Gameplay]([ĐIỀN-LINK-ẢNH-GAMEPLAY-VÀO-ĐÂY]) |

| Cửa Sổ Loot Đồ Chuyên Nghiệp | Khoảnh Khắc Hóa Gà Tự Hủy |
| :---: | :---: |
| ![Looting]([ĐIỀN-LINK-ẢNH-LOOT-VÀO-ĐÂY]) | ![Chicken]([ĐIỀN-LINK-ẢNH-HOA-GA-VÀO-ĐÂY]) |

---

## 📜 CỐT TRUYỆN: BÍ ẨN ĐẢO HÒN GÀ

Chuyện kể rằng, vị **Tỷ phú ẩn danh Thích Ăn Gà** vì quá rảnh rỗi đã gửi thư mời đến 10 nhân vật "cộm cán" nhất của khu phố. Tất cả bị đánh thuốc mê và ném lên **Đảo Hòn Gà** biệt lập. 

Tại đây, họ bị tước sạch vũ khí, chỉ được phát cho một chiếc ba lô trống rỗng. Giải thưởng cho kẻ sống sót cuối cùng là **100 Tỷ Đồng**. Còn những kẻ gục ngã? Họ sẽ bị văng sạch đồ đạc, biến thành những con Gà kêu quang quác, bất lực đi loanh quanh nhìn kẻ thù giành chiến thắng. Cuộc chiến bắt đầu!

---

## ⚔️ LUẬT CHƠI & LỐI CHƠI BÁ ĐẠO

Game diễn ra theo hình thức **Lượt đi (Turn-based)**. Trong mỗi lượt của mình, Đặc nhiệm sẽ trải qua các giai đoạn:

### 1. 🏃 Giai đoạn Di Chuyển & Khám Phá
* Người chơi được cấp một số **Bước đi** nhất định (có thể tăng thêm nhờ Ván Trượt hoặc Ô Tô).
* Lục lọi **Hòm Thính Tàng Hình** rải rác trên bản đồ để loot đồ.
* **Cảnh báo:** Hãy cẩn thận những ô đất trống! **Băng Cướp Đảo** đã giăng sẵn những cái bẫy vô hình. Nếu đạp phải, bạn buộc phải chọn: *Chịu mất Máu* hoặc *Giao nộp một món trang bị đắt giá*.

### 2. 🎒 Cơ Chế Ba Lô Thực Tế (Inventory System)
* Không phải cứ nhặt là được! Mỗi nhân vật có **Giới hạn Cân nặng (Weight Limit)** riêng.
* Bạn phải tính toán đánh đổi: Mang theo *Súng Ngắm* hạng nặng để bắn tỉa, hay ưu tiên *Áo Giáp* và *Băng Gạc* để sinh tồn? Cần nới rộng kho chứa? Hãy tìm kiếm *Siêu Ba Lô*!

### 3. 🎯 Giai đoạn Tấn Công & Xả Kỹ Năng
* Sử dụng vũ khí để kết liễu kẻ thù. Mỗi loại vũ khí có cơ chế riêng biệt:
    * **Cận chiến (Chảo, Điếu Cày):** Sát thương cao, cận chiến.
    * **Súng ống:** Bắn thẳng, bị cản bởi Đá và Lùm cây.
    * **Lựu đạn / Bazooka:** Bắn vượt địa hình, nổ lan AoE (Hình chữ thập hoặc 3x3), có thể gây sát thương lên cả bản thân nếu ném lỗi ("Tự hủy").
* **Tương tác môi trường:** Bắn nổ *Thùng Xăng* để tạo ra các pha quét sạch bản đồ!

### 4. 🌫️ Sương Mù Chiến Tranh (Fog of War)
Tầm nhìn là thứ vũ khí nguy hiểm nhất trong game:
* Người chơi chỉ nhìn thấy kẻ địch trong phạm vi xung quanh.
* Lẩn trốn vào **Bụi Cây (Bush)**: Kẻ địch phải đứng sát rạt mới phát hiện ra bạn.
* Chui vào **Nhà Kho (Warehouse)**: Tầm nhìn bị giam hãm hoàn toàn trong khu nhà, tạo ra những pha "núp lùm" giật gân.
* **Lựu Đạn Khói (Ninja Vanish):** Bị quây? Ném ngay xuống chân tạo vùng khói 3x3 khiến mọi kẻ địch bắn trượt, và bạn từ từ tẩu thoát!

### 5. ☣️ Vòng Bo Tử Thần
Cứ sau mỗi 3 Vòng chơi, ranh giới **Bo Khí Độc** sẽ thu hẹp lại. Đứng ngoài vùng an toàn sẽ bị trừ máu liên tục cho đến khi hóa gà.

---

## 🦸 HỆ THỐNG ĐẶC NHIỆM

10 nhân vật mang theo 10 phong cách chơi khác biệt:
* **Cường Cục Súc:** Thức tỉnh sức mạnh (Tăng sát thương) khi máu tụt xuống mức báo động.
* **Trí Trốn Tìm:** Ninja thực thụ, 100% né đạn xạ thủ khi đang ẩn nấp trong bụi cây.
* **Phát Phong Thủy:** Được tổ tiên độ, luôn khởi đầu game với một món Vũ khí random trên tay.
* **Tài Tốc Độ:** Khởi đầu đã có Ván Trượt, bá chủ việc "chạy bo".
* **Thảo Thó Đồ:** Kẻ trộm tinh ranh! Tấn công cận chiến có tỷ lệ ăn cắp vật phẩm thẳng từ ba lô nạn nhân.
* *(Và nhiều nhân vật ẩn khác đang chờ bạn khám phá...)*

---

## 📂 CẤU TRÚC KIẾN TRÚC MÃ NGUỒN (CLEAN ARCHITECTURE)

Dự án được tối ưu hóa với mô hình chia nhỏ module (Refactored) cực kỳ gọn gàng, dễ dàng mở rộng tính năng:

```text
ban-ga-la-tach/
├── client/                     # GIAO DIỆN REACT (FRONTEND)
│   ├── src/
│   │   ├── components/         # Các mảnh ghép giao diện
│   │   │   ├── Board.jsx       # Component Bàn Cờ (Render Lưới & Hiệu ứng)
│   │   │   ├── PlayerDashboard.jsx # Bảng điều khiển, Máu, Giáp, Ba Lô
│   │   │   ├── GamePopups.jsx  # Quản lý sự kiện hiển thị (Loot, Cướp, Game Over)
│   │   │   ├── Lobby.jsx       # Màn hình sảnh đăng nhập
│   │   │   └── LoreModal.jsx   # Cửa sổ cốt truyện
│   │   ├── utils/
│   │   │   └── boardHelpers.jsx# Hàm tính toán logic UI (Màu nền, Icon)
│   │   └── App.jsx             # Router điều hướng chính của Client
│
└── server/                     # MÁY CHỦ SOCKET.IO (BACKEND)
    ├── data/                   # Kho dữ liệu cứng
    │   ├── characters.js       # Chỉ số & kỹ năng Tướng
    │   ├── items.js            # Kho Vũ khí, Phương tiện, Hỗ trợ
    │   └── maps.js             # Dữ liệu Ma trận 4 bản đồ khác nhau
    ├── handlers/               # Quản lý Logic chia theo miền
    │   ├── roomHandler.js      # Vào phòng, Chọn tướng, Khởi tạo Game
    │   ├── actionHandler.js    # Di chuyển, Bẫy cướp, Nhặt/Tráo đồ, Ném khói
    │   └── combatHandler.js    # Tính toán đường đạn, Sát thương AoE, Bo thu hẹp
    ├── utils/                  # Hàm tiện ích Backend
    │   └── gameHelpers.js      # Ghi Log, Lọc Sương Mù (Fog of War)
    └── index.js                # Core Server Entry Point (Cực kỳ gọn nhẹ)
