# MGBOS-001 execution report

Date: 2026-09-23

## Status

**Implemented; application checks pass. MGBOS-001 is not yet certified complete.**
Local Supabase execution is blocked by missing Docker/Podman, and hosted GitHub CI has not run.
MGBOS-002 was not started.

### Continuation findings

The continuation confirmed that Docker Desktop is not installed, firmware virtualization is reported disabled, and both WSL and Virtual Machine Platform are disabled. The current process is not an administrator. See the [Windows setup runbook](../runbooks/windows-database-prerequisites.md).

GitHub access is available, but the repository is public. A separate local review worktree on branch `codex/mgbos-001-foundation` is prepared for CI publication. It excludes the ten original business notes and every unrelated working-tree change. Public push/PR is pending the owner's decision; no hosted CI success is claimed.

The isolated review workspace passed a fresh frozen-lockfile installation and the full `pnpm check`: formatting, lint, strict types, all 11 tests and both production builds. Its staged diff passes `git diff --cached --check`. The review manifest contains 114 foundation files and excludes business notes, local environment files and build output. All 641 original source-file checksums still match the initial baseline.

## Audit and preservation

Located the saved Bisnis Hub project at C:/Users/Rizky/bisnishub.
Before editing, inspected Git status, root scripts, deployment, the Vite MGBOS prototype,
shared packages, source notes and the legacy Supabase link.
Recorded SHA-256 hashes of 641 existing tracked/untracked source files.
After implementation, all 641 hashes remained unchanged.

Added the new pnpm monorepo at mgbos/; no existing application, source note, SQL,
root package.json, npm lockfile or deployment configuration was changed.
The existing tracker reports completed slices that do not match 0.5.4. ADR-007 records
why those claims are not used as acceptance evidence.
The initial execution did not commit or push. The continuation prepares a local review commit only; no public push, deploy or remote database mutation has been performed.

## Repository structure and files

See [complete file inventory](mgbos-001-files.md).

- Root AGENTS.md routes MGBOS work to this workspace.
- mgbos/AGENTS.md defines architecture, state, money, migration, events, AI, testing and scope rules.
- package.json, pnpm-workspace.yaml, pnpm-lock.yaml, .npmrc, .node-version and .nvmrc pin the toolchain.
- tsconfig.base.json and tsconfig.tools.json enforce strict typing.
- eslint.config.mjs, Prettier configuration and vitest.config.ts provide quality gates.
- apps/mgbos is the new internal Next.js shell.
- apps/teestock provides home and Custom Atelier placeholders.
- Nine private packages: domain, database, validation, auth, events, integrations, ai, ui, config.
- Environment schemas are implemented in packages/config; other packages are reserved boundaries.
- scripts/database.mjs constrains database operations to this local workspace and rejects extra arguments.
- scripts/smoke.mjs checks both production servers.
- docs indexes all ten original blueprint notes, records seven ADRs, the audit and local setup runbook.
- .github/workflows/mgbos-foundation.yml, PR template and issue template live at the enclosing Git root.

## Runtime and dependencies

| Item                         | Pinned version |
| ---------------------------- | -------------- |
| Node                         | 22.23.2        |
| pnpm                         | 10.34.5        |
| Next.js / eslint-config-next | 16.3.6         |
| React / React DOM            | 19.3.0         |
| TypeScript                   | 5.9.3          |
| ESLint                       | 9.39.5         |
| Prettier                     | 3.9.9          |
| Vitest                       | 5.0.1          |
| Supabase CLI                 | 2.117.0        |
| Zod                          | 4.6.5          |
| server-only                  | 0.0.1          |

Type packages are also exact-pinned. The lockfile records transitive dependencies.
No ORM, microservice runtime, application AI SDK, Redis or production n8n workflow was added.

## Scripts

- dev, dev:teestock, build.
- lint, typecheck, test, test:unit, test:integration.
- format, format:check, check.
- db:start, db:stop, db:reset, db:types, db:test.

The host's bundled pnpm wrapper uses pnpm 11 and Node 24. Validation instead used:
`npm exec --yes --package=pnpm@10.34.5 -- pnpm <script>` under Node 22.23.2.
The normal documented pnpm commands work when prerequisites match the pinned versions.

## Supabase

