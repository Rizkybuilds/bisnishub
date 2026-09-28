---
title: "TeeStock Commerce Overview"
document_id: "TS-COM-001"
version: "1.0"
status: "CANONICAL"
category: "commerce"
business: "teestock"
last_updated: "2026-09-27"
depends_on:
  - "TS-FND-001"
  - "TS-FND-002"
  - "TS-STR-001"
  - "TS-STR-002"
  - "TS-STR-003"
  - "TS-STR-004"
  - "TS-BRD-001"
  - "TS-BRD-002"
  - "TS-BRD-003"
  - "TS-BRD-004"
---

# TeeStock Commerce Overview v1.0

> **Canonical Commerce Strategy Document**  
> Dokumen ini mendefinisikan bagaimana TeeStock Commerce bekerja sebagai consumer-facing retail engine, bagaimana Selects dan Essentials berhubungan dengan Originals, bagaimana assortment dikelola, bagaimana produk dijual melalui berbagai channel, serta bagaimana Commerce menghasilkan revenue sekaligus market intelligence bagi ecosystem TeeStock.

---

# 1. Purpose

TeeStock Commerce menjawab:

> **Apa yang bisa customer beli langsung dari TeeStock?**

Commerce adalah layer yang menghubungkan:

```text
PRODUCT
↓
MERCHANDISING
↓
STOREFRONT
↓
CUSTOMER
↓
TRANSACTION
↓
DATA
```

Commerce bertanggung jawab terhadap:

- product assortment,
- merchandising,
- pricing presentation,
- product discovery,
- checkout experience,
- retail conversion,
- retention,
- dan consumer transaction data.

---

# 2. Canonical Definition

> **TeeStock Commerce adalah consumer retail layer yang mengkurasi, menyajikan, dan menjual apparel serta consumer products melalui customer-facing channels TeeStock.**

Canonical structure:

```text
TEESTOCK COMMERCE
│
├── TeeStock Selects
│
└── TeeStock Essentials
```

TeeStock Originals bukan Commerce Line.

Originals adalah:

```text
OWNED IP DIVISION
```

yang menggunakan Commerce sebagai salah satu distribution engine.

---

# 3. Critical Architecture Distinction

Hubungan canonical:

```text
COMMERCE
= HOW PRODUCTS ARE SOLD

ORIGINALS
= WHO CREATES / OWNS THE IP
```

Karena itu sebuah product dapat berasal dari Originals tetapi tetap dijual melalui Commerce infrastructure.

Contoh:

```text
Do Your Best
↓
TeeStock Originals
↓
Product
↓
TeeStock Commerce
↓
Customer
```

---

# 4. Commerce Product Sources

Commerce dapat menjual produk dari beberapa sources:

```text
TEEStock SELECTS
Curated external / licensed / creator work

TEEStock ESSENTIALS
Consumer apparel fundamentals

TEEStock ORIGINALS
Internal owned IP

COLLABORATIONS
Jointly created products
```

Semua dapat menggunakan:

- storefront,
- checkout,
- payments,
- inventory,
- fulfillment

yang sama.

---

# 5. Commerce Strategic Roles

Commerce memiliki empat fungsi utama.

## 5.1 Revenue Engine

Menghasilkan revenue dari consumer transactions.

---

## 5.2 Demand Engine

Membawa customer masuk ke TeeStock ecosystem.

---

## 5.3 Market Intelligence Engine

Menghasilkan data mengenai:

- products,
- designs,
- niches,
- fit,
- colors,
- pricing,
- audience,
- repeat behavior.

---

## 5.4 Brand Experience Engine

Commerce adalah salah satu tempat utama customer membentuk persepsi terhadap TeeStock.

---

# 6. Commerce Philosophy

TeeStock Commerce tidak mengejar:

> katalog sebanyak mungkin.

TeeStock mengejar:

> **pilihan yang cukup luas untuk menemukan demand, tetapi cukup terkurasi untuk tetap memiliki taste.**

Canonical principle:

```text
BREADTH
without chaos

VARIETY
without randomness

CURATION
without elitism
```

---

# 7. Commerce Value Proposition

TeeStock Commerce memberikan customer:

```text
GOOD PRODUCT
+
RELEVANT CHOICE
+
CLEAR INFORMATION
+
EASY PURCHASE
+
RELIABLE FULFILLMENT
```

