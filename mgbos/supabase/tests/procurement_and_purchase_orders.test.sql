begin;
select plan(23);

create temporary table proc_ctx as select
  (select id from app.organizations where code='multigraph-group') org,
  (select id from app.brands where code='TS') brand,
  (select id from app.users where email='founder@multigraph.id') owner_actor;

-- 1. Table structure assertions
select has_table('app', 'purchase_orders', 'Table app.purchase_orders exists');
select has_table('app', 'purchase_order_items', 'Table app.purchase_order_items exists');
select has_table('app', 'goods_receipts', 'Table app.goods_receipts exists');
select has_table('app', 'goods_receipt_items', 'Table app.goods_receipt_items exists');
select has_table('app', 'vendor_bills', 'Table app.vendor_bills exists');
select has_table('app', 'vendor_bill_payments', 'Table app.vendor_bill_payments exists');

-- 2. Setup Vendor and Inventory Item
create temporary table proc_vendor as select
  app.create_vendor(
    p_organization_id => org,
    p_actor_id => owner_actor,
    p_code => 'SUP-NSA-BDG',
    p_name => 'Distributor Resmi NSA Bandung',
    p_category => 'GARMENT_SUPPLIER',
    p_contact_person => 'Ko Hendra',
    p_phone => '08122334455',
    p_lead_time_days => 2,
    p_payment_terms => 'NET_14',
    p_notes => 'Official NSA distributor'
  ) vendor_id from proc_ctx;

create temporary table proc_item as select
  app.create_inventory_item(
    p_organization_id => org,
    p_actor_id => owner_actor,
    p_brand_id => brand,
    p_sku => 'TS-NSA-7200-NVY-M',
    p_name => 'Kaos Polos NSA 7200 Navy M',
    p_category => 'BLANK_GARMENT',
    p_cost_price => 38000::bigint,
    p_initial_stock => 0
  ) result from proc_ctx;

-- 3. Create Purchase Order (100 pcs @ Rp 38.000 + Ongkir Rp 50.000 = Rp 3.850.000)
create temporary table proc_po as select
  app.create_purchase_order(
    p_organization_id => (select org from proc_ctx),
    p_actor_id => (select owner_actor from proc_ctx),
    p_brand_id => (select brand from proc_ctx),
    p_vendor_id => (select vendor_id from proc_vendor),
    p_items => jsonb_build_array(
      jsonb_build_object(
        'inventory_item_id', (select (result->>'inventory_item_id')::uuid from proc_item),
        'quantity', 100,
        'unit_cost', 38000
      )
    ),
    p_expected_delivery_date => (current_date + 3)::date,
    p_shipping_cost => 50000::bigint,
    p_notes => 'PO Pengadaan Kaos Polos NSA Navy M'
  ) result;

select is(
  (select (result->>'status') from proc_po),
  'ORDERED',
  'Purchase order created with status ORDERED'
);

select ok(
  (select (result->>'po_number') from proc_po) ~ '^TS-PO-\d{4}-\d{6}$',
  'Purchase order number matches canonical pattern TS-PO-YYYY-XXXXXX'
);

select is(
  (select (result->>'total_amount')::bigint from proc_po),
  3850000::bigint,
  'PO Total amount calculated accurately (Subtotal Rp 3.800.000 + Ongkir Rp 50.000)'
);

-- Fetch PO line item ID
create temporary table proc_po_line as select
  id as line_id,
  purchase_order_id,
  inventory_item_id
from app.purchase_order_items
where purchase_order_id = (select (result->>'purchase_order_id')::uuid from proc_po)
limit 1;

-- 4. Partial Goods Receipt 1 (Receive 60 pcs)
create temporary table proc_gr1 as select
  app.receive_purchase_order_items(
    p_organization_id => (select org from proc_ctx),
    p_actor_id => (select owner_actor from proc_ctx),
    p_purchase_order_id => (select purchase_order_id from proc_po_line),
    p_items => jsonb_build_array(
      jsonb_build_object(
        'purchase_order_item_id', (select line_id from proc_po_line),
        'quantity_accepted', 60
      )
    ),
    p_vendor_delivery_note => 'SJ-NSA-99881',
    p_location_code => 'MAIN_WORKSHOP',
    p_notes => 'Penerimaan Batch 1 (60 pcs)'
  ) result;

select is(
  (select (result->>'po_status') from proc_gr1),
  'PARTIALLY_RECEIVED',
  'PO status transitioned to PARTIALLY_RECEIVED after 60 pcs receipt'
);

select ok(
  (select (result->>'receipt_number') from proc_gr1) ~ '^TS-GR-\d{4}-\d{6}$',
  'Goods receipt document generated canonical format TS-GR-YYYY-XXXXXX'
);

-- Verify Automated Inventory Restock
select results_eq(
  $$ select quantity_on_hand, quantity_reserved from app.inventory_levels where inventory_item_id = (select (result->>'inventory_item_id')::uuid from proc_item) $$,
  $$ values (60, 0) $$,
  'Inventory on-hand stock automatically incremented to 60 units'
);

select results_eq(
  $$ select mutation_type, quantity_change, quantity_on_hand_after from app.inventory_mutations where inventory_item_id = (select (result->>'inventory_item_id')::uuid from proc_item) order by created_at desc limit 1 $$,
  $$ values ('INBOUND_PURCHASE'::text, 60, 60) $$,
  'Inbound purchase mutation logged in inventory append-only ledger'
);

