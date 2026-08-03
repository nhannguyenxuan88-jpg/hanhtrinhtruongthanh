# 🛠️ Kiến Trúc Dữ Liệu & Kỹ Thuật (Supabase Schema & API Specs)

File tài liệu này chứa toàn bộ **Database Schema SQL**, cấu hình **Row Level Security (RLS)**, cơ chế **Dual-Sync LocalStorage Persistence**, và cấu trúc **PWA**.

---

## 1. Complete Supabase Database Schema (`schema.sql`)

```sql
-- =====================================================
-- HÀNH TRÌNH TRƯỞNG THÀNH - Schema Supabase v2.5+
-- =====================================================

-- 1. Bảng Hồ sơ các con
CREATE TABLE IF NOT EXISTS children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar TEXT NOT NULL DEFAULT '🦊',
  pin TEXT NOT NULL DEFAULT '0000',
  grade INT NOT NULL DEFAULT 2,
  current_streak INT NOT NULL DEFAULT 0,
  longest_streak INT NOT NULL DEFAULT 0,
  last_active_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Cài đặt của bố mẹ (PIN quản lý)
CREATE TABLE IF NOT EXISTS parent_settings (
  family_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_pin TEXT NOT NULL DEFAULT '0000'
);

-- 3. Bảng Nhiệm vụ
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  stars INT NOT NULL DEFAULT 1 CHECK (stars > 0),
  recurrence TEXT NOT NULL DEFAULT 'once' CHECK (recurrence IN ('once','daily','weekly')),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Bảng Hoàn thành bài học / nhiệm vụ
CREATE TABLE IF NOT EXISTS completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id TEXT NOT NULL,
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  stars INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  completed_date DATE NOT NULL DEFAULT CURRENT_DATE,
  proof_image TEXT,
  child_note TEXT,
  parent_feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Bảng Phần thưởng shop
CREATE TABLE IF NOT EXISTS rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '🎁',
  cost INT NOT NULL CHECK (cost > 0),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Bảng Lượt đổi quà
CREATE TABLE IF NOT EXISTS redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
  cost INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','fulfilled','rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Bảng Sổ sao (Biến động ví sao)
CREATE TABLE IF NOT EXISTS star_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  reason TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Bảng Kế hoạch tuần
CREATE TABLE IF NOT EXISTS weekly_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  week INT NOT NULL CHECK (week BETWEEN 1 AND 35),
  days JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (child_id, week)
);

-- 9. Bảng Quản lý Gói cước Subscriptions (PLG Trial / Free / Pro)
CREATE TABLE IF NOT EXISTS subscriptions (
  family_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL DEFAULT 'trial' CHECK (plan_type IN ('trial', 'free', 'pro')),
  trial_ends_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '14 days'),
  pro_ends_at TIMESTAMPTZ,
  referral_code TEXT UNIQUE NOT NULL DEFAULT substring(md5(random()::text) from 1 for 8),
  referred_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE star_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "family_all" ON children FOR ALL USING (family_id = auth.uid()) WITH CHECK (family_id = auth.uid());
CREATE POLICY "family_all" ON parent_settings FOR ALL USING (family_id = auth.uid()) WITH CHECK (family_id = auth.uid());
CREATE POLICY "family_all" ON tasks FOR ALL USING (family_id = auth.uid()) WITH CHECK (family_id = auth.uid());
CREATE POLICY "family_all" ON completions FOR ALL USING (family_id = auth.uid()) WITH CHECK (family_id = auth.uid());
CREATE POLICY "family_all" ON rewards FOR ALL USING (family_id = auth.uid()) WITH CHECK (family_id = auth.uid());
CREATE POLICY "family_all" ON redemptions FOR ALL USING (family_id = auth.uid()) WITH CHECK (family_id = auth.uid());
CREATE POLICY "family_all" ON star_transactions FOR ALL USING (family_id = auth.uid()) WITH CHECK (family_id = auth.uid());
CREATE POLICY "family_all" ON weekly_plans FOR ALL USING (family_id = auth.uid()) WITH CHECK (family_id = auth.uid());
CREATE POLICY "family_all" ON subscriptions FOR ALL USING (family_id = auth.uid()) WITH CHECK (family_id = auth.uid());
```

---

## 2. Bảng `learning_sessions` — Lịch Sử Học Tập Chi Tiết

Phân biệt rõ hai khái niệm trước đây bị gộp làm một:

