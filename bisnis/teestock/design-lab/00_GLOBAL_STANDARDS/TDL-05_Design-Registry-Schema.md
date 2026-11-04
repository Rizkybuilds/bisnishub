# TDL-05 — TEEStock DESIGN REGISTRY SCHEMA
## Standar Kanonikal Basis Data & Manajemen Siklus Hidup Desain (9-Tab Relational Foundation)

> [!IMPORTANT]
> **CANONICAL GLOBAL STANDARD — TDL-05**
> - **Otoritas:** Dokumen ini adalah satu-satunya otoritas kanonikal skema Design Registry TeeStock Design Lab.
> - **Lokasi Kanonikal:** `bisnis/teestock/design-lab/00_GLOBAL_STANDARDS/TDL-05_Design-Registry-Schema.md`
> - **Lokasi Aktif Registri Operasional:** `bisnis/teestock/design-lab/05_REGISTRY/`
> - **Fondasi Arsitektur:** Basis data relasional 9 tabel inti (*9 Core Tables*) ditambah 2 register pelengkap (*Supplementary Registers*).
> - **Status Dokumen Lain:** Seluruh salinan di `05_REGISTRY/`, `05_DESIGN_REGISTRY/`, `06_GOVERNANCE/Design-Registry/`, dan subdirektori `TDL-05/` berstatus MIRROR atau LEGACY.

**Version:** 2.0 (Consolidated Relational Standard)
**Status:** Canonical Working Standard — Locked
**Parent Documents:** TDL-01, TDL-02, TDL-03, TDL-04, TDL-06, TDL-07, TDL-08
**Framework:** CRAFT — Creative Reproducibility & Artwork Fidelity Technology
**Effective Date:** 2026-11-04

---

# 1. PURPOSE

Dokumen ini menetapkan skema data, struktur pencatatan relasional, konvensi identifier, dan aturan tata kelola untuk **TeeStock Design Registry** sebagai *single source of truth* seluruh aset intelektual, status pengerjaan, lisensi komersial, dan kesiapan produksi di TeeStock Design Lab (TDL).

Tujuan utama Design Registry:
1. **Total Traceability:** Setiap desain dapat ditelusuri secara deterministik dari tesis konsep, creative brief, referensi, lisensi hak cipta, prompt rekayasa AI, versi file master (`04_EDITABLE_MASTER`), ekspor cetak (`05_EXPORTS`), parameter transfer DTF, hingga hasil uji cuci fisik kaos.
2. **Commercial & IP Integrity:** Mencegah karya dengan status hak cipta belum tuntas (`PENDING`, `IN_REVIEW`, `UNKNOWN`, `RESTRICTED`) atau berasal dari tool/tier non-komersial masuk ke katalog penjualan aktif.
3. **Production Governance:** Memastikan file yang dikirim ke vendor RIP DTF adalah versi yang telah disetujui secara formal (`APPROVED`), bukan draf eksplorasi atau mock-up display.
4. **Reproducibility:** Seluruh parameter teknis dan file master tersimpan terstruktur sehingga produksi ulang (re-order/batch baru) menghasilkan kualitas cetak yang identik tanpa deviasi.

---

# 2. ARCHITECTURE PRINCIPLE & TABLE HIERARCHY

TDL memisahkan penyimpanan fisik berkas (*Asset Storage*) dan penyimpanan metadata relasional (*Metadata Registry*).

### 2.1 Lokasi Registri Aktif
Satu-satunya direktori registri operasional yang aktif dan berwenang adalah:
```text
bisnis/teestock/design-lab/05_REGISTRY/
```
Direktori lain seperti `05_DESIGN_REGISTRY/` dan `06_GOVERNANCE/Design-Registry/` adalah arsip historis (*LEGACY — DO NOT USE AS AUTHORITY*).

### 2.2 Sembilan Tabel Inti (9 Core Tables)
Struktur relasional inti terdiri dari 9 tabel CSV yang saling terhubung:

