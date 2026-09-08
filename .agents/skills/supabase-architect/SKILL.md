---
name: supabase-architect
description: >-
  Desain, implementasi, dan optimasi arsitektur database Supabase PostgreSQL
  untuk bisnis solopreneur multi-tenant. Gunakan untuk merancang skema database (DDL),
  konfigurasi Row Level Security (RLS), database triggers, stored procedures,
  database views kalkulasi margin, webhook integrasi ke n8n/Edge Functions,
  dan sinkronisasi data frontend React.
argument-hint: "[schema, rls, query, or migration]"
---

# Supabase Architect Skill — Solopreneur Cloud Database

Skill spesialis untuk merancang, mengamankan, dan mengoptimalkan arsitektur database **Supabase (PostgreSQL)** dalam ekosistem multi-bisnis lean solopreneur.

---

## 1. Prinsip Desain: Multi-Business Single Project

Untuk menghemat biaya operasional solopreneur (memaksimalkan kuota gratis Supabase 500 MB), seluruh bisnis dikelola dalam 1 project PostgreSQL terpadu dengan konvensi namespace prefix yang ketat:

| Bisnis | Prefix Tabel | Contoh Tabel | Domain Bisnis |
|---|:---:|---|---|
| **TeeStock** | `ts_` | `ts_products`, `ts_orders`, `ts_inventory` | Apparel POD & Merch House |
| **MultiGraph** | `mg_` | `mg_orders`, `mg_paper_stocks`, `mg_b2b_clients` | Printing & Packaging Collateral |
| **Titik Buta** | `tb_` | `tb_projects`, `tb_leads` | Ideation / Future Ventures |
| **Shared / Core** | `core_` | `core_settings`, `core_audit_logs` | Autentikasi & Config Global |

---

## 2. Standar Skema & Struktur Relasi (Master Pattern)

### A. Pola Produk & Unit Economics (PIM)
Setiap entitas produk wajib terikat dengan tabel *unit economics* untuk memastikan kalkulasi margin selalu akurat:

```sql
-- Master Katalog Produk
CREATE TABLE IF NOT EXISTS ts_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  series VARCHAR(50) NOT NULL, -- e.g. 'Tech', 'Outdoor', 'Origins'
  category VARCHAR(50) NOT NULL, -- 'Originals', 'Blanks', 'Studio'
  description TEXT,
  garment_type VARCHAR(100) DEFAULT 'NSA Heavyweight 24s',
  price_retail NUMERIC(12, 2) NOT NULL,
  price_anchor NUMERIC(12, 2), -- Harga coret (misal Rp 139.000)
  price_dropship NUMERIC(12, 2) NOT NULL,
  price_reseller NUMERIC(12, 2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Rincian HPP (COGS) Dinamis
CREATE TABLE IF NOT EXISTS ts_unit_economics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES ts_products(id) ON DELETE CASCADE,
  cost_blank NUMERIC(12, 2) NOT NULL DEFAULT 38000,
  cost_dtf NUMERIC(12, 2) NOT NULL DEFAULT 10000,
  cost_press_electric NUMERIC(12, 2) NOT NULL DEFAULT 1500,
  cost_packaging NUMERIC(12, 2) NOT NULL DEFAULT 2000,
  cost_overhead NUMERIC(12, 2) NOT NULL DEFAULT 1500,
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### B. Business Intelligence View (Auto-Calculated Margin)
Selalu gunakan PostgreSQL View agar aplikasi frontend tidak menghitung ulang margin kotor/bersih di sisi klien:

```sql
CREATE OR REPLACE VIEW ts_view_catalog_summary AS
SELECT 
  p.id,
  p.sku,
  p.title,
  p.series,
  p.price_retail,
  p.price_dropship,
  p.price_reseller,
  (ue.cost_blank + ue.cost_dtf + ue.cost_press_electric + ue.cost_packaging + ue.cost_overhead) AS total_cogs,
  -- Laba Bersih Direct Order (0% Platform Fee)
  (p.price_retail - (ue.cost_blank + ue.cost_dtf + ue.cost_press_electric + ue.cost_packaging + ue.cost_overhead)) AS net_profit_direct,
  -- Laba Bersih Marketplace (Estimasi Potongan Fee 11%)
  ROUND(p.price_retail * 0.89 - (ue.cost_blank + ue.cost_dtf + ue.cost_press_electric + ue.cost_packaging + ue.cost_overhead), 2) AS net_profit_marketplace,
  p.is_active
