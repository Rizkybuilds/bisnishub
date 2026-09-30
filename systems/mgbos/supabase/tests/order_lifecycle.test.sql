begin;
select plan(24);

-- Setup test context
create temporary table test_ctx as select
  (select id from app.organizations where code='multigraph-group') org,
  (select id from app.brands where code='TS') brand,
  (select id from app.users where email='founder@multigraph.id') owner_actor,
  (select id from app.customer_accounts where status='ACTIVE' limit 1) customer;

-- Create test users for SALES, QC, and another org member
insert into app.users(id, name, email) values
  ('77777777-0000-4000-8000-000000000001', 'Lifecycle Sales Actor', 'sales-lifecycle@local.invalid'),
  ('77777777-0000-4000-8000-000000000002', 'Lifecycle QC Actor', 'qc-lifecycle@local.invalid'),
  ('77777777-0000-4000-8000-000000000003', 'Cross Org Actor', 'cross-org-lifecycle@local.invalid');

insert into app.organization_members(organization_id, user_id, role_id)
select org, '77777777-0000-4000-8000-000000000001', (select id from app.roles where organization_id=org and code='SALES') from test_ctx;

insert into app.organization_members(organization_id, user_id, role_id)
select org, '77777777-0000-4000-8000-000000000002', (select id from app.roles where organization_id=org and code='QC') from test_ctx;

-- Create test order in CONFIRMED status
create temporary table test_order as
insert into app.orders (
  id, organization_id, brand_id, customer_account_id,
  order_type, order_number, status, currency,
  subtotal, discount_total, shipping_total, grand_total,
  estimated_cost_total, estimated_gross_profit,
  customer_snapshot, shipping_address_snapshot, payment_terms_snapshot,
  created_by_user_id, request_id
) select
  '66666666-0000-4000-8000-000000000001',
  org,
  brand,
  customer,
  'RETAIL_DIRECT',
  'TS-O-2026-TEST01',
  'CONFIRMED',
  'IDR',
  100000, 0, 15000, 115000,
  60000, 40000,
  '{"display_name": "Test Customer"}'::jsonb,
  '{"recipient_name": "Budi", "phone": "08123456789", "street": "Jl. Test 1", "city": "Jakarta"}'::jsonb,
  '{"notes": "Terms"}'::jsonb,
  owner_actor,
  '55555555-0000-4000-8000-000000000001'
from test_ctx
returning *;

-- 1. Authorization & Cross-Org Guards (AC-05, AC-06)
select throws_ok(
  $q$select app.transition_order_status(org, '77777777-0000-4000-8000-000000000001', '66666666-0000-4000-8000-000000000001', 'ACTIVE')$q$,
  'P0001',
  'Unauthorized to update order status',
  'SALES actor rejected from transitioning order'
);

select throws_ok(
  $q$select app.transition_order_status(org, '77777777-0000-4000-8000-000000000002', '66666666-0000-4000-8000-000000000001', 'ACTIVE')$q$,
  'P0001',
  'Unauthorized to update order status',
  'QC actor rejected from transitioning order'
);

select throws_ok(
  $q$select app.transition_order_status(org, '77777777-0000-4000-8000-000000000003', '66666666-0000-4000-8000-000000000001', 'ACTIVE')$q$,
  'P0001',
  'Unauthorized to update order status',
  'Cross-org actor rejected from transitioning order'
);

-- 2. Invalid Transition Graph (AC-02)
select throws_ok(
  $q$select app.transition_order_status(org, owner_actor, '66666666-0000-4000-8000-000000000001', 'COMPLETED')$q$,
  'P0001',
  'Illegal order status transition from CONFIRMED to COMPLETED',
  'Cannot skip directly from CONFIRMED to COMPLETED'
);

select throws_ok(
  $q$select app.transition_order_status(org, owner_actor, '66666666-0000-4000-8000-000000000001', 'INVALID_STATUS')$q$,
  'P0001',
  'Invalid target order status: INVALID_STATUS',
  'Invalid status string rejected'
);

