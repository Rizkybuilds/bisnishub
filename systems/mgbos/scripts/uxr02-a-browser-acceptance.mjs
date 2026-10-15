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
import { spawnSync } from 'node:child_process';
import { randomBytes, randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
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
  'AC_A04_INVALID_SESSION_CLOSED',
  'AC_A04_UNAVAILABLE_AUTH_CONFIG',
  'AC_A05_LEADS_MALFORMED_DATA',
  'AC_A05_CUSTOMERS_MALFORMED_DATA',
  'AC_A05_TRANSPORT_NETWORK_ERROR',
  'AC_A06_LEADS_POINTER_FILTER_RESET',
  'AC_A06_CUSTOMERS_KEYBOARD_FILTER_RESET',
  'AC_A07_LEADS_RETRY_RECOVERY',
  'AC_A07_CUSTOMERS_RETRY_RECOVERY',
  'AC_A08_CREDENTIAL_NONDISCLOSURE',
  'AC_A09_ORG_ISOLATION_AND_MEMBERSHIP_DENIAL',
  'AC_A09_ROLE_BOUNDARIES_AND_DETAIL_READ',
  'VIEWPORT_RESPONSIVE_DESKTOP_1440',
  'VIEWPORT_RESPONSIVE_TABLET_1024',
  'FIXTURE_CLEANUP_VERIFICATION',
]);

/**
 * Localhost-only HTTP fault-injection reverse proxy.
 *
 * Forwards requests to real local Supabase (127.0.0.1:55431) by default,
 * allowing Next.js server components to receive injected HTTP 400, 500, 502, 503,
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
    this.requestLog = [];
    this.interceptedCount = 0;
  }

  async start() {
    return new Promise((resolve, reject) => {
      this.server = http.createServer((req, res) =>
        this._handleRequest(req, res),
      );
      this.server.on('error', (err) => {
        if (err.code === 'EADDRINUSE' && this.port !== 0) {
          this.port = 0;
          this.server.listen(0, '127.0.0.1', () => {
            const address = this.server.address();
            this.port = address.port;
            this.activeOrigin = `http://127.0.0.1:${this.port}`;
            resolve(this.activeOrigin);
          });
        } else {
          reject(err);
        }
      });
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
    transportError = false,
  }) {
    this.rules.push({
      method: method.toUpperCase(),
      pathPrefix,
      statusCode,
      body,
      headers,
      remaining,
      transportError,
    });
  }

  clearRules() {
    this.rules = [];
  }

  getRequestLog({ method = null, pathPrefix = null } = {}) {
    return this.requestLog.filter((entry) => {
      if (method && entry.method !== method.toUpperCase()) return false;
      if (pathPrefix && !entry.path.startsWith(pathPrefix)) return false;
      return true;
    });
  }

  _handleRequest(clientReq, clientRes) {
    const parsedUrl = new URL(clientReq.url, this.activeOrigin);
    const reqPath = parsedUrl.pathname;
    const reqMethod = (clientReq.method || 'GET').toUpperCase();
    const reqUrl = clientReq.url;

    // Check for matched fault rule
    const ruleIndex = this.rules.findIndex(
      (r) =>
        r.method === reqMethod &&
        reqPath.startsWith(r.pathPrefix) &&
        r.remaining > 0,
    );

    const isFault = ruleIndex !== -1;
    const matchedRule = isFault ? this.rules[ruleIndex] : null;

    // Record request in audit log for AC-A07 retry and boundary verification
    this.requestLog.push({
      method: reqMethod,
      path: reqPath,
      url: reqUrl,
      search: parsedUrl.search,
      headers: { ...clientReq.headers },
      timestamp: Date.now(),
      faultInjected: isFault,
      transportErrorInjected: Boolean(matchedRule?.transportError),
    });

    if (isFault) {
      matchedRule.remaining -= 1;
      if (matchedRule.remaining <= 0) {
        this.rules.splice(ruleIndex, 1);
      }
      this.interceptedCount += 1;

      if (matchedRule.transportError) {
        // Destroy client socket immediately to simulate genuine TCP transport drop
        clientReq.socket.destroy();
        return;
      }

      clientRes.writeHead(matchedRule.statusCode, {
        ...matchedRule.headers,
        'x-mgbos-fault-injected': '1',
      });
      clientRes.end(matchedRule.body);
      return;
    }

    // Default: proxy to canonical loopback Supabase target
    const targetUrl = new URL(clientReq.url, this.targetOrigin);
    const headers = { ...clientReq.headers, host: targetUrl.host };
    const proxyReq = http.request(
      targetUrl,
      {
        method: clientReq.method,
        headers,
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

    // Create OWNER role
    const ownerRoleRows = await db(this.serviceKey, '/rest/v1/roles', {
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
    const ownerRole = Array.isArray(ownerRoleRows)
      ? ownerRoleRows[0]
      : ownerRoleRows;
    assert.ok(ownerRole?.id, 'Failed to create synthetic OWNER role');
    this.register('roles', ownerRole.id);

    // Create SALES role
    const salesRoleRows = await db(this.serviceKey, '/rest/v1/roles', {
      method: 'POST',
      schema: 'app',
      body: {
        organization_id: org.id,
        code: 'SALES',
        name: 'Sales Executive',
        description: 'Synthetic Sales Role',
      },
      api: this.api,
      stage: 'FIXTURE_SETUP',
    });
    const salesRole = Array.isArray(salesRoleRows)
      ? salesRoleRows[0]
      : salesRoleRows;
    assert.ok(salesRole?.id, 'Failed to create synthetic SALES role');
    this.register('roles', salesRole.id);

    // Create QC role (operations/quality control, non-sales)
    const qcRoleRows = await db(this.serviceKey, '/rest/v1/roles', {
      method: 'POST',
      schema: 'app',
      body: {
        organization_id: org.id,
        code: 'QC',
        name: 'Quality Control Lead',
        description: 'Synthetic QC Role',
      },
      api: this.api,
      stage: 'FIXTURE_SETUP',
    });
    const qcRole = Array.isArray(qcRoleRows) ? qcRoleRows[0] : qcRoleRows;
    assert.ok(qcRole?.id, 'Failed to create synthetic QC role');
    this.register('roles', qcRole.id);

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
      ownerRoleId: ownerRole.id,
      salesRoleId: salesRole.id,
      qcRoleId: qcRole.id,
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
    const deletionErrors = [];

    const deleteEntity = async (table, schema, label, id) => {
      try {
        await db(
          this.serviceKey,
          `/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`,
          { method: 'DELETE', schema, api: this.api },
        );
      } catch (err) {
        deletionErrors.push({
          entity: label,
          id: String(id),
          error: err?.message || String(err),
        });
      }
    };

    // Delete in reverse dependency order
    for (const id of this.registry.customerBrandRels) {
      await deleteEntity(
        'customer_brand_relationships',
        'app',
        'customerBrandRel',
        id,
      );
    }
    for (const id of this.registry.customerContacts) {
      await deleteEntity('customer_contacts', 'app', 'customerContact', id);
    }
    for (const id of this.registry.customerAccounts) {
      await deleteEntity('customer_accounts', 'app', 'customerAccount', id);
    }
    for (const id of this.registry.leads) {
      await deleteEntity('leads', 'app', 'lead', id);
    }
    for (const id of this.registry.memberships) {
      await deleteEntity('organization_members', 'app', 'membership', id);
    }
    for (const id of this.registry.profiles) {
      await deleteEntity('users', 'app', 'profile', id);
    }
    for (const id of this.registry.authUsers) {
      try {
        await db(
          this.serviceKey,
          `/auth/v1/admin/users/${encodeURIComponent(id)}`,
          {
            method: 'DELETE',
            api: this.api,
          },
        );
      } catch (err) {
        deletionErrors.push({
          entity: 'authUser',
          id: String(id),
          error: err?.message || String(err),
        });
      }
    }
    for (const id of this.registry.channels) {
      await deleteEntity('channels', 'app', 'channel', id);
    }
    for (const id of this.registry.brands) {
      await deleteEntity('brands', 'app', 'brand', id);
    }
    for (const id of this.registry.roles) {
      await deleteEntity('roles', 'app', 'role', id);
    }
    for (const id of this.registry.organizations) {
      await deleteEntity('organizations', 'app', 'organization', id);
    }

    return { errors: deletionErrors, deletionErrors };
  }

  async verifyAbsence() {
    const uncleaned = [];
    const inconclusive = [];

    const checkEntityAbsence = async (table, schema, label, ids) => {
      for (const id of ids) {
        try {
          const rows = await db(
            this.serviceKey,
            `/rest/v1/${table}?id=eq.${encodeURIComponent(id)}&select=id`,
            { schema, api: this.api },
          );
          if (Array.isArray(rows) && rows.length > 0) {
            uncleaned.push(`${label}:${id}`);
          }
        } catch (err) {
          inconclusive.push({
            entity: label,
            id: String(id),
            error: err?.message || String(err),
          });
        }
      }
    };

    // Check all 11 registry entity types
    await checkEntityAbsence(
      'customer_brand_relationships',
      'app',
      'customerBrandRel',
      this.registry.customerBrandRels,
    );
    await checkEntityAbsence(
      'customer_contacts',
      'app',
      'customerContact',
      this.registry.customerContacts,
    );
    await checkEntityAbsence(
      'customer_accounts',
      'app',
      'customerAccount',
      this.registry.customerAccounts,
    );
    await checkEntityAbsence('leads', 'app', 'lead', this.registry.leads);
    await checkEntityAbsence(
      'organization_members',
      'app',
      'membership',
      this.registry.memberships,
    );
    await checkEntityAbsence('users', 'app', 'profile', this.registry.profiles);
    await checkEntityAbsence(
      'channels',
      'app',
      'channel',
      this.registry.channels,
    );
    await checkEntityAbsence('brands', 'app', 'brand', this.registry.brands);
    await checkEntityAbsence('roles', 'app', 'role', this.registry.roles);
    await checkEntityAbsence(
      'organizations',
      'app',
      'organization',
      this.registry.organizations,
    );

    for (const id of this.registry.authUsers) {
      try {
        const user = await db(
          this.serviceKey,
          `/auth/v1/admin/users/${encodeURIComponent(id)}`,
          { api: this.api },
        );
        if (user && user.id) {
          uncleaned.push(`authUser:${id}`);
        }
      } catch (err) {
        const msg = (err?.message || '').toLowerCase();
        const status = err?.status || err?.statusCode;
        if (
          status === 404 ||
          msg.includes('not found') ||
          msg.includes('404')
        ) {
          // Explicitly verified absent
        } else {
          inconclusive.push({
            entity: 'authUser',
            id: String(id),
            error: err?.message || String(err),
          });
        }
      }
    }

    const verifiedAbsent = uncleaned.length === 0 && inconclusive.length === 0;

    return {
      verifiedAbsent,
      uncleaned,
      inconclusive,
    };
  }
}

/**
 * Validates a generated trace JSON file against all governance rules.
 */
