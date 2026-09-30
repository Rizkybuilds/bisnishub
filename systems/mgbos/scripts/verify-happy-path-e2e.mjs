import assert from 'node:assert/strict';

/**
 * MultiGraph Business OS — Focused Clean Happy-Path E2E Flow (P0-07)
 *
 * Verifies the complete, pristine operating journey from Lead to Order Completion:
 * Lead → Qualify → Convert/Link Customer → Requirement → READY → Quote → SENT → ACCEPTED
 * → Order Contract → ACTIVE → Down Payment Invoice → Payment Received → Production Job
 * → Vendor Assignment → Assignment ACCEPTED → IN_PRODUCTION → AWAITING_QC → QC PASS
 * → READY_FOR_HANDOFF → Delivery Order → DISPATCHED → DELIVERED → Final Payment
 * → Settle Actual Cost → Order COMPLETED → Analytical Realized Margin
 */

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
  Prefer: 'return=representation',
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

async function insertRow(table, row) {
  const res = await fetch(`${endpoint}/${table}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Insert ${table} failed (${res.status}): ${errorText}`);
  }
  return res.json();
}

const runSuffix = Date.now().toString().slice(-6);
console.log(`\n================================================================`);
console.log(`🚀 STARTING CLEAN HAPPY-PATH E2E VERIFICATION [Run: ${runSuffix}]`);
console.log(`================================================================\n`);

// ----------------------------------------------------------------------------
// 0. Context & Master Data Lookup
// ----------------------------------------------------------------------------
console.log('--- Phase 0: Organization & Master Data Context Lookup ---');
const [org] = await queryTable('organizations', 'code=eq.multigraph-group');
assert.ok(org, 'Organization multigraph-group must exist');
assert.equal(org.status, 'ACTIVE', 'Organization must be ACTIVE');
console.log(`✓ Organization: ${org.legal_name} (${org.code})`);

const [brand] = await queryTable('brands', 'code=eq.TS');
assert.ok(brand, 'Brand TS must exist');
assert.equal(brand.status, 'ACTIVE', 'Brand TS must be ACTIVE');
console.log(`✓ Brand: ${brand.name} (${brand.code})`);

const [founder] = await queryTable('users', 'email=eq.founder@multigraph.id');
assert.ok(founder, 'Founder user must exist');
console.log(`✓ Actor User: ${founder.name} (${founder.email})`);

const channels = await queryTable('channels', `organization_id=eq.${org.id}&code=eq.WHATSAPP`);
assert.ok(channels.length > 0, 'WhatsApp lead channel must exist');
const channelId = channels[0].id;
console.log(`✓ Lead Channel: WHATSAPP (${channelId})`);

// ----------------------------------------------------------------------------
// 1. Lead Intake & Qualification (AC-02)
// ----------------------------------------------------------------------------
console.log('\n--- Phase 1: Lead Intake & Qualification (AC-02) ---');
const leadTitle = `Kaos Custom Komunitas Motor Batch ${runSuffix}`;
const leadContact = `Pak Hendra ${runSuffix}`;
const leadEmail = `hendra.${runSuffix}@komunitas.id`;

const [createdLead] = await insertRow('leads', {
  organization_id: org.id,
  brand_id: brand.id,
  channel_id: channelId,
  title: leadTitle,
  contact_name: leadContact,
  company_name: `Komunitas Motor Bandung ${runSuffix}`,
  email: leadEmail,
  phone: '081234567890',
  raw_inquiry: 'Halo, mau pesan kaos sablon DTF 50 pcs untuk acara anniversary komunitas.',
  estimated_quantity: 50,
  estimated_budget: 6000000,
  status: 'NEW',
});

assert.ok(createdLead, 'Lead must be inserted');
assert.ok(createdLead.id, 'Lead ID must be generated');
assert.ok(createdLead.lead_number, 'Lead number must be generated automatically');
assert.equal(createdLead.status, 'NEW', 'Initial lead status must be NEW');
console.log(`✓ Lead Created: ${createdLead.lead_number} (ID: ${createdLead.id})`);

