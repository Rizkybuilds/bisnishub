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

// 8. Fulfillment, Delivery Orders (DO) & Logistics Tracking (MGBOS-017 / TS-PLAN-06)
console.log(
  '\n8. Fulfillment, Delivery Orders (DO) & Logistics Tracking (MGBOS-017)...',
);

// 8.1 Create Partial Delivery Order 1 (35 pcs)
console.log('   Creating partial Delivery Order 1 (35 pcs) via J&T Express...');
const do1Res = await rpc('create_delivery_order', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_order_id: orderRes.order_id,
  p_courier_name: 'JNT',
  p_courier_service: 'CARGO',
  p_items: [
    {
      order_item_id: orderItem.id,
      quantity: 35,
      notes: 'Batch 1 - Siap kirim awal (35 pcs)',
    },
  ],
  p_package_weight_grams: 7000,
  p_package_count: 1,
  p_notes: 'Pengiriman batch pertama 35 pcs',
});
console.log(
  `   DO 1 Created: ${do1Res.shipment_number} (Status: ${do1Res.status})`,
);
assert.match(do1Res.shipment_number, /^TS-DO-\d{4}-\d{6}$/);
assert.equal(do1Res.status, 'READY_TO_DISPATCH');

// 8.2 Ceiling Guard: Attempting to create DO with 30 pcs (when only 25 remain)
console.log(
  '   Testing shipment ceiling guard (exceeding remaining unshipped quota)...',
);
let overShipmentBlocked = false;
try {
  await rpc('create_delivery_order', {
    p_organization_id: org.id,
    p_actor_id: founder.id,
    p_order_id: orderRes.order_id,
    p_courier_name: 'JNE',
    p_items: [
      {
        order_item_id: orderItem.id,
        quantity: 30, // 35 + 30 = 65 > 60!
      },
    ],
  });
} catch (err) {
  overShipmentBlocked = true;
  console.log('   Over-shipment correctly blocked:', err.message);
  assert.ok(err.message.includes('exceeds remaining unshipped quota'));
}
assert.ok(
  overShipmentBlocked,
  'Over-shipment must be rejected by ceiling guard',
);

// 8.3 Create Delivery Order 2 for remaining 25 pcs
console.log('   Creating Delivery Order 2 for remaining 25 pcs...');
const do2Res = await rpc('create_delivery_order', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_order_id: orderRes.order_id,
  p_courier_name: 'JNT',
  p_courier_service: 'REGULER',
  p_items: [
    {
      order_item_id: orderItem.id,
      quantity: 25,
    },
  ],
  p_package_weight_grams: 5000,
  p_package_count: 1,
  p_notes: 'Pengiriman batch kedua pelunasan 25 pcs',
});
console.log(
  `   DO 2 Created: ${do2Res.shipment_number} (Status: ${do2Res.status})`,
);
assert.match(do2Res.shipment_number, /^TS-DO-\d{4}-\d{6}$/);

// 8.4 Dispatch Shipment 1 (Serah terima kurir & booking ongkir pass-through)
console.log(
  '   Dispatching DO 1 with tracking number and actual shipping cost...',
);
const dispatchRes = await rpc('dispatch_shipment', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_shipment_id: do1Res.shipment_id,
  p_tracking_number: 'JNT-E2E-77889900',
  p_actual_shipping_cost: 65000,
  p_notes: 'Diserahkan ke kurir J&T Cargo penjemput',
});
console.log(
  `   DO 1 Dispatched: ${dispatchRes.shipment_number} (Status: ${dispatchRes.status}, Resi: ${dispatchRes.tracking_number})`,
);
assert.equal(dispatchRes.status, 'DISPATCHED');
assert.equal(dispatchRes.tracking_number, 'JNT-E2E-77889900');

// Verify Courier Expense Disbursed in Financial Ledger
const courierLedgerEntries = await queryTable(
  'financial_ledger_entries',
  `order_id=eq.${orderRes.order_id}&entry_type=eq.COURIER_EXPENSE_DISBURSED`,
);
assert.equal(
  courierLedgerEntries.length,
  1,
  'Courier expense disbursed entry created in ledger',
);
assert.equal(courierLedgerEntries[0].category, 'PASS_THROUGH_SHIPPING');
assert.equal(courierLedgerEntries[0].direction, 'DEBIT');
assert.equal(Number(courierLedgerEntries[0].amount), 65000);
console.log(
  `   Verified Courier Ledger Entry: ${courierLedgerEntries[0].entry_number} (Rp 65.000 Pass-Through DEBIT)`,
);

