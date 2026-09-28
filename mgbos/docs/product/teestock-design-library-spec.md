# Spesifikasi Library Desain & Produk Curated

Status: spesifikasi untuk ditinjau sebelum implementasi, 2026-09-25. Paket TS-PLAN-14. Mengikuti [strategi curated](teestock-curated-strategy.md), [inventaris bukti](teestock-asset-readiness.md) dan kontrak `design_assets`, `catalog_items`, `catalog_variants`, `catalog_options` dalam [model data kanonikal](<../../../catatan/sesi/2026-09-23 - MGBOS 0.2.1 Logical Data Model.md>). Nama extension dan status di bawah adalah usulan, bukan skema yang sudah diterapkan. Tidak membuat backend katalog kedua di legacy.

## Hasil pengguna dan batas

Rizky dapat memilih desain, mengetahui bukti yang kurang, membuat produk/varian, meninjau harga dan menandai versi produk siap untuk publikasi. Publikasi live merupakan integrasi berikutnya, bukan efek otomatis tombol siap.

Termasuk: library, koleksi, versi file, bukti hak, review, mockup, resep minimum, varian, price book dan readiness. Tidak termasuk editor grafis, generator AI, marketplace kreator, payout royalti, stok penuh, checkout baru atau sinkronisasi remote.

## Model informasi

| Objek                          | Kontrak minimum                                                                                                                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Design asset                   | ID organisasi/brand, kode, judul, tema, cerita, sumber, pencipta/referensi partner, status dan arsip                                                                            |
| Versi desain (extension)       | Nomor versi, file master privat/reference, checksum, format/pixel, ukuran cetak fisik, placement, profil produksi, pembuat/waktu; versi yang sudah direferensikan tidak ditimpa |
| Bukti hak (extension)          | Referensi dokumen privat, jenis sumber, ruang penggunaan yang ditinjau, batas/tanggal jika ada, reviewer/waktu dan alasan; metadata sendiri bukan pengesahan otomatis           |
| Asset/file                     | Pisahkan file dari design asset sesuai kanonikal; storage key, MIME terverifikasi, ukuran, checksum dan akses. Preview tidak memberi akses master atau bukti kontrak            |
| Koleksi (extension)            | Nama/cerita, urutan desain, periode opsional; bukan stok atau klaim limited edition otomatis                                                                                    |
| Catalog item                   | Jenis PRODUCT/CONFIGURABLE_PRODUCT sesuai kanonikal, brand, kode/nama, versi desain, deskripsi, pricing mode, status                                                            |
| Variant                        | SKU unik dalam organisasi, warna, ukuran, blank reference, active flag; mockup yang sesuai. Keputusan scope uniqueness ditulis eksplisit dalam migrasi                          |
| Recipe minimum (extension)     | Blank, transfer per placement, kemasan dengan satuan per item/per paket; versioned. Jangan menghitung kemasan paket sekali untuk setiap item                                    |
| Price book version (extension) | IDR integer, harga dan komponen biaya bersumber, tanggal efektif, channel/tier bila berlaku, reviewer; nilai belum diketahui bukan nol                                          |
| Review/audit                   | Aktor dari sesi, revisi yang diperiksa, hasil/alasan/waktu; append-only                                                                                                         |

Hak penggunaan dan file sensitif mengikuti organisasi/brand. Produk curated adalah kombinasi desain-versi dan spesifikasi jual; bukan jumlah stok baru. Stock blank, film dan barang jadi tetap objek berbeda pada paket inventory.

## Lifecycle usulan dan gate

Desain: DRAFT → IN_REVIEW → APPROVED, atau NEEDS_CHANGES → versi/review baru; ARCHIVED memblokir penggunaan baru tanpa menghapus sejarah. Perubahan file/placement setelah approved menghasilkan versi baru dengan review baru. APPROVED menyatakan review versi tertentu, bukan setiap produk turunannya otomatis boleh diterbitkan.

Produk: DRAFT → READY_FOR_PUBLICATION → ARCHIVED. PUBLISHED dan hasil sinkronisasi belum diimplementasikan pada slice ini. Readiness diturunkan dari pemeriksaan aktual dan tidak cukup disimpan sebagai boolean yang tidak diperbarui. Lisensi berakhir/dicabut, file hilang atau harga tidak berlaku harus menahan publikasi/transaksi baru; order historis mempertahankan snapshot dan masuk tindak lanjut bila diperlukan.

Gate siap: versi approved, bukti hak memadai untuk penggunaan yang diajukan, pemeriksaan sampel/profil produksi, varian nyata, mockup sesuai, harga/biaya tervalidasi, resep dan aturan ketersediaan jelas. Bila paket stok belum tersedia, tampilkan ketersediaan belum diverifikasi dan jangan menyatakan ready untuk penjualan operasional.

