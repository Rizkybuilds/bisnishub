---
title: "TeeStock Services Overview"
date: "2026-09-28"
bisnis: teestock
kategori: operasional
status: active
tags:
  - bisnis/teestock
  - kategori/operasional
  - teestock/canonical
  - teestock/services
document_id: "TS-SVC-001"
version: "1.0"
category: "services"
business: "teestock"
last_updated: "2026-09-28"
path: "04-services/services-overview.md"
depends_on:
  - "TS-FND-001"
  - "TS-FND-002"
  - "TS-STR-001"
  - "TS-STR-002"
  - "TS-STR-003"
  - "TS-STR-004"
  - "TS-BRD-001"
  - "TS-BRD-002"
  - "TS-BRD-004"
  - "TS-COM-005"
---


# TeeStock Services Overview v1.0

> [!abstract] **Canonical Services Architecture Document  **
> Dokumen ini mendefinisikan seluruh service architecture TeeStock, fungsi masing-masing service line, hubungan antar-service, lifecycle service, service boundaries, commercial model, shared capabilities, dan aturan aktivasi agar TeeStock dapat menjual capability tanpa menjadi general-purpose agency.
>
> [!info] **Dependencies & Data Flow (SSOT)**
> [[bisnis/teestock/00-foundation/teestock-master-definition|TS-FND-001: TeeStock Master Definition]] • [[bisnis/teestock/00-foundation/glossary|TS-FND-002: TeeStock Glossary]] • [[bisnis/teestock/01-strategy/business-thesis|TS-STR-001: TeeStock Business Thesis]] • [[bisnis/teestock/01-strategy/business-model|TS-STR-002: TeeStock Business Model]] • [[bisnis/teestock/01-strategy/ecosystem-architecture|TS-STR-003: TeeStock Ecosystem Architecture]] • [[bisnis/teestock/01-strategy/growth-strategy|TS-STR-004: TeeStock Growth Strategy]] • [[bisnis/teestock/02-brand/master-brand-strategy|TS-BRD-001: TeeStock Master Brand Strategy]] • [[bisnis/teestock/02-brand/brand-architecture|TS-BRD-002: TeeStock Brand Architecture]] • [[bisnis/teestock/02-brand/voice-and-copy-system|TS-BRD-004: TeeStock Voice & Copy System]] • [[bisnis/teestock/03-commerce/product-taxonomy|TS-COM-005: TeeStock Product Taxonomy]]


---

# 1. Purpose

TeeStock Services menjawab:

> **Apa yang bisa TeeStock kerjakan untuk customer?**

Jika Commerce menjual finished products, maka Services menjual:

```text id="xqhsn0"
CAPABILITY
+
PROCESS
+
DELIVERABLE
```

Services harus membantu customer menyelesaikan apparel-related problem dengan lebih sedikit complexity.

---

# 2. Canonical Definition

> **TeeStock Services adalah capability layer yang membantu individu, creator, organisasi, dan apparel businesses membuat, mengembangkan, memproduksi, memasok, dan mengoperasikan apparel serta merchandise.**

Canonical architecture:

```text id="6vda84"
TEEStock SERVICES
│
├── TeeStock Custom
├── TeeStock Business
├── TeeStock Merch
├── TeeStock Studio
├── TeeStock Supply
└── TeeStock Fulfill
```

---

# 3. Services Strategic Role

Services mempunyai empat strategic functions:

```text id="6ydt3c"
REVENUE
+
CAPABILITY UTILIZATION
+
OPERATING LEARNING
+
CUSTOMER RELATIONSHIP
```

---

# 4. Revenue Role

Services menghasilkan revenue melalui:

- service fees,
- production margin,
- product margin,
- project fees,
- fulfillment fees,
- creative fees,
- wholesale margin.

---

# 5. Capability Utilization Role

Infrastructure yang digunakan Commerce dapat dipakai oleh Services.

Contoh:

```text id="tq6wsk"
GARMENT PLATFORM
+
PRODUCTION
+
QC
+
FULFILLMENT
```

dapat digunakan untuk:

```text id="qp77yk"
Selects
Originals
Custom
Business
Merch
```

Semakin tinggi healthy utilization, semakin besar operating leverage.

---

# 6. Operating Learning Role

Services menghadirkan requirement dunia nyata.

Contoh:

Customer meminta:

- custom placement,
- different quantity,
- packaging,
- deadline,
- business specification.

Requirement berulang dapat menjadi:

```text id="03vmly"
STANDARDIZED CAPABILITY
```

yang kemudian berguna di domain lain.

---

# 7. Customer Relationship Role

Services dapat menciptakan relationship yang lebih panjang daripada satu retail transaction.

Example:

```text id="8hyvcs"
CUSTOM ORDER
↓
BUSINESS ORDER
↓
MERCH PROGRAM
↓
FULFILLMENT
```

