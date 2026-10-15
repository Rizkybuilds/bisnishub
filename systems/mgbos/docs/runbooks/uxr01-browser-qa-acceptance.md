# MGBOS UXR-01 Multi-Role Browser Acceptance Runbook

**Document Owner:** MGBOS Engineering / Builder  
**Tracking Issue:** [#65 (WP-UXR01-QA-AUTOMATION-01)](https://github.com/Rizkybuilds/bisnishub/issues/65)  
**Acceptance Contract:** [#55 (MGBOS-UXR-01 QA Acceptance Matrix)](https://github.com/Rizkybuilds/bisnishub/issues/55)  
**Target Pull Request:** [#53 (MGBOS-UXR-01 UI Foundation)](https://github.com/Rizkybuilds/bisnishub/pull/53)  
**Active Harness PR:** [#66 (Multi-Role Browser Acceptance)](https://github.com/Rizkybuilds/bisnishub/pull/66)  
**Classification:** Internal Engineering Runbook / QA Acceptance Guide

---

## 1. Overview & Purpose

This runbook documents the multi-role automated browser acceptance harness for **MGBOS-UXR-01** (Founder-Usable App Shell and Navigation Foundation).

The harness independently automates real browser sessions using Headless Chromium over Chrome DevTools Protocol (CDP) against a live Next.js application on `http://127.0.0.1:3101` backed by a disposable local Supabase instance on `http://127.0.0.1:55431`.

### Core Objectives & Remediations (PR #66 R1 & R2)

1. **Multi-Role RBAC Verification & Deep Equality:** Confirm dashboard operational shortcuts and sidebar items accurately reflect server-side session role permissions for `OWNER` (14 shortcuts), `SALES` (13 shortcuts), and `QC` (12 shortcuts) using exact deep equality against canonical definitions. Wait for asynchronous React tree hydration before shortcut inspection.
2. **Robust Direct Route Denial Classification (`QA66-F01`, `QA66-R2-03`):** Use `classifyRouteDenial` to evaluate HTTP response status, error boundaries, and rendered content. Verify that prohibited routes (`/exceptions` for `SALES`, `/quotes` for `QC`) fail closed without leaking domain data, while verifying that authorized routes (`/quotes` for `SALES`) render HTTP 200 with domain content. Normal empty pages are never misclassified as denials. Generic HTTP 500 crashes lacking access-denied or error boundary presentation are classified as `UNHANDLED_SERVER_CRASH` (`denied: false`).
3. **Trace Verification Rigor (`QA66-F02`, `QA66-R2-03`):** Validate all 24 mandatory case IDs, case statuses (`PASS`), tested commit provenance (exact 40-character hexadecimal `checkoutSha` with optional `--expected-checkout-sha` verification), `cleanup.verifiedAbsent === true`, and negative control failure code `INTENTIONAL_NEGATIVE_CONTROL_TRIGGERED` fail-closed.
4. **Complete UI Acceptance & Headless CDP Alignment (`QA66-F03`, `QA66-R2-02`):** Validate realistic long Indonesian founder display names, header bounding boxes and non-clipped controls across 1440×900 and 1024×768 breakpoints, visible keyboard `Tab` progression and CDP `Enter` activation (synthesizing carriage return `\r`), interactive sidebar clicks, and protected route redirection to `/login` post-logout.
5. **Deterministic Fixture Lifecycle & Absence Verification (`QA66-F04`):** Guarantee that all synthetic test fixtures are registered immediately via callback, cleaned up deterministically in `finally`, and independently verified absent via post-deletion database queries before returning `PASS`.
6. **Negative Control Assurance:** Provide a deterministic mode (`MGBOS_QA_NEGATIVE_CONTROL=1`) that records explicit failure code `INTENTIONAL_NEGATIVE_CONTROL_TRIGGERED` and proves assertion failure gates correctly block invalid UI states in CI.
7. **CI Governance Trigger Architecture (`QA66-F05`, `QA66-R2-01`):** Ensure consistent workspace formatting across QA files and clarify workflow trigger architecture across stacked branch hierarchies.

---

## 2. Complete 24-Case Acceptance Matrix

| Case ID                            | Role      | Viewport | Required Assertions & Behavior                                                                                                                                               | Target Outcome |
| :--------------------------------- | :-------- | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------- |
| **OWNER_LOGIN**                    | `OWNER`   | 1440×900 | Real form login via `/login` redirects to `/dashboard` with long founder display name                                                                                        | `PASS`         |
| **OWNER_DASHBOARD_1440**           | `OWNER`   | 1440×900 | Exactly 14 shortcuts present; `document.documentElement.scrollWidth <= innerWidth`                                                                                           | `PASS`         |
| **OWNER_DASHBOARD_1024**           | `OWNER`   | 1024×768 | Responsive layout intact; zero horizontal overflow                                                                                                                           | `PASS`         |
| **OWNER_HEADER_LAYOUT_1440**       | `OWNER`   | 1440×900 | Header bounding boxes valid, brand buttons visible, logout button not clipped, zero overflow                                                                                 | `PASS`         |
| **OWNER_HEADER_LAYOUT_1024**       | `OWNER`   | 1024×768 | Responsive header layout intact, brand and logout buttons fully within viewport                                                                                              | `PASS`         |
| **OWNER_NAV_LEADS**                | `OWNER`   | 1440×900 | Interactive click on sidebar `/leads` link; URL updates; sidebar active class applied                                                                                        | `PASS`         |
| **OWNER_NAV_ORDERS**               | `OWNER`   | 1440×900 | Interactive click on sidebar `/orders` link; URL updates; sidebar active class applied                                                                                       | `PASS`         |
| **OWNER_NAV_EXCEPTIONS**           | `OWNER`   | 1440×900 | Interactive click on sidebar `/exceptions` link; URL updates; sidebar active class applied                                                                                   | `PASS`         |
| **OWNER_BRAND_SWITCH_MG**          | `OWNER`   | 1440×900 | Click brand button `MG`; brand switcher active; `/designs` omitted from sidebar                                                                                              | `PASS`         |
| **OWNER_BRAND_RESTORE_TS**         | `OWNER`   | 1440×900 | Click brand button `TS`; brand switcher active; `/designs` restored to sidebar                                                                                               | `PASS`         |
| **OWNER_KEYBOARD_NAVIGATION**      | `OWNER`   | 1440×900 | 3-step sequential `Tab` progression across distinct interactive elements with observable `:focus-visible` styling; `Enter` keypress naturally activates focused brand button | `PASS`         |
| **OWNER_SHORTCUTS_DEEP_EQUALITY**  | `OWNER`   | 1440×900 | Sorted shortcut hrefs match canonical 14-item list with deep equality                                                                                                        | `PASS`         |
| **OWNER_LOGOUT**                   | `OWNER`   | 1440×900 | Header logout form submission redirects to `/login`                                                                                                                          | `PASS`         |
| **POST_LOGOUT_PROTECTED_DENIAL**   | Anonymous | 1440×900 | Post-logout navigation to `/dashboard` redirects to `/login`; session cookies cleared                                                                                        | `PASS`         |
| **SALES_LOGIN**                    | `SALES`   | 1440×900 | Real form login redirects to `/dashboard`                                                                                                                                    | `PASS`         |
| **SALES_DASHBOARD**                | `SALES`   | 1440×900 | Exactly 13 shortcuts; `/exceptions` omitted; deep equality with canonical list                                                                                               | `PASS`         |
| **SALES_AUTHORIZED_QUOTES_ACCESS** | `SALES`   | 1440×900 | Direct navigation to `/quotes` renders HTTP 200, "Penawaran & HPP" heading, and create form                                                                                  | `PASS`         |
| **SALES_DIRECT_EXCEPTIONS_DENIAL** | `SALES`   | 1440×900 | Direct navigation to `/exceptions` denied (500 boundary); zero domain data leaked                                                                                            | `PASS`         |
| **SALES_LOGOUT**                   | `SALES`   | 1440×900 | Header logout form submission redirects to `/login`                                                                                                                          | `PASS`         |
| **QC_LOGIN**                       | `QC`      | 1440×900 | Real form login redirects to `/dashboard`                                                                                                                                    | `PASS`         |
| **QC_DASHBOARD**                   | `QC`      | 1440×900 | Exactly 12 shortcuts; `/quotes` & `/exceptions` omitted; deep equality with canonical list                                                                                   | `PASS`         |
| **QC_DIRECT_QUOTES_DENIAL**        | `QC`      | 1440×900 | Direct navigation to `/quotes` denied (500 boundary); zero quotation data leaked                                                                                             | `PASS`         |
| **QC_LOGOUT**                      | `QC`      | 1440×900 | Header logout form submission redirects to `/login`                                                                                                                          | `PASS`         |
| **FIXTURE_CLEANUP_VERIFICATION**   | System    | N/A      | Independent database absence verification for all created fixtures (`members`, `users`, `auth`)                                                                              | `PASS`         |

---

## 3. Harness Architecture

### 3.1 Network & Process Boundaries

- **Loopback Enforcement:** Both `CANONICAL_APP_ORIGIN` (`http://127.0.0.1:3101`) and `CANONICAL_API_ORIGIN` (`http://127.0.0.1:55431`) are strictly validated using `assertLoopbackHttpOrigin`. Non-loopback or malformed URLs are rejected fail-closed.
- **Chromium Isolation:** Headless Chromium is started with `--host-resolver-rules="MAP * ~NOTFOUND, EXCLUDE localhost, EXCLUDE 127.0.0.1"`, preventing external network requests.
- **Application Server Lifecycle:** `ensureAppServer()` checks if `http://127.0.0.1:3101/health` is responsive. If running, it reuses the server; if not, it builds and spawns `pnpm --filter @mgbos/app start` with loopback Supabase credentials and ensures complete process termination upon suite completion.

### 3.2 Fixture Lifecycle & Absence Verification

1. Synthetic users are provisioned via the Supabase Admin API with format:
   `ci-ui-qa-<role>-<uuid>@example.test`
2. Profiles and organization memberships (`app.users`, `app.organization_members`) are created with role ID lookup.
3. Every created fixture is registered immediately via `onRegistered` callback so that unexpected termination or partial creation failure is still cleaned up.
4. In `finally`, `cleanupRoleFixture()` deletes memberships, user profiles, and auth users in sequence.
5. **Absence Verification:** After deletion calls complete, `cleanupRoleFixture()` executes independent queries to `/rest/v1/organization_members`, `/rest/v1/users`, and `/auth/v1/admin/users/${id}`. If any record still exists, it throws `FIXTURE_RESOURCE_NOT_ABSENT` and marks the test run as `FAIL`.

### 3.3 Route Denial Classification

The `classifyRouteDenial()` engine evaluates:

- `responseStatus`: HTTP response code (500, 403, 200).
- `hasDomainHeading` / `domainHeadingText`: presence of authorized page headings.
- `hasDomainContent`: presence of data tables, quotation forms, exception cards.
- `hasErrorBoundary`: presence of Next.js error boundary (`This page couldn't load`).

Classification logic guarantees:

- **Authorized Pages:** Returns `AUTHORIZED_PAGE` (`denied: false`). Even if a table is currently empty, it is never misclassified as a denial.
- **Error Boundary Denials:** Returns `ERROR_BOUNDARY_500` (`denied: true, domainDataExposed: false`).
- **Explicit Denials:** Returns `EXPLICIT_403` (`denied: true, domainDataExposed: false`).
- **Generic 500 Crashes:** Returns `UNHANDLED_SERVER_CRASH` (`denied: false, domainDataExposed: false`) when a 500 status lacks explicit access-denied or error boundary presentation.
- **Data Leaks:** If domain headings or content render during an error state, returns `ERROR_WITH_DATA_LEAK` (`denied: false, domainDataExposed: true`) which fails the assertion.

### 3.4 Sanitization & Evidence Tracing

- All trace payloads undergo pattern-based sanitization (`assertSanitizedEvidence`), stripping bearer tokens, session cookies, database URLs, and raw passwords.
- Traces are emitted to:
  - Positive run: `systems/mgbos/.qa-evidence/browser-ui/positive/trace.json`
  - Negative control run: `systems/mgbos/.qa-evidence/browser-ui/negative-control/trace.json`
- Verification is performed using:
  `node scripts/browser-ui-multirole-qa.mjs --verify-trace <path> --expected-mode <mode> --exit-status <status> [--expected-checkout-sha <sha>]`
- Verification asserts:
  - Provenance checkout SHA is a valid 40-character hexadecimal string matching `--expected-checkout-sha` if supplied, or automatically bound to `GITHUB_SHA` in GitHub Actions CI.
  - `cleanup.status === 'PASS'` and `cleanup.verifiedAbsent === true` (verifying all synthetic fixture rows were confirmed absent in the database).
  - All 24 cases marked `PASS` in normal mode; exact code `INTENTIONAL_NEGATIVE_CONTROL_TRIGGERED` in negative control mode (rejecting any unrelated setup, fixture, or assertion errors).

---

## 4. CI Governance Trigger Architecture (`QA66-F05`)

In BisnisHub CI:

- Workflows `.github/workflows/agent-governance.yml`, `.github/workflows/repository-integrity.yml`, and `.github/workflows/mgbos-pr-gate.yml` have triggers configured as:
  ```yaml
  on:
    pull_request:
      branches: [main]
  ```
- Because PR #66 is a stacked QA branch targeting `feat/mgbos-uxr01-ui-foundation` (rather than `main`), GitHub Actions automatically evaluates triggers based on the PR's target branch. Consequently, repository-level gate workflows trigger on PR #53 (which targets `main`), while PR #66 runs the foundation and browser QA workflows.
- All supply chain checks (25 action uses, 9 checkouts across 5 allowed action repos) and agent governance checks are verified locally via:
  - `python scripts/governance/validate-agent-governance.py`
  - `python scripts/governance/validate_ci_supply_chain.py --root .`
  - `python -m unittest scripts/governance/test_ci_supply_chain.py`
- All governance gates will automatically execute in hosted CI when PR #53 merges to `main`.

---

## 5. Execution Guide

### 5.1 Local Execution

From `systems/mgbos`:

```bash
# 1. Run unit regression tests (27 unit tests)
node --test scripts/browser-ui-multirole-qa.test.mjs

# 2. Run browser auth hygiene unit tests (30 unit tests)
node --test scripts/browser-auth-hygiene-qa.test.mjs

# 3. Build Next.js app (if not already built)
pnpm --filter @mgbos/app build

# 4. Execute positive browser acceptance
pnpm qa:browser-ui

# 5. Verify positive trace (all 24 cases)
node scripts/browser-ui-multirole-qa.mjs \
  --verify-trace .qa-evidence/browser-ui/positive/trace.json \
  --expected-mode normal \
  --exit-status 0

# 6. Execute negative control verification
MGBOS_QA_NEGATIVE_CONTROL=1 pnpm qa:browser-ui || neg_status=$?
node scripts/browser-ui-multirole-qa.mjs \
  --verify-trace .qa-evidence/browser-ui/negative-control/trace.json \
  --expected-mode intentional-broken-control \
  --exit-status "$neg_status"
```

### 5.2 Running in GitHub Actions CI

The harness runs under the `browser-ui-acceptance` job in `.github/workflows/mgbos-foundation.yml`:

- Triggered automatically on `push` to `qa/mgbos-uxr01-multirole-browser-acceptance` and `pull_request` targeting `feat/mgbos-uxr01-ui-foundation`.
- Executes both normal acceptance and intentional negative control.
- Verifies traces using `--verify-trace`.
- Uploads complete sanitized artifact bundle to `mgbos-browser-ui-qa`.
