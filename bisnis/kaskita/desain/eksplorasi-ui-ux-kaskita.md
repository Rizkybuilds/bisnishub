---
title: "Eksplorasi & Perencanaan UI/UX — KasKita Mobile"
date: "2026-09-15"
bisnis: kaskita
kategori: brand
status: active
tags:
  - bisnis/kaskita
  - ui-ux
  - mobile-design
  - design-system
  - wireframe
  - user-journey
---

# Eksplorasi & Perencanaan UI/UX — KasKita Mobile

> [!abstract] Visi Desain Antarmuka
> KasKita dirancang dengan filosofi **"Human-Centric Financial Simplicity"**. Antarmuka harus terasa seringan dan seakrab aplikasi obrolan harian (*WhatsApp-familiar*), menghilangkan kecanggungan birokrasi perbankan, serta memberikan kepuasan instan saat mengelola uang pribadi maupun kas sosial.

---

## 1. Persona Pengguna & Mental Models di Indonesia

| Persona | Karakter & Konteks Penggunaan | Kebutuhan Utama UI/UX | Prinsip Desain Kunci |
| :--- | :--- | :--- | :--- |
| **Pak RT / Bendahara Komunitas**<br>*(Admin Komunal)* | Usia 35–55 tahun. Mengurus iuran sambil ronda, di pos satpam, atau santai malam di rumah via HP. | • 1-tap broadcast tagihan ke grup WhatsApp.<br>• Floating banner: *"3 Bukti Bayar Menunggu Review"*.<br>• Tombol Approve/Reject cepat. | **Zero PC Requirement:** Seluruh kendali admin harus muat dalam genggaman satu tangan (*Thumb-Friendly Navigation*). |
| **Ibu-Ibu Arisan / Panitia**<br>*(Social Organizer)* | Usia 25–50 tahun. Mengadakan kocokan di acara keluarga/kafe sambil membawa smartphone. | • Sensasi kocokan digital yang seru & transparan.<br>• Tombol *"Share Pemenang ke WhatsApp"* sekali klik. | **Delight & Transparency:** Animasi kocokan acak yang bisa dioper dan dilihat bersama seluruh peserta. |
| **Warga RT / Anggota Grup**<br>*(Payer / Guest Member)* | Sensitif memori HP dan kuota data. Enggan mengunduh aplikasi baru hanya untuk bayar iuran bulanan. | • Tautan web instan tanpa download (*Zero-Install*).<br>• Salin rekening bank 1-klik.<br>• Unggah screenshot bukti bayar dalam <5 detik. | **Zero Friction to Pay:** Halaman web PWA ringan yang terbuka dalam <1 detik dari pesan WhatsApp. |
| **Individu Urban / Solopreneur**<br>*(Daily Habit Tracker)* | Memiliki banyak rekening (BCA, Mandiri, Cash, GoPay). Ingin melacak arus kas harian tanpa lelah. | • Input pengeluaran super cepat (<5 detik).<br>• Posisi *Net Worth* multi-dompet.<br>• Otomasi pencatatan saat bayar iuran RT (*Zero Double-Entry*). | **Instant Value:** Input cepat dengan numeric keypad native, visualisasi batas anggaran warna hijau-kuning-merah. |

---

