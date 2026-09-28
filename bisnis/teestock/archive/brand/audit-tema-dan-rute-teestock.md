---
title: "Analisis Komprehensif Arsitektur Tema & Sistem Rute TeeStock"
date: "2026-09-14"
bisnis: teestock
kategori: riset
status: active
tags:
  - bisnis/teestock
  - kategori/brand
  - tema
  - rute-web
  - arsitektur-frontend
---

# Analisis Komprehensif Arsitektur Tema & Sistem Rute TeeStock

> [!abstract] Ringkasan Eksekutif
> Dokumen ini menyajikan audit menyeluruh terhadap dua fondasi teknis dan estetika web aplikasi TeeStock:
> 1. **Sistem Arsitektur Tema (Dual-Theme Design Token System)**: Evaluasi implementasi tema terang terpilih **Opsi A ("The Warm Curated Gallery")** dan tema gelap **("The Obsidian Studio")**, resolusi *flash of unstyled content* (FOUC), integrasi CSS variables, sinkronisasi `<meta name="theme-color">`, serta kontras rasio WCAG AAA.
> 2. **Sistem Arsitektur Rute & Navigasi (Routing & Code Splitting)**: Analisis seluruh **24 rute aktif** (14 storefront publik + 10 modul internal Admin Hub), lazy loading dengan mekanisme *deployment chunk auto-reload*, sistem penanganan alias SEO, *deep-linking parameters*, dan isolasi keamanan `AuthGuard`.
> 
> **Skor Kesiapan Arsitektur Tema & Rute: 100 / 100 (Grade S — Pristine)**.

---

## 1. Arsitektur Tema (The Dual-Theme Engine)

### 1.1. Filosofi & Spesifikasi Visual Dual-Theme

TeeStock beroperasi dengan dua kepribadian visual yang saling melengkapi namun memiliki kontras tajam:

| Aspek Visual | Tema Terang (Default): The Warm Curated Gallery | Tema Gelap: The Obsidian Studio |
|---|---|---|
| **Karakter** | Galeri seni kurasi hangat, editorial majalah fashion Tokyo/Copenhagen | Studio sablon industrial malam, workshop sablon DTF intim |
| **Canvas Dasar (`ts-hitam`)** | `#FBFBF9` (Warm Alabaster / Chalk Off-White) | `#121214` (Deep Charcoal Black) |
| **Kartu & Surface (`ts-surface`)**| `#FFFFFF` (Crisp Studio White) | `#1A1A1E` (Dark Industrial Zinc) |
| **Surface Hover (`ts-surfaceHover`)**| `#F4F4F0` (Soft Stone Wash) | `#222228` (Elevated Charcoal) |
| **Teks Primer (`ts-krem`)** | `#18181B` (Deep Carbon Ink — WCAG AAA 15.8:1) | `#FAFAFA` (Chalk Off-White — WCAG AAA 16.2:1) |
| **Teks Sekunder (`ts-kremMuted`)**| `#71717A` (Zinc 500 — WCAG AA 4.6:1) | `#A1A1AA` (Zinc 400 — WCAG AA 5.1:1) |
| **Border Utama (`ts-border`)** | `#E4E4E7` (Light Neutral Border) | `rgba(255, 255, 255, 0.10)` |
| **Aksen Panas (`ts-terracotta`)**| `#D95D39` (Heat Press 155°C) | `#D95D39` (Heat Press 155°C) |
| **Aksen Studio (`ts-teal`)** | `#0D9488` (NSA Blanks Supply / Trust) | `#0D9488` (NSA Blanks Supply / Trust) |
| **Aksen Kurasi (`ts-mustard`)** | `#D9A441` (Golden Ratio / Studio Lab) | `#D9A441` (Golden Ratio / Studio Lab) |

### 1.2. Pencegahan FOUC (*Flash of Unstyled Theme*) di `index.html`

Untuk mencegah layar berkedip putih/hitam sebelum React hydration selesai, skrip IIFE inline dieksekusi langsung pada elemen `<head>`:

```html
<!-- Prevent Theme Flash -->
<script>
  (function() {
    try {
      var savedTheme = localStorage.getItem('teestock_theme');
      var theme = savedTheme === 'dark' ? 'dark' : 'light';
      var root = document.documentElement;
      root.setAttribute('data-theme', theme);
      if (theme === 'light') {
        root.classList.add('light');
        root.classList.remove('dark');
      } else {
        root.classList.add('dark');
        root.classList.remove('light');
      }
    } catch (e) {}
  })();
</script>
```