| Tab / Tabel | File CSV | Otoritas / Fungsi | Primary Key | Foreign Keys Utama |
| :---: | :--- | :--- | :--- | :--- |
| **Tab 01** | `01_COLLECTIONS.csv` | Katalog koleksi induk & positioning | `collection_id` | - |
| **Tab 02** | `02_DESIGNS.csv` | Master tabel desain & lifecycle status | `design_id` | `collection_id`, `creative_brief_id` |
| **Tab 03** | `03_CREATIVE_BRIEFS.csv` | Spesifikasi brief kreatif desain | `creative_brief_id` | `design_id` |
| **Tab 04** | `04_ASSETS.csv` | Log fisik file aset (master, export, mockup) | `asset_id` | `design_id` |
| **Tab 05** | `05_REFERENCES_RIGHTS.csv` | Kliring hak cipta, atribusi & referensi | `reference_id` | `related_design_id` |
| **Tab 06** | `06_GENERATION_LOG.csv` | Rekam jejak prompt AI & iterasi visual | `generation_id` | `design_id`, `creative_brief_id` |
| **Tab 07** | `07_APPROVALS.csv` | Log persetujuan formal per gate/tahap | `approval_id` | `design_id` |
| **Tab 08** | `08_PRODUCTION.csv` | Validasi teknis vendor, transfer DTF & uji sampel | `production_id` | `design_id`, `asset_id` |
| **Tab 09** | `09_LOOKUPS.csv` | Kamus nilai terkontrol (*controlled vocabulary*) | `category` + `code` | Digunakan oleh seluruh tab |

### 2.3 Register Pelengkap (Supplementary Registers)
Register pelengkap berikut beroperasi berdampingan dengan tabel inti namun **bukan** bagian dari 9 tab skema TDL-05:
- `10_DIGITAL_IDENTITIES.csv`: Register namespace brand digital, handle media sosial, dan domain portofolio (mengacu pada TDL-07).
- `11_EXPLORATORY_CONCEPTS.csv`: Register backlog konsep inkubasi Layer 2 (mengacu pada TDL-06).

---

# 3. IDENTIFICATION CONVENTIONS & PRIMARY KEYS

### 3.1 Entitas & Identifier yang Berbeda
Identifier berikut mewakili entitas yang berbeda dan **dilarang dicampuradukkan**:
- **Collection ID:** Format `TSO-COL-###` (Contoh: `TSO-COL-001` untuk HUMAN CONDITION).
- **Apparel Design ID:** Format `[COLL_PREFIX]-###` (Contoh: `HC-001` untuk The Dangerous Species).
- **Editorial Project ID:** Format `[COLL_PREFIX]-ED-###` (Contoh: `HC-ED-001` untuk The Hypocrisy Mirror). Proyek editorial media beroperasi terpisah dari SKU fisik pakaian.
- **Creative Brief ID:** Format `TSC-[COLL_PREFIX]-###-CB-##` (Contoh: `TSC-HC-001-CB-01`).
- **Asset ID:** Format `TSA-###-###-###` atau `TSA-[COLL]-[TYPE]-###`.

---

# 4. TABEL INTI — DETAIL SKEMA FIELD & RELASI

## 4.1 Tab 01 — COLLECTIONS (`01_COLLECTIONS.csv`)
Satu baris untuk setiap koleksi brand.
- `collection_id` *(String, PK)*: Identifier unik koleksi (e.g. `TSO-COL-001`).
- `collection_name` *(String)*: Nama resmi koleksi (e.g. `HUMAN CONDITION`).
- `collection_type` *(Enum)*: Sub-tipe portofolio (`ORIGINAL_FLAGSHIP`, `ORIGINAL_THEMATIC`, `ORIGINAL_CORE`, `ORIGINAL_HERITAGE`, `ORIGINAL_REGIONAL`).
- `core_theme` *(Text)*: Tema sentral narasi koleksi.
- `collection_description` *(Text)*: Deskripsi ringkas positioning.
- `visual_style_bible_asset_id` *(String, FK)*: Aset ID Style Bible terkait.
- `visual_identity_version` *(String)*: Versi identitas visual (e.g. `2.0`).
- `target_audience` *(Text)*: Profil segmen audiens target.
- `collection_status` *(Enum)*: Status koleksi (`LOCKED_BENCHMARK`, `LOCKED_BASELINE`, `DEVELOPMENT`, `ACTIVE`, `PAUSED`, `ARCHIVED`).
- `launch_target` *(String)*: Target gelombang rilis (e.g. `Wave 1 (Launch Trinity)`).
- `created_at` *(Date)*: Tanggal pembuatan (YYYY-MM-DD).
- `updated_at` *(Date)*: Tanggal pembaruan terakhir.

