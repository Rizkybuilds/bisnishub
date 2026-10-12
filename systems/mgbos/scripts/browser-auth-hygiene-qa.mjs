import assert from 'node:assert/strict';
import { randomBytes, randomUUID } from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Never log credentials, browser request bodies, JWTs, cookie values or tokens.
const root = fileURLToPath(new URL('../', import.meta.url));
const api = 'http://127.0.0.1:55431';
const app = 'http://127.0.0.1:3101';
const negativeControl = process.env.MGBOS_QA_NEGATIVE_CONTROL === '1';
const artifactDir = path.join(
  root,
  '.qa-evidence',
  'browser-auth',
  negativeControl ? 'negative-control' : 'positive',
);
const cases = [];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function until(fn, label, ms = 30000) {
  const deadline = Date.now() + ms;
  while (Date.now() < deadline) {
    try {
      const result = await fn();
      if (result) return result;
    } catch {
      // Page navigations temporarily destroy the execution context.
    }
    await sleep(250);
  }
  throw new Error(`Timed out: ${label}`);
}

function result(caseId, passed, proof = {}) {
  cases.push({
    caseId,
    verdict: passed ? 'PASS' : 'FAIL',
    timestamp: new Date().toISOString(),
    proof,
  });
  assert.ok(passed, `Authentication invariant not satisfied: ${caseId}`);
}

function localStatus() {
  for (const key of ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_URL']) {
    if (process.env[key] && process.env[key] !== api) {
      throw new Error('Refusing a nonlocal Supabase target');
    }
  }
  const binary = path.join(
    root,
    'node_modules',
    'supabase',
    'dist',
    'supabase.js',
  );
  const output = spawnSync(
    process.execPath,
    [binary, 'status', '-o', 'env', '--workdir', root],
    { cwd: root, encoding: 'utf8', timeout: 30000 },
  );
  if (output.status !== 0)
    throw new Error('Disposable Supabase is unavailable');
  const parsed = Object.fromEntries(
    output.stdout.split(/\r?\n/).flatMap((line) => {
      const match = line.match(/^([A-Z_]+)=(.*)$/);
      return match ? [[match[1], match[2].replace(/^"|"$/g, '')]] : [];
    }),
  );
  if (parsed.API_URL !== api || !parsed.ANON_KEY || !parsed.SERVICE_ROLE_KEY) {
    throw new Error('Local Supabase identity or keys could not be verified');
  }
  if (
    parsed.DB_URL &&
    !/^postgres(?:ql)?:\/\/(?:[^@]+@)?127\.0\.0\.1:55432\//.test(parsed.DB_URL)
  ) {
    throw new Error('Refusing nonlocal database identity');
  }
  return parsed;
}

async function db(key, route, { method = 'GET', body, schema } = {}) {
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
  const response = await fetch(url, {
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

async function cleanup(key, fixture) {
  if (!key || !fixture) return;
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
      }),
    );
    await attempt(() =>
      db(key, `/rest/v1/users?id=eq.${fixture.profile}`, {
        method: 'DELETE',
        schema: 'app',
      }),
    );
  }
  if (fixture.auth) {
    await attempt(() =>
      db(key, `/auth/v1/admin/users/${fixture.auth}`, { method: 'DELETE' }),
    );
  }
  if (fixture.profile) {
    await attempt(async () => {
      const remaining = await db(
        key,
        `/rest/v1/users?id=eq.${fixture.profile}&select=id`,
        { schema: 'app' },
      );
      assert.deepEqual(remaining, [], 'Synthetic profile must be absent');
    });
  }
  if (fixture.auth) {
    await attempt(async () => {
      const response = await fetch(
        `${api}/auth/v1/admin/users/${fixture.auth}`,
        {
          headers: { apikey: key, Authorization: `Bearer ${key}` },
          signal: AbortSignal.timeout(15000),
        },
      );
      assert.equal(response.status, 404, 'Synthetic auth user must be absent');
    });
  }
  if (failed) throw new Error('Synthetic fixture cleanup verification failed');
}
async function createFixture(key) {
  const [org] = await db(
    key,
    '/rest/v1/organizations?select=id&status=eq.ACTIVE&limit=1',
    { schema: 'app' },
  );
  assert.ok(org?.id, 'Disposable organization missing');
  const [role] = await db(
    key,
    `/rest/v1/roles?select=id&organization_id=eq.${org.id}&code=eq.OWNER&limit=1`,
    { schema: 'app' },
  );
  assert.ok(role?.id, 'Disposable OWNER role missing');
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
    });
    return fixture;
  } catch (error) {
    await cleanup(key, fixture);
    throw error;
  }
}

