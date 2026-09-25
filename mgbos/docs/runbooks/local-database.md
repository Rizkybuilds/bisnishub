# Local Supabase runbook

Run only from `mgbos/` with pinned Node/pnpm and a Docker-compatible runtime. Use the workspace CLI, never the root legacy Supabase link.

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

## Current configuration and evidence

Project: `mgbos-foundation`. API 55431, database 55432, shadow database 55430, Studio 55433. Verify against `supabase/config.toml` when configuration changes.

Authentication and business migrations now exist. The local API lists `app`, but not `internal`. Exposure does not grant authorization: verify grants, RLS and server commands independently. Never expose service credentials to browsers.

Inspect actual migrations and local history for current scope. Docker failure or unapplied migrations means verification is incomplete, not waived. Follow [maintenance policy](../engineering/maintenance-policy.md) and [backup guidance](backup-and-restore.md).