Customer tidak seharusnya harus memahami:

- supplier,
- decoration method,
- inventory logic,
- production routing

untuk membeli product yang tepat.

---

# 8. Commerce Architecture

```text
                        TEESTOCK COMMERCE

            ┌──────────────────┴──────────────────┐
            │                                     │
       TEEStock SELECTS                    TEEStock ESSENTIALS
            │                                     │
    Curated graphic apparel                Apparel fundamentals
            │                                     │
            └──────────────────┬──────────────────┘
                               │
                    SHARED COMMERCE ENGINE
                               │
                ┌──────────────┼──────────────┐
                │              │              │
             Catalog        Checkout      Customer
                │              │              │
             Order         Payment        Account
                │              │              │
                └──────────────┼──────────────┘
                               │
                         FULFILLMENT
                               │
                               ▼
                           CUSTOMER
```

Originals dan Collaborations masuk melalui shared Commerce engine tanpa menjadi Commerce Line baru.

---

# 9. TeeStock Selects Role

Canonical principle:

> **We curate it.**

Selects berfungsi untuk menyediakan:

- design diversity,
- niche coverage,
- visual discovery,
- rapid market testing.

Sources dapat berasal dari:

- licensed artwork,
- creator submissions,
- commissioned artwork,
- approved external work,
- selected collaborations.

---

# 10. Selects Strategic Role

Selects mempunyai dua fungsi.

## Consumer Function

Memberikan pilihan graphic apparel.

## Strategic Function

Menjadi:

> **market sensor.**

Signal yang dihasilkan dapat membantu menemukan:

- strong niche,
- strong message,
- strong aesthetic,
- strong audience.

---

# 11. TeeStock Essentials Role

Canonical principle:

> **We select the fundamentals.**

Essentials berfokus pada:

- fit,
- material,
- color,
- comfort,
- consistency,
- repeatability.

Examples:

```text
Essential Tee
Heavyweight Tee
Oversized Tee
Hoodie
Crewneck
```

---

# 12. Essentials Strategic Role

Essentials dapat menjadi:

```text
EVERGREEN REVENUE
+
PRODUCT QUALITY PROOF
+
BASE GARMENT PLATFORM
```

Satu base garment dapat digunakan oleh:

- Essentials,
- Selects,
- Custom,
- Originals,
- Merch.

Ini menciptakan operational leverage.

---

# 13. Originals in Commerce

Originals products dapat muncul di Commerce sebagai:

```text
Featured Collection
Label Store
Campaign Drop
Recommended Product
```

Tetapi internal classification tetap:

```text
Domain:
Originals
```

bukan:

```text
Commerce Line:
Originals
```

---

# 14. Collaboration in Commerce

Collaborations dapat dijual melalui TeeStock Commerce.

Display format dapat berupa:

```text
TeeStock × Creator
```

atau:

```text
Independent Label × Creator
```

Namun ownership dan revenue attribution harus mengikuti agreement.

---

# 15. Product Assortment Strategy

Assortment harus dikelola secara intentional.

Canonical assortment layers:

```text
CORE
SEASONAL
EXPERIMENTAL
CAMPAIGN
LIMITED
```

---

# 16. Core Assortment

Produk yang memiliki:

- repeat demand,
- reliable supply,
- stable economics.

Examples:

- core Essentials,
- proven Selects.

Core assortment memiliki availability lebih stabil.

---

# 17. Seasonal Assortment

Produk terkait:

- weather,
- calendar,
- cultural moment,
- event.

Tidak harus dipertahankan sepanjang tahun.

---

# 18. Experimental Assortment

Digunakan untuk menguji:

- design,
- fit,
- category,
- niche,
- price.

Inventory risk harus rendah.

---

# 19. Campaign Assortment

Products yang diangkat untuk campaign tertentu.

Campaign status tidak berarti product category baru.

---

# 20. Limited Assortment

Product benar-benar dibatasi berdasarkan:

- quantity,
- production window,
- release period.

Limited harus factual.

---

# 21. Assortment Depth

TeeStock harus menghindari terlalu banyak pilihan yang hanya berbeda sedikit.

Example:

Better:

```text
3 proven fits
4 core colors
clear use cases
```

daripada:

```text
12 similar fits
20 colors
weak demand per SKU
```

---

