---
title: "TeeStock Business Model"
date: "2026-09-27"
bisnis: teestock
kategori: riset
status: active
tags:
  - bisnis/teestock
  - kategori/riset
  - teestock/canonical
  - teestock/strategy
document_id: "TS-STR-002"
version: "1.0"
category: "strategy"
business: "teestock"
last_updated: "2026-09-27"
path: "01-strategy/business-model.md"
depends_on:
  - "TS-FND-001"
  - "TS-FND-002"
  - "TS-STR-001"
---


# TeeStock Business Model v1.0

> [!abstract] **Canonical Business Model Document  **
> Dokumen ini mendefinisikan bagaimana TeeStock menciptakan, menyampaikan, dan menangkap nilai melalui Commerce, Services, Originals, dan Programs.
>
> [!info] **Dependencies & Data Flow (SSOT)**
> [[bisnis/teestock/00-foundation/teestock-master-definition|TS-FND-001: TeeStock Master Definition]] • [[bisnis/teestock/00-foundation/glossary|TS-FND-002: TeeStock Glossary]] • [[bisnis/teestock/01-strategy/business-thesis|TS-STR-001: TeeStock Business Thesis]]


---

# 1. Purpose

Business Model menjawab:

- siapa customer TeeStock,
- masalah apa yang diselesaikan,
- offering apa yang diberikan,
- bagaimana transaksi terjadi,
- bagaimana TeeStock memperoleh revenue,
- apa cost driver utama,
- bagaimana setiap domain saling memperkuat,
- dan bagaimana economics harus dipisahkan agar tidak menutupi profitabilitas sebenarnya.

Dokumen ini tidak menentukan:

- harga final,
- target margin final,
- SOP produksi,
- campaign,
- atau feature website.

Hal tersebut akan didefinisikan dalam dokumen turunan.

---

# 2. Business Model Overview

TeeStock memiliki empat economic domains utama:

```text
TEESTOCK BUSINESS MODEL
│
├── COMMERCE
│   ├── Selects
│   └── Essentials
│
├── SERVICES
│   ├── Custom
│   ├── Business
│   ├── Merch
│   ├── Studio
│   ├── Supply
│   └── Fulfill
│
├── ORIGINALS
│   ├── Collections
│   └── Independent Labels
│
└── PROGRAMS
    ├── Creator
    ├── Reseller
    ├── Partner
    └── Affiliate
```

Setiap domain berbeda fungsi.

```text
COMMERCE
monetizes products & curation

SERVICES
monetizes capability

ORIGINALS
builds and monetizes IP

PROGRAMS
expand participation & distribution
```

---

# 3. Customer Architecture

TeeStock tidak memiliki satu jenis customer.

Canonical customer groups:

```text
CONSUMER
CUSTOM CUSTOMER
BUSINESS CUSTOMER
CREATOR
APPAREL BUSINESS
RESELLER
AFFILIATE
PARTNER
```

Setiap customer group memiliki kebutuhan dan commercial relationship berbeda.

---

# 4. Consumer

## Need

Consumer ingin:

- apparel yang layak dipakai,
- desain yang relevan,
- kualitas yang jelas,
- pengalaman pembelian yang mudah,
- harga yang masuk akal.

## Primary Offerings

```text
TeeStock Selects
TeeStock Essentials
TeeStock Originals
Collaborations
```

## Transaction Type

```text
B2C
D2C
```

## Revenue

Product margin.

---

# 5. Custom Customer

## Need

Customer ingin membuat apparel berdasarkan ide/desain sendiri tanpa harus memahami supply chain dan produksi.

## Primary Offering

```text
TeeStock Custom
```

Possible supporting capability:

```text
TeeStock Studio
```

## Revenue

- custom production fee,
- product margin,
- design/setup fee,
- optional service add-ons.

---

# 6. Business Customer

## Need

Organisasi membutuhkan:

- uniform,
- event apparel,
- company merchandise,
- employee kit,
- community apparel,
- recurring supply.

## Primary Offering

```text
TeeStock Business
```

Supporting capabilities:

```text
Studio
Supply
Fulfill
```

