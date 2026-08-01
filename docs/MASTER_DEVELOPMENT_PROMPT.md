# 🤖 MASTER DEVELOPMENT PROMPT & DIRECTIVE FRAMEWORK
## (Dành cho Lập trình viên & AI Assistant phát triển app "Hành Trình Trưởng Thành")

File tài liệu này chứa toàn bộ **System Prompt & Chỉ Đạo Kiến Trúc Cốt Lõi**. Bất kỳ AI Assistant (Gemini, Claude, GPT) hoặc Lập trình viên nào khi quay lại tiếp tục phát triển ứng dụng **PHẢI ĐỌC VÀ TUÂN THỦ 100% NGUYÊN TẮC TRONG FILE NÀY**.

---

## 🎯 1. TẦM NHÌN DỰ ÁN & VĂN HÓA THUẦN VIỆT

- **Tên ứng dụng**: **Hành Trình Trưởng Thành** (EdTech SaaS Thuần Việt).
- **Sứ mệnh**: Giúp học sinh (Lớp 1 đến Lớp 9) rèn luyện nếp sống tự lập, lòng hiếu thảo đỡ đần bố mẹ, chăm chỉ học SGK và hình thành các thói quen tốt mỗi ngày.
- **Định hướng Văn hóa**: **100% THUẦN VIỆT**. Tuyệt đối KHÔNG lai căng ứng dụng phương Tây:
  - Việc nhà là sự **hiếu thảo & giúp đỡ bố mẹ**, không phải giao dịch tiền bạc sòng phẳng.
  - Phần thưởng là **đặc quyền gắn kết gia đình** (*Mẹ nấu món con thích, Bố đưa đi chơi công viên, Về quê thăm Ông Bà*).
  - Bám sát 100% **Chương trình SGK Bộ GD&ĐT Việt Nam**.
  - Ngôn ngữ mộc mạc, gần gũi (Không dùng thuật ngữ tiếng Anh: dùng *Chuỗi Ngày Chăm Chỉ 🌾*, *Cấp Độ Ngoan 🌿*, *Việc Ngoan Hàng Ngày 🧹*).

---

## 🌟 2. 5 NGUYÊN TẮC VÀNG CHỈ ĐẠO LẬP TRÌNH (CORE DIRECTIVES)

```
1. INSTANT MICRO-REWARDS ➔ Pháo hoa + Sound Effect + Sao thưởng NGAY HÔM NAY (Không hứa suông tương lai).
2. BITE-SIZED CHALLENGES ➔ Mỗi bài học / việc nhà chỉ kéo dài 3-5 phút (Không tạo áp lực mệt mỏi).
3. GAME-FIRST & NO-FORCE ➔ Học để nuôi Cáo 🦊, giữ ngọn lửa 🌾 Chuỗi Ngày Chăm Chỉ (Biến học thành chơi).
4. ZERO PARENT FRICTION ➔ Giảm tải cho Bố Mẹ (Bật chế độ Auto-Approve, Nhập nhanh cuối tuần, Zalo notification).
5. DUAL-SYNC PERSISTENCE ➔ Lưu đúp Supabase + LocalStorage (Không bao giờ để mất Sao hay Lịch sử của bé).
```

---

## 🛠️ 3. QUY TẮC KỸ THUẬT & KIẾN TRÚC CODE (TECHNICAL RULES)

### A. Công Nghệ
- **Frontend**: React + Vite + Vanilla CSS (Glassmorphism, Dark/Kid Theme).
- **Database**: Supabase (PostgreSQL + RLS Security).
- **Gamification Engine**: `src/lib/gamification.js` (Hàm `getLevelInfo`, `calculateStreak`, `calculateBadges`).

### B. Quy Tắc Lưu Trữ 2 Lớp (Dual-Sync Persistence Rule)
- Mỗi khi bé hoàn thành bài học / việc nhà hoặc được cộng/trừ Sao:
  - **Lớp 1**: Ghi vào Supabase DB (`completions` & `star_transactions`).
  - **Lớp 2 (Dự phòng)**: Lưu trực tiếp vào `localStorage` (`child_completions_<childId>` & `child_balance_<childId>`).
- Khi `loadAppData()` chạy: Luôn hợp nhất (merge) dữ liệu giữa Supabase và `localStorage`. **TUYỆT ĐỐI KHÔNG ĐỂ MẤT DỮ LIỆU BÉ ĐÃ TÍCH LŨY**.

### C. Quy Tắc Chống Gian Lận (Anti-Duplicate & Pace Control Rule)
- Trước khi `addStars`: Luôn kiểm tra xem `completions` đã có bản ghi `approved` cho cùng `task_id` + `child_id` chưa.
- Kiểm tra tốc độ đọc (Pace Check): Bài đọc phải duy trì tối thiểu 15-20s trước khi mở nút trắc nghiệm.
- Yêu cầu trắc nghiệm: Đạt $\ge 50\%$ câu đúng mới được nhận sao.

---

## 📋 4. PROMPT HƯỚNG DẪN AI KHI THỰC HIỆN CÁC PHÂN HỆ TIẾP THEO

Khi yêu cầu AI phát triển các tính năng tiếp theo, bạn chỉ cần copy đoạn Prompt khung dưới đây:

```text
[SYSTEM PROMPT DÀNH CHO AI DEVELOPER]
Bạn là Chuyên gia Lập trình EdTech phát triển ứng dụng "Hành Trình Trưởng Thành".
Hãy đọc kỹ tài liệu kiến trúc tại:
- docs/MASTER_DEVELOPMENT_PROMPT.md
- docs/DESIGN_PRINCIPLES.md
- docs/VIETNAMESE_CULTURE_DESIGN.md
- docs/COMMERCIALIZATION_MODEL.md
- docs/TECHNICAL_SCHEMA_API.md

Nhiệm vụ của bạn là nâng cấp tính năng [TÊN TÍNH NĂNG NÂNG CẤP] tuân thủ nghiêm ngặt:
1. Giao diện & Ngôn ngữ Thuần Việt 100%, mộc mạc, gần gũi.
2. Áp dụng cơ chế lưu đúp Dual-Sync LocalStorage + Supabase chống mất dữ liệu.
3. Thưởng luồng Dopamine tức thì (Pháo hoa, Sound effect, Toast notification).
4. Code sạch, tối ưu component, chạy build `npm run build` không lỗi trước khi commit.
```

---

## 🗓️ 5. BẢNG CHECKLIST CÁC PHÂN HỆ TIẾP THEO

- [ ] **Phân hệ 1**: Chế độ "Tự Động Duyệt Tin Tưởng" (Auto-Approve Trust Mode) cho Bố Mẹ.
- [ ] **Phân hệ 2**: Thuật toán Thưởng Sao Động (Bonus Tự Giác trước 20h + Combo Điểm Tuyệt Đối).
- [ ] **Phân hệ 3**: Bảng Subscriptions 14 Ngày VIP Free Trial $\rightarrow$ Free Plan vĩnh viễn $\rightarrow$ VietQR PayOS Auto Payment.
- [ ] **Phân hệ 4**: AI Gia Sư "Cú Thông Thái 🦉" (Gemini Flash API) & Báo cáo Zalo ZNS / Email.
- [ ] **Phân hệ 5**: Bổ sung kho bài học SGK Lớp 1, 3, 4, 5, 6, 7, 9 & Portal Trường Học.
