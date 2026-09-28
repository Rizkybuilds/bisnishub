---
title: "TeeStock Catalog & Merchandising System"
document_id: "TS-COM-004"
version: "1.0"
status: "CANONICAL"
category: "commerce"
business: "teestock"
last_updated: "2026-09-28"
depends_on:
  - "TS-FND-001"
  - "TS-FND-002"
  - "TS-BRD-002"
  - "TS-BRD-004"
  - "TS-COM-001"
  - "TS-COM-002"
  - "TS-COM-003"
---

# TeeStock Catalog & Merchandising System v1.0

> **Canonical Catalog & Merchandising Framework**  
> Dokumen ini mendefinisikan bagaimana seluruh produk TeeStock disusun, dikategorikan, ditemukan, dibandingkan, ditampilkan, diprioritaskan, dipromosikan, diuji, dan dihentikan di dalam Commerce tanpa mengubah struktur bisnis canonical TeeStock.

---

# 1. Purpose

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

Canonical distinction:

```text id="2uc7mv"
CATEGORY
helps find product types.

COLLECTION
groups products through concept or release.
```

---

# 15. Curated Edit

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

Product hanya mendapat:

```text id="hgzjbx"
BEST SELLER
```

berdasarkan defined sales threshold/window.

Threshold detail ditentukan di merchandising operations.

---

# 35. New Badge

`NEW` hanya diberikan kepada product selama defined launch window.

Setelah window selesai:

badge otomatis/manual dihapus.

---

# 36. Limited Badge

`LIMITED` hanya digunakan jika:

```text id="8hfqtt"
QUANTITY LIMITED
or
SALE WINDOW LIMITED
```

secara nyata.

---

# 37. Exclusive Badge

`EXCLUSIVE` hanya digunakan jika TeeStock memiliki genuine exclusive rights/availability.

Tidak digunakan sekadar untuk meningkatkan conversion.

---

# 38. Low Stock Badge

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

Storefront availability must derive from inventory/production truth.

Catalog should not manually claim availability contrary to backend.

---

# 98. Catalog and IP

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

1. `03-commerce/product-taxonomy.md`
2. `09-marketing/channel-strategy.md`
3. `09-marketing/go-to-market.md`
4. `10-product-tech/website-information-architecture.md`
5. `10-product-tech/commerce-platform.md`
6. `11-data-mgbos/canonical-data-model.md`
7. `11-data-mgbos/event-model.md`
8. `13-metrics-experiments/kpi-framework.md`
9. `13-metrics-experiments/experimentation-framework.md`

Catalog presentation boleh berubah sesuai channel dan campaign, tetapi Product identity, ownership, taxonomy, pricing truth, dan availability harus tetap berasal dari canonical system.