Customer dapat berkembang bersama ecosystem TeeStock.

---

# 8. Core Service Philosophy

Canonical principle:

> **Productize what repeats. Customize only what creates value.**

Services tidak boleh berkembang sebagai:

```text id="q4p1h6"
"apa saja bisa"
```

karena itu menghasilkan:

- unclear pricing,
- founder dependency,
- revision chaos,
- difficult automation,
- low scalability.

---

# 9. Productized Service

A Productized Service memiliki:

```text id="grz3eg"
CLEAR CUSTOMER
CLEAR SCOPE
CLEAR INPUT
CLEAR OUTPUT
CLEAR PROCESS
CLEAR PRICE LOGIC
CLEAR SLA
```

Customer tetap mendapatkan flexibility.

Tetapi process tidak dimulai dari nol setiap order.

---

# 10. Service Spectrum

Services berada pada spectrum:

```text id="9ps5b8"
STANDARDIZED
│
│ Custom
│ Business
│ Merch
│
│ Studio
│
│ Supply
│ Fulfill
│
SPECIALIZED
```

Posisi dapat berubah tergantung offering.

---

# 11. Service Line vs Shared Capability

Important distinction:

A Service Line adalah customer-facing commercial offering.

A Shared Capability adalah kemampuan internal yang dapat mendukung banyak offerings.

Example:

```text id="n7n45g"
TeeStock Studio
```

dapat menjadi Service Line sekaligus Shared Capability.

Likewise:

```text id="648jdx"
TeeStock Fulfill
```

dapat menjadi external service sekaligus internal infrastructure.

---

# 12. Canonical Classification

```text id="gucowh"
CUSTOM
Customer-facing Service Line

BUSINESS
Customer-facing Service Line

MERCH
Customer-facing Service Line

STUDIO
Service Line + Shared Capability

SUPPLY
Service Line + Procurement Capability

FULFILL
Service Line + Shared Infrastructure
```

---

# 13. TeeStock Custom

Canonical purpose:

> **Help individuals and small groups turn their own idea into apparel.**

Primary customers:

```text id="nmrbna"
INDIVIDUAL
SMALL GROUP
COMMUNITY
MICRO BUSINESS
EVENT
```

Primary need:

> “Gue punya ide/desain. Bisa dibikin jadi apparel nggak?”

---

# 14. Custom Value Proposition

TeeStock Custom reduces complexity around:

```text id="bqqud8"
GARMENT
ARTWORK
PLACEMENT
PRODUCTION
QC
FULFILLMENT
```

Customer tidak perlu menjadi production expert.

---

# 15. Custom Boundary

Custom is not:

- unrestricted creative agency,
- unlimited revision design service,
- garment factory for any possible specification.

Custom harus menggunakan approved:

- product options,
- production methods,
- process.

---

# 16. TeeStock Business

Canonical purpose:

> **Provide structured apparel and merchandise solutions for organizations.**

Primary customers:

```text id="jv3t07"
COMPANY
SCHOOL
HOSPITALITY
AGENCY
EVENT ORGANIZER
COMMUNITY ORGANIZATION
INSTITUTION
```

---

# 17. Business Value Proposition

Business reduces vendor coordination.

Canonical message:

```text id="lkw4tq"
ONE ACCOUNTABLE PARTNER
FOR APPAREL & MERCH
```

Possible scope:

- uniforms,
- workwear,
- event apparel,
- employee kits,
- corporate merchandise.

---

# 18. Custom vs Business

Canonical distinction:

```text id="91ukpf"
CUSTOM
smaller / simpler / customer-specific

BUSINESS
organizational / larger / project-based
```

They may use the same production infrastructure.

Commercial workflow differs.

---

# 19. TeeStock Merch

Canonical purpose:

> **Operate merchandise for creators, communities, IP owners, and brands.**

Customer brings:

```text id="y5xs46"
AUDIENCE
+
IDENTITY / IP
```

TeeStock brings:

```text id="ag446o"
PRODUCT
+
PRODUCTION
+
COMMERCE
+
FULFILLMENT
```

---

# 20. Merch Value Proposition

> **Build the audience. TeeStock can operate the merchandise backend.**

Possible scope:

- product development,
- production,
- storefront,
- inventory,
- fulfillment,
- royalty/revenue share.

---

# 21. Merch Boundary

Merch is not automatically:

- influencer agency,
- talent management,
- social media management.

TeeStock focuses on:

> merchandise operating infrastructure.

---

# 22. TeeStock Studio

Canonical purpose:

> **Provide apparel-focused creative and product-development capability.**

Possible services:

```text id="an7u8d"
GRAPHIC DESIGN
APPAREL CONCEPT
BRAND IDENTITY
PACKAGING
MOCKUP
TECH PACK
CAMPAIGN CREATIVE
```

---

