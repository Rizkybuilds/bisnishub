# TDL Design Registry & Canonical Authority Reconciliation Report (RP-01)

**Working Context:** TeeStock Design Lab (`bisnis/teestock/design-lab/`)
**Package:** `RP-01 — TDL Canonical Documentation & Registry Reconciliation`
**Execution Date:** 2026-11-04
**Status:** Completed & Reconciled
**Canonical Schema Authority:** [`00_GLOBAL_STANDARDS/TDL-05_Design-Registry-Schema.md`](../00_GLOBAL_STANDARDS/TDL-05_Design-Registry-Schema.md)
**Active Operational Registry:** [`05_REGISTRY/`](./)

---

## 1. REPOSITORY BASELINE & INTEGRITY

- **Source Branch:** `docs/tso-human-condition-editorial-v2`
- **Source Revision SHA:** `8ed8fae5c866fd0a02da727f8c622a71e8bf7e8e`
- **Working Branch:** `fix/tdl-canonical-registry-reconciliation`
- **Working Tree:** `.worktrees/tdl-canonical-registry-reconciliation`
- **Working Commit:** Bounded execution; zero mutations to `main` or uncommitted storefront workspaces.

---

## 2. WORKSTREAM A — CANONICAL DOCUMENTATION CONTROL

### 2.1 Authoritative Hierarchy Established
Setiap dokumen di TeeStock Design Lab kini memiliki satu otoritas kanonikal tanpa tumpang tindih:

| Standar / Sistem | Lokasi Otoritatif Kanonikal | Peran Otoritas |
| :--- | :--- | :--- |
| **CRAFT Methodology** | `00_GLOBAL_STANDARDS/TEEStock-CRAFT-Methodology.md` | Metodologi mutu kreatif & rekayasa visual studio |
| **TDL-01 s/d TDL-04** | `00_GLOBAL_STANDARDS/` | Standar inti charter, creative direction, SOP, dan spesifikasi DTF |
| **TDL-05** | `00_GLOBAL_STANDARDS/TDL-05_Design-Registry-Schema.md` | Skema basis data relasional 9 tab + 2 supplementary registers |
| **TDL-06 & TDL-07** | `00_GLOBAL_STANDARDS/` | Standar portofolio brand & arsitektur namespace digital |
| **TDL-08** | `06_GOVERNANCE/SOP/TDL-08_Editorial-Universe-and-Content-Engine-Architecture.md` | Otoritas editorial universe & content engine (terintegrasi EIS V2) |
| **HC EIS V2** | `00_COLLECTION_CHARTER/HUMAN_CONDITION_EDITORIAL_INTELLIGENCE_SYSTEM_V2.md` | Otoritas kanonikal siklus hidup editorial (G0–G8, 7 layers, dual-scoring) |
| **HC Governance V1** | `00_COLLECTION_CHARTER/HUMAN_CONDITION_EDITORIAL_DECISION_AND_GOVERNANCE_SYSTEM_V1.md` | Standar tata kelola pendukung (6 peran, matriks risiko, 3-level errata) |
| **HC Editorial Arch V1** | `00_COLLECTION_CHARTER/HUMAN_CONDITION_EDITORIAL_ARCHITECTURE_V1.md` | Otoritas identitas & 4 pilar program; 5 gerbang evaluasi adalah kriteria konten di bawah G0–G8 |
| **HC Research Protocol V1**| `03_RESEARCH_AND_REFERENCES/HUMAN_CONDITION_RESEARCH_AND_EVIDENCE_PROTOCOL_V1.md` | Standar kanonikal Layer 03 (Research & Evidence) |
| **HC Contradiction Protocol**| `03_RESEARCH_AND_REFERENCES/HUMAN_CONDITION_CRITICAL_ANALYSIS_AND_CONTRADICTION_PROTOCOL_V1.md` | Standar kanonikal Layer 04 (Critical Analysis & Contradiction) |

### 2.2 Duplikasi & Klasifikasi Dokumen Non-Kanonikal
Seluruh 18 dokumen non-kanonikal telah diberi banner eksplisit:
- **`MIRROR — DO NOT EDIT`**:
  - `00_BRAND_SYSTEM/TEEStock-CRAFT-Methodology.md`
  - `06_GOVERNANCE/SOP/TDL-01_Design-Lab-Charter.md`
  - `06_GOVERNANCE/SOP/TDL-02_Creative-Direction-System.md`
  - `06_GOVERNANCE/SOP/TDL-03_Design-Production-SOP.md`
  - `06_GOVERNANCE/SOP/TDL-04_Artwork-and-DTF-Specification.md`
  - `06_GOVERNANCE/SOP/TDL-06_Brand-Portfolio-and-Incubation-Architecture.md`
  - `06_GOVERNANCE/SOP/TDL-07_Digital-Identity-and-Social-Handle-Architecture.md`
  - `01_COLLECTIONS/TEESTOCK_ORIGINAL/00_PORTFOLIO_SYSTEM/00_MASTER_DOCUMENTS/TDL-06_Brand-Portfolio-and-Incubation-Architecture.md`
  - `01_COLLECTIONS/TEESTOCK_ORIGINAL/00_PORTFOLIO_SYSTEM/00_MASTER_DOCUMENTS/TDL-07_Digital-Identity-and-Social-Handle-Architecture.md`
  - `05_REGISTRY/TDL-05_Design-Registry-Schema.md`
  - Template mirrors di `00_BRAND_SYSTEM/`, `01_CREATIVE_INTELLIGENCE/`, `04_LICENSES_AND_RIGHTS/`, `06_GOVERNANCE/`.
