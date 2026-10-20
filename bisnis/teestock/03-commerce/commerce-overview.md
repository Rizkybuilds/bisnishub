---
title: "TeeStock Commerce Overview"
date: "2026-09-27"
bisnis: teestock
kategori: operasional
status: active
tags:
  - bisnis/teestock
  - kategori/operasional
  - teestock/canonical
  - teestock/commerce
document_id: "TS-COM-001"
canonical_id: teestock.commerce.commerce-overview
schema_version: "1.0"
document_class: canonical-commerce-strategy
owner: "Rizky / Founder"
author: "ChatGPT / AI Co-Founder — Commerce Strategy & Operational Boundaries"
approver: "Rizky / Founder (curated-design-first business direction)"
scope: teestock-consumer-commerce-role-primary-lines-governed-activation
primary_business_positioning: CURATED_DESIGN_APPAREL
primary_commercial_line: TEESTOCK_SELECTS
supporting_commerce_line: TEESTOCK_ESSENTIALS
originals_commerce_relation: SEPARATE_OWNED_IP_DISTRIBUTED_VIA_COMMERCE
services_visibility: SECONDARY_CONDITIONAL
four_domain_architecture: RETAINED
checkout_activation: NOT_AUTHORIZED_BY_THIS_DOCUMENT
payment_activation: NOT_AUTHORIZED_BY_THIS_DOCUMENT
production_readiness_claim: NONE
implementation_authorization: NONE
reconciles_decisions:
  - DEC-TS-2026-009
  - DEC-TS-2026-011
  - DEC-TS-2026-012
source_control:
  repository: Rizkybuilds/bisnishub
  pull_request: 85
  inspected_head: fc6dc00444ab92d56e2f82dcf1c80e05fb3b3c9e
  source_blob_sha: deca5a63247719cfb8ddaddd2e9363693a404ddc
  source_version: "1.0"
  inspected_on: "2026-10-20"
supersedes: "TS-COM-001@1.0"
version: "2.0"
category: "commerce"
business: "teestock"
last_updated: "2026-10-20"
path: "03-commerce/commerce-overview.md"
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


# TeeStock Commerce Overview v2.0

> [!abstract] **Canonical Commerce Strategy Document  **
> Dokumen ini mendefinisikan bagaimana TeeStock Commerce bekerja sebagai consumer-facing retail engine, bagaimana Selects dan Essentials berhubungan dengan Originals, bagaimana assortment dikelola, bagaimana produk dijual melalui berbagai channel, serta bagaimana Commerce menghasilkan revenue sekaligus market intelligence bagi ecosystem TeeStock.
>
> [!info] **Dependencies & Data Flow (SSOT)**
> [[bisnis/teestock/00-foundation/teestock-master-definition|TS-FND-001: TeeStock Master Definition]] • [[bisnis/teestock/00-foundation/glossary|TS-FND-002: TeeStock Glossary]] • [[bisnis/teestock/01-strategy/business-thesis|TS-STR-001: TeeStock Business Thesis]] • [[bisnis/teestock/01-strategy/business-model|TS-STR-002: TeeStock Business Model]] • [[bisnis/teestock/01-strategy/ecosystem-architecture|TS-STR-003: TeeStock Ecosystem Architecture]] • [[bisnis/teestock/01-strategy/growth-strategy|TS-STR-004: TeeStock Growth Strategy]] • [[bisnis/teestock/02-brand/master-brand-strategy|TS-BRD-001: TeeStock Master Brand Strategy]] • [[bisnis/teestock/02-brand/brand-architecture|TS-BRD-002: TeeStock Brand Architecture]] • [[bisnis/teestock/02-brand/brand-identity-system|TS-BRD-003: TeeStock Brand Identity System]] • [[bisnis/teestock/02-brand/voice-and-copy-system|TS-BRD-004: TeeStock Voice & Copy System]]


---

# 1. Purpose

