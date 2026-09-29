# Backup dan restore MGBOS

Kebijakan ini belum merupakan konfigurasi backup aktif. Lihat [register kesiapan](../engineering/operational-readiness.md). Latihan saat ini menggunakan target lokal/disposable, tidak menyentuh database produksi atau link Supabase legacy.

## Target dan cakupan

Sebelum transaksi nyata, owner menetapkan RPO (kehilangan data maksimum) dan RTO (durasi pemulihan maksimum), berdasarkan kebutuhan dan biaya. Jika belum ditetapkan dan diuji, kesiapan pemulihan belum terpenuhi.

Minimum kebijakan: backup database harian, retensi harian 30 hari dan snapshot sebelum perubahan berisiko. Jika RPO di bawah 24 jam, gunakan interval yang memenuhi target atau point-in-time recovery yang benar-benar tersedia dan diuji. Ini target kebijakan, bukan klaim paket layanan saat ini.

Cakupan wajib: data bisnis, skema, constraint, fungsi, trigger, policies, grants, sequences, versi migrasi, metadata auth yang diperlukan, objek storage/artwork/dokumen beserta referensinya, serta revisi aplikasi/configuration manifest. Dump database tidak otomatis melindungi objek storage, secrets atau seluruh konfigurasi provider; verifikasi masing-masing.

Rahasia berada dalam pengelola rahasia dengan jalur pemulihan terpisah. Enkripsi backup, batasi akses dan simpan salinan terpisah dari sumber. Jangan menyimpan dump/kredensial di Git atau folder publik. Retensi objek harus konsisten dengan snapshot database yang disimpan.

## Pemeriksaan backup

Catat target, waktu, versi skema, cakupan, ukuran/checksum, hasil, lokasi terlindungi dan kedaluwarsa. Alarm jika backup gagal atau umurnya melampaui interval. File ada tetapi tidak terbaca bukan keberhasilan. Retensi bukan izin menghapus arsip tanpa verifikasi scope dan salinan yang masih diperlukan.

## Latihan restore bulanan

1. Identifikasi backup dan target disposable terpisah; verifikasi keduanya sebelum tindakan.
2. Nonaktifkan koneksi keluar/otomasi pada target latihan agar tidak menagih, mengirim pesan atau webhook nyata.
3. Pulihkan dengan mekanisme runtime/provider yang kompatibilitasnya sudah diperiksa. Catat prosedur dan versi tanpa rahasia; jangan menyalin resep remote legacy.
4. Cocokkan jumlah baris dan total order, invoice, pembayaran serta alokasi terhadap manifest. Periksa FK, sequences, grants/RLS dan penolakan lintas organisasi.
5. Periksa dokumen/artwork, login uji dan alur bisnis sintetis pada salinan.
6. Ukur usia data pulih dan durasi, bandingkan dengan RPO/RTO. Simpan hasil dan kekurangan; kegagalan menghalangi klaim siap pulih.
7. Bersihkan target latihan hanya setelah identitas dan scope terverifikasi; pertahankan bukti non-sensitif.

Restore operasional memerlukan scope terpisah, penghentian penulisan, pelestarian bukti dan rekonsiliasi transaksi baru. Jangan menimpa transaksi lebih baru hanya karena backup tersedia.
