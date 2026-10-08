import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {
  resolveDestructiveLocalE2EEnvironment,
  createDestructiveLocalSupabaseFetch,
} from './destructive-local-e2e-guard.mjs';

/**
 * SEC-01 QA Remediation Assurance Suite (SEC01-QA-001)
 *
 * Verifies:
 * 1. Transport-level negative regression with genuine local authenticated user JWT:
 *    - All 5 hardened RPCs reject direct invocation with HTTP 403 / 42501 (permission denied).
 *    - Forged authorized actor parameters fail closed before parsing/execution.
 *    - Anon calls reject with HTTP 403 / 42501.
 *    - Probing produces ZERO database mutations (before/after row counts strictly identical).
 * 2. Authenticated application-command integration evidence via trusted server path:
 *    - Payment recording and partial allocation (record_payment_and_allocate).
 *    - Payment allocation of unallocated funds (allocate_existing_payment).
 *    - Payment reversal and invoice status rollback (revert_payment).
 *    - Fast retail ordering with automatic payment receipt (create_retail_order).
 */

const { baseUrl: BASE_URL, serviceRoleKey: SERVICE_KEY } =
  resolveDestructiveLocalE2EEnvironment();
const guardedFetch = createDestructiveLocalSupabaseFetch({
  baseUrl: BASE_URL,
  serviceRoleKey: SERVICE_KEY,
});

const PUBLISHABLE_KEY = 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH';

const endpoint = `${BASE_URL.replace(/\/+$/, '')}/rest/v1`;
const authEndpoint = `${BASE_URL.replace(/\/+$/, '')}/auth/v1`;

const serviceHeaders = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
  'Accept-Profile': 'app',
  'Content-Profile': 'app',
  Prefer: 'return=representation',
};

async function rpcService(functionName, params) {
  const res = await guardedFetch(`${endpoint}/rpc/${functionName}`, {
    method: 'POST',
    headers: serviceHeaders,
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Service RPC ${functionName} failed (${res.status}): ${errorText}`,
    );
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function queryTable(table, query = '') {
  const res = await guardedFetch(`${endpoint}/${table}?${query}`, {
    headers: serviceHeaders,
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Query ${table} failed (${res.status}): ${errorText}`);
  }
  return res.json();
}

async function getCount(table) {
  const res = await guardedFetch(`${endpoint}/${table}?select=id`, {
    headers: {
      ...serviceHeaders,
      Prefer: 'count=exact',
    },
  });
  const range = res.headers.get('content-range');
  if (range && range.includes('/')) {
    const total = range.split('/')[1];
    return Number.parseInt(total, 10);
  }
  const rows = await res.json();
  return rows.length;
}

