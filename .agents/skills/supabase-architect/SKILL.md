---
name: supabase-architect
description: >-
  Desain, implementasi, dan optimasi arsitektur database Supabase PostgreSQL
  untuk bisnis solopreneur multi-tenant. Gunakan untuk merancang skema database (DDL),
  konfigurasi Row Level Security (RLS), database triggers, stored procedures,
  database views kalkulasi margin, webhook integrasi ke n8n/Edge Functions,
  dan sinkronisasi data frontend React.
argument-hint: "[schema, rls, query, or migration]"
---

# Supabase Architect

Design schema, migrations, RLS, database functions and query behavior for the selected BisnisHub workspace. Establish database identity before any mutation.

## Select the database boundary

- **MGBOS:** read `mgbos/AGENTS.md`, architecture sources, `mgbos/package.json`, relevant migrations/tests and `mgbos/scripts/database.mjs`. Use only the workspace's local wrapper commands from `mgbos/`. Never follow root `supabase` or use a remote project for MGBOS work.
- **Legacy TeeStock:** inspect `bisnis/teestock/supabase`, existing migration history and consumers before selecting a migration directory or command. Historical SQL under `bisnis/teestock/database` is not proof it is the active migration source.
- Read applicable reports as historical evidence. If an old runbook describes infrastructure-only bootstrap but later migrations exist, preserve those migrations and derive the current schema from them; do not reset to the bootstrap description.

## Schema and transaction design

- Use canonical MGBOS `app`/`internal` boundaries and business model; do not impose legacy `ts_`, `mg_` or `tb_` prefixes or add unrelated business units.
- For legacy changes, preserve its existing names and numeric contract unless an explicit migration requires change. Do not automatically port schema conventions between workspaces.
- MGBOS money uses integer rupiah. Match database, validation and domain representations, including JSON serialization and safe bounds.
- Define constraints, foreign keys, uniqueness and indexes from actual invariants and query patterns. Do not blanket-cascade historical transactions.
- Critical related changes belong in an atomic database command. Enforce valid transitions, snapshot immutability, concurrency control and idempotency at the database boundary as required.
- External deliveries must not make an uncommitted transaction appear complete. Use the specified outbox/event mechanism; report missing implementation rather than claiming delivery guarantees.

## Authorization and data exposure

- Inspect grants, schema exposure, RLS, function execution permissions and caller identity together. RLS alone is not proof a command is authorized.
- Public catalog reads and order creation are different permissions. Do not add blanket guest order INSERT policies or accept user-controlled role/organization fields as authority.
- Use the established trusted role and membership checks. Test anonymous, ordinary authenticated, privileged and cross-organization callers as applicable; service-role tests cannot establish ordinary-user isolation.
- For privileged functions, constrain search_path, qualify objects, validate the actor and restrict execute grants. Do not solve access failures by broadly granting privileges.
- Keep service credentials server-side. Missing environment configuration must not fall back to a hardcoded production URL or project key.
- Views and RPC output must enforce the intended exposure boundary, including sensitive pricing and customer data.

## Migration and evidence

Create a new migration for schema changes; never rewrite applied SQL. Generate types from the real target local database through the existing generator, never by hand.

For MGBOS reproducibility checks, inspect the local runbook and wrappers, confirm the local target, then use the applicable `db:start`, `db:reset`, `db:test` and `db:types` scripts. Reset destroys local data and is only for an authorized reproducibility check or explicit reset request. Do not reset merely to inspect schema or edit instructions.

MGBOS forbids remote resets and production schema changes. For separately authorized legacy production changes, establish the exact project, create a structural/data snapshot and restore-test it before SQL; then verify preserved rows, policies, functions and critical flows. A successful SQL response is not sufficient evidence. Prefer a forward repair migration over destructive undo of financial history.

Report the migration, target environment, checks actually executed, isolation results, type generation and any blocked checks. Use the QA Skill for a broader regression plan when needed.