console.log('   Qualifying Lead via transition_lead_status...');
await rpc('transition_lead_status', {
  p_organization_id: org.id,
  p_lead_id: createdLead.id,
  p_target_status: 'QUALIFIED',
  p_qualification_result: 'QUALIFIED',
  p_qualification_score: 95,
  p_qualification_notes: 'Budget terverifikasi, jumlah 50 pcs, desain siap cetak.',
  p_actor_id: founder.id,
});

const [qualifiedLead] = await queryTable('leads', `id=eq.${createdLead.id}`);
assert.equal(qualifiedLead.status, 'QUALIFIED', 'Lead status must be QUALIFIED');
assert.equal(qualifiedLead.qualification_score, 95, 'Qualification score must be 95');
console.log(`✓ Lead Qualified: Status = ${qualifiedLead.status} (Score: ${qualifiedLead.qualification_score})`);

// ----------------------------------------------------------------------------
// 2. Atomic Customer Account Conversion (AC-02)
// ----------------------------------------------------------------------------
console.log('\n--- Phase 2: Atomic Customer Conversion (AC-02) ---');
const convertRes = await rpc('convert_lead_to_customer', {
  p_organization_id: org.id,
  p_lead_id: createdLead.id,
  p_create_new_account: true,
  p_actor_id: founder.id,
});

assert.ok(convertRes.success, 'Conversion must succeed');
assert.ok(convertRes.customer_account_id, 'Customer Account ID must be returned');
const customerAccountId = convertRes.customer_account_id;

const [convertedLead] = await queryTable('leads', `id=eq.${createdLead.id}`);
assert.equal(convertedLead.status, 'CONVERTED', 'Lead status must transition to CONVERTED');
assert.equal(convertedLead.customer_account_id, customerAccountId, 'Lead must link to customer account');

const [customerAcc] = await queryTable('customer_accounts', `id=eq.${customerAccountId}`);
assert.ok(customerAcc, 'Customer account must exist');
assert.equal(customerAcc.status, 'ACTIVE', 'Customer account must be ACTIVE');
console.log(`✓ Customer Account Created & Linked: ${customerAcc.display_name} (ID: ${customerAccountId})`);

// ----------------------------------------------------------------------------
// 3. Requirement Formulation & Progression to READY
// ----------------------------------------------------------------------------
console.log('\n--- Phase 3: Requirement Formulation & Status READY ---');
const customSpec = {
  schemaCode: 'teestock.custom_atelier.v1',
  garment: {
    type: 'T-Shirt',
    fit: 'Regular',
    material: 'Cotton Combed 24s',
    color: 'Solid Black',
    gsm: 185,
    blankPreference: 'Koze Comfort',
  },
  sizes: { S: 10, M: 20, L: 15, XL: 5, XXL: 0 },
  decorations: [
    {
      location: 'Front',
      method: 'DTF',
      widthCm: 25,
      heightCm: 30,
      colors: 4,
      artworkReference: 'artwork_anniversary_front.png',
      notes: 'Warna cerah, jangan luntur saat cuci',
    },
  ],
  customization: 'Woven damask label on hem',
};

const reqRes = await rpc('create_requirement_with_initial_version', {
  p_organization_id: org.id,
  p_brand_id: brand.id,
  p_title: leadTitle,
  p_summary: '50 pcs Kaos Combed 24s DTF Depan',
  p_customer_account_id: customerAccountId,
  p_lead_id: createdLead.id,
  p_quantity: 50,
  p_unit: 'PCS',
  p_target_budget: 6000000,
  p_specification: customSpec,
  p_actor_id: founder.id,
});

assert.ok(reqRes.requirement_id, 'Requirement ID must be returned');
assert.ok(reqRes.version_id, 'Requirement initial version ID must be returned');
assert.equal(reqRes.version_number, 1, 'Initial version number must be 1');
console.log(`✓ Requirement Created: ID ${reqRes.requirement_id} (Version: ${reqRes.version_id})`);