// 8.5 Mark Shipment Delivered
console.log('   Confirming delivery of DO 1...');
const deliveredRes = await rpc('mark_shipment_delivered', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_shipment_id: do1Res.shipment_id,
  p_notes: 'Diterima oleh Pak Slamet (Security)',
});
console.log(
  `   DO 1 Delivered: ${deliveredRes.shipment_number} (Status: ${deliveredRes.status})`,
);
assert.equal(deliveredRes.status, 'DELIVERED');

// 8.6 Verify Immutability of Delivered Shipment
console.log('   Testing Delivered Shipment Immutability Guard...');
let deliveredMutationBlocked = false;
try {
  const patchRes = await fetch(
    `${endpoint}/shipments?id=eq.${do1Res.shipment_id}`,
    {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ courier_name: 'TAMPERED_COURIER' }),
    },
  );
  if (!patchRes.ok) {
    deliveredMutationBlocked = true;
    console.log(
      '   PATCH blocked as expected with HTTP status:',
      patchRes.status,
    );
  }
} catch {
  deliveredMutationBlocked = true;
}
assert.ok(
  deliveredMutationBlocked,
  'Delivered shipment modification must be blocked by immutability trigger',
);

// ============================================================================
// 9. SPRINT 7: INVENTORY, SKU VARIAN & MULTI-LOCATION ALLOCATION ENGINE
// ============================================================================
console.log('\n--- 9. Inventory, SKU Variants & Stock Allocation Engine ---');

// 9.1 Create Master Inventory Items
console.log('   Registering Master SKU Blank Garment & DTF Material...');
const blankItemRes = await rpc('create_inventory_item', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_brand_id: brand.id,
  p_sku: 'TS-NSA-7200-WHT-XL',
  p_name: 'Kaos Polos NSA 7200 White XL',
  p_category: 'BLANK_GARMENT',
  p_unit: 'pcs',
  p_attributes: { color: 'White', size: 'XL', brand: 'NSA 7200' },
  p_cost_price: 39000,
  p_min_stock_alert: 10,
  p_initial_stock: 60,
  p_location_code: 'MAIN_WORKSHOP',
  p_bin_location: 'BIN-W1',
});
console.log(
  `   Blank Garment Item Created: ${blankItemRes.sku} (ID: ${blankItemRes.inventory_item_id})`,
);
assert.equal(blankItemRes.sku, 'TS-NSA-7200-WHT-XL');
assert.equal(blankItemRes.quantity_on_hand, 60);

const dtfItemRes = await rpc('create_inventory_item', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_brand_id: brand.id,
  p_sku: 'MAT-DTF-INK-CYAN-1L',
  p_name: 'Tinta DTF Cyan 1 Liter Bottle',
  p_category: 'PRINT_MATERIAL',
  p_unit: 'bottle',
  p_cost_price: 350000,
  p_min_stock_alert: 2,
  p_initial_stock: 5,
  p_location_code: 'MAIN_WORKSHOP',
  p_bin_location: 'CHEM-R1',
});
console.log(`   DTF Material Item Created: ${dtfItemRes.sku}`);

// 9.2 Inbound Purchase Mutation (+40 units blanks)
console.log('   Recording Inbound Purchase Restock (+40 pcs)...');
const inboundRes = await rpc('record_inventory_mutation', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_inventory_item_id: blankItemRes.inventory_item_id,
  p_mutation_type: 'INBOUND_PURCHASE',
  p_quantity: 40,
  p_location_code: 'MAIN_WORKSHOP',
  p_reference_type: 'PO',
  p_notes: 'Penerimaan restock NSA 40 pcs dari distributor',
});
console.log(
  `   Inbound Restock Recorded: Fisik = ${inboundRes.quantity_on_hand}, Tersedia = ${inboundRes.quantity_available}`,
);
assert.equal(inboundRes.quantity_on_hand, 100);
assert.equal(inboundRes.quantity_available, 100);

