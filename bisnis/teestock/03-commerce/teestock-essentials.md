---
title: "TeeStock Essentials"
date: "2026-09-28"
bisnis: teestock
kategori: operasional
status: active
tags:
  - bisnis/teestock
  - kategori/operasional
  - teestock/canonical
  - teestock/commerce
document_id: "TS-COM-003"
version: "1.0"
category: "commerce"
business: "teestock"
last_updated: "2026-09-28"
path: "03-commerce/teestock-essentials.md"
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


# TeeStock Essentials v1.0

> [!abstract] **Canonical TeeStock Essentials Strategy  **
> Dokumen ini mendefinisikan positioning, product architecture, garment platform, fit system, quality standard, assortment, SKU strategy, inventory model, pricing logic, lifecycle, dan hubungan TeeStock Essentials dengan Selects, Custom, Merch, Originals, serta TeeStock Supply.
>
> [!info] **Dependencies & Data Flow (SSOT)**
> [[bisnis/teestock/00-foundation/teestock-master-definition|TS-FND-001: TeeStock Master Definition]] • [[bisnis/teestock/00-foundation/glossary|TS-FND-002: TeeStock Glossary]] • [[bisnis/teestock/01-strategy/business-thesis|TS-STR-001: TeeStock Business Thesis]] • [[bisnis/teestock/01-strategy/business-model|TS-STR-002: TeeStock Business Model]] • [[bisnis/teestock/01-strategy/ecosystem-architecture|TS-STR-003: TeeStock Ecosystem Architecture]] • [[bisnis/teestock/01-strategy/growth-strategy|TS-STR-004: TeeStock Growth Strategy]] • [[bisnis/teestock/02-brand/master-brand-strategy|TS-BRD-001: TeeStock Master Brand Strategy]] • [[bisnis/teestock/02-brand/brand-architecture|TS-BRD-002: TeeStock Brand Architecture]] • [[bisnis/teestock/02-brand/brand-identity-system|TS-BRD-003: TeeStock Brand Identity System]] • [[bisnis/teestock/02-brand/voice-and-copy-system|TS-BRD-004: TeeStock Voice & Copy System]] • [[bisnis/teestock/03-commerce/commerce-overview|TS-COM-001: TeeStock Commerce Overview]]


---

# 1. Purpose

TeeStock Essentials menjawab:

> **Apa consumer apparel fundamental yang seharusnya selalu bisa dipercaya dari TeeStock?**

Essentials bukan sekadar:

> kaos polos.

Essentials adalah:

> **standardized consumer apparel platform yang mengutamakan fit, material, consistency, dan everyday usability.**

Canonical principle:

> **We select the fundamentals.**

---

# 2. Canonical Definition

> **TeeStock Essentials adalah consumer-facing line untuk apparel fundamentals yang dipilih, distandardisasi, dan dijual TeeStock berdasarkan kualitas, fit, material, dan repeatability.**

Examples:

```text
Essential Tee
Heavyweight Tee
Oversized Tee
Long Sleeve Tee
Crewneck
Hoodie
```

Tidak semua category harus aktif sejak awal.

---

# 3. Strategic Role

Essentials memiliki lima fungsi utama:

```text
CONSUMER PRODUCT
+
QUALITY BENCHMARK
+
BASE GARMENT PLATFORM
+
INVENTORY FOUNDATION
+
PROCUREMENT LEVERAGE
```

---

# 4. Consumer Product Role

Essentials harus dapat berdiri sendiri sebagai product yang layak dibeli tanpa artwork.

Customer membelinya karena:

- fit,
- material,
- feel,
- color,
- versatility,
- consistency.

Artinya:

> blank garment tidak boleh diperlakukan hanya sebagai bahan baku produksi.

Ia harus cukup baik untuk menjadi finished consumer product.

---

# 5. Quality Benchmark Role

Essentials menjadi physical standard TeeStock.

Jika customer membeli TeeStock Essentials, mereka harus dapat memahami:

> seperti apa kualitas garment yang dianggap layak oleh TeeStock.

Standar ini kemudian dapat digunakan untuk:

- Selects,
- Custom,
- Merch,
- Originals.

---

# 6. Shared Garment Platform Role

Canonical relationship:

```text
TEEStock ESSENTIALS
        │
        ▼
STANDARDIZED BASE GARMENT
        │
        ├── SELECTS
        ├── CUSTOM
        ├── MERCH
        └── ORIGINALS
```

Satu base garment dapat memiliki beberapa commercial roles.

---

# 7. Why Shared Garment Platform Matters

Jika setiap line menggunakan garment berbeda tanpa alasan:

```text
Selects → Garment A
Custom → Garment B
Merch → Garment C
Originals → Garment D
```

complexity meningkat.

Shared platform memungkinkan:

```text
Garment Platform A
↓
Selects
Custom
Merch
Originals
```

Benefits:

- lebih sedikit SKU,
- purchasing lebih terkonsolidasi,
- QC lebih mudah,
- sizing lebih konsisten,
- reorder lebih sederhana,
- procurement leverage meningkat.

---

# 8. Essentials ≠ Supply

Critical distinction:

```text
TEEStock ESSENTIALS
= Consumer apparel

TEEStock SUPPLY
= B2B apparel supply
```

Benda fisiknya dapat berasal dari product yang sama.

Commercial context berbeda.

---

# 9. Essentials Customer

Target utama:

```text
CONSUMER
```

Membeli untuk:

- personal wear,
- layering,
- daily use,
- minimalist wardrobe,
- styling foundation.

---

# 10. Supply Customer

TeeStock Supply menargetkan:

```text
BUSINESS
BRAND
PRINTER
RESELLER
PRODUCTION VENDOR
```

Membeli berdasarkan:

- quantity,
- specification,
- availability,
- wholesale pricing.

---

# 11. Same Product, Different Commercial Layer

Example:

```text
Base Garment:
Heavyweight Tee 24s
```

Consumer context:

```text
TeeStock Essentials
Heavyweight Tee
```

B2B context:

```text
TeeStock Supply
Heavyweight Blank Tee
```

Backend inventory dapat sama.

Frontend proposition berbeda.

---

# 12. Essentials Positioning

Essentials harus berada pada territory:

```text
DEPENDABLE
CLEAN
VERSATILE
ACCESSIBLE
WELL-SPECIFIED
```

Bukan:

```text
CHEAP BASIC
```

dan bukan:

```text
LUXURY BASIC
```

---

# 13. Consumer Proposition

Internal proposition:

> **The basics TeeStock trusts enough to build everything else on.**

Possible customer-facing direction:

> **Everyday apparel with a clear standard.**

Bukan final tagline wajib.

---

# 14. Essentials Design Philosophy

Essentials harus sederhana secara visual.

Value berasal dari:

```text
FIT
MATERIAL
CONSTRUCTION
COLOR
CONSISTENCY
```

Bukan graphic decoration.

---

# 15. Product Hierarchy

Canonical product hierarchy:

```text
TEEStock ESSENTIALS
│
├── Product Family
│
├── Product Model
│
├── Fit
│
├── Material
│
├── Color
│
├── Size
│
└── SKU
```

---

# 16. Product Family

Examples:

```text
T-SHIRT
LONG SLEEVE
HOODIE
CREWNECK
TOTE
```

Product family harus menggambarkan physical category.

---

# 17. Product Model

Contoh:

```text
Essential Tee
Heavyweight Tee
Oversized Tee
```

Model harus memiliki meaningful distinction.

Jangan membuat beberapa model dengan perbedaan yang sulit dipahami customer.

---

# 18. Product Differentiation Rule

Model baru hanya dibuat jika berbeda secara nyata dalam satu atau lebih:

```text
FIT
WEIGHT
FABRIC
CONSTRUCTION
USE CASE
```

Jika perbedaannya hanya naming:

> jangan buat model baru.

---

# 19. Fit Architecture

Canonical fit classes dapat menggunakan:

```text
REGULAR
RELAXED
OVERSIZED
```

Jika product membutuhkan kategori berbeda, harus didefinisikan secara eksplisit.

---

# 20. Regular Fit

Karakter:

- conventional,
- balanced,
- easy to wear.

Tidak terlalu ketat.

Tidak terlalu longgar.

---

# 21. Relaxed Fit

Karakter:

- more room,
- casual,
- contemporary.

