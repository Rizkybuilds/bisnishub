begin;
select plan(20);

-- Setup test context
create temporary table test_ctx as select
  (select id from app.organizations where code='multigraph-group') as org,
  (select id from app.brands where code='TS') as brand,
  (select id from app.users where email='founder@multigraph.id') as owner_actor,
  (select id from app.customer_accounts where status='ACTIVE' limit 1) as customer;

-- Create an active vendor
insert into app.vendors (
  id, organization_id, code, name, category, status, lead_time_days
) select
  '11111111-0000-4000-8000-000000000010', org, 'VND-AL-01', 'Vendor Sablon Cepat', 'PRINT_STUDIO', 'ACTIVE', 2
from test_ctx;

-- Create another active vendor for reassignment
insert into app.vendors (
  id, organization_id, code, name, category, status, lead_time_days
) select
  '11111111-0000-4000-8000-000000000011', org, 'VND-AL-02', 'Vendor Cadangan Garment', 'GARMENT_SUPPLIER', 'ACTIVE', 3
from test_ctx;

-- Create test order
insert into app.orders (
  id, organization_id, brand_id, customer_account_id,
  order_type, order_number, status, currency,
  subtotal, discount_total, shipping_total, grand_total,
  estimated_cost_total, estimated_gross_profit,
  customer_snapshot, shipping_address_snapshot, payment_terms_snapshot,
  created_by_user_id, request_id
) select
  '88888888-0000-4000-8000-000000000010', org, brand, customer,
  'RETAIL_DIRECT', 'TS-O-2026-AL01', 'ACTIVE', 'IDR',
  1000000, 0, 50000, 1050000, 500000, 500000,
  '{"display_name": "Test Client"}'::jsonb,
  '{"recipient_name": "Budi", "phone": "0812345", "street": "Jl. Test", "city": "Jakarta"}'::jsonb,
  '{"notes": "Terms"}'::jsonb,
  owner_actor, '77777777-0000-4000-8000-000000000010'
from test_ctx;

-- Create test job in READY status
insert into app.production_jobs (
  id, organization_id, brand_id, order_id, job_number, job_type, title, status, estimated_cost, created_by_user_id
) select
  '55555555-0000-4000-8000-000000000010', org, brand, '88888888-0000-4000-8000-000000000010',
  'TS-J-2026-AL0001', 'PRINTING', 'Cetak DTF 100 pcs', 'READY', 800000, owner_actor
from test_ctx;

-- 1. Assign job to Vendor 1
create temporary table assign_1 as select app.assign_production_job(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_job_id => '55555555-0000-4000-8000-000000000010',
  p_executor_type => 'VENDOR',
  p_vendor_id => '11111111-0000-4000-8000-000000000010',
  p_assigned_cost => 750000,
  p_notes => 'Penugasan vendor pertama'
) as assign_id from test_ctx;

select ok(
  (select assign_id from assign_1) is not null,
  'Job successfully assigned (status: ASSIGNED)'
);

-- 2. AC-09: Multiple conflicting active assignments prevented
select throws_ok(
  $q$select app.assign_production_job(
    p_organization_id => org,
    p_actor_id => owner_actor,
    p_job_id => '55555555-0000-4000-8000-000000000010',
    p_executor_type => 'VENDOR',
    p_vendor_id => '11111111-0000-4000-8000-000000000011',
    p_assigned_cost => 700000
  ) from test_ctx$q$,
  'P0001',
  NULL,
  'Conflicting second active assignment is rejected (AC-09)'
);

-- 3. AC-10: Unauthorized actor rejected (fail-closed F1)
select throws_ok(
  $q$select app.accept_production_assignment(
    p_organization_id => (select org from test_ctx),
    p_actor_id => '00000000-0000-0000-0000-000000000000',
    p_assignment_id => (select assign_id from assign_1)
  )$q$,
  'P0001',
  'Active organization membership required',
  'Unauthorized actor is rejected for accept_production_assignment (fail-closed)'
);

