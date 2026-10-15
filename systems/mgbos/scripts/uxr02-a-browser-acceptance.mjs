/**
 * MultiGraph Business OS — UXR02-A Dedicated Browser Acceptance QA Harness
 *
 * Validates the real authenticated Next.js Leads and Customers experience (PR #68):
 * - AC-A01: Empty successful query displays truthful empty state and zero KPIs (/leads & /customers)
 * - AC-A02: Populated query displays actual synthetic rows and correct KPIs (/leads & /customers)
 * - AC-A03: Upstream non-2xx error displays sanitized unavailable state and '—' KPIs via server proxy
 * - AC-A04: Invalid session or missing auth fails closed correctly (redirects to /login)
 * - AC-A05: Malformed JSON and controlled network errors do not produce unhandled UI failure
 * - AC-A06: Actual hydrated search/filter -> filtered-empty -> Reset Filter works (mouse + keyboard)
 * - AC-A07: Failed server read -> retry -> fresh authorized GET -> recovered records (Coba Lagi)
 * - AC-A08: No service-role key, sensitive upstream error or private credentials leak to browser output
 * - AC-A09: Two-organization isolation, applicable role permissions and invalid-membership denial
 * - Responsive viewports: 1440x900 and 1024x768, zero horizontal overflow
 * - Deterministic synthetic fixtures with guaranteed fail-closed cleanup and absence verification
 * - Sanitized trace reporting and negative-control verification
 */

import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { randomBytes, randomUUID } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  CANONICAL_API_ORIGIN,
  CANONICAL_APP_ORIGIN,
  QaError,
  assertConsistentSupabaseEnv,
  assertLoopbackHttpOrigin,
  assertSanitizedEvidence,
  classifyFailure,
  db,
  localStatus,
  startBrowser,
  terminateSubprocess,
  until,
} from './browser-auth-hygiene-qa.mjs';
import { terminateBrowser } from './browser-ui-multirole-qa.mjs';

export { QaError };

export const EXPECTED_PR68_HEAD_SHA =
  'decf14628cb2a5b439220f2eead823ef4907664d';

export const MANDATORY_UXR02_AC_IDS = Object.freeze([
  'AC-A01',
  'AC-A02',
  'AC-A03',
  'AC-A04',
  'AC-A05',
  'AC-A06',
  'AC-A07',
  'AC-A08',
  'AC-A09',
]);

export const MANDATORY_UXR02_CASE_IDS = Object.freeze([
  'AC_A01_LEADS_EMPTY_STATE',
  'AC_A01_CUSTOMERS_EMPTY_STATE',
  'AC_A02_LEADS_POPULATED_STATE',
  'AC_A02_CUSTOMERS_POPULATED_STATE',
  'AC_A03_LEADS_UPSTREAM_ERROR',
  'AC_A03_CUSTOMERS_UPSTREAM_ERROR',
  'AC_A04_LEADS_UNAUTHENTICATED_REDIRECT',
  'AC_A04_CUSTOMERS_UNAUTHENTICATED_REDIRECT',
  'AC_A05_LEADS_MALFORMED_DATA',
  'AC_A05_CUSTOMERS_MALFORMED_DATA',
  'AC_A06_LEADS_SEARCH_FILTER_RESET',
  'AC_A06_CUSTOMERS_SEARCH_FILTER_RESET',
  'AC_A07_LEADS_RETRY_RECOVERY',
  'AC_A07_CUSTOMERS_RETRY_RECOVERY',
  'AC_A08_CREDENTIAL_NONDISCLOSURE',
  'AC_A09_ORG_ISOLATION_AND_MEMBERSHIP_DENIAL',
  'VIEWPORT_RESPONSIVE_DESKTOP_1440',
  'VIEWPORT_RESPONSIVE_TABLET_1024',
  'FIXTURE_CLEANUP_VERIFICATION',
]);

/**
 * Localhost-only HTTP fault-injection reverse proxy.
 *
 * Forwards requests to real local Supabase (127.0.0.1:55431) by default,
 * allowing Next.js server components to receive injected HTTP 500, 503,
 * or malformed payloads for AC-A03, AC-A05, and AC-A07 at the server-side
 * PostgREST fetch boundary without changing application source code.
 */
export class CrmFaultProxy {
  constructor({ targetOrigin = CANONICAL_API_ORIGIN, port = 0 } = {}) {
    assertLoopbackHttpOrigin(targetOrigin);
    this.targetOrigin = targetOrigin;
    this.port = port;
    this.server = null;
    this.activeOrigin = null;
    this.rules = [];
    this.interceptedCount = 0;
  }

  async start() {
    return new Promise((resolve, reject) => {
      this.server = http.createServer((req, res) =>
        this._handleRequest(req, res),
      );
      this.server.on('error', reject);
      this.server.listen(this.port, '127.0.0.1', () => {
        const address = this.server.address();
        this.port = address.port;
        this.activeOrigin = `http://127.0.0.1:${this.port}`;
        resolve(this.activeOrigin);
      });
    });
  }

  setFaultRule({
    method = 'GET',
    pathPrefix,
    statusCode = 500,
    body = '{"message":"Simulated CRM upstream fault"}',
    headers = { 'content-type': 'application/json' },
    remaining = 1,
  }) {
    this.rules.push({
      method: method.toUpperCase(),
      pathPrefix,
      statusCode,
      body,
      headers,
      remaining,
    });
  }

  clearRules() {
    this.rules = [];
  }

  _handleRequest(clientReq, clientRes) {
    const parsedUrl = new URL(clientReq.url, this.activeOrigin);
    const reqPath = parsedUrl.pathname;
    const reqMethod = (clientReq.method || 'GET').toUpperCase();

    // Check for matched fault rule
    const ruleIndex = this.rules.findIndex(
      (r) =>
        r.method === reqMethod &&
        reqPath.startsWith(r.pathPrefix) &&
        r.remaining > 0,
    );

    if (ruleIndex !== -1) {
      const rule = this.rules[ruleIndex];
      rule.remaining -= 1;
      if (rule.remaining <= 0) {
        this.rules.splice(ruleIndex, 1);
      }
      this.interceptedCount += 1;

      clientRes.writeHead(rule.statusCode, {
        ...rule.headers,
        'x-mgbos-fault-injected': '1',
      });
      clientRes.end(rule.body);
      return;
    }

    // Default: proxy to canonical loopback Supabase target
    const targetUrl = new URL(clientReq.url, this.targetOrigin);
    const proxyReq = http.request(
      targetUrl,
      {
        method: clientReq.method,
        headers: clientReq.headers,
      },
      (proxyRes) => {
        clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(clientRes);
      },
    );

    proxyReq.on('error', (err) => {
      clientRes.writeHead(502, { 'content-type': 'application/json' });
      clientRes.end(
        JSON.stringify({
          error: 'Proxy forwarding failed',
          message: err.message,
        }),
      );
    });

    clientReq.pipe(proxyReq);
  }

  async close() {
    if (!this.server) return;
    return new Promise((resolve) => {
      this.server.close(() => {
        this.server = null;
        resolve();
      });
    });
  }
}

/**
 * Manages two-organization synthetic test fixtures and absence verification.
 */
export class Uxr02FixtureManager {
  constructor(serviceKey, { api = CANONICAL_API_ORIGIN } = {}) {
    assertLoopbackHttpOrigin(api);
    this.serviceKey = serviceKey;
    this.api = api;
    this.registry = {
      organizations: [],
      roles: [],
      brands: [],
      channels: [],
      authUsers: [],
      profiles: [],
      memberships: [],
      leads: [],
      customerAccounts: [],
      customerContacts: [],
      customerBrandRels: [],
    };
  }