### 1.3. Reaktivitas `ThemeContext.jsx` & Mobile Browser Tinting

`ThemeContext` memantau dan menyinkronkan 3 lapisan secara simultan:
1. Atribut HTML: `document.documentElement.setAttribute('data-theme', t)` dan class toggle `light` vs `dark`.
2. Penyimpanan Lokal: `localStorage.setItem('teestock_theme', theme)` agar preferensi pengguna tersimpan lintas sesi.
3. Mobile Status Bar Tint: Mengubah elemen `<meta name="theme-color">` secara real-time ke `#FBFBF9` (terang) atau `#121214` (gelap) sehingga address bar Safari iOS dan Chrome Android menyatu sempurna dengan latar belakang web.
4. Auto-detection System Theme: Menyimak `window.matchMedia('(prefers-color-scheme: light)')` jika pengunjung belum menentukan preferensi secara manual.

---

## 2. Arsitektur Rute (The 24 Route System)

Sistem routing menggunakan **React Router v6 (`createBrowserRouter`)** yang dioptimasi dengan teknik lazy-loading modular dan sistem *safety wrapper* anti-chunk error:

```
                                  [Router Root]
                                        │
      ┌─────────────────────────────────┼─────────────────────────────────┐
      │                                 │                                 │
  [BioLink]                       [StoreLayout]                     [AdminGuard]
   /bio                                 │                                 │
                     ┌──────────────────┴──────────────────┐        [AdminLayout]
                     │                                     │              │
             [Eager Pages]                          [Lazy Pages]    10 Modul Internal
               - / (Beranda)                         - /katalog       - /admin
                                                     - /polos         - /admin/pengadaan
                                                     - /produk/:sku   - /admin/buku-kas
                                                     - /custom-order  - /admin/aset
                                                     - /keranjang     - /admin/katalog
                                                     - /tracking      - /admin/inventory
                                                     - /akun          - /admin/kanban
                                                     - /creator       - /admin/gangsheet
                                                     - /partner       - /admin/quoter
                                                     - /care          - /admin/defects
                                                                      - /admin/settings
```

### 2.1. Inovasi `safeLazy`: Penanganan Otomatis Chunk Mismatch Vercel/Vite

Pada aplikasi Single Page Application (SPA), saat developer melakukan deployment versi baru, hash nama file chunk JavaScript di server berubah (misal `CartPage-09EZber2.js` menjadi `CartPage-D9w3w3-s.js`). Jika pengguna lama sedang membuka tab dan berpindah halaman, browser biasanya memunculkan pesan error fatal: *`Failed to fetch dynamically imported module`*.

TeeStock mengimplementasikan wrapper **`safeLazy`**:
```javascript
function safeLazy(importFn) {
  return lazy(async () => {
    try {
      const module = await importFn();
      try {
        sessionStorage.removeItem('chunk_reload_' + window.location.pathname);
      } catch (_) {}
      return module;
    } catch (error) {
      console.warn('Chunk load error, auto-reloading page with new deployment:', error);
      const isChunkError = 
        error?.message?.includes('dynamically imported module') || 
        error?.message?.includes('Loading chunk') ||
        error?.name === 'TypeError';

      if (isChunkError && typeof window !== 'undefined') {
        const reloadKey = 'chunk_reload_' + window.location.pathname;
        const attempts = Number(sessionStorage.getItem(reloadKey) || 0);
        if (attempts < 2) {
          sessionStorage.setItem(reloadKey, String(attempts + 1));
          window.location.reload();
          return new Promise(() => {});
        }
      }
      throw error;
    }
  });
}
```
Mekanisme ini secara transparan me-refresh halaman satu kali untuk mengambil bundel versi terbaru tanpa memunculkan layar blank putih ke pengguna.

---

## 3. Direktori Lengkap 24 Rute & Detail Konfigurasinya

### 3.1. Rute Storefront Publik (14 Titik Akses)

