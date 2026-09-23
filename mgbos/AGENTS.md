# MultiGraph Business OS Engineering Rules

Read README, the source index in docs, the relevant specification, state machine, migration and tests before editing.
MGBOS is a TypeScript modular monolith in a pnpm monorepo. PostgreSQL/Supabase is the business source of truth.
Next.js is the application layer; packages/domain owns business rules without framework or database imports.
Use package public exports across boundaries. No cross-package relative imports, circular dependencies or broad generic services.
Use strict TypeScript. Narrow unknown values; do not bypass checks with any.

## Business integrity

Critical mutations go through authenticated, authorized and validated server commands.
Never update order, quote, payment, production, QC or shipment state directly from UI or automation.
Canonical state machines come from the source notes, not UI labels.
Sent quote versions and historical transaction snapshots are immutable.
Money uses integer representation, never floating-point arithmetic.
Business events use the canonical envelope; critical state changes eventually commit with transactional outbox and audit.
External integrations must be idempotent. AI output is not authoritative business data.
n8n is orchestration only. No AI provider calls inside domain code.

## Database and secrets

Every schema change needs a new migration. Never edit applied migrations or generated database types.
Use only this workspace's local Supabase commands. Never traverse the legacy Supabase link.
No remote reset, production schema modification, hard-delete of history or production seeding.
Use local/test credentials in PR CI; never expose service credentials to browsers.
Local reset is destructive to this workspace's local data: use it only for reproducibility checks or an explicit local reset request.

## Scope and verification

MGBOS-001 includes skeletons, tooling, local database infrastructure, docs and CI only.
No business tables, authentication business flow, ORM, microservices, Redis, AI SDK or production n8n workflow.
Do not copy the legacy prototype's simulated identity, brand switcher or premature module menus.
Do not start MGBOS-002 until MGBOS-001 checks, including local database and CI, are verified.
Run pnpm check, production smoke tests and applicable database checks. Report failures honestly.
Critical business rules require tests. Preserve unrelated work. No broad refactors.
Architecture changes require an ADR and explicit scope. Add dependencies only for a concrete requirement.
