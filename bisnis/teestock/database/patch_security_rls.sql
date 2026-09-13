-- ==============================================================================
-- 🔒 PATCH KEAMANAN TRANSAKSI & ROW LEVEL SECURITY (RLS) TEESTOCK
-- Menutup celah eksploitasi harga di browser dengan membatasi INSERT ke Edge Function / Service Role
-- ==============================================================================

-- 1. Cabut hak INSERT anonim publik yang berisiko pada ts_orders & ts_order_items
DROP POLICY IF EXISTS "public_insert_orders" ON public.ts_orders;
DROP POLICY IF EXISTS "public_insert_order_items" ON public.ts_order_items;

-- 2. Pastikan RLS tetap aktif
ALTER TABLE public.ts_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ts_order_items ENABLE ROW LEVEL SECURITY;

-- 3. Izinkan Service Role (Supabase Edge Function) mengelola pesanan sepenuhnya
DROP POLICY IF EXISTS "service_role_manage_orders" ON public.ts_orders;
CREATE POLICY "service_role_manage_orders" ON public.ts_orders
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_manage_order_items" ON public.ts_order_items;
CREATE POLICY "service_role_manage_order_items" ON public.ts_order_items
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 4. Pengguna terautentikasi (Member) hanya dapat membaca pesanan miliknya sendiri
DROP POLICY IF EXISTS "member_read_own_orders" ON public.ts_orders;
CREATE POLICY "member_read_own_orders" ON public.ts_orders
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "member_read_own_order_items" ON public.ts_order_items;
CREATE POLICY "member_read_own_order_items" ON public.ts_order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.ts_orders o
      WHERE o.id = ts_order_items.order_id
      AND (o.user_id = auth.uid() OR public.is_admin())
    )
  );

-- 5. Admin (Founder Studio) dapat mengelola seluruh pesanan
DROP POLICY IF EXISTS "admin_manage_orders" ON public.ts_orders;
CREATE POLICY "admin_manage_orders" ON public.ts_orders
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_manage_order_items" ON public.ts_order_items;
CREATE POLICY "admin_manage_order_items" ON public.ts_order_items
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 6. Tambahkan kolom payment_session_id & paid_at jika belum ada
ALTER TABLE public.ts_orders ADD COLUMN IF NOT EXISTS payment_session_id TEXT;
ALTER TABLE public.ts_orders ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
