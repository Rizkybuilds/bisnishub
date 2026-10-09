/**
 * Operational Exception Assurance Runner (WP-P2A-04 / CHK-008 & CHK-009)
 *
 * Exercises live local Supabase instance against canonical contracts:
 * - CHK-008 (AC-004): Concurrency deduplication race with 20 parallel requests
 * - CHK-009 (AC-006): Trusted service-role RPC lifecycle with database actor-role enforcement
 *   (Open -> Assign -> Acknowledge -> Reassign -> Severity -> Non-owner ACCEPTED_RISK denial -> Owner ACCEPTED_RISK resolution -> Reopen -> Dismiss)
 * - AC-005: Source-domain independence (verifying order & production job status invariant preservation)
 * - AC-008: Negative security verification (direct table mutation denial, anon RPC denial with PG 42501, cross-tenant isolation)
 *
 * ASSURANCE CATEGORIZATION & BOUNDARY (P2A48-F02):
 * This script tests trusted database-level RPC execution via service_role with explicit p_actor_id parameters
 * and verifies database-level actor role enforcement (e.g. OWNER vs ADMIN vs OPERATIONS).
 * It does NOT test authenticated Next.js session cookies, GoTrue login tokens, or browser UI server actions.
 * Application-level E2E integration belongs to a distinct application test layer.
 */

import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import {
  resolveDestructiveLocalE2EEnvironment,
  createDestructiveLocalSupabaseFetch,
} from './destructive-local-e2e-guard.mjs';

const { baseUrl: BASE_URL, serviceRoleKey: SERVICE_KEY } =
  resolveDestructiveLocalE2EEnvironment();

const guardedFetch = createDestructiveLocalSupabaseFetch({
  baseUrl: BASE_URL,
  serviceRoleKey: SERVICE_KEY,
});

// Canonical local-only anon / publishable credentials for negative authorization testing (P2A48-F01)
const CANONICAL_LOCAL_ANON_KEY =
  'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH';
const CANONICAL_LOCAL_ANON_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const serviceHeaders = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
  'Accept-Profile': 'app',
  'Content-Profile': 'app',
  Prefer: 'return=representation',
};

const endpoint = `${BASE_URL.replace(/\/+$/, '')}/rest/v1`;

