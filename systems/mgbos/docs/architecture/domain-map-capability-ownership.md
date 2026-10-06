---
canonical_id: mgbos.architecture.domain-map-capability-ownership
status: ACTIVE
version: 1.1
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: mgbos-cross-business
document_class: canonical-specification
effective_from: 2026-10-06
authoritative_for:
  - mgbos domain boundaries
  - mgbos capability ownership
  - current-versus-target domain classification
  - canonical-target-domain-classification
  - operational-exception-domain-ownership
  - founder-attention-projection-ownership
  - business-requirement promotion into mgbos
  - teestock-to-mgbos capability mapping
  - mgbos-versus-jarvis capability boundaries
  - mgbos-versus-automation boundaries
  - external-provider capability boundaries
  - domain expansion sequencing
  - mgbos capability prioritization under solo-founder operating constraints
last_reviewed: 2026-10-06
review_cadence: monthly-during-q4-2026
depends_on:
  - ../../../../docs/governance/documentation-constitution.md
  - ../../../../docs/governance/canonical-source-map.md
  - ../../../../docs/architecture/master-system-blueprint.md
  - ../../../../docs/architecture/system-boundaries.md
  - ../../../../docs/architecture/architectural-laws.md
  - ../../../../docs/operating-model/solo-founder-operating-system.md
  - README.md
  - canonical-data-model.md
  - business-state-machines.md
  - business-invariants.md
  - command-event-model.md
  - permission-authorization-model.md
  - ../../../../bisnis/teestock/07-operations/operating-model.md
  - ../../../../bisnis/teestock/11-data-mgbos/canonical-data-model.md
  - ../../../../bisnis/teestock/11-data-mgbos/entity-hierarchy.md
  - ../../../../bisnis/teestock/11-data-mgbos/mgbos-integration.md
  - ../../../../bisnis/teestock/14-roadmap/current-quarter.md
supersedes: null
implementation_status: PARTIALLY_IMPLEMENTED
---

# MGBOS Domain Map & Capability Ownership v1.1

## 1. Purpose

Dokumen ini menjawab:

> **Capability bisnis mana yang harus dimiliki MGBOS, mana yang tetap menjadi business knowledge, mana yang menjadi tanggung jawab JARVIS, mana yang cukup diotomatisasi, dan mana yang tetap dimiliki provider atau partner eksternal?**

Tujuannya adalah mencegah dua kegagalan:

```text
UNDERBUILD
→ founder tetap menjadi operating system

OVERBUILD
→ MGBOS berubah menjadi ERP monster
  sebelum bisnis membutuhkannya
```

---

# 2. Golden Principle

> **MGBOS grows from repeated operational truth—not from the maximum imaginable future business model.**

---

# 3. Business Requirements Do Not Automatically Become Entities

> **Business requirements may pull MGBOS forward. They do not automatically become MGBOS entities.**

Business documentation menjelaskan kebutuhan.

MGBOS menentukan representasi sistem paling kecil yang tetap benar.

---

# 4. Founder-Leverage Principle

> **Every new MGBOS capability must remove operational ambiguity, protect business integrity, or materially reduce founder burden.**

---

# 5. MGBOS Is Not Every Business Concept

MGBOS SHOULD own concepts requiring:

```text
persistent operational identity
transactional integrity
state transitions
financial consequences
cross-workflow coordination
auditability
shared operational truth
```

---

# 6. Concepts That May Stay Outside MGBOS

Examples:

```text
brand philosophy
creative direction
campaign narrative
market research
strategic thesis
content ideas
temporary experiments
```

unless future operations justify structured representation.

---

# 7. Capability Classification

Every domain or capability uses one of:

```text
CURRENT
PARTIAL
CANONICAL_TARGET
NEXT
DEFERRED
EXPERIMENTAL
OUTSIDE_MGBOS
```

---

# 8. CURRENT

The capability is materially represented and operationally implemented in current MGBOS.

`CURRENT` does not automatically mean every workflow around it is launch-complete.

---

# 9. PARTIAL

The capability materially exists, but intended workflow, lifecycle, integration, or operator usability remains incomplete.

---

# 10. CANONICAL_TARGET

The capability or domain is formally accepted into the canonical MGBOS target architecture as a first-class logical concept, but its physical implementation, schema, or runtime code is not yet active or implemented.

---

# 11. NEXT

Strong near-term operational justification exists and the capability belongs in the next implementation horizon.

---

# 12. DEFERRED

Potentially valuable, but current evidence does not justify implementation.

---

# 13. EXPERIMENTAL

A provisional implementation or prototype exists without mature production semantics.

---

# 14. OUTSIDE_MGBOS

Another system or domain is the proper semantic owner.

---

# 15. Primary Capability Owners

```text
BUSINESS LAYER
MGBOS
JARVIS
AUTOMATION
EXTERNAL PROVIDER
PRODUCTION / LOGISTICS PARTNER
CROSS-SYSTEM GOVERNANCE
```

---

# 16. Fundamental Ownership Model

```text
BUSINESS
defines what the business needs

MGBOS
holds governed operational truth

JARVIS
interprets and coordinates that truth

AUTOMATION
executes deterministic repetition

PROVIDERS
own provider-side facts

PARTNERS
perform physical work
```

---

# 17. Current Core Domain Map

