begin;
select plan(18);

create temporary table f03_context as
select
 (select id from app.organizations where code='multigraph-group') org,
 (select id from app.brands where code='TS' and organization_id=
  (select id from app.organizations where code='multigraph-group')) brand,
 (select id from app.users where email='founder@multigraph.id') actor;

select has_table('app','teestock_checkout_rate_buckets','Checkout rate limit buckets exist');
select has_function('app','create_teestock_guest_order',
  array['uuid','uuid','uuid','uuid','text','text','text','jsonb','text'],
  'Guest order function exists');
select ok(not has_function_privilege('anon',
  'app.create_teestock_guest_order(uuid,uuid,uuid,uuid,text,text,text,jsonb,text)',
  'EXECUTE'),'Anon cannot call checkout RPC directly');
select ok(not has_function_privilege('authenticated',
  'app.create_teestock_guest_order(uuid,uuid,uuid,uuid,text,text,text,jsonb,text)',
  'EXECUTE'),'Authenticated users cannot call checkout RPC directly');
select ok(not has_table_privilege('anon',
  'app.teestock_checkout_rate_buckets','SELECT'),
  'Rate limit state is not publicly readable');

create temporary table f03_product as
select app.save_teestock_catalog_product(
  org,actor,null,0,jsonb_build_object(
    'slug','f03-test-pickup','title','F03 Verified Test Tee',
    'collectionName','TeeStock Selects',
    'description','Studio sampled made-to-order T-shirt',
    'rightsStatus','APPROVED','sampleStatus','PASSED','status','PUBLISHED',
    'mockupPath',org::text||'/'||brand::text||'/'||gen_random_uuid()::text||'.png',
    'artworkPath',org::text||'/'||brand::text||'/'||gen_random_uuid()::text||'.pdf',
    'variants',jsonb_build_array(
      jsonb_build_object('sku','TS-F03-BLK-L','size','L','color','Black',
        'priceIdr',169000,'costIdr',97000)
    ),
    'details',jsonb_build_object(
      'material','100% verified cotton',
      'fit','Regular fit',
      'care','Wash inside out based on sample care guidance.',
      'productionDays',3,
      'sizeChart',jsonb_build_array(
        jsonb_build_object('size','L','widthCm',54,'lengthCm',73)
      )
    )
  )
) result from f03_context;

create temporary table f03_input as
select
 gen_random_uuid() request_id,
 jsonb_build_array(jsonb_build_object(
   'slug','f03-test-pickup','sku','TS-F03-BLK-L',
   'quantity',2,'expectedPriceIdr',169000
 )) cart,
 repeat('a',64) rate_key;

create temporary table f03_order as
select app.create_teestock_guest_order(
  c.org,c.brand,c.actor,i.request_id,
  'Checkout Test','081234567891','shop@example.test',i.cart,i.rate_key
) result
from f03_context c cross join f03_input i;

select ok((select (result->>'order_number') like 'TS-O-%' from f03_order),
  'Checkout returns canonical TeeStock order number');
select is((select (result->>'total_idr')::bigint from f03_order),338000::bigint,
  'Checkout charges trusted catalog unit price and quantity');
select is((
  select status from app.orders
  where order_number=(select result->>'order_number' from f03_order)
),'DRAFT','Guest order remains in draft instead of automatic confirmation');
select is((
  select balance_due from app.invoices
  where order_id=(select id from app.orders
    where order_number=(select result->>'order_number' from f03_order))
),338000::bigint,'Invoice remains wholly unpaid');
select is((
  select count(*)::integer from app.inventory_reservations
  where order_id=(select id from app.orders
    where order_number=(select result->>'order_number' from f03_order))
),0,'Unpaid checkout does not reserve warehouse stock');
select is((
  select specification_snapshot->>'sku' from app.order_items
  where order_id=(select id from app.orders
    where order_number=(select result->>'order_number' from f03_order))
),'TS-F03-BLK-L','Order line snapshots the exact SKU');

select is((
  select (app.create_teestock_guest_order(
    c.org,c.brand,c.actor,i.request_id,
    'Checkout Test','081234567891','shop@example.test',i.cart,i.rate_key
  )->>'is_retry')::boolean
  from f03_context c cross join f03_input i
),true,'Retry returns existing order without recharging');

select throws_ok(format(
  $q$select app.create_teestock_guest_order('%s'::uuid,'%s'::uuid,
    '%s'::uuid,'%s'::uuid,'Another Name','081234567891','shop@example.test',
    %L::jsonb,%L)$q$,
  (select org from f03_context),(select brand from f03_context),
  (select actor from f03_context),(select request_id from f03_input),
  (select cart::text from f03_input),(select rate_key from f03_input)
),'P0001','Checkout request token was already used','Changed replay is rejected');

select throws_ok(format(
  $q$select app.create_teestock_guest_order('%s'::uuid,'%s'::uuid,
    '%s'::uuid,'%s'::uuid,'Checkout Test','081234567891','shop@example.test',
    %L::jsonb,%L)$q$,
  (select org from f03_context),(select brand from f03_context),
  (select actor from f03_context),gen_random_uuid(),
  (select jsonb_set(cart,'{0,expectedPriceIdr}','1000'::jsonb)::text from f03_input),
  (select rate_key from f03_input)
),'P0001','Product price changed; review the cart',
  'Client cannot create order at forged price');

select throws_ok(format(
  $q$select app.create_teestock_guest_order('%s'::uuid,'%s'::uuid,
    '%s'::uuid,'%s'::uuid,'Checkout Test','081234567891','shop@example.test',
    %L::jsonb,%L)$q$,
  (select org from f03_context),(select brand from f03_context),
  gen_random_uuid(),gen_random_uuid(),
  (select cart::text from f03_input),(select rate_key from f03_input)
),'P0001','Checkout configuration is not authorized','Unknown server actor blocked');

select throws_ok(format(
  $q$select app.transition_order_status('%s'::uuid,'%s'::uuid,'%s'::uuid,'CONFIRMED','Paid pending')$q$,
  (select org from f03_context),(select actor from f03_context),
  (select id from app.orders where order_number=
    (select result->>'order_number' from f03_order))
),'P0001','Web order cannot advance before manual payment is recorded',
  'Unpaid guest order cannot transition to confirmed');

select throws_ok(format(
  $q$select app.create_production_job('%s'::uuid,'%s'::uuid,'%s'::uuid,
     'GARMENT','Premature Print Job')$q$,
  (select org from f03_context),(select actor from f03_context),
  (select id from app.orders where order_number=
    (select result->>'order_number' from f03_order))
),'P0001','Cannot start web order production before verified payment',
  'Premature production job creation blocked');

select is((
  select count(*)::integer from app.customer_accounts
  where id=(select customer_account_id from app.orders
    where order_number=(select result->>'order_number' from f03_order))
),1,'Checkout created one canonical customer record');

select is((
  select count(*)::integer from app.payments p
  where p.organization_id=(select org from f03_context)
    and p.created_at >= (select min(created_at) from app.orders
      where order_number=(select result->>'order_number' from f03_order))
    and p.notes like '%f03-test-pickup%'
),0,'Guest checkout does not create a payment');

select * from finish();
rollback;
