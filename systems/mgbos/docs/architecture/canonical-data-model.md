---
canonical_id: mgbos.architecture.canonical-data-model
status: ACTIVE
version: 1.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: mgbos
document_class: canonical-specification
effective_from: 2026-09-29
authoritative_for:
  - mgbos canonical business entities
  - entity ownership and relationships
  - transactional identity model
  - snapshot semantics
  - monetary representation
  - current implemented domain model
  - current-vs-future entity classification
last_reviewed: 2026-09-29
review_cadence: quarterly
depends_on:
  - ../../../../docs/governance/documentation-constitution.md
  - ../../../../docs/governance/canonical-source-map.md
  - ../../../../docs/architecture/master-system-blueprint.md
  - ../../../../docs/architecture/system-boundaries.md
  - ../../../../docs/architecture/architectural-laws.md
  - README.md
  - ../adr/002-postgresql-system-of-record.md
supersedes:
  - ../../../../catatan/sesi/2026-09-23 - MGBOS 0.2 — Canonical Data Model v0.1.md
  - ../../../../catatan/sesi/2026-09-23 - MGBOS 0.2.1 Logical Data Model.md
implementation_basis:
  - ../../supabase/migrations/
implementation_through: MGBOS-020
---

# MGBOS Canonical Data Model v1.0

## 1. Purpose

Dokumen ini adalah canonical semantic model untuk data bisnis MultiGraph Business OS.

Ia mendefinisikan:

- entity yang saat ini menjadi bagian MGBOS;
- semantic ownership setiap domain;
- hubungan utama antar entity;
- identity rules;
- snapshot rules;
- master vs transactional data;
- financial representation;
- organizational context;
- dan batas antara CURRENT model dengan future extensions.

Dokumen ini menggantikan penggunaan permanen catatan MGBOS 0.2 dan 0.2.1 sebagai sumber data-model authoritative.

Catatan tersebut tetap disimpan sebagai provenance.

---

# 2. Core Principle

MGBOS database merepresentasikan:

> **business reality, not screen structure.**

Karena itu model tidak dibuat berdasarkan halaman UI seperti:

```text
dashboard_orders
teestock_custom_page
founder_widget
```

tetapi berdasarkan business concepts yang tetap valid walaupun UI berubah.

---

# 3. Source of Truth

Untuk domain yang dimiliki MGBOS:

```text
PostgreSQL
=
authoritative persistent business state
```

Canonical semantics berasal dari:

```text
Canonical Data Model
+
Business Invariants
+
State Machines
+
Accepted ADRs
```

Implementation enforcement berasal dari:

```text
schema
constraints
functions
commands
tests
```

Database schema adalah implementation truth.

Dokumen ini adalah intended semantic truth.

Perbedaan di antara keduanya harus diperlakukan sebagai drift.

---

# 4. Current Model Rule

Entity diklasifikasikan sebagai **CURRENT** hanya apabila sudah menjadi bagian schema MGBOS aktif.

Konsep dari blueprint lama yang belum diimplementasikan tidak otomatis dimasukkan sebagai current canonical entities.

Status yang digunakan:

```text
CURRENT
EXPERIMENTAL
FUTURE_EXTENSION
RETIRED_CONCEPT
```

---

# 5. Domain Map

Current MGBOS data model terdiri dari domain:

```text
ORGANIZATION & IDENTITY
        ↓
CUSTOMER
        ↓
CRM / LEAD
        ↓
REQUIREMENT
        ↓
QUOTATION
        ↓
ORDER
        ├───────────────┐
        ▼               ▼
PRODUCTION          FINANCE
        │               │
        ▼               ▼
VENDOR / QC         INVOICE
        │               │
        ▼               ▼
PROCUREMENT         PAYMENT
        │               │
        ▼               ▼
INVENTORY          ANALYTICAL LEDGER
        │
        ▼
FULFILLMENT
```

Retail ordering provides a second entry path directly into Order.

---

# 6. Current Canonical Entity Inventory

## Organization & Identity

```text
organizations
brands
business_lines
channels
roles
users
organization_members
document_sequences
```

## Customer

```text
customer_accounts
customer_contacts
customer_brand_relationships
addresses
customer_addresses
```

## CRM

```text
leads
```

## Requirement

```text
requirements
requirement_versions
```

## Quotation

```text
quotes
quote_versions
quote_items
quote_cost_components
quote_price_approvals
quote_audit
```

## Order

```text
orders
order_items
order_audit
```

## Production

```text
production_jobs
production_job_items
production_assignments
production_job_audit
```

## Vendor & QC

```text
vendors
vendor_rate_cards
qc_inspections
```

## Customer Finance

```text
invoices
invoice_items
invoice_audit

payments
payment_allocations
payment_audit
```

## Analytical Finance

```text
financial_ledger_entries
order_financial_summaries
```

## Fulfillment

```text
shipments
shipment_items
shipment_audit
```

## Inventory

```text
inventory_items
inventory_levels
inventory_mutations
inventory_reservations
```

## Procurement

```text
purchase_orders
purchase_order_items
goods_receipts
goods_receipt_items
vendor_bills
vendor_bill_payments
```

