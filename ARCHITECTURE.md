---
title: "Architecture Map — MultiGraph Business OS & Ekosistem Web Apps"
date: "2026-09-23"
bisnis: umum
kategori: catatan
status: active
tags:
  - bisnis/teestock
  - bisnis/multigraph
  - kategori/operasional
  - arsitektur
  - governance
  - mgbos
---

# 🏗️ ARCHITECTURE — MultiGraph Business OS & Web Apps Ecosystem

> [!abstract]
> Dokumen ini adalah **peta arsitektur resmi** ekosistem perangkat lunak **MultiGraph Group**. Mengatur relasi antara **MGBOS Core** (operating system bisnis baru), **BisnisHub Admin Legacy** (admin operasional darurat), **TeeStock WebClient** (public storefront), dan **@bisnishub/shared** (single source of truth). Tujuannya: **mencegah duplikasi kode, menjamin konsistensi kontrak data, dan memperjelas hak kepemilikan file**.

---

## 1. Lanskap Sistem (System Topology)

```text
┌───────────────────────────────────────────────────────────────────────────────┐
│                          SUPABASE (Single Project)                            │
│                    tovslowsopqtuxmrogeu (ap-southeast-1)                      │
│  ┌───────────┐ ┌────────────────────────┐ ┌─────────────┐ ┌────────────────┐  │
│  │ Auth      │ │ Database (PostgreSQL)  │ │ Storage CDN │ │ Edge Functions │  │
│  │ (OAuth &  │ │ - organizations, brands│ │ - assets    │ │ - webhooks     │  │
│  │  Session) │ │ - ts_*, mgbos_*        │ │ - mockups   │ │ - checkout     │  │
│  └─────┬─────┘ └───────────┬────────────┘ └──────┬──────┘ └───────┬────────┘  │
│        │                   │                     │                │           │
└────────┼───────────────────┼─────────────────────┼────────────────┼───────────┘
         │                   │                     │                │
    ┌────┴───────────────────┴─────────────────────┴────────────────┴────┐
    │                     @bisnishub/shared (SSOT)                       │
    │  packages/shared/src/ — UI components, formatters, services,       │
    │  constants, dan Domain Services (MGBOS-001 ~ 004)                  │
    └──────────────┬────────────────────────┬──────────────────────┬─────┘
                   │                        │                      │
     ┌─────────────┴──────┐   ┌─────────────┴──────┐   ┌───────────┴──────────────┐
     │  MGBOS Core        │   │  BisnisHub Admin   │   │  TeeStock WebClient      │
     │  apps/mgbos        │   │  apps/bisnishub-web│   │  bisnis/teestock/web     │
     │                    │   │                    │   │                          │
     │  🌟 Port 3001      │   │  🛡️ Port 3000      │   │  🛍️ Port 5173 / Live     │
     │  Clean Slate App   │   │  Legacy Admin      │   │  Public Storefront       │
     │  100% Strict TS    │   │  Operational Fall- │   │  (teestockapparel.com)   │
     │  Multi-Brand OS    │   │  back (PIN-locked) │   │                          │
     │                    │   │                    │   │  React 18 + JS           │
     │  React 18 + TS     │   │  React 18 + JS/TS  │   │  Vite + Tailwind         │
     │  Vite + RR v7      │   │  Vite + RR v7      │   │  RR v7                   │
     └────────────────────┘   └────────────────────┘   └──────────────────────────┘
```

---

## 2. File Ownership Registry

> [!important]
> * Semua file `@shared` hidup di **`packages/shared/src/`** (single source of truth).
> * Ketiga aplikasi web meng-import via path alias `@bisnishub/shared/...`.
> * File `@mgbos-only` tinggal di `apps/mgbos/src/`.
> * File `@admin-only` tinggal di `apps/bisnishub-web/src/`.
> * File `@store-only` tinggal di `bisnis/teestock/web/src/`.

### Tag Ownership

| Tag | Makna | Lokasi Fisik |
|---|---|---|
| `@shared` | Dipakai lintas aplikasi | `packages/shared/src/` — di-import via `@bisnishub/shared/` |
| `@mgbos-only` | Khusus MGBOS Core | `apps/mgbos/src/` |
| `@admin-only` | Khusus BisnisHub Admin Legacy | `apps/bisnishub-web/src/` |
| `@store-only` | Khusus Storefront Publik TeeStock | `bisnis/teestock/web/src/` |

---

### Domain Layer (`packages/shared/src/domain/`)

| File | Tag | Deskripsi | Standar MGBOS |
|---|---|---|---|
| `types.ts` | `@shared` | Kontrak tipe data murni TypeScript (Org, Brand, Context, Cost Trilogy) | MGBOS 0.2.1 |
| `context/systemContext.ts` | `@shared` | Global system context, brand switcher, dan actor scoping | MGBOS-003 |
| `common/documentNumberService.ts` | `@shared` | Generator nomor dokumen deterministik (`TS-ORD-...`, `MG-QUO-...`) | MGBOS-004 |

---

### Services Layer (`packages/shared/src/services/`)