console.log('   Advancing Requirement to READY...');
await rpc('transition_requirement_status', {
  p_organization_id: org.id,
  p_requirement_id: reqRes.requirement_id,
  p_target_status: 'READY',
  p_actor_id: founder.id,
});

const [readyReq] = await queryTable('requirements', `id=eq.${reqRes.requirement_id}`);
assert.equal(readyReq.status, 'READY', 'Requirement must reach READY status');
console.log(`✓ Requirement Status: ${readyReq.status}`);

// ----------------------------------------------------------------------------
// 4. Quotation Pipeline & Customer Acceptance
// ----------------------------------------------------------------------------
console.log('\n--- Phase 4: Commercial Quotation & Customer Acceptance ---');
const quoteReqId = crypto.randomUUID();
const quoteRes = await rpc('save_quote_version', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_request_id: quoteReqId,
  p_requirement_version_id: reqRes.version_id,
  p_customer_id: customerAccountId,
  p_unit_price: 120000,
  p_discount: 0,
  p_shipping: 50000,
  p_costs: [
    {
      cost_type: 'GARMENT',
      description: 'Cotton Combed 24s Blanks',
      quantity: 50,
      unit_cost: 35000,
    },
    {
      cost_type: 'PRINTING',
      description: 'DTF Front Print',
      quantity: 50,
      unit_cost: 25000,
    },
  ],
  p_valid_until: new Date(Date.now() + 14 * 86400000)
    .toISOString()
    .split('T')[0],
  p_terms: 'DP 50%, Pelunasan sebelum kirim',
  p_lead_time: '7 working days',
  p_notes: 'Happy-path E2E verification quote',
});

assert.ok(quoteRes.quote_id, 'Quote ID must be returned');
assert.ok(quoteRes.version_id, 'Quote version ID must be returned');
console.log(`✓ Quote Draft Created: Version ${quoteRes.version_id}`);

console.log('   Sending Quote to Customer (SENT)...');
await rpc('mark_quote_sent', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_version_id: quoteRes.version_id,
});

console.log('   Customer Accepts Quote (ACCEPTED)...');
await rpc('mark_quote_accepted', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_version_id: quoteRes.version_id,
  p_acceptance_method: 'WHATSAPP',
  p_notes: 'Disetujui via WhatsApp oleh Pak Hendra',
});

const [acceptedQuote] = await queryTable('quote_versions', `id=eq.${quoteRes.version_id}`);
assert.equal(acceptedQuote.status, 'ACCEPTED', 'Quote version status must be ACCEPTED');
console.log(`✓ Quote Status: ${acceptedQuote.status}`);

// ----------------------------------------------------------------------------
// 5. Authoritative Order Creation & Transition to ACTIVE
// ----------------------------------------------------------------------------
console.log('\n--- Phase 5: Authoritative Order Creation & Transition to ACTIVE ---');
const orderReqId = crypto.randomUUID();
const orderRes = await rpc('create_order_from_quote', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_request_id: orderReqId,
  p_quote_version_id: quoteRes.version_id,
  p_shipping_address: {
    recipient_name: leadContact,
    phone: '081234567890',
    street: 'Jl. Riau No. 88',
    city: 'Bandung',
  },
});

assert.ok(orderRes.order_id, 'Order ID must be returned');
assert.ok(orderRes.order_number, 'Order number must be generated');
console.log(`✓ Order Contract Created: ${orderRes.order_number} (ID: ${orderRes.order_id})`);

const [initialOrder] = await queryTable('orders', `id=eq.${orderRes.order_id}`);
assert.equal(initialOrder.status, 'CONFIRMED', 'Initial order status must be CONFIRMED');
assert.equal(initialOrder.source_quote_id, quoteRes.quote_id, 'Order must link to source quote');
assert.equal(initialOrder.source_quote_version_id, quoteRes.version_id, 'Order must link to source quote version');
assert.equal(initialOrder.source_requirement_id, reqRes.requirement_id, 'Order must link to source requirement');

