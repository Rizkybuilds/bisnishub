# MultiGraph Business OS — Master Documentation Index

> **Status:** MGBOS Foundation (Next.js 16 / TypeScript strict / pnpm Monorepo)  
> **Ruang Lingkup:** Dokumentasi Arsitektur, Spesifikasi Produk, Standar Rekayasa, dan ADR.

---

## 📚 Struktur Navigasi Dokumentasi MGBOS

```text
mgbos/docs/
├── architecture/      --> Arsitektur Sistem, Model Data, State Machines, & Outbox
├── product/           --> Spesifikasi Produk Custom Atelier MVP 0.5, User Flow & Screens
├── engineering/       --> Audit Repositori, Inventori File, & Completion Reports
├── adr/               --> Architecture Decision Records (ADR-001 s.d. ADR-007)
└── runbooks/          --> Panduan Operasional Database Lokal & Troubleshooting
```

---

## 📑 Direktori Dokumen Utama

### 1. Arsitektur & Model Data

- 📖 [Arsitektur Sistem & Data](architecture/README.md): Modular Monolith, State Machine Terisolasi, Cost Trilogy, BigInt Rupiah, dan Transactional Outbox.
- 📐 [Canonical Data Model (0.2)](<../../../catatan/sesi/2026-09-23 - MGBOS 0.2 — Canonical Data Model v0.1.md>): Entitas bisnis universal lintas brand holding.
- 🗄️ [Logical Data Model (0.2.1)](<../../../catatan/sesi/2026-09-23 - MGBOS 0.2.1 Logical Data Model.md>): DDL PostgreSQL, tipe data uang, indeks performa, dan aturan RLS.

### 2. Spesifikasi Produk & Pilot MVP

- 🛍️ [Spesifikasi Produk Custom Atelier](product/README.md): Happy path 11 langkah, matriks ruang lingkup MVP, user personas, dan arsitektur layar.
- 🎯 [TeeStock Pilot MVP (0.5)](<../../../catatan/sesi/2026-09-23 - MGBOS 0.5 — TeeStock Pilot MVP.md>): Strategi pembuktian order nyata tanpa spreadsheet.
- 📱 [Custom Atelier Product Spec (0.5.1)](<../../../catatan/sesi/2026-09-23 - MGBOS 0.5.1.md>): Form spesifikasi garmen, size breakdown, dan posisi sablon.

### 3. Rekayasa & Standar Teknis

- ⚙️ [Standar Rekayasa & Backlog](engineering/README.md): Konstitusi teknis, prinsip pengujian, dan backlog kerja MGBOS-001 s.d. MGBOS-016.
- 🔍 [Pre-Implementation Audit](engineering/pre-implementation-audit.md): Audit integritas 641 file repositori sebelum MGBOS diimplementasikan.
- 📊 [MGBOS-001 Execution Report](engineering/mgbos-001-report.md): Laporan pengujian aplikasi Next.js, vitest, strict typecheck, dan smoke tests.
- 📋 [MGBOS-001 File Inventory](engineering/mgbos-001-files.md): Daftar lengkap file yang dibangun pada paket MGBOS-001.

- [MGBOS-007 Implementation Report](engineering/mgbos-007-report.md): Requirement forms, immutable version history, local database upgrade and verification boundaries.

- [MGBOS-008 Implementation Report](engineering/mgbos-008-report.md): TeeStock garment specifications, size validation, decoration details and immutable revisions.

- [MGBOS-009 Implementation Report](engineering/mgbos-009-report.md): Immutable quotes, internal costing and owner pricing overrides.

- [MGBOS-010 Implementation Report](engineering/mgbos-010-report.md): Customer-only quotation pages, PDFs and copyable summaries per version.

### 4. Architecture Decision Records (ADR)

- [ADR-008: Quote Pricing Snapshots](adr/008-quote-pricing-snapshots.md): Exact margin floors, version-specific approvals and pilot boundaries.

- 📄 [ADR-001: Modular Monolith](adr/001-modular-monolith.md) — Menolak microservices prematur.
- 📄 [ADR-002: PostgreSQL as System of Record](adr/002-postgresql-system-of-record.md) — Database relasional sebagai sumber kebenaran tunggal.
- 📄 [ADR-003: Supabase Local Stack](adr/003-supabase.md) — Autentikasi dan database lokal reproducible.
- 📄 [ADR-004: n8n as Orchestrator](adr/004-n8n-orchestrator.md) — Orkestrasi integrasi eksternal di luar kode domain.
- 📄 [ADR-005: Transactional Outbox Pattern](adr/005-transactional-outbox.md) — Menjamin keandalan pengiriman event bisnis.
- 📄 [ADR-006: AI Gateway Interface](adr/006-ai-gateway.md) — AI sebagai penasihat, bukan pengubah data otoritatif.
- 📄 [ADR-007: Workspace Coexistence](adr/007-workspace-coexistence.md) — Menjaga isolasi workspace MGBOS baru dari legacy prototype Vite.

- [ADR-009: Customer Quotation Projection](adr/009-customer-quotation-projection.md): Authenticated document access and separation of customer/internal data.

### 5. Panduan Operasional (Runbooks)

- 🛠️ [Local Database Runbook](runbooks/local-database.md): Prosedur menjalankan Supabase CLI lokal, reset database aman, dan pembuatan migrasi baru.