FROM ts_products p
LEFT JOIN ts_unit_economics ue ON p.id = ue.product_id;
```

---

## 3. Template Kebijakan RLS (Row Level Security)

Keamanan adalah prioritas. Semua tabel wajib mengaktifkan `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`.

### Role-Based Access Pattern:
1. **Public/Guest:** Hanya dapat membaca katalog produk aktif (`is_active = true`), mendaftar newsletter, dan membuat pesanan baru (`INSERT`).
2. **Authenticated Member:** Dapat membaca riwayat pesanan sendiri dan mengubah alamat profil sendiri.
3. **Admin / Service Role:** Akses penuh (`ALL`) untuk manajemen katalog, stok gudang, dan dashboard keuangan.

```sql
-- Aktifkan RLS
ALTER TABLE ts_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE ts_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE ts_user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Publik dapat melihat produk aktif
CREATE POLICY "Public can view active products" 
ON ts_products FOR SELECT 
TO anon, authenticated 
USING (is_active = true);

-- Policy 2: Admin memiliki akses total (Cek Claim app_metadata->>'role' = 'admin')
CREATE POLICY "Admin full access on products" 
ON ts_products FOR ALL 
TO authenticated 
USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- Policy 3: User hanya melihat pesanannya sendiri
CREATE POLICY "Users view own orders" 
ON ts_orders FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Policy 4: Tamu/Guest boleh membuat pesanan baru
CREATE POLICY "Guests and Users can create orders" 
ON ts_orders FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);
```

---

## 4. Pola Database Trigger & Webhook Otomasi

### Trigger 1: Auto Sync Profile dari `auth.users`
Saat user registrasi via email/Google, otomatis buat baris profil di `ts_user_profiles`:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.ts_user_profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Customer'),
    NEW.email,
    'member'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Trigger 2: Webhook Trigger ke n8n / WA Gateway
Kirim payload instan ke endpoint eksternal saat status order berubah menjadi `PAID`:

```sql
-- Aktifkan pg_net extension jika diperlukan, atau manfaatkan Supabase Database Webhooks
-- melalui Dashboard -> Database -> Webhooks -> Event: ts_orders UPDATE
-- Filter: NEW.status = 'paid' AND OLD.status != 'paid'
```

---

## 5. Standar Integrasi Supabase di Frontend React

Gunakan pola arsitektur aman dengan proteksi koneksi offline:

```javascript
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://tovslowsopqtuxmrogeu.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Helper query aman dengan penanganan error terstandarisasi
export async function fetchCatalogProducts(series = null) {
  try {
    let query = supabase
      .from('ts_products')
      .select('*, ts_unit_economics(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (series && series !== 'Semua') {
      query = query.eq('series', series);
    }

    const { data, error } = await query;
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Database query failed:', err.message);
    return { data: [], error: err.message };
  }
}
```

---

## 6. Checklist Verifikasi Database
- [ ] Apakah tabel baru menggunakan prefix yang sesuai (`ts_`, `mg_`, `tb_`)?
- [ ] Apakah RLS sudah diaktifkan dan diverifikasi menggunakan akun non-admin?
- [ ] Apakah seluruh foreign key memiliki aturan `ON DELETE` yang jelas (`CASCADE` atau `SET NULL`)?
- [ ] Apakah index sudah dibuat untuk kolom yang sering di-filter (`sku`, `status`, `created_at`, `user_id`)?
- [ ] Apakah file master schema.sql telah diperbarui setelah ada migrasi baru?