# 22. SKU Discipline

Setiap variant menambah operational complexity.

Canonical rule:

> **Every SKU must earn its complexity.**

SKU baru harus mempunyai alasan:

- demand,
- customer need,
- strategic test,
- assortment gap.

---

# 23. Variant Strategy

Typical variants:

```text
SIZE
COLOR
FIT
MATERIAL
DESIGN
```

Jangan menjadikan setiap possible combination sebagai stocked SKU secara otomatis.

---

# 24. Product Lifecycle

Canonical product lifecycle:

```text
CONCEPT
↓
TEST
↓
ACTIVE
↓
CORE / SEASONAL
↓
DECLINING
↓
SUNSET
↓
ARCHIVED
```

---

# 25. Product Activation Criteria

Sebelum product aktif:

- specification jelas,
- costing tersedia,
- product photos tersedia,
- variant structure jelas,
- stock/production method tersedia,
- fulfillment method jelas,
- IP classification jelas.

---

# 26. Product Sunset Criteria

Product dapat dihentikan jika:

```text
LOW DEMAND
LOW MARGIN
HIGH RETURN
HIGH COMPLEXITY
SUPPLY PROBLEM
STRATEGIC MISFIT
```

Sunset tidak sama dengan failure.

Assortment harus terus dibersihkan.

---

# 27. Merchandising Definition

Merchandising adalah keputusan mengenai:

> produk mana yang dilihat customer, kapan, dalam urutan apa, dan dalam context apa.

Merchandising bukan sekadar visual decoration.

---

# 28. Merchandising Goals

Merchandising harus membantu:

```text
DISCOVERY
UNDERSTANDING
COMPARISON
DECISION
```

---

# 29. Merchandising Hierarchy

Possible storefront hierarchy:

```text
NEW
BEST SELLING
ESSENTIALS
SELECTS
ORIGINALS
COLLABORATIONS
BY INTEREST
BY FIT
```

Tidak semuanya harus muncul bersamaan.

---

# 30. Best Seller Logic

"Best Seller" hanya digunakan berdasarkan real sales data.

Tidak boleh digunakan sebagai decorative badge.

---

# 31. New Product Logic

"New" memiliki expiry.

Product tidak boleh ditandai New selamanya.

---

# 32. Recommendation Logic

Recommendations dapat didasarkan pada:

```text
SIMILAR DESIGN
SIMILAR FIT
PURCHASE HISTORY
POPULARITY
COLLECTION
```

Early-stage recommendation dapat manual.

Automation datang setelah data cukup.

---

# 33. Catalog Taxonomy

High-level consumer taxonomy harus sederhana.

Possible:

```text
SHOP
├── T-Shirts
├── Hoodies
├── Essentials
├── Graphic Apparel
└── Originals
```

Backend taxonomy dapat lebih detail.

Customer-facing taxonomy tidak harus expose semua database classifications.

---

# 34. Product Discovery

Customer harus dapat menemukan product melalui kombinasi:

```text
CATEGORY
SEARCH
FILTER
MERCHANDISING
RECOMMENDATION
```

---

# 35. Search

Search idealnya dapat memahami:

- product type,
- design name,
- collection,
- niche,
- label.

Future semantic search dapat ditambahkan jika volume membenarkan.

---

# 36. Filter Strategy

Filter hanya digunakan jika membantu decision.

Possible filters:

```text
SIZE
COLOR
FIT
PRICE
CATEGORY
COLLECTION
AVAILABILITY
```

Avoid filter overload.

---

# 37. Product Page Objective

Product page harus menjawab:

```text
WHAT IS IT?
HOW DOES IT FIT?
WHAT IS IT MADE OF?
WHAT DOES IT COST?
WHEN WILL I GET IT?
WHAT IF SOMETHING GOES WRONG?
```

---

# 38. Product Page Information Architecture

Recommended:

```text
PRODUCT NAME
↓
PRICE
↓
PRIMARY VISUAL
↓
COLOR / SIZE
↓
CTA
↓
FIT & MATERIAL
↓
PRODUCT STORY
↓
DELIVERY
↓
CARE
↓
RETURNS
```

---

# 39. Product Photography Requirement

Minimum desirable:

```text
FRONT
BACK
DETAIL
FIT
```

For graphic products:

```text
PRINT DETAIL
```

