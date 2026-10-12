import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { randomBytes, randomUUID } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Never log credentials, browser request bodies, JWTs, cookie values or tokens.
const root = fileURLToPath(new URL('../', import.meta.url));
export const CANONICAL_API_ORIGIN = 'http://127.0.0.1:55431';
export const CANONICAL_APP_ORIGIN = 'http://127.0.0.1:3101';

export const EXPECTED_POSITIVE_CASE_IDS = Object.freeze([
  'AUTH-BLANK-01',
  'AUTH-INVALID-01',
  'AUTH-DENY-01',
  'AUTH-VALID-01',
  'AUTH-LOGOUT-01',
  'AUTH-AFTER-LOGOUT-01',
  'AUTH-INVALID-TOKEN-SETUP-01',
  'AUTH-INVALID-TOKEN-01',
]);

export const EXPECTED_NEGATIVE_PRE_LOGIN_CASE_IDS = Object.freeze([
  'AUTH-BLANK-01',
  'AUTH-INVALID-01',
  'AUTH-DENY-01',
]);

const SENSITIVE_VALUE_PATTERNS = [
  /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/,
  /\bsb_(?:secret|publishable)_[A-Za-z0-9_-]+\b/,
  /\bsbp_[A-Za-z0-9_-]+\b/,
  /\bBearer\s+[A-Za-z0-9._~+/=-]+\b/i,
  /\bmgbos_session\s*=\s*[^\s;,"']+/i,
  /\b(?:SUPABASE_SERVICE_ROLE_KEY|SERVICE_ROLE_KEY|ANON_KEY|NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)\s*[:=]\s*[^\s,"']+/i,
  /\bpostgres(?:ql)?:\/\/[^\s"'<>]+/i,
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
];

export class QaError extends Error {
  constructor(stage, code, message, details = {}) {
    super(message);
    this.name = 'QaError';
    this.stage = stage;
    this.code = code;
    this.details = details;
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function assertProcessAlive(proc, processName, stage) {
  if (!proc) return;
  if (proc.exitCode !== null || proc.signalCode !== null) {
    throw new QaError(
      stage,
      'CHILD_PROCESS_TERMINATED',
      `${processName} process terminated unexpectedly`,
      {
        process: processName,
        exitCode: proc.exitCode,
        signal: proc.signalCode,
      },
    );
  }
}

export async function until(fn, label, ms = 30000, { checkHealth } = {}) {
  const deadline = Date.now() + ms;
  let lastError;
  while (Date.now() < deadline) {
    if (checkHealth) {
      await checkHealth();
    }
    try {
      const result = await fn();
      if (result) return result;
    } catch (error) {
      if (error instanceof QaError) {
        throw error;
      }
      // Page navigations temporarily destroy the execution context.
      lastError = error;
    }
    if (checkHealth) {
      await checkHealth();
    }
    await sleep(250);
  }
  if (checkHealth) {
    await checkHealth();
  }
  if (lastError instanceof QaError) {
    throw lastError;
  }
  throw new Error(`Timed out: ${label}`);
}

export function parseEnvLines(text) {
  return Object.fromEntries(
    text.split(/\r?\n/).flatMap((line) => {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
      return match ? [[match[1], match[2].replace(/^"|"$/g, '')]] : [];
    }),
  );
}

export function localStatus({
  workdir = root,
  api = CANONICAL_API_ORIGIN,
  env = process.env,
  spawnSyncFn = spawnSync,
} = {}) {
  for (const key of ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_URL']) {
    if (env[key] && env[key] !== api) {
      throw new QaError(
        'LOCAL_STATUS',
        'LOCAL_STATUS_FAILED',
        'Refusing a nonlocal Supabase target',
      );
    }
  }
  const binary = path.join(
    workdir,
    'node_modules',
    'supabase',
    'dist',
    'supabase.js',
  );
  const output = spawnSyncFn(
    process.execPath,
    [binary, 'status', '-o', 'env', '--workdir', workdir],
    {
      cwd: workdir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 30000,
    },
  );
  if (output.error?.code === 'ETIMEDOUT') {
    throw new QaError(
      'LOCAL_STATUS',
      'LOCAL_STATUS_TIMED_OUT',
      'Disposable Supabase status check timed out',
    );
  }
  if (output.status !== 0) {
    throw new QaError(
      'LOCAL_STATUS',
      'LOCAL_STATUS_FAILED',
      'Disposable Supabase is unavailable',
    );
  }
  const parsed = parseEnvLines(output.stdout ?? '');
  if (parsed.API_URL !== api || !parsed.ANON_KEY || !parsed.SERVICE_ROLE_KEY) {
    throw new QaError(
      'LOCAL_STATUS',
      'LOCAL_STATUS_FAILED',
      'Local Supabase identity or keys could not be verified',
    );
  }
  if (
    parsed.DB_URL &&
    !/^postgres(?:ql)?:\/\/(?:[^@]+@)?127\.0\.0\.1:55432\//.test(parsed.DB_URL)
  ) {
    throw new QaError(
      'LOCAL_STATUS',
      'LOCAL_STATUS_FAILED',
      'Refusing nonlocal database identity',
    );
  }
  return parsed;
}

async function db(
  key,
  route,
  {
    method = 'GET',
    body,
    schema,
    api = CANONICAL_API_ORIGIN,
    fetchFn = fetch,
  } = {},
) {
  const url = new URL(`${api}${route}`);
  assert.equal(url.origin, api, 'Local Supabase access only');
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  };
  if (schema) {
    headers['Accept-Profile'] = schema;
    headers['Content-Profile'] = schema;
  }
  const response = await fetchFn(url, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    throw new Error(
      `Disposable database operation failed: HTTP ${response.status}`,
    );
  }
  return response.status === 204 ? null : response.json();
}

export async function cleanup(
  key,
  fixture,
  { api = CANONICAL_API_ORIGIN, fetchFn = fetch } = {},
) {
  if (!key || !fixture) {
    return { attempted: false, status: 'SKIPPED' };
  }
  let failed = false;
  // Each operation is independently attempted, even if an earlier deletion failed.
  const attempt = async (operation) => {
    try {
      await operation();
    } catch {
      failed = true;
    }
  };
  if (fixture.profile) {
    await attempt(() =>
      db(key, `/rest/v1/organization_members?user_id=eq.${fixture.profile}`, {
        method: 'DELETE',
        schema: 'app',
        api,
        fetchFn,
      }),
    );
    await attempt(() =>
      db(key, `/rest/v1/users?id=eq.${fixture.profile}`, {
        method: 'DELETE',
        schema: 'app',
        api,
        fetchFn,
      }),
    );
  }
  if (fixture.auth) {
    await attempt(() =>
      db(key, `/auth/v1/admin/users/${fixture.auth}`, {
        method: 'DELETE',
        api,
        fetchFn,
      }),
    );
  }
  if (fixture.profile) {
    await attempt(async () => {
      const remaining = await db(
        key,
        `/rest/v1/users?id=eq.${fixture.profile}&select=id`,
        { schema: 'app', api, fetchFn },
      );
      assert.deepEqual(remaining, [], 'Synthetic profile must be absent');
    });
  }
  if (fixture.auth) {
    await attempt(async () => {
      const response = await fetchFn(
        `${api}/auth/v1/admin/users/${fixture.auth}`,
        {
          headers: { apikey: key, Authorization: `Bearer ${key}` },
          signal: AbortSignal.timeout(15000),
        },
      );
      assert.equal(response.status, 404, 'Synthetic auth user must be absent');
    });
  }
  if (failed) {
    throw new QaError(
      'CLEANUP',
      'FIXTURE_CLEANUP_FAILED',
      'Synthetic fixture cleanup verification failed',
    );
  }
  return { attempted: true, status: 'PASS' };
}

export async function createFixture(
  key,
  { api = CANONICAL_API_ORIGIN, fetchFn = fetch } = {},
) {
  let org;
  let role;
  try {
    [org] = await db(
      key,
      '/rest/v1/organizations?select=id&status=eq.ACTIVE&limit=1',
      { schema: 'app', api, fetchFn },
    );
    assert.ok(org?.id, 'Disposable organization missing');
    [role] = await db(
      key,
      `/rest/v1/roles?select=id&organization_id=eq.${org.id}&code=eq.OWNER&limit=1`,
      { schema: 'app', api, fetchFn },
    );
    assert.ok(role?.id, 'Disposable OWNER role missing');
  } catch (error) {
    throw new QaError(
      'FIXTURE_CREATION',
      'FIXTURE_CREATION_FAILED',
      error instanceof Error ? error.message : 'Disposable seed lookup failed',
    );
  }

  const fixture = {
    email: `ci-auth-${randomUUID()}@example.test`,
    password: randomBytes(32).toString('base64url'),
    auth: null,
    profile: null,
  };
  try {
    const user = await db(key, '/auth/v1/admin/users', {
      method: 'POST',
      body: {
        email: fixture.email,
        password: fixture.password,
        email_confirm: true,
      },
      api,
      fetchFn,
    });
    fixture.auth = user.id;
    assert.ok(fixture.auth, 'Synthetic identity creation failed');
    const profiles = await db(key, '/rest/v1/users', {
      method: 'POST',
      schema: 'app',
      body: {
        auth_user_id: fixture.auth,
        name: 'CI Synthetic Operator',
        email: fixture.email,
        status: 'ACTIVE',
      },
      api,
      fetchFn,
    });
    fixture.profile = profiles[0]?.id;
    assert.ok(fixture.profile, 'Synthetic app user creation failed');
    await db(key, '/rest/v1/organization_members', {
      method: 'POST',
      schema: 'app',
      body: {
        organization_id: org.id,
        user_id: fixture.profile,
        role_id: role.id,
        status: 'ACTIVE',
      },
      api,
      fetchFn,
    });
    return fixture;
  } catch (error) {
    await cleanup(key, fixture, { api, fetchFn }).catch(() => {});
    throw new QaError(
      'FIXTURE_CREATION',
      'FIXTURE_CREATION_FAILED',
      error instanceof Error
        ? error.message
        : 'Synthetic fixture creation failed',
    );
  }
}

class Cdp {
  constructor(url, { app = CANONICAL_APP_ORIGIN } = {}) {
    this.url = url;
    this.app = app;
    this.id = 0;
    this.pending = new Map();
    this.requests = [];
    this.closed = false;
    this.closeReason = null;
  }

  async connect() {
    this.ws = new WebSocket(this.url);
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(
          new QaError(
            'BROWSER_START',
            'CDP_CONNECT_TIMED_OUT',
            'Timed out connecting to Chromium DevTools WebSocket',
          ),
        );
      }, 15000);
      this.ws.addEventListener(
        'open',
        () => {
          clearTimeout(timer);
          resolve();
        },
        { once: true },
      );
      this.ws.addEventListener(
        'error',
        () => {
          clearTimeout(timer);
          reject(
            new QaError(
              'BROWSER_START',
              'CDP_SOCKET_ERROR',
              'Chromium DevTools WebSocket connection error',
            ),
          );
        },
        { once: true },
      );
    });

    this.ws.addEventListener('message', (event) => {
      let packet;
      try {
        packet = JSON.parse(String(event.data));
      } catch {
        return;
      }
      if (packet.method === 'Network.requestWillBeSent') {
        try {
          const url = new URL(packet.params.request.url);
          if (url.origin === this.app) {
            this.requests.push({
              method: packet.params.request.method,
              path: url.pathname,
            });
          }
        } catch {
          // Non-HTTP events are not stored.
        }
      }
      if (!packet.id) return;
      const pending = this.pending.get(packet.id);
      if (!pending) return;
      clearTimeout(pending.timer);
      this.pending.delete(packet.id);
      if (packet.error) {
        pending.reject(new Error(`CDP command failed: ${pending.method}`));
      } else {
        pending.resolve(packet.result);
      }
    });

    const markClosed = (reason) => {
      this.closed = true;
      this.closeReason = this.closeReason ?? reason;
      for (const [, entry] of this.pending) {
        clearTimeout(entry.timer);
        entry.reject(
          new QaError(
            'BROWSER_AUTH',
            'CDP_CONNECTION_CLOSED',
            `Chromium DevTools connection closed (${this.closeReason})`,
          ),
        );
      }
      this.pending.clear();
    };

    this.ws.addEventListener('close', () => markClosed('socket_close'));
    this.ws.addEventListener('error', () => markClosed('socket_error'));

    await this.send('Page.enable');
    await this.send('Runtime.enable');
    await this.send('Network.enable');
  }

  assertConnected(stage = 'BROWSER_AUTH') {
    if (this.closed) {
      throw new QaError(
        stage,
        'CDP_CONNECTION_CLOSED',
        `Chromium DevTools connection closed (${this.closeReason ?? 'closed'})`,
      );
    }
  }

  send(method, params = {}) {
    this.assertConnected();
    return new Promise((resolve, reject) => {
      const id = ++this.id;
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(
          new QaError(
            'BROWSER_AUTH',
            'CDP_COMMAND_TIMED_OUT',
            `Browser protocol timed out: ${method}`,
            { cdpMethod: method },
          ),
        );
      }, 15000);
      this.pending.set(id, { method, resolve, reject, timer });
      try {
        this.ws.send(JSON.stringify({ id, method, params }));
      } catch {
        clearTimeout(timer);
        this.pending.delete(id);
        reject(
          new QaError(
            'BROWSER_AUTH',
            'CDP_CONNECTION_CLOSED',
            `Failed to send CDP command: ${method}`,
            { cdpMethod: method },
          ),
        );
      }
    });
  }

  async eval(expression) {
    const response = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (response.exceptionDetails) {
      throw new Error('Browser assertion expression failed');
    }
    return response.result?.value;
  }

  async goto(route, expected = route, { checkHealth } = {}) {
    const before = await this.eval('performance.timeOrigin');
    await this.send('Page.navigate', { url: `${this.app}${route}` });
    await until(
      async () => {
        const state = await this.eval(`({
          route: location.pathname,
          origin: performance.timeOrigin,
          ready: document.readyState
        })`);
        return (
          state.origin !== before &&
          state.route === expected &&
          state.ready !== 'loading'
        );
      },
      `Navigation ${route}`,
      30000,
      { checkHealth },
    );
  }

  posts(route) {
    return this.requests.filter(
      (request) => request.method === 'POST' && request.path === route,
    ).length;
  }

  async session() {
    const response = await this.send('Network.getCookies', {
      urls: [this.app],
    });
    return response.cookies
      .filter((cookie) => cookie.name === 'mgbos_session')
      .map((cookie) => ({
        httpOnly: cookie.httpOnly,
        sameSite: cookie.sameSite,
        secure: cookie.secure,
      }));
  }

  async screenshot(file) {
    const { data } = await this.send('Page.captureScreenshot', {
      format: 'png',
    });
    writeFileSync(file, Buffer.from(data, 'base64'));
  }

  close() {
    this.closed = true;
    this.closeReason = this.closeReason ?? 'explicit_close';
    for (const [, entry] of this.pending) {
      clearTimeout(entry.timer);
    }
    this.pending.clear();
    try {
      this.ws?.close();
    } catch {
      // Ignore close errors during teardown.
    }
  }
}