## Experimental Design Library

```text
design_assets
design_asset_versions
```

---

# 7. Identity Rule

Canonical internal entity identity uses:

```text
UUID
```

Human-readable document numbers are business identifiers, not fundamental identity.

Example:

```text
id
→ UUID

order_number
→ TS-O-2026-000001
```

References inside the system SHOULD use internal stable IDs.

Public/business numbers exist for human operations and documents.

---

# 8. Organizational Hierarchy

Canonical structure:

```text
ORGANIZATION
    │
    ├── BRAND
    │     │
    │     └── BUSINESS LINE
    │
    ├── CHANNEL
    │
    ├── ROLE
    │
    └── ORGANIZATION MEMBER
```

`organization` is the highest MGBOS tenant/business authority boundary currently represented.

---

# 9. Organization

`organizations` represents an operating organization.

Important semantics include:

```text
code
legal identity
display identity
timezone
base currency
status
billing settings
```

Current default operating assumptions:

```text
timezone: Asia/Jakarta
base currency: IDR
```

Organization is not merely a UI grouping.

It is an authority and isolation boundary.

---

# 10. Brand

`brands` belongs to an organization.

```text
ORGANIZATION
    ↓
BRAND
```

A brand has:

```text
code
name
slug
domain
status
```

Transactions MAY be brand-scoped where business semantics require it.

Brand does not replace organization.

---

# 11. Business Line

`business_lines` represents a business offering/category under a brand.

Example conceptual relationship:

```text
TeeStock
├── Retail
├── Custom Atelier
└── other future lines
```

Business line allows segmentation without creating separate databases.

---

# 12. Channel

`channels` represents acquisition/transaction communication source.

Current channel categories support concepts such as:

```text
MESSAGING
WEB
SOCIAL
DIRECT
MARKETPLACE
API
```

Channel is organization-scoped rather than inherently brand-owned.

This allows cross-brand analytics by channel.

---

# 13. User and Membership Model

MGBOS separates application identity from organizational membership.

```text
USER
  ↓
ORGANIZATION MEMBER
  ↓
ROLE
```

`users` represents application actors.

`organization_members` links a user to:

```text
organization
role
membership status
```

A role name alone MUST NOT be interpreted as unlimited authority.

Actual command permissions remain subject to authorization architecture.

---

# 14. Document Numbering

`document_sequences` owns transactional sequencing for human-readable business documents.

Identity:

```text
organization
+
brand
+
document_type
+
year
```

produces an atomic sequence.

Examples:

```text
TS-O-2026-000001
TS-INV-2026-000001
TS-PAY-2026-000001
```

Document numbers MUST NOT replace UUID identity.

---

# 15. Customer Account

Canonical customer entity is:

```text
customer_account
```

not a brand-specific customer record.

Account types:

```text
PERSON
COMPANY
```

Customer account owns durable identity such as:

```text
display name
legal name
primary email
primary phone
tax identity
status
customer since
```

---

# 16. Customer Is Organization-Level

A customer is not inherently duplicated for every brand.

Correct:

```text
CUSTOMER ACCOUNT
        │
        ├── TeeStock relationship
        └── MultiGraph relationship
```

This supports:

```text
cross-selling
group customer history
relationship analytics
```

while retaining per-brand relationship semantics.

---

# 17. Customer Contact

`customer_contacts` represents individual people associated with a customer account.

Example:

```text
PT Example
├── Owner
├── Purchasing PIC
└── Finance PIC
```

This avoids incorrectly creating multiple customer accounts for multiple contacts inside one company.

---

# 18. Customer–Brand Relationship

`customer_brand_relationships` captures brand-specific relationship state.

Current semantics include:

```text
customer segment
relationship status
first interaction
last interaction
```

Relationship state does not alter the global identity of the customer account.

---

# 19. Address Model

Address is an independent entity.

```text
CUSTOMER
   ↓
CUSTOMER ADDRESS
   ↓
ADDRESS
```

This supports multiple addresses:

```text
billing
shipping
office
warehouse
other
```

Transactional entities MUST snapshot relevant addresses when historical integrity requires it.

---

# 20. Lead

`leads` represents an inbound commercial inquiry before it necessarily becomes a complete customer transaction.

Lead belongs to:

```text
organization
brand
channel
```

and MAY reference:

```text
business line
customer account
customer contact
```

A lead may exist before a formal customer account is created.

---

# 21. Lead Lifecycle

Current lead lifecycle supports:

```text
NEW
↓
CONTACTED
↓
QUALIFYING
↓
QUALIFIED
↓
CONVERTED
```

with exception states including:

```text
DISQUALIFIED
LOST
```

The detailed transition law belongs to the canonical State Machine document.

---

# 22. Lead Qualification

Lead stores explicit qualification information including:

```text
estimated quantity
estimated budget
qualification result
qualification score
qualification notes
disqualification reason
```

Qualification state is canonical business data.

AI may assist qualification.

AI output alone MUST NOT bypass the authoritative transition/command.

---

# 23. Opportunity Is Not a Current Canonical Entity

Historical MGBOS 0.2 proposed:

```text
opportunity
```

as a separate entity.

