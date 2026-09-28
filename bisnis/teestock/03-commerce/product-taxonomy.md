---
title: "TeeStock Product Taxonomy"
document_id: "TS-COM-005"
version: "1.0"
status: "CANONICAL"
category: "commerce"
business: "teestock"
last_updated: "2026-09-28"
depends_on:
  - "TS-FND-001"
  - "TS-FND-002"
  - "TS-STR-002"
  - "TS-STR-003"
  - "TS-BRD-002"
  - "TS-COM-001"
  - "TS-COM-002"
  - "TS-COM-003"
  - "TS-COM-004"
---

# TeeStock Product Taxonomy v1.0

> **Canonical Product Classification & Entity Framework**  
> Dokumen ini mendefinisikan bagaimana TeeStock membedakan Product Family, Garment Platform, Product, Artwork, Collection, Variant, SKU, Bundle, Service Configuration, dan sellable offering agar seluruh Commerce, Services, Originals, inventory, finance, fulfillment, dan MGBOS menggunakan struktur data yang sama.

---

# 1. Purpose

Product Taxonomy menjawab:

- apa yang disebut Product,
- apa yang disebut SKU,
- bagaimana blank garment direpresentasikan,
- bagaimana artwork dipisahkan dari garment,
- bagaimana satu garment dapat digunakan banyak business line,
- bagaimana Originals dan Selects menggunakan product infrastructure yang sama,
- bagaimana inventory tidak terduplikasi,
- dan bagaimana seluruh entity tersebut harus dihubungkan.

Core principle:

> **Separate what the customer buys from what the business uses to make it.**

---

# 2. Canonical Product Hierarchy

High-level structure:

```text id="w91kte"
PRODUCT FAMILY
↓
GARMENT PLATFORM
↓
PRODUCT
↓
DESIGN / ARTWORK (optional)
↓
VARIANT
↓
SKU
```

Additional contextual entities:

```text id="yj8lyf"
COMMERCE LINE
LABEL
COLLECTION
CHANNEL
BUNDLE
SERVICE CONFIGURATION
```

Entity tersebut tidak menggantikan core hierarchy.

---

# 3. Why This Structure Exists

Tanpa taxonomy yang jelas, TeeStock berisiko membuat data seperti:

```text id="ef3fzg"
Black Heavyweight Tee L
Coffee Tee Black L
Custom Tee Black L
DYB Tee Black L
```

sebagai empat inventory item yang berbeda,

padahal secara fisik semuanya mungkin menggunakan:

> garment dasar yang sama.

Canonical model memungkinkan:

```text id="6cs0ch"
ONE BASE GARMENT INVENTORY
↓
MULTIPLE COMMERCIAL USES
```

---

# 4. Physical vs Commercial Layer

TeeStock harus membedakan dua layer.

## Physical Layer

Apa yang benar-benar ada atau diproduksi.

```text id="wobubp"
Garment
Material
Print
Packaging
Inventory
```

## Commercial Layer

Apa yang dilihat dan dibeli customer.

```text id="px99l1"
Product
Design
Collection
Brand
Price
Channel
```

Kedua layer saling berhubungan tetapi tidak boleh disamakan.

---

# 5. Product Family

## Definition

> **Product Family adalah kelompok produk berdasarkan physical form atau primary use.**

Examples:

```text id="5ye8kp"
T-Shirt
Long Sleeve
Hoodie
Crewneck
Jacket
Tote Bag
Cap
```

Product Family relatif stabil.

---

# 6. Product Family Is Not a Brand

Example:

```text id="gx4pyg"
T-Shirt
```

adalah Product Family.

Bukan:

- Commerce Line,
- Collection,
- Label.

---

# 7. Garment Platform

## Definition

> **Garment Platform adalah canonical physical apparel specification yang dapat digunakan oleh satu atau lebih commercial products.**

Garment Platform mewakili physical base sebelum artwork/decorative customization.

Example:

```text id="e536yd"
TS-GRM-TEE-HW01
```

Possible description:

```text id="kcj8um"
Heavyweight Cotton Tee
Relaxed Fit
Black / White / Natural
```

---

# 8. Why Garment Platform Is Critical

Garment Platform memungkinkan satu physical product menjadi foundation untuk:

```text id="cddkdx"
Essentials
Selects
Custom
Merch
Originals
```

without duplicating procurement and inventory truth.

---

# 9. Garment Platform Contains

Minimum specification:

```text id="u48519"
Platform ID
Product Family
Supplier
Supplier SKU
Material
Fabric Weight
Fit
Construction
Available Colors
Available Sizes
Cost
Lead Time
QC Standard
Decoration Compatibility
Status
```

---

# 10. Garment Platform Does Not Contain

It should not inherently contain:

- consumer artwork,
- label story,
- campaign,
- retail price,
- creator royalty.

Those belong to higher layers.

---

# 11. Example Garment Platform

