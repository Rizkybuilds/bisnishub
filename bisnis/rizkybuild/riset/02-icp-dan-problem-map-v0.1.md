---
title: "ICP & Problem Map v0.1 — AI Automation Service Wedge"
date: "2026-09-24"
bisnis: rizkybuild
kategori: riset
status: active
tags:
  - bisnis/rizkybuild
  - kategori/riset
  - icp
  - problem-map
  - service-wedge
  - pricing
---

# 🎯 ICP & Problem Map v0.1 — RizkyBuild

> [!abstract] **Tujuan Dokumen**
> Menentukan secara konkret **siapa yang pertama kali kita layani**, masalah manual apa yang paling menyita waktu mereka, mana yang layak diotomasi, berapa nilai ekonomisnya, dan menetapkan **3–5 service wedge pertama** yang siap dijual.

---

## 1. Menentukan Ideal Customer Profile (ICP #1)

Untuk peluncuran awal layanan automasi, kita membedah 3 kandidat segmen pasar:

| Parameter | Segmen A: Korporasi / Enterprise | Segmen B: Solopreneur / Pemula Nol Budget | Segmen C: Pragmatic SMB Operator (PILIHAN UTAMA) |
|---|---|---|---|
| **Contoh Bisnis** | Perusahaan multinasional, BUMN | Kreator pemula, dropshipper dropship | Brand fashion e-commerce, percetakan B2B, manufaktur ringan, agensi digital lokal |
| **Omset Bulanan** | > Rp 1 Miliar | < Rp 10 Juta | **Rp 50 Juta – Rp 500 Juta** |
| **Ukuran Tim** | 50+ karyawan | Sendirian | **2 – 10 orang** (ada 1–3 admin chat/operasional) |
| **Siklus Keputusan** | 3–6 bulan (birokrasi PO) | Spontan tapi mikir panjang | **1–3 hari** (langsung bicara dengan Founder/Owner) |
| **Willingness to Pay** | Sangat tinggi, tapi syarat rumit | Rendah sekali | **Tinggi** (jika memangkas biaya admin atau menaikkan closing) |
| **Verdict** | ❌ Terlalu lambat untuk cash flow | ❌ Terlalu melelahkan meladeni komplain | 🟢 **ICP TARGET TAHAP 1 (SWEET SPOT)** |

### Karakteristik Rinci ICP #1 (The Pragmatic SMB Operator):
- **Siapa Mereka:** Owner bisnis pemilik toko online, brand busana/apparel lokal, percetakan, katering, atau bengkel spesialis.
- **Titik Sakit Terbesar:**
  - Owner masih merangkap "Super-Admin" yang harus standby membalas chat WhatsApp malam-malam.
  - Mempekerjakan 1–2 staf admin (gaji Rp 2.500.000 – Rp 4.000.000/bulan per staf), tetapi sering terjadi kelalaian: chat lambat dibalas, salah ketik nominal penawaran, lupa mencatat struk belanja operasional.
  - Ingin operasional rapi tapi tidak paham koding, tidak punya waktu belajar n8n/Python, dan trauma membeli software ERP mahal yang terlalu rumit dipakai stafnya.

---

## 2. Problem Audit & Economic Value Matrix

