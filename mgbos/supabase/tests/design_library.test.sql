begin;
select plan(16);
create temporary table design_context as select
 (select id from app.organizations where code='multigraph-group') org,
 (select id from app.users where email='founder@multigraph.id') actor,
 gen_random_uuid() request,
 '{"code":"DEMO-TEST","title":"Studio Hours","theme":"CREATIVE","story":"Synthetic","placement":"FRONT"}'::jsonb data;
create temporary table design_result as select app.save_demo_design(org,actor,request,null,0,data) id from design_context;
select is((select count(*)::int from app.design_asset_versions where asset_id=(select id from design_result)),1,'Create initial snapshot');
select is((select app.save_demo_design(org,actor,request,null,0,data) from design_context),(select id from design_result),'Retry returns same asset');
select throws_ok($$select app.save_demo_design(org,actor,request,null,0,data||'{"title":"Changed"}') from design_context$$,'P0001','Request payload mismatch','Retry with changed payload fails');
select lives_ok($$select app.save_demo_design(org,actor,gen_random_uuid(),id,1,data||'{"title":"Revision two"}') from design_context,design_result$$,'Append revision');
select is((select current_version from app.design_assets where id=(select id from design_result)),2,'Current pointer advanced');
select is((select title from app.design_asset_versions where asset_id=(select id from design_result) and version_number=1),'Studio Hours','Old snapshot preserved');
select throws_ok($$select app.save_demo_design(org,actor,gen_random_uuid(),id,1,data) from design_context,design_result$$,'P0001','Design changed; reload before revising','Stale revision blocked');
select throws_ok($$update app.design_asset_versions set title='Overwrite' where asset_id=(select id from design_result)$$,'P0001','Design history is immutable','Version mutation blocked');
select throws_ok($$delete from app.design_assets where id=(select id from design_result)$$,'P0001','Design history is immutable','Deletion blocked');
select throws_ok($$select app.save_demo_design(gen_random_uuid(),actor,gen_random_uuid(),id,2,data) from design_context,design_result$$,'P0001','Active organization membership required','Cross organization denied');
select throws_ok($$select app.save_demo_design(org,actor,gen_random_uuid(),null,0,data||'{"code":"LIVE-01"}') from design_context$$,'P0001','Invalid design metadata','Unlabeled live records blocked');
select ok(not has_table_privilege('authenticated','app.design_assets','SELECT'),'Authenticated cannot read private data directly');
select ok(not has_function_privilege('anon','app.save_demo_design(uuid,uuid,uuid,uuid,integer,jsonb)','EXECUTE'),'Anonymous command denied');
select ok(not has_table_privilege('service_role','app.design_assets','UPDATE'),'Service cannot bypass command');
update app.organization_members set role_id=(select id from app.roles where code='SALES' and organization_id=(select org from design_context)) where user_id=(select actor from design_context) and organization_id=(select org from design_context);
select throws_ok($$select app.save_demo_design(org,actor,gen_random_uuid(),id,2,data) from design_context,design_result$$,'P0001','Design access denied','Sales cannot edit designs');
select is((select count(*)::int from app.design_asset_versions where asset_id=(select id from design_result)),2,'Failures leave no partial revisions');
select * from finish();
rollback;
