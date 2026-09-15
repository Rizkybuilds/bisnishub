-- ============================================================================
-- KASKITA SEED DATA
-- File: seed.sql
-- Description: Master data kategori default sistem dan data demonstrasi
-- ============================================================================

-- 1. KATEGORI PENGELUARAN SISTEM (EXPENSE)
INSERT INTO categories (name, type, icon, is_system) VALUES
('Makanan & Minuman', 'EXPENSE', 'utensils', TRUE),
('Transportasi', 'EXPENSE', 'car', TRUE),
('Belanja Harian', 'EXPENSE', 'shopping-cart', TRUE),
('Tagihan Rumah Tangga', 'EXPENSE', 'home', TRUE),
('Iuran Lingkungan & RT', 'EXPENSE', 'users', TRUE),
('Setoran Arisan', 'EXPENSE', 'rotate-cw', TRUE),
('Pembayaran Utang', 'EXPENSE', 'arrow-up-right', TRUE),
('Hiburan & Rekreasi', 'EXPENSE', 'gamepad-2', TRUE),
('Kesehatan', 'EXPENSE', 'heart-pulse', TRUE),
('Pendidikan', 'EXPENSE', 'book-open', TRUE)
ON CONFLICT DO NOTHING;

-- 2. KATEGORI PEMASUKAN SISTEM (INCOME)
INSERT INTO categories (name, type, icon, is_system) VALUES
('Gaji & Upah', 'INCOME', 'banknote', TRUE),
('Bonus & Tunjangan', 'INCOME', 'gift', TRUE),
('Hasil Usaha / Jualan', 'INCOME', 'store', TRUE),
('Tarikan Arisan (Menang)', 'INCOME', 'trophy', TRUE),
('Pelunasan Piutang Teman', 'INCOME', 'arrow-down-left', TRUE),
('Pendapatan Lain-lain', 'INCOME', 'plus-circle', TRUE)
ON CONFLICT DO NOTHING;
