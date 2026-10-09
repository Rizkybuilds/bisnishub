begin;
select plan(37);

-- ============================================================================
-- 1. Database Privilege Catalog Verification (SEC-01 Fail-Closed Hardening)
-- ============================================================================

-- Function execute privileges: authenticated role strictly denied
select ok(
  not has_function_privilege('authenticated', 'app.payment_actor_role(uuid,uuid)', 'EXECUTE'),
  'authenticated denied EXECUTE on app.payment_actor_role'
);
select ok(
  not has_function_privilege('authenticated', 'app.record_payment_and_allocate(uuid,uuid,uuid,text,bigint,date,text,text,text,text,text,text,text,text,jsonb,uuid)', 'EXECUTE'),
  'authenticated denied EXECUTE on app.record_payment_and_allocate'
);
select ok(
  not has_function_privilege('authenticated', 'app.allocate_existing_payment(uuid,uuid,uuid,uuid,bigint,text)', 'EXECUTE'),
  'authenticated denied EXECUTE on app.allocate_existing_payment'
);
select ok(
  not has_function_privilege('authenticated', 'app.revert_payment(uuid,uuid,uuid,text)', 'EXECUTE'),
  'authenticated denied EXECUTE on app.revert_payment'
);
select ok(
  not has_function_privilege('authenticated', 'app.create_retail_order(uuid,uuid,uuid,uuid,jsonb,uuid,jsonb,bigint,text,boolean,text,text,text)', 'EXECUTE'),
  'authenticated denied EXECUTE on app.create_retail_order'
);

-- Function execute privileges: anon role strictly denied
select ok(
  not has_function_privilege('anon', 'app.payment_actor_role(uuid,uuid)', 'EXECUTE'),
  'anon denied EXECUTE on app.payment_actor_role'
);
select ok(
  not has_function_privilege('anon', 'app.record_payment_and_allocate(uuid,uuid,uuid,text,bigint,date,text,text,text,text,text,text,text,text,jsonb,uuid)', 'EXECUTE'),
  'anon denied EXECUTE on app.record_payment_and_allocate'
);
select ok(
  not has_function_privilege('anon', 'app.allocate_existing_payment(uuid,uuid,uuid,uuid,bigint,text)', 'EXECUTE'),
  'anon denied EXECUTE on app.allocate_existing_payment'
);
select ok(
  not has_function_privilege('anon', 'app.revert_payment(uuid,uuid,uuid,text)', 'EXECUTE'),
  'anon denied EXECUTE on app.revert_payment'
);
select ok(
  not has_function_privilege('anon', 'app.create_retail_order(uuid,uuid,uuid,uuid,jsonb,uuid,jsonb,bigint,text,boolean,text,text,text)', 'EXECUTE'),
  'anon denied EXECUTE on app.create_retail_order'
);

-- Function execute privileges: public pseudo-role strictly denied
select ok(
  not has_function_privilege('public', 'app.payment_actor_role(uuid,uuid)', 'EXECUTE'),
  'public denied EXECUTE on app.payment_actor_role'
);
select ok(
  not has_function_privilege('public', 'app.record_payment_and_allocate(uuid,uuid,uuid,text,bigint,date,text,text,text,text,text,text,text,text,jsonb,uuid)', 'EXECUTE'),
  'public denied EXECUTE on app.record_payment_and_allocate'
);
select ok(
  not has_function_privilege('public', 'app.allocate_existing_payment(uuid,uuid,uuid,uuid,bigint,text)', 'EXECUTE'),
  'public denied EXECUTE on app.allocate_existing_payment'
);
select ok(
  not has_function_privilege('public', 'app.revert_payment(uuid,uuid,uuid,text)', 'EXECUTE'),
  'public denied EXECUTE on app.revert_payment'
);
select ok(
  not has_function_privilege('public', 'app.create_retail_order(uuid,uuid,uuid,uuid,jsonb,uuid,jsonb,bigint,text,boolean,text,text,text)', 'EXECUTE'),
  'public denied EXECUTE on app.create_retail_order'
);

