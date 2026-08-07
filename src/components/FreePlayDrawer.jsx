import { useState } from 'react'

export default function FreePlayDrawer({
  isOpen,
  onClose,
  onSelectFeature
}) {
  if (!isOpen) return null

  const features = [
    { id: 'pika', title: 'Gia Sư Pika AI', emoji: '🐥', desc: 'Hỏi đáp bài học & giải toán 1:1', color: 'linear-gradient(135deg, #f59e0b, #eab308)' },
    { id: 'math', title: 'Toán Tư Duy Kurio Hub', emoji: '🧮', desc: 'Luyện thi IKMC, 1v1 Combat, Cổ tích Lô-gíc', color: 'linear-gradient(135deg, #4f46e5, #7c3aed)' },
    { id: 'books', title: 'Thư Viện Sách & Khám Phá', emoji: '📚', desc: 'Đọc truyện chữ & khám phá thế giới', color: 'linear-gradient(135deg, #0284c7, #2563eb)' },
    { id: 'shop', title: 'Cửa Hàng Đổi Quà', emoji: '🎁', desc: 'Dùng Sao đổi quà từ bố mẹ', color: 'linear-gradient(135deg, #ec4899, #d946ef)' },
    { id: 'arcade', title: 'Game Arcade & Huy Hiệu', emoji: '🎮', desc: 'Chơi game học tập & xem huy hiệu', color: 'linear-gradient(135deg, #10b981, #059669)' }
  ]

  return (
    <div className="free-play-drawer-overlay">
      <div className="free-play-drawer-dialog card glass animate-slide-up">
        <div className="drawer-header">
          <div className="drawer-title-box">
            <span className="drawer-emoji">🎮</span>
            <div>
              <h3>Sân Chơi Tự Do &amp; Kho Báu</h3>
              <p className="subtitle">Lựa chọn khu vực bạn muốn trải nghiệm!</p>
            </div>
          </div>
          <button type="button" className="btn-close-drawer" onClick={onClose}>
            ✕ Đóng
          </button>
        </div>

        <div className="drawer-features-grid">
          {features.map((item) => (
            <button
              key={item.id}
              type="button"
              className="drawer-feature-card"
              style={{ '--card-bg': item.color }}
              onClick={() => {
                onSelectFeature(item.id)
                onClose()
              }}
            >
              <span className="feature-emoji">{item.emoji}</span>
              <div className="feature-info text-left">
                <strong>{item.title}</strong>
                <p>{item.desc}</p>
              </div>
              <span className="arrow-icon">➔</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
