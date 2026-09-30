---
canonical_id: teestock.implementation.phase1-operating-spine
status: ACTIVE
version: 1.0
owner: Rizky
scope: teestock-mgbos
document_class: implementation-plan
effective_from: 2026-09-30
phase: 1
primary_goal: prove one TeeStock transaction end-to-end
primary_system: MGBOS
autonomy: HUMAN_CONTROLLED
implementation_priority: P0
depends_on:
  - bisnishub.operating-model.solo-founder-os
  - bisnishub.roadmap.solo-founder-launch
  - mgbos.architecture.domain-map-capability-ownership
  - mgbos.architecture.canonical-data-model
  - mgbos.architecture.business-state-machines
  - mgbos.architecture.business-invariants
  - mgbos.architecture.command-event-model
  - mgbos.architecture.permission-authorization-model
implementation_status: READY_TO_EXECUTE
---

# Phase 1 Implementation Plan — TeeStock End-to-End Operating Spine v1.0

## 1. Mission

Phase 1 hanya punya satu misi:

> **Buktikan bahwa satu transaksi TeeStock dapat berjalan dari inquiry sampai realized margin melalui MGBOS tanpa state penting bergantung pada ingatan Rizky, WhatsApp history, atau manual database repair.**

Canonical spine:

```text
CUSTOMER
   ↓
LEAD
   ↓
REQUIREMENT
   ↓
QUOTE
   ↓
ORDER
   ├──────────────► INVOICE
   │                   ↓
   │                PAYMENT
   │
   ▼
PRODUCTION JOB
   ↓
VENDOR ASSIGNMENT
   ↓
QC
   ↓
SHIPMENT
   ↓
ACTUAL COST
   ↓
REALIZED MARGIN
```

---

# 2. Phase 1 Is Not About Feature Breadth

Phase 1 MUST NOT expand into:

```text
Opportunity
Project
Product Catalog
Creator
Royalty
Affiliate
Advanced Marketing
JARVIS Agents
Autonomous messaging
```

unless one of them becomes a genuine blocker to the operating spine.

---

# 3. Success Condition

Phase 1 succeeds when we can run:

```text
Synthetic Order TS-SIM-001
```

from beginning to end using only normal application/system pathways.

No:

```text
manual SQL
hidden spreadsheet
manual status correction
invented financial totals
state stored only in notes
```

---

# 4. Primary Entities

Phase 1 will deliberately reuse current MGBOS entities.

## Identity / Organization

```text
Organization
Brand
Business Line
Channel
User
Membership
```

## Customer

```text
Customer Account
Customer Contact
Customer Address
Customer Relationship
```

## Commercial

```text
Lead
Requirement
Requirement Version
Quote
Quote Version
Quote Item
Quote Cost
Quote Approval
```

## Transaction

```text
Order
Order Item
Invoice
Invoice Item
Payment
Payment Allocation
```

## Operations

```text
Production Job
Production Item
Production Assignment
Vendor
Vendor Rate / Cost Reference
QC Record
Shipment
```

## Finance / Cost

```text
Estimated Cost
Committed Cost
Actual Cost
Order Financial Summary
```

No new root entity should be introduced until this flow proves insufficient.

---

# 5. Synthetic Business Fixture

Use one realistic TeeStock case consistently.

Example:

```text
Customer:
PT Arunika Event

Contact:
Budi Santoso

Need:
100 black T-shirts

Use:
company gathering

Decoration:
front + back print

Target delivery:
20 November 2026
```

Initial incomplete fields:

```text
fabric / garment specification
size breakdown
artwork
print dimensions
shipping destination
```

This intentionally tests real-world incompleteness.

---

# 6. Step 1 — Customer Capture

Goal:

Create one durable customer identity.

Required:

```text
Customer Account
Customer Contact
Address if known
Channel/source
```

System must prevent needless duplicate customer creation.

---

# 7. Customer UI v0.1

Minimum:

```text
Customer Name
Contact Name
Phone
Email
Source
Notes
```

UI quality requirement:

> Operator should be able to create/find customer in seconds.

No CRM mega-screen.

---

# 8. Step 2 — Lead Capture

