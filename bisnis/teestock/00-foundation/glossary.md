---
title: "TeeStock Glossary"
document_id: "TS-FND-002"
version: "1.0"
status: "CANONICAL"
category: "foundation"
business: "teestock"
last_updated: "2026-09-27"
depends_on:
  - "TS-FND-001"
---

# TeeStock Glossary v1.0

> **Canonical Terminology Reference**  
> Dokumen ini mendefinisikan istilah resmi yang digunakan di seluruh ecosystem TeeStock.

Semua dokumentasi, aplikasi, database, AI agent, automation, dashboard, dan komunikasi internal harus menggunakan istilah sesuai definisi dalam dokumen ini.

Jika sebuah istilah belum didefinisikan, istilah tersebut tidak boleh diasumsikan memiliki arti baru tanpa keputusan dokumentasi yang jelas.

---

# 1. Purpose

Glossary ini dibuat untuk mencegah:

- satu istilah memiliki beberapa arti,
- dua istilah digunakan untuk konsep yang sama,
- nama marketing tercampur dengan entity operasional,
- business line tercampur dengan brand,
- collection tercampur dengan label,
- program tercampur dengan service,
- dan implementation terminology tercampur dengan business terminology.

Prinsip:

> **One concept, one canonical term.**

---

# 2. Terminology Hierarchy

Secara umum, istilah TeeStock terbagi menjadi:

```text
TEESTOCK TERMINOLOGY
│
├── ORGANIZATION
├── BUSINESS ARCHITECTURE
├── BRAND ARCHITECTURE
├── PRODUCT ARCHITECTURE
├── COMMERCIAL
├── CUSTOMER & PARTNER
├── OPERATIONS
├── FINANCE
├── CHANNEL & DISTRIBUTION
├── DATA & MGBOS
└── LIFECYCLE & GOVERNANCE
```

---

# 3. Organization Terms

## Organization

Entity legal atau organizational paling atas dalam operating structure.

Contoh:

```text
MultiGraph Group
```

Dalam MGBOS:

```text
organization
```

TeeStock bukan Organization utama jika masih berada di bawah MultiGraph Group.

---

## Business Unit

Unit bisnis yang memiliki:

- model bisnis,
- customer,
- revenue,
- cost,
- operations,
- dan brand identity

yang cukup independen.

Contoh:

```text
MultiGraph Group
└── TeeStock
```

TeeStock adalah:

> **Business Unit**

---

## Parent Brand

Brand yang memberikan identitas utama terhadap sejumlah product line, service line, atau endorsed brand.

Dalam ecosystem ini:

> **TeeStock**

adalah parent/master brand untuk sebagian besar aktivitas apparel ecosystem.

---

## Master Brand

Istilah branding untuk brand utama yang menjadi sumber:

- trust,
- reputation,
- architecture,
- dan endorsement.

Dalam konteks TeeStock:

```text
TeeStock = Master Brand
```

---

# 4. Core Business Architecture Terms

## Commerce

Consumer retail layer TeeStock.

Menjawab:

> **Apa yang bisa customer beli langsung dari TeeStock?**

Commerce berfokus pada:

- product assortment,
- merchandising,
- retail experience,
- conversion,
- dan customer purchase.

Canonical structure:

```text
Commerce
├── Selects
└── Essentials
```

Commerce bukan nama satu toko fisik atau website.

Commerce adalah **business domain**.

---

## Services

Capability layer TeeStock.

Menjawab:

> **Apa yang bisa TeeStock kerjakan untuk customer?**

Canonical service lines:

```text
Services
├── Custom
├── Business
├── Merch
├── Studio
├── Supply
└── Fulfill
```

---

## Originals

Consumer IP dan brand creation division milik TeeStock.

Menjawab:

> **Apa yang TeeStock ciptakan dan miliki sendiri?**

Canonical principle:

> **We create it.**

Originals bukan istilah umum untuk semua produk TeeStock.

---

## Programs

Mechanism yang memungkinkan pihak eksternal berpartisipasi dalam ecosystem TeeStock.

Contoh:

```text
Creator Program
Reseller Program
Partner Program
Affiliate Program
```

Program bukan:

- brand,
- product line,
- maupun service line.

---

## Business Line

Unit operasional atau komersial di dalam sebuah Business Unit yang memiliki offering dan economics sendiri.

Contoh:

```text
TeeStock Custom
TeeStock Supply
TeeStock Fulfill
```

