---
title: "TeeStock Commerce Platform"
date: "2026-09-28"
bisnis: teestock
kategori: operasional
status: active
tags:
  - bisnis/teestock
  - kategori/operasional
  - teestock/canonical
  - teestock/product-tech
document_id: "TS-TEC-003"
version: "1.0"
category: "product-tech"
business: "teestock"
last_updated: "2026-09-28"
path: "10-product-tech/commerce-platform.md"
depends_on:
  - "TS-TEC-001"
  - "TS-TEC-002"
  - "TS-COM-001"
  - "TS-COM-004"
  - "TS-COM-005"
  - "TS-OPS-005"
  - "TS-OPS-006"
  - "TS-OPS-008"
  - "TS-FIN-002"
  - "TS-FIN-003"
  - "TS-MKT-004"
  - "TS-MKT-005"
---


# TeeStock Commerce Platform v1.0

> [!abstract] **Canonical TeeStock Commerce Engine, Transaction & Order-Orchestration Framework  **
> Dokumen ini mendefinisikan catalog, product presentation, pricing, promotions, inventory availability, cart, checkout, order lifecycle, payment, allocation, preorder, made-to-order, returns integration, channel normalization, merchandising, search, customer account, order history, and shared commerce capabilities untuk TeeStock.
>
> [!info] **Dependencies & Data Flow (SSOT)**
> [[bisnis/teestock/10-product-tech/digital-product-vision|TS-TEC-001: TeeStock Digital Product Vision]] • [[bisnis/teestock/10-product-tech/website-information-architecture|TS-TEC-002: TeeStock Website Information Architecture]] • [[bisnis/teestock/03-commerce/commerce-overview|TS-COM-001: TeeStock Commerce Overview]] • [[bisnis/teestock/03-commerce/catalog-merchandising-system|TS-COM-004: TeeStock Catalog & Merchandising System]] • [[bisnis/teestock/03-commerce/product-taxonomy|TS-COM-005: TeeStock Product Taxonomy]] • [[bisnis/teestock/07-operations/inventory-system|TS-OPS-005: TeeStock Inventory System]] • [[bisnis/teestock/07-operations/order-fulfillment|TS-OPS-006: TeeStock Order Fulfillment System]] • [[bisnis/teestock/07-operations/returns-and-warranty|TS-OPS-008: TeeStock Returns & Warranty System]] • [[bisnis/teestock/08-finance/unit-economics|TS-FIN-002: TeeStock Unit Economics]] • [[bisnis/teestock/08-finance/pricing-framework|TS-FIN-003: TeeStock Pricing Framework]] • [[bisnis/teestock/09-marketing/channel-strategy|TS-MKT-004: TeeStock Channel Strategy]] • [[bisnis/teestock/09-marketing/retention-and-community|TS-MKT-005: TeeStock Retention & Community]]


---

# 1. Purpose

Commerce Platform menjawab:

> **Bagaimana TeeStock menerima, memvalidasi, memproses, memenuhi, dan merekonsiliasi transaksi commerce dari berbagai produk, brands, channels, dan business models melalui satu commercial operating truth?**

Canonical principle:

> **One commerce engine. Many storefront experiences.**

---

# 2. Canonical Definition

> **TeeStock Commerce Platform adalah shared transactional system yang menghubungkan catalog, pricing, inventory, cart, checkout, customer identity, payment, order management, fulfillment, returns, channels, dan commerce analytics sehingga seluruh consumer commerce TeeStock dapat berjalan secara konsisten di berbagai storefront dan distribution channels.**

---

# 3. Commerce Platform Is Not Storefront

Critical distinction:

```text id="cp001"
STOREFRONT
what customer sees.

COMMERCE PLATFORM
business logic that makes transaction possible.
```

---

# 4. Long-Term Commerce Role

Commerce Platform should serve:

```text id="cp002"
TEEStock SELECTS
TEEStock ESSENTIALS
TEEStock ORIGINALS
CREATOR MERCH
COLLABORATIONS
FUTURE LABELS
SELECT B2B SELF-SERVICE
```

without building separate commerce logic for each.

---

# 5. Core Commerce Architecture

Canonical:

```text id="cp003"
PRODUCT MASTER
↓
CATALOG
↓
MERCHANDISING
↓
PRICING
↓
AVAILABILITY
↓
CART
↓
CHECKOUT
↓
PAYMENT
↓
ORDER
↓
FULFILLMENT / PRODUCTION
↓
RETURN / REFUND
↓
FINANCIAL RECONCILIATION
```

---

# 6. Commerce Domains

Recommended logical modules:

```text id="cp004"
CATALOG
MERCHANDISING
PRICING
INVENTORY AVAILABILITY
CART
CHECKOUT
ORDER
PAYMENT
FULFILLMENT ORCHESTRATION
RETURNS
CUSTOMER ACCOUNT
CHANNEL
```

---

# 7. Shared Commerce Logic

Canonical:

> **Business rules should be shared even when customer experiences differ.**

Example:

```text id="cp005"
Website
Marketplace
Creator Store
Future Label Store
```

may differ visually while using the same:

```text id="cp006"
PRODUCT
PRICE
INVENTORY
ORDER
PAYMENT
```

truth.

---

# 8. Product Master vs Catalog

Critical:

```text id="cp007"
PRODUCT MASTER
canonical product definition.

CATALOG
commercially sellable presentation.
```

---

# 9. Product Master

Stores core truth such as:

```text id="cp008"
Product ID
Product Type
Product Family
Variant Structure
Garment Platform
Design
Application
Ownership
Status
```

---

# 10. Catalog

Determines:

```text id="cp009"
WHERE
WHEN
TO WHOM
HOW
```

a product is presented for sale.

---

# 11. One Product, Multiple Catalog Contexts

Same product may appear in:

```text id="cp010"
MAIN SHOP
CREATOR STORE
COLLECTION
MARKETPLACE
LABEL STORE
```

without becoming duplicate products.

---

# 12. Catalog Entry

Potential canonical object:

```text id="cp011"
Catalog Entry
├── Product
├── Channel
├── Status
├── Availability Rule
├── Price Context
├── Merchandising Metadata
└── Effective Period
```

---

# 13. Catalog Status

Potential:

```text id="cp012"
DRAFT
ACTIVE
SCHEDULED
PAUSED
SOLD_OUT
ARCHIVED
```

---

# 14. Product Status vs Catalog Status

Critical:

```text id="cp013"
PRODUCT STATUS
does the product exist / is it approved?

CATALOG STATUS
is it currently sellable here?
```

---

# 15. Product Variant

Canonical:

> **Variant represents a standardized sellable variation of a Product.**

Examples:

```text id="cp014"
SIZE
COLOR
GARMENT
```

---

# 16. SKU

SKU represents stock-tracked standardized sellable unit.

---

# 17. Sellable Configuration

Used when customer selects a configuration that should not create permanent SKU.

Examples:

```text id="cp015"
CUSTOM PRINT PLACEMENT
PERSONALIZED NAME
CUSTOM ARTWORK
```

---

# 18. SKU vs Configuration

Canonical:

```text id="cp016"
STANDARD REPEATABLE STOCK ITEM
→ SKU

CUSTOMER-SPECIFIC CONFIGURATION
→ SELLABLE CONFIGURATION
```

---

# 19. Product Ownership

Commerce engine should know whether product is:

```text id="cp017"
SELECTS
ESSENTIALS
ORIGINALS
COLLABORATION
CREATOR MERCH
```

for reporting and economics.

---

# 20. Ownership Is Not Frontend Category

It is canonical commercial relationship metadata.

---

# 21. Product Source

Potential:

```text id="cp018"
INTERNAL
LICENSED
COMMISSIONED
COLLABORATION
CREATOR
```

---

# 22. Product Availability Mode

Canonical:

```text id="cp019"
READY_STOCK
MADE_TO_ORDER
PREORDER
HYBRID
```

---

# 23. Ready Stock

Customer can purchase from available inventory.

---

# 24. Made-to-Order

Product is produced after order.

---

# 25. Preorder

Customer commits before planned production/release.

---

# 26. Hybrid

Some variants stocked, others made-to-order.

---

# 27. Availability Mode Must Be Explicit

Do not infer from stock quantity alone.

---

# 28. Inventory Availability

Canonical:

```text id="cp020"
PHYSICAL ON HAND
-
RESERVED
-
UNAVAILABLE / HOLD
=
AVAILABLE TO SELL
```

subject to Inventory System policy.

---

# 29. Available-to-Sell

Commerce should read ATS.

Not raw warehouse quantity.

---

# 30. Inventory Reservation

At defined checkout/payment stage, system may reserve stock.

---

# 31. Reservation Timing

Potential strategies:

```text id="cp021"
ON CART
ON CHECKOUT
ON PAYMENT INITIATION
ON PAYMENT CONFIRMATION
```

TeeStock should choose based on scarcity and payment behavior.

---

# 32. Recommended Early Default

Reserve at:

```text id="cp022"
VALID CHECKOUT / PAYMENT WINDOW
```

with expiration.

Avoid indefinite cart reservation.

---

# 33. Reservation Expiry

If payment is not completed:

```text id="cp023"
RESERVATION
→ RELEASED
```

---

# 34. Overselling

Canonical:

> **Commerce must never intentionally sell more standardized stock than reliable ATS permits unless backorder/preorder is explicitly supported.**

---

# 35. Backorder

Not default V1 mode.

If later used:

must define:

```text id="cp024"
CUSTOMER EXPECTATION
SUPPLY CONFIDENCE
LEAD TIME
CANCEL POLICY
```

---

# 36. Low Stock

Can be shown if threshold logic is real.

Avoid artificial urgency.

---

# 37. Sold Out

Should allow:

```text id="cp025"
RELATED PRODUCT
WAITLIST
RESTOCK INTEREST
```

where relevant.

---

# 38. Waitlist

Captures demand signal.

Does not guarantee restock.

---

# 39. Preorder Architecture

Canonical:

```text id="cp026"
PREORDER CAMPAIGN
↓
ORDER COMMITMENT
↓
DEMAND CUTOFF
↓
PRODUCTION
↓
FULFILLMENT
```

---

# 40. Preorder Requires

```text id="cp027"
CLEAR WINDOW
CLEAR EXPECTED DELIVERY
CLEAR PAYMENT TERMS
CLEAR CANCELLATION RULE
```

---

# 41. Preorder Demand Signal

Stronger than:

```text id="cp028"
LIKE
WAITLIST
PRODUCT VIEW
```

because customer commits money.

---

# 42. Preorder Campaign Entity

Potential:

```text id="cp029"
Preorder ID
Product
Start
End
Delivery Window
Min / Max Qty
Status
```

---

# 43. Made-to-Order Architecture

Canonical:

```text id="cp030"
ORDER
↓
PRODUCTION REQUIREMENT
↓
WORK ORDER
↓
QC
↓
FULFILLMENT
```

---

# 44. MTO Product Must Expose Lead Time

Customer should know order is not ready stock.

---

# 45. MTO Capacity

Commerce may eventually check production capacity before promising date.

---

# 46. Capacity-Aware Selling

Future:

```text id="cp031"
DEMAND
+
PRODUCTION CAPACITY
=
SELLABLE PROMISE
```

---

# 47. Pricing Engine

Canonical:

```text id="cp032"
PRODUCT
+
PRICE BOOK
+
CHANNEL
+
CUSTOMER CONTEXT
+
QTY
+
PROMOTION
+
CONFIGURATION
=
FINAL PRICE
```

---

# 48. Commerce Should Not Hardcode Prices

Price comes from Pricing Framework.

---

# 49. Price Components

Potential:

```text id="cp033"
BASE PRICE
OPTION PRICE
PROMOTION
DISCOUNT
SHIPPING
TAX
```

---

# 50. List Price

Reference/base commercial price.

---

# 51. Transaction Price

Actual accepted selling price.

---

# 52. Historical Price Snapshot

Order should preserve:

```text id="cp034"
LIST PRICE
DISCOUNT
FINAL PRICE
PRICE RULE
```

at purchase time.

---

# 53. Price Changes

Future price-book changes must not alter completed order history.

---

# 54. Channel Pricing

Website, marketplace, reseller, and creator contexts may have different price books.

---

# 55. Customer-Specific Pricing

Potential later for:

```text id="cp035"
BUSINESS ACCOUNT
RESELLER
```

not opaque consumer personalization.

---

# 56. Promotion Engine

Canonical:

```text id="cp036"
PROMOTION
├── Eligibility
├── Benefit
├── Time Window
├── Product Scope
├── Customer Scope
├── Channel Scope
└── Stack Rule
```

---

# 57. Promotion Types

Potential:

```text id="cp037"
PERCENT OFF
FIXED OFF
BUNDLE
FREE SHIPPING
BUY X GET Y
MEMBER PRICE
```

---

# 58. Coupon

Coupon is an access mechanism to promotion/discount rule.

---

# 59. Coupon Fields

Potential:

```text id="cp038"
CODE
RULE
START
END
USAGE LIMIT
CUSTOMER LIMIT
```

---

# 60. Promotion Stacking

Must be deterministic.

---

# 61. Promotion Stack Check

Example:

```text id="cp039"
BASE PROMO
+
COUPON
+
AFFILIATE
+
FREE SHIPPING
```

only if policy permits.

---

# 62. Margin Guardrail

Commerce engine should eventually warn/block promotion that crosses margin floor.

---

# 63. Cart

Canonical:

> **Cart is a temporary commercial intent state—not an order.**

---

# 64. Cart Contains

Potential:

```text id="cp040"
CUSTOMER / SESSION
LINE ITEMS
QTY
CONFIGURATION
PRICE SNAPSHOT
PROMOTION
```

---

# 65. Cart Price Is Provisional

Final price may be revalidated at checkout.

---

# 66. Cart Availability Is Provisional

Stock may change before reservation.

---

# 67. Cart Expiry

Anonymous abandoned carts can expire operationally.

Analytics can preserve aggregate events.

---

# 68. Cart Merge

Known user may merge guest cart after login.

Not V1-critical.

---

# 69. Checkout

Canonical:

```text id="cp041"
IDENTITY
↓
DELIVERY
↓
PRICE REVALIDATION
↓
AVAILABILITY REVALIDATION
↓
PAYMENT
↓
ORDER CONFIRMATION
```

---

# 70. Checkout Objective

Minimize friction while preserving transaction integrity.

---

# 71. Guest Checkout

Recommended for consumer commerce unless account requirement adds real value.

---

# 72. Checkout Validation

Must validate:

```text id="cp042"
PRODUCT
QTY
PRICE
PROMOTION
ADDRESS
SHIPPING
AVAILABILITY
```

before final commitment.

---

# 73. Checkout Session

Potential canonical object for short-lived checkout state.

---

# 74. Shipping Option

Should come from:

```text id="cp043"
DESTINATION
ORDER
CARRIER / RULE
SERVICE LEVEL
```

---

# 75. Delivery Promise

Should not be fabricated from carrier estimates alone.

---

# 76. Order

Canonical:

> **Order is the commercial commitment representing what customer agreed to buy under defined price, payment, and fulfillment terms.**

---

# 77. Order Structure

Canonical:

```text id="cp044"
ORDER
├── CUSTOMER
├── ORDER ITEMS
├── PRICE
├── DISCOUNT
├── SHIPPING
├── PAYMENT
├── FULFILLMENT
└── STATUS
```

---

# 78. Order Item

Primary economic unit.

Stores:

```text id="cp045"
PRODUCT
VARIANT / CONFIGURATION
QTY
UNIT PRICE
DISCOUNT
SOURCE
```

---

# 79. Order Number vs Internal ID

Human-friendly order number may differ from immutable system ID.

---

# 80. Order Source

Potential:

```text id="cp046"
WEBSITE
MARKETPLACE
MANUAL
CREATOR STORE
BUSINESS PORTAL
```

---

# 81. Order Channel

Store separately from acquisition source.

---

# 82. Order Status

Customer-facing and internal status should be separated.

---

# 83. Internal Order Lifecycle

Potential:

```text id="cp047"
DRAFT
PENDING_PAYMENT
PAID
CONFIRMED
PROCESSING
FULFILLED
COMPLETED
CANCELLED
```

with subdomain details elsewhere.

---

# 84. Customer-Facing Lifecycle

Simpler:

```text id="cp048"
ORDER RECEIVED
PAYMENT CONFIRMED
PROCESSING
SHIPPED
DELIVERED
```

---

# 85. Order Status Is Not Fulfillment Status

Critical.

An order may contain:

```text id="cp049"
MULTIPLE FULFILLMENTS
```

---

# 86. Split Fulfillment

Future support:

```text id="cp050"
ONE ORDER
→ MULTIPLE SHIPMENTS
```

if items originate from different flows.

---

# 87. Partial Fulfillment

System should support later if necessary.

Not V1 priority.

---

# 88. Order Mutation

After payment/confirmation, material edits should be controlled.

---

# 89. Order Edit

Potential:

```text id="cp051"
ADDRESS CHANGE
QTY CHANGE
ITEM CHANGE
```

only before certain operational states.

---

# 90. Change After Commitment

May require:

```text id="cp052"
CANCEL + REORDER
```

or controlled amendment rather than silent edits.

---

# 91. Order History Must Remain Auditable

Canonical.

---

# 92. Payment

Canonical:

```text id="cp053"
ORDER
↓
PAYMENT INTENT
↓
PAYMENT ATTEMPT
↓
PAYMENT RESULT
```

---

# 93. Payment Intent

Represents amount expected to be collected.

---

# 94. Payment Attempt

Represents one provider/customer attempt.

---

# 95. Payment Status

Potential:

```text id="cp054"
PENDING
AUTHORIZED
PAID
FAILED
EXPIRED
REFUNDED
PARTIALLY_REFUNDED
```

depending provider model.

