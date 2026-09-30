---
canonical_id: mgbos.architecture.domain-map-capability-ownership
status: ACTIVE
version: 1.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: mgbos-cross-business
document_class: canonical-specification
effective_from: 2026-09-30
authoritative_for:
  - mgbos domain boundaries
  - mgbos capability ownership
  - current-versus-target domain classification
  - business-requirement promotion into mgbos
  - teestock-to-mgbos capability mapping
  - mgbos-versus-jarvis capability boundaries
  - mgbos-versus-automation boundaries
  - external-provider capability boundaries
  - domain expansion sequencing
  - solo-founder operating-spine prioritization
last_reviewed: 2026-09-30
review_cadence: monthly-during-q4-2026
depends_on:
  - ../../../../docs/governance/documentation-constitution.md
  - ../../../../docs/governance/canonical-source-map.md
  - ../../../../docs/architecture/master-system-blueprint.md
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

# MGBOS Domain Map & Capability Ownership v1.0

## 1. Purpose

Dokumen ini menjawab:

> **Capability bisnis mana yang harus dimiliki MGBOS, mana yang tetap menjadi TeeStock business knowledge, mana yang menjadi tanggung jawab JARVIS, mana yang cukup diotomatisasi, dan mana yang tetap dimiliki provider/partner eksternal?**

Tujuannya adalah mencegah dua kegagalan sekaligus:

```text id="4o7d3u"
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

# 3. Second Principle

> **Business requirements may pull MGBOS forward. They do not automatically become MGBOS entities.**

---

# 4. Third Principle

> **Every new MGBOS domain must remove operational ambiguity, protect business integrity, or materially reduce founder burden.**

---

# 5. MGBOS Is Not Every Business Concept

MGBOS SHOULD own concepts requiring:

```text id="woqqau"
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

```text id="wqbrwg"
brand philosophy

creative direction

campaign narrative

market research

strategic thesis

content ideas

temporary experiments
```

unless operational requirements later justify structured representation.

---

# 7. Capability Classification

Every capability uses one of:

```text id="1xap60"
CURRENT

PARTIAL

NEXT

DEFERRED

EXPERIMENTAL

OUTSIDE_MGBOS
```

---

# 8. CURRENT

Canonical implementation already exists materially in MGBOS.

---

# 9. PARTIAL

Core semantics exist, but capability is incomplete for the intended operating workflow.

---

# 10. NEXT

Capability has strong near-term operational justification and belongs in the next implementation horizon.

---

# 11. DEFERRED

Potentially useful, but current evidence does not justify implementation yet.

---

# 12. EXPERIMENTAL

Prototype or provisional implementation exists without mature canonical production semantics.

---

# 13. OUTSIDE_MGBOS

Another system/domain is the proper owner.

---

# 14. Capability Ownership Vocabulary

Primary owners:

```text id="znwd55"
TEEStock BUSINESS

MGBOS

JARVIS

AUTOMATION

EXTERNAL PROVIDER

PRODUCTION / LOGISTICS PARTNER

CROSS-SYSTEM GOVERNANCE
```

---

# 15. Fundamental Ownership Model

```text id="7z22qx"
TEEStock
defines what the business needs

MGBOS
holds operational business truth

JARVIS
interprets and coordinates that truth

AUTOMATION
executes deterministic repetition

PROVIDERS
own their external system facts

PARTNERS
perform physical work
```

---

# 16. Domain Map — Current Core

| Domain                  | MGBOS Status                | Primary Owner | Near-Term Importance |
| ----------------------- | --------------------------- | ------------- | -------------------- |
| Organization / Identity | CURRENT                     | MGBOS         | Critical             |
| Customer                | CURRENT                     | MGBOS         | Critical             |
| Lead / CRM              | CURRENT                     | MGBOS         | Critical             |
| Requirement             | CURRENT                     | MGBOS         | Critical             |
| Quotation               | CURRENT                     | MGBOS         | Critical             |
| Order                   | CURRENT / PARTIAL lifecycle | MGBOS         | Critical             |
| Production              | CURRENT                     | MGBOS         | Critical             |
| Vendor                  | CURRENT                     | MGBOS         | Critical             |
| Quality Control         | CURRENT                     | MGBOS         | Critical             |
| Invoice                 | CURRENT                     | MGBOS         | Critical             |
| Payment                 | CURRENT                     | MGBOS         | Critical             |
| Inventory               | CURRENT                     | MGBOS         | High                 |
| Procurement             | CURRENT                     | MGBOS         | High                 |
| Vendor Bills            | CURRENT                     | MGBOS         | High                 |
| Fulfillment / Shipment  | CURRENT                     | MGBOS         | High                 |
| Order Financial Summary | CURRENT                     | MGBOS         | High                 |
| Design Library          | EXPERIMENTAL                | MGBOS         | Low near-term        |

---

# 17. This Core Already Covers Most of the First Spine

Current MGBOS can already represent much of:

```text id="8n1k28"
LEAD
 ↓
REQUIREMENT
 ↓
QUOTE
 ↓
ORDER
 ↓
PAYMENT
 ↓
PRODUCTION
 ↓
QC
 ↓
FULFILLMENT
 ↓
COST / MARGIN
```

Therefore Q4 should primarily:

```text id="24qgpi"
CONNECT

HARDEN

SIMPLIFY

SURFACE
```

before introducing many new root entities.

---

# 18. Organization & Identity

Status:

```text id="4xlg3x"
CURRENT
```

MGBOS owns:

```text id="13banp"
organization

brand

business line

channel

user

membership

role relationships
```

---

# 19. Person vs Customer Contact

TeeStock future model introduces generic:

```text id="iqqd6l"
PERSON
```

Current MGBOS has:

```text id="waau0z"
customer_contacts
```

For current TeeStock operating spine:

```text id="v68zqc"
DO NOT add generic Person yet.
```

---

# 20. Generic Person Promotion Trigger

Consider a generic Person identity only when one individual must reliably participate across multiple roles such as:

```text id="0q2ghl"
customer contact

creator

partner contact

employee/operator

affiliate
```

and duplication becomes operationally harmful.

Status:

```text id="ul11g8"
DEFERRED
```

---

# 21. Customer Domain

Status:

```text id="w28zt1"
CURRENT
```

Current model already separates:

```text id="wa1dd1"
customer account

contact

address

brand relationship
```

This is sufficient for initial TeeStock B2B/custom operations.

---

# 22. Lead Domain

Status:

```text id="3t4eoa"
CURRENT
```

Current MGBOS lead is the canonical inbound commercial inquiry.

---

# 23. Opportunity

TeeStock Q4 asks for:

```text id="0z7dxp"
OPPORTUNITY
```

Current MGBOS explicitly does NOT implement it.

Status:

```text id="nu1wz8"
DEFERRED / EVIDENCE REQUIRED
```

for initial operating spine.

---

# 24. Why Opportunity Is Deferred

Initial pipeline can use:

```text id="76joq9"
LEAD
 ↓
QUALIFIED
 ↓
REQUIREMENT
 ↓
QUOTE
```

without a separate Opportunity entity.

---

# 25. Opportunity Promotion Trigger

Create Opportunity when real operation demonstrates need for:

```text id="7xwyg7"
multiple commercial attempts under one sales pursuit

multiple quotes for different solution paths

pipeline forecasting independent of Lead

sales ownership beyond Lead lifecycle

long-running deal management
```

---

# 26. Lead-to-Quote Simplicity Wins Now

For a solo founder:

```text id="fdth6m"
fewer entities
+
clear pipeline
```

is currently preferable.

---

# 27. Requirement Domain

Status:

```text id="sv5is6"
CURRENT
```

This is especially important for TeeStock because custom apparel requirements are often incomplete and changing.

---

# 28. Requirement Is a High-Leverage Entity

It removes requirement state from:

```text id="6rmkis"
WhatsApp

founder memory

random notes
```

---

# 29. Structured Requirement Extensions

Use schema-versioned structured specifications for:

```text id="7daj23"
garment

printing

embroidery

packaging

merchandise
```

before introducing dozens of specialized database tables.

---

# 30. Quote Domain

Status:

```text id="zv64ft"
CURRENT
```

Already supports:

```text id="87jkyo"
versioning

line items

estimated costs

price approvals

requirement snapshots
```

This is a core solo-founder leverage capability.

---

# 31. Pricing Ownership

TeeStock owns:

```text id="th751m"
pricing strategy

commercial guardrails

discount philosophy
```

MGBOS owns:

```text id="ajh2eh"
quote calculation

snapshot

approval

enforcement

audit
```

---

# 32. Order Domain

Status:

```text id="29n81k"
CURRENT
```

but generic transition enforcement remains:

```text id="bb2s47"
PARTIAL
```

according to current canonical state-machine specification.

---

# 33. Order Is Commercial Commitment

Do not overload Order with:

```text id="yviu7s"
production status

payment status

shipping status

QC status
```

Those remain independent domains.

---

# 34. Project Domain

TeeStock Q4 proposes:

```text id="q3n1ga"
PROJECT
```

for complex service work.

Current MGBOS has no canonical Project entity.

Status:

```text id="qxzwwo"
DEFERRED / CONDITIONAL NEXT
```

---

# 35. Initial Project Substitution

For simple custom jobs:

```text id="jd4qtu"
REQUIREMENT
+
QUOTE
+
ORDER
+
PRODUCTION JOB(S)
```

can represent the work sufficiently.

---

# 36. Project Promotion Trigger

Create Project when one customer initiative routinely requires:

```text id="hcfovf"
multiple Orders

multiple Production Jobs

multiple delivery phases

non-billable tasks

complex milestone coordination

persistent coordination independent of one Order
```

---

# 37. Avoid Project-as-Container Syndrome

Do not create Project merely because:

```text id="sehepe"
"projects sound enterprise."
```

---

# 38. Production Domain

Status:

```text id="yd8xhq"
CURRENT
```

Production Job already gives internal operational identity.

---

# 39. Production Job Role

Production Job should answer:

```text id="zf8h1f"
What work must be produced?

For which Order?

What items?

What state?

Who is handling it?

What is blocking it?
```

---

# 40. Work Order

TeeStock Q4 strongly wants:

```text id="oh07di"
WORK ORDER
```

for partner production.

Current MGBOS has:

```text id="xwtd5q"
production_assignments

production jobs

purchase orders
```

but no independent canonical Work Order entity.

---

# 41. Work Order Decision

Status:

```text id="o55wft"
NEXT AS OPERATIONAL ARTIFACT
NOT NECESSARILY NEW ROOT ENTITY
```

---

# 42. Initial Work Order Model

Generate a governed Work Order from:

```text id="yj59ad"
PRODUCTION JOB
+
PRODUCTION ASSIGNMENT
+
PARTNER / VENDOR
+
REQUIREMENT SNAPSHOT
+
DELIVERY REQUIREMENT
```

---

# 43. Why

