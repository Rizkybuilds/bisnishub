---
name: web-qa-testing
description: >-
  Merancang dan menjalankan pengujian berbasis risiko untuk aplikasi legacy dan
  MGBOS: UI, domain, otorisasi, transaksi, database, dan regresi. Gunakan untuk
  validasi perubahan atau audit kualitas dengan bukti lokal dan CI yang terpisah.
argument-hint: "[e2e, test, playwright, vitest, qa, or regression]"
---

# Web QA & Business Integrity Testing

Choose tests by the failure being prevented and the actual workspace. Do not enforce a fixed unit/integration/E2E percentage or count formatting tests as transaction assurance.

## Inspect before running

Read applicable `AGENTS.md`, package scripts, test configuration, changed code and existing fixtures. Record target environment and revision or working-tree scope. Never point transactional tests at production by default.

- **MGBOS:** `mgbos/`, not root `apps/mgbos/`. Follow foundation/prerequisite gates. Read canonical specifications and the affected migration, domain, authorization and validation code.
- **Legacy storefront:** `bisnis/teestock/web`; inspect its Vitest/Playwright scripts and actual routes/selectors.
- **Legacy admin:** `apps/bisnishub-web`; inspect its test/build/database scripts. Check shared-code consumers when `packages/shared` changes.

## Select meaningful coverage

| Risk | Evidence to seek |
| --- | --- |
| Price, tax, discount, HPP, margin | Exact expected calculations, rounding boundaries, zero/negative inputs, safe integer bounds and shipping treatment |
| Critical state change | Allowed and forbidden transitions, immutable snapshots, authorized actor and persisted effects |
| Access control | Anonymous, ordinary user, relevant roles and cross-organization resource attempts through the real access boundary |
| Payment or webhook | Invalid signatures/totals, duplicate and concurrent events, ordering, atomic ledger/allocation effects and recovery |
| Inventory/production | Reservation versus consumption, insufficient stock, concurrent updates, QC effects and rollback |
| Migration | Clean reproducibility where authorized, upgrade of representative existing data, constraints, grants/RLS and genuine generated types |
| UI/checkout | Keyboard/focus, responsive layout, validation, slow/failing requests and complete persisted outcome |

A disabled submit button is not server idempotency. An enabled pay button is not a completed checkout. Use stable observed selectors and realistic fixtures; verify the intended order/payment result rather than merely successful navigation.

## Workspace checks

For MGBOS application changes, use the pinned Node/pnpm versions in its package files and run `pnpm check`, production HTTP smoke checks through `pnpm test:integration`, and applicable database checks. Inspect each script's prerequisites before running. `pnpm check` does not include hosted CI, database tests or the production HTTP smoke script.

Database verification must use the local MGBOS wrappers and a Docker-compatible runtime. Reset only for authorized reproducibility or an explicit request; it destroys local development data. If runtime or prerequisites are missing, report database checks as blocked, not passed. Read historical runbooks alongside current migrations.

For legacy applications, run the actual existing package scripts for the affected app and shared consumers. Mocked database tests do not prove deployed RLS or payment behavior; explain the coverage boundary.

For documentation or Skill-only changes, check instructions, references, metadata and diff. Do not run the application suite or add tests that merely match prose.

## Reporting

Distinguish NOT RUN, BLOCKED, FAIL and PASS. Separate tests defined from tests executed; local checks from hosted CI; build artifacts from deployment. Include command, environment, result and material limitations without exposing secrets.

After required checks pass, repeat or broaden only for new changes, failures or an unresolved risk. Preserve unrelated work and test data. Do not infer acceptance from a README badge, historical totals or existing later-slice code.
