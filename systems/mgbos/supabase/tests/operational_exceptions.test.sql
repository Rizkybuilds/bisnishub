begin;
select plan(84);

-- ============================================================================
-- 0. Schema Structure & Trust Boundary Verification (Blocking 1 & 2)
-- ============================================================================

select has_table('app', 'operational_exceptions', 'Table operational_exceptions exists');
select has_table('app', 'operational_exception_audit', 'Table operational_exception_audit exists');

select results_eq(
  $$ select relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='app' and c.relname='operational_exceptions' $$,
  $$ values(true) $$,
  'RLS is enabled on app.operational_exceptions'
);

select results_eq(
  $$ select relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='app' and c.relname='operational_exception_audit' $$,
  $$ values(true) $$,
  'RLS is enabled on app.operational_exception_audit'
);

-- Function execute privileges: authenticated role denied (Blocking 1)
select ok(not has_function_privilege('authenticated', 'app.open_operational_exception(uuid,uuid,uuid,text,text,text,text,uuid,text,text,text,text,uuid,text,timestamptz,text,jsonb)', 'EXECUTE'), 'authenticated denied EXECUTE on open_operational_exception');
select ok(not has_function_privilege('authenticated', 'app.acknowledge_operational_exception(uuid,uuid,uuid,uuid,bigint,text)', 'EXECUTE'), 'authenticated denied EXECUTE on acknowledge_operational_exception');
select ok(not has_function_privilege('authenticated', 'app.assign_operational_exception(uuid,uuid,uuid,uuid,bigint,text,uuid,text)', 'EXECUTE'), 'authenticated denied EXECUTE on assign_operational_exception');
select ok(not has_function_privilege('authenticated', 'app.reassign_operational_exception(uuid,uuid,uuid,uuid,bigint,text,uuid,text)', 'EXECUTE'), 'authenticated denied EXECUTE on reassign_operational_exception');
select ok(not has_function_privilege('authenticated', 'app.change_operational_exception_severity(uuid,uuid,uuid,uuid,bigint,text,text)', 'EXECUTE'), 'authenticated denied EXECUTE on change_operational_exception_severity');
select ok(not has_function_privilege('authenticated', 'app.resolve_operational_exception(uuid,uuid,uuid,uuid,bigint,text,text,jsonb,uuid)', 'EXECUTE'), 'authenticated denied EXECUTE on resolve_operational_exception');
select ok(not has_function_privilege('authenticated', 'app.dismiss_operational_exception(uuid,uuid,uuid,uuid,bigint,text,text,jsonb,uuid)', 'EXECUTE'), 'authenticated denied EXECUTE on dismiss_operational_exception');
select ok(not has_function_privilege('authenticated', 'app.reopen_operational_exception(uuid,uuid,uuid,uuid,bigint,text,jsonb)', 'EXECUTE'), 'authenticated denied EXECUTE on reopen_operational_exception');
select ok(not has_function_privilege('authenticated', 'app.operational_exception_actor_role(uuid,uuid)', 'EXECUTE'), 'authenticated denied EXECUTE on operational_exception_actor_role');

-- Function execute privileges: service_role granted
select ok(has_function_privilege('service_role', 'app.open_operational_exception(uuid,uuid,uuid,text,text,text,text,uuid,text,text,text,text,uuid,text,timestamptz,text,jsonb)', 'EXECUTE'), 'service_role granted EXECUTE on open_operational_exception');
select ok(has_function_privilege('service_role', 'app.acknowledge_operational_exception(uuid,uuid,uuid,uuid,bigint,text)', 'EXECUTE'), 'service_role granted EXECUTE on acknowledge_operational_exception');
select ok(has_function_privilege('service_role', 'app.assign_operational_exception(uuid,uuid,uuid,uuid,bigint,text,uuid,text)', 'EXECUTE'), 'service_role granted EXECUTE on assign_operational_exception');
select ok(has_function_privilege('service_role', 'app.reassign_operational_exception(uuid,uuid,uuid,uuid,bigint,text,uuid,text)', 'EXECUTE'), 'service_role granted EXECUTE on reassign_operational_exception');
select ok(has_function_privilege('service_role', 'app.change_operational_exception_severity(uuid,uuid,uuid,uuid,bigint,text,text)', 'EXECUTE'), 'service_role granted EXECUTE on change_operational_exception_severity');
select ok(has_function_privilege('service_role', 'app.resolve_operational_exception(uuid,uuid,uuid,uuid,bigint,text,text,jsonb,uuid)', 'EXECUTE'), 'service_role granted EXECUTE on resolve_operational_exception');
select ok(has_function_privilege('service_role', 'app.dismiss_operational_exception(uuid,uuid,uuid,uuid,bigint,text,text,jsonb,uuid)', 'EXECUTE'), 'service_role granted EXECUTE on dismiss_operational_exception');
select ok(has_function_privilege('service_role', 'app.reopen_operational_exception(uuid,uuid,uuid,uuid,bigint,text,jsonb)', 'EXECUTE'), 'service_role granted EXECUTE on reopen_operational_exception');
select ok(has_function_privilege('service_role', 'app.operational_exception_actor_role(uuid,uuid)', 'EXECUTE'), 'service_role granted EXECUTE on operational_exception_actor_role');

-- Table privileges: service_role (Blocking 2: SELECT only, no direct table mutation)
select ok(has_table_privilege('service_role', 'app.operational_exceptions', 'SELECT'), 'service_role has SELECT on app.operational_exceptions');
select ok(not has_table_privilege('service_role', 'app.operational_exceptions', 'INSERT'), 'service_role denied INSERT on app.operational_exceptions');
select ok(not has_table_privilege('service_role', 'app.operational_exceptions', 'UPDATE'), 'service_role denied UPDATE on app.operational_exceptions');
select ok(not has_table_privilege('service_role', 'app.operational_exceptions', 'DELETE'), 'service_role denied DELETE on app.operational_exceptions');

select ok(has_table_privilege('service_role', 'app.operational_exception_audit', 'SELECT'), 'service_role has SELECT on app.operational_exception_audit');
select ok(not has_table_privilege('service_role', 'app.operational_exception_audit', 'INSERT'), 'service_role denied INSERT on app.operational_exception_audit');
select ok(not has_table_privilege('service_role', 'app.operational_exception_audit', 'UPDATE'), 'service_role denied UPDATE on app.operational_exception_audit');
select ok(not has_table_privilege('service_role', 'app.operational_exception_audit', 'DELETE'), 'service_role denied DELETE on app.operational_exception_audit');