function chromeExecutable() {
  for (const name of [
    process.env.CHROME_BIN,
    process.env.CHROME_PATH,
    'google-chrome',
    'google-chrome-stable',
    'chromium',
    'chromium-browser',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ]) {
    if (!name) continue;
    if (process.platform !== 'win32') {
      const probe = spawnSync('which', [name], { encoding: 'utf8' });
      if (probe.status === 0) return probe.stdout.trim();
    }
    if (existsSync(name)) return name;
  }
  throw new QaError(
    'BROWSER_START',
    'BROWSER_START_FAILED',
    'Chromium is unavailable in isolated QA runner',
  );
}

export async function startBrowser({
  app = CANONICAL_APP_ORIGIN,
  spawnFn = spawn,
  fetchFn = fetch,
} = {}) {
  const profile = mkdtempSync(path.join(tmpdir(), 'mgbos-ci-cdp-'));
  const browser = spawnFn(
    chromeExecutable(),
    [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--no-first-run',
      '--disable-background-networking',
      '--remote-debugging-address=127.0.0.1',
      '--remote-debugging-port=0',
      '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE localhost, EXCLUDE 127.0.0.1',
      `--user-data-dir=${profile}`,
      'about:blank',
    ],
    {
      stdio: 'ignore',
      detached: process.platform !== 'win32',
    },
  );
  try {
    const filename = path.join(profile, 'DevToolsActivePort');
    const port = await until(
      () => {
        if (browser.exitCode !== null || browser.signalCode !== null) {
          throw new QaError(
            'BROWSER_START',
            'BROWSER_START_FAILED',
            'Headless Chromium exited before DevTools endpoint became ready',
            {
              process: 'browser',
              exitCode: browser.exitCode,
              signal: browser.signalCode,
            },
          );
        }
        return existsSync(filename)
          ? Number(readFileSync(filename, 'utf8').split('\n')[0])
          : false;
      },
      'Local browser debugging endpoint',
      20000,
    );
    const response = await fetchFn(
      `http://127.0.0.1:${port}/json/new?${encodeURIComponent(`${app}/login`)}`,
      { method: 'PUT' },
    );
    assert.ok(response.ok, 'Browser debugging target unavailable');
    const target = await response.json();
    assert.ok(
      target.webSocketDebuggerUrl?.startsWith('ws://127.0.0.1:'),
      'Browser debugging must bind to loopback',
    );
    const cdp = new Cdp(target.webSocketDebuggerUrl, { app });
    await cdp.connect();
    return { browser, cdp, profile };
  } catch (error) {
    await terminateSubprocess(browser, {
      initialSignal: 'SIGTERM',
      forceSignal: 'SIGKILL',
      graceMs: 2000,
    }).catch(() => {});
    try {
      rmSync(profile, {
        recursive: true,
        force: true,
        maxRetries: 5,
        retryDelay: 100,
      });
    } catch {
      // Best-effort cleanup on failed browser startup.
    }
    if (error instanceof QaError) {
      throw error;
    }
    throw new QaError(
      'BROWSER_START',
      'BROWSER_START_FAILED',
      error instanceof Error
        ? error.message
        : 'Headless Chromium failed to initialize DevTools session',
    );
  }
}

