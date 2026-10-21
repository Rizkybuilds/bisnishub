---
canonical_id: proposed.mgbos.product.teestock-customer-platform.cx-s0-drop-01-assisted-intake
status: DRAFT
version: 1.0.0
owner: Rizky
author: ChatGPT / AI Co-Founder & Product Strategy
approver: PENDING_OWNER_APPROVAL
scope: teestock-customer-platform-s0-assisted-intake-prd
document_class: product-requirements
normative_authority: PROPOSED_PRODUCT_CONTRACT
product_program: TEESTOCK_COMMERCE_PILOT
product_maturity: READY_FOR_ENGINEERING_DISCOVERY
engineering_readiness: READY_FOR_IMPLEMENTATION_CONTRACT
implementation_status: PRODUCT_SPECIFICATION_ONLY
repository: Rizkybuilds/bisnishub
repository_branch: main
created: 2026-10-21
effective_from: 2026-10-21
depends_on:
  - cx-01-master-prd.md
  - cx-03-experience-design-interaction-spec.md
  - cx-04-commerce-checkout-experience.md
  - ../../../../../bisnis/teestock/03-commerce/drop-01-commercial-pilot-spec.md
  - CX-PKG-DECISIONS-R1.md
---

# TeeStock CX-S0 — Drop 01 Assisted Commerce & WhatsApp Intake PRD v1.0

> [!abstract] **Customer Platform S0 Delivery Slice PRD**  
> Dokumen ini mendefinisikan kebutuhan fungsional antarmuka web (_storefront UI_), kontrak pemesanan terbimbing (_assisted checkout_), dan integrasi _deep-link_ WhatsApp untuk peluncuran **Drop 01 (November 2026)**. Spesifikasi ini menyelesaikan keputusan tertunda `CX-DP-02` (Public Intake Scope), `CX-DP-03` (Sellable Offer), dan `CX-DP-04` (Pricing & Lead-Time Claims).

---

## 1. Product Objectives & User Problem

### User Problem

Pengunjung situs web TeeStock tertarik membeli kaos kurasi Drop 01, tetapi sistem _payment gateway_ dan akun pelanggan otomatis belum aktif. Pengunjung membutuhkan cara cepat, aman, dan tanpa hambatan untuk memesan artikel dan ukuran yang diinginkan langsung ke pengelola _brand_.

### Founder / Business Problem

_Founder_ ingin menguji konversi penjualan nyata tanpa harus menghabiskan waktu berminggu-minggu membangun arsitektur checkout otomatis, rekening escrow, atau integrasi pihak ketiga yang kompleks. Namun, pemesanan lewat chat tidak boleh memicu pertanyaan berulang yang melelahkan _founder_.

### Target Solution

Tombol aksi utama (_Primary CTA_) pada halaman produk `/shop/[slug]` yang menghasilkan **tautan otomatis (_deep-link_) WhatsApp** dengan format pesan terstruktur yang telah terisi data spesifik produk, warna, dan ukuran yang dipilih oleh pelanggan.

---

## 2. Resolusi Keputusan Kunci (`CX-PKG-DECISIONS-R1`)

| Keputusan ID   | Topik                        | Resolusi Resmi untuk Drop 01                                                                                          | Justifikasi / Batasan Keamanan                                                                         |
| :------------- | :--------------------------- | :-------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| **`CX-DP-02`** | **Public Intake Scope**      | **Structured WhatsApp Deep-Link Only.** Tidak ada formulir form web kompleks, pendaftaran akun, atau simpan password. | Mengeliminasi beban maintenance auth database dan memastikan interaksi personal dengan pelanggan awal. |
| **`CX-DP-03`** | **Sellable Launch Offer**    | Terbatas ketat pada **4 Artikel Resmi Drop 01** yang didefinisikan dalam `TS-COM-006` (ukuran M, L, XL, XXL).         | Mencegah janji fiktif atau pesanan kaos di luar kapasitas pasokan vendor.                              |
| **`CX-DP-04`** | **Price & Lead-Time Claims** | Harga transparan **Rp149.000** (Drop Price). Lead time: _"Diproses dalam 24–48 jam kerja"_.                           | Melindungi ekspektasi pembeli; tidak menjanjikan pengiriman _same-day_.                                |

