# Kebijakan pemeliharaan MGBOS

Berlaku untuk workspace `mgbos/`. Pemilik keputusan operasional: Rizky. Pelaksana teknis dan pengganti harus ditetapkan sebelum layanan operasional diaktifkan. Kebijakan tidak membuat automation atau mengizinkan operasi remote; batas [AGENTS.md](../../AGENTS.md) tetap berlaku.

## Kelulusan perubahan

1. Tentukan masalah bisnis, modul terdampak, aturan transaksi, risiko dan kriteria penerimaan. Pertahankan perubahan kecil dan dapat ditinjau.
2. Audit working tree, pertahankan pekerjaan lain dan identifikasi revisi yang diperiksa.
3. Untuk kode aplikasi, jalankan `pnpm check`, production HTTP smoke dan pengujian database relevan. Uji alur bisnis melalui batas aplikasi; build dan SQL test saja tidak cukup.
4. Untuk transaksi, uji akses peran, isolasi organisasi, status tidak sah, batas nilai uang, request berulang dan rollback saat gagal. Uji konkurensi untuk saldo, nomor dokumen dan perubahan bersama yang relevan. Retry setelah respons hilang tidak boleh menggandakan transaksi.
5. Gunakan migrasi baru. Uji upgrade dari data/skema sebelumnya serta rekonstruksi di database disposable; periksa data lama, constraint, grants, RLS, fungsi dan kompatibilitas aplikasi. Regenerasikan tipe dari database sebenarnya.
6. Perbarui dokumentasi serta bukti bertanggal. Catat kegagalan dan pemeriksaan yang belum dilakukan. Perubahan instruksi saja cukup divalidasi tautan, konsistensi dan diff.

Kesalahan uang, akses tidak sah, kehilangan data atau pemulihan yang tidak terbukti menghalangi rilis alur terkait. Jangan memperluas alur yang masih memiliki penghalang tersebut.

## Status bukti

| Status | Bukti minimum |
| --- | --- |
| Direncanakan | Kebutuhan dan kriteria penerimaan |
| Diimplementasikan | Kode/migrasi dengan identitas revisi |
| Terverifikasi lokal | Hasil pemeriksaan bertanggal untuk revisi tersebut |
| Terverifikasi CI | Tautan run sukses pada revisi tersebut |
| Dirilis | Target, revisi deployment dan pemeriksaan endpoint |
| Diterima operasional | Alur pengguna lolos, pemilik, backup/restore dan monitoring terbukti |

Laporan lama, jumlah test atau label dashboard bukan bukti readiness terkini. Jangan menyatakan sprint siap produksi jika gate wajib belum terbukti.

## Lingkungan dan akses

Development, staging dan production harus terpisah proyek, kredensial dan storage sebelum digunakan. Catat identitas target, pemilik, revisi dan versi skema tanpa nilai rahasia. Gunakan data sintetis di staging; salinan nyata memerlukan kebutuhan jelas, penyamaran dan akses terbatas. Pengujian tidak boleh menagih atau mengirim pesan kepada pelanggan nyata.

Verifikasi branch protection dan required checks di layanan Git; YAML tidak membuktikan enforcement. AI/otomasi wajib memakai command bisnis dengan otorisasi dan validasi yang sama, tanpa jalan pintas database.

## Ritme perawatan saat operasional

| Waktu | Kegiatan dan bukti |
| --- | --- |
| Harian | Tinjau error penting, umur backup, saldo tidak konsisten dan pekerjaan tertahan |
| Setiap perubahan/rilis | Pengujian sesuai risiko, bukti revisi, dokumentasi dan pemeriksaan pascarilis |
| Mingguan | Tinjau bug, pekerjaan otomatis gagal, piutang, biaya layanan dan kapasitas |
| Bulanan | Tinjau akses, dependency/security advisory, patch dan latihan restore |
| Setelah insiden/infrastruktur berubah | Tinjau pemulihan, runbook dan pengujian regresi |

Ini kewajiban proses, bukan jadwal otomatis yang sudah aktif. Pembaruan dependency dibuat terpisah dengan lockfile dan pengujian; prioritaskan kerentanan menurut dampak dan keterpaparan.

## Runbook dan bukti

- [Rilis dan pemulihan](../runbooks/release-and-recovery.md)
- [Backup dan restore](../runbooks/backup-and-restore.md)
- [Monitoring dan insiden](../runbooks/monitoring-and-incidents.md)
- [Register kesiapan](operational-readiness.md)
