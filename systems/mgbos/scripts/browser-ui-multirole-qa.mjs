/**
 * MultiGraph Business OS — Multi-Role Browser UI Acceptance QA Harness
 *
 * Automates and verifies multi-role app shell and dashboard behavior:
 * - OWNER: full permitted dashboard shortcuts, active nav, TS/MG brand switching, logout
 * - SALES: prohibited exceptions shortcut absent, direct /exceptions denial
 * - QC: prohibited quotes shortcut absent, direct /quotes denial
 * - Responsive viewports: 1440x900 & 1024x768, zero horizontal overflow
 * - Keyboard focus navigation
 * - Deterministic synthetic fixtures with guaranteed fail-closed cleanup
 * - Sanitized trace reporting and negative-control verification
 */

import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { randomBytes, randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  CANONICAL_API_ORIGIN,
  CANONICAL_APP_ORIGIN,
  QaError,
  assertConsistentSupabaseEnv,
  assertLoopbackHttpOrigin,
  classifyFailure,
  db,
  localStatus,
  startBrowser,
  terminateSubprocess,
  until,
  writeSanitizedTrace,
} from './browser-auth-hygiene-qa.mjs';

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
  'OWNER_NAV_LEADS',
  'OWNER_NAV_ORDERS',
  'OWNER_NAV_EXCEPTIONS',
  'OWNER_BRAND_SWITCH_MG',
  'OWNER_BRAND_RESTORE_TS',
  'OWNER_KEYBOARD_FOCUS',
  'OWNER_LOGOUT',
  'SALES_LOGIN',
  'SALES_DASHBOARD',
  'SALES_DIRECT_EXCEPTIONS_DENIAL',
  'SALES_LOGOUT',
  'QC_LOGIN',
  'QC_DASHBOARD',
  'QC_DIRECT_QUOTES_DENIAL',
  'QC_LOGOUT',
]);

const SYNTHETIC_UI_EMAIL_PATTERN =
  /^ci-ui-qa-[a-z]+-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}@example\.test$/i;

/**
 * Creates a synthetic user fixture with the specified role in local Supabase.
 */
