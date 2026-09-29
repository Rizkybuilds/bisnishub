-- ====================================================================
-- MIGRATION: FOUNDER COMMAND CENTER & FINANCIAL SYSTEM (TEESTOCK)
-- Target Project: https://supabase.com/dashboard/project/tovslowsopqtuxmrogeu/sql/new
-- Sifat Migrasi: Aman & Non-Destruktif (TIDAK menghapus data tabel yang sudah ada)
-- ====================================================================

-- 1. TABEL: ts_procurements (Pencatatan Belanja Bahan & Barang)
CREATE TABLE IF NOT EXISTS ts_procurements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    procurement_no VARCHAR(50) UNIQUE NOT NULL,      -- Contoh: PO-2609-001
    item_type VARCHAR(50) NOT NULL,                  -- blank_tshirt, dtf_film, packaging, electricity, other
    item_sku VARCHAR(50),                            -- SKU di ts_inventory / ts_products
    item_name VARCHAR(150) NOT NULL,
    supplier_name VARCHAR(100) NOT NULL,             -- Distributor NSA, Vendor DTF, MultiGraph, PLN
    purchase_type VARCHAR(30) DEFAULT 'lusinan',     -- satuan, lusinan, partai, roll_meter
    qty NUMERIC(10, 2) NOT NULL CHECK (qty > 0),
    unit_measure VARCHAR(20) DEFAULT 'pcs',          -- pcs, meter, roll, lembar, paket
    unit_cost NUMERIC(12, 2) NOT NULL CHECK (unit_cost >= 0),
    shipping_cost NUMERIC(12, 2) DEFAULT 0,          -- Ongkir pengadaan dari vendor
    total_cost NUMERIC(12, 2) NOT NULL,              -- (qty * unit_cost) + shipping_cost
    payment_source VARCHAR(50) DEFAULT 'business_bank', -- business_bank, personal_pocket, petty_cash
    receipt_url TEXT,                                -- URL foto nota / struk
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ts_procurements_date ON ts_procurements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ts_procurements_sku ON ts_procurements(item_sku);


