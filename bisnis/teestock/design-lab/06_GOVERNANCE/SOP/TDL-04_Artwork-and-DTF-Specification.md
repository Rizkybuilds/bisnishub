# TDL-04 — TEEStock ARTWORK & DTF PRODUCTION SPECIFICATION

> [!NOTE]
> **MIRROR — DO NOT EDIT**
> Dokumen ini merupakan cermin SOP operasional.
> Otoritas kanonikal standar berada di: [`00_GLOBAL_STANDARDS/TDL-04_Artwork-and-DTF-Specification.md`](../../00_GLOBAL_STANDARDS/TDL-04_Artwork-and-DTF-Specification.md).

**Version:** 1.0
**Status:** Foundation Draft
**Parent Documents:** TDL-01, TDL-02, TDL-03
**Production Method:** Direct-to-Film (DTF)
**Framework:** CRAFT

---

# 1. PURPOSE

Menetapkan standar teknis untuk mengubah artwork TeeStock menjadi file yang dapat diproses oleh vendor DTF dan menghasilkan produk apparel berkualitas.

Dokumen ini mengatur:

- Artwork source files.
- Image resolution.
- Physical print dimensions.
- Transparency and opacity.
- Color management.
- Typography and fine details.
- Export formats.
- Vendor handoff.
- Heat-press validation.
- Production quality control.

# 2. TECHNICAL STANDARD HIERARCHY

TDL menggunakan tiga lapisan spesifikasi.

**Level A — TeeStock Internal Baseline**
Standar internal minimum yang harus dipenuhi artwork.

**Level B — Vendor Technical Specification**
Ketentuan khusus dari vendor DTF, termasuk RIP software, printer, tinta, adhesive powder, film, dan material.

**Level C — Production Sample Validation**
Bukti bahwa file dan konfigurasi produksi benar-benar menghasilkan kualitas yang dapat diterima.

Jika ketiganya berbeda, spesifikasi vendor harus diperiksa dan disepakati terlebih dahulu. Hasil sample menjadi bukti validasi proses.

Tidak boleh mengasumsikan semua vendor DTF mempunyai parameter yang sama.

# 3. MASTER ARTWORK REQUIREMENTS

## 3.1 Editable Source Master

Setiap desain harus mempunyai source file yang dapat diedit.

Format yang disarankan:

- SVG untuk artwork berbasis vector.
- PDF untuk dokumen vector yang disepakati.
- PSD atau format raster berlayer untuk artwork raster.
- Format native software apabila diperlukan.

Source master harus menyimpan:

- Elemen desain.
- Typography.
- Layer dan grouping.
- Background atau transparency.
- Referensi aset.
- Version information.

Jangan hanya menyimpan PNG sebagai satu-satunya master.

## 3.2 Production Export

Baseline internal:

| Property | TeeStock Baseline |
| --- | --- |
| Primary format | PNG |
| Color depth | PNG-24 / truecolor |
| Background | Transparent |
| Resolution target | 300 PPI at final size |
| Physical dimensions | Explicitly defined |
| Transparency | Verified |
| Compression | Lossless |
| Unwanted background | None |

Format alternatif seperti TIFF, PDF, SVG, AI, atau EPS hanya digunakan jika diterima vendor.

PNG transparan merupakan format kerja awal yang praktis untuk TeeStock, tetapi bukan satu-satunya format yang dapat digunakan dalam semua workflow DTF.

# 4. RESOLUTION & PHYSICAL DIMENSIONS

## 4.1 Resolution Standard

Target internal:

**300 PPI at actual print size.**

PPI menggambarkan jumlah pixel per inch pada ukuran fisik tertentu. Mengubah metadata DPI/PPI tanpa menambah pixel tidak meningkatkan kualitas gambar.

Rumus:

`Pixels = Print Dimension in Inches × 300`

Konversi:

`1 inch = 2.54 cm`

Contoh:

| Print Width | Pixels at 300 PPI |
| --- | --- |
| 10 cm | 1,181 px |
| 15 cm | 1,772 px |
| 20 cm | 2,362 px |
| 25 cm | 2,953 px |
| 28 cm | 3,307 px |
| 30 cm | 3,543 px |
| 35 cm | 4,134 px |

