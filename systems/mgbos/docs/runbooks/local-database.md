# Local Supabase runbook

Run only from `systems/mgbos/` with pinned Node/pnpm and a Docker-compatible runtime. Use the workspace CLI, never the root legacy Supabase link.

## Normal startup: preserve data

1. `pnpm install --frozen-lockfile`
2. `pnpm db:start`
3. Compare local migration history with `supabase/migrations/` before using new features. Startup does not prove pending migrations were applied.
4. Run applicable `pnpm db:test` checks. Tests must isolate/roll back fixtures; inspect custom verification scripts for persistent writes before running them.
5. `pnpm db:types` after a verified schema change; inspect the generated diff.
6. `pnpm db:stop` when finished; this preserves local data.

If host pnpm differs, use `npm exec --yes --package=pnpm@10.34.5 -- pnpm <command>` from this workspace.

## Upgrade and reproducibility

Create new timestamped migrations; never edit applied SQL or fabricate generated types. Verify local project identity, migration history, pending SQL and data preservation before applying changes. Use a reviewed local-only procedure; do not substitute remote push/link commands.

Reset is **not** normal startup or upgrade. `pnpm db:reset` destroys local MGBOS data; use only for an explicit reset request or scoped reproducibility checks on disposable data. Preserve needed data and verify the target first. CI may reset its disposable database. Test upgrades as well as clean reconstruction when changing business schema.

## Destructive local E2E verification

The following end-to-end verification and concurrency scripts are destructive to the local disposable MGBOS dataset:

- `pnpm test:e2e:happy` (`scripts/verify-happy-path-e2e.mjs`)
- `pnpm test:e2e` (`scripts/verify-e2e-flow.mjs`)
- `node scripts/test-document-concurrency.mjs`

These scripts execute real business transactions (leads, orders, invoices, payments, shipments, ledger entries, and sequence generation) with service-role authority. They:

- **cannot** target hosted Supabase (staging, production, or remote projects)
- **require** the explicit one-shot acknowledgement `MGBOS_DESTRUCTIVE_LOCAL_E2E=1`
- **only accept** the canonical local Supabase target: `http://127.0.0.1:55431`
- **reject** non-local service-role credentials (only the canonical local development key is accepted)
- **do not** automatically reset or clean local data; run `pnpm db:reset` beforehand if starting from a fresh baseline

### One-shot execution examples

POSIX:

```sh
MGBOS_DESTRUCTIVE_LOCAL_E2E=1 pnpm test:e2e
```

PowerShell:

```powershell
$env:MGBOS_DESTRUCTIVE_LOCAL_E2E = "1"
try {
  pnpm test:e2e
}
finally {
  Remove-Item Env:MGBOS_DESTRUCTIVE_LOCAL_E2E -ErrorAction SilentlyContinue
}
```

If the shell environment currently contains hosted `NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY`, the test intentionally refuses to start and fails closed. Never bypass this guard or inject remote credentials.

## Current configuration and evidence

Project: `mgbos-foundation`. API 55431, database 55432, shadow database 55430, Studio 55433. Verify against `supabase/config.toml` when configuration changes.

Authentication and business migrations now exist. The local API lists `app`, but not `internal`. Exposure does not grant authorization: verify grants, RLS and server commands independently. Never expose service credentials to browsers.

Inspect actual migrations and local history for current scope. Docker failure or unapplied migrations means verification is incomplete, not waived. Follow [maintenance policy](../engineering/maintenance-policy.md) and [backup guidance](backup-and-restore.md).