- **`LEGACY — DO NOT USE AS AUTHORITY`**:
  - `01_COLLECTIONS/TEESTOCK_ORIGINAL/00_PORTFOLIO_SYSTEM/00_MASTER_DOCUMENTS/TDL-08_Editorial-Universe-and-Content-Engine-Architecture.md`
  - `05_DESIGN_REGISTRY/TDL-05_Design-Registry-Schema.md`
  - `06_GOVERNANCE/Design-Registry/TDL-05_Design-Registry-Schema.md`
  - `05_DESIGN_REGISTRY/README.md` & `06_GOVERNANCE/Design-Registry/README.md` (arsip historis).
- **`ARCHIVED REFERENCE — DO NOT EDIT`**:
  - `00_GLOBAL_STANDARDS/TDL-05/TDL-05_Design-Registry-Schema.md`.

---

## 3. WORKSTREAM B — DESIGN REGISTRY RECONCILIATION

### 3.1 Records Checked & Table Integrity
Semua 12 file CSV di `05_REGISTRY/` telah divalidasi integritas strukturalnya (escaping CSV valid, jumlah kolom konsisten per baris):
1. `01_COLLECTIONS.csv` (6 baris, 12 kolom) — **PASS**
2. `02_DESIGNS.csv` (15 baris, 19 kolom) — **PASS**
3. `03_CREATIVE_BRIEFS.csv` (1 baris, 21 kolom) — **PASS**
4. `04_ASSETS.csv` (3 baris, 15 kolom) — **PASS**
5. `05_REFERENCES_RIGHTS.csv` (4 baris, 16 kolom) — **PASS**
6. `06_GENERATION_LOG.csv` (1 baris, 17 kolom) — **PASS**
7. `07_APPROVALS.csv` (1 baris, 12 kolom) — **PASS**
8. `08_PRODUCTION.csv` (1 baris, 24 kolom) — **PASS**
9. `09_LOOKUPS.csv` (67 baris, 3 kolom) — **PASS**
10. `10_DIGITAL_IDENTITIES.csv` (6 baris, 13 kolom) — **PASS**
11. `11_EXPLORATORY_CONCEPTS.csv` (8 baris, 9 kolom) — **PASS**
12. `master_idea_bank.csv` (80 baris, 21 kolom) — **PASS**

### 3.2 Controlled Values Normalized & Lookups Enriched
Kamus nilai resmi di `09_LOOKUPS.csv` diperkaya untuk menutup kekosongan status operasional riil tanpa mengubah hakikat persetujuan:
- **`PRODUCTION_STATUS` (Kategori Baru):** Menambahkan `NOT_TESTED`, `TESTING`, `PASSED`, `FAILED`, `CONDITIONAL`.
- **`COLLECTION_STATUS`:** Menambahkan `LOCKED_BENCHMARK`, `LOCKED_BASELINE`.
- **`COLLECTION_TYPE`:** Menambahkan pemetaan sub-tipe (`ORIGINAL_FLAGSHIP`, `ORIGINAL_THEMATIC`, `ORIGINAL_CORE`, `ORIGINAL_HERITAGE`, `ORIGINAL_REGIONAL`).
- **`DESIGN_STATUS`:** Menambahkan `PILOT_RESEARCH_SYNC`, `CONCEPT`, `ARTWORK_IN_DEVELOPMENT`. Desain `HC-001` dinormalkan ke kode kanonikal `IN_DEVELOPMENT`.
- **`RIGHTS_STATUS`:** Menambahkan `IN_REVIEW`.
- **`APPROVAL_STAGE` & `APPROVAL_DECISION`:** Ditambahkan sesuai spesifikasi TDL-05.

### 3.3 Identifier Relationships Normalized
- **`02_DESIGNS.csv` (HC-001):** Kolom `creative_brief_id` dinormalkan dari `HC-001-CB-01` menjadi `TSC-HC-001-CB-01` (mengacu pada primary key aktual di `03_CREATIVE_BRIEFS.csv`).
- **`03_CREATIVE_BRIEFS.csv` (TSC-HC-001-CB-01):** Kolom `design_id` dinormalkan dari legacy `TSD-HC-001` menjadi `HC-001`.
- **`05_REFERENCES_RIGHTS.csv` (REF-HC-001-01 s/d 04):** Kolom `related_design_id` dinormalkan dari legacy `TSD-HC-001` menjadi `HC-001`.

