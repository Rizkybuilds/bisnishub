---
title: "TeeStock Selects"
document_id: "TS-COM-002"
version: "1.0"
status: "CANONICAL"
category: "commerce"
business: "teestock"
last_updated: "2026-09-28"
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
  - "TS-COM-001"
---

# TeeStock Selects v1.0

> **Canonical TeeStock Selects Strategy**  
> Dokumen ini mendefinisikan fungsi, positioning, sourcing, curation, assortment, economics, IP classification, lifecycle, merchandising, experimentation, dan peran TeeStock Selects sebagai consumer commerce line sekaligus market-intelligence engine bagi ecosystem TeeStock.

---

# 1. Purpose

TeeStock Selects menjawab:

> **Bagaimana TeeStock dapat menawarkan graphic apparel yang beragam tanpa harus menciptakan seluruh intellectual property secara internal?**

Selects memungkinkan TeeStock:

- mengkurasi artwork,
- menguji banyak creative territories,
- menemukan demand,
- menghasilkan revenue,
- membangun consumer relationship,
- dan memberikan data untuk pengembangan TeeStock Originals.

Canonical principle:

> **We curate it.**

---

# 2. Canonical Definition

> **TeeStock Selects adalah curated graphic apparel line yang menggabungkan artwork terpilih dengan product standard, production, merchandising, dan customer experience TeeStock.**

Selects bukan:

- open marketplace,
- dumping ground untuk semua desain,
- TeeStock Originals,
- creator marketplace tanpa kurasi.

---

# 3. Strategic Role

Selects memiliki empat fungsi utama:

```text
REVENUE
+
CURATION
+
DISCOVERY
+
MARKET INTELLIGENCE
```

---

# 4. Revenue Role

Selects menjual finished consumer product.

Canonical commercial flow:

```text
ARTWORK
↓
PRODUCT
↓
TEEStock CURATION
↓
PRODUCTION
↓
COMMERCE
↓
CUSTOMER
```

TeeStock memperoleh value dari:

- product margin,
- curation,
- production,
- commerce,
- fulfillment.

---

# 5. Curation Role

Selects bukan katalog terbuka.

Setiap artwork harus melewati:

```text
SOURCE CHECK
↓
IP CHECK
↓
CREATIVE REVIEW
↓
PRODUCT FIT
↓
COMMERCIAL REVIEW
↓
APPROVAL
```

Tidak semua artwork yang legal otomatis layak dijual.

---

# 6. Discovery Role

Selects dapat menguji banyak territory dengan risiko lebih rendah dibanding membangun Independent Label.

Examples:

```text
COFFEE
CODING
CATS
LOCAL CULTURE
MOTORCYCLE
OUTDOOR
BOOKS
HUMOR
CREATIVE WORK
```

Tujuan bukan membuat brand untuk setiap niche.

Tujuan:

> memahami apa yang benar-benar menarik perhatian dan menghasilkan pembelian.

---

# 7. Market Intelligence Role

Data Selects harus mampu menjawab:

- design themes apa yang menarik traffic,
- niche mana yang convert,
- artwork mana yang menghasilkan repeat behavior,
- audience mana yang responsif,
- price point mana yang diterima,
- combination product/design mana yang kuat.

---

# 8. Selects → Originals Relationship

Canonical relationship:

```text
SELECTS
We curate it.

↓

MARKET DATA

↓

ORIGINALS
We create it.
```

Selects dapat menjadi signal source untuk Originals.

Bukan content source yang otomatis disalin.

---

# 9. Example Discovery Loop

```text
Multiple self-improvement designs
↓
Strong conversion
↓
Repeat purchase
↓
Organic sharing
↓
Audience pattern
↓
Originals concept exploration
↓
Possible brand incubation
```

Output akhirnya mungkin menjadi:

```text
DO YOUR BEST
```

Tetapi hanya setelah melalui Originals incubation.

---

# 10. Selects Is Not Originals

Critical distinction:

```text
SELECTS
TeeStock curates the work.

ORIGINALS
TeeStock creates and owns the IP.
```

Jika TeeStock membeli full ownership sebuah commissioned artwork, artwork tersebut **dapat** memenuhi syarat sebagai Internal IP.

Namun keputusan untuk masuk Originals tetap terpisah dari ownership saja.

---

# 11. Selects Brand Positioning

Selects harus terasa seperti:

> **graphic apparel yang dipilih TeeStock, bukan desain random yang ditempel di kaos.**

