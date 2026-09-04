# Analisis Kebutuhan Website/Aplikasi — TeeStock

Dokumen ini menganalisis kebutuhan fitur, UI/UX, dan arsitektur teknis website TeeStock, berdasarkan peran website yang sudah ditetapkan di `rencana-operasional-teestock.md`: bukan cuma etalase jualan, tapi juga pusat operasional untuk Custom Order dan (nanti) Reseller/Member.

---

## 1. Peran Website dalam Ekosistem TeeStock

Penting untuk ditegaskan dari awal: website TeeStock **bukan kompetitor marketplace**, tapi pelengkap dengan fungsi berbeda:

| Fungsi | Marketplace (Shopee/TikTok/Blibli) | Website Sendiri |
|---|---|---|
| Volume penjualan Stock | Utama | Sekunder |
| Kepercayaan transaksi baru | Tinggi (built-in) | Perlu dibangun sendiri |
| Custom Order (form request, quote) | Tidak fleksibel | **Utama** |
| Reseller/Member (nanti) | Tidak bisa | **Utama** |
| Kontrol branding penuh | Terbatas | Penuh |
| Biaya platform | Ada fee per transaksi | Tidak ada fee transaksi (di luar payment gateway) |

Implikasinya: fitur website harus diprioritaskan untuk hal yang **tidak bisa dilakukan marketplace**, bukan cuma menduplikasi fungsi toko online biasa.

## 2. Analisis Kebutuhan Fitur

### Fase 1 — Wajib ada di peluncuran

**A. Katalog Stock**
- Halaman produk per series (9 series sesuai brand guide), dengan filter/kategori niche di dalamnya
- Pencarian produk (penting karena katalog akan terus melebar per batch)
- Halaman detail produk: mockup, deskripsi, pilihan ukuran/warna, harga
- Keranjang belanja & checkout
- Integrasi pembayaran (transfer bank, e-wallet, QRIS — lihat bagian integrasi)
- Kalkulasi ongkir otomatis berdasarkan alamat

**B. Custom Order**
- Form request custom (bukan cuma kolom teks bebas — sebaiknya terstruktur: jenis produk, deskripsi desain, upload referensi gambar, jumlah pcs)
- Alur status pesanan yang jelas ke customer: *Request diterima → Quote dikirim → Menunggu pembayaran → Diproses → Dikirim*
- Notifikasi otomatis (email/WhatsApp) tiap kali status berubah, supaya kamu nggak perlu update manual satu-satu

**C. Konten Brand**
- Halaman "Tentang TeeStock" — cerita brand, konsep series (penting untuk edukasi konsumen kenapa katalognya luas tapi tetap satu brand)
- Halaman per series dengan sedikit storytelling (bukan cuma daftar produk kosong)

**D. Kontak & Dukungan**
- Tombol WhatsApp langsung (paling praktis untuk solo founder, nggak perlu sistem tiket rumit dulu)
- FAQ (ukuran, bahan, estimasi produksi, kebijakan retur)

### Fase 2 — Menyusul setelah Fase 1 stabil

**E. Halaman Kolaborasi**
- Showcase partner kolaborasi & koleksi khusus mereka
- Bisa dibuat sesederhana halaman landing per kolaborasi, tidak perlu sistem rumit

**F. Portal Reseller/Member**
- Form pendaftaran reseller
- Dashboard sederhana: lihat harga tier khusus, riwayat order reseller
- Di tahap awal, ini bisa berupa halaman dengan login sederhana — belum perlu sistem dashboard canggih

## 3. User Flow Utama

**Flow pembeli Stock (skenario paling umum):**
Landing/homepage → pilih series atau cari niche spesifik → lihat detail produk → tambah ke keranjang → checkout → bayar → konfirmasi

**Flow Custom Order (skenario baru yang perlu dirancang hati-hati):**
Halaman Custom Order → isi form terstruktur + upload referensi → submit → (di sisi kamu: review & buat quote) → customer terima notifikasi quote → customer setuju & bayar → status "diproses" → status "dikirim"

