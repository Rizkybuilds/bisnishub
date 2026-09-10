# 👕 TeeStock

> Curated Apparel & Merch House — *"Wear Your Identity, Stock Your Story"*

**Status:** 🟡 Fase 1: Launching Preparation (Validasi Fisik DTF, In-House Heat Press & Kurasi Drop #01)

## Tentang

TeeStock adalah *creative apparel & merch house* independen yang memadukan kurasi desain apparel berkarakter dengan fasilitas studio produksi merchandise. TeeStock beroperasi dengan dua sayap utama:
1. **TeeStock Originals:** Lini ritel apparel siap pakai dengan sistem rilis berkala (*The Drop Model*).
2. **TeeStock Studio:** Sayap kreatif untuk pesanan kaos custom, kolaborasi official merch creator/komunitas, dan kemitraan dropship/reseller tanpa modal.

Model produksi lean: blank apparel New States Apparel (NSA Heavyweight 24s & Softstyle 30s) via distributor resmi NSA, cetak film DTF roll meteran, dan proses **heat press in-house mandiri di rumah**.

---

## ⚙️ Fasilitas Produksi & Status Fisik (Update September 2026)

* **Bahan Kaos Blank:** Kaos New States Apparel (NSA) Heavyweight 24s & Softstyle 30s sudah dipegang fisiknya oleh founder dan tervalidasi berkualitas garmen prima (fitting mantap & kain tebal berbobot).
* **Peralatan Cetak:** **Mesin Heat Press in-house sudah tersedia di rumah** — menghemat biaya jasa press vendor (hemat Rp 5.000 – Rp 7.000/pcs) dan mempercepat turnaround pesanan menjadi H+0 / H+1.
* **Sablon:** DTF roll meteran (Rp 28.000 – Rp 35.000/meter). Uji cetak DTF dan uji cuci (*stress test*) sedang dijalankan.

---

## 💰 Struktur Harga & Unit Economics (CFO Approved)

* **HPP Kaos NSA 24s Jadi:** ~**Rp 48.000 – Rp 54.000** (Kaos grosir Rp 37k + DTF A3/A4 Rp 8k-12k + Listrik/Press Rp 1k-2k + Packing/Polymailer Rp 2k).
* **Anchor Price (Harga Coret):** `Rp 139.000`
* **Harga Ritel Launching:** `Rp 99.000` (Sweet spot marketplace distro, margin kotor ~45%).
* **Harga Mitra Reseller:** `Rp 65.000` (Min 12 pcs, laba bersih solopreneur Rp 11k–16k/pcs atau ~16–20%, di atas target minimal 10%).
* **Harga Mitra Dropship:** `Rp 75.000` (Satuan white-label, laba bersih solopreneur Rp 21k–25k/pcs).
* **Custom Order Satuan:** `Rp 119.000 – Rp 139.000`

---

## 🎨 Koleksi Perdana: Kurasi Drop #01 Debut

> *Catatan: 6 sampel desain sebelumnya (IT/Tech, Outdoor, Local Pride) adalah sampel prototype pengembangan website. Solopreneur sudah memiliki kumpulan aset desain keren tersendiri yang saat ini sedang dikurasi menjadi 3–4 desain jagoan dengan payung tema terpadu (seperti "RAW IDENTITY" atau "ORIGINS") agar tidak membingungkan audiens dan algoritma media sosial.*

---

## 🌐 Website & Tech Stack (Selesai 100%)

Aplikasi web modern terintegrasi yang berfungsi sebagai storefront ritel, portal kustomisasi merchandise, dan hub operasional internal produksi studio:

- **Live URL:** [teestock.vercel.app](https://teestock.vercel.app)
- **Stack:** React 18 + Vite + Tailwind CSS + Supabase (PostgreSQL + RLS + Auth) + Cloudinary CDN + Vercel PWA
- **Fitur Storefront Publik:**
  - Dynamic Funnel Home (6-section architecture: Hero Hook, Live Drop, Dual Pillar, Trust Specs NSA 24s, Brand Story, VIP Lead Capture).
  - Dynamic Hybrid Stock & SLA Indicator (⚡ Ready Stock Studio H+0 vs 📦 Stok Gudang Pusat H+1).
  - Blank-to-Custom DTF Upsell Banner (+Rp 25.000) terintegrasi langsung ke `/custom-order`.
  - Paket Bundling Hemat AOV Booster (Paket Duo hemat Rp 18k / Paket Trio hemat Rp 42k).
  - Customer Reviews & Social Proof Engine (rating bintang 4.9/5, meteran kepuasan kain NSA & sablon DTF, verified buyer badge).
  - Katalog 9 Series + Filter NSA + Multi-tier Role Pricing (Ritel vs Reseller vs Dropship).
  - Detail Produk dengan rekomendasi ukuran & spesifikasi sablon DTF suhu 155°C.
  - Custom Order Studio (`/custom-order`) dengan formulir spesifikasi otomatis ke WhatsApp.
  - Cart & Checkout (`/keranjang`) dengan validasi kode kupon/voucher promo.
  - Pelacakan Pesanan Real-Time (`/tracking`).
  - Halaman Akun Member (`/akun`) dengan riwayat order, alamat tersimpan, dan status kemitraan.
  - Portal Kemitraan Mandiri (`/partner`) dengan kalkulator proyeksi profit interaktif.
  - Micro Landing Page Bio Link (`/bio`) khusus bio TikTok & Instagram berparameter UTM.
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
- **Brand Logo:** Aset vektor SVG resmi tumpukan lipatan kaos (*The Stock*) terintegrasi di seluruh komponen.
- **Source Code:** [`web/`](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/web) folder.

---

## 📂 Dokumen & Tools yang Tersedia

### 🎨 Brand Identity (`brand/`)
- [**`brand-guide-teestock.md`**](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/brand/brand-guide-teestock.md) — Identitas brand Curated Apparel & Merch House, dual-pillar architecture, The Drop Model, palet warna, dan packaging experience.
- `teestock-logo.svg` & `web/public/logo-teestock.svg` — Master logo vektor resolusi tinggi.
- `teestock-logo-master-dark.jpg` & `teestock-logo-master-light.jpg` — Master logo visual.

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
- `analisis-website-teestock.md` — Analisis kebutuhan arsitektur website React + Supabase.
- `daftar-niche-teestock.md` — Pustaka 197 niche dalam 17 kategori sebagai bank ide Drop masa depan.

---

## 📋 Action Checklist (Minggu Ini)

1. [x] **Inspeksi Fisik Blank Kaos:** Blank NSA 24s sudah dipegang dan tervalidasi bagus.
2. [x] **Kesiapan Alat Produksi:** Mesin heat press in-house sudah siap di rumah.
3. [ ] **Uji Coba DTF & Stress Test (Hari Ini):** Cetak sampel DTF, lakukan press dengan suhu 155°C, uji kupas film dan uji cuci 3x.
4. [ ] **Dokumentasi Video Aset Konten:** Rekam proses press dan kupas DTF (ASMR peel) sebagai bahan video peluncuran TikTok & Reels.
5. [ ] **Kurasi 3–4 Desain Drop #01:** Pilih 3–4 desain jagoan dari bank desain dengan satu tema payung yang konsisten.
6. [ ] **First 5–10 Sales:** Buka batch perdana (24 pcs kuota) dengan promo launching Rp 89.000 – Rp 99.000 ke circle terdekat via WhatsApp & link `/bio`.
