---
title: "Governance Rules — Cross-Project BisnisHub OS × TeeStock"
date: "2026-09-20"
bisnis: umum
kategori: operasional
status: active
tags:
  - bisnis/teestock
  - bisnis/multigraph
  - kategori/operasional
  - governance
  - arsitektur
---

# 📜 Governance Rules — Cross-Project Development

> [!abstract]
> Dokumen ini berisi **aturan wajib** yang berlaku untuk semua pengembangan di ekosistem BisnisHub, khususnya untuk menjaga konsistensi dan integritas antara **BisnisHub OS** (admin dashboard) dan **TeeStock WebClient** (public storefront).
>
> Berlaku efektif: **20 September 2026**
>
> Referensi arsitektur lengkap: [[ARCHITECTURE|Architecture Map]]

---

## Rule 1: Single Source of Truth (SSOT) — Master Copy Protocol

> [!important]
> **BisnisHub OS** (`apps/bisnishub-web/`) adalah **master copy default** untuk semua file `@shared`. Satu-satunya pengecualian saat ini: `vouchersApi.js` yang di-master di TeeStock.

### Alur Perubahan File @shared

```
1. Buat perubahan di MASTER COPY
2. Jalankan unit tests di master app
3. Salin file ke app satunya (manual atau via sync script)
4. Jalankan unit tests di app satunya
5. Commit kedua perubahan dalam 1 commit
```

### ⛔ Dilarang Keras

- Mengubah file `@shared` HANYA di salah satu app tanpa sync ke app satunya
- Membuat file baru di `services/`, `utils/`, atau `constants/` yang seharusnya dipakai kedua app tanpa menambahkan ke [[ARCHITECTURE|File Ownership Registry]]
- Mengubah data contract (field name, type, atau formula) tanpa update simultan + migration SQL

---

## Rule 2: 4-Pillars Integration Checklist

Setiap fitur baru, bug fix, atau perubahan signifikan WAJIB melewati verifikasi 4 pilar berikut SEBELUM development dimulai:

### Pilar 1: 📊 Database & RLS (Supabase Architect)
- [ ] Apakah skema database perlu berubah?
- [ ] Sudah ada file migration SQL di `database/`?
- [ ] RLS policy masih sesuai?
- [ ] Trigger/function database terdampak?

### Pilar 2: 💰 Financial Integrity (CFO)
- [ ] Apakah pricing, HPP, atau margin formula terdampak?
- [ ] Net margin masih ≥ 35% ritel / ≥ 25% setelah promo?
- [ ] `shipping_fee` tidak masuk omset/laba?
- [ ] Diskon voucher maks 25% dari subtotal?

### Pilar 3: 🏭 Operational Flow (COO)
- [ ] Apakah order state machine terdampak?
- [ ] Apakah inventory flow (potong stok, reorder point) terdampak?
- [ ] Apakah fulfillment process (label, gang sheet, QC) terdampak?

### Pilar 4: 📱 Cross-App Consistency
- [ ] File `@shared` yang terlibat sudah diidentifikasi?
- [ ] Perubahan dilakukan di master copy terlebih dahulu?
- [ ] Sudah di-sync ke app satunya?
- [ ] Build sukses di kedua app?

---

## Rule 3: File Ownership Enforcement

### Saat Membuat File Baru

1. Tentukan tag ownership: `@shared`, `@admin-only`, atau `@store-only`
2. Tambahkan entry di [[ARCHITECTURE|File Ownership Registry]]
3. Jika `@shared`: buat di master copy dulu, lalu salin ke app satunya
4. Jika eksklusif: pastikan TIDAK di-import oleh app satunya

### Saat Memodifikasi File Existing

1. Cek tag ownership di [[ARCHITECTURE|File Ownership Registry]]
2. Jika `@shared`: ubah di master copy, sync, test kedua app
3. Jika eksklusif: ubah langsung, tidak perlu sync

### Deteksi Drift Berkala

Jalankan sync script secara berkala (minimal setiap minggu atau sebelum deploy):

```powershell
# Verifikasi saja (tidak mengubah file)
.\scripts\sync-shared.ps1 -Verify

# Sync dari master ke target
.\scripts\sync-shared.ps1 -Sync
```

---

## Rule 4: Data Contract Lock

> [!warning]
> Mengubah data contract adalah operasi **HIGH RISK** yang membutuhkan koordinasi simultan di 3 tempat: **Database SQL**, **BisnisHub OS**, dan **TeeStock WebClient**.

### Protected Fields (Tidak Boleh Diubah Tanpa Protokol)

**Order Payload**: `subtotal`, `discount_amount`, `shipping_fee`, `unique_code`, `total_amount`

**Order Status Enum**: `pending_payment`, `pending`, `dtf`, `press`, `pack`, `shipped`, `cancelled`

**Inventory Matrix**: `sku`, `size`, `color`, `qty_on_hand`, `qty_committed`

**Financial Formula**: Net Product Revenue, Net Profit, Realized Margin %

### Protokol Perubahan Data Contract

1. Buat RFC (Request for Change) sebagai catatan Obsidian di `catatan/rfc/`
2. Review oleh CFO (keuangan), COO (operasional), CTO (teknis)
3. Siapkan migration SQL **SEBELUM** mengubah kode
4. Update KEDUA app secara simultan
5. Deploy database migration → BisnisHub OS → TeeStock (urutan ini)
6. Verifikasi di staging sebelum production

---

## Rule 5: Dependency Version Parity

### Wajib Sama (Major Version)

| Library | BisnisHub OS | TeeStock | Status |
|---------|-------------|----------|--------|
| `react` | 18.3.1 | 18.3.1 | ✅ |
| `react-dom` | 18.3.1 | 18.3.1 | ✅ |
| `@supabase/supabase-js` | 2.116.0 | 2.49.1 | ⚠️ Minor diff |
| `lucide-react` | 0.475.0 | 0.475.0 | ✅ |
| `tailwindcss` | 3.4.17 | 3.4.17 | ✅ |
| `vite` | 5.4.14 | 5.4.14 | ✅ |
| `react-router-dom` | **7.18.4** | **6.28.2** | 🔴 Phase 2 alignment |

### Boleh Berbeda (App-Specific)

| Library | App | Alasan |
|---------|-----|--------|
| `typescript` | BisnisHub OS only | TeeStock masih JS |
| `react-hook-form` + `zod` | TeeStock only | Checkout form validation |
| `@vercel/analytics` + `speed-insights` | TeeStock only | Public analytics |
| `canvas-confetti` | BisnisHub OS only | Celebration UI |
| `@playwright/test` + `vitest` | TeeStock only | Testing suite |

---

## Rule 6: Commit Convention untuk @shared Files

> [!tip]
> Gunakan prefix `sync:` pada commit message saat melakukan sinkronisasi file shared.

```
sync: update ordersApi.js — add tracking + cancel + CSV export
sync: align vouchersApi.js — TeeStock master → BisnisHub OS (CFO 25% cap)
fix(shared): pricing.js — perbaiki formula margin custom order
feat(admin-only): add gangSheetApi batch export
feat(store-only): add size calculator modal
```

---

## Referensi Terkait

- [[ARCHITECTURE|Architecture Map & File Ownership Registry]]
- [[catatan/piagam-co-founders-bisnishub|Piagam Co-Founders BisnisHub]]
- [[bisnis/teestock/database/README|Database Schema README]]
- [[GEMINI|AI Development Rules (GEMINI.md)]]
