---
title: "TeeStock Master Brand Strategy"
date: "2026-09-27"
bisnis: teestock
kategori: brand
status: active
tags:
  - bisnis/teestock
  - kategori/brand
  - teestock/canonical
  - teestock/brand
document_id: "TS-BRD-001"
version: "2.0"
canonical_id: teestock.brand.master-brand-strategy
document_class: canonical-brand-strategy
owner: "Rizky / Founder"
author: "ChatGPT / AI Co-Founder — Brand and Product Strategy"
approver: "Rizky / Founder (curated-design-first owner direction)"
scope: "teestock-master-brand-positioning-and-experience-principles"
primary_business_positioning: CURATED_DESIGN_APPAREL
primary_commercial_promise: CURATED_COLLECTIONS_WITH_TRUSTED_APPAREL_QUALITY
primary_product_focus: TEESTOCK_SELECTS
primary_customer: CONSUMER_DESIGN_APPAREL_BUYER
secondary_business_lines:
  - TEESTOCK_SERVICES
  - TEESTOCK_PROGRAMS
future_owned_ip: TEESTOCK_ORIGINALS
retail_checkout_authorization: NONE
production_readiness_claim: NONE
implementation_authorization: NONE
source_control:
  source_pr: 85
  source_pr_head_sha: 70e952f5377bfadade66f0f1e3a4ebea2bcb8eed
  source_main_base_sha: 8c7731a13867f38b391ea2f38e9ae7b1f0a7e540
  source_brand_blob_sha: 87d05d79d5139857ad08da0187b539743bb61b54
  observed_on: "2026-10-20"
pr_adoption_state: CANDIDATE_NOT_MERGED
canonical_decision_dependency:
  decision_id: DEC-TS-2026-012
  authority_source: bisnis/teestock/00-foundation/decision-register.md
  source_ref: bisnis/teestock/00-foundation/decision-2026-012-curated-design-first.md
  source_ref_metadata_status: ACTIVE_AT_PR85_HEAD
  pr85_register_records_decision: true
  reconciliation_required: true
not_authoritative_for:
  - domain/aggregate design or MGBOS transaction invariants
  - retail checkout, live payment, order, fulfillment readiness
  - legal determination of intellectual property rights
  - specific prices, inventory availability or production commitments
  - launch sequencing governed by active roadmaps and pilot plans
  - detailed visual identity, product taxonomy, or technical UX contract
last_reviewed: "2026-10-20"
review_cadence: "on-material-Owner-strategy-decision"
category: "brand"
business: "teestock"
last_updated: "2026-10-20"
path: "02-brand/master-brand-strategy.md"
depends_on:
  - "TS-FND-001"
  - "TS-FND-002"
  - "TS-STR-001"
  - "TS-STR-002"
  - "TS-STR-003"
  - "TS-STR-004"
---


# TeeStock Master Brand Strategy v2.0

> [!info] **Canonical Master Brand Strategy  **
> Dokumen ini mendefinisikan siapa TeeStock sebagai master brand, bagaimana TeeStock harus dipersepsikan, siapa yang dilayani, nilai apa yang dibawa, dan bagaimana seluruh Commerce, Services, Originals, serta Programs harus tetap terasa sebagai bagian dari satu brand ecosystem.
>
> [!info] **Dependencies & Data Flow (SSOT)**
> [[bisnis/teestock/00-foundation/teestock-master-definition|TS-FND-001: TeeStock Master Definition]] • [[bisnis/teestock/00-foundation/glossary|TS-FND-002: TeeStock Glossary]] • [[bisnis/teestock/01-strategy/business-thesis|TS-STR-001: TeeStock Business Thesis]] • [[bisnis/teestock/01-strategy/business-model|TS-STR-002: TeeStock Business Model]] • [[bisnis/teestock/01-strategy/ecosystem-architecture|TS-STR-003: TeeStock Ecosystem Architecture]] • [[bisnis/teestock/01-strategy/growth-strategy|TS-STR-004: TeeStock Growth Strategy]]


---

# 1. Purpose

Dokumen ini menjawab:

- siapa TeeStock secara brand,
- apa yang harus dirasakan customer ketika berinteraksi dengan TeeStock,
- bagaimana TeeStock berbeda,
- siapa audience prioritasnya,
- bagaimana TeeStock berbicara,
- apa batas brand-nya,
- dan bagaimana master brand menjaga konsistensi seluruh ecosystem.

Master Brand Strategy bukan:

- visual guideline,
- website copy,
- campaign,
- atau brand architecture detail.

Dokumen ini menjadi strategic source sebelum hal-hal tersebut dibuat.

## Machine Reading Contract — TS-BRD-001 v2.0

> **Read this first:** `TEESTOCK_PRIMARY_POSITIONING = CURATED_DESIGN_APPAREL`. Brand dan customer value TeeStock berpusat pada **kurasi desain, pengembangan koleksi, standar garment, dan pengalaman retail**. Jangan mengklasifikasikan TeeStock sebagai Custom/B2B printing-first hanya karena infrastruktur dan operational pilot lama menggunakan jalur tersebut.

| Claim / question | Authority / interpretation | State |
|---|---|---|
| Identitas dan positioning TeeStock | `TS-FND-001` Master Definition dan `TS-BRD-001` ini (brand-specific) | TARGET / Owner direction 2026-10-20 |
| Mengapa berubah dari Business/Custom-first? | `DEC-TS-2026-012` pada `bisnis/teestock/00-foundation/decision-register.md`, terkait `DEC-TS-2026-009` dan `DEC-TS-2026-011` | ACTIVE document in PR #85; not yet merged to main |
| Produk utama dan kurasi | `TS-COM-001`, `TS-COM-002`, `TS-COM-004`, `TS-LEG-001`; dokumen ini tidak mendefinisikan ulang artwork rights/pricing | Existing ACTIVE sources, future reconciliation possible |
| Rencana customer platform | `systems/mgbos/docs/product/teestock-customer-platform/`; product/CX may be proposed or active per individual metadata | Resolve per file; don't infer readiness |
| Implementasi transaksi | MGBOS domain contracts, security gates, runtime/CI evidence | NOT VERIFIED by this document |
| Stage Q4 dan pilot assisted sales | `TS-RDM-003`, D4 operational pilot, `docs/roadmaps/solo-founder-launch-roadmap.md` | Remain effective in their validated scope until specifically changed |