Dalam konteks tertentu, Service Line merupakan salah satu tipe Business Line.

---

## Service Line

Offering berbasis capability atau jasa.

Contoh:

```text
TeeStock Custom
TeeStock Business
TeeStock Merch
```

Setiap Service Line harus memiliki:

- customer,
- problem,
- offering,
- process,
- pricing logic,
- SLA,
- KPIs.

---

# 5. Commerce Terms

## TeeStock Selects

Curated product and graphic apparel line TeeStock.

Canonical principle:

> **We curate it.**

Produk Selects dapat berasal dari:

- licensed artwork,
- external artist,
- commissioned freelancer,
- creator submission,
- collaboration,
- atau sumber lain yang legal.

Selects tidak berarti TeeStock memiliki seluruh underlying IP.

---

## Select

Satu product/design yang lolos kurasi TeeStock.

Contoh:

```text
TeeStock Select:
Coffee Before Everything
```

Tidak setiap Select harus menjadi collection.

---

## TeeStock Essentials

Consumer-facing apparel fundamentals.

Fokus:

- material,
- fit,
- comfort,
- durability,
- dan everyday utility.

Contoh:

```text
Heavyweight Essential Tee
Soft Everyday Tee
Oversized Essential Tee
```

Essentials berbeda dari Supply.

---

## Assortment

Keseluruhan pilihan product yang ditawarkan dalam suatu context.

Contoh:

```text
TeeStock Commerce Assortment
```

Assortment dapat berubah berdasarkan:

- season,
- demand,
- stock,
- campaign,
- atau performance.

---

## Merchandising

Proses menentukan:

- produk mana ditampilkan,
- urutan produk,
- grouping,
- featured products,
- recommendation,
- seasonal arrangement,
- dan promotional placement.

Merchandising bukan sekadar desain website.

---

## Catalog

Representasi terstruktur dari product yang tersedia untuk dijual.

Catalog dapat mencakup:

- Selects,
- Essentials,
- Originals,
- Collaborations.

---

# 6. Originals Terms

## TeeStock Original

Karya, product concept, collection, atau brand yang intellectual property-nya dibuat dan/atau dimiliki internal TeeStock.

Syarat utama:

> TeeStock harus memiliki hak yang cukup jelas terhadap IP tersebut.

Tidak semua produk TeeStock adalah TeeStock Original.

---

## Originals Collection

Kelompok produk internal dengan satu creative concept yang sama.

Contoh:

```text
TeeStock Originals
Collection 001 — Raw Identity
```

Collection memiliki:

- concept,
- visual theme,
- product grouping,
- dan lifecycle.

Collection tidak otomatis menjadi independent brand.

---

## Collection

Kelompok products yang memiliki:

- common concept,
- season,
- story,
- theme,
- atau release context.

Collection dapat berada di bawah:

- TeeStock Originals,
- Independent Label,
- collaboration.

---

## Capsule Collection

Collection kecil dengan jumlah:

- product,
- SKU,
- dan release

yang sengaja dibatasi.

Biasanya digunakan untuk:

- market test,
- concept validation,
- atau limited release.

---

## Drop

Event atau periode release sebuah collection atau product.

Contoh:

```text
Drop 001
Launch Date: ...
```

Drop bukan synonym dari Collection.

Perbedaannya:

```text
Collection = what
Drop = release event
```

Satu Collection dapat memiliki lebih dari satu Drop.

---

## Independent Label

Consumer brand dengan identity dan worldview sendiri yang dimiliki atau dikendalikan TeeStock.

Sebuah Label memiliki:

- name,
- belief,
- audience,
- visual identity,
- voice,
- product universe,
- dan long-term potential.

Contoh konsep:

```text
Do Your Best
Work In Progress
After Hours Club
```

Label tidak boleh dibuat hanya karena satu graphic design terlihat menarik.

---

## Label

Singkatan internal untuk Independent Label ketika konteksnya sudah jelas.

Dalam data model:

```text
label
```

harus tetap dianggap sebagai brand-level entity.

---

## Brand Incubation

Proses sistematis untuk mengubah idea menjadi possible independent label.

Pipeline:

```text
Insight
↓
Concept
↓
Collection
↓
Market Test
↓
Validation
↓
Independent Label
```

---

## Consumer IP

Intellectual property yang memiliki nilai langsung di pasar consumer.

Contoh:

- brand name,
- characters,
- design universe,
- story,
- graphic language,
- community identity.

---

# 7. Collaboration Terms

## Collaboration

Produk atau collection yang dibuat bersama TeeStock dan pihak lain.

Canonical principle:

> **We create it together.**

Format naming dapat berupa:

```text
TeeStock × Creator
```

atau bentuk lain yang ditentukan kemudian.

---

## Co-Drop

Drop bersama creator atau partner.

Biasanya mencakup:

- shared creative input,
- promotion,
- revenue share,
- atau royalty.

---

## Creator Collaboration

Kolaborasi dengan:

- artist,
- designer,
- illustrator,
- creator,
- musician,
- community,
- atau IP owner.

Creator Collaboration tidak otomatis menjadi TeeStock Original.

---

# 8. Services Terms

## TeeStock Custom

Service untuk customer yang ingin membuat apparel dari:

- design,
- artwork,
- text,
- image,
- atau personal concept

milik mereka sendiri.

Canonical principle:

> **You create it. We make it.**

---

## Custom Order

Pesanan yang memiliki requirement spesifik customer.

Contoh:

- artwork sendiri,
- nama,
- nomor,
- placement,
- quantity,
- special specification.

---

## TeeStock Business

B2B apparel dan merchandise service untuk organisasi.

Target dapat mencakup:

- company,
- school,
- hospitality,
- institution,
- agency,
- event,
- community organization.

---

## TeeStock Merch

Infrastructure untuk creator, brand, dan community yang ingin menjual merchandise.

TeeStock Merch dapat mencakup:

- product development,
- production,
- commerce,
- fulfillment.

---

## TeeStock Studio

Creative capability TeeStock.

Fokusnya pada:

- apparel,
- merchandise,
- packaging,
- consumer brand,
- product visual development.

Bukan general-purpose creative agency kecuali diputuskan kemudian.

---

## TeeStock Supply

B2B sourcing dan supply apparel/material.

Target:

- clothing brand,
- printer,
- vendor,
- reseller,
- garment business,
- production partner.

Supply berbeda dengan Essentials.

---

## TeeStock Fulfill

Operational service untuk:

- storage,
- inventory,
- production coordination,
- packing,
- shipping,
- dan order handling.

---

# 9. Programs Terms

## Creator

Pihak eksternal yang memiliki satu atau lebih:

- artwork,
- creativity,
- audience,
- brand,
- community,
- atau IP.

Creator tidak selalu influencer.

---

## Creator Program

Umbrella program untuk hubungan TeeStock dengan creator.

Possible tracks:

```text
Artwork Submission
Royalty
Co-Drop
Creator Merch
```

---

## Reseller

Pihak yang membeli atau menjual produk TeeStock untuk dijual kembali.

Reseller memiliki margin melalui price difference.

---

## Dropshipper

Reseller yang tidak memegang physical inventory dan meminta TeeStock mengirim langsung ke end customer.

---

## Reseller Program

Program resmi untuk reseller dan dropshipper TeeStock.

---

## Affiliate

Pihak yang mereferensikan customer dan menerima attribution atau commission tanpa membeli inventory atau menjalankan fulfillment.

---

## Affiliate Program

Program referral/performance distribution TeeStock.

---

## Partner

Pihak eksternal yang memberikan capability strategis kepada TeeStock.

Contoh:

- vendor,
- manufacturer,
- printer,
- logistics provider,
- technology provider.

---

## Partner Program

Framework formal untuk mengelola partner ecosystem.

---

# 10. Customer Terms

## Customer

Pihak yang membeli product atau service TeeStock.

---

## Consumer

Customer akhir yang membeli untuk penggunaan pribadi.

---

## Business Customer

Customer organisasi atau perusahaan.

---

## Client

Istilah yang digunakan terutama untuk service engagement.

Contoh:

```text
TeeStock Business client
```

Untuk retail transaction, gunakan:

```text
customer
```

bukan client.

---

## End Customer

Orang terakhir yang menerima atau menggunakan product.

Dalam dropship:

```text
Reseller → TeeStock → End Customer
```

---

## Account

Identitas customer atau organization di dalam software/data layer.

Account tidak sama dengan Customer entity kecuali data model menyatakannya.

---

# 11. Product Architecture Terms

## Product Family

Kelompok produk dengan fungsi atau construction yang sama.

Contoh:

```text
T-Shirt
Hoodie
Totebag
```