-- Table privileges: authenticated (SELECT only, no direct table mutation)
select ok(has_table_privilege('authenticated', 'app.operational_exceptions', 'SELECT'), 'authenticated has SELECT on app.operational_exceptions');
select ok(not has_table_privilege('authenticated', 'app.operational_exceptions', 'INSERT'), 'authenticated denied INSERT on app.operational_exceptions');
select ok(not has_table_privilege('authenticated', 'app.operational_exceptions', 'UPDATE'), 'authenticated denied UPDATE on app.operational_exceptions');
select ok(not has_table_privilege('authenticated', 'app.operational_exceptions', 'DELETE'), 'authenticated denied DELETE on app.operational_exceptions');

select ok(has_table_privilege('authenticated', 'app.operational_exception_audit', 'SELECT'), 'authenticated has SELECT on app.operational_exception_audit');
select ok(not has_table_privilege('authenticated', 'app.operational_exception_audit', 'INSERT'), 'authenticated denied INSERT on app.operational_exception_audit');
select ok(not has_table_privilege('authenticated', 'app.operational_exception_audit', 'UPDATE'), 'authenticated denied UPDATE on app.operational_exception_audit');
select ok(not has_table_privilege('authenticated', 'app.operational_exception_audit', 'DELETE'), 'authenticated denied DELETE on app.operational_exception_audit');

-- Direct table mutation dynamic denial
set local role service_role;
select throws_matching(
  $q$ insert into app.operational_exceptions (
    organization_id, exception_type, exception_category, severity,
    status, source_kind, primary_resource_type, primary_resource_id,
    responsible_role_code, summary, business_impact
  ) values (
    '00000000-0000-4000-8000-000000000001'::uuid, 'production.deadline_breached', 'PRODUCTION', 'HIGH',
    'OPEN', 'HUMAN_REPORT', 'PRODUCTION_JOB', '44444444-0000-4000-8000-000000000002'::uuid,
    'OPERATIONS', 'Direct bypass', 'Direct bypass impact'
  ) $q$,
  'permission denied',
  'Direct INSERT on app.operational_exceptions by service_role is denied'
);
reset role;

set local role authenticated;
select throws_matching(
  $q$ insert into app.operational_exceptions (
    organization_id, exception_type, exception_category, severity,
    status, source_kind, primary_resource_type, primary_resource_id,
    responsible_role_code, summary, business_impact
  ) values (
    '00000000-0000-4000-8000-000000000001'::uuid, 'production.deadline_breached', 'PRODUCTION', 'HIGH',
    'OPEN', 'HUMAN_REPORT', 'PRODUCTION_JOB', '44444444-0000-4000-8000-000000000002'::uuid,
    'OPERATIONS', 'Direct bypass', 'Direct bypass impact'
  ) $q$,
  'permission denied',
  'Direct INSERT on app.operational_exceptions by authenticated is denied'
);
reset role;

-- Actor spoof regression (authenticated role denied RPC execution even when passing owner UUID)
set local role authenticated;
select throws_matching(
  $q$ select app.open_operational_exception(
    '00000000-0000-4000-8000-000000000001'::uuid,
    '00000000-0000-0000-0000-000000000099'::uuid,
    '77777777-0000-4000-8000-000000000001'::uuid,
    'production.deadline_breached',
    'HIGH',
    'HUMAN_REPORT',
    'PRODUCTION_JOB',
    '44444444-0000-4000-8000-000000000002'::uuid,
    'OPERATIONS',
    'Spoof attempt by authenticated caller',
    'Audit falsification attempt'
  ) $q$,
  'permission denied',
  'Authenticated role cannot execute open_operational_exception even when supplying owner UUID (Actor Spoof Regression)'
);
reset role;

-- ============================================================================
-- 1. Setup Test Fixtures: Organizations, Users, Roles, and Source Resources
-- ============================================================================

-- Primary Organization & Brand context
create temporary table ex_ctx as select
  (select id from app.organizations where code='multigraph-group') as org,
  (select id from app.brands where code='TS') as brand,
  (select id from app.users where email='founder@multigraph.id') as owner_actor,
  (select id from app.customer_accounts where status='ACTIVE' limit 1) as customer;

grant select on ex_ctx to public;

-- Secondary Organization for Cross-Tenant Isolation Tests
insert into app.organizations (id, code, display_name, legal_name, status) values
  ('22222222-0000-4000-8000-000000000001', 'foreign-org', 'Foreign Apparel Corp', 'PT Foreign Apparel Corp', 'ACTIVE')
on conflict (id) do nothing;

insert into app.roles (id, organization_id, code, name) values
  ('22222222-0000-4000-8000-000000000002', '22222222-0000-4000-8000-000000000001', 'OWNER', 'Owner')
on conflict (id) do nothing;