## 4.2 Artwork Dimension Planning

Setiap desain harus mempunyai target dimensi berdasarkan placement.

Contoh kategori:

- Small chest graphic.
- Left chest graphic.
- Center chest graphic.
- Large front graphic.
- Back graphic.
- Sleeve graphic.

Angka ukuran final ditentukan berdasarkan ukuran garment, desain, dan area cetak vendor.

Jangan memaksakan semua desain menggunakan ukuran yang sama.

## 4.3 Upscaling Rule

Artwork beresolusi rendah tidak otomatis menjadi high quality hanya karena diperbesar.

Jika artwork AI memiliki resolusi kurang:

1. Evaluasi kualitas sumber.
2. Periksa detail pada ukuran cetak.
3. Gunakan upscaling jika memang membantu.
4. Perbaiki bagian yang rusak.
5. Periksa ulang hasil pada ukuran sebenarnya.
6. Jangan menyetujui file hanya berdasarkan angka resolusi.

# 5. TRANSPARENCY & OPACITY

## 5.1 Background Transparency

Area yang tidak ingin dicetak harus benar-benar transparan.

Periksa:

- Tidak ada background putih tersembunyi.
- Tidak ada warna background yang tertinggal.
- Tidak ada unwanted pixels di luar artwork.
- Tidak ada halo atau fringe yang mengganggu.
- Tidak ada checkerboard pattern yang ikut diekspor.

Checkerboard hanya merupakan tampilan visual editor, bukan bagian artwork.

## 5.2 Opacity

Baseline:

- Elemen utama menggunakan opacity penuh.
- Hindari semi-transparent pixels yang tidak terkontrol.
- Soft shadow dan glow harus diuji.
- Efek fade harus dirancang sesuai kemampuan RIP dan vendor.

Jika ingin menghasilkan efek gradasi atau distressed:

- Pertimbangkan halftone.
- Gunakan pola titik yang terkontrol.
- Periksa ukuran titik.
- Lakukan sample print sebelum menyetujui.

Jangan menganggap semua efek transparansi layar akan direproduksi sama pada transfer DTF.

# 6. COLOR MANAGEMENT

## 6.1 Color Workflow

TeeStock menggunakan pendekatan vendor-confirmed color workflow.

RGB dan CMYK tidak boleh diperlakukan sebagai aturan universal yang saling menggantikan.

Beberapa vendor meminta RGB, beberapa meminta CMYK, dan sebagian menerima keduanya lalu melakukan konversi melalui RIP.

Aturan:

1. Tanyakan format warna yang diminta vendor.
2. Tanyakan apakah vendor memiliki ICC profile atau color reference.
3. Simpan color specification per vendor.
4. Jangan mengubah artwork master hanya untuk satu vendor.
5. Buat production export sesuai kebutuhan vendor.
6. Lakukan sample untuk warna yang kritis.

## 6.2 Color Accuracy

Monitor bukan referensi warna produksi yang absolut.

Perbedaan dapat dipengaruhi oleh:

- Display calibration.
- Color space.
- RIP conversion.
- Printer condition.
- Ink.
- Film.
- Adhesive powder.
- Garment color.
- Heat-press conditions.

Untuk warna penting, buat physical sample dan dokumentasikan hasilnya.

## 6.3 Color Record

Catat:

- Artwork color values.
- Source color space.
- Export color space.
- Vendor profile.
- Sample result.
- Approved production reference.

# 7. LINE WEIGHT, DETAILS & TYPOGRAPHY

## 7.1 Fine Detail

Elemen terlalu kecil dapat:

- Hilang ketika dicetak.
- Tidak menempel secara konsisten.
- Terputus.
- Mengalami detail loss.
- Terasa kasar atau tidak rapi.

Baseline internal untuk tahap desain:

- Hindari isolated details di bawah 1 mm.
- Gunakan 1–2 mm sebagai zona perhatian untuk detail kecil.
- Detail penting sebaiknya lebih tebal atau terhubung.
- Lakukan pengujian khusus untuk elemen sangat kecil.

Ini adalah batas kehati-hatian internal, bukan jaminan universal bahwa semua garis di atas angka tersebut akan berhasil.

