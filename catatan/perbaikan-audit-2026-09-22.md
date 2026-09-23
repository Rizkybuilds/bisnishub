# Status perbaikan audit — diperbarui 23 September 2026

## Diimplementasikan lokal
- Autentikasi admin berbasis sesi dan profil server; bypass PIN dihapus.
- Pembayaran dipisah dari perpindahan produksi; konfirmasi manual melalui RPC admin.
- Transisi pesanan dan stok melalui transaksi database; pengadaan menerima rincian stok lewat trigger yang sama dengan pencatatan kas.
- Checkout menyimpan komponen nominal; webhook memeriksa nominal, duplikasi dan perubahan serentak.
- Valuasi kosong dan klasifikasi transfer/ongkir diperbaiki; penolakan penulisan database diteruskan.
- Patch SQL publik lama diblokir; reset skema memerlukan aktivasi eksplisit.
- Tombol mulai produksi dipisahkan dari konfirmasi pembayaran dan dinonaktifkan sebelum lunas. Konfirmasi manual tidak ditawarkan untuk pembayaran gateway atau pesanan historis yang belum direkonsiliasi.
- Notifikasi terlambat tidak membatalkan pembayaran yang sudah lunas atau membuka kembali pembayaran yang sudah dikembalikan.
- Halaman admin dimuat terpisah; modal memiliki pengelolaan fokus keyboard. Ketergantungan pengujian dan build diperbarui.
- Pembatalan manual kini menggunakan transaksi database dengan penguncian pesanan. Hanya pesanan manual belum dibayar dan belum diproduksi yang dapat dibatalkan; catatan lama dipertahankan dan pengulangan aman.
- Penghapusan dan perubahan pengadaan dikunci di database karena transaksi tersebut sudah mengubah stok dan kas. Tombol hapus dinonaktifkan hingga tersedia proses koreksi terpadu.
- Penyimpanan resi memeriksa hasil database, termasuk pesanan tidak ditemukan. Formulir tetap terbuka saat gagal. Pembacaan daftar pesanan admin tidak lagi menggantikan kegagalan database dengan cache lama.

## Hasil verifikasi lokal
- Admin: 218 pengujian lulus, termasuk 10 skenario handler webhook aktual dan 5 skenario kegagalan transaksi dengan database tiruan dan tanpa jaringan.
- TeeStock: 242 pengujian lulus. Kedua suite memakai isolasi database/jaringan untuk mencegah pengujian unit mengakses layanan operasional.
- Kedua migrasi aktual dijalankan pada PostgreSQL lokal melalui PGlite: 14 pengujian lulus, mencakup otorisasi, pencegahan peningkatan hak akses, pembayaran ganda, perlindungan pengadaan, rollback kekurangan stok, pembatalan pesanan, dan pengulangan migrasi.
- Build kedua aplikasi berhasil. Audit dependensi npm melaporkan 0 kerentanan pada pemeriksaan ini (dependensi opsional dikecualikan).
- Peringatan ukuran bundle admin masih ada: berkas utama sekitar 620 kB sebelum kompresi. Pengujian browser dan konkurensi dengan beberapa koneksi database belum dilakukan.

## Status produksi
Kedua migrasi dan Edge Functions telah diterapkan. Status website dan bukti rilis terbaru dicatat di [laporan rilis](rilis-produksi-2026-09-23.md).

## Pekerjaan lanjutan audit
- Uji integrasi Supabase staging: sesi autentikasi, notifikasi gateway sesungguhnya, transaksi serentak, refund, dan pesanan historis.
- Refund belum membalik pencatatan kas secara otomatis. Proses koreksi pengadaan perlu membalik stok dan kas dengan jejak audit; untuk sementara perubahan/penghapusan dikunci. Cache modul selain daftar pesanan admin masih perlu ditinjau saat database gagal.
- Master vendor/pelanggan lintas unit, migrasi localStorage, dukungan NeoPack/Pack Point.
- Audit visual browser dan keyboard, optimasi bundle admin lanjutan, CI dan backup/restore.
- Rekonsiliasi biaya persediaan menjadi HPP penjualan; laporan saat ini belum general ledger akuntansi lengkap.
- Penyelarasan dokumentasi bisnis; file pribadi dan rencana di luar lingkup tidak dipindahkan pada tahap perbaikan transaksi ini.
