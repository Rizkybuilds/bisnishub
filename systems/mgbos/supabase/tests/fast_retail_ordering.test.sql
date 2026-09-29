begin;
select plan(19);

-- 1. Setup Test Context
create temporary table test_ctx as select
  (select id from app.organizations where code = 'multigraph-group') as org,
  (select id from app.brands where code = 'TS') as brand,
  (select id from app.users where email = 'founder@multigraph.id') as owner_actor,
  (select id from app.customer_accounts where organization_id = (select id from app.organizations where code = 'multigraph-group') limit 1) as customer;

-- 2. Setup Master Inventory SKU: Blank Garment NSA with 50 units initial stock
create temporary table test_item as select
  app.create_inventory_item(
    p_organization_id => (select org from test_ctx),
    p_actor_id => (select owner_actor from test_ctx),
    p_brand_id => (select brand from test_ctx),
    p_sku => 'TS-RETAIL-NSA-BLK-L',
    p_name => 'Kaos Polos NSA Premium Black L',
    p_category => 'BLANK_GARMENT',
    p_unit => 'pcs',
    p_cost_price => 40000::bigint,
    p_min_stock_alert => 10,
    p_initial_stock => 50,
    p_location_code => 'MAIN_WORKSHOP'
  ) result;

select ok(
  (select (result->>'inventory_item_id') from test_item) is not null,
  'Master retail inventory item created with 50 initial units on-hand'
);

-- 3. Create Direct Retail Order (5 pcs @ Rp 75.000 + Rp 15.000 shipping = Rp 390.000) without auto-pay
create temporary table retail_order_1 as select
  app.create_retail_order(
    p_organization_id => (select org from test_ctx),
    p_actor_id => (select owner_actor from test_ctx),
    p_brand_id => (select brand from test_ctx),
    p_request_id => gen_random_uuid(),
    p_customer_account_id => (select customer from test_ctx),
    p_items => jsonb_build_array(
      jsonb_build_object(
        'inventory_item_id', (select (result->>'inventory_item_id')::uuid from test_item),
        'quantity', 5,
        'unit_price', 75000::bigint,
        'discount_total', 0::bigint,
        'notes', 'Pembelian ritel kaos hitam L'
      )
    ),
    p_shipping_cost => 15000::bigint,
    p_notes => 'Pesanan ritel direct order 1',
    p_auto_pay => false
  ) result;

select ok(
  (select (result->>'order_number') from retail_order_1) ~ '^TS-O-\d{4}-\d{6}$',
  'Retail order generated canonical document number TS-O-YYYY-XXXXXX'
);

select is(
  (select (result->>'grand_total')::bigint from retail_order_1),
  390000::bigint,
  'Retail order grand total correctly calculated (5 * 75.000 + 15.000 = 390.000)'
);

select is(
  (select order_type from app.orders where id = (select (result->>'order_id')::uuid from retail_order_1)),
  'RETAIL_DIRECT',
  'Order type set to RETAIL_DIRECT'
);

select is(
  (select source_quote_id from app.orders where id = (select (result->>'order_id')::uuid from retail_order_1)),
  null,
  'Retail order does not require source quote'
);

-- Verify Automated Stock Reservation
select results_eq(
  $$ select quantity_on_hand, quantity_reserved from app.inventory_levels where inventory_item_id = (select (result->>'inventory_item_id')::uuid from test_item) $$,
  $$ values (50, 5) $$,
  'Stock level immediately reserved 5 units (On-Hand: 50, Reserved: 5, Available: 45)'
);

select results_eq(
  $$ select quantity, status from app.inventory_reservations where inventory_item_id = (select (result->>'inventory_item_id')::uuid from test_item) $$,
  $$ values (5, 'ACTIVE'::text) $$,
  'Active reservation recorded in inventory_reservations'
);

-- Verify Auto-Issued Commercial Invoice
select ok(
  (select (result->>'invoice_number') from retail_order_1) ~ '^TS-INV-\d{4}-\d{6}$',
  'Commercial invoice automatically generated TS-INV-YYYY-XXXXXX'
);

select results_eq(
  $$ select invoice_type, status, amount_total, balance_due from app.invoices where id = (select (result->>'invoice_id')::uuid from retail_order_1) $$,
  $$ values ('FULL_PAYMENT'::text, 'ISSUED'::text, 390000::bigint, 390000::bigint) $$,
  'Invoice issued with status ISSUED, type FULL_PAYMENT, and balance due Rp 390.000'
);

-- 4. Test Anti-Overselling Guard: Attempt to order 60 pcs when only 45 available
select throws_matching(
  format(
    $$ select app.create_retail_order(
      p_organization_id => '%s'::uuid,
      p_actor_id => '%s'::uuid,
      p_brand_id => '%s'::uuid,
      p_customer_account_id => '%s'::uuid,
      p_items => jsonb_build_array(jsonb_build_object('inventory_item_id', '%s'::uuid, 'quantity', 60, 'unit_price', 75000::bigint))
    ) $$,
    (select org from test_ctx),
    (select owner_actor from test_ctx),
    (select brand from test_ctx),
    (select customer from test_ctx),
    (select (result->>'inventory_item_id')::uuid from test_item)
  ),
  'Stok tidak mencukupi untuk SKU .* Dibutuhkan: 60, Tersedia: 45',
  'Anti-overselling guard blocks retail checkout exceeding available stock'
);

