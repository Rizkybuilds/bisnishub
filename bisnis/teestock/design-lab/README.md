---
title: "TeeStock Design Lab — Creative Operating System"
date: "2026-11-04"
bisnis: teestock
kategori: operations
status: active
tags:
  - bisnis/teestock
  - teestock/design-lab
  - teestock/creative-ops
  - teestock/craft
document_id: "TS-DL-ROOT-001"
version: "2.0"
category: "creative-operations"
business: "teestock"
last_updated: "2026-11-04"
path: "bisnis/teestock/design-lab/README.md"
---

# TeeStock Design Lab (TDL)

> [!ABSTRACT] **Creative Operating System, Design Governance & DTF Artwork Engineering Hub**
> - **Lokasi Direktori:** `bisnis/teestock/design-lab/` | **Status:** `ACTIVE` (V2.0)
> - **Parent Business:** TeeStock Apparel (MultiGraph Group)
> - **Framework Mutu:** **CRAFT** (*Creative Reproducibility & Artwork Fidelity Technology*)
> - **Metode Produksi:** Direct-to-Film (DTF) On-Demand & Batch Production Pipeline
> - **Single Source of Truth Registri:** [`05_REGISTRY/`](05_REGISTRY/)

---

## 1. PETA OTORITAS DOKUMENTASI (CANONICAL AUTHORITY MAP)

Untuk mencegah konflik versi antar-dokumen, seluruh tim, runtime AI, dan kontributor wajib mengikuti hierarki otoritas berikut:

```text
00_GLOBAL_STANDARDS/ (TDL-01 s/d TDL-07 & CRAFT)
       +
06_GOVERNANCE/SOP/ (TDL-08 Kanonikal)
       ↓
05_REGISTRY/ (Satu-satunya Registri Aktif: 9 Core Tables + 2 Supplementary)
       ↓
01_COLLECTIONS/ (Master Koleksi, Charters & Artwork Development)
```

### Tabel Standar Otoritatif vs Salinan Pendukung

| Kode | Judul Standar | Lokasi Kanonikal (Authoritative) | Status Salinan Lain |
| :--- | :--- | :--- | :--- |
| **CRAFT** | **CRAFT Methodology** | [`00_GLOBAL_STANDARDS/TEEStock-CRAFT-Methodology.md`](00_GLOBAL_STANDARDS/TEEStock-CRAFT-Methodology.md) | `00_BRAND_SYSTEM/` (MIRROR) |
| **TDL-01** | **Design Lab Charter** | [`00_GLOBAL_STANDARDS/TDL-01_Design-Lab-Charter.md`](00_GLOBAL_STANDARDS/TDL-01_Design-Lab-Charter.md) | `06_GOVERNANCE/SOP/` (MIRROR) |
| **TDL-02** | **Creative Direction System** | [`00_GLOBAL_STANDARDS/TDL-02_Creative-Direction-System.md`](00_GLOBAL_STANDARDS/TDL-02_Creative-Direction-System.md) | `06_GOVERNANCE/SOP/` (MIRROR) |
| **TDL-03** | **Design Production SOP** | [`00_GLOBAL_STANDARDS/TDL-03_Design-Production-SOP.md`](00_GLOBAL_STANDARDS/TDL-03_Design-Production-SOP.md) | `06_GOVERNANCE/SOP/` (MIRROR) |
| **TDL-04** | **Artwork & DTF Specification** | [`00_GLOBAL_STANDARDS/TDL-04_Artwork-and-DTF-Specification.md`](00_GLOBAL_STANDARDS/TDL-04_Artwork-and-DTF-Specification.md) | `06_GOVERNANCE/SOP/` (MIRROR) |
| **TDL-05** | **Design Registry Schema** | [`00_GLOBAL_STANDARDS/TDL-05_Design-Registry-Schema.md`](00_GLOBAL_STANDARDS/TDL-05_Design-Registry-Schema.md) | `05_REGISTRY/` (MIRROR)<br>`00_GLOBAL_STANDARDS/TDL-05/` (ARCHIVE)<br>`05_DESIGN_REGISTRY/` (LEGACY)<br>`06_GOVERNANCE/Design-Registry/` (LEGACY) |
| **TDL-06** | **Brand Portfolio & Incubation** | [`00_GLOBAL_STANDARDS/TDL-06_Brand-Portfolio-and-Incubation-Architecture.md`](00_GLOBAL_STANDARDS/TDL-06_Brand-Portfolio-and-Incubation-Architecture.md) | `06_GOVERNANCE/SOP/` (MIRROR)<br>`01_COLLECTIONS/.../00_MASTER_DOCUMENTS/` (MIRROR) |
| **TDL-07** | **Digital Identity & Social Architecture** | [`00_GLOBAL_STANDARDS/TDL-07_Digital-Identity-and-Social-Handle-Architecture.md`](00_GLOBAL_STANDARDS/TDL-07_Digital-Identity-and-Social-Handle-Architecture.md) | `06_GOVERNANCE/SOP/` (MIRROR)<br>`01_COLLECTIONS/.../00_MASTER_DOCUMENTS/` (MIRROR) |
| **TDL-08** | **Editorial Universe & Content Engine** | [`06_GOVERNANCE/SOP/TDL-08_Editorial-Universe-and-Content-Engine-Architecture.md`](06_GOVERNANCE/SOP/TDL-08_Editorial-Universe-and-Content-Engine-Architecture.md) | `01_COLLECTIONS/.../00_MASTER_DOCUMENTS/` (LEGACY) |

