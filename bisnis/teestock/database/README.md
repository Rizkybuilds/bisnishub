# ☁️ Panduan Setup Supabase Backend — TeeStock & Multi-Business Hub

> Panduan praktis langkah demi langkah menghubungkan master catalog & operasional TeeStock ke cloud database Supabase dalam **1 File SQL Master Terpadu**.

---

## 📌 Kenapa 1 Project untuk Semua Bisnis?
- **Hemat Biaya:** Memanfaatkan kuota 1 project gratis dari Supabase (maksimal 2 project gratis).
- **Kapasitas Melimpah:** Database PostgreSQL 500 MB (cukup untuk ratusan ribu produk, pelanggan & transaksi).
- **Rapi & Terisolasi:** Menggunakan awalan nama tabel (`ts_` untuk TeeStock, `mg_` untuk MultiGraph, `tb_` untuk Titik Buta).

---

## 🚀 Langkah Eksekusi (Hanya 1 File SQL Master)

### Langkah 1: Buka SQL Editor di Supabase
1. Buka [https://supabase.com](https://supabase.com) dan masuk ke dashboard project kamu:
   - Target Project: `https://supabase.com/dashboard/project/tovslowsopqtuxmrogeu`
2. Buka menu **SQL Editor** (ikon `>_` di bilah navigasi kiri).
3. Klik **"New query"**.

---

### Langkah 2: Jalankan Script Tunggal (`schema.sql`)
1. Buka file [schema.sql](file:///c:/Users/Administrator/Documents/GitHub/ai-mentor-bisnis/bisnis/teestock/database/schema.sql) di text editor.
2. **Copy seluruh isinya** (`Ctrl + A` -> `Ctrl + C`).
3. Paste ke dalam SQL Editor Supabase.
4. Klik tombol hijau **"Run"** (atau tekan `Ctrl + Enter`).
5. Tunggu pesan `Success. No rows returned`.

> 🎉 **Selesai!** Seluruh 12 tabel, trigger auth profil otomatis, view kalkulasi margin, RLS security policies, dan starter seed data (Batch 1 Desain + 12 NSA Blanks + Vouchers + Sample Orders) langsung aktif 100% tanpa perlu menjalankan migrasi terpisah!

---

### Langkah 3: Konfigurasi Kredensial di Web App
Kredensial tersimpan di `bisnis/teestock/web/.env`:
- **VITE_SUPABASE_URL:** `https://tovslowsopqtuxmrogeu.supabase.co`
- **VITE_SUPABASE_ANON_KEY:** `sb_publishable_8iRmZUulGLChIPZhFXn_rg_QuHlmpA4`

---

## 📊 Struktur Lengkap 12 Tabel TeeStock yang Terbentuk

| # | Nama Tabel | Fungsi Utama | Akses Publik / RLS |
|---|---|---|---|
| 1 | `ts_products` | Master katalog desain grafis & katalog kaos polos NSA Cititex | Read: Publik, Write: Admin |
| 2 | `ts_unit_economics` | Rincian HPP (blank, dtf, press, pack) & tier harga (retail, dropship, reseller) | Read: Publik, Write: Admin |
| 3 | `ts_inventory` | Stok garmen New States Apparel & material operasional (polymailer, hangtag, stiker) | Read/Write: Admin |
| 4 | `ts_orders` | Rekap pesanan multichannel (Web, Shopee, TikTok, WA) + Kanban status | Insert: Publik/Guest, Read: User & Admin |
| 5 | `ts_order_items` | Rincian item per pesanan (SKU, garmen, warna, size, qty, subtotal) | Insert: Publik/Guest, Read: Admin |
| 6 | `ts_user_profiles` | Profil member, role RBAC (member, partner, admin), alamat pengiriman | Read/Update: Own User, All: Admin |
| 7 | `ts_subscribers` | Email VIP newsletter & lead capture untuk peluncuran Drop | Insert: Publik, Read: Admin |
| 8 | `ts_vouchers` | Master kupon promo (`WELCOME10`, `TEESTOCKDROP`, `FREESHIP15`, `PARTNERVIP`) | Read: Active only, All: Admin |
| 9 | `ts_voucher_usage` | Riwayat transaksi pemakaian voucher kupon | Read: Own User, Insert: Checkout |
| 10 | `ts_defects` | Pencatatan cacat produksi QC, retur kurir, dan kalkulasi kerugian HPP | Read/Write: Admin |
| 11 | `ts_partner_applications` | Formulir pendaftaran calon mitra dropshipper / reseller | Insert: Publik, Manage: Admin |
| 12 | `ts_reviews` | Ulasan pembeli terverifikasi, rating bintang 1-5, testimoni fitting | Read/Insert: Publik, Manage: Admin |

### Fitur Database Tambahan:
- **View Otomatis `ts_view_catalog_summary`:** Menyatukan data produk, total HPP, margin kotor, fee marketplace 6.5%, dan profit bersih per pcs.
- **Trigger `on_auth_user_created`:** Otomatis membuat baris baru di `ts_user_profiles` saat pengguna mendaftar melalui Google OAuth atau Magic Link Email.
- **RLS (Row Level Security):** Mengamankan data sensitif seperti omset, order customer, dan stok bahan dari publik, sambil tetap mengizinkan pengunjung melakukan pembelian (guest checkout) dan mendaftar newsletter.

---

## 🖼️ Konfigurasi Cloudinary Image CDN
- **Cloud Name:** `z6qhdkde` (rizkybuilds)
- **API Key:** `978731328676184`
- **Upload Preset (Unsigned):** `teestock_preset`
- **Fungsi:** Mengunggah foto mockup langsung dari admin web ke CDN global dengan auto-format WebP/AVIF (`f_auto,q_auto`).
