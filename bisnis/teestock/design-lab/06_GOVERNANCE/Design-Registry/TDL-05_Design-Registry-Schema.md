# TEEStock Design Lab — TDL-05

> [!WARNING]
> **LEGACY — DO NOT USE AS AUTHORITY**
> Dokumen ini merupakan skema historis (fase lean-first awal).
> Otoritas kanonikal skema saat ini berada di: [`00_GLOBAL_STANDARDS/TDL-05_Design-Registry-Schema.md`](../../00_GLOBAL_STANDARDS/TDL-05_Design-Registry-Schema.md).
> Registri operasional aktif berada di: [`05_REGISTRY/`](../../05_REGISTRY/).
## Design Registry Schema: Standar Database & Manajemen Siklus Hidup Desain
**Dokumen ID:** TDL-05
**Versi:** 1.0 (Lean-First Phase)
**Status:** Active
**Konteks:** Spesifikasi Data Registry (Google Sheets / CSV)

---

### 1. Tujuan Registry
Design Registry adalah *single source of truth* untuk seluruh aset intelektual, status pengerjaan, hak komersial, dan kesiapan produksi di TeeStock Design Lab. Registry ini mencegah:
- Desain eksplorasi yang belum matang masuk ke katalog jualan secara tidak sengaja.
- Pelanggaran lisensi komersial dari tools AI tier gratis.
- Kehilangan file master atau tertukarnya versi revisi (`v01` vs `v03`).

---

### 2. State Machine: Siklus Hidup Status Desain

```
[ IDEA ]
    │
    ▼
[ BRIEF ]
    │
    ▼
[ EXPLORATION ] ──► (REJECTED / ARCHIVED)
    │
    ▼
[ DEVELOPMENT ]
    │
    ▼
[ QA ] ───────────► (ON_HOLD / REVISED)
    │
    ▼
[ APPROVED ]
    │
    ▼
[ PUBLISHED ]
```

| Kode Status | Keterangan & Syarat Transisi |
| :--- | :--- |
| **`IDEA`** | Konsep mentah atau catatan riset awal yang dicatat di backlog. |
| **`BRIEF`** | Dokumen creative brief telah diisi lengkap dan disetujui untuk dieksekusi. |
| **`EXPLORATION`** | Sedang dalam proses prompting visual di AI engine (5–10 alternatif visual). |
| **`DEVELOPMENT`** | Gambar terpilih sedang dikerjakan di Inkscape/Photopea (layout, font, finishing). |
| **`QA`** | Artwork selesai dan sedang diaudit menggunakan checklist Creative QA & DTF QA. |
| **`APPROVED`** | Lolos audit QA, hak komersial terverifikasi, file siap cetak di `04_PRODUCTION/DTF-Ready/`. |
| **`PUBLISHED`** | Desain aktif diunggah ke website, marketplace, atau materi promosi. |
| **`ON_HOLD`** | Pengerjaan ditunda sementara karena masalah vendor, tren, atau menunggu verifikasi lisensi. |
| **`REJECTED`** | Desain tidak memenuhi standar estetika/teknis dan dihentikan. |
| **`ARCHIVED`** | Desain musiman lama yang telah dinonaktifkan dari katalog aktif. |

---

### 3. Struktur Kolom Database (Data Dictionary)

| No | Nama Kolom | Tipe Data | Deskripsi & Contoh |
| :--- | :--- | :--- | :--- |
| 1 | `Design_ID` | String (Unique) | ID unik desain, format: `TS-OR-HC001` |
| 2 | `SKU_Base` | String | Kode induk SKU produk, format: `TS-OR-HC-001` |
| 3 | `Design_Name` | String | Nama karya/artikel (e.g. `Stupidity`, `The Manipulator`) |
| 4 | `Brand` | Enum | `TeeStock Original`, `TeeStock Collab`, `TeeStock Basic` |
| 5 | `Collection` | String | Nama koleksi (e.g. `Human Condition`, `Urban Rust`) |
| 6 | `Visual_Direction`| Enum | `Intellectual`, `Satirical`, `Philosophical`, `Distorted Reality`, `Vintage Archive` |
| 7 | `Status` | Enum | `IDEA`, `BRIEF`, `EXPLORATION`, `DEVELOPMENT`, `QA`, `APPROVED`, `PUBLISHED` |
| 8 | `Artwork_Version`| String | Versi rilis master (e.g. `v01`, `v02`) |
| 9 | `Print_Area` | Enum | `A3-MAX`, `A4-STD`, `PKT-S`, `STR-SLV` |
| 10 | `Garment_Colors`| String | Warna kaos dasar yang diizinkan (e.g. `Black, Bone White, Charcoal`) |
| 11 | `AI_Engine_Used` | String | Tool AI yang digunakan (e.g. `Ideogram v2`, `ChatGPT DALL-E 3`, `None/Manual`) |
| 12 | `License_Status` | Enum | `Verified_Commercial`, `Pending_Audit`, `Restricted_NonCommercial` |
| 13 | `Master_File_Path`| String | Relatif path ke file master (e.g. `02_COLLECTIONS/.../master_v01.psd`) |
| 14 | `Print_File_Path` | String | Relatif path ke file DTF (e.g. `04_PRODUCTION/DTF-Ready/..._A3.png`) |
| 15 | `Approved_By` | String | Nama penanggung jawab yang menyetujui rilis (e.g. `Owner / Creative Director`) |
| 16 | `Release_Date` | Date | Tanggal publikasi (YYYY-MM-DD) |
| 17 | `Notes` | String | Catatan teknis vendor, trik sablon, atau catatan kampanye |

---

### 4. Prosedur Audit Hak Komersial AI
Sebelum status diubah menjadi `APPROVED`, kolom `License_Status` wajib diperiksa berdasarkan ketentuan legal:
1. **Ideogram:** Free tier mengizinkan komersial, tetapi hasil berstatus publik. Verifikasi tidak ada watermark atau elemen IP terlarang.
2. **Kittl:** Hanya paket Pro/Expert yang berhak komersial. Jika dibuat di Free tier, tandai `Restricted_NonCommercial` dan jangan dicetak untuk dijual!
3. **Recraft:** Free tier secara eksplisit **melarang** penggunaan komersial. Dilarang masuk ke status `APPROVED` jika berasal dari free tier Recraft.
4. **Font:** Pastikan semua font yang digunakan berlisensi *SIL Open Font License (OFL)*, *Apache License*, atau *Commercial Desktop License* yang dimiliki.