export async function terminateSubprocess(
  proc,
  { initialSignal = 'SIGTERM', forceSignal = 'SIGKILL', graceMs = 3000 } = {},
) {
  if (!proc) {
    return { terminated: true, forced: false };
  }
  if (proc.exitCode !== null || proc.signalCode !== null) {
    return { terminated: true, forced: false };
  }

  const waitForProcessExit = (timeoutMs) =>
    new Promise((resolve) => {
      if (proc.exitCode !== null || proc.signalCode !== null) {
        resolve(true);
        return;
      }
      let settled = false;
      const done = (exited) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        proc.removeListener?.('exit', onExit);
        proc.removeListener?.('close', onExit);
        resolve(exited);
      };
      const onExit = () => done(true);
      const timer = setTimeout(() => done(false), timeoutMs);
      proc.once?.('exit', onExit);
      proc.once?.('close', onExit);
    });

  const sendKill = (signal) => {
    if (
      process.platform !== 'win32' &&
      typeof proc.pid === 'number' &&
      proc.pid > 0
    ) {
      try {
        process.kill(-proc.pid, signal);
        return;
      } catch {
        // Fall back to direct child kill if process group kill is unavailable.
      }
    }
    if (
      process.platform === 'win32' &&
      typeof proc.pid === 'number' &&
      proc.pid > 0
    ) {
      spawnSync('taskkill', ['/PID', String(proc.pid), '/T', '/F'], {
        stdio: 'ignore',
        timeout: 5000,
      });
    }
    try {
      proc.kill(signal);
    } catch {
      // Ignore if already exited.
    }
  };

  sendKill(initialSignal);
  const exitedGracefully = await waitForProcessExit(graceMs);
  if (exitedGracefully) {
    return { terminated: true, forced: false };
  }

  sendKill(forceSignal);
  const exitedAfterForce = await waitForProcessExit(graceMs);
  return {
    terminated:
      exitedAfterForce || proc.exitCode !== null || proc.signalCode !== null,
    forced: true,
  };
}

