---
title: "TeeStock Capability Roadmap"
date: "2026-09-28"
bisnis: teestock
kategori: catatan
status: active
tags:
  - bisnis/teestock
  - kategori/catatan
  - teestock/canonical
  - teestock/roadmap
document_id: "TS-RDM-002"
canonical_id: teestock.roadmap.capability-roadmap
schema_version: "1.0"
document_class: canonical-capability-maturity-roadmap
owner: "Founder / Owner"
author: "ChatGPT / Head Engineering — Capability Roadmap Reconciliation"
approver: "Founder / Owner (DEC-TS-2026-012 strategic direction)"
scope: teestock-capability-maturity-evidence-and-curated-first-priority
primary_business_positioning: CURATED_DESIGN_APPAREL
primary_commerce_line: TEESTOCK_SELECTS
supporting_commerce_line: TEESTOCK_ESSENTIALS
originals_relation: SEPARATELY_GOVERNED_OWNED_IP
services_relation: SECONDARY_CONDITIONAL
four_business_domains: RETAINED
mgbos_validation_pilot_cohort: BUSINESS_CUSTOM_UNCHANGED
mgbos_pilot_execution_authorization: NONE
maturity_scale: L0_TO_L5_UNCHANGED
maturity_upgrade_from_documentation: NONE
checkout_activation: NOT_AUTHORIZED_BY_THIS_DOCUMENT
payment_activation: NOT_AUTHORIZED_BY_THIS_DOCUMENT
production_readiness_claim: NONE
implementation_authorization: NONE
deployment_authorization: NONE
merge_authorization: NONE
reconciles_decisions:
  - DEC-TS-2026-009
  - DEC-TS-2026-011
  - DEC-TS-2026-012
source_control:
  repository: Rizkybuilds/bisnishub
  pull_request: 85
  inspected_head: 03f1008ffdc2be68f9c1552a999291a68f376e64
  source_blob_sha: 595085adfb60e53bdd071a7ba905d3f9483bb0c6
  source_version: "1.0"
  inspected_on: "2026-10-21"
supersedes: "TS-RDM-002@1.0"
version: "2.0"
category: "roadmap"
business: "teestock"
last_updated: "2026-10-21"
path: "14-roadmap/capability-roadmap.md"
depends_on:
  - "TS-RDM-001"
  - "TS-OPS-001"
  - "TS-FIN-001"
  - "TS-MKT-001"
  - "TS-TEC-001"
  - "TS-TEC-006"
  - "TS-DAT-001"
  - "TS-DAT-005"
  - "TS-MET-001"
  - "TS-MET-003"
---


# TeeStock Capability Roadmap v2.0

> [!abstract] **Canonical TeeStock Business Capability Maturity, Gap Assessment & Build-Sequence Framework**
>
> [!info] **Dependencies & Data Flow (SSOT)**
> [[bisnis/teestock/14-roadmap/master-roadmap|TS-RDM-001: TeeStock Master Roadmap]] • [[bisnis/teestock/07-operations/operating-model|TS-OPS-001: TeeStock Operating Model]] • [[bisnis/teestock/08-finance/financial-model|TS-FIN-001: TeeStock Financial Model]] • [[bisnis/teestock/09-marketing/go-to-market|TS-MKT-001: TeeStock Go-To-Market Strategy]] • [[bisnis/teestock/10-product-tech/digital-product-vision|TS-TEC-001: TeeStock Digital Product Vision]] • [[bisnis/teestock/10-product-tech/automation-architecture|TS-TEC-006: TeeStock Automation Architecture]] • [[bisnis/teestock/11-data-mgbos/canonical-data-model|TS-DAT-001: TeeStock Canonical Data Model]] • [[bisnis/teestock/11-data-mgbos/mgbos-integration|TS-DAT-005: TeeStock MGBOS Integration]] • [[bisnis/teestock/13-metrics-experiments/kpi-framework|TS-MET-001: TeeStock KPI Framework]] • [[bisnis/teestock/13-metrics-experiments/decision-thresholds|TS-MET-003: TeeStock Decision Thresholds]]


Dokumen ini menerjemahkan TeeStock Master Roadmap menjadi maturity architecture per capability sehingga TeeStock dapat menentukan secara objektif:

- capability apa yang sudah benar-benar ada,
- capability apa yang baru ada sebagai dokumentasi,
- capability apa yang belum terbukti,
- capability apa yang menjadi bottleneck,
- apa yang harus dibangun berikutnya,
- dan apa yang sengaja belum boleh dibangun.

---

# 1. Purpose

> [!important] **Owner decision precedence (DEC-TS-2026-012).** TeeStock is strategically a curated-design apparel business led by TeeStock Selects. This capability roadmap must not make Services the master-brand priority simply because Business/Custom remains the deliberately bounded DEC-TS-2026-009 MGBOS operating-spine validation cohort. Distinguish (A) product/market prioritization, (B) capability maturity supported by evidence, and (C) authorized technical pilot sequence. DEC-TS-2026-011 retains retail-first public presentation, NOT live checkout authorization.

Capability Roadmap menjawab:

> **Seberapa matang setiap kemampuan bisnis TeeStock sekarang, bukti apa yang diperlukan untuk naik level, dan capability apa yang harus dibangun berikutnya sebelum bisnis menambah kompleksitas?**

Canonical principle:

> **Capability maturity is proven by repeatable outcomes—not by documents, software screens, or architecture diagrams.**

---

# 2. Canonical Definition

> **TeeStock Capability Roadmap adalah maturity framework yang mengukur kemampuan bisnis TeeStock berdasarkan repeatability, process control, data quality, systemization, integration, automation, governance, and business outcomes, lalu menghubungkan capability gaps tersebut dengan execution priorities dan maturity gates.**

---

# 3. Capability ≠ Feature

Canonical:

```text
FEATURE
=
something the software can do.

CAPABILITY
=
something the business can reliably achieve.
```

---

# 4. Example

TeeStock dapat memiliki:

```text
Partner Dashboard
```

tetapi belum memiliki mature:

```text
PARTNER MANAGEMENT CAPABILITY
```

jika:

```text
CAPABILITY DATA incomplete
RATE DATA unreliable
QUALITY not measured
WORK ORDERS inconsistent
```

---

# 5. Documentation ≠ Operational Maturity

**Maturity truth:** new PRDs, better IA, demo cart/checkout, CI PASS, proposed IP sourcing and a researched collection are NOT real business operations. The following capability levels are historical provisional assessments, not automatically refreshed measurements or current live production readiness.

Critical:

```text
CANONICAL DOCUMENTATION
may be Level 4–5

while

ACTUAL BUSINESS EXECUTION
may still be Level 0–1.
```

---

# 6. TeeStock Current Strategic Condition

Based on current architecture work:

```text
BUSINESS DESIGN
very advanced

CANONICAL ARCHITECTURE
very advanced

OPERATIONAL VALIDATION
early

DIGITAL EXECUTION
early / partial

AUTOMATION
early

AI OPERATING AUTHORITY
not yet appropriate
```

---

# 7. Current-State Classification

Current ratings in this document are:

```text
PROVISIONAL
```

until validated through:

```text
REAL ORDERS
REAL CUSTOMERS
REAL COSTS
REAL PARTNERS
REAL CASH
REAL OPERATING DATA
```

---

# 8. Capability Maturity Scale

**Scale invariant:** keep the existing L0–L5 scale unchanged. Brand/product priority, functional prototype completion, research progress and operational maturity must be represented separately; none upgrades the maturity level without the required concrete business evidence and independent acceptance.

Canonical:

```text
L0 — AD HOC
L1 — REPEATABLE MANUAL
L2 — STANDARDIZED
L3 — SYSTEMIZED
L4 — INTEGRATED / AUTOMATED
L5 — INTELLIGENT / AGENTIC
```

---

# 9. Level 0 — Ad Hoc

Characteristics:

```text
FOUNDER MEMORY
CHAT
SPREADSHEET FRAGMENTS
MANUAL DECISIONS
INCONSISTENT PROCESS
```

---

# 10. Level 1 — Repeatable Manual

Characteristics:

```text
REAL WORK EXISTS
BASIC RECORDS
REPEATED PROCESS
DEFINED OWNER
MANUAL CONTROL
```

---

# 11. Level 2 — Standardized

Characteristics:

```text
SOP
CANONICAL STATUS
STANDARD INPUT
STANDARD OUTPUT
BASIC KPI
```

---

# 12. Level 3 — Systemized

Characteristics:

```text
CANONICAL APPLICATION
STRUCTURED DATA
VALIDATIONS
WORK QUEUES
PERMISSIONS
AUDIT
```

---

# 13. Level 4 — Integrated / Automated

Characteristics:

```text
EVENTS
INTEGRATIONS
AUTOMATION
RECONCILIATION
EXCEPTION MANAGEMENT
```

---

# 14. Level 5 — Intelligent / Agentic

Characteristics:

```text
AI ASSISTANCE
PREDICTION
BOUNDED AGENTS
POLICY-GOVERNED AUTONOMY
HUMAN EXCEPTION MANAGEMENT
```

---

# 15. Maturity Rule

Canonical:

> **A capability cannot skip foundational maturity simply because better software exists.**

---

# 16. Example

Installing an ERP does not move Procurement from:

```text
L0 → L3
```