# 23. Studio Strategic Role

Studio has two modes:

```text id="fn94sj"
EXTERNAL
paid service

INTERNAL
shared creative engine
```

Internal users:

- Selects,
- Business,
- Merch,
- Originals.

---

# 24. Studio Boundary

Studio should remain focused on:

```text id="3dvtj5"
APPAREL
MERCH
CONSUMER PRODUCT
BRAND EXPRESSION
```

It should not casually become:

> general creative agency for every industry.

---

# 25. TeeStock Supply

Canonical purpose:

> **Provide apparel inputs and blank products to business customers.**

Primary customers:

```text id="43h7l7"
CLOTHING BRAND
PRINT SHOP
SABLON BUSINESS
MERCH VENDOR
GARMENT BUSINESS
RESELLER
```

---

# 26. Supply Value Proposition

Supply focuses on:

- specification,
- availability,
- quantity,
- pricing,
- reliability.

Customer question:

> “Bisa supply blank ini secara konsisten?”

---

# 27. Supply Boundary

Supply is not:

```text id="ha6nzl"
TeeStock Essentials wholesale page
```

even if underlying garment overlaps.

Supply has:

- B2B pricing,
- MOQ,
- volume tiers,
- commercial terms.

---

# 28. TeeStock Fulfill

Canonical purpose:

> **Operate storage, order handling, packing, shipping, and related backend processes for eligible products/partners.**

Possible scope:

```text id="d13q1c"
STORAGE
INVENTORY
PICK & PACK
PRODUCTION COORDINATION
SHIPPING
RETURNS
```

---

# 29. Fulfill Value Proposition

> **Sell without operating the entire physical backend yourself.**

---

# 30. Fulfill Boundary

Fulfill should not scale externally before TeeStock proves internally that it can deliver:

```text id="ll74k5"
ACCURACY
SLA
COST CONTROL
TRACEABILITY
```

---

# 31. Service Relationship Map

```text id="e8o20o"
                     CUSTOMER NEED
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
      CUSTOM            BUSINESS           MERCH
         │                 │                 │
         └─────────────┬───┴────┬────────────┘
                       │        │
                    STUDIO    SUPPLY
                       │        │
                       └───┬────┘
                           │
                       FULFILL
                           │
                           ▼
                 SHARED OPERATIONS
```

---

# 32. Service Composition

One customer engagement may combine several Service Lines.

Example:

```text id="mqbbsk"
Creator
↓
TeeStock Merch
├── Studio
├── Supply
└── Fulfill
```

Customer sees one solution.

Internal accounting still tracks component services.

---

# 33. Service Bundling

Service bundle can simplify buying.

Example:

```text id="3l7duc"
CREATOR MERCH PACKAGE
=
Product Development
+
Production
+
Fulfillment
```

But underlying cost components remain measurable.

---

# 34. Lead Routing

New service lead should be classified by intent.

```text id="na5ikb"
"I need 5 custom shirts"
→ Custom

"I need 300 company tees"
→ Business

"I have 100k followers and want merch"
→ Merch

"I need 100 blank tees"
→ Supply
```

---

# 35. Lead Qualification

Not every inquiry should become a project.

Qualification can consider:

```text id="305zb2"
NEED
QUANTITY
BUDGET
TIMELINE
FIT WITH CAPABILITY
```

Exact rules vary by Service Line.

---

# 36. Canonical Service Funnel

```text id="vo1dz4"
LEAD
↓
QUALIFIED
↓
REQUIREMENT
↓
SOLUTION
↓
QUOTE
↓
APPROVAL
↓
ORDER / PROJECT
↓
DELIVERY
↓
CLOSE
↓
FOLLOW-UP
```

Simpler services can skip steps.

---

# 37. Service Lead

Lead is:

> potential customer request not yet commercially committed.

Lead is not an Order.

---

# 38. Opportunity

For more complex B2B/Merch sales:

```text id="w9js2v"
LEAD
↓
OPPORTUNITY
↓
QUOTE
↓
WON / LOST
```

Custom may not need formal Opportunity entity early.

---

# 39. Requirement

Requirement records what customer needs.

Possible:

```text id="j34f55"
Product
Quantity
Sizes
Artwork
Deadline
Packaging
Budget
Delivery Location
```

---

# 40. Requirement vs Configuration

Requirement describes need.

Configuration defines chosen solution.

Example:

```text id="uxj1lm"
Requirement:
100 event tees

Configuration:
Heavyweight Black
DTF front
sizes S–XL
```

---

# 41. Quote

Quote turns configuration into commercial offer.

Should include:

```text id="tcmrua"
SCOPE
QUANTITY
PRICE
TIMELINE
PAYMENT TERMS
VALIDITY
```

---

# 42. Quote Versioning

Quote changes should be versioned.

Example:

```text id="pvyc80"
QT-001 v1
QT-001 v2
```

