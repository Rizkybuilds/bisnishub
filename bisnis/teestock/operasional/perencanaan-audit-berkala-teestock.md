---
title: "Master Framework & SOP Audit Berkala Web App TeeStock"
date: "2026-09-18"
bisnis: teestock
kategori: operasional
status: active
tags:
  - bisnis/teestock
  - kategori/operasional
  - audit/berkala
  - quality-assurance
  - store-performance
  - mobile-first
---

> [!abstract] Ringkasan Eksekutif: Sistem Audit Berkala TeeStock Storefront
> Setelah seluruh fondasi operasional **BisnisHub OS** (Admin Hub 15 Checkpoint) selesai 100% dan teruji terintegrasi, komando difokuskan sepenuhnya pada **Sisi Klien (TeeStock Storefront - `teestockapparel.vercel.app`)**.
>
> Mengingat **85%+ calon pembeli ritel apparel bertransaksi melalui smartphone** (Instagram, TikTok bio, dan WhatsApp link), stabilitas storefront tidak boleh bersifat "sekali rilis lalu ditinggal". Dokumen ini menetapkan **Framework Audit Berkala 4 Siklus** (Harian, Mingguan, Bulanan, dan Pra-Drop) untuk memastikan konversi tinggi, nol kebocoran kas, kecepatan di bawah 1.5 detik, dan keandalan transaksi tanpa celah keamanan.

---

## 1. Visi & Prinsip Co-Founder dalam Audit Storefront

Mengacu pada [[catatan/piagam-co-founders-bisnishub|Piagam Co-Founders BisnisHub]], audit berkala dilakukan dengan 5 lensa pilar kabinet:

1. **CTO (Teknologi & Keandalan)**: *Zero Console Errors*, 100% tes otomatis lulus, bundle size terkontrol, pencegahan memory leak pada modal & viewer.
2. **COO (Operasional & DTF SLA)**: Sinkronisasi data pesanan ke antrean Kanban, SLA produksi H+0 / H+1, akurasi data varian garmen NSA.
3. **CFO (Finansial & Unit Economics)**: Net margin ritel $\ge 35\%$, batas diskon promo/voucher max 25%, proteksi kode unik QRIS manual tanpa gateway fee.
4. **CMO (Marketing, SEO & Konversi)**: Tampilan tautan kartu produk di WhatsApp/iMessage (OpenGraph), waktu loading bio link $< 0.8\text{ detik}$, tingkat konversi keranjang belanja.
5. **Retention & UX Expert**: Kenyamanan mobile (360px–430px), kemudahan lacak pesanan tanpa friksi, unboxing & garansi retur teredukasi jelas.

---

## 2. Peta 7 Vektor Audit Berkala TeeStock

```
                   ┌─────────────────────────────────────────────────┐
                   │     TEESTOCK STOREFRONT PERIODIC AUDIT MATRIX   │
                   └───────────────────────┬─────────────────────────┘
                                           │
         ┌───────────────┬─────────────────┼─────────────────┬───────────────┐
         │               │                 │                 │               │
         ▼               ▼                 ▼                 ▼               ▼
   [01. PERF]      [02. MOBILE]       [03. FUNNEL]      [04. CASH]      [05. SEC]
   Core Web        Viewport 360-430px Katalog -> PDP    Net Margin 35%  Supabase RLS
   Vitals (LCP)    Touch ≥44x44px     Cart -> Ongkir    Voucher Max 25% PII 4-Digit HP
   Bundle <800kB   Virtual Keyboard   QRIS Kode Unik    Tarif Ekspedisi Zero Console
```

| Vektor | Domain | Parameter Kunci & Standar Lulus | Alat Ukur / Metode |
|---|---|---|---|
| **V-01** | **Performa & CWV** | LCP $< 1.5\text{s}$, CLS $< 0.05$, INP $< 150\text{ms}$, Waktu Respon API $< 500\text{ms}$. | Vercel Speed Insights, Lighthouse, Web Vitals. |
| **V-02** | **Mobile-First UX** | Touch target $\ge 44\times 44\text{ px}$, tidak ada horizontal scrollbar pada 360px, drawer halus. | Playwright Mobile Chrome (Pixel 7), iPhone 14. |
| **V-03** | **Alur Checkout** | Transaksi end-to-end lancar: Katalog $\rightarrow$ PDP $\rightarrow$ Cart $\rightarrow$ Ongkir $\rightarrow$ QRIS $\rightarrow$ Tracking. | Playwright E2E Golden Path Test Suite. |
| **V-04** | **Integritas Margin** | HPP terverifikasi (`NSA + DTF + Kemasan Rp 3.500`), diskon voucher tidak tembus $< 25\%$ margin. | Vitest Unit Tests (`pricing.test.js`), CFO Calc. |
| **V-05** | **Keamanan & DB** | RLS Supabase valid, nomor HP disamarkan (masking), proteksi pelacakan resi 4-digit HP. | Manual Pen-test, Audit Console, Vitest Auth. |
| **V-06** | **SEO & Sosmed** | OpenGraph WhatsApp image muncul (1200x630px), JSON-LD Structured Data valid, canonical link benar. | WhatsApp Link Debugger, Google Rich Results. |
| **V-07** | **Studio Ecosystem** | Halaman `/custom-order`, `/partner`, `/creator`, dan `/bio` berfungsi interaktif tanpa crash. | Multi-route automated Playwright sweep. |

