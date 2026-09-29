-- ==============================================================================
-- PATCH: CURATED DESIGN SOURCING ECONOMICS & CREATOR ROYALTIES
-- MultiGraph & TeeStock Master Catalog & PIM
-- ==============================================================================

-- 1. Pastikan ekstensi dan tabel ts_products memiliki kolom-kolom model kurasi desain
ALTER TABLE ts_products 
  ADD COLUMN IF NOT EXISTS design_source TEXT DEFAULT 'in_house';

ALTER TABLE ts_products 
  ADD COLUMN IF NOT EXISTS design_cost NUMERIC DEFAULT 0;

ALTER TABLE ts_products 
  ADD COLUMN IF NOT EXISTS amortization_target NUMERIC DEFAULT 25;

ALTER TABLE ts_products 
  ADD COLUMN IF NOT EXISTS creator_name TEXT;

ALTER TABLE ts_products 
  ADD COLUMN IF NOT EXISTS creator_handle TEXT;

ALTER TABLE ts_products 
  ADD COLUMN IF NOT EXISTS royalty_amount NUMERIC DEFAULT 0;

ALTER TABLE ts_products 
  ADD COLUMN IF NOT EXISTS creator_payout_account TEXT;

ALTER TABLE ts_products 
  ADD COLUMN IF NOT EXISTS license_source TEXT;

-- 2. Tambahkan komentar dokumentasi skema database
COMMENT ON COLUMN ts_products.design_source IS 'Model pengadaan: flat_fee (Beli Putih Etsy/Freelance), creator_collab (Bagi hasil royalti kreator), atau in_house';
COMMENT ON COLUMN ts_products.design_cost IS 'Biaya beli putus one-off jika flat_fee (dalam Rupiah)';
COMMENT ON COLUMN ts_products.amortization_target IS 'Target kuota penjualan (pcs) untuk mengamortisasi biaya beli flat_fee (default 25 pcs)';
COMMENT ON COLUMN ts_products.creator_name IS 'Nama lengkap seniman / komikus / illustrator jika model creator_collab';
COMMENT ON COLUMN ts_products.creator_handle IS 'Akun media sosial kreator (misal @seniman_indie) untuk exposure & kolaborasi';
COMMENT ON COLUMN ts_products.royalty_amount IS 'Beban royalti tunai per kaos terjual (misal Rp 20.000 atau Rp 25.000)';
COMMENT ON COLUMN ts_products.creator_payout_account IS 'Nomor rekening atau e-wallet untuk pencairan payout royalti bulanan';
COMMENT ON COLUMN ts_products.license_source IS 'Platform lisensi asal jika beli putih (misal Etsy, Creative Market, Fiverr, Fastwork)';

-- 3. Tambahkan index untuk mempercepat filter katalog berdasarkan model kurasi desain
CREATE INDEX IF NOT EXISTS idx_ts_products_design_source ON ts_products(design_source);