const orderItems = await queryTable('order_items', `order_id=eq.${orderRes.order_id}`);
assert.equal(orderItems.length, 1, 'Order must have exactly 1 item');
const orderItem = orderItems[0];
assert.equal(orderItem.quantity, 50, 'Order item quantity must be 50');

console.log('   Transitioning Order CONFIRMED -> ACTIVE (P0-02)...');
const activeTransition = await rpc('transition_order_status', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_order_id: orderRes.order_id,
  p_target_status: 'ACTIVE',
  p_reason: 'DP commitment verified, proceeding to active production',
});

assert.equal(activeTransition.new_status, 'ACTIVE', 'Order status must transition to ACTIVE');
console.log(`✓ Order Status: ${activeTransition.new_status}`);

// ----------------------------------------------------------------------------
// 6. Commercial Down Payment Invoicing & Cash Receipt
// ----------------------------------------------------------------------------
console.log('\n--- Phase 6: Commercial DP Invoicing & Payment Recording ---');
const dpInvRes = await rpc('create_invoice_for_order', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_order_id: orderRes.order_id,
  p_invoice_type: 'DOWN_PAYMENT',
  p_amount_subtotal: 3000000,
  p_amount_shipping: 0,
  p_notes: 'Termin DP 50% Produksi',
});

assert.ok(dpInvRes.invoice_id, 'DP Invoice ID must be generated');
console.log(`✓ DP Invoice Created: ${dpInvRes.invoice_number} (Amount: Rp 3.000.000)`);

console.log('   Issuing DP Invoice...');
await rpc('issue_invoice', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_invoice_id: dpInvRes.invoice_id,
});

console.log('   Recording Full Payment for DP Invoice (Rp 3.000.000)...');
const pay1Res = await rpc('record_payment_and_allocate', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_brand_id: brand.id,
  p_payment_method: 'BANK_TRANSFER',
  p_amount: '3000000',
  p_reference_number: `TRF-BCA-DP-${runSuffix}`,
  p_payer_name: leadContact,
  p_allocations: [
    {
      invoice_id: dpInvRes.invoice_id,
      amount: '3000000',
    },
  ],
});

assert.ok(pay1Res.payment_id, 'Payment ID must be returned');
const [dpInvoice] = await queryTable('invoices', `id=eq.${dpInvRes.invoice_id}`);
assert.equal(dpInvoice.status, 'PAID', 'DP Invoice must be PAID');
assert.equal(dpInvoice.balance_due, 0, 'DP Invoice balance due must be 0 (LUNAS)');
console.log(`✓ DP Payment Settled: ${pay1Res.payment_number} -> Invoice ${dpInvoice.invoice_number} is PAID`);

// ----------------------------------------------------------------------------
// 7. Production Job Creation & Vendor-Backed Assignment (AC-03, AC-04)
// ----------------------------------------------------------------------------
console.log('\n--- Phase 7: Production Job & Canonical Vendor Assignment (AC-03, AC-04) ---');
const jobRes = await rpc('create_production_job', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_order_id: orderRes.order_id,
  p_job_type: 'PRINTING',
  p_title: `Sablon DTF Kaos Komunitas Motor ${runSuffix}`,
  p_estimated_cost: 1500000,
  p_specification: { placement: 'FRONT', film: 'Hot Peel' },
  p_items: [
    {
      order_item_id: orderItem.id,
      quantity: 50,
    },
  ],
  p_priority: 'HIGH',
});

assert.ok(jobRes.job_id, 'Production Job ID must be returned');
console.log(`✓ Production Job Created: ${jobRes.job_number} (status: ${jobRes.status})`);

console.log('   Advancing Job to READY status...');
await rpc('transition_production_job_status', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_job_id: jobRes.job_id,
  p_to_status: 'READY',
});

