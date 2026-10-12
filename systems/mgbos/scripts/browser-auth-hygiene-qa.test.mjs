import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  CANONICAL_API_ORIGIN,
  CANONICAL_APP_ORIGIN,
  EXPECTED_POSITIVE_CASE_IDS,
  QaError,
  assertSanitizedEvidence,
  cleanup,
  localStatus,
  runBrowser,
  runQaHarness,
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
});
