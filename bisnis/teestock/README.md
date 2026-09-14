---
title: TeeStock
status: launch-prep
type: bisnis
tags:
  - bisnis/teestock
  - apparel
  - pod
  - curated-tees
  - d2c
---

# 👕 TeeStock

> The Everyday Curated Graphic Apparel House — *"Banyak Pilihan Desain, Satu Standar Kualitas."*

**Status:** 🟢 Fase 1: Launch Preparation (Web App Live, Direction A Lookbook, In-House Heat Press 155°C Active, Sourcing Hybrid)

---

## 📌 Tentang & Visi Brand

**TeeStock** adalah *everyday curated graphic apparel house* yang menghadirkan ratusan pilihan desain visual berkarakter untuk semua kalangan—mulai dari hobi, kopi, IT/coding, hewan peliharaan, musik, hingga humor santai—tanpa kompromi pada kualitas garmen.

TeeStock memadukan model **Threadless & Cotton Bureau** dengan kearifan pasar Indonesia:
1. **Demokratis & Inklusif:** Bukan brand streetwear elitis yang eksklusif/mahal, melainkan pakaian favorit harian yang ramah, nyaman, dan percaya diri dipakai siapa saja (bapak-bapak, anak kuliahan, pekerja kreatif, komunitas).
2. **Kualitas Garmen Terstandarisasi:** 100% menggunakan katun murni **New States Apparel (NSA Heavyweight 24s & Softstyle 30s)** konstruksi tubular knit (tanpa jahitan samping, kerah kokoh 2.2 cm anti-meleyot).
3. **Kemandirian Produksi In-House:** Sablon dicetak menggunakan tinta DTF berdensitas tinggi dengan teknik *double heat-press 155°C* di Central Studio Citayam.
4. **Harga Jujur:** Kualitas setara kaos distro mall Rp 150k+, di harga ramah kantong **Rp 89.000 – Rp 99.000**.

---

## 🏛️ Arsitektur 5 Pilar Model Bisnis

TeeStock beroperasi melalui 5 pilar pendapatan yang saling menopang:

| # | Pilar Bisnis | Target & Model | Unit Economics & Margin | Status |
|---|---|---|---|---|
| **1** | **Curated Originals** | Ritel D2C katalog desain internal terkurasi (tema hobi, pop culture, profesi) | HPP ~Rp 50k $\rightarrow$ Jual **Rp 89k – Rp 99k** (Margin ~50%) | 🟢 Live di Web |
| **2** | **Custom Order (Atelier)** | Sablon DTF satuan & komunitas (tanpa minimum order) via form WA | HPP ~Rp 52k $\rightarrow$ Jual **Rp 119k – Rp 139k** (Margin 58-64%) | 🟢 Live di Web |
| **3** | **Open Reseller & Dropship** | Kemitraan jualan katalog TeeStock atau bawa desain brand sendiri (white-label) | Harga B2B **Rp 75k** (Dropship) / **Rp 65k** (Min 12 pcs) | 🟡 Siap Rilis |
| **4** | **Creator Collaboration** | Wadah seniman/ilustrator upload karya (bagi hasil royalti **Rp 25.000/pcs**) | HPP Rp 53,5k + Royalti Rp 25k $\rightarrow$ Jual **Rp 119k** (Laba Bersih Rp 40,5k) | 🟢 Siap Buka |
| **5** | **Blank Retail & Wholesale** | Penjualan kaos polos New States Apparel original (eceran & grosir partai) | Eceran Jual **Rp 49k – Rp 59k** / Grosir Margin Rp 3k–6k/pcs | 🟢 Live di Web |

---

## 🎨 Strategi Pengadaan Desain (Hybrid Sourcing Pipeline)

Untuk menyediakan **banyak pilihan desain** tanpa risiko modal mati (*Zero Dead Stock*):
1. **Beli Aset Platform (Etsy / Creative Market):** Beli lisensi komersial POD (Rp 30k–100k per aset) untuk mengisi variasi kategori umum secara instan.
2. **Beli Putus Freelancer Lokal (Buyout):** Pesan desain orisinal bertema lokal (Rp 100k–250k) dengan pengalihan hak komersial 100% ke TeeStock.
3. **Penerimaan Karya Kreator (Royalti Rp 25.000/pcs):** Kreator menitipkan karya tanpa modal uang, TeeStock mengurus produksi dan pengiriman.

