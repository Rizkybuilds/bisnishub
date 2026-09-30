begin;
select plan(15);

-- Setup test context
create temporary table test_ctx as select
  (select id from app.organizations where code='multigraph-group') as org,
  (select id from app.brands where code='TS') as brand,
  (select id from app.users where email='founder@multigraph.id') as owner_actor,
  (select id from app.customer_accounts where status='ACTIVE' limit 1) as customer;

-- Create test order with two order items
insert into app.orders (
  id, organization_id, brand_id, customer_account_id,
  order_type, order_number, status, currency,
  subtotal, discount_total, shipping_total, grand_total,
  estimated_cost_total, estimated_gross_profit,
  customer_snapshot, shipping_address_snapshot, payment_terms_snapshot,
  created_by_user_id, request_id
) select
  '88888888-0000-4000-8000-000000000020', org, brand, customer,
  'RETAIL_DIRECT', 'TS-O-2026-FR01', 'ACTIVE', 'IDR',
  2000000, 0, 50000, 2050000, 1000000, 1000000,
  '{"display_name": "Readiness Client"}'::jsonb,
  '{"recipient_name": "Andi", "phone": "0812345", "street": "Jl. Merdeka 10", "city": "Bandung"}'::jsonb,
  '{"notes": "Terms"}'::jsonb,
  owner_actor, '77777777-0000-4000-8000-000000000020'
from test_ctx;

insert into app.order_items (
  id, order_id, position, description, quantity, unit, unit_price, subtotal, specification_snapshot
) values (
  '33333333-0000-4000-8000-000000000001', '88888888-0000-4000-8000-000000000020',
  1, 'Kaos Sablon Depan Belakang (50 pcs)', 50, 'PCS', 25000, 1250000, '{}'::jsonb
);

insert into app.order_items (
  id, order_id, position, description, quantity, unit, unit_price, subtotal, specification_snapshot
) values (
  '33333333-0000-4000-8000-000000000002', '88888888-0000-4000-8000-000000000020',
  2, 'Tote Bag Kanvas Custom (30 pcs)', 30, 'PCS', 25000, 750000, '{}'::jsonb
);

-- Create Job 1 for Item 1 in IN_PRODUCTION
insert into app.production_jobs (
  id, organization_id, brand_id, order_id, job_number, job_type, title, status, estimated_cost, created_by_user_id
) select
  '55555555-0000-4000-8000-000000000021', org, brand, '88888888-0000-4000-8000-000000000020',
  'TS-J-2026-FR0001', 'PRINTING', 'Cetak Kaos 50 pcs', 'IN_PRODUCTION', 600000, owner_actor
from test_ctx;

insert into app.production_job_items (
  id, production_job_id, order_item_id, quantity
) values (
  '44444444-0000-4000-8000-000000000021', '55555555-0000-4000-8000-000000000021', '33333333-0000-4000-8000-000000000001', 50
);

-- 1. AC-02: Unfinished production (IN_PRODUCTION) blocks Delivery Order creation
select throws_ok(
  $q$select app.create_delivery_order(
    p_organization_id => org,
    p_actor_id => owner_actor,
    p_order_id => '88888888-0000-4000-8000-000000000020',
    p_courier_name => 'JNT',
    p_items => '[{"order_item_id": "33333333-0000-4000-8000-000000000001", "quantity": 50}]'::jsonb
  ) from test_ctx$q$,
  'P0001',
  NULL,
  'Unfinished production (IN_PRODUCTION) blocks delivery order creation (AC-02)'
);

-- 2. AC-03: Advance to AWAITING_QC -> Still blocked
update app.production_jobs
set status = 'AWAITING_QC'
where id = '55555555-0000-4000-8000-000000000021';

select throws_ok(
  $q$select app.create_delivery_order(
    p_organization_id => org,
    p_actor_id => owner_actor,
    p_order_id => '88888888-0000-4000-8000-000000000020',
    p_courier_name => 'JNT',
    p_items => '[{"order_item_id": "33333333-0000-4000-8000-000000000001", "quantity": 50}]'::jsonb
  ) from test_ctx$q$,
  'P0001',
  NULL,
  'Job in AWAITING_QC blocks delivery order creation (AC-03)'
);

