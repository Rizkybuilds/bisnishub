# Rencana Operasional & Model Bisnis — TeeStock

Dokumen ini melengkapi analisis bisnis dan brand guide sebelumnya dengan detail rantai pasok, model produksi, struktur channel, dan lini bisnis TeeStock berdasarkan keputusan terbaru.

---

## 1. Rantai Pasok & Model Produksi (Aktual September 2026)

### 1.1 Sumber Bahan (Blank Apparel)

**Vendor utama:** New States Apparel (NSA) via Cititex — varian utama **NSA Heavyweight 24s** (original Cititex, tubular tanpa jahitan samping) dan opsi **NSA Softstyle 30s**.
* **Harga Beli:** Rp 37.000 (grosir min 72 pcs) hingga Rp 42.000 (ritel satuan).
* **Status Fisik:** Sampel fisik kaos NSA 24s sudah dipegang langsung oleh founder dan lulus verifikasi ketebalan serta fitting garmen.

**Antisipasi:** Simpan kontak cadangan (Doxa Apparel / Gildan Hammer) jika Cititex mengalami kekosongan ukuran L/XL warna hitam.

### 1.2 Proses Cetak: DTF Roll Meteran + Mesin Heat Press In-House

* **Cetak Film:** Membeli film DTF roll meteran (Rp 28.000 – Rp 35.000 / meter).
* **Eksekusi Press:** **Dilakukan sendiri di rumah menggunakan mesin heat press pribadi milik founder**.
* **Keunggulan Kompetitif:**
  - **Efisiensi Biaya:** Mengeliminasi biaya ongkos press vendor (menghemat Rp 5.000 – Rp 7.000 per kaos).
  - **Kontrol Kualitas 100%:** Penentuan suhu (155°C), durasi (15 detik), tekanan presisi, dan finishing teflon dikerjakan mandiri tanpa risiko kecerobohan pihak ketiga.
  - **SLA Cepat (H+0 / H+1):** Pesanan yang masuk pagi bisa langsung dipress siang hari dan dikirim sore tanpa menunggu antrean vendor sablon.

### 1.3 SOP Heat Press Baku (NSA 24s & DTF)

1. **Pre-press:** Press kaos polos kosong selama 3–5 detik pada suhu 155°C untuk menghilangkan kelembapan serat katun.
2. **First Press:** Letakkan film DTF, press dengan tekanan medium-heavy selama 15 detik pada suhu 155°C – 160°C.
3. **Cooling (Cold Peel):** Diamkan hingga plastik PET film benar-benar dingin sebelum dikupas perlahan dari sudut ke sudut.
4. **Finishing Press (Curing):** Tutup sablonan dengan kertas teflon / baking paper, press kembali selama 5–7 detik untuk menanamkan tinta ke dalam pori-pori kain dan menghilangkan kilap plastik berlebih.
5. **Quality Check & Fold:** Periksa kerataan rekat lem pada sudut sablon, lipat rapi, dan masukkan ke polymailer dengan stiker segel TeeStock.

### 1.4 Model Hybrid Inventory & Smart Multi-Hub Routing

Sebagai solopreneur dengan modal dan kapasitas gudang terukur, TeeStock menerapkan **arsitektur persediaan hibrida 2-tier dan sistem logistik multi-hub**:

1. **Tier 1: Buffer Stock Studio (Fast-Moving, Kirim H+0 / Hari Ini):**
   - **Lokasi:** Lemari/rak stok di Central Studio (Citayam Hub).
   - **SKU Terbatas:** Kaos terpopuler: **Hitam & Putih** untuk model **NSA Heavyweight 24s** dan **NSA Softstyle 30s** dalam ukuran **M, L, dan XL** (buffer 3–6 pcs per SKU).
   - **SLA Pelanggan:** Siap press dan langsung dikirim di hari yang sama (*Same-Day / Next-Day*).
2. **Tier 2: Virtual Catalog / Just-in-Time (JIT) Network (Kirim H+1 s/d H+2):**
   - **Cakupan:** Seluruh spektrum warna (Maroon, Forest Green, Navy, Mustard, Lilac, dll.), ukuran khusus (S, XXL, 3XL), Longsleeve, Hoodie, Raglan, dan Polo NSA.
   - **Status di Web:** Tampil sebagai *Ready Stock Gudang Pusat*.
3. **Logika Smart Multi-Hub Routing:**
   - **Skenario A (Order Kaos Polos Saja — Area Bogor/Jabodetabek):**
     * Pengiriman langsung di-route dari **TeeStock Satellite Hub (Bogor)** via jaringan distributor/Cititex Bogor.
     * Mengaktifkan opsi kurir Instant/Same-Day (GoSend/Grab/Paxel) dengan ongkir lebih murah dan waktu tempuh hitungan jam.
   - **Skenario B (Order Katalog Desain Originals atau Custom Atelier):**
     * Pengiriman wajib diproses dari **TeeStock Central Studio (Citayam Hub)** karena memerlukan proses heat press 155°C, quality control, dan finishing *unboxing packaging*.
   - **Skenario C (Order Campuran: Kaos Polos + Kaos Desain):**
     * Seluruh pesanan dikonsolidasikan dan dikirim bersamaan dari **TeeStock Central Studio (Citayam Hub)**. Bahan ditarik melalui batching harian sore hari, sehingga pembeli hanya membayar satu kali ongkir normal.
4. **Standardisasi Identitas Pengiriman (Label Resi Thermal A6):**
   - Menghindari label tidak profesional seperti "inhome" atau nama pribadi.
   - **Pesanan Sablon/Custom:** Pengirim tercetak resmi sebagai **"TeeStock Central Studio — Citayam"** (Tugu Macan Citayam, Kab. Bogor / Depok).
   - **Pesanan Blanks Polos:** Pengirim tercetak resmi sebagai **"TeeStock Fulfillment Hub — Bogor"**.

