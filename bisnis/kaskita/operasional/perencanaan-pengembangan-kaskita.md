---
title: "Perencanaan Pengembangan & Eksekusi Teknis — KasKita"
date: "2026-09-15"
bisnis: kaskita
kategori: operasional
status: active
tags:
  - bisnis/kaskita
  - operasional
  - roadmap
  - cto
  - coo
  - tech-stack
  - sprint-wbs
  - lean-execution
---

# Perencanaan Pengembangan & Eksekusi Teknis — KasKita

> [!abstract] Ringkasan Eksekutif
> Dokumen ini merumuskan rencana induk pengembangan teknologi, arsitektur repositori, alokasi beban kerja solopreneur (15–20 jam/minggu), rincian WBS sprint, serta strategi mitigasi risiko teknis untuk merealisasikan **KasKita** dari fase perancangan hingga rilis ke tangan pengguna riil.

---

## 1. Strategi Eksekusi Solopreneur (Lean Execution Framework)

Sebagai solopreneur yang mengelola portofolio multi-bisnis (TeeStock di fase peluncuran fisik dan KasKita di fase rekayasa perangkat lunak), pengembangan KasKita wajib mematuhi **3 Prinsip Eksekusi Ramping**:

1. **Leverage Managed Services (Build What's Unique, Buy/BaaS the Rest):**
   - Jangan membangun authentication, queue worker, dan file storage dari nol (*don't reinvent the wheel*).
   - Manfaatkan ekosistem **Supabase (PostgreSQL + Auth + Storage + RLS + Edge Functions)** yang memangkas **60% waktu pengerjaan backend**.
2. **Single-Player Mode First (Fase Validasi Diri Sendiri):**
   - Sebelum mengundang pengurus RT dan warga, modul pencatatan pribadi (*The Hub*) wajib digunakan langsung oleh founder dan 10 tester internal setiap hari untuk mencatat pengeluaran riil harian.
3. **Time-Boxing Solopreneur (15–20 Jam / Minggu):**
   - Pembagian waktu fokus:
     - **Pagi / Siang:** Operasional fisik TeeStock (produksi DTF 155°C & fulfillment).
     - **Malam (2–3 jam) & Akhir Pekan (6–8 jam):** Sprint rekayasa kode KasKita.

---

## 2. Arsitektur Repositori & Tech Stack Definitif

Untuk meminimalkan beban perawatan satu orang (*solopreneur efficiency*), arsitektur teknis **TIDAK menggunakan Web Admin terpisah**. Seluruh fitur admin (kelola iuran, kocok arisan, approve transfer) disatukan langsung ke dalam aplikasi mobile dengan kontrol hak akses adaptif (*In-App WhatsApp-Style Admin*):

```
[KASKITA MONOREPO / REPO UTAMA]
   │
   ├── /mobile          ──> Flutter (Android & iOS)
   │                        └── Target: 100% Fitur Pengguna (Personal, Warga, & Bendahara RT)
   │
   ├── /guest-web       ──> Lightweight Web Page (Flutter Web / PWA / Static HTML)
   │                        └── Target: Halaman Tagihan & Upload Bukti Warga Tanpa Install App
   │
   ├── /supabase        ──> Database Migrations, SQL Schemas, RLS, Edge Functions
   │                        └── Target: Managed PostgreSQL, Storage R2, & Autentikasi
   │
   └── /docs            ──> Dokumentasi teknis & API Swagger/OpenAPI
```

### Rincian Pilihan Teknologi & Rasionya

| Layer Sistem | Teknologi Pilihan | Alasan Pemilihan Teknis |
| :--- | :--- | :--- |
| **Mobile App (Utama)** | **Flutter (Dart)** | **Single Codebase** untuk seluruh pengguna. Bendahara RT mengelola iuran dan mengocok arisan langsung dari genggaman HP (gaya WhatsApp Group Info) tanpa perlu membawa laptop. |
| **Guest Web (PWA Link)** | **Lightweight Web / Flutter Web** | Halaman tagihan instan terbuka via tautan WhatsApp. Warga dapat melihat rincian tagihan dan mengunggah foto bukti bayar secara instan tanpa hambatan instalasi (*zero barrier*). |
| **Backend & DB** | **Supabase (PostgreSQL 15+)** | Integritas transaksi finansial ACID, Row-Level Security (RLS) bawaan untuk isolasi privasi UU PDP, dan realtime subscriptions untuk notifikasi transfer masuk ke HP bendahara. |
| **Storage Bukti** | **Cloudflare R2** | Kompatibel dengan S3 API, tanpa biaya *egress bandwidth*, gambar bukti bayar dikompresi WebP $< 300\text{ KB}$. |
| **Messaging** | **Client Deep-Link `wa.me` + FCM** | Tier Free menggunakan deep link lokal tanpa biaya server; Push notification gratis via Firebase Cloud Messaging. |

---

## 3. Peta Jalan Pengembangan 4 Fase (The 4-Phase Maturity Model)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ FASE 1 (Bulan 1 - Sprint 1–3): Single-Player Personal Hub & Multi-Wallet    │
│ Target: Auth OTP, Multi-Dompet (Cash/Bank/e-Wallet), Catat Cepat Harian,    │
│ Budgeting Bulanan, Kalender Kewajiban. Digunakan founder & 10 tester.      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ FASE 2 (Bulan 2 - Sprint 4–5): Multiplayer Spokes & Zero Double-Entry       │
│ Target: Web Admin Iuran RT, Tagihan Massal, Upload Bukti R2, Arisan Kocok, │
│ P2P Utang Piutang, dan Mesin Sinkronisasi Otomatis Kas Pribadi.             │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ FASE 3 (Bulan 3 - Sprint 6): UAT Lapangan Bersama 1 RT Riil & Rilis MVP     │
│ Target: Uji coba siklus iuran 1 bulan penuh bersama 40–60 warga RT riil,    │
│ ekspor rekapitulasi kas ke PDF/Excel, rilis internal testing Play Store.    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ FASE 4 (Bulan 4+): Monetisasi Komunitas Pro SaaS & Skalabilitas             │
│ Target: Langganan SaaS RT Rp29k-Rp79k/bln, WhatsApp API Gateway resmi,     │
│ eksplorasi Payment Gateway QRIS dinamis untuk pembayaran otomatis.          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Rincian WBS Sprint Mingguan (Estimasi Jam Kerja)

Alokasi: **18 jam per minggu** (Senin–Jumat: 2 jam malam = 10 jam; Sabtu: 8 jam).

### SPRINT 1 (Minggu 1) — Fondasi Database, Auth & Multi-Wallet (18 Jam)
* `[ ]` Setup repositori monorepo & project Supabase Cloud *(2 jam)*
* `[ ]` Eksekusi migrasi DDL SQL tabel `users`, `wallets`, `categories`, `budgets` *(3 jam)*
* `[ ]` Konfigurasi otentikasi OTP WhatsApp/SMS via Supabase Auth *(4 jam)*
* `[ ]` Inisialisasi proyek Flutter Mobile & state management (Bloc / Riverpod) *(4 jam)*
* `[ ]` Implementasi layar Beranda Mobile: Menampilkan Total Saldo & Card Multi-Wallet *(5 jam)*
* **Deliverable Sprint 1:** Pengguna bisa login via nomor HP dan melihat daftar dompet pribadinya (BCA, Kas Tunai, GoPay).

### SPRINT 2 (Minggu 2) — Catat Cepat Harian & Limit Anggaran (18 Jam)
* `[ ]` Form input cepat transaksi: Pilih jenis (Pengeluaran/Pemasukan), Nominal, Dompet, Kategori *(5 jam)*
* `[ ]` Validasi transaksi & mutasi otomatis ke saldo tabel `wallets` *(3 jam)*
* `[ ]` Layar Transaksi: Daftar riwayat mutasi dengan filter dompet & tanggal *(4 jam)*
* `[ ]` Layar Anggaran & Kalender: Setup limit bulanan & visual progress bar *(6 jam)*
* **Deliverable Sprint 2:** Aplikasi berfungsi penuh sebagai buku kas pribadi harian (*single-player mode aktif*).

### SPRINT 3 (Minggu 3) — In-App Community Admin & Zero-Install Web Guest (18 Jam)
* `[ ]` In-App Admin Flutter: Form pembuatan grup RT/Arisan & navigasi gaya WhatsApp Group Info *(4 jam)*
* `[ ]` Fitur *Bulk Invoice Generator* di HP: Menerbitkan tagihan bulanan serentak ke seluruh warga *(4 jam)*
* `[ ]` Zero-Install Web Guest Link: Halaman web tagihan instan agar warga bisa bayar via browser HP *(6 jam)*
* `[ ]` Setup Cloudflare R2 bucket & pipeline kompresi gambar WebP bukti transfer *(4 jam)*
* **Deliverable Sprint 3:** Bendahara bisa menerbitkan tagihan RT 100% dari ponsel; warga bisa membuka link WA dan upload bukti bayar via web browser tanpa install app.

### SPRINT 4 (Minggu 4) — Verifikasi In-App, Arisan Digital & Zero Double-Entry (18 Jam)
* `[ ]` Layar Verifikasi di HP Bendahara: Floating banner notifikasi & aksi cepat *Approve/Reject* bukti bayar *(4 jam)*
* `[ ]` **Zero Double-Entry Engine:** Prompt otomatis saat iuran disetujui untuk memotong saldo dompet pribadi *(5 jam)*
* `[ ]` Modul Arisan Digital In-App: Pendaftaran slot nomor anggota & tombol Kocok Digital interaktif *(6 jam)*
* `[ ]` Tombol Share Hasil Kocokan: Format teks ucapan selamat siap broadcast ke grup WhatsApp *(3 jam)*
* **Deliverable Sprint 4:** Siklus iuran warga terverifikasi langsung dari HP dan uang arisan dapat diundi serta dibagikan ke WhatsApp secara transparan.

### SPRINT 5 (Minggu 5) — Utang Piutang & Pengingat WhatsApp Ramah (18 Jam)
* `[ ]` Modul Utang Piutang P2P: Pencatatan Saya Pinjam vs Piutang Teman *(4 jam)*
* `[ ]` Fitur pencatatan cicilan parsial & pelunasan utang terhubung ke dompet *(4 jam)*
* `[ ]` Cron Scheduler pengingat jatuh tempo (H-3, H-1, Hari H) via BullMQ / Edge Functions *(5 jam)*
* `[ ]` Generator client-side deep link `wa.me` dengan template pesan sopan anti-sungkan *(3 jam)*
* `[ ]` Fitur ekspor rekap kas RT ke dokumen format PDF berstandar papan pengumuman *(2 jam)*
* **Deliverable Sprint 5:** Sistem penagihan anti-sungkan aktif dan laporan siap cetak.

### SPRINT 6 (Minggu 6) — UAT Lapangan, Testing ACID & Peluncuran (18 Jam)
* `[ ]` Uji integritas data finansial & simulasi transaksi bersamaan (*concurrency & ACID stress-test*) *(4 jam)*
* `[ ]` Audit keamanan PostgreSQL Row-Level Security (RLS) data isolasi warga *(3 jam)*
* `[ ]` Uji coba lapangan (UAT) langsung bersama 1 RT nyata (lingkungan perumahan founder/partner) *(6 jam)*
* `[ ]` Perbaikan bug, polish UI responsive, dan build APK Android untuk Google Play Internal Testing *(5 jam)*
* **Deliverable Sprint 6:** **KasKita MVP Live v1.0 dan digunakan oleh pengguna perdana.**

---

## 5. Matriks Manajemen Risiko & Mitigasi Teknis

| Risiko Potensial | Dampak | Probabilitas | Rencana Mitigasi Teknis |
| :--- | :---: | :---: | :--- |
| **Biaya WhatsApp API Membengkak** | Kritis | Tinggi | Gunakan tautan lokal `wa.me/?text=...` di tier gratis (biaya server Rp0). API gateway resmi hanya dibuka untuk workspace RT berbayar. |
| **Kecurigaan Kebocoran Privasi Warga** | Kritis | Sedang | Terapkan PostgreSQL Row-Level Security (RLS) ketat. Admin RT tidak punya query access ke tabel `wallets` atau `transactions` personal warga. |
| **Catatan Kas Ganda (Double Entry Error)** | Tinggi | Sedang | Seluruh approval verifikasi dibungkus transaksi database atomic `BEGIN ... COMMIT` dengan idempotency key berdasarkan `invoice_id`. |
| **Warga Enggan Mengunduh Aplikasi Baru** | Tinggi | Tinggi | Buat alur *Guest Payment Link* berbasis web PWA di mana warga bisa upload bukti bayar tanpa wajib install aplikasi native di awal. |
| **Founder Burnout (Waktu Terbatas)** | Sedang | Tinggi | Gunakan Supabase untuk backend (hemat 60% waktu), batasi skop MVP murni pada MoSCoW Must-Have, hindari fitur kompleks di awal. |

---

## 6. Kriteria Kelulusan Tahap (Exit Criteria Milestone)

Sebelum melanjutkan ke fase komersialisasi dan integrasi Payment Gateway berbayar:
1. `[ ]` Minimal **1 komunitas RT riil (30–60 warga)** berhasil menjalankan 1 siklus iuran bulanan penuh dengan tingkat ketepatan waktu $> 85\%$.
2. `[ ]` Rata-rata **retensi Day-30 pengguna individu** pada pencatatan dompet harian berada di atas target $> 35\%$.
3. `[ ]` Tingkat kepuasan konfirmasi pembayaran menggunakan mesin *Zero Double-Entry* disetujui oleh minimal $75\%$ warga yang membayar.
4. `[ ]` Nol insiden kegagalan integritas transaksi keuangan (*zero double-deduction bug*).

---
*Lihat dokumen referensi lainnya:*
- [[bisnis/kaskita/README|Dashboard Utama KasKita]]
- [[bisnis/kaskita/01-konsep-lean-canvas-prd|Konsep & PRD MVP]]
- [[bisnis/kaskita/03-arsitektur-sistem-dan-database|Arsitektur Sistem & Basis Data PostgreSQL]]
- [[bisnis/kaskita/04-spesifikasi-api-dan-sprint-roadmap|Kontrak API & Jadwal Kerja]]
