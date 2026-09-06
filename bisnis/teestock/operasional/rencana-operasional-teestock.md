# Rencana Operasional & Model Bisnis — TeeStock

Dokumen ini melengkapi analisis bisnis dan brand guide sebelumnya dengan detail rantai pasok, model produksi, struktur channel, dan lini bisnis TeeStock berdasarkan keputusan terbaru.

---

## 1. Rantai Pasok & Model Produksi (Aktual September 2026)

### 1.1 Sumber Bahan (Blank Apparel)

**Vendor utama:** New States Apparel (NSA) via Cititex — varian utama **NSA Heavyweight 24s** (impor premium, tubular tanpa jahitan samping) dan opsi **NSA Softstyle 30s**.
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

### 1.4 Model Hybrid Inventory: Buffer Studio vs JIT Cititex Network

Sebagai solopreneur dengan modal dan kapasitas gudang terbatas di rumah, TeeStock menerapkan **arsitektur persediaan hibrida 2-tier** agar dapat menjual seluruh katalog apparel New States Apparel (NSA) hingga 1.500+ variasi SKU tanpa risiko mati modal (*dead stock*):

1. **Tier 1: Buffer Stock Studio (Fast-Moving, Kirim H+0 / Hari Ini):**
   - **Lokasi:** Lemari/rak stok di rumah/studio founder.
   - **SKU Terbatas:** Hanya menyimpan kaos terpopuler: **Hitam & Putih** untuk model **NSA Heavyweight 24s** dan **NSA Softstyle 30s** dalam ukuran **M, L, dan XL** (buffer 3–6 pcs per SKU).
   - **SLA Pelanggan:** Siap press dan langsung dikirim di hari yang sama (*Same-Day / Next-Day*).
2. **Tier 2: Virtual Catalog / Just-in-Time (JIT) Cititex Network (Kirim H+1 s/d H+2):**
   - **Cakupan:** Seluruh spektrum warna (Maroon, Forest Green, Navy, Mustard, Lilac, dll.), ukuran khusus (S, XXL, 3XL), kaos lengan panjang (*Longsleeve*), Hoodie, Raglan, dan Polo NSA.
   - **Status di Web:** Tampil sebagai *Ready Stock Gudang Pusat* sehingga pembeli tidak ragu memesan.
   - **Alur Penarikan:** Begitu pesanan masuk, sistem admin menandai pesanan dengan badge `[TARIK CITITEX]`.
3. **SOP Batching Pengambilan & Efisiensi Biaya:**
   - **Kalkulasi Unit Economics:** Margin blank apparel murni adalah tipis (Rp 10.000 – Rp 12.000). Jika founder menarik 1 kaos memakai GoSend/GrabExpress (Rp 15.000 – Rp 20.000), margin akan langsung minus (*bocor*).
   - **Solusi Batching:** Pengambilan garmen ke cabang Cititex dilakukan **sekaligus 1x sehari** di jam operasional sore hari, bersamaan dengan rute pengambilan cetakan film DTF roll meteran dari vendor print, atau dikoordinasikan via WhatsApp admin cabang Cititex terdekat.
   - **Manifest Otomatis Web App:** Dashboard Admin (`/admin/kanban`) dilengkapi tombol **"Tarik Cititex"** yang mengelompokkan kebutuhan garmen harian per model/warna/ukuran dan menyediakan generator teks WhatsApp siap kirim ke kasir Cititex.

---

## 2. Struktur Channel Penjualan

| Channel | Peran utama |
|---|---|
| **Shopee** | Volume & pencarian — andalan utama untuk katalog Stock & Blanks |
| **TikTok Shop** | Akuisisi lewat konten & FYP — bagus untuk video proses press & ASMR peel |
| **Blibli** | Kepercayaan & segmen pembeli yang lebih mengutamakan platform "resmi/terpercaya" |
| **Website sendiri (`teestock.vercel.app`)** | Pusat operasional: penjualan Blanks NSA, Custom Order, pendaftaran Partner/Reseller, dan Hub Admin |