Avoid losing history after negotiation.

---

# 43. Quote → Order

Approved quote should become Order/Project without re-entering all data manually.

Long-term MGBOS should preserve lineage.

---

# 44. Deposit / DP

Certain services may require:

```text id="r33hgb"
DEPOSIT
```

before production.

Payment policy belongs in Finance/Service-specific docs.

---

# 45. Work Order

After commercial approval:

```text id="u87odq"
ORDER
↓
WORK ORDER
```

Work Order instructs operations what to execute.

---

# 46. Service Project

Complex Business or Merch work may require:

```text id="s89hkl"
PROJECT
```

Project can contain:

- multiple deliverables,
- multiple work orders,
- milestones.

---

# 47. Deliverable

A Deliverable is something TeeStock commits to deliver.

Examples:

```text id="x87ffx"
100 printed shirts
Packaging design
Creator storefront
```

---

# 48. Service Scope

Every Service Offering must have explicit scope.

Example:

```text id="ou7vuo"
INCLUDED
2 mockup revisions

NOT INCLUDED
full brand identity redesign
```

Scope protects:

- customer expectation,
- margin,
- capacity.

---

# 49. Scope Creep

Scope creep occurs when customer requests additional work outside agreed scope.

Canonical response:

```text id="a79637"
CHANGE REQUEST
↓
IMPACT
↓
NEW PRICE / TIMELINE
↓
APPROVAL
```

Not:

> silently absorb extra work.

---

# 50. Change Request

For larger Services, significant change should be recorded.

Possible fields:

```text id="odohxz"
Requested Change
Reason
Price Impact
Timeline Impact
Approval
```

---

# 51. Revision Policy

Creative Services especially need revision limits.

Revision policy must be clear before project starts.

Unlimited revisions are not default.

---

# 52. SLA

Each Service Offering should eventually define:

```text id="2c1dvq"
RESPONSE SLA
QUOTE SLA
PRODUCTION SLA
DELIVERY SLA
```

where relevant.

Do not promise universal SLA if actual capability varies.

---

# 53. Service Catalog

Services themselves should have canonical catalog.

Possible hierarchy:

```text id="r6zgkr"
SERVICE LINE
↓
SERVICE OFFERING
↓
SERVICE PACKAGE / CONFIGURATION
```

---

# 54. Service Line

Example:

```text id="9uk393"
TeeStock Custom
```

---

# 55. Service Offering

Example:

```text id="h47qqa"
Custom Graphic Tee
```

or:

```text id="vnv6p5"
Corporate Event Apparel
```

---

# 56. Service Package

Optional standardized combination.

Example:

```text id="zisx4l"
Creator Merch Starter Package
```

Package should not hide underlying economics.

---

# 57. Product + Service Combination

Orders may contain:

```text id="7nhs06"
PRODUCT
+
SERVICE
```

Example:

```text id="upk43b"
100 blank tees
+
printing
+
packing
```

Data model must support this.

---

# 58. Service Pricing Models

Possible pricing mechanisms:

```text id="lmrpi8"
FIXED PRICE
UNIT PRICE
TIERED PRICE
PROJECT FEE
SERVICE FEE
REVENUE SHARE
ROYALTY
SUBSCRIPTION
```

Not all are active.

---

# 59. Fixed Price

Useful when:

- scope standardized,
- variability low.

---

# 60. Unit Price

Useful for:

- apparel units,
- production,
- supply.

---

# 61. Tiered Price

Useful when quantity changes economics.

Example:

```text id="v6iy3d"
1–11
12–49
50–99
100+
```

Actual tiers determined later.

---

# 62. Project Fee

Useful for:

- Studio,
- complex Business project.

---

# 63. Revenue Share

Useful for selected Merch relationships.

Must define:

- revenue basis,
- allowable deductions,
- payout schedule.

---

# 64. Royalty

Useful for:

- creator artwork,
- collaborations.

Royalty is rights compensation.

Not synonym for revenue share.

---

# 65. Service Costing

Every Service should identify:

```text id="r5nq7b"
MATERIAL
PRODUCTION
LABOR
OUTSOURCE
SHIPPING
REVISION
TRANSACTION COST
```

where relevant.

---

# 66. Hidden Labor

One major risk Services face:

> undercounting human time.

Examples:

- chat,
- quote creation,
- revisions,
- follow-up,
- coordination.

These must eventually inform economics.

---

# 67. Founder Time

Early-stage founder time should be treated as capacity cost even if not yet booked as payroll.

Track:

```text id="5stqut"
time per lead
time per order
time per project
```

where useful.

---

# 68. Service Contribution

At minimum:

```text id="0m5ctd"
SERVICE REVENUE
-
DIRECT MATERIAL
-
DIRECT PRODUCTION
-
VARIABLE SERVICE COST
=
SERVICE CONTRIBUTION
```

