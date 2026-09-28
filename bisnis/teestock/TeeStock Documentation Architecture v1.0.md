# TeeStock Documentation Architecture v1.0

## 1. Tujuan

Dokumentasi TeeStock v1.0 harus menjadi **single source of truth** untuk seluruh pengembangan TeeStock:

- strategi bisnis,
- brand architecture,
- Commerce,
- Services,
- Originals,
- creator/reseller programs,
- operasional,
- keuangan,
- marketing,
- teknologi,
- data,
- automation,
- MGBOS integration,
- dan ekspansi masa depan.

Dokumentasi tidak boleh lagi bercampur antara:

- ide,
- keputusan resmi,
- SOP,
- riset,
- dan implementation notes.

---

# 2. Prinsip Dokumentasi

Semua dokumen TeeStock mengikuti 5 status:

```text
DRAFT
↓
PROPOSED
↓
CANONICAL
↓
SUPERSEDED
↓
ARCHIVED
```

### DRAFT
Masih eksplorasi.

### PROPOSED
Sudah cukup matang tetapi belum menjadi keputusan resmi.

### CANONICAL
Sumber kebenaran resmi.

### SUPERSEDED
Sudah digantikan dokumen baru.

### ARCHIVED
Tidak berlaku lagi dan hanya dipertahankan sebagai histori.

Dokumen dengan status **CANONICAL** adalah yang harus diikuti oleh:

- manusia,
- developer,
- AI agent,
- MGBOS,
- automation,
- dan dokumentasi turunan.

---

# 3. Struktur Folder Utama

```text
bisnis/
└── teestock/
    │
    ├── README.md
    │
    ├── 00-foundation/
    ├── 01-strategy/
    ├── 02-brand/
    ├── 03-commerce/
    ├── 04-services/
    ├── 05-originals/
    ├── 06-programs/
    ├── 07-operations/
    ├── 08-finance/
    ├── 09-marketing/
    ├── 10-product-tech/
    ├── 11-data-mgbos/
    ├── 12-legal-ip/
    ├── 13-metrics-experiments/
    ├── 14-roadmap/
    └── archive/
```

Folder diurutkan berdasarkan dependency.

Strategy tidak boleh bergantung pada detail website.

Website justru harus mengikuti strategy.

---

# 4. README.md — TeeStock Command Document

```text
bisnis/teestock/README.md
```

Ini halaman pertama untuk manusia maupun AI.

Bukan business plan panjang.

Isinya hanya:

- apa itu TeeStock,
- posisi saat ini,
- master architecture,
- current phase,
- link ke canonical documents,
- current priorities,
- major decisions,
- last updated.

Contoh master architecture:

```text
TEESTOCK
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

README harus menjadi **navigation hub**, bukan tempat semua detail ditumpuk.

---

# 5. 00-foundation/

Dokumen paling fundamental.

```text
00-foundation/
├── teestock-master-definition.md
├── documentation-governance.md
├── glossary.md
└── decision-register.md
```

---

## 5.1 teestock-master-definition.md

Dokumen terpenting seluruh TeeStock.

Menjawab:

> Apa sebenarnya TeeStock?

Isi:

- company/business definition,
- vision,
- mission,
- long-term thesis,
- problem TeeStock solves,
- ecosystem role,
- customer groups,
- relationship dengan MultiGraph Group,
- relationship dengan MGBOS,
- apa yang TeeStock bukan.

Canonical statement yang kita arahkan:

> **TeeStock adalah apparel commerce, services, production, fulfillment, dan consumer-brand ecosystem yang mengoperasikan berbagai produk, layanan, creator programs, serta consumer IP melalui satu shared infrastructure.**

---

## 5.2 documentation-governance.md

Aturan dokumentasi.

Mendefinisikan:

- status dokumen,
- naming convention,
- versioning,
- ownership,
- kapan dokumen boleh diubah,
- aturan canonical,
- aturan supersede,
- cross-reference.

Tujuannya mencegah kekacauan dokumentasi lama terulang.

---

## 5.3 glossary.md

Kamus istilah resmi.

Contoh:

```text
Commerce
Selects
Essentials
Originals
Independent Label
Collection
Drop
Service Line
Creator
Partner
SKU
Blank
Fulfillment
POD
MGBOS
```

AI agent dan developer harus mengikuti istilah yang sama.

---

## 5.4 decision-register.md

Catatan keputusan strategis.

Contoh:

```text
TS-DEC-001
TeeStock Originals hanya digunakan untuk IP internal TeeStock.

