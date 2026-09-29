---
canonical_id: mgbos.architecture.business-invariants
status: ACTIVE
version: 1.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: mgbos
document_class: canonical-specification
effective_from: 2026-09-29
authoritative_for:
  - mgbos business invariants
  - transactional integrity rules
  - monetary integrity
  - commercial snapshot integrity
  - payment and receivable integrity
  - inventory integrity
  - procurement integrity
  - cost and margin semantics
  - idempotency expectations
  - organization isolation expectations
  - mutation boundary expectations
last_reviewed: 2026-09-29
review_cadence: quarterly
depends_on:
  - ../../../docs/governance/documentation-constitution.md
  - ../../../docs/governance/canonical-source-map.md
  - ../../../docs/architecture/master-system-blueprint.md
  - ../../../docs/architecture/system-boundaries.md
  - ../../../docs/architecture/architectural-laws.md
  - canonical-data-model.md
  - business-state-machines.md
  - README.md
  - ../adr/002-postgresql-system-of-record.md
  - ../adr/005-transactional-outbox.md
  - ../adr/006-ai-gateway.md
supersedes: null
implementation_basis:
  - ../../supabase/migrations/
  - ../../packages/domain/
  - ../../supabase/tests/
implementation_through: MGBOS-020
---

# MGBOS Business Invariants v1.0

## 1. Purpose

Dokumen ini mendefinisikan business invariants MGBOS.

Invariant adalah kondisi yang:

> **harus tetap benar sebelum, selama, dan setelah transaksi bisnis.**

Berbeda dengan state machine yang menjawab:

```text id="a1ou9z"
"status boleh berpindah ke mana?"
```

Business invariant menjawab:

```text id="lrpwwv"
"apa yang tidak boleh pernah menjadi salah?"
```

Contoh:

```text id="dl7xtv"
invoice balance tidak boleh negatif

reserved inventory tidak boleh melebihi physical stock

payment allocation tidak boleh melebihi payment

accepted quote tidak boleh diam-diam berubah

order historis tidak boleh berubah ketika customer master berubah
```

---

# 2. Invariant Authority

Business invariants dimiliki oleh MGBOS.

Mereka MUST NOT hanya hidup di:

```text id="1sqazq"
frontend validation
AI prompt
n8n workflow
spreadsheet formula
developer convention
```

Critical invariant SHOULD memiliki deterministic enforcement di salah satu atau beberapa layer:

```text id="92zh2p"
domain logic
application command
database constraint
transaction
trigger
```

---

# 3. Enforcement Hierarchy

Preferred model:

```text id="xrqx08"
USER / AGENT / AUTOMATION
          ↓
VALIDATED COMMAND
          ↓
DOMAIN RULE
          ↓
DATABASE TRANSACTION
          ↓
DATABASE CONSTRAINT
```

Defense in depth is encouraged for high-value rules.

UI validation improves UX.

It does not replace authoritative enforcement.

---

# 4. Invariant Classification

Dokumen ini menggunakan tiga tingkat.

## HARD INVARIANT

Violation would create invalid business truth.

MUST be deterministically enforced.

## CONTROL INVARIANT

Protects security, authority, or operational correctness.

SHOULD have deterministic enforcement.

## ANALYTICAL INVARIANT

Protects consistent business interpretation and reporting.

Must remain semantically canonical even when implementation is derived.

---

# 5. INV-001 — Authoritative Business Truth Lives in MGBOS/PostgreSQL

**Type:** HARD

For MGBOS-controlled domains:

```text id="xyc76q"
PostgreSQL
=
authoritative persistent business state
```

The following are not competing systems of record:

```text id="py4qw7"
browser state
AI memory
n8n execution state
spreadsheet copy
WhatsApp message
dashboard cache
LLM response
```

They may initiate or describe a business change.

They do not independently establish canonical truth.

---

# 6. INV-002 — Critical Mutations Cross an Authorized Command Boundary

**Type:** HARD / CONTROL

Critical entities MUST NOT be mutated directly from UI or automation.

Examples:

```text id="h45v98"
quote
order
production job
QC
invoice
payment
inventory
purchase order
shipment
```

Correct:

```text id="leeg1o"
UI / JARVIS / n8n
       ↓
authorized command
       ↓
validation
       ↓
transaction
```

Forbidden:

```text id="h1pfj7"
AI / UI / n8n
       ↓
raw business-table update
```

---

# 7. INV-003 — Organization Ownership Must Never Be Crossed Implicitly

**Type:** HARD / CONTROL

Entity operations MUST remain scoped to their owning organization.

Example:

```text id="phv4d6"
payment.organization_id
invoice.organization_id
customer.organization_id
```

must resolve within compatible organizational ownership.

A valid UUID from another organization MUST NOT become sufficient authorization.

---

# 8. INV-004 — Active Membership Does Not Equal Unlimited Authority

**Type:** CONTROL

A user having active organization membership proves membership.

It does not prove permission for every command.

Authorization must additionally consider role/capability.

Example:

```text id="8jlf22"
ACTIVE member
≠
may record payment
```

---

# 9. INV-005 — Active Referenced Master Data Is Required Where Transaction Semantics Depend on It

**Type:** HARD

New transactional operations SHOULD reject inactive/incompatible references where appropriate.

Examples:

```text id="95jise"
inactive brand
inactive customer
inactive vendor
```

must not silently enter a new business transaction requiring active status.

Historical records remain valid if the master entity becomes inactive later.