if procurement rules and data are still chaotic.

---

# 17. Capability Domains

Canonical TeeStock capability map:

```text
01. Strategy & Governance
02. Sales / CRM
03. Commerce
04. Product & Merchandising
05. Services / Project Delivery
06. Production
07. Partner / Supplier Management
08. Inventory
09. Fulfillment
10. Customer Service
11. Finance & Treasury
12. Marketing & Retention
13. Creator Ecosystem
14. Originals / IP Development
15. Legal / IP Governance
16. Data & Analytics
17. MGBOS
18. Automation
19. AI / Jarvis
20. Security & Access
21. Infrastructure / Reliability
22. Organization & Delegation
```

---

# 18. Capability Portfolio View

**Provisional scorecard interpretation:** all current/target levels in the historical table are planning classifications captured in the v1.0 document, not freshly audited current capability. Do NOT promote Commerce, Product, Services, MGBOS, Legal/IP or Finance from repo changes alone. The evidence ledger in §303 governs any future reassessment by its owning reviewers.

Initial provisional classification:

| Capability | Current | Near-Term Target |
|---|---:|---:|
| Strategy & Governance | L2 | L3 |
| Sales / CRM | L1 | L2 |
| Commerce | L0–L1 | L2 |
| Product & Merchandising | L1 | L2 |
| Services / Project Delivery | L1 | L2 |
| Production | L1 | L2 |
| Partner Management | L1 | L2 |
| Inventory | L0 | L1 |
| Fulfillment | L1 | L2 |
| Customer Service | L0–L1 | L2 |
| Finance & Treasury | L0–L1 | L2 |
| Marketing & Retention | L0–L1 | L2 |
| Creator Ecosystem | L0 | L1 |
| Originals / IP Development | L0 | L1 |
| Legal / IP Governance | L1 | L2 |
| Data & Analytics | L1 | L2 |
| MGBOS | L0–L1 | L2 |
| Automation | L1 | L2 |
| AI / Jarvis | L0–L1 | L1 |
| Security & Access | L0–L1 | L2 |
| Infrastructure | L0–L1 | L2 |
| Organization & Delegation | L0–L1 | L1–L2 |

---

# 19. Interpretation

The table means:

```text
ARCHITECTURE
is ahead of

OPERATING CAPABILITY.
```

That is acceptable.

The next phase should close that gap.

---

# 20. Capability 01 — Strategy & Governance

## Current State

```text
PROVISIONAL L2
```

Why:

TeeStock already has:

```text
BUSINESS THESIS
BUSINESS MODEL
BRAND ARCHITECTURE
BUSINESS LINES
FINANCE PRINCIPLES
TECH ARCHITECTURE
DATA MODEL
LEGAL FRAMEWORK
KPI FRAMEWORK
ROADMAP
```

---

# 21. Strategy L3 Definition

To reach L3:

strategy must drive actual:

```text
BUDGET
PRIORITY
PROJECT
BUILD DECISIONS
```

---

# 22. Strategy L3 Evidence

Required:

```text
DECISION REGISTER USED
QUARTERLY PRIORITIES
ACTIVE ROADMAP
DEFERRED LIST
BUDGET ALIGNMENT
```

---

# 23. Strategy Next Build

```text
CURRENT QUARTER PLAN
+
DECISION REGISTER
+
MONTHLY OPERATING REVIEW
```

---

# 24. Strategy Do Not Build Yet

Avoid:

```text
ENTERPRISE PMO
COMPLEX OKR SOFTWARE
PORTFOLIO PLATFORM
```

---

# 25. Capability 02 — Sales / CRM

## Current State

```text
L1
```

Evidence already exists:

```text
LEAD FORM
QUALIFICATION RULE
DECISION ENGINE
QUALIFIED / NOT_QUALIFIED
```

---

# 26. Sales L2 Definition

Need standardized:

```text
LEAD
QUALIFICATION
OPPORTUNITY
QUOTE
FOLLOW-UP
WON / LOST
```

---

# 27. Sales L2 Evidence

```text
100% leads recorded
lead owner known
qualification consistent
quotes versioned
follow-up tracked
won/lost reason captured
```

---

# 28. Sales L2 Next Build

Priority:

```text
LEAD REGISTRY
OPPORTUNITY
QUOTE
FOLLOW-UP TASK
PIPELINE VIEW
```

---

# 29. Sales L3

Later:

```text
MGBOS CRM
automated follow-up
quote generation
customer 360
```

---

# 30. Sales Do Not Build Yet

Avoid:

```text
AI AUTONOMOUS SALES CLOSER
ADVANCED LEAD SCORING ML
ENTERPRISE CRM INTEGRATION
```

---

# 31. Capability 03 — Commerce

**Primary Commerce intent:** TeeStock Selects and rights-cleared design/product discovery are the priority consumer proposition under DEC-012. The historical L0–L1 Commerce state remains an unverified, provisional operational rating. Successful non-transactional discovery can count as research evidence, NEVER as real retail-order, payment or fulfillment maturity.

## Current State

```text
L0–L1
```

Architecture is mature.

Operational commerce must still be proven.

---

# 32. Commerce L1 Definition

**Strict transactional maturity boundary:** retain the historic Commerce L1 real-customer Product → Cart/Order → Payment → Fulfillment threshold; rights-cleared design exploration, customer interviews, non-payment interest capture, synthetic demo purchase and CI cannot satisfy this definition. Early discovery is a separately authorized product learning activity, not a downgraded Commerce L1 requirement.

Must reliably execute:

```text
PRODUCT
↓
CART / ORDER
↓
PAYMENT
↓
FULFILLMENT
```

for real customers.

---

# 33. Commerce L1 Evidence

**Required evidence provenance:** Commerce L1 proof must link to genuine permitted orders, actual payment records and reconciled fulfillment/customer support evidence under relevant finance/operations authority, with correct cohort, environment, consent and organization isolation. A concept/mockup, screenshot or staged fixture is insufficient.

```text
REAL PRODUCT
REAL ORDER
REAL PAYMENT
REAL SHIPMENT
REAL RETURN / SUPPORT CASE where applicable
```

---

# 34. Commerce L2 Definition

**L2 gate:** standardized catalog, price, availability-to-sell (ATS), order/payment states and return rules require implemented operational evidence, governed definitions and repeatable execution; accepted documentation alone does not prove this higher level.

Standardized:

```text
CATALOG
PRICE
ATS
ORDER STATES
PAYMENT STATES
RETURN RULE
```

---

# 35. Commerce L2 Next Build

**Two distinct next slices:** (A) *near-term TeeStock product focus*: smallest lawful, non-transactional curated Selects collection/PDP discovery, verified artwork/media rights, actual garment/spec and consented user learning where approved; (B) *future transactional Commerce L1/L2 validation*: complete real product → cart/order → payment → fulfillment only after explicit legal, QC, finance, security, inventory/capacity, support and release gates. The historic checkout flow below means slice B only.

```text
ONE COMPLETE COMMERCE VERTICAL SLICE
```

Recommended:

```text
ONE PRODUCT
↓
PRODUCT PAGE
↓
CHECKOUT
↓
PAYMENT
↓
ORDER
↓
FULFILLMENT
```

---

# 36. Commerce L3

Later:

```text
CANONICAL COMMERCE ENGINE
MULTI-CHANNEL
PROMOTION ENGINE
RETURN SELF-SERVICE
```

---

# 37. Commerce Do Not Build Yet

Avoid:

```text
ADVANCED PERSONALIZATION
AI MERCHANDISING
MULTI-COUNTRY STORE
COMPLEX LOYALTY ENGINE
```

---

# 38. Capability 04 — Product & Merchandising

**Product-capability split:** real garment, design provenance, variants, SKU, channel presentation and editorial collections are distinct; no right to publish, offer sale, promise stock or claim QC follows automatically from a conceptual product model. L1 shown here is an old provisional classification; confirm actual evidence before representing it as current.

## Current State

```text
L1
```

Canonical architecture exists for:

```text
PRODUCT
VARIANT
SKU
COLLECTION
LABEL
```

---

# 39. Product L2 Definition

**Sellable-product contract remains conditional:** if the rights/price/availability/order gates have not passed, a rights-cleared informational design/garment page may still be a legitimate *non-transactional* discovery outcome, but it is NOT a sellable SKU, nor evidence that Product L2 has been achieved.

Every sellable item must have:

```text
CANONICAL PRODUCT
VARIANT
SKU
PRICE
COST
FULFILLMENT MODE
```

---

# 40. Product L2 Evidence

**Product maturity evidence:** require reconciled source-of-truth references for licensed artwork, specific commercial usage rights, supplier/sample details, truthful variants and canonical price/cost authority. Planned combinations do not count as stocked SKUs; mockups cannot substitute for QC.

```text
no duplicate SKU logic
product ownership clear
price source known
cost source known
product lifecycle status used
```

---

# 41. Product Next Build

**Smallest justified build:** defer complex SKU registries and price-book systems unless their actual owner and evidence require them. Begin with a bounded real product-fact/rights-review process for Selects; implementation of root tables or MGBOS schema changes needs separate approved engineering contracts.

```text
PRODUCT MASTER
SKU REGISTRY
PRICE BOOK
COST LINKAGE
```

---

# 42. Product L3

Later:

```text
catalog management
multi-channel listing
merchandising rules
```