---

## Product

Item komersial utama yang memiliki identity dan offering jelas.

Contoh:

```text
DYB Essential Tee
```

---

## Product Design

Artwork atau design expression yang diaplikasikan pada Product.

Product dan Design tidak boleh disamakan.

Contoh:

```text
Product:
Heavyweight Tee

Design:
Start Anyway
```

---

## Variant

Pilihan dari suatu Product berdasarkan attribute tertentu.

Contoh:

```text
Color: Black
Size: L
```

---

## SKU

Stock Keeping Unit.

Unit inventory paling spesifik yang dapat dilacak.

Contoh:

```text
DYB-C01-TEE-BLK-L
```

Setiap SKU harus merepresentasikan kombinasi variant yang unik.

---

## Blank

Apparel tanpa artwork utama.

Blank dapat digunakan sebagai:

- finished consumer basic,
- production input,
- B2B supply product.

---

## Base Garment

Garment yang menjadi foundation sebelum decoration.

Contoh:

```text
NSA Heavyweight Tee
```

---

## Decoration

Proses menambahkan visual atau functional element ke garment.

Contoh:

- DTF,
- screen printing,
- embroidery,
- DTG,
- sublimation.

---

## BOM

Bill of Materials.

Daftar material yang diperlukan untuk memproduksi product.

Contoh:

```text
Blank tee
DTF transfer
Neck label
Packaging
Sticker
```

---

# 12. Inventory Terms

## Inventory

Semua material atau finished goods yang dicatat sebagai stok.

---

## Raw Material

Material yang belum menjadi finished product.

---

## Production Input

Barang/material yang digunakan dalam proses produksi.

---

## Finished Goods

Produk selesai dan siap dikirim atau dijual.

---

## Buffer Stock

Inventory minimum yang sengaja disimpan untuk mempercepat fulfillment.

---

## Safety Stock

Inventory tambahan untuk menghadapi ketidakpastian demand atau supply.

---

## Dead Stock

Inventory yang tidak bergerak dalam waktu tertentu dan memiliki kemungkinan rendah untuk terjual.

---

## Stockout

Kondisi ketika inventory yang dibutuhkan tidak tersedia.

---

# 13. Operations Terms

## Sourcing

Proses mencari dan memperoleh:

- product,
- material,
- vendor,
- atau production capability.

---

## Supplier

Pihak yang menyediakan material atau product.

---

## Vendor

Pihak eksternal yang memberikan barang atau jasa.

Supplier merupakan salah satu tipe vendor.

---

## Production Partner

Vendor yang menjalankan sebagian proses produksi TeeStock.

---

## Production Job

Unit kerja produksi yang dapat dilacak.

Contoh:

```text
Order TS-1024
→ Production Job PJ-2041
```

---

## Work Order

Instruksi formal untuk melakukan sebuah production job.

---

## QC

Quality Control.

Proses memeriksa hasil output terhadap standar.

---

## QA

Quality Assurance.

Sistem untuk memastikan process menghasilkan kualitas konsisten.

Perbedaannya:

```text
QA = prevent problems
QC = detect problems
```

---

## SLA

Service Level Agreement.

Target waktu atau standar pelayanan.

Contoh:

```text
Custom order production:
H+1–H+3
```

---

## Lead Time

Waktu dari awal process sampai output siap.

---

## Turnaround Time

Waktu total penyelesaian sebuah request/order.

---

# 14. Fulfillment Terms

## Fulfillment

Process dari order siap dipenuhi hingga diterima customer.

Dapat mencakup:

```text
Pick
↓
Produce
↓
QC
↓
Pack
↓
Ship
```

---

## Fulfillment Hub

Lokasi yang menjalankan fulfillment.

---

## Production Hub

Lokasi yang memiliki production capability.

Production Hub dan Fulfillment Hub dapat berada pada lokasi yang sama atau berbeda.

---

## Warehouse

Lokasi penyimpanan inventory.

Tidak semua fulfillment hub harus menjadi warehouse besar.

---

## Pick & Pack

Process mengambil product/material yang tepat dan menyiapkannya untuk shipment.

---

## Shipment

Satu unit pengiriman.

Satu Order dapat memiliki lebih dari satu Shipment.

---

# 15. Order Terms

## Order

Commercial transaction utama customer.

---

## Order Item

Product/service individual di dalam sebuah Order.

---

## Custom Order

Order dengan customer-specific configuration.