**Required interpretation constraints:**

1. A wide **four-domain architecture** (Commerce, Services, Originals, Programs) is not evidence of equal near-term brand emphasis. Commerce/Selects is the leading consumer proposition.
2. TeeStock Selects curates designs from lawful sources; curation does **not** imply TeeStock owns all original artworks. Rights clearance is owned by the existing IP policy.
3. TeeStock Originals is the selective owned-IP/label program, not a synonym for all Selects products.
4. Retail-first brand strategy is **not** approval for stock reservations, guest checkout, payment acceptance, shipping promises, refunds or launch.
5. Services, including Custom/Business, may be explained and offered when approved, but SHOULD NOT dominate first-screen navigation, principal positioning or brand-success measurement.
6. Every AI/engineering agent MUST distinguish Owner-directed TARGET strategy from verified CURRENT production behavior. A PR being open is not evidence its document is authoritative on `main`.
7. This v2.0 does not silently revoke historical operating-spine pilot decisions or independently rewrite their acceptance cohorts.

---

# 2. Master Brand Definition

> **TeeStock adalah curated-design-first apparel brand yang memilih dan menyajikan desain berkarakter melalui koleksi yang relevan, kualitas garment yang konsisten, storytelling yang jelas, dan pengalaman belanja yang tepercaya.**

TeeStock ingin dikenal pertama-tama sebagai **destinasi apparel dengan desain terkurasi**, bukan toko sablon, vendor printing, atau penyedia jasa custom apparel generik.

```text
PRIMARY CUSTOMER PERCEPTION
CURATOR OF DESIGNS + APPAREL COLLECTIONS
        ↓
PRODUCT QUALITY + BELIEVABLE STORY + EASY DISCOVERY
        ↓
TRUSTED PURCHASE AND FULFILLMENT (WHEN ELIGIBLE)

SECONDARY/BACKSTAGE CAPABILITIES
MAKER + OPERATOR + SERVICES
```

Kapasitas produksi, vendor, dan layanan custom adalah kemampuan yang dapat memperkuat standar produk; keberadaannya tidak membuat layanan-layanan tersebut setara dengan nilai jual utama TeeStock.

---

# 3. Brand Role

TeeStock memiliki empat peran arsitektural dengan **prioritas ekspresi brand yang tidak setara**.

## Curator — PRIMARY

Memilih, menilai, dan mengemas desain yang relevan menjadi koleksi apparel yang worth wanting, wearing, and buying. Ini adalah alasan konsumen utama memilih TeeStock.

## Maker — SUPPORTING

Mengarahkan realisasi desain menjadi produk yang memenuhi standar garment dan produksi. Kemampuan ini tidak otomatis menjadi jasa custom sebagai brand utama.

## Operator — BACKSTAGE

Mengelola vendor, procurement, produksi, QC dan fulfillment secara andal. Pelanggan merasakan hasilnya, bukan kompleksitas internal.

## Brand Builder — SELECTIVE FUTURE

Menciptakan konsumen IP melalui TeeStock Originals jika sinyal permintaan, hak desain, dan economics mendukungnya.

**Rule:** Brand communication MUST lead with Curator. Maker, Operator dan Brand Builder memberi bukti pendukung; bukan empat proposisi nilai yang ditampilkan setara kepada seluruh konsumen.

---

# 4. Core Brand Idea

Canonical internal idea:

> **Good design, thoughtfully selected. Good apparel, reliably delivered.**

Dalam bahasa produk: **desain terkurasi yang layak dipilih, produk yang nyaman dikenakan, dan pengalaman yang memudahkan orang menemukan karya yang cocok dengan seleranya.**

`Good apparel, made simpler.` disimpan sebagai *historical wording* dari versi 1.0, bukan landasan utama positioning baru. Kemudahan tetap penting sebagai manfaat pengalaman, tetapi bukan pengganti **desain yang dipilih secara sadar**.

Ini bukan slogan atau tagline final untuk pemasaran. Klaim publik harus melalui standar brand voice dan pembuktian produk.

---

# 5. Brand Essence

TeeStock harus berdiri di intersection:

```text id="wahr8u"
TASTE
+
ACCESSIBILITY
+
CRAFT
+
CLARITY
```

Jika salah satu hilang:

```text id="1yawma"
Taste without accessibility
→ elitist

Accessibility without taste
→ generic

Craft without clarity
→ technical but confusing

Clarity without craft
→ empty marketing
```

TeeStock harus menjaga keempatnya.

---

# 6. Strategic Positioning

Canonical positioning:

> **TeeStock adalah brand apparel berbasis kurasi desain untuk konsumen yang ingin menemukan graphic apparel berkarakter—dipilih melalui taste dan standar produk TeeStock, bukan sekadar katalog desain acak atau jasa sablon berdasarkan pesanan.**

Layanan untuk creator, komunitas dan bisnis tetap dapat hidup sebagai lini terpisah bila layak secara komersial dan operasional. Mereka bukan primary audience atau pengarah otomatis untuk brand campaign dan homepage awal.

Secara sederhana:

```text id="a54v61"
NOT CHEAP APPAREL
NOT LUXURY FASHION
NOT GENERIC PRINTING

BUT

ACCESSIBLE
TASTEFUL
RELIABLE
APPAREL
```

---

# 7. Positioning Territory

TeeStock tidak mengejar image:

- luxury,
- hype-only,
- mass cheap marketplace,
- atau generic vendor.

Desired territory:

```text id="zom9md"
MODERN
APPROACHABLE
WELL-CURATED
TECHNICALLY COMPETENT
DEPENDABLE
```

---

# 8. Brand Promise

Canonical brand promise:

> **TeeStock menghadirkan pilihan desain apparel yang lebih terkurasi, dipadukan dengan informasi produk yang jelas dan kualitas yang dapat dipertanggungjawabkan.**

