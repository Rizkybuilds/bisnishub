# Rilis dan pemulihan MGBOS

Gunakan [kebijakan pemeliharaan](../engineering/maintenance-policy.md). Prosedur ini tidak memberi izin deployment atau perubahan database remote. Larangan database produksi dalam AGENTS.md tetap berlaku; laporkan tindakan di luar batas sebelum eksekusi.

## Sebelum rilis

1. Identifikasi aplikasi, lingkungan, proyek hosting, revisi dan migrasi. Jangan menyimpulkan target dari domain historis atau tab browser.
2. Siapkan bukti lokal, hosted CI dan uji alur terkait pada revisi sama. Staging terisolasi wajib sebelum penggunaan operasional; ketidaktersediaannya dicatat sebagai gate belum terpenuhi.
3. Periksa kompatibilitas aplikasi dengan skema lama/baru, konfigurasi, sesi dan pekerjaan tertunda. Jangan memakai DROP atau reset sebagai rollback umum.
4. Verifikasi [backup/restore](backup-and-restore.md), pemilik pemantauan dan artefak aplikasi yang dapat dipulihkan.
5. Catatan rilis wajib memuat tujuan, revisi, target, modul, migrasi, hasil/tanggal test, tautan CI, bukti staging, backup/restore, risiko, kriteria penghentian, langkah pemulihan dan pemilik. Jangan masukkan rahasia atau data pelanggan.

## Eksekusi dan pemeriksaan

Rilis satu perubahan terukur melalui workflow yang terverifikasi dalam scope yang diizinkan. Database MGBOS tetap lokal. Setelah deployment aplikasi yang diizinkan, periksa revisi, health, login, izin, halaman dan alur transaksi aman. Pantau error, waktu respons dan konsistensi saldo. Catat pemeriksaan langsung serta peninjauan hari operasional berikutnya. Health saja tidak membuktikan kebenaran transaksi.

Hentikan perluasan rilis jika terjadi akses lintas organisasi, transaksi ganda, saldo salah, kehilangan data atau kegagalan alur utama. Batasi penulisan terdampak memakai mekanisme yang benar-benar tersedia dan diizinkan; jangan mengklaim maintenance mode sudah ada. Ikuti [runbook insiden](monitoring-and-incidents.md).

## Pemulihan

- Simpan bukti dan keadaan saat ini; identifikasi transaksi sejak rilis.
- Rollback aplikasi hanya ke artefak yang kompatibel dengan skema kini; bila tidak kompatibel, siapkan perbaikan maju.
- Perbaikan data memakai command/migrasi korektif yang ditinjau dan diaudit; jangan menghapus sejarah.
- Restore dahulu ke target terpisah. Rekonsiliasi transaksi setelah waktu backup sebelum merencanakan penggantian database operasional. Dokumen ini tidak mengizinkan penggantian tersebut.
- Tutup insiden setelah alur utama, otorisasi dan saldo diverifikasi. Catat penyebab, dampak, hasil pemulihan dan regresi.