should also be shown.

---

# 40. Fit Communication

Fit must not rely only on:

```text
S / M / L
```

Use:

- size chart,
- model reference where available,
- fit description.

Examples:

```text
REGULAR
RELAXED
OVERSIZED
```

---

# 41. Product Data Source

All product facts must come from canonical Product Data.

Commerce presentation may rephrase.

It may not invent:

- GSM,
- material,
- sizing,
- stock,
- rights,
- lead time.

---

# 42. Pricing Strategy

Commerce pricing should balance:

```text
CUSTOMER VALUE
+
MARKET ACCEPTANCE
+
CONTRIBUTION MARGIN
+
BRAND POSITIONING
```

Final pricing logic belongs in:

```text
08-finance/pricing-framework.md
```

---

# 43. Pricing Presentation

Retail price must be visible.

Avoid hiding basic prices behind chat unless product requires custom quotation.

---

# 44. Promotion Architecture

Promotions can operate at:

```text
PRODUCT
COLLECTION
CART
CUSTOMER SEGMENT
CHANNEL
```

Promotion must be separate from base pricing logic.

---

# 45. Promotion Types

Allowed examples:

```text
LAUNCH OFFER
BUNDLE
VOLUME
LOYALTY
SEASONAL
CLEARANCE
```

Permanent fake sale is not acceptable.

---

# 46. Bundle Strategy

Bundles should create real value.

Examples:

```text
2 Essentials
Creator Merch Bundle
Tee + Tote
```

Bundle economics must remain visible internally.

---

# 47. Commerce Inventory Philosophy

Canonical model:

```text
STANDARDIZED BASE INVENTORY
+
ON-DEMAND DECORATION
+
SELECTIVE FINISHED GOODS
```

Goal:

> minimize speculative inventory.

---

# 48. Inventory by Commerce Line

## Selects

Prefer:

- on-demand,
- low finished stock,
- small proven stock.

## Essentials

Can hold deeper inventory on proven:

- colors,
- sizes,
- fits.

## Originals

Initially:

- capsule,
- preorder,
- limited stock,
- on-demand where suitable.

---

# 49. Inventory Risk

Main risks:

```text
OVERSTOCK
STOCKOUT
SIZE IMBALANCE
SLOW MOVERS
SUPPLIER DELAY
```

Commerce data must feed replenishment decisions.

---

# 50. Availability Models

Product may be:

```text
READY STOCK
MADE TO ORDER
PREORDER
BACKORDER
OUT OF STOCK
```

Customer-facing status must be explicit.

---

# 51. Made-to-Order Role

Made-to-order is useful when:

- demand uncertain,
- decoration can be delayed until purchase,
- base inventory available.

Tradeoff:

- longer fulfillment time.

---

# 52. Ready Stock Role

Ready stock is useful when:

- demand predictable,
- product evergreen,
- delivery speed matters.

---

# 53. Preorder Role

Preorder should be used for:

- demand validation,
- special drop,
- production batch.

Preorder terms must clearly state estimated delivery window.

---

# 54. Channel Architecture

Commerce can operate across:

```text
OWNED STOREFRONT
MARKETPLACE
SOCIAL COMMERCE
CREATOR STOREFRONT
PHYSICAL EVENT
RESELLER
```

Channel is distribution surface.

Not business line.

---

# 55. Owned Storefront Role

`teestock.id` should become:

> **canonical digital home of TeeStock.**

Benefits:

- customer relationship,
- first-party data,
- full brand experience,
- lower platform dependency.

---

# 56. Marketplace Role

Marketplace can provide:

- demand,
- trust,
- payment convenience,
- logistics ecosystem.

Tradeoffs:

- fees,
- less brand control,
- platform dependency,
- limited customer ownership.

---

# 57. Social Commerce Role

Useful for:

- discovery,
- impulse purchase,
- creator distribution.

Commerce system should still attempt to maintain canonical order and product records.

---

# 58. Channel Selection Rule

A channel should exist if it provides:

```text
REACH
CONVERSION
CONVENIENCE
OR STRATEGIC VALUE
```

If channel only duplicates work:

> do not activate yet.

---

# 59. Channel Economics

Every channel should track:

```text
Revenue
Fees
Discount
CAC
Return Rate
Contribution
```

High revenue channel may still be economically weak.

---