Untuk pelanggan Commerce: desain dan koleksi menjadi alasan datang; kejelasan fit, material, proses, dan status menjadi alasan percaya. Janji tersebut harus dibuktikan lewat produk dan pengalaman, bukan klaim abstrak.

**Secondary brand promise (scope-specific, not homepage headline):**

- Services membantu pelanggan membuat apparel ketika layanan tersebut approved dan siap dijalankan.
- Programs memfasilitasi partisipasi creator ketika program disetujui.
- Originals menghadirkan IP/label internal terpilih ketika layak.

Jangan menyatukan semua janji menjadi pesan utama yang terlalu luas dan membuat konsumen bertanya apakah TeeStock itu toko apparel atau penyedia jasa.

---

# 9. Customer Benefit Ladder

## Functional Benefit

Pelanggan utama TeeStock mendapatkan:

- desain yang dikurasi untuk minat dan selera tertentu,
- koleksi yang punya konteks dan tidak terasa acak,
- spesifikasi garment, ukuran dan material yang bisa dipahami,
- cara mengetahui keaslian/asal karya dan dasar hak komersial ketika relevan,
- cara membeli dan menerima produk melalui alur yang benar-benar tersedia.

Produksi, layanan custom dan fulfillment adalah capabilities pendukung atau pengalaman lanjutan, bukan daftar manfaat primer di halaman brand.

## Emotional Benefit

Customer merasa:

- lebih yakin,
- lebih tenang,
- tidak bingung,
- tidak merasa dibodohi.

## Identity Benefit

Customer dapat menggunakan apparel untuk:

- mengekspresikan diri,
- menunjukkan affiliation,
- membangun brand,
- membangun community identity.

---

# 10. Brand Problem

TeeStock hadir untuk mengurangi tiga masalah yang dialami pembeli apparel desain terkurasi.

## Undifferentiated Choice

Pilihan produk grafis banyak, tetapi sebagian sulit dibedakan, tidak punya konteks desain, atau tidak sesuai kebutuhan pemakai. TeeStock harus membantu discovery yang relevan, bukan sekadar menambah SKU.

## Generic Product Experience

Sekadar `kaos + print` tanpa kurasi, spesifikasi, kejelasan hak karya, dan standar produk bukan positioning TeeStock. Pembeli berhak memahami apa yang mereka pilih dan mengapa desain masuk ke koleksi.

## Uncertain Product Trust

Ketidakjelasan fit, bahan, kualitas cetak, stok, proses pengiriman, dan kebijakan purna jual dapat menghambat pembelian. Informasi publik MUST mengikuti bukti yang tersedia, bukan simulasi UI.

Problematika operasional Creator/Business tetap relevan bagi Services, tetapi tidak menjadi definisi masalah utama consumer brand.

---

# 11. Brand Enemy

Brand enemy bukan competitor tertentu.

Brand enemy adalah:

```text id="pvk99o"
RANDOMNESS
LOW STANDARDS
HIDDEN COMPLEXITY
```

TeeStock harus terasa sebagai kebalikannya.

---

# 12. Core Values

## 12.1 Clarity

Semua harus dapat dijelaskan.

- harga,
- material,
- process,
- timeline,
- expectation.

---

## 12.2 Taste

TeeStock tidak sekadar menyediakan banyak pilihan.

TeeStock memilih.

Curation adalah bagian dari brand value.

---

## 12.3 Craft

Kualitas harus terlihat pada output dan process.

---

## 12.4 Accessibility

TeeStock harus dapat didekati oleh orang biasa, creator kecil, maupun business.

Accessible bukan berarti murah.

Accessible berarti:

> tidak intimidating.

---

## 12.5 Reliability

Janji harus dapat diulang secara konsisten.

---

## 12.6 Progress

TeeStock dibangun sebagai learning system.

Brand boleh berkembang tetapi tidak kehilangan fondasi.

---

# 13. Brand Personality

Canonical personality:

```text id="a560si"
SMART
CALM
APPROACHABLE
TASTEFUL
PRACTICAL
CONFIDENT
```

---

# 14. What TeeStock Should Feel Like

Ketika orang berinteraksi dengan TeeStock, idealnya muncul persepsi:

> “Mereka ngerti apparel.”

> “Mereka tahu apa yang mereka jual.”

> “Gue nggak perlu ribet.”

> “Brand ini rapi.”

> “Mereka punya taste tapi nggak sok eksklusif.”

---

# 15. What TeeStock Should Never Feel Like

Avoid:

```text id="kx9jfo"
cheap marketplace
generic sablon shop
luxury wannabe
tech startup pretending to sell shirts
hype brand without substance
corporate vendor without personality
```

---

# 16. Archetype Direction

Primary archetype:

> **The Guide, expressed through a Curator point of view.**

TeeStock membantu konsumen menemukan desain yang sesuai taste dan pilihan garment, bukan menjadikan konsultasi produksi custom sebagai pintu masuk utama.

Secondary:

> **The Creator**

TeeStock mempunyai taste, menyusun koleksi, dan membantu membawa karya yang memiliki hak sah ke produk nyata. Tidak semua karya diciptakan TeeStock.

Supporting:

> **The Everyman**

TeeStock tetap accessible dan tidak berjarak.

---

# 17. The Guide Role

The Guide berarti TeeStock:

- menjelaskan,
- menyederhanakan,
- membantu memilih,
- tidak memaksa.

Communication harus terasa:

```text id="txa8ne"
"Ini pilihan yang paling masuk akal untuk kebutuhan lo."
```

bukan:

```text id="ckb2ax"
"Produk kami paling hebat di dunia."
```

---

# 18. The Creator Role

Creator side muncul melalui:

- curation,
- Originals,
- Studio,
- product development.

TeeStock harus memiliki aesthetic judgment.

Bukan hanya operational competence.

---

# 19. The Everyman Role

Brand tidak boleh membuat customer merasa:

> “ini bukan untuk gue.”

Language harus:

- straightforward,
- warm,
- human.

---

# 20. Audience Architecture

TeeStock memiliki beberapa audience, tetapi master brand harus tetap koheren.

Priority cohorts (current strategic direction):