export function assertSanitizedEvidence(evidence, forbiddenValues = []) {
  const serialized = JSON.stringify(evidence);
  if (typeof serialized !== 'string' || serialized.length === 0) {
    throw new QaError(
      'ARTIFACT_WRITE',
      'ARTIFACT_SERIALIZATION_FAILED',
      'Evidence payload could not be serialized to JSON',
    );
  }
  const dynamicForbidden = forbiddenValues.filter(
    (value) => typeof value === 'string' && value.trim().length >= 6,
  );
  for (const secret of dynamicForbidden) {
    if (serialized.includes(secret)) {
      throw new QaError(
        'ARTIFACT_WRITE',
        'ARTIFACT_SENSITIVE_DATA_BLOCKED',
        'Refusing to persist evidence containing runtime credential material',
      );
    }
  }
  for (const pattern of SENSITIVE_VALUE_PATTERNS) {
    if (pattern.test(serialized)) {
      throw new QaError(
        'ARTIFACT_WRITE',
        'ARTIFACT_SENSITIVE_DATA_BLOCKED',
        'Refusing to persist evidence matching sensitive credential pattern',
      );
    }
  }
  return serialized;
}

export function writeSanitizedTrace(
  tracePath,
  evidence,
  {
    forbiddenValues = [],
    writeFileSyncFn = writeFileSync,
    renameSyncFn = renameSync,
    readFileSyncFn = readFileSync,
    rmSyncFn = rmSync,
  } = {},
) {
  const serialized = `${assertSanitizedEvidence(evidence, forbiddenValues)}\n`;
  const dir = path.dirname(tracePath);
  mkdirSync(dir, { recursive: true });
  const tempPath = `${tracePath}.tmp-${process.pid}-${Date.now()}-${randomUUID().slice(0, 8)}`;
  try {
    writeFileSyncFn(tempPath, serialized, 'utf8');
    renameSyncFn(tempPath, tracePath);
  } catch {
    try {
      rmSyncFn(tempPath, { force: true });
    } catch {
      // Ignore temp file cleanup error.
    }
    throw new QaError(
      'ARTIFACT_WRITE',
      'TRACE_WRITE_FAILED',
      'Failed to atomically write sanitized trace artifact',
    );
  }

  let verifiedText;
  try {
    verifiedText = readFileSyncFn(tracePath, 'utf8');
  } catch {
    throw new QaError(
      'ARTIFACT_WRITE',
      'TRACE_READBACK_FAILED',
      'Failed to read back trace artifact after write',
    );
  }
  try {
    const parsed = JSON.parse(verifiedText);
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.cases)) {
      throw new Error('Malformed trace payload');
    }
  } catch {
    throw new QaError(
      'ARTIFACT_WRITE',
      'TRACE_CORRUPT_AFTER_WRITE',
      'Trace artifact readback validation failed',
    );
  }
}

export function classifyFailure(stage, error) {
  if (error instanceof QaError) {
    const resolvedStage = error.stage || stage;
    const result = {
      stage: resolvedStage,
      code: error.code,
    };
    if (typeof error.details?.process === 'string') {
      result.process = error.details.process;
    }
    if (
      typeof error.details?.exitCode === 'number' ||
      error.details?.exitCode === null
    ) {
      if (error.details.exitCode !== undefined) {
        result.exitCode = error.details.exitCode;
      }
    }
    if (
      typeof error.details?.signal === 'string' &&
      error.details.signal.length > 0
    ) {
      result.signal = error.details.signal;
    }
    if (typeof error.details?.failedCaseId === 'string') {
      result.failedCaseId = error.details.failedCaseId;
    }
    if (typeof error.details?.priorStage === 'string') {
      result.priorStage = error.details.priorStage;
    }
    if (typeof error.details?.priorCode === 'string') {
      result.priorCode = error.details.priorCode;
    }
    return result;
  }

  const message = error instanceof Error ? error.message : '';
  const code =
    message === 'Timed out: Authenticated dashboard'
      ? 'AUTH_VALID_LOGIN_DID_NOT_COMPLETE'
      : message === 'Timed out: Invalid login error'
        ? 'AUTH_INVALID_LOGIN_ERROR_NOT_SHOWN'
        : message === 'Timed out: Login form'
          ? 'AUTH_LOGIN_FORM_TIMEOUT'
          : message === 'Timed out: Logout'
            ? 'AUTH_LOGOUT_TIMEOUT'
            : message === 'Timed out: Local MGBOS health'
              ? 'APP_START_TIMED_OUT'
              : message === 'Timed out: Local browser debugging endpoint'
                ? 'BROWSER_START_TIMED_OUT'
                : message.startsWith('Timed out: Navigation ')
                  ? 'BROWSER_NAVIGATION_TIMED_OUT'
                  : message.startsWith(
                        'Authentication invariant not satisfied:',
                      )
                    ? 'AUTH_ASSERTION_FAILED'
                    : stage === 'APP_BUILD'
                      ? 'BUILD_FAILED'
                      : stage === 'FIXTURE_CREATION'
                        ? 'FIXTURE_CREATION_FAILED'
                        : 'QA_EXECUTION_FAILED';
  return { stage, code };
}

function recordResult(cases, caseId, passed, proof = {}) {
  cases.push({
    caseId,
    verdict: passed ? 'PASS' : 'FAIL',
    timestamp: new Date().toISOString(),
    proof,
  });
  if (!passed) {
    throw new QaError(
      'BROWSER_AUTH',
      'AUTH_ASSERTION_FAILED',
      `Authentication invariant not satisfied: ${caseId}`,
      { failedCaseId: caseId },
    );
  }
}

