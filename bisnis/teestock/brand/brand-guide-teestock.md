# Brand Guide — TeeStock: Curated Apparel & Merch House

Dokumen acuan identitas brand TeeStock. Dipakai sebagai kompas strategis dan operasional untuk perancangan produk, materi promosi, kolaborasi creator, hingga pengalaman pelanggan (*unboxing experience*).

---

## 1. Brand Story & Essence

* **Nama Brand:** TeeStock
* **Tagline Utama:** *Curated Apparel & Merch House*
* **Sub-tagline Konsumen:** *"Wear Your Identity, Stock Your Story"*

### Positioning Statement
> **TeeStock** adalah *creative apparel & merch house* independen yang memadukan kurasi desain berkarakter kuat dengan standar produksi apparel berkualitas tinggi. Kami bukan sekadar toko ritel pakaian, melainkan wadah di mana setiap individu, kreator, dan komunitas dapat mengekspresikan identitas serta merayakan karyanya melalui apparel yang bermakna.

### Mengapa TeeStock Berbeda?
* **Bukan Toserba Sablon Murahan:** Menghindari citra "toko sablon palugada" yang membingungkan. Semua karya ritel dikurasi dengan ketat, rapi, dan memiliki nilai rasa (*perceived value*) tinggi.
* **Bukan Distro Eksklusif Sempit:** Memiliki fleksibilitas portofolio desain yang luas melalui sistem rilis berkala (*The Drop Model*).
* **Mitra Terpercaya untuk Creator:** Memiliki lini studio yang memberikan solusi hulu-ke-hilir bagi kreator dan komunitas yang ingin merilis official merchandise tanpa repot urusan produksi dan modal besar.

---

## 2. Arsitektur Brand: Dual-Pillar Model

TeeStock beroperasi dengan arsitektur dua sayap yang saling memperkuat reputasi brand:

```
                  ┌───────────────────────────────┐
                  │           TEESTOCK            │
                  │ Curated Apparel & Merch House │
                  └───────────────┬───────────────┘
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│       TEESTOCK ORIGINALS        │       │         TEESTOCK STUDIO         │
│  (Koleksi Ritel Desain In-House)│       │  (Layanan Kreatif & Kemitraan)  │
└────────────────┬────────────────┘       └────────────────┬────────────────┘
                 │                                         │
        ┌────────┴────────┐                       ┌────────┼────────┐
        ▼                 ▼                       ▼        ▼        ▼
   Drop Kapsul       Pustaka Tema              Creator   Custom   Partner /
   (Rilis Berkala)   (Kurasi Internal)          Merch    Studio   Reseller
```

### 1. TeeStock Originals (Lini Ritel B2C)
* Sayap produk apparel siap pakai (*ready-to-wear*) yang dirancang sendiri oleh tim internal TeeStock.
* Dijual langsung ke konsumen akhir melalui marketplace (Shopee, TikTok Shop) dan katalog web resmi.
* Memiliki margin penuh dan menjadi etalase utama yang membangun citra kualitas TeeStock di mata publik.

### 2. TeeStock Studio (Sayap Kreatif & Kemitraan B2B2C)
* Sayap layanan produksi dan kolaborasi yang menangani kebutuhan non-retail:
  1. **Creator Merch Collab:** Kolaborasi resmi dengan kreator konten, seniman visual, atau musisi lokal untuk memproduksi official merchandise dengan sistem bagi hasil (*revenue sharing*).
  2. **Custom Order Studio:** Melayani pesanan kaos custom (satuan maupun lusinan) untuk komunitas, event, atau perorangan dengan standar bahan New State Apparel.
  3. **Partner / Reseller Program:** Memberikan peluang usaha bagi reseller dan dropshipper untuk memasarkan produk TeeStock dengan harga grosir dan materi promosi siap pakai.

---

## 3. Sistem "The Drop Model" (TeeStock Originals)

Sebagai ganti dari memamerkan katalog secara acak yang berisiko membuat toko terlihat seperti toserba atau membingungkan algoritma media sosial, TeeStock menerapkan **The Drop Model** (sistem rilis per edisi/kapsul).

