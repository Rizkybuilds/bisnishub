---
title: "TeeStock Business"
date: "2026-09-28"
bisnis: teestock
kategori: operasional
status: active
tags:
  - bisnis/teestock
  - kategori/operasional
  - teestock/canonical
  - teestock/services
document_id: "TS-SVC-003"
version: "1.0"
category: "services"
business: "teestock"
last_updated: "2026-09-28"
path: "04-services/business.md"
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
  - "TS-SVC-002"
---


# TeeStock Business v1.0

> [!abstract] **Canonical TeeStock Business Service Strategy  **
> Dokumen ini mendefinisikan positioning, customer architecture, opportunity management, account structure, quotation, approval, PO, payment terms, project delivery, work orders, SLA, repeat procurement, pricing logic, quality, account memory, automation, metrics, dan boundaries untuk TeeStock Business.
>
> [!info] **Dependencies & Data Flow (SSOT)**
> [[bisnis/teestock/00-foundation/teestock-master-definition|TS-FND-001: TeeStock Master Definition]] • [[bisnis/teestock/00-foundation/glossary|TS-FND-002: TeeStock Glossary]] • [[bisnis/teestock/01-strategy/business-model|TS-STR-002: TeeStock Business Model]] • [[bisnis/teestock/01-strategy/growth-strategy|TS-STR-004: TeeStock Growth Strategy]] • [[bisnis/teestock/02-brand/master-brand-strategy|TS-BRD-001: TeeStock Master Brand Strategy]] • [[bisnis/teestock/02-brand/voice-and-copy-system|TS-BRD-004: TeeStock Voice & Copy System]] • [[bisnis/teestock/03-commerce/teestock-essentials|TS-COM-003: TeeStock Essentials]] • [[bisnis/teestock/03-commerce/product-taxonomy|TS-COM-005: TeeStock Product Taxonomy]] • [[bisnis/teestock/04-services/services-overview|TS-SVC-001: TeeStock Services Overview]] • [[bisnis/teestock/04-services/custom|TS-SVC-002: TeeStock Custom]]


---

# 1. Purpose

TeeStock Business menjawab:

> **Bagaimana organisasi dapat membeli apparel dan merchandise secara profesional tanpa harus mengelola banyak vendor, proses produksi, dan detail operasional sendiri?**

Canonical principle:

> **Structured apparel solutions for organizations.**

TeeStock Business harus terasa:

```text id="biz01"
PROFESSIONAL
CLEAR
ACCOUNTABLE
REPEATABLE
```

---

# 2. Canonical Definition

> **TeeStock Business adalah B2B apparel dan merchandise service untuk perusahaan, institusi, komunitas, event organizer, hospitality, dan organisasi lain yang membutuhkan procurement apparel secara terstruktur, repeatable, dan accountable.**

---

# 3. Strategic Role

TeeStock Business memiliki lima fungsi utama:

```text id="biz02"
B2B REVENUE
+
LARGER ORDER VALUE
+
REPEAT PROCUREMENT
+
CAPABILITY UTILIZATION
+
LONG-TERM ACCOUNT RELATIONSHIP
```

---

# 4. Difference from Custom

Canonical distinction:

```text id="biz03"
TEEStock CUSTOM
individual / small-group oriented
simpler workflow
lighter commercial process

TEEStock BUSINESS
organization-oriented
formal quotation
project/account structure
larger operational responsibility
repeat procurement potential
```

Keduanya dapat menggunakan infrastructure produksi yang sama.

Commercial operating model berbeda.

---

# 5. Target Customers

Primary customer groups:

```text id="biz04"
COMPANY
SME
CORPORATE TEAM
SCHOOL
UNIVERSITY
HOSPITALITY
AGENCY
EVENT ORGANIZER
COMMUNITY ORGANIZATION
INSTITUTION
STARTUP
RETAIL / F&B BUSINESS
```

---

# 6. Typical Use Cases

Examples:

```text id="biz05"
Employee Uniform
Event T-Shirt
Company Merchandise
Onboarding Kit
Community Apparel
Hospitality Uniform
Campaign Merchandise
Corporate Gift
Team Apparel
```

---

# 7. Customer Job to Be Done

Customer typically says:

> “Kami butuh 200 kaos untuk event.”

atau:

> “Kami butuh merchandise untuk karyawan.”

atau:

> “Kami ingin vendor yang bisa menangani apparel rutin.”

What they actually need:

```text id="biz06"
SPECIFICATION
+
PROCUREMENT
+
PRODUCTION
+
QUALITY
+
TIMELINE
+
ACCOUNTABILITY
```

---

# 8. Value Proposition

> **Satu partner untuk merencanakan, memproduksi, dan mengirim apparel atau merchandise bisnis dengan proses yang jelas dan dapat diulang.**

Core value:

```text id="biz07"
LESS VENDOR COORDINATION
+
MORE PREDICTABILITY
+
CLEAR ACCOUNTABILITY
```

---

# 9. Business Positioning

TeeStock Business bukan:

- cheapest tender vendor,
- general procurement agency,
- generic merchandise broker,
- full-service event agency.

Positioning:

> **Modern B2B apparel and merchandise partner with structured delivery.**

---

# 10. Business Scope

Core scope dapat mencakup:

```text id="biz08"
APPAREL
MERCHANDISE
CUSTOMIZATION
PRODUCTION
PACKAGING
FULFILLMENT
DELIVERY
```

Optional:

```text id="biz09"
DESIGN
KIT ASSEMBLY
MULTI-LOCATION DELIVERY
REPEAT PROCUREMENT
ACCOUNT PROGRAM
```

---

# 11. Business Boundary

TeeStock Business fokus pada apparel dan merchandise.

Request seperti:

- event venue,
- catering,
- unrelated promotional goods,
- software,

tidak otomatis menjadi TeeStock Business service.

---

# 12. Account Model

B2B customer sebaiknya direpresentasikan sebagai:

```text id="biz10"
ORGANIZATION ACCOUNT
```

dengan satu atau lebih Contact Persons.

---

# 13. Organization Account

Minimum fields:

```text id="biz11"
Organization Name
Business Type
Billing Information
Shipping Locations
Tax Information if relevant
Contacts
Commercial Terms
Payment Terms
Account Status
```

---

# 14. Contact Person

One account can have several roles:

```text id="biz12"
Requester
Approver
Finance Contact
Receiving Contact
Decision Maker
```

Jangan menyimpan seluruh relationship hanya sebagai satu WhatsApp number.

---

# 15. Account vs Customer

Canonical model:

```text id="biz13"
CUSTOMER ENTITY
may represent person or organization

BUSINESS ACCOUNT
organization-specific commercial relationship
```

Technical implementation dapat menyesuaikan, tetapi relationship harus jelas.

---

# 16. Opportunity Model

Complex B2B request should become:

```text id="biz14"
OPPORTUNITY
```

before becoming Order.

Flow:

```text id="biz15"
LEAD
↓
QUALIFIED
↓
OPPORTUNITY
↓
QUOTE
↓
WON / LOST
```

---

# 17. Opportunity Purpose

Opportunity tracks:

- commercial potential,
- project need,
- expected value,
- decision process,
- timeline,
- next action.

---

# 18. Opportunity Fields

Minimum:

```text id="biz16"
Account
Primary Contact
Need
Quantity
Budget Range
Deadline
Expected Value
Stage
Probability if used
Next Action
Owner
```

Avoid fake precision in probability if not useful.

---

# 19. Lead Qualification

Qualification should consider:

```text id="biz17"
NEED CLARITY
QUANTITY
BUDGET
DEADLINE
DECISION AUTHORITY
TECHNICAL FIT
COMMERCIAL FIT
```

---

# 20. Qualification Output

Recommended:

```text id="biz18"
QUALIFIED
NEEDS_INFO
NOT_FIT
NURTURE
```

