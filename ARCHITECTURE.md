---
title: "Architecture Map — BisnisHub × TeeStock Cross-Project"
date: "2026-09-20"
bisnis: umum
kategori: catatan
status: active
tags:
  - bisnis/teestock
  - bisnis/multigraph
  - kategori/operasional
  - arsitektur
  - governance
---

# 🏗️ ARCHITECTURE — BisnisHub Ecosystem Web Apps

> [!abstract]
> Dokumen ini adalah **peta arsitektur resmi** relasi antara **BisnisHub OS** (admin dashboard) dan **TeeStock WebClient** (public storefront). Tujuannya: **mencegah duplikasi kode, menjamin konsistensi data, dan memperjelas ownership setiap file** antar kedua aplikasi web.

---

## Lanskap Sistem

```
┌─────────────────────────────────────────────────────────────────┐
│                   SUPABASE (Single Project)                     │
│            tovslowsopqtuxmrogeu (ap-southeast-1)                │
│  ┌─────────┐ ┌──────────┐ ┌───────────┐ ┌───────────────────┐  │
│  │ Auth    │ │ Database │ │ Storage   │ │ Edge Functions    │  │
│  │ (OAuth) │ │ (ts_*)   │ │ (CDN)     │ │ (Webhooks)        │  │
│  └────┬────┘ └────┬─────┘ └─────┬─────┘ └─────────┬─────────┘  │
│       │           │             │                   │           │
└───────┼───────────┼─────────────┼───────────────────┼───────────┘
        │           │             │                   │
   ┌────┴───────────┴─────────────┴───────────────────┴────┐
   │              @bisnishub/shared (Phase 2)               │
   │         packages/shared/ — SSOT services, utils,       │
   │         constants, types, schemas                      │
   └──────────────┬──────────────────────┬─────────────────┘
                  │                      │
    ┌─────────────┴──────┐   ┌───────────┴──────────────┐
    │  BisnisHub OS      │   │  TeeStock WebClient      │
    │  apps/bisnishub-web│   │  bisnis/teestock/web     │
    │                    │   │                          │
    │  🔐 PIN-Locked     │   │  🌍 Public Storefront    │
    │  Admin Dashboard   │   │  Customer-Facing         │
    │  (Founder Only)    │   │  (teestockapparel.com)   │
    │                    │   │                          │
    │  React 18 + TS     │   │  React 18 + JS           │
    │  Vite + Tailwind   │   │  Vite + Tailwind         │
    │  RR v7             │   │  RR v7                   │
    └────────────────────┘   └──────────────────────────┘
```

---

## File Ownership Registry

> [!important]
> Semua file `@shared` sekarang tinggal di **`packages/shared/src/`** (single source of truth).
> Kedua app meng-import via alias `@bisnishub/shared/...`.
> File `@admin-only` tetap di `apps/bisnishub-web/src/`, file `@store-only` tetap di `bisnis/teestock/web/src/`.

### Tag Ownership

| Tag | Artinya | Lokasi |
|-----|---------|--------|
| `@shared` | Dipakai kedua app | `packages/shared/src/` — import via `@bisnishub/shared/` |
| `@admin-only` | Hanya BisnisHub OS | `apps/bisnishub-web/src/` — tidak boleh di-import TeeStock |
| `@store-only` | Hanya TeeStock WebClient | `bisnis/teestock/web/src/` — tidak boleh di-import BisnisHub OS |

### Services Layer (`src/services/`)