| Bảng | Ý nghĩa | Số dòng mỗi bài |
|---|---|---|
| `completions` | "Bài này đã xong hay chưa" — dùng để chặn nhận sao trùng | Đúng 1 |
| `learning_sessions` | "Lịch sử học" — mọi lượt học, kể cả ôn lại bài cũ | Không giới hạn |

```sql
CREATE TABLE IF NOT EXISTS learning_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id  uuid NOT NULL REFERENCES children(id)  ON DELETE CASCADE,
  kind    TEXT NOT NULL CHECK (kind IN ('sgk','book','math')),
  ref_id  TEXT NOT NULL,
  title   TEXT NOT NULL,
  subject TEXT, grade INT, week INT,
  quiz_total     INT NOT NULL DEFAULT 0,
  quiz_first_try INT NOT NULL DEFAULT 0,
  wrong_attempts INT NOT NULL DEFAULT 0,
  wrong_answers  JSONB NOT NULL DEFAULT '[]',
  duration_seconds INT NOT NULL DEFAULT 0,
  attempt_no       INT NOT NULL DEFAULT 1,
  stars_earned     INT NOT NULL DEFAULT 0,
  studied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Vì sao đo `wrong_attempts` chứ không phải "số câu đúng"

Trong cả 3 loại bài (SGK, Đọc sách, Toán tư duy), bé **bắt buộc trả lời đúng mới
được sang câu tiếp theo**. Do đó "số câu đúng" cuối bài luôn bằng điểm tuyệt đối
và không mang thông tin gì. Tín hiệu học tập thật nằm ở:

- `wrong_attempts` — tổng số lần bé chọn sai
- `quiz_first_try` — số câu bé đúng **ngay lần đầu** (mới thực sự là "nắm bài")
- `wrong_answers` — chi tiết từng câu sai, là đầu vào cho **Spaced Repetition**

### API tương ứng (`src/lib/api.js`)

- `logLearningSession(familyId, childId, session)` — ghi 1 lượt học, tự tính `attempt_no`
- `fetchLearningSessions(childId?, limit?)` — đọc lịch sử, mới nhất trước

Lượt học được ghi **ngay khi bé làm xong phần trắc nghiệm**, không đợi bé bấm
"Nhận sao" — nếu không, các lần ôn lại bài cũ (không còn sao) sẽ không được lưu.

---

## 3. Nguồn Sự Thật Dữ Liệu (thay thế cơ chế Dual-Sync cũ)

> ⚠️ **Cơ chế "Dual-Sync LocalStorage" trước đây đã bị loại bỏ.**
> Nó hợp nhất dữ liệu DB với localStorage và lấy `Math.max(dbBalance, localBalance)`
> làm số sao hiển thị. Hệ quả: khi bảng `star_transactions` bị RLS chặn ghi (do
> thiếu policy), app vẫn hiển thị số sao "đúng" lấy từ localStorage, che giấu hoàn
> toàn sự cố trong thời gian dài. Toàn bộ ví sao khi đó chỉ tồn tại trên trình
> duyệt và sẽ mất sạch nếu đổi máy hoặc xoá cache.

### Nguyên tắc hiện tại

1. **Supabase là nguồn sự thật duy nhất.** Mọi số liệu hiển thị đều đọc từ DB.
2. **Không nuốt lỗi.** `addStars`, `submitCompletion`, `logLearningSession`,
   `fetchBalance` đều `throw` khi thất bại. Giao diện báo lỗi rõ ràng và **không**
   bắn hiệu ứng ăn mừng khi chưa lưu được.
3. **Không dùng UUID rỗng làm giá trị dự phòng.** `family_id` luôn lấy từ phiên
   đăng nhập qua `resolveFamilyId()`, vì `family_id = auth.uid()` là điều kiện của
   mọi RLS policy. UUID rỗng vi phạm cả khoá ngoại lẫn RLS.
4. **localStorage chỉ là bộ nhớ đệm ngoại tuyến.** Khi mất mạng, app hiển thị bản
   lưu tạm kèm cảnh báo rõ ràng — và không bao giờ ghi đè số liệu của DB.

### Bài học rút ra

RLS bật mà thiếu policy sẽ chặn 100% thao tác, nhưng `select` bị chặn trả về
**mảng rỗng KHÔNG kèm lỗi** — cực kỳ khó phát hiện. Vì vậy sau mỗi migration phải
kiểm tra bằng:

```sql
select tablename, policyname from pg_policies
where schemaname = 'public' order by tablename;
```

Mọi bảng có `enable row level security` đều phải xuất hiện trong kết quả này.
Xem `supabase/migration_fix_stars.sql` để biết cách vá và khôi phục dữ liệu.