---

# 21. Business Funnel

Canonical:

```text id="biz19"
LEAD
↓
QUALIFY
↓
DISCOVERY
↓
SOLUTION
↓
QUOTE
↓
APPROVAL / PO
↓
PAYMENT CONDITION
↓
PROJECT / ORDER
↓
PRODUCTION
↓
QC
↓
DELIVERY
↓
CLOSE
↓
ACCOUNT FOLLOW-UP
```

---

# 22. Discovery

Discovery should capture:

```text id="biz20"
OBJECTIVE
AUDIENCE / USERS
PRODUCT
QUANTITY
SPECIFICATION
BRANDING
BUDGET
DEADLINE
DELIVERY
APPROVAL PROCESS
```

---

# 23. Requirement Document

Complex B2B projects should have structured requirement record.

This can include:

```text id="biz21"
Product Types
Size Breakdown
Artwork
Decoration
Packaging
Delivery Locations
Milestones
Approval Contacts
```

---

# 24. Solution Design

TeeStock translates requirement into solution.

Canonical flow:

```text id="biz22"
CUSTOMER NEED
↓
GARMENT / PRODUCT
↓
DECORATION
↓
PACKAGING
↓
FULFILLMENT
↓
COMMERCIAL TERMS
```

---

# 25. Standard vs Custom Solution

Prefer existing:

```text id="biz23"
GARMENT PLATFORM
PRODUCT
PRODUCTION METHOD
```

before creating bespoke specification.

Custom specification is justified only when business value exists.

---

# 26. Quote

B2B Quote must be formal enough for procurement.

Minimum:

```text id="biz24"
Quotation Number
Account
Contact
Scope
Product Specification
Quantity
Unit Price
Subtotal
Discount if any
Tax if applicable
Shipping
Total
Lead Time
Payment Terms
Validity
Terms
```

---

# 27. Quote Versioning

Every revision should preserve history.

Example:

```text id="biz25"
Q-2026-001 v1
Q-2026-001 v2
```

---

# 28. Quote Approval

Approval can occur via:

- signed quotation,
- written confirmation,
- Purchase Order,
- accepted digital quote.

Exact accepted methods should be standardized.

---

# 29. Purchase Order

Where customer uses PO:

```text id="biz26"
CUSTOMER PO
```

should be linked to:

```text id="biz27"
TEEStock QUOTE
+
ORDER / PROJECT
```

---

# 30. PO Is Not a Quote

Canonical distinction:

```text id="biz28"
QUOTE
TeeStock commercial offer

PO
customer purchase authorization
```

---

# 31. Contract

Larger/recurring relationship may require:

```text id="biz29"
MASTER SERVICE AGREEMENT
SUPPLY AGREEMENT
PROJECT AGREEMENT
```

Legal framework depends on relationship.

---

# 32. Payment Terms

Possible:

```text id="biz30"
FULL UPFRONT
DEPOSIT + BALANCE
NET TERMS
MILESTONE PAYMENT
```

Not every account should receive credit terms.

---

# 33. Credit Policy

Payment terms beyond upfront/deposit require:

- account approval,
- risk assessment,
- payment history,
- internal limit.

Credit terms must not be granted casually.

---

# 34. Deposit

Deposit can reserve:

- material,
- inventory,
- production capacity.

Production start conditions must be explicit.

---

# 35. Order vs Project

Use Order when:

```text id="biz31"
single standardized transaction
```

Use Project when:

```text id="biz32"
multiple deliverables
multiple milestones
complex approvals
multiple shipments
```

---

# 36. Project Structure

Possible:

```text id="biz33"
PROJECT
│
├── Deliverable
├── Work Order
├── Milestone
├── Approval
└── Shipment
```

---

# 37. Deliverable

Examples:

```text id="biz34"
200 Event Tees
50 Staff Jackets
100 Welcome Kits
```

Each should have status and acceptance criteria.

---

# 38. Milestone

Complex project may use:

```text id="biz35"
Artwork Approval
Sample Approval
Production Start
QC Complete
Delivery
```

---

# 39. Sample Approval

For material projects, sample can reduce risk.

Possible:

```text id="biz36"
DIGITAL MOCKUP
PRE-PRODUCTION SAMPLE
FIRST ARTICLE
```

depending complexity.

---

# 40. Sample Cost

Sample may be:

- included,
- charged,
- credited after order.

Policy should be clear.

---

# 41. Production Lock

After sample/artwork approval:

```text id="biz37"
SPECIFICATION LOCKED
```

Subsequent change becomes Change Request.

---

# 42. Change Request

Must capture:

```text id="biz38"
Requested Change
Reason
Affected Deliverable
Cost Impact
Timeline Impact
Approval
```

---

# 43. Scope Creep

B2B scope creep can destroy margin.

Canonical rule:

> **New requirement after approval = evaluate as change, not invisible free work.**

---

# 44. Work Order

Production should receive structured Work Order containing:

```text id="biz39"
Project / Order
Product
Garment SKU
Quantity
Size Breakdown
Artwork
Placement
Method
Packaging
Deadline
QC Profile
Delivery Plan
```

---

# 45. Multi-Product Order

Business orders commonly include:

```text id="biz40"
T-Shirt
+
Hoodie
+
Tote
+
Packaging
```

System must handle multiple Order Items / Deliverables.

---

# 46. Size Breakdown

B2B size breakdown must be captured structurally.

Avoid size data stored only in free-text chat.

---

# 47. Quantity Validation

Before production:

```text id="biz41"
TOTAL QTY
=
SUM OF SIZE BREAKDOWN
```

should reconcile.

---

# 48. Procurement

Business projects may require material procurement before production.

Track:

```text id="biz42"
Required
Ordered
Received
Reserved
Short
```

---

# 49. Capacity Check

Before confirming deadline:

check:

```text id="biz43"
MATERIAL
PRODUCTION
QC
PACKING
SHIPPING
```

---

# 50. Production Routing

Can route to:

```text id="biz44"
INTERNAL
MULTIGRAPH
APPROVED PARTNER
```

based on:

- capability,
- capacity,
- cost,
- location,
- quality,
- SLA.

---

# 51. Multi-Vendor Coordination

TeeStock may coordinate multiple production partners.

Customer should still experience:

```text id="biz45"
ONE ACCOUNTABLE TEEStock PROJECT
```

---

# 52. Quality Standard

Business QC should include:

```text id="biz46"
PRODUCT
SIZE
QTY
ARTWORK
PLACEMENT
COLOR
FINISH
PACKAGING
```

---

# 53. Quality Plan

Larger project may require:

```text id="biz47"
FIRST ARTICLE CHECK
IN-PROCESS CHECK
FINAL QC
```

---

# 54. Acceptance Criteria

Each project should define what constitutes acceptable delivery.

This prevents subjective disputes after production.

---

# 55. Production Tolerance

Relevant tolerances should be documented where necessary:

- garment measurement,
- placement,
- print color,
- production quantity.

---

# 56. Quantity Variance

For methods with production variance, commercial policy should clarify whether exact or tolerable quantity applies.

Do not assume customer accepts variance.

---

# 57. Packaging

Business can support:

```text id="biz48"
STANDARD PACKAGING
CUSTOM PACKAGING
KIT ASSEMBLY
INDIVIDUAL NAME LABEL
```

only when operationally supported.

---

# 58. Kit Assembly

Example:

```text id="biz49"
WELCOME KIT
├── Tee
├── Tote
├── Notebook
└── Card
```

If non-apparel components are included, they should remain within defined project scope and sourcing capability.

---

# 59. Delivery Models

Possible:

```text id="biz50"
SINGLE LOCATION
MULTI-LOCATION
INDIVIDUAL SHIPPING
PICKUP
```

Early default should prefer simpler delivery models.

---

# 60. Multi-Location Delivery

Requires structured:

- address list,
- allocation,
- label,
- shipment tracking.

Should be priced separately where material.

---

# 61. Individual Fulfillment

For company merchandise sent to individual employees:

possible handoff to:

```text id="biz51"
TeeStock Fulfill
```

---

# 62. Delivery Proof

B2B delivery should record:

```text id="biz52"
Shipment
Tracking
Receipt / POD if relevant
```

---

# 63. SLA Architecture

Business SLA should eventually define:

```text id="biz53"
RESPONSE
QUOTE
SAMPLE
PRODUCTION
DELIVERY
ISSUE RESOLUTION
```

---

# 64. SLA Starts from Defined Event

Production SLA should start from:

```text id="biz54"
APPROVAL
+
PAYMENT / PO CONDITION
+
MATERIAL READINESS
```

not initial inquiry.

---

# 65. Rush Project

Rush order can be accepted only after capacity validation.

Potential:

```text id="biz55"
RUSH FEE
```

if it causes operational premium.

---

# 66. Account Pricing

Repeat accounts may receive:

- negotiated price,
- quantity tier,
- contract price.

Pricing must remain within contribution guardrails.

---

# 67. Volume Pricing

Volume price should reflect real economics.

Not:

> bigger customer automatically gets arbitrary discount.

---

# 68. Price Components

Potential:

```text id="biz56"
PRODUCT
DECORATION
SETUP
DESIGN
PACKAGING
FULFILLMENT
SHIPPING
PROJECT SERVICE
```

---

# 69. Quote Margin Guardrail

Quote system should prevent sales from pricing below approved floor without escalation.

---

# 70. Approval Threshold

Future MGBOS can require human approval when:

```text id="biz57"
Discount > threshold
Margin < threshold
Order Value > threshold
Credit Terms requested
Rush commitment
```

---

# 71. Account Memory

Repeat B2B account should store:

```text id="biz58"
Preferred Garment
Brand Colors
Logo Assets
Size Patterns
Packaging
Delivery Locations
Commercial Terms
Previous Orders
```

---

# 72. Repeat Procurement

Ideal flow:

```text id="biz59"
PAST ORDER
↓
REORDER
↓
VERIFY PRICE / STOCK / ASSET
↓
APPROVE
↓
PRODUCE
```

---

# 73. Reorder Template

Frequently repeated item can become:

```text id="biz60"
ACCOUNT-SPECIFIC REORDER TEMPLATE
```

without becoming public catalog Product.

---

# 74. Contracted Product

For recurring account:

specific product configuration may become:

```text id="biz61"
ACCOUNT PRODUCT
```

Example:

> Company A Staff Polo v2.

This remains private to account.

---

# 75. Account Product Versioning

When specification changes materially:

```text id="biz62"
Company A Staff Polo v1
Company A Staff Polo v2
```

preserve historical traceability.

---

# 76. Artwork & Brand Assets

Company assets should be stored with:

```text id="biz63"
OWNER
VERSION
APPROVAL
ACCOUNT
USAGE
```

Do not mix one client's logo assets with another.

---

# 77. Brand Color Governance

If customer requires specific brand colors:

record target reference.

Production method limitations should be communicated.

---

# 78. Studio Escalation

If B2B customer needs:

- design,
- campaign creative,
- packaging,
- brand adaptation,

route work to:

```text id="biz64"
TeeStock Studio
```

---

# 79. Supply Escalation

If customer primarily wants blank garments at volume:

route to:

```text id="biz65"
TeeStock Supply
```

---

# 80. Fulfill Escalation

If customer needs ongoing storage/distribution:

route to:

```text id="biz66"
TeeStock Fulfill
```

---

# 81. Merch Escalation

If organization wants to sell merchandise to audience rather than procure internally:

route toward:

```text id="biz67"
TeeStock Merch
```

---

# 82. Account Lifecycle

Canonical:

```text id="biz68"
PROSPECT
↓
QUALIFIED
↓
ACTIVE
↓
REPEAT
↓
STRATEGIC
↓
DORMANT
↓
CLOSED
```

