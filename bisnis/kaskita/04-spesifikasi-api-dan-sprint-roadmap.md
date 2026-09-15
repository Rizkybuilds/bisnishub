---
title: "Tahap 4: Spesifikasi API Contract & WBS Sprint Roadmap — KasKita"
date: "2026-09-15"
bisnis: kaskita
kategori: operasional
status: active
tags:
  - bisnis/kaskita
  - api
  - rest-api
  - roadmap
  - sprint
  - compliance
  - uu-pdp
---

# Tahap 4: Spesifikasi API Contract & WBS Sprint Roadmap — KasKita

> [!abstract] Ringkasan API & Roadmap
> Dokumen ini memuat kontrak teknis **RESTful API**, jadwal eksekusi bertahap selama **6 Minggu (WBS Sprints)**, strategi efisiensi biaya WhatsApp Gateway, serta klausul kepatuhan hukum **UU PDP No. 27/2022** dan *Disclaimer* finansial non-perbankan.

---

## BAGIAN 1: SPESIFIKASI GLOBAL API CONTRACT

### Standar Teknis API:
* **Base URL:** `https://api.kaskita.id/api/v1`
* **Autentikasi:** Bearer Token (JWT) di Header `Authorization: Bearer <TOKEN>`
* **Konteks Komunitas:** Header opsional `X-Workspace-Id: <WORKSPACE_UUID>` (khusus untuk endpoint modul komunal)
* **Format Response Envelope:**
```json
{
  "success": true,
  "message": "Deskripsi singkat hasil eksekusi",
  "data": {},
  "meta": {} // Opsional untuk paginasi (page, per_page, total)
}
```

---

## BAGIAN 2: DAFTAR ENDPOINT INTI MVP

### 1. Autentikasi & Pengguna
* `POST /auth/request-otp`
  * **Body:** `{"phone_number": "081234567890"}`
  * **Desc:** Mengirimkan kode 6-digit OTP ke WhatsApp pengguna.
* `POST /auth/verify-otp`
  * **Body:** `{"phone_number": "081234567890", "otp_code": "123456"}`
  * **Response Data:** `{"token": "ey...", "user": {"id": "UUID", "full_name": "Budi"}}`
* `GET /users/me`
  * **Desc:** Mengambil profil, preferensi notifikasi, dan pengaturan sinkronisasi otomatis.

---

### 2. Modul Personal Hub (Multi-Wallet & Budgeting)
* `GET /wallets`
  * **Desc:** Mengambil daftar seluruh dompet aktif pengguna beserta saldonya.
* `POST /wallets`
  * **Body:** `{"name": "BCA Pribadi", "wallet_type": "BANK", "balance": 1500000, "is_default": true}`
* `POST /transactions`
  * **Body:** 
    ```json
    {
      "wallet_id": "UUID_WALLET",
      "type": "EXPENSE",
      "amount": 35000,
      "category_id": "UUID_CAT_MAKANAN",
      "description": "Makan Siang Nasi Padang",
      "transaction_date": "2026-10-15"
    }
    ```
* `GET /budgets?period=2026-10`
  * **Desc:** Mengambil progres realisasi anggaran per kategori bulan berjalan.
* `GET /obligations/calendar?month=2026-10`
  * **Desc:** Agregasi seluruh kewajiban jatuh tempo (Iuran RT, Arisan, dan Cicilan Utang) dalam format kalender.

---

### 3. Modul Komunitas & Workspace
* `GET /workspaces`
  * **Desc:** Mendapatkan daftar workspace yang diikuti pengguna beserta perannya (`OWNER`, `ADMIN`, atau `MEMBER`).
* `POST /workspaces`
  * **Body:** `{"name": "RT 05 Sukamaju", "type": "COMMUNITY"}`
  * **Desc:** Membuat ruang komunitas baru (pembuat otomatis menjadi `OWNER`).
* `POST /workspaces/{id}/invite`
  * **Body:** `{"role": "MEMBER"}`
  * **Desc:** Menghasilkan tautan undangan unik: `https://kaskita.id/join/rt-05-abc123`.

---

### 4. Modul Iuran Warga (Dues Engine)
* `POST /workspaces/{id}/dues-categories` *(Admin only)*
  * **Body:** `{"name": "Iuran Sampah & Keamanan", "amount": 50000, "billing_cycle": "MONTHLY"}`
* `POST /workspaces/{id}/dues-invoices/generate` *(Admin only / Cron)*
  * **Body:** `{"dues_category_id": "UUID", "period": "2026-10", "due_date": "2026-10-10"}`
  * **Desc:** Menerbitkan tagihan serentak kepada seluruh anggota aktif di workspace.
