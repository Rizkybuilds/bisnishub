---
title: "TeeStock Reseller Program"
document_id: "TS-PRG-003"
version: "1.0"
status: "CANONICAL"
category: "programs"
business: "teestock"
last_updated: "2026-09-28"
depends_on:
  - "TS-FND-001"
  - "TS-FND-002"
  - "TS-STR-001"
  - "TS-STR-002"
  - "TS-STR-004"
  - "TS-BRD-001"
  - "TS-COM-001"
  - "TS-COM-003"
  - "TS-SVC-006"
  - "TS-PRG-001"
---

# TeeStock Reseller Program v1.0

> **Canonical TeeStock Reseller Participation Framework**  
> Dokumen ini mendefinisikan reseller eligibility, commercial model, wholesale pricing, reseller margin, product access, dropship, white-label boundaries, customer ownership, channel rules, account pricing, ordering, fulfillment, territory, tiers, lifecycle, automation, metrics, dan governance untuk TeeStock Reseller Program.

---

# 1. Purpose

Reseller Program menjawab:

> **Bagaimana pihak eksternal dapat menjual kembali produk TeeStock dan membantu memperluas distribusi tanpa TeeStock harus memiliki semua titik penjualan sendiri?**

Canonical principle:

> **Extend distribution without losing control.**

---

# 2. Canonical Definition

> **TeeStock Reseller Program adalah structured distribution program yang memungkinkan approved individuals atau businesses membeli atau menjual kembali eligible TeeStock products menggunakan wholesale/reseller economics, defined channel rules, dan controlled brand representation.**

---

# 3. Reseller Program Is Not Supply

Critical distinction:

```text id="rsp001"
TEEStock SUPPLY
B2B product-supply service

RESELLER PROGRAM
distribution participation mechanism
```

Supply answers:

> “What products can this business buy from TeeStock?”

Reseller Program answers:

> “Under what rules may this participant resell TeeStock products?”

---

# 4. Reseller Program Is Not Affiliate Program

Canonical:

```text id="rsp002"
RESELLER
participates in the commercial resale transaction

AFFILIATE
refers demand and receives attribution-based commission
```

---

# 5. Reseller Program Is Not Customer Discount Club

Reseller pricing exists to support:

```text id="rsp003"
RESALE ECONOMICS
```

not simply provide cheaper personal purchases.

---

# 6. Strategic Role

Reseller Program can create:

```text id="rsp004"
DISTRIBUTION
+
LOCAL MARKET ACCESS
+
LOWER CUSTOMER ACQUISITION DEPENDENCE
+
B2B REPEAT ORDERS
+
PRODUCT REACH
```

---

# 7. Distribution Logic

Canonical:

```text id="rsp005"
TEEStock
↓
RESELLER
↓
END CUSTOMER
```

or in dropship model:

```text id="rsp006"
END CUSTOMER
↓
RESELLER
↓
TEEStock
↓
SHIP TO END CUSTOMER
```

---

# 8. Target Participants

Potential:

```text id="rsp007"
ONLINE SELLER
SMALL RETAILER
COMMUNITY SELLER
SOCIAL COMMERCE SELLER
APPAREL ENTREPRENEUR
LOCAL DISTRIBUTOR
MICRO BUSINESS
```

---

# 9. Reseller Value Contribution

Reseller brings:

```text id="rsp008"
CUSTOMER ACCESS
SALES EFFORT
LOCAL DISTRIBUTION
MARKET KNOWLEDGE
```

---

# 10. TeeStock Value Contribution

TeeStock provides:

```text id="rsp009"
PRODUCT
PRICE STRUCTURE
INVENTORY
PRODUCT DATA
FULFILLMENT
SUPPORT
```

depending program model.

---

# 11. Core Value Exchange

```text id="rsp010"
RESELLER
creates distribution and sales.

TEEStock
provides product and operating infrastructure.

RESELLER
earns margin.

TEEStock
earns incremental contribution and reach.
```

---

# 12. Reseller Models

Canonical potential models:

```text id="rsp011"
STOCK RESELLER
DROPSHIP RESELLER
BULK RESELLER
WHITE-LABEL RESELLER
```

Not all need activation immediately.

---

# 13. Stock Reseller

Reseller:

```text id="rsp012"
BUYS INVENTORY
↓
HOLDS INVENTORY
↓
SELLS TO CUSTOMER
```

