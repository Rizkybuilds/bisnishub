begin;
select plan(28);

create temporary table test_ctx as select
  (select id from app.organizations where code='multigraph-group') org,
  (select id from app.brands where code='TS') brand,
  (select id from app.users where email='founder@multigraph.id') owner_actor,
  (select id from app.customer_accounts where status='ACTIVE' limit 1) customer;

-- Create Sales and QC test actors
insert into app.users(id, name, email) values
  ('88888888-0000-4000-8000-000000000001', 'Sales Order Tester', 'sales-order-tester@local.invalid'),
  ('88888888-0000-4000-8000-000000000002', 'QC Order Tester', 'qc-order-tester@local.invalid');

insert into app.organization_members(organization_id, user_id, role_id)
select org, '88888888-0000-4000-8000-000000000001', (select id from app.roles where organization_id=org and code='SALES') from test_ctx;

insert into app.organization_members(organization_id, user_id, role_id)
select org, '88888888-0000-4000-8000-000000000002', (select id from app.roles where organization_id=org and code='QC') from test_ctx;

-- Create customer contact for acceptance testing
insert into app.customer_contacts(id, customer_account_id, name, email, phone, position)
select '88888888-0000-4000-8000-000000000010', customer, 'Budi Purchasing', 'budi@client.invalid', '081234567890', 'Purchasing' from test_ctx;

-- Create requirement and advance to READY
create temporary table test_req as select app.create_requirement_with_initial_version(
  p_organization_id => org,
  p_brand_id => brand,
  p_title => 'Order Contract Pilot',
  p_summary => '50 pcs Custom Oversized Tees',
  p_customer_account_id => customer,
  p_quantity => 50,
  p_actor_id => owner_actor
) result from test_ctx;

select app.transition_requirement_status(org, (result->>'requirement_id')::uuid, 'READY', owner_actor) from test_ctx, test_req;

-- Create draft quote (50 pcs @ Rp 120.000 = Rp 6.000.000, shipping Rp 150.000, cost Rp 3.500.000 -> Target margin)
create temporary table test_quote as select app.save_quote_version(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_request_id => '77777777-0000-4000-8000-000000000001',
  p_requirement_version_id => (result->>'version_id')::uuid,
  p_customer_id => customer,
  p_unit_price => 120000,
  p_discount => 0,
  p_shipping => 150000,
  p_costs => jsonb_build_array(
    jsonb_build_object('cost_type', 'GARMENT', 'description', 'Cotton Combed 24s Heavyweight', 'quantity', 50, 'unit_cost', 50000),
    jsonb_build_object('cost_type', 'PRINTING', 'description', 'DTF Print A3 Front + A6 Nape', 'quantity', 50, 'unit_cost', 20000)
  ),
  p_valid_until => current_date + 14,
  p_terms => 'DP 50% pelunasan sebelum kirim',
  p_lead_time => '7 hari kerja',
  p_notes => 'Pilot contract'
) result from test_ctx, test_req;

-- 1. Test Quote Acceptance Guards
-- Cannot accept DRAFT quote
select throws_ok(
  $q$select app.mark_quote_accepted(org, '88888888-0000-4000-8000-000000000001', (result->>'version_id')::uuid, 'WHATSAPP') from test_ctx, test_quote$q$,
  'P0001',
  'Only sent quote may be accepted',
  'Draft quote cannot be accepted'
);

-- Send the quote
select lives_ok(
  $q$select app.mark_quote_sent(org, owner_actor, (result->>'version_id')::uuid) from test_ctx, test_quote$q$,
  'Quote transitioned to SENT'
);

-- QC actor cannot accept quote
select throws_ok(
  $q$select app.mark_quote_accepted(org, '88888888-0000-4000-8000-000000000002', (result->>'version_id')::uuid, 'WHATSAPP') from test_ctx, test_quote$q$,
  'P0001',
  'Not authorized to accept quotes',
  'QC role cannot accept quotes'
);