```text
PRIMARY — CONSUMER / CURATED GRAPHIC APPAREL BUYER
SECONDARY — COLLABORATING DESIGNER OR ARTIST (ARTWORK INPUT)
CONDITIONAL SERVICE — CREATOR, COMMUNITY, SMALL BUSINESS
DEFERRED EXPANSION — ORGANIZATION, APPAREL ENTREPRENEUR
```

Kelompok secondary/conditional tidak secara otomatis memiliki conversion funnel, homepage hierarchy, customer-support SLA, atau target pertumbuhan yang setara. Audience details dan komersial activation perlu diuji di dokumen marketing/product pemiliknya.

---

# 21. Consumer Audience

Mencari:

- apparel bagus,
- desain relevan,
- harga masuk akal,
- pembelian mudah.

Perception goal:

> “Tempat apparel yang gue percaya.”

---

# 22. Creator Audience

Mencari:

- monetization,
- production,
- merchandise,
- operational help.

Perception goal:

> “Partner yang bikin karya gue bisa jadi produk tanpa gue harus urus semuanya.”

---

# 23. Small Business & Community Audience

Mencari:

- custom apparel,
- merchandise,
- reliability.

Perception goal:

> “Gue tinggal jelasin kebutuhan, mereka bantu beresin.”

---

# 24. Organization Audience

Mencari:

- professionalism,
- consistency,
- quotation,
- reliable delivery.

Perception goal:

> “Modern apparel partner yang bisa dipercaya.”

---

# 25. Apparel Entrepreneur Audience

Mencari:

- supply,
- production,
- fulfillment.

Perception goal:

> “Infrastructure yang bisa bantu bisnis gue berkembang.”

---

# 26. Audience Priority Principle

TeeStock berfokus pada **konsumen yang membeli apparel karena desain dan identitas koleksi**, bukan sekaligus pada semua potensi pembeli layanan apparel.

Canonical rule:

> **Curated-design consumer first; other audiences by explicit commercial evidence.**

Creator dapat menjadi sumber desain/kolaborator bahkan sebelum ia menjadi pelanggan layanan. Kondisi itu tidak membuat penawaran jasa creator menjadi identitas utama TeeStock.

Brand architecture boleh luas. Brand positioning, acquisition dan product experience tahap awal MUST tetap sempit dan konsisten.

---

# 27. Brand Differentiation

TeeStock tidak dibedakan oleh satu feature.

Differentiation yang ingin dibangun:

```text
A DISCERNIBLE CURATION POINT OF VIEW
+
RIGHTS-SAFE DESIGN SOURCING
+
MEANINGFUL COLLECTION EDITING
+
VERIFIABLE GARMENT/PRINT QUALITY
+
HONEST, LOW-FRICTION RETAIL EXPERIENCE
```

Vendor management dan MGBOS menjadi *enablers*, bukan brand headline. Pembedaan ini adalah **hypothesis** yang harus diuji melalui pilihan produk, sinyal permintaan, repeat behavior dan persepsi pelanggan—belum bukti sustainable competitive moat.

---

# 28. Functional Differentiation

Fungsi yang dapat dibuktikan pada pengalaman konsumen:

- kurasi artwork dengan alasan seleksi yang konsisten,
- visual discovery koleksi yang fokus dan informatif,
- desain yang tampil sesuai mockup sekaligus sesuai batas proof produksi,
- fit/size/material yang dijelaskan dengan jujur,
- standar kualitas cetak/garment yang diverifikasi,
- opsi pembelian dan fulfillment yang benar-benar didukung.

Sistem layanan custom/B2B, produksi fleksibel dan shared fulfillment tetap berguna, tetapi bukan pembeda konsumen yang boleh diklaim tanpa bukti.

---

# 29. Emotional Differentiation

TeeStock mengurangi:

```text id="ld0vmr"
UNCERTAINTY
```

Ini salah satu emotional value utama.

Pelanggan tidak hanya membeli garment; mereka memilih **desain yang terasa cocok dengan selera dan identitasnya**, serta kepercayaan bahwa barang yang datang sesuai ekspektasi.

> Desirability menarik pembeli; trust dan fulfillment yang konsisten membangun pembelian ulang.

Sinyal emosional ini harus diuji, bukan dipresentasikan sebagai hasil riset pelanggan yang sudah terbukti.

---

# 30. Cultural Differentiation

TeeStock tidak ingin berbicara seperti:

- vendor tradisional,
- marketplace seller,
- corporate procurement company.

Brand harus memahami:

- internet culture,
- creator culture,
- local consumer behavior,
- contemporary design.

Namun tetap timeless enough untuk tidak bergantung pada meme/trend.

---

# 31. Accessible ≠ Cheap

Ini prinsip penting.

Accessible berarti:

- bahasa mudah,
- process jelas,
- entry point tersedia,
- customer tidak diintimidasi.

Tidak berarti:

- harga paling rendah,
- diskon terus menerus,
- kualitas diturunkan.

---

# 32. Tasteful ≠ Elitist

Tasteful berarti:

- pilihan ada alasan,
- visual punya coherence,
- product tidak random.

Tidak berarti:

- hanya untuk fashion insider,
- menggunakan jargon berlebihan,
- membuat customer merasa kurang keren.

---

# 33. Technical ≠ Complicated

TeeStock boleh membicarakan:

- GSM,
- material,
- print,
- fit.

Namun selalu translate feature menjadi benefit.

Contoh:

```text id="yf48s5"
180 GSM
→ fabric feels more substantial
```

Bukan sekadar menunjukkan angka.

---

# 34. Brand Voice

TeeStock berbicara:

```text id="tm6sjf"
CLEAR
WARM
DIRECT
INFORMED
UNFORCED
```

---

# 35. Voice Principles

## Explain, Don't Impress

Jelaskan untuk membantu.

Jangan pakai jargon hanya untuk terlihat ahli.

---

## Confident, Not Loud

Tidak perlu:

```text id="ocb7xm"
TERBAIK
NO.1
SUPER PREMIUM
PALING MURAH
```

tanpa bukti.

---

## Human, Not Corporate

Hindari bahasa terlalu administratif.

---