---

# 83. Strategic Account

Potential strategic account has:

```text id="biz69"
REPEAT DEMAND
+
HEALTHY ECONOMICS
+
GOOD OPERATIONAL FIT
+
RELATIONSHIP VALUE
```

Not simply highest revenue.

---

# 84. Account Review

For meaningful accounts review:

```text id="biz70"
Revenue
Contribution
Payment Behavior
Order Frequency
Issues
Pipeline
Opportunities
```

---

# 85. Account Concentration Risk

TeeStock should monitor dependence on large customers.

High revenue concentration can create risk.

---

# 86. Payment Risk

Track:

```text id="biz71"
Invoice Issued
Due Date
Paid
Overdue
```

for credit customers.

---

# 87. Accounts Receivable

Business can introduce receivable risk.

Finance system should separate:

```text id="biz72"
REVENUE
CASH RECEIVED
OUTSTANDING RECEIVABLE
```

---

# 88. Late Payment

Late payment handling should follow policy.

Do not let sales/account manager improvise terms each time.

---

# 89. Customer-Specific Discounts

All special commercial terms should have:

- owner,
- reason,
- effective date,
- expiry/review.

---

# 90. Business Economics

Measure:

```text id="biz73"
REVENUE
COGS
PRODUCTION
DESIGN
PROJECT LABOR
FULFILLMENT
SHIPPING
PAYMENT COST
CONTRIBUTION
```

---

# 91. Project-Level Profitability

Each significant Business Project should be analyzable independently.

High revenue may hide:

- excessive revisions,
- rush sourcing,
- rework,
- logistics cost.

---

# 92. Account-Level Profitability

Also measure cumulative:

```text id="biz74"
ACCOUNT REVENUE
-
ACCOUNT DIRECT / VARIABLE COST
```

over time.

---

# 93. Sales Effort Cost

Track where useful:

```text id="biz75"
Meetings
Quote Revisions
Sampling
Negotiation
```

Especially for high-touch accounts.

---

# 94. Win/Loss Analysis

Lost opportunities should record reason:

```text id="biz76"
PRICE
TIMELINE
SPECIFICATION
COMPETITOR
NO DECISION
BUDGET
OUT OF SCOPE
```

---

# 95. Pipeline Metrics

Track:

```text id="biz77"
Lead Count
Qualified Opportunities
Pipeline Value
Quote Value
Win Rate
Sales Cycle
```

---

# 96. Delivery Metrics

Track:

```text id="biz78"
On-Time Delivery
Defect Rate
Rework
Quantity Accuracy
Shipment Accuracy
```

---

# 97. Financial Metrics

Track:

```text id="biz79"
Average Project Value
Contribution
Payment Days
Receivable Aging
Repeat Revenue
```

---

# 98. Account Metrics

Track:

```text id="biz80"
Repeat Order Rate
Order Frequency
Revenue per Account
Contribution per Account
```

---

# 99. Business Growth Loop

```text id="biz81"
SUCCESSFUL PROJECT
↓
ACCOUNT MEMORY
↓
EASIER REORDER
↓
MORE TRUST
↓
MORE SHARE OF WALLET
↓
REPEAT REVENUE
```

---

# 100. Automation Stages

```text id="biz82"
STAGE 1
Manual CRM + quote

STAGE 2
Structured lead / account / quote

STAGE 3
Quote automation + approval rules

STAGE 4
Reorder portal + account pricing

STAGE 5
AI-assisted account operations
```

---

# 101. CRM Role

Business requires stronger CRM discipline than Custom.

CRM should track:

```text id="biz83"
Account
Contacts
Opportunities
Quotes
Activities
Next Actions
```

---

# 102. AI Lead Assistance

AI may:

- summarize inquiries,
- extract requirements,
- identify missing data,
- propose next action.

---

# 103. AI Quote Assistance

AI can help draft scope and quote narrative.

