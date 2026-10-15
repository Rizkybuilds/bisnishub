/**
 * MultiGraph Business OS — Multi-Role Browser UI Acceptance QA Harness
 *
 * Automates and verifies multi-role app shell and dashboard behavior:
 * - OWNER: full permitted dashboard shortcuts, active nav, TS/MG brand switching, logout
 * - SALES: prohibited exceptions shortcut absent, direct /exceptions denial, authorized /quotes access
 * - QC: prohibited quotes shortcut absent, direct /quotes denial
 * - Responsive viewports: 1440x900 & 1024x768, zero horizontal overflow, header bounding boxes
 * - Keyboard Tab progression and Enter activation
 * - Realistic founder and role display names
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
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
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

export { QaError };

export const ALLOWED_ROLES = Object.freeze(['OWNER', 'SALES', 'QC']);

export const EXPECTED_SHORTCUT_HREFS_BY_ROLE = Object.freeze({
  OWNER: Object.freeze([
    '/leads',
    '/customers',
    '/requirements',
    '/quotes',
    '/orders',
    '/production',
    '/vendors',
    '/shipments',
    '/inventory',
    '/procurement',
    '/exceptions',
    '/invoices',
    '/payments',
    '/ledger',
  ]),
  SALES: Object.freeze([
    '/leads',
    '/customers',
    '/requirements',
    '/quotes',
    '/orders',
    '/production',
    '/vendors',
    '/shipments',
    '/inventory',
    '/procurement',
    '/invoices',
    '/payments',
    '/ledger',
  ]),
  QC: Object.freeze([
    '/leads',
    '/customers',
    '/requirements',
    '/orders',
    '/production',
    '/vendors',
    '/shipments',
    '/inventory',
    '/procurement',
    '/invoices',
    '/payments',
    '/ledger',
  ]),
});

export const EXPECTED_UI_CASE_IDS = Object.freeze([
  'OWNER_LOGIN',
  'OWNER_DASHBOARD_1440',
  'OWNER_DASHBOARD_1024',
  'OWNER_HEADER_LAYOUT_1440',
  'OWNER_HEADER_LAYOUT_1024',
  'OWNER_NAV_LEADS',
  'OWNER_NAV_ORDERS',
  'OWNER_NAV_EXCEPTIONS',
  'OWNER_BRAND_SWITCH_MG',
  'OWNER_BRAND_RESTORE_TS',
  'OWNER_KEYBOARD_NAVIGATION',
  'OWNER_SHORTCUTS_DEEP_EQUALITY',
  'OWNER_LOGOUT',
  'POST_LOGOUT_PROTECTED_DENIAL',
  'SALES_LOGIN',
  'SALES_DASHBOARD',
  'SALES_AUTHORIZED_QUOTES_ACCESS',
  'SALES_DIRECT_EXCEPTIONS_DENIAL',
  'SALES_LOGOUT',
  'QC_LOGIN',
  'QC_DASHBOARD',
  'QC_DIRECT_QUOTES_DENIAL',
  'QC_LOGOUT',
  'FIXTURE_CLEANUP_VERIFICATION',
]);

const SYNTHETIC_UI_EMAIL_PATTERN =
  /^ci-ui-qa-[a-z]+-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}@example\.test$/i;

/**
 * Parses and strictly validates browser version provenance metadata obtained from CDP Browser.getVersion (Finding R5-F01).
 * Enforces an allowlisted subset (product, browserName, browserVersion, protocolVersion).
 * Rejects missing, empty, or placeholder values (such as 'unknown').
 */
export function parseAndValidateBrowserProvenance(versionInfo) {
  if (
    !versionInfo ||
    typeof versionInfo !== 'object' ||
    Array.isArray(versionInfo)
  ) {
    throw new QaError(
      'BROWSER_PROVENANCE',
      'BROWSER_IDENTITY_MISSING',
      'Browser identity payload must be a non-empty object',
    );
  }

  const product =
    typeof versionInfo.product === 'string' ? versionInfo.product.trim() : '';
  const protocolVersion =
    typeof versionInfo.protocolVersion === 'string'
      ? versionInfo.protocolVersion.trim()
      : '';

  if (!product || product.toLowerCase() === 'unknown') {
    throw new QaError(
      'BROWSER_PROVENANCE',
      'BROWSER_IDENTITY_INVALID',
      'Browser product is missing, empty, or placeholder',
    );
  }

  if (!protocolVersion || protocolVersion.toLowerCase() === 'unknown') {
    throw new QaError(
      'BROWSER_PROVENANCE',
      'BROWSER_IDENTITY_INVALID',
      'Browser protocolVersion is missing, empty, or placeholder',
    );
  }

  let browserName = product;
  let browserVersion = product;
  const slashIdx = product.indexOf('/');
  if (slashIdx !== -1) {
    browserName = product.slice(0, slashIdx).trim();
    browserVersion = product.slice(slashIdx + 1).trim();
  } else if (
    typeof versionInfo.version === 'string' &&
    versionInfo.version.trim()
  ) {
    browserVersion = versionInfo.version.trim();
  }

  if (!browserVersion || browserVersion.toLowerCase() === 'unknown') {
    throw new QaError(
      'BROWSER_PROVENANCE',
      'BROWSER_IDENTITY_INVALID',
      'Browser version is missing or placeholder',
    );
  }

  return {
    product,
    browserName,
    browserVersion,
    protocolVersion,
  };
}

/**
 * Tracks Network.responseReceived events emitted over Chrome DevTools Protocol (CDP) (Finding R5-F02).
 */
export class NavigationResponseTracker {
  constructor(cdp, appOrigin) {
    this.cdp = cdp;
    this.appOrigin = appOrigin;
    this.responses = [];
    this._onMessage = (evt) => {
      try {
        const raw =
          typeof evt.data === 'string'
            ? evt.data
            : evt.data?.toString?.() || (typeof evt === 'string' ? evt : '');
        if (!raw) return;
        const msg = JSON.parse(raw);
        if (msg.method === 'Network.responseReceived' && msg.params?.response) {
          const res = msg.params.response;
          const type = msg.params.type;
          this.responses.push({
            requestId: msg.params.requestId,
            type,
            url: res.url,
            status: typeof res.status === 'number' ? res.status : null,
            statusText: res.statusText || '',
            headers: res.headers || {},
            timestamp: Date.now(),
          });
        }
      } catch {}
    };

    if (this.cdp?.ws?.addEventListener) {
      this.cdp.ws.addEventListener('message', this._onMessage);
    }
  }

  clear() {
    this.responses.length = 0;
  }

  getResponses() {
    return [...this.responses];
  }

  stop() {
    if (this.cdp?.ws?.removeEventListener) {
      this.cdp.ws.removeEventListener('message', this._onMessage);
    }
  }
}

/**
 * Correlates observed HTTP responses with the expected target navigation route (Finding R5-F02).
 * Prioritizes authoritative CDP Network 'Document' responses over ambiguous asset/RSC fetches.
 * Validates consistency against PerformanceNavigationTiming if available.
 */
export function correlateNavigationResponse({
  responses = [],
  appOrigin = CANONICAL_APP_ORIGIN,
  targetPath,
  navTimingStatus = null,
}) {
  if (!targetPath || typeof targetPath !== 'string') {
    return {
      verified: false,
      httpStatus: null,
      source: 'INVALID_INPUT',
      code: 'HTTP_STATUS_NOT_VERIFIED',
      summary: 'Missing or invalid targetPath for response correlation',
    };
  }

  let expectedUrl;
  let expectedOrigin;
  try {
    expectedUrl = new URL(targetPath, appOrigin);
    expectedOrigin = expectedUrl.origin;
  } catch {
    return {
      verified: false,
      httpStatus: null,
      source: 'INVALID_INPUT',
      code: 'HTTP_STATUS_NOT_VERIFIED',
      summary: `Failed to construct valid target URL from ${appOrigin} and ${targetPath}`,
    };
  }

  // 1. Filter candidate responses matching origin and target pathname
  const matchingResponses = responses.filter((r) => {
    if (!r.url || typeof r.url !== 'string') return false;
    try {
      const parsed = new URL(r.url);
      return (
        parsed.origin === expectedOrigin &&
        parsed.pathname === expectedUrl.pathname
      );
    } catch {
      return false;
    }
  });

  // 2. Identify top-level Document responses (main HTML frame navigation)
  const documentResponses = matchingResponses.filter(
    (r) =>
      r.type === 'Document' && typeof r.status === 'number' && r.status > 0,
  );

  let observedHttpStatus = null;
  let source = 'NONE';

  if (documentResponses.length > 0) {
    const docRes = documentResponses[documentResponses.length - 1];
    observedHttpStatus = docRes.status;
    source = 'CDP_NETWORK';
  } else if (
    typeof navTimingStatus === 'number' &&
    Number.isInteger(navTimingStatus) &&
    navTimingStatus > 0
  ) {
    observedHttpStatus = navTimingStatus;
    source = 'PERFORMANCE_NAVIGATION_TIMING';
  }

  // 3. Detect contradictions if both CDP and NavigationTiming are valid numbers > 0
  if (
    documentResponses.length > 0 &&
    typeof navTimingStatus === 'number' &&
    Number.isInteger(navTimingStatus) &&
    navTimingStatus > 0 &&
    navTimingStatus !== documentResponses[documentResponses.length - 1].status
  ) {
    return {
      verified: false,
      httpStatus: null,
      source: 'CONTRADICTORY',
      code: 'HTTP_STATUS_CONTRADICTORY',
      summary: `CDP response status (${documentResponses[documentResponses.length - 1].status}) contradicted NavigationTiming status (${navTimingStatus}) for ${targetPath}`,
    };
  }

  if (
    observedHttpStatus === null ||
    typeof observedHttpStatus !== 'number' ||
    observedHttpStatus <= 0
  ) {
    return {
      verified: false,
      httpStatus: null,
      source,
      code: 'HTTP_STATUS_NOT_VERIFIED',
      summary: `Authoritative numeric HTTP response status could not be observed for ${targetPath}`,
    };
  }

  return {
    verified: true,
    httpStatus: observedHttpStatus,
    source,
    code: 'HTTP_STATUS_VERIFIED',
    summary: `Observed HTTP ${observedHttpStatus} for ${targetPath} via ${source}`,
  };
}

