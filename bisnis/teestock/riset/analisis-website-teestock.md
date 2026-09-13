# Analisis Kebutuhan Website/Aplikasi — TeeStock

> [!NOTE]
> **Pembaruan September 2026:** Dokumen ini telah diperbarui untuk merefleksikan implementasi aktual tech stack TeeStock yang beralih dari rekomendasi awal WordPress/WooCommerce menjadi **Modern Web Stack (React 18 + Vite + Tailwind CSS + Supabase PostgreSQL + Cloudinary CDN)** yang di-deploy di **Vercel**. Analisis kebutuhan bisnis dan user flow (Bagian 1–5) tetap dipertahankan, sedangkan arsitektur teknis, integrasi, estimasi biaya, roadmap, dan catatan risiko (Bagian 6–10) telah dimutakhirkan.

Dokumen ini menganalisis kebutuhan fitur, UI/UX, dan arsitektur teknis website TeeStock, berdasarkan peran website yang sudah ditetapkan di `rencana-operasional-teestock.md`: bukan cuma etalase jualan, tapi juga pusat operasional untuk Custom Order dan (nanti) Reseller/Member.

---

## 1. Peran Website dalam Ekosistem TeeStock

Penting untuk ditegaskan dari awal: website TeeStock **bukan kompetitor marketplace**, tapi pelengkap dengan fungsi berbeda:

| Fungsi | Marketplace (Shopee/TikTok/Blibli) | Website Sendiri |
|---|---|---|
| Volume penjualan Stock | Utama | Sekunder |
| Kepercayaan transaksi baru | Tinggi (built-in) | Perlu dibangun sendiri |
| Custom Order (form request, quote) | Tidak fleksibel | **Utama** |
| Reseller/Member (nanti) | Tidak bisa | **Utama** |
| Kontrol branding penuh | Terbatas | Penuh |
| Biaya platform | Ada fee per transaksi | Tidak ada fee transaksi (di luar payment gateway) |

Implikasinya: fitur website harus diprioritaskan untuk hal yang **tidak bisa dilakukan marketplace**, bukan cuma menduplikasi fungsi toko online biasa.

## 2. Analisis Kebutuhan Fitur

### Fase 1 — Wajib ada di peluncuran

**A. Katalog Stock**
- Halaman produk per series (9 series sesuai brand guide), dengan filter/kategori niche di dalamnya
- Pencarian produk (penting karena katalog akan terus melebar per batch)
- Halaman detail produk: mockup, deskripsi, pilihan ukuran/warna, harga
- Keranjang belanja & checkout
- Integrasi pembayaran (transfer bank, e-wallet, QRIS — lihat bagian integrasi)
- Kalkulasi ongkir otomatis berdasarkan alamat

**B. Custom Order**
- Form request custom (bukan cuma kolom teks bebas — sebaiknya terstruktur: jenis produk, deskripsi desain, upload referensi gambar, jumlah pcs)
- Alur status pesanan yang jelas ke customer: *Request diterima → Quote dikirim → Menunggu pembayaran → Diproses → Dikirim*
- Notifikasi otomatis (email/WhatsApp) tiap kali status berubah, supaya kamu nggak perlu update manual satu-satu

**C. Konten Brand**
- Halaman "Tentang TeeStock" — cerita brand, konsep series (penting untuk edukasi konsumen kenapa katalognya luas tapi tetap satu brand)
- Halaman per series dengan sedikit storytelling (bukan cuma daftar produk kosong)

**D. Kontak & Dukungan**
- Tombol WhatsApp langsung (paling praktis untuk solo founder, nggak perlu sistem tiket rumit dulu)
- FAQ (ukuran, bahan, estimasi produksi, kebijakan retur)

### Fase 2 — Menyusul setelah Fase 1 stabil

**E. Halaman Kolaborasi**
- Showcase partner kolaborasi & koleksi khusus mereka
- Bisa dibuat sesederhana halaman landing per kolaborasi, tidak perlu sistem rumit

**F. Portal Reseller/Member**
- Form pendaftaran reseller
- Dashboard sederhana: lihat harga tier khusus, riwayat order reseller
- Di tahap awal, ini bisa berupa halaman dengan login sederhana — belum perlu sistem dashboard canggih

## 3. User Flow Utama

**Flow pembeli Stock (skenario paling umum):**
Landing/homepage → pilih series atau cari niche spesifik → lihat detail produk → tambah ke keranjang → checkout → bayar → konfirmasi

**Flow Custom Order (skenario baru yang perlu dirancang hati-hati):**
Halaman Custom Order → isi form terstruktur + upload referensi → submit → (di sisi kamu: review & buat quote) → customer terima notifikasi quote → customer setuju & bayar → status "diproses" → status "dikirim"