Numeric prices must come from pricing engine/rules.

---

# 104. AI Account Brief

Before a meeting, AI can summarize:

```text id="biz84"
Past Orders
Issues
Open Opportunity
Payment Status
Preferences
```

from structured data.

---

# 105. AI Risk Alerts

Potential:

```text id="biz85"
Deadline risk
Margin risk
Overdue payment
Stock shortage
Approval pending
```

---

# 106. AI Boundary

AI cannot independently:

- approve credit,
- accept low-margin deal,
- alter legal terms,
- commit large order,
- promise unsupported SLA.

---

# 107. Customer Portal Future

Future account portal may include:

```text id="biz86"
Order History
Quote Approval
Reorder
Artwork Assets
Invoices
Tracking
Account Products
```

Only build when repeat B2B demand justifies it.

---

# 108. Self-Service Reorder

Ideal mature model:

```text id="biz87"
LOGIN
↓
SELECT ACCOUNT PRODUCT
↓
SET QTY / SIZES
↓
CHECK PRICE
↓
APPROVE
↓
ORDER
```

---

# 109. Approval Workflow

B2B may require multiple customer approvals.

System should support:

```text id="biz88"
REQUESTER
↓
APPROVER
↓
FINANCE / PO
```

where needed.

---

# 110. Internal Approval Workflow

TeeStock may require:

```text id="biz89"
Sales
↓
Pricing Approval
↓
Production Feasibility
↓
Final Commitment
```

for high-risk orders.

---

# 111. Business and MultiGraph

MultiGraph may provide:

- printing,
- production,
- finishing.

TeeStock retains:

```text id="biz90"
CUSTOMER RELATIONSHIP
PROJECT OWNERSHIP
COMMERCIAL ACCOUNTABILITY
```

---

# 112. Internal Transfer Cost

Production done by MultiGraph should have traceable internal cost.

This prevents fake margin.

---

# 113. Partner Network

TeeStock Business can orchestrate partners.

But every partner must be approved on:

```text id="biz91"
QUALITY
CAPABILITY
COST
LEAD TIME
RELIABILITY
```

---

# 114. Vendor Exposure

Customer does not need to manage production vendors.

TeeStock owns coordination unless contract states otherwise.

---

# 115. Sample Library

Future Business can maintain approved physical samples:

```text id="biz92"
Garment
Print
Embroidery
Packaging
```

to accelerate sales.

---

# 116. Spec Library

Reusable specs can speed up quoting and reduce errors.

---

# 117. Business Website

Business page should answer:

```text id="biz93"
WHO IT IS FOR
WHAT WE CAN MAKE
HOW THE PROCESS WORKS
WHY TRUST TEEStock
HOW TO REQUEST QUOTE
```

---

# 118. Website Lead Form

Recommended fields:

```text id="biz94"
Company
Name
Contact
Need
Product
Quantity
Deadline
Budget Range
Artwork Status
Delivery City
```

---

# 119. Progressive Qualification

Do not require 30 fields before first contact.

Start with essential data.

Collect detail after qualification.

---

# 120. Current Activation Scope

Recommended V1 Business:

```text id="biz95"
T-SHIRTS
HOODIES / SELECTED APPAREL
STANDARD CUSTOMIZATION
SINGLE-LOCATION DELIVERY
FORMAL QUOTATION
BASIC ACCOUNT RECORD
```

---

# 121. V1 Exclusions

Initially avoid:

```text id="biz96"
complex nationwide fulfillment
long credit terms
highly bespoke cut-and-sew
large inventory holding commitments
complex procurement beyond capability
```

unless separately approved.

---

# 122. V2 Expansion

Possible:

```text id="biz97"
ACCOUNT PRODUCTS
REORDER TEMPLATES
MULTI-LOCATION DELIVERY
KIT ASSEMBLY
ACCOUNT PRICING
```

---

# 123. V3 Expansion

Possible:

```text id="biz98"
CUSTOMER PORTAL
SELF-SERVICE REORDER
CONTRACT PRICING
FULFILLMENT PROGRAM
PROCUREMENT INTEGRATION
```

---

# 124. B2B Productization Loop

```text id="biz99"
CUSTOM PROJECT
↓
REPEATED REQUIREMENT
↓
STANDARD SOLUTION
↓
ACCOUNT PRODUCT
↓
REORDER WORKFLOW
↓
AUTOMATION
```

---

# 125. Business Failure Modes

## Quote Every Project From Zero

Slow and inconsistent.

## No Account Memory

Repeat customers repeat requirements.

## Unlimited Commercial Exceptions

Margins become unpredictable.

## Credit Without Policy

Cash risk.

## Verbal Approval Only

Scope disputes.

## No Production Lock

Late changes create failure.

## Sales Promises Before Capacity Check

Operational chaos.

---

# 126. What TeeStock Business Must Not Become

## General Procurement Company

Stay apparel/merch-focused.

## Tender-at-Any-Margin Vendor

Revenue without contribution is not healthy.

## Project Chaos Agency

Use productized standards.

## Credit Financing Business

Payment terms must be controlled.

## Founder Relationship Database

Accounts belong in system.

---

# 127. Canonical Business Summary

```text id="biz100"
CUSTOMER BRINGS
Organizational need

TEEStock PROVIDES
Product
Project structure
Production
Quality
Delivery

CUSTOMER GETS
One accountable apparel / merchandise partner
```

---

# 128. Canonical Workflow Summary

```text id="biz101"
LEAD
↓
QUALIFY
↓
DISCOVER
↓
SOLUTION
↓
QUOTE
↓
APPROVAL / PO
↓
PAYMENT CONDITION
↓
PROJECT
↓
PRODUCE
↓
QC
↓
DELIVER
↓
REORDER
```

---

# 129. Canonical Business Principles

```text id="biz102"
ACCOUNT BEFORE TRANSACTION HISTORY.

QUALIFY BEFORE QUOTE.

SPECIFICATION BEFORE PRICE.

APPROVAL BEFORE PRODUCTION.

CAPACITY BEFORE DEADLINE PROMISE.

CHANGE REQUEST BEFORE SCOPE CREEP.

MARGIN BEFORE REVENUE VANITY.

ACCOUNT MEMORY BEFORE REPEATED MANUAL WORK.

REORDER BEFORE REBUILD.
```

---

# 130. Dependency

Dokumen berikut harus follow TeeStock Business Strategy:

1. [[bisnis/teestock/04-services/merch|merch.md]]
2. [[bisnis/teestock/04-services/studio|studio.md]]
3. [[bisnis/teestock/04-services/supply|supply.md]]
4. [[bisnis/teestock/04-services/fulfill|fulfill.md]]
5. [[bisnis/teestock/07-operations/operating-model|operating-model.md]]
6. [[bisnis/teestock/07-operations/sourcing-and-vendors|sourcing-and-vendors.md]]
7. [[bisnis/teestock/07-operations/production-system|production-system.md]]
8. [[bisnis/teestock/07-operations/quality-control|quality-control.md]]
9. [[bisnis/teestock/07-operations/order-fulfillment|order-fulfillment.md]]
10. [[bisnis/teestock/08-finance/pricing-framework|pricing-framework.md]]
11. [[bisnis/teestock/08-finance/treasury-policy|treasury-policy.md]]
12. [[bisnis/teestock/10-product-tech/automation-architecture|automation-architecture.md]]
13. [[bisnis/teestock/11-data-mgbos/canonical-data-model|canonical-data-model.md]]
14. [[bisnis/teestock/13-metrics-experiments/kpi-framework|kpi-framework.md]]
15. B2B legal/commercial agreement frameworks.

TeeStock Business boleh berkembang menjadi procurement dan account platform yang lebih canggih, tetapi setiap expansion harus tetap menggunakan canonical Product, Account, Quote, Project, Work Order, Finance, dan Fulfillment systems TeeStock.