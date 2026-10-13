import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  CANONICAL_API_ORIGIN,
  CANONICAL_APP_ORIGIN,
  EXPECTED_POSITIVE_CASE_IDS,
  QaError,
  assertConsistentSupabaseEnv,
  assertLoopbackHttpOrigin,
  assertSanitizedEvidence,
  cleanup,
  createFixture,
  createFixtureState,
  db,
  isValidConfirmedMembershipResponse,
  localStatus,
  resolveLoopbackRequestUrl,
  runBrowser,
  runQaHarness,
  startBrowser,
  terminateSubprocess,
  validateTraceReport,
  verifyTraceFile,
  writeSanitizedTrace,
} from './browser-auth-hygiene-qa.mjs';

const scriptPath = fileURLToPath(
  new URL('./browser-auth-hygiene-qa.mjs', import.meta.url),
);
const workdir = fileURLToPath(new URL('../', import.meta.url));

function withTempDir(fn) {
  const dir = mkdtempSync(path.join(tmpdir(), 'mgbos-auth-qa-test-'));
  return Promise.resolve()
    .then(() => fn(dir))
    .finally(() => {
      rmSync(dir, { recursive: true, force: true, maxRetries: 3 });
    });
}

function createFakeProcess() {
  return {
    pid: 999999,
    exitCode: null,
    signalCode: null,
    once(event, handler) {
      if (event === 'exit' || event === 'close') {
        setTimeout(handler, 5);
      }
    },
    removeListener() {},
    kill() {
      this.exitCode = 0;
    },
  };
}

function createMockCdp({
  validLoginOutcome = 'authenticated',
  emitValidLoginPost = true,
  onValidSubmit,
} = {}) {
  let route = '/login';
  let invalidAlert = false;
  let validAlert = false;
  let authenticated = false;
  let sessionCookies = [];
  let customCookie = null;
  const posts = { '/login': 0, '/dashboard': 0 };

  return {
    assertConnected() {},
    close() {},
    posts(targetRoute) {
      return posts[targetRoute] ?? 0;
    },
    async session() {
      return sessionCookies.map((cookie) => ({
        httpOnly: cookie.httpOnly,
        sameSite: cookie.sameSite,
        secure: cookie.secure,
      }));
    },
    async screenshot(file) {
      writeFileSync(file, Buffer.from('89504e47', 'hex'));
    },
    async goto(targetRoute, expectedRoute = targetRoute, { checkHealth } = {}) {
      if (checkHealth) await checkHealth();
      if (
        (targetRoute === '/dashboard' ||
          targetRoute === '/orders' ||
          targetRoute === '/exceptions') &&
        !authenticated
      ) {
        route = '/login';
        invalidAlert = false;
        validAlert = false;
      } else {
        route = expectedRoute;
      }
    },
    async send(method, params = {}) {
      if (method === 'Network.clearBrowserCookies') {
        sessionCookies = [];
        customCookie = null;
        return {};
      }
      if (method === 'Network.setCookie') {
        customCookie = { name: params.name, value: params.value };
        return { success: true };
      }
      if (method === 'Network.getCookies') {
        return {
          cookies: customCookie ? [customCookie] : sessionCookies,
        };
      }
      return {};
    },
    async eval(expression) {
      if (
        expression.includes('input[name="email"]') &&
        expression.includes('auth-card footer')
      ) {
        return true;
      }
      if (
        expression.startsWith(
          'Boolean(document.querySelector(\'input[name="email"]\'))',
        )
      ) {
        return true;
      }
      if (
        expression.includes(
          'form.requestSubmit(form.querySelector(\'button[type="submit"]\'))',
        )
      ) {
        if (expression.includes('ci-invalid@example.test')) {
          posts['/login'] += 1;
          invalidAlert = true;
          route = '/login';
          return true;
        }
        if (emitValidLoginPost) {
          posts['/login'] += 1;
        }
        if (onValidSubmit) {
          await onValidSubmit();
        }
        if (validLoginOutcome === 'authenticated') {
          authenticated = true;
          route = '/dashboard';
          sessionCookies = [
            {
              name: 'mgbos_session',
              httpOnly: true,
              sameSite: 'Lax',
              secure: false,
            },
          ];
        } else if (validLoginOutcome === 'rejected-alert') {
          authenticated = false;
          route = '/login';
          validAlert = true;
          sessionCookies = [];
        } else if (validLoginOutcome === 'hang-no-alert') {
          authenticated = false;
          route = '/login';
          validAlert = false;
          sessionCookies = [];
        }
        return true;
      }
      if (
        expression ===
        'location.pathname === "/login" && Boolean(document.querySelector(\'[role="alert"]\'))'
      ) {
        return route === '/login' && invalidAlert;
      }
      if (expression.includes('rejectedOnLogin')) {
        return {
          pathname: route,
          ready: 'complete',
          authenticated: route === '/dashboard' && authenticated,
          rejectedOnLogin: route === '/login' && validAlert,
        };
      }
      if (expression.includes("textContent?.includes('Keluar')")) {
        posts['/dashboard'] += 1;
        authenticated = false;
        sessionCookies = [];
        route = '/login';
        return true;
      }
      if (expression === 'location.pathname === "/login"') {
        return route === '/login';
      }
      return false;
    },
  };
}

function defaultStubDependencies(overrides = {}) {
  const fakeApp = createFakeProcess();
  const fakeBrowserProc = createFakeProcess();
  const mockCdp = createMockCdp();
  return {
    localStatusFn: async () => ({
      API_URL: CANONICAL_API_ORIGIN,
      ANON_KEY: 'synthetic_anon_key_value_for_unit_test_only',
      SERVICE_ROLE_KEY: 'synthetic_service_key_value_for_unit_test_only',
    }),
    buildAppFn: async () => {},
    createFixtureFn: async () => ({
      email: 'ci-auth-synthetic@example.test',
      password: 'synthetic_password_value_for_unit_test_only',
      auth: '00000000-0000-4000-8000-000000000001',
      profile: '00000000-0000-4000-8000-000000000002',
    }),
    startAppFn: async () => fakeApp,
    startBrowserFn: async () => ({
      browser: fakeBrowserProc,
      cdp: mockCdp,
      profile: null,
    }),
    cleanupFn: async () => ({ attempted: true, status: 'PASS' }),
    terminateSubprocessFn: async () => ({ terminated: true, forced: false }),
    ...overrides,
  };
}

