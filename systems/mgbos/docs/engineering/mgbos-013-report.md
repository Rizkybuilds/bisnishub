# MGBOS-013 — Vendor Directory, Capability Rate Cards, and Digital QC Inspections

Implemented locally on 2026-09-25. Third and final vertical slice of Sprint 4 (Order & Production Routing).

## Delivered

1. **Vendor Directory (`app.vendors`):**
   - Tables created in `supabase/migrations/20260925130000_vendor_network_and_qc.sql`:
     - Centralizes certified subcontractors and suppliers across industry categories: `GARMENT_SUPPLIER`, `PRINT_STUDIO`, `EMBROIDERY`, `PACKAGING`, `TRIMS_LABELS`, `LOGISTICS`, `OTHER`.
     - Standardized payment terms: `COD`, `NET_7`, `NET_14`, `NET_30`, `DP_50_50`.
     - Lead time tracking in working days (`lead_time_days`).
     - Stored procedure `app.create_vendor` with organization-scoped uniqueness on vendor code (`unique(organization_id, code)`).

2. **Contractual Rate Cards (`app.vendor_rate_cards`):**
   - Stores service codes, descriptions, units of measure (`meter`, `pcs`, `cm`, `sheet`, `roll`, `lot`), and unit costs.
   - Enforces Zero-Float arithmetic (`bigint` integer rupiah) for `unit_cost`.
   - Minimum Order Quantity (MOQ) tracking.
   - Stored procedure `app.upsert_vendor_rate_card` with automatic active flag updates on conflict.

3. **Digital QC Inspection Gate & Defect Tracking (`app.qc_inspections`):**
   - Standardized QC inspection outcomes: `PASS`, `REWORK`, `REJECTED`.
   - Canonical QC document numbering: `{BRAND}-QC-{YEAR}-{SEQUENCE}` (e.g. `TS-QC-2026-000001`).
   - Defect taxonomy:
     - Categories: `FABRIC`, `PRINT_MISALIGNMENT`, `COLOR_SHIFT`, `ADHESION`, `SIZING`, `FINISHING_PACKAGING`, `OTHER`.
     - Severity: `MINOR`, `MAJOR`, `CRITICAL`.
   - Sample size vs defect count integrity validation.
   - Stored procedure `app.record_qc_inspection`:
     - Authorized for `QC`, `OPERATIONS`, `ADMIN`, and `OWNER` roles.
     - Atomically records inspection records and transitions the target `app.production_jobs` status:
       - `PASS` $\to$ transitions job to `READY_FOR_HANDOFF`.
       - `REWORK` $\to$ transitions job to `REWORK` with mandatory rework instructions.
       - `REJECTED` $\to$ transitions job to `ON_HOLD` for executive review.
     - Logs inspection details to append-only `app.production_job_audit`.

4. **Internal Application & Operations UI (`apps/mgbos`):**
   - Sidebar: Activated `Vendor Network` (`/vendors`) navigation link (gated with `vendors:read`).
   - Vendor Overview (`/vendors`): KPI cards (Total Vendors, Garment Suppliers, Print Studios, Packaging), category badges, and `<VendorCreateModal>`.
   - Vendor Detail (`/vendors/[vendorId]`): Contact and commercial profile, contractual rate cards table, and `<RateCardModal>`.
   - Production Job Integration (`/production/[jobId]`):
     - Embedded `<QcInspectionModal>` for real-time digital inspection entry when jobs are in `AWAITING_QC`, `IN_PRODUCTION`, or `REWORK`.
     - Chronological QC inspection cards displaying pass/rework status, defect categories, severity, and rework instructions.

## Verification

- **Unit & Domain Tests (Vitest):** 151 passed across 31 test files (17 new tests covering vendor validation, Zero-Float rate card math, QC defect validation, and role permissions).
- **Typecheck & Lint:** 100% strict TypeScript passed across all 11 workspace packages and Next.js applications; ESLint 0 warnings.
- **Production Builds:** Both `@mgbos/app` and `@mgbos/teestock` built successfully with Turbopack.
- **Database Migrations & pgTAP:** 20 pgTAP assertions in `supabase/tests/vendor_network_and_qc.test.sql` verifying vendor creation, rate card upsert, canonical QC numbering, and QC-driven state progression.

## Milestone: Sprint 4 Certified Complete

With the delivery of MGBOS-011, MGBOS-012, and MGBOS-013, **Sprint 4 (Order Contract Snapshot, Production Routing & QC)** is officially certified complete. The system now possesses:

1. Frozen commercial order contracts converted from accepted quotes.
2. Decomposition of order items into multi-vendor shop-floor SPKs.
3. Centralized vendor capability directory with contractual rate cards.
4. Digital QC gate with structured defect taxonomy and automatic status progression.

## Next Sprint

- **Sprint 5: Invoicing, Cash Movements & Analytical Ledger**
  - **MGBOS-014**: Commercial Invoicing & Payment Terms (DP 50% vs Pelunasan).
  - **MGBOS-015**: Payment Recording & Allocation (Bank mutations & cash-in).
  - **MGBOS-016**: Analytical Financial Events & Realized Margin Calculation.
