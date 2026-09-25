begin;
select plan(24);

create temporary table pay_ctx as select
  (select id from app.organizations where code='multigraph-group') org,
  (select id from app.brands where code='TS') brand,
  (select id from app.users where email='founder@multigraph.id') owner_actor,
  (select id from app.customer_accounts where status='ACTIVE' limit 1) customer;

-- Create Finance and Sales test users
insert into app.users(id, name, email) values
  ('66666666-0000-4000-8000-000000000001', 'Finance Tester', 'financetester@local.invalid'),
  ('66666666-0000-4000-8000-000000000002', 'Sales Tester', 'salestester@local.invalid')
on conflict (id) do nothing;

insert into app.organization_members(organization_id, user_id, role_id)
select org, '66666666-0000-4000-8000-000000000001', (select id from app.roles where organization_id=org and code='FINANCE') from pay_ctx
on conflict do nothing;

insert into app.organization_members(organization_id, user_id, role_id)
select org, '66666666-0000-4000-8000-000000000002', (select id from app.roles where organization_id=org and code='SALES') from pay_ctx
on conflict do nothing;

-- 1. Setup full pipeline: Requirement -> Quote -> Order Contract (Rp 10.000.000 + Rp 200.000 = Rp 10.200.000)
create temporary table pay_req as select app.create_requirement_with_initial_version(
  p_organization_id => org,
  p_brand_id => brand,
  p_title => 'Payment Pipeline Test',
  p_summary => '100 pcs Custom Tees for Payment Allocation',
  p_customer_account_id => customer,
  p_quantity => 100,
  p_actor_id => owner_actor
) result from pay_ctx;

select app.transition_requirement_status(org, (result->>'requirement_id')::uuid, 'READY', owner_actor) from pay_ctx, pay_req;

create temporary table pay_quote as select app.save_quote_version(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_request_id => '55555555-0000-4000-8000-000000000010'::uuid,
  p_requirement_version_id => (result->>'version_id')::uuid,
  p_customer_id => customer,
  p_unit_price => 100000::bigint,
  p_discount => 0::bigint,
  p_shipping => 200000::bigint,
  p_costs => jsonb_build_array(
    jsonb_build_object('cost_type', 'GARMENT', 'description', 'Blanks', 'quantity', 100, 'unit_cost', 45000)
  ),
  p_valid_until => (current_date + 14)::date,
  p_terms => 'DP 50%',
  p_lead_time => '10 days',
  p_notes => 'Payment pipeline quote'
) result from pay_ctx, pay_req;

select app.mark_quote_sent(org, owner_actor, (result->>'version_id')::uuid) from pay_ctx, pay_quote;
select app.mark_quote_accepted(org, owner_actor, (result->>'version_id')::uuid, 'WHATSAPP', null, 'Confirmed') from pay_ctx, pay_quote;

create temporary table pay_order as select app.create_order_from_quote(
  p_organization_id => org,
  p_actor_id => owner_actor,
  p_request_id => '44444444-0000-4000-8000-000000000010'::uuid,
  p_quote_version_id => (result->>'version_id')::uuid,
  p_shipping_address => jsonb_build_object(
    'recipient_name', 'Hendra Payment Client',
    'phone', '081234567890',
    'street', 'Jl. Sukajadi No. 20',
    'city', 'Bandung'
  )
) result from pay_ctx, pay_quote;

-- 2. Create DP Invoice (Rp 5.100.000) & Issue It
create temporary table pay_dp_inv as select app.create_invoice_for_order(
  p_organization_id => org,
  p_actor_id => '66666666-0000-4000-8000-000000000001', -- Finance
  p_order_id => (result->>'order_id')::uuid,
  p_invoice_type => 'DOWN_PAYMENT',
  p_amount_subtotal => 5000000,
  p_amount_shipping => 100000,
  p_amount_tax => 0,
  p_due_date => current_date + 3,
  p_notes => 'Invoice DP 50%'
) res from pay_ctx, pay_order;

select app.issue_invoice(org, '66666666-0000-4000-8000-000000000001', (res->>'invoice_id')::uuid) from pay_ctx, pay_dp_inv;