---

# 96. Order Paid Status

Should derive from validated payment state.

Not frontend callback alone.

---

# 97. Payment Provider Webhook

Should be verified and idempotent.

---

# 98. Duplicate Payment Events

Must not create duplicate orders/fulfillment.

---

# 99. Idempotency

Canonical technical principle:

> **Repeated delivery of the same external event must not create repeated business action.**

---

# 100. Payment Reconciliation

Commerce transaction must reconcile with provider settlement.

---

# 101. Cash vs Payment Status

Payment may be completed before bank settlement.

Treasury handles settlement timing.

---

# 102. COD

If ever supported:

requires different risk and order confirmation logic.

Not default assumption.

---

# 103. Failed Payment

Customer can retry without duplicate order where practical.

---

# 104. Payment Expiry

Pending unpaid order can expire based on configured payment window.

---

# 105. Cancellation

Canonical:

```text id="cp055"
CANCEL REQUEST
↓
ELIGIBILITY
↓
INVENTORY / PRODUCTION IMPACT
↓
REFUND if applicable
↓
ORDER CANCELLED
```

---

# 106. Cancellation Eligibility

Depends on:

```text id="cp056"
PAYMENT
FULFILLMENT
CUSTOMIZATION
PRODUCTION STATUS
```

---

# 107. Custom / MTO Cancellation

May differ significantly from ready-stock orders.

---

# 108. Return Integration

Commerce should expose customer return entry.

Return operations follow TS-OPS-008.

---

# 109. Return Request

Links:

```text id="cp057"
CUSTOMER
ORDER
ORDER ITEM
REASON
```

---

# 110. Return Eligibility

Commerce should read return policy/rules.

Do not hardcode random UI logic.

---

# 111. Refund

Canonical:

```text id="cp058"
APPROVED REFUND
↓
PAYMENT / TREASURY
↓
REFUND RESULT
↓
ORDER ECONOMICS UPDATE
```

---

# 112. Refund Is Not Return

Can happen:

- with return,
- without physical return.

---

# 113. Partial Refund

System should support at order-item/amount level.

---

# 114. Exchange

Can be modeled as:

```text id="cp059"
RETURN
+
REPLACEMENT / NEW FULFILLMENT
```

rather than opaque status.

---

# 115. Replacement

Should create traceable fulfillment/product cost.

---

# 116. Customer Account

Commerce account should eventually show:

```text id="cp060"
ORDERS
TRACKING
RETURNS
REORDER
ADDRESSES
PREFERENCES
```

---

# 117. Reorder

Canonical:

```text id="cp061"
PAST ORDER
↓
CURRENT PRODUCT / PRICE / AVAILABILITY REVALIDATION
↓
NEW CART
```

---

# 118. Reorder Is Not Order Duplication

Current commercial conditions apply.

---

# 119. Saved Product

Wishlist/favorite can be added later if behavior justifies.

---

# 120. Recently Viewed

Useful low-risk personalization.

---

# 121. Product Recommendations

Maturity:

```text id="cp062"
MANUAL
↓
RULE-BASED
↓
BEHAVIORAL
↓
AI-ASSISTED
```

---

# 122. Manual Merchandising

Recommended V1.

---

# 123. Merchandising

Canonical:

> **Merchandising determines which commercially eligible products receive visibility, placement, grouping, and priority.**

---

# 124. Merchandising Surfaces

Potential:

```text id="cp063"
HOME
SHOP
CATEGORY
COLLECTION
SEARCH
PDP
CART
```

---

# 125. Merchandising Rule

Could use:

```text id="cp064"
FEATURED
NEW
IN STOCK
COLLECTION
EDITORIAL
```

---

# 126. Bestseller

Only use if definition exists.

---

# 127. Trending

Only use if real data supports it.

---

# 128. Search

Commerce search should support customer vocabulary.

---

# 129. Search Inputs

Potential:

```text id="cp065"
NAME
CATEGORY
DESIGN
CREATOR
COLLECTION
LABEL
```

---

# 130. Search Ranking

Initially:

```text id="cp066"
TEXT MATCH
+
ACTIVE
+
AVAILABLE
+
MERCHANDISING BOOST
```

---

# 131. Search Zero Result

Should provide:

```text id="cp067"
RELATED CATEGORY
POPULAR PRODUCTS
HELPFUL QUERY SUGGESTION
```

---

# 132. Search Analytics

Capture:

```text id="cp068"
QUERY
RESULT COUNT
CLICK
PURCHASE
```

where useful.

---

# 133. Filter Architecture

Derived from canonical attributes.

Avoid channel-specific manual filter data.

---

# 134. Collection

Commercial grouping.

Can be:

```text id="cp069"
ORIGINALS COLLECTION
SELECTS EDIT
CREATOR DROP
CAMPAIGN
```

---

# 135. Collection vs Category

Canonical:

```text id="cp070"
CATEGORY
what product is.

COLLECTION
why products are grouped.
```

---

# 136. Creator Store

Future creator storefront can be:

```text id="cp071"
FILTERED / BRANDED CATALOG EXPERIENCE
```

on shared commerce engine.

---

# 137. Creator Product Attribution

Commerce must preserve:

```text id="cp072"
CREATOR
COLLAB
ROYALTY RULE
CAMPAIGN
```

for downstream earning calculation.

---

# 138. Creator Store Does Not Need Separate Order System

Canonical.

---

# 139. Originals Label Store

Same principle.

A label may receive separate frontend identity while using TeeStock commerce backend.

---

# 140. Multi-Brand Commerce

Future:

```text id="cp073"
ONE COMMERCE CORE
+
MULTIPLE BRAND EXPERIENCES
```

---

# 141. Brand Context

Order item should know:

```text id="cp074"
BRAND / LABEL CONTEXT
```

if needed for reporting/customer experience.

---

# 142. Marketplace Integration

External orders should normalize into TeeStock Order.

---

# 143. Marketplace Adapter

Canonical:

```text id="cp075"
MARKETPLACE ORDER
↓
CHANNEL ADAPTER
↓
TEEStock ORDER
```