---

# 22. Oversized Fit

Karakter:

- intentionally wider,
- dropped shoulder where applicable,
- more volume.

Oversized bukan:

> customer sekadar membeli size lebih besar.

Pattern harus memang dirancang oversized.

---

# 23. Fit Consistency

Size label yang sama harus mempunyai expectation yang stabil.

Jika product berbeda fit:

customer harus diinformasikan.

Example:

```text
Essential Tee M
≠
Oversized Tee M
```

---

# 24. Size Architecture

Canonical sizes dapat mengikuti:

```text
XS
S
M
L
XL
XXL
```

atau assortment aktual.

Tidak semua size harus tersedia pada semua product.

---

# 25. Size Chart Governance

Setiap Product Model harus memiliki canonical measurement chart.

Minimum:

```text
BODY WIDTH
BODY LENGTH
```

Additional where relevant:

```text
SHOULDER
SLEEVE
```

---

# 26. Measurement Tolerance

Garment manufacturing memiliki tolerance.

Tolerance harus ditentukan per supplier/product.

Jangan memberikan impression bahwa semua unit identik sampai millimeter.

---

# 27. Fit Communication

Consumer-facing page harus menjelaskan:

```text
FIT TYPE
MODEL REFERENCE
SIZE CHART
FIT RECOMMENDATION
```

jika tersedia.

---

# 28. Material Architecture

Material record harus memuat:

```text
FIBER
FABRIC TYPE
WEIGHT
KNIT / WEAVE
FINISH
```

sesuai relevance.

---

# 29. GSM

GSM dapat digunakan sebagai technical descriptor.

Namun customer-facing copy harus menjelaskan benefit.

Example:

```text
240 GSM
→ feel lebih tebal dan lebih structured
```

Tidak boleh mengasumsikan:

> GSM lebih tinggi selalu berarti lebih baik.

---

# 30. Fabric Quality

Quality tidak ditentukan hanya oleh:

```text
GSM
```

Tetapi combination:

```text
FIBER
YARN
KNIT
FINISH
CONSTRUCTION
CONSISTENCY
```

---

# 31. Material Naming

Avoid misleading terminology.

Jika cotton blend:

jangan disebut:

```text
100% cotton
```

Jika supplier specification tidak pasti:

jangan membuat claim detail yang belum diverifikasi.

---

# 32. Construction Standard

Essentials dapat memiliki standards seperti:

- collar width,
- rib quality,
- stitching,
- seam consistency,
- body construction,
- shrinkage tolerance.

Exact specifications berada di product specification.

---

# 33. Garment Platform

Setiap approved base garment harus memiliki:

```text
GARMENT PLATFORM ID
```

Example conceptual:

```text
TS-GRM-TEE-HW01
```

Garment Platform dapat digunakan oleh banyak selling contexts.

---

# 34. Garment Platform Record

Minimum metadata:

```text
Platform ID
Supplier
Product Source
Material
Fit
GSM
Construction
Colors
Sizes
Cost
Lead Time
QC Standard
Status
```

---

# 35. Approved Garment Status

Possible lifecycle:

```text
TESTING
APPROVED
CORE
RESTRICTED
SUNSET
ARCHIVED
```

---

# 36. Testing

Garment baru harus melalui evaluation sebelum menjadi core.

Possible tests:

```text
FIT
HAND FEEL
SHRINKAGE
COLOR
WASH
DECORATION COMPATIBILITY
SUPPLY CONSISTENCY
```

---

# 37. Decoration Compatibility

Garment Platform harus mengetahui compatibility dengan:

- DTF,
- screen print,
- embroidery,
- other methods.

Karena shared platform juga digunakan oleh Services dan Originals.

---

# 38. Wash Testing

Physical testing sebaiknya mengevaluasi:

- shrinkage,
- color stability,
- garment shape,
- collar,
- print compatibility.

Testing harus menggunakan repeatable procedure.

---

# 39. Quality Tiering

TeeStock sebaiknya tidak menggunakan terlalu banyak artificial tiers.

Jika dibutuhkan, tier hanya dibuat jika product mempunyai real functional distinction.

Example:

```text
CORE
HEAVYWEIGHT
SPECIALTY
```

