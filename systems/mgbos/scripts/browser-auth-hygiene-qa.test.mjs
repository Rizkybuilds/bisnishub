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
import { inspect } from 'node:util';
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
  runFixtureInvocation,
  runQaHarness,
  startBrowser,
  terminateSubprocess,
  validateTraceReport,
  verifyTraceFile,
  withFixtureInvocation,
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

export async function dispatchAndAwaitSignalAck(
  activeChild,
  signal = 'SIGTERM',
  { timeoutMs = 2000 } = {},
) {
  if (
    !activeChild ||
    typeof activeChild.on !== 'function' ||
    (process.platform !== 'win32' && typeof activeChild.kill !== 'function') ||
    (process.platform === 'win32' && typeof activeChild.send !== 'function')
  ) {
    const err = new Error('SIGNAL_DISPATCH_FAILED: invalid child process');
    err.code = 'SIGNAL_DISPATCH_FAILED';
    throw err;
  }

  if (activeChild.exitCode !== null && activeChild.exitCode !== undefined) {
    const err = new Error(
      `SIGNAL_DISPATCH_FAILED: child process already exited with code ${activeChild.exitCode}`,
    );
    err.code = 'SIGNAL_DISPATCH_FAILED';
    throw err;
  }
  if (activeChild.signalCode !== null && activeChild.signalCode !== undefined) {
    const err = new Error(
      `SIGNAL_DISPATCH_FAILED: child process already terminated with signal ${activeChild.signalCode}`,
    );
    err.code = 'SIGNAL_DISPATCH_FAILED';
    throw err;
  }

  return new Promise((resolve, reject) => {
    let settled = false;
    let timer = null;
    const startTime = Date.now();

    const cleanup = () => {
      if (settled) return;
      settled = true;
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      if (typeof activeChild.off === 'function') {
        activeChild.off('message', onMsg);
        activeChild.off('exit', onExit);
        activeChild.off('error', onError);
      } else if (typeof activeChild.removeListener === 'function') {
        activeChild.removeListener('message', onMsg);
        activeChild.removeListener('exit', onExit);
        activeChild.removeListener('error', onError);
      }
    };

    const onMsg = (msg) => {
      if (!msg || typeof msg !== 'object') {
        return;
      }
      if (msg.type === 'QA_SIGNAL_RECEIVED') {
        if (msg.signal === signal) {
          cleanup();
          resolve({
            signal,
            acknowledged: true,
            latencyMs: Date.now() - startTime,
          });
        } else {
          cleanup();
          const err = new Error(
            `SIGNAL_ACK_MISMATCH: Expected signal ${signal} but received ACK for ${msg.signal}`,
          );
          err.code = 'SIGNAL_ACK_MISMATCH';
          err.expectedSignal = signal;
          err.receivedSignal = msg.signal;
          reject(err);
        }
      }
    };

    const onExit = (code, exitSignal) => {
      cleanup();
      const err = new Error(
        `SIGNAL_ACK_MISSING: Child process exited (code: ${code}, signal: ${exitSignal}) before sending signal ACK for ${signal}`,
      );
      err.code = 'SIGNAL_ACK_MISSING';
      err.exitCode = code;
      err.exitSignal = exitSignal;
      reject(err);
    };

    const onError = (childErr) => {
      cleanup();
      const err = new Error(
        `SIGNAL_DISPATCH_FAILED: Child process emitted error: ${childErr?.message ?? childErr}`,
      );
      err.code = 'SIGNAL_DISPATCH_FAILED';
      err.cause = childErr;
      reject(err);
    };

    activeChild.on('message', onMsg);
    activeChild.on('exit', onExit);
    activeChild.on('error', onError);

    timer = setTimeout(() => {
      cleanup();
      const err = new Error(
        `SIGNAL_ACK_TIMEOUT: Signal acknowledgment not received within ${timeoutMs}ms for ${signal}`,
      );
      err.code = 'SIGNAL_ACK_TIMEOUT';
      err.timeoutMs = timeoutMs;
      reject(err);
    }, timeoutMs);

    if (process.platform !== 'win32') {
      try {
        const success = activeChild.kill(signal);
        if (!success) {
          cleanup();
          const err = new Error(
            `SIGNAL_DISPATCH_FAILED: kill(${signal}) returned false`,
          );
          err.code = 'SIGNAL_DISPATCH_FAILED';
          return reject(err);
        }
      } catch (dispatchErr) {
        cleanup();
        const err = new Error(
          `SIGNAL_DISPATCH_FAILED: kill(${signal}) threw: ${dispatchErr.message}`,
        );
        err.code = 'SIGNAL_DISPATCH_FAILED';
        err.cause = dispatchErr;
        return reject(err);
      }
    } else {
      if (!activeChild.connected) {
        cleanup();
        const err = new Error(
          `SIGNAL_DISPATCH_FAILED: Child process IPC is not connected for signal ${signal}`,
        );
        err.code = 'SIGNAL_DISPATCH_FAILED';
        return reject(err);
      }
      try {
        const sent = activeChild.send({
          type: 'QA_TEST_SIGNAL',
          signal,
        });
        if (sent === false) {
          cleanup();
          const err = new Error(
            `SIGNAL_DISPATCH_FAILED: IPC send returned false for signal ${signal}`,
          );
          err.code = 'SIGNAL_DISPATCH_FAILED';
          return reject(err);
        }
      } catch (dispatchErr) {
        cleanup();
        const err = new Error(
          `SIGNAL_DISPATCH_FAILED: IPC send threw for signal ${signal}: ${dispatchErr.message}`,
        );
        err.code = 'SIGNAL_DISPATCH_FAILED';
        err.cause = dispatchErr;
        return reject(err);
      }
    }
  });
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
    await withFixtureInvocation(async () => {
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
    });

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
                await dispatchAndAwaitSignalAck(activeChild, 'SIGTERM', {
                  timeoutMs: 2000,
                });
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

  it('QA64-IPC-ACK-01: rejects missing, delayed, wrong, and failed signal dispatch acknowledgments deterministically', async () => {
    function safelyTerminateChild(child) {
      if (!child || child.exitCode !== null || child.signalCode !== null) {
        return Promise.resolve();
      }
      return new Promise((resolve) => {
        if (child.exitCode !== null || child.signalCode !== null) {
          return resolve();
        }
        const onDone = () => {
          child.removeListener('exit', onDone);
          child.removeListener('close', onDone);
          resolve();
        };
        child.once('exit', onDone);
        child.once('close', onDone);
        try {
          child.kill('SIGKILL');
        } catch {
          resolve();
        }
      });
    }

    function spawnReadyChild(code) {
      const wrappedCode = `
        ${code}
        if (typeof process.send === 'function') {
          try { process.send({ type: 'CHILD_READY' }); } catch {}
        }
      `;
      const child = spawn(process.execPath, ['-e', wrappedCode], {
        stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
      });
      const readyPromise = new Promise((resolve, reject) => {
        const onMsg = (msg) => {
          if (msg?.type === 'CHILD_READY') {
            child.off('message', onMsg);
            child.off('exit', onExit);
            resolve(child);
          }
        };
        const onExit = (exitCode, sig) => {
          child.off('message', onMsg);
          reject(
            new Error(
              `Child process exited prematurely (code: ${exitCode}, signal: ${sig}) before READY handshake`,
            ),
          );
        };
        child.on('message', onMsg);
        child.once('exit', onExit);
      });
      return { child, readyPromise };
    }

    // 1. A child that never ACKs fails synchronization with SIGNAL_ACK_TIMEOUT
    await (async () => {
      const { child, readyPromise } = spawnReadyChild(`
        process.on('SIGTERM', () => {});
        process.on('message', () => {});
        setInterval(() => {}, 1000);
      `);
      await readyPromise;
      try {
        await assert.rejects(
          dispatchAndAwaitSignalAck(child, 'SIGTERM', { timeoutMs: 100 }),
          (err) => {
            assert.equal(err.code, 'SIGNAL_ACK_TIMEOUT');
            assert.equal(err.timeoutMs, 100);
            assert.match(err.message, /SIGNAL_ACK_TIMEOUT/);
            return true;
          },
        );
      } finally {
        await safelyTerminateChild(child);
      }
    })();

    // 2. An ACK arriving after timeout fails synchronization (late ACK does not resolve or cause unhandled rejections)
    await (async () => {
      const { child, readyPromise } = spawnReadyChild(`
        const sendLate = (sig) => {
          setTimeout(() => {
            if (typeof process.send === 'function') {
              try {
                process.send({ type: 'QA_SIGNAL_RECEIVED', signal: sig });
              } catch {}
            }
          }, 200);
        };
        process.on('SIGTERM', () => sendLate('SIGTERM'));
        process.on('message', (msg) => {
          if (msg?.type === 'QA_TEST_SIGNAL') {
            sendLate(msg.signal);
          }
        });
        setInterval(() => {}, 1000);
      `);
      await readyPromise;
      try {
        const syncPromise = dispatchAndAwaitSignalAck(child, 'SIGTERM', {
          timeoutMs: 60,
        });
        await assert.rejects(syncPromise, (err) => {
          assert.equal(err.code, 'SIGNAL_ACK_TIMEOUT');
          assert.equal(err.timeoutMs, 60);
          return true;
        });
        // Wait for late ACK to arrive from child; verify no unhandled rejection occurs
        await new Promise((resolve) => setTimeout(resolve, 300));
      } finally {
        await safelyTerminateChild(child);
      }
    })();

    // 3. An ACK with the wrong signal payload fails synchronization with SIGNAL_ACK_MISMATCH
    await (async () => {
      const { child, readyPromise } = spawnReadyChild(`
        const sendWrong = () => {
          if (typeof process.send === 'function') {
            try {
              process.send({ type: 'QA_SIGNAL_RECEIVED', signal: 'SIGINT' });
            } catch {}
          }
        };
        process.on('SIGTERM', sendWrong);
        process.on('message', (msg) => {
          if (msg?.type === 'QA_TEST_SIGNAL') {
            sendWrong();
          }
        });
        setInterval(() => {}, 1000);
      `);
      await readyPromise;
      try {
        await assert.rejects(
          dispatchAndAwaitSignalAck(child, 'SIGTERM', { timeoutMs: 2000 }),
          (err) => {
            assert.equal(err.code, 'SIGNAL_ACK_MISMATCH');
            assert.equal(err.expectedSignal, 'SIGTERM');
            assert.equal(err.receivedSignal, 'SIGINT');
            assert.match(err.message, /SIGNAL_ACK_MISMATCH/);
            return true;
          },
        );
      } finally {
        await safelyTerminateChild(child);
      }
    })();

    // 4. A dead or unreachable child fails signal dispatch immediately with SIGNAL_DISPATCH_FAILED
    await (async () => {
      // 4a. Child process already terminated before dispatch
      const deadChild = spawn(process.execPath, ['-e', 'process.exit(0)'], {
        stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
      });
      await safelyTerminateChild(deadChild);
      await assert.rejects(
        dispatchAndAwaitSignalAck(deadChild, 'SIGTERM', { timeoutMs: 2000 }),
        (err) => {
          assert.equal(err.code, 'SIGNAL_DISPATCH_FAILED');
          assert.match(err.message, /SIGNAL_DISPATCH_FAILED/);
          return true;
        },
      );

      // 4b. Missing/invalid child object
      await assert.rejects(
        dispatchAndAwaitSignalAck(null, 'SIGTERM'),
        (err) => {
          assert.equal(err.code, 'SIGNAL_DISPATCH_FAILED');
          return true;
        },
      );

      // 4c. Child process terminates before sending signal ACK
      const { child: exitingChild, readyPromise } = spawnReadyChild(`
        process.on('SIGTERM', () => { process.exit(42); });
        process.on('message', (msg) => {
          if (msg?.type === 'QA_TEST_SIGNAL') {
            process.exit(42);
          }
        });
        setInterval(() => {}, 1000);
      `);
      await readyPromise;
      try {
        await assert.rejects(
          dispatchAndAwaitSignalAck(exitingChild, 'SIGTERM', {
            timeoutMs: 2000,
          }),
          (err) => {
            assert.equal(err.code, 'SIGNAL_ACK_MISSING');
            assert.equal(err.exitCode, 42);
            assert.match(err.message, /SIGNAL_ACK_MISSING/);
            return true;
          },
        );
      } finally {
        await safelyTerminateChild(exitingChild);
      }
    })();

    // 5. Positive case: A healthy child sending matching ACK completes successfully
    await (async () => {
      const { child, readyPromise } = spawnReadyChild(`
        const sendAck = (sig) => {
          if (typeof process.send === 'function') {
            try {
              process.send({ type: 'QA_SIGNAL_RECEIVED', signal: sig });
            } catch {}
          }
        };
        process.on('SIGTERM', () => sendAck('SIGTERM'));
        process.on('message', (msg) => {
          if (msg?.type === 'QA_TEST_SIGNAL') {
            sendAck(msg.signal);
          }
        });
        setInterval(() => {}, 1000);
      `);
      await readyPromise;
      try {
        const result = await dispatchAndAwaitSignalAck(child, 'SIGTERM', {
          timeoutMs: 2000,
        });
        assert.equal(result.acknowledged, true);
        assert.equal(result.signal, 'SIGTERM');
        assert.equal(typeof result.latencyMs, 'number');
      } finally {
        await safelyTerminateChild(child);
      }
    })();
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

        if (method === 'DELETE') {
          deleteCalls.push(`${pathname}${parsed.search}`);
        }

        if (method === 'GET' && pathname === '/rest/v1/organizations') {
          return jsonResponse(200, [{ id: SEED_ORG_ID }]);
        }
        if (method === 'GET' && pathname === '/rest/v1/roles') {
          return jsonResponse(200, [{ id: SEED_ROLE_ID }]);
        }

        if (method === 'POST' && pathname === '/auth/v1/admin/users') {
          const body = JSON.parse(options.body);
          authSeq += 1;
          const id =
            authSeq === 1
              ? SYNTH_AUTH_ID
              : `00000000-0000-4000-8000-00000000011${authSeq}`;
          const user = { id, email: body.email };
          authUsers.set(id, user);
          return jsonResponse(200, user);
        }

        if (method === 'POST' && pathname === '/rest/v1/users') {
          const body = JSON.parse(options.body);
          profileSeq += 1;
          const id =
            profileSeq === 1
              ? SYNTH_PROFILE_ID
              : `00000000-0000-4000-8000-00000000022${profileSeq}`;
          const row = {
            id,
            auth_user_id: body.auth_user_id,
            email: body.email,
            name: body.name,
            status: body.status,
          };
          appUsers.set(id, row);
          return jsonResponse(201, [row]);
        }

        if (method === 'POST' && pathname === '/rest/v1/organization_members') {
          const body = JSON.parse(options.body);
          const row = {
            organization_id: body.organization_id,
            user_id: body.user_id,
            role_id: body.role_id,
            status: body.status,
          };
          orgMembers.push(row);
          return jsonResponse(201, [row]);
        }

        if (method === 'GET' && pathname === '/auth/v1/admin/users') {
          if (overrideAuthList) {
            return jsonResponse(200, overrideAuthList(authUsers, parsed));
          }
          const page = Number.parseInt(
            parsed.searchParams.get('page') ?? '1',
            10,
          );
          const perPage = Number.parseInt(
            parsed.searchParams.get('per_page') ?? '1000',
            10,
          );
          const all = Array.from(authUsers.values());
          const start = (page - 1) * perPage;
          return jsonResponse(200, {
            users: all.slice(start, start + perPage),
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
      'ci-auth-not-a-uuid@example.test',
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

    // 3. Owned current-run fixture whose server-side profile links to an unrelated auth_user_id.
    await assert.rejects(
      () =>
        withFixtureInvocation(async () => {
          const store = createOwnershipTestStore();
          const fixture = await createFixture('synthetic_service_key', {
            fetchFn: store.fetchFn,
            deferCleanup: true,
          });
          // Corrupt server-side profile linkage to point to unrelated auth user.
          store.appUsers.set(SYNTH_PROFILE_ID, {
            ...store.appUsers.get(SYNTH_PROFILE_ID),
            auth_user_id: UNRELATED_AUTH_ID,
          });
          await assert.rejects(
            () =>
              cleanup('synthetic_service_key', fixture, {
                fetchFn: store.fetchFn,
              }),
            (err) =>
              err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
          );
          // Profile with wrong auth_user_id must NOT be deleted; verified synthetic auth user IS cleaned up.
          assert.equal(store.appUsers.has(SYNTH_PROFILE_ID), true);
          assert.equal(store.authUsers.has(SYNTH_AUTH_ID), false);
          assertUnrelatedPreserved(store, 'mismatched auth_user_id');
        }),
      (err) => err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
    );

    // 4. Owned current-run fixture whose membership points to another organization, role, or non-ACTIVE status is never deleted and fails closed.
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
      await assert.rejects(
        () =>
          withFixtureInvocation(async () => {
            const store = createOwnershipTestStore();
            const fixture = await createFixture('synthetic_service_key', {
              fetchFn: store.fetchFn,
              deferCleanup: true,
            });
            // Corrupt the synthetic membership row in the store.
            const memberIdx = store.orgMembers.findIndex(
              (m) => m.user_id === SYNTH_PROFILE_ID,
            );
            store.orgMembers[memberIdx] = {
              user_id: SYNTH_PROFILE_ID,
              organization_id: badMember.organization_id,
              role_id: badMember.role_id,
              status: badMember.status,
            };
            await assert.rejects(
              () =>
                cleanup('synthetic_service_key', fixture, {
                  fetchFn: store.fetchFn,
                }),
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
            assert.equal(
              store.authUsers.has(SYNTH_AUTH_ID),
              false,
              badMember.label,
            );
            assertUnrelatedPreserved(store, badMember.label);
          }),
        (err) =>
          err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
        badMember.label,
      );
    }

    // 5. Duplicate identity matches (duplicate auth users, duplicate profiles, duplicate memberships) and contradictory auth responses on an owned current-run fixture.
    await assert.rejects(
      () =>
        withFixtureInvocation(async () => {
          const dupAuthStore = createOwnershipTestStore();
          const dupAuthFixture = await createFixture('synthetic_service_key', {
            fetchFn: dupAuthStore.fetchFn,
            deferCleanup: true,
          });
          dupAuthStore.orgMembers.pop();
          dupAuthStore.appUsers.delete(SYNTH_PROFILE_ID);
          dupAuthFixture.profile = null;
          dupAuthFixture.membershipCreated = false;
          dupAuthStore.authUsers.set('00000000-0000-4000-8000-000000000112', {
            id: '00000000-0000-4000-8000-000000000112',
            email: dupAuthFixture.email,
          });
          await assert.rejects(
            () =>
              cleanup('synthetic_service_key', dupAuthFixture, {
                fetchFn: dupAuthStore.fetchFn,
              }),
            (err) =>
              err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
          );
          assert.deepEqual(dupAuthStore.deleteCalls, []);
          assertUnrelatedPreserved(dupAuthStore, 'duplicate auth users');

          let injectContradictoryGet = false;
          const contradictoryAuthStore = createOwnershipTestStore({
            overrideAuthGetById: (id, authUsers) =>
              injectContradictoryGet && id === SYNTH_AUTH_ID
                ? {
                    status: 200,
                    body: {
                      id: '00000000-0000-4000-8000-000000000119',
                      email: authUsers.get(SYNTH_AUTH_ID)?.email,
                    },
                  }
                : null,
          });
          const contradictoryFixture = await createFixture(
            'synthetic_service_key',
            {
              fetchFn: contradictoryAuthStore.fetchFn,
              deferCleanup: true,
            },
          );
          contradictoryAuthStore.orgMembers.pop();
          contradictoryAuthStore.appUsers.delete(SYNTH_PROFILE_ID);
          contradictoryFixture.profile = null;
          contradictoryFixture.membershipCreated = false;
          injectContradictoryGet = true;
          await assert.rejects(
            () =>
              cleanup('synthetic_service_key', contradictoryFixture, {
                fetchFn: contradictoryAuthStore.fetchFn,
              }),
            (err) =>
              err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
          );
          assert.deepEqual(contradictoryAuthStore.deleteCalls, []);

          const dupProfileStore = createOwnershipTestStore();
          const dupProfileFixture = await createFixture(
            'synthetic_service_key',
            {
              fetchFn: dupProfileStore.fetchFn,
              deferCleanup: true,
            },
          );
          dupProfileStore.orgMembers.pop();
          dupProfileFixture.membershipCreated = false;
          dupProfileStore.appUsers.set('00000000-0000-4000-8000-000000000223', {
            id: '00000000-0000-4000-8000-000000000223',
            auth_user_id: SYNTH_AUTH_ID,
            email: dupProfileFixture.email,
          });
          await assert.rejects(
            () =>
              cleanup('synthetic_service_key', dupProfileFixture, {
                fetchFn: dupProfileStore.fetchFn,
              }),
            (err) =>
              err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
          );
          // Duplicate profiles are not deleted; verified single synthetic auth user is cleaned up.
          assert.equal(dupProfileStore.appUsers.size, 3);
          assert.equal(dupProfileStore.authUsers.has(SYNTH_AUTH_ID), false);
          assertUnrelatedPreserved(dupProfileStore, 'duplicate profiles');

          const dupMembershipStore = createOwnershipTestStore();
          const dupMembershipFixture = await createFixture(
            'synthetic_service_key',
            {
              fetchFn: dupMembershipStore.fetchFn,
              deferCleanup: true,
            },
          );
          dupMembershipStore.orgMembers.push({
            user_id: SYNTH_PROFILE_ID,
            organization_id: SEED_ORG_ID,
            role_id: OTHER_ROLE_ID,
            status: 'ACTIVE',
          });
          await assert.rejects(
            () =>
              cleanup('synthetic_service_key', dupMembershipFixture, {
                fetchFn: dupMembershipStore.fetchFn,
              }),
            (err) =>
              err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
          );
          assert.equal(dupMembershipStore.orgMembers.length, 3);
          assertUnrelatedPreserved(dupMembershipStore, 'duplicate memberships');
        }),
      (err) => err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
    );

    // 6. Missing identity fields on server responses fail closed without deleting.
    await assert.rejects(
      () =>
        withFixtureInvocation(async () => {
          const missingFieldsStore = createOwnershipTestStore();
          const missingFieldsFixture = await createFixture(
            'synthetic_service_key',
            {
              fetchFn: missingFieldsStore.fetchFn,
              deferCleanup: true,
            },
          );
          missingFieldsStore.appUsers.set(SYNTH_PROFILE_ID, {
            id: SYNTH_PROFILE_ID,
            auth_user_id: null,
            email: missingFieldsFixture.email,
          });
          await assert.rejects(
            () =>
              cleanup('synthetic_service_key', missingFieldsFixture, {
                fetchFn: missingFieldsStore.fetchFn,
              }),
            (err) =>
              err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
          );
          assert.equal(missingFieldsStore.appUsers.has(SYNTH_PROFILE_ID), true);
          assertUnrelatedPreserved(missingFieldsStore, 'missing auth_user_id');
        }),
      (err) => err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
    );

    // 7. Mixed valid and invalid fixture references on an owned current-run fixture:
    // after createFixture succeeds, caller corrupts fixture.auth/fixture.profile to point to unrelated user.
    // Unrelated records MUST remain untouched, verified current-run synthetic records ARE cleaned up (best-effort),
    // and cleanup() still fails closed with FIXTURE_CLEANUP_FAILED.
    await withTempDir(async (artifactDir) => {
      const mixedStore = createOwnershipTestStore();
      let provisionedEmail = null;

      const deps = defaultStubDependencies({
        createFixtureFn: async (key, options) => {
          const created = await createFixture(key, {
            ...options,
            fetchFn: mixedStore.fetchFn,
          });
          provisionedEmail = created.email;
          // Corrupt fixture IDs to point to the unrelated operator after provisioning.
          created.auth = UNRELATED_AUTH_ID;
          created.profile = UNRELATED_PROFILE_ID;
          return created;
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

      // Unrelated records were preserved; independently verified current-run synthetic records were cleaned up.
      assertUnrelatedPreserved(mixedStore, 'mixed valid/invalid references');
      assert.equal(mixedStore.authUsers.has(SYNTH_AUTH_ID), false);
      assert.equal(mixedStore.appUsers.has(SYNTH_PROFILE_ID), false);
      assert.equal(mixedStore.orgMembers.length, 1);

      // Every DELETE call used verified synthetic IDs and full tuple filters.
      assert.deepEqual(mixedStore.deleteCalls, [
        `/rest/v1/organization_members?user_id=eq.${SYNTH_PROFILE_ID}&organization_id=eq.${SEED_ORG_ID}&role_id=eq.${SEED_ROLE_ID}`,
        `/rest/v1/users?id=eq.${SYNTH_PROFILE_ID}&email=eq.${encodeURIComponent(provisionedEmail)}&auth_user_id=eq.${SYNTH_AUTH_ID}`,
        `/auth/v1/admin/users/${SYNTH_AUTH_ID}`,
      ]);

      const rawTrace = readFileSync(tracePath, 'utf8');
      assert.doesNotMatch(rawTrace, new RegExp(provisionedEmail));
      assert.doesNotMatch(rawTrace, new RegExp(UNRELATED_EMAIL));
    });
  });

  it('SEC64-01A: enforces non-forgeable current-run and standalone per-invocation ownership provenance across foreign runs, live cross-invocation references, email-only/full-ID foreign fixtures, reused/expired capabilities, caller-mutated emails, concurrent invocations, and partial-creation compensating cleanup', async () => {
    const UNRELATED_AUTH_ID = '00000000-0000-4000-8000-000000000999';
    const UNRELATED_PROFILE_ID = '00000000-0000-4000-8000-000000000888';
    const UNRELATED_EMAIL = 'unrelated-operator@example.test';
    const SEED_ORG_ID = '00000000-0000-4000-8000-000000000010';
    const SEED_ROLE_ID = '00000000-0000-4000-8000-000000000020';

    function createSharedMockDatabase({
      failStage = null,
      onOrganizationsGet = null,
      onRolesGet = null,
      onAuthPost = null,
      onProfilePost = null,
      onMembershipPost = null,
    } = {}) {
      const authUsers = new Map([
        [UNRELATED_AUTH_ID, { id: UNRELATED_AUTH_ID, email: UNRELATED_EMAIL }],
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
      ]);
      const orgMembers = [
        {
          organization_id: SEED_ORG_ID,
          user_id: UNRELATED_PROFILE_ID,
          role_id: SEED_ROLE_ID,
          status: 'ACTIVE',
        },
      ];
      const getCalls = [];
      const postCalls = [];
      const deleteCalls = [];
      let authCounter = 0;
      let profileCounter = 0;

      const jsonResponse = (status, payload) => ({
        ok: status >= 200 && status < 300,
        status,
        json: async () => payload,
      });

      const fetchFn = async (url, options = {}) => {
        const parsed = new URL(String(url));
        const method = options.method ?? 'GET';
        const pathname = parsed.pathname;

        if (method === 'GET') {
          getCalls.push(`${pathname}${parsed.search}`);
        } else if (method === 'POST') {
          postCalls.push(`${pathname}${parsed.search}`);
        } else if (method === 'DELETE') {
          deleteCalls.push(`${pathname}${parsed.search}`);
        }

        if (method === 'GET' && pathname === '/rest/v1/organizations') {
          if (onOrganizationsGet) {
            await onOrganizationsGet({ options });
          }
          return jsonResponse(200, [{ id: SEED_ORG_ID }]);
        }
        if (method === 'GET' && pathname === '/rest/v1/roles') {
          if (onRolesGet) {
            await onRolesGet({ options });
          }
          return jsonResponse(200, [{ id: SEED_ROLE_ID }]);
        }

        if (method === 'POST' && pathname === '/auth/v1/admin/users') {
          if (onAuthPost) {
            await onAuthPost({ options });
          }
          if (failStage === 'auth') {
            return jsonResponse(500, { error: 'simulated auth failure' });
          }
          const body = JSON.parse(options.body);
          authCounter += 1;
          const id = `00000000-0000-4000-8000-${String(1000 + authCounter).padStart(12, '0')}`;
          const user = { id, email: body.email };
          authUsers.set(id, user);
          return jsonResponse(200, user);
        }

        if (method === 'POST' && pathname === '/rest/v1/users') {
          if (onProfilePost) {
            await onProfilePost({ options });
          }
          if (failStage === 'profile') {
            return jsonResponse(500, { error: 'simulated profile failure' });
          }
          const body = JSON.parse(options.body);
          profileCounter += 1;
          const id = `00000000-0000-4000-8000-${String(2000 + profileCounter).padStart(12, '0')}`;
          const row = {
            id,
            auth_user_id: body.auth_user_id,
            email: body.email,
            name: body.name,
            status: body.status,
          };
          appUsers.set(id, row);
          return jsonResponse(201, [row]);
        }

        if (method === 'POST' && pathname === '/rest/v1/organization_members') {
          if (onMembershipPost) {
            await onMembershipPost({ options });
          }
          if (failStage === 'membership') {
            return jsonResponse(500, { error: 'simulated membership failure' });
          }
          const body = JSON.parse(options.body);
          const row = {
            organization_id: body.organization_id,
            user_id: body.user_id,
            role_id: body.role_id,
            status: body.status,
          };
          orgMembers.push(row);
          return jsonResponse(201, [row]);
        }

        if (method === 'GET' && pathname === '/auth/v1/admin/users') {
          const page = Number.parseInt(
            parsed.searchParams.get('page') ?? '1',
            10,
          );
          const perPage = Number.parseInt(
            parsed.searchParams.get('per_page') ?? '1000',
            10,
          );
          const all = Array.from(authUsers.values());
          const start = (page - 1) * perPage;
          return jsonResponse(200, {
            users: all.slice(start, start + perPage),
          });
        }

        if (pathname.startsWith('/auth/v1/admin/users/')) {
          const authId = decodeURIComponent(
            pathname.slice('/auth/v1/admin/users/'.length),
          );
          if (method === 'GET') {
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

      return {
        authUsers,
        appUsers,
        orgMembers,
        getCalls,
        postCalls,
        deleteCalls,
        fetchFn,
      };
    }

    // 1. Valid standalone owner cleans up its own completed fixture and leaves unrelated records untouched;
    // unscoped calls outside withFixtureInvocation / runQaHarness fail closed before any GET/POST/DELETE.
    {
      const dbStore = createSharedMockDatabase();

      // 1a. Unscoped createFixture outside withFixtureInvocation fails closed before any GET/POST:
      await assert.rejects(
        () =>
          createFixture('synthetic_service_key', {
            fetchFn: dbStore.fetchFn,
            deferCleanup: true,
          }),
        (err) =>
          err instanceof QaError && err.code === 'FIXTURE_CREATION_FAILED',
      );
      assert.deepEqual(dbStore.getCalls, []);
      assert.deepEqual(dbStore.postCalls, []);

      // 1b. Unscoped createFixtureState() + cleanup outside withFixtureInvocation fails closed before any GET/DELETE:
      const unscopedState = createFixtureState();
      await assert.rejects(
        () =>
          cleanup('synthetic_service_key', unscopedState, {
            fetchFn: dbStore.fetchFn,
          }),
        (err) =>
          err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
      );
      assert.deepEqual(dbStore.getCalls, []);
      assert.deepEqual(dbStore.deleteCalls, []);

      // 1c. Scoped standalone owner creates and cleans up its own fixture cleanly:
      await withFixtureInvocation(async () => {
        const ownFixture = await createFixture('synthetic_service_key', {
          fetchFn: dbStore.fetchFn,
          deferCleanup: true,
        });
        assert.equal(dbStore.authUsers.size, 2);
        assert.equal(dbStore.appUsers.size, 2);
        assert.equal(dbStore.orgMembers.length, 2);

        const res = await cleanup('synthetic_service_key', ownFixture, {
          fetchFn: dbStore.fetchFn,
        });
        assert.deepEqual(res, { attempted: true, status: 'PASS' });
        assert.equal(dbStore.authUsers.size, 1);
        assert.equal(dbStore.authUsers.has(UNRELATED_AUTH_ID), true);
        assert.equal(dbStore.appUsers.size, 1);
        assert.equal(dbStore.appUsers.has(UNRELATED_PROFILE_ID), true);
        assert.equal(dbStore.orgMembers.length, 1);
      });
    }

    // 2. Standalone cross-invocation isolation (Failure A):
    // Separate standalone caller (withFixtureInvocation A), unscoped caller, nested invocation, or runQaHarness
    // CANNOT clean up another active standalone invocation (withFixtureInvocation B) even when possessing B's
    // genuine live fixture reference and matching local service key.
    {
      const dbStore = createSharedMockDatabase();
      let foreignFixture = null;
      let foreignAuthId = null;
      let foreignProfileId = null;
      let foreignEmail = null;
      let notifyInvocationBReady;
      const invocationBReady = new Promise((resolve) => {
        notifyInvocationBReady = resolve;
      });
      let releaseInvocationB;
      const invocationBGate = new Promise((resolve) => {
        releaseInvocationB = resolve;
      });

      // Start Standalone Invocation B and keep it active while Foreign Callers probe it.
      const invocationBPromise = withFixtureInvocation(async () => {
        foreignFixture = await createFixture('synthetic_service_key', {
          fetchFn: dbStore.fetchFn,
          deferCleanup: true,
        });
        foreignAuthId = foreignFixture.auth;
        foreignProfileId = foreignFixture.profile;
        foreignEmail = foreignFixture.email;

        // 2a. Nested withFixtureInvocation inside B cannot clean up parent B's fixture:
        dbStore.getCalls.length = 0;
        dbStore.deleteCalls.length = 0;
        await withFixtureInvocation(async () => {
          await assert.rejects(
            () =>
              cleanup('synthetic_service_key', foreignFixture, {
                fetchFn: dbStore.fetchFn,
              }),
            (err) =>
              err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
          );
        });
        assert.deepEqual(dbStore.getCalls, []);
        assert.deepEqual(dbStore.deleteCalls, []);

        notifyInvocationBReady();
        await invocationBGate;

        // After all foreign attacks are rejected, B cleans up its own fixture and gets PASS!
        const foreignCleanRes = await cleanup(
          'synthetic_service_key',
          foreignFixture,
          {
            fetchFn: dbStore.fetchFn,
          },
        );
        assert.deepEqual(foreignCleanRes, { attempted: true, status: 'PASS' });
      });

      await invocationBReady;
      dbStore.getCalls.length = 0;
      dbStore.deleteCalls.length = 0;

      // 2b. Unscoped caller with B's genuine live fixture reference and service key:
      await assert.rejects(
        () =>
          cleanup('synthetic_service_key', foreignFixture, {
            fetchFn: dbStore.fetchFn,
          }),
        (err) =>
          err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
      );
      assert.deepEqual(dbStore.getCalls, []);
      assert.deepEqual(dbStore.deleteCalls, []);

      // 2c. Separate standalone Invocation A with B's genuine live fixture reference, email-only, or full-ID clone:
      await withFixtureInvocation(async () => {
        for (const candidate of [
          foreignFixture,
          { email: foreignEmail },
          {
            email: foreignEmail,
            mutationStarted: true,
            mutationOutcomeAmbiguous: true,
          },
          {
            email: foreignEmail,
            password: foreignFixture.password,
            auth: foreignAuthId,
            profile: foreignProfileId,
            organizationId: SEED_ORG_ID,
            roleId: SEED_ROLE_ID,
            membershipCreated: true,
          },
        ]) {
          await assert.rejects(
            () =>
              cleanup('synthetic_service_key', candidate, {
                fetchFn: dbStore.fetchFn,
              }),
            (err) =>
              err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
          );
          assert.deepEqual(dbStore.getCalls, []);
          assert.deepEqual(dbStore.deleteCalls, []);
        }
      });

      // 2d. Another runQaHarness invocation attempting to clean up either a foreign email-only object,
      // a foreign full-ID plain object, or the live foreignFixture reference itself while B is active:
      for (const foreignCandidate of [
        { label: 'email-only foreign object', value: { email: foreignEmail } },
        {
          label: 'full-ID cloned foreign object',
          value: {
            email: foreignEmail,
            auth: foreignAuthId,
            profile: foreignProfileId,
            organizationId: SEED_ORG_ID,
            roleId: SEED_ROLE_ID,
            membershipCreated: true,
          },
        },
        {
          label:
            'actual foreignFixture object from another active standalone run',
          value: foreignFixture,
        },
      ]) {
        await withTempDir(async (artifactDir) => {
          dbStore.getCalls.length = 0;
          dbStore.deleteCalls.length = 0;
          const deps = defaultStubDependencies({
            localStatusFn: async () => ({
              API_URL: CANONICAL_API_ORIGIN,
              ANON_KEY: 'synthetic_anon_key_value_for_unit_test_only',
              SERVICE_ROLE_KEY: 'synthetic_service_key',
            }),
            createFixtureFn: async () => foreignCandidate.value,
            cleanupFn: (key, fixture, options) =>
              cleanup(key, fixture, { ...options, fetchFn: dbStore.fetchFn }),
          });
          const { evidence, failure } = await runQaHarness({
            ...deps,
            artifactDir,
            negativeControl: false,
          });
          assert.equal(failure, true, foreignCandidate.label);
          assert.equal(evidence.overall, 'FAIL', foreignCandidate.label);
          assert.equal(evidence.cleanup.status, 'FAIL', foreignCandidate.label);
          assert.equal(
            evidence.failure?.code,
            'FIXTURE_CLEANUP_FAILED',
            foreignCandidate.label,
          );
          assert.deepEqual(dbStore.getCalls, [], foreignCandidate.label);
          assert.deepEqual(dbStore.deleteCalls, [], foreignCandidate.label);
          assert.equal(
            dbStore.authUsers.has(foreignAuthId),
            true,
            foreignCandidate.label,
          );
          assert.equal(
            dbStore.appUsers.has(foreignProfileId),
            true,
            foreignCandidate.label,
          );
        });
      }

      // Release Invocation B so it cleans up its own fixture and completes.
      releaseInvocationB();
      await invocationBPromise;
      assert.equal(dbStore.authUsers.has(foreignAuthId), false);
      assert.equal(dbStore.appUsers.has(foreignProfileId), false);
    }

    // 3. Reused, expired, or mismatched-key/origin fixture capability is rejected before any GET/DELETE.
    {
      const dbStore = createSharedMockDatabase();

      await withFixtureInvocation(async () => {
        const fixture = await createFixture('synthetic_service_key', {
          fetchFn: dbStore.fetchFn,
          deferCleanup: true,
        });

        // 3a. Mismatched service key or api origin rejected before any GET/DELETE without burning the capability:
        dbStore.getCalls.length = 0;
        dbStore.deleteCalls.length = 0;
        await assert.rejects(
          () =>
            cleanup('wrong_service_key', fixture, {
              fetchFn: dbStore.fetchFn,
            }),
          (err) =>
            err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
        );
        await assert.rejects(
          () =>
            cleanup('synthetic_service_key', fixture, {
              api: 'http://127.0.0.1:59999',
              fetchFn: dbStore.fetchFn,
            }),
          (err) =>
            err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
        );
        assert.deepEqual(dbStore.getCalls, []);
        assert.deepEqual(dbStore.deleteCalls, []);

        // 3b. Valid cleanup consumes the capability:
        const firstClean = await cleanup('synthetic_service_key', fixture, {
          fetchFn: dbStore.fetchFn,
        });
        assert.deepEqual(firstClean, { attempted: true, status: 'PASS' });
        dbStore.getCalls.length = 0;
        dbStore.deleteCalls.length = 0;

        // 3c. Re-insert matching records and attempt to reuse the consumed fixture capability inside the same invocation:
        dbStore.authUsers.set(fixture.auth, {
          id: fixture.auth,
          email: fixture.email,
        });
        await assert.rejects(
          () =>
            cleanup('synthetic_service_key', fixture, {
              fetchFn: dbStore.fetchFn,
            }),
          (err) =>
            err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
        );
        assert.deepEqual(dbStore.getCalls, []);
        assert.deepEqual(dbStore.deleteCalls, []);
        assert.equal(dbStore.authUsers.has(fixture.auth), true);
        dbStore.authUsers.delete(fixture.auth);
      });

      // 3d. Standalone capability is automatically cleaned up AND invalidated when withFixtureInvocation exits even if not explicitly cleaned up:
      let uncleanedEscapedFixture = null;
      await withFixtureInvocation(async () => {
        uncleanedEscapedFixture = await createFixture('synthetic_service_key', {
          fetchFn: dbStore.fetchFn,
          deferCleanup: true,
        });
      });
      // Scope exit automatically cleaned up all created synthetic records!
      assert.equal(dbStore.authUsers.has(uncleanedEscapedFixture.auth), false);
      assert.equal(
        dbStore.appUsers.has(uncleanedEscapedFixture.profile),
        false,
      );
      assert.equal(
        dbStore.orgMembers.some(
          (m) => m.user_id === uncleanedEscapedFixture.profile,
        ),
        false,
      );
      // Even if a record with that ID is re-inserted, post-scope cleanup is rejected before any GET/DELETE!
      dbStore.authUsers.set(uncleanedEscapedFixture.auth, {
        id: uncleanedEscapedFixture.auth,
        email: uncleanedEscapedFixture.email,
      });
      dbStore.getCalls.length = 0;
      dbStore.deleteCalls.length = 0;
      await withFixtureInvocation(async () => {
        await assert.rejects(
          () =>
            cleanup('synthetic_service_key', uncleanedEscapedFixture, {
              fetchFn: dbStore.fetchFn,
            }),
          (err) =>
            err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
        );
      });
      assert.deepEqual(dbStore.getCalls, []);
      assert.deepEqual(dbStore.deleteCalls, []);
      assert.equal(dbStore.authUsers.has(uncleanedEscapedFixture.auth), true);
      dbStore.authUsers.delete(uncleanedEscapedFixture.auth);

      // 3e. Also verify capability from a completed runQaHarness is invalidated after the run completes:
      let capturedHarnessFixture = null;
      await withTempDir(async (artifactDir) => {
        const deps = defaultStubDependencies({
          localStatusFn: async () => ({
            API_URL: CANONICAL_API_ORIGIN,
            ANON_KEY: 'synthetic_anon_key_value_for_unit_test_only',
            SERVICE_ROLE_KEY: 'synthetic_service_key',
          }),
          createFixtureFn: async (key, options) => {
            capturedHarnessFixture = options.fixture;
            return createFixture(key, {
              ...options,
              fetchFn: dbStore.fetchFn,
            });
          },
          cleanupFn: (key, fix, options) =>
            cleanup(key, fix, { ...options, fetchFn: dbStore.fetchFn }),
        });
        const { evidence, failure } = await runQaHarness({
          ...deps,
          artifactDir,
          negativeControl: false,
        });
        assert.equal(failure, false);
        assert.equal(evidence.cleanup.status, 'PASS');
      });

      dbStore.getCalls.length = 0;
      dbStore.deleteCalls.length = 0;
      await withFixtureInvocation(async () => {
        await assert.rejects(
          () =>
            cleanup('synthetic_service_key', capturedHarnessFixture, {
              fetchFn: dbStore.fetchFn,
            }),
          (err) =>
            err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
        );
      });
      assert.deepEqual(dbStore.getCalls, []);
      assert.deepEqual(dbStore.deleteCalls, []);
    }

    // 4. Caller-mutated fixture identity cannot redirect cleanup to another synthetic user.
    {
      const dbStore = createSharedMockDatabase();
      let victimFixture = null;
      let releaseVictim;
      const victimGate = new Promise((resolve) => {
        releaseVictim = resolve;
      });
      let notifyVictimCreated;
      const victimCreated = new Promise((resolve) => {
        notifyVictimCreated = resolve;
      });

      const victimPromise = withFixtureInvocation(async () => {
        victimFixture = await createFixture('synthetic_service_key', {
          fetchFn: dbStore.fetchFn,
          deferCleanup: true,
        });
        notifyVictimCreated();
        await victimGate;
        const victimClean = await cleanup(
          'synthetic_service_key',
          victimFixture,
          {
            fetchFn: dbStore.fetchFn,
          },
        );
        assert.deepEqual(victimClean, { attempted: true, status: 'PASS' });
      });

      await victimCreated;

      let ownOriginalEmail = null;
      let ownAuthId = null;
      let ownProfileId = null;

      await withTempDir(async (artifactDir) => {
        const deps = defaultStubDependencies({
          localStatusFn: async () => ({
            API_URL: CANONICAL_API_ORIGIN,
            ANON_KEY: 'synthetic_anon_key_value_for_unit_test_only',
            SERVICE_ROLE_KEY: 'synthetic_service_key',
          }),
          createFixtureFn: async (key, options) => {
            const created = await createFixture(key, {
              ...options,
              fetchFn: dbStore.fetchFn,
            });
            ownOriginalEmail = created.email;
            ownAuthId = created.auth;
            ownProfileId = created.profile;
            return created;
          },
          runBrowserFn: async (_cdp, fix, { cases }) => {
            // Mutate current-run fixture to point to victimFixture's synthetic email and IDs!
            fix.email = victimFixture.email;
            fix.auth = victimFixture.auth;
            fix.profile = victimFixture.profile;
            for (const caseId of EXPECTED_POSITIVE_CASE_IDS) {
              cases.push({
                caseId,
                verdict: 'PASS',
                timestamp: new Date().toISOString(),
                proof: {},
              });
            }
          },
          cleanupFn: (key, fix, options) =>
            cleanup(key, fix, { ...options, fetchFn: dbStore.fetchFn }),
        });

        const { evidence, failure, tracePath } = await runQaHarness({
          ...deps,
          artifactDir,
          negativeControl: false,
        });

        assert.equal(failure, true);
        assert.equal(evidence.overall, 'FAIL');
        assert.equal(evidence.cleanup.status, 'FAIL');
        assert.equal(evidence.failure?.code, 'FIXTURE_CLEANUP_FAILED');

        // Victim synthetic fixture resources MUST remain completely untouched!
        assert.equal(dbStore.authUsers.has(victimFixture.auth), true);
        assert.equal(dbStore.appUsers.has(victimFixture.profile), true);
        assert.equal(
          dbStore.orgMembers.some((m) => m.user_id === victimFixture.profile),
          true,
        );

        // Current run's own resources were cleaned up via immutable capability.originalEmail!
        assert.equal(dbStore.authUsers.has(ownAuthId), false);
        assert.equal(dbStore.appUsers.has(ownProfileId), false);
        assert.equal(
          dbStore.orgMembers.some((m) => m.user_id === ownProfileId),
          false,
        );

        // Neither originalEmail nor victimFixture.email leaked into trace.json.
        const rawTrace = readFileSync(tracePath, 'utf8');
        assert.doesNotMatch(rawTrace, new RegExp(ownOriginalEmail));
        assert.doesNotMatch(rawTrace, new RegExp(victimFixture.email));
      });

      // Victim run can still clean up its own fixture cleanly.
      releaseVictim();
      await victimPromise;
    }

    // 5a. Two concurrent standalone invocations (withFixtureInvocation) cannot delete each other's resources.
    {
      const dbStore = createSharedMockDatabase();
      let standalone1Fixture = null;
      let standalone2Fixture = null;
      let notifyBothCreated;
      let createdCount = 0;
      const bothCreated = new Promise((resolve) => {
        notifyBothCreated = () => {
          createdCount += 1;
          if (createdCount === 2) resolve();
        };
      });
      let releaseStandalone2;
      const standalone2Gate = new Promise((resolve) => {
        releaseStandalone2 = resolve;
      });

      const [resA, resB] = await Promise.all([
        withFixtureInvocation(async () => {
          standalone1Fixture = await createFixture('synthetic_service_key', {
            fetchFn: dbStore.fetchFn,
            deferCleanup: true,
          });
          notifyBothCreated();
          await bothCreated;

          // Standalone 1 attempts to clean up Standalone 2's live fixture -> rejected before any GET/DELETE!
          const deletesBefore = dbStore.deleteCalls.length;
          await assert.rejects(
            () =>
              cleanup('synthetic_service_key', standalone2Fixture, {
                fetchFn: dbStore.fetchFn,
              }),
            (err) =>
              err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
          );
          assert.equal(dbStore.deleteCalls.length, deletesBefore);

          // Standalone 1 cleans up its own fixture:
          const ownRes = await cleanup(
            'synthetic_service_key',
            standalone1Fixture,
            {
              fetchFn: dbStore.fetchFn,
            },
          );
          releaseStandalone2();
          return ownRes;
        }),
        withFixtureInvocation(async () => {
          standalone2Fixture = await createFixture('synthetic_service_key', {
            fetchFn: dbStore.fetchFn,
            deferCleanup: true,
          });
          notifyBothCreated();
          await bothCreated;
          await standalone2Gate;

          // Standalone 2's resources are still intact after Standalone 1 finished cleanup:
          assert.equal(dbStore.authUsers.has(standalone2Fixture.auth), true);
          assert.equal(dbStore.appUsers.has(standalone2Fixture.profile), true);

          return cleanup('synthetic_service_key', standalone2Fixture, {
            fetchFn: dbStore.fetchFn,
          });
        }),
      ]);

      assert.deepEqual(resA, { attempted: true, status: 'PASS' });
      assert.deepEqual(resB, { attempted: true, status: 'PASS' });
      assert.equal(dbStore.authUsers.size, 1);
      assert.equal(dbStore.appUsers.size, 1);
      assert.equal(dbStore.orgMembers.length, 1);
    }

    // 5b. Two concurrent QA harness runs cannot delete each other's resources.
    await withTempDir(async (rootArtifactDir) => {
      const dbStore = createSharedMockDatabase();
      let run1Fixture = null;
      let run2Fixture = null;
      let releaseRun2Browser;
      const run2BrowserGate = new Promise((resolve) => {
        releaseRun2Browser = resolve;
      });
      let run2ReadyInBrowser;
      const run2EnteredBrowser = new Promise((resolve) => {
        run2ReadyInBrowser = resolve;
      });

      const makeConcurrentDeps = (runIndex) =>
        defaultStubDependencies({
          localStatusFn: async () => ({
            API_URL: CANONICAL_API_ORIGIN,
            ANON_KEY: 'synthetic_anon_key_value_for_unit_test_only',
            SERVICE_ROLE_KEY: 'synthetic_service_key',
          }),
          createFixtureFn: async (key, options) => {
            const created = await createFixture(key, {
              ...options,
              fetchFn: dbStore.fetchFn,
            });
            if (runIndex === 1) {
              run1Fixture = created;
            } else {
              run2Fixture = created;
            }
            return created;
          },
          runBrowserFn: async (cdp, fix, options) => {
            if (runIndex === 1) {
              await run2EnteredBrowser;
              // While both runs are active, verify run1 cannot directly invoke cleanup() on run2's fixture!
              await assert.rejects(
                () =>
                  cleanup('synthetic_service_key', run2Fixture, {
                    fetchFn: dbStore.fetchFn,
                  }),
                (err) =>
                  err instanceof QaError &&
                  err.code === 'FIXTURE_CLEANUP_FAILED',
              );
              await runBrowser(cdp, fix, options);
            } else {
              run2ReadyInBrowser();
              await run2BrowserGate;
              // When run2 resumes after run1 has already completed cleanup, run2's resources MUST still be present!
              assert.equal(dbStore.authUsers.has(run2Fixture.auth), true);
              assert.equal(dbStore.appUsers.has(run2Fixture.profile), true);
              assert.equal(
                dbStore.orgMembers.some(
                  (m) => m.user_id === run2Fixture.profile,
                ),
                true,
              );
              await runBrowser(cdp, fix, options);
            }
          },
          cleanupFn: async (key, fix, options) => {
            const res = await cleanup(key, fix, {
              ...options,
              fetchFn: dbStore.fetchFn,
            });
            if (runIndex === 1) {
              // Run1 finished cleanup; now release Run2 to verify Run2's fixture was untouched.
              releaseRun2Browser();
            }
            return res;
          },
        });

      const [res1, res2] = await Promise.all([
        runQaHarness({
          ...makeConcurrentDeps(1),
          artifactDir: path.join(rootArtifactDir, 'run1'),
          negativeControl: false,
        }),
        runQaHarness({
          ...makeConcurrentDeps(2),
          artifactDir: path.join(rootArtifactDir, 'run2'),
          negativeControl: false,
        }),
      ]);

      assert.equal(res1.failure, false);
      assert.equal(res1.evidence.overall, 'PASS');
      assert.equal(res1.evidence.cleanup.status, 'PASS');
      assert.equal(res2.failure, false);
      assert.equal(res2.evidence.overall, 'PASS');
      assert.equal(res2.evidence.cleanup.status, 'PASS');
      assert.notEqual(run1Fixture.email, run2Fixture.email);
      assert.equal(dbStore.authUsers.size, 1);
      assert.equal(dbStore.authUsers.has(UNRELATED_AUTH_ID), true);
      assert.equal(dbStore.appUsers.size, 1);
      assert.equal(dbStore.appUsers.has(UNRELATED_PROFILE_ID), true);
      assert.equal(dbStore.orgMembers.length, 1);
    });

    // 6. Partially created current-run fixture still receives safe compensating cleanup (standalone and harness).
    for (const failStage of ['profile', 'membership']) {
      const dbStore = createSharedMockDatabase({ failStage });
      await assert.rejects(
        () =>
          withFixtureInvocation(async () => {
            await assert.rejects(
              () =>
                createFixture('synthetic_service_key', {
                  fetchFn: dbStore.fetchFn,
                  deferCleanup: false,
                }),
              (err) =>
                err instanceof QaError && err.stage === 'FIXTURE_CREATION',
            );
          }),
        (err) =>
          err instanceof QaError &&
          err.code === 'FIXTURE_CLEANUP_UNVERIFIED' &&
          err.cleanupReason === 'MUTATION_OUTCOME_AMBIGUOUS',
      );
      // Partial current-run records were safely cleaned up by standalone compensating cleanup without self-deadlock.
      assert.equal(dbStore.authUsers.size, 1);
      assert.equal(dbStore.authUsers.has(UNRELATED_AUTH_ID), true);
      assert.equal(dbStore.appUsers.size, 1);
      assert.equal(dbStore.appUsers.has(UNRELATED_PROFILE_ID), true);
      assert.equal(dbStore.orgMembers.length, 1);

      await withTempDir(async (artifactDir) => {
        const harnessStore = createSharedMockDatabase({ failStage });
        const deps = defaultStubDependencies({
          localStatusFn: async () => ({
            API_URL: CANONICAL_API_ORIGIN,
            ANON_KEY: 'synthetic_anon_key_value_for_unit_test_only',
            SERVICE_ROLE_KEY: 'synthetic_service_key',
          }),
          createFixtureFn: (key, options) =>
            createFixture(key, {
              ...options,
              fetchFn: harnessStore.fetchFn,
            }),
          cleanupFn: (key, fix, options) =>
            cleanup(key, fix, {
              ...options,
              fetchFn: harnessStore.fetchFn,
            }),
        });
        const { evidence, failure } = await runQaHarness({
          ...deps,
          artifactDir,
          negativeControl: true,
        });
        assert.equal(failure, true);
        assert.equal(evidence.failure?.stage, 'FIXTURE_CREATION');
        assert.equal(evidence.cleanup.attempted, true);
        assert.equal(evidence.cleanup.status, 'UNVERIFIED');
        assert.equal(evidence.cleanup.reason, 'MUTATION_OUTCOME_AMBIGUOUS');
        assert.deepEqual(evidence.cleanup.ambiguousMutations, [failStage]);
        assert.equal(harnessStore.authUsers.size, 1);
        assert.equal(harnessStore.appUsers.size, 1);
        assert.equal(harnessStore.orgMembers.length, 1);
      });
    }
  });

  it('SEC64-01C: enforces the creation/cleanup lifecycle barrier so cleanup never returns PASS while createFixture is in flight and createFixture never creates synthetic records after cleanup starts', async () => {
    const UNRELATED_AUTH_ID = '00000000-0000-4000-8000-000000000999';
    const UNRELATED_PROFILE_ID = '00000000-0000-4000-8000-000000000888';
    const UNRELATED_EMAIL = 'unrelated-operator@example.test';
    const SEED_ORG_ID = '00000000-0000-4000-8000-000000000010';
    const SEED_ROLE_ID = '00000000-0000-4000-8000-000000000020';

    function createBarrierTestDatabase({
      onOrganizationsGet = null,
      onRolesGet = null,
      onAuthPost = null,
      onProfilePost = null,
      onMembershipPost = null,
    } = {}) {
      const authUsers = new Map([
        [UNRELATED_AUTH_ID, { id: UNRELATED_AUTH_ID, email: UNRELATED_EMAIL }],
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
      ]);
      const orgMembers = [
        {
          organization_id: SEED_ORG_ID,
          user_id: UNRELATED_PROFILE_ID,
          role_id: SEED_ROLE_ID,
          status: 'ACTIVE',
        },
      ];
      const getCalls = [];
      const postCalls = [];
      const deleteCalls = [];
      let authCounter = 0;
      let profileCounter = 0;

      const jsonResponse = (status, payload) => ({
        ok: status >= 200 && status < 300,
        status,
        json: async () => payload,
      });

      const fetchFn = async (url, options = {}) => {
        const parsed = new URL(String(url));
        const method = options.method ?? 'GET';
        const pathname = parsed.pathname;

        if (method === 'GET') {
          getCalls.push(`${pathname}${parsed.search}`);
        } else if (method === 'POST') {
          postCalls.push(`${pathname}${parsed.search}`);
        } else if (method === 'DELETE') {
          deleteCalls.push(`${pathname}${parsed.search}`);
        }

        if (method === 'GET' && pathname === '/rest/v1/organizations') {
          if (onOrganizationsGet) {
            await onOrganizationsGet({ options });
          }
          return jsonResponse(200, [{ id: SEED_ORG_ID }]);
        }
        if (method === 'GET' && pathname === '/rest/v1/roles') {
          if (onRolesGet) {
            await onRolesGet({ options });
          }
          return jsonResponse(200, [{ id: SEED_ROLE_ID }]);
        }

        if (method === 'POST' && pathname === '/auth/v1/admin/users') {
          if (onAuthPost) {
            await onAuthPost({ options });
          }
          const body = JSON.parse(options.body);
          authCounter += 1;
          const id = `00000000-0000-4000-8000-${String(1000 + authCounter).padStart(12, '0')}`;
          const user = { id, email: body.email };
          authUsers.set(id, user);
          return jsonResponse(200, user);
        }

        if (method === 'POST' && pathname === '/rest/v1/users') {
          if (onProfilePost) {
            await onProfilePost({ options });
          }
          const body = JSON.parse(options.body);
          profileCounter += 1;
          const id = `00000000-0000-4000-8000-${String(2000 + profileCounter).padStart(12, '0')}`;
          const row = {
            id,
            auth_user_id: body.auth_user_id,
            email: body.email,
            name: body.name,
            status: body.status,
          };
          appUsers.set(id, row);
          return jsonResponse(201, [row]);
        }

        if (method === 'POST' && pathname === '/rest/v1/organization_members') {
          if (onMembershipPost) {
            await onMembershipPost({ options });
          }
          const body = JSON.parse(options.body);
          const row = {
            organization_id: body.organization_id,
            user_id: body.user_id,
            role_id: body.role_id,
            status: body.status,
          };
          orgMembers.push(row);
          return jsonResponse(201, [row]);
        }

        if (method === 'GET' && pathname === '/auth/v1/admin/users') {
          const all = Array.from(authUsers.values());
          return jsonResponse(200, { users: all });
        }

        if (pathname.startsWith('/auth/v1/admin/users/')) {
          const authId = decodeURIComponent(
            pathname.slice('/auth/v1/admin/users/'.length),
          );
          if (method === 'GET') {
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

      return {
        authUsers,
        appUsers,
        orgMembers,
        getCalls,
        postCalls,
        deleteCalls,
        fetchFn,
      };
    }

    // 1. Pre-dispatch race paused at organization GET and role GET (non-abort-responsive fetch):
    // - Foreign invocation attempting cleanup while paused is rejected before any GET/DELETE.
    // - Owning invocation calling cleanup while paused returns UNVERIFIED / FIXTURE_QUIESCENCE_TIMEOUT (never PASS).
    // - Resuming createFixture rejects with PROCESS_SIGNAL_TERMINATED, dispatches zero POST requests,
    //   creates zero synthetic records, and leaves unrelated records intact.
    for (const pauseStage of ['organizations', 'roles']) {
      let notifyPaused;
      const pausedPromise = new Promise((resolve) => {
        notifyPaused = resolve;
      });
      let resumePausedGet;
      const pauseGate = new Promise((resolve) => {
        resumePausedGet = resolve;
      });

      const dbStore = createBarrierTestDatabase({
        onOrganizationsGet:
          pauseStage === 'organizations'
            ? async () => {
                notifyPaused();
                await pauseGate;
              }
            : null,
        onRolesGet:
          pauseStage === 'roles'
            ? async () => {
                notifyPaused();
                await pauseGate;
              }
            : null,
      });

      await assert.rejects(
        () =>
          withFixtureInvocation(async () => {
            const fixture = createFixtureState();
            const createPromise = createFixture('synthetic_service_key', {
              fetchFn: dbStore.fetchFn,
              fixture,
              deferCleanup: true,
            });

            await pausedPromise;
            const getsBeforeForeign = dbStore.getCalls.length;

            // 1a. Foreign invocation attempts cleanup on the paused live fixture -> rejected before any GET/DELETE:
            await withFixtureInvocation(async () => {
              await assert.rejects(
                () =>
                  cleanup('synthetic_service_key', fixture, {
                    fetchFn: dbStore.fetchFn,
                  }),
                (err) =>
                  err instanceof QaError &&
                  err.code === 'FIXTURE_CLEANUP_FAILED',
                `Foreign cleanup during ${pauseStage} GET must be rejected`,
              );
            });
            assert.equal(dbStore.getCalls.length, getsBeforeForeign);
            assert.deepEqual(dbStore.deleteCalls, []);

            // 1b. Owning invocation calls cleanup while createFixture is still paused at GET:
            const cleanRes = await cleanup('synthetic_service_key', fixture, {
              fetchFn: dbStore.fetchFn,
              creationQuiescenceTimeoutMs: 15,
            });
            assert.notEqual(
              cleanRes.status,
              'PASS',
              `Cleanup during ${pauseStage} GET must never return PASS`,
            );
            assert.deepEqual(cleanRes, {
              attempted: true,
              status: 'UNVERIFIED',
              reason: 'FIXTURE_QUIESCENCE_TIMEOUT',
              executionQuiesced: false,
            });

            // 1c. Resume the paused GET and verify createFixture aborts before any POST:
            resumePausedGet();
            await assert.rejects(
              () => createPromise,
              (err) =>
                err instanceof QaError &&
                err.code === 'PROCESS_SIGNAL_TERMINATED',
              `Resumed createFixture after cleanup at ${pauseStage} GET must reject`,
            );
            assert.deepEqual(
              dbStore.postCalls,
              [],
              `Zero POST requests allowed after cleanup during ${pauseStage} GET`,
            );
            assert.equal(dbStore.authUsers.size, 1);
            assert.equal(dbStore.authUsers.has(UNRELATED_AUTH_ID), true);
            assert.equal(dbStore.appUsers.size, 1);
            assert.equal(dbStore.appUsers.has(UNRELATED_PROFILE_ID), true);
            assert.equal(dbStore.orgMembers.length, 1);
          }),
        (err) =>
          err instanceof QaError &&
          err.code === 'FIXTURE_CLEANUP_UNVERIFIED' &&
          err.cleanupReason === 'FIXTURE_QUIESCENCE_TIMEOUT',
      );
    }

    // 2. Pre-dispatch race paused at organization GET and role GET with abort-responsive fetchFn:
    // cleanup() aborts the in-flight GET via creationAbortController within creationQuiescenceTimeoutMs,
    // creation settles cleanly (executionQuiesced: true), cleanup returns UNVERIFIED / FIXTURE_QUIESCENCE_TIMEOUT,
    // and zero POST requests occur.
    for (const pauseStage of ['organizations', 'roles']) {
      let notifyPaused;
      const pausedPromise = new Promise((resolve) => {
        notifyPaused = resolve;
      });

      const waitUntilAborted = ({ options }) =>
        new Promise((_, reject) => {
          notifyPaused();
          const sig = options.signal;
          if (sig?.aborted) {
            const err = new Error('Aborted');
            err.name = 'AbortError';
            reject(err);
            return;
          }
          sig?.addEventListener(
            'abort',
            () => {
              const err = new Error('Aborted');
              err.name = 'AbortError';
              reject(err);
            },
            { once: true },
          );
        });

      const dbStore = createBarrierTestDatabase({
        onOrganizationsGet:
          pauseStage === 'organizations' ? waitUntilAborted : null,
        onRolesGet: pauseStage === 'roles' ? waitUntilAborted : null,
      });

      await assert.rejects(
        () =>
          withFixtureInvocation(async () => {
            const fixture = createFixtureState();
            const createPromise = createFixture('synthetic_service_key', {
              fetchFn: dbStore.fetchFn,
              fixture,
              deferCleanup: true,
            });

            await pausedPromise;
            const cleanRes = await cleanup('synthetic_service_key', fixture, {
              fetchFn: dbStore.fetchFn,
              creationQuiescenceTimeoutMs: 100,
            });
            assert.deepEqual(cleanRes, {
              attempted: true,
              status: 'UNVERIFIED',
              reason: 'FIXTURE_QUIESCENCE_TIMEOUT',
              executionQuiesced: true,
            });

            await assert.rejects(
              () => createPromise,
              (err) =>
                err instanceof QaError &&
                err.code === 'PROCESS_SIGNAL_TERMINATED',
            );
            assert.deepEqual(dbStore.postCalls, []);
            assert.equal(dbStore.authUsers.size, 1);
            assert.equal(dbStore.appUsers.size, 1);
            assert.equal(dbStore.orgMembers.length, 1);
          }),
        (err) =>
          err instanceof QaError &&
          err.code === 'FIXTURE_CLEANUP_UNVERIFIED' &&
          err.cleanupReason === 'FIXTURE_QUIESCENCE_TIMEOUT',
      );
    }

    // 3. Calling cleanup() on an unactivated createFixtureState() returns SKIPPED and permanently blocks subsequent createFixture({ fixture }).
    {
      const dbStore = createBarrierTestDatabase();
      await withFixtureInvocation(async () => {
        const fixture = createFixtureState();
        const skipRes = await cleanup('synthetic_service_key', fixture, {
          fetchFn: dbStore.fetchFn,
        });
        assert.deepEqual(skipRes, { attempted: false, status: 'SKIPPED' });

        await assert.rejects(
          () =>
            createFixture('synthetic_service_key', {
              fetchFn: dbStore.fetchFn,
              fixture,
              deferCleanup: true,
            }),
          (err) =>
            err instanceof QaError && err.code === 'FIXTURE_CREATION_FAILED',
        );
        assert.deepEqual(dbStore.getCalls, []);
        assert.deepEqual(dbStore.postCalls, []);
      });
    }

    // 4. Concurrent cleanup() while auth, profile, or membership POST is in flight:
    // - cancels remaining creation steps
    // - reconciles and deletes any already-created current-run records
    // - returns UNVERIFIED / MUTATION_OUTCOME_AMBIGUOUS (never PASS)
    // - sticky ambiguity cannot be cleared by caller mutating fixture fields or late response completion.
    for (const inFlightStage of ['auth', 'profile', 'membership']) {
      let notifyPostInFlight;
      const postInFlight = new Promise((resolve) => {
        notifyPostInFlight = resolve;
      });
      let resumeInFlightPost;
      const postGate = new Promise((resolve) => {
        resumeInFlightPost = resolve;
      });

      const pauseHook = async () => {
        notifyPostInFlight();
        await postGate;
      };

      const dbStore = createBarrierTestDatabase({
        onAuthPost: inFlightStage === 'auth' ? pauseHook : null,
        onProfilePost: inFlightStage === 'profile' ? pauseHook : null,
        onMembershipPost: inFlightStage === 'membership' ? pauseHook : null,
      });

      await assert.rejects(
        () =>
          withFixtureInvocation(async () => {
            const fixture = createFixtureState();
            const createPromise = createFixture('synthetic_service_key', {
              fetchFn: dbStore.fetchFn,
              fixture,
              deferCleanup: true,
            });

            await postInFlight;
            const expectedPostCount =
              inFlightStage === 'auth'
                ? 1
                : inFlightStage === 'profile'
                  ? 2
                  : 3;
            assert.equal(dbStore.postCalls.length, expectedPostCount);

            // Caller attempts to clear ambiguity flags on the mutable fixture object before calling cleanup:
            fixture.mutationOutcomeAmbiguous = false;
            fixture.ambiguousMutations = [];

            // Start cleanup while POST is still in flight; then let the in-flight POST finish within quiescence window
            // so we also verify sticky ambiguity when the response arrives after cleanup has started!
            setTimeout(() => {
              resumeInFlightPost();
            }, 5);

            const cleanRes = await cleanup('synthetic_service_key', fixture, {
              fetchFn: dbStore.fetchFn,
              creationQuiescenceTimeoutMs: 100,
            });

            assert.equal(cleanRes.status, 'UNVERIFIED');
            assert.equal(cleanRes.reason, 'MUTATION_OUTCOME_AMBIGUOUS');
            assert.deepEqual(cleanRes.ambiguousMutations, [inFlightStage]);

            await assert.rejects(
              () => createPromise,
              (err) =>
                err instanceof QaError &&
                err.code === 'PROCESS_SIGNAL_TERMINATED',
            );

            // No subsequent POST stages were dispatched after the interrupted stage!
            assert.equal(dbStore.postCalls.length, expectedPostCount);
            // All already-created current-run records were reconciled and deleted!
            assert.equal(dbStore.authUsers.size, 1);
            assert.equal(dbStore.authUsers.has(UNRELATED_AUTH_ID), true);
            assert.equal(dbStore.appUsers.size, 1);
            assert.equal(dbStore.appUsers.has(UNRELATED_PROFILE_ID), true);
            assert.equal(dbStore.orgMembers.length, 1);
          }),
        (err) =>
          err instanceof QaError &&
          err.code === 'FIXTURE_CLEANUP_UNVERIFIED' &&
          err.cleanupReason === 'MUTATION_OUTCOME_AMBIGUOUS',
      );
    }
  });

  it('SEC64-01B: reconciles auth identities across multi-page admin user listings (>1,000 users) and fails closed on truncated, incomplete, duplicate, or failed pagination pages', async () => {
    const SEED_ORG_ID = '00000000-0000-4000-8000-000000000010';
    const SEED_ROLE_ID = '00000000-0000-4000-8000-000000000020';
    const UNRELATED_COUNT = 1205;

    function createPaginatedAuthStore({
      unrelatedCount = UNRELATED_COUNT,
      failProfilePost = false,
      onAfterAuthCreated = null,
      customListResponse = null,
    } = {}) {
      const authUsers = new Map();
      for (let i = 1; i <= unrelatedCount; i += 1) {
        const id = `00000000-0000-4000-9000-${String(i).padStart(12, '0')}`;
        authUsers.set(id, {
          id,
          email: `unrelated-user-${i}@example.test`,
        });
      }
      const appUsers = new Map();
      const orgMembers = [];
      const listPageRequests = [];
      const deleteCalls = [];
      let synthSeq = 0;

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

        if (method === 'GET' && pathname === '/rest/v1/organizations') {
          return jsonResponse(200, [{ id: SEED_ORG_ID }]);
        }
        if (method === 'GET' && pathname === '/rest/v1/roles') {
          return jsonResponse(200, [{ id: SEED_ROLE_ID }]);
        }

        if (method === 'POST' && pathname === '/auth/v1/admin/users') {
          const body = JSON.parse(options.body);
          synthSeq += 1;
          const id = `00000000-0000-4000-8000-${String(9000 + synthSeq).padStart(12, '0')}`;
          const user = { id, email: body.email };
          // Appended after all 1,205 unrelated users -> located on page 2 of per_page=1000!
          authUsers.set(id, user);
          if (onAfterAuthCreated) {
            onAfterAuthCreated(user);
          }
          return jsonResponse(200, user);
        }

        if (method === 'POST' && pathname === '/rest/v1/users') {
          if (failProfilePost) {
            return jsonResponse(500, { error: 'profile post failed' });
          }
          const body = JSON.parse(options.body);
          const id = `00000000-0000-4000-8000-${String(9500 + synthSeq).padStart(12, '0')}`;
          const row = {
            id,
            auth_user_id: body.auth_user_id,
            email: body.email,
            name: body.name,
            status: body.status,
          };
          appUsers.set(id, row);
          return jsonResponse(201, [row]);
        }

        if (method === 'POST' && pathname === '/rest/v1/organization_members') {
          const body = JSON.parse(options.body);
          const row = {
            organization_id: body.organization_id,
            user_id: body.user_id,
            role_id: body.role_id,
            status: body.status,
          };
          orgMembers.push(row);
          return jsonResponse(201, [row]);
        }

        if (method === 'GET' && pathname === '/auth/v1/admin/users') {
          const page = Number.parseInt(
            parsed.searchParams.get('page') ?? '1',
            10,
          );
          const perPage = Number.parseInt(
            parsed.searchParams.get('per_page') ?? '1000',
            10,
          );
          listPageRequests.push({ page, perPage });
          if (customListResponse) {
            const custom = customListResponse({
              page,
              perPage,
              authUsers,
              jsonResponse,
            });
            if (custom) return custom;
          }
          const all = Array.from(authUsers.values());
          const start = (page - 1) * perPage;
          const slice = all.slice(start, start + perPage);
          const lastPage = Math.max(1, Math.ceil(all.length / perPage));
          return jsonResponse(200, {
            users: slice,
            total: all.length,
            lastPage,
            nextPage: page < lastPage ? page + 1 : null,
          });
        }

        if (pathname.startsWith('/auth/v1/admin/users/')) {
          const authId = decodeURIComponent(
            pathname.slice('/auth/v1/admin/users/'.length),
          );
          if (method === 'GET') {
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

      return {
        authUsers,
        appUsers,
        orgMembers,
        listPageRequests,
        deleteCalls,
        fetchFn,
      };
    }

    // 1a. Auth-only fixture beyond page 1 (>1,000 users, at index 1,206) where signal aborts before profile dispatch
    // and fixture.auth = null (email-only lookup): found on page 2, deleted, verified absent across all pages,
    // returns PASS, and leaves all 1,205 unrelated users intact.
    await withFixtureInvocation(async () => {
      const ac = new AbortController();
      const store = createPaginatedAuthStore({
        onAfterAuthCreated: () => ac.abort(),
      });
      const fixtureState = createFixtureState();
      await assert.rejects(
        () =>
          createFixture('synthetic_service_key', {
            fetchFn: store.fetchFn,
            fixture: fixtureState,
            signal: ac.signal,
            deferCleanup: true,
          }),
        (err) =>
          err instanceof QaError && err.code === 'PROCESS_SIGNAL_TERMINATED',
      );
      const createdAuthId = fixtureState.auth;
      assert.equal(typeof createdAuthId, 'string');
      assert.equal(store.authUsers.size, UNRELATED_COUNT + 1);
      // Clear fixture.auth to force email-only multi-page reconciliation on the auth-only fixture!
      fixtureState.auth = null;

      const cleanRes = await cleanup('synthetic_service_key', fixtureState, {
        fetchFn: store.fetchFn,
      });
      assert.deepEqual(cleanRes, { attempted: true, status: 'PASS' });
      assert.equal(store.authUsers.has(createdAuthId), false);
      assert.equal(store.authUsers.size, UNRELATED_COUNT);
      assert.ok(
        store.listPageRequests.some((req) => req.page === 2),
        'Must inspect page 2 beyond the initial 1,000 users',
      );
      assert.deepEqual(store.deleteCalls, [
        `/auth/v1/admin/users/${createdAuthId}`,
      ]);
    });

    // 1b. Auth-only fixture beyond page 1 (>1,000 users, at index 1,206) where profile POST was dispatched and failed:
    // found on page 2 via email-only reconciliation, deleted, verified absent across all pages, and returns UNVERIFIED.
    await assert.rejects(
      () =>
        withFixtureInvocation(async () => {
          const store = createPaginatedAuthStore({ failProfilePost: true });
          const fixtureState = createFixtureState();
          await assert.rejects(
            () =>
              createFixture('synthetic_service_key', {
                fetchFn: store.fetchFn,
                fixture: fixtureState,
                deferCleanup: true,
              }),
            (err) => err instanceof QaError && err.stage === 'FIXTURE_CREATION',
          );
          const createdAuthId = fixtureState.auth;
          fixtureState.auth = null;

          const cleanRes = await cleanup(
            'synthetic_service_key',
            fixtureState,
            {
              fetchFn: store.fetchFn,
            },
          );
          assert.deepEqual(cleanRes, {
            attempted: true,
            status: 'UNVERIFIED',
            reason: 'MUTATION_OUTCOME_AMBIGUOUS',
            ambiguousMutations: ['profile'],
          });
          assert.equal(store.authUsers.has(createdAuthId), false);
          assert.equal(store.authUsers.size, UNRELATED_COUNT);
          assert.ok(store.listPageRequests.some((req) => req.page === 2));
        }),
      (err) =>
        err instanceof QaError &&
        err.code === 'FIXTURE_CLEANUP_UNVERIFIED' &&
        err.cleanupReason === 'MUTATION_OUTCOME_AMBIGUOUS',
    );

    // 2. Full fixture with auth user on page 3 (using pageSize=5, 12 unrelated users -> page 3) reconciles and cleans up cleanly.
    await withFixtureInvocation(async () => {
      const store = createPaginatedAuthStore({ unrelatedCount: 12 });
      const fixture = await createFixture('synthetic_service_key', {
        fetchFn: store.fetchFn,
        deferCleanup: true,
      });
      const cleanRes = await cleanup('synthetic_service_key', fixture, {
        fetchFn: store.fetchFn,
        pageSize: 5,
      });
      assert.deepEqual(cleanRes, { attempted: true, status: 'PASS' });
      assert.equal(store.authUsers.size, 12);
      assert.ok(store.listPageRequests.some((req) => req.page === 3));
    });

    // 3. Incomplete pagination, failed page, truncated flag, total mismatch, duplicate IDs across pages,
    // duplicate synthetic email matches across pages, and maxPages overflow all fail closed (never false PASS).
    const paginationFailureScenarios = [
      {
        label: 'HTTP 500 failure on page 2 during auth list pagination',
        customListResponse: ({ page, jsonResponse }) =>
          page === 2 ? jsonResponse(500, { error: 'page 2 failed' }) : null,
      },
      {
        label: 'truncated: true flag on auth list response',
        customListResponse: ({ page, perPage, authUsers, jsonResponse }) => {
          const all = Array.from(authUsers.values());
          const slice = all.slice((page - 1) * perPage, page * perPage);
          return jsonResponse(200, { users: slice, truncated: true });
        },
      },
      {
        label: 'declared total larger than actual returned users across pages',
        customListResponse: ({ page, perPage, authUsers, jsonResponse }) => {
          const all = Array.from(authUsers.values());
          const slice = all.slice((page - 1) * perPage, page * perPage);
          return jsonResponse(200, {
            users: slice,
            total: all.length + 5,
            lastPage: 2,
          });
        },
      },
      {
        label: 'duplicate user ID repeated across page 1 and page 2',
        customListResponse: ({ page, perPage, authUsers, jsonResponse }) => {
          const all = Array.from(authUsers.values());
          if (page === 1) {
            return jsonResponse(200, {
              users: all.slice(0, perPage),
              nextPage: 2,
            });
          }
          return jsonResponse(200, {
            users: [all[0], ...all.slice(perPage)],
            nextPage: null,
          });
        },
      },
      {
        label: 'duplicate synthetic email match on page 2 with distinct ID',
        customListResponse: ({ page, perPage, authUsers, jsonResponse }) => {
          const all = Array.from(authUsers.values());
          if (page === 1) {
            return jsonResponse(200, {
              users: all.slice(0, perPage),
              nextPage: 2,
            });
          }
          const synthUser = all[all.length - 1];
          return jsonResponse(200, {
            users: [
              ...all.slice(perPage),
              {
                id: '00000000-0000-4000-8000-000000009999',
                email: synthUser.email,
              },
            ],
            nextPage: null,
          });
        },
      },
      {
        label: 'pagination exceeds maxPages bound before reaching final page',
        pageSize: 2,
        maxPages: 3,
      },
    ];

    for (const scenario of paginationFailureScenarios) {
      await assert.rejects(
        () =>
          withFixtureInvocation(async () => {
            const store = createPaginatedAuthStore({
              unrelatedCount: 8,
              failProfilePost: true,
              customListResponse: scenario.customListResponse,
            });
            const fixtureState = createFixtureState();
            await assert.rejects(
              () =>
                createFixture('synthetic_service_key', {
                  fetchFn: store.fetchFn,
                  fixture: fixtureState,
                  deferCleanup: true,
                }),
              (err) =>
                err instanceof QaError && err.stage === 'FIXTURE_CREATION',
            );
            fixtureState.auth = null;

            await assert.rejects(
              () =>
                cleanup('synthetic_service_key', fixtureState, {
                  fetchFn: store.fetchFn,
                  pageSize: scenario.pageSize ?? 5,
                  maxPages: scenario.maxPages ?? 25,
                }),
              (err) =>
                err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
              scenario.label,
            );
          }),
        (err) =>
          err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
        scenario.label,
      );
    }
  });

  it('SEC64-01-D: enforces standalone scope-exit resource safety, cancellation, reconciliation, and fail-closed reporting across normal returns, thrown errors, in-flight creations, explicit cleanups, multiple fixtures, and multi-page (>1,000 users) auth listings', async () => {
    const SEED_ORG_ID = '00000000-0000-4000-8000-000000000010';
    const SEED_ROLE_ID = '00000000-0000-4000-8000-000000000020';
    const UNRELATED_AUTH_ID = '00000000-0000-4000-8000-000000000901';
    const UNRELATED_PROFILE_ID = '00000000-0000-4000-8000-000000000902';

    function createScopeSafetyStore({
      unrelatedCount = 1,
      failPostStage = null,
      failDeleteAuthId = null,
      failDeleteProfileId = null,
      onOrganizationsGet = null,
      onRolesGet = null,
      onAuthPost = null,
      onProfilePost = null,
      onMembershipPost = null,
      onAuthDelete = null,
    } = {}) {
      let synthSeq = 0;
      const authUsers = new Map([
        [
          UNRELATED_AUTH_ID,
          { id: UNRELATED_AUTH_ID, email: 'unrelated-operator@example.test' },
        ],
      ]);
      for (let i = 2; i <= unrelatedCount; i += 1) {
        const id = `00000000-0000-4000-9000-${String(i).padStart(12, '0')}`;
        authUsers.set(id, {
          id,
          email: `unrelated-operator-${i}@example.test`,
        });
      }
      const appUsers = new Map([
        [
          UNRELATED_PROFILE_ID,
          {
            id: UNRELATED_PROFILE_ID,
            auth_user_id: UNRELATED_AUTH_ID,
            email: 'unrelated-operator@example.test',
            name: 'Unrelated Operator',
            status: 'ACTIVE',
          },
        ],
      ]);
      const orgMembers = [
        {
          organization_id: SEED_ORG_ID,
          user_id: UNRELATED_PROFILE_ID,
          role_id: SEED_ROLE_ID,
          status: 'ACTIVE',
        },
      ];
      const getCalls = [];
      const postCalls = [];
      const deleteCalls = [];
      const listPageRequests = [];

      const jsonResponse = (status, payload) => ({
        ok: status >= 200 && status < 300,
        status,
        json: async () => payload,
      });

      const fetchFn = async (url, options = {}) => {
        const parsed = new URL(String(url));
        const method = options.method ?? 'GET';
        const pathname = parsed.pathname;

        if (method === 'GET') {
          getCalls.push(`${pathname}${parsed.search}`);
        } else if (method === 'POST') {
          postCalls.push(`${pathname}${parsed.search}`);
        } else if (method === 'DELETE') {
          deleteCalls.push(`${pathname}${parsed.search}`);
        }

        if (method === 'GET' && pathname === '/rest/v1/organizations') {
          if (onOrganizationsGet) {
            await onOrganizationsGet({ options });
          }
          return jsonResponse(200, [{ id: SEED_ORG_ID }]);
        }
        if (method === 'GET' && pathname === '/rest/v1/roles') {
          if (onRolesGet) {
            await onRolesGet({ options });
          }
          return jsonResponse(200, [{ id: SEED_ROLE_ID }]);
        }

        if (method === 'POST' && pathname === '/auth/v1/admin/users') {
          if (failPostStage === 'auth') {
            return jsonResponse(500, { error: 'auth post failed' });
          }
          const body = JSON.parse(options.body);
          synthSeq += 1;
          const id = `00000000-0000-4000-8000-${String(7100 + synthSeq).padStart(12, '0')}`;
          const row = { id, email: body.email };
          authUsers.set(id, row);
          if (onAuthPost) {
            await onAuthPost({ options, row });
          }
          return jsonResponse(200, row);
        }

        if (method === 'POST' && pathname === '/rest/v1/users') {
          if (failPostStage === 'profile') {
            return jsonResponse(500, { error: 'profile post failed' });
          }
          const body = JSON.parse(options.body);
          const id = `00000000-0000-4000-8000-${String(7200 + synthSeq).padStart(12, '0')}`;
          const row = {
            id,
            auth_user_id: body.auth_user_id,
            email: body.email,
            name: body.name,
            status: body.status,
          };
          appUsers.set(id, row);
          if (onProfilePost) {
            await onProfilePost({ options, row });
          }
          return jsonResponse(201, [row]);
        }

        if (method === 'POST' && pathname === '/rest/v1/organization_members') {
          if (failPostStage === 'membership') {
            return jsonResponse(500, { error: 'membership post failed' });
          }
          const body = JSON.parse(options.body);
          const row = {
            organization_id: body.organization_id,
            user_id: body.user_id,
            role_id: body.role_id,
            status: body.status,
          };
          orgMembers.push(row);
          if (onMembershipPost) {
            await onMembershipPost({ options, row });
          }
          return jsonResponse(201, [row]);
        }

        if (method === 'GET' && pathname === '/auth/v1/admin/users') {
          const page = Number.parseInt(
            parsed.searchParams.get('page') ?? '1',
            10,
          );
          const perPage = Number.parseInt(
            parsed.searchParams.get('per_page') ?? '1000',
            10,
          );
          listPageRequests.push({ page, perPage });
          const all = Array.from(authUsers.values());
          const start = (page - 1) * perPage;
          const slice = all.slice(start, start + perPage);
          const lastPage = Math.max(1, Math.ceil(all.length / perPage));
          return jsonResponse(200, {
            users: slice,
            total: all.length,
            lastPage,
            nextPage: page < lastPage ? page + 1 : null,
          });
        }

        if (pathname.startsWith('/auth/v1/admin/users/')) {
          const authId = decodeURIComponent(
            pathname.slice('/auth/v1/admin/users/'.length),
          );
          if (method === 'GET') {
            return authUsers.has(authId)
              ? jsonResponse(200, authUsers.get(authId))
              : jsonResponse(404, {});
          }
          if (method === 'DELETE') {
            if (onAuthDelete) {
              await onAuthDelete({ authId, options });
            }
            if (failDeleteAuthId && authId === failDeleteAuthId) {
              return jsonResponse(500, { error: 'auth delete failed' });
            }
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
                if (failDeleteProfileId && id === failDeleteProfileId) {
                  return jsonResponse(500, { error: 'profile delete failed' });
                }
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

      return {
        authUsers,
        appUsers,
        orgMembers,
        getCalls,
        postCalls,
        deleteCalls,
        listPageRequests,
        fetchFn,
      };
    }

    // 1. Reproduced Case A — Normal return without explicit cleanup ({ deferCleanup: true }):
    // - callback creates a complete fixture and returns a value without calling cleanup
    // - withFixtureInvocation returns the callback result
    // - auth user, profile, and membership are deleted before withFixtureInvocation resolves
    // - capability is invalidated afterward
    // - unrelated records remain intact.
    {
      const store = createScopeSafetyStore();
      let createdFixture = null;
      const result = await withFixtureInvocation(async () => {
        createdFixture = await createFixture('synthetic_service_key', {
          fetchFn: store.fetchFn,
          deferCleanup: true,
        });
        assert.equal(store.authUsers.has(createdFixture.auth), true);
        assert.equal(store.appUsers.has(createdFixture.profile), true);
        assert.equal(
          store.orgMembers.some((m) => m.user_id === createdFixture.profile),
          true,
        );
        return { callbackOutcome: 'normal-return-ok' };
      });
      assert.deepEqual(result, { callbackOutcome: 'normal-return-ok' });
      assert.equal(store.authUsers.has(createdFixture.auth), false);
      assert.equal(store.appUsers.has(createdFixture.profile), false);
      assert.equal(
        store.orgMembers.some((m) => m.user_id === createdFixture.profile),
        false,
      );
      assert.equal(store.authUsers.size, 1);
      assert.equal(store.authUsers.has(UNRELATED_AUTH_ID), true);
      assert.equal(store.appUsers.size, 1);
      assert.equal(store.appUsers.has(UNRELATED_PROFILE_ID), true);
      assert.equal(store.orgMembers.length, 1);

      // Capability is invalidated after scope exit; subsequent cleanup rejects before any GET/DELETE.
      store.getCalls.length = 0;
      store.deleteCalls.length = 0;
      await assert.rejects(
        () =>
          withFixtureInvocation(async () => {
            await cleanup('synthetic_service_key', createdFixture, {
              fetchFn: store.fetchFn,
            });
          }),
        (err) =>
          err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
      );
      assert.deepEqual(store.getCalls, []);
      assert.deepEqual(store.deleteCalls, []);
    }

    // 2. Reproduced Case B — Callback throws after creating a complete fixture ({ deferCleanup: true }):
    // - resources are cleaned up before wrapper settles
    // - original callback error is surfaced
    // - capability is invalidated afterward
    // - unrelated records remain intact.
    {
      const store = createScopeSafetyStore();
      let createdFixture = null;
      const expectedError = new Error('Simulated callback test failure');
      await assert.rejects(
        () =>
          withFixtureInvocation(async () => {
            createdFixture = await createFixture('synthetic_service_key', {
              fetchFn: store.fetchFn,
              deferCleanup: true,
            });
            assert.equal(store.authUsers.has(createdFixture.auth), true);
            throw expectedError;
          }),
        (err) => err === expectedError,
      );
      assert.equal(store.authUsers.has(createdFixture.auth), false);
      assert.equal(store.appUsers.has(createdFixture.profile), false);
      assert.equal(
        store.orgMembers.some((m) => m.user_id === createdFixture.profile),
        false,
      );
      assert.equal(store.authUsers.size, 1);
      assert.equal(store.authUsers.has(UNRELATED_AUTH_ID), true);
      assert.equal(store.appUsers.size, 1);
      assert.equal(store.appUsers.has(UNRELATED_PROFILE_ID), true);
      assert.equal(store.orgMembers.length, 1);

      store.getCalls.length = 0;
      store.deleteCalls.length = 0;
      await assert.rejects(
        () =>
          withFixtureInvocation(async () => {
            await cleanup('synthetic_service_key', createdFixture, {
              fetchFn: store.fetchFn,
            });
          }),
        (err) =>
          err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
      );
      assert.deepEqual(store.getCalls, []);
      assert.deepEqual(store.deleteCalls, []);
    }

    // 3. Callback throws after partial fixture creation:
    // 3a. Non-ambiguous partial creation (signal aborts after auth user confirmed, before profile POST dispatched):
    // created auth user is cleaned up (PASS) and original callback error is surfaced.
    {
      const ac = new AbortController();
      const store = createScopeSafetyStore({
        onAuthPost: () => ac.abort(),
      });
      let fixtureState = null;
      await assert.rejects(
        () =>
          withFixtureInvocation(async () => {
            fixtureState = createFixtureState();
            await createFixture('synthetic_service_key', {
              fetchFn: store.fetchFn,
              fixture: fixtureState,
              signal: ac.signal,
              deferCleanup: true,
            });
          }),
        (err) =>
          err instanceof QaError &&
          err.stage === 'FIXTURE_CREATION' &&
          err.code === 'PROCESS_SIGNAL_TERMINATED',
      );
      assert.equal(typeof fixtureState.auth, 'string');
      assert.equal(store.authUsers.has(fixtureState.auth), false);
      assert.equal(store.authUsers.size, 1);
      assert.equal(store.authUsers.has(UNRELATED_AUTH_ID), true);
    }

    // 3b. Ambiguous partial creation (profile or membership POST dispatched and failed with HTTP 500):
    // created resources are cleaned up before wrapper settles, and outcome fails closed with
    // FIXTURE_CLEANUP_UNVERIFIED / MUTATION_OUTCOME_AMBIGUOUS while preserving callback failure classification.
    for (const failStage of ['profile', 'membership']) {
      const store = createScopeSafetyStore({ failPostStage: failStage });
      let fixtureState = null;
      await assert.rejects(
        () =>
          withFixtureInvocation(async () => {
            fixtureState = createFixtureState();
            await createFixture('synthetic_service_key', {
              fetchFn: store.fetchFn,
              fixture: fixtureState,
              deferCleanup: true,
            });
          }),
        (err) => {
          assert.ok(err instanceof QaError);
          assert.equal(err.stage, 'CLEANUP');
          assert.equal(err.code, 'FIXTURE_CLEANUP_UNVERIFIED');
          assert.equal(err.cleanupReason, 'MUTATION_OUTCOME_AMBIGUOUS');
          assert.deepEqual(err.ambiguousMutations, [failStage]);
          assert.equal(err.details?.priorStage, 'FIXTURE_CREATION');
          assert.equal(err.details?.priorCode, 'FIXTURE_CREATION_FAILED');
          assert.deepEqual(err.callbackFailure, {
            stage: 'FIXTURE_CREATION',
            code: 'FIXTURE_CREATION_FAILED',
          });
          assert.ok(err.cause instanceof QaError);
          return true;
        },
      );
      assert.equal(store.authUsers.has(fixtureState.auth), false);
      if (fixtureState.profile) {
        assert.equal(store.appUsers.has(fixtureState.profile), false);
      }
      assert.equal(store.authUsers.size, 1);
      assert.equal(store.appUsers.size, 1);
      assert.equal(store.orgMembers.length, 1);
    }

    // 4. In-flight pre-dispatch creation at scope exit (organizations GET and roles GET):
    // - callback exits normally or throws while createFixture is still in flight
    // - creation is aborted
    // - zero POST mutations occur
    // - result is fail-closed (FIXTURE_CLEANUP_UNVERIFIED / FIXTURE_QUIESCENCE_TIMEOUT), never PASS.
    for (const pauseStage of ['organizations', 'roles']) {
      for (const exitMode of ['normal', 'throw']) {
        let notifyPaused;
        const pausedPromise = new Promise((resolve) => {
          notifyPaused = resolve;
        });
        let resumePausedGet;
        const pauseGate = new Promise((resolve) => {
          resumePausedGet = resolve;
        });

        const pauseHook = async () => {
          notifyPaused();
          await pauseGate;
        };

        const store = createScopeSafetyStore({
          onOrganizationsGet: pauseStage === 'organizations' ? pauseHook : null,
          onRolesGet: pauseStage === 'roles' ? pauseHook : null,
        });

        let createPromise;
        await assert.rejects(
          () =>
            withFixtureInvocation(
              async () => {
                const fixture = createFixtureState();
                createPromise = createFixture('synthetic_service_key', {
                  fetchFn: store.fetchFn,
                  fixture,
                  deferCleanup: true,
                });
                await pausedPromise;
                setTimeout(() => resumePausedGet(), 30);
                if (exitMode === 'throw') {
                  throw new Error(`Callback threw during ${pauseStage} GET`);
                }
                return 'should-not-pass';
              },
              { creationQuiescenceTimeoutMs: 10 },
            ),
          (err) => {
            assert.ok(err instanceof QaError);
            assert.equal(err.stage, 'CLEANUP');
            assert.equal(err.code, 'FIXTURE_CLEANUP_UNVERIFIED');
            assert.equal(err.cleanupReason, 'FIXTURE_QUIESCENCE_TIMEOUT');
            if (exitMode === 'throw') {
              assert.equal(err.details?.priorStage, 'QA_EXECUTION');
              assert.equal(err.details?.priorCode, 'QA_EXECUTION_FAILED');
            }
            return true;
          },
        );

        await assert.rejects(
          () => createPromise,
          (err) =>
            err instanceof QaError && err.code === 'PROCESS_SIGNAL_TERMINATED',
        );
        assert.deepEqual(store.postCalls, []);
        assert.equal(store.authUsers.size, 1);
        assert.equal(store.appUsers.size, 1);
        assert.equal(store.orgMembers.length, 1);
      }
    }

    // 5. In-flight mutation POST at scope exit (auth, profile, membership):
    // - callback exits normally or throws while POST is in flight
    // - stage becomes sticky-ambiguous
    // - created current-run records are reconciled/deleted where possible
    // - outcome is fail-closed (FIXTURE_CLEANUP_UNVERIFIED / MUTATION_OUTCOME_AMBIGUOUS), never PASS.
    for (const inFlightStage of ['auth', 'profile', 'membership']) {
      for (const exitMode of ['normal', 'throw']) {
        let notifyPostInFlight;
        const postInFlight = new Promise((resolve) => {
          notifyPostInFlight = resolve;
        });
        let resumeInFlightPost;
        const postGate = new Promise((resolve) => {
          resumeInFlightPost = resolve;
        });

        const pauseHook = async () => {
          notifyPostInFlight();
          await postGate;
        };

        const store = createScopeSafetyStore({
          onAuthPost: inFlightStage === 'auth' ? pauseHook : null,
          onProfilePost: inFlightStage === 'profile' ? pauseHook : null,
          onMembershipPost: inFlightStage === 'membership' ? pauseHook : null,
        });

        let createPromise;
        await assert.rejects(
          () =>
            withFixtureInvocation(
              async () => {
                const fixture = createFixtureState();
                createPromise = createFixture('synthetic_service_key', {
                  fetchFn: store.fetchFn,
                  fixture,
                  deferCleanup: true,
                });
                await postInFlight;
                // Complete the in-flight POST within the quiescence window while scope teardown is running:
                setTimeout(() => resumeInFlightPost(), 5);
                if (exitMode === 'throw') {
                  throw new Error(
                    `Callback threw during ${inFlightStage} POST`,
                  );
                }
                return 'should-not-pass';
              },
              { creationQuiescenceTimeoutMs: 100 },
            ),
          (err) => {
            assert.ok(err instanceof QaError);
            assert.equal(err.stage, 'CLEANUP');
            assert.equal(err.code, 'FIXTURE_CLEANUP_UNVERIFIED');
            assert.equal(err.cleanupReason, 'MUTATION_OUTCOME_AMBIGUOUS');
            assert.deepEqual(err.ambiguousMutations, [inFlightStage]);
            if (exitMode === 'throw') {
              assert.equal(err.details?.priorStage, 'QA_EXECUTION');
              assert.equal(err.details?.priorCode, 'QA_EXECUTION_FAILED');
            }
            return true;
          },
        );

        await assert.rejects(
          () => createPromise,
          (err) =>
            err instanceof QaError && err.code === 'PROCESS_SIGNAL_TERMINATED',
        );
        const expectedPosts =
          inFlightStage === 'auth' ? 1 : inFlightStage === 'profile' ? 2 : 3;
        assert.equal(store.postCalls.length, expectedPosts);
        assert.equal(store.authUsers.size, 1);
        assert.equal(store.appUsers.size, 1);
        assert.equal(store.orgMembers.length, 1);
      }
    }

    // 6. Explicit caller cleanup inside withFixtureInvocation:
    // 6a. Caller runs cleanup() and gets PASS; scope exit does not double-delete or fail; post-scope cleanup rejects.
    {
      const store = createScopeSafetyStore();
      let explicitFixture = null;
      const callbackVal = await withFixtureInvocation(async () => {
        explicitFixture = await createFixture('synthetic_service_key', {
          fetchFn: store.fetchFn,
          deferCleanup: true,
        });
        const cleanRes = await cleanup(
          'synthetic_service_key',
          explicitFixture,
          {
            fetchFn: store.fetchFn,
          },
        );
        assert.deepEqual(cleanRes, { attempted: true, status: 'PASS' });
        assert.equal(store.deleteCalls.length, 3);
        return 'explicit-cleanup-ok';
      });
      assert.equal(callbackVal, 'explicit-cleanup-ok');
      // Scope exit must NOT have issued a second round of DELETE calls!
      assert.equal(store.deleteCalls.length, 3);

      store.getCalls.length = 0;
      store.deleteCalls.length = 0;
      await assert.rejects(
        () =>
          withFixtureInvocation(async () => {
            await cleanup('synthetic_service_key', explicitFixture, {
              fetchFn: store.fetchFn,
            });
          }),
        (err) =>
          err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
      );
      assert.deepEqual(store.getCalls, []);
      assert.deepEqual(store.deleteCalls, []);
    }

    // 6b. Explicit cleanup inside callback returns UNVERIFIED or throws FIXTURE_CLEANUP_FAILED (caught by caller):
    // scope exit preserves the fail-closed outcome and does not overwrite it with a silent scope-exit pass.
    {
      const unverifiedStore = createScopeSafetyStore({
        failPostStage: 'profile',
      });
      await assert.rejects(
        () =>
          withFixtureInvocation(async () => {
            const fixture = createFixtureState();
            await createFixture('synthetic_service_key', {
              fetchFn: unverifiedStore.fetchFn,
              fixture,
              deferCleanup: true,
            }).catch(() => {});
            const res = await cleanup('synthetic_service_key', fixture, {
              fetchFn: unverifiedStore.fetchFn,
            });
            assert.equal(res.status, 'UNVERIFIED');
            // Caller tries to ignore UNVERIFIED and return normally:
            return 'ignored-unverified';
          }),
        (err) =>
          err instanceof QaError &&
          err.code === 'FIXTURE_CLEANUP_UNVERIFIED' &&
          err.cleanupReason === 'MUTATION_OUTCOME_AMBIGUOUS',
      );

      let failId = null;
      const failedCleanupStore = createScopeSafetyStore({
        onAuthDelete: ({ authId }) => {
          failId = authId;
        },
      });
      await assert.rejects(
        () =>
          withFixtureInvocation(async () => {
            const fixture = await createFixture('synthetic_service_key', {
              fetchFn: failedCleanupStore.fetchFn,
              deferCleanup: true,
            });
            // Corrupt fixture.auth to trigger cleanup failure:
            fixture.auth = UNRELATED_AUTH_ID;
            try {
              await cleanup('synthetic_service_key', fixture, {
                fetchFn: failedCleanupStore.fetchFn,
              });
            } catch {
              // Caller swallows cleanup error and attempts to return normally:
              return 'swallowed-cleanup-failure';
            }
            return 'unexpected';
          }),
        (err) =>
          err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
      );
      assert.equal(typeof failId, 'string');
    }

    // 6c. Caller starts cleanup() without await and returns from callback:
    // scope exit awaits the in-flight cleanupPromise before invalidating the capability.
    {
      let deleteCompleted = false;
      const store = createScopeSafetyStore({
        onAuthDelete: async () => {
          await new Promise((resolve) => setTimeout(resolve, 25));
          deleteCompleted = true;
        },
      });
      let unawaitedFixture = null;
      const val = await withFixtureInvocation(async () => {
        unawaitedFixture = await createFixture('synthetic_service_key', {
          fetchFn: store.fetchFn,
          deferCleanup: true,
        });
        // Start cleanup without awaiting it!
        void cleanup('synthetic_service_key', unawaitedFixture, {
          fetchFn: store.fetchFn,
        });
        return 'returned-before-cleanup-settled';
      });
      assert.equal(val, 'returned-before-cleanup-settled');
      assert.equal(deleteCompleted, true);
      assert.equal(store.authUsers.has(unawaitedFixture.auth), false);
      assert.equal(store.appUsers.has(unawaitedFixture.profile), false);
    }

    // 7. Multiple fixtures in one standalone invocation:
    // 7a. All owned fixtures are cleaned up on scope exit.
    {
      const store = createScopeSafetyStore();
      const created = [];
      await withFixtureInvocation(async () => {
        for (let i = 0; i < 3; i += 1) {
          created.push(
            await createFixture('synthetic_service_key', {
              fetchFn: store.fetchFn,
              deferCleanup: true,
            }),
          );
        }
        assert.equal(store.authUsers.size, 4);
        assert.equal(store.appUsers.size, 4);
        assert.equal(store.orgMembers.length, 4);
      });
      for (const fix of created) {
        assert.equal(store.authUsers.has(fix.auth), false);
        assert.equal(store.appUsers.has(fix.profile), false);
      }
      assert.equal(store.authUsers.size, 1);
      assert.equal(store.appUsers.size, 1);
      assert.equal(store.orgMembers.length, 1);
    }

    // 7b. One fixture fails cleanup while another fixture in the same invocation can still be cleaned up:
    // scope exit continues to clean up all remaining owned fixtures and rejects fail-closed.
    {
      const failingAuthId = '00000000-0000-4000-8000-000000007101';
      const store = createScopeSafetyStore({
        failDeleteAuthId: failingAuthId,
      });
      let fixture1 = null;
      let fixture2 = null;
      let fixture3 = null;
      await assert.rejects(
        () =>
          withFixtureInvocation(async () => {
            fixture1 = await createFixture('synthetic_service_key', {
              fetchFn: store.fetchFn,
              deferCleanup: true,
            });
            fixture2 = await createFixture('synthetic_service_key', {
              fetchFn: store.fetchFn,
              deferCleanup: true,
            });
            fixture3 = await createFixture('synthetic_service_key', {
              fetchFn: store.fetchFn,
              deferCleanup: true,
            });
            assert.equal(fixture1.auth, failingAuthId);
          }),
        (err) => {
          assert.ok(err instanceof QaError);
          assert.equal(err.code, 'FIXTURE_CLEANUP_FAILED');
          assert.equal(err.cleanupResults?.length, 3);
          assert.equal(err.cleanupFailures?.length, 1);
          return true;
        },
      );
      // fixture2 and fixture3 WERE completely cleaned up even though fixture1's auth DELETE failed!
      assert.equal(store.authUsers.has(fixture2.auth), false);
      assert.equal(store.appUsers.has(fixture2.profile), false);
      assert.equal(store.authUsers.has(fixture3.auth), false);
      assert.equal(store.appUsers.has(fixture3.profile), false);
      // Unrelated records remain untouched.
      assert.equal(store.authUsers.has(UNRELATED_AUTH_ID), true);
      assert.equal(store.appUsers.has(UNRELATED_PROFILE_ID), true);
    }

    // 8. Scope-exit cleanup failure / unverified result when callback returned normally vs when callback also threw
    // (including strict credential redaction / non-reflection of sensitive callback error contents):
    {
      const failingAuthId = '00000000-0000-4000-8000-000000007101';
      const normalReturnFailStore = createScopeSafetyStore({
        failDeleteAuthId: failingAuthId,
      });
      await assert.rejects(
        () =>
          withFixtureInvocation(async () => {
            await createFixture('synthetic_service_key', {
              fetchFn: normalReturnFailStore.fetchFn,
              deferCleanup: true,
            });
            return 'normal-return-should-fail-closed';
          }),
        (err) =>
          err instanceof QaError &&
          err.stage === 'CLEANUP' &&
          err.code === 'FIXTURE_CLEANUP_FAILED',
      );

      const secretPassword = 'super_secret_password_value_999';
      const secretServiceKey = 'service_role_secret_token_888';
      const secretBearer = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.secret';
      const secretEmail =
        'ci-auth-99999999-8888-4777-8666-555555555555@example.test';
      const secretRawBody = '{"raw_http_body":"secret_internal_db_dump"}';

      const combinedFailStore = createScopeSafetyStore({
        failDeleteAuthId: failingAuthId,
      });
      let createdEmail = null;
      let createdPassword = null;
      await assert.rejects(
        () =>
          withFixtureInvocation(async () => {
            const fix = await createFixture(secretServiceKey, {
              fetchFn: combinedFailStore.fetchFn,
              deferCleanup: true,
            });
            createdEmail = fix.email;
            createdPassword = fix.password;
            throw new Error(
              `Callback exploded with password=${secretPassword} key=${secretServiceKey} auth=${secretBearer} email=${secretEmail} fixtureEmail=${fix.email} fixturePassword=${fix.password} body=${secretRawBody}`,
            );
          }),
        (err) => {
          assert.ok(err instanceof QaError);
          assert.equal(err.stage, 'CLEANUP');
          assert.equal(err.code, 'FIXTURE_CLEANUP_FAILED');
          assert.equal(err.details?.priorStage, 'QA_EXECUTION');
          assert.equal(err.details?.priorCode, 'QA_EXECUTION_FAILED');
          assert.deepEqual(err.callbackFailure, {
            stage: 'QA_EXECUTION',
            code: 'QA_EXECUTION_FAILED',
          });
          assert.ok(err.cause instanceof QaError);

          const serialized = `${err.message} ${err.cause?.message ?? ''} ${JSON.stringify(err)} ${inspect(err)}`;
          for (const forbidden of [
            secretPassword,
            secretServiceKey,
            secretBearer,
            secretEmail,
            secretRawBody,
            createdEmail,
            createdPassword,
          ]) {
            assert.equal(
              serialized.includes(forbidden),
              false,
              `Combined error must never leak sensitive token: ${forbidden}`,
            );
          }
          return true;
        },
      );
    }

    // 9. Multi-page auth reconciliation on scope exit (>1,000 users):
    // uncleaned auth-only and full fixtures beyond page 1 (at index 1,206) are found and deleted during automatic scope-exit cleanup.
    {
      const ac = new AbortController();
      let createdAuthId = null;
      const authOnlyMultiPageStore = createScopeSafetyStore({
        unrelatedCount: 1205,
        onAuthPost: ({ row }) => {
          createdAuthId = row.id;
          ac.abort();
        },
      });
      await assert.rejects(
        () =>
          withFixtureInvocation(async () => {
            const fixture = createFixtureState();
            try {
              await createFixture('synthetic_service_key', {
                fetchFn: authOnlyMultiPageStore.fetchFn,
                fixture,
                signal: ac.signal,
                deferCleanup: true,
              });
            } catch (err) {
              // Clear fixture.auth before rethrowing so scope-exit cleanup must find the auth-only user on page 2 via email!
              fixture.auth = null;
              throw err;
            }
          }),
        (err) =>
          err instanceof QaError && err.code === 'PROCESS_SIGNAL_TERMINATED',
      );
      assert.equal(typeof createdAuthId, 'string');
      assert.equal(authOnlyMultiPageStore.authUsers.has(createdAuthId), false);
      assert.equal(authOnlyMultiPageStore.authUsers.size, 1205);
      assert.ok(
        authOnlyMultiPageStore.listPageRequests.some((req) => req.page === 2),
      );
    }

    // 10. Cross-invocation isolation preserved during concurrent automatic scope-exit cleanups:
    // Invocation A exits early (cleaning up its own fixture automatically on scope exit) while Invocation B is still active;
    // Invocation B's fixture remains intact until B exits, and when B exits, B's fixture is also automatically cleaned up.
    {
      const sharedStore = createScopeSafetyStore();
      let fixtureA = null;
      let fixtureB = null;
      let notifyBCreated;
      const bCreated = new Promise((resolve) => {
        notifyBCreated = resolve;
      });
      let releaseB;
      const bGate = new Promise((resolve) => {
        releaseB = resolve;
      });

      const promiseB = withFixtureInvocation(async () => {
        fixtureB = await createFixture('synthetic_service_key', {
          fetchFn: sharedStore.fetchFn,
          deferCleanup: true,
        });
        notifyBCreated();
        await bGate;
        // B verifies its own resources are still present after A's scope-exit cleanup completed:
        assert.equal(sharedStore.authUsers.has(fixtureB.auth), true);
        assert.equal(sharedStore.appUsers.has(fixtureB.profile), true);
        return 'b-done';
      });

      await bCreated;

      const resA = await withFixtureInvocation(async () => {
        fixtureA = await createFixture('synthetic_service_key', {
          fetchFn: sharedStore.fetchFn,
          deferCleanup: true,
        });
        // A cannot clean up B's fixture:
        await assert.rejects(
          () =>
            cleanup('synthetic_service_key', fixtureB, {
              fetchFn: sharedStore.fetchFn,
            }),
          (err) =>
            err instanceof QaError && err.code === 'FIXTURE_CLEANUP_FAILED',
        );
        // A returns without calling cleanup on fixtureA -> scope exit cleans up fixtureA only!
        return 'a-done';
      });

      assert.equal(resA, 'a-done');
      assert.equal(sharedStore.authUsers.has(fixtureA.auth), false);
      assert.equal(sharedStore.appUsers.has(fixtureA.profile), false);
      assert.equal(sharedStore.authUsers.has(fixtureB.auth), true);
      assert.equal(sharedStore.appUsers.has(fixtureB.profile), true);

      releaseB();
      const resB = await promiseB;
      assert.equal(resB, 'b-done');
      assert.equal(sharedStore.authUsers.has(fixtureB.auth), false);
      assert.equal(sharedStore.appUsers.has(fixtureB.profile), false);
      assert.equal(sharedStore.authUsers.size, 1);
      assert.equal(sharedStore.appUsers.size, 1);
      assert.equal(sharedStore.orgMembers.length, 1);
    }

    // 11. runFixtureInvocation alias parity:
    assert.equal(runFixtureInvocation, withFixtureInvocation);
    {
      const store = createScopeSafetyStore();
      let aliasFixture = null;
      const aliasResult = await runFixtureInvocation(async () => {
        aliasFixture = await createFixture('synthetic_service_key', {
          fetchFn: store.fetchFn,
          deferCleanup: true,
        });
        return 'alias-ok';
      });
      assert.equal(aliasResult, 'alias-ok');
      assert.equal(store.authUsers.has(aliasFixture.auth), false);
      assert.equal(store.appUsers.has(aliasFixture.profile), false);
      assert.equal(
        store.orgMembers.some((m) => m.user_id === aliasFixture.profile),
        false,
      );
    }
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
