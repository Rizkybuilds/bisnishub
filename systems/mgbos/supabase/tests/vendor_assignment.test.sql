begin;
select plan(15);

-- Setup test context
create temporary table test_ctx as select
  (select id from app.organizations where code='multigraph-group') as org,
  (select id from app.brands where code='TS') as brand,
  (select id from app.users where email='founder@multigraph.id') as owner_actor,
  (select id from app.customer_accounts where status='ACTIVE' limit 1) as customer;

-- Create an active vendor and an inactive vendor in this org
insert into app.vendors (
  id, organization_id, code, name, category, status, lead_time_days
) select
  '11111111-0000-4000-8000-000000000001', org, 'VND-ACTIVE', 'Vendor Aktif Sablon', 'PRINT_STUDIO', 'ACTIVE', 3
from test_ctx;

insert into app.vendors (
  id, organization_id, code, name, category, status, lead_time_days
) select
  '11111111-0000-4000-8000-000000000002', org, 'VND-INACTIVE', 'Vendor Tutup Gudang', 'GARMENT_SUPPLIER', 'INACTIVE', 5
from test_ctx;

-- Create a cross-org vendor in a secondary org
insert into app.organizations (id, code, legal_name, display_name) values
  ('99999999-0000-4000-8000-000000000099', 'other-group', 'Other Group Holding', 'Other Group');

insert into app.vendors (
  id, organization_id, code, name, category, status, lead_time_days
) values (
  '11111111-0000-4000-8000-000000000099', '99999999-0000-4000-8000-000000000099', 'VND-CROSS', 'Vendor Asing', 'PRINT_STUDIO', 'ACTIVE', 2
);

-- Create a test order and production job in READY status
insert into app.orders (
  id, organization_id, brand_id, customer_account_id,
  order_type, order_number, status, currency,
  subtotal, discount_total, shipping_total, grand_total,
  estimated_cost_total, estimated_gross_profit,
  customer_snapshot, shipping_address_snapshot, payment_terms_snapshot,
  created_by_user_id, request_id
) select
  '88888888-0000-4000-8000-000000000001', org, brand, customer,
  'RETAIL_DIRECT', 'TS-O-2026-VND01', 'ACTIVE', 'IDR',
  1000000, 0, 50000, 1050000, 500000, 500000,
  '{"display_name": "Test Client"}'::jsonb,
  '{"recipient_name": "Budi", "phone": "0812345", "street": "Jl. Test", "city": "Jakarta"}'::jsonb,
  '{"notes": "Terms"}'::jsonb,
  owner_actor, '77777777-0000-4000-8000-000000000001'
from test_ctx;

insert into app.production_jobs (
  id, organization_id, brand_id, order_id, job_number, job_type, title, status, estimated_cost, created_by_user_id
) select
  '55555555-0000-4000-8000-000000000001', org, brand, '88888888-0000-4000-8000-000000000001',
  'TS-J-2026-000001', 'PRINTING', 'Cetak DTF Kaos 50 pcs', 'READY', 450000, owner_actor
from test_ctx;

-- 1. Inactive Vendor Guard (AC-03)
select throws_ok(
  $q$select app.assign_production_job(
    p_organization_id => org,
    p_actor_id => owner_actor,
    p_job_id => '55555555-0000-4000-8000-000000000001',
    p_executor_type => 'VENDOR',
    p_assigned_cost => 400000,
    p_vendor_id => '11111111-0000-4000-8000-000000000002'
  ) from test_ctx$q$,
  'P0001',
  'Vendor Vendor Tutup Gudang is not ACTIVE (status: INACTIVE)',
  'Inactive vendor is rejected'
);

-- 2. Cross-Org Vendor Guard (AC-04)
select throws_ok(
  $q$select app.assign_production_job(
    p_organization_id => org,
    p_actor_id => owner_actor,
    p_job_id => '55555555-0000-4000-8000-000000000001',
    p_executor_type => 'VENDOR',
    p_assigned_cost => 400000,
    p_vendor_id => '11111111-0000-4000-8000-000000000099'
  ) from test_ctx$q$,
  'P0001',
  'Vendor not found in organization',
  'Cross-org vendor is rejected'
);