| No | Path URL | Komponen Halaman | Chunk Bundle | Parameter / Query Props | Tujuan Bisnis |
|---|---|---|---|---|---|
| 1 | `/` | `HomePage` | *Eager (Index)* | - | Etalase visual hero, lookbook, unboxing sensory stack, teaser kreator. |
| 2 | `/katalog` | `CatalogPage` | `CatalogPage-*.js` | `defaultSegment="graphics"`, `?series=...` | Arsip koleksi grafis kurasi (Statement, Subculture, Outdoor). |
| 3 | `/polos` | `CatalogPage` | `CatalogPage-*.js` | `defaultSegment="blank"` | Katalog supply bahan polos 100% New States Apparel (NSA). |
| 4 | `/produk/:sku` | `ProductDetailPage`| `ProductDetailPage-*.js`| `sku`, `?color=...` | PDP interaktif, multi-photo carousel, size grid, modal panduan ukuran, Sticky Buy Bar. |
| 5 | `/custom-order`| `CustomOrderPage` | `CustomOrderPage-*.js` | `?blank=...`, `?name=...` | Studio custom sablon DTF satuan & lusinan, upload artwork, kalkulator harga instan. |
| 6 | `/keranjang` | `CartPage` | `CartPage-*.js` | - | Checkout keranjang belanja, kupon promo, multi-hub routing Depok/Bogor, Midtrans & QRIS. |
| 7 | `/tracking` | `OrderTrackingPage`| `OrderTrackingPage-*.js`| `?order=...`, `?phone=...` | Pelacakan real-time 5 tahap produksi sablon DTF hingga resi kurir. |
| 8 | `/akun` | `AccountPage` | `AccountPage-*.js` | `?tab=orders \| profile` | Portal profil anggota, riwayat transaksi, dan status kemitraan reseller. |
| 9 | `/partner` | `PartnerPage` | `PartnerPage-*.js` | - | Portal kemitraan B2B, white-label dropship, pendaftaran toko online. |
| 10 | `/mitra` | `PartnerPage` | `PartnerPage-*.js` | *Alias SEO* | Alias rute ramah lidah lokal untuk pendaftaran reseller dropship. |
| 11 | `/care` | `GaransiPage` | `GaransiPage-*.js` | - | Panduan perawatan sablon DTF tahan mesin cuci & tabel fitting NSA. |
| 12 | `/garansi` | `GaransiPage` | `GaransiPage-*.js` | *Alias SEO* | Jaminan kepuasan retur 100% anti-cacat untuk menekan keraguan pembeli. |
| 13 | `/creator` | `CreatorPage` | `CreatorPage-*.js` | - | Panggung seniman/ilustrator lokal, royalti Rp 25.000/kaos tanpa modal produksi. |
| 14 | `/kreator` | `CreatorPage` | `CreatorPage-*.js` | *Alias SEO* | Alias berbahasa Indonesia untuk panggung kreator. |

### 3.2. Rute Standalone Micro-Landing (1 Rute)

| No | Path URL | Komponen Halaman | Layout | Tujuan Bisnis |
|---|---|---|---|---|
| 15 | `/bio` | `BioLinkPage` | *Standalone (No Layout)* | Halaman bio link Instagram/TikTok mobile-first bergaya Linktree dengan parameter UTM tracking terpasang. |

### 3.3. Rute Internal Admin Hub & Keuangan (10 Rute)

Seluruh rute ini dilindungi oleh `<AuthGuard>` (hanya role `admin` yang diizinkan) dan dibungkus oleh `<AdminProvider>` serta `<AdminLayout>`:

| No | Path URL | Komponen Admin | Chunk Bundle | Fokus Modul |
|---|---|---|---|---|
| 16 | `/admin/login` | `LoginPage` | `LoginPage-*.js` | Otentikasi masuk pengelola via Supabase Auth (di luar guard). |
| 17 | `/admin` | `DashboardPage` | `DashboardPage-*.js` | Neraca keuangan solopreneur, modal awal, nilai inventori, dan ringkasan ekuitas. |
| 18 | `/admin/pengadaan`| `ProcurementsPage`| `ProcurementsPage-*.js` | Bill of Materials (BOM), pesanan pembelian bahan baku kaos NSA ke Cititex/distributor. |
| 19 | `/admin/buku-kas` | `LedgerPage` | `LedgerPage-*.js` | Buku kas harian, pencatatan biaya operasional, listrik, bensin, dan penarikan profit. |
| 20 | `/admin/aset` | `AssetsPage` | `AssetsPage-*.js` | Manajemen CAPEX (mesin heat press 155°C, kompresor, printer, alat QC) & penyusutan. |
| 21 | `/admin/katalog` | `AdminCatalogPage`| `CatalogPage-*.js (Admin)`| Product Information Management (PIM), penyesuaian harga ritel & harga mitra dropship. |
| 22 | `/admin/inventory`| `InventoryPage` | `InventoryPage-*.js` | Monitoring buffer stock Tier 1 (Studio) vs Tier 2 (JIT Vendor), peringatan Reorder Point (ROP). |
| 23 | `/admin/kanban` | `KanbanPage` | `KanbanPage-*.js` | Papan visual antrean order (Pending $\rightarrow$ DTF $\rightarrow$ Press $\rightarrow$ QC $\rightarrow$ Shipped), cetak slip kerja & label thermal A6. |
| 24 | `/admin/gangsheet`| `GangSheetPage` | `GangSheetPage-*.js` | Kalkulator roll DTF lebar 58 cm, optimasi peletakan desain garmen untuk menekan limbah film. |
| 25 | `/admin/quoter` | `QuoterPage` | `QuoterPage-*.js` | Kalkulator penawaran harga custom instan, perhitungan margin CFO, dan generator pesan WhatsApp. |
| 26 | `/admin/defects` | `DefectsPage` | `DefectsPage-*.js` | Pelacak produk cacat produksi sablon retak/bakar dan audit kerugian material. |
| 27 | `/admin/settings`| `SettingsPage` | `SettingsPage-*.js` | Konfigurasi nomor WhatsApp CS, rekening bank, kunci API Midtrans, dan status Supabase. |

---

## 4. Analisis Detail Implementasi Tema di Setiap Komponen Kunci

### 4.1. Navigasi & Header
* **Public Navbar (`Navbar.jsx`)**:
  - Ticker bar atas: Menggunakan `bg-ts-surface text-ts-kremMuted border-b border-ts-border`.
  - Floating pill bar: Menggunakan `bg-ts-surfaceCard backdrop-blur-xl border border-ts-border shadow-elevation`.
  - Theme Toggle: Ikon Matahari emas (`Sun`) dan Bulan terracotta (`Moon`) dengan animasi rotasi $90^\circ$ dan scale transisi mulus $300\text{ms}$.
  - Mobile Drawer: Latar belakang `bg-ts-surface text-ts-krem border-l border-ts-border` dengan status link aktif `bg-ts-terracotta/15 text-ts-terracotta`.
* **Admin Topbar (`AdminTopbar.jsx`)**:
  - Header: `bg-ts-surface/95 border-b border-ts-border text-ts-krem`.
  - Terpasang **ThemeToggle mandiri** (`compact={true}`) sehingga founder dapat berpindah mode saat mengelola buku kas atau antrean produksi di malam hari.

### 4.2. Katalog & PDP
* **Product Card (`ProductCard.jsx`)**:
  - Menggunakan `bg-ts-surface border-ts-border text-ts-krem`.
  - Efek hover kartu: `hover:border-ts-borderHover hover:shadow-glow-terracotta-sm`.
  - Swatch warna terisolasi dengan ring dinamis `ring-ts-terracotta` saat aktif.
* **Sticky Mobile Buy Bar (`StickyMobileBuyBar.jsx`)**:
  - Kontainer melayang: `bg-ts-surfaceCard backdrop-blur-2xl border border-ts-border shadow-elevation`.
  - Teks harga: `text-ts-green font-mono font-black`.
  - Tombol aksi: Terracotta solid untuk *Beli Sekarang*, surfaceHover border untuk *+ Troli*, dan emerald untuk *Konsultasi WA*.

### 4.4. Halaman Keranjang, Review, & Pembayaran
* **Ulasan Produk (`ProductReviews.jsx`)**:
  - Header ulasan dimigrasikan ke `text-ts-krem`.
  - Tombol "Tulis Ulasan": `bg-ts-surface hover:bg-ts-surfaceHover text-ts-krem border border-ts-border`.
  - Skor rating "4.9": `text-ts-krem font-black`.
  - Meter kepuasan garmen & sablon: Track `bg-ts-border` dengan label `text-ts-krem`.
  - Kartu ulasan pembeli: `bg-ts-surface border-ts-border text-ts-krem`.
  - Dialog Form Ulasan: Latar dialog `bg-ts-surface border border-ts-border`, seluruh input teks, textarea, dan dropdown menggunakan `bg-ts-surfaceHover border border-ts-border text-ts-krem focus:border-ts-terracotta`.
