begin;
select plan(33);
create temporary table quote_ctx as select
 (select id from app.organizations where code='multigraph-group') org,
 (select id from app.brands where code='TS') brand,
 (select id from app.users where email='founder@multigraph.id') actor,
 (select id from app.customer_accounts where status='ACTIVE' limit 1) customer;
create temporary table quote_req as select app.create_requirement_with_initial_version(p_organization_id=>org,p_brand_id=>brand,p_title=>'Quote regression',p_summary=>'Custom event shirts',p_customer_account_id=>customer,p_quantity=>10,p_actor_id=>actor) result from quote_ctx;
create function pg_temp.make_quote(price bigint,cost bigint,shipping bigint default 0,discount bigint default 0,request uuid default gen_random_uuid(),qid uuid default null,expected uuid default null) returns jsonb language sql as $$
 select app.save_quote_version(org,actor,request,(result->>'version_id')::uuid,customer,price,discount,shipping,jsonb_build_array(jsonb_build_object('cost_type','GARMENT','description','Cost estimate','quantity',1,'unit_cost',cost::text)),current_date+7,'DP 50 percent','7 working days','',qid,expected) from quote_ctx,quote_req;
$$;
create temporary table quote_base as select pg_temp.make_quote(100000,900000,500000,0,'99999999-0000-4000-8000-000000000001') result;
select is((select pricing_guard from app.quote_versions where id=(select (result->>'version_id')::uuid from quote_base)),'APPROVAL_REQUIRED','Customer shipping excluded from margin');
select is(pg_temp.make_quote(100000,900000,500000,0,'99999999-0000-4000-8000-000000000001'),(select result from quote_base),'Create retry returns same version');
select throws_ok($q$select pg_temp.make_quote(100001,900000,500000,0,'99999999-0000-4000-8000-000000000001')$q$,'P0001','Request ID was already used for different data','Cannot reuse token with changed payload');
select throws_ok($q$select app.mark_quote_sent(org,actor,(result->>'version_id')::uuid) from quote_ctx,quote_base$q$,'P0001','Requirement must be current and READY or LOCKED','Draft requirement prevents send');
select app.transition_requirement_status(org,(result->>'requirement_id')::uuid,'READY',actor) from quote_ctx,quote_req;
select throws_ok($q$select app.mark_quote_sent(org,actor,(result->>'version_id')::uuid) from quote_ctx,quote_base$q$,'P0001','Owner approval required below 20 percent margin','Floor cannot be bypassed');
select throws_ok($q$select app.approve_quote_price(org,actor,(result->>'version_id')::uuid,'') from quote_ctx,quote_base$q$,'P0001','Approval reason must contain 5 to 2000 characters','Reason required');
insert into app.users(id,name,email) values('99999999-0000-4000-8000-000000000099','Quote Sales Test','quote-sales-test@local.invalid');
insert into app.organization_members(organization_id,user_id,role_id) select org,'99999999-0000-4000-8000-000000000099',(select id from app.roles where organization_id=org and code='SALES') from quote_ctx;
select throws_ok($q$select app.approve_quote_price(org,'99999999-0000-4000-8000-000000000099',(result->>'version_id')::uuid,'Strategic account') from quote_ctx,quote_base$q$,'P0001','Only OWNER may approve pricing override','Sales cannot approve own discount');
select lives_ok($q$select app.approve_quote_price(org,actor,(result->>'version_id')::uuid,'Strategic account pilot') from quote_ctx,quote_base$q$,'Owner approves exact version');
select lives_ok($q$select app.approve_quote_price(org,actor,(result->>'version_id')::uuid,'Strategic account pilot') from quote_ctx,quote_base$q$,'Approval retry is safe');
select is((select count(*)::integer from app.quote_price_approvals where quote_version_id=(select (result->>'version_id')::uuid from quote_base)),1,'One approval only');
select lives_ok($q$select app.mark_quote_sent(org,actor,(result->>'version_id')::uuid) from quote_ctx,quote_base$q$,'Approved quote can be sent');
select is((select status from app.requirements where id=(select (result->>'requirement_id')::uuid from quote_req)),'LOCKED','Send locks source requirement atomically');
select lives_ok($q$select app.mark_quote_sent(org,actor,(result->>'version_id')::uuid) from quote_ctx,quote_base$q$,'Send retry is safe');
select is((select count(*)::integer from app.quote_audit where quote_version_id=(select (result->>'version_id')::uuid from quote_base) and action='quote.sent'),1,'One sent audit only');
select throws_ok($q$update app.quote_versions set subtotal=subtotal+1 where id=(select (result->>'version_id')::uuid from quote_base)$q$,'P0001','Quote snapshot is immutable; create a revision','Commercial data immutable');
select throws_ok($q$update app.quote_cost_components set unit_cost=0 where quote_item_id in (select id from app.quote_items where quote_version_id=(select (result->>'version_id')::uuid from quote_base))$q$,'P0001','Quote history is append-only','Costs immutable');
create temporary table quote_revision as select pg_temp.make_quote(100000,950000,0,0,gen_random_uuid(),(result->>'quote_id')::uuid,(result->>'version_id')::uuid) result from quote_base;
select is((select status from app.quote_versions where id=(select (result->>'version_id')::uuid from quote_base)),'SUPERSEDED','Revision supersedes previous sent version');
select is((select status from app.quote_versions where id=(select (result->>'version_id')::uuid from quote_revision)),'DRAFT','New revision starts draft');
select throws_ok($q$select app.mark_quote_sent(org,actor,(result->>'version_id')::uuid) from quote_ctx,quote_revision$q$,'P0001','Owner approval required below 20 percent margin','Approval does not carry to revision');
select throws_ok($q$select pg_temp.make_quote(100000,800000,0,0,gen_random_uuid(),(result->>'quote_id')::uuid,(result->>'version_id')::uuid) from quote_base$q$,'P0001','Quote changed; reload before revising','Stale revision rejected');
create temporary table thresholds as select
 (pg_temp.make_quote(100000,800000)->>'version_id')::uuid exact20,
 (pg_temp.make_quote(100000,750000)->>'version_id')::uuid exact25,
 (pg_temp.make_quote(100000,700000)->>'version_id')::uuid exact30,
 (pg_temp.make_quote(100000,800001)->>'version_id')::uuid below20,
 (pg_temp.make_quote(100000,800000,0,100000)->>'version_id')::uuid discounted;
