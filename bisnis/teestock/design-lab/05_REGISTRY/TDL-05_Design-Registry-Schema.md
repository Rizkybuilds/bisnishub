# TDL-05 — TEEStock DESIGN REGISTRY SCHEMA

**Version:** 1.0  
**Status:** Foundation Draft  
**Parent Documents:** TDL-01, TDL-02, TDL-03, TDL-04  
**Framework:** CRAFT — Creative Reproducibility & Artwork Fidelity Technology  

---

# 1. PURPOSE

Design Registry adalah sistem pencatatan terpusat untuk seluruh aset desain TeeStock.

Registry berfungsi sebagai sumber informasi operasional mengenai:

- Identitas desain.
- Collection.
- Creative Brief.
- Visual Style Bible.
- Referensi dan sumber aset.
- Hak penggunaan.
- AI tools dan prompt.
- Artwork versions.
- Approval history.
- Technical specifications.
- Vendor production.
- Sample validation.
- Final commercial status.
- File storage locations.

Registry tidak menyimpan file artwork secara langsung. File disimpan di asset storage, sedangkan Registry menyimpan metadata dan referensinya.

# 2. ARCHITECTURE PRINCIPLE

TDL menggunakan dua lapisan:

**Layer 1 — Asset Storage**

Menyimpan file fisik:

- Source artwork.
- Export.
- Reference images.
- Prompt records.
- Mockups.
- Production samples.
- QA evidence.

**Layer 2 — Design Registry**

Menyimpan informasi:

- Design identity.
- Asset relationships.
- Version history.
- Workflow status.
- Approval records.
- Rights information.
- Production records.

Google Drive dan Google Sheets cukup untuk tahap awal.

Database terintegrasi dengan TeeStock platform atau MGBOS dapat dipertimbangkan setelah kebutuhan operasional terbukti.

# 3. IDENTIFICATION SYSTEM

Gunakan ID permanen yang tidak berubah walaupun nama desain berubah.

## 3.1 Collection ID

Format:

`TSC-[CATEGORY]-[NUMBER]`

Contoh:

- TSC-THM-001 — thematic collection.
- TSC-ORG-001 — TeeStock Original.
- TSC-CRV-001 — curated collection.

Kategori harus memiliki definisi internal dan tidak boleh digunakan secara sembarangan.

## 3.2 Design ID

Format:

`TSD-[COLLECTION NUMBER]-[SEQUENCE]`

Contoh:

`TSD-001-001`

Artinya:

- TSD = TeeStock Design.
- 001 = Collection identifier.
- 001 = Design sequence.

Design ID tidak berubah meskipun artwork direvisi.

## 3.3 Asset ID

Format:

`TSA-[DESIGN SEQUENCE]-[SEQUENCE]`

Contoh:

`TSA-001-001-001`

Setiap file penting memiliki Asset ID tersendiri.

## 3.4 Version ID

Format:

`V[MAJOR].[MINOR]`

Contoh:

- V1.0 — initial approved candidate.
- V1.1 — minor revision.
- V2.0 — significant redesign.

Version ID selalu dikaitkan dengan Design ID.

# 4. REGISTRY STRUCTURE

Registry MVP terdiri dari sembilan spreadsheet tabs.

| Tab | Purpose |
| --- | --- |
| 01_COLLECTIONS | Collection master data |
| 02_DESIGNS | Design master records |
| 03_CREATIVE_BRIEFS | Creative brief records |
| 04_ASSETS | File and asset inventory |
| 05_REFERENCES_RIGHTS | Reference and license records |
| 06_GENERATION_LOG | AI generation and prompt history |
| 07_APPROVALS | Review and approval history |
| 08_PRODUCTION | Vendor and sample production |
| 09_LOOKUPS | Controlled values and status definitions |

Setiap tab mempunyai satu tanggung jawab utama.

Jangan menggabungkan seluruh informasi menjadi satu spreadsheet besar.

# 5. TAB 01 — COLLECTIONS

Satu record untuk setiap collection.

Fields:

| Field | Description |
| --- | --- |
| collection_id | Unique collection identifier |
| collection_name | Official collection name |
| collection_type | Original / Curated |
| core_theme | Central theme |
| collection_description | Short positioning |
| visual_style_bible_asset_id | Link to approved style bible |
| visual_identity_version | Style Bible version |
| target_audience | Intended audience |
| collection_status | Development status |
| launch_target | Planned launch date |
| created_at | Creation date |
| updated_at | Last update |

Collection Status:

- DRAFT
- DEVELOPMENT
- APPROVED
- ACTIVE
- PAUSED
- ARCHIVED

# 6. TAB 02 — DESIGNS

Merupakan master table seluruh desain TeeStock.

Fields:

| Field | Description |
| --- | --- |
| design_id | Permanent design identifier |
| collection_id | Parent collection |
| design_title | Working or official title |
| design_type | Illustration / Typography / Mixed |
| core_message | Main message |
| concept_summary | Short concept |
| target_audience | Intended audience |
| creative_brief_id | Related brief |
| visual_style_version | Applicable Style Bible version |
| current_version | Latest version |
| design_status | Current workflow status |
| quality_score | Latest quality score |
| rights_status | Rights clearance state |
| production_status | Production validation state |
| commercial_status | Commercial readiness |
| primary_source_asset_id | Approved source asset |
| primary_export_asset_id | Approved export |
| created_at | Creation date |
| updated_at | Last update |

Design Status:

- DRAFT
- EXPLORATION
- IN_DEVELOPMENT
- CREATIVE_REVIEW
- CREATIVE_APPROVED
- ARTWORK_QA
- PRODUCTION_VALIDATION
- APPROVED
- REJECTED
- ARCHIVED

Commercial Status:

- NOT_REVIEWED
- NOT_READY
- READY_FOR_LISTING
- ACTIVE
- SUSPENDED
- RETIRED

A design can be creatively approved without being commercially ready.

# 7. TAB 03 — CREATIVE_BRIEFS

Satu desain dapat memiliki beberapa brief versions.

Fields:

- creative_brief_id
- design_id
- brief_version
- concept_direction
- core_message
- visual_metaphor
- main_subject
- composition_direction
- typography_direction
- color_direction
- illustration_direction
- texture_direction
- must_include
- must_preserve
- must_avoid
- intended_garment_color
- intended_print_placement
- approval_status
- brief_asset_id
- created_at
- approved_at

Rules:

- Brief yang sudah disetujui tidak ditimpa.
- Perubahan konsep signifikan menghasilkan brief version baru.
- Brief harus dapat ditelusuri ke design_id.

# 8. TAB 04 — ASSETS

Setiap file penting yang berhubungan dengan desain harus memiliki satu record.

Fields:

| Field | Description |
| --- | --- |
| asset_id | Unique asset identifier |
| design_id | Related design |
| asset_type | Source / Export / Reference / Preview / Sample |
| asset_name | Filename |
| version | Asset version |
| file_format | SVG / PNG / PSD / PDF / JPG |
| physical_dimensions | Actual intended print size |
| pixel_dimensions | Pixel width and height |
| resolution_ppi | Effective resolution |
| color_space | RGB / CMYK / Other |
| transparency | Yes / No / N/A |
| asset_status | Draft / Approved / Archived |
| storage_uri | File location |
| checksum | Optional file integrity identifier |
| created_at | Creation date |

Asset Types:

- SOURCE_MASTER
- PRODUCTION_EXPORT
- PREVIEW
- MOCKUP
- REFERENCE
- PROMPT_RECORD
- STYLE_BIBLE
- CREATIVE_BRIEF
- QA_REPORT
- SAMPLE_PHOTO
- LICENSE_EVIDENCE

Rules:

- One asset record represents one specific file version.
- Never overwrite an approved source master.
- Storage URI must point to the actual file location.
- Do not use filename alone as a unique identifier.

# 9. TAB 05 — REFERENCES & RIGHTS

Setiap external asset atau reference harus dicatat.

Fields:

- reference_id
- related_design_id
- source_name
- source_url
- creator_or_owner
- asset_description
- reference_role
- license_type
- commercial_use_allowed
- modification_allowed
- attribution_required
- redistribution_restrictions
- license_evidence_uri
- verification_date
- verification_status
- reviewer_notes

Reference Role:

- STYLE
- COMPOSITION
- TYPOGRAPHY
- ILLUSTRATION
- COLOR
- PRODUCTION

Rights Verification Status:

- UNKNOWN
- PENDING
- VERIFIED
- RESTRICTED
- PROHIBITED

Rules:

- Unknown rights must never be treated as cleared.
- AI generation does not automatically clear rights to input references.
- Commercial usage must be checked against the actual tool and asset license.
- Keep evidence of applicable terms at the time of use.
- Do not assume that an image found online is free for commercial use.

# 10. TAB 06 — GENERATION LOG

Mencatat proses AI-assisted design development.

Fields:

- generation_id
- design_id
- creative_brief_id
- generation_date
- tool_name
- tool_version
- model_name
- prompt_version
- prompt_asset_id
- reference_ids
- generation_objective
- iteration_number
- parent_asset_id
- output_asset_id
- evaluation_result
- selected_for_development
- notes

Generation Objective:

- CONCEPT_EXPLORATION
- STYLE_EXPLORATION
- COMPOSITION_EXPLORATION
- ILLUSTRATION
- REFINEMENT
- INPAINTING
- UPSCALING
- FINALIZATION

Rules:

- Simpan prompt yang menghasilkan kandidat terpilih.
- Catat referensi yang digunakan.
- Catat parent asset untuk iterative editing.
- Jangan menganggap hasil AI otomatis original atau bebas hak pihak ketiga.
- Simpan hanya informasi yang benar-benar membantu reproducibility; tidak perlu mencatat setiap eksperimen yang tidak relevan.

# 11. TAB 07 — APPROVALS

Setiap keputusan penting harus memiliki record.

Fields:

- approval_id
- design_id
- version
- approval_stage
- reviewer
- decision
- score
- review_date
- issue_summary
- revision_required
- related_evidence_asset_id
- notes

Approval Stage:

- CONCEPT
- CREATIVE_DIRECTION
- CREATIVE_APPROVAL
- ARTWORK_QA
- PRODUCTION_VALIDATION
- FINAL_APPROVAL
- RIGHTS_CLEARANCE

Decision:

- APPROVED
- REVISION_REQUIRED
- REJECTED
- PENDING

Rules:

- Approval harus dikaitkan dengan version tertentu.
- Approval terhadap V1.0 tidak otomatis berlaku untuk V2.0.
- Catat alasan revision atau rejection.
- Approval yang diberikan oleh reviewer harus dapat ditelusuri.

# 12. TAB 08 — PRODUCTION

Mencatat vendor, material, transfer, dan sample validation.

Fields:

- production_id
- design_id
- asset_id
- vendor_id
- vendor_profile_version
- garment_sku
- garment_color
- garment_size
- print_width_cm
- print_height_cm
- print_placement
- transfer_batch
- press_machine
- press_temperature
- press_duration
- pressure_setting
- peel_method
- final_press_instruction
- sample_date
- sample_result
- durability_test_status
- defect_notes
- sample_evidence_asset_id
- production_validation_status

Production Validation Status:

- NOT_TESTED
- TESTING
- PASSED
- FAILED
- CONDITIONAL

Rules:

- Production record harus terkait dengan artwork version tertentu.
- Jangan menggunakan sample dari versi berbeda sebagai bukti approval tanpa evaluasi.
- Vendor profile dan material changes harus dicatat.
- Failed samples tetap disimpan sebagai historical evidence.

# 13. TAB 09 — LOOKUPS

Berisi daftar nilai resmi yang digunakan oleh seluruh tabs.

Contoh:

- Collection Types.
- Design Types.
- Design Status.
- Asset Types.
- Rights Status.
- Approval Stages.
- Approval Decisions.
- Generation Objectives.
- Production Status.
- Commercial Status.

Gunakan dropdown validation di Google Sheets agar tidak ada variasi penulisan status.

Contoh:

- APPROVED
- Approved
- approved

Ketiganya tidak boleh dianggap sebagai tiga status berbeda.

# 14. DATA RELATIONSHIPS

Relasi utama:

Collection → Designs → Creative Briefs → Generation Logs → Assets → Approvals → Production Records.

