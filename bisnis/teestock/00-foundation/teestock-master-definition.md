---
title: "TeeStock Master Definition"
date: "2026-09-27"
bisnis: teestock
kategori: catatan
status: active
tags:
  - bisnis/teestock
  - kategori/catatan
  - teestock/canonical
  - teestock/foundation
document_id: "TS-FND-001"
version: "2.0"
canonical_id: teestock.foundation.master-definition
document_class: canonical-business-definition
owner: Founder / Owner
approver: Founder / Owner (strategic direction)
author: ChatGPT / AI Co-Founder
scope: teestock-business-identity-and-domain-boundaries
effective_from: "2026-10-20"
supersedes: "TS-FND-001@1.0"
primary_business_positioning: CURATED_DESIGN_APPAREL
primary_commercial_domain: COMMERCE
primary_product_line: TEESTOCK_SELECTS
supporting_product_line: TEESTOCK_ESSENTIALS
services_business_role: SECONDARY_AND_SEPARATELY_GOVERNED
originals_business_role: LONG_TERM_OWNED_IP
four_domain_architecture: UNCHANGED
retail_checkout_readiness: NOT_ASSERTED
operational_readiness: NOT_ASSERTED
implementation_authorization: NONE
source_baseline:
  repository: Rizkybuilds/bisnishub
  main_sha: 8c7731a13867f38b391ea2f38e9ae7b1f0a7e540
  file_blob_sha: 7327f5dfea8fbc745872adca0e680b5873be0145
source_decision_reconciliation:
  owner_direction_date: "2026-10-20"
  dec_009: ACTIVE_PRIOR_OPERATING_PRIORITY_RECONCILIATION_REQUIRED
  dec_011: COMPATIBLE_RETAIL_PRESENTATION_BUT_NOT_SUFFICIENT
  dec_012: PROPOSED_REGISTRATION_NOT_OBSERVED_ON_MAIN
  no_automatic_supersession: true
not_authoritative_for:
  - MGBOS transaction schemas, invariants, security or domain state machines
  - Technical implementation sequencing and engineering authorization
  - Readiness to accept retail payments or real customer orders
  - Production, legal/IP, pricing, stock, return or delivery approvals
  - MultiGraph business operating policies
last_reviewed: "2026-10-20"
review_cadence: after-material-owner-decision-or-affected-canonical-reconciliation
category: "foundation"
business: "teestock"
last_updated: "2026-10-20"
path: "00-foundation/teestock-master-definition.md"
---


# TeeStock Master Definition v2.0

> [!abstract] **Canonical Foundation Document  **
> Dokumen ini mendefinisikan **TeeStock sebagai brand apparel berbasis kurasi desain (curated-design-first)**: apa nilai utamanya, siapa pelanggan utamanya, bagaimana Commerce diprioritaskan, dan bagaimana Services, Originals, Programs, teknologi serta operasional mendukungnya tanpa mengubah ownership sistem lain.

## Machine Reading Contract — TS-FND-001 v2.0

- **Authority:** Identitas, proposisi nilai, prioritas domain bisnis, dan batas brand TeeStock. Dokumen ini bukan spesifikasi MGBOS, kontrak checkout, atau sertifikat kesiapan produksi.
- **Owner direction (2026-10-20):** TeeStock berfokus pada **kurasi desain dan penjualan apparel hasil kurasi**, bukan jasa Business/Custom sebagai identitas utama.
- **Primary business:** TeeStock Commerce; untuk daya tarik desain, **TeeStock Selects** menjadi fokus utama; **Essentials** mendukung kualitas dan pilihan apparel dasar. Sumber desain bisa berlisensi, kolaboratif, commissioned atau dimiliki sendiri, sesuai kebijakan IP.
- **Secondary or future capabilities:** TeeStock Services, Originals, Programs tetap bagian dari arsitektur empat domain; keberadaan domain tidak berarti semua layanan harus aktif, dipromosikan setara, atau dibangun sekaligus.
- **Precedence and unresolved reconciliation:** `DEC-TS-2026-009` masih mencatat Business/Custom sebagai prioritas *operational vertical slice* Q4, sedangkan `DEC-TS-2026-011` menetapkan retail-first pada *presentation*. Keputusan curated-first yang disampaikan Owner menjelaskan *business primacy* dan memerlukan sinkronisasi dengan Decision Register serta roadmap, **tanpa diam-diam membatalkan pilot lama atau mengubah readiness gates**. Catatan kandidat: `bisnis/teestock/00-foundation/decision-2026-012-curated-design-first.md` (belum terlihat di `main` pada baseline pemeriksaan).
- **No readiness inference:** `CURATED_DESIGN_STRATEGY_APPROVED` **tidak sama** dengan `RETAIL_CHECKOUT_READY`, `PAYMENT_READY`, `STOCK_VERIFIED`, `PRODUCTION_READY`, atau `PILOT_AUTHORIZED`.
- **Validation vs brand:** Uji Business/Custom MGBOS dapat tetap dipakai untuk menguji operating spine dalam batas kontraknya. Uji tersebut **bukan bukti permintaan pasar terhadap curated design** dan tidak boleh dijadikan KPI utama brand.
- **State discipline:** `CURRENT`, `TARGET`, `PROPOSED` dan `NOT_VERIFIED` harus dibedakan untuk setiap klaim implementasi; sumber kode, migration, CI dan bukti operasional diperlukan untuk membuktikan realitas sistem.
- **Source baseline:** `main` @ `8c7731a13867f38b391ea2f38e9ae7b1f0a7e540`; file blob `7327f5dfea8fbc745872adca0e680b5873be0145` (20 Oktober 2026). Perubahan `main` sesudah baseline harus direkonsiliasi sebelum dipakai sebagai otoritas terkini.


