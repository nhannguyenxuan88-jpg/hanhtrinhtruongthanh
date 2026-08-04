-- =====================================================
-- HÀNH TRÌNH TRƯỞNG THÀNH
-- Migration tự chữa lành: vá RLS, khôi phục Ví Sao, thêm Lịch sử học tập
-- =====================================================
-- BỐI CẢNH:
--   File schema.sql gốc đã chạy DỞ DANG. Bằng chứng:
--     - completions       : 152 dòng  -> bảng + policy đều OK
--     - star_transactions : 0 dòng    -> bảng có, nhưng THIẾU policy
--     - weekly_plans      : không tồn tại
--   Trong schema.sql, thứ tự là: tạo bảng -> tạo policy (star_transactions
--   nằm CUỐI) -> khối MIGRATION (weekly_plans, cột children.grade).
--   Script dừng đâu đó trong khối policy nên mọi thứ từ đó trở về sau đều thiếu.
--
--   RLS bật mà không có policy = chặn 100% đọc/ghi. Tệ hơn nữa, lệnh SELECT bị
--   chặn trả về MẢNG RỖNG KHÔNG KÈM LỖI, nên app tưởng bé chưa có sao nào và
--   âm thầm lấy số sao từ localStorage suốt thời gian dài.
--
-- FILE NÀY LÀM 5 VIỆC (chạy lại nhiều lần đều an toàn):
--   PHẦN 0 — Tạo mọi bảng/cột còn thiếu.
--   PHẦN 1 — Bật RLS + tạo lại policy cho TẤT CẢ các bảng.
--   PHẦN 2 — Khôi phục sổ sao từ completions + redemptions.
--   PHẦN 3 — Thêm bảng learning_sessions (lịch sử học tập chi tiết).
--   PHẦN 4 — Backfill lịch sử học tập từ các completions đã có.
--
-- CÁCH DÙNG: dán TOÀN BỘ file vào Supabase -> SQL Editor -> Run.
--
-- NẾU VẪN BÁO LỖI "column ... does not exist" HOẶC "relation ... does not exist":
-- schema đang chạy còn cũ hơn nữa. Chạy câu chẩn đoán dưới đây rồi gửi kết quả
-- để bổ sung chính xác phần còn thiếu, thay vì vá từng lỗi một:
--
--   select table_name, column_name, data_type
--   from information_schema.columns
--   where table_schema = 'public'
--   order by table_name, ordinal_position;
-- =====================================================


-- =====================================================
-- PHẦN 0: TẠO MỌI BẢNG & CỘT CÒN THIẾU
-- =====================================================
-- Dùng "if not exists" nên các bảng đã có sẽ được giữ nguyên dữ liệu.

create table if not exists children (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  avatar text not null default '🦊',
  pin text not null default '0000',
  created_at timestamptz not null default now()
);

create table if not exists parent_settings (
  family_id uuid primary key references auth.users(id) on delete cascade,
  parent_pin text not null default '0000'
);