---

# 43. Product Do Not Build Yet

Avoid:

```text
AI AUTONOMOUS ASSORTMENT
DYNAMIC PRICING
ADVANCED RECOMMENDATION ENGINE
```

---

# 44. Capability 05 — Services / Project Delivery

**Services relationship:** Custom, Business and Merch are secondary conditional offerings, not TeeStock primary identity. The Business/Custom assisted-service cohort is retained solely as the separately governed MGBOS operational pilot under DEC-009; this text does not unblock that pilot or alter its criteria.

## Current State

```text
L1
```

Targeted revenue lines are already conceptually clear:

```text
CUSTOM
BUSINESS
MERCH
STUDIO
SUPPLY
FULFILL
```

---

# 45. Services L2 Definition

Repeatable:

```text
LEAD
↓
QUOTE
↓
APPROVAL
↓
PROJECT
↓
PRODUCTION
↓
DELIVERY
↓
ACTUAL COST
```

---

# 46. Services L2 Evidence

```text
scope documented
quote versioned
customer approval stored
cost tracked
project outcome known
```

---

# 47. Services Next Build

Recommended first:

```text
CUSTOM / BUSINESS
VERTICAL SLICE
```

---

# 48. Service Project Record

Must contain:

```text
CUSTOMER
SCOPE
QUOTE
OWNER
DUE DATE
STATUS
EXPECTED MARGIN
ACTUAL MARGIN
```

---

# 49. Services L3

Later:

```text
PROJECT MODULE
CHANGE ORDERS
B2B PORTAL
REPEAT ACCOUNT MANAGEMENT
```

---

# 50. Services Do Not Build Yet

Avoid building six sophisticated service systems simultaneously.

---

# 51. Capability 06 — Production

## Current State

```text
L1
```

Production strategy:

```text
ASSET-LIGHT PARTNER NETWORK
```

---

# 52. Production L2 Definition

Every production job must have:

```text
SPEC
WORK ORDER
OWNER
PARTNER
DUE DATE
STATUS
QC
ACTUAL COST
```

---

# 53. Production L2 Evidence

```text
jobs do not live only in chat
approved version traceable
partner responsibility known
late work visible
rework captured
```

---

# 54. Production Next Build

```text
PRODUCTION JOB
+
WORK ORDER
+
QC
```

as one integrated process.

---

# 55. Production L3

Later:

```text
capacity planning
routing
material reservation
production dashboard
```

---

# 56. Production L4

Later:

```text
event-driven routing
partner integrations
automated SLA monitoring
```

---

# 57. Production Do Not Build Yet

Avoid:

```text
MES PLATFORM
ADVANCED SCHEDULER
OWN FACTORY SOFTWARE
```

before production volume justifies it.

---

# 58. Capability 07 — Partner / Supplier Management

## Current State

```text
L1
```

Partner-network model defined.

---

# 59. Partner L2 Definition

Structured:

```text
PARTNER
SITE
CAPABILITY
RATE
LEAD TIME
QUALITY
STATUS
```

---

# 60. Partner L2 Evidence

TeeStock can answer:

```text
WHO CAN PRODUCE THIS?
AT WHAT COST?
AT WHAT QUALITY?
WITH WHAT LEAD TIME?
```

without founder memory.

---

# 61. Partner Next Build

```text
PARTNER REGISTRY
CAPABILITY REGISTRY
RATE CARD
PERFORMANCE LOG
```

---

# 62. Partner L3

Later:

```text
WORK ORDER PORTAL
CAPACITY
CLAIMS
PERFORMANCE SCORECARD
```

---

# 63. Partner L4

Later:

```text
ROUTING RECOMMENDATION
AUTOMATED SLA
INTEGRATION
```

---

# 64. Partner Do Not Build Yet

Do not build Partner Marketplace.

---

# 65. Capability 08 — Inventory

## Current State

```text
L0
```

Likely limited or asset-light inventory.

This is not a weakness yet.

---

# 66. Inventory Principle

> **Do not increase inventory-system complexity before inventory itself becomes economically material.**

---

# 67. Inventory L1 Definition

For stocked items:

```text
ON HAND
RESERVED
AVAILABLE
LOCATION
MOVEMENT
```

known reliably.

---

# 68. Inventory L1 Evidence

Physical quantity and system quantity can be reconciled.

---

# 69. Inventory Next Build

Only when stocked SKU exists:

```text
INVENTORY LEDGER
```

---

# 70. Inventory L2

Add:

```text
RECEIPTS
RESERVATIONS
ADJUSTMENTS
CYCLE COUNT
AGING
```

---

# 71. Inventory L3

Later:

```text
REORDER
SAFETY STOCK
MULTI-LOCATION
```

---

# 72. Inventory Do Not Build Yet

Avoid:

```text
WMS
RFID
DEMAND FORECAST ENGINE
```

prematurely.

---

# 73. Capability 09 — Fulfillment

## Current State

```text
L1
```

---

# 74. Fulfillment L2 Definition

Standard:

```text
READY
↓
PICK
↓
PACK
↓
SHIP
↓
DELIVER
```

---

# 75. Fulfillment L2 Evidence

```text
shipment traceable
packing errors captured
tracking linked
delivery state known
```

---

# 76. Fulfillment Next Build

```text
FULFILLMENT RECORD
SHIPMENT
TRACKING
PACKING CHECK
```

---

# 77. Fulfillment L3

Later:

```text
carrier integration
automated labels
returns processing
```

---

# 78. Fulfillment Commercial Service Gate

Do not aggressively sell TeeStock Fulfill externally until internal fulfillment is consistently reliable.

---

# 79. Capability 10 — Customer Service

## Current State

```text
L0–L1
```

---

# 80. Customer Service L1

Every material issue receives identifiable record.

---

# 81. Customer Service L2

Standard:

```text
CASE
CATEGORY
OWNER
PRIORITY
STATUS
RESOLUTION
ROOT CAUSE
```

---

# 82. Customer Service L2 Evidence

TeeStock can answer:

```text
WHAT ARE CUSTOMERS COMPLAINING ABOUT?
HOW FAST DO WE RESOLVE IT?
WHAT IS RECURRING?
```

---

# 83. Customer Service Next Build

```text
CASE REGISTRY
+
RETURN / REFUND LINKAGE
```

---

# 84. Customer Service L3

Later:

```text
self-service support
knowledge base
SLA
```

---

# 85. Customer Service L4–L5

Later:

```text
AI classification
AI policy explanation
low-risk support automation
```

---

# 86. Customer Service Do Not Build Yet

Avoid full AI chatbot as primary support before policy/state data is reliable.

---

# 87. Capability 11 — Finance & Treasury

## Current State

```text
L0–L1
```

Documentation is advanced.

Operational finance must now become real.

---

# 88. Finance L1 Definition

Every transaction can identify:

```text
SALES
PAYMENT
DIRECT COST
CASH MOVEMENT
```

---

# 89. Finance L2 Definition

Add:

```text
CM
AR
AP
EXPECTED vs ACTUAL COST
REFUND
PAYOUT
```

---

# 90. Finance L2 Evidence

Founder can answer:

```text
HOW MUCH CASH DO WE HAVE?
WHAT DO CUSTOMERS OWE?
WHAT DO WE OWE?
WHICH ORDERS MADE MONEY?
```

---

# 91. Finance Next Build

High priority:

```text
ORDER ECONOMICS
CASH LEDGER
AR
AP
COST ENTRY
```

---

# 92. Finance L3

Later:

```text
management P&L
cost accounting
treasury envelopes
cash forecast
```

---

# 93. Finance L4

Later:

```text
accounting integration
reconciliation automation
```

---

# 94. Finance L5

Later:

```text
AI ANALYST
forecast explanation
capital-allocation support
```

---

# 95. Finance Do Not Build Yet

Avoid AI making payments or autonomously reallocating cash.

---

# 96. Capability 12 — Marketing & Retention

## Current State

```text
L0–L1
```

Strategy exists.

Repeatable execution still needs evidence.

---

# 97. Marketing L1

Consistent content/campaign execution.

---

# 98. Marketing L2

Structured:

```text
CAMPAIGN
CONTENT
CHANNEL
SOURCE
LEAD / ORDER
COST
```

---

# 99. Marketing L2 Evidence

Can answer:

```text
WHICH CONTENT GENERATES INTENT?
WHICH CHANNEL ACQUIRES CUSTOMERS?
AT WHAT COST?
```

---

# 100. Marketing Next Build

```text
CONTENT CALENDAR
CAMPAIGN ID
UTM / ATTRIBUTION
LEAD / ORDER SOURCE
```

---

# 101. Marketing L3

Later:

```text
lifecycle messaging
retention segments
cohort reporting
```

---

# 102. Marketing L4

Later:

```text
event-triggered retention
multi-channel automation
```

---

# 103. Marketing L5

Later:

```text
content agents
campaign analysis agents
```

---

# 104. Marketing Do Not Build Yet

Avoid:

```text
AI CONTENT FACTORY
```

before content positioning and feedback loop are proven.

---

# 105. Capability 13 — Creator Ecosystem

## Current State

```text
L0
```

Architecture is ready.

Operational creator network is not yet mature.

---

# 106. Creator L1

Manual creator pilot.

Canonical vertical slice:

```text
ONE CREATOR
↓
AGREEMENT
↓
ARTWORK
↓
PRODUCT
↓
SALE
↓
EARNING
↓
PAYOUT
```

---

# 107. Creator L1 Evidence

At least one creator relationship works end-to-end.

---

# 108. Creator L2

Standardize:

```text
ONBOARDING
RIGHTS
ARTWORK
PRODUCT
ROYALTY
PAYOUT
```

---

# 109. Creator Next Build

Do not start with portal.

Start with:

```text
CREATOR RECORD
AGREEMENT
ARTWORK
PRODUCT RELATIONSHIP
EARNING LEDGER
```

---

# 110. Creator L3

Only then:

```text
CREATOR DASHBOARD / PORTAL
```

---

# 111. Creator L4

Later:

```text
self-service submission
statements
campaign attribution
```

---

# 112. Creator L5

Later:

```text
AI creator support
AI merchandising recommendations
```

---

# 113. Creator Do Not Build Yet

Avoid creator marketplace/platform before manual creator economics are validated.

---

# 114. Capability 14 — Originals / IP Development

## Current State

```text
L0
```

Concept labels exist.

No mature label should be assumed yet.

---

# 115. Originals L1

Run:

```text
CONCEPT
↓
CAPSULE
↓
MARKET TEST
↓
LEARNING
```

---

# 116. Originals L1 Evidence

Real:

```text
SELL-THROUGH
CM4
CUSTOMER RESPONSE
RETURN
```

---

# 117. Originals L2

Repeatable collection framework.

---

# 118. Originals L2 Evidence

Multiple launches show repeatable learning and economics.

---

# 119. Originals L3

Validated label.

---

# 120. Originals L3 Evidence

```text
DISTINCT AUDIENCE
MULTIPLE SUCCESSFUL RELEASES
REPEAT DEMAND
POSITIVE ECONOMICS
```

---

# 121. Originals Next Build

One capsule.

Not three labels simultaneously.

---

# 122. Originals Do Not Build Yet

Avoid:

```text
MULTIPLE FULL LABELS
LARGE INVENTORY
EXPENSIVE BRAND INFRASTRUCTURE
```

before validation.

---

# 123. Capability 15 — Legal / IP Governance

**IP capability gate:** buying a digital file, receiving an AI-generated image, or paying a creator does not establish perpetual/exclusive copyright. Only specific permission for merchandise, print, sales channel, promotional use, region, duration, modifications and attribution can support an eligible use; TS-LEG-001 and governing agreements control claims.

## Current State

```text
L1
```

Strong policy architecture exists.

---

# 124. Legal/IP L2

Operationalize:

```text
IP ASSET
RIGHTS
AGREEMENT
TRADEMARK
CUSTOMER TERMS
```

records.

---

# 125. Legal/IP L2 Evidence

No commercial creative asset is published without identifiable rights basis.

---

# 126. Legal/IP Next Build

```text
RIGHTS REGISTRY
AGREEMENT REGISTRY
TRADEMARK REGISTRY
ACTIVE CUSTOMER TERMS
```

---

# 127. Legal/IP L3

Later:

```text
automated rights gates
expiry workflow
claim cases
```

---

# 128. Legal/IP Do Not Build Yet

Avoid AI legal adjudication.

---

# 129. Capability 16 — Data & Analytics

## Current State

```text
L1
```

Canonical Data Model defined.

Implementation still early.

---

# 130. Data L1

Use canonical IDs and consistent records.

---

# 131. Data L2

Canonical:

```text
ENTITIES
RELATIONSHIPS
STATUS
REPORTING VIEWS
CORE KPIs
```

implemented.

---

# 132. Data L2 Evidence

Same question gives same number regardless dashboard/user.

---

# 133. Data Next Build

```text
CANONICAL DATABASE SCHEMA
+
REPORTING VIEWS
+
CORE METRICS
```

---

# 134. Data L3

Later:

```text
event history
read models
metric registry
data-quality checks
```

---

# 135. Data L4

Later:

```text
warehouse
semantic layer
cohorts
```

---

# 136. Data L5

Later:

```text
AI semantic query
forecasting
decision intelligence
```

---

# 137. Data Do Not Build Yet

Avoid:

```text
LAKEHOUSE
FEATURE STORE
REAL-TIME ANALYTICS PLATFORM
```

---

# 138. Capability 17 — MGBOS

## Current State

```text
L0–L1
```

MGBOS architecture is deeply defined.

Operating product still needs implementation.

---

# 139. MGBOS L1

Basic internal control:

```text
LEADS
ORDERS
TASKS
STATUS
OWNERS
```

---

# 140. MGBOS L2

Canonical work control:

```text
TASKS
APPROVALS
EXCEPTIONS
ENTITY SEARCH
QUEUES
```

---

# 141. MGBOS L2 Evidence

Operators no longer need several disconnected spreadsheets/chat threads to know what needs action.

---

# 142. MGBOS Next Build

Recommended first vertical slice:

```text
LEAD
↓
QUOTE
↓
ORDER / PROJECT
↓
PRODUCTION JOB
↓
WORK ORDER
↓
QC
↓
FULFILLMENT
↓
COST
```

---

# 143. MGBOS L3

Later:

```text
cross-domain read models
dashboards
permissions
audit
```

---

# 144. MGBOS L4

Later:

```text
events
integration health
reconciliation
workflow orchestration
```

---

# 145. MGBOS L5

Later:

```text
Jarvis control plane
agent supervision
decision intelligence
```

---

# 146. MGBOS Do Not Build Yet

Avoid trying to implement every documented module simultaneously.

---

# 147. Capability 18 — Automation

## Current State

```text
L1
```

Because lead qualification Decision Engine has already been built and tested.

---

# 148. Automation L1

Isolated workflow automation.

---

# 149. Automation L2

Standardized registry:

```text
AUTOMATION ID
TRIGGER
OWNER
ACTION
STATUS
ERROR
```

---

# 150. Automation L2 Evidence

Critical workflows:

```text
IDEMPOTENT
MONITORED
RETRYABLE
RECOVERABLE
```

where necessary.

---

# 151. Automation Next Build

Expand from lead qualification to:

```text
FOLLOW-UP
ORDER NOTIFICATION
WORK ORDER
AR REMINDER
```

only after processes stabilize.

---

# 152. Automation L3

Later:

```text
event-driven workflows
approval integration
exception queue
```

---

# 153. Automation L4

Later:

```text
queue workers
reconciliation
cross-system orchestration
```

---

# 154. Automation L5

Bounded agent execution.

---

# 155. Automation Do Not Build Yet

Avoid automating:

```text
UNSTABLE PROCESSES
AMBIGUOUS PRICING
UNKNOWN FINANCIAL RULES
```

---

# 156. Capability 19 — AI / Jarvis

## Current State

```text
L0–L1
```

AI architecture and future roles are defined.

Operational agent fabric does not yet exist.

---

# 157. AI L1

Use AI manually as:

```text
RESEARCH
DRAFT
SUMMARY
ANALYSIS
```

---

# 158. AI L2

Domain copilots with governed data access.

---

# 159. AI L2 Requires

```text
TOOLS
READ MODELS
POLICIES
PERMISSIONS
EVALS
```

---

# 160. AI L3

Specialist agents:

```text
SALES
OPS
CONTENT
FINANCE
```

with bounded tasks.

---

# 161. AI L4

Low-risk execution.

---

# 162. AI L5

Exception-based autonomy with Jarvis orchestration.

---

# 163. AI Next Build

Not autonomous agents.

First:

```text
READ-ONLY BUSINESS ASSISTANT
```

capable of:

```text
SEARCH
SUMMARIZE
RECOMMEND
```

once canonical data exists.

---

# 164. First AI Vertical Slice

Recommended:

```text
LEAD
+
CUSTOMER / BUSINESS CONTEXT
↓
AI SUMMARY
↓
NEXT-ACTION RECOMMENDATION
↓
HUMAN
```

---

# 165. AI Do Not Build Yet

Avoid:

```text
AI CASH AUTHORITY
AI CONTRACT SIGNING
AI PRICING OVERRIDE
MULTI-AGENT SWARM
```

---

# 166. Capability 20 — Security & Access

## Current State

```text
L0–L1
```

---

# 167. Security L1

Minimum:

```text
UNIQUE ACCOUNTS
STRONG AUTH
BACKUP
ENV SEPARATION
```

---

# 168. Security L2

Add:

```text
ROLE-BASED ACCESS
SERVICE ACCOUNTS
SECRETS MANAGEMENT
AUDIT
```

---

# 169. Security Next Build

Before production MGBOS:

```text
AUTHENTICATION
AUTHORIZATION
SECRET STORAGE
BACKUP
```

---

# 170. Security L3

Later:

```text
SSO
security logs
sensitive-data classification
```

---

# 171. Security L4–L5

Later:

```text
automated detection
agent permission fabric
```

---

# 172. Security Do Not Build Yet

Avoid enterprise-security complexity unsupported by actual scale.

But never skip baseline controls.

---

# 173. Capability 21 — Infrastructure / Reliability

## Current State

```text
L0–L1
```

---

# 174. Infrastructure L1

Production runs on reliable managed environment.

---

# 175. Infrastructure L2

Need:

```text
MANAGED DB
BACKUP
OBJECT STORAGE
LOGGING
ENVIRONMENTS
```

