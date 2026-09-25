# MGBOS-011 — Order contract snapshots, quote acceptance, and address freezing

Implemented locally on 2026-09-25. First vertical slice of Sprint 4 (Order & Production Routing).

## Delivered

1. **Quote Acceptance Workflow (`SENT` $\to$ `ACCEPTED`):**
   - Stored procedure `app.mark_quote_accepted` enables authorized sales or owner roles to record customer quote acceptance.
   - Accepts supported channels: `WHATSAPP`, `EMAIL`, `SIGNATURE`, or `DIRECT`, alongside optional contact ID and notes.
   - Enforces business invariants: only current unexpired quotes in `SENT` status with `LOCKED` requirements can be accepted; quotes below the CFO margin floor (<20%) require an owner price override.
   - Acceptance details (`accepted_at`, `acceptance_method`, `contact_id`, `notes`) and append-only audit entries are permanently recorded.

2. **Order Contract Snapshot Freezing (`app.orders` & `app.order_items`):**
   - Stored procedure `app.create_order_from_quote` converts an accepted quote into an official commercial contract.
   - Assigns a collision-safe canonical document number following `{BRAND}-O-{YEAR}-{SEQUENCE}` (e.g. `TS-O-2026-000001`).
   - Contract lifecycle initializes in `CONFIRMED` status.
   - Enforces Zero-Float arithmetic (`bigint` integer rupiah) for `subtotal`, `discount_total`, `shipping_total`, `grand_total`, `estimated_cost_total`, and `estimated_gross_profit`. Customer shipping fees are strictly isolated as pass-through escrow.
   - Generates frozen snapshots: `customer_snapshot`, `shipping_address_snapshot` (recipient name, phone, street, city, province, postal code, courier, notes), and `payment_terms_snapshot`.
   - Copies quote line items into `app.order_items` with immutable `specification_snapshot` (containing exact S-XXL sizing breakdown and decoration placements).
   - One-to-one constraint: an accepted quote version yields at most one order contract (`unique(source_quote_version_id)`).

3. **Tamper-Proof Immutability Guards:**
   - Database trigger `app.order_snapshot_guard` prevents updates or deletes to financial amounts, addresses, or item specifications. Only valid status lifecycle progressions (`CONFIRMED` $\to$ `ACTIVE`, etc.) and timestamps are mutable.

4. **Internal Application Integration (`apps/mgbos`):**
   - Active navigation link `/orders` in the Operations sidebar section (gated with `orders:read`).
   - Order list page at `/orders` showing active contracts, customer names, shipping destinations, and financial totals.
   - Dedicated contract inspection page at `/orders/[orderId]` displaying frozen address details, item breakdown, and audit trails.
   - Integrated quote acceptance and order conversion modal in `/quotes`.

## Verification

- **pgTAP Database Tests:** 176 passed across 12 files (28 new assertions in `order_contract_snapshots.test.sql` verifying acceptance guards, order creation, canonical document numbering, Zero-Float math, idempotency, and database immutability triggers).
- **Unit & Domain Tests (Vitest):** 124 passed across 23 test files (13 new tests covering order state machine transitions, financial invariants, Zod schemas, and RBAC matrix).
- **Typecheck & Lint:** 100% strict TypeScript passed across all 11 workspace packages and Next.js applications; ESLint 0 warnings.
- **Production Builds:** Both `@mgbos/app` and `@mgbos/teestock` built successfully with Turbopack.

## Boundaries & Next Slices

- Orders currently represent frozen commercial commitments; down payment invoicing and payment allocation follow in Sprint 5 (MGBOS-014 / MGBOS-015).
- Multi-vendor production job splitting (splitting 1 order into separate blank garment procurement, DTF print, and packaging jobs) will be implemented in the next slice: **MGBOS-012**.
