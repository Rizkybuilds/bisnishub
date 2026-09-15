---
title: "Tahap 1: Konsep, Lean Canvas & PRD Scope MVP — KasKita"
date: "2026-09-15"
bisnis: kaskita
kategori: riset
status: active
tags:
  - bisnis/kaskita
  - konsep
  - lean-canvas
  - prd
  - mvp
---

# Tahap 1: Konsep, Lean Canvas & PRD Scope MVP — KasKita

> [!abstract] Visi & Ringkasan Dokumen
> Dokumen ini mendefinisikan model bisnis fundamental (**Lean Canvas**) dan spesifikasi persyaratan produk versi minimum (**Product Requirement Document / PRD MVP**) untuk **KasKita**. Dokumen telah diselaraskan dengan paradigma arsitektur **Hub & Spoke**: menjadikan pembukuan keuangan pribadi harian sebagai poros keterikatan pengguna (*daily retention*), dan urusan komunal (kas RT, arisan, utang teman) sebagai modul sosial yang terintegrasi otomatis (*Zero Double-Entry*).

---

## BAGIAN 1: LEAN CANVAS (Model Bisnis & Strategi Produk)

| Blok Lean Canvas | Penjelasan Spesifik untuk KasKita (Hub & Spoke SaaS) |
| :--- | :--- |
| **1. Problem (Masalah Utama)** | • **Kejenuhan Catat Manual:** Pengguna aplikasi personal finance berhenti mencatat setelah 2 minggu karena lelah menginput setiap transaksi.<br>• **Double-Entry Friction:** Bayar iuran RT atau arisan harus dicatat dua kali (di grup dan di aplikasi pribadi).<br>• **Rasa Sungkan & Canggung:** Pengurus RT dan individu merasa tidak nyaman menagih iuran atau utang secara manual via chat pribadi.<br>• **Transparansi Rendah:** Pembukuan manual kas RT memicu prasangka warga terhadap integritas bendahara. |
| **2. Customer Segments (Target Pengguna)** | • **Segmen A (Personal / End-User):** Individu usia 20–45 tahun yang ingin mengontrol pengeluaran multi-dompet harian dan melacak pinjaman utang-piutang santai.<br>• **Segmen B (Komunal / Grup):** Pengurus RT/RW, bendahara paguyuban kompleks, panitia arisan keluarga atau kantor. |
| **3. Unique Value Proposition (UVP)** | *"Satu dompet untuk catat pengeluaran harian, kelola iuran RT, kocok arisan, hingga tagih utang tanpa catat dobel."* |
| **4. Solution (Fitur Inti MVP)** | • **Personal Core Hub:** Multi-dompet (BCA, Kas Tunai, GoPay), pencatatan harian cepat, limit anggaran, dan kalender jatuh tempo.<br>• **Modular Spokes:** Pengelolaan iuran warga bulanan, kocokan arisan digital transparan, dan pelacak utang-piutang.<br>• **Zero Double-Entry Engine:** Mutasi komunal otomatis memotong/menambah saldo dompet pribadi yang dipilih. |
| **5. Channels (Saluran Distribusi)** | • **Bottom-up Product-Led Growth (PLG):** 1 bendahara RT mengadopsi KasKita $\rightarrow$ otomatis mengundang 40–80 warga mendownload aplikasi dengan zero CAC.<br>• Komunitas pengurus RT/RW via grup WhatsApp, Telegram, dan Facebook.<br>• Konten edukasi finansial praktis & drama penagihan arisan/utang di TikTok & Instagram Reels. |
| **6. Revenue Streams (Model Pendapatan)** | • **Freemium:** Fitur keuangan pribadi 100% gratis; ruang komunal gratis hingga 15 anggota aktif.<br>• **Komunitas Pro SaaS (Subscription):** Rp29.000 – Rp79.000 / bulan per workspace (>15 anggota, laporan PDF/Excel formal, multi-admin, WhatsApp Bot Gateway).<br>• **Biaya Transaksi (Masa Depan):** Biaya administrasi Rp1.000 – Rp2.000 per transaksi saat payment gateway terpasang. |
| **7. Cost Structure (Struktur Biaya)** | • Managed Cloud Database (Supabase Pro / PostgreSQL): ~USD 25/bulan.<br>• Cloud Storage Bukti Transfer: Cloudflare R2 (gratis egress bandwidth, ~USD 0.015/GB).<br>• WhatsApp Gateway: Tier Free menggunakan client deep link `wa.me` (biaya Rp0), Tier Pro menggunakan official API terbayar.<br>• Akun Developer Google Play Store ($25 sekali bayar) & Apple Developer ($99/tahun). |
| **8. Key Metrics (Metrik Keberhasilan)** | • **D30 Retention:** $> 35\%$ pengguna aktif di hari ke-30.<br>• **Viral Coefficient ($K$-factor):** $> 1.2$ dari undangan tautan iuran warga & arisan.<br>• **Collection Rate:** $> 90\%$ tagihan iuran sukses terkonfirmasi dalam 10 hari pertama.<br>• **Sync Rate:** $> 75\%$ konfirmasi komunal disinkronkan ke buku kas pribadi. |
| **9. Unfair Advantage (Keunggulan Kompetitif)** | Poros **Hub & Spoke** yang mengawinkan frekuensi buka harian (DAU) dengan jaringan sosial komunal masyarakat Indonesia, didukung mesin *Zero Double-Entry* yang belum dimiliki kompetitor. |