# 60. Channel-Specific Assortment

Not every product must exist on every channel.

Possible:

```text
MARKETPLACE
Core / high-conversion products

TEEStock.ID
Full curated experience

CREATOR STORE
Creator-specific products

ORIGINALS DROP
Owned storefront priority
```

---

# 61. Checkout Philosophy

Checkout should minimize friction.

Required:

- clear cart,
- price,
- shipping,
- payment,
- contact details.

Avoid unnecessary registration requirement unless justified.

---

# 62. Customer Account

Account can provide:

- order history,
- tracking,
- saved address,
- wishlist,
- loyalty,
- creator/reseller roles later.

Account should create value.

Not become a barrier to purchase.

---

# 63. Cart Strategy

Cart should clarify:

```text
ITEM
VARIANT
QTY
PRICE
SHIPPING EXPECTATION
```

Upsell should be restrained.

---

# 64. Payment Strategy

Commerce should support payment methods appropriate to target customers.

Payment details are implementation decisions.

All successful payments must map to canonical Order.

---

# 65. Order Architecture

Commerce transaction:

```text
CUSTOMER
↓
CART
↓
CHECKOUT
↓
PAYMENT
↓
ORDER
↓
ORDER ITEM
↓
FULFILLMENT
```

---

# 66. Multi-Source Order

One cart may eventually contain:

```text
Selects
+
Essentials
+
Originals
```

Backend must preserve source classification per Order Item.

---

# 67. Order Routing

Products may require different fulfillment logic.

Example:

```text
ESSENTIAL
→ Pick & Pack

SELECT
→ Decorate → QC → Pack

ORIGINAL
→ Inventory / Production → QC → Pack
```

Customer experience should remain coherent.

---

# 68. Customer Journey

Canonical consumer journey:

```text
DISCOVER
↓
BROWSE
↓
EVALUATE
↓
BUY
↓
RECEIVE
↓
USE
↓
RETURN / REPEAT / REFER
```

Commerce responsibility continues after checkout.

---

# 69. Discovery

Potential sources:

- search,
- social,
- creator,
- marketplace,
- referral,
- direct.

---

# 70. Evaluation

Customer evaluates:

```text
DESIGN
FIT
PRICE
QUALITY
TRUST
DELIVERY
```

Commerce must reduce uncertainty on all six.

---

# 71. Post-Purchase

Post-purchase experience includes:

- confirmation,
- production status,
- tracking,
- care,
- support,
- review request.

This is part of Commerce.

---

# 72. Retention

Retention may come from:

```text
GOOD PRODUCT
+
RELIABLE EXPERIENCE
+
RELEVANT NEW PRODUCTS
+
CUSTOMER RELATIONSHIP
```

Not only discounts.

---

# 73. Loyalty Strategy

Early loyalty should focus on:

- recognition,
- early access,
- relevant recommendation,
- repeat customer benefits.

Do not build complex points system before meaningful repeat behavior exists.

---

# 74. Customer Segmentation

Useful segments can include:

```text
FIRST-TIME
REPEAT
HIGH VALUE
ESSENTIALS BUYER
GRAPHIC BUYER
ORIGINALS BUYER
CREATOR-REFERRED
```

Segments should support action.

---

# 75. Commerce Data Loop

```text
TRAFFIC
↓
PRODUCT VIEW
↓
ADD TO CART
↓
CHECKOUT
↓
PURCHASE
↓
FULFILLMENT
↓
REPEAT
```

Every step can generate useful data.

---

# 76. Core Commerce Events

Future event model should include:

```text
product.viewed
product.added_to_cart
checkout.started
payment.completed
order.created
order.fulfilled
order.delivered
order.returned
```

Detailed schema belongs in Event Model.

---

# 77. Commerce KPIs

Categories:

```text
TRAFFIC
CONVERSION
ORDER
PRODUCT
CUSTOMER
INVENTORY
MARGIN
RETENTION
```

Detailed thresholds belong in KPI framework.

---

# 78. Core Metrics

Examples:

```text
Conversion Rate
AOV
Units per Order
Contribution Margin
Sell-Through
Return Rate
Repeat Purchase Rate
Inventory Turn
```

---

# 79. Product-Level Metrics

Each product should eventually expose:

```text
Views
Conversion
Units Sold
Revenue
Contribution
Return
Inventory
```