/**
 * Classifies an observed browser navigation to determine whether access was denied
 * or whether the page rendered in an authorized state.
 *
 * Distinguishes:
 * - AUTHORIZED_PAGE: HTTP 200, domain heading/content present, error boundary absent
 * - ERROR_BOUNDARY_500: Server error boundary rendered from thrown permission check, no domain data leaked
 * - EXPLICIT_403: Explicit HTTP 403 status or forbidden response, no domain data leaked
 * - ACCESS_DENIED_200: HTTP 200 containing access-denied UI alert without domain content
 * - ERROR_WITH_DATA_LEAK: Error state where domain data was nonetheless exposed (FAIL)
 * - UNEXPECTED_STATE: Unrecognized response code or layout (FAIL)
 */
export function classifyRouteDenial({
  responseStatus,
  pathname,
  pageText = '',
  hasDomainHeading = false,
  hasDomainContent = false,
  hasErrorBoundary = false,
  domainHeadingText = '',
}) {
  const normText = (pageText || '')
    .replace(/[\u2018\u2019]/g, "'")
    .toLowerCase();
  const headingMatch =
    hasDomainHeading ||
    (Boolean(domainHeadingText) && pageText.includes(domainHeadingText));

  // If domain heading is present or domain content is exposed:
  if (headingMatch || hasDomainContent) {
    if (responseStatus === 200 && !hasErrorBoundary) {
      return {
        denied: false,
        uiDenied: false,
        status: 'AUTHORIZED_PAGE',
        domainDataExposed: true,
        summary: `Authorized route rendered successfully with domain content at ${pathname}`,
      };
    }
    // If error boundary or non-200 but domain content was exposed:
    return {
      denied: false,
      uiDenied: false,
      status: 'ERROR_WITH_DATA_LEAK',
      domainDataExposed: true,
      summary: `Forbidden route ${pathname} encountered error but exposed domain data`,
    };
  }

  // Check for explicit 403
  if (
    responseStatus === 403 ||
    normText.includes('403 forbidden') ||
    normText.includes('akses ditolak: 403')
  ) {
    return {
      denied: true,
      uiDenied: true,
      status: 'EXPLICIT_403',
      domainDataExposed: false,
      summary: `Explicit 403 forbidden denial verified at ${pathname}`,
    };
  }

  // Check for 200 with access denied message and no domain content
  if (
    responseStatus === 200 &&
    (normText.includes('akses ditolak') ||
      normText.includes('unauthorized') ||
      normText.includes('tidak memiliki akses'))
  ) {
    return {
      denied: true,
      uiDenied: true,
      status: 'ACCESS_DENIED_200',
      domainDataExposed: false,
      summary: `Access denied notification rendered at ${pathname} without domain data`,
    };
  }

  // Check for explicit error boundary or denial indicator
  const hasExplicitDenialOrBoundary =
    hasErrorBoundary ||
    normText.includes("this page couldn't load") ||
    normText.includes('belum dapat dimuat') ||
    normText.includes('application error') ||
    normText.includes('akses ditolak') ||
    normText.includes('tidak memiliki akses') ||
    normText.includes('memiliki akses') ||
    normText.includes('unauthorized') ||
    normText.includes('forbidden');

  if (hasExplicitDenialOrBoundary) {
    return {
      denied: true,
      uiDenied: true,
      status: 'ERROR_BOUNDARY_500',
      domainDataExposed: false,
      summary: `Server-side permission denial rendered via error boundary at ${pathname}`,
    };
  }

  // Generic 500 without explicit denial/error boundary presentation:
  if (responseStatus === 500) {
    return {
      denied: false,
      uiDenied: false,
      status: 'UNHANDLED_SERVER_CRASH',
      domainDataExposed: false,
      summary: `Generic 500 server crash at ${pathname} without access denial or error boundary presentation`,
    };
  }

  // Unexpected state: e.g. 200 empty page without domain heading, or unexpected status code
  return {
    denied: false,
    uiDenied: false,
    status: 'UNEXPECTED_STATE',
    domainDataExposed: false,
    summary: `Unexpected response status ${responseStatus} or page state at ${pathname}`,
  };
}

/**
 * Creates a synthetic user fixture with the specified role in local Supabase.
 */
export async function createRoleFixture(
  serviceKey,
  roleCode,
  {
    api = CANONICAL_API_ORIGIN,
    env,
    fetchFn = fetch,
    signal,
    onRegistered,
  } = {},
) {
  assertLoopbackHttpOrigin(api, {
    stage: 'FIXTURE_CREATION',
    code: 'NONLOCAL_TARGET_BLOCKED',
    message: 'Refusing non-loopback Supabase API origin',
  });
  assertConsistentSupabaseEnv(api, env, {
    stage: 'FIXTURE_CREATION',
    code: 'NONLOCAL_TARGET_BLOCKED',
  });
  if (!ALLOWED_ROLES.includes(roleCode)) {
    throw new QaError(
      'FIXTURE_CREATION',
      'FIXTURE_CREATION_FAILED',
      `Unsupported synthetic fixture role: ${roleCode}`,
    );
  }
  if (typeof serviceKey !== 'string' || serviceKey.trim().length === 0) {
    throw new QaError(
      'FIXTURE_CREATION',
      'FIXTURE_CREATION_FAILED',
      'Synthetic fixture creation requires a valid service key',
    );
  }

  const email = `ci-ui-qa-${roleCode.toLowerCase()}-${randomUUID()}@example.test`;
  const password = randomBytes(32).toString('base64url');
  const displayNames = {
    OWNER: 'Rizky Pratama Kusuma Atmadja (Founder & Group Managing Director)',
    SALES: 'Siti Nurhaliza Rahmawati (Senior Enterprise Account Executive)',
    QC: 'Bambang Tri Utomo (Lead Garment Quality Assurance Inspector)',
  };
  const displayName = displayNames[roleCode] ?? `QA Synthetic ${roleCode} User`;

  const fixture = {
    roleCode,
    email,
    password,
    displayName,
    authUserId: null,
    profileId: null,
    organizationId: null,
    roleId: null,
    membershipCreated: false,
    cleanupCompleted: false,
  };

  try {
    // 1. Resolve organization (MultiGraph Group)
    const orgRows = await db(
      serviceKey,
      '/rest/v1/organizations?select=id&status=eq.ACTIVE&limit=1',
      {
        schema: 'app',
        api,
        env,
        fetchFn,
        signal,
        stage: 'FIXTURE_CREATION',
      },
    );
    const org = Array.isArray(orgRows) ? orgRows[0] : null;
    assert.ok(org?.id, 'Disposable MultiGraph Group organization not found');
    fixture.organizationId = org.id;

    // 2. Resolve role ID for roleCode
    const roleRows = await db(
      serviceKey,
      `/rest/v1/roles?select=id&organization_id=eq.${encodeURIComponent(org.id)}&code=eq.${encodeURIComponent(roleCode)}&limit=1`,
      {
        schema: 'app',
        api,
        env,
        fetchFn,
        signal,
        stage: 'FIXTURE_CREATION',
      },
    );
    const role = Array.isArray(roleRows) ? roleRows[0] : null;
    assert.ok(role?.id, `Disposable ${roleCode} role not found`);
    fixture.roleId = role.id;

    // 3. Create user in auth.users
    const authUser = await db(serviceKey, '/auth/v1/admin/users', {
      method: 'POST',
      body: {
        email,
        password,
        email_confirm: true,
      },
      api,
      env,
      fetchFn,
      signal,
      stage: 'FIXTURE_CREATION',
    });
    assert.ok(authUser?.id, 'Synthetic auth user creation failed');
    fixture.authUserId = authUser.id;
    if (typeof onRegistered === 'function') {
      onRegistered(fixture);
    }

    // 4. Create profile in app.users
    const profileRows = await db(serviceKey, '/rest/v1/users', {
      method: 'POST',
      schema: 'app',
      body: {
        auth_user_id: authUser.id,
        name: displayName,
        email,
        status: 'ACTIVE',
      },
      api,
      env,
      fetchFn,
      signal,
      stage: 'FIXTURE_CREATION',
    });
    const profile = Array.isArray(profileRows) ? profileRows[0] : profileRows;
    assert.ok(profile?.id, 'Synthetic user profile creation failed');
    fixture.profileId = profile.id;

    // 5. Create membership in app.organization_members
    await db(serviceKey, '/rest/v1/organization_members', {
      method: 'POST',
      schema: 'app',
      body: {
        organization_id: org.id,
        user_id: profile.id,
        role_id: role.id,
        status: 'ACTIVE',
      },
      api,
      env,
      fetchFn,
      signal,
      stage: 'FIXTURE_CREATION',
    });
    fixture.membershipCreated = true;

    return fixture;
  } catch (error) {
    await cleanupRoleFixture(serviceKey, fixture, { api, env, fetchFn }).catch(
      () => {},
    );
    throw error instanceof QaError
      ? error
      : new QaError(
          'FIXTURE_CREATION',
          'FIXTURE_CREATION_FAILED',
          error instanceof Error ? error.message : 'Fixture creation failed',
        );
  }
}

/**
 * Cleans up a synthetic user fixture with independent post-cleanup absence verification.
 */
