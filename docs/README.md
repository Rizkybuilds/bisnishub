# BisnisHub Repository Documentation Gateway

> **Status:** ACTIVE REPOSITORY GATEWAY  
> **Lokasi Utama Otoritas:** Baca [project-index.md](project-index.md) dan [governance/canonical-source-map.md](governance/canonical-source-map.md).

Dokumen ini adalah gerbang navigasi utama untuk dokumentasi tingkat repositori BisnisHub.

---

## 1. Peta Navigasi Utama (*Start Here*)

Sebelum memulai pekerjaan rekayasa perangkat lunak, perancangan produk, atau audit tata kelola:

1. **Lokator Repositori:** Baca [project-index.md](project-index.md) untuk mengetahui di mana sistem, bisnis, dan governance berada.
2. **Aturan Kepemilikan Otoritas:** Baca [governance/documentation-constitution.md](governance/documentation-constitution.md) (*Documentation Constitution*) untuk memahami hukum otoritas semantik repositori.
3. **Peta Sumber Kanonikal:** Baca [governance/canonical-source-map.md](governance/canonical-source-map.md) untuk mencari dokumen kanonikal per topik/domain.
4. **Struktur Direktori:** Baca [engineering/repository-layout.md](engineering/repository-layout.md) untuk aturan direktori dan batas workspace.
5. **Engineering Control Plane:** Baca [engineering/engineering-ai-control-plane.md](engineering/engineering-ai-control-plane.md) untuk tata kelola AI engineering dan kontrak kerja.

---

## 2. Struktur Sub-Direktori `docs/`

| Folder | Isi & Tanggung Jawab | Dokumen Kunci |
| :--- | :--- | :--- |
| **`governance/`** | Konstitusi dokumentasi, peta sumber kanonikal, klasifikasi risiko, kebijakan persetujuan, dan bukti provenance | [documentation-constitution.md](governance/documentation-constitution.md), [canonical-source-map.md](governance/canonical-source-map.md) |
| **`architecture/`** | Arsitektur lintas sistem, hukum arsitektur bersama, dan batas-batas subsistem | [master-system-blueprint.md](architecture/master-system-blueprint.md), [system-boundaries.md](architecture/system-boundaries.md) |
| **`engineering/`** | Standar engineering bersama, adapter runtime, layout repositori, dan protokol Vibe Engineering | [repository-layout.md](engineering/repository-layout.md), [engineering-ai-control-plane.md](engineering/engineering-ai-control-plane.md) |
| **`operating-model/`** | Model operasi solo-founder, alokasi waktu kerja, dan prinsip founder-by-exception | [solo-founder-operating-system.md](operating-model/solo-founder-operating-system.md) |
| **`roadmaps/`** | Roadmap eksekusi lintas sistem menuju peluncuran terkendali | [solo-founder-launch-roadmap.md](roadmaps/solo-founder-launch-roadmap.md) |
| **`decisions/`** | *Architecture Decision Records* (ADR) tingkat repositori | [001-repository-organization.md](decisions/001-repository-organization.md) |
| **`reference/`** | Dokumen transisional dan ikhtisar referensi pelengkap | [2026-09-23-root-overview.md](reference/2026-09-23-root-overview.md) |