What matters first is:

> **No critical production commitment exists only in chat.**

The system does not initially need another aggregate if existing entities already provide the required identity and lifecycle.

---

# 44. Work Order Promotion Trigger

Create a first-class Work Order entity only if it develops independent:

```text id="gu5x91"
revision lifecycle

acceptance lifecycle

partial completion

pricing

billing

multiple assignments

evidence history
```

that cannot cleanly belong to Production Assignment or PO.

---

# 45. Vendor Domain

Status:

```text id="as0ish"
CURRENT
```

Current MGBOS:

```text id="pow66k"
vendor

rate card

production assignment

QC relationship
```

already captures much of TeeStock's near-term partner need.

---

# 46. Partner Domain

TeeStock future model uses broader:

```text id="d9uq1a"
PARTNER
```

Status:

```text id="9b495h"
DEFERRED GENERALIZATION
```

---

# 47. Initial Rule

For physical production/supplier partners:

```text id="dk5gf7"
VENDOR
```

is currently sufficient.

---

# 48. Partner Generalization Trigger

Consider a broader Partner abstraction when system must support significantly different relationships such as:

```text id="tc9dqk"
production vendor

fulfillment partner

technology partner

creator partner

channel partner

affiliate organization
```

under one shared relationship framework.

---

# 49. Partner Capability

Capability data is high-value even before generic Partner exists.

Status:

```text id="kxsb98"
NEXT
```

Examples:

```text id="7djts1"
DTF

screen printing

embroidery

cut-and-sew

packaging

fulfillment
```

---

# 50. Vendor Capability Goal

System should eventually know:

```text id="m8sp85"
what vendor can do

current rate basis

typical lead time

quality performance

capacity observations
```

so founder memory is not the routing engine.

---

# 51. Vendor Capacity

Status:

```text id="f671s2"
PARTIAL / NEXT
```

Exact real-time capacity may initially be:

```text id="ytxufn"
manual observation
```

rather than sophisticated scheduling engine.

---

# 52. Do Not Invent Capacity Precision

Avoid false data such as:

```text id="89ooxh"
73.8% vendor utilization
```

unless measurement actually supports it.

---

# 53. Quality Domain

Status:

```text id="pzx3x9"
CURRENT
```

QC records belong to MGBOS operational truth.

---

# 54. QC Evidence

Future useful evidence includes:

```text id="si3bhc"
inspection result

defect category

photo/file reference

rework

rejection reason
```

according to real workflow need.

---

# 55. Customer Finance

Invoices:

```text id="dd2ffh"
CURRENT
```

Payments:

```text id="9aqzua"
CURRENT
```

Allocations:

```text id="og9zve"
CURRENT
```

---

# 56. Cash Visibility

Status:

```text id="tmn68u"
PARTIAL
```

MGBOS has transaction/financial primitives, but founder-level:

```text id="n64wt3"
available cash

receivables

payables

near-term cash obligations
```

needs a deliberately designed read model.

---

# 57. Finance Read Models

Status:

```text id="uc4ad7"
NEXT
```

High-leverage examples:

```text id="2rvpn1"
cash summary

AR aging

AP obligations

order margin exceptions

quote-vs-actual cost variance
```

---

# 58. Treasury Policy

TeeStock owns policy.

MGBOS provides authoritative numbers and enforcement where appropriate.

JARVIS may analyze.

---

# 59. Procurement

Status:

```text id="67tzj4"
CURRENT
```

Current entities include:

```text id="ig4wio"
purchase orders

purchase-order items

vendor bills

vendor bill payments
```

---

# 60. Goods Receipt

TeeStock future requirements reference:

```text id="4dn3lh"
GOODS RECEIPT
```

Current canonical model should be checked per implemented schema before treating this as active root entity.

Classification:

```text id="f90obe"
PARTIAL / NEXT WHEN PROCUREMENT FLOW REQUIRES
```

---

# 61. Inventory

Status:

```text id="ceyuw7"
CURRENT
```

Current MGBOS supports:

```text id="hqgo75"
inventory items

levels

mutations

reservations
```

---

# 62. Inventory Is Not Product Catalog

Important distinction:

```text id="0iz1wj"
INVENTORY ITEM
≠
PRODUCT
```

Current MGBOS can track stock without yet implementing TeeStock's complete future commerce catalog.

---

# 63. Product Domain

TeeStock future model defines:

```text id="r2hj80"
PRODUCT
VARIANT
SKU
```

Current MGBOS does not have a mature generic Product master.

Status:

```text id="fnkqv1"
DEFERRED / LAUNCH-SCOPE DEPENDENT
```

---

# 64. Custom Services Do Not Require Full Product Catalog

For:

```text id="hxn3bl"
Custom

Business

Merch

Studio
```

current Requirement + Quote line-item snapshots may be sufficient initially.

---

# 65. Commerce Launch Changes This

If TeeStock launches:

```text id="cw84cy"
Selects

Essentials

standard retail products
```

with repeatable SKUs, Product/Variant/SKU becomes:

```text id="6wyyr2"
NEXT
```

---

# 66. Product Promotion Trigger

Implement when TeeStock needs:

```text id="11je3n"
reusable sellable identity

channel listings

SKU-level analytics

standard pricing

catalog navigation

inventory linked to stable SKU
```

---

# 67. Catalog Domain

Status:

```text id="61hs0c"
DEFERRED
```

until multi-product commerce requires persistent merchandising structure.

---

# 68. Catalog Is Not Order Truth

Even later:

```text id="nij4q2"
ORDER ITEM
```