```text id="0gdid8"
Platform ID:
TS-GRM-TEE-HW01

Family:
T-Shirt

Fit:
Relaxed

Material:
Cotton

Weight:
Heavyweight

Supplier:
Supplier A
```

Possible commercial use:

```text id="nazmqe"
TeeStock Essentials Heavyweight Tee
Coffee Graphic Tee
Start Anyway Tee
Custom Heavyweight Tee
Creator Merch Tee
```

---

# 12. Product

## Definition

> **Product adalah commercial offering yang mempunyai identity, customer proposition, pricing context, dan lifecycle sendiri.**

Example:

```text id="5jafhl"
TeeStock Essentials Heavyweight Tee
```

or:

```text id="fpfhhx"
Start Anyway Tee
```

Product is what the customer meaningfully recognizes as an offering.

---

# 13. Product vs Garment Platform

Canonical distinction:

```text id="ph5lvg"
GARMENT PLATFORM
physical foundation

PRODUCT
commercial offering
```

One Garment Platform can support many Products.

---

# 14. Product Example

```text id="putvqg"
Garment Platform:
TS-GRM-TEE-HW01

Product:
TeeStock Essentials Heavyweight Tee
```

Another Product:

```text id="hc7pml"
Garment Platform:
TS-GRM-TEE-HW01

Product:
Coffee Before Everything Tee
```

Physical base may be identical.

Commercial context differs.

---

# 15. Product Source Classification

Every Product should know its source classification:

```text id="iom897"
ESSENTIALS
SELECTS
ORIGINALS
COLLABORATION
CUSTOM
MERCH
BUSINESS
SUPPLY
```

This classification supports:

- economics,
- reporting,
- rights,
- branding.

---

# 16. Commerce Line

Commerce Line defines how consumer products are classified commercially.

Canonical:

```text id="tbwgqd"
TeeStock Selects
TeeStock Essentials
```

Originals is not Commerce Line.

Originals Products are distributed through Commerce.

---

# 17. Product Ownership Classification

Each Product must also know IP ownership context where relevant.

Possible:

```text id="szmtt6"
TEEStock OWNED
LICENSED
CREATOR OWNED
SHARED / COLLABORATIVE
CUSTOMER OWNED
NO CREATIVE IP
```

---

# 18. Artwork

## Definition

> **Artwork adalah creative asset that may be applied to a Product.**

Artwork is independent from garment.

Example:

```text id="iz04um"
Artwork:
Coffee Before Everything
```

---

# 19. Artwork ≠ Product

Canonical example:

```text id="8a7ztt"
ARTWORK
Coffee Before Everything

GARMENT PLATFORM
Heavyweight Tee

PRODUCT
Coffee Before Everything Tee
```

---

# 20. Artwork Reuse

One Artwork may theoretically map to multiple Products.

Example:

```text id="uvklbb"
Coffee Before Everything
├── Heavyweight Tee
└── Tote Bag
```

Only if:

- rights allow,
- product fit is appropriate,
- economics make sense.

---

# 21. Artwork Record

Minimum fields:

```text id="1dhiu8"
Artwork ID
Title
Creator
Owner
Rights Type
License
Master Asset
Version
Tags
Approval Status
```

---

# 22. Design Placement

Artwork application must be separated from Artwork itself.

Possible entity:

```text id="wd9ko2"
DESIGN APPLICATION
```

or equivalent.

It records:

```text id="75cnmy"
Artwork
Garment Platform
Placement
Print Size
Production Method
Color Treatment
```

---

# 23. Why Design Application Matters

Same Artwork may have different applications:

```text id="11a9bk"
Front Center
Back Large
Left Chest
```

These are not new Artworks.

They are different applications.

---

# 24. Product Configuration

A Product can reference one or more approved Design Applications.

Example:

```text id="4raf0s"
Start Anyway Tee
│
├── Front chest artwork
└── Back main artwork
```

---

# 25. Product Variant

## Definition

> **Variant adalah a selectable configuration of a Product that changes one or more commercial or physical attributes.**

Typical attributes:

```text id="lp48jm"
COLOR
SIZE
FIT
MATERIAL
```

Not all Products use all attributes.

---

# 26. Variant Example

Product:

```text id="s6lzs8"
Heavyweight Tee
```

Variants:

```text id="7be192"
Black / S
Black / M
Black / L
White / M
```

---

# 27. Variant vs SKU

Canonical distinction:

```text id="8zubqf"
VARIANT
customer-selectable configuration

SKU
inventory / operational identifier
```

Often one Variant maps to one SKU.

But this is not always mandatory.

---

# 28. SKU

## Definition

> **SKU adalah the smallest operational stock-keeping identity that TeeStock needs to track independently.**

SKU must be:

- unique,
- stable,
- machine-readable.

---

# 29. Example SKU

```text id="7prt8p"
TS-ESS-HWT-BLK-L
```

Could represent:

```text id="htcmgp"
Heavyweight Tee
Black
Large
```

Exact naming belongs in:

```text id="95juv7"
11-data-mgbos/sku-and-id-convention.md
```

---

# 30. SKU Must Represent Operational Reality

Do not create SKU merely because something is visually different if inventory does not need independent tracking.

Conversely:

if two units have different inventory/cost/supply behavior,

they likely need different SKUs.

---

# 31. Base Garment SKU

Physical base inventory can have its own SKU.

Example:

```text id="e0x5u3"
TS-GRM-HW01-BLK-L
```

This represents physical blank garment.

---

# 32. Decorated Product SKU

If TeeStock stocks finished decorated goods, it may require a separate SKU:

```text id="nx4zyx"
TS-SEL-COF01-BLK-L
```

But if produced on demand:

system may track it differently.

---

# 33. Made-to-Order Model

For made-to-order product:

```text id="t7mrib"
Customer Product Variant
↓
consumes
Base Garment SKU
+
Decoration Material
```

Finished Product may not exist in inventory before order.

---

# 34. Ready-Stock Model

For finished ready-stock product:

```text id="o0v571"
Finished Product SKU
```

has its own inventory quantity.

---

# 35. Hybrid Model

A Product can support:

```text id="flfd6f"
some variants ready stock
+
some variants made to order
```

if system handles this clearly.

---

# 36. Inventory Item

Operationally, MGBOS should distinguish:

```text id="4wnxv5"
PRODUCT
SKU
INVENTORY ITEM
```

SKU identifies what is tracked.

Inventory Item/Balance identifies quantity/location state.

---

# 37. Inventory Location

Physical inventory must also know:

```text id="uc0diq"
LOCATION
```

Example:

```text id="zut26w"
Citayam Hub
Bogor Hub
Production Partner
```

---

# 38. Inventory State

Possible:

```text id="8dzfej"
ON_HAND
RESERVED
AVAILABLE
IN_PRODUCTION
DAMAGED
QUARANTINE
```

Inventory state is not Product status.

---

# 39. Product Status

Canonical lifecycle states may include:

```text id="83dq3t"
DRAFT
TEST
ACTIVE
CORE
RESTRICTED
SUNSET
ARCHIVED
```

Product status relates to commercial lifecycle.

---

# 40. SKU Status

SKU can have:

```text id="347eb6"
ACTIVE
DISCONTINUED
BLOCKED
```

independently from Product.

Example:

Product active, but one color discontinued.

---

# 41. Garment Platform Status

Possible:

```text id="lznn5r"
TESTING
APPROVED
CORE
RESTRICTED
SUNSET
ARCHIVED
```

---

# 42. Collection

## Definition

> **Collection groups Products under a common creative, temporal, or narrative concept.**

Example:

```text id="4nx99c"
Chapter 001 — Start Anyway
```

Collection does not own inventory by itself.

Products and SKUs do.

---

# 43. Label

Label is brand entity.

Example:

```text id="w6ltiu"
Do Your Best
```

Hierarchy:

```text id="0bmw2g"
LABEL
↓
COLLECTION
↓
PRODUCT
↓
VARIANT
↓
SKU
```

---

# 44. Originals Example

```text id="4f32y2"
Business Unit:
TeeStock

Domain:
Originals

Brand Division:
TeeStock Originals

Label:
Do Your Best

Collection:
Chapter 001 — Start Anyway

Product:
Start Anyway Tee

Garment Platform:
TS-GRM-TEE-HW01

Artwork:
DYB-AW-001

Variant:
Black / L

SKU:
DYB-C01-TEE-BLK-L
```

---

# 45. Selects Example

```text id="fwpf6n"
Business Unit:
TeeStock

Domain:
Commerce

Commerce Line:
Selects

Artwork:
Coffee Before Everything

Garment Platform:
TS-GRM-TEE-HW01

Product:
Coffee Before Everything Tee

Variant:
Black / L
```

---

# 46. Essentials Example

```text id="thk6fl"
Business Unit:
TeeStock

Domain:
Commerce

Commerce Line:
Essentials

Garment Platform:
TS-GRM-TEE-HW01

Product:
Heavyweight Tee

Variant:
Black / L
```

---

# 47. Custom Example

Custom should not create permanent Product for every order.

Canonical model:

```text id="rb0p1z"
SERVICE
TeeStock Custom

↓

CONFIGURATION
Base Garment
Color
Size
Artwork
Placement

↓

CUSTOM ORDER ITEM
```

---

# 48. Why Custom Is Different

A one-off customer's design is usually not:

```text id="i8hhat"
catalog product
```

It is:

```text id="sxnmph"
order-specific configuration
```

unless explicitly promoted into reusable catalog offering.

---

# 49. Custom Configuration

Possible fields:

```text id="3z1amx"
Garment Platform
Color
Size
Artwork Asset
Placement
Decoration Method
Quantity
Customer Specification
```

