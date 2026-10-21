-- Migration: 20261015150000_sec02_order_replay_isolation.sql
-- Description: C-SEC-02 (R4) B2B and Retail Order Replay Organization Isolation
-- Context: Enforce organization ownership check on order replay lookups prior to returning
--          any order ID, number, invoice, or metadata.
--          Fail closed with non-disclosing error on cross-org replay or unique collision.
--          Preserve same-organization replay idempotency and service_role execute privilege.

begin;

-- ============================================================================
-- 1. Hardened B2B Order Creation Stored Procedure: create_order_from_quote
-- ============================================================================

create or replace function app.create_order_from_quote(
  p_organization_id uuid,
  p_actor_id uuid,
  p_request_id uuid,
  p_quote_version_id uuid,
  p_shipping_address jsonb,
  p_billing_address jsonb default null,
  p_payment_terms_override jsonb default null,
  p_notes text default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  role_code text;
  q app.quotes%rowtype;
  v app.quote_versions%rowtype;
  req app.requirements%rowtype;
  customer app.customer_accounts%rowtype;
  existing app.orders%rowtype;
  order_id uuid := gen_random_uuid();
  order_num text;
  terms_final jsonb;
  qi record;
begin
  -- 1. Authorization check
  role_code := app.quote_actor_role(p_organization_id, p_actor_id);
  if role_code not in ('OWNER','ADMIN','SALES') then
    raise exception 'Not authorized to create orders';
  end if;

  if p_request_id is null then
    raise exception 'Request ID required';
  end if;

  -- Lock transaction for idempotency
  perform pg_advisory_xact_lock(hashtextextended(p_actor_id::text || p_request_id::text, 0));

  -- 2. Check idempotent retry by request_id (fail closed if stored order belongs to foreign org)
  select * into existing from app.orders
  where created_by_user_id = p_actor_id and request_id = p_request_id;
  if found then
    if existing.organization_id <> p_organization_id then
      raise exception 'Unauthorized or request invalid';
    end if;
    return jsonb_build_object('order_id', existing.id, 'order_number', existing.order_number, 'is_retry', true);
  end if;

  -- 3. Check if order already exists for this quote version (fail closed if stored order belongs to foreign org)
  select * into existing from app.orders where source_quote_version_id = p_quote_version_id;
  if found then
    if existing.organization_id <> p_organization_id then
      raise exception 'Unauthorized or request invalid';
    end if;
    return jsonb_build_object('order_id', existing.id, 'order_number', existing.order_number, 'is_retry', true);
  end if;

  -- 4. Lock quote and version
  select quotes.* into q
  from app.quotes quotes
  join app.quote_versions ver on ver.quote_id = quotes.id
  where ver.id = p_quote_version_id and quotes.organization_id = p_organization_id
  for update of quotes;

  if not found then
    raise exception 'Quote not found in this organization';
  end if;

  select * into v from app.quote_versions where id = p_quote_version_id;

  if v.status <> 'ACCEPTED' then
    raise exception 'Only ACCEPTED quote versions may be converted to an order';
  end if;

  select * into customer from app.customer_accounts
  where id = q.customer_account_id and organization_id = p_organization_id and status = 'ACTIVE';
  if not found then
    raise exception 'Active customer account required';
  end if;

  -- Validate shipping address
  if p_shipping_address is null or jsonb_typeof(p_shipping_address) <> 'object' then
    raise exception 'Valid shipping address required';
  end if;
  if coalesce(length(trim(p_shipping_address->>'recipient_name')), 0) < 2
     or coalesce(length(trim(p_shipping_address->>'phone')), 0) < 5
     or coalesce(length(trim(p_shipping_address->>'street')), 0) < 5
     or coalesce(length(trim(p_shipping_address->>'city')), 0) < 2 then
    raise exception 'Shipping address must include recipient_name, phone, street, and city';
  end if;

  -- Compute terms snapshot
  terms_final := coalesce(p_payment_terms_override, v.terms_snapshot);
  if p_notes is not null then
    terms_final := terms_final || jsonb_build_object('order_notes', p_notes);
  end if;

  -- Generate canonical document number (e.g. TS-O-2026-000001)
  order_num := app.generate_document_number(p_organization_id, q.brand_id, 'O', extract(year from now())::integer, 6);

  -- Insert order (handle unique collision fail-closed without disclosing metadata)
  begin
    insert into app.orders (
      id, organization_id, brand_id, customer_account_id,
      source_quote_id, source_quote_version_id,
      source_requirement_id, source_requirement_version_id,
      order_number, status, currency,
      subtotal, discount_total, shipping_total, grand_total,
      estimated_cost_total, estimated_gross_profit,
      customer_snapshot, shipping_address_snapshot, billing_address_snapshot,
      payment_terms_snapshot, created_by_user_id, confirmed_at,
      request_id, request_payload
    ) values (
      order_id, p_organization_id, q.brand_id, q.customer_account_id,
      q.id, v.id,
      q.requirement_id, v.requirement_version_id,
      order_num, 'CONFIRMED', v.currency,
      v.subtotal, v.discount_total, v.shipping_total, v.grand_total,
      v.estimated_cost_total, v.estimated_gross_profit,
      v.customer_snapshot, p_shipping_address, p_billing_address,
      terms_final, p_actor_id, now(),
      p_request_id,
      jsonb_build_object('quote_version_id', p_quote_version_id, 'shipping_address', p_shipping_address)
    );
  exception when unique_violation then
    raise exception 'Unauthorized or request invalid';
  end;

  -- Copy quote items into order items snapshot
  for qi in select * from app.quote_items where quote_version_id = v.id order by position loop
    insert into app.order_items (
      order_id, position, description, quantity, unit,
      unit_price, discount_total, subtotal, specification_snapshot
    ) values (
      order_id, qi.position, qi.description, qi.quantity, qi.unit,
      qi.unit_price, qi.discount_total, qi.subtotal, qi.specification
    );
  end loop;

  -- Record audit
  insert into app.order_audit (organization_id, order_id, actor_id, action, details)
  values (
    p_organization_id, order_id, p_actor_id, 'order.created_from_quote',
    jsonb_build_object('quote_number', q.quote_number, 'quote_version_id', v.id)
  );

  return jsonb_build_object('order_id', order_id, 'order_number', order_num, 'is_retry', false);
end; $$;


-- ============================================================================
-- 2. Hardened Retail Order Creation Stored Procedure: create_retail_order
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

  -- Advisory lock if request_id provided
  if p_request_id is not null then
    perform pg_advisory_xact_lock(hashtextextended(p_actor_id::text || p_request_id::text, 0));
  end if;

  -- 2. Idempotency check via request_id (fail closed if stored order belongs to foreign org)
  select * into v_existing
  from app.orders
  where created_by_user_id = p_actor_id and request_id = v_request_id;

  if found then
    if v_existing.organization_id <> p_organization_id then
      raise exception 'Unauthorized or request invalid';
    end if;

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

  -- 9. Insert Order Record (handle unique collision fail-closed without disclosing metadata)
  begin
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
  exception when unique_violation then
    raise exception 'Unauthorized or request invalid';
  end;

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


-- ============================================================================
-- 3. Boundary Privilege Enforcement (SEC-01 / SEC-02 Invariant Preservation)
-- ============================================================================

-- B2B create_order_from_quote: service_role execute only
revoke all on function app.create_order_from_quote(
  uuid, uuid, uuid, uuid, jsonb, jsonb, jsonb, text
) from public, anon, authenticated, service_role;

grant execute on function app.create_order_from_quote(
  uuid, uuid, uuid, uuid, jsonb, jsonb, jsonb, text
) to service_role;

-- Retail create_retail_order: service_role execute only
revoke all on function app.create_retail_order(
  uuid, uuid, uuid, uuid, jsonb, uuid, jsonb, bigint, text, boolean, text, text, text
) from public, anon, authenticated, service_role;

grant execute on function app.create_retail_order(
  uuid, uuid, uuid, uuid, jsonb, uuid, jsonb, bigint, text, boolean, text, text, text
) to service_role;

commit;
