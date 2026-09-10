# Arsitektur & Roadmap Otomasi Website TeeStock (Full Automation Blueprint)

> Dokumen perencanaan teknis dari **CTO & Technical Squad** untuk otomatisasi alur transaksi, notifikasi, dan operasional website TeeStock (`bisnis/teestock/web`).

---

## 1. Visi Otomasi: Solopreneur Zero-Touch Administration

Bagi solopreneur yang mengelola 3 bisnis sekaligus (TeeStock, MultiGraph, Titik Buta), proses fisik (heat press 155°C & QC packing) tetap membutuhkan kehadiran fisik. Namun, **seluruh alur digital dan administratif dirancang 100% *zero-touch***:

```
[Customer Checkout] 
       │
       ▼
[Payment Gateway: Midtrans Dynamic QRIS] ──(Webhook HTTP POST)──┐
                                                                │
       ┌────────────────────────────────────────────────────────┘
       ▼
[Supabase Database Webhook / Edge Function]
  ├── 1. Auto-update status: 'pending' ➔ 'processing' (In-Production)
  ├── 2. Potong stok inventori / Trigger sinyal restok NSA
  │
  ├──► [WhatsApp Gateway: Fonnte] ──► Auto-send pesan invoice & Live Tracking URL ke pembeli
  │
  ├──► [Logistik API: Biteship] ──► Auto-generate nomor resi kurir (AWB) & jadwal pickup
  │
  └──► [Thermal Printer Workshop] ──► Auto-render slip kerja & label thermal A6 (100x150 mm)
```

---

## 2. Pilihan Tech Stack & Peran Tiap Modul

| Modul | Komponen Rekomendasi | Alternatif | Fungsi Spesifik |
|---|---|---|---|
| **Core Database & Backend** | **Supabase (PostgreSQL)** | Firebase | Database master terpusat, Row Level Security (RLS), dan Webhook pemicu event. |
| **Payment Gateway** | **Midtrans (Snap / Core)** | Xendit / Tripay | Auto-verifikasi pembayaran via QRIS dinamis & Virtual Account tanpa cek mutasi manual. |
| **Pesan Transaksional WA** | **Fonnte Gateway** | WAHA / Wablas | Mengirimkan pesan invoice, resi, dan notifikasi status pesanan langsung dari server. |
| **Logistik & Auto-Resi** | **Biteship API** | RajaOngkir Pro | Cek ongkir multi-kurir akurat kecamatan, auto-booking pickup, dan auto-generate label resi. |
| **Orkestrator Alur Kerja** | **Supabase Edge Functions** (Fase 1) / **n8n Self-Hosted** (Fase 2) | Make.com / Zapier | Penghubung logika bisnis antar-service tanpa biaya langganan SaaS mahal. |
| **Media & File Storage** | **Cloudinary CDN** | AWS S3 | Penyimpanan aset gambar katalog dan unggahan artwork custom beresolusi tinggi. |
| **Frontend Storefront** | **Vercel Edge Platform** | Netlify | Hosting React/Vite dengan kompresi Brotli/Gzip dan performa Core Web Vitals optimal. |

---

## 3. Rincian Tiga Alur Otomasi Kunci

### A. Otomasi Verifikasi Pembayaran (Midtrans $\rightarrow$ Supabase)
1. Pembeli memilih metode bayar QRIS dinamis di `/keranjang`.
2. Midtrans menerbitkan QR code unik sesuai total transaksi.
3. Begitu pembeli memindai QRIS via m-Banking/e-Wallet, Midtrans mengirimkan sinyal Webhook ke endpoint Supabase:
   - Endpoint: `/functions/v1/midtrans-webhook`
   - Payload: `transaction_status: 'settlement'`, `order_id: 'WEB-XXXXXX'`
4. Status pesanan di tabel `ts_orders` langsung beralih ke `processing` secara *real-time* ($< 2$ detik).

### B. Otomasi Notifikasi WhatsApp (Zero-Touch CS)
1. Database Trigger PostgreSQL mendeteksi perubahan status order menjadi `processing`.
2. Supabase memanggil API Fonnte dengan template transaksional:
   > *"Halo kak {{customer_name}}! 🎉 Pembayaran untuk pesanan #{{order_id}} sebesar Rp {{total_amount}} telah TERVERIFIKASI otomatis. Pesananmu sudah masuk ke antrean heat press studio. Pantau progresnya di: https://teestock.vercel.app/tracking?order={{order_id}}"*
3. Mengeliminasi kebutuhan chat manual "kak sudah transfer ya" dan upload bukti transfer manual.

### C. Otomasi Ekspedisi & Label Pengiriman (Biteship API)
1. Saat operator studio menyelesaikan heat press dan memindahkan pesanan ke kolom "Ready to Ship" di Kanban internal:
2. Biteship API dipanggil untuk:
   - Membuat order pengiriman ke ekspedisi pilihan (J&T / SiCepat / JNE).
   - Mengambil nomor resi kurir (*Air Waybill* / AWB).
   - Menghasilkan PDF label pengiriman thermal A6 (100x150 mm).
3. Pesan otomatis dikirim ke WhatsApp pembeli dengan nomor resi aktif.

---

## 4. Analisis Biaya Operasional (Perspektif Solopreneur)

| Komponen | Opsi Lean Bootstrap (Rekomendasi) | Opsi Scale-Up Pro |
|---|:---:|:---:|
| **Hosting (Vercel)** | Rp 0 (Hobby) | Rp 320.000 / bln |
| **Database (Supabase)** | Rp 0 (Free Tier 500 MB) | Rp 400.000 / bln |
| **Storage (Cloudinary)** | Rp 0 (Free 25 GB) | Rp 0 |
| **Payment Gateway (Midtrans)** | Rp 0 bulanan (Fee ~0,7% per transaksi) | Rp 0 bulanan |
| **WhatsApp Gateway (Fonnte)** | **Rp 85.000 / bln** (Paket Reguler) | Rp 150.000 / bln |
| **Logistik API (Biteship)** | Rp 0 bulanan (Pay-per-shipment) | Rp 0 bulanan |
| **TOTAL BIAYA TETAP** | **~Rp 85.000 / bulan** | **~Rp 870.000 / bulan** |

---

## 5. Roadmap Pelaksanaan Bertahap

```
[Fase 1: Launch Ready (Sekarang)]
  ├── Manual QRIS + 3-Digit Unique Code (0% Fee)
  ├── Link WA Prefilled & URL Tracking Live
  └── Validasi Penjualan Perdana
         │
         ▼
[Fase 2: Semi-Automation (10–50 Order/Bulan)]
  ├── Aktivasi Midtrans Merchant (QRIS Dinamis 0,7%)
  ├── Webhook Midtrans ➔ Supabase Status Update
  └── Fonnte WhatsApp Gateway (Auto-Invoice & Status Update)
         │
         ▼
[Fase 3: Full End-to-End Automation (>50 Order/Bulan)]
  ├── Integrasi Biteship API (Auto-AWB Booking)
  ├── Direct Thermal Print Label A6 dari Dashboard Admin
  └── Integrasi n8n untuk Auto-Restok Supplier NSA
```