-- 3. Test RBAC: Sales cannot record payment
select throws_ok(
  format('select app.record_payment_and_allocate(%L, %L, %L, %L, %L)',
    (select org from pay_ctx),
    '66666666-0000-4000-8000-000000000002', -- Sales
    (select brand from pay_ctx),
    'BANK_TRANSFER',
    3000000
  ),
  'Not authorized to record payments',
  'Sales role rejected from recording payment'
);

-- 4. Test Record Payment with Partial Allocation (Rp 3.000.000 of Rp 5.100.000)
create temporary table pay_rec_1 as select app.record_payment_and_allocate(
  p_organization_id => org,
  p_actor_id => '66666666-0000-4000-8000-000000000001', -- Finance
  p_brand_id => brand,
  p_payment_method => 'BANK_TRANSFER',
  p_amount => 3000000,
  p_payment_date => current_date,
  p_reference_number => 'BCA-TRX-001239',
  p_destination_bank => 'Bank Central Asia (BCA)',
  p_destination_account_number => '7770123899',
  p_payer_name => 'Hendra Setiawan',
  p_notes => 'DP termin pertama via transfer BCA',
  p_allocations => jsonb_build_array(
    jsonb_build_object(
      'invoice_id', (select (res->>'invoice_id')::uuid from pay_dp_inv),
      'amount', 3000000,
      'notes', 'Alokasi DP tahap 1'
    )
  )
) res from pay_ctx;

select ok((res->>'payment_id') is not null, 'Payment 1 recorded successfully') from pay_rec_1;
select is((res->>'status'), 'CONFIRMED', 'Payment status is CONFIRMED') from pay_rec_1;
select matches((res->>'payment_number'), '^TS-PAY-\d{4}-\d{6}$', 'Canonical payment number follows TS-PAY-YYYY-XXXXXX format') from pay_rec_1;
select is((res->>'allocated_amount')::bigint, 3000000::bigint, 'Payment allocated amount matches') from pay_rec_1;
select is((res->>'unallocated_amount')::bigint, 0::bigint, 'Payment unallocated amount is 0') from pay_rec_1;

-- 5. Verify Invoice Status Updated to PARTIALLY_PAID
select is(
  (select status from app.invoices where id = (select (res->>'invoice_id')::uuid from pay_dp_inv)),
  'PARTIALLY_PAID',
  'Invoice transitioned to PARTIALLY_PAID'
);
select is(
  (select amount_paid from app.invoices where id = (select (res->>'invoice_id')::uuid from pay_dp_inv)),
  3000000::bigint,
  'Invoice amount_paid updated to 3.000.000'
);
select is(
  (select balance_due from app.invoices where id = (select (res->>'invoice_id')::uuid from pay_dp_inv)),
  2100000::bigint,
  'Invoice balance_due reduced to 2.100.000'
);
select ok(
  (select paid_at from app.invoices where id = (select (res->>'invoice_id')::uuid from pay_dp_inv)) is null,
  'paid_at remains null for partially paid invoice'
);

-- 6. Test Over-Allocation Rejection (Attempting to allocate 2.500.000 when balance_due is 2.100.000)
select throws_ok(
  format('select app.record_payment_and_allocate(%L, %L, %L, %L, %L, current_date, null, null, null, null, null, null, null, null, %L::jsonb)',
    (select org from pay_ctx),
    '66666666-0000-4000-8000-000000000001',
    (select brand from pay_ctx),
    'BANK_TRANSFER',
    2500000,
    jsonb_build_array(
      jsonb_build_object(
        'invoice_id', (select (res->>'invoice_id')::uuid from pay_dp_inv),
        'amount', 2500000
      )
    )::text
  ),
  format('Allocation amount (Rp 2500000) exceeds invoice %s balance due (Rp 2100000)',
    (select res->>'invoice_number' from pay_dp_inv)
  ),
  'Over-allocation beyond invoice balance due strictly rejected'
);

-- 7. Test Paying Remaining Balance Due (Rp 2.100.000) -> Status PAID
create temporary table pay_rec_2 as select app.record_payment_and_allocate(
  p_organization_id => org,
  p_actor_id => '66666666-0000-4000-8000-000000000001',
  p_brand_id => brand,
  p_payment_method => 'QRIS',
  p_amount => 2100000,
  p_payment_date => current_date,
  p_reference_number => 'QRIS-MID-998811',
  p_allocations => jsonb_build_array(
    jsonb_build_object(
      'invoice_id', (select (res->>'invoice_id')::uuid from pay_dp_inv),
      'amount', 2100000
    )
  )
) res from pay_ctx;

