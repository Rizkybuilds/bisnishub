import assert from 'node:assert/strict';

const BASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:55431';
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
  'Accept-Profile': 'app',
  'Content-Profile': 'app',
};

const endpoint = `${BASE_URL.replace(/\/+$/, '')}/rest/v1`;

async function rpc(functionName, params) {
  const res = await fetch(`${endpoint}/rpc/${functionName}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`RPC ${functionName} failed (${res.status}): ${errorText}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function queryTable(table, query = '') {
  const res = await fetch(`${endpoint}/${table}?${query}`, {
    headers,
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Query ${table} failed (${res.status}): ${errorText}`);
  }
  return res.json();
}

console.log('--- STARTING END-TO-END FLOW VERIFICATION (MGBOS-012..015) ---');

// 1. Context Lookup
console.log('1. Fetching organization, brand, user, customer context...');
const [org] = await queryTable('organizations', 'code=eq.multigraph-group');
assert.ok(org, 'Organization multigraph-group found');
assert.equal(org.status, 'ACTIVE');
assert.ok(org.billing_settings, 'Billing settings configured');
assert.equal(
  org.billing_settings.is_verified,
  true,
  'Bank account is verified',
);
console.log(`   Organization: ${org.legal_name} (${org.code})`);
console.log(
  `   Bank Snapshot: ${org.billing_settings.bank_name} - ${org.billing_settings.account_number}`,
);

const [brand] = await queryTable('brands', 'code=eq.TS');
assert.ok(brand, 'Brand TS found');

const [founder] = await queryTable('users', 'email=eq.founder@multigraph.id');
assert.ok(founder, 'Founder user found');

const [customer] = await queryTable(
  'customer_accounts',
  'status=eq.ACTIVE&limit=1',
);
assert.ok(customer, 'Customer account found');

// 2. Requirement -> Quote -> Order Contract
console.log('2. Creating Requirement & Quote Pipeline...');
const reqRes = await rpc('create_requirement_with_initial_version', {
  p_organization_id: org.id,
  p_brand_id: brand.id,
  p_title: 'E2E Full Verification Apparel Batch',
  p_summary: '60 pcs Premium Heavyweight Oversized Tees',
  p_customer_account_id: customer.id,
  p_quantity: 60,
  p_actor_id: founder.id,
});
console.log(`   Requirement created: Version ID ${reqRes.version_id}`);

await rpc('transition_requirement_status', {
  p_organization_id: org.id,
  p_requirement_id: reqRes.requirement_id,
  p_target_status: 'READY',
  p_actor_id: founder.id,
});

const quoteReqId = crypto.randomUUID();
const quoteRes = await rpc('save_quote_version', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_request_id: quoteReqId,
  p_requirement_version_id: reqRes.version_id,
  p_customer_id: customer.id,
  p_unit_price: 150000,
  p_discount: 0,
  p_shipping: 120000,
  p_costs: [
    {
      cost_type: 'GARMENT',
      description: 'Heavyweight Blanks',
      quantity: 60,
      unit_cost: 65000,
    },
    {
      cost_type: 'PRINTING',
      description: 'DTF 2 Sides Print',
      quantity: 60,
      unit_cost: 30000,
    },
  ],
  p_valid_until: new Date(Date.now() + 14 * 86400000)
    .toISOString()
    .split('T')[0],
  p_terms: 'DP 50%, Pelunasan sebelum kirim',
  p_lead_time: '7 working days',
  p_notes: 'E2E verification quote',
});
console.log(
  `   Quote created: ID ${quoteRes.quote_id}, Version ${quoteRes.version_id}`,
);

await rpc('mark_quote_sent', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_version_id: quoteRes.version_id,
});

await rpc('mark_quote_accepted', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_version_id: quoteRes.version_id,
  p_acceptance_method: 'WHATSAPP',
  p_notes: 'Approved via WA',
});

const orderReqId = crypto.randomUUID();
const orderRes = await rpc('create_order_from_quote', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_request_id: orderReqId,
  p_quote_version_id: quoteRes.version_id,
  p_shipping_address: {
    recipient_name: 'Budi E2E Client',
    phone: '081299887766',
    street: 'Jl. Riau No. 88',
    city: 'Bandung',
  },
});
console.log(
  `   Order Contract Created: ${orderRes.order_number} (Grand Total: Rp 9.120.000)`,
);
assert.match(orderRes.order_number, /^TS-O-\d{4}-\d{6}$/);

// 3. Production Job Splitting (MGBOS-012)
console.log('3. Splitting Order into Production Jobs (MGBOS-012)...');
const [orderItem] = await queryTable(
  'order_items',
  `order_id=eq.${orderRes.order_id}&limit=1`,
);
assert.ok(orderItem, 'Order item found');

const job1Res = await rpc('create_production_job', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_order_id: orderRes.order_id,
  p_job_type: 'PRINTING',
  p_title: 'DTF Front & Back Printing 60 pcs',
  p_estimated_cost: 1800000,
  p_specification: { placement: 'FRONT_BACK', film: 'Cold Peel' },
  p_items: [{ order_item_id: orderItem.id, quantity: 60 }],
  p_priority: 'HIGH',
});
console.log(
  `   Job 1 Created: ${job1Res.job_number} (status: ${job1Res.status})`,
);
assert.match(job1Res.job_number, /^TS-J-\d{4}-\d{6}$/);

// Advance Job 1 through State Machine
await rpc('transition_production_job_status', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_job_id: job1Res.job_id,
  p_to_status: 'READY',
});

await rpc('assign_production_job', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_job_id: job1Res.job_id,
  p_executor_type: 'INTERNAL',
  p_assigned_brand_id: brand.id,
  p_assigned_cost: 1750000,
});

await rpc('transition_production_job_status', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_job_id: job1Res.job_id,
  p_to_status: 'ACCEPTED',
});

await rpc('transition_production_job_status', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_job_id: job1Res.job_id,
  p_to_status: 'IN_PRODUCTION',
});

await rpc('transition_production_job_status', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_job_id: job1Res.job_id,
  p_to_status: 'AWAITING_QC',
});

console.log('   Job 1 advanced successfully to AWAITING_QC');

// 4. Vendor Network & QC (MGBOS-013)
console.log('4. Performing QC Inspections (MGBOS-013)...');
// Outcome 1: REWORK
const qcReworkRes = await rpc('record_qc_inspection', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_production_job_id: job1Res.job_id,
  p_result: 'REWORK',
  p_sample_size: 6,
  p_defect_count: 2,
  p_defect_category: 'PRINT_MISALIGNMENT',
  p_defect_severity: 'MAJOR',
  p_checklist_snapshot: { alignment: false, adhesion: true },
  p_rework_instructions:
    'Sablon miring 1.5 cm di dada kanan, press ulang dengan presisi laser',
  p_notes: 'Ditemukan kemiringan pada 2 sampel',
});
console.log(
  `   QC Inspection 1: ${qcReworkRes.inspection_number} -> Result: ${qcReworkRes.result}`,
);
assert.match(qcReworkRes.inspection_number, /^TS-QC-\d{4}-\d{6}$/);

const [jobAfterRework] = await queryTable(
  'production_jobs',
  `id=eq.${job1Res.job_id}`,
);
assert.equal(
  jobAfterRework.status,
  'REWORK',
  'Job status automatically transitioned to REWORK',
);

// Rework cycle
await rpc('transition_production_job_status', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_job_id: job1Res.job_id,
  p_to_status: 'IN_PRODUCTION',
  p_reason: 'Reworking alignment',
});
await rpc('transition_production_job_status', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_job_id: job1Res.job_id,
  p_to_status: 'AWAITING_QC',
  p_reason: 'Re-inspection after rework',
});

// Outcome 2: PASS
const qcPassRes = await rpc('record_qc_inspection', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_production_job_id: job1Res.job_id,
  p_result: 'PASS',
  p_sample_size: 6,
  p_defect_count: 0,
  p_checklist_snapshot: { alignment: true, adhesion: true, curing: true },
  p_notes: 'Semua 6 sampel lolos toleransi presisi dan ketahanan cuci',
});
console.log(
  `   QC Inspection 2: ${qcPassRes.inspection_number} -> Result: ${qcPassRes.result}`,
);

const [jobAfterPass] = await queryTable(
  'production_jobs',
  `id=eq.${job1Res.job_id}`,
);
assert.equal(
  jobAfterPass.status,
  'READY_FOR_HANDOFF',
  'Job status automatically transitioned to READY_FOR_HANDOFF',
);

// Outcome 3: REJECTED on Job 2
const job2Res = await rpc('create_production_job', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_order_id: orderRes.order_id,
  p_job_type: 'PACKAGING',
  p_title: 'Packaging & Hangtag 60 pcs',
  p_estimated_cost: 300000,
  p_priority: 'NORMAL',
});
await rpc('transition_production_job_status', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_job_id: job2Res.job_id,
  p_to_status: 'READY',
});
await rpc('assign_production_job', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_job_id: job2Res.job_id,
  p_executor_type: 'INTERNAL',
  p_assigned_brand_id: brand.id,
  p_assigned_cost: 250000,
});
await rpc('transition_production_job_status', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_job_id: job2Res.job_id,
  p_to_status: 'ACCEPTED',
});
await rpc('transition_production_job_status', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_job_id: job2Res.job_id,
  p_to_status: 'IN_PRODUCTION',
});
await rpc('transition_production_job_status', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_job_id: job2Res.job_id,
  p_to_status: 'AWAITING_QC',
});

const qcRejectRes = await rpc('record_qc_inspection', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_production_job_id: job2Res.job_id,
  p_result: 'REJECTED',
  p_sample_size: 5,
  p_defect_count: 5,
  p_defect_category: 'FINISHING_PACKAGING',
  p_defect_severity: 'CRITICAL',
  p_notes: 'Polymailer rusak dan sobek saat packaging',
});
console.log(
  `   QC Inspection 3: ${qcRejectRes.inspection_number} -> Result: ${qcRejectRes.result}`,
);

const [jobAfterReject] = await queryTable(
  'production_jobs',
  `id=eq.${job2Res.job_id}`,
);
assert.equal(
  jobAfterReject.status,
  'ON_HOLD',
  'Job status automatically transitioned to ON_HOLD',
);
console.log('   Job 2 automatically placed ON_HOLD upon rejection');

// 5. Commercial Invoicing (MGBOS-014)
console.log('5. Commercial Invoicing Lifecycle (MGBOS-014)...');
// 5.1 DP 50% Invoice (Subtotal 4.500.000 + Shipping 60.000 = Rp 4.560.000)
const dpInvRes = await rpc('create_invoice_for_order', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_order_id: orderRes.order_id,
  p_invoice_type: 'DOWN_PAYMENT',
  p_amount_subtotal: 4500000,
  p_amount_shipping: 60000,
  p_amount_tax: 0,
  p_due_date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
  p_notes: 'Tagihan DP 50%',
});
console.log(
  `   DP Invoice Created: ${dpInvRes.invoice_number} (Amount: Rp ${dpInvRes.amount_total})`,
);
assert.match(dpInvRes.invoice_number, /^TS-INV-\d{4}-\d{6}$/);
assert.equal(dpInvRes.amount_total, 4560000);

const [dpInvRow] = await queryTable('invoices', `id=eq.${dpInvRes.invoice_id}`);
assert.equal(dpInvRow.status, 'DRAFT');
assert.equal(
  dpInvRow.bank_account_snapshot.bank_name,
  org.billing_settings.bank_name,
);
assert.equal(
  dpInvRow.bank_account_snapshot.account_number,
  org.billing_settings.account_number,
);
assert.equal(
  dpInvRow.bank_account_snapshot.account_name,
  org.billing_settings.account_name,
);
console.log('   Bank snapshot verified on invoice record');

// 5.2 Issue Invoice
const issueRes = await rpc('issue_invoice', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_invoice_id: dpInvRes.invoice_id,
});
assert.equal(issueRes.status, 'ISSUED');
console.log(`   Invoice Officially ISSUED: ${issueRes.invoice_number}`);

// 5.3 Final Payment Invoice (Subtotal 4.500.000 + Shipping 60.000 = Rp 4.560.000)
const finalInvRes = await rpc('create_invoice_for_order', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_order_id: orderRes.order_id,
  p_invoice_type: 'FINAL_PAYMENT',
  p_amount_subtotal: 4500000,
  p_amount_shipping: 60000,
  p_amount_tax: 0,
  p_due_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  p_notes: 'Tagihan Pelunasan 50%',
});
console.log(
  `   Final Invoice Created: ${finalInvRes.invoice_number} (Amount: Rp ${finalInvRes.amount_total})`,
);
assert.equal(finalInvRes.amount_total, 4560000);

// Total Invoiced = 4.560.000 + 4.560.000 = 9.120.000 (100% of order grand total)
// 5.4 Test Financial Ceiling Violation
let ceilingBlocked = false;
try {
  await rpc('create_invoice_for_order', {
    p_organization_id: org.id,
    p_actor_id: founder.id,
    p_order_id: orderRes.order_id,
    p_invoice_type: 'PROGRESS',
    p_amount_subtotal: 100000,
  });
} catch (err) {
  ceilingBlocked = true;
  assert.ok(err.message.includes('would exceed order grand total'));
  console.log(
    '   Ceiling guard strictly prevented over-invoicing beyond order grand total',
  );
}
assert.ok(ceilingBlocked, 'Order ceiling guard must block extra invoice');

// 6. Payment Recording & Allocation Lifecycle (MGBOS-015)
console.log('6. Payment Recording & Allocation (MGBOS-015)...');

// 6.1 Issue Final Invoice so it's ready for allocation
const finalIssueRes = await rpc('issue_invoice', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_invoice_id: finalInvRes.invoice_id,
});
assert.equal(finalIssueRes.status, 'ISSUED');
console.log(
  `   Final Invoice Officially ISSUED: ${finalIssueRes.invoice_number}`,
);

// 6.2 Partial Payment on DP Invoice (Rp 2.000.000 of Rp 4.560.000)
console.log('   Recording partial payment of Rp 2.000.000 on DP Invoice...');
const pay1Res = await rpc('record_payment_and_allocate', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_brand_id: brand.id,
  p_payment_method: 'BANK_TRANSFER',
  p_amount: '2000000',
  p_destination_bank: org.billing_settings.bank_name,
  p_destination_account_number: org.billing_settings.account_number,
  p_reference_number: 'TRX-BCA-PARTIAL-001',
  p_payer_name: customer.display_name,
  p_notes: 'Setoran DP termin 1 sebagian',
  p_allocations: [
    {
      invoice_id: dpInvRes.invoice_id,
      amount: '2000000',
      notes: 'Alokasi partial DP',
    },
  ],
  p_customer_account_id: customer.id,
});
assert.match(pay1Res.payment_number, /^TS-PAY-\d{4}-\d{6}$/);
console.log(`   Payment 1 Recorded: ${pay1Res.payment_number}`);

const [dpInvAfterPay1] = await queryTable(
  'invoices',
  `id=eq.${dpInvRes.invoice_id}`,
);
assert.equal(dpInvAfterPay1.status, 'PARTIALLY_PAID');
assert.equal(dpInvAfterPay1.amount_paid, 2000000);
assert.equal(dpInvAfterPay1.balance_due, 2560000);
console.log(
  '   DP Invoice successfully transitioned to PARTIALLY_PAID (Balance Due: Rp 2.560.000)',
);

// 6.3 Test Over-Allocation Rejection (attempt Rp 3.000.000 when balance due is Rp 2.560.000)
let overAllocBlocked = false;
try {
  await rpc('record_payment_and_allocate', {
    p_organization_id: org.id,
    p_actor_id: founder.id,
    p_brand_id: brand.id,
    p_payment_method: 'BANK_TRANSFER',
    p_amount: '3000000',
    p_allocations: [
      {
        invoice_id: dpInvRes.invoice_id,
        amount: '3000000',
      },
    ],
  });
} catch (err) {
  overAllocBlocked = true;
  console.log('   Caught expected error:', err.message);
  assert.ok(
    err.message.toLowerCase().includes('exceed') ||
      err.message.toLowerCase().includes('balance'),
    `Unexpected error message: ${err.message}`,
  );
  console.log('   Over-allocation strictly rejected by balance due guard');
}
assert.ok(overAllocBlocked, 'Over-allocation must be blocked');

// 6.4 Pelunasan Sisa DP Invoice (Rp 2.560.000)
console.log('   Recording full settlement for DP Invoice (Rp 2.560.000)...');
const pay2Res = await rpc('record_payment_and_allocate', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_brand_id: brand.id,
  p_payment_method: 'QRIS',
  p_amount: '2560000',
  p_destination_bank: org.billing_settings.bank_name,
  p_destination_account_number: org.billing_settings.account_number,
  p_reference_number: 'QRIS-NMD-002',
  p_notes: 'Pelunasan sisa tagihan DP',
  p_allocations: [
    {
      invoice_id: dpInvRes.invoice_id,
      amount: '2560000',
      notes: 'Pelunasan DP',
    },
  ],
  p_customer_account_id: customer.id,
});
console.log(`   Payment 2 Recorded: ${pay2Res.payment_number}`);

const [dpInvAfterPay2] = await queryTable(
  'invoices',
  `id=eq.${dpInvRes.invoice_id}`,
);
assert.equal(dpInvAfterPay2.status, 'PAID');
assert.equal(dpInvAfterPay2.amount_paid, 4560000);
assert.equal(dpInvAfterPay2.balance_due, 0);
assert.ok(dpInvAfterPay2.paid_at, 'paid_at timestamp set');
console.log(
  '   DP Invoice successfully transitioned to PAID (Balance Due: Rp 0, LUNAS)',
);

// 6.5 Record and Revert Payment on Final Invoice
console.log('   Testing Payment Reversal Lifecycle on Final Invoice...');
const pay3Res = await rpc('record_payment_and_allocate', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_brand_id: brand.id,
  p_payment_method: 'BANK_TRANSFER',
  p_amount: '1000000',
  p_reference_number: 'TRX-ERR-003',
  p_allocations: [
    {
      invoice_id: finalInvRes.invoice_id,
      amount: '1000000',
    },
  ],
});

const [finalInvAfterPay3] = await queryTable(
  'invoices',
  `id=eq.${finalInvRes.invoice_id}`,
);
assert.equal(finalInvAfterPay3.status, 'PARTIALLY_PAID');
assert.equal(finalInvAfterPay3.amount_paid, 1000000);
console.log('   Final Invoice is PARTIALLY_PAID prior to reversal');

// Revert Payment 3
const revertRes = await rpc('revert_payment', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_payment_id: pay3Res.payment_id,
  p_reason: 'Salah transfer bank oleh nasabah, dana dikembalikan',
});
assert.equal(revertRes.status, 'REVERSED');
console.log(`   Payment 3 successfully REVERSED: ${revertRes.payment_number}`);

const [finalInvAfterRevert] = await queryTable(
  'invoices',
  `id=eq.${finalInvRes.invoice_id}`,
);
assert.equal(finalInvAfterRevert.status, 'ISSUED');
assert.equal(finalInvAfterRevert.amount_paid, 0);
assert.equal(finalInvAfterRevert.balance_due, 4560000);
console.log(
  '   Final Invoice restored to ISSUED with full balance due restored (Rp 4.560.000)',
);

// 7. MGBOS-016: Analytical Ledger, The Cost Trilogy, Courier Pass-Through Isolation & Margin Realization
console.log(
  '\n7. MGBOS-016: Analytical Ledger, The Cost Trilogy & Margin Realization...',
);

console.log('   Settling Actual Production Cost on Job 1...');
const actualCostRes = await rpc('record_actual_job_cost', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_job_id: job1Res.job_id,
  p_actual_cost: '1750000',
  p_notes: 'Produksi selesai tepat waktu, efisiensi bahan Rp 50.000',
});
assert.equal(String(actualCostRes.actual_cost), '1750000');

const [settledJob] = await queryTable(
  'production_jobs',
  `id=eq.${job1Res.job_id}`,
);
assert.equal(settledJob.actual_cost, 1750000);
console.log(
  '   Job 1 Actual Cost Settled: Rp 1.750.000 (Saved Rp 50.000 vs commitment)',
);

console.log('   Settling Actual Production Cost on Job 2...');
const actualCostJob2Res = await rpc('record_actual_job_cost', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_job_id: job2Res.job_id,
  p_actual_cost: '250000',
  p_notes: 'Packaging selesai sesuai komitmen',
});
assert.equal(String(actualCostJob2Res.actual_cost), '250000');
console.log('   Job 2 Actual Cost Settled: Rp 250.000');

console.log('   Querying immutable financial ledger entries...');
const ledgerEntries = await queryTable(
  'financial_ledger_entries',
  `order_id=eq.${orderRes.order_id}&order=created_at.asc`,
);
console.log(
  `   Found ${ledgerEntries.length} ledger entries for Order ${orderRes.order_number}`,
);
assert.ok(ledgerEntries.length >= 4, 'At least 4 ledger events recorded');

const entryTypes = ledgerEntries.map((e) => e.entry_type);
console.log('   Recorded Order Entry Types:', entryTypes.join(', '));
assert.ok(entryTypes.includes('ORDER_COMMITTED'), 'Has ORDER_COMMITTED');
assert.ok(entryTypes.includes('INVOICE_ISSUED'), 'Has INVOICE_ISSUED');
assert.ok(
  entryTypes.includes('SHIPPING_ESCROW_RECORDED'),
  'Has SHIPPING_ESCROW_RECORDED',
);
assert.ok(
  entryTypes.includes('PRODUCTION_ACTUAL_SETTLED'),
  'Has PRODUCTION_ACTUAL_SETTLED',
);

// Verify Cash Movement Ledger Entries on Payments
const [payLedgerEntry] = await queryTable(
  'financial_ledger_entries',
  `reference_id=eq.${pay1Res.payment_id}&entry_type=eq.PAYMENT_RECEIVED`,
);
assert.ok(payLedgerEntry, 'Payment received ledger entry recorded');
assert.equal(payLedgerEntry.category, 'CASH_MOVEMENT');
assert.equal(payLedgerEntry.direction, 'DEBIT');
console.log(
  `   Payment Received Ledger Entry: ${payLedgerEntry.entry_number} (Rp ${Number(payLedgerEntry.amount).toLocaleString('id-ID')})`,
);

// Verify Courier Pass-Through Escrow
const shippingEntry = ledgerEntries.find(
  (e) => e.entry_type === 'SHIPPING_ESCROW_RECORDED',
);
assert.ok(shippingEntry, 'Shipping escrow entry found');
assert.equal(shippingEntry.category, 'PASS_THROUGH_SHIPPING');
console.log(
  `   Shipping Escrow: Rp ${Number(shippingEntry.amount).toLocaleString('id-ID')} (Category: PASS_THROUGH_SHIPPING)`,
);

// Verify Ledger Immutability (Attempt to modify or delete)
console.log('   Testing Financial Ledger Immutability Guard...');
let ledgerUpdateBlocked = false;
try {
  const patchRes = await fetch(
    `${endpoint}/financial_ledger_entries?id=eq.${shippingEntry.id}`,
    {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ amount: '9999999' }),
    },
  );
  if (!patchRes.ok) {
    ledgerUpdateBlocked = true;
    console.log(
      '   PATCH blocked as expected with HTTP status:',
      patchRes.status,
    );
  }
} catch {
  ledgerUpdateBlocked = true;
}
assert.ok(
  ledgerUpdateBlocked,
  'Ledger entry update must be blocked by immutability trigger',
);

// Verify Analytical View: order_financial_summaries
console.log('   Verifying Order Financial Summary analytical view...');
const [summary] = await queryTable(
  'order_financial_summaries',
  `order_id=eq.${orderRes.order_id}&limit=1`,
);
assert.ok(summary, 'Financial summary found for order');
console.log(
  `   - Net Product Revenue:   Rp ${Number(summary.net_product_revenue).toLocaleString('id-ID')}`,
);
console.log(
  `   - Courier Shipping Fee:  Rp ${Number(summary.courier_shipping_fee).toLocaleString('id-ID')}`,
);
console.log(
  `   - Grand Total:           Rp ${Number(summary.grand_total).toLocaleString('id-ID')}`,
);
console.log(
  `   - Estimated Cost (BOM):  Rp ${Number(summary.estimated_cost).toLocaleString('id-ID')}`,
);
console.log(
  `   - Committed Cost (SPK):  Rp ${Number(summary.committed_cost).toLocaleString('id-ID')}`,
);
console.log(
  `   - Actual Cost (Settled): Rp ${Number(summary.actual_cost).toLocaleString('id-ID')}`,
);
console.log(`   - Is Cost Settled:       ${summary.is_cost_settled}`);
console.log(
  `   - Realized Gross Profit: Rp ${Number(summary.realized_gross_profit).toLocaleString('id-ID')}`,
);
console.log(`   - Realized Margin %:     ${summary.realized_margin_pct}%`);
console.log(
  `   - Shipping Margin:       Rp ${Number(summary.courier_shipping_margin).toLocaleString('id-ID')} (Strictly Rp 0 Pass-Through)`,
);
console.log(`   - Margin Health Tier:    ${summary.margin_health}`);

// Assert Courier Shipping Isolation & Margin Realization
assert.equal(
  Number(summary.courier_shipping_margin),
  0,
  'Shipping margin must be strictly Rp 0',
);
assert.equal(summary.is_cost_settled, true, 'Job cost is settled');
assert.ok(
  BigInt(summary.realized_gross_profit) > 0n,
  'Realized gross profit must be positive',
);
assert.ok(summary.realized_margin_pct >= 35, 'Margin health >= 35%');
assert.equal(summary.margin_health, 'HEALTHY');

console.log('\n--- ALL E2E VERIFICATION CHECKS PASSED SUCCESSFULLY! ---');
console.log('Summary of Generated Entities:');
console.log(`- Order Contract:     ${orderRes.order_number}`);
console.log(`- Production Job:     ${job1Res.job_number}`);
console.log(`- QC Rework Doc:      ${qcReworkRes.inspection_number}`);
console.log(`- QC Pass Doc:        ${qcPassRes.inspection_number}`);
console.log(`- DP Invoice:         ${dpInvRes.invoice_number} (Status: PAID)`);
console.log(
  `- Final Invoice:      ${finalInvRes.invoice_number} (Status: ISSUED)`,
);
console.log(`- Payment 1 (Partial):${pay1Res.payment_number}`);
console.log(`- Payment 2 (Lunas):  ${pay2Res.payment_number}`);
console.log(
  `- Payment 3 (Revert): ${pay3Res.payment_number} (Status: REVERSED)`,
);
console.log(
  `- Cost Settled:       Rp ${Number(actualCostRes.actual_cost).toLocaleString('id-ID')} (Status: Settled)`,
);
console.log(
  `- Realized Margin:    ${summary.realized_margin_pct}% (${summary.margin_health})`,
);