## Revenue

- project revenue,
- product margin,
- design fee,
- production fee,
- fulfillment fee,
- recurring contract revenue.

---

# 7. Creator

## Need

Creator ingin memonetisasi:

- audience,
- artwork,
- IP,
- atau community

tanpa mengoperasikan production dan fulfillment sendiri.

## Primary Relationships

```text
Creator Program
TeeStock Merch
Collaborations
```

## Revenue Model

Tergantung arrangement:

```text
ROYALTY MODEL
REVENUE SHARE
BASE COST + CREATOR MARKUP
SERVICE FEE
FULFILLMENT FEE
```

Tidak semua creator menggunakan economics yang sama.

---

# 8. Apparel Business

## Need

Brand/vendor kecil membutuhkan:

- blank apparel,
- production capability,
- white-label,
- fulfillment,
- sourcing.

## Primary Offerings

```text
TeeStock Supply
TeeStock Fulfill
TeeStock Merch
```

## Revenue

- wholesale margin,
- production fee,
- fulfillment fee,
- packaging fee,
- optional technology/service fee.

---

# 9. Reseller

## Need

Reseller ingin:

- product siap jual,
- margin,
- assets,
- optional fulfillment.

## Relationship

```text
TeeStock Reseller Program
```

Reseller dapat menjual:

- Selects,
- Essentials,
- eligible Originals,
- atau selected partner products.

## Revenue to TeeStock

Wholesale/reseller price margin.

---

# 10. Affiliate

Affiliate membawa traffic atau sales tanpa membeli inventory.

## Relationship

```text
Affiliate Program
```

## TeeStock Economics

```text
Retail Revenue
-
Affiliate Commission
=
Contribution to TeeStock
```

---

# 11. Partner

Partner memberikan capability.

Contoh:

- garment supplier,
- printing vendor,
- logistics provider,
- packaging provider,
- manufacturer,
- software provider.

Partner pada dasarnya bukan customer.

Partner merupakan bagian dari value delivery architecture.

---

# 12. Commerce Business Model

## 12.1 Purpose

Commerce berfungsi sebagai:

```text
REVENUE ENGINE
+
DEMAND DISCOVERY ENGINE
+
CUSTOMER DATA ENGINE
```

Commerce menjual finished products langsung ke customer.

---

# 13. TeeStock Selects Business Model

Canonical proposition:

> **We curate it.**

Selects memungkinkan TeeStock menawarkan banyak design themes tanpa harus menciptakan semua IP sendiri.

## Input

- licensed artwork,
- commissioned artwork,
- creator artwork,
- collaborations,
- approved external design sources.

## TeeStock Adds

- curation,
- product selection,
- garment standard,
- production,
- merchandising,
- commerce,
- fulfillment.

## Customer Pays For

```text
DESIGN RELEVANCE
+
GARMENT
+
PRODUCTION
+
CURATION
+
CONVENIENCE
```

## Revenue Mechanism

```text
Selling Price
-
Direct Product Costs
-
Relevant Rights/Royalty
-
Transaction Costs
=
Contribution Margin
```

---

# 14. Strategic Role of Selects

Selects is not only a revenue line.

It functions as:

```text
MARKET SENSOR
```

Data produced:

- design preference,
- niche response,
- price response,
- conversion,
- repeat behavior.

Insight tersebut dapat digunakan untuk:

```text
Commerce optimization
Originals incubation
Creator strategy
Inventory planning
```

---

# 15. TeeStock Essentials Business Model

Canonical proposition:

> **We select the fundamentals.**

Essentials menjual consumer-facing apparel basics.

## Value

- standardized quality,
- reliable fit,
- simple purchase,
- everyday use.

## Economics

Lebih sederhana dibanding graphic products karena artwork cost dapat rendah atau tidak ada.

## Strategic Role

Essentials dapat menjadi:

```text
CORE PRODUCT
+
REPEAT PRODUCT
+
BASE GARMENT PLATFORM
```

Produk Essentials juga dapat menjadi underlying garment bagi:

- Selects,
- Custom,
- Originals,
- Merch.

