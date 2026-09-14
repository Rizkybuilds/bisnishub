---
title: "Panduan Sinergi Antigravity & Obsidian"
date: "2026-09-14"
bisnis: umum
kategori: catatan
status: active
tags:
  - panduan
  - antigravity
  - obsidian
  - workflow
  - solopreneur
---

# 🚀 Panduan Praktis: Sinergi Google Antigravity & Obsidian

> [!abstract] **Visi Sistem**
> Menggabungkan **Obsidian** sebagai *Second Brain* (penyimpan pengetahuan dan konteks bisnis) dengan **Antigravity** sebagai *Execution Engine* (agen AI otonom yang berpikir, meriset, dan menulis langsung ke dalam file lokal Anda).

---

## 1. 🏗️ Arsitektur "One Source of Truth"

Kunci kekuatan sistem ini adalah: **Obsidian dan Antigravity bekerja pada folder fisik yang sama**.
- Tidak ada database pihak ketiga atau sinkronisasi cloud yang rawan gagal.
- Setiap kali Antigravity membuat file riset, SOP, atau kode, file tersebut langsung muncul di Obsidian secara instan.
- Setiap catatan yang Anda tulis di Obsidian langsung dapat dibaca dan dijadikan konteks oleh Antigravity.

---

## 2. 📝 Format Standar Output Antigravity

Antigravity telah diprogram (melalui aturan `GEMINI.md`) untuk selalu menghasilkan dokumen yang ramah Obsidian:

### A. YAML Frontmatter Wajib
Semua dokumen baru menyertakan metadata di baris paling atas agar kompatibel dengan **Dataview**:
```yaml
---
title: "Judul Catatan"
date: "YYYY-MM-DD"
bisnis: teestock | multigraph | titik-buta | umum
kategori: riset | operasional | keuangan | brand | marketing | catatan
status: draft | review | active | archived
tags:
  - bisnis/teestock
  - kategori/riset
---
```

### B. Obsidian Wikilinks
Gunakan format `[[Path/File|Label]]` agar semua dokumen terhubung dalam **Graph View** Obsidian:
- Contoh: `Lihat pedoman di [[bisnis/teestock/brand/brand-guide-teestock|Brand Guide TeeStock]].`

### C. Visual Callout Blocks
Antigravity menggunakan format callout standar GitHub / Obsidian:
- `> [!abstract]` : Ringkasan eksekutif
- `> [!info]` : Metadata atau konteks
- `> [!tip]` : Rekomendasi taktis
- `> [!important]` : Hal wajib / aturan SOP
- `> [!warning]` : Risiko finansial / operasional

---

## 3. 🎯 Contoh Prompt Praktis ke Antigravity

Berikut beberapa contoh cara meminta Antigravity bekerja langsung ke Vault Anda:

### Skenario 1: Riset Pasar & Kompetitor
> *"Sebagai CMO, tolong lakukan riset terhadap 3 kompetitor kaos oversized di TikTok Shop, lalu buatkan dokumen riset di `bisnis/teestock/riset/riset-oversized-q3.md` menggunakan template riset."*

### Skenario 2: Pembuatan SOP Operasional
> *"Sebagai COO, buatkan SOP pencucian dan pengeringan kaos sablon DTF sebelum dikirim ke pelanggan. Simpan di `bisnis/teestock/operasional/sop-perawatan-dtf.md` lengkap dengan callout peringatan suhu dan durasi."*

### Skenario 3: Evaluasi Mingguan (Weekly Review)
> *"Baca catatan harian minggu ini di folder `catatan/harian/` dan buatkan ringkasan `catatan/weekly-review/2026-W37.md` menggunakan template Weekly Business Review."*

### Skenario 4: Sesi Diskusi Strategis
> *"Bantu saya sebagai CFO untuk mengevaluasi apakah diskon bundling beli 2 gratis ongkir masih menguntungkan untuk TeeStock. Tulis analisis perhitungannya ke `bisnis/teestock/keuangan/analisis-bundling-launch.md`."*

---

## 4. 🔌 Rekomendasi Plugin Obsidian Pendukung

1. **Dataview**:
   - Memungkinkan tabel dinamis otomatis seperti di [[🏠 BisnisHub Command Center|Command Center]].
2. **Obsidian Git**:
   - Otomatis commit dan backup catatan Anda ke GitHub secara berkala agar setiap perubahan AI memiliki riwayat versi (*history rollback*).
3. **Omnisearch**:
   - Pencarian cepat bertenaga fuzzy search untuk menelusuri ribuan kata dalam riset dan sesi C-Suite Anda.
4. **Canvas (Bawaan Obsidian)**:
   - Gunakan file `.canvas` seperti [[🗺️ BisnisHub Ecosystem.canvas]] untuk memetakan alur bisnis secara visual.

---

## 5. ⚠️ Aturan Keamanan & Best Practices
- ✅ **Gunakan Git**: Selalu jadikan repository Git sebagai pengaman jika ada teks yang diubah oleh AI.
- ❌ **Folder `.obsidian/` Terisolasi**: AI dilarang mengubah file di `.obsidian/` agar pengaturan antarmuka dan plugin Anda tidak berubah atau rusak.
- ❌ **Hindari Race Condition**: Jangan mengedit file yang sedang aktif ditulis atau di-generate oleh AI dalam waktu bersamaan.

---
*Navigasi: [[🏠 BisnisHub Command Center|Kembali ke Command Center]]*