// 9.3 Stock Reservation for Order
console.log(`   Reserving 50 pcs for Order ${orderRes.order_number}...`);
const reserveRes = await rpc('reserve_inventory_for_order', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_order_id: orderRes.order_id,
  p_items: [
    {
      inventory_item_id: blankItemRes.inventory_item_id,
      quantity: 50,
      location_code: 'MAIN_WORKSHOP',
    },
  ],
  p_notes: 'Reservasi bahan kaos polos untuk produksi pesanan',
});
console.log(
  `   Stock Reservation Created: Status = ${reserveRes.status}, Reserved Items = ${reserveRes.reserved_items_count}`,
);
assert.equal(reserveRes.status, 'RESERVED');

// Verify stock level: on-hand = 100, reserved = 50, available = 50
const [levelAfterReserve] = await queryTable(
  'inventory_levels',
  `inventory_item_id=eq.${blankItemRes.inventory_item_id}`,
);
assert.equal(levelAfterReserve.quantity_on_hand, 100);
assert.equal(levelAfterReserve.quantity_reserved, 50);
console.log('   Level verified: On-Hand = 100, Reserved = 50, Available = 50');

// 9.4 Anti-Overselling Guard (Try to reserve 60 pcs when only 50 available)
console.log(
  '   Testing Anti-Overselling Guard (Requesting 60 pcs over 50 available)...',
);
let oversellBlocked = false;
try {
  await rpc('reserve_inventory_for_order', {
    p_organization_id: org.id,
    p_actor_id: founder.id,
    p_order_id: orderRes.order_id,
    p_items: [
      {
        inventory_item_id: blankItemRes.inventory_item_id,
        quantity: 60,
        location_code: 'MAIN_WORKSHOP',
      },
    ],
  });
} catch (err) {
  oversellBlocked = true;
  assert.ok(
    err.message.includes('Stok tidak mencukupi'),
    `Unexpected error message: ${err.message}`,
  );
  console.log(
    `   Anti-Overselling Guard successfully blocked request: "${err.message}"`,
  );
}
assert.ok(
  oversellBlocked,
  'Anti-overselling must block excessive reservations',
);

// 9.5 Consume Reserved Inventory for Production
console.log('   Consuming 50 reserved units for production print...');
const consumeRes = await rpc('consume_inventory_for_order', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_order_id: orderRes.order_id,
  p_notes: 'Pemakaian fisik 50 pcs kaos polos untuk proses sablon & press',
});
console.log(`   Stock Consumed: Status = ${consumeRes.status}`);
assert.equal(consumeRes.status, 'CONSUMED');

const [levelAfterConsume] = await queryTable(
  'inventory_levels',
  `inventory_item_id=eq.${blankItemRes.inventory_item_id}`,
);
assert.equal(levelAfterConsume.quantity_on_hand, 50);
assert.equal(levelAfterConsume.quantity_reserved, 0);
console.log(
  '   Level verified after consumption: On-Hand = 50, Reserved = 0, Available = 50',
);

// 9.6 Perform Stock Opname Adjustment
console.log(
  '   Performing Stock Opname (Physical count: 48 pcs, -2 variance)...',
);
const opnameRes = await rpc('perform_stock_opname', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_inventory_item_id: blankItemRes.inventory_item_id,
  p_actual_physical_count: 48,
  p_location_code: 'MAIN_WORKSHOP',
  p_reason: 'Audit mingguan gudang: 2 pcs reject cacat jahitan distributor',
});
console.log(
  `   Stock Opname Recorded: Fisik = ${opnameRes.adjusted_on_hand}, Selisih = ${opnameRes.difference}`,
);
assert.equal(opnameRes.adjusted_on_hand, 48);
assert.equal(opnameRes.difference, -2);

// 9.7 Verify Immutability of Inventory Mutation Ledger
console.log('   Testing Inventory Mutation Ledger Immutability Guard...');
let mutationTamperBlocked = false;
try {
  const patchRes = await fetch(
    `${endpoint}/inventory_mutations?inventory_item_id=eq.${blankItemRes.inventory_item_id}`,
    {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ notes: 'TAMPERED_MUTATION' }),
    },
  );
  if (!patchRes.ok) {
    mutationTamperBlocked = true;
    console.log(
      '   PATCH blocked as expected with HTTP status:',
      patchRes.status,
    );
  }
} catch {
  mutationTamperBlocked = true;
}
assert.ok(
  mutationTamperBlocked,
  'Inventory mutation ledger must be strictly immutable and append-only',
);

