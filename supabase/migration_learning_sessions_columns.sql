-- =====================================================
-- MIGRATION: Bổ sung các cột còn thiếu cho learning_sessions
-- =====================================================
-- TRIỆU CHỨNG: Console báo
--   "Could not find the 'quiz_first_try' column of 'learning_sessions'
--    in the schema cache" (HTTP 400 khi ghi lịch sử học tập)
-- NGUYÊN NHÂN: bảng learning_sessions trên máy chủ được tạo từ phiên bản
-- migration cũ, thiếu các cột mà bản code hiện tại gửi lên.
-- CÁCH CHẠY: Supabase Dashboard → SQL Editor → dán toàn bộ file này → Run.
-- An toàn chạy lại nhiều lần (add column if not exists).

alter table learning_sessions
  add column if not exists quiz_total     int not null default 0,
  add column if not exists quiz_first_try int not null default 0,
  add column if not exists wrong_attempts int not null default 0,
  add column if not exists wrong_answers  jsonb not null default '[]',
  add column if not exists duration_seconds int not null default 0,
  add column if not exists attempt_no       int not null default 1,
  add column if not exists stars_earned     int not null default 0,
  add column if not exists subject text,
  add column if not exists grade   int,
  add column if not exists week    int;

-- Báo PostgREST nạp lại schema cache ngay (không cần restart project)
notify pgrst, 'reload schema';