---

## 3. Matriks 4 Siklus Jadwal Audit Berkala

### A. Siklus 1: Audit Harian (Daily Liveness Pulse - 5 Menit)
*Dijalankan setiap pagi jam 08:30 WIB oleh Operator/Founder sebelum memulai proses produksi.*

| Item Pemeriksaan | Target Standar | Aksi Cepat Jika Gagal |
|---|---|---|
| **1. Domain & SSL Uptime** | Web `teestockapparel.vercel.app` berstatus HTTP 200 OK dengan SSL aktif. | Cek Vercel Dashboard, restart deployment jika ada incident. |
| **2. Test Checkout Dummy** | Simulasikan penambahan 1 kaos polos ke cart, pastikan total ongkir & kode unik muncul. | Bersihkan cache, cek koneksi API kurir RajaOngkir / Supabase. |
| **3. Antrean Pesanan Supabase** | Pesanan masuk dari semalam tercatat rapi di tabel `ts_orders` dan muncul di Admin Kanban. | Sinkronisasi ulang database, cek status Supabase Singapore. |
| **4. Link CS WhatsApp** | Tautan tombol `wa.me/6285220274968` mengarah langsung ke WhatsApp Admin dengan draft pesan benar. | Cek `storeSettings` di tabel atau local storage. |

### B. Siklus 2: Audit Mingguan (Weekly Conversion & Performance Sprint - 30 Menit)
*Dijalankan setiap hari Senin jam 09:00 WIB.*

| Item Pemeriksaan | Target Standar | Metode Verifikasi |
|---|---|---|
| **1. Regresi Otomatis E2E** | 13 test Playwright Desktop & 13 test Mobile Chrome lulus 100%. | Jalankan `npx playwright test` di repo `bisnis/teestock/web`. |
| **2. Unit Test Suite** | Seluruh 104+ unit test Vitest lulus dalam $< 3\text{ detik}$. | Jalankan `npm test` di repo `bisnis/teestock/web`. |
| **3. Core Web Vitals Audit** | Skor Performance Lighthouse mobile $\ge 90$, LCP $< 1.8\text{s}$. | Uji via Chrome DevTools Lighthouse (Profile Mobile). |
| **4. Sinkronisasi Buffer NSA** | Stok fisik kaos polos NSA (Hitam/Putih 24s/30s) sesuai dengan status buffer web. | Cocokkan data fisik rak studio dengan modul `/admin/inventory`. |
| **5. Audit Voucher & Diskon** | Kode voucher promo yang sudah kedaluwarsa dinonaktifkan di `vouchersApi`. | Verifikasi masa berlaku promo di database Supabase. |
| **6. Audit Log Konsol Browser** | Nol runtime warning atau uncaught exceptions di 12 halaman publik. | Jalankan test case `comprehensive-audit.spec.js`. |

### C. Siklus 3: Audit Bulanan (Monthly Deep Security & Growth Audit - 60 Menit)
*Dijalankan pada tanggal 1 setiap awal bulan.*

