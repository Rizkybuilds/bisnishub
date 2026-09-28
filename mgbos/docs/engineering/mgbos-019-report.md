# MGBOS-019 — Procurement, Purchase Orders (PO), Goods Receipt & Vendor Bills

Implemented locally on 2026-09-26. Primary milestone completion of **Sprint 8 (Pengadaan, PO Vendor, Goods Receipt & Kas Keluar Pembelian Bahan / TS-PLAN-08)**.

## Delivered

1. **Procurement & Purchase Order Schema (`app.purchase_orders`, `app.purchase_order_items`, `app.goods_receipts`, `app.goods_receipt_items`, `app.vendor_bills`, `app.vendor_bill_payments`):**
   - Created in `supabase/migrations/20260926300000_procurement_and_purchase_orders.sql`:
     - **Purchase Orders (`app.purchase_orders`, `app.purchase_order_items`):** Multi-tenant PO table with canonical document numbering `{BRAND}-PO-{YEAR}-{SEQUENCE}`, vendor linkage (`app.vendors`), item line items with unit costs and subtotals, shipping costs, order dates, expected delivery dates, and status lifecycle (`DRAFT`, `ORDERED`, `PARTIALLY_RECEIVED`, `RECEIVED`, `CANCELLED`).
     - **Warehouse Goods Receipts (`app.goods_receipts`, `app.goods_receipt_items`):** Physical receipt records with canonical document numbering `{BRAND}-GR-{YEAR}-{SEQUENCE}`, vendor delivery note tracking, location assignment, quantity accepted, quantity rejected, and rejection reasons.
     - **Vendor Bills & Payments (`app.vendor_bills`, `app.vendor_bill_payments`):** Commercial accounts payable tracking with canonical document numbering `{BRAND}-VB-{YEAR}-{SEQUENCE}`, payment tracking, balance due, payment method, bank accounts, and status lifecycle (`OPEN`, `PARTIALLY_PAID`, `PAID`, `VOID`).
     - **Financial Ledger Integration:** Upgraded `app.financial_ledger_entries.entry_type` check constraint to include `'VENDOR_MATERIAL_PAYMENT'`.
     - Multi-tenant isolation with strict Row-Level Security (RLS) policies across all 6 tables.

2. **Procurement Stored Procedures & Business Guards:**
   - **`app.create_purchase_order`:**
     - Validates actor permissions (`procurement:create`).
     - Validates active vendor existence.
     - Generates canonical PO document number using `app.generate_document_number`.
     - Calculates subtotal and total amount with Zero-Float bigint arithmetic.
     - Inserts PO and PO line items atomically.
     - Auto-generates initial Vendor Bill (`TS-VB-YYYY-XXXXXX`) in `OPEN` status with `balance_due = total_amount`.
   - **`app.receive_purchase_order_items` (Over-Receipt Ceiling Guard & Auto-Stock Restock):**
     - Atomically locks `app.purchase_orders` and `app.purchase_order_items` with `FOR UPDATE`.
     - Strictly enforces ceiling guard: `quantity_accepted + quantity_rejected <= remaining_quantity`. Rejects excess with clear exception: `"Jumlah penerimaan ({qty}) melebihi sisa pesanan PO ({remaining}) untuk item {id}"`.
     - Increments `quantity_received` on PO items.
     - Updates PO status: `PARTIALLY_RECEIVED` or `RECEIVED` (when all line items fully received).
     - Generates canonical Goods Receipt number (`TS-GR-YYYY-XXXXXX`).
     - **Automated Stock Restock:** Atomically increments `app.inventory_levels.quantity_on_hand` and appends `INBOUND_PURCHASE` mutation into `app.inventory_mutations` audit ledger.
   - **`app.pay_vendor_bill` (Outbound Cash Movement Emission):**
     - Atomically locks `app.vendor_bills` with `FOR UPDATE`.
     - Guards against over-payment beyond `balance_due`.
     - Increments `amount_paid` and decrements `balance_due`.
     - Updates bill status: `PARTIALLY_PAID` or `PAID` (when `balance_due = 0`).
     - Inserts payment audit record into `app.vendor_bill_payments`.
     - **Automated Financial Ledger Link:** Emits `VENDOR_MATERIAL_PAYMENT` entry into `app.financial_ledger_entries` with direction `CREDIT` and category `CASH_MOVEMENT`.

