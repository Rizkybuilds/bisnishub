---
title: "TeeStock Merch"
document_id: "TS-SVC-004"
version: "1.0"
status: "CANONICAL"
category: "services"
business: "teestock"
last_updated: "2026-09-28"
depends_on:
  - "TS-FND-001"
  - "TS-FND-002"
  - "TS-STR-002"
  - "TS-STR-003"
  - "TS-STR-004"
  - "TS-BRD-001"
  - "TS-BRD-002"
  - "TS-BRD-004"
  - "TS-COM-001"
  - "TS-COM-005"
  - "TS-SVC-001"
  - "TS-SVC-003"
---

# TeeStock Merch v1.0

> **Canonical TeeStock Merch Service Strategy**  
> Dokumen ini mendefinisikan positioning, creator/brand account model, merch program architecture, product development, storefront, IP ownership, pricing, revenue share, royalty, payout, inventory modes, fulfillment, launch workflow, analytics, automation, metrics, dan boundaries untuk TeeStock Merch.

---

# 1. Purpose

TeeStock Merch menjawab:

> **Bagaimana creator, komunitas, brand, atau pemilik audience dapat menjual merchandise tanpa harus membangun sendiri product, production, commerce, dan fulfillment backend?**

Canonical principle:

> **You build the audience. We operate the merchandise.**

---

# 2. Canonical Definition

> **TeeStock Merch adalah managed merchandise service yang membantu creator, komunitas, brand, dan IP owner mengubah audience serta identity mereka menjadi sellable products melalui shared product, production, commerce, payment, dan fulfillment infrastructure TeeStock.**

---

# 3. Strategic Role

Merch memiliki lima strategic functions:

```text id="merch01"
REVENUE
+
DISTRIBUTION
+
CREATOR RELATIONSHIP
+
INFRASTRUCTURE UTILIZATION
+
AUDIENCE ACQUISITION
```

---

# 4. Core Economic Logic

Creator brings:

```text id="merch02"
AUDIENCE
+
TRUST
+
IDENTITY
+
CONTENT
```

TeeStock brings:

```text id="merch03"
PRODUCT
+
PRODUCTION
+
COMMERCE
+
PAYMENT
+
FULFILLMENT
+
OPERATIONS
```

Combined:

```text id="merch04"
AUDIENCE
×
OPERATING INFRASTRUCTURE
=
MERCH COMMERCE
```

---

# 5. Customer Types

Primary Merch customers:

```text id="merch05"
CREATOR
ARTIST
COMMUNITY
PODCAST
MUSICIAN
CONTENT BRAND
INDEPENDENT MEDIA
SMALL CONSUMER BRAND
IP OWNER
```

---

# 6. Merch vs Creator Program

Canonical distinction:

```text id="merch06"
CREATOR PROGRAM
relationship / participation mechanism

TEEStock MERCH
service capability
```

Creator Program can identify and onboard participants.

Merch executes the commercial operation.

---

# 7. Merch vs Collaboration

One-time:

```text id="merch07"
TeeStock × Creator Drop
```

may be a Collaboration.

Recurring creator merchandise operation becomes:

```text id="merch08"
TEEStock MERCH ACCOUNT
```

---

# 8. Merch vs Custom

```text id="merch09"
CUSTOM
customer buys customized apparel

MERCH
partner intends to sell products to an audience
```

Custom is primarily production fulfillment for the buyer.

Merch is an ongoing commerce operation.

---

# 9. Merch Value Proposition

For partner:

> **TeeStock mengurus backend merchandise sehingga partner dapat fokus ke audience, content, dan creative direction.**

For end customer:

> **Official merchandise dengan product dan fulfillment yang reliable.**

---

# 10. Service Boundary

TeeStock Merch focuses on:

```text id="merch10"
PRODUCT
PRODUCTION
COMMERCE
ORDER OPERATIONS
FULFILLMENT
MERCH ANALYTICS
```

It is not automatically:

- creator management agency,
- social media manager,
- talent representation,
- sponsorship agency,
- general brand consultancy.

---

# 11. Merch Account

Every recurring Merch partner should have:

```text id="merch11"
MERCH ACCOUNT
```

linked to:

- Creator,
- Brand,
- Community,
- Organization,

as appropriate.

---

# 12. Merch Account Record

Minimum:

```text id="merch12"
Partner Entity
Primary Contact
Brand / Creator Name
Audience Channels
Agreement
Revenue Model
Payout Details
Active Products
Storefront
Account Status
```

---

# 13. Merch Account Lifecycle

```text id="merch13"
PROSPECT
↓
QUALIFIED
↓
PILOT
↓
ACTIVE
↓
GROWTH
↓
PAUSED
↓
CLOSED
```

---

# 14. Qualification

A partner should be assessed on:

```text id="merch14"
AUDIENCE FIT
AUDIENCE ENGAGEMENT
IDENTITY STRENGTH
PRODUCT POTENTIAL
COMMERCIAL FIT
OPERATIONAL FIT
IP CLARITY
```

Follower count alone is insufficient.

---

# 15. Audience Quality

Relevant indicators may include:

```text id="merch15"
ENGAGEMENT
COMMUNITY TRUST
CONTENT CONSISTENCY
PURCHASE INTENT
AUDIENCE RELEVANCE
```

---

# 16. Pilot First

Default relationship should begin with:

```text id="merch16"
PILOT DROP
```

not:

```text id="merch17"
FULL CUSTOM STORE + LONG CONTRACT
```

Goal:

> validate audience-to-product conversion cheaply.

---

# 17. Merch Maturity Model

```text id="merch18"
STAGE 1
Co-Drop

STAGE 2
Creator Collection

STAGE 3
Managed Merch

STAGE 4
Creator Store

STAGE 5
Independent Frontend / Programmatic Merch
```

---

# 18. Stage 1 — Co-Drop

Characteristics:

```text id="merch19"
1–few products
TeeStock storefront
shared checkout
manual coordination
limited launch window
```

Best for first validation.

---

# 19. Stage 2 — Creator Collection

Partner receives:

```text id="merch20"
DEDICATED COLLECTION PAGE
```

with several recurring products.

Still inside TeeStock storefront.

---

# 20. Stage 3 — Managed Merch

TeeStock handles more of:

```text id="merch21"
Product Planning
Production
Inventory
Store Operations
Fulfillment
Payout Reporting
```

Partner focuses on:

- audience,
- content,
- creative direction.

---

# 21. Stage 4 — Creator Store

Partner may receive:

```text id="merch22"
DEDICATED STOREFRONT EXPERIENCE
```

while still using shared TeeStock backend.

---

# 22. Stage 5 — Independent Frontend

Only if:

```text id="merch23"
REPEAT DEMAND
+
ENOUGH PRODUCT DEPTH
+
STRONG BRAND IDENTITY
+
INDEPENDENT EXPERIENCE CREATES VALUE
```

Possible own domain/frontend.

Backend can remain shared.

---

# 23. Product Development

Canonical flow:

```text id="merch24"
AUDIENCE / BRAND INSIGHT
↓
PRODUCT CONCEPT
↓
GARMENT PLATFORM
↓
ARTWORK
↓
SAMPLE
↓
APPROVAL
↓
MERCH PRODUCT
```

---

# 24. Product Strategy

Start with:

```text id="merch25"
FEW PRODUCTS
+
STRONG CREATIVE RELEVANCE
```

Avoid giant merch catalog.

---

# 25. Base Garments

Prefer approved TeeStock Garment Platforms.

Benefits:

```text id="merch26"
QUALITY
SPEED
LOWER MOQ
SHARED INVENTORY
PREDICTABLE COST
```

---

# 26. Proprietary Merch Product

Custom garment can be developed later if:

```text id="merch27"
VOLUME
BRAND NEED
MARGIN
PRODUCT DIFFERENTIATION
```

justify it.

---

# 27. Product Ownership

