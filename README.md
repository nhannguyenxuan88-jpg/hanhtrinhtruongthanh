# 🎓 Hành Trình Trưởng Thành

Ứng dụng giáo dục gia đình: bố mẹ giao nhiệm vụ, bé thực hiện và nhận Sao thưởng, kết hợp học tập theo Sách Giáo Khoa và rèn kỹ năng sống.

## ✨ Tính năng chính

- **📋 Nhiệm vụ & thưởng sao**: bố mẹ giao nhiệm vụ (một lần / hằng ngày / hằng tuần), con bấm hoàn thành kèm minh chứng, bố mẹ phê duyệt → Sao được cộng vào ví.
- **🎯 Giao bài học trong app**: ba khu 📚 Đọc sách / 🧮 Toán tư duy / 🌍 Khám phá đều **khoá bài** — con chỉ mở được một bài khi bố mẹ đã giao **và** đã học xong bài liền trước. Trong tab Nhiệm vụ, bố mẹ giao bằng 1 cú bấm ở hai mức: `🔓 Mở cả khu` (con tự đi lần lượt hết khu) hoặc `Giao bài này` (mở đúng 1 bài), kèm tiến độ `đã xong n/tổng` của từng bé. Danh sách bài tự lấy theo lớp của con nên không thể giao truyện lớp 2 cho bạn lớp 8. Nhiệm vụ dạng này con **tự nhận sao khi học xong**, bố mẹ không phải duyệt lại (nên con cũng không thể nộp minh chứng để cộng sao lần hai).
- **📅 Kế hoạch tuần**: kế hoạch học tập chi tiết theo từng bé (5 ngày T2–T6), tự động gợi ý bài SGK theo tuần học + khối lớp, kèm ghi chú việc riêng của bố mẹ. Con xem kế hoạch "Hôm Nay" và mở thẳng bài học.
- **📗 Sách Giáo Khoa**: đầy đủ bài học + trắc nghiệm theo mục lục KNTT:
  - **Lớp 2**: 85 bài (Tiếng Việt + Toán 2 học kỳ, và Tiếng Anh Global Success) — 309 câu hỏi
  - **Lớp 8**: 73 bài (Ngữ văn + Toán 8 + Tiếng Anh 8) — 314 câu hỏi
  - Điểm số → Sao thưởng, thanh tiến độ từng quyển sách.
  - **Xem sách gốc PDF**: mỗi quyển sách có nút 📕 mở bản in PDF đầy đủ tranh minh hoạ.
- **📚 Góc đọc sách**: 23 truyện thiếu nhi (có 5 truyện cổ tích Việt Nam) kèm câu hỏi tương tác + rút bài học đạo đức; 9 bài kỹ năng sống cho tuổi teen (chủ động, tài chính, mục tiêu, cảm xúc, phương pháp học, tư duy phát triển, ranh giới cá nhân).
- **🧮 Toán tư duy**: 13 chủ đề chia theo độ tuổi — 9 chủ đề tiểu học (phép tính, đo lường, tiền Việt, giải toán có lời văn) và 4 chủ đề trung học (suy luận logic, phần trăm & lãi suất, xác suất & biểu đồ, hình học) — 65 câu hỏi.
- **🌍 Khám phá thế giới**: 10 chủ đề kiến thức nền — cơ thể người, động vật, cây xanh, Trái Đất, an toàn sống, Việt Nam quê hương (tiểu học) và khoa học đời sống, lịch sử, địa lý – môi trường, an toàn số (trung học) — 50 câu hỏi. **Cần chạy `supabase/migration_explore.sql`** nếu database đã cài từ trước.
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

4. **Nếu database đã cài từ trước**, chạy thêm `supabase/migration_explore.sql` để
   khu 🌍 Khám phá ghi được lịch sử học tập. Ràng buộc `learning_sessions.kind` cũ
   chỉ nhận `sgk / book / math`, câu lệnh này nới ra để nhận thêm `explore`.
   Cài mới từ `schema.sql` thì không cần bước này.
   *(Quên chạy cũng không sao: con vẫn nhận đủ sao, chỉ thiếu dòng trong Nhật ký học tập.)*

