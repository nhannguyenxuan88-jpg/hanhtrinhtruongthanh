# 🎓 Hành Trình Trưởng Thành

Ứng dụng giáo dục gia đình: bố mẹ giao nhiệm vụ, bé thực hiện và nhận Sao thưởng, kết hợp học tập theo Sách Giáo Khoa và rèn kỹ năng sống.

## ✨ Tính năng chính

- **📋 Nhiệm vụ & thưởng sao**: bố mẹ giao nhiệm vụ (một lần / hằng ngày / hằng tuần), con bấm hoàn thành kèm minh chứng, bố mẹ phê duyệt → Sao được cộng vào ví.
- **📅 Kế hoạch tuần**: kế hoạch học tập chi tiết theo từng bé (5 ngày T2–T6), tự động gợi ý bài SGK theo tuần học + khối lớp, kèm ghi chú việc riêng của bố mẹ. Con xem kế hoạch "Hôm Nay" và mở thẳng bài học.
- **📗 Sách Giáo Khoa**: đầy đủ bài học + trắc nghiệm theo mục lục KNTT:
  - **Lớp 2**: 70 bài (Tiếng Việt + Toán, 2 học kỳ) — 249 câu hỏi
  - **Lớp 8**: 49 bài (Ngữ văn + Toán 8 theo chương trình hiện hành) — 206 câu hỏi
  - Điểm số → Sao thưởng, thanh tiến độ từng quyển sách.
- **📚 Góc đọc sách**: truyện thiếu nhi kèm câu hỏi tương tác + rút bài học đạo đức.
- **🧮 Toán tư duy**: các chủ đề toán tương tác cho bé.
- **🎮 Khu game**: trò chơi nhỏ giải trí (arcade).
- **🎁 Cửa hàng quà tặng**: bé dùng Sao để đổi quà, bố mẹ xác nhận trao.
- **👨‍👩‍👧 Hồ sơ gia đình**: 1 tài khoản = 1 gia đình, mỗi bé một hồ sơ riêng có mã PIN.

## 🛠 Công nghệ

- React 19 + Vite 8
- Supabase (Auth email/password, PostgreSQL + RLS)
- canvas-confetti (hiệu ứng chúc mừng)

## 🚀 Chạy thử

```bash
npm install
npm run dev
```

## 🔌 Cấu hình Supabase

1. Tạo project tại [supabase.com](https://supabase.com)
2. Tạo file `.env` (tham khảo `.env.example`):

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

3. Chạy toàn bộ `supabase/schema.sql` trong **SQL Editor** của Supabase.

## 📁 Cấu trúc

| Đường dẫn | Nội dung |
|---|---|
| `src/App.jsx` | Toàn bộ giao diện + luồng logic ứng dụng |
| `src/lib/textbookData.js` | Dữ liệu SGK Lớp 2 (70 bài, 249 câu) |
| `src/lib/textbookData8.js` | Dữ liệu SGK Lớp 8 (49 bài, 206 câu) |
| `src/lib/api.js` | Lớp truy cập Supabase |
| `src/lib/booksData.js` | Thư viện truyện đọc |
| `src/lib/mathData.js` | Chủ đề Toán tư duy |
| `supabase/schema.sql` | Schema + migration đầy đủ |