---

# 1. Purpose of This Document

Dokumen ini adalah **sumber definisi tertinggi TeeStock**.

Semua keputusan berikut harus konsisten dengan dokumen ini:

- business strategy,
- brand architecture,
- product strategy,
- Commerce,
- Services,
- Originals,
- creator/reseller programs,
- operations,
- finance,
- marketing,
- technology,
- automation,
- MGBOS,
- dan ekspansi bisnis TeeStock.

Jika terdapat dokumen lain yang bertentangan dengan dokumen ini, maka dokumen tersebut harus:

1. direvisi;
2. dinyatakan `SUPERSEDED`; atau
3. dibawa menjadi keputusan strategis baru melalui Decision Register.

---

# 2. Canonical Definition

## TeeStock adalah apa?

> **TeeStock adalah curated-design-first apparel brand dan consumer commerce business yang menciptakan nilai melalui pemilihan karya/desain yang relevan, penyusunan koleksi, standar produk apparel, storytelling, dan pengalaman pembelian tepercaya.**

Dalam bentuk sederhana:

> **TeeStock memilih dan menyajikan desain apparel yang layak diinginkan, dikenakan, dan dibeli customer—bukan terutama menerima jasa sablon atau pesanan custom.**

TeeStock dibangun di atas arsitektur jangka panjang Commerce, Services, Originals dan Programs, ditopang oleh sourcing, produksi/vendor, QC, fulfillment, data dan MGBOS. Arsitektur luas ini menjelaskan **kemampuan yang mungkin diperlukan**, bukan kewajiban menampilkan seluruh lini dengan prioritas setara sejak awal.

**Orientasi operasional dan komersial yang harus dibedakan:**

| Dimensi | Prioritas TeeStock | Batas interpretasi |
|---|---|---|
| Brand promise | Desain terkurasi, karakter koleksi, garment yang baik, dan pengalaman retail | Bukan *print shop* generik |
| Produk utama | Apparel dari desain pilihan TeeStock (terutama Selects) | Tidak otomatis berarti desain/IP dimiliki TeeStock |
| Jalur pelanggan | Discover collection → pahami produk/fit → pilih produk yang *eligible* → pembelian melalui jalur yang diizinkan | Preview katalog tidak otomatis mengaktifkan checkout |
| Lini penunjang | Essentials, lalu Services/Programs/Originals sesuai bukti dan kemampuan | Tidak menjadi ukuran keberhasilan utama brand di tahap awal |
| Operational backbone | MGBOS dan mitra produksi yang terkontrol | Tidak mengubah canonical domain model atau memberi AI hak mutasi langsung |

TeeStock membangun sistem untuk:

```text
DISCOVER
↓
DESIGN
↓
SOURCE
↓
PRODUCE
↓
SELL
↓
FULFILL
↓
ANALYZE
↓
ITERATE
```

untuk produk TeeStock sendiri maupun pihak lain.

---

# 3. Long-Term Vision

## Vision

> **Menjadi apparel commerce dan brand infrastructure yang memungkinkan produk, kreator, komunitas, bisnis, dan consumer brands berkembang di atas satu operating ecosystem.**

**North star saat ini:** menjadi destinasi apparel desain terkurasi yang dipercaya, dipilih karena *taste*, kualitas, dan pengalaman pembeliannya. Kemampuan Services, Programs serta infrastruktur brand merupakan opsi jangka panjang, bukan pesaing terhadap tujuan ini.

Evolusi konseptual yang mungkin—**bukan urutan implementasi atau komitmen peluncuran**:

```text
CURATED DESIGN APPAREL BRAND (PRIMARY)
        ↓
VALIDATED COLLECTIONS + TRUSTED CUSTOMER EXPERIENCE
        ↓
REPEATABLE RETAIL COMMERCE + RESPONSIBLE FULFILLMENT
        ↓
SELECTIVE ORIGINALS / COLLABORATIONS / SUPPORTING SERVICES
        ↓
OPTIONAL BROADER APPAREL COMMERCE ECOSYSTEM
```

Tujuan utamanya **bukan memperbanyak katalog, service line, atau teknologi**. TeeStock harus terlebih dahulu membuktikan bahwa koleksi desain terpilih menciptakan permintaan pembelian yang nyata, kualitas terpenuhi dan economics masuk akal. Ekspansi domain hanya terjadi dengan alasan strategis dan readiness yang dapat diverifikasi.

---

# 4. Mission

TeeStock memiliki lima misi berurutan menurut prioritas brand. Pemetaan misi ini tidak menghapus Services, Originals atau Programs dari arsitektur bisnis.

### 4.1 Curate Designs with a Point of View

Memilih, mengevaluasi, dan menyusun karya grafis/desain apparel yang memiliki relevansi, kualitas kreatif, identitas, dan bukti hak penggunaan yang memadai. Kurasi mengutamakan kualitas pilihan dan keterpaduan koleksi, bukan jumlah SKU.

### 4.2 Deliver Wearable, Trustworthy Products

Menghadirkan apparel dengan material, fit, hasil cetak, ukuran, kenyamanan, durability, dan QC yang dapat dipertanggungjawabkan. Desain menarik tanpa kualitas garment yang baik bukan pengalaman TeeStock yang berhasil.

### 4.3 Create a Distinctive Retail Experience

Membantu pelanggan menemukan desain, memahami cerita/produk dan memilih ukuran/varian dengan informasi yang benar. Pengalaman premium mencakup kecepatan, aksesibilitas, kejelasan harga dan kebijakan, serta bantuan ketika dibutuhkan—bukan gimmick fitur.

