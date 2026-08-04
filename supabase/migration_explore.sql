-- =====================================================================
--  MIGRATION: mở rộng learning_sessions.kind cho khu "Khám Phá Thế Giới"
-- =====================================================================
--
--  VÌ SAO CẦN:
--  Bảng learning_sessions ban đầu chỉ ghi 3 loại hoạt động: bài SGK, đọc
--  sách và Toán tư duy. Nay app có thêm khu Khám Phá Thế Giới (khoa học,
--  cơ thể người, thiên nhiên, lịch sử - địa lý, an toàn sống) nên cần
--  thêm giá trị 'explore'.
--
--  CÁCH CHẠY: dán toàn bộ file này vào SQL Editor của Supabase rồi Run.
--  Chạy lại nhiều lần vẫn an toàn.
-- =====================================================================

alter table learning_sessions drop constraint if exists learning_sessions_kind_check;

alter table learning_sessions add constraint learning_sessions_kind_check
  check (kind in ('sgk', 'book', 'math', 'explore'));

-- Kiểm tra nhanh sau khi chạy (phải thấy 'explore' trong định nghĩa):
--   select conname, pg_get_constraintdef(oid)
--   from pg_constraint
--   where conrelid = 'learning_sessions'::regclass and contype = 'c';
