begin;

-- 1. Extend quote_versions for acceptance details
alter table app.quote_versions add column if not exists accepted_at timestamptz;
alter table app.quote_versions add column if not exists acceptance_details jsonb;

-- 2. Update quote_snapshot_guard to accommodate immutable acceptance timestamps
create or replace function app.quote_snapshot_guard() returns trigger language plpgsql set search_path=app,pg_temp as $$
begin
  if TG_TABLE_NAME='quote_versions' and TG_OP='UPDATE' then
    if (to_jsonb(NEW)-array['status','sent_at','accepted_at','acceptance_details']) is distinct from (to_jsonb(OLD)-array['status','sent_at','accepted_at','acceptance_details']) then
      raise exception 'Quote snapshot is immutable; create a revision';
    end if;
    if OLD.sent_at is not null and NEW.sent_at is distinct from OLD.sent_at then
      raise exception 'Sent timestamp is immutable';
    end if;
    if OLD.accepted_at is not null and NEW.accepted_at is distinct from OLD.accepted_at then
      raise exception 'Accepted timestamp is immutable';
    end if;
    return NEW;
  end if;
  raise exception 'Quote history is append-only';
end; $$;

-- 3. Stored procedure: mark_quote_accepted
create or replace function app.mark_quote_accepted(
  p_organization_id uuid,
  p_actor_id uuid,
  p_version_id uuid,
  p_acceptance_method text,
  p_accepted_by_contact_id uuid default null,
  p_notes text default null
) returns uuid language plpgsql security definer set search_path=app,pg_temp as $$
declare
  q app.quotes%rowtype;
  v app.quote_versions%rowtype;
  req app.requirements%rowtype;
  method_clean text;
begin
  if app.quote_actor_role(p_organization_id, p_actor_id) not in ('OWNER','ADMIN','SALES') then
    raise exception 'Not authorized to accept quotes';
  end if;

  method_clean := upper(trim(coalesce(p_acceptance_method, '')));
  if method_clean not in ('WHATSAPP','EMAIL','SIGNATURE','DIRECT') then
    raise exception 'Invalid acceptance method; must be WHATSAPP, EMAIL, SIGNATURE, or DIRECT';
  end if;

  if p_notes is not null and length(p_notes) > 2000 then
    raise exception 'Acceptance notes exceed maximum 2000 characters';
  end if;

  -- Lock requirement before quote, matching strict hierarchical lock order
  select r.* into req
  from app.requirements r
  join app.quotes quotes on quotes.requirement_id = r.id
  join app.quote_versions ver on ver.quote_id = quotes.id
  where ver.id = p_version_id and quotes.organization_id = p_organization_id
  for update of r;

  if not found then
    raise exception 'Quote not found';
  end if;

  select quotes.* into q
  from app.quotes quotes
  join app.quote_versions ver on ver.quote_id = quotes.id
  where ver.id = p_version_id and quotes.organization_id = p_organization_id
  for update of quotes;

  select * into v from app.quote_versions where id = p_version_id;

  if q.current_version_id <> v.id then
    raise exception 'Only current quote version may be accepted';
  end if;

  -- Idempotency: if already accepted with same details, return
  if v.status = 'ACCEPTED' then
    return v.id;
  end if;

  if v.status <> 'SENT' then
    raise exception 'Only sent quote may be accepted';
  end if;

  if v.valid_until < (now() at time zone 'Asia/Jakarta')::date then
    raise exception 'Quote has expired';
  end if;

  if req.current_version_id <> v.requirement_version_id or req.status <> 'LOCKED' then
    raise exception 'Referenced requirement must be LOCKED';
  end if;

  if not exists(select 1 from app.customer_accounts where id = q.customer_account_id and organization_id = p_organization_id and status = 'ACTIVE')
     or not exists(select 1 from app.brands where id = q.brand_id and organization_id = p_organization_id and status = 'ACTIVE') then
    raise exception 'Active customer and brand required';
  end if;

  if v.pricing_guard = 'APPROVAL_REQUIRED' and not exists(select 1 from app.quote_price_approvals where quote_version_id = v.id) then
    raise exception 'Owner approval required below 20 percent margin';
  end if;

  if p_accepted_by_contact_id is not null and not exists(
    select 1 from app.customer_contacts
    where id = p_accepted_by_contact_id and customer_account_id = q.customer_account_id and archived_at is null
  ) then
    raise exception 'Accepted by contact must belong to active customer account';
  end if;

  update app.quote_versions
  set status = 'ACCEPTED',
      accepted_at = now(),
      acceptance_details = jsonb_build_object(
        'method', method_clean,
        'contact_id', p_accepted_by_contact_id,
        'notes', p_notes
      )
  where id = v.id;

  insert into app.quote_audit(organization_id, quote_version_id, actor_id, action, details)
  values(
    p_organization_id,
    v.id,
    p_actor_id,
    'quote.accepted',
    jsonb_build_object('method', method_clean, 'contact_id', p_accepted_by_contact_id)
  );

  return v.id;
end; $$;

