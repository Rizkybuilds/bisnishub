-- Migration: 20260926400000_fast_retail_ordering.sql
-- Description: MGBOS-020 Fast Retail Ordering (Direct Retail Orders for Blanks & Curated Merch, TS-PLAN-09)
-- Specification: MultiGraph Business OS — Sprint 9 (Fast Retail Ordering & POS Direct Checkout)

begin;

-- ============================================================================
-- 1. Schema Modifications: Orders Table
-- ============================================================================

-- Add order_type column to distinguish between B2B Custom and Direct Retail orders
alter table app.orders 
  add column if not exists order_type text not null default 'CUSTOM_B2B' 
  check (order_type in ('CUSTOM_B2B', 'RETAIL_DIRECT'));

-- Make quote and requirement references optional for direct retail orders
alter table app.orders alter column source_quote_id drop not null;
alter table app.orders alter column source_quote_version_id drop not null;
alter table app.orders alter column source_requirement_id drop not null;
alter table app.orders alter column source_requirement_version_id drop not null;

-- Add check constraint ensuring CUSTOM_B2B orders strictly maintain quote/requirement links
alter table app.orders drop constraint if exists check_order_type_sources;
alter table app.orders add constraint check_order_type_sources check (
  (order_type = 'CUSTOM_B2B' and source_quote_id is not null and source_quote_version_id is not null and source_requirement_id is not null and source_requirement_version_id is not null)
  or
  (order_type = 'RETAIL_DIRECT')
);

-- ============================================================================
-- 2. Schema Modifications: Order Items Table
-- ============================================================================

-- Link order items directly to inventory item master for retail products & blanks
alter table app.order_items 
  add column if not exists inventory_item_id uuid references app.inventory_items(id) on delete restrict;

-- Indexes for performance
create index if not exists idx_orders_order_type on app.orders(organization_id, order_type);
create index if not exists idx_order_items_inventory_item on app.order_items(inventory_item_id);

-- ============================================================================
-- 3. Stored Procedure: create_retail_order
-- ============================================================================