Create Lead from inbound demand.

Minimum:

```text
Lead ID
Organization
Customer / Contact
Source
Summary
Budget if known
Requested deadline
Status
Created at
```

---

# 9. Lead State

Use MGBOS canonical lifecycle only.

UI may display human-friendly labels.

Do not create TeeStock-specific competing state enum.

---

# 10. Lead Qualification

Initial qualification can remain human/rule assisted.

Questions:

```text
Is contact valid?

Is requirement plausible?

Is budget context available?

Is requested work in TeeStock capability?

Is deadline feasible enough to continue?
```

---

# 11. Qualification Does Not Need AI Yet

Phase 1 objective:

```text
correct state
```

not sophisticated lead scoring.

Existing deterministic rules can later be plugged in.

---

# 12. Step 3 — Requirement

Once inquiry deserves commercial work:

```text
Lead
↓
Requirement
```

Requirement becomes the structured description of customer need.

---

# 13. Requirement Minimum Fields

```text
Customer
Quantity
Product/service description
Deadline
Artwork status
Destination
Notes
Structured specification
```

---

# 14. Missing Information

System must explicitly distinguish:

```text
KNOWN
UNKNOWN
NOT_APPLICABLE
```

Never use guessed values merely to satisfy form completeness.

---

# 15. Requirement Versioning

Customer revision:

```text
Requirement v1
↓
Requirement v2
```

must preserve v1.

This is essential for:

```text
commercial history
quote history
scope disputes
```

---

# 16. Step 4 — Quote Preparation

Create Quote from one specific Requirement Version.

Quote must bind:

```text
customer
requirement snapshot/version
line items
estimated costs
selling price
commercial terms
validity
```

---

# 17. Cost Trilogy Starts Here

For every meaningful cost component distinguish:

```text
ESTIMATED
COMMITTED
ACTUAL
```

Quote uses primarily:

```text
ESTIMATED
```

---

# 18. Quote Cost Example

For 100 shirts:

```text
Blank garment
Printing
Packaging
Production handling
Shipping
Other
```

Do not reduce costing to one unexplained HPP number.

---

# 19. Shipping Rule

Shipping remains separately visible.

Do not accidentally inflate product margin using pass-through shipping revenue.

---

# 20. Quote Margin

Before quote can be sent:

```text
selling price
-
estimated economic cost
=
projected contribution
```

must be visible.

Existing MGBOS margin guardrails apply.

---

# 21. Quote Approval

If price/margin requires approval:

```text
PREPARE
↓
APPROVE
↓
SEND
```

No UI shortcut should bypass server rules.

---

# 22. Quote Revision Scenario

When requirement or price changes:

```text
Quote v1
→ superseded

Quote v2
→ current
```

Historical quote must remain reconstructable.

---

# 23. Step 5 — Quote Acceptance

Customer acceptance needs explicit business evidence.

Initial evidence can be:

```text
manual confirmation record
reference to message/email
accepted_at
accepted_by
```

No need for advanced e-signature in Phase 1.

---

# 24. Quote Acceptance Creates Commercial Commitment

Then create:

```text
Order
```

from accepted quote snapshot.

---

# 25. Step 6 — Order Creation

Order must preserve contracted commercial terms.

Required:

```text
Order ID
Customer
Order items
Quantity
Agreed price
Requirement snapshot/reference
Delivery commitment
Commercial references
```

---

# 26. Historical Contract Rule

Changing:

```text
Product
Quote
Requirement
```

later must never rewrite historical Order meaning.

---

# 27. Order Status Independence

Order must NOT become a catch-all status like:

```text
PAID_AND_PRINTING_AND_SHIPPED
```

Separate:

```text
Order
Payment
Production
QC
Shipment
```

states remain independent.

---

# 28. Step 7 — Invoice

Generate Invoice based on commercial terms.

Example:

```text
50% deposit
50% before shipment
```

or another explicit arrangement.

Phase 1 must support at minimum:

```text
invoice
partial payment
remaining balance
```

---

# 29. Invoice UI

Must show:

```text
invoice amount
paid
outstanding
due date
status
```

without manual calculation.