## 4.2 Tab 02 — DESIGNS (`02_DESIGNS.csv`)
Master record seluruh desain pakaian TeeStock.
- `design_id` *(String, PK)*: Identifier unik desain pakaian (e.g. `HC-001`).
- `collection_id` *(String, FK)*: Mengacu pada `01_COLLECTIONS.csv`.
- `design_title` *(String)*: Judul resmi desain.
- `design_type` *(Enum)*: `Illustration`, `Typography`, `Mixed`.
- `core_message` *(Text)*: Pesan inti/tagline filosofis.
- `concept_summary` *(Text)*: Ringkasan konsep visual.
- `target_audience` *(Text)*: Profil pemakai desain.
- `creative_brief_id` *(String, FK)*: Mengacu pada primary key di `03_CREATIVE_BRIEFS.csv` (e.g. `TSC-HC-001-CB-01`).
- `visual_style_version` *(String)*: Versi style bible rujukan.
- `current_version` *(String)*: Versi desain saat ini (e.g. `HC-001-V01`).
- `design_status` *(Enum)*: Nilai terkontrol dari `09_LOOKUPS.csv` (`DRAFT`, `EXPLORATION`, `IN_DEVELOPMENT`, `PILOT_RESEARCH_SYNC`, `CONCEPT`, `CREATIVE_REVIEW`, `CREATIVE_APPROVED`, `ARTWORK_QA`, `PRODUCTION_VALIDATION`, `APPROVED`, `REJECTED`, `ARCHIVED`).
- `quality_score` *(Float)*: Skor kualitas desain terkini (0.00 - 5.00 atau 0 - 100).
- `rights_status` *(Enum)*: Status legalitas hak cipta (`UNKNOWN`, `PENDING`, `IN_REVIEW`, `VERIFIED`, `RESTRICTED`, `PROHIBITED`).
- `production_status` *(Enum)*: Nilai terkontrol dari `09_LOOKUPS.csv` (`NOT_TESTED`, `TESTING`, `PASSED`, `FAILED`, `CONDITIONAL`).
- `commercial_status` *(Enum)*: Kesiapan komersial (`NOT_REVIEWED`, `NOT_READY`, `READY_FOR_LISTING`, `ACTIVE`, `SUSPENDED`, `RETIRED`).
- `primary_source_asset_id` *(String, FK)*: Aset ID file master yang disetujui (mengacu ke `04_ASSETS.csv`). Kosongkan jika belum diregistrasikan.
- `primary_export_asset_id` *(String, FK)*: Aset ID file export siap cetak (mengacu ke `04_ASSETS.csv`).
- `created_at` *(Date)*: Tanggal pembuatan record.
- `updated_at` *(Date)*: Tanggal pembaruan record.

## 4.3 Tab 03 — CREATIVE BRIEFS (`03_CREATIVE_BRIEFS.csv`)
Spesifikasi arahan kreatif desain.
- `creative_brief_id` *(String, PK)*: e.g. `TSC-HC-001-CB-01`.
- `design_id` *(String, FK)*: Mengacu pada `02_DESIGNS.csv` (e.g. `HC-001`).
- `brief_version` *(String)*: Versi brief (e.g. `V1.0`).
- `concept_direction`, `core_message`, `visual_metaphor`, `main_subject`, `composition_direction`, `typography_direction`, `color_direction`, `illustration_direction`, `texture_direction`: Arahan artistik terperinci.
- `must_include`, `must_preserve`, `must_avoid`: Batasan kreatif eksplisit.
- `intended_garment_color`, `intended_print_placement`: Konteks garmen fisik.
- `approval_status` *(Enum)*: `DRAFT`, `IN_REVIEW`, `APPROVED`, `REVISION_REQUIRED`.
- `brief_asset_id` *(String, FK)*: Aset ID dokumen brief Markdown jika tersedia.
- `created_at`, `approved_at` *(Date)*.

