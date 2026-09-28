# Pemeriksaan ulang sebelum Library Desain DEMO

Tanggal: 2026-09-26. Baseline: `3b0928dc04bf075d66e32c56ea14d8122f0bb911` ditambah perbaikan format dokumentasi pada working tree. Tidak ada perubahan aplikasi, migrasi, data produksi atau website live.

## Temuan dan perbaikan

GitHub run [36117826429](https://github.com/Rizkybuilds/bisnishub/actions/runs/36117826429) untuk baseline tersebut gagal pada langkah `pnpm check`; job database berhasil. Pemeriksaan lokal mereproduksi kegagalan di Prettier pada 12 dokumen, sebelum lint/test/build dijalankan. Prettier dijalankan hanya pada 12 path yang dilaporkan. Perubahan substantif diff terbatas pada pemformatan tabel di tujuh dokumen; lima lainnya mengalami normalisasi akhir baris. Makna spesifikasi dipertahankan.

Run [36113931552](https://github.com/Rizkybuilds/bisnishub/actions/runs/36113931552) pada baseline kode sebelumnya `fd127b5db24f6fd457584592b746b9865a14a0bb` berhasil. Keberhasilan tersebut tidak menggantikan CI untuk revisi terbaru.

## Bukti lokal setelah perbaikan

- `pnpm check`: lulus format, lint, TypeScript, 183 tes Vitest di 40 file dan build produksi kedua aplikasi.
- `pnpm db:test`: 283 tes pgTAP di 17 file lulus pada database lokal `mgbos-foundation`, port 55432. Tidak dilakukan reset atau migrasi.
- `pnpm test:integration`: lulus terhadap server produksi lokal port 3101/3102; memeriksa halaman kedua aplikasi, Custom Atelier, health dan respons 404. Ini smoke test, bukan pengujian menyeluruh transaksi bisnis.
- `git diff --check`: lulus.

Perintah pnpm dijalankan melalui `npm exec --yes --package=pnpm@10.34.5 -- pnpm` dari workspace `mgbos/`.

## Status dan kelanjutan

Perbaikan tersedia lokal, belum di-commit/push dan belum memiliki hasil CI baru. Tidak ada deployment. Sesuai gate pada `AGENTS.md`, penambahan modul ditahan sampai perbaikan melewati hosted CI. Langkah konkret berikutnya adalah memasukkan perbaikan dokumentasi ini ke alur review/CI yang disetujui, lalu memulai slice metadata/library dengan data DEMO.

Library Desain belum diimplementasikan. Arahan pengguna tetap berlaku: prioritaskan curated TeeStock, gunakan data dummy yang jelas berlabel simulasi, dan gunakan website live hanya sebagai referensi. Data dummy tidak menjadi bukti hak desain, kelayakan produksi, stok atau kesiapan publikasi nyata.