---

# 16. Services Business Model

Services menghasilkan revenue dari capability.

Canonical model:

```text
CUSTOMER NEED
↓
TEESTOCK CAPABILITY
↓
DELIVERABLE
↓
SERVICE REVENUE
```

Services harus diusahakan menjadi:

> **productized services**

bukan pekerjaan custom tanpa batas.

---

# 17. TeeStock Custom Business Model

## Customer

- individual,
- small group,
- community,
- event,
- micro-business.

## Value Proposition

Membuat apparel custom secara lebih sederhana.

## Revenue Components

Possible:

```text
Base Garment
Decoration
Setup
Design Assistance
Special Handling
Rush Fee
Shipping
```

## Risk

Custom dapat menjadi highly manual.

Karena itu:

```text
Standard options
+
Clear boundaries
+
Automated quotation
```

harus menjadi arah pengembangan.

---

# 18. TeeStock Business Model

## Customer

- companies,
- organizations,
- hospitality,
- education,
- events,
- communities.

## Value Proposition

One accountable partner untuk apparel dan merchandise organization.

## Revenue Components

```text
Product
Design
Production
Packaging
Fulfillment
Project Management
```

## Important Characteristic

B2B economics harus dilacak terpisah dari B2C.

B2B dapat memiliki:

- negotiated pricing,
- payment terms,
- quotation,
- invoice,
- repeat order.

---

# 19. TeeStock Merch Business Model

## Customer

Creator, IP owner, brand, community.

## Proposition

> Customer membangun audience dan creative direction. TeeStock mengoperasikan merchandise backend.

Possible scope:

```text
Product Development
Production
Commerce
Inventory
Fulfillment
Customer Operations
```

---

# 20. Merch Commercial Models

TeeStock Merch dapat menggunakan beberapa model.

## Model A — Royalty

```text
Retail Selling Price
↓
TeeStock handles everything
↓
Creator receives fixed/percentage royalty
```

Cocok untuk:

- artwork creator,
- small creator,
- simple collab.

---

## Model B — Revenue Share

```text
Revenue
-
Agreed Costs
=
Shareable Margin
```

Kemudian dibagi berdasarkan agreement.

---

## Model C — Base Cost

Creator menentukan retail selling price.

TeeStock menetapkan:

```text
Base Production + Fulfillment Cost
```

Selisih setelah fee tertentu menjadi creator economics.

---

## Model D — Service Fee

Creator membayar TeeStock untuk capability tertentu.

Contoh:

- production only,
- fulfillment only,
- design support.

---

# 21. TeeStock Studio Business Model

Studio menjual creative capability.

Possible outputs:

- apparel artwork,
- visual identity,
- packaging,
- product development,
- mockup,
- tech pack.

Studio memiliki dua fungsi.

## External

Revenue-generating service.

## Internal

Shared creative resource untuk:

- TeeStock,
- Originals,
- Merch,
- Business.

Internal usage tetap perlu dicatat agar cost tidak “menghilang”.

---

# 22. TeeStock Supply Business Model

Supply fokus B2B.

## Customer

- clothing brands,
- printers,
- apparel businesses,
- production vendors.

## Revenue

```text
Purchase Cost
→ Markup
→ Wholesale Selling Price
```

## Strategic Role

- procurement volume,
- cash velocity,
- supplier leverage.

Supply tidak boleh dikejar hanya untuk omzet jika:

- margin terlalu rendah,
- working capital berat,
- tidak memberi ecosystem advantage.

---

# 23. TeeStock Fulfill Business Model

Fulfill menyediakan operational backend.

## Possible Pricing

```text
Storage Fee
Pick & Pack Fee
Production Handling Fee
Packaging Fee
Shipment Handling Fee
Return Fee
```

Tidak semuanya harus digunakan.

Pricing akan ditentukan berdasarkan actual operation.

---

# 24. Originals Business Model

Originals berbeda secara ekonomi karena TeeStock:

```text
CREATES
+
OWNS / CONTROLS
+
MONETIZES
```

consumer IP.

---

# 25. Originals Collections