Physical Product may be operated by TeeStock.

Creative/IP ownership can differ.

Possible classifications:

```text id="merch28"
PARTNER OWNED
TEEStock OWNED
LICENSED
JOINT
```

---

# 28. Artwork Ownership

Partner-provided assets remain partner-owned unless agreement states otherwise.

TeeStock receives only the rights necessary to:

- produce,
- market,
- sell,
- fulfill

within agreed scope.

---

# 29. IP Agreement

Agreement must clarify:

```text id="merch29"
Ownership
Usage Rights
Territory
Duration
Marketing Rights
Derivative Rights
Termination
Remaining Inventory Rights
```

---

# 30. Official Merchandise Claim

TeeStock may call a product:

```text id="merch30"
Official Merchandise
```

only if agreement with rights holder supports that claim.

---

# 31. Product Naming

Typical structure:

```text id="merch31"
[Creator / Brand]
[Collection / Drop]
[Product]
```

Example:

```text id="merch32"
Creator ABC
Drop 001
Logo Tee
```

---

# 32. Merch Collection

A Merch Collection can group:

- release,
- theme,
- event,
- season.

It does not automatically become an Independent Label.

---

# 33. Merch Product Record

Should map to:

```text id="merch33"
Merch Account
Garment Platform
Artwork
Collection
Price
Revenue Rule
Fulfillment Mode
Lifecycle Status
```

---

# 34. Sample Approval

Before launch:

```text id="merch34"
PRODUCT SAMPLE
+
ARTWORK
+
PLACEMENT
+
COLOR
+
PACKAGING
```

should be approved according to account workflow.

---

# 35. Creative Approval

Define who can approve:

```text id="merch35"
Creator
Manager
Brand Owner
TeeStock
```

Avoid launch delay caused by unclear decision rights.

---

# 36. Production Approval

Creative approval does not automatically mean production feasibility.

TeeStock must also approve:

```text id="merch36"
MANUFACTURABILITY
QUALITY
COST
```

---

# 37. Storefront Architecture

Early default:

```text id="merch37"
teestock.id/creator/[name]
```

or equivalent shared collection route.

No separate tech stack required.

---

# 38. Creator Collection Page

Can show:

```text id="merch38"
Creator Identity
Story
Products
Active Drop
Previous Releases
```

within agreed brand expression.

---

# 39. Storefront Independence Rule

Dedicated store should only be added when it solves:

- brand positioning,
- conversion,
- recurring commerce need.

Not merely because it looks impressive.

---

# 40. Shared Checkout

Recommended:

```text id="merch39"
CREATOR FRONTEND
↓
TEEStock COMMERCE
↓
SHARED CHECKOUT
↓
SHARED PAYMENT
```

---

# 41. Customer Ownership

Merch agreements should define access/use of customer data.

TeeStock should maintain privacy and authorized data use.

Partner should not automatically receive unrestricted customer information.

---

# 42. Customer Identity

One TeeStock customer may buy products from multiple creators.

Avoid duplicated customer identities per creator storefront.

---

# 43. Commerce Model

Potential modes:

```text id="merch43"
DROP
EVERGREEN
PREORDER
MADE TO ORDER
READY STOCK
```

---

# 44. Drop Model

Useful for:

- launch,
- audience activation,
- limited campaign.

Characteristics:

```text id="merch44"
DEFINED WINDOW
+
DEFINED PRODUCT SET
+
PROMOTION EVENT
```

---

# 45. Evergreen Model

Useful for proven products.

Available continuously while commercial relationship remains active.

---

# 46. Preorder Model

Useful when:

- demand uncertain,
- upfront inventory risky,
- audience can tolerate longer lead time.

---

# 47. Made-to-Order Model

Useful for broad virtual assortment with shared base garments.

Tradeoff:

- longer fulfillment.

---

# 48. Ready-Stock Model

Useful for:

- proven demand,
- fast delivery,
- repeat sales.

Requires working capital.

---

# 49. Inventory Risk Allocation