Desired perception:

```text
MANY POSSIBILITIES
+
ONE QUALITY STANDARD
+
ONE CURATION STANDARD
```

---

# 12. Consumer Proposition

Customer benefit:

> Lo bisa menemukan graphic apparel dari berbagai interest tanpa harus mengorbankan standar produk.

Possible internal proposition:

> **Different graphics. One TeeStock standard.**

Bukan final tagline wajib.

---

# 13. Product Architecture

Canonical relationship:

```text
TEEStock SELECTS
│
├── Product Family
│   ├── T-Shirt
│   ├── Hoodie
│   └── Other Apparel
│
├── Base Product
│
├── Artwork
│
├── Design Placement
│
├── Variant
│
└── SKU
```

---

# 14. Product vs Artwork

Product dan artwork tidak boleh disamakan.

Example:

```text
PRODUCT
Heavyweight Tee

ARTWORK
Coffee Before Everything
```

Artwork dapat diterapkan ke lebih dari satu Product jika commercial logic membenarkan.

---

# 15. Artwork Entity

Setiap artwork harus memiliki record sendiri.

Minimum metadata:

```text
Artwork ID
Title
Creator / Source
IP Owner
License Type
License Scope
Commercial Rights
Territory
Expiry if any
Royalty if any
Category
Tags
Status
Master File
```

---

# 16. Artwork Source Types

Canonical source classifications:

```text
LICENSED
COMMISSIONED
CREATOR-SUBMITTED
COLLABORATION
TEEStock-OWNED
```

Namun TeeStock-owned artwork belum otomatis menjadi Originals.

---

# 17. Licensed Artwork

Artwork dari source eksternal berdasarkan license.

Sebelum digunakan, TeeStock harus mengetahui:

- commercial usage rights,
- print-on-product rights,
- modification rights,
- resale limitations,
- quantity limits,
- geographical restrictions,
- attribution requirements.

---

# 18. Commissioned Artwork

Artwork yang dibuat freelancer/artist berdasarkan brief TeeStock.

Contract harus menjelaskan:

```text
USAGE RIGHTS
OWNERSHIP
EXCLUSIVITY
MODIFICATION RIGHTS
ATTRIBUTION
PAYMENT
```

Jangan menggunakan assumption:

> sudah bayar berarti otomatis memiliki seluruh IP.

---

# 19. Creator-Submitted Artwork

Creator mengirim karya melalui Creator Program.

Possible model:

```text
CREATOR OWNS IP
+
TEEStock RECEIVES COMMERCIAL LICENSE
+
CREATOR RECEIVES ROYALTY
```

Exact arrangement bergantung agreement.

---

# 20. Collaboration Artwork

Artwork dibuat bersama pihak eksternal.

Classification harus mengikuti contract.

Display dapat berupa:

```text
TeeStock × Artist
```

atau bentuk lain sesuai collaboration architecture.

---

# 21. TeeStock-Owned Artwork

Artwork yang secara legal dimiliki TeeStock dapat digunakan di Selects.

Namun jika memiliki:

- strong narrative,
- cohesive worldview,
- long-term creative territory,

dapat dipertimbangkan masuk Originals.

---

# 22. Source Approval Rule

Tidak ada artwork yang dapat dipublish tanpa:

```text
SOURCE VERIFIED
+
RIGHTS VERIFIED
+
MASTER FILE AVAILABLE
+
COMMERCIAL APPROVAL
```

---

# 23. Curation Philosophy

Curation bukan:

> apa yang founder suka.

Curation adalah combination:

```text
TASTE
+
AUDIENCE RELEVANCE
+
PRODUCT FIT
+
LEGAL SAFETY
+
COMMERCIAL LOGIC
```

---

# 24. Curation Framework

Setiap artwork dapat dievaluasi berdasarkan:

```text
VISUAL STRENGTH
MESSAGE STRENGTH
AUDIENCE CLARITY
PRODUCT COMPATIBILITY
DISTINCTIVENESS
IP SAFETY
COMMERCIAL POTENTIAL
```

Tidak wajib menggunakan numeric score.

Decision dapat berupa:

```text
APPROVE
TEST
REVISE
REJECT
```

---

# 25. Visual Strength

Artwork harus:

- terbaca,
- mempunyai hierarchy,
- bekerja pada garment,
- mempunyai enough detail untuk production method.