select is((select pricing_guard from app.quote_versions where id=(select exact20 from thresholds)),'WARNING','Exactly 20 percent needs no override');
select is((select pricing_guard from app.quote_versions where id=(select exact25 from thresholds)),'CAUTION','Exactly 25 percent');
select is((select pricing_guard from app.quote_versions where id=(select exact30 from thresholds)),'TARGET','Exactly 30 percent');
select is((select pricing_guard from app.quote_versions where id=(select below20 from thresholds)),'APPROVAL_REQUIRED','Unrounded fractional boundary enforced');
select is((select pricing_guard from app.quote_versions where id=(select discounted from thresholds)),'APPROVAL_REQUIRED','Discount reduces net revenue');
select ok(not has_function_privilege('authenticated','app.mark_quote_sent(uuid,uuid,uuid)','EXECUTE'),'Browser role cannot call privileged commands');
select ok(not has_table_privilege('service_role','app.quote_versions','UPDATE'),'Service role cannot bypass command guard by direct update');
select throws_ok($q$select app.mark_quote_sent(org,null,(result->>'version_id')::uuid) from quote_ctx,quote_revision$q$,'P0001','Active organization membership required','Missing actor rejected');
select throws_ok($q$delete from app.quote_price_approvals$q$,'P0001','Quote history is append-only','Approval audit retained');
select throws_ok($q$select pg_temp.make_quote(100000,0)$q$,'P0001','Invalid net revenue or estimated cost','Zero HPP rejected');
select is((select issuer_snapshot->>'brand_name' from app.quote_versions where id=(select (result->>'version_id')::uuid from quote_base)),(select name from app.brands where id=(select brand from quote_ctx)),'Issuer captured at version creation');
update app.brands set name='Changed Brand For Test' where id=(select brand from quote_ctx);
select isnt((select issuer_snapshot->>'brand_name' from app.quote_versions where id=(select (result->>'version_id')::uuid from quote_base)),'Changed Brand For Test','Issuer history survives rename');
select throws_ok($q$update app.quote_versions set issuer_snapshot='{}' where id=(select (result->>'version_id')::uuid from quote_base)$q$,'P0001','Quote snapshot is immutable; create a revision','Issuer cannot be rewritten');
select * from finish();
rollback;