-- F3: Cannot transition directly from AWAITING_QC to READY_FOR_HANDOFF without QC PASS inspection
select throws_ok(
  $q$select app.transition_production_job_status(
    p_organization_id => (select org from test_ctx),
    p_actor_id => (select owner_actor from test_ctx),
    p_job_id => '55555555-0000-4000-8000-000000000021',
    p_to_status => 'READY_FOR_HANDOFF'
  )$q$,
  'P0001',
  NULL,
  'Direct transition to READY_FOR_HANDOFF without QC PASS inspection is rejected (F3)'
);

-- 3. AC-04: Record QC REWORK -> Still blocked
insert into app.qc_inspections (
  id, organization_id, production_job_id, inspector_id, inspection_number, result, sample_size, defect_count, inspected_at
) select
  '66666666-0000-4000-8000-000000000021', org, '55555555-0000-4000-8000-000000000021', owner_actor, 'TS-QC-2026-FR0001', 'REWORK', 5, 2, now() - interval '10 minutes'
from test_ctx;

select throws_ok(
  $q$select app.create_delivery_order(
    p_organization_id => org,
    p_actor_id => owner_actor,
    p_order_id => '88888888-0000-4000-8000-000000000020',
    p_courier_name => 'JNT',
    p_items => '[{"order_item_id": "33333333-0000-4000-8000-000000000001", "quantity": 50}]'::jsonb
  ) from test_ctx$q$,
  'P0001',
  NULL,
  'Job in REWORK blocks delivery order creation (AC-04)'
);

-- 4. AC-05: Record QC REJECTED -> Still blocked
insert into app.qc_inspections (
  id, organization_id, production_job_id, inspector_id, inspection_number, result, sample_size, defect_count, inspected_at
) select
  '66666666-0000-4000-8000-000000000022', org, '55555555-0000-4000-8000-000000000021', owner_actor, 'TS-QC-2026-FR0002', 'REJECTED', 5, 5, now() - interval '5 minutes'
from test_ctx;

select throws_ok(
  $q$select app.create_delivery_order(
    p_organization_id => org,
    p_actor_id => owner_actor,
    p_order_id => '88888888-0000-4000-8000-000000000020',
    p_courier_name => 'JNT',
    p_items => '[{"order_item_id": "33333333-0000-4000-8000-000000000001", "quantity": 50}]'::jsonb
  ) from test_ctx$q$,
  'P0001',
  NULL,
  'Job REJECTED blocks delivery order creation (AC-05)'
);

-- 5. AC-01: Pass QC and advance to READY_FOR_HANDOFF -> Can be shipped!
insert into app.qc_inspections (
  id, organization_id, production_job_id, inspector_id, inspection_number, result, sample_size, defect_count, inspected_at
) select
  '66666666-0000-4000-8000-000000000023', org, '55555555-0000-4000-8000-000000000021', owner_actor, 'TS-QC-2026-FR0003', 'PASS', 5, 0, now()
from test_ctx;

update app.production_jobs
set status = 'READY_FOR_HANDOFF'
where id = '55555555-0000-4000-8000-000000000021';

-- Create delivery order partial 30 pcs
create temporary table do_1 as select app.create_delivery_order(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_order_id => '88888888-0000-4000-8000-000000000020',
  p_courier_name => 'JNT',
  p_items => '[{"order_item_id": "33333333-0000-4000-8000-000000000001", "quantity": 30}]'::jsonb
) as res from test_ctx;

select is(
  (select (res->>'status') from do_1),
  'READY_TO_DISPATCH',
  'Ready work can be shipped partial 30 pcs (AC-01, AC-08)'
);

-- 6. AC-06: Shipment quantity ceiling guard
select throws_ok(
  $q$select app.create_delivery_order(
    p_organization_id => org,
    p_actor_id => owner_actor,
    p_order_id => '88888888-0000-4000-8000-000000000020',
    p_courier_name => 'JNT',
    p_items => '[{"order_item_id": "33333333-0000-4000-8000-000000000001", "quantity": 25}]'::jsonb
  ) from test_ctx$q$,
  'P0001',
  NULL,
  'Exceeding remaining unshipped quota (30 + 25 > 50) is blocked by ceiling guard (AC-06)'
);

-- F2: Duplicate item in payload exceeding remaining quota (15 + 15 = 30 > 20 remaining) is blocked
select throws_ok(
  $q$select app.create_delivery_order(
    p_organization_id => org,
    p_actor_id => owner_actor,
    p_order_id => '88888888-0000-4000-8000-000000000020',
    p_courier_name => 'JNT',
    p_items => '[
      {"order_item_id": "33333333-0000-4000-8000-000000000001", "quantity": 15},
      {"order_item_id": "33333333-0000-4000-8000-000000000001", "quantity": 15}
    ]'::jsonb
  ) from test_ctx$q$,
  'P0001',
  NULL,
  'Duplicate items in payload exceeding remaining quota (15 + 15 > 20) are blocked atomically (F2)'
);