// ============================================================================
// 10. SPRINT 8: PROCUREMENT, PURCHASE ORDERS & VENDOR BILLS ENGINE
// ============================================================================
console.log('\n--- 10. Procurement, Purchase Orders & Vendor Bills Engine ---');

// 10.1 Register Supplier Vendor
console.log('   Registering Garment Supplier Vendor...');
const vendorCode = `VEND-NSA-${Date.now().toString().slice(-4)}`;
const vendorId = await rpc('create_vendor', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_name: 'PT Distributor Kain Indonesia',
  p_code: vendorCode,
  p_category: 'GARMENT_SUPPLIER',
  p_payment_terms: 'NET_30',
  p_contact_person: 'Pak Budi',
  p_phone: '081234567890',
});
console.log(`   Vendor Registered: ID ${vendorId} (${vendorCode})`);

// 10.2 Create Purchase Order (100 units @ Rp 38.000 + Rp 50.000 shipping = Rp 3.850.000)
console.log('   Creating Purchase Order for 100 pcs NSA blanks...');
const poRes = await rpc('create_purchase_order', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_brand_id: brand.id,
  p_vendor_id: vendorId,
  p_items: [
    {
      inventory_item_id: blankItemRes.inventory_item_id,
      quantity: 100,
      unit_cost: 38000,
      notes: 'Kaos polos NSA 7200 White XL',
    },
  ],
  p_shipping_cost: 50000,
  p_expected_delivery_date: new Date(Date.now() + 7 * 86400000)
    .toISOString()
    .split('T')[0],
  p_payment_terms: 'NET_30',
  p_notes: 'PO Pengadaan restock bahan E2E verification',
});
console.log(
  `   PO Created: ${poRes.po_number} (Status: ${poRes.status}, Total: Rp ${Number(poRes.total_amount).toLocaleString('id-ID')})`,
);
assert.match(poRes.po_number, /^TS-PO-\d{4}-\d{6}$/);
assert.equal(poRes.status, 'ORDERED');
assert.equal(Number(poRes.total_amount), 3850000);

// Query PO Line Item ID
const [poItem] = await queryTable(
  'purchase_order_items',
  `purchase_order_id=eq.${poRes.purchase_order_id}&limit=1`,
);
assert.ok(poItem, 'Purchase order line item exists');
assert.equal(poItem.quantity_ordered, 100);
assert.equal(poItem.quantity_received, 0);

// 10.3 Partial Goods Receipt (60 pcs)
console.log('   Receiving Partial Batch 1 (60 pcs)...');
const gr1Res = await rpc('receive_purchase_order_items', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_purchase_order_id: poRes.purchase_order_id,
  p_items: [
    {
      purchase_order_item_id: poItem.id,
      quantity_accepted: 60,
      quantity_rejected: 0,
    },
  ],
  p_vendor_delivery_note: 'SJ-NSA-99881',
  p_location_code: 'MAIN_WORKSHOP',
  p_notes: 'Penerimaan Batch 1 (60 pcs)',
});
console.log(
  `   GR 1 Recorded: ${gr1Res.receipt_number} (PO Status: ${gr1Res.po_status})`,
);
assert.match(gr1Res.receipt_number, /^TS-GR-\d{4}-\d{6}$/);
assert.equal(gr1Res.po_status, 'PARTIALLY_RECEIVED');

// Verify Stock Incremented (48 previous + 60 = 108)
const [levelAfterGr1] = await queryTable(
  'inventory_levels',
  `inventory_item_id=eq.${blankItemRes.inventory_item_id}`,
);
assert.equal(levelAfterGr1.quantity_on_hand, 108);
console.log('   Stock Level verified: On-Hand = 108 (48 opname + 60 GR)');

// Verify Vendor Bill Auto-Created
const [vendorBill] = await queryTable(
  'vendor_bills',
  `purchase_order_id=eq.${poRes.purchase_order_id}`,
);
assert.ok(vendorBill, 'Vendor bill auto-generated');
assert.match(vendorBill.bill_number, /^TS-VB-\d{4}-\d{6}$/);
assert.equal(Number(vendorBill.total_amount), 3850000);
assert.equal(Number(vendorBill.balance_due), 3850000);
assert.equal(vendorBill.status, 'OPEN');
console.log(
  `   Vendor Bill Auto-Created: ${vendorBill.bill_number} (Status: OPEN, Sisa Hutang: Rp 3.850.000)`,
);