---

# 10. INV-006 — Internal Identity Uses Stable UUIDs

**Type:** HARD

Business document numbers are presentation/business references.

They do not replace internal entity identity.

```text id="11gpdz"
UUID
→ identity

TS-O-2026-000123
→ human-readable business number
```

---

# 11. INV-007 — Document Numbers Must Be Unique Within Their Defined Scope

**Type:** HARD

Generated business identifiers must not collide.

Document sequence generation MUST be atomic/concurrency-safe.

Examples:

```text id="qpysdx"
quote number
order number
invoice number
payment number
QC number
delivery order number
purchase order number
```

---

# 12. INV-008 — Rupiah Uses Integer Arithmetic

**Type:** HARD

Canonical Rupiah values use:

```text id="se9gaw"
BIGINT / integer semantics
```

MUST NOT use floating-point arithmetic for transactional money.

Correct:

```text id="itv4wl"
Rp125.000
→ 125000
```

---

# 13. INV-009 — Negative Transaction Amounts Are Forbidden Unless the Domain Explicitly Defines Them

**Type:** HARD

Examples:

```text id="avlcmv"
payment amount > 0
invoice balance >= 0
purchase quantity > 0
unit cost >= 0
discount >= 0
shipping >= 0
```

A reversal is represented by reversal semantics/history.

Not by casually changing a valid amount into a negative equivalent.

---

# 14. INV-010 — Monetary Totals Must Reconcile

**Type:** HARD

For quotation/order semantics:

```text id="w5l2vf"
grand_total
=
subtotal
-
discount_total
+
shipping_total
```

For invoice:

```text id="irbotv"
amount_total
=
amount_subtotal
+
amount_tax
+
amount_shipping
```

For receivable:

```text id="t7u5z3"
balance_due
=
amount_total
-
amount_paid
```

For vendor bill:

```text id="v137q2"
amount_paid
+
balance_due
=
total_amount
```

These are arithmetic invariants, not presentation conventions.

---

# 15. INV-011 — Discount Cannot Create Invalid Revenue

**Type:** HARD

Commercial discount MUST NOT produce an invalid line/order total.

Current quotation semantics require:

```text id="omdhjf"
discount_total < subtotal
```

and resulting net commercial revenue must remain positive where the business transaction requires positive sale value.

---

# 16. INV-012 — Shipping Pass-Through Is Not Product Revenue

**Type:** ANALYTICAL / HARD SEMANTIC

Courier shipping paid by the customer is a pass-through amount.

It MUST NOT inflate:

```text id="he9r8m"
product revenue
gross product profit
product margin
```

Canonical concept:

```text id="z8jlhj"
NET PRODUCT REVENUE
=
product subtotal
-
commercial discount
```

Shipping remains separately attributable.

---

# 17. INV-013 — Product Margin Excludes Pass-Through Shipping

**Type:** ANALYTICAL

Margin calculation MUST use economically meaningful product revenue.

Conceptually:

```text id="u06gux"
Gross Profit
=
Net Product Revenue
-
Product/Production Cost
-
other margin-bearing costs
```

not:

```text id="64jtsf"
customer grand total
-
cost
```

when grand total contains pass-through shipping.

---

# 18. INV-014 — Estimated, Committed, and Actual Cost Are Different Facts

**Type:** HARD SEMANTIC

The Cost Trilogy MUST remain distinct:

```text id="cqnkr8"
ESTIMATED
        ↓
COMMITTED
        ↓
ACTUAL
```

Estimated cost:

> what MGBOS expects.

Committed cost:

> what the business has contractually committed.

Actual cost:

> what business reality ultimately cost.

One value MUST NOT overwrite another.

---

# 19. INV-015 — Pricing Guard Uses Net Product Economics

**Type:** HARD / ANALYTICAL

Current quotation pricing guard uses estimated profitability.

Current thresholds:

```text id="uj6aqs"
margin >= 30%
→ TARGET

25% <= margin < 30%
→ CAUTION

20% <= margin < 25%
→ WARNING

margin < 20%
→ APPROVAL_REQUIRED
```

These represent current pricing-control semantics.

Changing thresholds is a business-rule change requiring explicit specification update.

---

# 20. INV-016 — Below-Floor Quote Requires Explicit Owner Approval

**Type:** CONTROL

A quotation classified:

```text id="x5mso0"
APPROVAL_REQUIRED
```

MUST NOT be sent without the required pricing override approval.

Approval must preserve:

```text id="ot1c8u"
approver
reason
quote version
timestamp
```

Current enforcement reserves this override to OWNER.

---

# 21. INV-017 — Approval Does Not Rewrite Pricing History

**Type:** HARD

Approval allows an exceptional commercial decision.

It MUST NOT alter historical calculated values to make the quote appear compliant.

Correct:

```text id="fo2ed6"
margin = 18%
pricing_guard = APPROVAL_REQUIRED
approval = OWNER APPROVED
```

Not:

```text id="cxli54"
change stored margin to 20%
```

---

# 22. INV-018 — Requirement Versions Become Immutable When Locked

**Type:** HARD

A locked requirement version MUST NOT be modified or deleted.

Customer changes create:

```text id="2jm8ew"
new requirement version
```

not historical rewriting.

---

# 23. INV-019 — Sent Commercial Quote Snapshots Are Historical Records

**Type:** HARD

Once a quote version becomes an externally meaningful commercial snapshot, its substantive content MUST NOT be mutated.