Agreement should clarify who bears inventory risk.

Possible:

```text id="merch49"
TEEStock
PARTNER
SHARED
PREORDER-BASED
```

---

# 50. Preferred Early Model

For new creators:

```text id="merch50"
PREORDER
or
MADE TO ORDER
or
SMALL BATCH
```

to limit speculative inventory.

---

# 51. Inventory Funding

If finished inventory is produced:

funding can come from:

- TeeStock,
- partner,
- shared model,
- preorder cash.

Must be explicitly agreed.

---

# 52. Unsold Inventory

Agreement must define:

```text id="merch52"
WHO OWNS IT
WHO CAN DISCOUNT IT
WHAT HAPPENS AFTER TERMINATION
```

---

# 53. Pricing Architecture

Merch pricing must support:

```text id="merch53"
PRODUCT COST
+
PRODUCTION
+
COMMERCE COST
+
FULFILLMENT
+
PAYMENT FEES
+
TEEStock CONTRIBUTION
+
PARTNER ECONOMICS
```

---

# 54. Commercial Models

Possible models:

```text id="merch54"
WHOLESALE
ROYALTY
REVENUE SHARE
SERVICE FEE + SHARE
MANAGED COMMERCE FEE
```

---

# 55. Wholesale Model

Partner purchases product from TeeStock.

Partner handles selling.

This is closer to:

```text id="merch55"
SUPPLY / PRODUCTION
```

than fully managed Merch.

---

# 56. Royalty Model

Partner receives defined amount or percentage based on product sales.

Common where:

```text id="merch56"
partner owns creative/IP
TeeStock operates product
```

---

# 57. Revenue Share Model

Both parties share an agreed revenue/economic base.

Agreement must specify what "revenue" means.

---

# 58. Revenue Base

Never use vague:

> 20% revenue share

without defining whether calculation uses:

```text id="merch58"
Gross Sales
Net Sales
After Discount
After Refund
After Tax
After Channel Fee
```

---

# 59. Recommended Canonical Terms

Use explicit metrics such as:

```text id="merch59"
GROSS SALES
NET SALES
ROYALTY BASE
PARTNER PAYOUT
TEEStock CONTRIBUTION
```

---

# 60. Royalty vs Revenue Share

Canonical distinction:

```text id="merch60"
ROYALTY
compensation for rights / IP usage

REVENUE SHARE
commercial sharing arrangement
```

They may coexist but should not be conflated.

---

# 61. Payout

Partner payouts must be based on:

```text id="merch61"
VERIFIED TRANSACTIONS
```

not storefront displayed sales alone.

---

# 62. Payout Calculation

Potential:

```text id="merch62"
Eligible Sales
-
Refunds
-
Chargebacks
-
Defined Adjustments
=
Payout Base
```

Then apply agreed formula.

---

# 63. Payout Period

Possible:

```text id="merch63"
PER DROP
WEEKLY
MONTHLY
```

depending account scale.

Must be agreed.

---

# 64. Payout Statement

Partner should receive understandable statement:

```text id="merch64"
Units
Sales
Adjustments
Royalty / Share
Amount Payable
Payment Status
```

---

# 65. Payout Accuracy

This is a core trust metric.

Errors can damage creator relationship significantly.

---

# 66. Refund Handling

Agreement should define how refunds affect:

- royalties,
- revenue share,
- payout.

Avoid paying twice or reclaiming unpredictably.

---

# 67. Discount Authority

Who can discount products?

Possible:

```text id="merch67"
TEEStock
PARTNER
MUTUAL APPROVAL
```

Must be defined.

---

# 68. Campaign Funding

Marketing expense may be:

- partner-funded,
- TeeStock-funded,
- co-funded.

If campaign cost affects revenue share, agreement must define it explicitly.

---

# 69. Marketing Responsibility

Recommended separation:

Partner primarily owns:

```text id="merch69"
AUDIENCE ACTIVATION
CONTENT
VOICE
LAUNCH MOMENT
```

