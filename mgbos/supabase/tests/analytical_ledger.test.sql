begin;
select plan(16);

create temporary table led_ctx as select
  (select id from app.organizations where code='multigraph-group') org,
  (select id from app.brands where code='TS') brand,
  (select id from app.users where email='founder@multigraph.id') owner_actor,
  (select id from app.customer_accounts where status='ACTIVE' limit 1) customer;

-- Create Finance and Sales test users
insert into app.users(id, name, email) values
  ('77777777-0000-4000-8000-000000000001', 'Finance Ledger Tester', 'financeled@local.invalid'),
  ('77777777-0000-4000-8000-000000000002', 'Sales Ledger Tester', 'salesled@local.invalid')
on conflict (id) do nothing;

insert into app.organization_members(organization_id, user_id, role_id)
select org, '77777777-0000-4000-8000-000000000001', (select id from app.roles where organization_id=org and code='FINANCE') from led_ctx
on conflict do nothing;

insert into app.organization_members(organization_id, user_id, role_id)
select org, '77777777-0000-4000-8000-000000000002', (select id from app.roles where organization_id=org and code='SALES') from led_ctx
on conflict do nothing;

-- 1. Schema Structure Tests
select has_table('app', 'financial_ledger_entries', 'Table financial_ledger_entries exists');
select has_view('app', 'order_financial_summaries', 'View order_financial_summaries exists');

select results_eq(
  $$ select relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='app' and c.relname='financial_ledger_entries' $$,
  $$ values(true) $$,
  'RLS is enabled on app.financial_ledger_entries'
);

-- 2. Setup Order Pipeline:
-- Subtotal: 100 pcs * Rp 100.000 = Rp 10.000.000
-- Shipping: Rp 200.000 (Pass-through courier escrow)
-- Grand Total: Rp 10.200.000
-- Estimated Cost: 100 pcs * Rp 50.000 = Rp 5.000.000 (Estimated Margin: 50%)
create temporary table led_req as select app.create_requirement_with_initial_version(
  p_organization_id => org,
  p_brand_id => brand,
  p_title => 'Ledger Pipeline Test',
  p_summary => '100 pcs Custom Tees for Ledger & Margin Analysis',
  p_customer_account_id => customer,
  p_quantity => 100,
  p_actor_id => owner_actor
) result from led_ctx;

select app.transition_requirement_status(org, (result->>'requirement_id')::uuid, 'READY', owner_actor) from led_ctx, led_req;

create temporary table led_quote as select app.save_quote_version(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_request_id => '77777777-0000-4000-8000-000000000010'::uuid,
  p_requirement_version_id => (result->>'version_id')::uuid,
  p_customer_id => customer,
  p_unit_price => 100000::bigint,
  p_discount => 0::bigint,
  p_shipping => 200000::bigint,
  p_costs => jsonb_build_array(
    jsonb_build_object('cost_type', 'GARMENT', 'description', 'Blanks & Printing', 'quantity', 100, 'unit_cost', 50000)
  ),
  p_valid_until => (current_date + 14)::date,
  p_terms => 'DP 50%',
  p_lead_time => '10 days',
  p_notes => 'Ledger pipeline quote'
) result from led_ctx, led_req;

select app.mark_quote_sent(org, owner_actor, (result->>'version_id')::uuid) from led_ctx, led_quote;
select app.mark_quote_accepted(org, owner_actor, (result->>'version_id')::uuid, 'WHATSAPP', null, 'Confirmed') from led_ctx, led_quote;

create temporary table led_order as select app.create_order_from_quote(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_quote_version_id => (result->>'version_id')::uuid,
  p_request_id => '77777777-0000-4000-8000-000000000020'::uuid,
  p_shipping_address => jsonb_build_object('recipient_name', 'Budi', 'phone', '08123456789', 'street', 'Jl. Merdeka 10', 'city', 'Bandung')
) result from led_ctx, led_quote;