## Useful, Not Fluffy

Setiap copy sebaiknya membantu customer:

- understand,
- choose,
- act.

---

# 36. Language Character

Ideal rhythm:

```text id="okqv1x"
Short claim
↓
Clear explanation
↓
Proof
```

Example:

> **Built for everyday wear.**  
> Heavyweight cotton, clean fit, and a collar that holds its shape.

---

# 37. Tone by Context

## Commerce

Warm, visual, confident.

## Custom

Helpful, practical.

## Business

Professional, clear, efficient.

## Creator

Collaborative, respectful.

## Supply

Technical, direct.

## Fulfill

Operational, trustworthy.

## Originals

More expressive and culture-driven.

---

# 38. Brand Voice Boundary

Independent Labels boleh mempunyai tone yang berbeda.

Namun master brand TeeStock tetap:

```text id="z6ybjs"
CALM
CLEAR
TRUSTED
```

Label boleh lebih:

- rebellious,
- introspective,
- playful,
- niche.

---

# 39. Brand Architecture Behavior

Arsitektur branded-house yang ada tetap dipertahankan, tetapi **brand visibility tidak sama dengan navigation parity**.

```text
PRIMARY PUBLIC IDENTITY
TeeStock / Curated Collections / TeeStock Selects

SUPPORTING RETAIL OFFER
TeeStock Essentials

SECONDARY (ONLY IF APPROVED/ELIGIBLE)
Custom / Business / Merch

NOT AUTOMATICALLY PUBLIC/ACTIVE
Studio / Supply / Fulfill / future Programs
```

Semua lini dapat memakai TeeStock sebagai endorsement sesuai Brand Architecture (`TS-BRD-002`), tetapi jalur sekunder MUST NOT memonopoli homepage atau menggeser koleksi terkurasi dari posisi utama. Perubahan nyata pada sitemap, hero, dan CTA wajib melalui IA dan product/CX owners, bukan file brand ini saja.

---

# 40. Originals Relationship

Independent Labels tidak perlu terlihat seperti sub-service.

Model:

```text id="x70rto"
DO YOUR BEST
A TEESTOCK ORIGINAL
```

Master brand memberi endorsement.

Label tetap punya identity sendiri.

---

# 41. Master Brand Visibility Rule

Visibility TeeStock semakin rendah ketika sub-brand identity semakin matang.

Early:

```text id="vnqpgg"
TeeStock strongly visible
```

Later:

```text id="k7gw8g"
Label dominant
TeeStock endorsed
```

---

# 42. Brand Equity Architecture

TeeStock master brand harus membangun equity pada:

```text id="8e2fm4"
TRUST
QUALITY
CURATION
CAPABILITY
```

Independent Labels membangun equity pada:

```text id="1y4bxp"
IDENTITY
CULTURE
COMMUNITY
```

Keduanya berbeda tetapi saling memperkuat.

---

# 43. Brand Experience Principles

Setiap touchpoint harus terasa:

```text id="in0j3b"
SIMPLE
INTENTIONAL
RELIABLE
```

Touchpoint meliputi:

- website,
- packaging,
- customer chat,
- invoice,
- tracking,
- product,
- return.

---

# 44. Product Experience

Brand experience harus dimulai dari product.

Prioritas:

```text id="p1sbp4"
FIT
MATERIAL
PRINT QUALITY
FINISHING
CONSISTENCY
```

Packaging tidak boleh menutupi product yang buruk.

---

# 45. Service Experience

Services harus terasa:

> “terstruktur tetapi tidak kaku.”

Customer harus tahu:

```text id="i3x7s8"
What happens next?
How much?
How long?
What do I need to provide?
```

---

# 46. Digital Experience

Website utama harus mengomunikasikan dalam pengalaman pertama:

1. desain dan koleksi apa yang layak ditemukan,
2. karakter tiap koleksi/artwork (tanpa klaim kepemilikan yang keliru),
3. garment/fit/material/print treatment dan kondisi pemesanan yang benar,
4. cara bertindak yang sesuai readiness (browse, inquiry/waitlist, atau transaksi jika authorized),
5. bagaimana mendapatkan bantuan.

Experience-first bukan berarti animation-heavy; performa mobile, aksesibilitas, keterbacaan, keyboard interaction, dan recovery dari error tetap menjadi syarat release masing-masing slice.

Layanan Custom/Business dapat ditemukan melalui navigasi sekunder yang jelas sesuai IA aktif, tetapi bukan framing utama di area curated retail.

**Hard boundary:** prototipe/mockup `cart`, `checkout`, `stock`, `payment success`, `delivery date` dan `order tracking` MUST NOT ditampilkan sebagai perilaku live sebelum bukti dan otorisasi masing-masing ada. UI branding tidak mengubah MGBOS business invariants.

---

# 47. Packaging Role

Packaging berfungsi untuk:

- protection,
- recognition,
- delight.

Bukan untuk:

- inflate perceived value secara palsu.

---

# 48. Brand Trust System

Trust dibangun melalui:

```text id="d4gcna"
CLEAR SPEC
REAL PHOTOS
REAL PROCESS
CLEAR PRICE
CLEAR SLA
CLEAR WARRANTY
CONSISTENT DELIVERY
```

---

# 49. Proof > Claim

Canonical rule:

```text id="iqpk9f"
SHOW
>
SAY
```

Example:

lebih baik menunjukkan:

- material,
- production,
- QC,

daripada hanya mengatakan:

> premium quality.

---

# 50. Brand Transparency

TeeStock harus transparan mengenai:

- material,
- process,
- turnaround,
- source jika relevan,
- limitations.

Transparency bukan berarti membuka seluruh internal cost.

---

# 51. Community Role

Community bukan target yang dipaksakan sejak awal.

Community dapat muncul ketika:

```text id="1rrfiz"
shared identity
+
repeated engagement
+
belonging
```

Originals dan Creator ecosystem lebih berpotensi membangun community dibanding Essentials.

---

# 52. Brand Expansion Principle

Jangan membuat nama baru jika existing TeeStock architecture masih cukup.

Gunakan sub-brand hanya jika ada alasan kuat:

```text id="jkpyf4"
different audience
different identity
different long-term world
```

Bukan hanya untuk terlihat besar.

---

# 53. Naming Principle

Nama offering harus:

- simple,
- functional,
- memorable.

Itulah alasan:

```text id="1r4cd6"
TeeStock Custom
TeeStock Business
TeeStock Merch
```

lebih baik daripada nama abstrak yang membuat customer harus belajar ulang.

---

# 54. Product Naming

Produk sebaiknya memiliki hierarchy jelas:

```text id="9jkm04"
Brand
Product Family
Product
Collection / Design
Variant
```

Contoh:

```text id="o5qsk3"
TeeStock Essentials
Heavyweight Tee
Black
L
```

Untuk Label:

```text id="cnb4vr"
Do Your Best
Essential Tee
Chapter 001 — Start Anyway
Black / L
```

---

# 55. Brand Content Pillars

Prioritaskan content pillars berdasarkan **alasan konsumen datang untuk memilih desain**:

## 1 — Curated Designs and Collections (PRIMARY)

Desain yang dipilih, konteks cerita dan mood koleksi, point of view kurator, styling, editorial, alasan suatu karya masuk koleksi. Jelaskan hak/desainer/kolaborasi sesuai provenance yang telah diotorisasi.

## 2 — Garment and Product Proof (PRIMARY)

Material, cutting, fit, mockup vs real product, metode cetak yang relevan, ukuran, quality inspection, perawatan. Tidak menggunakan klaim kualitas yang belum teruji.

## 3 — Taste and Discovery (PRIMARY)

Cara memilih desain/fit yang sesuai, kategori koleksi, visual references yang sah, customer inspiration dan product context.

## 4 — People and Collaboration (CONDITIONAL)

Artist dan creator yang benar-benar terlibat melalui hak/izin jelas, pembeli dan komunitas yang setuju ditampilkan.

## 5 — Behind the Brand (SUPPORTING)

Cerita seleksi dan pematangan koleksi, standar vendor/QC yang bisa dibuktikan, serta proses pembangunan TeeStock. Tidak menggeser feed brand menjadi jurnal teknis software atau jasa sablon.

---

# 56. Founder Content Role

Founder boleh terlihat.

Namun TeeStock tidak boleh sepenuhnya bergantung pada founder personality.

Desired evolution:

```text id="gsgtik"
Founder introduces trust
↓
Product builds trust
↓
Brand owns trust
```

---

# 57. Price Communication

Avoid:

```text id="bf3avk"
Murah banget!
Termurah!
```

Preferred:

```text id="qovlug"
Clear value
Honest price
Relevant specification
```

---

# 58. Discount Philosophy

Discount adalah:

> tactical tool.

Bukan:

> brand personality.

Use for:

- launch,
- bundles,
- inventory movement,
- loyalty.

Avoid permanent fake urgency.

---

# 59. Scarcity Philosophy

Scarcity hanya digunakan jika nyata.

Originals capsule boleh limited.

Essentials tidak harus dibuat limited hanya untuk menciptakan hype.

---

# 60. Brand Consistency vs Flexibility

Master brand harus konsisten pada:

```text id="j6y52j"
values
voice
quality
trust
```

Boleh fleksibel pada:

```text id="ywyt6f"
campaign
visual expression
collection theme
content style
```

---

# 61. TeeStock Brand Moat

Brand moat TeeStock tidak dibangun dari logo, katalog SKU yang besar, atau klaim otomatisasi.

Desired mental availability:

```text
"Gue ingin graphic apparel dengan desain yang dipilih dengan taste."
→
"Cek koleksi TeeStock."
```

Curation point of view, kejelasan hak desain, repeatable garment quality, dan pengalaman pelanggan dapat *membentuk* keunggulan yang sulit ditiru bila terbukti melalui perilaku nyata. Sampai data tersedia, ini **strategic moat hypothesis**, bukan fakta keberhasilan pasar.

---

# 62. Brand Success Signals

Brand health utama perlu dibaca berdasarkan bukti, bukan vanity metrics:

- minat terukur terhadap *specific curated designs/collections* (saves, eligible waitlist, qualified purchase interest),
- rasio discovery → product interest → **eligible** conversion (jangan mencampur prototype clicks dengan penjualan),
- kualitas kurasi berdasarkan apa yang dipilih, ditolak, dan alasan pembeli,
- sell-through atau performa desain bila transaksi dan stok benar-benar tersedia,
- return/complaint karena fit, artwork mismatch, kualitas atau promise yang tidak terpenuhi,
- repeat purchase dan keterkaitan dengan koleksi/desain yang berbeda,
- direct/branded traffic, organic referrals dan persepsi 'curated design apparel'.

Kontribusi Service/Business tetap dapat diukur di laporan lini terkait, tetapi **tidak boleh menjadi satu-satunya bukti sukses consumer brand**. Baseline, target numerik dan atribusi harus ditetapkan pada dokumen KPI/experiment owner.

---

# 63. Brand Failure Signals

Warning signs yang material:

```text
"TeeStock itu jasa sablon ya?"
"Semua desain di katalog ini boleh dipakai secara legal?"
"Harga/stock-nya beneran atau cuma tampilan?"
"Apa bedanya koleksi TeeStock dengan listing acak marketplace?"
```

Pelanggan menyebut TeeStock sebagai **brand/toko apparel desain terkurasi** bukan kegagalan; itulah positioning utama yang dipilih Owner. Brand architecture internal boleh berkembang luas, tetapi komunikasi consumer-facing tidak boleh kabur.

Kebingungan yang berulang perlu diukur, dilacak ke touchpoint, dan ditindak melalui UX, produk, kualitas informasi, atau portfolio scope.

---

# 64. External Brand Simplification

Canonical external summary:

> **TeeStock adalah brand apparel yang menghadirkan koleksi desain terkurasi pada produk yang dipilih dengan standar jelas.**

Compact internal direction:

```text
CURATED DESIGN.
CONSIDERED APPAREL.
```

Ini bukan tagline marketing yang otomatis approved. Ungkapan lama `SHOP. MAKE. BUILD.` dipertahankan sebagai **historical platform framing**, tetapi tidak boleh dijadikan headline utama konsumen curated apparel.