Changes require:

```text id="c64prt"
new quote version
```

Historical quote items, cost components, approvals, and audit history remain preserved.

---

# 24. INV-020 — Quote Revision Preserves Commercial Identity

**Type:** HARD

A revision of an existing quote MUST remain attached to the same compatible:

```text id="3v9kjz"
quote
requirement
brand
customer
```

A revision MUST NOT silently become an unrelated commercial deal.

---

# 25. INV-021 — Only the Current Quote Version May Progress Commercially

**Type:** HARD

Sending or accepting a stale version is prohibited.

Correct:

```text id="y5unjp"
quote.current_version_id
=
version being acted upon
```

---

# 26. INV-022 — An Accepted Quote Must Be Valid at Acceptance Time

**Type:** HARD

Acceptance requires at minimum:

```text id="68s58p"
current version
SENT state
not expired
locked referenced requirement
active customer
active brand
required price approval
```

A customer response does not override those guards.

---

# 27. INV-023 — Custom B2B Orders Preserve Their Commercial Lineage

**Type:** HARD

For:

```text id="smqiyh"
CUSTOM_B2B
```

Order MUST retain links to:

```text id="3n4ui5"
quote
quote version
requirement
requirement version
```

This preserves contractual provenance.

---

# 28. INV-024 — Direct Retail Orders May Bypass Quote/Requirement, But Only Explicitly

**Type:** HARD

For:

```text id="jbv4ql"
RETAIL_DIRECT
```

quote/requirement references MAY be null.

This exception MUST be represented through explicit:

```text id="20aeco"
order_type = RETAIL_DIRECT
```

and not through arbitrary missing data in a B2B order.

---

# 29. INV-025 — One Accepted Quote Version Cannot Create Multiple Independent B2B Orders Accidentally

**Type:** HARD

Order creation from an accepted quote version must remain effectively one-time/idempotent.

Retrying creation MUST resolve the existing order rather than duplicate the business commitment.

---

# 30. INV-026 — Order Contract Snapshot Is Immutable

**Type:** HARD

After order creation, contractual content such as:

```text id="yp2vhj"
prices
financial totals
customer snapshot
addresses
item specifications
terms
```

MUST NOT be rewritten.

Current Order allows lifecycle status movement but protects contract content.

---

# 31. INV-027 — Order Items Are Historical Contract Lines

**Type:** HARD

An order item MUST NOT change because:

```text id="ck6j3j"
inventory item renamed
customer changed address
price list changed
requirement changed
```

after contract creation.

Historical contract meaning remains stable.

---

# 32. INV-028 — Customer Master Mutation Does Not Rewrite Transactions

**Type:** HARD

If customer changes:

```text id="4bfhwa"
name
email
address
company information
```

historical:

```text id="fbfzbx"
quote
order
invoice
shipment
```

snapshots remain unchanged.

---

# 33. INV-029 — Transaction Snapshots and Master Data Serve Different Purposes

**Type:** HARD SEMANTIC

Master data answers:

> What is true about the entity now?

Snapshot answers:

> What was represented/agreed at transaction time?

Neither should replace the other.

---

# 34. INV-030 — Payment Amount Must Be Positive

**Type:** HARD

```text id="9d1nuk"
payment.amount > 0
```

Refund/reversal semantics MUST be explicit.

---

# 35. INV-031 — Confirmed Payment Core Facts Are Immutable

**Type:** HARD

Once confirmed, core payment facts such as:

```text id="rfx8h3"
amount
organization
currency
document identity
```

MUST NOT be rewritten.

Corrections use:

```text id="31go9h"
REVERSED
```

semantics.

---

# 36. INV-032 — Reversed Payment Cannot Be Reactivated

**Type:** HARD

```text id="m3equp"
REVERSED
```

is historical terminal payment state.

A new valid payment requires a new transaction.

---

# 37. INV-033 — Confirmed/Reversed Payments Must Not Be Hard-Deleted

**Type:** HARD

Financial history is preserved.

Correction is:

```text id="y8d7os"
reversal
```

not:

```text id="ux03pb"
DELETE payment
```

---

# 38. INV-034 — Payment Allocation Cannot Exceed Payment Amount

**Type:** HARD

Canonical:

```text id="2lbx2v"
allocated_amount
<=
payment.amount
```

Sum of requested allocations MUST NOT exceed available payment funds.

---

# 39. INV-035 — Payment Allocation Cannot Exceed Invoice Balance

**Type:** HARD

For every allocation:

```text id="f5dfl5"
allocation.amount
<=
invoice.balance_due
```

Overpayment MUST NOT silently create negative receivable balance.

---

# 40. INV-036 — Allocation Amount Must Be Positive

**Type:** HARD

```text id="zprlzr"
payment_allocation.amount > 0
```

Reversal of allocation is performed through payment reversal/reconciliation semantics, not negative allocation hacks.

---

# 41. INV-037 — Only Financially Eligible Invoices Accept Allocations

**Type:** HARD

Current eligible invoice states:

```text id="b2ce4b"
ISSUED
PARTIALLY_PAID
```

Payment cannot be allocated to:

```text id="m1mk6x"
DRAFT
PAID
VOID
CANCELLED
```

under current semantics.

---

# 42. INV-038 — Invoice Payment Status Is Derived From Authoritative Amounts

**Type:** HARD

If:

```text id="00anh5"
balance_due = 0
```

invoice becomes:

```text id="sp0s5j"
PAID
```