// Canonical Vendor resolution (AC-03)
console.log('   Resolving canonical print studio vendor (AC-03)...');
let vendors = await queryTable(
  'vendors',
  `organization_id=eq.${org.id}&category=eq.PRINT_STUDIO&status=eq.ACTIVE&limit=1`,
);

let vendorId;
let vendorName;
if (vendors.length > 0) {
  vendorId = vendors[0].id;
  vendorName = vendors[0].name;
} else {
  const newVendorCode = `VND-DTF-${runSuffix}`;
  vendorId = await rpc('create_vendor', {
    p_organization_id: org.id,
    p_actor_id: founder.id,
    p_name: `Berkah DTF Express ${runSuffix}`,
    p_code: newVendorCode,
    p_category: 'PRINT_STUDIO',
    p_contact_person: 'Pak Ujang',
    p_phone: '081399887766',
    p_address: 'Jl. Cetak Grafika No. 15, Bandung',
  });
  vendorName = `Berkah DTF Express ${runSuffix}`;
}
console.log(`✓ Canonical Vendor Selected: ${vendorName} (ID: ${vendorId})`);

console.log('   Assigning Production Job to Vendor (P0-03)...');
const assignmentId = await rpc('assign_production_job', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_job_id: jobRes.job_id,
  p_executor_type: 'VENDOR',
  p_vendor_name: vendorName,
  p_vendor_id: vendorId,
  p_assigned_cost: 1200000,
  p_notes: 'Mohon selesaikan sebelum tanggal 10 Oktober',
});

assert.ok(assignmentId, 'Assignment ID must be returned');
const [jobAssigned] = await queryTable('production_jobs', `id=eq.${jobRes.job_id}`);
assert.equal(jobAssigned.status, 'ASSIGNED', 'Job status must be ASSIGNED');
assert.equal(jobAssigned.committed_cost, 1200000, 'Job committed cost must be Rp 1.200.000');
console.log(`✓ Job Assigned: Status = ${jobAssigned.status}, Committed Cost = Rp 1.200.000`);

console.log('   Vendor Accepts Assignment (AC-04 / P0-04)...');
const acceptRes = await rpc('accept_production_assignment', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_assignment_id: assignmentId,
});

assert.equal(acceptRes.status, 'ACCEPTED', 'Assignment status must be ACCEPTED');
const [jobAfterAccept] = await queryTable('production_jobs', `id=eq.${jobRes.job_id}`);
assert.equal(jobAfterAccept.status, 'ACCEPTED', 'Job status must sync to ACCEPTED');
console.log(`✓ Assignment Accepted: Status = ${acceptRes.status}, Job Status = ${jobAfterAccept.status}`);

// ----------------------------------------------------------------------------
// 8. Shop Floor Progression & QC Inspection PASS
// ----------------------------------------------------------------------------
console.log('\n--- Phase 8: Shop-Floor Progression & QC Inspection PASS ---');
console.log('   Advancing Job to IN_PRODUCTION...');
await rpc('transition_production_job_status', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_job_id: jobRes.job_id,
  p_to_status: 'IN_PRODUCTION',
});

console.log('   Advancing Job to AWAITING_QC...');
await rpc('transition_production_job_status', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_job_id: jobRes.job_id,
  p_to_status: 'AWAITING_QC',
});

console.log('   Conducting QC Inspection with Result PASS...');
const qcRes = await rpc('record_qc_inspection', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_production_job_id: jobRes.job_id,
  p_result: 'PASS',
  p_sample_size: 10,
  p_defect_count: 0,
  p_checklist_snapshot: {
    print_clarity: true,
    curing_durability: true,
    dimension_accuracy: true,
  },
  p_notes: 'Hasil sablon presisi, warna cerah, uji cuci aman.',
});

