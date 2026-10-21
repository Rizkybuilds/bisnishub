---
title: "TeeStock Catalog & Merchandising System"
date: "2026-09-28"
bisnis: teestock
kategori: operasional
status: active
tags:
  - bisnis/teestock
  - kategori/operasional
  - teestock/canonical
  - teestock/commerce
document_id: "TS-COM-004"
canonical_id: teestock.commerce.catalog-merchandising-system
schema_version: "1.0"
document_class: canonical-catalog-and-merchandising-strategy
owner: "Rizky / Founder"
author: "ChatGPT / AI Co-Founder — Catalog, Curation & Merchandising"
approver: "Rizky / Founder (curated-design-first business direction)"
scope: teestock-catalog-design-product-taxonomy-merchandising-and-publishing-boundaries
primary_business_positioning: CURATED_DESIGN_APPAREL
primary_catalog_line: TEESTOCK_SELECTS
supporting_catalog_line: TEESTOCK_ESSENTIALS
originals_role: SEPARATELY_GOVERNED_OWNED_IP
services_role: SECONDARY_CONDITIONAL
four_business_domains: RETAINED
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
  inspected_head: 5356bed33e87428eba911affa33b66b718d87041
  source_blob_sha: f48da0b6b5615afa3d91c8926cb156409d73421f
  source_version: "1.0"
  reviewed_on: "2026-10-20"
supersedes: "TS-COM-004@1.0"
version: "2.0"
category: "commerce"
business: "teestock"
last_updated: "2026-10-20"
path: "03-commerce/catalog-merchandising-system.md"
depends_on:
  - "TS-FND-001"
  - "TS-FND-002"
  - "TS-BRD-002"
  - "TS-BRD-004"
  - "TS-COM-001"
  - "TS-COM-002"
  - "TS-COM-003"
---


# TeeStock Catalog & Merchandising System v2.0

> [!abstract] **Canonical Catalog & Merchandising Framework  **
> Dokumen ini mendefinisikan bagaimana seluruh produk TeeStock disusun, dikategorikan, ditemukan, dibandingkan, ditampilkan, diprioritaskan, dipromosikan, diuji, dan dihentikan di dalam Commerce tanpa mengubah struktur bisnis canonical TeeStock.
>
> [!info] **Dependencies & Data Flow (SSOT)**
> [[bisnis/teestock/00-foundation/teestock-master-definition|TS-FND-001: TeeStock Master Definition]] • [[bisnis/teestock/00-foundation/glossary|TS-FND-002: TeeStock Glossary]] • [[bisnis/teestock/02-brand/brand-architecture|TS-BRD-002: TeeStock Brand Architecture]] • [[bisnis/teestock/02-brand/voice-and-copy-system|TS-BRD-004: TeeStock Voice & Copy System]] • [[bisnis/teestock/03-commerce/commerce-overview|TS-COM-001: TeeStock Commerce Overview]] • [[bisnis/teestock/03-commerce/teestock-selects|TS-COM-002: TeeStock Selects]] • [[bisnis/teestock/03-commerce/teestock-essentials|TS-COM-003: TeeStock Essentials]]


---

# 1. Purpose

> [!important] **Current business direction — DEC-TS-2026-012.** The public catalog must make TeeStock recognizable as a curated-design apparel brand: TeeStock Selects and a small number of meaningful, rights-cleared design collections lead discovery. Essentials is supporting; Originals is a separately approved owned-IP lane; Services retains secondary governed routes. Do not confuse the four business domains with equal consumer-navigation prominence. This is a merchandising/documentation rule, **not proof a checkout, stock position, or manufacturing system is live**.

**Authority:** TS-COM-004 owns catalog grouping, merchandising placement, search/filter and truthful product presentation logic. TS-COM-002 owns artwork curation; TS-LEG-001 owns rights clearance; TS-COM-001 owns Commerce strategy; TS-TEC-002/CX own IA and interactions; finance, operations, and MGBOS own prices, inventory, payments, order authority, QC, and actual readiness.


Catalog & Merchandising System menjawab:

- bagaimana produk disusun,
- bagaimana customer menemukannya,
- apa beda category, collection, edit, tag, dan filter,
- bagaimana Selects, Essentials, Originals, serta Collaborations hidup dalam satu storefront,
- bagaimana product ranking dilakukan,
- kapan sebuah badge boleh digunakan,
- bagaimana product lifecycle memengaruhi visibility,
- dan bagaimana merchandising menghasilkan data tanpa merusak brand.

Core principle:

> **Catalog organizes products. Merchandising creates context.**

---

# 2. Catalog Definition

**CURRENT/PLANNED boundary:** the historical definition refers to sellable products in an authorized operating mode. Until those gates pass, a conceptual catalog can contain INTERNAL candidates, APPROVED informational products and rights-cleared design discovery without asserting a sellable SKU. `listed`, `editorially_approved`, `rights_cleared`, `physically_validated`, `priced`, `available`, and `transaction_authorized` are separate dimensions; this line is guidance, not a new database enum.


> **Catalog adalah structured representation dari seluruh sellable products yang tersedia melalui TeeStock Commerce.**

Catalog bukan sekadar:

```text id="59la99"
list of products
```

Catalog harus memiliki relationship antara:

```text id="qlumh1"
PRODUCT
CATEGORY
LINE
DESIGN
COLLECTION
LABEL
TAG
VARIANT
CHANNEL
AVAILABILITY
```

---

# 3. Merchandising Definition

> **Merchandising adalah sistem untuk menentukan produk apa yang ditampilkan, kepada siapa, dalam urutan apa, dalam context apa, dan untuk tujuan apa.**

Merchandising mencakup:

- homepage placement,
- category ordering,
- curated edits,
- recommendations,
- product badges,
- campaign assortment,
- search ranking,
- collection presentation.

---

# 4. Catalog vs Merchandising

Canonical distinction:

```text id="7kdcmh"
CATALOG
What exists.

MERCHANDISING
What gets attention.
```

Contoh:

```text id="kbrpf9"
Product:
Heavyweight Tee

Catalog:
listed under T-Shirts / Essentials

Merchandising:
featured as "Built for Everyday"
```

---

# 5. Catalog Architecture

**Presentation hierarchy override:** use `TeeStock → Shop / curated collections / approved Selects → meaningful design and apparel facts` as the primary consumer entry. The following diagram is a taxonomy and product-source inventory, NOT permission to place every line, label, collaboration or service equally on the homepage or to expose empty routes.


Canonical high-level structure:

```text id="txxuyc"
TEEStock COMMERCE
│
├── SELECTS
├── ESSENTIALS
│
├── ORIGINALS PRODUCTS
│
└── COLLABORATIONS
      │
      ▼
  SHARED CATALOG
      │
      ├── Product Families
      ├── Categories
      ├── Collections
      ├── Labels
      ├── Tags
      ├── Filters
      └── Search
```

Originals masuk ke shared catalog sebagai product source.

Bukan Commerce Line.

---

# 6. Catalog Object Types