-- 3. Assert ORDER_COMMITTED trigger generated ledger entry
select results_eq(
  $$ select count(*)::int from app.financial_ledger_entries where entry_type='ORDER_COMMITTED' and order_id=(select (result->>'order_id')::uuid from led_order) $$,
  $$ values(1) $$,
  'ORDER_COMMITTED financial ledger entry generated on order confirmation'
);

select results_eq(
  $$ select amount, category, direction from app.financial_ledger_entries where entry_type='ORDER_COMMITTED' and order_id=(select (result->>'order_id')::uuid from led_order) $$,
  $$ values(10000000::bigint, 'REVENUE'::text, 'CREDIT'::text) $$,
  'Order committed ledger entry records net product revenue (excluding courier shipping)'
);

-- 4. Assert Analytical View order_financial_summaries isolates shipping
select results_eq(
  $$ select net_product_revenue, courier_shipping_fee, courier_shipping_margin, estimated_margin_pct
     from app.order_financial_summaries
     where order_id=(select (result->>'order_id')::uuid from led_order) $$,
  $$ values(10000000::bigint, 200000::bigint, 0::bigint, 50.00::numeric) $$,
  'Analytical view strictly isolates shipping fee with Rp 0 margin and 50% estimated margin'
);

-- 5. Issue Invoice (DP 50% + Shipping = Rp 5.000.000 + Rp 200.000 = Rp 5.200.000)
create temporary table led_dp_inv as select app.create_invoice_for_order(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_order_id => (result->>'order_id')::uuid,
  p_invoice_type => 'DOWN_PAYMENT',
  p_amount_subtotal => 5000000::bigint,
  p_amount_shipping => 200000::bigint,
  p_amount_tax => 0::bigint,
  p_due_date => (current_date + 3)::date
) result from led_ctx, led_order;

select app.issue_invoice(org, owner_actor, (result->>'invoice_id')::uuid) from led_ctx, led_dp_inv;

-- Assert INVOICE_ISSUED and SHIPPING_ESCROW_RECORDED ledger entries
select results_eq(
  $$ select count(*)::int from app.financial_ledger_entries where entry_type='INVOICE_ISSUED' and reference_id=(select (result->>'invoice_id')::uuid from led_dp_inv) $$,
  $$ values(1) $$,
  'INVOICE_ISSUED ledger entry recorded on invoice issuance'
);

select results_eq(
  $$ select count(*)::int from app.financial_ledger_entries where entry_type='SHIPPING_ESCROW_RECORDED' and reference_id=(select (result->>'invoice_id')::uuid from led_dp_inv) $$,
  $$ values(1) $$,
  'SHIPPING_ESCROW_RECORDED ledger entry recorded for courier shipping'
);

-- 6. Record Payment
create temporary table led_pay as select app.record_payment_and_allocate(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_brand_id => brand,
  p_payment_method => 'BANK_TRANSFER',
  p_amount => 5200000::bigint,
  p_reference_number => 'BCA-LED-001',
  p_allocations => jsonb_build_array(
    jsonb_build_object('invoice_id', (result->>'invoice_id')::uuid, 'amount', 5200000)
  )
) result from led_ctx, led_dp_inv;

select results_eq(
  $$ select count(*)::int from app.financial_ledger_entries where entry_type='PAYMENT_RECEIVED' and reference_id=(select (result->>'payment_id')::uuid from led_pay) $$,
  $$ values(1) $$,
  'PAYMENT_RECEIVED ledger entry recorded on payment confirmation'
);

-- 7. Immutability Guard Tests on financial_ledger_entries
select throws_ok(
  $$ update app.financial_ledger_entries set amount = 9999999 where entry_type='ORDER_COMMITTED' $$,
  'Financial ledger entries are strictly immutable and append-only',
  'Modifying ledger entries is strictly blocked'
);