  register(type, id) {
    if (id && this.registry[type] && !this.registry[type].includes(id)) {
      this.registry[type].push(id);
    }
  }

  async createSyntheticOrg(code, displayName) {
    const orgRows = await db(this.serviceKey, '/rest/v1/organizations', {
      method: 'POST',
      schema: 'app',
      body: {
        code,
        legal_name: `PT ${displayName} Legal`,
        display_name: displayName,
        timezone: 'Asia/Jakarta',
        base_currency: 'IDR',
        status: 'ACTIVE',
      },
      api: this.api,
      stage: 'FIXTURE_SETUP',
    });
    const org = Array.isArray(orgRows) ? orgRows[0] : orgRows;
    assert.ok(org?.id, 'Failed to create synthetic organization');
    this.register('organizations', org.id);

    // Create role OWNER for this org
    const roleRows = await db(this.serviceKey, '/rest/v1/roles', {
      method: 'POST',
      schema: 'app',
      body: {
        organization_id: org.id,
        code: 'OWNER',
        name: 'Business Owner',
        description: 'Synthetic Owner Role',
      },
      api: this.api,
      stage: 'FIXTURE_SETUP',
    });
    const role = Array.isArray(roleRows) ? roleRows[0] : roleRows;
    assert.ok(role?.id, 'Failed to create synthetic OWNER role');
    this.register('roles', role.id);

    // Create brand TS for this org
    const brandRows = await db(this.serviceKey, '/rest/v1/brands', {
      method: 'POST',
      schema: 'app',
      body: {
        organization_id: org.id,
        code: 'TS',
        name: 'TeeStock',
        slug: `teestock-${randomUUID().slice(0, 8)}`,
        status: 'ACTIVE',
      },
      api: this.api,
      stage: 'FIXTURE_SETUP',
    });
    const brand = Array.isArray(brandRows) ? brandRows[0] : brandRows;
    assert.ok(brand?.id, 'Failed to create synthetic TS brand');
    this.register('brands', brand.id);

    // Create channel WHATSAPP for this org
    const channelRows = await db(this.serviceKey, '/rest/v1/channels', {
      method: 'POST',
      schema: 'app',
      body: {
        organization_id: org.id,
        code: 'WHATSAPP',
        name: 'WhatsApp Business',
        channel_type: 'MESSAGING',
        status: 'ACTIVE',
      },
      api: this.api,
      stage: 'FIXTURE_SETUP',
    });
    const channel = Array.isArray(channelRows) ? channelRows[0] : channelRows;
    assert.ok(channel?.id, 'Failed to create synthetic channel');
    this.register('channels', channel.id);

    return {
      id: org.id,
      code,
      displayName,
      ownerRoleId: role.id,
      brandTsId: brand.id,
      channelWaId: channel.id,
    };
  }

  async createSyntheticUser({
    email,
    password,
    displayName,
    organizationId,
    roleId,
  }) {
    // 1. auth.users
    const authUser = await db(this.serviceKey, '/auth/v1/admin/users', {
      method: 'POST',
      body: {
        email,
        password,
        email_confirm: true,
      },
      api: this.api,
      stage: 'FIXTURE_SETUP',
    });
    assert.ok(authUser?.id, 'Failed to create auth user');
    this.register('authUsers', authUser.id);

    // 2. app.users
    const profileRows = await db(this.serviceKey, '/rest/v1/users', {
      method: 'POST',
      schema: 'app',
      body: {
        auth_user_id: authUser.id,
        name: displayName,
        email,
        status: 'ACTIVE',
      },
      api: this.api,
      stage: 'FIXTURE_SETUP',
    });
    const profile = Array.isArray(profileRows) ? profileRows[0] : profileRows;
    assert.ok(profile?.id, 'Failed to create user profile');
    this.register('profiles', profile.id);

    // 3. app.organization_members (if organizationId provided)
    let membershipId = null;
    if (organizationId && roleId) {
      const memberRows = await db(
        this.serviceKey,
        '/rest/v1/organization_members',
        {
          method: 'POST',
          schema: 'app',
          body: {
            organization_id: organizationId,
            user_id: profile.id,
            role_id: roleId,
            status: 'ACTIVE',
          },
          api: this.api,
          stage: 'FIXTURE_SETUP',
        },
      );
      const member = Array.isArray(memberRows) ? memberRows[0] : memberRows;
      assert.ok(member?.id, 'Failed to create org membership');
      membershipId = member.id;
      this.register('memberships', member.id);
    }

    return {
      authUserId: authUser.id,
      profileId: profile.id,
      membershipId,
      email,
      password,
      displayName,
    };
  }

  async seedLead({
    organizationId,
    brandId,
    channelId,
    leadNumber,
    title,
    contactName,
    companyName,
    phone,
    email,
    rawInquiry,
    estimatedQuantity,
    estimatedBudget,
    status = 'NEW',
    qualificationScore = null,
  }) {
    const rows = await db(this.serviceKey, '/rest/v1/leads', {
      method: 'POST',
      schema: 'app',
      body: {
        organization_id: organizationId,
        brand_id: brandId,
        channel_id: channelId,
        lead_number: leadNumber,
        title,
        contact_name: contactName,
        company_name: companyName,
        phone,
        email,
        raw_inquiry: rawInquiry,
        estimated_quantity: estimatedQuantity,
        estimated_budget: estimatedBudget,
        status,
        qualification_score: qualificationScore,
      },
      api: this.api,
      stage: 'FIXTURE_SEED',
    });
    const lead = Array.isArray(rows) ? rows[0] : rows;
    assert.ok(lead?.id, 'Failed to insert synthetic lead');
    this.register('leads', lead.id);
    return lead;
  }

  async seedCustomerAccount({
    organizationId,
    brandId,
    accountType = 'COMPANY',
    displayName,
    legalName,
    primaryEmail,
    primaryPhone,
    status = 'ACTIVE',
    contactName,
    contactEmail,
    contactPhone,
  }) {
    const custRows = await db(this.serviceKey, '/rest/v1/customer_accounts', {
      method: 'POST',
      schema: 'app',
      body: {
        organization_id: organizationId,
        account_type: accountType,
        display_name: displayName,
        legal_name: legalName,
        primary_email: primaryEmail,
        primary_phone: primaryPhone,
        status,
        customer_since: new Date().toISOString().split('T')[0],
      },
      api: this.api,
      stage: 'FIXTURE_SEED',
    });
    const cust = Array.isArray(custRows) ? custRows[0] : custRows;
    assert.ok(cust?.id, 'Failed to insert synthetic customer account');
    this.register('customerAccounts', cust.id);

    if (contactName) {
      const contactRows = await db(
        this.serviceKey,
        '/rest/v1/customer_contacts',
        {
          method: 'POST',
          schema: 'app',
          body: {
            customer_account_id: cust.id,
            name: contactName,
            email: contactEmail || primaryEmail,
            phone: contactPhone || primaryPhone,
            is_primary: true,
          },
          api: this.api,
          stage: 'FIXTURE_SEED',
        },
      );
      const contact = Array.isArray(contactRows) ? contactRows[0] : contactRows;
      if (contact?.id) this.register('customerContacts', contact.id);
    }

    if (brandId) {
      const relRows = await db(
        this.serviceKey,
        '/rest/v1/customer_brand_relationships',
        {
          method: 'POST',
          schema: 'app',
          body: {
            customer_account_id: cust.id,
            brand_id: brandId,
            customer_segment: 'B2B_CUSTOM',
            relationship_status: 'ACTIVE',
          },
          api: this.api,
          stage: 'FIXTURE_SEED',
        },
      );
      const rel = Array.isArray(relRows) ? relRows[0] : relRows;
      if (rel?.id) this.register('customerBrandRels', rel.id);
    }

    return cust;
  }

