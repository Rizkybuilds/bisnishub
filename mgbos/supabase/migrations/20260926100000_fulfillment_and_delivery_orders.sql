-- Migration: 20260926100000_fulfillment_and_delivery_orders.sql
-- Description: MGBOS-017 Fulfillment, Delivery Orders (Surat Jalan), Courier Tracking & Thermal Label A6 (TS-PLAN-06)
-- Specification: MultiGraph Business OS — Sprint 6 (Fulfillment, Logistics & Order Completion)

begin;

-- ============================================================================
-- 1. Helper function: shipment actor role
-- ============================================================================
create or replace function app.shipment_actor_role(
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
-- 2. Shipments / Delivery Orders Table (app.shipments)
-- ============================================================================
create table if not exists app.shipments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references app.organizations(id) on delete restrict,
  brand_id uuid not null references app.brands(id) on delete restrict,
  order_id uuid not null references app.orders(id) on delete restrict,
  customer_account_id uuid not null references app.customer_accounts(id) on delete restrict,
  shipment_number text not null,
  status text not null default 'DRAFT' check(status in (
    'DRAFT',
    'READY_TO_DISPATCH',
    'DISPATCHED',
    'IN_TRANSIT',
    'DELIVERED',
    'FAILED',
    'RETURNED',
    'CANCELLED'
  )),
  courier_name text not null,
  courier_service text,
  tracking_number text,
  package_weight_grams integer check(package_weight_grams is null or package_weight_grams > 0),
  package_count integer not null default 1 check(package_count > 0),
  actual_shipping_cost bigint not null default 0 check(actual_shipping_cost >= 0),
  shipping_address_snapshot jsonb not null default '{}'::jsonb,
  dispatch_date timestamptz,
  delivered_date timestamptz,
  notes text,
  created_by_user_id uuid not null references app.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id, shipment_number)
);

create index if not exists idx_shipments_org_order on app.shipments(organization_id, order_id);
create index if not exists idx_shipments_customer on app.shipments(customer_account_id);
create index if not exists idx_shipments_status on app.shipments(organization_id, status);
create index if not exists idx_shipments_tracking on app.shipments(tracking_number);