export async function runBrowser(
  cdp,
  fixture,
  {
    cases,
    artifactDir,
    negativeControl = false,
    app = CANONICAL_APP_ORIGIN,
    checkHealth,
    loginTimeoutMs = 30000,
  },
) {
  const ensureHealthy = async () => {
    if (checkHealth) await checkHealth();
    if (typeof cdp.assertConnected === 'function') {
      cdp.assertConnected('BROWSER_AUTH');
    }
  };

  await ensureHealthy();
  await cdp.send('Network.clearBrowserCookies');
  await cdp.goto('/login', '/login', { checkHealth: ensureHealthy });
  await until(
    () => cdp.eval('Boolean(document.querySelector(\'input[name="email"]\'))'),
    'Login form',
    30000,
    { checkHealth: ensureHealthy },
  );

  const empty = await cdp.eval(`(() => {
    const email = document.querySelector('input[name="email"]');
    const password = document.querySelector('input[name="password"]');
    return Boolean(email && password &&
      email.value === '' && password.value === '' &&
      !email.hasAttribute('value') && !password.hasAttribute('value') &&
      email.required && password.required &&
      !document.querySelector('.auth-card footer'));
  })()`);
  recordResult(
    cases,
    'AUTH-BLANK-01',
    empty && (await cdp.session()).length === 0,
    {
      route: '/login',
      emptyInputs: empty,
    },
  );
  await cdp.screenshot(path.join(artifactDir, 'anonymous-login.png'));

  const submit = async (email, password) => {
    await cdp.eval(`(() => {
      const form = document.querySelector('form');
      const put = (name, value) => {
        const input = form.querySelector('[name="' + name + '"]');
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')
          .set.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      };
      put('email', ${JSON.stringify(email)});
      put('password', ${JSON.stringify(password)});
      form.requestSubmit(form.querySelector('button[type="submit"]'));
      return true;
    })()`);
  };

  const invalidPosts = cdp.posts('/login');
  await submit('ci-invalid@example.test', randomUUID());
  await until(
    () =>
      cdp.eval(
        'location.pathname === "/login" && Boolean(document.querySelector(\'[role="alert"]\'))',
      ),
    'Invalid login error',
    30000,
    { checkHealth: ensureHealthy },
  );
  const invalidPostObserved = cdp.posts('/login') > invalidPosts;
  recordResult(
    cases,
    'AUTH-INVALID-01',
    invalidPostObserved && (await cdp.session()).length === 0,
    { route: '/login', formPostObserved: invalidPostObserved },
  );

  for (const route of ['/dashboard', '/orders', '/exceptions']) {
    await cdp.goto(route, '/login', { checkHealth: ensureHealthy });
  }
  recordResult(cases, 'AUTH-DENY-01', (await cdp.session()).length === 0, {
    routes: ['/dashboard', '/orders', '/exceptions'],
    finalRoute: '/login',
  });

  const validPosts = cdp.posts('/login');
  await submit(
    fixture.email,
    negativeControl ? `${fixture.password}${randomUUID()}` : fixture.password,
  );
  try {
    await until(
      async () => {
        const state = await cdp.eval(`({
          pathname: location.pathname,
          ready: document.readyState,
          authenticated:
            location.pathname === "/dashboard" &&
            document.body.innerText.includes("CI Synthetic Operator"),
          rejectedOnLogin:
            location.pathname === "/login" &&
            document.readyState !== "loading" &&
            Boolean(document.querySelector('[role="alert"]'))
        })`);
        if (state && typeof state === 'object') {
          if (state.authenticated) return true;
          if (cdp.posts('/login') > validPosts && state.rejectedOnLogin) {
            const rejectedSession = await cdp.session();
            cases.push({
              caseId: 'AUTH-VALID-01',
              verdict: 'FAIL',
              timestamp: new Date().toISOString(),
              proof: {
                route: '/login',
                formPostObserved: true,
                sessionCookiePresent: rejectedSession.length === 1,
                httpOnly: rejectedSession[0]?.httpOnly === true,
                sameSiteLax: rejectedSession[0]?.sameSite === 'Lax',
              },
            });
            throw new QaError(
              'BROWSER_AUTH',
              'AUTH_VALID_LOGIN_DID_NOT_COMPLETE',
              'Timed out: Authenticated dashboard',
            );
          }
        }
        return Boolean(state === true);
      },
      'Authenticated dashboard',
      loginTimeoutMs,
      { checkHealth: ensureHealthy },
    );
  } catch (error) {
    if (error instanceof QaError) {
      throw error;
    }
    await ensureHealthy();
    const validPostObserved = cdp.posts('/login') > validPosts;
    const currentSession = await cdp.session();
    if (!validPostObserved) {
      throw new QaError(
        'BROWSER_AUTH',
        'AUTH_LOGIN_POST_NOT_OBSERVED',
        'Login form submission was not observed before dashboard timeout',
      );
    }
    cases.push({
      caseId: 'AUTH-VALID-01',
      verdict: 'FAIL',
      timestamp: new Date().toISOString(),
      proof: {
        route: '/login',
        formPostObserved: true,
        sessionCookiePresent: currentSession.length === 1,
        httpOnly: currentSession[0]?.httpOnly === true,
        sameSiteLax: currentSession[0]?.sameSite === 'Lax',
      },
    });
    throw new QaError(
      'BROWSER_AUTH',
      'AUTH_VALID_LOGIN_DID_NOT_COMPLETE',
      'Timed out: Authenticated dashboard',
    );
  }

  const session = await cdp.session();
  const validPostObserved = cdp.posts('/login') > validPosts;
  recordResult(
    cases,
    'AUTH-VALID-01',
    validPostObserved &&
      session.length === 1 &&
      session[0].httpOnly === true &&
      session[0].sameSite === 'Lax',
    {
      route: '/dashboard',
      formPostObserved: validPostObserved,
      sessionCookiePresent: session.length === 1,
      httpOnly: session[0]?.httpOnly === true,
      sameSiteLax: session[0]?.sameSite === 'Lax',
    },
  );

  const logoutPosts = cdp.posts('/dashboard');
  const pressed = await cdp.eval(`(() => {
    const form = [...document.querySelectorAll('form')].find(
      (item) => item.querySelector('button')?.textContent?.includes('Keluar'),
    );
    if (!form) return false;
    form.requestSubmit();
    return true;
  })()`);
  if (!pressed) {
    throw new QaError(
      'BROWSER_AUTH',
      'AUTH_ASSERTION_FAILED',
      'Authentication invariant not satisfied: AUTH-LOGOUT-01',
      { failedCaseId: 'AUTH-LOGOUT-01' },
    );
  }
  await until(
    () => cdp.eval('location.pathname === "/login"'),
    'Logout',
    30000,
    {
      checkHealth: ensureHealthy,
    },
  );
  const logoutPostObserved = cdp.posts('/dashboard') > logoutPosts;
  recordResult(
    cases,
    'AUTH-LOGOUT-01',
    logoutPostObserved && (await cdp.session()).length === 0,
    { route: '/login', logoutPostObserved, sessionCookiePresent: false },
  );

  await cdp.goto('/dashboard', '/login', { checkHealth: ensureHealthy });
  recordResult(
    cases,
    'AUTH-AFTER-LOGOUT-01',
    (await cdp.session()).length === 0,
    {
      finalRoute: '/login',
    },
  );

  // Invalid token rejection is not proof of revoking an earlier valid JWT.
  const invalidToken = `ci-invalid-${randomUUID()}`;
  const inserted = await cdp.send('Network.setCookie', {
    name: 'mgbos_session',
    value: invalidToken,
    url: app,
    httpOnly: true,
    sameSite: 'Lax',
    secure: false,
  });
  const cookieJar = await cdp.send('Network.getCookies', { urls: [app] });
  const cookieInstalled =
    inserted.success === true &&
    cookieJar.cookies.some(
      (cookie) =>
        cookie.name === 'mgbos_session' && cookie.value === invalidToken,
    );
  // Cookie values must never be retained in traces or console output.
  recordResult(cases, 'AUTH-INVALID-TOKEN-SETUP-01', cookieInstalled, {
    testCookieInstalled: cookieInstalled,
  });
  await cdp.goto('/dashboard', '/login', { checkHealth: ensureHealthy });
  recordResult(
    cases,
    'AUTH-INVALID-TOKEN-01',
    await cdp.eval('location.pathname === "/login"'),
    { finalRoute: '/login', priorValidJwtRevocationTested: false },
  );
  await cdp.send('Network.clearBrowserCookies');
}