-- 5. Fast POS Checkout with Auto-Pay (10 pcs @ Rp 75.000 + Rp 0 pickup = Rp 750.000 LUNAS via QRIS)
create temporary table retail_order_pos as select
  app.create_retail_order(
    p_organization_id => (select org from test_ctx),
    p_actor_id => (select owner_actor from test_ctx),
    p_brand_id => (select brand from test_ctx),
    p_request_id => gen_random_uuid(),
    p_customer_account_id => (select customer from test_ctx),
    p_items => jsonb_build_array(
      jsonb_build_object(
        'inventory_item_id', (select (result->>'inventory_item_id')::uuid from test_item),
        'quantity', 10,
        'unit_price', 75000::bigint,
        'discount_total', 0::bigint,
        'notes', 'Pembelian kasir langsung 10 pcs'
      )
    ),
    p_shipping_cost => 0::bigint,
    p_notes => 'Kasir POS Langsung QRIS',
    p_auto_pay => true,
    p_payment_method => 'QRIS',
    p_payment_reference => 'QRIS-POS-99882'
  ) result;

select ok(
  (select (result->>'payment_number') from retail_order_pos) ~ '^TS-PAY-\d{4}-\d{6}$',
  'POS auto-pay generated payment number TS-PAY-YYYY-XXXXXX'
);

select is(
  (select (result->>'is_paid') from retail_order_pos),
  'true',
  'POS order marked as paid immediately'
);

select results_eq(
  $$ select status, amount_paid, balance_due from app.invoices where id = (select (result->>'invoice_id')::uuid from retail_order_pos) $$,
  $$ values ('PAID'::text, 750000::bigint, 0::bigint) $$,
  'Invoice transitioned to PAID with Rp 0 balance due'
);

select results_eq(
  $$ select payment_method, status, amount from app.payments where id = (select (result->>'payment_id')::uuid from retail_order_pos) $$,
  $$ values ('QRIS'::text, 'CONFIRMED'::text, 750000::bigint) $$,
  'Payment recorded with QRIS, CONFIRMED, and exact amount Rp 750.000'
);

-- Verify Stock Level after 2nd order (50 on-hand, 5 + 10 = 15 reserved, 35 available)
select results_eq(
  $$ select quantity_on_hand, quantity_reserved from app.inventory_levels where inventory_item_id = (select (result->>'inventory_item_id')::uuid from test_item) $$,
  $$ values (50, 15) $$,
  'Stock level after POS order: 15 reserved, 35 available'
);

-- Verify Financial Ledger Event for Payment Received
select ok(
  exists (
    select 1 from app.financial_ledger_entries
    where reference_id = (select (result->>'payment_id')::uuid from retail_order_pos)
      and entry_type = 'PAYMENT_RECEIVED'
      and direction = 'DEBIT'
      and amount = 750000
  ),
  'Financial ledger emitted PAYMENT_RECEIVED DEBIT entry for POS payment'
);

-- Verify Financial Ledger Event for Order Committed
select ok(
  exists (
    select 1 from app.financial_ledger_entries
    where order_id = (select (result->>'order_id')::uuid from retail_order_pos)
      and entry_type = 'ORDER_COMMITTED'
      and direction = 'CREDIT'
      and amount = 750000
  ),
  'Financial ledger emitted ORDER_COMMITTED CREDIT entry for retail order'
);

-- 6. Test Immutability Guard: Order cannot be altered
select throws_matching(
  format(
    $$ update app.orders set grand_total = 9999999 where id = '%s'::uuid $$,
    (select (result->>'order_id')::uuid from retail_order_pos)
  ),
  'Order contract is immutable',
  'Order snapshot immutability trigger blocks modifying financial values'
);

-- 7. Test Idempotency: Re-submitting same request_id returns existing order
create temporary table retail_idempotent as select
  app.create_retail_order(
    p_organization_id => (select org from test_ctx),
    p_actor_id => (select owner_actor from test_ctx),
    p_brand_id => (select brand from test_ctx),
    p_request_id => (select request_id from app.orders where id = (select (result->>'order_id')::uuid from retail_order_pos)),
    p_customer_account_id => (select customer from test_ctx),
    p_items => jsonb_build_array(
      jsonb_build_object('inventory_item_id', (select (result->>'inventory_item_id')::uuid from test_item), 'quantity', 1, 'unit_price', 75000::bigint)
    )
  ) result;

select ok(
  (select (result->>'order_number') from retail_idempotent) = (select (result->>'order_number') from retail_order_pos),
  'Idempotent request returns identical existing order number'
);

select * from finish();
rollback;
