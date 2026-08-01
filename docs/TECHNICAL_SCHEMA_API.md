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

## 2. Cơ Chế Dual-Sync Persistence (Hợp Nhất LocalStorage + Supabase)

### Nguyên lý hoạt động
1. Khi bé thực hiện bài học / trắc nghiệm / việc nhà:
   - Ghi ngầm xuống Supabase DB (`completions` & `star_transactions`).
   - Đồng thời nạp trực tiếp bản ghi vào `localStorage.getItem('child_completions_' + childId)`.
   - Cập nhật số sao vào `localStorage.getItem('child_balance_' + childId)`.
2. Khi `loadAppData()` chạy (lúc mở app hoặc chuyển hồ sơ):
   - Query `dbComps` từ Supabase.
   - Query `localComps` từ `localStorage`.
   - Dùng `Map` theo `task_id` để hợp nhất 2 nguồn dữ liệu.
   - Đảm bảo **100% dữ liệu không bao giờ bị mất hoặc bị reset về 0**.