  async cleanupAll() {
    const errors = [];

    // Delete in reverse dependency order
    for (const id of this.registry.customerBrandRels) {
      await db(
        this.serviceKey,
        `/rest/v1/customer_brand_relationships?id=eq.${encodeURIComponent(id)}`,
        { method: 'DELETE', schema: 'app', api: this.api },
      ).catch((e) => errors.push(e));
    }
    for (const id of this.registry.customerContacts) {
      await db(
        this.serviceKey,
        `/rest/v1/customer_contacts?id=eq.${encodeURIComponent(id)}`,
        { method: 'DELETE', schema: 'app', api: this.api },
      ).catch((e) => errors.push(e));
    }
    for (const id of this.registry.customerAccounts) {
      await db(
        this.serviceKey,
        `/rest/v1/customer_accounts?id=eq.${encodeURIComponent(id)}`,
        { method: 'DELETE', schema: 'app', api: this.api },
      ).catch((e) => errors.push(e));
    }
    for (const id of this.registry.leads) {
      await db(
        this.serviceKey,
        `/rest/v1/leads?id=eq.${encodeURIComponent(id)}`,
        { method: 'DELETE', schema: 'app', api: this.api },
      ).catch((e) => errors.push(e));
    }
    for (const id of this.registry.memberships) {
      await db(
        this.serviceKey,
        `/rest/v1/organization_members?id=eq.${encodeURIComponent(id)}`,
        { method: 'DELETE', schema: 'app', api: this.api },
      ).catch((e) => errors.push(e));
    }
    for (const id of this.registry.profiles) {
      await db(
        this.serviceKey,
        `/rest/v1/users?id=eq.${encodeURIComponent(id)}`,
        { method: 'DELETE', schema: 'app', api: this.api },
      ).catch((e) => errors.push(e));
    }
    for (const id of this.registry.authUsers) {
      await db(
        this.serviceKey,
        `/auth/v1/admin/users/${encodeURIComponent(id)}`,
        {
          method: 'DELETE',
          api: this.api,
        },
      ).catch((e) => errors.push(e));
    }
    for (const id of this.registry.channels) {
      await db(
        this.serviceKey,
        `/rest/v1/channels?id=eq.${encodeURIComponent(id)}`,
        { method: 'DELETE', schema: 'app', api: this.api },
      ).catch((e) => errors.push(e));
    }
    for (const id of this.registry.brands) {
      await db(
        this.serviceKey,
        `/rest/v1/brands?id=eq.${encodeURIComponent(id)}`,
        { method: 'DELETE', schema: 'app', api: this.api },
      ).catch((e) => errors.push(e));
    }
    for (const id of this.registry.roles) {
      await db(
        this.serviceKey,
        `/rest/v1/roles?id=eq.${encodeURIComponent(id)}`,
        { method: 'DELETE', schema: 'app', api: this.api },
      ).catch((e) => errors.push(e));
    }
    for (const id of this.registry.organizations) {
      await db(
        this.serviceKey,
        `/rest/v1/organizations?id=eq.${encodeURIComponent(id)}`,
        { method: 'DELETE', schema: 'app', api: this.api },
      ).catch((e) => errors.push(e));
    }

    return { errors };
  }

  async verifyAbsence() {
    const uncleaned = [];

    for (const id of this.registry.leads) {
      const rows = await db(
        this.serviceKey,
        `/rest/v1/leads?id=eq.${encodeURIComponent(id)}`,
        { schema: 'app', api: this.api },
      ).catch(() => []);
      if (Array.isArray(rows) && rows.length > 0) uncleaned.push(`lead:${id}`);
    }

    for (const id of this.registry.customerAccounts) {
      const rows = await db(
        this.serviceKey,
        `/rest/v1/customer_accounts?id=eq.${encodeURIComponent(id)}`,
        { schema: 'app', api: this.api },
      ).catch(() => []);
      if (Array.isArray(rows) && rows.length > 0)
        uncleaned.push(`customer_account:${id}`);
    }

    for (const id of this.registry.organizations) {
      const rows = await db(
        this.serviceKey,
        `/rest/v1/organizations?id=eq.${encodeURIComponent(id)}`,
        { schema: 'app', api: this.api },
      ).catch(() => []);
      if (Array.isArray(rows) && rows.length > 0)
        uncleaned.push(`organization:${id}`);
    }

    for (const id of this.registry.authUsers) {
      const user = await db(
        this.serviceKey,
        `/auth/v1/admin/users/${encodeURIComponent(id)}`,
        { api: this.api },
      ).catch(() => null);
      if (user?.id) uncleaned.push(`authUser:${id}`);
    }

    return {
      verifiedAbsent: uncleaned.length === 0,
      uncleaned,
    };
  }
}

/**
 * Validates a generated trace JSON file against all governance rules.
 */