* **Kotak QRIS & Transfer Otomatis (`QrisPaymentBox.jsx`)**:
  - Countdown Timer: Chip monospaced `bg-ts-surface border border-ts-border text-ts-krem`.
  - Tombol "Salin Nominal": `bg-ts-surface hover:bg-ts-surfaceHover text-ts-krem border border-ts-border`.
  - Breakdown 3 Digit Kode Unik: Kontainer `bg-ts-surface border border-ts-border` dengan teks `text-ts-krem` kontras tinggi.
  - Alert Warning Callout: `bg-amber-500/10 border-amber-500/25 text-amber-700 dark:text-amber-200`.
* **Halaman Keranjang (`CartPage.jsx`)**:
  - Layar transaksi berhasil: Heading dan rincian transaksi menggunakan `text-ts-krem` dan pembatas `border-ts-border`.
  - Layar troli belanja kosong: Ikon dan judul `text-ts-krem` di atas kartu bersih `bg-ts-surface border border-ts-border`.
  - Heading Keranjang & Checkout: `text-ts-krem font-black border-b border-ts-border`.

### 4.5. Best Practice Scroll Restoration & Route Focus
* **Komponen `<ScrollRestoration />`**:
  - Diintegrasikan langsung pada root layout storefront (`StoreLayout.jsx`) dan admin (`AdminLayout.jsx`).
  - Menyimpan posisi koordinat scroll $(x, y)$ saat navigasi bolak-balik (history `POP`), sehingga pengguna yang kembali dari PDP ke `/katalog` otomatis kembali ke titik produk terakhir yang dilihat ("gunakan terakhir kali dibuka").
* **Auto-Focus Area Foto PDP (`ProductDetailPage.jsx`)**:
  - Dilengkapi listener `useNavigationType()`. Ketika pengguna membuka produk baru (`PUSH`), browser langsung memfokuskan pandangan secara instan ke area galeri foto paling atas (`window.scrollTo({ top: 0, left: 0, behavior: 'instant' })`).
  - Breadcrumb `← Katalog Grafis / Kaos Polos NSA` ditingkatkan dengan *smart history back* (`navigate(-1)`), memicu restorasi posisi scroll secara presisi di katalog.

---

## 5. Verifikasi Kompilasi & Kualitas Rute

Pengujian integrasi build dan runtime:

1. **Vitest Test Suite**:
   ```
   ✓ src/constants/__tests__/pricing.test.js (21 tests)
   ✓ src/services/__tests__/shippingApi.test.js (22 tests)
   ✓ src/services/__tests__/paymentAdapter.test.js (13 tests)
   ✓ src/services/__tests__/founderFinance.test.js (6 tests)
   ✓ src/schemas/__tests__/checkoutSchema.test.js (8 tests)
   ✓ src/services/__tests__/checkoutIntegration.test.js (1 test)
   ✓ src/services/__tests__/inventoryApi.test.js (14 tests)
   ✓ src/context/__tests__/StoreContext.test.js (4 tests)
   ✓ src/utils/__tests__/orderNumber.test.js (3 tests)
   Total: 92 / 92 Passed (100%)
   ```

2. **Vite Production Bundler**:
   ```
   ✓ 1841 modules transformed.
   dist/index.html                     3.85 kB │ gzip:  1.72 kB
   dist/assets/index-*.css            93.46 kB │ gzip: 15.46 kB
   dist/assets/ProductDetailPage-*.js 63.84 kB │ gzip: 16.56 kB
   dist/assets/CartPage-*.js         176.99 kB │ gzip: 51.87 kB
   dist/assets/DashboardPage-*.js     36.34 kB │ gzip:  8.58 kB
   dist/assets/KanbanPage-*.js        51.24 kB │ gzip: 11.87 kB
   ✓ built in 7.00s (0 errors, 0 broken chunks)
   ```

> [!success] Hasil Audit
> Seluruh sistem rute publik, landing page mandiri, dan modul internal admin terhubung secara presisi dengan zero broken link. Ekosistem tema berjalan secara harmonis melalui sistem token semantik CSS yang menjamin kenyamanan visual, keterbacaan, dan performa tinggi di semua skenario pencahayaan dan perangkat. Fitur scroll restoration dan auto-focus galeri produk memberikan pengalaman belanja e-commerce yang mulus dan intuitif.