Collections dapat digunakan untuk:

- experimentation,
- demand testing,
- creative storytelling,
- limited drop.

Economics harus dilacak per:

```text
Collection
Product
SKU
Drop
```

Tujuan awal tidak selalu profit maksimal.

Collection dapat berfungsi sebagai:

> market validation instrument.

---

# 26. Independent Label Business Model

Independent Label memiliki economics sendiri.

Contoh:

```text
Do Your Best
```

harus dapat dilihat seperti mini business di dalam TeeStock.

Track:

- revenue,
- COGS,
- CAC,
- contribution,
- repeat purchase,
- customer base,
- inventory,
- creative cost.

Label tidak boleh disubsidi tanpa batas oleh TeeStock tanpa diketahui.

---

# 27. Programs Business Model

Programs tidak selalu menghasilkan revenue langsung.

Programs dapat menghasilkan:

```text
DISTRIBUTION
CREATIVE SUPPLY
DEMAND
CAPABILITY
```

yang kemudian menghasilkan revenue di domain lain.

---

# 28. Creator Program Economics

Creator Program dapat menghasilkan:

```text
Artwork
Audience
Distribution
```

TeeStock dapat memberikan:

```text
Commerce
Production
Fulfillment
Revenue Share
```

Program dianggap berhasil jika creator relationship menciptakan positive contribution bagi kedua pihak.

---

# 29. Reseller Program Economics

Reseller memperluas distribution.

Basic flow:

```text
TeeStock
↓
Reseller Price
↓
Reseller
↓
Retail Selling Price
↓
End Customer
```

TeeStock memperoleh lebih sedikit margin per unit dibanding direct retail, tetapi dapat memperoleh:

- more volume,
- lower CAC,
- broader reach.

---

# 30. Affiliate Program Economics

Affiliate:

```text
Traffic/Sale
↓
Attribution
↓
Commission
```

Affiliate commission harus dianggap:

> variable acquisition cost.

---

# 31. Partner Program Economics

Partner relationship harus dievaluasi berdasarkan:

```text
Cost
Quality
Speed
Reliability
Capacity
Strategic Value
```

Partner termurah tidak selalu partner terbaik.

---

# 32. Revenue Architecture

Canonical TeeStock revenue categories:

```text
PRODUCT REVENUE
├── Selects
├── Essentials
├── Originals
└── Collaborations

SERVICE REVENUE
├── Custom
├── Business
├── Studio
├── Merch
├── Supply
└── Fulfill

PROGRAM-RELATED REVENUE
├── Reseller-driven sales
├── Affiliate-driven sales
└── Creator-driven sales
```

Program revenue sebaiknya tetap dibukukan ke underlying business line.

Contoh:

```text
Creator Program
→ generates sale
→ sale belongs to Merch or Commerce
```

Bukan membuat revenue category baru hanya karena channel berbeda.

---

# 33. Revenue Attribution

Setiap transaction idealnya memiliki:

```text
Business Unit
Business Domain
Business Line
Brand / Label
Product
Channel
Program
Customer Segment
```

Contoh:

```text
Business Unit:
TeeStock

Domain:
Originals

Label:
Do Your Best

Product:
Essential Tee

Channel:
teestock.id

Program:
Affiliate

Customer Segment:
Consumer
```

Ini memungkinkan analysis yang benar.

---

# 34. Cost Architecture

TeeStock harus memisahkan biaya menjadi:

```text
DIRECT COST
VARIABLE OPERATING COST
FIXED OPERATING COST
SHARED COST
CAPITAL EXPENDITURE
```

---

# 35. Direct Cost

Biaya langsung product/service.

Contoh:

- blank garment,
- print,
- packaging,
- royalty,
- outsource production.

---

# 36. Variable Operating Cost

Biaya yang naik mengikuti transaksi.

Contoh:

- payment fee,
- marketplace fee,
- affiliate commission,
- per-order shipping handling.

---

# 37. Fixed Operating Cost

Contoh:

- software subscription,
- workspace,
- recurring services.

---

# 38. Shared Cost

Biaya yang digunakan beberapa line.

Contoh:

```text
Studio
MGBOS
Shared Warehouse
Admin Tools
```

Harus ada allocation logic jika ingin mengetahui real profitability.

---

# 39. CapEx

Asset jangka panjang.

Contoh:

- machine,
- equipment,
- hardware.

CapEx tidak boleh diperlakukan sebagai seluruh biaya di bulan pembelian dalam management analysis tanpa konteks.

---

# 40. Contribution Margin Principle

Gross Margin saja tidak cukup.

TeeStock harus melihat:

```text
REVENUE
-
COGS
-
VARIABLE TRANSACTION COSTS
=
CONTRIBUTION MARGIN
```

Contribution Margin membantu mengetahui apakah volume sebenarnya menciptakan nilai.

---

# 41. Contribution Layers

Possible analysis:

```text
CM1
Revenue - Product COGS

CM2
CM1 - Transaction / Marketplace Fees

CM3
CM2 - Fulfillment Variable Cost

CM4
CM3 - Variable Acquisition Cost
```

Exact definition akan ditetapkan di Finance documentation.

---

# 42. Unit Economics Levels

TeeStock harus dapat melihat economics pada beberapa level:

```text
SKU
ORDER
CUSTOMER
COLLECTION
LABEL
SERVICE JOB
CREATOR
CHANNEL
BUSINESS LINE
```

Revenue besar di satu level dapat menyembunyikan loss di level lain.

---

# 43. Customer Acquisition Model

Demand dapat datang dari:

```text
ORGANIC
PAID
CREATOR
RESELLER
AFFILIATE
COMMUNITY
MARKETPLACE
DIRECT
```

Setiap source memiliki economics berbeda.

---

# 44. Owned vs Rented Distribution

## Owned Distribution

- website,
- customer database,
- email,
- WhatsApp,
- community.

## Rented Distribution

- marketplace,
- social platform,
- third-party audiences.

Strategic direction:

> menggunakan rented distribution untuk tumbuh sambil membangun owned customer relationships.

---

# 45. Inventory Model

TeeStock berusaha menghindari excessive finished-goods inventory.

Canonical approach:

```text
STANDARDIZED BASE INVENTORY
+
ON-DEMAND DECORATION
+
SELECTIVE FINISHED STOCK
```

---

# 46. Inventory Classes

```text
A. Base Garment Inventory
B. Decoration Material
C. Packaging
D. Finished Goods
E. Supplier-Available Inventory
```

Masing-masing memiliki risk profile berbeda.

---

# 47. Inventory Strategy by Domain

## Selects

Low finished inventory preferred until demand validated.

## Essentials

Can hold deeper inventory on proven sizes/colors.

## Originals

Capsule/drop-based initially.

## Custom

Primarily base inventory + on-demand production.

## Business

Procurement/project-based.

## Supply

Depends heavily on demand and working capital.

---

# 48. Shared Infrastructure Economics

Shared infrastructure harus mempunyai utilization.

Contoh:

```text
Heat Press
used by:
Selects
Originals
Custom
Merch
Business
```

Semakin tinggi productive utilization:

```text
fixed capability cost / more units
→ potentially better economics
```

Tetapi utilization tidak boleh mengorbankan SLA.

---

# 49. Cross-Domain Synergies

## Commerce → Originals

Commerce provides market insight.

## Services → Infrastructure

Services increases utilization.

## Programs → Distribution

Programs bring external reach.

## Originals → Brand Equity

Originals builds long-term consumer assets.

## Supply → Procurement

Volume can improve sourcing economics.

## MGBOS → Operations

Standardization improves scale.

---

# 50. Cross-Sell Model

Customer dapat berpindah antar-domain secara natural.

Example:

```text
Buys Essentials
↓
Needs Custom
↓
Becomes Custom Customer
↓
Runs a Community
↓
Uses Merch
```

Another:

```text
Creator joins Creator Program
↓
Collaboration succeeds
↓
Uses TeeStock Merch
↓
Uses Fulfill
```

Cross-sell harus terjadi karena kebutuhan customer, bukan dipaksakan.

---