describe('MGBOS browser-auth QA reliability and negative-control gate', () => {
  it('verifies normal positive browser-auth run and persists complete sanitized trace', async () => {
    await withTempDir(async (artifactDir) => {
      const deps = defaultStubDependencies();
      const { evidence, failure, tracePath } = await runQaHarness({
        ...deps,
        artifactDir,
        negativeControl: false,
      });

      assert.equal(failure, false);
      assert.equal(evidence.mode, 'normal');
      assert.equal(evidence.overall, 'PASS');
      assert.equal(evidence.failure, undefined);
      assert.equal(evidence.cleanup.status, 'PASS');
      assert.deepEqual(
        evidence.cases.map((item) => item.caseId),
        EXPECTED_POSITIVE_CASE_IDS,
      );
      assert.ok(existsSync(path.join(artifactDir, 'anonymous-login.png')));

      const verification = verifyTraceFile(tracePath, {
        expectedMode: 'normal',
        exitStatus: 0,
      });
      assert.equal(verification.valid, true);
      assert.equal(verification.code, 'POSITIVE_TRACE_VERIFIED');

      const wrongModeCheck = verifyTraceFile(tracePath, {
        expectedMode: 'intentional-broken-login',
        exitStatus: 1,
      });
      assert.equal(wrongModeCheck.valid, false);
      assert.equal(wrongModeCheck.code, 'TRACE_MODE_MISMATCH');
    });
  });

  it('verifies intentional broken-login negative control fails for AUTH_VALID_LOGIN_DID_NOT_COMPLETE', async () => {
    await withTempDir(async (artifactDir) => {
      const mockCdp = createMockCdp({ validLoginOutcome: 'rejected-alert' });
      const deps = defaultStubDependencies({
        startBrowserFn: async () => ({
          browser: createFakeProcess(),
          cdp: mockCdp,
          profile: null,
        }),
      });

      const { evidence, failure, tracePath } = await runQaHarness({
        ...deps,
        artifactDir,
        negativeControl: true,
      });

      assert.equal(failure, true);
      assert.equal(evidence.mode, 'intentional-broken-login');
      assert.equal(evidence.overall, 'FAIL');
      assert.equal(evidence.failure?.stage, 'BROWSER_AUTH');
      assert.equal(evidence.failure?.code, 'AUTH_VALID_LOGIN_DID_NOT_COMPLETE');
      assert.equal(evidence.cleanup.status, 'PASS');
      assert.deepEqual(
        evidence.cases.map((item) => `${item.caseId}:${item.verdict}`),
        [
          'AUTH-BLANK-01:PASS',
          'AUTH-INVALID-01:PASS',
          'AUTH-DENY-01:PASS',
          'AUTH-VALID-01:FAIL',
        ],
      );

      const verification = verifyTraceFile(tracePath, {
        expectedMode: 'intentional-broken-login',
        exitStatus: 1,
      });
      assert.equal(verification.valid, true);
      assert.equal(verification.code, 'NEGATIVE_CONTROL_TRACE_VERIFIED');

      const zeroExitVerification = verifyTraceFile(tracePath, {
        expectedMode: 'intentional-broken-login',
        exitStatus: 0,
      });
      assert.equal(zeroExitVerification.valid, false);
      assert.equal(
        zeroExitVerification.code,
        'NEGATIVE_CONTROL_UNEXPECTED_ZERO_EXIT',
      );
    });
  });

  it('classifies dashboard timeout after observed login POST with healthy processes as AUTH_VALID_LOGIN_DID_NOT_COMPLETE', async () => {
    await withTempDir(async (artifactDir) => {
      const mockCdp = createMockCdp({ validLoginOutcome: 'hang-no-alert' });
      const deps = defaultStubDependencies({
        startBrowserFn: async () => ({
          browser: createFakeProcess(),
          cdp: mockCdp,
          profile: null,
        }),
      });

      const { evidence, failure, tracePath } = await runQaHarness({
        ...deps,
        artifactDir,
        negativeControl: true,
        loginTimeoutMs: 400,
      });

      assert.equal(failure, true);
      assert.equal(evidence.failure?.code, 'AUTH_VALID_LOGIN_DID_NOT_COMPLETE');
      const verification = verifyTraceFile(tracePath, {
        expectedMode: 'intentional-broken-login',
        exitStatus: 1,
      });
      assert.equal(verification.valid, true);
    });
  });

  it('rejects negative control when login form POST was not observed before timeout', async () => {
    await withTempDir(async (artifactDir) => {
      const mockCdp = createMockCdp({
        validLoginOutcome: 'hang-no-alert',
        emitValidLoginPost: false,
      });
      const deps = defaultStubDependencies({
        startBrowserFn: async () => ({
          browser: createFakeProcess(),
          cdp: mockCdp,
          profile: null,
        }),
      });

      const { evidence, failure, tracePath } = await runQaHarness({
        ...deps,
        artifactDir,
        negativeControl: true,
        loginTimeoutMs: 300,
      });

      assert.equal(failure, true);
      assert.equal(evidence.failure?.code, 'AUTH_LOGIN_POST_NOT_OBSERVED');

      const verification = verifyTraceFile(tracePath, {
        expectedMode: 'intentional-broken-login',
        exitStatus: 1,
      });
      assert.equal(verification.valid, false);
      assert.equal(
        verification.code,
        'NEGATIVE_CONTROL_CLASSIFICATION_MISMATCH',
      );
    });
  });

  it('rejects arbitrary setup, build, fixture, app-start, and browser-start failures in negative control', async () => {
    const scenarios = [
      {
        label: 'local status failure',
        overrides: {
          localStatusFn: async () => {
            throw new QaError(
              'LOCAL_STATUS',
              'LOCAL_STATUS_FAILED',
              'Disposable Supabase is unavailable',
            );
          },
        },
        expectedStage: 'LOCAL_STATUS',
        expectedCode: 'LOCAL_STATUS_FAILED',
      },
      {
        label: 'app build failure',
        overrides: {
          buildAppFn: async () => {
            throw new QaError(
              'APP_BUILD',
              'BUILD_FAILED',
              'Isolated app build failed',
              { exitCode: 2 },
            );
          },
        },
        expectedStage: 'APP_BUILD',
        expectedCode: 'BUILD_FAILED',
      },
      {
        label: 'fixture creation failure',
        overrides: {
          createFixtureFn: async () => {
            throw new QaError(
              'FIXTURE_CREATION',
              'FIXTURE_CREATION_FAILED',
              'Synthetic fixture setup failed',
            );
          },
        },
        expectedStage: 'FIXTURE_CREATION',
        expectedCode: 'FIXTURE_CREATION_FAILED',
      },
      {
        label: 'application startup failure',
        overrides: {
          startAppFn: async () => {
            throw new QaError(
              'APP_START',
              'APP_START_TIMED_OUT',
              'Timed out: Local MGBOS health',
            );
          },
        },
        expectedStage: 'APP_START',
        expectedCode: 'APP_START_TIMED_OUT',
      },
      {
        label: 'browser startup failure',
        overrides: {
          startBrowserFn: async () => {
            throw new QaError(
              'BROWSER_START',
              'BROWSER_START_FAILED',
              'Chromium is unavailable in isolated QA runner',
            );
          },
        },
        expectedStage: 'BROWSER_START',
        expectedCode: 'BROWSER_START_FAILED',
      },
    ];

    for (const scenario of scenarios) {
      await withTempDir(async (artifactDir) => {
        const deps = defaultStubDependencies(scenario.overrides);
        const { evidence, failure, tracePath } = await runQaHarness({
          ...deps,
          artifactDir,
          negativeControl: true,
        });

        assert.equal(failure, true, scenario.label);
        assert.equal(evidence.failure?.stage, scenario.expectedStage);
        assert.equal(evidence.failure?.code, scenario.expectedCode);

        const verification = verifyTraceFile(tracePath, {
          expectedMode: 'intentional-broken-login',
          exitStatus: 1,
        });
        assert.equal(verification.valid, false, scenario.label);
        assert.equal(
          verification.code,
          'NEGATIVE_CONTROL_CLASSIFICATION_MISMATCH',
          scenario.label,
        );
      });
    }
  });

  it('classifies real child process SIGKILL during negative-control login wait as CHILD_PROCESS_TERMINATED, never PASS', async () => {
    await withTempDir(async (artifactDir) => {
      const child = spawn(
        process.execPath,
        ['-e', 'setInterval(() => {}, 1000);'],
        { stdio: 'ignore' },
      );

      try {
        const mockCdp = createMockCdp({
          validLoginOutcome: 'hang-no-alert',
          onValidSubmit: async () => {
            await terminateSubprocess(child, {
              initialSignal: 'SIGKILL',
              forceSignal: 'SIGKILL',
              graceMs: 2000,
            });
          },
        });

        const deps = defaultStubDependencies({
          startBrowserFn: async () => ({
            browser: child,
            cdp: mockCdp,
            profile: null,
          }),
        });

        const { evidence, failure, tracePath } = await runQaHarness({
          ...deps,
          artifactDir,
          negativeControl: true,
          loginTimeoutMs: 2000,
        });

        assert.equal(failure, true);
        assert.equal(evidence.failure?.stage, 'BROWSER_AUTH');
        assert.equal(evidence.failure?.code, 'CHILD_PROCESS_TERMINATED');
        assert.equal(evidence.failure?.process, 'browser');

        const verification = verifyTraceFile(tracePath, {
          expectedMode: 'intentional-broken-login',
          exitStatus: 1,
        });
        assert.equal(verification.valid, false);
        assert.equal(
          verification.code,
          'NEGATIVE_CONTROL_CLASSIFICATION_MISMATCH',
        );
      } finally {
        await terminateSubprocess(child, {
          initialSignal: 'SIGKILL',
          forceSignal: 'SIGKILL',
          graceMs: 1000,
        });
      }
    });
  });

  it('classifies process termination signal during execution as PROCESS_SIGNAL_TERMINATED and enforces post-signal quiescence and stable finalized evidence', async () => {
    await withTempDir(async (artifactDir) => {
      let signalFired = false;
      let rawCdpCallsAfterSignal = 0;
      const lifecycleOrder = [];
      const baseCdp = createMockCdp({
        validLoginOutcome: 'hang-no-alert',
        onValidSubmit: async () => {
          setTimeout(() => {
            signalFired = true;
            lifecycleOrder.push('signal_emitted');
            process.emit('SIGTERM', 'SIGTERM');
          }, 20);
        },
      });

      const instrumentedCdp = {
        ...baseCdp,
        async eval(expression) {
          if (signalFired) rawCdpCallsAfterSignal += 1;
          return baseCdp.eval(expression);
        },
        async goto(route, expected, options) {
          if (signalFired) rawCdpCallsAfterSignal += 1;
          return baseCdp.goto(route, expected, options);
        },
        async send(method, params) {
          if (signalFired) rawCdpCallsAfterSignal += 1;
          return baseCdp.send(method, params);
        },
        async session() {
          if (signalFired) rawCdpCallsAfterSignal += 1;
          return baseCdp.session();
        },
        async screenshot(file) {
          if (signalFired) rawCdpCallsAfterSignal += 1;
          return baseCdp.screenshot(file);
        },
      };

      let lateCdpError = null;
      let lateCasesMutationError = null;

      const deps = defaultStubDependencies({
        startBrowserFn: async () => ({
          browser: createFakeProcess(),
          cdp: instrumentedCdp,
          profile: null,
        }),
        runBrowserFn: async (cdp, fixture, options) => {
          try {
            await runBrowser(cdp, fixture, options);
          } catch (error) {
            // Attempt post-signal browser operation and case mutation before settling.
            await new Promise((resolve) => setTimeout(resolve, 25));
            try {
              await cdp.eval('location.pathname');
            } catch (cdpErr) {
              lateCdpError = cdpErr;
            }
            try {
              options.cases.push({
                caseId: 'LATE-MUTATION-01',
                verdict: 'PASS',
                timestamp: new Date().toISOString(),
                proof: {},
              });
            } catch (mutErr) {
              lateCasesMutationError = mutErr;
            }
            lifecycleOrder.push('in_flight_settled');
            throw error;
          }
        },
        terminateSubprocessFn: async () => {
          lifecycleOrder.push('subprocess_terminated');
          return { terminated: true, forced: false };
        },
        cleanupFn: async () => {
          lifecycleOrder.push('fixture_cleaned');
          return { attempted: true, status: 'PASS' };
        },
      });

      const { evidence, failure, tracePath } = await runQaHarness({
        ...deps,
        artifactDir,
        negativeControl: true,
        loginTimeoutMs: 5000,
      });

      const immediateEvidenceSnapshot = JSON.stringify(evidence);
      const immediateTraceSnapshot = readFileSync(tracePath, 'utf8');

      assert.equal(failure, true);
      assert.equal(evidence.failure?.stage, 'BROWSER_AUTH');
      assert.equal(evidence.failure?.code, 'PROCESS_SIGNAL_TERMINATED');
      assert.equal(evidence.failure?.signal, 'SIGTERM');
      assert.equal(evidence.cleanup.executionQuiesced, true);
      assert.equal(rawCdpCallsAfterSignal, 0);
      assert.ok(
        lateCdpError instanceof QaError &&
          lateCdpError.code === 'PROCESS_SIGNAL_TERMINATED',
        'Post-signal CDP operation must be rejected before reaching raw browser client',
      );
      assert.ok(
        lateCasesMutationError instanceof QaError &&
          lateCasesMutationError.code === 'PROCESS_SIGNAL_TERMINATED',
        'Post-signal cases mutation must be rejected',
      );
      assert.ok(
        !evidence.cases.some((item) => item.caseId === 'LATE-MUTATION-01'),
      );
      assert.deepEqual(lifecycleOrder, [
        'signal_emitted',
        'in_flight_settled',
        'subprocess_terminated',
        'subprocess_terminated',
        'fixture_cleaned',
      ]);
      assert.equal(Object.isFrozen(evidence), true);
      assert.equal(Object.isFrozen(evidence.cases), true);
      assert.equal(Object.isFrozen(evidence.failure), true);
      assert.equal(Object.isFrozen(evidence.cleanup), true);

      // Wait after harness return and verify finalized evidence and trace file remain stable.
      await new Promise((resolve) => setTimeout(resolve, 80));
      assert.equal(JSON.stringify(evidence), immediateEvidenceSnapshot);
      assert.equal(readFileSync(tracePath, 'utf8'), immediateTraceSnapshot);
      assert.equal(rawCdpCallsAfterSignal, 0);

      const verification = verifyTraceFile(tracePath, {
        expectedMode: 'intentional-broken-login',
        exitStatus: 1,
      });
      assert.equal(verification.valid, false);
      assert.equal(
        verification.code,
        'NEGATIVE_CONTROL_CLASSIFICATION_MISMATCH',
      );
    });
  });

  it('fails closed with SUBPROCESS_TEARDOWN_FAILED when in-flight work fails to quiesce after signal', async () => {
    await withTempDir(async (artifactDir) => {
      let releaseHangingWork;
      const hangingPromise = new Promise((resolve) => {
        releaseHangingWork = resolve;
      });
      const deps = defaultStubDependencies({
        runBrowserFn: async () => {
          setTimeout(() => {
            process.emit('SIGTERM', 'SIGTERM');
          }, 15);
          await hangingPromise;
        },
      });

      try {
        const { evidence, failure, tracePath } = await runQaHarness({
          ...deps,
          artifactDir,
          negativeControl: true,
          quiescenceTimeoutMs: 60,
        });

        assert.equal(failure, true);
        assert.equal(evidence.cleanup.executionQuiesced, false);
        assert.equal(evidence.failure?.stage, 'CLEANUP');
        assert.equal(evidence.failure?.code, 'SUBPROCESS_TEARDOWN_FAILED');
        assert.equal(evidence.failure?.priorCode, 'PROCESS_SIGNAL_TERMINATED');

        const verification = verifyTraceFile(tracePath, {
          expectedMode: 'intentional-broken-login',
          exitStatus: 1,
        });
        assert.equal(verification.valid, false);
        assert.equal(verification.code, 'SUBPROCESS_TEARDOWN_NOT_VERIFIED');
      } finally {
        releaseHangingWork?.();
      }
    });
  });

  it('persists trace.json even when temporary browser profile removal throws in finally and fails closed', async () => {
    await withTempDir(async (artifactDir) => {
      const mockCdp = createMockCdp({ validLoginOutcome: 'rejected-alert' });
      const deps = defaultStubDependencies({
        startBrowserFn: async () => ({
          browser: createFakeProcess(),
          cdp: mockCdp,
          profile: path.join(artifactDir, 'simulated-locked-profile'),
        }),
        rmSyncFn: (targetPath, options) => {
          if (String(targetPath).includes('simulated-locked-profile')) {
            const err = new Error('ENOTEMPTY: directory not empty');
            err.code = 'ENOTEMPTY';
            throw err;
          }
          return rmSync(targetPath, options);
        },
      });

      const { evidence, failure, tracePath } = await runQaHarness({
        ...deps,
        artifactDir,
        negativeControl: true,
      });

      assert.equal(failure, true);
      assert.ok(existsSync(tracePath), 'trace.json must still be written');
      assert.equal(evidence.cleanup.profileRemoved, false);
      assert.equal(evidence.failure?.code, 'SUBPROCESS_TEARDOWN_FAILED');
      assert.equal(
        evidence.failure?.priorCode,
        'AUTH_VALID_LOGIN_DID_NOT_COMPLETE',
      );

      const verification = verifyTraceFile(tracePath, {
        expectedMode: 'intentional-broken-login',
        exitStatus: 1,
      });
      assert.equal(verification.valid, false);
      assert.equal(verification.code, 'SUBPROCESS_TEARDOWN_NOT_VERIFIED');
    });
  });

  it('fails closed when synthetic fixture cleanup fails even after expected negative-control auth failure', async () => {
    await withTempDir(async (artifactDir) => {
      const mockCdp = createMockCdp({ validLoginOutcome: 'rejected-alert' });
      const deps = defaultStubDependencies({
        startBrowserFn: async () => ({
          browser: createFakeProcess(),
          cdp: mockCdp,
          profile: null,
        }),
        cleanupFn: async () => {
          throw new QaError(
            'CLEANUP',
            'FIXTURE_CLEANUP_FAILED',
            'Synthetic fixture cleanup verification failed',
          );
        },
      });

      const { evidence, failure, tracePath } = await runQaHarness({
        ...deps,
        artifactDir,
        negativeControl: true,
      });

      assert.equal(failure, true);
      assert.equal(evidence.cleanup.status, 'FAIL');
      assert.equal(evidence.failure?.stage, 'CLEANUP');
      assert.equal(evidence.failure?.code, 'FIXTURE_CLEANUP_FAILED');
      assert.equal(
        evidence.failure?.priorCode,
        'AUTH_VALID_LOGIN_DID_NOT_COMPLETE',
      );

      const verification = verifyTraceFile(tracePath, {
        expectedMode: 'intentional-broken-login',
        exitStatus: 1,
      });
      assert.equal(verification.valid, false);
      assert.equal(verification.code, 'FIXTURE_CLEANUP_NOT_VERIFIED');
    });
  });

  it('fails closed on missing, unreadable, empty, corrupt, and incomplete traces', async () => {
    await withTempDir(async (artifactDir) => {
      const missingPath = path.join(artifactDir, 'missing-trace.json');
      assert.equal(
        verifyTraceFile(missingPath, {
          expectedMode: 'intentional-broken-login',
          exitStatus: 1,
        }).code,
        'TRACE_MISSING',
      );

      const emptyPath = path.join(artifactDir, 'empty-trace.json');
      writeFileSync(emptyPath, '   \n', 'utf8');
      assert.equal(
        verifyTraceFile(emptyPath, {
          expectedMode: 'intentional-broken-login',
          exitStatus: 1,
        }).code,
        'TRACE_CORRUPT',
      );

      const corruptPath = path.join(artifactDir, 'corrupt-trace.json');
      writeFileSync(corruptPath, '{"mode": "intentional-broken-login"', 'utf8');
      assert.equal(
        verifyTraceFile(corruptPath, {
          expectedMode: 'intentional-broken-login',
          exitStatus: 1,
        }).code,
        'TRACE_CORRUPT',
      );

      const unreadableResult = verifyTraceFile(corruptPath, {
        expectedMode: 'intentional-broken-login',
        exitStatus: 1,
        readFileSyncFn: () => {
          throw new Error('EACCES');
        },
      });
      assert.equal(unreadableResult.code, 'TRACE_UNREADABLE');

      const incompletePath = path.join(artifactDir, 'incomplete-trace.json');
      writeSanitizedTrace(incompletePath, {
        checkoutSha: 'c21e675698489cf396719226b673050e30840c4a',
        ciEventSha: null,
        cases: [],
        mode: 'intentional-broken-login',
        stage: 'BROWSER_AUTH',
        failure: {
          stage: 'BROWSER_AUTH',
          code: 'TRACE_INCOMPLETE_OR_ABORTED',
        },
        cleanup: {
          attempted: false,
          status: 'PENDING',
          browserTerminated: true,
          applicationTerminated: true,
          profileRemoved: true,
        },
        overall: 'INCOMPLETE',
      });
      const incompleteCheck = verifyTraceFile(incompletePath, {
        expectedMode: 'intentional-broken-login',
        exitStatus: 137,
      });
      assert.equal(incompleteCheck.valid, false);
      assert.equal(incompleteCheck.code, 'TRACE_INCOMPLETE_OR_ABORTED');
    });
  });

  it('enforces secret and credential redaction on trace artifacts', async () => {
    const leakedSamples = [
      {
        label: 'JWT token',
        value:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U',
      },
      {
        label: 'Supabase secret key',
        value: 'sb_secret_1234567890abcdef',
      },
      {
        label: 'Bearer header',
        value: 'Authorization: Bearer secret_token_123',
      },
      {
        label: 'Session cookie assignment',
        value: 'mgbos_session=secret_cookie_value',
      },
      {
        label: 'Database connection URL',
        value: 'postgresql://postgres:postgres@127.0.0.1:55432/postgres',
      },
      {
        label: 'Email address',
        value: 'ci-auth-user@example.test',
      },
    ];

    for (const sample of leakedSamples) {
      assert.throws(
        () => assertSanitizedEvidence({ note: sample.value }),
        (error) =>
          error instanceof QaError &&
          error.code === 'ARTIFACT_SENSITIVE_DATA_BLOCKED',
        sample.label,
      );
      const reportCheck = validateTraceReport(
        {
          checkoutSha: 'c21e675698489cf396719226b673050e30840c4a',
          cases: [],
          mode: 'normal',
          overall: 'PASS',
          leaked: sample.value,
        },
        { expectedMode: 'normal' },
      );
      assert.equal(reportCheck.valid, false, sample.label);
      assert.equal(reportCheck.code, 'TRACE_SENSITIVE_DATA_DETECTED');
    }

    assert.throws(
      () =>
        assertSanitizedEvidence(
          { detail: 'contains my_custom_runtime_secret_value' },
          ['my_custom_runtime_secret_value'],
        ),
      (error) =>
        error instanceof QaError &&
        error.code === 'ARTIFACT_SENSITIVE_DATA_BLOCKED',
    );
  });

  it('validates localStatus and cleanup guards against nonlocal or incomplete targets', async () => {
    assert.throws(
      () =>
        localStatus({
          env: { NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co' },
        }),
      (error) =>
        error instanceof QaError && error.code === 'LOCAL_STATUS_FAILED',
    );

    assert.throws(
      () =>
        localStatus({
          env: {},
          spawnSyncFn: () => ({
            status: 0,
            stdout:
              'API_URL="http://127.0.0.1:55431"\nANON_KEY="anon"\nSERVICE_ROLE_KEY="srv"\nDB_URL="postgresql://postgres:postgres@db.example.com:5432/postgres"\n',
          }),
        }),
      (error) =>
        error instanceof QaError && error.code === 'LOCAL_STATUS_FAILED',
    );

    await assert.rejects(
      () =>
        cleanup(
          'key',
          {
            auth: '00000000-0000-4000-8000-000000000001',
            profile: '00000000-0000-4000-8000-000000000002',
          },
          {
            api: CANONICAL_API_ORIGIN,
            fetchFn: async () => ({
              ok: true,
              status: 200,
              json: async () => [{ id: 'still-present' }],
            }),
          },
        ),
      (error) =>
        error instanceof QaError && error.code === 'FIXTURE_CLEANUP_FAILED',
    );
  });

  it('executes CLI --verify-trace for valid and invalid traces with sanitized output', async () => {
    await withTempDir(async (artifactDir) => {
      const mockCdp = createMockCdp({ validLoginOutcome: 'rejected-alert' });
      const deps = defaultStubDependencies({
        startBrowserFn: async () => ({
          browser: createFakeProcess(),
          cdp: mockCdp,
          profile: null,
        }),
      });
      const { tracePath } = await runQaHarness({
        ...deps,
        artifactDir,
        negativeControl: true,
      });

      const okRun = spawnSync(
        process.execPath,
        [
          scriptPath,
          '--verify-trace',
          tracePath,
          '--expected-mode',
          'intentional-broken-login',
          '--exit-status',
          '1',
        ],
        { cwd: workdir, encoding: 'utf8' },
      );
      assert.equal(okRun.status, 0);
      assert.match(okRun.stdout, /NEGATIVE_CONTROL_TRACE_VERIFIED/);

      const failRun = spawnSync(
        process.execPath,
        [
          scriptPath,
          '--verify-trace',
          path.join(artifactDir, 'nonexistent.json'),
          '--expected-mode',
          'intentional-broken-login',
          '--exit-status',
          '1',
        ],
        { cwd: workdir, encoding: 'utf8' },
      );
      assert.equal(failRun.status, 1);
      assert.match(failRun.stderr, /TRACE_MISSING/);

      const rawTrace = readFileSync(tracePath, 'utf8');
      assert.doesNotMatch(
        rawTrace,
        /synthetic_service_key_value_for_unit_test_only/,
      );
      assert.doesNotMatch(
        rawTrace,
        /synthetic_password_value_for_unit_test_only/,
      );
    });
  });

  it('fails closed on unwritable trace, readback failure, and post-write corruption', async () => {
    await withTempDir(async (artifactDir) => {
      const unwritableDeps = defaultStubDependencies({
        writeFileSyncFn: () => {
          const err = new Error('ENOSPC: no space left on device');
          err.code = 'ENOSPC';
          throw err;
        },
      });
      const unwritableResult = await runQaHarness({
        ...unwritableDeps,
        artifactDir: path.join(artifactDir, 'unwritable'),
        negativeControl: true,
      });
      assert.equal(unwritableResult.failure, true);
      assert.equal(unwritableResult.evidence.stage, 'ARTIFACT_WRITE');
      assert.equal(
        unwritableResult.evidence.failure?.code,
        'TRACE_WRITE_FAILED',
      );

      const traceFile = path.join(artifactDir, 'readback-check.json');
      assert.throws(
        () =>
          writeSanitizedTrace(
            traceFile,
            {
              checkoutSha: 'c21e675698489cf396719226b673050e30840c4a',
              cases: [],
              mode: 'normal',
              overall: 'PASS',
            },
            {
              readFileSyncFn: () => {
                throw new Error('EIO');
              },
            },
          ),
        (error) =>
          error instanceof QaError && error.code === 'TRACE_READBACK_FAILED',
      );

      assert.throws(
        () =>
          writeSanitizedTrace(
            traceFile,
            {
              checkoutSha: 'c21e675698489cf396719226b673050e30840c4a',
              cases: [],
              mode: 'normal',
              overall: 'PASS',
            },
            {
              readFileSyncFn: () => '{"truncated": ',
            },
          ),
        (error) =>
          error instanceof QaError &&
          error.code === 'TRACE_CORRUPT_AFTER_WRITE',
      );
    });
  });

  it('keeps runBrowser and CANONICAL_APP_ORIGIN exports aligned with harness defaults', () => {
    assert.equal(typeof runBrowser, 'function');
    assert.equal(CANONICAL_APP_ORIGIN, 'http://127.0.0.1:3101');
  });

  it('prevents subsequent fixture mutations and cleans up partial state when interrupted before dispatch or while in flight within quiescence limit across all fixture stages', async () => {
    function createMockFixtureStore({ onSeedLookup, onMutation } = {}) {
      const authUsers = new Map([
        [
          '00000000-0000-4000-8000-000000000999',
          {
            id: '00000000-0000-4000-8000-000000000999',
            email: 'unrelated-operator@example.test',
          },
        ],
      ]);
      const appUsers = new Map([
        [
          '00000000-0000-4000-8000-000000000888',
          {
            id: '00000000-0000-4000-8000-000000000888',
            auth_user_id: '00000000-0000-4000-8000-000000000999',
            email: 'unrelated-operator@example.test',
            name: 'Unrelated Operator',
            status: 'ACTIVE',
          },
        ],
      ]);
      const orgMembers = [
        {
          organization_id: '00000000-0000-4000-8000-000000000010',
          user_id: '00000000-0000-4000-8000-000000000888',
          role_id: '00000000-0000-4000-8000-000000000020',
          status: 'ACTIVE',
        },
      ];
      const mutationCalls = [];
      let authSeq = 0;
      let profileSeq = 0;

      const jsonResponse = (status, payload) => ({
        ok: status >= 200 && status < 300,
        status,
        json: async () => payload,
      });

      const fetchFn = async (url, options = {}) => {
        const parsed = new URL(String(url));
        const method = options.method ?? 'GET';
        const pathname = parsed.pathname;

        if (method === 'GET' && pathname === '/rest/v1/organizations') {
          return jsonResponse(200, [
            { id: '00000000-0000-4000-8000-000000000010' },
          ]);
        }
        if (method === 'GET' && pathname === '/rest/v1/roles') {
          if (onSeedLookup) {
            await onSeedLookup();
          }
          return jsonResponse(200, [
            { id: '00000000-0000-4000-8000-000000000020' },
          ]);
        }

        if (method === 'POST' && pathname === '/auth/v1/admin/users') {
          mutationCalls.push('POST /auth/v1/admin/users');
          const body = JSON.parse(options.body);
          authSeq += 1;
          const id = `00000000-0000-4000-8000-00000000010${authSeq}`;
          const user = { id, email: body.email };
          authUsers.set(id, user);
          if (onMutation) {
            await onMutation({ stage: 'in_flight_auth', options, user });
          }
          return jsonResponse(200, user);
        }

        if (method === 'POST' && pathname === '/rest/v1/users') {
          mutationCalls.push('POST /rest/v1/users');
          const body = JSON.parse(options.body);
          profileSeq += 1;
          const id = `00000000-0000-4000-8000-00000000020${profileSeq}`;
          const row = {
            id,
            auth_user_id: body.auth_user_id,
            email: body.email,
            name: body.name,
            status: body.status,
          };
          appUsers.set(id, row);
          if (onMutation) {
            await onMutation({ stage: 'in_flight_profile', options, row });
          }
          return jsonResponse(201, [row]);
        }

        if (method === 'POST' && pathname === '/rest/v1/organization_members') {
          mutationCalls.push('POST /rest/v1/organization_members');
          const body = JSON.parse(options.body);
          const row = {
            organization_id: body.organization_id,
            user_id: body.user_id,
            role_id: body.role_id,
            status: body.status,
          };
          orgMembers.push(row);
          if (onMutation) {
            await onMutation({
              stage: 'in_flight_membership',
              options,
              row,
            });
          }
          return jsonResponse(201, [row]);
        }

        if (method === 'GET' && pathname === '/auth/v1/admin/users') {
          return jsonResponse(200, {
            users: Array.from(authUsers.values()),
          });
        }

        if (pathname.startsWith('/auth/v1/admin/users/')) {
          const authId = pathname.slice('/auth/v1/admin/users/'.length);
          if (method === 'DELETE') {
            const existed = authUsers.delete(authId);
            return jsonResponse(existed ? 200 : 404, {});
          }
          if (method === 'GET') {
            return authUsers.has(authId)
              ? jsonResponse(200, authUsers.get(authId))
              : jsonResponse(404, {});
          }
        }

        if (pathname === '/rest/v1/users') {
          const idFilter = parsed.searchParams.get('id');
          const emailFilter = parsed.searchParams.get('email');
          const matchRow = (row) => {
            if (idFilter?.startsWith('eq.')) {
              return row.id === idFilter.slice(3);
            }
            if (emailFilter?.startsWith('eq.')) {
              return row.email === emailFilter.slice(3);
            }
            return true;
          };
          if (method === 'GET') {
            return jsonResponse(
              200,
              Array.from(appUsers.values()).filter(matchRow),
            );
          }
          if (method === 'DELETE') {
            for (const [id, row] of appUsers.entries()) {
              if (matchRow(row)) {
                appUsers.delete(id);
              }
            }
            return { ok: true, status: 204, json: async () => null };
          }
        }

        if (pathname === '/rest/v1/organization_members') {
          const userIdFilter = parsed.searchParams.get('user_id');
          const targetUserId = userIdFilter?.startsWith('eq.')
            ? userIdFilter.slice(3)
            : null;
          if (method === 'GET') {
            return jsonResponse(
              200,
              orgMembers.filter((m) =>
                targetUserId ? m.user_id === targetUserId : true,
              ),
            );
          }
          if (method === 'DELETE') {
            for (let i = orgMembers.length - 1; i >= 0; i -= 1) {
              if (!targetUserId || orgMembers[i].user_id === targetUserId) {
                orgMembers.splice(i, 1);
              }
            }
            return { ok: true, status: 204, json: async () => null };
          }
        }

        throw new Error(`Unhandled mock endpoint: ${method} ${pathname}`);
      };

      return {
        authUsers,
        appUsers,
        orgMembers,
        mutationCalls,
        fetchFn,
      };
    }

    // 1. Normal acknowledged success: all three stages transition to CONFIRMED with zero ambiguity.
    {
      const normalStore = createMockFixtureStore();
      const fixtureState = createFixtureState();
      await createFixture('synthetic_service_key', {
        fetchFn: normalStore.fetchFn,
        fixture: fixtureState,
        deferCleanup: true,
      });
      assert.equal(fixtureState.mutations.auth.status, 'CONFIRMED');
      assert.equal(fixtureState.mutations.profile.status, 'CONFIRMED');
      assert.equal(fixtureState.mutations.membership.status, 'CONFIRMED');
      assert.equal(fixtureState.mutationOutcomeAmbiguous, false);
      assert.deepEqual(fixtureState.ambiguousMutations, []);
      const cleanupResult = await cleanup(
        'synthetic_service_key',
        fixtureState,
        {
          fetchFn: normalStore.fetchFn,
        },
      );
      assert.deepEqual(cleanupResult, { attempted: true, status: 'PASS' });
      assert.equal(normalStore.authUsers.size, 1);
      assert.equal(normalStore.appUsers.size, 1);
      assert.equal(normalStore.orgMembers.length, 1);
    }

    // 2. Interruption before mutation dispatch & interruption while mutation is in flight (settling within quiescence).
    const scenarios = [
      {
        label:
          'signal before synthetic auth mutation dispatch (during seed lookup)',
        triggerOnSeedLookup: true,
        expectedMutations: [],
        expectedStageStatuses: {
          auth: 'FAILED_BEFORE_DISPATCH',
          profile: 'NOT_STARTED',
          membership: 'NOT_STARTED',
        },
      },
      {
        label:
          'signal while auth mutation is in flight (completes within quiescence; blocks profile dispatch)',
        triggerStage: 'in_flight_auth',
        expectedMutations: ['POST /auth/v1/admin/users'],
        expectedStageStatuses: {
          auth: 'CONFIRMED',
          profile: 'FAILED_BEFORE_DISPATCH',
          membership: 'NOT_STARTED',
        },
      },
      {
        label:
          'signal while profile mutation is in flight (completes within quiescence; blocks membership dispatch)',
        triggerStage: 'in_flight_profile',
        expectedMutations: ['POST /auth/v1/admin/users', 'POST /rest/v1/users'],
        expectedStageStatuses: {
          auth: 'CONFIRMED',
          profile: 'CONFIRMED',
          membership: 'FAILED_BEFORE_DISPATCH',
        },
      },
      {
        label:
          'signal while organization membership mutation is in flight (completes within quiescence)',
        triggerStage: 'in_flight_membership',
        expectedMutations: [
          'POST /auth/v1/admin/users',
          'POST /rest/v1/users',
          'POST /rest/v1/organization_members',
        ],
        expectedStageStatuses: {
          auth: 'CONFIRMED',
          profile: 'CONFIRMED',
          membership: 'CONFIRMED',
        },
      },
    ];

    for (const scenario of scenarios) {
      await withTempDir(async (artifactDir) => {
        let capturedFixture = null;
        const store = createMockFixtureStore({
          onSeedLookup: async () => {
            if (!scenario.triggerOnSeedLookup) return;
            process.emit('SIGTERM', 'SIGTERM');
            await new Promise((resolve) => setTimeout(resolve, 15));
          },
          onMutation: async ({ stage }) => {
            if (stage !== scenario.triggerStage) {
              return;
            }
            process.emit('SIGTERM', 'SIGTERM');
            await new Promise((resolve) => setTimeout(resolve, 15));
          },
        });

        const deps = defaultStubDependencies({
          createFixtureFn: (key, options) => {
            capturedFixture = options.fixture;
            return createFixture(key, { ...options, fetchFn: store.fetchFn });
          },
          cleanupFn: (key, fixture, options) =>
            cleanup(key, fixture, { ...options, fetchFn: store.fetchFn }),
        });

        const { evidence, failure, tracePath } = await runQaHarness({
          ...deps,
          artifactDir,
          negativeControl: true,
          quiescenceTimeoutMs: 300,
        });

        assert.equal(failure, true, scenario.label);
        assert.equal(evidence.overall, 'FAIL', scenario.label);
        assert.equal(
          evidence.failure?.stage,
          'FIXTURE_CREATION',
          scenario.label,
        );
        assert.equal(
          evidence.failure?.code,
          'PROCESS_SIGNAL_TERMINATED',
          scenario.label,
        );
        assert.equal(evidence.failure?.signal, 'SIGTERM', scenario.label);
        assert.equal(evidence.cleanup.attempted, true, scenario.label);
        assert.equal(evidence.cleanup.status, 'PASS', scenario.label);
        assert.equal(evidence.cleanup.executionQuiesced, true, scenario.label);
        assert.equal(
          capturedFixture?.mutationOutcomeAmbiguous,
          false,
          scenario.label,
        );
        assert.equal(
          capturedFixture?.mutations?.auth?.status,
          scenario.expectedStageStatuses.auth,
          scenario.label,
        );
        assert.equal(
          capturedFixture?.mutations?.profile?.status,
          scenario.expectedStageStatuses.profile,
          scenario.label,
        );
        assert.equal(
          capturedFixture?.mutations?.membership?.status,
          scenario.expectedStageStatuses.membership,
          scenario.label,
        );
        assert.deepEqual(
          store.mutationCalls,
          scenario.expectedMutations,
          scenario.label,
        );
        // Only the pre-existing unrelated operator records remain.
        assert.equal(store.authUsers.size, 1, scenario.label);
        assert.equal(
          store.authUsers.has('00000000-0000-4000-8000-000000000999'),
          true,
          scenario.label,
        );
        assert.equal(store.appUsers.size, 1, scenario.label);
        assert.equal(
          store.appUsers.has('00000000-0000-4000-8000-000000000888'),
          true,
          scenario.label,
        );
        assert.equal(store.orgMembers.length, 1, scenario.label);

        const verification = verifyTraceFile(tracePath, {
          expectedMode: 'intentional-broken-login',
          exitStatus: 1,
        });
        assert.equal(verification.valid, false, scenario.label);
        assert.equal(
          verification.code,
          'NEGATIVE_CONTROL_CLASSIFICATION_MISMATCH',
          scenario.label,
        );
      });
    }
  });

  it('refuses to report verified cleanup when fixture creation exceeds quiescence limit and cleans up late-settling records before harness return without mutating finalized trace', async () => {
    const stages = [
      {
        label: 'beyond quiescence before auth completion',
        stallEndpoint: 'POST /auth/v1/admin/users',
        expectedMutations: ['POST /auth/v1/admin/users'],
      },
      {
        label: 'beyond quiescence after auth before profile completion',
        stallEndpoint: 'POST /rest/v1/users',
        expectedMutations: ['POST /auth/v1/admin/users', 'POST /rest/v1/users'],
      },
      {
        label: 'beyond quiescence during organization membership creation',
        stallEndpoint: 'POST /rest/v1/organization_members',
        expectedMutations: [
          'POST /auth/v1/admin/users',
          'POST /rest/v1/users',
          'POST /rest/v1/organization_members',
        ],
      },
    ];

    for (const scenario of stages) {
      await withTempDir(async (artifactDir) => {
        const authUsers = new Map();
        const appUsers = new Map();
        const orgMembers = [];
        const mutationCalls = [];

        const jsonResponse = (status, payload) => ({
          ok: status >= 200 && status < 300,
          status,
          json: async () => payload,
        });

        const fetchFn = async (url, options = {}) => {
          const parsed = new URL(String(url));
          const method = options.method ?? 'GET';
          const pathname = parsed.pathname;
          const endpointKey = `${method} ${pathname}`;

          if (method === 'GET' && pathname === '/rest/v1/organizations') {
            return jsonResponse(200, [
              { id: '00000000-0000-4000-8000-000000000010' },
            ]);
          }
          if (method === 'GET' && pathname === '/rest/v1/roles') {
            return jsonResponse(200, [
              { id: '00000000-0000-4000-8000-000000000020' },
            ]);
          }

          if (method === 'POST') {
            mutationCalls.push(endpointKey);
          }

          if (endpointKey === scenario.stallEndpoint) {
            setTimeout(() => {
              process.emit('SIGTERM', 'SIGTERM');
            }, 10);
            // Settles at 110ms: exceeds quiescenceTimeoutMs (40ms) but completes
            // within fixtureDrainTimeoutMs (350ms) before runQaHarness returns.
            await new Promise((resolve) => setTimeout(resolve, 110));
          }

          if (endpointKey === 'POST /auth/v1/admin/users') {
            const body = JSON.parse(options.body);
            const user = {
              id: '00000000-0000-4000-8000-000000000111',
              email: body.email,
            };
            authUsers.set(user.id, user);
            return jsonResponse(200, user);
          }

          if (endpointKey === 'POST /rest/v1/users') {
            const body = JSON.parse(options.body);
            const row = {
              id: '00000000-0000-4000-8000-000000000222',
              auth_user_id: body.auth_user_id,
              email: body.email,
              name: body.name,
              status: body.status,
            };
            appUsers.set(row.id, row);
            return jsonResponse(201, [row]);
          }

          if (endpointKey === 'POST /rest/v1/organization_members') {
            const body = JSON.parse(options.body);
            orgMembers.push({ ...body });
            return jsonResponse(201, [body]);
          }

          if (method === 'GET' && pathname === '/auth/v1/admin/users') {
            return jsonResponse(200, {
              users: Array.from(authUsers.values()),
            });
          }

          if (pathname.startsWith('/auth/v1/admin/users/')) {
            const authId = pathname.slice('/auth/v1/admin/users/'.length);
            if (method === 'DELETE') {
              const existed = authUsers.delete(authId);
              return jsonResponse(existed ? 200 : 404, {});
            }
            if (method === 'GET') {
              return authUsers.has(authId)
                ? jsonResponse(200, authUsers.get(authId))
                : jsonResponse(404, {});
            }
          }

          if (pathname === '/rest/v1/users') {
            const idFilter = parsed.searchParams.get('id');
            const emailFilter = parsed.searchParams.get('email');
            const matchRow = (row) => {
              if (idFilter?.startsWith('eq.')) {
                return row.id === idFilter.slice(3);
              }
              if (emailFilter?.startsWith('eq.')) {
                return row.email === emailFilter.slice(3);
              }
              return true;
            };
            if (method === 'GET') {
              return jsonResponse(
                200,
                Array.from(appUsers.values()).filter(matchRow),
              );
            }
            if (method === 'DELETE') {
              for (const [id, row] of appUsers.entries()) {
                if (matchRow(row)) {
                  appUsers.delete(id);
                }
              }
              return { ok: true, status: 204, json: async () => null };
            }
          }

          if (pathname === '/rest/v1/organization_members') {
            const userIdFilter = parsed.searchParams.get('user_id');
            const targetUserId = userIdFilter?.startsWith('eq.')
              ? userIdFilter.slice(3)
              : null;
            if (method === 'GET') {
              return jsonResponse(
                200,
                orgMembers.filter((m) =>
                  targetUserId ? m.user_id === targetUserId : true,
                ),
              );
            }
            if (method === 'DELETE') {
              for (let i = orgMembers.length - 1; i >= 0; i -= 1) {
                if (!targetUserId || orgMembers[i].user_id === targetUserId) {
                  orgMembers.splice(i, 1);
                }
              }
              return { ok: true, status: 204, json: async () => null };
            }
          }

          throw new Error(`Unhandled mock endpoint: ${endpointKey}`);
        };

        const deps = defaultStubDependencies({
          createFixtureFn: (key, options) =>
            createFixture(key, { ...options, fetchFn }),
          cleanupFn: (key, fixture, options) =>
            cleanup(key, fixture, { ...options, fetchFn }),
        });

        const { evidence, failure, tracePath } = await runQaHarness({
          ...deps,
          artifactDir,
          negativeControl: true,
          quiescenceTimeoutMs: 40,
          fixtureDrainTimeoutMs: 350,
        });

        const immediateTrace = readFileSync(tracePath, 'utf8');
        const evidenceSnapshot = JSON.stringify(evidence);

        assert.equal(failure, true, scenario.label);
        assert.equal(evidence.overall, 'FAIL', scenario.label);
        assert.equal(evidence.cleanup.attempted, true, scenario.label);
        assert.equal(evidence.cleanup.status, 'UNVERIFIED', scenario.label);
        assert.equal(evidence.cleanup.executionQuiesced, false, scenario.label);
        assert.equal(evidence.failure?.stage, 'CLEANUP', scenario.label);
        assert.equal(
          evidence.failure?.code,
          'SUBPROCESS_TEARDOWN_FAILED',
          scenario.label,
        );
        assert.equal(
          evidence.failure?.priorStage,
          'FIXTURE_CREATION',
          scenario.label,
        );
        assert.equal(
          evidence.failure?.priorCode,
          'PROCESS_SIGNAL_TERMINATED',
          scenario.label,
        );

        // Immediately upon runQaHarness return (before process.exit would run in CLI),
        // compensating cleanup has already completed and zero synthetic records remain.
        assert.deepEqual(
          mutationCalls,
          scenario.expectedMutations,
          scenario.label,
        );
        assert.equal(authUsers.size, 0, scenario.label);
        assert.equal(appUsers.size, 0, scenario.label);
        assert.equal(orgMembers.length, 0, scenario.label);

        const verification = verifyTraceFile(tracePath, {
          expectedMode: 'intentional-broken-login',
          exitStatus: 1,
        });
        assert.equal(verification.valid, false, scenario.label);
        assert.equal(
          verification.code,
          'SUBPROCESS_TEARDOWN_NOT_VERIFIED',
          scenario.label,
        );

        assert.equal(JSON.stringify(evidence), evidenceSnapshot);
        assert.equal(readFileSync(tracePath, 'utf8'), immediateTrace);
      });
    }

    // Also verify when an in-flight request hangs beyond BOTH quiescenceTimeoutMs AND
    // fixtureDrainTimeoutMs: drainSignal aborts the hung request, prior step records are
    // cleaned up before return, and cleanup.status remains UNVERIFIED (fail-closed).
    await withTempDir(async (artifactDir) => {
      const authUsers = new Map();
      const appUsers = new Map();
      const orgMembers = [];
      let drainAbortObserved = false;

      const jsonResponse = (status, payload) => ({
        ok: status >= 200 && status < 300,
        status,
        json: async () => payload,
      });

      const fetchFn = async (url, options = {}) => {
        const parsed = new URL(String(url));
        const method = options.method ?? 'GET';
        const pathname = parsed.pathname;
        const endpointKey = `${method} ${pathname}`;

        if (method === 'GET' && pathname === '/rest/v1/organizations') {
          return jsonResponse(200, [
            { id: '00000000-0000-4000-8000-000000000010' },
          ]);
        }
        if (method === 'GET' && pathname === '/rest/v1/roles') {
          return jsonResponse(200, [
            { id: '00000000-0000-4000-8000-000000000020' },
          ]);
        }
        if (endpointKey === 'POST /auth/v1/admin/users') {
          const body = JSON.parse(options.body);
          const user = {
            id: '00000000-0000-4000-8000-000000000199',
            email: body.email,
          };
          authUsers.set(user.id, user);
          return jsonResponse(200, user);
        }
        if (endpointKey === 'POST /rest/v1/users') {
          setTimeout(() => {
            process.emit('SIGTERM', 'SIGTERM');
          }, 10);
          await new Promise((_, reject) => {
            options.signal?.addEventListener(
              'abort',
              () => {
                drainAbortObserved = true;
                const err = new Error('Aborted by drainSignal');
                err.name = 'AbortError';
                reject(err);
              },
              { once: true },
            );
          });
        }
        if (method === 'GET' && pathname === '/auth/v1/admin/users') {
          return jsonResponse(200, { users: Array.from(authUsers.values()) });
        }
        if (pathname.startsWith('/auth/v1/admin/users/')) {
          const authId = pathname.slice('/auth/v1/admin/users/'.length);
          if (method === 'DELETE') {
            const existed = authUsers.delete(authId);
            return jsonResponse(existed ? 200 : 404, {});
          }
          if (method === 'GET') {
            return authUsers.has(authId)
              ? jsonResponse(200, authUsers.get(authId))
              : jsonResponse(404, {});
          }
        }
        if (pathname === '/rest/v1/users') {
          if (method === 'GET') return jsonResponse(200, []);
          if (method === 'DELETE') {
            return { ok: true, status: 204, json: async () => null };
          }
        }
        if (pathname === '/rest/v1/organization_members') {
          if (method === 'GET') return jsonResponse(200, []);
          if (method === 'DELETE') {
            return { ok: true, status: 204, json: async () => null };
          }
        }
        throw new Error(`Unhandled mock endpoint: ${endpointKey}`);
      };

      const deps = defaultStubDependencies({
        createFixtureFn: (key, options) =>
          createFixture(key, { ...options, fetchFn }),
        cleanupFn: (key, fixture, options) =>
          cleanup(key, fixture, { ...options, fetchFn }),
      });

      const { evidence, failure } = await runQaHarness({
        ...deps,
        artifactDir,
        negativeControl: true,
        quiescenceTimeoutMs: 35,
        fixtureDrainTimeoutMs: 70,
      });

      assert.equal(failure, true);
      assert.equal(drainAbortObserved, true);
      assert.equal(evidence.cleanup.status, 'UNVERIFIED');
      assert.equal(evidence.cleanup.executionQuiesced, false);
      assert.equal(evidence.failure?.code, 'SUBPROCESS_TEARDOWN_FAILED');
      assert.equal(authUsers.size, 0);
      assert.equal(appUsers.size, 0);
      assert.equal(orgMembers.length, 0);
    });
  });

  it('reconciles server-side commit followed by lost or aborted HTTP response using tightly scoped synthetic fixture identity while marking cleanup UNVERIFIED', async () => {
    for (const lostStage of [
      'auth_response_lost',
      'profile_response_lost',
      'membership_response_lost',
    ]) {
      await withTempDir(async (artifactDir) => {
        const authUsers = new Map([
          [
            '00000000-0000-4000-8000-000000000999',
            {
              id: '00000000-0000-4000-8000-000000000999',
              email: 'unrelated-operator@example.test',
            },
          ],
        ]);
        const appUsers = new Map([
          [
            '00000000-0000-4000-8000-000000000888',
            {
              id: '00000000-0000-4000-8000-000000000888',
              auth_user_id: '00000000-0000-4000-8000-000000000999',
              email: 'unrelated-operator@example.test',
              name: 'Unrelated Operator',
              status: 'ACTIVE',
            },
          ],
        ]);
        const orgMembers = [
          {
            organization_id: '00000000-0000-4000-8000-000000000010',
            user_id: '00000000-0000-4000-8000-000000000888',
            role_id: '00000000-0000-4000-8000-000000000020',
            status: 'ACTIVE',
          },
        ];
        const mutationCalls = [];

        const jsonResponse = (status, payload) => ({
          ok: status >= 200 && status < 300,
          status,
          json: async () => payload,
        });

        const fetchFn = async (url, options = {}) => {
          const parsed = new URL(String(url));
          const method = options.method ?? 'GET';
          const pathname = parsed.pathname;

          if (method === 'GET' && pathname === '/rest/v1/organizations') {
            return jsonResponse(200, [
              { id: '00000000-0000-4000-8000-000000000010' },
            ]);
          }
          if (method === 'GET' && pathname === '/rest/v1/roles') {
            return jsonResponse(200, [
              { id: '00000000-0000-4000-8000-000000000020' },
            ]);
          }

          if (method === 'POST' && pathname === '/auth/v1/admin/users') {
            mutationCalls.push('POST /auth/v1/admin/users');
            const body = JSON.parse(options.body);
            const committedUser = {
              id: '00000000-0000-4000-8000-000000000301',
              email: body.email,
            };
            // Server-side commit succeeds before the response is lost/interrupted.
            authUsers.set(committedUser.id, committedUser);
            if (lostStage === 'auth_response_lost') {
              process.emit('SIGTERM', 'SIGTERM');
              const abortErr = new Error('Socket hang up after server commit');
              abortErr.name = 'AbortError';
              throw abortErr;
            }
            return jsonResponse(200, committedUser);
          }

          if (method === 'POST' && pathname === '/rest/v1/users') {
            mutationCalls.push('POST /rest/v1/users');
            const body = JSON.parse(options.body);
            const committedProfile = {
              id: '00000000-0000-4000-8000-000000000401',
              auth_user_id: body.auth_user_id,
              email: body.email,
              name: body.name,
              status: body.status,
            };
            // Server-side commit succeeds before the response is lost/interrupted.
            appUsers.set(committedProfile.id, committedProfile);
            if (lostStage === 'profile_response_lost') {
              process.emit('SIGTERM', 'SIGTERM');
              const abortErr = new Error('Socket hang up after server commit');
              abortErr.name = 'AbortError';
              throw abortErr;
            }
            return jsonResponse(201, [committedProfile]);
          }

          if (
            method === 'POST' &&
            pathname === '/rest/v1/organization_members'
          ) {
            mutationCalls.push('POST /rest/v1/organization_members');
            const body = JSON.parse(options.body);
            orgMembers.push({ ...body });
            if (lostStage === 'membership_response_lost') {
              process.emit('SIGTERM', 'SIGTERM');
              const abortErr = new Error('Socket hang up after server commit');
              abortErr.name = 'AbortError';
              throw abortErr;
            }
            return jsonResponse(201, [body]);
          }

          if (method === 'GET' && pathname === '/auth/v1/admin/users') {
            return jsonResponse(200, {
              users: Array.from(authUsers.values()),
            });
          }

          if (pathname.startsWith('/auth/v1/admin/users/')) {
            const authId = pathname.slice('/auth/v1/admin/users/'.length);
            if (method === 'DELETE') {
              const existed = authUsers.delete(authId);
              return jsonResponse(existed ? 200 : 404, {});
            }
            if (method === 'GET') {
              return authUsers.has(authId)
                ? jsonResponse(200, authUsers.get(authId))
                : jsonResponse(404, {});
            }
          }

          if (pathname === '/rest/v1/users') {
            const idFilter = parsed.searchParams.get('id');
            const emailFilter = parsed.searchParams.get('email');
            const matchRow = (row) => {
              if (idFilter?.startsWith('eq.')) {
                return row.id === idFilter.slice(3);
              }
              if (emailFilter?.startsWith('eq.')) {
                return row.email === emailFilter.slice(3);
              }
              return true;
            };
            if (method === 'GET') {
              return jsonResponse(
                200,
                Array.from(appUsers.values()).filter(matchRow),
              );
            }
            if (method === 'DELETE') {
              for (const [id, row] of appUsers.entries()) {
                if (matchRow(row)) {
                  appUsers.delete(id);
                }
              }
              return { ok: true, status: 204, json: async () => null };
            }
          }

          if (pathname === '/rest/v1/organization_members') {
            const userIdFilter = parsed.searchParams.get('user_id');
            const targetUserId = userIdFilter?.startsWith('eq.')
              ? userIdFilter.slice(3)
              : null;
            if (method === 'GET') {
              return jsonResponse(
                200,
                orgMembers.filter((m) =>
                  targetUserId ? m.user_id === targetUserId : true,
                ),
              );
            }
            if (method === 'DELETE') {
              for (let i = orgMembers.length - 1; i >= 0; i -= 1) {
                if (!targetUserId || orgMembers[i].user_id === targetUserId) {
                  orgMembers.splice(i, 1);
                }
              }
              return { ok: true, status: 204, json: async () => null };
            }
          }

          throw new Error(`Unhandled mock endpoint: ${method} ${pathname}`);
        };

        let capturedFixture = null;
        const deps = defaultStubDependencies({
          createFixtureFn: (key, options) => {
            capturedFixture = options.fixture;
            return createFixture(key, { ...options, fetchFn });
          },
          cleanupFn: (key, fixture, options) =>
            cleanup(key, fixture, { ...options, fetchFn }),
        });

        const { evidence, failure, tracePath } = await runQaHarness({
          ...deps,
          artifactDir,
          negativeControl: true,
          quiescenceTimeoutMs: 300,
        });

        assert.equal(failure, true, lostStage);
        assert.equal(evidence.overall, 'FAIL', lostStage);
        assert.equal(evidence.failure?.stage, 'FIXTURE_CREATION', lostStage);
        assert.equal(
          evidence.failure?.code,
          'PROCESS_SIGNAL_TERMINATED',
          lostStage,
        );
        assert.equal(evidence.cleanup.attempted, true, lostStage);
        assert.equal(evidence.cleanup.status, 'UNVERIFIED', lostStage);
        assert.equal(
          evidence.cleanup.reason,
          'MUTATION_OUTCOME_AMBIGUOUS',
          lostStage,
        );
        assert.equal(evidence.cleanup.executionQuiesced, true, lostStage);
        assert.equal(evidence.failure?.cleanupStatus, 'UNVERIFIED', lostStage);

        // No subsequent mutations were started after the lost response + signal.
        assert.deepEqual(
          mutationCalls,
          lostStage === 'auth_response_lost'
            ? ['POST /auth/v1/admin/users']
            : lostStage === 'profile_response_lost'
              ? ['POST /auth/v1/admin/users', 'POST /rest/v1/users']
              : [
                  'POST /auth/v1/admin/users',
                  'POST /rest/v1/users',
                  'POST /rest/v1/organization_members',
                ],
          lostStage,
        );

        // Committed synthetic records were reconciled by synthetic email and removed,
        // while unrelated records in the database were preserved intact.
        assert.equal(authUsers.size, 1, lostStage);
        assert.equal(
          authUsers.has('00000000-0000-4000-8000-000000000999'),
          true,
          lostStage,
        );
        assert.equal(appUsers.size, 1, lostStage);
        assert.equal(
          appUsers.has('00000000-0000-4000-8000-000000000888'),
          true,
          lostStage,
        );
        assert.equal(orgMembers.length, 1, lostStage);

        const rawTrace = readFileSync(tracePath, 'utf8');
        assert.doesNotMatch(rawTrace, new RegExp(capturedFixture.email));

        const verification = verifyTraceFile(tracePath, {
          expectedMode: 'intentional-broken-login',
          exitStatus: 1,
        });
        assert.equal(verification.valid, false, lostStage);
        assert.equal(
          verification.code,
          'FIXTURE_CLEANUP_NOT_VERIFIED',
          lostStage,
        );
      });
    }
  });

  it('never reports cleanup PASS when client response fails before server commit or when server commits after early cleanup reconciliation across all three mutation stages', async () => {
    const mutationStages = [
      {
        stageKey: 'auth',
        endpoint: 'POST /auth/v1/admin/users',
        expectedDispatched: ['POST /auth/v1/admin/users'],
      },
      {
        stageKey: 'profile',
        endpoint: 'POST /rest/v1/users',
        expectedDispatched: [
          'POST /auth/v1/admin/users',
          'POST /rest/v1/users',
        ],
      },
      {
        stageKey: 'membership',
        endpoint: 'POST /rest/v1/organization_members',
        expectedDispatched: [
          'POST /auth/v1/admin/users',
          'POST /rest/v1/users',
          'POST /rest/v1/organization_members',
        ],
      },
    ];

    for (const mode of [
      'client_failure_before_commit',
      'late_commit_after_cleanup_and_trace_finalization',
    ]) {
      for (const target of mutationStages) {
        await withTempDir(async (artifactDir) => {
          const label = `${mode}:${target.stageKey}`;
          const authUsers = new Map([
            [
              '00000000-0000-4000-8000-000000000999',
              {
                id: '00000000-0000-4000-8000-000000000999',
                email: 'unrelated-operator@example.test',
              },
            ],
          ]);
          const appUsers = new Map([
            [
              '00000000-0000-4000-8000-000000000888',
              {
                id: '00000000-0000-4000-8000-000000000888',
                auth_user_id: '00000000-0000-4000-8000-000000000999',
                email: 'unrelated-operator@example.test',
                name: 'Unrelated Operator',
                status: 'ACTIVE',
              },
            ],
          ]);
          const orgMembers = [
            {
              organization_id: '00000000-0000-4000-8000-000000000010',
              user_id: '00000000-0000-4000-8000-000000000888',
              role_id: '00000000-0000-4000-8000-000000000020',
              status: 'ACTIVE',
            },
          ];
          const mutationCalls = [];
          let deferredServerCommit = null;
          let cleanupObservedZeroTargetRecords = false;

          const jsonResponse = (status, payload) => ({
            ok: status >= 200 && status < 300,
            status,
            json: async () => payload,
          });

          const fetchFn = async (url, options = {}) => {
            const parsed = new URL(String(url));
            const method = options.method ?? 'GET';
            const pathname = parsed.pathname;
            const endpointKey = `${method} ${pathname}`;

            if (method === 'GET' && pathname === '/rest/v1/organizations') {
              return jsonResponse(200, [
                { id: '00000000-0000-4000-8000-000000000010' },
              ]);
            }
            if (method === 'GET' && pathname === '/rest/v1/roles') {
              return jsonResponse(200, [
                { id: '00000000-0000-4000-8000-000000000020' },
              ]);
            }

            if (method === 'POST') {
              mutationCalls.push(endpointKey);
            }

            if (endpointKey === 'POST /auth/v1/admin/users') {
              const body = JSON.parse(options.body);
              const user = {
                id: '00000000-0000-4000-8000-000000000701',
                email: body.email,
              };
              if (target.stageKey === 'auth') {
                if (
                  mode === 'late_commit_after_cleanup_and_trace_finalization'
                ) {
                  deferredServerCommit = () => {
                    authUsers.set(user.id, user);
                  };
                }
                process.emit('SIGTERM', 'SIGTERM');
                const err = new Error(
                  'Client HTTP response failed before server commit outcome known',
                );
                err.name = 'AbortError';
                throw err;
              }
              authUsers.set(user.id, user);
              return jsonResponse(200, user);
            }

            if (endpointKey === 'POST /rest/v1/users') {
              const body = JSON.parse(options.body);
              const row = {
                id: '00000000-0000-4000-8000-000000000702',
                auth_user_id: body.auth_user_id,
                email: body.email,
                name: body.name,
                status: body.status,
              };
              if (target.stageKey === 'profile') {
                if (
                  mode === 'late_commit_after_cleanup_and_trace_finalization'
                ) {
                  deferredServerCommit = () => {
                    appUsers.set(row.id, row);
                  };
                }
                process.emit('SIGTERM', 'SIGTERM');
                const err = new Error(
                  'Client HTTP response failed before server commit outcome known',
                );
                err.name = 'AbortError';
                throw err;
              }
              appUsers.set(row.id, row);
              return jsonResponse(201, [row]);
            }

            if (endpointKey === 'POST /rest/v1/organization_members') {
              const body = JSON.parse(options.body);
              const row = { ...body };
              if (target.stageKey === 'membership') {
                if (
                  mode === 'late_commit_after_cleanup_and_trace_finalization'
                ) {
                  deferredServerCommit = () => {
                    orgMembers.push(row);
                  };
                }
                process.emit('SIGTERM', 'SIGTERM');
                const err = new Error(
                  'Client HTTP response failed before server commit outcome known',
                );
                err.name = 'AbortError';
                throw err;
              }
              orgMembers.push(row);
              return jsonResponse(201, [row]);
            }

            if (method === 'GET' && pathname === '/auth/v1/admin/users') {
              if (target.stageKey === 'auth' && authUsers.size === 1) {
                cleanupObservedZeroTargetRecords = true;
              }
              return jsonResponse(200, {
                users: Array.from(authUsers.values()),
              });
            }

            if (pathname.startsWith('/auth/v1/admin/users/')) {
              const authId = pathname.slice('/auth/v1/admin/users/'.length);
              if (method === 'DELETE') {
                const existed = authUsers.delete(authId);
                return jsonResponse(existed ? 200 : 404, {});
              }
              if (method === 'GET') {
                return authUsers.has(authId)
                  ? jsonResponse(200, authUsers.get(authId))
                  : jsonResponse(404, {});
              }
            }

            if (pathname === '/rest/v1/users') {
              const idFilter = parsed.searchParams.get('id');
              const emailFilter = parsed.searchParams.get('email');
              const matchRow = (row) => {
                if (idFilter?.startsWith('eq.')) {
                  return row.id === idFilter.slice(3);
                }
                if (emailFilter?.startsWith('eq.')) {
                  return row.email === emailFilter.slice(3);
                }
                return true;
              };
              if (method === 'GET') {
                const matched = Array.from(appUsers.values()).filter(matchRow);
                if (target.stageKey === 'profile' && matched.length === 0) {
                  cleanupObservedZeroTargetRecords = true;
                }
                return jsonResponse(200, matched);
              }
              if (method === 'DELETE') {
                for (const [id, row] of appUsers.entries()) {
                  if (matchRow(row)) {
                    appUsers.delete(id);
                  }
                }
                return { ok: true, status: 204, json: async () => null };
              }
            }

            if (pathname === '/rest/v1/organization_members') {
              const userIdFilter = parsed.searchParams.get('user_id');
              const targetUserId = userIdFilter?.startsWith('eq.')
                ? userIdFilter.slice(3)
                : null;
              if (method === 'GET') {
                const matched = orgMembers.filter((m) =>
                  targetUserId ? m.user_id === targetUserId : true,
                );
                if (target.stageKey === 'membership' && matched.length === 0) {
                  cleanupObservedZeroTargetRecords = true;
                }
                return jsonResponse(200, matched);
              }
              if (method === 'DELETE') {
                for (let i = orgMembers.length - 1; i >= 0; i -= 1) {
                  if (!targetUserId || orgMembers[i].user_id === targetUserId) {
                    orgMembers.splice(i, 1);
                  }
                }
                return { ok: true, status: 204, json: async () => null };
              }
            }

            throw new Error(`Unhandled mock endpoint: ${endpointKey}`);
          };

          let capturedFixture = null;
          const deps = defaultStubDependencies({
            createFixtureFn: (key, options) => {
              capturedFixture = options.fixture;
              return createFixture(key, { ...options, fetchFn });
            },
            cleanupFn: (key, fixture, options) =>
              cleanup(key, fixture, { ...options, fetchFn }),
          });

          const { evidence, failure, tracePath } = await runQaHarness({
            ...deps,
            artifactDir,
            negativeControl: true,
            quiescenceTimeoutMs: 300,
          });

          const traceBeforeLateCommit = readFileSync(tracePath, 'utf8');
          const evidenceSnapshotBeforeLateCommit = JSON.stringify(evidence);

          // Cleanup queried the server while 0 records existed for the target stage,
          // and deleted all prior confirmed stage records while leaving unrelated records intact.
          assert.equal(cleanupObservedZeroTargetRecords, true, label);
          assert.equal(authUsers.size, 1, label);
          assert.equal(
            authUsers.has('00000000-0000-4000-8000-000000000999'),
            true,
            label,
          );
          assert.equal(appUsers.size, 1, label);
          assert.equal(
            appUsers.has('00000000-0000-4000-8000-000000000888'),
            true,
            label,
          );
          assert.equal(orgMembers.length, 1, label);

          // Now execute the late server commit AFTER cleanup and trace finalization.
          if (deferredServerCommit) {
            deferredServerCommit();
          }

          // Never reports cleanup PASS on an ambiguous mutation outcome.
          assert.equal(failure, true, label);
          assert.equal(evidence.overall, 'FAIL', label);
          assert.equal(evidence.cleanup.attempted, true, label);
          assert.equal(evidence.cleanup.status, 'UNVERIFIED', label);
          assert.notEqual(evidence.cleanup.status, 'PASS', label);
          assert.equal(
            evidence.cleanup.reason,
            'MUTATION_OUTCOME_AMBIGUOUS',
            label,
          );
          assert.deepEqual(
            evidence.cleanup.ambiguousMutations,
            [target.stageKey],
            label,
          );
          assert.equal(evidence.cleanup.executionQuiesced, true, label);
          assert.equal(evidence.failure?.cleanupStatus, 'UNVERIFIED', label);
          assert.equal(
            typeof evidence.failure?.cleanupUncertainty,
            'string',
            label,
          );
          assert.deepEqual(
            evidence.failure?.ambiguousMutations,
            [target.stageKey],
            label,
          );

          // Sticky mutation tracking state on fixture object.
          assert.equal(capturedFixture?.mutationOutcomeAmbiguous, true, label);
          assert.equal(capturedFixture?.pendingMutation, false, label);
          assert.equal(
            capturedFixture?.mutations?.[target.stageKey]?.status,
            'AMBIGUOUS',
            label,
          );
          assert.equal(
            capturedFixture?.mutations?.[target.stageKey]?.dispatched,
            true,
            label,
          );
          assert.equal(
            capturedFixture?.mutations?.[target.stageKey]?.confirmed,
            false,
            label,
          );
          assert.equal(
            capturedFixture?.mutations?.[target.stageKey]?.ambiguous,
            true,
            label,
          );

          // No subsequent fixture mutation is dispatched after cancellation.
          assert.deepEqual(mutationCalls, target.expectedDispatched, label);

          // Trace is sanitized and never mutated after finalization.
          assert.doesNotMatch(
            traceBeforeLateCommit,
            new RegExp(capturedFixture.email),
            label,
          );
          assert.equal(
            readFileSync(tracePath, 'utf8'),
            traceBeforeLateCommit,
            label,
          );
          assert.equal(
            JSON.stringify(evidence),
            evidenceSnapshotBeforeLateCommit,
            label,
          );

          const verification = verifyTraceFile(tracePath, {
            expectedMode: 'intentional-broken-login',
            exitStatus: 1,
          });
          assert.equal(verification.valid, false, label);
          assert.equal(
            verification.code,
            'FIXTURE_CLEANUP_NOT_VERIFIED',
            label,
          );
        });
      }
    }
  });

  it('spawns real CLI child process across process.exit boundary and verifies fixture cancellation and compensating cleanup over loopback HTTP', async () => {
    const cliScenarios = [
      {
        label:
          'CLI child process interrupted during auth creation (within quiescence)',
        stallEndpoint: 'POST /auth/v1/admin/users',
        delayMs: 20,
        quiescenceTimeoutMs: 2000,
        fixtureDrainTimeoutMs: 2000,
        expectedCleanupStatus: 'PASS',
        expectedQuiesced: true,
        expectedFailureStage: 'FIXTURE_CREATION',
        expectedFailureCode: 'PROCESS_SIGNAL_TERMINATED',
        expectedMutations: ['POST /auth/v1/admin/users'],
      },
      {
        label:
          'CLI child process interrupted during profile creation (within quiescence)',
        stallEndpoint: 'POST /rest/v1/users',
        delayMs: 20,
        quiescenceTimeoutMs: 2000,
        fixtureDrainTimeoutMs: 2000,
        expectedCleanupStatus: 'PASS',
        expectedQuiesced: true,
        expectedFailureStage: 'FIXTURE_CREATION',
        expectedFailureCode: 'PROCESS_SIGNAL_TERMINATED',
        expectedMutations: ['POST /auth/v1/admin/users', 'POST /rest/v1/users'],
      },
      {
        label:
          'CLI child process interrupted during membership creation (within quiescence)',
        stallEndpoint: 'POST /rest/v1/organization_members',
        delayMs: 20,
        quiescenceTimeoutMs: 2000,
        fixtureDrainTimeoutMs: 2000,
        expectedCleanupStatus: 'PASS',
        expectedQuiesced: true,
        expectedFailureStage: 'FIXTURE_CREATION',
        expectedFailureCode: 'PROCESS_SIGNAL_TERMINATED',
        expectedMutations: [
          'POST /auth/v1/admin/users',
          'POST /rest/v1/users',
          'POST /rest/v1/organization_members',
        ],
      },
      {
        label:
          'CLI child process interrupted during auth creation (beyond quiescence, drained before process.exit)',
        stallEndpoint: 'POST /auth/v1/admin/users',
        delayMs: 350,
        quiescenceTimeoutMs: 30,
        fixtureDrainTimeoutMs: 2500,
        expectedCleanupStatus: 'UNVERIFIED',
        expectedQuiesced: false,
        expectedFailureStage: 'CLEANUP',
        expectedFailureCode: 'SUBPROCESS_TEARDOWN_FAILED',
        expectedMutations: ['POST /auth/v1/admin/users'],
      },
      {
        label:
          'CLI child process interrupted during profile creation (beyond quiescence, drained before process.exit)',
        stallEndpoint: 'POST /rest/v1/users',
        delayMs: 350,
        quiescenceTimeoutMs: 30,
        fixtureDrainTimeoutMs: 2500,
        expectedCleanupStatus: 'UNVERIFIED',
        expectedQuiesced: false,
        expectedFailureStage: 'CLEANUP',
        expectedFailureCode: 'SUBPROCESS_TEARDOWN_FAILED',
        expectedMutations: ['POST /auth/v1/admin/users', 'POST /rest/v1/users'],
      },
      {
        label:
          'CLI child process interrupted during membership creation (beyond quiescence, drained before process.exit)',
        stallEndpoint: 'POST /rest/v1/organization_members',
        delayMs: 350,
        quiescenceTimeoutMs: 30,
        fixtureDrainTimeoutMs: 2500,
        expectedCleanupStatus: 'UNVERIFIED',
        expectedQuiesced: false,
        expectedFailureStage: 'CLEANUP',
        expectedFailureCode: 'SUBPROCESS_TEARDOWN_FAILED',
        expectedMutations: [
          'POST /auth/v1/admin/users',
          'POST /rest/v1/users',
          'POST /rest/v1/organization_members',
        ],
      },
      {
        label:
          'CLI child process interrupted when profile request hangs beyond both quiescence and drain window',
        stallEndpoint: 'POST /rest/v1/users',
        hangBeyondDrain: true,
        delayMs: 5000,
        quiescenceTimeoutMs: 30,
        fixtureDrainTimeoutMs: 80,
        expectedCleanupStatus: 'UNVERIFIED',
        expectedQuiesced: false,
        expectedFailureStage: 'CLEANUP',
        expectedFailureCode: 'SUBPROCESS_TEARDOWN_FAILED',
        expectedMutations: ['POST /auth/v1/admin/users', 'POST /rest/v1/users'],
      },
      {
        label:
          'CLI child process over loopback HTTP where server commits synthetic auth mutation after client disconnect and cleanup query',
        stallEndpoint: 'POST /auth/v1/admin/users',
        lateCommitAfterDisconnect: true,
        quiescenceTimeoutMs: 2000,
        fixtureDrainTimeoutMs: 2000,
        expectedCleanupStatus: 'UNVERIFIED',
        expectedCleanupReason: 'MUTATION_OUTCOME_AMBIGUOUS',
        expectedAmbiguousMutations: ['auth'],
        expectedQuiesced: true,
        expectedFailureStage: 'FIXTURE_CREATION',
        expectedFailureCode: 'PROCESS_SIGNAL_TERMINATED',
        expectedMutations: ['POST /auth/v1/admin/users'],
      },
      {
        label:
          'CLI child process over loopback HTTP where server commits synthetic profile mutation after client disconnect and cleanup query',
        stallEndpoint: 'POST /rest/v1/users',
        lateCommitAfterDisconnect: true,
        quiescenceTimeoutMs: 2000,
        fixtureDrainTimeoutMs: 2000,
        expectedCleanupStatus: 'UNVERIFIED',
        expectedCleanupReason: 'MUTATION_OUTCOME_AMBIGUOUS',
        expectedAmbiguousMutations: ['profile'],
        expectedQuiesced: true,
        expectedFailureStage: 'FIXTURE_CREATION',
        expectedFailureCode: 'PROCESS_SIGNAL_TERMINATED',
        expectedMutations: ['POST /auth/v1/admin/users', 'POST /rest/v1/users'],
      },
      {
        label:
          'CLI child process over loopback HTTP where server commits synthetic membership mutation after client disconnect and cleanup query',
        stallEndpoint: 'POST /rest/v1/organization_members',
        lateCommitAfterDisconnect: true,
        quiescenceTimeoutMs: 2000,
        fixtureDrainTimeoutMs: 2000,
        expectedCleanupStatus: 'UNVERIFIED',
        expectedCleanupReason: 'MUTATION_OUTCOME_AMBIGUOUS',
        expectedAmbiguousMutations: ['membership'],
        expectedQuiesced: true,
        expectedFailureStage: 'FIXTURE_CREATION',
        expectedFailureCode: 'PROCESS_SIGNAL_TERMINATED',
        expectedMutations: [
          'POST /auth/v1/admin/users',
          'POST /rest/v1/users',
          'POST /rest/v1/organization_members',
        ],
      },
    ];

    for (const scenario of cliScenarios) {
      await withTempDir(async (tempRoot) => {
        const authUsers = new Map([
          [
            '00000000-0000-4000-8000-000000000999',
            {
              id: '00000000-0000-4000-8000-000000000999',
              email: 'unrelated-operator@example.test',
            },
          ],
        ]);
        const appUsers = new Map([
          [
            '00000000-0000-4000-8000-000000000888',
            {
              id: '00000000-0000-4000-8000-000000000888',
              auth_user_id: '00000000-0000-4000-8000-000000000999',
              email: 'unrelated-operator@example.test',
              name: 'Unrelated Operator',
              status: 'ACTIVE',
            },
          ],
        ]);
        const orgMembers = [
          {
            organization_id: '00000000-0000-4000-8000-000000000010',
            user_id: '00000000-0000-4000-8000-000000000888',
            role_id: '00000000-0000-4000-8000-000000000020',
            status: 'ACTIVE',
          },
        ];
        const mutationCalls = [];
        let activeChild = null;
        let signalSent = false;
        let deferredLoopbackCommit = null;

        const sendJson = (res, status, payload) => {
          const raw =
            status === 204 || payload === null ? '' : JSON.stringify(payload);
          res.writeHead(status, { 'Content-Type': 'application/json' });
          res.end(raw);
        };

        const readJsonBody = (req) =>
          new Promise((resolve, reject) => {
            let data = '';
            req.setEncoding('utf8');
            req.on('data', (chunk) => {
              data += chunk;
            });
            req.on('end', () => {
              try {
                resolve(data ? JSON.parse(data) : {});
              } catch (err) {
                reject(err);
              }
            });
            req.on('error', reject);
          });

        const server = createServer(async (req, res) => {
          const parsed = new URL(req.url ?? '/', 'http://127.0.0.1');
          const method = req.method ?? 'GET';
          const pathname = parsed.pathname;
          const endpointKey = `${method} ${pathname}`;

          if (method === 'GET' && pathname === '/rest/v1/organizations') {
            return sendJson(res, 200, [
              { id: '00000000-0000-4000-8000-000000000010' },
            ]);
          }
          if (method === 'GET' && pathname === '/rest/v1/roles') {
            return sendJson(res, 200, [
              { id: '00000000-0000-4000-8000-000000000020' },
            ]);
          }

          if (method === 'POST') {
            mutationCalls.push(endpointKey);
          }

          const body =
            method === 'POST' ? await readJsonBody(req).catch(() => ({})) : {};

          if (endpointKey === scenario.stallEndpoint && !signalSent) {
            signalSent = true;
            if (scenario.lateCommitAfterDisconnect) {
              if (endpointKey === 'POST /auth/v1/admin/users') {
                const user = {
                  id: '00000000-0000-4000-8000-000000000511',
                  email: body.email,
                };
                deferredLoopbackCommit = () => {
                  authUsers.set(user.id, user);
                };
              } else if (endpointKey === 'POST /rest/v1/users') {
                const row = {
                  id: '00000000-0000-4000-8000-000000000522',
                  auth_user_id: body.auth_user_id,
                  email: body.email,
                  name: body.name,
                  status: body.status,
                };
                deferredLoopbackCommit = () => {
                  appUsers.set(row.id, row);
                };
              } else if (endpointKey === 'POST /rest/v1/organization_members') {
                deferredLoopbackCommit = () => {
                  orgMembers.push({ ...body });
                };
              }
              if (activeChild) {
                if (process.platform !== 'win32') {
                  activeChild.kill('SIGTERM');
                } else if (activeChild.connected) {
                  activeChild.send({
                    type: 'QA_TEST_SIGNAL',
                    signal: 'SIGTERM',
                  });
                }
              }
              // Destroy socket before committing so client HTTP response fails while
              // server commit is still pending (commits after client disconnects & exits).
              res.destroy();
              return;
            }

            if (activeChild) {
              if (process.platform !== 'win32') {
                activeChild.kill('SIGTERM');
              } else if (activeChild.connected) {
                activeChild.send({
                  type: 'QA_TEST_SIGNAL',
                  signal: 'SIGTERM',
                });
              }
            }

            if (scenario.hangBeyondDrain) {
              await new Promise((resolve) => {
                const timer = setTimeout(resolve, scenario.delayMs);
                res.on('close', () => {
                  clearTimeout(timer);
                  resolve();
                });
              });
              if (res.writableEnded || res.destroyed) {
                return;
              }
            } else {
              await new Promise((resolve) =>
                setTimeout(resolve, scenario.delayMs),
              );
            }
          }

          if (endpointKey === 'POST /auth/v1/admin/users') {
            const user = {
              id: '00000000-0000-4000-8000-000000000511',
              email: body.email,
            };
            authUsers.set(user.id, user);
            return sendJson(res, 200, user);
          }

          if (endpointKey === 'POST /rest/v1/users') {
            const row = {
              id: '00000000-0000-4000-8000-000000000522',
              auth_user_id: body.auth_user_id,
              email: body.email,
              name: body.name,
              status: body.status,
            };
            appUsers.set(row.id, row);
            return sendJson(res, 201, [row]);
          }

          if (endpointKey === 'POST /rest/v1/organization_members') {
            orgMembers.push({ ...body });
            return sendJson(res, 201, [body]);
          }

          if (method === 'GET' && pathname === '/auth/v1/admin/users') {
            return sendJson(res, 200, {
              users: Array.from(authUsers.values()),
            });
          }

          if (pathname.startsWith('/auth/v1/admin/users/')) {
            const authId = pathname.slice('/auth/v1/admin/users/'.length);
            if (method === 'DELETE') {
              const existed = authUsers.delete(authId);
              return sendJson(res, existed ? 200 : 404, {});
            }
            if (method === 'GET') {
              return authUsers.has(authId)
                ? sendJson(res, 200, authUsers.get(authId))
                : sendJson(res, 404, {});
            }
          }

          if (pathname === '/rest/v1/users') {
            const idFilter = parsed.searchParams.get('id');
            const emailFilter = parsed.searchParams.get('email');
            const matchRow = (row) => {
              if (idFilter?.startsWith('eq.')) {
                return row.id === idFilter.slice(3);
              }
              if (emailFilter?.startsWith('eq.')) {
                return row.email === emailFilter.slice(3);
              }
              return true;
            };
            if (method === 'GET') {
              return sendJson(
                res,
                200,
                Array.from(appUsers.values()).filter(matchRow),
              );
            }
            if (method === 'DELETE') {
              for (const [id, row] of appUsers.entries()) {
                if (matchRow(row)) {
                  appUsers.delete(id);
                }
              }
              return sendJson(res, 204, null);
            }
          }

          if (pathname === '/rest/v1/organization_members') {
            const userIdFilter = parsed.searchParams.get('user_id');
            const targetUserId = userIdFilter?.startsWith('eq.')
              ? userIdFilter.slice(3)
              : null;
            if (method === 'GET') {
              return sendJson(
                res,
                200,
                orgMembers.filter((m) =>
                  targetUserId ? m.user_id === targetUserId : true,
                ),
              );
            }
            if (method === 'DELETE') {
              for (let i = orgMembers.length - 1; i >= 0; i -= 1) {
                if (!targetUserId || orgMembers[i].user_id === targetUserId) {
                  orgMembers.splice(i, 1);
                }
              }
              return sendJson(res, 204, null);
            }
          }

          sendJson(res, 404, { error: `Unhandled: ${endpointKey}` });
        });

        await new Promise((resolve) =>
          server.listen(0, '127.0.0.1', () => resolve()),
        );
        const { port } = server.address();
        const apiOrigin = `http://127.0.0.1:${port}`;

        const fakeWorkdir = path.join(tempRoot, 'workdir');
        const artifactDir = path.join(tempRoot, 'artifacts');
        const supabaseDir = path.join(
          fakeWorkdir,
          'node_modules',
          'supabase',
          'dist',
        );
        mkdirSync(supabaseDir, { recursive: true });
        mkdirSync(artifactDir, { recursive: true });

        writeFileSync(
          path.join(fakeWorkdir, 'package.json'),
          JSON.stringify({
            name: '@mgbos/app',
            private: true,
            scripts: {
              build: 'node -e "process.exit(0)"',
            },
          }),
          'utf8',
        );

        writeFileSync(
          path.join(supabaseDir, 'supabase.js'),
          [
            `console.log('API_URL="${apiOrigin}"');`,
            `console.log('ANON_KEY="synthetic_cli_anon_key_for_test"');`,
            `console.log('SERVICE_ROLE_KEY="synthetic_cli_service_key_for_test"');`,
            `console.log('DB_URL="postgresql://postgres:postgres@127.0.0.1:55432/postgres"');`,
          ].join('\n'),
          'utf8',
        );

        try {
          activeChild = spawn(
            process.execPath,
            [
              scriptPath,
              '--workdir',
              fakeWorkdir,
              '--artifact-dir',
              artifactDir,
              '--api-origin',
              apiOrigin,
              '--quiescence-timeout-ms',
              String(scenario.quiescenceTimeoutMs),
              '--fixture-drain-timeout-ms',
              String(scenario.fixtureDrainTimeoutMs),
            ],
            {
              cwd: fakeWorkdir,
              env: {
                ...process.env,
                MGBOS_QA_NEGATIVE_CONTROL: '1',
                NEXT_PUBLIC_SUPABASE_URL: apiOrigin,
                SUPABASE_URL: apiOrigin,
              },
              stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
            },
          );

          const exitResult = await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              activeChild?.kill('SIGKILL');
              reject(
                new Error(`CLI child process timed out: ${scenario.label}`),
              );
            }, 25000);
            activeChild.on('close', (code, sig) => {
              clearTimeout(timeout);
              resolve({ code, sig });
            });
            activeChild.on('error', (err) => {
              clearTimeout(timeout);
              reject(err);
            });
          });

          // At the exact moment the CLI child process exits via process.exit(exitCode),
          // all compensating cleanup over loopback HTTP must already have completed,
          // and unrelated operator records must remain intact.
          assert.equal(exitResult.code, 1, scenario.label);
          assert.deepEqual(
            mutationCalls,
            scenario.expectedMutations,
            scenario.label,
          );
          assert.equal(authUsers.size, 1, scenario.label);
          assert.equal(
            authUsers.has('00000000-0000-4000-8000-000000000999'),
            true,
            scenario.label,
          );
          assert.equal(appUsers.size, 1, scenario.label);
          assert.equal(
            appUsers.has('00000000-0000-4000-8000-000000000888'),
            true,
            scenario.label,
          );
          assert.equal(orgMembers.length, 1, scenario.label);

          const tracePath = path.join(artifactDir, 'trace.json');
          assert.equal(existsSync(tracePath), true, scenario.label);
          const rawTraceBeforeLateCommit = readFileSync(tracePath, 'utf8');

          // If this scenario tests server commit after client disconnect & cleanup query,
          // trigger the late server commit now and verify trace never claimed cleanup PASS.
          if (deferredLoopbackCommit) {
            deferredLoopbackCommit();
          }

          const trace = JSON.parse(readFileSync(tracePath, 'utf8'));
          assert.equal(
            readFileSync(tracePath, 'utf8'),
            rawTraceBeforeLateCommit,
            scenario.label,
          );
          assert.equal(trace.overall, 'FAIL', scenario.label);
          assert.equal(trace.cleanup?.attempted, true, scenario.label);
          assert.equal(
            trace.cleanup?.status,
            scenario.expectedCleanupStatus,
            scenario.label,
          );
          if (scenario.expectedCleanupReason) {
            assert.equal(
              trace.cleanup?.reason,
              scenario.expectedCleanupReason,
              scenario.label,
            );
            assert.deepEqual(
              trace.cleanup?.ambiguousMutations,
              scenario.expectedAmbiguousMutations,
              scenario.label,
            );
            assert.equal(
              trace.failure?.cleanupStatus,
              'UNVERIFIED',
              scenario.label,
            );
            const verification = verifyTraceFile(tracePath, {
              expectedMode: 'intentional-broken-login',
              exitStatus: 1,
            });
            assert.equal(verification.valid, false, scenario.label);
            assert.equal(
              verification.code,
              'FIXTURE_CLEANUP_NOT_VERIFIED',
              scenario.label,
            );
          }
          assert.equal(
            trace.cleanup?.executionQuiesced,
            scenario.expectedQuiesced,
            scenario.label,
          );
          assert.equal(
            trace.failure?.stage,
            scenario.expectedFailureStage,
            scenario.label,
          );
          assert.equal(
            trace.failure?.code,
            scenario.expectedFailureCode,
            scenario.label,
          );
        } finally {
          await new Promise((resolve) => server.close(() => resolve()));
        }
      });
    }
  });

  it('SEC64-01: enforces verified synthetic ownership before deletion across wrong IDs, mismatched links, duplicates, missing fields, and mixed references', async () => {
    const UNRELATED_AUTH_ID = '00000000-0000-4000-8000-000000000999';
    const UNRELATED_PROFILE_ID = '00000000-0000-4000-8000-000000000888';
    const UNRELATED_EMAIL = 'unrelated-operator@example.test';
    const SEED_ORG_ID = '00000000-0000-4000-8000-000000000010';
    const OTHER_ORG_ID = '00000000-0000-4000-8000-000000000019';
    const SEED_ROLE_ID = '00000000-0000-4000-8000-000000000020';
    const OTHER_ROLE_ID = '00000000-0000-4000-8000-000000000029';
    const SYNTH_EMAIL =
      'ci-auth-11111111-2222-4333-8444-555555555555@example.test';
    const SYNTH_AUTH_ID = '00000000-0000-4000-8000-000000000111';
    const SYNTH_PROFILE_ID = '00000000-0000-4000-8000-000000000222';

    function createOwnershipTestStore({
      extraAuthUsers = [],
      extraAppUsers = [],
      extraOrgMembers = [],
      overrideAuthGetById,
      overrideAuthList,
    } = {}) {
      const authUsers = new Map([
        [UNRELATED_AUTH_ID, { id: UNRELATED_AUTH_ID, email: UNRELATED_EMAIL }],
        ...extraAuthUsers.map((u) => [u.id, { ...u }]),
      ]);
      const appUsers = new Map([
        [
          UNRELATED_PROFILE_ID,
          {
            id: UNRELATED_PROFILE_ID,
            auth_user_id: UNRELATED_AUTH_ID,
            email: UNRELATED_EMAIL,
            name: 'Unrelated Operator',
            status: 'ACTIVE',
          },
        ],
        ...extraAppUsers.map((u) => [u.id, { ...u }]),
      ]);
      const orgMembers = [
        {
          organization_id: SEED_ORG_ID,
          user_id: UNRELATED_PROFILE_ID,
          role_id: SEED_ROLE_ID,
          status: 'ACTIVE',
        },
        ...extraOrgMembers.map((m) => ({ ...m })),
      ];
      const deleteCalls = [];

      const jsonResponse = (status, payload) => ({
        ok: status >= 200 && status < 300,
        status,
        json: async () => payload,
      });

      const fetchFn = async (url, options = {}) => {
        const parsed = new URL(String(url));
        const method = options.method ?? 'GET';
        const pathname = parsed.pathname;

        if (method === 'DELETE') {
          deleteCalls.push(`${pathname}${parsed.search}`);
        }

        if (method === 'GET' && pathname === '/auth/v1/admin/users') {
          if (overrideAuthList) {
            return jsonResponse(200, overrideAuthList(authUsers));
          }
          return jsonResponse(200, {
            users: Array.from(authUsers.values()),
          });
        }

        if (pathname.startsWith('/auth/v1/admin/users/')) {
          const authId = decodeURIComponent(
            pathname.slice('/auth/v1/admin/users/'.length),
          );
          if (method === 'GET') {
            if (overrideAuthGetById) {
              const custom = overrideAuthGetById(authId, authUsers);
              if (custom) return jsonResponse(custom.status, custom.body);
            }
            return authUsers.has(authId)
              ? jsonResponse(200, authUsers.get(authId))
              : jsonResponse(404, {});
          }
          if (method === 'DELETE') {
            const existed = authUsers.delete(authId);
            return jsonResponse(existed ? 200 : 404, {});
          }
        }

        if (pathname === '/rest/v1/users') {
          const idFilter = parsed.searchParams.get('id');
          const emailFilter = parsed.searchParams.get('email');
          const authUserFilter = parsed.searchParams.get('auth_user_id');
          const matchRow = (row) => {
            if (idFilter?.startsWith('eq.') && row.id !== idFilter.slice(3)) {
              return false;
            }
            if (
              emailFilter?.startsWith('eq.') &&
              row.email !== emailFilter.slice(3)
            ) {
              return false;
            }
            if (
              authUserFilter?.startsWith('eq.') &&
              row.auth_user_id !== authUserFilter.slice(3)
            ) {
              return false;
            }
            return true;
          };
          if (method === 'GET') {
            return jsonResponse(
              200,
              Array.from(appUsers.values()).filter(matchRow),
            );
          }
          if (method === 'DELETE') {
            for (const [id, row] of appUsers.entries()) {
              if (matchRow(row)) {
                appUsers.delete(id);
              }
            }
            return { ok: true, status: 204, json: async () => null };
          }
        }

        if (pathname === '/rest/v1/organization_members') {
          const userIdFilter = parsed.searchParams.get('user_id');
          const orgIdFilter = parsed.searchParams.get('organization_id');
          const roleIdFilter = parsed.searchParams.get('role_id');
          const matchMember = (m) => {
            if (
              userIdFilter?.startsWith('eq.') &&
              m.user_id !== userIdFilter.slice(3)
            ) {
              return false;
            }
            if (
              orgIdFilter?.startsWith('eq.') &&
              m.organization_id !== orgIdFilter.slice(3)
            ) {
              return false;
            }
            if (
              roleIdFilter?.startsWith('eq.') &&
              m.role_id !== roleIdFilter.slice(3)
            ) {
              return false;
            }
            return true;
          };
          if (method === 'GET') {
            return jsonResponse(200, orgMembers.filter(matchMember));
          }
          if (method === 'DELETE') {
            for (let i = orgMembers.length - 1; i >= 0; i -= 1) {
              if (matchMember(orgMembers[i])) {
                orgMembers.splice(i, 1);
              }
            }
            return { ok: true, status: 204, json: async () => null };
          }
        }

        throw new Error(`Unhandled mock endpoint: ${method} ${pathname}`);
      };

      return { authUsers, appUsers, orgMembers, deleteCalls, fetchFn };
    }

    const assertUnrelatedPreserved = (store, label) => {
      assert.equal(store.authUsers.has(UNRELATED_AUTH_ID), true, label);
      assert.equal(store.appUsers.has(UNRELATED_PROFILE_ID), true, label);
      assert.equal(
        store.orgMembers.some(
          (m) =>
            m.user_id === UNRELATED_PROFILE_ID &&
            m.organization_id === SEED_ORG_ID &&
            m.role_id === SEED_ROLE_ID,
        ),
        true,
        label,
      );
    };

    // 1. Auditor's isolated reproduction: wrong auth ID and wrong profile ID pointing to unrelated records.
    {
      const store = createOwnershipTestStore();
      await assert.rejects(
        () =>
          cleanup(
            'synthetic_service_key',
            {
              email: SYNTH_EMAIL,
              auth: UNRELATED_AUTH_ID,
              profile: UNRELATED_PROFILE_ID,
              organizationId: SEED_ORG_ID,
              roleId: SEED_ROLE_ID,
            },
            { fetchFn: store.fetchFn },
          ),
        (err) =>
          err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
      );
      assert.deepEqual(store.deleteCalls, []);
      assertUnrelatedPreserved(store, 'auditor isolated wrong-ID scenario');
    }

    // 2. Non-synthetic email or missing email with claimed IDs fails closed without issuing DELETE.
    for (const badEmail of [
      null,
      '',
      'operator@bisnishub.id',
      'ci-auth-not-valid@other.org',
    ]) {
      const store = createOwnershipTestStore();
      await assert.rejects(
        () =>
          cleanup(
            'synthetic_service_key',
            {
              email: badEmail,
              auth: UNRELATED_AUTH_ID,
              profile: UNRELATED_PROFILE_ID,
            },
            { fetchFn: store.fetchFn },
          ),
        (err) =>
          err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
      );
      assert.deepEqual(store.deleteCalls, []);
      assertUnrelatedPreserved(store, `bad email: ${String(badEmail)}`);
    }

    // 3. Profile has synthetic email but links to an unrelated auth_user_id.
    {
      const store = createOwnershipTestStore({
        extraAuthUsers: [{ id: SYNTH_AUTH_ID, email: SYNTH_EMAIL }],
        extraAppUsers: [
          {
            id: SYNTH_PROFILE_ID,
            auth_user_id: UNRELATED_AUTH_ID,
            email: SYNTH_EMAIL,
            name: 'Mismatched Link',
            status: 'ACTIVE',
          },
        ],
      });
      await assert.rejects(
        () =>
          cleanup(
            'synthetic_service_key',
            {
              email: SYNTH_EMAIL,
              auth: SYNTH_AUTH_ID,
              profile: SYNTH_PROFILE_ID,
              organizationId: SEED_ORG_ID,
              roleId: SEED_ROLE_ID,
            },
            { fetchFn: store.fetchFn },
          ),
        (err) =>
          err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
      );
      // Profile with wrong auth_user_id must NOT be deleted; verified synthetic auth user IS cleaned up.
      assert.equal(store.appUsers.has(SYNTH_PROFILE_ID), true);
      assert.equal(store.authUsers.has(SYNTH_AUTH_ID), false);
      assertUnrelatedPreserved(store, 'mismatched auth_user_id');
    }

    // 4. Membership pointing to another organization or another role is never deleted and fails closed.
    for (const badMember of [
      {
        label: 'wrong organization_id on membership',
        organization_id: OTHER_ORG_ID,
        role_id: SEED_ROLE_ID,
        status: 'ACTIVE',
      },
      {
        label: 'wrong role_id on membership',
        organization_id: SEED_ORG_ID,
        role_id: OTHER_ROLE_ID,
        status: 'ACTIVE',
      },
      {
        label: 'non-ACTIVE status on membership',
        organization_id: SEED_ORG_ID,
        role_id: SEED_ROLE_ID,
        status: 'SUSPENDED',
      },
    ]) {
      const store = createOwnershipTestStore({
        extraAuthUsers: [{ id: SYNTH_AUTH_ID, email: SYNTH_EMAIL }],
        extraAppUsers: [
          {
            id: SYNTH_PROFILE_ID,
            auth_user_id: SYNTH_AUTH_ID,
            email: SYNTH_EMAIL,
            name: 'CI Synthetic Operator',
            status: 'ACTIVE',
          },
        ],
        extraOrgMembers: [
          {
            user_id: SYNTH_PROFILE_ID,
            organization_id: badMember.organization_id,
            role_id: badMember.role_id,
            status: badMember.status,
          },
        ],
      });
      await assert.rejects(
        () =>
          cleanup(
            'synthetic_service_key',
            {
              email: SYNTH_EMAIL,
              auth: SYNTH_AUTH_ID,
              profile: SYNTH_PROFILE_ID,
              organizationId: SEED_ORG_ID,
              roleId: SEED_ROLE_ID,
            },
            { fetchFn: store.fetchFn },
          ),
        (err) =>
          err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
        badMember.label,
      );
      // Mismatched membership was not deleted; verified synthetic profile and auth were cleaned up.
      assert.equal(store.orgMembers.length, 2, badMember.label);
      assert.equal(
        store.appUsers.has(SYNTH_PROFILE_ID),
        false,
        badMember.label,
      );
      assert.equal(store.authUsers.has(SYNTH_AUTH_ID), false, badMember.label);
      assertUnrelatedPreserved(store, badMember.label);
    }

    // 5. Duplicate identity matches (duplicate auth users, duplicate profiles, duplicate memberships) and contradictory auth responses.
    {
      const dupAuthStore = createOwnershipTestStore({
        extraAuthUsers: [
          { id: SYNTH_AUTH_ID, email: SYNTH_EMAIL },
          { id: '00000000-0000-4000-8000-000000000112', email: SYNTH_EMAIL },
        ],
      });
      await assert.rejects(
        () =>
          cleanup(
            'synthetic_service_key',
            { email: SYNTH_EMAIL, auth: SYNTH_AUTH_ID },
            { fetchFn: dupAuthStore.fetchFn },
          ),
        (err) =>
          err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
      );
      assert.deepEqual(dupAuthStore.deleteCalls, []);
      assertUnrelatedPreserved(dupAuthStore, 'duplicate auth users');

      const contradictoryAuthStore = createOwnershipTestStore({
        extraAuthUsers: [{ id: SYNTH_AUTH_ID, email: SYNTH_EMAIL }],
        overrideAuthGetById: (id) =>
          id === SYNTH_AUTH_ID
            ? {
                status: 200,
                body: {
                  id: '00000000-0000-4000-8000-000000000119',
                  email: SYNTH_EMAIL,
                },
              }
            : null,
      });
      await assert.rejects(
        () =>
          cleanup(
            'synthetic_service_key',
            { email: SYNTH_EMAIL, auth: SYNTH_AUTH_ID },
            { fetchFn: contradictoryAuthStore.fetchFn },
          ),
        (err) =>
          err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
      );
      assert.deepEqual(contradictoryAuthStore.deleteCalls, []);

      const dupProfileStore = createOwnershipTestStore({
        extraAuthUsers: [{ id: SYNTH_AUTH_ID, email: SYNTH_EMAIL }],
        extraAppUsers: [
          {
            id: SYNTH_PROFILE_ID,
            auth_user_id: SYNTH_AUTH_ID,
            email: SYNTH_EMAIL,
          },
          {
            id: '00000000-0000-4000-8000-000000000223',
            auth_user_id: SYNTH_AUTH_ID,
            email: SYNTH_EMAIL,
          },
        ],
      });
      await assert.rejects(
        () =>
          cleanup(
            'synthetic_service_key',
            {
              email: SYNTH_EMAIL,
              auth: SYNTH_AUTH_ID,
              profile: SYNTH_PROFILE_ID,
            },
            { fetchFn: dupProfileStore.fetchFn },
          ),
        (err) =>
          err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
      );
      // Duplicate profiles are not deleted; verified single synthetic auth user is cleaned up.
      assert.equal(dupProfileStore.appUsers.size, 3);
      assert.equal(dupProfileStore.authUsers.has(SYNTH_AUTH_ID), false);
      assertUnrelatedPreserved(dupProfileStore, 'duplicate profiles');

      const dupMembershipStore = createOwnershipTestStore({
        extraAuthUsers: [{ id: SYNTH_AUTH_ID, email: SYNTH_EMAIL }],
        extraAppUsers: [
          {
            id: SYNTH_PROFILE_ID,
            auth_user_id: SYNTH_AUTH_ID,
            email: SYNTH_EMAIL,
          },
        ],
        extraOrgMembers: [
          {
            user_id: SYNTH_PROFILE_ID,
            organization_id: SEED_ORG_ID,
            role_id: SEED_ROLE_ID,
            status: 'ACTIVE',
          },
          {
            user_id: SYNTH_PROFILE_ID,
            organization_id: SEED_ORG_ID,
            role_id: OTHER_ROLE_ID,
            status: 'ACTIVE',
          },
        ],
      });
      await assert.rejects(
        () =>
          cleanup(
            'synthetic_service_key',
            {
              email: SYNTH_EMAIL,
              auth: SYNTH_AUTH_ID,
              profile: SYNTH_PROFILE_ID,
              organizationId: SEED_ORG_ID,
              roleId: SEED_ROLE_ID,
            },
            { fetchFn: dupMembershipStore.fetchFn },
          ),
        (err) =>
          err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
      );
      assert.equal(dupMembershipStore.orgMembers.length, 3);
      assertUnrelatedPreserved(dupMembershipStore, 'duplicate memberships');
    }

    // 6. Missing identity fields on server responses fail closed without deleting.
    {
      const missingFieldsStore = createOwnershipTestStore({
        extraAuthUsers: [{ id: SYNTH_AUTH_ID, email: SYNTH_EMAIL }],
        extraAppUsers: [
          {
            id: SYNTH_PROFILE_ID,
            auth_user_id: null,
            email: SYNTH_EMAIL,
          },
        ],
      });
      await assert.rejects(
        () =>
          cleanup(
            'synthetic_service_key',
            {
              email: SYNTH_EMAIL,
              auth: SYNTH_AUTH_ID,
              profile: SYNTH_PROFILE_ID,
              organizationId: SEED_ORG_ID,
              roleId: SEED_ROLE_ID,
            },
            { fetchFn: missingFieldsStore.fetchFn },
          ),
        (err) =>
          err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
      );
      assert.equal(missingFieldsStore.appUsers.has(SYNTH_PROFILE_ID), true);
      assertUnrelatedPreserved(missingFieldsStore, 'missing auth_user_id');
    }

    // 7. Mixed valid and invalid fixture references: fixture.auth/fixture.profile point to unrelated user,
    // while real synthetic records for SYNTH_EMAIL exist in the database.
    // Unrelated records MUST remain untouched, verified synthetic records ARE cleaned up (best-effort),
    // and cleanup() still fails closed with FIXTURE_CLEANUP_FAILED.
    await withTempDir(async (artifactDir) => {
      const mixedStore = createOwnershipTestStore({
        extraAuthUsers: [{ id: SYNTH_AUTH_ID, email: SYNTH_EMAIL }],
        extraAppUsers: [
          {
            id: SYNTH_PROFILE_ID,
            auth_user_id: SYNTH_AUTH_ID,
            email: SYNTH_EMAIL,
            name: 'CI Synthetic Operator',
            status: 'ACTIVE',
          },
        ],
        extraOrgMembers: [
          {
            user_id: SYNTH_PROFILE_ID,
            organization_id: SEED_ORG_ID,
            role_id: SEED_ROLE_ID,
            status: 'ACTIVE',
          },
        ],
      });

      const deps = defaultStubDependencies({
        createFixtureFn: async (_key, { fixture }) => {
          Object.assign(fixture, {
            email: SYNTH_EMAIL,
            password: 'synthetic_password_value_for_unit_test_only',
            auth: UNRELATED_AUTH_ID,
            profile: UNRELATED_PROFILE_ID,
            organizationId: SEED_ORG_ID,
            roleId: SEED_ROLE_ID,
          });
          return fixture;
        },
        cleanupFn: (key, fixture, options) =>
          cleanup(key, fixture, { ...options, fetchFn: mixedStore.fetchFn }),
      });

      const { evidence, failure, tracePath } = await runQaHarness({
        ...deps,
        artifactDir,
        negativeControl: false,
      });

      assert.equal(failure, true);
      assert.equal(evidence.overall, 'FAIL');
      assert.equal(evidence.cleanup.status, 'FAIL');
      assert.equal(evidence.cleanup.reason, 'FIXTURE_CLEANUP_FAILED');
      assert.equal(evidence.failure?.stage, 'CLEANUP');
      assert.equal(evidence.failure?.code, 'FIXTURE_CLEANUP_FAILED');

      // Unrelated records were preserved; independently verified synthetic records were cleaned up.
      assertUnrelatedPreserved(mixedStore, 'mixed valid/invalid references');
      assert.equal(mixedStore.authUsers.has(SYNTH_AUTH_ID), false);
      assert.equal(mixedStore.appUsers.has(SYNTH_PROFILE_ID), false);
      assert.equal(mixedStore.orgMembers.length, 1);

      // Every DELETE call used verified synthetic IDs and full tuple filters.
      assert.deepEqual(mixedStore.deleteCalls, [
        `/rest/v1/organization_members?user_id=eq.${SYNTH_PROFILE_ID}&organization_id=eq.${SEED_ORG_ID}&role_id=eq.${SEED_ROLE_ID}`,
        `/rest/v1/users?id=eq.${SYNTH_PROFILE_ID}&email=eq.${encodeURIComponent(SYNTH_EMAIL)}&auth_user_id=eq.${SYNTH_AUTH_ID}`,
        `/auth/v1/admin/users/${SYNTH_AUTH_ID}`,
      ]);

      const rawTrace = readFileSync(tracePath, 'utf8');
      assert.doesNotMatch(rawTrace, new RegExp(SYNTH_EMAIL));
      assert.doesNotMatch(rawTrace, new RegExp(UNRELATED_EMAIL));
    });
  });

  it('SEC64-02: never reflects unsanitized or non-allowlisted trace fields into diagnostics, summary, stdout, or stderr', async () => {
    const injectedPayloads = [
      {
        label: 'synthetic email in mode',
        token: 'ci-auth-deadbeef-1234-4567-89ab-cdef01234567@example.test',
        mutate: (trace) => {
          trace.mode =
            'ci-auth-deadbeef-1234-4567-89ab-cdef01234567@example.test';
        },
      },
      {
        label: 'JWT in overall',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U',
        mutate: (trace) => {
          trace.overall =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U';
        },
      },
      {
        label: 'Bearer token in stage and failure.stage',
        token: 'Bearer secret_live_token_value_999',
        mutate: (trace) => {
          trace.stage = 'Bearer secret_live_token_value_999';
          trace.failure = {
            stage: 'Bearer secret_live_token_value_999',
            code: 'Bearer secret_live_token_value_999',
          };
        },
      },
      {
        label: 'Supabase secret key in failure.process and failure.signal',
        token: 'sb_secret_live_key_abcdef1234567890',
        mutate: (trace) => {
          trace.failure = {
            stage: 'BROWSER_AUTH',
            code: 'CHILD_PROCESS_TERMINATED',
            process: 'sb_secret_live_key_abcdef1234567890',
            signal: 'sb_secret_live_key_abcdef1234567890',
          };
        },
      },
      {
        label: 'service_role assignment in cleanup.status and cleanup.reason',
        token: 'SUPABASE_SERVICE_ROLE_KEY=super_secret_service_role_value',
        mutate: (trace) => {
          trace.cleanup = {
            attempted: true,
            status: 'SUPABASE_SERVICE_ROLE_KEY=super_secret_service_role_value',
            reason: 'SUPABASE_SERVICE_ROLE_KEY=super_secret_service_role_value',
            ambiguousMutations: [
              'SUPABASE_SERVICE_ROLE_KEY=super_secret_service_role_value',
            ],
          };
        },
      },
      {
        label:
          'non-pattern untrusted string in mode, cleanup.status, and failure.code',
        token: 'UNTRUSTED_DIAGNOSTIC_INJECTION_MARKER_XYZ',
        expectedCode: 'TRACE_MODE_MISMATCH',
        mutate: (trace) => {
          trace.mode = 'UNTRUSTED_DIAGNOSTIC_INJECTION_MARKER_XYZ';
          trace.overall = 'UNTRUSTED_DIAGNOSTIC_INJECTION_MARKER_XYZ';
          trace.stage = 'UNTRUSTED_DIAGNOSTIC_INJECTION_MARKER_XYZ';
          trace.failure = {
            stage: 'UNTRUSTED_DIAGNOSTIC_INJECTION_MARKER_XYZ',
            code: 'UNTRUSTED_DIAGNOSTIC_INJECTION_MARKER_XYZ',
            process: 'UNTRUSTED_DIAGNOSTIC_INJECTION_MARKER_XYZ',
            signal: 'UNTRUSTED_DIAGNOSTIC_INJECTION_MARKER_XYZ',
            exitCode: 'UNTRUSTED_DIAGNOSTIC_INJECTION_MARKER_XYZ',
          };
          trace.cleanup = {
            status: 'UNTRUSTED_DIAGNOSTIC_INJECTION_MARKER_XYZ',
            reason: 'UNTRUSTED_DIAGNOSTIC_INJECTION_MARKER_XYZ',
            ambiguousMutations: ['UNTRUSTED_DIAGNOSTIC_INJECTION_MARKER_XYZ'],
            executionQuiesced: 'UNTRUSTED_DIAGNOSTIC_INJECTION_MARKER_XYZ',
          };
        },
      },
      {
        label: 'malformed metadata types in trace report',
        token: 'MALFORMED_OBJECT_VALUE_MARKER',
        expectedCode: 'TRACE_MODE_MISMATCH',
        mutate: (trace) => {
          trace.mode = { nested: 'MALFORMED_OBJECT_VALUE_MARKER' };
          trace.overall = ['MALFORMED_OBJECT_VALUE_MARKER'];
          trace.stage = 12345;
          trace.failure = ['MALFORMED_OBJECT_VALUE_MARKER'];
          trace.cleanup = 'MALFORMED_OBJECT_VALUE_MARKER';
        },
      },
    ];

    await withTempDir(async (artifactDir) => {
      for (let i = 0; i < injectedPayloads.length; i += 1) {
        const item = injectedPayloads[i];
        const candidate = {
          checkoutSha: 'c21e675698489cf396719226b673050e30840c4a',
          ciEventSha: null,
          cases: [],
          mode: 'normal',
          stage: 'COMPLETED',
          cleanup: {
            attempted: true,
            status: 'PASS',
            browserTerminated: true,
            applicationTerminated: true,
            profileRemoved: true,
            executionQuiesced: true,
          },
          overall: 'PASS',
        };
        item.mutate(candidate);

        const reportResult = validateTraceReport(candidate, {
          expectedMode: 'normal',
          exitStatus: 1,
        });
        assert.equal(reportResult.valid, false, item.label);
        assert.equal(
          reportResult.code,
          item.expectedCode ?? 'TRACE_SENSITIVE_DATA_DETECTED',
          item.label,
        );
        const serializedResult = JSON.stringify(reportResult);
        assert.equal(
          serializedResult.includes(item.token),
          false,
          `validateTraceReport must not reflect injected token (${item.label})`,
        );

        const tracePath = path.join(artifactDir, `sec64-02-${i}.json`);
        writeFileSync(tracePath, JSON.stringify(candidate), 'utf8');

        const cliRun = spawnSync(
          process.execPath,
          [
            scriptPath,
            '--verify-trace',
            tracePath,
            '--expected-mode',
            'normal',
            '--exit-status',
            '1',
          ],
          { cwd: workdir, encoding: 'utf8' },
        );
        assert.equal(cliRun.status, 1, item.label);
        assert.equal(cliRun.stdout, '', item.label);
        assert.equal(
          cliRun.stderr.includes(item.token),
          false,
          `CLI stderr must not reflect injected token (${item.label})`,
        );
        const parsedStderr = JSON.parse(cliRun.stderr.trim());
        assert.equal(parsedStderr.valid, false, item.label);
        assert.equal(
          parsedStderr.code,
          item.expectedCode ?? 'TRACE_SENSITIVE_DATA_DETECTED',
          item.label,
        );
      }

      // Also verify --expected-mode and missing tracePath containing sensitive strings are never reflected.
      const sensitiveArg = 'sb_secret_cli_arg_leak_test_999';
      const badModeRun = spawnSync(
        process.execPath,
        [
          scriptPath,
          '--verify-trace',
          path.join(artifactDir, `${sensitiveArg}.json`),
          '--expected-mode',
          sensitiveArg,
          '--exit-status',
          '1',
        ],
        { cwd: workdir, encoding: 'utf8' },
      );
      assert.equal(badModeRun.status, 1);
      assert.equal(badModeRun.stdout.includes(sensitiveArg), false);
      assert.equal(badModeRun.stderr.includes(sensitiveArg), false);
    });
  });

  it('SEC64-03: enforces strict loopback-only HTTP origin and path boundaries across db, createFixture, cleanup, localStatus, startBrowser, runBrowser, and runQaHarness', async () => {
    const invalidOrigins = [
      'https://example.supabase.co',
      'http://localhost:55431',
      'http://0.0.0.0:55431',
      'http://127.0.0.2:55431',
      'http://[::1]:55431',
      'https://127.0.0.1:55431',
      'ws://127.0.0.1:55431',
      'http://127.0.0.1',
      'http://127.0.0.1:0',
      'http://127.0.0.1:65536',
      'http://user:pass@127.0.0.1:55431',
      'http://127.0.0.1:55431/path',
      'http://127.0.0.1:55431?query=1',
      'http://127.0.0.1:55431#hash',
    ];

    for (const badOrigin of invalidOrigins) {
      assert.throws(
        () => assertLoopbackHttpOrigin(badOrigin),
        (err) =>
          err instanceof QaError && err.code === 'NONLOCAL_TARGET_BLOCKED',
        `assertLoopbackHttpOrigin must reject ${badOrigin}`,
      );

      let fetchCalled = false;
      const forbidFetch = async () => {
        fetchCalled = true;
        throw new Error('fetchFn must not be invoked for invalid origin');
      };

      await assert.rejects(
        () =>
          db('synthetic_key', '/rest/v1/users', {
            api: badOrigin,
            fetchFn: forbidFetch,
          }),
        (err) =>
          err instanceof QaError && err.code === 'NONLOCAL_TARGET_BLOCKED',
        `db must reject ${badOrigin}`,
      );

      await assert.rejects(
        () =>
          createFixture('synthetic_key', {
            api: badOrigin,
            fetchFn: forbidFetch,
          }),
        (err) =>
          err instanceof QaError && err.code === 'NONLOCAL_TARGET_BLOCKED',
        `createFixture must reject ${badOrigin}`,
      );

      await assert.rejects(
        () =>
          cleanup(
            'synthetic_key',
            {
              email:
                'ci-auth-11111111-2222-4333-8444-555555555555@example.test',
              auth: '00000000-0000-4000-8000-000000000111',
            },
            { api: badOrigin, fetchFn: forbidFetch },
          ),
        (err) =>
          err instanceof QaError && err.code === 'NONLOCAL_TARGET_BLOCKED',
        `cleanup must reject ${badOrigin}`,
      );

      assert.throws(
        () => localStatus({ api: badOrigin, env: {} }),
        (err) => err instanceof QaError && err.code === 'LOCAL_STATUS_FAILED',
        `localStatus must reject ${badOrigin}`,
      );

      await assert.rejects(
        () => startBrowser({ app: badOrigin, fetchFn: forbidFetch }),
        (err) =>
          err instanceof QaError && err.code === 'NONLOCAL_TARGET_BLOCKED',
        `startBrowser must reject ${badOrigin}`,
      );

      await assert.rejects(
        () =>
          runBrowser(createMockCdp(), createFixtureState(), {
            cases: [],
            artifactDir: tmpdir(),
            app: badOrigin,
          }),
        (err) =>
          err instanceof QaError && err.code === 'NONLOCAL_TARGET_BLOCKED',
        `runBrowser must reject ${badOrigin}`,
      );

      assert.equal(fetchCalled, false, `No fetch allowed for ${badOrigin}`);
    }

    // Route traversal and malformed route checks at db / resolveLoopbackRequestUrl boundary.
    for (const badRoute of [
      'http://evil.example.com/rest/v1/users',
      '//evil.example.com/rest/v1/users',
      '/rest/v1/../admin',
      '/rest/v1/users/..',
      '/auth/v1/admin/users/bad@host',
      '/rest/v1/users\\admin',
      '/rest/v1/users#fragment',
    ]) {
      assert.throws(
        () => resolveLoopbackRequestUrl(CANONICAL_API_ORIGIN, badRoute),
        (err) =>
          err instanceof QaError && err.code === 'NONLOCAL_TARGET_BLOCKED',
        `resolveLoopbackRequestUrl must reject ${badRoute}`,
      );
      await assert.rejects(
        () =>
          db('synthetic_key', badRoute, {
            api: CANONICAL_API_ORIGIN,
            fetchFn: async () => {
              throw new Error('fetch must not be called');
            },
          }),
        (err) =>
          err instanceof QaError && err.code === 'NONLOCAL_TARGET_BLOCKED',
        `db must reject route ${badRoute}`,
      );
    }

    // Environment consistency check: mismatched or nonlocal env vars must fail closed.
    assert.throws(
      () =>
        assertConsistentSupabaseEnv('http://127.0.0.1:55431', {
          NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:55432',
        }),
      (err) => err instanceof QaError && err.code === 'NONLOCAL_TARGET_BLOCKED',
    );
    assert.throws(
      () =>
        assertConsistentSupabaseEnv('http://127.0.0.1:55431', {
          SUPABASE_URL: 'https://example.supabase.co',
        }),
      (err) => err instanceof QaError && err.code === 'NONLOCAL_TARGET_BLOCKED',
    );

    // Valid ephemeral loopback ports remain supported.
    assert.equal(
      assertLoopbackHttpOrigin('http://127.0.0.1:59123'),
      'http://127.0.0.1:59123',
    );

    // Mocked localStatusFn returning nonlocal API_URL or DB_URL in runQaHarness must fail closed at LOCAL_STATUS.
    await withTempDir(async (artifactDir) => {
      const badLocalRun = await runQaHarness({
        ...defaultStubDependencies({
          localStatusFn: async () => ({
            API_URL: 'https://example.supabase.co',
            ANON_KEY: 'synthetic_anon_key',
            SERVICE_ROLE_KEY: 'synthetic_service_key',
          }),
        }),
        artifactDir,
        negativeControl: false,
      });
      assert.equal(badLocalRun.failure, true);
      assert.equal(badLocalRun.evidence.stage, 'LOCAL_STATUS');
      assert.equal(badLocalRun.evidence.failure?.code, 'LOCAL_STATUS_FAILED');

      const badDbRun = await runQaHarness({
        ...defaultStubDependencies({
          localStatusFn: async () => ({
            API_URL: CANONICAL_API_ORIGIN,
            ANON_KEY: 'synthetic_anon_key',
            SERVICE_ROLE_KEY: 'synthetic_service_key',
            DB_URL:
              'postgresql://postgres:postgres@remote.example.com:5432/postgres',
          }),
        }),
        artifactDir: path.join(artifactDir, 'bad-db'),
        negativeControl: false,
      });
      assert.equal(badDbRun.failure, true);
      assert.equal(badDbRun.evidence.stage, 'LOCAL_STATUS');
      assert.equal(badDbRun.evidence.failure?.code, 'LOCAL_STATUS_FAILED');
    });
  });

  it('SEC64-04: requires conjunctive user_id, organization_id, role_id, cardinality 1, and status validation before confirming membership creation', async () => {
    const EXPECTED_USER_ID = '00000000-0000-4000-8000-000000000222';
    const EXPECTED_ORG_ID = '00000000-0000-4000-8000-000000000010';
    const EXPECTED_ROLE_ID = '00000000-0000-4000-8000-000000000020';

    const invalidMembershipResponses = [
      {
        label: 'correct organization, wrong user',
        payload: [
          {
            user_id: '00000000-0000-4000-8000-000000000888',
            organization_id: EXPECTED_ORG_ID,
            role_id: EXPECTED_ROLE_ID,
            status: 'ACTIVE',
          },
        ],
      },
      {
        label: 'correct user, wrong organization',
        payload: [
          {
            user_id: EXPECTED_USER_ID,
            organization_id: '00000000-0000-4000-8000-000000000099',
            role_id: EXPECTED_ROLE_ID,
            status: 'ACTIVE',
          },
        ],
      },
      {
        label: 'wrong role_id',
        payload: [
          {
            user_id: EXPECTED_USER_ID,
            organization_id: EXPECTED_ORG_ID,
            role_id: '00000000-0000-4000-8000-000000000099',
            status: 'ACTIVE',
          },
        ],
      },
      {
        label: 'missing role_id',
        payload: [
          {
            user_id: EXPECTED_USER_ID,
            organization_id: EXPECTED_ORG_ID,
            status: 'ACTIVE',
          },
        ],
      },
      {
        label: 'non-ACTIVE status',
        payload: [
          {
            user_id: EXPECTED_USER_ID,
            organization_id: EXPECTED_ORG_ID,
            role_id: EXPECTED_ROLE_ID,
            status: 'INACTIVE',
          },
        ],
      },
      {
        label: 'malformed non-array response',
        payload: {
          user_id: EXPECTED_USER_ID,
          organization_id: EXPECTED_ORG_ID,
          role_id: EXPECTED_ROLE_ID,
        },
      },
      {
        label: 'empty array response',
        payload: [],
      },
      {
        label: 'duplicate membership rows in response',
        payload: [
          {
            user_id: EXPECTED_USER_ID,
            organization_id: EXPECTED_ORG_ID,
            role_id: EXPECTED_ROLE_ID,
            status: 'ACTIVE',
          },
          {
            user_id: EXPECTED_USER_ID,
            organization_id: EXPECTED_ORG_ID,
            role_id: EXPECTED_ROLE_ID,
            status: 'ACTIVE',
          },
        ],
      },
    ];

    for (const item of invalidMembershipResponses) {
      assert.equal(
        isValidConfirmedMembershipResponse(item.payload, {
          expectedUserId: EXPECTED_USER_ID,
          expectedOrganizationId: EXPECTED_ORG_ID,
          expectedRoleId: EXPECTED_ROLE_ID,
        }),
        false,
        item.label,
      );

      await withTempDir(async (artifactDir) => {
        const authUsers = new Map();
        const appUsers = new Map();
        const jsonResponse = (status, payload) => ({
          ok: status >= 200 && status < 300,
          status,
          json: async () => payload,
        });

        const fetchFn = async (url, options = {}) => {
          const parsed = new URL(String(url));
          const method = options.method ?? 'GET';
          const pathname = parsed.pathname;

          if (method === 'GET' && pathname === '/rest/v1/organizations') {
            return jsonResponse(200, [{ id: EXPECTED_ORG_ID }]);
          }
          if (method === 'GET' && pathname === '/rest/v1/roles') {
            return jsonResponse(200, [{ id: EXPECTED_ROLE_ID }]);
          }
          if (method === 'POST' && pathname === '/auth/v1/admin/users') {
            const body = JSON.parse(options.body);
            const user = {
              id: '00000000-0000-4000-8000-000000000111',
              email: body.email,
            };
            authUsers.set(user.id, user);
            return jsonResponse(200, user);
          }
          if (method === 'POST' && pathname === '/rest/v1/users') {
            const body = JSON.parse(options.body);
            const row = {
              id: EXPECTED_USER_ID,
              auth_user_id: body.auth_user_id,
              email: body.email,
              name: body.name,
              status: body.status,
            };
            appUsers.set(row.id, row);
            return jsonResponse(201, [row]);
          }
          if (
            method === 'POST' &&
            pathname === '/rest/v1/organization_members'
          ) {
            return jsonResponse(201, item.payload);
          }
          if (method === 'GET' && pathname === '/auth/v1/admin/users') {
            return jsonResponse(200, { users: Array.from(authUsers.values()) });
          }
          if (pathname.startsWith('/auth/v1/admin/users/')) {
            const authId = pathname.slice('/auth/v1/admin/users/'.length);
            if (method === 'GET') {
              return authUsers.has(authId)
                ? jsonResponse(200, authUsers.get(authId))
                : jsonResponse(404, {});
            }
            if (method === 'DELETE') {
              authUsers.delete(authId);
              return jsonResponse(200, {});
            }
          }
          if (pathname === '/rest/v1/users') {
            if (method === 'GET') {
              return jsonResponse(200, Array.from(appUsers.values()));
            }
            if (method === 'DELETE') {
              appUsers.clear();
              return { ok: true, status: 204, json: async () => null };
            }
          }
          if (pathname === '/rest/v1/organization_members') {
            if (method === 'GET') return jsonResponse(200, []);
            if (method === 'DELETE') {
              return { ok: true, status: 204, json: async () => null };
            }
          }
          throw new Error(`Unhandled endpoint: ${method} ${pathname}`);
        };

        let capturedFixture = null;
        const deps = defaultStubDependencies({
          createFixtureFn: (key, options) => {
            capturedFixture = options.fixture;
            return createFixture(key, { ...options, fetchFn });
          },
          cleanupFn: (key, fixture, options) =>
            cleanup(key, fixture, { ...options, fetchFn }),
        });

        const { evidence, failure } = await runQaHarness({
          ...deps,
          artifactDir,
          negativeControl: false,
        });

        assert.equal(failure, true, item.label);
        assert.equal(evidence.overall, 'FAIL', item.label);
        assert.equal(
          capturedFixture?.mutations?.membership?.confirmed,
          false,
          item.label,
        );
        assert.equal(
          capturedFixture?.mutations?.membership?.status,
          'AMBIGUOUS',
          item.label,
        );
        assert.equal(capturedFixture?.membershipCreated, false, item.label);
        assert.equal(
          capturedFixture?.mutationOutcomeAmbiguous,
          true,
          item.label,
        );
        assert.notEqual(evidence.cleanup.status, 'PASS', item.label);
        assert.equal(evidence.cleanup.status, 'UNVERIFIED', item.label);
        assert.deepEqual(
          evidence.cleanup.ambiguousMutations,
          ['membership'],
          item.label,
        );
      });
    }

    // Valid conjunctive response passes validation.
    assert.equal(
      isValidConfirmedMembershipResponse(
        [
          {
            user_id: EXPECTED_USER_ID,
            organization_id: EXPECTED_ORG_ID,
            role_id: EXPECTED_ROLE_ID,
            status: 'ACTIVE',
          },
        ],
        {
          expectedUserId: EXPECTED_USER_ID,
          expectedOrganizationId: EXPECTED_ORG_ID,
          expectedRoleId: EXPECTED_ROLE_ID,
        },
      ),
      true,
    );
  });
});
