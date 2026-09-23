# MultiGraph Business OS — MGBOS-001

This is the Next.js/pnpm foundation specified by MGBOS 0.5.4 section 89.
It is a modular monolith with PostgreSQL/Supabase as its future business source of truth.
No business tables or login flow are implemented in this slice.

## Location and existing work

From the Bisnis Hub Git checkout, **cd mgbos** before running any command below.
The enclosing repository's apps/mgbos is a preserved Vite prototype.
This workspace does not modify the existing TeeStock storefront or production database.
Read [AGENTS.md](AGENTS.md), [audit](docs/engineering/pre-implementation-audit.md) and [ADR-007](docs/adr/007-workspace-coexistence.md).

## Prerequisites

- Node **22.23.2**, pinned in .node-version/.nvmrc.
- pnpm **10.34.5**, pinned in packageManager and engines.
- Running Docker-compatible runtime for local Supabase. First start downloads container images.
- Git and internet access for first dependency installation.

## Setup

Clone the Bisnis Hub repository using its existing remote, then:

```sh
cd mgbos
pnpm install --frozen-lockfile
pnpm db:start
pnpm dev
```

If the host pnpm differs, prefix commands with `npm exec --yes --package=pnpm@10.34.5 --`.
For example: `npm exec --yes --package=pnpm@10.34.5 -- pnpm check`.
This avoids changing global tooling. Use the pinned Node version for both installation and scripts.

Open http://localhost:3101. Run `pnpm dev:teestock` separately for http://localhost:3102.
Both shells work without credentials and make no database calls.
There is no fake login or owner session. Authentication belongs to MGBOS-003.

## Environment

Optional for MGBOS-001: copy each app's .env.example to .env.local **inside the same app**.
Next.js loads the app-local file, not this workspace root's example.
When connecting local Supabase in a later slice, copy its local URL and publishable key as a pair.
Leave service-role credentials empty unless an explicit server-only feature needs them.
Invalid URLs, incomplete public connection pairs and known secret-key prefixes fail startup/build.
Public parsing only returns the public schema; server environment modules use server-only guards.
No production credential is required to build or test.

## Commands

| Command                    | Purpose                                                              |
| -------------------------- | -------------------------------------------------------------------- |
| pnpm dev / dev:teestock    | Run MGBOS / public app                                               |
| pnpm build                 | Production build of both apps                                        |
| pnpm lint                  | ESLint including Next/React/TypeScript checks                        |
| pnpm typecheck             | Route type generation and strict TypeScript across all packages/apps |
| pnpm test / test:unit      | Vitest tests / shared-package tests                                  |
| pnpm format / format:check | Format / check this workspace only                                   |
| pnpm check                 | Format, lint, typecheck, test, build                                 |
| pnpm test:integration      | HTTP smoke tests; start both built apps first                        |
| pnpm db:start / db:stop    | Start / stop this workspace's local Supabase                         |
| pnpm db:reset              | Reset only local MGBOS database and reapply migrations/seed          |
| pnpm db:test               | Local database pgTAP tests                                           |
| pnpm db:types              | Generate types from local app/internal schemas                       |

After build, use two terminals: `pnpm --filter @mgbos/app start` and
`pnpm --filter @mgbos/teestock start`, then run `pnpm test:integration`.
Development servers bind to loopback. Health endpoints are liveness only, not database readiness.

## Structure

- apps/mgbos: internal bootstrap shell, port 3101.
- apps/teestock: public shell and Custom Atelier placeholder, port 3102.
- packages/domain, database, validation, auth, events, integrations, ai, ui: reserved private boundaries.
- packages/config: environment schema validation using Zod.
- supabase: config, infrastructure migration, empty seed, pgTAP checks.
- docs: source indexes, ADRs, audit, runbook and completion report.
- automation/n8n: documentation only.

Dependencies are exact-pinned with pnpm-lock.yaml. Next.js/React supply the application;
TypeScript/ESLint/Prettier/Vitest supply quality checks, Supabase supplies its project-local CLI,
Zod supplies environment validation, and server-only enforces import boundaries.
No ORM, provider SDK or workflow engine is installed.

## Database safety

See [local database runbook](docs/runbooks/local-database.md).
Never run commands against ../supabase: it is the legacy TeeStock link.
Database scripts fix the workdir and reject extra arguments; reset always uses --local.
Do not use link, remote reset, db push or production seeds as part of this task.
Only app/internal schemas are created. The seed intentionally creates no organization or business rows.

## CI and status

The enclosing repository's .github/workflows/mgbos-foundation.yml installs the frozen lockfile,
runs all code checks and HTTP smoke tests, then verifies local Supabase reset/tests/type generation.
It uses no production secrets. GitHub must run the workflow after these changes are committed and pushed.
See [completion report](docs/engineering/mgbos-001-report.md) for measured results and remaining gates.
MGBOS-002 is blocked until MGBOS-001 checks have actually passed.