## 2. Eksplorasi 3 Arah Visual (Visual Directions)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ARAH 1: "Modern Emerald & Clean Slate" (DIREKOMENDASIKAN)                    │
│ Mood: Pertumbuhan Uang, Kehangatan Gotong Royong, Kepercayaan Finansial     │
│ Inspirasi: Bibit, Flip, GoPay, Apple Wallet                                 │
│ Palet: Primary Emerald (#059669), Slate (#0F172A), Warm Gold (#F59E0B)      │
│ Target: Sangat inklusif untuk semua usia (bapak-bapak RT hingga anak muda) │
└─────────────────────────────────────────────────────────────────────────────┘
                                      vs
┌─────────────────────────────────────────────────────────────────────────────┐
│ ARAH 2: "Royal Navy & Swiss Clean" (Perbankan Korporat & Otoritas Tinggi)    │
│ Mood: Presisi, Institusional, Kaku, Formal                                  │
│ Inspirasi: BCA Mobile Modern, Stripe, Wise                                  │
│ Palet: Primary Navy (#1E3A8A), Clean White (#FFFFFF), Neutral Gray          │
│ Catatan: Sangat dipercaya, namun kurang memiliki kehangatan sosial arisan  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      vs
┌─────────────────────────────────────────────────────────────────────────────┐
│ ARAH 3: "Neo-Fintech Card Stack" (Playful, Dark Mode Default, Bold)          │
│ Mood: Trendi, Komputasi Finansial, Gamifikasi                               │
│ Inspirasi: Monzo, Revolut, Cash App                                         │
│ Palet: Dark Slate (#090D16), Vibrant Lime (#84CC16), Cyber Purple           │
│ Catatan: Disukai Gen Z, namun berpotensi membingungkan pengurus RT senior   │
└─────────────────────────────────────────────────────────────────────────────┘
```

> [!tip] Rekomendasi Terpilih: Arah 1 ("Modern Emerald & Clean Slate")
> Arah ini menggabungkan **rasa aman finansial** (hijau zamrud melambangkan uang & laba) dengan **kehangatan komunal Indonesia** (aksen emas untuk kemenangan arisan & abu-abu netral yang bersih dan tidak melelahkan mata).

---

## 3. Sistem Desain & Token Visual (Design Tokens)

### A. Palet Warna (Color Palette)

| Kategori Token | Hex Code | Penggunaan di Antarmuka |
| :--- | :---: | :--- |
| **Primary (Emerald 600)** | `#059669` | Brand utama, tombol CTA primer, kartu saldo aktif, indikator lunas. |
| **Primary Light (Emerald 50)** | `#ECFDF5` | Background badge sukses, highlight baris tagihan lunas. |
| **Secondary (Amber Gold)** | `#F59E0B` | Badge pemenang arisan, kartu pengingat jatuh tempo, status pending review. |
| **Background App** | `#F8FAFC` | Latar belakang kanvas aplikasi mobile yang ramah mata (*Warm Slate 50*). |
| **Surface / Card** | `#FFFFFF` | Permukaan kartu transaksi, modul dompet, dan sheet modal. |
| **Foreground / Text Main** | `#0F172A` | Teks judul utama, nominal uang tebal (*Deep Slate 900*). |
| **Text Muted / Subtitle** | `#64748B` | Tanggal, catatan transaksi, label nomor rekening (*Slate 500*). |
| **Border / Divider** | `#E2E8F0` | Garis pemisah antar-transaksi tipis halus (*Slate 200*). |
| **Expense / Destructive** | `#EF4444` | Pengeluaran kas (-), indikator overbudget, tombol tolak bukti transfer. |
| **Income / Success** | `#10B981` | Pemasukan kas (+), tarikan arisan cair, konfirmasi approve. |

### B. Tipografi (Typography)
* **Font Family Utama:** **Plus Jakarta Sans** (Modern geometric sans-serif berlisensi terbuka, memiliki legibilitas angka finansial yang luar biasa).
* **Skala Tipografi:**
  - `Display / Hero Balance`: 32px / Bold (700) — *Saldo Net Worth*
  - `Heading 1 (Screen Title)`: 22px / SemiBold (600)
  - `Heading 2 (Card Header)`: 16px / SemiBold (600)
  - `Body Text (Reguler)`: 14px / Regular (400) & Medium (500)
  - `Caption & Metadata`: 12px / Regular (400) — *Tanggal & Jam*
  - `Micro Tag`: 10px / SemiBold (600) — *Badge STATUS*

### C. Jarak & Ukuran Sentuh (*Touch Target Rules*)
* **Minimum Tap Target:** $48 \times 48\text{ dp}$ untuk semua tombol aksi jempol.
* **Jarak Antar-Elemen (Spacing Gap):** Minimal $8\text{ dp}$ (menghindari salah klik di ponsel layar kecil).
* **Corner Radius:**
  - Kartu Dompet & Mutasi: $16\text{ dp}$ (ramah & modern).
  - Tombol Primer: $12\text{ dp}$.
  - Tag / Badge Status: $8\text{ dp}$.

---

## 4. Anatomi Kunci Wireframe Antarmuka Mobile

### LAYAR 1: Beranda Kas Pribadi (The Core Hub)

```
┌────────────────────────────────────────────────────────┐
│ [Foto Profil]  Halo, Budi Santoso!       [🔔 2 Alert]  │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ TOTAL KEKAYAAN BERSIH (NET WORTH)        [👁️ Sembunyi]│
│ │ Rp 12.450.000                                      │
│ │ (+) Masuk Bln Ini: Rp8.5jt   (-) Keluar: Rp4.2jt   │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ DOMPET SAYA (WALLETS)                 [+ Tambah Dompet]│
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │
│ │ 💵 Tunai     │ │ 🏦 Bank BCA  │ │ 📱 GoPay     │ ... │
│ │ Rp 450.000   │ │ Rp 11.200.000│ │ Rp 800.000   │     │
│ └──────────────┘ └──────────────┘ └──────────────┘     │
│                                                        │
│ ⚠️ KEWAJIBAN BULAN INI (3 AGENDA)                      │
│ ┌────────────────────────────────────────────────────┐ │
│ │ 🏢 Iuran RT 05 (Sampah & Ronda)                    │ │
│ │    Rp 50.000 • Jatuh Tempo H-2       [Bayar Cepat] │ │
│ ├────────────────────────────────────────────────────┤ │
│ │ 🎲 Arisan Keluarga Putaran #4                      │ │
│ │    Rp 100.000 • Status: LUNAS        [Lihat Putaran]│
│ ├────────────────────────────────────────────────────┤ │
│ │ 🤝 Utang ke Doni (Servis Motor)                    │ │
│ │    Rp 150.000 • Jatuh Tempo 28 Okt   [Catat Cicil] │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ PENGELUARAN TERAKHIR                     [Lihat Semua] │
│ • 🍛 Makan Siang Nasi Padang   -Rp 25.000  (Dompet BCA)│
│ • ⛽ Bensin Motor              -Rp 30.000  (Kas Tunai) │
│                                                        │
│                                       [ (+) CATAT ]    │
└────────────────────────────────────────────────────────┘
```

---

### LAYAR 2: Tab Komunitas — Tampilan Admin RT (WhatsApp-Style In-App Admin)

```
┌────────────────────────────────────────────────────────┐
│ < Kembali      RT 05 SUKAMAJU          [⚙️ Pengaturan] │
├────────────────────────────────────────────────────────┤
│ Status: KETUA / BENDAHARA RT             [48 Warga]    │
│ Saldo Kas Bersama: Rp 4.250.000                        │
│                                                        │
│ ┌────────────── TOOLBAR AKSI CEPAT ADMIN ────────────┐ │
│ │  [🔗 Tautan WA]   [📝 Buat Tagihan]   [🎲 Undi Arisan]│
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ 🔔 BANNER TINJAUAN BUKTI TRANSFER                      │
│ ┌────────────────────────────────────────────────────┐ │
│ │ ⚠️ 3 Warga Menunggu Verifikasi Pembayaran          │ │
│ │ [Budi Santoso - Rp50.000]   [Approve]  [Review Foto]│
│ │ [Bu Siti - Rp50.000]        [Approve]  [Review Foto]│
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ DAFTAR WARGA BULAN OKTOBER                             │
│ [🔍 Cari nama warga...]           [Filter: Belum Bayar]│
│ • Pak Ahmad       [LUNAS]        Rp 50.000  (BCA Transfer)│
│ • Mas Joko        [BELUM BAYAR]  Rp 50.000  [📲 Colek WA]│
│ • Bu Linda        [LUNAS]        Rp 50.000  (Kas Tunai) │
│                                                        │
│ KAS KELUAR BULAN INI                                   │
│ (-) Beli Lampu Gang Pos RT     -Rp 150.000 (04 Okt)    │
│                                  [+ Catat Kas Keluar]  │
└────────────────────────────────────────────────────────┘
```

---

### LAYAR 3: Interaksi Kocok Arisan Digital (Interactive Delight)

```
┌────────────────────────────────────────────────────────┐
│ < Batal         Kocokan Putaran #5        [Slot: 15/15]│
├────────────────────────────────────────────────────────┤
│ Total Uang Tarikan (Pot):                              │
│ Rp 1.500.000                                           │
│ Peserta yang Berhak Diundi: 7 Anggota Belum Menang    │
│                                                        │
│         ┌───────────────────────────────────┐          │
│         │                                   │          │
│         │       🎲 [ SILINDER PENGACAK ]    │          │
│         │          (Nama-nama berputar)     │          │
│         │                                   │          │
│         └───────────────────────────────────┘          │
│                                                        │
│         [  🎲 KOCOK ARISAN SEKARANG!  ]                │
│                                                        │
│ ────────────────────────────────────────────────────── │
│ SETELAH DIKLIK: MODAL POP-UP PEMENANG                  │
│                                                        │
│           🎉 SELAMAT KEPADA PEMENANG! 🎉               │
│               "IBU SITI RAHMAWATI"                     │
│                  (Nomor Slot #03)                      │
│                                                        │
│  Dana Tarikan: Rp 1.500.000                            │
│                                                        │
│  [ 📲 Bagikan Pengumuman Pemenang ke WhatsApp Grup ]   │
│  [ ✅ Catat Dana Cair ke Pemasukan Pribadi Ibu Siti ]  │
└────────────────────────────────────────────────────────┘
```

---

### LAYAR 4: Zero-Install Web Guest Link (Tampilan Warga via Browser HP)

```
┌────────────────────────────────────────────────────────┐
│ URL: kaskita.id/pay/rt05-okt-budi                      │
├────────────────────────────────────────────────────────┤
│ [Logo RT 05]   PAGUYUBAN WARGA RT 05 SUKAMAJU          │
│ Tagihan Iuran Warga — Periode Oktober 2026             │
│                                                        │
│ Nama Warga:   Budi Santoso (Blok B No. 12)             │
│ Rincian:      • Iuran Keamanan: Rp 30.000              │
│               • Iuran Sampah:   Rp 20.000              │
│ Total Bayar:  Rp 50.000                                │
│                                                        │
│ REKENING TUJUAN TRANSFER:                              │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Bank Central Asia (BCA)                            │ │
│ │ No. Rekening: 8820 1928 33                         │ │
│ │ A/N: KAS RT 05 SUKAMAJU      [📋 Salin No. Rekening]│ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ UNGGAH BUKTI TRANSFER:                                 │
│ ┌────────────────────────────────────────────────────┐ │
│ │   📸 [ Pilih Foto / Screenshot Bukti Transfer ]    │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│           [  KIRIM KONFIRMASI PEMBAYARAN  ]            │
│                                                        │
│ ────────────────────────────────────────────────────── │
│ 💡 INGIN KAS PRIBADIMU TERCATAT OTOMATIS?              │
│ Gunakan KasKita: Satu dompet untuk keuangan harian dan │
│ urusan warga tanpa repot catat dobel!                  │
│                [📲 Unduh Aplikasi KasKita]             │
└────────────────────────────────────────────────────────┘
```

---

## 5. Panduan Mikro-Interaksi & Haptic Feedback

1. **Haptic Saat Kocok Arisan:**
   - Ponsel bergetar berulang lembut (*light haptic vibration*) saat animasi silinder arisan berputar, diakhiri dengan getaran tegas (*medium impact*) saat kartu pemenang muncul di layar.
2. **Animasi Zero Double-Entry Success:**
   - Ketika bendahara menekan `Approve`, kartu tagihan warga berubah warna menjadi hijau lembut (`#ECFDF5`) dengan ikon centang bertransisi *scale-up* (150ms).
3. **Numeric Pad Entry:**
   - Input nominal uang pengeluaran harian langsung memunculkan papan ketik angka (*keyboardType: 'number-pad'*), dengan pemformatan otomatis ribuan Rupiah secara real-time (`Rp 50.000`).

---
*Dokumen ini menjadi acuan desain UI bagi implementasi komponen React Native / Expo di `bisnis/kaskita/mobile/`.*