---

# 144. External Order ID

Preserve:

```text id="cp076"
CHANNEL
EXTERNAL ORDER ID
TEEStock ORDER ID
```

---

# 145. External SKU Mapping

Marketplace listing SKU must map to canonical TeeStock SKU.

---

# 146. Product Listing Mapping

Canonical:

```text id="cp077"
TEEStock PRODUCT / SKU
↓
CHANNEL LISTING
↓
EXTERNAL LISTING ID
```

---

# 147. Channel Listing

Stores channel-specific:

```text id="cp078"
TITLE
CONTENT
PRICE CONTEXT
STATUS
EXTERNAL ID
```

while product master remains canonical.

---

# 148. Inventory Sync

Potential future:

```text id="cp079"
CANONICAL ATS
↓
CHANNEL ADAPTER
↓
CHANNEL STOCK
```

---

# 149. Inventory Sync Risk

Latency can create overselling.

Need buffers/rules where required.

---

# 150. Channel Inventory Buffer

Potential later for unstable integrations.

---

# 151. Price Sync

Channel price updates should derive from approved price context.

---

# 152. Channel Order Import

Must be idempotent.

---

# 153. Channel Cancellation

Should synchronize where platform allows.

---

# 154. Channel Returns

Normalize into TeeStock return process while preserving external platform requirements.

---

# 155. Channel Is Not Source of Core Product Truth

Canonical.

---

# 156. Manual Order Entry

MGBOS may create Commerce Orders manually for:

```text id="cp080"
OFFLINE SALE
RECOVERY
SPECIAL APPROVED CASE
```

with source recorded.

---

# 157. Manual Order Guardrail

Manual entry should not bypass:

```text id="cp081"
PRICE
PAYMENT
INVENTORY
AUDIT
```

controls.

---

# 158. Order Orchestration

Canonical:

> **Order Orchestration determines what downstream work must happen after an Order becomes eligible for execution.**

---

# 159. Orchestration Inputs

Potential:

```text id="cp082"
ORDER ITEM
AVAILABILITY MODE
INVENTORY
PRODUCTION ROUTE
FULFILLMENT ROUTE
```

---

# 160. Ready-Stock Order

```text id="cp083"
PAID
↓
ALLOCATE
↓
PICK / PACK
↓
SHIP
```

---

# 161. Made-to-Order Order

```text id="cp084"
PAID
↓
CREATE PRODUCTION JOB
↓
QC
↓
INVENTORY / OUTPUT
↓
FULFILL
```

---

# 162. Mixed Order

Potential:

```text id="cp085"
READY STOCK ITEM
+
MTO ITEM
```

requires policy:

```text id="cp086"
SHIP TOGETHER
or
SPLIT SHIPMENT
```

---

# 163. Mixed Fulfillment Policy

Must be explicit to avoid customer confusion.

---

# 164. Preorder Fulfillment

Wait until production release/output.

---

# 165. Digital/Non-Physical Products

Not current core.

If added later, use separate fulfillment type.

---

# 166. Order Eligibility

Typical:

```text id="cp087"
VALID
+
PAYMENT CONDITION SATISFIED
+
NO BLOCKING RISK
=
EXECUTION ELIGIBLE
```

---

# 167. Fraud/Risk Hold

Potential future:

```text id="cp088"
ORDER
→ HOLD
→ REVIEW
```

for unusual payment/risk signals.

---

# 168. Fulfillment Block

Potential causes:

```text id="cp089"
PAYMENT ISSUE
INVENTORY ISSUE
ADDRESS ISSUE
QUALITY HOLD
```

---

# 169. Exception Queue

Commerce/MGBOS should surface:

```text id="cp090"
PAYMENT FAILED
OVERSOLD
INVALID ADDRESS
FULFILLMENT DELAY
RETURN ISSUE
```

---

# 170. Normal Work vs Exception

Long-term:

```text id="cp091"
NORMAL ORDER
automated.

EXCEPTION ORDER
human-reviewed.
```

---

# 171. Order Notes

Structured reasons preferred over free-text where possible.

---

# 172. Audit Trail

Record material:

```text id="cp092"
PRICE OVERRIDE
ORDER EDIT
CANCELLATION
REFUND
STATUS CHANGE
```

---

# 173. Commerce Notifications

Potential:

```text id="cp093"
ORDER CONFIRMED
PAYMENT CONFIRMED
PROCESSING
SHIPPED
DELIVERED
REFUND
```

---

# 174. Notifications Should Be Event-Driven

Not manually triggered wherever possible.

---

# 175. Transactional Notification Is Not Marketing

Keep permission/context separate.

---

# 176. Customer Support Context

Support should see:

```text id="cp094"
ORDER
PAYMENT
SHIPMENT
RETURN
CASE
```

in one customer context.

---

# 177. Customer Service Should Not Need Marketplace Login for Every Order

Canonical normalization should reduce this over time.

---

# 178. Order Search

Operators should search by:

```text id="cp095"
ORDER NUMBER
CUSTOMER
EMAIL
PHONE
EXTERNAL ORDER ID
SKU
```

where permitted.

---

# 179. Order Timeline

Potential:

```text id="cp096"
CREATED
PAID
ALLOCATED
PRODUCTION
PACKED
SHIPPED
DELIVERED
RETURNED
```

---

# 180. Timeline Is Derived from Events

Avoid manually typing narrative history.

---

# 181. Commerce Analytics

Canonical views:

```text id="cp097"
SALES
ORDERS
AOV
CONVERSION
PRODUCT
CHANNEL
RETURN
CONTRIBUTION
```

---

# 182. Gross Sales vs Net Sales

Must remain distinct.

---

# 183. Order Count vs Item Count

Must remain distinct.

---

# 184. AOV

Canonical:

```text id="cp098"
NET ORDER SALES
/
ORDERS
```

with agreed definition.

---

# 185. Units per Order

Useful merchandising/fulfillment metric.

---

# 186. Product Performance

Potential:

```text id="cp099"
VIEWS
CARTS
UNITS SOLD
NET SALES
CONTRIBUTION
RETURN
```

