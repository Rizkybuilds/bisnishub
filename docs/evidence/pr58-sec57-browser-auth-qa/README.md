# Browser Authentication QA Evidence — Issue #57 / PR #58

- **Target PR:** [#58](https://github.com/Rizkybuilds/bisnishub/pull/58) (`security(mgbos): remove default login credential prefill`)
- **Parent Issue:** [#57](https://github.com/Rizkybuilds/bisnishub/issues/57) (Scope A + approved anonymous page extension)
- **Exact Candidate Head SHA:** `00226283962354d697ef5c38cf5f7d6af4593179`
- **Base SHA (`main`):** `a8a0e5342165cd65fa2549284728b6e9f131405c`
- **Browser Version:** `Chrome/155.0.8059.39` (CDP Protocol `1.3`, Viewport `1440x900`)
- **Test Environment:** Verified disposable local-only environment (`http://127.0.0.1:3101` against local Docker Supabase `http://127.0.0.1:55431`, project `mgbos-foundation`). Zero production or remote connectivity.
- **Sanitization & Hygiene:** Zero passwords, zero session tokens, zero hashes, and zero real or historical seed email addresses are present in the screenshots or trace. A temporary synthetic identity (`QA Auth Synthetic Operator`) was provisioned locally for the test run and deleted immediately afterward.

---

## Executed Test Cases & Artifacts

| Case ID | Scenario | Observed Result | Verdict | Screenshot |
| :--- | :--- | :--- | :--- | :--- |
| `AUTH-BLANK-01` | **Anonymous blank `/login` page** | `input[name="email"]` and `input[name="password"]` have `value=""` and `getAttribute("value")=null`; `.auth-card footer` count is `0`; zero email pattern or seed hint in DOM. | **PASS** | [`01_anonymous_blank_login.png`](./01_anonymous_blank_login.png) |
| `AUTH-INVALID-01` | **Invalid login via real form submit** | Submitting invalid synthetic credentials keeps browser on `/login`, sets no `mgbos_session` cookie (`sessionCookiePresent: false`), and renders `role="alert"` banner (`Invalid login credentials`). | **PASS** | [`02_invalid_login_error_feedback.png`](./02_invalid_login_error_feedback.png) |
| `AUTH-DENY-01` | **Unauthenticated protected-route denial** | Direct navigation to `/dashboard`, `/orders`, and `/exceptions` without a session cookie redirects to `http://127.0.0.1:3101/login`. | **PASS** | [`03_unauthenticated_protected_route_redirect.png`](./03_unauthenticated_protected_route_redirect.png) |
| `AUTH-VALID-01` | **Valid login via real form submit** | Submitting disposable synthetic credentials via `LoginForm` sets `httpOnly: true, sameSite: "Lax"` `mgbos_session` cookie and redirects to `/dashboard` displaying `QA Auth Synthetic Operator`. | **PASS** | [`04_valid_login_dashboard_authenticated.png`](./04_valid_login_dashboard_authenticated.png) |
| `AUTH-LOGOUT-01` | **Real form logout** | Clicking the `Keluar` submit button invokes `handleLogout`, deletes `mgbos_session` (`sessionCookiePresent: false`), and redirects to blank `/login`. | **PASS** | [`05_post_logout_login_page.png`](./05_post_logout_login_page.png) |
| `AUTH-INVALIDATE-01` | **Post-logout & tampered-token invalidation** | Navigating to `/dashboard` after logout redirects to `/login`; injecting a forged/invalidated `mgbos_session` token is rejected by `verifySessionToken()` and redirects to `/login`. | **PASS** | [`06_session_invalidation_protected_route_denied.png`](./06_session_invalidation_protected_route_denied.png) |

Machine-readable timestamped trace: [`pr58_browser_auth_qa_trace.json`](./pr58_browser_auth_qa_trace.json)

---

## Independent Reproduction Procedure (Local Disposable Environment)

1. **Checkout exact candidate SHA:**
   ```sh
   git fetch origin
   git checkout 00226283962354d697ef5c38cf5f7d6af4593179
   test "$(git rev-parse HEAD)" = "00226283962354d697ef5c38cf5f7d6af4593179"
   ```
2. **Verify local-only Supabase configuration (`systems/mgbos`):**
   - Ensure `systems/mgbos/apps/mgbos/.env.local` targets `NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:55431` (never a remote URL).
   - Start local Supabase stack (`mgbos-foundation` ports `55431-55437`):
     ```sh
     cd systems/mgbos
     pnpm install --frozen-lockfile
     pnpm db:start
     ```
3. **Run static hygiene unit test & production build:**
   ```sh
   pnpm test -- scripts/login-credential-hygiene.test.ts
   pnpm --filter @mgbos/app build
   pnpm --filter @mgbos/app start
   ```
4. **Provision a disposable synthetic test user (local PostgreSQL `127.0.0.1:55432`)** with an ephemeral password, execute the 6 browser authentication checks on `http://127.0.0.1:3101/login`, and delete the synthetic user afterward.