Detailed finance model later.

---

# 69. Service Margin vs Complexity

A high-margin job may still be poor if it creates extreme complexity.

Therefore Service health must consider:

```text id="64s38e"
CONTRIBUTION
+
TIME
+
ERROR RISK
+
REPEATABILITY
```

---

# 70. Service Acceptance Rule

TeeStock does not have to accept every profitable request.

A request can be rejected if:

- outside capability,
- too risky,
- IP problem,
- impossible timeline,
- poor strategic fit.

---

# 71. Service Boundary Principle

Canonical rule:

> **Capability defines the service. Customer demand does not redefine the company.**

If a customer asks TeeStock to build:

> unrelated software,

that does not become TeeStock Studio service merely because they will pay.

---

# 72. Adjacency Rule

New Service Offering should ideally reuse:

```text id="cxgq05"
PRODUCT
PRODUCTION
SUPPLIER
FULFILLMENT
CREATIVE
CUSTOMER
```

already present in TeeStock.

---

# 73. New Service Activation Gate

A new Service Offering requires:

```text id="ach7aq"
REPEATED DEMAND
+
CLEAR SCOPE
+
DELIVERY CAPABILITY
+
PRICING LOGIC
+
HEALTHY ECONOMICS
```

---

# 74. Service Lifecycle

Canonical:

```text id="b0sni6"
CONCEPT
↓
PILOT
↓
ACTIVE
↓
STANDARDIZED
↓
SCALED
↓
PAUSED / SUNSET
```

---

# 75. Concept

Opportunity identified.

Not public.

---

# 76. Pilot

Limited customer set.

Manual process acceptable.

Goal:

> learn.

---

# 77. Active

Offering publicly available.

Process mostly defined.

---

# 78. Standardized

Process:

- documented,
- repeatable,
- measurable.

This is prerequisite for meaningful automation.

---

# 79. Scaled

Volume can grow without proportional chaos.

---

# 80. Paused

Temporarily unavailable.

---

# 81. Sunset

Offering intentionally discontinued.

---

# 82. Service Standardization

For each Service, document:

```text id="pj5c85"
INPUTS
PROCESS
OUTPUTS
ROLES
TOOLS
SLA
QUALITY CHECK
EXCEPTIONS
```

---

# 83. Exception Handling

Services inevitably have exceptions.

Exceptions should become:

```text id="d5jk63"
RECORDED
CLASSIFIED
REVIEWED
```

Repeated exceptions may reveal need for:

- new standard,
- new service,
- better boundary.

---

# 84. Automation Principle

Canonical sequence:

```text id="w38mso"
MANUAL
↓
OBSERVE
↓
STANDARDIZE
↓
AUTOMATE
```

Not:

```text id="8af4uo"
AUTOMATE
↓
DISCOVER WHAT THE PROCESS IS
```

---

# 85. Automation Candidates

Potential:

```text id="wrsyaa"
Lead Qualification
Quote Preparation
Order Creation
Artwork Checklist
Status Notifications
Production Routing
Payout Calculation
```

---

# 86. Existing Decision Engine Relevance

Lead qualification can eventually be generalized into service-specific rules.

Example Business lead:

```text id="m9w1oa"
Budget
Need Clarity
Contact Validity
Quantity
Deadline
```

Exact criteria belong in service workflows.

---

# 87. AI Role

AI can assist Services with:

```text id="wr65v8"
Lead Summary
Requirement Extraction
Quote Drafting
Artwork Review Assistance
Customer Response Drafting
Project Risk Alerts
```

---

# 88. AI Boundary

AI must not independently:

- approve uncertain IP,
- promise unsupported delivery dates,
- override pricing floor,
- commit large production,
- approve high-risk refund.

---

# 89. Service Data

Canonical Service data should capture:

```text id="ezurmk"
Customer
Lead
Service Line
Requirement
Quote
Order / Project
Deliverable
Work Order
Payment
Status
Outcome
```

---

# 90. Cross-Service Customer Identity

Same customer can use:

```text id="rur58t"
Custom
Business
Merch
```

without becoming duplicate customers.

MGBOS should preserve one entity with multiple relationships.

---

# 91. Service Revenue Attribution

Each service transaction must know:

```text id="ka2mw7"
Business Unit
Domain
Service Line
Service Offering
Customer
Channel
Revenue
Cost
```

---

# 92. Internal Service Usage

Studio/Fulfill can serve internal TeeStock needs.

Example:

```text id="og63j5"
Originals
↓
Studio work
```

Internal usage should still be measurable.

Otherwise cost disappears.

---

# 93. Internal Transfer Logic

For management analysis, internal capability may carry:

```text id="4kkrdi"
internal cost allocation
```

even if no actual cash transfer occurs.

---

# 94. Shared Service Capacity

Capacity needs to be allocated across:

```text id="i8m9po"
Commerce
Services
Originals
Partners
```

High-priority customer orders should not be disrupted by uncontrolled internal requests.

---

# 95. Capacity Types

Potential:

```text id="3zp3u5"
DESIGN CAPACITY
PRODUCTION CAPACITY
QC CAPACITY
FULFILLMENT CAPACITY
CUSTOMER OPS CAPACITY
```

---

# 96. Capacity Bottleneck

Growth should target actual bottleneck.

Example:

```text id="p5dc7e"
sales strong
production overloaded
```

Adding more ads worsens the system.

---

# 97. Service Quality

Service quality includes:

```text id="24jfsc"
OUTPUT QUALITY
COMMUNICATION
TIMELINE
ACCURACY
EXPECTATION MANAGEMENT
```

Great product with chaotic service is still poor service.

---

# 98. Quality Incident

Examples:

- wrong product,
- artwork wrong,
- missed deadline,
- incorrect quantity,
- shipment error.

Incidents should be logged.

---

# 99. Service Recovery

Canonical:

```text id="mc6m68"
IDENTIFY
↓
OWN
↓
CORRECT
↓
COMMUNICATE
↓
LEARN
```

---

# 100. Customer Experience Principle

Customer should always know:

```text id="cge00h"
WHAT IS HAPPENING?

WHAT IS NEEDED FROM ME?

WHAT HAPPENS NEXT?
```

Especially for multi-step services.

---

# 101. Service Status

Customer-facing statuses should be understandable.

Example:

```text id="cw2su5"
Brief Received
Quote Sent
Waiting Approval
In Production
QC
Ready to Ship
Completed
```

Internal system may use more detailed states.

---

# 102. Communication Cadence

Complex projects should not require customer to constantly ask:

> “sudah sampai mana?”

Status communication should be proactive where practical.

---

# 103. Custom Experience

Custom should feel:

```text id="8spwj7"
FAST
SIMPLE
GUIDED
```

---

# 104. Business Experience

Business should feel:

```text id="5ynnih"
STRUCTURED
PROFESSIONAL
ACCOUNTABLE
```

---

# 105. Merch Experience

Merch should feel:

```text id="b86dy4"
COLLABORATIVE
TRANSPARENT
SCALABLE
```

---

# 106. Studio Experience

Studio should feel:

```text id="sgimuc"
CREATIVE
BUT
PRODUCTION-AWARE
```

Design should actually be manufacturable.

---

# 107. Supply Experience

Supply should feel:

```text id="pyvukn"
FAST
TECHNICAL
PREDICTABLE
```

---

# 108. Fulfill Experience

Fulfill should feel:

```text id="pphrd5"
INVISIBLE
RELIABLE
TRACEABLE
```

Good fulfillment is often unnoticed because things simply work.

---

# 109. Service Channel Strategy

Services can receive leads via:

```text id="zsfsap"
Website
WhatsApp
Referral
Social
Outbound
Partner
```

All leads should ideally converge into one canonical pipeline.

---

# 110. WhatsApp Role

WhatsApp can remain customer-friendly interface.

It should not become permanent source of truth for:

- quote,
- requirements,
- status.

Important data must enter system.

---

# 111. Service Website Role

Website should:

- explain offer,
- qualify intent,
- collect key requirements,
- route lead.

It does not need to fully automate complex projects initially.

---

# 112. Self-Service Rule

Service can become self-service if:

```text id="e2pdkt"
OPTIONS STANDARDIZED
+
PRICE PREDICTABLE
+
ERROR RISK LOW
```

Example:

basic Custom may eventually become self-service.

Complex Business remains consultative.

---

# 113. Consultative Rule

Consultative selling is useful when:

- requirements high variance,
- order value high,
- risk significant.

---

# 114. Service Portfolio Complexity

Six service lines do not mean all six should be actively marketed.

Architecture:

```text id="6o8equ"
DEFINED
```

Roadmap:

```text id="jwhwm4"
ACTIVE / FUTURE
```

must remain separate.

---

# 115. Current Activation Priority

Recommended current sequence:

```text id="zdu2vv"
CUSTOM
↓
BUSINESS
↓
MERCH
↓
SUPPLY / FULFILL
```

Studio develops alongside as supporting capability.

---

# 116. Why Custom First

Custom shares the most with existing Commerce operations:

- garment,
- production,
- fulfillment.

Lowest adjacency gap.

---

# 117. Why Business Next

Business extends Custom into:

- quantity,
- quotation,
- organizational procurement.

---

# 118. Why Merch Afterward

Merch requires:

- creator relationship,
- commerce,
- payout,
- repeat fulfillment.

More complex but high leverage.

---

# 119. Why Supply Later

Supply can require:

- working capital,
- volume,
- procurement sophistication.

---

# 120. Why Fulfill Later

External fulfillment should follow proven internal excellence.