TeeStock responsibility generally ends after B2B fulfillment, subject to warranty/policy.

---

# 14. Dropship Reseller

Reseller sells first.

TeeStock may:

```text id="rsp013"
PICK
PACK
SHIP
```

directly to reseller's end customer.

---

# 15. Bulk Reseller

Reseller purchases at larger quantity for:

- local selling,
- events,
- retail operations.

This often overlaps heavily with Supply infrastructure.

---

# 16. White-Label Reseller

Potential later model where product/customer-facing branding differs.

This introduces substantially more complexity.

Do not enable by default.

---

# 17. Early Recommended Model

Start with:

```text id="rsp014"
STANDARD RESELLER
+
CONTROLLED DROPSHIP PILOT
```

only after product/inventory/pricing are stable.

---

# 18. Reseller Eligibility

Possible criteria:

```text id="rsp015"
VALID IDENTITY
COMMERCIAL INTENT
CHANNEL FIT
BRAND FIT
PAYMENT READINESS
POLICY ACCEPTANCE
```

---

# 19. Business Entity Requirement

Not every reseller needs formal corporate entity initially.

Requirement should depend on:

- transaction scale,
- account risk,
- legal/financial needs.

---

# 20. Application

Potential fields:

```text id="rsp016"
Name
Business / Store Name
Contact
Sales Channels
Customer Segment
Expected Volume
Location
Reseller Model
```

---

# 21. Application Review

Evaluate:

```text id="rsp017"
FIT
CHANNEL
EXPECTED VOLUME
BRAND REPRESENTATION RISK
COMMERCIAL QUALITY
```

---

# 22. Application Outcome

Canonical:

```text id="rsp018"
APPROVED
NEEDS_INFO
WAITLIST
NOT_FIT
```

---

# 23. Enrollment

Approved reseller gets:

```text id="rsp019"
RESELLER ENROLLMENT
```

linked to Participant/Business Account.

---

# 24. Reseller Lifecycle

Canonical:

```text id="rsp020"
APPLICANT
↓
APPROVED
↓
ONBOARDED
↓
ACTIVE
↓
GROWTH
↓
STRATEGIC
↓
PAUSED / SUSPENDED / EXITED
```

---

# 25. Active Reseller

Should mean:

```text id="rsp021"
VALID COMMERCIAL ACTIVITY
```

within defined period.

Do not count every old approved account as active.

---

# 26. Reseller Tiering

Potential internal tiers:

```text id="rsp022"
STANDARD
GROWTH
STRATEGIC
```

based on real differences in:

- volume,
- service,
- pricing,
- support.

---

# 27. Standard Reseller

Uses normal:

```text id="rsp023"
RESELLER PRICE BOOK
+
STANDARD TERMS
```

---

# 28. Growth Reseller

May receive:

```text id="rsp024"
BETTER PRICE TIERS
EARLIER PRODUCT ACCESS
ACCOUNT SUPPORT
```

if economics justify.

---

# 29. Strategic Reseller

Potential:

```text id="rsp025"
CONTRACT PRICING
VOLUME COMMITMENT
DEDICATED SUPPORT
ALLOCATION PRIORITY
```

subject to agreement.

---

# 30. Tier Promotion

Should consider:

```text id="rsp026"
ORDER VOLUME
ORDER FREQUENCY
PAYMENT BEHAVIOR
BRAND COMPLIANCE
CONTRIBUTION
RELATIONSHIP QUALITY
```

---

# 31. No Tier Based on Revenue Alone

High revenue with:

- low margin,
- late payment,
- high support,

may not justify better terms.

---

# 32. Reseller Product Access

Not every TeeStock product needs to be reseller-eligible.

Canonical attribute:

```text id="rsp027"
RESELLER_ELIGIBLE
TRUE / FALSE
```

---

# 33. Why Product Eligibility Matters

Certain products may have:

- IP restrictions,
- collaboration restrictions,
- insufficient margin,
- limited inventory,
- exclusivity.

---

# 34. Selects Resale

May be allowed where:

- creator license,
- margin,
- channel rights

support it.

---

# 35. Originals Resale

May be more controlled to protect brand positioning.

---

# 36. Essentials Resale

Potentially natural reseller product if margins and distribution strategy support it.

---

# 37. Supply Products