### 3.4 Paths Corrected & Unverified Paths Handled
- **`02_DESIGNS.csv` (HC-001):** Kolom `primary_source_asset_id` sebelumnya memuat string `02_EXPLORATIONS/HC-001_comp_02_disturbed_print.png` yang terbukti **tidak ada pada repositori fisik** dan melanggar tipe data foreign key (bukan format `asset_id`). Nilai ini dikosongkan (`""`) selaras dengan 14 baris desain lainnya sambil menunggu registrasi formal file master fisik di `04_ASSETS.csv`.

---

## 4. UNRESOLVED ITEMS & OUTSTANDING CONFLICTS

### 4.1 Preservasi Catatan Historis Legacy (`TSD-001-001`)
Catatan pada tabel berikut sengaja dipertahankan dan **tidak di-overwrite**:
- `04_ASSETS.csv`: `TSA-001-001-001` (`TS_HC_001_SOURCE_V1.0_APPROVED.psd`) dan `TSA-001-001-002` (`TS_HC_001_PRINT_28CM_V1.0_APPROVED.png`).
- `06_GENERATION_LOG.csv`: `GEN-001-001-01` (merujuk `CB-001-001`, prompt tengkorak & roda gigi).
- `07_APPROVALS.csv`: `APP-001-001-01` (merujuk `TSD-001-001`).
- `08_PRODUCTION.csv`: `PROD-001-001-01` (merujuk `TSD-001-001`).

*Alasan:* Entitas `TSD-001-001` adalah konsep eksplorasi awal studio ("Stupidity: The Sleep of Reason" - ilustrasi tengkorak & jam), berbeda dengan konsep kanonikal saat ini `HC-001` ("The Dangerous Species" - etsa taksonomi klasik abad ke-18). Memaksa me-rename `TSD-001-001` menjadi `HC-001` akan memalsukan rekam jejak historis. Catatan ini dibiarkan sebagai arsip historis.

### 4.2 Diskrepansi Status HC-001 (Production Readiness & Rights)
Terdapat kontradiksi antara dokumen naratif dan registri operasional:
1. Laporan QA (`HC-001_qa_report.md`) dan Lembar Approval (`HC-001_approval_record.md`) mencantumkan klausul "PRODUCTION READY".
2. Registri operasional `02_DESIGNS.csv` mencatat: `design_status = IN_DEVELOPMENT`, `rights_status = IN_REVIEW`, `production_status = NOT_TESTED`, `commercial_status = NOT_READY`.
3. Registri produksi `08_PRODUCTION.csv` mencatat: `sample_result = NOT_TESTED`, `durability_test_status = NOT_TESTED`.

*Keputusan Rekonsiliasi RP-01:*
Sesuai Invariant 5 & 6, **status HC-001 TIDAK dinaikkan ke production-ready**. Kesiapan produksi DTF dan lisensi komersial tetap ditahan secara konservatif (`IN_DEVELOPMENT`, `NOT_TESTED`, `NOT_READY`) sampai uji sampel fisik nyata pada kaos dan uji ketahanan cuci diselesaikan serta didokumentasikan dengan bukti empiris.

### 4.3 Temuan Diskrepansi Kalkulasi Piksel-ke-Milimeter pada Laporan QA
Pada `HC-001_qa_report.md` Seksi 1, tabel teknis mencantumkan:
> *"Garis tertipis 2 px (0.51 mm pada 300 PPI)"*

*Temuan Audit Teknis:*
Pada resolusi 300 PPI (Pixels Per Inch):
- $1\text{ inch} = 25.4\text{ mm}$
- $1\text{ piksel} = \frac{25.4}{300}\text{ mm} \approx 0.0847\text{ mm}$
- Maka garis $2\text{ px} = 2 \times 0.0847\text{ mm} = 0.169\text{ mm}$ (BUKAN $0.51\text{ mm}$).
- Ketebalan $0.51\text{ mm}$ sesungguhnya membutuhkan minimal $6\text{ px}$.

Temuan ini dicatat sebagai item tindak lanjut untuk tim rekayasa artwork agar file ekspor diverifikasi apakah garis tertipisnya benar-benar memenuhi ambang batas perekat lem DTF ($\ge 0.50\text{ mm} \approx 6\text{ px}$).

---

## 5. SCOPE COMPLIANCE CONFIRMATION

- [x] **Zero Deletion:** Tidak ada file historis atau baris data registri yang dihapus.
- [x] **Zero Unjustified Status Elevation:** Tidak ada status approval, produksi, atau komersial yang dinaikkan tanpa bukti riil.
- [x] **Zero Production/Main Mutation:** Tidak ada perubahan pada branch `main` atau direktori di luar `bisnis/teestock/design-lab/`.
- [x] **Strict Isolation:** Pengerjaan dilakukan 100% pada worktree terisolasi `.worktrees/tdl-canonical-registry-reconciliation`.
- [x] **Zero Unrelated Changes:** Perubahan murni menyangkut kontrol kanonikal dokumentasi dan data-integrity registri TDL.