---

## 2. REGISTRI OPERASIONAL AKTIF (05_REGISTRY)

> [!IMPORTANT]
> **Single Source of Truth:** Seluruh pembacaan status desain, lisensi, aset, dan kesiapan produksi wajib merujuk ke [`05_REGISTRY/`](05_REGISTRY/).
> Folder historis `05_DESIGN_REGISTRY/` dan `06_GOVERNANCE/Design-Registry/` berstatus **LEGACY ARCHIVE** dan tidak boleh digunakan sebagai data operasional.

### Sembilan Tabel Inti Relasional (9 Core Tables)
1. [`01_COLLECTIONS.csv`](05_REGISTRY/01_COLLECTIONS.csv) — Master katalog 6 koleksi brand resmi dan target peluncuran.
2. [`02_DESIGNS.csv`](05_REGISTRY/02_DESIGNS.csv) — Master tabel seluruh desain pakaian, status lifecycle, skor kualitas, dan status komersial.
3. [`03_CREATIVE_BRIEFS.csv`](05_REGISTRY/03_CREATIVE_BRIEFS.csv) — Arahan visual, pesan filosofis, pembatasan warna, dan parameter garmen.
4. [`04_ASSETS.csv`](05_REGISTRY/04_ASSETS.csv) — Register fisik file master (`04_EDITABLE_MASTER`), ekspor cetak (`05_EXPORTS`), dan mockup (`06_MOCKUPS`).
5. [`05_REFERENCES_RIGHTS.csv`](05_REGISTRY/05_REFERENCES_RIGHTS.csv) — Verifikasi hak cipta domain publik/OFL, transparansi atribusi, dan referensi visual.
6. [`06_GENERATION_LOG.csv`](05_REGISTRY/06_GENERATION_LOG.csv) — Log reproduksibilitas prompt rekayasa AI dan evaluasi iterasi visual.
7. [`07_APPROVALS.csv`](05_REGISTRY/07_APPROVALS.csv) — Rekam jejak persetujuan formal per gate review studio.
8. [`08_PRODUCTION.csv`](05_REGISTRY/08_PRODUCTION.csv) — Log profil mesin vendor DTF, parameter heat press, dan validasi fisik uji cuci.
9. [`09_LOOKUPS.csv`](05_REGISTRY/09_LOOKUPS.csv) — Kamus nilai resmi terkontrol (*controlled vocabulary*) untuk seluruh tabel.