---

# 50. Custom Order Item

Represents exact delivered unit/configuration in a specific order.

It can consume standard inventory without creating endless permanent Products.

---

# 51. Merch Product

Creator Merch is different from one-off Custom.

If creator product is repeatedly sellable:

it should become a canonical Product.

Example:

```text id="69pm96"
Creator:
ABC Creator

Product:
ABC Logo Tee
```

---

# 52. Merch Hierarchy

```text id="d7ao8e"
CREATOR
↓
MERCH COLLECTION / PRODUCT
↓
GARMENT PLATFORM
↓
ARTWORK
↓
VARIANT
↓
SKU / MADE-TO-ORDER CONFIG
```

---

# 53. Business Order Product

B2B projects can use one of two models.

## Standard Product

Existing Product reused.

## Project Configuration

Custom business-specific configuration.

Do not create permanent catalog Products unnecessarily.

---

# 54. Supply Product

Supply exposes physical product differently.

Example:

```text id="l1sw43"
Garment Platform:
TS-GRM-TEE-HW01

Supply Product:
Heavyweight Blank Tee
```

B2B quantity/pricing logic applies.

---

# 55. Supply and Inventory

Supply should consume the same underlying base garment inventory where applicable.

This prevents:

```text id="gakavu"
retail stock
vs
wholesale stock
```

being duplicated without reason.

---

# 56. Inventory Allocation

If one base garment serves several domains:

system may reserve quantities.

Example:

```text id="iyeg27"
On Hand: 100
Reserved Custom: 10
Reserved Merch: 20
Available: 70
```

---

# 57. Shared Inventory Priority

Priority rules should eventually exist for:

- paid orders,
- confirmed B2B projects,
- preorder,
- general storefront availability.

Exact rules belong in Inventory System.

---

# 58. Bundle

## Definition

> **Bundle adalah commercial grouping of two or more Products or SKUs sold together under one offer.**

Examples:

```text id="3vy7q0"
2-Pack Essentials
Tee + Tote
Starter Merch Pack
```

---

# 59. Bundle Is Not Inventory by Default

Bundle may be virtual.

Example:

```text id="or0u2o"
Bundle
↓
Product A
+
Product B
```

Inventory remains at component level.

---

# 60. Bundle SKU

A Bundle may receive a commercial identifier.

But components still need stock tracking individually.

---

# 61. Kit

Kit is similar to Bundle but may have operational packing logic.

Example:

```text id="rkyo43"
Employee Welcome Kit
```

Kit can include:

- Tee,
- Tote,
- Sticker,
- Packaging.

---

# 62. Product vs Bundle vs Kit

```text id="qep75w"
PRODUCT
single commercial offering

BUNDLE
grouped commercial offer

KIT
grouped operational package
```

Implementation can reuse shared mechanics.

---

# 63. Decoration

Decoration should exist as operational capability.

Examples:

```text id="5i9ctc"
DTF
Screen Print
Embroidery
DTG
```

Decoration is not Product Family.

---

# 64. Decoration Method

Each method should have:

- capability,
- cost logic,
- limitations,
- compatible materials,
- lead time.

---

# 65. Decoration Application

A Product can reference:

```text id="phbd44"
Decoration Method
Placement
Artwork
Size
```

This should be reproducible.

---

# 66. BOM

## Definition

> **Bill of Materials defines what physical inputs are required to produce a sellable output.**

Example:

```text id="s4yppn"
Start Anyway Tee
│
├── Heavyweight Blank Tee
├── DTF Transfer
├── Neck Label
├── Packaging
└── Insert
```

---

# 67. BOM Role

BOM helps:

- costing,
- production,
- procurement,
- inventory planning.

---

# 68. BOM for Made-to-Order Products

Very important because finished stock may not exist.

Order triggers consumption of BOM components.

---

# 69. BOM Versioning

If component changes:

BOM must be versioned or effective-dated.

This preserves historical product truth.

---

# 70. Product Version

Product may require versioning if:

- garment changes,
- construction changes,
- major specification changes.

---

# 71. Minor vs Major Product Change

Minor:

```text id="nlbrq1"
copy
photography
merchandising
```

does not create new Product version.

Major:

```text id="cyw14q"
garment platform
fit
material
construction
```

may require new version.

---

# 72. Product Identity Stability

Customer-facing Product name can remain stable through minor changes.

Major physical changes require disclosure or new product identity where appropriate.

---

# 73. Product Master

The canonical Product record should contain:

```text id="xzx2kg"
Product ID
Name
Business Domain
Commerce / Service Classification
Brand / Label
Collection
Product Family
Garment Platform
Artwork
Lifecycle Status
Sell Method
Primary Channel
```

---

# 74. Product Master Must Not Contain

Avoid stuffing:

- real-time stock,
- dynamic price,
- channel-specific title

