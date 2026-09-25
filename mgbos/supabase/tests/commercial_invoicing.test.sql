begin;
select plan(20);

create temporary table inv_ctx as select
  (select id from app.organizations where code='multigraph-group') org,
  (select id from app.brands where code='TS') brand,
  (select id from app.users where email='founder@multigraph.id') owner_actor,
  (select id from app.customer_accounts where status='ACTIVE' limit 1) customer;

-- Create Finance and Sales test users
insert into app.users(id, name, email) values
  ('99999999-0000-4000-8000-000000000001', 'Finance Person', 'finance@local.invalid'),
  ('99999999-0000-4000-8000-000000000002', 'Sales Rep', 'salesrep@local.invalid')
on conflict (id) do nothing;

insert into app.organization_members(organization_id, user_id, role_id)
select org, '99999999-0000-4000-8000-000000000001', (select id from app.roles where organization_id=org and code='FINANCE') from inv_ctx
on conflict do nothing;

insert into app.organization_members(organization_id, user_id, role_id)
select org, '99999999-0000-4000-8000-000000000002', (select id from app.roles where organization_id=org and code='SALES') from inv_ctx
on conflict do nothing;

-- Setup full upstream pipeline: Requirement -> Quote -> Order Contract (Grand Total = Rp 10.000.000)
create temporary table inv_req as select app.create_requirement_with_initial_version(
  p_organization_id => org,
  p_brand_id => brand,
  p_title => 'Invoicing Pipeline Test',
  p_summary => '100 pcs Custom Tees',
  p_customer_account_id => customer,
  p_quantity => 100,
  p_actor_id => owner_actor
) result from inv_ctx;

select app.transition_requirement_status(org, (result->>'requirement_id')::uuid, 'READY', owner_actor) from inv_ctx, inv_req;

create temporary table inv_quote as select app.save_quote_version(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_request_id => '55555555-0000-4000-8000-000000000003',
  p_requirement_version_id => (result->>'version_id')::uuid,
  p_customer_id => customer,
  p_unit_price => 100000,
  p_discount => 0,
  p_shipping => 200000,
  p_costs => jsonb_build_array(
    jsonb_build_object('cost_type', 'GARMENT', 'description', 'Blanks', 'quantity', 100, 'unit_cost', 45000)
  ),
  p_valid_until => current_date + 14,
  p_terms => 'DP 50%',
  p_lead_time => '10 days',
  p_notes => 'Commercial invoicing quote'
) result from inv_ctx, inv_req;

select app.mark_quote_sent(org, owner_actor, (result->>'version_id')::uuid) from inv_ctx, inv_quote;
select app.mark_quote_accepted(org, owner_actor, (result->>'version_id')::uuid, 'WHATSAPP', null, 'Confirmed') from inv_ctx, inv_quote;

create temporary table inv_order as select app.create_order_from_quote(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_request_id => '44444444-0000-4000-8000-000000000003',
  p_quote_version_id => (result->>'version_id')::uuid,
  p_shipping_address => jsonb_build_object(
    'recipient_name', 'Hendra Client',
    'phone', '081234567890',
    'street', 'Jl. Braga No. 15',
    'city', 'Bandung'
  )
) result from inv_ctx, inv_quote;

-- 1. Test Draft DP Invoice Creation by SALES (Rp 5.100.000 = 50% of Grand Total Rp 10.200.000)
create temporary table test_dp_inv as select app.create_invoice_for_order(
  p_organization_id => org,
  p_actor_id => '99999999-0000-4000-8000-000000000002', -- Sales
  p_order_id => (result->>'order_id')::uuid,
  p_invoice_type => 'DOWN_PAYMENT',
  p_amount_subtotal => 5000000,
  p_amount_shipping => 100000,
  p_amount_tax => 0,
  p_due_date => current_date + 3,
  p_notes => 'Invoice DP 50%'
) res from inv_ctx, inv_order;

select ok((res->>'invoice_id') is not null, 'DP Invoice created successfully') from test_dp_inv;
select is((res->>'status'), 'DRAFT', 'Invoice initialized in DRAFT status') from test_dp_inv;
select matches((res->>'invoice_number'), '^TS-INV-\d{4}-\d{6}$', 'Invoice number matches TS-INV-YYYY-XXXXXX format') from test_dp_inv;

-- 2. Test Balance Due Arithmetic
select is(
  (select balance_due from app.invoices where id = (select (res->>'invoice_id')::uuid from test_dp_inv)),
  5100000::bigint,
  'Balance due equals amount_total for unpaid invoice'
);

-- 3. Test Order Ceiling Guard: Attempting to invoice more than order grand total (Rp 10.200.000)
select throws_ok(
  format('select app.create_invoice_for_order(%L, %L, %L, %L, %L)',
    (select org from inv_ctx),
    '99999999-0000-4000-8000-000000000002',
    (select (result->>'order_id')::uuid from inv_order),
    'FINAL_PAYMENT',
    6000000 -- 5.1M + 6.0M = 11.1M > 10.2M!
  ),
  'Total invoiced amounts (Rp 11100000) would exceed order grand total (Rp 10200000)',
  'Order financial ceiling strictly prevents over-invoicing'
);

-- 4. Test RBAC: Sales cannot issue formal invoice
select throws_ok(
  format('select app.issue_invoice(%L, %L, %L)',
    (select org from inv_ctx),
    '99999999-0000-4000-8000-000000000002', -- Sales
    (select (res->>'invoice_id')::uuid from test_dp_inv)
  ),
  'Not authorized to issue formal invoices',
  'Sales role cannot officially issue invoices'
);