export function validateTraceReport(report, { expectedMode, exitStatus } = {}) {
  if (!report || typeof report !== 'object' || Array.isArray(report)) {
    return {
      valid: false,
      code: 'TRACE_CORRUPT',
      summary: 'Trace report is not a JSON object',
      diagnostics: {},
    };
  }

  try {
    assertSanitizedEvidence(report);
  } catch (error) {
    return {
      valid: false,
      code: 'TRACE_SENSITIVE_DATA_DETECTED',
      summary:
        error instanceof Error
          ? error.message
          : 'Sensitive pattern detected in trace report',
      diagnostics: { mode: report.mode ?? null },
    };
  }

  const diagnostics = {
    mode: report.mode ?? null,
    overall: report.overall ?? null,
    stage: report.stage ?? null,
    failureStage: report.failure?.stage ?? null,
    failureCode: report.failure?.code ?? null,
    process: report.failure?.process ?? null,
    exitCode: report.failure?.exitCode ?? null,
    signal: report.failure?.signal ?? null,
    cleanupStatus: report.cleanup?.status ?? null,
    casesRecorded: Array.isArray(report.cases) ? report.cases.length : null,
    exitStatus: exitStatus ?? null,
  };

  if (
    typeof report.checkoutSha !== 'string' ||
    report.checkoutSha.trim().length === 0 ||
    !Array.isArray(report.cases)
  ) {
    return {
      valid: false,
      code: 'TRACE_CORRUPT',
      summary: 'Trace report is missing required provenance or cases structure',
      diagnostics,
    };
  }

  if (report.overall === 'INCOMPLETE') {
    return {
      valid: false,
      code: 'TRACE_INCOMPLETE_OR_ABORTED',
      summary: 'Trace report indicates an incomplete or aborted execution',
      diagnostics,
    };
  }

  if (expectedMode && report.mode !== expectedMode) {
    return {
      valid: false,
      code: 'TRACE_MODE_MISMATCH',
      summary: `Expected trace mode "${expectedMode}", got "${String(report.mode)}"`,
      diagnostics,
    };
  }

  if (report.failure?.code === 'FIXTURE_CLEANUP_FAILED') {
    return {
      valid: false,
      code: 'FIXTURE_CLEANUP_NOT_VERIFIED',
      summary: `Expected fixture cleanup status PASS, got "${String(report.cleanup?.status)}"`,
      diagnostics,
    };
  }

  if (report.failure?.code === 'SUBPROCESS_TEARDOWN_FAILED') {
    return {
      valid: false,
      code: 'SUBPROCESS_TEARDOWN_NOT_VERIFIED',
      summary:
        'Subprocess or temporary profile teardown did not complete cleanly',
      diagnostics,
    };
  }

  const verifyCleanupAndTeardown = () => {
    if (report.cleanup?.status !== 'PASS') {
      return {
        valid: false,
        code: 'FIXTURE_CLEANUP_NOT_VERIFIED',
        summary: `Expected fixture cleanup status PASS, got "${String(report.cleanup?.status)}"`,
        diagnostics,
      };
    }
    if (
      report.cleanup?.browserTerminated !== true ||
      report.cleanup?.applicationTerminated !== true ||
      report.cleanup?.profileRemoved !== true
    ) {
      return {
        valid: false,
        code: 'SUBPROCESS_TEARDOWN_NOT_VERIFIED',
        summary:
          'Subprocess or temporary profile teardown did not complete cleanly',
        diagnostics,
      };
    }
    return null;
  };

  if (expectedMode === 'normal') {
    if (exitStatus !== undefined && exitStatus !== 0) {
      return {
        valid: false,
        code: 'POSITIVE_EXIT_STATUS_NONZERO',
        summary: `Positive browser-auth run exited with status ${exitStatus}`,
        diagnostics,
      };
    }
    if (report.overall !== 'PASS' || report.failure !== undefined) {
      return {
        valid: false,
        code: 'POSITIVE_RUN_FAILED',
        summary: 'Positive browser-auth trace did not record overall PASS',
        diagnostics,
      };
    }
    const cleanupErr = verifyCleanupAndTeardown();
    if (cleanupErr) return cleanupErr;
    const caseIds = report.cases.map((item) => item?.caseId);
    const allPassed =
      caseIds.length === EXPECTED_POSITIVE_CASE_IDS.length &&
      EXPECTED_POSITIVE_CASE_IDS.every(
        (id, index) =>
          caseIds[index] === id && report.cases[index]?.verdict === 'PASS',
      );
    if (!allPassed) {
      return {
        valid: false,
        code: 'POSITIVE_CASES_INCOMPLETE',
        summary: 'Positive browser-auth trace is missing required PASS cases',
        diagnostics,
      };
    }
    return {
      valid: true,
      code: 'POSITIVE_TRACE_VERIFIED',
      summary: 'Positive browser-auth trace verified',
      diagnostics,
    };
  }

  if (expectedMode === 'intentional-broken-login') {
    if (exitStatus !== undefined && exitStatus === 0) {
      return {
        valid: false,
        code: 'NEGATIVE_CONTROL_UNEXPECTED_ZERO_EXIT',
        summary: 'Intentional broken-login control unexpectedly exited 0',
        diagnostics,
      };
    }
    if (report.overall !== 'FAIL') {
      return {
        valid: false,
        code: 'NEGATIVE_CONTROL_OVERALL_MISMATCH',
        summary: `Expected negative-control overall FAIL, got "${String(report.overall)}"`,
        diagnostics,
      };
    }
    if (
      report.failure?.stage !== 'BROWSER_AUTH' ||
      report.failure?.code !== 'AUTH_VALID_LOGIN_DID_NOT_COMPLETE'
    ) {
      return {
        valid: false,
        code: 'NEGATIVE_CONTROL_CLASSIFICATION_MISMATCH',
        summary: `Expected BROWSER_AUTH/AUTH_VALID_LOGIN_DID_NOT_COMPLETE, got stage=${String(report.failure?.stage)} code=${String(report.failure?.code)}`,
        diagnostics,
      };
    }
    const cleanupErr = verifyCleanupAndTeardown();
    if (cleanupErr) return cleanupErr;
    const expectedIds = [
      ...EXPECTED_NEGATIVE_PRE_LOGIN_CASE_IDS,
      'AUTH-VALID-01',
    ];
    const actualIds = report.cases.map((item) => item?.caseId);
    const preLoginPassed =
      actualIds.length === expectedIds.length &&
      EXPECTED_NEGATIVE_PRE_LOGIN_CASE_IDS.every(
        (id, index) =>
          actualIds[index] === id && report.cases[index]?.verdict === 'PASS',
      );
    const validLoginCase = report.cases[3];
    const validLoginRejected =
      validLoginCase?.caseId === 'AUTH-VALID-01' &&
      validLoginCase?.verdict === 'FAIL' &&
      validLoginCase?.proof?.formPostObserved === true &&
      validLoginCase?.proof?.sessionCookiePresent === false;
    if (!preLoginPassed || !validLoginRejected) {
      return {
        valid: false,
        code: 'NEGATIVE_CONTROL_CASE_PROVENANCE_MISMATCH',
        summary:
          'Negative-control trace did not prove pre-login PASS cases followed by AUTH-VALID-01 form-post rejection',
        diagnostics,
      };
    }
    return {
      valid: true,
      code: 'NEGATIVE_CONTROL_TRACE_VERIFIED',
      summary:
        'Negative-control verified: broken login is rejected by the harness for the expected reason',
      diagnostics,
    };
  }

  return {
    valid: false,
    code: 'UNSUPPORTED_EXPECTED_MODE',
    summary: `Unsupported expectedMode "${String(expectedMode)}"`,
    diagnostics,
  };
}