// 10.4 Ceiling Guard on Receipt: Attempt to receive 50 pcs (when remaining is 40)
console.log(
  '   Testing Goods Receipt Ceiling Guard (exceeding remaining quota)...',
);
let grCeilingBlocked = false;
try {
  await rpc('receive_purchase_order_items', {
    p_organization_id: org.id,
    p_actor_id: founder.id,
    p_purchase_order_id: poRes.purchase_order_id,
    p_items: [
      {
        purchase_order_item_id: poItem.id,
        quantity_accepted: 50,
      },
    ],
  });
} catch (err) {
  grCeilingBlocked = true;
  console.log(`   Ceiling Guard successfully blocked: "${err.message}"`);
  assert.ok(err.message.includes('melebihi sisa pesanan PO'));
}
assert.ok(
  grCeilingBlocked,
  'Goods receipt ceiling guard must block excessive receipt',
);

// 10.5 Full Goods Receipt (Remaining 40 pcs)
console.log('   Receiving Batch 2 Pelunasan (Remaining 40 pcs)...');
const gr2Res = await rpc('receive_purchase_order_items', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_purchase_order_id: poRes.purchase_order_id,
  p_items: [
    {
      purchase_order_item_id: poItem.id,
      quantity_accepted: 40,
      quantity_rejected: 0,
    },
  ],
  p_vendor_delivery_note: 'SJ-NSA-99882',
  p_location_code: 'MAIN_WORKSHOP',
  p_notes: 'Penerimaan Batch 2 Pelunasan (40 pcs)',
});
console.log(
  `   GR 2 Recorded: ${gr2Res.receipt_number} (PO Status: ${gr2Res.po_status})`,
);
assert.equal(gr2Res.po_status, 'RECEIVED');

const [levelAfterGr2] = await queryTable(
  'inventory_levels',
  `inventory_item_id=eq.${blankItemRes.inventory_item_id}`,
);
assert.equal(levelAfterGr2.quantity_on_hand, 148);
console.log('   Stock Level verified: On-Hand = 148 (Full 100 pcs received)');

// 10.6 Vendor Bill Payment & Outbound Cash Ledger Emission
console.log('   Paying Vendor Bill (Termin 1: Rp 2.000.000)...');
const payBill1Res = await rpc('pay_vendor_bill', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_vendor_bill_id: vendorBill.id,
  p_amount: 2000000,
  p_payment_method: 'BANK_TRANSFER',
  p_source_bank: 'BCA',
  p_source_account_number: '7770123899',
  p_reference_number: 'TRX-VEND-E2E-001',
  p_notes: 'Pembayaran termin 1 pengadaan bahan',
});
console.log(
  `   Termin 1 Paid: Status = ${payBill1Res.status}, Sisa = Rp ${Number(payBill1Res.balance_due).toLocaleString('id-ID')}`,
);
assert.equal(payBill1Res.status, 'PARTIALLY_PAID');
assert.equal(Number(payBill1Res.balance_due), 1850000);

// Verify Ledger Emission for Vendor Material Payment
const [billLedgerEntry] = await queryTable(
  'financial_ledger_entries',
  `reference_id=eq.${vendorBill.id}&entry_type=eq.VENDOR_MATERIAL_PAYMENT`,
);
assert.ok(billLedgerEntry, 'Outbound vendor payment ledger entry found');
assert.equal(billLedgerEntry.direction, 'CREDIT');
assert.equal(billLedgerEntry.category, 'CASH_MOVEMENT');
assert.equal(Number(billLedgerEntry.amount), 2000000);
console.log(
  `   Ledger Outbound Cash verified: ${billLedgerEntry.entry_number} (Rp 2.000.000 CREDIT)`,
);

