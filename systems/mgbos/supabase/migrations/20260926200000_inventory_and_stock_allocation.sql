-- Migration: 20260926200000_inventory_and_stock_allocation.sql
-- Description: MGBOS-018 Inventory, SKU Variants & Stock Allocation Engine (TS-PLAN-07)
-- Specification: MultiGraph Business OS — Sprint 7 (Inventory Management, Blanks/DTF/Packaging Stock & Anti-Overselling Reservations)

begin;

-- ============================================================================
-- 1. Helper function: inventory actor role
-- ============================================================================
create or replace function app.inventory_actor_role(
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
-- 2. Master Inventory Items (app.inventory_items)
-- ============================================================================
create table if not exists app.inventory_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references app.organizations(id) on delete restrict,
  brand_id uuid references app.brands(id) on delete restrict,
  sku text not null,
  name text not null,
  category text not null check(category in (
    'BLANK_GARMENT',
    'PRINT_MATERIAL',
    'PACKAGING',
    'FINISHED_GOOD',
    'OTHER'
  )),
  unit text not null default 'pcs',
  attributes jsonb not null default '{}'::jsonb,
  cost_price bigint not null default 0 check(cost_price >= 0),
  min_stock_alert integer not null default 10 check(min_stock_alert >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id, sku)
);

create index if not exists idx_inventory_items_org_brand on app.inventory_items(organization_id, brand_id);
create index if not exists idx_inventory_items_category on app.inventory_items(organization_id, category);
create index if not exists idx_inventory_items_sku on app.inventory_items(sku);