TeeStock primarily owns:

```text id="merch70"
PRODUCT PAGE
COMMERCE
OPERATIONS
FULFILLMENT
```

Collaborative planning may overlap.

---

# 70. Creator Content Kit

TeeStock can provide:

- product images,
- mockups,
- links,
- launch assets,
- copy facts.

This reduces friction for partner promotion.

---

# 71. Merch Launch Workflow

Canonical:

```text id="merch71"
QUALIFY PARTNER
↓
AGREEMENT
↓
PRODUCT CONCEPT
↓
COST / ECONOMICS
↓
SAMPLE
↓
APPROVAL
↓
STOREFRONT
↓
LAUNCH PLAN
↓
GO LIVE
↓
SELL
↓
FULFILL
↓
REPORT
↓
PAYOUT
↓
REVIEW
```

---

# 72. Launch Checklist

Before launch:

```text id="merch72"
Agreement Signed
Rights Verified
Product Approved
Price Approved
Inventory Mode Ready
Product Content Ready
Storefront Ready
Payment Ready
Fulfillment Ready
Payout Rule Ready
```

---

# 73. Drop Status

Possible:

```text id="merch73"
CONCEPT
DEVELOPMENT
APPROVAL
SCHEDULED
LIVE
CLOSED
FULFILLING
COMPLETE
ARCHIVED
```

---

# 74. Launch Date

Do not publicly announce launch before:

```text id="merch74"
PRODUCT
STORE
OPERATIONS
```

are sufficiently ready.

---

# 75. Drop Window

A Drop may use:

- fixed sales window,
- limited inventory,
- open-ended launch.

Scarcity should be truthful.

---

# 76. Order Routing

Merch orders should behave like normal Commerce Orders but retain:

```text id="merch76"
Merch Account
Creator
Collection
Revenue Rule
```

at Order Item level.

---

# 77. Multi-Creator Cart

Future shared storefront may allow:

```text id="merch77"
Creator A product
+
Creator B product
```

within one cart.

Backend must preserve payout attribution per item.

---

# 78. Order Attribution

Every Merch Order Item should map to:

```text id="merch78"
Partner
Product
Collection
Channel
Revenue Rule
```

---

# 79. Fulfillment

Merch can use:

```text id="merch79"
TeeStock Fulfill
```

internally even before Fulfill is externally marketed.

---

# 80. Fulfillment Workflow

```text id="merch80"
ORDER
↓
PAYMENT
↓
INVENTORY / PRODUCTION
↓
QC
↓
PACK
↓
SHIP
↓
DELIVER
```

---

# 81. Customer Support

TeeStock should own operational support unless agreement states otherwise.

Examples:

- order status,
- shipping,
- wrong item,
- defects.

---

# 82. Partner Support Boundary

Partner should not need to handle:

> “order gue belum sampai”

if TeeStock owns fulfillment.

This preserves creator focus.

---

# 83. Brand-Specific Packaging

Possible at sufficient volume.

Early default:

```text id="merch83"
SHARED TEEStock PACKAGING
+
CREATOR INSERT / LABEL
```

rather than fully custom packaging.

---

# 84. Merch Returns

Returns should be handled according to TeeStock customer policy, with creator-specific exceptions documented.

---

# 85. Product Defect

TeeStock owns operational resolution for products it produced/fulfilled.

---

# 86. Merch Account Analytics

Partner-facing analytics may eventually include:

```text id="merch86"
Orders
Units
Sales
Top Products
Returns
Payout
```

---

# 87. Internal Analytics

TeeStock should additionally track:

```text id="merch87"
Contribution
Fulfillment Cost
Creator Acquisition
Support Burden
Inventory Risk
```

---

# 88. Partner Performance

Do not judge solely by GMV.

Evaluate:

```text id="merch88"
SALES
+
CONTRIBUTION
+
AUDIENCE QUALITY
+
REPEAT POTENTIAL
+
OPERATIONAL FIT
```

---

# 89. Creator GMV

