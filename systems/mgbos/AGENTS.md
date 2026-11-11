# MGBOS / TeeStock — Engineering Instructions

Default workflow: [BisnisHub Lean Feature Delivery](../../docs/engineering/lean-feature-delivery.md). Implement one small, usable feature directly when authorized; no mandatory ATLAS/ORION/Antigravity handoff, planner/auditor role rotation, change package or per-feature documentation packet.

## Understand the relevant code

MGBOS is a TypeScript modular monolith in `systems/mgbos/`, using pnpm, Next.js and PostgreSQL/Supabase. TeeStock storefront lives in `apps/teestock/`. Read only the relevant existing source, tests, interface and business contracts for the feature. Preserve module boundaries and use package public exports. Keep TypeScript strict; avoid `any`, unneeded dependencies and broad refactors.

## Business integrity — mandatory

- PostgreSQL/Supabase is business source of truth. Server-side business commands validate authenticated authorization; never trust UI or AI output for important state changes.
- Keep tenant/organization isolation and RLS. A merchant or customer must not access or mutate unrelated orders or brands.
- Orders, quotes, invoices/payments, production, QC and shipment must respect existing state transitions and historical immutability. Do not bypass server commands with direct UI writes.
- Money is represented as integers. Preserve duplicate/idempotency protections, transactional integrity and an audit trail for consequential changes.
- Initial QRIS checkout direction: existing merchant QRIS and **manual admin confirmation only**. A unique three-digit suffix or uploaded proof is **not** confirmation. Any adjustment of amount requires separate validation against merchant policy, collisions, expiry and margin. Do not integrate gateway/webhook or automate payment confirmation unless explicitly requested.
- Migrations are additive/versioned as needed; never rewrite applied migrations or generated schema types by hand.

## Environment and safety — mandatory

- Use only local/test Supabase credentials under this workspace. Do not traverse legacy root Supabase.
- No destructive remote DB commands, production schema changes, seeding, deletion of history or use of privileged credentials in client code.
- Local destructive service-role E2E requires the existing explicit `MGBOS_DESTRUCTIVE_LOCAL_E2E=1` guard and a verified disposable local target. Never bypass guards.
- Production deploys, live payments and customer-data mutation require separate explicit authorization; code approval alone does not grant it.

## Verification scaled to the change

- **Normal UI/feature:** relevant typecheck, targeted tests, build/smoke as applicable, mobile/desktop UX and accessibility where applicable.
- **Sensitive behavior:** additionally test authorization, organization isolation, invalid states, duplicate requests, money boundaries, failure atomicity and concurrency where applicable.
- **Migrations/security/production:** verify appropriate migration, security and recovery gates. Do not weaken CI or existing security checks.
- Clearly distinguish `tested`, `not run`, `merged` and `deployed`. Never claim unverified runtime behavior.
- Keep changed paths focused; follow GitHub branch protection and PR gates where applicable. Update product docs/runbooks only when behavior, operation or architecture materially changes.

Older [agent workflow](docs/engineering/agent-system/workflow.md), [risk documentation](docs/engineering/agent-system/risk-classification.md) and [release gates](docs/engineering/agent-system/release-gates.md) remain technical references and apply to **explicitly resumed legacy packages or elevated work where relevant**; they are not mandatory paperwork for ordinary new feature delivery.