Current MGBOS schema does not implement it.

Therefore:

```text
opportunity
=
FUTURE_EXTENSION
```

It MUST NOT be referenced as though it currently exists.

If future business needs justify pipeline separation between qualified lead and quote, it requires a new specification/migration.

---

# 24. Requirement

`requirements` represents a customer's defined business need/specification.

Requirement may originate from:

```text
lead
customer account
```

Requirement is independent of quotation.

This separation is intentional.

---

# 25. Requirement Versioning

Canonical structure:

```text
REQUIREMENT
     │
     ├── v1
     ├── v2
     └── v3
```

implemented through:

```text
requirements
requirement_versions
```

Requirement root stores current lifecycle identity.

Requirement versions preserve specification history.

---

# 26. Requirement Specification Strategy

MGBOS uses:

```text
canonical columns
+
versioned JSON specification
```

for configurable/custom production.

Example:

```text
quantity
target budget
target date
unit
```

remain explicit fields.

Product-specific specification may live in structured JSON.

Critical business facts SHOULD NOT be hidden arbitrarily inside metadata.

---

# 27. Schema-Versioned Custom Requirements

Domain-specific specifications such as:

```text
teestock.custom_atelier.v1
```

can define application-level validation over requirement specification.

This enables different printing/apparel products without creating hundreds of generic nullable columns.

---

# 28. Requirement Immutability

Requirement versions can become locked.

A locked version represents historical specification.

New customer changes SHOULD create a new version rather than rewriting locked history.

---

# 29. Quotation Aggregate

Canonical structure:

```text
QUOTE
  │
  ├── VERSION 1
  │      ├── ITEMS
  │      └── COST COMPONENTS
  │
  ├── VERSION 2
  │      ├── ITEMS
  │      └── COST COMPONENTS
  │
  └── ...
```

`quotes` owns commercial identity.

`quote_versions` owns historical priced proposals.

---

# 30. Quote Root

`quotes` identifies the quotation relationship between:

```text
organization
brand
customer
requirement
```

and owns:

```text
quote number
current version pointer
```

Pricing values belong to versions, not the root.

---

# 31. Quote Version

A quote version is a commercial snapshot.

It captures:

```text
requirement version
subtotal
discount
shipping
grand total
estimated cost
estimated gross profit
pricing guard
terms snapshot
customer snapshot
issuer snapshot
validity date
```

Once issued/sent according to business lifecycle, history is protected from destructive rewriting.

---

# 32. Quote Item

`quote_items` represents what is being offered.

It contains:

```text
description
quantity
unit
unit price
discount
subtotal
specification
position
```

Quote line items are snapshots of an offer.

They do not need to depend on a generic catalog master.

---

# 33. Quote Cost Component

`quote_cost_components` decomposes estimated cost.

Examples:

```text
GARMENT
PRINTING
EMBROIDERY
LABEL
PACKAGING
VENDOR
LABOR
BUFFER
OTHER
```

This is the authoritative source for detailed **estimated quotation cost composition** where populated.

---

# 34. Pricing Approval

`quote_price_approvals` represents explicit approval of exceptional quote pricing.

Approval records:

```text
quote version
approver
reason
time
```

Approval does not bypass mathematical or structural database invariants.

---

# 35. Order Aggregate

Canonical structure:

```text
ORDER
  │
  ├── ORDER ITEM
  ├── PRODUCTION
  ├── INVOICE
  ├── SHIPMENT
  └── INVENTORY RESERVATION
```

An Order represents contractual commercial commitment.

---

# 36. Two Current Order Types

Current MGBOS supports:

```text
CUSTOM_B2B
RETAIL_DIRECT
```

This distinction is canonical.

---

# 37. Custom B2B Order Source

A `CUSTOM_B2B` order MUST preserve links to:

```text
quote
quote version
requirement
requirement version
```

Flow:

```text
REQUIREMENT VERSION
       ↓
QUOTE VERSION
       ↓
ACCEPTANCE
       ↓
ORDER
```

Historical contractual lineage must remain traceable.

---

# 38. Retail Direct Order Source

A `RETAIL_DIRECT` order does not require quotation or requirement lineage.

Flow:

```text
CUSTOMER
   +
INVENTORY ITEM
       ↓
DIRECT RETAIL ORDER
       ↓
INVOICE
       ↓
PAYMENT optional immediate
```

This is intentionally separate from the longer custom B2B flow.

---

# 39. Order Is a Contract Snapshot

Order stores immutable/historically meaningful snapshots such as:

```text
customer snapshot
shipping address snapshot
billing address snapshot
payment terms snapshot
price
discount
shipping
estimated cost
```

A later change to customer master data MUST NOT rewrite historical order meaning.

---

# 40. Order Item

Order item represents contracted line item.

It captures:

```text
description
quantity
unit
unit price
discount
subtotal
specification snapshot
```

For `RETAIL_DIRECT`, order item MAY reference:

```text
inventory_item_id
```

for direct SKU traceability.

---

# 41. Catalog Is Not Yet a Generic Canonical Domain

The original model proposed:

```text
catalog_items
catalog_variants
catalog_options
```