-- 3. Idempotent No-Op Transition
select is(
  (select (app.transition_order_status(org, owner_actor, '66666666-0000-4000-8000-000000000001', 'CONFIRMED'))->>'is_no_op'),
  'true',
  'Transition to current status returns is_no_op: true'
);

-- 4. Valid Transition: CONFIRMED -> ACTIVE (AC-01)
select lives_ok(
  $q$select app.transition_order_status(org, owner_actor, '66666666-0000-4000-8000-000000000001', 'ACTIVE', 'Memulai produksi dan operasional')$q$,
  'CONFIRMED to ACTIVE transition succeeds'
);

select is(
  (select status from app.orders where id = '66666666-0000-4000-8000-000000000001'),
  'ACTIVE',
  'Order status updated to ACTIVE'
);

-- Audit recorded (AC-09)
select is(
  (select count(*)::integer from app.order_audit where order_id = '66666666-0000-4000-8000-000000000001' and action = 'order.status_transitioned'),
  1,
  'Audit trail recorded for order transition'
);

-- 5. Valid Transition: ACTIVE -> ON_HOLD and ON_HOLD -> ACTIVE (AC-01)
select lives_ok(
  $q$select app.transition_order_status(org, owner_actor, '66666666-0000-4000-8000-000000000001', 'ON_HOLD', 'Menunggu konfirmasi spesifikasi pelanggan')$q$,
  'ACTIVE to ON_HOLD transition succeeds'
);

select is(
  (select status from app.orders where id = '66666666-0000-4000-8000-000000000001'),
  'ON_HOLD',
  'Order status updated to ON_HOLD'
);

select throws_ok(
  $q$select app.transition_order_status(org, owner_actor, '66666666-0000-4000-8000-000000000001', 'COMPLETED')$q$,
  'P0001',
  'Illegal order status transition from ON_HOLD to COMPLETED',
  'ON_HOLD cannot transition directly to COMPLETED'
);

select lives_ok(
  $q$select app.transition_order_status(org, owner_actor, '66666666-0000-4000-8000-000000000001', 'ACTIVE', 'Spesifikasi terkonfirmasi, lanjut')$q$,
  'ON_HOLD to ACTIVE transition succeeds'
);

-- 6. Completion Guard: Production Obligations (AC-07)
-- Insert an active production job for this order
insert into app.production_jobs (
  id, organization_id, brand_id, order_id, job_number, job_type, title, status, created_by_user_id
) select
  '44444444-0000-4000-8000-000000000001', org, brand, '66666666-0000-4000-8000-000000000001',
  'JOB-TEST-01', 'GARMENT', 'Cutting and Sewing', 'IN_PRODUCTION', owner_actor
from test_ctx;

select throws_ok(
  $q$select app.transition_order_status(org, owner_actor, '66666666-0000-4000-8000-000000000001', 'COMPLETED')$q$,
  'P0001',
  'Cannot complete order: 1 active production job(s) remain unfinished',
  'ACTIVE to COMPLETED blocked by unfinished production jobs'
);

-- Complete the production job
update app.production_jobs set status = 'COMPLETED' where id = '44444444-0000-4000-8000-000000000001';

-- 7. Completion Guard: Fulfillment Obligations (AC-07)
-- Insert an in-transit shipment for this order
insert into app.shipments (
  id, organization_id, brand_id, order_id, customer_account_id,
  shipment_number, status, courier_name, created_by_user_id
) select
  '33333333-0000-4000-8000-000000000001', org, brand, '66666666-0000-4000-8000-000000000001', customer,
  'DO-TEST-01', 'IN_TRANSIT', 'JNE', owner_actor
from test_ctx;

select throws_ok(
  $q$select app.transition_order_status(org, owner_actor, '66666666-0000-4000-8000-000000000001', 'COMPLETED')$q$,
  'P0001',
  'Cannot complete order: 1 delivery order(s) remain undelivered or pending resolution',
  'ACTIVE to COMPLETED blocked by undelivered shipments'
);

-- Deliver the shipment
update app.shipments set status = 'DELIVERED', delivered_date = now() where id = '33333333-0000-4000-8000-000000000001';

