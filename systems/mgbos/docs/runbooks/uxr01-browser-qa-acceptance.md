# MGBOS UXR-01 Multi-Role Browser Acceptance Runbook

**Document Owner:** MGBOS Engineering / Builder  
**Tracking Issue:** [#65 (WP-UXR01-QA-AUTOMATION-01)](https://github.com/Rizkybuilds/bisnishub/issues/65)  
**Acceptance Contract:** [#55 (MGBOS-UXR-01 QA Acceptance Matrix)](https://github.com/Rizkybuilds/bisnishub/issues/55)  
**Target Pull Request:** [#53 (MGBOS-UXR-01 UI Foundation)](https://github.com/Rizkybuilds/bisnishub/pull/53)  
**Classification:** Internal Engineering Runbook / QA Acceptance Guide

---

## 1. Overview & Purpose

This runbook documents the multi-role automated browser acceptance harness for **MGBOS-UXR-01** (Founder-Usable App Shell and Navigation Foundation).

The harness independently automates real browser sessions using Headless Chromium over Chrome DevTools Protocol (CDP) against a live Next.js application on `http://127.0.0.1:3101` backed by a disposable local Supabase instance on `http://127.0.0.1:55431`.

### Core Objectives

1. **Multi-Role RBAC Verification:** Confirm dashboard operational shortcuts and sidebar items accurately reflect server-side session role permissions for `OWNER`, `SALES`, and `QC`.
2. **Direct Route Denial Verification:** Verify that prohibited routes (`/exceptions` for `SALES`, `/quotes` for `QC`) fail closed without leaking domain data or mutation controls.
3. **Brand Context Switching:** Verify live brand switching (TeeStock `TS` ↔ MultiGraph `MG`) and dynamic sidebar item filtering (e.g. `Library Desain` restricted to `TS`).
4. **Responsive & A11y Smoke:** Validate viewport rendering across 1440×900 (desktop) and 1024×768 (tablet/small laptop) with zero horizontal overflow, and confirm keyboard `Tab` focus ring operation.
5. **Fail-Closed Fixture Hygiene & Sanitization:** Guarantee that all synthetic test fixtures are cleaned up deterministically and that no credentials, JWTs, or session cookies are recorded in traces.
6. **Negative Control Assurance:** Provide a deterministic mode (`MGBOS_QA_NEGATIVE_CONTROL=1`) that proves assertion failure gates correctly block invalid UI states in CI.

---

## 2. Test Matrix & Acceptance Invariants

| Scenario                           | Role    | Viewport | Required Assertions                                                                | Target Outcome |
| :--------------------------------- | :------ | :------- | :--------------------------------------------------------------------------------- | :------------- |
| **OWNER_LOGIN**                    | `OWNER` | 1440×900 | Real form login via `/login` redirects to `/dashboard`                             | `PASS`         |
| **OWNER_DASHBOARD_1440**           | `OWNER` | 1440×900 | Exactly 14 shortcuts present; `document.documentElement.scrollWidth <= innerWidth` | `PASS`         |
| **OWNER_DASHBOARD_1024**           | `OWNER` | 1024×768 | Responsive layout intact; zero horizontal overflow                                 | `PASS`         |
| **OWNER_NAV_LEADS**                | `OWNER` | 1440×900 | Direct navigation to `/leads`; sidebar link active class applied                   | `PASS`         |
| **OWNER_NAV_ORDERS**               | `OWNER` | 1440×900 | Direct navigation to `/orders`; sidebar link active class applied                  | `PASS`         |
| **OWNER_NAV_EXCEPTIONS**           | `OWNER` | 1440×900 | Direct navigation to `/exceptions`; sidebar link active class applied              | `PASS`         |
| **OWNER_BRAND_SWITCH_MG**          | `OWNER` | 1440×900 | Click brand button `MG`; brand switcher active; `/designs` omitted from sidebar    | `PASS`         |
| **OWNER_BRAND_RESTORE_TS**         | `OWNER` | 1440×900 | Click brand button `TS`; brand switcher active; `/designs` restored to sidebar     | `PASS`         |
| **OWNER_KEYBOARD_FOCUS**           | `OWNER` | 1440×900 | `Tab` key event shifts active element focus off `BODY` to interactive element      | `PASS`         |
| **OWNER_LOGOUT**                   | `OWNER` | 1440×900 | Header logout form submission redirects to `/login`                                | `PASS`         |
| **SALES_LOGIN**                    | `SALES` | 1440×900 | Real form login redirects to `/dashboard`                                          | `PASS`         |
| **SALES_DASHBOARD**                | `SALES` | 1440×900 | Exactly 13 shortcuts present; `/exceptions` omitted from shortcuts & sidebar       | `PASS`         |
| **SALES_DIRECT_EXCEPTIONS_DENIAL** | `SALES` | 1440×900 | Navigating to `/exceptions` triggers server error (500); no data table rendered    | `PASS`         |
| **SALES_LOGOUT**                   | `SALES` | 1440×900 | Header logout form submission redirects to `/login`                                | `PASS`         |
| **QC_LOGIN**                       | `QC`    | 1440×900 | Real form login redirects to `/dashboard`                                          | `PASS`         |
| **QC_DASHBOARD**                   | `QC`    | 1440×900 | Exactly 12 shortcuts present; `/quotes` and `/exceptions` omitted                  | `PASS`         |
| **QC_DIRECT_QUOTES_DENIAL**        | `QC`    | 1440×900 | Navigating to `/quotes` renders empty listing; quotation create form omitted       | `PASS`         |
| **QC_LOGOUT**                      | `QC`    | 1440×900 | Header logout form submission redirects to `/login`                                | `PASS`         |

---

## 3. Harness Architecture

### 3.1 Network & Process Boundaries

- **Loopback Enforcement:** Both `CANONICAL_APP_ORIGIN` (`http://127.0.0.1:3101`) and `CANONICAL_API_ORIGIN` (`http://127.0.0.1:55431`) are strictly validated using `assertLoopbackHttpOrigin`. Non-loopback or malformed URLs are rejected fail-closed.
- **Chromium Isolation:** Headless Chromium is started with `--host-resolver-rules="MAP * ~NOTFOUND, EXCLUDE localhost, EXCLUDE 127.0.0.1"`, preventing external network requests.
- **Application Server Lifecycle:** `ensureAppServer()` checks if `http://127.0.0.1:3101/health` is responsive. If running, it reuses the server; if not, it spawns `pnpm --filter @mgbos/app start` with loopback Supabase credentials and ensures complete process termination upon suite completion.

### 3.2 Fixture Lifecycle

1. Synthetic users are provisioned via the Supabase Admin API with format:
   `ci-ui-qa-<role>-<uuid>@example.test`
2. Profiles and organization memberships (`app.users`, `app.organization_members`) are created with role ID lookup.
3. In `finally`, `cleanupRoleFixture()` deletes memberships, user profiles, and auth users in sequence. Non-synthetic emails are strictly refused deletion to prevent data destruction.

### 3.3 Sanitization & Evidence Tracing

- All trace payloads undergo pattern-based sanitization (`assertSanitizedEvidence`), stripping bearer tokens, session cookies, database URLs, and raw passwords.
- Traces are emitted to:
  - Positive run: `systems/mgbos/.qa-evidence/browser-ui/positive/trace.json`
  - Negative control run: `systems/mgbos/.qa-evidence/browser-ui/negative-control/trace.json`
- Verification is performed using:
  `node scripts/browser-ui-multirole-qa.mjs --verify-trace <path> --expected-mode <mode> --exit-status <status>`

---

## 4. Execution Guide

### 4.1 Prerequisites

- Node.js 22.x
- pnpm 10.x
- Headless Chromium / Google Chrome installed
- Local disposable Supabase running (`pnpm db:start && pnpm db:reset`)

### 4.2 Running the Suite Locally

From `systems/mgbos`:

```bash
# 1. Run unit regression tests
node --test scripts/browser-ui-multirole-qa.test.mjs

# 2. Build Next.js app (if not already built)
pnpm --filter @mgbos/app build

# 3. Execute positive browser acceptance
pnpm qa:browser-ui

# 4. Verify positive trace
node scripts/browser-ui-multirole-qa.mjs \
  --verify-trace .qa-evidence/browser-ui/positive/trace.json \
  --expected-mode normal \
  --exit-status 0

# 5. Execute negative control verification
MGBOS_QA_NEGATIVE_CONTROL=1 pnpm qa:browser-ui || neg_status=$?
node scripts/browser-ui-multirole-qa.mjs \
  --verify-trace .qa-evidence/browser-ui/negative-control/trace.json \
  --expected-mode intentional-broken-control \
  --exit-status "$neg_status"
```

### 4.3 Running in GitHub Actions CI

The harness runs under the `browser-ui-acceptance` job in `.github/workflows/mgbos-foundation.yml`:

- Triggered automatically on `push` to `qa/mgbos-uxr01-multirole-browser-acceptance` and `pull_request` targeting `feat/mgbos-uxr01-ui-foundation` or `main`.
- Uploads complete sanitized artifact bundle to `mgbos-browser-ui-qa`.

---

## 5. Troubleshooting & FAQ

| Symptom                   | Probable Cause                           | Remediation                                                                              |
| :------------------------ | :--------------------------------------- | :--------------------------------------------------------------------------------------- |
| `NONLOCAL_TARGET_BLOCKED` | Non-loopback URL passed to harness       | Ensure `app` is `http://127.0.0.1:3101` and `api` is `http://127.0.0.1:55431`            |
| `APP_START_FAILED`        | App build missing or port conflict       | Run `pnpm --filter @mgbos/app build` and ensure port 3101 is not held by another process |
| `CDP_CONNECT_TIMED_OUT`   | Headless Chromium failed to start        | Verify Chrome/Chromium installation or set `CHROME_BIN`                                  |
| `FIXTURE_CLEANUP_FAILED`  | Database connection lost during teardown | Check Supabase container status via `pnpm db:status`                                     |