> [!important] **Owner direction / DEC-TS-2026-012 — consumer Commerce is the PRIMARY TeeStock commercial promise.** The first job is to help consumers discover a deliberately small, well-curated selection of design-led apparel, understand verified product truth, and find the next honest action. TeeStock Selects is the hero line; Essentials supports garment fundamentals. Originals remains separately owned-IP governance, and Services remains secondary. A Commerce blueprint does not prove the ability to take paid orders. The old simplified PRODUCT → TRANSACTION pipeline below is a target architecture only.

**Authority boundary:** This document owns Commerce *business strategy and relationship between lines*, not IP clearance, MGBOS aggregates, payment commands, public-route implementation, inventory accuracy, production/QC approvals, refund policy, legal conclusions or activation of real checkout. Read TS-FND-001, TS-FND-004 / DEC-TS-2026-012, TS-BRD-001/002, TS-COM-002 v2.0 and TS-TEC-002 v2.0 together.


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

**Current ranking:** Selects drives differentiated demand and visual brand selection; Essentials is supporting; Originals creates/owns distinct IP but distributes eligible goods via Commerce; creator collaboration is a rights-governed sourcing relationship, not an automatic new Commerce line. Commerce may initially operate as a valid *non-transactional discovery* experience while retail payment, production, fulfillment and financial gates remain closed.


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

**Activation qualifier:** sharing a future storefront, catalog, checkout and operational engine is a desired architecture, not evidence these functions currently exist. Each product source must separately clear artwork and label rights, sample/QC, pricing, stock/supplier, publication and real-transaction gates before sale. Do not equate an Originals or creator concept with an approved sellable SKU.


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

**Decision priority:** historical four roles remain valid, but CURRENT market-facing emphasis is (1) collection desirability and product trust, (2) qualified/rights-cleared feasible offers, (3) repeatable customer outcomes and contribution-positive real sales *when authorized*, (4) learning and optional Originals hypotheses. Storefront metrics without real paid orders cannot be called revenue.


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

**Release stage qualification:** the historical value proposition below is a target for a fully released transaction service. Before readiness, replace "easy purchase" with truthful product/collection discovery plus plainly labeled interest-only options, where permitted. Never promise reliable fulfillment from mockups, projected supplier lead times or CI status alone.


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

**Conceptual diagram only:** the Checkout, Payment, Order and Fulfillment labels below express FUTURE shared capabilities, not a currently deployed retail integration. The domain owner for payment and financial invariants is MGBOS; commerce storytelling cannot alter those invariants.


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

**Primary commercialization guard:** TeeStock Selects is the **leading customer proposition**—curated licensed/commissioned/creator/owned designs on verified apparel. It is not merely a market-sensor side channel feeding Originals; the quality of the purchased or evaluated Selects product is its own consumer value. Rights must be use-specific and evidenced by TS-LEG-001.


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

**Role precedence:** consumer satisfaction, coherent collections, lawful use and viable economics are launch priorities. Learning for Originals is downstream and cannot authorize copying, transfer third-party copyright, or automatically promote licensed artwork into owned IP.


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

**Supporting merchandising:** Essentials gives product/garment fundamentals only when a real relevant assortment has verified specifications. It should not dilute curated graphic apparel brand recognition or compete for equal homepage hero space by default.


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

**Separate IP ownership:** Originals is a distinct rights and label-incubation lane. A product being displayed via Commerce does not automatically reclassify it as Selects or grant TeeStock any rights over third-party artwork.


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

**Founder-capacity rule:** start with coherent curated themes, a small manageable set of approved physical garment/color/size combinations and measured customer understanding; avoid a vast virtual assortment that looks orderable without inventory, capacity and price evidence. No illustrative count in this document is a binding launch quota.


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

**Lifecycle distinction:** historical CONCEPT → ACTIVE represents merchandising lifecycle, not a unified technical/order state machine. Separate editorial approval, use-specific rights, physical sample/QC evidence, public publication eligibility and real transaction authorization. A concept listing must not appear in stock or accept payment.


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