---

# 80. Design-Level Metrics

For Selects/Originals:

```text
Design Views
Design Conversion
Design Units
Audience Source
Repeat Interest
```

This is critical for market intelligence.

---

# 81. Selects → Originals Intelligence Loop

Canonical loop:

```text
SELECTS
↓
DESIGN / NICHE DATA
↓
PATTERN
↓
ORIGINALS CONCEPT
↓
CAPSULE
↓
MARKET TEST
```

Selects is one of the research inputs.

It must not become the sole creative authority.

---

# 82. Commerce Insight Hierarchy

Not every sale signal deserves strategic action.

Useful hierarchy:

```text
SINGLE SALE
↓
REPEATED PRODUCT SIGNAL
↓
CATEGORY SIGNAL
↓
AUDIENCE PATTERN
↓
STRATEGIC INSIGHT
```

Avoid overreacting to one viral order.

---

# 83. Experimentation

Commerce experiments can test:

```text
PRODUCT
PRICE
MERCHANDISING
PHOTOGRAPHY
COPY
BUNDLE
CHANNEL
```

One major variable should ideally be identifiable.

---

# 84. Experiment Governance

Experiment must record:

- hypothesis,
- change,
- audience,
- duration,
- metric,
- result,
- decision.

---

# 85. Merchandising Experiments

Examples:

```text
Featured placement
Category ordering
Product badge
Recommendation
Homepage hero
```

Do not confuse merchandising result with product demand if placement changed dramatically.

---

# 86. Pricing Experiments

Pricing tests must respect:

```text
FLOOR PRICE
BRAND POSITIONING
CUSTOMER FAIRNESS
```

Do not create arbitrary inconsistent pricing for identical customers without policy.

---

# 87. Consumer Trust System

Commerce trust should be built through:

```text
REAL PHOTOS
CLEAR PRODUCT DATA
CLEAR REVIEWS
CLEAR DELIVERY
CLEAR RETURNS
VISIBLE SUPPORT
```

---

# 88. Reviews

Reviews can provide:

- social proof,
- fit feedback,
- quality signal.

Reviews must not be fabricated.

---

# 89. UGC

User-generated content can be reused with appropriate permission.

UGC is valuable because it shows:

- fit,
- context,
- authentic product experience.

---

# 90. Returns

Return data is not merely customer support data.

It is product intelligence.

Track reasons:

```text
SIZE
DEFECT
EXPECTATION GAP
WRONG ITEM
DAMAGED
OTHER
```

---

# 91. Commerce Quality Loop

```text
RETURN / COMPLAINT
↓
REASON
↓
PRODUCT / PROCESS ANALYSIS
↓
CORRECTIVE ACTION
↓
LOWER FUTURE FAILURE
```

---

# 92. Commerce and Brand

Commerce must not destroy master brand through:

- endless discounts,
- fake urgency,
- random products,
- poor product data.

Revenue tactics remain subordinate to brand strategy.

---

# 93. Commerce and Operations

Commerce promise must match actual operational capability.

Do not advertise:

```text
same-day delivery
```

if fulfillment cannot consistently deliver it.

---

# 94. Commerce and Finance

Commerce must provide finance with:

```text
Order Revenue
Discount
Tax if applicable
Channel Fee
Payment Fee
COGS
Refund
```

to calculate actual contribution.

---

# 95. Commerce and MGBOS

MGBOS should eventually provide unified view of:

```text
PRODUCT
CHANNEL
CUSTOMER
ORDER
INVENTORY
PAYMENT
FULFILLMENT
RETURN
```

Commerce frontend is not the final operational source of truth.

---

# 96. Commerce and AI

Potential future uses:

```text
Product Recommendation
Merchandising Suggestion
Demand Forecast
Copy Assistance
Support Triage
Inventory Alert
Customer Segmentation
```

AI must operate on structured product/customer data.

---

# 97. AI Recommendation Boundary

AI may suggest:

```text
"Feature Product X"
```

based on data.

AI should not autonomously:

- invent discounts,
- change product truth,
- publish unsupported claims,
- override stock truth.

---

# 98. Marketplace Data

Marketplace sales should flow back into TeeStock analytics where possible.

Avoid treating marketplace as separate business universe.

---

# 99. Commerce Operating Rhythm

Recommended review cadence later:

```text
DAILY
Orders / inventory issues

WEEKLY
Sales / conversion / product performance

MONTHLY
Assortment / margin / retention

QUARTERLY
Category strategy / portfolio decisions
```

Exact operating cadence can evolve.

---

# 100. Product Portfolio Review

Each product can be classified:

```text
HERO
CORE
GROWTH
TEST
DECLINING
SUNSET
```

---

# 101. Hero Product

A product used to attract attention or represent brand.

Hero does not necessarily equal highest-margin product.

---

# 102. Core Product

Reliable product with consistent demand.

---

# 103. Growth Product

Promising product receiving additional distribution/support.

---

# 104. Test Product

Still under validation.

---

# 105. Declining Product

Demand weakening or economics deteriorating.

---

# 106. Sunset Product

Scheduled for removal.

---

# 107. Commerce Expansion Rule

New product category only added if:

```text
CUSTOMER NEED
+
STRATEGIC FIT
+
SUPPLY CAPABILITY
+
ECONOMIC LOGIC
```

exist.

---

# 108. Category Expansion Sequence

Prefer adjacency:

```text
TEE
↓
HOODIE
↓
CREWNECK
↓
TOTE
↓
OTHER APPAREL / MERCH
```

Actual sequence follows data.

---

# 109. Commerce Activation Model

Not every Commerce capability should launch immediately.

Early:

```text
Storefront
Catalog
Product Page
Cart
Checkout
Basic Tracking
```

Later:

```text
Advanced Recommendation
Loyalty
Personalization
Subscription
Complex Bundles
```

---

# 110. Current Recommended Commerce Scope

Current priority:

```text
TEEStock SELECTS
+
TEEStock ESSENTIALS
```

with:

- limited assortment,
- clear product data,
- standardized base garment,
- reliable checkout,
- order tracking,
- basic analytics.

Originals can enter as controlled experiments.

---

# 111. What Commerce Should Not Become

TeeStock Commerce is not:

## Open Marketplace

Anyone cannot upload arbitrary product.

## Infinite Catalog

Volume of options is not the goal.

## Discount Store

Price promotion is not identity.

## Fashion Label

Commerce is the retail engine, not one cultural brand.

---

# 112. Commerce Success Definition

Commerce is working when:

```text
PEOPLE FIND
↓
PEOPLE UNDERSTAND
↓
PEOPLE BUY
↓
TEEStock DELIVERS
↓
PEOPLE RETURN
```

with healthy economics.

---

# 113. Canonical Commerce Summary

```text
TEEStock COMMERCE
= consumer retail engine

SELECTS
= curated graphic apparel

ESSENTIALS
= apparel fundamentals

ORIGINALS
= owned IP distributed through Commerce

COLLABORATIONS
= jointly created products distributed through Commerce
```

---

# 114. Canonical Operating Model

```text
SOURCE
↓
PRODUCT
↓
CATALOG
↓
MERCHANDISE
↓
SELL
↓
FULFILL
↓
MEASURE
↓
LEARN
↓
IMPROVE
```

---

# 115. Canonical Commerce Principles

```text
CURATION BEFORE CATALOG SIZE.

PRODUCT TRUTH BEFORE MARKETING.

BASE INVENTORY BEFORE SPECULATIVE STOCK.

CLEAR INFORMATION BEFORE PERSUASION.

CONTRIBUTION BEFORE REVENUE VANITY.

CUSTOMER DATA BEFORE ASSUMPTION.

LEARNING BEFORE SCALE.
```

---

# 116. Dependency

Dokumen berikut harus mengikuti Commerce Overview:

1. `03-commerce/teestock-selects.md`
2. `03-commerce/teestock-essentials.md`
3. `03-commerce/catalog-merchandising-system.md`
4. `03-commerce/product-taxonomy.md`
5. `07-operations/inventory-system.md`
6. `07-operations/order-fulfillment.md`
7. `08-finance/pricing-framework.md`
8. `09-marketing/channel-strategy.md`
9. `10-product-tech/commerce-platform.md`
10. `11-data-mgbos/canonical-data-model.md`
11. `13-metrics-experiments/kpi-framework.md`

Commerce implementation boleh berubah, tetapi distinction antara Commerce, Selects, Essentials, Originals, dan Collaborations harus tetap mengikuti dokumen canonical ini.