| Domain                  | MGBOS Status                                                 | Primary Owner | Near-Term Importance  |
| ----------------------- | ------------------------------------------------------------ | ------------- | --------------------- |
| Organization / Identity | CURRENT                                                      | MGBOS         | Critical              |
| Customer                | CURRENT                                                      | MGBOS         | Critical              |
| Lead / CRM              | CURRENT / PARTIAL workflow integration                       | MGBOS         | Critical              |
| Requirement             | CURRENT                                                      | MGBOS         | Critical              |
| Quotation               | CURRENT                                                      | MGBOS         | Critical              |
| Order                   | CURRENT (Phase 1 verified lifecycle)                         | MGBOS         | Critical              |
| Production Job          | CURRENT                                                      | MGBOS         | Critical              |
| Production Assignment   | CURRENT (Phase 1 verified assignment & tracking)             | MGBOS         | Critical              |
| Vendor                  | CURRENT / PARTIAL assignment integration                     | MGBOS         | Critical              |
| Quality Control         | CURRENT (Phase 1 verified item-level gates)                  | MGBOS         | Critical              |
| Invoice                 | CURRENT                                                      | MGBOS         | Critical              |
| Payment                 | CURRENT                                                      | MGBOS         | Critical              |
| Fulfillment / Shipment  | CURRENT (Phase 1 verified readiness guard)                   | MGBOS         | Critical              |
| Cost / Margin           | CURRENT                                                      | MGBOS         | Critical              |
| Inventory               | CURRENT                                                      | MGBOS         | High                  |
| Procurement             | CURRENT                                                      | MGBOS         | High                  |
| Goods Receipt           | CURRENT                                                      | MGBOS         | High                  |
| Vendor Bills            | CURRENT                                                      | MGBOS         | High                  |
| Order Financial Summary | CURRENT                                                      | MGBOS         | High                  |
| Work Order / SPK        | CURRENT (Phase 1 verified operational artifact)              | MGBOS         | Critical              |
| Operational Exception   | CANONICAL_TARGET (Logical domain; physical undecided)        | MGBOS         | Critical (reconciled) |
| Founder Attention       | CANONICAL_TARGET (Derived projection; not system of record)  | MGBOS         | Critical (reconciled) |
| Founder Home            | CANONICAL_TARGET (Application surface; not domain aggregate) | MGBOS         | Critical (reconciled) |
| Design Library          | EXPERIMENTAL                                                 | MGBOS         | Low near-term         |

---

# 17. Current Core Covers Most of the First Operating Spine

Current MGBOS can already materially represent:

```text
LEAD
 ↓
REQUIREMENT
 ↓
QUOTE
 ↓
ORDER
 ├────────────► INVOICE / PAYMENT
 │
 ▼
PRODUCTION
 ↓
ASSIGNMENT
 ↓
QC
 ↓
SHIPMENT
 ↓
COST / MARGIN
```

Therefore near-term work should primarily:

```text
CONNECT
HARDEN
RECONCILE
SIMPLIFY
SURFACE
```

before adding many new root entities.

---

# 18. Organization & Identity

Status:

```text
CURRENT
```

MGBOS owns:

```text
organization
brand
business line
channel
user
membership
role relationships
```

---

# 19. Generic Person

Current MGBOS already has:

```text
customer_contacts
```

A generic:

```text
Person
```

is:

```text
DEFERRED
```

---

# 20. Person Promotion Trigger

Promote only when one individual repeatedly needs stable identity across roles such as:

```text
customer contact
creator
partner contact
employee
affiliate
```

and duplication becomes operationally harmful.

---

# 21. Customer

Status:

```text
CURRENT
```

Current model already represents:

```text
customer account
customer contact
address
customer-brand relationship
```

This is sufficient for initial custom/B2B operations.

---

# 22. Lead

Status:

```text
CURRENT / PARTIAL WORKFLOW INTEGRATION
```

Lead is the canonical inbound commercial inquiry.

Core entity/lifecycle capability exists.

Current operator-flow gap:

```text
QUALIFIED LEAD
    ↓
manual navigation/context reconstruction
    ↓
REQUIREMENT
```

Near-term objective:

```text
Lead
→ governed continuation
→ Requirement
```

without adding Opportunity.

---

# 23. Opportunity

Current MGBOS explicitly does not implement Opportunity.

Status:

```text
DEFERRED / EVIDENCE REQUIRED
```

---

# 24. Why Opportunity Is Deferred

Current pipeline can use:

```text
LEAD
 ↓
QUALIFIED
 ↓
REQUIREMENT
 ↓
QUOTE
```

with lower complexity.

---

# 25. Opportunity Promotion Trigger

Introduce Opportunity only when real operations demonstrate recurring need for:

```text
multiple commercial attempts under one pursuit
multiple solution paths
pipeline forecasting independent of Lead
long-running deal ownership
sales management beyond Lead lifecycle
```

---

# 26. Requirement

Status:

```text
CURRENT
```

Requirement is especially valuable for custom work where customer inputs are incomplete and frequently revised.

---

# 27. Requirement Removes Hidden State

Requirement should move specification truth out of:

```text
WhatsApp
founder memory
temporary notes
```

---

# 28. Structured Requirement Extensions

Prefer schema-versioned structured specifications for:

```text
garment
printing
embroidery
packaging
merchandise
```

before creating many specialized generic tables.

---

# 29. Quote

Status:

```text
CURRENT
```

Current capability includes:

```text
versioning
line items
estimated costs
pricing approval
requirement snapshots
```

---

# 30. Pricing Ownership

Business layer owns:

```text
pricing strategy
commercial policy
discount philosophy
```

MGBOS owns:

```text
quote representation
calculation
snapshot
approval enforcement
audit
```

---

# 31. Order

Status:

```text
CURRENT / PARTIAL LIFECYCLE
```

Order represents commercial commitment.

---

# 32. Order Lifecycle Gap

Current canonical state vocabulary exists, but authoritative transition enforcement remains incomplete.

Near-term implementation must make Order lifecycle trustworthy.

---

# 33. Order Must Not Become a Mega-State

Do not collapse:

```text
payment
production
QC
shipment
```

into Order status.

These remain independent lifecycles.

---

# 34. Project

Status:

```text
DEFERRED / CONDITIONAL NEXT
```

Current custom work may be sufficiently represented by:

```text
Requirement
+
Quote
+
Order
+
Production Jobs
```

---

# 35. Project Promotion Trigger

Create Project when one initiative routinely requires:

```text
multiple Orders
multiple Production Jobs
multiple delivery phases
non-billable coordination
independent milestones
persistent coordination beyond one Order
```

---

# 36. Production Job

Status:

```text
CURRENT
```

