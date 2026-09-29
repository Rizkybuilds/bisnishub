# Quote pricing snapshots and authority

Date: 2026-09-24
Status: ACCEPTED for MGBOS-009 local implementation

## Context

Custom Atelier quotes need reproducible costing, exact margin floors, immutable sent versions and accountable owner exceptions. The canonical sources are MGBOS 0.5.1 sections 19–23 and the quote state machine in MGBOS 0.3.

## Decision

A quote has an organization, brand, customer and source requirement. Each saved revision creates a new immutable commercial snapshot, including draft revisions. This is stricter than permitting in-place draft edits and uses the existing requirement snapshot pattern. Saving supersedes previous DRAFT/SENT versions. Expected-version checks reject stale edits; request identifiers make identical creation/revision retries idempotent.

The pilot quotes one requirement line per version; its quantity/unit/specification come from the requirement snapshot. Cost components remain separate immutable rows so future multi-line costing can extend the model. New revisions keep the same requirement aggregate and customer, but can reference a newer active requirement version.

Amounts use integer rupiah. Discount reduces product revenue; customer courier charges are excluded from revenue and profit used for the floor. Direct production transport may be a cost component. No tax calculation or corporate overhead allocation is introduced in this slice.

Margin bands are compared using exact integer cross-products, not rounded displayed percentages: below 20% requires owner approval, 20–24.99% warns strongly, 25–29.99% cautions, 30% and above reaches target. Approval records apply only to one immutable version. Reasons and actor identity are committed with append-only audit records.

Only OWNER/ADMIN/SALES create and mark sent. Only OWNER approves exceptions. FINANCE reads internal costing; OPERATIONS/QC have no quote-cost access in this slice. Server requests use verified membership; database RPCs repeat actor, organization, customer and brand checks. Browser roles have no table/command grants. Service role gets read-only tables and explicitly granted commands.

Marking sent locks the referenced current READY requirement in the same transaction. This command records manual sending; it does not transmit a message. PDF delivery, acceptance/order creation and external event consumers follow in later stages. No outbox consumer is configured, consistent with ADR-005.

## Consequences

Draft correction creates another visible version. Unknown/inactive/stale references fail closed. The UI displays no tax-inclusive claim. Multi-item quoting, acceptance, automatic expiry/rejection/cancellation workflows and external delivery require subsequent commands and tests before they are exposed.