Artwork yang terlihat bagus di layar belum tentu bagus di garment.

---

# 26. Message Strength

Jika artwork menggunakan wording:

- harus mudah dipahami oleh intended audience,
- tidak terasa generic tanpa alasan,
- tidak misleading,
- tidak melanggar IP.

---

# 27. Audience Clarity

Setiap artwork idealnya mempunyai audience hypothesis.

Example:

```text
Artwork:
Code. Coffee. Repeat.

Audience:
developers / programmers
```

Bukan:

```text
Audience:
everyone
```

---

# 28. Product Compatibility

Artwork harus dinilai terhadap:

- garment color,
- garment fit,
- print area,
- production method,
- cost.

Tidak semua artwork cocok untuk semua garment.

---

# 29. Distinctiveness

Selects harus menghindari catalog yang terlihat seperti:

> asset marketplace langsung ditempel tanpa judgment.

TeeStock harus tetap memiliki taste.

---

# 30. IP Safety

Reject jika:

- menggunakan trademark tanpa hak,
- copyrighted character tanpa license,
- celebrity likeness tanpa hak,
- sports team identity tanpa izin,
- copyrighted quote yang bermasalah,
- terlalu dekat dengan existing brand design.

---

# 31. Commercial Potential

Pertanyaan:

- apakah audience cukup jelas?
- apakah design dapat di-market?
- apakah economics masuk?
- apakah menambah meaningful assortment?

---

# 32. Niche Architecture

Selects dapat mengorganisasi creative territories melalui niche.

Example high-level:

```text
INTEREST
PROFESSION
LIFESTYLE
HUMOR
LOCAL CULTURE
HOBBY
MUSIC / CREATIVE
TECH
OUTDOOR
PERSONALITY
```

Niche bukan brand.

---

# 33. Niche vs Category

Category:

> bentuk produk.

Example:

```text
T-Shirt
Hoodie
```

Niche:

> interest/context.

Example:

```text
Coffee
Coding
Cycling
```

Jangan mencampur kedua taxonomy tersebut.

---

# 34. Niche Depth

Avoid creating hundreds of categories publicly.

Backend can have many tags.

Frontend should surface only meaningful groupings.

---

# 35. Assortment Strategy

Selects assortment should have:

```text
CORE DESIGNS
+
GROWTH DESIGNS
+
TEST DESIGNS
```

---

# 36. Core Design

Artwork dengan:

- repeat demand,
- stable conversion,
- reliable production.

Tetap aktif lebih lama.

---

# 37. Growth Design

Artwork yang menunjukkan positive signal dan layak diberikan:

- more placement,
- more content,
- more distribution.

---

# 38. Test Design

Artwork baru.

Risk exposure harus kecil.

Test Design tidak otomatis mendapat:

- finished inventory,
- campaign budget besar.

---

# 39. Design Lifecycle

```text
SOURCED
↓
REVIEWED
↓
APPROVED
↓
TEST
↓
ACTIVE
↓
CORE / DECLINING
↓
SUNSET
↓
ARCHIVED
```

---

# 40. Design Activation

Sebelum artwork dijual:

```text
RIGHTS COMPLETE
PRODUCT MAPPED
MOCKUP APPROVED
COST CALCULATED
PRODUCT PAGE READY
PRODUCTION TESTED
```

---

# 41. Design Sunset

Artwork dapat dihentikan jika:

- tidak menghasilkan demand,
- license berakhir,
- creator agreement berakhir,
- economics buruk,
- IP risk muncul,
- product quality tidak konsisten,
- catalog terlalu crowded.

---

# 42. Test Philosophy

Selects harus membuat testing murah.

Preferred model:

```text
DESIGN FILE
+
MOCKUP
+
ON-DEMAND PRODUCTION
```

sebelum membuat finished inventory besar.

---

# 43. Minimum Viable Test

Untuk design baru:

- satu base product,
- limited colors,
- limited placements,
- standard pricing.

Jangan menguji terlalu banyak variable bersamaan.

---

# 44. Base Garment Strategy

Selects sebaiknya menggunakan limited standardized garment platform.

Example:

```text
Standard Tee
Heavyweight Tee
Oversized Tee
```

Exact lineup ditentukan melalui Product Taxonomy.

---

# 45. Why Standardized Base Products Matter

Benefits:

```text
LOWER INVENTORY COMPLEXITY
BETTER QC
EASIER SIZING
BETTER PROCUREMENT
FASTER TESTING
```