-- 2. TABEL: ts_cash_ledger (Buku Kas Satu Pintu Pemisahan Kas Bisnis vs Dompet Pribadi)
CREATE TABLE IF NOT EXISTS ts_cash_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_no VARCHAR(50) UNIQUE NOT NULL,      -- Contoh: TX-2609-001
    transaction_date DATE DEFAULT CURRENT_DATE,
    type VARCHAR(20) NOT NULL,                       -- CASH_IN, CASH_OUT
    category VARCHAR(50) NOT NULL,                   -- sales_order, procurement, personal_injection, owner_prive, operational
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    source_account VARCHAR(50) NOT NULL,             -- bank_teestock, qris_midtrans, dompet_pribadi
    destination_account VARCHAR(50),                 -- vendor_nsa, vendor_dtf, rekening_pribadi_founder
    related_id VARCHAR(50),                          -- order_number atau procurement_no
    description TEXT NOT NULL,
    is_personal_wallet BOOLEAN DEFAULT false,        -- True jika transaksi melibatkan dompet pribadi (Injeksi / Prive)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ts_cash_ledger_date ON ts_cash_ledger(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_ts_cash_ledger_type ON ts_cash_ledger(type);
CREATE INDEX IF NOT EXISTS idx_ts_cash_ledger_category ON ts_cash_ledger(category);


-- 3. FUNCTION & TRIGGER: Update Otomatis Moving Average Cost ke Inventory & Sinkronisasi Kas
CREATE OR REPLACE FUNCTION public.apply_procurement_moving_average()
RETURNS TRIGGER AS $$
DECLARE
    current_stock INT;
    current_cost NUMERIC(12, 2);
    real_unit_cost NUMERIC(12, 2);
    new_avg_cost NUMERIC(12, 2);
    new_stock INT;
BEGIN
    -- Hitung unit cost riil termasuk alokasi ongkir pengadaan
    real_unit_cost := NEW.unit_cost + (COALESCE(NEW.shipping_cost, 0) / NEW.qty);

    -- Cek stok dan HPP saat ini di ts_inventory
    SELECT stock_qty, cost_per_unit INTO current_stock, current_cost
    FROM public.ts_inventory
    WHERE sku_item = NEW.item_sku;

    IF FOUND THEN
        -- Jika stok lama ada, hitung moving average
        IF current_stock > 0 THEN
            new_avg_cost := ROUND(((current_stock * current_cost) + (NEW.qty * real_unit_cost)) / (current_stock + NEW.qty), 2);
        ELSE
            new_avg_cost := real_unit_cost;
        END IF;

        new_stock := current_stock + ROUND(NEW.qty);

        -- Perbarui inventory stok dan HPP
        UPDATE public.ts_inventory
        SET stock_qty = new_stock,
            cost_per_unit = new_avg_cost,
            updated_at = NOW()
        WHERE sku_item = NEW.item_sku;

        -- Jika item_type adalah blank_tshirt, perbarui juga cost_blank di ts_products & unit_economics
        IF NEW.item_type = 'blank_tshirt' THEN
            UPDATE public.ts_products
            SET cost_blank = new_avg_cost,
                updated_at = NOW()
            WHERE sku = NEW.item_sku OR sku LIKE '%' || NEW.item_sku || '%';

            UPDATE public.ts_unit_economics
            SET cost_blank = new_avg_cost,
                updated_at = NOW()
            WHERE product_sku = NEW.item_sku OR product_sku LIKE '%' || NEW.item_sku || '%';
        END IF;
    END IF;

    -- Catat otomatis pengeluaran belanja ini ke ts_cash_ledger jika belum ada
    INSERT INTO public.ts_cash_ledger (
        transaction_no, 
        transaction_date, 
        type, 
        category, 
        amount, 
        source_account, 
        destination_account, 
        related_id, 
        description, 
        is_personal_wallet
    ) VALUES (
        'TX-' || NEW.procurement_no,
        CURRENT_DATE,
        'CASH_OUT',
        'procurement',
        NEW.total_cost,
        NEW.payment_source,
        NEW.supplier_name,
        NEW.procurement_no,
        'Pengadaan: ' || NEW.item_name || ' (' || NEW.qty || ' ' || NEW.unit_measure || ' @ Rp ' || NEW.unit_cost || ')',
        (NEW.payment_source = 'personal_pocket')
    )
    ON CONFLICT (transaction_no) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_procurement_moving_average ON public.ts_procurements;
CREATE TRIGGER trg_procurement_moving_average
    AFTER INSERT ON public.ts_procurements
    FOR EACH ROW EXECUTE FUNCTION public.apply_procurement_moving_average();


-- 4. TABEL: ts_fixed_assets (Alat Produksi, Mesin & Peralatan Kerja / CAPEX)
CREATE TABLE IF NOT EXISTS ts_fixed_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_name VARCHAR(150) NOT NULL,
    category VARCHAR(50) DEFAULT 'machine',         -- machine, electronics, furniture, tools
    acquisition_date DATE DEFAULT CURRENT_DATE,
    purchase_cost NUMERIC(12, 2) NOT NULL CHECK (purchase_cost >= 0),
    current_value NUMERIC(12, 2) NOT NULL CHECK (current_value >= 0),
    status VARCHAR(30) DEFAULT 'active',            -- active, maintenance, retired
    location VARCHAR(100) DEFAULT 'In-House Studio',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- 5. TABEL: ts_capital_investments (Arus Ekuitas Modal Founder: Injeksi vs Prive)
CREATE TABLE IF NOT EXISTS ts_capital_investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_no VARCHAR(50) UNIQUE NOT NULL,      -- Contoh: CAP-2609-001
    type VARCHAR(20) NOT NULL,                       -- INJECTION (Modal Masuk), PRIVE (Tarik Laba)
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    source_or_destination VARCHAR(100) NOT NULL,     -- Contoh: Tabungan BCA Pribadi Founder
    transaction_date DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 6. VIEW: ts_view_founder_wealth (Neraca Kasat Mata & Pertumbuhan Kekayaan Bisnis)
CREATE OR REPLACE VIEW ts_view_founder_wealth AS
WITH 
capital_summary AS (
    SELECT 
        COALESCE(SUM(CASE WHEN type = 'INJECTION' THEN amount ELSE 0 END), 0) AS total_injected,
        COALESCE(SUM(CASE WHEN type = 'PRIVE' THEN amount ELSE 0 END), 0) AS total_prive
    FROM ts_capital_investments
),
cash_summary AS (
    SELECT 
        COALESCE(SUM(CASE WHEN type = 'CASH_IN' THEN amount ELSE -amount END), 0) AS net_cash_in_ledger,
        COALESCE(SUM(CASE WHEN type = 'CASH_IN' AND source_account = 'bank_teestock' THEN amount 
                          WHEN type = 'CASH_OUT' AND source_account = 'bank_teestock' THEN -amount ELSE 0 END), 0) AS bank_balance,
        COALESCE(SUM(CASE WHEN source_account = 'qris_midtrans' THEN amount ELSE 0 END), 0) AS qris_balance
    FROM ts_cash_ledger
),
inventory_summary AS (
    SELECT 
        COALESCE(SUM(stock_qty * cost_per_unit), 0) AS total_inventory_asset,
        COALESCE(SUM(CASE WHEN item_type = 'blank_tshirt' THEN stock_qty * cost_per_unit ELSE 0 END), 0) AS blank_stock_asset,
        COALESCE(SUM(CASE WHEN item_type = 'dtf_film' THEN stock_qty * cost_per_unit ELSE 0 END), 0) AS dtf_stock_asset,
        COALESCE(SUM(CASE WHEN item_type IN ('supplies', 'polymailer', 'packaging') THEN stock_qty * cost_per_unit ELSE 0 END), 0) AS packaging_stock_asset
    FROM ts_inventory
),
fixed_assets_summary AS (
    SELECT 
        COALESCE(SUM(current_value), 0) AS total_fixed_assets_value
    FROM ts_fixed_assets
    WHERE status = 'active'
)
SELECT 
    c.total_injected,
    c.total_prive,
    (c.total_injected - c.total_prive) AS net_founder_equity,
    cs.net_cash_in_ledger,
    cs.bank_balance,
    cs.qris_balance,
    inv.total_inventory_asset,
    inv.blank_stock_asset,
    inv.dtf_stock_asset,
    inv.packaging_stock_asset,
    fa.total_fixed_assets_value,
    (cs.net_cash_in_ledger + inv.total_inventory_asset + fa.total_fixed_assets_value) AS total_business_wealth,
    ((cs.net_cash_in_ledger + inv.total_inventory_asset + fa.total_fixed_assets_value) - NULLIF(c.total_injected - c.total_prive, 0)) AS net_wealth_growth
FROM capital_summary c
CROSS JOIN cash_summary cs
CROSS JOIN inventory_summary inv
CROSS JOIN fixed_assets_summary fa;


-- 7. RLS POLICIES: Keamanan Data Keuangan (Hanya Admin)
ALTER TABLE ts_procurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE ts_cash_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE ts_fixed_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ts_capital_investments ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    DROP POLICY IF EXISTS "admin_all_procurements" ON ts_procurements;
    CREATE POLICY "admin_all_procurements" ON ts_procurements FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

    DROP POLICY IF EXISTS "admin_all_cash_ledger" ON ts_cash_ledger;
    CREATE POLICY "admin_all_cash_ledger" ON ts_cash_ledger FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

    DROP POLICY IF EXISTS "admin_manage_fixed_assets" ON ts_fixed_assets;
    CREATE POLICY "admin_manage_fixed_assets" ON ts_fixed_assets FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

    DROP POLICY IF EXISTS "admin_manage_capital_investments" ON ts_capital_investments;
    CREATE POLICY "admin_manage_capital_investments" ON ts_capital_investments FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;


-- 8. SEED DATA AWAL FOUNDER: Mesin Heat Press In-House (Rp 2.500.000) & Modal Awal
INSERT INTO ts_fixed_assets (asset_name, category, acquisition_date, purchase_cost, current_value, status, location, notes)
SELECT 'Mesin Heat Press High-Pressure 38x38 cm', 'machine', CURRENT_DATE, 2500000, 2500000, 'active', 'In-House Studio Rumah', 'Mesin press utama in-house untuk sablon DTF suhu 155°C (kapasitas 40-60 pcs/hari)'
WHERE NOT EXISTS (SELECT 1 FROM ts_fixed_assets WHERE asset_name LIKE '%Heat Press%');

INSERT INTO ts_capital_investments (transaction_no, type, amount, source_or_destination, transaction_date, notes)
VALUES ('CAP-2609-001', 'INJECTION', 5000000, 'Tabungan Pribadi Founder', CURRENT_DATE, 'Setoran modal awal pembentukan bisnis TeeStock (Mesin Heat Press + Persediaan Bahan)')
ON CONFLICT (transaction_no) DO NOTHING;

INSERT INTO ts_cash_ledger (transaction_no, transaction_date, type, category, amount, source_account, destination_account, related_id, description, is_personal_wallet)
VALUES 
('TX-CAP-001', CURRENT_DATE, 'CASH_IN', 'personal_injection', 5000000, 'dompet_pribadi', 'bank_teestock', 'CAP-2609-001', 'Injeksi modal awal founder ke rekening operasional TeeStock', true),
('TX-CAP-002', CURRENT_DATE, 'CASH_OUT', 'operational', 2500000, 'bank_teestock', 'Vendor Alat Press', 'CAP-2609-001', 'Pembelian Aset Tetap: Mesin Heat Press High-Pressure 38x38 cm', false)
ON CONFLICT (transaction_no) DO NOTHING;