assert.ok(qcRes.inspection_id, 'QC inspection ID must be generated');
assert.equal(qcRes.result, 'PASS', 'QC inspection result must be PASS');
console.log(`✓ QC Inspection Recorded: ${qcRes.inspection_number} -> Result: ${qcRes.result}`);

console.log('   Advancing Job to READY_FOR_HANDOFF...');
await rpc('transition_production_job_status', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_job_id: jobRes.job_id,
  p_to_status: 'READY_FOR_HANDOFF',
});

const [handoffJob] = await queryTable('production_jobs', `id=eq.${jobRes.job_id}`);
assert.equal(handoffJob.status, 'READY_FOR_HANDOFF', 'Job must reach READY_FOR_HANDOFF');
console.log(`✓ Job Ready for Fulfillment: Status = ${handoffJob.status}`);

// ----------------------------------------------------------------------------
// 9. Governed Fulfillment, Delivery Order (DO) & Logistics (AC-05)
// ----------------------------------------------------------------------------
console.log('\n--- Phase 9: Governed Fulfillment & Shipment Delivery (AC-05) ---');
console.log('   Creating Delivery Order (DO) for 50 pcs...');
const doRes = await rpc('create_delivery_order', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_order_id: orderRes.order_id,
  p_courier_name: 'JNT',
  p_courier_service: 'EZ',
  p_package_weight_grams: 12500,
  p_package_count: 1,
  p_notes: 'Paket kaos anniversary komunitas',
  p_items: [
    {
      order_item_id: orderItem.id,
      quantity: 50,
    },
  ],
});

assert.ok(doRes.shipment_id, 'Shipment ID must be generated');
assert.equal(doRes.status, 'READY_TO_DISPATCH', 'DO initial status must be READY_TO_DISPATCH');
console.log(`✓ Delivery Order Created: ${doRes.shipment_number} (Status: ${doRes.status})`);

console.log('   Dispatching Shipment with tracking courier resi...');
const resiNumber = `JNT-HAPPY-${runSuffix}`;
const dispatchRes = await rpc('dispatch_shipment', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_shipment_id: doRes.shipment_id,
  p_tracking_number: resiNumber,
  p_actual_shipping_cost: 48000,
  p_notes: 'Diserahkan ke kurir J&T Express',
});

assert.equal(dispatchRes.status, 'DISPATCHED', 'Shipment status must be DISPATCHED');
assert.equal(dispatchRes.tracking_number, resiNumber, 'Tracking number must be recorded');
console.log(`✓ Shipment Dispatched: Resi = ${dispatchRes.tracking_number} (Status: ${dispatchRes.status})`);

console.log('   Confirming Shipment Delivery to Customer...');
const deliveredRes = await rpc('mark_shipment_delivered', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_shipment_id: doRes.shipment_id,
  p_notes: 'Paket diterima langsung oleh Pak Hendra dalam kondisi baik.',
});

assert.equal(deliveredRes.status, 'DELIVERED', 'Shipment status must be DELIVERED');
console.log(`✓ Shipment Delivered: Status = ${deliveredRes.status}`);

// ----------------------------------------------------------------------------
// 10. Final Settlement Invoicing & Payment
// ----------------------------------------------------------------------------
console.log('\n--- Phase 10: Final Settlement Invoicing & Pelunasan ---');
const finalInvRes = await rpc('create_invoice_for_order', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_order_id: orderRes.order_id,
  p_invoice_type: 'FINAL_PAYMENT',
  p_amount_subtotal: 3000000,
  p_amount_shipping: 50000,
  p_notes: 'Tagihan Pelunasan 50% + Ongkir Kurir',
});

assert.ok(finalInvRes.invoice_id, 'Final Invoice ID must be generated');
console.log(`✓ Final Invoice Created: ${finalInvRes.invoice_number} (Amount: Rp 3.050.000)`);

console.log('   Issuing Final Invoice...');
await rpc('issue_invoice', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_invoice_id: finalInvRes.invoice_id,
});