---

# 46. Garment Color Strategy

Tidak semua artwork tersedia di semua warna.

Color availability ditentukan berdasarkan:

- visual contrast,
- demand,
- SKU complexity.

---

# 47. Placement Strategy

Canonical placement options dapat dibatasi.

Example:

```text
FRONT CENTER
LEFT CHEST
BACK
FRONT + BACK
```

Jangan membuka unlimited placement pada Selects.

Itu lebih cocok Custom.

---

# 48. Production Compatibility

Artwork harus memiliki approved production profile.

Example:

```text
Production Method:
DTF

Max Width:
X

Placement:
Front Center

Color Requirements:
...
```

---

# 49. Production Test

Sebelum artwork menjadi Core, lakukan physical test jika diperlukan.

Evaluate:

- detail retention,
- color,
- wash,
- placement,
- hand feel.

---

# 50. Pricing Architecture

Selects price berasal dari:

```text
BASE PRODUCT
+
DECORATION
+
ARTWORK / RIGHTS COST
+
PACKAGING
+
TRANSACTION COST
+
TARGET CONTRIBUTION
```

Exact formula berada di Pricing Framework.

---

# 51. Royalty-Aware Economics

Jika artwork memiliki royalty:

```text
REVENUE
-
COGS
-
ROYALTY
-
CHANNEL COST
-
VARIABLE COST
=
CONTRIBUTION
```

Royalty tidak boleh dianggap fixed marketing cost jika dihitung per sale.

---

# 52. Pricing Consistency

Jika dua designs mempunyai cost hampir sama, customer-facing pricing sebaiknya sederhana.

Avoid:

```text
Design A Rp119k
Design B Rp121.5k
Design C Rp124.3k
```

tanpa alasan.

---

# 53. Price Tiering

Possible future tiers:

```text
STANDARD SELECT
SPECIAL SELECT
COLLAB SELECT
```

hanya jika cost/value differences nyata.

Tidak perlu digunakan sejak awal.

---

# 54. Inventory Model

Preferred:

```text
BASE GARMENT STOCK
+
PRINT ON DEMAND / DECORATE ON DEMAND
```

untuk sebagian besar Selects.

---

# 55. Finished Goods Stock

Finished stock hanya dibenarkan jika:

- design demand stabil,
- delivery speed materially matters,
- economics membenarkan.

---

# 56. SKU Complexity

Jika:

```text
100 ARTWORK
×
5 SIZES
×
4 COLORS
```

dapat menghasilkan:

```text
2,000 combinations
```

TeeStock tidak boleh memperlakukan semuanya sebagai stocked inventory.

---

# 57. Virtual Assortment vs Physical Inventory

Selects dapat mempunyai:

```text
LARGE VIRTUAL ASSORTMENT
```

dengan:

```text
SMALL PHYSICAL BASE INVENTORY
```

selama production workflow reliable.

Ini salah satu strategic advantages Selects.

---

# 58. Merchandising Strategy

Selects tidak boleh hanya ditampilkan sebagai grid panjang.

Customer harus dibantu menemukan design melalui:

```text
THEME
INTEREST
NEW
POPULAR
EDITORIAL CURATION
```

---

# 59. Curated Edit

TeeStock dapat membuat editorial grouping seperti:

```text
For Coffee People
Made for Builders
Weekend Outdoors
Quiet Humor
```

Curated Edit adalah merchandising construct.

Bukan permanent brand.

---

# 60. Featured Design

Featured placement harus berdasarkan:

- creative relevance,
- campaign,
- performance,
- strategic test.

Tidak harus selalu bestseller.

---

# 61. Design Page vs Product Page

Ideal data architecture:

```text
ARTWORK
+
BASE PRODUCT
=
SELLABLE CONFIGURATION
```

Frontend dapat memilih:

### Model A

Artwork-centric page.

Customer memilih garment.

### Model B

Product-centric page.

Customer membeli predefined combination.

Early stage:

> predefined combinations lebih sederhana.

---

# 62. Search & Tags

Artwork should have useful tags.

Example:

```text
coffee
barista
morning
minimal
typography
```

Tags membantu:

- search,
- recommendation,
- analytics.

---

# 63. Tag Governance

Avoid random synonyms.

Canonical taxonomy harus mengurangi:

```text
coffee
coffees
kopi
coffee-lover
coffee lover
```

sebagai fragmented concept jika bisa dinormalisasi.