**Data ontology boundary:** Product family, product, artwork, licensed source, sellable design-product combination, size/color variant, SKU, category, collection, tag, creator and channel listing describe distinct concepts. A design is not a garment; a collection is not IP ownership; a channel listing is not the canonical Product record; a possible combination is not a stocked SKU. These relationships are conceptual and do not authorize MGBOS root entities or migrations.


Canonical catalog objects:

```text id="yejnu5"
COMMERCE LINE
PRODUCT FAMILY
PRODUCT
DESIGN / ARTWORK
COLLECTION
LABEL
COLLABORATION
CATEGORY
TAG
CURATED EDIT
CAMPAIGN
VARIANT
SKU
```

Masing-masing memiliki fungsi berbeda.

---

# 7. Product Family

Product Family menjelaskan physical product type.

Examples:

```text id="xc8rgv"
T-Shirts
Hoodies
Crewnecks
Long Sleeves
Tote Bags
```

Product Family adalah stable taxonomy.

Tidak dibuat untuk campaign sementara.

---

# 8. Product

Product adalah commercial offering utama.

Example:

```text id="sm2jx2"
Heavyweight Tee
```

atau:

```text id="nkusdg"
Start Anyway Tee
```

tergantung product model.

---

# 9. Design / Artwork

**Artwork/use guard:** designs require traceable provenance, source owner, appropriate use-specific rights and permitted image/marketing rights. AI output, purchased files, or payment to a designer do not themselves establish exclusive ownership. Use TS-LEG-001 and the underlying agreements; approval to feature a concept cannot waive IP review.


Design adalah creative layer.

Examples:

```text id="6ft7dg"
Coffee Before Everything
Start Anyway
Version 0.1
```

Design dan Product tidak boleh disamakan dalam backend taxonomy.

---

# 10. Category

Category adalah customer-facing navigational grouping.

Examples:

```text id="fsibza"
T-Shirts
Graphic Tees
Essentials
Originals
```

Category harus membantu browsing.

Tidak dibuat hanya karena backend memiliki field tertentu.

---

# 11. Category Design Rule

Category dibuat jika:

```text id="r85ibs"
CUSTOMER EXPECTS IT
+
ENOUGH PRODUCTS EXIST
+
IT IMPROVES DISCOVERY
```

Jangan membuat category berisi satu product tanpa alasan.

---

# 12. Category Depth

Preferred:

```text id="qay65y"
2–3 meaningful levels maximum
```

Contoh:

```text id="ko2go5"
Shop
└── T-Shirts
    ├── Graphic
    └── Essentials
```

Avoid deeply nested navigation seperti:

```text id="hn7znf"
Men
→ Apparel
→ Tops
→ T-Shirts
→ Graphic
→ Typography
→ Coffee
```

kecuali catalog benar-benar besar.

---

# 13. Collection

**Editorial priority:** the initial customer-facing collection is a small coherent edit of eligible TeeStock Selects designs, built around recognizable customer intent—not a large catalogue sorted by internal departments. A collection may be publicly discoverable only with cleared asset/media rights and truthful product context; it is never evidence that all included items can be purchased.


Collection adalah grouped products berdasarkan:

- concept,
- story,
- season,
- release,
- brand.

Examples:

```text id="mi8j6h"
Chapter 001 — Start Anyway
The Night Shift
Ramadan Collection
```

Collection bukan stable product taxonomy.

---

# 14. Collection vs Category

**Current usage:** Category represents stable browse structure, Collection represents purposeful editorial/design grouping. Neither creates a master brand, business domain, ownership transfer or stock allocation. The website IA owns public routes and whether a collection needs its own page.


Canonical distinction:

```text id="2uc7mv"
CATEGORY
helps find product types.

COLLECTION
groups products through concept or release.
```

---

# 15. Curated Edit

**Curated-edit governance:** choose an audience/theme thesis, inclusion/exclusion rationale, eligible designs, proof of artwork and imagery rights, owner/reviewer, approval date, expiry/review trigger, and meaningful next action. Do not create arbitrary edits solely to fill homepage modules; an edit can be internal until assets and copy pass clearance.


Curated Edit adalah temporary or editorial grouping.

Examples:

```text id="8g6qtr"
For Coffee People
Made for Builders
Everyday Blacks
Under Rp150k
```

Curated Edit:

- tidak mengubah product ownership,
- tidak menjadi permanent business entity,
- tidak menjadi brand.

---

# 16. Curated Edit Lifecycle

Possible status:

```text id="hjex4d"
DRAFT
ACTIVE
EXPIRED
ARCHIVED
```

---

# 17. Label

**Labels vs edits:** an apparel edit, Selects collection, original label, and creator attribution are not interchangeable. Independent labels need separate Originals/brand governance; a successful niche or creator artwork cannot automatically become TeeStock-owned IP.


Independent Label merupakan brand entity.

Example:

```text id="z42qrp"
Do Your Best
```

Label dapat memiliki dedicated catalog view.

---

# 18. Collaboration

Collaboration dapat mempunyai dedicated view:

```text id="qzwdv1"
TeeStock × Creator
```

tetapi tetap tidak menjadi new master brand.

---

# 19. Tag

Tag membantu:

- search,
- recommendation,
- analytics,
- internal classification.

Examples:

```text id="qrqg58"
coffee
developer
minimal
typography
outdoor
black
heavyweight
```

Tag tidak otomatis tampil sebagai category.

---

# 20. Canonical Tag Types

Tags sebaiknya diklasifikasikan:

```text id="jubw94"
INTEREST
STYLE
THEME
AUDIENCE
FIT
MATERIAL
COLOR
USE CASE
```

---

# 21. Tag Governance

**Taxonomy change control:** keep tag vocabulary narrow enough for one founder to review, prevent synonymous tags from creating duplicate consumer filters, and avoid assigning legal/quality/stock attributes from weak AI guesses. Tag changes should not silently rewrite canonical source or artwork ownership.


Tag baru harus:

- mempunyai canonical spelling,
- avoid duplicates,
- avoid unnecessary synonym fragmentation.

Example:

Prefer:

```text id="t5iklm"
coffee
```

than separate internal concepts:

```text id="gbyxg9"
coffee-lover
coffee lovers
coffeelover
kopi lovers
```

jika artinya sama.

---

# 22. Controlled Vocabulary

Tagging harus menggunakan controlled vocabulary untuk fields penting.

Examples:

```text id="0tz5mt"
FIT:
regular
relaxed
oversized

COLOR FAMILY:
black
white
grey
neutral
blue
```

Free-text tags hanya untuk additional context.

---

# 23. Search Architecture

**Search release gate:** for a genuinely small catalog, accessible navigation/collection discovery can be better than a fabricated sophisticated search tool. Only expose search UI if it returns honest, relevant permitted content. A result's relevance must never bypass rights, publication or availability restrictions.


Search harus mampu menemukan produk berdasarkan:

```text id="9f64rp"
PRODUCT NAME
DESIGN NAME
LABEL
COLLECTION
INTEREST
CATEGORY
TAG
```

---

# 24. Search Principle

Search harus mengutamakan:

> **relevance before popularity.**

