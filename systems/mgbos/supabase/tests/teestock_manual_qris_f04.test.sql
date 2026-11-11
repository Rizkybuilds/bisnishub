begin;
select plan(16);

create temporary table f04_ctx as
select
  (select id from app.organizations where code='multigraph-group') org,
  (select id from app.brands where code='TS' and organization_id=
    (select id from app.organizations where code='multigraph-group')) brand,
  (select id from app.users where email='founder@multigraph.id') actor;

select has_table('app','teestock_qris_receipts','Owner-verification receipt table exists');
select has_function('app','confirm_teestock_qris_payment',
  array['uuid','uuid','uuid','bigint','text','text','boolean'],
  'Canonical owner-only QRIS confirmation function exists');
select ok(not has_function_privilege('anon',
  'app.confirm_teestock_qris_payment(uuid,uuid,uuid,bigint,text,text,boolean)',
  'EXECUTE'),'Anon cannot execute QRIS confirmation');
select ok(not has_function_privilege('authenticated',
  'app.confirm_teestock_qris_payment(uuid,uuid,uuid,bigint,text,text,boolean)',
  'EXECUTE'),'Authenticated users cannot directly execute QRIS confirmation');
select ok(not has_table_privilege('anon','app.teestock_qris_receipts','SELECT'),
  'Private QRIS receipt records not visible to public');

create temporary table f04_product as
select app.save_teestock_catalog_product(org,actor,null,0,jsonb_build_object(
  'slug','f04-qris-tee',
  'title','F04 QRIS Test Tee','collectionName','Verified Collection',
  'description','Verified production sample',
  'status','PUBLISHED','rightsStatus','APPROVED','sampleStatus','PASSED',
  'mockupPath',org::text||'/'||brand::text||'/'||gen_random_uuid()::text||'.png',
  'artworkPath',org::text||'/'||brand::text||'/'||gen_random_uuid()::text||'.pdf',
  'variants',jsonb_build_array(jsonb_build_object('sku','TS-F04-BLK-L','size','L',
    'color','Black','priceIdr',175000,'costIdr',109000)),
  'details',jsonb_build_object('material','Verified 100% cotton',
    'fit','Regular fit','care','Wash carefully based on verified sample.',
    'productionDays',3,
    'sizeChart',jsonb_build_array(jsonb_build_object('size','L','widthCm',54,'lengthCm',72))
  )
)) product from f04_ctx;

create temporary table f04_order as
select app.create_teestock_guest_order(
  org,brand,actor,gen_random_uuid(),'Buyer F04','081234567891','',
  jsonb_build_array(jsonb_build_object('slug','f04-qris-tee','sku','TS-F04-BLK-L',
    'quantity',1,'expectedPriceIdr',175000)),repeat('b',64)
) result from f04_ctx;

create temporary table f04_inv as
select id, organization_id, brand_id, customer_account_id, order_id
from app.invoices where order_id = (
  select id from app.orders
  where order_number = (select result->>'order_number' from f04_order)
);

select is((select status from app.invoices where id=(select id from f04_inv)),
  'ISSUED','New website invoice starts unpaid');

select throws_ok(format(
  $q$select app.confirm_teestock_qris_payment('%s','%s','%s',175000,
  'Test QRIS Merchant','MERCHANT-RRN-123',false)$q$,
  (select org from f04_ctx),(select actor from f04_ctx),(select id from f04_inv)
),'P0001','Merchant settlement verification is required',
  'Unverified owner attestation is rejected');

select throws_ok(format(
  $q$select app.confirm_teestock_qris_payment('%s','%s','%s',175001,
  'Test QRIS Merchant','MERCHANT-RRN-123',true)$q$,
  (select org from f04_ctx),(select actor from f04_ctx),(select id from f04_inv)
),'P0001','Invoice must be wholly unpaid and amount must match',
  'Extra one rupiah cannot be silently marked paid');

select throws_ok(format(
  $q$select app.confirm_teestock_qris_payment('%s','%s','%s',175000,
  'Test QRIS Merchant','MERCHANT-RRN-123',true)$q$,
  (select org from f04_ctx),gen_random_uuid(),(select id from f04_inv)
),'P0001','Active organization membership required',
  'Unknown actor cannot approve QRIS');

select throws_ok(format(
  $q$select app.record_payment_and_allocate(
    p_organization_id=>'%s'::uuid,p_actor_id=>'%s'::uuid,
    p_brand_id=>'%s'::uuid,p_payment_method=>'QRIS',p_amount=>175000,
    p_reference_number=>'BYPASS-RRN-001',
    p_allocations=>%L::jsonb
  )$q$,
  (select org from f04_ctx),(select actor from f04_ctx),
  (select brand from f04_ctx),
  (select jsonb_build_array(jsonb_build_object('invoice_id',id,'amount',175000))::text
   from f04_inv)
),'P0001','TeeStock QRIS payment requires verified merchant settlement',
  'Generic payment recording cannot bypass QRIS verification');

create temporary table f04_paid as
select app.confirm_teestock_qris_payment(
  (select org from f04_ctx),(select actor from f04_ctx),(select id from f04_inv),
  175000,'Test QRIS Merchant','MERCHANT-RRN-123',true
) result;

select is((select status from app.invoices where id=(select id from f04_inv)),
  'PAID','Verified merchant receipt settles canonical invoice');
select is((select balance_due from app.invoices where id=(select id from f04_inv)),
  0::bigint,'Invoice balance is zero after owner verification');
select is((select payment_method from app.payments
  where id=(select (result->>'payment_id')::uuid from f04_paid)),
  'QRIS','Canonical MGBOS payment is labeled QRIS');
select is((select merchant_reference from app.teestock_qris_receipts
  where invoice_id=(select id from f04_inv)),
  'MERCHANT-RRN-123','Receipt stores unique merchant transaction reference');
select is((select status from app.orders where id=(select order_id from f04_inv)),
  'DRAFT','Payment verification does not automatically start production');

select throws_ok(format(
  $q$select app.confirm_teestock_qris_payment('%s','%s','%s',175000,
  'Test QRIS Merchant','MERCHANT-RRN-123',true)$q$,
  (select org from f04_ctx),(select actor from f04_ctx),(select id from f04_inv)
),'P0001','Invoice must be wholly unpaid and amount must match',
  'Double confirmation of already-paid invoice is refused');

select * from finish();
rollback;
