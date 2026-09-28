# MGBOS Vite prototype — RETIRED

Dipensiunkan pada 2026-09-28 setelah Rizky mengonfirmasi tidak digunakan lagi dan boleh diarsipkan. Hanya referensi UI/histori; jangan deploy atau gunakan sebagai sumber kontrak bisnis MGBOS.

Pengganti aktif: [workspace Next.js MGBOS](../../mgbos/README.md). Lokasi terakhir: `apps/mgbos/`, base `ba4a6d2c7ed4155b3ff8f5ffee1c4a7a30b796dc`.

Empat belas file sumber/config/lockfile dipindahkan byte-for-byte. Halaman home berisi metrik contoh, sepuluh rute modul berupa placeholder, dan brand selector hanya state UI. Tidak ada alur transaksi backend yang ditemukan dalam source prototype. Desain shell tetap tersedia untuk referensi, bukan jaminan kesetaraan fitur dengan Next.js.

Alias root dev/build/install prototype sudah dihapus dan `install:legacy` tidak lagi memasangnya. Manifest/lockfile lama dipertahankan sebagai snapshot, termasuk dependency `file:../..` dan alias shared legacy. Archive tidak memiliki jaminan build mandiri atau kompatibilitas setelah shared package dipindahkan; jangan memasukkannya kembali ke workflow aktif hanya agar snapshot selalu dapat dibuild.

Dependency dan output build lokal yang sudah ada ikut dipertahankan, tetap diabaikan Git. Junction lokal `node_modules/bisnishub` menunjuk root repo; hindari pemindaian rekursif yang mengikuti junction itu. Jangan menghapus target junction.

Lihat [bukti migrasi](../../docs/engineering/repository-migration-wave-1.md). Pemulihan membutuhkan pemindahan kembali folder dan pembalikan perubahan navigasi/alias yang berpasangan, hanya bila diminta; tidak ada perubahan database atau deployment pada retirement ini.