| Item Pemeriksaan | Target Standar | Dokumen / Hasil yang Diterbitkan |
|---|---|---|
| **1. Audit Keamanan Supabase** | Row Level Security (RLS) aktif di seluruh 18 tabel. Anon key tidak bisa menulis tabel sensitif. | Laporan Kepatuhan RLS & Security Checklist di `/admin/settings`. |
| **2. Ekspor Backup Basis Data** | Snapshot data transaksi, pelanggan, dan katalog diekspor aman dalam format JSON/CSV ber-BOM. | Simpan file di `D:\BisnisHub\05_OPERASIONAL\02_Database_Backup\`. |
| **3. Evaluasi Funnel Konversi** | Rasio checkout vs pengunjung unik, analisis keranjang terbengkalai (abandoned cart rate). | Ringkasan metrik CRM bulanan di [[bisnis/teestock/keuangan/]]. |
| **4. Audit SEO & Search Console** | Google Search Console bebas dari broken link 404, seluruh URL canonical terindeks. | Cek dashboard GSC & audit sitemap `sitemap.xml`. |
| **5. Sinkronisasi Database Lead** | Rekap pelanggan newsletter baru (`ts_subscribers`) diekspor untuk materi broadcast drop. | File CSV 4E Campaign di [[bisnis/teestock/marketing/]]. |

### D. Siklus 4: Audit Khusus Pra-Peluncuran Koleksi (Pre-Drop Flight-Check)
*Wajib dijalankan H-2 sebelum drop koleksi grafis baru dirilis ke publik.*

| Checklist Pra-Drop | Spesifikasi Kebutuhan | Penanggung Jawab |
|---|---|---|
| **1. Pre-Flight File DTF** | Resolusi master artwork $\ge 300\text{ DPI}$, skala 1:1, latar transparan PNG, zero fringing. | Creative Director / COO |
| **2. Simulasi Gang Sheet 58cm** | Nesting roll DTF 58 cm telah dihitung via modul `/admin/gangsheet`, sisa ruang dimanfaatkan untuk neck label. | DTF Print Ops |
| **3. Setting Kuota Early Bird** | Jumlah stok edisi terbatas (cth: 24 pcs) di-input presisi pada katalog. | CMO / Admin |
| **4. Uji Stres Formulir Checkout** | Cek responsivitas checkout form saat diisi serentak dari tautan UTM Bio Link. | Fullstack Dev / CTO |
| **5. Pengujian Link Medsos** | Pastikan parameter `?utm_source=biolink&utm_campaign=drop01` aktif merekam di Google Analytics 4. | Growth Marketer |

---

## 4. Matriks Skor Kepatuhan & Ambang Batas (Health Thresholds)

Setiap sesi audit berkala menghasilkan skor kepatuhan berbasis 100 poin:

| Rentang Skor | Status Sistem | Protokol Tindakan |
|---|---|---|
| **95 – 100** | 🟢 **PRISTINE (Hijau)** | Sistem beroperasi optimal. Tidak diperlukan tindakan korektif darurat. |
| **85 – 94** | 🟡 **WATCHLIST (Kuning)** | Ada degradasi performa minor (misal: LCP 1.8s atau ada warning CSS). Wajib diperbaiki dalam sprint mingguan. |
| **< 85** | 🔴 **CRITICAL ACTION (Merah)** | Ditemukan bug alur checkout, error runtime, kebocoran margin, atau crash mobile. **Rilis ditahan / Hotfix segera**. |

---

## 5. Rencana Eksekusi Audit Awal Sisi Klien (Sprint Minggu Ini)

Untuk memulai audit berkala pertama pada sisi website client TeeStock secara terstruktur, tahapan audit akan dibagi ke dalam **5 Batch Pengujian Mendalam**:

1. **Batch 1: Audit Performa, Bundle Analyzer & Core Web Vitals**
   - Audit ukuran chunk output Vite, analisis tree-shaking library, validasi lazy-loading gambar.
2. **Batch 2: Audit Antarmuka Mobile-First & Aksesibilitas (a11y)**
   - Pengujian live pada simulated viewport 360px (Samsung Galaxy A-series), 390px (iPhone 14), dan 412px (Pixel 7).
   - Pengujian touch target seluruh tombol interaktif, modal size calculator, dan sticky bottom bar.
3. **Batch 3: Audit Validasi Formulir, Edge Cases & Error Handling**
   - Pengetesan input ekstrem (nomor HP 3 digit, nama mengandung karakter aneh, alamat kosong, voucher kadaluwarsa).
   - Pengujian offline fallback dan penanganan saat Supabase lambat/gangguan.
4. **Batch 4: Audit SEO, Social Share Cards & Integrasi Tracking**
   - Verifikasi meta tag OpenGraph di WhatsApp Web, Facebook Debugger, dan Twitter Card Validator.
   - Pengecekan Google Rich Snippet untuk schema `ClothingStore` dan `Product`.
5. **Batch 5: Rekapitulasi Laporan Audit & Sertifikasi Storefront Production**
   - Menerbitkan laporan hasil audit komprehensif, mendokumentasikan temuan, dan memastikan kesiapan peluncuran komersial.
