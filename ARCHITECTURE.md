---
title: BisnisHub Architecture Gateway
type: architecture-gateway
updated: "2026-10-05"
tags:
  - architecture
  - navigation
  - gateway
  - bisnishub
---

# 🏗️ BisnisHub Architecture Gateway

> [!important] **Non-Authoritative Architecture Navigation Gateway**
> Dokumen ini adalah gerbang navigasi arsitektur untuk memandu pembaca ke pemilik semantik kanonikal yang sah.
> Dokumen ini **BUKAN** spesifikasi arsitektur kanonikal, **BUKAN** bukti runtime, tidak memiliki kepemilikan semantik sistem, dan **tidak pernah menyelesaikan konflik arsitektur**.

---

## 1. Start Here (Orientasi & Otoritas)

Sebelum menavigasi detail sistem, rujuk dokumen navigasi dan otoritas tingkat atas:

- [docs/project-index.md](docs/project-index.md) — Lokator repositori tingkat atas untuk penempatan fisik sistem, direktori kerja, dan status repositori.
- [docs/governance/canonical-source-map.md](docs/governance/canonical-source-map.md) — Peta otoritas kanonikal repositori (menentukan dokumen mana yang memiliki otoritas semantik untuk setiap topik).

---

## 2. Cross-System Architecture (Arsitektur Lintas Sistem)

Spesifikasi kanonikal arsitektur lintas ekosistem dimiliki oleh dokumen berikut di bawah `docs/architecture/`:

- [docs/architecture/master-system-blueprint.md](docs/architecture/master-system-blueprint.md) — Topologi ekosistem tingkat atas, relasi Human–JARVIS–MGBOS, serta alur informasi dan aksi.
- [docs/architecture/system-boundaries.md](docs/architecture/system-boundaries.md) — Pemisahan batas tanggung jawab, pemisahan runtime vs engineering agent, dan batas sistem transaksional.
- [docs/architecture/architectural-laws.md](docs/architecture/architectural-laws.md) — Hukum dan invarian non-negotiable yang mengikat seluruh desain arsitektur di repositori.

---

## 3. System-Specific Architecture (Arsitektur Spesifik Sistem)

Navigasi ke pemilik arsitektur masing-masing sistem:

- **MGBOS**: [systems/mgbos/docs/architecture/README.md](systems/mgbos/docs/architecture/README.md)  
  Indeks navigasi arsitektur kanonikal MGBOS yang merutekan pembaca ke dedicated specifications untuk data model, state machines, business invariants, commands/events, permissions, dan domain/capability ownership.
- **JARVIS**: [systems/jarvis/docs/architecture.md](systems/jarvis/docs/architecture.md) & [systems/jarvis/docs/charter.md](systems/jarvis/docs/charter.md)  
  Spesifikasi dan piagam arsitektur kanonikal JARVIS. *Catatan kematangan:* spesifikasi arsitektur berstatus aktif, namun implementasi runtime berstatus `NOT_IMPLEMENTED` (bukan runtime produksi yang aktif).
- **Sistem Lainnya (KasKita, Assistant, dll.)**:  
  Untuk sistem yang tidak memiliki indeks arsitektur terpisah, rujuk [docs/project-index.md](docs/project-index.md) dan README sistem terkait.

---

## 4. Intended Architecture vs Implementation Reality (Otoritas & Drift)

Sesuai [Dokumentasi Konstitusi](docs/governance/documentation-constitution.md), repositori membedakan secara tegas antara intended truth dan implementation truth:

- **Intended Architecture**: Diselesaikan dari sumber kanonikal ACTIVE (apa yang seharusnya berlaku menurut desain).
- **Implementation Reality**: Diverifikasi dari bukti repositori, kode sumber, skema, dan status runtime aktual.
- **Jika Terjadi Perbedaan**: Diperlakukan sebagai `DOCUMENTATION_DRIFT` atau `IMPLEMENTATION_DRIFT` yang harus diinvestigasi secara eksplisit. Tidak ada pihak yang otomatis menang. Dokumen gateway ini tidak berhak menyelesaikan perbedaan tersebut.

---

## 5. Historical Architecture (Histori & Provenance)

Isi lama dokumen root `ARCHITECTURE.md` ini mendokumentasikan prototipe dan arsitektur legacy masa lalu. Peta arsitektur dan artefak historis tersebut tetap dapat ditelusuri melalui:

- Riwayat komit Git;
- Direktori [archive/](archive/) (seperti [archive/mgbos-vite-prototype/README.md](archive/mgbos-vite-prototype/README.md));
- Catatan histori di [catatan/](catatan/).

---

## 6. What This File Does Not Own (Batasan Dokumen)

Untuk mencegah timbulnya otoritas paralel, dokumen root ini **TIDAK MEMILIKI**:

- Aturan bisnis atau formula finansial (margin, pricing, HPP);
- Kontrak data pesanan, payload, atau transaksi;
- Semantik entitas dan state machine MGBOS maupun JARVIS;
- Topologi database Supabase atau konfigurasi port;
- Perintah eksekusi runtime atau instruksi deployment;
- Status roadmap atau klaim kesiapan produksi.

Dokumen ini murni berfungsi sebagai lokator dan pengarah navigasi arsitektur.
