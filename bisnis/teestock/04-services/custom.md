---
title: "TeeStock Custom"
document_id: "TS-SVC-002"
version: "1.0"
status: "CANONICAL"
category: "services"
business: "teestock"
last_updated: "2026-09-28"
depends_on:
  - "TS-FND-001"
  - "TS-FND-002"
  - "TS-STR-002"
  - "TS-STR-004"
  - "TS-BRD-001"
  - "TS-BRD-004"
  - "TS-COM-003"
  - "TS-COM-005"
  - "TS-SVC-001"
---

# TeeStock Custom v1.0

> **Canonical TeeStock Custom Service Strategy**  
> Dokumen ini mendefinisikan positioning, customer, scope, offering, workflow, pricing logic, artwork handling, revisions, production, quality, SLA, automation, data model, metrics, dan service boundaries untuk TeeStock Custom.

---

# 1. Purpose

TeeStock Custom menjawab:

> **Bagaimana customer bisa mengubah ide atau desain mereka menjadi apparel tanpa harus memahami seluruh proses produksi?**

Canonical principle:

> **You create it. We make it.**

TeeStock Custom harus terasa:

```text id="qtl3no"
SIMPLE
GUIDED
RELIABLE
```

Bukan:

```text id="7c36un"
"Chat aja, nanti kita lihat bisa apa nggak."
```

---

# 2. Canonical Definition

> **TeeStock Custom adalah productized apparel customization service untuk individu, kelompok kecil, komunitas, event, dan usaha kecil yang ingin membuat apparel berdasarkan desain atau kebutuhan mereka sendiri menggunakan approved TeeStock products, production methods, dan workflow.**

---

# 3. Strategic Role

Custom memiliki empat fungsi utama:

```text id="yv4mkh"
SERVICE REVENUE
+
CAPABILITY VALIDATION
+
CUSTOMER ACQUISITION
+
OPERATING LEARNING
```

---

# 4. Why Custom Comes Early

Custom memiliki adjacency tinggi dengan Commerce.

Capability yang sudah dipakai:

```text id="vovyb4"
GARMENT
+
PRODUCTION
+
QC
+
PACKING
+
FULFILLMENT
```

Tambahan utama:

```text id="gyxmb4"
CUSTOMER-SPECIFIC ARTWORK
+
CONFIGURATION
```

Karena itu Custom menjadi service line pertama yang logis untuk distandardisasi.

---

# 5. Target Customer

Primary customer groups:

```text id="oq9bpk"
INDIVIDUAL
FRIEND GROUP
COMMUNITY
SMALL EVENT
MICRO BUSINESS
SMALL BRAND
```

Typical use cases:

- kaos komunitas,
- merchandise acara kecil,
- personal design,
- team shirt,
- small-batch brand test,
- gifts,
- family/group apparel.

---

# 6. Customer Job to Be Done

Customer mengatakan:

```text id="dht1yz"
"Gue punya desain."
```

atau:

```text id="ny349j"
"Gue punya ide tapi belum tahu cara produksinya."
```

Mereka membutuhkan TeeStock untuk menyederhanakan:

```text id="b2lzej"
PRODUCT CHOICE
ARTWORK CHECK
PRICE
PRODUCTION
QUALITY
DELIVERY
```

---

# 7. Value Proposition

> **Bawa desain atau ide lo. TeeStock bantu memilih product, memastikan artwork siap produksi, lalu menangani produksi sampai pengiriman.**

Core value:

```text id="9ffy0x"
LESS TECHNICAL FRICTION
+
CLEAR OPTIONS
+
PREDICTABLE OUTCOME
```

---

# 8. Custom Positioning

TeeStock Custom bukan:

- cheapest sablon,
- unlimited bespoke garment atelier,
- full creative agency,
- garment factory for every specification.

Positioning:

> **Modern, guided custom apparel service with clear standards.**

---

# 9. Service Scope

Core scope:

```text id="u7fhov"
APPROVED GARMENTS
+
CUSTOMER ARTWORK
+
APPROVED DECORATION
+
STANDARD PACKING
+
DELIVERY
```

Optional:

```text id="pyi4ba"
Basic Artwork Adjustment
Studio Design Service
Special Packaging
Multiple Delivery Locations
```

tergantung offering.

---

# 10. Default Service Model

Recommended early model:

```text id="ywcqiw"
CUSTOMER CHOOSES
Product
Color
Size
Quantity
Artwork

TEEStock HANDLES
Artwork Check
Production
QC
Packing
Shipping
```

---

# 11. Custom Product Architecture

Custom should use existing Garment Platforms where possible.

Example:

```text id="kmkxj7"
TeeStock Essentials
Heavyweight Tee
```

can also become:

```text id="jkj1cz"
Custom Configuration
Heavyweight Tee
+
Customer Artwork
```

This creates shared inventory leverage.

---

# 12. Approved Product Menu

Early Custom should not offer unlimited garment choices.

Recommended:

```text id="w0f6q2"
CORE TEE
HEAVYWEIGHT TEE
OVERSIZED TEE
```

or smaller.

Exact lineup follows tested Garment Platforms.

---

# 13. Why Limited Product Menu

Benefits:

```text id="vexs14"
FASTER QUOTING
EASIER INVENTORY
BETTER QC
CLEARER CUSTOMER CHOICE
LOWER ERROR
```

---

# 14. Custom Product Expansion

Add new garment only if:

```text id="8r4b1o"
REPEATED CUSTOMER NEED
+
SUPPLY RELIABILITY
+
PRODUCTION COMPATIBILITY
+
ECONOMIC FIT
```

---

# 15. Decoration Methods

Custom can support approved methods such as:

```text id="7gdg8v"
DTF
SCREEN PRINT
EMBROIDERY
DTG
```

Actual active methods depend on capability.

---

# 16. Decoration Method Selection

Customer does not always need to choose technical method.

Preferred experience:

```text id="8n7wlf"
Customer explains desired result
↓
TeeStock recommends suitable method
```

Technical choice should be translated into outcome.

---

# 17. Decoration Selection Logic

Consider:

```text id="xugih8"
QUANTITY
ARTWORK
GARMENT
COLOR
DURABILITY
BUDGET
DEADLINE
```

---

# 18. Artwork Input

Customer may provide:

```text id="x2297b"
PNG
JPG
PDF
SVG
AI
EPS
```

depending technical capability.

Exact accepted formats belong in production specification.

---

# 19. Artwork States

Canonical artwork lifecycle:

```text id="g9uc25"
SUBMITTED
↓
REVIEWING
↓
NEEDS REVISION
↓
APPROVED
↓
PRODUCTION READY
```

---

# 20. Artwork Review

TeeStock should check:

```text id="ye774a"
RESOLUTION
DIMENSION
BACKGROUND
COLOR
PRINT AREA
LEGIBILITY
PRODUCTION COMPATIBILITY
IP RISK
```

---

# 21. Customer Artwork Ownership

By default, customer-provided artwork does not become TeeStock IP.

Canonical classification:

```text id="vciylt"
CUSTOMER OWNED / CUSTOMER PROVIDED
```

unless separate agreement states otherwise.

---

# 22. Customer Responsibility

Customer must confirm they have rights to use submitted artwork.

TeeStock should not assume:

> customer uploaded it, therefore usage is automatically legal.

---

# 23. Restricted Artwork

TeeStock may reject artwork involving:

- unauthorized trademarks,
- obvious copyright infringement,
- counterfeit branding,
- content outside acceptable/legal production policy.

Detailed policy belongs in Legal/IP.

---

# 24. Basic Artwork Adjustment

Basic adjustments may include:

```text id="q6eyyc"
resize
background removal
simple alignment
production preparation
```

These are not the same as:

```text id="xbxud4"
original graphic design
```

---

# 25. Design Service Escalation

If customer needs:

- concept creation,
- logo design,
- complex illustration,
- brand system,

route to:

```text id="vc6vra"
TeeStock Studio
```

rather than absorbing unlimited work into Custom.

---

# 26. Custom Service Tiers

Future service can use simple tiers.

Example conceptual:

```text id="t4t4b4"
READY ARTWORK
Customer provides production-ready file

ASSISTED
Minor artwork preparation needed

STUDIO
Creative development required
```

These are service levels, not separate brands.

---

# 27. Quantity Model

Custom can support:

```text id="7i5osd"
SINGLE UNIT
SMALL BATCH
MEDIUM BATCH
```

depending production capability.

Large organizational orders may be routed to TeeStock Business.

---

# 28. Custom vs Business Threshold

Routing should consider more than quantity.

Signals for Business:

```text id="8kff2o"
ORGANIZATION
+
FORMAL QUOTATION
+
MULTIPLE REQUIREMENTS
+
LARGER VALUE
+
COMPLEX DELIVERY
```

---

# 29. Lead Capture

Minimum inquiry data:

```text id="507o8i"
NAME
CONTACT
PRODUCT
QUANTITY
ARTWORK STATUS
DEADLINE
DELIVERY LOCATION
NOTES
```

---

# 30. Lead Qualification

Custom lead can be qualified through:

```text id="9g771k"
VALID CONTACT
+
CLEAR NEED
+
FEASIBLE PRODUCT
+
FEASIBLE DEADLINE
```

Budget can be included where necessary.

---

# 31. Qualification Output

Canonical:

```text id="o0s57z"
QUALIFIED
NEEDS_INFO
NOT_FIT
```

Avoid binary logic when information is simply incomplete.

---

# 32. Custom Funnel

```text id="px2m9q"
INQUIRY
↓
QUALIFICATION
↓
CONFIGURATION
↓
ARTWORK CHECK
↓
PRICE / QUOTE
↓
APPROVAL
↓
PAYMENT
↓
PRODUCTION
↓
QC
↓
SHIP
↓
COMPLETE
```

---

# 33. Simple vs Complex Orders

Simple order:

```text id="f4n6h8"
approved garment
ready artwork
standard placement
small quantity
```

Can become near self-service.

Complex order:

```text id="k3uyff"
multiple designs
special placement
creative assistance
large quantity
special deadline
```

requires human review.

---

# 34. Custom Configuration

Canonical configuration fields:

```text id="x95fnb"
Garment Platform
Color
Size Breakdown
Quantity
Artwork
Placement
Decoration Method
Print Size
Packaging
Deadline
```

---

# 35. Configuration ID

Each approved configuration should have unique identity.

Useful for:

- repeat order,
- production,
- quoting,
- audit.

---

# 36. Repeat Order

A repeat order should reuse existing configuration.

Flow:

```text id="2f0qgf"
PAST CONFIGURATION
↓
VERIFY STOCK / PRICE
↓
UPDATE QTY
↓
APPROVE
↓
PRODUCE
```

Customer should not upload everything again.

---

# 37. Quote Logic

Quote should derive from:

```text id="9k1lrv"
GARMENT COST
+
DECORATION COST
+
SETUP COST
+
ARTWORK SERVICE
+
PACKAGING
+
SHIPPING
+
TARGET CONTRIBUTION
```

Exact formula belongs in Finance.

---

# 38. Unit Pricing

Quantity can influence:

- production efficiency,
- decoration method,
- setup allocation,
- garment procurement.

Therefore tiered pricing may be appropriate.

---

# 39. Quote Transparency

Customer should see at minimum:

```text id="o1gbc9"
PRODUCT
QTY
UNIT PRICE
TOTAL
TIMELINE
INCLUDED SCOPE
```

No need to expose internal margin.

---

# 40. Quote Validity

Quotes should have expiry due to:

- material price changes,
- availability,
- production capacity.

---

# 41. Minimum Order Quantity

MOQ can differ by production method.

Do not create universal MOQ if operational reality differs.

---

# 42. Deposit Policy

Possible early policy:

```text id="7ht68v"
FULL PAYMENT
```

for simple custom orders.

Larger jobs may use:

```text id="km4zgl"
DEPOSIT + BALANCE
```

Exact terms belong in finance policy.

---

# 43. Production Commitment

Production should not begin until:

```text id="hudm72"
CONFIGURATION APPROVED
+
ARTWORK APPROVED
+
PAYMENT CONDITION MET
```

---

# 44. Proof Approval

For orders requiring visual confirmation:

TeeStock can provide:

```text id="g1rgzq"
DIGITAL MOCKUP / PROOF
```

Customer approval creates production lock.

---

# 45. Production Lock

After approval:

major artwork/placement changes become:

```text id="59q31h"
CHANGE REQUEST
```

and may affect:

- price,
- timeline.

---

# 46. Revision Policy

Recommended distinction:

```text id="zgyak6"
PRODUCTION PREPARATION
≠
CREATIVE REVISION
```

Custom should not include unlimited design revisions by default.

---

# 47. Revision Count

Service offering can define included rounds.

Example:

```text id="pbi5z8"
1 minor adjustment
```

or another tested policy.

Exact number should be operationally defined later.

---

