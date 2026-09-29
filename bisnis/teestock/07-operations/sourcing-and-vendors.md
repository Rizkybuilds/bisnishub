---
title: "TeeStock Sourcing & Vendors"
date: "2026-09-28"
bisnis: teestock
kategori: operasional
status: active
tags:
  - bisnis/teestock
  - kategori/operasional
  - teestock/canonical
  - teestock/operations
document_id: "TS-OPS-002"
version: "1.0"
category: "operations"
business: "teestock"
last_updated: "2026-09-28"
path: "07-operations/sourcing-and-vendors.md"
depends_on:
  - "TS-FND-001"
  - "TS-FND-002"
  - "TS-STR-001"
  - "TS-STR-002"
  - "TS-STR-003"
  - "TS-STR-004"
  - "TS-COM-003"
  - "TS-COM-005"
  - "TS-SVC-006"
  - "TS-PRG-004"
  - "TS-OPS-001"
---


# TeeStock Sourcing & Vendors v1.0

> [!tip] **Canonical TeeStock Sourcing, Supplier & Vendor Management System  **
> Dokumen ini mendefinisikan sourcing strategy, supplier/vendor discovery, qualification, Approved Vendor List, supplier-product mapping, commercial terms, MOQ, lead time, purchase orders, landed cost, dual sourcing, supplier scorecards, dependency risk, incoming quality, replenishment, negotiation, vendor lifecycle, dan hubungan antara ordinary vendor dengan TeeStock Partner Program.
>
> [!info] **Dependencies & Data Flow (SSOT)**
> [[bisnis/teestock/00-foundation/teestock-master-definition|TS-FND-001: TeeStock Master Definition]] • [[bisnis/teestock/00-foundation/glossary|TS-FND-002: TeeStock Glossary]] • [[bisnis/teestock/01-strategy/business-thesis|TS-STR-001: TeeStock Business Thesis]] • [[bisnis/teestock/01-strategy/business-model|TS-STR-002: TeeStock Business Model]] • [[bisnis/teestock/01-strategy/ecosystem-architecture|TS-STR-003: TeeStock Ecosystem Architecture]] • [[bisnis/teestock/01-strategy/growth-strategy|TS-STR-004: TeeStock Growth Strategy]] • [[bisnis/teestock/03-commerce/teestock-essentials|TS-COM-003: TeeStock Essentials]] • [[bisnis/teestock/03-commerce/product-taxonomy|TS-COM-005: TeeStock Product Taxonomy]] • [[bisnis/teestock/04-services/supply|TS-SVC-006: TeeStock Supply]] • [[bisnis/teestock/06-programs/partner-program|TS-PRG-004: TeeStock Partner Program]] • [[bisnis/teestock/07-operations/operating-model|TS-OPS-001: TeeStock Operating Model]]


---

# 1. Purpose

Sourcing & Vendors menjawab:

> **Bagaimana TeeStock memperoleh produk, bahan, dan external capabilities dengan kualitas, harga, lead time, dan reliability yang cukup untuk mendukung customer promise secara konsisten?**

Canonical principle:

> **Source for reliability, not price alone.**

---

# 2. Canonical Definition

> **TeeStock Sourcing adalah sistem untuk menemukan, mengevaluasi, mengontrak, membeli dari, mengukur, dan mengembangkan suppliers serta vendors yang menyediakan products, materials, packaging, production inputs, dan other external operational requirements untuk ecosystem TeeStock.**

---

# 3. Strategic Role

Sourcing mempengaruhi langsung:

```text
PRODUCT QUALITY
+
MARGIN
+
LEAD TIME
+
INVENTORY
+
WORKING CAPITAL
+
CUSTOMER EXPERIENCE
```

Karena itu sourcing bukan sekadar:

> mencari harga termurah.

---

# 4. Core Sourcing Philosophy

Canonical:

```text
RIGHT PRODUCT
+
RIGHT QUALITY
+
RIGHT COST
+
RIGHT QUANTITY
+
RIGHT TIME
+
RIGHT SOURCE
```

---

# 5. Lowest Price Is Not Lowest Cost

A supplier with low unit price may create:

```text
DEFECT
DELAY
REWORK
STOCKOUT
EXTRA FREIGHT
ADMIN BURDEN
```

which makes total cost higher.

---

# 6. Total Sourcing Outcome

TeeStock should optimize:

```text
QUALITY
+
LANDED COST
+
RELIABILITY
+
FLEXIBILITY
+
CASH IMPACT
```

---

# 7. Supplier vs Vendor vs Partner

Canonical distinction:

```text
SUPPLIER
provides physical goods/materials.

VENDOR
broader external commercial provider.

PARTNER
qualified recurring external capability
with deeper operational governance.
```

A company may hold more than one role.

---

# 8. Example

A blank apparel manufacturer may be:

```text
SUPPLIER
```

for TeeStock Essentials.

If TeeStock later relies on them strategically with:

- capacity commitments,
- shared forecasting,
- formal SLA,

they may also become:

```text
PARTNER PROGRAM PARTICIPANT
```

---

# 9. Not Every Vendor Is a Partner

Canonical:

> **Use the lightest governance appropriate to the risk and strategic importance.**

One-off low-risk vendor does not need Partner Program complexity.

---

# 10. Sourcing Scope

Potential categories:

```text
GARMENTS
FABRIC
TRIMS
PACKAGING
PRINT MATERIALS
ACCESSORIES
PRODUCTION CONSUMABLES
LOGISTICS SUPPLIES
OTHER APPROVED INPUTS
```

---

# 11. Sourcing Strategy

Each important Product Family should define:

```text
SOURCE MODEL
```

Potential:

```text
SINGLE SOURCE
DUAL SOURCE
MULTI SOURCE
DIRECT MANUFACTURER
DISTRIBUTOR
IMPORTER
LOCAL SUPPLIER
```

---

# 12. Source Strategy Is Product-Specific

Do not force same supplier model for every product.

Example:

Core heavyweight tee may justify:

```text
DUAL SOURCE
```

while rare specialty product may remain:

```text
SINGLE SOURCE
```

---

# 13. Sourcing Categories

Useful internal classification:

```text
STRATEGIC
CRITICAL
LEVERAGE
ROUTINE
```

---

# 14. Strategic Source

High impact on:

- brand differentiation,
- product quality,
- margin.

Requires stronger relationship.

---

# 15. Critical Source

Hard to replace and operationally essential.

Primary concern:

```text
SUPPLY RISK
```

---

# 16. Leverage Source

Meaningful spend with multiple alternatives.

Opportunity for:

- negotiation,
- consolidation.

---

# 17. Routine Source

Low-risk, low-value, easily replaceable.

Keep process efficient.

---

# 18. Supplier Discovery

Potential sources:

```text
INDUSTRY NETWORK
REFERRAL
MARKET RESEARCH
TRADE SHOW
DIRECT OUTREACH
EXISTING PARTNERS
MULTIGRAPH NETWORK
INBOUND SUPPLIERS
```

---

# 19. Discovery Record

Potential:

```text
Vendor Name
Category
Contact
Location
Source
Products
Initial Notes
Status
```

---

# 20. Vendor Lifecycle

Canonical:

```text
DISCOVERED
↓
SCREENING
↓
SAMPLE / TRIAL
↓
QUALIFIED
↓
APPROVED
↓
ACTIVE
↓
PREFERRED / BACKUP
↓
PROBATION
↓
INACTIVE / SUSPENDED / EXITED
```

---

# 21. Screening

Initial screening answers:

```text
Can they provide what we need?

Can they meet basic spec?

Is pricing approximately viable?

Is MOQ usable?

Is lead time workable?
```

---

# 22. Qualification

Supplier qualification should consider:

```text
PRODUCT QUALITY
COMMERCIAL TERMS
MOQ
LEAD TIME
CAPACITY
CONSISTENCY
COMMUNICATION
LOCATION
RISK
```

---

# 23. Qualification Depth

Higher-risk suppliers require deeper qualification.

Example:

Core garment supplier deserves more scrutiny than office-supply vendor.

---

# 24. Sample

New physical products should usually be sampled where economically reasonable.

Sample validates:

```text
MATERIAL
FIT
COLOR
CONSTRUCTION
MEASUREMENT
FINISH
PACKING
```

---

# 25. Trial Purchase

A small commercial order can reveal:

```text
ACTUAL LEAD TIME
PACKING
QUANTITY ACCURACY
COMMUNICATION
QUALITY CONSISTENCY
```

better than sample alone.

---

# 26. Sample ≠ Production Reliability

Canonical:

> **A good sample proves capability. Repeated good deliveries prove reliability.**

---

# 27. Approved Vendor

A supplier becomes:

```text
APPROVED VENDOR
```

when it has enough evidence to be used for approved categories/products.

---

# 28. Approved Vendor List

Canonical:

```text
AVL
APPROVED VENDOR LIST
```

should identify which suppliers are approved for which category/product.

---

# 29. Approval Is Scoped

A vendor approved for:

```text
TEE SHIRT
```