// Full Settlement Payment (Remaining Rp 1.850.000)
console.log('   Settling Remaining Vendor Bill (Rp 1.850.000 LUNAS)...');
const payBill2Res = await rpc('pay_vendor_bill', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_vendor_bill_id: vendorBill.id,
  p_amount: 1850000,
  p_payment_method: 'BANK_TRANSFER',
  p_source_bank: 'BCA',
  p_notes: 'Pelunasan sisa tagihan bahan',
});
console.log(
  `   Full Settlement Paid: Status = ${payBill2Res.status}, Sisa = Rp ${Number(payBill2Res.balance_due).toLocaleString('id-ID')}`,
);
assert.equal(payBill2Res.status, 'PAID');
assert.equal(Number(payBill2Res.balance_due), 0);

// ============================================================================
// 11. SPRINT 9: FAST RETAIL ORDERING & POS DIRECT CHECKOUT (MGBOS-020 / TS-PLAN-09)
// ============================================================================
console.log('\n--- 11. Fast Retail Ordering & POS Direct Checkout ---');

// 11.1 Check Available Stock Before Retail Order
const [levelBeforeRetail] = await queryTable(
  'inventory_levels',
  `inventory_item_id=eq.${blankItemRes.inventory_item_id}&location_code=eq.MAIN_WORKSHOP`,
);
assert.ok(levelBeforeRetail, 'Inventory level found before retail order');
const availableBefore =
  levelBeforeRetail.quantity_on_hand - levelBeforeRetail.quantity_reserved;
console.log(
  `   Stock Before Retail: On-Hand = ${levelBeforeRetail.quantity_on_hand}, Reserved = ${levelBeforeRetail.quantity_reserved}, Available = ${availableBefore}`,
);

// 11.2 Test Anti-Overselling Guard (Order qty exceeds available stock)
console.log(
  `   Testing Anti-Overselling Guard (ordering 999 pcs when available is ${availableBefore})...`,
);
let retailOversellBlocked = false;
try {
  await rpc('create_retail_order', {
    p_organization_id: org.id,
    p_actor_id: founder.id,
    p_brand_id: brand.id,
    p_customer_account_id: customer.id,
    p_items: [
      {
        inventory_item_id: blankItemRes.inventory_item_id,
        quantity: 999,
        unit_price: 75000,
        discount_total: 0,
        notes: 'Greedy retail order',
      },
    ],
    p_shipping_cost: 0,
    p_auto_pay: false,
  });
} catch (err) {
  retailOversellBlocked = true;
  console.log(
    `   Anti-Overselling Guard successfully blocked: "${err.message}"`,
  );
  assert.ok(
    err.message.includes('Stok persediaan tidak mencukupi') ||
      err.message.includes('tidak mencukupi'),
  );
}
assert.ok(
  retailOversellBlocked,
  'Anti-overselling guard must block order exceeding available stock',
);

// 11.3 Create Fast Retail Order with POS Instant Payment (QRIS)
console.log(
  '   Placing Fast Retail Direct Order with Immediate QRIS Payment...',
);
const retailOrderRes = await rpc('create_retail_order', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_brand_id: brand.id,
  p_customer_account_id: customer.id,
  p_items: [
    {
      inventory_item_id: blankItemRes.inventory_item_id,
      quantity: 10,
      unit_price: 75000,
      discount_total: 50000,
      notes: '10 pcs NSA White XL Retail Promo',
    },
  ],
  p_shipping_address: {
    recipient_name: 'Budi Santoso (Store Pickup)',
    phone: '081234567890',
    street: 'Jl. Merdeka No. 45',
    city: 'Bandung',
    province: 'Jawa Barat',
    courier_service: 'INSTANT_PICKUP',
  },
  p_shipping_cost: 15000,
  p_notes: 'Pesanan ritel langsung kasir POS dengan diskon promo',
  p_auto_pay: true,
  p_payment_method: 'QRIS',
  p_payment_reference: 'QRIS-POS-E2E-99881',
});

console.log(
  `   Retail Order Created: ${retailOrderRes.order_number} (Order ID: ${retailOrderRes.order_id})`,
);
assert.match(retailOrderRes.order_number, /^TS-O-\d{4}-\d{6}$/);
assert.ok(
  retailOrderRes.invoice_id,
  'Auto-issued commercial invoice generated',
);
assert.match(retailOrderRes.invoice_number, /^TS-INV-\d{4}-\d{6}$/);
assert.ok(retailOrderRes.payment_id, 'POS payment auto-recorded');
assert.match(retailOrderRes.payment_number, /^TS-PAY-\d{4}-\d{6}$/);
assert.equal(retailOrderRes.is_paid, true);

