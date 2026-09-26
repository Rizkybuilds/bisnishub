# Monitoring dan insiden

Kontrak ini harus dikonfigurasi dan diuji sebelum diklaim aktif. Pemilik keputusan: Rizky. Catat pelaksana/pengganti dan kanal eskalasi di [register kesiapan](../engineering/operational-readiness.md). Dokumen tidak mengirim notifikasi atau membuat automation.

## Sinyal minimum

| Sinyal                                                      | Tindakan                                                |
| ----------------------------------------------------------- | ------------------------------------------------------- |
| Health/login gagal berulang, error meningkat                | Periksa revisi, database dan konfigurasi                |
| Latensi/kapasitas memburuk                                  | Bandingkan baseline; periksa query dan storage          |
| Backup gagal/terlambat                                      | Eskalasi; jangan menganggap recovery tersedia           |
| Pembayaran, alokasi dan saldo invoice tidak cocok           | Batasi alur terdampak dan rekonsiliasi                  |
| Transaksi ganda/akses lintas organisasi                     | Insiden kritis; containment dan pemeriksaan dampak      |
| Job/integrasi tertunda, retry berulang                      | Periksa penyebab; retry hanya bila idempotensi terbukti |
| Produksi tertahan, invoice jatuh tempo, biaya belum lengkap | Antrean tindak lanjut bisnis                            |

Sebelum aktivasi, tetapkan ambang, interval, kanal, penerima dan uji alarm/pemulihan. Deduplikasi peringatan. Log memuat waktu, lingkungan, revisi dan correlation ID tanpa token, password atau data pribadi berlebihan. Tetapkan akses dan retensi log.

## Prioritas

- Kritis: akses bocor, data rusak/hilang, saldo salah atau transaksi ganda. Tanggapi segera setelah terdeteksi dan batasi dampak sesuai kewenangan. Jangan menjanjikan 24/7 jika on-call belum ada.
- Tinggi: alur utama berhenti tanpa bukti data rusak. Prioritaskan pemulihan pada kesempatan operasional terdekat.
- Normal: gangguan minor dengan cara kerja sementara; catat dan jadwalkan.

## Respons

1. Catat waktu, gejala, target, revisi, cakupan transaksi dan prioritas tanpa rahasia.
2. Batasi dampak dengan mekanisme tersedia; pertahankan log/data. Jangan mengulang aksi uang yang hasil commit-nya belum diketahui.
3. Beri owner informasi dampak dan pilihan pemulihan. Pesan kepada pihak luar membutuhkan otorisasi yang sesuai.
4. Ikuti [pemulihan rilis](release-and-recovery.md) dan batas database lokal; eskalasi kebutuhan remote di luar scope.
5. Verifikasi kesehatan dan konsistensi transaksi; rekonsiliasi pekerjaan selama gangguan sebelum normal kembali.
6. Catat penyebab, tindakan, bukti pulih, tindak lanjut dan pemilik. Tinjau insiden kritis/tinggi pada hari kerja berikutnya; tambahkan regresi relevan.

Saat downtime, owner dapat mencatat permintaan dengan identitas sementara dan referensi pembayaran asli yang terlindungi. Setelah pulih, rekonsiliasi satu per satu melalui command resmi dan periksa duplikasi; jangan bulk insert langsung untuk mengejar backlog.