The current MGBOS runtime does not implement this generic catalog abstraction.

Current retail sale instead links order items to:

```text
inventory_items
```

Therefore generic catalog is:

```text
FUTURE_EXTENSION
```

It MUST NOT be assumed as current system architecture.

---

# 42. Production Job

`production_jobs` represents operational work required to fulfill an order.

Order and production are intentionally distinct.

```text
ORDER
  ↓
ORDER ITEM
  ↓ N:M
PRODUCTION JOB
```

One order item may require several production jobs.

---

# 43. Production Job Types

Current categories include:

```text
GARMENT
PRINTING
EMBROIDERY
PACKAGING
LABEL
FINISHING
OTHER
```

These classify work, not commercial product identity.

---

# 44. Production Cost Trilogy

`production_jobs` currently exposes:

```text
estimated_cost
committed_cost
actual_cost
```

This implements the Cost Trilogy at operational job level:

```text
ESTIMATED
    ↓
COMMITTED
    ↓
ACTUAL
```

These three values MUST remain semantically distinct.

---

# 45. Production Job Item Bridge

`production_job_items` implements relationship between:

```text
production_jobs
↔
order_items
```

with quantity attribution.

This prevents the invalid assumption:

```text
1 order item = 1 production job
```

---

# 46. Production Assignment

`production_assignments` records who is assigned to perform a job.

Current executor types:

```text
INTERNAL
VENDOR
```

Internal assignment may reference another brand/business capability.

Vendor assignment can reference vendor identity through the evolved vendor integration.

Assignment does not replace production job state.

---

# 47. Vendor

`vendors` represents curated external supply/production partners.

Canonical vendor information currently includes:

```text
identity
category
contact
lead time
rating
status
payment terms
```

Vendor is an organization-level network resource.

---

# 48. Vendor Categories

Current schema supports categories such as:

```text
GARMENT_SUPPLIER
PRINT_STUDIO
EMBROIDERY
PACKAGING
TRIMS_LABELS
LOGISTICS
OTHER
```

Category is a high-level classification.

It should not be interpreted as a complete capability graph.

---

# 49. Vendor Rate Card

`vendor_rate_cards` represents standardized vendor service pricing.

Current semantics include:

```text
service code
description
unit
unit cost
minimum order quantity
effective date
active status
```

A rate card is commercial reference data.

It does not itself create a purchase commitment.

---

# 50. Vendor Capability Graph Is Future Work

The original data model proposed a richer:

```text
vendor_capabilities
vendor_offers
```

architecture.

Current schema has not implemented those entities.

Therefore they remain:

```text
FUTURE_EXTENSION
```

Vendor rate cards and vendor categories are the current implemented capability representation.

---

# 51. Quality Control

`qc_inspections` represents recorded inspection of a production job.

QC records:

```text
inspection identity
production job
inspector
result
sample size
defect count
defect category
defect severity
checklist snapshot
rework instructions
```

---

# 52. QC Results

Current canonical results:

```text
PASS
REWORK
REJECTED
```

QC outcome may influence production lifecycle.

Detailed transition logic belongs to State Machines.

---

# 53. Invoice

`invoices` represents customer receivable documents tied to an order.

Invoice types currently support:

```text
DOWN_PAYMENT
PROGRESS
FINAL_PAYMENT
FULL_PAYMENT
RETENTION
```

This allows multiple payment structures without changing Order.

---

# 54. Invoice Financial Semantics

Invoice owns:

```text
subtotal
tax
shipping
total
amount paid
balance due
due date
```

Invariant:

```text
balance_due
=
amount_total - amount_paid
```

Invoice state and Order state MUST remain separate lifecycles.

---

# 55. Invoice Snapshot

When issued, invoice captures relevant:

```text
customer snapshot
bank account snapshot
payment instructions
```

Historical invoices must not depend entirely on future-mutated configuration.

---

# 56. Payment

`payments` represents incoming customer money.

Canonical fields include:

```text
amount
payment method
status
payment date
reference
payer identity
destination account
proof
```

Payment exists independently from Invoice allocation.

---

# 57. Payment Allocation

`payment_allocations` implements:

```text
PAYMENT
   N:M
INVOICE
```

This supports:

```text
one payment → multiple invoices
multiple payments → one invoice
```

Payment and invoice MUST NOT be modeled as a forced 1:1 relationship.

---

# 58. Payment Reversal

Payments use lifecycle semantics including:

```text
DRAFT
CONFIRMED
REJECTED
REVERSED
```

Reversal preserves historical transaction evidence.

Financial history SHOULD NOT be erased by destructive deletion.

---

# 59. Analytical Financial Ledger

`financial_ledger_entries` is an append-oriented analytical ledger.

It represents economic/business-financial events such as:

```text
ORDER_COMMITTED
INVOICE_ISSUED
PAYMENT_RECEIVED
PAYMENT_REVERSED
PRODUCTION_COMMITTED
PRODUCTION_ACTUAL_SETTLED
SHIPPING_ESCROW_RECORDED
COURIER_EXPENSE_DISBURSED
MARGIN_REALIZATION_SNAPSHOT
```

---

