# 012. Vendor Directory, Capability Rate Cards, and Digital QC Inspections

Date: 2026-09-25  
Status: Accepted  
Context: MultiGraph Business OS — Sprint 4 (Order & Production Routing, MGBOS-013)

## Context and Problem Statement

Following the delivery of Order Contract Snapshots (MGBOS-011) and Production Job Splitting (MGBOS-012), the shop-floor execution engine requires two essential structural components:

1. **External Subcontractor and Supplier Network:** In MGBOS-012, production jobs can be assigned to either internal holding brands or external vendors (via free-text `vendor_name`). To control costs and build reliable supply chains, external vendors must be formalized into a centralized directory with category capabilities (`GARMENT_SUPPLIER`, `PRINT_STUDIO`, `EMBROIDERY`, `PACKAGING`, `TRIMS_LABELS`, `LOGISTICS`) and contractual rate cards (`unit_cost` in Zero-Float `bigint` rupiah).
2. **Standardized QC Inspection Gate:** Before sub-jobs reach completion (`READY_FOR_HANDOFF`), they must undergo physical quality assurance. Currently, the transition from `AWAITING_QC` to `READY_FOR_HANDOFF` or `REWORK` is manual. Without structured inspection records (sample size, defect count, defect category, severity, and rework instructions), defect metrics cannot be audited, and vendor defect accountability is lost.

## Decision Drivers

- **Zero-Float Financial Consistency:** Vendor rate cards and rework cost assessments must use immutable `bigint` integer rupiah.
- **Defect Accountability:** Every rejected or reworked job must record who inspected it, when, what defects were found, and the specific rework instructions.
- **Atomic State Progression:** Recording a QC inspection with result `PASS` must advance the job to `READY_FOR_HANDOFF`. A result of `REWORK` must transition the job to `REWORK` and record audit details in a single atomic database transaction.
- **Role Authority:** QC inspectors must be empowered to inspect and record results (`qc:create`), while vendor contract terms and rate cards are managed by operations and executive leadership (`vendors:create`, `vendors:update`).

## Considered Options

1. **Ad-hoc Text Notes on Production Jobs:** Continue using free-text notes on `production_jobs` for vendor rates and QC results.
   - _Rejected:_ Destroys vendor performance analytics, provides no rate lookup, and fails COO quality audit standards.
2. **Coupled Vendor & Customer Model:** Reuse `app.customer_accounts` for vendors by adding a `type: 'CUSTOMER' | 'VENDOR'` flag.
   - _Rejected:_ Breaks bounded context separation. Vendors have lead times, capacity ratings, contractual rate cards, and technical capabilities that are completely foreign to customer CRM accounts.
3. **Dedicated Vendor Network & Formal QC Inspection Entity (Selected):**
   - Independent `app.vendors` and `app.vendor_rate_cards` tables.
   - Independent `app.qc_inspections` table linked to `production_job_id`.
   - Automated status transition triggered by `app.record_qc_inspection`.

## Decision Outcome

Adopt Option 3.

### Schema Architecture

```text
┌─────────────────┐       1:N       ┌────────────────────────┐
│   app.vendors   │ ─────────────── │ app.vendor_rate_cards  │
└─────────────────┘                 └────────────────────────┘
         │
         │ 1:N (optional reference)
         ▼
┌──────────────────────────┐       1:N       ┌───────────────────────┐
│ app.production_assign... │ ─────────────── │  app.production_jobs  │
└──────────────────────────┘                 └───────────────────────┘
                                                         │
                                                         │ 1:N
                                                         ▼
                                             ┌───────────────────────┐
                                             │  app.qc_inspections   │
                                             └───────────────────────┘
```

### Invariants & Business Rules

1. **Vendor Canonical Code:** `{VND}-{CATEGORY_SHORT}-{SEQ}` (e.g. `VND-GAR-001`, `VND-PRN-001`).
2. **QC Inspection Numbering:** `{BRAND}-QC-{YEAR}-{SEQUENCE}` (e.g. `TS-QC-2026-000001`).
3. **QC Inspection Gate:**
   - Only jobs in `AWAITING_QC` (or active production) can be inspected.
   - Result `PASS`: Advances job to `READY_FOR_HANDOFF`.
   - Result `REWORK`: Advances job to `REWORK` and stores mandatory defect category, severity, and rework instructions.
4. **Rate Card Immutability:** Rate cards define active unit costs for quoting and commitment calculations.