| File | Tag | Master | Catatan |
|------|-----|--------|---------|
| `supabase.js` | `@shared` | BisnisHub OS | Factory client, env-aware dengan optional chaining |
| `ordersApi.js` | `@shared` | BisnisHub OS | +tracking, +cancel, +CSV export |
| `inventoryApi.js` | `@shared` | BisnisHub OS | +stock opname, +stats, +CSV export |
| `ledgerApi.js` | `@shared` | BisnisHub OS | Multi-unit treasury engine |
| `productsApi.js` | `@shared` | BisnisHub OS | +delete, +blacklist SKU, +SSR guard |
| `settingsApi.js` | `@shared` | BisnisHub OS | +env switcher, +audit checklist, +KPI |
| `procurementsApi.js` | `@shared` | BisnisHub OS | +landed cost, +COGS mapping, +multi-unit wallet |
| `vouchersApi.js` | `@shared-master:teestock` | **TeeStock** | +CFO 25% cap, +free_shipping logic |
| `paymentAdapter.js` | `@shared` | BisnisHub OS | Identik |
| `shippingApi.js` | `@shared` | BisnisHub OS | Identik |
| `assetsApi.js` | `@shared` | BisnisHub OS | Identik |
| `cloudinary.js` | `@shared` | BisnisHub OS | Identik |
| `subscribersApi.js` | `@shared` | BisnisHub OS | Identik |
| `catalogApi.js` | `@admin-only` | — | PIM catalog management |
| `customersApi.js` | `@admin-only` | — | CRM pelanggan |
| `defectsApi.js` | `@admin-only` | — | QC defect tracking |
| `gangSheetApi.js` | `@admin-only` | — | DTF gang sheet planner |
| `marketingApi.js` | `@admin-only` | — | Content calendar admin |
| `quoterApi.js` | `@admin-only` | — | B2B quotation tool |
| `storageApi.js` | `@admin-only` | — | File/asset storage manager |
| `vendorsApi.js` | `@admin-only` | — | Vendor relationship manager |

### Constants Layer (`src/constants/`)

| File | Tag | Master | Catatan |
|------|-----|--------|---------|
| `pricing.js` | `@shared` | BisnisHub OS | HPP, margin, harga — CFO territory |
| `garments.js` | `@shared` | BisnisHub OS | Master katalog garmen NSA |
| `colors.js` | `@shared` | BisnisHub OS | Palet warna produk |
| `series.js` | `@shared` | BisnisHub OS | Seri koleksi desain |
| `seedData.js` | `@shared` | BisnisHub OS | Data inisialisasi |

### Utils Layer (`src/utils/`)

| File | Tag | Master | Catatan |
|------|-----|--------|---------|
| `dtfPlanner.js` | `@shared` | BisnisHub OS | Kalkulasi gang sheet |
| `formatters.js` | `@shared` | BisnisHub OS | Format angka, tanggal |
| `garmentStockRouting.js` | `@shared` | BisnisHub OS | +pending_payment routing |
| `orderNumber.js` | `@shared` | BisnisHub OS | Generator TS-ORD-xxxx |
| `productImages.js` | `@shared` | BisnisHub OS | Cloudinary image builder |
| `whatsappTemplates.js` | `@shared` | BisnisHub OS | Template WA transaksional |

### Context Layer (`src/context/`)

| File | Tag | Master | Catatan |
|------|-----|--------|---------|
| `AuthContext.jsx` | `@shared` | BisnisHub OS | Supabase Auth wrapper |
| `StoreContext.jsx` | `@shared` | BisnisHub OS | Cart & store state |
| `ThemeContext.jsx` | `@shared` | BisnisHub OS | Dark/light mode |
| `AdminContext.jsx` | `@admin-only` | — | Admin dashboard state |

### UI Components (`src/components/ui/`)

| File | Tag | Master | Catatan |
|------|-----|--------|---------|
| `Badge.jsx` | `@shared` | BisnisHub OS | Identik |
| `Button.jsx` | `@shared` | BisnisHub OS | Identik |
| `Card.jsx` | `@shared` | BisnisHub OS | Identik |
| `Input.jsx` | `@shared` | BisnisHub OS | Identik |
| `Modal.jsx` | `@shared` | BisnisHub OS | Identik |
| `Toast.jsx` | `@shared` | BisnisHub OS | Identik |

### Common Components (`src/components/common/`)

| File | Tag | Master/Lokasi | Catatan |
|------|-----|---------------|---------|
| `SEOHead.jsx` | `@shared` | BisnisHub OS | Identik |
| `TeeStockLogo.jsx` | `@shared` | BisnisHub OS | Identik |
| `ThemeToggle.jsx` | `@shared` | BisnisHub OS | Identik |
| `CookieConsentBanner.jsx` | `@store-only` | — | GDPR banner storefront |
| `ErrorBoundary.jsx` | `@store-only` | — | Error UI storefront |

### Schemas Layer (`src/schemas/`)

| File | Tag | Master | Catatan |
|------|-----|--------|---------|
| `checkoutSchema.js` | `@store-only` | — | Zod checkout validation |

### Layouts (`src/layouts/`)