is not automatically approved for:

```text
HOODIE
```

or another process.

---

# 30. Vendor Approval Record

Minimum:

```text
Vendor
Approved Category
Approved Product / Capability
Effective Date
Status
Reviewer
Conditions
```

---

# 31. Approved Product Mapping

Canonical:

```text
CANONICAL TEEStock SKU / PLATFORM
↓
SUPPLIER OFFER
```

---

# 32. Supplier Product Mapping

One TeeStock canonical SKU may map to:

```text
SUPPLIER A SKU
SUPPLIER B SKU
```

if both truly meet approved specification.

---

# 33. Supplier SKU Is Not TeeStock SKU

Critical:

```text
SUPPLIER SKU
external identifier.

TEEStock SKU
canonical internal inventory identity.
```

Do not let supplier catalog become source of product truth.

---

# 34. Supplier Offer

Future canonical object:

```text
SUPPLIER OFFER
```

which describes how a supplier can provide an approved TeeStock item.

---

# 35. Supplier Offer Fields

Potential:

```text
Supplier
Supplier SKU
Canonical TeeStock SKU
Purchase Price
MOQ
Order Increment
Lead Time
Pack Size
Availability
Currency
Effective Date
```

---

# 36. Multiple Offers

One canonical product may have multiple supplier offers.

This allows:

```text
SOURCE COMPARISON
```

without duplicating product master.

---

# 37. Product Equivalence

Two supplier products are equivalent only if approved against relevant specification.

Do not assume same:

- GSM,
- color name,
- size,
- material

means same product.

---

# 38. Alternate Source

Approved alternate source should define:

```text
FULLY INTERCHANGEABLE
or
CONDITIONAL SUBSTITUTE
```

---

# 39. Conditional Substitute

Example:

Alternative tee may be acceptable for:

```text
CUSTOM
```

but not:

```text
ESSENTIALS
```

because customer expectation differs.

---

# 40. Supplier Spec Changes

Supplier product change can create operational risk.

Track material changes in:

```text
FABRIC
GSM
FIT
COLOR
CONSTRUCTION
PACKING
```

---

# 41. No Silent Supplier Change

If supplier materially changes product:

requalification may be required.

---

# 42. MOQ

Minimum Order Quantity affects:

```text
CASH
INVENTORY
UNIT COST
RISK
```

---

# 43. MOQ Is Not Automatically Good or Bad

High MOQ can yield better unit price but create:

- excess inventory,
- working capital burden.

---

# 44. Effective MOQ

Supplier may impose:

```text
PER PRODUCT
PER COLOR
PER SIZE
PER ORDER
```

MOQ.

System should know which.

---

# 45. Order Increment

Some suppliers may require:

```text
PACK OF 6
CARTON OF 24
```

etc.

Inventory planning must respect actual purchasing increments.

---

# 46. Price Break

Supplier pricing may change by quantity.

Example conceptually:

```text
1–49
50–199
200+
```

Store as structured tiers where useful.

---

# 47. Purchase Price ≠ Landed Cost

Critical distinction:

```text
PURCHASE PRICE
+
FREIGHT
+
INBOUND
+
HANDLING
+
OTHER DIRECT ACQUISITION COST
=
LANDED COST
```

---

# 48. Landed Cost

Landed cost should feed:

- pricing,
- product margin,
- inventory valuation.

Detailed accounting belongs in Finance.

---

# 49. Hidden Supplier Cost

Potential:

```text
DEFECTS
LATE DELIVERY
REPACKING
EXTRA QC
MANUAL FOLLOW-UP
```

These should influence supplier evaluation.

---

# 50. Lead Time

Canonical:

```text
ORDER CONFIRMED
↓
GOODS AVAILABLE / DELIVERED
```

Exact definition must be clear.

---

# 51. Quoted Lead Time vs Actual Lead Time

Track both:

```text
QUOTED
ACTUAL
```

---

# 52. Lead-Time Variability

Average alone is insufficient.

High variability can cause stockouts.

---

# 53. Supplier Capacity

For strategic products, know approximate:

```text
NORMAL CAPACITY
PEAK CAPACITY
```

where possible.

---

# 54. Capacity Commitment

Large planned launches may require supplier-confirmed allocation.

Do not assume historical supply capacity is always available.

---

# 55. Purchase Request

Procurement begins from:

```text
DEMAND
REORDER SIGNAL
PROJECT REQUIREMENT
```

not random opportunity discount.

---

# 56. Purchase Request Fields

Minimum:

```text
Product / Material
Qty
Need Date
Reason
Requestor
Related Order / Forecast
```