class Cdp {
  constructor(url) {
    this.url = url;
    this.id = 0;
    this.pending = new Map();
    this.requests = [];
  }

  async connect() {
    this.ws = new WebSocket(this.url);
    await new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve, { once: true });
      this.ws.addEventListener('error', reject, { once: true });
    });
    this.ws.addEventListener('message', (event) => {
      const packet = JSON.parse(event.data);
      if (packet.method === 'Network.requestWillBeSent') {
        try {
          const url = new URL(packet.params.request.url);
          if (url.origin === app) {
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
    await this.send('Page.enable');
    await this.send('Runtime.enable');
    await this.send('Network.enable');
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.id;
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`Browser protocol timed out: ${method}`));
      }, 15000);
      this.pending.set(id, { method, resolve, reject, timer });
      this.ws.send(JSON.stringify({ id, method, params }));
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

  async goto(route, expected = route) {
    const before = await this.eval('performance.timeOrigin');
    await this.send('Page.navigate', { url: `${app}${route}` });
    await until(async () => {
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
    }, `Navigation ${route}`);
  }

  posts(route) {
    return this.requests.filter(
      (request) => request.method === 'POST' && request.path === route,
    ).length;
  }

  async session() {
    const response = await this.send('Network.getCookies', { urls: [app] });
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
    this.ws?.close();
  }
}

function chromeExecutable() {
  for (const name of [
    process.env.CHROME_BIN,
    'google-chrome',
    'google-chrome-stable',
    'chromium',
  ]) {
    if (!name) continue;
    const probe = spawnSync('which', [name], { encoding: 'utf8' });
    if (probe.status === 0) return probe.stdout.trim();
    if (existsSync(name)) return name;
  }
  throw new Error('Chromium is unavailable in isolated QA runner');
}

async function startBrowser() {
  const profile = mkdtempSync(path.join(tmpdir(), 'mgbos-ci-cdp-'));
  const browser = spawn(
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
    { stdio: 'ignore' },
  );
  try {
    const filename = path.join(profile, 'DevToolsActivePort');
    const port = await until(
      () => {
        if (browser.exitCode !== null) return false;
        return existsSync(filename)
          ? Number(readFileSync(filename, 'utf8').split('\n')[0])
          : false;
      },
      'Local browser debugging endpoint',
      20000,
    );
    const response = await fetch(
      `http://127.0.0.1:${port}/json/new?${encodeURIComponent(`${app}/login`)}`,
      { method: 'PUT' },
    );
    assert.ok(response.ok, 'Browser debugging target unavailable');
    const target = await response.json();
    assert.ok(
      target.webSocketDebuggerUrl?.startsWith('ws://127.0.0.1:'),
      'Browser debugging must bind to loopback',
    );
    const cdp = new Cdp(target.webSocketDebuggerUrl);
    await cdp.connect();
    return { browser, cdp, profile };
  } catch (error) {
    browser.kill('SIGKILL');
    rmSync(profile, { recursive: true, force: true });
    throw error;
  }
}