---

# 121. Studio Activation

Studio can support internal needs from day one.

External service activation should depend on:

- demand,
- capacity,
- profitable scope.

---

# 122. Service Portfolio Map

```text id="mwr47q"
                     TEEStock SERVICES

   CUSTOMER-SPECIFIC                       INFRASTRUCTURE
          │                                      │
          │                                      │
       CUSTOM                                 SUPPLY
          │                                      │
       BUSINESS                               FULFILL
          │                                      │
        MERCH ─────────── STUDIO ────────────────┘
```

Studio crosses customer/product development needs.

---

# 123. Service Customer Journey

```text id="1dpxk6"
DISCOVER
↓
INQUIRE
↓
QUALIFY
↓
DEFINE
↓
QUOTE
↓
APPROVE
↓
DELIVER
↓
FOLLOW-UP
↓
REPEAT / EXPAND
```

---

# 124. Service Cross-Sell

Examples:

```text id="l11f1c"
Custom customer
→ Business

Creator collaboration
→ Merch

Business customer
→ Fulfill

Supply customer
→ Production / Fulfill
```

Cross-sell should be need-driven.

---

# 125. Service Retention

Retention in Services depends on:

```text id="t9rz9q"
RELIABILITY
MEMORY
CONVENIENCE
CONSISTENCY
```

A repeat customer should not have to rebuild every requirement from zero.

---

# 126. Account Memory

System should eventually remember:

- previous products,
- sizes,
- artwork,
- delivery addresses,
- pricing agreement,
- preferences.

This creates switching cost through convenience, not lock-in.

---

# 127. Repeat Order

Repeat order should be easier than first order.

Ideal:

```text id="n87lqh"
PAST ORDER
↓
DUPLICATE
↓
EDIT QUANTITY / DATE
↓
APPROVE
```

---

# 128. Service Metrics

Each Service Line should measure four categories.

## Demand

```text id="8713de"
Leads
Qualified Leads
Conversion
```

## Economics

```text id="3fc58z"
Revenue
Contribution
Average Order/Project Value
```

## Operations

```text id="g51u7i"
Lead Time
Revision
Error
On-Time Delivery
```

## Capacity

```text id="9jmfqk"
Hours
Jobs
Bottleneck
Founder Load
```

---

# 129. Service-Specific Metrics

Custom:

```text id="t28vmk"
Quote conversion
Revision rate
Turnaround
```

Business:

```text id="md7kfg"
Pipeline
Win rate
Repeat order
```

Merch:

```text id="y7bgtt"
Active creators
Creator GMV
Payout accuracy
```

Supply:

```text id="jpm6aw"
Order frequency
Volume
Working capital
```

Fulfill:

```text id="g9mqzz"
Cost/order
Pick accuracy
SLA
```

---

# 130. Service Portfolio Review

Each Service Line should periodically be classified:

```text id="yw4gdt"
PILOT
CORE
GROWTH
MAINTAIN
PAUSED
SUNSET
```

---

# 131. Service Expansion Decision

Scale if:

```text id="vnfo4j"
DEMAND PROVEN
+
MARGIN HEALTHY
+
PROCESS REPEATABLE
+
CAPACITY EXPANDABLE
```

---

# 132. Service Kill Criteria

Pause/sunset if:

```text id="shk0vj"
DEMAND WEAK
MARGIN POOR
ERROR HIGH
COMPLEXITY EXCESSIVE
STRATEGIC FIT LOW
```

---

# 133. Service vs Commerce

Canonical distinction:

```text id="7l6dne"
COMMERCE
customer buys existing product.

SERVICES
TeeStock performs work for a customer need.
```

---

# 134. Service vs Program

```text id="p1s70j"
SERVICE
TeeStock performs capability.

PROGRAM
external participant joins ecosystem.
```

Example:

```text id="at9omf"
Creator Program
→ relationship mechanism

TeeStock Merch
→ service capability
```

---

# 135. Service vs Infrastructure

```text id="hfqslt"
SERVICE
externally monetized capability.

INFRASTRUCTURE
internal repeatable capability.
```

Same capability can be both.

---

# 136. Service vs Product

Service may produce a Product.

But Product remains separate entity.

Example:

```text id="4pl80n"
TeeStock Custom
↓
produces
Custom Tee Order Item
```

---

# 137. Service Naming Governance

Use functional master-branded naming:

```text id="l41q7m"
TeeStock Custom
TeeStock Business
TeeStock Merch
TeeStock Studio
TeeStock Supply
TeeStock Fulfill
```

Do not create independent brand names without strategic reason.

---

# 138. Service Messaging Principle

Customer-facing messaging should explain:

```text id="z1haji"
WHO IT IS FOR
WHAT PROBLEM IT SOLVES
WHAT TEEStock DOES
HOW TO START
```

---

