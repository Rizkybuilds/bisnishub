---
title: BisnisHub Command Center
type: navigation-gateway
updated: "2026-10-05"
tags:
  - command-center
  - navigation
  - gateway
  - bisnishub
---

# 🏠 BisnisHub Command Center

> [!important] **Non-Authoritative Navigation Gateway**
> Dokumen ini adalah dashboard navigasi dan gerbang orientasi cepat untuk manusia dan pengguna Obsidian.
> Dokumen ini **BUKAN** spesifikasi kanonikal, **BUKAN** bukti runtime, dan **BUKAN** sumber kebenaran bisnis maupun roadmap.
> Dokumen ini tidak pernah menjadi sumber otoritas ataupun menyelesaikan konflik otoritas.

---

## 1. Start Here (Gerbang Utama)

Mulai orientasi repositori dari gerbang utama berikut:

- [README.md](README.md) — Orientasi repositori, kepemilikan direktori, dan perintah eksekusi resmi.
- [docs/project-index.md](docs/project-index.md) — Lokator repositori tingkat atas untuk seluruh sistem, dokumen bisnis, dan tata kelola.
- [docs/governance/canonical-source-map.md](docs/governance/canonical-source-map.md) — Peta otoritas semantik kanonikal (menentukan sumber kebenaran per domain).
- [AGENTS.md](AGENTS.md) — Instruksi tata kelola engineering untuk AI agent dan builder.

---

## 2. Systems & Runtime

Navigasi ke area sistem dan perkakas repositori:

- **MGBOS**: [systems/mgbos/README.md](systems/mgbos/README.md)  
  Workspace monorepo MGBOS aktif (Next.js + pnpm + Supabase). Seluruh arsitektur, database, dan alur transaksional dikelola secara terisolasi di direktori ini.
- **JARVIS**: [systems/jarvis/docs/charter.md](systems/jarvis/docs/charter.md)  
  Dokumentasi arsitektur dan piagam spesifikasi kanonikal. Belum ada runtime produksi yang diverifikasi.
- **KasKita**: [systems/kaskita/README.md](systems/kaskita/README.md)  
  Workspace sistem independen dengan konfigurasi dan batasan database mandiri di luar holding.
- **Engineering Assistant**: [tools/assistant/README.md](tools/assistant/README.md)  
  Perkakas CLI Python asisten engineering lokal; terpisah sepenuhnya dari spesifikasi runtime JARVIS.

---

## 3. Business Knowledge

Pengetahuan bisnis, brand, riset pasar, dan SOP operasional dikelola di bawah direktori [bisnis/](bisnis/):

- `bisnis/multigraph/` — Domain bisnis MultiGraph (holding industri cetak & kemasan).
- `bisnis/teestock/` — Domain bisnis TeeStock (apparel, custom atelier & blanks).
- `bisnis/rizkybuild/` — Domain bisnis RizkyBuild (AI automation services, distribution & personal brand).

*Kebenaran bisnis, kalkulasi harga/margin, strategi produk, dan SOP operasional dimiliki sepenuhnya oleh sumber kanonikal di dalam masing-masing folder bisnis terkait.*

---

## 4. Historical & Reference Material

Dokumen histori, arsip kode lama, dan catatan sesi:

- [catatan/](catatan/) — Log harian, histori review mingguan, dan catatan sesi.
- [archive/](archive/) — Implementasi retired (termasuk TeeStock V1 dan MGBOS Vite prototype).

*Area ini bersifat historis/referensi dan tidak boleh diperlakukan sebagai implementasi aktif atau otoritas kanonikal.*

---

## 5. Commands (Perintah Eksekusi)

Dokumen ini sengaja tidak menduplikasi perintah runtime untuk mencegah desinkronisasi. Perintah eksekusi resmi dapat dilihat di:

- Root [README.md](README.md) untuk perintah repositori tingkat atas.
- README dan runbook masing-masing sistem untuk detail lokal (`systems/mgbos/README.md`, `systems/kaskita/README.md`, `tools/assistant/README.md`).

---

## 6. Authority & Drift (Kebenaran Semantik vs Implementasi)

Sesuai [Dokumentasi Konstitusi](docs/governance/documentation-constitution.md), repositori membedakan antara intended truth dan implementation truth:

- **Current Implementation / Runtime Reality**: Diverifikasi langsung dari bukti repositori dan runtime aktual.
- **Intended / Semantic Truth**: Diselesaikan dari sumber kanonikal ACTIVE (lihat [Canonical Source Map](docs/governance/canonical-source-map.md)).
- **Jika Terjadi Ketidaksesuaian**: Diperlakukan sebagai `IMPLEMENTATION_DRIFT` atau `DOCUMENTATION_DRIFT` dan harus diinvestigasi secara eksplisit. Tidak ada pihak yang otomatis menyelesaikan konflik.
- **Command Center Ini**: Hanyalah gerbang navigasi kenyamanan dan **tidak pernah menyelesaikan konflik otoritas**.