# 48. Change Request

A change after approval must record:

```text id="v5lftc"
WHAT CHANGED
PRICE IMPACT
TIMELINE IMPACT
APPROVAL
```

---

# 49. Production Work Order

Approved Custom Order generates Work Order containing:

```text id="6gaoa8"
Order ID
Garment SKU
Quantity
Size Breakdown
Artwork
Placement
Method
Due Date
QC Instructions
```

---

# 50. Production Routing

Production can route to:

```text id="h3yxov"
INTERNAL
MULTIGRAPH
PARTNER
```

based on:

- method,
- capacity,
- quality,
- cost,
- SLA.

Customer does not need to manage this routing.

---

# 51. Quality Standard

Every Custom order must pass:

```text id="kctc69"
GARMENT CHECK
ARTWORK CHECK
PLACEMENT CHECK
PRINT / DECORATION CHECK
QUANTITY CHECK
SIZE CHECK
```

---

# 52. QC Sampling

For larger quantities, operational QC may use:

- first-unit approval,
- process checks,
- final sampling/full check depending risk.

Exact method belongs in production system.

---

# 53. Defect Definition

Defects may include:

```text id="sqvps0"
WRONG ARTWORK
WRONG PLACEMENT
PRINT FAILURE
GARMENT DEFECT
WRONG SIZE/QTY
```

---

# 54. Tolerance

Custom work may have acceptable manufacturing tolerances.

Examples:

- placement variation,
- garment measurement tolerance,
- color variation.

These should be documented and communicated where material.

---

# 55. Customer-Supplied Garments

Default strategy should prefer TeeStock-approved garments.

Customer-supplied garments introduce:

- unknown material,
- production risk,
- replacement liability.

If accepted, special terms should apply.

---

# 56. Early Recommendation

For initial stage:

> **Do not make customer-supplied garments a default Custom offering.**

Standardized input improves quality and repeatability.

---

# 57. Packaging

Default:

```text id="1ep6ho"
STANDARD TEEStock PACKAGING
```

Optional custom packaging can become add-on or Studio/Business scope.

---

# 58. Shipping

Shipping options depend on:

- quantity,
- destination,
- urgency.

Tracking should attach to canonical order.

---

# 59. Multi-Address Delivery

Not necessary for initial simple Custom.

Can become:

- add-on,
- Business feature,
- Merch/Fulfill capability.

---

# 60. SLA Architecture

Custom should eventually define:

```text id="yc07qj"
RESPONSE
ARTWORK REVIEW
QUOTE
PRODUCTION
SHIPPING
```

SLAs can vary by configuration.

---

# 61. Production Lead Time

Lead time begins from a clearly defined event.

Recommended:

```text id="5kjxm0"
PAYMENT + FINAL APPROVAL
```

not first inquiry.

---

# 62. Rush Orders

Rush order can be accepted only if:

```text id="x8m1a4"
CAPACITY AVAILABLE
+
SUPPLY AVAILABLE
+
QUALITY NOT COMPROMISED
```

Potential rush fee may apply.

---

# 63. Deadline Promise

Do not promise based only on desired customer date.

System should assess:

```text id="xeg8qr"
MATERIAL
PRODUCTION CAPACITY
QC
SHIPPING
```

---

# 64. Customer Statuses

Recommended customer-facing:

```text id="1fqfw8"
Request Received
Waiting for Details
Artwork Review
Waiting Approval
Payment Pending
In Production
QC
Ready to Ship
Shipped
Completed
```

---

# 65. Internal Statuses

Backend may be more detailed.

Customer-facing states should remain simple.

---

# 66. Communication Principle

Customer should not have to ask:

> “udah sampai mana?”

For important state changes, send proactive update.

---

# 67. WhatsApp Role

WhatsApp can be primary conversational surface.

But important fields should be stored structurally.

WhatsApp must not remain sole repository for:

- artwork approval,
- pricing,
- configuration.

---

# 68. Website Role

Early Custom page should:

```text id="dl2x41"
EXPLAIN
QUALIFY
COLLECT
ROUTE
```

Not necessarily fully automate every configuration.

---

# 69. Future Custom Builder

Possible future interface:

```text id="0r5duf"
CHOOSE PRODUCT
↓
CHOOSE COLOR
↓
CHOOSE SIZE/QTY
↓
UPLOAD ARTWORK
↓
CHOOSE PLACEMENT
↓
ESTIMATE
↓
SUBMIT
```