---

## 3. Spesifikasi Fungsional UI Storefront (`/shop` & `/shop/[slug]`)

### A. Komponen Pilihan Varian pada PDP (`ProductDetailViewer.tsx`)

1. **Pemilihan Warna:** Pilihan warna radio/chip visual (_Pitch Black_ & _Vintage Cream_).
2. **Pemilihan Ukuran:** Pilihan ukuran (M, L, XL, XXL) dengan indikator panduan ukuran pop-up (_Size Chart modal_).
3. **Indikator Ketersediaan:** Menampilkan status _"Tersedia untuk Drop 01"_ atau _"Habis"_ (dinonaktifkan jika stok kosong).

### B. Spesifikasi Tombol Primary CTA

- **Label Tombol:** `Beli via WhatsApp (Assisted Checkout)`
- **Ikon:** Ikon resmi WhatsApp di samping teks.
- **Status Disable:** Tombol dinonaktifkan (_disabled_) jika pengguna belum memilih ukuran (_size_).
- **Aksi Klik:** Membuka URL `https://wa.me/{WHATSAPP_NUMBER}?text={ENCODED_MESSAGE}` pada tab baru (`target="_blank" rel="noopener noreferrer"`).

### C. Formula Pembentukan URL Deep-Link

```typescript
function generateWhatsAppOrderUrl(params: {
  productTitle: string;
  sku: string;
  color: string;
  size: string;
  priceFormatted: string;
}): string {
  const adminPhone = '628xxxxxxxxxx'; // Nomor WhatsApp Bisnis Terdaftar
  const message =
    `Halo TeeStock! Gue mau pesan dari koleksi Drop 01:\n\n` +
    `• Artikel: ${params.productTitle} (${params.sku})\n` +
    `• Warna: ${params.color}\n` +
    `• Ukuran: ${params.size}\n` +
    `• Harga: ${params.priceFormatted}\n\n` +
    `Data Pengiriman:\n` +
    `• Nama Penerima: \n` +
    `• No. WhatsApp: \n` +
    `• Alamat Lengkap: \n` +
    `• Kecamatan & Kota: \n` +
    `• Kode Pos: \n\n` +
    `Mohon info total ongkir dan instruksi transfernya ya!`;

  return `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
}
```

---

## 4. Kriteria Kualitas & Aksesibilitas (CX-08 Alignment)

- **Contrast Ratio:** Teks tombol CTA memenuhi rasio kontras minimal 4.5:1 terhadap latar belakang (WCAG 2.1 AA).
- **Tap Target Size:** Ukuran area sentuh tombol minimal 48 x 48 px untuk kenyamanan pengguna perangkat bergerak (_mobile-first_).
- **Keyboard Navigability:** Pilihan ukuran dan tombol order dapat diakses dan diaktifkan sepenuhnya menggunakan tombol `Tab` dan `Enter/Space`.
- **Zero Telemetry Leaks:** Tidak ada data pribadi pelanggan (nomor telepon/alamat) yang disimpan ke _local storage_ atau diunggah ke pihak ketiga di luar WhatsApp.

---

## 5. Rencana Transisi ke Automated Checkout (Phase CX-S1)

Sistem _Assisted WhatsApp Commerce_ ini beroperasi sebagai jembatan sementara (_bridge phase_). Transisi ke _Automated Checkout_ (Keranjang + Payment Gateway Midtrans/Xendit) baru akan diotorisasi jika:

1. Batch perdana (Drop 01) berhasil memenuhi target 30–50 pesanan.
2. Tingkat kepuasan pembeli (_positive feedback rate_) mencapai ≥ 90%.
3. Badan usaha / rekening operasional resmi telah siap menampung pembayaran otomatis.

---

**Kepemilikan Dokumen:** `systems/mgbos/docs/product/teestock-customer-platform/`  
**Hubungan Implementasi:** Memandu pembuatan komponen `ProductDetailViewer` & tombol WhatsApp di aplikasi `systems/mgbos/apps/teestock`.
