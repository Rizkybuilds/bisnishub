# TEEStock Design QA & DTF Technical Checklist (CRAFT Standard)
**Format ID:** TDL-QA-CRAFT-TMPL  
**Design ID:** [TS-OR-XXX] | **Design Name:** [Nama Desain]  
**Collection:** [Nama Koleksi] | **Version:** [v01 / v02 / v03]  
**Inspector:** [Nama Reviewer] | **Date:** [YYYY-MM-DD]  

---

### Bagian 1: TeeStock Design Quality Score (TDQS Evaluator)
*Skor 1 (Sangat Buruk) hingga 5 (Sempurna). Nilai Kategori = Skor x Bobot x 20.*

| No | Kategori Penilaian | Bobot | Skor (1–5) | Nilai Terbobot | Catatan Kritis |
| :--- | :--- | :---: | :---: | :---: | :--- |
| 1.1 | **Concept & Originality**<br>Kedalaman narasi, sudut pandang segar, anti-klise | **20%** | `[  ]` | `____ / 20` | |
| 1.2 | **Visual Impact**<br>Fokus utama tajam, visual hook kuat dalam 2 detik | **20%** | `[  ]` | `____ / 20` | |
| 1.3 | **Typography & Composition**<br>Kerning manual rapi, layout hierarkis, anti-hallucination | **15%** | `[  ]` | `____ / 15` | |
| 1.4 | **Brand & Collection Consistency**<br>Kesesuaian dengan Style Bible (palet, linework, mood) | **15%** | `[  ]` | `____ / 15` | |
| 1.5 | **Wearability & Market Appeal**<br>Proporsional di badan, keren dipakai jalan, bukan sekadar art poster | **15%** | `[  ]` | `____ / 15` | |
| 1.6 | **Production Readiness**<br>Resolusi 300 PPI, line weight $\ge 0.5$ mm, knockout black | **15%** | `[  ]` | `____ / 15` | |
| **TOTAL** | **OVERALL TDQS SCORE** | **100%** | — | **`____ / 100`** | **Threshold: $\ge 85$ Lulus** |

#### Ambang Batas TDQS:
- **85 – 100:** **READY FOR FINAL APPROVAL**
- **70 – 84:** **NEEDS REFINEMENT** (Lakukan controlled iteration pada komponen yang lemah)
- **< 70:** **REVISE / REJECT**

---

### Bagian 2: Hard Production Gates (Non-Negotiable)
> [!CRITICAL]
> Jika salah satu dari 3 parameter di bawah bernilai **FAIL**, artwork **OTOMATIS GAGAL / BLOCKED** terlepas dari berapa pun tingginya skor TDQS di atas!

| Gate ID | Parameter Hard Gate | Kriteria Wajib | Status |
| :--- | :--- | :--- | :---: |
| **HG-01** | **Commercial Rights Clearance** | Output AI & font memiliki izin komersial sah (bukan Recraft Free / Kittl Free). | [ ] PASS  [ ] FAIL |
| **HG-02** | **DTF Neon Transparency Test** | Lolos tes latar belakang neon di Photopea: **Zero white halo / zero 1% opacity artifacts**. | [ ] PASS  [ ] FAIL |
| **HG-03** | **Canvas & Resolution Native** | Tepat 300 PPI native pada ukuran fisik riil (A3: $28.5 \times 40\text{ cm}$ / A4: $20 \times 28.5\text{ cm}$). | [ ] PASS  [ ] FAIL |

---

### Bagian 3: Verifikasi Komponen Terpisah (Multi-Layer Audit)
- [ ] **Layer 1 (Primary Illustration):** AI background bersih, linework tajam, tidak ada artefak digital cacat.
- [ ] **Layer 2 (Typography):** Teks diketik manual menggunakan font terlisensi, ejaan 100% tepat, bebas cacat AI text.
- [ ] **Layer 3 (Supporting Elements):** Garis batas, ornamen, atau grid teknis presisi secara geometris.
- [ ] **Layer 4 (Texture System):** Tekstur distress menyatu alami, knockout black diaktifkan untuk kaos gelap.

---

### Status Keputusan Akhir:
- [ ] **APPROVED FOR PRODUCTION** *(TDQS $\ge 85$ dan semua Hard Gates PASS)*
- [ ] **CONTROLLED ITERATION REQUIRED** *(TDQS 70–84 -> Ikuti SOP V2/V3/V4)*
- [ ] **REJECTED / ARCHIVED** *(TDQS < 70 atau Hard Gate tidak dapat diperbaiki)*

**Creative Lead Signature:** ______________________  **Tanggal:** _______________