---

# 64. Creator Attribution

Jika attribution required atau strategically useful:

```text
Artwork by [Creator]
```

harus tampil secara consistent.

Attribution bukan brand architecture baru.

---

# 65. Creator Profile

Creator dengan beberapa designs dapat memiliki:

```text
Creator Page
```

tanpa memiliki Creator Store independen.

---

# 66. Creator Store Promotion

Creator hanya naik menjadi dedicated Merch/Creator Store jika:

- recurring products,
- audience demand,
- ongoing relationship.

---

# 67. Selects Data Architecture

Setiap sale harus dapat dikaitkan ke:

```text
Artwork
Product
Variant
Creator / Source
Niche
Channel
Customer
Campaign
```

---

# 68. Key Selects Events

Future event examples:

```text
artwork.viewed
artwork.saved
artwork.added_to_cart
artwork.purchased
artwork.returned
```

Exact event design mengikuti Event Model.

---

# 69. Design Performance

Track:

```text
VIEWS
ADD-TO-CART RATE
CONVERSION
UNITS
REVENUE
CONTRIBUTION
RETURN RATE
```

---

# 70. Niche Performance

Aggregate designs by niche to identify:

```text
DEMAND
CONVERSION
CUSTOMER COUNT
REPEAT
MARGIN
```

---

# 71. Signal Interpretation

A high-view, low-sale design can mean:

- interesting visual but weak purchase intent,
- wrong price,
- wrong garment,
- poor product page.

Jangan langsung conclude:

> niche tidak laku.

---

# 72. Low-View, High-Conversion Signal

Could mean:

> strong product with insufficient distribution.

Potential action:

```text
MORE PLACEMENT
MORE CONTENT
MORE TRAFFIC
```

---

# 73. High-Sale, High-Return Signal

Could mean:

> demand exists, but product experience is wrong.

Investigate:

- fit,
- print,
- expectation gap.

---

# 74. Market Intelligence Hierarchy

Selects data should evolve:

```text
ARTWORK SIGNAL
↓
NICHE SIGNAL
↓
AUDIENCE SIGNAL
↓
BEHAVIOR PATTERN
↓
STRATEGIC INSIGHT
```

---

# 75. Originals Signal Criteria

Potential Originals opportunity may appear when there is repeated evidence around:

```text
BELIEF
IDENTITY
AUDIENCE
AESTHETIC
```

Not merely one successful design.

---

# 76. Example

Suppose several unrelated designs around:

```text
discipline
consistency
starting
self-improvement
```

perform well among similar audience.

This can generate hypothesis:

> there may be an identity territory around healthy personal ambition.

Then Originals team explores concept.

It does **not** copy the Selects designs into a brand.

---

# 77. Design Saturation

Selects should avoid having dozens of designs expressing exactly the same joke/message.

Too much similarity:

- dilutes curation,
- fragments sales,
- makes catalog feel generic.

---

# 78. Design Replacement

A better design may replace a weaker design within the same niche.

Catalog should evolve.

---

# 79. Portfolio Balance

Selects portfolio should balance:

```text
EVERGREEN
+
CURRENT
+
EXPERIMENTAL
```

Avoid making catalog entirely trend-dependent.

---

# 80. Trend Usage

Trend can inform testing.

Do not make trend chasing the core identity.

TeeStock remains curator.

Not meme printer.

---

# 81. Local Culture

Local references may be valuable.

Requirements:

- respectful,
- context-aware,
- legally safe,
- not exploitative.

---

# 82. Humor

Humor can work strongly in graphic apparel.

Avoid:

- lazy plagiarism,
- hate-oriented humor,
- IP violations,
- jokes with short shelf life unless deliberate.

---

# 83. Text-Based Designs

Typography designs must consider:

- readability,
- phrase ownership/IP risk,
- cultural context,
- print scale.

Short wording is not automatically free of rights concerns.

---

# 84. AI-Assisted Artwork

AI may assist concept exploration or production according to relevant legal/ethical policy.

Every final commercial asset still requires:

```text
HUMAN REVIEW
+
IP REVIEW
+
QUALITY REVIEW
```

AI generation method does not automatically establish exclusive ownership.

---

# 85. AI for Curation

AI may help:

- tag artwork,
- cluster themes,
- analyze performance,
- find duplicate concepts.

AI should not be sole approval authority.

---

# 86. AI for Demand Discovery