Jika customer mencari:

```text id="alzkce"
coffee
```

product coffee relevan harus muncul lebih tinggi daripada bestseller unrelated.

---

# 25. Search Ranking Factors

**Ranking constraint:** topical and design relevance, collection fit, product comprehension and truthful publishability precede margin or unverified conversion. Historical simulated views or demo purchases do not constitute sales ranking evidence; never treat AI scores as clearance for a restricted product.


Potential factors:

```text id="8lfv4c"
TEXT RELEVANCE
AVAILABILITY
PRODUCT QUALITY STATUS
PERFORMANCE
RECENCY
MERCHANDISING BOOST
```

Exact weights merupakan implementation detail.

---

# 26. Search Merchandising

Business dapat memberi temporary boost untuk:

- launch,
- campaign,
- experiment.

Tetapi boost tidak boleh menghancurkan relevance.

---

# 27. Search Zero Result

Jika tidak ada product:

system dapat:

- suggest related terms,
- show adjacent category,
- log query as demand signal.

Zero-result searches adalah valuable market data.

---

# 28. Search Demand Data

Track queries:

```text id="a1miy3"
WITH RESULTS
WITHOUT RESULTS
WITH PURCHASE
WITHOUT PURCHASE
```

Ini dapat mengungkap assortment gaps.

---

# 29. Filter Architecture

**Filter fidelity:** display only meaningful facets supported by real product metadata and actual available options; do not show meaningless filters for a handful of items, infer garment properties from photos or manufacture inventory availability. Maintain accessible keyboard and screen-reader operation as required by the owning CX specification.


Filters harus membantu decision.

Canonical filter groups dapat mencakup:

```text id="egil5e"
PRODUCT TYPE
SIZE
COLOR
FIT
PRICE
AVAILABILITY
LINE
COLLECTION
```

---

# 30. Filter Rule

Jangan membuat filter hanya karena data tersedia.

Example:

Customer biasanya tidak membutuhkan:

```text id="tt3eug"
Supplier ID
Print batch
```

di storefront.

---

# 31. Dynamic Filters

Filter dapat berubah berdasarkan category.

Example:

T-Shirts:

```text id="zbzlti"
Size
Fit
Color
Price
```

Graphic Tees:

tambahkan:

```text id="fp3hlh"
Interest
Style
```

---

# 32. Sorting

Possible sorts:

```text id="ufilz9"
Recommended
Newest
Best Selling
Price Low–High
Price High–Low
```

Default sebaiknya:

```text id="5r8zd0"
Recommended
```

berdasarkan merchandising rules.

---

# 33. Recommended Ranking

**First-release priority:** editorially approved Selects design/collection relevance is PRIMARY. Bestseller and conversion boosts are conditional on sufficient real, lawful and appropriately attributed observations. Do not rank a supposedly available item above accurate customer information when stock and transaction gates remain unverified.


Recommended ranking dapat mempertimbangkan:

```text id="n3xol1"
RELEVANCE
MERCHANDISING PRIORITY
CONVERSION
AVAILABILITY
MARGIN
NEWNESS
CUSTOMER CONTEXT
```

Tidak boleh hanya:

```text id="63gt90"
highest margin first
```

---

# 34. Bestseller Definition

**Evidence gate for BEST SELLER:** require defined window, verified paid orders, deduplicated population, business owner, channel coverage and removal trigger; no fictitious order fixtures, waitlist counts or impressions qualify. Until historical data exists, omit this badge.


Product hanya mendapat:

```text id="hgzjbx"
BEST SELLER
```

berdasarkan defined sales threshold/window.

Threshold detail ditentukan di merchandising operations.

---

# 35. New Badge

**Evidence gate for NEW:** require recorded product publication/release date, approved time window and automatic/manual expiry. Changing imagery or reimporting a listing cannot reset the date merely to create false novelty.


`NEW` hanya diberikan kepada product selama defined launch window.

Setelah window selesai:

badge otomatis/manual dihapus.

---

# 36. Limited Badge

**Evidence gate for LIMITED:** show only when enforceable, demonstrable quantity or sale-period constraints are real and customer claims describe them truthfully. Hypothetical preorder limits or planned scarcity do not qualify.


`LIMITED` hanya digunakan jika:

```text id="8hfqtt"
QUANTITY LIMITED
or
SALE WINDOW LIMITED
```

secara nyata.

---

# 37. Exclusive Badge

**Evidence gate for EXCLUSIVE:** use only after rights agreement and actual allowed distribution/exclusivity scope are verified by TS-LEG-001; customer copy must not overstate duration, territory or exclusivity.


`EXCLUSIVE` hanya digunakan jika TeeStock memiliki genuine exclusive rights/availability.

Tidak digunakan sekadar untuk meningkatkan conversion.

---

# 38. Low Stock Badge

**Evidence gate for LOW STOCK:** requires reconciled available-to-promise inventory/allocations through the owning source. Do not apply it to a virtual design, untested print-on-demand capacity, made-up stock number or demo fixture.


Low Stock harus berdasarkan actual inventory logic.

Jangan menggunakan fake scarcity.

---

# 39. Badge Governance

Canonical badges:

```text id="kd1xyj"
NEW
BEST SELLER
LIMITED
LOW STOCK
PREORDER
MADE TO ORDER
```

Additional badges require clear business meaning.

---

# 40. Badge Overload

Ideal product card tidak memiliki banyak badge bersamaan.

One or two meaningful signals are sufficient.

---

# 41. Homepage Merchandising

**Homepage hierarchy:** first show the TeeStock curated apparel proposition and a deliberately selected collection of approved Selects designs. Product material, size, print and honest availability proof follow. Essentials, Originals and Services appear only in proportion to current eligible assortment/activation. Avoid empty shelves, invented testimonials and a generic B2B printing hero.


Homepage bukan full catalog.

Homepage harus menampilkan:

```text id="lj7iv4"
BRAND PROPOSITION
+
KEY ENTRY POINTS
+
SELECTED PRODUCTS
+
PROOF
```

---

# 42. Homepage Product Modules

Possible:

```text id="793piy"
New Selects
Essential Staples
TeeStock Originals
Best Sellers
Curated Edit
```

Tidak semuanya harus aktif sekaligus.

---

# 43. Homepage Priority Rule

**Decision precedence:** DEC-TS-2026-012 establishes **curated-design-first** consumer priority; DEC-009 preserves a separate Business/Custom MGBOS operating-spine test. Homepage placement follows valid customer offers, not the engineering test sequence or the number of business units.


Homepage priority mengikuti:

```text id="tcw0v8"
CURRENT BUSINESS PRIORITY
+
CUSTOMER VALUE
+
MERCHANDISING STRATEGY
```

Bukan organizational hierarchy.

---

# 44. Shop Landing Page

**Shop discovery:** TeeStock Selects/curated edits are the default journey; Essentials supports fit/material browsing, Originals is separately rights/label-governed, and service lead routes are secondary. If no catalog item satisfies truthful public publication, do not fake a full shop or commercial availability.


`/shop` harus menjadi discovery hub.