Some reseller-eligible products may come directly from Supply catalog.

---

# 38. Product Price Book

Canonical:

```text id="rsp028"
RETAIL PRICE
≠
RESELLER PRICE
≠
SUPPLY PRICE
```

These may sometimes match but serve different commercial contexts.

---

# 39. Reseller Margin

Basic model:

```text id="rsp029"
SELLING PRICE
-
RESELLER BUY PRICE
=
RESELLER GROSS MARGIN
```

---

# 40. TeeStock Contribution

Canonical:

```text id="rsp030"
RESELLER BUY PRICE
-
PRODUCT COST
-
HANDLING
-
FULFILLMENT
-
PAYMENT COST
=
TEEStock CONTRIBUTION
```

---

# 41. Margin Must Work for Both Sides

If reseller cannot earn enough:

program has weak incentive.

If TeeStock contribution disappears:

program destroys economics.

---

# 42. Wholesale Pricing

May use quantity tiers.

Example conceptual:

```text id="rsp031"
STANDARD
VOLUME 1
VOLUME 2
CONTRACT
```

Exact numbers belong in Pricing Framework.

---

# 43. Account Pricing

Strategic reseller may have:

```text id="rsp032"
ACCOUNT PRICE BOOK
```

---

# 44. Account Pricing Record

Minimum:

```text id="rsp033"
Reseller
Product
Price
Minimum Qty
Effective Date
Expiry
Approver
```

---

# 45. Discount Governance

Reseller discount should be structural.

Not negotiated randomly order by order.

---

# 46. Minimum Purchase

May exist as:

```text id="rsp034"
MINIMUM ORDER VALUE
or
MINIMUM QUANTITY
```

depending fulfillment economics.

---

# 47. Minimum Purchase Purpose

Protect against:

- picking cost,
- packaging cost,
- sales/admin cost.

---

# 48. Dropship Economics

Dropship adds:

```text id="rsp035"
INDIVIDUAL FULFILLMENT
+
PACKING
+
SHIPPING HANDLING
```

Therefore dropship pricing may differ from bulk reseller pricing.

---

# 49. Dropship Fee

Potential:

```text id="rsp036"
PER ORDER
PER ITEM
or
BUILT INTO PRICE
```

Must remain transparent to reseller.

---

# 50. Dropship Workflow

Canonical:

```text id="rsp037"
RESELLER SELLS
↓
ORDER SUBMITTED TO TEEStock
↓
PAYMENT / CREDIT CHECK
↓
STOCK RESERVE
↓
PICK
↓
PACK
↓
SHIP TO CUSTOMER
↓
TRACKING TO RESELLER
```

---

# 51. End-Customer Payment

Early preferred:

```text id="rsp038"
RESELLER
collects customer payment
```

and TeeStock bills reseller.

This keeps commercial relationship clear.

---

# 52. Marketplace Dropship

Can create platform-policy complications.

Only activate where reseller/channel terms allow the operating model.

---

# 53. Customer Ownership

Critical distinction.

For reseller-led sale:

```text id="rsp039"
RESELLER
owns primary commercial relationship with end customer.
```

TeeStock may process fulfillment data only as necessary.

---

# 54. Customer Data

Dropship fulfillment may require:

```text id="rsp040"
Name
Address
Phone
Order Data
```

Use only according to agreed purpose/privacy framework.

---

# 55. Customer Poaching Prohibition

TeeStock should not use reseller-provided end-customer data to bypass reseller relationship improperly.

Likewise reseller should respect TeeStock confidential/commercial information.

---

# 56. TeeStock Direct Customers

Customers acquired directly by TeeStock remain TeeStock relationships.

No reseller may claim them merely by proximity.

---

# 57. Attribution

Reseller orders must map to:

```text id="rsp041"
RESELLER ACCOUNT
```

for reporting and economics.

---

# 58. Reseller Order

Canonical model:

```text id="rsp042"
BUSINESS ACCOUNT
↓
RESELLER ORDER
↓
ORDER ITEMS
↓
FULFILLMENT
```

---

# 59. Bulk Order

Reseller receives products at own location.

---

# 60. Dropship Order

End-customer shipping address differs from reseller account address.

---

# 61. Order Status

Potential reseller-facing:

```text id="rsp043"
Pending
Confirmed
Processing
Shipped
Completed
Issue
```

---

# 62. Order Source