remains contractual snapshot.

Changing Product later must not rewrite historical Order.

---

# 69. Garment Platform

TeeStock may need reusable blank/garment specifications.

Status:

```text id="wl578z"
DEFERRED / PRODUCT-DOMAIN SUBMODEL
```

Build when product standardization begins creating duplicated specifications.

---

# 70. BOM / Recipe

Future TeeStock model proposes:

```text id="352git"
BOM

RECIPE
```

Status:

```text id="7czsk4"
DEFERRED
```

for now.

---

# 71. BOM Promotion Trigger

Implement when:

```text id="6xs613"
standard products repeatedly consume known materials/processes

costing requires reusable composition

inventory consumption needs structured derivation

production recipes are stable enough
```

---

# 72. Do Not Build Manufacturing ERP Early

Custom production can continue using:

```text id="veibqr"
requirement snapshots

quote cost components

production job data

actual cost
```

until repeated structure justifies BOM.

---

# 73. Fulfillment

Shipment domain:

```text id="jzcw9z"
CURRENT
```

External carrier remains owner of carrier-side facts.

MGBOS owns internal shipment interpretation/state.

---

# 74. Return / Refund Domain

TeeStock commerce framework requires future:

```text id="mzncoc"
returns

refunds

replacement
```

Current MGBOS has financial reversal primitives but not a full commerce Returns domain.

Status:

```text id="vwvzzr"
DEFERRED UNTIL RETAIL COMMERCE NEED
```

---

# 75. Customer Case

TeeStock Q4 requests:

```text id="2acbsi"
CUSTOMER CASE
```

Status:

```text id="8d70w5"
NEXT-LITE
```

because founder-by-exception needs durable abnormal customer issues.

---

# 76. Customer Case Purpose

Examples:

```text id="sdimx1"
complaint

customer change request

refund request

delivery issue

quality complaint
```

---

# 77. Customer Case Must Not Replace Domain State

Example:

```text id="s66ayl"
case = payment dispute
```

does not replace:

```text id="m2z7x4"
payment state
```

---

# 78. Operational Exception

Status:

```text id="gsg7ex"
NEXT
```

This is one of the highest-leverage missing capabilities.

---

# 79. Exception Purpose

Persistent explicit record for:

```text id="193wno"
production late

payment mismatch

vendor no-response

missing artwork

QC failure

integration failure

margin exception requiring attention
```

---

# 80. Exception ≠ State Machine

Example:

```text id="w9rwmy"
production job:
IN_PRODUCTION

exception:
PARTNER_LATE
```

This preserves domain truth while surfacing abnormality.

---

# 81. Exception ≠ Incident

Operational business exception and technical/system incident remain distinct.

---

# 82. Exception Ownership

MGBOS owns persistent business exception facts.

JARVIS may:

```text id="8nob7k"
detect

prioritize

explain

recommend.
```

---

# 83. This Is Critical for Founder-by-Exception

Without an Exception domain:

```text id="b9hwkg"
Rizky must search for problems.
```

With it:

```text id="n8j2r1"
problems find Rizky.
```

---

# 84. Artwork

Current design-library implementation:

```text id="jm60cx"
EXPERIMENTAL
```

TeeStock future model treats Artwork as important across Custom, Creator, Originals.

---

# 85. Artwork Near-Term Scope

For custom production:

```text id="vych3q"
file reference

version

approval status

production linkage
```

can become useful relatively early.

Classification:

```text id="zv590g"
PARTIAL / NEXT WHEN REAL JOBS REQUIRE
```

---

# 86. Do Not Overbuild DAM

Avoid full enterprise:

```text id="lzr7qu"
Digital Asset Management
```

until actual asset volume demands it.

---

# 87. IP Rights

TeeStock's legal/IP system requires:

```text id="d9t8k8"
rights basis

license

creator agreement

usage scope

expiry
```

Status:

```text id="l57ysz"
DEFERRED
```

for core launch unless copyrighted/creator assets become central immediately.

---

# 88. IP Rule Remains Business Policy

Even before structured implementation:

> **No documented rights basis. No commercial use.**

must remain enforced operationally.

---

# 89. Creator Domain

Future entities include:

```text id="88xvs5"
CREATOR

CREATOR PRODUCT

AGREEMENT

ROYALTY

EARNING

PAYOUT
```

Status:

```text id="b3kk2z"
DEFERRED
```

---

# 90. Why Creator Is Deferred

TeeStock Q4 itself prioritizes:

```text id="suwjrh"
Lead-to-Cash
Order-to-Fulfillment
```

before Creator marketplace infrastructure.

---

# 91. Creator Pilot Rule

A controlled creator experiment may initially use:

```text id="xrs1yq"
manual agreement

documented product attribution

manual earnings calculation with evidence
```

before building generalized Creator Ledger.

---

# 92. Creator Domain Promotion Trigger

Implement once creator transactions become:

```text id="hjdvnx"
recurring

material

multi-creator

financially meaningful

too risky for manual reconciliation
```

---

# 93. Programs

TeeStock programs include:

```text id="kmp6pa"
Creator

Reseller

Affiliate

Partner
```

Program strategy remains:

```text id="jxf3xz"
TEEStock BUSINESS
```

---

# 94. Program Runtime

Status:

```text id="d3c8u8"
DEFERRED
```

until each program proves demand and repeatability.

---

# 95. Reseller

Could initially be represented using:

```text id="ygmjkc"
customer relationship

price policy

channel metadata
```

without dedicated Reseller platform.

---