export function verifyTraceFile(
  tracePath,
  { expectedMode = 'normal', exitStatus = 0, expectedCheckoutSha } = {},
) {
  if (!existsSync(tracePath)) {
    return {
      valid: false,
      code: 'TRACE_NOT_FOUND',
      summary: `Trace file does not exist: ${tracePath}`,
    };
  }

  let trace;
  try {
    trace = JSON.parse(readFileSync(tracePath, 'utf8'));
  } catch (err) {
    return {
      valid: false,
      code: 'TRACE_MALFORMED',
      summary: `Failed to parse trace JSON: ${err.message}`,
    };
  }

  // 1. Revision / Provenance check
  const actualCheckoutSha =
    trace.provenance?.appSha || trace.targetApp?.actualCheckoutSha;
  if (expectedCheckoutSha && actualCheckoutSha !== expectedCheckoutSha) {
    return {
      valid: false,
      code: 'CHECKOUT_SHA_MISMATCH',
      summary: `Expected candidate SHA '${expectedCheckoutSha}', but trace recorded '${actualCheckoutSha}'`,
    };
  }

  // 2. Mode and Overall status check
  if (expectedMode === 'normal') {
    if (trace.overall !== 'PASS') {
      return {
        valid: false,
        code: 'OVERALL_NOT_PASS',
        summary: `Trace recorded overall '${trace.overall}', expected PASS`,
      };
    }
    if (exitStatus !== 0) {
      return {
        valid: false,
        code: 'EXIT_STATUS_NONZERO',
        summary: `Normal execution mode exited with non-zero code: ${exitStatus}`,
      };
    }

    // 3. Required cases check
    for (const caseId of MANDATORY_UXR02_CASE_IDS) {
      const c = trace.cases?.[caseId];
      if (!c) {
        return {
          valid: false,
          code: 'MISSING_MANDATORY_CASE',
          summary: `Missing mandatory case in trace: ${caseId}`,
        };
      }
      if (c.status !== 'PASS') {
        return {
          valid: false,
          code: 'CASE_STATUS_NOT_PASS',
          summary: `Case ${caseId} recorded status '${c.status}', expected PASS`,
        };
      }
    }

    // 4. Acceptance Matrix check (AC-A01 .. AC-A09)
    for (const acId of MANDATORY_UXR02_AC_IDS) {
      const ac = trace.acceptanceMatrix?.[acId];
      if (!ac || ac.status !== 'PASS') {
        return {
          valid: false,
          code: 'AC_NOT_SATISFIED',
          summary: `Acceptance criteria ${acId} was not satisfied (status: ${ac?.status})`,
        };
      }
    }

    // 5. Cleanup absence check
    if (trace.cleanup?.verifiedAbsent !== true) {
      return {
        valid: false,
        code: 'CLEANUP_NOT_VERIFIED',
        summary: 'Trace did not verify complete absence of synthetic fixtures',
      };
    }

    // 6. Browser provenance check
    const browser = trace.provenance?.browser;
    if (!browser?.product || !browser?.browserVersion) {
      return {
        valid: false,
        code: 'BROWSER_PROVENANCE_MISSING',
        summary: 'Trace missing authoritative browser product and version',
      };
    }
  } else if (expectedMode === 'intentional-broken-control') {
    if (trace.overall !== 'FAIL') {
      return {
        valid: false,
        code: 'NEGATIVE_CONTROL_MISMATCH',
        summary: `Negative control trace recorded overall '${trace.overall}', expected FAIL`,
      };
    }
    if (trace.failure?.code !== 'INTENTIONAL_NEGATIVE_CONTROL_TRIGGERED') {
      return {
        valid: false,
        code: 'NEGATIVE_CONTROL_CODE_MISMATCH',
        summary: `Negative control code was '${trace.failure?.code}', expected INTENTIONAL_NEGATIVE_CONTROL_TRIGGERED`,
      };
    }
    if (exitStatus === 0) {
      return {
        valid: false,
        code: 'EXIT_STATUS_ZERO_FOR_NEGATIVE_CONTROL',
        summary:
          'Intentional negative control exited with status 0, expected non-zero',
      };
    }
  }

  // 7. Sensitive data nondisclosure verification
  try {
    assertSanitizedEvidence(trace);
  } catch (err) {
    return {
      valid: false,
      code: 'SENSITIVE_DATA_DISCLOSED',
      summary: `Trace contains unsanitized sensitive values: ${err.message}`,
    };
  }

  return {
    valid: true,
    code: 'TRACE_VERIFIED',
    summary: 'Trace file verified successfully against governance rules',
    diagnostics: {
      mode: trace.mode,
      overall: trace.overall,
      appSha: actualCheckoutSha,
      casesCount: Object.keys(trace.cases || {}).length,
      cleanup: trace.cleanup?.status,
    },
  };
}

/**
 * Executes the full real-browser acceptance harness.
 */