Bukan:

```text
BASIC
PREMIUM
SUPER PREMIUM
ULTRA PREMIUM
```

tanpa definisi.

---

# 40. Essentials Core Standard

Setiap active Essentials product harus memenuhi minimum:

```text
FIT ACCEPTABLE
MATERIAL VERIFIED
CONSTRUCTION ACCEPTABLE
SUPPLY RELIABLE
ECONOMICS VIABLE
CUSTOMER INFORMATION COMPLETE
```

---

# 41. Assortment Philosophy

Essentials adalah:

> **narrower but deeper**

dibanding Selects.

Selects bisa mempunyai banyak creative variations.

Essentials harus memiliki sedikit product model yang kuat.

---

# 42. Core Assortment

Core assortment meliputi products dengan:

- repeat demand,
- stable sourcing,
- strong multi-use potential.

---

# 43. Experimental Assortment

Product baru dapat diuji sebagai:

```text
TEST
```

dengan:

- limited color,
- limited size,
- limited inventory.

---

# 44. Color Architecture

Color strategy harus dibagi:

```text
CORE COLORS
SEASONAL COLORS
TEST COLORS
```

---

# 45. Core Colors

Warna yang:

- versatile,
- mudah dikombinasikan,
- demand stabil.

Example conceptual:

```text
Black
White
Natural
Grey
```

Actual colors harus mengikuti product strategy.

---

# 46. Seasonal Colors

Digunakan untuk memberikan freshness tanpa menciptakan product model baru.

---

# 47. Test Colors

New color diuji dalam inventory kecil.

---

# 48. Color Standardization

Satu nama warna harus mempunyai reference yang jelas.

Avoid:

```text
Black
Deep Black
Dark Black
Jet Black
```

jika sebenarnya sama.

---

# 49. SKU Architecture

Canonical SKU derives from:

```text
PRODUCT
+
COLOR
+
SIZE
```

Example:

```text
TS-ESS-HWT-BLK-L
```

Exact SKU convention ditentukan di:

```text
11-data-mgbos/sku-and-id-convention.md
```

---

# 50. SKU Discipline

SKU baru memiliki carrying cost:

- inventory,
- warehouse,
- data,
- replenishment,
- counting,
- reporting.

Canonical rule:

> **SKU expansion requires demand justification.**

---

# 51. Size-Color Matrix

Tidak perlu menyediakan semua size dalam semua color jika demand tidak membenarkan.

Use data.

Example:

```text
CORE COLOR
→ deeper size availability

TEST COLOR
→ narrower availability
```

---

# 52. Inventory Philosophy

Essentials berbeda dari Selects karena finished product adalah base garment itu sendiri.

Karena itu inventory lebih natural disimpan.

Preferred:

```text
DEEPER STOCK
ON PROVEN CORE PRODUCTS
```

---

# 53. Inventory Layers

Essentials inventory dapat dibagi:

```text
CORE STOCK
BUFFER STOCK
TEST STOCK
```

---

# 54. Core Stock

For high-frequency variants.

---

# 55. Buffer Stock

Digunakan untuk melindungi dari:

- supplier lead time,
- demand variability.

---

# 56. Test Stock

Inventory kecil untuk product/color baru.

---

# 57. Inventory Risk

Main risks:

```text
SIZE IMBALANCE
COLOR IMBALANCE
SUPPLIER CHANGE
SLOW MOVERS
DEAD STOCK
```

---

# 58. Replenishment Logic

Future replenishment harus mempertimbangkan:

```text
SALES VELOCITY
CURRENT STOCK
SUPPLIER LEAD TIME
SAFETY STOCK
UPCOMING DEMAND
```

---

# 59. ABC Inventory Concept

Mature operation dapat menggunakan:

```text
A
High velocity

B
Moderate velocity

C
Low velocity
```

Replenishment policy dapat berbeda.

---

# 60. Shared Inventory

Garment inventory dapat digunakan oleh:

```text
ESSENTIALS
SELECTS
CUSTOM
MERCH
ORIGINALS
```

tetapi system harus mengelola:

- available inventory,
- reserved inventory,
- allocated inventory.

---

# 61. Inventory Reservation

Contoh:

```text
100 Heavyweight Black L
```