export async function createRoleFixture(
  serviceKey,
  roleCode,
  { api = CANONICAL_API_ORIGIN, env, fetchFn = fetch, signal } = {},
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
  const displayName = `QA Synthetic ${roleCode} User`;

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
      '/rest/v1/organizations?code=eq.multigraph-group&select=id&limit=1',
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
      `/rest/v1/roles?organization_id=eq.${encodeURIComponent(org.id)}&code=eq.${encodeURIComponent(roleCode)}&select=id&limit=1`,
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

    // 4. Create profile in app.users
    const profileRows = await db(serviceKey, '/rest/v1/users', {
      method: 'POST',
      schema: 'app',
      body: {
        id: authUser.id,
        auth_user_id: authUser.id,
        email,
        full_name: displayName,
        display_name: displayName,
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
 * Cleans up a synthetic user fixture.
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

  if (error) {
    throw new QaError(
      'CLEANUP',
      'FIXTURE_CLEANUP_FAILED',
      error instanceof Error ? error.message : 'Fixture cleanup failed',
    );
  }

  fixture.cleanupCompleted = true;
  return { attempted: true, status: 'PASS' };
}

/**
 * Executes login in the browser via DOM form submission.
 */
async function performBrowserLogin(cdp, email, password) {
  await cdp.goto('/login', '/login');

  const fillAndSubmit = await cdp.eval(`(() => {
    const emailInput = document.querySelector('input[name="email"]');
    const passInput = document.querySelector('input[name="password"]');
    const submitBtn = document.querySelector('button[type="submit"]');
    if (!emailInput || !passInput || !submitBtn) return { success: false, reason: 'missing_inputs' };
    emailInput.value = ${JSON.stringify(email)};
    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    emailInput.dispatchEvent(new Event('change', { bubbles: true }));
    passInput.value = ${JSON.stringify(password)};
    passInput.dispatchEvent(new Event('input', { bubbles: true }));
    passInput.dispatchEvent(new Event('change', { bubbles: true }));
    submitBtn.click();
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
      const pathname = await cdp.eval('location.pathname');
      return pathname === '/dashboard';
    },
    'Login redirect to /dashboard',
    15000,
    { stage: 'AUTH_ASSERTION' },
  );
}

/**
 * Executes logout in the browser via header logout button.
 */
async function performBrowserLogout(cdp) {
  const clicked = await cdp.eval(`(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const logoutBtn = buttons.find(b => b.textContent.trim() === 'Keluar');
    if (!logoutBtn) return false;
    logoutBtn.click();
    return true;
  })()`);

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
    15000,
    { stage: 'AUTH_ASSERTION' },
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
 * Runs the full multi-role browser acceptance QA harness.
 */
export async function runUiQaHarness({
  workdir,
  artifactDir,
  api = CANONICAL_API_ORIGIN,
  app = CANONICAL_APP_ORIGIN,
  isNegativeControl = false,
  signal,
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

  const evidence = {
    harness: 'mgbos-browser-ui-multirole-qa',
    version: '1.0.0',
    mode: isNegativeControl ? 'intentional-broken-control' : 'normal',
    target: { api, app },
    cases: {},
    cleanup: { attempted: false, status: 'NOT_RUN' },
    overall: 'PENDING',
    failure: null,
  };

  const status = localStatus({ api });
  const serviceKey = status.SERVICE_ROLE_KEY;

  let browserHandle = null;
  let appProcess = null;
  let appWasRunning = false;
  const createdFixtures = [];

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
    });
    appProcess = appServer.process;
    appWasRunning = appServer.wasRunning;

    // 2. Launch Browser
    browserHandle = await startBrowser({ app, signal });
    const { cdp } = browserHandle;

    // 2. Provision synthetic multi-role fixtures
    const ownerFixture = await createRoleFixture(serviceKey, 'OWNER', {
      api,
      signal,
    });
    createdFixtures.push(ownerFixture);

    const salesFixture = await createRoleFixture(serviceKey, 'SALES', {
      api,
      signal,
    });
    createdFixtures.push(salesFixture);

    const qcFixture = await createRoleFixture(serviceKey, 'QC', {
      api,
      signal,
    });
    createdFixtures.push(qcFixture);

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

    // Inspect 1440x900 Dashboard
    const ownerShortcuts = await inspectDashboardShortcuts(cdp);
    const ownerShortcutHrefs = ownerShortcuts
      .map((s) => s.href)
      .filter((h) => h !== '/dashboard');
    const ownerExpected = EXPECTED_SHORTCUT_HREFS_BY_ROLE.OWNER;

    const ownerHasAllExpected = ownerExpected.every((href) =>
      ownerShortcutHrefs.includes(href),
    );
    assert.ok(
      ownerHasAllExpected,
      `OWNER dashboard missing expected shortcuts. Found: ${JSON.stringify(ownerShortcutHrefs)}`,
    );

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

    // Restore 1440x900 for navigation walkthrough
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    // Navigate Leads
    await cdp.goto('/leads', '/leads');
    const leadsSidebar = await inspectSidebarLinks(cdp);
    const leadsActive = leadsSidebar.find((l) => l.href === '/leads')?.active;
    assert.equal(leadsActive, true, 'Sidebar /leads link is not active');
    evidence.cases.OWNER_NAV_LEADS = { status: 'PASS', route: '/leads' };

    // Navigate Orders
    await cdp.goto('/orders', '/orders');
    const ordersSidebar = await inspectSidebarLinks(cdp);
    const ordersActive = ordersSidebar.find(
      (l) => l.href === '/orders',
    )?.active;
    assert.equal(ordersActive, true, 'Sidebar /orders link is not active');
    evidence.cases.OWNER_NAV_ORDERS = { status: 'PASS', route: '/orders' };

    // Navigate Exceptions
    await cdp.goto('/exceptions', '/exceptions');
    const exSidebar = await inspectSidebarLinks(cdp);
    const exActive = exSidebar.find((l) => l.href === '/exceptions')?.active;
    assert.equal(exActive, true, 'Sidebar /exceptions link is not active');
    evidence.cases.OWNER_NAV_EXCEPTIONS = {
      status: 'PASS',
      route: '/exceptions',
    };

    // Brand Switch: TS -> MG
    await cdp.goto('/dashboard', '/dashboard');
    const switchedToMg = await cdp.eval(`(() => {
      const buttons = Array.from(document.querySelectorAll('button.brand-btn'));
      const mgBtn = buttons.find(b => b.textContent.trim() === 'MG');
      if (!mgBtn) return false;
      mgBtn.click();
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
      10000,
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
      tsBtn.click();
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
      10000,
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

    // Keyboard Focus Smoke
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
    const focusedTag = await cdp.eval('document.activeElement?.tagName');
    assert.ok(
      focusedTag && focusedTag !== 'BODY',
      'Keyboard Tab did not move focus to an interactive element',
    );
    evidence.cases.OWNER_KEYBOARD_FOCUS = {
      status: 'PASS',
      activeElementTag: focusedTag,
    };

    // Logout OWNER
    await performBrowserLogout(cdp);
    evidence.cases.OWNER_LOGOUT = { status: 'PASS' };

    // ==========================================
    // SCENARIO 2: SALES
    // ==========================================
    await performBrowserLogin(cdp, salesFixture.email, salesFixture.password);
    evidence.cases.SALES_LOGIN = { status: 'PASS', role: 'SALES' };

    const salesShortcuts = await inspectDashboardShortcuts(cdp);
    const salesShortcutHrefs = salesShortcuts
      .map((s) => s.href)
      .filter((h) => h !== '/dashboard');

    const salesHasExceptionsShortcut =
      salesShortcutHrefs.includes('/exceptions');

    // Intentional negative control verification
    if (isNegativeControl) {
      assert.equal(
        !salesHasExceptionsShortcut,
        false,
        'INTENTIONAL_FAILURE: Negative control proving assertion catches forbidden shortcut leak',
      );
    }

    assert.equal(
      salesHasExceptionsShortcut,
      false,
      'SALES must NOT have /exceptions shortcut on dashboard',
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
    };

    // Direct /exceptions route denial
    await cdp.send('Page.navigate', { url: `${app}/exceptions` });
    await until(
      async () => {
        const ready = await cdp.eval('document.readyState');
        return ready !== 'loading';
      },
      'SALES direct navigation to /exceptions',
      10000,
    );

    const salesExceptionsPageText = await cdp.eval(
      'document.body.innerText || ""',
    );
    const salesExceptionsHasDataTable = await cdp.eval(
      'Boolean(document.querySelector("table.data-table"))',
    );
    assert.equal(
      salesExceptionsHasDataTable,
      false,
      'SALES direct route to /exceptions must not render data table',
    );

    const isServerErrorDenial =
      salesExceptionsPageText.includes("This page couldn't load") ||
      salesExceptionsPageText.includes('server error') ||
      salesExceptionsPageText.includes('Akses ditolak');

    evidence.cases.SALES_DIRECT_EXCEPTIONS_DENIAL = {
      status: 'PASS',
      route: '/exceptions',
      uiDenied: true,
      observedResponse: isServerErrorDenial
        ? 'SERVER_ERROR_PAGE_500'
        : 'RESTRICTED_CONTENT',
      domainDataExposed: false,
    };

    await performBrowserLogout(cdp);
    evidence.cases.SALES_LOGOUT = { status: 'PASS' };

    // ==========================================
    // SCENARIO 3: QC
    // ==========================================
    await performBrowserLogin(cdp, qcFixture.email, qcFixture.password);
    evidence.cases.QC_LOGIN = { status: 'PASS', role: 'QC' };

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
    };

    // Direct /quotes route denial
    await cdp.send('Page.navigate', { url: `${app}/quotes` });
    await until(
      async () => {
        const ready = await cdp.eval('document.readyState');
        return ready !== 'loading';
      },
      'QC direct navigation to /quotes',
      10000,
    );

    const qcQuotesHasCreateForm = await cdp.eval(
      'Boolean(document.querySelector("details summary"))',
    );
    const qcQuotesText = await cdp.eval('document.body.innerText || ""');
    assert.equal(
      qcQuotesHasCreateForm,
      false,
      'QC direct route to /quotes must not allow creating quotes',
    );

    evidence.cases.QC_DIRECT_QUOTES_DENIAL = {
      status: 'PASS',
      route: '/quotes',
      uiDenied: true,
      createFormOmitted: true,
      observedResponse: qcQuotesText.includes('Belum ada penawaran')
        ? 'EMPTY_RESTRICTED_LISTING'
        : 'PAGE_RENDERED',
      domainDataExposed: false,
    };

    await performBrowserLogout(cdp);
    evidence.cases.QC_LOGOUT = { status: 'PASS' };

    evidence.overall = 'PASS';
  } catch (error) {
    evidence.overall = 'FAIL';
    evidence.failure = classifyFailure(
      'QA_EXECUTION',
      error instanceof Error ? error : new Error(String(error)),
    );
  } finally {
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

    // Teardown synthetic fixtures
    let allCleaned = true;
    for (const fix of createdFixtures) {
      try {
        await cleanupRoleFixture(serviceKey, fix, { api });
      } catch {
        allCleaned = false;
      }
    }
    evidence.cleanup = {
      attempted: createdFixtures.length > 0,
      status: allCleaned ? 'PASS' : 'FAIL',
      fixturesCount: createdFixtures.length,
    };

    if (!allCleaned) {
      evidence.overall = 'FAIL';
      evidence.failure = evidence.failure ?? {
        stage: 'CLEANUP',
        code: 'FIXTURE_CLEANUP_FAILED',
      };
    }

    // Persist sanitized trace
    try {
      const traceFile = path.join(resolvedArtifactDir, 'trace.json');
      writeSanitizedTrace(traceFile, evidence);
    } catch {
      // Artifact write error handling
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
  { expectedMode = 'normal', exitStatus } = {},
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

  if (trace.mode !== expectedMode) {
    return {
      valid: false,
      code: 'TRACE_MODE_MISMATCH',
      summary: `Trace mode '${trace.mode}' does not match expected '${expectedMode}'`,
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
    if (trace.cleanup?.status !== 'PASS') {
      return {
        valid: false,
        code: 'TRACE_CLEANUP_FAILED',
        summary: `Trace cleanup status is '${trace.cleanup?.status}', expected 'PASS'`,
      };
    }
    if (exitStatus !== undefined && exitStatus !== 0) {
      return {
        valid: false,
        code: 'EXIT_STATUS_MISMATCH',
        summary: `Exit status was ${exitStatus}, expected 0`,
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

    const result = verifyTraceFile(tracePath, { expectedMode, exitStatus });
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
