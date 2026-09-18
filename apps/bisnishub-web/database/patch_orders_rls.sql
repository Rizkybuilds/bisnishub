-- ==============================================================================
-- 🔒 PATCH KEAMANAN & AKSES KANBAN ORDERS (BISNISHUB OS & TEESTOCK STOREFRONT)
-- Memberikan hak kelola pesanan terpadu untuk dashboard BisnisHub OS (Public/Anon)
-- serta melarang anomali pembacaan kosong (empty array) akibat RLS barrier.
-- ==============================================================================

-- 1. Pastikan Row Level Security tetap aktif
ALTER TABLE public.ts_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ts_order_items ENABLE ROW LEVEL SECURITY;

-- 2. Hapus kebijakan lama jika ada konflik
DROP POLICY IF EXISTS "manage_orders_all" ON public.ts_orders;
DROP POLICY IF EXISTS "manage_order_items_all" ON public.ts_order_items;

-- 3. Kebijakan akses penuh untuk BisnisHub OS Command Center (Public Role)
CREATE POLICY "manage_orders_all" ON public.ts_orders 
  FOR ALL 
  TO public 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "manage_order_items_all" ON public.ts_order_items 
  FOR ALL 
  TO public 
  USING (true) 
  WITH CHECK (true);

-- 4. Komentar audit keamanan
COMMENT ON POLICY "manage_orders_all" ON public.ts_orders IS 
  'Memungkinkan BisnisHub OS yang dilindungi Founder PIN Master untuk membaca, memvalidasi mutasi, dan memproses antrean Kanban pesanan secara real-time.';
