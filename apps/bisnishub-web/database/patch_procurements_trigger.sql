-- ==============================================================================
-- PATCH: FIX APPLY_PROCUREMENT_MOVING_AVERAGE TRIGGER FUNCTION
-- Fixes column names for ts_inventory (sku_item, stock_qty, cost_per_unit)
-- and ts_cash_ledger (transaction_no, transaction_date, business_unit, etc.)
-- Adds support for design_license procurement item type
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.apply_procurement_moving_average()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    current_stock NUMERIC;
    current_cost NUMERIC;
    new_avg_cost NUMERIC;
    new_stock NUMERIC;
    real_unit_cost NUMERIC;
    tx_cat VARCHAR(50);
BEGIN
    real_unit_cost := CASE WHEN NEW.qty > 0 THEN ROUND(NEW.total_cost / NEW.qty, 2) ELSE NEW.unit_cost END;

    -- Cari item inventory yang cocok berdasarkan SKU jika ada
    IF NEW.item_sku IS NOT NULL AND NEW.item_sku <> '' THEN
        SELECT stock_qty, cost_per_unit INTO current_stock, current_cost
        FROM public.ts_inventory
        WHERE sku_item = NEW.item_sku;

        IF FOUND THEN
            IF current_stock > 0 THEN
                new_avg_cost := ROUND(((current_stock * current_cost) + (NEW.qty * real_unit_cost)) / (current_stock + NEW.qty), 2);
            ELSE
                new_avg_cost := real_unit_cost;
            END IF;

            new_stock := current_stock + ROUND(NEW.qty);

            UPDATE public.ts_inventory
            SET stock_qty = new_stock,
                cost_per_unit = new_avg_cost,
                updated_at = NOW()
            WHERE sku_item = NEW.item_sku;

            IF NEW.item_type = 'blank_tshirt' THEN
                UPDATE public.ts_products
                SET cost_blank = new_avg_cost,
                    updated_at = NOW()
                WHERE sku = NEW.item_sku OR sku LIKE '%' || NEW.item_sku || '%';
            END IF;
        END IF;
    END IF;

    -- Tentukan kategori ledger
    IF NEW.item_type = 'design_license' THEN
        tx_cat := 'design_license';
    ELSIF NEW.item_type = 'dtf_film' THEN
        tx_cat := 'dtf_printing';
    ELSIF NEW.item_type IN ('sticker_vendor', 'packaging', 'supplies') THEN
        tx_cat := 'unboxing_packaging';
    ELSE
        tx_cat := 'blank_garment';
    END IF;

    -- Catat otomatis pengeluaran belanja ini ke ts_cash_ledger jika belum ada
    INSERT INTO public.ts_cash_ledger (
        transaction_no, 
        transaction_date, 
        business_unit,
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
        'teestock',
        'CASH_OUT',
        tx_cat,
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
$$;