---

# 30. Step 8 — Payment

Payment record:

```text
amount
date
method
external/reference evidence
verification state
```

Payment itself is append-like financial evidence.

Do not rewrite a confirmed payment to hide mistakes.

---

# 31. Payment Allocation

One Payment may allocate against Invoice.

Phase 1 must verify:

```text
invoice total
=
allocated payments
+
outstanding amount
```

where applicable.

---

# 32. Partial Payment Scenario

Test:

```text
Invoice: Rp10.000.000
Payment: Rp5.000.000
```

Expected:

```text
Invoice = PARTIALLY_PAID
Outstanding = Rp5.000.000
```

No fake completion.

---

# 33. Step 9 — Production Job

Once Order reaches valid production condition:

```text
Order
↓
Production Job
```

Production Job represents physical work to perform.

---

# 34. Production Job Fields

Minimum:

```text
Production Job ID
Order
Items
Quantity
Requirement reference
Target completion
Current state
Priority
Notes
```

---

# 35. Production Assignment

Assign work to Vendor.

Required:

```text
Vendor
Production Job
Assigned scope
Expected cost
Deadline
Assignment status
```

---

# 36. Vendor Acknowledgement

Phase 1 may store acknowledgement manually.

We need to know:

```text
Has vendor actually accepted this work?
```

This must not remain hidden in WhatsApp.

---

# 37. Work Order Artifact

Generate a simple Work Order document/view from:

```text
Production Job
+
Assignment
+
Requirement snapshot
+
Vendor
```

It is not yet a new aggregate.

---

# 38. Work Order Minimum

```text
WO Reference
Vendor
Order
Customer reference
Specification
Quantity
Files/artwork
Deadline
Expected cost/rate
Delivery destination/instruction
```

---

# 39. Step 10 — Production Progress

Phase 1 only needs enough progress to answer:

```text
not started?
in production?
ready for QC?
blocked?
```

Avoid detailed factory scheduling.

---

# 40. Vendor Delay Scenario

Synthetic:

```text
Vendor accepted
Production started
Deadline approaching
No completion
```

At Phase 1, we may manually identify this.

Phase 2 turns it into automatic Exception detection.

---

# 41. Step 11 — Quality Control

QC is explicit.

Minimum:

```text
QC ID
Production Job
Inspection time
Inspector
Result
Notes
Evidence reference
```

---

# 42. QC Outcomes

Use current canonical state semantics.

Business-level meaning:

```text
PASS
FAIL / REWORK REQUIRED
```

where existing model supports equivalent semantics.

---

# 43. QC Failure Scenario

```text
Production complete
↓
QC failed
↓
rework
↓
QC again
```

must preserve original failure evidence.

---

# 44. Step 12 — Shipment

Shipment links physical fulfillment to Order.

Minimum:

```text
Shipment ID
Order
Carrier
Tracking/reference
Ship date
Delivery destination
Status
```

---

# 45. Carrier Truth vs MGBOS Truth

Carrier provides external tracking observations.

MGBOS stores internal shipment state.

Do not conflate them.

---

# 46. Step 13 — Actual Cost

After production:

```text
actual vendor cost
actual packaging
actual shipping
actual additional cost
```

must be recorded.

---

# 47. Actual Cost Cannot Be Replaced by Estimate

The point is to learn:

```text
What did this order actually cost?
```

---

# 48. Step 14 — Margin Reconciliation

Then compare:

```text
Quote Estimate
vs
Committed Cost
vs
Actual Cost
```

---

# 49. Required Financial Output

For completed order:

```text
Revenue
Shipping pass-through
Estimated cost
Committed cost
Actual cost
Projected margin
Realized margin
Variance
```

---

# 50. Why This Matters

Without cost reconciliation:

```text
business may look busy
without actually making money.
```

---

# 51. Primary UI Surfaces for Phase 1

Do not build full Command Center yet.

Minimum interfaces:

```text
Customers
Leads
Requirements
Quotes
Orders
Invoices / Payments
Production
Vendors
QC
Shipments
Order Financial Detail
```

---

# 52. UI Philosophy

Each screen should answer:

```text
Where is this item?

What happened?

What comes next?
```

---

# 53. Entity Detail Pattern

Every core transactional detail should show:

```text
Identity
Status
Related entities
Important dates
Money where relevant
History / audit
Available next actions
```

---

# 54. Avoid Dashboard-First Development

During Phase 1:

```text
workflow correctness
>
dashboard aesthetics
```

---

# 55. Command Boundary

Mutations must flow through current authorized MGBOS mutation paths.

Do not introduce:

```text
frontend direct table manipulation
AI SQL
n8n raw database updates
```

---

# 56. Minimal API / Command Surface

Conceptual operations needed:

```text
customer.create/update

lead.create
lead.transition

requirement.create
requirement.revise

quote.create
quote.revise
quote.approve
quote.send
quote.accept

order.create_from_quote
order.transition

invoice.create
payment.record
payment.allocate

production_job.create
production_job.assign
production_job.transition

qc.record

shipment.create
shipment.transition

cost.record_actual
```

Use existing functions/contracts where already present rather than duplicating them.

---

# 57. Query Surface

At minimum read:

```text
customer detail
lead detail
requirement current/history
quote current/history
order detail
invoice/payment status
production status
vendor assignment
QC status
shipment status
order financial summary
```

---

# 58. No Generic CRUD Requirement

A screen does NOT automatically need:

```text
Create
Read
Update
Delete
```

for everything.

Business operations should expose semantic actions.

---

# 59. Delete Policy

Financial/transactional history should generally use:

```text
cancel
void
reverse
supersede
```

rather than destructive deletion.

---

# 60. Audit Requirement

Important transitions record:

```text
actor
timestamp
from state
to state
reason/context
entity
```

---

# 61. Test Architecture

Phase 1 has four test layers:

```text
DOMAIN TEST
COMMAND TEST
INTEGRATION TEST
END-TO-END BUSINESS TEST
```

---

# 62. Domain Tests

Protect:

```text
money arithmetic
state transitions
invariants
snapshot behavior
```

---

# 63. Command Tests

Verify:

```text
permissions
guards
idempotency where present
transactionality
```

---

# 64. Integration Tests

Test relationships across:

```text
Quote → Order
Invoice → Payment
Order → Production
Production → QC
Order → Shipment
Cost → Financial Summary
```

---

# 65. End-to-End Test

The canonical scenario:

```text
TS-SIM-001
```

must go through normal public/application pathways.

---

# 66. Synthetic Scenario Matrix

| ID      | Scenario                         | Expected outcome          |
| ------- | -------------------------------- | ------------------------- |
| SIM-001 | Happy path                       | Completed, reconciled     |
| SIM-002 | Requirement revision             | History preserved         |
| SIM-003 | Low-margin quote                 | Approval required         |
| SIM-004 | Partial payment                  | Correct outstanding       |
| SIM-005 | Vendor delay                     | State remains valid       |
| SIM-006 | QC fail/rework                   | Failure evidence retained |
| SIM-007 | Shipment delay                   | Shipment incomplete       |
| SIM-008 | Actual cost higher than estimate | Margin variance visible   |
| SIM-009 | Invalid transition               | Rejected                  |
| SIM-010 | Duplicate material command       | Safe/conflict behavior    |

---

# 67. Scenario SIM-001 — Happy Path

Expected:

```text
Lead
→ successfully converted through commercial flow

Quote
→ accepted

Order
→ valid

Invoice
→ fully paid eventually

Production
→ completed

QC
→ passed

Shipment
→ delivered

Margin
→ realized
```

---

# 68. SIM-002 — Requirement Revision

Expected:

```text
v1 retained
v2 current
old Quote remains bound to v1
new Quote references v2
```

---

# 69. SIM-003 — Margin Guard

Use quote beneath normal threshold.

Expected:

```text
cannot silently send/accept
without appropriate approval
```

---

# 70. SIM-004 — Partial Payment

Expected:

```text
payment allocation exact
invoice remains outstanding
```

---

# 71. SIM-005 — Vendor Delay

Phase 1 goal:

```text
no invalid status mutation required
```

Production remains accurate even while operationally problematic.