GMV is useful.

But:

```text id="merch89"
GMV
≠
TEEStock Revenue
≠
TEEStock Contribution
```

Keep metrics separate.

---

# 90. Conversion Metrics

Track:

```text id="merch90"
Landing Views
Product Views
Conversion
Units
AOV
```

where possible.

---

# 91. Audience Channel Attribution

Track creator-driven traffic by:

- link,
- campaign,
- platform,
- content.

Useful to understand which audience actually converts.

---

# 92. Drop Performance

Review:

```text id="merch92"
TRAFFIC
CONVERSION
SALES
CONTRIBUTION
SELL-THROUGH
RETURNS
FULFILLMENT
```

---

# 93. Post-Drop Review

Decision:

```text id="merch93"
END
REPEAT
ITERATE
EXPAND
MOVE TO EVERGREEN
```

---

# 94. Creator Promotion Criteria

Move from Co-Drop to recurring Merch if:

```text id="merch94"
AUDIENCE CONVERTS
+
RELATIONSHIP WORKS
+
ECONOMICS HEALTHY
+
OPERATIONS STABLE
```

---

# 95. Creator Store Criteria

Dedicated store if:

```text id="merch95"
RECURRING PRODUCT ROADMAP
+
RECURRING SALES
+
MULTIPLE PRODUCTS
+
IDENTITY DEPTH
```

---

# 96. Custom Domain Criteria

Own domain only if:

```text id="merch96"
BRAND VALUE
+
DIRECT DEMAND
+
LONG-TERM RELATIONSHIP
+
ENOUGH COMMERCIAL SCALE
```

justify complexity.

---

# 97. Merch Account Tiering

Future internal classification:

```text id="merch97"
PILOT
STANDARD
GROWTH
STRATEGIC
```

Not necessarily public.

---

# 98. Strategic Merch Account

A Strategic account may justify:

- custom roadmap,
- dedicated ops,
- better integration,
- separate storefront.

But economics must remain healthy.

---

# 99. Portfolio Risk

Avoid creator portfolio overly concentrated in one account.

Large creator dependence creates revenue and reputation risk.

---

# 100. Reputation Risk

Creator behavior can affect TeeStock indirectly.

Partnership review should consider:

- audience fit,
- legal/IP risk,
- brand compatibility.

---

# 101. Creator Termination

Agreement should define termination process.

Including:

```text id="merch101"
Stop New Sales
Fulfill Existing Orders
Final Payout
Inventory Disposition
Asset Access
Customer Support
```

---

# 102. Product Sunset

Creator product may be sunset while Merch account remains active.

Lifecycle remains product-specific.

---

# 103. Merch Account Data Model

Future core entities:

```text id="merch103"
CREATOR / PARTNER
MERCH ACCOUNT
AGREEMENT
COLLECTION / DROP
PRODUCT
ARTWORK
STOREFRONT
ORDER ITEM
REVENUE RULE
PAYOUT
```

---

# 104. Agreement Entity

Agreement should be structured enough to answer:

```text id="merch104"
Who owns IP?
What can TeeStock sell?
How is payout calculated?
When does agreement expire?
Who bears inventory risk?
```

---

# 105. Revenue Rule

Revenue/payout logic must be represented as data where possible.

Avoid spreadsheet-only formulas per creator indefinitely.

---

# 106. Payout Ledger

Future MGBOS should maintain:

```text id="merch106"
EARNING
ADJUSTMENT
PAYOUT
BALANCE
```

for each partner.

---

# 107. Payout Auditability

Partner payout must be reproducible from transaction records.

No:

> “kayaknya bulan ini sekitar segini.”

---

# 108. Merch Automation Stages

```text id="merch108"
STAGE 1
Manual drop + manual payout

STAGE 2
Structured merch account + order attribution

STAGE 3
Automated reports + payout calculation

STAGE 4
Creator dashboard + self-service insights

STAGE 5
Platformized creator commerce
```

---

# 109. Creator Dashboard

Potential later features:

```text id="merch109"
Sales
Products
Orders summary
Payouts
Campaign Links
Product Proposals
```

Do not build before recurring creator volume exists.

---

# 110. AI Opportunities

AI may assist:

```text id="merch110"
Audience / merch concept analysis
Product recommendation
Sales summary
Content asset drafting
Demand forecast
Drop review
```

---

# 111. AI Product Recommendation

AI may suggest:

> Creator audience appears to prefer Product X.

But product launch remains human/partner decision.

---

# 112. AI Payout Boundary

AI should not invent payout.

Payout must follow deterministic agreement rules.

---

# 113. AI Creative Boundary

AI-assisted creative still requires:

- creator approval,
- IP review,
- production review.

---

# 114. Merch and Studio

TeeStock Studio can provide:

```text id="merch114"
Artwork
Product Design
Packaging
Campaign Creative
```

as internal or paid component.

---

# 115. Merch and Supply

Merch uses Supply/procurement capability internally for product inputs.

Partner does not need to coordinate suppliers.

---

# 116. Merch and Fulfill

Merch is one of the natural demand engines for TeeStock Fulfill.

Repeated Merch orders create fulfillment utilization.

---

# 117. Merch and Commerce

Merch may use same:

```text id="merch117"
Catalog
Checkout
Payment
Customer Identity
Order
```

as TeeStock Commerce.

---

# 118. Merch and Programs

Creator Program can feed Merch pipeline:

```text id="merch118"
CREATOR PROGRAM
↓
CREATOR DISCOVERY
↓
CO-DROP
↓
MERCH ACCOUNT
```

---

# 119. Merch and Originals

Critical distinction:

```text id="merch119"
CREATOR MERCH
partner identity/IP

TEEStock ORIGINALS
TeeStock identity/IP
```

A successful creator Merch account does not become TeeStock Original.

---

# 120. Merch and Independent Labels

A creator-owned brand may use TeeStock Merch while remaining fully independent.

Example:

```text id="merch120"
External Brand
↓
TeeStock Merch
↓
Production / Commerce / Fulfill
```

---

# 121. White-Label Merch

TeeStock may operate invisibly behind partner brand.

Customer-facing identity can be:

```text id="merch121"
PARTNER BRAND ONLY
```

while backend remains TeeStock.

---

# 122. Powered-by Merch

Alternative:

```text id="merch122"
Powered by TeeStock
```

when strategically useful.

Visibility depends on agreement.

---

# 123. Current Recommended V1

Start with:

```text id="merch123"
1–few pilot creators
1–3 products per drop
shared TeeStock storefront
standard garment platforms
simple payout model
manual launch coordination
TeeStock fulfillment
```

---

# 124. V1 Exclusions

Avoid initially:

```text id="merch124"
custom domain per creator
large speculative inventory
advanced creator dashboard
complex multi-tier royalties
global fulfillment
open creator marketplace
```

---

# 125. V2 Expansion

Possible:

```text id="merch125"
Creator Collection Pages
Automated Payout
Repeat Drop Templates
Account Analytics
Evergreen Merch
```

---

# 126. V3 Expansion

Possible:

```text id="merch126"
Dedicated Creator Storefront
Self-Service Product Proposals
Custom Domain
Multi-Channel Merch
Advanced Fulfillment
```

---

# 127. V4 Platformization

Possible only after demand:

```text id="merch127"
MULTI-TENANT CREATOR COMMERCE
+
AUTOMATED STOREFRONT
+
PAYOUT LEDGER
+
PARTNER PORTAL
+
API
```

---

# 128. Merch Productization Loop

```text id="merch128"
ONE-OFF DROP
↓
REPEAT DROP
↓
STANDARD PLAYBOOK
↓
MANAGED ACCOUNT
↓
AUTOMATION
↓
PLATFORM
```

---

# 129. Partner Growth Loop

```text id="merch129"
GOOD PRODUCT
↓
AUDIENCE PROMOTION
↓
SALES
↓
GOOD FULFILLMENT
↓
AUDIENCE TRUST
↓
NEXT DROP
```