**Product activation fail-safe:** the legacy activation checklist is NECESSARY BUT NOT SUFFICIENT for real selling. Independently verify the artwork license/attribution, samples and production QA, actual supplier capacity, unit economics and royalty terms, truthful pricing/availability, tax/returns/customer support plus governed checkout/order/payment/fulfillment. Owner or approved domain authority must record acceptance; absent evidence = NOT_AUTHORIZED.


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

**Current merchandising ranking:** approved curated Selects collection/design relevance FIRST, clear product facts and garment quality SECOND; Essentials, Originals and other lines only when their actual assortment, rights and offers are approved. The legacy grouping below is a taxonomy, not equal homepage/nav prominence.


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

**Trust standard:** PDPs need verifiable garment fit/material, artwork attribution where required, sample-vs-mockup clarity, price and fulfillment statements that match actual operational evidence, and accessible next actions. Product-page readiness does not grant checkout permission.


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

**Pricing ownership:** brand/display price ideas are proposals until the finance/pricing authority approves royalties, blank/product cost, production/QC losses, platform fees, taxes, packaging, delivery, returns and contribution assumptions. Never advertise a sample price as binding or infer profitability from revenue.


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

**Inventory distinction:** source garment stock, finished goods stock, production capacity and theoretical design × variant combinations are separate truths. Virtual catalog breadth does not create physical availability; do not publish made-to-order or preorder delivery promises without verified supplier operational conditions.


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

**Channel activation requires independent permission:** owned-site preview, marketplace listing and creator-channel commerce are distinct operational/legal states. No channel may start accepting orders from a strategy document or a demo UI. Check IP/channel rights, fulfillment, customer support, fees, returns and platform terms before activation.


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

**Conditional checkout:** these checkout requirements apply only *after* separate acceptance of MGBOS order/payment/security, reconciliations, fulfillment, return handling and business readiness. The first public phase may have collections, product details or consent-based non-transactional interest, but no buy/cart/payment route if unauthorized. Mock shopping interactions must be explicitly simulated.


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

**Money and authorization:** a payment-method paragraph does not authorize merchant credentials or live payments. MGBOS and the approved financial command contract govern payment status, idempotency, authorization boundaries, uniqueness and reconciliation. A failed/uncertain payment must not be represented as successful.


Commerce should support payment methods appropriate to target customers.

Payment details are implementation decisions.

All successful payments must map to canonical Order.

---

# 65. Order Architecture

**Target-only transaction flow:** the legacy order architecture below is a conceptual idealized sequence, NOT proof that checkout/payment creates a governed Order today. Never create an order, reserve inventory or promise shipping by treating a frontend event as authoritative.


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

**Stage-specific customer journey:** for a site before transaction readiness, DISCOVER → COMPARE → PRODUCT INFO → clearly labeled NON-TRANSACTIONAL INTEREST (optional, consent-based) is the honest user journey. BUY → RECEIVE → REPEAT is conditional on real approved commerce operations; transactional customer journeys require distinct end-to-end acceptance evidence.


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

**Two different data loops:** prelaunch `collection.view → design.view → product.view → opted-in interest` measures awareness/intent only; authorized `product → cart → payment → order → fulfillment → return/repeat` measures actual sales outcomes. Never convert synthetic metrics or interest lists into conversion revenue, paid-order counts or reconciled contribution margin.


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

**Measurement ladder:** RESEARCH ≠ ATTENTION ≠ INTENT ≠ TRANSACTION ≠ POST-SALE OUTCOME. Business KPIs are only valid when events are real, privacy-compliant, properly deduplicated and attributed to the correct source. No pre-launch views imply tested willingness to pay; no gross merchandise value by itself implies margin.


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

**IP non-transfer rule:** Selects performance can inspire a *separate* Originals research direction but cannot authorize creating near-identical licensed work, promote a creator's design to owned-IP status, or bypass label-governance validation.


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

**Experiment guard:** prototype fixtures and A/B tests are not actual purchases; interest-capture consent and user privacy must be protected. Do not mislead participants with fake checkout confirmations, stock or shipping estimates.


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