---

## BAGIAN 2: PRD RINGKAS (Scope MVP)

### 1. Tujuan Produk (Product Objectives)
Membangun aplikasi versi minimum (MVP) yang praktis berbasis:
1. **Mobile App (Flutter):** Aplikasi tunggal (*Single Codebase*) untuk semua pengguna. Pengurus RT/Arisan mengelola grup langsung dari ponsel (**WhatsApp-Style In-App Admin** tanpa butuh laptop), sementara warga/individu mengelola kas pribadi dan membayar iuran.
2. **Zero-Install Web Guest Link:** Halaman web instan yang ringan bagi warga yang belum mengunduh aplikasi, agar tetap dapat melihat rincian tagihan, menyalin nomor rekening kas, dan mengunggah bukti transfer langsung via peramban HP mereka dari link WhatsApp.
3. **Zero Double-Entry Sync:** Menghilangkan beban catat ganda melalui sinkronisasi instan kas komunal ke kas pribadi.

---

### 2. Arsitektur Akses: Model Hub & Spoke

Setiap pengguna memiliki satu akun tunggal berbasis Nomor WhatsApp/Email yang memegang **Buku Kas Pribadi (Hub)** serta dapat terhubung ke beberapa **Workspace Komunal (Spokes)**:

```
[Akun Pengguna: Budi Santoso]
   │
   ├── THE CORE HUB (Pribadi - 100% Privat)
   │    ├── Multi-Dompet: Dompet Tunai, Bank BCA, GoPay
   │    ├── Budgeting: Batas pengeluaran bulanan
   │    └── Kalender Finansial: Gabungan tagihan pribadi & sosial
   │
   ├── SPOKE 1: Workspace RT 05 Sukamaju
   │    └── Peran: Bendahara / Admin (Kelola tarif iuran, setujui transfer, rekap kas)
   │
   └── SPOKE 2: Workspace Arisan Keluarga Besar
        └── Peran: Member (Lihat riwayat putaran, kocokan digital, konfirmasi setor)
```

---

### 3. Ruang Lingkup Fitur MVP (MoSCoW Prioritization)

#### A. MUST-HAVE (Wajib Ada di Rilis MVP)

##### 1. Autentikasi & Manajemen Akun
* Registrasi dan login cepat menggunakan **Nomor WhatsApp (OTP)** atau **Email OTP**.
* Profil pengguna, manajemen nomor kontak, dan pengaturan keamanan (PIN/Biometrik pada mobile).

##### 2. Core Engine Keuangan Pribadi (The Hub)
* **Multi-Dompet (Wallets):** Pengguna dapat membuat kantong saldo terpisah (misal: *Dompet Saku, Rekening BCA, E-Wallet GoPay*).
* **Pencatatan Cepat (Quick Input):** Catat Pemasukan atau Pengeluaran dalam waktu kurang dari 5 detik (Pilih dompet, nominal, kategori, catatan).
* **Budgeting Sederhana:** Menetapkan batas anggaran bulanan per kategori utama.
* **Kalender Kewajiban:** Menampilkan tagihan yang akan jatuh tempo dalam bulan berjalan.

##### 3. Modul Iuran Komunitas (Spoke Iuran)
* **Untuk Pengurus / Bendahara (Admin):**
  * Membuat master kategori iuran (contoh: *Iuran Sampah Rp30.000*, *Iuran Keamanan Rp50.000*).
  * Menghasilkan tagihan massal berulang (*bulk monthly invoice generation*).
  * Verifikasi pembayaran: Menerima bukti transfer atau menandai lunas untuk setoran tunai.
  * Laporan arus kas komunitas: Total Kas Masuk, Kas Keluar, dan Saldo Terkini.
* **Untuk Warga / Anggota (Member):**
  * Kartu status tagihan bulan berjalan dan riwayat bulan-bulan lampau.
  * Tombol *"Saya Sudah Bayar"* dilengkapi unggah foto bukti transfer.
  * Dasbor transparansi saldo kas bersama untuk mencegah kecurigaan.