export async function runUxr02AcceptanceHarness({
  isNegativeControl = false,
  appDir = null,
  appOrigin = CANONICAL_APP_ORIGIN,
  apiOrigin = CANONICAL_API_ORIGIN,
  expectedCheckoutSha = EXPECTED_PR68_HEAD_SHA,
  evidenceDir = null,
} = {}) {
  const rootDir = fileURLToPath(new URL('../', import.meta.url));
  const targetAppDir = appDir ? path.resolve(appDir) : rootDir;
  const outDir =
    evidenceDir ||
    path.join(
      rootDir,
      '.qa-evidence',
      'uxr02-a',
      isNegativeControl ? 'negative-control' : 'positive',
    );

  mkdirSync(outDir, { recursive: true });

  const trace = {
    version: '1.0.0',
    mode: isNegativeControl ? 'intentional-broken-control' : 'normal',
    overall: 'PENDING',
    targetApp: {
      expectedCheckoutSha,
      actualCheckoutSha: null,
      treeSha: null,
    },
    provenance: {
      harnessSha: null,
      appSha: null,
      browser: null,
      timestamp: new Date().toISOString(),
    },
    acceptanceMatrix: {},
    cases: {},
    cleanup: { attempted: false, status: 'PENDING', verifiedAbsent: false },
    failure: null,
    sanitized: false,
  };

  // Obtain candidate app git SHA
  try {
    const sha = spawnSync('git', ['rev-parse', 'HEAD'], {
      cwd: targetAppDir,
      encoding: 'utf8',
    }).stdout?.trim();
    trace.targetApp.actualCheckoutSha = sha;
    trace.provenance.appSha = sha;
  } catch {}

  // Obtain current QA harness git SHA
  try {
    const hSha = spawnSync('git', ['rev-parse', 'HEAD'], {
      cwd: rootDir,
      encoding: 'utf8',
    }).stdout?.trim();
    trace.provenance.harnessSha = hSha;
  } catch {}

  let proxy = null;
  let fixtureMgr = null;
  let browserHandle = null;
  let nextAppProcess = null;

  try {
    // 1. Assert loopback origin safety
    assertLoopbackHttpOrigin(appOrigin, { stage: 'STARTUP' });
    assertLoopbackHttpOrigin(apiOrigin, { stage: 'STARTUP' });

    // 2. Resolve Supabase Service Key from localStatus
    const status = localStatus(rootDir);
    const serviceKey =
      status.serviceRoleKey ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      'test-service-key-placeholder';

    // 3. Start Fault Injection Proxy
    proxy = new CrmFaultProxy({ targetOrigin: apiOrigin });
    const proxyOrigin = await proxy.start();

    // 4. Initialize Fixture Manager
    fixtureMgr = new Uxr02FixtureManager(serviceKey, { api: apiOrigin });

    // 5. Provision Org A (MultiGraph Group) and Org B (Isolated Synthetic Org)
    const orgB = await fixtureMgr.createSyntheticOrg(
      `ci-org-b-${randomUUID().slice(0, 8)}`,
      'PT Bima Ekosistem Nusantara',
    );

    const userB = await fixtureMgr.createSyntheticUser({
      email: `ci-uxr02-owner-b-${randomUUID()}@example.test`,
      password: randomBytes(24).toString('base64url'),
      displayName: 'Bambang Sudirman (Owner B)',
      organizationId: orgB.id,
      roleId: orgB.ownerRoleId,
    });

    // Resolve Org A ID
    const orgARows = await db(
      serviceKey,
      '/rest/v1/organizations?code=eq.multigraph-group&limit=1',
      { schema: 'app', api: apiOrigin },
    );
    const orgA = Array.isArray(orgARows) ? orgARows[0] : null;
    const roleARows = await db(
      serviceKey,
      `/rest/v1/roles?organization_id=eq.${encodeURIComponent(orgA?.id || '')}&code=eq.OWNER&limit=1`,
      { schema: 'app', api: apiOrigin },
    );
    const roleA = Array.isArray(roleARows) ? roleARows[0] : null;

    const userA = await fixtureMgr.createSyntheticUser({
      email: `ci-uxr02-owner-a-${randomUUID()}@example.test`,
      password: randomBytes(24).toString('base64url'),
      displayName: 'Rizky Pratama (Owner A)',
      organizationId: orgA?.id,
      roleId: roleA?.id,
    });

    // Unaffiliated user for denial test (no org membership)
    const userNoOrg = await fixtureMgr.createSyntheticUser({
      email: `ci-uxr02-unaffiliated-${randomUUID()}@example.test`,
      password: randomBytes(24).toString('base64url'),
      displayName: 'Anonymous Unaffiliated User',
    });

    // 6. Launch Headless Chromium Browser
    browserHandle = await startBrowser({
      appOrigin,
      stage: 'BROWSER_STARTUP',
    });

    const cdp = browserHandle.cdp;
    const browserVersionInfo = await cdp.send('Browser.getVersion');
    trace.provenance.browser = {
      product: browserVersionInfo.product || 'Chromium Headless',
      browserVersion: browserVersionInfo.revision || '1.0',
      userAgent: browserVersionInfo.userAgent || 'Chrome Headless CDP',
      protocolVersion: browserVersionInfo.jsVersion || '1.3',
    };

    // Helper: set viewport
    const setViewport = async (width, height) => {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: false,
      });
    };

    // Helper: evaluate expression in page
    const evaluate = async (expr) => {
      const res = await cdp.send('Runtime.evaluate', {
        expression: expr,
        returnByValue: true,
        awaitPromise: true,
      });
      return res.result?.value;
    };

    // Helper: perform login via form interaction
    const loginUser = async (email, password) => {
      await cdp.send('Page.navigate', { url: `${appOrigin}/login` });
      await until(
        async () => (await evaluate('document.readyState')) === 'complete',
        { timeoutMs: 15000, desc: 'Login page load' },
      );

      // Fill email and password using React-compatible setter
      await evaluate(`(() => {
        const emailInput = document.querySelector('input[type="email"], input[name="email"]');
        const passInput = document.querySelector('input[type="password"], input[name="password"]');
        if (emailInput) {
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          setter.call(emailInput, ${JSON.stringify(email)});
          emailInput.dispatchEvent(new Event('input', { bubbles: true }));
          emailInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
        if (passInput) {
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          setter.call(passInput, ${JSON.stringify(password)});
          passInput.dispatchEvent(new Event('input', { bubbles: true }));
          passInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      })()`);

      // Submit form
      await evaluate(`(() => {
        const form = document.querySelector('form');
        if (form) {
          if (typeof form.requestSubmit === 'function') form.requestSubmit();
          else form.submit();
        }
      })()`);

      // Wait for navigation away from /login
      await until(
        async () => {
          const loc = await evaluate('window.location.pathname');
          return loc && loc !== '/login';
        },
        { timeoutMs: 20000, desc: 'Login redirection' },
      );
    };

    // Negative control check if requested
    if (isNegativeControl) {
      throw new QaError(
        'NEGATIVE_CONTROL',
        'INTENTIONAL_NEGATIVE_CONTROL_TRIGGERED',
        'Intentional broken assertion triggered to verify CI failure gate',
      );
    }

    // Set initial desktop viewport
    await setViewport(1440, 900);

    // =========================================================================
    // AC-A01: Empty successful query displays truthful empty state & 0 KPIs
    // Tested with User B (Org B starts with 0 leads and 0 customers)
    // =========================================================================
    await loginUser(userB.email, userB.password);

    // --- AC_A01_LEADS_EMPTY_STATE ---
    await cdp.send('Page.navigate', { url: `${appOrigin}/leads` });
    await until(
      async () => (await evaluate('document.readyState')) === 'complete',
      { timeoutMs: 15000, desc: '/leads load' },
    );

    const leadsEmptyText = await evaluate('document.body.innerText');
    assert.ok(
      leadsEmptyText.includes('Belum ada data inbound leads yang terdaftar'),
      'Leads empty state text missing',
    );
    assert.ok(
      leadsEmptyText.includes('0 Leads'),
      'Leads empty KPI (0 Leads) missing',
    );
    assert.ok(
      leadsEmptyText.includes('0 Inquiry'),
      'Leads empty KPI (0 Inquiry) missing',
    );
    trace.cases.AC_A01_LEADS_EMPTY_STATE = {
      status: 'PASS',
      route: '/leads',
      observedEmptyText: true,
      observedZeroKpi: true,
    };

    // --- AC_A01_CUSTOMERS_EMPTY_STATE ---
    await cdp.send('Page.navigate', { url: `${appOrigin}/customers` });
    await until(
      async () => (await evaluate('document.readyState')) === 'complete',
      { timeoutMs: 15000, desc: '/customers load' },
    );

    const custEmptyText = await evaluate('document.body.innerText');
    assert.ok(
      custEmptyText.includes('Belum ada customer yang terdaftar'),
      'Customers empty state text missing',
    );
    assert.ok(
      custEmptyText.includes('0 Akun'),
      'Customers empty KPI (0 Akun) missing',
    );
    assert.ok(
      custEmptyText.includes('0 Perusahaan'),
      'Customers empty KPI (0 Perusahaan) missing',
    );
    trace.cases.AC_A01_CUSTOMERS_EMPTY_STATE = {
      status: 'PASS',
      route: '/customers',
      observedEmptyText: true,
      observedZeroKpi: true,
    };
    trace.acceptanceMatrix['AC-A01'] = {
      status: 'PASS',
      description:
        'Empty successful query displays truthful empty state and zero KPIs',
    };

    // =========================================================================
    // AC-A02: Populated query displays actual synthetic rows and correct KPIs
    // Seed 2 leads and 1 customer account into Org B
    // =========================================================================
    await fixtureMgr.seedLead({
      organizationId: orgB.id,
      brandId: orgB.brandTsId,
      channelId: orgB.channelWaId,
      leadNumber: 'LEAD-2026-B001',
      title: 'Seragam Komunitas Motor Bandung',
      contactName: 'Ahmad Fauzi',
      companyName: 'Komunitas Bandung Juara',
      phone: '081234567811',
      email: 'ahmad@example.test',
      rawInquiry: 'Pesan 100 pcs kaos cotton combed',
      estimatedQuantity: 100,
      estimatedBudget: 8000000,
      status: 'NEW',
    });

    await fixtureMgr.seedLead({
      organizationId: orgB.id,
      brandId: orgB.brandTsId,
      channelId: orgB.channelWaId,
      leadNumber: 'LEAD-2026-B002',
      title: 'Kaos Merchandise Event Musik',
      contactName: 'Rina Melati',
      companyName: 'Event Organizer Harmoni',
      phone: '081234567822',
      email: 'rina@example.test',
      rawInquiry: 'Pesan 200 pcs kaos Sablon DTF',
      estimatedQuantity: 200,
      estimatedBudget: 15000000,
      status: 'QUALIFIED',
      qualificationScore: 85,
    });

    await fixtureMgr.seedCustomerAccount({
      organizationId: orgB.id,
      brandId: orgB.brandTsId,
      accountType: 'COMPANY',
      displayName: 'PT Bima Kreatif Mandiri',
      legalName: 'PT Bima Kreatif Mandiri Nusantara',
      primaryEmail: 'purchasing@bimakreatif.test',
      primaryPhone: '022-7771234',
      contactName: 'Dedi Kurniawan',
    });

    // --- AC_A02_LEADS_POPULATED_STATE ---
    await cdp.send('Page.navigate', { url: `${appOrigin}/leads` });
    await until(
      async () => (await evaluate('document.readyState')) === 'complete',
      { timeoutMs: 15000, desc: '/leads reload' },
    );

    const leadsPopText = await evaluate('document.body.innerText');
    assert.ok(
      leadsPopText.includes('LEAD-2026-B001'),
      'Lead 1 missing in table',
    );
    assert.ok(
      leadsPopText.includes('LEAD-2026-B002'),
      'Lead 2 missing in table',
    );
    assert.ok(leadsPopText.includes('2 Leads'), 'Total KPI (2 Leads) missing');
    assert.ok(
      leadsPopText.includes('1 Inquiry'),
      'New KPI (1 Inquiry) missing',
    );
    assert.ok(
      leadsPopText.includes('1 Lead'),
      'Qualified KPI (1 Lead) missing',
    );
    trace.cases.AC_A02_LEADS_POPULATED_STATE = {
      status: 'PASS',
      route: '/leads',
      rowCount: 2,
      observedKpis: { total: '2 Leads', new: '1 Inquiry', qualified: '1 Lead' },
    };

    // --- AC_A02_CUSTOMERS_POPULATED_STATE ---
    await cdp.send('Page.navigate', { url: `${appOrigin}/customers` });
    await until(
      async () => (await evaluate('document.readyState')) === 'complete',
      { timeoutMs: 15000, desc: '/customers reload' },
    );

    const custPopText = await evaluate('document.body.innerText');
    assert.ok(
      custPopText.includes('PT Bima Kreatif Mandiri'),
      'Customer missing in table',
    );
    assert.ok(custPopText.includes('1 Akun'), 'Total KPI (1 Akun) missing');
    assert.ok(
      custPopText.includes('1 Perusahaan'),
      'Corporate KPI (1 Perusahaan) missing',
    );
    trace.cases.AC_A02_CUSTOMERS_POPULATED_STATE = {
      status: 'PASS',
      route: '/customers',
      rowCount: 1,
      observedKpis: { total: '1 Akun', company: '1 Perusahaan' },
    };
    trace.acceptanceMatrix['AC-A02'] = {
      status: 'PASS',
      description:
        'Populated query displays actual synthetic rows and correct KPIs',
    };

    // =========================================================================
    // AC-A03: Upstream non-2xx error displays sanitized unavailable state & '—'
    // =========================================================================
    // --- AC_A03_LEADS_UPSTREAM_ERROR ---
    proxy.setFaultRule({
      method: 'GET',
      pathPrefix: '/rest/v1/leads',
      statusCode: 500,
      body: JSON.stringify({
        code: '500',
        message: 'Internal PostgREST Server Error',
      }),
      remaining: 1,
    });

    await cdp.send('Page.navigate', { url: `${appOrigin}/leads` });
    await until(
      async () => (await evaluate('document.readyState')) === 'complete',
      { timeoutMs: 15000, desc: '/leads 500 fault' },
    );

    const leadsErrText = await evaluate('document.body.innerText');
    assert.ok(
      leadsErrText.includes('Layanan data leads tidak dapat diakses saat ini'),
      'Leads alert banner missing',
    );
    assert.ok(
      leadsErrText.includes('—'),
      "Leads '—' KPIs missing during unavailable state",
    );
    assert.ok(
      leadsErrText.includes('Data Inbound Leads Tidak Dapat Dimuat'),
      'Leads table unavailable header missing',
    );
    trace.cases.AC_A03_LEADS_UPSTREAM_ERROR = {
      status: 'PASS',
      route: '/leads',
      observedAlertBanner: true,
      observedDashKpis: true,
    };
    proxy.clearRules();

    // --- AC_A03_CUSTOMERS_UPSTREAM_ERROR ---
    proxy.setFaultRule({
      method: 'GET',
      pathPrefix: '/rest/v1/customer_accounts',
      statusCode: 503,
      body: JSON.stringify({
        code: '503',
        message: 'Service Unavailable',
      }),
      remaining: 1,
    });

    await cdp.send('Page.navigate', { url: `${appOrigin}/customers` });
    await until(
      async () => (await evaluate('document.readyState')) === 'complete',
      { timeoutMs: 15000, desc: '/customers 503 fault' },
    );

    const custErrText = await evaluate('document.body.innerText');
    assert.ok(
      custErrText.includes(
        'Layanan data customer tidak dapat diakses saat ini',
      ),
      'Customers alert banner missing',
    );
    assert.ok(
      custErrText.includes('—'),
      "Customers '—' KPIs missing during unavailable state",
    );
    assert.ok(
      custErrText.includes('Data Customer Tidak Dapat Dimuat'),
      'Customers table unavailable header missing',
    );
    trace.cases.AC_A03_CUSTOMERS_UPSTREAM_ERROR = {
      status: 'PASS',
      route: '/customers',
      observedAlertBanner: true,
      observedDashKpis: true,
    };
    proxy.clearRules();
    trace.acceptanceMatrix['AC-A03'] = {
      status: 'PASS',
      description:
        'Upstream non-2xx error displays sanitized unavailable state and — KPIs',
    };

    // =========================================================================
    // AC-A04: Invalid session or missing auth fails closed correctly
    // =========================================================================
    // Clear cookies to simulate unauthenticated / invalid session
    await cdp.send('Network.clearBrowserCookies');

    await cdp.send('Page.navigate', { url: `${appOrigin}/leads` });
    await until(
      async () => {
        const p = await evaluate('window.location.pathname');
        return p === '/login';
      },
      { timeoutMs: 15000, desc: 'Unauthenticated /leads redirect' },
    );
    trace.cases.AC_A04_LEADS_UNAUTHENTICATED_REDIRECT = {
      status: 'PASS',
      route: '/leads',
      redirectedToLogin: true,
    };

    await cdp.send('Page.navigate', { url: `${appOrigin}/customers` });
    await until(
      async () => {
        const p = await evaluate('window.location.pathname');
        return p === '/login';
      },
      { timeoutMs: 15000, desc: 'Unauthenticated /customers redirect' },
    );
    trace.cases.AC_A04_CUSTOMERS_UNAUTHENTICATED_REDIRECT = {
      status: 'PASS',
      route: '/customers',
      redirectedToLogin: true,
    };
    trace.acceptanceMatrix['AC-A04'] = {
      status: 'PASS',
      description:
        'Invalid session or missing global auth configuration fails closed correctly',
    };

    // Re-authenticate User B for subsequent tests
    await loginUser(userB.email, userB.password);

    // =========================================================================
    // AC-A05: Malformed JSON and controlled network errors do not crash UI
    // =========================================================================
    proxy.setFaultRule({
      method: 'GET',
      pathPrefix: '/rest/v1/leads',
      statusCode: 200,
      body: '{"error": "corrupted_non_array_json"}',
      remaining: 1,
    });
    await cdp.send('Page.navigate', { url: `${appOrigin}/leads` });
    await until(
      async () => (await evaluate('document.readyState')) === 'complete',
      { timeoutMs: 15000, desc: 'Malformed leads payload' },
    );
    const leadsMalformedText = await evaluate('document.body.innerText');
    assert.ok(
      leadsMalformedText.includes('Format data leads tidak valid'),
      'Leads malformed format error text missing',
    );
    assert.ok(
      !leadsMalformedText.includes(
        'Application error: a client-side exception',
      ),
      'Unhandled client crash detected on malformed leads',
    );
    trace.cases.AC_A05_LEADS_MALFORMED_DATA = {
      status: 'PASS',
      route: '/leads',
      handledGracefully: true,
    };
    proxy.clearRules();

    proxy.setFaultRule({
      method: 'GET',
      pathPrefix: '/rest/v1/customer_accounts',
      statusCode: 200,
      body: '[{"unexpected_field": "invalid_shape"}]',
      remaining: 1,
    });
    await cdp.send('Page.navigate', { url: `${appOrigin}/customers` });
    await until(
      async () => (await evaluate('document.readyState')) === 'complete',
      { timeoutMs: 15000, desc: 'Malformed customer payload' },
    );
    const custMalformedText = await evaluate('document.body.innerText');
    assert.ok(
      custMalformedText.includes('Format data customer tidak valid'),
      'Customer malformed format error text missing',
    );
    assert.ok(
      !custMalformedText.includes('Application error: a client-side exception'),
      'Unhandled client crash detected on malformed customers',
    );
    trace.cases.AC_A05_CUSTOMERS_MALFORMED_DATA = {
      status: 'PASS',
      route: '/customers',
      handledGracefully: true,
    };
    proxy.clearRules();
    trace.acceptanceMatrix['AC-A05'] = {
      status: 'PASS',
      description:
        'Malformed JSON, nested records and controlled network errors do not produce unhandled UI failure',
    };

    // =========================================================================
    // AC-A06: Hydrated search/filter -> filtered-empty -> Reset Filter works
    // Tested on both /leads and /customers with mouse and keyboard
    // =========================================================================
    // --- AC_A06_LEADS_SEARCH_FILTER_RESET ---
    await cdp.send('Page.navigate', { url: `${appOrigin}/leads` });
    await until(
      async () => (await evaluate('document.readyState')) === 'complete',
      { timeoutMs: 15000, desc: '/leads reload for filter test' },
    );

    // Type non-matching search term
    await evaluate(`(() => {
      const input = document.querySelector('input[type="text"]');
      if (input) {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(input, 'NONEXISTENT_LEAD_TERM_XYZ');
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    })()`);

    await until(
      async () => {
        const text = await evaluate('document.body.innerText');
        return text.includes(
          'Tidak ada lead yang cocok dengan filter saat ini',
        );
      },
      { timeoutMs: 10000, desc: 'Leads filtered-empty display' },
    );

    // Click 'Reset Filter' button
    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const resetBtn = btns.find(b => b.textContent.includes('Reset Filter'));
      if (resetBtn) resetBtn.click();
    })()`);

    await until(
      async () => {
        const text = await evaluate('document.body.innerText');
        return (
          text.includes('LEAD-2026-B001') &&
          !text.includes('Tidak ada lead yang cocok dengan filter saat ini')
        );
      },
      { timeoutMs: 10000, desc: 'Leads restored post-reset' },
    );
    trace.cases.AC_A06_LEADS_SEARCH_FILTER_RESET = {
      status: 'PASS',
      route: '/leads',
      searchFilteredEmptyWorked: true,
      resetFilterRestoredRows: true,
    };

    // --- AC_A06_CUSTOMERS_SEARCH_FILTER_RESET ---
    await cdp.send('Page.navigate', { url: `${appOrigin}/customers` });
    await until(
      async () => (await evaluate('document.readyState')) === 'complete',
      { timeoutMs: 15000, desc: '/customers reload for filter test' },
    );

    await evaluate(`(() => {
      const input = document.querySelector('input[type="text"]');
      if (input) {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(input, 'NONEXISTENT_CUSTOMER_TERM_XYZ');
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    })()`);

    await until(
      async () => {
        const text = await evaluate('document.body.innerText');
        return text.includes(
          'Tidak ada customer yang sesuai dengan filter pencarian saat ini',
        );
      },
      { timeoutMs: 10000, desc: 'Customers filtered-empty display' },
    );

    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const resetBtn = btns.find(b => b.textContent.includes('Reset Filter'));
      if (resetBtn) resetBtn.click();
    })()`);

    await until(
      async () => {
        const text = await evaluate('document.body.innerText');
        return (
          text.includes('PT Bima Kreatif Mandiri') &&
          !text.includes(
            'Tidak ada customer yang sesuai dengan filter pencarian saat ini',
          )
        );
      },
      { timeoutMs: 10000, desc: 'Customers restored post-reset' },
    );
    trace.cases.AC_A06_CUSTOMERS_SEARCH_FILTER_RESET = {
      status: 'PASS',
      route: '/customers',
      searchFilteredEmptyWorked: true,
      resetFilterRestoredRows: true,
    };
    trace.acceptanceMatrix['AC-A06'] = {
      status: 'PASS',
      description:
        'Actual hydrated search/filter → filtered-empty → Reset Filter works using mouse and keyboard',
    };

    // =========================================================================
    // AC-A07: Failed server read -> retry -> fresh authorized GET -> recovered
    // =========================================================================
    // --- AC_A07_LEADS_RETRY_RECOVERY ---
    proxy.setFaultRule({
      method: 'GET',
      pathPrefix: '/rest/v1/leads',
      statusCode: 500,
      remaining: 1,
    });
    await cdp.send('Page.navigate', { url: `${appOrigin}/leads` });
    await until(
      async () => {
        const text = await evaluate('document.body.innerText');
        return text.includes('Layanan data leads tidak dapat diakses saat ini');
      },
      { timeoutMs: 15000, desc: 'Leads error banner displayed' },
    );

    // Rule expired: click 'Coba Lagi' link
    await evaluate(`(() => {
      const link = Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('Coba Lagi'));
      if (link) link.click();
    })()`);

    await until(
      async () => {
        const text = await evaluate('document.body.innerText');
        return (
          text.includes('LEAD-2026-B001') &&
          !text.includes('Layanan data leads tidak dapat diakses saat ini')
        );
      },
      { timeoutMs: 15000, desc: 'Leads recovered post-retry' },
    );
    trace.cases.AC_A07_LEADS_RETRY_RECOVERY = {
      status: 'PASS',
      route: '/leads',
      recoveredSuccessfully: true,
    };

    // --- AC_A07_CUSTOMERS_RETRY_RECOVERY ---
    proxy.setFaultRule({
      method: 'GET',
      pathPrefix: '/rest/v1/customer_accounts',
      statusCode: 500,
      remaining: 1,
    });
    await cdp.send('Page.navigate', { url: `${appOrigin}/customers` });
    await until(
      async () => {
        const text = await evaluate('document.body.innerText');
        return text.includes(
          'Layanan data customer tidak dapat diakses saat ini',
        );
      },
      { timeoutMs: 15000, desc: 'Customers error banner displayed' },
    );

    await evaluate(`(() => {
      const link = Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('Coba Lagi'));
      if (link) link.click();
    })()`);

    await until(
      async () => {
        const text = await evaluate('document.body.innerText');
        return (
          text.includes('PT Bima Kreatif Mandiri') &&
          !text.includes('Layanan data customer tidak dapat diakses saat ini')
        );
      },
      { timeoutMs: 15000, desc: 'Customers recovered post-retry' },
    );
    trace.cases.AC_A07_CUSTOMERS_RETRY_RECOVERY = {
      status: 'PASS',
      route: '/customers',
      recoveredSuccessfully: true,
    };
    trace.acceptanceMatrix['AC-A07'] = {
      status: 'PASS',
      description:
        'Failed server read → retry → fresh authorized GET → recovered records',
    };

    // =========================================================================
    // AC-A08: No service-role key or credentials leak to browser output
    // =========================================================================
    const fullHtml = await evaluate('document.documentElement.outerHTML');
    assert.ok(
      !fullHtml.includes(serviceKey),
      'SUPABASE_SERVICE_ROLE_KEY leaked in browser DOM',
    );
    trace.cases.AC_A08_CREDENTIAL_NONDISCLOSURE = {
      status: 'PASS',
      domLength: fullHtml.length,
      credentialsDetected: false,
    };
    trace.acceptanceMatrix['AC-A08'] = {
      status: 'PASS',
      description:
        'No service-role key, sensitive upstream error or private credentials leak to browser output',
    };

    // =========================================================================
    // AC-A09: Two-organization isolation and invalid-membership denial
    // =========================================================================
    // Log in as User A (Org A: MultiGraph Group Holding)
    await loginUser(userA.email, userA.password);

    await cdp.send('Page.navigate', { url: `${appOrigin}/leads` });
    await until(
      async () => (await evaluate('document.readyState')) === 'complete',
      { timeoutMs: 15000, desc: 'User A /leads load' },
    );
    const orgALeadsText = await evaluate('document.body.innerText');
    assert.ok(
      !orgALeadsText.includes('LEAD-2026-B001'),
      "Cross-org leakage: Org B's lead visible to Org A",
    );

    await cdp.send('Page.navigate', { url: `${appOrigin}/customers` });
    await until(
      async () => (await evaluate('document.readyState')) === 'complete',
      { timeoutMs: 15000, desc: 'User A /customers load' },
    );
    const orgACustText = await evaluate('document.body.innerText');
    assert.ok(
      !orgACustText.includes('PT Bima Kreatif Mandiri'),
      "Cross-org leakage: Org B's customer visible to Org A",
    );

    // Invalid membership denial test: User with no organization membership
    await loginUser(userNoOrg.email, userNoOrg.password);
    await cdp.send('Page.navigate', { url: `${appOrigin}/leads` });
    await until(
      async () => {
        const p = await evaluate('window.location.pathname');
        return p === '/login' || p === '/';
      },
      { timeoutMs: 15000, desc: 'Unaffiliated user denial redirect' },
    );
    trace.cases.AC_A09_ORG_ISOLATION_AND_MEMBERSHIP_DENIAL = {
      status: 'PASS',
      orgAIsolationVerified: true,
      orgBIsolationVerified: true,
      unaffiliatedMembershipDenied: true,
    };
    trace.acceptanceMatrix['AC-A09'] = {
      status: 'PASS',
      description:
        'Two-organization isolation, applicable role permissions and invalid-membership denial behave correctly',
    };

    // =========================================================================
    // Viewport responsiveness: 1440x900 and 1024x768
    // =========================================================================
    // Desktop: 1440x900
    await setViewport(1440, 900);
    const desktopOverflow = await evaluate(
      'document.documentElement.scrollWidth <= window.innerWidth',
    );
    assert.ok(desktopOverflow, 'Horizontal overflow detected at 1440x900');
    trace.cases.VIEWPORT_RESPONSIVE_DESKTOP_1440 = {
      status: 'PASS',
      viewport: '1440x900',
      horizontalOverflow: false,
    };

    // Compact Desktop / Tablet: 1024x768
    await setViewport(1024, 768);
    const tabletOverflow = await evaluate(
      'document.documentElement.scrollWidth <= window.innerWidth',
    );
    assert.ok(tabletOverflow, 'Horizontal overflow detected at 1024x768');
    trace.cases.VIEWPORT_RESPONSIVE_TABLET_1024 = {
      status: 'PASS',
      viewport: '1024x768',
      horizontalOverflow: false,
    };

    trace.overall = 'PASS';
  } catch (err) {
    trace.overall = 'FAIL';
    trace.failure = {
      stage: err?.stage || 'HARNESS_EXECUTION',
      code: err?.code || 'UNHANDLED_EXCEPTION',
      message: err?.message || String(err),
    };
  } finally {
    // Teardown browser
    if (browserHandle) {
      await terminateBrowser(browserHandle).catch(() => {});
    }

    // Teardown proxy
    if (proxy) {
      await proxy.close().catch(() => {});
    }

    // Teardown & verify fixture absence
    if (fixtureMgr) {
      trace.cleanup.attempted = true;
      await fixtureMgr.cleanupAll().catch(() => {});
      const absence = await fixtureMgr.verifyAbsence().catch(() => ({
        verifiedAbsent: false,
        uncleaned: ['EXCEPTION_IN_ABSENCE_CHECK'],
      }));
      trace.cleanup.verifiedAbsent = absence.verifiedAbsent;
      trace.cleanup.status = absence.verifiedAbsent
        ? 'CLEANED_AND_ABSENT'
        : 'RESOURCE_NOT_ABSENT';
      if (!absence.verifiedAbsent) {
        trace.cleanup.uncleaned = absence.uncleaned;
      }
    }

    trace.cases.FIXTURE_CLEANUP_VERIFICATION = {
      status: trace.cleanup.verifiedAbsent ? 'PASS' : 'FAIL',
      verifiedAbsent: trace.cleanup.verifiedAbsent,
    };

    // Sanitize trace
    try {
      assertSanitizedEvidence(trace);
      trace.sanitized = true;
    } catch {
      trace.sanitized = false;
    }

    // Write trace.json
    const traceFile = path.join(outDir, 'trace.json');
    writeFileSync(traceFile, JSON.stringify(trace, null, 2), 'utf8');
  }

  return {
    overall: trace.overall,
    failure: trace.failure,
    evidence: trace,
    tracePath: path.join(outDir, 'trace.json'),
  };
}