-- 4. AC-01, AC-02, AC-03, AC-04: Accept assignment
create temporary table accept_res as select app.accept_production_assignment(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_assignment_id => (select assign_id from assign_1)
) as res from test_ctx;

select is(
  (select (res->>'status') from accept_res),
  'ACCEPTED',
  'Assignment status transitions to ACCEPTED (AC-01, AC-02)'
);

select ok(
  (select accepted_at from app.production_assignments where id = (select assign_id from assign_1)) is not null,
  'accepted_at timestamp is populated (AC-03)'
);

select is(
  (select status from app.production_jobs where id = '55555555-0000-4000-8000-000000000010'),
  'ACCEPTED',
  'Production job coordinated to ACCEPTED (AC-04)'
);

-- 5. AC-12: Duplicate acceptance is safe
create temporary table dup_accept as select app.accept_production_assignment(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_assignment_id => (select assign_id from assign_1)
) as res from test_ctx;

select is(
  (select (res->>'already_accepted')::boolean from dup_accept),
  true,
  'Duplicate acceptance is safe and returns already_accepted=true (AC-12)'
);

-- 6. Decline when ACCEPTED should be rejected
select throws_ok(
  $q$select app.decline_production_assignment(
    p_organization_id => org,
    p_actor_id => owner_actor,
    p_assignment_id => (select assign_id from assign_1),
    p_reason => 'Tolak setelah terima'
  ) from test_ctx$q$,
  'P0001',
  NULL,
  'Cannot decline an already accepted assignment'
);

-- 7. Cancel assignment before shop-floor execution
create temporary table cancel_res as select app.cancel_production_assignment(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_assignment_id => (select assign_id from assign_1),
  p_reason => 'Vendor mengalami kendala mesin cetak'
) as res from test_ctx;

select is(
  (select (res->>'status') from cancel_res),
  'CANCELLED',
  'Assignment transitions to CANCELLED'
);

select is(
  (select status from app.production_jobs where id = '55555555-0000-4000-8000-000000000010'),
  'READY',
  'Production job coordinated back to READY after cancellation'
);

-- 8. AC-05, AC-06, AC-07: Test Decline flow on a new assignment
create temporary table assign_2 as select app.assign_production_job(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_job_id => '55555555-0000-4000-8000-000000000010',
  p_executor_type => 'VENDOR',
  p_vendor_id => '11111111-0000-4000-8000-000000000010',
  p_assigned_cost => 740000,
  p_notes => 'Penugasan kedua'
) as assign_id from test_ctx;

select is(
  (select status from app.production_assignments where id = (select assign_id from assign_2)),
  'ASSIGNED',
  'Second assignment created in ASSIGNED state'
);

-- Decline the assignment (AC-05)
create temporary table decline_res as select app.decline_production_assignment(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_assignment_id => (select assign_id from assign_2),
  p_reason => 'Bahan baku kaos 24s hitam habis'
) as res from test_ctx;

select is(
  (select (res->>'status') from decline_res),
  'DECLINED',
  'Assignment transitions to DECLINED (AC-05)'
);

-- AC-06: Historical evidence preserved
select is(
  (select count(*)::int from app.production_assignments where production_job_id = '55555555-0000-4000-8000-000000000010'),
  2,
  'Declined and cancelled assignments remain historical evidence (AC-06)'
);

-- AC-07: Job returns to READY and safely assignable again
select is(
  (select status from app.production_jobs where id = '55555555-0000-4000-8000-000000000010'),
  'READY',
  'Production job coordinated back to READY after decline (AC-07)'
);