-- ============================================================================
-- 3. Shipment Items Table (app.shipment_items)
-- ============================================================================
create table if not exists app.shipment_items (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid not null references app.shipments(id) on delete cascade,
  order_item_id uuid not null references app.order_items(id) on delete restrict,
  quantity integer not null check(quantity > 0),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_shipment_items_shipment on app.shipment_items(shipment_id);
create index if not exists idx_shipment_items_order_item on app.shipment_items(order_item_id);

-- ============================================================================
-- 4. Shipment Audit Log (app.shipment_audit)
-- ============================================================================
create table if not exists app.shipment_audit (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references app.organizations(id) on delete cascade,
  shipment_id uuid not null references app.shipments(id) on delete cascade,
  actor_id uuid not null references app.users(id) on delete restrict,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_shipment_audit_shipment on app.shipment_audit(shipment_id, created_at desc);

-- ============================================================================
-- 5. Row-Level Security (RLS)
-- ============================================================================
alter table app.shipments enable row level security;
alter table app.shipment_items enable row level security;
alter table app.shipment_audit enable row level security;

create policy "Allow service_role full access to shipments"
  on app.shipments for all to service_role using (true) with check (true);

create policy "Allow organization members to view shipments"
  on app.shipments for select to authenticated
  using (
    exists (
      select 1 from app.organization_members om
      join app.users u on u.id = om.user_id
      where om.organization_id = shipments.organization_id
        and u.auth_user_id = auth.uid()
        and om.status = 'ACTIVE'
    )
  );

create policy "Allow service_role full access to shipment_items"
  on app.shipment_items for all to service_role using (true) with check (true);

create policy "Allow organization members to view shipment_items"
  on app.shipment_items for select to authenticated
  using (
    exists (
      select 1 from app.shipments s
      join app.organization_members om on om.organization_id = s.organization_id
      join app.users u on u.id = om.user_id
      where s.id = shipment_items.shipment_id
        and u.auth_user_id = auth.uid()
        and om.status = 'ACTIVE'
    )
  );

create policy "Allow service_role full access to shipment_audit"
  on app.shipment_audit for all to service_role using (true) with check (true);

create policy "Allow organization members to view shipment_audit"
  on app.shipment_audit for select to authenticated
  using (
    exists (
      select 1 from app.organization_members om
      join app.users u on u.id = om.user_id
      where om.organization_id = shipment_audit.organization_id
        and u.auth_user_id = auth.uid()
        and om.status = 'ACTIVE'
    )
  );

-- ============================================================================
-- 6. Trigger: Immutability & Status Guard
-- ============================================================================
create or replace function app.trg_shipment_snapshot_guard()
returns trigger language plpgsql set search_path=app,pg_temp as $$
begin
  if TG_OP = 'UPDATE' then
    if OLD.status = 'DELIVERED' then
      if (to_jsonb(NEW) - array['updated_at', 'notes']) is distinct from (to_jsonb(OLD) - array['updated_at', 'notes']) then
        raise exception 'Delivered shipment is permanently immutable; cannot modify details';
      end if;
    end if;
    return NEW;
  elsif TG_OP = 'DELETE' then
    if OLD.status not in ('DRAFT', 'CANCELLED') then
      raise exception 'Cannot delete active or dispatched shipment %; cancel it instead', OLD.shipment_number;
    end if;
    return OLD;
  end if;
  return NEW;
end;
$$;

drop trigger if exists trg_shipment_snapshot_guard on app.shipments;
create trigger trg_shipment_snapshot_guard
  before update or delete on app.shipments
  for each row execute function app.trg_shipment_snapshot_guard();

-- ============================================================================
-- 7. Stored Procedure: create_delivery_order
-- ============================================================================
create or replace function app.create_delivery_order(
  p_organization_id uuid,
  p_actor_id uuid,
  p_order_id uuid,
  p_courier_name text,
  p_courier_service text default null,
  p_items jsonb default '[]'::jsonb,
  p_package_weight_grams integer default null,
  p_package_count integer default 1,
  p_notes text default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_role text;
  v_order app.orders%rowtype;
  v_do_num text;
  v_shipment_id uuid;
  v_item jsonb;
  v_order_item app.order_items%rowtype;
  v_shipped_so_far integer;
  v_requested_qty integer;
  v_item_count integer := 0;
begin
  -- 1. Actor authorization
  v_role := app.shipment_actor_role(p_organization_id, p_actor_id);
  if v_role not in ('OWNER', 'ADMIN', 'OPERATIONS', 'FINANCE') then
    raise exception 'Unauthorized to create delivery orders';
  end if;

  if p_courier_name is null or trim(p_courier_name) = '' then
    raise exception 'Courier name is required';
  end if;

  if jsonb_array_length(p_items) = 0 then
    raise exception 'Shipment must contain at least one order item';
  end if;

  -- 2. Lock Order
  select * into v_order
  from app.orders
  where id = p_order_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Order % not found in organization', p_order_id;
  end if;

  if v_order.status in ('DRAFT', 'CANCELLED') then
    raise exception 'Cannot create delivery order for order in % status', v_order.status;
  end if;

  -- 3. Generate canonical DO document number
  v_do_num := app.generate_document_number(p_organization_id, v_order.brand_id, 'DO');

  -- 4. Create Shipment Header in READY_TO_DISPATCH status
  insert into app.shipments (
    organization_id,
    brand_id,
    order_id,
    customer_account_id,
    shipment_number,
    status,
    courier_name,
    courier_service,
    package_weight_grams,
    package_count,
    shipping_address_snapshot,
    notes,
    created_by_user_id
  ) values (
    p_organization_id,
    v_order.brand_id,
    v_order.id,
    v_order.customer_account_id,
    v_do_num,
    'READY_TO_DISPATCH',
    upper(trim(p_courier_name)),
    nullif(trim(p_courier_service), ''),
    p_package_weight_grams,
    coalesce(p_package_count, 1),
    v_order.shipping_address_snapshot,
    p_notes,
    p_actor_id
  ) returning id into v_shipment_id;

  -- 5. Process each item & enforce ceiling guard
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_requested_qty := (v_item->>'quantity')::integer;
    if v_requested_qty <= 0 then
      raise exception 'Item quantity must be greater than zero';
    end if;

    select * into v_order_item
    from app.order_items
    where id = (v_item->>'order_item_id')::uuid and order_id = v_order.id;

    if not found then
      raise exception 'Order item % does not belong to order %', v_item->>'order_item_id', v_order.order_number;
    end if;

    -- Calculate total already scheduled/shipped across active shipments
    select coalesce(sum(si.quantity), 0) into v_shipped_so_far
    from app.shipment_items si
    join app.shipments s on s.id = si.shipment_id
    where si.order_item_id = v_order_item.id
      and s.status not in ('CANCELLED', 'RETURNED');

    if (v_shipped_so_far + v_requested_qty) > v_order_item.quantity then
      raise exception 'Requested quantity (%) exceeds remaining unshipped quota (%) for item %',
        v_requested_qty, (v_order_item.quantity - v_shipped_so_far), v_order_item.description;
    end if;

    insert into app.shipment_items (
      shipment_id,
      order_item_id,
      quantity,
      notes
    ) values (
      v_shipment_id,
      v_order_item.id,
      v_requested_qty,
      v_item->>'notes'
    );

    v_item_count := v_item_count + 1;
  end loop;

  -- 6. Audit trail
  insert into app.shipment_audit (
    organization_id,
    shipment_id,
    actor_id,
    action,
    metadata
  ) values (
    p_organization_id,
    v_shipment_id,
    p_actor_id,
    'shipment.created',
    jsonb_build_object(
      'shipment_number', v_do_num,
      'order_number', v_order.order_number,
      'courier_name', upper(trim(p_courier_name)),
      'item_count', v_item_count,
      'package_count', coalesce(p_package_count, 1)
    )
  );

  return jsonb_build_object(
    'shipment_id', v_shipment_id,
    'shipment_number', v_do_num,
    'order_id', v_order.id,
    'order_number', v_order.order_number,
    'status', 'READY_TO_DISPATCH',
    'item_count', v_item_count
  );
end;
$$;

-- ============================================================================
-- 8. Stored Procedure: dispatch_shipment
-- ============================================================================
create or replace function app.dispatch_shipment(
  p_organization_id uuid,
  p_actor_id uuid,
  p_shipment_id uuid,
  p_tracking_number text default null,
  p_actual_shipping_cost bigint default null,
  p_notes text default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_role text;
  v_shipment app.shipments%rowtype;
  v_clean_tracking text;
  v_led_num text;
begin
  -- 1. Authorization check
  v_role := app.shipment_actor_role(p_organization_id, p_actor_id);
  if v_role not in ('OWNER', 'ADMIN', 'OPERATIONS', 'FINANCE') then
    raise exception 'Unauthorized to dispatch shipments';
  end if;

  -- 2. Lock shipment
  select * into v_shipment
  from app.shipments
  where id = p_shipment_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Shipment not found in organization';
  end if;

  if v_shipment.status not in ('DRAFT', 'READY_TO_DISPATCH') then
    raise exception 'Cannot dispatch shipment currently in % status', v_shipment.status;
  end if;

  v_clean_tracking := nullif(trim(coalesce(p_tracking_number, v_shipment.tracking_number, '')), '');

  -- External couriers require tracking number
  if v_shipment.courier_name not in ('INTERNAL', 'INTERNAL_COURIER', 'PICKUP', 'CUSTOMER_PICKUP') then
    if v_clean_tracking is null then
      raise exception 'Tracking number is required for courier %', v_shipment.courier_name;
    end if;
  end if;

  -- 3. Update shipment
  update app.shipments
  set status = 'DISPATCHED',
      tracking_number = v_clean_tracking,
      actual_shipping_cost = coalesce(p_actual_shipping_cost, actual_shipping_cost),
      dispatch_date = now(),
      notes = coalesce(p_notes, notes),
      updated_at = now()
  where id = v_shipment.id;

  -- 4. Audit trail
  insert into app.shipment_audit (
    organization_id,
    shipment_id,
    actor_id,
    action,
    metadata
  ) values (
    p_organization_id,
    v_shipment.id,
    p_actor_id,
    'shipment.dispatched',
    jsonb_build_object(
      'tracking_number', v_clean_tracking,
      'actual_shipping_cost', coalesce(p_actual_shipping_cost, v_shipment.actual_shipping_cost),
      'dispatch_date', now()
    )
  );

  -- 5. If actual shipping cost disbursed, record into financial ledger
  if coalesce(p_actual_shipping_cost, v_shipment.actual_shipping_cost) > 0 then
    v_led_num := app.generate_document_number(p_organization_id, v_shipment.brand_id, 'LED');
    
    insert into app.financial_ledger_entries (
      organization_id,
      brand_id,
      order_id,
      entry_number,
      entry_type,
      category,
      amount,
      direction,
      reference_id,
      reference_document,
      metadata,
      notes,
      created_by_user_id
    ) values (
      p_organization_id,
      v_shipment.brand_id,
      v_shipment.order_id,
      v_led_num,
      'COURIER_EXPENSE_DISBURSED',
      'PASS_THROUGH_SHIPPING',
      coalesce(p_actual_shipping_cost, v_shipment.actual_shipping_cost),
      'DEBIT',
      v_shipment.id,
      v_shipment.shipment_number,
      jsonb_build_object(
        'courier_name', v_shipment.courier_name,
        'tracking_number', v_clean_tracking,
        'actual_shipping_cost', coalesce(p_actual_shipping_cost, v_shipment.actual_shipping_cost)
      ),
      'Pengeluaran ongkir riil serah terima kurir ekspedisi (Pass-through reimbursement)',
      p_actor_id
    );
  end if;

  return jsonb_build_object(
    'shipment_id', v_shipment.id,
    'shipment_number', v_shipment.shipment_number,
    'status', 'DISPATCHED',
    'tracking_number', v_clean_tracking,
    'actual_shipping_cost', coalesce(p_actual_shipping_cost, v_shipment.actual_shipping_cost)
  );
end;
$$;

-- ============================================================================
-- 9. Stored Procedure: mark_shipment_delivered
-- ============================================================================
create or replace function app.mark_shipment_delivered(
  p_organization_id uuid,
  p_actor_id uuid,
  p_shipment_id uuid,
  p_delivered_date timestamptz default null,
  p_notes text default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_role text;
  v_shipment app.shipments%rowtype;
  v_delivery_time timestamptz;
begin
  -- 1. Authorization check
  v_role := app.shipment_actor_role(p_organization_id, p_actor_id);
  if v_role not in ('OWNER', 'ADMIN', 'OPERATIONS', 'FINANCE') then
    raise exception 'Unauthorized to mark shipments delivered';
  end if;

  -- 2. Lock shipment
  select * into v_shipment
  from app.shipments
  where id = p_shipment_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Shipment not found in organization';
  end if;

  if v_shipment.status not in ('DISPATCHED', 'IN_TRANSIT') then
    raise exception 'Cannot deliver shipment currently in % status', v_shipment.status;
  end if;

  v_delivery_time := coalesce(p_delivered_date, now());

  -- 3. Update shipment status
  update app.shipments
  set status = 'DELIVERED',
      delivered_date = v_delivery_time,
      notes = coalesce(p_notes, notes),
      updated_at = now()
  where id = v_shipment.id;

  -- 4. Audit trail
  insert into app.shipment_audit (
    organization_id,
    shipment_id,
    actor_id,
    action,
    metadata
  ) values (
    p_organization_id,
    v_shipment.id,
    p_actor_id,
    'shipment.delivered',
    jsonb_build_object(
      'delivered_date', v_delivery_time,
      'notes', p_notes
    )
  );

  return jsonb_build_object(
    'shipment_id', v_shipment.id,
    'shipment_number', v_shipment.shipment_number,
    'status', 'DELIVERED',
    'delivered_date', v_delivery_time
  );
end;
$$;

-- ============================================================================
-- 10. Stored Procedure: cancel_shipment
-- ============================================================================
create or replace function app.cancel_shipment(
  p_organization_id uuid,
  p_actor_id uuid,
  p_shipment_id uuid,
  p_reason text
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_role text;
  v_shipment app.shipments%rowtype;
begin
  -- 1. Authorization check
  v_role := app.shipment_actor_role(p_organization_id, p_actor_id);
  if v_role not in ('OWNER', 'ADMIN', 'OPERATIONS') then
    raise exception 'Unauthorized to cancel shipments';
  end if;

  if p_reason is null or trim(p_reason) = '' then
    raise exception 'Cancellation reason is required';
  end if;

  -- 2. Lock shipment
  select * into v_shipment
  from app.shipments
  where id = p_shipment_id and organization_id = p_organization_id
  for update;

  if not found then
    raise exception 'Shipment not found in organization';
  end if;

  if v_shipment.status = 'DELIVERED' then
    raise exception 'Cannot cancel delivered shipment %', v_shipment.shipment_number;
  end if;

  -- 3. Update status to CANCELLED
  update app.shipments
  set status = 'CANCELLED',
      notes = coalesce(notes || E'\n[CANCELLED]: ' || p_reason, '[CANCELLED]: ' || p_reason),
      updated_at = now()
  where id = v_shipment.id;

  -- 4. Audit trail
  insert into app.shipment_audit (
    organization_id,
    shipment_id,
    actor_id,
    action,
    metadata
  ) values (
    p_organization_id,
    v_shipment.id,
    p_actor_id,
    'shipment.cancelled',
    jsonb_build_object('reason', p_reason)
  );

  return jsonb_build_object(
    'shipment_id', v_shipment.id,
    'shipment_number', v_shipment.shipment_number,
    'status', 'CANCELLED',
    'reason', p_reason
  );
end;
$$;

commit;
