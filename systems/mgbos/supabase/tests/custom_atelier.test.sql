begin;
select plan(13);
create temporary table atelier_fixture as select
 (select id from app.organizations where code='multigraph-group') org,
 (select id from app.brands where code='TS') brand,
 (select id from app.users where email='founder@multigraph.id') actor,
 '{"schemaCode": "teestock.custom_atelier.v1", "garment": {"type": "T-Shirt", "fit": "Regular", "material": "Cotton Combed 24s", "color": "Hitam", "gsm": null, "blankPreference": ""}, "sizes": {"S": 1, "M": 2, "L": 3, "XL": 3, "XXL": 1}, "decorations": [{"location": "Front", "method": "DTF", "widthCm": 20, "heightCm": 30, "colors": null, "artworkReference": "design-v1", "notes": ""}], "customization": "Polybag satuan"}'::jsonb spec;
create function pg_temp.save_atelier(s jsonb, qty integer default 10, brand_id uuid default null) returns jsonb language sql as $$
 select app.create_requirement_with_initial_version(p_organization_id=>org,p_brand_id=>coalesce(brand_id,brand),p_title=>'Atelier regression',p_summary=>'Kaos acara',p_quantity=>qty,p_specification=>s,p_actor_id=>actor) from atelier_fixture;
$$;
select lives_ok($q$select pg_temp.save_atelier(spec) from atelier_fixture$q$,'Valid atelier');
select lives_ok($q$select pg_temp.save_atelier(jsonb_set(spec,'{sizes}','null')) from atelier_fixture$q$,'Unknown sizes permitted');
select throws_ok($q$select pg_temp.save_atelier(spec,11) from atelier_fixture$q$,'P0001','Size total must match requirement quantity','Mismatch rejected');
select throws_ok($q$select pg_temp.save_atelier(jsonb_set(spec,'{sizes,S}','-1')) from atelier_fixture$q$,'P0001','Invalid size quantity','Negative sizes rejected');
select throws_ok($q$select pg_temp.save_atelier(jsonb_set(spec,'{sizes,S}','0.5')) from atelier_fixture$q$,'P0001','Invalid size quantity','Fractional sizes rejected');
select throws_ok($q$select pg_temp.save_atelier(jsonb_set(spec,'{garment,material}','" "')) from atelier_fixture$q$,'P0001','Invalid garment text','Empty material rejected');
select throws_ok($q$select pg_temp.save_atelier(jsonb_set(spec,'{decorations}',jsonb_build_array(spec->'decorations'->0,spec->'decorations'->0))) from atelier_fixture$q$,'P0001','Duplicate decoration location','Duplicate rejected');
select throws_ok($q$select pg_temp.save_atelier(jsonb_set(spec,'{decorations,0,widthCm}','0')) from atelier_fixture$q$,'P0001','Invalid decoration dimension','Invalid dimension rejected');
select throws_ok($q$select pg_temp.save_atelier(spec,10,(select id from app.brands where code<>'TS' limit 1)) from atelier_fixture$q$,'P0001','Custom Atelier requires TeeStock brand','Other brand rejected');
select lives_ok($q$select pg_temp.save_atelier('{}')$q$,'Generic requirement remains valid');
create temporary table saved_atelier as select pg_temp.save_atelier(spec) result from atelier_fixture;
select lives_ok($q$select app.create_new_requirement_version(p_organization_id=>org,p_requirement_id=>(result->>'requirement_id')::uuid,p_summary=>'Revisi bahan',p_quantity=>10,p_specification=>jsonb_set(spec,'{garment,material}','"Cotton Combed 30s"'),p_actor_id=>actor) from atelier_fixture,saved_atelier$q$,'New atelier revision saves');
select is((select specification->'garment'->>'material' from app.requirement_versions where id=(select (result->>'version_id')::uuid from saved_atelier)),'Cotton Combed 24s','Original snapshot preserved');
select is((select specification->'garment'->>'material' from app.requirement_versions where requirement_id=(select (result->>'requirement_id')::uuid from saved_atelier) and version_number=2),'Cotton Combed 30s','New version contains changed material');
select * from finish();
rollback;
