import React from "react";

export default function LoreModal({ onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(4px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#2c3036",
          width: "90%",
          maxWidth: "600px",
          borderRadius: "12px",
          padding: "0",
          overflow: "hidden",
          boxShadow: "0 10px 40px rgba(0,0,0,0.8)",
          border: "1px solid #4f545c",
        }}
      >
        <div
          style={{
            padding: "20px",
            backgroundColor: "#e67e22",
            color: "white",
            textAlign: "center",
          }}
        >
          <h2 style={{ margin: 0, textTransform: "uppercase" }}>
            📜 Bí Ẩn Đảo Hòn Gà
          </h2>
          <p style={{ margin: "5px 0 0 0", fontStyle: "italic" }}>
            Truyền thuyết "Bắn Gà Là Tạch"
          </p>
        </div>

        <div
          style={{
            padding: "25px",
            fontSize: "16px",
            lineHeight: "1.6",
            color: "#dcddde",
          }}
        >
          <p>
            Chuyện kể rằng, vị <strong>Tỷ phú ẩn danh Thích Ăn Gà</strong> vì
            quá rảnh rỗi đã bí mật gửi thư mời đến 10 nhân vật "cộm cán" nhất
            của khu phố...
          </p>
          <p>
            Tất cả bị đưa lên <strong>Đảo Hòn Gà</strong> biệt lập. Giải thưởng
            cho kẻ sống sót cuối cùng là <strong>100 Tỷ Đồng</strong>!
          </p>

          <div
            style={{
              padding: "15px",
              backgroundColor: "#202225",
              borderRadius: "8px",
              margin: "15px 0",
              borderLeft: "4px solid #e67e22",
            }}
          >
            <strong
              style={{
                display: "block",
                marginBottom: "10px",
                color: "#f1c40f",
              }}
            >
              Luật chơi rất đơn giản:
            </strong>
            <ul style={{ margin: 0, paddingLeft: "20px", color: "#bdc3c7" }}>
              <li style={{ marginBottom: "8px" }}>
                Nhặt mót vũ khí từ các <strong>Hòm thính tàng hình</strong>.
              </li>
              <li style={{ marginBottom: "8px" }}>
                Chạy trốn khỏi <strong>Vòng bo Khí Độc</strong> liên tục thu
                hẹp.
              </li>
              <li>
                Khi cạn kiệt HP, bạn sẽ biến thành <strong>GÀ</strong> và văng
                hết đồ đạc ra đất!
              </li>
            </ul>
          </div>
        </div>

        <div
          style={{
            padding: "15px 20px",
            backgroundColor: "#1e2124",
            textAlign: "right",
            borderTop: "1px solid #4f545c",
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "#27ae60",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "15px",
            }}
          >
            Đã Hiểu! Xông Lên ⚔️
          </button>
        </div>
      </div>
    </div>
  );
}