# 51. Lifecycle of a Customer Relationship

```text
DISCOVER
↓
FIRST TRANSACTION
↓
TRUST
↓
REPEAT
↓
EXPANDED RELATIONSHIP
↓
ADVOCACY / PARTNERSHIP
```

Different domains dapat masuk di tahap berbeda.

---

# 52. Business Model Flywheel

Canonical economic flywheel:

```text
MORE DEMAND
↓
MORE ORDERS
↓
HIGHER INFRASTRUCTURE UTILIZATION
↓
BETTER PROCESS
↓
BETTER UNIT ECONOMICS
↓
BETTER CUSTOMER EXPERIENCE
↓
MORE REPEAT & REFERRAL
↓
MORE DEMAND
```

Data flywheel:

```text
MORE TRANSACTIONS
↓
MORE DATA
↓
BETTER CURATION
↓
BETTER PRODUCTS
↓
HIGHER CONVERSION
```

Brand flywheel:

```text
BETTER ORIGINALS
↓
STRONGER BRAND EQUITY
↓
MORE ORGANIC DEMAND
↓
LOWER ACQUISITION DEPENDENCY
```

---

# 53. Business Model Guardrails

TeeStock harus menghindari:

```text
Revenue without margin
Growth without systems
Catalog without curation
Services without boundaries
Brands without validation
Automation without standardization
Inventory without demand
```

---

# 54. What TeeStock Does Not Monetize Yet

Tidak semua potential revenue stream harus diaktifkan.

Potential future streams:

- platform subscription,
- SaaS fee,
- creator storefront fee,
- API usage,
- warehouse subscription.

Status:

```text
NOT CANONICAL REVENUE STREAMS YET
```

Mereka hanya boleh ditambahkan setelah market validation.

---

# 55. Business Line Activation Rule

Business line baru tidak dianggap aktif hanya karena ada di architecture.

Status lifecycle:

```text
CONCEPT
PILOT
ACTIVE
SCALED
PAUSED
SUNSET
```

Setiap line harus mempunyai activation criteria.

---

# 56. Commercial Priority Principle

Saat resource terbatas:

> Prioritaskan offering dengan kombinasi terbaik antara demand, margin, operational simplicity, learning value, dan strategic leverage.

Bukan hanya revenue terbesar.

---

# 57. Business Model Validation

Sebelum scale, setiap line harus membuktikan:

## Demand

Ada customer nyata.

## Delivery

TeeStock dapat memenuhi janji.

## Economics

Transaction memberikan contribution sehat.

## Repeatability

Process dapat diulang.

## Capacity

Volume tambahan dapat dilayani.

---

# 58. Minimum Proof by Domain

## Commerce

```text
repeat purchases
+
healthy contribution
```

## Custom

```text
consistent quote-to-order conversion
+
controlled revision burden
```

## Business

```text
repeatable pipeline
+
repeat orders
```

## Merch

```text
creator demand
+
positive creator/TeeStock economics
```

## Supply

```text
repeat B2B demand
+
healthy working capital
```

## Fulfill

```text
low error rate
+
predictable cost/order
```

## Originals

```text
identity-driven demand
+
repeat interest
```

---

# 59. Business Model Health

TeeStock harus menghindari satu metric domination.

Healthy business dilihat melalui kombinasi:

```text
Revenue
Contribution Margin
Cash Flow
Repeat Rate
Inventory Turn
Operational Error
Customer Satisfaction
Founder Load
```

---

# 60. Founder Load as Economic Metric

Founder time adalah resource terbatas.

Sebuah service mungkin terlihat profitable secara cash tetapi tidak profitable secara founder capacity.

Karena itu:

```text
Revenue per Founder Hour
Contribution per Founder Hour
```

dapat digunakan sebagai management metrics.

---

# 61. Automation Economics

Automation harus dinilai berdasarkan:

```text
Hours Saved
Errors Reduced
Speed Increased
Capacity Unlocked
```

Bukan sekadar jumlah workflow yang dibuat.

---

# 62. Internal Transfer Economics

Jika MultiGraph memberikan:

- printing,
- packaging,
- production