This informs Phase 2 Exception design.

---

# 72. SIM-006 — QC Failure

Expected:

```text
QC failure exists historically
rework path valid
later QC pass does not erase failure
```

---

# 73. SIM-007 — Shipment Delay

Order history remains valid.

Shipment stays pending/in transit according to canonical lifecycle.

---

# 74. SIM-008 — Cost Variance

Example:

```text
Estimated production:
Rp4.000.000

Actual:
Rp4.800.000
```

System must expose:

```text
variance
realized margin impact
```

---

# 75. SIM-009 — Invalid Transition

Try an impossible transition.

System must:

```text
reject
preserve current state
return clear reason
```

---

# 76. SIM-010 — Duplicate Mutation

Where idempotency exists, replay same operation.

Expected:

```text
no duplicate economic effect
```

---

# 77. Phase 1 Build Order

Recommended sequence:

```text
W1
Current implementation audit

W2
Lead → Requirement → Quote

W3
Quote → Order → Invoice → Payment

W4
Order → Production → Vendor

W5
Production → QC → Shipment

W6
Cost → Margin Reconciliation

W7
Synthetic Scenario Pack

W8
Friction / Gap Fixes
```

These are work packages, not necessarily calendar weeks.

---

# 78. Work Package 1 — Current Implementation Audit

Before writing code:

```text
map current DB entities
map existing commands
map existing screens/routes
map current tests
map missing transitions
```

Output:

```text
KEEP
FIX
ADD
REMOVE
DEFER
```

---

# 79. Critical Rule

Do not rebuild functionality that already works.

---

# 80. Work Package 2 — Commercial Spine

Prove:

```text
Lead
→ Requirement
→ Quote
```

including revision and margin guard.

---

# 81. Work Package 3 — Transaction Spine

Prove:

```text
Quote acceptance
→ Order
→ Invoice
→ Payment
```

---

# 82. Work Package 4 — Operations Spine

Prove:

```text
Order
→ Production
→ Assignment
→ Work Order
```

---

# 83. Work Package 5 — Completion Spine

Prove:

```text
Production
→ QC
→ Shipment
```

---

# 84. Work Package 6 — Economics

Prove:

```text
Estimated
→ Committed
→ Actual
→ Realized Margin
```

---

# 85. Work Package 7 — Business Simulation

Run all synthetic scenarios.

Do not merely run isolated unit tests.

---

# 86. Work Package 8 — Founder Friction Review

After running scenario manually through UI ask:

```text
Where did Rizky have to remember something?

Where did Rizky have to re-enter data?

Where was state unclear?

Where were too many clicks?

Where did data have to be calculated manually?

Where was the next action ambiguous?
```

---

# 87. Founder Friction Register

For each issue:

```text
FRICTION
FREQUENCY
IMPACT
SYSTEM FIX
PRIORITY
```

This becomes Phase 2 input.

---

# 88. Definition of Done — Commercial

```text
Customer identity works

Lead works

Requirement versions work

Quote versions work

Margin calculation works

Quote approval works

Accepted quote produces stable commitment
```

---

# 89. Definition of Done — Finance

```text
Invoice works

Partial payment works

Payment allocation works

Outstanding amount works

Confirmed payments remain historical

Actual revenue/cash status visible
```

---

# 90. Definition of Done — Operations

```text
Production Job works

Vendor assignment works

Work Order can be generated

QC works

Shipment works

physical status is inspectable
```

---

# 91. Definition of Done — Economics

```text
Estimated costs visible

Committed costs visible

Actual costs visible

Projected margin visible

Realized margin visible

Variance visible
```

---

# 92. Definition of Done — Integrity

```text
Invalid transitions fail

Cross-org access fails

Financial history cannot be silently rewritten

Historical snapshots survive revision

No duplicate economic effect from known duplicate command scenarios
```

---

# 93. Definition of Done — UX

Normal operator should not require:

```text
SQL
developer console
database dashboard
manual arithmetic
```

to process the synthetic order.

---

# 94. Phase 1 Exit Gate

Phase 1 ends only when:

```text
TS-SIM-001
```

can be demonstrated start-to-finish.

