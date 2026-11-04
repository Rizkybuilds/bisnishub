---
canonical_id: food-ventures.root.index
document_id: FVP-ROOT-001
title: "Food Ventures Portfolio — Master Root Index & Blueprint"
date: "2026-11-04"
status: DRAFT
version: "0.1"
owner: Rizky
scope: food-ventures
business: food-ventures
category: root
document_class: registry
effective_from: "2026-11-04"
last_reviewed: "2026-11-04"
review_cadence: quarterly
authoritative_for:
  - food-ventures documentation index
  - portfolio-level navigation
  - business domain boundaries
  - master document registry
depends_on:
  - 00-foundation/food-ventures-master-definition.md
  - 00-foundation/documentation-governance.md
  - 01-portfolio-strategy/portfolio-architecture.md
  - 02-brand-portfolio/README.md
  - 03-shared-operations/README.md
supersedes: null
tags:
  - bisnis/food-ventures
  - food-ventures/canonical
  - food-ventures/root
---

# Food Ventures Portfolio — Master Root Index

> [!IMPORTANT]
> **Domain & Entity Boundary:**  
> **Food Ventures** adalah label domain dokumentasi portofolio bisnis Food & Beverage (F&B) di BisnisHub. Food Ventures **bukan** entitas hukum resmi, holding company berbadan hukum, ataupun brand yang ditampilkan kepada konsumen. Nama ini digunakan murni untuk pengelompokan strategi portofolio dan operasional bersama.

---

## 1. Executive Summary & Purpose

Direktori ini (`bisnis/food-ventures/`) merupakan pusat pengetahuan bisnis resmi (*canonical business knowledge base*) untuk portofolio usaha makanan dan minuman berbasis dapur bersama (*shared kitchen*) dengan model pengiriman utama (*delivery-first*).

Direktori ini mendefinisikan:

```text
APA ITU FOOD VENTURES PORTFOLIO
BAGAIMANA STRATEGI MULTI-BRAND DIJALANKAN
BAGAIMANA DAPUR BERSAMA (SHARED OPERATIONS) BEROPERASI
BAGAIMANA PEMISAHAN IDENTITAS DAN EKONOMI MASING-MASING BRAND
BAGAIMANA STANDAR KUALITAS, KEBERSIHAN, DAN FULFILLMENT DIJAGA
BAGAIMANA TATA KELOLA DOKUMENTASI BISNIS DIPERTINGGIKAN
DAN DALAM URUTAN APA SELURUH BISNIS INI DIKEMBANGKAN
```

Dokumentasi ini hadir untuk memastikan inisiatif F&B tidak menjadi kumpulan ide sporadis, resep tercecer, atau dokumen yang saling bertabrakan tanpa model operasional tunggal yang terintegrasi.

---

## 2. Core Operational Concept

Bisnis ini dirancang dengan prinsip:

1. **Satu Dapur Fisik (*Shared Kitchen*):** Satu fasilitas produksi rumahan yang efisien, mengelola bahan baku, utilitas, alat pemanas/penggoreng, dan area perakitan pesanan.
2. **Satu Sistem Operasi (*Shared Operations*):** Pengadaan bahan baku, manajemen stok, prosedur kebersihan (*hygiene*), dan serah-terima kurir (*fulfillment*) dijalankan secara terpusat untuk menghindari duplikasi biaya.
3. **Multi-Brand Virtual (*Decoupled Brand Identities*):** Setiap brand menargetkan segmen konsumen, selera, waktu konsumsi (*dayparts*), dan positioning yang berbeda secara mandiri.
4. **Delivery-First:** Saluran penjualan diprioritaskan melalui platform kurir online dan pemesanan digital langsung.
5. **Pemisahan Sistem Perangkat Lunak:** Dokumentasi bisnis ini tidak mendefinisikan ulang skema database, mesin status transaksional, ataupun API MGBOS.

---

## 3. Boundary Rules & Ownership

Struktur ini menerapkan batas tanggung jawab yang tegas:

| Domain | Tanggung Jawab | Pemilik Semantik |
| :--- | :--- | :--- |
| **Portfolio Foundation & Strategy** (`00-`, `01-`) | Visi portofolio, arsitektur multi-brand, governance dokumen | Food Ventures Portfolio |
| **Brand Portfolio** (`02-brand-portfolio/`) | Identitas brand, positioning, menu, resep, HPP, packaging visual | Brand Terkait (`little-treat`, dll.) |
| **Shared Operations** (`03-shared-operations/`) | SOP dapur bersama, pengadaan bahan, inventori, kebersihan, fulfillment | Food Ventures Shared Operations |
| **Portfolio Finance** (`04-portfolio-finance/`) | Konsolidasi arus kas, amortisasi biaya dapur, performa lintas brand | Food Ventures Portfolio |
| **Transactional Software (MGBOS)** | Aplikasi web, database PostgreSQL, RPC, state machine | `systems/mgbos/` (Di luar direktori ini) |

