
begin;
select plan(12);
create temporary table review_context as select
 (select id from app.organizations where code='multigraph-group') org,
 (select id from app.brands where code='TS') brand,
 (select id from app.users where email='founder@multigraph.id') actor;
create temporary table review_req as
 select app.create_requirement_with_initial_version(
 p_organization_id=>org,p_brand_id=>brand,p_title=>'Regression requirement',
 p_summary=>'Snapshot original',p_quantity=>10,p_actor_id=>actor) result from review_context;
select lives_ok($q$select app.transition_requirement_status(org,(result->>'requirement_id')::uuid,'READY',actor) from review_context,review_req$q$,'Ready with positive quantity');
select throws_ok($q$select app.transition_requirement_status(org,(result->>'requirement_id')::uuid,'LOCKED',actor) from review_context,review_req$q$,
 'P0001','Use lock_requirement_version to lock the active version','Direct lock is rejected');
select lives_ok($q$select app.lock_requirement_version(org,(result->>'version_id')::uuid,'Approved snapshot',actor) from review_context,review_req$q$,'Lock current version');
select throws_ok($q$update app.requirement_versions set is_locked=false where id=(select (result->>'version_id')::uuid from review_req)$q$,
 'P0001','Cannot modify locked requirement version (immutable commercial snapshot)','Cannot unlock');
select throws_ok($q$update app.requirement_versions set currency='USD' where id=(select (result->>'version_id')::uuid from review_req)$q$,
 'P0001','Cannot modify locked requirement version (immutable commercial snapshot)','Currency immutable');
select throws_ok($q$delete from app.requirement_versions where id=(select (result->>'version_id')::uuid from review_req)$q$,
 'P0001','Requirement history cannot be deleted','History cannot be removed');
select lives_ok($q$select app.create_new_requirement_version(p_organization_id=>org,p_requirement_id=>(result->>'requirement_id')::uuid,p_summary=>'Revision two',p_quantity=>20,p_actor_id=>actor) from review_context,review_req$q$,'Revision succeeds');
select is((select status from app.requirements where id=(select (result->>'requirement_id')::uuid from review_req)),'DRAFT','Revision must be reviewed anew');
select lives_ok($q$select app.lock_requirement_version(org,(result->>'version_id')::uuid,'Retry old snapshot',actor) from review_context,review_req$q$,'Repeated historical lock is safe');
select is((select status from app.requirements where id=(select (result->>'requirement_id')::uuid from review_req)),'DRAFT','Historical lock does not lock active version');
select throws_ok($q$select app.create_new_requirement_version(p_organization_id=>org,p_requirement_id=>(result->>'requirement_id')::uuid,p_summary=>'Missing actor') from review_context,review_req$q$,
 'P0001','Actor is required','Actor is mandatory');
select throws_ok($q$update app.requirement_versions set summary='Overwrite draft' where requirement_id=(select (result->>'requirement_id')::uuid from review_req) and version_number=2$q$,
 'P0001','Requirement snapshot is immutable; create a new version','Even unlocked revisions remain snapshots');
select * from finish();
rollback;