References & Rights dapat berhubungan dengan collection maupun design.

Hubungan logis:

- One Collection has many Designs.
- One Design has many Creative Briefs.
- One Design has many Assets.
- One Design has many Generation Logs.
- One Design has many Approvals.
- One Design has many Production Records.
- One Design can use many References.
- One Asset belongs to one primary Design or an explicitly defined shared asset scope.

Shared assets seperti logo, font, atau template harus memiliki shared asset classification agar tidak diduplikasi secara tidak terkendali.

# 15. DESIGN READINESS LOGIC

Design Registry harus membedakan tiga jenis kelayakan.

## A. Creative Readiness

Persyaratan:

- Creative Brief approved.
- Visual Style Bible alignment confirmed.
- Creative Approval passed.

## B. Production Readiness

Persyaratan:

- Editable source available.
- Production export validated.
- Artwork QA passed.
- Vendor requirements confirmed.
- Sample production passed when required.

## C. Commercial Readiness

Persyaratan:

- Creative readiness passed.
- Rights clearance passed.
- Production readiness passed.
- Product information completed.
- Commercial approval granted.

**Important:** Design Status APPROVED tidak boleh secara otomatis mengubah Commercial Status menjadi ACTIVE.

# 16. FILE STORAGE STRUCTURE

Recommended structure:

```
TEEStock-DESIGN-LAB/
├── 00_GLOBAL_STANDARDS/
│   ├── TDL-01/
│   ├── TDL-02/
│   ├── TDL-03/
│   ├── TDL-04/
│   └── TDL-05/
├── 01_COLLECTIONS/
│   └── HUMAN_CONDITION/
│       ├── 01_STYLE_BIBLE/
│       ├── 02_RESEARCH/
│       ├── 03_REFERENCES/
│       ├── 04_CREATIVE_BRIEFS/
│       ├── 05_EXPLORATION/
│       ├── 06_WORKING_ARTWORK/
│       ├── 07_APPROVED_ARTWORK/
│       ├── 08_PRODUCTION/
│       └── 09_ARCHIVE/
├── 02_SHARED_ASSETS/
├── 03_TEMPLATES/
├── 04_LICENSES_AND_RIGHTS/
└── 05_REGISTRY/
```

# 17. MVP IMPLEMENTATION

Initial implementation menggunakan Google Sheets.

Rules:

1. Gunakan satu spreadsheet sebagai registry utama.
2. Setiap tab mempunyai header tetap.
3. Gunakan dropdown validation.
4. Gunakan ID permanen.
5. Gunakan Drive links untuk file.
6. Lindungi header dan lookup values dari perubahan tidak sengaja.
7. Catat tanggal perubahan.
8. Buat backup berkala.
9. Jangan membuat automation sebelum struktur data stabil.

Hindari formula atau automation kompleks pada tahap pertama.

# 18. FUTURE INTEGRATION

Jika TDL berkembang, Registry dapat menjadi dasar untuk database terintegrasi dengan TeeStock Platform dan MGBOS.

Future entities:

- design_collections
- designs
- design_versions
- creative_briefs
- design_assets
- design_references
- asset_rights
- generation_runs
- design_approvals
- production_vendors
- production_samples
- production_validations

Future integration harus mempertahankan:

- Stable identifiers.
- Version history.
- Audit trail.
- Asset storage references.
- Rights records.
- Approval boundaries.

Jangan membangun database production-grade hanya karena struktur datanya sudah dirancang.

# 19. INITIAL ACCEPTANCE CRITERIA

TDL-05 dianggap berhasil diterapkan ketika:

- Satu collection dapat diregistrasi.
- Setiap desain mempunyai permanent Design ID.
- Brief dan asset dapat ditelusuri.
- Reference dan rights mempunyai status.
- Prompt dan generation history dapat ditemukan.
- Approval dikaitkan dengan versi tertentu.
- Production sample memiliki record.
- Creative, production, dan commercial readiness dapat dibedakan.

# 20. FINAL GOVERNANCE RULE

**No ID, no official design record.**  
**No asset record, no trusted final file.**  
**No rights clearance, no commercial release.**  
**No version history, no reliable revision.**  
**No production evidence, no production-validated status.**