# 139. Service Documentation Template

Every Service Line document must define:

```text id="7vfomq"
1. Purpose
2. Customer
3. Jobs to Be Done
4. Value Proposition
5. Offering
6. Scope
7. Exclusions
8. Workflow
9. Inputs
10. Outputs
11. Pricing Logic
12. SLA
13. Quality Standard
14. Economics
15. Metrics
16. Automation
17. Risks
18. Activation Stage
```

---

# 140. Service Data Model Direction

High-level:

```text id="ezql7x"
CUSTOMER
↓
LEAD
↓
SERVICE LINE
↓
REQUIREMENT
↓
QUOTE
↓
ORDER / PROJECT
↓
WORK ORDER
↓
DELIVERABLE
↓
FULFILLMENT
```

---

# 141. Service Project Lineage

Ideal future:

```text id="1w9pd7"
Lead
→ Opportunity
→ Quote
→ Order
→ Production
→ Invoice
→ Delivery
```

No manual re-entry between stages.

---

# 142. MGBOS Role

MGBOS should eventually coordinate:

```text id="st75in"
Lead Routing
Qualification
Quoting
Project Status
Production Jobs
Payments
Capacity
Customer Communication
Metrics
```

---

# 143. Service Automation Maturity

```text id="z5k7ec"
LEVEL 0
Manual

LEVEL 1
Templates

LEVEL 2
Rules

LEVEL 3
Workflow Automation

LEVEL 4
AI-Assisted

LEVEL 5
Exception-Based Management
```

---

# 144. Exception-Based Management

Desired mature state:

```text id="3rcgf6"
SYSTEM HANDLES NORMAL CASES
↓
HUMAN HANDLES EXCEPTIONS
```

Not:

```text id="31d1b3"
FOUNDER HANDLES EVERY ORDER
```

---

# 145. Strategic Service Goal

Long term, Services should become:

> **repeatable apparel capabilities that can be consumed by customers without requiring TeeStock to reinvent the workflow every time.**

---

# 146. What TeeStock Services Must Not Become

## General Agency

Unrelated service requests are out of scope.

## Infinite Customization Business

Too much exception destroys scale.

## Quote-by-Feeling Operation

Pricing must become systematic.

## Founder Inbox Business

Customer relationship must move into systems.

## Hidden-Labor Business

Human effort must be measured.

## Tech Platform Before Demand

Manual operation first.

---

# 147. Canonical Services Summary

```text id="c2b8ox"
CUSTOM
Make customer ideas.

BUSINESS
Solve organizational apparel needs.

MERCH
Operate merchandise.

STUDIO
Create apparel and brand assets.

SUPPLY
Provide apparel inputs.

FULFILL
Operate physical backend.
```

---

# 148. Canonical Service Role Summary

```text id="fw8nm5"
CUSTOM
customer-specific production

BUSINESS
B2B project solution

MERCH
creator / brand commerce backend

STUDIO
creative capability

SUPPLY
B2B product supply

FULFILL
operational capability
```

---

# 149. Canonical Services Principles

```text id="nr5xzn"
PRODUCTIZE WHAT REPEATS.

CLEAR SCOPE BEFORE QUOTE.

QUALIFY BEFORE COMMIT.

STANDARDIZE BEFORE AUTOMATION.

MEASURE LABOR, NOT JUST MATERIAL.

REUSE SHARED CAPABILITY.

CUSTOMIZE ONLY WHERE VALUE EXISTS.

SERVE APPAREL NEEDS, NOT EVERYTHING.
```

---

# 150. Dependency

Dokumen berikut harus mengikuti Services Overview:

1. [[bisnis/teestock/04-services/custom|custom.md]]
2. [[bisnis/teestock/04-services/business|business.md]]
3. [[bisnis/teestock/04-services/merch|merch.md]]
4. [[bisnis/teestock/04-services/studio|studio.md]]
5. [[bisnis/teestock/04-services/supply|supply.md]]
6. [[bisnis/teestock/04-services/fulfill|fulfill.md]]
7. [[bisnis/teestock/07-operations/operating-model|operating-model.md]]
8. [[bisnis/teestock/07-operations/production-system|production-system.md]]
9. [[bisnis/teestock/07-operations/order-fulfillment|order-fulfillment.md]]
10. [[bisnis/teestock/08-finance/pricing-framework|pricing-framework.md]]
11. [[bisnis/teestock/10-product-tech/automation-architecture|automation-architecture.md]]
12. [[bisnis/teestock/11-data-mgbos/canonical-data-model|canonical-data-model.md]]
13. [[bisnis/teestock/13-metrics-experiments/kpi-framework|kpi-framework.md]]

Setiap service-specific document boleh menambah workflow dan rules, tetapi tidak boleh mengubah fungsi fundamental keenam Service Lines tanpa perubahan terhadap canonical Services Architecture.