CLI-generated config uses project ID mgbos-foundation and PostgreSQL 17.
Dedicated ports: API 55431, PostgreSQL 55432, shadow DB 55430, Studio 55433,
mail 55434, analytics 55437, inspector 55438, optional pooler 55439.
Auth signup is disabled. app/internal are not exposed in API schemas.
Migration 20260923000000_infrastructure.sql creates only app/internal schemas and revokes access.
seed.sql is intentionally empty: organization and brand records belong to MGBOS-002.
Four pgTAP assertions cover schemas and internal access. They are written but not runtime-verified.
Database type generation writes real introspected types; no generated file was fabricated.

Observed db:start failure:
`docker: command not found (podman also not found)`.
Therefore reset, seed execution, pgTAP tests and generated types remain unverified.
TOML parsing and project/port/signup/seed/API configuration assertions passed.

## CI

Workflow has application and database jobs on Ubuntu 24.04, pinned Node/pnpm and frozen installation.
Application job runs formatting, lint, strict types, tests, both builds and production HTTP checks.
Database job starts local Supabase, resets it, runs pgTAP, generates types twice and compares them,
uploads generated types as an artifact and stops the local stack.
PRs use no production secrets; permissions are contents:read.
No hosted run has occurred because changes have not been committed/pushed.
Branch protection is an external repository setting and was not configured.

## Verification results

| Check                           | Result                                                                  |
| ------------------------------- | ----------------------------------------------------------------------- |
| pnpm install --frozen-lockfile  | PASS                                                                    |
| pnpm format:check               | PASS                                                                    |
| pnpm lint                       | PASS, zero warnings                                                     |
| pnpm typecheck                  | PASS, tooling plus all 11 child packages/apps                           |
| pnpm test                       | PASS, 11 tests in 2 files                                               |
| pnpm build                      | PASS, both production apps                                              |
| Production HTTP smoke           | PASS: both home pages, Custom Atelier, both health endpoints, both 404s |
| pnpm dev and GET /              | PASS, MGBOS returns HTTP 200                                            |
| Original-file hash comparison   | PASS, 641/641 unchanged                                                 |
| Canonical source links          | PASS, all ten resolve                                                   |
| Supabase config parse           | PASS                                                                    |
| Local Supabase start            | BLOCKED: Docker and Podman absent                                       |
| DB reset / seed / pgTAP / types | NOT VERIFIED                                                            |
| Hosted GitHub CI                | NOT RUN                                                                 |

Tests cover optional bootstrap environment, invalid URLs, incomplete public configuration,
secret stripping, modern secret keys, legacy service-role JWT rejection, redacted errors,
and rejection of remote/unsupported database command arguments.
An initial URL refinement error was caught by tests and fixed before the passing run.
The unrelated pre-existing root Command Center document has trailing whitespace reported by
git diff --check; it was preserved.

## Known limitations and next gate

- Install/start a Docker-compatible runtime, then run db:start, db:reset, db:test and db:types.
- Commit/review/push the new files and original referenced notes as appropriate, then verify hosted CI.
- Until both gates pass, do not claim MGBOS-001 complete or proceed to MGBOS-002.
- ESLint 9.39.5 is deprecated upstream but matches the current Next.js plugin peer ranges; ESLint 10 produced peer incompatibility warnings. Revisit when those plugins support it.
- Installation reports an ignored unrs-resolver build script. Its optional native dependency resolved and lint passed on this host; Linux is still subject to CI verification.
- No authenticated routes, owner membership, organization data, atomic document numbering or business workflow is claimed.
- Apps are bootstrap placeholders, not production-ready business applications. /health reports liveness only.
- Existing legacy applications were preserved, not regression-tested as part of this separate workspace.

## Manual run

From C:/Users/Rizky/bisnishub/mgbos:

```sh
pnpm install --frozen-lockfile
pnpm db:start
pnpm dev
```

Open http://localhost:3101. For the public placeholder use pnpm dev:teestock and port 3102.
Read README for the pnpm-version fallback and app-local environment setup.
Test servers started during verification were stopped.

## References used for tooling

- [Next.js installation](https://nextjs.org/docs/app/getting-started/installation)
- [Supabase CLI local development](https://supabase.com/docs/guides/local-development/cli/getting-started)
- Version and compatibility metadata were checked against the npm registry and installed CLI help.