-- 3. Unknown Vendor Guard (AC-05)
select throws_ok(
  $q$select app.assign_production_job(
    p_organization_id => org,
    p_actor_id => owner_actor,
    p_job_id => '55555555-0000-4000-8000-000000000001',
    p_executor_type => 'VENDOR',
    p_assigned_cost => 400000,
    p_vendor_id => '00000000-0000-4000-8000-000000000000'
  ) from test_ctx$q$,
  'P0001',
  'Vendor not found in organization',
  'Unknown vendor UUID is rejected'
);

-- 4. Canonical Vendor Assignment (AC-01, AC-02, AC-07, AC-09)
create temporary table test_assignment as
select app.assign_production_job(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_job_id => '55555555-0000-4000-8000-000000000001',
  p_executor_type => 'VENDOR',
  p_assigned_cost => 420000,
  p_notes => 'Spesifikasi print DTF A3',
  p_vendor_id => '11111111-0000-4000-8000-000000000001'
) as assign_id from test_ctx;

select ok(
  (select assign_id is not null from test_assignment),
  'Vendor assignment succeeds'
);

select is(
  (select vendor_id from app.production_assignments where id = (select assign_id from test_assignment)),
  '11111111-0000-4000-8000-000000000001'::uuid,
  'Canonical vendor_id persisted in production_assignments (AC-02)'
);

select is(
  (select vendor_name from app.production_assignments where id = (select assign_id from test_assignment)),
  'Vendor Aktif Sablon',
  'Historical vendor_name snapshot preserved from vendor directory (AC-09)'
);

select is(
  (select assigned_cost from app.production_assignments where id = (select assign_id from test_assignment)),
  420000::bigint,
  'Assigned cost persisted on assignment'
);

select is(
  (select committed_cost from app.production_jobs where id = '55555555-0000-4000-8000-000000000001'),
  420000::bigint,
  'Committed cost recorded on production job (AC-07)'
);

select is(
  (select status from app.production_jobs where id = '55555555-0000-4000-8000-000000000001'),
  'ASSIGNED',
  'Production job status transitioned to ASSIGNED'
);

select is(
  (select details->>'vendor_id' from app.production_job_audit where production_job_id = '55555555-0000-4000-8000-000000000001' and action = 'job.assigned' order by created_at desc limit 1),
  '11111111-0000-4000-8000-000000000001',
  'Audit trail logs vendor_id'
);

-- 5. Internal Assignment Compatibility (AC-06)
-- Create a second job for internal assignment
insert into app.production_jobs (
  id, organization_id, brand_id, order_id, job_number, job_type, title, status, estimated_cost, created_by_user_id
) select
  '55555555-0000-4000-8000-000000000002', org, brand, '88888888-0000-4000-8000-000000000001',
  'TS-J-2026-000002', 'GARMENT', 'Cutting and Sewing Combed 24s', 'READY', 300000, owner_actor
from test_ctx;

create temporary table test_assignment_internal as
select app.assign_production_job(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_job_id => '55555555-0000-4000-8000-000000000002',
  p_executor_type => 'INTERNAL',
  p_assigned_brand_id => brand,
  p_assigned_cost => 280000,
  p_notes => 'Internal sewing team'
) as assign_id from test_ctx;

select ok(
  (select assign_id is not null from test_assignment_internal),
  'Internal brand assignment succeeds (AC-06)'
);

select is(
  (select executor_type from app.production_assignments where id = (select assign_id from test_assignment_internal)),
  'INTERNAL',
  'Internal executor_type persisted'
);

select is(
  (select assigned_brand_id from app.production_assignments where id = (select assign_id from test_assignment_internal)),
  (select brand from test_ctx),
  'Assigned brand persisted'
);

select is(
  (select vendor_id from app.production_assignments where id = (select assign_id from test_assignment_internal)),
  null,
  'Vendor id is null for internal assignment'
);

select is(
  (select committed_cost from app.production_jobs where id = '55555555-0000-4000-8000-000000000002'),
  280000::bigint,
  'Committed cost recorded on internal job (AC-07)'
);

select * from finish();
rollback;