---

# 187. Variant Performance

Important for size/color buying and inventory.

---

# 188. Sell-Through

Useful for stocked products.

---

# 189. Preorder Conversion

Potential:

```text id="cp100"
PURCHASE
/
QUALIFIED PRODUCT VISIT
```

depending analytical definition.

---

# 190. Commerce Funnel

Canonical:

```text id="cp101"
SESSION
↓
PRODUCT VIEW
↓
ADD TO CART
↓
CHECKOUT
↓
PAYMENT
↓
ORDER
```

---

# 191. Funnel Events

Need canonical Event Model later.

---

# 192. Funnel Drop-Off

Useful for identifying:

```text id="cp102"
PRODUCT
PRICE
UX
PAYMENT
SHIPPING
```

friction.

---

# 193. Checkout Conversion

Should be measured separately from overall website conversion.

---

# 194. Repeat Commerce

Track:

```text id="cp103"
NEW
vs
REPEAT
```

customer order share.

---

# 195. Returns Impact

Product performance must consider:

```text id="cp104"
SALES
-
RETURNS / REFUNDS
```

and contribution impact.

---

# 196. Marketplace Performance

Should compare:

```text id="cp105"
GMV
NET SALES
CHANNEL FEE
CONTRIBUTION
RETURN
```

---

# 197. Merchandising Analytics

Potential:

```text id="cp106"
PLACEMENT
IMPRESSION
CLICK
ADD TO CART
PURCHASE
```

---

# 198. Search Analytics

Can reveal product demand not currently supplied.

---

# 199. No-Result Demand

Potential input to:

```text id="cp107"
PRODUCT DEVELOPMENT
BUYING
CONTENT
```

---

# 200. Commerce Data Model

Core entities:

```text id="cp108"
PRODUCT
VARIANT
SKU
SELLABLE CONFIGURATION
CATALOG
CATALOG ENTRY
PRICE
PROMOTION
CART
CHECKOUT
ORDER
ORDER ITEM
PAYMENT
RESERVATION
FULFILLMENT
RETURN
CHANNEL LISTING
```

---

# 201. Additional Future Entities

Potential:

```text id="cp109"
WAITLIST
PREORDER CAMPAIGN
WISHLIST
RECOMMENDATION
```

---

# 202. Commerce Data Lineage

Canonical:

```text id="cp110"
PRODUCT
↓
CATALOG
↓
PRICE / AVAILABILITY
↓
CART
↓
CHECKOUT
↓
ORDER
↓
PAYMENT
↓
FULFILLMENT
↓
RETURN / REFUND
↓
FINANCIAL ECONOMICS
```

---

# 203. Commerce Events

Potential:

```text id="cp111"
product.published
price.changed
inventory.reserved
cart.created
checkout.started
order.created
payment.completed
order.cancelled
shipment.shipped
return.requested
refund.completed
```

---

# 204. Events Must Be Facts

Do not name events as commands.

---

# 205. MGBOS Commerce Dashboard

Potential:

```text id="cp112"
ORDERS TODAY
PENDING PAYMENT
PROCESSING
EXCEPTIONS
NET SALES
AOV
RETURN RATE
```

---

# 206. Operator Commerce Queue

Potential:

```text id="cp113"
PAYMENT ISSUE
ORDER HOLD
OVERSOLD
CUSTOMER CHANGE REQUEST
RETURN
```

---

# 207. Automation Opportunities

Strong candidates:

```text id="cp114"
PAYMENT CONFIRMATION
INVENTORY RESERVATION
ORDER ROUTING
NOTIFICATION
MARKETPLACE IMPORT
RETURN ELIGIBILITY
```

---

# 208. Catalog Automation

Potential:

```text id="cp115"
PUBLISH / UNPUBLISH
PRICE SYNC
INVENTORY SYNC
```

after governance.

---

# 209. Order Automation

Potential:

```text id="cp116"
PAID ORDER
→ RESERVE
→ CREATE FULFILLMENT / PRODUCTION
```

---

# 210. Return Automation

Can automate:

```text id="cp117"
ELIGIBILITY CHECK
LABEL / INSTRUCTION
STATUS UPDATE
```

while exceptions remain human.

---

# 211. AI Role

AI may assist with:

```text id="cp118"
SEARCH
MERCHANDISING RECOMMENDATION
PRODUCT DISCOVERY
SUPPORT SUMMARY
FRAUD / ANOMALY SIGNAL
```

---

# 212. AI Search

Future semantic search can interpret:

> kaos oversize hitam yang bahannya tebal

and map to real catalog attributes.

---

# 213. AI Merchandising

Can recommend:

```text id="cp119"
PRODUCT ORDER
RELATED PRODUCTS
COLLECTION GROUPING
```

but human/product rules remain authoritative.

---

# 214. AI Product Copy

May draft storefront content from canonical product truth.

Should not invent:

```text id="cp120"
MATERIAL
FIT
STOCK
PRICE
```

---

# 215. AI Customer Support

Can answer using real:

```text id="cp121"
ORDER
PAYMENT
SHIPMENT
RETURN
```

context.

---

# 216. AI Commerce Boundary

AI should not autonomously:

```text id="cp122"
CHANGE PRICE
ISSUE UNAUTHORIZED REFUND
CREATE FAKE STOCK
ALTER PAYMENT
OVERRIDE RETURN POLICY
```

---

# 217. Commerce Technical Architecture

Early recommendation:

```text id="cp123"
MODULAR COMMERCE APPLICATION
+
CLEAR DOMAIN BOUNDARIES
+
SHARED DATABASE / SERVICES AS APPROPRIATE
```

---

# 218. Avoid Premature Headless Complexity

Headless commerce may become useful.

It is not automatically required.

---

# 219. Headless Gate

Consider when:

```text id="cp124"
MULTIPLE FRONTENDS
+
CUSTOM EXPERIENCE
+
SHARED COMMERCE CORE
```

create enough value.

---

# 220. Platform vs Custom Build

Commodity components may be bought.