---

# 57. Purchase Approval

Approval may depend on:

```text
VALUE
INVENTORY RISK
NON-STANDARD ITEM
SUPPLIER
PAYMENT TERMS
```

---

# 58. Purchase Order

Canonical:

```text
PO
```

creates formal supplier commitment.

---

# 59. Purchase Order Fields

Minimum:

```text
PO Number
Supplier
Item
Supplier SKU
Canonical SKU
Qty
Unit Price
Total
Delivery Date
Destination
Payment Terms
```

---

# 60. PO Versioning

Material change requires updated PO or documented amendment.

---

# 61. Supplier Confirmation

Supplier should confirm:

```text
PRODUCT
QTY
PRICE
DELIVERY
```

before purchase is considered secure.

---

# 62. PO Status

Canonical:

```text
DRAFT
SENT
CONFIRMED
PARTIALLY_RECEIVED
RECEIVED
CLOSED
CANCELLED
```

---

# 63. Open Purchase Order

Open PO represents:

```text
INBOUND COMMITMENT
```

and should feed inventory planning.

---

# 64. Inbound Inventory

Confirmed quantities may appear as:

```text
INBOUND
```

but not available until received/accepted.

---

# 65. Receiving

Canonical:

```text
PO
↓
GOODS RECEIPT
↓
COUNT
↓
QC
↓
INVENTORY
```

---

# 66. Goods Receipt

Record:

```text
PO
SKU
EXPECTED QTY
RECEIVED QTY
DATE
LOCATION
```

---

# 67. Receiving Variance

Possible:

```text
SHORT
OVER
WRONG PRODUCT
DAMAGED
```

---

# 68. Supplier Over-Delivery

Do not silently accept extra quantity without commercial/process decision.

---

# 69. Supplier Short-Delivery

Shortage should affect:

- PO,
- inbound forecast,
- reorder planning.

---

# 70. Incoming Quality Control

Incoming QC ensures products meet approved specification.

---

# 71. Incoming QC Depth

May vary:

```text
100% INSPECTION
SAMPLE INSPECTION
COUNT ONLY
```

based on risk/history.

---

# 72. New Supplier QC

New supplier usually receives more scrutiny.

---

# 73. Proven Supplier QC

Sampling may become more efficient after stable evidence.

---

# 74. Quarantine

Suspect goods enter:

```text
QUARANTINE
```

not Available.

---

# 75. Supplier Defect

Record:

```text
Vendor
PO
SKU
Batch
Defect
Qty
Evidence
```

---

# 76. Supplier Claim

Possible resolution:

```text
REPLACEMENT
CREDIT NOTE
REFUND
REWORK
ACCEPT WITH CONCESSION
```

---

# 77. Concession

TeeStock may intentionally accept minor deviation.

Must be approved and documented.

Not silently normalized.

---

# 78. Supplier Batch

Where relevant, track:

```text
LOT / BATCH
```

for:

- color shade,
- production consistency,
- defect tracing.

---

# 79. Shade Variation

Important for apparel.

Customer orders requiring uniform appearance may need same/compatible batch.

---

# 80. Replenishment

Canonical:

```text
DEMAND
+
AVAILABLE STOCK
+
INBOUND
+
LEAD TIME
+
SAFETY STOCK
=
REPLENISHMENT NEED
```

---

# 81. Reorder Point

Conceptually:

```text
EXPECTED LEAD-TIME DEMAND
+
SAFETY STOCK
```

Detailed formula belongs in Inventory System.

---

# 82. Manual Replenishment V1

Early:

MGBOS/system can surface recommendation.

Human approves purchase.

---

# 83. Demand Aggregation

For shared garment SKU:

```text
ESSENTIALS
+
SELECTS
+
CUSTOM
+
MERCH
+
ORIGINALS
+
SUPPLY
```

should contribute to total demand signal.

---

# 84. Procurement Leverage

Shared demand enables:

```text
HIGHER PURCHASE VOLUME
↓
BETTER PRICE / TERMS
↓
BETTER ECOSYSTEM ECONOMICS
```

---

# 85. Bulk Buy Discipline

Canonical:

> **Do not buy inventory merely because the supplier offered a discount.**

---

# 86. Bulk Purchase Gate

Large buy should consider:

```text
FORECAST
SELL-THROUGH
CASH
STORAGE
OBSOLESCENCE
PRICE SAVING
```

---

# 87. Economic Order Logic

A lower price is not saving if:

```text
DEAD INVENTORY COST
>
PURCHASE DISCOUNT
```

---

# 88. Safety Stock

Should reflect:

```text
DEMAND VARIABILITY
SUPPLIER LEAD TIME
SUPPLY RELIABILITY
SERVICE LEVEL NEED
CASH
```

---

# 89. Supplier Reliability

Reliability should be measured from actual deliveries.

---

# 90. Supplier Scorecard

Canonical dimensions:

```text
QUALITY
DELIVERY
COST
AVAILABILITY
COMMUNICATION
COMMERCIAL TERMS
```

---

# 91. Quality

Potential metrics:

```text
DEFECT RATE
CLAIM RATE
SPEC COMPLIANCE
```

---

# 92. Delivery

Potential:

```text
ON-TIME DELIVERY
LEAD TIME VARIANCE
FILL RATE
```

---

# 93. Cost

Track:

```text
PURCHASE PRICE
PRICE VARIANCE
LANDED COST
```

---

# 94. Availability

Track ability to supply:

- required quantity,
- required variants.

---

# 95. Communication

Assess:

- response,
- proactive issues,
- clarity.

---

# 96. Commercial Terms

Includes:

```text
MOQ
PAYMENT TERMS
PRICE STABILITY
RETURN / CLAIM SUPPORT
```

---

# 97. Supplier Score Is Not Single Truth

A single aggregate score may hide critical failure.

Always preserve underlying metrics.

---

# 98. Preferred Supplier

Supplier may become:

```text
PREFERRED
```

after proven:

```text
QUALITY
+
RELIABILITY
+
ECONOMICS
```

---

# 99. Backup Supplier

Approved secondary source.

Should be periodically validated.

---

# 100. Preferred ≠ Exclusive

TeeStock may still maintain backup capacity.

---

# 101. Supplier Probation

Use when performance deteriorates but immediate removal is unnecessary.

---

# 102. Supplier Suspension

No new POs while critical issue is reviewed.

---

# 103. Supplier Exit

Canonical:

```text
STOP NEW PURCHASE
↓
CLOSE OPEN PO
↓
RESOLVE CLAIMS
↓
SETTLE FINANCE
↓
ARCHIVE SUPPLIER
```

---

# 104. Critical Supplier Risk

Track risks such as:

```text
SINGLE SOURCE
LONG LEAD TIME
HIGH MOQ
UNSTABLE QUALITY
HIGH SPEND CONCENTRATION
GEOGRAPHIC DEPENDENCY
```

---

# 105. Supplier Concentration

Measure:

```text
% OF CATEGORY SPEND
% OF CRITICAL VOLUME
```

by supplier.

---

# 106. Concentration Is Not Always Bad

Strategic concentration can increase leverage.

But dependency must be intentional.

---

# 107. Dual Sourcing

Canonical:

```text
PRIMARY SOURCE
+
APPROVED SECONDARY SOURCE
```

---

# 108. Dual-Sourcing Benefits

Potential:

```text
RESILIENCE
NEGOTIATION
CAPACITY
CONTINUITY
```

---

# 109. Dual-Sourcing Costs

Potential:

```text
LOWER VOLUME PER SUPPLIER
MORE QC
MORE VARIATION
MORE ADMIN
```

---

# 110. Dual-Sourcing Decision

Use where risk reduction exceeds added complexity.

---

# 111. Source Switching

Switching should consider:

```text
PRODUCT CONSISTENCY
CUSTOMER EXPECTATION
INVENTORY
PRICE
QUALITY
```

---

# 112. No Silent Core Product Switch

For Essentials/core products, source changes that affect customer experience require controlled transition.

---

# 113. Supplier Negotiation

Negotiation can address:

```text
PRICE
MOQ
PAYMENT TERMS
LEAD TIME
ALLOCATION
RETURNS
PACKING
```

---

# 114. Negotiation Leverage

Can come from:

```text
VOLUME
FORECAST VISIBILITY
PAYMENT RELIABILITY
LONG-TERM RELATIONSHIP
PROCESS SIMPLICITY
```

---

# 115. Price Is Only One Negotiation Lever

Better payment term or MOQ can sometimes create more value than lower unit cost.

---

# 116. Payment Terms

Potential:

```text
PREPAID
COD
DEPOSIT
NET TERMS
```

depending supplier relationship.

---

# 117. Supplier Credit

Useful for working capital.

But should not hide poor inventory economics.

---

# 118. Early Payment Discount

Evaluate actual cash return before using.

---

# 119. Currency Exposure

If sourcing uses foreign currency:

price volatility becomes sourcing/finance risk.

Detailed policy belongs in Treasury.

---

# 120. Price Change

Supplier price changes should be versioned.