-- 4. Order Tables
create table if not exists app.orders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references app.organizations(id) on delete restrict,
  brand_id uuid not null references app.brands(id) on delete restrict,
  customer_account_id uuid not null references app.customer_accounts(id) on delete restrict,
  source_quote_id uuid not null references app.quotes(id) on delete restrict,
  source_quote_version_id uuid not null unique references app.quote_versions(id) on delete restrict,
  source_requirement_id uuid not null references app.requirements(id) on delete restrict,
  source_requirement_version_id uuid not null references app.requirement_versions(id) on delete restrict,
  order_number text not null,
  status text not null default 'CONFIRMED' check(status in ('DRAFT','CONFIRMED','ACTIVE','ON_HOLD','COMPLETED','CANCELLED')),
  currency text not null default 'IDR' check(currency='IDR'),
  subtotal bigint not null check(subtotal > 0),
  discount_total bigint not null check(discount_total >= 0 and discount_total < subtotal),
  shipping_total bigint not null check(shipping_total >= 0),
  grand_total bigint not null check(grand_total > 0),
  estimated_cost_total bigint not null check(estimated_cost_total > 0),
  estimated_gross_profit bigint not null,
  customer_snapshot jsonb not null,
  shipping_address_snapshot jsonb not null,
  billing_address_snapshot jsonb,
  payment_terms_snapshot jsonb not null,
  created_by_user_id uuid not null references app.users(id) on delete restrict,
  confirmed_at timestamptz not null default now(),
  request_id uuid not null,
  request_payload jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(organization_id, order_number),
  unique(created_by_user_id, request_id),
  check(grand_total::numeric = subtotal::numeric - discount_total + shipping_total),
  check(estimated_gross_profit::numeric = subtotal::numeric - discount_total - estimated_cost_total)
);

create table if not exists app.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references app.orders(id) on delete restrict,
  position integer not null default 1,
  description text not null,
  quantity integer not null check(quantity > 0),
  unit text not null,
  unit_price bigint not null check(unit_price >= 0),
  discount_total bigint not null default 0 check(discount_total >= 0),
  subtotal bigint not null check(subtotal > 0),
  specification_snapshot jsonb not null,
  created_at timestamptz not null default now(),
  unique(order_id, position)
);

create table if not exists app.order_audit (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references app.organizations(id) on delete restrict,
  order_id uuid not null references app.orders(id) on delete restrict,
  actor_id uuid not null references app.users(id) on delete restrict,
  action text not null,
  details jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_orders_org_brand on app.orders(organization_id, brand_id, created_at desc);
create index if not exists idx_orders_customer on app.orders(customer_account_id);
create index if not exists idx_orders_quote on app.orders(source_quote_id);
create index if not exists idx_order_items_order on app.order_items(order_id);
create index if not exists idx_order_audit_order on app.order_audit(order_id, created_at);

-- 5. Order Snapshot Immutability Guard
create or replace function app.order_snapshot_guard() returns trigger language plpgsql set search_path=app,pg_temp as $$
begin
  if TG_TABLE_NAME='orders' and TG_OP='UPDATE' then
    if (to_jsonb(NEW) - array['status','updated_at']) is distinct from (to_jsonb(OLD) - array['status','updated_at']) then
      raise exception 'Order contract is immutable; financial values, addresses, and item specifications cannot be altered';
    end if;
    return NEW;
  end if;
  raise exception 'Order history is append-only';
end; $$;

drop trigger if exists order_guard on app.orders;
create trigger order_guard before update or delete on app.orders for each row execute function app.order_snapshot_guard();

drop trigger if exists order_item_guard on app.order_items;
create trigger order_item_guard before update or delete on app.order_items for each row execute function app.order_snapshot_guard();

drop trigger if exists order_audit_guard on app.order_audit;
create trigger order_audit_guard before update or delete on app.order_audit for each row execute function app.order_snapshot_guard();

-- 6. Stored procedure: create_order_from_quote
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
  role_code := app.quote_actor_role(p_organization_id, p_actor_id);
  if role_code not in ('OWNER','ADMIN','SALES') then
    raise exception 'Not authorized to create orders';
  end if;

  if p_request_id is null then
    raise exception 'Request ID required';
  end if;

  -- Lock transaction for idempotency
  perform pg_advisory_xact_lock(hashtextextended(p_actor_id::text || p_request_id::text, 0));

  -- Check idempotent retry by request_id
  select * into existing from app.orders
  where created_by_user_id = p_actor_id and request_id = p_request_id;
  if found then
    return jsonb_build_object('order_id', existing.id, 'order_number', existing.order_number, 'is_retry', true);
  end if;

  -- Check if order already exists for this quote version
  select * into existing from app.orders where source_quote_version_id = p_quote_version_id;
  if found then
    return jsonb_build_object('order_id', existing.id, 'order_number', existing.order_number, 'is_retry', true);
  end if;

  -- Lock quote and version
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

  -- Insert order
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

-- 7. Permissions & RLS
do $$ declare tbl text; begin
  foreach tbl in array array['orders','order_items','order_audit'] loop
    execute format('alter table app.%I enable row level security', tbl);
    execute format('revoke all on app.%I from public,anon,authenticated,service_role', tbl);
    execute format('grant select on app.%I to service_role', tbl);
  end loop;
end; $$;

revoke all on function app.mark_quote_accepted(uuid,uuid,uuid,text,uuid,text), app.create_order_from_quote(uuid,uuid,uuid,uuid,jsonb,jsonb,jsonb,text) from public,anon,authenticated,service_role;
grant execute on function app.mark_quote_accepted(uuid,uuid,uuid,text,uuid,text), app.create_order_from_quote(uuid,uuid,uuid,uuid,jsonb,jsonb,jsonb,text) to service_role;

commit;