Potential structure:

```text id="yqhzx6"
SHOP
│
├── Featured
├── Selects
├── Essentials
├── Originals
├── New
└── Browse by Interest
```

---

# 45. Selects Merchandising

Selects lebih cocok di-merchandise berdasarkan:

```text id="h4wvmg"
INTEREST
DESIGN
THEME
POPULARITY
CURATED EDIT
```

---

# 46. Essentials Merchandising

Essentials lebih cocok berdasarkan:

```text id="zb77ar"
FIT
WEIGHT
COLOR
USE CASE
```

---

# 47. Originals Merchandising

Originals lebih cocok berdasarkan:

```text id="3g2wbe"
LABEL
COLLECTION
STORY
DROP
```

---

# 48. Collaboration Merchandising

Collaboration dapat mempunyai:

- launch module,
- creator profile,
- limited collection.

Visibility dapat turun setelah campaign selesai.

---

# 49. Product Card Architecture

**Product card truth:** card must clearly distinguish design/artwork, apparel garment, real photos vs mockups, allowed creator attribution, real price status, size, actual availability, and eligible CTA. A concept card may link to product details or consent-based interest capture, never impersonate a buyable SKU or verified inventory.


Minimum:

```text id="d5yuv9"
IMAGE
PRODUCT / DESIGN NAME
PRICE
RELEVANT LINE OR LABEL
```

Optional:

```text id="xq3rpg"
BADGE
COLOR COUNT
```

Avoid crowded cards.

---

# 50. Product Card Naming

Depending context:

Selects:

```text id="7pzlrd"
Coffee Before Everything Tee
```

Essentials:

```text id="q5nifr"
Heavyweight Tee
```

Originals:

```text id="4b417n"
Start Anyway Tee
Do Your Best
```

Hierarchy must remain understandable.

---

# 51. Image Selection

Primary card image should optimize product understanding.

Not simply most artistic photo.

Secondary hover/image can provide:

- fit,
- back artwork,
- detail.

---

# 52. Product Detail Page Merchandising

**PDP relationship:** the card, collection/PLP and PDP must identify the same approved product/design/garment/variant, not collapse artwork provenance into product ownership. Show accurate fit, material, print method, returns/lead time and rights-safe media as applicable. Real cart and checkout controls require separate authorization.


PDP can include:

```text id="gd87dq"
Related Products
Same Collection
Same Interest
Same Fit
Recently Viewed
```

Use context carefully.

---

# 53. Recommendation Priority

Early recommendation logic should favor:

```text id="7sc72u"
SIMPLE
EXPLAINABLE
RELEVANT
```

Example:

> More from Do Your Best

better than black-box recommendation with no useful data.

---

# 54. Recommendation Stages

```text id="8mej00"
STAGE 1
Manual relationships

STAGE 2
Rule-based

STAGE 3
Behavior-based

STAGE 4
AI-assisted personalization
```

---

# 55. Manual Recommendation

Examples:

```text id="h6gi5v"
same collection
same niche
same garment
complementary product
```

---

# 56. Personalization Rule

Personalization should improve relevance.

It must not:

- hide critical products,
- produce inconsistent pricing,
- expose sensitive inference.

---

# 57. Merchandising Slots

Storefront should define stable slots.

Example:

```text id="4yj1bd"
HOME.HERO
HOME.FEATURED_1
HOME.SELECTS
HOME.ESSENTIALS
SHOP.FEATURED
PDP.RELATED
```

This allows MGBOS/commerce system to manage placements systematically.

---

# 58. Slot Assignment

A placement record should know:

```text id="10ues6"
SLOT
ENTITY
START DATE
END DATE
PRIORITY
CAMPAIGN
STATUS
```

---

# 59. Merchandising Calendar

Future merchandising should coordinate:

```text id="ee9c44"
PRODUCT LAUNCH
COLLECTION
CAMPAIGN
SEASON
INVENTORY
PROMOTION
```

through one calendar.

---

# 60. Campaign Integration

Campaign does not duplicate products.

Instead:

```text id="smfdyh"
CAMPAIGN
↓
references products / collections
↓
controls placement / creative / message
```

---

# 61. Campaign Assortment

A campaign can define:

```text id="j0kd3a"
HERO PRODUCT
SUPPORTING PRODUCTS
BUNDLE
LANDING PAGE
```

without creating new category.

---

# 62. Landing Pages

Landing page is contextual merchandising surface.

Examples:

```text id="prziql"
/coffee
/start-anyway
/creator-name
/back-to-work
```

A landing page is not automatically permanent taxonomy.

---

# 63. Landing Page Lifecycle

```text id="df036u"
DRAFT
SCHEDULED
LIVE
EXPIRED
ARCHIVED
```

---

# 64. Inventory-Aware Merchandising

**Inventory boundary:** `concept published`, `approved item`, `physical garment stock`, `production capacity`, and `saleable availability` are not interchangeable. Verified customer availability comes only from authorized inventory/production and order domains; editorial placement cannot manufacture inventory.


Avoid prominently featuring unavailable products unless:

- preorder,
- waitlist,
- strategic reason.

Ranking should consider availability.

---

# 65. Low Inventory Handling

Possible actions:

```text id="fx7gn3"
keep visible + low-stock notice
reduce paid promotion
switch to preorder
temporarily hide
```

depending product strategy.

---

# 66. Out-of-Stock Handling

Options:

- notify me,
- alternative recommendation,
- related color,
- preorder.

Do not automatically delete product page if SEO/history matters.

---

# 67. Discontinued Product

Product page may remain with:

```text id="xf5ayk"
DISCONTINUED
+
ALTERNATIVES
```

where useful.

---

# 68. Product Lifecycle Visibility

Status:

```text id="w7puy8"
TEST
ACTIVE
CORE
DECLINING
SUNSET
ARCHIVED
```

can influence merchandising priority.

---

# 69. Test Products

Test products generally receive controlled traffic.

Goal:

> collect signal.

Not necessarily maximize sales immediately.

---

# 70. Core Products

Core products receive:

- stable visibility,
- replenishment priority,
- reliable navigation access.

---

# 71. Growth Products

Products with positive signals can receive:

- more placement,
- more content,
- more channel exposure.

---

# 72. Declining Products

Possible actions:

- reduce exposure,
- investigate cause,
- clearance if inventory exists,
- sunset.

---

# 73. Merchandising Metrics

**Metric authority:** track content/discovery/intent separately from committed transaction/fulfillment/contribution. `collection_view`, `product_view`, `consented_interest`, `paid_order`, `returned_item` are conceptual evidence classes until the event owner defines actual schemas. Do not count UI mocks or analytics fixtures as business results.


Track:

```text id="nln1u8"
Impressions
Clicks
CTR
PDP Views
Add-to-Cart
Conversion
Revenue
Contribution
```

by placement where possible.

---

# 74. Placement Attribution

If Product A sells more because it was on hero placement:

system should not conclude solely:

> product quality increased.

Placement context matters.

---

# 75. Merchandising Experiment

Example:

Hypothesis:

> Showing fit first increases Essentials conversion.

Test:

```text id="0jot72"
Version A
product grid by model

Version B
product grid by fit
```

Measure relevant behavior.

---

# 76. Experiment Contamination

Avoid changing:

- price,
- photography,
- placement,
- copy

all at the same time if trying to isolate one variable.

---

# 77. Catalog Analytics

Catalog health can be measured through:

```text id="vb1fmv"
ACTIVE PRODUCTS
ACTIVE SKUS
ZERO-SALE PRODUCTS
SEARCH ZERO RESULTS
ASSORTMENT CONCENTRATION
CATEGORY CONVERSION
```

---

# 78. Zero-Sale Products

Zero-sale product is not automatically bad.

Check:

- traffic,
- visibility,
- lifecycle,
- test status.

---

# 79. Catalog Concentration

If small percentage of products generate most revenue:

this is useful information.

Potential action:

- focus hero assortment,
- reduce unnecessary long tail.

---

# 80. Long-Tail Governance

Long-tail products can remain if:

```text id="43kbg0"
LOW INVENTORY RISK
LOW MAINTENANCE COST
SEARCH DEMAND EXISTS
```

But catalog clutter must be controlled.

---

# 81. Assortment Compression

Periodically consolidate:

- duplicate designs,
- weak colors,
- redundant fits,
- outdated products.

A smaller catalog can perform better if easier to understand.

---

# 82. Customer Intent Model

**Primary browse intent:** begin with customer interests, recognizable designs, collection narratives and garment fit; do not require understanding TeeStock organizational lines. Keep category labels minimal, meaningful and distinct from themes or independent labels.


Catalog should help four common intents:

```text id="1x31w9"
"I know what I want."
→ Search

"I know the type."
→ Category

"I know the interest."
→ Curated Edit / Tags

"I don't know yet."
→ Merchandising
```

---

# 83. Browse by Interest

Especially valuable for Selects.

Example:

```text id="9q8m5g"
Coffee
Coding
Outdoor
Cats
```

Should only surface when enough quality products exist.

---

# 84. Browse by Fit

Especially useful for Essentials.

```text id="9gikfb"
Regular
Relaxed
Oversized
```

---

# 85. Browse by Label

For validated Originals Labels:

```text id="jtcwt0"
Do Your Best
Work In Progress
```

---

# 86. Browse by Collection

Useful for:

- Originals,
- campaign drops,
- collaborations.

---

# 87. Navigation Architecture

**2026-10-20 supersession note:** the historic `SHOP / CUSTOM / BUSINESS / MERCH / ORIGINALS` list below documents potential ecosystem routes, **NOT equal-priority global navigation**. Current primary entry is Shop → curated Selects collections/design discovery; product/size/support navigation remains reachable. Conditional services and Originals must only surface with approved eligible content. TS-TEC-002 v2.0 owns final public IA/URLs and CX owns accessible behavior.


Recommended consumer navigation stays simple:

```text id="724aes"
SHOP
CUSTOM
BUSINESS
MERCH
ORIGINALS
```

Inside Shop:

```text id="tput73"
Selects
Essentials
New
Featured
```

Exact IA belongs in website documentation.

---

# 88. Catalog SEO

Product, category, collection, and label pages may be indexed based on strategic value.

Avoid generating thousands of thin tag pages purely for SEO.

---

# 89. SEO Category Rule

Index page only if it has:

- meaningful search intent,
- enough products/content,
- useful user value.

---

# 90. Canonical URLs

**URL/source guard:** historical sample slugs below are illustrative only; no route is asserted as deployed. Canonical URLs, redirects, indexability, and accessibility follow TS-TEC-002 and relevant CX acceptance. Do not automatically index thin, empty or rights-unapproved tag/collection pages.


URL should be readable and stable.

Example direction:

```text id="ljt9ky"
/shop/t-shirts
/selects/coffee-before-everything
/essentials/heavyweight-tee
/originals/do-your-best/start-anyway
```

Exact implementation belongs in product-tech docs.

---

# 91. URL Stability

Do not tie permanent URL structure too tightly to temporary campaign hierarchy.

Redirect strategy required when structure changes.

---

# 92. Catalog and Channels

Canonical catalog can feed multiple channels:

```text id="gl0wza"
TEEStock.ID
MARKETPLACE
SOCIAL COMMERCE
CREATOR STORE
```

Channel-specific views can differ.

Underlying product identity remains the same.

---

# 93. Channel Assortment

A Product should have:

```text id="cvpcvu"
CHANNEL ELIGIBILITY
```

Example:

```text id="ylhqvp"
TeeStock.id = active
Shopee = active
TikTok = inactive
Creator Store = active
```

---

# 94. Channel Listing

**Channel listing boundary:** do not equate a planned marketplace/social listing with approval to connect credentials, publish IP, collect payments or accept orders. Channel-specific rights, platform policy, inventory, pricing, customer support, shipping and finance gates remain mandatory.


Channel listing is not new Product entity.

It references canonical Product.

This prevents duplicated product truth.

---

# 95. Channel-Specific Copy

Channels may require:

- shorter title,
- specific image,
- marketplace metadata.

But core specs must remain canonical.

---

# 96. Catalog and Pricing

Base price belongs to Product/Price system.

Channel may add:

- fees,
- promotions,
- channel pricing policies.

Do not create uncontrolled price drift.

---

# 97. Catalog and Inventory

**Availability ownership:** never infer physical stock or realistic lead times from a catalog Product, a partner spreadsheet without verification, a virtual design × size matrix, or a synthetic MGBOS event. Maintain the distinction between finished goods and blank garments, reservations, vendor capacity and active sellable offers.


Storefront availability must derive from inventory/production truth.

Catalog should not manually claim availability contrary to backend.

---

# 98. Catalog and IP

**IP blocking gate:** validity is for the *specific design, product use, marketplace/website channel, geography, print quantity, attribution and time window*. Revocation/expiry or unresolved clearance blocks the affected public offer and promotion according to TS-LEG-001; do not claim ownership from file access or payment.


Every design-bearing Product must be linked to:

```text id="64psnd"
ARTWORK / IP RECORD
```

Products with expired rights must become unsellable according to policy.

---

# 99. Catalog and Originals

Originals product should know:

```text id="x986jo"
LABEL
COLLECTION
IP OWNER
PRODUCT
```

This allows both brand storytelling and accurate economics.

---

# 100. Catalog and Creators

Creator-related Product should know:

```text id="o2tch6"
CREATOR
AGREEMENT
ROYALTY RULE
ATTRIBUTION
```

---

# 101. Catalog and MGBOS

**Architecture not schema authority:** conceptual terms and source-of-truth arrows below are NOT new MGBOS tables, APIs, event schemas or migrations. Follow domain map, organization isolation, financial integrity and agreed engineering work packages for implementations.


MGBOS should eventually provide catalog governance for:

```text id="379pbc"
PRODUCT STATUS
CHANNEL STATUS
MERCHANDISING STATUS
INVENTORY
PRICING
IP RIGHTS
```

---

# 102. Catalog Source of Truth