-- Verify rejection leaves no shipment residue
select is(
  (select count(*)::integer from app.shipments where order_id = '88888888-0000-4000-8000-000000000020'),
  1,
  'No orphan shipment header created from rejected duplicate item request'
);

-- F2: Duplicate item in payload WITHIN remaining quota (10 + 10 = 20 <= 20 remaining) succeeds!
create temporary table do_dup_valid as select app.create_delivery_order(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_order_id => '88888888-0000-4000-8000-000000000020',
  p_courier_name => 'JNT',
  p_items => '[
    {"order_item_id": "33333333-0000-4000-8000-000000000001", "quantity": 10},
    {"order_item_id": "33333333-0000-4000-8000-000000000001", "quantity": 10}
  ]'::jsonb
) as res from test_ctx;

select is(
  (select (res->>'status') from do_dup_valid),
  'READY_TO_DISPATCH',
  'Duplicate items in payload within remaining quota (10 + 10 = 20) succeed cleanly (F2)'
);

-- 7. AC-08: Item 2 has an unfinished job (PLANNED) -> Attempting to ship Item 2 is blocked
insert into app.production_jobs (
  id, organization_id, brand_id, order_id, job_number, job_type, title, status, estimated_cost, created_by_user_id
) select
  '55555555-0000-4000-8000-000000000023', org, brand, '88888888-0000-4000-8000-000000000020',
  'TS-J-2026-FR0002', 'GARMENT', 'Jahit Tote Bag Kanvas', 'PLANNED', 300000, owner_actor
from test_ctx;

insert into app.production_job_items (
  id, production_job_id, order_item_id, quantity
) values (
  '44444444-0000-4000-8000-000000000023', '55555555-0000-4000-8000-000000000023', '33333333-0000-4000-8000-000000000002', 30
);

select throws_ok(
  $q$select app.create_delivery_order(
    p_organization_id => org,
    p_actor_id => owner_actor,
    p_order_id => '88888888-0000-4000-8000-000000000020',
    p_courier_name => 'JNT',
    p_items => '[{"order_item_id": "33333333-0000-4000-8000-000000000002", "quantity": 30}]'::jsonb
  ) from test_ctx$q$,
  'P0001',
  NULL,
  'Item 2 with unfinished PLANNED job is blocked from shipment (AC-08)'
);

-- 8. AC-09: Operator receives descriptive blocker error message (POSIX regex string)
select throws_matching(
  $q$select app.create_delivery_order(
    p_organization_id => org,
    p_actor_id => owner_actor,
    p_order_id => '88888888-0000-4000-8000-000000000020',
    p_courier_name => 'JNT',
    p_items => '[{"order_item_id": "33333333-0000-4000-8000-000000000002", "quantity": 30}]'::jsonb
  ) from test_ctx$q$,
  'Production job TS-J-2026-FR0002 .* is currently PLANNED \(required: READY_FOR_HANDOFF or COMPLETED\)',
  'Blocker message explicitly specifies job number and status (AC-09)'
);

-- 9. AC-10: Delivered shipment immutability
select ok(
  (select count(*) from app.shipments where id = (select (res->>'shipment_id')::uuid from do_1)) = 1,
  'Shipment 1 successfully created'
);

-- Dispatch Shipment 1
select app.dispatch_shipment(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_shipment_id => (select (res->>'shipment_id')::uuid from do_1),
  p_tracking_number => 'JNT-FR-112233',
  p_actual_shipping_cost => 35000
) from test_ctx;

-- Mark Delivered
select app.mark_shipment_delivered(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_shipment_id => (select (res->>'shipment_id')::uuid from do_1),
  p_notes => 'Diterima oleh pemesan'
) from test_ctx;

select is(
  (select status from app.shipments where id = (select (res->>'shipment_id')::uuid from do_1)),
  'DELIVERED',
  'Shipment marked DELIVERED'
);

-- Attempt modification on DELIVERED shipment
select throws_ok(
  $q$update app.shipments
  set tracking_number = 'ILLEGAL-CHANGE'
  where id = (select (res->>'shipment_id')::uuid from do_1)$q$,
  'P0001',
  NULL,
  'Delivered shipment cannot be modified (AC-10)'
);

select * from finish();
rollback;