*Catatan penting:* jangan bikin form Custom Order jadi terlalu panjang/menakutkan. Idealnya di bawah 5-6 field wajib, sisanya opsional.

## 4. Peta Situs (Sitemap)

```
Beranda
├── Katalog
│   ├── TeeStock Profesi
│   ├── TeeStock Fase
│   ├── TeeStock Komunitas/Aktif
│   ├── TeeStock Lokal
│   ├── TeeStock Fandom
│   ├── TeeStock Receh/Sarkas
│   ├── TeeStock Momen
│   ├── TeeStock Squad
│   └── TeeStock Kampus/Akademik
├── Custom Order
│   ├── Form Request
│   └── Cek Status Pesanan
├── Kolaborasi (Fase 2)
├── Reseller/Member (Fase 2)
│   ├── Daftar Reseller
│   └── Dashboard Reseller
├── Tentang TeeStock
├── FAQ
└── Keranjang & Checkout
```

## 5. Prinsip UI/UX

Semua desain antarmuka mengikuti brand guide yang sudah ada — bukan tema generik dari template:

- **Warna** — netral dasar (krem/hitam/charcoal) sebagai warna latar utama situs, dengan warna aksen series dipakai secara halus untuk menandai kategori (misal border/badge kecil di kartu produk sesuai warna series-nya) — konsisten dengan sistem warna di brand guide
- **Navigasi berbasis series** — menu utama mengikuti 9 series, bukan kategori generik seperti "Pria/Wanita" — ini menegaskan positioning "banyak pilihan lewat series", sesuai konsep brand
- **Mobile-first** — mayoritas pembeli Indonesia mengakses lewat HP, terutama yang datang dari TikTok/Instagram. Semua elemen (form, tombol checkout, form custom order) harus dites dulu di layar kecil, bukan didesain dari layar desktop lalu "disusutkan"
- **Kartu produk yang konsisten** — foto produk, nama desain, nama series, harga — format yang sama di semua kartu supaya katalog yang luas tetap terasa rapi saat di-scroll
- **Kepercayaan visual untuk pembeli baru** — karena website belum punya "kepercayaan bawaan" seperti marketplace, tampilkan elemen kepercayaan (testimoni, foto real produk, kebijakan retur yang jelas) lebih menonjol dibanding di marketplace

## 6. Rekomendasi Arsitektur Teknis

Meskipun pada evaluasi awal sempat dipertimbangkan WordPress + WooCommerce, sistem website TeeStock telah diimplementasikan secara aktual menggunakan arsitektur modern web application: **React 18 + Vite + Tailwind CSS (frontend)**, **Supabase PostgreSQL (backend/database)**, dan **Cloudinary CDN (image hosting)**, yang di-deploy di platform **Vercel**.

### Arsitektur Aktual: Modern Jamstack & BaaS

| Lapisan / Komponen | Teknologi | Peran dalam Sistem |
|---|---|---|
| **Frontend Framework** | **React 18 + Vite** | Single Page Application (SPA) ultra-cepat, modular, dan interaktif dengan waktu build instan. |
| **Styling & UI** | **Tailwind CSS** | Styling utility-first yang memberi kontrol visual 100% presisi sesuai brand identity TeeStock tanpa batasan template. |
| **Backend & Database** | **Supabase (PostgreSQL)** | Database relasional tangguh, Realtime API, skema data terstruktur, dan Row Level Security (RLS). |
| **Autentikasi** | **Supabase Auth** | Manajemen user bawaan dengan dukungan Google OAuth & Email Magic Link untuk customer dan admin hub. |
| **Asset & Image CDN** | **Cloudinary CDN** | Penyimpanan mockup resolusi tinggi, foto real produk, dan aset desain custom dengan optimasi format web otomatis. |
| **Deployment & Hosting** | **Vercel** | Platform deployment serverless global dengan CI/CD otomatis dari repositori GitHub, edge network, dan SSL gratis. |

### Mengapa Arsitektur Ini Jauh Lebih Unggul dibanding WordPress/WooCommerce?

1. **Nol Biaya Hosting (Zero Hosting Cost):**
   - Frontend di-hosting gratis di **Vercel Hobby Tier** dengan performa CDN edge global tanpa perlu sewa server cPanel/VPS bulanan.
   - **Supabase Free Tier** menyediakan database PostgreSQL 500 MB dan hingga 50.000 Monthly Active Users (MAU) untuk autentikasi — sangat mencukupi untuk ribuan transaksi awal.
   - **Cloudinary Free Tier** menyediakan kuota 25 kredit media per bulan (~25 GB bandwidth/storage) untuk kompresi dan pengiriman gambar cepat.
2. **Kontrol Penuh atas Branding & UX (Full Branding Control):**
   - Tidak terikat tema monolitik WordPress yang kaku. UI monokrom minimalis khas TeeStock dapat dikustomisasi secara leluasa tanpa batasan template builder.