### Register Pelengkap (Supplementary Registers)
- [`10_DIGITAL_IDENTITIES.csv`](05_REGISTRY/10_DIGITAL_IDENTITIES.csv) — Register namespace handle media sosial dan domain portofolio (Sesuai TDL-07).
- [`11_EXPLORATORY_CONCEPTS.csv`](05_REGISTRY/11_EXPLORATORY_CONCEPTS.csv) — Register backlog ideasi inkubasi eksploratori Layer 2 (Sesuai TDL-06).
- [`master_idea_bank.csv`](05_REGISTRY/master_idea_bank.csv) — Bank ideasi komprehensif 80 konsep lintas koleksi.

---

## 3. PORTOFOLIO KOLEKSI RESMI (01_COLLECTIONS)

Direktori Induk: [`01_COLLECTIONS/TEESTOCK_ORIGINAL/`](01_COLLECTIONS/TEESTOCK_ORIGINAL/) | [Sitemap Koleksi](01_COLLECTIONS/README.md)
- **Portfolio System:** [`TEESTOCK_ORIGINAL/00_PORTFOLIO_SYSTEM/`](01_COLLECTIONS/TEESTOCK_ORIGINAL/00_PORTFOLIO_SYSTEM/)
- **6 Koleksi Inti Resmi (Locked Baseline):**
  1. [`01_HUMAN_CONDITION/`](01_COLLECTIONS/TEESTOCK_ORIGINAL/01_HUMAN_CONDITION/) (`TSO-COL-001` - Priority A / Studio Benchmark) — Lead Research Pilot: [`HC-ED-001 The Hypocrisy Mirror`](01_COLLECTIONS/TEESTOCK_ORIGINAL/01_HUMAN_CONDITION/03_RESEARCH_AND_REFERENCES/HC-ED-001_THE_HYPOCRISY_MIRROR_RESEARCH_DOSSIER.md)
  2. [`02_MODERN_DISORDER/`](01_COLLECTIONS/TEESTOCK_ORIGINAL/02_MODERN_DISORDER/) (`TSO-COL-002` - Priority B / Systems Critique)
  3. [`03_ODDLY_ORDINARY/`](01_COLLECTIONS/TEESTOCK_ORIGINAL/03_ODDLY_ORDINARY/) (`TSO-COL-003` - Priority A / Launch Trinity - Mass Appeal)
  4. [`04_QUIET_REBELLION/`](01_COLLECTIONS/TEESTOCK_ORIGINAL/04_QUIET_REBELLION/) (`TSO-COL-004` - Priority A / Launch Trinity - Statement)
  5. [`05_WILD_ARCHIVE/`](01_COLLECTIONS/TEESTOCK_ORIGINAL/05_WILD_ARCHIVE/) (`TSO-COL-005` - Priority C / Nature & Untamed)
  6. [`06_LOCAL_FREQUENCIES/`](01_COLLECTIONS/TEESTOCK_ORIGINAL/06_LOCAL_FREQUENCIES/) (`TSO-COL-006` - Priority C / Rooted Indonesian Culture)

---

## 4. TEMPLATES & TOOLS (03_TEMPLATES)
Seluruh template kanonikal yang digunakan dalam alur kerja studio:
- [Creative Brief Template](03_TEMPLATES/creative_brief_template.md)
- [Style Bible Template](03_TEMPLATES/style_bible_template.md)
- [Artwork QA Checklist](03_TEMPLATES/artwork_qa_checklist.md)
- [Vendor DTF Profile Template](03_TEMPLATES/vendor_profile_template.md)
- [Commercial Rights Audit Template](03_TEMPLATES/commercial_rights_audit_template.md)
- [Design Evaluator Script](03_TEMPLATES/evaluate_design.py)