export async function cleanupRoleFixture(
  serviceKey,
  fixture,
  { api = CANONICAL_API_ORIGIN, env, fetchFn = fetch } = {},
) {
  if (!fixture || typeof fixture !== 'object') {
    return { attempted: false, status: 'SKIPPED' };
  }
  if (!SYNTHETIC_UI_EMAIL_PATTERN.test(fixture.email ?? '')) {
    throw new QaError(
      'CLEANUP',
      'FIXTURE_CLEANUP_FAILED',
      'Refusing to delete non-synthetic email fixture',
    );
  }
  assertLoopbackHttpOrigin(api, {
    stage: 'CLEANUP',
    code: 'NONLOCAL_TARGET_BLOCKED',
  });

  let error = null;

  // 1. Delete organization membership
  if (fixture.profileId) {
    try {
      await db(
        serviceKey,
        `/rest/v1/organization_members?user_id=eq.${encodeURIComponent(fixture.profileId)}`,
        {
          method: 'DELETE',
          schema: 'app',
          api,
          env,
          fetchFn,
          stage: 'CLEANUP',
        },
      );
    } catch (e) {
      error = error ?? e;
    }

    // 2. Delete user profile
    try {
      await db(
        serviceKey,
        `/rest/v1/users?id=eq.${encodeURIComponent(fixture.profileId)}`,
        {
          method: 'DELETE',
          schema: 'app',
          api,
          env,
          fetchFn,
          stage: 'CLEANUP',
        },
      );
    } catch (e) {
      error = error ?? e;
    }
  }

  // 3. Delete auth user
  if (fixture.authUserId) {
    try {
      await db(serviceKey, `/auth/v1/admin/users/${fixture.authUserId}`, {
        method: 'DELETE',
        api,
        env,
        fetchFn,
        stage: 'CLEANUP',
      });
    } catch (e) {
      error = error ?? e;
    }
  }

  // 4. Independent post-cleanup verification of resource absence
  if (!error) {
    if (fixture.profileId) {
      try {
        const remainingMembers = await db(
          serviceKey,
          `/rest/v1/organization_members?user_id=eq.${encodeURIComponent(fixture.profileId)}&select=id`,
          { schema: 'app', api, env, fetchFn, stage: 'CLEANUP' },
        );
        if (Array.isArray(remainingMembers) && remainingMembers.length > 0) {
          throw new QaError(
            'CLEANUP',
            'FIXTURE_RESOURCE_NOT_ABSENT',
            `Organization membership record still present after deletion for profile ${fixture.profileId}`,
          );
        }

        const remainingProfiles = await db(
          serviceKey,
          `/rest/v1/users?id=eq.${encodeURIComponent(fixture.profileId)}&select=id`,
          { schema: 'app', api, env, fetchFn, stage: 'CLEANUP' },
        );
        if (Array.isArray(remainingProfiles) && remainingProfiles.length > 0) {
          throw new QaError(
            'CLEANUP',
            'FIXTURE_RESOURCE_NOT_ABSENT',
            `User profile record still present after deletion for profile ${fixture.profileId}`,
          );
        }
      } catch (e) {
        error = error ?? e;
      }
    }

    if (fixture.authUserId) {
      try {
        const authRes = await db(
          serviceKey,
          `/auth/v1/admin/users/${fixture.authUserId}`,
          {
            api,
            env,
            fetchFn,
            stage: 'CLEANUP',
            allowStatuses: [404],
            returnRawResponse: true,
          },
        );
        if (authRes && authRes.status !== 404) {
          throw new QaError(
            'CLEANUP',
            'FIXTURE_RESOURCE_NOT_ABSENT',
            `Auth user record still present after deletion for user ${fixture.authUserId} (status: ${authRes.status})`,
          );
        }
      } catch (e) {
        error = error ?? e;
      }
    }
  }

  if (error) {
    throw error instanceof QaError
      ? error
      : new QaError(
          'CLEANUP',
          'FIXTURE_CLEANUP_FAILED',
          error instanceof Error ? error.message : 'Fixture cleanup failed',
        );
  }

  fixture.cleanupCompleted = true;
  return { attempted: true, status: 'PASS', verifiedAbsent: true };
}

/**
 * Executes login in the browser via DOM form submission.
 */
async function performBrowserLogin(cdp, email, password) {
  await cdp.goto('/login', '/login');
  await until(
    () => cdp.eval('Boolean(document.querySelector(\'input[name="email"]\'))'),
    'Login form ready',
    30000,
  );

  const fillAndSubmit = await cdp.eval(`(() => {
    const form = document.querySelector('form');
    if (!form) return { success: false, reason: 'missing_form' };
    const put = (name, value) => {
      const input = form.querySelector('[name="' + name + '"]');
      if (!input) return false;
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')
        .set.call(input, value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    };
    if (!put('email', ${JSON.stringify(email)})) return { success: false, reason: 'missing_email' };
    if (!put('password', ${JSON.stringify(password)})) return { success: false, reason: 'missing_password' };
    const submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) return { success: false, reason: 'missing_submit' };
    form.requestSubmit(submitBtn);
    return { success: true };
  })()`);

  if (!fillAndSubmit?.success) {
    throw new QaError(
      'AUTH_ASSERTION',
      'AUTH_ASSERTION_FAILED',
      `Login form interaction failed: ${fillAndSubmit?.reason ?? 'unknown'}`,
    );
  }

  await until(
    async () => {
      const state = await cdp.eval(`(() => {
        const alert = document.querySelector('[role="alert"]');
        return {
          pathname: location.pathname,
          rejected:
            location.pathname === '/login' &&
            document.readyState !== 'loading' &&
            Boolean(alert),
          alertText: alert ? alert.textContent.trim() : null,
          authenticated: location.pathname === '/dashboard',
        };
      })()`);
      if (state.rejected) {
        throw new QaError(
          'AUTH_ASSERTION',
          'AUTH_ASSERTION_FAILED',
          `Login rejected on /login: ${state.alertText || 'unknown alert'}`,
        );
      }
      return state.authenticated;
    },
    'Login redirect to /dashboard',
    30000,
    { stage: 'AUTH_ASSERTION' },
  );
}

/**
 * Executes logout in the browser via header logout button.
 */
async function performBrowserLogout(cdp) {
  let clicked = await cdp.eval(`(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const logoutBtn = buttons.find(b => b.textContent.trim() === 'Keluar');
    if (!logoutBtn) return false;
    const form = logoutBtn.closest('form');
    if (form) {
      form.requestSubmit(logoutBtn);
    } else {
      logoutBtn.click();
    }
    return true;
  })()`);

  if (!clicked) {
    // Current page might be an error boundary without layout header; return to /dashboard
    await cdp.goto('/dashboard', '/dashboard');
    clicked = await cdp.eval(`(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const logoutBtn = buttons.find(b => b.textContent.trim() === 'Keluar');
      if (!logoutBtn) return false;
      const form = logoutBtn.closest('form');
      if (form) {
        form.requestSubmit(logoutBtn);
      } else {
        logoutBtn.click();
      }
      return true;
    })()`);
  }

  if (!clicked) {
    throw new QaError(
      'AUTH_ASSERTION',
      'AUTH_ASSERTION_FAILED',
      'Logout button not found in app header',
    );
  }

  await until(
    async () => {
      const pathname = await cdp.eval('location.pathname');
      return pathname === '/login';
    },
    'Logout redirect to /login',
    30000,
    { stage: 'AUTH_ASSERTION' },
  );
}

/**
 * Clicks a sidebar link directly in the browser DOM.
 */
async function clickSidebarLink(cdp, href) {
  const clicked = await cdp.eval(`(() => {
    const link = document.querySelector(\`aside.shell-sidebar a[href="\${${JSON.stringify(href)}}"]\`);
    if (!link) return false;
    link.click();
    return true;
  })()`);
  if (!clicked) {
    throw new QaError(
      'NAVIGATION',
      'NAVIGATION_FAILED',
      `Sidebar link ${href} not found for interactive click`,
    );
  }
  await until(
    async () => {
      const p = await cdp.eval('location.pathname');
      return p === href;
    },
    `Interactive navigation via click to ${href}`,
    15000,
  );
}

/**
 * Terminates a browser handle, closing DevTools and deleting the temporary profile.
 */
export async function terminateBrowser(browserHandle) {
  if (!browserHandle) return;
  const { browser, cdp, profile } = browserHandle;
  try {
    cdp?.close?.();
  } catch {
    // Suppress close error
  }
  if (browser) {
    await terminateSubprocess(browser, {
      initialSignal: 'SIGTERM',
      forceSignal: 'SIGKILL',
      graceMs: 2000,
    }).catch(() => {});
  }
  if (profile) {
    try {
      rmSync(profile, {
        recursive: true,
        force: true,
        maxRetries: 5,
        retryDelay: 100,
      });
    } catch {
      // Best-effort profile removal
    }
  }
}

/**
 * Builds the Next.js application in an isolated subprocess with provided environment variables.
 */
export function defaultBuildApp({
  env,
  workdir,
  spawnSyncFn = spawnSync,
} = {}) {
  const appWorkdir =
    workdir ?? path.resolve(fileURLToPath(new URL('../', import.meta.url)));
  const build = spawnSyncFn('pnpm', ['--filter', '@mgbos/app', 'build'], {
    cwd: appWorkdir,
    env,
    // Build output is intentionally suppressed: no environment or key values in CI logs.
    stdio: 'ignore',
    timeout: 180000,
    shell: process.platform === 'win32',
  });
  if (build.error?.code === 'ETIMEDOUT') {
    throw new QaError(
      'APP_BUILD',
      'BUILD_TIMED_OUT',
      'Isolated app build timed out',
    );
  }
  if (build.status !== 0) {
    throw new QaError(
      'APP_BUILD',
      'BUILD_FAILED',
      'Isolated app build failed',
      {
        exitCode: build.status ?? null,
        signal: build.signal ?? null,
      },
    );
  }
}