*Catatan penting:* jangan bikin form Custom Order jadi terlalu panjang/menakutkan. Idealnya di bawah 5-6 field wajib, sisanya opsional.

## 4. Peta Situs (Sitemap)

```
Beranda
├── Katalog
│   ├── TeeStock Profesi
│   ├── TeeStock Fase
│   ├── TeeStock Komunitas/Aktif
│   ├── TeeStock Lokal
│   ├── TeeStock Fandom
│   ├── TeeStock Receh/Sarkas
│   ├── TeeStock Momen
│   ├── TeeStock Squad
│   └── TeeStock Kampus/Akademik
├── Custom Order
│   ├── Form Request
│   └── Cek Status Pesanan
├── Kolaborasi (Fase 2)
├── Reseller/Member (Fase 2)
│   ├── Daftar Reseller
│   └── Dashboard Reseller
├── Tentang TeeStock
├── FAQ
└── Keranjang & Checkout
```

## 5. Prinsip UI/UX

Semua desain antarmuka mengikuti brand guide yang sudah ada — bukan tema generik dari template:

- **Warna** — netral dasar (krem/hitam/charcoal) sebagai warna latar utama situs, dengan warna aksen series dipakai secara halus untuk menandai kategori (misal border/badge kecil di kartu produk sesuai warna series-nya) — konsisten dengan sistem warna di brand guide
- **Navigasi berbasis series** — menu utama mengikuti 9 series, bukan kategori generik seperti "Pria/Wanita" — ini menegaskan positioning "banyak pilihan lewat series", sesuai konsep brand
- **Mobile-first** — mayoritas pembeli Indonesia mengakses lewat HP, terutama yang datang dari TikTok/Instagram. Semua elemen (form, tombol checkout, form custom order) harus dites dulu di layar kecil, bukan didesain dari layar desktop lalu "disusutkan"
- **Kartu produk yang konsisten** — foto produk, nama desain, nama series, harga — format yang sama di semua kartu supaya katalog yang luas tetap terasa rapi saat di-scroll
- **Kepercayaan visual untuk pembeli baru** — karena website belum punya "kepercayaan bawaan" seperti marketplace, tampilkan elemen kepercayaan (testimoni, foto real produk, kebijakan retur yang jelas) lebih menonjol dibanding di marketplace

## 6. Rekomendasi Arsitektur Teknis

Karena kondisi teknis belum ditentukan dan prioritasnya adalah **efisiensi biaya + kecepatan jalan**, rekomendasi berikut paling masuk akal untuk solo founder dengan modal terbatas:

### Rekomendasi: WordPress + WooCommerce

| Kenapa cocok | Penjelasan |
|---|---|
| Biaya rendah | Cuma perlu bayar hosting + domain (bisa di bawah Rp1 juta/tahun), tidak ada biaya bulanan platform seperti Shopify (yang berbasis USD) |
| Ekosistem lokal lengkap | Plugin pembayaran (Midtrans, Xendit) dan ongkir (RajaOngkir/Biteship) sudah banyak tersedia dan umum dipakai UMKM Indonesia |
| Tidak wajib coding | Bisa disusun dengan page builder (Elementor) dan plugin form (untuk form Custom Order terstruktur) tanpa menulis kode dari nol |
| Fleksibel untuk custom order | Plugin form builder (misal Gravity Forms/WPForms) bisa dipakai untuk membuat alur request custom yang terstruktur, termasuk upload gambar |
| Skalabel | Kalau nanti butuh fitur reseller/member lebih canggih, banyak plugin membership tersedia untuk WordPress |

**Alternatif yang bisa dipertimbangkan (bukan rekomendasi utama, tapi valid):**
- **Shopify** — lebih "plug and play" dan tampilan lebih polished out-of-the-box, tapi biaya bulanan dalam USD memberatkan untuk budget awal, dan integrasi pembayaran lokal Indonesia tidak seluwes WooCommerce
- **Platform commerce lokal all-in-one (misal Jubelio, Sirclo)** — menarik karena beberapa dari platform ini juga menawarkan sinkronisasi stok ke marketplace (Shopee/TikTok Shop) sekaligus, tapi biayanya lebih tinggi dan lebih relevan dipertimbangkan **setelah** volume penjualan sudah cukup besar untuk butuh manajemen stok terpusat

