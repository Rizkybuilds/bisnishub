-- Migration: 20261023100000_teestock_flexible_erp_commerce.sql
-- Description: TeeStock Flexible Commerce & ERP Engine (Dynamic Pricing, Promo Engine, BOM HPP, and Order Margin Snapshots)
-- Specification: systems/mgbos/docs/product/teestock-customer-platform/teestock-flexible-erp-commerce-prd.md
-- Protocol Ref: BWP-20261023-01 / TFC-20261023-01 / BOB-TEESTOCK-20261023-01

begin;

-- ============================================================================
-- 1. Schema Extensions: app.orders
-- ============================================================================

-- Expand order_type check constraint to accommodate partner collaboration and reseller dropship
alter table app.orders drop constraint if exists orders_order_type_check;
alter table app.orders drop constraint if exists check_order_type_sources;

alter table app.orders add constraint orders_order_type_check check (
  order_type in ('CUSTOM_B2B', 'RETAIL_DIRECT', 'CREATOR_COLLAB', 'RESELLER_DROPSHIP')
);

alter table app.orders add constraint check_order_type_sources check (
  (order_type = 'CUSTOM_B2B' and source_quote_id is not null and source_quote_version_id is not null and source_requirement_id is not null and source_requirement_version_id is not null)
  or
  (order_type in ('RETAIL_DIRECT', 'CREATOR_COLLAB', 'RESELLER_DROPSHIP'))
);

-- Add white-label dropship sender attributes
alter table app.orders 
  add column if not exists dropship_sender_name text default null,
  add column if not exists dropship_sender_phone text default null;

-- ============================================================================
-- 2. New Table: app.pricing_rules (Founder-Controlled Dynamic Pricing)
-- ============================================================================

create table if not exists app.pricing_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references app.organizations(id) on delete cascade,
  product_id text not null,
  base_price bigint not null check (base_price >= 0),
  compare_at_price bigint default null check (compare_at_price is null or compare_at_price >= base_price),
  currency text not null default 'IDR',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_pricing_rules_org_product unique (organization_id, product_id)
);

create index if not exists idx_pricing_rules_lookup on app.pricing_rules(organization_id, product_id) where is_active = true;

-- ============================================================================
-- 3. New Table: app.promotions (Voucher Codes, Bundling & Dynamic Discounts)
-- ============================================================================

create table if not exists app.promotions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references app.organizations(id) on delete cascade,
  code text not null,
  discount_type text not null check (discount_type in ('PERCENTAGE', 'FIXED_AMOUNT', 'BUNDLE_DISCOUNT')),
  discount_value bigint not null check (discount_value > 0),
  min_order_amount bigint not null default 0 check (min_order_amount >= 0),
  min_quantity integer not null default 1 check (min_quantity >= 1),
  usage_limit integer default null check (usage_limit is null or usage_limit > 0),
  used_count integer not null default 0 check (used_count >= 0),
  is_active boolean not null default true,
  valid_from timestamptz not null default now(),
  valid_until timestamptz default null check (valid_until is null or valid_until > valid_from),
  created_at timestamptz not null default now(),
  constraint uq_promotions_org_code unique (organization_id, code)
);

create index if not exists idx_promotions_lookup on app.promotions(organization_id, code) where is_active = true;

-- ============================================================================
-- 4. New Table: app.product_bom (Bill of Materials & Dynamic HPP Configuration)
-- ============================================================================

