begin;
select plan(28);

-- Setup test context
create temporary table test_ctx as select
  (select id from app.organizations where code='multigraph-group') as org,
  (select id from app.brands where code='TS') as brand,
  (select id from app.users where email='founder@multigraph.id') as owner_actor,
  (select id from app.customer_accounts where status='ACTIVE' limit 1) as customer;

-- Create secondary organization for cross-org testing
insert into app.organizations (id, code, legal_name, display_name, status) values
  ('99999999-0000-4000-8000-000000000001', 'other-lifecycle-org', 'Other Org Legal', 'Other Org', 'ACTIVE'),
  ('99999999-0000-4000-8000-000000000002', 'inactive-lifecycle-org', 'Inactive Org Legal', 'Inactive Org', 'INACTIVE');

-- Create test users
insert into app.users(id, name, email, status) values
  ('77777777-0000-4000-8000-000000000001', 'Lifecycle Sales Actor', 'sales-lifecycle@local.invalid', 'ACTIVE'),
  ('77777777-0000-4000-8000-000000000002', 'Lifecycle QC Actor', 'qc-lifecycle@local.invalid', 'ACTIVE'),
  ('77777777-0000-4000-8000-000000000003', 'Cross Org Actor', 'cross-org-lifecycle@local.invalid', 'ACTIVE'),
  ('77777777-0000-4000-8000-000000000004', 'No Membership User', 'no-member@local.invalid', 'ACTIVE'),
  ('77777777-0000-4000-8000-000000000005', 'Inactive Member User', 'inactive-member@local.invalid', 'ACTIVE'),
  ('77777777-0000-4000-8000-000000000006', 'Inactive User', 'inactive-user@local.invalid', 'INACTIVE'),
  ('77777777-0000-4000-8000-000000000007', 'Inactive Org Member', 'inactive-org-member@local.invalid', 'ACTIVE'),
  ('77777777-0000-4000-8000-000000000008', 'Admin Actor', 'admin-lifecycle@local.invalid', 'ACTIVE');

-- Memberships
insert into app.organization_members(organization_id, user_id, role_id, status)
select org, '77777777-0000-4000-8000-000000000001', (select id from app.roles where organization_id=org and code='SALES'), 'ACTIVE' from test_ctx;

insert into app.organization_members(organization_id, user_id, role_id, status)
select org, '77777777-0000-4000-8000-000000000002', (select id from app.roles where organization_id=org and code='QC'), 'ACTIVE' from test_ctx;

insert into app.organization_members(organization_id, user_id, role_id, status)
values ('99999999-0000-4000-8000-000000000001', '77777777-0000-4000-8000-000000000003', (select id from app.roles limit 1), 'ACTIVE');

insert into app.organization_members(organization_id, user_id, role_id, status)
select org, '77777777-0000-4000-8000-000000000005', (select id from app.roles where organization_id=org and code='ADMIN'), 'INACTIVE' from test_ctx;

insert into app.organization_members(organization_id, user_id, role_id, status)
select org, '77777777-0000-4000-8000-000000000006', (select id from app.roles where organization_id=org and code='ADMIN'), 'ACTIVE' from test_ctx;

insert into app.organization_members(organization_id, user_id, role_id, status)
values ('99999999-0000-4000-8000-000000000002', '77777777-0000-4000-8000-000000000007', (select id from app.roles limit 1), 'ACTIVE');

insert into app.organization_members(organization_id, user_id, role_id, status)
select org, '77777777-0000-4000-8000-000000000008', (select id from app.roles where organization_id=org and code='ADMIN'), 'ACTIVE' from test_ctx;

-- Create test order in CONFIRMED status
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
from test_ctx;

-- 1. Authorization Fail-Closed Guards (F1)
-- 1a: User without membership rejected
select throws_ok(
  $q$select app.transition_order_status((select org from test_ctx), '77777777-0000-4000-8000-000000000004', '66666666-0000-4000-8000-000000000001', 'ACTIVE')$q$,
  'P0001',
  'Active organization membership required',
  'User without membership rejected (fail-closed)'
);

