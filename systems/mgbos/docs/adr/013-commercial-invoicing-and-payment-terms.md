# 013. Commercial Invoicing, Payment Terms, and Balance Due Tracking

Date: 2026-09-25  
Status: Accepted  
Context: MultiGraph Business OS — Sprint 5 (Invoicing, Cash Movements & Analytical Ledger, MGBOS-014)

## Context and Problem Statement

Following the delivery of Order Contract Snapshots (MGBOS-011) and Shop-Floor Production Routing (MGBOS-012, MGBOS-013), commercial transactions must transition from production readiness to financial settlement.

In apparel manufacturing and corporate merchandise (MultiGraph, TeeStock, Squeegee Studios):

- Customers rarely pay 100% upfront in a single lump-sum without formal billing.
- Standard industrial practice operates on milestone payment terms:
  1. **DOWN_PAYMENT (DP):** Commonly 50% required before procuring raw blanks and commencing screen printing/DTF.
  2. **FINAL_PAYMENT (Pelunasan):** Remaining balance (50% + shipping fees / adjustments) billed upon QC inspection completion prior to outbound shipping.
  3. **FULL_PAYMENT:** 100% upfront payment for rapid retail or low-volume orders.
  4. **RETENTION:** Milestone for institutional B2B contracts (e.g. 5% held post-delivery).
- Currently, no formal invoice entity exists. Payment tracking cannot rely on informal chat notes or un-audited manual bank checks.

## Decision Drivers

- **Zero-Float Financial Consistency:** All monetary amounts (`amount_subtotal`, `amount_tax`, `amount_shipping`, `amount_total`, `amount_paid`, `balance_due`) must strictly use `bigint` integer rupiah.
- **Contract Sum Invariant:** The sum of active (non-void) invoices for a given order must never exceed the order contract's immutable `grand_total`.
- **Payment & Banking Snapshot Freezing:** Invoices must freeze customer billing details and official company bank account coordinates (Bank BCA/Mandiri, Account Number, Account Name, QRIS URL) at the moment of issuance (`ISSUED`), guaranteeing legal audit stability.
- **Invoice Snapshot Immutability:** Once an invoice is in `ISSUED` or `PAID` status, its financial amounts and line items cannot be updated or deleted. Revisions must follow an explicit `VOID` and reissue protocol.
- **Clear Role Separation:** Sales representatives can draft invoices (`invoices:create`), while official issuance and voiding require Finance, Admin, or Owner authorization (`invoices:issue`, `invoices:void`). Operations and QC hold read-only visibility (`invoices:read`) to verify payment milestones before releasing orders.

## Considered Options

1. **Directly Mutate `app.orders` Financial Status:** Track DP and Pelunasan as columns directly on `app.orders` without dedicated invoices.
   - _Rejected:_ Breaks multiple accounting and tax standards. An order may require multiple separate formal tax/commercial invoices with distinct due dates and payment terms.
2. **Coupled Invoice and Payment Allocation in a Single Table:** Combine invoices and bank payments into one entity.
   - _Rejected:_ Violates accounting separation of concerns (Receivable claims vs Cash mutations). Bank payments (MGBOS-015) can be partial, split, or combined across multiple invoices.
3. **Dedicated Commercial Invoices with Immutable Snapshots (Selected):**
   - Tables: `app.invoices`, `app.invoice_items`, `app.invoice_audit`.
   - Strict 1:N relationship from `app.orders` to `app.invoices`.
   - Formal invoice lifecycle: `DRAFT` $\to$ `ISSUED` $\to$ `PARTIALLY_PAID` $\to$ `PAID` (exceptions: `OVERDUE`, `VOID`, `CANCELLED`).
   - Tamper-proof database trigger `app.invoice_snapshot_guard`.

## Decision Outcome

Adopt Option 3.

### Schema Architecture

```text
┌────────────────────────┐
│       app.orders       │
└────────────────────────┘
            │
            │ 1:N
            ▼
┌────────────────────────┐       1:N       ┌────────────────────────┐
│      app.invoices      │ ─────────────── │   app.invoice_items    │
└────────────────────────┘                 └────────────────────────┘
            │
            │ 1:N
            ▼
┌────────────────────────┐
│   app.invoice_audit    │
└────────────────────────┘
```

### Invariants & Business Rules

1. **Canonical Invoice Numbering:** `{BRAND}-INV-{YEAR}-{SEQUENCE}` (e.g. `TS-INV-2026-000001`).
2. **Milestone Types:** `DOWN_PAYMENT`, `PROGRESS`, `FINAL_PAYMENT`, `FULL_PAYMENT`, `RETENTION`.
3. **Balance Due Arithmetic:** `balance_due = amount_total - amount_paid`.
4. **Order Ceiling:** $\sum \text{amount\_total}(\text{active invoices}) \le \text{order.grand\_total}$.
5. **Frozen Bank Coordinates:** Company bank details are permanently embedded into `bank_account_snapshot` upon transition to `ISSUED`.