**Shared systems boundary:** Commerce supplies needs and publication logic, while MGBOS owns organizations, identity, financial/order/production/fulfillment domains and their authorization. A new brand-commerce strategy does not permit new tables or schema migrations; request implementation via approved contracts.


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

**AI delegation with human control:** AI may propose curated collections, review artwork duplicates for escalation, draft factual product copy, segment behavior and summarize reliable experiment evidence. It may not grant rights, set binding prices, falsify samples, commit supplier capacity, authorize checkout, publish products, refund customers or modify financial invariants absent explicit approved governed delegation.


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

**Growth gate:** prove rights, product quality, demand, unit contribution, supplier throughput and support capacity before expanding styles, channels or SKUs. Scale the smallest repeatable customer promise rather than rapidly increasing feature count or theoretical catalog volume.


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

**CURRENT FIRST-STAGE OVERRIDE (DEC-TS-2026-012):** the "Early: Storefront / Catalog / Product Page / Cart / Checkout / Basic Tracking" sequence below is a *legacy target capability list*, not current V1 authorization. Stage A is legally approved curated design/collection discovery, accurate product details, easy access to size/quality/support, and optionally clearly non-transactional interest capture. Stage B may enable cart/checkout/tracking only after independent MGBOS, IP, supplier, financial, returns, and customer-support release gates pass. Documenting a page does not activate it.


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

**RECONCILED PRIMARY SCOPE — retail curated-design-first:** TeeStock Selects leads first-screen merchandising, collection discovery, and buyer promise. Essentials supports validated garment fundamentals, and Originals/Collaborations are gated and selectively introduced. The legacy "Selects + Essentials + reliable checkout" block below represents an eventual target; it MUST NOT be used to claim checkout, vendor capacity, live retail inventory or tracking exist. Q4 Business/Custom remains a bounded MGBOS operating-spine verification pilot, not TeeStock's primary brand identity.


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

**Proof-driven success:** first measure recognizable curated taste, understandable collections, rights-safe product facts and genuine interest. After approved live transactions exist, measure purchases, contribution, repeat purchase, return handling and reconciled fulfillment. The historical sequence below is conditional on commercial launch, not a verified present-state result.


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

**Current emphasis:** TeeStock Commerce is consumer-facing curated-design apparel distribution, with Selects as primary value proposition; this modifies priority, not the defined relationship between Selects, Essentials, Originals, Collaborations, and the four TeeStock business domains.


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

**Operating-spine boundary:** SOURCE → SELL → FULFILL is a value-chain target; do not map its labels onto live MGBOS events, migration names or status transitions without a separate reviewed engineering work package. The 2026 Q4 Business/Custom operational proof remains scoped in the owning roadmap.


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

1. [[bisnis/teestock/03-commerce/teestock-selects|teestock-selects.md]]
2. [[bisnis/teestock/03-commerce/teestock-essentials|teestock-essentials.md]]
3. [[bisnis/teestock/03-commerce/catalog-merchandising-system|catalog-merchandising-system.md]]
4. [[bisnis/teestock/03-commerce/product-taxonomy|product-taxonomy.md]]
5. [[bisnis/teestock/07-operations/inventory-system|inventory-system.md]]
6. [[bisnis/teestock/07-operations/order-fulfillment|order-fulfillment.md]]
7. [[bisnis/teestock/08-finance/pricing-framework|pricing-framework.md]]
8. [[bisnis/teestock/09-marketing/channel-strategy|channel-strategy.md]]
9. [[bisnis/teestock/10-product-tech/commerce-platform|commerce-platform.md]]
10. [[bisnis/teestock/11-data-mgbos/canonical-data-model|canonical-data-model.md]]
11. [[bisnis/teestock/13-metrics-experiments/kpi-framework|kpi-framework.md]]

Commerce implementation boleh berubah, tetapi distinction antara Commerce, Selects, Essentials, Originals, dan Collaborations harus tetap mengikuti dokumen canonical ini.
---