-- Function execute privileges: service_role granted
select ok(
  has_function_privilege('service_role', 'app.payment_actor_role(uuid,uuid)', 'EXECUTE'),
  'service_role granted EXECUTE on app.payment_actor_role'
);
select ok(
  has_function_privilege('service_role', 'app.record_payment_and_allocate(uuid,uuid,uuid,text,bigint,date,text,text,text,text,text,text,text,text,jsonb,uuid)', 'EXECUTE'),
  'service_role granted EXECUTE on app.record_payment_and_allocate'
);
select ok(
  has_function_privilege('service_role', 'app.allocate_existing_payment(uuid,uuid,uuid,uuid,bigint,text)', 'EXECUTE'),
  'service_role granted EXECUTE on app.allocate_existing_payment'
);
select ok(
  has_function_privilege('service_role', 'app.revert_payment(uuid,uuid,uuid,text)', 'EXECUTE'),
  'service_role granted EXECUTE on app.revert_payment'
);
select ok(
  has_function_privilege('service_role', 'app.create_retail_order(uuid,uuid,uuid,uuid,jsonb,uuid,jsonb,bigint,text,boolean,text,text,text)', 'EXECUTE'),
  'service_role granted EXECUTE on app.create_retail_order'
);

-- ============================================================================
-- 2. Negative Direct Access Tests: Role authenticated (AC-004)
-- ============================================================================

set local role authenticated;

select throws_matching(
  $$ select app.payment_actor_role('00000000-0000-0000-0000-000000000001'::uuid, '00000000-0000-0000-0000-000000000002'::uuid) $$,
  'permission denied for function payment_actor_role',
  'authenticated role denied direct call to app.payment_actor_role'
);

select throws_matching(
  $$ select app.record_payment_and_allocate(
    '00000000-0000-0000-0000-000000000001'::uuid,
    '00000000-0000-0000-0000-000000000002'::uuid,
    '00000000-0000-0000-0000-000000000003'::uuid,
    'BANK_TRANSFER',
    1000000
  ) $$,
  'permission denied for function record_payment_and_allocate',
  'authenticated role denied direct call to app.record_payment_and_allocate (no actor spoofing)'
);

select throws_matching(
  $$ select app.allocate_existing_payment(
    '00000000-0000-0000-0000-000000000001'::uuid,
    '00000000-0000-0000-0000-000000000002'::uuid,
    '00000000-0000-0000-0000-000000000003'::uuid,
    '00000000-0000-0000-0000-000000000004'::uuid,
    500000
  ) $$,
  'permission denied for function allocate_existing_payment',
  'authenticated role denied direct call to app.allocate_existing_payment'
);

select throws_matching(
  $$ select app.revert_payment(
    '00000000-0000-0000-0000-000000000001'::uuid,
    '00000000-0000-0000-0000-000000000002'::uuid,
    '00000000-0000-0000-0000-000000000003'::uuid,
    'Salah catat'
  ) $$,
  'permission denied for function revert_payment',
  'authenticated role denied direct call to app.revert_payment'
);

select throws_matching(
  $$ select app.create_retail_order(
    '00000000-0000-0000-0000-000000000001'::uuid,
    '00000000-0000-0000-0000-000000000002'::uuid,
    '00000000-0000-0000-0000-000000000003'::uuid,
    '00000000-0000-0000-0000-000000000004'::uuid,
    '[]'::jsonb
  ) $$,
  'permission denied for function create_retail_order',
  'authenticated role denied direct call to app.create_retail_order'
);

reset role;

-- ============================================================================
-- 3. Negative Direct Access Tests: Role anon
-- ============================================================================

set local role anon;

select throws_matching(
  $$ select app.record_payment_and_allocate(
    '00000000-0000-0000-0000-000000000001'::uuid,
    '00000000-0000-0000-0000-000000000002'::uuid,
    '00000000-0000-0000-0000-000000000003'::uuid,
    'BANK_TRANSFER',
    1000000
  ) $$,
  'permission denied',
  'anon role denied direct call to app.record_payment_and_allocate'
);

