---
canonical_id: food-ventures.brand.little-treat.menu-architecture
document_id: LT-PRD-001
title: "LITTLE TREAT — Menu Architecture & Lean Launch Portfolio"
date: "2026-11-04"
status: PROPOSED
version: "0.1"
owner: Rizky
scope: food-ventures.little-treat
business: food-ventures
brand: little-treat
category: product
document_class: architecture
effective_from: "2026-11-04"
last_reviewed: "2026-11-04"
review_cadence: quarterly
authoritative_for:
  - little-treat menu architecture
  - little-treat product naming system
  - little-treat lean launch portfolio (7-SKU)
  - little-treat category boundaries
depends_on:
  - ../README.md
  - ../01-strategy/brand-strategy-and-positioning.md
supersedes: null
tags:
  - bisnis/food-ventures
  - brand/little-treat
  - product/menu-architecture
---

# LITTLE TREAT — Menu Architecture & Lean Launch Portfolio

> [!abstract] **Arsitektur Menu & Portofolio Peluncuran Ramping (7-SKU)**  
> Dokumen ini membakukan struktur hierarki penamaan produk (*Hybrid Naming Format*), batas 3 kategori produk awal (*Pisangan, Dimsum, Drinks*), 7 aturan penamaan menu, serta portofolio peluncuran 7-SKU yang dirancang ramping untuk efisiensi dapur solopreneur.

---

## 1. Format Penamaan Hibrida (The Hybrid Naming Format)

Untuk memadukan daya tarik emosional brand modern dengan kejelasan fungsional di aplikasi ojek online, seluruh menu menggunakan format standar:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        HYBRID NAMING FORMULA                           │
│                                                                        │
│        [Signature Name]  —  [Clear Product Descriptor]                 │
│                                                                        │
│  Contoh:                                                               │
│  • Choco Affair — Pisang Krispi Cokelat Belgia Lumer                   │
│  • The Cheesy Affair — Pisang Krispi Keju Cheddar Melimpah             │
│  • Little Steam — Siomay Ayam Udang Kukus Lembut                       │
│  • Daily Grind — Es Kopi Susu Gula Aren Spesial                        │
└────────────────────────────────────────────────────────────────────────┘
```

- **Bagian Depan (*Signature Name*):** Membangun ekuitas brand unik yang dapat dipatenkan dan mudah diingat konsumen.
- **Bagian Belakang (*Product Descriptor*):** Membantu algoritma pencarian aplikasi (SEO delivery app) dan memperjelas ekspektasi rasa pembeli.

---

## 2. Portofolio Peluncuran Ramping (7-SKU Lean Launch Assortment)

Mencegah penumpukan bahan baku dan kerumitan persiapan dapur dengan membatasi peluncuran perdana pada 7 SKU terkurasi:

```mermaid
graph TD
    LT["<b>LITTLE TREAT MENU (7-SKU)</b>"]
    
    subgraph CAT1["KATEGORI 1: PISANGAN (Hero Snack)"]
        SKU1["1. The Classic Crunch (Pisang Goreng Madu Polos)<br/><i>Entry-level accessible: Rp 16k</i>"]
        SKU2["2. Choco Affair (Pisang Krispi Cokelat Lumer)<br/><i>Hero indulgent: Rp 18k</i>"]
        SKU3["3. The Cheesy Affair (Pisang Krispi Keju Gurih)<br/><i>Hero savory-sweet: Rp 18k</i>"]
    end

    subgraph CAT2["KATEGORI 2: DIMSUM (Savory Snack)"]
        SKU4["4. Little Steam (Siomay Ayam Kukus 4 pcs + Chili Oil)<br/><i>Rp 20k</i>"]
        SKU5["5. Steam Squad (Dimsum Mix Platter 6 pcs)<br/><i>Rp 28k</i>"]
    end

    subgraph CAT3["KATEGORI 3: DRINKS (Refreshment Booster)"]
        SKU6["6. Daily Grind (Es Kopi Susu Aren 16 oz)<br/><i>Rp 18k</i>"]
        SKU7["7. Thai Tea / Choco Hug (Es Teh Rempah Manis 16 oz)<br/><i>Rp 16k</i>"]
    end

    subgraph BUNDLES["PAKET COMBO HEMAT (AOV Booster)"]
        B1["Snack & Sip (Choco Affair + Thai Tea) — Rp 32k"]
        B2["Little Duo (Choco Affair + Little Steam) — Rp 35k"]
    end

    LT --> CAT1
    LT --> CAT2
    LT --> CAT3
    CAT1 -.-> BUNDLES
    CAT2 -.-> BUNDLES
    CAT3 -.-> BUNDLES

    style LT fill:#49332D,stroke:#F8EBD4,stroke-width:2px,color:#F8EBD4
    style CAT1 fill:#E9794B,stroke:#9E4938,stroke-width:1.5px,color:#fff
    style CAT2 fill:#9E4938,stroke:#49332D,stroke-width:1.5px,color:#fff
    style CAT3 fill:#F4BD54,stroke:#E9794B,stroke-width:1.5px,color:#49332D
    style BUNDLES fill:#F8EBD4,stroke:#49332D,stroke-width:2px,color:#49332D
```

---

## 3. Tujuh Aturan Penamaan Produk (The 7 Naming Rules)

1. **Format Hibrida Wajib:** Nama signature wajib diikuti deskriptor fungsional.
2. **Singkat & Ringkas:** Nama signature maksimal 3 kata agar tidak terpotong di layar HP.
3. **Mencerminkan Janji Rasa:** Menggunakan kata-kata yang membangkitkan selera (*Crunch, Steam, Affair, Daily*).
4. **Bebas Singkatan Alay:** Dilarang menggunakan singkatan membingungkan (misal: *Pisgor Cokju Lum*).
5. **Standarisasi Ukuran:** Porsi diseragamkan (*Personal Box 5–6 pcs, Sharing Box 10–12 pcs*).
6. **Harmoni Lintas Kategori:** Nama kategori wajib menggunakan istilah pendek yang ramah: **Pisangan**, **Dimsum**, **Drinks**.
7. **Perlindungan Hak Cipta:** Nama signature harus unik dan tidak menjiplak nama dagang kompetitor terdaftar.

---
*Dokumen ini merupakan arsitektur menu kanonikal LITTLE TREAT.*
