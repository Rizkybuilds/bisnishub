---
name: business-ops-engine
description: >-
  Kelola alur operasional bisnis solopreneur, manajemen inventori hibrida 2-tier
  (Studio buffer vs JIT vendor), state machine antrean pesanan Kanban,
  pembuatan slip kerja dan label pengiriman thermal A6 (100x150 mm),
  serta audit kerugian QC defect. Gunakan untuk merancang alur fulfillment,
  menghitung reorder point, dan mencegah kebocoran margin logistik.
argument-hint: "[inventory, kanban, fulfillment, label, or qc]"
---

# Business Ops Engine — Solopreneur Fulfillment & Supply Chain

Skill operasional untuk mengelola rantai pasok fisik, alur pemenuhan pesanan (*fulfillment*), efisiensi logistik, dan pengendalian mutu (*quality control*) bagi solopreneur dengan kapasitas 1 orang founder.

---

## 1. Arsitektur Inventori Hibrida 2-Tier (Zero Dead-Stock)

Solopreneur tidak boleh mengunci modal kerja pada ratusan variasi kaos polos. Gunakan sistem hibrida 2-tier:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TIER 1: FAST-MOVING BUFFER STUDIO (Kirim H+0 / Hari Ini)                   │
│ • Lokasi: Studio / Rumah Founder                                            │
│ • Model: NSA Heavyweight 24s & Softstyle 30s                                │
│ • Warna Utama: Solid Black & Solid White                                    │
│ • Ukuran: M, L, XL (Buffer 3-6 pcs per SKU)                                 │
│ • Total Stok Mati: ~Rp 1.000.000 - Rp 1.500.000 (Sangat Rendah)             │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ TIER 2: VIRTUAL JIT CITITEX CATALOG (Kirim H+1 s/d H+2)                     │
│ • Lokasi: Gudang Distributor Cititex Terdekat                               │
│ • Cakupan: 1.500+ SKU (Warna warni, 2XL/3XL, Longsleeve, Hoodie)            │
│ • Model: Ditarik hanya saat pesanan dari konsumen sudah berstatus PAID       │
│ • SOP Batching: Pengambilan serentak 1x sehari pukul 15.00 WIB              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Aturan Emas Anti-Bocor Margin Logistik:
> [!CAUTION]
> Margin kotor kaos polos berkisar **Rp 10.000 – Rp 12.000/pcs**. Jika menarik 1 pcs garmen dari distributor menggunakan kurir instan (GoSend/Grab Rp 15.000 – Rp 20.000), margin Anda **langsung minus**.
> 
> **SOP Wajib:** Penarikan Cititex wajib di-*batch* minimal 1x per hari bersamaan dengan pengambilan cetakan roll DTF meteran dari vendor print, atau dikoordinasikan lewat WhatsApp admin cabang.

---

## 2. State Machine Siklus Pesanan (Kanban Pipeline)

Setiap pesanan di sistem harus mengikuti siklus status yang terdefinisi dengan ketat:

```
[PENDING_PAYMENT] ──(QRIS Verified)──> [PAID]
                                          │
                                   (Stok Tersedia?)
                                     ├── Ya ──> [READY_TO_PRESS] (Label: [STOK STUDIO])
                                     └── Tidak ─> [AWAITING_BLANK] (Label: [TARIK CITITEX])
                                                        │
                                                 (Garmen Tiba)
                                                        ▼
                                                [READY_TO_PRESS]
                                                        │
                                                 (Mulai Press)
                                                        ▼
                                                [IN_PRODUCTION]
                                                        │
                                                  (QC Passed?)
                                     ├── Gagal ─> [QC_DEFECT] (Catat ke ts_defects)
                                     └── Lolos ──> [READY_TO_SHIP] (Generate Label A6)
                                                        │
                                                  (Drop Kurir)
                                                        ▼
                                                    [SHIPPED]
                                                        │
                                                 (Diterima User)
                                                        ▼
                                                   [COMPLETED]
```

---

## 3. Standar Label Pengiriman Thermal A6 (100 x 150 mm)

Format cetak label wajib kompatibel dengan printer thermal Bluetooth/USB (ekstensi resolusi 203 DPI standard):

### Elemen Wajib Label:
1. **Header Pengirim:**
   - Default: `TeeStock Studio — (+62 812-xxxx-xxxx)`
   - *Toggle White-Label Dropship:* `[Nama Toko Mitra] — [No WA Mitra]`
2. **Barcode Resi / Order ID:** Code128 format visual resolusi tinggi.
3. **Penerima:** Nama Lengkap, Nomor HP aktif, Alamat Lengkap, Kode Pos.
4. **Manifest Ringkas Item (Work Slip):**
   - Contoh: `[TS-ORIG-01] NSA 24s Black - Size L (1 pcs) | [SAB-DTF-A3]`
5. **Instruksi Kurir:** *"APAREL / JANGAN DIBANTING / SIMPAN DI TEMPAT KERING"*.

---

## 4. Protokol Pengendalian Mutu & Audit Defect (`ts_defects`)

Setiap reject yang terjadi dalam proses in-house press harus dicatat agar tidak terjadi kebocoran laba tersembunyi:

| Jenis Cacat | Penyebab Utama | Solusi & Penanganan | Biaya Kerugian (HPP) |
|---|---|---|---|
| **Sablon Mengelupas** | Suhu press <155°C atau kupas sebelum dingin (*hot peel*) | Kaos dijadikan sampel internal / uji cuci pribadi | Kaos (Rp 38k) + DTF (Rp 10k) |
| **Kain Hangus / Mengkilap** | Finishing press tanpa teflon sheet / durasi >10 detik | Jadikan lap studio atau evaluasi pressure | Kaos (Rp 38k) |
| **Salah Posisi / Miring** | Peletakan film DTF tanpa penggaris panduan dada | Kaos diskon 50% di kategori clearance sale | DTF (Rp 10k) |
| **Reject Bahan dari Vendor** | Jahitan bolong / noda minyak dari distributor | Klaim retur ke Cititex (Garansi 100% ganti baru) | Rp 0 (Klaim Vendor) |

### Format Pencatatan Database:
```sql
INSERT INTO ts_defects (order_id, sku, defect_type, cogs_loss, notes)
VALUES ('ord-12345', 'NSA-24S-BLK-L', 'PET_PEEL_FAILURE', 48000, 'Kupas terlalu cepat sebelum suhu ruang');
```

---

## 5. Alokasi Waktu Harian Solopreneur (Time-Boxing)

Untuk mencegah founder kelelahan (*burnout*) mengelola 3 bisnis sekaligus:

* **08.00 – 09.30 (CS & Batching):** Verifikasi pembayaran QRIS, susun daftar tarikan Cititex & roll DTF.
* **10.00 – 11.30 (Logistik Eksternal):** Tarik kaos Cititex & ambil hasil cetak DTF roll meteran.
* **13.00 – 15.30 (Produksi In-House):** Heat press mandiri, quality check, tempel hangtag & packing polymailer.
* **16.00 – 17.00 (Drop Kurir):** Antar paket ke gerai J&T / SPX / Anteraja.
* **19.30 – 21.00 (Strategi & Konten):** Analisis stok, balas chat reseller, posting konten TikTok/Reels.