# 117. Current Commerce Positioning & Assortment Priority — DEC-TS-2026-012

**Normative business scope:** TeeStock Commerce exists to create a desirable, accessible, trusted customer experience for curated-design apparel. The customer recognizes the brand through clear taste, a small coherent choice, verifiable garment standards and truthful next actions. The business is **not** initially framed as a general printing service catalog. This section resolves strategic Commerce emphasis without rewriting product taxonomy, contracts, finance or MGBOS schemas.

| Portfolio unit | Current role | External emphasis | Scope constraint |
|---|---|---|---|
| TeeStock master brand | Consumer trust, experience and quality | Prominent | One master brand, not new labels for every niche |
| TeeStock Selects | **Primary** curated-design apparel proposition | Hero discovery, curated edits, product understanding | Source/use-specific license + sample, fit, quality and eligible offer checks |
| TeeStock Essentials | Supporting garment and product fundamentals | Contextual, only with validated assortment | Not a coequal alternate identity or guaranteed stocked product |
| TeeStock Originals | Distinct internally owned-IP creation/label incubation | Conditional and separately approved | Licensed Selects artwork is NOT automatically owned IP |
| Creator collaborations | Rights-governed content/product sourcing | Contextual attribution and co-branded releases | Contract governs ownership, royalty, territory, modification and channel use |
| TeeStock Services | Valid secondary business-line routes | Deemphasized in initial retail storefront | Service readiness separately controlled |
| MultiGraph | Parallel printing solutions business | Separate brand proposition | Shared production/vendor resources never imply legal/brand merger |

**Customer promise order:** discover design/collection → see real product context/rights-safe story → verify fit, materials, quality and availability claims → take *eligible* next action. When real checkout is disabled, that action is navigation or voluntary interest capture, not fake purchase. Collection labels, niche tags and SKU/product families are different concepts and must be explained through their canonical owners.

## 117.1 Small-catalog and solo-founder operating envelope

Start with deliberately few approved design/garment combinations: controlled experimental capacity, one founder's actual ability to inspect rights records, physical samples, suppliers, support tickets and financial assumptions. No fixed number of items is prescribed here; determine experiment sizes in the owned roadmap/operational plan. A high-quality curated catalog is more valuable than a visually impressive but unauditable design dump.

A design can be aesthetically approved but not publicly publishable, publicly informational but not sellable, sellable but not in physical stock, or sold but not fulfilled. These states cannot be conflated.

# 118. Stage-Gated Commerce Readiness & Evidence Contract

The following table is **strategic acceptance logic, not a new MGBOS state machine, table schema or executive authorization**.

| Gate | Minimal evidence | Responsible authority | Outcome of missing evidence |
|---|---|---|---|
| C-01 Artwork/source | Actual origin, rights holder, provenance, source/creator identity | TS-LEG-001 / underlying agreement | NO commercial publication |
| C-02 Rights for intended use | Print/resale, channels, countries, term, quantities, modifications, attribution, revocation | TS-LEG-001 / rights reviewer | NO commercial publication or manufacturing |
| C-03 Collection/editorial fit | Clear audience hypothesis, curated thesis, quality bar, non-copycat review | TS-COM-002, TS-COM-004 / Founder | Rework or reject candidate |
| C-04 Garment/physical production | Real blank garment specification, approved sample/QC, supplier lead time, production method | Operations, Vendor, QC | NO physical-quality or shipping claim |
| C-05 Unit economics | Rights/royalty, blanks, printing, packaging, fees, failures, returns, taxes, delivery, contribution hypothesis | Pricing/finance authority | NO final sale price/margin approval |
| C-06 Truthful publishing | Rights-safe image/copy, real/illustrative price distinction, policy/contact, availability status | Commerce/CX + Owner | Information only or unpublished |
| C-07 Retail order/payment authorization | Identity/org isolation, governed order/payment commands, idempotency/reconciliation, capacity, support, refunds | MGBOS operational/financial owner + explicit Owner approval | **NO cart/checkout/payment/order creation** |
| C-08 Fulfillment/outcome evidence | Committed order, QC, shipping, actual fees/returns/cost reconciliation | Production/QC/fulfillment/finance | No verified fulfilled sale or contribution claim |