---

# 176. Infrastructure Next Build

Recommended early topology:

```text
WEB APP / API
+
POSTGRESQL
+
OBJECT STORAGE
+
n8n
+
BACKUP
```

---

# 177. Infrastructure L3

Add:

```text
QUEUE
WORKERS
OBSERVABILITY
RESTORE TESTS
```

---

# 178. Infrastructure L4

Later:

```text
service separation
autoscaling
high availability
```

if justified.

---

# 179. Infrastructure L5

Enterprise shared runtime across MultiGraph.

---

# 180. Infrastructure Do Not Build Yet

Avoid:

```text
KUBERNETES
SERVICE MESH
MULTI-REGION
```

unless scale forces them.

---

# 181. Capability 22 — Organization & Delegation

## Current State

```text
L0–L1
```

Founder-centric.

This is expected.

---

# 182. Organization L1

Founder has explicit responsibilities and external specialists/partners.

---

# 183. Organization L2

Repeated responsibilities become named roles.

---

# 184. Organization L2 Evidence

Work can continue without founder explaining every step.

---

# 185. Organization Next Build

Do not hire broad team first.

Identify:

```text
REPEATED BOTTLENECK
↓
ROLE
↓
SOP
↓
DELEGATION
```

---

# 186. First Hiring Logic

Potential early role:

```text
OPERATIONS / CUSTOMER OPS
```

when order volume creates founder bottleneck.

Not predetermined.

---

# 187. Organization L3

Function owners.

---

# 188. Organization L4

AI-augmented teams.

---

# 189. Organization L5

Humans primarily:

```text
STRATEGY
RELATIONSHIP
EXCEPTION
HIGH-RISK DECISION
```

while routine execution is system/agent-driven.

---

# 190. Organization Do Not Build Yet

Avoid premature hierarchy.

---

# 191. Capability Dependency Graph

**Two-lane interpretation:** SALES → ORDER → PRODUCTION → FULFILLMENT → FINANCE is the target *operating-spine* dependency chain for real orders. Selects collection/story, design discovery and customer research can proceed in a separately authorized non-transactional lane without pretending that an operational pilot has passed.

Canonical:

```text
SALES
↓
ORDER
↓
PRODUCTION
↓
FULFILLMENT
↓
FINANCE
```

forms the primary operational spine.

---

# 192. Supporting Spine

```text
PRODUCT
+
PARTNER
+
CUSTOMER
+
DATA
```

supports the primary flow.

---

# 193. Systems Spine

```text
CANONICAL DATA
↓
MGBOS
↓
AUTOMATION
↓
AI
```

---

# 194. AI Cannot Leapfrog

Canonical:

```text
AI
depends on

MGBOS
depends on

STRUCTURED DATA
depends on

STANDARDIZED PROCESS
depends on

REAL OPERATIONS.
```

---

# 195. Priority Dependency Sequence

**Scope of sequence:** the list below describes one bounded MGBOS Business/Custom operating test, not the mandatory order of *all* TeeStock strategic investments. Its legacy `Opportunity`, `Project` and `Partner` terminology does not automatically grant new MGBOS root entities, schemas, APIs, permissions or migrations.

Recommended:

```text
1. SALES / LEAD
2. QUOTE
3. ORDER / PROJECT
4. PRODUCTION
5. PARTNER
6. QC
7. FULFILLMENT
8. COST / CASH
9. CUSTOMER CASE
10. REPORTING
```

---

# 196. First Capability Cluster

**Priority interpretation update:** the historical first cluster is the operational pilot engineering cluster, not TeeStock primary consumer/product priority. Selects curation, artwork rights, garment validation and honest consumer discovery have a parallel high-priority, separately budgeted learning lane. Do not declare either lane operationally complete from architecture diagrams or tests.

Highest near-term value:

```text
SALES
SERVICES
PRODUCTION
PARTNER
FINANCE
MGBOS
```

---

# 197. Why

**Evidence non-transfer:** successful Business/Custom sales might prove service economics and operating process quality but cannot be counted as paid demand or contribution for Selects. Conversely, collection views or consented interest cannot be counted as real MGBOS order/payment maturity.

This cluster creates:

```text
REVENUE
DELIVERY
ECONOMICS
DATA
```

simultaneously.

---

# 198. Second Capability Cluster

**Commerce split:** this historic second cluster refers to *transactional* Commerce/Inventory/Fulfillment systemization after relevant release gates; it does NOT defer all curated-design discovery, rights-safe collection presentation, customer experience design or market learning. No checkout/payment activation is granted by reinterpreting the cluster.

After operational spine:

```text
COMMERCE
PRODUCT
INVENTORY
FULFILLMENT
CUSTOMER SERVICE
```

---

# 199. Third Capability Cluster

**Growth boundary:** Marketing for curated Selects can include proportionate, approved research and truthful editorial presentation before service transaction maturity. Scaled creator/program activations and Originals-owned IP still require separate legal, supply, finance and staffing gates.

After transaction foundation:

```text
MARKETING
CREATOR
ORIGINALS
PROGRAMS
```

scale more aggressively.

---

# 200. Fourth Capability Cluster

After data stability:

```text
INTEGRATION
AUTOMATION
AI
```

---

# 201. Capability Gate System

**Independent authorization gate:** actual capability tests require identified owner, environment, customer consent when relevant, valid IP/financial/security controls and evidence. A decision to prioritize Selects research does not approve an external launch or upgrade any numeric maturity score.

Every capability upgrade uses:

```text
INPUT READY?
PROCESS STABLE?
DATA RELIABLE?
OWNER CLEAR?
OUTCOME MEASURABLE?
```

---

# 202. Capability L1 Gate

Require:

```text
REAL USE
+
REPEATABILITY
```

---

# 203. Capability L2 Gate

Require:

```text
STANDARD PROCESS
+
STRUCTURED RECORD
+
OWNER
+
BASIC KPI
```

---

# 204. Capability L3 Gate

Require:

```text
SYSTEM IMPLEMENTATION
+
VALIDATION
+
PERMISSIONS
+
AUDIT
```

---

# 205. Capability L4 Gate

Require:

```text
INTEGRATION
+
AUTOMATION
+
EXCEPTION HANDLING
+
OBSERVABILITY
```

---

# 206. Capability L5 Gate

Require:

```text
AI EVALUATION
+
BOUNDED AUTHORITY
+
ESCALATION
+
SAFE AUTONOMY
```

---

# 207. Capability Evidence

**Verification granularity:** each maturity claim must record capability, lane/cohort, actual_or_planned, environment, dates, references, process owner, approving reviewer, genuine outcomes and known exceptions. Discovery evidence proves customer comprehension/interest only; tests prove only their verified harness; real transactions demand separate financial and fulfillment proof.

Canonical:

> **No evidence, no maturity claim.**

---

# 208. Evidence Types

Potential:

```text
TRANSACTION
RUN
REPORT
AUDIT LOG
KPI
SLA
RECONCILIATION
CUSTOMER OUTCOME
```

---

# 209. Documentation Evidence

Useful.

But insufficient by itself for operational maturity.

---

# 210. Capability Scorecard

**Scorecard separation:** maintain two linked views: (1) strategic backlog for rights-safe Selects curation/product discovery; (2) numerical capability maturity based on observed, accepted outcomes. Pilot evidence for Business/Custom cannot be silently relabeled as retail maturity, and current levels cannot be changed without review.

Future record:

```text
Capability
Current Level
Target Level
Owner
Evidence
Gap
Next Action
Blocker
Review Date
```

---

# 211. Capability Health

Potential:

```text
HEALTHY
GAP
BLOCKED
AT_RISK
```

separate from maturity level.

---

# 212. Example

Capability can be:

```text
L3
but
AT_RISK
```

due integration failures.

---

# 213. Current-State Audit

Before major MGBOS development, conduct simple capability audit.

---

# 214. Audit Question 1

Can this capability execute real work end-to-end?

---

# 215. Audit Question 2

Does it depend on founder memory?

---

# 216. Audit Question 3

Is the data structured?

---

# 217. Audit Question 4

Can another person operate it?

---

# 218. Audit Question 5

Can performance be measured?

---

# 219. Audit Question 6

Can failure be detected?

---

# 220. Audit Question 7

Can the system recover?

---

# 221. Founder Dependency Index

Future useful diagnostic.

Ask:

```text
IF FOUNDER DISAPPEARS FOR 7 DAYS,
WHAT STOPS?
```

---

# 222. High Founder Dependency

Signals capability below desired maturity.

---

# 223. Founder Removal Is Not Immediate Goal

Canonical.

First:

founder learns.

Then:

system captures learning.

---

# 224. Capability Bottleneck

Canonical:

> **The lowest critical capability can constrain the value of more advanced capabilities around it.**

---

# 225. Example

Advanced marketing + weak fulfillment:

```text
MORE DEMAND
→
MORE FAILURES
```

---

# 226. Example

Advanced AI + weak data:

```text
MORE ANALYSIS
→
MORE CONFIDENT CONFUSION
```

---

# 227. Example

Advanced commerce + weak cash control:

```text
MORE SALES
→
CASH PROBLEMS
```

---

# 228. Therefore

Capability roadmap should optimize:

```text
SYSTEM BALANCE
```

not maximum maturity everywhere.

---