select throws_matching(
  $$ select app.create_retail_order(
    '00000000-0000-0000-0000-000000000001'::uuid,
    '00000000-0000-0000-0000-000000000002'::uuid,
    '00000000-0000-0000-0000-000000000003'::uuid,
    '00000000-0000-0000-0000-000000000004'::uuid,
    '[]'::jsonb
  ) $$,
  'permission denied',
  'anon role denied direct call to app.create_retail_order'
);

reset role;

-- ============================================================================
-- 4. Positive Execution & Business Invariant Tests: Role service_role
-- ============================================================================

-- Fixture setup
create temporary table boundary_fixture as select
  (select id from app.organizations where code='multigraph-group') as org_id,
  (select id from app.brands where code='TS') as brand_id,
  (select id from app.users where email='founder@multigraph.id') as owner_actor_id,
  (select id from app.customer_accounts where status='ACTIVE' limit 1) as customer_id;

-- Insert test sales actor
insert into app.users (id, name, email) values
  ('77777777-0000-4000-8000-000000000001', 'Boundary Sales Actor', 'boundary_sales@local.invalid')
on conflict (id) do nothing;

insert into app.organization_members (organization_id, user_id, role_id)
select org_id, '77777777-0000-4000-8000-000000000001', (select id from app.roles where organization_id=org_id and code='SALES')
from boundary_fixture
on conflict do nothing;

-- Create an order and invoice using canonical pipeline
create temporary table boundary_req as select app.create_requirement_with_initial_version(
  p_organization_id => org_id,
  p_brand_id => brand_id,
  p_title => 'Boundary Pipeline Test',
  p_summary => '50 pcs Tees for Boundary Hardening Allocation',
  p_customer_account_id => customer_id,
  p_quantity => 50,
  p_actor_id => owner_actor_id
) as result from boundary_fixture;

select app.transition_requirement_status(org_id, (result->>'requirement_id')::uuid, 'READY', owner_actor_id)
from boundary_fixture, boundary_req;

create temporary table boundary_quote as select app.save_quote_version(
  p_organization_id => org_id,
  p_actor_id => owner_actor_id,
  p_request_id => '99999999-0000-4000-8000-000000000001'::uuid,
  p_requirement_version_id => (result->>'version_id')::uuid,
  p_customer_id => customer_id,
  p_unit_price => 100000::bigint,
  p_discount => 0::bigint,
  p_shipping => 50000::bigint,
  p_costs => jsonb_build_array(
    jsonb_build_object('cost_type', 'GARMENT', 'description', 'Blanks', 'quantity', 50, 'unit_cost', 45000)
  ),
  p_valid_until => (current_date + 7)::date,
  p_terms => 'FULL_PAYMENT',
  p_lead_time => '7 days',
  p_notes => 'Boundary quote'
) as result from boundary_fixture, boundary_req;

select app.mark_quote_sent(org_id, owner_actor_id, (result->>'version_id')::uuid)
from boundary_fixture, boundary_quote;

select app.mark_quote_accepted(org_id, owner_actor_id, (result->>'version_id')::uuid, 'WHATSAPP', null, 'Confirmed')
from boundary_fixture, boundary_quote;

create temporary table boundary_order as select app.create_order_from_quote(
  p_organization_id => org_id,
  p_actor_id => owner_actor_id,
  p_request_id => '88888888-0000-4000-8000-000000000001'::uuid,
  p_quote_version_id => (result->>'version_id')::uuid,
  p_shipping_address => jsonb_build_object(
    'recipient_name', 'Boundary Test',
    'phone', '081234567890',
    'street', 'Jl. Sukajadi No. 20',
    'city', 'Bandung'
  )
) as res from boundary_fixture, boundary_quote;

create temporary table boundary_inv as select app.create_invoice_for_order(
  p_organization_id => org_id,
  p_actor_id => owner_actor_id,
  p_order_id => (res->>'order_id')::uuid,
  p_invoice_type => 'FINAL_PAYMENT',
  p_amount_subtotal => 5000000,
  p_amount_shipping => 50000,
  p_amount_tax => 0,
  p_due_date => current_date + 7,
  p_notes => 'Boundary Invoice Test'
) as res from boundary_fixture, boundary_order;