directly into a single immutable master record if system architecture separates them.

---

# 75. Price Entity

Price should be treated as separate commercial data.

Because one Product can have:

```text id="lqs1dv"
Retail Price
Marketplace Price
Wholesale Price
Campaign Price
Creator Price
```

---

# 76. Price Book

Future model may use:

```text id="3ztkmm"
PRICE BOOK
```

Examples:

```text id="mg3ibv"
Retail Indonesia
Reseller
Wholesale
Creator
```

---

# 77. Channel Listing

One Product may have multiple channel listings.

```text id="88hw0s"
Product
├── TeeStock.id Listing
├── Shopee Listing
└── Creator Store Listing
```

Each listing may have:

- title,
- image,
- status,
- external ID.

---

# 78. Channel Listing Is Not Product

Critical rule:

> Do not duplicate canonical Product records because Shopee and website need different listings.

---

# 79. Product URL

URL belongs to presentation/channel layer.

Product identity should not depend on URL.

---

# 80. Product Image

Product images may be associated at:

```text id="a1ew4l"
PRODUCT
VARIANT
ARTWORK
COLLECTION
```

depending purpose.

---

# 81. Color

Color should use canonical color identity.

Possible structure:

```text id="dz82hl"
Color ID
Canonical Name
Color Family
Supplier Name
Visual Reference
```

---

# 82. Supplier Color Mapping

Supplier may call:

```text id="vlhhpl"
Jet Black
```

while TeeStock canonical name is:

```text id="29g3p7"
Black
```

Both can be stored separately.

---

# 83. Size

Size should use canonical values.

Example:

```text id="y95i2z"
S
M
L
XL
```

Measurement data belongs to Garment Platform/Product specification.

---

# 84. Size ≠ Measurement

`L` is a size label.

Actual measurement:

```text id="bstx3q"
Width
Length
Sleeve
```

should exist separately.

---

# 85. Fit

Fit is product-level physical characteristic.

Example:

```text id="jvod9v"
Regular
Relaxed
Oversized
```

It should not be inferred only from size.

---

# 86. Material

Material is part of physical product specification.

Use structured fields where possible.

---

# 87. Attribute Governance

Attributes should be categorized:

```text id="7aa24t"
PHYSICAL
COMMERCIAL
CREATIVE
OPERATIONAL
```

Example:

```text id="wcdmwm"
Color → physical
Price → commercial
Artwork → creative
Inventory Status → operational
```

---

# 88. Avoid Attribute Duplication

Do not store:

```text id="qk9so5"
product.color
sku.color
variant.color
inventory.color
```

as conflicting independent truths.

Define source and inheritance.

---

# 89. Product Relationship Model

Canonical conceptual model:

```text id="fj9k07"
PRODUCT FAMILY
     │
GARMENT PLATFORM
     │
     ├─────────────┐
     │             │
 PRODUCT       PHYSICAL SKU
     │
 ARTWORK
     │
 DESIGN APPLICATION
     │
 VARIANT
     │
 SELLABLE CONFIGURATION
```

Exact technical implementation may differ.

---

# 90. Sellable Configuration

## Definition

> A Sellable Configuration is the exact commercial configuration a customer can add to cart.

Example:

```text id="6endg9"
Coffee Before Everything Tee
Black
Large
```

---

# 91. Sellable Configuration vs SKU

For ready-stock:

```text id="b8d3qh"
Sellable Configuration
≈
Finished SKU
```

For made-to-order:

```text id="go5yfs"
Sellable Configuration
→ consumes Base Garment SKU + Decoration
```

---

# 92. This Distinction Prevents SKU Explosion

Without it, every artwork × color × size may become pre-stocked SKU.

With Sellable Configuration:

virtual catalog can be much larger than physical inventory.

---

# 93. Production Recipe

Made-to-order sellable configuration should map to:

```text id="6wo931"
PRODUCTION RECIPE
```

Containing:

```text id="z3qw28"
Base SKU
Artwork
Placement
Decoration Method
Packaging
QC Profile
```

---

# 94. Production Recipe vs BOM

BOM answers:

> What components are needed?

Production Recipe additionally answers:

> How should they be combined?

---

# 95. Product Lineage

Every finished Product should ideally be traceable to:

```text id="2vovcb"
Supplier
Garment Platform
Artwork
Production Recipe
Batch / Job
```

when relevant.

---

# 96. Batch

Production Batch identifies group of units produced together.

Useful for:

- quality traceability,
- defects,
- supplier changes.

---

# 97. Lot

Supplier material may also have Lot/Batch information.

Detailed implementation belongs to Operations.

---

# 98. Serial Number

Most TeeStock apparel does not require unit-level serial numbers.

Use only if justified.

Do not over-engineer.

---

# 99. Product IDs vs Names

IDs must be stable.

Names may change.

Example:

```text id="cptswc"
Product ID:
PRD-00124

Name:
Heavyweight Essential Tee
```

