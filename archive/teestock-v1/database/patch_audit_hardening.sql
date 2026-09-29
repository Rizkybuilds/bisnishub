-- ==============================================================================
-- 🔒 TEESTOCK SECURITY HARDENING PATCH: P1 & P2 AUDIT RESOLUTION
-- Menutup celah:
-- 1. increment_voucher_usage: Set search_path, revoke dari publik, grant service_role.
-- 2. track_guest_order: Set search_path, wajib 4 digit nomor HP, hapus query longgar,
--    revoke dari publik, grant service_role.
-- 3. ts_reviews: Ubah default is_verified = false, role_badge = 'Ulasan Komunitas',
--    cabut public_insert_reviews, alihkan ke Edge Function via service_role.
-- 4. Set search_path = public, pg_temp pada seluruh SECURITY DEFINER functions.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Kunci increment_voucher_usage (P1: Voucher DoS Prevention)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.increment_voucher_usage(voucher_code TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    UPDATE public.ts_vouchers
    SET used_count = COALESCE(used_count, 0) + 1,
        updated_at = NOW()
    WHERE UPPER(code) = UPPER(TRIM(voucher_code));
END;
$$;

REVOKE ALL ON FUNCTION public.increment_voucher_usage(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_voucher_usage(TEXT) TO service_role;


-- ------------------------------------------------------------------------------
-- 2. Amankan track_guest_order (P1: Order Metadata Enumeration Prevention)
-- ------------------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.track_guest_order(TEXT, TEXT);
DROP FUNCTION IF EXISTS public.track_guest_order(TEXT);

CREATE OR REPLACE FUNCTION public.track_guest_order(p_order_no TEXT, p_phone_last4 TEXT)
RETURNS TABLE (
    order_number VARCHAR,
    status VARCHAR,
    tracking_number VARCHAR,
    created_at TIMESTAMPTZ,
    items JSON,
    customer_masked TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    clean_order TEXT;
    clean_last4 TEXT;
BEGIN
    clean_order := UPPER(TRIM(COALESCE(p_order_no, '')));
    clean_last4 := regexp_replace(COALESCE(p_phone_last4, ''), '\D', '', 'g');

    -- Validasi wajib: Nomor order tidak boleh kosong dan 4 digit terakhir no HP harus tepat 4 angka
    IF clean_order = '' OR length(clean_last4) <> 4 THEN
        RAISE EXCEPTION 'Verifikasi gagal: Nomor pesanan dan 4 digit terakhir nomor HP wajib diisi dengan tepat.';
    END IF;

    RETURN QUERY
    SELECT 
        o.order_number,
        o.status,
        o.tracking_number,
        o.created_at,
        COALESCE(json_agg(json_build_object(
            'name', i.product_name,
            'garment', i.garment,
            'size', i.size,
            'color', i.color,
            'qty', i.qty
        )) FILTER (WHERE i.id IS NOT NULL), '[]'::json) AS items,
        concat(left(o.customer_name, 2), '*** ', right(o.customer_name, 1)) AS customer_masked
    FROM ts_orders o
    LEFT JOIN ts_order_items i ON o.id = i.order_id
    WHERE o.order_number = clean_order
      AND right(regexp_replace(o.customer_phone, '\D', '', 'g'), 4) = clean_last4
    GROUP BY o.id, o.order_number, o.status, o.tracking_number, o.created_at, o.customer_name
    ORDER BY o.created_at DESC
    LIMIT 1;
END;
$$;

REVOKE ALL ON FUNCTION public.track_guest_order(TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.track_guest_order(TEXT, TEXT) TO service_role;


-- ------------------------------------------------------------------------------
-- 3. Amankan ts_reviews (P1: Verified Buyer Integrity & Anti-Spoofing)
-- ------------------------------------------------------------------------------
ALTER TABLE public.ts_reviews ALTER COLUMN is_verified SET DEFAULT false;
ALTER TABLE public.ts_reviews ALTER COLUMN role_badge SET DEFAULT 'Ulasan Komunitas';

-- Cabut akses insert publik langsung
DROP POLICY IF EXISTS "public_insert_reviews" ON public.ts_reviews;
DROP POLICY IF EXISTS "service_role_insert_reviews" ON public.ts_reviews;
DROP POLICY IF EXISTS "service_role_manage_reviews" ON public.ts_reviews;

-- Izinkan service_role (Edge Function) dan Admin untuk menulis review
CREATE POLICY "service_role_manage_reviews" ON public.ts_reviews FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ------------------------------------------------------------------------------
-- 4. Kunci search_path pada seluruh SECURITY DEFINER Functions Lain (P2 Hardening)
-- ------------------------------------------------------------------------------

-- 4a. handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    INSERT INTO public.ts_user_profiles (id, email, full_name, avatar_url, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            split_part(NEW.email, '@', 1)
        ),
        COALESCE(
            NEW.raw_user_meta_data->>'avatar_url',
            NEW.raw_user_meta_data->>'picture',
            NULL
        ),
        'member'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

-- 4b. is_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER STABLE
SET search_path = public, pg_temp
AS $$
BEGIN
    IF current_user IN ('postgres', 'supabase_admin', 'service_role') 
       OR (current_setting('request.jwt.claims', true) IS NULL)
       OR (current_setting('request.jwt.claim.role', true) = 'service_role') THEN
        RETURN TRUE;
    END IF;

    RETURN EXISTS (
        SELECT 1 
        FROM public.ts_user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$;

-- 4c. protect_user_role
CREATE OR REPLACE FUNCTION public.protect_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF current_user IN ('postgres', 'supabase_admin', 'service_role')
       OR (current_setting('request.jwt.claims', true) IS NULL)
       OR (current_setting('request.jwt.claim.role', true) = 'service_role') THEN
        RETURN NEW;
    END IF;

    IF NEW.role IS DISTINCT FROM OLD.role AND NOT public.is_admin() THEN
        RAISE EXCEPTION 'Akses ditolak: Hanya Administrator yang dapat mengubah role pengguna.';
    END IF;
    RETURN NEW;
END;
$$;

-- 4d. increment_review_helpful
CREATE OR REPLACE FUNCTION public.increment_review_helpful(review_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    UPDATE public.ts_reviews
    SET helpful_count = COALESCE(helpful_count, 0) + 1
    WHERE id = review_id;
END;
$$;

-- 4e. link_guest_orders_on_signup
CREATE OR REPLACE FUNCTION public.link_guest_orders_on_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    clean_phone TEXT;
    user_email TEXT;
BEGIN
    SELECT email INTO user_email FROM auth.users WHERE id = NEW.id;
    clean_phone := right(regexp_replace(COALESCE(NEW.phone, ''), '\D', '', 'g'), 8);

    UPDATE public.ts_orders
    SET user_id = NEW.id
    WHERE user_id IS NULL
      AND (
        (user_email IS NOT NULL AND user_email <> '' AND customer_phone ILIKE '%' || user_email || '%')
        OR (length(clean_phone) >= 8 AND regexp_replace(customer_phone, '\D', '', 'g') LIKE '%' || clean_phone || '%')
      );

    RETURN NEW;
END;
$$;

-- 4f. apply_procurement_moving_average
CREATE OR REPLACE FUNCTION public.apply_procurement_moving_average()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    curr_stock INT;
    curr_cost NUMERIC;
    new_avg NUMERIC;
BEGIN
    SELECT COALESCE(stock_level, 0), COALESCE(unit_cost, 0)
    INTO curr_stock, curr_cost
    FROM public.ts_inventory
    WHERE sku = NEW.item_sku;

    IF curr_stock IS NOT NULL THEN
        IF (curr_stock + NEW.qty) > 0 THEN
            new_avg := ROUND(
                ((curr_stock * curr_cost) + (NEW.qty * NEW.unit_cost)) / (curr_stock + NEW.qty),
                2
            );
        ELSE
            new_avg := NEW.unit_cost;
        END IF;

        UPDATE public.ts_inventory
        SET stock_level = curr_stock + NEW.qty,
            unit_cost = new_avg,
            updated_at = NOW()
        WHERE sku = NEW.item_sku;
    END IF;

    INSERT INTO public.ts_cash_ledger (
        entry_date,
        flow_type,
        category,
        amount,
        payment_source,
        counterparty,
        reference_no,
        description,
        is_reimbursable
    ) VALUES (
        NEW.procurement_date,
        'expense',
        'cogs',
        NEW.total_cost,
        NEW.payment_source,
        NEW.supplier_name,
        NEW.procurement_no,
        'Pengadaan: ' || NEW.item_name || ' (' || NEW.qty || ' ' || NEW.unit_measure || ' @ Rp ' || NEW.unit_cost || ')',
        (NEW.payment_source = 'personal_pocket')
    );

    RETURN NEW;
END;
$$;