-- 9. AC-08: Reassign atomically with reassign_production_job
create temporary table reassign_res as select app.reassign_production_job(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_job_id => '55555555-0000-4000-8000-000000000010',
  p_executor_type => 'VENDOR',
  p_vendor_id => '11111111-0000-4000-8000-000000000011',
  p_assigned_cost => 780000,
  p_notes => 'Alihkan ke Vendor Cadangan Garment',
  p_reason => 'Reassigning after vendor decline',
  p_request_id => '44444444-0000-4000-8000-000000000099'::uuid
) as new_assign_id from test_ctx;

select ok(
  (select new_assign_id from reassign_res) is not null,
  'Atomic reassignment succeeded (AC-08)'
);

select is(
  (select vendor_id from app.production_assignments where id = (select new_assign_id from reassign_res)),
  '11111111-0000-4000-8000-000000000011'::uuid,
  'New assignment points to reallocated vendor'
);

-- 10. F6 Idempotency Regression Tests
-- 10a: Same request_id and identical payload returns the exact same assignment ID
create temporary table reassign_retry as select app.reassign_production_job(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_job_id => '55555555-0000-4000-8000-000000000010',
  p_executor_type => 'VENDOR',
  p_vendor_id => '11111111-0000-4000-8000-000000000011',
  p_assigned_cost => 780000,
  p_notes => 'Alihkan ke Vendor Cadangan Garment',
  p_reason => 'Reassigning after vendor decline',
  p_request_id => '44444444-0000-4000-8000-000000000099'::uuid
) as retry_assign_id from test_ctx;

select is(
  (select retry_assign_id from reassign_retry),
  (select new_assign_id from reassign_res),
  'Idempotent retry with same request_id returns existing assignment ID without recreating (F6)'
);

-- 10b: Same request_id with different payload raises conflict
select throws_ok(
  $q$select app.reassign_production_job(
    p_organization_id => (select org from test_ctx),
    p_actor_id => (select owner_actor from test_ctx),
    p_job_id => '55555555-0000-4000-8000-000000000010',
    p_executor_type => 'VENDOR',
    p_vendor_id => '11111111-0000-4000-8000-000000000011',
    p_assigned_cost => 999999,
    p_request_id => '44444444-0000-4000-8000-000000000099'::uuid
  )$q$,
  'P0001',
  'Idempotent request conflict: request_id has already been used with different payload',
  'Replay with altered payload is rejected (F6)'
);

-- 10c: Stale expected_assignment_id is rejected
select throws_ok(
  $q$select app.reassign_production_job(
    p_organization_id => (select org from test_ctx),
    p_actor_id => (select owner_actor from test_ctx),
    p_job_id => '55555555-0000-4000-8000-000000000010',
    p_executor_type => 'VENDOR',
    p_vendor_id => '11111111-0000-4000-8000-000000000010',
    p_assigned_cost => 800000,
    p_expected_assignment_id => '00000000-0000-0000-0000-000000000000'::uuid
  )$q$,
  'P0001',
  NULL,
  'Stale expected_assignment_id is rejected (F6)'
);

-- 10d: Vendor accepts the reassignment
select app.accept_production_assignment(
  p_organization_id => (select org from test_ctx),
  p_actor_id => (select owner_actor from test_ctx),
  p_assignment_id => (select new_assign_id from reassign_res)
);

-- Idempotent retry after acceptance must not cancel the accepted assignment
create temporary table reassign_after_accept as select app.reassign_production_job(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_job_id => '55555555-0000-4000-8000-000000000010',
  p_executor_type => 'VENDOR',
  p_vendor_id => '11111111-0000-4000-8000-000000000011',
  p_assigned_cost => 780000,
  p_notes => 'Alihkan ke Vendor Cadangan Garment',
  p_reason => 'Reassigning after vendor decline',
  p_request_id => '44444444-0000-4000-8000-000000000099'::uuid
) as after_accept_id from test_ctx;

select is(
  (select status from app.production_assignments where id = (select new_assign_id from reassign_res)),
  'ACCEPTED',
  'Idempotent retry after vendor acceptance does NOT cancel accepted assignment (F6)'
);

select * from finish();
rollback;