And when:

```text
SIM-002 through SIM-010
```

either pass or have explicitly accepted/blocking findings.

---

# 95. Blocker Classification

Use:

```text
BLOCKER
HIGH
MEDIUM
LOW
```

---

# 96. BLOCKER

Anything that risks:

```text
money corruption
state corruption
cross-org leakage
lost contractual history
inability to finish core order
```

must be fixed before Phase 2.

---

# 97. HIGH

Creates likely:

```text
founder operational failure
customer failure
production confusion
```

Resolve before launch.

---

# 98. MEDIUM

Friction but workflow still reliable.

Can enter Phase 2 backlog.

---

# 99. LOW

Cosmetic/nonessential.

Defer.

---

# 100. What We Learn From Phase 1

Phase 1 should answer real architecture questions such as:

```text
Do we truly need Opportunity?

Do we truly need Project?

Is Production Assignment enough for Work Order?

Where do exceptions emerge?

Which read models do we actually need?

What repetitive work exists?

Where does AI actually help?
```

---

# 101. Phase 2 Inputs Generated by Phase 1

Expected:

```text
Exception taxonomy
Founder attention queries
Vendor capability gaps
Work Order gaps
Customer Case needs
automation candidates
```

These should be derived from simulation evidence.

---

# 102. Phase 1 Metrics

Track:

```text
manual touches / simulated order

number of duplicated data entries

number of hidden calculations

number of invalid states discovered

number of steps requiring technical access

end-to-end completion time

number of founder-memory dependencies
```

---

# 103. Primary Metric

Most important:

> **How many facts/actions did Rizky have to remember outside the system to finish one order?**

Target:

```text
approaching zero
```

for core transactional state.

---

# 104. Secondary Metric

> **Could another competent operator follow the same flow without asking Rizky what happens next?**

If no:

```text
workflow still contains tribal knowledge.
```

---

# 105. Documentation Produced During Phase 1

Only create/update documentation that implementation needs:

```text
command contract changes

state-machine clarifications

runbook for synthetic test

implementation evidence

ADR for material architectural choice
```

---

# 106. No Architecture Marathon

Do not create another major architecture document unless Phase 1 exposes a genuine unresolved semantic gap.

---

# 107. Final Phase 1 Mental Model

```text
INQUIRY
   ↓
MGBOS KNOWS CUSTOMER
   ↓
MGBOS KNOWS REQUIREMENT
   ↓
MGBOS KNOWS COMMERCIAL OFFER
   ↓
MGBOS KNOWS COMMITMENT
   ↓
MGBOS KNOWS MONEY
   ↓
MGBOS KNOWS PHYSICAL WORK
   ↓
MGBOS KNOWS QUALITY
   ↓
MGBOS KNOWS FULFILLMENT
   ↓
MGBOS KNOWS ECONOMIC OUTCOME
```

When that works:

```text
JARVIS finally has
something trustworthy
to reason about.
```

---

# 108. Immediate Starting Task

The first implementation task is:

## **Phase 1A — Current MGBOS Operating-Spine Audit**

Audit the repository against this exact chain:

```text
Lead
→ Requirement
→ Quote
→ Order
→ Invoice
→ Payment
→ Production
→ Assignment
→ QC
→ Shipment
→ Cost / Margin
```

For each stage classify:

```text
ENTITY        EXISTS / MISSING

STATE MODEL   COMPLETE / PARTIAL / MISSING

COMMANDS      COMPLETE / PARTIAL / MISSING

UI            COMPLETE / PARTIAL / MISSING

TESTS         COMPLETE / PARTIAL / MISSING

FRICTION      NONE / LOW / HIGH

ACTION        KEEP / FIX / BUILD / DEFER
```

That audit becomes the implementation backlog.

---

# 109. Final Principle

> **Phase 1 is finished when one simulated customer order can move from interest to cash, production, delivery, and realized margin without the founder becoming the invisible database.**

From that proof, Phase 2 becomes obvious:

```text
BUSINESS SPINE WORKS
        ↓
NOW SURFACE
THE EXCEPTIONS
        ↓
FOUNDER CONTROL LAYER
```