mungkin digunakan untuk beberapa demand types.

MGBOS harus mengetahui:

```text
ON HAND
RESERVED
AVAILABLE
```

---

# 62. Strategic Inventory Advantage

Shared inventory dapat:

- meningkatkan turnover,
- mengurangi duplicated stock,
- menurunkan dead stock risk.

Ini salah satu alasan Essentials penting secara strategis.

---

# 63. Supplier Architecture

Essentials tidak boleh bergantung pada supplier tanpa monitoring.

Track:

```text
QUALITY
PRICE
LEAD TIME
MOQ
AVAILABILITY
CONSISTENCY
```

---

# 64. Primary Supplier

Core garment sebaiknya memiliki:

```text
PRIMARY SUPPLIER
```

dengan specification yang stabil.

---

# 65. Backup Supplier

Backup tidak otomatis interchangeable.

Sebelum substitution:

- fit,
- material,
- color,
- construction

harus diperiksa.

---

# 66. Supplier Substitution Rule

Customer tidak boleh menerima substantially different garment di bawah product name yang sama tanpa disclosure.

---

# 67. Private Label Development

Long-term TeeStock dapat mengembangkan proprietary base garment.

Possible path:

```text
CURATED THIRD-PARTY GARMENT
↓
CUSTOM SPECIFICATION
↓
PRIVATE LABEL GARMENT
↓
PROPRIETARY PLATFORM
```

Hanya jika volume dan economics membenarkan.

---

# 68. Why Private Label May Matter

Possible benefits:

- control,
- consistency,
- margin,
- differentiation,
- custom fit.

Possible risks:

- MOQ,
- capital,
- inventory,
- quality responsibility.

---

# 69. Private Label Trigger

Do not private-label merely for branding.

Consider when:

```text
VOLUME PROVEN
+
SUPPLY PAIN EXISTS
+
CONTROL ADDS VALUE
+
CAPITAL AVAILABLE
```

---

# 70. Essentials Economics

Canonical economics:

```text
SELLING PRICE
-
GARMENT COST
-
PACKAGING
-
TRANSACTION COST
-
FULFILLMENT VARIABLE COST
=
CONTRIBUTION
```

---

# 71. Shared Garment Cost

Jika garment sama digunakan untuk Selects/Originals:

base garment cost harus tetap konsisten dalam cost system.

Decoration dan IP costs ditambahkan setelahnya.

---

# 72. Essentials Pricing Role

Essentials can function as:

- entry product,
- repeat product,
- quality reference.

Pricing harus mempertimbangkan role tersebut.

Tidak harus menjadi highest-margin product.

---

# 73. Price Ladder

Jika multiple models aktif, customer harus memahami alasan price difference.

Example:

```text
Essential Tee
→ everyday / lighter

Heavyweight Tee
→ more structured / heavier

Oversized Tee
→ different pattern / fit
```

Price ladder harus memiliki product logic.

---

# 74. Bundle Opportunity

Essentials cocok untuk bundle:

```text
2-PACK
3-PACK
COLOR SET
```

jika economics mendukung.

Bundle harus memberi consumer value.

---

# 75. Essentials Merchandising

Merchandising harus berfokus pada:

```text
FIT
COLOR
MATERIAL
USE CASE
```

Bukan design theme.

---

# 76. Product Comparison

Jika beberapa Essentials tersedia, customer harus mudah membandingkan.

Example:

| Product | Fit | Weight | Best For |
|---|---|---|---|
| Essential Tee | Regular | Medium | Everyday |
| Heavyweight Tee | Relaxed | Heavy | Structured look |
| Oversized Tee | Oversized | Medium/Heavy | Loose silhouette |

Exact specs berasal dari product data.

---

# 77. Product Photography

Essential photography should emphasize:

```text
SILHOUETTE
FIT
FABRIC
DETAIL
COLOR
```

---

# 78. Model Photography

Gunakan model untuk membantu customer memahami:

- body proportion,
- fit,
- length,
- sleeve.

Where possible provide:

```text
model height
size worn
```

---

# 79. Flat Product Photography

Flat/product-only photography membantu:

- color understanding,
- product comparison,
- catalog clarity.

---

# 80. Detail Photography