# 229. Capability Investment Priority

**Investments require scope-labeled impact:** evaluate direct value to Selects desirability/legally viable apparel offer and separate value to a bounded MGBOS operational proof. Founder time, available cash, legal rights and validated bottlenecks constrain the decision; an apparent high score is never a release permission.

Use:

```text
BUSINESS IMPACT
×
CURRENT GAP
×
DEPENDENCY VALUE
```

conceptually.

---

# 230. High-Priority Capability

One that:

```text
blocks revenue
or
blocks delivery
or
blocks cash
or
blocks many other capabilities.
```

---

# 231. Near-Term TeeStock Capability Priorities

**CURRENT PRIORITY OVERRIDE:** historical P0–P3 below ranks the *MGBOS operating-spine engineering cluster* and later automation. It is NOT a priority order demoting TeeStock Selects to a secondary business. Current customer/product focus is curated-design-first: small lawful Selects collections, sourcing rights, garment evidence, truthful product UX and consented discovery are near-term strategic tasks. Services/Business/Custom remain secondary and a conditional governed pilot. No parallel unlimited P0 budgets.

Canonical recommended order:

```text
P0 — SALES / QUOTE
P0 — ORDER / PROJECT
P0 — PRODUCTION / WORK ORDER
P0 — PARTNER
P0 — COST / CASH

P1 — PRODUCT
P1 — COMMERCE
P1 — FULFILLMENT
P1 — CUSTOMER SERVICE

P2 — MARKETING SYSTEM
P2 — CREATOR
P2 — ORIGINALS

P3 — ADVANCED AUTOMATION
P3 — AI AGENTS
```

---

# 232. P0 Meaning

**P0 label scope:** P0 in the historical list means essential to the *operating pilot*, not an assertion of current technical maturity, an owner mandate to implement all modules now, or business precedence over Selects discovery. See §302 for lane-specific work classification.

Must exist for operating backbone.

---

# 233. P1 Meaning

Important next leverage.

---

# 234. P2 Meaning

Growth/network capability.

---

# 235. P3 Meaning

Leverage on top of mature foundation.

---

# 236. Near-Term Build Sequence

**Build-sequence caution:** `Opportunity` and `Project` appear in historical workflow language; these cannot override accepted MGBOS domain ownership/deferred-entity decisions. Treat sequence as a product-validation hypothesis subject to the current domain map and owning work packages. No schema/data mutation allowed.

Recommended:

```text
01 Lead
02 Opportunity
03 Quote
04 Customer
05 Project / Order
06 Production Job
07 Work Order
08 Partner
09 QC
10 Cost Entry
11 Payment
12 Fulfillment
13 Customer Case
```

---

# 237. Why This Sequence

It creates the first complete:

```text
LEAD-TO-CASH
+
ORDER-TO-FULFILLMENT
```

operating spine.

---

# 238. First System Milestone

Canonical:

> **One real Custom/Business order can move end-to-end through MGBOS without requiring an undocumented parallel spreadsheet.**

---

# 239. Second System Milestone

> **One Commerce order can move Product → Payment → Fulfillment → Finance through canonical records.**

---

# 240. Third System Milestone

> **One Creator sale can generate a traceable Earning and Payout.**

---

# 241. Fourth System Milestone

> **One external Partner can receive a Work Order and have performance measured.**

---

# 242. Automation Milestone

> **At least one critical repetitive flow can fail, retry, escalate, and recover without silently losing business state.**

---

# 243. AI Milestone

> **AI can answer operational questions from canonical data with traceable sources and no write authority.**

---

# 244. Agent Milestone

> **One specialist agent can perform a bounded low-risk workflow under audit with acceptable critical-error rate.**

---

# 245. Jarvis Milestone

> **Jarvis can summarize business state, surface exceptions, request approvals, and delegate bounded tasks without becoming source of truth.**

---

# 246. Capability Roadmap vs Product Backlog

Canonical:

```text
CAPABILITY ROADMAP
says what business ability is missing.

PRODUCT BACKLOG
says what features may create that ability.
```

---

# 247. Therefore

Never start with:

> What feature should we code?

Start with:

> What capability gap are we closing?

---

# 248. Example

Capability gap:

```text
cannot reliably know which orders are late.
```

Possible solution:

```text
due dates
status
queue
SLA alert
```

—not necessarily a large new module.

---

# 249. Build-Buy-Manual Decision

For every capability:

```text
MANUAL?
BUY?
BUILD?
AUTOMATE?
```

---

# 250. Manual

Use when:

```text
LOW VOLUME
HIGH UNCERTAINTY
PROCESS STILL LEARNING
```

---

# 251. Buy

Use when:

```text
COMMODITY CAPABILITY
GOOD SaaS EXISTS
LOW STRATEGIC DIFFERENTIATION
```

---

# 252. Build

Use when:

```text
CORE BUSINESS LOGIC
STRATEGIC DIFFERENTIATION
CANONICAL DATA CONTROL
```

matter.

---

# 253. Automate

Use after repeatability.

---

# 254. AI

Use where:

```text
AMBIGUITY
LANGUAGE
SYNTHESIS
CLASSIFICATION
```

create value.

---

# 255. Capability Ownership

Each capability eventually has:

```text
BUSINESS OWNER
SYSTEM OWNER
DATA OWNER
```

---

# 256. Early Stage

One person may hold all three roles.

---

# 257. Separation Later

As organization grows.

---

# 258. Capability Review Cadence

Recommended:

```text
MONTHLY
gap review.

QUARTERLY
maturity review.
```

---

# 259. Monthly Review

Ask:

```text
WHAT CAPABILITY
is blocking revenue / delivery / cash?
```

---

# 260. Quarterly Review

Ask:

```text
WHICH CAPABILITY
actually moved levels?
```

---

# 261. Do Not Upgrade Based on Feature Release

Evidence first.

---

# 262. Capability Downgrade

Possible.

If:

```text
key operator leaves
data breaks
integration unreliable
```

maturity may functionally fall.

---

# 263. Capability Resilience

True maturity survives ordinary personnel/system disruption.

---

# 264. Capability Debt

Canonical:

> **Capability debt is the gap between business complexity and the systems/processes required to operate it reliably.**

---

# 265. Examples

```text
100 orders/day
with manual spreadsheet

10 creators
with manual royalty calculations

5 marketplaces
with manual stock updates
```

create capability debt.

---

# 266. Capability Debt Threshold

When coordination cost grows faster than business value:

systemization priority increases.

---

# 267. Technical Debt vs Capability Debt

```text
TECHNICAL DEBT
lives in software.

CAPABILITY DEBT
lives in business operation.
```

---

# 268. Both Matter

But early TeeStock should prioritize capability debt that directly constrains business.

---

# 269. Current TeeStock Meta-Assessment

Canonical provisional assessment:

```text
TEEStock KNOWS
what it wants to become.

NEXT IT MUST PROVE
how it actually operates.
```

---

# 270. Current Strength

```text
STRATEGIC CLARITY
ARCHITECTURAL CLARITY
DOMAIN MODELING
LONG-TERM SYSTEM THINKING
```

---

# 271. Current Risk

```text
BUILDING TOO FAR AHEAD
OF REAL TRANSACTION LEARNING.
```

---

# 272. Therefore Immediate Strategic Discipline

Canonical:

> **From this point forward, documentation growth should slow relative to execution learning.**

---

# 273. Next Phase Principle

**Execution-learning clarification:** gather low-risk, legally sound Selects customer/product evidence while pilot readiness is gated, rather than building more speculative ERP abstractions. Actual customer transactions require specific approval, systems truth, supplier/QC and financial controls.

```text
LESS:
inventing future architecture

MORE:
running real vertical slices
and feeding evidence back
into canonical architecture.
```

---

# 274. Capability Roadmap Execution Loop

```text
CAPABILITY GAP
↓
SMALLEST BUILD / PROCESS CHANGE
↓
REAL USE
↓
MEASURE
↓
LEARN
↓
UPDATE CAPABILITY LEVEL
```

---

# 275. MGBOS Build Loop

Canonical:

```text
DOMAIN
↓
VERTICAL SLICE
↓
REAL TRANSACTION
↓
EXCEPTION
↓
SYSTEM IMPROVEMENT
```

---

# 276. Recommended Immediate Vertical Slice #1

**Pilot identity preserved:** this first Business/Custom vertical slice is MGBOS operating-spine validation under DEC-009, not the TeeStock primary brand/customer proposition. Readiness comes solely from the current `teestock-operational-pilot-plan.md` and approved security/financial evidence; no pilot unblocking in this capability roadmap.

```text
TEEStock BUSINESS / CUSTOM
```

---

# 277. Flow

```text
LEAD
↓
QUALIFICATION
↓
OPPORTUNITY
↓
QUOTE
↓
CUSTOMER APPROVAL
↓
PROJECT / ORDER
↓
PRODUCTION JOB
↓
WORK ORDER
↓
QC
↓
FULFILLMENT
↓
PAYMENT / COST
↓
CM
```

---

# 278. Why This Vertical Slice First

It validates the largest number of core capabilities simultaneously.

---

# 279. Capabilities Validated

```text
SALES
CRM
QUOTE
ORDER
PARTNER
PRODUCTION
QC
FULFILLMENT
FINANCE
MGBOS
```

---