Canonical sequence:

```text id="97zu63"
PRODUCT MASTER
↓
CATALOG SERVICE
↓
CHANNEL PRESENTATION
```

Not:

```text id="lu8l5w"
Shopee listing
=
product database
```

---

# 103. Publishing Workflow

**Publishing is not transacting:** editorial approval, IP/media clearance, lawful product information, physical/sample QC, price validation, channel approval and live-order/payment/fulfillment authorization must be separately evidenced. A public informational collection can be approved without checkout; a design is never automatically sellable because a catalog page was built.


Canonical:

```text id="j2q4sk"
PRODUCT READY
↓
CONTENT READY
↓
PRICE READY
↓
INVENTORY / PRODUCTION READY
↓
IP READY
↓
CATALOG APPROVAL
↓
PUBLISH
```

---

# 104. Product Readiness Gate

**Stage-gated interpretation:** the legacy list below is necessary, but insufficient, for launch. Product media rights, actual sample/size specifications, pricing costs/royalties, supplier capacity, stock, customer returns/support, org authorization and payment/order integrity must be verified by their owners. Fail closed when evidence is absent.


A Product cannot publish if critical fields missing.

Examples:

```text id="m3egjg"
No price
No image
No size data
No IP rights
No fulfillment method
```

---

# 105. Merchandising Approval

**Human approval:** initial editorial slots and product publication remain founder-approved. AI recommendations, scheduled placement and auto-tagging are nonbinding drafts; do not authorize external listing, merchandising claims or financial commitments by rules alone.


Routine merchandising can later be automated/rule-based.

High-impact launch hero placement may require human approval.

---

# 106. AI Merchandising

Future AI can recommend:

```text id="he7ddh"
products to feature
assortment gaps
search synonyms
related products
declining products
```

---

# 107. AI Catalog Enrichment

AI may help create:

- tags,
- product summaries,
- metadata.

But cannot invent product facts.

---

# 108. AI Ranking Boundary

**AI safeguard:** `ACTIVE`, `SELLABLE`, `AVAILABLE` in future-state diagrams are target conditions, not assertions about current operations. AI must not bypass rights expiration, create product facts, fabricate reviews/badges, approve discounts, manipulate prices, or enable checkout.


AI ranking should obey hard rules:

```text id="qdpi46"
ACTIVE PRODUCT
VALID RIGHTS
SELLABLE
AVAILABLE / VALID PREORDER
PRICE VALID
```

AI cannot override these.

---

# 109. Customer Data Boundary

Personalized merchandising must use authorized customer/context data only.

Avoid sensitive or inappropriate inference.

---

# 110. Merchandising Operating Rhythm

Recommended future cadence:

```text id="zt3q1x"
DAILY
availability / broken listings

WEEKLY
placements / performance

MONTHLY
assortment review

QUARTERLY
taxonomy / category strategy
```

---

# 111. Weekly Review

Possible questions:

```text id="ppq4pw"
What is gaining traction?

What is losing traction?

What needs more distribution?

What is overexposed?

What inventory needs protection?
```

---

# 112. Monthly Catalog Review

Review:

- zero-sale items,
- weak conversion,
- duplicates,
- new search demand,
- category health,
- SKU proliferation.

---

# 113. Quarterly Taxonomy Review

Taxonomy should remain stable.

Only modify if customer behavior demonstrates:

- navigation confusion,
- category growth,
- new product family.

---

# 114. Governance Roles

Future ownership can include:

```text id="1t57wy"
Commerce Owner
Product Owner
Brand / Creative
Operations
Data
```

One person may hold multiple roles early.

Responsibilities should remain conceptually separate.

---

# 115. Catalog Anti-Patterns

Avoid:

## Category for Everything

Too many categories destroy navigation.

## Endless Tag Clouds

Internal metadata should not become frontend clutter.

## Fake Bestseller

Damages trust.

## Permanent New Badge

Makes badge meaningless.

## Random Homepage

Every placement should have reason.

## Duplicate Product Records by Channel

Creates data fragmentation.

## Collection = Brand

Not every collection deserves permanent identity.

---

# 116. Merchandising Anti-Patterns

Avoid optimizing only for:

```text id="hqwnmu"
short-term conversion
```

if it causes:

- endless discounts,
- repetitive product exposure,
- weak brand experience,
- inventory problems.

---

# 117. Catalog Health Principle

Healthy catalog is not the biggest catalog.

Healthy catalog is:

```text id="g4i46e"
UNDERSTANDABLE
RELEVANT
AVAILABLE
PROFITABLE
CURATED
```

---

# 118. Initial Implementation

**Small-catalog release guidance:** implement purposeful manual edits first; a curated collection page and accessible product facts may be higher-value than search/filter/automated badges. Do not require real cart/checkout or production from this minimum IA. Every first-release item needs its own truthful publication/transaction stage label.


Early TeeStock does not need advanced recommendation engine.

Minimum:

```text id="wdvk9j"
Product Families
Categories
Basic Tags
Search
Filters
Manual Featured Products
Manual Curated Edits
```

---

# 119. Stage 2 Implementation

After enough catalog/data:

```text id="ta4b5g"
Rule-Based Recommendations
Placement Tracking
Search Analytics
Automated Badges
```

---

# 120. Stage 3 Implementation

Later:

```text id="janhcj"
Personalization
AI Merchandising
Demand Forecast Integration
Dynamic Ranking
```

---

# 121. Initial Catalog Structure

**Proposed presentation priority:** Selects is primary in the initial Shop structure, but only after design and media rights clearance and truthful product copy. Essentials is supporting and may be hidden if absent; Originals only when owned-IP/label approval exists. A collection and item count is not a commitment to physically stocked SKUs.


Recommended initial customer-facing model:

```text id="395cyf"
SHOP
│
├── SELECTS
│   ├── New
│   ├── Popular
│   └── Browse by Interest
│
├── ESSENTIALS
│   ├── T-Shirts
│   └── Future Basics
│
└── ORIGINALS
    └── Active Collections / Labels
```

Keep initial depth minimal.

---

# 122. Catalog Expansion Rule

Do not add a new permanent navigation item unless:

```text id="yk19w2"
meaningful customer demand
+
enough assortment
+
distinct discovery value
```

exists.

---

# 123. Data Model Direction

**Data model non-inference:** these are conceptual relationships. The MGBOS canonical data model, event model and migration contracts are owned separately. Avoid constructing root domain entities or data migrations based solely on this document.


Core relationships:

```text id="tlaoq7"
PRODUCT
├── belongs to PRODUCT FAMILY
├── appears in CATEGORY
├── may belong to COLLECTION
├── may belong to LABEL
├── may reference ARTWORK
├── has TAGS
├── has VARIANTS
└── has CHANNEL LISTINGS
```

---

# 124. Merchandising Model Direction

```text id="qfwd6w"
PLACEMENT
│
├── Slot
├── Entity
├── Priority
├── Schedule
├── Campaign
└── Performance
```

---

# 125. Product State vs Visibility