/**
 * Ensures the MGBOS Next.js application server is running and healthy.
 * Reuses existing running instance on loopback if available, otherwise starts one.
 */
export async function ensureAppServer({
  workdir,
  app = CANONICAL_APP_ORIGIN,
  env,
  signal,
  fetchFn = fetch,
  spawnFn = spawn,
  buildAppFn,
} = {}) {
  assertLoopbackHttpOrigin(app, { stage: 'APP_START' });
  try {
    const probe = await fetchFn(`${app}/health`, {
      signal: AbortSignal.timeout(1000),
    });
    if (probe.ok) {
      return { process: null, wasRunning: true };
    }
  } catch {
    // Expected when no prior server is listening on app port
  }

  const appWorkdir =
    workdir ?? path.resolve(fileURLToPath(new URL('../', import.meta.url)));

  if (buildAppFn) {
    await buildAppFn({ env, workdir: appWorkdir, signal });
  }

  const proc = spawnFn('pnpm', ['--filter', '@mgbos/app', 'start'], {
    cwd: appWorkdir,
    env: env ?? process.env,
    stdio: 'ignore',
    detached: process.platform !== 'win32',
    shell: process.platform === 'win32',
  });

  try {
    await until(
      async () => {
        if (proc.exitCode !== null || proc.signalCode !== null) {
          throw new QaError(
            'APP_START',
            'APP_START_FAILED',
            'Application server exited during startup',
            { exitCode: proc.exitCode, signal: proc.signalCode },
          );
        }
        const response = await fetchFn(`${app}/health`, {
          signal: AbortSignal.timeout(1500),
        });
        return response.ok;
      },
      'Local MGBOS health',
      30000,
      { signal, stage: 'APP_START' },
    );
    return { process: proc, wasRunning: false };
  } catch (error) {
    await terminateSubprocess(proc, {
      initialSignal: 'SIGTERM',
      forceSignal: 'SIGKILL',
      graceMs: 3000,
    }).catch(() => {});
    throw error;
  }
}

/**
 * Evaluates operational shortcuts present on /dashboard.
 */
async function inspectDashboardShortcuts(cdp) {
  return await cdp.eval(`(() => {
    const links = Array.from(document.querySelectorAll('main.shell-content a.sidebar-link, main a.sidebar-link'));
    return links.map(link => ({
      href: link.getAttribute('href'),
      text: (link.textContent || '').trim().replace(/\\s+/g, ' ')
    }));
  })()`);
}

/**
 * Evaluates active links in the sidebar.
 */
async function inspectSidebarLinks(cdp) {
  return await cdp.eval(`(() => {
    const links = Array.from(document.querySelectorAll('aside.shell-sidebar a.sidebar-link'));
    return links.map(link => ({
      href: link.getAttribute('href'),
      text: (link.textContent || '').trim().replace(/\\s+/g, ' '),
      active: link.classList.contains('active')
    }));
  })()`);
}

/**
 * Evaluates the active focused element and its focus-visible accessibility styling.
 */
export async function inspectActiveElement(cdp) {
  return await cdp.eval(`(() => {
    const el = document.activeElement;
    if (!el || el === document.body) {
      return {
        isBody: true,
        tag: el?.tagName || 'UNKNOWN',
        text: '',
        href: null,
        isInteractive: false,
        hasFocusVisible: false,
        hasObservableFocus: false,
      };
    }
    const tag = (el.tagName || '').toUpperCase();
    const isInteractive =
      ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(tag) ||
      el.hasAttribute('tabindex');
    const hasFocusVisible = el.matches(':focus-visible');
    const cs = window.getComputedStyle(el);
    const outlineVisible =
      cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth || '0') > 0;
    return {
      isBody: false,
      tag,
      text: (el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 30),
      href: el.getAttribute('href') || null,
      isInteractive,
      hasFocusVisible,
      outlineStyle: cs.outlineStyle,
      outlineWidth: cs.outlineWidth,
      outlineColor: cs.outlineColor,
      hasObservableFocus: hasFocusVisible || outlineVisible,
    };
  })()`);
}

/**
 * Runs the full multi-role browser acceptance QA harness.
 */