// 11.4 Verify Order Contract Structure
const [retailOrder] = await queryTable(
  'orders',
  `id=eq.${retailOrderRes.order_id}`,
);
assert.ok(retailOrder, 'Retail order contract found');
assert.equal(retailOrder.order_type, 'RETAIL_DIRECT');
assert.equal(retailOrder.source_quote_id, null);
assert.equal(retailOrder.source_quote_version_id, null);
assert.equal(retailOrder.status, 'CONFIRMED');
assert.equal(Number(retailOrder.subtotal), 750000);
assert.equal(Number(retailOrder.discount_total), 50000);
assert.equal(Number(retailOrder.shipping_total), 15000);
assert.equal(Number(retailOrder.grand_total), 715000);
console.log(
  `   Order Contract verified: Type = ${retailOrder.order_type}, Grand Total = Rp ${Number(retailOrder.grand_total).toLocaleString('id-ID')}`,
);

// Verify Order Item has direct inventory_item_id link
const [retailOrderItem] = await queryTable(
  'order_items',
  `order_id=eq.${retailOrderRes.order_id}`,
);
assert.ok(retailOrderItem, 'Retail order item found');
assert.equal(retailOrderItem.inventory_item_id, blankItemRes.inventory_item_id);
assert.equal(retailOrderItem.quantity, 10);
assert.equal(Number(retailOrderItem.unit_price), 75000);
assert.equal(Number(retailOrderItem.discount_total), 50000);
assert.equal(Number(retailOrderItem.subtotal), 700000);
console.log('   Order Item verified: direct inventory_item_id link intact');

// 11.5 Verify Stock Reservation
const [reservation] = await queryTable(
  'inventory_reservations',
  `order_id=eq.${retailOrderRes.order_id}`,
);
assert.ok(reservation, 'Inventory reservation created for retail order');
assert.equal(reservation.inventory_item_id, blankItemRes.inventory_item_id);
assert.equal(reservation.quantity, 10);
assert.equal(reservation.status, 'ACTIVE');

const [levelAfterRetail] = await queryTable(
  'inventory_levels',
  `inventory_item_id=eq.${blankItemRes.inventory_item_id}&location_code=eq.MAIN_WORKSHOP`,
);
assert.equal(
  levelAfterRetail.quantity_reserved,
  levelBeforeRetail.quantity_reserved + 10,
);
const availableAfter =
  levelAfterRetail.quantity_on_hand - levelAfterRetail.quantity_reserved;
assert.equal(availableAfter, availableBefore - 10);
console.log(
  `   Stock Reservation verified: 10 units reserved, Available reduced to ${availableAfter}`,
);

// 11.6 Verify Auto-Issued Commercial Invoice
const [retailInvoice] = await queryTable(
  'invoices',
  `id=eq.${retailOrderRes.invoice_id}`,
);
assert.ok(retailInvoice, 'Retail commercial invoice found');
assert.equal(retailInvoice.invoice_type, 'FULL_PAYMENT');
assert.equal(retailInvoice.status, 'PAID');
assert.equal(Number(retailInvoice.amount_total), 715000);
assert.equal(Number(retailInvoice.amount_paid), 715000);
assert.equal(Number(retailInvoice.balance_due), 0);
console.log(
  `   Invoice verified: ${retailInvoice.invoice_number} (Status: PAID, Balance Due: Rp 0)`,
);

// 11.7 Verify POS Payment Settlement
const [posPayment] = await queryTable(
  'payments',
  `id=eq.${retailOrderRes.payment_id}`,
);
assert.ok(posPayment, 'POS payment record found');
assert.equal(posPayment.status, 'CONFIRMED');
assert.equal(posPayment.payment_method, 'QRIS');
assert.equal(Number(posPayment.amount), 715000);
assert.equal(posPayment.reference_number, 'QRIS-POS-E2E-99881');
console.log(
  `   POS Payment verified: ${posPayment.payment_number} (QRIS Rp 715.000 LUNAS)`,
);