-- ============================================================================
-- 3. Stock Levels per Location (app.inventory_levels)
-- ============================================================================
create table if not exists app.inventory_levels (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references app.organizations(id) on delete restrict,
  inventory_item_id uuid not null references app.inventory_items(id) on delete cascade,
  location_code text not null default 'MAIN_WORKSHOP',
  bin_location text,
  quantity_on_hand integer not null default 0 check(quantity_on_hand >= 0),
  quantity_reserved integer not null default 0 check(quantity_reserved >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (quantity_on_hand >= quantity_reserved),
  unique(organization_id, inventory_item_id, location_code)
);

create index if not exists idx_inventory_levels_item on app.inventory_levels(inventory_item_id);
create index if not exists idx_inventory_levels_org_loc on app.inventory_levels(organization_id, location_code);

-- ============================================================================
-- 4. Inventory Mutations Log (app.inventory_mutations) - Append-Only Ledger
-- ============================================================================
create table if not exists app.inventory_mutations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references app.organizations(id) on delete restrict,
  inventory_item_id uuid not null references app.inventory_items(id) on delete restrict,
  location_code text not null default 'MAIN_WORKSHOP',
  mutation_type text not null check(mutation_type in (
    'INBOUND_PURCHASE',
    'RESERVATION',
    'RELEASE_RESERVATION',
    'CONSUMED_PRODUCTION',
    'SCRAP_DEFECT',
    'OUTBOUND_SHIPMENT',
    'STOCK_OPNAME'
  )),
  quantity_change integer not null,
  quantity_on_hand_after integer not null check(quantity_on_hand_after >= 0),
  quantity_reserved_after integer not null check(quantity_reserved_after >= 0),
  reference_type text,
  reference_id uuid,
  notes text,
  actor_id uuid not null references app.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create index if not exists idx_inventory_mutations_item on app.inventory_mutations(inventory_item_id, created_at desc);
create index if not exists idx_inventory_mutations_ref on app.inventory_mutations(reference_type, reference_id);

-- ============================================================================
-- 5. Active Stock Reservations (app.inventory_reservations)
-- ============================================================================
create table if not exists app.inventory_reservations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references app.organizations(id) on delete restrict,
  inventory_item_id uuid not null references app.inventory_items(id) on delete restrict,
  order_id uuid not null references app.orders(id) on delete cascade,
  order_item_id uuid references app.order_items(id) on delete cascade,
  location_code text not null default 'MAIN_WORKSHOP',
  quantity integer not null check(quantity > 0),
  status text not null default 'ACTIVE' check(status in ('ACTIVE', 'CONSUMED', 'RELEASED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_inventory_reservations_order on app.inventory_reservations(order_id);
create index if not exists idx_inventory_reservations_status on app.inventory_reservations(inventory_item_id, status);

-- ============================================================================
-- 6. Row-Level Security (RLS)
-- ============================================================================
alter table app.inventory_items enable row level security;
alter table app.inventory_levels enable row level security;
alter table app.inventory_mutations enable row level security;
alter table app.inventory_reservations enable row level security;

create policy "Allow service_role full access to inventory_items"
  on app.inventory_items for all to service_role using (true) with check (true);

create policy "Allow organization members to view inventory_items"
  on app.inventory_items for select to authenticated
  using (
    exists (
      select 1 from app.organization_members om
      join app.users u on u.id = om.user_id
      where om.organization_id = inventory_items.organization_id
        and u.auth_user_id = auth.uid()
        and om.status = 'ACTIVE'
    )
  );

create policy "Allow service_role full access to inventory_levels"
  on app.inventory_levels for all to service_role using (true) with check (true);

create policy "Allow organization members to view inventory_levels"
  on app.inventory_levels for select to authenticated
  using (
    exists (
      select 1 from app.organization_members om
      join app.users u on u.id = om.user_id
      where om.organization_id = inventory_levels.organization_id
        and u.auth_user_id = auth.uid()
        and om.status = 'ACTIVE'
    )
  );

create policy "Allow service_role full access to inventory_mutations"
  on app.inventory_mutations for all to service_role using (true) with check (true);

create policy "Allow organization members to view inventory_mutations"
  on app.inventory_mutations for select to authenticated
  using (
    exists (
      select 1 from app.organization_members om
      join app.users u on u.id = om.user_id
      where om.organization_id = inventory_mutations.organization_id
        and u.auth_user_id = auth.uid()
        and om.status = 'ACTIVE'
    )
  );

create policy "Allow service_role full access to inventory_reservations"
  on app.inventory_reservations for all to service_role using (true) with check (true);

create policy "Allow organization members to view inventory_reservations"
  on app.inventory_reservations for select to authenticated
  using (
    exists (
      select 1 from app.organization_members om
      join app.users u on u.id = om.user_id
      where om.organization_id = inventory_reservations.organization_id
        and u.auth_user_id = auth.uid()
        and om.status = 'ACTIVE'
    )
  );

-- ============================================================================
-- 7. Trigger: Mutation Immutability Guard
-- ============================================================================
create or replace function app.trg_inventory_mutation_guard()
returns trigger language plpgsql set search_path=app,pg_temp as $$
begin
  raise exception 'Inventory mutation log is append-only and strictly immutable';
end;
$$;

drop trigger if exists trg_inventory_mutation_guard on app.inventory_mutations;
create trigger trg_inventory_mutation_guard
  before update or delete on app.inventory_mutations
  for each row execute function app.trg_inventory_mutation_guard();

-- ============================================================================
-- 8. Stored Procedure: create_inventory_item
-- ============================================================================
create or replace function app.create_inventory_item(
  p_organization_id uuid,
  p_actor_id uuid,
  p_brand_id uuid default null,
  p_sku text default null,
  p_name text default null,
  p_category text default null,
  p_unit text default 'pcs',
  p_attributes jsonb default '{}'::jsonb,
  p_cost_price bigint default 0,
  p_min_stock_alert integer default 10,
  p_initial_stock integer default 0,
  p_location_code text default 'MAIN_WORKSHOP',
  p_bin_location text default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_role text;
  v_item_id uuid;
  v_clean_sku text;
  v_clean_name text;
begin
  -- 1. Authorization check
  v_role := app.inventory_actor_role(p_organization_id, p_actor_id);
  if v_role not in ('OWNER', 'ADMIN', 'OPERATIONS') then
    raise exception 'Unauthorized to create inventory items';
  end if;

  v_clean_sku := upper(trim(coalesce(p_sku, '')));
  v_clean_name := trim(coalesce(p_name, ''));

  if length(v_clean_sku) < 2 then
    raise exception 'SKU is required (minimum 2 characters)';
  end if;

  if length(v_clean_name) < 2 then
    raise exception 'Item name is required (minimum 2 characters)';
  end if;

  if p_category not in ('BLANK_GARMENT', 'PRINT_MATERIAL', 'PACKAGING', 'FINISHED_GOOD', 'OTHER') then
    raise exception 'Invalid inventory category %', p_category;
  end if;

  if p_initial_stock < 0 then
    raise exception 'Initial stock cannot be negative';
  end if;

  -- 2. Insert master item
  insert into app.inventory_items (
    organization_id,
    brand_id,
    sku,
    name,
    category,
    unit,
    attributes,
    cost_price,
    min_stock_alert
  ) values (
    p_organization_id,
    p_brand_id,
    v_clean_sku,
    v_clean_name,
    p_category,
    coalesce(nullif(trim(p_unit), ''), 'pcs'),
    coalesce(p_attributes, '{}'::jsonb),
    coalesce(p_cost_price, 0),
    coalesce(p_min_stock_alert, 10)
  ) returning id into v_item_id;

  -- 3. Initialize stock level
  insert into app.inventory_levels (
    organization_id,
    inventory_item_id,
    location_code,
    bin_location,
    quantity_on_hand,
    quantity_reserved
  ) values (
    p_organization_id,
    v_item_id,
    coalesce(nullif(trim(p_location_code), ''), 'MAIN_WORKSHOP'),
    nullif(trim(p_bin_location), ''),
    coalesce(p_initial_stock, 0),
    0
  );

  -- 4. If initial stock > 0, log audit mutation
  if p_initial_stock > 0 then
    insert into app.inventory_mutations (
      organization_id,
      inventory_item_id,
      location_code,
      mutation_type,
      quantity_change,
      quantity_on_hand_after,
      quantity_reserved_after,
      notes,
      actor_id
    ) values (
      p_organization_id,
      v_item_id,
      coalesce(nullif(trim(p_location_code), ''), 'MAIN_WORKSHOP'),
      'STOCK_OPNAME',
      p_initial_stock,
      p_initial_stock,
      0,
      'Saldo awal persediaan',
      p_actor_id
    );
  end if;

  return jsonb_build_object(
    'inventory_item_id', v_item_id,
    'sku', v_clean_sku,
    'name', v_clean_name,
    'category', p_category,
    'quantity_on_hand', coalesce(p_initial_stock, 0)
  );
end;
$$;

-- ============================================================================
-- 9. Stored Procedure: record_inventory_mutation
-- ============================================================================
create or replace function app.record_inventory_mutation(
  p_organization_id uuid,
  p_actor_id uuid,
  p_inventory_item_id uuid,
  p_mutation_type text,
  p_quantity integer,
  p_location_code text default 'MAIN_WORKSHOP',
  p_reference_type text default null,
  p_reference_id uuid default null,
  p_notes text default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_role text;
  v_level app.inventory_levels%rowtype;
  v_new_on_hand integer;
  v_new_reserved integer;
begin
  -- 1. Authorization check
  v_role := app.inventory_actor_role(p_organization_id, p_actor_id);
  if v_role not in ('OWNER', 'ADMIN', 'OPERATIONS') then
    raise exception 'Unauthorized to record inventory mutations';
  end if;

  if p_quantity = 0 then
    raise exception 'Mutation quantity cannot be zero';
  end if;

  -- 2. Lock inventory level
  select * into v_level
  from app.inventory_levels
  where organization_id = p_organization_id
    and inventory_item_id = p_inventory_item_id
    and location_code = coalesce(nullif(trim(p_location_code), ''), 'MAIN_WORKSHOP')
  for update;

  if not found then
    -- Auto-initialize level if not exists
    insert into app.inventory_levels (
      organization_id,
      inventory_item_id,
      location_code,
      quantity_on_hand,
      quantity_reserved
    ) values (
      p_organization_id,
      p_inventory_item_id,
      coalesce(nullif(trim(p_location_code), ''), 'MAIN_WORKSHOP'),
      0,
      0
    ) returning * into v_level;
  end if;

  v_new_on_hand := v_level.quantity_on_hand;
  v_new_reserved := v_level.quantity_reserved;

  -- 3. Calculate new levels based on mutation type
  case p_mutation_type
    when 'INBOUND_PURCHASE' then
      if p_quantity < 0 then raise exception 'Inbound quantity must be positive'; end if;
      v_new_on_hand := v_new_on_hand + p_quantity;

    when 'SCRAP_DEFECT' then
      if p_quantity < 0 then raise exception 'Scrap/defect quantity must be positive'; end if;
      if (v_new_on_hand - v_new_reserved) < p_quantity then
        raise exception 'Cannot scrap % units; only % units available unreserved',
          p_quantity, (v_new_on_hand - v_new_reserved);
      end if;
      v_new_on_hand := v_new_on_hand - p_quantity;

    when 'OUTBOUND_SHIPMENT' then
      if p_quantity < 0 then raise exception 'Outbound quantity must be positive'; end if;
      if (v_new_on_hand - v_new_reserved) < p_quantity then
        raise exception 'Cannot ship % units; only % units available unreserved',
          p_quantity, (v_new_on_hand - v_new_reserved);
      end if;
      v_new_on_hand := v_new_on_hand - p_quantity;

    else
      raise exception 'Unsupported direct mutation type %; use dedicated procedure', p_mutation_type;
  end case;

  -- 4. Update level
  update app.inventory_levels
  set quantity_on_hand = v_new_on_hand,
      quantity_reserved = v_new_reserved,
      updated_at = now()
  where id = v_level.id;

  -- 5. Append mutation record
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
    p_inventory_item_id,
    v_level.location_code,
    p_mutation_type,
    case when p_mutation_type = 'INBOUND_PURCHASE' then p_quantity else -p_quantity end,
    v_new_on_hand,
    v_new_reserved,
    p_reference_type,
    p_reference_id,
    p_notes,
    p_actor_id
  );

  return jsonb_build_object(
    'inventory_item_id', p_inventory_item_id,
    'location_code', v_level.location_code,
    'quantity_on_hand', v_new_on_hand,
    'quantity_reserved', v_new_reserved,
    'quantity_available', (v_new_on_hand - v_new_reserved)
  );
end;
$$;

-- ============================================================================
-- 10. Stored Procedure: reserve_inventory_for_order
-- ============================================================================
create or replace function app.reserve_inventory_for_order(
  p_organization_id uuid,
  p_actor_id uuid,
  p_order_id uuid,
  p_items jsonb, -- array of { inventory_item_id, quantity, order_item_id, location_code }
  p_notes text default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_role text;
  v_item jsonb;
  v_item_id uuid;
  v_order_item_id uuid;
  v_qty integer;
  v_loc text;
  v_level app.inventory_levels%rowtype;
  v_item_row app.inventory_items%rowtype;
  v_reserved_count integer := 0;
begin
  -- 1. Authorization check
  v_role := app.inventory_actor_role(p_organization_id, p_actor_id);
  if v_role not in ('OWNER', 'ADMIN', 'OPERATIONS', 'SALES') then
    raise exception 'Unauthorized to reserve stock';
  end if;

  if jsonb_array_length(p_items) = 0 then
    raise exception 'Must specify at least one item to reserve';
  end if;

  -- 2. Process each item reservation
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_item_id := (v_item->>'inventory_item_id')::uuid;
    v_qty := (v_item->>'quantity')::integer;
    v_order_item_id := (v_item->>'order_item_id')::uuid;
    v_loc := coalesce(nullif(trim(v_item->>'location_code'), ''), 'MAIN_WORKSHOP');

    if v_qty <= 0 then
      raise exception 'Reservation quantity must be greater than zero';
    end if;

    select * into v_item_row from app.inventory_items where id = v_item_id and organization_id = p_organization_id;
    if not found then
      raise exception 'Inventory item % not found', v_item_id;
    end if;

    -- Lock stock level
    select * into v_level
    from app.inventory_levels
    where organization_id = p_organization_id
      and inventory_item_id = v_item_id
      and location_code = v_loc
    for update;

    if not found or (v_level.quantity_on_hand - v_level.quantity_reserved) < v_qty then
      raise exception 'Stok tidak mencukupi untuk SKU % (%). Dibutuhkan: %, Tersedia: %',
        v_item_row.sku, v_item_row.name, v_qty,
        coalesce((v_level.quantity_on_hand - v_level.quantity_reserved), 0);
    end if;

    -- Update reserved count
    update app.inventory_levels
    set quantity_reserved = quantity_reserved + v_qty,
        updated_at = now()
    where id = v_level.id;

    -- Record reservation record
    insert into app.inventory_reservations (
      organization_id,
      inventory_item_id,
      order_id,
      order_item_id,
      location_code,
      quantity,
      status
    ) values (
      p_organization_id,
      v_item_id,
      p_order_id,
      v_order_item_id,
      v_loc,
      v_qty,
      'ACTIVE'
    );

    -- Append mutation log
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
      v_item_id,
      v_loc,
      'RESERVATION',
      v_qty,
      v_level.quantity_on_hand,
      v_level.quantity_reserved + v_qty,
      'ORDER',
      p_order_id,
      coalesce(p_notes, 'Alokasi stok reservasi pesanan'),
      p_actor_id
    );

    v_reserved_count := v_reserved_count + 1;
  end loop;

  return jsonb_build_object(
    'order_id', p_order_id,
    'reserved_items_count', v_reserved_count,
    'status', 'RESERVED'
  );
end;
$$;

-- ============================================================================
-- 11. Stored Procedure: release_inventory_reservation
-- ============================================================================
create or replace function app.release_inventory_reservation(
  p_organization_id uuid,
  p_actor_id uuid,
  p_order_id uuid,
  p_reason text default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_role text;
  v_res app.inventory_reservations%rowtype;
  v_level app.inventory_levels%rowtype;
  v_released_count integer := 0;
begin
  -- 1. Authorization check
  v_role := app.inventory_actor_role(p_organization_id, p_actor_id);
  if v_role not in ('OWNER', 'ADMIN', 'OPERATIONS') then
    raise exception 'Unauthorized to release stock reservations';
  end if;

  -- 2. Find and iterate through all active reservations for this order
  for v_res in
    select * from app.inventory_reservations
    where organization_id = p_organization_id
      and order_id = p_order_id
      and status = 'ACTIVE'
    for update
  loop
    -- Lock level
    select * into v_level
    from app.inventory_levels
    where organization_id = p_organization_id
      and inventory_item_id = v_res.inventory_item_id
      and location_code = v_res.location_code
    for update;

    -- Update reservation status
    update app.inventory_reservations
    set status = 'RELEASED',
        updated_at = now()
    where id = v_res.id;

    -- Decrease reserved level
    update app.inventory_levels
    set quantity_reserved = greatest(0, quantity_reserved - v_res.quantity),
        updated_at = now()
    where id = v_level.id;

    -- Log mutation
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
      v_res.inventory_item_id,
      v_res.location_code,
      'RELEASE_RESERVATION',
      -v_res.quantity,
      v_level.quantity_on_hand,
      greatest(0, v_level.quantity_reserved - v_res.quantity),
      'ORDER',
      p_order_id,
      coalesce(p_reason, 'Pembatalan reservasi stok pesanan'),
      p_actor_id
    );

    v_released_count := v_released_count + 1;
  end loop;

  return jsonb_build_object(
    'order_id', p_order_id,
    'released_reservations_count', v_released_count,
    'status', 'RELEASED'
  );
end;
$$;

-- ============================================================================
-- 12. Stored Procedure: consume_inventory_for_order
-- ============================================================================
create or replace function app.consume_inventory_for_order(
  p_organization_id uuid,
  p_actor_id uuid,
  p_order_id uuid,
  p_notes text default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_role text;
  v_res app.inventory_reservations%rowtype;
  v_level app.inventory_levels%rowtype;
  v_consumed_count integer := 0;
begin
  -- 1. Authorization check
  v_role := app.inventory_actor_role(p_organization_id, p_actor_id);
  if v_role not in ('OWNER', 'ADMIN', 'OPERATIONS') then
    raise exception 'Unauthorized to consume stock';
  end if;

  -- 2. Find and iterate through active reservations
  for v_res in
    select * from app.inventory_reservations
    where organization_id = p_organization_id
      and order_id = p_order_id
      and status = 'ACTIVE'
    for update
  loop
    -- Lock level
    select * into v_level
    from app.inventory_levels
    where organization_id = p_organization_id
      and inventory_item_id = v_res.inventory_item_id
      and location_code = v_res.location_code
    for update;

    -- Mark reservation CONSUMED
    update app.inventory_reservations
    set status = 'CONSUMED',
        updated_at = now()
    where id = v_res.id;

    -- Decrease BOTH on_hand and reserved
    update app.inventory_levels
    set quantity_on_hand = greatest(0, quantity_on_hand - v_res.quantity),
        quantity_reserved = greatest(0, quantity_reserved - v_res.quantity),
        updated_at = now()
    where id = v_level.id;

    -- Log mutation
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
      v_res.inventory_item_id,
      v_res.location_code,
      'CONSUMED_PRODUCTION',
      -v_res.quantity,
      greatest(0, v_level.quantity_on_hand - v_res.quantity),
      greatest(0, v_level.quantity_reserved - v_res.quantity),
      'ORDER',
      p_order_id,
      coalesce(p_notes, 'Pemakaian fisik bahan untuk pesanan produksi/pengiriman'),
      p_actor_id
    );

    v_consumed_count := v_consumed_count + 1;
  end loop;

  return jsonb_build_object(
    'order_id', p_order_id,
    'consumed_items_count', v_consumed_count,
    'status', 'CONSUMED'
  );
end;
$$;

-- ============================================================================
-- 13. Stored Procedure: perform_stock_opname
-- ============================================================================
create or replace function app.perform_stock_opname(
  p_organization_id uuid,
  p_actor_id uuid,
  p_inventory_item_id uuid,
  p_actual_physical_count integer,
  p_location_code text default 'MAIN_WORKSHOP',
  p_reason text default null
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_role text;
  v_level app.inventory_levels%rowtype;
  v_diff integer;
begin
  -- 1. Authorization check
  v_role := app.inventory_actor_role(p_organization_id, p_actor_id);
  if v_role not in ('OWNER', 'ADMIN', 'OPERATIONS') then
    raise exception 'Unauthorized to perform stock opname';
  end if;

  if p_actual_physical_count < 0 then
    raise exception 'Physical count cannot be negative';
  end if;

  if p_reason is null or trim(p_reason) = '' then
    raise exception 'Reason is required for stock opname adjustments';
  end if;

  -- 2. Lock stock level
  select * into v_level
  from app.inventory_levels
  where organization_id = p_organization_id
    and inventory_item_id = p_inventory_item_id
    and location_code = coalesce(nullif(trim(p_location_code), ''), 'MAIN_WORKSHOP')
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
      p_inventory_item_id,
      coalesce(nullif(trim(p_location_code), ''), 'MAIN_WORKSHOP'),
      p_actual_physical_count,
      0
    ) returning * into v_level;

    v_diff := p_actual_physical_count;
  else
    if p_actual_physical_count < v_level.quantity_reserved then
      raise exception 'Actual count (% units) cannot be lower than active reserved units (% units)',
        p_actual_physical_count, v_level.quantity_reserved;
    end if;

    v_diff := p_actual_physical_count - v_level.quantity_on_hand;

    update app.inventory_levels
    set quantity_on_hand = p_actual_physical_count,
        updated_at = now()
    where id = v_level.id;
  end if;

  -- 3. Append mutation log
  insert into app.inventory_mutations (
    organization_id,
    inventory_item_id,
    location_code,
    mutation_type,
    quantity_change,
    quantity_on_hand_after,
    quantity_reserved_after,
    notes,
    actor_id
  ) values (
    p_organization_id,
    p_inventory_item_id,
    v_level.location_code,
    'STOCK_OPNAME',
    v_diff,
    p_actual_physical_count,
    v_level.quantity_reserved,
    trim(p_reason),
    p_actor_id
  );

  return jsonb_build_object(
    'inventory_item_id', p_inventory_item_id,
    'location_code', v_level.location_code,
    'previous_on_hand', v_level.quantity_on_hand,
    'adjusted_on_hand', p_actual_physical_count,
    'difference', v_diff,
    'quantity_reserved', v_level.quantity_reserved,
    'quantity_available', (p_actual_physical_count - v_level.quantity_reserved)
  );
end;
$$;

commit;
