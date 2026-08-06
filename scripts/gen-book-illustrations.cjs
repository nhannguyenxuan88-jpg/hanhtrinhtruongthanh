#!/usr/bin/env node
/**
 * Vẽ tranh minh hoạ SVG cho những truyện chưa có ảnh riêng.
 *
 * VÌ SAO DÙNG SVG THAY VÌ ẢNH THẬT:
 * Bốn truyện này được thêm vào sau nên chưa có tranh vẽ. Trình đọc có sẵn khung
 * dự phòng 📖 khi thiếu ảnh, nhưng ba trang liền nhau đều một khung xám giống
 * hệt nhau thì bé không phân biệt được đang đọc đến đâu — mất hẳn cảm giác lật
 * sách. SVG chỉ vài trăm byte, không cần tải về, và hiện đúng trên mọi máy.
 *
 * Chạy lại an toàn nhiều lần: file cùng tên sẽ bị ghi đè.
 *   node scripts/gen-book-illustrations.cjs
 *
 * Muốn thay bằng tranh vẽ thật thì chỉ cần đặt file ảnh vào
 * public/assets/books/ và sửa đường dẫn trong src/lib/booksData.js.
 */

const fs = require('fs')
const path = require('path')

const OUT_DIR = path.join(__dirname, '..', 'public', 'assets', 'books')

// Mỗi cảnh: emoji kể lại nội dung trang + chú thích ngắn để bé nhớ mạch truyện
const SCENES = [
  // ===== Ba Chú Heo Con =====
  { file: 'ba_chu_heo_con_1', from: '#f472b6', to: '#db2777',
    emojis: '🐷🌾🪵🧱', title: 'Ba Chú Heo Con', caption: 'Ba căn nhà: rơm, gỗ và gạch' },
  { file: 'ba_chu_heo_con_2', from: '#64748b', to: '#334155',
    emojis: '🐺💨🏚️', title: 'Ba Chú Heo Con', caption: 'Sói thổi sập nhà rơm và nhà gỗ' },
  { file: 'ba_chu_heo_con_3', from: '#f59e0b', to: '#dc2626',
    emojis: '🧱🏠✨', title: 'Ba Chú Heo Con', caption: 'Nhà gạch vững vàng, Sói tháo chạy' },

  // ===== Bé Học Quản Lý Tiền Tiêu Vặt =====
  { file: 'tiet_kiem_1', from: '#fbbf24', to: '#f97316',
    emojis: '💰🍬🧸', title: 'Quản Lý Tiền Tiêu Vặt', caption: 'Có tiền là mua kẹo ngay' },
  { file: 'tiet_kiem_2', from: '#f9a8d4', to: '#ec4899',
    emojis: '📚🐷💭', title: 'Quản Lý Tiền Tiêu Vặt', caption: 'Nuôi heo đất để tự mua sách' },
  { file: 'tiet_kiem_3', from: '#34d399', to: '#059669',
    emojis: '🐷📚🎉', title: 'Quản Lý Tiền Tiêu Vặt', caption: 'Chia 3 phần: tiết kiệm, học, cho đi' },

  // ===== Cây Tre Trăm Đốt =====
  { file: 'cay_tre_1', from: '#a3e635', to: '#16a34a',
    emojis: '🌾👨‍🌾☀️', title: 'Cây Tre Trăm Đốt', caption: 'Ba năm cày cấy chăm chỉ' },
  { file: 'cay_tre_2', from: '#166534', to: '#052e16',
    emojis: '🌳🔍😢', title: 'Cây Tre Trăm Đốt', caption: 'Tìm khắp rừng, không cây tre nào đủ 100 đốt' },
  { file: 'cay_tre_3', from: '#22d3ee', to: '#0e7490',
    emojis: '✨🎍🙏', title: 'Cây Tre Trăm Đốt', caption: '"Khắc nhập, khắc nhập!"' },

  // ===== Rùa Và Thỏ: Bài Học Kỷ Luật =====
  { file: 'rua_tho_1', from: '#60a5fa', to: '#2563eb',
    emojis: '🐰🐢🏁', title: 'Rùa Và Thỏ: Bài Học Kỷ Luật', caption: 'Thỏ xin đua lại một lần nữa' },
  { file: 'rua_tho_2', from: '#fcd34d', to: '#ea580c',
    emojis: '🐰💨🐢', title: 'Rùa Và Thỏ: Bài Học Kỷ Luật', caption: 'Rùa vẫn đi đều từng bước, không nản' },
  { file: 'rua_tho_3', from: '#818cf8', to: '#4338ca',
    emojis: '🤝🐰🐢', title: 'Rùa Và Thỏ: Bài Học Kỷ Luật', caption: 'Thắng nhờ tốc độ, học được kỷ luật' },

  // ===== Hai trang lẻ của truyện cổ tích Việt Nam =====
  // Hai truyện dưới đây đã có tranh vẽ tay cho các trang khác; chỉ thiếu đúng
  // trang này nên vẽ bù bằng SVG cho đủ mạch, không thay các tranh đang dùng.
  { file: 'an_khe_tra_vang_3', from: '#0ea5e9', to: '#1e3a8a',
    emojis: '🦅💰🌊', title: 'Ăn Khế Trả Vàng', caption: 'Túi mười hai gang quá nặng, người anh rơi xuống biển' },
  { file: 'mai_an_tiem_3', from: '#4ade80', to: '#dc2626',
    emojis: '🍉🌊⛵', title: 'Sự Tích Dưa Hấu', caption: 'Khắc tên lên vỏ dưa, thả trôi ra biển' },
]

// Chữ dài phải nhỏ lại, nếu không sẽ tràn ra ngoài khung 800px
function fitFontSize(text, maxWidth, idealSize) {
  // Arial rộng trung bình ~0.52em mỗi ký tự
  const needed = Math.floor(maxWidth / (text.length * 0.52))
  return Math.min(idealSize, Math.max(14, needed))
}

const escapeXml = (s) => s
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

function buildSvg({ from, to, emojis, title, caption }) {
  const emojiSize = emojis.length > 6 ? 120 : 150
  const titleSize = fitFontSize(title, 740, 40)
  const captionSize = fitFontSize(caption, 740, 26)

  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bg)"/>
  <circle cx="120" cy="110" r="70" fill="#ffffff" opacity="0.08"/>
  <circle cx="690" cy="500" r="100" fill="#ffffff" opacity="0.08"/>
  <circle cx="620" cy="90" r="45" fill="#ffffff" opacity="0.06"/>
  <text x="400" y="320" font-family="Segoe UI Emoji, Apple Color Emoji, sans-serif" font-size="${emojiSize}" text-anchor="middle">${escapeXml(emojis)}</text>
  <text x="400" y="450" font-family="Arial, sans-serif" font-size="${titleSize}" font-weight="bold" fill="#ffffff" text-anchor="middle">${escapeXml(title)}</text>
  <text x="400" y="505" font-family="Arial, sans-serif" font-size="${captionSize}" fill="#ffffff" opacity="0.9" text-anchor="middle">${escapeXml(caption)}</text>
</svg>
`
}

fs.mkdirSync(OUT_DIR, { recursive: true })
SCENES.forEach(scene => {
  const target = path.join(OUT_DIR, `${scene.file}.svg`)
  fs.writeFileSync(target, buildSvg(scene), 'utf8')
  console.log('✓', path.relative(process.cwd(), target))
})
console.log(`\nĐã vẽ ${SCENES.length} tranh minh hoạ.`)
