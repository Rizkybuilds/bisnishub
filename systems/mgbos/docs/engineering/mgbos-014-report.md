# MGBOS-014 — Commercial Invoicing, Milestone Payment Terms & Financial Freezing

Implemented locally on 2026-09-25. First vertical slice of Sprint 5 (Invoicing, Cash Movements & Analytical Ledger).

## Delivered

1. **Commercial Invoices Schema (`app.invoices`, `app.invoice_items`, `app.invoice_audit`):**
   - Tables created in `supabase/migrations/20260925140000_commercial_invoicing.sql`:
     - Standard invoice milestones: `DOWN_PAYMENT`, `FINAL_PAYMENT`, `FULL_PAYMENT`, `PROGRESS`, `RETENTION`.
     - Standard invoice statuses: `DRAFT`, `ISSUED`, `PARTIALLY_PAID`, `PAID`, `OVERDUE`, `VOID`, `CANCELLED`.
     - Canonical document numbering: `{BRAND}-INV-{YEAR}-{SEQUENCE}` (e.g. `TS-INV-2026-000001`).
     - Zero-Float arithmetic (`bigint` integer rupiah) for `amount_subtotal`, `amount_tax`, `amount_shipping`, `amount_total`, `amount_paid`, and `balance_due`.
     - Pass-through shipping isolation (`amount_shipping`) flagged as escrow (`net margin = Rp 0`).
     - Payment coordinate freezing: bank account details (`bank_account_snapshot`) captured at invoice creation/issuance to preserve financial auditability.

2. **Database Integrity & Stored Procedures:**
   - **Trigger `app.invoice_snapshot_guard`:**
     - Enforces strict immutability once an invoice transitions to `ISSUED`, `PARTIALLY_PAID`, or `PAID`. Financial amounts, bank snapshot, and line items cannot be modified or deleted.
   - **Stored Procedure `app.create_invoice_for_order`:**
     - Computes the Order Invoicing Ceiling: enforces $\sum \text{amount\_total}(\text{active invoices}) \le \text{order.grand\_total}$.
     - Validates order state (`CONFIRMED`, `ACTIVE`, `IN_PRODUCTION`, `COMPLETED`).
     - Atomically creates invoice header and line items.
     - Logs creation in `app.invoice_audit`.
   - **Stored Procedure `app.issue_invoice`:**
     - Validates transition from `DRAFT` $\to$ `ISSUED`.
     - Verifies actor permissions (`invoices:issue` restricted to `FINANCE`, `ADMIN`, `OWNER`).
     - Freezes `issued_at` timestamp.
   - **Stored Procedure `app.void_invoice`:**
     - Allows voiding unpaid issued or draft invoices (`invoices:void` restricted to `FINANCE`, `ADMIN`, `OWNER`).
     - Forbids voiding paid invoices (`amount_paid > 0`).
     - Requires a documented cancellation reason (`notes`).

3. **Domain & Validation Packages:**
   - `packages/domain/src/invoice.ts`:
     - Milestone definitions, status state machine validator (`isValidInvoiceTransition`), and zero-float sum calculators.
   - `packages/validation/src/invoice.ts`:
     - Zod schemas for invoice creation, issuance, and voiding.
   - `packages/auth/src/permissions.ts`:
     - Added permissions: `invoices:read`, `invoices:create`, `invoices:issue`, `invoices:void`.
     - Strict authority split: Sales can draft invoices; only Finance, Admin, and Owner can issue or void.

4. **Internal Application & Finance UI (`apps/mgbos`):**
   - **Sidebar Navigation:** Activated `Invoices & Piutang` (`/invoices`) navigation link (gated with `invoices:read`).
   - **Invoice Directory (`/invoices`):**
     - Financial KPI summary cards: Total Tagihan Aktif, Sisa Piutang (Balance Due), Total Terbayar (Paid), Jumlah Faktur.
     - Searchable and filterable table displaying Invoice Number, Order Number, Milestone Type, Status Badge, Due Date, Total, Terbayar, and Sisa.
   - **Invoice Detail View (`/invoices/[invoiceId]`):**
     - Canonical header with invoice number, order link, status badge, and milestone pill.
     - Printable / official proforma invoice layout with billing address and frozen company bank coordinates (BCA 7770123899 PT MultiGraph Cipta Nusantara).
     - Action buttons (`<IssueInvoiceButton>` and `<VoidInvoiceButton>`) with confirmation dialogs and permission guards.
     - Full line item breakdown with subtotal, courier shipping pass-through, and grand total.
     - Chronological audit trail.
   - **Order Detail Integration (`/orders/[orderId]`):**
     - Dedicated **Tagihan Komersial & Termin** section on order detail view.
     - Real-time invoicing quota progress bar (Contract Total vs Invoiced vs Remaining Quota).
     - `<InvoiceCreateModal>` with suggested DP 50% vs Pelunasan calculation.
     - Real-time balance due breakdown integrated into the financial compilation card.

## Verification

- **Unit & Domain Tests (Vitest):** 162 passed across 34 test files (11 new tests covering invoice transitions, zero-float milestone calculations, Zod validation, and role permissions).
- **Typecheck:** 100% strict TypeScript passed across all 11 workspace packages and Next.js applications.
- **Lint:** ESLint passed with 0 errors and 0 warnings.
- **Production Builds:** Both `@mgbos/app` and `@mgbos/teestock` built successfully with Turbopack.
- **Database Migrations & pgTAP:** 20 pgTAP assertions in `supabase/tests/commercial_invoicing.test.sql` verifying invoice creation, ceiling enforcement, state transitions, snapshot guards, and role enforcement.

## Next Slice

**MGBOS-015: Payment Gateway & Manual Reconciliation (Cash-In to Invoices & Ledger Allocation)**.