Only build after options are standardized.

---

# 70. Self-Service Eligibility

A configuration can become self-service if:

```text id="34hafl"
PRICE DETERMINISTIC
+
PRODUCTION LOW-RISK
+
OPTIONS STANDARD
+
ARTWORK CHECK AUTOMATABLE/REVIEWABLE
```

---

# 71. Pricing Automation

Future pricing engine can calculate based on:

```text id="w38amc"
GARMENT
METHOD
PRINT SIZE
PLACEMENTS
QUANTITY
SERVICE LEVEL
```

with margin guardrails.

---

# 72. Automation Stages

```text id="l2uav3"
STAGE 1
manual inquiry + spreadsheet

STAGE 2
structured form + templates

STAGE 3
automatic qualification + quote assist

STAGE 4
self-service configuration

STAGE 5
exception-based operation
```

---

# 73. Lead Automation

Potential workflow:

```text id="oc3vax"
FORM
↓
VALIDATE CONTACT
↓
CHECK REQUIREMENTS
↓
CLASSIFY ORDER
↓
ROUTE
```

---

# 74. AI Artwork Assistance

AI can assist with:

- image quality detection,
- background identification,
- placement suggestions,
- requirement summary.

It must not automatically approve legal/IP concerns.

---

# 75. AI Customer Assistance

AI can answer standardized questions:

- size,
- product,
- workflow,
- status,
- file format.

Escalate exceptions to human.

---

# 76. AI Quote Assistance

AI can summarize inquiry and propose configuration.

Final pricing must come from canonical pricing rules.

AI cannot invent prices.

---

# 77. Service Economics

Custom economics should measure:

```text id="3z8c0t"
REVENUE
COGS
DECORATION COST
SERVICE LABOR
PAYMENT COST
PACKAGING
CONTRIBUTION
```

---

# 78. Human Time

Track eventually:

```text id="27ep9c"
CHAT TIME
ARTWORK REVIEW TIME
QUOTE TIME
REVISION TIME
```

This identifies hidden service cost.

---

# 79. Complexity Index

Future system may classify jobs:

```text id="xopgw7"
SIMPLE
STANDARD
COMPLEX
```

based on:

- artwork,
- quantity,
- number of variants,
- placements,
- deadline.

Useful for routing and pricing.

---

# 80. Simple Custom

Example:

```text id="sijcoh"
10 tees
one artwork
front only
standard garment
```

---

# 81. Complex Custom

Example:

```text id="5h7bwb"
multiple artwork
multiple garment types
front/back
special packaging
tight deadline
```

May be routed to Business.

---

# 82. Profitability by Configuration

System should eventually identify which combinations are:

- profitable,
- high-error,
- high-support.

This guides productization.

---

# 83. Repeatability

Best Custom offerings are those with:

```text id="k73j85"
HIGH CUSTOMER VALUE
+
LOW EXCEPTION RATE
+
CLEAR PRODUCTION
```

---

# 84. Custom Metrics

Demand:

```text id="c0esju"
Inquiries
Qualified Leads
Quote Requests
```

Conversion:

```text id="1cp73v"
Lead → Quote
Quote → Paid
```

Economics:

```text id="llhjld"
Revenue
Contribution
Average Order Value
```

Operations:

```text id="mfqiwh"
Lead Time
Revision Rate
Defect Rate
On-Time Rate
```

Capacity:

```text id="nl1gft"
Human Time per Order
Orders per Week
```

---

# 85. Customer Experience Metrics

Potential:

```text id="fnydt9"
Support Contact Rate
Repeat Custom Orders
Complaint Rate
```

---

# 86. Repeat Order Rate

Especially important because repeat Custom can become operationally efficient.

A repeated configuration should require significantly less effort than first order.

---

# 87. Lost Lead Reason

Track:

```text id="8vtinm"
PRICE
DEADLINE
PRODUCT NOT AVAILABLE
MINIMUM QUANTITY
NO RESPONSE
OUT OF SCOPE
```

This reveals actual market gaps.

---

# 88. Request Analysis

Repeated lost leads due to same unmet capability may justify new offering.

One unusual request does not.

---

# 89. Custom → Business Escalation

Route to Business when customer becomes:

- larger organization,
- recurring procurement,
- complex project,
- multiple deliverables.

---

# 90. Custom → Studio Escalation