-- Create auth.users records for test actors
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  ('00000000-0000-0000-0000-000000000000', '11111111-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'admin_ex@test.invalid', 'pw', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('00000000-0000-0000-0000-000000000000', '11111111-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'ops_ex@test.invalid', 'pw', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('00000000-0000-0000-0000-000000000003', '11111111-0000-4000-8000-000000000003', 'authenticated', 'authenticated', 'inactive_user_ex@test.invalid', 'pw', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('00000000-0000-0000-0000-000000000000', '11111111-0000-4000-8000-000000000004', 'authenticated', 'authenticated', 'foreign_ex@test.invalid', 'pw', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('00000000-0000-0000-0000-000000000000', '11111111-0000-4000-8000-000000000005', 'authenticated', 'authenticated', 'inactive_mem_ex@test.invalid', 'pw', now(), '{}'::jsonb, '{}'::jsonb, now(), now())
on conflict (id) do nothing;

-- Create test actors in Primary Organization: Admin, Operations, Inactive User, Foreign User, Inactive Member
insert into app.users (id, auth_user_id, name, email, status) values
  ('33333333-0000-4000-8000-000000000001', '11111111-0000-4000-8000-000000000001', 'Admin Tester', 'admin_ex@test.invalid', 'ACTIVE'),
  ('33333333-0000-4000-8000-000000000002', '11111111-0000-4000-8000-000000000002', 'Ops Tester', 'ops_ex@test.invalid', 'ACTIVE'),
  ('33333333-0000-4000-8000-000000000003', '11111111-0000-4000-8000-000000000003', 'Inactive Tester', 'inactive_ex@test.invalid', 'INACTIVE'),
  ('33333333-0000-4000-8000-000000000004', '11111111-0000-4000-8000-000000000004', 'Foreign Tester', 'foreign_ex@test.invalid', 'ACTIVE'),
  ('33333333-0000-4000-8000-000000000005', '11111111-0000-4000-8000-000000000005', 'Inactive Member Tester', 'inactive_mem_ex@test.invalid', 'ACTIVE')
on conflict (id) do update set
  auth_user_id = excluded.auth_user_id,
  status = excluded.status;

-- Memberships in Primary Organization
insert into app.organization_members (organization_id, user_id, role_id, status)
select org, '33333333-0000-4000-8000-000000000001', (select id from app.roles where organization_id=org and code='ADMIN'), 'ACTIVE' from ex_ctx
on conflict do nothing;

insert into app.organization_members (organization_id, user_id, role_id, status)
select org, '33333333-0000-4000-8000-000000000002', (select id from app.roles where organization_id=org and code='OPERATIONS'), 'ACTIVE' from ex_ctx
on conflict do nothing;

insert into app.organization_members (organization_id, user_id, role_id, status)
select org, '33333333-0000-4000-8000-000000000003', (select id from app.roles where organization_id=org and code='ADMIN'), 'ACTIVE' from ex_ctx
on conflict do nothing;

insert into app.organization_members (organization_id, user_id, role_id, status)
select org, '33333333-0000-4000-8000-000000000005', (select id from app.roles where organization_id=org and code='ADMIN'), 'INACTIVE' from ex_ctx
on conflict do nothing;

-- Foreign Membership in Secondary Organization
insert into app.organization_members (organization_id, user_id, role_id, status)
values ('22222222-0000-4000-8000-000000000001', '33333333-0000-4000-8000-000000000004', '22222222-0000-4000-8000-000000000002', 'ACTIVE')
on conflict do nothing;

-- Source Resources in Primary Organization
-- 1. Order
insert into app.orders (
  id, organization_id, brand_id, customer_account_id,
  order_type, order_number, status, currency,
  subtotal, discount_total, shipping_total, grand_total,
  estimated_cost_total, estimated_gross_profit,
  customer_snapshot, shipping_address_snapshot, payment_terms_snapshot,
  created_by_user_id, request_id
) select
  '44444444-0000-4000-8000-000000000001', org, brand, customer,
  'RETAIL_DIRECT', 'TS-O-EX-0001', 'ACTIVE', 'IDR',
  500000, 0, 25000, 525000, 250000, 250000,
  '{"display_name": "Ex Client"}'::jsonb,
  '{"recipient_name": "Ex Receiver", "phone": "0811", "street": "Jl. Ex", "city": "Jakarta"}'::jsonb,
  '{"notes": "Terms"}'::jsonb,
  owner_actor, '55555555-0000-4000-8000-000000000001'
from ex_ctx;

-- 2. Production Job
insert into app.production_jobs (
  id, organization_id, brand_id, order_id,
  job_number, job_type, title, status, estimated_cost, created_by_user_id
) select
  '44444444-0000-4000-8000-000000000002', org, brand, '44444444-0000-4000-8000-000000000001',
  'TS-J-EX-0001', 'PRINTING', 'Job For Exception Test', 'IN_PRODUCTION', 250000, owner_actor
from ex_ctx;

-- ============================================================================
-- 2. Command Tests: open_operational_exception
-- ============================================================================

-- Test 1: Valid Open Exception by OWNER (AC-001, AC-002)
create temporary table open_res_1 as select app.open_operational_exception(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_request_id => '66666666-0000-4000-8000-000000000001'::uuid,
  p_exception_type => 'production.deadline_breached',
  p_severity => 'HIGH',
  p_source_kind => 'HUMAN_REPORT',
  p_primary_resource_type => 'PRODUCTION_JOB',
  p_primary_resource_id => '44444444-0000-4000-8000-000000000002'::uuid,
  p_responsible_role_code => 'OPERATIONS',
  p_summary => 'Vendor terlambat cetak sample DTF 2 hari',
  p_business_impact => 'Resiko penundaan pengiriman pesanan ke pelanggan',
  p_observation => 'Mesin sablon vendor mengalami kendala pemanas head print'
) as res from ex_ctx;

select ok(
  (select (res->>'exception_id') from open_res_1) is not null
  and (select (res->>'status') from open_res_1) = 'OPEN'
  and (select (res->>'current_revision')::int from open_res_1) = 1
  and (select (res->>'is_existing_active_exception')::boolean from open_res_1) = false,
  'Open command successfully creates active exception with status OPEN and revision 1'
);

-- Test 2: Row attributes, derived brand/order, and category check (Section 21, 29)
select results_eq(
  $q$ select exception_category, brand_id, order_id, current_revision, status
      from app.operational_exceptions
      where id = (select (res->>'exception_id')::uuid from open_res_1) $q$,
  $q$ select 'PRODUCTION'::text, brand, '44444444-0000-4000-8000-000000000001'::uuid, 1::bigint, 'OPEN'::text from ex_ctx $q$,
  'Row derives category PRODUCTION, brand_id, order_id, and has revision 1'
);

grant select on open_res_1 to public;

-- RLS Read Policy: OWNER can read own organization exceptions (Blocking 2B)
set local role authenticated;
set local "request.jwt.claim.sub" = '00000000-0000-0000-0000-000000000099';
set local "request.jwt.claims" = '{"sub": "00000000-0000-0000-0000-000000000099"}';
select is(
  (select count(*)::int from app.operational_exceptions where id = (select (res->>'exception_id')::uuid from open_res_1)),
  1,
  'OWNER can read operational exceptions in own organization via RLS (Blocking 2B)'
);
reset role;

-- RLS Read Policy: ADMIN can read own organization exceptions (Blocking 2B)
set local role authenticated;
set local "request.jwt.claim.sub" = '11111111-0000-4000-8000-000000000001';
set local "request.jwt.claims" = '{"sub": "11111111-0000-4000-8000-000000000001"}';
select is(
  (select count(*)::int from app.operational_exceptions where id = (select (res->>'exception_id')::uuid from open_res_1)),
  1,
  'ADMIN can read operational exceptions in own organization via RLS (Blocking 2B)'
);
reset role;

-- RLS Read Policy: OPERATIONS cannot read exceptions in WP01 (Blocking 2B)
set local role authenticated;
set local "request.jwt.claim.sub" = '11111111-0000-4000-8000-000000000002';
set local "request.jwt.claims" = '{"sub": "11111111-0000-4000-8000-000000000002"}';
select is(
  (select count(*)::int from app.operational_exceptions where id = (select (res->>'exception_id')::uuid from open_res_1)),
  0,
  'OPERATIONS role cannot read operational exceptions in WP01 via RLS (Blocking 2B)'
);
reset role;

-- RLS Read Policy: Inactive user cannot read exceptions (Blocking 2B)
set local role authenticated;
set local "request.jwt.claim.sub" = '11111111-0000-4000-8000-000000000003';
set local "request.jwt.claims" = '{"sub": "11111111-0000-4000-8000-000000000003"}';
select is(
  (select count(*)::int from app.operational_exceptions where id = (select (res->>'exception_id')::uuid from open_res_1)),
  0,
  'Inactive user cannot read operational exceptions via RLS (Blocking 2B)'
);
reset role;

-- RLS Read Policy: User with inactive membership cannot read exceptions (Blocking 2B)
set local role authenticated;
set local "request.jwt.claim.sub" = '11111111-0000-4000-8000-000000000005';
set local "request.jwt.claims" = '{"sub": "11111111-0000-4000-8000-000000000005"}';
select is(
  (select count(*)::int from app.operational_exceptions where id = (select (res->>'exception_id')::uuid from open_res_1)),
  0,
  'User with inactive membership cannot read operational exceptions via RLS (Blocking 2B)'
);
reset role;

-- RLS Read Policy: Foreign organization user cannot read exceptions (Blocking 2B)
set local role authenticated;
set local "request.jwt.claim.sub" = '11111111-0000-4000-8000-000000000004';
set local "request.jwt.claims" = '{"sub": "11111111-0000-4000-8000-000000000004"}';
select is(
  (select count(*)::int from app.operational_exceptions where id = (select (res->>'exception_id')::uuid from open_res_1)),
  0,
  'Foreign organization user cannot read primary organization exceptions via RLS (Blocking 2B)'
);
reset role;

-- RLS Read Policy on Audit: OWNER can read audit rows (Blocking 2B)
set local role authenticated;
set local "request.jwt.claim.sub" = '00000000-0000-0000-0000-000000000099';
set local "request.jwt.claims" = '{"sub": "00000000-0000-0000-0000-000000000099"}';
select ok(
  (select count(*)::int from app.operational_exception_audit) > 0,
  'OWNER can read operational exception audit rows via RLS (Blocking 2B)'
);
reset role;

-- RLS Read Policy on Audit: OPERATIONS cannot read audit rows in WP01 (Blocking 2B)
set local role authenticated;
set local "request.jwt.claim.sub" = '11111111-0000-4000-8000-000000000002';
set local "request.jwt.claims" = '{"sub": "11111111-0000-4000-8000-000000000002"}';
select is(
  (select count(*)::int from app.operational_exception_audit),
  0,
  'OPERATIONS role cannot read operational exception audit rows in WP01 via RLS (Blocking 2B)'
);
reset role;

-- Test 3: Active Business Deduplication (AC-005, Section 36 & 47)
-- Competing attempt to open exception for SAME abnormality and SAME resource
create temporary table open_res_dup as select app.open_operational_exception(
  p_organization_id => org,
  p_actor_id => '33333333-0000-4000-8000-000000000001'::uuid, -- Admin actor
  p_request_id => '66666666-0000-4000-8000-000000000002'::uuid, -- Different request ID
  p_exception_type => 'production.deadline_breached',
  p_severity => 'CRITICAL',
  p_source_kind => 'RECONCILIATION',
  p_primary_resource_type => 'PRODUCTION_JOB',
  p_primary_resource_id => '44444444-0000-4000-8000-000000000002'::uuid,
  p_responsible_role_code => 'OPERATIONS',
  p_summary => 'Duplicate open attempt with different wording',
  p_business_impact => 'Different impact text'
) as res from ex_ctx;

select ok(
  (select (res->>'exception_id') from open_res_dup) = (select (res->>'exception_id') from open_res_1)
  and (select (res->>'is_existing_active_exception')::boolean from open_res_dup) = true,
  'Active business deduplication returns existing exception ID without creating second row (AC-005)'
);

select results_eq(
  $q$ select count(*)::int from app.operational_exceptions
      where exception_type = 'production.deadline_breached'
        and primary_resource_id = '44444444-0000-4000-8000-000000000002' $q$,
  $q$ values(1) $q$,
  'Exactly one physical row exists after deduplicated open attempt'
);

-- Test 4: Request-Idempotency Replay (AC-006, Section 45)
create temporary table open_res_replay as select app.open_operational_exception(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_request_id => '66666666-0000-4000-8000-000000000001'::uuid, -- Same request ID
  p_exception_type => 'production.deadline_breached',
  p_severity => 'HIGH',
  p_source_kind => 'HUMAN_REPORT',
  p_primary_resource_type => 'PRODUCTION_JOB',
  p_primary_resource_id => '44444444-0000-4000-8000-000000000002'::uuid,
  p_responsible_role_code => 'OPERATIONS',
  p_summary => 'Vendor terlambat cetak sample DTF 2 hari',
  p_business_impact => 'Resiko penundaan pengiriman pesanan ke pelanggan',
  p_observation => 'Mesin sablon vendor mengalami kendala pemanas head print'
) as res from ex_ctx;

select ok(
  (select (res->>'is_retry')::boolean from open_res_replay) = true
  and (select (res->>'exception_id') from open_res_replay) = (select (res->>'exception_id') from open_res_1),
  'Same request ID and same payload returns stored receipt with is_retry = true (AC-006)'
);

-- Test 5: Request Idempotency Conflict (AC-006)
select throws_ok(
  $q$ select app.open_operational_exception(
    p_organization_id => org,
    p_actor_id => owner_actor,
    p_request_id => '66666666-0000-4000-8000-000000000001'::uuid, -- Same request ID
    p_exception_type => 'production.deadline_breached',
    p_severity => 'LOW', -- Different severity!
    p_source_kind => 'HUMAN_REPORT',
    p_primary_resource_type => 'PRODUCTION_JOB',
    p_primary_resource_id => '44444444-0000-4000-8000-000000000002'::uuid,
    p_responsible_role_code => 'OPERATIONS',
    p_summary => 'Different payload text',
    p_business_impact => 'Different payload impact'
  ) from ex_ctx $q$,
  'P0001',
  'Idempotency conflict: request_id already used with different payload or command',
  'Same request ID with different payload raises Idempotency conflict (AC-006)'
);

-- Test 6: Cross-Organization Source Rejection (AC-004)
select throws_ok(
  $q$ select app.open_operational_exception(
    p_organization_id => '22222222-0000-4000-8000-000000000001'::uuid,
    p_actor_id => '33333333-0000-4000-8000-000000000004'::uuid,
    p_request_id => '66666666-0000-4000-8000-000000000003'::uuid,
    p_exception_type => 'production.deadline_breached',
    p_severity => 'HIGH',
    p_source_kind => 'HUMAN_REPORT',
    p_primary_resource_type => 'PRODUCTION_JOB',
    p_primary_resource_id => '44444444-0000-4000-8000-000000000002'::uuid,
    p_responsible_role_code => 'OWNER',
    p_summary => 'Cross-organization attempt',
    p_business_impact => 'Should be rejected'
  ) $q$,
  'P0001',
  'Primary resource PRODUCTION_JOB 44444444-0000-4000-8000-000000000002 not found in organization',
  'Foreign organization cannot reference primary organization source resource (AC-004)'
);

-- Test 7: Resource Type Mismatch Rejection (Section 26)
select throws_ok(
  $q$ select app.open_operational_exception(
    p_organization_id => org,
    p_actor_id => owner_actor,
    p_request_id => '66666666-0000-4000-8000-000000000004'::uuid,
    p_exception_type => 'production.deadline_breached',
    p_severity => 'HIGH',
    p_source_kind => 'HUMAN_REPORT',
    p_primary_resource_type => 'ORDER', -- Wrong! deadline_breached requires PRODUCTION_JOB
    p_primary_resource_id => '44444444-0000-4000-8000-000000000001'::uuid,
    p_responsible_role_code => 'OPERATIONS',
    p_summary => 'Mismatched resource type attempt',
    p_business_impact => 'Should be rejected'
  ) from ex_ctx $q$,
  'P0001',
  'Exception type production.deadline_breached requires primary_resource_type PRODUCTION_JOB',
  'Mismatched primary resource type is rejected'
);

-- Test 8: Unsupported Source Kind Rejection in WP01 (Section 14)
select throws_ok(
  $q$ select app.open_operational_exception(
    p_organization_id => org,
    p_actor_id => owner_actor,
    p_request_id => '66666666-0000-4000-8000-000000000005'::uuid,
    p_exception_type => 'production.deadline_breached',
    p_severity => 'HIGH',
    p_source_kind => 'DETERMINISTIC_RULE', -- Not allowed in WP01!
    p_primary_resource_type => 'PRODUCTION_JOB',
    p_primary_resource_id => '44444444-0000-4000-8000-000000000002'::uuid,
    p_responsible_role_code => 'OPERATIONS',
    p_summary => 'Unsupported source kind attempt',
    p_business_impact => 'Should be rejected'
  ) from ex_ctx $q$,
  'P0001',
  'Source kind DETERMINISTIC_RULE is not authorized for manual opening in WP01',
  'Non-human source kind is rejected in WP01'
);

-- Test 9: Unauthorized Role Rejection (OPERATIONS role denied open) (Section 57)
select throws_ok(
  $q$ select app.open_operational_exception(
    p_organization_id => org,
    p_actor_id => '33333333-0000-4000-8000-000000000002'::uuid, -- Ops tester
    p_request_id => '66666666-0000-4000-8000-000000000006'::uuid,
    p_exception_type => 'financial.margin_exception',
    p_severity => 'MEDIUM',
    p_source_kind => 'HUMAN_REPORT',
    p_primary_resource_type => 'ORDER',
    p_primary_resource_id => '44444444-0000-4000-8000-000000000001'::uuid,
    p_responsible_role_code => 'FINANCE',
    p_summary => 'Margin drop detected',
    p_business_impact => 'Loss of margin'
  ) from ex_ctx $q$,
  'P0001',
  'Not authorized to open operational exceptions',
  'OPERATIONS role is not authorized to open exceptions'
);

-- Test 10: Inactive Membership Rejection (Section 51)
select throws_ok(
  $q$ select app.open_operational_exception(
    p_organization_id => org,
    p_actor_id => '33333333-0000-4000-8000-000000000003'::uuid, -- Inactive member
    p_request_id => '66666666-0000-4000-8000-000000000007'::uuid,
    p_exception_type => 'financial.margin_exception',
    p_severity => 'MEDIUM',
    p_source_kind => 'HUMAN_REPORT',
    p_primary_resource_type => 'ORDER',
    p_primary_resource_id => '44444444-0000-4000-8000-000000000001'::uuid,
    p_responsible_role_code => 'FINANCE',
    p_summary => 'Inactive member attempt',
    p_business_impact => 'Should be rejected'
  ) from ex_ctx $q$,
  'P0001',
  'Active organization membership required',
  'Inactive membership is rejected'
);

-- Test 11: Foreign Responsible Principal Rejection (Section 64)
select throws_ok(
  $q$ select app.open_operational_exception(
    p_organization_id => org,
    p_actor_id => owner_actor,
    p_request_id => '66666666-0000-4000-8000-000000000008'::uuid,
    p_exception_type => 'financial.margin_exception',
    p_severity => 'MEDIUM',
    p_source_kind => 'HUMAN_REPORT',
    p_primary_resource_type => 'ORDER',
    p_primary_resource_id => '44444444-0000-4000-8000-000000000001'::uuid,
    p_responsible_role_code => 'FINANCE',
    p_responsible_user_id => '33333333-0000-4000-8000-000000000004'::uuid, -- Foreign user!
    p_summary => 'Foreign assignee attempt',
    p_business_impact => 'Should be rejected'
  ) from ex_ctx $q$,
  'P0001',
  'Active organization membership required',
  'Assignee from foreign organization is rejected'
);

-- Test 11B: Human Observation length check (observation <= 4000 characters)
select throws_ok(
  $q$ select app.open_operational_exception(
    p_organization_id => org,
    p_actor_id => owner_actor,
    p_request_id => '66666666-0000-4000-8000-000000000099'::uuid,
    p_exception_type => 'production.deadline_breached',
    p_severity => 'HIGH',
    p_source_kind => 'HUMAN_REPORT',
    p_primary_resource_type => 'PRODUCTION_JOB',
    p_primary_resource_id => '44444444-0000-4000-8000-000000000002'::uuid,
    p_responsible_role_code => 'OPERATIONS',
    p_summary => 'Excessive observation test',
    p_business_impact => 'High impact',
    p_observation => repeat('x', 4001)
  ) from ex_ctx $q$,
  'P0001',
  'Observation exceeds maximum allowed length of 4000 characters',
  'Human observation exceeding 4000 characters is rejected'
);

-- ============================================================================
-- 3. Lifecycle Commands: Acknowledge, Assign, Reassign, Severity
-- ============================================================================

-- Test 12: Stale Revision Rejection (AC-007, Section 40)
select throws_ok(
  $q$ select app.acknowledge_operational_exception(
    p_organization_id => org,
    p_actor_id => owner_actor,
    p_request_id => '77777777-0000-4000-8000-000000000001'::uuid,
    p_exception_id => (select (res->>'exception_id')::uuid from open_res_1),
    p_expected_revision => 999::bigint -- Stale!
  ) from ex_ctx $q$,
  'P0001',
  'Stale revision: expected 999, got 1',
  'Stale expected revision is rejected (AC-007)'
);

-- Test 13: Valid Acknowledge by ADMIN (Section 60..61)
-- Unassigned exception becomes assigned to acknowledging actor, revision increments to 2
create temporary table ack_res as select app.acknowledge_operational_exception(
  p_organization_id => org,
  p_actor_id => '33333333-0000-4000-8000-000000000001'::uuid, -- Admin
  p_request_id => '77777777-0000-4000-8000-000000000002'::uuid,
  p_exception_id => (select (res->>'exception_id')::uuid from open_res_1),
  p_expected_revision => 1::bigint,
  p_note => 'Admin mengambil alih koordinasi dengan vendor sablon'
) as res from ex_ctx;

select ok(
  (select (res->>'status') from ack_res) = 'ACKNOWLEDGED'
  and (select (res->>'current_revision')::int from ack_res) = 2
  and (select (res->>'responsible_user_id')::uuid from ack_res) = '33333333-0000-4000-8000-000000000001'::uuid,
  'Acknowledge succeeds, sets status ACKNOWLEDGED, assigns acknowledging actor, and increments revision to 2'
);

-- Test 14: Acknowledge by Different Principal Rejection (Section 61)
-- Opening a second exception, assigned to Owner
create temporary table open_res_2 as select app.open_operational_exception(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_request_id => '66666666-0000-4000-8000-000000000010'::uuid,
  p_exception_type => 'financial.margin_exception',
  p_severity => 'MEDIUM',
  p_source_kind => 'HUMAN_REPORT',
  p_primary_resource_type => 'ORDER',
  p_primary_resource_id => '44444444-0000-4000-8000-000000000001'::uuid,
  p_responsible_role_code => 'FINANCE',
  p_responsible_user_id => owner_actor, -- Assigned to Owner!
  p_summary => 'Margin pesanan turun di bawah 15%',
  p_business_impact => 'Profit margin tidak menutup biaya operasional'
) as res from ex_ctx;

select throws_ok(
  $q$ select app.acknowledge_operational_exception(
    p_organization_id => org,
    p_actor_id => '33333333-0000-4000-8000-000000000001'::uuid, -- Admin tries to ack Owner's assigned exception
    p_request_id => '77777777-0000-4000-8000-000000000003'::uuid,
    p_exception_id => (select (res->>'exception_id')::uuid from open_res_2),
    p_expected_revision => 1::bigint
  ) from ex_ctx $q$,
  'P0001',
  'Cannot acknowledge: exception is already assigned to a different principal',
  'Acknowledge by different actor on already assigned exception is rejected (Section 61)'
);

-- Test 15: Valid Assign on OPEN Unassigned Exception (Section 62)
-- Opening third unassigned exception
create temporary table open_res_3 as select app.open_operational_exception(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_request_id => '66666666-0000-4000-8000-000000000020'::uuid,
  p_exception_type => 'other.operational_abnormality',
  p_severity => 'LOW',
  p_source_kind => 'HUMAN_REPORT',
  p_primary_resource_type => 'ORDER',
  p_primary_resource_id => '44444444-0000-4000-8000-000000000001'::uuid,
  p_responsible_role_code => 'SALES',
  p_summary => 'Anomali instruksi khusus pelanggan',
  p_business_impact => 'Perlu klarifikasi agar tidak salah kemas',
  p_other_category_reason => 'Instruksi packaging khusus tidak tercover di kategori standar'
) as res from ex_ctx;

create temporary table assign_res as select app.assign_operational_exception(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_request_id => '77777777-0000-4000-8000-000000000021'::uuid,
  p_exception_id => (select (res->>'exception_id')::uuid from open_res_3),
  p_expected_revision => 1::bigint,
  p_responsible_role_code => 'OPERATIONS',
  p_responsible_user_id => owner_actor,
  p_reason => 'Penugasan founder untuk review'
) as res from ex_ctx;

select ok(
  (select (res->>'status') from assign_res) = 'OPEN'
  and (select (res->>'responsible_user_id')::uuid from assign_res) = (select owner_actor from ex_ctx)
  and (select (res->>'current_revision')::int from assign_res) = 2,
  'Assign command sets responsible principal, keeps status OPEN, and increments revision to 2'
);

-- Test 16: Assign on Already Assigned Exception Fails (Section 62)
select throws_ok(
  $q$ select app.assign_operational_exception(
    p_organization_id => org,
    p_actor_id => owner_actor,
    p_request_id => '77777777-0000-4000-8000-000000000022'::uuid,
    p_exception_id => (select (res->>'exception_id')::uuid from open_res_3),
    p_expected_revision => 2::bigint,
    p_responsible_role_code => 'ADMIN',
    p_responsible_user_id => '33333333-0000-4000-8000-000000000001'::uuid
  ) from ex_ctx $q$,
  'P0001',
  'Exception already has an assigned principal; use reassign instead',
  'Assign on already assigned exception is rejected (must use reassign)'
);

-- Test 17: Valid Reassign on ACKNOWLEDGED Exception (Section 63)
create temporary table reassign_res as select app.reassign_operational_exception(
  p_organization_id => org,
  p_actor_id => '33333333-0000-4000-8000-000000000001'::uuid, -- Admin currently assigned
  p_request_id => '77777777-0000-4000-8000-000000000004'::uuid,
  p_exception_id => (select (res->>'exception_id')::uuid from open_res_1),
  p_expected_revision => 2::bigint,
  p_new_responsible_role_code => 'OPERATIONS',
  p_new_responsible_user_id => (select owner_actor from ex_ctx),
  p_reason => 'Dialihkan ke founder untuk negosiasi ulang dengan vendor'
) as res from ex_ctx;

select ok(
  (select (res->>'status') from reassign_res) = 'ACKNOWLEDGED'
  and (select (res->>'responsible_user_id')::uuid from reassign_res) = (select owner_actor from ex_ctx)
  and (select (res->>'current_revision')::int from reassign_res) = 3,
  'Reassign preserves ACKNOWLEDGED status, updates assignee, and increments revision to 3'
);

-- Test 18: Severity Change (Section 65)
create temporary table sev_res as select app.change_operational_exception_severity(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_request_id => '77777777-0000-4000-8000-000000000005'::uuid,
  p_exception_id => (select (res->>'exception_id')::uuid from open_res_1),
  p_expected_revision => 3::bigint,
  p_new_severity => 'CRITICAL',
  p_reason => 'Vendor menyatakan mesin rusak total, dampak eskalasi ke deadline pengiriman'
) as res from ex_ctx;

select ok(
  (select (res->>'severity') from sev_res) = 'CRITICAL'
  and (select (res->>'current_revision')::int from sev_res) = 4,
  'Severity successfully changed to CRITICAL with revision incremented to 4'
);

-- Test 19: Severity No-Op Rejection (Section 65)
select throws_ok(
  $q$ select app.change_operational_exception_severity(
    p_organization_id => org,
    p_actor_id => owner_actor,
    p_request_id => '77777777-0000-4000-8000-000000000006'::uuid,
    p_exception_id => (select (res->>'exception_id')::uuid from open_res_1),
    p_expected_revision => 4::bigint,
    p_new_severity => 'CRITICAL', -- Already CRITICAL!
    p_reason => 'No op attempt'
  ) from ex_ctx $q$,
  'P0001',
  'New severity must be different from current severity',
  'No-op severity change is rejected (Section 65)'
);

-- ============================================================================
-- 4. Resolution & Dismissal Commands
-- ============================================================================

-- Test 20: ADMIN Accepted-Risk Resolution Rejection (AC-003, AC-005, Section 55)
select throws_ok(
  $q$ select app.resolve_operational_exception(
    p_organization_id => org,
    p_actor_id => '33333333-0000-4000-8000-000000000001'::uuid, -- Admin
    p_request_id => '88888888-0000-4000-8000-000000000001'::uuid,
    p_exception_id => (select (res->>'exception_id')::uuid from open_res_1),
    p_expected_revision => 4::bigint,
    p_resolution_type => 'ACCEPTED_RISK',
    p_resolution_summary => 'Admin attempting accepted risk'
  ) from ex_ctx $q$,
  'P0001',
  'Accepted risk resolution requires OWNER authority',
  'ADMIN role cannot execute ACCEPTED_RISK resolution (AC-003, Section 55)'
);

-- Test 21: OWNER Accepted-Risk Resolution Success (AC-003, Section 55)
create temporary table resolve_res as select app.resolve_operational_exception(
  p_organization_id => org,
  p_actor_id => owner_actor, -- OWNER!
  p_request_id => '88888888-0000-4000-8000-000000000002'::uuid,
  p_exception_id => (select (res->>'exception_id')::uuid from open_res_1),
  p_expected_revision => 4::bigint,
  p_resolution_type => 'ACCEPTED_RISK',
  p_resolution_summary => 'Owner menyetujui toleransi keterlambatan 1 hari tanpa pinalti',
  p_closure_evidence => '{"decision_memo": "Approved by founder via chat"}'::jsonb
) as res from ex_ctx;

select ok(
  (select (res->>'status') from resolve_res) = 'RESOLVED'
  and (select (res->>'resolution_type') from resolve_res) = 'ACCEPTED_RISK'
  and (select (res->>'current_revision')::int from resolve_res) = 5,
  'OWNER successfully resolves exception with ACCEPTED_RISK and revision 5'
);

-- Test 22: Ordinary Resolve (REMEDIATED) by ADMIN (Section 66)
create temporary table resolve_res_2 as select app.resolve_operational_exception(
  p_organization_id => org,
  p_actor_id => '33333333-0000-4000-8000-000000000001'::uuid, -- Admin
  p_request_id => '88888888-0000-4000-8000-000000000003'::uuid,
  p_exception_id => (select (res->>'exception_id')::uuid from open_res_2),
  p_expected_revision => 1::bigint,
  p_resolution_type => 'REMEDIATED',
  p_resolution_summary => 'Diberikan diskon bahan oleh supplier kain untuk menutup selisih margin'
) as res from ex_ctx;

select ok(
  (select (res->>'status') from resolve_res_2) = 'RESOLVED'
  and (select (res->>'resolution_type') from resolve_res_2) = 'REMEDIATED',
  'ADMIN successfully executes ordinary REMEDIATED resolution'
);

-- Test 23: Dismiss False Positive (Section 69)
create temporary table dismiss_res as select app.dismiss_operational_exception(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_request_id => '88888888-0000-4000-8000-000000000010'::uuid,
  p_exception_id => (select (res->>'exception_id')::uuid from open_res_3),
  p_expected_revision => 2::bigint,
  p_dismissal_reason => 'FALSE_POSITIVE',
  p_reason_summary => 'Instruksi packaging pelanggan ternyata sudah sesuai SOP varian khusus'
) as res from ex_ctx;

select ok(
  (select (res->>'status') from dismiss_res) = 'DISMISSED'
  and (select (res->>'dismissal_reason') from dismiss_res) = 'FALSE_POSITIVE'
  and (select (res->>'current_revision')::int from dismiss_res) = 3,
  'Dismissal FALSE_POSITIVE succeeds, sets status DISMISSED and revision 3'
);

-- Test 24: Duplicate Dismissal Requires Target Exception (Section 70)
-- Open another exception to be dismissed as DUPLICATE of open_res_1
create temporary table open_res_4 as select app.open_operational_exception(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_request_id => '66666666-0000-4000-8000-000000000040'::uuid,
  p_exception_type => 'other.operational_abnormality',
  p_severity => 'LOW',
  p_source_kind => 'HUMAN_REPORT',
  p_primary_resource_type => 'ORDER',
  p_primary_resource_id => '44444444-0000-4000-8000-000000000001'::uuid,
  p_responsible_role_code => 'ADMIN',
  p_summary => 'Second report for same issue',
  p_business_impact => 'Duplicate report impact',
  p_other_category_reason => 'Report duplicate testing reason'
) as res from ex_ctx;

select throws_ok(
  $q$ select app.dismiss_operational_exception(
    p_organization_id => org,
    p_actor_id => owner_actor,
    p_request_id => '88888888-0000-4000-8000-000000000011'::uuid,
    p_exception_id => (select (res->>'exception_id')::uuid from open_res_4),
    p_expected_revision => 1::bigint,
    p_dismissal_reason => 'DUPLICATE',
    p_reason_summary => 'Missing duplicate target'
    -- duplicate_of_exception_id is null!
  ) from ex_ctx $q$,
  'P0001',
  'duplicate_of_exception_id is required when dismissal_reason is DUPLICATE',
  'DUPLICATE dismissal without duplicate target is rejected (Section 70)'
);

create temporary table dismiss_dup_res as select app.dismiss_operational_exception(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_request_id => '88888888-0000-4000-8000-000000000012'::uuid,
  p_exception_id => (select (res->>'exception_id')::uuid from open_res_4),
  p_expected_revision => 1::bigint,
  p_dismissal_reason => 'DUPLICATE',
  p_reason_summary => 'Duplikat dari exception pertama',
  p_duplicate_of_exception_id => (select (res->>'exception_id')::uuid from open_res_1)
) as res from ex_ctx;

select ok(
  (select (res->>'status') from dismiss_dup_res) = 'DISMISSED'
  and (select (res->>'dismissal_reason') from dismiss_dup_res) = 'DUPLICATE',
  'DUPLICATE dismissal with target exception succeeds'
);

-- ============================================================================
-- 5. Reopen Commands (Sections 71..74)
-- ============================================================================

-- Test 25: Valid Reopen on RESOLVED Exception (Section 71..73)
create temporary table reopen_res as select app.reopen_operational_exception(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_request_id => '99999999-0000-4000-8000-000000000001'::uuid,
  p_exception_id => (select (res->>'exception_id')::uuid from open_res_1),
  p_expected_revision => 5::bigint,
  p_reason => 'Kendala berulang kembali pada produksi batch kedua'
) as res from ex_ctx;

select ok(
  (select (res->>'status') from reopen_res) = 'OPEN'
  and (select (res->>'current_revision')::int from reopen_res) = 6,
  'Reopen returns status to OPEN, preserves Exception identity, and increments revision to 6'
);

-- Test 26: Reopen projection reset and responsibility retention (Section 72..73)
select results_eq(
  $q$ select status, resolution_type, resolution_summary, closed_at, responsible_user_id
      from app.operational_exceptions
      where id = (select (res->>'exception_id')::uuid from open_res_1) $q$,
  $q$ select 'OPEN'::text, null::text, null::text, null::timestamptz, owner_actor from ex_ctx $q$,
  'Reopen clears closure projection and retains assigned principal'
);

-- Test 27: Reopen Blocked by Existing Active Duplicate (Section 74)
-- open_res_1 is now OPEN again. Attempting to reopen another exception that has the same active fingerprint should fail!
-- Let's resolve open_res_1 again so we can test conflict
select app.resolve_operational_exception(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_request_id => '88888888-0000-4000-8000-000000000099'::uuid,
  p_exception_id => (select (res->>'exception_id')::uuid from open_res_1),
  p_expected_revision => 6::bigint,
  p_resolution_type => 'REMEDIATED',
  p_resolution_summary => 'Closed again for reopen dedup test'
) from ex_ctx;

-- Open a new independent exception for the same resource
create temporary table open_res_new_episode as select app.open_operational_exception(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_request_id => '66666666-0000-4000-8000-000000000077'::uuid,
  p_exception_type => 'production.deadline_breached',
  p_severity => 'MEDIUM',
  p_source_kind => 'HUMAN_REPORT',
  p_primary_resource_type => 'PRODUCTION_JOB',
  p_primary_resource_id => '44444444-0000-4000-8000-000000000002'::uuid,
  p_responsible_role_code => 'OPERATIONS',
  p_summary => 'New episode while prior was closed',
  p_business_impact => 'New episode impact'
) as res from ex_ctx;

select ok(
  (select (res->>'is_existing_active_exception')::boolean from open_res_new_episode) = false,
  'Independent new episode is allowed after prior exception is closed'
);

-- Now attempting to REOPEN the older closed exception (open_res_1) must fail because open_res_new_episode is active!
select throws_ok(
  $q$ select app.reopen_operational_exception(
    p_organization_id => org,
    p_actor_id => owner_actor,
    p_request_id => '99999999-0000-4000-8000-000000000099'::uuid,
    p_exception_id => (select (res->>'exception_id')::uuid from open_res_1),
    p_expected_revision => 7::bigint,
    p_reason => 'Attempting reopen when another active exception exists'
  ) from ex_ctx $q$,
  'P0001',
  'Cannot reopen: another active operational exception already exists for this resource and abnormality',
  'Reopen is blocked when another active duplicate already exists (Section 74)'
);

-- ============================================================================
-- 6. Audit Immutability Guard (Section 48)
-- ============================================================================

-- Test 28: Audit UPDATE Rejection
select throws_ok(
  $q$ update app.operational_exception_audit
      set action = 'tampered'
      where id = (select id from app.operational_exception_audit limit 1) $q$,
  'P0001',
  'Operational exception audit rows are append-only and cannot be updated or deleted',
  'Audit rows cannot be updated (trigger immutability guard)'
);

-- Test 29: Audit DELETE Rejection
select throws_ok(
  $q$ delete from app.operational_exception_audit
      where id = (select id from app.operational_exception_audit limit 1) $q$,
  'P0001',
  'Operational exception audit rows are append-only and cannot be updated or deleted',
  'Audit rows cannot be deleted (trigger immutability guard)'
);

-- ============================================================================
-- 7. Source-Domain State Isolation (AC-011, Section 110)
-- ============================================================================

-- Test 30: Verify Order status and amounts are UNCHANGED
select results_eq(
  $q$ select status, grand_total from app.orders where id = '44444444-0000-4000-8000-000000000001' $q$,
  $q$ values('ACTIVE'::text, 525000::bigint) $q$,
  'Source Order status and amounts remained completely unchanged across exception lifecycle (AC-011)'
);

-- Test 31: Verify Production Job status and estimated cost are UNCHANGED
select results_eq(
  $q$ select status, estimated_cost from app.production_jobs where id = '44444444-0000-4000-8000-000000000002' $q$,
  $q$ values('IN_PRODUCTION'::text, 250000::bigint) $q$,
  'Source Production Job status and costs remained completely unchanged across exception lifecycle (AC-011)'
);

-- ============================================================================
-- 8. End of Test
-- ============================================================================

select * from finish();
rollback;