-- 1b: Inactive membership rejected
select throws_ok(
  $q$select app.transition_order_status((select org from test_ctx), '77777777-0000-4000-8000-000000000005', '66666666-0000-4000-8000-000000000001', 'ACTIVE')$q$,
  'P0001',
  'Active organization membership required',
  'Inactive membership rejected (fail-closed)'
);

-- 1c: Inactive user rejected
select throws_ok(
  $q$select app.transition_order_status((select org from test_ctx), '77777777-0000-4000-8000-000000000006', '66666666-0000-4000-8000-000000000001', 'ACTIVE')$q$,
  'P0001',
  'Active organization membership required',
  'Inactive user rejected (fail-closed)'
);

-- 1d: Inactive organization member rejected
select throws_ok(
  $q$select app.transition_order_status('99999999-0000-4000-8000-000000000002', '77777777-0000-4000-8000-000000000007', '66666666-0000-4000-8000-000000000001', 'ACTIVE')$q$,
  'P0001',
  'Active organization membership required',
  'Inactive organization member rejected (fail-closed)'
);

-- 1e: Cross-org actor rejected
select throws_ok(
  $q$select app.transition_order_status((select org from test_ctx), '77777777-0000-4000-8000-000000000003', '66666666-0000-4000-8000-000000000001', 'ACTIVE')$q$,
  'P0001',
  'Active organization membership required',
  'Cross-org actor rejected from transitioning order'
);

-- 1f: SALES actor rejected
select throws_ok(
  $q$select app.transition_order_status((select org from test_ctx), '77777777-0000-4000-8000-000000000001', '66666666-0000-4000-8000-000000000001', 'ACTIVE')$q$,
  'P0001',
  'Unauthorized to update order status',
  'SALES actor rejected from transitioning order'
);

-- 1g: QC actor rejected
select throws_ok(
  $q$select app.transition_order_status((select org from test_ctx), '77777777-0000-4000-8000-000000000002', '66666666-0000-4000-8000-000000000001', 'ACTIVE')$q$,
  'P0001',
  'Unauthorized to update order status',
  'QC actor rejected from transitioning order'
);

-- Verify order state and audit remains completely unchanged after denied attempts
select is(
  (select status from app.orders where id = '66666666-0000-4000-8000-000000000001'),
  'CONFIRMED',
  'Order remains CONFIRMED after denied authorization attempts'
);

select is(
  (select count(*)::integer from app.order_audit where order_id = '66666666-0000-4000-8000-000000000001'),
  0,
  'No audit residue created from denied authorization attempts'
);

-- 2. Invalid Transition Graph (AC-02)
select throws_ok(
  $q$select app.transition_order_status((select org from test_ctx), (select owner_actor from test_ctx), '66666666-0000-4000-8000-000000000001', 'COMPLETED')$q$,
  'P0001',
  NULL,
  'Cannot skip directly from CONFIRMED to COMPLETED'
);

select throws_ok(
  $q$select app.transition_order_status((select org from test_ctx), (select owner_actor from test_ctx), '66666666-0000-4000-8000-000000000001', 'INVALID_STATUS')$q$,
  'P0001',
  NULL,
  'Invalid status string rejected'
);

-- 3. Idempotent No-Op Transition
select is(
  (select (app.transition_order_status((select org from test_ctx), (select owner_actor from test_ctx), '66666666-0000-4000-8000-000000000001', 'CONFIRMED'))->>'already_in_status'),
  'true',
  'Transition to current status returns already_in_status: true'
);

-- 4. Valid Transition: CONFIRMED -> ACTIVE (AC-01) by valid ADMIN
select lives_ok(
  $q$select app.transition_order_status((select org from test_ctx), '77777777-0000-4000-8000-000000000008', '66666666-0000-4000-8000-000000000001', 'ACTIVE', 'Admin memulai operasional')$q$,
  'CONFIRMED to ACTIVE transition succeeds for valid ADMIN'
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
  $q$select app.transition_order_status((select org from test_ctx), (select owner_actor from test_ctx), '66666666-0000-4000-8000-000000000001', 'ON_HOLD', 'Menunggu konfirmasi spesifikasi pelanggan')$q$,
  'ACTIVE to ON_HOLD transition succeeds'
);

select is(
  (select status from app.orders where id = '66666666-0000-4000-8000-000000000001'),
  'ON_HOLD',
  'Order status updated to ON_HOLD'
);