---

## Sales Order

Formal record penjualan.

---

## Purchase Order

Formal request TeeStock kepada supplier/vendor.

Gunakan:

```text
PO
```

untuk Purchase Order.

Jangan menggunakan PO untuk customer order.

---

## Order Status

State sebuah order dalam lifecycle.

Detail canonical status akan ditentukan di operational/data model.

---

# 16. Commerce & Sales Terms

## Retail

Penjualan ke end consumer.

---

## Wholesale

Penjualan dalam quantity besar ke business/reseller.

---

## D2C

Direct-to-Consumer.

Penjualan langsung dari TeeStock kepada consumer melalui channel milik TeeStock.

---

## B2C

Business-to-Consumer.

---

## B2B

Business-to-Business.

---

## POD

Print-on-Demand.

Product diproduksi/decorated berdasarkan order atau demand aktual sehingga kebutuhan finished inventory dapat ditekan.

---

## White Label

TeeStock memberikan production/fulfillment capability tetapi customer-facing brand menggunakan brand pihak lain.

---

## Private Label

Product diproduksi pihak lain untuk dijual dengan brand milik buyer.

White Label dan Private Label tidak boleh diperlakukan sebagai synonym secara otomatis.

---

# 17. Channel Terms

## Channel

Tempat atau mechanism suatu transaction atau communication terjadi.

Contoh:

```text
teestock.id
Shopee
TikTok Shop
WhatsApp
Creator Store
Reseller
```

Channel bukan Business Line.

---

## Sales Channel

Channel yang dapat menghasilkan transaksi.

---

## Marketing Channel

Channel yang digunakan untuk memperoleh attention atau traffic.

---

## Owned Channel

Channel yang dikendalikan langsung TeeStock.

Contoh:

```text
teestock.id
email database
WhatsApp list
```

---

## Marketplace

Platform pihak ketiga untuk commerce.

---

## Storefront

Customer-facing digital atau physical interface tempat product ditampilkan dan dijual.

---

# 18. Brand Terms

## Brand

Sistem identity dan perception yang membedakan offering di pikiran audience.

Brand bukan hanya:

- logo,
- nama,
- atau visual.

---

## Brand Identity

Elemen yang digunakan brand untuk mengekspresikan dirinya.

Contoh:

- logo,
- color,
- typography,
- visual language,
- voice.

---

## Brand Equity

Nilai yang tercipta dari:

- awareness,
- trust,
- recognition,
- loyalty,
- dan association.

---

## Endorsed Brand

Brand yang memiliki identity sendiri tetapi memperlihatkan relationship dengan parent brand.

Contoh potensial:

```text
DO YOUR BEST
A TEESTOCK ORIGINAL
```

---

## Branded House

Architecture di mana berbagai offerings memakai master brand yang sama.

Contoh internal:

```text
TeeStock Custom
TeeStock Business
TeeStock Merch
```

---

## House of Brands

Architecture di mana parent organization memiliki berbagai consumer brands yang relatif independen.

TeeStock Originals dapat berkembang mendekati model ini untuk Independent Labels.

---

# 19. Design Terms

## Artwork

File atau visual creative asset yang digunakan pada product.

---

## Graphic

Elemen visual yang diterapkan ke product.

---

## Master Artwork

Source file dengan kualitas produksi final.

---

## Mockup

Visual simulation product sebelum physical production.

---

## Design System

Aturan konsisten mengenai bagaimana sebuah brand atau collection mengekspresikan visual.

---

## Visual Language

Karakter visual yang berulang sehingga sebuah brand dapat dikenali.

---

# 20. Intellectual Property Terms

## IP

Intellectual Property.

Mencakup:

- artwork,
- trademark,
- brand,
- character,
- design,
- copy,
- proprietary creative concept.

---

## Internal IP

IP yang dimiliki atau dikendalikan TeeStock secara internal.

---

## External IP

IP milik pihak lain.

---

## Licensed IP

External IP yang digunakan TeeStock berdasarkan izin atau license yang sah.

---

## Buyout

Agreement di mana ownership atau commercial rights tertentu dialihkan berdasarkan kontrak.

Buyout tidak boleh diasumsikan memberikan seluruh hak jika kontraknya tidak mengatakan demikian.

---

## Royalty

Payment kepada rights holder berdasarkan formula tertentu.

Contoh:

```text
Rp X per unit sold
```

---

## License