select app.issue_invoice(org_id, owner_actor_id, (res->>'invoice_id')::uuid)
from boundary_fixture, boundary_inv;

grant all on boundary_fixture, boundary_inv, boundary_order, boundary_quote, boundary_req to service_role;

set local role service_role;

-- A. service_role still enforces role authorization (Sales cannot record payment)
select throws_matching(
  format($$ select app.record_payment_and_allocate(
    %L, %L, %L, 'BANK_TRANSFER', 5050000, current_date, 'REF-BOUND-01'
  ) $$,
    (select org_id from boundary_fixture),
    '77777777-0000-4000-8000-000000000001',
    (select brand_id from boundary_fixture)
  ),
  'Not authorized to record payments',
  'service_role execution still rejects unauthorized sales role inside payment_actor_role'
);

-- B. service_role executes successfully with authorized Owner/Finance actor
create temporary table boundary_payment_result as select app.record_payment_and_allocate(
  p_organization_id => (select org_id from boundary_fixture),
  p_actor_id => (select owner_actor_id from boundary_fixture),
  p_brand_id => (select brand_id from boundary_fixture),
  p_payment_method => 'BANK_TRANSFER',
  p_amount => 5050000,
  p_payment_date => current_date,
  p_reference_number => 'REF-SEC01-BOUND',
  p_allocations => jsonb_build_array(
    jsonb_build_object(
      'invoice_id', (select (res->>'invoice_id')::uuid from boundary_inv),
      'amount', 5050000
    )
  )
) as res;

select is(
  (select res->>'status' from boundary_payment_result),
  'CONFIRMED',
  'service_role records payment with CONFIRMED status'
);

select is(
  (select status from app.invoices where id = (select (res->>'invoice_id')::uuid from boundary_inv)),
  'PAID',
  'Allocated invoice status transitioned to PAID'
);

select is(
  (select balance_due from app.invoices where id = (select (res->>'invoice_id')::uuid from boundary_inv)),
  0::bigint,
  'Allocated invoice balance_due reduced to zero'
);

select ok(
  exists(
    select 1 from app.payment_audit
    where payment_id = (select (res->>'payment_id')::uuid from boundary_payment_result)
      and action = 'payment.recorded'
  ),
  'Audit record created in app.payment_audit'
);

select ok(
  exists(
    select 1 from app.financial_ledger_entries
    where reference_id = (select (res->>'payment_id')::uuid from boundary_payment_result)
  ),
  'Analytical financial ledger entry committed via trigger'
);

-- C. Revert payment under service_role
create temporary table boundary_revert_result as select app.revert_payment(
  p_organization_id => (select org_id from boundary_fixture),
  p_actor_id => (select owner_actor_id from boundary_fixture),
  p_payment_id => (select (res->>'payment_id')::uuid from boundary_payment_result),
  p_reason => 'Reversal boundary test'
) as res;

select is(
  (select status from app.payments where id = (select (res->>'payment_id')::uuid from boundary_payment_result)),
  'REVERSED',
  'Payment status transitioned to REVERSED'
);

select is(
  (select status from app.invoices where id = (select (res->>'invoice_id')::uuid from boundary_inv)),
  'ISSUED',
  'Invoice restored to ISSUED status after payment reversal'
);

reset role;

-- ============================================================================
-- 5. Operational Exception Read Access Preservation
-- ============================================================================

set local role authenticated;

select ok(
  has_table_privilege('authenticated', 'app.operational_exceptions', 'SELECT'),
  'authenticated retains SELECT on app.operational_exceptions'
);

select ok(
  has_function_privilege('authenticated', 'app.can_read_operational_exceptions(uuid)', 'EXECUTE'),
  'authenticated retains EXECUTE on app.can_read_operational_exceptions'
);

reset role;

select * from finish();
rollback;
