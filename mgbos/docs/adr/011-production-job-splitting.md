# Multi-vendor production job splitting and execution routing

Date: 2026-09-25
Status: PROPOSED for MGBOS-012 local implementation

## Context

In bespoke apparel manufacturing (such as TeeStock Custom Atelier and MultiGraph holding brands), a customer order cannot be produced by a single linear factory process. A single confirmed order typically requires multiple specialized production jobs:

1. **Garment Procurement:** Sourcing blanks (NSA / Cotton Combed 24s/30s) from blank apparel mills/vendors.
2. **Decoration:** DTF printing & heat pressing in-house or screen printing via manual studio partners (Squeegee Studios).
3. **Packaging & Collateral:** Polymailer bag, branded hangtags, sticker packs, and corrugated master boxes (via NeoPack / Pack Point).

Furthermore, order lines and production jobs exhibit an M:N relationship: one order line (e.g. 100 pcs t-shirts) spans multiple jobs (1 garment job + 1 print job + 1 packaging job), while a single production job (e.g. gang sheet DTF print roll) may consolidate multiple order items.

## Decision

1. **Production Job Aggregate (`app.production_jobs` & `app.production_job_items`):**
   - Each production job is an atomic operational task linked to an order, numbered canonically: `{BRAND}-J-{YEAR}-{SEQUENCE}` (e.g. `TS-J-2026-000001`).
   - Categorized by `job_type`: `GARMENT`, `PRINTING`, `EMBROIDERY`, `PACKAGING`, `LABEL`, `FINISHING`, or `OTHER`.
   - Job items (`app.production_job_items`) link specific `order_items` with the allocated quantity.

2. **Isolated Operational State Machine:**
   - Production job statuses represent physical shop-floor lifecycle, independent of commercial order status:
     `PLANNED` $\to$ `READY` $\to$ `ASSIGNED` $\to$ `ACCEPTED` $\to$ `IN_PRODUCTION` $\to$ `AWAITING_QC` $\to$ `READY_FOR_HANDOFF` $\to$ `COMPLETED`.
   - Exceptions: `ON_HOLD`, `REWORK`, `CANCELLED`.
   - `READY` is mandatory before assignment to ensure artwork, technical specifications, and raw materials are verified before engaging internal executors or external vendors.

3. **Hybrid Executor Assignment (`app.production_assignments`):**
   - Jobs can be executed either internally (e.g. by another holding brand like Squeegee Studios or in-house studio) or externally by curated third-party vendors (`executor_type`: `'INTERNAL' | 'VENDOR'`).
   - Captures committed operational cost (`assigned_cost`), vendor identity, and acceptance status.

4. **Cost Trilogy Separation:**
   - `estimated_cost`: Cost predicted at quotation/job planning.
   - `committed_cost`: Agreed price upon executor assignment.
   - `actual_cost`: Realized disbursement recorded upon job completion.
   - Zero-Float arithmetic (`bigint` Rupiah) is maintained throughout.

5. **Authority Model:**
   - `OPERATIONS`, `ADMIN`, and `OWNER` roles hold full authority to create, schedule, assign, and transition production jobs.
   - `SALES`, `FINANCE`, and `QC` have read-only visibility into production jobs.

## Consequences

- Manufacturing operations are decoupled from commercial billing. An order being `CONFIRMED` or `ACTIVE` does not dictate whether its printing or blank garment procurement has started.
- Multi-brand synergy is realized: TeeStock orders can seamlessly route printing jobs to Squeegee Studios and packaging jobs to NeoPack as internal assignments.
- Downstream QC inspection (Sprint 4: MGBOS-013) can hook directly into the `AWAITING_QC` $\to$ `READY_FOR_HANDOFF` / `REWORK` transition.