Show:

- collar,
- fabric texture,
- seam,
- stitching.

This supports quality claims.

---

# 81. Product Copy

Essentials copy should be:

```text
CONCISE
FUNCTIONAL
SPECIFIC
```

Less manifesto.

More:

- fit,
- material,
- feel,
- usage.

---

# 82. Example Copy Direction

> **Heavyweight Tee**  
> Tee dengan feel lebih padat dan silhouette lebih structured untuk dipakai sendiri atau sebagai base untuk graphic apparel.

Then:

```text
Fit:
Relaxed

Material:
...

Weight:
...

```

---

# 83. Care Instructions

Every garment should provide clear care guidance.

Examples:

- washing temperature,
- drying,
- ironing,
- decoration-specific instructions if relevant.

Care information must come from verified product standard.

---

# 84. Essentials Customer Journey

```text
DISCOVER
↓
COMPARE FIT
↓
CHOOSE COLOR
↓
CHOOSE SIZE
↓
BUY
↓
WEAR
↓
REPEAT
```

Repeatability is especially important.

---

# 85. Repeat Purchase Role

Essentials may generate stronger repeat behavior because customer already knows:

- fit,
- size,
- quality.

This can reduce future purchase friction.

---

# 86. Customer Preference Data

TeeStock should learn:

```text
PREFERRED FIT
PREFERRED SIZE
PREFERRED COLOR
```

where appropriate.

This can improve future recommendation.

---

# 87. Essentials as Entry Point

Possible journey:

```text
BUY ESSENTIALS
↓
TRUST PRODUCT QUALITY
↓
DISCOVER SELECTS
↓
DISCOVER ORIGINALS
```

This strengthens TeeStock master brand.

---

# 88. Essentials → Custom

Consumer or business customer who likes garment can use same platform for Custom.

Example:

```text
"I like this Heavyweight Tee."
↓
"Can I print my own design?"
↓
TeeStock Custom
```

This is powerful cross-domain leverage.

---

# 89. Essentials → Merch

Creator can choose approved Essentials platform for merch.

Benefits:

- creator can sample product easily,
- sizing already documented,
- production predictable.

---

# 90. Essentials → Originals

Originals Label can choose:

```text
Existing Garment Platform
```

before developing proprietary cuts.

This reduces early brand incubation cost.

---

# 91. Originals Garment Evolution

Possible lifecycle:

```text
SHARED ESSENTIAL
↓
MODIFIED GARMENT
↓
LABEL-SPECIFIC GARMENT
```

only as label matures.

---

# 92. Essentials → Supply

When B2B customer wants same blank product at volume:

route to:

```text
TeeStock Supply
```

Consumer pricing and wholesale pricing remain separate.

---

# 93. Supply Relationship

Canonical:

```text
PRODUCT PLATFORM
          │
          ├── RETAIL
          │   └── Essentials
          │
          └── B2B
              └── Supply
```

---

# 94. Brand Experience

Essentials visual experience should be minimal.

Focus:

> product itself.

Master TeeStock identity dominant.

---

# 95. Packaging

Essentials packaging should be:

- efficient,
- clean,
- functional.

Information priority:

```text
PRODUCT
SIZE
CARE
TEEStock
```

---

# 96. Returns Intelligence

Track:

```text
TOO SMALL
TOO LARGE
FIT EXPECTATION
COLOR EXPECTATION
DEFECT
MATERIAL EXPECTATION
```

This informs product refinement.

---

# 97. Fit Return Analysis

High size-related return can indicate:

- incorrect size chart,
- unusual fit,
- poor customer explanation,
- actual production variance.

Do not treat all size returns as customer error.

---

# 98. Quality Complaint Mapping

Complaints should map to:

```text
FABRIC
STITCHING
COLLAR
COLOR
SHRINKAGE
FIT
```

and decoration where applicable.

---

# 99. Product Lifecycle

```text
IDEA
↓
SOURCE
↓
TEST
↓
APPROVED
↓
ACTIVE
↓
CORE / TEST
↓
SUNSET
↓
ARCHIVED
```

---

# 100. Core Promotion Criteria

A garment becomes Core when it demonstrates:

```text
CUSTOMER DEMAND
+
QUALITY CONSISTENCY
+
SUPPLY RELIABILITY
+
HEALTHY ECONOMICS
+
MULTI-DOMAIN USE
```

---

# 101. Sunset Criteria

Potential triggers:

```text
SUPPLIER UNRELIABLE
QUALITY DECLINE
LOW DEMAND
POOR ECONOMICS
BETTER REPLACEMENT
EXCESSIVE RETURNS
```

---

# 102. Migration Rule

If Core garment is replaced:

do not silently switch.

Need:

```text
NEW PLATFORM
↓
TEST
↓
COMPARE
↓
TRANSITION
↓
OLD PLATFORM SUNSET
```

---

# 103. Versioning

Major product specification change should create:

```text
PRODUCT VERSION
```

or new Product Model.

Example:

```text
Essential Tee v2
```

if customer experience changes materially.

---

# 104. Product Truth

Marketing copy cannot override real garment specification.

Source of truth:

```text
PRODUCT MASTER DATA
```

---

# 105. Essentials Data Model

Minimum entities:

```text
COMMERCE LINE
TeeStock Essentials

GARMENT PLATFORM

PRODUCT

COLOR

SIZE

VARIANT

SKU

SUPPLIER

INVENTORY
```

---

# 106. Shared Product Mapping

System should support:

```text
GARMENT PLATFORM
↓
USED BY
├── Essentials Product
├── Selects Product
├── Custom Configuration
├── Merch Product
└── Originals Product
```

---

# 107. Cost Mapping

Base garment cost lives at:

```text
GARMENT PLATFORM / PROCUREMENT
```

Additional line-specific costs live above it.

This prevents duplicate/inconsistent costing.

---

# 108. Inventory Mapping

One SKU may represent physical blank garment inventory.

Finished decorated variants may require separate inventory/state depending production model.

---

# 109. MGBOS Role

Future MGBOS should answer:

```text
How much base inventory exists?

Which domains are consuming it?

Which sizes/colors need reorder?

Which supplier is performing best?

Which garment platform creates best contribution?
```

---

# 110. Forecasting

Future demand forecast can combine:

```text
ESSENTIALS SALES
+
SELECTS PRODUCTION
+
CUSTOM DEMAND
+
MERCH DEMAND
+
ORIGINALS PLAN
```

because all may consume same base garment.

---

# 111. Strategic Advantage

Shared forecasting can create purchasing advantage unavailable to a standalone small clothing brand.

TeeStock can aggregate demand across multiple domains.

---

# 112. Procurement Flywheel

```text
MORE DOMAIN DEMAND
↓
MORE BASE GARMENT VOLUME
↓
BETTER PROCUREMENT
↓
BETTER AVAILABILITY / ECONOMICS
↓
BETTER PRODUCTS
↓
MORE DEMAND
```

---

# 113. Essentials Expansion

New category only introduced if:

```text
CONSUMER NEED
+
MULTI-DOMAIN UTILITY
+
SUPPLY RELIABILITY
+
ECONOMIC FIT
```

exist.

---

# 114. Category Priority

Preference should generally go to products usable by several TeeStock domains.

Example:

```text
TEE
```

has higher initial strategic utility than highly specialized apparel.

---

# 115. Specialty Products

Can be introduced for:

- specific Label,
- campaign,
- customer segment.

They do not automatically become Essentials.

---

# 116. Essentials Inclusion Rule

Product belongs in Essentials if:

```text
IT WORKS WITHOUT GRAPHIC
+
IT HAS BROAD CONSUMER UTILITY
+
IT CAN BE STANDARDIZED
+
IT FITS TEEStock QUALITY
```

---

# 117. Product Exclusion Rule

Do not put product into Essentials only because TeeStock can source it.

Availability is not assortment strategy.

---

# 118. Initial Essentials Model

Recommended early approach:

```text
FEW GARMENT PLATFORMS
+
FEW CORE COLORS
+
CORE SIZE RANGE
+
CLEAR FIT DIFFERENCE
```

This keeps data useful.

---

# 119. Early Product Logic

Example conceptual structure:

```text
ESSENTIAL TEE
Everyday

HEAVYWEIGHT TEE
Structured

OVERSIZED TEE
Loose silhouette
```