create table if not exists app.product_bom (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references app.organizations(id) on delete cascade,
  product_id text not null,
  blank_item_id uuid references app.inventory_items(id) on delete set null,
  blank_unit_cost bigint not null default 32000 check (blank_unit_cost >= 0),
  print_area_category text not null check (print_area_category in ('A3', 'A4', 'POCKET', 'CUSTOM')) default 'A3',
  dtf_print_cost bigint not null default 12500 check (dtf_print_cost >= 0),
  packaging_cost bigint not null default 3000 check (packaging_cost >= 0),
  overhead_allocation bigint not null default 1500 check (overhead_allocation >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_product_bom_org_product unique (organization_id, product_id)
);

create index if not exists idx_product_bom_lookup on app.product_bom(organization_id, product_id);

-- ============================================================================
-- 5. New Table: app.order_margin_snapshots (Immutable Realized Net Profit Ledger)
-- ============================================================================

create table if not exists app.order_margin_snapshots (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references app.orders(id) on delete cascade,
  organization_id uuid not null references app.organizations(id) on delete cascade,
  gross_selling_price bigint not null check (gross_selling_price >= 0),
  discount_amount bigint not null default 0 check (discount_amount >= 0),
  net_selling_price bigint not null check (net_selling_price >= 0),
  calculated_hpp bigint not null check (calculated_hpp >= 0),
  creator_royalty bigint not null default 0 check (creator_royalty >= 0),
  payment_fee bigint not null default 0 check (payment_fee >= 0),
  shipping_subsidy bigint not null default 0 check (shipping_subsidy >= 0),
  net_profit bigint not null,
  created_at timestamptz not null default now(),
  constraint uq_order_margin_order unique (order_id)
);

create index if not exists idx_order_margin_org on app.order_margin_snapshots(organization_id, created_at desc);

-- ============================================================================
-- 6. Helper Functions & Stored Procedures
-- ============================================================================

-- Function 6.1: Calculate Unit HPP
create or replace function app.calculate_unit_hpp(
  p_blank_cost bigint,
  p_dtf_cost bigint,
  p_packaging_cost bigint default 3000,
  p_overhead_cost bigint default 1500
) returns bigint language sql immutable as $$
  select coalesce(p_blank_cost, 0) + coalesce(p_dtf_cost, 0) + coalesce(p_packaging_cost, 0) + coalesce(p_overhead_cost, 0);
$$;

-- Function 6.2: Get Effective Pricing & Apply Promos Dynamically
create or replace function app.get_effective_pricing(
  p_organization_id uuid,
  p_product_id text,
  p_promo_code text default null,
  p_quantity integer default 1
) returns jsonb language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_rule app.pricing_rules%rowtype;
  v_promo app.promotions%rowtype;
  v_qty integer := greatest(1, coalesce(p_quantity, 1));
  v_base_unit_price bigint;
  v_compare_unit_price bigint;
  v_subtotal bigint;
  v_discount_total bigint := 0;
  v_final_total bigint;
  v_promo_applied boolean := false;
  v_promo_notice text := null;
begin
  -- 1. Fetch active pricing rule for this product
  select * into v_rule 
  from app.pricing_rules 
  where organization_id = p_organization_id 
    and product_id = p_product_id 
    and is_active = true;

  if not found then
    -- Fallback default retail price if unconfigured: 99000
    v_base_unit_price := 99000;
    v_compare_unit_price := 129000;
  else
    v_base_unit_price := v_rule.base_price;
    v_compare_unit_price := v_rule.compare_at_price;
  end if;

  v_subtotal := v_base_unit_price * v_qty;

  -- 2. Evaluate promo code if supplied
  if p_promo_code is not null and trim(p_promo_code) <> '' then
    select * into v_promo 
    from app.promotions 
    where organization_id = p_organization_id 
      and upper(code) = upper(trim(p_promo_code))
      and is_active = true
      and valid_from <= now()
      and (valid_until is null or valid_until >= now());

    if found then
      -- Check usage limit
      if v_promo.usage_limit is not null and v_promo.used_count >= v_promo.usage_limit then
        v_promo_notice := 'Promo code usage limit reached.';
      -- Check min spend and min quantity
      elsif v_subtotal < v_promo.min_order_amount then
        v_promo_notice := 'Minimum order amount not met.';
      elsif v_qty < v_promo.min_quantity then
        v_promo_notice := 'Minimum item quantity not met.';
      else
        -- Compute discount
        if v_promo.discount_type = 'PERCENTAGE' then
          v_discount_total := round((v_subtotal * v_promo.discount_value)::numeric / 100.0);
        elsif v_promo.discount_type = 'FIXED_AMOUNT' then
          v_discount_total := least(v_subtotal, v_promo.discount_value);
        elsif v_promo.discount_type = 'BUNDLE_DISCOUNT' then
          v_discount_total := least(v_subtotal, v_promo.discount_value * v_qty);
        end if;
        v_promo_applied := true;
        v_promo_notice := 'Promo applied successfully.';
      end if;
    else
      v_promo_notice := 'Invalid or expired promo code.';
    end if;
  end if;

  v_final_total := greatest(0, v_subtotal - v_discount_total);

  return jsonb_build_object(
    'product_id', p_product_id,
    'quantity', v_qty,
    'base_unit_price', v_base_unit_price,
    'compare_unit_price', v_compare_unit_price,
    'subtotal', v_subtotal,
    'discount_total', v_discount_total,
    'final_total', v_final_total,
    'effective_unit_price', round(v_final_total::numeric / v_qty),
    'promo_applied', v_promo_applied,
    'promo_code', case when v_promo_applied then v_promo.code else null end,
    'promo_notice', v_promo_notice
  );
end;
$$;

-- Function 6.3: Record Order Margin Snapshot
create or replace function app.record_order_margin_snapshot(
  p_organization_id uuid,
  p_order_id uuid,
  p_creator_royalty bigint default 0,
  p_payment_fee bigint default 0,
  p_shipping_subsidy bigint default 0
) returns uuid language plpgsql security definer set search_path=app,pg_temp as $$
declare
  v_order app.orders%rowtype;
  v_item app.order_items%rowtype;
  v_bom app.product_bom%rowtype;
  v_snapshot_id uuid := gen_random_uuid();
  v_total_hpp bigint := 0;
  v_net_profit bigint;
begin
  select * into v_order from app.orders where id = p_order_id and organization_id = p_organization_id;
  if not found then
    raise exception 'Order not found in organization';
  end if;

  -- Compute total HPP from order items matching BOM
  for v_item in select * from app.order_items where order_id = p_order_id loop
    select * into v_bom from app.product_bom where organization_id = p_organization_id and product_id = v_item.description limit 1;
    if found then
      v_total_hpp := v_total_hpp + (app.calculate_unit_hpp(v_bom.blank_unit_cost, v_bom.dtf_print_cost, v_bom.packaging_cost, v_bom.overhead_allocation) * v_item.quantity);
    else
      -- Conservative default HPP if unconfigured (Rp 49.000 per shirt)
      v_total_hpp := v_total_hpp + (49000 * v_item.quantity);
    end if;
  end loop;

  v_net_profit := v_order.total_amount - v_total_hpp - coalesce(p_creator_royalty, 0) - coalesce(p_payment_fee, 0) - coalesce(p_shipping_subsidy, 0);

  insert into app.order_margin_snapshots (
    id,
    order_id,
    organization_id,
    gross_selling_price,
    discount_amount,
    net_selling_price,
    calculated_hpp,
    creator_royalty,
    payment_fee,
    shipping_subsidy,
    net_profit,
    created_at
  ) values (
    v_snapshot_id,
    p_order_id,
    p_organization_id,
    v_order.subtotal,
    v_order.discount_total,
    v_order.total_amount,
    v_total_hpp,
    coalesce(p_creator_royalty, 0),
    coalesce(p_payment_fee, 0),
    coalesce(p_shipping_subsidy, 0),
    v_net_profit,
    now()
  );

  return v_snapshot_id;
end;
$$;

-- ============================================================================
-- 7. Row Level Security (RLS) & Access Governance
-- ============================================================================

alter table app.pricing_rules enable row level security;
alter table app.promotions enable row level security;
alter table app.product_bom enable row level security;
alter table app.order_margin_snapshots enable row level security;

-- 7.1 Pricing Rules: Public read active prices, Admin manage
create policy pricing_rules_public_select on app.pricing_rules
  for select using (is_active = true);

create policy pricing_rules_admin_all on app.pricing_rules
  for all using (
    exists (
      select 1 from app.organization_memberships m
      where m.organization_id = pricing_rules.organization_id
        and m.user_id = auth.uid()
        and m.role in ('OWNER', 'ADMIN', 'MANAGER')
    )
  );

-- 7.2 Promotions: Public read active valid promos, Admin manage
create policy promotions_public_select on app.promotions
  for select using (
    is_active = true 
    and valid_from <= now() 
    and (valid_until is null or valid_until >= now())
  );

create policy promotions_admin_all on app.promotions
  for all using (
    exists (
      select 1 from app.organization_memberships m
      where m.organization_id = promotions.organization_id
        and m.user_id = auth.uid()
        and m.role in ('OWNER', 'ADMIN', 'MANAGER')
    )
  );

-- 7.3 Product BOM: Strictly internal, NO public read access
create policy product_bom_admin_all on app.product_bom
  for all using (
    exists (
      select 1 from app.organization_memberships m
      where m.organization_id = product_bom.organization_id
        and m.user_id = auth.uid()
        and m.role in ('OWNER', 'ADMIN', 'MANAGER')
    )
  );

-- 7.4 Order Margin Snapshots: Strictly internal financial audit, NO public read access
create policy order_margin_admin_all on app.order_margin_snapshots
  for all using (
    exists (
      select 1 from app.organization_memberships m
      where m.organization_id = order_margin_snapshots.organization_id
        and m.user_id = auth.uid()
        and m.role in ('OWNER', 'ADMIN', 'MANAGER')
    )
  );

commit;