console.log('   Recording Full Settlement Payment (Rp 3.050.000)...');
const pay2Res = await rpc('record_payment_and_allocate', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_brand_id: brand.id,
  p_payment_method: 'BANK_TRANSFER',
  p_amount: '3050000',
  p_reference_number: `TRF-BCA-LUNAS-${runSuffix}`,
  p_payer_name: leadContact,
  p_allocations: [
    {
      invoice_id: finalInvRes.invoice_id,
      amount: '3050000',
    },
  ],
});

assert.ok(pay2Res.payment_id, 'Settlement Payment ID must be returned');
const [finalInvoice] = await queryTable('invoices', `id=eq.${finalInvRes.invoice_id}`);
assert.equal(finalInvoice.status, 'PAID', 'Final Invoice must be PAID');
assert.equal(finalInvoice.balance_due, 0, 'Final Invoice balance due must be 0 (LUNAS)');
console.log(`✓ Final Settlement Paid: ${pay2Res.payment_number} -> Invoice ${finalInvoice.invoice_number} is PAID`);

// ----------------------------------------------------------------------------
// 11. Settle Actual Production Cost & Complete Production Job
// ----------------------------------------------------------------------------
console.log('\n--- Phase 11: Production Cost Settlement & Completion ---');
console.log('   Settling Actual Production Cost (Rp 1.150.000)...');
const actualCostRes = await rpc('record_actual_job_cost', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_job_id: jobRes.job_id,
  p_actual_cost: '1150000',
  p_notes: 'Faktur vendor diverifikasi: hemat Rp 50.000 dari komitmen Rp 1.200.000',
});
assert.equal(String(actualCostRes.actual_cost), '1150000');

console.log('   Advancing Job to COMPLETED...');
await rpc('transition_production_job_status', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_job_id: jobRes.job_id,
  p_to_status: 'COMPLETED',
});

const [completedJob] = await queryTable('production_jobs', `id=eq.${jobRes.job_id}`);
assert.equal(completedJob.status, 'COMPLETED', 'Job must be COMPLETED');
assert.equal(completedJob.actual_cost, 1150000, 'Actual cost must be settled to Rp 1.150.000');
console.log(`✓ Job Completed: Status = ${completedJob.status}, Actual Cost = Rp 1.150.000`);

// ----------------------------------------------------------------------------
// 12. Authoritative Order Completion (AC-06)
// ----------------------------------------------------------------------------
console.log('\n--- Phase 12: Authoritative Order Completion (AC-06) ---');
console.log('   Transitioning Order to COMPLETED...');
const completeTransition = await rpc('transition_order_status', {
  p_organization_id: org.id,
  p_actor_id: founder.id,
  p_order_id: orderRes.order_id,
  p_target_status: 'COMPLETED',
  p_reason: 'Seluruh barang terkirim dan seluruh tagihan telah lunas',
});

assert.equal(completeTransition.new_status, 'COMPLETED', 'Order status must transition to COMPLETED');
const [finalOrder] = await queryTable('orders', `id=eq.${orderRes.order_id}`);
assert.equal(finalOrder.status, 'COMPLETED', 'Order record status must be COMPLETED');
console.log(`✓ Order Successfully COMPLETED: ${finalOrder.order_number} (Status: ${finalOrder.status})`);

// ----------------------------------------------------------------------------
// 13. Financial Ledger & Realized Margin Verification (AC-07)
// ----------------------------------------------------------------------------
console.log('\n--- Phase 13: Financial Ledger & Realized Margin Verification (AC-07) ---');
const summaries = await queryTable('order_financial_summaries', `order_id=eq.${orderRes.order_id}`);
assert.equal(summaries.length, 1, 'Financial summary for order must exist');
const summary = summaries[0];