# 96. Affiliate

External affiliate platform or lightweight attribution MAY be sufficient before MGBOS domain investment.

Status:

```text id="5u29qb"
OUTSIDE / DEFERRED
```

until economics justify internalization.

---

# 97. Marketing Domain

TeeStock owns:

```text id="0ru0ib"
audience

campaign strategy

content

channel strategy

brand
```

---

# 98. Marketing Transactional Model

Status:

```text id="anwh1e"
DEFERRED
```

MGBOS does not need to become a full marketing automation system yet.

---

# 99. Campaign

Persistent Campaign entity becomes useful when:

```text id="vs4vgt"
spend

content

leads

orders

contribution

experiment attribution
```

need reliable cross-channel linkage.

Until then:

```text id="bw2ovz"
business knowledge + external tools
```

are sufficient.

---

# 100. Content

Content planning/generation primarily belongs to:

```text id="3jv2q7"
JARVIS / future Content System
```

not MGBOS transactional core.

---

# 101. MGBOS Content Responsibility

Only operational business linkage if needed:

```text id="852prk"
campaign ID

promotion code

attribution

commercial result
```

---

# 102. Analytics

Analytics consumes MGBOS truth.

It does not own business truth.

---

# 103. TeeStock KPI Layer

TeeStock KPI Framework owns definitions such as:

```text id="7dc47x"
CM4

On-Time Fulfillment

Repeat Contribution

Quote Win Rate

Sell-Through
```

---

# 104. MGBOS Analytics Responsibility

MGBOS SHOULD provide trusted data/read models needed to calculate them.

---

# 105. KPI Calculation

Some KPI computation may live in:

```text id="mzlasb"
analytics/read-model layer
```

rather than transactional aggregates.

---

# 106. Experiment Domain

TeeStock Experimentation Framework owns experiment semantics.

---

# 107. Experiment Runtime

Status:

```text id="rm5vin"
DEFERRED
```

as MGBOS root domain.

Initially experiments can remain documentation + analytics IDs.

---

# 108. Experiment Promotion Trigger

Implement structured Experiment entity when TeeStock runs enough parallel experiments that:

```text id="zreoc5"
assignment

exposure

decision rule

results

version history
```

become hard to govern manually.

---

# 109. Automation

Automation does NOT become a MGBOS business domain merely because n8n executes it.

---

# 110. Automation Owner

```text id="fxjn3f"
AUTOMATION
```

owns workflow execution mechanics.

MGBOS owns business state changed by those workflows.

---

# 111. Automation Registry

Future persistent workflow metadata may belong to:

```text id="20to4j"
JARVIS/platform operational layer
```

rather than business transactional schema.

---

# 112. n8n

n8n:

```text id="7msiim"
scheduler
router
integration orchestrator
```

not:

```text id="52cdxb"
Lead owner
Order owner
Payment owner
```

---

# 113. JARVIS Domain

JARVIS owns cognitive capabilities such as:

```text id="gs00zp"
Morning Briefing

priority analysis

requirement extraction

vendor recommendation

risk analysis

business summaries

decision preparation
```

---

# 114. JARVIS Does Not Need New Business Entities for Most of These

It can reason through:

```text id="9m538g"
MGBOS read models

canonical business docs

bounded Memory
```

---

# 115. Founder Control Layer

Business operational state stays in MGBOS.

Founder attention projection may be:

```text id="2c6hop"
MGBOS read model
+
JARVIS analysis
```

---

# 116. Example

```text id="9owwhs"
MGBOS:
Production Job PJ-104
status = IN_PRODUCTION
deadline = tomorrow

Exception:
PARTNER_LATE

JARVIS:
"This is your highest operational risk today."
```

Three separate semantics.

---

# 117. External Payment Provider

External provider owns:

```text id="29mgu6"
provider transaction fact
```

MGBOS owns:

```text id="9fmjdd"
business payment record

allocation

invoice effect.
```

---

# 118. Logistics Provider

Carrier owns:

```text id="o6i55t"
carrier tracking state
```

MGBOS owns:

```text id="qqm8m1"
Shipment business state.
```

---

# 119. Marketplace

Marketplace may own:

```text id="vd6fja"
marketplace listing

marketplace-side order state
```

MGBOS owns normalized internal Order once accepted into business operation.

Status:

```text id="ye2ja8"
DEFERRED INTEGRATION
```

---

# 120. Production Partner

Partner owns real physical production progress.

MGBOS stores verified observations needed for business operation.

---

# 121. Physical Reality Rule

```text id="k7d8o0"
MGBOS record
≠
physical reality automatically
```

Production completion requires observation/evidence.

---

# 122. Domain Boundary Matrix