## 4.4 Tab 04 — ASSETS (`04_ASSETS.csv`)
Register file fisik dan artefak digital.
- `asset_id` *(String, PK)*: Identifier aset (e.g. `TSA-001-001-001`).
- `design_id` *(String, FK)*: ID desain terkait (boleh kosong untuk aset tingkat koleksi).
- `asset_type` *(Enum)*: `STYLE_BIBLE`, `SOURCE_MASTER`, `PRODUCTION_EXPORT`, `MOCKUP`, `PREVIEW`, `REFERENCE`.
- `asset_name` *(String)*: Nama file fisik (e.g. `HC-001_THE-DANGEROUS-SPECIES_PRINT_V01.png`).
- `version` *(String)*: Versi aset.
- `file_format` *(Enum)*: `PNG`, `PSD`, `JPG`, `SVG`, `MD`, `PDF`.
- `physical_dimensions` *(String)*: Ukuran cetak fisik target (e.g. `28.0 x 39.0 cm`).
- `pixel_dimensions` *(String)*: Resolusi piksel (e.g. `3300 x 4600 px`).
- `resolution_ppi` *(Integer)*: Resolusi efektif (standar studio: `300`).
- `color_space` *(Enum)*: `RGB`, `sRGB`, `RGBA`.
- `transparency` *(Enum)*: `Yes`, `No`.
- `asset_status` *(Enum)*: `DRAFT`, `IN_REVIEW`, `APPROVED`, `SUPERSEDED`, `ARCHIVED`.
- `storage_uri` *(Path)*: Path relatif repositori terhadap `bisnis/teestock/design-lab/`. Harus diverifikasi keberadaan filenya sebelum dicatat.
- `checksum` *(String)*: Hash verifikasi integritas file.
- `created_at` *(Date)*.

## 4.5 Tab 05 — REFERENCES & RIGHTS (`05_REFERENCES_RIGHTS.csv`)
Log transparansi asal-usul visual, lisensi komersial, dan kepatuhan IP.
- `reference_id` *(String, PK)*: e.g. `REF-HC-001-01`.
- `related_design_id` *(String, FK)*: Mengacu pada `02_DESIGNS.csv` (e.g. `HC-001`).
- `source_name` *(String)*: Nama sumber/arsip (e.g. `Buffon Histoire Naturelle Plates`).
- `source_url` *(String)*: URL atau rujukan repositori publik.
- `creator_or_owner` *(String)*: Nama pencipta asli / pemilik hak cipta.
- `asset_description` *(Text)*: Deskripsi visual elemen rujukan.
- `reference_role` *(Enum)*: Nilai terkontrol dari `09_LOOKUPS.csv` (`STYLE`, `COMPOSITION`, `TYPOGRAPHY`, `ILLUSTRATION`, `COLOR`, `PRODUCTION`).
- `license_type` *(String)*: Tipe lisensi (e.g. `Public Domain`, `SIL OFL 1.1`, `Commercial License`, `Fair Use Inspiration`).
- `commercial_use_allowed`, `modification_allowed`, `attribution_required`: Boolean `Yes`/`No`.
- `redistribution_restrictions` *(Text)*: Batasan khusus jika ada.
- `license_evidence_uri` *(Path)*: Path berkas bukti lisensi jika ada.
- `verification_date` *(Date)*.
- `verification_status` *(Enum)*: `VERIFIED`, `PENDING`, `FLAGGED`, `REJECTED`.
- `reviewer_notes` *(Text)*: Catatan legalitas dan batasan penggunaan.

## 4.6 Tab 06 — GENERATION LOG (`06_GENERATION_LOG.csv`)
Mencatat proses rekayasa bantuan AI untuk reproduksibilitas.
- `generation_id` *(String, PK)*: e.g. `GEN-001-001-01`.
- `design_id` *(String, FK)*: Mengacu ke `02_DESIGNS.csv`.
- `creative_brief_id` *(String, FK)*: Mengacu ke `03_CREATIVE_BRIEFS.csv`.
- `generation_date` *(Date)*.
- `tool_name` *(String)*: e.g. `Ideogram`, `Midjourney`, `ChatGPT DALL-E`.
- `tool_version`, `model_name`: Versi dan engine model.
- `prompt_version`, `prompt_asset_id`: Versi prompt dan referensi file prompt Markdown.
- `reference_ids` *(String)*: Daftar reference ID yang dipakai sebagai input visual.
- `generation_objective` *(Enum)*: `CONCEPT_EXPLORATION`, `STYLE_EXPLORATION`, `COMPOSITION_EXPLORATION`, `ILLUSTRATION`, `REFINEMENT`, `INPAINTING`, `UPSCALING`, `FINALIZATION`.
- `iteration_number` *(Integer)*.
- `parent_asset_id`, `output_asset_id` *(String, FK)*.
- `evaluation_result` *(Enum)*: `SELECTED`, `REJECTED`, `EXPLORATORY`.
- `selected_for_development` *(Enum)*: `Yes`, `No`.
- `notes` *(Text)*.