async function main() {
  console.log(
    '\n================================================================',
  );
  console.log(
    '🛡️  STARTING SEC-01 PAYMENT RPC BOUNDARY ASSURANCE (SEC01-QA-001)',
  );
  console.log(
    '================================================================\n',
  );

  // --------------------------------------------------------------------------
  // Phase 1: Environment & Context Setup
  // --------------------------------------------------------------------------
  console.log('--- Phase 1: Context Resolution & Baseline Snapshot ---');
  const [org] = await queryTable('organizations', 'code=eq.multigraph-group');
  assert.ok(org, 'Organization multigraph-group must exist');

  const [brand] = await queryTable('brands', 'code=eq.TS');
  assert.ok(brand, 'Brand TS must exist');

  const [founder] = await queryTable('users', 'email=eq.founder@multigraph.id');
  assert.ok(founder, 'Founder user must exist');

  const [customer] = await queryTable(
    'customer_accounts',
    'status=eq.ACTIVE&limit=1',
  );
  assert.ok(customer, 'Active customer account must exist');

  console.log(`✓ Organization: ${org.code} (${org.id})`);
  console.log(`✓ Brand: ${brand.code} (${brand.id})`);
  console.log(`✓ Founder User: ${founder.email} (${founder.id})`);
  console.log(`✓ Customer: ${customer.display_name} (${customer.id})`);

  // Initial table row counts
  const monitoredTables = [
    'payments',
    'payment_allocations',
    'payment_audit',
    'invoices',
    'invoice_audit',
    'orders',
    'order_audit',
    'financial_ledger_entries',
  ];

  const baselineCounts = {};
  for (const t of monitoredTables) {
    baselineCounts[t] = await getCount(t);
  }
  console.log('✓ Baseline Counts:', baselineCounts);

  // --------------------------------------------------------------------------
  // Phase 2: Negative Transport-Level Regression (Real Authenticated User JWT)
  // --------------------------------------------------------------------------
  console.log(
    '\n--- Phase 2: Negative Transport-Level Regression (Real Authenticated JWT) ---',
  );

  // 2.1 Authenticate with GoTrue using seeded founder credentials
  console.log('Authenticating with local GoTrue (grant_type=password)...');
  const loginRes = await guardedFetch(
    `${authEndpoint}/token?grant_type=password`,
    {
      method: 'POST',
      headers: {
        apikey: PUBLISHABLE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'founder@multigraph.id',
        password: 'mgbos-founder-2026',
      }),
    },
  );
  assert.equal(loginRes.status, 200, 'GoTrue login must return HTTP 200');
  const authData = await loginRes.json();
  assert.ok(authData.access_token, 'Access token must be returned');
  assert.equal(
    authData.user?.role,
    'authenticated',
    'User role must be authenticated',
  );
  const userJwt = authData.access_token;
  console.log(
    `✓ Real user JWT acquired (user_id: ${authData.user.id}, role: ${authData.user.role})`,
  );

  const authenticatedUserHeaders = {
    apikey: PUBLISHABLE_KEY,
    Authorization: `Bearer ${userJwt}`,
    'Content-Type': 'application/json',
    'Accept-Profile': 'app',
    'Content-Profile': 'app',
  };

  const anonHeaders = {
    apikey: PUBLISHABLE_KEY,
    'Content-Type': 'application/json',
    'Accept-Profile': 'app',
    'Content-Profile': 'app',
  };

  const negativeProbes = [
    {
      name: 'app.payment_actor_role',
      rpc: 'payment_actor_role',
      body: {
        p_org: org.id,
        p_actor: founder.id, // Forged authorized actor
      },
    },
    {
      name: 'app.record_payment_and_allocate',
      rpc: 'record_payment_and_allocate',
      body: {
        p_organization_id: org.id,
        p_actor_id: founder.id, // Forged authorized actor
        p_brand_id: brand.id,
        p_payment_method: 'CASH',
        p_amount: 5000000,
        p_notes: 'Direct attacker payment probe',
      },
    },
    {
      name: 'app.allocate_existing_payment',
      rpc: 'allocate_existing_payment',
      body: {
        p_organization_id: org.id,
        p_actor_id: founder.id, // Forged authorized actor
        p_payment_id: crypto.randomUUID(),
        p_invoice_id: crypto.randomUUID(),
        p_amount: 1000000,
      },
    },
    {
      name: 'app.revert_payment',
      rpc: 'revert_payment',
      body: {
        p_organization_id: org.id,
        p_actor_id: founder.id, // Forged authorized actor
        p_payment_id: crypto.randomUUID(),
        p_reason: 'Direct attacker reversal probe',
      },
    },
    {
      name: 'app.create_retail_order',
      rpc: 'create_retail_order',
      body: {
        p_organization_id: org.id,
        p_actor_id: founder.id, // Forged authorized actor
        p_brand_id: brand.id,
        p_customer_account_id: customer.id,
        p_items: [],
        p_auto_pay: true,
      },
    },
  ];

  // 2.2 Probe with Real Authenticated JWT
  console.log(
    '\nProbing all 5 RPCs with real authenticated JWT + forged authorized actor:',
  );
  for (const probe of negativeProbes) {
    const res = await guardedFetch(`${endpoint}/rpc/${probe.rpc}`, {
      method: 'POST',
      headers: authenticatedUserHeaders,
      body: JSON.stringify(probe.body),
    });

    assert.equal(
      res.status,
      403,
      `Expected HTTP 403 Forbidden for ${probe.name} under authenticated JWT, got ${res.status}`,
    );
    const body = await res.json();
    assert.equal(
      body.code,
      '42501',
      `Expected PostgreSQL error code 42501 for ${probe.name}, got ${body.code}`,
    );
    assert.match(
      body.message,
      new RegExp(`permission denied for function (app\\.)?${probe.rpc}`),
      `Expected permission denied message for ${probe.name}, got ${body.message}`,
    );
    console.log(
      `✓ ${probe.name}: HTTP 403 / 42501 permission denied (authenticated JWT rejected)`,
    );
  }

  // 2.3 Probe with Anon role
  console.log('\nProbing all 5 RPCs with anon role:');
  for (const probe of negativeProbes) {
    const res = await guardedFetch(`${endpoint}/rpc/${probe.rpc}`, {
      method: 'POST',
      headers: anonHeaders,
      body: JSON.stringify(probe.body),
    });

    assert.ok(
      res.status === 401 || res.status === 403,
      `Expected HTTP 401 or 403 for ${probe.name} under anon role, got ${res.status}`,
    );
    const body = await res.json();
    assert.equal(
      body.code,
      '42501',
      `Expected PostgreSQL error code 42501 for ${probe.name}, got ${body.code}`,
    );
    console.log(
      `✓ ${probe.name}: HTTP ${res.status} / 42501 permission denied (anon rejected)`,
    );
  }

  // 2.4 Verify Zero Business Mutations after Probes
  console.log('\nVerifying zero business mutations after negative probes:');
  for (const t of monitoredTables) {
    const countAfter = await getCount(t);
    assert.equal(
      countAfter,
      baselineCounts[t],
      `Table ${t} count must remain strictly unchanged: expected ${baselineCounts[t]}, got ${countAfter}`,
    );
  }
  console.log(
    '✓ Invariant preserved: ZERO business mutations across all monitored tables.',
  );

  // --------------------------------------------------------------------------
  // Phase 3: Positive Authenticated Application Integration Verification
  // --------------------------------------------------------------------------
  console.log(
    '\n--- Phase 3: Positive Authenticated Application Integration ---',
  );
  const runSuffix = Date.now().toString().slice(-6);

  // Setup: Create Order and 2 Invoices
  console.log('1. Setting up Commercial Order and Invoices...');
  const reqRes = await rpcService('create_requirement_with_initial_version', {
    p_organization_id: org.id,
    p_brand_id: brand.id,
    p_title: `SEC-01 Assurance Apparel Order ${runSuffix}`,
    p_summary: '50 pcs Custom Graphic Tees for Verification',
    p_customer_account_id: customer.id,
    p_quantity: 50,
    p_actor_id: founder.id,
  });

  await rpcService('transition_requirement_status', {
    p_organization_id: org.id,
    p_requirement_id: reqRes.requirement_id,
    p_target_status: 'READY',
    p_actor_id: founder.id,
  });

  const quoteRes = await rpcService('save_quote_version', {
    p_organization_id: org.id,
    p_actor_id: founder.id,
    p_request_id: crypto.randomUUID(),
    p_requirement_version_id: reqRes.version_id,
    p_customer_id: customer.id,
    p_unit_price: 100000,
    p_discount: 0,
    p_shipping: 0,
    p_costs: [
      {
        cost_type: 'GARMENT',
        description: 'Cotton Combed 24s Blanks',
        quantity: 50,
        unit_cost: 35000,
      },
    ],
    p_valid_until: new Date(Date.now() + 14 * 86400000)
      .toISOString()
      .split('T')[0],
    p_terms: 'DP 30%, Pelunasan sebelum kirim',
    p_lead_time: '7 working days',
    p_notes: 'SEC-01 quote',
  });

  await rpcService('mark_quote_sent', {
    p_organization_id: org.id,
    p_actor_id: founder.id,
    p_version_id: quoteRes.version_id,
  });

  await rpcService('mark_quote_accepted', {
    p_organization_id: org.id,
    p_actor_id: founder.id,
    p_version_id: quoteRes.version_id,
    p_acceptance_method: 'WHATSAPP',
    p_notes: 'Approved for assurance testing',
  });

  const orderRes = await rpcService('create_order_from_quote', {
    p_organization_id: org.id,
    p_actor_id: founder.id,
    p_request_id: crypto.randomUUID(),
    p_quote_version_id: quoteRes.version_id,
    p_shipping_address: {
      recipient_name: 'PT ABC Procurement',
      phone: '081234567890',
      street: 'Jl. Riau No. 10',
      city: 'Bandung',
    },
  });

  await rpcService('transition_order_status', {
    p_organization_id: org.id,
    p_actor_id: founder.id,
    p_order_id: orderRes.order_id,
    p_target_status: 'ACTIVE',
    p_reason: 'Down payment commitment verified',
  });

  // Create Invoice 1 (DP: Rp 1.500.000)
  const inv1Res = await rpcService('create_invoice_for_order', {
    p_organization_id: org.id,
    p_actor_id: founder.id,
    p_order_id: orderRes.order_id,
    p_invoice_type: 'DOWN_PAYMENT',
    p_amount_subtotal: 1500000,
    p_amount_shipping: 0,
    p_notes: 'Termin DP 30%',
  });
  await rpcService('issue_invoice', {
    p_organization_id: org.id,
    p_actor_id: founder.id,
    p_invoice_id: inv1Res.invoice_id,
  });

  // Create Invoice 2 (Settlement: Rp 1.000.000)
  const inv2Res = await rpcService('create_invoice_for_order', {
    p_organization_id: org.id,
    p_actor_id: founder.id,
    p_order_id: orderRes.order_id,
    p_invoice_type: 'FINAL_PAYMENT',
    p_amount_subtotal: 1000000,
    p_amount_shipping: 0,
    p_notes: 'Termin Pelunasan Parsial',
  });
  await rpcService('issue_invoice', {
    p_organization_id: org.id,
    p_actor_id: founder.id,
    p_invoice_id: inv2Res.invoice_id,
  });
  console.log(`✓ Order Created: ${orderRes.order_number}`);
  console.log(`✓ Invoice 1 (DP): ${inv1Res.invoice_number} (Rp 1.500.000)`);
  console.log(
    `✓ Invoice 2 (Settlement): ${inv2Res.invoice_number} (Rp 1.000.000)`,
  );

  // --------------------------------------------------------------------------
  // Integration Flow A: record_payment_and_allocate
  // --------------------------------------------------------------------------
  console.log(
    '\n2. Testing Payment Recording and Partial Allocation (record_payment_and_allocate)...',
  );
  const payRecordRes = await rpcService('record_payment_and_allocate', {
    p_organization_id: org.id,
    p_actor_id: founder.id,
    p_brand_id: brand.id,
    p_payment_method: 'BANK_TRANSFER',
    p_amount: 2500000,
    p_payment_date: new Date().toISOString().slice(0, 10),
    p_reference_number: `TRF-BCA-${runSuffix}`,
    p_destination_bank: 'BCA',
    p_destination_account_number: '7770123899',
    p_payer_name: 'PT ABC Kreatif Nusantara',
    p_notes: 'Transfer pembayaran DP + alokasi parsial',
    p_customer_account_id: customer.id,
    p_allocations: [
      {
        invoice_id: inv1Res.invoice_id,
        amount: '1500000',
        notes: 'Alokasi penuh DP',
      },
    ],
  });

  assert.ok(payRecordRes.payment_id, 'Payment ID must be returned');
  assert.equal(
    payRecordRes.status,
    'CONFIRMED',
    'Payment status must be CONFIRMED',
  );
  assert.equal(
    Number(payRecordRes.amount),
    2500000,
    'Payment amount must be 2.500.000',
  );
  assert.equal(
    Number(payRecordRes.allocated_amount),
    1500000,
    'Allocated amount must be 1.500.000',
  );
  assert.equal(
    Number(payRecordRes.unallocated_amount),
    1000000,
    'Unallocated balance must be 1.000.000',
  );

  // Verify DB state
  const [dbPay1] = await queryTable(
    'payments',
    `id=eq.${payRecordRes.payment_id}`,
  );
  assert.equal(dbPay1.status, 'CONFIRMED');
  assert.equal(Number(dbPay1.amount), 2500000);
  assert.equal(Number(dbPay1.allocated_amount), 1500000);

  const [dbInv1] = await queryTable('invoices', `id=eq.${inv1Res.invoice_id}`);
  assert.equal(dbInv1.status, 'PAID', 'Invoice 1 must be transitioned to PAID');
  assert.equal(
    Number(dbInv1.amount_paid),
    1500000,
    'Invoice 1 amount_paid must be 1.500.000',
  );
  assert.equal(
    Number(dbInv1.balance_due),
    0,
    'Invoice 1 balance_due must be 0',
  );

  const allocs1 = await queryTable(
    'payment_allocations',
    `payment_id=eq.${payRecordRes.payment_id}`,
  );
  assert.equal(allocs1.length, 1, 'One allocation record must exist');
  assert.equal(allocs1[0].invoice_id, inv1Res.invoice_id);
  assert.equal(Number(allocs1[0].amount), 1500000);

  const [payAudit1] = await queryTable(
    'payment_audit',
    `payment_id=eq.${payRecordRes.payment_id}&action=eq.payment.recorded`,
  );
  assert.ok(payAudit1, 'Payment audit log must record payment.recorded');

  const ledgerEntries1 = await queryTable(
    'financial_ledger_entries',
    `reference_id=eq.${payRecordRes.payment_id}`,
  );
  assert.ok(
    ledgerEntries1.length > 0,
    'Ledger entry must be recorded for payment',
  );
  console.log(
    `✓ Payment Recorded: ${payRecordRes.payment_number} (Status: CONFIRMED, Unallocated: Rp 1.000.000)`,
  );
  console.log(`✓ Invoice 1 Paid: Status -> PAID, Balance Due -> 0`);
  console.log(`✓ Ledger and Audit verified for payment.recorded`);

  // --------------------------------------------------------------------------
  // Integration Flow B: allocate_existing_payment
  // --------------------------------------------------------------------------
  console.log(
    '\n3. Testing Allocation of Existing Payment (allocate_existing_payment)...',
  );
  const allocRes = await rpcService('allocate_existing_payment', {
    p_organization_id: org.id,
    p_actor_id: founder.id,
    p_payment_id: payRecordRes.payment_id,
    p_invoice_id: inv2Res.invoice_id,
    p_amount: 1000000,
    p_notes: 'Alokasi sisa pembayaran ke Invoice 2',
  });

  assert.equal(allocRes.invoice_id, inv2Res.invoice_id);
  assert.equal(Number(allocRes.allocated_amount), 1000000);
  assert.equal(allocRes.invoice_status, 'PAID');

  const [dbPayAllocated] = await queryTable(
    'payments',
    `id=eq.${payRecordRes.payment_id}`,
  );
  assert.equal(
    Number(dbPayAllocated.allocated_amount),
    2500000,
    'Total allocated must now be 2.500.000',
  );
  assert.equal(
    Number(dbPayAllocated.amount) - Number(dbPayAllocated.allocated_amount),
    0,
    'Unallocated must be 0',
  );

  const [dbInv2] = await queryTable('invoices', `id=eq.${inv2Res.invoice_id}`);
  assert.equal(dbInv2.status, 'PAID', 'Invoice 2 must be transitioned to PAID');
  assert.equal(Number(dbInv2.amount_paid), 1000000);
  assert.equal(Number(dbInv2.balance_due), 0);

  const allocs2 = await queryTable(
    'payment_allocations',
    `payment_id=eq.${payRecordRes.payment_id}`,
  );
  assert.equal(allocs2.length, 2, 'Two allocation records must now exist');

  const [payAudit2] = await queryTable(
    'payment_audit',
    `payment_id=eq.${payRecordRes.payment_id}&action=eq.payment.allocated`,
  );
  assert.ok(payAudit2, 'Payment audit log must record payment.allocated');
  console.log(
    `✓ Payment Allocated: Total Allocated -> Rp 2.500.000, Unallocated -> 0`,
  );
  console.log(`✓ Invoice 2 Paid: Status -> PAID, Balance Due -> 0`);
  console.log(`✓ Audit verified for payment.allocated`);

  // --------------------------------------------------------------------------
  // Integration Flow C: revert_payment
  // --------------------------------------------------------------------------
  console.log('\n4. Testing Payment Reversal (revert_payment)...');
  const revertRes = await rpcService('revert_payment', {
    p_organization_id: org.id,
    p_actor_id: founder.id,
    p_payment_id: payRecordRes.payment_id,
    p_reason: 'Customer requested order cancellation and refund',
  });

  assert.equal(revertRes.status, 'REVERSED', 'Payment status must be REVERSED');

  const [dbPayReverted] = await queryTable(
    'payments',
    `id=eq.${payRecordRes.payment_id}`,
  );
  assert.equal(dbPayReverted.status, 'REVERSED');
  assert.equal(
    Number(dbPayReverted.allocated_amount),
    0,
    'Allocated amount must be rolled back to 0',
  );

  // Verify Invoices Rolled Back to ISSUED
  const [dbInv1Reverted] = await queryTable(
    'invoices',
    `id=eq.${inv1Res.invoice_id}`,
  );
  assert.equal(
    dbInv1Reverted.status,
    'ISSUED',
    'Invoice 1 must be reverted to ISSUED',
  );
  assert.equal(
    Number(dbInv1Reverted.amount_paid),
    0,
    'Invoice 1 amount_paid must be reverted to 0',
  );
  assert.equal(
    Number(dbInv1Reverted.balance_due),
    1500000,
    'Invoice 1 balance_due must be 1.500.000',
  );

  const [dbInv2Reverted] = await queryTable(
    'invoices',
    `id=eq.${inv2Res.invoice_id}`,
  );
  assert.equal(
    dbInv2Reverted.status,
    'ISSUED',
    'Invoice 2 must be reverted to ISSUED',
  );
  assert.equal(
    Number(dbInv2Reverted.amount_paid),
    0,
    'Invoice 2 amount_paid must be reverted to 0',
  );
  assert.equal(
    Number(dbInv2Reverted.balance_due),
    1000000,
    'Invoice 2 balance_due must be 1.000.000',
  );

  const [payAudit3] = await queryTable(
    'payment_audit',
    `payment_id=eq.${payRecordRes.payment_id}&action=eq.payment.reverted`,
  );
  assert.ok(payAudit3, 'Payment audit log must record payment.reverted');

  const revertLedger = await queryTable(
    'financial_ledger_entries',
    `reference_id=eq.${payRecordRes.payment_id}&entry_type=eq.PAYMENT_REVERSED`,
  );
  assert.ok(revertLedger.length > 0, 'Reversal ledger entry must be recorded');
  console.log(`✓ Payment Reverted: Status -> REVERSED, Allocated -> 0`);
  console.log(
    `✓ Invoices Restored: Both Invoices reverted to ISSUED with 0 amount_paid`,
  );
  console.log(`✓ Reversal Ledger and Audit verified`);

  // --------------------------------------------------------------------------
  // Integration Flow D: create_retail_order with auto_pay: true
  // --------------------------------------------------------------------------
  console.log(
    '\n5. Testing Retail Order with Auto-Pay (create_retail_order)...',
  );

  // Ensure inventory item exists
  let [invItem] = await queryTable(
    'inventory_items',
    `sku=eq.TS-NSA-7200-BLK-L`,
  );
  if (!invItem) {
    const invRes = await rpcService('create_inventory_item', {
      p_organization_id: org.id,
      p_actor_id: founder.id,
      p_brand_id: brand.id,
      p_sku: 'TS-NSA-7200-BLK-L',
      p_name: 'Kaos Polos NSA 7200 Black L',
      p_category: 'BLANK_GARMENT',
      p_unit: 'pcs',
      p_cost_price: 38000,
      p_initial_stock: 50,
      p_min_stock_alert: 10,
      p_location_code: 'MAIN_WORKSHOP',
      p_bin_location: 'RACK-A1',
    });
    invItem = { id: invRes.inventory_item_id };
  }
  assert.ok(invItem?.id, 'Inventory item must exist');

  const [stockBefore] = await queryTable(
    'inventory_levels',
    `inventory_item_id=eq.${invItem.id}`,
  );

  const retailOrderRes = await rpcService('create_retail_order', {
    p_organization_id: org.id,
    p_actor_id: founder.id,
    p_brand_id: brand.id,
    p_customer_account_id: customer.id,
    p_items: [
      {
        inventory_item_id: invItem.id,
        quantity: 2,
        unit_price: 75000,
        discount_total: 0,
        notes: 'Retail direct walk-in',
      },
    ],
    p_shipping_cost: 0,
    p_notes: 'Walk-in cash retail order',
    p_auto_pay: true,
    p_payment_method: 'CASH',
    p_payment_reference: `CASH-${runSuffix}`,
  });

  assert.ok(retailOrderRes.order_id, 'Retail order_id must be returned');
  assert.ok(retailOrderRes.invoice_id, 'Retail invoice_id must be returned');
  assert.ok(retailOrderRes.payment_id, 'Retail payment_id must be returned');
  assert.equal(
    retailOrderRes.is_paid,
    true,
    'is_paid must be true for auto_pay',
  );

  // Verify Retail Order in DB
  const [dbRetailOrder] = await queryTable(
    'orders',
    `id=eq.${retailOrderRes.order_id}`,
  );
  assert.equal(
    dbRetailOrder.status,
    'CONFIRMED',
    'Retail order status must be CONFIRMED',
  );
  assert.equal(
    Number(dbRetailOrder.grand_total),
    150000,
    'Retail order grand total must be 150.000',
  );

  // Verify Retail Invoice in DB
  const [dbRetailInvoice] = await queryTable(
    'invoices',
    `id=eq.${retailOrderRes.invoice_id}`,
  );
  assert.equal(
    dbRetailInvoice.status,
    'PAID',
    'Retail invoice status must be PAID',
  );
  assert.equal(
    Number(dbRetailInvoice.amount_paid),
    150000,
    'Retail invoice amount_paid must be 150.000',
  );
  assert.equal(
    Number(dbRetailInvoice.balance_due),
    0,
    'Retail invoice balance_due must be 0',
  );

  // Verify Retail Payment in DB
  const [dbRetailPay] = await queryTable(
    'payments',
    `id=eq.${retailOrderRes.payment_id}`,
  );
  assert.equal(
    dbRetailPay.status,
    'CONFIRMED',
    'Retail payment status must be CONFIRMED',
  );
  assert.equal(
    Number(dbRetailPay.amount),
    150000,
    'Retail payment amount must be 150.000',
  );
  assert.equal(
    Number(dbRetailPay.allocated_amount),
    150000,
    'Retail payment allocated amount must be 150.000',
  );

  // Verify Inventory Stock Reservation
  const [stockAfter] = await queryTable(
    'inventory_levels',
    `inventory_item_id=eq.${invItem.id}`,
  );
  assert.equal(
    Number(stockAfter.quantity_reserved),
    Number(stockBefore.quantity_reserved) + 2,
    `Stock reserved must be incremented by 2 (expected ${Number(stockBefore.quantity_reserved) + 2}, got ${stockAfter.quantity_reserved})`,
  );

  const resvs = await queryTable(
    'inventory_reservations',
    `order_id=eq.${retailOrderRes.order_id}`,
  );
  assert.equal(
    resvs.length,
    1,
    'One inventory reservation record must exist for retail order',
  );
  assert.equal(Number(resvs[0].quantity), 2, 'Reservation quantity must be 2');

  // Verify Retail Ledger Entry
  const retailLedger = await queryTable(
    'financial_ledger_entries',
    `order_id=eq.${retailOrderRes.order_id}`,
  );
  assert.ok(
    retailLedger.length > 0,
    'Retail order must emit financial ledger entry',
  );

  // Verify Retail Audit
  const [retailPayAudit] = await queryTable(
    'payment_audit',
    `payment_id=eq.${retailOrderRes.payment_id}`,
  );
  assert.ok(retailPayAudit, 'Retail payment audit entry must be recorded');

  console.log(
    `✓ Retail Order Created: ${retailOrderRes.order_number} (Grand Total: Rp 150.000)`,
  );
  console.log(
    `✓ Retail Invoice Paid: ${retailOrderRes.invoice_number} (Status: PAID)`,
  );
  console.log(
    `✓ Retail Payment Recorded & Allocated: ${retailOrderRes.payment_number} (Status: CONFIRMED)`,
  );
  console.log(
    `✓ Inventory Reserved: +2 reserved (Total: ${stockAfter.quantity_reserved})`,
  );
  console.log(`✓ Retail Ledger and Audit verified`);

  console.log(
    '\n================================================================',
  );
  console.log('🎉 ALL SEC-01 ASSURANCE CHECKS PASSED (SEC01-QA-001 CLOSED)');
  console.log(
    '================================================================\n',
  );
}

main().catch((err) => {
  console.error('\n❌ ASSURANCE SUITE FAILED:', err);
  process.exit(1);
});