Otherwise, after positive allocation:

```text id="yp316r"
PARTIALLY_PAID
```

Status MUST remain consistent with amount fields.

---

# 43. INV-039 — Payment Reversal Restores Invoice Economics

**Type:** HARD

Reversing payment MUST restore affected:

```text id="svj0zo"
invoice amount_paid
balance_due
status
paid_at
```

consistently.

Payment reversal cannot only change payment status while leaving invoices falsely paid.

---

# 44. INV-040 — Invoice With Recorded Payment Cannot Be Voided Directly

**Type:** HARD

Before invoice void:

```text id="ih3q73"
amount_paid = 0
```

Existing payment effects must first be reconciled/deallocated/reversed.

---

# 45. INV-041 — Vendor Payment Cannot Exceed Vendor Bill Balance

**Type:** HARD

```text id="4abl33"
vendor payment
<=
vendor_bill.balance_due
```

A PAID or VOID vendor bill cannot accept further payment.

---

# 46. INV-042 — Vendor Bill Balance Must Reconcile

**Type:** HARD

```text id="kgxwqn"
amount_paid
+
balance_due
=
total_amount
```

must always hold.

---

# 47. INV-043 — Financial Ledger Entries Preserve Economic Meaning

**Type:** ANALYTICAL

Ledger categories and entry types MUST reflect the economic event being represented.

Example:

```text id="zifb8o"
ORDER_COMMITTED
≠
PAYMENT_RECEIVED
```

Revenue commitment and cash receipt are distinct.

---

# 48. INV-044 — Analytical Ledger Is Append-Oriented

**Type:** HARD / ANALYTICAL

Historical financial events SHOULD NOT be rewritten to alter business history.

Corrections require new/reversal/adjustment semantics.

---

# 49. INV-045 — Cash Movement Is Not Revenue

**Type:** ANALYTICAL

Receiving cash and recognizing product economics are distinct facts.

Likewise:

```text id="w4v4q9"
vendor payment
≠
cost commitment
```

Financial intelligence MUST preserve those distinctions.

---

# 50. INV-046 — Inventory On-Hand Cannot Be Negative

**Type:** HARD

```text id="ijivgf"
quantity_on_hand >= 0
```

---

# 51. INV-047 — Reserved Inventory Cannot Be Negative

**Type:** HARD

```text id="dn126o"
quantity_reserved >= 0
```

---

# 52. INV-048 — Reserved Quantity Cannot Exceed Physical On-Hand

**Type:** HARD

Canonical:

```text id="9u2okj"
quantity_reserved
<=
quantity_on_hand
```

Therefore:

```text id="9r4cfm"
available
=
on_hand - reserved
>= 0
```

---

# 53. INV-049 — Reservation Cannot Exceed Available Inventory

**Type:** HARD

Before reservation:

```text id="tbn7gu"
available
=
quantity_on_hand - quantity_reserved
```

Requested quantity MUST satisfy:

```text id="7vs6vi"
requested <= available
```

This is the anti-overselling invariant.

---

# 54. INV-050 — Inventory Reservation Is Concurrency-Safe

**Type:** HARD

Stock reservation MUST lock or otherwise serialize relevant authoritative inventory level before modifying reserved quantity.

Checking availability without protecting concurrent mutation is insufficient.

---

# 55. INV-051 — Inventory Reservation Must Have Positive Quantity

**Type:** HARD

```text id="8k70gk"
reservation.quantity > 0
```

---

# 56. INV-052 — Consuming Reserved Inventory Reduces Both Physical and Reserved Quantity

**Type:** HARD

When active reservation is consumed:

```text id="9fzf7a"
on_hand
↓

reserved
↓
```

by the reserved quantity.

This preserves availability math.

---

# 57. INV-053 — Releasing Reservation Reduces Reserved Quantity, Not Physical Stock

**Type:** HARD

Release means:

```text id="2jrtb3"
reserved ↓
on_hand unchanged
```

because no physical stock was consumed.

---

# 58. INV-054 — Inventory Mutation History Is Append-Oriented

**Type:** HARD

Stock changes SHOULD generate inventory mutation records.

Inventory level answers:

> What is current stock?

Inventory mutation answers:

> How did it get there?

Both are required for reliable reconciliation.

---

# 59. INV-055 — Stock Opname Cannot Produce Less Physical Stock Than Active Reservations

**Type:** HARD

If:

```text id="yusije"
actual physical count
<
active reserved quantity
```

opname MUST fail or force explicit prior reconciliation.

Otherwise reservations would refer to nonexistent stock.

---

# 60. INV-056 — Stock Opname Requires Reason

**Type:** CONTROL

Physical adjustment must preserve human/system explanation.

Stock discrepancy is an auditable business event, not silent correction.

---

# 61. INV-057 — Purchase Quantity Must Be Positive

**Type:** HARD

```text id="2m4k8w"
PO quantity_ordered > 0
```

and unit cost cannot be negative.

---

# 62. INV-058 — Purchase Order Requires Active Vendor

**Type:** HARD

A new PO MUST NOT be issued to an inactive/suspended vendor where current command requires ACTIVE vendor.

Historical POs remain valid after vendor status later changes.

---

# 63. INV-059 — Received Purchase Quantity Cannot Exceed Ordered Quantity

**Type:** HARD

For each PO line:

```text id="cez37c"
quantity_received
<=
quantity_ordered
```

A delivery note claiming extra units does not silently rewrite purchase commitment.