* `GET /workspaces/{id}/dues-invoices/my-bills` *(Member view)*
  * **Desc:** Mengambil daftar tagihan akun login di workspace tersebut.
* `PATCH /dues-invoices/{invoice_id}/pay` *(Member view)*
  * **Body:** 
    ```json
    {
      "proof_image_url": "https://r2.kaskita.id/proofs/2026-10-budi.webp",
      "sync_to_personal": true,
      "personal_wallet_id": "UUID_WALLET_BCA"
    }
    ```
* `PATCH /dues-invoices/{invoice_id}/verify` *(Admin only)*
  * **Body:** `{"action": "APPROVE"}` atau `{"action": "REJECT", "reason": "Bukti transfer buram"}`
  * **Logika Backend jika APPROVE:**
    1. Update status tagihan menjadi `PAID`.
    2. Tambahkan mutasi Kas Masuk di pembukuan komunitas RT.
    3. Jika `sync_to_personal = true`, potong saldo `wallets` dan buat mutasi pengeluaran kas pribadi.

---

### 5. Modul Arisan Digital
* `POST /workspaces/{id}/arisan-groups` *(Admin only)*
  * **Body:** `{"title": "Arisan Blok C", "amount_per_period": 100000, "cycle_period": "MONTHLY"}`
* `POST /arisan-groups/{id}/draw` *(Admin only)*
  * **Desc:** Menjalankan algoritma pengocokan digital acak.
  * **Response Data:**
    ```json
    {
      "round_number": 4,
      "winner": {
        "user_id": "UUID",
        "full_name": "Siti Rahma",
        "slot_number": 2
      },
      "total_pot_amount": 1200000
    }
    ```

---

### 6. Modul Utang Piutang P2P
* `POST /debts`
  * **Body:** 
    ```json
    {
      "party_name": "Andi Pratama",
      "party_phone": "081987654321",
      "type": "RECEIVABLE",
      "total_amount": 300000,
      "due_date": "2026-10-28",
      "notes": "Pinjam buat bayar servis motor"
    }
    ```
* `POST /debts/{id}/payments`
  * **Body:** `{"amount_paid": 150000, "wallet_id": "UUID_WALLET_CASH", "payment_note": "Cicilan ke-1"}`
  * **Desc:** Mengurangi `remaining_amount` dan menambahkan saldo ke dompet penerima.
* `GET /debts/{id}/reminder-link`
  * **Desc:** Menghasilkan tautan pesan WhatsApp ramah:  
    `https://wa.me/6281987654321?text=Halo%20Andi%2C%20sekadar%20mengingatkan...`

---

## BAGIAN 3: WBS SPRINT ROADMAP (6 MINGGU)

Roadmap implementasi diformulasikan ke dalam 6 siklus sprint mingguan untuk menjamin MVP live tepat waktu tanpa membebani solopreneur dengan 2 frontend terpisah:

```
[W1] Core Backend Supabase, Auth OTP, & Multi-Wallet Mobile
  │
[W2] Quick Input Transaksi Harian, Budgeting, & Kalender Jatuh Tempo (Mobile)
  │
[W3] In-App Community Admin (RT & Arisan di HP) + Zero-Install Web Guest Link
  │
[W4] Zero Double-Entry Sync Engine & Modul Utang Piutang P2P
  │
[W5] Anti-Sungkan Reminder Engine & Generator WA Deep Link
  │
[W6] ACID Concurrency Testing, UAT Lapangan 1 RT Riil, & Rilis Play Store
```