---

# 121. Price Effective Date

Store:

```text
OLD PRICE
NEW PRICE
EFFECTIVE DATE
```

---

# 122. Purchase Price Variance

Track actual purchase price relative to:

- standard,
- prior,
- budget.

---

# 123. Supplier Catalog Change

Vendor additions/deletions should not automatically change TeeStock catalog.

Canonical:

```text
SUPPLIER CATALOG
≠
TEEStock PRODUCT CATALOG
```

---

# 124. Source-on-Request

Special customer requests may require one-off sourcing.

Canonical classification:

```text
SPECIAL SOURCE
```

---

# 125. Special Source Rule

One-off sourced item should not enter Core Catalog automatically.

---

# 126. Special Source Qualification

At minimum:

```text
PRODUCT FIT
PRICE
TIMING
QUALITY RISK
SUPPLIER TRUST
```

must be acceptable.

---

# 127. Repeat Special Source

If same item repeatedly requested:

consider formal qualification/productization.

---

# 128. Supplier Onboarding Data

Minimum:

```text
Vendor ID
Business Name
Contacts
Category
Payment Details
Tax / Admin Data
Products
Terms
Status
```

---

# 129. Vendor ID

Every operational vendor should have stable canonical ID.

---

# 130. Duplicate Vendor Prevention

One supplier should not exist as multiple records because:

- spelling,
- sales contact,
- branch differences.

Entity architecture should handle relationships properly.

---

# 131. Vendor Location

May include multiple:

```text
OFFICE
WAREHOUSE
FACTORY
```

locations.

---

# 132. Supplier Contact Roles

Potential:

```text
SALES
FINANCE
OPERATIONS
OWNER
```

---

# 133. Communication Channel

WhatsApp/email can be used.

But decisions such as:

- price,
- PO,
- claims

must be reflected in canonical records.

---

# 134. Procurement Communication

Avoid ambiguous messages like:

> kirim seperti biasa ya.

PO/spec should define truth.

---

# 135. Purchase Order as Source of Commercial Truth

Canonical:

```text
PO
>
chat memory
```

---

# 136. Supplier Invoice

Invoice should reference:

```text
PO
```

where possible.

---

# 137. Three-Way Match

Mature control:

```text
PURCHASE ORDER
+
GOODS RECEIPT
+
SUPPLIER INVOICE
```

---

# 138. Invoice Variance

Flag differences in:

```text
PRICE
QTY
ITEM
```

---

# 139. Payables Approval

Payment should be based on:

- validated invoice,
- receipt,
- agreed terms.

---

# 140. Supplier Returns

Defective/incorrect inbound goods may create:

```text
RETURN TO VENDOR
```

---

# 141. Return-to-Vendor Record

Track:

```text
PO
SKU
QTY
REASON
VALUE
STATUS
```

---

# 142. Supplier Credit Note

Should reconcile with purchasing/finance.

---

# 143. Supplier Development

High-potential suppliers can be improved collaboratively.

Areas:

```text
QUALITY
PACKING
LEAD TIME
FORECAST
PROCESS
```

---

# 144. When Vendor Becomes Partner

Promote relationship toward Partner Program when:

```text
REPEAT VOLUME
+
HIGH CUSTOMER IMPACT
+
OPERATIONAL DEPENDENCY
+
CAPABILITY VALUE
```

justify deeper governance.

---

# 145. Partner Program Promotion

Possible progression:

```text
VENDOR
↓
APPROVED VENDOR
↓
STRATEGIC SUPPLIER
↓
PARTNER PROGRAM
```

Not mandatory for every supplier.

---

# 146. Partner Program Adds

Potential:

```text
CAPABILITY REGISTRY
SLA
WORK ORDERS
CAPACITY
SCORECARDS
DEEPER CONFIDENTIALITY
```

---

# 147. Internal / Related Supplier

MultiGraph or related unit may supply TeeStock.

Still record:

```text
COST
LEAD TIME
QUALITY
SERVICE
```

---

# 148. Related Party Does Not Mean Free

Canonical.

Otherwise business economics become distorted.

---

# 149. Make vs Buy

Sourcing data should support decision:

```text
BUY EXTERNAL
vs
MAKE INTERNAL
```

---

# 150. Make-vs-Buy Inputs

Consider:

```text
VOLUME
COST
CAPEX
QUALITY
CONTROL
LEAD TIME
STRATEGIC VALUE
```

---

# 151. Vertical Integration Trigger

Potential when external sourcing creates persistent:

```text
MARGIN PAIN
QUALITY PAIN
CAPACITY PAIN
CONTROL PAIN
```

