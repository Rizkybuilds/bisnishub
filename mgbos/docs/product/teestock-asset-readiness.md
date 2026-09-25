# Inventaris kesiapan aset TeeStock

Tanggal: 2026-09-25. Audit baca filesystem/source lokal; tidak membaca database remote, browser localStorage atau koleksi cloud. Status berikut tidak menyatakan isi katalog live kosong. Perubahan hanya dokumentasi di MGBOS.

## Hasil

**Belum ada desain curated yang dapat disahkan siap dijual dari bukti lokal yang ditemukan.** Ini kekurangan bukti, bukan kesimpulan bahwa TeeStock tidak memiliki desain. Pemilihan enam desain aktual tetap terbuka; jangan mengisi slot menggunakan data demo atau ide tema.

| Kelompok | Bukti | Penilaian / tindakan |
| --- | --- | --- |
| Identitas brand | Logo PNG/JPG/SVG di `bisnis/teestock/brand/`, logo/icon/OG image di `web/public/` | Aset identitas tersedia; bukan master cetak curated. Belum dilakukan QA visual atau audit hak atas file |
| Raw Identity / TS-STM-001 | Fallback dalam `web/src/pages/store/HomePage.jsx`; foto Unsplash | Contoh tampilan, bukan kandidat koleksi terverifikasi |
| SKU TS-STM, TS-SUB, TS-OUT dan lainnya | Daftar `LEGACY_SEED_SKUS` di `packages/shared/src/services/productsApi.js` | Source menyebutnya demo/mockup; keluarkan dari seleksi sampai ada bukti produk nyata |
| Produk live | Source membaca `ts_products`; juga mempunyai fallback localStorage | Memerlukan export baca terbatas atau akses katalog yang diverifikasi; belum diinventaris sebagai record nyata |
| Blank supplier | `bisnis/teestock/tools/cititex_catalog_full.json`: 29 record, termasuk 7200 dan 3600 | Referensi bahan, bukan stok tersedia atau desain milik TeeStock. Harga/suplai perlu diperbarui saat dipakai |
| Film/master artwork | Path `D:/bisnishub-drive/teestock` yang disebut dokumentasi tidak ditemukan pada host ini | Lokasi master perlu ditentukan; belum ada bukti PNG siap cetak/PSD/AI pada pencarian lokal yang relevan |
| Bukti hak penggunaan | SOP kurasi/lisensi tersedia | SOP bukan bukti pembelian/kontrak untuk suatu desain. Bukti per desain belum ditemukan |
| Mockup per warna | Adapter mendukung `variant_images` dan metadata `story_behind` | Kemampuan kode tersedia; belum membuktikan file mockup milik setiap produk tersedia |
| Harga | Piagam 17 September dan `packages/shared/src/constants/pricing.js` | Perlu rekonsiliasi price book per produk; konstanta fee tidak diperlakukan sebagai tarif layanan terkini |

Pencarian memakai daftar file relevan di TeeStock dan repo tanpa memasuki link Supabase root atau bisnis di luar scope. Remote URL tidak diunduh. Manifest [aset lokal](teestock-local-assets.csv) memuat ukuran dan checksum untuk identitas file, bukan sertifikasi lisensi atau kualitas cetak.

## Risiko mapping source lama

Adapter produk dapat memberi nilai default untuk `designSource`, status active, warna, ukuran, design value dan royalty. Import MGBOS harus membaca nilai asal berikut provenance dan flag field yang tidak ada; jangan menjadikan default hasil adapter sebagai bukti hak, biaya atau kesiapan publikasi. Data rekening payout kreator tidak termasuk kebutuhan export katalog dan tidak perlu disalin ke dokumen ini.

## Seleksi koleksi pertama

Target maksimal enam, bukan kuota wajib. Tema kerja kreatif/digital dan kopi tetap hipotesis dari strategi, bukan judul desain yang sudah dimiliki.

Urutan seleksi setelah aset ditemukan:

1. Identitas desain dan sumber asli dapat ditelusuri; hak penggunaan ditinjau untuk rencana penjualan.
2. Versi master dapat dibuka, ukuran fisik dan pixel cocok dengan profil cetak yang dipilih.
3. Sampel/QC tersedia atau dijadwalkan; mockup sesuai warna, placement dan hasil aktual.
4. Varian blank, resep bahan, harga dan kapasitas produksi diketahui.
5. Prioritaskan kecocokan brand, kesiapan bukti, kemudahan produksi dan variasi koleksi. Jangan merangking visual sebelum melihat file.

Klasifikasi: **siap dijual** hanya jika semua gate lolos; **perlu diperbaiki** jika desain nyata ada tetapi bukti/produksinya belum lengkap; **bukan kandidat** untuk logo, demo dan referensi vendor. Saat audit ini, belum ada kandidat curated dengan bukti cukup untuk dua kategori pertama.

## Data yang diperlukan berikutnya

Lokasi folder master desain/mockup yang sebenarnya, atau export katalog yang berisi SKU, nama, status asal, URL/file master dan mockup, varian, placement, harga, sumber desain serta referensi bukti hak. Jangan menyertakan password, token atau rekening kreator. Periksa URL/file dan hak satu per satu; export tidak otomatis meluluskan produk.

Spesifikasi modul sudah dapat dilanjutkan tanpa mengarang koleksi: [Library Desain & Produk Curated](teestock-design-library-spec.md).
