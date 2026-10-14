import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import {
  ALLOWED_ROLES,
  EXPECTED_SHORTCUT_HREFS_BY_ROLE,
  EXPECTED_UI_CASE_IDS,
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

    assert.equal(EXPECTED_UI_CASE_IDS.length, 18);
    assert.ok(EXPECTED_UI_CASE_IDS.includes('OWNER_DASHBOARD_1440'));
    assert.ok(EXPECTED_UI_CASE_IDS.includes('OWNER_DASHBOARD_1024'));
    assert.ok(EXPECTED_UI_CASE_IDS.includes('SALES_DIRECT_EXCEPTIONS_DENIAL'));
    assert.ok(EXPECTED_UI_CASE_IDS.includes('QC_DIRECT_QUOTES_DENIAL'));
  });

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

  it('verifies valid normal trace files cleanly', () => {
    withTempDir((dir) => {
      const tracePath = path.join(dir, 'trace.json');
      const validTrace = {
        harness: 'mgbos-browser-ui-multirole-qa',
        mode: 'normal',
        overall: 'PASS',
        cleanup: { status: 'PASS' },
        cases: {
          OWNER_DASHBOARD_1440: { status: 'PASS' },
          SALES_DASHBOARD: { status: 'PASS' },
        },
      };
      writeFileSync(tracePath, JSON.stringify(validTrace), 'utf8');

      const result = verifyTraceFile(tracePath, {
        expectedMode: 'normal',
        exitStatus: 0,
      });
      assert.equal(result.valid, true);
      assert.equal(result.code, 'TRACE_VERIFIED');
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
          overall: 'FAIL',
          cleanup: { status: 'PASS' },
        }),
        'utf8',
      );
      const failed = verifyTraceFile(failedPath, { expectedMode: 'normal' });
      assert.equal(failed.valid, false);
      assert.equal(failed.code, 'TRACE_OVERALL_FAILED');

      const failedCleanupPath = path.join(dir, 'failed_cleanup.json');
      writeFileSync(
        failedCleanupPath,
        JSON.stringify({
          mode: 'normal',
          overall: 'PASS',
          cleanup: { status: 'FAIL' },
        }),
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
        JSON.stringify({
          mode: 'normal',
          overall: 'PASS',
          cleanup: { status: 'PASS' },
        }),
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

  it('verifies intentional negative control trace correctly', () => {
    withTempDir((dir) => {
      const negTracePath = path.join(dir, 'trace-neg.json');
      const negTrace = {
        harness: 'mgbos-browser-ui-multirole-qa',
        mode: 'intentional-broken-control',
        overall: 'FAIL',
        cleanup: { status: 'PASS' },
        failure: {
          stage: 'QA_EXECUTION',
          code: 'NEGATIVE_CONTROL_FAILED',
        },
      };
      writeFileSync(negTracePath, JSON.stringify(negTrace), 'utf8');

      const result = verifyTraceFile(negTracePath, {
        expectedMode: 'intentional-broken-control',
        exitStatus: 1,
      });
      assert.equal(result.valid, true);
      assert.equal(result.code, 'TRACE_VERIFIED');
    });
  });

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