## 4.7 Tab 07 — APPROVALS (`07_APPROVALS.csv`)
Audit trail keputusan persetujuan pada gerbang formal.
- `approval_id` *(String, PK)*: e.g. `APP-001-001-01`.
- `design_id` *(String, FK)*: Mengacu ke `02_DESIGNS.csv`.
- `version` *(String)*: Versi desain yang diaudit (e.g. `V1.0`).
- `approval_stage` *(Enum)*: Nilai terkontrol dari `09_LOOKUPS.csv` (`CONCEPT`, `CREATIVE_DIRECTION`, `CREATIVE_APPROVAL`, `ARTWORK_QA`, `PRODUCTION_VALIDATION`, `FINAL_APPROVAL`, `RIGHTS_CLEARANCE`).
- `reviewer` *(String)*: Peran kognitif yang bertanggung jawab (e.g. `Creative Director`, `Lead QA Engineer`).
- `decision` *(Enum)*: `APPROVED`, `REVISION_REQUIRED`, `REJECTED`, `PENDING`.
- `score` *(Float)*: Skor evaluasi tahap terkait.
- `review_date` *(Date)*.
- `issue_summary`, `revision_required`: Deskripsi temuan dan revisi.
- `related_evidence_asset_id` *(String, FK)*: Aset ID dokumen bukti evaluasi (e.g. QA report).
- `notes` *(Text)*.

## 4.8 Tab 08 — PRODUCTION (`08_PRODUCTION.csv`)
Parameter fisik sablon DTF, profil vendor, dan rekam uji cuci.
- `production_id` *(String, PK)*: e.g. `PROD-001-001-01`.
- `design_id` *(String, FK)*: Mengacu ke `02_DESIGNS.csv`.
- `asset_id` *(String, FK)*: File ekspor yang dikirim ke vendor (`04_ASSETS.csv`).
- `vendor_id` *(String)*: Identifier vendor DTF (e.g. `VND-001`).
- `vendor_profile_version` *(String)*: Versi profil mesin vendor.
- `garment_sku`, `garment_color`, `garment_size`: Spesifikasi kain kaos uji.
- `print_width_cm`, `print_height_cm`, `print_placement`: Dimensi fisik dan penempatan.
- `transfer_batch`: Nomor batch cetak transfer film.
- `press_machine`, `press_temperature`, `press_duration`, `pressure_setting`, `peel_method`, `final_press_instruction`: Parameter mekanis mesin heat press.
- `sample_date` *(Date)*: Tanggal penerimaan sampel fisik.
- `sample_result` *(Enum)*: `NOT_TESTED`, `PASS_APPROVED`, `REVISION_NEEDED`, `FAILED`.
- `durability_test_status` *(Enum)*: Status uji ketahanan cuci (`NOT_TESTED`, `TESTING`, `PASSED`, `FAILED`).
- `defect_notes` *(Text)*: Catatan cacat cetak/lem jika ada.
- `sample_evidence_asset_id` *(String, FK)*: Foto bukti sampel fisik.
- `production_validation_status` *(Enum)*: Nilai terkontrol dari `09_LOOKUPS.csv` (`NOT_TESTED`, `TESTING`, `PASSED`, `FAILED`, `CONDITIONAL`).

## 4.9 Tab 09 — LOOKUPS (`09_LOOKUPS.csv`)
Kamus resmi nilai terkontrol (*controlled vocabulary*) untuk seluruh kategori.
Struktur: `category`, `code`, `description`.

---

# 5. ATURAN INTEGRITAS TATA KELOLA DATA

1. **No Elevating Status Without Physical Evidence:**
   Status `production_status` di `02_DESIGNS.csv` dilarang diubah dari `NOT_TESTED` ke `PASSED` dan `commercial_status` dilarang menjadi `READY_FOR_LISTING` sebelum terdapat rekam sampel fisik aktual di `08_PRODUCTION.csv` yang membuktikan uji cuci dan rekat lem DTF telah diselesaikan secara nyata.
2. **Kemandirian Proyek Editorial dan Desain Apparel:**
   Identifier editorial media (`HC-ED-001`) dan identifier desain apparel (`HC-001`) adalah dua entitas yang berbeda. Penyelidikan editorial mendalam memperkuat otoritas naratif brand, namun tidak menggantikan tahapan teknis desain maupun validasi fisik garmen.
