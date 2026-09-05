-- ====================================================================
-- TEESTOCK — MIGRASI FIX RLS (Row Level Security)
-- Jalankan di Supabase SQL Editor setelah schema.sql
-- Tanggal: September 2026
-- ====================================================================
-- 
-- PERUBAHAN:
-- 1. Tabel publik (ts_products, ts_unit_economics) → READ-ONLY untuk anon
-- 2. Tabel sensitif (ts_orders, ts_order_items, ts_inventory) → 
--    hanya authenticated user yang bisa baca & tulis
-- 3. Semua DELETE policy dihapus dari anon access
-- ====================================================================

-- =====================
-- HAPUS SEMUA POLICY LAMA
-- =====================

-- ts_products
DROP POLICY IF EXISTS "Allow public read ts_products" ON ts_products;
DROP POLICY IF EXISTS "Allow public insert ts_products" ON ts_products;
DROP POLICY IF EXISTS "Allow public update ts_products" ON ts_products;
DROP POLICY IF EXISTS "Allow public delete ts_products" ON ts_products;

-- ts_unit_economics
DROP POLICY IF EXISTS "Allow public read ts_unit_economics" ON ts_unit_economics;
DROP POLICY IF EXISTS "Allow public insert ts_unit_economics" ON ts_unit_economics;
DROP POLICY IF EXISTS "Allow public update ts_unit_economics" ON ts_unit_economics;
DROP POLICY IF EXISTS "Allow public delete ts_unit_economics" ON ts_unit_economics;

-- ts_inventory
DROP POLICY IF EXISTS "Allow public read ts_inventory" ON ts_inventory;
DROP POLICY IF EXISTS "Allow public insert ts_inventory" ON ts_inventory;
DROP POLICY IF EXISTS "Allow public update ts_inventory" ON ts_inventory;

-- ts_orders
DROP POLICY IF EXISTS "Allow public read ts_orders" ON ts_orders;
DROP POLICY IF EXISTS "Allow public insert ts_orders" ON ts_orders;
DROP POLICY IF EXISTS "Allow public update ts_orders" ON ts_orders;

-- ts_order_items
DROP POLICY IF EXISTS "Allow public read ts_order_items" ON ts_order_items;
DROP POLICY IF EXISTS "Allow public insert ts_order_items" ON ts_order_items;


-- =====================
-- POLICY BARU: ts_products (Katalog — publik baca, admin tulis)
-- =====================
CREATE POLICY "anon_read_products"
  ON ts_products FOR SELECT
  USING (true);

CREATE POLICY "auth_insert_products"
  ON ts_products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "auth_update_products"
  ON ts_products FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "auth_delete_products"
  ON ts_products FOR DELETE
  TO authenticated
  USING (true);


-- =====================
-- POLICY BARU: ts_unit_economics (HPP & Pricing — publik baca, admin tulis)
-- =====================
CREATE POLICY "anon_read_unit_economics"
  ON ts_unit_economics FOR SELECT
  USING (true);

CREATE POLICY "auth_insert_unit_economics"
  ON ts_unit_economics FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "auth_update_unit_economics"
  ON ts_unit_economics FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "auth_delete_unit_economics"
  ON ts_unit_economics FOR DELETE
  TO authenticated
  USING (true);


-- =====================
-- POLICY BARU: ts_inventory (Stok — hanya admin)
-- =====================
CREATE POLICY "auth_read_inventory"
  ON ts_inventory FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "auth_insert_inventory"
  ON ts_inventory FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "auth_update_inventory"
  ON ts_inventory FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "auth_delete_inventory"
  ON ts_inventory FOR DELETE
  TO authenticated
  USING (true);


-- =====================
-- POLICY BARU: ts_orders (Pesanan — hanya admin)
-- =====================
CREATE POLICY "auth_read_orders"
  ON ts_orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "auth_insert_orders"
  ON ts_orders FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "auth_update_orders"
  ON ts_orders FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "auth_delete_orders"
  ON ts_orders FOR DELETE
  TO authenticated
  USING (true);


-- =====================
-- POLICY BARU: ts_order_items (Detail Pesanan — hanya admin)
-- =====================
CREATE POLICY "auth_read_order_items"
  ON ts_order_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "auth_insert_order_items"
  ON ts_order_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "auth_update_order_items"
  ON ts_order_items FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "auth_delete_order_items"
  ON ts_order_items FOR DELETE
  TO authenticated
  USING (true);


-- =====================
-- VERIFIKASI
-- =====================
-- Setelah menjalankan script ini, cek di Supabase Dashboard:
-- 1. Buka Authentication > Policies
-- 2. Pastikan ts_products & ts_unit_economics punya "anon_read" + "auth_*"
-- 3. Pastikan ts_inventory, ts_orders, ts_order_items HANYA punya "auth_*"
-- 4. Test: buka browser console, coba supabase.from('ts_orders').select('*')
--    tanpa login → harus return empty array (bukan data customer!)
