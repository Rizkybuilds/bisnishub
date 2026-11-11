begin;
select plan(12);

create temporary table f01_ctx as
select
  (select id from app.organizations where code='multigraph-group') org,
  (select id from app.brands where code='TS' and organization_id=(select id from app.organizations where code='multigraph-group')) brand,
  (select id from app.users where email='founder@multigraph.id') actor,
  '{"slug":"f01-sample","title":"TeeStock F01 Test","collectionName":"TeeStock Selects","description":"Test product","mockupPath":null,"artworkPath":null,"rightsStatus":"PENDING","sampleStatus":"PENDING","status":"DRAFT","variants":[{"sku":"TS-F01-BLK-L","size":"L","color":"Black","priceIdr":159000,"costIdr":97000}]}'::jsonb payload;

select has_table('app','teestock_catalog_products','Catalog table exists');
select ok(not has_table_privilege('anon','app.teestock_catalog_products','SELECT'),'No anonymous catalog table access');
select ok(not has_table_privilege('authenticated','app.teestock_catalog_products','SELECT'),'No direct authenticated catalog access');
select ok(not has_function_privilege('anon','app.save_teestock_catalog_product(uuid,uuid,uuid,integer,jsonb)','EXECUTE'),'Anonymous write RPC blocked');

create temporary table f01_created as
select app.save_teestock_catalog_product(org,actor,null,0,payload) result from f01_ctx;
select ok((select (result->>'id') is not null from f01_created),'Owner creates draft');
select is((select status from app.teestock_catalog_products where id=(select (result->>'id')::uuid from f01_created)), 'DRAFT','New product is draft');

select throws_ok(format(
  $q$select app.save_teestock_catalog_product('%s'::uuid,'%s'::uuid,'%s'::uuid,1,%L::jsonb)$q$,
  (select org from f01_ctx),(select actor from f01_ctx),
  (select (result->>'id')::uuid from f01_created),
  (select (payload || '{"status":"PUBLISHED"}'::jsonb)::text from f01_ctx)
), 'P0001','Rights, sample, artwork, mockup, and costing required to publish','Unapproved product cannot publish');

select throws_ok(format(
  $q$select app.save_teestock_catalog_product('%s'::uuid,'%s'::uuid,null,0,%L::jsonb)$q$,
  (select org from f01_ctx),(select actor from f01_ctx),
  (select jsonb_set(payload,'{variants}',(payload->'variants')||(payload->'variants'))::text from f01_ctx)
), 'P0001','Duplicate variant SKU','Duplicate SKU blocked');

select throws_ok(format(
  $q$select app.save_teestock_catalog_product('%s'::uuid,'%s'::uuid,'%s'::uuid,1,%L::jsonb)$q$,
  (select org from f01_ctx),gen_random_uuid(),
  (select (result->>'id')::uuid from f01_created),
  (select payload::text from f01_ctx)
), 'P0001','Catalog write access denied','Unknown actor blocked');

create temporary table f01_ready as select payload || jsonb_build_object(
  'status','PUBLISHED','rightsStatus','APPROVED','sampleStatus','PASSED',
  'mockupPath', org::text||'/'||brand::text||'/'||gen_random_uuid()::text||'.png',
  'artworkPath',org::text||'/'||brand::text||'/'||gen_random_uuid()::text||'.pdf',
  'details', jsonb_build_object(
    'material','100% cotton after verified sampling',
    'fit','Regular fit',
    'care','Wash according to the garment sample test results.',
    'productionDays',3,
    'sizeChart',jsonb_build_array(jsonb_build_object('size','L','widthCm',54,'lengthCm',73))
  )
) ready from f01_ctx;

select is((
  select (app.save_teestock_catalog_product(
    (select org from f01_ctx),(select actor from f01_ctx),
    (select (result->>'id')::uuid from f01_created),1,(select ready from f01_ready)
  )->>'version')::integer
),2,'Approved product publishes with revision two');

select throws_ok(format(
  $q$select app.save_teestock_catalog_product('%s'::uuid,'%s'::uuid,'%s'::uuid,1,%L::jsonb)$q$,
  (select org from f01_ctx),(select actor from f01_ctx),
  (select (result->>'id')::uuid from f01_created),
  (select ready::text from f01_ready)
), 'P0001','Catalog record changed or unavailable','Stale revision denied');

select throws_ok(format(
  $q$select app.save_teestock_catalog_product('%s'::uuid,'%s'::uuid,'%s'::uuid,2,%L::jsonb)$q$,
  (select org from f01_ctx),(select actor from f01_ctx),
  (select (result->>'id')::uuid from f01_created),
  (select (ready || jsonb_build_object('mockupPath',gen_random_uuid()::text||'/'||brand::text||'/'||gen_random_uuid()::text||'.png'))::text
   from f01_ready,f01_ctx)
), 'P0001','Asset belongs to another organization or brand','Cross-organization media cannot publish');

select * from finish();
rollback;