## 118.1 Honest release modes

```text
MODE 0 — INTERNAL DESIGN EXPLORATION
  Never publish unverified ownership/rights/commercial claims.
MODE 1 — PUBLIC INFORMATION / CURATED DISCOVERY (IF APPROVED)
  Collections, rights-cleared imagery, factual product status and policies; no buy button.
MODE 2 — EXPLICIT NON-TRANSACTIONAL INTEREST (IF APPROVED)
  Opt-in contact/waitlist with clear privacy and no payment or stock reservation.
MODE 3 — GATED LIVE COMMERCE (SEPARATE AUTHORIZATION)
  Verified product, price, inventory/capacity, payments, order, QC, returns and fulfillment.
```

Publication approval is not payment activation; an attractive storefront is not proof of operational readiness. No customer-facing feature should simulate completed orders without a visible test/sandbox label. Existing Business/Custom operating-spine tests are distinct evidence and cannot substitute for first paid curated-apparel customer demand.

## 118.2 Measurements and falsifiability

| Evidence class | Examples | Valid conclusion | Invalid conclusion |
|---|---|---|---|
| RESEARCH | customer interview, price/size comprehension test | hypothesis worth testing | profitable SKU |
| ATTENTION | real approved content views, design saves | interest in creative concept | ability/willingness to pay |
| INTENT | voluntary opt-in with proper consent | potential demand priority | completed sale |
| TRANSACTION | real approved paid order with confirmed finance | paid demand under those conditions | delivered product |
| POST-SALE | QC/dispatch, returns, support, reconciled fees/cost | quality and unit-economics learning | profitability without full reconciliation |

Do not invent baselines, sample success stories, conversion-rate data, consumer feedback, partner capacity or supplier certification. Tests must disclose sample size, time window, audience/channel, counterfactual limits and meaningful adverse signals.

# 119. Authority, AI Decision Rights & Cross-Source Reconciliation

```yaml
commerce_overview_curated_first:
  document_id: TS-COM-001
  version: "2.0"
  owner_decision: DEC-TS-2026-012
  primary_positioning: CURATED_DESIGN_APPAREL
  primary_line: TEESTOCK_SELECTS
  secondary_line: TEESTOCK_ESSENTIALS
  owned_ip: SEPARATE_TEESTOCK_ORIGINALS
  services_priority: SECONDARY_CONDITIONAL
  brand_domain_count: FOUR_RETAINED
  owner_routing: FOUNDER_OR_APPROVED_DELEGATE
  documentation_not_runtime: true
  real_retail_checkout: NOT_AUTHORIZED_BY_THIS_DOCUMENT
  real_payment: NOT_AUTHORIZED_BY_THIS_DOCUMENT
  production_readiness: NOT_VERIFIED_BY_THIS_DOCUMENT
  deployment_authorization: NONE
  schema_migration_authorization: NONE
  AI_MAY:
    - DRAFT_COLLECTIONS_AND_CURATION_HYPOTHESES
    - SUMMARIZE_TRUE_PRODUCT_AND_CUSTOMER_DATA
    - PROPOSE_SOURCING_WITH_RISK_FLAGS
    - PREPARE_EDITORIAL_REVIEWS_FOR_HUMAN_APPROVAL
    - IDENTIFY_FALSE_PRODUCT_AND_AVAILABILITY_CLAIMS
  AI_MUST_NOT:
    - GRANT_IP_RIGHTS_OR_LICENSES
    - RECLASSIFY_LICENSED_ARTWORK_AS_ORIGINALS_IP
    - MAKE_UNVERIFIED_STOCK_OR_PRICE_CLAIMS
    - COMMIT_VENDOR_PRODUCTION_OR_SHIPPING
    - PUBLISH_REAL_SELLABLE_PRODUCT_UNILATERALLY
    - AUTHORIZE_CHECKOUT_PAYMENT_ORDER_OR_REFUND
    - ALTER_MGBOS_FINANCIAL_OR_AUTHORIZATION_INVARIANTS
```

