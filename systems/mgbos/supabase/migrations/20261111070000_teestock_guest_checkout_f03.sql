-- TeeStock F03: customer-initiated unpaid guest orders in the canonical MGBOS ledger.
-- The existing POS create_retail_order must NOT be used for web checkout.
-- All writes remain service_role only; no money, production or stock side effects.
begin;

create table app.teestock_checkout_rate_buckets (
  rate_key text not null check (length(rate_key) between 6 and 64),
  period_start timestamptz not null,
  hits integer not null check (hits between 1 and 100),
  primary key (rate_key, period_start)
);
alter table app.teestock_checkout_rate_buckets enable row level security;
revoke all on app.teestock_checkout_rate_buckets from public, anon, authenticated;
grant select, insert, update on app.teestock_checkout_rate_buckets to service_role;
create policy teestock_checkout_rate_service on app.teestock_checkout_rate_buckets
  for all to service_role using (true) with check (true);

create function app.create_teestock_guest_order(
  p_org uuid,
  p_brand uuid,
  p_actor uuid,
  p_request uuid,
  p_name text,
  p_phone text,
  p_email text,
  p_items jsonb,
  p_rate_key text
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_customer uuid := gen_random_uuid();
  v_order uuid := gen_random_uuid();
  v_invoice uuid := gen_random_uuid();
  v_order_number text;
  v_invoice_number text;
  v_existing app.orders%rowtype;
  v_product app.teestock_catalog_products%rowtype;
  v_item jsonb;
  v_variant jsonb;
  v_sku text;
  v_slug text;
  v_qty integer;
  v_unit_price bigint;
  v_unit_cost bigint;
  v_subtotal bigint := 0;
  v_cost bigint := 0;
  v_quantity integer := 0;
  v_position integer := 1;
  v_fingerprint text;
  v_bucket timestamptz;
  v_day timestamptz;
  v_count integer;
  v_customer_snapshot jsonb;
  v_pickup_snapshot jsonb;
begin
  -- This RPC is only invoked by the site's server-side service_role integration,
  -- configured with an existing OWNER/ADMIN integration actor.
  if coalesce(app.inventory_actor_role(p_org, p_actor), '') not in ('OWNER','ADMIN')
    or not exists (select 1 from app.organizations where id = p_org and status = 'ACTIVE')
    or not exists (
      select 1 from app.brands
      where id = p_brand and organization_id = p_org
        and status = 'ACTIVE' and code = 'TS'
    ) then
    raise exception 'Checkout configuration is not authorized';
  end if;
  if p_request is null or p_request = '00000000-0000-0000-0000-000000000000'::uuid
    or p_rate_key is null or p_rate_key !~ '^[0-9a-f]{64}$'
    or length(btrim(coalesce(p_name,''))) not between 2 and 100
    or p_phone is null or p_phone !~ '^\+?[0-9]{9,16}$'
    or length(coalesce(p_email,'')) > 160
    or (coalesce(p_email,'') <> '' and p_email !~
      '^[A-Za-z0-9._%+_-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
    or jsonb_typeof(p_items) is distinct from 'array'
  then raise exception 'Invalid checkout request'; end if;
  if jsonb_array_length(p_items) not between 1 and 8 then
    raise exception 'Checkout cart must contain 1 to 8 items';
  end if;
  if exists (
    select 1 from jsonb_array_elements(p_items) item
    where jsonb_typeof(item) is distinct from 'object'
      or coalesce(item->>'slug','') !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
      or length(item->>'slug') > 80
      or coalesce(item->>'sku','') !~ '^[A-Z0-9-]{3,40}$'
      or jsonb_typeof(item->'quantity') is distinct from 'number'
      or coalesce(item->>'quantity','') !~ '^[1-9][0-9]?$'
      or (item->>'quantity')::integer > 10
      or jsonb_typeof(item->'expectedPriceIdr') is distinct from 'number'
      or coalesce(item->>'expectedPriceIdr','') !~ '^[1-9][0-9]{0,9}$'
  ) then raise exception 'Invalid checkout cart line'; end if;
  if (select count(distinct item->>'sku') from jsonb_array_elements(p_items) item)
    <> jsonb_array_length(p_items) then
    raise exception 'Duplicate SKUs are not allowed in checkout';
  end if;
  if (select sum((item->>'quantity')::integer) from jsonb_array_elements(p_items) item)
    > 30 then raise exception 'Too many units in checkout'; end if;

  -- Order idempotency takes precedence over rate limiting. The exact same
  -- client-generated request token cannot silently change its identity/cart.
  v_fingerprint := md5(jsonb_build_object(
    'name',btrim(p_name),'phone',p_phone,'email',lower(coalesce(p_email,'')),
    'items',p_items
  )::text);
  perform pg_advisory_xact_lock(hashtextextended(
    'ts-guest-' || p_actor::text || p_request::text, 0
  ));
  select * into v_existing from app.orders
  where created_by_user_id = p_actor and request_id = p_request;
  if found then
    if v_existing.organization_id <> p_org
      or v_existing.brand_id <> p_brand
      or v_existing.request_payload->>'source' <> 'TEESTOCK_WEB'
      or v_existing.request_payload->>'fingerprint' <> v_fingerprint
    then raise exception 'Checkout request token was already used'; end if;
    return jsonb_build_object('order_number',v_existing.order_number,
      'total_idr',v_existing.grand_total,'is_retry',true);
  end if;

  -- Bounded, transactionally atomic defense-in-depth against anonymous spam.
  -- The server sends an HMAC digest of the trusted client address, never the IP.
  v_bucket := to_timestamp(floor(extract(epoch from now()) / 1800)::bigint * 1800);
  insert into app.teestock_checkout_rate_buckets(rate_key,period_start,hits)
    values (p_rate_key,v_bucket,1)
    on conflict (rate_key,period_start) do update
      set hits = app.teestock_checkout_rate_buckets.hits + 1
      where app.teestock_checkout_rate_buckets.hits < 3
    returning hits into v_count;
  if v_count is null then raise exception 'Checkout limit reached'; end if;
  v_day := date_trunc('day', now() at time zone 'Asia/Jakarta') at time zone 'Asia/Jakarta';
  v_count := null;
  insert into app.teestock_checkout_rate_buckets(rate_key,period_start,hits)
    values ('GLOBAL',v_day,1)
    on conflict (rate_key,period_start) do update
      set hits = app.teestock_checkout_rate_buckets.hits + 1
      where app.teestock_checkout_rate_buckets.hits < 100
    returning hits into v_count;
  if v_count is null then raise exception 'Checkout daily limit reached'; end if;

  -- Customer prices and SKU availability are read from approved DB records
  -- inside this transaction; browser-submitted amounts are entirely ignored.
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_slug := v_item->>'slug';
    v_sku := v_item->>'sku';
    v_qty := (v_item->>'quantity')::integer;
    select * into v_product from app.teestock_catalog_products
      where organization_id = p_org and brand_id = p_brand
        and slug = v_slug and status = 'PUBLISHED'
        and rights_status = 'APPROVED' and sample_status = 'PASSED'
      for share;
    if not found or coalesce(v_product.details->>'material','') = ''
      or coalesce(v_product.details->>'productionDays','') = '' then
      raise exception 'Product not available for ordering';
    end if;
    v_variant := null;
    select item into v_variant from jsonb_array_elements(v_product.variants) item
      where item->>'sku' = v_sku limit 1;
    if v_variant is null then raise exception 'SKU is not available'; end if;
    v_unit_price := (v_variant->>'priceIdr')::bigint;
    v_unit_cost := (v_variant->>'costIdr')::bigint;
    if v_unit_price <> (v_item->>'expectedPriceIdr')::bigint then
      raise exception 'Product price changed; review the cart';
    end if;
    if v_unit_price <= 0 or v_unit_cost <= 0 or v_unit_cost > v_unit_price
      then raise exception 'Invalid SKU pricing'; end if;
    v_subtotal := v_subtotal + v_unit_price * v_qty;
    v_cost := v_cost + v_unit_cost * v_qty;
    v_quantity := v_quantity + v_qty;
  end loop;

  v_customer_snapshot := jsonb_build_object(
    'account_id',v_customer,'account_type','PERSON',
    'display_name',btrim(p_name),'primary_phone',p_phone,
    'primary_email',nullif(lower(coalesce(p_email,'')),'')
  );
  v_pickup_snapshot := jsonb_build_object(
    'recipient_name',btrim(p_name),'phone',p_phone,
    'address_type','PICKUP_STORE','street','WORKSHOP_PICKUP',
    'city','SELF_PICKUP'
  );

  -- A new, isolated guest customer account avoids merging unrelated contacts.
  insert into app.customer_accounts(id,organization_id,account_type,display_name,
    primary_phone,primary_email,status)
    values (v_customer,p_org,'PERSON',btrim(p_name),p_phone,
      nullif(lower(coalesce(p_email,'')),''),'ACTIVE');
  insert into app.customer_brand_relationships(
    customer_account_id,brand_id,customer_segment,relationship_status
  ) values(v_customer,p_brand,'STANDARD','ACTIVE');

  v_order_number := app.generate_document_number(p_org,p_brand,'O');
  insert into app.orders(
    id,organization_id,brand_id,customer_account_id,order_type,order_number,
    status,currency,subtotal,discount_total,shipping_total,grand_total,
    estimated_cost_total,estimated_gross_profit,customer_snapshot,
    shipping_address_snapshot,payment_terms_snapshot,created_by_user_id,
    request_id,request_payload
  ) values(
    v_order,p_org,p_brand,v_customer,'RETAIL_DIRECT',v_order_number,
    'DRAFT','IDR',v_subtotal,0,0,v_subtotal,v_cost,v_subtotal-v_cost,
    v_customer_snapshot,v_pickup_snapshot,
    jsonb_build_object('terms','MANUAL_PAYMENT_PENDING','fulfillment','WORKSHOP_PICKUP'),
    p_actor,p_request,
    jsonb_build_object('source','TEESTOCK_WEB','fingerprint',v_fingerprint,
      'fulfillment','WORKSHOP_PICKUP','unit_count',v_quantity)
  );

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_slug := v_item->>'slug';
    v_sku := v_item->>'sku';
    v_qty := (v_item->>'quantity')::integer;
    select * into v_product from app.teestock_catalog_products
      where organization_id = p_org and brand_id = p_brand and slug = v_slug;
    select item into v_variant from jsonb_array_elements(v_product.variants) item
      where item->>'sku' = v_sku limit 1;
    v_unit_price := (v_variant->>'priceIdr')::bigint;
    insert into app.order_items(
      order_id,position,description,quantity,unit,unit_price,discount_total,
      subtotal,specification_snapshot
    ) values(
      v_order,v_position,v_product.title,v_qty,'PCS',v_unit_price,0,
      v_unit_price*v_qty,
      jsonb_build_object('sku',v_sku,'product_slug',v_slug,
        'size',v_variant->>'size','color',v_variant->>'color',
        'made_to_order',true,'source','TEESTOCK_WEB')
    );
    v_position := v_position + 1;
  end loop;

  -- Financial record is issued but remains 100% unpaid: only MGBOS owner/admin
  -- payment recording may later settle the invoice, never this checkout RPC.
  v_invoice_number := app.generate_document_number(p_org,p_brand,'INV');
  insert into app.invoices(
    id,organization_id,brand_id,order_id,customer_account_id,invoice_number,
    invoice_type,status,currency,amount_subtotal,amount_tax,amount_shipping,
    amount_total,amount_paid,balance_due,due_date,issued_at,
    customer_snapshot,payment_instructions,notes,created_by_user_id
  ) values (
    v_invoice,p_org,p_brand,v_order,v_customer,v_invoice_number,
    'FULL_PAYMENT','ISSUED','IDR',v_subtotal,0,0,v_subtotal,0,v_subtotal,
    (now() at time zone 'Asia/Jakarta')::date + 3,now(),
    v_customer_snapshot,
    'Instruksi pembayaran resmi belum tersedia. Jangan transfer sebelum menerima konfirmasi toko.',
    'Checkout publik TeeStock — pengambilan mandiri, belum lunas',p_actor
  );
  insert into app.invoice_items(invoice_id,order_item_id,description,quantity,
    unit_price,subtotal,notes)
    select v_invoice,oi.id,oi.description,oi.quantity,oi.unit_price,
      oi.subtotal,'TeeStock web order — paid only after manual reconciliation'
    from app.order_items oi where oi.order_id = v_order;
  insert into app.order_audit(organization_id,order_id,actor_id,action,details)
    values (p_org,v_order,p_actor,'order.guest_checkout_created',
      jsonb_build_object('source','TEESTOCK_WEB','payment','UNPAID',
        'reservation','NONE','fulfillment','WORKSHOP_PICKUP'));
  insert into app.invoice_audit(organization_id,invoice_id,actor_id,action,details)
    values (p_org,v_invoice,p_actor,'invoice.issued',
      jsonb_build_object('source','TEESTOCK_WEB','payment','UNPAID'));

  return jsonb_build_object('order_number',v_order_number,
    'total_idr',v_subtotal,'is_retry',false);
end;
$$;
revoke all on function app.create_teestock_guest_order(uuid,uuid,uuid,uuid,text,text,text,jsonb,text)
  from public, anon, authenticated;
grant execute on function app.create_teestock_guest_order(uuid,uuid,uuid,uuid,text,text,text,jsonb,text)
  to service_role;

-- No guest web order may enter confirmed/active production before an actual
-- fully reconciled paid invoice exists. This also protects admin transitions.
create function app.teestock_guest_order_payment_guard()
returns trigger language plpgsql set search_path = '' as $$
begin
  if old.request_payload->>'source' = 'TEESTOCK_WEB'
    and new.status in ('CONFIRMED','ACTIVE','ON_HOLD','COMPLETED')
    and old.status is distinct from new.status
    and not exists(
      select 1 from app.invoices inv
      where inv.order_id = old.id and inv.organization_id = old.organization_id
        and inv.status = 'PAID' and inv.amount_paid = inv.amount_total
        and inv.balance_due = 0
    )
  then raise exception 'Web order cannot advance before manual payment is recorded'; end if;
  return new;
end;
$$;
create trigger teestock_guest_order_payment_before_status
before update of status on app.orders for each row
execute function app.teestock_guest_order_payment_guard();

-- The production RPC previously only excluded CANCELLED orders, so a
-- separate table-level gate blocks premature production jobs for WEB orders.
create function app.teestock_guest_production_guard()
returns trigger language plpgsql set search_path = '' as $$
begin
  if exists (
    select 1 from app.orders ord
    where ord.id = new.order_id and ord.organization_id = new.organization_id
      and ord.request_payload->>'source' = 'TEESTOCK_WEB'
      and (
        ord.status not in ('CONFIRMED','ACTIVE','ON_HOLD')
        or not exists (
          select 1 from app.invoices inv
          where inv.order_id = ord.id and inv.organization_id = ord.organization_id
            and inv.status = 'PAID' and inv.amount_paid = inv.amount_total
            and inv.balance_due = 0
        )
      )
  ) then raise exception 'Cannot start web order production before verified payment'; end if;
  return new;
end;
$$;
create trigger teestock_guest_production_before_insert
before insert on app.production_jobs for each row
execute function app.teestock_guest_production_guard();

revoke all on function app.teestock_guest_order_payment_guard() from public,anon,authenticated;
revoke all on function app.teestock_guest_production_guard() from public,anon,authenticated;
commit;
