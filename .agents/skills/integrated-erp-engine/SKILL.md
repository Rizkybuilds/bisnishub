---
name: integrated-erp-engine
description: >-
  Arsitektur, perancangan, dan pengembangan sistem Enterprise Resource Planning (ERP)
  bisnis terintegrasi (BisnisHub OS). Meliputi modul General Ledger multi-unit,
  manajemen rantai pasok (Procurement & JIT Stock), Bill of Materials (BOM) garmen & cetak DTF,
  Kanban routing produksi garmen, B2B Quoter ke Order Pipeline, dan data integrity
  antar-fitur tanpa silo. Gunakan untuk merancang, mengaudit, atau mengimplementasikan modul ERP.
argument-hint: "[ledger, inventory, procurement, production, bom, or erp-architecture]"
---

# Integrated ERP Engine — Arsitektur & Rekayasa ERP Terintegrasi

Skill spesialis untuk merancang, mengaudit, dan mengimplementasikan sistem **Enterprise Resource Planning (ERP)** yang terintegrasi secara modular, kokoh, dan tanpa silo pada ekosistem **MultiGraph Printing & Apparel Holding (BisnisHub OS & TeeStock)**.

---

## 1. Peta Modul ERP Terintegrasi (BisnisHub OS Matrix)

Sistem ERP BisnisHub dirancang dengan arsitektur **Hub & Spoke** modular yang berpusat pada **Single Source of Truth (SSOT)** database Supabase PostgreSQL:

```
                      ┌─────────────────────────────────────────┐
                      │          EXECUTIVE DASHBOARD            │
                      │  KPIs, Real-time Runway, Net Margin %   │
                      └────────────────────┬────────────────────┘
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         │                                 │                                 │
         ▼                                 ▼                                 ▼
┌──────────────────┐             ┌──────────────────┐             ┌──────────────────┐
│  TREASURY & GL   │             │   SUPPLY CHAIN   │             │ PRODUCTION / MFG │
│ Multi-Unit Ledger│◄───────────►│Procurement & JIT │◄───────────►│ DTF Gang Sheet   │
│ Cash Flow Engine │  Jurnal PO  │ NSA Buffer Stock │  Auto-Deduct│ Heat Press SOP   │
│ HPP & BOM Engine │  & HPP COGS │ Vendor Scorecard │  Stok Kaos  │ QC Defect Audit  │
└────────┬─────────┘             └────────┬─────────┘             └────────┬─────────┘
         │                                │                                │
         │ Kas Masuk                      │ Alokasi Bahan                  │ Work Slip &
         │ Piutang B2B                    │ Garmen NSA                     │ Tiket Cetak
         ▼                                ▼                                ▼
┌────────────────────────────────────────────────────────────────────────────────────┐
│                  OMNICHANNEL ORDER MANAGEMENT SYSTEM (OMS)                         │
│ • State Machine: [pending_payment] ➔ [pending] ➔ [dtf/press] ➔ [pack] ➔ [shipped]  │
│ • Kontrak Data SSOT: subtotal, discount, shipping_fee (escrow), unique_code, total │
│ • Multi-Channel: Storefront TeeStock, B2B Quoter Custom, WhatsApp Direct Sales     │
└────────────────────────────────────────┬───────────────────────────────────────────┘
                                         │
                                         ▼
┌────────────────────────────────────────────────────────────────────────────────────┐
│                    CRM, CUSTOMER PORTAL & B2B QUOTER                               │
│ • B2B RFQ Quoter: Kalkulasi bertingkat (Tier NSA + Sablon DTF + Packaging)         │
│ • Customer 360: Riwayat belanja, repeat rate, loyalty tier, auto WhatsApp follow-up│
└────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Standar Arsitektur Data & Anti-Silo Data Contract

### A. Prinsip Zero-Silo Database
1. **Dilarang Isolated State**: Fitur baru dilarang membuat tabel atau state terpisah yang tidak terhubung dengan `orders`, `ledger`, atau `inventory`.
2. **Double-Entry Balance Guarantee**: Setiap mutasi kas di modul mana pun (Procurement, Order, Defect Waste, atau Operasional) **wajib mendokumentasikan debit/kredit** di `ts_ledger_entries` dengan unit bisnis yang jelas (`teestock`, `multigraph`, `holding`, `founder`).
3. **Atomic Stock-Order Coupling**: Pemotongan inventori bahan baku (kaos polos NSA & film DTF) wajib terjadi secara **atomik** saat order berpindah dari `pending` ke `dtf`/`press`.

### B. Kontrak Keuangan Baku (CFO Non-Negotiable)
```typescript
// Rumus Standar Pendapatan & Laba ERP
export interface ERPFinancialContract {
  gross_sales: number;       // Gross pesanan sebelum diskon & ongkir
  discount_amount: number;   // Total diskon voucher / bundling
  net_revenue: number;       // gross_sales - discount_amount (Omset Riil)
  shipping_escrow: number;   // Dana titipan kurir ekspedisi (NET MARGIN = Rp 0)
  cogs_bom: number;          // HPP Kaos NSA + Tinta DTF + Kemasan + Defect Buffer
  platform_fee: number;      // Biaya gateway / QRIS / admin
  gross_profit: number;      // net_revenue - cogs_bom
  net_transaction_profit: number; // gross_profit - platform_fee
  realized_margin_pct: number;    // (net_transaction_profit / net_revenue) * 100
}
```

> [!CAUTION]
> **Larangan Keras:** Dilarang memasukkan `shipping_escrow` (ongkir kurir) ke dalam perhitungan laba kotor, laba bersih, ataupun omset penjualan! Ongkir kurir adalah pass-through.

---

## 3. Modul Kunci & Spesifikasi Teknis ERP

### Modul 1: Multi-Unit Treasury & General Ledger (`ts_ledger_entries`)
- **4 Rekening Dompet Utama**:
  - `teestock`: Kas operasional retail apparel & merch.
  - `multigraph`: Kas operasional percetakan komersial B2B & packaging.
  - `holding`: Dana cadangan dividen & investasi ekspansi.
  - `founder`: Rekening pribadi / prive founder (terisolasi dari kas operasional).
- **Automated Settlement**: Fitur auto-alokasi kas setiap transaksi lunas (misal: 10% dividen holding, 5% buffer defect, 85% reinvestasi modal kerja).

### Modul 2: Procurement & 2-Tier Supply Chain
- **Tier 1 (Buffer Studio)**: Fast-moving SKU (NSA 24s Black/White M, L, XL). Reorder point otomatis saat stok $\le 3$ pcs.
- **Tier 2 (JIT Cititex)**: Virtual inventory ditarik harian jam 15.00 WIB sesuai order lunas.
- **Landed Cost Engine**: HPP pembelian garmen menghitung: `Harga Beli Distributor + Alokasi Ongkir Masuk / Total Pcs`.

### Modul 3: Bill of Materials (BOM) & Produksi DTF
- **Komposisi BOM Standar 1 Kaos Grafis**:
  - 1 pcs Kaos Polos NSA (Heavyweight / Softstyle)
  - Cetakan DTF (cm² area desain x tarif per meter lari 58 cm)
  - 1 set Kemasan: Polymailer matte + Hangtag + Sticker Pack (Rp 3.500)
  - Buffer Defect Produksi: 5% dari total HPP bahan
- **Gang Sheet Optimization**: Roll lebar 58 cm, safe print margin 55 cm. Auto-nesting efisiensi $\ge 88\%$.

### Modul 4: B2B Quoter ke Order Pipeline
- Alur instan dari penawaran custom:
  $$\text{Draft Penawaran (Quoter)} \longrightarrow \text{Kirim PDF/WA} \longrightarrow \text{Client Approve (DP 50\%)} \longrightarrow \text{Convert to Order Kanban} \longrightarrow \text{Alokasi Stok}$$

---

## 4. Checklist Evaluasi Modul ERP Baru

Sebelum meluncurkan atau menyetujui fitur modul ERP baru, verifikasi:
- [ ] Apakah model database menggunakan foreign key ke `ts_orders`, `ts_inventory`, atau `ts_ledger`?
- [ ] Apakah fungsi mutasi data dibungkus dalam Supabase RPC transaction untuk mencegah data yatim (*orphan records*)?
- [ ] Apakah formula keuangan mengikuti aturan isolasi ongkir kurir?
- [ ] Apakah aksi-aksi status order idempotent (tidak memotong stok ganda jika webhook re-trigger)?
- [ ] Apakah audit log tersimpan dengan identitas pembuat (User / AI Automation)?