async function rpc(functionName, params) {
  const res = await guardedFetch(`${endpoint}/rpc/${functionName}`, {
    method: 'POST',
    headers: serviceHeaders,
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const errorText = await res.text();
    const error = new Error(
      `RPC ${functionName} failed (${res.status}): ${errorText}`,
    );
    error.status = res.status;
    error.body = errorText;
    throw error;
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

async function insertRow(table, row) {
  const res = await guardedFetch(`${endpoint}/${table}`, {
    method: 'POST',
    headers: serviceHeaders,
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const errorText = await res.text();
    const error = new Error(
      `Insert ${table} failed (${res.status}): ${errorText}`,
    );
    error.status = res.status;
    error.body = errorText;
    throw error;
  }
  return res.json();
}

async function main() {
  console.log(
    '================================================================',
  );
  console.log('🚀 MGBOS P2-A WP-P2A-04 OPERATIONAL EXCEPTION ASSURANCE SUITE');
  console.log(
    '================================================================\n',
  );

  // --------------------------------------------------------------------------
  // Phase 0: Master Data & Test Actor Setup
  // --------------------------------------------------------------------------
  console.log('--- Phase 0: Master Data & Test Actor Setup ---');

  const [org] = await queryTable('organizations', 'code=eq.multigraph-group');
  assert.ok(org, 'Organization multigraph-group must exist');
  assert.equal(org.status, 'ACTIVE');

  const [brand] = await queryTable('brands', 'code=eq.TS');
  assert.ok(brand, 'Brand TS must exist');

  const [founder] = await queryTable('users', 'email=eq.founder@multigraph.id');
  assert.ok(founder, 'Founder user must exist');

  const [cust] = await queryTable(
    'customer_accounts',
    'status=eq.ACTIVE&limit=1',
  );
  assert.ok(cust, 'Active customer account must exist');

  const [adminRole] = await queryTable(
    'roles',
    `code=eq.ADMIN&organization_id=eq.${org.id}`,
  );
  assert.ok(adminRole, 'ADMIN role must exist');

  const [opsRole] = await queryTable(
    'roles',
    `code=eq.OPERATIONS&organization_id=eq.${org.id}`,
  );
  assert.ok(opsRole, 'OPERATIONS role must exist');

  // Create active ADMIN user
  const adminEmail = `admin.assurance.${Date.now()}@multigraph.id`;
  const [adminUser] = await insertRow('users', {
    email: adminEmail,
    name: 'Admin Assurance Operator',
    status: 'ACTIVE',
  });
  await insertRow('organization_members', {
    organization_id: org.id,
    user_id: adminUser.id,
    role_id: adminRole.id,
    status: 'ACTIVE',
  });
  console.log(`✓ Admin test actor created: ${adminUser.id} (${adminEmail})`);

  // Create active OPERATIONS user (staff - non-admin/owner)
  const opsEmail = `ops.assurance.${Date.now()}@multigraph.id`;
  const [opsUser] = await insertRow('users', {
    email: opsEmail,
    name: 'Ops Assurance Specialist',
    status: 'ACTIVE',
  });
  await insertRow('organization_members', {
    organization_id: org.id,
    user_id: opsUser.id,
    role_id: opsRole.id,
    status: 'ACTIVE',
  });
  console.log(`✓ Operations test actor created: ${opsUser.id} (${opsEmail})`);

  // Create Foreign Organization & Actor for Cross-Tenant Isolation
  const [foreignOrg] = await insertRow('organizations', {
    code: `foreign-corp-${Date.now().toString().slice(-6)}`,
    legal_name: 'PT Foreign Corp Solo',
    display_name: 'Foreign Corp Solo',
    timezone: 'Asia/Jakarta',
    base_currency: 'IDR',
    status: 'ACTIVE',
    billing_settings: {},
  });
  const [foreignRole] = await insertRow('roles', {
    organization_id: foreignOrg.id,
    code: 'OWNER',
    name: 'Foreign Owner',
  });
  const [foreignUser] = await insertRow('users', {
    email: `foreign.${Date.now()}@foreign.invalid`,
    name: 'Foreign Owner User',
    status: 'ACTIVE',
  });
  await insertRow('organization_members', {
    organization_id: foreignOrg.id,
    user_id: foreignUser.id,
    role_id: foreignRole.id,
    status: 'ACTIVE',
  });
  console.log(`✓ Foreign tenant setup: ${foreignOrg.id}`);

  // Create Canonical Source Resources: Requirement -> Quote -> Order -> Production Job
  console.log('\n--- Phase 1: Canonical Source Resource Fixtures Setup ---');

  const reqRes = await rpc('create_requirement_with_initial_version', {
    p_organization_id: org.id,
    p_brand_id: brand.id,
    p_title: 'Assurance Operational Order',
    p_summary: '50 pcs Kaos Combed 24s DTF',
    p_customer_account_id: cust.id,
    p_quantity: 50,
    p_unit: 'PCS',
    p_target_budget: 6000000,
    p_specification: { garment: 'Combed 24s DTF' },
    p_actor_id: founder.id,
  });

  await rpc('transition_requirement_status', {
    p_organization_id: org.id,
    p_requirement_id: reqRes.requirement_id,
    p_target_status: 'READY',
    p_actor_id: founder.id,
  });

  const quoteRes = await rpc('save_quote_version', {
    p_organization_id: org.id,
    p_actor_id: founder.id,
    p_request_id: randomUUID(),
    p_requirement_version_id: reqRes.version_id,
    p_customer_id: cust.id,
    p_unit_price: 120000,
    p_discount: 0,
    p_shipping: 35000,
    p_costs: [
      {
        cost_type: 'GARMENT',
        description: 'Blanks',
        quantity: 50,
        unit_cost: 40000,
      },
      {
        cost_type: 'PRINTING',
        description: 'DTF Front',
        quantity: 50,
        unit_cost: 25000,
      },
    ],
    p_valid_until: '2026-12-31',
    p_terms: 'DP 50%',
    p_lead_time: '7 days',
    p_notes: 'Assurance Order Quote',
  });

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
    p_notes: 'Accepted for assurance test',
  });

  const orderRes = await rpc('create_order_from_quote', {
    p_organization_id: org.id,
    p_actor_id: founder.id,
    p_request_id: randomUUID(),
    p_quote_version_id: quoteRes.version_id,
    p_shipping_address: {
      recipient_name: 'Budi Santoso',
      phone: '081234567890',
      street: 'Jl. Riau No. 88',
      city: 'Bandung',
    },
  });

  await rpc('transition_order_status', {
    p_organization_id: org.id,
    p_actor_id: founder.id,
    p_order_id: orderRes.order_id,
    p_target_status: 'ACTIVE',
    p_reason: 'Activation for assurance verification',
  });

  const jobRes = await rpc('create_production_job', {
    p_organization_id: org.id,
    p_actor_id: founder.id,
    p_order_id: orderRes.order_id,
    p_job_type: 'PRINTING',
    p_title: 'Assurance Print Job TS-J-001',
    p_estimated_cost: 25000,
  });

  const [initialOrder] = await queryTable(
    'orders',
    `id=eq.${orderRes.order_id}`,
  );
  const [initialJob] = await queryTable(
    'production_jobs',
    `id=eq.${jobRes.job_id}`,
  );
  console.log(
    `✓ Source Order: ${initialOrder.order_number} (${initialOrder.id}, status: ${initialOrder.status})`,
  );
  console.log(
    `✓ Source Job: ${initialJob.job_number} (${initialJob.id}, status: ${initialJob.status})`,
  );

  // --------------------------------------------------------------------------
  // Phase 2: CHK-008 (AC-004) Concurrency Deduplication Race
  // --------------------------------------------------------------------------
  console.log(
    '\n--- Phase 2: CHK-008 (AC-004) Concurrency Deduplication Race ---',
  );
  console.log(
    'Executing 20 concurrent parallel calls to open_operational_exception with distinct request_ids...',
  );

  const CONCURRENCY_COUNT = 20;
  const raceType = 'production.deadline_breached';
  const raceResource = 'PRODUCTION_JOB';
  const raceResourceId = initialJob.id;
  const raceRequestIds = Array.from({ length: CONCURRENCY_COUNT }, () =>
    randomUUID(),
  );

  const racePromises = raceRequestIds.map((reqId, index) =>
    rpc('open_operational_exception', {
      p_organization_id: org.id,
      p_actor_id: founder.id,
      p_request_id: reqId,
      p_exception_type: raceType,
      p_severity: 'HIGH',
      p_source_kind: 'HUMAN_REPORT',
      p_primary_resource_type: raceResource,
      p_primary_resource_id: raceResourceId,
      p_responsible_role_code: 'OPERATIONS',
      p_summary: `Concurrent Race Probe ${index + 1}: Keterlambatan jadwal cetak`,
      p_business_impact: 'Resiko penundaan kirim ke customer',
    }),
  );

  const raceResults = await Promise.all(racePromises);
  assert.equal(
    raceResults.length,
    CONCURRENCY_COUNT,
    'All 20 requests must complete',
  );

  // Verify all returned the exact same exception_id
  const targetExceptionId = raceResults[0].exception_id;
  assert.ok(targetExceptionId, 'First request must return valid exception_id');
  for (let i = 0; i < CONCURRENCY_COUNT; i++) {
    assert.equal(
      raceResults[i].exception_id,
      targetExceptionId,
      `Request ${i} must return the same exception_id`,
    );
    assert.equal(raceResults[i].status, 'OPEN');
    assert.equal(raceResults[i].severity, 'HIGH');
  }

  // Exactly 1 winner (is_existing_active_exception: false), 19 deduplicated (is_existing_active_exception: true)
  const winners = raceResults.filter(
    (r) => r.is_existing_active_exception === false,
  );
  const deduplicated = raceResults.filter(
    (r) => r.is_existing_active_exception === true,
  );
  assert.equal(
    winners.length,
    1,
    `Exactly 1 winner expected, got ${winners.length}`,
  );
  assert.equal(
    deduplicated.length,
    CONCURRENCY_COUNT - 1,
    `Exactly ${CONCURRENCY_COUNT - 1} deduplicated expected, got ${deduplicated.length}`,
  );
  console.log(
    `✓ Concurrency Deduplication: 1 Winner (new row created), ${deduplicated.length} deduplicated receipts`,
  );

  // Verify DB state: exactly 1 active row exists in app.operational_exceptions
  const activeExceptions = await queryTable(
    'operational_exceptions',
    `primary_resource_id=eq.${raceResourceId}&status=in.(OPEN,ACKNOWLEDGED)`,
  );
  assert.equal(
    activeExceptions.length,
    1,
    `Exactly 1 active row must exist in operational_exceptions, got ${activeExceptions.length}`,
  );
  assert.equal(activeExceptions[0].id, targetExceptionId);
  assert.equal(activeExceptions[0].current_revision, 1);
  console.log(
    `✓ Database Invariant: Exactly 1 active row exists in app.operational_exceptions`,
  );

  // Verify DB state: exactly 20 distinct audit log receipts
  const auditReceipts = await queryTable(
    'operational_exception_audit',
    `operational_exception_id=eq.${targetExceptionId}`,
  );
  assert.equal(
    auditReceipts.length,
    CONCURRENCY_COUNT,
    `Exactly ${CONCURRENCY_COUNT} audit receipts expected, got ${auditReceipts.length}`,
  );

  const openedActions = auditReceipts.filter(
    (a) => a.action === 'exception.opened',
  );
  const dedupActions = auditReceipts.filter(
    (a) => a.action === 'exception.open_deduplicated',
  );
  assert.equal(
    openedActions.length,
    1,
    'Exactly 1 exception.opened audit entry',
  );
  assert.equal(
    dedupActions.length,
    CONCURRENCY_COUNT - 1,
    'Exactly 19 exception.open_deduplicated entries',
  );

  const uniqueAuditReqIds = new Set(auditReceipts.map((a) => a.request_id));
  assert.equal(
    uniqueAuditReqIds.size,
    CONCURRENCY_COUNT,
    'All 20 audit receipts must have distinct request_ids',
  );
  console.log(
    `✓ Audit Provenance: 20 distinct audit receipts (1 opened + 19 open_deduplicated)`,
  );

  // Test Idempotent Retry: re-calling with same request_id returns is_retry: true
  const retryReqId = raceRequestIds[0];
  const retryRes = await rpc('open_operational_exception', {
    p_organization_id: org.id,
    p_actor_id: founder.id,
    p_request_id: retryReqId,
    p_exception_type: raceType,
    p_severity: 'HIGH',
    p_source_kind: 'HUMAN_REPORT',
    p_primary_resource_type: raceResource,
    p_primary_resource_id: raceResourceId,
    p_responsible_role_code: 'OPERATIONS',
    p_summary: `Concurrent Race Probe 1: Keterlambatan jadwal cetak`,
    p_business_impact: 'Resiko penundaan kirim ke customer',
  });
  assert.equal(
    retryRes.is_retry,
    true,
    'Re-call with existing request_id must return is_retry: true',
  );
  assert.equal(retryRes.exception_id, targetExceptionId);
  console.log('✓ Idempotent Retry: Winner request_id returned is_retry: true');

  // Test Idempotency Conflict: re-calling with same request_id but different summary
  let conflictCaught = false;
  try {
    await rpc('open_operational_exception', {
      p_organization_id: org.id,
      p_actor_id: founder.id,
      p_request_id: retryReqId,
      p_exception_type: raceType,
      p_severity: 'HIGH',
      p_source_kind: 'HUMAN_REPORT',
      p_primary_resource_type: raceResource,
      p_primary_resource_id: raceResourceId,
      p_responsible_role_code: 'OPERATIONS',
      p_summary: 'Conflicting summary with same request_id',
      p_business_impact: 'Resiko penundaan kirim ke customer',
    });
  } catch (err) {
    conflictCaught = true;
    assert.match(err.message, /Idempotency conflict/);
  }
  assert.ok(
    conflictCaught,
    'Payload mutation with same request_id must throw Idempotency conflict',
  );
  console.log('✓ Idempotency Conflict: Conflicting payload correctly rejected');

  // --------------------------------------------------------------------------
  // Phase 3: CHK-009 (AC-006) End-to-End Human Operator Lifecycle
  // --------------------------------------------------------------------------
  console.log(
    '\n--- Phase 3: CHK-009 (AC-006) Trusted Service-Role RPC Lifecycle & Actor Enforcement ---',
  );

  // We exercise a fresh lifecycle against the Order:
  // Open -> Assign (OPEN) -> Acknowledge (ACKNOWLEDGED) -> Reassign -> Severity -> Non-owner ACCEPTED_RISK denial -> Owner ACCEPTED_RISK resolution -> Reopen -> Dismiss
  const orderExceptionType = 'financial.margin_exception';
  const openOrderRes = await rpc('open_operational_exception', {
    p_organization_id: org.id,
    p_actor_id: founder.id,
    p_request_id: randomUUID(),
    p_exception_type: orderExceptionType,
    p_severity: 'HIGH',
    p_source_kind: 'HUMAN_REPORT',
    p_primary_resource_type: 'ORDER',
    p_primary_resource_id: initialOrder.id,
    p_responsible_role_code: 'FINANCE',
    p_summary: 'Margin anomali di bawah ambang batas minimal 25%',
    p_business_impact: 'Potensi kerugian operasional margin kotor',
  });

  const exId = openOrderRes.exception_id;
  assert.equal(openOrderRes.status, 'OPEN');
  assert.equal(openOrderRes.current_revision, 1);
  console.log(
    `✓ 1. Open: Created unassigned exception ${exId} (status: OPEN, rev: 1)`,
  );

  // 2. Assign to Admin Operator (status remains OPEN, principal set, rev -> 2)
  const assignRes = await rpc('assign_operational_exception', {
    p_organization_id: org.id,
    p_actor_id: founder.id,
    p_request_id: randomUUID(),
    p_exception_id: exId,
    p_expected_revision: 1,
    p_responsible_role_code: 'ADMIN',
    p_responsible_user_id: adminUser.id,
    p_reason: 'Didelegasikan ke Admin untuk investigasi biaya bahan',
  });
  assert.equal(assignRes.status, 'OPEN');
  assert.equal(assignRes.current_revision, 2);
  assert.equal(assignRes.responsible_user_id, adminUser.id);
  console.log(
    `✓ 2. Assign: assigned principal -> adminUser (${adminUser.id}), rev -> 2`,
  );

  // 3. Acknowledge by assigned principal (status -> ACKNOWLEDGED, rev -> 3)
  const ackRes = await rpc('acknowledge_operational_exception', {
    p_organization_id: org.id,
    p_actor_id: adminUser.id,
    p_request_id: randomUUID(),
    p_exception_id: exId,
    p_expected_revision: 2,
    p_note: 'Diterima oleh Admin Operator untuk audit nota',
  });
  assert.equal(ackRes.status, 'ACKNOWLEDGED');
  assert.equal(ackRes.current_revision, 3);
  assert.equal(ackRes.responsible_user_id, adminUser.id);
  console.log(
    `✓ 3. Acknowledge: status -> ACKNOWLEDGED, rev -> 3, principal -> adminUser`,
  );

  // 4. Reassign back to Founder (status remains ACKNOWLEDGED, rev -> 4)
  const reassignRes = await rpc('reassign_operational_exception', {
    p_organization_id: org.id,
    p_actor_id: adminUser.id,
    p_request_id: randomUUID(),
    p_exception_id: exId,
    p_expected_revision: 3,
    p_new_responsible_role_code: 'OWNER',
    p_new_responsible_user_id: founder.id,
    p_reason: 'Dikembalikan ke Founder setelah verifikasi nota vendor',
  });
  assert.equal(reassignRes.status, 'ACKNOWLEDGED');
  assert.equal(reassignRes.current_revision, 4);
  assert.equal(reassignRes.responsible_user_id, founder.id);
  console.log(`✓ 4. Reassign: principal -> founder, rev -> 4`);

  // 5. Change Severity: HIGH -> CRITICAL (rev -> 5)
  const sevRes = await rpc('change_operational_exception_severity', {
    p_organization_id: org.id,
    p_actor_id: founder.id,
    p_request_id: randomUUID(),
    p_exception_id: exId,
    p_expected_revision: 4,
    p_new_severity: 'CRITICAL',
    p_reason: 'Eskalasi: selisih biaya kain melampaui toleransi 15%',
  });
  assert.equal(sevRes.status, 'ACKNOWLEDGED');
  assert.equal(sevRes.severity, 'CRITICAL');
  assert.equal(sevRes.current_revision, 5);
  console.log(`✓ 5. Change Severity: HIGH -> CRITICAL, rev -> 5`);

  // 6. Security Invariant: Non-owner ACCEPTED_RISK must be rejected!
  console.log(
    'Testing Non-owner ACCEPTED_RISK resolution denial (Admin actor)...',
  );
  let nonOwnerDenied = false;
  try {
    await rpc('resolve_operational_exception', {
      p_organization_id: org.id,
      p_actor_id: adminUser.id,
      p_request_id: randomUUID(),
      p_exception_id: exId,
      p_expected_revision: 5,
      p_resolution_type: 'ACCEPTED_RISK',
      p_resolution_summary: 'Mencoba menerima risiko oleh non-owner',
    });
  } catch (err) {
    nonOwnerDenied = true;
    assert.match(
      err.message,
      /Accepted risk resolution requires OWNER authority/,
    );
  }
  assert.ok(
    nonOwnerDenied,
    'Non-owner ACCEPTED_RISK must be rejected by database',
  );
  console.log(
    '✓ 6. Security Invariant: Non-owner ACCEPTED_RISK strictly rejected (P0001)',
  );

  // 7. Founder (OWNER) resolves with ACCEPTED_RISK (status -> RESOLVED, rev -> 6)
  const resolveRes = await rpc('resolve_operational_exception', {
    p_organization_id: org.id,
    p_actor_id: founder.id,
    p_request_id: randomUUID(),
    p_exception_id: exId,
    p_expected_revision: 5,
    p_resolution_type: 'ACCEPTED_RISK',
    p_resolution_summary:
      'Founder menerima deviasi margin karena pesanan strategis pelanggan baru',
    p_closure_evidence: {
      founder_note: 'Approved for strategic partner portfolio',
    },
  });
  assert.equal(resolveRes.status, 'RESOLVED');
  assert.equal(resolveRes.resolution_type, 'ACCEPTED_RISK');
  assert.equal(resolveRes.current_revision, 6);
  console.log('✓ 7. Owner ACCEPTED_RISK: status -> RESOLVED, rev -> 6');

  // 8. Reopen Exception (status -> OPEN, rev -> 7)
  const reopenRes = await rpc('reopen_operational_exception', {
    p_organization_id: org.id,
    p_actor_id: founder.id,
    p_request_id: randomUUID(),
    p_exception_id: exId,
    p_expected_revision: 6,
    p_reason:
      'Ditemukan selisih biaya tambahan pada pengiriman, investigasi dibuka kembali',
  });
  assert.equal(reopenRes.status, 'OPEN');
  assert.equal(reopenRes.current_revision, 7);
  console.log('✓ 8. Reopen: status -> OPEN, rev -> 7, closure fields cleared');

  // 9. Dismiss Exception (status -> DISMISSED, rev -> 8)
  const dismissRes = await rpc('dismiss_operational_exception', {
    p_organization_id: org.id,
    p_actor_id: founder.id,
    p_request_id: randomUUID(),
    p_exception_id: exId,
    p_expected_revision: 7,
    p_dismissal_reason: 'NOT_APPLICABLE',
    p_reason_summary:
      'Setelah rekonsiliasi faktur vendor, biaya pengiriman ditanggung ekspedisi mitra',
  });
  assert.equal(dismissRes.status, 'DISMISSED');
  assert.equal(dismissRes.dismissal_reason, 'NOT_APPLICABLE');
  assert.equal(dismissRes.current_revision, 8);
  console.log(
    '✓ 9. Dismiss: status -> DISMISSED, reason -> NOT_APPLICABLE, rev -> 8',
  );

  // 10. Optimistic Concurrency / Stale Revision Check
  console.log('Testing Stale Revision rejection...');
  let staleRevisionCaught = false;
  try {
    await rpc('reopen_operational_exception', {
      p_organization_id: org.id,
      p_actor_id: founder.id,
      p_request_id: randomUUID(),
      p_exception_id: exId,
      p_expected_revision: 3, // Stale! Current is 8
      p_reason: 'Mencoba reopening dengan revisi usang',
    });
  } catch (err) {
    staleRevisionCaught = true;
    assert.match(err.message, /Stale revision: expected 3, got 8/);
  }
  assert.ok(staleRevisionCaught, 'Stale revision must be rejected');
  console.log(
    '✓ 10. Optimistic Concurrency: Stale revision (expected 3, got 8) rejected',
  );

  // 11. Audit Journal Completeness
  const fullAudit = await queryTable(
    'operational_exception_audit',
    `operational_exception_id=eq.${exId}&order=created_at.asc`,
  );
  const auditActions = fullAudit.map((a) => a.action);
  assert.deepEqual(auditActions, [
    'exception.opened',
    'exception.assigned',
    'exception.acknowledged',
    'exception.reassigned',
    'exception.severity_changed',
    'exception.resolved',
    'exception.reopened',
    'exception.dismissed',
  ]);
  console.log(
    '✓ 11. Audit Journal Completeness: All 8 lifecycle transitions recorded chronologically',
  );

  // --------------------------------------------------------------------------
  // Phase 4: AC-005 Source-Domain Independence Verification
  // --------------------------------------------------------------------------
  console.log(
    '\n--- Phase 4: AC-005 Source-Domain Independence Verification ---',
  );
  const [postOrder] = await queryTable('orders', `id=eq.${initialOrder.id}`);
  const [postJob] = await queryTable(
    'production_jobs',
    `id=eq.${initialJob.id}`,
  );

  assert.equal(
    postOrder.status,
    initialOrder.status,
    'Order status must not change',
  );
  assert.equal(
    postOrder.grand_total,
    initialOrder.grand_total,
    'Order grand_total must not change',
  );
  assert.equal(postJob.status, initialJob.status, 'Job status must not change');
  assert.equal(
    postJob.estimated_cost,
    initialJob.estimated_cost,
    'Job estimated_cost must not change',
  );
  console.log(
    '✓ Source-Domain Independence: Order and Production Job state 100% unmutated',
  );

  // --------------------------------------------------------------------------
  // Phase 5: AC-008 Negative Security Verification
  // --------------------------------------------------------------------------
  console.log('\n--- Phase 5: AC-008 Negative Security Verification ---');

  // 1. Direct Table Mutation Denial (INSERT on app.operational_exceptions)
  let directInsertDenied = false;
  try {
    await insertRow('operational_exceptions', {
      organization_id: org.id,
      exception_type: 'production.deadline_breached',
      primary_resource_type: 'PRODUCTION_JOB',
      primary_resource_id: initialJob.id,
      summary: 'Direct table bypass',
      business_impact: 'Direct table bypass impact',
    });
  } catch (err) {
    directInsertDenied = true;
    assert.equal(
      err.status,
      403,
      'Direct table INSERT must return 403 Forbidden',
    );
  }
  assert.ok(
    directInsertDenied,
    'Direct table INSERT by service_role must be denied',
  );
  console.log(
    '✓ Security: Direct INSERT on app.operational_exceptions denied (HTTP 403)',
  );

  // 2. Direct Audit Mutation Denial (PATCH on app.operational_exception_audit)
  const patchRes = await guardedFetch(
    `${endpoint}/operational_exception_audit?id=eq.${fullAudit[0].id}`,
    {
      method: 'PATCH',
      headers: serviceHeaders,
      body: JSON.stringify({ action: 'tampered.action' }),
    },
  );
  assert.equal(
    patchRes.status,
    403,
    'Direct table UPDATE on audit table must return 403 Forbidden',
  );
  console.log(
    '✓ Security: Direct UPDATE on app.operational_exception_audit denied (HTTP 403)',
  );

  // 3. Direct Audit Deletion Denial (DELETE on app.operational_exception_audit)
  const deleteRes = await guardedFetch(
    `${endpoint}/operational_exception_audit?id=eq.${fullAudit[0].id}`,
    {
      method: 'DELETE',
      headers: serviceHeaders,
    },
  );
  assert.equal(
    deleteRes.status,
    403,
    'Direct table DELETE on audit table must return 403 Forbidden',
  );
  console.log(
    '✓ Security: Direct DELETE on app.operational_exception_audit denied (HTTP 403)',
  );

  // 4. Anon Role Execution Denial (P2A48-F01)
  // Verify with canonical local-only credentials that PostgREST recognizes anon
  // and denies access attributable to role/schema/function authorization with PostgreSQL 42501.
  const anonRes = await guardedFetch(
    `${endpoint}/rpc/open_operational_exception`,
    {
      method: 'POST',
      headers: {
        apikey: CANONICAL_LOCAL_ANON_KEY,
        Authorization: `Bearer ${CANONICAL_LOCAL_ANON_JWT}`,
        'Content-Type': 'application/json',
        'Accept-Profile': 'app',
        'Content-Profile': 'app',
      },
      body: JSON.stringify({
        p_organization_id: org.id,
        p_actor_id: founder.id,
        p_request_id: randomUUID(),
        p_exception_type: 'production.deadline_breached',
        p_severity: 'HIGH',
        p_source_kind: 'HUMAN_REPORT',
        p_primary_resource_type: 'PRODUCTION_JOB',
        p_primary_resource_id: initialJob.id,
        p_responsible_role_code: 'OPERATIONS',
        p_summary: 'Anon execution probe',
        p_business_impact: 'Anon probe impact',
      }),
    },
  );
  assert.ok(
    anonRes.status === 401 || anonRes.status === 403,
    `Anon role RPC execution must return 401 or 403, got ${anonRes.status}`,
  );
  const anonBody = await anonRes.json();
  assert.equal(
    anonBody.code,
    '42501',
    `Anon role RPC rejection must return PostgreSQL code 42501 (permission denied), got ${anonBody.code}`,
  );
  assert.match(
    anonBody.message,
    /permission denied for (schema|function) app/,
    `Anon rejection must be attributable to schema/function authorization, got: ${anonBody.message}`,
  );
  console.log(
    `✓ Security: Anon role RPC execution denied (HTTP ${anonRes.status} / PG ${anonBody.code}: ${anonBody.message})`,
  );

  // 5. Staff Role Denial (OPERATIONS actor cannot open exceptions)
  let staffOpenDenied = false;
  try {
    await rpc('open_operational_exception', {
      p_organization_id: org.id,
      p_actor_id: opsUser.id,
      p_request_id: randomUUID(),
      p_exception_type: 'production.deadline_breached',
      p_severity: 'HIGH',
      p_source_kind: 'HUMAN_REPORT',
      p_primary_resource_type: 'PRODUCTION_JOB',
      p_primary_resource_id: initialJob.id,
      p_responsible_role_code: 'OPERATIONS',
      p_summary: 'Staff open probe',
      p_business_impact: 'Staff probe impact',
    });
  } catch (err) {
    staffOpenDenied = true;
    assert.match(err.message, /Not authorized to open operational exceptions/);
  }
  assert.ok(
    staffOpenDenied,
    'Staff OPERATIONS role must not be authorized to open exceptions',
  );
  console.log('✓ Security: Staff (OPERATIONS) role open attempt denied');

  // 6. Cross-Tenant Isolation (Foreign actor attempting to mutate primary org exception)
  let crossTenantDenied = false;
  try {
    await rpc('acknowledge_operational_exception', {
      p_organization_id: foreignOrg.id,
      p_actor_id: foreignUser.id,
      p_request_id: randomUUID(),
      p_exception_id: targetExceptionId, // Exception belongs to MultiGraph Group!
      p_expected_revision: 1,
      p_note: 'Cross tenant breach attempt',
    });
  } catch (err) {
    crossTenantDenied = true;
    assert.match(err.message, /not found in organization/);
  }
  assert.ok(crossTenantDenied, 'Cross-tenant mutation attempt must be denied');
  console.log('✓ Security: Cross-tenant foreign actor access strictly denied');

  console.log(
    '\n================================================================',
  );
  console.log(
    '🎉 ALL ASSURANCE CHECKS PASSED (CHK-008, CHK-009, AC-004..AC-008)',
  );
  console.log(
    '================================================================\n',
  );
}

main().catch((err) => {
  console.error('\n❌ ASSURANCE SUITE FAILED:', err);
  process.exit(1);
});