Production Job owns executable physical-work coordination.

---

# 37. Production Job Should Answer

```text
What needs to be produced?
For which Order?
Which items?
What state?
What deadline?
What blocks completion?
```

---

# 38. Production Assignment

Status:

```text
CURRENT / PARTIAL OPERATIONAL INTEGRATION
```

Current entity:

```text
production_assignments
```

exists materially.

---

# 39. Current Assignment Gaps

Current operating-flow gaps include:

```text
vendor identity not consistently used in normal assignment flow
assignment acknowledgement not fully coordinated
assignment ACCEPTED may diverge from job ACCEPTED
decline / reassignment flow needs hardening
```

Therefore this is not a missing domain.

It is a current domain needing integration.

---

# 40. Assignment Ownership

Production Assignment should own:

```text
who is expected to execute the job
commercial assignment context
partner acknowledgement
assignment lifecycle
```

Production Job continues to own physical work lifecycle.

---

# 41. Work Order

Status:

```text
CURRENT AS GOVERNED OPERATIONAL ARTIFACT
PHASE 1 OPERATING-SPINE VERIFIED
```

In Phase 1, Work Order / SPK generation and print slip were implemented and verified as a governed operational artifact generated from Production Job + Production Assignment context. It is not currently justified as an independent root entity.

---

# 42. Initial Work Order Model

Generate Work Order / SPK from:

```text
Production Job
+
Production Assignment
+
Vendor
+
Requirement / specification snapshot
+
deadline
+
committed cost
+
handoff instructions
```

---

# 43. Work Order Principle

> **No critical external production commitment should exist only in chat.**

---

# 44. Work Order Promotion Trigger

Create first-class Work Order entity only if it develops independent:

```text
revision lifecycle
acceptance lifecycle
partial completion
pricing
billing
multiple assignments
independent evidence history
```

that cannot cleanly belong to existing aggregates.

---

# 45. Vendor

Status:

```text
CURRENT / PARTIAL ASSIGNMENT INTEGRATION
```

Current MGBOS has:

```text
vendors
vendor_rate_cards
production assignment relationships
```

---

# 46. Generic Partner

Status:

```text
DEFERRED GENERALIZATION
```

For current physical production and supply work:

```text
Vendor
```

is sufficient.

---

# 47. Partner Generalization Trigger

Promote a broader Partner abstraction only when materially different relationships must share one common model:

```text
production vendor
fulfillment partner
creator partner
technology partner
channel partner
affiliate organization
```

---

# 48. Vendor Capability

Status:

```text
PARTIAL / NEXT
```

Current baseline already exists through:

```text
vendor categories
vendor rate cards
vendor relationships
```

---

# 49. Vendor Capability — NEXT Scope

Add structure only where operationally useful:

```text
capability taxonomy
capability-specific lead time
quality observations
reliability observations
capacity observations
```

---

# 50. Vendor Capacity

Status:

```text
PARTIAL / NEXT
```

Initial representation may remain manual observation.

Avoid sophisticated scheduling until real demand justifies it.

---

# 51. No Fake Precision

Do not invent metrics such as:

```text
Vendor utilization = 73.8%
```

without measurement that supports them.

---

# 52. Quality Control

Status:

```text
CURRENT
```

QC inspection records belong to MGBOS operational truth.

---

# 53. QC Evidence

Useful evidence may include:

```text
result
defect classification
notes
photo/file reference
rework context
rejection reason
```

when real workflow needs justify it.

---

# 54. Invoice

Status:

```text
CURRENT
```

Invoices represent customer receivables separately from Order state.

---

# 55. Payment

Status:

```text
CURRENT
```

Payment and Payment Allocation are current authoritative financial entities.

---

# 56. Cash Visibility

Status:

```text
PARTIAL
```

Transactional primitives exist.

Founder-level consolidated visibility still needs deliberate read models.

---

# 57. Finance Read Models

Status:

```text
NEXT
```

Examples:

```text
cash summary
AR aging
AP obligations
margin exceptions
estimated-vs-actual cost variance
```

These are projections/read models, not new transaction aggregates.

---

# 58. Treasury Policy

Business layer owns policy.

MGBOS supplies authoritative business facts and enforcement where appropriate.

JARVIS may analyze those facts.

---

# 59. Procurement

Status:

```text
CURRENT
```

Current entities include:

```text
purchase_orders
purchase_order_items
vendor_bills
vendor_bill_payments
```

---

# 60. Goods Receipt

Status:

```text
CURRENT
```

Current entities:

```text
goods_receipts
goods_receipt_items
```

Current receiving capability includes governed purchase-order receiving.

Goods Receipt represents physical-to-digital confirmation that purchased goods were actually received.

---

# 61. Goods Receipt Is Evidence, Not a Long Lifecycle

Goods Receipt does not require a rich mutable lifecycle.

Procurement lifecycle remains primarily on:

```text
Purchase Order
```

for states such as:

```text
ORDERED
PARTIALLY_RECEIVED
RECEIVED
```

---

# 62. Inventory

Status:

```text
CURRENT
```

Current MGBOS supports:

```text
inventory items
levels
mutations
reservations
```

---

# 63. Inventory Item Is Not Product

Canonical distinction:

```text
INVENTORY ITEM
≠
PRODUCT
```

MGBOS can track stock without a full generic Product catalog.

---

# 64. Product / Variant / SKU

Status:

```text
DEFERRED / LAUNCH-SCOPE DEPENDENT
```

For current custom-service operations, Requirement + Quote + Order snapshots may be sufficient.

---

# 65. When Product Becomes NEXT

If TeeStock launches stable retail commerce such as:

```text
Selects
Essentials
standardized stocked products
```

then:

```text
Product
Variant
SKU
```

may become NEXT.

---

# 66. Product Promotion Trigger

Implement when the business requires:

```text
reusable sellable identity
channel listings
SKU analytics
standard pricing
catalog navigation
inventory tied to stable SKU identity
```

---

# 67. Catalog

Status:

```text
DEFERRED
```