-- 5. Test Issue Invoice by FINANCE
create temporary table test_issue_res as select app.issue_invoice(
  p_organization_id => org,
  p_actor_id => '99999999-0000-4000-8000-000000000001', -- Finance
  p_invoice_id => (select (res->>'invoice_id')::uuid from test_dp_inv)
) res from inv_ctx;

select is((res->>'status'), 'ISSUED', 'Invoice officially ISSUED by Finance') from test_issue_res;
select ok((select issued_at from app.invoices where id = (select (res->>'invoice_id')::uuid from test_dp_inv)) is not null, 'issued_at timestamp set');
select is((select (bank_account_snapshot->>'bank_name') from app.invoices where id = (select (res->>'invoice_id')::uuid from test_dp_inv)), 'Bank Central Asia (BCA)', 'Bank coordinates snapshot captured');

-- 6. Test Immutability Guard: Cannot alter amount on ISSUED invoice
select throws_ok(
  format('update app.invoices set amount_total = 6000000 where id = %L',
    (select (res->>'invoice_id')::uuid from test_dp_inv)
  ),
  'Issued invoices are immutable; amounts, customer details, and bank snapshots cannot be altered. Void and reissue instead.',
  'Database snapshot guard prevents tampering with issued invoice amounts'
);

-- 7. Test Void Invoice by FINANCE
create temporary table test_void_res as select app.void_invoice(
  p_organization_id => org,
  p_actor_id => '99999999-0000-4000-8000-000000000001', -- Finance
  p_invoice_id => (select (res->>'invoice_id')::uuid from test_dp_inv),
  p_reason => 'Customer requested change to full upfront payment'
) res from inv_ctx;

select is((res->>'status'), 'VOID', 'Invoice successfully voided') from test_void_res;
select ok((select count(*) from app.invoice_audit where invoice_id = (select (res->>'invoice_id')::uuid from test_dp_inv) and action = 'invoice.voided') = 1, 'Void action logged to audit trail');

-- 8. Test Reissuing Full Payment Invoice after Voiding DP
create temporary table test_full_inv as select app.create_invoice_for_order(
  p_organization_id => org,
  p_actor_id => '99999999-0000-4000-8000-000000000001', -- Finance
  p_order_id => (result->>'order_id')::uuid,
  p_invoice_type => 'FULL_PAYMENT',
  p_amount_subtotal => 10000000,
  p_amount_shipping => 200000,
  p_amount_tax => 0,
  p_due_date => current_date + 7
) res from inv_ctx, inv_order;

select ok((res->>'invoice_id') is not null, 'Full payment invoice created after voiding previous invoice') from test_full_inv;
select is((res->>'amount_total')::bigint, 10200000::bigint, 'Full payment amount equals order grand total') from test_full_inv;

-- 9. Test Non-member actor rejected by create_invoice_for_order
select throws_ok(
  format('select app.create_invoice_for_order(%L, %L, %L, %L, %L)',
    (select org from inv_ctx),
    '11111111-2222-3333-4444-555555555555',
    (select (result->>'order_id')::uuid from inv_order),
    'DOWN_PAYMENT',
    1000000
  ),
  'Not authorized to create invoices',
  'Non-member actor cannot create invoices'
);

-- 10. Test Non-member actor rejected by issue_invoice
select throws_ok(
  format('select app.issue_invoice(%L, %L, %L)',
    (select org from inv_ctx),
    '11111111-2222-3333-4444-555555555555',
    (select (res->>'invoice_id')::uuid from test_full_inv)
  ),
  'Not authorized to issue formal invoices',
  'Non-member actor cannot issue formal invoices'
);

-- 11. Test Non-member actor rejected by void_invoice
select throws_ok(
  format('select app.void_invoice(%L, %L, %L)',
    (select org from inv_ctx),
    '11111111-2222-3333-4444-555555555555',
    (select (res->>'invoice_id')::uuid from test_full_inv)
  ),
  'Not authorized to void invoices',
  'Non-member actor cannot void invoices'
);

-- 12. Test Negative subtotal rejected
select throws_ok(
  format('select app.create_invoice_for_order(%L, %L, %L, %L, %L)',
    (select org from inv_ctx),
    '99999999-0000-4000-8000-000000000001',
    (select (result->>'order_id')::uuid from inv_order),
    'PROGRESS',
    -500000
  ),
  'Subtotal cannot be negative',
  'Negative subtotal is rejected'
);

-- 13. Test Cannot void invoice that is already VOID
select throws_ok(
  format('select app.void_invoice(%L, %L, %L)',
    (select org from inv_ctx),
    '99999999-0000-4000-8000-000000000001',
    (select (res->>'invoice_id')::uuid from test_dp_inv)
  ),
  'Invoice is already VOID',
  'Cannot void already voided invoice'
);

-- 14. Test Unverified Bank Account Rejection
select app.void_invoice((select org from inv_ctx), '99999999-0000-4000-8000-000000000001', (select (res->>'invoice_id')::uuid from test_full_inv), 'Clean up for bank test');
update app.organizations set billing_settings = '{}' where id = (select org from inv_ctx);

select throws_ok(
  format('select app.create_invoice_for_order(%L, %L, %L, %L, %L)',
    (select org from inv_ctx),
    '99999999-0000-4000-8000-000000000001',
    (select (result->>'order_id')::uuid from inv_order),
    'PROGRESS',
    500000
  ),
  'Organisasi belum memiliki konfigurasi rekening bank terverifikasi. Konfigurasikan rekening terlebih dahulu sebelum membuat faktur.',
  'Organization without verified bank account cannot create invoice'
);

select * from finish();
rollback;