| File | Tag | Master | Deskripsi |
|---|---|---|---|
| `supabase.js` | `@shared` | BisnisHub OS | Factory client Supabase, env-aware dengan fallback |
| `ordersApi.js` | `@shared` | BisnisHub OS | Query & mutasi pesanan, tracking, export CSV |
| `inventoryApi.js` | `@shared` | BisnisHub OS | Stock opname, movement history, stats inventori |
| `ledgerApi.js` | `@shared` | BisnisHub OS | Pencatatan kas multi-unit |
| `productsApi.js` | `@shared` | BisnisHub OS | Katalog produk e-commerce |
| `settingsApi.js` | `@shared` | BisnisHub OS | Konfigurasi sistem & audit KPI |
| `procurementsApi.js` | `@shared` | BisnisHub OS | Landed cost & mapping HPP pembelian |
| `vouchersApi.js` | `@shared` | TeeStock Store | Validasi diskon promo (CFO 25% hard cap) |
| `paymentAdapter.js` | `@shared` | BisnisHub OS | Transaksi QRIS, Midtrans & manual transfer |
| `shippingApi.js` | `@shared` | BisnisHub OS | Kalkulator tarif ongkir kurir |
| `assetsApi.js` | `@shared` | BisnisHub OS | File asset management |
| `cloudinary.js` | `@shared` | BisnisHub OS | Image CDN helper |

---

### UI Components Primitives (`packages/shared/src/components/ui/`)

| Komponen | Tag | Keterangan |
|---|---|---|
| `Badge.jsx` | `@shared` | Label status (Active, Pending, Failed, Warning) |
| `Button.jsx` | `@shared` | Tombol interaktif multi-varian (primary, secondary, danger) |
| `Card.jsx` | `@shared` | Container card dengan border & shadow standar |
| `Input.jsx` | `@shared` | Form input teks, angka, select |
| `Modal.jsx` | `@shared` | Dialog modal popup |
| `Toast.jsx` | `@shared` | Notifikasi toast pesan sukses/gagal |

---

## 3. Data Contract Lock 🔒 (Non-Negotiable)

> [!warning] CFO & CTO Anti-Silo Guardrail
> Field-field kunci berikut tidak boleh diubah format, nama, atau logikanya tanpa migration SQL dan rilis sinkron di seluruh aplikasi.

### A. Order Payload Contract
```javascript
{
  subtotal: Number,           // Bruto belanja produk (sebelum diskon & ongkir)
  discount_amount: Number,    // Total potongan kupon/bundling produk
  shipping_fee: Number,       // Biaya kirim ekspedisi kurir (DANA TITIPAN / ESCROW, BUKAN OMSET)
  unique_code: Number,        // Kode unik 3 digit verifikasi QRIS/transfer
  total_amount: Number,       // subtotal - discount_amount + shipping_fee + unique_code
}
```

### B. Aturan Finansial CFO (Courier Isolation)
```
Net Product Revenue = subtotal - discount_amount
Net Profit          = Net Product Revenue - Platform Fee - Total HPP (BOM)
Realized Margin %   = (Net Profit / Net Product Revenue) × 100

⛔ shipping_fee TIDAK BOLEH masuk ke dalam omset penjualan atau laba bersih
⛔ Diskon promosi MAKSIMAL 25% dari subtotal tanpa approval eksplisit
⛔ Minimum target net margin ritel 35%, batas lantai keras B2B 20%
```

### C. Cost Trilogy Contract (MGBOS 0.2 Sec 45)
Setiap transaksi melacak 3 fase biaya:
1. `estimated_cost`: Estimasi HPP pada tahap quotation.
2. `committed_cost`: HPP riil saat Purchase Order ke vendor diterbitkan.
3. `actual_cost`: Realisasi biaya final pasca-pengiriman dan pembayaran vendor bill.

---

## 4. Roadmap Fase & Status Pengembangan

| Fase / Sprint | Target & Deliverables | Status | Catatan |
|---|---|---|---|
| **Phase 1: Dual-App Parity** | Shared services, konsistensi data contract, isolasi ongkir | 🟢 Done | Stabil di produksi |
| **Phase 2: Shared Package** | `@bisnishub/shared` terpusat di `packages/shared/` | 🟢 Done | Vite alias aktif di seluruh app |
| **MGBOS Sprint 1 (Core)** | `apps/mgbos` shell (Port 3001), SQL holding, DocNumber service | 🟢 Done | Rilis v0.5.4 |
| **MGBOS Sprint 2 (CRM)** | Customer Account 360, Leads Pipeline & WhatsApp parser | 🟡 Next Up | `MGBOS-005` s.d. `007` |
| **MGBOS Sprint 3 (Sales)** | Requirement Builder (`custom_atelier.v1`) & Quote Versioning | ⚪ Planned | `MGBOS-008` s.d. `010` |
| **MGBOS Sprint 4 (Ops)** | Order Snapshot, Production Jobs M:N, Vendor Network & QC | ⚪ Planned | `MGBOS-011` s.d. `013` |
| **MGBOS Sprint 5 (Finance)** | Invoicing, Payment Allocations & Analytical Ledger | ⚪ Planned | `MGBOS-014` s.d. `016` |

---

## 5. Referensi Terkait

* [[catatan/piagam-co-founders-bisnishub|Piagam Co-Founders BisnisHub]]
* [[catatan/mgbos-master-roadmap-tracker|MGBOS Master Roadmap & Execution Tracker]]
* [[catatan/governance-cross-project|Governance Cross-Project Rules]]
* [[supabase/migrations/20260923_mgbos_foundation.sql|SQL Migrasi Holding Multi-Brand]]
