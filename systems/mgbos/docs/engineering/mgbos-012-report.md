# MGBOS-012 — Production Job Splitting, SPK Decomposition, and Shop-Floor Routing

Implemented locally on 2026-09-25. Second vertical slice of Sprint 4 (Order & Production Routing).

## Delivered

1. **Production Job (SPK) Data Architecture (`app.production_jobs` & `app.production_job_items`):**
   - Tables created in `supabase/migrations/20260925120000_production_job_splitting.sql`:
     - `app.production_jobs`: Manages shop-floor task decomposition (Surat Perintah Kerja / SPK) for specialized operations (`GARMENT`, `PRINTING`, `EMBROIDERY`, `PACKAGING`, `LABEL`, `FINISHING`, `OTHER`).
     - Canonical SPK document numbering following `{BRAND}-J-{YEAR}-{SEQUENCE}` (e.g. `TS-J-2026-000001`).
     - `app.production_job_items`: M:N relationship linking jobs to parent `app.order_items` with item-specific allocated quantities.
     - `app.production_assignments`: Tracks internal brand partner assignment (e.g. Squeegee Studios for screen printing, MultiGraph for packaging) or external vendor execution.
     - `app.production_job_audit`: Append-only audit log capturing actor IDs, action timestamps, and contextual details.

2. **Decoupled Shop-Floor State Machine:**
   - Formal operational state progression implemented in `packages/domain/src/production.ts` and enforced via stored procedure `app.transition_production_job_status`:
     - `PLANNED` $\to$ `READY` $\to$ `ASSIGNED` $\to$ `ACCEPTED` $\to$ `IN_PRODUCTION` $\to$ `AWAITING_QC` $\to$ `READY_FOR_HANDOFF` $\to$ `COMPLETED`.
     - Exception and rework loops: `ON_HOLD`, `REWORK`, and `CANCELLED`.
   - Independence from commercial order lifecycle: individual sub-jobs progress physically without mutating the parent commercial contract status.

3. **The Cost Trilogy Enforcement:**
   - Strict Zero-Float arithmetic (`bigint` integer rupiah) isolating:
     - `estimated_cost`: Baseline manufacturing HPP target from the accepted quote.
     - `committed_cost`: Agreed work order / purchase order cost upon assignment.
     - `actual_cost`: Final invoiced or billed execution cost.

4. **Internal Application & Shop-Floor UI (`apps/mgbos`):**
   - Activated `Production & QC` navigation link in sidebar layout (gated by `production:read`).
   - SPK Overview page at `/production` displaying real-time KPI metrics (Total SPK, In Production, QC & Handoff, Completed), category filters, and priority badges.
   - SPK Detail page at `/production/[jobId]` featuring:
     - Allocated order item breakdown.
     - Technical specifications and pre-press instructions.
     - Shop-Floor assignment form and status card (`<JobAssignForm>`).
     - State machine transition action buttons (`<JobTransitionButton>`).
     - Cost Trilogy financial card and parent order link.
     - Chronological audit log.
   - Order Contract Integration:
     - Integrated `<JobCreateModal>` into `/orders/[orderId]` enabling 1-click sub-job splitting from confirmed order line items.
     - Real-time SPK breakdown table on order detail view.

## Verification

- **Unit & Domain Tests (Vitest):** 134 passed across 26 test files (10 new tests for production state machine transitions, cost validations, Zod schemas, and RBAC matrix).
- **Typecheck & Lint:** 100% strict TypeScript passed across all 11 workspace packages and Next.js applications; ESLint 0 warnings.
- **Production Builds:** Both `@mgbos/app` and `@mgbos/teestock` built successfully with Turbopack.
- **Database Migrations & pgTAP:** 24 pgTAP assertions in `supabase/tests/production_job_splitting.test.sql` verifying SPK creation, item allocation, assignment constraints, cost invariants, and status state machine rules.

## Boundaries & Next Slices

- Next Slice: **MGBOS-013: Vendor Directory, Capabilities & Rate Cards**.
  - Centralize external subcontractor and material vendor profiles.
  - Define capability tags (e.g. DTF roll printing, screen printing, embroidery, polymailer packaging) and contractual rate cards.
  - Link vendor assignment directly from `app.production_assignments`.
