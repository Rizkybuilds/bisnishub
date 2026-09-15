---
title: "KasKita — Dashboard Bisnis & Indeks Dokumentasi"
date: "2026-09-15"
bisnis: kaskita
kategori: catatan
status: active
tags:
  - bisnis/kaskita
  - fintech
  - saas
  - personal-finance
  - community-finance
---

# 💰 KasKita

> **Aplikasi Keuangan Pribadi Harian & Otomasi Finansial Komunitas**  
> *"Satu dompet untuk catat pengeluaran harian, kelola iuran RT, kocok arisan, hingga tagih utang tanpa catat dobel."*

**Status:** 🟡 Fase Perencanaan & Validasi Arsitektur (Siap Eksekusi Sprint 1)  
**Target Pasar:** Solopreneur, Warga Lingkungan Perumahan/RT-RW, Pengurus Komunitas, Anggota Arisan Keluarga/Kantor, dan Individu Urban Indonesia.

---

## 📌 Ringkasan Eksekutif & Visi Produk

**KasKita** memecahkan dua masalah finansial mendasar masyarakat Indonesia sekaligus:
1. **Kejenuhan Pencatatan Pengeluaran Harian:** Sebagian besar pengguna menyerah memakai aplikasi personal finance (Money Lover, Spendee, Catatan Keuangan) setelah 2 minggu karena lelah menginput setiap transaksi secara manual.
2. **Friksi & Rasa Sungkan Finansial Sosial:** Pengelolaan iuran RT, kas paguyuban, kocokan arisan, dan utang-piutang santai antar-teman masih dilakukan manual di buku tulis/Excel dan ditagih satu per satu via WhatsApp, memicu rasa canggung (*sungkan*) serta rawan kecurigaan.

### Solusi Unik: Paradigma "Hub & Spoke" dengan Mesin Zero Double-Entry
KasKita tidak memisahkan keuangan pribadi dari kehidupan sosial pengguna:
* **The Core Hub (Pribadi):** Dasbor harian pencatatan multi-dompet (Tunai, Rekening Bank, e-Wallet), pengeluaran rutin, limit anggaran bulanan, dan kalender kewajiban jatuh tempo.
* **The Modular Spokes (Komunitas):** Modul Iuran RT/Kompleks, Modul Arisan Digital Transparan, dan Modul Utang Piutang P2P.
* **The Zero Double-Entry Engine:** Begitu iuran RT diverifikasi bendahara atau uang arisan cair, sistem otomatis mencatat mutasi pengeluaran/pemasukan ke dompet pribadi pengguna tanpa perlu input ulang.

---

## 🏛️ Peta Navigasi Dokumentasi KasKita

Dokumentasi KasKita distandarisasi untuk memenuhi kebutuhan tim pengembang, desainer UI/UX, dan pemangku kepentingan bisnis:

| No | Dokumen | Ruang Lingkup & Isi Utama | Tautan Langsung |
|---|---|---|---|
| **01** | **Konsep & PRD MVP** | Lean Canvas, Problem-Solution Fit, MoSCoW Feature Matrix, Non-Functional Requirements, Key Business Rules | [[bisnis/kaskita/01-konsep-lean-canvas-prd\|01-konsep-lean-canvas-prd.md]] |
| **02** | **IA & User Flow** | Sitemap Global Hub & Spoke, Bottom Navigation, 4 Core User Flows (Onboarding, Iuran, Arisan, Utang), UI RBAC Matrix | [[bisnis/kaskita/02-ia-dan-user-flow\|02-ia-dan-user-flow.md]] |
| **03** | **Sistem & Database** | Arsitektur High-Level, DDL PostgreSQL lengkap (Multi-Wallet, Budgets, Workspaces, Invoices, Arisan, Debts, Transactions, Reminders), Row Level Security (RLS), ACID rules | [[bisnis/kaskita/03-arsitektur-sistem-dan-database\|03-arsitektur-sistem-dan-database.md]] |
| **04** | **API Contract & WBS** | Spesifikasi RESTful API, WBS Sprint 1–6 (6 Minggu Peluncuran MVP), Kepatuhan UU PDP No. 27/2022, Disclaimer Keuangan Non-OJK/BI, Strategi Hemat Biaya WhatsApp | [[bisnis/kaskita/04-spesifikasi-api-dan-sprint-roadmap\|04-spesifikasi-api-dan-sprint-roadmap.md]] |
| **05** | **Strategi Hub & Spoke** | Analisis retensi DAU vs MAU, Trigger Matrix Zero Double-Entry, Viral Growth Loop ($K$-factor > 1.2), Model Monetisasi Freemium & Komunitas SaaS | [[bisnis/kaskita/05-strategi-produk-hub-and-spoke\|05-strategi-produk-hub-and-spoke.md]] |
| **Desain** | **Eksplorasi UI/UX** | Sistem Desain "Modern Emerald", Token Warna, Tipografi, Wireframe Beranda, In-App Admin RT, & Arisan Digital | [[bisnis/kaskita/desain/eksplorasi-ui-ux-kaskita\|desain/eksplorasi-ui-ux-kaskita.md]] |
| **Ops** | **Rencana Pengembangan** | Strategi Solopreneur Lean, Alokasi 18 Jam/Minggu, Monorepo Architecture, WBS Detail Jam Sprint 1–6, Exit Criteria | [[bisnis/kaskita/operasional/perencanaan-pengembangan-kaskita\|operasional/perencanaan-pengembangan-kaskita.md]] |
| **Ops** | **Struktur Direktori** | Cetak Biru Monorepo, Standarisasi Folder Mobile Feature-Based Clean Architecture, dan Konvensi Kode | [[bisnis/kaskita/operasional/struktur-directory-kaskita\|operasional/struktur-directory-kaskita.md]] |
| **Riset** | **Pasar & Kompetitor** | Analisis komparatif lanskap fintech Indonesia (RTPINTAR, Kasmini, Iuran Warga, Money Lover, BukuKas), White Space kas harian vs sosial | [[bisnis/kaskita/riset/analisis-pasar-dan-kompetisi\|riset/analisis-pasar-dan-kompetisi.md]] |

---

## ⚙️ Ringkasan Arsitektur Teknologi (Mobile-First Lean Architecture)

```
[Mobile App KasKita (React Native / Expo)]         [Zero-Install Web Guest Link]
(Personal Finance + In-App WhatsApp-Style Admin)   (Warga Cek Tagihan & Upload Bukti via WA)
                         │                                       │
                         └───────────────────┬───────────────────┘
                                             ▼
                              [Supabase Backend & Edge API]
                                             │
                   ┌─────────────────────────┴─────────────────────────┐
                   ▼                                                   ▼
         [PostgreSQL Database]                               [Storage Cloudflare R2]
       • Multi-Wallet (Cash/Bank/e-Wallet)                   (Bukti Bayar WebP <300KB)
       • Workspaces & Dues Invoices
       • Arisan Rounds & P2P Debts                                     │
       • Row-Level Security (RLS Privasi)                              ▼
                   │                                         [WhatsApp Delivery Engine]
                   ▼                                         • Free: Client Deep-Link wa.me
         [Universal Cashflow Ledger]                         • Pro: Official WA API Gateway
         (Zero Double-Entry Sync Engine)
```

---

## 📈 Indikator Kunci Keberhasilan (Key Metrics)

1. **Retensi Pengguna Day-30 (D30 Retention):** Target $> 35\%$ (didukung oleh pencatatan kas harian personal).
2. **K-Factor Viralitas Komunitas:** Target $> 1.2$ (1 bendahara mengonversi 30–80 warga menjadi pengguna aktif).
3. **Collection Rate Iuran:** Target $> 90\%$ iuran warga terkonfirmasi sebelum tanggal 10 tiap bulan.
4. **Tingkat Adopsi Zero Double-Entry:** $> 75\%$ pembayaran iuran sosial disetujui pengguna untuk dicatat otomatis ke kas pribadi.

---
*Dikelola di bawah panduan:* `[[GEMINI.md]]`