---

## 2. Struktur Channel Penjualan

| Channel | Peran Utama & Karakter |
|---|---|
| **Website Utama (`teestock.id` / `teestock.vercel.app`)** | Storefront ritel resmi (B2C Flagship): etalase Drop Originals, katalog NSA Blanks, studio Custom Atelier, dan bio-link terintegrasi. Bersih dari banner grosir/reseller. |
| **Marketplace (Shopee & TikTok Shop)** | Kanal volume & akuisisi — etalase rilis Drop #01 dan katalog Kaos Polos resmi, didukung konten video proses heat press in-house (ASMR peel). |
| **WhatsApp CS Direct** | Konsultasi personal pemesanan Custom Atelier satuan/komunitas dan penanganan garansi 100%. |
| **Subdomain Kemitraan (`mitra.teestock.id` — Fase 2)** | Dedicated portal khusus reseller dan dropshipper terverifikasi dengan login terisolasi dan harga grosir transparan. |

---

## 3. Arsitektur Operasional: 3 Pilar Ritel B2C

Operasional storefront publik `teestock.id` sepenuhnya fokus melayani konsumen retail melalui 3 pilar:

### A. Pilar 1: TeeStock Originals (The Drop Model)
* **Karakter:** Rilis grafis tematik berkala per batch/kapsul (**Drop #01: "RAW IDENTITY"**). Kuota batch terbatas (24 pcs) untuk menjaga eksklusivitas.
* **Alur Produksi:** Cetak film DTF meteran 300 DPI -> Heat press in-house 155°C (15 detik press + 5 detik curing teflon) -> QC lem -> Finishing unboxing (Polymailer doff + Stiker seal + Kartu Garansi + Stiker bonus).
* **Harga Ritel:** Rp 99.000 (Anchor Price Rp 139.000).

### B. Pilar 2: TeeStock Blanks (Official NSA Blanks)
* **Katalog Lengkap:** Menjual kaos polos New States Apparel original (24s Heavyweight & 30s Softstyle) secara eceran.
* **Smart Fulfillment:** Pengiriman instan melalui Satellite Hub Bogor atau buffer Central Studio Citayam.
* **Upsell Custom DTF (+Rp 25.000):** Banner interaktif di setiap halaman produk polos untuk mengubah order menjadi kaos custom kustom dengan 1 klik.

### C. Pilar 3: TeeStock Atelier (Custom Print Lab Satuan)
* **Karakter:** Layanan cetak custom satuan tanpa batas minimal order untuk kreator, musisi lokal, perorangan, atau komunitas.
* **Alur Pemesanan:** Konsultasi desain via WhatsApp -> Simulasi mockup digital -> Pembayaran lunas / DP 50% -> Cetak DTF & heat press in-house di Citayam Studio -> Kirim via kurir ekspedisi.
* **Harga:** Rp 119.000 – Rp 139.000 per pcs.

---

## 4. Tahapan Pengembangan (Roadmap 4 Fase)

Tahapan eksekusi lengkap, indikator keberhasilan (*exit criteria*), dan pembagian waktu solopreneur telah dirinci dalam dokumen:
👉 [**`roadmap-pengembangan-teestock.md`**](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/operasional/roadmap-pengembangan-teestock.md)

| Fase | Fokus & Sasaran Utama |
|---|---|
| **Fase 1 (Bulan 1 — Current)** | 100% Fokus Ritel B2C: Launch Drop #01, Kaos Polos NSA, Custom Atelier via Central Studio Citayam & Satellite Hub Bogor, 10–20 pembeli pertama. |
| **Fase 2 (Bulan 2–3)** | Peluncuran Portal Kemitraan `mitra.teestock.id`: Portal login terpisah untuk reseller/dropship tanpa mengorbankan prestige harga ritel Rp 99.000 di toko utama. |
| **Fase 3 (Bulan 4–5)** | Sinergi MultiGraph: Cetak perlengkapan unboxing in-house (stiker laminasi, segel kemasan, kartu garansi), ekspansi totebag canvas & merch komunitas. |
| **Fase 4 (Bulan 6+)** | Multi-Tenant Partner Web Builder: Solusi storefront mandiri berdomain khusus untuk mitra skala besar (>20 mitra aktif). |


---

## 5. Risiko Tambahan dari Model Operasional Ini

| Risiko | Mitigasi |
|---|---|
| Kapasitas produksi terbatas (1 mesin, 1 orang) jadi bottleneck saat Stock + Custom jalan bersamaan | Tentukan kuota harian/mingguan realistis, komunikasikan estimasi waktu produksi dengan jujur ke customer |
| Ketergantungan 1 vendor blank apparel | Simpan kontak vendor cadangan meski belum dipakai |
| Kualitas press tidak konsisten tanpa SOP | Buat SOP tertulis (suhu/tekanan/durasi per jenis bahan) sejak awal |
| Custom order bermargin tipis kalau harga tidak dihitung dengan benar | Tentukan harga dasar & minimum sebelum mulai menerima order, jangan menentukan harga on-the-spot |
| Website belum ada traffic tapi sudah jadi tumpuan Custom Order/Reseller | Arahkan traffic ke website dari bio/link di marketplace dan sosial media sejak awal, meski penjualan utama tetap di marketplace |

---

*Dokumen ini melengkapi `analisis-bisnis-teestock.md`, `brand-guide-teestock.md`, dan `daftar-niche-teestock.md` sebagai satu set rencana bisnis TeeStock.*