Future use:

```text
Commerce Data
+
Search Data
+
Social Signals
↓
AI Analysis
↓
Niche Hypothesis
```

Hypothesis tetap harus diuji melalui market behavior.

---

# 87. Selects Content Strategy

Content can highlight:

- artwork story,
- niche,
- product fit,
- creator,
- process.

Avoid making every post:

> BUY THIS SHIRT.

---

# 88. Design Story

Not every Select requires deep story.

Some may simply be:

> a good graphic for a specific interest.

Do not manufacture fake philosophy.

---

# 89. Customer Journey

```text
DISCOVER INTEREST
↓
SEE DESIGN
↓
UNDERSTAND PRODUCT
↓
CHOOSE VARIANT
↓
BUY
↓
RECEIVE
↓
WEAR / SHARE / REPEAT
```

---

# 90. Cross-Sell

Selects buyer can be introduced to:

```text
ESSENTIALS
ORIGINALS
RELATED SELECTS
```

based on genuine relevance.

---

# 91. Selects → Custom

A customer may see Selects and then want:

> desain sendiri.

Route:

```text
SELECTS
↓
TEEStock CUSTOM
```

But Selects designs are not automatically editable for custom use.

IP rights matter.

---

# 92. Returns & Defects

Return reasons should be attributed to both:

```text
ARTWORK / PRINT
```

and:

```text
BASE PRODUCT
```

where relevant.

This separates creative from product-quality issues.

---

# 93. Customer Reviews

Reviews can help identify:

- design appeal,
- print quality,
- fit,
- expectation gaps.

Reviews should remain attached to correct product/artwork context.

---

# 94. Channel Strategy

Not every Select must be sold everywhere.

Marketplace may prioritize:

- proven products,
- clear niches,
- strong thumbnails.

Owned site may carry wider curated range.

---

# 95. Creator Channel

Creator-attributed designs may perform best through creator distribution.

Track channel impact separately from design quality.

---

# 96. Marketplace Test

Marketplace can provide fast behavioral data.

But TeeStock should not use marketplace rankings as sole truth because:

- pricing,
- traffic,
- algorithm,
- review count

affect performance.

---

# 97. Success Metrics

Selects should be evaluated across four levels.

## Commercial

```text
Revenue
Contribution
AOV
Units
```

## Product

```text
Conversion
Return
Production Error
```

## Portfolio

```text
Active Designs
Design Concentration
Niche Performance
```

## Intelligence

```text
Validated Signals
Useful Experiments
Originals Opportunities
```

---

# 98. Design Concentration

Monitor whether a few designs generate most sales.

This can be healthy.

But it informs:

- assortment cleanup,
- hero products,
- risk.

---

# 99. Long Tail

Long-tail designs can remain if:

- marginal maintenance cost low,
- no physical inventory risk,
- still relevant.

However huge long-tail can hurt discovery.

---

# 100. Catalog Cleanup

Recommended periodic review:

```text
KEEP
PROMOTE
REWORK
SUNSET
```

for each design.

---

# 101. Sourcing Pipeline

Canonical pipeline:

```text
DISCOVER SOURCE
↓
RIGHTS REVIEW
↓
CREATIVE REVIEW
↓
COMMERCIAL REVIEW
↓
PRODUCT MAPPING
↓
PRODUCTION TEST
↓
PUBLISH
↓
MEASURE
```

---

# 102. Creator Submission Pipeline

```text
SUBMIT
↓
SCREEN
↓
RIGHTS CHECK
↓
CURATION
↓
COMMERCIAL TERMS
↓
PRODUCT TEST
↓
PUBLISH
↓
SALE
↓
ROYALTY
```

---

# 103. License Register

Every licensed asset must be traceable to:

```text
LICENSE RECORD
```

including proof of purchase/agreement where applicable.

This should later live in Legal/IP systems.

---

# 104. Artwork Master File Governance

Master files must be:

- versioned,
- backed up,
- tied to Artwork ID.

Avoid:

```text
design-final-v7-new2.png
```

without canonical asset identity.

---

# 105. Artwork Versioning

If artwork changes materially:

```text
Artwork v1
Artwork v2
```

must remain traceable.

Reason:

- production consistency,
- creator approval,
- IP records.

---

# 106. Quality Standard

Every Select product must meet the same TeeStock minimum standard for:

```text
GARMENT
PRINT
PLACEMENT
QC
PACKING
```