---

# 64. INV-060 — Physical Receipt, Not PO Creation, Increases On-Hand Stock

**Type:** HARD

Purchase Order means:

```text id="742tzp"
we committed to buy
```

Goods Receipt means:

```text id="hmwhlu"
we physically received
```

Inventory increases only from accepted physical receipt or another explicit inventory mutation.

---

# 65. INV-061 — Rejected Goods Do Not Increase Accepted Inventory

**Type:** HARD

Goods Receipt distinguishes:

```text id="bniy8t"
quantity_accepted
quantity_rejected
```

Only accepted physical quantity contributes to inbound stock.

---

# 66. INV-062 — Goods Receipt Cannot Continue Against Closed Procurement State

**Type:** HARD

Current receipt command prevents further receipt when PO is:

```text id="1yhadn"
RECEIVED
CANCELLED
```

---

# 67. INV-063 — Purchase Receipt and Vendor Liability Are Related but Distinct

**Type:** HARD SEMANTIC

Goods received is physical truth.

Vendor bill is payable truth.

They MUST NOT be represented as the same entity/state.

---

# 68. INV-064 — Production Assignment Does Not Rewrite Order Contract

**Type:** HARD

Changing:

```text id="21kcbe"
vendor
production executor
committed production cost
```

does not alter what the customer originally contracted to buy.

Commercial contract and operational execution remain separate.

---

# 69. INV-065 — Production Cost States Remain Distinct

**Type:** HARD

At production-job level:

```text id="jylf9x"
estimated_cost
committed_cost
actual_cost
```

must preserve distinct semantics.

A vendor assignment may establish committed cost.

It MUST NOT silently overwrite estimated history.

---

# 70. INV-066 — QC Requires the Correct Production Context

**Type:** HARD

Current QC inspection requires production job state:

```text id="jzwc5n"
AWAITING_QC
```

QC MUST NOT certify a job that has not reached the inspection boundary.

---

# 71. INV-067 — Rework Requires Explicit Defect Context

**Type:** HARD / CONTROL

When QC identifies defects/rework, system requires meaningful:

```text id="gqr7zi"
defect category
defect severity
rework instructions where required
```

A generic:

```text id="brw8gn"
FAIL
```

without enough operational context is insufficient for controlled rework.

---

# 72. INV-068 — Shipment Quantity Cannot Exceed Order Quantity

**Type:** HARD

Across active/non-returned shipments:

```text id="a5yw74"
sum(shipment_item.quantity)
<=
order_item.quantity
```

This supports partial shipment while preventing over-fulfillment.

---

# 73. INV-069 — Shipment Must Reference Items Belonging to the Same Order

**Type:** HARD

A Shipment for Order A MUST NOT contain an Order Item from Order B.

---

# 74. INV-070 — External Courier Dispatch Requires Tracking Evidence Where Applicable

**Type:** CONTROL

For non-internal/non-pickup courier flow, dispatch SHOULD require tracking number.

This connects digital state to an external fulfillment reference.

---

# 75. INV-071 — Delivered Shipment Cannot Be Cancelled

**Type:** HARD

Physical delivery history cannot be erased by simply changing:

```text id="7ut6e1"
DELIVERED → CANCELLED
```

Returns require separate semantics.

---

# 76. INV-072 — Actual Shipping Cost Remains Economically Separate

**Type:** ANALYTICAL

Actual courier disbursement should remain traceable separately from product cost/revenue.

This supports reconciliation:

```text id="7jp15d"
customer shipping collected
vs
actual courier expense
```

---

# 77. INV-073 — Material Commands Must Be Idempotent Where Retry Can Occur

**Type:** HARD / CONTROL

Networked systems retry.

Therefore commands likely to be retried MUST avoid duplicate business effects.

Examples:

```text id="eqbb65"
save quote version
create order
create retail order
external integration mutation
```

---

# 78. INV-074 — Reusing an Idempotency Key Must Never Create a Second Transaction

**Type:** HARD

Same command identity should resolve:

```text id="7tbqi3"
same business effect
```

or produce explicit conflict.

Never duplicate transaction.

---

# 79. INV-075 — Same Idempotency Key With Different Payload Should Be Rejected Where Payload Identity Is Material

**Type:** HARD TARGET

Strong idempotency means:

```text id="xz1i6c"
same request_id
+
same payload
→ same result

same request_id
+
different payload
→ conflict
```

Quote creation currently implements this strongly.

Other command paths SHOULD converge on the same standard.

Current gap:

> Retail order retry detects existing request identity but does not yet provide the same explicit payload-conflict protection as quote versioning.

This should be standardized.

---

# 80. INV-076 — Concurrency-Sensitive Operations Must Protect Their Read-Modify-Write Cycle

**Type:** HARD

Examples:

```text id="wp5ngb"
stock reservation
payment allocation
PO goods receipt
document sequencing
quote revision
order creation
```

must use appropriate:

```text id="g3ys3n"
row lock
transaction
advisory lock
unique constraint
```

or equivalent concurrency protection.

---

# 81. INV-077 — Failure Atomicity Must Protect Multi-Entity Transactions

**Type:** HARD

A command that semantically represents one business operation SHOULD NOT leave half-finished state.

Example:

```text id="3a5uqb"
record payment
+
allocate invoice
+
update invoice balance
```

must succeed or fail coherently.

---

# 82. INV-078 — Retail Checkout Must Be Atomic Across Critical Commitments

**Type:** HARD

