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

The historical MGBOS-001 scope was skeletons, tooling, local database infrastructure, docs and CI only; business tables and authentication business flows were excluded from that slice.
For later slices, read the applicable canonical specification and `docs/engineering/mgbos-*-report.md` before choosing scope. Preserve existing later-slice work; its presence is not acceptance evidence.
Do not introduce ORM, microservices, Redis, AI SDK or production n8n workflows without an explicit requirement and applicable architecture decision.
Do not copy the legacy prototype's simulated identity, brand switcher or premature module menus.
Do not start MGBOS-002 until MGBOS-001 checks, including local database and CI, are verified.
This foundation gate remains an acceptance requirement for subsequent work. When a prerequisite is unverified, report the missing evidence and limit work to the authorized audit, maintenance or gate remediation; do not infer a waiver from existing code or README status.
Distinguish implementation, tests defined, tests executed, hosted CI and deployment. Reports record prior evidence; verify current results before claiming a gate passes.
For application changes, run pnpm check, production smoke tests and applicable database checks. For instruction-only changes, validate scope, references and instruction consistency; do not reset databases or run application deployments for documentation maintenance. Report failures honestly.
Critical business rules require tests. Preserve unrelated work. No broad refactors.
Architecture changes require an ADR and explicit scope. Add dependencies only for a concrete requirement.

## Maintenance and operational readiness

Follow [maintenance policy](docs/engineering/maintenance-policy.md) for all changes and its linked runbooks for release, backup and incident work. These documents do not authorize remote actions or override the local-only database boundary.
For transaction changes, test authorization, organization isolation, invalid states, money boundaries, duplicate requests, failure atomicity and concurrency where relevant. Test the application command boundary, not only domain functions or SQL.
Keep implementation, local verification, hosted CI, deployment and operational acceptance as separate evidence states tied to a revision. Fix blockers affecting money, access, data integrity or recovery before expanding the affected flow.
Before operational use, require verified environment isolation, backup and restore evidence, monitoring ownership and a recovery plan. Written procedures do not prove services are configured.
Update affected module status and runbooks with each change. Documentation-only maintenance requires link, consistency and focused diff checks, not database mutations or deployments.