and internal economics are attractive.

---

# 152. Vendor Data Model

Core future entities:

```text
VENDOR
VENDOR LOCATION
VENDOR CONTACT
SUPPLIER OFFER
PURCHASE REQUEST
PURCHASE ORDER
GOODS RECEIPT
SUPPLIER CLAIM
SCORECARD
```

---

# 153. Supplier Offer Entity

Connects:

```text
VENDOR
+
TEEStock SKU / MATERIAL
+
COMMERCIAL TERMS
```

---

# 154. Purchase Request Entity

Captures procurement need before commitment.

---

# 155. Purchase Order Entity

Captures commercial commitment.

---

# 156. Goods Receipt Entity

Captures actual inbound.

---

# 157. Supplier Claim Entity

Captures issue/recovery.

---

# 158. Scorecard Snapshot

Preserves historical supplier performance.

---

# 159. MGBOS Vendor Dashboard

Potential:

```text
OPEN PURCHASE ORDERS
LATE INBOUND
LOW STOCK RISKS
SUPPLIER PRICE CHANGES
QUALITY CLAIMS
SCORECARDS
SINGLE-SOURCE RISKS
```

---

# 160. Procurement Queue

Future queues:

```text
PURCHASE REQUESTS NEEDING APPROVAL
POs NEEDING CONFIRMATION
LATE POs
RECEIVING ISSUES
SUPPLIER CLAIMS
```

---

# 161. Replenishment Recommendation

MGBOS can recommend:

```text
BUY SKU X
QTY Y
FROM SUPPLIER Z
```

with explanation.

---

# 162. Recommendation Inputs

Potential:

```text
AVAILABLE STOCK
INBOUND
OPEN DEMAND
FORECAST
LEAD TIME
MOQ
PRICE
SAFETY STOCK
```

---

# 163. Automation Stages

Canonical:

```text
STAGE 0
Supplier memory / chat

STAGE 1
Vendor registry + PO

STAGE 2
Supplier offers + inbound tracking

STAGE 3
Replenishment rules + scorecards

STAGE 4
Automated PO recommendations

STAGE 5
Exception-based procurement orchestration
```

---

# 164. AI Role

AI may assist with:

```text
Supplier discovery summary
Quotation extraction
Price comparison
Vendor performance summary
Risk analysis
Negotiation preparation
```

---

# 165. AI Purchase Boundary

AI should not independently commit major purchase orders outside approved rules.

---

# 166. AI Supplier Selection

AI may shortlist suppliers.

Selection must remain explainable through:

```text
PRICE
QUALITY
LEAD TIME
RELIABILITY
```

---

# 167. AI Forecast

Can support replenishment recommendations.

Forecast remains uncertain and should not be treated as guaranteed demand.

---

# 168. Current Recommended V1

Start with:

```text
SMALL APPROVED VENDOR LIST
+
CORE GARMENT SUPPLIERS
+
PACKAGING SUPPLIERS
+
CANONICAL SUPPLIER PRODUCT MAPPING
+
PURCHASE ORDERS
+
RECEIVING RECORD
+
BASIC SUPPLIER SCORECARD
```

---

# 169. V1 Priority

Focus on inputs supporting:

```text
ESSENTIALS
SELECTS
CUSTOM
MERCH
ORIGINALS
```

core execution.

---

# 170. V1 Exclusions

Avoid:

```text
huge vendor database
complex procurement auction
fully automated purchasing
large speculative imports
too many interchangeable products
```

---

# 171. V2 Expansion

Possible:

```text
DUAL SOURCING
SUPPLIER OFFER VERSIONING
REORDER POINTS
PRICE HISTORY
SUPPLIER CLAIMS
```

---

# 172. V3 Expansion

Possible:

```text
FORECAST SHARING
SUPPLIER PORTAL
AUTOMATED REPLENISHMENT RECOMMENDATION
CAPACITY VISIBILITY
```

---

# 173. V4 Expansion

Possible:

```text
PREDICTIVE PROCUREMENT
DYNAMIC SOURCE SELECTION
MULTI-LOCATION SOURCING
ADVANCED SUPPLY RISK MANAGEMENT
```

only after scale.

---

# 174. Supplier Activation Gate

Supplier becomes Approved when:

```text
PRODUCT VALID
+
QUALITY ACCEPTABLE
+
COMMERCIAL TERMS VIABLE
+
TRIAL / EVIDENCE SUFFICIENT
```

---

# 175. Preferred Supplier Gate

Preferred status only after:

```text
REPEATED PERFORMANCE
+
GOOD QUALITY
+
GOOD DELIVERY
+
HEALTHY ECONOMICS
```

---

# 176. Dual-Source Gate

Add secondary source when:

```text
SUPPLY RISK
×
BUSINESS IMPACT
```

justifies added complexity.

---

# 177. Bulk Purchase Gate

Large procurement requires:

```text
DEMAND EVIDENCE
+
CASH CAPACITY
+
INVENTORY PLAN
+
ECONOMIC BENEFIT
```

---

# 178. Partner Promotion Gate

Move supplier toward Partner Program when:

```text
STRATEGIC DEPENDENCY
+
REPEAT COLLABORATION
+
CAPABILITY / CAPACITY IMPORTANCE
```

requires deeper operating relationship.

---

# 179. Supplier Failure Modes

## Cheapest Supplier Wins

Creates hidden cost.

## Supplier Catalog Becomes Product Master

Destroys product truth.

## No Supplier SKU Mapping

Creates receiving confusion.

## No Purchase Orders

Commercial ambiguity.

## No Receiving Records

Inventory becomes unreliable.

## Bulk Buying for Discount

Working capital trap.

## One Supplier for Everything

Concentration risk.

## Too Many Suppliers

Low leverage and high admin burden.

## No Price History

Poor negotiation visibility.

---

# 180. What Sourcing Must Not Become

## Random Marketplace Buying

Core products require controlled sources.

## Procurement by Founder Memory

System should preserve vendor knowledge.

## Price-Only Function

Quality and reliability matter.

## Inventory Speculation Function

Demand should lead purchasing.

## Supplier-Locked Architecture

Canonical product identity remains TeeStock-owned.

---

# 181. Sourcing Success Definition

Sourcing succeeds when:

```text
TEEStock NEEDS AN INPUT
↓
SYSTEM KNOWS
approved suppliers

approved product equivalents

current pricing

MOQ

lead time

supplier performance

available alternatives
↓
TEEStock PURCHASES
the right quantity
from the right source
at the right time
↓
GOODS ARRIVE
correctly and reliably
```

---

# 182. Canonical Procurement Summary

```text
DEMAND
creates requirement.

SOURCING
identifies approved source.

PURCHASING
creates commitment.

RECEIVING
confirms reality.

QUALITY
protects specification.

INVENTORY
records usable stock.

FINANCE
reconciles supplier obligation.

MGBOS
connects the entire chain.
```

---

# 183. Canonical Sourcing Principles

```text
RELIABILITY BEFORE LOWEST PRICE.

CANONICAL PRODUCT BEFORE SUPPLIER CATALOG.

SAMPLE BEFORE SCALE.

TRIAL BEFORE TRUST.

APPROVED SOURCE BEFORE CORE DEPENDENCY.

DEMAND BEFORE PURCHASE.

LANDED COST BEFORE PRICE COMPARISON.

PO BEFORE SUPPLIER MEMORY.

RECEIVE BEFORE AVAILABLE.

MEASURE BEFORE PREFERRED STATUS.

BACKUP WHERE RISK JUSTIFIES.

SUPPLIER DATA BEFORE PROCUREMENT AUTOMATION.
```

---

# 184. Dependency

Dokumen berikut harus follow Sourcing & Vendors:

1. [[bisnis/teestock/07-operations/production-system|production-system.md]]
2. [[bisnis/teestock/07-operations/quality-control|quality-control.md]]
3. [[bisnis/teestock/07-operations/inventory-system|inventory-system.md]]
4. [[bisnis/teestock/07-operations/order-fulfillment|order-fulfillment.md]]
5. [[bisnis/teestock/08-finance/unit-economics|unit-economics.md]]
6. [[bisnis/teestock/08-finance/cost-accounting|cost-accounting.md]]
7. [[bisnis/teestock/08-finance/treasury-policy|treasury-policy.md]]
8. [[bisnis/teestock/10-product-tech/automation-architecture|automation-architecture.md]]
9. [[bisnis/teestock/11-data-mgbos/canonical-data-model|canonical-data-model.md]]
10. [[bisnis/teestock/11-data-mgbos/entity-hierarchy|entity-hierarchy.md]]
11. [[bisnis/teestock/11-data-mgbos/event-model|event-model.md]]
12. [[bisnis/teestock/13-metrics-experiments/kpi-framework|kpi-framework.md]]

TeeStock boleh memperluas supplier network dan procurement automation seiring scale, tetapi setiap expansion harus mempertahankan canonical product truth, supplier qualification, demand discipline, working-capital control, incoming quality, dan auditable purchasing.