# TDL-05 — TEEStock DESIGN REGISTRY SCHEMA

> [!WARNING]
> **LEGACY — DO NOT USE AS AUTHORITY**
> Dokumen ini merupakan skema historis (fase 8-modul studio awal).
> Otoritas kanonikal skema saat ini berada di: [`00_GLOBAL_STANDARDS/TDL-05_Design-Registry-Schema.md`](../00_GLOBAL_STANDARDS/TDL-05_Design-Registry-Schema.md).
> Registri operasional aktif berada di: [`05_REGISTRY/`](../05_REGISTRY/).

**Version:** 1.0
**Status:** Foundation Draft
**Parent Documents:** TDL-01, TDL-02, TDL-03, TDL-04
**Framework:** CRAFT — Creative Reproducibility & Artwork Fidelity Technology

---

# 1. PURPOSE

Dokumen ini menetapkan skema data, struktur pencatatan, dan aturan tata kelola untuk **TeeStock Design Registry** sebagai *single source of truth* seluruh aset intelektual dan produksi desain TeeStock.

Tujuan utama Design Registry:

1. **Total Traceability:** Setiap desain dapat ditelusuri dari konsep, referensi, prompt, software, versi file master, vendor cetak, hingga hasil uji cuci kaos.
2. **Commercial Integrity:** Mencegah karya dengan status lisensi belum tervalidasi atau berasal dari tier non-komersial masuk ke katalog penjualan.
3. **Production Governance:** Memastikan file yang dikirim ke vendor cetak adalah versi yang telah disetujui (APPROVED), bukan draf eksplorasi.
4. **Reproducibility:** Jika kaos habis dan perlu diproduksi ulang 6 bulan kemudian, seluruh parameter produksi dan file siap cetak dapat diakses secara instan tanpa variasi kualitas.

---

# 2. SISTEM IDENTIFIKASI & PENAMAAN (ID CONVENTIONS)

## 2.1 Design ID & Collection ID
Format standar internal studio:
```
Collection ID : TS_COL_[CODE]            (Contoh: TS_COL_HC untuk Human Condition)
Design ID     : TS_[CODE]_[NUMBER]       (Contoh: TS_HC_001)
Asset File    : TS_[CODE]_[NUM]_[TYPE]_[SIZE]_[VER]_[STATUS].[ext]
```

## 2.2 SKU Base & Final Product SKU
Format komersial untuk inventaris toko dan marketplace:
```
SKU Base      : TS-[COLLECTION]-[NUMBER]  (Contoh: TS-HC-001)
Variant SKU   : TS-[COLLECTION]-[NUMBER]-[COLOR]-[SIZE]
Contoh        : TS-HC-001-BLK-L (Human Condition 001, Black Garment, Size L)
```

---

# 3. LIFECYCLE STATUS ENGINE (TATA KELOLA STATUS DESAIN)

Status desain bergerak dalam alur linear terverifikasi sesuai TDL-03. Status tidak boleh melompati tahap (*no gate skipping*).

```
[ DRAFT ]
   │
   ▼
[ EXPLORATION ] ──────► [ REJECTED ]
   │
   ▼
[ IN DEVELOPMENT ]
   │
   ▼
[ CREATIVE REVIEW ] ──► (Revision Request)
   │
   ▼
[ CREATIVE APPROVED ]
   │
   ▼
[ ARTWORK QA ] ───────► [ BLOCKED / HARD GATE FAIL ]
   │
   ▼
[ PRODUCTION VALIDATION ]
   │
   ▼
[ APPROVED ] ─────────► [ ARCHIVED ]
```

| Kode Status | Definisi & Kriteria Transisi |
| :--- | :--- |
| **`DRAFT`** | Ide atau konsep awal tercatat di backlog, belum ada brief formal. |
| **`EXPLORATION`** | Creative Brief telah disetujui; sedang eksplorasi visual AI & referensi. |
| **`IN DEVELOPMENT`** | Arah visual terpilih; pengerjaan komponen terpisah di Photopea/Inkscape/Krita. |
| **`CREATIVE REVIEW`** | Artwork komposit selesai; menunggu evaluasi Creative Director berdasarkan Style Bible. |
| **`CREATIVE APPROVED`** | Lolos audit estetika; siap masuk ke tahap Artwork Engineering teknis. |
| **`ARTWORK QA`** | Pemeriksaan teknis 300 PPI, uji neon transparency, line weight, dan lisensi. |
| **`PRODUCTION VALIDATION`** | File dikirim ke vendor DTF; proses sample transfer dan heat press berlangsung. |
| **`APPROVED`** | Sample fisik lolos uji; file master terkunci; resmi menjadi aset komersial TeeStock. |
| **`REJECTED`** | Konsep atau artwork dihentikan karena tidak memenuhi standar studio. |
| **`ARCHIVED`** | Desain yang sudah ditarik dari katalog aktif namun data tetap disimpan permanen. |

---

# 4. STRUKTUR DATA REGISTRY (8 MODUL / 32 FIELD)

Setiap entri desain di dalam Design Registry mencakup 8 kelompok data:

### Modul 1: Identifikasi & Katalog
1. `Design_ID` *(String, Primary Key)*: e.g. `TS_HC_001`
2. `SKU_Base` *(String)*: e.g. `TS-HC-001`
3. `Design_Name` *(String)*: e.g. `Stupidity (The Sleep of Reason)`
4. `Collection_ID` *(String)*: e.g. `TS_COL_HC`
5. `Collection_Name` *(String)*: `HUMAN CONDITION`
6. `Brand_Tier` *(Enum)*: `TeeStock Original`, `TeeStock Collab`, `TeeStock Archival`

### Modul 2: Konsep Kreatif & Narasi
7. `Core_Message` *(Text)*: Pesan filosofis / cerita utama desain.
8. `Visual_Direction` *(Enum)*: `Vintage Archive`, `Distorted Reality`, `Philosophical`, `Intellectual`, `Satirical`
9. `Visual_Metaphor` *(Text)*: Simbolisme visual (e.g. tengkorak + mesin jam rusak).
10. `Target_Persona` *(Text)*: Profil audiens pemakai.

### Modul 3: Komponen & Rekayasa Prompt AI
11. `AI_Tool_Primary` *(String)*: Tool AI yang digunakan (e.g. `Ideogram v2`, `ChatGPT DALL-E 3`).
12. `AI_Plan_Tier` *(String)*: Tier akun saat generasi (e.g. `Free Web`, `Plus Subscription`).
13. `Primary_Prompt_Summary` *(Text)*: Ringkasan prompt Layer 1 (Primary Illustration).
14. `Manual_Fonts_Used` *(String)*: Daftar font headline & micro-text (e.g. `Cinzel Decorative, Space Mono`).

### Modul 4: Aset & Lokasi Berkas (File Paths)
15. `Source_Master_Path` *(Path)*: Relatif path ke file `.psd` / `.svg` (e.g. `01_COLLECTIONS/HUMAN_CONDITION/06_WORKING_ARTWORK/...`)
16. `Production_Export_Path` *(Path)*: Relatif path ke PNG siap cetak (e.g. `.../07_APPROVED_ARTWORK/TS_HC_001_PRINT_28CM_V1.0_APPROVED.png`)
17. `Mockup_Image_Path` *(Path)*: Lokasi file mockup visual produk.
18. `References_Folder_Path` *(Path)*: Folder referensi visual terkait.

### Modul 5: Spesifikasi Teknis Cetak DTF
19. `Print_Area_Code` *(Enum)*: `A3-MAX` (28.5x40cm), `A4-STD` (20x28.5cm), `PKT-S` (9x9cm), `SLV-L`
20. `Physical_Dimensions_CM` *(String)*: e.g. `28.5 x 40.0 cm`
21. `Pixel_Dimensions_300PPI` *(String)*: e.g. `3366 x 4724 px`
22. `Target_Garment_Colors` *(String)*: Warna kaos yang direkomendasikan (e.g. `Black, Washed Charcoal`).
23. `Knockout_Black` *(Boolean)*: `TRUE` jika warna hitam kain kaos dijadikan transparan.

### Modul 6: Hak Cipta & Lisensi Komersial (Legal Clearance)
24. `AI_Commercial_Rights` *(Enum)*: `VERIFIED_COMMERCIAL`, `RESTRICTED_NONCOMMERCIAL`, `PENDING_CHECK`
25. `Font_Licenses_Verified` *(Boolean)*: `TRUE` jika font memiliki lisensi komersial sah (SIL OFL/Apache/Commercial).
26. `Trademark_IP_Clearance` *(Enum)*: `CLEARED_ZERO_RISK`, `FLAGGED_REVIEW`

### Modul 7: Evaluasi Kualitas & Rekam Produksi
27. `TDQS_Score` *(Float, 0–100)*: Skor TeeStock Design Quality Score.
28. `Hard_Gates_Status` *(Enum)*: `ALL_PASS`, `GATE_FAILED`
29. `Primary_Vendor_ID` *(String)*: ID Vendor DTF (e.g. `VND-001`).
30. `Sample_Print_Result` *(Enum)*: `PASS_APPROVED`, `REVISION_NEEDED`, `NOT_TESTED`

### Modul 8: Tata Kelola & Audit
31. `Current_Version` *(String)*: e.g. `V1.0`
32. `Status` *(Enum)*: Status saat ini (dari 9 status di atas).
33. `Approved_By` *(String)*: Nama reviewer / Creative Director.
34. `Approval_Date` *(Date)*: Tanggal rilis / approval (YYYY-MM-DD).
35. `Notes` *(Text)*: Catatan khusus produksi atau riwayat perubahan.

---

# 5. ATURAN TATA KELOLA & INTEGRITAS DATA

1. **No Overwrite on Master Records:** Setiap perubahan mayor pada artwork harus menaikkan nomor versi (`V1.0` -> `V2.0`) dan dicatat baris riwayatnya.
2. **Hard Gate Dependency:** Kolom `Status` dilarang bernilai `APPROVED` jika:
   - `AI_Commercial_Rights` != `VERIFIED_COMMERCIAL`
   - `Font_Licenses_Verified` != `TRUE`
   - `Hard_Gates_Status` != `ALL_PASS`
   - `Sample_Print_Result` != `PASS_APPROVED`
3. **Format Fisik Awal:** Pada fase V1, registry dioperasikan menggunakan Google Sheets dengan struktur CSV yang telah dibakukan (`05_DESIGN_REGISTRY/design_registry.csv`).