Current retail flow coordinates:

```text id="fvn5n3"
order
order items
stock reservation
invoice
optional payment
ledger effects
```

A stock reservation failure must not leave a valid completed retail transaction that assumes nonexistent stock.

---

# 83. INV-079 — Business State Must Not Be Invented After External Uncertainty

**Type:** HARD / CONTROL

If external system response is uncertain:

```text id="9kn6lb"
timeout
callback missing
connection dropped
```

MGBOS MUST NOT invent:

```text id="2az5ci"
SUCCESS
```

when actual side effect is unknown.

Correct state may require:

```text id="gz6maw"
reconciliation
```

---

# 84. INV-080 — Audit History Is Append-Oriented

**Type:** CONTROL

Important audits such as:

```text id="va67g7"
quote_audit
order_audit
production_job_audit
invoice_audit
payment_audit
shipment_audit
```

SHOULD NOT be rewritten to make history appear different.

---

# 85. INV-081 — Actor Identity Must Accompany Material Mutations

**Type:** CONTROL

Material business commands SHOULD know:

```text id="od6r01"
who acted
```

Examples:

```text id="7pfo86"
created_by_user_id
actor_id
approved_by_user_id
inspector_id
received_by_user_id
```

Anonymous authority for sensitive business mutation should be avoided.

---

# 86. INV-082 — Reason Is Required for Exceptional/Destructive Business Actions

**Type:** CONTROL

Examples include:

```text id="qnhpfd"
pricing override
payment reversal
stock opname adjustment
shipment cancellation
rework
```

Reason text is part of accountability.

---

# 87. INV-083 — Derived Projections Must Be Traceable to Canonical Data

**Type:** ANALYTICAL

Examples:

```text id="qme263"
order financial summary
margin dashboard
inventory availability
order health
```

may be cached/projected.

They MUST remain traceable to authoritative base facts.

---

# 88. INV-084 — Cached Values Must Not Become Independent Truth

**Type:** ANALYTICAL

Cached:

```text id="80jr01"
rating
summary
lifetime value
dashboard metric
```

is an optimization.

Critical transactional decisions SHOULD revalidate against authoritative sources where freshness matters.

---

# 89. INV-085 — AI Output Is Advisory Until Accepted Through a Business Boundary

**Type:** HARD / CONTROL

AI may produce:

```text id="8x8l1r"
classification
extraction
recommendation
draft
analysis
prediction
```

It does not become canonical transaction state merely because model confidence is high.

---

# 90. INV-086 — AI Must Not Be the Sole Enforcement Layer for Deterministic Rules

**Type:** HARD

Rules such as:

```text id="0yiept"
margin floor
invoice balance
stock availability
payment ceiling
state validity
organization ownership
```

must be deterministic.

Prompt instructions are insufficient.

---

# 91. INV-087 — n8n Does Not Own Business Integrity

**Type:** HARD / CONTROL

n8n may:

```text id="zzqvp3"
trigger
route
retry
notify
schedule
```

but MGBOS remains responsible for validating requested mutation.

A buggy workflow must not be able to violate invariant simply by calling an endpoint repeatedly.

---

# 92. INV-088 — Event Delivery Must Be Idempotent

**Type:** CONTROL

When MGBOS business events gain downstream consumers, repeated delivery MUST NOT create repeated business effects.

Consumers must tolerate:

```text id="wc1psh"
duplicate events
retry
out-of-order delivery where possible
```

---

# 93. INV-089 — Canonical Mutation and Event Record Must Be Atomic When Transactional Outbox Is Used

**Type:** HARD TARGET

When an external consumer depends on a critical business event:

```text id="zj5f8d"
database mutation
+
outbox record
```

SHOULD commit atomically.

Never:

```text id="j4j2e1"
business commit succeeded
event creation silently lost
```

for flows relying on guaranteed event propagation.

Current status:

```text id="h22q34"
TARGET ARCHITECTURAL PATTERN
```

until an implemented outbox slice exists.

---

# 94. INV-090 — Event Transport Does Not Become Business Truth

**Type:** HARD

Even with outbox/event architecture:

```text id="pxdmrz"
event
≠
database state
```

Consumers needing current truth SHOULD re-read authoritative projection where required.

---

# 95. INV-091 — Physical Events Require Trusted Observation

**Type:** HARD

Examples:

```text id="fyljv8"
goods received
QC performed
stock counted
shipment delivered
```

must originate from appropriate evidence/observation.

Scheduling alone does not prove physical reality occurred.

---

# 96. INV-092 — Historical Facts Are Corrected, Not Erased

**Type:** HARD

Examples:

```text id="6az3sf"
payment reversal
inventory adjustment
new quote version
audit amendment
```

preserve history.

MGBOS SHOULD prefer compensating/corrective records over destructive historical mutation.

---

# 97. INV-093 — Current State and Historical Evidence Must Agree Semantically

**Type:** HARD

Examples:

```text id="8o396j"
Invoice PAID
```

must be explainable through payment allocations.

```text id="xf0pii"
inventory quantity_on_hand = 80
```

should be reconcilable to mutation/physical adjustment history.

Derived state without supporting history indicates reconciliation risk.

---

# 98. INV-094 — Transactional JSON Must Not Hide Core Integrity

**Type:** HARD DESIGN

JSON is appropriate for:

```text id="86aamz"
specification
snapshot
metadata
flexible attributes
```

It MUST NOT become the only home for critical facts such as:

