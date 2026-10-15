import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import {
  ALLOWED_ROLES,
  EXPECTED_SHORTCUT_HREFS_BY_ROLE,
  EXPECTED_UI_CASE_IDS,
  classifyRouteDenial,
  cleanupRoleFixture,
  createRoleFixture,
  defaultBuildApp,
  ensureAppServer,
  terminateBrowser,
  verifyTraceFile,
} from './browser-ui-multirole-qa.mjs';

function withTempDir(fn) {
  const dir = mkdtempSync(path.join(tmpdir(), 'mgbos-ui-qa-test-'));
  return Promise.resolve()
    .then(() => fn(dir))
    .finally(() => {
      rmSync(dir, { recursive: true, force: true, maxRetries: 3 });
    });
}

describe('MGBOS Multi-Role Browser UI QA Harness', () => {
  it('enforces canonical role permissions and shortcut expectations', () => {
    assert.deepEqual(ALLOWED_ROLES, ['OWNER', 'SALES', 'QC']);

    const ownerShortcuts = EXPECTED_SHORTCUT_HREFS_BY_ROLE.OWNER;
    const salesShortcuts = EXPECTED_SHORTCUT_HREFS_BY_ROLE.SALES;
    const qcShortcuts = EXPECTED_SHORTCUT_HREFS_BY_ROLE.QC;

    assert.equal(ownerShortcuts.length, 14);
    assert.ok(ownerShortcuts.includes('/exceptions'));
    assert.ok(ownerShortcuts.includes('/quotes'));

    assert.equal(salesShortcuts.length, 13);
    assert.equal(salesShortcuts.includes('/exceptions'), false);
    assert.ok(salesShortcuts.includes('/quotes'));

    assert.equal(qcShortcuts.length, 12);
    assert.equal(qcShortcuts.includes('/exceptions'), false);
    assert.equal(qcShortcuts.includes('/quotes'), false);

    assert.equal(EXPECTED_UI_CASE_IDS.length, 24);
    assert.ok(EXPECTED_UI_CASE_IDS.includes('OWNER_HEADER_LAYOUT_1440'));
    assert.ok(EXPECTED_UI_CASE_IDS.includes('OWNER_HEADER_LAYOUT_1024'));
    assert.ok(EXPECTED_UI_CASE_IDS.includes('OWNER_KEYBOARD_NAVIGATION'));
    assert.ok(EXPECTED_UI_CASE_IDS.includes('OWNER_SHORTCUTS_DEEP_EQUALITY'));
    assert.ok(EXPECTED_UI_CASE_IDS.includes('POST_LOGOUT_PROTECTED_DENIAL'));
    assert.ok(EXPECTED_UI_CASE_IDS.includes('SALES_AUTHORIZED_QUOTES_ACCESS'));
    assert.ok(EXPECTED_UI_CASE_IDS.includes('SALES_DIRECT_EXCEPTIONS_DENIAL'));
    assert.ok(EXPECTED_UI_CASE_IDS.includes('QC_DIRECT_QUOTES_DENIAL'));
    assert.ok(EXPECTED_UI_CASE_IDS.includes('FIXTURE_CLEANUP_VERIFICATION'));
  });

  describe('classifyRouteDenial', () => {
    it('classifies server component error boundary (500) as denial when no domain data leaks', () => {
      const result = classifyRouteDenial({
        responseStatus: 500,
        pathname: '/exceptions',
        pageText: "This page couldn't load. A server error occurred.",
        hasDomainHeading: false,
        hasDomainContent: false,
        hasErrorBoundary: true,
        domainHeadingText: 'Operational Exceptions',
      });
      assert.equal(result.denied, true);
      assert.equal(result.uiDenied, true);
      assert.equal(result.status, 'ERROR_BOUNDARY_500');
      assert.equal(result.domainDataExposed, false);
    });

    it('classifies explicit 403 status as denial when no domain data leaks', () => {
      const result = classifyRouteDenial({
        responseStatus: 403,
        pathname: '/quotes',
        pageText: '403 Forbidden. Akses ditolak: 403.',
        hasDomainHeading: false,
        hasDomainContent: false,
      });
      assert.equal(result.denied, true);
      assert.equal(result.uiDenied, true);
      assert.equal(result.status, 'EXPLICIT_403');
      assert.equal(result.domainDataExposed, false);
    });

    it('classifies 200 with access denied message as denial when no domain data leaks', () => {
      const result = classifyRouteDenial({
        responseStatus: 200,
        pathname: '/exceptions',
        pageText: 'Akses ditolak: Anda tidak memiliki akses ke halaman ini.',
        hasDomainHeading: false,
        hasDomainContent: false,
      });
      assert.equal(result.denied, true);
      assert.equal(result.uiDenied, true);
      assert.equal(result.status, 'ACCESS_DENIED_200');
      assert.equal(result.domainDataExposed, false);
    });

    it('classifies normal authorized page with domain heading as authorized (NOT denied)', () => {
      const result = classifyRouteDenial({
        responseStatus: 200,
        pathname: '/quotes',
        pageText: 'Penawaran & HPP · MultiGraph Group',
        hasDomainHeading: true,
        hasDomainContent: true,
        hasErrorBoundary: false,
        domainHeadingText: 'Penawaran & HPP',
      });
      assert.equal(result.denied, false);
      assert.equal(result.uiDenied, false);
      assert.equal(result.status, 'AUTHORIZED_PAGE');
      assert.equal(result.domainDataExposed, true);
    });

    it('crucial negative test: normal but empty authorized page is NOT misclassified as denial', () => {
      // When an authorized user visits /quotes or /exceptions and the table/listing is currently empty,
      // the page returns HTTP 200, renders the domain heading, and displays "Belum ada penawaran".
      // This MUST be recognized as an authorized page, NEVER as a permission denial.
      const result = classifyRouteDenial({
        responseStatus: 200,
        pathname: '/quotes',
        pageText:
          'Penawaran & HPP · Belum ada penawaran untuk brand ini. Buat penawaran baru.',
        hasDomainHeading: true,
        hasDomainContent: false,
        hasErrorBoundary: false,
        domainHeadingText: 'Penawaran & HPP',
      });
      assert.equal(result.denied, false);
      assert.equal(result.uiDenied, false);
      assert.equal(result.status, 'AUTHORIZED_PAGE');
      assert.equal(result.domainDataExposed, true);
    });

    it('detects domain data leak on error pages and rejects denial classification', () => {
      const result = classifyRouteDenial({
        responseStatus: 500,
        pathname: '/exceptions',
        pageText:
          'Internal Server Error. Operational Exceptions (Pusat Abnormalitas)',
        hasDomainHeading: true,
        hasDomainContent: true,
        hasErrorBoundary: true,
        domainHeadingText: 'Operational Exceptions',
      });
      assert.equal(result.denied, false);
      assert.equal(result.status, 'ERROR_WITH_DATA_LEAK');
      assert.equal(result.domainDataExposed, true);
    });

    it('treats generic 500 status without explicit denial or error boundary as UNHANDLED_SERVER_CRASH (NOT denied)', () => {
      const result = classifyRouteDenial({
        responseStatus: 500,
        pathname: '/exceptions',
        pageText: 'Internal Server Error',
        hasDomainHeading: false,
        hasDomainContent: false,
        hasErrorBoundary: false,
        domainHeadingText: 'Operational Exceptions',
      });
      assert.equal(result.denied, false);
      assert.equal(result.uiDenied, false);
      assert.equal(result.status, 'UNHANDLED_SERVER_CRASH');
      assert.equal(result.domainDataExposed, false);
    });

    it('returns UNEXPECTED_STATE for unknown status codes without error boundary or domain content', () => {
      const result = classifyRouteDenial({
        responseStatus: 418,
        pathname: '/unknown',
        pageText: "I'm a teapot",
        hasDomainHeading: false,
        hasDomainContent: false,
      });
      assert.equal(result.denied, false);
      assert.equal(result.status, 'UNEXPECTED_STATE');
    });
  });

  describe('Fixture Lifecycle & Absence Verification', () => {
    it('rejects nonlocal API targets during fixture operations', async () => {
      await assert.rejects(
        () =>
          createRoleFixture('test-key', 'OWNER', {
            api: 'https://example.supabase.co',
          }),
        /Refusing non-loopback Supabase API origin|Refusing non-loopback/i,
      );
    });

    it('rejects unsupported role codes during fixture creation', async () => {
      await assert.rejects(
        () =>
          createRoleFixture('test-key', 'SUPERUSER', {
            api: 'http://127.0.0.1:55431',
          }),
        /Unsupported synthetic fixture role: SUPERUSER/i,
      );
    });

    it('refuses to clean up fixtures with non-synthetic emails', async () => {
      await assert.rejects(
        () =>
          cleanupRoleFixture(
            'test-key',
            {
              email: 'founder@multigraph.id',
              profileId: '00000000-0000-0000-0000-000000000001',
            },
            { api: 'http://127.0.0.1:55431' },
          ),
        /Refusing to delete non-synthetic email fixture/i,
      );
    });

    it('verifies independent resource absence during successful cleanup', async () => {
      const calls = [];
      const mockFetch = async (url, opts) => {
        const urlStr = String(url);
        calls.push({ url: urlStr, method: opts?.method ?? 'GET' });
        // DELETE endpoints return 204
        if (opts?.method === 'DELETE') {
          return new Response(null, { status: 204 });
        }
        // Post-cleanup absence checks:
        if (urlStr.includes('/rest/v1/organization_members')) {
          return new Response(JSON.stringify([]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        if (urlStr.includes('/rest/v1/users')) {
          return new Response(JSON.stringify([]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        if (urlStr.includes('/auth/v1/admin/users/')) {
          return new Response(JSON.stringify({ error: 'User not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        return new Response('[]', { status: 200 });
      };

      const fixture = {
        email:
          'ci-ui-qa-owner-11111111-2222-3333-4444-555555555555@example.test',
        profileId: '00000000-0000-0000-0000-000000000001',
        authUserId: '00000000-0000-0000-0000-000000000002',
      };

      const result = await cleanupRoleFixture('service-key', fixture, {
        api: 'http://127.0.0.1:55431',
        fetchFn: mockFetch,
      });

      assert.equal(result.status, 'PASS');
      assert.equal(result.verifiedAbsent, true);
      assert.equal(fixture.cleanupCompleted, true);
    });

    it('fails closed when post-cleanup check finds remaining user profile record', async () => {
      const mockFetch = async (url, opts) => {
        const urlStr = String(url);
        if (opts?.method === 'DELETE') {
          return new Response(null, { status: 204 });
        }
        if (urlStr.includes('/rest/v1/organization_members')) {
          return new Response(JSON.stringify([]), { status: 200 });
        }
        // Simulate profile record still present in database!
        if (urlStr.includes('/rest/v1/users')) {
          return new Response(
            JSON.stringify([{ id: '00000000-0000-0000-0000-000000000001' }]),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          );
        }
        if (urlStr.includes('/auth/v1/admin/users/')) {
          return new Response(null, { status: 404 });
        }
        return new Response('[]', { status: 200 });
      };

      const fixture = {
        email:
          'ci-ui-qa-sales-11111111-2222-3333-4444-555555555555@example.test',
        profileId: '00000000-0000-0000-0000-000000000001',
        authUserId: '00000000-0000-0000-0000-000000000002',
      };

      await assert.rejects(
        () =>
          cleanupRoleFixture('service-key', fixture, {
            api: 'http://127.0.0.1:55431',
            fetchFn: mockFetch,
          }),
        /FIXTURE_RESOURCE_NOT_ABSENT|record still present after deletion/i,
      );
    });

    it('fails closed when post-cleanup check finds remaining auth user', async () => {
      const mockFetch = async (url, opts) => {
        const urlStr = String(url);
        if (opts?.method === 'DELETE') {
          return new Response(null, { status: 204 });
        }
        if (urlStr.includes('/rest/v1/')) {
          return new Response(JSON.stringify([]), { status: 200 });
        }
        // Simulate auth user still returns 200 OK!
        if (urlStr.includes('/auth/v1/admin/users/')) {
          return new Response(
            JSON.stringify({ id: '00000000-0000-0000-0000-000000000002' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          );
        }
        return new Response('[]', { status: 200 });
      };

      const fixture = {
        email: 'ci-ui-qa-qc-11111111-2222-3333-4444-555555555555@example.test',
        profileId: '00000000-0000-0000-0000-000000000001',
        authUserId: '00000000-0000-0000-0000-000000000002',
      };

      await assert.rejects(
        () =>
          cleanupRoleFixture('service-key', fixture, {
            api: 'http://127.0.0.1:55431',
            fetchFn: mockFetch,
          }),
        /FIXTURE_RESOURCE_NOT_ABSENT|Auth user record still present/i,
      );
    });

    it('createRoleFixture registers early via onRegistered callback and cleans up on partial failure', async () => {
      let registeredFixture = null;
      let cleanupInvoked = false;

      const mockFetch = async (url, opts) => {
        const urlStr = String(url);
        if (urlStr.includes('/rest/v1/organizations')) {
          return new Response(JSON.stringify([{ id: 'org-1' }]), {
            status: 200,
          });
        }
        if (urlStr.includes('/rest/v1/roles')) {
          return new Response(JSON.stringify([{ id: 'role-1' }]), {
            status: 200,
          });
        }
        if (
          urlStr.includes('/auth/v1/admin/users') &&
          opts?.method === 'POST'
        ) {
          return new Response(JSON.stringify({ id: 'auth-user-1' }), {
            status: 200,
          });
        }
        // Simulate failure on app.users profile creation!
        if (urlStr.includes('/rest/v1/users') && opts?.method === 'POST') {
          throw new Error('Database connection reset during profile creation');
        }
        // Compensating cleanup calls:
        if (opts?.method === 'DELETE') {
          cleanupInvoked = true;
          return new Response(null, { status: 204 });
        }
        if (urlStr.includes('/auth/v1/admin/users/')) {
          return new Response(null, { status: 404 });
        }
        return new Response('[]', { status: 200 });
      };

      await assert.rejects(
        () =>
          createRoleFixture('service-key', 'OWNER', {
            api: 'http://127.0.0.1:55431',
            fetchFn: mockFetch,
            onRegistered: (f) => {
              registeredFixture = f;
            },
          }),
        /Database connection reset during profile creation/i,
      );

      assert.ok(registeredFixture, 'Fixture must be registered via callback');
      assert.equal(registeredFixture.authUserId, 'auth-user-1');
      assert.equal(
        cleanupInvoked,
        true,
        'Compensating cleanup must be invoked on partial failure',
      );
    });
  });

  describe('verifyTraceFile', () => {
    function generateValid24CaseTrace() {
      const cases = {};
      for (const id of EXPECTED_UI_CASE_IDS) {
        cases[id] = { status: 'PASS' };
      }
      return {
        harness: 'mgbos-browser-ui-multirole-qa',
        mode: 'normal',
        provenance: {
          checkoutSha: 'a01d375d07e9fdbc00411cb4b568a1610f1582d8',
        },
        overall: 'PASS',
        failure: null,
        cleanup: { status: 'PASS', verifiedAbsent: true },
        cases,
      };
    }

    it('verifies valid normal trace with all 24 cases cleanly', () => {
      withTempDir((dir) => {
        const tracePath = path.join(dir, 'trace.json');
        const validTrace = generateValid24CaseTrace();
        writeFileSync(tracePath, JSON.stringify(validTrace), 'utf8');

        const result = verifyTraceFile(tracePath, {
          expectedMode: 'normal',
          exitStatus: 0,
        });
        assert.equal(result.valid, true);
        assert.equal(result.code, 'TRACE_VERIFIED');
        assert.equal(result.diagnostics.casesCount, 24);
      });
    });

    it('rejects trace when mandatory cases are missing', () => {
      withTempDir((dir) => {
        const tracePath = path.join(dir, 'trace_missing_case.json');
        const incompleteTrace = generateValid24CaseTrace();
        delete incompleteTrace.cases.SALES_AUTHORIZED_QUOTES_ACCESS;
        writeFileSync(tracePath, JSON.stringify(incompleteTrace), 'utf8');

        const result = verifyTraceFile(tracePath, { expectedMode: 'normal' });
        assert.equal(result.valid, false);
        assert.equal(result.code, 'CASE_MISSING');
        assert.ok(result.summary.includes('SALES_AUTHORIZED_QUOTES_ACCESS'));
      });
    });

    it('rejects trace when a mandatory case failed', () => {
      withTempDir((dir) => {
        const tracePath = path.join(dir, 'trace_failed_case.json');
        const failedCaseTrace = generateValid24CaseTrace();
        failedCaseTrace.cases.QC_DIRECT_QUOTES_DENIAL = { status: 'FAIL' };
        writeFileSync(tracePath, JSON.stringify(failedCaseTrace), 'utf8');

        const result = verifyTraceFile(tracePath, { expectedMode: 'normal' });
        assert.equal(result.valid, false);
        assert.equal(result.code, 'CASE_FAILED');
        assert.ok(result.summary.includes('QC_DIRECT_QUOTES_DENIAL'));
      });
    });

    it('rejects trace when provenance checkoutSha is missing or unknown', () => {
      withTempDir((dir) => {
        const tracePath = path.join(dir, 'trace_no_sha.json');
        const noShaTrace = generateValid24CaseTrace();
        delete noShaTrace.provenance.checkoutSha;
        writeFileSync(tracePath, JSON.stringify(noShaTrace), 'utf8');

        const result = verifyTraceFile(tracePath, { expectedMode: 'normal' });
        assert.equal(result.valid, false);
        assert.equal(result.code, 'TRACE_PROVENANCE_MISSING');
      });
    });

    it('rejects trace when provenance checkoutSha is not a valid 40-character hex SHA', () => {
      withTempDir((dir) => {
        const tracePath = path.join(dir, 'trace_invalid_sha.json');
        const invalidShaTrace = generateValid24CaseTrace();
        invalidShaTrace.provenance.checkoutSha = 'abc123notashalength';
        writeFileSync(tracePath, JSON.stringify(invalidShaTrace), 'utf8');

        const result = verifyTraceFile(tracePath, { expectedMode: 'normal' });
        assert.equal(result.valid, false);
        assert.equal(result.code, 'TRACE_PROVENANCE_INVALID');
      });
    });

    it('validates expectedCheckoutSha when specified and rejects mismatch', () => {
      withTempDir((dir) => {
        const tracePath = path.join(dir, 'trace_sha_check.json');
        const validTrace = generateValid24CaseTrace();
        writeFileSync(tracePath, JSON.stringify(validTrace), 'utf8');

        const matchResult = verifyTraceFile(tracePath, {
          expectedMode: 'normal',
          expectedCheckoutSha: 'a01d375d07e9fdbc00411cb4b568a1610f1582d8',
        });
        assert.equal(matchResult.valid, true);

        const mismatchResult = verifyTraceFile(tracePath, {
          expectedMode: 'normal',
          expectedCheckoutSha: 'ffffffffffffffffffffffffffffffffffffffff',
        });
        assert.equal(mismatchResult.valid, false);
        assert.equal(mismatchResult.code, 'TRACE_PROVENANCE_MISMATCH');
      });
    });

    it('rejects trace when cleanup.verifiedAbsent is not true', () => {
      withTempDir((dir) => {
        const tracePath = path.join(dir, 'trace_unverified_cleanup.json');
        const unverifiedCleanupTrace = generateValid24CaseTrace();
        unverifiedCleanupTrace.cleanup = {
          status: 'PASS',
          verifiedAbsent: false,
        };
        writeFileSync(
          tracePath,
          JSON.stringify(unverifiedCleanupTrace),
          'utf8',
        );

        const result = verifyTraceFile(tracePath, { expectedMode: 'normal' });
        assert.equal(result.valid, false);
        assert.equal(result.code, 'TRACE_CLEANUP_UNVERIFIED');
      });
    });

    it('rejects trace with contradictory fields (PASS overall but failure object present)', () => {
      withTempDir((dir) => {
        const tracePath = path.join(dir, 'trace_contradictory.json');
        const contradictoryTrace = generateValid24CaseTrace();
        contradictoryTrace.failure = { stage: 'QA', code: 'SOME_ERROR' };
        writeFileSync(tracePath, JSON.stringify(contradictoryTrace), 'utf8');

        const result = verifyTraceFile(tracePath, { expectedMode: 'normal' });
        assert.equal(result.valid, false);
        assert.equal(result.code, 'TRACE_CONTRADICTORY_FIELDS');
      });
    });

    it('fails closed on missing, unreadable, corrupt, or failed traces', () => {
      withTempDir((dir) => {
        const missing = verifyTraceFile(path.join(dir, 'nonexistent.json'));
        assert.equal(missing.valid, false);
        assert.equal(missing.code, 'TRACE_MISSING');

        const corruptPath = path.join(dir, 'corrupt.json');
        writeFileSync(corruptPath, '{invalid-json', 'utf8');
        const corrupt = verifyTraceFile(corruptPath);
        assert.equal(corrupt.valid, false);
        assert.equal(corrupt.code, 'TRACE_CORRUPT');

        const failedPath = path.join(dir, 'failed.json');
        writeFileSync(
          failedPath,
          JSON.stringify({
            mode: 'normal',
            provenance: {
              checkoutSha: 'a01d375d07e9fdbc00411cb4b568a1610f1582d8',
            },
            overall: 'FAIL',
            failure: { code: 'ERR' },
            cleanup: { status: 'PASS', verifiedAbsent: true },
          }),
          'utf8',
        );
        const failed = verifyTraceFile(failedPath, { expectedMode: 'normal' });
        assert.equal(failed.valid, false);
        assert.equal(failed.code, 'TRACE_OVERALL_FAILED');

        const failedCleanupPath = path.join(dir, 'failed_cleanup.json');
        const failedCleanupTrace = generateValid24CaseTrace();
        failedCleanupTrace.cleanup = { status: 'FAIL', verifiedAbsent: false };
        writeFileSync(
          failedCleanupPath,
          JSON.stringify(failedCleanupTrace),
          'utf8',
        );
        const failedCleanup = verifyTraceFile(failedCleanupPath, {
          expectedMode: 'normal',
        });
        assert.equal(failedCleanup.valid, false);
        assert.equal(failedCleanup.code, 'TRACE_CLEANUP_FAILED');

        const exitMismatchPath = path.join(dir, 'exit_mismatch.json');
        writeFileSync(
          exitMismatchPath,
          JSON.stringify(generateValid24CaseTrace()),
          'utf8',
        );
        const exitMismatch = verifyTraceFile(exitMismatchPath, {
          expectedMode: 'normal',
          exitStatus: 1,
        });
        assert.equal(exitMismatch.valid, false);
        assert.equal(exitMismatch.code, 'EXIT_STATUS_MISMATCH');
      });
    });

    it('verifies intentional negative control trace correctly and validates failure code', () => {
      withTempDir((dir) => {
        const negTracePath = path.join(dir, 'trace-neg.json');
        const negTrace = {
          harness: 'mgbos-browser-ui-multirole-qa',
          mode: 'intentional-broken-control',
          provenance: {
            checkoutSha: 'a01d375d07e9fdbc00411cb4b568a1610f1582d8',
          },
          overall: 'FAIL',
          cleanup: { status: 'PASS', verifiedAbsent: true },
          failure: {
            stage: 'QA_EXECUTION',
            code: 'INTENTIONAL_NEGATIVE_CONTROL_TRIGGERED',
          },
        };
        writeFileSync(negTracePath, JSON.stringify(negTrace), 'utf8');

        const result = verifyTraceFile(negTracePath, {
          expectedMode: 'intentional-broken-control',
          exitStatus: 1,
        });
        assert.equal(result.valid, true);
        assert.equal(result.code, 'TRACE_VERIFIED');

        // Mismatched failure code
        const wrongCodeTrace = {
          ...negTrace,
          failure: { stage: 'QA_EXECUTION', code: 'UNEXPECTED_ERROR' },
        };
        const wrongCodePath = path.join(dir, 'trace-wrong-code.json');
        writeFileSync(wrongCodePath, JSON.stringify(wrongCodeTrace), 'utf8');
        const wrongResult = verifyTraceFile(wrongCodePath, {
          expectedMode: 'intentional-broken-control',
          exitStatus: 1,
        });
        assert.equal(wrongResult.valid, false);
        assert.equal(wrongResult.code, 'NEGATIVE_CONTROL_CODE_MISMATCH');
      });
    });
  });

  describe('Server and Browser Lifecycle Helpers', () => {
    it('ensureAppServer rejects non-loopback origin', async () => {
      await assert.rejects(
        () =>
          ensureAppServer({
            app: 'http://example.com:3101',
          }),
        /Refusing a nonlocal or malformed target origin/i,
      );
    });

    it('ensureAppServer recognizes already-running healthy app server', async () => {
      const mockFetch = async (url) => {
        if (url === 'http://127.0.0.1:3101/health') {
          return { ok: true };
        }
        return { ok: false };
      };
      const result = await ensureAppServer({
        app: 'http://127.0.0.1:3101',
        fetchFn: mockFetch,
      });
      assert.equal(result.wasRunning, true);
      assert.equal(result.process, null);
    });

    it('terminateBrowser handles empty/mock handle safely', async () => {
      await assert.doesNotReject(() => terminateBrowser(null));
      await assert.doesNotReject(() => terminateBrowser({}));
      let closed = false;
      await assert.doesNotReject(() =>
        terminateBrowser({
          cdp: {
            close() {
              closed = true;
            },
          },
        }),
      );
      assert.equal(closed, true);
    });

    it('defaultBuildApp handles build errors and timeout safely', () => {
      assert.throws(
        () =>
          defaultBuildApp({
            spawnSyncFn: () => ({ status: 1, signal: null }),
          }),
        /Isolated app build failed/i,
      );

      assert.throws(
        () =>
          defaultBuildApp({
            spawnSyncFn: () => ({
              error: { code: 'ETIMEDOUT' },
              status: null,
              signal: null,
            }),
          }),
        /Isolated app build timed out/i,
      );
    });

    it('ensureAppServer invokes buildAppFn when server is not already running', async () => {
      let buildCalled = false;
      let spawnCalled = false;
      const mockSpawn = () => {
        spawnCalled = true;
        return {
          exitCode: null,
          signalCode: null,
        };
      };
      const mockBuild = async () => {
        buildCalled = true;
      };

      let fetchCount = 0;
      const probeFetch = async () => {
        fetchCount++;
        if (fetchCount === 1) {
          throw new Error('Connection refused');
        }
        return { ok: true };
      };

      const result = await ensureAppServer({
        app: 'http://127.0.0.1:3101',
        fetchFn: probeFetch,
        spawnFn: mockSpawn,
        buildAppFn: mockBuild,
      });

      assert.equal(buildCalled, true);
      assert.equal(spawnCalled, true);
      assert.equal(result.wasRunning, false);
    });
  });
});