### 4.4 Build Responsible Creative Value

Mengembangkan kerja sama kreator, licensed artwork, commission, kolaborasi, dan secara selektif intellectual property internal melalui Originals. Provenance dan hak komersial mengikuti kebijakan IP, tidak disimpulkan hanya dari publikasi desain.

### 4.5 Operate Lean and Reuse Reliable Capabilities

Mengutamakan modal yang hemat, vendor/production governance, fulfillment, pencatatan finansial, data, dan otomatisasi yang meminimalkan beban founder. Services dan Programs **MAY** berkembang jika benar-benar memperkuat bisnis inti atau terbukti layak secara mandiri; keduanya tidak menjadi pusat identitas awal TeeStock.

---

# 5. Strategic Thesis

TeeStock dibangun berdasarkan keyakinan bahwa nilai apparel tercipta bukan hanya dari kain atau proses cetak, tetapi juga dari **selera kurasi desain, kepercayaan pada produk, dan konteks brand**. Empat lapisan nilai berikut tetap berguna untuk pemetaan ekonomi jangka panjang. Untuk tahap ini, **Commerce yang dipimpin kurasi desain** adalah fokus produk dan komersial utama; kapabilitas lain melayaninya.

Nilai dapat tercipta pada empat lapisan:

```text
PRODUCT
+
CAPABILITY
+
DISTRIBUTION
+
INTELLECTUAL PROPERTY
```

## Product

Apparel yang benar-benar dibeli customer.

## Capability

Kemampuan untuk:

- sourcing,
- design,
- production,
- QC,
- packaging,
- fulfillment,
- dan customer service.

## Distribution

Kemampuan membawa produk ke pasar melalui:

- TeeStock storefront,
- marketplace,
- creators,
- reseller,
- affiliate,
- partner,
- dan independent label.

## Intellectual Property

Brand, design system, story, community, dan consumer identity yang dapat menghasilkan nilai jangka panjang.

TeeStock dirancang untuk membangun seluruh lapisan tersebut secara bertahap.

---

# 6. Core Business Architecture

TeeStock memiliki empat domain utama:

```text
TEESTOCK
│
├── 01. COMMERCE
│
├── 02. SERVICES
│
├── 03. ORIGINALS
│
└── 04. PROGRAMS
```

Setiap domain memiliki fungsi berbeda.

**Architecture ≠ equal priority.** `COMMERCE` adalah jalur komersial/brand primer. `SERVICES` merupakan penawaran berbeda yang tidak boleh ditampilkan sebagai definisi utama TeeStock. `ORIGINALS` adalah ruang pembentukan IP internal secara selektif, sedangkan `PROGRAMS` memperluas partisipasi jika sudah layak. Empat domain **MUST NOT** dilebur menjadi entitas/domain transaksional baru hanya karena prioritas bisnis berubah.

---

# 7. TeeStock Commerce

## Definition

> **TeeStock Commerce adalah bisnis retail apparel utama TeeStock yang memasarkan desain yang telah melalui kurasi kreatif, pemeriksaan kelayakan IP, pemilihan garment, dan standar kualitas produk.**

Commerce menjawab pertanyaan:

> **“Desain dan produk TeeStock mana yang ingin gue pakai, dan bagaimana gue dapat membelinya secara jelas serta aman?”**

*Curated design* adalah kriteria nilai dan merchandising lintas produk, **bukan klaim bahwa semua artwork adalah original milik TeeStock**. Koleksi yang dipamerkan belum tentu otomatis eligible untuk order, reservasi stok, atau pembayaran.

Untuk tahap awal, prioritas Commerce adalah: (1) memilih desain yang sah untuk penggunaan komersial, (2) membentuk koleksi yang kohesif, (3) memastikan kualitas sampel/garment, (4) memvalidasi minat atau transaksi melalui jalur yang disetujui, dan (5) mencatat economics dan pengalaman pelanggan. Keputusan membuat checkout otomatis **MUST** menunggu kesiapan harga, stok/kapasitas, payment, fulfillment dan kebijakan customer.

Lihat kebijakan detail di `bisnis/teestock/03-commerce/teestock-selects.md`, `bisnis/teestock/03-commerce/catalog-merchandising-system.md`, serta `bisnis/teestock/12-legal-ip/ip-policy.md`; dokumen ini tidak menyalin seluruh aturan teknisnya.

Struktur utama:

```text
TEESTOCK COMMERCE
│
├── TeeStock Selects
└── TeeStock Essentials
```

---

## 7.1 TeeStock Selects

> **We curate it.**

TeeStock Selects berisi karya dan produk grafis yang dipilih melalui proses kurasi TeeStock.

Sumber dapat berasal dari:

- licensed artwork,
- creator submissions,
- artist collaboration,
- freelance commissioned artwork,
- selected external works,
- dan curated design sources lain yang sah.

Core value:

> **Curated relevance, distinctive taste, lawful design rights, and consistent product quality—not design volume.**

Dalam prioritas awal, Selects adalah jalur utama pembentukan koleksi dan eksperimen demand. Approval desain, klasifikasi lisensi, sampel fisik, kelayakan produksi dan status publikasi **MUST** dapat dibedakan. Desain yang bagus tetapi hak pakainya tidak jelas tidak layak ditawarkan secara komersial.

Selects memungkinkan TeeStock mempunyai katalog luas tanpa mengklaim bahwa seluruh karya tersebut merupakan intellectual property internal TeeStock.

---

## 7.2 TeeStock Essentials

> **We select the fundamentals.**

TeeStock Essentials adalah consumer-facing apparel basics.

Contoh:

- essential tee,
- heavyweight tee,
- soft tee,
- oversized tee,
- hoodie,
- crewneck,
- dan basic apparel lainnya.