5. **Nếu database đã cài từ trước**, chạy thêm `supabase/migration_assign.sql` để
   bảng `tasks` có 2 cột `task_type` / `content_ref` — đây là thứ giúp nhiệm vụ trỏ
   cứng vào đúng bài học trong app. Cài mới từ `schema.sql` thì không cần bước này.
   *(Quên chạy thì `Giao bài này` vẫn chạy đúng và vẫn mở khoá được bài — chỉ riêng
   nút `🔓 Mở cả khu` là không mở khoá được. App không vỡ: `addTask` tự thử lại mà
   không kèm 2 cột đó, nên việc nhà vẫn giao được bình thường.)*

## 📁 Cấu trúc

| Đường dẫn | Nội dung |
|---|---|
| `src/App.jsx` | Toàn bộ giao diện + luồng logic ứng dụng |
| `src/components/TopicReader.jsx` | Bộ đọc "lý thuyết ➜ trắc nghiệm" dùng chung cho Toán tư duy & Khám phá |
| `src/lib/textbookData.js` | Dữ liệu SGK Lớp 2 (85 bài, 309 câu) gồm Tiếng Việt, Toán và Tiếng Anh 2 |
| `src/lib/textbookData8.js` | Dữ liệu SGK Lớp 8 (73 bài, 314 câu) gồm Ngữ văn, Toán và Tiếng Anh 8 |
| `src/lib/textbookPdfs.js` | Ánh xạ sách → file PDF bản gốc |
| `public/textbooks/` | Các file PDF SGK (đồng bộ bằng script bên dưới) |
| `scripts/copy-textbooks.cjs` | Chép PDF SGK từ Downloads/G:\ vào `public/textbooks/` |
| `src/lib/api.js` | Lớp truy cập Supabase |
| `src/lib/assignables.js` | Danh mục 3 khu nội dung bố mẹ giao được — nguồn sự thật dùng chung cho giao diện giao bài và luật khoá bài |
| `src/lib/learning.js` | Chấm sao, luật "bài này đã giao chưa", ôn tập lặp lại, bản tin tuần |
| `src/lib/booksData.js` | Thư viện truyện đọc (23 truyện bé + 9 bài kỹ năng teen) |
| `scripts/gen-book-illustrations.cjs` | Vẽ tranh SVG bù cho những trang truyện chưa có tranh vẽ tay |
| `src/lib/mathData.js` | Chủ đề Toán tư duy, chia `kids` / `teens` |
| `src/lib/exploreData.js` | Chủ đề Khám phá thế giới, chia `kids` / `teens` |
| `src/lib/tone.js` | Giọng điệu & tên tab theo độ tuổi (tiểu học / teen) |
| `supabase/schema.sql` | Schema + migration đầy đủ |
| `supabase/migration_explore.sql` | Nới ràng buộc `kind` cho khu Khám phá (chỉ dành cho DB cũ) |
| `supabase/migration_assign.sql` | Thêm `tasks.task_type` / `tasks.content_ref` để giao bài học trong app (chỉ dành cho DB cũ) |

## 📕 Đồng bộ sách giáo khoa PDF

Tải 10 quyển SGK Lớp 2 & Lớp 8 (chương trình mới 2026) về máy, để trong thư mục
Downloads hoặc `G:\Sách giáo khoa` (tên có `SGK-Tieng-Viet-2...`, `SGK-Toan-2...`,
`SGK-Ngu-van-8...`, `SGK-Toan-8...`, `SGK...tieng anh 8...` hoặc
`...bai tap tieng anh 8...`), rồi chạy:

```bash
node scripts/copy-textbooks.cjs
```

Script sẽ tự tìm và chép vào `public/textbooks/` với tên chuẩn. **Lưu ý**: 10 file
PDF tổng ~204MB, nên commit kèm để khi deploy lên Vercel/Netlify các con xem được.
Nút "📕 Xem sách gốc" chỉ hiện khi file PDF tương ứng đã được đồng bộ.
