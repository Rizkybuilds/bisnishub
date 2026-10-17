# JARVIS — Master Specification & Architecture Guide

> **Status:** ARCHITECTURE & SPECIFICATION ACTIVE (No verified runtime implementation).  
> **Boundary:** Spesifikasi arsitektur kanonikal untuk autonomous AI executive platform; belum ada runtime kode produksi yang diverifikasi.  
> **Mandat Utama:** Baca [docs/charter.md](docs/charter.md), [docs/architecture.md](docs/architecture.md), dan [docs/core-runtime.md](docs/core-runtime.md).

---

## 1. Ikhtisar & Mandat Ekosistem

JARVIS dirancang sebagai **Autonomous AI Executive Assistant & Cross-System Orchestrator** untuk mendampingi Founder dalam mengelola portofolio MultiGraph Group. 

Sesuai governance repositori BisnisHub:
- Keberadaan spesifikasi arsitektur di direktori ini **tidak membuktikan** bahwa platform runtime JARVIS telah berjalan atau di-deploy.
- Perintah CLI asisten Python di [tools/assistant/](../../tools/assistant/README.md) adalah perkakas mandiri yang **terpisah sepenuhnya** dari spesifikasi platform JARVIS.
- Sesuai [docs/engineering/repository-layout.md](../../docs/engineering/repository-layout.md), direktori ini tidak memuat folder kosong untuk runtime/kode yang belum diimplementasikan.

---

## 2. Peta Dokumentasi Kanonikal

Seluruh spesifikasi arsitektur kanonikal JARVIS dikelola di bawah folder `docs/`:

| Dokumen | Lokasi | Otoritas Semantik |
| :--- | :--- | :--- |
| **Piagam Mandat** | [docs/charter.md](docs/charter.md) | Mandat tertinggi, non-goals, batasan akuntabilitas manusia |
| **Arsitektur Sistem** | [docs/architecture.md](docs/architecture.md) | Blueprint arsitektur tingkat tinggi dan dekomposisi subsistem |
| **Core Runtime Spec** | [docs/core-runtime.md](docs/core-runtime.md) | Spesifikasi siklus hidup runtime, memori, eksekusi, dan evaluasi |
| **Pustaka 20 Modul** | [docs/architecture/](docs/architecture/canonical-index-implementation-readiness.md) | Indeks kesiapan implementasi untuk 20 modul arsitektur terinci |

---

## 3. Batas Otoritas & Hubungan Lintas Sistem

1. **Bukan Sistem Pencatat (Not System of Record):** Kebenaran transaksional bisnis (pesanan, uang, HPP, produksi) dimiliki oleh PostgreSQL di [MGBOS](../../systems/mgbos/README.md).
2. **Tanpa Akses Eksekusi Consequential Tanpa Otorisasi:** Ketersediaan perkakas atau gateway tidak memberikan otorisasi untuk mutasi data produksi atau komitmen finansial nyata.
3. **Pemberlakuan Implementasi:** Setiap implementasi runtime di masa depan wajib diawali dengan *Implementation Contract* dan *Work Package* yang disetujui Founder sesuai Engineering AI Control Plane repositori.