Berikut adalah 4 masalah operasional berulang yang paling layak diotomasi:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        PROBLEM & ECONOMIC VALUATION MATRIX                             │
├────────────────────┬─────────────────────────────┬─────────────────────────────────────┤
│ Problem            │ Biaya Manual Tanpa AI       │ Nilai Penghematan Solusi Automasi   │
├────────────────────┼─────────────────────────────┼─────────────────────────────────────┤
│ 1. WhatsApp Lead   │ • Admin balas >30 menit     │ • Respon <15 detik otomatis         │
│    Qualification & │ • 70% chat penanya iseng    │ • Filter lead serius 24/7           │
│    Routing         │ • Kerugian: Rp 5–15 jt/bln  │ • Hemat 3 jam kerja admin per hari  │
│                    │   karena calon buyer kabur  │ • Nilai: Rp 3.000.000+/bulan        │
├────────────────────┼─────────────────────────────┼─────────────────────────────────────┤
│ 2. Pembuatan       │ • 1 penawaran butuh 15–30   │ • Penawaran terbit dalam 60 detik   │
│    Quotation &     │   menit hitung manual       │ • Margin terkunci otomatis (anti-   │
│    Kalkulasi HPP   │ • Risiko salah hitung HPP   │   boncos), draf PDF terkirim di WA  │
│                    │ • Kerugian: Prospek batal   │ • Nilai: Rp 2.500.000+/bulan        │
├────────────────────┼─────────────────────────────┼─────────────────────────────────────┤
│ 3. Struk Belanja   │ • Nota fisik berserakan     │ • Foto nota via WA/Telegram         │
│    OCR ke Buku Kas │ • Tutup buku butuh 2 hari   │ • Data terekstrak ke Sheets dalam   │
│    (Expense OCR)   │ • Kebocoran kas kasbon      │   10 detik (idempotent, no typo)    │
│                    │ • Kerugian: Stres akhir bln │ • Nilai: Rp 1.500.000+/bulan        │
├────────────────────┼─────────────────────────────┼─────────────────────────────────────┤
│ 4. Post-Purchase   │ • Lupa kirim nomor resi     │ • Notifikasi resi otomatis + link WA│
│    Follow-up &     │ • Tidak ada survey kepuasan │ • Survey kepuasan otomatis H+3      │
│    Review Request  │ • Repeat order rate rendah  │ • Tingkatkan repeat order 10–20%    │
│                    │ • Kerugian: LTV pelanggan   │ • Nilai: Rp 2.000.000+/bulan        │
└────────────────────┴─────────────────────────────┴─────────────────────────────────────┘
```

---

## 3. Tiga (3) Service Wedge Pertama yang Dijual

Kita menolak menjual "Konsultasi AI" yang abstrak. Kita menjual **hasil terukur (outcome-based packages)**:

### 📦 WEDGE 1: WhatsApp Fast-Response & Lead Qualification Engine
- **Target Klien:** Bisnis e-commerce, konveksi/percetakan, klinik kecantikan, atau jasa renovasi yang menerima >30 chat WA/hari.
- **Komponen Solusi:**
  - Integrasi WhatsApp Gateway (Fonnte / Waha / Baileys).
  - Alur kualifikasi AI: menyapa ramah, menanyakan produk yang dicari, budget/qty, dan lokasi kirim.
  - Logika percabangan: Jika "Hot Lead" $\rightarrow$ teruskan notifikasi instan ke WhatsApp pribadi owner/sales penutup.
  - Sinkronisasi data prospek otomatis ke Google Sheets / Notion CRM.
- **Harga Penawaran:** **Rp 2.900.000** (Setup satu kali) + Opsional Retainer Rp 450.000/bulan (maintenance & monitoring).
- **Waktu Pengerjaan:** 3–4 hari kerja.

### 📦 WEDGE 2: Instant Quotation & Digital Work Order Generator
- **Target Klien:** Bisnis B2B berbasis kustomisasi (percetakan, sablon garmen, packaging kardus, bengkel las).
- **Komponen Solusi:**
  - Formulir input spesifikasi (Web Form / Telegram Bot / Chatbot WA).
  - Formula perhitungan HPP + margin lantai otomatis berbasis aturan bisnis klien.
  - Generator PDF penawaran resmi berpenomoran otomatis (format rapi, logo klien, terms of payment).
- **Harga Penawaran:** **Rp 3.900.000 – Rp 5.500.000** (Setup satu kali).
- **Waktu Pengerjaan:** 5–7 hari kerja.

### 📦 WEDGE 3: AI Expense Receipt OCR to Spreadsheet
- **Target Klien:** Bisnis retail/manufaktur dengan banyak pembelian bahan baku harian oleh staf lapangan.
- **Komponen Solusi:**
  - Bot Telegram / WhatsApp khusus staf internal.
  - Staf cukup memfoto struk kasir / bon tulisan tangan.
  - Model Gemini Multimodal OCR mengekstrak: Nama Toko, Tanggal, Rincian Barang, Total Nominal, dan Metode Bayar.
  - Otomatis tersimpan ke baris Google Sheets / Supabase dengan validasi idempotensi (mencegah nota dobel).
- **Harga Penawaran:** **Rp 1.900.000** (Setup satu kali).
- **Waktu Pengerjaan:** 2 hari kerja.

---

## 4. Alur Validasi Lapangan: MultiGraph Sebagai Sandbox #0

Sebelum menjual Wedge 1, 2, dan 3 ke klien luar:
1. **Wedge 1 (Lead Qualification):** Diimplementasikan pertama kali di **TeeStock Custom Atelier** (meng-handle inquiry sablon kaos partai besar via WhatsApp).
2. **Wedge 2 (Instant Quotation):** Diimplementasikan di modul **MGBOS Quoter** (menghitung HPP kaos NSA + DTF print + margin CFO).
3. **Wedge 3 (Receipt OCR):** Diimplementasikan di sistem pencatatan nota kasbon operasional **MultiGraph Holding**.

> [!success] **Hasilnya:**
> Semua bug, kendala teknis, dan kasus anomali diselesaikan terlebih dahulu di dalam bisnis sendiri.
> Saat ditawarkan ke klien luar, Anda tidak sedang menjual spekulasi—Anda menjual **solusi yang sudah teruji menghasilkan uang di pabrik Anda sendiri.**

---
*Navigasi: [[bisnis/rizkybuild/README|Hub RizkyBuild]] | [[bisnis/rizkybuild/riset/01-ai-builder-business-blueprint-v1|Blueprint v1]]*
