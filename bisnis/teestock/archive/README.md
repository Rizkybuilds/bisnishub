# Arsip TeeStock

Owner mengonfirmasi pada 28 September 2026 bahwa storefront TeeStock lama sudah dipensiunkan dan dipertahankan sebagai arsip. Folder ini menyimpan sumber, SQL historis, aset, laporan, dan alat dari struktur sebelumnya. Tidak ada SQL yang dijalankan atau database remote yang diubah oleh pengarsipan.

- `web/`, `supabase/`, `database/`, dan `test/` adalah referensi legacy, bukan runtime aktif. Konfigurasi dan instruksi deployment di dalamnya bersifat historis.
- `brand/`, `keuangan/`, `marketing/`, `operasional/`, `riset/`, dan `tools/` mempertahankan materi sebelumnya. Blueprint aktif berada di folder bernomor pada direktori induk.
- Admin `apps/bisnishub-web/` dan `packages/shared/` belum dipensiunkan atau dipindahkan. Test database admin membaca SQL historis di archive.
- File lokal environment, dependencies, cache, dan metadata hosting tetap lokal dan tidak dipublikasikan. Pengarsipan tidak menghapus deployment remote yang sudah ada.
- Root junction `supabase` masih menunjuk lokasi lama yang sudah tidak aktif. Jangan menggunakannya; junction tidak dihapus atau dialihkan oleh perubahan ini.

Root aliases storefront lama dihapus. Root Vercel build/install sengaja gagal dengan penjelasan retirement agar konfigurasi lama tidak menerbitkan aplikasi secara tidak sengaja. Deployment MGBOS memerlukan konfigurasi dan otorisasi tersendiri.

Rollback harus memulihkan pasangan path/config pada branch terpisah, mempertahankan perubahan lokal, serta memverifikasi environment dan target hosting sebelum mengaktifkan runtime lagi. Jangan menjalankan SQL arsip sebagai migration chain baru.