Curation alone cannot compensate for weak physical quality.

---

# 107. TeeStock Selects Promise

Canonical internal promise:

> **Different interests. Different graphics. One TeeStock standard.**

This captures the role of Selects without claiming internal ownership of every artwork.

---

# 108. What Selects Must Not Become

## Open Upload Marketplace

Quality and IP risk become uncontrolled.

## Print Anything Catalog

Destroys curation.

## Copycat Machine

Short-term trend imitation damages trust and legal safety.

## Originals Substitute

External curation is not owned brand-building.

## Inventory Trap

Too many finished SKUs create working-capital risk.

---

# 109. Initial Launch Model

Recommended early Selects model:

```text
LIMITED NICHE SET
+
LIMITED BASE GARMENTS
+
LIMITED COLORS
+
ON-DEMAND DECORATION
```

This maximizes learning while controlling complexity.

---

# 110. Early Assortment Philosophy

Do not launch all possible niche ideas simultaneously.

Use batches.

Example:

```text
BATCH A
5–10 themes

↓

OBSERVE

↓

BATCH B
refine / expand
```

Exact quantity belongs to execution planning.

---

# 111. Expansion Rule

Expand a niche when:

```text
REAL DEMAND
+
MULTIPLE DESIGN OPPORTUNITIES
+
GOOD ECONOMICS
```

exist.

---

# 112. Niche Kill Rule

Reduce or stop niche investment when:

- repeated tests fail,
- traffic exists but no purchase intent,
- economics weak,
- catalog overlap too high.

---

# 113. Selects and Brand Equity

Selects should strengthen perception:

> TeeStock punya taste.

Not:

> TeeStock punya desain sebanyak mungkin.

Curation quality is the equity.

---

# 114. Selects and Originals Equity

Selects builds:

```text
CURATION EQUITY
```

Originals builds:

```text
CREATION + OWNERSHIP EQUITY
```

Both are valuable but different.

---

# 115. MGBOS Entity Mapping

Minimum future entities:

```text
COMMERCE LINE
TeeStock Selects

ARTWORK
Creator / Source
IP Rights

PRODUCT
Base Garment

SELLABLE PRODUCT
Artwork × Product

VARIANT
Color / Size

SKU
Specific stock unit
```

---

# 116. MGBOS Decision Support

Future system should help answer:

```text
Which designs should be promoted?

Which niches should be expanded?

Which designs should be sunset?

Which signals may inform Originals?
```

System recommends.

Human/defined policy decides strategic creative moves.

---

# 117. Current State vs Future State

## Early

```text
Manual sourcing
Manual review
Manual merchandising
Basic analytics
```

## Mature

```text
Structured artwork registry
Rights management
Performance analytics
AI-assisted discovery
Automated royalty
Dynamic merchandising
```

---

# 118. Canonical Selects Summary

```text
TEEStock SELECTS
= Curated graphic apparel

INPUT
External / creator / commissioned / licensed artwork

TEEStock ADDS
Curation
Product standard
Production
Commerce
Fulfillment

OUTPUT
Consumer product

STRATEGIC OUTPUT
Market intelligence
```

---

# 119. Canonical Selects Principles

```text
CURATE BEFORE PUBLISH.

RIGHTS BEFORE SALES.

TEST BEFORE INVENTORY.

QUALITY BEFORE CATALOG SIZE.

DATA BEFORE ASSUMPTION.

SIGNAL BEFORE ORIGINALS.

VARIETY WITHOUT RANDOMNESS.
```

---

# 120. Dependency

Dokumen berikut harus mengikuti TeeStock Selects Strategy:

1. `03-commerce/catalog-merchandising-system.md`
2. `03-commerce/product-taxonomy.md`
3. `05-originals/originals-master-plan.md`
4. `06-programs/creator-program.md`
5. `07-operations/production-system.md`
6. `07-operations/inventory-system.md`
7. `08-finance/unit-economics.md`
8. `08-finance/pricing-framework.md`
9. `12-legal-ip/design-licensing-policy.md`
10. `12-legal-ip/creator-agreement-framework.md`
11. `11-data-mgbos/canonical-data-model.md`
12. `13-metrics-experiments/experimentation-framework.md`

Tidak ada artwork yang boleh diperlakukan sebagai TeeStock Original hanya karena berhasil dijual melalui Selects. Ownership, creative origin, dan brand classification tetap harus mengikuti canonical architecture TeeStock.