3. **Domain, Validation & Auth Packages:**
   - `packages/domain/src/documentNumber.ts` & `packages/validation/src/documentNumber.ts`:
     - Added canonical document prefixes `'GR'` (Goods Receipt) and `'VB'` (Vendor Bill).
   - `packages/domain/src/procurement.ts`:
     - Pure domain types & enums: `PurchaseOrderStatus`, `VendorBillStatus`, `PaymentMethod`, `PurchaseOrder`, `PurchaseOrderItem`, `GoodsReceipt`, `VendorBill`, `VendorBillPayment`.
     - Pure calculation helpers: `calculatePurchaseOrderTotal`, `calculateRemainingPurchaseQuota`, `calculateVendorBillBalance`, `formatPurchaseOrderStatusLabel`, `formatVendorBillStatusLabel`.
     - Unit tests in `packages/domain/src/procurement.test.ts`.
   - `packages/validation/src/procurement.ts`:
     - Zod schemas: `createPurchaseOrderSchema`, `receiveGoodsReceiptSchema`, `payVendorBillSchema`.
     - Unit tests in `packages/validation/src/procurement.test.ts`.
   - `packages/auth/src/permissions.ts`:
     - Added permissions: `procurement:read`, `procurement:create`, `procurement:receive`, `procurement:pay`.
     - Role mappings across `OWNER`, `ADMIN`, `OPERATIONS`, `FINANCE`, `SALES`, `QC`.

4. **Web Application Features (`apps/mgbos`):**
   - **Data Access & Server Actions:**
     - `apps/mgbos/src/app/(app)/procurement/data.ts`: PostgREST query layer with KPI calculations (Total POs, Active POs, Total Spend, Outstanding Vendor Bills) and PO detail query.
     - `apps/mgbos/src/app/(app)/procurement/actions.ts`: Next.js Server Actions calling procurement RPCs with cache revalidation.
   - **UI Components & Modals (`apps/mgbos/src/app/(app)/procurement/components.tsx`):**
     - `<PurchaseOrderStatusBadge>`: Color-coded status badge for POs.
     - `<VendorBillStatusBadge>`: Color-coded status badge for vendor bills.
     - `<CreatePurchaseOrderModal>`: PO creation modal with vendor selector, SKU selector, unit price, quantity, shipping cost, and lead time.
     - `<ReceiveGoodsReceiptModal>`: Goods receipt modal with accepted/rejected quantity, vendor delivery note input, and workshop location.
     - `<PayVendorBillModal>`: Vendor bill payment modal with payment method selection, bank source, and real-time ledger link indicator.
   - **Pages & Navigation:**
     - `apps/mgbos/src/app/(app)/procurement/page.tsx`: Procurement directory with KPI cards, PO list table, and Vendor Bills table.
     - `apps/mgbos/src/app/(app)/procurement/[poId]/page.tsx`: PO detail page displaying order header, line items with inline GR modal triggers, Goods Receipts history, and associated Vendor Bill with payment modal.
     - `apps/mgbos/src/app/(app)/layout.tsx`: Navigation sidebar updated with `Pengadaan & PO` (`/procurement`) under the Operations group.

5. **Verification & Quality Gates:**
   - **Database Tests (pgTAP):** `supabase/tests/procurement_and_purchase_orders.test.sql` (23 assertions passed). Full test suite: 21 test files, 360 assertions passed (0 failures).
   - **Unit & Domain Tests (Vitest):** 48 test files, 216 tests passed (0 failures).
   - **E2E Flow (`scripts/verify-e2e-flow.mjs`):** Section 10 added, testing garment supplier registration, PO creation (100 pcs NSA blanks), partial receipt 1 (60 pcs), stock level increment (+60), ceiling guard rejection check (> 40 pcs), full receipt 2 (40 pcs), PO status transition to `RECEIVED`, vendor bill partial payment (Rp 2.000.000), `VENDOR_MATERIAL_PAYMENT` ledger emission (`CREDIT`), and full bill settlement (Rp 1.850.000 `PAID`).
   - **Lint & Format:** `pnpm format:check` and `pnpm lint` passed with 0 errors, 0 warnings.
   - **TypeScript Typecheck:** `pnpm typecheck` passed with 0 errors across all 11 workspace packages and applications.
   - **Production Next.js Builds:** `pnpm build` compiled both `apps/teestock` and `apps/mgbos` successfully.