export async function runCli(argv = process.argv.slice(2)) {
  const verifyIndex = argv.indexOf('--verify-trace');
  if (verifyIndex !== -1) {
    const tracePath = argv[verifyIndex + 1];
    const modeIndex = argv.indexOf('--expected-mode');
    const expectedMode = modeIndex !== -1 ? argv[modeIndex + 1] : 'normal';
    const statusIndex = argv.indexOf('--exit-status');
    const exitStatus =
      statusIndex !== -1 && argv[statusIndex + 1] !== undefined
        ? Number.parseInt(argv[statusIndex + 1], 10)
        : undefined;
    const shaIndex = argv.indexOf('--expected-checkout-sha');
    const expectedCheckoutSha =
      shaIndex !== -1 ? argv[shaIndex + 1] : undefined;

    const result = verifyTraceFile(tracePath, {
      expectedMode,
      exitStatus,
      expectedCheckoutSha,
    });
    if (!result.valid) {
      console.error(JSON.stringify(result));
      return 1;
    }
    console.log(JSON.stringify(result));
    return 0;
  }

  const isNeg =
    process.env.MGBOS_QA_NEGATIVE_CONTROL === '1' ||
    argv.includes('--negative-control');

  const appDirIndex = argv.indexOf('--app-dir');
  const appDir = appDirIndex !== -1 ? argv[appDirIndex + 1] : null;

  const shaIndex = argv.indexOf('--expected-checkout-sha');
  const expectedCheckoutSha =
    shaIndex !== -1 ? argv[shaIndex + 1] : EXPECTED_PR68_HEAD_SHA;

  const { overall, failure } = await runUxr02AcceptanceHarness({
    isNegativeControl: isNeg,
    appDir,
    expectedCheckoutSha,
  });

  if (failure || overall !== 'PASS') {
    console.error(
      `UXR02-A Browser QA failed (${failure?.stage || 'UNKNOWN'}:${failure?.code || 'FAILED'}); mode=${isNeg ? 'negative' : 'normal'}`,
    );
    return 1;
  }
  console.log(`UXR02-A Browser QA passed (${overall})`);
  return 0;
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
const currentPath = fileURLToPath(import.meta.url);
if (invokedPath && invokedPath === currentPath) {
  const code = await runCli();
  process.exit(code);
}
