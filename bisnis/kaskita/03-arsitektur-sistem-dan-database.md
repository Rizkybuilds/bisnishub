---
title: "Tahap 3: Arsitektur Sistem & Basis Data PostgreSQL — KasKita"
date: "2026-09-15"
bisnis: kaskita
kategori: operasional
status: active
tags:
  - bisnis/kaskita
  - arsitektur
  - database
  - postgresql
  - erd
  - rls
---

# Tahap 3: Arsitektur Sistem & Basis Data PostgreSQL — KasKita

> [!abstract] Ringkasan Arsitektur & Basis Data
> Dokumen ini menyajikan arsitektur teknis sistem dan cetak biru skema basis data (**PostgreSQL DDL**) untuk mendukung paradigma **Hub & Spoke**. Skema data dirancang untuk memisahkan kepemilikan dompet pribadi dari kas publik komunitas, sambil menyediakan relasi yang mulus bagi mesin *Zero Double-Entry*.

---

## BAGIAN 1: ARSITEKTUR SISTEM TINGKAT TINGGI

Sistem menggunakan pola **Mobile-First Lean Architecture** berbasis *Shared Database Multi-Tenant* dengan partisi keamanan Row-Level Security (RLS) di PostgreSQL/Supabase untuk menjaga efisiensi rekayasa satu pengembang (solopreneur):

```
                            [APLIKASI KLIEN]
                 ┌──────────────────┴──────────────────┐
                 ▼                                     ▼
      Aplikasi Mobile (Flutter)             Zero-Install Web Guest Link
  (Personal Finance + In-App Admin)        (Warga Cek Tagihan & Upload Bukti)
                 │                                     │
                 └──────────────────┬──────────────────┘
                                    ▼
                      [API GATEWAY / SUPABASE REST]
                                    │
                 ┌──────────────────┴──────────────────┐
                 ▼                                     ▼
         [CORE BACKEND API]                   [SCHEDULER / CRON]
       (Supabase Edge Functions)            (Supabase pg_cron / BullMQ)
         ├── Auth OTP & Multi-Wallet          ├── Scheduler Pengingat Jatuh Tempo
         ├── Modul Iuran & Arisan             ├── Auto-Generate Invoice Bulanan
         ├── Modul Utang Piutang              └── Generator Deep-Link WhatsApp
         └── Zero Double-Entry Engine                  │
                 │                                     ▼
                 ├────────────────────────────── [3rd Party Providers]
                 │                               ├── Firebase Cloud Messaging (FCM)
                 │                               ├── WhatsApp Gateway API (Tier Pro)
                 │                               └── Cloudflare R2 Storage (Bukti Bayar)
                 ▼
        [POSTGRESQL DATABASE (SUPABASE)]
```

### Rekomendasi Tech Stack Definitif
1. **Frontend Utama (Mobile):** **Flutter (Dart)** — 1 *codebase* tunggal untuk Android & iOS yang memuat seluruh fitur: Keuangan Pribadi Harian, Dompet, serta **In-App Community Admin** (membuat grup, mengocok arisan, approve transfer, dan undang warga via WA link).
2. **Frontend Sekunder (Web Guest):** **Lightweight Web Page (Flutter Web / PWA / Static HTML)** — Halaman responsif super ringan agar warga yang membuka link WhatsApp bisa melihat tagihan dan mengunggah bukti bayar tanpa wajib install aplikasi di awal.
3. **Backend & Database:** **Supabase (PostgreSQL 15+)** — Dukungan penuh tipe data JSONB, pg_cron, storage R2, auth OTP, dan isolasi keamanan Row-Level Security (RLS).
4. **Storage Bukti Transfer:** **Cloudflare R2** — Kompatibel S3 API tanpa biaya *egress bandwidth*, gambar dikompresi WebP $< 300\text{ KB}$.
5. **Messaging & Notifikasi:** **Client Deep-Link `wa.me`** (Tier Free Rp0) & **Push Notification** via FCM.

---

## BAGIAN 2: SKEMA ENTITAS DATA (ERD)

```
 [users] 1 ──── N [wallets] 1 ──── N [transactions]
    │                                     │
    ├── 1 ──── N [budgets] N ──── 1 [categories]
    │                                     ▲
    ├── 1 ──── N [debts] 1 ──── N [debt_payments]
    │
    └── 1 ──── N [workspace_members] N ──── 1 [workspaces]
                         │                         │
                         │                         ├── 1 ──── N [dues_categories] 1 ──── N [dues_invoices]
                         │                         └── 1 ──── N [arisan_groups]   1 ──── N [arisan_rounds]
                         ▼
             (Hak Akses & Multi-Tenant)
```

