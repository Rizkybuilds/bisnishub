# MGBOS Engineering & Evidence Index

Dokumen ini adalah indeks navigasi untuk instruksi engineering, kebijakan rilis dan pemeliharaan, tata kelola agent, bukti implementasi, dan catatan historis di dalam workspace `systems/mgbos/`.

> [!important] **Batasan Otoritas Dokumen**
> Dokumen ini adalah indeks navigasi engineering dan repositori bukti, **BUKAN** spesifikasi arsitektur kanonikal dan **BUKAN** bukti kesiapan produksi.
>
> - Otoritas semantik arsitektur dimiliki oleh spesifikasi kanonikal di `../architecture/`.
> - Kesiapan implementasi diverifikasi melalui kode, pengujian, dan bukti runtime aktual.
> - Dokumen ini tidak mengubah aturan perizinan, batas database lokal, atau tata kelola engineering.

---

## 1. Instruksi Engineering Sistem

Instruksi kerja dan batasan keselamatan teknis untuk engineer dan AI agent diatur dalam:

- [MGBOS System Instructions](../../AGENTS.md) — Aturan repositori MGBOS, batas database lokal, kehati-hatian transaksi, dan larangan bypass otorisasi.

---

## 2. Pemeliharaan & Kesiapan Operasional

Standar verifikasi perubahan, rilis, dan inventaris kontrol operasional:

- [Kebijakan Pemeliharaan](maintenance-policy.md) — Alur kelulusan perubahan, persyaratan pengujian transaksi dan migrasi, serta hierarki status bukti (Direncanakan → Diimplementasikan → Terverifikasi Lokal → Terverifikasi CI → Dirilis → Diterima Operasional).
- [Register Kesiapan Operasional](operational-readiness.md) — Inventaris bukti kesiapan lingkungan, backup, CI, dan pemulihan. _Kebijakan tertulis tidak membuktikan kesiapan produksi._

---

## 3. Tata Kelola Engineering Berbasis Agent

Kerangka kerja bounded AI engineering dan control plane MGBOS:

- [MGBOS Engineering Control Plane](agent-system/README.md) — Gerbang navigasi ke kontrak alur kerja ([workflow](agent-system/workflow.md)), peran ([roles](agent-system/roles.md)), matriks izin ([permissions](agent-system/permission-matrix.md)), klasifikasi risiko ([risk](agent-system/risk-classification.md)), model bukti ([evidence](agent-system/evidence-model.md)), dan gate rilis CI ([release gates](agent-system/release-gates.md)).

---

## 4. Perencanaan Teknis & Discovery Engineering (Engineering Planning & Discovery)

Artefak penemuan teknis, investigasi basis kode sumber aktual, dan rencana implementasi teknis terikat:

- [Founder Control Engineering Discovery](founder-control-engineering-discovery.md) — Artefak provenance historis discovery W3, mengikat inspeksi kode sumber aktual ke baseline `main@88a8a28f1b64a624717a8e03038c63f4520f8978`, mengidentifikasi kesenjangan schema/auth/query/UI, dan merekomendasikan arah implementasi fisik P2-A.
- [Founder Control P2-A Operational Exception Technical Plan](founder-control-p2a-operational-exception-technical-plan.md) — Rencana teknis aktif (v1.1 pada baseline `aad21534c369829d408db424bb0546aad0d28bd2`) untuk program P2-A. Mencatat WP-P2A-01 (Database + Domain Foundation) telah selesai, dimerge (PR #42), dan diverifikasi pasca-merge; menetapkan WP-P2A-02 (Validation + Authorization + Server Command Path) sebagai kandidat work package berikutnya tanpa otorisasi runtime sebelum kontrak disahkan.

---

## 5. Pelacakan Fase & Eksekusi Implementasi

Perencanaan kerja terikat dan pelacakan fase pengembangan aktif:

- [MGBOS Implementation Index](../implementation/README.md) — Rencana fase, backlog eksekusi, audit implementasi, uji penerimaan operator, dan laporan penyelesaian. _Catatan backlog historis lama tidak boleh diperlakukan sebagai backlog aktif._
- [Phase 2 Founder Control Implementation Index](../implementation/phase-2-founder-control/README.md) — Indeks navigasi eksekusi Phase 2 (Founder Control), mencatat batasan paket bounded, status WP-P2A-01 yang telah selesai dan diverifikasi, serta WP-P2A-02 sebagai work package berikutnya yang memerlukan kontrak Head Engineering.

---

## 6. Otoritas Arsitektur

Dokumentasi engineering bukan otoritas arsitektur semantik. Untuk pertanyaan mengenai model data, state machine, invarian bisnis, command/event, dan kepemilikan domain:

- [MGBOS Architecture Index](../architecture/README.md) — Menavigasi ke dedicated canonical specifications yang memegang otoritas semantik domain MGBOS.

---

## 7. Bukti Implementasi & Audit (Implementation & Audit Evidence)

Laporan berkala hasil eksekusi engineering (seperti `mgbos-001-report.md` hingga laporan fase terkini), pengujian bertanggal, dan audit paket dokumentasi:

- [Founder Control Architecture Reconciliation Audit](founder-control-architecture-reconciliation-audit.md) — Bukti audit rekonsiliasi arsitektur kanonikal untuk paket Founder Control (VECP-003H) terhadap 6 spesifikasi arsitektur kanonikal (v1.1) pada baseline `63dec5a78462e3eff994ebdd0c15e31676b12bee`.
- [Founder Control Product Package Audit](founder-control-product-package-audit.md) — Bukti audit semantik lintas dokumen untuk paket Founder Control (D1–D4) pada baseline reviewed `65ad026fc0d6cf8da1eec15b2de39bd72b0343e5`.
- Merupakan **BUKTI REVISI** (evidence) yang mencatat apa yang dibangun, diuji, diaudit, dan diobservasi pada commit/lingkungan tertentu beserta limitasinya.
- **Bukan** spesifikasi arsitektur kanonikal, **bukan** otoritas semantik produk, **bukan** otorisasi implementasi, dan **bukan** sertifikasi kesiapan produksi.

---

## 8. Catatan Sesi & Histori Desain (Historical Provenance)

Catatan sesi perancangan awal MGBOS pada September 2026 disimpan untuk pelacakan alasan historis dan forensik keputusan:

- [2026-09-23 - MGBOS 0.5.2.md](<../../../../catatan/sesi/2026-09-23 - MGBOS 0.5.2.md>) — Historical: TeeStock Custom Atelier Implementation Backlog & Build Plan v0.1.
- [2026-09-23 - MGBOS 0.5.3.md](<../../../../catatan/sesi/2026-09-23 - MGBOS 0.5.3.md>) — Historical: Engineering Specification & Repository Standard v0.1.
- [2026-09-23 - MGBOS 0.5.4.md](<../../../../catatan/sesi/2026-09-23 - MGBOS 0.5.4.md>) — Historical: Repository Bootstrap Specification v0.1.

### Aturan Otoritas Catatan Historis:

- **Status Otoritas:** Catatan sesi di atas berstatus **HISTORICAL / DESIGN PROVENANCE**, bukan sumber kebenaran normatif aktif, bukan sumber engineering kanonikal, dan bukan backlog aktif.
- **Prinsip Konstitusional:** Spesifikasi kanonikal dan governance aktif memegang kebenaran semantik/proses; kode, pengujian, dan bukti terverifikasi membuktikan realitas implementasi; catatan sesi menyediakan histori dan konteks awal.
- **Aturan Stop:** Jika ditemukan aturan normatif yang hanya ada di dalam catatan sesi historis dan belum ada di dokumen kanonikal, proses harus dihentikan untuk merekonsiliasi aturan tersebut ke pemilik kanonikal yang sah melalui tata kelola yang benar.
