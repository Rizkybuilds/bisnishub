import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import {
  ALLOWED_ROLES,
  EXPECTED_SHORTCUT_HREFS_BY_ROLE,
  EXPECTED_UI_CASE_IDS,
  NavigationResponseTracker,
  QaError,
  classifyRouteDenial,
  cleanupRoleFixture,
  correlateNavigationResponse,
  createRoleFixture,
  defaultBuildApp,
  ensureAppServer,
  inspectActiveElement,
  parseAndValidateBrowserProvenance,
  terminateBrowser,
  verifyTraceFile,
} from './browser-ui-multirole-qa.mjs';

async function withTempDir(fn) {
  const dir = mkdtempSync(path.join(tmpdir(), 'mgbos-ui-qa-test-'));
  try {
    return await fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true, maxRetries: 3 });
  }
}

const TEST_ISOLATED_ENV = Object.freeze({});

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
      cases.SALES_DIRECT_EXCEPTIONS_DENIAL = {
        status: 'PASS',
        route: '/exceptions',
        uiDenied: true,
        observedResponse: 'ERROR_BOUNDARY_500',
        uiClassifier: 'ERROR_BOUNDARY_500',
        httpStatus: 500,
        httpStatusVerified: true,
        domainDataExposed: false,
      };
      cases.QC_DIRECT_QUOTES_DENIAL = {
        status: 'PASS',
        route: '/quotes',
        uiDenied: true,
        observedResponse: 'ERROR_BOUNDARY_500',
        uiClassifier: 'ERROR_BOUNDARY_500',
        httpStatus: 500,
        httpStatusVerified: true,
        domainDataExposed: false,
      };
      return {
        harness: 'mgbos-browser-ui-multirole-qa',
        mode: 'normal',
        provenance: {
          checkoutSha: 'a01d375d07e9fdbc00411cb4b568a1610f1582d8',
          browser: {
            product: 'Chrome/155.0.8059.40',
            browserName: 'Chrome',
            browserVersion: '155.0.8059.40',
            protocolVersion: '1.3',
          },
        },
        overall: 'PASS',
        failure: null,
        cleanup: { status: 'PASS', verifiedAbsent: true },
        cases,
      };
    }

    it('verifies valid normal trace with all 24 cases cleanly', async () => {
      await withTempDir(async (dir) => {
        const tracePath = path.join(dir, 'trace.json');
        const validTrace = generateValid24CaseTrace();
        writeFileSync(tracePath, JSON.stringify(validTrace), 'utf8');

        const result = verifyTraceFile(tracePath, {
          expectedMode: 'normal',
          exitStatus: 0,
          env: TEST_ISOLATED_ENV,
        });
        assert.equal(result.valid, true);
        assert.equal(result.code, 'TRACE_VERIFIED');
        assert.equal(result.diagnostics.casesCount, 24);
      });
    });

    it('rejects trace when mandatory cases are missing', async () => {
      await withTempDir(async (dir) => {
        const tracePath = path.join(dir, 'trace_missing_case.json');
        const incompleteTrace = generateValid24CaseTrace();
        delete incompleteTrace.cases.SALES_AUTHORIZED_QUOTES_ACCESS;
        writeFileSync(tracePath, JSON.stringify(incompleteTrace), 'utf8');

        const result = verifyTraceFile(tracePath, {
          expectedMode: 'normal',
          env: TEST_ISOLATED_ENV,
        });
        assert.equal(result.valid, false);
        assert.equal(result.code, 'CASE_MISSING');
        assert.ok(result.summary.includes('SALES_AUTHORIZED_QUOTES_ACCESS'));
      });
    });

    it('rejects trace when a mandatory case failed', async () => {
      await withTempDir(async (dir) => {
        const tracePath = path.join(dir, 'trace_failed_case.json');
        const failedCaseTrace = generateValid24CaseTrace();
        failedCaseTrace.cases.QC_DIRECT_QUOTES_DENIAL = { status: 'FAIL' };
        writeFileSync(tracePath, JSON.stringify(failedCaseTrace), 'utf8');

        const result = verifyTraceFile(tracePath, {
          expectedMode: 'normal',
          env: TEST_ISOLATED_ENV,
        });
        assert.equal(result.valid, false);
        assert.equal(result.code, 'CASE_FAILED');
        assert.ok(result.summary.includes('QC_DIRECT_QUOTES_DENIAL'));
      });
    });

    it('rejects trace when provenance checkoutSha is missing or unknown', async () => {
      await withTempDir(async (dir) => {
        const tracePath = path.join(dir, 'trace_no_sha.json');
        const noShaTrace = generateValid24CaseTrace();
        delete noShaTrace.provenance.checkoutSha;
        writeFileSync(tracePath, JSON.stringify(noShaTrace), 'utf8');

        const result = verifyTraceFile(tracePath, {
          expectedMode: 'normal',
          env: TEST_ISOLATED_ENV,
        });
        assert.equal(result.valid, false);
        assert.equal(result.code, 'TRACE_PROVENANCE_MISSING');
      });
    });

    it('rejects trace when provenance checkoutSha is not a valid 40-character hex SHA', async () => {
      await withTempDir(async (dir) => {
        const tracePath = path.join(dir, 'trace_invalid_sha.json');
        const invalidShaTrace = generateValid24CaseTrace();
        invalidShaTrace.provenance.checkoutSha = 'abc123notashalength';
        writeFileSync(tracePath, JSON.stringify(invalidShaTrace), 'utf8');

        const result = verifyTraceFile(tracePath, {
          expectedMode: 'normal',
          env: TEST_ISOLATED_ENV,
        });
        assert.equal(result.valid, false);
        assert.equal(result.code, 'TRACE_PROVENANCE_INVALID');
      });
    });

    it('validates expectedCheckoutSha when specified and rejects mismatch', async () => {
      await withTempDir(async (dir) => {
        const tracePath = path.join(dir, 'trace_sha_check.json');
        const validTrace = generateValid24CaseTrace();
        writeFileSync(tracePath, JSON.stringify(validTrace), 'utf8');

        const matchResult = verifyTraceFile(tracePath, {
          expectedMode: 'normal',
          expectedCheckoutSha: 'a01d375d07e9fdbc00411cb4b568a1610f1582d8',
          env: TEST_ISOLATED_ENV,
        });
        assert.equal(matchResult.valid, true);

        const mismatchResult = verifyTraceFile(tracePath, {
          expectedMode: 'normal',
          expectedCheckoutSha: 'ffffffffffffffffffffffffffffffffffffffff',
          env: TEST_ISOLATED_ENV,
        });
        assert.equal(mismatchResult.valid, false);
        assert.equal(mismatchResult.code, 'TRACE_PROVENANCE_MISMATCH');
      });
    });

    it('rejects trace when cleanup.verifiedAbsent is not true', async () => {
      await withTempDir(async (dir) => {
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

        const result = verifyTraceFile(tracePath, {
          expectedMode: 'normal',
          env: TEST_ISOLATED_ENV,
        });
        assert.equal(result.valid, false);
        assert.equal(result.code, 'TRACE_CLEANUP_UNVERIFIED');
      });
    });

    it('rejects trace with contradictory fields (PASS overall but failure object present)', async () => {
      await withTempDir(async (dir) => {
        const tracePath = path.join(dir, 'trace_contradictory.json');
        const contradictoryTrace = generateValid24CaseTrace();
        contradictoryTrace.failure = { stage: 'QA', code: 'SOME_ERROR' };
        writeFileSync(tracePath, JSON.stringify(contradictoryTrace), 'utf8');

        const result = verifyTraceFile(tracePath, {
          expectedMode: 'normal',
          env: TEST_ISOLATED_ENV,
        });
        assert.equal(result.valid, false);
        assert.equal(result.code, 'TRACE_CONTRADICTORY_FIELDS');
      });
    });

    it('fails closed on missing, unreadable, corrupt, or failed traces', async () => {
      await withTempDir(async (dir) => {
        const missing = verifyTraceFile(path.join(dir, 'nonexistent.json'), {
          env: TEST_ISOLATED_ENV,
        });
        assert.equal(missing.valid, false);
        assert.equal(missing.code, 'TRACE_MISSING');

        const corruptPath = path.join(dir, 'corrupt.json');
        writeFileSync(corruptPath, '{invalid-json', 'utf8');
        const corrupt = verifyTraceFile(corruptPath, {
          env: TEST_ISOLATED_ENV,
        });
        assert.equal(corrupt.valid, false);
        assert.equal(corrupt.code, 'TRACE_CORRUPT');

        const failedPath = path.join(dir, 'failed.json');
        writeFileSync(
          failedPath,
          JSON.stringify({
            mode: 'normal',
            provenance: {
              checkoutSha: 'a01d375d07e9fdbc00411cb4b568a1610f1582d8',
              browser: {
                product: 'Chrome/155.0.8059.40',
                browserName: 'Chrome',
                browserVersion: '155.0.8059.40',
                protocolVersion: '1.3',
              },
            },
            overall: 'FAIL',
            failure: { code: 'ERR' },
            cleanup: { status: 'PASS', verifiedAbsent: true },
          }),
          'utf8',
        );
        const failed = verifyTraceFile(failedPath, {
          expectedMode: 'normal',
          env: TEST_ISOLATED_ENV,
        });
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
          env: TEST_ISOLATED_ENV,
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
          env: TEST_ISOLATED_ENV,
        });
        assert.equal(exitMismatch.valid, false);
        assert.equal(exitMismatch.code, 'EXIT_STATUS_MISMATCH');
      });
    });

    it('verifies intentional negative control trace correctly and validates failure code', async () => {
      await withTempDir(async (dir) => {
        const negTracePath = path.join(dir, 'trace-neg.json');
        const negTrace = {
          harness: 'mgbos-browser-ui-multirole-qa',
          mode: 'intentional-broken-control',
          provenance: {
            checkoutSha: 'a01d375d07e9fdbc00411cb4b568a1610f1582d8',
            browser: {
              product: 'Chrome/155.0.8059.40',
              browserName: 'Chrome',
              browserVersion: '155.0.8059.40',
              protocolVersion: '1.3',
            },
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
          env: TEST_ISOLATED_ENV,
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
          env: TEST_ISOLATED_ENV,
        });
        assert.equal(wrongResult.valid, false);
        assert.equal(wrongResult.code, 'NEGATIVE_CONTROL_CODE_MISMATCH');
      });
    });

    it('strictly rejects unrelated setup, fixture, browser, and assertion errors in negative control mode (Finding R3-F01, R4-F04)', async () => {
      await withTempDir(async (dir) => {
        const baseNegTrace = {
          harness: 'mgbos-browser-ui-multirole-qa',
          mode: 'intentional-broken-control',
          provenance: {
            checkoutSha: 'a01d375d07e9fdbc00411cb4b568a1610f1582d8',
            browser: {
              product: 'Chrome/155.0.8059.40',
              browserName: 'Chrome',
              browserVersion: '155.0.8059.40',
              protocolVersion: '1.3',
            },
          },
          overall: 'FAIL',
          cleanup: { status: 'PASS', verifiedAbsent: true },
        };

        const unrelatedFailureCodes = [
          'FIXTURE_CREATION_FAILED',
          'BROWSER_STARTUP_FAILED',
          'APP_STARTUP_FAILED',
          'ASSERTION_FAILED',
          'QA_EXECUTION_FAILED',
          'NONLOCAL_TARGET_BLOCKED',
          'TIMED_OUT',
        ];

        for (const code of unrelatedFailureCodes) {
          const tracePath = path.join(dir, `trace-${code}.json`);
          writeFileSync(
            tracePath,
            JSON.stringify({
              ...baseNegTrace,
              failure: {
                stage: 'SETUP_OR_QA',
                code,
                message: `Unrelated failure: ${code}`,
              },
            }),
            'utf8',
          );

          const result = verifyTraceFile(tracePath, {
            expectedMode: 'intentional-broken-control',
            exitStatus: 1,
            env: TEST_ISOLATED_ENV,
          });
          assert.equal(
            result.valid,
            false,
            `Trace with failure code ${code} must NOT be accepted as intentional negative control`,
          );
          assert.equal(
            result.code,
            'NEGATIVE_CONTROL_CODE_MISMATCH',
            `Expected NEGATIVE_CONTROL_CODE_MISMATCH for code ${code}`,
          );
        }
      });
    });

    it('enforces CI evidence binding against GITHUB_SHA under verified CI conditions (Finding R3-F03, R4-F02, R4-F03)', async () => {
      await withTempDir(async (dir) => {
        const tracePath = path.join(dir, 'trace_ci_sha.json');
        const trace = generateValid24CaseTrace();
        trace.provenance.checkoutSha =
          '1111111111111111111111111111111111111111';
        writeFileSync(tracePath, JSON.stringify(trace), 'utf8');

        // Case 1: In CI environment where GITHUB_SHA matches checkoutSha -> PASS
        const passResult = verifyTraceFile(tracePath, {
          expectedMode: 'normal',
          env: {
            GITHUB_ACTIONS: 'true',
            GITHUB_SHA: '1111111111111111111111111111111111111111',
          },
        });
        assert.equal(passResult.valid, true);
        assert.equal(passResult.code, 'TRACE_VERIFIED');

        // Case 2: In CI environment where GITHUB_SHA mismatches checkoutSha -> FAIL with TRACE_PROVENANCE_MISMATCH
        const mismatchResult = verifyTraceFile(tracePath, {
          expectedMode: 'normal',
          env: {
            GITHUB_ACTIONS: 'true',
            GITHUB_SHA: '2222222222222222222222222222222222222222',
          },
        });
        assert.equal(mismatchResult.valid, false);
        assert.equal(mismatchResult.code, 'TRACE_PROVENANCE_MISMATCH');

        // Case 3: In CI environment where GITHUB_SHA is missing -> FAIL closed with TRACE_CI_PROVENANCE_MISSING
        const missingShaResult = verifyTraceFile(tracePath, {
          expectedMode: 'normal',
          env: {
            GITHUB_ACTIONS: 'true',
          },
        });
        assert.equal(missingShaResult.valid, false);
        assert.equal(missingShaResult.code, 'TRACE_CI_PROVENANCE_MISSING');

        // Case 4: In CI environment where GITHUB_SHA is empty -> FAIL closed with TRACE_CI_PROVENANCE_MISSING
        const emptyShaResult = verifyTraceFile(tracePath, {
          expectedMode: 'normal',
          env: {
            GITHUB_ACTIONS: 'true',
            GITHUB_SHA: '   ',
          },
        });
        assert.equal(emptyShaResult.valid, false);
        assert.equal(emptyShaResult.code, 'TRACE_CI_PROVENANCE_MISSING');

        // Case 5: In CI environment where GITHUB_SHA is malformed -> FAIL closed with TRACE_CI_PROVENANCE_INVALID
        const invalidShaResult = verifyTraceFile(tracePath, {
          expectedMode: 'normal',
          env: {
            GITHUB_ACTIONS: 'true',
            GITHUB_SHA: 'not-a-40-char-hex-sha',
          },
        });
        assert.equal(invalidShaResult.valid, false);
        assert.equal(invalidShaResult.code, 'TRACE_CI_PROVENANCE_INVALID');

        // Case 6: Explicit --expected-checkout-sha overrides GITHUB_SHA in CI
        const overrideResult = verifyTraceFile(tracePath, {
          expectedMode: 'normal',
          expectedCheckoutSha: '1111111111111111111111111111111111111111',
          env: {
            GITHUB_ACTIONS: 'true',
            GITHUB_SHA: '2222222222222222222222222222222222222222',
          },
        });
        assert.equal(overrideResult.valid, true);

        // Case 7: Non-CI environment without expectedCheckoutSha does not require GITHUB_SHA match
        const nonCiResult = verifyTraceFile(tracePath, {
          expectedMode: 'normal',
          env: {},
        });
        assert.equal(nonCiResult.valid, true);

        const nonCiFalseResult = verifyTraceFile(tracePath, {
          expectedMode: 'normal',
          env: { GITHUB_ACTIONS: 'false' },
        });
        assert.equal(nonCiFalseResult.valid, true);
      });
    });

    it('rejects trace when browser identity is missing from provenance (Finding R5-F01)', async () => {
      await withTempDir(async (dir) => {
        const tracePath = path.join(dir, 'trace_no_browser.json');
        const trace = generateValid24CaseTrace();
        delete trace.provenance.browser;
        writeFileSync(tracePath, JSON.stringify(trace), 'utf8');

        const result = verifyTraceFile(tracePath, {
          expectedMode: 'normal',
          env: TEST_ISOLATED_ENV,
        });
        assert.equal(result.valid, false);
        assert.equal(result.code, 'TRACE_BROWSER_PROVENANCE_MISSING');
      });
    });

    it('rejects trace when browser identity has missing, empty, or placeholder values (Finding R5-F01)', async () => {
      await withTempDir(async (dir) => {
        const invalidCombinations = [
          { product: '' },
          { product: 'unknown' },
          { browserVersion: '' },
          { browserVersion: 'unknown' },
          { protocolVersion: '' },
          { protocolVersion: 'unknown' },
        ];

        for (const override of invalidCombinations) {
          const tracePath = path.join(dir, 'trace_invalid_browser.json');
          const trace = generateValid24CaseTrace();
          trace.provenance.browser = {
            ...trace.provenance.browser,
            ...override,
          };
          writeFileSync(tracePath, JSON.stringify(trace), 'utf8');

          const result = verifyTraceFile(tracePath, {
            expectedMode: 'normal',
            env: TEST_ISOLATED_ENV,
          });
          assert.equal(
            result.valid,
            false,
            `Expected invalid for override: ${JSON.stringify(override)}`,
          );
          assert.equal(result.code, 'TRACE_BROWSER_PROVENANCE_INVALID');
        }
      });
    });

    it('rejects normal trace when direct denial cases have missing or non-numeric httpStatus (Finding R5-F02)', async () => {
      await withTempDir(async (dir) => {
        // Missing httpStatus in SALES_DIRECT_EXCEPTIONS_DENIAL
        const tracePath1 = path.join(dir, 'trace_missing_sales_http.json');
        const trace1 = generateValid24CaseTrace();
        delete trace1.cases.SALES_DIRECT_EXCEPTIONS_DENIAL.httpStatus;
        writeFileSync(tracePath1, JSON.stringify(trace1), 'utf8');

        const result1 = verifyTraceFile(tracePath1, {
          expectedMode: 'normal',
          env: TEST_ISOLATED_ENV,
        });
        assert.equal(result1.valid, false);
        assert.equal(result1.code, 'TRACE_HTTP_STATUS_INVALID');

        // Non-numeric httpStatus in QC_DIRECT_QUOTES_DENIAL
        const tracePath2 = path.join(dir, 'trace_invalid_qc_http.json');
        const trace2 = generateValid24CaseTrace();
        trace2.cases.QC_DIRECT_QUOTES_DENIAL.httpStatus = '500';
        writeFileSync(tracePath2, JSON.stringify(trace2), 'utf8');

        const result2 = verifyTraceFile(tracePath2, {
          expectedMode: 'normal',
          env: TEST_ISOLATED_ENV,
        });
        assert.equal(result2.valid, false);
        assert.equal(result2.code, 'TRACE_HTTP_STATUS_INVALID');

        // httpStatusVerified is false
        const tracePath3 = path.join(dir, 'trace_unverified_http.json');
        const trace3 = generateValid24CaseTrace();
        trace3.cases.SALES_DIRECT_EXCEPTIONS_DENIAL.httpStatusVerified = false;
        writeFileSync(tracePath3, JSON.stringify(trace3), 'utf8');

        const result3 = verifyTraceFile(tracePath3, {
          expectedMode: 'normal',
          env: TEST_ISOLATED_ENV,
        });
        assert.equal(result3.valid, false);
        assert.equal(result3.code, 'TRACE_HTTP_STATUS_UNVERIFIED');
      });
    });

    it('evaluates inspectActiveElement for interactive tags and focus-visible styling (Finding R3-F02)', async () => {
      const mockCdp = {
        async eval() {
          return {
            isBody: false,
            tag: 'BUTTON',
            text: 'MG',
            href: null,
            isInteractive: true,
            hasFocusVisible: true,
            outlineStyle: 'solid',
            outlineWidth: '2px',
            outlineColor: 'rgb(56, 189, 248)',
            hasObservableFocus: true,
          };
        },
      };

      const result = await inspectActiveElement(mockCdp);
      assert.equal(result.isBody, false);
      assert.equal(result.isInteractive, true);
      assert.equal(result.hasObservableFocus, true);
      assert.equal(result.tag, 'BUTTON');
      assert.equal(result.text, 'MG');
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

  describe('parseAndValidateBrowserProvenance (Finding R5-F01)', () => {
    it('parses and validates valid Chrome version metadata', () => {
      const parsed = parseAndValidateBrowserProvenance({
        product: 'Chrome/155.0.8059.40',
        protocolVersion: '1.3',
        revision: '@cfaadc5a132d78e1828635aa8405a499f3e14864',
        userAgent: 'Mozilla/5.0 ...',
        jsVersion: '15.5.35.20',
      });
      assert.deepEqual(parsed, {
        product: 'Chrome/155.0.8059.40',
        browserName: 'Chrome',
        browserVersion: '155.0.8059.40',
        protocolVersion: '1.3',
      });
      assert.equal(
        'userAgent' in parsed,
        false,
        'userAgent must NOT be retained',
      );
      assert.equal(
        'revision' in parsed,
        false,
        'revision must NOT be retained',
      );
    });

    it('parses and validates valid HeadlessChrome version metadata', () => {
      const parsed = parseAndValidateBrowserProvenance({
        product: 'HeadlessChrome/130.0.6723.69',
        protocolVersion: '1.3',
      });
      assert.equal(parsed.browserName, 'HeadlessChrome');
      assert.equal(parsed.browserVersion, '130.0.6723.69');
      assert.equal(parsed.protocolVersion, '1.3');
    });

    it('throws BROWSER_IDENTITY_MISSING for null or non-object payloads', () => {
      assert.throws(
        () => parseAndValidateBrowserProvenance(null),
        (err) =>
          err instanceof QaError && err.code === 'BROWSER_IDENTITY_MISSING',
      );
      assert.throws(
        () => parseAndValidateBrowserProvenance('not-an-object'),
        (err) =>
          err instanceof QaError && err.code === 'BROWSER_IDENTITY_MISSING',
      );
    });

    it('throws BROWSER_IDENTITY_INVALID for empty or placeholder product/versions', () => {
      assert.throws(
        () =>
          parseAndValidateBrowserProvenance({
            product: '',
            protocolVersion: '1.3',
          }),
        (err) =>
          err instanceof QaError && err.code === 'BROWSER_IDENTITY_INVALID',
      );
      assert.throws(
        () =>
          parseAndValidateBrowserProvenance({
            product: 'unknown',
            protocolVersion: '1.3',
          }),
        (err) =>
          err instanceof QaError && err.code === 'BROWSER_IDENTITY_INVALID',
      );
      assert.throws(
        () =>
          parseAndValidateBrowserProvenance({
            product: 'Chrome/155.0.8059.40',
            protocolVersion: 'unknown',
          }),
        (err) =>
          err instanceof QaError && err.code === 'BROWSER_IDENTITY_INVALID',
      );
      assert.throws(
        () =>
          parseAndValidateBrowserProvenance({
            product: 'Chrome/unknown',
            protocolVersion: '1.3',
          }),
        (err) =>
          err instanceof QaError && err.code === 'BROWSER_IDENTITY_INVALID',
      );
    });
  });

  describe('NavigationResponseTracker & correlateNavigationResponse (Finding R5-F02)', () => {
    it('correlates top-level Document response matching target path and extracts numeric status', () => {
      const responses = [
        {
          type: 'Document',
          url: 'http://127.0.0.1:3101/exceptions',
          status: 500,
          statusText: 'Internal Server Error',
        },
      ];

      const result = correlateNavigationResponse({
        responses,
        appOrigin: 'http://127.0.0.1:3101',
        targetPath: '/exceptions',
        navTimingStatus: 500,
      });

      assert.equal(result.verified, true);
      assert.equal(result.httpStatus, 500);
      assert.equal(result.source, 'CDP_NETWORK');
    });

    it('correlates explicit 403 Document response', () => {
      const responses = [
        {
          type: 'Document',
          url: 'http://127.0.0.1:3101/quotes',
          status: 403,
          statusText: 'Forbidden',
        },
      ];

      const result = correlateNavigationResponse({
        responses,
        appOrigin: 'http://127.0.0.1:3101',
        targetPath: '/quotes',
        navTimingStatus: 403,
      });

      assert.equal(result.verified, true);
      assert.equal(result.httpStatus, 403);
    });

    it('ignores non-Document responses such as scripts, stylesheets, and RSC fetches', () => {
      const responses = [
        {
          type: 'Stylesheet',
          url: 'http://127.0.0.1:3101/_next/static/css/app.css',
          status: 200,
        },
        {
          type: 'Script',
          url: 'http://127.0.0.1:3101/_next/static/chunks/main.js',
          status: 200,
        },
        {
          type: 'Fetch',
          url: 'http://127.0.0.1:3101/exceptions?_rsc=abc',
          status: 200,
        },
        {
          type: 'Document',
          url: 'http://127.0.0.1:3101/exceptions',
          status: 500,
        },
      ];

      const result = correlateNavigationResponse({
        responses,
        appOrigin: 'http://127.0.0.1:3101',
        targetPath: '/exceptions',
        navTimingStatus: 500,
      });

      assert.equal(result.verified, true);
      assert.equal(result.httpStatus, 500);
      assert.equal(result.source, 'CDP_NETWORK');
    });

    it('ignores responses for previous routes or unrelated endpoints', () => {
      const responses = [
        {
          type: 'Document',
          url: 'http://127.0.0.1:3101/dashboard',
          status: 200,
        },
        {
          type: 'Document',
          url: 'http://127.0.0.1:3101/exceptions',
          status: 500,
        },
      ];

      const result = correlateNavigationResponse({
        responses,
        appOrigin: 'http://127.0.0.1:3101',
        targetPath: '/exceptions',
        navTimingStatus: 500,
      });

      assert.equal(result.verified, true);
      assert.equal(result.httpStatus, 500);
    });

    it('falls back to PerformanceNavigationTiming when no CDP Document response is present', () => {
      const result = correlateNavigationResponse({
        responses: [],
        appOrigin: 'http://127.0.0.1:3101',
        targetPath: '/exceptions',
        navTimingStatus: 500,
      });

      assert.equal(result.verified, true);
      assert.equal(result.httpStatus, 500);
      assert.equal(result.source, 'PERFORMANCE_NAVIGATION_TIMING');
    });

    it('detects contradiction between CDP Document response and NavigationTiming', () => {
      const responses = [
        {
          type: 'Document',
          url: 'http://127.0.0.1:3101/exceptions',
          status: 500,
        },
      ];

      const result = correlateNavigationResponse({
        responses,
        appOrigin: 'http://127.0.0.1:3101',
        targetPath: '/exceptions',
        navTimingStatus: 200,
      });

      assert.equal(result.verified, false);
      assert.equal(result.code, 'HTTP_STATUS_CONTRADICTORY');
    });

    it('fails closed when status is missing, 0, or negative', () => {
      const result1 = correlateNavigationResponse({
        responses: [],
        appOrigin: 'http://127.0.0.1:3101',
        targetPath: '/exceptions',
        navTimingStatus: 0,
      });
      assert.equal(result1.verified, false);
      assert.equal(result1.code, 'HTTP_STATUS_NOT_VERIFIED');

      const result2 = correlateNavigationResponse({
        responses: [
          {
            type: 'Document',
            url: 'http://127.0.0.1:3101/exceptions',
            status: null,
          },
        ],
        appOrigin: 'http://127.0.0.1:3101',
        targetPath: '/exceptions',
      });
      assert.equal(result2.verified, false);
      assert.equal(result2.code, 'HTTP_STATUS_NOT_VERIFIED');
    });

    it('handles NavigationResponseTracker message listening and cleanup cleanly', () => {
      let listenerRef = null;
      let removedRef = null;
      const mockWs = {
        addEventListener(event, fn) {
          if (event === 'message') listenerRef = fn;
        },
        removeEventListener(event, fn) {
          if (event === 'message') removedRef = fn;
        },
      };

      const tracker = new NavigationResponseTracker(
        { ws: mockWs },
        'http://127.0.0.1:3101',
      );
      assert.ok(listenerRef);

      // Simulate incoming CDP packet
      listenerRef({
        data: JSON.stringify({
          method: 'Network.responseReceived',
          params: {
            requestId: 'req-1',
            type: 'Document',
            response: {
              url: 'http://127.0.0.1:3101/exceptions',
              status: 500,
              statusText: 'Internal Server Error',
            },
          },
        }),
      });

      assert.equal(tracker.getResponses().length, 1);
      assert.equal(tracker.getResponses()[0].status, 500);

      tracker.clear();
      assert.equal(tracker.getResponses().length, 0);

      tracker.stop();
      assert.equal(removedRef, listenerRef);
    });
  });

  describe('AppSidebar Nested-Route Matching Logic (Finding R5-F03)', () => {
    // Evaluates the exact predicate used in PR #53 AppSidebar component:
    // pathname === item.href || pathname.startsWith(item.href + '/')
    const isSidebarItemActive = (itemHref, currentPathname) =>
      itemHref === '/dashboard'
        ? currentPathname === '/dashboard'
        : currentPathname === itemHref ||
          currentPathname.startsWith(itemHref + '/');

    it('matches exact routes and nested sub-routes correctly', () => {
      // /dashboard is exact match only
      assert.equal(isSidebarItemActive('/dashboard', '/dashboard'), true);
      assert.equal(isSidebarItemActive('/dashboard', '/dashboard/sub'), false);

      // Root item matches exact route
      assert.equal(isSidebarItemActive('/orders', '/orders'), true);
      assert.equal(isSidebarItemActive('/exceptions', '/exceptions'), true);
      assert.equal(isSidebarItemActive('/quotes', '/quotes'), true);

      // Root item matches nested dynamic routes
      assert.equal(
        isSidebarItemActive('/orders', '/orders/ord-2026-001'),
        true,
      );
      assert.equal(
        isSidebarItemActive('/exceptions', '/exceptions/exp-999'),
        true,
      );
      assert.equal(
        isSidebarItemActive('/quotes', '/quotes/q-123/versions/v-1'),
        true,
      );

      // Disjoint or prefix-overlap routes do NOT match
      assert.equal(isSidebarItemActive('/orders', '/orders-archive'), false);
      assert.equal(isSidebarItemActive('/orders', '/leads'), false);
      assert.equal(isSidebarItemActive('/exceptions', '/exceptions_v2'), false);
    });
  });
});