> [!NOTE]
> - Resep dan spesifikasi produk adalah milik brand terkait.
> - Prosedur penggorengan, sanitasi dapur, dan serah-terima kurir adalah milik Shared Operations.
> - Unit economics dan penetapan harga menu adalah tanggung jawab masing-masing brand.
> - Konsolidasi finansial dan kelayakan modal dapur adalah tanggung jawab Portfolio Finance.

---

## 4. Master Document Registry — Package 01

Berikut adalah status registrasi dokumen fondasi Food Ventures:

| Document ID | Canonical ID | Judul Dokumen | Status | Path |
| :--- | :--- | :--- | :--- | :--- |
| **FVP-ROOT-001** | `food-ventures.root.index` | Food Ventures Master Root Index | `DRAFT` | [`README.md`](README.md) |
| **FVP-FND-001** | `food-ventures.foundation.definition` | Food Ventures Master Definition | `DRAFT` | [`00-foundation/food-ventures-master-definition.md`](00-foundation/food-ventures-master-definition.md) |
| **FVP-FND-002** | `food-ventures.foundation.glossary` | Food Ventures Portfolio Glossary | `DRAFT` | [`00-foundation/glossary.md`](00-foundation/glossary.md) |
| **FVP-FND-003** | `food-ventures.foundation.documentation-governance` | Food Ventures Documentation Governance | `DRAFT` | [`00-foundation/documentation-governance.md`](00-foundation/documentation-governance.md) |
| **FVP-STR-001** | `food-ventures.portfolio.architecture` | Multi-Brand Portfolio Architecture | `DRAFT` | [`01-portfolio-strategy/portfolio-architecture.md`](01-portfolio-strategy/portfolio-architecture.md) |
| **FVP-BRD-ROOT-001** | `food-ventures.brands.index` | Brand Portfolio Index & Overview | `DRAFT` | [`02-brand-portfolio/README.md`](02-brand-portfolio/README.md) |
| **LT-ROOT-001** | `food-ventures.brand.little-treat.profile` | Little Treat Brand Profile & Master Index | `DRAFT` | [`02-brand-portfolio/little-treat/README.md`](02-brand-portfolio/little-treat/README.md) |
| **AH-ROOT-001** | `food-ventures.brand.after-hours.profile` | After Hours Concept Profile | `DRAFT` | [`02-brand-portfolio/after-hours/README.md`](02-brand-portfolio/after-hours/README.md) |
| **BM-ROOT-001** | `food-ventures.brand.bite-me.profile` | Bite Me Concept Profile | `DRAFT` | [`02-brand-portfolio/bite-me/README.md`](02-brand-portfolio/bite-me/README.md) |
| **FVP-OPS-ROOT-001** | `food-ventures.operations.index` | Shared Operations Master Overview | `DRAFT` | [`03-shared-operations/README.md`](03-shared-operations/README.md) |

---

## 5. Domain Navigation

Akses cepat ke komponen fondasi yang sudah aktif:

- **Fondasi & Tata Kelola:** [`00-foundation/`](00-foundation/food-ventures-master-definition.md)  
  Mendefinisikan prinsip dasar, istilah kanonikal, dan tata kelola penulisan dokumen.
- **Strategi Portofolio:** [`01-portfolio-strategy/`](01-portfolio-strategy/portfolio-architecture.md)  
  Mendefinisikan arsitektur multi-brand, sinergi dapur, dan logika pembagian waktu operasional.
- **Portofolio Brand:** [`02-brand-portfolio/`](02-brand-portfolio/README.md)  
  Mencakup profil brand awal (**LITTLE TREAT**) dan eksplorasi konsep masa depan (**AFTER HOURS**, **BITE ME**).
- **Operasional Bersama:** [`03-shared-operations/`](03-shared-operations/README.md)  
  Pusat standar operasional dapur tunggal, pengadaan, stok, kebersihan, dan fulfillment.

---

## 6. Implementation Phasing Roadmap

Pengembangan dokumentasi dijalankan secara bertahap (*bounded packages*):

1. **Package 01 — Repository Foundation (Saat Ini):**
   Membangun struktur root, dokumentasi fondasi, tata kelola dokumen, profil brand awal, dan integrasi registry repositori.
2. **Package 02 — Portfolio Foundation:**
   Mendefinisikan strategi bisnis mendalam, model pembiayaan bersama, dan roadmap ekspansi.
3. **Package 03 — LITTLE TREAT Foundation:**
   Mendefinisikan resep resmi, spesifikasi produk, kalkulasi HPP/pricing, dan strategi peluncuran brand Little Treat.
4. **Package 04 — Operational Readiness:**
   Mendefinisikan SOP lengkap pengadaan bahan, manajemen stok dapur, standar HACCP/hygiene, dan panduan fulfillment.