Hak penggunaan IP berdasarkan ketentuan tertentu.

---

# 21. Finance Terms

## Revenue

Nilai penjualan sebelum dikurangi biaya.

---

## COGS

Cost of Goods Sold.

Biaya langsung untuk menghasilkan barang yang terjual.

---

## Gross Profit

```text
Revenue - COGS
```

---

## Gross Margin

```text
Gross Profit / Revenue
```

---

## Contribution Margin

Revenue setelah dikurangi variable costs yang terkait langsung dengan transaction.

---

## Operating Expense / OPEX

Biaya operasional yang tidak langsung menjadi bagian unit product.

---

## Net Profit

Profit setelah seluruh relevant expenses.

---

## Unit Economics

Analisis revenue dan cost pada unit terkecil yang bermakna.

Contoh:

```text
per SKU
per order
per customer
per service job
```

---

## AOV

Average Order Value.

---

## CAC

Customer Acquisition Cost.

---

## LTV

Customer Lifetime Value.

---

## Cash Velocity

Kecepatan modal kembali menjadi cash yang dapat digunakan kembali.

---

# 22. Pricing Terms

## List Price

Harga standar product sebelum promotion.

---

## Selling Price

Harga aktual yang dibayar customer.

---

## Floor Price

Harga minimum yang boleh digunakan agar economics tidak melanggar batas yang telah ditentukan.

---

## Wholesale Price

Harga B2B atau volume.

---

## Transfer Price

Harga internal antar business unit atau entity.

Contoh potensial:

```text
MultiGraph → TeeStock
```

---

# 23. Marketing Terms

## Audience

Kelompok manusia yang ingin dijangkau.

---

## Segment

Sub-group berdasarkan karakteristik atau kebutuhan tertentu.

---

## Target Customer

Customer segment yang secara aktif diprioritaskan.

---

## Positioning

Tempat yang ingin TeeStock/brand miliki di pikiran target audience dibanding alternatives.

---

## Value Proposition

Alasan konkret mengapa customer memilih offering.

---

## Campaign

Aktivitas marketing dengan:

- objective,
- duration,
- audience,
- message,
- channel.

Campaign bersifat temporal.

---

## Content Engine

Sistem repeatable untuk membuat, mendistribusikan, dan mengevaluasi content.

---

## Community

Kelompok audience/customer dengan identity atau relationship yang lebih kuat daripada sekadar transaction.

---

# 24. Experimentation Terms

## Hypothesis

Pernyataan yang dapat diuji.

---

## Experiment

Test terstruktur terhadap sebuah hypothesis.

---

## Market Test

Experiment yang menggunakan behavior pasar nyata.

---

## Validation

Bukti yang cukup bahwa assumption tertentu didukung data.

Validation bukan perasaan positif atau likes semata.

---

## Exit Criteria

Condition yang harus tercapai sebelum naik ke fase selanjutnya.

---

## Kill Criteria

Condition yang menjadi dasar menghentikan:

- product,
- campaign,
- collection,
- experiment,
- atau label.

---

## Scale Criteria

Condition yang menunjukkan sesuatu layak diberikan lebih banyak:

- budget,
- inventory,
- distribution,
- atau capability.

---

# 25. Metrics Terms

## KPI

Key Performance Indicator.

Metric penting untuk mengevaluasi strategic performance.

---

## Metric

Nilai terukur.

Tidak semua metric adalah KPI.

---

## North Star Metric

Metric utama yang merepresentasikan value creation jangka panjang.

Belum ditetapkan secara permanen dalam Glossary.

Harus ditentukan melalui `kpi-framework.md`.

---

## Conversion Rate

Persentase target action terhadap relevant traffic/opportunity.

---

## Sell-Through Rate

Persentase inventory/available units yang berhasil terjual dalam periode tertentu.

---

## Repeat Purchase Rate

Persentase customer yang melakukan pembelian berikutnya.

---

# 26. Data & MGBOS Terms

## MGBOS

MultiGraph Business Operating System.

Internal operating infrastructure untuk mengelola:

- entity,
- transaction,
- workflow,
- finance,
- inventory,
- automation,
- analytics,
- dan AI operations

di ecosystem MultiGraph Group.

---

## Canonical Data Model

Definisi resmi entity dan relationship yang digunakan sistem.

---

## Entity

Object bisnis yang memiliki identity sendiri.

Contoh:

```text
Customer
Product
Order
Creator
Supplier
Label
```