Catalog is not needed merely because the business sells something.

It becomes justified when persistent merchandising structure creates operational value.

---

# 68. Order History Remains Snapshot-Based

Even after Product exists:

```text
ORDER ITEM
```

remains historical commercial truth.

Changing Product must not rewrite historical Order meaning.

---

# 69. Garment Platform

Status:

```text
DEFERRED / PRODUCT-DOMAIN SUBMODEL
```

Promote only when repeatable apparel products create substantial duplicated specifications.

---

# 70. BOM / Recipe

Status:

```text
DEFERRED
```

---

# 71. BOM Promotion Trigger

Implement when:

```text
standard products repeatedly consume known materials/processes
reusable costing structure becomes valuable
inventory consumption needs structured derivation
production recipes stabilize
```

---

# 72. Do Not Build Manufacturing ERP Early

Custom jobs can continue using:

```text
requirement snapshots
quote cost components
production jobs
committed costs
actual costs
```

until repeated structure justifies BOM complexity.

---

# 73. Shipment / Fulfillment

Status:

```text
CURRENT
```

MGBOS owns internal shipment business state.

Carrier owns carrier-side tracking facts.

---

# 74. Fulfillment Readiness Guard

Shipment quantity controls exist.

The operating spine guard requiring:

```text
required production ready
+
required QC cleared
```

before fulfillment was implemented and verified in Phase 1.

---

# 75. Return / Refund

Status:

```text
DEFERRED UNTIL RETAIL COMMERCE NEED
```

Current financial reversal primitives are not a complete Returns domain.

---

# 76. Customer Case

Status:

```text
NEXT-LITE
```

Useful categories include:

```text
complaint
scope-change request
refund request
delivery problem
quality complaint
```

---

# 77. Customer Case Does Not Replace Domain State

Example:

```text
Customer Case = payment dispute
```

does not replace authoritative Payment state.

---

# 78. Operational Exception

Status:

```text
CANONICAL_TARGET
P1 FOUNDER-CONTROL CAPABILITY
```

Operational Exception is a first-class logical MGBOS architectural domain (`CANONICAL_TARGET`), formally reconciled in W2. It provides governed lifecycle, invariants, and commands for business abnormalities across the operating spine, while physical persistence (independent table vs. bounded extension) remains undecided pending Engineering Discovery. Phase 2 implementation is NOT OPEN.

---

# 79. Exception Purpose

Persistent explicit representation for abnormal conditions such as:

```text
production late
payment mismatch
vendor no-response
missing artwork
QC failure
shipment problem
automation failure
margin exception
```

---

# 80. Exception ≠ State Machine

Example:

```text
Production Job:
IN_PRODUCTION

Operational Exception:
PARTNER_LATE
```

Both can be true simultaneously.

---

# 81. Exception ≠ Technical Incident

A business operational exception and technical/system incident remain distinct concepts.

---

# 82. Exception Ownership

MGBOS owns persistent business exception facts.

JARVIS may:

```text
detect
prioritize
summarize
explain
recommend
```

---

# 83. Founder-by-Exception Principle

Once the spine is trustworthy:

```text
NORMAL WORK
→ stays quiet

ABNORMAL WORK
→ becomes explicit

MATERIAL EXCEPTION
→ reaches founder
```

---

# 84. Founder Attention Projection

Status:

```text
CANONICAL_TARGET DERIVED MGBOS PROJECTION
```

Founder Attention is a read projection computed across canonical business domains and operational exceptions.

Key architectural boundaries:

1. It is a read model, NOT an independent transactional system of record.
2. It projects actionable founder items categorized by Attention Kind (`DECISION`, `ACTION`, `WAITING`, `WATCH`, `DATA_GAP`).
3. It exposes query endpoints (such as `mgbos.founder_attention.list`) without owning independent mutation state.
4. Mutation of underlying facts occurs through domain commands or governed exception commands.

---

# 85. Founder Home Application Surface

Status:

```text
CANONICAL_TARGET MGBOS APPLICATION SURFACE
```

Founder Home is the single governed presentation and control surface for the solo founder in MGBOS.

Key architectural boundaries:

1. It is an application-layer interface, NOT a domain entity or aggregate.
2. It displays unified business posture, attention inbox, triage controls, and drill-down links.
3. It delegates all operational actions to governed MGBOS commands.
4. It does not store business state independently of the underlying domain and exception layers.

---

# 86. Artwork

Current Design Library capability is:

```text
EXPERIMENTAL
```

For custom production, simpler artwork/version linkage may become useful earlier than a full asset platform.

---

# 85. Artwork Near-Term Need

Potential near-term scope:

```text
file reference
version
approval status
production linkage
```

Status:

```text
PARTIAL / NEXT WHEN REAL JOBS REQUIRE
```

---

# 86. Do Not Overbuild DAM

Avoid building a full enterprise Digital Asset Management system until volume justifies it.

---

# 87. IP Rights

Status:

```text
DEFERRED
```

for core launch unless creator/copyrighted assets become central immediately.

---

# 88. IP Policy Still Applies

Even without full structured system:

> **No documented rights basis. No commercial use.**

---

# 89. Creator Domain

Future concepts include:

```text
Creator
Agreement
Royalty
Earning
Payout
```

Status:

```text
DEFERRED
```

---

# 90. Why Creator Is Deferred

Current priority remains:

```text
Lead-to-Cash
+
Order-to-Fulfillment
```

before creator-economy infrastructure.

---

# 91. Creator Pilot

A small controlled pilot may initially use:

```text
manual agreement
documented attribution
manual financial reconciliation with evidence
```

before generalized Creator Ledger architecture.

---

# 92. Creator Promotion Trigger

Implement when creator economics become:

```text
recurring
multi-creator
financially material
difficult or risky to reconcile manually
```

---

# 93. Programs

TeeStock Programs such as:

```text
Creator
Reseller
Affiliate
Partner
```

remain primarily Business Layer concepts.

---

# 94. Program Runtime

Status:

```text
DEFERRED
```

until a program proves repeated operational need.

---

# 95. Reseller

May initially use:

```text
customer relationships
pricing policy
channel metadata
```

without dedicated platform/domain.

---

# 96. Affiliate

Status:

```text
OUTSIDE_MGBOS / DEFERRED
```

External or lightweight attribution may be sufficient initially.

---

# 97. Marketing

Business Layer owns:

```text
audience
campaign strategy
content strategy
channel strategy
brand
```

---

# 98. Marketing Transactional Model

Status:

```text
DEFERRED
```

MGBOS should not become a generic marketing automation platform prematurely.

---

# 99. Campaign Domain

Promote only when reliable linkage across:

```text
spend
content
lead
order
revenue
contribution
experiment
```

becomes operationally necessary.

---

# 100. Content

Content planning/generation primarily belongs to:

```text
Business Layer
+
JARVIS / future content system
```

not MGBOS transactional core.

---

# 101. MGBOS Content Responsibility

MGBOS may store operational linkage only where needed:

```text
campaign reference
promotion code
source/channel attribution
commercial result linkage
```

---

# 102. Analytics

Analytics consumes business truth.

It does not own transactional truth.

---

# 103. KPI Ownership

Business Layer owns KPI definitions.

Examples:

```text
Quote Win Rate
On-Time Fulfillment
Repeat Contribution
Sell-Through
```

---

# 104. MGBOS Analytics Responsibility

MGBOS should provide trusted data and read models needed to calculate business KPIs.

---

# 105. Experiment Domain

Status:

```text
DEFERRED
```

as an MGBOS root domain.

Experiments may initially live in documentation plus lightweight attribution.

---

# 106. Experiment Promotion Trigger

Promote when:

```text
assignment
exposure
decision rules
results
version history
```

become difficult to govern manually.

---

# 107. Automation

Automation is not a business domain merely because n8n executes a workflow.

---

# 108. Automation Ownership

Automation owns:

```text
scheduling
routing
retry
notification
integration coordination
```

MGBOS owns authoritative business state affected by those workflows.

---

# 109. n8n

n8n is:

```text
scheduler
router
integration orchestrator
```

not:

```text
Lead owner
Order owner
Payment owner
Production owner
```

---

# 110. JARVIS

JARVIS owns cognitive capabilities such as:

```text
Morning Briefing
priority analysis
requirement extraction
vendor recommendation
risk analysis
summary
decision preparation
```

---

# 111. Cognitive Capability Usually Does Not Need New Business Entity

JARVIS can operate over:

```text
MGBOS read models
canonical business docs
bounded memory
external evidence
```

without creating new MGBOS aggregates.

---

# 112. Founder Control Layer

Target:

```text
MGBOS deterministic read model
+
JARVIS analysis
```

not AI reconstructing business truth from raw messages.

---

# 113. Example

```text
MGBOS:
Production Job PJ-104
status = IN_PRODUCTION
deadline = tomorrow

MGBOS Exception:
PARTNER_LATE

JARVIS:
"This is the highest operational risk today."
```

Three different semantics.

---

# 114. External Payment Provider

Provider owns:

```text
provider-side transaction fact
```

MGBOS owns:

```text
business payment record
payment allocation
invoice effect
```

---

# 115. Logistics Provider

Carrier owns:

```text
carrier tracking observations
```

MGBOS owns:

```text
Shipment business state
```

---

# 116. Marketplace

Marketplace may own:

```text
listing state
marketplace order state
```

MGBOS owns normalized internal business Order after accepted intake.

Status:

```text
DEFERRED INTEGRATION
```

---

# 117. Production Partner

Production partner owns real physical execution.

MGBOS stores governed observations required for business coordination.

---

# 118. Physical Reality Rule

```text
MGBOS record
≠
physical reality automatically
```

Physical completion requires trusted observation/evidence.

---

# 119. Domain Boundary Matrix

| Capability            | Business Layer     | MGBOS        | JARVIS           | Automation       | External          |
| --------------------- | ------------------ | ------------ | ---------------- | ---------------- | ----------------- |
| Business strategy     | Owner              | —            | Assist           | —                | —                 |
| Brand                 | Owner              | Context only | Assist           | —                | —                 |
| Customer identity     | Requirements       | **Owner**    | Read             | Sync             | External sources  |
| Lead                  | Policy             | **Owner**    | Analyze          | Capture/route    | Channels          |
| Requirement           | Definition         | **Owner**    | Extract/draft    | Route            | Customer          |
| Quote                 | Pricing policy     | **Owner**    | Analyze/draft    | Reminder         | Customer          |
| Order                 | Commercial policy  | **Owner**    | Analyze          | Trigger          | Channel           |
| Invoice               | Finance policy     | **Owner**    | Analyze          | Reminder         | Customer          |
| Payment               | Finance policy     | **Owner**    | Analyze          | Reconcile/notify | Payment provider  |
| Production            | Operating policy   | **Owner**    | Risk analysis    | Reminder         | Partner           |
| Assignment            | Vendor policy      | **Owner**    | Recommend        | Notify           | Partner           |
| QC                    | Quality policy     | **Owner**    | Summarize        | Route            | Operator/partner  |
| Shipment              | Service policy     | **Owner**    | Analyze          | Notify           | Courier           |
| Inventory             | Stock policy       | **Owner**    | Forecast         | Alerts           | Supplier          |
| Procurement           | Procurement policy | **Owner**    | Recommend        | Reminder         | Vendor            |
| Goods Receipt         | Receiving policy   | **Owner**    | Analyze          | Notify           | Supplier/receiver |
| Operational Exception | Exception policy   | **Owner**    | Prioritize       | Detect           | —                 |
| Content               | Brand/marketing    | Link only    | Cognitive assist | Publish/schedule | Channels          |
| AI Memory             | —                  | Not truth    | **Owner**        | —                | Provider optional |
| Model routing         | —                  | —            | **Owner**        | —                | AI provider       |
| Physical production   | Standards          | Track        | Analyze          | Coordinate       | **Partner owner** |