**Kalau nanti butuh developer:** karena WooCommerce berbasis WordPress yang sangat umum dipakai, jauh lebih gampang & murah cari freelancer untuk bantu setup/kustomisasi dibanding platform yang lebih niche.

## 7. Integrasi yang Dibutuhkan

| Kebutuhan | Rekomendasi integrasi |
|---|---|
| Pembayaran | Midtrans atau Xendit (mendukung transfer bank, e-wallet, QRIS dalam satu integrasi) |
| Ongkos kirim | RajaOngkir atau Biteship (kalkulasi otomatis berdasarkan alamat & kurir) |
| Komunikasi cepat | Tombol klik-WhatsApp (wa.me link) — cukup di tahap awal, belum perlu WhatsApp Business API berbayar |
| Analitik | Google Analytics + Meta Pixel (penting untuk lihat sumber traffic dan efektivitas promosi TikTok/Instagram) |
| Sinkronisasi marketplace (opsional, nanti) | Dipertimbangkan setelah volume order cukup besar untuk butuh manajemen stok terpusat |

## 8. Estimasi Kebutuhan Biaya Awal Website

| Komponen | Estimasi |
|---|---|
| Domain (.com/.id) | Rp150.000 - 300.000/tahun |
| Hosting | Rp300.000 - 800.000/tahun (tergantung penyedia) |
| Tema/page builder premium (opsional) | Rp0 - 1.000.000 (banyak opsi gratis yang cukup baik) |
| Plugin form builder (untuk Custom Order) | Rp0 - 500.000 (ada versi gratis dengan fitur terbatas) |
| Biaya integrasi payment gateway | Umumnya gratis setup, kena fee per transaksi (~2-3%) |

Total kebutuhan awal website bisa ditekan di bawah Rp1,5 juta kalau memilih opsi hosting/tema yang efisien — cukup realistis untuk dianggarkan terpisah dari modal produksi yang sudah direncanakan sebelumnya.

## 9. Roadmap Pengembangan

| Tahap | Fokus |
|---|---|
| **Tahap 1** | Setup dasar: domain, hosting, WooCommerce, katalog Stock Batch 1, integrasi pembayaran & ongkir |
| **Tahap 2** | Form Custom Order terstruktur + alur notifikasi status pesanan |
| **Tahap 3** | Optimasi konten (halaman Tentang, FAQ, testimoni) setelah beberapa transaksi awal masuk, untuk bangun kepercayaan |
| **Tahap 4** | Setelah Fase 2 bisnis (Kolaborasi & Reseller) mulai jalan — tambah halaman Kolaborasi & portal Reseller sederhana |

## 10. Catatan Risiko & Pertimbangan

- **Beban maintenance untuk solo founder** — website butuh update rutin (plugin, keamanan). Kalau waktu terbatas, pertimbangkan jasa maintenance ringan atau jadwalkan pengecekan berkala (misal tiap bulan)
- **Jangan taruh semua energi ke website di awal** — sesuai strategi channel yang sudah dibahas, traffic website akan tumbuh lambat di awal. Fokus utama tetap di marketplace/TikTok untuk penjualan Stock; website diprioritaskan fungsinya untuk Custom Order dulu, bukan untuk menyaingi volume marketplace
- **Keamanan data pembayaran** — pastikan pakai payment gateway resmi (Midtrans/Xendit), jangan proses data kartu/pembayaran secara manual di form sendiri

---

*Dokumen ini melengkapi set rencana bisnis TeeStock (`analisis-bisnis-teestock.md`, `brand-guide-teestock.md`, `rencana-operasional-teestock.md`, `struktur-folder-teestock.md`).*