// 11.8 Verify Financial Ledger Emission
const [retailOrderLedger] = await queryTable(
  'financial_ledger_entries',
  `reference_id=eq.${retailOrderRes.order_id}&entry_type=eq.ORDER_COMMITTED`,
);
assert.ok(retailOrderLedger, 'Order committed ledger entry found');
assert.equal(retailOrderLedger.direction, 'CREDIT');
// Strict Financial Separation: ORDER_COMMITTED records Net Product Revenue (subtotal - discount = 700.000), isolating shipping fee
assert.equal(Number(retailOrderLedger.amount), 700000);

const [retailPaymentLedger] = await queryTable(
  'financial_ledger_entries',
  `reference_id=eq.${retailOrderRes.payment_id}&entry_type=eq.PAYMENT_RECEIVED`,
);
assert.ok(retailPaymentLedger, 'Payment received ledger entry found');
assert.equal(retailPaymentLedger.direction, 'DEBIT');
assert.equal(retailPaymentLedger.category, 'CASH_MOVEMENT');
assert.equal(Number(retailPaymentLedger.amount), 715000);
console.log(
  `   Ledger Entries verified: ORDER_COMMITTED (${retailOrderLedger.entry_number}, Rp 700.000 Net Revenue) & PAYMENT_RECEIVED (${retailPaymentLedger.entry_number}, Rp 715.000 Cash)`,
);

console.log('\n--- ALL E2E VERIFICATION CHECKS PASSED SUCCESSFULLY! ---');
console.log('Summary of Generated Entities:');
console.log(`- Order Contract:     ${orderRes.order_number}`);
console.log(
  `- Retail POS Order:   ${retailOrderRes.order_number} (Status: CONFIRMED, PAID)`,
);
console.log(`- Production Job:     ${job1Res.job_number}`);
console.log(`- QC Rework Doc:      ${qcReworkRes.inspection_number}`);
console.log(`- QC Pass Doc:        ${qcPassRes.inspection_number}`);
console.log(`- DP Invoice:         ${dpInvRes.invoice_number} (Status: PAID)`);
console.log(
  `- Final Invoice:      ${finalInvRes.invoice_number} (Status: ISSUED)`,
);
console.log(
  `- Retail Invoice:     ${retailInvoice.invoice_number} (Status: PAID)`,
);
console.log(`- Payment 1 (Partial):${pay1Res.payment_number}`);
console.log(`- Payment 2 (Lunas):  ${pay2Res.payment_number}`);
console.log(
  `- Payment 3 (Revert): ${pay3Res.payment_number} (Status: REVERSED)`,
);
console.log(`- POS QRIS Payment:   ${posPayment.payment_number} (Rp 715.000)`);
console.log(
  `- Cost Settled:       Rp ${Number(actualCostRes.actual_cost).toLocaleString('id-ID')} (Status: Settled)`,
);
console.log(
  `- Realized Margin:    ${summary.realized_margin_pct}% (${summary.margin_health})`,
);
console.log(
  `- Delivery Order 1:   ${do1Res.shipment_number} (Status: DELIVERED, Resi: ${dispatchRes.tracking_number})`,
);
console.log(
  `- Delivery Order 2:   ${do2Res.shipment_number} (Status: READY_TO_DISPATCH)`,
);
console.log(
  `- Inventory SKU 1:    ${blankItemRes.sku} (Fisik: 48, Nilai: Rp ${Number(48 * 39000).toLocaleString('id-ID')})`,
);
console.log(
  `- Inventory SKU 2:    ${dtfItemRes.sku} (Fisik: 5, Nilai: Rp ${Number(5 * 350000).toLocaleString('id-ID')})`,
);
console.log(
  `- Purchase Order:     ${poRes.po_number} (Status: ${gr2Res.po_status}, Total: Rp ${Number(poRes.total_amount).toLocaleString('id-ID')})`,
);
console.log(
  `- Goods Receipt 1:    ${gr1Res.receipt_number} (+60 pcs diterima)`,
);
console.log(
  `- Goods Receipt 2:    ${gr2Res.receipt_number} (+40 pcs diterima, LENGKAP)`,
);
console.log(
  `- Vendor Bill:        ${vendorBill.bill_number} (Status: ${payBill2Res.status}, LUNAS Kas Keluar)`,
);
console.log(
  `- Outbound Cash Entry:${billLedgerEntry.entry_number} (Rp ${Number(billLedgerEntry.amount).toLocaleString('id-ID')} CREDIT)`,
);