Do not commit to all three until sourcing/testing confirms need.

---

# 120. What Essentials Must Not Become

## Generic Blank Catalog

Not every available blank belongs here.

## Cheap Basics Line

Price alone is not positioning.

## SKU Explosion

Too many colors/fits weaken inventory economics.

## Supplier Catalog Reskin

TeeStock must curate and standardize.

## Supply Replacement

B2B volume belongs under TeeStock Supply.

---

# 121. Essentials Success Metrics

Commercial:

```text
Revenue
Contribution
AOV
Repeat Rate
```

Product:

```text
Return Rate
Fit Satisfaction
Defect Rate
```

Inventory:

```text
Inventory Turn
Stockout
Dead Stock
```

Strategic:

```text
Cross-Domain Usage
Garment Platform Utilization
```

---

# 122. Shared Platform Utilization

A garment with moderate direct Essentials sales may still be strategically strong if heavily used in:

- Selects,
- Custom,
- Merch,
- Originals.

Therefore performance cannot be judged only on direct retail sales.

---

# 123. Product Platform Economics

Analyze:

```text
TOTAL GARMENT PLATFORM VOLUME
```

across all use cases.

This helps determine procurement importance.

---

# 124. Essentials Portfolio Review

Each Product Model can be classified:

```text
CORE
GROWTH
TEST
RESTRICTED
SUNSET
```

---

# 125. Product Governance Questions

Before adding an Essential:

```text
What need does it solve?

How is it different?

Can supply remain consistent?

Can it be reused across domains?

Does it justify new inventory?

Can customer understand the difference?
```

---

# 126. Canonical Essentials Summary

```text
TEEStock ESSENTIALS
= consumer apparel fundamentals

CUSTOMER VALUE
Fit
Material
Consistency
Simplicity

STRATEGIC VALUE
Shared garment platform
Inventory consolidation
Procurement leverage
Quality standard
```

---

# 127. Canonical Relationship Summary

```text
ESSENTIALS
sells the garment.

SELECTS
adds curated artwork.

CUSTOM
adds customer artwork.

MERCH
adds creator/brand merchandise.

ORIGINALS
adds TeeStock-owned IP.

SUPPLY
sells the base product B2B.
```

---

# 128. Canonical Essentials Principles

```text
FEWER PRODUCTS. STRONGER STANDARDS.

FIT BEFORE FASHION LANGUAGE.

PRODUCT TRUTH BEFORE "PREMIUM".

CORE COLORS BEFORE SKU EXPLOSION.

SHARED PLATFORM BEFORE DUPLICATED INVENTORY.

TEST BEFORE DEEP STOCK.

CONSISTENCY BEFORE EXPANSION.

CONSUMER ESSENTIALS ≠ B2B SUPPLY.
```

---

# 129. Dependency

Dokumen berikut harus mengikuti TeeStock Essentials Strategy:

1. [[bisnis/teestock/03-commerce/catalog-merchandising-system|catalog-merchandising-system.md]]
2. [[bisnis/teestock/03-commerce/product-taxonomy|product-taxonomy.md]]
3. [[bisnis/teestock/04-services/custom|custom.md]]
4. [[bisnis/teestock/04-services/merch|merch.md]]
5. [[bisnis/teestock/04-services/supply|supply.md]]
6. [[bisnis/teestock/05-originals/originals-master-plan|originals-master-plan.md]]
7. [[bisnis/teestock/07-operations/sourcing-and-vendors|sourcing-and-vendors.md]]
8. [[bisnis/teestock/07-operations/production-system|production-system.md]]
9. [[bisnis/teestock/07-operations/inventory-system|inventory-system.md]]
10. [[bisnis/teestock/08-finance/unit-economics|unit-economics.md]]
11. [[bisnis/teestock/08-finance/pricing-framework|pricing-framework.md]]
12. [[bisnis/teestock/11-data-mgbos/canonical-data-model|canonical-data-model.md]]
13. [[bisnis/teestock/11-data-mgbos/sku-and-id-convention|sku-and-id-convention.md]]

Setiap product yang memakai garment platform TeeStock harus tetap mereferensikan canonical base garment record agar specification, cost, inventory, dan quality tidak terfragmentasi.