async function runBrowser(cdp, fixture) {
  await cdp.send('Network.clearBrowserCookies');
  await cdp.goto('/login');
  await until(
    () => cdp.eval('Boolean(document.querySelector(\'input[name="email"]\'))'),
    'Login form',
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
  result('AUTH-BLANK-01', empty && (await cdp.session()).length === 0, {
    route: '/login',
    emptyInputs: empty,
  });
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
  );
  const invalidPostObserved = cdp.posts('/login') > invalidPosts;
  result(
    'AUTH-INVALID-01',
    invalidPostObserved && (await cdp.session()).length === 0,
    { route: '/login', formPostObserved: invalidPostObserved },
  );

  for (const route of ['/dashboard', '/orders', '/exceptions']) {
    await cdp.goto(route, '/login');
  }
  result('AUTH-DENY-01', (await cdp.session()).length === 0, {
    routes: ['/dashboard', '/orders', '/exceptions'],
    finalRoute: '/login',
  });

  const validPosts = cdp.posts('/login');
  await submit(
    fixture.email,
    negativeControl ? `${fixture.password}${randomUUID()}` : fixture.password,
  );
  await until(
    () =>
      cdp.eval(
        'location.pathname === "/dashboard" && document.body.innerText.includes("CI Synthetic Operator")',
      ),
    'Authenticated dashboard',
  );
  const session = await cdp.session();
  const validPostObserved = cdp.posts('/login') > validPosts;
  result(
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
  assert.ok(pressed, 'Logout form missing');
  await until(() => cdp.eval('location.pathname === "/login"'), 'Logout');
  const logoutPostObserved = cdp.posts('/dashboard') > logoutPosts;
  result(
    'AUTH-LOGOUT-01',
    logoutPostObserved && (await cdp.session()).length === 0,
    { route: '/login', logoutPostObserved, sessionCookiePresent: false },
  );

  await cdp.goto('/dashboard', '/login');
  result('AUTH-AFTER-LOGOUT-01', (await cdp.session()).length === 0, {
    finalRoute: '/login',
  });

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
  result('AUTH-INVALID-TOKEN-SETUP-01', cookieInstalled, {
    testCookieInstalled: cookieInstalled,
  });
  await cdp.goto('/dashboard', '/login');
  result(
    'AUTH-INVALID-TOKEN-01',
    await cdp.eval('location.pathname === "/login"'),
    { finalRoute: '/login', priorValidJwtRevocationTested: false },
  );
  await cdp.send('Network.clearBrowserCookies');
}

async function main() {
  mkdirSync(artifactDir, { recursive: true });
  const git = spawnSync('git', ['rev-parse', 'HEAD'], {
    cwd: root,
    encoding: 'utf8',
    timeout: 5000,
  });
  const evidence = {
    checkoutSha: git.status === 0 ? git.stdout.trim() : 'unknown',
    ciEventSha: process.env.GITHUB_SHA ?? null,
    cases,
    mode: negativeControl ? 'intentional-broken-login' : 'normal',
  };
  let localKey;
  let fixture;
  let application;
  let browser;
  let failure = false;
  let stage = 'LOCAL_STATUS';

  try {
    const local = localStatus();
    localKey = local.SERVICE_ROLE_KEY;
    const env = {
      ...process.env,
      NEXT_PUBLIC_SUPABASE_URL: api,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: local.ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: localKey,
      NEXT_TELEMETRY_DISABLED: '1',
    };
    stage = 'APP_BUILD';
    const build = spawnSync('pnpm', ['--filter', '@mgbos/app', 'build'], {
      cwd: root,
      env,
      // Build output is intentionally suppressed: no environment or key values in CI logs.
      stdio: 'ignore',
      timeout: 180000,
    });
    assert.equal(build.status, 0, 'Isolated app build failed');
    stage = 'FIXTURE_CREATION';
    fixture = await createFixture(localKey);
    application = spawn('pnpm', ['--filter', '@mgbos/app', 'start'], {
      cwd: root,
      env,
      stdio: 'ignore',
    });
    await until(async () => {
      if (application.exitCode !== null) return false;
      const response = await fetch(`${app}/health`, {
        signal: AbortSignal.timeout(1500),
      });
      return response.ok;
    }, 'Local MGBOS health');
    stage = 'BROWSER_AUTH';
    browser = await startBrowser();
    await runBrowser(browser.cdp, fixture);
  } catch (error) {
    failure = true;
    const message = error instanceof Error ? error.message : '';
    evidence.failure = {
      stage,
      code:
        message === 'Timed out: Authenticated dashboard'
          ? 'AUTH_VALID_LOGIN_DID_NOT_COMPLETE'
          : message.startsWith('Authentication invariant not satisfied:')
            ? 'AUTH_ASSERTION_FAILED'
            : stage === 'APP_BUILD'
              ? 'BUILD_FAILED'
              : stage === 'FIXTURE_CREATION'
                ? 'FIXTURE_CREATION_FAILED'
                : 'QA_EXECUTION_FAILED',
    };
  } finally {
    browser?.cdp.close();
    browser?.browser.kill('SIGKILL');
    if (browser?.profile) {
      rmSync(browser.profile, { recursive: true, force: true });
    }
    application?.kill('SIGTERM');
    try {
      await cleanup(localKey, fixture);
    } catch {
      failure = true;
      evidence.failure = { stage: 'CLEANUP', code: 'FIXTURE_CLEANUP_FAILED' };
    }
    evidence.overall = failure ? 'FAIL' : 'PASS';
    writeFileSync(
      path.join(artifactDir, 'trace.json'),
      `${JSON.stringify(evidence, null, 2)}\n`,
    );
  }
  if (failure) {
    console.error('Browser-auth QA failed; review sanitized case evidence.');
    process.exitCode = 1;
  } else {
    console.log('Browser-auth QA passed in disposable local environment.');
  }
}

await main();