## Layar dan tindakan

1. **Daftar desain:** cari judul/kode; filter tema, sumber, status dan kekurangan; pagination server; empty state yang jujur tanpa desain demo.
2. **Detail desain:** preview aman, versi master, placement/ukuran, sumber/bukti hak, catatan QC, review dan produk yang memakai versi tersebut.
3. **Buat produk dari desain:** pilih versi approved, blank, warna/ukuran, mockup, recipe dan price book; preview dokumen produk sebelum simpan.
4. **Daftar produk/koleksi:** varian/harga, indikator kelengkapan dan alasan belum siap. Tidak ada tombol publish live pada slice awal.

Form mempertahankan input saat error, fokus menuju pesan, label mudah dipahami dan dapat digunakan dari ponsel. Gunakan komponen/tokens existing; rancangan UI rinci mengikuti skill UI saat implementasi.

## Wewenang yang diusulkan

OWNER/ADMIN mengelola desain/produk; OWNER menyetujui hak dan pengecualian harga. OPERATIONS/QC meninjau kelayakan produksi, bukan menyetujui lisensi. SALES membaca produk yang diizinkan dan harga jual tanpa akses bukti privat; FINANCE membaca biaya dan menetapkan harga sesuai kontrak peran yang disepakati. Mapping baru perlu perubahan permission eksplisit dan tes; jangan menyimpulkan dari role lama atau nama menu.

## Command dan integritas

CreateDraft, AddVersion, SubmitReview, RecordReview, CreateProductDraft, RevisePriceBook, EvaluateReadiness dan Archive adalah nama konseptual. Semua memverifikasi sesi/organisasi/peran, expected revision dan request ID. Request ID + payload sama mengembalikan hasil sama; payload berbeda ditolak. Update concurrent versi lama tidak menimpa versi baru. Tidak ada hard delete file/versi yang direferensikan transaksi.

Upload memerlukan tipe dan ukuran maksimum yang ditetapkan, validasi MIME di server, penyimpanan privat dan URL akses sementara. Jangan fetch URL bebas dari server (risiko akses jaringan internal); gunakan sumber/storage yang diizinkan. SVG atau file aktif tidak dirender inline tanpa sanitasi; file tidak lolos pemeriksaan tetap karantina. Gagal upload tidak menghasilkan versi approved; orphan dibersihkan melalui prosedur terpisah dengan grace period.

Konfirmasi order nantinya menyalin versi desain, item/varian, recipe, placement dan harga; perubahan katalog tidak mengubah kontrak lama. Harga di-serialize sebagai string desimal, dihitung integer dengan batas aman; biaya tak diketahui ditampilkan belum lengkap.

## Import legacy

Hanya dry-run/staging mapping pada slice ini. Key: source system + external SKU/ID. Pisahkan raw field, parsed value dan warning; jangan gunakan default adapter sebagai data nyata. Tandai SKU demo, field hak kosong, file tak dapat dibaca, JSON invalid, duplikasi dan missing price. Import ulang tidak membuat duplikat atau mengganti review manual tanpa konflik yang terlihat. Jangan mengimpor rekening kreator ke public product atau mencampur foreign key legacy dengan ID MGBOS.

## Acceptance test dan urutan implementasi

- Aktor tanpa izin/lintas organisasi ditolak untuk baca privat maupun command; URL file tidak menjadi akses permanen.
- Bukti hak/biaya/file yang belum ada menahan readiness; data demo tidak lolos.
- Dua revisi bersamaan menghasilkan konflik jelas; retry aman; gagal sebagian tidak membuat produk semu.
- Versi baru tidak mengubah order/produk historis; expired/revoked memblokir penggunaan baru.
- Mockup per warna, placement multiposisi dan kemasan per paket dipetakan benar; varian duplikat ditolak.
- Harga integer melewati form → server → database tanpa BigInt serialization error; missing tidak menjadi nol.
- Import replay, JSON invalid, source missing dan warning dievaluasi; UI bisa dipakai tanpa SQL.

Urutan slice: A metadata/library dan izin; B file/versi/review; C produk/varian/recipe/harga; D readiness dan dry-run import. Setiap slice melewati gate [maintenance](../engineering/maintenance-policy.md). Detail extension perlu ADR sebelum migrasi karena memperluas model kanonikal. Gate CI/foundation yang belum terbukti tetap harus diselesaikan sebelum implementasi; spesifikasi ini tidak menyatakan gate tersebut lulus.