---

# 130. TeeStock Growth Loop

```text id="merch130"
MORE CREATOR ACCOUNTS
↓
MORE PRODUCT VOLUME
↓
MORE INFRASTRUCTURE UTILIZATION
↓
BETTER DATA / PROCUREMENT
↓
BETTER MERCH SERVICE
↓
MORE CREATOR ACCOUNTS
```

---

# 131. Merch Failure Modes

## Follower Count = Demand

Audience size does not guarantee purchase.

## Huge First Inventory

Creates working-capital risk.

## Unclear Revenue Share

Destroys trust.

## Manual Payout Forever

Does not scale.

## Creator Handles Support

Defeats managed-merch value.

## Custom Store Too Early

Premature platformization.

## Too Many Products Per Drop

Dilutes demand.

---

# 132. What TeeStock Merch Must Not Become

## Influencer Agency

Out of core scope.

## Open Print-on-Demand Marketplace

Curation and quality must remain.

## Creator Financing Operation

Inventory/advance risk requires clear policy.

## Tech Platform Before Proven Demand

Operate first.

## Partnership With Unclear IP

Rights before launch.

---

# 133. Merch Success Definition

Merch works when:

```text id="merch133"
PARTNER BUILDS AUDIENCE
↓
TEEStock BUILDS PRODUCT
↓
CUSTOMER BUYS
↓
TEEStock DELIVERS
↓
PARTNER GETS PAID ACCURATELY
↓
BOTH WANT TO REPEAT
```

---

# 134. Canonical Merch Summary

```text id="merch134"
PARTNER OWNS
Audience
Identity
Creative Relationship

TEEStock OPERATES
Product
Production
Commerce
Fulfillment
Payout Infrastructure

CUSTOMER RECEIVES
Official, reliable merchandise
```

---

# 135. Canonical Workflow Summary

```text id="merch135"
QUALIFY
↓
AGREE
↓
DEVELOP PRODUCT
↓
SAMPLE
↓
APPROVE
↓
BUILD STOREFRONT
↓
LAUNCH
↓
SELL
↓
FULFILL
↓
REPORT
↓
PAYOUT
↓
REPEAT
```

---

# 136. Canonical Merch Principles

```text id="merch136"
AUDIENCE BEFORE STOREFRONT.

PILOT BEFORE PLATFORM.

RIGHTS BEFORE SALES.

FEW PRODUCTS BEFORE LARGE CATALOG.

DEMAND BEFORE INVENTORY.

DEFINED ECONOMICS BEFORE LAUNCH.

TRANSACTION DATA BEFORE PAYOUT.

FULFILLMENT QUALITY BEFORE CREATOR SCALE.

REPEAT DROP BEFORE DEDICATED STORE.

PARTNER TRUST BEFORE AUTOMATION.
```

---

# 137. Dependency

Dokumen berikut harus follow TeeStock Merch Strategy:

1. `04-services/studio.md`
2. `04-services/supply.md`
3. `04-services/fulfill.md`
4. `06-programs/creator-program.md`
5. `07-operations/production-system.md`
6. `07-operations/inventory-system.md`
7. `07-operations/order-fulfillment.md`
8. `08-finance/unit-economics.md`
9. `08-finance/pricing-framework.md`
10. `08-finance/treasury-policy.md`
11. `10-product-tech/creator-platform.md`
12. `10-product-tech/commerce-platform.md`
13. `11-data-mgbos/canonical-data-model.md`
14. `11-data-mgbos/event-model.md`
15. `12-legal-ip/creator-agreement-framework.md`
16. `13-metrics-experiments/kpi-framework.md`

TeeStock Merch boleh berevolusi menjadi creator-commerce platform, tetapi platformization hanya dilakukan setelah manual managed-merch operation menunjukkan recurring demand, repeatable economics, reliable fulfillment, dan enough creator volume untuk membenarkan infrastructure tambahan.