kepada TeeStock, transaksi internal harus memiliki transfer value.

Contoh:

```text
MultiGraph
→ Packaging Production
→ TeeStock
```

Tujuan:

- mengetahui profitability masing-masing business,
- menghindari hidden subsidy.

---

# 63. Strategic Business Model Map

```text
                          MARKET

          ┌────────────────┼────────────────┐
          │                │                │

      CONSUMER          BUSINESS         CREATOR
          │                │                │
          ▼                ▼                ▼

      COMMERCE          SERVICES         PROGRAMS
     /       \          /      \           │
 Selects Essentials  Custom  Business    Creator
                     Merch   Supply      Reseller
                     Studio  Fulfill     Affiliate

          \                |               /
           \               |              /
            └──────── SHARED ENGINE ──────┘
                       │
                       ▼
              SUPPLY / PRODUCTION
              COMMERCE / FULFILL
              FINANCE / DATA
                       │
                       ▼
                     MGBOS

                       │
                       ▼
                   ORIGINALS

              Collections → Labels
                       │
                       ▼
                    MARKET
```

---

# 64. Canonical Commercial Summary

```text
TEESTOCK SELECTS
Sell curated apparel.

TEESTOCK ESSENTIALS
Sell apparel fundamentals.

TEESTOCK CUSTOM
Make customer-specific apparel.

TEESTOCK BUSINESS
Solve organization apparel needs.

TEESTOCK MERCH
Operate merchandise for creators/brands.

TEESTOCK STUDIO
Create apparel and brand assets.

TEESTOCK SUPPLY
Supply apparel inputs to businesses.

TEESTOCK FULFILL
Operate physical order fulfillment.

TEESTOCK ORIGINALS
Create and monetize owned consumer IP.

TEESTOCK PROGRAMS
Expand creation, participation, and distribution.
```

---

# 65. Canonical Economic Summary

```text
COMMERCE
Revenue from products.

SERVICES
Revenue from capability.

ORIGINALS
Revenue + IP asset creation.

PROGRAMS
Distribution and ecosystem leverage.

SHARED INFRASTRUCTURE
Operational leverage.

MGBOS
Control, data, automation, and scalability.
```

---

# 66. Key Business Model Principle

TeeStock tidak bertujuan menjalankan banyak bisnis yang tidak berhubungan.

TeeStock bertujuan menjalankan:

> **beberapa revenue engines yang menggunakan infrastructure apparel yang sama.**

Itulah perbedaan antara:

```text
diversification
```

dan:

```text
ecosystem leverage
```

---

# 67. Future State

Jika model berhasil, TeeStock dapat berkembang dari:

```text
Sell Products
```

menjadi:

```text
Sell Products
+
Sell Capability
+
Enable Others to Sell
+
Build Brands
```

dan akhirnya memiliki:

```text
COMMERCE
SERVICES
NETWORK
IP PORTFOLIO
OPERATING INFRASTRUCTURE
```

dalam satu ecosystem.

---

# 68. Dependency

Dokumen berikut harus diturunkan dari Business Model:

1. [[bisnis/teestock/01-strategy/ecosystem-architecture|ecosystem-architecture.md]]
2. [[bisnis/teestock/01-strategy/growth-strategy|growth-strategy.md]]
3. [[bisnis/teestock/03-commerce/commerce-overview|commerce-overview.md]]
4. [[bisnis/teestock/04-services/services-overview|services-overview.md]]
5. [[bisnis/teestock/05-originals/originals-master-plan|originals-master-plan.md]]
6. [[bisnis/teestock/06-programs/programs-overview|programs-overview.md]]
7. [[bisnis/teestock/08-finance/financial-model|financial-model.md]]
8. [[bisnis/teestock/08-finance/unit-economics|unit-economics.md]]
9. [[bisnis/teestock/11-data-mgbos/canonical-data-model|canonical-data-model.md]]

Dokumen turunan boleh menambahkan detail tetapi tidak boleh mengubah pembagian fundamental antara Commerce, Services, Originals, dan Programs tanpa perubahan formal terhadap dokumen ini.