Essentials berfokus pada:

- material,
- fitting,
- comfort,
- consistency,
- dan everyday use.

Essentials mendukung kredibilitas garment dan pilihan apparel dasar; tidak otomatis mengambil prioritas dari curated graphic collection tanpa bukti kebutuhan pelanggan.

Essentials berbeda dengan **TeeStock Supply**.

```text
ESSENTIALS
Consumer apparel

SUPPLY
Business sourcing
```

Produk fisiknya dapat memiliki supplier yang sama, tetapi fungsi bisnis dan pengalaman customer berbeda.

---

# 8. TeeStock Services

## Definition

> **TeeStock Services adalah capability layer yang membantu individu, creator, organisasi, dan bisnis membuat serta mengoperasikan apparel atau merchandise.**

**Posisi strategis (2026-10-20):** Services tetap domain yang sah tetapi **sekunder terhadap curated-design commerce**. Kebutuhan teknis untuk membuktikan alur Business/Custom MGBOS tidak berarti TeeStock harus dipasarkan atau direncanakan terutama sebagai penyedia jasa custom printing. Scope operasi Services harus melalui readiness, economics, kapasitas founder, dan prioritas yang disetujui secara terpisah. MultiGraph tetap mempunyai identitas printing services sendiri.

Services menjawab:

> **“Apa yang bisa TeeStock kerjakan untuk gue?”**

Long-term architecture:

```text
TEESTOCK SERVICES
│
├── TeeStock Custom
├── TeeStock Business
├── TeeStock Merch
├── TeeStock Studio
├── TeeStock Supply
└── TeeStock Fulfill
```

---

## 8.1 TeeStock Custom

Apparel custom untuk:

- individu,
- komunitas,
- event,
- kelompok kecil,
- dan kebutuhan personal.

Customer membawa ide.

TeeStock membantu mewujudkannya menjadi produk.

---

## 8.2 TeeStock Business

Apparel dan merchandise solution untuk organisasi.

Target:

- perusahaan,
- startup,
- hospitality,
- sekolah,
- agency,
- event organizer,
- community organization,
- dan institutional buyers.

---

## 8.3 TeeStock Merch

Merchandise infrastructure untuk:

- creator,
- artist,
- personal brand,
- media,
- musician,
- community,
- dan intellectual property owner.

TeeStock dapat menangani:

```text
PRODUCT
↓
PRODUCTION
↓
COMMERCE
↓
ORDER
↓
FULFILLMENT
```

---

## 8.4 TeeStock Studio

Creative capability khusus apparel dan merchandise.

Dapat menangani:

- apparel graphics,
- merchandise concepts,
- branding,
- packaging,
- mockups,
- campaign assets,
- tech packs,
- dan product development.

Studio juga berfungsi sebagai creative engine internal TeeStock Originals.

---

## 8.5 TeeStock Supply

B2B supply capability.

Customer dapat berupa:

- clothing brand,
- print shop,
- garment,
- sablon business,
- reseller,
- merchandise vendor,
- dan production partner.

Supply berorientasi kepada kebutuhan bisnis, bukan consumer retail.

---

## 8.6 TeeStock Fulfill

Operating infrastructure untuk:

- inventory,
- production coordination,
- packing,
- shipping,
- order handling,
- dan fulfillment.

Long-term proposition:

> **Build and sell without operating the entire physical backend yourself.**

---

# 9. TeeStock Originals

## Definition

> **TeeStock Originals adalah consumer intellectual property dan brand creation division milik TeeStock.**

Canonical principle:

> **We create it.**

Hanya karya atau brand yang intellectual property-nya dimiliki atau dikembangkan secara internal oleh TeeStock yang boleh menggunakan klasifikasi:

> **TeeStock Original**

Ini adalah perbedaan mendasar dengan TeeStock Selects.

```text
SELECTS
We curate it.

ORIGINALS
We create it.
```

---

# 10. Structure of TeeStock Originals

```text
TEESTOCK ORIGINALS
│
├── Collections
│
└── Independent Labels
```

---

## 10.1 Originals Collections

Collection adalah media eksperimen TeeStock.

Contoh:

```text
Collection 001
RAW IDENTITY

Collection 002
START ANYWAY

Collection 003
AFTER HOURS
```

Collection dapat menguji:

- design language,
- philosophy,
- audience,
- storytelling,
- pricing,
- product,
- dan market response.

Collection tidak otomatis menjadi independent brand.

---

## 10.2 Independent Labels

Independent Label adalah consumer brand yang memiliki:

- core belief,
- worldview,
- audience,
- independent identity,
- visual language,
- tone of voice,
- product universe,
- storytelling,
- dan long-term potential.

Contoh konsep awal:

```text
TEESTOCK ORIGINALS
│
├── DO YOUR BEST
├── WORK IN PROGRESS
└── AFTER HOURS CLUB
```

Status nama-nama tersebut tetap mengikuti proses brand incubation sebelum menjadi label resmi.

---

# 11. Originals as Brand Incubator

TeeStock Originals harus beroperasi menggunakan prinsip:

```text
INSIGHT
↓
CONCEPT
↓
COLLECTION
↓
MARKET TEST
↓
DATA
↓
VALIDATION
↓
INDEPENDENT LABEL
```

Artinya:

> TeeStock tidak membangun brand hanya karena sebuah nama atau desain terasa menarik.

Brand harus mendapatkan alasan strategis untuk hidup.

---

# 12. TeeStock Programs

## Definition

> **Programs adalah mekanisme participation, partnership, dan distribution yang memperluas ecosystem TeeStock tanpa harus menjadi business line atau consumer brand tersendiri.**

Programs menjawab:

> **“Bagaimana pihak luar bisa berpartisipasi dan menghasilkan nilai bersama TeeStock?”**

Architecture:

```text
TEESTOCK PROGRAMS
│
├── Creator Program
├── Reseller Program
├── Partner Program
└── Affiliate Program
```

---

## 12.1 Creator Program

Memberikan jalur bagi creator melalui:

```text
Artwork Submission
Royalty
Co-Drop
Creator Collaboration
Creator Merch
```

---

## 12.2 Reseller Program

Memungkinkan pihak lain menjual produk melalui:

- reseller,
- dropship,
- bulk purchase,
- atau white-label arrangements.

---

## 12.3 Partner Program

Hubungan dengan pihak yang memberikan capability kepada ecosystem.

Contoh:

- garment partner,
- printing partner,
- logistics partner,
- production partner,
- dan specialist vendors.

---

## 12.4 Affiliate Program

Distribution program berbasis referral atau sales attribution tanpa menjadikan affiliate sebagai reseller maupun operational partner.

---

# 13. The Four Canonical Product Relationships

Untuk menghindari kebingungan internal, seluruh produk/desain harus dapat diklasifikasikan dengan mental model berikut:

```text
TEESTOCK SELECTS
We curate it.

TEESTOCK ORIGINALS
We create it.

TEESTOCK COLLABORATIONS
We create it together.

TEESTOCK CUSTOM
You create it. We make it.
```

Ini merupakan salah satu aturan klasifikasi paling penting di TeeStock.

---

# 14. Customer Groups

TeeStock memiliki beberapa kelompok pelanggan berdasarkan arsitektur jangka panjang, **namun bukan semuanya audiens yang sama penting pada tahap awal**. Prioritas pengalaman produk, riset demand, dan kurasi ditujukan terlebih dahulu kepada **consumer yang membeli apparel desain terkurasi**. Segmentasi organisasi, Custom, creator, dan partner bersifat layanan/ekspansi tersendiri dan tidak boleh memindahkan fokus brand secara implisit.

TeeStock melayani beberapa kelompok berbeda.

## Consumer

Membeli apparel untuk digunakan sendiri.

Biasanya berinteraksi dengan:

- Selects,
- Essentials,
- Originals.

---

## Custom Customer

Ingin membuat apparel sendiri.

Berinteraksi dengan:

- Custom,
- Studio.

---

## Organization

Membutuhkan apparel atau merchandise untuk kepentingan institusi.

Berinteraksi dengan:

- Business,
- Studio,
- Fulfill.

---

## Creator

Memiliki:

- artwork,
- audience,
- intellectual property,
- atau community.

Berinteraksi dengan:

- Creator Program,
- Merch,
- Studio,
- Fulfill.

---

## Apparel Business

Membutuhkan:

- blank apparel,
- production,
- fulfillment,
- atau white-label infrastructure.

Berinteraksi dengan:

- Supply,
- Fulfill,
- Merch.

---

## Partner

Memberikan external capability terhadap ecosystem TeeStock.

---

# 15. Shared Infrastructure Principle

Semua domain TeeStock sebisa mungkin menggunakan shared infrastructure.

```text
                    TEESTOCK
                       │
        ┌──────────────┼──────────────┐
        │              │              │
     COMMERCE       SERVICES       ORIGINALS
        │              │              │
        └──────────────┼──────────────┘
                       │
                       ▼
             SHARED INFRASTRUCTURE
                       │
         ┌─────────────┼─────────────┐
         │             │             │
      SUPPLY       PRODUCTION    COMMERCE
         │             │             │
         ├─────────────┼─────────────┤
         │             │             │
       DATA         FINANCE      FULFILLMENT
         │             │             │
         └─────────────┴─────────────┘
                       │
                     MGBOS
```

Tujuan:

> membangun capability sekali lalu menggunakannya berulang kali.

---

# 16. TeeStock's Three Engines

Secara strategis TeeStock dapat dipahami sebagai tiga engine.

---

## 16.1 Demand Engine

Menciptakan alasan bagi customer untuk datang; prioritas pertama adalah **kurasi desain yang membuat apparel TeeStock dipilih karena desain dan koleksinya**, kemudian fit, kualitas dan brand trust.

Contoh (urutan awal bukan kewajiban semua diluncurkan):

- Selects / curated design collections (primary),
- Essentials (supporting),
- Originals (selective later),
- collaborations (rights and demand gated),
- creator merchandise (optional and independently validated).

---

## 16.2 Capability Engine

Memastikan permintaan dapat dieksekusi.

Contoh:

- sourcing,
- Studio,
- production,
- Supply,
- Custom,
- Fulfill.

---

## 16.3 Distribution Engine

Membawa produk ke customer.

Contoh:

- TeeStock storefront,
- marketplaces,
- creators,
- reseller,
- affiliate,
- independent labels,
- partner storefronts.

Ketiganya membentuk flywheel:

```text
DEMAND
↓
ORDERS
↓
PRODUCTION VOLUME
↓
BETTER CAPABILITY
↓
BETTER ECONOMICS
↓
MORE PRODUCTS & EXPERIMENTS
↓
MORE DISTRIBUTION
↓
MORE DEMAND
```

---

# 17. TeeStock as a Learning System

TeeStock harus memperlakukan aktivitas commerce bukan hanya sebagai transaksi.

Commerce juga menghasilkan:

> **market intelligence.**

Contoh:

```text
TeeStock Selects
↓
Customer Behaviour
↓
Niche Performance
↓
Design Preference
↓
Pricing Response
↓
Market Insight
↓
Originals Experiment
↓
Potential Independent Label
```

Dengan demikian:

> **Commerce dapat menjadi discovery engine bagi Originals.**

Data nyata customer lebih penting daripada asumsi internal ketika menentukan brand mana yang layak dikembangkan. **Interest metrics tidak sama dengan pembelian, pembelian pertama tidak sama dengan repeat demand, dan uji jasa custom tidak sama dengan validasi curated-product demand**. Jangan mengklaim conversion, returns, margin atau seller readiness dari prototype atau synthetic data.

---

# 18. Relationship with MultiGraph Group

TeeStock merupakan bagian dari ecosystem MultiGraph Group.

Canonical relationship:

```text
MULTIGRAPH GROUP
│
├── MultiGraph
│   Printing & Production Capabilities
│
├── TeeStock
│   Apparel & Merchandise Ecosystem
│
└── Future Business Units
```

MultiGraph dan TeeStock bukan brand yang harus terlihat sama di mata customer. **TeeStock dipimpin oleh curated-design apparel commerce**, sedangkan **MultiGraph memegang positioning printing dan solusi produksi** sesuai dokumen bisnis MultiGraph. Keduanya merupakan pilot internal BisnisHub yang dapat diverifikasi secara paralel dengan syarat tidak menciptakan dua sumber kebenaran transaksi.

MultiGraph saat ini masih tercatat sebagai supporting arm pada `bisnis/multigraph/README.md`; layanan eksternal MultiGraph tidak boleh dianggap aktif tanpa kesiapan operasional dan keputusan tersendiri. Peran produksi bersama atau supply internal tidak menghapus perbedaan brand dan unit economics.

Keduanya dapat memiliki:

- positioning,
- audience,
- experience,
- dan brand identity

yang berbeda.

Namun mereka dapat berbagi:

- infrastructure,
- production capabilities,
- technology,
- finance system,
- procurement,
- data,
- automation,
- dan MGBOS.

---

# 19. Relationship with MGBOS

MGBOS adalah internal business operating infrastructure.

TeeStock merupakan salah satu business unit yang berjalan di atasnya.

**Catatan untuk AI:** Diagram di bawah ini adalah peta business-conceptual, **bukan** skema entitas/tabel yang dipastikan telah diimplementasikan di MGBOS. MGBOS domain map, state machines, invariants, organization isolation dan authorization tetap menjadi pemilik semantik sistem. Jangan membuat `BUSINESS UNIT`, `LABEL`, `COLLECTION`, `SKU`, atau agregat baru hanya berdasarkan diagram ini.

High-level conceptual relationship:

```text
ORGANIZATION
MultiGraph Group
│
└── BUSINESS UNIT
    TeeStock
    │
    ├── BUSINESS LINE
    ├── COMMERCE LINE
    ├── BRAND DIVISION
    ├── PROGRAM
    ├── LABEL
    ├── COLLECTION
    ├── PRODUCT
    ├── VARIANT
    └── SKU
```

MGBOS secara bertahap harus mampu menangani:

- customer,
- creators,
- partners,
- suppliers,
- products,
- brands,
- labels,
- inventory,
- orders,
- production jobs,
- fulfillment,
- finance,
- marketing,
- experiments,
- dan analytics.

TeeStock tidak boleh membangun operational data model yang terisolasi dari canonical architecture MGBOS tanpa alasan yang jelas.

---

# 20. Asset-Light Principle

TeeStock tidak harus memiliki semua capability secara fisik sejak awal.

TeeStock dapat menggunakan kombinasi:

```text
OWN
+
PARTNER
+
AUTOMATE
```

Capability hanya diinternalisasi jika memberikan keuntungan jelas dalam:

- quality,
- margin,
- speed,
- reliability,
- customer experience,
- atau strategic control.

Karena itu TeeStock dapat berkembang secara asset-light tanpa kehilangan kendali terhadap customer experience.

---

# 21. Product Before Infrastructure

TeeStock tidak boleh membangun sistem kompleks hanya karena secara teknologi memungkinkan.

Prinsip:

> **Demand before infrastructure.**

Urutan:

```text
MANUAL
↓
VALIDATE
↓
STANDARDIZE
↓
AUTOMATE
↓
PLATFORMIZE
```

Contoh:

jangan membangun creator SaaS multi-tenant sebelum ada creator yang benar-benar membutuhkan dan menghasilkan transaksi.

Untuk **curated-design-first**, urutkan secara proporsional:

```text
RIGHTS + CURATION POLICY
    ↓
BOUNDED COLLECTION + GARMENT / PRINT FEASIBILITY
    ↓
HONEST PRODUCT DISCOVERY / DEMAND EXPERIMENT
    ↓
CONTROLLED ORDER + PAYMENT + FULFILLMENT (ONLY WHEN READY)
    ↓
REPEAT LEARNING → MORE COLLECTIONS / AUTOMATION
```

Jalur pertama dapat menggunakan validasi assisted/limited tanpa menunggu storefront retail penuh. Namun tidak boleh mengiklankan harga, stok, checkout atau SLA yang belum diverifikasi. **Business/Custom operational pilot yang telah direncanakan dalam dokumen `ACTIVE` (namun pelaksanaannya tetap gated) tidak menjadi default pengganti curated-product pilot.**

---

# 22. Brand Before Scale

Volume bukan satu-satunya tujuan.

TeeStock juga harus membangun:

- trust,
- customer relationship,
- brand equity,
- design taste,
- production reputation,
- dan intellectual property.

Pertumbuhan yang merusak pengalaman customer atau positioning harus dianggap sebagai pertumbuhan berkualitas rendah.

---

# 23. What TeeStock Is Not

Untuk menjaga fokus, TeeStock bukan:

### General Marketplace