select is(
  (select status from app.invoices where id = (select (res->>'invoice_id')::uuid from pay_dp_inv)),
  'PAID',
  'Invoice transitioned to PAID upon full settlement'
);
select is(
  (select balance_due from app.invoices where id = (select (res->>'invoice_id')::uuid from pay_dp_inv)),
  0::bigint,
  'Invoice balance_due reached exactly 0'
);
select ok(
  (select paid_at from app.invoices where id = (select (res->>'invoice_id')::uuid from pay_dp_inv)) is not null,
  'paid_at timestamp is populated'
);

-- 8. Test Cannot Allocate to Already PAID Invoice
select throws_ok(
  format('select app.record_payment_and_allocate(%L, %L, %L, %L, %L, current_date, null, null, null, null, null, null, null, null, %L::jsonb)',
    (select org from pay_ctx),
    '66666666-0000-4000-8000-000000000001',
    (select brand from pay_ctx),
    'CASH',
    500000,
    jsonb_build_array(
      jsonb_build_object(
        'invoice_id', (select (res->>'invoice_id')::uuid from pay_dp_inv),
        'amount', 500000
      )
    )::text
  ),
  format('Cannot allocate payment to invoice %s in status PAID',
    (select res->>'invoice_number' from pay_dp_inv)
  ),
  'Cannot allocate payment to already paid invoice'
);

-- 9. Test Payment Immutability Guard (Cannot update amount or payment_number directly)
select throws_ok(
  format('update app.payments set amount = 99999999 where id = %L',
    (select (res->>'payment_id')::uuid from pay_rec_1)
  ),
  'Confirmed payments are immutable; amount, currency, and document numbers cannot be altered. Revert payment instead.',
  'Snapshot guard prevents tampering with payment amount'
);

-- 10. Test Confirmed Payment Direct Deletion Prevented
select throws_ok(
  format('delete from app.payments where id = %L',
    (select (res->>'payment_id')::uuid from pay_rec_1)
  ),
  format('Cannot delete confirmed or reversed payment %s; use revert_payment instead',
    (select res->>'payment_number' from pay_rec_1)
  ),
  'Direct deletion of confirmed payment is blocked'
);

-- 11. Test Payment Reversal (Revert Payment 2 of Rp 2.100.000)
create temporary table pay_revert_res as select app.revert_payment(
  p_organization_id => org,
  p_actor_id => '66666666-0000-4000-8000-000000000001', -- Finance
  p_payment_id => (select (res->>'payment_id')::uuid from pay_rec_2),
  p_reason => 'Salah input nominal QRIS, transfer dibatalkan bank'
) res from pay_ctx;

select is((res->>'status'), 'REVERSED', 'Payment successfully REVERSED') from pay_revert_res;

-- Verify Invoice Rolled Back from PAID to PARTIALLY_PAID
select is(
  (select status from app.invoices where id = (select (res->>'invoice_id')::uuid from pay_dp_inv)),
  'PARTIALLY_PAID',
  'Invoice rolled back to PARTIALLY_PAID after payment reversal'
);
select is(
  (select amount_paid from app.invoices where id = (select (res->>'invoice_id')::uuid from pay_dp_inv)),
  3000000::bigint,
  'Invoice amount_paid reverted back to 3.000.000'
);
select is(
  (select balance_due from app.invoices where id = (select (res->>'invoice_id')::uuid from pay_dp_inv)),
  2100000::bigint,
  'Invoice balance_due restored to 2.100.000'
);
select ok(
  (select paid_at from app.invoices where id = (select (res->>'invoice_id')::uuid from pay_dp_inv)) is null,
  'paid_at reset to null after unmarking PAID'
);

-- 12. Test Audit Records
select ok(
  (select count(*) from app.payment_audit where payment_id = (select (res->>'payment_id')::uuid from pay_rec_2) and action = 'payment.reverted') = 1,
  'Payment reversal logged in payment_audit'
);
select ok(
  (select count(*) from app.invoice_audit where invoice_id = (select (res->>'invoice_id')::uuid from pay_dp_inv) and action = 'invoice.payment_reverted') = 1,
  'Payment reversal logged in invoice_audit'
);

select * from finish();
rollback;