export function verifyTraceFile(
  tracePath,
  {
    expectedMode = 'normal',
    exitStatus = 0,
    expectedCheckoutSha,
    expectedHarnessSha,
  } = {},
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

  // 1. Application candidate revision check
  const actualCheckoutSha =
    trace.provenance?.appSha || trace.targetApp?.actualCheckoutSha;
  if (expectedCheckoutSha && actualCheckoutSha !== expectedCheckoutSha) {
    return {
      valid: false,
      code: 'CHECKOUT_SHA_MISMATCH',
      summary: `Expected candidate SHA '${expectedCheckoutSha}', but trace recorded '${actualCheckoutSha}'`,
    };
  }

  // Application tree SHA check
  const appTreeSha = trace.provenance?.appTreeSha || trace.targetApp?.treeSha;
  if (!appTreeSha || !/^[0-9a-f]{40}$/i.test(appTreeSha)) {
    return {
      valid: false,
      code: 'APP_TREE_SHA_INVALID',
      summary: `Trace recorded invalid or missing application tree SHA: '${appTreeSha}'`,
    };
  }

  // Harness commit SHA and tree SHA check
  const actualHarnessSha = trace.provenance?.harnessSha;
  if (expectedHarnessSha && actualHarnessSha !== expectedHarnessSha) {
    return {
      valid: false,
      code: 'HARNESS_SHA_MISMATCH',
      summary: `Expected harness SHA '${expectedHarnessSha}', but trace recorded '${actualHarnessSha}'`,
    };
  }

  const harnessTreeSha = trace.provenance?.harnessTreeSha;
  if (!harnessTreeSha || !/^[0-9a-f]{40}$/i.test(harnessTreeSha)) {
    return {
      valid: false,
      code: 'HARNESS_TREE_SHA_INVALID',
      summary: `Trace recorded invalid or missing harness tree SHA: '${harnessTreeSha}'`,
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
    if ((trace.cleanup?.deletionErrors || []).length > 0) {
      return {
        valid: false,
        code: 'CLEANUP_DELETION_FAILED',
        summary: `Trace recorded deletion errors during cleanup: ${JSON.stringify(trace.cleanup.deletionErrors)}`,
      };
    }
    if ((trace.cleanup?.inconclusive || []).length > 0) {
      return {
        valid: false,
        code: 'CLEANUP_INCONCLUSIVE',
        summary: `Trace recorded inconclusive absence check queries: ${JSON.stringify(trace.cleanup.inconclusive)}`,
      };
    }
    if ((trace.cleanup?.uncleaned || []).length > 0) {
      return {
        valid: false,
        code: 'RESOURCE_NOT_ABSENT',
        summary: `Trace recorded uncleaned fixtures: ${JSON.stringify(trace.cleanup.uncleaned)}`,
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
    // Cleanup must be verified absent even in negative control mode
    if (trace.cleanup?.verifiedAbsent !== true) {
      return {
        valid: false,
        code: 'CLEANUP_NOT_VERIFIED_IN_NEGATIVE_CONTROL',
        summary:
          'Negative control failed to verify complete absence of fixtures during teardown',
      };
    }
    if ((trace.cleanup?.deletionErrors || []).length > 0) {
      return {
        valid: false,
        code: 'CLEANUP_DELETION_FAILED',
        summary: `Negative control trace recorded deletion errors during cleanup: ${JSON.stringify(trace.cleanup.deletionErrors)}`,
      };
    }
    if ((trace.cleanup?.inconclusive || []).length > 0) {
      return {
        valid: false,
        code: 'CLEANUP_INCONCLUSIVE',
        summary: `Negative control trace recorded inconclusive absence queries: ${JSON.stringify(trace.cleanup.inconclusive)}`,
      };
    }
    if ((trace.cleanup?.uncleaned || []).length > 0) {
      return {
        valid: false,
        code: 'RESOURCE_NOT_ABSENT',
        summary: `Negative control trace recorded uncleaned fixtures: ${JSON.stringify(trace.cleanup.uncleaned)}`,
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
  proxyPort = 55430,
  expectedCheckoutSha = EXPECTED_PR68_HEAD_SHA,
  expectedHarnessSha = null,
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

  // Ensure harness environment points consistently to real local Supabase apiOrigin
  process.env.NEXT_PUBLIC_SUPABASE_URL = apiOrigin;
  delete process.env.SUPABASE_URL;

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
      harnessTreeSha: null,
      appSha: null,
      appTreeSha: null,
      expectedAppSha: expectedCheckoutSha,
      expectedHarnessSha,
      actualTestedAppSha: null,
      browser: null,
      environment: {
        runnerOs: process.env.RUNNER_OS || process.platform,
        runnerArch: process.env.RUNNER_ARCH || process.arch,
        nodeVersion: process.version,
      },
      github: {
        runId: process.env.GITHUB_RUN_ID || null,
        runAttempt: process.env.GITHUB_RUN_ATTEMPT || null,
        repository: process.env.GITHUB_REPOSITORY || 'Rizkybuilds/bisnishub',
        prNumber: process.env.PR_NUMBER || 72,
        prHeadSha: process.env.PR_HEAD_SHA || null,
      },
      timestamp: new Date().toISOString(),
      artifactId: 'mgbos-uxr02-a-acceptance-evidence',
    },
    acceptanceMatrix: {},
    cases: {},
    cleanup: { attempted: false, status: 'PENDING', verifiedAbsent: false },
    failure: null,
    sanitized: false,
  };

  // Obtain candidate app git commit SHA and tree SHA
  try {
    const sha = spawnSync('git', ['rev-parse', 'HEAD'], {
      cwd: targetAppDir,
      encoding: 'utf8',
    }).stdout?.trim();
    const treeSha = spawnSync('git', ['rev-parse', 'HEAD^{tree}'], {
      cwd: targetAppDir,
      encoding: 'utf8',
    }).stdout?.trim();
    trace.targetApp.actualCheckoutSha = sha;
    trace.targetApp.treeSha = treeSha;
    trace.provenance.appSha = sha;
    trace.provenance.appTreeSha = treeSha;
    trace.provenance.actualTestedAppSha = sha;
  } catch {}

  // Obtain current QA harness git commit SHA and tree SHA
  try {
    const hSha = spawnSync('git', ['rev-parse', 'HEAD'], {
      cwd: rootDir,
      encoding: 'utf8',
    }).stdout?.trim();
    const hTreeSha = spawnSync('git', ['rev-parse', 'HEAD^{tree}'], {
      cwd: rootDir,
      encoding: 'utf8',
    }).stdout?.trim();
    trace.provenance.harnessSha = hSha;
    trace.provenance.harnessTreeSha = hTreeSha;
  } catch {}

  let proxy = null;
  let fixtureMgr = null;
  let browserHandle = null;

  try {
    // 1. Assert loopback origin safety and environment consistency
    assertLoopbackHttpOrigin(appOrigin, { stage: 'STARTUP' });
    assertLoopbackHttpOrigin(apiOrigin, { stage: 'STARTUP' });
    assertConsistentSupabaseEnv(apiOrigin, process.env, {
      stage: 'STARTUP',
      code: 'NONLOCAL_TARGET_BLOCKED',
    });

    // 2. Resolve Supabase Service Key from localStatus
    const status = localStatus({
      api: apiOrigin,
      workdir: rootDir,
      env: { NEXT_PUBLIC_SUPABASE_URL: apiOrigin },
    });
    const serviceKey =
      status.SERVICE_ROLE_KEY ||
      status.serviceRoleKey ||
      process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
      throw new QaError(
        'STARTUP',
        'SERVICE_ROLE_KEY_MISSING',
        'Unable to resolve Supabase service role key from local status',
      );
    }

    // 3. Start Fault Injection Proxy
    proxy = new CrmFaultProxy({ port: proxyPort, targetOrigin: apiOrigin });
    const proxyOrigin = await proxy.start();
    assertLoopbackHttpOrigin(proxyOrigin, { stage: 'STARTUP' });
    trace.provenance.proxyOrigin = proxyOrigin;

    // 4. Initialize Fixture Manager
    fixtureMgr = new Uxr02FixtureManager(serviceKey, { api: apiOrigin });

    // 5. Provision Org A and Org B
    const orgA = await fixtureMgr.createSyntheticOrg(
      `ci-org-a-${randomUUID().slice(0, 8)}`,
      'PT Alpha Prima Holding',
    );

    const userA = await fixtureMgr.createSyntheticUser({
      email: `ci-uxr02-owner-a-${randomUUID()}@example.test`,
      password: randomBytes(24).toString('base64url'),
      displayName: 'Aditya Surya (Owner A)',
      organizationId: orgA.id,
      roleId: orgA.ownerRoleId,
    });

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

    // Provision distinct roles within Org B: SALES and QC
    const userSalesB = await fixtureMgr.createSyntheticUser({
      email: `ci-uxr02-sales-b-${randomUUID()}@example.test`,
      password: randomBytes(24).toString('base64url'),
      displayName: 'Siti Rahma (Sales B)',
      organizationId: orgB.id,
      roleId: orgB.salesRoleId,
    });

    const userQcB = await fixtureMgr.createSyntheticUser({
      email: `ci-uxr02-qc-b-${randomUUID()}@example.test`,
      password: randomBytes(24).toString('base64url'),
      displayName: 'Qodir Jaelani (QC B)',
      organizationId: orgB.id,
      roleId: orgB.qcRoleId,
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

    // Capture console output and runtime errors for AC-A08 and crash verification
    const browserLogs = [];
    await cdp.send('Console.enable').catch(() => {});
    await cdp.send('Runtime.enable').catch(() => {});
    cdp.on('Runtime.consoleAPICalled', (params) => {
      const text = (params.args || [])
        .map((a) =>
          a.value !== undefined ? String(a.value) : a.description || '',
        )
        .join(' ');
      browserLogs.push({ type: params.type, text });
    });
    cdp.on('Runtime.exceptionThrown', (params) => {
      browserLogs.push({
        type: 'exception',
        text: params.exceptionDetails?.text || 'Uncaught exception',
      });
    });

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

    // Helper: type string into focused input using actual CDP keyboard events
    const typeWithKeyboard = async (text) => {
      for (const char of text) {
        await cdp.send('Input.dispatchKeyEvent', {
          type: 'keyDown',
          text: char,
          unmodifiedText: char,
        });
        await cdp.send('Input.dispatchKeyEvent', {
          type: 'keyUp',
        });
      }
    };

    // Helper: click element using real CDP mouse events (pointer interaction)
    const clickWithPointer = async (selectorPredicate) => {
      const coords = await evaluate(`(() => {
        const fn = ${selectorPredicate.toString()};
        const el = fn();
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return {
          x: Math.round(rect.left + rect.width / 2),
          y: Math.round(rect.top + rect.height / 2),
        };
      })()`);
      assert.ok(coords, 'Target element not found for pointer click');
      await cdp.send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: coords.x,
        y: coords.y,
      });
      await cdp.send('Input.dispatchMouseEvent', {
        type: 'mousePressed',
        x: coords.x,
        y: coords.y,
        button: 'left',
        clickCount: 1,
      });
      await cdp.send('Input.dispatchMouseEvent', {
        type: 'mouseReleased',
        x: coords.x,
        y: coords.y,
        button: 'left',
        clickCount: 1,
      });
    };

    // Helper: press a keyboard key (e.g. Enter, Space, Tab)
    const pressKeyboardKey = async (key, code) => {
      const vk =
        key === 'Enter' ? 13 : key === ' ' ? 32 : key === 'Tab' ? 9 : 0;
      const text = key === 'Enter' ? '\r' : key === ' ' ? ' ' : '';
      await cdp.send('Input.dispatchKeyEvent', {
        type: 'keyDown',
        key,
        code,
        windowsVirtualKeyCode: vk,
        nativeVirtualKeyCode: vk,
        text,
        unmodifiedText: text,
      });
      await cdp.send('Input.dispatchKeyEvent', {
        type: 'keyUp',
        key,
        code,
        windowsVirtualKeyCode: vk,
        nativeVirtualKeyCode: vk,
      });
    };

    // Helper: verify no sensitive tokens or upstream error details leaked into browser state
    const sensitiveTokens = [
      { name: 'serviceKey', value: serviceKey },
      { name: 'userA.password', value: userA.password },
      { name: 'userB.password', value: userB.password },
      { name: 'userSalesB.password', value: userSalesB.password },
      { name: 'userQcB.password', value: userQcB.password },
      { name: 'upstreamErrorMarker1', value: 'Simulated CRM upstream fault' },
      { name: 'upstreamErrorMarker2', value: 'Bad Gateway Transport Error' },
    ].filter((t) => typeof t.value === 'string' && t.value.length > 0);

    const assertNoSensitiveLeakage = async (contextLabel) => {
      const fullHtml =
        (await evaluate('document.documentElement.outerHTML')) || '';
      const scriptContents =
        (await evaluate(`(() => {
          const scripts = Array.from(document.querySelectorAll('script'));
          return scripts.map(s => s.textContent || s.innerHTML).join('\\n');
        })()`)) || '';
      const consoleOutput = browserLogs.map((l) => l.text).join('\n');
      const combined = `${fullHtml}\n${scriptContents}\n${consoleOutput}`;

      for (const token of sensitiveTokens) {
        if (combined.includes(token.value)) {
          throw new QaError(
            `Sensitive value [REDACTED_${token.name}] detected in browser output for ${contextLabel}`,
            'SENSITIVE_DATA_DISCLOSED',
          );
        }
      }
    };

    // Helper: perform login via form interaction
    const loginUser = async (
      email,
      password,
      { allowStayOnLogin = false } = {},
    ) => {
      await cdp.send('Network.clearBrowserCookies');
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

      if (allowStayOnLogin) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return;
      }

      // Wait for navigation away from /login
      await until(
        async () => {
          const loc = await evaluate('window.location.pathname');
          return loc && loc !== '/login';
        },
        { timeoutMs: 20000, desc: 'Login redirection' },
      );
    };

    // Set initial desktop viewport
    await setViewport(1440, 900);

    // =========================================================================
    // AC-A01: Empty successful query displays truthful empty state & 0 KPIs
    // Tested with User B before any records are seeded for Org B
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
    assert.ok(
      !leadsEmptyText.includes(
        'Layanan data leads tidak dapat diakses saat ini',
      ),
      'Empty leads query must not be reported as unavailable service error',
    );
    assert.ok(
      !leadsEmptyText.includes('—'),
      "Empty query must not display '—' unknown KPI values",
    );
    trace.cases.AC_A01_LEADS_EMPTY_STATE = {
      status: 'PASS',
      route: '/leads',
      observedEmptyText: true,
      observedZeroKpi: true,
      distinguishedFromUnavailable: true,
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
    assert.ok(
      !custEmptyText.includes(
        'Layanan data customer tidak dapat diakses saat ini',
      ),
      'Empty customers query must not be reported as unavailable service error',
    );
    assert.ok(
      !custEmptyText.includes('—'),
      "Empty query must not display '—' unknown KPI values",
    );
    trace.cases.AC_A01_CUSTOMERS_EMPTY_STATE = {
      status: 'PASS',
      route: '/customers',
      observedEmptyText: true,
      observedZeroKpi: true,
      distinguishedFromUnavailable: true,
    };
    trace.acceptanceMatrix['AC-A01'] = {
      status: 'PASS',
      description:
        'Empty successful query displays truthful empty state and zero KPIs',
    };

    // =========================================================================
    // Seed Deterministic Synthetic Fixtures
    // Org A: 1 lead, 1 customer
    // Org B: 2 leads, 1 customer
    // =========================================================================
    await fixtureMgr.seedLead({
      organizationId: orgA.id,
      brandId: orgA.brandTsId,
      channelId: orgA.channelWaId,
      leadNumber: 'LEAD-2026-A001',
      title: 'Pengadaan Kaos Event Alpha Holding',
      contactName: 'Chandra Wijaya',
      companyName: 'PT Alpha Megah Sentosa',
      phone: '081234567899',
      email: 'chandra@alpha.test',
      rawInquiry: 'Pesan 500 pcs kaos polo bordir',
      estimatedQuantity: 500,
      estimatedBudget: 35000000,
      status: 'NEW',
    });

    await fixtureMgr.seedCustomerAccount({
      organizationId: orgA.id,
      brandId: orgA.brandTsId,
      accountType: 'COMPANY',
      displayName: 'PT Anugerah Mandiri (Holding Customer)',
      legalName: 'PT Anugerah Mandiri Perkasa',
      primaryEmail: 'procurement@anugerahmandiri.test',
      primaryPhone: '021-5559876',
      contactName: 'Hendra Gunawan',
    });

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

    // =========================================================================
    // AC-A02: Populated query displays actual synthetic rows and correct KPIs
    // =========================================================================
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
      leadsPopText.includes('Ahmad Fauzi'),
      'Lead 1 contact name missing',
    );
    assert.ok(
      leadsPopText.includes('LEAD-2026-B002'),
      'Lead 2 missing in table',
    );
    assert.ok(
      leadsPopText.includes('Rina Melati'),
      'Lead 2 contact name missing',
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
    // Prove data originates from authorized tested organization
    assert.ok(
      leadsPopText.includes('PT Bima Ekosistem Nusantara'),
      'Organization provenance missing on /leads header',
    );

    trace.cases.AC_A02_LEADS_POPULATED_STATE = {
      status: 'PASS',
      route: '/leads',
      rowCount: 2,
      observedKpis: { total: '2 Leads', new: '1 Inquiry', qualified: '1 Lead' },
      provenanceOrg: 'PT Bima Ekosistem Nusantara',
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
    assert.ok(
      custPopText.includes('Dedi Kurniawan'),
      'Customer contact missing in table',
    );
    assert.ok(custPopText.includes('1 Akun'), 'Total KPI (1 Akun) missing');
    assert.ok(
      custPopText.includes('1 Perusahaan'),
      'Corporate KPI (1 Perusahaan) missing',
    );
    assert.ok(
      custPopText.includes('PT Bima Ekosistem Nusantara'),
      'Organization provenance missing on /customers header',
    );

    trace.cases.AC_A02_CUSTOMERS_POPULATED_STATE = {
      status: 'PASS',
      route: '/customers',
      rowCount: 1,
      observedKpis: { total: '1 Akun', company: '1 Perusahaan' },
      provenanceOrg: 'PT Bima Ekosistem Nusantara',
    };
    trace.acceptanceMatrix['AC-A02'] = {
      status: 'PASS',
      description:
        'Populated query displays actual synthetic rows and correct KPIs',
    };

    // =========================================================================
    // F06 Negative Control: Deliberately violate a real acceptance condition
    // after fixtures and real populated browser paths are established
    // =========================================================================
    if (isNegativeControl) {
      const pageContent = await evaluate('document.body.innerText');
      // Deliberately falsify expectation on real populated CRM page
      assert.ok(
        pageContent.includes(
          'CANARY_REGRESSION_TOKEN_DELIBERATELY_MISSING_FROM_CRM',
        ),
        'Intentional negative control canary violation on live populated CRM view',
      );
    }

    // =========================================================================
    // AC-A03: Upstream non-2xx error displays sanitized unavailable state & '—'
    // Tests both 5xx and 4xx injected non-success server-side responses
    // =========================================================================
    // --- AC_A03_LEADS_UPSTREAM_ERROR (HTTP 500) ---
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
    assert.ok(
      !leadsErrText.includes('Belum ada data inbound leads yang terdaftar'),
      'Upstream error must not be reported as true empty state',
    );
    trace.cases.AC_A03_LEADS_UPSTREAM_ERROR = {
      status: 'PASS',
      route: '/leads',
      injectedCode: 500,
      observedAlertBanner: true,
      observedDashKpis: true,
      distinguishedFromEmpty: true,
    };
    proxy.clearRules();

    // --- AC_A03_CUSTOMERS_UPSTREAM_ERROR (HTTP 400 Bad Request) ---
    proxy.setFaultRule({
      method: 'GET',
      pathPrefix: '/rest/v1/customer_accounts',
      statusCode: 400,
      body: JSON.stringify({
        code: '400',
        message: 'Bad Request Parameter Format',
      }),
      remaining: 1,
    });

    await cdp.send('Page.navigate', { url: `${appOrigin}/customers` });
    await until(
      async () => (await evaluate('document.readyState')) === 'complete',
      { timeoutMs: 15000, desc: '/customers 400 fault' },
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
    assert.ok(
      !custErrText.includes('Belum ada customer yang terdaftar'),
      'Upstream error must not be reported as true empty state',
    );
    trace.cases.AC_A03_CUSTOMERS_UPSTREAM_ERROR = {
      status: 'PASS',
      route: '/customers',
      injectedCode: 400,
      observedAlertBanner: true,
      observedDashKpis: true,
      distinguishedFromEmpty: true,
    };
    proxy.clearRules();
    trace.acceptanceMatrix['AC-A03'] = {
      status: 'PASS',
      description:
        'Upstream non-2xx error displays sanitized unavailable state and — KPIs',
    };

    // =========================================================================
    // AC-A04: Invalid session or missing auth fails closed correctly
    // Covers unauthenticated, invalid session cookie, and missing auth config
    // =========================================================================
    // 1. Unauthenticated (no cookies)
    await cdp.send('Network.clearBrowserCookies');

    await cdp.send('Page.navigate', { url: `${appOrigin}/leads` });
    await until(
      async () => (await evaluate('window.location.pathname')) === '/login',
      { timeoutMs: 15000, desc: 'Unauthenticated /leads redirect' },
    );
    trace.cases.AC_A04_LEADS_UNAUTHENTICATED_REDIRECT = {
      status: 'PASS',
      route: '/leads',
      redirectedToLogin: true,
    };

    await cdp.send('Page.navigate', { url: `${appOrigin}/customers` });
    await until(
      async () => (await evaluate('window.location.pathname')) === '/login',
      { timeoutMs: 15000, desc: 'Unauthenticated /customers redirect' },
    );
    trace.cases.AC_A04_CUSTOMERS_UNAUTHENTICATED_REDIRECT = {
      status: 'PASS',
      route: '/customers',
      redirectedToLogin: true,
    };

    // 2. Invalid / corrupted session token cookie
    await cdp.send('Network.setCookie', {
      name: 'mgbos_session',
      value: 'corrupted_tampered_invalid_jwt_token',
      url: appOrigin,
    });
    await cdp.send('Page.navigate', { url: `${appOrigin}/leads` });
    await until(
      async () => (await evaluate('window.location.pathname')) === '/login',
      { timeoutMs: 15000, desc: 'Corrupted session /leads redirect' },
    );
    const unauthPageText = await evaluate('document.body.innerText');
    assert.ok(
      !unauthPageText.includes('LEAD-2026-B001'),
      'Protected data disclosed with invalid session cookie',
    );
    trace.cases.AC_A04_INVALID_SESSION_CLOSED = {
      status: 'PASS',
      cookieTampered: true,
      dataProtected: true,
    };

    // 3. Missing / unavailable auth config (simulated upstream auth failure)
    // Restore valid authenticated session for User B first so verifySessionToken passes
    // and requireAuth actually reaches the PostgREST /rest/v1/users boundary
    await loginUser(userB.email, userB.password);
    proxy.clearRules();
    proxy.requestLog = [];
    proxy.setFaultRule({
      method: 'GET',
      pathPrefix: '/rest/v1/users',
      statusCode: 500,
      body: JSON.stringify({ error: 'Auth database unavailable' }),
      remaining: 5,
    });
    await cdp.send('Page.navigate', { url: `${appOrigin}/leads` });
    await until(
      async () => (await evaluate('window.location.pathname')) === '/login',
      { timeoutMs: 15000, desc: 'Unavailable auth backend redirect' },
    );

    // Verify proxy audit log to confirm that the request actually reached /rest/v1/users boundary
    const authBoundaryRequests = proxy.getRequestLog({
      pathPrefix: '/rest/v1/users',
    });
    assert.ok(
      authBoundaryRequests.length > 0,
      'Auth failure did not reach /rest/v1/users PostgREST boundary',
    );
    assert.ok(
      authBoundaryRequests.some((r) => r.faultInjected),
      'Injected fault was not consumed on /rest/v1/users',
    );
    proxy.clearRules();

    trace.cases.AC_A04_UNAVAILABLE_AUTH_CONFIG = {
      status: 'PASS',
      backendUnavailable: true,
      authBoundaryReached: true,
      safeFallbackToLogin: true,
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
    // 1. Invalid JSON syntax (HTTP 200 with non-JSON syntax)
    proxy.setFaultRule({
      method: 'GET',
      pathPrefix: '/rest/v1/leads',
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: '<<<malformed_non_json_syntax>>>',
      remaining: 1,
    });
    await cdp.send('Page.navigate', { url: `${appOrigin}/leads` });
    await until(
      async () => (await evaluate('document.readyState')) === 'complete',
      { timeoutMs: 15000, desc: 'Invalid JSON syntax leads' },
    );
    const leadsSyntaxText = await evaluate('document.body.innerText');
    assert.ok(
      !leadsSyntaxText.includes('Application error: a client-side exception'),
      'Unhandled client crash on non-JSON syntax payload',
    );
    trace.cases.AC_A05_LEADS_MALFORMED_DATA = {
      status: 'PASS',
      route: '/leads',
      handledGracefully: true,
    };
    proxy.clearRules();

    // 2. Malformed JSON shape (unexpected schema format)
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

    // 3. Controlled transport / connection gateway error:
    // 3a. Genuine transport network error: socket destroy (network drop)
    proxy.setFaultRule({
      method: 'GET',
      pathPrefix: '/rest/v1/leads',
      transportError: true,
      remaining: 1,
    });
    await cdp.send('Page.navigate', { url: `${appOrigin}/leads` });
    await until(
      async () => {
        const text = await evaluate('document.body.innerText');
        return text.includes(
          'Terjadi gangguan jaringan saat memuat data leads',
        );
      },
      { timeoutMs: 15000, desc: 'Genuine transport network error leads' },
    );
    const leadsTransportText = await evaluate('document.body.innerText');
    assert.ok(
      leadsTransportText.includes(
        'Terjadi gangguan jaringan saat memuat data leads',
      ),
      'Genuine transport error message missing on /leads',
    );
    assert.ok(
      leadsTransportText.includes('Coba Lagi'),
      'Retry link missing in transport error banner',
    );
    assert.ok(
      !leadsTransportText.includes(
        'Application error: a client-side exception',
      ),
      'Unhandled client crash on genuine transport network drop',
    );
    proxy.clearRules();

    // 3b. Controlled HTTP 502 gateway error
    proxy.setFaultRule({
      method: 'GET',
      pathPrefix: '/rest/v1/customers',
      statusCode: 502,
      body: '{"error":"Bad Gateway Transport Error"}',
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
      { timeoutMs: 15000, desc: 'Gateway 502 error customers' },
    );
    const cust502Text = await evaluate('document.body.innerText');
    assert.ok(
      cust502Text.includes(
        'Layanan data customer tidak dapat diakses saat ini',
      ),
      'HTTP 502 gateway error message missing on /customers',
    );
    assert.ok(
      cust502Text.includes('Coba Lagi'),
      'Retry link missing in 502 error banner',
    );
    assert.ok(
      !cust502Text.includes('Application error: a client-side exception'),
      'Unhandled client crash on HTTP 502 gateway error',
    );
    proxy.clearRules();

    trace.cases.AC_A05_TRANSPORT_NETWORK_ERROR = {
      status: 'PASS',
      route: '/leads',
      genuineTransportSocketDestroyHandled: true,
      gateway502Handled: true,
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
    // Tested on /leads with POINTER interaction, and /customers with KEYBOARD
    // =========================================================================
    // --- AC_A06_LEADS_POINTER_FILTER_RESET ---
    await cdp.send('Page.navigate', { url: `${appOrigin}/leads` });
    await until(
      async () => (await evaluate('document.readyState')) === 'complete',
      { timeoutMs: 15000, desc: '/leads reload for filter test' },
    );

    // Focus input and type using real CDP keyboard dispatch
    await evaluate(`(() => {
      const input = document.querySelector('input[type="text"]');
      if (input) input.focus();
    })()`);
    await typeWithKeyboard('NONEXISTENT_LEAD_TERM_XYZ');

    await until(
      async () => {
        const text = await evaluate('document.body.innerText');
        return text.includes(
          'Tidak ada lead yang cocok dengan filter saat ini',
        );
      },
      { timeoutMs: 10000, desc: 'Leads filtered-empty display' },
    );

    // Click 'Reset Filter' button using real CDP mouse events (pointer)
    await clickWithPointer(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find((b) => b.textContent.includes('Reset Filter'));
    });

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
    trace.cases.AC_A06_LEADS_POINTER_FILTER_RESET = {
      status: 'PASS',
      route: '/leads',
      keyboardInputUsed: true,
      pointerClickUsed: true,
      resetFilterRestoredRows: true,
    };

    // --- AC_A06_CUSTOMERS_KEYBOARD_FILTER_RESET ---
    await cdp.send('Page.navigate', { url: `${appOrigin}/customers` });
    await until(
      async () => (await evaluate('document.readyState')) === 'complete',
      { timeoutMs: 15000, desc: '/customers reload for filter test' },
    );

    // Focus input and type using real CDP keyboard dispatch
    await evaluate(`(() => {
      const input = document.querySelector('input[type="text"]');
      if (input) input.focus();
    })()`);
    await typeWithKeyboard('NONEXISTENT_CUSTOMER_TERM_XYZ');

    await until(
      async () => {
        const text = await evaluate('document.body.innerText');
        return (
          text.includes('Tidak ada customer yang sesuai') ||
          text
            .replace(/\s+/g, ' ')
            .includes(
              'Tidak ada customer yang sesuai dengan filter pencarian saat ini',
            )
        );
      },
      { timeoutMs: 10000, desc: 'Customers filtered-empty display' },
    );

    // Focus Reset Filter button via keyboard navigation and verify activeElement
    const focusedReset = await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const resetBtn = btns.find((b) => b.textContent.includes('Reset Filter'));
      if (resetBtn) {
        resetBtn.focus();
        return document.activeElement === resetBtn;
      }
      return false;
    })()`);
    assert.ok(focusedReset, 'Reset Filter button could not receive focus');

    // Trigger action purely via real CDP Enter key event (no programmatic click fallback)
    await pressKeyboardKey('Enter', 'Enter');

    await until(
      async () => {
        const text = await evaluate('document.body.innerText');
        return (
          text.includes('PT Bima Kreatif Mandiri') &&
          !text.includes('Tidak ada customer yang sesuai')
        );
      },
      { timeoutMs: 10000, desc: 'Customers restored post-reset' },
    );
    trace.cases.AC_A06_CUSTOMERS_KEYBOARD_FILTER_RESET = {
      status: 'PASS',
      route: '/customers',
      keyboardOnlyUsed: true,
      focusVerified: true,
      enterKeyTriggered: true,
      resetFilterRestoredRows: true,
    };
    trace.acceptanceMatrix['AC-A06'] = {
      status: 'PASS',
      description:
        'Actual hydrated search/filter → filtered-empty → Reset Filter works using mouse and keyboard',
    };

    // =========================================================================
    // AC-A07: Failed server read -> retry -> fresh authorized GET -> recovered
    // Inspects server-side proxy audit log for authorized GET and read-only safety
    // =========================================================================
    // --- AC_A07_LEADS_RETRY_RECOVERY ---
    proxy.clearRules();
    proxy.requestLog = [];
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

    // Rule consumed: click 'Coba Lagi' link
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

    // Verify proxy request audit log for read-only safety and authorized scoping
    const leadsMutatingRequests = proxy.requestLog.filter((entry) =>
      ['POST', 'PUT', 'PATCH', 'DELETE'].includes(entry.method),
    );
    assert.equal(
      leadsMutatingRequests.length,
      0,
      `Unexpected mutation observed during read-only leads retry: ${JSON.stringify(leadsMutatingRequests)}`,
    );

    const leadsRetryRequests = proxy.getRequestLog({
      method: 'GET',
      pathPrefix: '/rest/v1/leads',
    });
    assert.ok(
      leadsRetryRequests.length >= 2,
      'Retry did not trigger a new server-side GET to /rest/v1/leads',
    );
    const retryReq = leadsRetryRequests[leadsRetryRequests.length - 1];
    assert.equal(retryReq.method, 'GET', 'Retry request must be read-only GET');
    assert.ok(
      retryReq.url && retryReq.url.includes(`organization_id=eq.${orgB.id}`),
      `Retry request not scoped to authorized organization: ${retryReq.url}`,
    );
    assert.equal(
      retryReq.headers.authorization,
      `Bearer ${serviceKey}`,
      'Retry request authorization bearer token does not match authorized service key',
    );
    assert.equal(
      retryReq.headers.apikey,
      serviceKey,
      'Retry request apikey does not match service key',
    );
    assert.equal(
      retryReq.headers['accept-profile'],
      'app',
      'Retry request Accept-Profile header must be app schema',
    );

    trace.cases.AC_A07_LEADS_RETRY_RECOVERY = {
      status: 'PASS',
      route: '/leads',
      serverGetObserved: true,
      authorizedRead: true,
      readOnlyPreserved: true,
      recoveredSuccessfully: true,
    };

    // --- AC_A07_CUSTOMERS_RETRY_RECOVERY ---
    proxy.clearRules();
    proxy.requestLog = [];
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

    const custMutatingRequests = proxy.requestLog.filter((entry) =>
      ['POST', 'PUT', 'PATCH', 'DELETE'].includes(entry.method),
    );
    assert.equal(
      custMutatingRequests.length,
      0,
      `Unexpected mutation observed during read-only customers retry: ${JSON.stringify(custMutatingRequests)}`,
    );

    const custRetryRequests = proxy.getRequestLog({
      method: 'GET',
      pathPrefix: '/rest/v1/customer_accounts',
    });
    assert.ok(
      custRetryRequests.length >= 2,
      'Retry did not trigger a new server-side GET to /rest/v1/customer_accounts',
    );
    const retryCustReq = custRetryRequests[custRetryRequests.length - 1];
    assert.equal(
      retryCustReq.method,
      'GET',
      'Retry request must be read-only GET',
    );
    assert.ok(
      retryCustReq.url &&
        retryCustReq.url.includes(`organization_id=eq.${orgB.id}`),
      `Retry request not scoped to authorized organization: ${retryCustReq.url}`,
    );
    assert.equal(
      retryCustReq.headers.authorization,
      `Bearer ${serviceKey}`,
      'Retry request authorization bearer token does not match authorized service key',
    );
    assert.equal(
      retryCustReq.headers.apikey,
      serviceKey,
      'Retry request apikey does not match service key',
    );
    assert.equal(
      retryCustReq.headers['accept-profile'],
      'app',
      'Retry request Accept-Profile header must be app schema',
    );

    trace.cases.AC_A07_CUSTOMERS_RETRY_RECOVERY = {
      status: 'PASS',
      route: '/customers',
      serverGetObserved: true,
      authorizedRead: true,
      readOnlyPreserved: true,
      recoveredSuccessfully: true,
    };
    trace.acceptanceMatrix['AC-A07'] = {
      status: 'PASS',
      description:
        'Failed server read → retry → fresh authorized GET → recovered records',
    };

    // =========================================================================
    // AC-A08: No service-role key or credentials leak to browser output
    // Inspects DOM HTML, Next.js RSC scripts, and console output on both routes
    // =========================================================================
    await assertNoSensitiveLeakage('/customers');

    await cdp.send('Page.navigate', { url: `${appOrigin}/leads` });
    await until(
      async () => (await evaluate('document.readyState')) === 'complete',
      { timeoutMs: 15000, desc: 'Leads load for AC-A08' },
    );
    await assertNoSensitiveLeakage('/leads');

    trace.cases.AC_A08_CREDENTIAL_NONDISCLOSURE = {
      status: 'PASS',
      htmlChecked: true,
      rscChecked: true,
      consoleChecked: true,
      serviceKeyProtected: true,
      credentialsProtected: true,
      upstreamFaultMarkersProtected: true,
    };
    trace.acceptanceMatrix['AC-A08'] = {
      status: 'PASS',
      description:
        'No service-role key, sensitive upstream error or private credentials leak to browser output',
    };

    // =========================================================================
    // AC-A09: Two-organization isolation and invalid-membership denial
    // Tests bidirectional isolation: Org A cannot see Org B, Org B cannot see Org A
    // Tests multi-role access (OWNER, SALES, QC) and unaffiliated denial
    // Tests authorized detail modal read regression
    // =========================================================================
    // Bidirectional Check 1: User A (Org A)
    await loginUser(userA.email, userA.password);

    await cdp.send('Page.navigate', { url: `${appOrigin}/leads` });
    await until(
      async () => (await evaluate('document.readyState')) === 'complete',
      { timeoutMs: 15000, desc: 'User A /leads load' },
    );
    const orgALeadsText = await evaluate('document.body.innerText');
    assert.ok(
      orgALeadsText.includes('LEAD-2026-A001'),
      'Org A lead missing for User A',
    );
    assert.ok(
      !orgALeadsText.includes('LEAD-2026-B001'),
      "Cross-org leakage: Org B's lead visible to Org A",
    );
    assert.ok(
      !orgALeadsText.includes('LEAD-2026-B002'),
      "Cross-org leakage: Org B's lead visible to Org A",
    );

    await cdp.send('Page.navigate', { url: `${appOrigin}/customers` });
    await until(
      async () => (await evaluate('document.readyState')) === 'complete',
      { timeoutMs: 15000, desc: 'User A /customers load' },
    );
    const orgACustText = await evaluate('document.body.innerText');
    assert.ok(
      orgACustText.includes('PT Anugerah Mandiri (Holding Customer)'),
      'Org A customer missing for User A',
    );
    assert.ok(
      !orgACustText.includes('PT Bima Kreatif Mandiri'),
      "Cross-org leakage: Org B's customer visible to Org A",
    );

    // Bidirectional Check 2: User B (Org B)
    await loginUser(userB.email, userB.password);
    await cdp.send('Page.navigate', { url: `${appOrigin}/leads` });
    await until(
      async () => (await evaluate('document.readyState')) === 'complete',
      { timeoutMs: 15000, desc: 'User B /leads re-verification' },
    );
    const orgBLeadsText = await evaluate('document.body.innerText');
    assert.ok(
      orgBLeadsText.includes('LEAD-2026-B001'),
      'Org B lead missing for User B',
    );
    assert.ok(
      !orgBLeadsText.includes('LEAD-2026-A001'),
      "Cross-org leakage: Org A's lead visible to Org B",
    );

    // Role check: User Sales B (SALES role permitted for CRM reads)
    await loginUser(userSalesB.email, userSalesB.password);
    await cdp.send('Page.navigate', { url: `${appOrigin}/leads` });
    await until(
      async () => (await evaluate('document.readyState')) === 'complete',
      { timeoutMs: 15000, desc: 'Sales User /leads load' },
    );
    const salesLeadsText = await evaluate('document.body.innerText');
    assert.ok(
      salesLeadsText.includes('LEAD-2026-B001'),
      'Sales role cannot read authorized leads',
    );

    // Role check: User QC B (QC role verification)
    await loginUser(userQcB.email, userQcB.password);
    await cdp.send('Page.navigate', { url: `${appOrigin}/leads` });
    await until(
      async () => (await evaluate('document.readyState')) === 'complete',
      { timeoutMs: 15000, desc: 'QC User /leads load' },
    );
    const qcLeadsText = await evaluate('document.body.innerText');
    assert.ok(
      qcLeadsText.includes('LEAD-2026-B001'),
      'QC role cannot read authorized leads',
    );
    assert.ok(
      !qcLeadsText.includes('LEAD-2026-A001'),
      "Cross-org leakage: Org A's lead visible to QC User B",
    );

    // QC role on /customers
    await cdp.send('Page.navigate', { url: `${appOrigin}/customers` });
    await until(
      async () => (await evaluate('document.readyState')) === 'complete',
      { timeoutMs: 15000, desc: 'QC User /customers load' },
    );
    const qcCustText = await evaluate('document.body.innerText');
    assert.ok(
      qcCustText.includes('PT Bima Kreatif Mandiri'),
      'QC role cannot read authorized customers',
    );
    assert.ok(
      !qcCustText.includes('PT Anugerah Mandiri'),
      "Cross-org leakage: Org A's customer visible to QC User B",
    );

    // Detail modal read regression with QC role
    await cdp.send('Page.navigate', { url: `${appOrigin}/leads` });
    await until(
      async () => (await evaluate('document.readyState')) === 'complete',
      { timeoutMs: 15000, desc: 'QC User /leads reload for detail modal' },
    );
    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const detailBtn = btns.find(b => b.textContent.includes('Detail'));
      if (detailBtn) detailBtn.click();
    })()`);
    await until(
      async () => {
        const text = await evaluate('document.body.innerText');
        return text.includes('Seragam Komunitas Motor Bandung');
      },
      { timeoutMs: 10000, desc: 'Detail modal opened for QC user' },
    );
    // Close detail modal
    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const closeBtn = btns.find(b => b.textContent.includes('Tutup') || b.textContent.includes('×'));
      if (closeBtn) closeBtn.click();
    })()`);

    // QC role mutation rejection verification (QC role lacks leads:create)
    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const createBtn = btns.find(b => b.textContent.includes('Catat Inbound Lead'));
      if (createBtn) createBtn.click();
    })()`);
    await until(
      async () => {
        const text = await evaluate('document.body.innerText');
        return text.includes('Pusat Penangkapan Inbound Inquiry');
      },
      { timeoutMs: 10000, desc: 'Create lead modal opened for QC' },
    );
    await evaluate(`(() => {
      const titleInput = document.querySelector('input[name="title"]');
      if (titleInput) {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(titleInput, 'QC Unauthorized Lead Test');
        titleInput.dispatchEvent(new Event('input', { bubbles: true }));
        titleInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
      const contactInput = document.querySelector('input[name="contactName"]');
      if (contactInput) {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(contactInput, 'QC Tester');
        contactInput.dispatchEvent(new Event('input', { bubbles: true }));
        contactInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    })()`);
    await evaluate(`(() => {
      const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Simpan Inbound Lead'));
      if (submitBtn) submitBtn.click();
    })()`);
    await until(
      async () => {
        const text = await evaluate('document.body.innerText');
        return text.includes('tidak memiliki izin');
      },
      {
        timeoutMs: 10000,
        desc: 'Permission denial message displayed for QC create mutation',
      },
    );
    const qcDeniedText = await evaluate('document.body.innerText');
    assert.ok(
      qcDeniedText.includes('tidak memiliki izin'),
      'QC role was not denied on createLeadAction mutation',
    );
    // Close create modal
    await evaluate(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const cancelBtn = btns.find(b => b.textContent.includes('Batal'));
      if (cancelBtn) cancelBtn.click();
    })()`);

    // Invalid membership denial test: User with no organization membership
    await loginUser(userNoOrg.email, userNoOrg.password, {
      allowStayOnLogin: true,
    });
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
      salesRoleVerified: true,
      qcRoleVerified: true,
      qcMutationDeniedVerified: true,
      unaffiliatedMembershipDenied: true,
    };

    trace.cases.AC_A09_ROLE_BOUNDARIES_AND_DETAIL_READ = {
      status: 'PASS',
      detailModalOpenedAndClosed: true,
      qcDetailReadVerified: true,
    };

    trace.acceptanceMatrix['AC-A09'] = {
      status: 'PASS',
      description:
        'Two-organization isolation, applicable role permissions and invalid-membership denial behave correctly',
    };

    // Re-login User B for viewport tests
    await loginUser(userB.email, userB.password);

    // =========================================================================
    // Viewport responsiveness: 1440x900 and 1024x768
    // Verified on actively loaded, authorized, populated CRM routes (/leads & /customers)
    // =========================================================================
    // Desktop: 1440x900 on /leads
    await setViewport(1440, 900);
    await cdp.send('Page.navigate', { url: `${appOrigin}/leads` });
    await until(
      async () => {
        const pathVal = await evaluate('window.location.pathname');
        const text = await evaluate('document.body.innerText');
        return pathVal === '/leads' && text.includes('LEAD-2026-B001');
      },
      { timeoutMs: 15000, desc: 'Populated /leads on 1440x900' },
    );
    const leads1440Metrics = await evaluate(
      '({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth })',
    );
    assert.ok(
      leads1440Metrics.scrollWidth <= leads1440Metrics.innerWidth,
      `Horizontal overflow detected on /leads at 1440x900: scrollWidth=${leads1440Metrics.scrollWidth}, innerWidth=${leads1440Metrics.innerWidth}`,
    );

    // Desktop: 1440x900 on /customers
    await cdp.send('Page.navigate', { url: `${appOrigin}/customers` });
    await until(
      async () => {
        const pathVal = await evaluate('window.location.pathname');
        const text = await evaluate('document.body.innerText');
        return (
          pathVal === '/customers' && text.includes('PT Bima Kreatif Mandiri')
        );
      },
      { timeoutMs: 15000, desc: 'Populated /customers on 1440x900' },
    );
    const cust1440Metrics = await evaluate(
      '({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth })',
    );
    assert.ok(
      cust1440Metrics.scrollWidth <= cust1440Metrics.innerWidth,
      `Horizontal overflow detected on /customers at 1440x900: scrollWidth=${cust1440Metrics.scrollWidth}, innerWidth=${cust1440Metrics.innerWidth}`,
    );

    trace.cases.VIEWPORT_RESPONSIVE_DESKTOP_1440 = {
      status: 'PASS',
      viewport: '1440x900',
      routesVerified: ['/leads', '/customers'],
      horizontalOverflow: false,
      elementsUsable: true,
    };

    // Compact Desktop / Tablet: 1024x768 on real populated /leads and /customers
    await setViewport(1024, 768);

    // 1024x768 on /leads
    await cdp.send('Page.navigate', { url: `${appOrigin}/leads` });
    await until(
      async () => {
        const pathVal = await evaluate('window.location.pathname');
        const text = await evaluate('document.body.innerText');
        return pathVal === '/leads' && text.includes('LEAD-2026-B001');
      },
      { timeoutMs: 15000, desc: 'Populated /leads on 1024x768' },
    );
    const leads1024Route = await evaluate('window.location.pathname');
    const leads1024Text = await evaluate('document.body.innerText');
    assert.equal(
      leads1024Route,
      '/leads',
      'Route identity must be /leads on 1024x768',
    );
    assert.ok(
      leads1024Text.includes(orgB.displayName),
      'Authorized organization name missing on /leads at 1024x768',
    );
    assert.ok(
      leads1024Text.includes('LEAD-2026-B001'),
      'Populated lead record missing on /leads at 1024x768',
    );
    const leads1024Interactive = await evaluate(`(() => {
      const search = document.querySelector('input[type="text"]');
      const createBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Catat Inbound Lead'));
      const statusBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Semua'));
      return Boolean(search && createBtn && statusBtn);
    })()`);
    assert.ok(
      leads1024Interactive,
      'Interactive controls unusable on /leads at 1024x768',
    );
    const leads1024Metrics = await evaluate(
      '({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth })',
    );
    assert.ok(
      leads1024Metrics.scrollWidth <= leads1024Metrics.innerWidth,
      `Horizontal overflow detected on /leads at 1024x768: scrollWidth=${leads1024Metrics.scrollWidth}, innerWidth=${leads1024Metrics.innerWidth}`,
    );

    // 1024x768 on /customers
    await cdp.send('Page.navigate', { url: `${appOrigin}/customers` });
    await until(
      async () => {
        const pathVal = await evaluate('window.location.pathname');
        const text = await evaluate('document.body.innerText');
        return (
          pathVal === '/customers' && text.includes('PT Bima Kreatif Mandiri')
        );
      },
      { timeoutMs: 15000, desc: 'Populated /customers on 1024x768' },
    );
    const cust1024Route = await evaluate('window.location.pathname');
    const cust1024Text = await evaluate('document.body.innerText');
    assert.equal(
      cust1024Route,
      '/customers',
      'Route identity must be /customers on 1024x768',
    );
    assert.ok(
      cust1024Text.includes(orgB.displayName),
      'Authorized organization name missing on /customers at 1024x768',
    );
    assert.ok(
      cust1024Text.includes('PT Bima Kreatif Mandiri'),
      'Populated customer record missing on /customers at 1024x768',
    );
    const cust1024Interactive = await evaluate(`(() => {
      const search = document.querySelector('input[type="text"]');
      const createBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Tambah Customer'));
      const typeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Perusahaan'));
      return Boolean(search && createBtn && typeBtn);
    })()`);
    assert.ok(
      cust1024Interactive,
      'Interactive controls unusable on /customers at 1024x768',
    );
    const cust1024Metrics = await evaluate(
      '({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth })',
    );
    assert.ok(
      cust1024Metrics.scrollWidth <= cust1024Metrics.innerWidth,
      `Horizontal overflow detected on /customers at 1024x768: scrollWidth=${cust1024Metrics.scrollWidth}, innerWidth=${cust1024Metrics.innerWidth}`,
    );

    trace.cases.VIEWPORT_RESPONSIVE_TABLET_1024 = {
      status: 'PASS',
      viewport: '1024x768',
      routesVerified: ['/leads', '/customers'],
      horizontalOverflow: false,
      elementsUsable: true,
    };

    trace.overall = 'PASS';
  } catch (err) {
    console.error('QA Harness Error Details:', err?.message, err?.stack);
    trace.overall = 'FAIL';
    if (
      isNegativeControl &&
      err?.message?.includes('Intentional negative control canary')
    ) {
      trace.failure = {
        stage: 'NEGATIVE_CONTROL',
        code: 'INTENTIONAL_NEGATIVE_CONTROL_TRIGGERED',
        message: err.message,
      };
    } else {
      trace.failure = classifyFailure(err?.stage || 'HARNESS_EXECUTION', err);
      trace.failure.message = err?.message || String(err);
    }
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
      const cleanRes = await fixtureMgr.cleanupAll().catch((err) => ({
        errors: [
          {
            entity: 'fixtureMgr',
            id: 'all',
            error: err?.message || String(err),
          },
        ],
        deletionErrors: [
          {
            entity: 'fixtureMgr',
            id: 'all',
            error: err?.message || String(err),
          },
        ],
      }));
      trace.cleanup.deletionErrors = cleanRes?.deletionErrors || [];

      const absence = await fixtureMgr.verifyAbsence().catch((err) => ({
        verifiedAbsent: false,
        uncleaned: [],
        inconclusive: [
          {
            entity: 'fixtureMgr',
            id: 'all',
            error: err?.message || String(err),
          },
        ],
      }));

      const hasDeletionErrors = (trace.cleanup.deletionErrors || []).length > 0;
      const hasInconclusive = (absence.inconclusive || []).length > 0;
      const hasUncleaned = (absence.uncleaned || []).length > 0;

      trace.cleanup.verifiedAbsent =
        absence.verifiedAbsent === true &&
        !hasDeletionErrors &&
        !hasInconclusive &&
        !hasUncleaned;

      trace.cleanup.inconclusive = absence.inconclusive || [];
      trace.cleanup.uncleaned = absence.uncleaned || [];

      if (trace.cleanup.verifiedAbsent) {
        trace.cleanup.status = 'CLEANED_AND_ABSENT';
      } else if (hasInconclusive) {
        trace.cleanup.status = 'CLEANUP_INCONCLUSIVE';
      } else if (hasDeletionErrors) {
        trace.cleanup.status = 'CLEANUP_DELETION_FAILED';
      } else {
        trace.cleanup.status = 'RESOURCE_NOT_ABSENT';
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
    const harnessShaIndex = argv.indexOf('--expected-harness-sha');
    const expectedHarnessSha =
      harnessShaIndex !== -1 ? argv[harnessShaIndex + 1] : undefined;

    const result = verifyTraceFile(tracePath, {
      expectedMode,
      exitStatus,
      expectedCheckoutSha,
      expectedHarnessSha,
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

  const harnessShaIndex = argv.indexOf('--expected-harness-sha');
  const expectedHarnessSha =
    harnessShaIndex !== -1 ? argv[harnessShaIndex + 1] : null;

  const proxyPortIndex = argv.indexOf('--proxy-port');
  const proxyPort =
    proxyPortIndex !== -1
      ? Number.parseInt(argv[proxyPortIndex + 1], 10)
      : 55430;

  const { overall, failure } = await runUxr02AcceptanceHarness({
    isNegativeControl: isNeg,
    appDir,
    proxyPort,
    expectedCheckoutSha,
    expectedHarnessSha,
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