# 60. Analytical Ledger Is Not Full Accounting ERP

The ledger currently exists for:

```text
business performance
cash movement visibility
cost tracking
margin realization
shipping isolation
```

It MUST NOT be described as a complete double-entry accounting/general-ledger implementation unless future work explicitly implements that scope.

---

# 61. Financial Categories

Current categories include:

```text
REVENUE
COST_OF_GOODS
PASS_THROUGH_SHIPPING
CASH_MOVEMENT
ADJUSTMENT
```

This classification preserves economic meaning beyond simple cash totals.

---

# 62. Shipping Pass-Through Rule

Courier shipping is treated separately from product revenue/margin.

Conceptually:

```text
customer shipping charge
        ↓
PASS_THROUGH_SHIPPING
        ↓
courier expense
```

Shipping MUST NOT inflate product margin.

This is a canonical financial semantic.

---

# 63. Order Financial Summary

`order_financial_summaries` is a derived projection/view.

It exists to present analytical business state.

Derived projection does not become independent transactional truth.

Underlying canonical entities remain authoritative.

---

# 64. Fulfillment

Canonical structure:

```text
ORDER
   ↓
SHIPMENT
   ↓
SHIPMENT ITEM
   ↓
ORDER ITEM
```

This supports partial fulfillment.

---

# 65. Shipment

`shipments` represents physical dispatch/delivery unit.

It captures:

```text
courier
service
tracking number
package information
actual shipping cost
shipping address snapshot
dispatch date
delivery date
```

Shipment is distinct from Order.

---

# 66. Shipment Item

`shipment_items` allocates quantities from order items into a shipment.

This means:

```text
one order
→ multiple shipments
```

is valid.

---

# 67. Inventory Item

`inventory_items` represents physical stock/SKU master.

Current categories:

```text
BLANK_GARMENT
PRINT_MATERIAL
PACKAGING
FINISHED_GOOD
OTHER
```

Inventory item is not synonymous with commercial catalog product.

---

# 68. Inventory Level

`inventory_levels` stores stock state by:

```text
inventory item
+
location
```

Current important quantities:

```text
quantity_on_hand
quantity_reserved
```

Invariant:

```text
quantity_on_hand >= quantity_reserved
```

---

# 69. Inventory Availability

Derived availability:

```text
available
=
quantity_on_hand - quantity_reserved
```

Availability calculations MUST use authoritative inventory state.

UI-computed cached availability is not sufficient for final transactional reservation.

---

# 70. Inventory Mutation

`inventory_mutations` is append-only operational stock history.

Current mutation categories include:

```text
INBOUND_PURCHASE
RESERVATION
RELEASE_RESERVATION
CONSUMED_PRODUCTION
SCRAP_DEFECT
OUTBOUND_SHIPMENT
STOCK_OPNAME
```

Mutation history MUST NOT be destructively rewritten.

---

# 71. Inventory Reservation

`inventory_reservations` binds stock to:

```text
order
order item optional
location
```

Reservation lifecycle:

```text
ACTIVE
CONSUMED
RELEASED
```

Reservation prevents stock availability from being treated as merely a visual number.

---

# 72. Procurement

Canonical procurement flow:

```text
VENDOR
   ↓
PURCHASE ORDER
   ↓
PURCHASE ORDER ITEM
   ↓
GOODS RECEIPT
   ↓
INVENTORY
   ↓
VENDOR BILL
   ↓
VENDOR PAYMENT
```

This is distinct from customer invoice/payment flow.

---

# 73. Purchase Order

`purchase_orders` represents formal purchasing commitment to a vendor.

It contains:

```text
vendor
brand optional
order date
expected delivery
commercial totals
payment terms
status
```

PO is the canonical purchase commitment document.

---

# 74. Purchase Order Item

Current PO items are linked to:

```text
inventory_item
```

and track:

```text
quantity ordered
quantity received
unit cost
subtotal
```

Invariant:

```text
quantity_received <= quantity_ordered
```

---

# 75. Goods Receipt

`goods_receipts` represents physical receipt of purchased goods.

It records:

```text
purchase order
received date
vendor delivery note
inventory location
receiving user
```

Goods Receipt provides physical-to-digital confirmation.

---

# 76. Goods Receipt Item

Goods receipt item records:

```text
accepted quantity
rejected quantity
rejection reason
inventory item
PO item
```

Procurement order does not automatically mean stock was physically received.

Receipt establishes that fact.

---

# 77. Vendor Bill

`vendor_bills` represents payable obligation to a vendor linked to purchase order.

It owns:

```text
vendor invoice reference
bill date
due date
total
amount paid
balance due
status
```

Invariant:

```text
amount_paid + balance_due = total_amount
```

---

# 78. Vendor Bill Payment

`vendor_bill_payments` represents outgoing vendor payment.

It is currently structurally distinct from customer `payments`.

This distinction is canonical for the current implementation.

Do not collapse both into one generic payment entity without a future migration/ADR.

---

# 79. Retail POS Path

Current direct retail flow:

```text
CUSTOMER
   ↓
INVENTORY ITEM
   ↓
RETAIL_DIRECT ORDER
   ↓
INVENTORY RESERVATION
   ↓
INVOICE
   ↓
PAYMENT
   ↓
ANALYTICAL LEDGER
```

