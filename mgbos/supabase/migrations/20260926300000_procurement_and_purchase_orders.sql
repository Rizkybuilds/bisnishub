-- Migration: 20260926300000_procurement_and_purchase_orders.sql
-- Description: MGBOS-019 Procurement, Purchase Orders, Goods Receipt & Outbound Cash (TS-PLAN-08)
-- Specification: MultiGraph Business OS — Sprint 8 (Vendor Purchase Orders, Auto-Inbound Restock & Financial Ledger Outbound Cash)

begin;

-- ============================================================================
-- 1. Helper function: procurement actor role & ledger constraint update
-- ============================================================================
alter table app.financial_ledger_entries
  drop constraint if exists financial_ledger_entries_entry_type_check;

alter table app.financial_ledger_entries
  add constraint financial_ledger_entries_entry_type_check
  check(entry_type in (
    'ORDER_COMMITTED',
    'INVOICE_ISSUED',
    'PAYMENT_RECEIVED',
    'PAYMENT_REVERSED',
    'PRODUCTION_COMMITTED',
    'PRODUCTION_ACTUAL_SETTLED',
    'SHIPPING_ESCROW_RECORDED',
    'COURIER_EXPENSE_DISBURSED',
    'MARGIN_REALIZATION_SNAPSHOT',
    'VENDOR_MATERIAL_PAYMENT'
  ));

create or replace function app.procurement_actor_role(
  p_organization_id uuid,
  p_actor_id uuid
) returns text language sql stable security definer set search_path=app,pg_temp as $$
  select r.code
  from app.organization_members om
  join app.roles r on r.id = om.role_id
  join app.users u on u.id = om.user_id
  join app.organizations o on o.id = om.organization_id
  where om.organization_id = p_organization_id
    and om.user_id = p_actor_id
    and om.status = 'ACTIVE'
    and u.status = 'ACTIVE'
    and o.status = 'ACTIVE'
  limit 1;
$$;

-- ============================================================================
-- 2. Purchase Orders (app.purchase_orders)
-- ============================================================================
create table if not exists app.purchase_orders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references app.organizations(id) on delete restrict,
  brand_id uuid references app.brands(id) on delete restrict,
  vendor_id uuid not null references app.vendors(id) on delete restrict,
  po_number text not null unique,
  status text not null default 'ORDERED' check(status in (
    'DRAFT',
    'ORDERED',
    'PARTIALLY_RECEIVED',
    'RECEIVED',
    'CANCELLED'
  )),
  order_date date not null default current_date,
  expected_delivery_date date,
  subtotal bigint not null default 0 check(subtotal >= 0),
  tax_amount bigint not null default 0 check(tax_amount >= 0),
  shipping_cost bigint not null default 0 check(shipping_cost >= 0),
  total_amount bigint not null default 0 check(total_amount >= 0),
  payment_terms text not null default 'COD',
  notes text,
  created_by_user_id uuid not null references app.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_purchase_orders_org_vendor on app.purchase_orders(organization_id, vendor_id);
create index if not exists idx_purchase_orders_status on app.purchase_orders(organization_id, status);
create index if not exists idx_purchase_orders_po_number on app.purchase_orders(po_number);

-- ============================================================================
-- 3. Purchase Order Items (app.purchase_order_items)
-- ============================================================================
create table if not exists app.purchase_order_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references app.organizations(id) on delete restrict,
  purchase_order_id uuid not null references app.purchase_orders(id) on delete cascade,
  inventory_item_id uuid not null references app.inventory_items(id) on delete restrict,
  quantity_ordered integer not null check(quantity_ordered > 0),
  quantity_received integer not null default 0 check(quantity_received >= 0),
  unit_cost bigint not null default 0 check(unit_cost >= 0),
  subtotal bigint not null default 0 check(subtotal >= 0),
  notes text,
  created_at timestamptz not null default now(),
  check (quantity_received <= quantity_ordered)
);

create index if not exists idx_po_items_po on app.purchase_order_items(purchase_order_id);
create index if not exists idx_po_items_item on app.purchase_order_items(inventory_item_id);

-- ============================================================================
-- 4. Goods Receipts / Bukti Penerimaan Barang (app.goods_receipts)
-- ============================================================================
create table if not exists app.goods_receipts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references app.organizations(id) on delete restrict,
  brand_id uuid references app.brands(id) on delete restrict,
  purchase_order_id uuid not null references app.purchase_orders(id) on delete restrict,
  receipt_number text not null unique,
  received_date timestamptz not null default now(),
  vendor_delivery_note_number text,
  location_code text not null default 'MAIN_WORKSHOP',
  received_by_user_id uuid not null references app.users(id) on delete restrict,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_goods_receipts_po on app.goods_receipts(purchase_order_id);
