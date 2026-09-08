---
name: dtf-print-ops
description: >-
  Otomasi dan standardisasi operasional cetak apparel DTF (Direct-to-Film) meteran,
  kalkulasi tata letak gang sheet roll (lebar 58 cm), pre-flight file 300 DPI,
  SOP heat press in-house 155°C, dan produksi kemasan pendukung bersama MultiGraph.
  Gunakan saat menyusun layout cetak meteran, validasi file desain sebelum cetak,
  atau memecahkan masalah hasil sablon dan daya rekat lem.
argument-hint: "[gangsheet, heatpress, preflight, or packaging]"
---

# DTF Print Ops — Pre-Press & In-House Production Engine

Skill operasional dan teknis untuk standarisasi sablon DTF (*Direct-to-Film*), penataan layout efisien (*Gang Sheet Nesting*), pengendalian mutu cetak, dan sinergi percetakan kemasan bersama **MultiGraph**.

---

## 1. Spesifikasi Teknis Gang Sheet Roll Meteran (58 cm)

Film DTF roll umumnya memiliki lebar 60 cm dengan **area cetak efektif (*printable area*) sebesar 58 cm**. Penataan layout harus memaksimalkan ruang tanpa membuang film kosong:

```
◄────────────────────────────── 58 cm (Printable Width) ──────────────────────────────►
┌──────────────────────────────┬──────────────────────────────┬──────────────────────┐
│                              │                              │                      │
│       DESAIN A3 UTAMA        │       DESAIN A4 DEPAN        │   LOGO POCKET / TAG  │
│        (28 cm x 40 cm)       │        (20 cm x 28 cm)       │    (9 cm x 9 cm)     │
│                              │                              │                      │
├──────────────────────────────┴──────────────────────────────┴──────────────────────┤
│ ◄- Jarak Antar Desain: Minimal 10 mm (Untuk kemudahan gunting manual tanpa sobek) -►│
├────────────────────────────────────────────────────────────────────────────────────┤
│ BONUS / MULTIGRAPH SPACE: Stiker Vinyl Logo, Segel Polymailer, Hangtag Branded      │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### Rumus Efisiensi Biaya Meteran:
* **Harga Cetak per Meter (100 cm x 58 cm):** Rp 28.000 – Rp 35.000.
* **Kapasitas Rata-rata per 1 Meter:**
  * Bisa memuat **2 pcs Desain A3 Punggung** (28x40 cm) + **2 pcs Logo Dada** (9x9 cm), ATAU
  * **4-5 pcs Desain A4 Dada** (20x28 cm), ATAU
  * **1 Kaos Full Set (A3 + A4) + 12 Stiker Unboxing MultiGraph**.
* **COGS Sablon per Kaos Jadi:**
  * Sablon A3 Punggung + Dada kecil: ~Rp 12.000 – Rp 14.000.
  * Sablon A4 Dada saja: ~Rp 7.000 – Rp 8.500.

---

## 2. Standar Pre-Flight File Desain (Sebelum Kirim ke Vendor)

Setiap file yang akan dicetak pada film DTF harus lolos audit pre-flight berikut:

1. **Resolusi & Dimensi:** Wajib **300 DPI** pada ukuran fisik 1:1 (skala 100%).
2. **Format File:** PNG dengan latar belakang transparan 100% (*Transparent Background*).
3. **Ketebalan Garis Minimum (*Line Weight*):** Minimal **0.5 mm (1.5 pt)**. Garis di bawah 0.5 mm berisiko tidak tertempel serbuk lem panas (*hot-melt adhesive powder*), menyebabkan sablon rontok saat dicuci.
4. **Gradasi Transparansi (*Opacity Feathering*):** Hindari gradasi *fade-to-zero* transparan (seperti efek asap/glow halus). DTF membutuhkan batas piksel tegas karena tinta putih dasar (*white underbase*) tidak bisa mencetak opasitas di bawah 15% dengan rapi.
5. **Mode Warna:** CMYK (untuk akurasi warna mesin cetak) atau sRGB dengan kontras tinggi.

---

## 3. Standard Operating Procedure (SOP) Heat Press In-House

Founder menggunakan mesin heat press pribadi di rumah. Ikuti parameter suhu dan tekanan baku ini:

| Tahap | Aktivitas | Suhu (°C) | Durasi | Tekanan | Alat Pendukung |
|---|---|:---:|:---:|:---:|---|
| **1. Pre-Press** | Menghilangkan kelembapan kain | 155°C | 3–5 detik | Sedang | Alas karet silikon |
| **2. First Press** | Transfer tinta DTF ke garmen | 155°C – 160°C | 15 detik | Berat (4–5 bar) | Kertas teflon di atas film |
| **3. Cooling** | Pendinginan suhu ruang (*Cold Peel*) | Suhu Ruang | 30–60 detik | - | Diamkan di meja datar |
| **4. Peeling** | Mengupas plastik PET film | Dingin | - | Manual | Kupas perlahan sudut 45° |
| **5. Curing Press**| Menanamkan tinta & hilangkan kilap | 155°C | 5–7 detik | Sedang | Kertas teflon / baking paper |

> [!WARNING]
> Jangan pernah mengupas film saat masih panas (*hot peel*), kecuali vendor DTF secara eksplisit menyatakan film tersebut adalah tipe *Instant Hot Peel*. Mengupas film standar saat panas akan merusak lem dan merobek tepian sablon.

---

## 4. Protokol Uji Cuci & Daya Rekat (*Stress Test*)

Sebelum merilis desain baru ke konsumen umum:
1. **Uji Tarik (*Stretch Test*):** Tarik kain melintang secara wajar. Sablon yang berkualitas tidak boleh retak (*cracking*) dan akan kembali ke bentuk semula tanpa deformasi.
2. **Uji Cuci 3 Kali (*Wash Test*):**
   - Cuci dengan mesin cuci atau rendam air sabun normal.
   - Posisi kaos dibalik (*inside-out*).
   - Pastikan sudut-sudut kecil sablon tidak terangkat atau memudar.

---

## 5. Sinergi Kemasan Fisik bersama MultiGraph

Manfaatkan sisa ruang kosong (*dead space*) di sudut-sudut gang sheet DTF atau cetak terpisah bersama **MultiGraph**:

* **Stiker Unboxing Vinyl Die-Cut:** Bonus stiker di setiap pembelian kaos meningkatkan kepuasan unboxing (*unboxing experience*).
* **Hangtag Kaos Tebal (Art Carton 310 gsm):** Menghadirkan kesan distro profesional pada kaos NSA 24s.
* **Segel Polymailer Branded:** Stiker panjang untuk menutup kemasan pengiriman agar terlihat eksklusif dan tahan buka kurir.