This path intentionally bypasses:

```text
lead
requirement
quote
```

when the transaction does not need those stages.

---

# 80. Custom B2B Path

Canonical custom flow:

```text
CHANNEL
   ↓
LEAD
   ↓
REQUIREMENT
   ↓
REQUIREMENT VERSION
   ↓
QUOTE
   ↓
QUOTE VERSION
   ↓
ORDER
   ↓
ORDER ITEM
   ↓
PRODUCTION JOB
   ↓
QC
   ↓
SHIPMENT
```

Parallel finance:

```text
ORDER
  ↓
INVOICE
  ↓
PAYMENT
```

Parallel sourcing:

```text
VENDOR
  ↓
PURCHASE ORDER
  ↓
GOODS RECEIPT
  ↓
INVENTORY / OPERATIONS
  ↓
VENDOR BILL
  ↓
VENDOR PAYMENT
```

---

# 81. Audit Entities

Current domain-specific audit tables include:

```text
quote_audit
order_audit
production_job_audit
invoice_audit
payment_audit
shipment_audit
```

They preserve actor/action history for important stateful entities.

A future generic audit architecture MAY consolidate patterns.

Current domain-specific audit tables remain authoritative.

---

# 82. Audit Is Different From Business Entity State

Audit answers:

```text
who changed what?
when?
why?
```

Canonical entity answers:

```text
what is the current authoritative state?
```

Audit history MUST NOT be confused with current state.

---

# 83. JSON Usage Rule

JSON/JSONB is permitted for:

```text
versioned domain-specific specification
snapshot payload
metadata
request payload
checklist
flexible attributes
```

JSON SHOULD NOT be used to avoid modeling critical relational business concepts.

Bad:

```text
metadata = {
  "payment_status": "paid",
  "invoice_balance": 0
}
```

when those concepts already deserve canonical fields/entities.

---

# 84. Snapshot Rule

Use snapshot when historical meaning must not change after source master data changes.

Current examples:

```text
customer_snapshot
issuer_snapshot
terms_snapshot
shipping_address_snapshot
billing_address_snapshot
payment_terms_snapshot
bank_account_snapshot
specification_snapshot
checklist_snapshot
```

Snapshot does not replace master entity.

It preserves transaction-time representation.

---

# 85. Master Data vs Transaction Data

## Master / Reference

Examples:

```text
organization
brand
business line
channel
customer
address
vendor
vendor rate card
inventory item
```

These can evolve.

## Stateful Transaction

Examples:

```text
lead
requirement
quote
order
production job
invoice
payment
shipment
purchase order
vendor bill
```

State may transition under rules.

## Historical / Append-Oriented

Examples:

```text
requirement version
quote version
audit records
inventory mutation
financial ledger entry
```

Historical records require stronger immutability.

---

# 86. Delete Semantics

Transactional history SHOULD NOT be casually hard-deleted.

Typical strategy:

```text
ACTIVE
INACTIVE
ARCHIVED
CANCELLED
VOID
REVERSED
```

depending on semantic domain.

Foreign-key delete rules are implementation-specific but SHOULD preserve important historical integrity.

---

# 87. Money Representation

Canonical monetary rule:

> **Rupiah values use integer/BigInt semantics.**

No floating-point arithmetic for Rupiah transaction amounts.

Examples:

```text
100000
= Rp100.000
```

not:

```text
100000.00 floating point
```

---

# 88. Currency

Current transactional implementation is primarily:

```text
IDR
```

Several transaction constraints currently enforce IDR.

Multi-currency MUST NOT be assumed supported merely because some generic fields contain a currency code.

Future multi-currency support requires explicit architecture.

---

# 89. Cost Trilogy

Canonical cost semantics:

```text
ESTIMATED
→ what we believe cost will be

COMMITTED
→ what we have contractually committed

ACTUAL
→ what was actually realized
```

These MUST NOT be collapsed into one mutable `cost` field.

This distinction is central to MGBOS margin intelligence.

---

# 90. Revenue and Cost Must Preserve Semantic Source

Financial analytics must distinguish:

```text
customer revenue
customer cash receipt
estimated production cost
committed vendor cost
actual production cost
vendor payment
shipping pass-through
```

Cash movement and profitability are not equivalent concepts.

---

# 91. Organization Isolation

Important transactional entities carry organizational ownership directly or indirectly.

Cross-organization access MUST be explicitly authorized.

Entity references MUST NOT create accidental tenant leakage.

Detailed RLS/permission implementation belongs to authorization architecture.

---

# 92. Brand Context

Brand context is important for:

```text
documents
commercial ownership
reporting
pricing
production attribution
inventory attribution where relevant
```

But not every shared entity must be duplicated per brand.

Customer remains organization-level.

---

# 93. Channel Attribution

Lead/source channel should preserve acquisition origin where relevant.

Channel is not the transaction itself.

It provides attribution/context.

Future campaign attribution MAY extend this domain separately.

---

# 94. Experimental Design Library

Current schema contains:

```text
design_assets
design_asset_versions
```