If marketing renames it, ID remains.

---

# 100. Human-Readable Codes

SKU may be human-readable.

Core entity IDs do not all need meaningful embedded semantics.

Avoid encoding too much business logic into permanent IDs.

---

# 101. Why Over-Semantic IDs Are Risky

Example:

```text id="wjs54a"
TS-SELECTS-MALE-COFFEE-BLACK-L-2026
```

becomes fragile when:

- taxonomy changes,
- audience changes,
- year changes.

Use IDs for identity.

Use fields for attributes.

---

# 102. SKU Semantics

SKU can contain limited semantics because warehouse humans benefit from readability.

But keep structure controlled.

---

# 103. Product Taxonomy vs Catalog Taxonomy

Canonical distinction:

```text id="x263d2"
PRODUCT TAXONOMY
internal structural truth

CATALOG TAXONOMY
customer navigation
```

They overlap but are not identical.

---

# 104. Example

Internal:

```text id="gz80ux"
Family:
T-Shirt

Fit:
Relaxed

Line:
Selects

Artwork Theme:
Coffee
```

Frontend may simply show:

```text id="0rr6h2"
Graphic Tees
Coffee
```

---

# 105. Taxonomy Stability

Internal product taxonomy should be relatively stable.

Customer navigation can change more frequently.

---

# 106. Product Taxonomy Governance

Any new Product Family must answer:

```text id="q4cgnf"
Is this physically distinct?

Does it require different operations?

Does it justify separate classification?
```

---

# 107. New Attribute Governance

Add a structured attribute if:

```text id="kapsi2"
used repeatedly
+
operationally meaningful
+
analytically useful
```

Otherwise use flexible metadata.

---

# 108. Product Source of Truth

Canonical hierarchy:

```text id="uuyhpw"
PRODUCT MASTER
↓
VARIANTS
↓
SELLABLE CONFIGURATIONS
↓
CHANNEL LISTINGS
```

Physical truth:

```text id="ii9bgz"
GARMENT PLATFORM
↓
SKUs
↓
INVENTORY
```

---

# 109. Product and Finance

Every sellable item must map to:

- revenue classification,
- COGS logic,
- business line,
- IP/royalty obligations.

---

# 110. Product and Legal/IP

Design-bearing Product cannot become sellable unless Artwork rights are valid.

The Product should reference rights-bearing Artwork record rather than duplicating legal information.

---

# 111. Product and Operations

Operations need:

```text id="2q24zz"
WHAT TO MAKE
WHAT TO USE
HOW MANY
HOW TO QC
WHERE TO SHIP
```

Product taxonomy must support these questions.

---

# 112. Product and MGBOS

MGBOS should eventually understand:

```text id="qxz4ib"
Product Family
Garment Platform
Product
Artwork
Design Application
Variant
SKU
BOM
Production Recipe
Bundle
Channel Listing
```

as connected entities.

---

# 113. Product and AI

AI can later reason:

> Which artwork performs best on Heavyweight Tee?

only if Artwork and Garment Platform are separated.

It can answer:

> Which garment platform has highest total utilization?

only if multiple commercial Products map back to the same platform.

Good taxonomy enables useful AI.

---

# 114. Bad Taxonomy Limits AI

If Product names are flat strings like:

```text id="0yx48p"
Coffee Black L
Coffee White XL
DYB Black M
```

without entity relationships,

AI and analytics must guess structure.

Canonical data should remove that ambiguity.

---

# 115. Example Full Relationship — Selects

```text id="pi4gkc"
Product Family
T-Shirt
│
▼
Garment Platform
TS-GRM-TEE-HW01
│
├── Base SKU
│   TS-GRM-HW01-BLK-L
│
▼
Artwork
Coffee Before Everything
│
▼
Design Application
Front Center / DTF
│
▼
Product
Coffee Before Everything Tee
│
▼
Variant
Black / L
│
▼
Sellable Configuration
Coffee Tee / Black / L
```

Order then consumes:

```text id="ryadcn"
1 × Base Garment SKU
+
1 × Decoration
```

---

# 116. Example Full Relationship — Originals

```text id="wftjaw"
Label
Do Your Best
│
▼
Collection
Chapter 001 — Start Anyway
│
▼
Artwork
Start Anyway
│
▼
Garment Platform
TS-GRM-TEE-HW01
│
▼
Product
Start Anyway Tee
│
▼
Variant
Black / L
│
▼
Sellable Configuration
DYB Start Anyway / Black / L
```

---

# 117. Example Full Relationship — Essentials

```text id="t4m747"
Commerce Line
Essentials
│
▼
Garment Platform
TS-GRM-TEE-HW01
│
▼
Product
Heavyweight Tee
│
▼
Variant
Black / L
│
▼
SKU
TS-ESS-HWT-BLK-L
```

If physical retail item is same base garment, implementation may map directly to base garment inventory according to inventory design.