Route creative needs beyond basic preparation to Studio.

---

# 91. Custom → Merch Escalation

If customer:

- has audience,
- wants recurring product sales,
- needs storefront/fulfillment,

route toward Merch.

---

# 92. Custom → Supply Escalation

If customer primarily needs blank products:

route to Supply.

---

# 93. Custom as Ecosystem Entry Point

Custom can become customer acquisition layer.

Possible journey:

```text id="hl46ch"
CUSTOM
↓
REPEAT CUSTOM
↓
BUSINESS / MERCH
↓
LONG-TERM ACCOUNT
```

---

# 94. Customer Record

A Custom Customer should remain same Customer entity if later becoming Business customer.

Do not duplicate.

---

# 95. Artwork Record

Customer artwork should be stored with:

```text id="6yujra"
OWNER
CUSTOMER
VERSION
APPROVAL
ORDER REFERENCES
```

---

# 96. Artwork Reuse

Customer can authorize reuse for repeat orders.

TeeStock should not reuse Customer Artwork for other customers.

---

# 97. Configuration Lineage

Ideal:

```text id="zv3wtg"
Inquiry
↓
Configuration
↓
Quote
↓
Order
↓
Work Order
↓
Production
```

No manual reconstruction.

---

# 98. MGBOS Entity Direction

Core future entities:

```text id="qbdksr"
CUSTOMER
LEAD
CUSTOM CONFIGURATION
ARTWORK
QUOTE
ORDER
ORDER ITEM
WORK ORDER
PRODUCTION JOB
PAYMENT
SHIPMENT
```

---

# 99. MGBOS Automation

Future MGBOS can:

- classify inquiry,
- detect missing fields,
- suggest product,
- calculate quote,
- create Work Order,
- notify customer,
- monitor deadline,
- flag exception.

---

# 100. Exception Alerts

Examples:

```text id="84ibk8"
Artwork Not Approved
Stock Insufficient
Deadline Risk
Payment Pending
Production Delay
QC Failure
```

Desired mature state:

> founder/team handles alerts, not manually checks every order.

---

# 101. Service Quality Failure

If Custom output fails TeeStock standard:

TeeStock should own resolution.

External production partner does not remove TeeStock accountability to customer.

---

# 102. Reprint Policy

Eligible production defect may require:

```text id="ej2kh9"
REPRINT
```

rather than forcing customer to absorb issue.

Exact warranty rules belong in Returns/Warranty policy.

---

# 103. Customer Error

If approved artwork/configuration is produced correctly but customer later changes preference:

that is not production defect.

Policy must separate:

```text id="k46r0m"
TEEStock ERROR
vs
CUSTOMER CHANGE
```

---

# 104. Cancellation

Cancellation terms depend on stage.

Possible:

```text id="z1cwau"
Before Production
→ may be cancellable

After Production Started
→ limited / non-cancellable
```

Exact terms belong in commerce/customer policy.

---

# 105. Custom Inventory Model

Preferred:

```text id="4j1a0l"
SHARED BASE GARMENT INVENTORY
```

rather than dedicated Custom inventory.

---

# 106. Stock Reservation

When Custom Order confirmed:

required base garments should be:

```text id="w118uf"
RESERVED
```

to prevent double-selling.

---

# 107. Production Material

Decoration consumables should eventually be tracked based on operational value.

Not every low-value consumable requires complex tracking initially.

---

# 108. Capacity Reservation

For larger order:

system should reserve:

- production slot,
- material,
- fulfillment capacity

where necessary.

---

# 109. Custom and MultiGraph

MultiGraph may serve as internal/related production provider.

Canonical relationship:

```text id="cyzzds"
TEEStock
owns customer relationship

MULTIGRAPH / PARTNER
may provide production capability
```

Customer experience remains TeeStock responsibility.

---

# 110. Internal Transfer Economics

If MultiGraph performs production:

TeeStock should still know:

```text id="lpt7q8"
TRANSFER / PRODUCTION COST
```

for true service profitability.

---

# 111. Partner Production

External partner must meet approved:

```text id="ipuf1d"
QUALITY
COST
CAPABILITY
LEAD TIME
```

Partner choice is operational.

Not customer burden.

---

# 112. Production Routing Future

Future decision engine may choose provider based on:

```text id="wjicwu"
METHOD
CAPACITY
LOCATION
COST
SLA
QUALITY SCORE
```

