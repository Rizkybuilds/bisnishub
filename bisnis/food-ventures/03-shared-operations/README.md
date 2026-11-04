---
canonical_id: food-ventures.operations.index
document_id: FVP-OPS-ROOT-001
title: "Food Ventures Shared Operations — Master Index"
date: "2026-11-04"
status: DRAFT
version: "0.1"
owner: Rizky
scope: food-ventures.shared-operations
business: food-ventures
category: operations
document_class: registry
effective_from: "2026-11-04"
last_reviewed: "2026-11-04"
review_cadence: quarterly
authoritative_for:
  - shared operations index
  - shared kitchen operating principles
  - operations vs brand boundaries
  - operational roadmap architecture
depends_on:
  - ../README.md
  - ../00-foundation/food-ventures-master-definition.md
  - ../01-portfolio-strategy/portfolio-architecture.md
supersedes: null
tags:
  - bisnis/food-ventures
  - food-ventures/operations
  - food-ventures/root
---

# Food Ventures Shared Operations — Master Index

> [!abstract] **One Kitchen, One Operational Backbone**  
> Direktori ini merupakan pusat dokumentasi operasional bersama (**Shared Operations**) yang mengelola fasilitas dapur fisik tunggal, pengadaan bahan, penanganan inventori, standar higienitas, dan proses pemenuhan pesanan (*fulfillment*) kurir untuk seluruh brand Food Ventures.

---

## 1. Filosofi Dapur Bersama

Prinsip dasar Shared Operations adalah:

> **"Satu Dapur, Satu Sistem Operasional"**

Memproduksi pesanan untuk beberapa brand virtual di dalam satu fasilitas fisik menuntut tata kelola stasiun kerja yang rapi dan disiplin pemisahan yang ketat. Shared Operations memastikan efisiensi dapur tercapai tanpa mengorbankan mutu atau mencampuradukkan pesanan antar-brand.

---

## 2. Batas Tanggung Jawab Operasional: Brand vs Shared Operations

Untuk menjaga konsistensi tanpa duplikasi dokumen, batas kerja dibagi secara tegas:

| Aktivitas Operasional | Lokasi Dokumentasi & Pemilik | Alasan |
| :--- | :--- | :--- |
| **Resep Pisang Choco LITTLE TREAT** | LITTLE TREAT (`02-brand-portfolio/little-treat/`) | Hak kekayaan dan rasa milik brand |
| **SOP Penggorengan & Penggantian Minyak** | Shared Operations (`03-shared-operations/`) | Standar teknis alat deep fryer bersama |
| **Supplier Pisang Uli & Pisang Kepok** | Shared Operations (`03-shared-operations/`) | Pengadaan terpusat untuk efisiensi harga |
| **Supplier Dimsum Mentah / Bahan Isian** | Shared Operations (`03-shared-operations/`) | Pengadaan terpusat |
| **Desain Stiker & Box LITTLE TREAT** | LITTLE TREAT (`02-brand-portfolio/little-treat/`) | Visual dan unboxing identitas brand |
| **SOP Sanitasi & Kebersihan Dapur** | Shared Operations (`03-shared-operations/`) | Standar higienitas lingkungan bersama |
| **Penanganan Keluhan Rasa Produk** | Brand Terkait (mengacu standar mutu) | Hubungan pelanggan dan evaluasi resep |
| **SOP Penyerahan Pesanan ke Kurir** | Shared Operations (`03-shared-operations/`) | Alur fisik dispatch dan verifikasi nomor order |

Dengan pemisahan ini, perbaikan SOP sanitasi atau pemeliharaan alat penggorengan cukup diubah di satu tempat kanonikal di Shared Operations.

---

## 3. Rencana Dokumentasi Operasional (Package 04 Roadmap)

Pada tahap pengembangan operasional mendalam (**Package 04 — Operational Readiness**), direktori ini akan dilengkapi dengan modul-modul SOP spesifik berikut:

```text
03-shared-operations/
├── README.md                          (FVP-OPS-ROOT-001)
├── 01-kitchen-operating-model/        (FVP-OPS-001: Tata Letak & Kapasitas Dapur)
├── 02-procurement-sourcing/           (FVP-OPS-002: Standar Pembelian Bahan Mentah)
├── 03-supplier-management/            (FVP-OPS-003: Direktori Vendor & Syarat Mutu)
├── 04-inventory-management/           (FVP-OPS-004: Manajemen Penyimpanan & FIFO)
├── 05-food-preparation/               (FVP-OPS-005: SOP Dasar Pengolahan & Suhu)
├── 06-quality-control/                (FVP-OPS-006: Standar QC & Uji Sampel)
├── 07-food-safety-hygiene/            (FVP-OPS-007: Prosedur Sanitasi & HACCP Dapur)
├── 08-packaging-fulfillment/          (FVP-OPS-008: Perakitan Paket & Dispatch Kurir)
└── 09-operating-sop/                  (FVP-OPS-009: Checklist Harian Pembukaan-Penutupan Dapur)
```

> [!NOTE]
> Sesuai prinsip *repository hygiene*, subfolder di atas **belum dibuat** pada Package 01 untuk mencegah folder kosong tanpa konten. Seluruh modul akan dibuat saat penyusunan SOP Package 04 dimulai.

---

## 4. Standar Protokol Dispatch & Kurir

Dalam model *delivery-first multi-brand*, risiko terbesar adalah tertukarnya paket atau salah serah produk ke mitra pengemudi (GoSend, GrabExpress, kurir instan platform).

Protokol dispatch wajib:
1. **Pembeda Visual Label:** Setiap kemasan luar wajib memiliki label tempel besar yang memuat nama brand, nomor pesanan, dan ringkasan isi item.
2. **Pemeriksaan Ganda (*Double Check*):** Petugas dapur memverifikasi 4 digit terakhir nomor pesanan pada ponsel kurir sebelum menyerahkan paket makanan.
3. **Penyegelan Keamanan (*Tamper-evident Seal*):** Setiap kantong atau kotak wajib disegel dengan lakban/stiker pengaman agar tidak dapat dibuka di perjalanan tanpa merusak segel.