## 7.2 Typography

Typography harus diperiksa pada ukuran cetak aktual.

Checklist:

- Tidak ada kesalahan ejaan.
- Tidak ada glyph rusak.
- Huruf tidak saling menempel tanpa disengaja.
- Negative space cukup.
- Ukuran teks kecil masih terbaca.
- Font tersedia dan memiliki lisensi sesuai.
- Font di-outline atau di-embed pada file vector sesuai persyaratan vendor.

Jangan menggunakan hasil AI text rendering sebagai satu-satunya sumber typography final.

## 7.3 Distressed & Halftone

Efek distressed dan halftone dapat menjadi karakter visual TeeStock.

Namun:

- Jangan membuat titik terlalu kecil.
- Hindari detail yang terpisah tanpa alasan.
- Pastikan area transparan tidak menghasilkan noise.
- Periksa kepadatan titik.
- Konfirmasi kemampuan white underbase dengan vendor.

# 8. ARTWORK COMPOSITION & PRINT FEEL

Desain yang memenuhi spesifikasi teknis belum tentu nyaman digunakan.

Periksa:

- Luas area tinta.
- Kepadatan visual.
- Distribusi elemen.
- Negative space.
- Berat visual.
- Hubungan artwork dengan warna kain.

Desain dengan area tinta solid sangat besar berpotensi terasa lebih berat dan kurang fleksibel dibandingkan desain dengan penggunaan negative space yang baik.

Jangan mengorbankan estetika, tetapi pertimbangkan kenyamanan pemakaian.

# 9. GARMENT & PRINT PLACEMENT

Setiap desain harus mempunyai placement record.

Fields:

- Garment SKU.
- Garment color.
- Garment size.
- Print location.
- Print width.
- Print height.
- Horizontal alignment.
- Vertical placement.
- Vendor reference.

Placement harus diperiksa terhadap ukuran garment.

Satu ukuran artwork tidak otomatis cocok untuk semua ukuran kaos.

Untuk tahap awal, TeeStock dapat menetapkan satu standard placement untuk setiap kategori desain, kemudian memperluasnya setelah sample dan evaluasi.

# 10. VENDOR TECHNICAL PROFILE

Buat satu record untuk setiap vendor DTF.

Required information:

- Vendor ID.
- Vendor Name.
- Accepted File Formats.
- Required Color Space.
- Recommended Resolution.
- Maximum Print Width.
- Maximum Print Length.
- Minimum Line / Detail Requirements.
- Transparency Requirements.
- Halftone Guidance.
- White Underbase Handling.
- Mirroring Rules.
- Film Type.
- Powder Type, where disclosed.
- Press Instructions.
- Peel Method.
- Final Press Instructions.
- Warranty / Reprint Policy.
- Last Verified Date.

Vendor profile harus diperbarui jika proses atau material berubah.

# 11. VENDOR HANDOFF PROTOCOL

Sebelum mengirim artwork pertama ke vendor:

1. Kirim satu sample file.
2. Minta vendor memeriksa file.
3. Konfirmasi dimensi.
4. Konfirmasi color workflow.
5. Konfirmasi transparency dan opacity handling.
6. Konfirmasi detail minimum.
7. Konfirmasi mirroring responsibility.
8. Konfirmasi metode press dan peel.
9. Simpan jawaban vendor.
10. Lakukan test transfer.

**Mirroring:** jangan membalik artwork secara manual kecuali vendor memang meminta demikian. Pastikan siapa yang melakukan mirroring, karena proses RIP vendor dapat melakukannya secara otomatis.

# 12. HEAT-PRESS VALIDATION

Heat press harus mengikuti instruksi transfer dan garment yang digunakan.

Jangan menggunakan satu kombinasi temperatur, waktu, dan tekanan sebagai standar universal.

Catat:

- Heat press machine.
- Temperature.
- Time.
- Pressure setting.
- Pre-press duration.
- Peel condition.
- Final press duration.
- Cover sheet or finishing material.
- Garment type.
- Transfer batch.
- Operator.
- Date.

Lakukan sample test setiap kali menggunakan kombinasi material atau transfer yang belum tervalidasi.