---

## BAGIAN 3: SKEMA DATABASE LENGKAP (POSTGRESQL DDL)

Berikut adalah definisi DDL SQL yang siap dieksekusi di PostgreSQL:

```sql
-- Ekstensi UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. TABEL PENGGUNA & DOMPET PRIBADI (THE HUB)
-- ============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Multi-Dompet Pengguna (Cash, Rekening Bank, e-Wallet)
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL, -- e.g. "Kas Tunai", "BCA Pribadi", "GoPay"
    wallet_type VARCHAR(20) NOT NULL DEFAULT 'CASH' CHECK (wallet_type IN ('CASH', 'BANK', 'EWALLET')),
    balance BIGINT NOT NULL DEFAULT 0, -- Satuan Rupiah penuh (bukan float)
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Master Kategori Transaksi
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- NULL jika kategori bawaan sistem
    name VARCHAR(50) NOT NULL, -- e.g. "Makanan", "Iuran Lingkungan", "Transport"
    type VARCHAR(10) NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
    icon VARCHAR(30) DEFAULT 'receipt',
    is_system BOOLEAN DEFAULT FALSE
);

-- Limit Anggaran Bulanan (Budgeting)
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    period_month VARCHAR(7) NOT NULL, -- Format: 'YYYY-MM'
    limit_amount BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, category_id, period_month)
);

-- ============================================================================
-- 2. TABEL RUANG KERJA KOMUNITAS & HAK AKSES (THE SPOKES)
-- ============================================================================

CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL, -- e.g. "RT 05 Sukamaju", "Arisan Keluarga Besar"
    type VARCHAR(20) NOT NULL DEFAULT 'COMMUNITY' CHECK (type IN ('COMMUNITY', 'PERSONAL')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE workspace_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL DEFAULT 'MEMBER' CHECK (role IN ('OWNER', 'ADMIN', 'MEMBER')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workspace_id, user_id)
);

-- ============================================================================
-- 3. MODUL IURAN KOMUNITAS
-- ============================================================================

CREATE TABLE dues_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- e.g. "Iuran Sampah & Keamanan"
    amount BIGINT NOT NULL,
    billing_cycle VARCHAR(20) DEFAULT 'MONTHLY' CHECK (billing_cycle IN ('MONTHLY', 'WEEKLY', 'ONCE')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE dues_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dues_category_id UUID NOT NULL REFERENCES dues_categories(id) ON DELETE RESTRICT,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES workspace_members(id) ON DELETE CASCADE,
    period VARCHAR(7) NOT NULL, -- Format: 'YYYY-MM'
    amount BIGINT NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(25) NOT NULL DEFAULT 'UNPAID' CHECK (status IN ('UNPAID', 'PENDING_VERIFICATION', 'PAID')),
    proof_image_url TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES users(id),
    
    -- Zero Double-Entry Support
    synced_to_personal BOOLEAN DEFAULT FALSE,
    personal_wallet_id UUID REFERENCES wallets(id) ON DELETE SET NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 4. MODUL ARISAN DIGITAL
-- ============================================================================

CREATE TABLE arisan_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    amount_per_period BIGINT NOT NULL,
    cycle_period VARCHAR(20) DEFAULT 'MONTHLY' CHECK (cycle_period IN ('WEEKLY', 'MONTHLY')),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('DRAFT', 'ACTIVE', 'COMPLETED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE arisan_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    arisan_group_id UUID NOT NULL REFERENCES arisan_groups(id) ON DELETE CASCADE,
    workspace_member_id UUID NOT NULL REFERENCES workspace_members(id) ON DELETE CASCADE,
    slot_number INT NOT NULL,
    has_won BOOLEAN DEFAULT FALSE,
    won_at_round INT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE arisan_rounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    arisan_group_id UUID NOT NULL REFERENCES arisan_groups(id) ON DELETE CASCADE,
    round_number INT NOT NULL,
    draw_date DATE NOT NULL,
    winner_member_id UUID REFERENCES arisan_members(id),
    total_pot_amount BIGINT NOT NULL,
    status VARCHAR(20) DEFAULT 'DRAWN' CHECK (status IN ('PENDING', 'DRAWN', 'PAID_OUT')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 5. MODUL UTANG PIUTANG P2P
-- ============================================================================

CREATE TABLE debts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    party_name VARCHAR(100) NOT NULL,
    party_phone VARCHAR(20),
    type VARCHAR(15) NOT NULL CHECK (type IN ('PAYABLE', 'RECEIVABLE')),
    total_amount BIGINT NOT NULL,
    remaining_amount BIGINT NOT NULL,
    due_date DATE,
    status VARCHAR(20) DEFAULT 'UNPAID' CHECK (status IN ('UNPAID', 'PARTIAL', 'SETTLED')),
    proof_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE debt_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    debt_id UUID NOT NULL REFERENCES debts(id) ON DELETE CASCADE,
    wallet_id UUID REFERENCES wallets(id) ON DELETE SET NULL,
    amount_paid BIGINT NOT NULL,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 6. UNIVERSAL TRANSACTION LEDGER (Kas Pribadi & Kas Komunitas)
-- ============================================================================

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    wallet_id UUID REFERENCES wallets(id) ON DELETE SET NULL, -- Terisi jika mutasi dompet pribadi
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE, -- Terisi jika mutasi kas komunitas
    type VARCHAR(10) NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
    amount BIGINT NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    description TEXT,
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Foreign Reference (Zero Double-Entry Link)
    source_ref_type VARCHAR(30) CHECK (source_ref_type IN ('DUES_INVOICE', 'ARISAN_ROUND', 'DEBT_PAYMENT', 'MANUAL')),
    source_ref_id UUID,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 7. REMINDER ENGINE QUEUE
-- ============================================================================

CREATE TABLE reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    trigger_source VARCHAR(30) NOT NULL, -- 'DUES_DUE_DATE', 'DEBT_DUE_DATE', 'ARISAN_DRAW'
    channel VARCHAR(20) DEFAULT 'PUSH' CHECK (channel IN ('PUSH', 'WHATSAPP_LINK', 'WHATSAPP_OFFICIAL')),
    status VARCHAR(20) DEFAULT 'QUEUED' CHECK (status IN ('QUEUED', 'SENT', 'FAILED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## BAGIAN 4: ROW-LEVEL SECURITY (RLS) & ISOLASI DATA PRIVAT

> [!important] Perlindungan Data Pribadi Warga (UU PDP)
> Pengurus atau Bendahara RT **DILARANG KERAS** melihat saldo dompet pribadi (`wallets`), mutasi pengeluaran pribadi (`transactions`), atau catatan utang pribadi warga. RLS menjamin isolasi data ini secara kriptografis di level database:

```sql
-- Aktifkan RLS pada tabel sensitif
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;