select throws_ok(
  $q$select app.transition_order_status((select org from test_ctx), (select owner_actor from test_ctx), '66666666-0000-4000-8000-000000000001', 'COMPLETED')$q$,
  'P0001',
  NULL,
  'ON_HOLD cannot transition directly to COMPLETED'
);

select lives_ok(
  $q$select app.transition_order_status((select org from test_ctx), (select owner_actor from test_ctx), '66666666-0000-4000-8000-000000000001', 'ACTIVE', 'Spesifikasi terkonfirmasi, lanjut')$q$,
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
  $q$select app.transition_order_status((select org from test_ctx), (select owner_actor from test_ctx), '66666666-0000-4000-8000-000000000001', 'COMPLETED')$q$,
  'P0001',
  NULL,
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
  'DO-TEST-01', 'DISPATCHED', 'JNE', owner_actor
from test_ctx;

select throws_ok(
  $q$select app.transition_order_status((select org from test_ctx), (select owner_actor from test_ctx), '66666666-0000-4000-8000-000000000001', 'COMPLETED')$q$,
  'P0001',
  NULL,
  'ACTIVE to COMPLETED blocked by undelivered shipments'
);

-- Deliver the shipment
update app.shipments set status = 'DELIVERED', delivered_date = now() where id = '33333333-0000-4000-8000-000000000001';

-- 8. Completion Guard: Financial Obligations (AC-07)
-- Insert an unpaid issued commercial invoice
insert into app.invoices (
  id, organization_id, brand_id, order_id, customer_account_id,
  invoice_number, invoice_type, status, amount_subtotal, amount_shipping, amount_total, balance_due,
  due_date, created_by_user_id
) select
  '22222222-0000-4000-8000-000000000001', org, brand, '66666666-0000-4000-8000-000000000001', customer,
  'INV-TEST-01', 'FULL_PAYMENT', 'ISSUED', 100000, 15000, 115000, 115000,
  current_date + 7, owner_actor
from test_ctx;

select throws_ok(
  $q$select app.transition_order_status((select org from test_ctx), (select owner_actor from test_ctx), '66666666-0000-4000-8000-000000000001', 'COMPLETED')$q$,
  'P0001',
  NULL,
  'ACTIVE to COMPLETED blocked by unpaid commercial invoice'
);

-- Settle the invoice
update app.invoices set status = 'PAID', amount_paid = 115000, balance_due = 0, paid_at = now() where id = '22222222-0000-4000-8000-000000000001';

-- 9. Eligible ACTIVE Order Can Complete (AC-08)
select lives_ok(
  $q$select app.transition_order_status((select org from test_ctx), (select owner_actor from test_ctx), '66666666-0000-4000-8000-000000000001', 'COMPLETED', 'Seluruh kewajiban produksi, pengiriman, dan pembayaran lunas')$q$,
  'Eligible ACTIVE order completes successfully'
);

select is(
  (select status from app.orders where id = '66666666-0000-4000-8000-000000000001'),
  'COMPLETED',
  'Order status updated to COMPLETED'
);

-- 10. Terminal State Protection (AC-03, AC-04)
select throws_ok(
  $q$select app.transition_order_status((select org from test_ctx), (select owner_actor from test_ctx), '66666666-0000-4000-8000-000000000001', 'ACTIVE')$q$,
  'P0001',
  NULL,
  'COMPLETED order cannot leave terminal state'
);

select throws_ok(
  $q$select app.transition_order_status((select org from test_ctx), (select owner_actor from test_ctx), '66666666-0000-4000-8000-000000000001', 'CANCELLED')$q$,
  'P0001',
  NULL,
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
  $q$select app.transition_order_status((select org from test_ctx), (select owner_actor from test_ctx), '66666666-0000-4000-8000-000000000002', 'CANCELLED', 'Pelanggan membatalkan pesanan')$q$,
  'CONFIRMED to CANCELLED transition succeeds'
);

select throws_ok(
  $q$select app.transition_order_status((select org from test_ctx), (select owner_actor from test_ctx), '66666666-0000-4000-8000-000000000002', 'ACTIVE')$q$,
  'P0001',
  NULL,
  'CANCELLED order cannot leave terminal state'
);

select * from finish();
rollback;
