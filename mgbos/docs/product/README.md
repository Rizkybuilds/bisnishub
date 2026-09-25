# MultiGraph Business OS — Product Specification & Pilot MVP Guide

> **Kategori:** Spesifikasi Produk, Desain Layar, & Alur Bisnis  
> **Status:** Active / Pilot Specification  
> **Rujukan Utama:** [[catatan/sesi/2026-09-23 - MGBOS 0.5 — TeeStock Pilot MVP|MGBOS 0.5]] & [[catatan/sesi/2026-09-23 - MGBOS 0.5.1|MGBOS 0.5.1 Custom Atelier]]

---

## 1. Visi Produk & Pilot MVP: TeeStock Custom Atelier

Tujuan tahap MVP 0.5 bukan membangun seluruh fitur holding sekaligus, melainkan membuktikan **satu pesanan nyata dapat berjalan melalui MGBOS tanpa spreadsheet sebagai sumber kebenaran data**.

Lini bisnis yang dipilih sebagai pilot pertama adalah:

> **TeeStock $\rightarrow$ Custom Atelier (Inquiry apparel kustom partai besar hingga transaksi tuntas).**

---

## 2. Alur Transaksi Kanonikal (Happy Path 11 Langkah)

```text
1. CUSTOMER INQUIRY (WhatsApp / Web)
        ↓
2. LEAD QUALIFICATION (Kebutuhan & Qty)
        ↓
3. CUSTOMER ACCOUNT (Data PT / Kontak)
        ↓
4. REQUIREMENT BUILDER (Garment, Fit, Combed 24s/30s, Sablon DTF/Screen)
        ↓
5. QUOTATION GENERATOR (Kalkulasi HPP + CFO Floor Guard)
        ↓
6. CUSTOMER APPROVAL (Konfirmasi Penawaran)
        ↓
7. ORDER SNAPSHOT (Kontrak Komersial Immutable)
        ↓
8. INVOICE & DP 50% (Pencatatan Piutang)
        ↓
9. PRODUCTION JOB ROUTING (Split Job: Blanks NSA, Sablon, Box Packing)
        ↓
10. QC INSPECTION & SHIPMENT (Checklist Kualitas & Cetak Thermal Label A6)
        ↓
11. COMPLETION & MARGIN REALIZATION (Cost Trilogy: Actual Cost vs Net Revenue)
```

---

## 3. Matriks Lingkup Fitur MVP 0.5

| Domain Bisnis                  | Status di MVP 0.5   | Catatan Implementasi                                                                 |
| ------------------------------ | ------------------- | ------------------------------------------------------------------------------------ |
| **Organization & Brand**       | ✅ Masuk (MVP)      | MultiGraph Group Holding & 5 Brand Entity (`brands`, `business_lines`).              |
| **Customer & Contacts**        | ✅ Masuk (MVP)      | Customer 360 (Individual vs Corporate, PIC contact).                                 |
| **Inbound Leads**              | ✅ Masuk (MVP)      | Kualifikasi inquiry WhatsApp & kelengkapan spesifikasi (_Requirement Completeness_). |
| **Requirements & Versioning**  | ✅ Masuk (MVP)      | Skema spesifikasi apparel kustom (`teestock.custom_atelier.v1`).                     |
| **Quotations & Pricing**       | ✅ Masuk (MVP)      | Penawaran harga resmi berversi + CFO Margin Floor (Warning <25%, Block <20%).        |
| **Order Contracts**            | ✅ Masuk (MVP)      | Pembekuan snapshot harga, item, dan alamat kirim (immutable).                        |
| **Production Jobs**            | ✅ Masuk (MVP)      | Pemecahan 1 order menjadi multi-job vendor (blanks NSA, DTF print, polymailer box).  |
| **Quality Control (QC)**       | ✅ Masuk (MVP)      | Checklist inspeksi digital (PASS / REWORK).                                          |
| **Invoicing & Payments**       | ✅ Masuk (MVP)      | Termin DP 50% vs Pelunasan, pelacakan kas masuk.                                     |
| **Financial Margin**           | ✅ Masuk (MVP)      | Cost Trilogy (Estimated vs Committed vs Actual Cost).                                |
| **Manajemen Stok Kain Mentah** | ⏳ Ditunda (Fase 2) | Menjaga sifat _asset-light_ di awal (Just-In-Time vendor fulfillment).               |
| **Creator Revenue Share**      | ⏳ Ditunda (Fase 2) | Fokus Custom Atelier B2B terlebih dahulu.                                            |
| **Sistem Reseller / Dropship** | ⏳ Ditunda (Fase 2) | Difokuskan setelah operasi inti stabil.                                              |

---

## 4. User Personas & Model Otoritas (Single Founder First)

Di tahap awal, sistem dioperasikan oleh **Sole Founder** yang menjalankan seluruh peran:

```text
                        FOUNDER (OWNER)
                               │
      ┌────────────────┬───────┴────────┬───────────────┐
      ▼                ▼                ▼               ▼
    SALES          OPERATIONS        FINANCE            QC
(Leads & Quoter) (Job Routing)   (Invoices & Kas) (Inspeksi Kaos)
```

- **Data Model Berbasis Peran:** Struktur permission database tetap dirancang berbasis peran (`owner`, `sales`, `ops`, `finance`, `qc`) agar ketika tim bertumbuh, hak akses dapat didelegasikan tanpa merombak skema database.

---

## 5. Screen Architecture (MGBOS Shell Navigation)

Layout MGBOS Shell dirancang responsif dengan struktur navigasi terorganisir:

```text
TOP BAR: [Active Brand Switcher (TeeStock / MultiGraph)] | [Founder Profile]
─────────────────────────────────────────────────────────────────────────────
SIDEBAR:
├── 🏠 Command Center (Ringkasan KPI, Action Items, Cash Inflow)
│
├── 💼 SALES PIPELINE
│   ├── Leads & Inquiries (MGBOS-006)
│   ├── Customer 360 (MGBOS-005)
│   └── Quotations & Costing (MGBOS-009)
│
├── ⚙️ OPERATIONS
│   ├── Order Contracts (MGBOS-011)
│   ├── Production Jobs & QC (MGBOS-012)
│   └── Vendor Network (MGBOS-013)
│
├── 💰 FINANCE
│   ├── Invoices & Receivables (MGBOS-014)
│   └── Payments & Cash Movements (MGBOS-015)
│
├── 📋 WORK
│   └── Tasks & High-Risk Approvals (MGBOS-016)
│
└── ⚙️ SETTINGS
    └── Multi-Brand Holding Config (MGBOS-002)
```

---

## 6. Arsip Dokumen Spesifikasi Kanonikal

- 📄 [[catatan/sesi/2026-09-23 - MGBOS 0.5 — TeeStock Pilot MVP|0.5 TeeStock Pilot MVP — Happy Path & Scope Boundaries]]
- 📄 [[catatan/sesi/2026-09-23 - MGBOS 0.5.1|0.5.1 Custom Atelier Product Spec — Wireframe & Form Fields]]
- 📄 [[catatan/sesi/2026-09-23 - MGBOS 0.5.2|0.5.2 Implementation Backlog — Slices MGBOS-001 s.d. MGBOS-016]]