| Sprint | Fokus Pekerjaan | Deliverable Nyata |
| :--- | :--- | :--- |
| **Sprint 1 (W1)**<br>*Core & Multi-Wallet* | • Setup Monorepo Flutter + Supabase Cloud.<br>• Migrasi skema database PostgreSQL.<br>• Autentikasi OTP WhatsApp.<br>• Manajemen multi-dompet pribadi (Cash, Bank, e-Wallet). | Pengguna bisa login dan membuat 3 dompet saldo terpisah di aplikasi HP. |
| **Sprint 2 (W2)**<br>*Personal Hub Harian* | • Input cepat transaksi pengeluaran harian (<5 detik) & mutasi saldo.<br>• Penetapan batas anggaran bulanan & visual progress bar.<br>• Kalender kewajiban jatuh tempo. | Aplikasi berfungsi penuh sebagai pencatat kas harian pribadi (*single-player mode aktif*). |
| **Sprint 3 (W3)**<br>*In-App Admin & Web Guest* | • **In-App Admin:** Buat grup RT/Arisan, terbitkan tagihan massal, dan kocokan acak arisan langsung di HP.<br>• **Zero-Install Web Guest:** Halaman web PWA agar warga bisa upload bukti bayar tanpa install aplikasi.<br>• Integrasi storage Cloudflare R2 untuk bukti transfer. | Bendahara bisa mengelola iuran & arisan 100% dari ponsel; warga bisa konfirmasi bayar via link web browser. |
| **Sprint 4 (W4)**<br>*Zero Double-Entry* | • Modul Utang Piutang P2P (Payable/Receivable).<br>• Mesin sinkronisasi otomatis: Persetujuan iuran RT otomatis memotong saldo dompet pribadi. | Beban catat ganda hilang sepenuhnya (*Zero Double-Entry* aktif). |
| **Sprint 5 (W5)**<br>*Reminder & Reporting* | • Cron scheduler jatuh tempo tagihan (H-3, H-1, H).<br>• Generator pesan WhatsApp sopan (*client-side deep link `wa.me`*).<br>• Ekspor rekapitulasi kas RT ke PDF siap cetak langsung dari HP. | Notifikasi pengingat berjalan dan laporan RT siap ditempel di papan pengumuman fisik. |
| **Sprint 6 (W6)**<br>*UAT & Peluncuran* | • Uji integritas transaksi finansial ACID.<br>• Uji coba lapangan (UAT) bersama 1 bendahara RT riil (lingkungan founder/partner).<br>• Rilis APK Android ke Internal Testing Play Store. | **Aplikasi KasKita MVP v1.0 live dan digunakan oleh pengguna perdana.** |

---

## BAGIAN 4: ARSITEKTUR HEMAT BIAYA WHATSAPP GATEWAY

> [!warning] Bahaya Biaya API WhatsApp bagi Solopreneur
> Meta Cloud API mengenakan tarif percakapan (~Rp 350 – Rp 450 per interaksi). Memberikan broadcast WhatsApp gratis untuk seluruh warga berpotensi membakar modal secara sia-sia.

### Solusi: Arsitektur Berjenjang (Tiered Delivery)
1. **Tier Gratis (Personal & Komunitas Free $\le$ 15 anggota):**
   - **In-App Push Notification** (100% Gratis via Firebase Cloud Messaging).
   - **Client-Side Deep Link:** Sistem membuat tautan `wa.me/?text=...` di HP bendahara. Saat ditekan, WhatsApp terbuka dengan teks penagihan yang telah terisi rapi. Biaya server KasKita: **Rp0**.
2. **Tier Komunitas Berbayar (SaaS Pro):**
   - Menggunakan Official WhatsApp Business API / Provider Lokal (Waha/Fonnte).
   - Biaya pesan telah tertutup oleh biaya langganan bulanan komunitas (Rp29.000 – Rp79.000/bulan).

---

## BAGIAN 5: KEPATUHAN REGULASI (UU PDP) & FINANCIAL DISCLAIMER

### 1. Kepatuhan UU Perlindungan Data Pribadi (UU No. 27 Tahun 2022)
* **Hak Portabilitas & Penghapusan Data:** Pengguna dapat meminta penghapusan akun beserta riwayat transaksi pribadi kapan saja.
* **Isolasi Kerahasiaan:** Data keuangan pribadi tidak dapat diakses oleh pihak ketiga maupun admin komunitas mana pun.
* **Retensi Gambar Bukti:** Foto bukti transfer hanya disimpan untuk validasi pembukuan dan dikompresi otomatis tanpa memuat metadata lokasi GPS (EXIF stripped).

### 2. Batasan Tanggung Jawab Hukum (Financial Disclaimer Wajib)
Wajib dicantumkan di halaman pendaftaran (*Terms of Service*):

> *"Platform KasKita beroperasi semata-mata sebagai perangkat lunak pencatatan (*record-keeping tool*) dan sarana komunikasi administratif independen. KasKita **bukan** merupakan lembaga perbankan, penyedia jasa dompet elektronik berlisensi, penyedia pinjaman online (P2P lending), ataupun penghimpun dana masyarakat berdasarkan regulasi Bank Indonesia (BI) dan Otoritas Jasa Keuangan (OJK). Seluruh perpindahan dana yang terjadi antar-pengguna merupakan transaksi langsung antar-rekening pribadi tanpa penampungan saldo di dalam sistem KasKita."*

---
*Langkah berikutnya:* Pelajari analisis mendalam arsitektur Hub & Spoke dan strategi viralitas pada [[bisnis/kaskita/05-strategi-produk-hub-and-spoke|05-strategi-produk-hub-and-spoke.md]].