---

# 118. Example — Creator Merch

```text id="sxv5ho"
Creator
ABC
│
▼
Merch Collection
Drop 001
│
▼
Artwork
ABC Logo
│
▼
Garment Platform
TS-GRM-TEE-HW01
│
▼
Product
ABC Logo Tee
│
▼
Variant
Black / L
```

---

# 119. Example — Custom

```text id="68i63v"
TeeStock Custom
│
▼
Customer Order
│
▼
Custom Configuration
├── Garment Platform
├── Size
├── Color
├── Customer Artwork
└── Placement
```

No permanent catalog Product required.

---

# 120. Product Creation Decision Tree

```text id="9cmaox"
NEW SELLABLE THING
│
├── Is it a one-off customer configuration?
│      └── Custom Order Item
│
├── Is it a reusable sellable offer?
│      └── Product
│
├── Is it only a visual asset?
│      └── Artwork
│
├── Is it a physical blank specification?
│      └── Garment Platform
│
├── Is it a selectable option?
│      └── Variant
│
└── Does inventory need independent tracking?
       └── SKU
```

---

# 121. Product Family Decision Tree

```text id="4fu30r"
Does it represent a distinct physical product class?
├── NO → do not create new Product Family
└── YES
     ↓
Does it require meaningful separate taxonomy?
├── NO → use attribute/category
└── YES → create Product Family
```

---

# 122. SKU Creation Decision

Create new SKU if:

```text id="yudw6e"
different physical stock
OR
different procurement
OR
different inventory valuation
OR
different fulfillment handling
```

Do not create new SKU merely for:

- marketing copy,
- campaign,
- collection placement.

---

# 123. Product Creation Gate

Before Product status becomes ACTIVE:

```text id="7zgmn8"
CLASSIFICATION VALID
GARMENT / INPUT READY
ARTWORK RIGHTS VALID
VARIANTS DEFINED
PRICE READY
PRODUCTION / INVENTORY MODE DEFINED
FULFILLMENT READY
PRODUCT DATA COMPLETE
```

---

# 124. Variant Explosion Guardrail

Before adding another attribute combination, ask:

```text id="l6e98s"
Does customer need it?

Can operations support it?

Does inventory justify it?

Is demand proven?
```

---

# 125. Customization vs Variant

If every possible custom artwork became a Variant:

taxonomy would collapse.

Canonical distinction:

```text id="nc73mt"
STANDARD CHOICE
→ Variant

CUSTOMER-SPECIFIC CHOICE
→ Configuration
```

---

# 126. Configuration

Configuration represents structured customer choices that do not necessarily become permanent Variant records.

Examples:

```text id="li8aa7"
custom text
custom artwork
placement
personalization
```

---

# 127. Personalization

Personalization may create unique production output.

It should attach to Order Item.

Not create permanent SKU for every customer name.

---

# 128. Digital Product vs Physical Product

If TeeStock later sells digital assets:

they require separate Product Type.

Do not force them into Garment Platform taxonomy.

Current taxonomy focuses primarily on physical apparel/merchandise.

---

# 129. Service vs Product

Services such as:

```text id="ueqal8"
Graphic Design
Fulfillment
Custom Production
```

should not be forced into physical Product hierarchy.

They require Service Offering model.

However an Order can include:

```text id="n6l41t"
Product Items
+
Service Items
```

---

# 130. Order Item Type

Future order model should support:

```text id="m4cjfa"
PRODUCT
SERVICE
FEE
DISCOUNT
```

or equivalent accounting structure.

---

# 131. Taxonomy and Reporting

Reporting should allow:

```text id="kqt9dg"
Revenue by Product Family
Revenue by Commerce Line
Revenue by Label
Revenue by Collection
Revenue by Artwork
Units by Garment Platform
Demand by Size
Demand by Color
```

without manual spreadsheet reconstruction.

---

# 132. Taxonomy and Procurement

Procurement should be able to aggregate:

```text id="h9emji"
all demand for TS-GRM-TEE-HW01
```

regardless of whether demand came from:

- Essentials,
- Selects,
- Custom,
- Merch,
- Originals.

---

# 133. Taxonomy and Capacity

Production can aggregate:

```text id="vhkoap"
all DTF applications
all embroidery jobs
```

based on Production Recipe.

This helps capacity planning.

---

# 134. Taxonomy and Profitability

Finance can calculate:

```text id="628yxf"
Garment Platform Contribution
Product Contribution
Artwork Contribution
Label Contribution
```

at different layers.

---

# 135. Taxonomy and Experimentation

Product tests can change:

- artwork,
- fit,
- pricing,
- channel

without losing identity of other layers.

This makes experimentation cleaner.

---

# 136. Taxonomy Anti-Patterns

Avoid:

## Flat SKU Catalog

Everything exists only as independent SKU strings.

## Artwork-as-Product

Makes reuse and IP management difficult.

