# 💰 Mô Hình Kinh Doanh, Giá Cước & Thanh Toán (PLG SaaS)

File tài liệu này chi tiết hóa **Mô hình Kinh doanh Product-Led Growth (PLG)**, chiến lược dùng thử 14 ngày VIP, chính sách không khóa app, các gói giá cước và cổng thanh toán tự động VietQR PayOS.

---

## 1. Mô Hình PLG (Product-Led Growth — Cho Dùng Thử Trước, Thu Tiền Sau)

### Quy trình trải nghiệm 3 bước
1. **Đăng ký dùng thử (No Credit Card Required)**:
   - Nhập Email + Mật khẩu + PIN là dùng ngay.
   - Kích hoạt **14 ngày dùng thử VIP FULL TÍNH NĂNG** (Free 100%).
2. **Kích thích chuyển đổi trong 14 ngày (Value Moments)**:
   - Ngày 3: Bé tích sao đổi quà thành công $\rightarrow$ Hiện popup khen ngợi Bố Mẹ.
   - Ngày 7: Ưu đãi mua sớm (Early Bird Offer) giảm 40% cho Gói Năm (**299k/năm**).
3. **Chuyển sang gói Free Vĩnh Viễn sau 14 ngày (No-Lock Policy)**:
   - Hết 14 ngày trial nếu Bố Mẹ chưa nâng cấp: **Ứng dụng KHÔNG BỊ KHÓA, KHÔNG MẤT DỮ LIỆU**.
   - Chuyển sang gói Free vĩnh viễn: Giữ 100% số sao, cho phép dùng tính năng cơ bản (5 bài SGK/kỳ, 3 quyển sách, 5 việc nhà/tuần).

---

## 2. Bảng Giá Cước & Quyền Lợi Các Gói (Pricing Matrix)

| Quyền lợi | Gói Miễn Phí (Free Forever) | Gói Pro Tháng | Gói Pro Năm (Tiết kiệm 33%) | Gói Trường Học / Trung Tâm |
|:---|:---:|:---:|:---:|:---:|
| **Giá niêm yết** | **0 VNĐ** | **49.000đ / tháng** | **399.000đ / năm** (33k/tháng) | **15.000đ / học sinh / tháng** |
| **Số hồ sơ bé** | 1 bé | Không giới hạn | Không giới hạn | Theo sĩ số lớp |
| **Việc nhà active** | Tối đa 5 việc / tuần | Không giới hạn | Không giới hạn | Theo giáo viên giao |
| **Sách Giáo Khoa** | 5 bài đầu / học kỳ | Full Lớp 1 - 9 | Full Lớp 1 - 9 | Full Lớp 1 - 9 |
| **Đọc sách & Toán** | 3 sách + 3 bài toán | Full 100% thư viện | Full 100% thư viện | Full 100% thư viện |
| **Mini-Game Arcade** | 1 lượt / tuần | Không giới hạn lượt | Không giới hạn lượt | Theo giáo viên cài đặt |
| **AI Gia sư Cú Thông Thái** | Không hỗ trợ | Hỗ trợ 50 câu/tháng | Không giới hạn | Hỗ trợ cho học sinh |
| **Báo cáo Zalo / Email** | Không | Hàng tuần | Hàng tuần | Hàng tuần cho phụ huynh |

---

## 3. Tích Hợp Thanh Toán VietQR / PayOS Kích Hoạt Tự Động 2 Giây

### Quy trình chuyển khoản VietQR tự động
```
[Bố Mẹ chọn gói Pro 399k/năm]
       │
       ▼
[App gọi API PayOS / VietQR tạo mã QR động có sẵn số tiền & Mã Hóa Đơn]
       │
       ▼
[Bố Mẹ mở App Bank (Vietcombank, MBBank, MoMo...) quét mã QR và xác nhận]
       │
       ▼
[Ngân hàng gửi Webhook về Server PayOS -> Webhook đẩy về Supabase/Server App]
       │
       ▼
[Server cập nhật status plan_type = 'pro' -> App tự động nâng cấp sau 2 giây]
```

---

## 4. Hệ Thống Mã Giới Thiệu (Viral Referral System)

### Cơ chế "Cùng Có Lợi" (Win-Win Referral)
- Mỗi gia đình có 1 mã giới thiệu riêng (Ví dụ: `TUANG-ANH-88`).
- Bố Mẹ gửi mã cho bạn bè / phụ huynh cùng lớp của bé:
  - **Gia đình bạn bè**: Nhận ngay **14 ngày VIP trải nghiệm**.
  - **Gia đình giới thiệu**: Được cộng **thêm 10 ngày VIP miễn phí**.
- Nếu bạn bè nâng cấp Gói Năm Pro $\rightarrow$ Người giới thiệu được tặng **thêm 1 tháng Pro miễn phí**.