-- Verify Auto-Generated Vendor Bill
select ok(
  (select bill_number from app.vendor_bills where purchase_order_id = (select (result->>'purchase_order_id')::uuid from proc_po)) ~ '^TS-VB-\d{4}-\d{6}$',
  'Vendor bill automatically generated with canonical format TS-VB-YYYY-XXXXXX'
);

select results_eq(
  $$ select total_amount, amount_paid, balance_due, status from app.vendor_bills where purchase_order_id = (select (result->>'purchase_order_id')::uuid from proc_po) $$,
  $$ values (3850000::bigint, 0::bigint, 3850000::bigint, 'OPEN'::text) $$,
  'Vendor bill initialized with full balance due and status OPEN'
);

-- 5. Ceiling Guard on Receipt: Attempt to receive 50 pcs (when remaining is 40)
select throws_matching(
  format(
    $$ select app.receive_purchase_order_items(
      '%s'::uuid, '%s'::uuid, '%s'::uuid,
      jsonb_build_array(jsonb_build_object('purchase_order_item_id', '%s'::uuid, 'quantity_accepted', 50))
    ) $$,
    (select org from proc_ctx),
    (select owner_actor from proc_ctx),
    (select purchase_order_id from proc_po_line),
    (select line_id from proc_po_line)
  ),
  'Jumlah penerimaan .* melebihi sisa pesanan PO',
  'Ceiling Guard blocks receipt quantity exceeding PO remaining quota'
);

-- 6. Full Goods Receipt 2 (Receive remaining 40 pcs)
create temporary table proc_gr2 as select
  app.receive_purchase_order_items(
    p_organization_id => (select org from proc_ctx),
    p_actor_id => (select owner_actor from proc_ctx),
    p_purchase_order_id => (select purchase_order_id from proc_po_line),
    p_items => jsonb_build_array(
      jsonb_build_object(
        'purchase_order_item_id', (select line_id from proc_po_line),
        'quantity_accepted', 40
      )
    ),
    p_vendor_delivery_note => 'SJ-NSA-99882',
    p_notes => 'Penerimaan Batch 2 Pelunasan (40 pcs)'
  ) result;

select is(
  (select (result->>'po_status') from proc_gr2),
  'RECEIVED',
  'PO status transitions to RECEIVED after all 100 pcs received'
);

select results_eq(
  $$ select quantity_on_hand from app.inventory_levels where inventory_item_id = (select (result->>'inventory_item_id')::uuid from proc_item) $$,
  $$ values (100) $$,
  'Inventory on-hand stock reaches full 100 units'
);

-- 7. Vendor Bill Payment & Outbound Cash Emission
create temporary table proc_bill as select
  id as bill_id
from app.vendor_bills
where purchase_order_id = (select (result->>'purchase_order_id')::uuid from proc_po)
limit 1;

-- Partial Payment: Rp 2.000.000
create temporary table proc_pay1 as select
  app.pay_vendor_bill(
    p_organization_id => (select org from proc_ctx),
    p_actor_id => (select owner_actor from proc_ctx),
    p_vendor_bill_id => (select bill_id from proc_bill),
    p_amount => 2000000::bigint,
    p_payment_method => 'BANK_TRANSFER',
    p_source_bank => 'BCA',
    p_source_account_number => '7770123899',
    p_reference_number => 'TRX-VEND-001',
    p_notes => 'Pembayaran termin 1 pengadaan kaos NSA'
  ) result;

select is(
  (select (result->>'status') from proc_pay1),
  'PARTIALLY_PAID',
  'Vendor bill transitions to PARTIALLY_PAID after Rp 2.000.000 payment'
);

select is(
  (select (result->>'balance_due')::bigint from proc_pay1),
  1850000::bigint,
  'Vendor bill balance due reduced to Rp 1.850.000'
);

-- Verify Financial Ledger Outbound Cash Entry
select results_eq(
  $$ select entry_type, direction, category, amount from app.financial_ledger_entries where reference_id = (select bill_id from proc_bill) limit 1 $$,
  $$ values ('VENDOR_MATERIAL_PAYMENT'::text, 'CREDIT'::text, 'CASH_MOVEMENT'::text, 2000000::bigint) $$,
  'Financial ledger emits CREDIT entry for outbound vendor material payment'
);

-- Full Settlement Payment: Rp 1.850.000
create temporary table proc_pay2 as select
  app.pay_vendor_bill(
    p_organization_id => (select org from proc_ctx),
    p_actor_id => (select owner_actor from proc_ctx),
    p_vendor_bill_id => (select bill_id from proc_bill),
    p_amount => 1850000::bigint,
    p_payment_method => 'BANK_TRANSFER',
    p_source_bank => 'BCA',
    p_notes => 'Pelunasan sisa tagihan bahan'
  ) result;

select is(
  (select (result->>'status') from proc_pay2),
  'PAID',
  'Vendor bill transitions to PAID after full balance settlement'
);

select is(
  (select (result->>'balance_due')::bigint from proc_pay2),
  0::bigint,
  'Vendor bill balance due reaches Rp 0'
);

select * from finish();
rollback;