##### 4. Modul Arisan Digital (Spoke Arisan)
* **Untuk Admin:**
  * Pengaturan grup arisan: Judul, nominal setor per periode, siklus putaran (mingguan/bulanan), dan pendaftaran slot nomor anggota.
  * **Kocok Digital (Randomizer Engine):** Mengundi pemenang secara acak dan adil dari peserta yang telah lunas dan belum pernah menang pada siklus berjalan.
* **Untuk Member:**
  * Riwayat pemenang putaran terdahulu dan daftar anggota yang belum mendapat giliran.
  * Jadwal kocokan berikutnya dan nominal yang harus disetor.

##### 5. Modul Utang Piutang P2P (Social Debt Spoke)
* Pencatatan dua arah:
  * **Saya Berutang (Payable):** Pihak peminjam, nominal, tanggal jatuh tempo.
  * **Piutang Teman (Receivable):** Nama peminjam, nomor WhatsApp, nominal, jatuh tempo.
* Status pencatatan: `Belum Lunas`, `Cicilan Sebagian`, `Lunas`.
* Log riwayat pembayaran parsial/cicilan.

##### 6. Mesin Sinkronisasi Otomatis (Zero Double-Entry Engine)
* Ketika pembayaran iuran RT disetujui atau kocokan arisan dimenangkan, sistem memunculkan prompt konfirmasi:  
  *"Catat pembayaran Rp50.000 ini ke Dompet BCA Anda?"* (Pilihan: Ya / Lewati).
* Jika pengguna mengaktifkan auto-sync default, mutasi dompet langsung tercatat otomatis.

##### 7. Anti-Sungkan Reminder Engine
* Deteksi otomatis jatuh tempo pada H-3, H-1, dan Hari H.
* Notifikasi via **In-App Push Notification**.
* Pembuat tautan pesan WhatsApp ramah/sopan (*client-side deep link* `wa.me`) yang dapat dikirim bendahara tanpa mengetik ulang pesan.

---

#### B. SHOULD-HAVE (Penting, Dirilis Bertahap Pasca-MVP)
* Ekspor rekapitulasi kas RT ke file format PDF & Excel berstandar papan pengumuman.
* WhatsApp Notification Gateway resmi berbasis API terpusat untuk akun komunitas berbayar.
* Kustomisasi ikon dan warna kategori dompet pribadi.

---

#### C. COULD-HAVE (Fitur Pelengkap Masa Depan)
* Dark Mode antarmuka.
* Integrasi scan kuitansi belanja berbasis OCR ringan.
* Ekspor laporan tahunan SPT pajak pribadi sederhana.

---

#### D. WON'T-HAVE (TIDAK Dibuat di Fase MVP)
* Integrasi Payment Gateway langsung (Virtual Account / QRIS otomatis berbiaya admin). *Fokus menguji adopsi manual transfer & cash terlebih dahulu.*
* Fitur simpan-pinjam berbunga atau kredit komersial (menghindari regulasi OJK P2P lending).
* Multi-currency (hanya mendukung mata uang Rupiah/IDR).

---

### 4. Non-Functional Requirements (Kebutuhan Non-Fungsional)

1. **Kecepatan & Ringan di Mobile:** Aplikasi mobile harus dapat beroperasi lancar pada ponsel entry-level Android (RAM 3–4 GB) dengan konsumsi kuota hemat.
2. **Kepatuhan Privasi Data (UU PDP No. 27 Tahun 2022):**
   * Data mutasi pribadi, saldo dompet, dan utang-piutang milik pengguna bersifat **100% rahasia**. Admin RT tidak memiliki hak akses teknis terhadap database pribadi warga.
   * Nomor telepon dan data warga di satu workspace RT terisolasi dan tidak dapat dilihat oleh workspace RT lain.
3. **Efisiensi Cloud Storage Bukti Bayar:** Seluruh gambar bukti transfer dikompresi otomatis di sisi klien sebelum diunggah (format WebP, resolusi maksimal 1080p, ukuran file $< 300\text{ KB}$).

---

### 5. Aturan Bisnis Kunci (Key Business Rules)

1. **Integritas Kocokan Arisan:** Anggota yang telah tercatat sebagai pemenang pada satu siklus **dikunci secara absolut** dan tidak dapat diundi kembali hingga seluruh anggota lain telah memenangkan giliran.
2. **Akumulasi Tunggakan Iuran:** Warga yang belum membayar iuran bulan lalu akan melihat tagihan terakumulasi secara otomatis di bulan berikutnya.
3. **Otoritas Pembukuan Kas:** Hanya peran `OWNER` dan `ADMIN` yang berhak membuat mutasi pengeluaran kas komunitas. Anggota biasa hanya memiliki hak baca (*read-only* transparansi).

---
*Langkah berikutnya:* Pelajari rancangan navigasi dan alur layar pada [[bisnis/kaskita/02-ia-dan-user-flow|02-ia-dan-user-flow.md]].