-- Invalid acceptance method fails
select throws_ok(
  $q$select app.mark_quote_accepted(org, '88888888-0000-4000-8000-000000000001', (result->>'version_id')::uuid, 'TELEPATHY') from test_ctx, test_quote$q$,
  'P0001',
  'Invalid acceptance method; must be WHATSAPP, EMAIL, SIGNATURE, or DIRECT',
  'Invalid acceptance method rejected'
);

-- Happy path acceptance by Sales
select lives_ok(
  $q$select app.mark_quote_accepted(
    org,
    '88888888-0000-4000-8000-000000000001',
    (result->>'version_id')::uuid,
    'WHATSAPP',
    '88888888-0000-4000-8000-000000000010',
    'Customer confirmed via WhatsApp official chat'
  ) from test_ctx, test_quote$q$,
  'Sales accepts quote successfully'
);

-- Check quote status & details
select is(
  (select status from app.quote_versions where id = (select (result->>'version_id')::uuid from test_quote)),
  'ACCEPTED',
  'Quote version status updated to ACCEPTED'
);

select ok(
  (select accepted_at is not null from app.quote_versions where id = (select (result->>'version_id')::uuid from test_quote)),
  'Accepted timestamp recorded'
);

select is(
  (select acceptance_details->>'method' from app.quote_versions where id = (select (result->>'version_id')::uuid from test_quote)),
  'WHATSAPP',
  'Acceptance method persisted in details'
);

-- Acceptance idempotency
select lives_ok(
  $q$select app.mark_quote_accepted(org, '88888888-0000-4000-8000-000000000001', (result->>'version_id')::uuid, 'WHATSAPP') from test_ctx, test_quote$q$,
  'Acceptance retry is idempotent'
);

-- 2. Test Order Creation from Quote
-- QC cannot create order
select throws_ok(
  $q$select app.create_order_from_quote(
    org, '88888888-0000-4000-8000-000000000002', gen_random_uuid(), (result->>'version_id')::uuid,
    '{"recipient_name":"Budi","phone":"08123456789","street":"Jl. Sudirman 10","city":"Jakarta Selatan"}'::jsonb
  ) from test_ctx, test_quote$q$,
  'P0001',
  'Not authorized to create orders',
  'QC actor rejected from order creation'
);

-- Missing shipping address fields rejected
select throws_ok(
  $q$select app.create_order_from_quote(
    org, '88888888-0000-4000-8000-000000000001', gen_random_uuid(), (result->>'version_id')::uuid,
    '{"recipient_name":"Budi"}'::jsonb
  ) from test_ctx, test_quote$q$,
  'P0001',
  'Shipping address must include recipient_name, phone, street, and city',
  'Incomplete shipping address rejected'
);

-- Happy path: Create Order Contract
create temporary table test_order as select app.create_order_from_quote(
  p_organization_id => org,
  p_actor_id => '88888888-0000-4000-8000-000000000001',
  p_request_id => '66666666-0000-4000-8000-000000000001',
  p_quote_version_id => (result->>'version_id')::uuid,
  p_shipping_address => jsonb_build_object(
    'recipient_name', 'Budi Purchasing',
    'phone', '081234567890',
    'street', 'Gedung Menara Mandiri Lt. 12, Jl. Jend. Sudirman Kav. 54-55',
    'city', 'Jakarta Selatan',
    'province', 'DKI Jakarta',
    'postal_code', '12190',
    'courier_service', 'J&T Cargo',
    'notes', 'Drop di loading dock B'
  ),
  p_notes => 'Official order contract confirmation'
) result from test_ctx, test_quote;

-- Verify order fields
select is(
  (select status from app.orders where id = (select (result->>'order_id')::uuid from test_order)),
  'CONFIRMED',
  'Order initial status is CONFIRMED'
);

select ok(
  (select order_number like 'TS-O-%' from app.orders where id = (select (result->>'order_id')::uuid from test_order)),
  'Order number follows canonical TS-O-YYYY-XXXXXX format'
);

select is(
  (select subtotal from app.orders where id = (select (result->>'order_id')::uuid from test_order)),
  6000000::bigint,
  'Order subtotal matches quote subtotal (Zero-Float bigint)'
);

