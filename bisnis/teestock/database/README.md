# ☁️ Panduan Setup Supabase Backend — TeeStock & Multi-Business Hub

> Panduan praktis langkah demi langkah menghubungkan master catalog TeeStock ke cloud database Supabase.

---

## 📌 Kenapa 1 Project untuk Semua Bisnis?
- **Hemat Biaya:** Memanfaatkan kuota 1 project gratis dari Supabase (maksimal 2 project gratis).
- **Kapasitas Melimpah:** Database PostgreSQL 500 MB (cukup untuk ratusan ribu produk & transaksi).
- **Rapi & Terisolasi:** Menggunakan awalan nama tabel (`ts_` untuk TeeStock, `mg_` untuk MultiGraph, `tb_` untuk Titik Buta).

---

## 🚀 Langkah Setup Supabase (Hanya 3 Menit)

### Langkah 1: Buat Project di Supabase
1. Buka [https://supabase.com](https://supabase.com) dan login (bisa pakai akun GitHub atau Google).
2. Klik **"New Project"**.
3. Isi data project:
   - **Name:** `business-hub` (atau nama pilihan kamu)
   - **Database Password:** *(Buat password yang kuat dan catat di tempat aman)*
   - **Region:** Pilih **Singapore (ap-southeast-1)** *(paling cepat untuk akses dari Indonesia)*
   - **Pricing Plan:** Free
4. Klik **"Create new project"** dan tunggu sekitar 1-2 menit hingga statusnya ready.

---

### Langkah 2: Jalankan Script Database (`schema.sql`)
1. Di dashboard Supabase, buka menu **SQL Editor** (ikon `>_` di bilah navigasi kiri).
2. Klik **"New query"**.
3. Buka file [schema.sql](file:///c:/Users/Rizky/ai-mentor-bisnis/bisnis/teestock/database/schema.sql), lalu **Copy semua isinya**.
4. Paste ke dalam SQL Editor di Supabase.
5. Klik tombol hijau **"Run"** (atau tekan `Ctrl + Enter`).
6. Muncul pesan `Success. No rows returned`.

> 🎉 **Selesai!** 5 tabel (`ts_products`, `ts_unit_economics`, `ts_inventory`, `ts_orders`, `ts_order_items`) beserta data awal Batch 1 sudah otomatis aktif!

---

### Langkah 3: Ambil API URL & Anon Key
1. Di dashboard Supabase, buka menu **Project Settings** (ikon gear ⚙️ di kiri bawah).
2. Pilih sub-menu **API**.
3. Salin 2 data penting ini:
   - **Project URL:** `https://tovslowsopqtuxmrogeu.supabase.co`
   - **Project API Keys (`anon` / `public`):** `sb_publishable_8iRmZUulGLChIPZhFXn_rg_QuHlmpA4`

---

### Langkah 4: Hubungkan ke Alat Katalog TeeStock
1. Buka file [teestock-catalog.html](file:///c:/Users/Rizky/ai-mentor-bisnis/bisnis/teestock/tools/teestock-catalog.html) di browser.
2. Tool sudah **terhubung otomatis** ke Supabase Cloud (`https://tovslowsopqtuxmrogeu.supabase.co`) dan Cloudinary CDN (`z6qhdkde`).
3. Seluruh data produk, HPP, margin, dan foto tersinkronisasi otomatis!

---

## 🖼️ Konfigurasi Cloudinary Image CDN
- **Cloud Name:** `z6qhdkde` (rizkybuilds)
- **API Key:** `978731328676184`
- **Upload Preset (Unsigned):** `teestock_preset`
- **Fungsi:** Mengunggah foto mockup langsung dari laptop ke CDN global dengan auto-format WebP/AVIF (`f_auto,q_auto`).
- **Cara Buat Preset Unsigned:**
  1. Buka [https://console.cloudinary.com/settings/upload](https://console.cloudinary.com/settings/upload).
  2. Scroll ke bagian **Upload presets** > Klik **Add upload preset**.
  3. Beri nama `teestock_preset` dan ubah **Signing Mode** menjadi **Unsigned**.
  4. Klik **Save**.

---

## 📊 Struktur Tabel TeeStock yang Terbentuk

| Nama Tabel | Fungsi Utama |
|---|---|
| `ts_products` | Master katalog desain (SKU, nama, series, template, status, file path, deskripsi) |
| `ts_unit_economics` | Biaya HPP blank, cetak DTF, press, pack, harga retail, dropship, reseller |
| `ts_inventory` | Stok bahan baku kaos polos New State Apparel (warna, ukuran S-3XL) |
| `ts_orders` | Rekap pesanan customer dari Shopee, Tokopedia, WhatsApp, dll. |
| `ts_order_items` | Rincian kaos yang dibeli per pesanan |
| `ts_view_catalog_summary` | View otomatis penggabungan produk + HPP + auto-hitung margin % |