# 280. Vertical Slice #2

**Commerce distinction:** Selects can have a carefully bounded non-transactional discovery/intent slice as an earlier commercial learning priority; the historical second *technical vertical slice* below refers to a fully authorized live Commerce transaction. They are different evidence classes; no auto-checkout or stock allocation.

```text
TEEStock COMMERCE
```

---

# 281. Flow

**Live transaction boundary:** the Product → SKU → Price → Checkout → Payment → Fulfillment workflow is a future separately approved acceptance contract. Real payment/order authorization cannot be inferred from UI prototypes or from the successful Business/Custom pilot.

```text
PRODUCT
↓
SKU
↓
PRICE
↓
CHECKOUT
↓
PAYMENT
↓
ORDER
↓
FULFILLMENT
↓
RETURN / SUPPORT
```

---

# 282. Vertical Slice #3

```text
TEEStock CREATOR
```

---

# 283. Flow

```text
CREATOR
↓
AGREEMENT
↓
ARTWORK
↓
PRODUCT
↓
SALE
↓
EARNING
↓
PAYOUT
```

---

# 284. Vertical Slice #4

```text
ORIGINALS CAPSULE
```

---

# 285. Flow

```text
CONCEPT
↓
IP
↓
PRODUCT
↓
SMALL BATCH / PREORDER
↓
SELL-THROUGH
↓
CM4
↓
DECISION
```

---

# 286. Vertical Slice Priority

**Priority split:** the historical Business/Custom → Commerce → Creator → Originals ordering ranks *authorized transactional system validation slices* only. Current TeeStock commercial identity and early, non-transactional product learning lead with Selects. Preserve the old list as provenance, not as a Services-first mandate.

Canonical:

```text
1 BUSINESS / CUSTOM
2 COMMERCE
3 CREATOR
4 ORIGINALS
```

unless real market demand proves another order better.

---

# 287. Capability Maturity Matrix Summary

**Maturity summary is authoritative only when evidenced:** historical L0–L5 descriptions remain unchanged. A prototype, documentation or CI result cannot make a business capability L2, while valid early research can inform product decisions without claiming a transactional L1 result.

```text
L0
We do not reliably have the capability.

L1
Founder/team can perform it manually.

L2
Another trained operator can repeat it.

L3
The system structures and controls it.

L4
The system integrates and automates it.

L5
AI can safely assist or perform bounded portions.
```

---

# 288. Canonical Graduation Rule

**No graduation by proxy:** Business/Custom pilot evidence supports the specific operational capabilities it actually exercises; Selects user-research evidence supports the specific desirability questions it measures. Neither proves another cohort’s paid demand, licensed artwork, inventory, returns or contribution margins.

A capability may graduate only if:

```text
PROCESS
+
DATA
+
OWNER
+
MEASUREMENT
+
REAL EVIDENCE
```

exist.

---

# 289. L2 Graduation Example

Production becomes L2 when:

```text
EVERY JOB HAS WORK ORDER
EVERY WORK ORDER HAS STATUS
EVERY COMPLETION HAS QC
```

not when Production System document exists.

---

# 290. L3 Graduation Example

Production becomes L3 when:

```text
MGBOS
enforces those structures
during actual work.
```

---

# 291. L4 Graduation Example

Production becomes L4 when:

```text
events
routing
notifications
exceptions
```

work reliably.

---

# 292. L5 Graduation Example

Production becomes L5 when AI can:

```text
recommend routing
predict risk
summarize exceptions
```

within proven boundaries.

---

# 293. Capability Roadmap Success Definition

**Success condition extended:** measure Selects curation viability, lawful rights sourcing, garment sampling feasibility and customer learning separately from operator repeatability. This does not change the actual maturity-level definitions or assert current sales.

The roadmap succeeds when TeeStock can answer:

```text
WHAT CAPABILITIES
DO WE REALLY HAVE TODAY?

WHICH ONES
ONLY EXIST ON PAPER?

WHAT IS
THE CURRENT BOTTLENECK?

WHAT CAPABILITY
SHOULD WE BUILD NEXT?

WHAT EVIDENCE
IS REQUIRED TO CALL IT MATURE?

WHAT SHOULD
REMAIN MANUAL?

WHAT SHOULD
BE STANDARDIZED?

WHAT SHOULD
BE SYSTEMIZED?

WHAT SHOULD
BE AUTOMATED?

WHAT IS
NOT READY FOR AI?

WHAT MUST BE TRUE
BEFORE JARVIS GETS MORE AUTHORITY?
```

---

# 294. Canonical Capability Summary

```text
REAL WORK
creates capability.

REPETITION
creates patterns.

STANDARDIZATION
creates repeatability.

DATA
creates visibility.

SYSTEMS
create control.

INTEGRATION
creates leverage.

AUTOMATION
removes coordination.

AI
handles ambiguity.

AGENTS
execute bounded work.

MGBOS
coordinates capabilities.

JARVIS
orchestrates the operating system.
```

---

# 295. Canonical Capability Principles

```text
CAPABILITY MATURITY IS PROVEN BY REPEATABLE OUTCOMES—NOT DOCUMENTS, SOFTWARE SCREENS, OR ARCHITECTURE DIAGRAMS.

DOCUMENTATION MATURITY AND OPERATIONAL MATURITY ARE DIFFERENT.

NO EVIDENCE, NO MATURITY CLAIM.

REAL TRANSACTIONS SHOULD NOW DRIVE THE NEXT ARCHITECTURE DECISIONS.

BUILD THE OPERATING SPINE BEFORE BUILDING EDGE CAPABILITIES.

SALES → ORDER → PRODUCTION → FULFILLMENT → FINANCE IS THE PRIMARY SPINE.

DATA → MGBOS → AUTOMATION → AI IS THE SYSTEMS SPINE.

AI CANNOT LEAPFROG PROCESS AND DATA MATURITY.

ONE COMPLETE VERTICAL SLICE IS MORE VALUABLE THAN TEN HALF-BUILT MODULES.

BUILD CREATOR OPERATIONS BEFORE CREATOR PORTAL.

BUILD PARTNER CONTROL BEFORE PARTNER PLATFORM.

BUILD COMMERCE TRANSACTION TRUTH BEFORE ADVANCED MERCHANDISING.

BUILD CASH VISIBILITY BEFORE FINANCIAL AI.

BUILD CUSTOMER CASE DATA BEFORE AI CUSTOMER SUPPORT.

BUILD RIGHTS RECORDS BEFORE AUTOMATED IP GATES.

BUILD AUTOMATION OBSERVABILITY BEFORE INCREASING AUTOMATION VOLUME.

BUILD SINGLE-AGENT RELIABILITY BEFORE MULTI-AGENT ORCHESTRATION.

THE LOWEST CRITICAL CAPABILITY CAN CONSTRAIN THE VALUE OF EVERY MORE ADVANCED CAPABILITY AROUND IT.

CAPABILITY INVESTMENT SHOULD REMOVE THE HIGHEST-VALUE CURRENT BOTTLENECK.

FROM THIS POINT FORWARD, EXECUTION LEARNING SHOULD GROW FASTER THAN ARCHITECTURE DOCUMENTATION.
```

---

# 296. Immediate Recommended State

**Current-state caution:** `STAGE 1 → STAGE 2` is an original directional planning estimate. Obtain a dated, bounded, independently supported operating baseline before claiming a completed transition. The strategic Selects-first decision changes priority, not historical maturity evidence.

TeeStock should currently operate under:

```text
MASTER STAGE:
STAGE 1 → STAGE 2

PRIMARY OBJECTIVE:
TURN CANONICAL BUSINESS DESIGN
INTO REPEATABLE REAL OPERATIONS.
```

---

# 297. Immediate Target

**Immediate target interpreted by lane:** repeatable Lead-to-Cash and Order-to-Fulfillment L2 remains an *operating-spine* ambition subject to its own pilot readiness. The initial Selects business lane aims for safe rights-cleared design discovery and meaningful customer learning, not an unauthorized retail order.

The next maturity milestone is:

```text
LEAD-TO-CASH
and
ORDER-TO-FULFILLMENT
```

at:

```text
LEVEL 2
```

before aggressive expansion into:

```text
CREATOR PLATFORM
ADVANCED COMMERCE
AGENTIC AI
```

---

# 298. Immediate Build Focus

**Implementation authority:** the legacy operational build list below is not permission to add tables, expand MGBOS domains, run migrations, activate payment or deploy. Prioritize approved bounded fixes only after current code, domain map, pilot readiness and owner authorization are verified. Curated-first discovery deliverables belong to their owning CX/Commerce work packages.

Canonical:

```text
01 LEAD
02 OPPORTUNITY
03 QUOTE
04 CUSTOMER
05 PROJECT / ORDER
06 PRODUCTION JOB
07 WORK ORDER
08 PARTNER
09 QC
10 COST
11 PAYMENT
12 FULFILLMENT
13 CASE / EXCEPTION
```

---

# 299. Immediate “Do Not Build Yet”

Canonical:

```text
MULTI-AGENT JARVIS
CREATOR MARKETPLACE
PARTNER MARKETPLACE
ADVANCED WMS
MICROSERVICES
KUBERNETES
DATA WAREHOUSE
PREDICTIVE AI
AUTONOMOUS FINANCE
```

---

# 300. Dependency