console.log('   Order Financial Summary:');
console.log(`   - Net Product Revenue:   Rp ${Number(summary.net_product_revenue).toLocaleString('id-ID')}`);
console.log(`   - Courier Shipping Fee:  Rp ${Number(summary.courier_shipping_fee).toLocaleString('id-ID')}`);
console.log(`   - Order Grand Total:     Rp ${Number(summary.grand_total).toLocaleString('id-ID')}`);
console.log(`   - Estimated Cost (BOM):  Rp ${Number(summary.estimated_cost).toLocaleString('id-ID')}`);
console.log(`   - Committed Cost (SPK):  Rp ${Number(summary.committed_cost).toLocaleString('id-ID')}`);
console.log(`   - Actual Cost (Settled): Rp ${Number(summary.actual_cost).toLocaleString('id-ID')}`);
console.log(`   - Realized Gross Profit: Rp ${Number(summary.realized_gross_profit).toLocaleString('id-ID')}`);
console.log(`   - Realized Margin %:     ${summary.realized_margin_pct}%`);
console.log(`   - Shipping Margin:       Rp ${Number(summary.courier_shipping_margin).toLocaleString('id-ID')}`);
console.log(`   - Margin Health Tier:    ${summary.margin_health}`);

// Assertions on financial invariants
assert.equal(Number(summary.net_product_revenue), 6000000, 'Product revenue must be Rp 6.000.000');
assert.equal(Number(summary.courier_shipping_fee), 50000, 'Courier fee must be Rp 50.000');
assert.equal(Number(summary.grand_total), 6050000, 'Grand total must be Rp 6.050.000');
assert.equal(Number(summary.actual_cost), 1150000, 'Actual cost must be settled at Rp 1.150.000');
assert.equal(Number(summary.realized_gross_profit), 4850000, 'Realized gross profit must be Rp 4.850.000');
assert.ok(Number(summary.realized_margin_pct) >= 80, 'Realized margin % must be >= 80%');
assert.equal(Number(summary.courier_shipping_margin), 0, 'Shipping margin must be strictly Rp 0 pass-through');
assert.equal(summary.margin_health, 'HEALTHY', 'Margin health must be HEALTHY');

// Verify financial ledger entries
const ledgerEntries = await queryTable('financial_ledger_entries', `order_id=eq.${orderRes.order_id}`);
assert.ok(ledgerEntries.length >= 6, 'Must have at least 6 financial ledger entries');
console.log(`✓ Financial Ledger Entries Verified: ${ledgerEntries.length} immutable entries recorded`);

console.log(`\n================================================================`);
console.log(`🎉 ALL HAPPY-PATH E2E VERIFICATIONS PASSED SUCCESSFULLY! (P0-07)`);
console.log(`================================================================`);
console.log(`Summary of Journey Artifacts:`);
console.log(`- Lead:             ${createdLead.lead_number} -> ${qualifiedLead.status} -> ${convertedLead.status}`);
console.log(`- Customer Account: ${customerAcc.display_name} (${customerAccountId})`);
console.log(`- Requirement:      ${readyReq.requirement_number} (READY, 50 pcs DTF Combed 24s)`);
console.log(`- Quote Contract:   Version ${quoteRes.version_id} (ACCEPTED, Rp 6.050.000)`);
console.log(`- Order Contract:   ${finalOrder.order_number} (COMPLETED)`);
console.log(`- DP Invoice:       ${dpInvoice.invoice_number} (PAID, Rp 3.000.000)`);
console.log(`- Final Invoice:    ${finalInvoice.invoice_number} (PAID, Rp 3.050.000)`);
console.log(`- Production Job:   ${completedJob.job_number} (COMPLETED, Actual Cost Rp 1.150.000)`);
console.log(`- Vendor Mitra:     ${vendorName} (${vendorId})`);
console.log(`- QC Inspection:    ${qcRes.inspection_number} (${qcRes.result})`);
console.log(`- Delivery Order:   ${doRes.shipment_number} (DELIVERED, Resi: ${resiNumber})`);
console.log(`- Realized Profit:  Rp 4.850.000 (${summary.realized_margin_pct}% - HEALTHY)`);
console.log(`================================================================\n`);