**Multi-axis readiness:** editorially `FEATURED`, product `ACTIVE`, product `PUBLISHED`, rights `CLEARED`, supplier `CAPABLE`, inventory `AVAILABLE`, checkout `AUTHORIZED`, and order `FULFILLED` can differ. A merchandising slot changes no legal, stock, financial or order state.


Important:

```text id="rbqity"
ACTIVE
≠
FEATURED
```

A product can be sellable but receive very little merchandising.

Similarly:

```text id="50b39t"
FEATURED
```

does not change its canonical Product status.

---

# 126. Catalog vs Inventory State

**Digital catalog ≠ physical availability:** a product may be publicly described while unavailable for purchase, and a valid design concept may remain internal. Never imply that a size/color/artwork combination is stocked or reservable merely because it is searchable or visible.


Product can remain in catalog while inventory state changes:

```text id="abryde"
Ready
Low Stock
Preorder
Out of Stock
```

Do not duplicate product records for each state.

---

# 127. Canonical Catalog Summary

```text id="nwffdw"
CATALOG
organizes everything sellable.

CATEGORY
helps customers navigate.

TAG
adds metadata.

COLLECTION
groups by story/release.

CURATED EDIT
creates temporary context.

MERCHANDISING
decides what gets attention.

SEARCH
helps direct intent.

FILTER
reduces choice.
```

---

# 128. Canonical Merchandising Summary

```text id="ha7yi5"
RIGHT PRODUCT
+
RIGHT CONTEXT
+
RIGHT CUSTOMER
+
RIGHT TIME
```

is the purpose of merchandising.

Not:

```text id="5nvwx9"
show everything everywhere
```

---

# 129. Canonical Principles

```text id="spn4lz"
CATALOG BEFORE CAMPAIGN.

CATEGORY FOR NAVIGATION.

COLLECTION FOR STORY.

TAG FOR METADATA.

EDIT FOR CURATION.

MERCHANDISING FOR ATTENTION.

SEARCH FOR INTENT.

DATA BEFORE RANKING AUTOMATION.

RELEVANCE BEFORE POPULARITY.

CLARITY BEFORE CATALOG SIZE.
```

---

# 130. Dependency

Dokumen berikut harus mengikuti Catalog & Merchandising System:

1. [[bisnis/teestock/03-commerce/product-taxonomy|product-taxonomy.md]]
2. [[bisnis/teestock/09-marketing/channel-strategy|channel-strategy.md]]
3. [[bisnis/teestock/09-marketing/go-to-market|go-to-market.md]]
4. [[bisnis/teestock/10-product-tech/website-information-architecture|website-information-architecture.md]]
5. [[bisnis/teestock/10-product-tech/commerce-platform|commerce-platform.md]]
6. [[bisnis/teestock/11-data-mgbos/canonical-data-model|canonical-data-model.md]]
7. [[bisnis/teestock/11-data-mgbos/event-model|event-model.md]]
8. [[bisnis/teestock/13-metrics-experiments/kpi-framework|kpi-framework.md]]
9. [[bisnis/teestock/13-metrics-experiments/experimentation-framework|experimentation-framework.md]]

Catalog presentation boleh berubah sesuai channel dan campaign, tetapi Product identity, ownership, taxonomy, pricing truth, dan availability harus tetap berasal dari canonical system.

---

# 131. Curated-Design-First Catalog Contract — DEC-TS-2026-012

**Current authority:** this section sets TeeStock's *merchandising* interpretation of its Owner-approved primary curated-design apparel direction. It does not change brand ownership, legal rights, MGBOS source-of-truth definitions or operational release gates.

| Catalog concept | What it means | What it does NOT mean | Primary owner |
|---|---|---|---|
| Artwork / design | Rights-bearing creative asset with source/provenance | Apparel product, TeeStock-owned IP or sale approval | TS-LEG-001; TS-COM-002 |
| Product family / blank garment | Apparel specifications and underlying quality basis | Artwork license, consumer offer, availability | Commerce/operations |
| Sellable design-product candidate | Proposed artwork × garment × placement × eligible options | An automatically approved live retail offer | TS-COM-002, operations, finance |
| Variant / SKU | Specific attribute/stock/unit representation per canonical model | All possible combinations stocked or reservable | Product/inventory owners |
| Category | Stable grouping by consumer product type | New brand, seasonal theme or label | TS-COM-004; TS-COM-005 |
| Collection | Contextual curated group of products/designs | Trademark, ownership transfer, inventory reservation | TS-COM-004 |
| Curated edit | Editorial arrangement for interests/campaign | New permanent entity or independent label | TS-COM-004 |
| Label / Originals | Separately governed owned-IP cultural proposition | Automatic new brand from a successful licensed design | Originals/brand/IP governance |
| Channel listing | A distributed product representation | Canonical product or proof that a marketplace is integrated | Channel/MGBOS owners |
| Merchandising slot | Display attention, ranking and placement | Product readiness or public transaction approval | TS-COM-004 / Owner |

**Launch order:** a first-time visitor should recognize TeeStock's curatorial taste, explore a small group of approved designs, understand the garment/fit/print facts, and receive an honest next action. `SHOP > SELECTS > CURATED COLLECTION > DESIGN/PRODUCT DETAIL` is the default *conceptual* navigation priority, not a declaration that those exact routes or transactions are deployed. Essentials supports relevant needs; Originals, collabs and Services are separately gated.

**Solo-founder constraint:** a small complete and legally auditable catalog is preferable to thousands of imaginary variants. Decisions to add collections, products, filters, channels and campaign slots must account for founder time to source rights, sample products, coordinate vendors, answer customers and resolve defects. No fixed launch count is invented here.

## 131.1 Example collection decision record (documentation template only)

```yaml
curated_collection_review:
  schema_status: PROPOSED_DOCUMENT_EXAMPLE_ONLY
  source_line: TEESTOCK_SELECTS
  target_interest: REQUIRED_HYPOTHESIS
  why_this_edit_exists: REQUIRED
  candidate_design_refs: REQUIRED
  artwork_rights_evidence: REQUIRED_BEFORE_COMMERCIAL_PUBLICATION
  garment_sample_evidence: REQUIRED_FOR_PHYSICAL_QUALITY_CLAIMS
  intended_channel: NOT_ASSUMED
  copy_and_media_clearance: PENDING_UNTIL_REVIEWED
  editorial_approval: FOUNDER_OR_APPROVED_DELEGATE
  intended_next_action: DISCOVER_OR_CONSENTED_INTEREST_UNLESS_LIVE_GATES_PASS
  sale_authorization: NOT_GRANTED_BY_THIS_TEMPLATE
  decision_reason_and_review_date: REQUIRED
```

This is NOT a runtime schema, existing MGBOS record, ready-to-publish collection, or contract with any rights holder.

# 132. Publication, Visibility, Badge and Transaction Evidence Matrix