-- Kebijakan: Pengguna hanya boleh melihat dan mengedit dompet miliknya sendiri
CREATE POLICY wallet_user_isolation ON wallets
    FOR ALL
    USING (auth.uid() = user_id);

-- Kebijakan: Pengguna hanya boleh mengakses transaksi pribadinya, 
-- atau transaksi kas komunitas jika pengguna terdaftar sebagai anggota komunitas tersebut
CREATE POLICY transaction_isolation ON transactions
    FOR ALL
    USING (
        (workspace_id IS NULL AND auth.uid() = user_id)
        OR 
        (workspace_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM workspace_members 
            WHERE workspace_members.workspace_id = transactions.workspace_id 
            AND workspace_members.user_id = auth.uid()
        ))
    );
```

---

## BAGIAN 5: ATURAN TRANSAKSI FINANSIAL (ACID BEST PRACTICES)

1. **Format Nilai Mata Uang:** Semua nominal wajib menggunakan `BIGINT` dalam satuan Rupiah penuh. Tidak diperkenankan menggunakan tipe `FLOAT` atau `DOUBLE` untuk mencegah distorsi pembulatan bilangan pecahan desimal.
2. **Atomic Approval (Verifikasi Iuran):** Ketika bendahara menyetujui transfer iuran warga, eksekusi status invoice dan pencatatan ke buku kas komunitas wajib dibungkus dalam blok `BEGIN ... COMMIT`:
   ```sql
   BEGIN;
     UPDATE dues_invoices 
     SET status = 'PAID', paid_at = NOW(), verified_by = :admin_id 
     WHERE id = :invoice_id;

     INSERT INTO transactions (user_id, workspace_id, type, amount, description, source_ref_type, source_ref_id)
     VALUES (:member_user_id, :workspace_id, 'INCOME', :amount, 'Iuran RT Periode ' || :period, 'DUES_INVOICE', :invoice_id);
   COMMIT;
   ```
3. **Idempotency Tagihan:** Pembuatan tagihan berulang bulanan (*bulk invoice generation*) memanfaatkan kombinasi unik `(dues_category_id, member_id, period)` untuk mencegah penerbitan tagihan ganda ke warga yang sama.

---
*Langkah berikutnya:* Pelajari kontrak API dan peta jalan pengembangan pada [[bisnis/kaskita/04-spesifikasi-api-dan-sprint-roadmap|04-spesifikasi-api-dan-sprint-roadmap.md]].