TeeStock tidak bertujuan menjadi marketplace terbuka di mana siapa pun dapat mengunggah apa pun tanpa kurasi.

### General Printing Company

Walaupun memiliki capability produksi, TeeStock bukan pengganti MultiGraph sebagai general printing business.

### Business/Custom-First Print Service Brand

TeeStock **bukan** terutama layanan B2B quotation, sablon pesanan, atau percetakan apparel sesuai file customer. Layanan Custom/Business dapat ada dalam domain Services ketika relevan dan layak, namun tidak mengambil alih identitas curated-design retail.

### Pure Streetwear Label

TeeStock master brand memiliki scope lebih luas daripada sebuah fashion label tunggal.

Independent fashion identities dikelola melalui TeeStock Originals.

### Random POD Store

Jumlah desain bukan tujuan utama.

Curated relevance lebih penting daripada katalog besar tanpa identitas.

### Technology Company First

Software adalah infrastructure untuk memperkuat business model.

Bukan alasan utama TeeStock ada.

---

# 24. Strategic Boundaries

Setiap peluang baru harus diuji dengan pertanyaan:

### Apakah masih berkaitan dengan apparel atau merchandise ecosystem?

### Apakah menggunakan atau memperkuat capability TeeStock?

### Apakah memperkuat demand, capability, distribution, atau IP?

### Apakah dapat dioperasikan secara sustainable?

### Apakah menciptakan leverage atau hanya menambah kompleksitas?

Jika mayoritas jawabannya tidak, peluang tersebut kemungkinan berada di luar scope TeeStock.

**Additional focus gate:** Apakah peluang ini meningkatkan nilai desain terkurasi, kualitas apparel, kepercayaan pelanggan, repeat purchase, atau bukti economics Commerce? Peluang Services/Programs yang tidak menjawab pertanyaan ini memerlukan keputusan eksplisit sebagai lini terpisah; keberadaan kemampuan MGBOS tidak cukup sebagai alasan bisnis.

---

# 25. Core Operating Principles

TeeStock mengikuti prinsip berikut.

## 25.1 Customer Value Before Complexity

Jangan menambah fitur yang tidak memperbaiki pengalaman atau economics.

## 25.2 Validate Before Scale

Buktikan demand terlebih dahulu.

## 25.3 Shared Infrastructure

Hindari duplikasi capability.

## 25.4 Clear Ownership

Setiap design, brand, dan IP harus memiliki ownership yang jelas.

## 25.5 Data Over Assumption

Gunakan transaksi dan customer behavior untuk memperbaiki keputusan.

## 25.6 Brand Architecture Discipline

Tidak setiap produk menjadi collection.

Tidak setiap collection menjadi brand.

Tidak setiap capability menjadi sub-brand.

Tidak setiap channel menjadi business line.

## 25.7 Operational Transparency

Cost, inventory, margin, SLA, dan performance harus dapat diukur.

## 25.8 Automation After Standardization

Proses yang kacau tidak boleh langsung diotomatisasi.

Standarisasi terlebih dahulu.

---

# 26. Economic Layers

TeeStock memiliki empat jenis value creation yang berbeda.

```text
SERVICES
→ Monetize capability

COMMERCE
→ Monetize product & curation

SUPPLY / FULFILLMENT
→ Monetize infrastructure & volume

ORIGINALS
→ Build and monetize intellectual property
```

Masing-masing memiliki economics yang berbeda dan harus dilacak secara terpisah.

Untuk prioritas awal TeeStock, **jangan campurkan** penjualan dan margin curated apparel dengan revenue atau eksperimen Business/Custom. Catat biaya hak artwork/royalti bila ada, blank garment, produksi/cetak, QC, packaging, pembayaran, marketplace, ongkir/subsidi, returns/rework, dan waktu founder sesuai kebijakan finansial yang berlaku. Jangan menetapkan margin atau profitabilitas hanya dari estimasi tanpa bukti biaya aktual.

---

# 27. Future State

**Ini target konseptual jangka panjang, bukan daftar fitur P0 ataupun klaim capability yang sudah aktif.** Commerce dengan Selects yang curated-design-led tetap merupakan pusat identitas pelanggan; Services, Originals, dan Programs boleh tumbuh secara selektif jika tidak menggerusnya.

Jika TeeStock berkembang sesuai arah strategisnya, ecosystem dapat terlihat seperti:

```text
                         TEESTOCK

          ┌────────────────┼────────────────┐
          │                │                │
      COMMERCE          SERVICES        ORIGINALS
          │                │                │
      Selects           Custom          Collections
      Essentials        Business        Independent
                        Merch             Labels
                        Studio
                        Supply
                        Fulfill
          │                │                │
          └────────────────┼────────────────┘
                           │
                      PROGRAMS
                           │
              Creator / Reseller /
              Partner / Affiliate
                           │
                           ▼
                 SHARED INFRASTRUCTURE
                           │
      Product / Supply / Production / Commerce
       Inventory / Finance / Fulfillment / Data
                           │
                           ▼
                         MGBOS
```

TeeStock pada titik tersebut bukan lagi sekadar penjual apparel.

TeeStock menjadi:

> **an apparel commerce and brand operating ecosystem.**

---

# 28. Definition of Success

Keberhasilan TeeStock tidak hanya diukur dari omzet. **Keberhasilan primer** adalah curated apparel yang benar-benar dipilih dan dibeli customer dengan hak desain jelas, kualitas memadai, pengalaman tepercaya, economics sehat, dan founder burden terkendali.

Indikator dibedakan menurut tingkat bukti:

| Level | Evidence / outcome | Dilarang disimpulkan |
|---|---|---|
| Design discovery | Produk/koleksi dipahami, respons pelanggan tercatat dengan penyebut jelas bila relevan | `LIKES = SALES` |
| Demand validation | Preorder/komitmen/pembelian yang sah sesuai eligibility dan payment policy | `INTEREST = PAID_DEMAND` |
| Fulfillment validation | Produk benar-benar diproduksi, QC, dikirim dan dispute ditangani | `PAYMENT = FULFILLED` |
| Unit economics | Revenue aktual, biaya nyata dan kontribusi dapat ditelusuri per cohort/produk | `REVENUE = PROFIT` |
| Repeatability | Ada bukti pembelian ulang, kualitas konsisten dan beban founder terukur | `FIRST SALE = PRODUCT_MARKET_FIT` |

TeeStock dianggap semakin matang ketika:

- customer memilih, membeli dan kembali membeli **curated-design apparel**,
- Commerce menunjukkan bukti bertahap product-market fit pada koleksi terkurasi,
- Services (jika diaktifkan) memiliki proses repeatable **tanpa mengalahkan prioritas Commerce**,
- production memiliki quality consistency,
- fulfillment dapat dipercaya,
- creator dan partner menghasilkan nilai,
- data menghasilkan keputusan lebih baik,
- unit economics sehat,
- operasi semakin terotomasi,
- independent IP mulai memiliki brand equity sendiri,
- dan founder tidak harus menjadi bottleneck pada setiap transaksi.

Ultimate goal:

> **membangun sistem bisnis apparel yang dapat terus menciptakan nilai meskipun kompleksitas ecosystem bertambah.**

---

# 29. Canonical Summary

TeeStock dapat diringkas menjadi:

```text
IDENTITY
Curated design apparel: the chosen collection is the customer promise.

PRIMARY — COMMERCE
We curate and sell apparel worth wearing.

SERVICES
We help make and operate.

ORIGINALS
We create and own.

PROGRAMS
We grow together.

INFRASTRUCTURE
We make everything repeatable.

MGBOS
We make everything manageable.
```

Dan prinsip identitas produk:

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

---

# 30. Dependency

Setelah dokumen ini ditetapkan sebagai canonical, dokumen berikutnya harus diturunkan darinya:

1. [[bisnis/teestock/00-foundation/glossary|glossary.md]]
2. [[bisnis/teestock/01-strategy/business-thesis|business-thesis.md]]
3. [[bisnis/teestock/01-strategy/business-model|business-model.md]]
4. [[bisnis/teestock/01-strategy/ecosystem-architecture|ecosystem-architecture.md]]
5. [[bisnis/teestock/02-brand/brand-architecture|brand-architecture.md]]
6. [[bisnis/teestock/README|README.md]]

Tidak ada dokumen turunan yang boleh mengubah definisi fundamental TeeStock tanpa memperbarui dokumen ini dan Decision Register.

## Mandatory Reconciliation Register (not automatically executed)

| Priority | Source | Reason for follow-up | Authority rule |
|---|---|---|---|
| P0 | `bisnis/teestock/00-foundation/decision-register.md` | Integrasikan keputusan `DEC-TS-2026-012` (curated-design-first) ke register historis; selesaikan relasi dengan `DEC-TS-2026-009` dan `011` secara eksplisit | Jangan menghapus atau *retroactively rewrite* keputusan lama |
| P0 | `bisnis/teestock/14-roadmap/current-quarter.md` | Pisahkan prioritas bisnis curated products dari pilot Business/Custom yang dipakai untuk technical operating-spine validation | Roadmap tetap `ACTIVE` sampai revisi disetujui; jangan mengklaim otomatis superseded |
| P0 | `docs/roadmaps/solo-founder-launch-roadmap.md` | Reconcile scope TeeStock dan urutan kesiapan dengan pilot curated-commerce | Tidak membatalkan Founder Control atau operational readiness gates |
| P1 | `bisnis/teestock/02-brand/master-brand-strategy.md` | Posisikan curator / curated apparel sebagai identitas primer | Brand-specific authority tetap pada master brand strategy |
| P1 | `bisnis/teestock/03-commerce/teestock-selects.md` | Lengkapi kriteria curation, collection validation dan evidence tanpa menduplikasi IP policy | Commerce semantic owner tetap di Commerce |
| P1 | `bisnis/teestock/10-product-tech/website-information-architecture.md` | Pastikan retail collection discovery utama, Custom/Business akses sekunder | Jangan aktifkan checkout sebelum acceptance gates |
| P1 | `systems/mgbos/docs/product/teestock-operational-pilot-plan.md` | Jelaskan bahwa D4 Business/Custom pilot adalah operating-spine assurance, bukan curated-demand proof | Pilot cohort / readiness tetap sesuai D4 kecuali revisi disetujui |
| P1 | `systems/mgbos/docs/product/teestock-customer-platform/cx-09-phased-delivery-product-validation-plan.md` | Cocokkan curated-commercial priority dengan retail-first S0 dan gated S1 | DRAFT tidak lebih tinggi dari canonical business definition |
| P2 | `docs/strategy/internal-business-os/strategic-anchor.md` dan `parallel-pilots.md` di folder sama | Cross-reference arah portofolio Internal BOS dan dual pilot setelah tersimpan secara resmi | Keduanya berstatus REVIEW dan bukan sumber kanonis baru sampai diadopsi |

**Machine policy:** Entitas, statuses, migrations, payment methods, store readiness, legal rights, stock availability, dan production permissions **MUST NOT** disimpulkan dari perubahan dokumen ini. Konflik antara source lama dan keputusan baru harus ditandai `RECONCILIATION_REQUIRED` dan diselesaikan di semantic owner masing-masing. File ini hanya mengatur TeeStock business definition dan strategic primacy.