| Topic | Authority/owner | Needed relationship |
|---|---|---|
| Business definition/portfolio | TS-FND-001, DEC-TS-2026-012 | Source of strategic primary line/owner decision |
| Brand identity and merchandising hierarchy | TS-BRD-001, TS-BRD-002 | Customer promise and Selects priority |
| Selects editorial and rights-aware offer | TS-COM-002 v2.0 + TS-LEG-001 | Source of curatorial/legal restrictions |
| Essentials and category/product taxonomy | TS-COM-003, TS-COM-005 | Distinguish foundational garments from curated designs |
| Catalog merchandising | TS-COM-004 | Owns collections, PLP, product source and presentation mechanics |
| Public website architecture | TS-TEC-002 v2.0 | Curated-first nav, homepage, discovery and conditional cart |
| Retail UX / PRD | MGBOS TeeStock customer platform CX contract | Owns interaction states and test acceptance |
| Orders, payments, vendor, QC, financial invariants | MGBOS domain map, contracts and actual runtime evidence | Exclusive transaction/financial controls |
| Q4 work sequencing | TS-RDM-003 + approved operational pilot plan | Preserve Business/Custom spine pilot; reconcile business wording separately |
| Governance and document status | documentation-constitution.md | One canonical owner per topic; no silent supersession |

**Unresolved as of exact source PR #85 baseline:** Commerce documents TS-COM-004 and TS-COM-003 remain separate owners and must not be silently modified here. Current-quarter roadmap still names Business/Custom as primary commercial scope and needs explicit reconciliation to DEC-012. TS-COM-001 owns the **consumer Commerce business promise**, not the Q4 engineering acceptance cohort or a new legal license.

# 120. Adoption, Documentation QA and Next Work Packages

### Required independent checks

- [ ] Verify exact PR HEAD and source file blob before modification; fail closed on drift.
- [ ] Preserve all 116 original numbered sections, headings and substantive body lines; do not delete historical choices.
- [ ] Confirm metadata parses and document version is v2.0, with only one TS-COM-001 canonical owner.
- [ ] Check Section 9 Selects primacy, Section 11 Essentials support, Section 13 Originals IP separation and Section 110 old checkout target override.
- [ ] Confirm no new live checkout/payment, inventory, supplier, legal, schema, deployment, merge or production authorization.
- [ ] Run governance/document references tests and PR CI on *new exact HEAD*.
- [ ] Obtain independent review of actual pushed diff and exact Git blobs before accepting this one-file candidate.

The checklist is a *future operator validation plan*, not a statement those checks already passed. Document authoring and source selection alone do not prove physical samples, customers, runtime payment or backend integration exist.

### Follow-up ownership — do not expand this file's scope

1. TS-COM-004 Catalog & Merchandising: tie editorial collections, design discovery and product publication to controlled assortment and merchandising evidence.
2. TS-RDM-003 Current Quarter: distinguish strategic retail curated-apparel commercial focus from Q4 Business/Custom technical operating-spine acceptance and actual solo-founder execution commitments.
3. Commerce UX and runtime: conduct customer tree tests/accessibility/checkout acceptance only when an approved work package and appropriate environment exist.
4. Final PR #85 acceptance: rebase/merge-base and branch protection checks, governance, independent documentation reconciliation, and current exact-HEAD CI.

**Snapshot:** TS-COM-001 v1.0 source Git blob `deca5a63247719cfb8ddaddd2e9363693a404ddc` on PR #85 HEAD `fc6dc00444ab92d56e2f82dcf1c80e05fb3b3c9e`, 2026-10-20. This snapshot fixes the source-of-authoring identity; it is not a promise that later HEAD or CI remains unchanged.
