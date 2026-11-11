begin;
select plan(8);

create temporary table f02_context as
select
  (select id from app.organizations where code='multigraph-group') org,
  (select id from app.brands where code='TS' and organization_id=
    (select id from app.organizations where code='multigraph-group')) brand,
  (select id from app.users where email='founder@multigraph.id') actor,
  '{"slug":"f02-verified-tee","title":"F02 Verified Tee","collectionName":"The Edit","description":"A verified sample","status":"DRAFT","rightsStatus":"PENDING","sampleStatus":"PENDING","mockupPath":null,"artworkPath":null,"variants":[{"sku":"TS-F02-BLK-M","size":"M","color":"Black","priceIdr":159000,"costIdr":97000},{"sku":"TS-F02-BLK-L","size":"L","color":"Black","priceIdr":169000,"costIdr":98000}]}'::jsonb payload;

select has_column('app','teestock_catalog_products','details','Product details are persisted');

create temporary table f02_created as
select app.save_teestock_catalog_product(org,actor,null,0,payload) result
from f02_context;
select is((select status from app.teestock_catalog_products where id=
  (select (result->>'id')::uuid from f02_created)),
  'DRAFT','Incomplete product can be saved as draft');

create temporary table f02_uploads as
select payload || jsonb_build_object(
  'status','PUBLISHED',
  'rightsStatus','APPROVED',
  'sampleStatus','PASSED',
  'mockupPath',org::text||'/'||brand::text||'/'||gen_random_uuid()::text||'.png',
  'artworkPath',org::text||'/'||brand::text||'/'||gen_random_uuid()::text||'.pdf'
) payload from f02_context;

select throws_ok(format(
  $q$select app.save_teestock_catalog_product('%s'::uuid,'%s'::uuid,'%s'::uuid,1,%L::jsonb)$q$,
  (select org from f02_context),(select actor from f02_context),
  (select (result->>'id')::uuid from f02_created),
  (select payload::text from f02_uploads)
), 'P0001','Verified product details required to publish','Cannot publish without measurements');

create temporary table f02_verified as select payload || jsonb_build_object(
  'details', jsonb_build_object(
    'material','100% cotton combed 24s',
    'fit','Regular fit',
    'care','Gentle wash inside out according to sample.',
    'productionDays',3,
    'sizeChart',jsonb_build_array(
      jsonb_build_object('size','M','widthCm',52,'lengthCm',70),
      jsonb_build_object('size','L','widthCm',54,'lengthCm',73)
    )
  )
) payload from f02_uploads;

select throws_ok(format(
  $q$select app.save_teestock_catalog_product('%s'::uuid,'%s'::uuid,'%s'::uuid,1,%L::jsonb)$q$,
  (select org from f02_context),(select actor from f02_context),
  (select (result->>'id')::uuid from f02_created),
  (select jsonb_set(payload,'{details,sizeChart}',jsonb_build_array(
    jsonb_build_object('size','M','widthCm',52,'lengthCm',70)))::text from f02_verified)
), 'P0001','Size chart must cover all product variants','Missing L measurement blocks publish');

select throws_ok(format(
  $q$select app.save_teestock_catalog_product('%s'::uuid,'%s'::uuid,'%s'::uuid,1,%L::jsonb)$q$,
  (select org from f02_context),(select actor from f02_context),
  (select (result->>'id')::uuid from f02_created),
  (select jsonb_set(payload,'{details,productionDays}','0'::jsonb)::text from f02_verified)
), 'P0001','Invalid production estimate or size chart','Zero-day production claim blocked');

select throws_ok(format(
  $q$select app.save_teestock_catalog_product('%s'::uuid,'%s'::uuid,'%s'::uuid,1,%L::jsonb)$q$,
  (select org from f02_context),(select actor from f02_context),
  (select (result->>'id')::uuid from f02_created),
  (select jsonb_set(payload,'{details,sizeChart,0,widthCm}','12'::jsonb)::text from f02_verified)
), 'P0001','Physical measurements out of range','Implausible chest width blocked');

select is((
  select (app.save_teestock_catalog_product(
    (select org from f02_context),
    (select actor from f02_context),
    (select (result->>'id')::uuid from f02_created),
    1,(select payload from f02_verified)
  )->>'version')::integer
),2,'Fully verified product can be published');

select is((select details->>'material' from app.teestock_catalog_products
  where id=(select (result->>'id')::uuid from f02_created)),
  '100% cotton combed 24s','Verified garment details persist');

select * from finish();
rollback;