export function verifyTraceFile(
  tracePath,
  { expectedMode, exitStatus, readFileSyncFn = readFileSync } = {},
) {
  if (!existsSync(tracePath)) {
    return {
      valid: false,
      code: 'TRACE_MISSING',
      summary: `Trace artifact is missing at ${tracePath}`,
      diagnostics: { tracePath, exitStatus: exitStatus ?? null },
    };
  }
  let raw;
  try {
    raw = readFileSyncFn(tracePath, 'utf8');
  } catch {
    return {
      valid: false,
      code: 'TRACE_UNREADABLE',
      summary: `Trace artifact could not be read at ${tracePath}`,
      diagnostics: { tracePath, exitStatus: exitStatus ?? null },
    };
  }
  if (typeof raw !== 'string' || raw.trim().length === 0) {
    return {
      valid: false,
      code: 'TRACE_CORRUPT',
      summary: `Trace artifact is empty at ${tracePath}`,
      diagnostics: { tracePath, exitStatus: exitStatus ?? null },
    };
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      valid: false,
      code: 'TRACE_CORRUPT',
      summary: `Trace artifact is not valid JSON at ${tracePath}`,
      diagnostics: { tracePath, exitStatus: exitStatus ?? null },
    };
  }
  return validateTraceReport(parsed, { expectedMode, exitStatus });
}