**Catatan penting:** website berfungsi ganda sebagai *storefront ritel* dan *tools operasional*, dilengkapi kalkulator HPP otomatis, gang sheet layout DTF, dan manifest logistik internal.

---

## 3. Arsitektur Operasional: TeeStock Originals, Blanks & Studio

Sesuai pembaruan arah bisnis dan arsitektur web aplikasi, operasional dibagi menjadi tiga pilar:

### A. Sayap Ritel: TeeStock Originals (The Drop Model)
* **Karakter:** Rilis berkala per edisi/kapsul (*The Drop Model*), bukan koleksi massal kaku. Dimulai dari kurasi beberapa desain pilihan yang estetik dan disukai pasar tanpa memaksakan sekat kategori kaku di awal sebelum ada validasi pembeli.
* **Alur Produksi:** Cetak film DTF meteran sekaligus saat pesanan terkonfirmasi, press mandiri menggunakan mesin in-house.
* **Penyimpanan:** Memanfaatkan buffer kaos polos di studio.

### B. Sayap Blanks: Reseller & Dropship NSA Resmi
* **Katalog Lengkap:** Menjual kaos polos New States Apparel original (24s Heavyweight, 30s Softstyle, Ringer, Longsleeve) secara eceran dan lusinan.
* **Upsell Custom DTF (+Rp 25.000):** Setiap halaman produk kaos polos dilengkapi banner rekomendasi instan untuk langsung mengubah pesanan menjadi kaos sablon kustom (mengarahkan otomatis ke `/custom-order?blank=SKU`).

### C. Sayap Layanan & Kemitraan: TeeStock Studio
Sayap ini menangkap peluang non-retail dengan 3 sub-layanan yang diaktifkan bertahap:

1. **Custom Order Studio (Mulai Fase 2):**
   * Menerima pesanan kaos custom satuan maupun komunitas via WhatsApp / Google Form.
   * Alur: Konsultasi desain -> Pembayaran DP 50% / Lunas -> Finalisasi preview mock-up (maksimal 2x revisi) -> Heat press & QC -> Kirim.
   * Sinergi: Desain custom yang terbukti viral dapat dinegosiasikan untuk masuk ke katalog kurasi Originals.

2. **Creator Merch Collab (Mulai Fase 2):**
   * Kerja sama merchandise resmi dengan kreator/seniman lokal tanpa modal dari creator.
   * Model *revenue sharing* dari margin bersih (50/50). Produksi dijalankan secara pre-order atau on-demand.

3. **Partner & Dropship Network (Aktif & Live di Web):**
   * Memberikan dua tier harga mitra transparan:
     - **Tier Dropship:** Rp 75.000 (satuan white-label, resi otomatis marketplace atas nama toko mitra).
     - **Tier Reseller:** Rp 65.000 (min 12 pcs, modal stok distro/komunitas lokal).
   * Menjaga margin pertumbuhan bisnis solopreneur tetap di atas target minimal 10% dari HPP.

---

## 4. Tahapan Pengembangan (Roadmap 4 Fase)

Tahapan eksekusi lengkap, indikator keberhasilan (*exit criteria*), dan pembagian waktu solopreneur telah dirinci dalam dokumen tersendiri:
👉 [**`roadmap-pengembangan-teestock.md`**](file:///c:/Users/Rizky/ai-mentor-bisnis/bisnis/teestock/operasional/roadmap-pengembangan-teestock.md)

| Fase | Fokus & Sasaran |
|---|---|
| **Fase 1 (Bulan 1)** | Proof of Quality & Launch Originals (Drop #01), SOP press, 10 ulasan bintang 5 pertama |
| **Fase 2 (Bulan 2)** | The Concierge Studio: Pilot 1 kolaborasi creator mikro & SOP custom order |
| **Fase 3 (Bulan 3–4)** | Partner & Dropship Network: Rekrut 10 dropshipper aktif, reseller media kit |
| **Fase 4 (Bulan 5+)** | Sinergi MultiGraph: Cetak kemasan in-house, ekspansi totebag & merchandise non-kaos |

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