create index if not exists idx_goods_receipts_org on app.goods_receipts(organization_id);

-- ============================================================================
-- 5. Goods Receipt Items (app.goods_receipt_items)
-- ============================================================================
create table if not exists app.goods_receipt_items (
  id uuid primary key default gen_random_uuid(),
  goods_receipt_id uuid not null references app.goods_receipts(id) on delete cascade,
  purchase_order_item_id uuid not null references app.purchase_order_items(id) on delete restrict,
  inventory_item_id uuid not null references app.inventory_items(id) on delete restrict,
  quantity_accepted integer not null check(quantity_accepted > 0),
  quantity_rejected integer not null default 0 check(quantity_rejected >= 0),
  rejection_reason text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_gr_items_gr on app.goods_receipt_items(goods_receipt_id);
create index if not exists idx_gr_items_po_item on app.goods_receipt_items(purchase_order_item_id);

-- ============================================================================
-- 6. Vendor Bills / Tagihan Pembelian (app.vendor_bills)
-- ============================================================================
create table if not exists app.vendor_bills (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references app.organizations(id) on delete restrict,
  brand_id uuid references app.brands(id) on delete restrict,
  purchase_order_id uuid not null references app.purchase_orders(id) on delete restrict,
  vendor_id uuid not null references app.vendors(id) on delete restrict,
  bill_number text not null unique,
  vendor_invoice_number text,
  bill_date date not null default current_date,
  due_date date,
  total_amount bigint not null check(total_amount >= 0),
  amount_paid bigint not null default 0 check(amount_paid >= 0),
  balance_due bigint not null check(balance_due >= 0),
  status text not null default 'OPEN' check(status in ('OPEN', 'PARTIALLY_PAID', 'PAID', 'VOID')),
  paid_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (amount_paid + balance_due = total_amount)
);

create index if not exists idx_vendor_bills_org_vendor on app.vendor_bills(organization_id, vendor_id);
create index if not exists idx_vendor_bills_po on app.vendor_bills(purchase_order_id);
create index if not exists idx_vendor_bills_status on app.vendor_bills(organization_id, status);

-- ============================================================================
-- 7. Vendor Bill Payments (app.vendor_bill_payments)
-- ============================================================================
create table if not exists app.vendor_bill_payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references app.organizations(id) on delete restrict,
  vendor_bill_id uuid not null references app.vendor_bills(id) on delete restrict,
  payment_number text not null unique,
  amount bigint not null check(amount > 0),
  payment_method text not null,
  source_bank text,
  source_account_number text,
  reference_number text,
  paid_at timestamptz not null default now(),
  notes text,
  created_by_user_id uuid not null references app.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create index if not exists idx_bill_payments_bill on app.vendor_bill_payments(vendor_bill_id);
create index if not exists idx_bill_payments_org on app.vendor_bill_payments(organization_id);

-- ============================================================================
-- 8. Row-Level Security (RLS)
-- ============================================================================
alter table app.purchase_orders enable row level security;
alter table app.purchase_order_items enable row level security;
alter table app.goods_receipts enable row level security;
alter table app.goods_receipt_items enable row level security;
alter table app.vendor_bills enable row level security;
alter table app.vendor_bill_payments enable row level security;

create policy "Allow service_role full access to purchase_orders"
  on app.purchase_orders for all to service_role using (true) with check (true);

create policy "Allow org members to view purchase_orders"
  on app.purchase_orders for select to authenticated
  using (
    exists (
      select 1 from app.organization_members om
      join app.users u on u.id = om.user_id
      where om.organization_id = purchase_orders.organization_id
        and u.auth_user_id = auth.uid()
        and om.status = 'ACTIVE'
    )
  );

create policy "Allow service_role full access to purchase_order_items"
  on app.purchase_order_items for all to service_role using (true) with check (true);

create policy "Allow org members to view purchase_order_items"
  on app.purchase_order_items for select to authenticated
  using (
    exists (
      select 1 from app.organization_members om
      join app.users u on u.id = om.user_id
      where om.organization_id = purchase_order_items.organization_id
        and u.auth_user_id = auth.uid()
        and om.status = 'ACTIVE'
    )
  );

create policy "Allow service_role full access to goods_receipts"
  on app.goods_receipts for all to service_role using (true) with check (true);

create policy "Allow org members to view goods_receipts"
  on app.goods_receipts for select to authenticated
  using (
    exists (
      select 1 from app.organization_members om
      join app.users u on u.id = om.user_id
      where om.organization_id = goods_receipts.organization_id
        and u.auth_user_id = auth.uid()
        and om.status = 'ACTIVE'
    )
  );

create policy "Allow service_role full access to goods_receipt_items"
  on app.goods_receipt_items for all to service_role using (true) with check (true);

create policy "Allow org members to view goods_receipt_items"
  on app.goods_receipt_items for select to authenticated
  using (
    exists (
      select 1 from app.goods_receipts gr
      join app.organization_members om on om.organization_id = gr.organization_id
      join app.users u on u.id = om.user_id
      where gr.id = goods_receipt_items.goods_receipt_id
        and u.auth_user_id = auth.uid()
        and om.status = 'ACTIVE'
    )
  );

create policy "Allow service_role full access to vendor_bills"
  on app.vendor_bills for all to service_role using (true) with check (true);

create policy "Allow org members to view vendor_bills"
  on app.vendor_bills for select to authenticated
  using (
    exists (
      select 1 from app.organization_members om
      join app.users u on u.id = om.user_id
      where om.organization_id = vendor_bills.organization_id
        and u.auth_user_id = auth.uid()
        and om.status = 'ACTIVE'
    )
  );

create policy "Allow service_role full access to vendor_bill_payments"
  on app.vendor_bill_payments for all to service_role using (true) with check (true);

create policy "Allow org members to view vendor_bill_payments"
  on app.vendor_bill_payments for select to authenticated
  using (
    exists (
      select 1 from app.organization_members om
      join app.users u on u.id = om.user_id
      where om.organization_id = vendor_bill_payments.organization_id
        and u.auth_user_id = auth.uid()
        and om.status = 'ACTIVE'
    )
  );

-- ============================================================================
-- 9. Stored Procedure: create_purchase_order
-- ============================================================================
create or replace function app.create_purchase_order(
  p_organization_id uuid,
  p_actor_id uuid,
  p_brand_id uuid,
  p_vendor_id uuid,
  p_items jsonb, -- array of { inventory_item_id, quantity, unit_cost, notes }
  p_expected_delivery_date date default null,
  p_shipping_cost bigint default 0,
  p_payment_terms text default 'COD',
  p_notes text default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_role text;
  v_vendor app.vendors%rowtype;
  v_po_id uuid;
  v_po_number text;
  v_item jsonb;
  v_item_id uuid;
  v_qty integer;
  v_cost bigint;
  v_subtotal bigint := 0;
  v_total bigint := 0;
  v_line_subtotal bigint;
begin
  -- 1. Authorization check
  v_role := app.procurement_actor_role(p_organization_id, p_actor_id);
  if v_role not in ('OWNER', 'ADMIN', 'OPERATIONS', 'FINANCE') then
    raise exception 'Unauthorized to create purchase orders';
  end if;

  -- 2. Verify vendor
  select * into v_vendor
  from app.vendors
  where id = p_vendor_id and organization_id = p_organization_id and status = 'ACTIVE';

  if not found then
    raise exception 'Vendor not found or inactive';
  end if;

  if jsonb_array_length(p_items) = 0 then
    raise exception 'Purchase order must have at least one line item';
  end if;

  -- 3. Calculate subtotal
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := (v_item->>'quantity')::integer;
    v_cost := (v_item->>'unit_cost')::bigint;
    if v_qty <= 0 then raise exception 'Quantity must be positive'; end if;
    if v_cost < 0 then raise exception 'Unit cost cannot be negative'; end if;
    v_subtotal := v_subtotal + (v_qty * v_cost);
  end loop;

  v_total := v_subtotal + coalesce(p_shipping_cost, 0);

  -- 4. Generate PO canonical document number
  v_po_number := app.generate_document_number(p_organization_id, p_brand_id, 'PO');

  -- 5. Insert PO header
  insert into app.purchase_orders (
    organization_id,
    brand_id,
    vendor_id,
    po_number,
    status,
    order_date,
    expected_delivery_date,
    subtotal,
    shipping_cost,
    total_amount,
    payment_terms,
    notes,
    created_by_user_id
  ) values (
    p_organization_id,
    p_brand_id,
    p_vendor_id,
    v_po_number,
    'ORDERED',
    current_date,
    p_expected_delivery_date,
    v_subtotal,
    coalesce(p_shipping_cost, 0),
    v_total,
    coalesce(nullif(trim(p_payment_terms), ''), v_vendor.payment_terms),
    trim(p_notes),
    p_actor_id
  ) returning id into v_po_id;

  -- 6. Insert PO items
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_item_id := (v_item->>'inventory_item_id')::uuid;
    v_qty := (v_item->>'quantity')::integer;
    v_cost := (v_item->>'unit_cost')::bigint;
    v_line_subtotal := v_qty * v_cost;

    insert into app.purchase_order_items (
      organization_id,
      purchase_order_id,
      inventory_item_id,
      quantity_ordered,
      quantity_received,
      unit_cost,
      subtotal,
      notes
    ) values (
      p_organization_id,
      v_po_id,
      v_item_id,
      v_qty,
      0,
      v_cost,
      v_line_subtotal,
      nullif(trim(v_item->>'notes'), '')
    );
  end loop;

  return jsonb_build_object(
    'purchase_order_id', v_po_id,
    'po_number', v_po_number,
    'subtotal', v_subtotal,
    'total_amount', v_total,
    'status', 'ORDERED'
  );
end;
$$;

-- ============================================================================
-- 10. Stored Procedure: receive_purchase_order_items
-- ============================================================================
create or replace function app.receive_purchase_order_items(
  p_organization_id uuid,
  p_actor_id uuid,
  p_purchase_order_id uuid,
  p_items jsonb, -- array of { purchase_order_item_id, quantity_accepted, quantity_rejected, rejection_reason, notes }
  p_vendor_delivery_note text default null,
  p_location_code text default 'MAIN_WORKSHOP',
  p_notes text default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_role text;
  v_po app.purchase_orders%rowtype;
  v_po_item app.purchase_order_items%rowtype;
  v_gr_id uuid;
  v_gr_number text;
  v_item jsonb;
  v_po_item_id uuid;
  v_qty_accepted integer;
  v_qty_rejected integer;
  v_inv_level app.inventory_levels%rowtype;
  v_all_received boolean := true;
  v_loc text;
  v_bill_id uuid;
  v_bill_number text;
  v_received_count integer := 0;
begin
  -- 1. Authorization check
  v_role := app.procurement_actor_role(p_organization_id, p_actor_id);
  if v_role not in ('OWNER', 'ADMIN', 'OPERATIONS') then
    raise exception 'Unauthorized to receive goods';
  end if;

  -- 2. Lock PO
  select * into v_po
  from app.purchase_orders
  where id = p_purchase_order_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Purchase order % not found', p_purchase_order_id;
  end if;

  if v_po.status in ('RECEIVED', 'CANCELLED') then
    raise exception 'Cannot receive items for PO in status %', v_po.status;
  end if;

  if jsonb_array_length(p_items) = 0 then
    raise exception 'Must specify at least one receipt item';
  end if;

  v_loc := coalesce(nullif(trim(p_location_code), ''), 'MAIN_WORKSHOP');

  -- 3. Generate Goods Receipt number
  v_gr_number := app.generate_document_number(p_organization_id, v_po.brand_id, 'GR');

  insert into app.goods_receipts (
    organization_id,
    brand_id,
    purchase_order_id,
    receipt_number,
    vendor_delivery_note_number,
    location_code,
    received_by_user_id,
    notes
  ) values (
    p_organization_id,
    v_po.brand_id,
    v_po.id,
    v_gr_number,
    nullif(trim(p_vendor_delivery_note), ''),
    v_loc,
    p_actor_id,
    nullif(trim(p_notes), '')
  ) returning id into v_gr_id;

  -- 4. Process each receipt line item
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_po_item_id := (v_item->>'purchase_order_item_id')::uuid;
    v_qty_accepted := coalesce((v_item->>'quantity_accepted')::integer, 0);
    v_qty_rejected := coalesce((v_item->>'quantity_rejected')::integer, 0);

    if v_qty_accepted <= 0 and v_qty_rejected <= 0 then
      raise exception 'Receipt item must have positive accepted or rejected quantity';
    end if;

    -- Lock PO item
    select * into v_po_item
    from app.purchase_order_items
    where id = v_po_item_id and purchase_order_id = v_po.id
    for update;

    if not found then
      raise exception 'PO Item % not found in PO %', v_po_item_id, v_po.po_number;
    end if;

    -- Ceiling Guard: cannot receive more than ordered
    if (v_po_item.quantity_received + v_qty_accepted) > v_po_item.quantity_ordered then
      raise exception 'Jumlah penerimaan (%) melebihi sisa pesanan PO (%) untuk item %',
        v_qty_accepted, (v_po_item.quantity_ordered - v_po_item.quantity_received), v_po_item.id;
    end if;

    -- Update PO item received quantity
    update app.purchase_order_items
    set quantity_received = quantity_received + v_qty_accepted
    where id = v_po_item.id;

    -- Insert Goods Receipt Item
    insert into app.goods_receipt_items (
      goods_receipt_id,
      purchase_order_item_id,
      inventory_item_id,
      quantity_accepted,
      quantity_rejected,
      rejection_reason,
      notes
    ) values (
      v_gr_id,
      v_po_item.id,
      v_po_item.inventory_item_id,
      v_qty_accepted,
      v_qty_rejected,
      nullif(trim(v_item->>'rejection_reason'), ''),
      nullif(trim(v_item->>'notes'), '')
    );

    -- 5. Automated Inbound Stock Increment & Append Mutation Log
    if v_qty_accepted > 0 then
      -- Lock or insert inventory level
      select * into v_inv_level
      from app.inventory_levels
      where organization_id = p_organization_id
        and inventory_item_id = v_po_item.inventory_item_id
        and location_code = v_loc
      for update;

      if not found then
        insert into app.inventory_levels (
          organization_id,
          inventory_item_id,
          location_code,
          quantity_on_hand,
          quantity_reserved
        ) values (
          p_organization_id,
          v_po_item.inventory_item_id,
          v_loc,
          v_qty_accepted,
          0
        ) returning * into v_inv_level;
      else
        update app.inventory_levels
        set quantity_on_hand = quantity_on_hand + v_qty_accepted,
            updated_at = now()
        where id = v_inv_level.id;
      end if;

      -- Append to inventory mutations ledger
      insert into app.inventory_mutations (
        organization_id,
        inventory_item_id,
        location_code,
        mutation_type,
        quantity_change,
        quantity_on_hand_after,
        quantity_reserved_after,
        reference_type,
        reference_id,
        notes,
        actor_id
      ) values (
        p_organization_id,
        v_po_item.inventory_item_id,
        v_loc,
        'INBOUND_PURCHASE',
        v_qty_accepted,
        v_inv_level.quantity_on_hand + v_qty_accepted,
        v_inv_level.quantity_reserved,
        'PO_RECEIPT',
        v_gr_id,
        format('Penerimaan PO %s (GR: %s)', v_po.po_number, v_gr_number),
        p_actor_id
      );
    end if;

    v_received_count := v_received_count + 1;
  end loop;

  -- 6. Check if entire PO is fully received
  select coalesce(bool_and(quantity_received >= quantity_ordered), false) into v_all_received
  from app.purchase_order_items
  where purchase_order_id = v_po.id;

  update app.purchase_orders
  set status = case when v_all_received then 'RECEIVED' else 'PARTIALLY_RECEIVED' end,
      updated_at = now()
  where id = v_po.id;

  -- 7. Ensure Vendor Bill exists for this PO
  select id into v_bill_id
  from app.vendor_bills
  where purchase_order_id = v_po.id;

  if not found then
    v_bill_number := app.generate_document_number(p_organization_id, v_po.brand_id, 'VB');
    insert into app.vendor_bills (
      organization_id,
      brand_id,
      purchase_order_id,
      vendor_id,
      bill_number,
      vendor_invoice_number,
      bill_date,
      due_date,
      total_amount,
      amount_paid,
      balance_due,
      status,
      notes
    ) values (
      p_organization_id,
      v_po.brand_id,
      v_po.id,
      v_po.vendor_id,
      v_bill_number,
      nullif(trim(p_vendor_delivery_note), ''),
      current_date,
      (current_date + 14)::date,
      v_po.total_amount,
      0,
      v_po.total_amount,
      'OPEN',
      format('Tagihan otomatis atas PO %s', v_po.po_number)
    ) returning id into v_bill_id;
  end if;

  return jsonb_build_object(
    'goods_receipt_id', v_gr_id,
    'receipt_number', v_gr_number,
    'purchase_order_id', v_po.id,
    'po_status', case when v_all_received then 'RECEIVED' else 'PARTIALLY_RECEIVED' end,
    'vendor_bill_id', v_bill_id,
    'received_lines_count', v_received_count
  );
end;
$$;

-- ============================================================================
-- 11. Stored Procedure: pay_vendor_bill
-- ============================================================================
create or replace function app.pay_vendor_bill(
  p_organization_id uuid,
  p_actor_id uuid,
  p_vendor_bill_id uuid,
  p_amount bigint,
  p_payment_method text default 'BANK_TRANSFER',
  p_source_bank text default null,
  p_source_account_number text default null,
  p_reference_number text default null,
  p_notes text default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_role text;
  v_bill app.vendor_bills%rowtype;
  v_po app.purchase_orders%rowtype;
  v_vendor app.vendors%rowtype;
  v_pay_id uuid;
  v_pay_number text;
  v_led_number text;
  v_new_paid bigint;
  v_new_balance bigint;
  v_new_status text;
begin
  -- 1. Authorization check
  v_role := app.procurement_actor_role(p_organization_id, p_actor_id);
  if v_role not in ('OWNER', 'ADMIN', 'FINANCE') then
    raise exception 'Unauthorized to pay vendor bills';
  end if;

  if p_amount <= 0 then
    raise exception 'Payment amount must be greater than zero';
  end if;

  -- 2. Lock vendor bill
  select * into v_bill
  from app.vendor_bills
  where id = p_vendor_bill_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Vendor bill % not found', p_vendor_bill_id;
  end if;

  if v_bill.status in ('PAID', 'VOID') then
    raise exception 'Cannot pay vendor bill in status %', v_bill.status;
  end if;

  if p_amount > v_bill.balance_due then
    raise exception 'Payment amount (Rp %) exceeds balance due (Rp %)',
      p_amount, v_bill.balance_due;
  end if;

  select * into v_po from app.purchase_orders where id = v_bill.purchase_order_id;
  select * into v_vendor from app.vendors where id = v_bill.vendor_id;

  v_new_paid := v_bill.amount_paid + p_amount;
  v_new_balance := v_bill.balance_due - p_amount;
  v_new_status := case when v_new_balance = 0 then 'PAID' else 'PARTIALLY_PAID' end;

  -- 3. Generate canonical payment number
  v_pay_number := app.generate_document_number(p_organization_id, v_bill.brand_id, 'PAY');

  -- 4. Record vendor bill payment
  insert into app.vendor_bill_payments (
    organization_id,
    vendor_bill_id,
    payment_number,
    amount,
    payment_method,
    source_bank,
    source_account_number,
    reference_number,
    paid_at,
    notes,
    created_by_user_id
  ) values (
    p_organization_id,
    v_bill.id,
    v_pay_number,
    p_amount,
    p_payment_method,
    p_source_bank,
    p_source_account_number,
    p_reference_number,
    now(),
    p_notes,
    p_actor_id
  ) returning id into v_pay_id;

  -- 5. Update vendor bill
  update app.vendor_bills
  set amount_paid = v_new_paid,
      balance_due = v_new_balance,
      status = v_new_status,
      paid_at = case when v_new_balance = 0 then now() else paid_at end,
      updated_at = now()
  where id = v_bill.id;

  -- 6. Emit Outbound Cash in Financial Ledger
  v_led_number := app.generate_document_number(p_organization_id, v_bill.brand_id, 'LED');

  insert into app.financial_ledger_entries (
    organization_id,
    brand_id,
    entry_number,
    entry_type,
    direction,
    category,
    amount,
    reference_id,
    reference_document,
    notes,
    created_by_user_id
  ) values (
    p_organization_id,
    v_bill.brand_id,
    v_led_number,
    'VENDOR_MATERIAL_PAYMENT',
    'CREDIT',
    'CASH_MOVEMENT',
    p_amount,
    v_bill.id,
    'VENDOR_BILL',
    format('Kas keluar pembayaran bahan baku: %s (%s) via %s', v_bill.bill_number, v_vendor.name, p_payment_method),
    p_actor_id
  );

  return jsonb_build_object(
    'vendor_bill_id', v_bill.id,
    'payment_id', v_pay_id,
    'payment_number', v_pay_number,
    'amount_paid', p_amount,
    'balance_due', v_new_balance,
    'status', v_new_status,
    'ledger_entry_number', v_led_number
  );
end;
$$;

commit;