---

# 113. Current Activation Scope

Recommended V1 Custom:

```text id="wg66ai"
T-SHIRTS
LIMITED GARMENT PLATFORMS
LIMITED PRINT METHODS
STANDARD PLACEMENTS
CUSTOMER ARTWORK
STANDARD PACKAGING
```

---

# 114. V1 Exclusions

Initially avoid:

```text id="2lt0yw"
fully bespoke garment manufacturing
complex cut-and-sew
unlimited placements
complex embroidery programs
customer-supplied garments
multi-location fulfillment
unlimited artwork revisions
```

unless operationally proven.

---

# 115. V2 Expansion

Possible:

```text id="v7omkb"
MORE GARMENTS
MORE METHODS
SELF-SERVICE BUILDER
BULK CONFIGURATION
REPEAT ORDER PORTAL
```

---

# 116. V3 Expansion

Possible:

```text id="yw3sg9"
PERSONALIZATION
API / PROGRAMMATIC ORDERS
AUTOMATED ROUTING
DISTRIBUTED PRODUCTION
```

only if demand justifies.

---

# 117. Custom Productization Loop

```text id="c4jv6v"
CUSTOM REQUEST
↓
REPEAT REQUEST
↓
STANDARD OPTION
↓
PRICING RULE
↓
WORKFLOW
↓
AUTOMATION
```

This is how Services become scalable.

---

# 118. Exception-to-Product Loop

Repeated customer request can become:

- new garment,
- new placement,
- new package,
- new service offering.

But only after validation.

---

# 119. Custom Failure Modes

## Too Many Options

Customer confused, operations fragmented.

## Quote by Feeling

Margins inconsistent.

## Unlimited Revision

Labor explodes.

## No Production Lock

Last-minute changes create errors.

## Artwork Stored in Chat Only

No traceability.

## Manual Repeat Orders

Lost leverage.

## Promise Before Capacity Check

Deadline failure.

---

# 120. What TeeStock Custom Must Not Become

## Everything Is Possible Service

No boundaries.

## Cheapest Sablon

Competing purely on price.

## Creative Agency Hidden Inside Custom

Design complexity must route to Studio.

## Bespoke Garment Factory

Unless later deliberately activated.

## Founder-Dependent Service

Process must progressively enter system.

---

# 121. Canonical Custom Summary

```text id="lpo1ya"
CUSTOMER BRINGS
Idea / Artwork

TEEStock PROVIDES
Product
Production
Quality
Fulfillment

CUSTOMER GETS
Custom Apparel
without managing production complexity
```

---

# 122. Canonical Workflow Summary

```text id="gvwddm"
INQUIRE
↓
QUALIFY
↓
CONFIGURE
↓
CHECK ARTWORK
↓
PRICE
↓
APPROVE
↓
PAY
↓
PRODUCE
↓
QC
↓
SHIP
```

---

# 123. Canonical Custom Principles

```text id="aa8ybl"
GUIDE BEFORE SELL.

LIMIT OPTIONS BEFORE CHAOS.

APPROVED GARMENTS BEFORE RANDOM SOURCING.

ARTWORK APPROVAL BEFORE PRODUCTION.

SCOPE BEFORE PRICE.

PAYMENT BEFORE COMMITMENT.

STANDARDIZE BEFORE SELF-SERVICE.

REPEAT CONFIGURATION BEFORE REBUILDING.

QUALITY BEFORE DEADLINE PROMISE.
```

---

# 124. Dependency

Dokumen berikut harus follow TeeStock Custom Strategy:

1. `04-services/business.md`
2. `04-services/studio.md`
3. `07-operations/production-system.md`
4. `07-operations/quality-control.md`
5. `07-operations/inventory-system.md`
6. `07-operations/order-fulfillment.md`
7. `08-finance/unit-economics.md`
8. `08-finance/pricing-framework.md`
9. `10-product-tech/automation-architecture.md`
10. `11-data-mgbos/canonical-data-model.md`
11. `11-data-mgbos/event-model.md`
12. `12-legal-ip/customer-commerce-policy.md`
13. `13-metrics-experiments/kpi-framework.md`

TeeStock Custom boleh berkembang menjadi lebih otomatis dan lebih fleksibel, tetapi setiap expansion harus tetap mempertahankan productized-service principle dan menggunakan canonical garment, artwork, order, production, serta pricing systems.