TS-DEC-002
Curated third-party catalogue masuk TeeStock Selects.

TS-DEC-003
Reseller bukan sub-brand; reseller adalah Program.

TS-DEC-004
Blank consumer retail masuk Essentials.
Blank B2B masuk Supply.
```

Tidak perlu membuka percakapan lama untuk tahu mengapa sebuah keputusan dibuat.

---

# 6. 01-strategy/

```text
01-strategy/
├── business-thesis.md
├── business-model.md
├── ecosystem-architecture.md
└── growth-strategy.md
```

---

## 6.1 business-thesis.md

Menjawab:

> Kenapa TeeStock layak ada dan bisa menjadi bisnis besar?

Isi:

- market problem,
- strategic insight,
- economic thesis,
- asset-light advantage,
- on-demand model,
- brand/IP opportunity,
- creator economy opportunity,
- supply chain opportunity,
- long-term defensibility.

---

## 6.2 business-model.md

Business model canonical.

Bukan lagi “5 pilar lama”.

Model baru:

```text
Revenue Engine

COMMERCE
├── Selects
├── Essentials
└── Originals

SERVICES
├── Custom
├── Business
├── Merch
├── Studio
├── Supply
└── Fulfill

PROGRAMS
├── Creator
├── Reseller
├── Partner
└── Affiliate
```

Dokumen ini mendefinisikan:

- customer,
- value proposition,
- revenue mechanism,
- cost structure,
- margin characteristics,
- scalability,
- strategic role.

---

## 6.3 ecosystem-architecture.md

Menjelaskan hubungan:

```text
MultiGraph Group
↓
TeeStock
↓
Commerce / Services / Originals / Programs
↓
Shared Infrastructure
↓
MGBOS
```

Juga menjelaskan tiga engine:

```text
Demand Engine
Capability Engine
Distribution Engine
```

---

## 6.4 growth-strategy.md

Menjelaskan bagaimana TeeStock bertumbuh:

```text
Validate
↓
Standardize
↓
Automate
↓
Expand
↓
Platformize
```

Dan kapan sebuah capability boleh dibangun.

---

# 7. 02-brand/

```text
02-brand/
├── master-brand-strategy.md
├── brand-architecture.md
├── brand-identity-system.md
└── voice-and-copy-system.md
```

---

## 7.1 master-brand-strategy.md

Mendefinisikan TeeStock sebagai parent/master brand.

Isi:

- positioning,
- brand essence,
- audience,
- personality,
- promise,
- differentiation,
- brand principles.

---

## 7.2 brand-architecture.md

Dokumen yang tadi kita rumuskan.

Menjelaskan:

```text
TeeStock
├── Commerce
├── Services
├── Originals
└── Programs
```

Termasuk aturan endorsement:

```text
DO YOUR BEST
A TEESTOCK ORIGINAL
```

---

## 7.3 brand-identity-system.md

Visual system TeeStock:

- logo,
- colors,
- typography,
- grid,
- photography,
- iconography,
- UI visual direction,
- packaging,
- application rules.

Jangan mencampurkan positioning bisnis di sini.

---

## 7.4 voice-and-copy-system.md

Menentukan bagaimana TeeStock berbicara.

Per audience:

- consumer,
- corporate,
- creator,
- reseller,
- supplier.

Juga:

- words we use,
- words we avoid,
- CTA conventions,
- technical communication,
- customer service tone.

---

# 8. 03-commerce/

```text
03-commerce/
├── commerce-overview.md
├── teestock-selects.md
├── teestock-essentials.md
├── catalog-merchandising-system.md
└── product-taxonomy.md
```

---

## 8.1 commerce-overview.md

Definisi Commerce:

> Produk yang customer dapat beli langsung dari TeeStock.

---

## 8.2 teestock-selects.md

Canonical definition:

> **We curate it.**

Mencakup:

- curated designs,
- licensed artwork,
- creator works,
- external collaborations,
- thematic niches.

Menjelaskan sourcing dan selection criteria.

---

## 8.3 teestock-essentials.md

Canonical definition:

> Apparel fundamentals selected by TeeStock.

Contoh:

- blank tee,
- heavyweight tee,
- soft tee,
- oversized,
- hoodie,
- basic wear.

Consumer-facing.

---

## 8.4 catalog-merchandising-system.md

Mengatur:

- kategori,
- collections,
- filters,
- recommendation,
- featured products,
- seasonal merchandising,
- assortment depth.

---

## 8.5 product-taxonomy.md

Mendefinisikan:

```text
Category
Product Family
Product
Variant
SKU
```

Ini sangat penting untuk MGBOS.

---

# 9. 04-services/

```text
04-services/
├── services-overview.md
├── custom.md
├── business.md
├── merch.md
├── studio.md
├── supply.md
└── fulfill.md
```

Setiap service menggunakan template yang sama:

```text
Purpose
Customer
Problem
Offering
Service Boundary
Process
Pricing Logic
SLA
Dependencies
Automation Potential
KPIs
Exit Criteria
```

---

# 10. 05-originals/

Ini salah satu folder paling penting.

```text
05-originals/
├── originals-master-plan.md
├── brand-incubation-framework.md
├── collection-framework.md
├── label-governance.md
│
├── collections/
│
└── labels/
    ├── do-your-best/
    ├── work-in-progress/
    └── after-hours-club/
