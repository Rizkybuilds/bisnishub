# TEEStock CRAFT Methodology
## Creative Reproducibility & Artwork Fidelity Technology
**Standar Mutu:** TEEStock CRAFT Framework V1  
**Klasifikasi:** Core Studio Operating Methodology  
**Tujuan:** Menghilangkan ketergantungan pada "keberuntungan prompt" (prompt lottery) dan menciptakan proses kreatif AI yang konsisten, berulang (*reproducible*), dan memenuhi standar streetwear profesional.

---

### 1. Manifesto CRAFT
> *"Kualitas desain apparel tidak boleh bergantung pada keberuntungan mendapatkan satu gambar AI yang bagus. Kualitas adalah hasil dari sistem kreatif yang terarah, spesifikasi yang presisi, pemisahan komponen, dan kurasi artistik manusia yang ketat."*

CRAFT mengubah interaksi dengan AI dari sekadar "meminta gambar jadi" menjadi **orkestrasi sistem kreatif 6 lapisan**:

```
┌────────────────────────────────────────────────────────┐
│               TEEStock CRAFT CONTROL SYSTEM            │
├─────┬──────────────────────────┬───────────────────────┤
│ L1  │ Creative Intent          │ Makna, pesan naratif, │
│     │                          │ target subkultur      │
├─────┼──────────────────────────┼───────────────────────┤
│ L2  │ Art Direction            │ Mood, visual language,│
│     │                          │ Style Bible collection│
├─────┼──────────────────────────┼───────────────────────┤
│ L3  │ Design Specification     │ Grid, hierarchy, font │
│     │                          │ pairing, color palette│
├─────┼──────────────────────────┼───────────────────────┤
│ L4  │ Generation Control       │ Reference-led prompt, │
│     │                          │ seed, model parameters│
├─────┼──────────────────────────┼───────────────────────┤
│ L5  │ Human Art Direction      │ Component separation, │
│     │                          │ compositing, finishing│
├─────┼──────────────────────────┼───────────────────────┤
│ L6  │ Production Validation    │ TDQS score, DTF audit,│
│     │                          │ commercial clearance  │
└─────┴──────────────────────────┴───────────────────────┘
```

---

### 2. Aturan Pemisahan Komponen (Decomposed Artwork Pipeline)
**Kesalahan Fatal Desainer AI:** Meminta AI me-render ilustrasi, tipografi, ornamen, dan tekstur sekaligus dalam satu kali prompt. Hasilnya: teks salah eja (*hallucinated letters*), layout kaku, dan mustahil diedit jika ada salah satu elemen yang cacat.

**Standar CRAFT: Pisahkan Desain Menjadi 4 Lapisan Independen:**

```
Layer 4: [ TEXTURE SYSTEM ]      ── Halftone, ink bleed, distress, xerox grain (Krita/Photopea)
Layer 3: [ SUPPORTING ELEMENTS ] ── Micro-text, framing, barcode, batch code, geometric grid (Inkscape)
Layer 2: [ TYPOGRAPHY ]          ── Headline lettering, title, typography pairing manual (Inkscape/Photopea)
Layer 1: [ PRIMARY ILLUSTRATION] ── Subjek visual murni yang di-generate via AI (Ideogram/ChatGPT)
─────────────────────────────────────────────────────────────────────────────
Hasil Akhir: File Master Komposit Siap Cetak (Multi-layer PSD/SVG)
```

#### Keunggulan Metode Komponen:
1. **Tipografi 100% Akurat:** Font diinstal dan diketik manual, kerning presisi, ejaan bebas halusinasi.
2. **Reusabilitas:** Ornamen dan grid layout dapat digunakan kembali pada artikel lain dalam koleksi yang sama untuk menjaga konsistensi.
3. **Fleksibilitas Revisi:** Jika ilustrasi perlu diubah, layout teks dan ornamen tidak perlu dibuat ulang.
4. **Optimasi DTF:** Warna hitam pada ilustrasi dapat di-knockout tanpa merusak warna teks pendukung.

---

### 3. Matriks 5 Jenis Referensi (Reference-Led Generation)
Jangan pernah melakukan prompt tanpa menyertakan referensi visual yang memiliki peran eksplisit:

| Tipe Referensi | Peran & Instruksi ke AI | Contoh Aset |
| :--- | :--- | :--- |
| **01. Style Reference** | Mengunci medium artistik, kepadatan arsir (*shading*), dan karakter goresan tinta. | Etsa anatomi abad ke-19, ukiran kayu Dürer. |
| **02. Composition Reference** | Mengatur persebaran bobot visual, rasio ruang kosong (*negative space*), dan arah pandang. | Poster Swiss Style, layout majalah brutalist. |
| **03. Typography Reference** | Mengunci karakter font, ketebalan *stroke*, dan gaya lettering yang akan dipasangkan secara manual. | Vintage condensed serif, archival grotesk. |
| **04. Illustration Reference** | Menentukan proporsi anatomis, distorsi surealis, atau karakter subjek utama. | Sketsa figur klasik, patung marmer neoklasik. |
| **05. Production Reference** | Meniru efek fisik hasil cetak sablon, tekstur kain, dan saturasi pigmen tinta. | Sablon discharge vintage luntur, tekstur kanvas kasar. |

---

### 4. Siklus Iterasi Terkontrol (Controlled Iteration Protocol)
**Hukum Iterasi CRAFT:** *Hanya satu perubahan variabel utama pada setiap siklus iterasi.*
Jika AI mengubah subjek, komposisi, dan gaya sekaligus, proses kreatif kehilangan kendali.

```
[ V1: Base Concept ]      ── Evaluasi konsep dasar & sudut pandang subjek
         │
         ▼ (Pertahankan konsep, perbaiki anatomi/arsir)
[ V2: Illustration Refine]── Kunci artwork ilustrasi utama
         │
         ▼ (Bawa ilustrasi ke Photopea/Inkscape, susun layout teks)
[ V3: Composition Setup ] ── Kunci hierarki tipografi dan elemen ornamen
         │
         ▼ (Aplikasikan tekstur distress & knockout black)
[ V4: Production Finish ] ── Validasi 300 PPI, defringe neon test, file master
```

---

### 5. Standar Penilaian: TeeStock Design Quality Score (TDQS)
Setiap artwork wajib dinilai menggunakan matriks terbobot 100 poin sebelum diajukan ke tahap produksi:

$$\text{TDQS} = (C \times 0.20) + (V \times 0.20) + (T \times 0.15) + (B \times 0.15) + (W \times 0.15) + (P \times 0.15)$$

*Skala skor per kategori: 1 (Sangat Buruk) hingga 5 (Sempurna). Nilai konversi = $\text{Rata-rata Terbobot} \times 20$.*

| Kategori Evaluasi | Bobot | Kriteria Evaluasi |
| :--- | :--- | :--- |
| **Concept & Originality** | **20%** | Kedalaman makna, sudut pandang segar, anti-klise, bukan tiruan mentah desain viral. |
| **Visual Impact** | **20%** | Kekuatan fokus (*focal point*), daya tarik visual dalam 2 detik pertama di layar/kaos. |
| **Typography & Composition**| **15%** | Keseimbangan layout, keterbacaan teks, kerning rapi, visual hierarchy terstruktur. |
| **Brand & DNA Consistency** | **15%** | Kesesuaian dengan Style Bible koleksi (warna, gaya ilustrasi, tone of voice). |
| **Wearability & Appeal** | **15%** | Pantas dipakai di badan nyata, proporsi tidak canggung, disukai target persona. |
| **Production Readiness** | **15%** | Ketajaman 300 PPI, background murni transparan, garis $\ge 0.5\text{ mm}$, ramah DTF. |

#### Ambang Batas Kelulusan:
- **85 – 100 Poin:** **APPROVED** (Layak masuk antrean produksi master & listing).
- **70 – 84 Poin:** **NEEDS REFINEMENT** (Perbaikan minor pada tipografi, kontras, atau tekstur).
- **< 70 Poin:** **REVISE / REJECT** (Kembalikan ke Stage 02/03).

> [!CRITICAL]
> **HARD PRODUCTION GATES:** Jika dokumen lisensi komersial belum terverifikasi (`Commercial Rights FAIL`) ATAU uji transparansi latar belakang gagal (`DTF Defringe FAIL`), artwork **DILARANG DIPRODUKSI** meskipun skor TDQS mencapai 100.