| Gate | Minimum proof or authority | Allowed outcome if missing | Forbidden inference |
|---|---|---|---|
| Editorial/design fit | Target audience, curated thesis and reviewer rationale | Private/rejected concept | Curation = license clearance |
| Artwork/media rights | Specific source, holder, valid use/channel/license, revocation/attribution | Unpublished commercial asset | Stock image / AI artwork = transferable IP |
| Real product facts | Garment composition, fit, sizing, method, image/photo provenance | Clear concept-only labeling or hold | Mockup = tested physical garment |
| Sample/production QC | Real sample/print durability and verified vendor evidence | No physical-quality claim | Candidate supplier = confirmed capability |
| Pricing and margin | Approved cost inputs, royalties, fees, taxes, returns, contribution assumptions | No binding price | Product card exists = viable margin |
| Accurate public content | Rights-safe images, valid category/collection, accessible page and policies | Internal-only or limited informational content | Visible page = available stock |
| SKU availability | Real inventory or validated production capacity and allocations | No saleable availability claim | Virtual catalog combinations = stocked SKU |
| Payment/order release | Authorized MGBOS financial/order flows, security, refunds/support and explicit release | No cart/payment or real order creation | Checkout route = working payments |
| Bestseller/scarcity/novelty badges | Real deduplicated sales, actual stock and active time-window/rights evidence | Omit badge | Fake scarcity is marketing license |
| Post-sale outcomes | QC, fulfillment, returns, reconciled actual cost and payment | No fulfilled/contribution claim | Paid order = profitable/fulfilled order |

## 132.1 Release states are separate dimensions

A candidate may be approved for editorial use but blocked legally; rights-cleared but untested physically; publishable as an informational collection while not orderable; or orderable only under a separately authorized commercial channel. This matrix is a *business/documentation classification*, not an approved state machine, schema migration, UI implementation or substitute for actual operating evidence.

**UI guard:** a no-payment interest form must be clearly labeled and consent-based; it cannot reserve inventory or masquerade as a checkout. Never show fabricated delivery promises, limited stock, reviews, verified-seller symbols, discount history, or fake SKU counts to fill an empty design layout.

# 133. Governance, AI Boundaries and Downstream Reconciliation

```yaml
catalog_merchandising_curated_first:
  document_id: TS-COM-004
  version: "2.0"
  primary_strategy: CURATED_DESIGN_APPAREL
  primary_catalog_line: TEESTOCK_SELECTS
  supporting_catalog_line: TEESTOCK_ESSENTIALS
  originals: OWNED_IP_SEPARATE_GOVERNANCE
  services: SECONDARY_CONDITIONAL
  four_business_domains: RETAINED
  brand_catalog_and_navigation_authorities: DISTINCT
  publication_vs_transaction: DISTINCT
  live_checkout: NOT_AUTHORIZED_BY_THIS_DOCUMENT
  payment_authorization: NONE
  production_readiness: NOT_ASSERTED
  schema_migration_authorization: NONE
  deployment_authorization: NONE
  ai_may:
    - PROPOSE_CURATED_COLLECTIONS_FOR_REVIEW
    - ASSIST_TAG_NORMALIZATION_AND_DUPLICATE_DISCOVERY
    - DRAFT_RIGHTS_SAFE_COPY_USING_VERIFIED_FACTS
    - RECOMMEND_MANUAL_MERCHANDISING_PRIORITY
    - SUMMARIZE_REAL_CONSENTED_DISCOVERY_SIGNALS
  ai_must_not:
    - GRANT_LICENSES_OR_INFER_IP_OWNERSHIP
    - FABRICATE_BADGES_REVIEWS_PRODUCT_FACTS_STOCK_OR_SHIPPING
    - TREAT_WISHLIST_OR_INTEREST_AS_PAID_ORDERS
    - SET_BINDING_PRICES_OR_ACCEPT_ORDERS
    - OVERRIDE_LICENSE_EXPIRY_OR_AVAILABILITY_TRUTH
    - ACTIVATE_EXTERNAL_MARKETPLACE_OR_CHECKOUT
    - ADD_NEW_MGBOS_TABLES_FROM_CATALOG_CONCEPTS
```

| Matter | Owning authority | Required reconciliation |
|---|---|---|
| Business focus | TS-FND-001, DEC-TS-2026-012 | Primary curated-design-first, not equal Service promotion |
| Master brand and source-line hierarchy | TS-BRD-001/002 | Selects lead; Essentials support; Originals distinct |
| Commerce strategy | TS-COM-001 v2.0 | Commerce/retail priority and stage gates |
| Selects curation | TS-COM-002 v2.0 | Approved design, source/IP/assortment evidence |
| Catalog structure and display | TS-COM-004 (this document) | Collection, category, edit, ranking, badges, SEO and publishing |
| Product taxonomy | TS-COM-005 | Product family/attributes; do not duplicate ownership |
| Artwork law and evidence | TS-LEG-001 | Use-specific rights, expiry, royalty and source proof |
| Website IA | TS-TEC-002 v2.0 | Public navigation priorities and route semantics |
| CX/product acceptance | MGBOS TeeStock customer-platform CX R1 and canonical PRD | PLP/PDP/cart state, accessibility and acceptance testing |
| Inventory, QC, costs, payments and orders | MGBOS and finance/operations domain owners | Exact runtime facts, organization boundaries, release gates |
| Q4 operating-spine priority | TS-RDM-003 and approved operational pilot | Business/Custom engineering validation remains separate from primary TeeStock brand |

**Governance note:** a merchandising edit is not a schema change; an approved design is not licensed merely by being featured; a catalog item is not in physical stock; a page layout is not proof of sale. Resolve contradictory downstream documents in their own packages rather than silently changing another authority here.

# 134. Adoption and Independent Documentation QA Gates

- [ ] Reconfirm PR #85 HEAD and source Git blob before creating a candidate; fail closed on drift.
- [ ] Preserve all 130 original numbered headings and original substantive body lines in order; no silent historical loss.
- [ ] Confirm parsable YAML with TS-COM-004@2.0, original category/business, source references and a unique canonical ID.
- [ ] Confirm new sections 131–134 are numbered, complete and are not accidentally inside a code fence.
- [ ] Verify first-screen Selects discovery, small catalog, product truth, meaningful category/collection distinctions and reachable support.
- [ ] Verify artwork license gates, sample QC, verified availability, scarcity badges, pricing and the no-checkout boundary.
- [ ] Confirm correct authority of TS-COM-001/002/005, TS-LEG-001, TS-TEC-002 and the CX owners.
- [ ] Run governance/layout/reference checks, `git diff --check`, and new exact-HEAD hosted PR CI.
- [ ] Obtain independent exact-commit and exact-blob review before merging PR #85.

The checklist is a **future acceptance requirement**; it does not attest that customer research, real artwork licenses, physical samples, vendor integration, accessibility acceptance or checkout readiness tests have run. No product was published, paid, reserved or shipped by authoring this document.

**Authorship baseline:** PR #85 HEAD `5356bed33e87428eba911affa33b66b718d87041`, TS-COM-004 source Git blob `f48da0b6b5615afa3d91c8926cb156409d73421f`, reviewed 2026-10-20. The baseline is immutable authoring provenance; a later PR HEAD requires fresh validation and must not be silently substituted.