```text id="0kxpff"
amount paid
invoice balance
order identity
inventory quantity
payment status
```

---

# 99. INV-095 — Schema Flexibility Must Not Destroy Queryability

**Type:** CONTROL DESIGN

If a JSON attribute becomes:

```text id="5rswl1"
financially material
permission-sensitive
frequently queried
required for invariants
```

it SHOULD be promoted to an explicit canonical field/entity.

---

# 100. INV-096 — Business Logic Remains Independent of Presentation Framework

**Type:** CONTROL ARCHITECTURAL

Critical business rules MUST NOT depend on:

```text id="oxq2dc"
React
browser
specific page
UI component
```

The same invariant must hold whether command originates from:

```text id="7su9ts"
web UI
API
JARVIS
automation
mobile app
```

---

# 101. INV-097 — Domain Logic Must Not Depend Directly on AI Providers

**Type:** CONTROL ARCHITECTURAL

Business rules MUST remain valid even if:

```text id="1n3vie"
OpenAI
Anthropic
Gemini
other provider
```

changes or disappears.

AI integrations sit outside domain truth.

---

# 102. INV-098 — Business Must Remain Operable Without AI

**Type:** CONTROL ARCHITECTURAL

Loss of JARVIS/model provider may reduce:

```text id="sduqyx"
analysis
recommendations
automation
```

but MUST NOT invalidate:

```text id="d524hz"
orders
invoices
payments
inventory
production records
vendor records
```

---

# 103. Invariant Interaction Example — Custom Order

```text id="wvvc70"
Requirement READY
    ↓
Quote calculated with integer money
    ↓
Margin guard evaluated
    ↓
Override required if below floor
    ↓
Quote SENT
    ↓
Requirement snapshot LOCKED
    ↓
Quote ACCEPTED
    ↓
Order created idempotently
    ↓
Commercial snapshot copied
    ↓
Order snapshot immutable
```

Each step exists because several invariants work together.

---

# 104. Invariant Interaction Example — Payment

```text id="769nnw"
Payment amount > 0
        ↓
Authorized finance command
        ↓
Invoice locked
        ↓
allocation <= payment available
        ↓
allocation <= invoice balance
        ↓
payment recorded
        ↓
invoice amounts reconciled
        ↓
audit written
        ↓
ledger effect recorded
```

---

# 105. Invariant Interaction Example — Retail Sale

```text id="hpc50p"
Retail items selected
      ↓
Inventory verified
      ↓
Integer totals calculated
      ↓
Order created
      ↓
Inventory reserved atomically
      ↓
Invoice created
      ↓
Optional payment settlement
      ↓
ledger effects
```

Anti-overselling is part of transaction integrity, not a dashboard warning.

---

# 106. Invariant Interaction Example — Procurement

```text id="34cf8d"
Active Vendor
      ↓
Purchase Order
      ↓
Physical Goods Receipt
      ↓
accepted quantity <= ordered
      ↓
Inventory increased
      ↓
mutation recorded
      ↓
Vendor Bill
      ↓
payment <= balance
```

---

# 107. Invariant Violation Severity

## CRITICAL

Examples:

```text id="qmy53u"
negative invoice balance
payment duplicated
cross-organization mutation
oversold stock
commercial snapshot rewritten
payment amount silently edited
```

## HIGH

Examples:

```text id="3ysteq"
missing authorization
pricing override without approval
audit missing from sensitive mutation
goods receipt exceeding PO
```

## MEDIUM

Examples:

```text id="ikf9ni"
derived metric stale
missing optional provenance
non-critical cached summary mismatch
```

Severity does not change whether the rule is valid.

It changes response urgency.

---

# 108. Invariant Failure Behavior

If hard invariant fails:

```text id="8euj6t"
REJECT TRANSACTION
```

Preferred behavior:

```text id="6tyyr9"
no partial mutation
clear error
preserve existing truth
record appropriate evidence
```

The system SHOULD NOT silently repair invalid input unless the repair itself is a defined business rule.

---

# 109. Invariant Testing Contract

Transaction-changing work MUST test relevant categories:

```text id="6l0ywq"
authorization
organization isolation
invalid lifecycle state
money boundaries
duplicate requests
failure atomicity
concurrency
historical immutability
```

Additional domain tests:

```text id="d0hmt8"
payment
→ allocation ceilings

inventory
→ oversell prevention

procurement
→ receive ceiling

quote
→ margin approval

shipment
→ quantity ceiling
```

---

# 110. Negative Tests Are Mandatory for Critical Invariants

A test that only proves:

```text id="7fiqid"
valid transaction succeeds
```

is insufficient for financial/inventory integrity.

Tests SHOULD also prove invalid transactions fail.

Examples:

```text id="plqq1a"
pay more than invoice balance
reserve more than available stock
accept stale quote version
mutate sent quote
receive more than PO quantity
reuse idempotency key incorrectly
```

---

# 111. Concurrency Tests

Concurrency-sensitive domains SHOULD verify competing execution.

Examples:

```text id="d5qfz4"
two customers reserve final stock
two retries create same order
two payments allocate final invoice balance
two receipts consume remaining PO quantity
```

Correct architecture must remain valid under contention.

---

# 112. Current Enforcement Strength

Strong current enforcement exists around:

```text id="jd0o51"
integer money
quote pricing guard
requirement immutability
quote snapshot immutability
order snapshot immutability
payment allocation ceilings
payment reversal
invoice balance
inventory reservation
anti-overselling
stock opname
purchase receipt ceiling
vendor bill payment ceiling
organization-scoped command checks
```