Differentiated business logic should remain TeeStock-controlled where strategic.

---

# 221. Commerce Provider Risk

Avoid placing critical custom business rules solely in provider-specific plugins.

---

# 222. Provider Adapter

Canonical direction:

```text id="cp125"
EXTERNAL COMMERCE CAPABILITY
↓
ADAPTER
↓
TEEStock CANONICAL LOGIC
```

where practical.

---

# 223. Reliability Requirements

Critical flows:

```text id="cp126"
CHECKOUT
PAYMENT
ORDER CREATION
INVENTORY RESERVATION
```

must have strong error handling.

---

# 224. No Lost Orders

Canonical.

If downstream automation fails:

order remains visible and recoverable.

---

# 225. Retry

External API failures should support controlled retry.

---

# 226. Dead-Letter / Exception Handling

Persistent failures should move to exception queue.

---

# 227. Observability

Track:

```text id="cp127"
ORDER FAILURE
PAYMENT FAILURE
SYNC FAILURE
INVENTORY MISMATCH
```

---

# 228. Security

Commerce needs:

```text id="cp128"
AUTH
PAYMENT SECURITY
ACCESS CONTROL
AUDIT
DATA PROTECTION
```

---

# 229. Payment Security

Do not store sensitive payment details unnecessarily.

---

# 230. PII

Customer data access should follow role need.

---

# 231. Admin Access

Commerce admin can create high financial impact.

Use strong privilege control.

---

# 232. Rate Limiting / Abuse Protection

Useful for:

```text id="cp129"
LOGIN
COUPON
CHECKOUT
API
```

as system matures.

---

# 233. Promotion Abuse

Monitor:

```text id="cp130"
MULTIPLE ACCOUNTS
SELF-REFERRAL
COUPON REUSE
```

where relevant.

---

# 234. Inventory Race Conditions

Transaction integrity matters during concurrent purchases.

---

# 235. Payment Race Conditions

One payment should create one commercial effect.

---

# 236. Commerce Maturity Model

```text id="cp131"
LEVEL 0
Manual storefront/order handling

LEVEL 1
Structured online commerce

LEVEL 2
Shared pricing + inventory + OMS

LEVEL 3
Multi-channel integrated commerce

LEVEL 4
Automated orchestration + advanced merchandising

LEVEL 5
AI-assisted multi-brand commerce engine
```

---

# 237. Level 0

Anti-goal:

```text id="cp132"
ORDER VIA CHAT
↓
COPY TO SPREADSHEET
↓
MANUAL STOCK GUESS
```

---

# 238. Level 1

Build:

```text id="cp133"
CATALOG
CART
CHECKOUT
PAYMENT
ORDER
BASIC INVENTORY
```

---

# 239. Level 2

Adds:

```text id="cp134"
PRICE BOOK
RESERVATION
ORDER MANAGEMENT
RETURNS
CUSTOMER ACCOUNT
```

---

# 240. Level 3

Adds:

```text id="cp135"
MARKETPLACE
CREATOR STORES
PREORDER
MTO ORCHESTRATION
CHANNEL SYNC
```

---

# 241. Level 4

Adds:

```text id="cp136"
RULE-BASED MERCHANDISING
CAPACITY-AWARE SELLING
AUTOMATED EXCEPTION ROUTING
```

---

# 242. Level 5

Adds:

```text id="cp137"
AI SEARCH
AI MERCHANDISING
MULTI-BRAND OPTIMIZATION
AGENT-ASSISTED OPERATIONS
```

---

# 243. Current Recommended Stage

TeeStock should target:

```text id="cp138"
LEVEL 1
→
LEVEL 2
```

first.

---

# 244. V1 Commerce Scope

Priority:

```text id="cp139"
PRODUCT
VARIANT
SKU
CATALOG
PRICE
INVENTORY ATS
CART
CHECKOUT
PAYMENT
ORDER
SHIPMENT STATUS
```

---

# 245. V1 Commerce Product Types

Support:

```text id="cp140"
READY STOCK
MADE TO ORDER
```

with clear lead-time rules.

Preorder can be simple controlled campaign.

---

# 246. V1 Pricing

Use:

```text id="cp141"
RETAIL PRICE BOOK
SIMPLE PROMOTION
COUPON
```

with margin governance outside/inside commerce as maturity allows.

---

# 247. V1 Inventory

Need:

```text id="cp142"
ON HAND
RESERVED
AVAILABLE
```

minimum truth.

---

# 248. V1 Order

Need:

```text id="cp143"
SOURCE
CUSTOMER
ITEM
PRICE
PAYMENT
STATUS
SHIPMENT
```

---

# 249. V1 Marketplace

Can remain partially manual if order volume is low.

But canonical external IDs/SKUs should already be planned.

---

# 250. V1 Returns

Customer request can be simple form/account action.

Internal returns system handles operations.

---

# 251. V1 Merchandising

Manual:

```text id="cp144"
FEATURED
NEW
COLLECTION
RELATED
```

---

# 252. V1 Avoid

Do not immediately build:

```text id="cp145"
REAL-TIME MULTI-MARKETPLACE SYNC
COMPLEX LOYALTY POINTS
FULL DYNAMIC PRICING
AI MERCHANDISING
ADVANCED PERSONALIZATION
MICROSERVICE COMMERCE MESH
```

---

# 253. V2 Expansion

Possible:

```text id="cp146"
CUSTOMER ACCOUNT
REORDER
RETURN SELF-SERVICE
MARKETPLACE SYNC
PREORDER ENGINE
```

---

# 254. V3 Expansion

Possible:

```text id="cp147"
CREATOR STORES
LABEL STORES
MTO ORCHESTRATION
PROMOTION ENGINE
ADVANCED SEARCH
```

---

# 255. V4 Expansion

Possible:

```text id="cp148"
CAPACITY-AWARE AVAILABILITY
AI SEARCH
BEHAVIORAL MERCHANDISING
MULTI-BRAND FRONTENDS
```

---

# 256. Product Publication Gate

Publish only when:

```text id="cp149"
PRODUCT APPROVED
+
PRICE ACTIVE
+
AVAILABILITY MODE DEFINED
+
CONTENT COMPLETE
```

---

# 257. Ready-Stock Sale Gate

```text id="cp150"
ACTIVE CATALOG
+
VALID PRICE
+
ATS > 0
```

---

# 258. MTO Sale Gate

```text id="cp151"
ACTIVE CATALOG
+
VALID PRICE
+
PRODUCTION ROUTE
+
LEAD TIME
```

---

# 259. Preorder Gate

```text id="cp152"
CAMPAIGN
+
DELIVERY WINDOW
+
COMMERCIAL TERMS
+
PRODUCTION PLAN
```

---

# 260. Checkout Gate

Before order commitment:

```text id="cp153"
PRICE VALID
+
AVAILABILITY VALID
+
CUSTOMER / DELIVERY VALID
+
PAYMENT METHOD VALID
```

---

# 261. Fulfillment Release Gate

```text id="cp154"
ORDER ELIGIBLE
+
PAYMENT CONDITION
+
NO BLOCK
```

---

# 262. Refund Gate

```text id="cp155"
APPROVED RESOLUTION
+
VALID PAYMENT
+
CORRECT AMOUNT
```

---

# 263. Channel Listing Gate

```text id="cp156"
CANONICAL SKU MAPPING
+
CHANNEL PRICE
+
CHANNEL CONTENT
+
INVENTORY RULE
```

---

# 264. Commerce Failure Modes

## Storefront Is Product Master

Data fragmentation.

## Price Hardcoded Everywhere

Commercial inconsistency.

## Raw Stock = Available Stock

Overselling.

## Cart = Reservation Forever

Inventory lock.

## Payment Callback = Payment Truth

Fraud/error risk.

## Marketplace Order Lives Only in Marketplace

Operational fragmentation.

## Creator Store Gets Separate Backend

Duplicated logic.

## Returns Detached from Orders

No economic lineage.

---

# 265. What Commerce Platform Must Not Become

## Plugin Maze

Business rules need clear ownership.

## Channel-Specific Databases

Canonical data first.

## Feature-Bloated Storefront

Customer simplicity matters.

## AI-Controlled Store

Core commercial rules remain deterministic.

## Premature Platform Engineering

Build for real demand.

---

# 266. Commerce Platform Success Definition

The platform succeeds when TeeStock can answer:

```text id="cp157"
WHAT PRODUCTS
can be sold?

WHERE
can they be sold?

AT WHAT PRICE?

HOW MUCH
can we safely promise?

WHAT DID
the customer buy?

HAS IT
been paid?

WHAT WORK
must happen next?

WHERE
is the order now?

WHAT WAS
returned or refunded?

WHAT CHANNEL
created the order?

WHAT CONTRIBUTION
did the transaction generate?

CAN THE SAME COMMERCE CORE
support future labels and creator stores?
```

---

# 267. Canonical Commerce Summary

```text id="cp158"
PRODUCT
defines what exists.

CATALOG
defines what is sellable.

PRICE
defines commercial terms.

AVAILABILITY
defines what can be promised.

CART
captures intent.

CHECKOUT
validates commitment.

PAYMENT
confirms collection.

ORDER
records the transaction.

ORCHESTRATION
creates downstream work.

FULFILLMENT
delivers the promise.

RETURN
handles reversal/recovery.

CHANNEL ADAPTERS
normalize external commerce.

MGBOS
controls the operating truth.
```

---

# 268. Canonical Commerce Principles

```text id="cp159"
ONE COMMERCE ENGINE. MANY STOREFRONT EXPERIENCES.

PRODUCT MASTER BEFORE CHANNEL LISTING.

CATALOG BEFORE SELLING.

PRICE BOOK BEFORE HARDCODED PRICE.

AVAILABLE-TO-SELL BEFORE PROMISE.

CART IS INTENT. ORDER IS COMMITMENT.

PAYMENT EVENT MUST BE VERIFIED.

ONE PAYMENT SHOULD CREATE ONE EFFECT.

HISTORICAL ORDERS MUST NOT CHANGE WITH CURRENT PRICE.

CHANNEL ORDERS MUST NORMALIZE INTO CANONICAL ORDERS.

CREATOR STORES SHOULD SHARE THE COMMERCE CORE.

RETURNS MUST LINK BACK TO ORIGINAL ECONOMICS.

AUTOMATE NORMAL ORDERS. SURFACE EXCEPTIONS.

AI MAY ASSIST DISCOVERY. DETERMINISTIC SYSTEMS CONTROL TRANSACTIONS.
```

---

# 269. Dependency

Dokumen berikut harus follow Commerce Platform:

1. [[bisnis/teestock/10-product-tech/creator-platform|creator-platform.md]]
2. [[bisnis/teestock/10-product-tech/partner-platform|partner-platform.md]]
3. [[bisnis/teestock/10-product-tech/automation-architecture|automation-architecture.md]]
4. [[bisnis/teestock/11-data-mgbos/canonical-data-model|canonical-data-model.md]]
5. [[bisnis/teestock/11-data-mgbos/entity-hierarchy|entity-hierarchy.md]]
6. [[bisnis/teestock/11-data-mgbos/sku-and-id-convention|sku-and-id-convention.md]]
7. [[bisnis/teestock/11-data-mgbos/event-model|event-model.md]]
8. [[bisnis/teestock/11-data-mgbos/mgbos-integration|mgbos-integration.md]]
9. [[bisnis/teestock/11-data-mgbos/analytics-model|analytics-model.md]]
10. [[bisnis/teestock/13-metrics-experiments/kpi-framework|kpi-framework.md]]
11. [[bisnis/teestock/14-roadmap/capability-roadmap|capability-roadmap.md]]

TeeStock Commerce Platform boleh berkembang menjadi multi-channel, creator-enabled, multi-label, inventory-aware, capacity-aware, dan AI-assisted commerce engine, tetapi complexity hanya boleh bertambah setelah canonical product, pricing, inventory, payment, order, returns, dan channel mappings sudah menjadi reliable transactional truth.