-- 8. Completion Guard: Financial Obligations (AC-07)
-- Insert an unpaid issued commercial invoice
insert into app.invoices (
  id, organization_id, brand_id, order_id, customer_account_id,
  invoice_number, invoice_type, status, amount_subtotal, amount_total, balance_due,
  due_date, created_by_user_id
) select
  '22222222-0000-4000-8000-000000000001', org, brand, '66666666-0000-4000-8000-000000000001', customer,
  'INV-TEST-01', 'FULL_PAYMENT', 'ISSUED', 100000, 115000, 115000,
  current_date + 7, owner_actor
from test_ctx;

select throws_ok(
  $q$select app.transition_order_status(org, owner_actor, '66666666-0000-4000-8000-000000000001', 'COMPLETED')$q$,
  'P0001',
  'Cannot complete order: 1 commercial invoice(s) remain unpaid or pending settlement',
  'ACTIVE to COMPLETED blocked by unpaid commercial invoice'
);

-- Settle the invoice
update app.invoices set status = 'PAID', amount_paid = 115000, balance_due = 0, paid_at = now() where id = '22222222-0000-4000-8000-000000000001';

-- 9. Eligible ACTIVE Order Can Complete (AC-08)
select lives_ok(
  $q$select app.transition_order_status(org, owner_actor, '66666666-0000-4000-8000-000000000001', 'COMPLETED', 'Seluruh kewajiban produksi, pengiriman, dan pembayaran lunas')$q$,
  'Eligible ACTIVE order completes successfully'
);

select is(
  (select status from app.orders where id = '66666666-0000-4000-8000-000000000001'),
  'COMPLETED',
  'Order status updated to COMPLETED'
);

-- 10. Terminal State Protection (AC-03, AC-04)
select throws_ok(
  $q$select app.transition_order_status(org, owner_actor, '66666666-0000-4000-8000-000000000001', 'ACTIVE')$q$,
  'P0001',
  'Order TS-O-2026-TEST01 is in terminal status COMPLETED and cannot be transitioned',
  'COMPLETED order cannot leave terminal state'
);

select throws_ok(
  $q$select app.transition_order_status(org, owner_actor, '66666666-0000-4000-8000-000000000001', 'CANCELLED')$q$,
  'P0001',
  'Order TS-O-2026-TEST01 is in terminal status COMPLETED and cannot be transitioned',
  'COMPLETED order cannot be cancelled'
);

-- Test CANCELLED terminal state with a second order
insert into app.orders (
  id, organization_id, brand_id, customer_account_id,
  order_type, order_number, status, currency,
  subtotal, discount_total, shipping_total, grand_total,
  estimated_cost_total, estimated_gross_profit,
  customer_snapshot, shipping_address_snapshot, payment_terms_snapshot,
  created_by_user_id, request_id
) select
  '66666666-0000-4000-8000-000000000002',
  org, brand, customer, 'RETAIL_DIRECT', 'TS-O-2026-TEST02',
  'CONFIRMED', 'IDR', 50000, 0, 0, 50000, 25000, 25000,
  '{"display_name": "Test Customer 2"}'::jsonb,
  '{"recipient_name": "Budi", "phone": "08123456789", "street": "Jl. Test 2", "city": "Jakarta"}'::jsonb,
  '{"notes": "Terms"}'::jsonb,
  owner_actor, '55555555-0000-4000-8000-000000000002'
from test_ctx;

select lives_ok(
  $q$select app.transition_order_status(org, owner_actor, '66666666-0000-4000-8000-000000000002', 'CANCELLED', 'Pelanggan membatalkan pesanan')$q$,
  'CONFIRMED to CANCELLED transition succeeds'
);

select throws_ok(
  $q$select app.transition_order_status(org, owner_actor, '66666666-0000-4000-8000-000000000002', 'ACTIVE')$q$,
  'P0001',
  'Order TS-O-2026-TEST02 is in terminal status CANCELLED and cannot be transitioned',
  'CANCELLED order cannot leave terminal state'
);

select * from finish();
rollback;