create or replace function app.create_retail_order(
  p_organization_id uuid,
  p_actor_id uuid,
  p_brand_id uuid,
  p_customer_account_id uuid,
  p_items jsonb, -- array of { inventory_item_id, quantity, unit_price, discount_total, notes }
  p_request_id uuid default null,
  p_shipping_address jsonb default null,
  p_shipping_cost bigint default 0,
  p_notes text default null,
  p_auto_pay boolean default false,
  p_payment_method text default 'CASH',
  p_payment_reference text default null,
  p_payment_bank text default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_role text;
  v_order_id uuid := gen_random_uuid();
  v_order_number text;
  v_customer app.customer_accounts%rowtype;
  v_customer_snapshot jsonb;
  v_shipping_address jsonb;
  v_org app.organizations%rowtype;
  v_existing app.orders%rowtype;
  
  v_item jsonb;
  v_item_id uuid;
  v_qty integer;
  v_unit_price bigint;
  v_discount_line bigint;
  v_line_subtotal bigint;
  v_inv_item app.inventory_items%rowtype;
  
  v_subtotal bigint := 0;
  v_discount_total bigint := 0;
  v_estimated_cost_total bigint := 0;
  v_grand_total bigint := 0;
  v_estimated_gross_profit bigint := 0;
  
  v_position integer := 1;
  v_reservation_items jsonb := '[]'::jsonb;
  v_reserve_result jsonb;
  
  v_invoice_id uuid;
  v_invoice_number text;
  v_payment_result jsonb;
  v_payment_id uuid;
  v_payment_number text;
  v_request_id uuid := coalesce(p_request_id, gen_random_uuid());
begin
  -- 1. Authorization check
  v_role := app.quote_actor_role(p_organization_id, p_actor_id);
  if v_role not in ('OWNER', 'ADMIN', 'SALES', 'OPERATIONS') then
    raise exception 'Unauthorized to create retail orders';
  end if;

  -- 2. Idempotency check via request_id
  select * into v_existing
  from app.orders
  where created_by_user_id = p_actor_id and request_id = v_request_id;

  if found then
    -- Find existing invoice
    select id, invoice_number into v_invoice_id, v_invoice_number
    from app.invoices
    where order_id = v_existing.id and organization_id = p_organization_id
    limit 1;

    return jsonb_build_object(
      'order_id', v_existing.id,
      'order_number', v_existing.order_number,
      'invoice_id', v_invoice_id,
      'invoice_number', v_invoice_number,
      'payment_id', null,
      'payment_number', null,
      'grand_total', v_existing.grand_total,
      'status', v_existing.status,
      'is_idempotent', true
    );
  end if;

  -- 3. Validate Organization & Brand
  select * into v_org from app.organizations where id = p_organization_id and status = 'ACTIVE';
  if not found then
    raise exception 'Active organization required';
  end if;

  if not exists (select 1 from app.brands where id = p_brand_id and organization_id = p_organization_id and status = 'ACTIVE') then
    raise exception 'Active brand required';
  end if;

  -- 4. Validate Customer Account
  select * into v_customer
  from app.customer_accounts
  where id = p_customer_account_id and organization_id = p_organization_id and status = 'ACTIVE';

  if not found then
    raise exception 'Active customer account required';
  end if;

  v_customer_snapshot := jsonb_build_object(
    'account_id', v_customer.id,
    'account_type', v_customer.account_type,
    'display_name', v_customer.display_name,
    'legal_name', v_customer.legal_name,
    'primary_email', v_customer.primary_email,
    'primary_phone', v_customer.primary_phone
  );

  -- 5. Format Shipping Address
  if p_shipping_address is not null and p_shipping_address <> '{}'::jsonb then
    v_shipping_address := p_shipping_address;
  else
    v_shipping_address := jsonb_build_object(
      'recipient_name', coalesce(v_customer.display_name, 'Pelanggan Ritel'),
      'phone', coalesce(v_customer.primary_phone, '-'),
      'address_type', 'PICKUP_STORE',
      'street', 'Ambil di Toko / Workshop',
      'city', 'Store Pickup'
    );
  end if;

  -- 6. Validate Items
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Retail order must contain at least one item';
  end if;

  -- Pre-compute items and totals
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_item_id := (v_item->>'inventory_item_id')::uuid;
    v_qty := (v_item->>'quantity')::integer;
    v_unit_price := (v_item->>'unit_price')::bigint;
    v_discount_line := coalesce((v_item->>'discount_total')::bigint, 0);

    if v_qty <= 0 then
      raise exception 'Item quantity must be greater than zero';
    end if;

    if v_unit_price < 0 then
      raise exception 'Unit price cannot be negative';
    end if;

    if v_discount_line < 0 or v_discount_line >= (v_qty * v_unit_price) then
      raise exception 'Discount cannot exceed item gross subtotal';
    end if;

    select * into v_inv_item
    from app.inventory_items
    where id = v_item_id and organization_id = p_organization_id and is_active = true;

    if not found then
      raise exception 'Active inventory item % not found', v_item_id;
    end if;

    v_line_subtotal := (v_qty * v_unit_price);
    v_subtotal := v_subtotal + v_line_subtotal;
    v_discount_total := v_discount_total + v_discount_line;
    v_estimated_cost_total := v_estimated_cost_total + (v_qty * v_inv_item.cost_price);

    -- Prepare reservation payload for Anti-Overselling Guard
    v_reservation_items := v_reservation_items || jsonb_build_object(
      'inventory_item_id', v_item_id,
      'quantity', v_qty,
      'location_code', 'MAIN_WORKSHOP'
    );
  end loop;

  -- 7. Calculate Grand Total & Gross Profit
  v_grand_total := v_subtotal - v_discount_total + coalesce(p_shipping_cost, 0);
  v_estimated_gross_profit := v_subtotal - v_discount_total - v_estimated_cost_total;

  if v_grand_total <= 0 then
    raise exception 'Order grand total must be positive';
  end if;

  -- 8. Generate Document Number
  v_order_number := app.generate_document_number(p_organization_id, p_brand_id, 'O');

  -- 9. Insert Order Record
  insert into app.orders (
    id,
    organization_id,
    brand_id,
    order_type,
    customer_account_id,
    order_number,
    status,
    currency,
    subtotal,
    discount_total,
    shipping_total,
    grand_total,
    estimated_cost_total,
    estimated_gross_profit,
    customer_snapshot,
    shipping_address_snapshot,
    payment_terms_snapshot,
    created_by_user_id,
    confirmed_at,
    request_id,
    request_payload
  ) values (
    v_order_id,
    p_organization_id,
    p_brand_id,
    'RETAIL_DIRECT',
    p_customer_account_id,
    v_order_number,
    'CONFIRMED',
    'IDR',
    v_subtotal,
    v_discount_total,
    coalesce(p_shipping_cost, 0),
    v_grand_total,
    v_estimated_cost_total,
    v_estimated_gross_profit,
    v_customer_snapshot,
    v_shipping_address,
    jsonb_build_object('terms', 'CASH_ON_ORDER', 'type', 'RETAIL_DIRECT'),
    p_actor_id,
    now(),
    v_request_id,
    jsonb_build_object('request_id', v_request_id, 'items', p_items, 'notes', p_notes)
  );

  -- 10. Insert Order Items
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_item_id := (v_item->>'inventory_item_id')::uuid;
    v_qty := (v_item->>'quantity')::integer;
    v_unit_price := (v_item->>'unit_price')::bigint;
    v_discount_line := coalesce((v_item->>'discount_total')::bigint, 0);

    select * into v_inv_item from app.inventory_items where id = v_item_id;

    insert into app.order_items (
      order_id,
      position,
      inventory_item_id,
      description,
      quantity,
      unit,
      unit_price,
      discount_total,
      subtotal,
      specification_snapshot
    ) values (
      v_order_id,
      v_position,
      v_item_id,
      v_inv_item.name,
      v_qty,
      v_inv_item.unit,
      v_unit_price,
      v_discount_line,
      (v_qty * v_unit_price) - v_discount_line,
      jsonb_build_object(
        'sku', v_inv_item.sku,
        'name', v_inv_item.name,
        'unit', v_inv_item.unit,
        'category', v_inv_item.category,
        'cost_price', v_inv_item.cost_price,
        'notes', v_item->>'notes'
      )
    );

    v_position := v_position + 1;
  end loop;

  -- 11. Order Audit Record
  insert into app.order_audit (
    organization_id,
    order_id,
    actor_id,
    action,
    details
  ) values (
    p_organization_id,
    v_order_id,
    p_actor_id,
    'order.retail_created',
    jsonb_build_object(
      'order_number', v_order_number,
      'order_type', 'RETAIL_DIRECT',
      'items_count', jsonb_array_length(p_items),
      'grand_total', v_grand_total,
      'auto_pay', p_auto_pay
    )
  );

  -- 12. Reserve Inventory (Anti-Overselling Guard)
  -- Atomically locks stock levels; if unreserved stock is insufficient, this raises an exception and rolls back!
  v_reserve_result := app.reserve_inventory_for_order(
    p_organization_id,
    p_actor_id,
    v_order_id,
    v_reservation_items,
    'Reservasi otomatis pesanan ritel langsung ' || v_order_number
  );

  -- 13. Auto-Issue Commercial Invoice (FULL_PAYMENT)
  v_invoice_number := app.generate_document_number(p_organization_id, p_brand_id, 'INV');
  v_invoice_id := gen_random_uuid();

  insert into app.invoices (
    id,
    organization_id,
    brand_id,
    order_id,
    customer_account_id,
    invoice_number,
    invoice_type,
    status,
    currency,
    amount_subtotal,
    amount_tax,
    amount_shipping,
    amount_total,
    amount_paid,
    balance_due,
    due_date,
    issued_at,
    bank_account_snapshot,
    customer_snapshot,
    payment_instructions,
    notes,
    created_by_user_id
  ) values (
    v_invoice_id,
    p_organization_id,
    p_brand_id,
    v_order_id,
    p_customer_account_id,
    v_invoice_number,
    'FULL_PAYMENT',
    'ISSUED',
    'IDR',
    (v_subtotal - v_discount_total),
    0,
    coalesce(p_shipping_cost, 0),
    v_grand_total,
    0,
    v_grand_total,
    (now() at time zone 'Asia/Jakarta')::date,
    now(),
    coalesce(v_org.billing_settings, '{}'::jsonb),
    v_customer_snapshot,
    'Pembayaran ritel kasir / POS langsung',
    coalesce(p_notes, 'Faktur resmi penjualan ritel langsung'),
    p_actor_id
  );

  -- Insert invoice items
  insert into app.invoice_items (
    invoice_id,
    order_item_id,
    description,
    quantity,
    unit_price,
    subtotal,
    notes
  )
  select
    v_invoice_id,
    oi.id,
    oi.description,
    oi.quantity,
    oi.unit_price,
    (oi.quantity * oi.unit_price),
    case when oi.discount_total > 0 then 'Diskon item: Rp ' || oi.discount_total::text else 'Barang ritel' end
  from app.order_items oi
  where oi.order_id = v_order_id;

  if coalesce(p_shipping_cost, 0) > 0 then
    insert into app.invoice_items (
      invoice_id,
      description,
      quantity,
      unit_price,
      subtotal,
      notes
    ) values (
      v_invoice_id,
      'Biaya Pengiriman Ekspedisi (Pass-Through)',
      1,
      p_shipping_cost,
      p_shipping_cost,
      'Ongkir kurir'
    );
  end if;

  insert into app.invoice_audit (
    organization_id,
    invoice_id,
    actor_id,
    action,
    details
  ) values (
    p_organization_id,
    v_invoice_id,
    p_actor_id,
    'invoice.issued',
    jsonb_build_object('order_number', v_order_number, 'amount_total', v_grand_total)
  );

  -- 14. POS Immediate Payment Settlement (if auto_pay is requested)
  if p_auto_pay then
    v_payment_result := app.record_payment_and_allocate(
      p_organization_id => p_organization_id,
      p_actor_id => p_actor_id,
      p_brand_id => p_brand_id,
      p_payment_method => p_payment_method,
      p_amount => v_grand_total,
      p_allocations => jsonb_build_array(
        jsonb_build_object(
          'invoice_id', v_invoice_id,
          'amount', v_grand_total
        )
      ),
      p_payment_date => (now() at time zone 'Asia/Jakarta')::date,
      p_reference_number => coalesce(p_payment_reference, 'POS-CASHIER-' || to_char(now(), 'HH24MISS')),
      p_destination_bank => p_payment_bank,
      p_notes => 'Pelunasan kasir langsung pesanan ' || v_order_number
    );

    v_payment_id := (v_payment_result->>'payment_id')::uuid;
    v_payment_number := (v_payment_result->>'payment_number');
  end if;

  -- 15. Return complete result
  return jsonb_build_object(
    'order_id', v_order_id,
    'order_number', v_order_number,
    'invoice_id', v_invoice_id,
    'invoice_number', v_invoice_number,
    'payment_id', v_payment_id,
    'payment_number', v_payment_number,
    'grand_total', v_grand_total,
    'status', 'CONFIRMED',
    'is_paid', p_auto_pay
  );
end;
$$;

commit;