function defaultBuildApp({ env, workdir = root, spawnSyncFn = spawnSync }) {
  const build = spawnSyncFn('pnpm', ['--filter', '@mgbos/app', 'build'], {
    cwd: workdir,
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

async function defaultStartApp({
  env,
  workdir = root,
  app = CANONICAL_APP_ORIGIN,
  spawnFn = spawn,
  fetchFn = fetch,
}) {
  try {
    const staleProbe = await fetchFn(`${app}/health`, {
      signal: AbortSignal.timeout(1000),
    });
    if (staleProbe.ok) {
      throw new QaError(
        'APP_START',
        'APP_PORT_ALREADY_IN_USE',
        'Application port 3101 is already serving responses before startup',
      );
    }
  } catch (error) {
    if (error instanceof QaError) throw error;
    // Expected when no prior server is listening on port 3101.
  }

  const application = spawnFn('pnpm', ['--filter', '@mgbos/app', 'start'], {
    cwd: workdir,
    env,
    stdio: 'ignore',
    detached: process.platform !== 'win32',
    shell: process.platform === 'win32',
  });
  await until(
    async () => {
      if (application.exitCode !== null || application.signalCode !== null) {
        throw new QaError(
          'APP_START',
          'APP_START_FAILED',
          'Application server exited during startup',
          {
            process: 'application',
            exitCode: application.exitCode,
            signal: application.signalCode,
          },
        );
      }
      const response = await fetchFn(`${app}/health`, {
        signal: AbortSignal.timeout(1500),
      });
      return response.ok;
    },
    'Local MGBOS health',
    30000,
  );
  return application;
}

export async function runQaHarness({
  workdir = root,
  api = CANONICAL_API_ORIGIN,
  app = CANONICAL_APP_ORIGIN,
  negativeControl = process.env.MGBOS_QA_NEGATIVE_CONTROL === '1',
  artifactDir = path.join(
    workdir,
    '.qa-evidence',
    'browser-auth',
    negativeControl ? 'negative-control' : 'positive',
  ),
  localStatusFn = localStatus,
  buildAppFn = defaultBuildApp,
  createFixtureFn = createFixture,
  startAppFn = defaultStartApp,
  startBrowserFn = startBrowser,
  runBrowserFn = runBrowser,
  cleanupFn = cleanup,
  terminateSubprocessFn = terminateSubprocess,
  writeFileSyncFn = writeFileSync,
  renameSyncFn = renameSync,
  readFileSyncFn = readFileSync,
  rmSyncFn = rmSync,
  loginTimeoutMs = 30000,
} = {}) {
  mkdirSync(artifactDir, { recursive: true });
  const tracePath = path.join(artifactDir, 'trace.json');
  const git = spawnSync('git', ['rev-parse', 'HEAD'], {
    cwd: workdir,
    encoding: 'utf8',
    timeout: 5000,
  });
  const cases = [];
  const evidence = {
    checkoutSha: git.status === 0 ? git.stdout.trim() : 'unknown',
    ciEventSha: process.env.GITHUB_SHA ?? null,
    cases,
    mode: negativeControl ? 'intentional-broken-login' : 'normal',
    stage: 'STARTUP',
    failure: {
      stage: 'STARTUP',
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
  };

  let localKey;
  let anonKey;
  let fixture;
  let application;
  let browser;
  let failure = false;
  let stage = 'LOCAL_STATUS';

  const getForbiddenValues = () => [
    localKey,
    anonKey,
    fixture?.password,
    fixture?.email,
  ];

  const persistTraceCheckpoint = () => {
    writeSanitizedTrace(tracePath, evidence, {
      forbiddenValues: getForbiddenValues(),
      writeFileSyncFn,
      renameSyncFn,
      readFileSyncFn,
      rmSyncFn,
    });
  };

  const enterStage = (nextStage) => {
    stage = nextStage;
    evidence.stage = nextStage;
    evidence.failure = {
      stage: nextStage,
      code: 'TRACE_INCOMPLETE_OR_ABORTED',
    };
    try {
      persistTraceCheckpoint();
    } catch {
      // Final write in finally will classify any persistent write failure.
    }
  };

  try {
    persistTraceCheckpoint();
  } catch (error) {
    failure = true;
    evidence.stage = 'ARTIFACT_WRITE';
    evidence.failure = classifyFailure('ARTIFACT_WRITE', error);
    evidence.overall = 'FAIL';
    return { evidence, failure: true, tracePath };
  }

  let rejectOnSignal;
  const signalPromise = new Promise((_, reject) => {
    rejectOnSignal = reject;
  });
  // Avoid unhandled rejection if signalPromise is never raced or settles late.
  signalPromise.catch(() => {});

  const onSignal = (signal) => {
    const err = new QaError(
      stage,
      'PROCESS_SIGNAL_TERMINATED',
      `QA harness received termination signal ${signal}`,
      { signal },
    );
    failure = true;
    evidence.stage = stage;
    evidence.failure = classifyFailure(stage, err);
    try {
      persistTraceCheckpoint();
    } catch {
      // Best-effort synchronous write on signal.
    }
    rejectOnSignal(err);
  };

  const trackedSignals = ['SIGINT', 'SIGTERM', 'SIGHUP'];
  for (const sig of trackedSignals) {
    process.on(sig, onSignal);
  }

  try {
    await Promise.race([
      (async () => {
        enterStage('LOCAL_STATUS');
        const local = await localStatusFn({ workdir, api });
        localKey = local.SERVICE_ROLE_KEY;
        anonKey = local.ANON_KEY;
        const env = {
          ...process.env,
          NEXT_PUBLIC_SUPABASE_URL: api,
          NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: anonKey,
          SUPABASE_SERVICE_ROLE_KEY: localKey,
          NEXT_TELEMETRY_DISABLED: '1',
        };

        enterStage('APP_BUILD');
        await buildAppFn({ env, workdir });

        enterStage('FIXTURE_CREATION');
        fixture = await createFixtureFn(localKey, { api });

        enterStage('APP_START');
        application = await startAppFn({ env, workdir, app });

        enterStage('BROWSER_START');
        browser = await startBrowserFn({ app });

        enterStage('BROWSER_AUTH');
        const checkHealth = () => {
          assertProcessAlive(application, 'application', 'BROWSER_AUTH');
          assertProcessAlive(browser?.browser, 'browser', 'BROWSER_AUTH');
        };
        await runBrowserFn(browser.cdp, fixture, {
          cases,
          artifactDir,
          negativeControl,
          app,
          checkHealth,
          loginTimeoutMs,
        });

        stage = 'COMPLETED';
        evidence.stage = stage;
        delete evidence.failure;
      })(),
      signalPromise,
    ]);
  } catch (error) {
    failure = true;
    evidence.stage = stage;
    evidence.failure = classifyFailure(stage, error);
  } finally {
    for (const sig of trackedSignals) {
      process.removeListener(sig, onSignal);
    }
    // Checkpoint execution state before running teardown operations.
    try {
      persistTraceCheckpoint();
    } catch {
      // Final write in finally will classify any persistent write failure.
    }

    let browserTerminated = true;
    let applicationTerminated = true;
    let profileRemoved = true;

    try {
      browser?.cdp?.close();
    } catch {
      // Ignore CDP close errors during teardown.
    }

    if (browser?.browser) {
      try {
        const result = await terminateSubprocessFn(browser.browser, {
          initialSignal: 'SIGTERM',
          forceSignal: 'SIGKILL',
          graceMs: 3000,
        });
        browserTerminated = Boolean(result?.terminated);
      } catch {
        browserTerminated = false;
      }
    }

    if (browser?.profile) {
      try {
        rmSyncFn(browser.profile, {
          recursive: true,
          force: true,
          maxRetries: 5,
          retryDelay: 100,
        });
      } catch {
        profileRemoved = false;
      }
    }

    if (application) {
      try {
        const result = await terminateSubprocessFn(application, {
          initialSignal: 'SIGTERM',
          forceSignal: 'SIGKILL',
          graceMs: 5000,
        });
        applicationTerminated = Boolean(result?.terminated);
      } catch {
        applicationTerminated = false;
      }
    }

    let cleanupAttempted = Boolean(localKey && fixture);
    let cleanupStatus = cleanupAttempted ? 'PASS' : 'SKIPPED';
    if (cleanupAttempted) {
      try {
        await cleanupFn(localKey, fixture, { api });
      } catch {
        failure = true;
        cleanupStatus = 'FAIL';
        evidence.failure = {
          stage: 'CLEANUP',
          code: 'FIXTURE_CLEANUP_FAILED',
          ...(evidence.failure
            ? {
                priorStage: evidence.failure.stage,
                priorCode: evidence.failure.code,
              }
            : {}),
        };
      }
    }

    if (!browserTerminated || !applicationTerminated || !profileRemoved) {
      failure = true;
      if (evidence.failure?.code !== 'FIXTURE_CLEANUP_FAILED') {
        evidence.failure = {
          stage: 'CLEANUP',
          code: 'SUBPROCESS_TEARDOWN_FAILED',
          ...(evidence.failure
            ? {
                priorStage: evidence.failure.stage,
                priorCode: evidence.failure.code,
              }
            : {}),
        };
      }
    }

    evidence.cleanup = {
      attempted: cleanupAttempted,
      status: cleanupStatus,
      browserTerminated,
      applicationTerminated,
      profileRemoved,
    };
    evidence.overall = failure ? 'FAIL' : 'PASS';

    try {
      persistTraceCheckpoint();
    } catch (error) {
      failure = true;
      evidence.overall = 'FAIL';
      evidence.failure = classifyFailure('ARTIFACT_WRITE', error);
    }
  }

  return { evidence, failure, tracePath };
}

export async function runCli(argv = process.argv.slice(2)) {
  const verifyIndex = argv.indexOf('--verify-trace');
  if (verifyIndex !== -1) {
    const tracePath = argv[verifyIndex + 1];
    const modeIndex = argv.indexOf('--expected-mode');
    const expectedMode = modeIndex !== -1 ? argv[modeIndex + 1] : undefined;
    const statusIndex = argv.indexOf('--exit-status');
    const exitStatus =
      statusIndex !== -1 && argv[statusIndex + 1] !== undefined
        ? Number.parseInt(argv[statusIndex + 1], 10)
        : undefined;
    const result = verifyTraceFile(tracePath, {
      expectedMode,
      exitStatus: Number.isNaN(exitStatus) ? undefined : exitStatus,
    });
    const payload = JSON.stringify({
      code: result.code,
      valid: result.valid,
      summary: result.summary,
      diagnostics: result.diagnostics,
    });
    if (!result.valid) {
      console.error(payload);
      return 1;
    }
    console.log(payload);
    return 0;
  }

  const { evidence, failure } = await runQaHarness();
  if (failure) {
    console.error(
      `Browser-auth QA failed (${evidence.failure?.stage ?? 'UNKNOWN'}:${evidence.failure?.code ?? 'QA_EXECUTION_FAILED'}); review sanitized case evidence.`,
    );
    return 1;
  }
  console.log('Browser-auth QA passed in disposable local environment.');
  return 0;
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
const currentPath = fileURLToPath(import.meta.url);
if (invokedPath && invokedPath === currentPath) {
  const exitCode = await runCli();
  process.exit(exitCode);
}