| Capability          |     Business Layer |        MGBOS |              JARVIS |       Automation |          External |
| ------------------- | -----------------: | -----------: | ------------------: | ---------------: | ----------------: |
| Business strategy   |          **Owner** |            — |              Assist |                — |                 — |
| Brand               |          **Owner** | Context only |              Assist |                — |                 — |
| Customer identity   |        Requirement |    **Owner** |                Read |             Sync |  External sources |
| Lead                |             Policy |    **Owner** |     Qualify/analyze |    Capture/route |          Channels |
| Requirement         |         Definition |    **Owner** |       Extract/draft |            Route |          Customer |
| Quote               |     Pricing policy |    **Owner** |       Draft/analyze |         Reminder |          Customer |
| Order               |  Commercial policy |    **Owner** |             Analyze |          Trigger |          Channels |
| Payment             |     Finance policy |    **Owner** |             Analyze | Reconcile/notify |  Payment provider |
| Production          |   Operating policy |    **Owner** |       Risk analysis |         Reminder |           Partner |
| QC                  |     Quality policy |    **Owner** |           Summarize |            Route |  Partner/operator |
| Shipment            |     Service policy |    **Owner** |             Analyze |           Notify |           Courier |
| Inventory           |       Stock policy |    **Owner** |            Forecast |    Reorder alert |          Supplier |
| Procurement         | Procurement policy |    **Owner** |           Recommend |         Reminder |            Vendor |
| Exceptions          |             Policy |    **Owner** |          Prioritize |           Detect |                 — |
| Content             |    Brand/marketing |    Link only | **Cognitive owner** | Publish/schedule |          Channels |
| AI Memory           |                  — |    Not truth |           **Owner** |                — | Provider optional |
| Model routing       |                  — |            — |           **Owner** |                — |       AI provider |
| Physical production |          Standards |        Track |             Analyze |       Coordinate | **Partner owner** |

---

# 123. Q4 Capability Priorities

## P0 — Must Work Before Launch Scale

```text id="qrsa5m"
Customer

Lead

Requirement

Quote

Order

Payment

Production

Vendor

QC

Fulfillment

Cost / Margin
```

Mostly current.

Work should emphasize integration and operational usability.

---

# 124. P0 Main Development Theme

> **Do not add many new domains. Make the current spine actually usable end-to-end.**

---

# 125. P1 — Founder Leverage

Highest-value additions:

```text id="ku2n3f"
Operational Exception

Customer Case Lite

Vendor Capability

Finance Read Models

Operations Read Models

Founder Control View

Work Order projection/artifact
```

---

# 126. P2 — Repeatable Automation

After P0/P1:

```text id="sbxjfg"
lead capture

qualification assistance

quote follow-up

payment reminder

production deadline alert

partner acknowledgement

shipment update

exception routing
```

---

# 127. P3 — JARVIS Lite

Then:

```text id="qpv0z7"
Morning Briefing

Exception Summary

Sales Pipeline Summary

Cash Summary

Production Risk Analysis

Vendor Recommendation
```

---

# 128. P4 — Commerce Expansion

Only when launch strategy needs standardized retail catalog:

```text id="70c9cy"
Product

Variant

SKU

Catalog

Channel Listing

Return / Refund
```

---

# 129. P5 — Network Expansion

After core transactions are proven:

```text id="mwprkf"
Creator

Royalty

Earning

Payout

Affiliate

Reseller

broader Partner domain
```

---

# 130. P6 — Advanced Operating Intelligence

Later:

```text id="e3uo49"
capacity optimization

demand forecasting

marketing attribution

automated procurement

advanced treasury

cross-business intelligence
```

---

# 131. Entity Introduction Gate

No new root entity should be introduced until it answers:

```text id="qj51pz"
What real recurring thing does it identify?

What lifecycle does it own?

What cannot be represented safely today?

What founder burden does it remove?

What other entities depend on it?

Does it require independent audit/history?
```

---

# 132. Entity Rejection Rule

If the only argument is:

```text id="bi9l87"
"future businesses might need it"
```

default:

```text id="ur402c"
DEFER
```

---

# 133. Capability Introduction Gate

A capability can be implemented without a new entity.

Examples:

```text id="oz93wa"
Work Order
→ generated artifact

Morning Briefing
→ read projection

Vendor recommendation
→ JARVIS Skill

payment reminder
→ automation
```

This distinction prevents schema inflation.

---

# 134. Domain Promotion Flow

Canonical:

```text id="8j8j9a"
BUSINESS NEED
     ↓
REPEATED REAL USE
     ↓
CAPABILITY GAP
     ↓
DOMAIN ANALYSIS
     ↓
DO WE NEED NEW ENTITY?
     ↓
NO ─────────► Tool / View / Workflow / Artifact
YES
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

# 135. TeeStock Is Requirement Reservoir

TeeStock's extensive data model should be interpreted as:

```text id="5gj15h"
future business capability map
```

not automatic database backlog.

---

# 136. Why TeeStock Documentation Is Valuable

It reveals future pressures early:

```text id="k3aqvb"
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

Avoid hardcoding:

```text id="s1ycfu"
TeeStock-only apparel logic
```

into shared MGBOS core unless architecture proves it belongs there.

---

# 138. Business-Specific Extensions

Apparel-specific data may live in:

```text id="7p9ju4"
requirement schema

domain extension

TeeStock application layer
```

while generic concepts remain shared.

---

# 139. Example

Generic:

```text id="cg489e"
Requirement

Quote

Order

Production Job
```

TeeStock-specific:

```text id="fa611t"
garment fabric

GSM

print placement

print dimensions

color breakdown
```

---

# 140. No Giant Universal Schema

Avoid adding columns such as:

```text id="xj6fux"
gsm

ink_type

embroidery_thread

paper_size

lamination
```

to generic MGBOS Order.

Use governed domain specifications.

---

# 141. Shared Domain Test

A concept belongs in shared MGBOS when it:

```text id="jl8yom"
has stable semantics

appears across multiple workflows/businesses

requires central integrity

benefits from canonical identity
```

---

# 142. TeeStock Extension Test

Keep business-specific when:

```text id="nro5wd"
meaning is apparel-specific

lifecycle remains inside TeeStock

no shared integrity requirement exists.
```

---

# 143. JARVIS Ownership Test

Capability belongs primarily to JARVIS when its output is:

```text id="2v0oyw"
interpretation

recommendation

ranking

summary

draft

prediction
```

rather than business fact.

---

# 144. Automation Ownership Test

Capability belongs to deterministic automation when it is:

```text id="61e4nd"
triggered

repeatable

low ambiguity

rule-defined.
```

---

# 145. Provider Ownership Test

Provider remains owner when fact exists only inside the external system, such as:

```text id="t4cc14"
courier scan

provider transaction acknowledgment

GitHub CI run
```

---

# 146. Founder Burden Mapping

Near-term capability → burden removed:

| Capability                 | Founder burden removed               |
| -------------------------- | ------------------------------------ |
| Lead capture               | copy/register inquiry manually       |
| Requirement structure      | remembering missing customer data    |
| Quote engine               | repeated pricing preparation         |
| Vendor capability registry | remembering who can produce what     |
| Work Order artifact        | production coordination through chat |
| Exception tracking         | manually searching for problems      |
| Cash/AR view               | manually reconciling finance status  |
| Production risk view       | checking every job individually      |
| Reminder automation        | remembering follow-ups/deadlines     |
| Morning Briefing           | opening many systems every morning   |

---

# 147. Highest-Leverage Missing Capability

From the TeeStock + Solo-Founder audit:

```text id="1zzj3k"
OPERATIONAL EXCEPTION MANAGEMENT
```

is likely more valuable near-term than Opportunity, Project, Creator, or Catalog abstractions.

---

# 148. Why

Current MGBOS knows:

```text id="r72jyh"
states
```

but founder needs:

```text id="2ci0sl"
what is abnormal right now?
```

---

# 149. Second Highest-Leverage Gap

```text id="8m0fzv"
FOUNDER READ MODELS
```

Examples:

```text id="vsa9zc"
Sales attention

Production attention

Cash attention

Order health

Vendor attention
```

---

# 150. Third High-Leverage Gap

```text id="hecqdw"
VENDOR CAPABILITY / ROUTING KNOWLEDGE
```

because partner production is central to TeeStock's asset-light model.

---

# 151. Fourth High-Leverage Gap

```text id="nnvx1u"
WORK ORDER COMMUNICATION
```

because outsourced production must leave founder chat/memory.

---

# 152. Capability Order Recommendation

Before adding Opportunity/Project/Product:

```text id="o6n0y7"
1. Harden current spine

2. Add Exception capability

3. Add founder read models

4. Add vendor capability information

5. Generate Work Orders

6. Automate routine reminders

7. Add JARVIS read intelligence
```

---

# 153. Opportunity Revisit

After real lead volume exists, measure:

```text id="ul3051"
How many qualified leads require multiple quote cycles?

How many active pursuits need pipeline tracking independent of Lead?

Does Lead → Requirement → Quote become confusing?
```

Then decide.

---

# 154. Project Revisit

After real custom jobs exist, measure:

```text id="l90qv7"
How often does one engagement span multiple Orders?

Do we need milestones independent of Order?

Do we need one coordination umbrella?
```

Then decide.

---

# 155. Product Domain Revisit

After commerce scope is locked:

```text id="jk1ysx"
How many reusable standardized products/SKUs launch?

Do inventory and channels need stable shared Product identity?
```

Then decide.

---

# 156. Creator Domain Revisit

After creator pilot:

```text id="v57gug"
Are creator earnings recurring?

Are manual calculations becoming risky?

Do agreements/royalties require durable lifecycle?
```

Then decide.

---

# 157. Architecture Debt We Should Fix

Some active TeeStock documents currently define simplified state vocabularies for entities owned by MGBOS.

Rule:

```text id="8ia7z3"
MGBOS canonical state machines win.
```

TeeStock documents should eventually reference them.

---

# 158. Roadmap Shorthand Is Allowed

TeeStock may write:

```text id="qkw8nx"
"Lead → Quote → Order → Production"
```

as business shorthand.

It should not define competing database state machines.

---

# 159. Q4 Roadmap Reconciliation

TeeStock Q4 currently asks for:

```text id="m3c8gd"
Opportunity

Project

Work Order

Customer Case

Exception
```

This Domain Map refines that into:

```text id="pyd3jh"
Opportunity
→ defer pending evidence

Project
→ defer pending complexity

Work Order
→ next as artifact/projection first

Customer Case
→ next-lite

Operational Exception
→ next/high priority
```

---

# 160. This Is Not Rejecting TeeStock Roadmap

It is applying:

```text id="wq9g0e"
BUILD CAPABILITY
BEFORE COMPLEXITY
```

from TeeStock's own operating principles.

---

# 161. Q4 Core Target Remains

```text id="d1rgfm"
LEAD-TO-CASH
+
ORDER-TO-FULFILLMENT
```

---

# 162. Canonical Q4 Spine

Recommended actual system spine:

```text id="r89s1m"
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

Alongside:

```text id="gybd08"
EXCEPTION
```

as cross-cutting attention mechanism.

---

# 163. Founder View

Derived read model:

```text id="hx50hk"
TODAY
├── Leads requiring action
├── Quotes awaiting customer
├── Orders blocked
├── Payment issues
├── Production at risk
├── QC failures
├── Shipments late
└── Margin exceptions
```

---

# 164. JARVIS View

JARVIS consumes that reality:

```text id="d90s16"
"3 items need your attention."
```

It does not reconstruct truth from raw chat/history.

---

# 165. Near-Term Domain Development Freeze

Until operating spine is validated:

```text id="8dbsmb"
DO NOT IMPLEMENT
```

unless evidence forces it:

```text id="vbz9ph"
Opportunity