```

---

## 10.1 originals-master-plan.md

Canonical definition:

> **We create it.**

Mendefinisikan TeeStock Originals sebagai:

> Consumer IP & Brand Creation Division.

---

## 10.2 brand-incubation-framework.md

Pipeline:

```text
INSIGHT
↓
CONCEPT
↓
BELIEF
↓
AUDIENCE
↓
IDENTITY
↓
CAPSULE
↓
MARKET TEST
↓
VALIDATION
↓
LABEL
↓
SCALE
```

---

## 10.3 collection-framework.md

Aturan kapan sesuatu hanya:

```text
Collection
```

dan kapan layak menjadi:

```text
Independent Label
```

---

## 10.4 label-governance.md

Aturan sebuah label:

- ownership,
- naming,
- brand bible,
- financial tracking,
- SKU namespace,
- social accounts,
- domain,
- lifecycle,
- scale/kill criteria.

---

## 10.5 labels/

Contoh nanti:

```text
labels/
└── do-your-best/
    ├── README.md
    ├── brand-bible.md
    ├── visual-system.md
    ├── product-strategy.md
    ├── collections.md
    └── launch-plan.md
```

Jangan dibuat sebelum label benar-benar masuk fase incubation.

---

# 11. 06-programs/

```text
06-programs/
├── programs-overview.md
├── creator-program.md
├── reseller-program.md
├── partner-program.md
└── affiliate-program.md
```

Ini bukan sub-brand.

Ini distribution/network mechanism.

---

## Creator Program

Bisa memiliki:

```text
Artwork Submission
Royalty
Co-Drop
Creator Merch
```

---

## Reseller Program

Bisa memiliki:

```text
Dropship
Bulk Reseller
White Label
```

---

# 12. 07-operations/

```text
07-operations/
├── operating-model.md
├── sourcing-and-vendors.md
├── production-system.md
├── quality-control.md
├── inventory-system.md
├── order-fulfillment.md
├── customer-service.md
└── returns-and-warranty.md
```

Ini baru benar-benar berbicara mengenai **cara TeeStock bekerja**.

---

# 13. 08-finance/

```text
08-finance/
├── financial-model.md
├── unit-economics.md
├── pricing-framework.md
├── cost-accounting.md
└── treasury-policy.md
```

---

## financial-model.md

Revenue streams dan cost structure.

## unit-economics.md

Per:

- SKU,
- Commerce line,
- Service,
- Label,
- Channel.

## pricing-framework.md

Jangan lagi harga tersebar di 10 dokumen.

Semua pricing logic memiliki satu sumber utama.

---

# 14. 09-marketing/

```text
09-marketing/
├── go-to-market.md
├── audience-segmentation.md
├── content-engine.md
├── channel-strategy.md
└── retention-and-community.md
```

Tidak perlu membuat campaign detail permanen di sini.

Campaign bersifat execution.

Strategy tetap canonical.

---

# 15. 10-product-tech/

```text
10-product-tech/
├── digital-product-vision.md
├── website-information-architecture.md
├── commerce-platform.md
├── creator-platform.md
├── partner-platform.md
└── automation-architecture.md
```

Ini memisahkan:

> business requirements

dengan:

> software implementation.

Website harus mengikuti business architecture baru.

---

# 16. 11-data-mgbos/

```text
11-data-mgbos/
├── canonical-data-model.md
├── entity-hierarchy.md
├── sku-and-id-convention.md
├── event-model.md
├── mgbos-integration.md
└── analytics-model.md
```

Contoh entity hierarchy:

```text
Organization
↓
Business Unit
↓
Business Line / Brand Division
↓
Label
↓
Collection
↓
Product
↓
Variant
↓
SKU
```

Tambahan:

```text
Program
Creator
Partner
Supplier
Channel
Warehouse
Fulfillment Hub
Order
Production Job
```

---

# 17. 12-legal-ip/

```text
12-legal-ip/
├── ip-policy.md
├── design-licensing-policy.md
├── creator-agreement-framework.md
├── trademark-framework.md
└── customer-commerce-policy.md
```

Sangat penting karena TeeStock akan bermain dengan:

- licensed artwork,
- creator artwork,
- internal IP,
- independent brands.

Ownership harus jelas sejak awal.

---

# 18. 13-metrics-experiments/

```text
13-metrics-experiments/
├── kpi-framework.md
├── experimentation-framework.md
└── decision-thresholds.md
```

KPI dipisahkan:

```text
Business
Commerce
Service
Originals
Operations
Marketing
Financial
```

Contoh Originals:

```text
Sell-through
Conversion
Repeat interest
Organic share rate
CAC
Contribution margin
Brand search
```

---

# 19. 14-roadmap/

```text
14-roadmap/
├── master-roadmap.md
├── capability-roadmap.md
└── current-quarter.md
```

---

## master-roadmap.md

3–5 tahun.

## capability-roadmap.md

Urutan capability:

```text
Commerce
↓
Production
↓
Custom
↓
Business
↓
Creator
↓
Merch
↓
Fulfill
↓
Supply
↓
Platform
```

## current-quarter.md

Hanya hal yang sedang dikerjakan.

Dokumen ini sering berubah.

---

# 20. Archive

```text
archive/
└── legacy-v0/
```

Secara ideal dokumentasi lama dipindahkan sementara ke sini sebelum akhirnya dihapus.

Karena Git menyimpan history, setelah TeeStock v1.0 canonical selesai, folder ini boleh dibuang dari working tree.

---

# 21. Klasifikasi Dokumen

Tidak semua file memiliki bobot yang sama.

## TIER 0 — Constitutional

Jarang berubah.

```text
teestock-master-definition.md
business-thesis.md
ecosystem-architecture.md
brand-architecture.md
```

---

## TIER 1 — Strategic

Berubah ketika bisnis berkembang.

```text
business-model.md
growth-strategy.md
master-brand-strategy.md
originals-master-plan.md
services-overview.md
```

---

## TIER 2 — Systems

Mendefinisikan sistem.

```text
pricing-framework.md
production-system.md
canonical-data-model.md
brand-incubation-framework.md
automation-architecture.md
```

---

## TIER 3 — Execution

Sering berubah.

```text
current-quarter.md
launch-plan.md
campaign plan
SKU rollout
experiment
```

Dengan pembagian ini, campaign TikTok tidak boleh mengubah business strategy.

---

# 22. Urutan Pembuatan

Jangan membuat 50 dokumen sekaligus.

## PHASE A — Foundation

Buat terlebih dahulu:

```text
01. README.md
02. teestock-master-definition.md
03. glossary.md
04. business-thesis.md
05. business-model.md
06. ecosystem-architecture.md
07. brand-architecture.md
```

Setelah tujuh dokumen ini selesai, kita memiliki **constitution TeeStock**.

---

## PHASE B — Business Architecture

Selanjutnya:

```text
08. commerce-overview.md
09. teestock-selects.md
10. teestock-essentials.md
11. services-overview.md
12. originals-master-plan.md
13. programs-overview.md
```

---

## PHASE C — Operating System

Kemudian:

```text
14. operating-model.md
15. production-system.md
16. sourcing-and-vendors.md
17. inventory-system.md
18. order-fulfillment.md
19. quality-control.md
20. financial-model.md
21. unit-economics.md
22. pricing-framework.md
```

---

## PHASE D — Growth Engine

```text
23. go-to-market.md
24. audience-segmentation.md
25. content-engine.md
26. creator-program.md
27. reseller-program.md
28. brand-incubation-framework.md
```

---

## PHASE E — Technology & MGBOS

```text
29. digital-product-vision.md
30. website-information-architecture.md
31. canonical-data-model.md
32. entity-hierarchy.md
33. mgbos-integration.md
34. automation-architecture.md
```

---

## PHASE F — Governance & Scale

```text
35. legal/IP documents
36. KPI framework
37. experimentation framework
38. master roadmap
39. capability roadmap
40. current-quarter.md
```

---

# 23. Dokumen yang Tidak Perlu Dibuat Sekarang

Belum perlu membuat:

```text
Do Your Best Brand Bible
Work In Progress Brand Bible
After Hours Club Brand Bible
Creator SaaS architecture
multi-tenant platform specification
warehouse network specification
international expansion plan
```

Sebelum parent architecture selesai, dokumen tersebut hanya akan menambah noise.

---

# 24. Target Akhir

Jika semua selesai, orang atau AI yang baru masuk proyek cukup membaca:

```text
README
↓
Master Definition
↓
Business Model
↓
Ecosystem Architecture
↓
Brand Architecture
```

Dalam waktu singkat dia sudah memahami:

- apa itu TeeStock,
- bagaimana TeeStock menghasilkan uang,
- apa bedanya Selects dan Originals,
- apa bedanya Commerce dan Services,
- siapa yang menjalankan produksi,
- bagaimana Programs bekerja,
- dan bagaimana semuanya masuk ke MGBOS.

Baru setelah itu masuk ke domain yang diperlukan.

---

# 25. Canonical TeeStock Documentation Map

```text
TEESTOCK DOCUMENTATION

FOUNDATION
│
├── Definition
├── Governance
├── Glossary
└── Decisions
     │
     ▼
STRATEGY
│
├── Business Thesis
├── Business Model
├── Ecosystem
└── Growth
     │
     ▼
BUSINESS ARCHITECTURE
│
├── Commerce
├── Services
├── Originals
└── Programs
     │
     ▼
OPERATING SYSTEM
│
├── Operations
├── Finance
├── Marketing
└── Legal
     │
     ▼
DIGITAL SYSTEM
│
├── Product
├── Tech
├── Data
├── Automation
└── MGBOS
     │
     ▼
MANAGEMENT
│
├── Metrics
├── Experiments
└── Roadmap
```

Prinsip final:

> **Strategy menjelaskan WHY.**

> **Architecture menjelaskan WHAT.**

> **Systems menjelaskan HOW.**

> **Roadmap menjelaskan WHEN.**

> **Metrics menjelaskan WHETHER IT WORKS.**