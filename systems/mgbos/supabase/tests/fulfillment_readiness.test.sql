begin;
select plan(12);

-- Setup test context
create temporary table test_ctx as select
  (select id from app.organizations where code='multigraph-group') org,
  (select id from app.brands where code='TS') brand,
  (select id from app.users where email='founder@multigraph.id') owner_actor,
  (select id from app.customer_accounts where status='ACTIVE' limit 1) customer;

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
  'CUSTOM_B2B', 'TS-O-2026-FR01', 'ACTIVE', 'IDR',
  2000000, 0, 50000, 2050000, 1000000, 1000000,
  '{"display_name": "Readiness Client"}'::jsonb,
  '{"recipient_name": "Andi", "phone": "0812345", "street": "Jl. Merdeka 10", "city": "Bandung"}'::jsonb,
  '{"notes": "Terms"}'::jsonb,
  owner_actor, '77777777-0000-4000-8000-000000000020'
from test_ctx;

insert into app.order_items (
  id, organization_id, order_id, item_type, description, quantity, unit_price, subtotal, total_cost
) select
  '33333333-0000-4000-8000-000000000001', org, '88888888-0000-4000-8000-000000000020',
  'CUSTOM_GARMENT', 'Kaos Sablon Depan Belakang (50 pcs)', 50, 25000, 1250000, 600000
from test_ctx;

insert into app.order_items (
  id, organization_id, order_id, item_type, description, quantity, unit_price, subtotal, total_cost
) select
  '33333333-0000-4000-8000-000000000002', org, '88888888-0000-4000-8000-000000000020',
  'CUSTOM_GARMENT', 'Tote Bag Kanvas Custom (30 pcs)', 30, 25000, 750000, 400000
from test_ctx;

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

-- 3. AC-04: Record QC REWORK -> Still blocked
update app.production_jobs
set status = 'REWORK'
where id = '55555555-0000-4000-8000-000000000021';

insert into app.qc_inspections (
  id, organization_id, production_job_id, inspector_id, inspection_number, result, sample_size, defect_count
) select
  '66666666-0000-4000-8000-000000000021', org, '55555555-0000-4000-8000-000000000021', owner_actor, 'TS-QC-2026-FR0001', 'REWORK', 5, 2
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

-- 4. AC-05: Record QC REJECTED / ON_HOLD -> Still blocked
update app.production_jobs
set status = 'ON_HOLD'
where id = '55555555-0000-4000-8000-000000000021';

insert into app.qc_inspections (
  id, organization_id, production_job_id, inspector_id, inspection_number, result, sample_size, defect_count
) select
  '66666666-0000-4000-8000-000000000022', org, '55555555-0000-4000-8000-000000000021', owner_actor, 'TS-QC-2026-FR0002', 'REJECTED', 5, 5
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
  'Job ON_HOLD / REJECTED blocks delivery order creation (AC-05)'
);

-- 5. AC-01: Pass QC and advance to READY_FOR_HANDOFF -> Can be shipped!
update app.production_jobs
set status = 'READY_FOR_HANDOFF'
where id = '55555555-0000-4000-8000-000000000021';

insert into app.qc_inspections (
  id, organization_id, production_job_id, inspector_id, inspection_number, result, sample_size, defect_count, inspected_at
) select
  '66666666-0000-4000-8000-000000000023', org, '55555555-0000-4000-8000-000000000021', owner_actor, 'TS-QC-2026-FR0003', 'PASS', 5, 0, now() + interval '1 minute'
from test_ctx;

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

-- 7. AC-07: Add a CANCELLED job for Item 1 -> does not block shipment of remaining 20 pcs
insert into app.production_jobs (
  id, organization_id, brand_id, order_id, job_number, job_type, title, status, estimated_cost, created_by_user_id
) select
  '55555555-0000-4000-8000-000000000022', org, brand, '88888888-0000-4000-8000-000000000020',
  'TS-J-2026-FR-CAN', 'PRINTING', 'Job Cadangan Dibatalkan', 'CANCELLED', 200000, owner_actor
from test_ctx;

insert into app.production_job_items (
  id, production_job_id, order_item_id, quantity
) values (
  '44444444-0000-4000-8000-000000000022', '55555555-0000-4000-8000-000000000022', '33333333-0000-4000-8000-000000000001', 20
);

create temporary table do_2 as select app.create_delivery_order(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_order_id => '88888888-0000-4000-8000-000000000020',
  p_courier_name => 'JNT',
  p_items => '[{"order_item_id": "33333333-0000-4000-8000-000000000001", "quantity": 20}]'::jsonb
) as res from test_ctx;

select is(
  (select (res->>'status') from do_2),
  'READY_TO_DISPATCH',
  'Cancelled irrelevant job does not block fulfillment of remaining quantity (AC-07)'
);

-- 8. AC-08: Item 2 has an unfinished job (PLANNED) -> Attempting to ship Item 2 is blocked
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

-- 9. AC-09: Operator receives descriptive blocker error message
select throws_matching(
  $q$select app.create_delivery_order(
    p_organization_id => org,
    p_actor_id => owner_actor,
    p_order_id => '88888888-0000-4000-8000-000000000020',
    p_courier_name => 'JNT',
    p_items => '[{"order_item_id": "33333333-0000-4000-8000-000000000002", "quantity": 30}]'::jsonb
  ) from test_ctx$q$,
  /Production job TS-J-2026-FR0002 .* is currently PLANNED \(required: READY_FOR_HANDOFF or COMPLETED\)/,
  'Blocker message explicitly specifies job number and status (AC-09)'
);

-- 10. AC-10: Delivered shipment immutability
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
select app.transition_shipment_status(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_shipment_id => (select (res->>'shipment_id')::uuid from do_1),
  p_to_status => 'DELIVERED',
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

rollback;