---

# 113. Known Invariant Enforcement Gaps

Current gaps identified from audited implementation include:

```text id="8avmsd"
1. Idempotency semantics are not yet equally strict across every mutation command.

2. Transactional outbox is architectural target but not yet a verified implemented event backbone.

3. Order lifecycle transition enforcement remains incomplete.

4. Several exception lifecycles still have schema states without dedicated commands.

5. A unified capability-based permission architecture is not yet the final runtime model.

6. Generic cross-domain provenance/correlation is not yet standardized.
```

These are engineering backlog items, not exceptions to the invariants.

---

# 114. Invariant Change Rule

Changing a HARD invariant requires deliberate architecture review.

Examples:

```text id="3ml9ih"
allow invoice overpayment
allow negative inventory
make shipping part of revenue
make sent quote mutable
change pricing floor
collapse estimated/actual cost
```

These MUST NOT happen as incidental implementation changes.

Depending on impact, change requires:

```text id="q2w46o"
canonical spec update
+
ADR
+
migration
+
test migration
+
operational consideration
```

---

# 115. Business Invariant Registry

Core registry:

```text id="edg040"
TRUTH
01 authoritative PostgreSQL state

AUTHORITY
02 command mutation boundary
03 organization isolation
04 permission != membership

IDENTITY
05 valid active references
06 stable UUID identity
07 unique document numbering

MONEY
08 integer Rupiah
09 valid signed semantics
10 monetary reconciliation
11 valid discounts

MARGIN
12 shipping pass-through
13 margin excludes shipping
14 Cost Trilogy
15 pricing thresholds
16 owner override
17 approval preserves reality

SNAPSHOTS
18 requirement lock
19 quote immutability
20 revision continuity
21 current-version action
22 valid quote acceptance
23 B2B lineage
24 explicit retail exception
25 one quote → one order
26 order immutability
27 order-line history
28 master != transaction snapshot
29 snapshot/master separation

CUSTOMER FINANCE
30 positive payment
31 confirmed core immutability
32 reversed terminal
33 no hard deletion
34 allocation <= payment
35 allocation <= invoice
36 positive allocation
37 eligible invoice
38 status reconciles amounts
39 reversal restores invoice
40 paid invoice not voidable

SUPPLIER FINANCE
41 vendor payment ceiling
42 vendor bill reconciliation

ANALYTICS
43 economic ledger semantics
44 append-oriented ledger
45 cash != revenue

INVENTORY
46 on-hand >= 0
47 reserved >= 0
48 reserved <= on-hand
49 anti-overselling
50 concurrency safety
51 positive reservation
52 consume adjusts both
53 release preserves physical
54 mutation history
55 opname >= reserved
56 adjustment reason

PROCUREMENT
57 positive purchase quantity
58 active vendor
59 received <= ordered
60 receipt creates stock
61 rejected != accepted
62 closed PO cannot receive
63 receipt != liability

PRODUCTION/QC
64 execution != contract
65 Cost Trilogy preserved
66 QC context
67 rework context

FULFILLMENT
68 shipped <= ordered
69 same-order shipment lines
70 tracking evidence
71 delivered not cancelled
72 shipping economics separate

RESILIENCE
73 retry-safe commands
74 same key no duplicate
75 payload conflict semantics
76 concurrency protection
77 failure atomicity
78 retail atomicity
79 uncertainty != success

AUDIT
80 append-oriented audit
81 actor identity
82 exceptional reason
83 projection traceability
84 cache != truth

AI/AUTOMATION
85 AI advisory
86 deterministic enforcement
87 n8n not integrity owner
88 event idempotency
89 atomic outbox target
90 event != current truth

PHYSICAL REALITY
91 trusted physical observation
92 correction not erasure
93 state/history reconciliation

DATA MODEL
94 JSON not integrity dumping ground
95 promote durable concepts

ARCHITECTURE
96 UI-independent rules
97 provider-independent domain
98 business survives AI failure
```

---

# 116. Canonical Relationship to Other MGBOS Specs

```text id="f7d721"
Canonical Data Model
→ what exists

Business State Machines
→ how lifecycle changes

Business Invariants
→ what must always remain true

Command & Event Model
→ how valid changes enter and leave the system

Permission Model
→ who may request those changes
```

These documents complement each other.

They MUST NOT redefine each other's ownership.

---

# 117. Canonicalization Effect

Before this document, critical rules were distributed across:

```text id="rf2fbz"
MGBOS architecture
AGENTS.md
database migrations
tests
session notes
engineering reports
```

After activation:

```text id="j0xfd1"
MGBOS Business Invariants v1.0
=
canonical semantic owner
```

Implementation files continue enforcing the rules.

They no longer need to serve as the only place humans or AI discover what the rules mean.

---

# 118. North Star

A trustworthy transaction system should make impossible states difficult or impossible to create.

The goal is not merely:

```text id="52syot"
"UI usually sends valid data."
```

The goal is:

```text id="fl64qx"
even if UI is buggy,
automation retries,
AI hallucinates,
two requests race,
or external input is malformed,

MGBOS still protects business truth.
```

---

# 119. Final Principle

> **A business invariant is not advice to the application. It is a property the system is responsible for preserving.**

MGBOS becomes trustworthy when correctness does not depend on every human, UI, workflow, or AI remembering to behave perfectly.