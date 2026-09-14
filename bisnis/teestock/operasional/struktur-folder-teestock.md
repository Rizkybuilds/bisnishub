---
title: "Struktur Folder & Standarisasi Dokumen TeeStock"
date: "2026-09-14"
bisnis: teestock
kategori: operasional
status: active
tags:
  - bisnis/teestock
  - operasional
  - struktur-folder
  - konvensi
---

# Struktur Folder — TeeStock

Struktur ini dirancang untuk mengakomodasi: katalog desain multi-series yang terus bertambah, pesanan custom per-customer, beberapa vendor dengan peran berbeda, dokumentasi produksi, empat channel penjualan, empat lini bisnis, dan pencatatan keuangan — dalam satu sistem yang tetap gampang dicari meski TeeStock berkembang.

```
TeeStock/
│
├── 01_Brand/
│   ├── Logo/
│   │   ├── Logo_Hitam_Latar_Terang.png
│   │   ├── Logo_Putih_Latar_Gelap.png
│   │   ├── Logo_Icon_Only.png
│   │   └── Logo_Wordmark_Gandeng.png
│   ├── Brand_Guide_TeeStock.md
│   ├── Palet_Warna/
│   └── Font/
│
├── 02_Riset_Strategi/
│   ├── Daftar_Niche_TeeStock.md
│   ├── Analisis_Bisnis_TeeStock.md
│   └── Rencana_Operasional_TeeStock.md
│
├── 03_Desain/
│   ├── 01_TeeStock_Profesi/
│   │   ├── WIP/
│   │   ├── Final_Siap_Cetak/
│   │   └── Mockup_Promosi/
│   ├── 02_TeeStock_Fase/
│   ├── 03_TeeStock_Komunitas_Aktif/
│   ├── 04_TeeStock_Lokal/
│   ├── 05_TeeStock_Fandom/
│   ├── 06_TeeStock_Receh_Sarkas/
│   ├── 07_TeeStock_Momen/
│   ├── 08_TeeStock_Squad/
│   ├── 09_TeeStock_Kampus_Akademik/
│   └── Custom_Order/
│       └── [Nama_Customer]_[Tanggal]/
│
├── 04_Vendor/
│   ├── Blank_Apparel/
│   │   └── New_State_Apparel/
│   │       ├── Katalog_Harga.pdf
│   │       └── Kontak.md
│   ├── Cetak_DTF/
│   │   ├── Spesifikasi_Film.md
│   │   └── Kontak.md
│   └── Vendor_Cadangan/
│       └── (kontak vendor blank apparel & DTF cadangan, belum aktif)
│
├── 05_Produksi/
│   ├── SOP_Press.md
│   ├── QC_Checklist.md
│   ├── Tracking_Batch/
│   │   ├── Batch_01.xlsx
│   │   └── Batch_02.xlsx
│   └── Stok_Film_DTF.xlsx
│
├── 06_Katalog_Produk/
│   ├── Foto_Produk/
│   │   └── [per_series]/
│   ├── Deskripsi_Listing/
│   │   └── [per_desain].md
│   └── Harga_HPP.xlsx
│
├── 07_Channel_Penjualan/
│   ├── Shopee/
│   ├── TikTok_Shop/
│   ├── Blibli/
│   └── Website/
│
├── 08_Marketing/
│   ├── Konten_Kalender.xlsx
│   ├── Caption_Draft/
│   └── Aset_Sosial_Media/
│
├── 09_Lini_Bisnis/
│   ├── Custom_Order/
│   │   ├── Request_Masuk/
│   │   ├── Quote_Invoice/
│   │   └── Selesai/
│   ├── Kolaborasi/
│   │   └── [Nama_Partner]/
│   │       ├── Kesepakatan.md
│   │       └── Desain/
│   └── Reseller_Member/
│       ├── Data_Member.xlsx
│       └── Harga_Tier.md
│
├── 10_Keuangan/
│   ├── Pemasukan_Pengeluaran.xlsx
│   ├── Invoice/
│   └── Laporan_Bulanan/
│
└── 11_Legal_Admin/
    └── NIB_OSS/
```

## Penjelasan singkat per folder utama

| Folder | Fungsi |
|---|---|
| `01_Brand` | Semua aset identitas — logo, brand guide, palet warna. Referensi tetap yang jarang berubah |
| `02_Riset_Strategi` | Dokumen strategi yang sudah disusun (niche, analisis bisnis, rencana operasional) — acuan jangka panjang |
| `03_Desain` | File kerja desain, dipisah per series untuk katalog Stock, plus folder terpisah untuk Custom Order per customer |
| `04_Vendor` | Data & kontak vendor, dipisah antara vendor aktif dan cadangan |
| `05_Produksi` | Dokumen operasional harian — SOP, tracking batch, stok bahan |
| `06_Katalog_Produk` | Aset siap pakai untuk jualan — foto produk, deskripsi listing, perhitungan harga |
| `07_Channel_Penjualan` | Aset spesifik per platform (ukuran gambar, format berbeda tiap channel) |
| `08_Marketing` | Perencanaan & draft konten promosi |
| `09_Lini_Bisnis` | Data operasional 3 lini non-Stock — Custom Order, Kolaborasi, Reseller — dipisah karena siklus kerja beda-beda |
| `10_Keuangan` | Pencatatan uang masuk-keluar, invoice, laporan — terpisah dari operasional supaya gampang direkap |
| `11_Legal_Admin` | Dokumen legal/perizinan bisnis |

## Prinsip penamaan file

- Gunakan format `NamaDesain_Series_Tanggal` untuk file desain final (misal: `CommitAndPray_Profesi_20260901.png`)
- Untuk Custom Order, format folder `NamaCustomer_Tanggal` memudahkan pencarian dan pengarsipan setelah pesanan selesai
- Angka di depan folder utama (01, 02, dst.) menjaga urutan folder tetap sesuai alur kerja, bukan alfabetis acak

## Prioritas implementasi

Nggak perlu bikin semua folder sekaligus dari awal. Berdasarkan fase bisnis yang sudah direncanakan:
- **Sekarang (Fase 1):** `01_Brand`, `02_Riset_Strategi`, `03_Desain` (series batch 1 + Custom Order), `04_Vendor`, `05_Produksi`, `06_Katalog_Produk`, `07_Channel_Penjualan`, `10_Keuangan`
- **Nanti (Fase 2):** `09_Lini_Bisnis/Kolaborasi` dan `09_Lini_Bisnis/Reseller_Member` baru perlu diaktifkan saat dua lini itu mulai jalan
