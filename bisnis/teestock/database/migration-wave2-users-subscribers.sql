-- ====================================================================
-- TEESTOCK APPAREL — MIGRATION WAVE 2: USERS, PROFILES & SUBSCRIBERS
-- Project: Unified Business Hub (Prefix: ts_ untuk TeeStock)
-- Tanggal: September 2026
-- ====================================================================

-- 1. TABEL: ts_user_profiles (Profil Member, Mitra & Admin)
CREATE TABLE IF NOT EXISTS ts_user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(150),
    phone VARCHAR(50),
    role VARCHAR(30) DEFAULT 'member',  -- member, partner, admin
    partner_tier VARCHAR(30),           -- dropship, reseller (null jika member biasa)
    partner_status VARCHAR(30) DEFAULT 'none', -- none, pending, approved, rejected
    default_address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(10),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL: ts_subscribers (Email Newsletter & Lead Capture)
CREATE TABLE IF NOT EXISTS ts_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    source VARCHAR(100) DEFAULT 'website_footer', -- website_footer, homepage_hero, biolink, custom_order
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    status VARCHAR(30) DEFAULT 'active', -- active, unsubscribed
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. UPDATE: ts_orders (Tambahkan user_id relasi ke auth.users)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'ts_orders' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE ts_orders ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 4. OTOMATIS: Trigger Buat Profile saat User Baru Mendaftar via Auth (Google/Magic Link)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.ts_user_profiles (id, full_name, role, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            split_part(NEW.email, '@', 1)
        ),
        'member',
        COALESCE(
            NEW.raw_user_meta_data->>'avatar_url',
            NEW.raw_user_meta_data->>'picture',
            NULL
        )
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Pasang trigger jika belum terpasang
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE ts_user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ts_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy ts_user_profiles
DROP POLICY IF EXISTS "user_read_own_profile" ON ts_user_profiles;
DROP POLICY IF EXISTS "user_update_own_profile" ON ts_user_profiles;
DROP POLICY IF EXISTS "admin_read_all_profiles" ON ts_user_profiles;
DROP POLICY IF EXISTS "admin_update_all_profiles" ON ts_user_profiles;

-- 1. Pengguna dapat membaca profilnya sendiri
CREATE POLICY "user_read_own_profile" 
    ON ts_user_profiles FOR SELECT 
    USING (auth.uid() = id);

-- 2. Pengguna dapat memperbarui profilnya sendiri
CREATE POLICY "user_update_own_profile" 
    ON ts_user_profiles FOR UPDATE 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 3. Pengguna dapat insert profil sendiri (fallback manual)
CREATE POLICY "user_insert_own_profile" 
    ON ts_user_profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- 4. Admin dapat membaca & mengelola semua profil pengguna
CREATE POLICY "admin_all_profiles" 
    ON ts_user_profiles FOR ALL 
    TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM ts_user_profiles p 
            WHERE p.id = auth.uid() AND p.role = 'admin'
        )
    );

-- Policy ts_subscribers
DROP POLICY IF EXISTS "anon_insert_subscribers" ON ts_subscribers;
DROP POLICY IF EXISTS "auth_read_subscribers" ON ts_subscribers;

-- Publik (anon) bisa subscribe newsletter
CREATE POLICY "anon_insert_subscribers" 
    ON ts_subscribers FOR INSERT 
    WITH CHECK (true);

-- Hanya admin/authenticated yang bisa melihat data subscriber
CREATE POLICY "auth_read_subscribers" 
    ON ts_subscribers FOR SELECT 
    TO authenticated 
    USING (true);

-- Policy ts_orders: Member bisa melihat pesanan miliknya
DROP POLICY IF EXISTS "member_read_own_orders" ON ts_orders;
CREATE POLICY "member_read_own_orders" 
    ON ts_orders FOR SELECT 
    TO authenticated 
    USING (user_id = auth.uid());

-- Selesai migrasi Wave 2