3. **Bebas Ketergantungan Plugin (No Plugin Dependency):**
   - Mengeliminasi masalah klasik WordPress: konflik antar-plugin, celah keamanan pihak ketiga, beban query database berlebih (*bloat*), dan tagihan lisensi plugin komersial tahunan.
4. **Kemampuan Membangun Fitur Operasional Kustom (Custom Features):**
   - Bukan sekadar toko ritel biasa, stack ini memungkinkan pembangunan modul operasional internal langsung di dalam satu aplikasi:
     - **Admin Panel Terpusat (`/admin`):** Dashboard performa, manajemen katalog CRUD, dan inventory tracking.
     - **Kanban Order Board:** Visualisasi alur produksi pesanan custom secara real-time.
     - **Gang Sheet Builder:** Tool layout otomatis untuk efisiensi cetak film DTF meteran.
     - **Quoter Tool:** Kalkulator instan HPP dan estimasi harga pesanan apparel custom.
5. **Performa & Kecepatan Akses Mobile:**
   - Navigasi instan via React Router tanpa reload halaman penuh (*zero page reload*), krusial untuk mengonversi traffic mobile dari link media sosial (TikTok & Instagram).

## 7. Integrasi yang Dibutuhkan

| Kebutuhan | Status & Rekomendasi Integrasi | Keterangan |
|---|---|---|
| **Pembayaran** | Midtrans atau Xendit | Mendukung transfer bank virtual account, e-wallet (GoPay, OVO, ShopeePay), dan QRIS dalam satu alur checkout terpadu. |
| **Ongkos Kirim** | RajaOngkir atau Biteship | Kalkulasi tarif ongkir kurir nasional (J&T, SiCepat, JNE, POS) otomatis berdasarkan alamat tujuan dan berat paket. |
| **Autentikasi Pengguna** | **Supabase Auth (Aktif)** | Login aman menggunakan Google OAuth dan Magic Link tanpa password untuk pelanggan maupun akses dashboard admin. |
| **Analitik & Tracking** | **Google Analytics 4 (GA4) + Meta Pixel (Aktif)** | Pelacakan konversi e-commerce, tracking atribusi kampanye iklan TikTok/Instagram, serta analisis funnel belanja. |
| **Hosting & Delivery Media** | **Cloudinary CDN (Aktif)** | Transformasi gambar dinamis, auto-format WebP, dan pengiriman gambar produk berkecepatan tinggi via CDN. |
| **Komunikasi Cepat** | Tombol WhatsApp Direct (`wa.me`) | Interaksi langsung untuk konsultasi pesanan custom dan customer support cepat tanpa friksi. |
| **Sinkronisasi Marketplace** | API Marketplace (Opsional, Fase Lanjutan) | Dipertimbangkan setelah volume penjualan lintas platform menuntut integrasi sinkronisasi stok terpusat. |

## 8. Estimasi Kebutuhan Biaya Awal Website

Dengan transisi ke modern web stack berbasis serverless & BaaS gratis, pengeluaran modal infrastruktur website berkurang drastis hingga **mendekati nol rupiah (near-zero infrastructure cost)**:

| Komponen | Provider & Tier | Estimasi Biaya | Keterangan |
|---|---|---|---|
| **Domain Kustom (.com / .id)** | Cloudflare / Niagahoster / Namecheap | Rp150.000 - 300.000 / tahun | Satu-satunya biaya wajib tahunan untuk domain resmi |
| **Frontend Hosting** | Vercel (Hobby Tier) | **Rp0** (Gratis) | SSL otomatis, continuous deployment, unlimited traffic wajar |
| **Database & Auth** | Supabase (Free Tier) | **Rp0** (Gratis) | 500 MB DB PostgreSQL, 50k MAU, API RESTful otomatis |
| **Media & Image Storage** | Cloudinary (Free Tier) | **Rp0** (Gratis) | 25 kredit media bulanan (~25 GB bandwidth/storage) |
| **Lisensi Software / Plugin** | Custom Code (React + Tailwind) | **Rp0** (Gratis) | Tanpa biaya plugin bulanan atau tema komersial |
| **Payment Gateway** | Midtrans / Xendit | **Rp0 setup** | Biaya variabel hanya dikenakan per transaksi sukses (~1,5% - 2,9% + Rp2.000) |

**Total Kebutuhan Biaya Website:** **< Rp 300.000 / tahun** (hanya sewa domain).
Jauh lebih hemat dibandingkan estimasi awal WordPress yang membutuhkan sewa shared hosting & plugin berbayar (~Rp 1,5 juta/tahun).

## 9. Roadmap Pengembangan