---

# 65. Strategic Messaging Ladder

## Level 1 — Simple

> Curated designs on thoughtfully selected apparel.

## Level 2 — Explain

> Explore TeeStock collections: distinctive designs, garment details you can trust, and styles chosen with intention.

## Level 3 — Proof

> Show individual designs with legitimate provenance, real garment specifications, fit information, print/finish evidence where verified, and an honest availability/purchase status.

The messaging ladder is a **strategic copy direction** only; marketing and design governance own actual live wording and claims.

---

# 66. Master Brand vs Originals

Important distinction:

```text
TEESTOCK / SELECTS
CURATES designs and assembles commerce collections
RIGHTS STATUS may be LICENSED / COMMISSIONED / COLLABORATIVE / OWNED

ORIGINALS
BUILDS selective TeeStock-owned cultural IP, collections or independent labels
RIGHTS STATUS must support ownership and planned commercialization
```

Curation tidak otomatis berarti karya diproduksi/desain orisinal oleh TeeStock. Independent Labels membutuhkan kebijakan endorsement dan branding sendiri. Keduanya tidak boleh dicampur untuk klaim copyright atau product ownership.

---

# 67. Master Brand vs MultiGraph

TeeStock:

```text
CURATED DESIGN APPAREL
PRODUCT / COLLECTION / RETAIL EXPERIENCE
```

MultiGraph:

```text
PRINTING / PACKAGING / CUSTOM PRODUCTION SOLUTIONS
QUOTE-ORIENTED BUSINESS WORKFLOWS
```

MGBOS adalah shared operational truth, bukan brand yang dipasarkan kepada pembeli apparel. MultiGraph boleh memasok komponen/printing kepada TeeStock jika kualitas dan economics memenuhi kebijakan, tetapi internal collaboration tidak mengubah owner bisnis atau mengizinkan layanan eksternal tanpa readiness.

**Test:** customer melihat TeeStock lebih dulu sebagai koleksi desain; melihat MultiGraph sebagai solusi produksi/percetakan, bukan dua nama untuk jasa sablon yang sama.

---

# 68. Brand Evolution

Possible evolution (not a commitment to sequential software delivery):

```text
CURATED DESIGN COLLECTIONS
↓
TRUSTED CURATED APPAREL BRAND
↓
REPEATABLE COLLECTION ENGINE + COMMERCE
↓
SELECTIVE BRAND/IP/PROGRAM EXPANSION WHEN VALIDATED
```

External brand perception **stays curated apparel** even if the internal business/system capabilities become wider. A future services platform or ecosystem SHOULD NOT replace consumer brand clarity without an explicit Owner-approved strategic decision.

---

# 69. Brand Governance Questions

Sebelum membuat:

- campaign,
- product,
- service,
- label,
- website section,

tanyakan:

```text id="0wxbky"
Is it clear?
Is it useful?
Does it feel intentional?
Does it maintain quality?
Does it feel like TeeStock?
```

---

# 70. Canonical Brand Summary

TeeStock adalah:

```text id="j13mm1"
CLEAR
not complicated

TASTEFUL
not elitist

ACCESSIBLE
not cheap

TECHNICAL
not overwhelming

CONFIDENT
not loud

MODERN
not trend-dependent
```

---

# 71. Brand North Star

Desired consumer perception:

> **“Kalau gue ingin graphic apparel dengan desain yang dipilih dengan selera dan standar jelas, gue lihat TeeStock.”**

North Star ini adalah intended association yang masih harus divalidasi melalui pelanggan riil. Jangan mengganti bukti riset dengan keyakinan internal branding.

---

# 72. Canonical Master Brand Statement

> **TeeStock adalah curated-design-first apparel brand yang membangun koleksi desain pilihan dan menyajikannya pada garment berstandar jelas melalui pengalaman retail yang sederhana, terpercaya, dan relevan bagi pelanggan. Services, Originals dan Programs dapat berkembang sebagai kemampuan tambahan tanpa mengaburkan positioning consumer-facing utama.**

---

# 73. Internal Brand Mantra

```text id="x4z0xv"
CURATE WITH INTENTION.
PROVE THE PRODUCT.
EARN THE PURCHASE.
```

---

# 74. Dependency

Dokumen berikut harus mengikuti Master Brand Strategy:

1. [[bisnis/teestock/02-brand/brand-architecture|brand-architecture.md]]
2. [[bisnis/teestock/02-brand/brand-identity-system|brand-identity-system.md]]
3. [[bisnis/teestock/02-brand/voice-and-copy-system|voice-and-copy-system.md]]
4. [[bisnis/teestock/03-commerce/commerce-overview|commerce-overview.md]]
5. [[bisnis/teestock/04-services/services-overview|services-overview.md]]
6. [[bisnis/teestock/05-originals/originals-master-plan|originals-master-plan.md]]
7. seluruh customer-facing copy,
8. packaging,
9. storefront design,
10. service experience design.

Independent Labels boleh memiliki strategy sendiri, tetapi relationship mereka terhadap TeeStock harus tetap mengikuti master brand governance.

---

# 75. Consumer-First Brand Operating Guardrails — 2026-10-20

## 75.1 Primary brand promise must match the offered product

A public product/card/story MAY lead with design desirability, but MUST be backed by:

- artwork source category and rights clearance per `TS-LEG-001`;
- collection/design identifier and product/variant information per Commerce owners;
- accurate material, size, print method, imagery/proof status, care information if available;
- stock, made-to-order, pre-order or inquiry label matching actual capability;
- price, taxes, shipping, payment and returns information only when applicable policy is current and verified.

Brand strategy never grants permission to publish unlicensed artwork or to promise unsupported quality, scarcity, availability or delivery.

## 75.2 Collection curation quality

A collection hypothesis SHOULD name its audience, aesthetic angle, selection rules, source of each design, garment fit, eligible price range (owned by commercial policy), anticipated production method, risk and learning goal. Do not equate catalog breadth with strength of curation.

Minimum useful proposed process:

`Discover design candidates → rights screening → editorial selection → garment/print feasibility → price & margin feasibility → quality proof → approved publishability → customer feedback → keep/iterate/retire`.

This flow is an **operational proposal**, not an approved new MGBOS entity model or prerequisite for every static brand prototype. Domain design belongs to MGBOS and policies to TeeStock business owners.

## 75.3 Appropriate founder workload

Do not grow the visible catalog or automation before the founder can manage quality issues, exceptions, vendor changes and fulfillment honestly. A beautiful product page that causes duplicate manual work or creates unsupported order promises fails the business goal.

For demand validation where payments are not yet authorized, permitted alternatives MAY include eligible inquiry, waitlist, design preference test or owned-channel interest measurement subject to privacy/consent, clear labeling and no false transaction claims.

## 75.4 Primary indicators versus supporting indicators

| Brand outcome | Preferred evidence | False positive to exclude |
|---|---|---|
| Design desirability | qualified product interest, design-specific purchase intention | mere page views, fake 'Add to cart' |
| Collection effectiveness | concept test, fit to target customer, repeat engagement | SKU count or number of posts |
| Trustworthy purchase | verified completed eligible retail transaction, reconciliation and satisfaction | simulated UI, button clicks, unverified payment |
| Garment quality | QC, returns, feedback on fit/print/material | unverified 'premium' copy |
| Healthy economics | sell-through, contribution margin by assortment, fulfillment costs | revenue without costs/refunds |
| Brand clarity | customer describes TeeStock as curated-design apparel brand | founder-only opinion or vague 'apparel platform' recognition |

Numeric goals and measurement instrumentation are **not** specified here. They belong to metrics/experimentation and product analytics contracts and require explicit baselines.

---

# 76. AI-Readable Decision & Authority Constraints

```yaml
brand_id: teestock
brand_direction_id: DEC-TS-2026-012
primary_positioning: CURATED_DESIGN_APPAREL
primary_value_driver: CURATION_AND_PRODUCT_DESIRABILITY
primary_commerce_line: TEESTOCK_SELECTS
secondary_commerce_line: TEESTOCK_ESSENTIALS
secondary_service_model: CONDITIONAL_APPROVED_ONLY
originals_role: FUTURE_OWNED_IP
programs_role: DEFERRED_UNTIL_EVIDENCE
business_truth_owner: bisnis/teestock/
transaction_truth_owner: systems/mgbos/
brand_success_proof: DESIGN_DEMAND_AND_VERIFIED_RETAIL_CUSTOMER_OUTCOMES
retail_transaction_readiness: NOT_ESTABLISHED_BY_BRAND_STRATEGY
legacy_assisted_sales_pilot: PRESERVED_WITHIN_EXISTING_CONTRACT
new_database_entities_authorized: false
new_payment_capabilities_authorized: false
new_production_workflows_authorized: false
pr_candidate:
  number: 85
  reviewed_head: 70e952f5377bfadade66f0f1e3a4ebea2bcb8eed
  document_changed_in_remote: false
```

Instructions for future AI:

1. Resolve `TS-FND-001` business identity and `TS-FND-004` decision authority first. Check **current HEAD** of the branch being worked on; do not treat embedded baseline SHA as current forever.
2. Read `TS-COM-002` for TeeStock Selects curation and `TS-LEG-001` for artwork/IP rights. This document does not grant, alter or waive licenses.
3. If another ACTIVE source states Business/Custom is TeeStock's *primary brand*, record a **documentation conflict** and route it to its semantic owner; do not silently ignore or override it.
4. If another ACTIVE source prioritizes assisted Business/Custom *operational validation*, preserve that technical scope until roadmap/pilot owners revise it through versioned change control.
5. Never infer production readiness, checkout readiness, stock accuracy, or automatic publication from a strategy doc or prototype.
6. In an unresolved conflict, distinguish intended business direction from operational readiness, name the sources and set the affected delivery claim to `NOT_VERIFIED` or `BLOCKED` as appropriate.

---

# 77. Downstream Reconciliation Map — Separate Work Packages

This section records **dependencies only**, not approvals to overwrite the linked files.

| Scope | Exact canonical document | Required review | Risk if stale |
|---|---|---|---|
| TeeStock business identity | `bisnis/teestock/00-foundation/teestock-master-definition.md` | Confirm existing v2 curated-first proposal in PR #85 and retain cross-document alignment | Conflicting root brand definition |
| Decision register | `bisnis/teestock/00-foundation/decision-register.md` | Check DEC-009/011/012 owner decision interactions and active metadata | False precedence or dual-source authority |
| Brand architecture | `bisnis/teestock/02-brand/brand-architecture.md` | Preserve 4-domain labels; ensure public brand prominence focuses on Selects | Every service presented as equal |
| Brand voice | `bisnis/teestock/02-brand/voice-and-copy-system.md` | Review hero/product copy claims, IP and verifiability | Unsupported premium/legal claims |
| Commerce system | `bisnis/teestock/03-commerce/commerce-overview.md` and `teestock-selects.md` | Confirm curation, catalog, source rights, product economics | Beautiful catalogue with no trustworthy product |
| Website IA | `bisnis/teestock/10-product-tech/website-information-architecture.md` | Position curation and Shop as first intent; keep governed service routes accessible | Brand/UX drift |
| Customer experience | `systems/mgbos/docs/product/teestock-customer-platform/` | Reconcile full FR/NFR, release slices and prototype-only components | Missing acceptance and premature checkout |
| Solo founder launch | `docs/roadmaps/solo-founder-launch-roadmap.md` | Separate brand primacy from existing readiness/sequencing gates | Contradictory launch priority |
| Q4 plan | `bisnis/teestock/14-roadmap/current-quarter.md` | Identify which Business/Custom tasks remain as MGBOS capability validation vs business focus | Misallocated capital and work |
| MultiGraph | `bisnis/multigraph/README.md` | Preserve independent printing capability/brand and staged external sales | Duplicate customer positioning |

This replacement represents **one bounded semantic change**: TeeStock master brand becomes curated-design-first. The referenced documents are not altered by it. Any later implementation must separately pass applicable technical, financial, security and operational gates.
