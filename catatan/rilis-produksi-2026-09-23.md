# Status rilis produksi — diperbarui 24 September 2026

Deployment produksi telah disetujui pengguna.

## Sudah diterapkan
- Supabase business-hub: tovslowsopqtuxmrogeu.
- Snapshot tabel bisnis terdampak dan metadata disimpan di luar Git: Documents/BisnisHub Backups/2026-09-23-before-audit.json. Ini bukan backup lengkap Auth/Storage.
- Pemulihan snapshot dan kedua migrasi diuji pada PostgreSQL lokal PGlite; data terjaga dan isolasi nonadmin lulus.
- Migrasi 20260922_audit_hardening.sql dan 20260923_transaction_guards.sql berhasil diterapkan berurutan.
- Verifikasi pascamigrasi: orders 0, procurements 3, cash_ledger 20, inventory 339; RPC pembatalan tersedia; kebijakan ALL publik tidak aman pada tabel transaksi sasaran berjumlah 0.
- Edge Functions create-checkout dan midtrans-webhook berhasil diperbarui melalui dashboard. Checkout dipasang ulang dengan encoding UTF-8 yang benar.

## Verifikasi lokal
- Admin: 222 tes lulus pada working tree (termasuk 4 tes domain dari pekerjaan MGBOS terpisah).
- TeeStock: 242 tes lulus. Database: 14 tes lulus.
- Build kedua aplikasi berhasil. Kompilasi produksi admin mengecualikan berkas tes.
- Tes checkout browser lengkap belum dijalankan karena skenario yang tersedia menulis pesanan ke database operasional.

## Website
- BisnisHub: https://bisnishub.vercel.app — menunggu commit/deployment perbaikan.
- TeeStock: https://teestockapparel.vercel.app — menunggu commit/deployment perbaikan.
- Kedua proyek terhubung ke Rizkybuilds/bisnishub branch main.
- Titik rilis sebelumnya: admin 7TFgGncwUiruPybhDSxQ98uZ6GBR; storefront 9c3rVpkDTvGmW4ZNNV7Mro5gHKjo.
- Perubahan MGBOS, catatan bisnis lain, dan konfigurasi root yang sedang dikerjakan tidak termasuk commit rilis ini.

## Batasan
Refund belum membalik kas otomatis; koreksi pengadaan terpadu belum tersedia. Pengujian gateway nyata, sesi login admin menyeluruh, dan konkurensi multikoneksi masih perlu dilakukan. Jangan memulihkan kebijakan publik tidak aman sebagai rollback. Jangan menjalankan schema.sql pada produksi.