export async function runUiQaHarness({
  workdir,
  artifactDir,
  api = CANONICAL_API_ORIGIN,
  app = CANONICAL_APP_ORIGIN,
  isNegativeControl = false,
  signal,
  buildAppFn = defaultBuildApp,
} = {}) {
  assertLoopbackHttpOrigin(api, { stage: 'PREFLIGHT' });
  assertLoopbackHttpOrigin(app, { stage: 'PREFLIGHT' });

  const resolvedWorkdir = workdir
    ? path.resolve(workdir)
    : path.resolve(fileURLToPath(new URL('../', import.meta.url)));
  const defaultArtifactSubdir = path.join(
    '.qa-evidence',
    'browser-ui',
    isNegativeControl ? 'negative-control' : 'positive',
  );
  const resolvedArtifactDir = path.resolve(
    resolvedWorkdir,
    artifactDir ?? defaultArtifactSubdir,
  );
  mkdirSync(resolvedArtifactDir, { recursive: true });

  const git = spawnSync('git', ['rev-parse', 'HEAD'], {
    encoding: 'utf8',
    cwd: resolvedWorkdir,
  });
  const checkoutSha =
    git.status === 0
      ? git.stdout.trim()
      : (process.env.GITHUB_SHA ?? 'unknown');

  const evidence = {
    harness: 'mgbos-browser-ui-multirole-qa',
    version: '1.0.0',
    mode: isNegativeControl ? 'intentional-broken-control' : 'normal',
    target: { api, app },
    provenance: {
      checkoutSha,
      ciEventSha: process.env.GITHUB_SHA ?? null,
      nodeVersion: process.version,
      platform: process.platform,
      timestamp: new Date().toISOString(),
    },
    cases: {},
    cleanup: { attempted: false, status: 'NOT_RUN' },
    overall: 'PENDING',
    failure: null,
  };

  const status = localStatus({ api });
  const serviceKey = status.SERVICE_ROLE_KEY;

  let browserHandle = null;
  let navTracker = null;
  let appProcess = null;
  let appWasRunning = false;
  const createdFixtures = [];

  const registerFixture = (fixture) => {
    if (fixture && !createdFixtures.includes(fixture)) {
      createdFixtures.push(fixture);
    }
  };

  try {
    // 1. Ensure Application Server is running
    const appServer = await ensureAppServer({
      workdir: resolvedWorkdir,
      app,
      env: {
        ...process.env,
        NEXT_PUBLIC_SUPABASE_URL: api,
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: status.ANON_KEY,
        SUPABASE_SERVICE_ROLE_KEY: serviceKey,
        NEXT_TELEMETRY_DISABLED: '1',
      },
      signal,
      buildAppFn,
    });
    appProcess = appServer.process;
    appWasRunning = appServer.wasRunning;

    // 2. Launch Browser
    browserHandle = await startBrowser({ app, signal });
    const { cdp } = browserHandle;

    // Extract and bind Chromium version provenance via DevTools Protocol (Finding R5-F01)
    try {
      const versionInfo = await cdp.send('Browser.getVersion');
      evidence.provenance.browser =
        parseAndValidateBrowserProvenance(versionInfo);
    } catch (err) {
      throw new QaError(
        'BROWSER_PROVENANCE',
        'BROWSER_IDENTITY_MISSING',
        `Failed to retrieve browser identity via DevTools protocol: ${err?.message || err}`,
      );
    }

    navTracker = new NavigationResponseTracker(cdp, app);

    // 3. Provision synthetic multi-role fixtures with immediate registration
    const ownerFixture = await createRoleFixture(serviceKey, 'OWNER', {
      api,
      signal,
      onRegistered: registerFixture,
    });
    registerFixture(ownerFixture);

    const salesFixture = await createRoleFixture(serviceKey, 'SALES', {
      api,
      signal,
      onRegistered: registerFixture,
    });
    registerFixture(salesFixture);

    const qcFixture = await createRoleFixture(serviceKey, 'QC', {
      api,
      signal,
      onRegistered: registerFixture,
    });
    registerFixture(qcFixture);

    // ==========================================
    // SCENARIO 1: OWNER
    // ==========================================
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await performBrowserLogin(cdp, ownerFixture.email, ownerFixture.password);
    evidence.cases.OWNER_LOGIN = { status: 'PASS', role: 'OWNER' };

    // Wait for dashboard shortcuts to render
    await until(
      async () => {
        const sc = await inspectDashboardShortcuts(cdp);
        return sc.length > 0;
      },
      'OWNER dashboard shortcuts rendered',
      15000,
    );

    // Inspect 1440x900 Dashboard
    const ownerShortcuts = await inspectDashboardShortcuts(cdp);
    const ownerShortcutHrefs = ownerShortcuts
      .map((s) => s.href)
      .filter((h) => h !== '/dashboard');
    const ownerExpected = EXPECTED_SHORTCUT_HREFS_BY_ROLE.OWNER;

    // Deep equality check for shortcuts
    const actualOwnerSorted = [...ownerShortcutHrefs].sort();
    const expectedOwnerSorted = [...ownerExpected].sort();
    assert.deepEqual(
      actualOwnerSorted,
      expectedOwnerSorted,
      'OWNER shortcuts must match expected list with deep equality',
    );
    evidence.cases.OWNER_SHORTCUTS_DEEP_EQUALITY = {
      status: 'PASS',
      shortcutsCount: actualOwnerSorted.length,
    };

    const owner1440Overflow = await cdp.eval(
      'document.documentElement.scrollWidth > window.innerWidth',
    );
    assert.equal(
      owner1440Overflow,
      false,
      'OWNER 1440px dashboard has horizontal overflow',
    );
    evidence.cases.OWNER_DASHBOARD_1440 = {
      status: 'PASS',
      shortcutsCount: ownerShortcutHrefs.length,
      hasOverflow: owner1440Overflow,
    };

    // Header layout bounding boxes at 1440x900
    const owner1440HeaderLayout = await cdp.eval(`(() => {
      const header = document.querySelector('header.shell-header, header');
      if (!header) return { valid: false, reason: 'missing_header' };
      const headerRect = header.getBoundingClientRect();
      const brandBtns = Array.from(document.querySelectorAll('button.brand-btn'));
      const logoutBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Keluar');

      const brandBtnsValid = brandBtns.length > 0 && brandBtns.every(b => {
        const r = b.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.right <= window.innerWidth && r.left >= 0;
      });

      const logoutBtnValid = Boolean(logoutBtn && (() => {
        const r = logoutBtn.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.right <= window.innerWidth && r.left >= 0;
      })());

      const overflow = document.documentElement.scrollWidth > window.innerWidth;

      return {
        valid: brandBtnsValid && logoutBtnValid && !overflow,
        headerWidth: headerRect.width,
        headerHeight: headerRect.height,
        brandButtonsCount: brandBtns.length,
        brandBtnsValid,
        logoutBtnValid,
        overflow,
      };
    })()`);
    assert.equal(
      owner1440HeaderLayout.valid,
      true,
      `1440px Header layout invalid: ${JSON.stringify(owner1440HeaderLayout)}`,
    );
    evidence.cases.OWNER_HEADER_LAYOUT_1440 = {
      status: 'PASS',
      ...owner1440HeaderLayout,
    };

    // Inspect 1024x768 Dashboard (Responsive)
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1024,
      height: 768,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await cdp.goto('/dashboard', '/dashboard');
    const owner1024Overflow = await cdp.eval(
      'document.documentElement.scrollWidth > window.innerWidth',
    );
    assert.equal(
      owner1024Overflow,
      false,
      'OWNER 1024px dashboard has horizontal overflow',
    );
    evidence.cases.OWNER_DASHBOARD_1024 = {
      status: 'PASS',
      hasOverflow: owner1024Overflow,
    };

    // Header layout bounding boxes at 1024x768
    const owner1024HeaderLayout = await cdp.eval(`(() => {
      const header = document.querySelector('header.shell-header, header');
      if (!header) return { valid: false, reason: 'missing_header' };
      const brandBtns = Array.from(document.querySelectorAll('button.brand-btn'));
      const logoutBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Keluar');

      const brandBtnsValid = brandBtns.length > 0 && brandBtns.every(b => {
        const r = b.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.right <= window.innerWidth && r.left >= 0;
      });

      const logoutBtnValid = Boolean(logoutBtn && (() => {
        const r = logoutBtn.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.right <= window.innerWidth && r.left >= 0;
      })());

      const overflow = document.documentElement.scrollWidth > window.innerWidth;

      return {
        valid: brandBtnsValid && logoutBtnValid && !overflow,
        brandBtnsValid,
        logoutBtnValid,
        overflow,
      };
    })()`);
    assert.equal(
      owner1024HeaderLayout.valid,
      true,
      `1024px Header layout invalid: ${JSON.stringify(owner1024HeaderLayout)}`,
    );
    evidence.cases.OWNER_HEADER_LAYOUT_1024 = {
      status: 'PASS',
      ...owner1024HeaderLayout,
    };

    // Restore 1440x900 for navigation walkthrough
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    // Navigate Leads via interactive sidebar link click
    await clickSidebarLink(cdp, '/leads');
    const leadsSidebar = await inspectSidebarLinks(cdp);
    const leadsActive = leadsSidebar.find((l) => l.href === '/leads')?.active;
    assert.equal(leadsActive, true, 'Sidebar /leads link is not active');
    evidence.cases.OWNER_NAV_LEADS = {
      status: 'PASS',
      route: '/leads',
      clicked: true,
    };

    // Navigate Orders via interactive sidebar link click
    await clickSidebarLink(cdp, '/orders');
    const ordersSidebar = await inspectSidebarLinks(cdp);
    const ordersActive = ordersSidebar.find(
      (l) => l.href === '/orders',
    )?.active;
    assert.equal(ordersActive, true, 'Sidebar /orders link is not active');
    evidence.cases.OWNER_NAV_ORDERS = {
      status: 'PASS',
      route: '/orders',
      clicked: true,
    };

    // Navigate Exceptions via interactive sidebar link click
    await clickSidebarLink(cdp, '/exceptions');
    const exSidebar = await inspectSidebarLinks(cdp);
    const exActive = exSidebar.find((l) => l.href === '/exceptions')?.active;
    assert.equal(exActive, true, 'Sidebar /exceptions link is not active');
    evidence.cases.OWNER_NAV_EXCEPTIONS = {
      status: 'PASS',
      route: '/exceptions',
      clicked: true,
    };

    // Brand Switch: TS -> MG
    await cdp.goto('/dashboard', '/dashboard');
    const switchedToMg = await cdp.eval(`(() => {
      const buttons = Array.from(document.querySelectorAll('button.brand-btn'));
      const mgBtn = buttons.find(b => b.textContent.trim() === 'MG');
      if (!mgBtn) return false;
      const form = mgBtn.closest('form');
      if (form) {
        form.requestSubmit(mgBtn);
      } else {
        mgBtn.click();
      }
      return true;
    })()`);
    assert.equal(switchedToMg, true, 'MG brand switch button not found');
    await until(
      async () => {
        const activeBrand = await cdp.eval(
          "document.querySelector('button.brand-btn.active')?.textContent.trim()",
        );
        return activeBrand === 'MG';
      },
      'Brand switch to MG',
      20000,
    );

    const mgSidebar = await inspectSidebarLinks(cdp);
    const hasDesignsInMg = mgSidebar.some((l) => l.href === '/designs');
    assert.equal(
      hasDesignsInMg,
      false,
      'Library Desain (/designs) must be omitted for brand MG',
    );
    evidence.cases.OWNER_BRAND_SWITCH_MG = {
      status: 'PASS',
      activeBrand: 'MG',
      designsOmitted: true,
    };

    // Brand Restore: MG -> TS
    const switchedToTs = await cdp.eval(`(() => {
      const buttons = Array.from(document.querySelectorAll('button.brand-btn'));
      const tsBtn = buttons.find(b => b.textContent.trim() === 'TS');
      if (!tsBtn) return false;
      const form = tsBtn.closest('form');
      if (form) {
        form.requestSubmit(tsBtn);
      } else {
        tsBtn.click();
      }
      return true;
    })()`);
    assert.equal(switchedToTs, true, 'TS brand switch button not found');
    await until(
      async () => {
        const activeBrand = await cdp.eval(
          "document.querySelector('button.brand-btn.active')?.textContent.trim()",
        );
        return activeBrand === 'TS';
      },
      'Brand restore to TS',
      20000,
    );

    const tsSidebar = await inspectSidebarLinks(cdp);
    const hasDesignsInTs = tsSidebar.some((l) => l.href === '/designs');
    assert.equal(
      hasDesignsInTs,
      true,
      'Library Desain (/designs) must be present for brand TS',
    );
    evidence.cases.OWNER_BRAND_RESTORE_TS = {
      status: 'PASS',
      activeBrand: 'TS',
      designsRestored: true,
    };

    // Visible Keyboard Tab progression and Enter activation
    await cdp.eval(
      'if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur(); document.body.focus();',
    );
    const tabProgression = [];
    for (let i = 0; i < 3; i++) {
      await cdp.send('Input.dispatchKeyEvent', {
        type: 'keyDown',
        key: 'Tab',
        code: 'Tab',
        windowsVirtualKeyCode: 9,
      });
      await cdp.send('Input.dispatchKeyEvent', {
        type: 'keyUp',
        key: 'Tab',
        code: 'Tab',
        windowsVirtualKeyCode: 9,
      });
      const elInfo = await inspectActiveElement(cdp);
      tabProgression.push(elInfo);
    }
    assert.equal(
      tabProgression.length,
      3,
      'Must record exactly 3 Tab progression steps',
    );
    assert.ok(
      tabProgression.every((p) => !p.isBody && p.isInteractive),
      'Keyboard Tab progression failed to move focus through interactive elements',
    );

    // Verify actual progression: each Tab step moves to a distinct element
    for (let i = 1; i < tabProgression.length; i++) {
      const prev = tabProgression[i - 1];
      const curr = tabProgression[i];
      const isDistinct =
        prev.tag !== curr.tag ||
        prev.text !== curr.text ||
        prev.href !== curr.href;
      assert.ok(
        isDistinct,
        `Tab step ${i + 1} must move focus to a distinct interactive element (step ${i}: ${prev.tag}[${prev.text}], step ${i + 1}: ${curr.tag}[${curr.text}])`,
      );
    }

    // Verify observable :focus-visible styling or outline on all focused elements
    assert.ok(
      tabProgression.every((p) => p.hasObservableFocus),
      'All focused elements in keyboard progression must display observable :focus-visible styling or outline',
    );

    // Verify target element for Enter activation:
    // Natural Tab sequence: Topbar Link (step 1) -> Brand TS (step 2) -> Brand MG (step 3)
    let focusedOnMg =
      tabProgression[2]?.tag === 'BUTTON' && tabProgression[2]?.text === 'MG';
    if (!focusedOnMg) {
      const currentActive = await inspectActiveElement(cdp);
      if (currentActive.tag === 'BUTTON' && currentActive.text === 'MG') {
        focusedOnMg = true;
      }
    }
    assert.ok(
      focusedOnMg,
      `Keyboard progression must reach the MG brand button control (observed: ${tabProgression[2]?.tag}[${tabProgression[2]?.text}])`,
    );

    // Enter activation directly on the naturally focused MG button
    await cdp.send('Input.dispatchKeyEvent', {
      type: 'keyDown',
      key: 'Enter',
      code: 'Enter',
      windowsVirtualKeyCode: 13,
      text: '\r',
      unmodifiedText: '\r',
    });
    await cdp.send('Input.dispatchKeyEvent', {
      type: 'keyUp',
      key: 'Enter',
      code: 'Enter',
      windowsVirtualKeyCode: 13,
    });

    await until(
      async () => {
        const activeBrand = await cdp.eval(
          "document.querySelector('button.brand-btn.active')?.textContent.trim()",
        );
        return activeBrand === 'MG';
      },
      'Enter key activation on brand switch button',
      15000,
    );
    evidence.cases.OWNER_KEYBOARD_NAVIGATION = {
      status: 'PASS',
      tabProgressionCount: tabProgression.length,
      tabElements: tabProgression.map((p) => ({
        tag: p.tag,
        text: p.text,
        isInteractive: p.isInteractive,
        hasObservableFocus: p.hasObservableFocus,
        hasFocusVisible: p.hasFocusVisible,
      })),
      enterActivated: true,
      activatedBrand: 'MG',
    };

    // Logout OWNER
    await performBrowserLogout(cdp);
    evidence.cases.OWNER_LOGOUT = { status: 'PASS' };

    // Post-Logout Protected Route Denial:
    await cdp.send('Page.navigate', { url: `${app}/dashboard` });
    await until(
      async () => {
        const p = await cdp.eval('location.pathname');
        return p === '/login';
      },
      'Post-logout access to /dashboard redirected to /login',
      15000,
    );
    const dashboardExposed = await cdp.eval(
      "Boolean(document.querySelector('main.shell-content, aside.shell-sidebar'))",
    );
    assert.equal(
      dashboardExposed,
      false,
      'Post-logout unauthenticated access must not expose dashboard shell',
    );
    const cookies = await cdp.eval('document.cookie');
    assert.ok(
      !cookies.includes('sb-') && !cookies.includes('access_token'),
      'Post-logout must clear session cookies',
    );
    evidence.cases.POST_LOGOUT_PROTECTED_DENIAL = {
      status: 'PASS',
      redirectedToLogin: true,
      dashboardNotExposed: true,
      sessionCookiesCleared: true,
    };

    // ==========================================
    // SCENARIO 2: SALES
    // ==========================================
    await performBrowserLogin(cdp, salesFixture.email, salesFixture.password);
    evidence.cases.SALES_LOGIN = { status: 'PASS', role: 'SALES' };

    // Wait for dashboard shortcuts to render
    await until(
      async () => {
        const sc = await inspectDashboardShortcuts(cdp);
        return sc.length > 0;
      },
      'SALES dashboard shortcuts rendered',
      15000,
    );

    const salesShortcuts = await inspectDashboardShortcuts(cdp);
    const salesShortcutHrefs = salesShortcuts
      .map((s) => s.href)
      .filter((h) => h !== '/dashboard');

    const salesHasExceptionsShortcut =
      salesShortcutHrefs.includes('/exceptions');

    // Intentional negative control verification
    if (isNegativeControl) {
      throw new QaError(
        'QA_EXECUTION',
        'INTENTIONAL_NEGATIVE_CONTROL_TRIGGERED',
        'Intentional negative control triggered: broken shortcut assertion simulation',
      );
    }

    assert.equal(
      salesHasExceptionsShortcut,
      false,
      'SALES must NOT have /exceptions shortcut on dashboard',
    );

    const actualSalesSorted = [...salesShortcutHrefs].sort();
    const expectedSalesSorted = [
      ...EXPECTED_SHORTCUT_HREFS_BY_ROLE.SALES,
    ].sort();
    assert.deepEqual(
      actualSalesSorted,
      expectedSalesSorted,
      'SALES shortcuts must match expected list with deep equality',
    );

    const salesSidebar = await inspectSidebarLinks(cdp);
    const salesHasExceptionsInSidebar = salesSidebar.some(
      (l) => l.href === '/exceptions',
    );
    assert.equal(
      salesHasExceptionsInSidebar,
      false,
      'SALES must NOT have /exceptions in sidebar',
    );
    evidence.cases.SALES_DASHBOARD = {
      status: 'PASS',
      shortcutsCount: salesShortcutHrefs.length,
      exceptionsOmitted: true,
      deepEquality: true,
    };

    // SALES authorized comparison: visits /quotes (authorized for SALES)
    await cdp.goto('/quotes', '/quotes');
    const salesQuotesInspection = await cdp.eval(`(() => {
      const navEntry = performance.getEntriesByType('navigation')[0];
      const responseStatus = navEntry?.responseStatus || 200;
      const pageText = document.body ? (document.body.innerText || '') : '';
      const h1Text = Array.from(document.querySelectorAll('h1')).map(h => h.textContent.trim()).join(' ');
      const hasDomainHeading = h1Text.includes('Penawaran & HPP');
      const hasQuoteForm = Boolean(document.querySelector('details summary'));
      return {
        responseStatus,
        pathname: location.pathname,
        pageText: pageText.slice(0, 500),
        hasDomainHeading,
        hasDomainContent: hasQuoteForm,
        hasErrorBoundary: false,
      };
    })()`);
    const salesQuotesClassified = classifyRouteDenial({
      ...salesQuotesInspection,
      domainHeadingText: 'Penawaran & HPP',
    });
    assert.equal(
      salesQuotesClassified.denied,
      false,
      'SALES must be authorized to access /quotes',
    );
    assert.equal(
      salesQuotesInspection.hasDomainHeading,
      true,
      'SALES must see Penawaran & HPP heading',
    );
    evidence.cases.SALES_AUTHORIZED_QUOTES_ACCESS = {
      status: 'PASS',
      route: '/quotes',
      authorized: true,
      domainHeadingPresent: true,
    };

    // SALES direct /exceptions route denial
    navTracker.clear();
    await cdp.send('Page.navigate', { url: `${app}/exceptions` });
    await until(
      async () => {
        const state = await cdp.eval(`({
          pathname: location.pathname,
          ready: document.readyState,
          bodyText: document.body ? (document.body.innerText || '').trim() : ''
        })`);
        return (
          state.pathname === '/exceptions' &&
          state.ready !== 'loading' &&
          state.bodyText.length > 0
        );
      },
      'SALES direct navigation to /exceptions completed and rendered',
      15000,
    );

    const salesExInspection = await cdp.eval(`(() => {
      const navEntry = performance.getEntriesByType('navigation')[0];
      const responseStatus = navEntry?.responseStatus || 0;
      const pageText = document.body ? (document.body.innerText || '') : '';
      const h1Text = Array.from(document.querySelectorAll('h1')).map(h => h.textContent.trim()).join(' ');
      const hasDomainHeading = h1Text.includes('Operational Exceptions') || h1Text.includes('Pusat Abnormalitas');
      const hasDataTable = Boolean(document.querySelector('table.data-table, .exception-card, [data-exception-id]'));
      const hasErrorBoundary =
        Boolean(
          document.querySelector('h1.next-error-h1, [data-nextjs-dialog]'),
        ) ||
        pageText.includes("This page couldn't load") ||
        pageText.includes('This page couldn’t load') ||
        pageText.includes('A server error occurred') ||
        pageText.includes('belum dapat dimuat') ||
        pageText.includes('Application error') ||
        pageText.includes('Internal Server Error') ||
        pageText.includes('akses ditolak');
      return {
        responseStatus,
        pathname: location.pathname,
        pageText: pageText.slice(0, 1000),
        hasDomainHeading,
        hasDomainContent: hasDataTable,
        hasErrorBoundary,
      };
    })()`);

    const correlatedSalesExResponse = correlateNavigationResponse({
      responses: navTracker.getResponses(),
      appOrigin: app,
      targetPath: '/exceptions',
      navTimingStatus: salesExInspection.responseStatus,
    });

    if (!correlatedSalesExResponse.verified) {
      throw new QaError(
        'ROUTE_DENIAL',
        correlatedSalesExResponse.code,
        correlatedSalesExResponse.summary,
      );
    }

    const salesExDenial = classifyRouteDenial({
      ...salesExInspection,
      responseStatus: correlatedSalesExResponse.httpStatus,
      domainHeadingText: 'Operational Exceptions',
    });

    assert.equal(
      salesExDenial.denied,
      true,
      `SALES /exceptions must be denied: ${salesExDenial.summary}`,
    );
    assert.equal(
      salesExDenial.domainDataExposed,
      false,
      'SALES /exceptions must not expose domain data',
    );

    evidence.cases.SALES_DIRECT_EXCEPTIONS_DENIAL = {
      status: 'PASS',
      route: '/exceptions',
      uiDenied: true,
      observedResponse: salesExDenial.status,
      uiClassifier: salesExDenial.status,
      httpStatus: correlatedSalesExResponse.httpStatus,
      httpStatusVerified: true,
      domainDataExposed: false,
    };

    await performBrowserLogout(cdp);
    evidence.cases.SALES_LOGOUT = { status: 'PASS' };

    // ==========================================
    // SCENARIO 3: QC
    // ==========================================
    await performBrowserLogin(cdp, qcFixture.email, qcFixture.password);
    evidence.cases.QC_LOGIN = { status: 'PASS', role: 'QC' };

    // Wait for dashboard shortcuts to render
    await until(
      async () => {
        const sc = await inspectDashboardShortcuts(cdp);
        return sc.length > 0;
      },
      'QC dashboard shortcuts rendered',
      15000,
    );

    const qcShortcuts = await inspectDashboardShortcuts(cdp);
    const qcShortcutHrefs = qcShortcuts
      .map((s) => s.href)
      .filter((h) => h !== '/dashboard');
    const qcHasQuotesShortcut = qcShortcutHrefs.includes('/quotes');
    assert.equal(
      qcHasQuotesShortcut,
      false,
      'QC must NOT have /quotes shortcut on dashboard',
    );

    const actualQcSorted = [...qcShortcutHrefs].sort();
    const expectedQcSorted = [...EXPECTED_SHORTCUT_HREFS_BY_ROLE.QC].sort();
    assert.deepEqual(
      actualQcSorted,
      expectedQcSorted,
      'QC shortcuts must match expected list with deep equality',
    );

    const qcSidebar = await inspectSidebarLinks(cdp);
    const qcHasQuotesInSidebar = qcSidebar.some((l) => l.href === '/quotes');
    assert.equal(
      qcHasQuotesInSidebar,
      false,
      'QC must NOT have /quotes in sidebar',
    );
    evidence.cases.QC_DASHBOARD = {
      status: 'PASS',
      shortcutsCount: qcShortcutHrefs.length,
      quotesOmitted: true,
      deepEquality: true,
    };

    // QC direct /quotes route denial
    navTracker.clear();
    await cdp.send('Page.navigate', { url: `${app}/quotes` });
    await until(
      async () => {
        const state = await cdp.eval(`({
          pathname: location.pathname,
          ready: document.readyState,
          bodyText: document.body ? (document.body.innerText || '').trim() : ''
        })`);
        return (
          state.pathname === '/quotes' &&
          state.ready !== 'loading' &&
          state.bodyText.length > 0
        );
      },
      'QC direct navigation to /quotes completed and rendered',
      15000,
    );

    const qcQuotesInspection = await cdp.eval(`(() => {
      const navEntry = performance.getEntriesByType('navigation')[0];
      const responseStatus = navEntry?.responseStatus || 0;
      const pageText = document.body ? (document.body.innerText || '') : '';
      const h1Text = Array.from(document.querySelectorAll('h1')).map(h => h.textContent.trim()).join(' ');
      const hasDomainHeading = h1Text.includes('Penawaran & HPP');
      const hasQuoteForm = Boolean(document.querySelector('details summary, form[action*="quote"], [data-quote-id]'));
      const hasErrorBoundary =
        Boolean(
          document.querySelector('h1.next-error-h1, [data-nextjs-dialog]'),
        ) ||
        pageText.includes("This page couldn't load") ||
        pageText.includes('This page couldn’t load') ||
        pageText.includes('A server error occurred') ||
        pageText.includes('belum dapat dimuat') ||
        pageText.includes('Application error') ||
        pageText.includes('Internal Server Error') ||
        pageText.includes('akses ditolak') ||
        pageText.includes('memiliki akses');
      return {
        responseStatus,
        pathname: location.pathname,
        pageText: pageText.slice(0, 1000),
        hasDomainHeading,
        hasDomainContent: hasQuoteForm,
        hasErrorBoundary,
      };
    })()`);

    const correlatedQcQuotesResponse = correlateNavigationResponse({
      responses: navTracker.getResponses(),
      appOrigin: app,
      targetPath: '/quotes',
      navTimingStatus: qcQuotesInspection.responseStatus,
    });

    if (!correlatedQcQuotesResponse.verified) {
      throw new QaError(
        'ROUTE_DENIAL',
        correlatedQcQuotesResponse.code,
        correlatedQcQuotesResponse.summary,
      );
    }

    const qcQuotesDenial = classifyRouteDenial({
      ...qcQuotesInspection,
      responseStatus: correlatedQcQuotesResponse.httpStatus,
      domainHeadingText: 'Penawaran & HPP',
    });

    assert.equal(
      qcQuotesDenial.denied,
      true,
      `QC /quotes must be denied: ${qcQuotesDenial.summary}`,
    );
    assert.equal(
      qcQuotesDenial.domainDataExposed,
      false,
      'QC /quotes must not expose domain data',
    );

    evidence.cases.QC_DIRECT_QUOTES_DENIAL = {
      status: 'PASS',
      route: '/quotes',
      uiDenied: true,
      observedResponse: qcQuotesDenial.status,
      uiClassifier: qcQuotesDenial.status,
      httpStatus: correlatedQcQuotesResponse.httpStatus,
      httpStatusVerified: true,
      domainDataExposed: false,
    };

    await performBrowserLogout(cdp);
    evidence.cases.QC_LOGOUT = { status: 'PASS' };

    evidence.overall = 'PASS';
  } catch (error) {
    evidence.overall = 'FAIL';
    const isIntentionalNegative =
      error instanceof QaError &&
      error.code === 'INTENTIONAL_NEGATIVE_CONTROL_TRIGGERED';

    if (isIntentionalNegative) {
      evidence.failure = {
        stage: error?.stage || 'QA_EXECUTION',
        code: 'INTENTIONAL_NEGATIVE_CONTROL_TRIGGERED',
        message:
          error instanceof Error
            ? error.message
            : 'Intentional negative control triggered: broken shortcut assertion simulation',
      };
    } else {
      evidence.failure = classifyFailure(
        'QA_EXECUTION',
        error instanceof Error ? error : new Error(String(error)),
      );
      if (error instanceof Error && error.message) {
        evidence.failure.message = error.message;
      }
    }
  } finally {
    if (navTracker) {
      navTracker.stop();
    }

    // Teardown Browser
    if (browserHandle) {
      await terminateBrowser(browserHandle);
    }

    // Teardown Application Server if spawned by harness
    if (appProcess && !appWasRunning) {
      try {
        await terminateSubprocess(appProcess, {
          initialSignal: 'SIGTERM',
          forceSignal: 'SIGKILL',
          graceMs: 3000,
        });
      } catch {
        // Suppress teardown errors
      }
    }

    // Teardown synthetic fixtures with independent absence verification
    let allCleaned = true;
    for (const fix of createdFixtures) {
      try {
        await cleanupRoleFixture(serviceKey, fix, { api });
      } catch (err) {
        allCleaned = false;
        evidence.failure = evidence.failure ?? classifyFailure('CLEANUP', err);
      }
    }
    evidence.cleanup = {
      attempted: createdFixtures.length > 0,
      status: allCleaned ? 'PASS' : 'FAIL',
      fixturesCount: createdFixtures.length,
      verifiedAbsent: allCleaned,
    };
    evidence.cases.FIXTURE_CLEANUP_VERIFICATION = {
      status: allCleaned ? 'PASS' : 'FAIL',
      fixturesCleaned: createdFixtures.length,
      verifiedAbsent: allCleaned,
    };

    if (!allCleaned) {
      evidence.overall = 'FAIL';
      evidence.failure = evidence.failure ?? {
        stage: 'CLEANUP',
        code: 'FIXTURE_CLEANUP_FAILED',
        message: 'Fixture cleanup failed to remove all synthetic records',
      };
    }

    // Persist sanitized trace
    try {
      const traceFile = path.join(resolvedArtifactDir, 'trace.json');
      const forbiddenValues = [
        serviceKey,
        status?.ANON_KEY,
        ...createdFixtures.flatMap((f) => [f.password, f.email]),
      ].filter(Boolean);
      const serialized = `${assertSanitizedEvidence(evidence, forbiddenValues)}\n`;
      const dir = path.dirname(traceFile);
      mkdirSync(dir, { recursive: true });
      const tempPath = `${traceFile}.tmp-${process.pid}-${Date.now()}-${randomUUID().slice(0, 8)}`;
      writeFileSync(tempPath, serialized, 'utf8');
      renameSync(tempPath, traceFile);
    } catch (err) {
      evidence.failure = evidence.failure ?? {
        stage: 'ARTIFACT_WRITE',
        code: 'TRACE_WRITE_FAILED',
        message:
          err instanceof Error
            ? err.message
            : 'Failed to atomically write sanitized trace artifact',
      };
      evidence.overall = 'FAIL';
    }
  }

  return {
    evidence,
    failure: evidence.overall !== 'PASS',
    tracePath: path.join(resolvedArtifactDir, 'trace.json'),
  };
}