but implementation explicitly constrains them as demo/DRAFT design-library data.

Therefore classification:

```text
EXPERIMENTAL
```

It is not yet part of core transactional model.

Production design/creator/royalty architecture requires a dedicated future specification before becoming canonical core.

---

# 95. Future Extensions — Not Current Entities

The following concepts from historical planning are intentionally NOT current canonical entities:

```text
opportunity
generic catalog_item
catalog_variant
catalog_option
vendor_capability
vendor_offer
complaint
conversation
message
generic asset / entity_asset
generic task engine
generic business_event table
generic audit_log
AI execution history
integration_references
creator
royalty rules
```

Their absence is intentional documentation honesty.

They MAY be implemented later.

They MUST NOT be assumed to exist today.

---

# 96. Outbox Status

MGBOS architecture establishes Transactional Outbox as the intended integration pattern.

However current data model SHOULD NOT claim a production business-event/outbox table exists unless implementation evidence confirms the relevant slice.

Therefore:

```text
Transactional Outbox
=
TARGET ARCHITECTURAL PATTERN
```

not automatically:

```text
CURRENT DATA ENTITY
```

This distinction remains until an implemented migration introduces the canonical event/outbox model.

---

# 97. Derived Data Rule

Derived values MAY exist for:

```text
performance
dashboards
reporting
alerts
summary projections
```

Derived state MUST be reproducible or traceable to authoritative source data.

Example:

```text
order_financial_summaries
```

is a projection.

It does not become a new independent source of transaction truth.

---

# 98. Entity Relationship — Commercial

```text
ORGANIZATION
   │
   ├── BRAND
   │     └── BUSINESS LINE
   │
   ├── CHANNEL
   │
   └── CUSTOMER ACCOUNT
            │
            ├── CONTACT
            ├── ADDRESS
            ├── BRAND RELATIONSHIP
            │
            └── LEAD
                  │
                  ▼
             REQUIREMENT
                  │
                  ▼
          REQUIREMENT VERSION
                  │
                  ▼
                QUOTE
                  │
                  ▼
             QUOTE VERSION
                  │
                  ▼
              QUOTE ITEM
                  │
                  ▼
               ORDER
                  │
                  ▼
             ORDER ITEM
```

---

# 99. Entity Relationship — Production

```text
ORDER
  │
  └──< ORDER ITEM
          │
          │ N:M
          ▼
    PRODUCTION JOB
          │
          ├──< PRODUCTION ASSIGNMENT
          │
          └──< QC INSPECTION

VENDOR
  │
  ├──< VENDOR RATE CARD
  └──── participates in sourcing/execution
```

---

# 100. Entity Relationship — Customer Finance

```text
ORDER
  │
  └──< INVOICE
          │
          └──< PAYMENT ALLOCATION
                    │
                    ▼
                 PAYMENT
```

Parallel:

```text
ORDER
  │
  └──< FINANCIAL LEDGER ENTRY
```

---

# 101. Entity Relationship — Inventory & Procurement

```text
VENDOR
   │
   ▼
PURCHASE ORDER
   │
   └──< PURCHASE ORDER ITEM
                │
                ▼
         INVENTORY ITEM
                │
                ├── INVENTORY LEVEL
                ├── INVENTORY MUTATION
                └── INVENTORY RESERVATION

PURCHASE ORDER
      │
      ├──< GOODS RECEIPT
      │        └──< GOODS RECEIPT ITEM
      │
      └── VENDOR BILL
               └──< VENDOR BILL PAYMENT
```

---

# 102. Entity Relationship — Fulfillment

```text
ORDER
  │
  └──< SHIPMENT
          │
          └──< SHIPMENT ITEM
                    │
                    ▼
                ORDER ITEM
```

---

# 103. Complete Core Flow

Custom business transaction:

```text
ORGANIZATION
     ↓
BRAND
     ↓
CHANNEL
     ↓
LEAD
     ↓
CUSTOMER
     ↓
REQUIREMENT
     ↓
REQUIREMENT VERSION
     ↓
QUOTE
     ↓
QUOTE VERSION
     ↓
ORDER
 ┌────┼───────────────┐
 ▼    ▼               ▼
PROD  INVOICE       INVENTORY
 │      │
 ▼      ▼
QC   PAYMENT
 │
 ▼
SHIPMENT
```

Supporting supply chain:

```text
VENDOR
  ↓
PURCHASE ORDER
  ↓
GOODS RECEIPT
  ↓
INVENTORY
  ↓
VENDOR BILL
  ↓
VENDOR PAYMENT
```

Analytical overlay:

```text
ORDER
PRODUCTION
INVOICE
PAYMENT
SHIPPING
PROCUREMENT
      ↓
FINANCIAL LEDGER
      ↓
MARGIN / BUSINESS ANALYTICS
```

---

# 104. Data Ownership Summary

