-- ============================================================================
-- KASKITA DATABASE SCHEMA (INITIAL MIGRATION)
-- File: 20260915000001_initial_kaskita_schema.sql
-- Description: Core Schema for Hub & Spoke Personal & Community Finance
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. PENGGUNA & DOMPET PRIBADI (THE HUB)
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Multi-Dompet Pribadi Pengguna
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL, -- e.g. "Kas Tunai", "BCA Pribadi", "GoPay"
    wallet_type VARCHAR(20) NOT NULL DEFAULT 'CASH' CHECK (wallet_type IN ('CASH', 'BANK', 'EWALLET')),
    balance BIGINT NOT NULL DEFAULT 0,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Master Kategori Transaksi
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- NULL jika kategori bawaan sistem
    name VARCHAR(50) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
    icon VARCHAR(30) DEFAULT 'receipt',
    is_system BOOLEAN DEFAULT FALSE
);

-- Limit Anggaran Bulanan (Budgeting)
CREATE TABLE IF NOT EXISTS budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    period_month VARCHAR(7) NOT NULL, -- Format: 'YYYY-MM'
    limit_amount BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, category_id, period_month)
);

-- ============================================================================
-- 2. RUANG KERJA KOMUNITAS & HAK AKSES (THE SPOKES)
-- ============================================================================

CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL, -- e.g. "RT 05 Sukamaju", "Arisan Keluarga"
    type VARCHAR(20) NOT NULL DEFAULT 'COMMUNITY' CHECK (type IN ('COMMUNITY', 'PERSONAL')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workspace_members (
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

CREATE TABLE IF NOT EXISTS dues_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- e.g. "Iuran Sampah & Keamanan"
    amount BIGINT NOT NULL,
    billing_cycle VARCHAR(20) DEFAULT 'MONTHLY' CHECK (billing_cycle IN ('MONTHLY', 'WEEKLY', 'ONCE')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dues_invoices (
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
    synced_to_personal BOOLEAN DEFAULT FALSE,
    personal_wallet_id UUID REFERENCES wallets(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(dues_category_id, member_id, period)
);

-- ============================================================================
-- 4. MODUL ARISAN DIGITAL
-- ============================================================================

CREATE TABLE IF NOT EXISTS arisan_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    amount_per_period BIGINT NOT NULL,
    cycle_period VARCHAR(20) DEFAULT 'MONTHLY' CHECK (cycle_period IN ('WEEKLY', 'MONTHLY')),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('DRAFT', 'ACTIVE', 'COMPLETED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS arisan_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    arisan_group_id UUID NOT NULL REFERENCES arisan_groups(id) ON DELETE CASCADE,
    workspace_member_id UUID NOT NULL REFERENCES workspace_members(id) ON DELETE CASCADE,
    slot_number INT NOT NULL,
    has_won BOOLEAN DEFAULT FALSE,
    won_at_round INT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS arisan_rounds (
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

CREATE TABLE IF NOT EXISTS debts (
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

CREATE TABLE IF NOT EXISTS debt_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    debt_id UUID NOT NULL REFERENCES debts(id) ON DELETE CASCADE,
    wallet_id UUID REFERENCES wallets(id) ON DELETE SET NULL,
    amount_paid BIGINT NOT NULL,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 6. UNIVERSAL TRANSACTION LEDGER
-- ============================================================================

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    wallet_id UUID REFERENCES wallets(id) ON DELETE SET NULL,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    type VARCHAR(10) NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
    amount BIGINT NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    description TEXT,
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    source_ref_type VARCHAR(30) CHECK (source_ref_type IN ('DUES_INVOICE', 'ARISAN_ROUND', 'DEBT_PAYMENT', 'MANUAL')),
    source_ref_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 7. REMINDERS QUEUE
-- ============================================================================

CREATE TABLE IF NOT EXISTS reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    trigger_source VARCHAR(30) NOT NULL,
    channel VARCHAR(20) DEFAULT 'PUSH' CHECK (channel IN ('PUSH', 'WHATSAPP_LINK', 'WHATSAPP_OFFICIAL')),
    status VARCHAR(20) DEFAULT 'QUEUED' CHECK (status IN ('QUEUED', 'SENT', 'FAILED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 8. INDEXING PERFORMA
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_wallets_user ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_ws ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_dues_invoices_ws_period ON dues_invoices(workspace_id, period);
CREATE INDEX IF NOT EXISTS idx_dues_invoices_member ON dues_invoices(member_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet ON transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_transactions_workspace ON transactions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_debts_user ON debts(user_id);

-- ============================================================================
-- 9. STORED PROCEDURE: ATOMIC INVOICE VERIFICATION & ZERO DOUBLE-ENTRY
-- ============================================================================

CREATE OR REPLACE FUNCTION approve_dues_invoice(
    p_invoice_id UUID,
    p_admin_id UUID,
    p_sync_to_personal BOOLEAN DEFAULT FALSE,
    p_wallet_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_invoice RECORD;
    v_member RECORD;
    v_res JSONB;
BEGIN
    -- Ambil data invoice
    SELECT * INTO v_invoice FROM dues_invoices WHERE id = p_invoice_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invoice tidak ditemukan';
    END IF;

    IF v_invoice.status = 'PAID' THEN
        RAISE EXCEPTION 'Invoice sudah berstatus LUNAS';
    END IF;

    -- Ambil data member pemegang invoice
    SELECT * INTO v_member FROM workspace_members WHERE id = v_invoice.member_id;

    -- 1. Update status invoice
    UPDATE dues_invoices
    SET status = 'PAID',
        paid_at = NOW(),
        verified_by = p_admin_id,
        synced_to_personal = p_sync_to_personal,
        personal_wallet_id = p_wallet_id
    WHERE id = p_invoice_id;

    -- 2. Catat kas masuk di workspace RT
    INSERT INTO transactions (
        user_id,
        workspace_id,
        type,
        amount,
        description,
        source_ref_type,
        source_ref_id
    ) VALUES (
        v_member.user_id,
        v_invoice.workspace_id,
        'INCOME',
        v_invoice.amount,
        'Iuran Kas Komunitas Periode ' || v_invoice.period,
        'DUES_INVOICE',
        p_invoice_id
    );

    -- 3. Zero Double-Entry: Sinkronisasi ke dompet kas pribadi warga (jika dipilih)
    IF p_sync_to_personal AND p_wallet_id IS NOT NULL THEN
        -- Potong saldo dompet
        UPDATE wallets
        SET balance = balance - v_invoice.amount
        WHERE id = p_wallet_id AND user_id = v_member.user_id;

        -- Catat mutasi pengeluaran kas pribadi
        INSERT INTO transactions (
            user_id,
            wallet_id,
            type,
            amount,
            description,
            source_ref_type,
            source_ref_id
        ) VALUES (
            v_member.user_id,
            p_wallet_id,
            'EXPENSE',
            v_invoice.amount,
            'Pembayaran Iuran RT Periode ' || v_invoice.period,
            'DUES_INVOICE',
            p_invoice_id
        );
    END IF;

    v_res := jsonb_build_object(
        'success', true,
        'invoice_id', p_invoice_id,
        'status', 'PAID',
        'synced_to_personal', p_sync_to_personal
    );

    RETURN v_res;
END;
$$;
