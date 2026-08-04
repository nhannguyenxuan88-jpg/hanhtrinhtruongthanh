// Hình minh hoạ emoji cho từng step trong Khám Phá Thế Giới.
// Mỗi step có: emojis (dãy emoji to), bg (gradient nền), label (chú thích ngắn)
// TopicReader dùng file này để vẽ "ô tranh" phía trên đoạn chữ, giúp bé
// nhìn vào biết ngay bài nói về gì mà không cần đọc tiêu đề.

export const exploreIllustrations = {
  // ===== Cơ thể em kỳ diệu =====
  kp_co_the: [
    { emojis: '❤️‍🔥 🫀 💓', bg: 'linear-gradient(135deg, #ff6b6b, #ee5a24)', label: 'Trái tim bơm máu' },
    { emojis: '🫁 🦴 💪', bg: 'linear-gradient(135deg, #74b9ff, #0984e3)', label: 'Phổi & xương' },
    { emojis: '👁️ 👃 👂 👅 🖐️', bg: 'linear-gradient(135deg, #a29bfe, #6c5ce7)', label: '5 giác quan' },
  ],
  // ===== Thế giới loài vật =====
  kp_dong_vat: [
    { emojis: '🐶 🐱 🐦 🐟 🦎', bg: 'linear-gradient(135deg, #55efc4, #00b894)', label: 'Các nhóm động vật' },
    { emojis: '🌿 ➜ 🦗 ➜ 🐸 ➜ 🐍 ➜ 🦅', bg: 'linear-gradient(135deg, #ffeaa7, #fdcb6e)', label: 'Chuỗi thức ăn' },
    { emojis: '🥚 🐛 🫘 🦋', bg: 'linear-gradient(135deg, #fd79a8, #e84393)', label: 'Vòng đời bướm' },
  ],
  // ===== Cây xanh & thiên nhiên =====
  kp_cay_xanh: [
    { emojis: '🌱 🪵 🌿 🌸 🍎', bg: 'linear-gradient(135deg, #00b894, #00cec9)', label: 'Bộ phận cây' },
    { emojis: '☀️ 💧 🌿 ➜ 🍃 💨', bg: 'linear-gradient(135deg, #81ecec, #00b894)', label: 'Quang hợp' },
    { emojis: '☀️ 💧 ☁️ 🌧️ 🌊', bg: 'linear-gradient(135deg, #74b9ff, #0984e3)', label: 'Vòng tuần hoàn nước' },
  ],
  // ===== Trái Đất và bầu trời =====
  kp_trai_dat: [
    { emojis: '🌍 🔄 ☀️ 🌙', bg: 'linear-gradient(135deg, #2d3436, #636e72)', label: 'Ngày & đêm' },
    { emojis: '🌸 ☀️ 🍂 ❄️', bg: 'linear-gradient(135deg, #6c5ce7, #a29bfe)', label: 'Bốn mùa' },
    { emojis: '🌕 🌖 🌗 🌘 🌑 ⭐', bg: 'linear-gradient(135deg, #0c2461, #1e3799)', label: 'Mặt Trăng & sao' },
  ],
  // ===== An toàn cho bé =====
  kp_an_toan: [
    { emojis: '🚦 🚗 🦺 🪖', bg: 'linear-gradient(135deg, #e17055, #d63031)', label: 'An toàn giao thông' },
    { emojis: '⚡ 🔥 🌊 🧯', bg: 'linear-gradient(135deg, #fdcb6e, #e17055)', label: 'Điện, lửa & nước' },
    { emojis: '🚨 📱 👮 🙅', bg: 'linear-gradient(135deg, #ff7675, #d63031)', label: 'Người lạ & lạc đường' },
  ],
  // ===== Việt Nam quê hương em =====
  kp_viet_nam: [
    { emojis: '🇻🇳 🗺️ 🏔️ 🏖️', bg: 'linear-gradient(135deg, #e74c3c, #f1c40f)', label: 'Đất nước hình chữ S' },
    { emojis: '⚔️ 🏯 🎌 📜', bg: 'linear-gradient(135deg, #c0392b, #8e44ad)', label: 'Lịch sử dân tộc' },
    { emojis: '🧧 🏮 🎎 👘', bg: 'linear-gradient(135deg, #e74c3c, #e67e22)', label: 'Văn hoá Việt' },
  ],
  // ===== Khoa học đời sống (teens) =====
  kp_khoa_hoc_ds: [
    { emojis: '💡 🔌 📊 💰', bg: 'linear-gradient(135deg, #f39c12, #e74c3c)', label: 'Điện & hoá đơn' },
    { emojis: '⚗️ 🧪 🔬 🧲', bg: 'linear-gradient(135deg, #2ecc71, #1abc9c)', label: 'Phản ứng hoá học' },
    { emojis: '🍚 🥩 🥛 🥗', bg: 'linear-gradient(135deg, #e67e22, #f39c12)', label: 'Dinh dưỡng' },
  ],
  // ===== Dấu mốc lịch sử Việt Nam (teens) =====
  kp_lich_su_vn: [
    { emojis: '🏛️ ⚔️ 👑 🐉', bg: 'linear-gradient(135deg, #8e44ad, #2c3e50)', label: 'Dựng nước' },
    { emojis: '🏯 📜 🛡️ 🐘', bg: 'linear-gradient(135deg, #c0392b, #e74c3c)', label: 'Các triều đại' },
    { emojis: '🇻🇳 ✊ 🌾 🚀', bg: 'linear-gradient(135deg, #e74c3c, #f39c12)', label: 'Thời hiện đại' },
  ],
  // ===== Địa lý & môi trường (teens) =====
  kp_dia_ly_mt: [
    { emojis: '🌧️ ⛰️ 🌾 🏖️', bg: 'linear-gradient(135deg, #2980b9, #27ae60)', label: 'Khí hậu & địa hình' },
    { emojis: '🌡️ 🏭 🧊 🌊', bg: 'linear-gradient(135deg, #e74c3c, #8e44ad)', label: 'Biến đổi khí hậu' },
    { emojis: '♻️ 🗑️ 🌱 🌍', bg: 'linear-gradient(135deg, #27ae60, #2ecc71)', label: 'Rác thải & 3R' },
  ],
  // ===== An toàn số & tư duy phản biện (teens) =====
  kp_an_toan_so: [
    { emojis: '🎣 📧 🚫 🔐', bg: 'linear-gradient(135deg, #e74c3c, #c0392b)', label: 'Lừa đảo trực tuyến' },
    { emojis: '📰 🔍 ✅ ❌', bg: 'linear-gradient(135deg, #f39c12, #e67e22)', label: 'Tin giả' },
    { emojis: '👣 🔒 🛡️ 💬', bg: 'linear-gradient(135deg, #3498db, #2c3e50)', label: 'Dấu chân số' },
  ],
}
