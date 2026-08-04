-- =====================================================
-- HÀNH TRÌNH TRƯỞNG THÀNH - Schema Supabase
-- Chạy toàn bộ file này trong SQL Editor của Supabase
-- =====================================================
-- Mô hình: 1 tài khoản Supabase = 1 gia đình (family).
-- Bố mẹ đăng nhập email/mật khẩu, sau đó chọn hồ sơ
-- (bố mẹ hoặc con) bằng mã PIN — giống hồ sơ Netflix.

-- Hồ sơ các con
create table children (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  avatar text not null default '🦊',
  pin text not null default '0000',
  created_at timestamptz not null default now()
);

-- Cài đặt của bố mẹ (PIN vào trang quản lý)
create table parent_settings (
  family_id uuid primary key references auth.users(id) on delete cascade,
  parent_pin text not null default '0000'
);

-- Nhiệm vụ (định nghĩa, có thể lặp lại)
-- task_type / content_ref: xem supabase/migration_assign.sql để hiểu đầy đủ.
--   task_type   null -> việc đời thường; 'book'|'math'|'explore' -> bài trong app
--   content_ref null -> mở cả khu (con tự học lần lượt); '<id>' -> mở đúng 1 bài
create table tasks (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references auth.users(id) on delete cascade,
  child_id uuid not null references children(id) on delete cascade,
  title text not null,
  description text default '',
  stars int not null default 1 check (stars > 0),
  recurrence text not null default 'once' check (recurrence in ('once','daily','weekly')),
  active boolean not null default true,
  task_type text,
  content_ref text,
  created_at timestamptz not null default now()
);

create index if not exists tasks_child_type_idx on tasks (child_id, task_type);

-- Lượt hoàn thành nhiệm vụ (con bấm "xong" -> chờ bố mẹ duyệt)
-- task_id dạng text: có thể là uuid của bảng tasks hoặc id ảo
-- 'book-...', 'math-...', 'sgk-...' cho các bài học nội bộ của app.
create table completions (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references auth.users(id) on delete cascade,
  task_id text not null,
  child_id uuid not null references children(id) on delete cascade,
  stars int not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  completed_date date not null default current_date,
  proof_image text,
  child_note text,
  parent_feedback text,
  created_at timestamptz not null default now()
);


-- Phần thưởng trong cửa hàng
create table rewards (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  emoji text not null default '🎁',
  cost int not null check (cost > 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Lượt đổi quà (trừ sao ngay, bố mẹ xác nhận đã trao)
create table redemptions (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references auth.users(id) on delete cascade,
  child_id uuid not null references children(id) on delete cascade,
  reward_id uuid not null references rewards(id) on delete cascade,
  cost int not null,
  status text not null default 'pending' check (status in ('pending','fulfilled','rejected')),
  created_at timestamptz not null default now()
);

-- Sổ sao: mọi biến động sao đều ghi vào đây (ví = tổng amount)
create table star_transactions (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references auth.users(id) on delete cascade,
  child_id uuid not null references children(id) on delete cascade,
  amount int not null,
  reason text not null default '',
  created_at timestamptz not null default now()
);

-- =====================================================
-- Row Level Security: mỗi gia đình chỉ thấy dữ liệu của mình
-- =====================================================
alter table children enable row level security;
alter table parent_settings enable row level security;
alter table tasks enable row level security;
alter table completions enable row level security;
alter table rewards enable row level security;
alter table redemptions enable row level security;
alter table star_transactions enable row level security;

create policy "family_all" on children
  for all using (family_id = auth.uid()) with check (family_id = auth.uid());
create policy "family_all" on parent_settings
  for all using (family_id = auth.uid()) with check (family_id = auth.uid());
create policy "family_all" on tasks
  for all using (family_id = auth.uid()) with check (family_id = auth.uid());
create policy "family_all" on completions
  for all using (family_id = auth.uid()) with check (family_id = auth.uid());
create policy "family_all" on rewards
  for all using (family_id = auth.uid()) with check (family_id = auth.uid());
create policy "family_all" on redemptions
  for all using (family_id = auth.uid()) with check (family_id = auth.uid());
create policy "family_all" on star_transactions
  for all using (family_id = auth.uid()) with check (family_id = auth.uid());

-- =====================================================
-- MIGRATION: chuyển completions.task_id từ uuid sang text
-- (chỉ cần chạy nếu DB đã được tạo từ phiên bản schema cũ)
-- =====================================================
alter table completions drop constraint if exists completions_task_id_fkey;
alter table completions alter column task_id type text;

-- =====================================================
-- MIGRATION: Kế hoạch tuần cho từng bé
-- =====================================================
-- Con học lớp mấy (2 hoặc 8) để tự động gợi ý bài SGK trong kế hoạch
alter table children add column if not exists grade int not null default 2;

-- Kế hoạch tuần: 1 dòng / (bé, tuần). days dạng jsonb:
-- {"mon": {"lessonId": "tv2_t1_tuan9", "note": "Học piano 30 phút"}, "tue": {...}, ...}
create table if not exists weekly_plans (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references auth.users(id) on delete cascade,
  child_id uuid not null references children(id) on delete cascade,
  week int not null check (week between 1 and 35),
  days jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (child_id, week)
);

alter table weekly_plans enable row level security;
create policy "family_all" on weekly_plans
  for all using (family_id = auth.uid()) with check (family_id = auth.uid());
