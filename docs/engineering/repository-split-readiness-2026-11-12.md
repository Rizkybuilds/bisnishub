---
title: "BisnisHub repository split — readiness audit"
status: PROPOSAL
review_date: "2026-11-12"
owner: Rizky
scope: "repository extraction planning; no code or deployment change"
baseline_branch: main
baseline_commit: b5f9706054e378d2d078b72a59968d5214958e7d
---

# Repository split readiness — 12 November 2026

> **Planning only.** This is an evidence-based extraction proposal, **not an approved change of canonical architecture**, authorization to migrate a database, or approval to change production deployment. Current code and operational procedures remain authoritative until a bounded migration is completed. Do not override [Lean Feature Delivery](lean-feature-delivery.md) or rewrite historical [ADR-001](../decisions/001-repository-organization.md) merely because this draft exists.

## 1. Why split, and why not all at once?

BisnisHub currently combines independently deployed products, the MGBOS pnpm workspace, product/brand documentation, archived prototypes, agent skills and shared governance. This is primarily a **scope, discovery and ownership** problem, not a git-size emergency. Keep shared code together when a real, verified dependency exists; split independently operated products in waves.

Snapshot through GitHub API on `main`: 1,628 tracked file entries, 2,056 tree entries including directories, 7 `.github/workflows/*.yml` files, and 13 open pull requests. Repository is public; `main` is protected. These are **point-in-time observations**, not release readiness or a guarantee the remote is unchanged. The connector cannot inspect local untracked files, all secret settings, or private runtime data.

## 2. Proposed ownership boundaries

| Repo | Scope and target | Extraction decision |
| --- | --- | --- |
| `bisnishub` | Lightweight portfolio navigation, cross-business strategy and decisions, links to product repositories; retain existing Git/PR history as a permanent reference | **Remain**; clean up only after product cutovers |
| `mgbos` | Entire existing `systems/mgbos/` pnpm workspace, including admin app, packages, Supabase migrations and **TeeStock storefront initially** | Move as one reproducible workspace; do not split internal packages |
| `teestock` | TeeStock brand, retail product and Design Lab knowledge; its independent storefront **later** after API/config boundary is proven | **Deferred** until integration is stable |
| `bite-boxes` (working repository target) | Shared kitchen operator, F&B brand knowledge and the **existing Little Treat Kitchen OS** as its first operational app | Extract when in-flight Little Treat work is reconciled; do not introduce speculative multi-brand code or change the separate Supabase project just for naming |
| `kaskita` | Standalone mobile app and its own Supabase schema | Extract later when there is active product need |

Bite Boxes is the selected *business umbrella naming direction*, not proof of registration or trademark clearance. Existing canonical `bisnis/food-ventures/` documentation uses the Food Ventures domain label: **do not silently replace its scope, IDs or business authority** during a code-move PR.

Do not create new repositories for JARVIS documentation-only work, per-skill agent files, the CLI assistant, every brand, every package, or the legacy archive without a real independently maintained lifecycle.

## 3. Current evidence and blockers

### P0 — Little Treat / F&B

- App source: `systems/little-treat-kitchen/`, documented as a static operator UI with a **separate** Supabase project `little-treat-kitchen` (see [README](../../systems/little-treat-kitchen/README.md)).
- Current release: `gh-pages:/` serving `https://rizkybuilds.github.io/bisnishub/` and a strict static-file allowlist (see [RELEASE](../../systems/little-treat-kitchen/RELEASE.md)); the [CI workflow](../../.github/workflows/little-treat-kitchen.yml) has hardcoded paths and a live URL smoke probe.
- Open PRs at audit: #105, #106, #108, #109, #114, #115, #117 form a stacked/dependent work chain. **Verified preliminary content reconciliation:** the latest #117 head (`fc493bfb`) stores the app at `apps/little-treat-kitchen/`, whereas current `main` stores it at `systems/little-treat-kitchen/`. By comparing same-relative-path Git blob IDs, **36/38 files from #117 are byte-identical to `main`**; `README.md` and `ops.js` differ. Two files exist only in `main`: `RELEASE.md` and `release-gates.test.cjs`. The `ops.js` difference removes a link to `legacy.html` from the sign-in page (the older branch still links it). Thus **do not merge the old stack blindly**; `git compare` reports divergent ancestry (latest branch 106 commits ahead/6 behind) because it compares history, while these matching blobs indicate much of the feature content is already present. This is content evidence, **not** independent browser/production validation. Do not automatically close old PRs without reviewing discussion/review state.
- Preserve `lt_members` owner/staff authorization, RLS, idempotency, deployment allowlist, authentication redirects/origin assumptions, and financial data boundaries. Check these against the actual deployed version.
- The app README reports product/pricing/cost and two-device commercial readiness gates still outstanding. **Do not conflate successful extraction with commercial-launch approval**.
- Do not migrate or reset live Supabase data, transfer secrets, alter RLS, or switch public URLs as part of the first source-extraction commit.

### P1 — MGBOS and TeeStock