Track:

```text id="rsp044"
DIRECT ORDER
PORTAL
IMPORT
API
```

later.

---

# 63. Self-Service Ordering

Reseller Program is good candidate for self-service once:

```text id="rsp045"
PRODUCT
PRICE
INVENTORY
PAYMENT
```

are stable.

---

# 64. Reseller Portal

Future may provide:

```text id="rsp046"
Catalog
Account Pricing
Stock
Order
Dropship
Tracking
Invoice
Reorder
```

---

# 65. Portal Is Not V1 Requirement

Start with structured manual ordering.

---

# 66. Catalog Access

Reseller should see only:

```text id="rsp047"
ELIGIBLE PRODUCTS
+
ELIGIBLE PRICES
```

---

# 67. Inventory Visibility

Potential levels:

```text id="rsp048"
IN STOCK
LOW STOCK
OUT OF STOCK
```

or exact qty for qualified accounts.

Exact visibility depends strategy.

---

# 68. Stock Reservation

Reseller should not assume displayed stock is permanently reserved.

Reservation occurs according to order/payment rules.

---

# 69. Preorder

Resellers may access preorder products if commercial terms support it.

---

# 70. Product Launch Access

Strategic resellers may receive:

```text id="rsp049"
EARLY ORDER WINDOW
```

not necessarily exclusive rights.

---

# 71. Territory

Default:

```text id="rsp050"
NON-EXCLUSIVE
```

unless explicit strategic agreement exists.

---

# 72. Territory Rights

Exclusive territory should only be granted for meaningful:

```text id="rsp051"
VOLUME COMMITMENT
+
PERFORMANCE
+
STRATEGIC VALUE
```

---

# 73. Why Avoid Early Exclusivity

Exclusive rights can:

- block better channels,
- reduce optionality,
- create dependency.

---

# 74. Territory Record

If applicable:

```text id="rsp052"
AREA
TERM
PRODUCTS
PERFORMANCE REQUIREMENTS
EXCLUSIVITY TYPE
```

---

# 75. Channel Rules

Resellers may operate through:

```text id="rsp053"
SOCIAL
WEBSITE
MARKETPLACE
PHYSICAL STORE
COMMUNITY
```

subject to policy.

---

# 76. Restricted Channels

Certain products/brands may prohibit specific marketplaces or sales methods.

This must be explicit.

---

# 77. Marketplace Price Competition

Uncontrolled reseller undercutting can damage:

- pricing,
- brand,
- other partners.

Need channel pricing governance where legally/commercially appropriate.

---

# 78. Suggested Retail Price

TeeStock may publish:

```text id="rsp054"
RECOMMENDED RETAIL PRICE
```

where appropriate.

Actual legal constraints on resale pricing must be respected.

---

# 79. Promotional Rules

Reseller promotions should not:

- misrepresent original price,
- use unauthorized claims,
- damage brand representation.

---

# 80. Brand Usage

Resellers may use approved TeeStock:

```text id="rsp055"
LOGO
PRODUCT PHOTOS
PRODUCT COPY
```

only according to brand-use rules.

---

# 81. Official Reseller Claim

Only active approved resellers may describe themselves using permitted official wording.

---

# 82. Reseller Is Not TeeStock

Reseller must not imply:

- employment,
- ownership,
- corporate branch status,

unless actually authorized.

---

# 83. Product Content

TeeStock should provide canonical:

```text id="rsp056"
PRODUCT NAME
IMAGES
SPEC
SIZE GUIDE
CARE
CLAIMS
```

to reduce misinformation.

---

# 84. Modified Product Content

Reseller may adapt presentation where permitted.

Core product facts must remain accurate.

---

# 85. White-Label Boundary

White-label means customer-facing product may not present TeeStock identity.

This is materially different from normal resale.

---

# 86. White-Label Gate

Only consider when:

```text id="rsp057"
PRODUCT RIGHTS ALLOW
+
VOLUME JUSTIFIES
+
ECONOMICS WORK
+
BRAND CONFLICT LOW
+
OPERATIONS SUPPORT IT
```

---

# 87. White-Label vs Supply

Many white-label requests may be better classified as:

```text id="rsp058"
TEEStock SUPPLY
+
CUSTOM / BUSINESS
```

rather than Reseller Program.

---

# 88. Private Label

If reseller wants own branded garment/product:

that moves closer to:

```text id="rsp059"
B2B PRODUCT DEVELOPMENT / SUPPLY
```

not standard resale.

---

# 89. Returns — Stock Reseller

End-customer returns are generally reseller's responsibility.

Reseller may make B2B claim to TeeStock for eligible:

```text id="rsp060"
DEFECT
WRONG PRODUCT
FULFILLMENT ERROR
```

according to policy.

---

# 90. Returns — Dropship

If TeeStock directly fulfills, operational returns may be coordinated through TeeStock.

Commercial customer relationship still belongs to reseller unless agreed otherwise.

---

# 91. Warranty Claims

Canonical separation:

```text id="rsp061"
CUSTOMER CHANGE OF MIND
vs
PRODUCT DEFECT
vs
FULFILLMENT ERROR
```

---

# 92. Reseller Abuse

Potential:

```text id="rsp062"
PERSONAL USE DISGUISED AS RESELLER
PRICE ABUSE
COUNTERFEIT
UNAUTHORIZED BRAND CLAIMS
PAYMENT FRAUD
CHANNEL POLICY VIOLATION
```

---

# 93. Fraud Monitoring

Use:

```text id="rsp063"
ACCOUNT REVIEW
ORDER PATTERN
PAYMENT CHECK
POLICY ENFORCEMENT
```

proportionally.

---

# 94. Counterfeit Risk

Approved reseller cannot manufacture or substitute counterfeit TeeStock-branded goods.

Serious breach may justify suspension/termination.

---

# 95. Product Substitution

Reseller should not substitute other products while claiming they are official TeeStock products.

---

# 96. Payment Terms

Early default:

```text id="rsp064"
PREPAID
```

---

# 97. Credit Terms

Only for qualified accounts after:

```text id="rsp065"
PAYMENT HISTORY
+
VOLUME
+
RISK REVIEW
```

---

# 98. Credit Limit

If granted:

store:

```text id="rsp066"
LIMIT
OUTSTANDING
AVAILABLE CREDIT
```

---

# 99. Late Payment

Can trigger:

- order hold,
- credit suspension,
- account review.

---

# 100. Reseller Account Memory

Track:

```text id="rsp067"
Usual Products
Order Frequency
Channel
Territory
Price Book
Payment Terms
Fulfillment Model
```

---

# 101. Reorder

Canonical:

```text id="rsp068"
PAST ORDER
↓
VERIFY PRICE / STOCK
↓
REORDER
```

---

# 102. Recurring Reseller Orders

Repeated patterns may become:

```text id="rsp069"
REORDER TEMPLATE
```

---

# 103. Reseller Forecast

Strategic reseller may provide forecasts.

Forecast ≠ confirmed order.

---

# 104. Allocation

High-performing/contract resellers may receive stock allocation priority where agreed.

---

# 105. Allocation Must Not Starve Core Business Accidentally

Supply and inventory governance should evaluate ecosystem priorities.

---

# 106. Reseller Performance

Core dimensions:

```text id="rsp070"
REVENUE
CONTRIBUTION
ORDER FREQUENCY
PAYMENT QUALITY
CHANNEL QUALITY
POLICY COMPLIANCE
```

---

# 107. Reseller Metrics

Program:

```text id="rsp071"
Applications
Approved Resellers
Active Resellers
Activation Rate
```

Commercial:

```text id="rsp072"
Orders
Units
Revenue
Contribution
Average Order Value
```

Relationship:

```text id="rsp073"
Repeat Rate
Order Frequency
Retention
```

Risk:

```text id="rsp074"
Late Payment
Returns
Policy Violations
```

---

# 108. Active Reseller Rate

Important because approved account count can become vanity metric.

---

# 109. Revenue Concentration

Monitor dependence on a small number of resellers.

---

# 110. Channel Concentration

Too much dependence on one marketplace/reseller channel creates platform risk.

---

# 111. Strategic Reseller Review

Evaluate:

```text id="rsp075"
Growth
Contribution
Reliability
Market Reach
Customer Quality
Operational Fit
```

---

# 112. Account Profitability

Revenue should be evaluated after:

```text id="rsp076"
DISCOUNT
FULFILLMENT
SUPPORT
PAYMENT TERMS
RETURNS
```

---

# 113. Low-Margin Reseller Trap

High-order volume is not attractive if:

```text id="rsp077"
LOW CONTRIBUTION
+
HIGH SUPPORT
+
SLOW CASH
```

---

# 114. Channel Conflict

Potential conflict:

```text id="rsp078"
TEEStock DIRECT
vs
RESELLER
```

requires thoughtful product/channel pricing.

---

# 115. Channel Conflict Is Not Automatically Bad

Direct and reseller channels can coexist if:

- value proposition differs,
- pricing is coherent,
- rules clear.

---

# 116. TeeStock Direct Pricing

Do not constantly undercut resellers through arbitrary direct discounts if reseller distribution is strategically important.

---

# 117. Reseller Exclusive Bundles

Potential future solution:

- special bundles,
- regional assortment.

Only if complexity justified.

---

# 118. Reseller Geography

Geographic data can reveal underserved regions.

Useful for distribution strategy.

---

# 119. Reseller as Market Sensor

Resellers can provide insight into:

```text id="rsp079"
LOCAL DEMAND
PRODUCT REQUESTS
PRICE SENSITIVITY
```

---

# 120. Feedback Capture

Repeated reseller requests should enter structured product/demand intelligence.

---

# 121. Reseller Program vs Affiliate Program

Canonical decision:

```text id="rsp080"
WANTS TO BUY / RESELL PRODUCT
→ RESELLER

WANTS TO SEND TRAFFIC / REFERRAL
→ AFFILIATE
```

---

# 122. Reseller Program vs Supply

Canonical:

```text id="rsp081"
WANTS B2B PRODUCT INPUTS
→ SUPPLY

WANTS FORMAL DISTRIBUTION RELATIONSHIP
→ RESELLER PROGRAM
```

A customer may use both.

---

# 123. Reseller Program vs Business

If organization buys apparel for internal use:

```text id="rsp082"
TEEStock BUSINESS
```

not reseller.

---

# 124. Reseller Program vs Merch

If creator wants TeeStock to operate merchandise sales:

```text id="rsp083"
TEEStock MERCH
```

not reseller.

---

# 125. Reseller + Affiliate Dual Role

Possible.

Example:

```text id="rsp084"
Reseller buys stock
+
also refers customers to TeeStock direct products
```

Attribution and incentives must remain separate.

---

# 126. Reseller + Partner Dual Role

A print shop could theoretically:

```text id="rsp085"
RESELL TEEStock PRODUCT
+
PROVIDE PRODUCTION CAPABILITY
```

Two enrollments.

One entity.

---

# 127. Reseller Onboarding

Canonical:

```text id="rsp086"
APPROVAL
↓
TERMS
↓
ACCOUNT SETUP
↓
PRICE BOOK
↓
CHANNEL GUIDELINES
↓
ORDER GUIDE
↓
FIRST ORDER
```

---

# 128. Reseller Guide

Should cover:

```text id="rsp087"
Eligible Products
Pricing
MOQ
Ordering
Payment
Brand Rules
Dropship
Returns
Support
```

---

# 129. First Order

First order is useful operational activation signal.

---

# 130. Reseller Activation

Canonical:

```text id="rsp088"
APPROVED
≠
ACTIVE

FIRST VALID ORDER
→
ACTIVATED
```

---

# 131. Onboarding Support

Early accounts may need human support.

Goal is eventually reduce support through clear catalog and systems.

---

# 132. Reseller Support

Possible categories:

```text id="rsp089"
PRODUCT
STOCK
ORDER
PAYMENT
SHIPPING
CLAIM
```

---

# 133. Support Boundary

TeeStock is not reseller's general business consultant by default.

---

# 134. Reseller Portal Maturity

```text id="rsp090"
STAGE 0
WhatsApp + invoice

STAGE 1
Structured order form

STAGE 2
Account catalog / price book

STAGE 3
Self-service order + dropship

STAGE 4
API / bulk integrations
```

---

# 135. Automation Opportunities

Potential:

```text id="rsp091"
Eligibility Screening
Account Creation
Price Book Assignment
Stock Check
Order Creation
Invoice
Tracking
Reorder Reminder
```

---

# 136. AI Role

AI may assist:

```text id="rsp092"
Application Summary
Account Health Summary
Demand Analysis
Support
Order Pattern Analysis
```

---

# 137. AI Pricing Boundary

AI should not invent reseller pricing.

Pricing comes from deterministic rules/approved price books.