| File | Tag | Lokasi |
|------|-----|--------|
| `AdminLayout.jsx` | `@admin-only` | BisnisHub OS |
| `StoreLayout.jsx` | `@store-only` | TeeStock |

### Pages

| Folder | Tag | App |
|--------|-----|-----|
| `pages/admin/*` (16 pages) | `@admin-only` | BisnisHub OS |
| `pages/store/*` (12 pages) | `@store-only` | TeeStock |

---

## Data Contract Lock 🔒

> [!warning]
> Field-field berikut TIDAK BOLEH diubah nama, tipe, atau semantik tanpa update simultan di KEDUA app dan database migration SQL.

### Order Payload Contract

```javascript
{
  subtotal: Number,           // Bruto belanja produk (sebelum diskon & ongkir)
  discount_amount: Number,    // Total potongan kupon/bundling
  shipping_fee: Number,       // Biaya kirim kurir (pass-through, BUKAN omset)
  unique_code: Number,        // Kode unik 3 digit verifikasi QRIS/transfer
  total_amount: Number,       // subtotal - discount_amount + shipping_fee + unique_code
}
```

### Order Status State Machine

```
pending_payment → pending → dtf → press → pack → shipped
                     ↘ cancelled (dari pending/dtf/press)
```

### Inventory Fields

```javascript
{
  sku: String,                // SKU produk (FK ke ts_products.sku)
  size: String,               // S, M, L, XL, XXL
  color: String,              // Hitam, Krem, Charcoal, dll
  qty_on_hand: Number,        // Stok fisik tersedia
  qty_committed: Number,      // Stok sudah dialokasi ke pesanan aktif
}
```

### Financial Formulas (CFO Lock)

```
Net Product Revenue = subtotal - discount_amount
Net Profit = Net Product Revenue - Platform Fee - Total HPP (BOM)
Realized Margin % = (Net Profit / Net Product Revenue) × 100

⛔ shipping_fee TIDAK BOLEH masuk omset/laba
⛔ Diskon voucher MAKS 25% dari subtotal (CFO guardrail)
⛔ Net margin minimum 35% ritel, 25% setelah promo
```

---

## 4-Pillars Pre-Flight Checklist ✅

> [!tip]
> Jalankan checklist ini SEBELUM setiap fitur baru, bug fix, atau perubahan data contract.

### Sebelum Memulai Development

- [ ] **📊 Pilar 1: Database & RLS** — Apakah perubahan ini membutuhkan migration SQL baru? Sudah ada file `.sql` di `database/`? RLS policy terpengaruh?
- [ ] **💰 Pilar 2: Financial Integrity (CFO)** — Apakah pricing/HPP/margin terdampak? Formula keuangan sudah sesuai CFO Lock di atas?
- [ ] **🏭 Pilar 3: Operational Flow (COO)** — Apakah order state machine, inventory flow, atau fulfillment process terdampak?
- [ ] **📱 Pilar 4: Cross-App Consistency** — Apakah file `@shared` terlibat? Jika ya, sudah dipastikan update di master copy dan sync ke app satunya?

### Sebelum Deploy

- [ ] File `@shared` yang diubah sudah identik di kedua app (jalankan `scripts/sync-shared.ps1 -Verify`)
- [ ] Unit tests pass di kedua app (`vitest run`)
- [ ] Build sukses di kedua app (`vite build`)
- [ ] Data contract tidak berubah, ATAU migration SQL sudah disiapkan

---

## Phase 2 Roadmap: Shared Package & Alignment

> [!info]
> Dijadwalkan di sprint setelah governance rules stabil (~1-2 minggu ke depan).

| Item | Status | ETA |
|------|--------|-----|
| Buat `packages/shared/` dengan barrel export | 🟡 Planned | Sprint 2 |
| Migrasi semua `@shared` file ke package | 🟡 Planned | Sprint 2 |
| Upgrade TeeStock `react-router-dom` v6 → v7 | 🟡 Planned | Sprint 2 |
| Setup Vite alias `@bisnishub/shared` di kedua app | 🟡 Planned | Sprint 2 |
| Gradual TypeScript migration shared package | 🟡 Planned | Sprint 3 |

---

## Referensi

- [[catatan/piagam-co-founders-bisnishub|Piagam Co-Founders BisnisHub]]
- [[catatan/governance-cross-project|Governance Cross-Project Rules]]
- [[bisnis/teestock/database/README|Database Schema README]]