select is(
  (select shipping_total from app.orders where id = (select (result->>'order_id')::uuid from test_order)),
  150000::bigint,
  'Order shipping matches quote shipping pass-through'
);

select is(
  (select grand_total from app.orders where id = (select (result->>'order_id')::uuid from test_order)),
  6150000::bigint,
  'Order grand total is exact sum of revenue and shipping'
);

select is(
  (select shipping_address_snapshot->>'recipient_name' from app.orders where id = (select (result->>'order_id')::uuid from test_order)),
  'Budi Purchasing',
  'Shipping address snapshot frozen in order'
);

select is(
  (select count(*)::integer from app.order_items where order_id = (select (result->>'order_id')::uuid from test_order)),
  1,
  'Order item generated from quote item'
);

select is(
  (select quantity from app.order_items where order_id = (select (result->>'order_id')::uuid from test_order)),
  50,
  'Order item quantity matches 50 pcs'
);

select ok(
  (select specification_snapshot is not null from app.order_items where order_id = (select (result->>'order_id')::uuid from test_order)),
  'Specification snapshot preserved in order item'
);

select is(
  (select count(*)::integer from app.order_audit where order_id = (select (result->>'order_id')::uuid from test_order) and action = 'order.created_from_quote'),
  1,
  'Order creation audit trail recorded'
);

-- Idempotency retry with same request_id
select is(
  (select app.create_order_from_quote(
    org, '88888888-0000-4000-8000-000000000001', '66666666-0000-4000-8000-000000000001', (result->>'version_id')::uuid,
    '{"recipient_name":"Budi","phone":"08123456789","street":"Jl. Sudirman 10","city":"Jakarta Selatan"}'::jsonb
  )->>'is_retry' from test_ctx, test_quote),
  'true',
  'Retry with same request ID returns existing order with is_retry: true'
);

-- Retry with new request_id on already ordered quote version
select is(
  (select app.create_order_from_quote(
    org, '88888888-0000-4000-8000-000000000001', gen_random_uuid(), (result->>'version_id')::uuid,
    '{"recipient_name":"Budi","phone":"08123456789","street":"Jl. Sudirman 10","city":"Jakarta Selatan"}'::jsonb
  )->>'is_retry' from test_ctx, test_quote),
  'true',
  'Attempt to duplicate order from same quote version returns existing order contract'
);

-- 3. Immutability Guards
-- Attempting to alter financial subtotal on order throws exception
select throws_ok(
  $q$update app.orders set subtotal = subtotal + 1000 where id = (select (result->>'order_id')::uuid from test_order)$q$,
  'P0001',
  'Order contract is immutable; financial values, addresses, and item specifications cannot be altered',
  'Order financial fields are tamper-proof'
);

-- Attempting to alter shipping address snapshot on order throws exception
select throws_ok(
  $q$update app.orders set shipping_address_snapshot = '{"city":"Bandung"}'::jsonb where id = (select (result->>'order_id')::uuid from test_order)$q$,
  'P0001',
  'Order contract is immutable; financial values, addresses, and item specifications cannot be altered',
  'Order frozen address is tamper-proof'
);

-- Attempting to alter specification on order item throws exception
select throws_ok(
  $q$update app.order_items set specification_snapshot = '{"altered":true}'::jsonb where order_id = (select (result->>'order_id')::uuid from test_order)$q$,
  'P0001',
  'Order history is append-only',
  'Order item specification is tamper-proof'
);

-- Deleting order is blocked
select throws_ok(
  $q$delete from app.orders where id = (select (result->>'order_id')::uuid from test_order)$q$,
  'P0001',
  'Order history is append-only',
  'Order deletion blocked'
);

-- Updating mutable lifecycle status works
select lives_ok(
  $q$update app.orders set status = 'ACTIVE', updated_at = now() where id = (select (result->>'order_id')::uuid from test_order)$q$,
  'Order status progression to ACTIVE is permitted'
);

select * from finish();
rollback;
