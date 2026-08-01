# 🧮 Chi Tiết Thuật Toán Logic & Gamification

File tài liệu này quy định chi tiết các **công thức toán học, thuật toán kiểm soát và logic xử lý** của ứng dụng **Hành Trình Trưởng Thành**.

---

## 1. Thuật Toán Lặp Lại Ngắt Quảng (Spaced Repetition Review)

### Mục đích
Giúp bé ghi nhớ sâu kiến thức SGK, Đọc sách và Toán tư duy bằng cách nhắc nhở ôn lại các bài bé làm sai hoặc đạt điểm chưa cao đúng vào các "thời điểm vàng" của não bộ (3 ngày và 7 ngày sau khi làm).

### Công thức & Quy trình Logic
1. Mỗi khi bé hoàn thành 1 bài trắc nghiệm:
   - Tính tỷ lệ đúng $P = \frac{\text{Số câu đúng}}{\text{Tổng số câu}}$.
   - Nếu $P < 0.8$ (dưới 80% câu đúng), hệ thống gắn nhãn `need_review: true` và ghi nhận `review_due_date = current_date + 3 days`.
2. Trong tab **"📅 Hôm Nay"**, hệ thống check:
   - Nếu `today >= review_due_date` $\rightarrow$ Đưa bài học đó vào mục **"🧩 Bài cần ôn tập hôm nay"**.
3. Nếu bé ôn lại và đạt $P \ge 0.8$ $\rightarrow$ Đổi `review_due_date = current_date + 7 days`. Nếu tiếp tục đạt $P \ge 0.9$ $\rightarrow$ Gỡ nhãn `need_review`.

---

## 2. Thuật Toán Chỉ Số Nếp Sống (Habit Score Index - 0 đến 100 Điểm)

### Mục đích
Đánh giá độ trưởng thành, tự giác và nề nếp của bé qua một chỉ số điểm số trực quan (từ 0 đến 100 điểm) hiển thị trên Dashboard Bố Mẹ và Header của Bé.

### Công thức tính điểm ($H$)
$$H = w_1 \cdot S_{\text{time}} + w_2 \cdot S_{\text{completion}} + w_3 \cdot S_{\text{streak}}$$

Trong đó:
- $w_1 = 0.35$ (Trọng số Đúng giờ).
- $w_2 = 0.40$ (Trọng số Tỷ lệ Hoàn thành).
- $w_3 = 0.25$ (Trọng số Chuỗi Kiên trì - Streak).

#### Chi tiết các thành phần:
1. **Điểm Đúng Giờ ($S_{\text{time}}$)**:
   - Học bài trước 20h00: 100 điểm.
   - Học từ 20h00 - 21h00: 80 điểm.
   - Học sau 21h00: 50 điểm.
2. **Điểm Tỷ Lệ Hoàn Thành ($S_{\text{completion}}$)**:
   - $S_{\text{completion}} = \frac{\text{Số nhiệm vụ & bài học hoàn thành trong tuần}}{\text{Tổng số giao trong tuần}} \times 100$.
3. **Điểm Chuỗi Kiên Trì ($S_{\text{streak}}$)**:
   - $S_{\text{streak}} = \min\left(100, \text{Streak\_Days} \times 14.28\right)$ (Đạt 7 ngày streak = 100 điểm).

---

## 3. Thuật Toán Chống Đọc Lướt Gian Lận (Anti-Cheating Reading Pace Control)

### Mục đích
Đảm bảo bé thực sự đọc và ngẫm nghĩ bài thơ / câu chuyện trước khi bấm trắc nghiệm nhận sao, tránh tình trạng click lướt vèo 1-2 giây để lấy sao.

### Logic kiểm soát
1. Khi bé mở một bài đọc SGK hoặc truyện chữ:
   - Đếm số từ trong bài đọc $W$.
   - Tốc độ đọc trung bình chuẩn của trẻ em tiểu học là $v \approx 100 - 120 \text{ từ/phút}$ ($\approx 1.8 \text{ từ/giây}$).
   - Thời gian tối thiểu yêu cầu $T_{\min} = \max\left(10, \frac{W}{2.5}\right)$ (giây).
2. Nút **"🧩 Bắt đầu trắc nghiệm"** hoặc **"Trang tiếp"**:
   - Trong $T_{\min}$ giây đầu tiên: Nút hiển thị dạng đếm ngược: `⏳ Bé đọc kỹ bài nhé (còn Xs)`.
   - Hết $T_{\min}$ giây: Nút đổi màu xanh lá và sáng lên: `🧩 Bắt đầu trắc nghiệm!`.

---

## 4. Thuật Toán Thưởng Sao Động (Dynamic Star Multipliers)

### Mục đích
Tạo sự phấn khích, thưởng xứng đáng cho sự tự giác và nỗ lực xuất sắc của bé.

### Quy tắc nhân Sao
Số sao nhận được = $\text{Base\_Stars} \times \text{Multiplier} + \text{Bonus}$

| Điều kiện | Multiplier / Bonus | Ghi chú |
|:---|:---:|:---|
| Trả lời đúng 100% lần đầu | Multiplier $1.5\times$ | Thưởng bé học giỏi xuất sắc |
| Làm bài trước 20h00 | Bonus $+2$ ⭐ | Thưởng bé tự giác đúng giờ |
| Đạt Streak $\ge 7$ ngày | Multiplier $1.2\times$ | Thưởng bé kiên trì duy trì nếp sống |
| Trả lời đúng 3 câu liên tiếp | Bật hiệu ứng Combo 🔥 | Pháo hoa nổ ngập màn hình |