# 13. PRODUCTION SAMPLE QA

Setiap sample diperiksa melalui lima aspek.

## A. Visual Quality
- Warna.
- Detail.
- Sharpness.
- Alignment.
- Artwork completeness.
- Background cleanliness.

## B. Transfer Quality
- Adhesion.
- Edge lifting.
- Missing areas.
- Powder residue.
- Uneven transfer.
- Surface defects.

## C. Garment Compatibility
- Fabric suitability.
- Heat damage.
- Discoloration.
- Fabric distortion.
- Hand feel.

## D. Durability
- Initial adhesion.
- Flexibility.
- Cracking.
- Peeling.
- Washing performance.

Pengujian ketahanan harus menggunakan prosedur perawatan yang ditetapkan TeeStock. Catat jumlah siklus dan kondisi pengujian. Jangan mengklaim wash durability tertentu tanpa bukti.

## E. Commercial Appearance
- Layak dijual.
- Tampilan sesuai positioning.
- Nyaman digunakan.
- Tidak terlihat seperti sample eksperimen.

# 14. PRODUCTION ACCEPTANCE

Artwork hanya boleh dinyatakan PRODUCTION VALIDATED apabila:

- File memenuhi spesifikasi vendor.
- Sample transfer berhasil.
- Heat press berhasil.
- Tidak ada defect kritis.
- Tampilan sesuai creative approval.
- Hasil dokumentasi tersimpan.

Defect kritis meliputi:

- Artwork terpotong.
- Teks salah.
- Background tidak disengaja.
- Transfer gagal menempel.
- Detail penting hilang.
- Garment rusak karena proses.
- Hak penggunaan artwork tidak jelas.

# 15. FINAL FILE PACKAGE

Setiap desain yang sudah disetujui harus memiliki:

**SOURCE**
- Editable master.
- Linked assets.
- Font information.
- Version history.

**PRODUCTION**
- Final transparent PNG.
- Approved dimensions.
- Vendor-specific export.
- Color information.
- Production specification.

**QA**
- Artwork QA checklist.
- Vendor confirmation.
- Sample photos.
- Heat-press record.
- Durability test record.
- Final approval.

# 16. FILE NAMING

Format:

`TS_[COLLECTION]_[DESIGN_ID]_[TYPE]_[SIZE]_[VERSION]_[STATUS]`

Contoh:

`TS_HC_001_PRINT_28CM_V1.0_APPROVED.png`
`TS_HC_001_SOURCE_V1.0_APPROVED.svg`

Jangan memasukkan informasi yang belum diverifikasi ke dalam nama file.

# 17. FINAL PREFLIGHT CHECKLIST

Sebelum artwork dikirim ke vendor:

- [ ] Creative approval sudah diberikan.
- [ ] Artwork QA sudah lolos.
- [ ] Source master tersedia.
- [ ] Print dimensions benar.
- [ ] Resolution efektif sesuai.
- [ ] Background transparency benar.
- [ ] Tidak ada unwanted pixels.
- [ ] Warna sesuai vendor workflow.
- [ ] Typography benar.
- [ ] Detail kecil diperiksa.
- [ ] File format diterima vendor.
- [ ] Mirroring responsibility dikonfirmasi.
- [ ] Garment placement ditentukan.
- [ ] Vendor profile masih berlaku.
- [ ] File final diberi version number.

# 18. INITIAL IMPLEMENTATION

Tahap awal TeeStock tidak perlu mengembangkan sistem color management atau production automation yang kompleks.

Prioritas:

1. Tentukan satu vendor DTF untuk pilot.
2. Dapatkan spesifikasi tertulis vendor.
3. Tetapkan satu blank garment untuk sample.
4. Siapkan satu artwork HUMAN CONDITION.
5. Cetak satu transfer.
6. Lakukan heat press.
7. Dokumentasikan hasil.
8. Perbarui vendor profile.
9. Revisi spesifikasi internal berdasarkan bukti.

**Acceptance Criteria:**

TDL-04 dinyatakan siap operasional setelah TeeStock mempunyai minimal satu vendor profile yang terisi, satu artwork yang lolos preflight, dan satu sample production yang telah dievaluasi.
