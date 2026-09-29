# MultiGraph Business OS — Architecture Constitution & Data Guide

> **Kategori:** Arsitektur Sistem, Model Data Kanonikal, & Integritas Bisnis  
> **Status:** Active / Canonical Standard  
> **Rujukan Utama:** [[catatan/sesi/2026-09-23 - MGBOS 0.4 — System Architecture v0.1|MGBOS 0.4]] & [[catatan/sesi/2026-09-23 - MGBOS 0.2.1 Logical Data Model|MGBOS 0.2.1]]

---

## 1. Prinsip Fundamental Arsitektur

MGBOS dibangun dengan serangkaian keputusan fundamental ("konstitusi teknis") yang tidak boleh dilanggar:

| Prinsip                | Implementasi Teknis                         | Mengapa Penting?                                                                                          |
| ---------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Modular Monolith**   | Single pnpm monorepo, strict public exports | Mencegah kompleksitas operasional microservices terdistribusi di fase solo founder.                       |
| **System of Record**   | PostgreSQL 17 / Supabase                    | Database relasional adalah satu-satunya sumber kebenaran bisnis (_Single Source of Truth_).               |
| **Domain Purity**      | `packages/domain` murni TypeScript          | Logika bisnis tidak boleh terikat (_vendor lock-in_) pada React, Next.js, ataupun ORM database.           |
| **Integritas Moneter** | **BigInt / Integer Rupiah**                 | Dilarang menggunakan _floating-point arithmetic_ untuk uang. Menghilangkan bug selisih pembulatan rupiah. |
| **Rules Before AI**    | Rule-engine deterministik                   | Aturan batas margin dan validasi status pesanan dieksekusi oleh kode database/TypeScript, bukan LLM.      |
| **AI as Intelligence** | Multimodal OCR & Copilot                    | AI bertindak sebagai analis/rekomendasi cerdas, bukan pencatat transaksi otoritatif.                      |

---

## 2. Canonical State Machine Architecture

> [!important]
> **Dilarang menumpuk status pembayaran, produksi, QC, dan pengiriman ke dalam satu kolom string seperti `order.status`.**

MGBOS memisahkan siklus hidup menjadi mesin status independen yang terkoordinasi:

```text
                     COMMAND
                        │
                        ▼
                  CHECK GUARDS
                        │
                        ▼
                   AUTHORIZED?
                        │
                        ▼
               DATABASE TRANSACTION
                        │
       ┌────────────────┼────────────────┐
       ▼                ▼                ▼
STATE TRANSITION   OUTBOX EVENT     AUDIT LOG
```

### Pemisahan Siklus Hidup:

1. **Commercial Lifecycle (`orders`):**  
   `DRAFT` $\rightarrow$ `PENDING_APPROVAL` $\rightarrow$ `CONFIRMED` $\rightarrow$ `FULFILLED` $\rightarrow$ `CLOSED` (atau `CANCELLED`).
2. **Financial Lifecycle (`invoices` / `payments`):**  
   `UNPAID` $\rightarrow$ `PARTIALLY_PAID` (DP) $\rightarrow$ `PAID_IN_FULL` $\rightarrow$ `REFUNDED`.
3. **Operational Production Lifecycle (`production_jobs`):**  
   `PLANNED` $\rightarrow$ `READY` $\rightarrow$ `ASSIGNED` (ke vendor) $\rightarrow$ `ACCEPTED` $\rightarrow$ `IN_PRODUCTION` $\rightarrow$ `COMPLETED`.
4. **Quality Lifecycle (`quality_inspections`):**  
   `PENDING` $\rightarrow$ `INSPECTION` $\rightarrow$ `PASSED` / `REWORK_REQUIRED` / `SCRAPPED`.
5. **Fulfillment Lifecycle (`shipments`):**  
   `DRAFT` $\rightarrow$ `READY_TO_SHIP` $\rightarrow$ `IN_TRANSIT` $\rightarrow$ `DELIVERED` $\rightarrow$ `RETURNED`.

Founder Command Center menggabungkan status-status ini menjadi **Derived Business State** yang mudah dipahami di dashboard tanpa merusak kemurnian relasi data.

---

## 3. Integritas Finansial & CFO Cost Trilogy

MGBOS menganalisis profitabilitas pesanan menggunakan konsep **Cost Trilogy**:

$$\text{Estimated Cost} \longrightarrow \text{Committed Cost} \longrightarrow \text{Actual Cost}$$

- **Estimated Cost:** HPP taksiran saat menyusun Quotation ke calon pelanggan (harga dasar blanks + estimasi cetak).
- **Committed Cost:** Nilai komitmen saat Purchase Order (PO) resmi diterbitkan ke vendor sablon/garmen.
- **Actual Cost:** Beban riil setelah invoice/tagihan vendor dilunasi beserta biaya defect/rework jika ada.

### Strict Isolation of Pass-Through Logistics:

- **Net Product Revenue** = $\text{Subtotal Produk} - \text{Diskon}$.
- **Dana Titipan Ongkir Kurir (Escrow):** Biaya ongkos kirim kurir (`shipping_fee`) adalah dana talangan murni (net margin = Rp 0). **Dilarang keras memasukkan ongkir kurir ke dalam omset penjualan produk, laba kotor, ataupun margin laba bersih!**
- **Realized Margin %** = $\frac{\text{Net Product Revenue} - \text{Platform Fee} - \text{Total HPP (BOM)}}{\text{Net Product Revenue}} \times 100$.

---

## 4. Transactional Outbox Pattern & Event Envelopes

Untuk menjamin integrasi yang aman dan _idempotent_ dengan n8n, WhatsApp notification, dan AI analytics:

- Setiap perubahan state penting dicatat ke tabel `internal.outbox` dalam transaksi database yang sama (_atomic commit_).
- Worker pengirim event membaca outbox, memverifikasi tanda tangan/idempotency key, lalu meneruskannya ke webhook eksternal.
- AI output atau pesan chat eksternal tidak pernah meng-update database secara langsung tanpa melalui validasi server command yang terotorisasi.

---

## 5. Arsip Sumber Arsitektur Kanonikal

Seluruh cetak biru teknis lengkap tersimpan di direktori `catatan/sesi/`:

- 📄 [[catatan/sesi/2026-09-23 - MultiGraph Business OS v1 — Blueprint Draft 0.1|0.1 Blueprint Draft — North Star & Holding 5 Brand]]
- 📄 [[catatan/sesi/2026-09-23 - MGBOS 0.2 — Canonical Data Model v0.1|0.2 Canonical Data Model — Entity Flow & Cost Trilogy]]
- 📄 [[catatan/sesi/2026-09-23 - MGBOS 0.2.1 Logical Data Model|0.2.1 Logical Data Model — PostgreSQL DDL & BigInt Rules]]
- 📄 [[catatan/sesi/2026-09-23 - MGBOS 0.3 — Business State Machines|0.3 Business State Machines — Isolated Lifecycles]]
- 📄 [[catatan/sesi/2026-09-23 - MGBOS 0.4 — System Architecture v0.1|0.4 System Architecture — Modular Monolith & Outbox]]
