---
canonical_id: food-ventures.foundation.documentation-governance
document_id: FVP-FND-003
title: "Food Ventures Documentation Governance"
date: "2026-11-04"
status: DRAFT
version: "0.1"
owner: Rizky
scope: food-ventures
business: food-ventures
category: foundation
document_class: governance
effective_from: "2026-11-04"
last_reviewed: "2026-11-04"
review_cadence: quarterly
authoritative_for:
  - food-ventures documentation standards
  - document id conventions
  - document lifecycle management
  - change authorization rules
depends_on:
  - ../README.md
  - food-ventures-master-definition.md
supersedes: null
tags:
  - bisnis/food-ventures
  - food-ventures/foundation
  - food-ventures/governance
---

# Food Ventures Documentation Governance

> [!abstract] **Canonical Rules for Food Ventures Documentation**  
> Dokumen ini mengatur tata cara pembuatan, penamaan, siklus hidup (*lifecycle*), dan kewenangan perubahan dokumentasi bisnis Food Ventures Portfolio di dalam repositori BisnisHub. Dokumen ini tunduk pada Konstitusi Dokumentasi repositori ([`docs/governance/documentation-constitution.md`](../../../docs/governance/documentation-constitution.md)).

---

## 1. Prinsip Utama: One Normative Concept, One Canonical Owner

Sesuai hukum dokumentasi BisnisHub:

> **Satu konsep normatif hanya memiliki satu pemilik semantik yang kanonikal.**

Penerapan pada Food Ventures:
- Resep spesifik menu dimiliki oleh folder **Brand Terkait**.
- Prosedur keselamatan dan kebersihan dapur dimiliki oleh **Shared Operations**.
- Konsolidasi performa finansial dimiliki oleh **Portfolio Finance**.
- Tidak boleh ada duplikasi SOP dapur di dalam folder brand, atau duplikasi spesifikasi resep di dalam folder shared operations.

---

## 2. Konvensi Identifikasi Dokumen (ID Scheme)

Setiap dokumen di domain Food Ventures menggunakan struktur identifikasi ganda:

1. **`canonical_id` (Repositori Global):**
   Identifier berbasis dot-notation yang stabil dan unik di seluruh repositori BisnisHub.  
   Konvensi segmentasi:
   - **Tingkat Portofolio / Root (3 segmen):** `food-ventures.<domain>.<name>`  
     Contoh: `food-ventures.root.index`, `food-ventures.foundation.definition`, `food-ventures.portfolio.architecture`, `food-ventures.brands.index`, `food-ventures.operations.index`
   - **Tingkat Brand / Subdomain Khusus (4 segmen):** `food-ventures.<domain>.<brand-or-subdomain>.<name>`  
     Contoh: `food-ventures.brand.little-treat.profile`, `food-ventures.brand.after-hours.profile`, `food-ventures.brand.bite-me.profile`

2. **`document_id` (Domain Bisnis Lokal):**
   Identifier terstruktur untuk kebutuhan registri bisnis internal.  
   Format: `SCOPE-DOMAIN-SEQUENCE`

### Tabel Namespace (SCOPE)

| Prefix | Lingkup Kepemilikan |
| :--- | :--- |
| **`FVP`** | Food Ventures Portfolio (Tingkat Portofolio & Operasional Bersama) |
| **`LT`** | LITTLE TREAT (Brand Awal) |
| **`AH`** | AFTER HOURS (Brand Konsep Masa Depan) |
| **`BM`** | BITE ME (Brand Konsep Masa Depan) |

### Tabel Kode Domain (DOMAIN)

| Kode | Domain Bisnis | Deskripsi |
| :--- | :--- | :--- |
| **`ROOT`** | Root Index | Indeks utama atau navigasi folder |
| **`FND`** | Foundation | Definisi dasar, glossary, governance |
| **`STR`** | Strategy | Strategi bisnis dan positioning |
| **`BRD`** | Branding | Identitas visual, suara brand, kemasan |
| **`PRD`** | Product | Arsitektur menu, resep, spesifikasi produk |
| **`OPS`** | Operations | Operasional dapur, pengadaan, logistik |
| **`FIN`** | Finance | HPP, unit economics, konsolidasi keuangan |
| **`MKT`** | Marketing | Strategi peluncuran, promosi, akuisisi |
| **`CHN`** | Channels | Saluran penjualan (delivery aggregator, direct) |
| **`CX`** | Customer Experience | Standar layanan dan resolusi komplain |
| **`LEG`** | Legal & Compliance | Legalitas usaha, merchant compliance |
| **`MET`** | Metrics | KPI, dashboard performa, eksperimen |
| **`RDM`** | Roadmap | Rencana pentahapan bisnis |

Contoh:  
`LT-PRD-001` = Little Treat Product & Menu Architecture.  
`FVP-OPS-001` = Food Ventures Shared Kitchen Operating Model.

---

## 3. Siklus Hidup Dokumen vs Status Bisnis

Dokumentasi memisahkan secara tegas antara **Status Validitas Dokumen** dan **Status Operasional Bisnis**:

```text
STATUS DOKUMENTASI (Repository Lifecycle)
DRAFT      → Dalam perancangan, belum disahkan sebagai acuan operasional.
REVIEW     → Selesai dirancang, sedang ditinjau sebelum aktivasi.
ACTIVE     → Kanonikal dan sah menjadi standar acuan saat ini.
DEPRECATED → Masih berlaku sementara, tetapi akan segera diganti.
SUPERSEDED → Telah digantikan oleh dokumen kanonikal yang lebih baru.
ARCHIVED   → Disimpan untuk nilai historis/arsip saja.

STATUS BISNIS (Operational Business State)
PRE-LAUNCH → Fase riset dan persiapan sebelum pesanan pertama.
PILOT      → Pengujian operasional dapur dan penjualan terbatas.
LAUNCHED   → Operasional komersial penuh melayani publik.
PAUSED     → Aktivitas komersial dihentikan sementara.
RETIRED    → Brand atau inisiatif bisnis ditutup permanen.
```

Dokumen berstatus `DRAFT` tidak boleh diklaim sebagai keputusan final, dan dokumen berstatus `ACTIVE` tidak otomatis membuktikan bahwa bisnis telah `LAUNCHED`.

---

## 4. Matriks Otoritas Perubahan (Change Governance)

| Jenis Perubahan | Wewenang Keputusan | Keterangan |
| :--- | :--- | :--- |
| **Visi & Strategi Portofolio** | Owner (Rizky) | Perubahan model bisnis, pembukaan brand baru |
| **Positioning & Identitas Brand** | Owner (Rizky) | Target segmen, tone of voice, visual branding |
| **Formulasi Resep & HPP** | Owner Approval | Resep berdampak langsung pada modal dan rasa |
| **Harga Jual Menu** | Owner Approval | Kebijakan margin dan daya saing |
| **SOP Dapur Rutin** | Shared Operations Lead / Owner | Optimasi alur kerja tanpa mengubah standar mutu |
| **Pencatatan Penjualan Harian** | Tim Operasional | Rekod historis harian |
| **Promosi Status Dokumen ke ACTIVE**| Owner Approval | Aktivasi dokumen kanonikal |

AI (seperti Antigravity atau ChatGPT) bertindak sebagai asisten penyusun draft, analisis, dan perumus opsi rekomendasi. AI tidak memiliki kewenangan mengesahkan keputusan bisnis atau mengubah status dokumen menjadi kanonikal tanpa persetujuan Owner.