---

# 120. P0 — Operating Spine Must Work

Before launch scale, the following must be trustworthy:

```text
Customer
Lead
Requirement
Quote
Order
Invoice / Payment
Production
Production Assignment
Vendor
QC
Shipment
Cost / Margin
```

Most exist.

The work is integration and hardening.

---

# 121. P0 Operating-Spine Closure Verification

Phase 1 Operating Spine closure verified and closed the P0 implementation priorities:

```text
1. Lead → Requirement continuation (implemented & verified)
2. Authoritative Order lifecycle (enforced state transitions & cancellation)
3. Vendor identity → Production Assignment (implemented & verified)
4. Assignment acceptance / decline / reassignment (implemented & verified)
5. Production/QC → Fulfillment readiness (item-level pass/fail gates)
6. Governed Work Order / SPK artifact (generation & print slip)
7. Clean Lead → Margin E2E (verified)
8. Operator Acceptance Test (verified)
```

---

# 122. Why Operating Spine Preceded Exception

Operational Exception is valuable only when underlying authoritative state is sufficiently reliable.

Because the Phase 1 Operating Spine has established verified integrity across the core business flows, the prerequisite for Founder Control and Operational Exception modeling is satisfied.

Therefore:

```text
SPINE INTEGRITY (VERIFIED IN PHASE 1)
        ↓
EXCEPTION MANAGEMENT & FOUNDER ATTENTION (CANONICAL TARGET)
```

---

# 123. P1 — Founder Control Layer

After P0:

```text
Operational Exception
Founder Read Models
Customer Case Lite
Vendor Capability expansion
Finance attention views
Operations attention views
```

---

# 124. Highest-Leverage Post-Spine Capability

> **Operational Exception Management**

because founder-by-exception requires the system to surface abnormality rather than forcing Rizky to search for problems.

---

# 125. P1 Founder Read Models

Examples:

```text
Sales Attention
Quote Attention
Payment Attention
Production Attention
Shipment Attention
Margin Attention
```

These are read projections.

They are not systems of record.

---

# 126. P2 — Deterministic Automation

After stable workflow exists:

```text
lead capture
qualification support
quote follow-up
payment reminders
vendor acknowledgement reminders
production deadline alerts
shipment updates
exception routing
```

---

# 127. P3 — JARVIS Lite

Then:

```text
Morning Briefing
Exception Summary
Sales Pipeline Summary
Cash Summary
Production Risk Analysis
Vendor Recommendation
Requirement Extraction
```

Initial scope should remain read/analyze/recommend/draft.

---

# 128. P4 — Commerce Expansion

When retail launch demands it:

```text
Product
Variant
SKU
Catalog
Channel Listing
Return / Refund
```

---

# 129. P5 — Network Expansion

Later:

```text
Creator
Agreement
Royalty
Earning
Payout
Affiliate
Reseller
broader Partner model
```

---

# 130. P6 — Advanced Intelligence

Later-stage candidates:

```text
capacity optimization
demand forecasting
marketing attribution
advanced procurement automation
treasury optimization
cross-business intelligence
```

---

# 131. New Root Entity Gate

Before creating a root entity answer:

```text
What recurring real-world thing does it identify?

Does it have independent lifecycle?

What current representation fails?

What founder burden does it remove?

What other entities depend on it?

Does it require independent audit/history?
```

If answers are weak:

```text
DEFER
```

---

# 132. Capability Does Not Equal Entity

Examples:

```text
Work Order
→ generated artifact first

Morning Briefing
→ read projection + JARVIS

Vendor recommendation
→ JARVIS skill

Payment reminder
→ deterministic automation

Founder Home
→ read model / UI
```

---

# 133. Domain Promotion Flow

```text
BUSINESS NEED
     ↓
REPEATED REAL USE
     ↓
CAPABILITY GAP
     ↓
DOMAIN ANALYSIS
     ↓
DO WE NEED A NEW ENTITY?
     │
     ├── NO
     │    ↓
     │  View / Tool / Workflow / Artifact
     │
     └── YES
          ↓
      CANONICAL SPEC
          ↓
       MIGRATION
          ↓
     IMPLEMENTATION
          ↓
        EVIDENCE
```

---

# 134. TeeStock Documentation Is a Requirements Reservoir

The current TeeStock model should be interpreted as:

```text
business capability map
+
future requirements reservoir
```

not automatic MGBOS database backlog.

---

# 135. TeeStock `11-data-mgbos` Authority

Current paths remain valid until controlled migration:

```text
bisnis/teestock/11-data-mgbos/
```

But semantic interpretation is:

```text
TEEStock business/system requirements
```

not:

```text
MGBOS canonical implementation authority
```

MGBOS architecture wins for MGBOS-owned entities, states, invariants, commands, and transactions.

---

# 136. Why TeeStock Documentation Is Valuable

It reveals likely future pressures including:

```text
commerce
creator economy
IP
royalties
partners
catalog
marketing attribution
customer support
```

without requiring immediate implementation.

---

# 137. MGBOS Must Remain Reusable

Avoid hardcoding apparel-specific business detail into generic shared domains.

---

# 138. Business-Specific Extensions

Apparel-specific semantics may live in:

```text
Requirement specification
TeeStock application layer
business-specific extension
```

while generic entities remain reusable.

---

# 139. Example

Generic:

```text
Requirement
Quote
Order
Production Job
```

TeeStock-specific:

```text
fabric
GSM
print placement
print dimension
decoration method
color breakdown
```

---

# 140. No Giant Universal Schema

Do not add fields such as:

```text
gsm
ink_type
embroidery_thread
paper_size
lamination
```

to generic Order merely to support every business.

---

# 141. Shared-Domain Test

A concept belongs in shared MGBOS when it:

```text
has stable semantics
appears across workflows/businesses
requires central integrity
benefits from canonical identity
```

---

# 142. Business-Extension Test

Keep a concept business-specific when:

```text
meaning is domain-specific
lifecycle remains local to one business
no shared integrity requirement exists
```

---

# 143. JARVIS Ownership Test

A capability primarily belongs to JARVIS when the primary output is:

```text
interpretation
recommendation
ranking
summary
draft
prediction
```

rather than authoritative business fact.

---

# 144. Automation Ownership Test

Use deterministic automation when work is:

```text
triggered
repeatable
low ambiguity
rule-defined
```

---

# 145. Provider Ownership Test

Provider remains authority for provider-side facts such as:

```text
courier scan
provider transaction acknowledgement
CI run
```

Internal business interpretation belongs to the relevant BisnisHub system.

---

# 146. Founder Burden Mapping

| Capability                    | Founder burden removed                           |
| ----------------------------- | ------------------------------------------------ |
| Lead → Requirement continuity | reconstructing inquiry context                   |
| Requirement structure         | remembering missing requirements                 |
| Quote engine                  | repetitive pricing preparation                   |
| Order lifecycle               | mentally tracking overall commitment             |
| Vendor-backed assignment      | remembering who is executing                     |
| Assignment acknowledgement    | manually confirming vendor acceptance            |
| Work Order artifact           | reconstructing production instructions from chat |
| Fulfillment readiness guard   | manually deciding whether shipment is safe       |
| Operational Exception         | searching for problems                           |
| Cash/AR view                  | manually reconciling finance                     |
| Production attention view     | checking jobs individually                       |
| Reminder automation           | remembering follow-ups                           |
| Morning Briefing              | opening many screens every morning               |

---

# 147. Immediate Highest-Leverage Gaps

Current evidence identifies:

```text
1. Operating-spine integration gaps
2. Work Order communication
3. Operational Exception
4. Founder Read Models
5. Vendor capability enrichment
```

---

# 148. Opportunity Revisit

Measure later:

```text
How many qualified leads need multiple commercial pursuits?

How many active pursuits need tracking independent of Lead?

Does Lead → Requirement → Quote become operationally confusing?
```

Then decide.

---

# 149. Project Revisit

Measure:

```text
How often does one engagement span multiple Orders?

Are independent milestones required?

Is a coordination umbrella genuinely missing?
```

Then decide.

---

# 150. Product Revisit

Measure:

```text
How many stable repeatable products/SKUs exist?

Do channels and inventory need one shared Product identity?
```

Then decide.

---

# 151. Creator Revisit

Measure:

```text
Are creator earnings recurring?

Are multiple creators active?

Is manual financial reconciliation becoming risky?
```

Then decide.

---

# 152. Current Recommended Capability Order

```text
1. Connect Lead → Requirement

2. Complete authoritative Order lifecycle

3. Connect Vendor → Production Assignment

4. Reconcile Assignment acknowledgement/reassignment

5. Enforce Production/QC → Fulfillment readiness

6. Generate governed Work Order / SPK

7. Prove clean Lead → Margin E2E

8. Run Operator Acceptance Test

9. Add Operational Exception

10. Add Founder Read Models

11. Enrich Vendor Capability

12. Automate routine deterministic work

13. Add JARVIS Lite read intelligence
```

---

# 153. State-Machine Authority

Some TeeStock business docs use simplified lifecycle terminology.

For MGBOS-owned transactional entities:

```text
MGBOS Business State Machines
```

are authoritative.

---

# 154. Roadmap Shorthand Is Allowed

TeeStock may use:

```text
Lead → Quote → Order → Production
```

as business shorthand.

It must not become a competing database lifecycle definition.

---

# 155. Q4 Roadmap Reconciliation

TeeStock Q4 requests concepts such as:

```text
Opportunity
Project
Work Order
Customer Case
Exception
```

This Domain Map refines them into:

```text
Opportunity
→ DEFERRED / EVIDENCE REQUIRED

Project
→ DEFERRED / CONDITIONAL

Work Order
→ NEXT / P0 artifact first

Customer Case
→ NEXT-LITE / P1

Operational Exception
→ NEXT / P1 highest-leverage post-spine
```

---

# 156. This Does Not Reject TeeStock Roadmap

It applies the rule:

> **Build the capability before adding unnecessary structural complexity.**

---

# 157. Q4 Core Target

```text
LEAD-TO-CASH
+
ORDER-TO-FULFILLMENT
```

remains unchanged.

---

# 158. Canonical Q4 System Spine

```text
LEAD
 ↓
REQUIREMENT
 ↓
QUOTE
 ↓
ORDER
 ├────────────► INVOICE / PAYMENT
 │
 ▼
PRODUCTION JOB
 ↓
PRODUCTION ASSIGNMENT
 ↓
WORK ORDER ARTIFACT
 ↓
QC
 ↓
SHIPMENT
 ↓
ACTUAL COST / MARGIN
```

Later cross-cutting:

```text
OPERATIONAL EXCEPTION
```

---

# 159. Founder Control Projection

Target deterministic view:

```text
TODAY

Leads requiring action
Quotes waiting
Orders blocked
Payment problems
Production at risk
QC failures
Shipments late
Margin exceptions
```

---

# 160. JARVIS Consumption Model

JARVIS consumes trusted projections and evidence.

It should output:

```text
"These 3 things need your attention."
```

rather than reconstructing truth from raw chats.

---

# 161. Near-Term Domain Development Freeze

Until the spine is validated:

```text
DO NOT IMPLEMENT
```

without strong new evidence:

```text
Opportunity
generic Project
full Product/Catalog
Creator/Royalty
Affiliate
generic Partner super-domain
Marketing Campaign domain
advanced BOM/Recipe
```

---

# 162. Freeze Exception

A deferred domain may be promoted if it becomes:

```text
a real launch blocker
a business-integrity risk
an irreducible founder burden
a hard requirement of the selected business model
```

---

# 163. Definition of Done — Core Spine

Before significant domain expansion:

```text
one Lead
can continue into Requirement

one Quote
can be accepted

one Order
can progress through governed lifecycle

one Payment
can be recorded and allocated

one Production Job
can be assigned to a Vendor

one Assignment
can be acknowledged

one QC result
can govern readiness

one Shipment
can complete safely

one Actual Margin
can be inspected

one Order
can complete
```

---

# 164. Definition of Done — Founder Leverage

The system can answer:

```text
What needs action?
What is late?
What is blocked?
What is unpaid?
What is risky?
What needs Rizky?
```

without database investigation.

---

# 165. Definition of Done — Partner Coordination

For outsourced work:

```text
vendor
scope
specification
deadline
commercial basis
acknowledgement
status
QC
```

are visible in governed system data/artifacts.

---

# 166. Definition of Done — Automation

Selected routine actions no longer require founder memory.

Examples:

```text
quote follow-up
payment reminder
vendor acknowledgement reminder
production deadline alert
shipment notification
```

---

# 167. Definition of Done — JARVIS Lite

JARVIS reads trusted MGBOS projections and can produce:

```text
Morning Briefing
Exception Summary
Recommendation
Draft
```

without becoming a mutation authority.

---

# 168. Current Capability Heatmap

```text
                              NOW        NEXT

Customer                     ███
Lead                         ███
Requirement                  ███
Quote                        ███
Order                        ███  (Phase 1 lifecycle verified)
Payment                      ███
Production                   ███
Production Assignment        ███  (Phase 1 assignment verified)
Vendor                       ██▒  → portal deferred
QC                           ███  (Phase 1 gates verified)
Shipment                     ███  (Phase 1 readiness verified)
Inventory                    ███
Procurement                  ███
Goods Receipt                ███
Vendor Bills                 ███
Cost / Margin                ███
Work Order Artifact          ███  (Phase 1 SPK verified)

Operational Exception                   ███ TARGET (reconciled; Phase 2 not open)
Founder Attention                       ███ TARGET (reconciled projection)
Founder Home                            ███ TARGET (reconciled surface)
Vendor Capability Expansion             ██▒ P1 deferred
Customer Case Lite                      ██▒ P1 deferred
Automation                              ██▒ P2
JARVIS Lite                             ██▒ P3

Opportunity                                      ▒
Project                                          ▒
Product / Catalog                                ▒
Returns                                          ▒
Creator / Royalty                                ▒
Affiliate                                        ▒
Advanced Partner                                 ▒
BOM / Recipe                                     ▒
```

Legend:

```text
███ materially established
██▒ materially present but incomplete for target workflow
▒   deferred / future
```

---

# 169. Architectural Invariants

1. MGBOS grows from demonstrated operational need.
2. Business documentation does not automatically define MGBOS schema.
3. `CURRENT` means materially represented in active MGBOS.
4. `CURRENT` does not automatically mean operationally complete.
5. Future concepts must not be represented as current truth.
6. A capability does not always require a new entity.
7. Existing aggregates should be reused before creating new ones.
8. Lead → Requirement → Quote is sufficient until Opportunity proves necessary.
9. Order + Production Jobs are sufficient until Project proves necessary.
10. Work Order begins as governed artifact unless independent lifecycle proves otherwise.
11. Vendor remains sufficient for physical partners until broader Partner abstraction proves necessary.
12. Goods Receipt is already a current physical receipt capability.
13. Full Product/Variant/SKU is not required for custom-service operations.
14. Product domain becomes important when stable commerce requires reusable product identity.
15. Creator/Royalty infrastructure is deferred until creator economics are real and recurring.
16. Operational Exception should follow a trustworthy operating spine.
17. Exception does not replace domain state.
18. Customer Case and Operational Exception remain conceptually distinct.
19. Founder read models are projections, not sources of truth.
20. JARVIS recommendations are not transactional truth.
21. Automation cannot own business state.
22. External provider facts require internal interpretation.
23. Physical reality requires observation/evidence.
24. Business-specific specifications should not unnecessarily pollute generic schemas.
25. Generic abstractions require stable repeated meaning.
26. Domain complexity must earn itself through operating leverage.
27. Current operating-spine integrity takes precedence over speculative breadth.

---

# 170. Canonical Ownership Map

```text
                  BUSINESS LAYER
                       │
          requirements / policies
                       │
                       ▼
                     MGBOS
          governed operational truth
                       │
       ┌───────────────┼───────────────┬────────────────┐
       │               │               │                │
       ▼               ▼               ▼                ▼
    CURRENT     CANONICAL_TARGET      NEXT           DEFERRED
       │               │               │                │
Customer        Operational     Customer Case    Opportunity
Lead            Exception       Vendor           Project
Requirement     Founder         Capability       Product/Catalog
Quote           Attention                        Creator/Royalty
Order           Founder Home                     Affiliate
Production                                       Advanced Partner
Assignment                                       BOM/Recipe
Work Order
Vendor
QC
Invoice/Payment
Shipment
Inventory
Procurement
Goods Receipt
Cost/Margin
       │               │               │                │
       └───────────────┴───────┬───────┴────────────────┘
                               ▼
                            JARVIS
                      intelligence / decisions
                               │
                               ▼
                          AUTOMATION
                               │
                               ▼
                      PROVIDERS / PARTNERS
```

---

# 171. Implementation North Star

The question is not:

> **What additional TeeStock entities can we add?**

The question is:

> **Can one real order move end-to-end through the domains we already have without Rizky becoming the manual router between them?**

If:

```text
NO
```

fix the spine.

If:

```text
YES
```

expand only where repeated real operating evidence justifies it.

---

# 172. Final Principle

> **MGBOS should be exactly as complex as necessary to keep the business simple for the founder.**

Wrong:

```text
future business concepts
        ↓
implement all entities
        ↓
large ERP
        ↓
founder maintains software complexity
```

Desired:

```text
REAL BUSINESS FLOW
        ↓
REPEATED OPERATIONAL NEED
        ↓
SMALLEST CORRECT CAPABILITY
        ↓
MGBOS
        ↓
AUTOMATION
        ↓
JARVIS
        ↓
LESS FOUNDER BURDEN
```