---

## Entity ID

Unique identifier sebuah entity.

---

## Source of Truth

Sistem atau dokumen yang dianggap authoritative untuk suatu data.

---

## Event

Catatan bahwa sesuatu telah terjadi.

Contoh:

```text
order.created
payment.completed
production.started
shipment.dispatched
```

---

## Event Model

Struktur canonical event yang digunakan automation dan analytics.

---

## Workflow

Urutan process untuk mencapai business outcome.

---

## Automation

Workflow yang sebagian atau seluruh step-nya dijalankan sistem tanpa manual intervention.

---

## Agent

AI/software worker yang diberikan:

- role,
- context,
- permissions,
- tools,
- dan objective.

Agent bukan sinonim automation.

---

# 27. Infrastructure Terms

## Shared Infrastructure

Capability yang dapat digunakan lebih dari satu domain TeeStock.

Contoh:

- payment,
- inventory,
- production,
- fulfillment,
- analytics.

---

## Capability

Kemampuan organizational atau technical untuk melakukan sesuatu secara repeatable.

---

## Internal Capability

Capability yang dijalankan TeeStock sendiri.

---

## External Capability

Capability yang diberikan partner/vendor.

---

## Asset-Light

Strategi membangun bisnis tanpa harus memiliki seluruh physical asset sendiri.

---

## Platformization

Tahap ketika repeatable internal capability dikembangkan menjadi infrastructure yang dapat digunakan pihak lain secara sistematis.

Platformization hanya dilakukan setelah demand tervalidasi.

---

# 28. Lifecycle Terms

## Idea

Pemikiran awal yang belum masuk formal validation.

---

## Concept

Idea yang sudah memiliki definition dan hypothesis lebih jelas.

---

## Prototype

Representasi awal untuk testing.

---

## Pilot

Implementation terbatas dengan user/customer nyata.

---

## Launch

Release resmi ke market.

---

## Growth

Tahap meningkatkan demand dan operational capacity.

---

## Scale

Tahap memperbesar volume tanpa peningkatan complexity yang proporsional.

---

## Mature

Offering/process yang sudah stabil dan repeatable.

---

## Sunset

Process menghentikan product/service secara terencana.

---

## Archive

Status ketika sesuatu tidak lagi aktif tetapi record tetap disimpan.

---

# 29. Documentation Governance Terms

## Canonical

Dokumen atau definition resmi yang menjadi source of truth.

---

## Draft

Masih dalam eksplorasi.

---

## Proposed

Sudah dirumuskan tetapi belum menjadi keputusan final.

---

## Superseded

Sudah digantikan oleh dokumen/versi lain.

---

## Archived

Tidak aktif tetapi dipertahankan untuk historical reference.

---

## Decision Register

Dokumen yang mencatat strategic decision dan alasannya.

---

## ADR

Architecture Decision Record.

Digunakan terutama untuk technical architecture decisions.

Tidak semua business decision harus menjadi ADR.

---

# 30. Naming Rules

Gunakan istilah resmi berikut secara konsisten:

```text
TeeStock Commerce
TeeStock Selects
TeeStock Essentials

TeeStock Services
TeeStock Custom
TeeStock Business
TeeStock Merch
TeeStock Studio
TeeStock Supply
TeeStock Fulfill

TeeStock Originals

TeeStock Creator Program
TeeStock Reseller Program
TeeStock Partner Program
TeeStock Affiliate Program
```

Untuk external communication, nama dapat disederhanakan jika konteks jelas.

Contoh:

```text
TeeStock Custom
```

bukan:

```text
TeeStock Services Custom Business Unit
```

---

# 31. Deprecated Terminology

Istilah berikut tidak boleh digunakan sebagai canonical terminology baru.

## Curated Originals

Deprecated.

Alasan:

Mencampurkan external curation dengan internal IP.

Gunakan:

```text
TeeStock Selects
```

untuk curated external/third-party work.

Gunakan:

```text
TeeStock Originals
```

untuk internal IP.

---

## Custom Atelier

Deprecated sebagai canonical business-line name.

Boleh digunakan sebagai:

- campaign concept,
- editorial language,
- atau UX theme.

Canonical business-line name:

```text
TeeStock Custom
```

---

## Blank Retail

Deprecated sebagai brand/business-line name.

Gunakan:

```text
TeeStock Essentials
```

untuk consumer retail.

Gunakan:

```text
TeeStock Supply
```

untuk B2B.

---

## Blank Wholesale

Deprecated sebagai business-line name.

Gunakan:

```text
TeeStock Supply
```

---

## Creator Collaboration as Business Pillar

Deprecated.

Creator Collaboration adalah:

- collaboration format,
- dan/atau Creator Program mechanism.

Bukan standalone business pillar.

---

## Reseller as Sub-Brand

Tidak digunakan.

Reseller adalah Program/distribution mechanism.

---

# 32. Canonical Classification Rules

Gunakan pertanyaan ini ketika menentukan classification.

### Apakah customer membeli produk siap jadi?

```text
Commerce
```

### Apakah customer meminta TeeStock mengerjakan sesuatu?

```text
Services
```

### Apakah TeeStock menciptakan dan memiliki IP-nya?

```text
Originals
```

### Apakah pihak luar bergabung untuk menjual, membuat, atau mendistribusikan?

```text
Programs
```

### Apakah ini hanya tempat transaksi terjadi?

```text
Channel
```

### Apakah ini kelompok produk dengan story yang sama?

```text
Collection
```

### Apakah ini memiliki identity dan worldview sendiri?

```text
Independent Label
```

---

# 33. Product Classification Decision Tree

```text
START
│
├── Apakah IP internal TeeStock?
│        │
│        ├── YES
│        │    └── TeeStock Originals
│        │
│        └── NO
│
├── Apakah karya dipilih/kurasi TeeStock?
│        │
│        ├── YES
│        │    └── TeeStock Selects
│        │
│        └── NO
│
├── Apakah dibuat bersama external creator?
│        │
│        ├── YES
│        │    └── Collaboration
│        │
│        └── NO
│
└── Apakah design berasal dari customer?
         │
         └── YES
              └── TeeStock Custom
```

---

# 34. Organizational Classification Decision Tree

```text
NEW IDEA
│
├── Menjual product?
│      └── Commerce
│
├── Menjual capability?
│      └── Services
│
├── Membangun owned consumer IP?
│      └── Originals
│
├── Menghubungkan participant eksternal?
│      └── Programs
│
└── Hanya medium distribusi?
       └── Channel
```

---

# 35. Key Mental Models

Seluruh team dan AI agent harus memahami empat kalimat berikut:

```text
SELECTS
We curate it.

ORIGINALS
We create it.

COLLABORATIONS
We create it together.

CUSTOM
You create it. We make it.
```

Dan business architecture:

```text
COMMERCE
What customers can buy.

SERVICES
What TeeStock can do.

ORIGINALS
What TeeStock creates and owns.

PROGRAMS
How others participate.
```

---

# 36. Relationship Summary

```text
MULTIGRAPH GROUP
      │
      ▼
   TEESTOCK
      │
      ├── Commerce
      │    ├── Selects
      │    └── Essentials
      │
      ├── Services
      │    ├── Custom
      │    ├── Business
      │    ├── Merch
      │    ├── Studio
      │    ├── Supply
      │    └── Fulfill
      │
      ├── Originals
      │    ├── Collections
      │    └── Independent Labels
      │
      └── Programs
           ├── Creator
           ├── Reseller
           ├── Partner
           └── Affiliate
```

---

# 37. Governance

Jika dokumentasi baru membutuhkan istilah yang belum tersedia:

1. cek apakah konsep tersebut sebenarnya sudah memiliki canonical term;
2. hindari membuat synonym baru;
3. jika benar-benar merupakan konsep baru, tambahkan definition;
4. jika perubahan berdampak pada business architecture, masukkan ke Decision Register;
5. update version dokumen.

Glossary harus berkembang bersama TeeStock, tetapi perubahan istilah fundamental tidak boleh dilakukan tanpa alasan strategis.

---

# 38. Dependency

Dokumen berikut wajib menggunakan terminology dari Glossary ini:

- `01-strategy/business-thesis.md`
- `01-strategy/business-model.md`
- `01-strategy/ecosystem-architecture.md`
- `02-brand/brand-architecture.md`
- seluruh dokumen Commerce,
- seluruh dokumen Services,
- seluruh dokumen Originals,
- seluruh dokumen Programs,
- seluruh data model MGBOS.

Jika istilah dalam dokumen lain tidak sesuai dengan Glossary, Glossary memiliki precedence kecuali terdapat Decision Register yang secara resmi mengubah definisinya.