### Mekanisme Drop & Kurasi Desain:
* **Prinsip Kurasi Desain:** Desain-desain acak yang sudah dimiliki solopreneur dikurasi ke dalam kelompok kecil (3–4 desain per Drop) yang memiliki kemiripan *vibes* visual (misal: satu Drop bertema *dark typography*, Drop berikutnya bertema *urban illustration*).
* **Tema Payung Drop:** Setiap Drop diberi nama tema konsep (contoh: **Drop #01: "RAW IDENTITY"** atau **"ORIGINS"**) agar memiliki daya tarik cerita (*storytelling*) yang kuat di konten TikTok & Reels.
* **Scarcity & Urgensi:** Pembatasan kuota rilis perdana (24 pcs) memicu efek FOMO dan memudahkan pengelolaan stok solopreneur di awal.
* **Arsip & Core Catalog:** Desain yang terbukti menjadi *best-seller* dipertahankan sebagai **Core Catalog**, sementara desain musiman dapat diarsipkan (*vaulted*).

---

## 4. Identitas Visual

### 4.1 Logo & Wordmark Resmi
* **Logo Utama:** Siluet lipatan kaos berkerah crew-neck tegas di atas 3 lipatan bertumpuk (*The Stock*). Melambangkan ketangguhan garmen NSA 24s dan kelincahan suplai produksi distro modern.
* **Format & Aset:**
  - **Vector SVG:** [`teestock-logo.svg`](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/brand/teestock-logo.svg) & [`web/public/logo-teestock.svg`](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/web/public/logo-teestock.svg) untuk render tajam tanpa pecah di seluruh platform digital dan cetak.
  - **High-Res Master:** [`teestock-logo-master-dark.jpg`](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/brand/teestock-logo-master-dark.jpg) & [`teestock-logo-master-light.jpg`](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/brand/teestock-logo-master-light.jpg).
  - **React Component:** `<TeeStockLogo size="md" badge="APPAREL" />` di [`TeeStockLogo.jsx`](file:///c:/Users/Rizky/bisnishub/bisnis/teestock/web/src/components/common/TeeStockLogo.jsx).
* **Palet Logo:**
  - **Aksen Utama:** Terracotta `#D95D39` (energik, hangat, artisanal craftsmanship).
  - **Monokrom Utama:** Krem `#F5F2EB` di atas Deep Charcoal `#161513`, atau Hitam pekat di atas latar terang.

### 4.2 Palet Warna Brand & Produk (Blank Apparel)
Produk dasar apparel dan sistem UI website menggunakan kombinasi palet estetik:

| Warna | Hex Code | Karakteristik & Peran |
|---|---|---|
| **Terracotta** | `#D95D39` | Warna aksen brand, badge, CTA glow, dan emblem |
| **Mustard Gold** | `#D9A441` | Aksen premium, bintang rating, dan highlight promo |
| **Deep Charcoal** | `#161513` | Background utama UI website & kaos hitam pekat |
| **Natural Cream** | `#F5F2EB` | Warna teks utama, kaos krem, dan latar foto resmi |
| **Teal Vintage** | `#2A9D8F` | Aksen sekunder varian kaos polos & status operasional |

### 4.3 Template Layout Desain Baku
Setiap desain kaos baru wajib mengikuti salah satu dari 3 formula tata letak berikut:
1. **Emblem / Badge Layout:** Cocok untuk tema outdoor, komunitas, dan local pride. Bentuk lencana dengan garis tegas.
2. **Bold Typographic Statement:** Cocok untuk tema tech, sarkas, dan kutipan berwawasan. Fokus pada kekuatan tata huruf dan pesan.
3. **Minimalist Icon + Caption:** Cocok untuk estetika modern, micro-niche, dan gaya visual bersih.

### 4.4 Tipografi
* **Font Display / Heading:** *Plus Jakarta Sans* (modern, bersih, geometris profesional).
* **Font Teknis / Monospace:** *JetBrains Mono* (spesifikasi bahan NSA 24s, kode SKU, label operasional).

---

## 5. Tone of Voice & Komunikasi

| Audiens | Pilar Brand | Karakter Komunikasi | Contoh Pesan |
|---|---|---|---|
| **Pembeli Retail** | Originals | Akrab, cerdas, sedikit jenaka, menghargai detail | *"Dibuat untuk kamu yang tahu susahnya debugging di hari Jumat malam. Katun tebal, sablon presisi."* |
| **Kreator / Seniman** | Studio | Kolaboratif, profesional, suportif, berorientasi eksekusi | *"Fokuslah berkarya. Biarkan TeeStock Studio yang mengurus produksi, cetak DTF, hingga packaging merch resmimu."* |
| **Reseller / Mitra** | Studio | Terpercaya, transparan, memberi peluang bisnis nyata | *"Mulai bisnis apparel tanpa stok gudang dan tanpa mesin sablon. Katalog siap jual, margin jelas."* |

---

## 6. Standar Penamaan & Listing Produk

### Format Judul Produk Ritel (Marketplace & Web):
```
[Nama Desain] T-Shirt — TeeStock Originals (Drop #[Nomor])
Contoh: "Stack Overflow Certified" T-Shirt — TeeStock Originals (Drop #01)
```

### Format Kolaborasi Creator (Studio):
```
[Nama Desain] Official Merch — [Nama Creator] x TeeStock Studio
Contoh: "Midnight Explorer" Official Merch — Raka Outdoor x TeeStock Studio
```

---

## 7. Packaging & Unboxing Experience (Brand Touchpoint)

Untuk menjaga persepsi brand besar dengan biaya operasional lean:
1. **Polymailer / Ziplock Doff Polos:** Bersih dan higienis.
2. **Branded Sticker Seal:** Segel kemasan dengan logo monokrom TeeStock.
3. **Insert Card (Thank You & Care Guide):** Kartu ucapan terima kasih dengan petunjuk pencucian dan QR code katalog web.
4. **Bonus Stiker Koleksi:** 1 stiker vinil tahan air bertema desain yang dibeli (meningkatkan *delight factor* pembeli).
5. **Estimasi Biaya Kemasan:** Wajib berada dalam pagu maksimal **Rp 2.000 – Rp 2.500 per paket** (sudah masuk dalam perhitungan HPP).