generic Project

full Product/Catalog

Creator/Royalty

Affiliate

Marketing Campaign domain

generic Partner super-domain

advanced BOM/Recipe
```

---

# 166. Exception to Freeze

A deferred domain may be promoted immediately if:

```text id="cgcs7q"
real launch blocker

integrity risk

founder burden cannot otherwise be addressed

business model explicitly requires it.
```

---

# 167. Definition of Done — Core Spine

Before expanding domains:

```text id="c1sdsd"
one synthetic lead
can flow end-to-end

one quote can be accepted

one order can be tracked

one payment can be recorded

one production job can be assigned

one QC result can be captured

one shipment can complete

one actual margin can be inspected
```

---

# 168. Definition of Done — Founder Leverage

System can answer:

```text id="xfm3fb"
What needs action?

What is late?

What is blocked?

What is unpaid?

What is risky?

What needs Rizky?
```

without manual database investigation.

---

# 169. Definition of Done — Partner Coordination

For a real outsourced job:

```text id="6y3upx"
partner

scope

specification

deadline

rate basis

acknowledgement

status

QC
```

are system-visible.

---

# 170. Definition of Done — Automation

At least selected routine operations no longer require founder memory.

Examples:

```text id="xw2anj"
quote follow-up

payment reminder

production deadline alert

shipment notification
```

---

# 171. Definition of Done — JARVIS Lite

JARVIS can read:

```text id="q4t8zv"
trusted MGBOS projections
```

and produce:

```text id="0a7u3p"
business briefing

exception summary

recommendation
```

without mutation.

---

# 172. Current Capability Heatmap

```text id="x81ycj"
                    NOW      NEXT      LATER

Customer             ███
Lead                 ███
Requirement          ███
Quote                ███
Order                ██▒
Payment              ███
Production           ███
Vendor               ███
QC                   ███
Inventory            ███
Procurement          ███
Shipment             ███

Exception                      ███
Customer Case                  ██▒
Vendor Capability              ██▒
Founder Read Models            ███
Work Order Artifact            ███
Automation                     ██▒
JARVIS Lite                    ██▒

Opportunity                              ▒
Project                                  ▒
Product/Catalog                          ▒
Returns                                  ▒
Creator                                  ▒
Royalty                                  ▒
Affiliate                                ▒
Advanced Partner                         ▒
BOM / Recipe                             ▒
```

---

# 173. Architectural Invariants

1. MGBOS grows from demonstrated operational need.
2. TeeStock business documentation does not automatically define MGBOS schema.
3. CURRENT means materially implemented in active MGBOS.
4. Future concepts are not represented as current truth.
5. A capability does not always require a new root entity.
6. Existing aggregates should be reused before creating new ones.
7. Lead → Requirement → Quote is sufficient until Opportunity proves necessary.
8. Order + Production Jobs are sufficient until Project proves necessary.
9. Work Order should begin as governed operational artifact unless independent lifecycle proves necessary.
10. Vendor is sufficient for physical production partners until broader Partner abstraction proves necessary.
11. Full Product/Variant/SKU domain is not required for custom-service operations.
12. Product domain becomes important when repeatable commerce requires stable product identity.
13. Creator/Royalty infrastructure is deferred until real creator economics exist.
14. Business exceptions deserve explicit persistent representation.
15. Exceptions do not replace domain state.
16. Customer cases and internal operational exceptions remain conceptually separate.
17. Founder read models are projections, not sources of truth.
18. JARVIS recommendations are not transactional truth.
19. Automation cannot own business state.
20. External provider facts require internal interpretation.
21. Physical reality requires observation/evidence.
22. Business-specific specifications should not pollute shared schemas unnecessarily.
23. Generic shared abstractions require stable cross-workflow meaning.
24. Domain complexity must earn itself through operating leverage.
25. The Q4 operating spine takes precedence over speculative platform breadth.

---

# 174. Canonical Domain Model

```text id="9o7wiw"
                     BUSINESS LAYER
                         TeeStock
                            │
              requirements / policies
                            │
                            ▼
                         MGBOS
             authoritative operating truth
                            │
       ┌────────────────────┼─────────────────────┐
       │                    │                     │
       ▼                    ▼                     ▼
    CURRENT              NEXT                 DEFERRED
 Customer             Exception             Opportunity
 Lead                 Read Models           Project
 Requirement          Vendor Capability     Product/Catalog
 Quote                Work Order            Creator/Royalty
 Order                Customer Case Lite    Affiliate
 Payment                                    Advanced Partner
 Production                                 BOM/Recipe
 QC
 Shipment
 Inventory
 Procurement
       │
       └────────────────────┬─────────────────────┘
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

# 175. Implementation North Star

The next question is no longer:

> **“Apa lagi entity TeeStock yang bisa kita masukkan?”**

It becomes:

> **“Dengan domain yang sudah ada, bisakah satu order nyata berjalan end-to-end tanpa Rizky menjadi manual router?”**

If the answer is:

```text id="cwb56s"
NO
```

fix the spine first.

If:

```text id="g5iqkj"
YES
```

then expand based on actual bottlenecks.

---

# 176. Final Principle

> **MGBOS should be exactly as complex as necessary to keep the business simple for the founder.**

The wrong direction:

```text id="jlvbg3"
TEEStock has 80 future concepts
        ↓
build 80 entities
        ↓
huge ERP
        ↓
solo founder maintains software
instead of business
```

The desired direction:

```text id="arobq0"
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
