---
canonical_id: food-ventures.brands.index
document_id: FVP-BRD-ROOT-001
title: "Food Ventures Brand Portfolio Index"
date: "2026-11-04"
status: DRAFT
version: "0.1"
owner: Rizky
scope: food-ventures
business: food-ventures
category: brand
document_class: registry
effective_from: "2026-11-04"
last_reviewed: "2026-11-04"
review_cadence: quarterly
authoritative_for:
  - brand portfolio registry
  - brand portfolio navigation
  - brand ownership boundaries
depends_on:
  - ../README.md
  - ../00-foundation/food-ventures-master-definition.md
  - ../01-portfolio-strategy/portfolio-architecture.md
  - little-treat/README.md
  - after-hours/README.md
  - bite-me/README.md
supersedes: null
tags:
  - bisnis/food-ventures
  - food-ventures/brand
  - food-ventures/registry
---

# Food Ventures Brand Portfolio Index

> [!abstract] **Registry & Governance of Individual Brands**  
> Direktori ini memuat seluruh dokumentasi brand yang bernaung di bawah Food Ventures Portfolio. Setiap brand memiliki kepribadian, proposisi nilai, formulasi menu, dan unit economics yang mandiri.

---

## 1. Filosofi Otonomi Brand

Meskipun berbagi fasilitas dapur yang sama, di mata konsumen setiap brand adalah entitas kuliner yang independen.

Setiap brand memiliki otoritas semantik penuh atas:

```text
BRAND POSITIONING & AUDIENCE STRATEGY
BRAND VOICE, NARRATIVE & VISUAL IDENTITY
RECIPE BOOK, INGREDIENT BOM & TASTE PROFILES
MENU ARCHITECTURE & SPECIAL OFFERINGS
PRICING, DISCOUNTS & UNIT ECONOMICS
BRAND-SPECIFIC PACKAGING GRAPHICS & UNBOXING
CUSTOMER EXPERIENCE & BRAND COMMUNICATION
```

Shared Operations tidak berhak mengubah formula rasa, takaran saus, atau estetika kemasan suatu brand tanpa persetujuan brand terkait.

---

## 2. Batas Tanggung Jawab: Brand vs Portofolio

| Aspek | Dimiliki oleh Brand | Dimiliki oleh Portofolio / Shared Ops |
| :--- | :--- | :--- |
| **Resep** | Formulasi bahan, takaran gramatur, bumbu rahasia | Panduan teknis suhu penggorengan / sanitasi |
| **Bahan Baku** | Penentuan merek/spesifikasi bahan utama | Pemilihan supplier dan pengadaan harian |
| **Kemasan** | Desain box/pouch, stiker logo, kartu ucapan | Kantong plastik kurir, lakban pengaman pengiriman |
| **Keuangan** | HPP produk, harga jual, margin kontribusi per porsi | Arus kas total dapur, biaya listrik, amortisasi alat |
| **Marketing** | Konten media sosial brand, kampanye promo menu | Kebijakan alokasi anggaran lintas brand |

---

## 3. Registri Brand Portfolio

Berikut daftar brand yang terdaftar dalam portofolio saat ini:

### 1. [LITTLE TREAT](little-treat/README.md) (`LT-ROOT-001`)
- **Status:** `INITIAL_BRAND` (Perencanaan Aktif / Pre-Launch)
- **Fokus:** Kudapan hangat harian (Pisangan, Dimsum) dan aneka Minuman segar.
- **Peran:** Brand pembuktian pertama (*pilot*) kelayakan dapur bersama dan sistem pengiriman.

### 2. [AFTER HOURS](after-hours/README.md) (`AH-ROOT-001`)
- **Status:** `CONCEPT_EXPLORATION` (Tahap Eksplorasi)
- **Fokus:** Makanan comfort urban untuk malam hari (*evening cravings*).
- **Peran:** Mengisi utilisasi dapur di luar jam operasional siang/sore.

### 3. [BITE ME](bite-me/README.md) (`BM-ROOT-001`)
- **Status:** `CONCEPT_EXPLORATION` (Tahap Eksplorasi)
- **Fokus:** Camilan manis/gurih berani (*bold, playful, indulgent*).
- **Peran:** Eksplorasi produk tren dan kudapan impulsif.

---

## 4. Aturan Pembuatan Dokumentasi Brand Baru

1. Folder brand baru hanya dibuat ketika konsep telah disetujui untuk dieksplorasi oleh Owner.
2. Untuk brand tahap konsep (**AFTER HOURS** dan **BITE ME**), dokumentasi dibatasi pada dokumen `README.md` profil konsep.
3. Subfolder lengkap (`01-strategy/`, `03-product-menu/`, dll.) **tidak boleh dibuat kosong** sebelum brand tersebut resmi masuk ke tahap perancangan aktif (seperti LITTLE TREAT di Package 03).