| Domain                    | Canonical Entity Owner         |
| ------------------------- | ------------------------------ |
| Organization              | `organizations`                |
| Brand                     | `brands`                       |
| Business Line             | `business_lines`               |
| Channel                   | `channels`                     |
| Human identity            | `users`                        |
| Membership                | `organization_members`         |
| Customer                  | `customer_accounts`            |
| Contact                   | `customer_contacts`            |
| Customer-brand relation   | `customer_brand_relationships` |
| Lead                      | `leads`                        |
| Requirement               | `requirements`                 |
| Requirement history       | `requirement_versions`         |
| Quote identity            | `quotes`                       |
| Commercial quote snapshot | `quote_versions`               |
| Contract                  | `orders`                       |
| Contract line             | `order_items`                  |
| Production work           | `production_jobs`              |
| Production assignment     | `production_assignments`       |
| Vendor                    | `vendors`                      |
| QC                        | `qc_inspections`               |
| Receivable                | `invoices`                     |
| Incoming cash             | `payments`                     |
| Payment application       | `payment_allocations`          |
| Analytical finance        | `financial_ledger_entries`     |
| Shipment                  | `shipments`                    |
| SKU/stock identity        | `inventory_items`              |
| Stock balance             | `inventory_levels`             |
| Stock history             | `inventory_mutations`          |
| Reserved stock            | `inventory_reservations`       |
| Purchasing commitment     | `purchase_orders`              |
| Physical purchase receipt | `goods_receipts`               |
| Vendor payable            | `vendor_bills`                 |
| Vendor cash-out           | `vendor_bill_payments`         |

---

# 105. Architectural Invariants

The data model establishes these invariants:

1. Stable UUIDs are canonical internal identities.
2. Human document numbers are not database identity.
3. Customers are organization-level entities, not duplicated blindly per brand.
4. Brand relationships are modeled separately from customer identity.
5. Requirements and quotations are versioned.
6. Historical commercial snapshots must remain traceable.
7. Orders are contractual snapshots.
8. Commercial, production, financial, QC, fulfillment, inventory, and procurement state remain distinct.
9. Production work is not assumed to be 1:1 with order items.
10. Payments and invoices are not forced into a 1:1 relationship.
11. Procurement and customer finance remain separate flows.
12. Inventory reservation and physical stock are different quantities.
13. Physical goods receipt is distinct from purchasing commitment.
14. Estimated, committed, and actual cost remain semantically separate.
15. Shipping pass-through must remain isolated from product margin.
16. Historical/append-oriented records require stronger immutability.
17. JSON is an extension mechanism, not a substitute for critical relational modeling.
18. Derived projections do not replace transactional sources.
19. AI-generated information does not become canonical business state without authorized processing.
20. Future planned entities are not treated as current reality.

---

# 106. Migration Rule for Future Domains

A new business concept SHOULD become a first-class entity when it has one or more of these properties:

```text
independent lifecycle
independent identity
important relationships
audit requirement
permission requirement
frequent querying
financial consequence
historical importance
```

Do not add tables only because an idea exists.

Do not hide a durable business concept inside JSON merely to avoid modeling it.

---

# 107. Extension Rule

Future extensions such as:

```text
Opportunity
Campaign Attribution
Conversation
Creator/Royalty
Complaint
Task
Asset Management
Integration Reference
Business Event
AI Execution
```

must enter MGBOS through:

```text
business need
↓
canonical specification
↓
relationship analysis
↓
ADR if architectural
↓
migration
↓
tests
↓
implementation evidence
```

They MUST NOT be introduced by ad hoc table creation.

---

# 108. Canonicalization Effect

With activation of this document:

```text
MGBOS 0.2 Canonical Data Model v0.1
and
MGBOS 0.2.1 Logical Data Model
```

change role from:

```text
TRANSITIONAL_AUTHORITY
```

to:

```text
HISTORICAL / DESIGN PROVENANCE
```

for canonical entity semantics.

They remain useful for understanding why the architecture evolved.

They no longer override this specification.

---

# 109. Relationship to Database Migrations

Canonical hierarchy:

```text
THIS DOCUMENT
→ semantic model

MIGRATIONS
→ implementation

DATABASE
→ runtime state

TESTS
→ enforcement evidence
```

A migration may add implementation detail without requiring this document to enumerate every index, helper function, or technical column.

A migration that materially changes entity semantics MUST trigger a review of this document.

---

# 110. Non-Goals

This document does not fully define:

```text
state transition rules
permission matrix
RLS policy
command contracts
event contracts
API contracts
UI structure
database indexes
stored procedure internals
JARVIS memory
accounting-grade general ledger
future CRM opportunity model
creator royalty model
```

Those belong to dedicated canonical specifications.

---

# 111. North Star

The MGBOS data model should make it possible to answer reliably:

```text
Who is the customer?

What exactly did they request?

Which version did we quote?

What did they accept?

What did we contract to deliver?

How was production split?

Who performed it?

What did it cost?

What was invoiced?

What was actually paid?

What stock was reserved or consumed?

What did we purchase?

What was physically received?

What was shipped?

What margin was actually realized?
```

without reconstructing business truth from:

```text
WhatsApp
spreadsheet
AI memory
n8n workflow state
human memory
```

---

# 112. Final Principle

> **MGBOS models durable business truth, preserves historical context, and separates identity, intent, commitment, execution, finance, and physical reality instead of collapsing them into convenient but ambiguous records.**