---

## ⚙️ Fasilitas Produksi & Multi-Hub Fulfillment

* **TeeStock Central Studio (Depok Central Hub):**
  - Mesin heat press in-house aktif — menghemat biaya jasa press vendor (hemat Rp 5.000 – Rp 7.000/pcs) dan mempercepat SLA menjadi H+0 / H+1.
  - Pusat produksi sablon DTF 155°C, quality control, dan finishing unboxing experience untuk pesanan Originals & Custom Atelier.
* **TeeStock Satellite Fulfillment (Bogor Express Hub / Cititex Network):**
  - Hub pengiriman khusus pesanan kaos polos (NSA Blanks) di area Bogor dan Jabodetabek untuk mendukung pengiriman Same-Day / Instant.
* **Identitas Pengiriman:** Seluruh paket dikirim dengan label profesional terpadu (*"Pengiriman dari Depok — ke seluruh Indonesia"*).

---

## 🌐 Website & Tech Stack (Selesai 100%)

- **Live URL:** [teestock.vercel.app](https://teestock.vercel.app)
- **Stack:** React 18 + Vite + Tailwind CSS + Supabase (PostgreSQL + RLS + Auth) + Cloudinary CDN + Vercel PWA
- **Fitur Storefront Publik:**
  - **The Warm Curated Gallery Hero:** Asymmetric split hero berheadline *"Ratusan Desain, Satu Kualitas"* dengan interactive color swatch spotlight switcher.
  - **Craft Marquee Ticker:** Ticker continuous bergerak memuat data teknis (100% NSA 24s Heavyweight, 155°C heat press, 0 jahitan samping).
  - **The Three Houses Bento Grid:** Membedah 3 pilar bisnis (Curated Originals Rp 99k, NSA Blanks mulai Rp 34k, dan Atelier Studio Lab).
  - **Category Filter Pills (Sticky on Mobile):** Tab navigasi cepat dengan indikator jumlah katalog (`all`, `statement`, `subculture`, `outdoor`, `blank`).
  - **Creator Flywheel Teaser (`/creator`):** Panggung karya kreator lokal dengan simulator royalti bersih Rp 25.000/pcs.
  - **Sensory Unboxing Showcase:** Standar kemasan 4 sentuhan (matte doff polymailer, segel stiker, story card, bonus stiker vinil).
  - **Custom Order Studio (`/custom-order`):** Formulir pemesanan satuan langsung terhubung ke WhatsApp.
  - **Cart, Checkout & Tracking:** Integrasi voucher promo, estimasi ongkir, dan pelacakan pesanan real-time.
  - **Admin HUB (`/admin`):** Dashboard analitik, inventory sync, kanban antrean produksi, generator label thermal A6, dan WhatsApp custom quoter.

---

## 📂 Dokumen & Panduan Lengkap di Vault

### 🎨 Brand & Copywriting (`brand/`)
- [**`audit-konsistensi-branding-teestock.md`**](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/brand/audit-konsistensi-branding-teestock.md) — Audit Komprehensif Konsistensi Branding Seluruh Halaman & Detail (Skor: 98/100 Grade A+).
- [**`riset-homepage-ui-ux-teestock.md`**](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/brand/riset-homepage-ui-ux-teestock.md) — Riset & Strategi Homepage (Benchmarking Threadless/Cotton Bureau/Everpress/Uniqlo UT, 21st.dev & Dribbble UX).
- [**`riset-warna-dan-tipografi-teestock.md`**](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/brand/riset-warna-dan-tipografi-teestock.md) — Riset & Keputusan Resmi Palet Warna (The Warm Curated Gallery `#FBFBF9`) & Tipografi (Plus Jakarta Sans + JetBrains Mono).
- [**`pematangan-branding-dan-copywriting-teestock.md`**](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/brand/pematangan-branding-dan-copywriting-teestock.md) — Master Blueprint Branding & Copywriting (Tagline, Manifesto, PDP Copy, Unboxing Story Card, Creator Pitch, Objection Handling).
- [**`panduan-branding-inklusif-teestock.md`**](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/brand/panduan-branding-inklusif-teestock.md) — Strategi positioning "The Everyday Curated Graphic Apparel House" (Sweet Spot, Brand Persona, Dual Voice).
- [**`brand-guide-teestock.md`**](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/brand/brand-guide-teestock.md) — Identitas visual resmi, tipografi Plus Jakarta Sans, Terracotta badge `#D95D39`, dan unboxing touchpoints.
- [`Logo TeeStock Monokrom.png`](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/brand/Logo%20TeeStock%20Monokrom.png) & [`teestock-logo.svg`](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/brand/teestock-logo.svg) — Aset master logo otentik founder.

### 📊 Riset & Model Bisnis (`riset/`)
- [**`breakdown-model-bisnis-teestock.md`**](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/riset/breakdown-model-bisnis-teestock.md) — Breakdown mendalam 5 pilar model bisnis, komparasi margin vs beban kerja, dan roadmap pentahapan solo founder.
- [**`analisis-bisnis-teestock.md`**](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/riset/analisis-bisnis-teestock.md) — Riset pasar Shopee/TikTok, unit economics riil HPP Rp 49k–54k, dan strategi penetrasi harga.
- [`daftar-niche-teestock.md`](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/riset/daftar-niche-teestock.md) — Bank ide 197 niche dalam 17 kategori untuk katalog desain.

### ⚙️ Operasional & SOP (`operasional/`)
- [**`panduan-kurasi-desain-dan-lisensi.md`**](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/operasional/panduan-kurasi-desain-dan-lisensi.md) — Standar kualitas teknis DTF (300 DPI, format PNG transparan, line weight 1.5 mm) & kerangka hukum lisensi HAKI anti-plagiasi.
- [**`rencana-operasional-teestock.md`**](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/operasional/rencana-operasional-teestock.md) — Rantai pasok Cititex, SOP heat press 155°C, dan smart multi-hub routing.
- [**`arsitektur-otomasi-website.md`**](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/operasional/arsitektur-otomasi-website.md) — Blueprint otomatisasi web, Midtrans gateway, webhook, dan label thermal.

### 💰 Keuangan & Pricing (`keuangan/`)
- [**`skema-pricing-dan-pencatatan-keuangan.md`**](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/keuangan/skema-pricing-dan-pencatatan-keuangan.md) — Moving Average HPP, dekomposisi DTF roll meteran, dan aturan hard-floor ARB (Auto Rijek Bawah).
- [**`analisis-fee-payment-gateway-dan-margin.md`**](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/keuangan/analisis-fee-payment-gateway-dan-margin.md) — Simulasi fee QRIS 0,7% vs Virtual Account vs Marketplace Shopee.

---

## 📋 Action Checklist Peluncuran (Solopreneur Focus)

1. [x] **Inspeksi Fisik Blank Kaos:** Blank NSA 24s sudah tervalidasi tebal dan nyaman.
2. [x] **Kesiapan Mesin Produksi:** Mesin heat press in-house siap beroperasi di Citayam.
3. [x] **Website Live & Siap Transaksi:** Storefront `teestock.vercel.app` aktif dengan cart, checkout, dan form custom.
4. [x] **Pematangan Branding & Copywriting:** Tagline resmi *"Banyak Pilihan Desain, Satu Standar Kualitas"*, naskah PDP, story card unboxing, dan pitch kreator disetujui.
5. [ ] **Siapkan Batch Desain Perdana (6–12 Desain):** Padukan desain jagoan sendiri dengan aset terpilih (niche: kopi, coding, tipografi, humor santai).
6. [ ] **Dokumentasi Video ASMR Press & Peel:** Rekam proses press 155°C dan kupas film DTF sebagai konten video pertama TikTok/Reels.
7. [ ] **First 10 Sales:** Buka pemesanan batch awal ke circle terdekat (teman, keluarga, WhatsApp status) dengan harga promo launching Rp 89.000.
