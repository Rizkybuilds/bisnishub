---
title: TeeStock
status: launch-prep
type: bisnis
tags:
  - bisnis/teestock
  - apparel
  - pod
  - d2c
---

# 👕 TeeStock

> Curated Apparel & Merch House — *"Wear Your Identity, Stock Your Story"*

**Status:** 🟢 Fase 1: Launch Preparation (Web App Live, Direction A Lookbook, Authentic Master Logo & In-House Heat Press Active)

## Tentang

TeeStock adalah *creative apparel & merch house* independen yang memadukan kurasi desain streetwear berkarakter dengan fasilitas studio produksi merchandise. TeeStock beroperasi dengan strategi **100% Fokus Ritel Konsumen (B2C)** dan **100% Online Direct-to-Consumer (D2C)** melalui 3 pilar:
1. **TeeStock Originals (Curated Drop Archive):** Rilis berkala desain tematik (*The Drop Model*, Drop #01: "RAW IDENTITY") di atas katun NSA 24s Heavyweight tubular knit dengan sablon DTF double-press in-house (@ Rp 99.000).
2. **TeeStock Blanks (Official NSA Blanks):** Kaos polos resmi New States Apparel (24s Heavyweight & 30s Softstyle) dengan opsi instan upsell sablon kustom.
3. **TeeStock Atelier (Custom Print Lab Satuan):** Layanan sablon DTF satuan tanpa minimum order untuk perorangan, komunitas, dan kreator via WhatsApp order flow.

> **Pemisahan Kemitraan (B2B):** Program reseller dan dropshipper dialokasikan pada subdomain terpisah **`mitra.teestock.id`** (Roadmap Fase 2), sehingga storefront publik ritel tetap bersih, berwibawa, dan menjaga *prestige* harga jual Rp 99.000.

---

## ⚙️ Fasilitas Produksi & Multi-Hub Fulfillment (Update September 2026)

* **Bahan Kaos Blank:** Kaos New States Apparel (NSA) Heavyweight 24s & Softstyle 30s resmi bersertifikasi, tubular knit (tanpa jahitan samping), fitting mantap, dan kain berbobot.
* **TeeStock Central Studio (Citayam Hub - Tugu Macan Citayam):**
  - Mesin heat press in-house aktif — menghemat biaya jasa press vendor (hemat Rp 5.000 – Rp 7.000/pcs) dan mempercepat SLA menjadi H+0 / H+1.
  - Pusat produksi sablon DTF 155°C, quality control, dan finishing unboxing experience untuk pesanan Originals & Custom Atelier.
* **TeeStock Satellite Fulfillment (Bogor Hub / Cititex Network):**
  - Hub pengiriman khusus pesanan kaos polos (NSA Blanks) di area Bogor dan Jabodetabek untuk mendukung pengiriman Same-Day / Instant.
* **Label Pengirim Resmi:** Seluruh paket dikirim dengan identitas profesional (*"TeeStock Central Studio, Citayam"* atau *"TeeStock Fulfillment Hub, Bogor"*), bukan alamat perorangan atau "inhome".

---

## 💰 Struktur Harga & Unit Economics (CFO Approved)

* **HPP Kaos NSA 24s Jadi:** ~**Rp 48.000 – Rp 54.000** (Kaos grosir Rp 37k + DTF A3/A4 Rp 8k-12k + Listrik/Press Rp 1k-2k + Packing/Polymailer Rp 2k).
* **Anchor Price (Harga Coret):** `Rp 139.000`
* **Harga Ritel Launching (Drop #01):** `Rp 99.000` (Sweet spot marketplace distro, margin kotor ~45%).
* **Kaos Polos NSA Original:** `Rp 34.000 – Rp 52.000` (Tergantung gramasi 30s/24s dan ukuran).
* **Custom Order Satuan (Atelier):** `Rp 119.000 – Rp 139.000` (Atau add-on sablon +Rp 25.000 dari kaos polos).
* **Harga Khusus B2B (Khusus Portal `mitra.teestock.id` Fase 2):** Reseller Rp 65.000 (Min 12 pcs) | Dropship Rp 75.000 (White-label).

---

## 🎨 Koleksi Perdana: Kurasi Drop #01 Debut

> *Catatan: 6 sampel desain sebelumnya (IT/Tech, Outdoor, Local Pride) adalah prototype pengembangan website. Solopreneur sudah memiliki kumpulan aset desain keren tersendiri yang saat ini sedang dikurasi menjadi 3–4 desain jagoan dengan tema payung terpadu (**Drop #01: "RAW IDENTITY"**) agar konsisten dan memicu rasa penasaran di media sosial.*

---

## 🌐 Website & Tech Stack (Selesai 100%)

Aplikasi web modern terintegrasi yang berfungsi sebagai storefront ritel B2C, portal kustomisasi merchandise, dan hub operasional internal produksi studio:

- **Live URL:** [teestock.vercel.app](https://teestock.vercel.app)
- **Stack:** React 18 + Vite + Tailwind CSS + Supabase (PostgreSQL + RLS + Auth) + Cloudinary CDN + Vercel PWA
- **Fitur Storefront Publik (100% Ritel B2C — Direction A Lookbook):**
  - **Editorial Lookbook & Interactive Spotlight Hero:** Asymmetric split hero berheadline Formula D (*"Kaos Nyaman dengan Desain yang Nggak Pernah Ngebosenin"*), live interactive color swatches langsung di hero, dan tech badge floating.
  - **21st Category Filter Pills:** Tab navigasi cepat (`all`, `profesi`, `komunitas`, `receh`, `lokal`, `blank`).
  - **3-Pilar Bento Grid:** Originals (Rp 99.000), Official Blanks (Rp 34k-52k), dan Custom Atelier (Rp 119k-139k).
  - **Interactive Garment Hotspot Anatomy:** 5 tombol pin interaktif (Kerah anti-bacon 2.2 cm, Tubular knit tanpa jahitan, Katun 180 GSM, Double press 155°C, Kemasan doff) dengan komparasi langsung vs kaos combed 30s distro biasa.
  - **Visual Cost Transparency Infographic:** Komparasi alokasi biaya 100% Online D2C (70% fisik bahan NSA & sablon) vs Distro Konvensional Mall (hanya 40% untuk bahan, 60% habis untuk sewa ruko & SPG).
  - **Mobile Sticky Action Bar:** Quick CTA bar di mobile view untuk navigasi cepat ke katalog, blanks, dan custom lab.
  - **Dynamic Hybrid Stock & SLA Indicator:** (⚡ Ready Stock Studio H+0 vs 📦 Stok Gudang Pusat H+1).
  - **Blank-to-Custom DTF Upsell Banner:** (+Rp 25.000) terintegrasi langsung ke `/custom-order`.
  - **Paket Bundling Hemat AOV Booster:** (Paket Duo hemat Rp 18k / Paket Trio hemat Rp 42k).
  - **Customer Reviews & Social Proof Engine:** rating bintang 4.9/5, meteran kepuasan kain NSA & sablon DTF, verified buyer badge.
  - **Katalog Terkurasi + Filter NSA Blanks.**
  - **Detail Produk:** dengan rekomendasi ukuran & spesifikasi sablon DTF suhu 155°C.
  - **Custom Order Studio (`/custom-order`):** formulir spesifikasi otomatis ke WhatsApp.
  - **Cart & Checkout (`/keranjang`):** validasi kode kupon/voucher promo & estimasi ongkir.
  - **Pelacakan Pesanan Real-Time (`/tracking`).**
  - **Halaman Akun Member (`/akun`):** riwayat order dan alamat tersimpan.
  - **Micro Landing Page Bio Link (`/bio`):** khusus bio TikTok & Instagram berparameter UTM.
- **Admin HUB (`/admin`):**
  - Dashboard Analitik & Ringkasan Penjualan.
  - Master Katalog (PIM) CRUD & sync Cloudinary.
  - Manajemen Stok Bahan NSA & Status Restok Supplier.
  - Kanban Antrean Produksi dengan Label Sumber Garmen (`[STOK STUDIO]` vs `[TARIK GARMEN NSA]`).
  - Modal Manifest Tarik Vendor NSA (JIT) dengan 1-klik salin format chat WhatsApp ke supplier.
  - Generator Label Pengiriman Thermal A6 (100x150 mm) dengan barcode visual & toggle white-label dropship.
  - Gang Sheet Roll DTF Builder interaktif.
  - QC Defect & Return Tracker (pencatatan kerugian HPP akibat reject kain/DTF).
  - WhatsApp Custom Quoter instan.
- **Database Backend:** Single Consolidated Master Schema [`database/schema.sql`](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/database/schema.sql) (12 tabel, trigger auth, RLS, view kalkulasi margin, seed data lengkap).
- **SEO & PWA:** Dynamic OpenGraph (`SEOHead.jsx`), `sitemap.xml`, `robots.txt`, manifest PWA (Add to Home Screen).
- **Brand Logo & Tipografi:** 
  - Vektor Master Logo Otentik ("The Tee & The Stock" — siluet kaos lipat berkerah crewneck ribbed di atas 3 lipatan bertumpuk) berbasis aset asli founder [`Logo TeeStock Monokrom.png`](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/brand/Logo%20TeeStock%20Monokrom.png).
  - Wordmark tipografi **Plus Jakarta Sans 900 (Black)** dengan tracking rapat `-0.03em`.
  - Sub-badge resmi: **`RETAIL APPAREL HOUSE`** (JetBrains Mono Bold).
  - Favicon & App Icon: Terracotta Emblem Badge (`#D95D39`, `rx="22"`).
- **Source Code:** [`web/`](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/web) folder.

---

## 📂 Dokumen & Tools yang Tersedia

### 🎨 Brand Identity (`brand/`)
- [**`brand-guide-teestock.md`**](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/brand/brand-guide-teestock.md) — Identitas brand Curated Apparel & Merch House, dual-pillar architecture, The Drop Model, anatomi logo otentik, palet warna, dan packaging experience.
- [`Logo TeeStock Monokrom.png`](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/brand/Logo%20TeeStock%20Monokrom.png) — Aset master asli 1024px dari founder.
- [`teestock-logo.svg`](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/brand/teestock-logo.svg) & [`web/public/logo-teestock.svg`](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/web/public/logo-teestock.svg) — Master logo vektor resolusi tinggi dan Terracotta app icon badge.
- `teestock-logo-master-dark.jpg` & `teestock-logo-master-light.jpg` — Master logo visual preview.

### ⚙️ Operasional & Roadmap (`operasional/`)
- [**`arsitektur-otomasi-website.md`**](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/operasional/arsitektur-otomasi-website.md) — Blueprint otomatisasi penuh (Midtrans, Fonnte WA, Biteship API, n8n, Vercel, Supabase).
- [**`roadmap-pengembangan-teestock.md`**](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/operasional/roadmap-pengembangan-teestock.md) — Roadmap 4 fase solopreneur lengkap dengan exit criteria dan alokasi waktu mingguan.
- [**`rencana-operasional-teestock.md`**](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/operasional/rencana-operasional-teestock.md) — Alur rantai pasok garmen NSA & DTF, kapasitas produksi harian, SOP heat press in-house, dan struktur channel.
- `struktur-folder-teestock.md` — Struktur folder kerja produksi & katalog.

### 💰 Keuangan & Pricing (`keuangan/`)
- [**`skema-pricing-dan-pencatatan-keuangan.md`**](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/keuangan/skema-pricing-dan-pencatatan-keuangan.md) — Master Blueprint Skema Pricing Dinamis, HPP Moving Average, Hard Floor ARB (Auto Rijek Bawah), pengadaan barang, dan pemisahan kas bisnis vs pribadi.
- [**`analisis-fee-payment-gateway-dan-margin.md`**](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/keuangan/analisis-fee-payment-gateway-dan-margin.md) — Analisis finansial CFO dampak fee QRIS 0,7% vs Virtual Account Rp 4.000 flat vs Shopee 12% terhadap HPP garmen & margin bersih.

### 📊 Riset & Strategi (`riset/`)
- [**`analisis-bisnis-teestock.md`**](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/riset/analisis-bisnis-teestock.md) — Riset pasar riil, unit economics aktual HPP Rp 48k–54k, strategi multi-tier, dan scoring matrix.
- [**`analisis-website-teestock.md`**](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/riset/analisis-website-teestock.md) — Analisis kebutuhan arsitektur website React + Supabase.
- `daftar-niche-teestock.md` — Pustaka 197 niche dalam 17 kategori sebagai bank ide Drop masa depan.

---

## 📋 Action Checklist (Minggu Ini)

1. [x] **Inspeksi Fisik Blank Kaos:** Blank NSA 24s sudah dipegang dan tervalidasi bagus.
2. [x] **Kesiapan Alat Produksi:** Mesin heat press in-house sudah siap di rumah.
3. [x] **Master Brand Identity & Logo Otentik:** Vektorisasi presisi master logo asli "The Tee & The Stock" dan integrasi tipografi Plus Jakarta Sans 900.
4. [x] **Modern Editorial Lookbook Storefront:** Desain Direction A live dengan split hero, live color swatches, hotspot anatomy, dan infografis cost transparency.
5. [ ] **Uji Coba DTF & Stress Test (Hari Ini):** Cetak sampel DTF, lakukan press dengan suhu 155°C, uji kupas film dan uji cuci 3x.
6. [ ] **Dokumentasi Video Aset Konten:** Rekam proses press dan kupas DTF (ASMR peel) sebagai bahan video peluncuran TikTok & Reels.
7. [ ] **Kurasi 3–4 Desain Drop #01:** Pilih 3–4 desain jagoan dari bank desain dengan satu tema payung yang konsisten ("RAW IDENTITY").
8. [ ] **First 5–10 Sales:** Buka batch perdana (24 pcs kuota) dengan promo launching Rp 89.000 – Rp 99.000 ke circle terdekat via WhatsApp & link `/bio`.