**Dependency closure:** this roadmap must follow accepted TS-RDM-001 v2.0 and TS-RDM-003 v2.0, DEC-TS-2026-012 and current Commerce/Brand/CX/IP authority. Checklist completion requires exact source evidence; text here neither grants PR #85 merge nor product deployment.

Dokumen berikutnya:

1. [[bisnis/teestock/14-roadmap/current-quarter|current-quarter.md]]

[[bisnis/teestock/14-roadmap/current-quarter|current-quarter.md]] harus mengubah Master Roadmap + Capability Roadmap menjadi **execution plan konkret untuk satu quarter**, dengan:

```text
OBJECTIVES
OUTCOMES
WORKSTREAMS
DELIVERABLES
SEQUENCE
OWNERS
MILESTONES
METRICS
GATES
DEFERRED ITEMS
```

dan harus berfokus pada **menutup gap Stage 1 → Stage 2**, bukan mencoba membangun seluruh visi TeeStock sekaligus.

---

# 301. Curated-Design-First Capability Priority Contract — DEC-TS-2026-012

**Commercial priority is not a capability score.** TeeStock should first be recognized as a curated-design apparel proposition, led by Selects. Essentials supports garments/basic assortments; Originals means separately governed TeeStock-owned creative IP. The four established business domains—Commerce, Services, Originals, Programs—remain intact. Custom/Business/Merch are valid secondary routes with separate lead/quote and operating authority. The **Business/Custom** validation cohort under DEC-TS-2026-009 is unchanged and cannot be treated as the primary TeeStock brand or the source of Selects market-fit proof.

| Decision axis | Primary interpretation | Evidence that counts | Invalid inference |
|---|---|---|---|
| Strategic business/product priority | Selects curated-design apparel | Adopted DEC-TS-2026-012, approved Commerce/brand contracts | Service-pilot sequence = business positioning |
| Near-term Selects learning | Legal/provenance review, garment facts, small curated collection, customer comprehension | Actual cleared source materials, interviews, consented interest and sample observations | Page views/waitlist = paid orders |
| Commerce capability grade | Historic L1/L2 gates retained; real transactions and repeatability | Real approved product/order/payment/fulfillment/support and finance evidence | Beautiful site/CI/demo cart = Commerce L1 |
| MGBOS operating-pilot readiness | Governed Business/Custom cohort only | Owning current pilot plan, explicit permits and test/real transaction evidence | Documentation upgrade = pilot unblocked |
| Long-range sequencing | Build controls before risky automation/AI | Observed process constraints and reviewed domain changes | New code/database objects mandated by this roadmap |

**Dual founder constraints:** One founder has limited capacity. Allocating high strategic attention to Selects does not grant simultaneous unlimited engineering efforts. Both lanes need explicit stop conditions, expense caps from actual resources, dated owner review and separate outcome records.

# 302. Two-Lane Capability Backlog and Readiness Gates

| Track | Work eligible for a bounded next step | Independent gate / owner | Explicitly out of scope |
|---|---|---|---|
| Lane A — Selects concept/rights | Identify theme/audience; verify artwork source, rights/channel limits, attribution and truthful media | Commerce/brand + TS-LEG-001/underlying license; founder review | Treat licensed designs as Originals-owned IP |
| Lane A — Garment & discovery | Approved facts, sample plan, curated collection/PDP design, consented no-payment customer research | Product/CX/operations QC as applicable; separately authorized exposure | Claim stock, sample QC, delivery promises or launch date from mockups |
| Lane A — Paid transaction later | Genuine pricing, costs/royalties/taxes, returns/support, stock or supplier capacity and payment/order controls | Financial/order/security, applicable legal and Owner release | Live checkout/payment, marketplace or order capture by this document |
| Lane B — MGBOS validation | Reconcile current domain map, valid Lead/Quote/Order/Production/QC/Cost/Cash contracts | Owning operational pilot plan, engineering QA and security/finance | New root Opportunity/Project/Partner just because legacy text lists them |
| Lane B — Real cohort pilot later | Approved Business/Custom eligibility, real permitted orders and independent operational evidence | Pilot execution approval, organization isolation and financial integrity | Assume existing plan's BLOCKED state is automatically cured |
| Shared | Governed owner capacity/priority review, scoped documentation traceability and truthful outcome reporting | Owner decision register and exact main/PR QA | Rebase, deployment, production access or merge from this strategy |

**Maturity note:** even a successful Stage-A Selects research slice does not satisfy transactional Commerce L1 as defined in §32–33. Conversely, a genuine pilot process can support only the specific process maturity it proves; services cannot substitute for Selects economic desirability.

# 303. Capability Evidence Ledger and No-Proxy Maturity Rule

Every claimed level change must be traceable to *actual* evidence, not assumptions.

| Evidence class | What it may demonstrate | What it cannot establish |
|---|---|---|
| SELECTS-DESIGN | Approved curated theme, IP provenance and intended audience | Copyright ownership from file purchase; sellable item |
| SELECTS-SAMPLE | Physically tested garment/print and accurate specifications | Bulk production or inventory available without supplier verification |
| SELECTS-INTEREST | Actual usability/comprehension and consented customer intent | Revenue, repeat purchase, operational L1/L2 |
| COMMERCE-REAL | Authorized paid retail order, fulfillment, support and actual costs | Margin in unrelated services or untested variants |
| MGBOS-CI | A defined code/test harness passed on exact commit | Real customer transactions, product-market fit, production readiness |
| PILOT-REAL | Authorized Business/Custom process transactions with QC/financial evidence | Selects paid demand or IP clearance |
| FINANCE/LEGAL | Verified cost/payment and specific IP permission documents | Any authorization outside issuer's scope |

Required evidence record fields (*documentation template, not a new MGBOS entity*): `capability`, `lane`, `owner`, `cohort`, `environment`, `actual_or_planned`, `as_of`, `evidence_ref`, `level_claim`, `acceptance_gate`, `reviewer`, `decision`, `exceptions`, `next_review`.

**Strict grades:** Preserve the established L0–L5 maturity semantics. `L0–L1`, `L1`, or `L2` stated in v1.0 are historic/provisional, not current independently accepted operating grades. Upgrading them requires exact applicable operational evidence, owner/QA judgment and governance. Public rights-safe discovery can be meaningful business work without any claimed commerce-level graduation.

# 304. Canonical Dependencies, Non-Authorizations and Independent Acceptance

```yaml
capability_roadmap_curated_first_contract:
  document_id: TS-RDM-002
  version: "2.0"
  owner_decision: DEC-TS-2026-012
  brand_and_commercial_priority: CURATED_DESIGN_APPAREL
  primary_commerce_line: TEESTOCK_SELECTS
  supporting_line: TEESTOCK_ESSENTIALS
  originals: SEPARATE_OWNED_IP_GOVERNANCE
  services: SECONDARY_CONDITIONAL
  four_business_domains: RETAINED
  mgbos_pilot_cohort: BUSINESS_CUSTOM_UNCHANGED
  maturity_scale: L0_TO_L5_UNCHANGED
  maturity_claims_from_documentation: NONE
  pilot_execution_authorization: NONE
  live_retail_checkout_authorization: NONE
  live_payment_authorization: NONE
  inventory_or_shipping_readiness_claim: NONE
  implementation_authorization: NONE
  migrations_authorization: NONE
  deployment_authorization: NONE
  pr_merge_authorization: NONE
```

**Ownership:** DEC-012/TS-FND-004 owns TeeStock positioning. TS-RDM-001 governs long-range stages; TS-RDM-002 governs maturity/evidence and capability dependencies; TS-RDM-003 governs Q4 conditional execution planning. TS-COM-001/002/004 and TS-TEC-002/CX govern Commerce curation/catalog/website behavior. TS-LEG-001 and agreements govern artwork rights. The actual MGBOS domain map/runtime, security/financial contracts and operational pilot plan govern real orders, pilot eligibility, payments and technical truth. No single roadmap supersedes those owners.

**Independent reviewer acceptance requirements (not yet passed merely by appearing here):**

- [ ] Recheck exact PR #85 HEAD and original TS-RDM-002 v1.0 Git blob; STOP if changed.
- [ ] Confirm original 300 numbered heading titles and every substantive historic body line are retained in original order, with sections 301–304 appended.
- [ ] Confirm source metadata `TS-RDM-002`, target v2.0, upstream TS-RDM-001/003 and owner DEC-009/011/012 reconciliation.
- [ ] Confirm §31–35 Commerce L1/L2 real-transaction evidence remains a **required gate**, not reduced to interest-capture or a demonstration.
- [ ] Confirm §191–199, §231, §276–286 explicitly distinguish Selects market/product priority from MGBOS pilot test ordering.
- [ ] Verify no program claims actual paid sales, product/garment stock, owner IP, production readiness, pilot unblocking, new runtime state or maturity graduation without evidence.
- [ ] Validate YAML, diff whitespace, references, all repository governance and exact new-commit GitHub Actions.
- [ ] Review the full 37-file-or-more PR #85 diff against fresh protected `main`, resolve divergence via separately authorized safe integration and seek explicit owner merge decision. Do not merge automatically.

**Historical capability classifications and services-led ordering are preserved to document previous plans**, but DEC-012 now governs TeeStock's primary commercial/product identity and no regrading, deployment or checkout is authorized here.
