---
title: "Perencanaan & Konvensi Struktur Directory — KasKita"
date: "2026-09-15"
bisnis: kaskita
kategori: operasional
status: active
tags:
  - bisnis/kaskita
  - operasional
  - arsitektur
  - struktur-directory
  - clean-architecture
  - react-native
  - expo
---

# Perencanaan & Konvensi Struktur Directory — KasKita

> [!abstract] Ringkasan Arsitektur
> Dokumen ini mendefinisikan cetak biru struktur folder modular untuk ekosistem **KasKita**, mencakup hierarki vault dokumentasi bisnis, arsitektur monorepo teknis, serta *Clean Architecture* pada aplikasi mobile (React Native / Expo) agar kode tetap tertata rapi, mudah diuji, dan skalabel untuk dikelola oleh solopreneur.

---

## 1. Peta Global Direktori Bisnis (`bisnis/kaskita/`)

Struktur folder KasKita di dalam Obsidian Vault memadukan standarisasi `GEMINI.md` dengan ekosistem rekayasa perangkat lunak modern:

```
bisnis/kaskita/
├── README.md                      ──> Master Hub, Visi, & Indeks Dokumentasi
├── 01-konsep-lean-canvas-prd.md   ──> Tahap 1: Konsep & Scope PRD MVP
├── 02-ia-dan-user-flow.md         ──> Tahap 2: Navigasi, IA & Core User Flows
├── 03-arsitektur-sistem-dan-database.md ──> Tahap 3: DDL PostgreSQL & Sistem
├── 04-spesifikasi-api-dan-sprint-roadmap.md ──> Tahap 4: REST API & Sprint WBS
├── 05-strategi-produk-hub-and-spoke.md  ──> Tahap 5: Strategi Retensi & Viral PLG
│
├── riset/                         ──> Folder Riset Pasar & Validasi Ide
│   └── analisis-pasar-dan-kompetisi.md
│
├── desain/                        ──> Folder Panduan Visual & Desain UI/UX
│   └── eksplorasi-ui-ux-kaskita.md
│
├── operasional/                   ──> SOP, Rencana Eksekusi, & Struktur Folder
│   ├── perencanaan-pengembangan-kaskita.md
│   └── struktur-directory-kaskita.md
│
├── brand/                         ──> Logo, Brand Guide, Aset Vektor (Masa Depan)
├── keuangan/                      ──> Pricing SaaS, Laporan Arus Kas Bisnis
├── marketing/                     ──> Kalender Konten, Copywriting Promo, WhatsApp Script
│
├── shared/                        ──> Kontrak Data & Tipe Domain Bersama
│   └── types.ts                   ──> TypeScript Interface (User, Wallet, Dues, Arisan)
│
├── supabase/                      ──> Proyek Backend & Basis Data Supabase
│   ├── config.toml                ──> Konfigurasi Proyek Supabase
│   ├── seed.sql                   ──> Master Data Kategori Sistem
│   ├── migrations/                ──> Skrip Migrasi SQL Versioned
│   │   └── 20260915000001_initial_kaskita_schema.sql
│   └── functions/                 ──> Supabase Edge Functions (Deno / TypeScript)
│
├── mobile/                        ──> Aplikasi Utama (React Native / Expo)
└── guest-web/                     ──> Halaman Tagihan Web Instan (PWA Tanpa Install)
```

---

## 2. Arsitektur Folder Mobile (`bisnis/kaskita/mobile/src/`)

Aplikasi mobile KasKita mengadopsi pola **Feature-Based Clean Architecture** yang memisahkan logika antarmuka (UI), penanganan *state*, dan pemanggilan data backend:

```
bisnis/kaskita/mobile/
├── package.json
├── tsconfig.json
├── app.json
├── App.tsx                        ──> Entry Point Aplikasi (Root Navigator Wrapper)
├── assets/                        ──> Ikon Aplikasi, Splash Screen, Ilustrasi
│
└── src/
    ├── components/                ──> Komponen UI Reusable
    │   ├── common/                ──> Komponen Dasar Atomik
    │   │   ├── Button.tsx         ──> Tombol Primer, Sekunder, & Ghost
    │   │   ├── Card.tsx           ──> Kartu Kontainer Bersudut 16dp
    │   │   ├── Badge.tsx          ──> Badge Status (LUNAS, BELUM BAYAR)
    │   │   ├── Input.tsx          ──> Input Teks & Numeric Pad
    │   │   └── Modal.tsx          ──> Bottom Sheet & Dialog Mengambang
    │   │
    │   ├── wallet/                ──> Komponen Khusus Dompet Pribadi
    │   │   ├── NetWorthCard.tsx   ──> Kartu Saldo Bersih & Eye Toggle
    │   │   ├── WalletCard.tsx     ──> Kartu Dompet Horizontal
    │   │   └── AddWalletModal.tsx ──> Dialog Tambah Rekening/E-Wallet
    │   │
    │   ├── community/             ──> Komponen In-App Admin Komunitas
    │   │   ├── GroupHeaderCard.tsx──> Info RT & Lencana Bendahara
    │   │   ├── AdminToolbar.tsx   ──> Tombol Link WA, Buat Tagihan, Arisan
    │   │   ├── ReviewBanner.tsx   ──> Banner ⚠️ Review Bukti Transfer
    │   │   └── MemberRow.tsx      ──> Baris Status Warga & Tombol Colek WA
    │   │
    │   └── arisan/                ──> Komponen Arisan Digital
    │       ├── ArisanWheel.tsx    ──> Animasi Kocokan Silinder Digital
    │       └── WinnerModal.tsx    ──> Kartu Perayaan Pemenang & Tombol Share WA
    │
    ├── screens/                   ──> Halaman Layar Utama
    │   ├── home/
    │   │   └── HomeScreen.tsx     ──> Layar Beranda (The Personal Hub)
    │   ├── transactions/
    │   │   ├── TransactionListScreen.tsx ──> Riwayat Mutasi Lengkap
    │   │   └── AddTransactionScreen.tsx  ──> Form Catat Cepat (<5 Detik)
    │   ├── community/
    │   │   ├── CommunityListScreen.tsx   ──> Daftar Grup RT & Arisan
    │   │   ├── GroupDetailScreen.tsx     ──> Detail Grup (In-App Admin View)
    │   │   └── CreateInvoiceScreen.tsx   ──> Form Terbitkan Tagihan Massal
    │   ├── budget/
    │   │   └── BudgetScreen.tsx   ──> Batas Anggaran & Kalender Jatuh Tempo
    │   └── profile/
    │       └── ProfileScreen.tsx  ──> Pengaturan Akun, Keamanan, & Privasi
    │
    ├── navigation/                ──> Navigasi Aplikasi
    │   ├── RootNavigator.tsx      ──> Stack Navigator Utama
    │   └── BottomTabNavigator.tsx ──> Tab Bar Bawah (Beranda, Transaksi, Komunitas)
    │
    ├── services/                  ──> Komunikasi Data & API
    │   ├── supabase.ts            ──> Inisialisasi Klien Supabase
    │   ├── walletService.ts       ──> Query CRUD Dompet & Saldo
    │   ├── duesService.ts         ──> Query Tagihan Iuran & Stored Procedure
    │   ├── arisanService.ts       ──> Query Grup Arisan & Algoritma Kocok
    │   └── storageService.ts      ──> Upload Foto Bukti ke Cloudflare R2
    │
    ├── hooks/                     ──> Custom React Hooks
    │   ├── useWallets.ts          ──> State & Logika Dompet Pribadi
    │   ├── useTransactions.ts     ──> Logika Mutasi Masuk/Keluar
    │   ├── useCommunity.ts        ──> Data Komunitas & Anggota RT
    │   └── useZeroDoubleEntry.ts  ──> Prompt Otomasi Mutasi Kas Pribadi
    │
    ├── theme/                     ──> Desain Sistem & Tokens
    │   └── tokens.ts              ──> Colors, Spacing, Typography, Shadows
    │
    ├── utils/                     ──> Helper & Fungsi Bantu
    │   ├── formatCurrency.ts      ──> Format Rupiah (e.g. "Rp 50.000")
    │   ├── formatDate.ts          ──> Format Tanggal Indonesia
    │   └── deepLinkHelper.ts      ──> Generator URL WhatsApp `wa.me/?text=...`
    │
    └── types/                     ──> Tipe Spesifik Frontend
        └── navigation.ts          ──> TypeScript Types untuk Stack & Route Params
```

---

## 3. Arsitektur Halaman Web Guest (`bisnis/kaskita/guest-web/`)

Direktori ini menampung halaman web responsif yang dibuka warga saat mengklik tautan tagihan iuran dari WhatsApp:

```
bisnis/kaskita/guest-web/
├── package.json
├── index.html
├── src/
│   ├── App.tsx                    ──> Halaman Tunggal Tagihan Warga
│   ├── components/
│   │   ├── InvoiceSummary.tsx     ──> Rincian Tagihan Warga & Periode
│   │   ├── BankAccountCard.tsx    ──> Rekening BCA RT & Tombol Salin
│   │   ├── UploadProofArea.tsx    ──> Area Upload Foto Screenshot Transfer
│   │   └── DownloadAppBanner.tsx  ──> Ajakan Viral Unduh Aplikasi KasKita
│   └── services/
│       └── guestPaymentService.ts ──> Submit Bukti Bayar ke Supabase/R2
```

---

## 4. Konvensi Penamaan & Standar Rekayasa Kode

| Aspek | Standar Konvensi | Contoh Nyata |
| :--- | :--- | :--- |
| **Komponen UI** | PascalCase | `NetWorthCard.tsx`, `AdminToolbar.tsx` |
| **Hooks** | camelCase diawali `use` | `useWallets.ts`, `useZeroDoubleEntry.ts` |
| **Services & Utils** | camelCase | `duesService.ts`, `formatCurrency.ts` |
| **Dokumentasi Markdown** | kebab-case bernomor | `01-konsep-lean-canvas-prd.md`, `struktur-directory-kaskita.md` |
| **Tipe Data / Interface** | PascalCase | `User`, `Wallet`, `DuesInvoice` |
| **Variabel & Fungsi** | camelCase | `totalNetWorth`, `handleDrawArisan()` |
| **Konstanta Token** | UPPER_CASE atau PascalCase | `Colors.primary`, `Spacing.md` |

---

## 5. Ringkasan Keunggulan Struktur Ini

1. **Prinsip Modularitas Solopreneur:** Anda dapat mengerjakan satu komponen secara terisolasi tanpa khawatir merusak bagian lain (*decoupled components*).
2. **Kesiapan Kolaborasi & Skalabilitas:** Jika di masa depan Anda merekrut tim tambahan (developer atau tester), struktur ini mudah dipahami dalam hitungan menit karena mengikuti standar baku industri React Native & Supabase.
3. **Single Source of Truth:** Seluruh kontrak data tersentralisasi di `shared/types.ts`, sehingga aplikasi mobile dan web guest selalu sinkron.

---
*Dokumen acuan lainnya:*
- [[bisnis/kaskita/README|Dashboard Utama KasKita]]
- [[bisnis/kaskita/operasional/perencanaan-pengembangan-kaskita|Rencana Pengembangan & WBS]]
- [[bisnis/kaskita/desain/eksplorasi-ui-ux-kaskita|Eksplorasi Desain UI/UX]]
