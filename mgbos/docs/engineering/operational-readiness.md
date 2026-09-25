# Register kesiapan operasional

Baseline: 2026-09-25. Pemilik keputusan: Rizky. Ini inventaris bukti, bukan sertifikasi produksi. Belum diverifikasi tidak berarti pasti tidak ada.

| Kontrol | Status baseline | Bukti berikutnya |
| --- | --- | --- |
| Kebijakan pemeliharaan/rilis | Tertulis | Validasi tautan, konsistensi dan diff |
| Development terisolasi | Didefinisikan | Config project `mgbos-foundation` dalam workspace MGBOS |
| Staging/production | Belum diverifikasi | Proyek, URL, pemilik, isolasi secrets/storage dan revisi |
| CI | Workflow tersedia; run kini belum diverifikasi | Run sukses pada revisi rilis |
| Branch protection | Belum diverifikasi | Required checks pada layanan Git |
| Backup/retensi otomatis | Belum diverifikasi | Jadwal, lokasi, enkripsi dan run berhasil |
| RPO/RTO | Belum ditetapkan owner | Target dan alasan bisnis |
| Restore drill | Belum diverifikasi | Manifest, rekonsiliasi dan waktu pemulihan |
| Monitoring/eskalasi | Belum diverifikasi | Pelaksana, kanal, ambang dan uji alarm |
| Pemulihan rilis | Prosedur tertulis | Artefak kompatibel dan hasil latihan |
| Penerimaan produksi | Tidak diverifikasi pada pekerjaan dokumentasi ini | Bukti alur aman dan penerimaan owner |

Untuk setiap bukti, catat tanggal, pelaksana, revisi, lingkungan, scope, prosedur, hasil, tautan non-sensitif, keterbatasan dan tindak lanjut. Pisahkan lokal, hosted CI, deployment dan penerimaan operasional. Jangan simpan rahasia, dump atau data pelanggan di register.

Ikuti [kebijakan pemeliharaan](maintenance-policy.md). Register tidak mengubah batas database lokal dalam AGENTS.md.
