---
title: "MultiGraph Business OS (MGBOS) — Master Roadmap & Execution Tracker"
date: "2026-09-23"
bisnis: multigraph
kategori: operasional
status: active
tags:
  - bisnis/multigraph
  - bisnis/teestock
  - kategori/operasional
  - arsitektur
  - mgbos
  - roadmap
---

# 🗺️ MultiGraph Business OS (MGBOS) — Master Roadmap & Execution Tracker

> [!abstract] **Visi Eksekutif**
> Dokumen ini adalah **pusat pelacakan resmi** evolusi dan eksekusi bertahap **MultiGraph Business OS (MGBOS)**. Mengonsolidasikan seluruh cetak biru (*blueprint series*) yang dirumuskan oleh Founder bersama Founding C-Suite Cabinet ke dalam sprint-sprint kecil terukur (30–60 menit) dengan kepatuhan penuh pada **Rule of Vertical Slices** dan **Dual-Track Execution**.

---

## 📚 Indeks Pustaka Blueprint MGBOS (Arsip Sesi Founder)

Seluruh spesifikasi arsitektur bisnis dan rekayasa perangkat lunak MGBOS terdokumentasi lengkap di folder `catatan/sesi/`:

| Versi | Judul Dokumen | Fokus & Isi Kunci |
|---|---|---|
| **0.1** | [[catatan/sesi/2026-09-23 - MultiGraph Business OS v1 - Blueprint Draft 0.1\|Blueprint Draft 0.1]] | North Star, Holding 5 Brand, 9 Domain, Vendor Network, Authority Model |
| **0.2** | [[catatan/sesi/2026-09-23 - MGBOS 0.2 - Canonical Data Model v0.1\|Canonical Data Model 0.2]] | Database mewakili realitas bisnis, Global Context, Cost Trilogy, Snapshots |
| **0.2.1** | [[catatan/sesi/2026-09-23 - MGBOS 0.2.1 Logical Data Model\|Logical Data Model 0.2.1]] | DDL Postgres, Bigint Rupiah, Batasan JSONB, ERD Relasional & Indexing |
| **0.3** | [[catatan/sesi/2026-09-23 - MGBOS 0.3 — Business State Machines\|Business State Machines 0.3]] | Siklus hidup terisolasi (Sales, Ops, Finance), Transition Guards, Derived States |
| **0.4** | [[catatan/sesi/2026-09-23 - MGBOS 0.4 — System Architecture v0.1\|System Architecture 0.4]] | Modular Monolith, CQRS mindset, Transactional Outbox Pattern, n8n Orchestrator |
| **0.5** | [[catatan/sesi/2026-09-23 - MGBOS 0.5 — TeeStock Pilot MVP\|TeeStock Pilot MVP 0.5]] | Lingkup MVP Custom Atelier, Command Center v0, Pricing Guards, Dual-Running |
| **0.5.1** | [[catatan/sesi/2026-09-23 - MGBOS 0.5.1\|Custom Atelier Product Spec 0.5.1]] | Spesifikasi layar lengkap: Home, Leads, CRM 360, Requirement Builder, Quotes |
| **0.5.2** | [[catatan/sesi/2026-09-23 - MGBOS 0.5.2\|Implementation Backlog & Build Plan 0.5.2]] | Aturan Vertical Slices, Backlog paket kerja MGBOS-001 s.d. MGBOS-016 |
| **0.5.3** | [[catatan/sesi/2026-09-23 - MGBOS 0.5.3\|Engineering Spec & Repository Standard 0.5.3]] | Konstitusi teknis: Strict TypeScript, Node 20 LTS, Testing, Boundary Integrity |
| **0.5.4** | [[catatan/sesi/2026-09-23 - MGBOS 0.5.4\|Repository Bootstrap Spec 0.5.4]] | Spesifikasi Bootstrap Sprint 1 (Repo Foundation, Org Schema, DocNumber Service) |

---

## 🚦 Status Pelaksanaan Sprint Backlog

```mermaid
flowchart LR
    S1["Sprint 1: Core Foundation<br/>(MGBOS-001 ~ 004)<br/>🟢 COMPLETED"]
    S2["Sprint 2: CRM & Leads<br/>(MGBOS-005 ~ 007)<br/>🟢 COMPLETED"]
    S3["Sprint 3: Quoter & HPP<br/>(MGBOS-008 ~ 010)<br/>🟢 COMPLETED"]
    S4["Sprint 4: Ops & Routing<br/>(MGBOS-011 ~ 013)<br/>🟢 COMPLETED"]
    S5["Sprint 5: Cash & Ledger<br/>(MGBOS-014 ~ 016)<br/>🟢 COMPLETED"]

    S1 --> S2 --> S3 --> S4 --> S5
```