create table if not exists tasks (
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

-- Bảng tasks có thể đã tồn tại từ trước (create ... if not exists bỏ qua),
-- nên vẫn phải thêm cột rời. Chi tiết: supabase/migration_assign.sql
alter table tasks add column if not exists task_type   text;
alter table tasks add column if not exists content_ref text;
create index if not exists tasks_child_type_idx on tasks (child_id, task_type);

create table if not exists completions (
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

create table if not exists rewards (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  emoji text not null default '🎁',
  cost int not null check (cost > 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists redemptions (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references auth.users(id) on delete cascade,
  child_id uuid not null references children(id) on delete cascade,
  reward_id uuid not null references rewards(id) on delete cascade,
  cost int not null,
  status text not null default 'pending' check (status in ('pending','fulfilled','rejected')),
  created_at timestamptz not null default now()
);

create table if not exists star_transactions (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references auth.users(id) on delete cascade,
  child_id uuid not null references children(id) on delete cascade,
  amount int not null,
  reason text not null default '',
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------
-- 0b. BỔ SUNG CÁC CỘT CÒN THIẾU
-- -----------------------------------------------------
-- QUAN TRỌNG: "create table if not exists" ở trên BỎ QUA hoàn toàn những bảng
-- đã tồn tại — kể cả khi bảng đó thiếu cột. Schema đang chạy trên Supabase cũ
-- hơn nhiều so với schema.sql trong repo (ví dụ completions thiếu child_note),
-- nên phải bổ sung từng cột một cách tường minh.
--
-- "add column if not exists" là lệnh an toàn: cột nào đã có thì bỏ qua, cột nào
-- thiếu thì thêm vào và điền giá trị mặc định cho các dòng cũ.

-- children — cột grade dùng để gợi ý bài SGK theo khối.
-- Nếu grade thiếu thì chức năng THÊM HỒ SƠ CON đang bị lỗi.
alter table children add column if not exists avatar     text not null default '🦊';
alter table children add column if not exists pin        text not null default '0000';
alter table children add column if not exists grade      int  not null default 2;
alter table children add column if not exists created_at timestamptz not null default now();

-- tasks
alter table tasks add column if not exists description text default '';
alter table tasks add column if not exists stars       int  not null default 1;
alter table tasks add column if not exists recurrence  text not null default 'once';
alter table tasks add column if not exists active      boolean not null default true;
alter table tasks add column if not exists created_at  timestamptz not null default now();

-- completions — child_note / parent_feedback / proof_image là các cột hay thiếu nhất
alter table completions add column if not exists stars           int  not null default 0;
alter table completions add column if not exists status          text not null default 'pending';
alter table completions add column if not exists completed_date  date not null default current_date;
alter table completions add column if not exists proof_image     text;
alter table completions add column if not exists child_note      text;
alter table completions add column if not exists parent_feedback text;
alter table completions add column if not exists created_at      timestamptz not null default now();

-- rewards
alter table rewards add column if not exists emoji      text not null default '🎁';
alter table rewards add column if not exists active     boolean not null default true;
alter table rewards add column if not exists created_at timestamptz not null default now();

-- redemptions
alter table redemptions add column if not exists cost       int  not null default 0;
alter table redemptions add column if not exists status     text not null default 'pending';
alter table redemptions add column if not exists created_at timestamptz not null default now();

-- star_transactions
alter table star_transactions add column if not exists reason     text not null default '';
alter table star_transactions add column if not exists created_at timestamptz not null default now();

-- completions.task_id phải là text để chứa id ảo ('sgk-...', 'book-...', 'math-...')
alter table completions drop constraint if exists completions_task_id_fkey;
alter table completions alter column task_id type text;

-- Kế hoạch tuần (bảng bị thiếu hoàn toàn -> tính năng Kế hoạch tuần đang lỗi)
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


-- =====================================================
-- PHẦN 1: BẬT RLS + TẠO LẠI POLICY CHO TẤT CẢ CÁC BẢNG
-- =====================================================
-- Ta không biết chắc bảng nào còn thiếu policy nên tạo lại toàn bộ.
-- Mỗi gia đình chỉ thấy dữ liệu của mình: family_id = auth.uid().

alter table children           enable row level security;
alter table parent_settings    enable row level security;
alter table tasks              enable row level security;
alter table completions        enable row level security;
alter table rewards            enable row level security;
alter table redemptions        enable row level security;
alter table star_transactions  enable row level security;
alter table weekly_plans       enable row level security;

drop policy if exists "family_all" on children;
create policy "family_all" on children
  for all using (family_id = auth.uid()) with check (family_id = auth.uid());

drop policy if exists "family_all" on parent_settings;
create policy "family_all" on parent_settings
  for all using (family_id = auth.uid()) with check (family_id = auth.uid());

drop policy if exists "family_all" on tasks;
create policy "family_all" on tasks
  for all using (family_id = auth.uid()) with check (family_id = auth.uid());

drop policy if exists "family_all" on completions;
create policy "family_all" on completions
  for all using (family_id = auth.uid()) with check (family_id = auth.uid());

drop policy if exists "family_all" on rewards;
create policy "family_all" on rewards
  for all using (family_id = auth.uid()) with check (family_id = auth.uid());

drop policy if exists "family_all" on redemptions;
create policy "family_all" on redemptions
  for all using (family_id = auth.uid()) with check (family_id = auth.uid());

drop policy if exists "family_all" on star_transactions;
create policy "family_all" on star_transactions
  for all using (family_id = auth.uid()) with check (family_id = auth.uid());

drop policy if exists "family_all" on weekly_plans;
create policy "family_all" on weekly_plans
  for all using (family_id = auth.uid()) with check (family_id = auth.uid());


-- =====================================================
-- PHẦN 2: KHÔI PHỤC SỔ SAO TỪ DỮ LIỆU CÒN NGUYÊN VẸN
-- =====================================================
-- completions và redemptions vẫn đầy đủ trong DB nên dựng lại được toàn bộ
-- ví sao mà không cần phụ thuộc localStorage.
-- Điều kiện "not exists" so khớp theo (child_id, created_at, amount) để chạy
-- lại file này không cộng sao trùng lần nữa.

-- 2a. Sao KIẾM ĐƯỢC từ các lượt hoàn thành đã được duyệt
insert into star_transactions (family_id, child_id, amount, reason, created_at)
select
  c.family_id,
  c.child_id,
  c.stars,
  'Khôi phục: ' || coalesce(nullif(trim(c.child_note), ''), 'hoàn thành nhiệm vụ / bài học'),
  c.created_at
from completions c
where c.status = 'approved'
  and c.stars <> 0
  and not exists (
    select 1 from star_transactions st
    where st.child_id   = c.child_id
      and st.created_at = c.created_at
      and st.amount     = c.stars
  );

-- 2b. Sao ĐÃ TIÊU khi đổi quà (pending = đã trừ sao, đang chờ bố mẹ trao)
insert into star_transactions (family_id, child_id, amount, reason, created_at)
select
  r.family_id,
  r.child_id,
  -r.cost,
  'Khôi phục: đổi quà ' || coalesce(rw.title, ''),
  r.created_at
from redemptions r
left join rewards rw on rw.id = r.reward_id
where r.status in ('pending', 'fulfilled')
  and not exists (
    select 1 from star_transactions st
    where st.child_id   = r.child_id
      and st.created_at = r.created_at
      and st.amount     = -r.cost
  );

-- LƯU Ý 1: sao đã tiêu cho vé Game Arcade không khôi phục được vì trước đây chưa
-- từng ghi vào bảng nào ngoài localStorage. Sai lệch này nghiêng về phía có lợi
-- cho các con (số sao còn lại nhiều hơn thực tế một chút).
--
-- LƯU Ý 2 — VỀ CÁC BÀI BỊ HỌC LẶP:
-- Do bảng weekly_plans bị thiếu, loadAppData() luôn thất bại nên danh sách
-- completions trong bộ nhớ luôn rỗng -> cơ chế chặn nhận sao trùng không bao giờ
-- chạy -> một bài học có thể có NHIỀU dòng completions.
-- Phần khôi phục ở trên cố ý cộng sao cho TẤT CẢ các dòng đó, vì đúng bằng số
-- sao mà bé đã nhìn thấy trên màn hình bấy lâu nay. Giữ nguyên là công bằng
-- nhất với các con.
--
-- ✅ ĐÃ QUYẾT ĐỊNH (chủ dự án): GIỮ NGUYÊN toàn bộ số sao để các con phấn khích
--    hơn. KHÔNG chạy đoạn gộp bên dưới. Đoạn này chỉ giữ lại để tham khảo.
--
-- Nếu về sau đổi ý và muốn gộp lại chỉ tính 1 lần mỗi bài, chạy RIÊNG đoạn dưới
-- đây SAU khi đã chạy xong toàn bộ file (lưu ý: làm giảm số sao của các con):
--
--   with trung_lap as (
--     select id, row_number() over (
--              partition by child_id, task_id order by created_at
--            ) as thu_tu
--     from completions where status = 'approved'
--   )
--   delete from star_transactions st
--   using completions c, trung_lap t
--   where t.thu_tu > 1 and t.id = c.id
--     and st.child_id = c.child_id
--     and st.created_at = c.created_at
--     and st.amount = c.stars;


-- =====================================================
-- PHẦN 3: BẢNG LỊCH SỬ HỌC TẬP CHI TIẾT
-- =====================================================
-- Khác biệt cốt lõi so với completions:
--   - completions       = "đã xong hay chưa"  (mỗi bài đúng 1 dòng, chặn trùng)
--   - learning_sessions = "lịch sử học"       (MỌI lượt học, kể cả học lại)
-- Đây là dữ liệu nền cho Spaced Repetition & Habit Score trong MASTER_PLAN.

create table if not exists learning_sessions (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references auth.users(id) on delete cascade,
  child_id  uuid not null references children(id)  on delete cascade,

  -- Loại hoạt động và mã bài học gốc
  -- 'explore' = khu Khám Phá Thế Giới. Máy đã cài sẵn từ trước thì chạy thêm
  -- supabase/migration_explore.sql để nới ràng buộc này.
  kind    text not null check (kind in ('sgk', 'book', 'math', 'explore')),
  ref_id  text not null,
  title   text not null,
  subject text,
  grade   int,
  week    int,

  -- Kết quả làm bài.
  -- Bé buộc phải trả lời đúng mới sang câu tiếp, nên "số câu đúng" luôn là
  -- điểm tuyệt đối và vô nghĩa. Tín hiệu học tập thật nằm ở số lần chọn sai.
  quiz_total     int not null default 0,  -- tổng số câu hỏi
  quiz_first_try int not null default 0,  -- số câu đúng NGAY LẦN ĐẦU
  wrong_attempts int not null default 0,  -- tổng số lần chọn sai
  -- Chi tiết câu trả lời sai, dùng cho ôn tập lặp lại:
  -- [{ "q": "<câu hỏi>", "chose": "<đáp án bé chọn>", "correct": "<đáp án đúng>" }]
  wrong_answers  jsonb not null default '[]',

  duration_seconds int not null default 0,
  attempt_no       int not null default 1,  -- lượt học thứ mấy của bài này
  stars_earned     int not null default 0,

  studied_at timestamptz not null default now()
);

create index if not exists learning_sessions_child_time_idx
  on learning_sessions (child_id, studied_at desc);
create index if not exists learning_sessions_ref_idx
  on learning_sessions (child_id, kind, ref_id);

alter table learning_sessions enable row level security;

drop policy if exists "family_all" on learning_sessions;
create policy "family_all" on learning_sessions
  for all using (family_id = auth.uid()) with check (family_id = auth.uid());


-- =====================================================
-- PHẦN 4: BACKFILL LỊCH SỬ HỌC TỪ COMPLETIONS ĐÃ CÓ
-- =====================================================
-- Các lượt học cũ không có dữ liệu trắc nghiệm chi tiết (app chưa từng lưu),
-- nên quiz_total = 0. Nhưng ta giữ được: học bài nào, khi nào, mấy sao.

insert into learning_sessions (
  family_id, child_id, kind, ref_id, title, stars_earned, studied_at
)
select
  c.family_id,
  c.child_id,
  case
    when c.task_id like 'sgk-%'  then 'sgk'
    when c.task_id like 'book-%' then 'book'
    when c.task_id like 'math-%' then 'math'
  end as kind,
  regexp_replace(c.task_id, '^(sgk|book|math)-', '') as ref_id,
  -- child_note có dạng "Bé đã hoàn thành bài học SGK: <tên bài>"
  -- -> lấy phần sau dấu ':' làm tên bài
  coalesce(
    nullif(trim(split_part(c.child_note, ':', 2)), ''),
    nullif(trim(c.child_note), ''),
    c.task_id
  ) as title,
  c.stars,
  c.created_at
from completions c
where c.status = 'approved'
  and (c.task_id like 'sgk-%' or c.task_id like 'book-%' or c.task_id like 'math-%')
  and not exists (
    select 1 from learning_sessions ls
    where ls.child_id   = c.child_id
      and ls.studied_at = c.created_at
      and ls.ref_id     = regexp_replace(c.task_id, '^(sgk|book|math)-', '')
  );


-- =====================================================
-- KIỂM TRA KẾT QUẢ SAU KHI CHẠY
-- =====================================================
-- Các câu dưới đây được để dạng CHÚ THÍCH có chủ đích: SQL Editor của Supabase
-- chỉ hiển thị kết quả của lệnh SELECT cuối cùng trong một lần Run. Hãy bôi đen
-- và chạy TỪNG câu một để xem đầy đủ kết quả.
--
--   -- 1. Phải đủ 9 bảng, mỗi bảng đúng 1 policy "family_all":
--   --    children, completions, learning_sessions, parent_settings,
--   --    redemptions, rewards, star_transactions, tasks, weekly_plans
--   select tablename, policyname
--   from pg_policies
--   where schemaname = 'public'
--   order by tablename;
--
--   -- 2. Ví sao của từng bé — trước migration tất cả đều bằng 0
--   select ch.name, sum(st.amount) as so_sao_con_lai
--   from star_transactions st
--   join children ch on ch.id = st.child_id
--   group by ch.name
--   order by ch.name;
--
--   -- 3. Lịch sử học tập đã khôi phục được
--   select kind, count(*) as so_luot
--   from learning_sessions
--   group by kind;
--
--   -- 4. Kiểm tra bài bị học lặp do lỗi cũ (completions rỗng -> không chặn trùng)
--   select task_id, child_id, count(*) as so_lan
--   from completions
--   group by task_id, child_id
--   having count(*) > 1
--   order by so_lan desc;