3. **Traceability File Master & Ekspor:**
   Setiap path berkas yang dicatat dalam kolom `storage_uri` atau kolom aset wajib diverifikasi eksistensinya di dalam repositori git sebelum dicatatkan. Registri tidak boleh memuat path fiktif atau menebak-nebak struktur folder.
4. **Preservasi Catatan Historis:**
   Data historis atau legacy (seperti entitas eksplorasi awal `TSD-001-001`) tidak boleh dihapus atau dipaksa di-overwrite ke entitas baru jika keterkaitannya ambigu. Catatan tersebut harus dipertahankan sebagai rekam jejak historis yang terisolasi.

---

# APPENDIX A: HISTORICAL 8-MODULE STUDIO REGISTRY SCHEMA (V1.0)
*Bagian ini dipreservasi untuk memastikan kontinuitas dan rekam jejak historis terhadap skema flat 8-modul / 32-field yang digunakan pada fase awal studio:*

```markdown
### Modul 1: Identifikasi & Katalog
1. Design_ID (String, Primary Key): e.g. TS_HC_001
2. SKU_Base (String): e.g. TS-HC-001
3. Design_Name (String): e.g. Stupidity (The Sleep of Reason)
4. Collection_ID (String): e.g. TS_COL_HC
5. Collection_Name (String): HUMAN CONDITION
6. Brand_Tier (Enum): TeeStock Original, TeeStock Collab, TeeStock Archival

### Modul 2: Konsep Kreatif & Narasi
7. Core_Message (Text): Pesan filosofis / cerita utama desain.
8. Visual_Direction (Enum): Vintage Archive, Distorted Reality, Philosophical, Intellectual, Satirical
9. Visual_Metaphor (Text): Simbolisme visual.
10. Target_Persona (Text): Profil audiens pemakai.

### Modul 3: Komponen & Rekayasa Prompt AI
11. AI_Tool_Primary (String): Tool AI yang digunakan.
12. AI_Plan_Tier (String): Tier akun saat generasi.
13. Primary_Prompt_Summary (Text): Ringkasan prompt Layer 1.
14. Manual_Fonts_Used (String): Daftar font headline & micro-text.

### Modul 4: Aset & Lokasi Berkas (File Paths)
15. Source_Master_Path (Path): Relatif path ke file .psd / .svg
16. Production_Export_Path (Path): Relatif path ke PNG siap cetak
17. Mockup_Image_Path (Path): Lokasi file mockup visual produk.
18. References_Folder_Path (Path): Folder referensi visual terkait.

### Modul 5: Spesifikasi Teknis Cetak DTF
19. Print_Area_Code (Enum): A3-MAX (28.5x40cm), A4-STD (20x28.5cm), PKT-S (9x9cm), SLV-L
20. Physical_Dimensions_CM (String): e.g. 28.5 x 40.0 cm
21. Pixel_Dimensions_300PPI (String): e.g. 3366 x 4724 px
22. Target_Garment_Colors (String): Warna kaos yang direkomendasikan.
23. Knockout_Black (Boolean): TRUE jika warna hitam kain kaos dijadikan transparan.

### Modul 6: Hak Cipta & Lisensi Komersial (Legal Clearance)
24. AI_Commercial_Rights (Enum): VERIFIED_COMMERCIAL, RESTRICTED_NONCOMMERCIAL, PENDING_CHECK
25. Font_Licenses_Verified (Boolean): TRUE jika font berlisensi komersial sah.
26. Trademark_IP_Clearance (Enum): CLEARED_ZERO_RISK, FLAGGED_REVIEW

### Modul 7: Evaluasi Kualitas & Rekam Produksi
27. TDQS_Score (Float, 0-100): Skor TeeStock Design Quality Score.
28. Hard_Gates_Status (Enum): ALL_PASS, GATE_FAILED
29. Primary_Vendor_ID (String): ID Vendor DTF.
30. Sample_Print_Result (Enum): PASS_APPROVED, REVISION_NEEDED, NOT_TESTED

### Modul 8: Tata Kelola & Audit
31. Current_Version (String): e.g. V1.0
32. Status (Enum): Status lifecycle linear studio.
33. Approved_By (String): Nama reviewer / Creative Director.
34. Approval_Date (Date): Tanggal rilis / approval.
35. Notes (Text): Catatan khusus produksi atau riwayat perubahan.
```