---

# 138. AI Credit Boundary

AI may flag risk.

It should not independently grant substantial credit.

---

# 139. AI Policy Boundary

AI can flag suspected channel/policy anomalies.

Human review for serious suspension.

---

# 140. Reseller MGBOS Entities

Core:

```text id="rsp093"
PARTICIPANT
BUSINESS ACCOUNT
RESELLER ENROLLMENT
PRICE BOOK
PRODUCT ELIGIBILITY
RESELLER ORDER
PAYMENT TERM
TERRITORY
CHANNEL
```

---

# 141. Reseller Enrollment Record

Should know:

```text id="rsp094"
Participant
Status
Tier
Model
Price Book
Channels
Territory
Terms
```

---

# 142. Reseller Price Book

Central source for current reseller prices.

No manual price memory.

---

# 143. Product Eligibility Rule

Can depend on:

```text id="rsp095"
PRODUCT
CHANNEL
TIER
REGION
```

if needed.

---

# 144. Territory Entity

Only needed when commercial territory is actually managed.

Do not create complexity prematurely.

---

# 145. Reseller Order Data Lineage

Canonical:

```text id="rsp096"
RESELLER
↓
PRICE BOOK
↓
ORDER
↓
ORDER ITEM
↓
INVENTORY
↓
FULFILLMENT
↓
PAYMENT
```

---

# 146. Current Recommended V1

Start:

```text id="rsp097"
LIMITED APPLICATION
+
FEW ELIGIBLE PRODUCTS
+
PREPAID
+
STANDARD RESELLER PRICE BOOK
+
BULK FULFILLMENT
+
MANUAL ACCOUNT SUPPORT
```

---

# 147. Dropship V1

If tested:

```text id="rsp098"
FEW RESELLERS
FEW PRODUCTS
STANDARD PACKAGING
CLEAR FEE
```

---

# 148. V1 Exclusions

Avoid:

```text id="rsp099"
nationwide exclusive distributors
long credit terms
hundreds of reseller SKUs
open automated approval
complex white label
multi-level reseller structures
```

---

# 149. No Multi-Level Reseller Structure by Default

Avoid:

```text id="rsp100"
master reseller
↓
sub reseller
↓
sub-sub reseller
```

unless future distribution economics clearly require it.

---

# 150. V2 Expansion

Possible:

```text id="rsp101"
SELF-SERVICE CATALOG
DROPSHIP
ACCOUNT PRICING
REORDER
RESELLER DASHBOARD
```

---

# 151. V3 Expansion

Possible:

```text id="rsp102"
STRATEGIC DISTRIBUTORS
TERRITORY MANAGEMENT
CONTRACT PRICING
BULK ORDER IMPORT
API
```

---

# 152. Program Scale Gate

Scale only if:

```text id="rsp103"
PRODUCT AVAILABILITY STABLE
+
PRICE BOOK STABLE
+
ORDER PROCESS RELIABLE
+
CONTRIBUTION HEALTHY
+
SUPPORT MANAGEABLE
```

---

# 153. Strategic Reseller Gate

Strategic status only if:

```text id="rsp104"
REPEAT VOLUME
+
HEALTHY ECONOMICS
+
GOOD PAYMENT
+
CHANNEL QUALITY
+
LONG-TERM VALUE
```

---

# 154. Exclusivity Gate

Exclusive rights only if expected value clearly exceeds lost channel optionality.

---

# 155. White-Label Gate

Only after normal reseller/supply operations are proven.

---

# 156. Program Pause

Reseller may be paused because:

```text id="rsp105"
NO ACTIVITY
PAYMENT ISSUE
CHANNEL ISSUE
POLICY REVIEW
```

---

# 157. Suspension

Possible serious causes:

```text id="rsp106"
FRAUD
COUNTERFEIT
BRAND MISREPRESENTATION
SERIOUS PAYMENT DEFAULT
POLICY BREACH
```

---

# 158. Exit

Canonical:

```text id="rsp107"
STOP NEW ORDERS
↓
COMPLETE OPEN ORDERS
↓
SETTLE FINANCE
↓
REMOVE PROGRAM ACCESS
↓
REMOVE OFFICIAL CLAIM
↓
ARCHIVE ENROLLMENT
```

---

# 159. Remaining Reseller Inventory

If reseller already owns legitimately purchased inventory:

exit does not automatically transfer ownership back.

Sell-through/brand-use rules may still apply.

---

# 160. Reseller Program Flywheel

```text id="rsp108"
GOOD PRODUCTS
↓
RESELLERS SELL
↓
MORE DISTRIBUTION
↓
MORE VOLUME
↓
BETTER PROCUREMENT
↓
BETTER PRODUCT ECONOMICS
↓
STRONGER RESELLER OPPORTUNITY
```

---

# 161. Distribution Intelligence Loop

```text id="rsp109"
RESELLER ORDERS
↓
REGIONAL / CUSTOMER SIGNAL
↓
PRODUCT INSIGHT
↓
BETTER ASSORTMENT
↓
MORE RESELLER SALES
```

---

# 162. Reseller Program Failure Modes

## Discount Club

No real resale activity.

## Price Negotiated Every Order

No scalability.

## Unlimited Product Access

Channel/IP conflict.

## Credit Too Early

Cash risk.

## Dropship Without Accurate Stock

Customer failure.

## Exclusive Territory Too Early

Blocks growth.

## Reseller Misrepresents TeeStock

Brand risk.

## High Revenue / No Contribution

Vanity growth.

---

# 163. What Reseller Program Must Not Become

## Pyramid / Multi-Level Selling Structure

Distribution economics should remain direct and transparent.

## Uncontrolled Marketplace

TeeStock determines eligibility and products.

## Wholesale Price Leak

Account pricing should remain appropriately controlled.

## Brand Dilution Engine

External distribution must preserve product truth.

## Credit-Financing Operation

Working capital discipline remains essential.

---

# 164. Reseller Program Success Definition

The Program succeeds when:

```text id="rsp110"
TEEStock PROVIDES
Reliable product + clear economics

RESELLER PROVIDES
Sales + distribution

CUSTOMER RECEIVES
Correct product

BOTH PARTIES
earn healthy economics and want to repeat
```

---

# 165. Canonical Reseller Progression

```text id="rsp111"
APPLY
↓
APPROVE
↓
FIRST ORDER
↓
REPEAT
↓
GROW
↓
ACCOUNT PRICING
↓
STRATEGIC RELATIONSHIP
```

---

# 166. Canonical Relationship Summary

```text id="rsp112"
SUPPLY
provides B2B products.

RESELLER PROGRAM
governs resale participation.

FULFILL
executes physical distribution.

COMMERCE
handles TeeStock direct retail.

AFFILIATE
refers customers without becoming reseller.

MGBOS
tracks account, pricing, orders, and performance.
```

---

# 167. Canonical Reseller Principles

```text id="rsp113"
RESELLING BEFORE DISCOUNT.

PRODUCT ELIGIBILITY BEFORE ACCESS.

PRICE BOOK BEFORE NEGOTIATION CHAOS.

PREPAID BEFORE CREDIT.

NON-EXCLUSIVE BEFORE EXCLUSIVE.

STABLE STOCK BEFORE DROPSHIP SCALE.

CLEAR CUSTOMER OWNERSHIP BEFORE DATA SHARING.

BRAND RULES BEFORE DISTRIBUTION SCALE.

CONTRIBUTION BEFORE REVENUE VANITY.

REPEAT PERFORMANCE BEFORE STRATEGIC TERMS.

DISTRIBUTION WITHOUT LOSING CONTROL.
```

---

# 168. Dependency

Dokumen berikut harus follow Reseller Program:

1. `06-programs/partner-program.md`
2. `06-programs/affiliate-program.md`
3. `07-operations/inventory-system.md`
4. `07-operations/order-fulfillment.md`
5. `08-finance/unit-economics.md`
6. `08-finance/pricing-framework.md`
7. `08-finance/treasury-policy.md`
8. `10-product-tech/partner-platform.md`
9. `10-product-tech/automation-architecture.md`
10. `11-data-mgbos/canonical-data-model.md`
11. `11-data-mgbos/entity-hierarchy.md`
12. `12-legal-ip/customer-commerce-policy.md`
13. `13-metrics-experiments/kpi-framework.md`

Reseller Program boleh berkembang menjadi distribution network yang lebih luas, tetapi growth harus selalu mengikuti stable product availability, clear price books, channel governance, healthy contribution, controlled credit risk, dan explicit reseller/customer relationship boundaries.