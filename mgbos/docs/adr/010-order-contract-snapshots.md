# Order contract snapshots, quote acceptance, and address freezing

Date: 2026-09-25
Status: PROPOSED for MGBOS-011 local implementation

## Context

Once a quotation is accepted by a customer, it must transform into a legally binding, operationally enforceable commercial contract (Order). The canonical sources are MGBOS 0.5.2 (Epic 4.1 & 4.2), MGBOS 0.3 (Business State Machines sections 12-18), and MGBOS 0.2 (Canonical Data Model).

In bespoke apparel and printing operations, a common failure mode is silent data mutation: a customer updates their default shipping address or profile in the CRM, or a sales rep tweaks an item price, inadvertently altering the commercial terms of an active manufacturing commitment. Furthermore, multi-vendor production jobs (garment procurement, DTF printing, packaging) must rely on an immutable specification that cannot drift mid-production.

## Decision

1. **Quote Acceptance Workflow (`SENT` $\to$ `ACCEPTED`):**
   - Only a quote version in `SENT` status may be accepted.
   - Acceptance requires recording the `accepted_at` timestamp, `acceptance_method` (`WHATSAPP`, `EMAIL`, `SIGNATURE`, `DIRECT`), optional `accepted_by_contact_id`, and notes.
   - Acceptance guards: quote must not be expired, actor must belong to `OWNER`, `ADMIN`, or `SALES`, referenced requirement must be `LOCKED`, and quotes below the CFO margin floor (<20%) must have an approved pricing override.
   - Accepting a quote version marks it `ACCEPTED` and seals it from further edits.

2. **Order Contract Freezing (`app.orders` and `app.order_items`):**
   - An Order is generated from an `ACCEPTED` quote version via `app.create_order_from_quote`.
   - Each accepted quote version yields at most one order contract (`unique(source_quote_version_id)`).
   - Numbering follows canonical document sequencing: `{BRAND}-O-{YEAR}-{SEQUENCE}` (e.g. `TS-O-2026-000001`).
   - The order status begins at `CONFIRMED` (representing mutual commercial commitment).
   - The financial breakdown is frozen: `subtotal`, `discount_total`, `shipping_total`, `grand_total`, `estimated_cost_total`, and `estimated_gross_profit`. Zero-Float (`bigint` Rupiah) is maintained throughout.
   - Customer shipping fee is retained on the contract but strictly isolated as a pass-through escrow.

3. **Frozen Address & Specification Snapshots:**
   - The shipping address is captured as an immutable JSONB snapshot (`shipping_address_snapshot` containing `recipient_name`, `phone`, `street`, `city`, `province`, `postal_code`, `courier_service`, `notes`).
   - Customer profile details are captured as `customer_snapshot`.
   - Commercial and payment terms are captured as `payment_terms_snapshot`.
   - Each order item (`app.order_items`) captures the exact `specification_snapshot` (size breakdown S-XXL, DTF/screen placement coordinates) from the locked requirement version.
   - An append-only immutability trigger (`app.order_snapshot_guard`) prevents any subsequent update or deletion of frozen financial, address, or item rows.

4. **Authority & Access Boundaries:**
   - Only `OWNER`, `ADMIN`, and `SALES` roles are authorized to accept quotes and execute order conversion.
   - `OPERATIONS` and `FINANCE` have read-only visibility into orders.
   - External clients (storefront/anon) have zero table access; all interactions flow through authenticated server actions calling security definer stored procedures with explicit `p_actor_id` validation.

## Consequences

- An order once created cannot be mutated to reflect changes made to the customer's CRM profile. Any change of delivery address or price requires an explicit, audited operational amendment or contract cancellation.
- Production job splitting (Sprint 4: MGBOS-012) and down payment tracking (MGBOS-014) can safely bind directly to `order_items` without risk of specification drift.