## Supplier Product as Customer Product

Supplier naming should not automatically define customer experience.

## Channel Duplication

Same Product recreated separately for each marketplace.

## Custom Order Pollution

Every custom job becomes permanent Product.

## Collection-as-Taxonomy

Temporary creative structure becomes permanent backend hierarchy.

---

# 137. Canonical Entity Summary

```text id="yujd81"
PRODUCT FAMILY
What physical class is it?

GARMENT PLATFORM
What physical base are we using?

PRODUCT
What commercial offering are we selling?

ARTWORK
What creative asset is applied?

DESIGN APPLICATION
How is artwork applied?

VARIANT
What standard option did the customer choose?

SKU
What physical inventory identity do we track?

CONFIGURATION
What customer-specific choices exist?

COLLECTION
What story/release groups Products?

LABEL
What consumer brand owns the identity?

CHANNEL LISTING
Where is Product being sold?
```

---

# 138. Canonical Relationship Map

```text id="vyvxug"
                    PRODUCT FAMILY
                          │
                          ▼
                   GARMENT PLATFORM
                          │
                ┌─────────┴─────────┐
                │                   │
                ▼                   ▼
            BASE SKU             PRODUCT
                                    │
                              ┌─────┴─────┐
                              │           │
                           ARTWORK     COLLECTION
                              │           │
                              ▼           ▼
                     DESIGN APPLICATION  LABEL
                              │
                              ▼
                           VARIANT
                              │
                              ▼
                 SELLABLE CONFIGURATION
                              │
                              ▼
                           ORDER ITEM
```

---

# 139. Canonical Inventory Map

```text id="0mw0zz"
SUPPLIER
↓
GARMENT PLATFORM
↓
BASE SKU
↓
INVENTORY
↓
PRODUCTION RECIPE
↓
SELLABLE PRODUCT
↓
ORDER
```

---

# 140. Canonical Commercial Map

```text id="53vdk0"
TEEStock
↓
DOMAIN
↓
COMMERCE LINE / LABEL / SERVICE
↓
PRODUCT
↓
CHANNEL LISTING
↓
CUSTOMER
```

---

# 141. Initial Implementation Priority

Early TeeStock only needs robust handling for:

```text id="ejgyts"
Product Family
Garment Platform
Product
Artwork
Color
Size
Variant
SKU
Inventory
```

Then add:

```text id="e4bnfe"
Design Application
BOM
Production Recipe
Bundle
Advanced Channel Listing
```

as operational complexity grows.

---

# 142. Do Not Over-Engineer Early

Canonical architecture should exist now.

Technical implementation can be simpler initially.

Principle:

```text id="z3s39s"
MODEL THE BUSINESS CORRECTLY
WITHOUT BUILDING EVERY SYSTEM IMMEDIATELY
```

---

# 143. Migration Requirement

Existing legacy product records should eventually be mapped into:

```text id="y8e0r7"
Product Family
Garment Platform
Product
Artwork
Variant
SKU
```

rather than copied blindly into new system.

---

# 144. Legacy Data Cleanup

During migration identify:

```text id="xs90yg"
DUPLICATE PRODUCTS
DUPLICATE COLORS
DUPLICATE SKUS
UNKNOWN RIGHTS
UNKNOWN COST
OLD SUPPLIER REFERENCES
```

Legacy inconsistency should not become canonical data.

---

# 145. Canonical Product Principles

```text id="3cgqrv"
ONE PHYSICAL TRUTH.

ONE PRODUCT IDENTITY.

ARTWORK IS NOT GARMENT.

VARIANT IS NOT SKU.

CUSTOMIZATION IS NOT PERMANENT TAXONOMY.

CHANNEL LISTING IS NOT PRODUCT.

COLLECTION IS NOT CATEGORY.

SHARED GARMENT BEFORE DUPLICATED INVENTORY.

STRUCTURE BEFORE AUTOMATION.
```

---

# 146. Dependency

Dokumen berikut harus follow Product Taxonomy:

1. `04-services/services-overview.md`
2. `04-services/custom.md`
3. `04-services/merch.md`
4. `04-services/supply.md`
5. `05-originals/originals-master-plan.md`
6. `07-operations/sourcing-and-vendors.md`
7. `07-operations/production-system.md`
8. `07-operations/inventory-system.md`
9. `07-operations/order-fulfillment.md`
10. `08-finance/unit-economics.md`
11. `10-product-tech/commerce-platform.md`
12. `11-data-mgbos/canonical-data-model.md`
13. `11-data-mgbos/entity-hierarchy.md`
14. `11-data-mgbos/sku-and-id-convention.md`
15. `11-data-mgbos/event-model.md`

Technical schema boleh lebih detail daripada dokumen ini, tetapi tidak boleh menghilangkan distinction fundamental antara Garment Platform, Product, Artwork, Variant, SKU, Configuration, Collection, dan Label.