/**
 * Validates a persisted trace file against expectations.
 */
export function verifyTraceFile(
  tracePath,
  {
    expectedMode = 'normal',
    exitStatus,
    expectedCheckoutSha,
    env = process.env,
  } = {},
) {
  if (!tracePath || typeof tracePath !== 'string') {
    return {
      valid: false,
      code: 'TRACE_PATH_INVALID',
      summary: 'Trace path is invalid or missing',
    };
  }
  if (!existsSync(tracePath)) {
    return {
      valid: false,
      code: 'TRACE_MISSING',
      summary: `Trace file does not exist at: ${tracePath}`,
    };
  }

  let content;
  try {
    content = readFileSync(tracePath, 'utf8');
  } catch {
    return {
      valid: false,
      code: 'TRACE_UNREADABLE',
      summary: 'Trace file could not be read',
    };
  }

  let trace;
  try {
    trace = JSON.parse(content);
  } catch {
    return {
      valid: false,
      code: 'TRACE_CORRUPT',
      summary: 'Trace file contains invalid JSON',
    };
  }

  if (!trace || typeof trace !== 'object' || Array.isArray(trace)) {
    return {
      valid: false,
      code: 'TRACE_CORRUPT',
      summary: 'Trace payload must be an object',
    };
  }

  if (trace.mode !== expectedMode) {
    return {
      valid: false,
      code: 'TRACE_MODE_MISMATCH',
      summary: `Trace mode '${trace.mode}' does not match expected '${expectedMode}'`,
    };
  }

  // Provenance check
  const checkoutSha = trace.provenance?.checkoutSha;
  if (
    !checkoutSha ||
    typeof checkoutSha !== 'string' ||
    checkoutSha.trim().length === 0 ||
    checkoutSha === 'unknown'
  ) {
    return {
      valid: false,
      code: 'TRACE_PROVENANCE_MISSING',
      summary: 'Trace is missing verified checkoutSha in provenance',
    };
  }

  const SHA_40_PATTERN = /^[0-9a-f]{40}$/i;
  if (!SHA_40_PATTERN.test(checkoutSha)) {
    return {
      valid: false,
      code: 'TRACE_PROVENANCE_INVALID',
      summary: `Trace checkoutSha '${checkoutSha}' is not a valid 40-character hexadecimal SHA`,
    };
  }

  // Narrowly scoped CLI / CI default under verified CI conditions (Finding R3-F03, R4-F03):
  // When expectedCheckoutSha is not explicitly provided and running in CI,
  // require valid GITHUB_SHA and bind to it (fail closed if missing or malformed).
  let targetExpectedSha = expectedCheckoutSha;
  if (!targetExpectedSha && env?.GITHUB_ACTIONS === 'true') {
    const ciSha = env?.GITHUB_SHA?.trim();
    if (!ciSha) {
      return {
        valid: false,
        code: 'TRACE_CI_PROVENANCE_MISSING',
        summary:
          'Running in GitHub Actions environment but GITHUB_SHA is missing or empty',
      };
    }
    if (!SHA_40_PATTERN.test(ciSha)) {
      return {
        valid: false,
        code: 'TRACE_CI_PROVENANCE_INVALID',
        summary: `Running in GitHub Actions environment but GITHUB_SHA '${ciSha}' is not a valid 40-character hexadecimal SHA`,
      };
    }
    targetExpectedSha = ciSha;
  }

  if (targetExpectedSha) {
    if (checkoutSha.toLowerCase() !== targetExpectedSha.toLowerCase()) {
      return {
        valid: false,
        code: 'TRACE_PROVENANCE_MISMATCH',
        summary: `Trace checkoutSha '${checkoutSha}' does not match expected '${targetExpectedSha}'`,
      };
    }
  }

  // Browser identity verification (mandatory for all execution modes, Finding R5-F01)
  const browserProv = trace.provenance?.browser;
  if (
    !browserProv ||
    typeof browserProv !== 'object' ||
    Array.isArray(browserProv)
  ) {
    return {
      valid: false,
      code: 'TRACE_BROWSER_PROVENANCE_MISSING',
      summary: 'Trace is missing verified browser identity in provenance',
    };
  }

  if (
    !browserProv.product ||
    typeof browserProv.product !== 'string' ||
    browserProv.product.trim().length === 0 ||
    browserProv.product.toLowerCase() === 'unknown'
  ) {
    return {
      valid: false,
      code: 'TRACE_BROWSER_PROVENANCE_INVALID',
      summary:
        'Trace browser provenance has missing, empty, or placeholder product',
    };
  }

  if (
    !browserProv.browserVersion ||
    typeof browserProv.browserVersion !== 'string' ||
    browserProv.browserVersion.trim().length === 0 ||
    browserProv.browserVersion.toLowerCase() === 'unknown'
  ) {
    return {
      valid: false,
      code: 'TRACE_BROWSER_PROVENANCE_INVALID',
      summary:
        'Trace browser provenance has missing, empty, or placeholder browserVersion',
    };
  }

  if (
    !browserProv.protocolVersion ||
    typeof browserProv.protocolVersion !== 'string' ||
    browserProv.protocolVersion.trim().length === 0 ||
    browserProv.protocolVersion.toLowerCase() === 'unknown'
  ) {
    return {
      valid: false,
      code: 'TRACE_BROWSER_PROVENANCE_INVALID',
      summary:
        'Trace browser provenance has missing, empty, or placeholder protocolVersion',
    };
  }

  // Cleanup absence verification (mandatory for all execution modes)
  if (trace.cleanup?.status !== 'PASS') {
    return {
      valid: false,
      code: 'TRACE_CLEANUP_FAILED',
      summary: `Trace cleanup status is '${trace.cleanup?.status}', expected 'PASS'`,
    };
  }

  if (trace.cleanup?.verifiedAbsent !== true) {
    return {
      valid: false,
      code: 'TRACE_CLEANUP_UNVERIFIED',
      summary: `Trace cleanup verifiedAbsent is '${trace.cleanup?.verifiedAbsent}', expected true`,
    };
  }

  if (expectedMode === 'normal') {
    if (trace.overall !== 'PASS') {
      return {
        valid: false,
        code: 'TRACE_OVERALL_FAILED',
        summary: `Trace overall status is '${trace.overall}', expected 'PASS'`,
      };
    }
    if (trace.failure !== null) {
      return {
        valid: false,
        code: 'TRACE_CONTRADICTORY_FIELDS',
        summary: 'Trace has overall PASS but failure object is not null',
      };
    }
    if (exitStatus !== undefined && exitStatus !== 0) {
      return {
        valid: false,
        code: 'EXIT_STATUS_MISMATCH',
        summary: `Exit status was ${exitStatus}, expected 0`,
      };
    }

    // Verify all mandatory case IDs are present and marked PASS
    if (!trace.cases || typeof trace.cases !== 'object') {
      return {
        valid: false,
        code: 'TRACE_CASES_MISSING',
        summary: 'Trace is missing cases object',
      };
    }

    for (const caseId of EXPECTED_UI_CASE_IDS) {
      const caseResult = trace.cases[caseId];
      if (!caseResult) {
        return {
          valid: false,
          code: 'CASE_MISSING',
          summary: `Mandatory test case '${caseId}' is missing from trace`,
        };
      }
      if (caseResult.status !== 'PASS') {
        return {
          valid: false,
          code: 'CASE_FAILED',
          summary: `Test case '${caseId}' has status '${caseResult.status}', expected 'PASS'`,
        };
      }
    }

    // Verify SALES_DIRECT_EXCEPTIONS_DENIAL numeric HTTP status (Finding R5-F02)
    const salesDenial = trace.cases?.SALES_DIRECT_EXCEPTIONS_DENIAL;
    if (
      !salesDenial ||
      typeof salesDenial.httpStatus !== 'number' ||
      !Number.isInteger(salesDenial.httpStatus) ||
      salesDenial.httpStatus <= 0
    ) {
      return {
        valid: false,
        code: 'TRACE_HTTP_STATUS_INVALID',
        summary: `SALES_DIRECT_EXCEPTIONS_DENIAL missing valid numeric httpStatus, received '${salesDenial?.httpStatus}'`,
      };
    }
    if (salesDenial.httpStatusVerified !== true) {
      return {
        valid: false,
        code: 'TRACE_HTTP_STATUS_UNVERIFIED',
        summary:
          'SALES_DIRECT_EXCEPTIONS_DENIAL httpStatusVerified must be true',
      };
    }

    // Verify QC_DIRECT_QUOTES_DENIAL numeric HTTP status (Finding R5-F02)
    const qcDenial = trace.cases?.QC_DIRECT_QUOTES_DENIAL;
    if (
      !qcDenial ||
      typeof qcDenial.httpStatus !== 'number' ||
      !Number.isInteger(qcDenial.httpStatus) ||
      qcDenial.httpStatus <= 0
    ) {
      return {
        valid: false,
        code: 'TRACE_HTTP_STATUS_INVALID',
        summary: `QC_DIRECT_QUOTES_DENIAL missing valid numeric httpStatus, received '${qcDenial?.httpStatus}'`,
      };
    }
    if (qcDenial.httpStatusVerified !== true) {
      return {
        valid: false,
        code: 'TRACE_HTTP_STATUS_UNVERIFIED',
        summary: 'QC_DIRECT_QUOTES_DENIAL httpStatusVerified must be true',
      };
    }
  } else if (expectedMode === 'intentional-broken-control') {
    if (trace.overall !== 'FAIL') {
      return {
        valid: false,
        code: 'NEGATIVE_CONTROL_MISMATCH',
        summary: `Expected FAIL for negative control, received '${trace.overall}'`,
      };
    }
    if (!trace.failure || typeof trace.failure !== 'object') {
      return {
        valid: false,
        code: 'NEGATIVE_CONTROL_FAILURE_MISSING',
        summary: 'Negative control trace missing failure record',
      };
    }
    if (trace.failure.code !== 'INTENTIONAL_NEGATIVE_CONTROL_TRIGGERED') {
      return {
        valid: false,
        code: 'NEGATIVE_CONTROL_CODE_MISMATCH',
        summary: `Expected failure code 'INTENTIONAL_NEGATIVE_CONTROL_TRIGGERED', received '${trace.failure.code}'`,
      };
    }
    if (exitStatus !== undefined && exitStatus === 0) {
      return {
        valid: false,
        code: 'EXIT_STATUS_MISMATCH',
        summary: `Exit status was 0, expected non-zero for negative control`,
      };
    }
  }

  return {
    valid: true,
    code: 'TRACE_VERIFIED',
    summary: 'Trace file verified successfully',
    diagnostics: {
      mode: trace.mode,
      overall: trace.overall,
      cleanup: trace.cleanup?.status,
      checkoutSha,
      browserProduct: browserProv?.product,
      browserVersion: browserProv?.browserVersion,
      casesCount: Object.keys(trace.cases || {}).length,
    },
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

  const { evidence, failure } = await runUiQaHarness({
    isNegativeControl: isNeg,
  });

  if (failure) {
    console.error(
      `Browser UI QA failed (${evidence.failure?.stage}:${evidence.failure?.code}); mode=${evidence.mode}`,
    );
    return 1;
  }
  console.log(
    `Browser UI QA passed (${evidence.overall}); mode=${evidence.mode}`,
  );
  return 0;
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
const currentPath = fileURLToPath(import.meta.url);
if (invokedPath && invokedPath === currentPath) {
  const code = await runCli();
  process.exit(code);
}