- Current workspace: `systems/mgbos/` with `pnpm-workspace.yaml`, pinned Node/pnpm and `pnpm-lock.yaml`; `apps/mgbos` and `apps/teestock` share it.
- TeeStock storefront directly depends on `@mgbos/config: workspace:*` ([manifest](../../systems/mgbos/apps/teestock/package.json)); Next config imports the shared environment package.
- Its published catalogue server code currently reads MGBOS Supabase data using **server-side credentials**, explicit organization/brand/product filters and public projection ([source](../../systems/mgbos/apps/teestock/src/lib/published-catalog.server.ts)). Any independent storefront must replace/encapsulate that integration without exposing a service-role key in the browser.
- MGBOS migration guards, pnpm resolution, workflow paths, tests, migrations and preview/deployment configuration must migrate together. Do not rewrite applied SQL migration history.
- Separate `teestock` storefront only after the catalogue/order integration contract, auth, errors and independent build/release checks are proven. Do not invent service/API stability that has not been tested.

### P2 — Documentation, history and other code

- `README.md` and `AGENTS.md` identify Lean Feature Delivery as current; `docs/project-index.md` still contains stale engineering-program status fields. Treat index status claims as **needing reconciliation**, not current authority over implementation.
- Existing [directory migration plan](repository-migration-plan.md) covered moves **inside BisnisHub**, not multi-repository extraction. This proposal is a new effort, not a claim that the older plan failed.
- `systems/kaskita/` has a distinct Expo app and its own Supabase assets; extraction is structurally possible but lower priority.
- Keep `archive/`, historical PR links and session notes available. Splitting current files does **not** remove historical blobs from the original Git history; cleaning history would be a separate high-risk operation.

## 4. Execution sequence and evidence required

### Wave 0 — Reconcile current state (no production changes)

1. Save Git SHA, active branches/PR base+head and baseline CI results. For open stacked PRs determine `main` overlap before any action; do not bulk-close.
2. List runtime/deploy targets, owned environment variables by **name only**, protected settings, custom domains/origins, lockfiles, dependencies, SQL migrations and integration consumers. Never copy secret values to the report.
3. Record active local worktrees and untracked/ignored files with the owner before using a local Git extraction tool; connector access does not prove local state.
4. Verify the actual public Kitchen OS assets and real owner/staff login behaviour separately from CI. Current CI check success is not proof of device E2E or business data readiness.
5. Decide whether the F&B repository's first code scope is only Little Treat or the shared operator; default: a single `bite-boxes` repo with a Little Treat-first app and no premature multi-brand abstraction.

### Wave 1 — Kitchen repository, **after** Wave 0 gates

1. Create target repository under the existing owner with explicit chosen visibility and permissions.
2. Extract source and relevant history using a **disposable clone** and path filtering (e.g. `git filter-repo`); never rewrite `bisnishub/main` or force-push the original. Include appropriate business docs only after identifying their canonical owner. Check cross-links and LICENSE.
3. Recreate a minimal README/AGENTS and tests; update path references and CI in the target; keep a documented mapping from old to new commits/paths.
4. Build and test a **staging** deployment against a safe auth/data setup; check static allowlist, real login/logout/reload, staff restrictions, pricing safeguards, mobile and rollback.
5. Record current `gh-pages` commit and keep old site functional until controlled cutover is explicitly authorized. After successful cutover, update and smoke-test target URLs; preserve a rollback route.
6. Only then stop obsolete BisnisHub CI/publishing and replace old source location with navigation to the new authoritative repo. Keep original Git history intact.

### Wave 2 — MGBOS repo

Move the entire MGBOS workspace, including its current TeeStock app, with all pnpm/CI/db guards and root aliases accounted for. Reproduce install, check/build, browser smoke and disposable database tests. A code move does not imply DB migration, schema reset, payment changes or production release.

### Wave 3 — TeeStock repo

After server-to-server API/contract boundary and independent deployment are verified, move the retail app plus directly owned brand/product/Design Lab docs, preserving rights/audit provenance. Test customer browse, product data, stock/price truthfulness, and authorized order integration.

### Wave 4 — KasKita and portfolio cleanup

Extract KasKita only if it is still actively maintained. Update BisnisHub navigation, remove **confirmed** duplicate active files after all links/consumers are migrated, then selectively retire unused CI and agent ceremonies. Avoid mass deletion and history rewrite.

## 5. Stop / go rule for each wave

**GO** only when: exact source SHA, current target state, Git history approach, current deploy/URL, CI/tests, access-control boundaries, migration diff, rollback path and owner authorization for consequential switches are recorded.

**STOP** on: unresolved stacked PR changes; missing local-only data; unknown secret/config ownership; failed auth/RLS or money-integrity checks; broken existing URL without tested fallback; unknown database target; insufficient rollback; or a new external deployment/production data action that has not been authorized.

## 6. Deliberate non-goals of this PR

This planning PR **does not** create/delete/rename repositories, merge/close PRs, edit applications, switch production URLs, change Supabase/Vercel/GitHub Pages, expose secrets, apply database migrations, rewrite Git history, relax CI, or grant a release authorization.

Next bounded task: **Wave 0: reconcile the open Little Treat PR stack against `main`, verify existing release baseline, and produce a one-page extraction readiness verdict**. Do not begin Wave 1 until blockers are resolved.
