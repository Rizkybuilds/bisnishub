---
title: "Panduan Arsitektur & Direktori External SSD 1TB BisnisHub"
date: "2026-09-16"
bisnis: umum
kategori: operasional
status: active
tags:
  - operasional
  - external-ssd
  - storage-management
  - master-assets
  - teestock
  - multigraph
---

# 💾 Panduan Arsitektur & Manajemen Direktori External SSD 1TB

> [!abstract] Tujuan Sistem Penyimpanan
> Menjaga laptop kerja tetap kencang dan bebas dari penumpukan file raksasa (>50MB seperti PSD, AI, Video mentah 4K, dan Gang Sheet DTF 58 cm). Seluruh aset master, arsip legal/keuangan, dan backup sistem dipusatkan di **External SSD 1TB (Drive `D:\`)**.

---

## 1. Peta Direktori Master (`D:\`)

```
D:\
├── 00_INBOX_DROPZONE/                  # Folder transit kilat foto/video HP sebelum disortir
├── 01_BRAND_MASTER_IDENTITIES/         # Master vector logo (SVG/AI/EPS) & lisensi font
│   ├── TEESTOCK/                       # Logo "The Tee & The Stock", palet Terracotta & Obsidian
│   ├── MULTIGRAPH/                     # Master identitas cetak & template kemasan (dieline)
│   ├── KASKITA/                        # Aset visual produk SaaS
│   └── TITIK_BUTA/                     # Identitas inkubasi
├── 02_TEESTOCK_PRODUCTION/             # Produksi harian apparel
│   ├── 01_ARTICLES_CATALOG/            # Arsip per Drop & Artikel (PSD layer, 300 DPI, Mockups)
│   ├── 02_GANG_SHEETS_DTF_58CM/        # File roll meteran siap cetak (lebar 58 cm, safe margin)
│   └── 03_RAW_FOOTAGE_VIDEO/           # Video mentah 4K 60fps (Heat press BTS, unboxing)
├── 03_MULTIGRAPH_COLLATERAL/           # Cetak kemasan & B2B
│   ├── 01_TEESTOCK_PACKAGING_PRINTS/   # File cetak hangtag 310gsm, stiker vinyl, polymailer
│   ├── 02_CLIENT_B2B_PROJECTS/         # Arsip pesanan maklon cetak dari klien UMKM luar
│   └── 03_PRINT_TEMPLATES/             # Pola pisau die-line kardus, ukuran pouch, stiker botol
├── 04_LEGAL_INVOICE_FINANCIAL/         # Bukti transaksi & audit kasir
│   ├── Invoices_Vendor_Cititex/        # Struk belanja kaos polos NSA
│   ├── Invoices_Vendor_DTF/            # Nota cetak DTF meteran
│   └── Rekening_Koran_Bank/            # Rekening koran & rekap mutasi
└── 99_SYSTEM_SNAPSHOTS_BACKUP/         # Cadangan sistem berkala
    ├── Obsidian_Vault_Backups/         # Zip mingguan vault BisnisHub
    └── Supabase_DB_Dumps/              # Cadangan skema & data SQL Supabase
```

---

## 2. Aturan Baku Penamaan File (Naming Convention)

Setiap file yang disimpan ke dalam SSD wajib mengikuti format:
`YYYYMMDD_[BISNIS]_[NAMA_ITEM]_[VERSI/RESOLUSI].[EXT]`

### Contoh Nyata:
- **File Siap Cetak DTF:** `20260920_TS_ART01_ORIGINS_300DPI_A3.png`
- **File Desain Mentah:** `20260920_TS_ART01_ORIGINS_MASTER.psd`
- **Gang Sheet Roll:** `20260922_TS_GANGSHEET_58x150cm_BATCH01.tif`
- **Hangtag Kemasan:** `20260925_MG_HANGTAG_TEESTOCK_310GSM_READY.pdf`
- **Klip Video TikTok:** `20260926_TS_BTS_HEATPRESS_155C_4K60.mov`

---

## 3. Alur Kerja Harian: Laptop vs. SSD (Hot vs. Cold Storage)

| Lokasi | Jenis File yang Boleh Disimpan | Kebijakan Perawatan |
|---|---|---|
| **Laptop Lokal (`C:\`)** | File kode web (`apps/bisnishub-web`, `bisnis/teestock/web`), catatan teks Obsidian, dan 1 artikel desain yang *sedang diedit hari ini*. | Bersihkan folder Downloads dan Recycle Bin setiap akhir pekan. |
| **External SSD (`D:\`)** | Semua file mentah Photoshop (PSD), Illustrator (AI), file TIFF 300 DPI, roll gang sheet, video mentah 4K, nota invoice, dan backup zip. | Dicolokkan saat proses ekspor desain, penyusunan gang sheet, atau editing video. |

---

## 4. Skrip Otomasi & Sinkronisasi

Jika ingin memverifikasi atau membuat ulang struktur folder di drive lain:
- Jalankan via terminal:
  ```powershell
  powershell -ExecutionPolicy Bypass -File tools/setup_external_ssd.ps1 -TargetDrive D:
  ```
- File master index di root SSD: `D:\README_MASTER_VAULT.txt`