select throws_ok(
  $$ delete from app.financial_ledger_entries where entry_type='ORDER_COMMITTED' $$,
  'Financial ledger entries are strictly immutable and append-only',
  'Deleting ledger entries is strictly blocked'
);

-- 8. Create Production Job & Test Actual Cost Settlement
create temporary table led_job as select app.create_production_job(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_order_id => (result->>'order_id')::uuid,
  p_job_type => 'GARMENT',
  p_title => 'Bahan Kaos Polos NSA 100 pcs',
  p_estimated_cost => 3500000::bigint
) result from led_ctx, led_order;

-- Test Unauthorized User cannot record actual job cost
select throws_ok(
  format(
    $$ select app.record_actual_job_cost('%s', '77777777-0000-4000-8000-000000000002', '%s', 3800000) $$,
    (select org from led_ctx),
    (select (result->>'job_id')::uuid from led_job)
  ),
  'Unauthorized to record actual job cost',
  'Sales user blocked from recording actual job cost'
);

-- Authorized User (Finance) records actual job cost (e.g. Realisasi Rp 3.800.000 vs Estimasi Rp 3.500.000)
create temporary table led_actual_res as select app.record_actual_job_cost(
  p_organization_id => (select org from led_ctx),
  p_actor_id => '77777777-0000-4000-8000-000000000001'::uuid,
  p_job_id => (select (result->>'job_id')::uuid from led_job),
  p_actual_cost => 3800000::bigint,
  p_notes => 'Harga bahan NSA naik Rp 3.000/pcs dari supplier'
) result;

-- Assert actual_cost updated on production job
select results_eq(
  $$ select actual_cost from app.production_jobs where id=(select (result->>'job_id')::uuid from led_job) $$,
  $$ values(3800000::bigint) $$,
  'Actual cost updated on production job record'
);

-- Assert PRODUCTION_ACTUAL_SETTLED ledger entry generated
select results_eq(
  $$ select count(*)::int from app.financial_ledger_entries where entry_type='PRODUCTION_ACTUAL_SETTLED' and reference_id=(select (result->>'job_id')::uuid from led_job) $$,
  $$ values(1) $$,
  'PRODUCTION_ACTUAL_SETTLED ledger entry generated with actual cost'
);

-- 9. Verify Realized Margin & Health on Analytical View
-- Net Product Revenue = Rp 10.000.000
-- Effective Cost = Rp 3.800.000 (actual on job 1)
-- Realized Gross Profit = 10.000.000 - 3.800.000 = Rp 6.200.000
-- Realized Margin % = 62.00%
-- Health = HEALTHY (>= 35%)
select results_eq(
  $$ select actual_cost, realized_gross_profit, realized_margin_pct, margin_health
     from app.order_financial_summaries
     where order_id=(select (result->>'order_id')::uuid from led_order) $$,
  $$ values(3800000::bigint, 6200000::bigint, 62.00::numeric, 'HEALTHY'::text) $$,
  'Realized gross profit and margin % accurately computed on analytical view'
);

-- 10. Test Margin Health Degradation
-- Update job actual cost to Rp 8.500.000 (Realized Profit = 1.500.000, Margin = 15.00%, Health = CRITICAL)
select app.record_actual_job_cost(
  p_organization_id => (select org from led_ctx),
  p_actor_id => (select owner_actor from led_ctx),
  p_job_id => (select (result->>'job_id')::uuid from led_job),
  p_actual_cost => 8500000::bigint,
  p_notes => 'Biaya membengkak'
);

select results_eq(
  $$ select realized_gross_profit, realized_margin_pct, margin_health
     from app.order_financial_summaries
     where order_id=(select (result->>'order_id')::uuid from led_order) $$,
  $$ values(1500000::bigint, 15.00::numeric, 'CRITICAL'::text) $$,
  'Margin health automatically transitions to CRITICAL when realized margin drops below 20%'
);

rollback;