Implementasi website telah melangkah lebih maju dari rencana semula dengan tersedianya storefront publik serta modul operasional admin:

| Tahap | Status | Fokus & Fitur |
|---|---|---|
| **Tahap 1 (Fondasi, Fitur Inti, & Lookbook)** | ✅ **Sudah Dibangun (Live)** | - **Storefront Publik (Direction A Lookbook):** Split Hero Interaktif dengan live color swatches, 21st Category Filter Pills, 3-Pilar Bento Grid, Interactive Garment Hotspot Anatomy (5 pins), Visual Cost Transparency Infographic, Mobile Sticky Action Bar, Detail Produk, Keranjang Belanja, dan Order Tracking.<br>- **Master Brand & Logo Otentik:** Integrasi Vektor Master Logo Otentik (*The Tee & The Stock*), Tipografi Plus Jakarta Sans 900, Terracotta Favicon & App Badge.<br>- **Growth & Conversion:** Bio Link Mobile Page (`/bio`) khusus TikTok/IG, Voucher & Promotion System (Kode Kupon, Bundling Duo/Trio AOV Booster), Customer Account Hub (`/akun`).<br>- **Admin HUB (`/admin`):** Dashboard Analitik, PIM Katalog CRUD, Stok Bahan NSA & Modal Manifest JIT, Kanban Antrean Produksi, Generator Label Thermal A6 (100x150 mm), Gang Sheet DTF Builder, QC Defect Tracker, dan WA Custom Quoter.<br>- **Testing & Build:** 85/85 Vitest unit & integration test, zero build error di Vite. |
| **Tahap 2 (Otomasi Transaksional & Ekspedisi)** | 🔄 **Berikutnya (Next Up)** | - **Automated Payment Gateway:** Integrasi Webhook Midtrans (Dynamic QRIS 0,7% & VA) langsung update status order ke Supabase tanpa cek mutasi manual.<br>- **Automated Logistics & Auto-Resi:** Integrasi Biteship API untuk kalkulasi ongkir kecamatan, auto-generate resi AWB, dan auto-booking kurir pickup.<br>- **WhatsApp Gateway:** Integrasi Fonnte untuk auto-kirim invoice dan notifikasi pelacakan real-time ke WhatsApp pelanggan. |
| **Tahap 3 (Ekosistem Kemitraan B2B)** | 📅 **Masa Depan** | - **Partner Portal (`mitra.teestock.id`):** Subdomain terisolasi untuk reseller & dropshipper terverifikasi dengan login terpisah, harga grosir privat, dan resi white-label tanpa mengorbankan prestige harga ritel Rp 99.000 di toko utama. |

## 10. Catatan Risiko & Pertimbangan

- **Batas Kuota Free Tier (Supabase & Vercel) & Rencana Upgrade** — Free tier Vercel dan Supabase sangat memadai untuk fase peluncuran dan validasi pasar. Namun, kuota database PostgreSQL (500 MB) dan batas upload media harus dipantau. Pastikan seluruh gambar beresolusi tinggi disimpan di Cloudinary (bukan di database). Jika volume pesanan dan traffic meningkat pesat hingga mendekati limit, upgrade ke Supabase Pro ($25/bulan) atau Vercel Pro ($20/bulan) dapat dilakukan secara mulus (*seamless*) saat cash flow bisnis sudah terbukti positif.
- **Kebijakan Inaktivitas Proyek Supabase Free Tier** — Pada tier gratis, instance Supabase yang tidak menerima request selama 7 hari dapat memasuki status *paused*. Karena website dan admin panel digunakan aktif dalam operasional rutin, hal ini jarang menjadi kendala, namun tetap perlu dipastikan adanya request berkala atau upgrade ke tier berbayar begitu toko beroperasi penuh.
- **Fokus Channel & Alokasi Energi** — Ketersediaan website kustom yang canggih bukan berarti seluruh energi dicurahkan menunggu pengunjung organik di website. Penjualan ritel apparel Drop tetap didorong lewat marketplace (Shopee/TikTok Shop) dan media sosial; website diprioritaskan sebagai hub transaksi pesanan Custom Order B2B/komunitas, portofolio kredibilitas brand, dan efisiensi operasional studio.
- **Keamanan Data Pembayaran & Kredensial API** — Jangan pernah mengekspos environment variables rahasia (`SUPABASE_SERVICE_ROLE_KEY` atau secret key payment gateway) ke sisi client/frontend React. Seluruh transaksi pembayaran tetap wajib diproses melalui payment gateway berlisensi resmi (Midtrans/Xendit).

---

*Dokumen ini melengkapi set rencana bisnis TeeStock (`analisis-bisnis-teestock.md`, `brand-guide-teestock.md`, `rencana-operasional-teestock.md`, `struktur-folder-teestock.md`).*