---

### 🟢 Sprint 1: Core Foundation & Clean App Bootstrap (Rilis 23 Sep 2026)
*Target: Aplikasi bersih `apps/mgbos`, skema database holding multi-brand, dan service penomoran dokumen.*

- [x] **MGBOS-001**: Clean App Scaffolding `apps/mgbos` (React 18 + Strict TypeScript + Vite 6 + Tailwind CSS) di Port **3001**.
- [x] **MGBOS-002**: Database Migration Holding Multi-Brand ([`20260923_mgbos_foundation.sql`](file:///c:/Users/Rizky/bisnishub/supabase/migrations/20260923_mgbos_foundation.sql)) — Tabel `organizations`, `brands`, `business_lines`, `channels` beserta seed data resmi MultiGraph Group.
- [x] **MGBOS-003**: System Context & Brand Switcher Helper ([`systemContext.ts`](file:///c:/Users/Rizky/bisnishub/packages/shared/src/domain/context/systemContext.ts)) untuk penandaan transaksi multi-brand.
- [x] **MGBOS-004**: Deterministic Document Number Service ([`documentNumberService.ts`](file:///c:/Users/Rizky/bisnishub/packages/shared/src/domain/common/documentNumberService.ts)) — Generator & validator nomor dokumen resmi (`TS-ORD-2026-0001`, `MG-QUO-2026-0042`, dll.) dengan 100% Vitest pass.
- [x] **MGBOS Shell & Command Center v0**: Layout sidebar hierarki MGBOS 0.5.1, Active Brand Selector dinamis, dan dashboard Founder Command Center v0 ([`HomePage.tsx`](file:///c:/Users/Rizky/bisnishub/apps/mgbos/src/pages/HomePage.tsx)).

---

### 🟢 Sprint 2: Customer 360 & Inbound Leads Pipeline (Certified Complete)
*Target: Database pelanggan holding lintas brand dan penanganan inquiry masuk calon pembeli.*

- [x] **MGBOS-005**: Customer Account & Contact Domain Model (Customer 360)
  - Tabel `customer_accounts` (Individual vs Corporate).
  - Tabel `customer_contacts`, `customer_brand_relationships`, `addresses`, `customer_addresses`.
  - Halaman `Customer 360` di MGBOS Shell dengan filter per brand context dan modal tambah customer.
  - Laporan eksekusi: `mgbos/docs/engineering/mgbos-005-report.md`.
- [x] **MGBOS-006**: Inbound Lead Pipeline & Qualification Engine
  - Tabel `leads` dengan status lifecycle: `NEW` $\rightarrow$ `CONTACTED` $\rightarrow$ `QUALIFYING` $\rightarrow$ `QUALIFIED` $\rightarrow$ `CONVERTED` (dan `DISQUALIFIED`, `LOST`).
  - Automatic canonical document numbering (`TS-L-2026-000001`) via trigger `app.trg_leads_generate_number`.
  - Qualification engine rules v1 (kontak valid, kebutuhan pesanan teridentifikasi, kuantiti estimasi valid).
  - Halaman `Leads & Inquiries` dengan drawer/modal detail, 1-click qualify/disqualify/convert ke customer.
  - Laporan eksekusi: `mgbos/docs/engineering/mgbos-006-report.md`.
- [x] **MGBOS-007**: Requirement Aggregate & Versioning Engine
  - Tabel `requirements` & `requirement_versions` (immutable snapshots) untuk mencatat spesifikasi kebutuhan cetak/garmen kustom.
  - State machine requirement: `DRAFT` $\rightarrow$ `NEEDS_INFORMATION` $\rightarrow$ `READY` $\rightarrow$ `LOCKED` (dan `CANCELLED`).
  - Trigger immutability database untuk versi terkunci.
  - Laporan eksekusi: `mgbos/docs/engineering/mgbos-007-report.md`.

---

### 🟢 Sprint 3: Requirement Builder & Quote Versioning (Certified Complete)
*Target: Form spesifikasi garmen Custom Atelier v1 dan kalkulator penawaran berversi dengan CFO Pricing Floor.*

- [x] **MGBOS-008**: Custom Atelier Requirement Schema (`teestock.custom_atelier.v1`)
  - Form interaktif di storefront & dashboard: Garment type, fit, combed 24s/30s, size breakdown (S-XXL), posisi sablon DTF/screen.
  - Validasi schema Zod & database trigger JSON schema check.
  - Laporan eksekusi: `mgbos/docs/engineering/mgbos-008-report.md`.
- [x] **MGBOS-009**: Quote Versioning & Pricing Floor Guard Engine
  - Kalkulator HPP internal vs harga jual penawaran dengan bigint rupiah murni (Zero-Float).
  - CFO Hard Guard: Kunci batas margin lantai (Warning di bawah 25%, Block di bawah 20% tanpa approval).
  - Isolasi ongkir pelanggan sebagai dana pass-through escrow.
  - Laporan eksekusi: `mgbos/docs/engineering/mgbos-009-report.md`.
- [x] **MGBOS-010**: Official Quotation Generator & Customer Projection Allowlist
  - Pembuatan ringkasan quotation profesional (format PDF via `pdf-lib` & tampilan detail) dengan nomor dokumen kanonikal `TS-Q-YYYY-XXXXXX`.
  - Strict projection allowlist: pencegahan kebocoran HPP modal internal, supplier, dan catatan internal ke customer PDF.
  - Laporan eksekusi: `mgbos/docs/engineering/mgbos-010-report.md`.

---

### 🟢 Sprint 4: Order Contract Snapshot, Production Routing & QC (Certified Complete)
*Target: Pembekuan kontrak pesanan, pemecahan job multi-vendor, direktori vendor & rate cards, dan log inspeksi QC.*

- [x] **MGBOS-011**: Order Contract Snapshot & Address Freezing
  - Konversi Quote $\rightarrow$ Order Snapshot immutable (`app.orders` dan `app.order_items`).
  - Alur persetujuan penawaran resmi (`app.mark_quote_accepted` via WhatsApp/Email/Signature).
  - Pembekuan alamat pengiriman permanen (Address Freezing) dan spesifikasi garmen.
  - Penomoran kanonikal pesanan `{BRAND}-O-{YEAR}-{SEQUENCE}` (e.g. `TS-O-2026-000001`).
  - Laporan eksekusi: `mgbos/docs/engineering/mgbos-011-report.md`.
- [x] **MGBOS-012**: Production Job Splitting (`order_items` M:N `production_jobs`)
  - Pemecahan 1 pesanan menjadi Job Bahan Polos (`GARMENT`), Job Sablon DTF/Screen (`PRINTING`), Job Bordir (`EMBROIDERY`), dan Job Kemasan (`PACKAGING`).
  - State machine produksi: `PLANNED` $\rightarrow$ `READY` $\rightarrow$ `ASSIGNED` $\rightarrow$ `ACCEPTED` $\rightarrow$ `IN_PRODUCTION` $\rightarrow$ `AWAITING_QC` $\rightarrow$ `READY_FOR_HANDOFF` $\rightarrow$ `COMPLETED` (exception: `ON_HOLD`, `REWORK`, `CANCELLED`).
  - Penomoran dokumen kanonikal SPK: `{BRAND}-J-{YEAR}-{SEQUENCE}` (e.g. `TS-J-2026-000001`).
  - Isolasi The Cost Trilogy (`estimated_cost`, `committed_cost`, `actual_cost` dalam Zero-Float `bigint` rupiah).
  - Penugasan hibrida (Internal Holding Brand Sinergi vs Vendor Eksternal).
  - Integrasi UI: `/production`, `/production/[jobId]`, dan modul modal split job di `/orders/[orderId]`.
  - Laporan eksekusi: `mgbos/docs/engineering/mgbos-012-report.md`.
- [x] **MGBOS-013**: Vendor Capability Network & QC Defect Tracking
  - Direktori vendor terkurasi (`app.vendors`), termin pembayaran, dan lead time.
  - Daftar tarif kontraktual (`app.vendor_rate_cards`) dengan Zero-Float `bigint` rupiah.
  - Gate inspeksi QC digital (`app.qc_inspections`) dengan taksonomi defect (`FABRIC`, `PRINT_MISALIGNMENT`, `ADHESION`, dll).
  - Transisi status otomatis terpadu: `PASS` $\rightarrow$ `READY_FOR_HANDOFF`, `REWORK` $\rightarrow$ `REWORK` dengan instruksi perbaikan wajib.
  - Penomoran kanonikal dokumen QC: `{BRAND}-QC-{YEAR}-{SEQUENCE}` (e.g. `TS-QC-2026-000001`).
  - Integrasi UI: `/vendors`, `/vendors/[vendorId]`, dan `<QcInspectionModal>` di `/production/[jobId]`.
  - Laporan eksekusi: `mgbos/docs/engineering/mgbos-013-report.md`.

---

### 🟢 Sprint 5: Invoicing, Cash Movements & Analytical Ledger (COMPLETED)
*Target: Termin pembayaran, pencatatan kas masuk, dan pembukuan laba bersih aktual transaksi.*

- [x] **MGBOS-014**: Commercial Invoicing & Payment Terms
  - Skema faktur komersial: DP 50%, Pelunasan, Full Payment, Termin Progress, dan Retensi (`app.invoices`, `app.invoice_items`).
  - Penomoran kanonikal faktur: `{BRAND}-INV-{YEAR}-{SEQUENCE}` (e.g. `TS-INV-2026-000001`).
  - Zero-Float arithmetic (`bigint` rupiah) untuk subtotal, pajak, ongkir titipan, total, terbayar, dan sisa piutang (`balance_due`).
  - Plafon Penagihan Kontrak (Order Invoicing Ceiling): Total faktur aktif dibatasi maksimum sebesar `grand_total` pesanan.
  - Pembekuan koordinat pembayaran & rekening bank saat penerbitan (`ISSUED`) via database trigger guard.
  - Integrasi antarmuka: `/invoices`, `/invoices/[invoiceId]`, dan modul tagihan di `/orders/[orderId]`.
  - Laporan eksekusi: `mgbos/docs/engineering/mgbos-014-report.md`.
- [x] **MGBOS-015**: Payment Recording & Cash-In Allocation (Certified Complete)
  - Skema mutasi pembayaran kas: `app.payments`, `app.payment_allocations`, `app.payment_audit`.
  - Penomoran kanonikal bukti kas: `{BRAND}-PAY-{YEAR}-{SEQUENCE}` (e.g. `TS-PAY-2026-000001`).
  - Zero-Float arithmetic (`bigint` rupiah) untuk nilai kas masuk, teralokasi, dan unallocated deposit.
  - Stored Procedures atomik: `app.record_payment_and_allocate`, `app.allocate_existing_payment`, dan `app.revert_payment`.
  - Guardrail keamanan finansial: trigger `app.payment_snapshot_guard`, penolakan over-allocation di atas `balance_due`, dan otomatisasi transisi status faktur (`PARTIALLY_PAID` $\to$ `PAID` / LUNAS) beserta pembatalan (reversal).
  - Integrasi antarmuka: `/payments`, `/payments/[paymentId]`, dan modul mutasi kas di `/invoices/[invoiceId]`.
  - Laporan eksekusi: `mgbos/docs/engineering/mgbos-015-report.md`.
- [x] **MGBOS-016**: Analytical Financial Events & Margin Realization (Certified Complete)
  - Skema jurnal akuntansi analitis immutable append-only (`app.financial_ledger_entries`).
  - Penomoran kanonikal jurnal buku kas `{BRAND}-LED-{YEAR}-{SEQUENCE}` (e.g. `TS-LED-2026-000001`).
  - Trigger pencatatan event otomatis pada pesanan (`ORDER_COMMITTED`), faktur (`INVOICE_ISSUED`, `SHIPPING_ESCROW_RECORDED`), dan pembayaran kas (`PAYMENT_RECEIVED`, `PAYMENT_REVERSED`).
  - Stored procedure penyelesaian biaya produksi aktual `app.record_actual_job_cost` (`PRODUCTION_ACTUAL_SETTLED`).
  - View analitis performa pesanan `app.order_financial_summaries` dengan isolasi ongkir kurir (`courier_shipping_margin` = Rp 0), perhitungan The Cost Trilogy (Estimasi vs Komitmen vs Aktual), dan klasifikasi tingkat kesehatan margin (`HEALTHY`, `MODERATE`, `LOW_MARGIN`, `CRITICAL`).
  - Integrasi antarmuka: `/ledger`, modul Cost Trilogy pada `/orders/[orderId]`, dan modal pelunasan biaya produksi aktual di `/production/[jobId]`.
  - Laporan eksekusi: `mgbos/docs/engineering/mgbos-016-report.md`.

---

## ⚖️ Strategi Dual-Track: Keseimbangan Arus Kas & Software

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   DUAL-TRACK EXECUTION FRAMEWORK                       │
├──────────────────────────────────┬─────────────────────────────────────┤
│ TRACK A: CASH FLOW GENERATOR     │ TRACK B: MGBOS OPERATING ENGINE     │
│ (Etalase Retail TeeStock)        │ (B2B Custom Atelier & Holding Ops)  │
├──────────────────────────────────┼─────────────────────────────────────┤
│ • Katalog ritel Curated Drops    │ • Inquiry partai besar & seragam    │
│ • Blanks NSA Kaos Polos          │ • Quotation resmi berversi          │
│ • Checkout instan pembeli ritel  │ • Multi-vendor job orchestration    │
│ • Pemasukan kas harian holding   │ • Menghilangkan admin manual        │
└──────────────────────────────────┴─────────────────────────────────────┘
```

Kedua track berjalan harmonis: **Track A membawa uang kas masuk hari ini, Track B membangun mesin agar bisnis bisa membesar 10x lipat tanpa menambah staf.**
