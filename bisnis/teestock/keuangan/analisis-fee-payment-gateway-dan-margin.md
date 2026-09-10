# Analisis Dampak Biaya Payment Gateway Terhadap Margin & Unit Economics TeeStock

> Dokumen analisis finansial dari **CFO (Chief Financial Officer)** untuk mengawal profitabilitas, struktur harga, dan pencegahan kebocoran kas akibat biaya transaksi pembayaran di TeeStock (`bisnis/teestock/web`).

---

## 1. Unit Economics & Struktur HPP Dasar

Sebelum menilai potongan pihak ketiga, berikut acuan Harga Pokok Penjualan (HPP) aktual TeeStock (per September 2026):

| Lini Produk | Harga Jual Ritel | HPP Produksi* | Gross Profit (Rp) | Gross Margin (%) |
|---|:---:|:---:|:---:|:---:|
| **Kaos Grafis NSA 24s (Drop #01)** | Rp 99.000 | Rp 62.500 | **Rp 36.500** | **36,8%** |
| **Kaos Grafis Promo Launch** | Rp 89.000 | Rp 62.500 | **Rp 26.500** | **29,7%** |
| **Kaos Polos NSA 7200 (Warna)** | Rp 52.000 | Rp 42.000 | **Rp 10.000** | **19,2%** |
| **Kaos Polos NSA 3600 (Putih)** | Rp 34.000 | Rp 29.000 | **Rp 5.000** | **14,7%** |
| **Paket Duo Kaos Grafis (Bundle)** | Rp 180.000 | Rp 125.000 | **Rp 55.000** | **30,5%** |

*\*Rincian HPP Kaos Grafis: Garmen NSA 24s Rp 42.000 + Sablon DTF A3 Rp 12.500 + Jasa Press In-House Rp 5.000 + Packaging Polymailer & Stiker Rp 2.000 + Listrik Overhead Rp 1.000.*

---

## 2. Simulasi & Komparasi Beban Biaya Transaksi

### Skenario 1: Penjualan 1 pcs Kaos Grafis Ritel (Rp 99.000)
| Metode Pembayaran | Biaya Gateway | Kas Bersih Diterima | Net Profit | Gerusan Profit (%) |
|---|:---:|:---:|:---:|:---:|
| **Manual Transfer + Kode Unik** | Rp 0 | Rp 99.000 | **Rp 36.500** | 0% (Utuh) |
| **QRIS Midtrans (0,7%)** | **Rp 693** | Rp 98.307 | **Rp 35.807** | **-1,9%** |
| **Virtual Account (Rp 4.000 flat)** | **Rp 4.440\*** | Rp 94.560 | **Rp 32.060** | **-12,2%** |
| *Marketplace Shopee (~12%)* | *Rp 11.880* | *Rp 87.120* | *Rp 24.620* | *-32,5%* |

*\*Termasuk PPN 11% atas jasa keuangan = Rp 4.440.*

---

### Skenario 2: Penjualan 1 pcs Kaos Polos NSA 7200 (Rp 52.000) — *Zona Merah Margin!*
| Metode Pembayaran | Biaya Gateway | Kas Bersih Diterima | Net Profit | Gerusan Profit (%) |
|---|:---:|:---:|:---:|:---:|
| **Manual Transfer + Kode Unik** | Rp 0 | Rp 52.000 | **Rp 10.000** | 0% (Utuh) |
| **QRIS Midtrans (0,7%)** | **Rp 364** | Rp 51.636 | **Rp 9.636** | **-3,6%** |
| **Virtual Account (Rp 4.000 flat)** | **Rp 4.440\*** | Rp 47.560 | **Rp 5.560** | **-44,4%! ⚠️** |

> [!CAUTION]
> **Temuan Kritis CFO:**
> Pada penjualan kaos polos satuan yang memiliki margin tipis (Rp 10.000), potongan flat **Virtual Account Rp 4.440 memangkas 44,4% keuntungan bersih**. Jika solopreneur menyerap biaya ini tanpa aturan, bisnis hanya menjadi "kerja bakti" untuk payment gateway.

---

### Skenario 3: Penjualan Paket Bundling 2 pcs Kaos (Rp 180.000)
| Metode Pembayaran | Biaya Gateway | Kas Bersih Diterima | Net Profit | Gerusan Profit (%) |
|---|:---:|:---:|:---:|:---:|
| **Manual Transfer + Kode Unik** | Rp 0 | Rp 180.000 | **Rp 55.000** | 0% (Utuh) |
| **QRIS Midtrans (0,7%)** | **Rp 1.260** | Rp 178.740 | **Rp 53.740** | **-2,3%** |
| **Virtual Account (Flat)** | **Rp 4.440** | Rp 175.560 | **Rp 50.560** | **-8,1%** |

---

## 3. Kebijakan Finansial & Aturan Eksekusi (CFO Directives)

Untuk memaksimalkan konversi pembeli sekaligus mengamankan margin solopreneur, terapkan 3 pilar kebijakan berikut:

### 1. Kebijakan QRIS (0,7% MDR) — "Wajib Diaktifkan & Diserap 100%"
- Biaya Rp 693 pada kaos grafis sangat layak diserap demi menghilangkan friksi konversi dan menghemat 10 menit waktu admin untuk cek rekening manual.
- Tampilkan QRIS sebagai opsi pembayaran *default* (teratas) di layar checkout.

### 2. Kebijakan Virtual Account (Rp 4.440 Flat) — "Terapkan Threshold atau Convenience Fee"
- **Opsi A (Rekomendasi Utama):** Bebankan biaya layanan Rp 4.000 langsung ke pembeli yang memilih VA, dengan microcopy edukatif:
  > *"Gunakan QRIS untuk Bebas Biaya Layanan (Hemat Rp 4.000) — Bisa scan dari semua m-Banking & e-Wallet."*
- **Opsi B (Threshold Nilai Belanja):** Biaya VA diserap oleh TeeStock hanya jika total keranjang belanja $\ge$ **Rp 150.000** (pembelian $\ge 2$ pcs kaos).
- **Opsi C:** Matikan opsi VA pada peluncuran awal dan andalkan QRIS dinamis.

### 3. Arbitrase Margin: Web Direct vs Marketplace
- Setiap transaksi yang berhasil dialihkan dari Shopee ke Website Resmi TeeStock menghasilkan tambahan kas bersih sebesar **+Rp 11.187 per potong kaos**.
- Dana penghematan ini dapat dialokasikan kembali untuk voucher diskon pembeli (`WELCOME10`) atau insentif kemasan unboxing viral.

---

## 4. Checklist Keputusan Finansial

- [x] Evaluasi HPP aktual garmen NSA dan DTF in-house.
- [x] Simulasi gerusan margin QRIS vs Virtual Account.
- [ ] Daftarkan akun merchant Midtrans dengan fokus utama aktivasi QRIS.
- [ ] Setel aturan biaya layanan Rp 4.000 untuk VA pada transaksi di bawah Rp 150.000 di web checkout.
- [x] Pertahankan sistem Transfer Manual dengan 3-digit kode unik untuk pesanan partai/B2B (0% fee).
