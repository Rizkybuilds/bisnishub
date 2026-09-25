# Rencana pengembangan lanjutan MGBOS untuk TeeStock

Tanggal: 2026-09-25. Status: rencana kerja yang dapat ditinjau, bukan implementasi atau izin deployment. Pemilik produk: Rizky. Prioritas eksplisit: TeeStock sebagai bisnis yang sedang berjalan; fondasi tetap dapat dipakai brand MultiGraph Group lainnya.

## 1. Keputusan utama

**Pembaruan setelah pendalaman dokumentasi:** [strategi curated-first](teestock-curated-strategy.md) menetapkan Curated Originals sebagai produk utama, custom sebagai layanan terstandar, dan polos sebagai pelengkap. Retail/custom tetap dilayani, tetapi tidak lagi mendapat bobot pengembangan yang sama. Arahan ini menggantikan urutan sementara sebelum model bisnis dipelajari lebih dalam.

Bangun MGBOS sebagai pusat operasional TeeStock terlebih dahulu: pesanan tercatat sekali, kebutuhan bahan terlihat, produksi dapat dijalankan, barang dapat dikirim, uang dapat direkonsiliasi dan laba dapat ditelusuri. Pertahankan storefront lama selama transisi. Jangan membangun ulang seluruh website sekaligus atau mengaktifkan kelima lini bisnis hanya karena tercantum dalam rencana lama.

Urutan prioritas: kebenaran transaksi dan kesiapan operasional; fondasi item/stok bersama; jalur order retail cepat dan penyelesaian custom sampai pengiriman; pengadaan/biaya; penghubung storefront; efisiensi dan otomasi. Integrasi berbayar dan AI dipertimbangkan setelah hambatan manual terukur.

## 2. Bukti, asumsi dan keputusan yang masih diperlukan

### Dasar yang diperiksa

- Kode lokal memuat modul pelanggan, lead, requirement/Custom Atelier, penawaran/PDF, order, produksi/QC, vendor, invoice, pembayaran dan ledger analitis.
- [Laporan 016](../engineering/mgbos-016-report.md) mencatat pengembangan biaya aktual dan margin. Laporan tersebut bukan bukti deployment terbaru; semua gate harus diverifikasi per revisi saat implementasi.
- Aplikasi publik Next.js baru masih berupa shell. Source storefront legacy memiliki katalog, detail produk, custom order, keranjang dan tracking; keberadaan source tidak membuktikan seluruh layanan live sehat.
- Paket AI dan integrasi baru masih kerangka. Jangan mengasumsikan WhatsApp, bank, kurir atau gateway sudah tersambung.
- [Register kesiapan](../engineering/operational-readiness.md) masih memerlukan bukti CI, staging, backup/restore, monitoring dan target pemulihan.
- Dokumen [operasional TeeStock](../../../bisnis/teestock/operasional/rencana-operasional-teestock.md) dan [roadmap TeeStock](../../../bisnis/teestock/operasional/roadmap-pengembangan-teestock.md) menggambarkan blank apparel, desain katalog, custom, buffer/JIT dan produksi press. Harga, stok, mesin, kapasitas, lokasi, SLA dan profil vendor di sana adalah konteks historis yang perlu dikonfirmasi.

### Asumsi kerja sementara

Rizky mengonfirmasi penjualan aktif **gabungan retail dan custom**, lalu memberi kewenangan menetapkan fokus berdasarkan dokumentasi. Strategi terpilih memprioritaskan **curated design**; custom/polos tetap dipelihara dan diuji sebagai alur pendukung. Subjenis retail yang aktif (polos, desain katalog atau keduanya), proporsi penjualan, volume dan kanal masih perlu dikonfirmasi. Gunakan custom sebagai pembanding teknis yang sudah tersedia, lalu bangun item/stok bersama dan order retail cepat sebelum integrasi storefront. Rizky mengoperasikan bisnis sebagai solopreneur.

### Keputusan produk sebelum paket terkait dimulai

| Pertanyaan | Dampak keputusan | Pemilik |
| --- | --- | --- |
| Gabungan retail/custom sudah dikonfirmasi; subjenis retail, kanal dan order/pcs per minggu belum | Besaran pilot, kebutuhan import dan kapasitas | Rizky |
| Tiga hambatan harian dan waktu yang terbuang | Menentukan paket paling bernilai setelah gate dasar | Rizky |
| Stok/hub/vendor yang benar-benar digunakan | Cakupan stok dan pengadaan; jangan aktifkan multi-hub fiktif | Rizky |
| Kebijakan DP, pelunasan, pembatalan, cacat dan pengiriman | Guard pelepasan produksi/pengiriman dan refund | Rizky |
| Anggaran layanan dan waktu review/pengujian per minggu | Tahap aktivasi layanan serta kecepatan pelaksanaan | Rizky |
| Sistem pemilik order, pembayaran dan stok saat ini | Strategi koeksistensi dan cutover tanpa double posting | Rizky + pelaksana teknis |

Jawaban belum tersedia tidak menghalangi inventarisasi dan desain; jangan mengunci nominal, SLA, pembelian layanan atau migrasi transaksi berdasarkan asumsi.

## 3. Hasil bisnis yang dituju

Owner dapat menjawab dari satu tempat: pesanan mana yang perlu ditangani hari ini, bahan apa yang kurang, vendor mana yang ditunggu, barang apa yang lolos QC dan siap dikirim, invoice apa yang belum dibayar, serta order mana yang biaya aktualnya belum lengkap.

Ukur baseline sebelum pilot: waktu administrasi per order, jumlah input ulang, order terlambat, mismatch stok, selisih pembayaran dan kelengkapan biaya. Sasaran awal untuk dievaluasi: waktu administrasi turun 30% dari baseline; nol duplikasi/mismatch saldo pada pilot; seluruh order pilot memiliki referensi asal, status pemenuhan dan biaya yang dapat ditelusuri. Persentase efisiensi adalah target usulan, bukan hasil atau jaminan.

## 4. Alur produk yang diprioritaskan

| Lini | Alur minimum | Batas tahap awal |
| --- | --- | --- |
| Custom Atelier | Inquiry → spesifikasi/artwork → penawaran → persetujuan → order → invoice/pembayaran sesuai kebijakan → bahan/produksi → QC → pengiriman → penutupan | Tidak membuat editor desain atau gang sheet otomatis |
| Kaos polos | Produk/varian → order retail → pembayaran → reservasi → picking/packing → pengiriman | Tidak memaksa lead/penawaran/SPK cetak untuk barang tanpa proses cetak |
| Desain katalog | SKU/varian + versi artwork → order → bahan/film → press → QC → pengiriman | Tidak menganggap produk cetak selalu mempunyai stok barang jadi |

Pembayaran, produksi, QC dan pengiriman memiliki lifecycle terpisah. Kebijakan yang diatur owner mengendalikan kesiapan kerja; uang masuk tidak otomatis menandakan barang selesai. Gunakan satu model order dengan jalur komersial sesuai jenis penjualan, tanpa membuat transaksi penawaran palsu untuk retail.

## 5. Tahapan dan backlog

ID `TS-PLAN-*` adalah identitas rencana, bukan nomor engineering yang sudah disetujui. Tetapkan nomor implementasi berikutnya setelah memeriksa backlog agar tidak bentrok dengan perubahan yang berjalan. Ukuran S/M/L menyatakan kompleksitas relatif: S satu area terbatas, M lintas beberapa komponen, L lintas transaksi/migrasi/integrasi. Estimasi kalender ditetapkan setelah discovery; jangan menjalankan lebih dari satu paket implementasi aktif untuk kapasitas solopreneur.

| Paket | Prioritas / ukuran | Hasil konkret | Dependensi dan syarat selesai |
| --- | --- | --- | --- |
| TS-PLAN-01 Baseline operasional | P0 / S | Peta kanal, lini, data, pemilik sistem, contoh alur dan baseline waktu | Review 3–5 contoh transaksi yang disamarkan; semua asumsi kritis memiliki status/pemilik |
| TS-PLAN-02 Stabilitas transaksi | P0 / L | Audit ulang uang/otorisasi/retry, state machine, upgrade migrasi; perbaikan temuan kritis; dokumentasi selaras | 01; regresi lewat server command/UI, konkurensi relevan dan database lulus; CI pada revisi yang sama terkonfirmasi |
| TS-PLAN-03 Kesiapan lingkungan | P0 / M | Rencana staging, konfigurasi billing, target RPO/RTO, backup/restore, monitoring dan recovery | Dapat didesain bersama 02; aktivasi sesuai scope; semua bukti register wajib sebelum transaksi nyata |
| TS-PLAN-14 Library desain & produk curated | P1 / L | Koleksi, sumber/bukti hak, versi artwork, sampel, varian/placement, mockup, price book dan resep minimum | 01/02; publikasi ditolak jika hak atau kelayakan produksi belum diperiksa; order mengunci versi; master digital dibedakan dari stok fisik |
| TS-PLAN-04 Meja kerja owner | P1 / M | Antrean tindakan dengan tenggat, prioritas, alasan dan tautan sumber; filter TeeStock; detail order terpadu | 02; jumlah berasal dari query keseluruhan scope/periode, bukan penjumlahan 100 baris terakhir; tidak menggandakan status transaksi |
| TS-PLAN-05 Artwork dan persetujuan | P1 / M | File berversi, akses aman, revisi yang disetujui pelanggan, catatan persetujuan dan checklist preflight | 02; versi yang diproduksi dapat ditelusuri, file internal tidak terbuka publik; revisi tidak menimpa persetujuan lama |
| TS-PLAN-06 Pengiriman dan penutupan | P1 / L | Shipment/item/qty, kirim parsial, resi manual, label A6, serah-terima, gagal/retur dan guard penutupan order | 02 + kebijakan owner; uji partial, over-shipment, resi duplikat, batal sebelum kirim, delivered berulang; biaya kurir aktual terpisah |
| TS-PLAN-07 Item, varian dan stok minimum | P1 / L | SKU kaos ukuran/warna/bahan, film dan kemasan; lokasi aktif; mutasi, reservasi, pelepasan, pemakaian, cacat dan stock opname beralasan | 01/02; dua order bersamaan tidak memakai unit stok sama; persediaan vendor dicatat sebagai informasi, bukan stok milik sendiri |
| TS-PLAN-08 Pengadaan dan kas keluar | P1 / L | Kebutuhan bahan → permintaan vendor/PO sederhana → penerimaan parsial → tagihan/biaya → pembayaran vendor; tautan order/SPK | 07; receipt/payment retry aman, biaya tidak tercatat dua kali, penerimaan cacat dan saldo utang dapat ditelusuri |
| TS-PLAN-09 Order retail cepat | P1 / L | Order multi-item dari SKU dan harga tersimpan, diskon berwenang, invoice/pembayaran, reservasi; rute polos vs cetak | 07 dan 02; tidak diwajibkan penawaran manual untuk tiap kaos; stok bersama custom/retail tidak oversell; snapshot historis aman |
| TS-PLAN-10 Pembatalan, retur dan refund | P1 / L | Kasus keluhan, item/qty alasan, penerimaan balik dan disposisi stok, kewajiban refund, bukti kas keluar | 06/07 + aturan owner; refund parsial tidak melebihi hak, retry aman, tidak menghapus pembayaran asli atau menyamakan reversal dengan refund |
| TS-PLAN-11 Penghubung storefront | P2 / L | Pemetaan ID eksternal, staging import, dry-run, validasi, idempotensi, rekonsiliasi dan status integrasi | 09/10 + ADR koeksistensi; replay tidak membuat order/payment ganda; cutover per cohort, pemilik data jelas; scope legacy terpisah |
| TS-PLAN-12 HPP dan profit tepercaya | P1 / M | Biaya bahan, film, vendor, kemasan, fee dan cacat yang terverifikasi; biaya sementara vs final; export rekonsiliasi | 08/10; tidak double-count estimasi/komitmen/aktual, ongkir direkonsiliasi, biaya belum lengkap diberi label provisional |
| TS-PLAN-13 Otomasi terbatas | P2 / M | Reminder internal dan draft pesan; kemudian satu integrasi terbukti bernilai | Pilot stabil + command idempotent/outbox yang diuji; kegagalan/retry dan audit terlihat, tidak kirim otomatis tanpa scope/izin |

Paket 06 dan 07 dapat diprioritaskan ulang menurut hambatan: pengiriman mendahului jika fulfillment manual bermasalah; stok mendahului jika oversell/pengadaan paling mengganggu. Paket 12 harus mulai dengan aturan biaya sejak 02; penyempurnaan penuh bergantung data 08/10. Refund minimum yang aman menjadi syarat pilot berbayar; retur lengkap dapat ditambahkan sesuai cakupan pilot.

## 6. Kontrak transaksi sebelum menulis kode

Setiap paket transaksi wajib merinci trigger, aktor, kondisi awal, hasil, dampak uang/stok, retry, audit dan kegagalan. Tabel berikut adalah kebutuhan yang diusulkan, bukan nama fungsi/tabel baru yang sudah final.

| Tindakan | Guard utama | Efek atomik dan penanganan ulang |
| --- | --- | --- |
| Konfirmasi order retail | Aktor berwenang, varian/harga/qty sah, external ID unik | Snapshot item/harga, reservasi sesuai kebijakan, audit; request sama memberi hasil sama |
| Reservasi/pemakaian bahan | Scope lokasi dan organisasi sesuai; tersedia cukup; status order/SPK sah | Mutasi/reservasi terkait sumber; kegagalan tidak menyisakan saldo setengah berubah |
| Terima pembelian | Qty diterima tidak melebihi kebijakan PO; cacat dipisahkan | Receipt dan stok baik/karantina; retry receipt tidak menambah stok dua kali |
| Lepas untuk produksi | Artwork disetujui jika perlu; kebutuhan bahan dan aturan pembayaran terpenuhi | Kesiapan produksi tercatat dengan sumber; pengecualian owner beralasan, bukan status pembayaran palsu |
| Dispatch shipment | Qty siap/QC sesuai, belum dikirim, alamat tersimpan, kebijakan pembayaran terpenuhi | Alokasi item pengiriman dan audit; batas total per item; status kurir dipetakan ke kanonikal |
| Refund | Pembayaran asli terkonfirmasi, hak refund tersisa, otorisasi finance/owner | Catatan kas keluar dan kewajiban/refund terkait; original payment tetap historis; retry aman |
| Tutup order | Pemenuhan selesai atau sisa dibatalkan sah, saldo/kewajiban diselesaikan, biaya lengkap | Penutupan dapat ditelusuri; tidak menutup hanya karena satu shipment delivered |

Lifecycle pengiriman mengikuti sumber kanonikal: `DRAFT → READY → DISPATCHED → IN_TRANSIT → DELIVERED`, dengan `FAILED`, `RETURNED`, `CANCELLED` sebagai pengecualian. Detail edge/guard dibuktikan pada spesifikasi paket. Dokumen ringkasan arsitektur yang memakai nama berbeda tidak boleh diam-diam mengganti kanonikal; selesaikan konflik dan catat keputusan terlebih dahulu.

## 7. Koeksistensi dengan TeeStock yang berjalan

1. Jangan memindahkan domain, mengganti checkout atau menulis database lama sebagai bagian dari perencanaan ini.
2. Pada discovery, inventaris sumber order, produk, stok, payment dan media dari source/akses baca yang diizinkan. Inspeksi produksi adalah tugas terpisah dengan target jelas.
3. Pilih satu penulis otoritatif untuk setiap objek dan cohort. Sebelum cutover, sistem lama tetap otoritatif untuk transaksi lamanya; salinan MGBOS adalah shadow/reference dan tidak dihitung sebagai kas masuk baru.
4. Simpan source system + external ID + versi + waktu import. Dry-run menunjukkan jumlah, selisih dan record ditolak; jangan impor seluruh sejarah sebelum mapping terbukti.
5. Stok bersama tidak boleh mempunyai dua sumber reservasi independen. Tetapkan satu otoritas atau pisahkan alokasi cohort secara eksplisit sebelum dua jalur menerima order.
6. Lakukan pilot dengan cohort bertanda dan waktu batas. Rekonsiliasi order, saldo, pembayaran dan stok; rollback routing aplikasi tidak menghapus transaksi yang sudah masuk. Jangan dual-write tanpa desain idempotensi dan rekonsiliasi.
7. Perubahan schema/interface lintas legacy-MGBOS perlu ADR dan scope implementasi tersendiri. Desain adapter di MGBOS lebih dulu; aplikasi lama tetap tidak diubah dalam pekerjaan ini.

## 8. Pilot dan kriteria penerimaan

Pilot teknis memakai data sintetis di lingkungan terisolasi. Pilot operasional hanya setelah readiness, otorisasi dan jalur deployment yang sesuai tersedia; aturan saat ini tetap melarang perubahan database produksi. Jangan menyatakan dokumen ini sebagai waiver.

Acceptance utama adalah curated dengan ambang belajar pada strategi terkait; custom/polos menjadi regresi operasional bersama. Usulan sampel teknis lintas alur: 10 order dalam dua siklus operasional, dengan penyesuaian terhadap volume nyata; bila volume rendah, jangan membuat transaksi palsu untuk memenuhi jumlah. Cakup custom, retail polos dan desain katalog hanya jika benar-benar aktif. Kasus pengecualian boleh dibuktikan dengan skenario sintetis terpisah.

Checklist penerimaan:

- Order normal dari masuk sampai biaya final/pemenuhan dapat ditelusuri.
- Skenario kurang bahan, pembayaran parsial, kelebihan alokasi ditolak, perubahan artwork, QC rework, kirim parsial, pembatalan dan refund diuji sesuai scope.
- Nominal order/invoice/payment/refund dapat direkonsiliasi; nol mismatch yang belum dijelaskan.
- Stok dihitung fisik untuk item pilot; selisih dicatat dan diperbaiki lewat mutasi resmi.
- Tidak ada bug kritis akses, saldo, duplikasi atau kehilangan data; tes regresi, CI dan upgrade lulus pada revisi rilis.
- Restore drill memenuhi target owner; alarm diuji; prosedur manual saat gangguan tersedia.
- Rizky dapat menyelesaikan alur sehari-hari tanpa SQL atau bantuan developer; bukti penerimaan dicatat.

## 9. Batas ruang lingkup dan biaya

Tunda ERP brand lain, portal reseller/royalti creator, payroll, akuntansi statutory lengkap, marketplace omnichannel, editor desain, optimasi gang sheet, multi-hub cerdas dan AI agent otonom. Bangun hanya jika lini aktif dan biaya manual membenarkannya.

Budget belum diketahui. Hindari langganan baru pada tahap desain. Untuk setiap layanan yang diperlukan kemudian, bandingkan kebutuhan, biaya tetap, biaya per transaksi, storage, backup, staging, monitoring, maintenance dan exit/export data memakai harga yang diverifikasi saat keputusan. Tetapkan batas pengeluaran dengan owner sebelum pengadaan; tidak ada harga vendor atau kuota lama yang dianggap berlaku otomatis.

Untuk menjaga kapasitas: satu paket implementasi aktif, review mingguan dengan owner, perbaikan kritis didahulukan. Sesudah dua paket pertama selesai, gunakan durasi aktual sebagai dasar forecast. Rencana ini sengaja tidak menjanjikan tanggal produksi tanpa mengetahui kapasitas, anggaran dan kondisi readiness.

## 10. Urutan pelaksanaan yang disarankan

Urutan baru berdasarkan strategi curated-first: **01 → 02 → 14 → 07 → 09 → 05 (minimum artwork/produksi) → 06 → 10 (minimum refund) → pilot curated → 04 → 08 → 12 → 11 → 13**. Persiapan 03 menjadi gate sebelum penggunaan operasional, bukan izin mengaktifkan layanan di luar scope. Bagian 05 yang sudah dipenuhi oleh library 14 tidak dibangun dua kali; gunakan library bersama untuk artwork custom. Minimum pencatatan pengadaan/biaya harus tersedia sejak pilot agar kontribusi tidak dihitung dari biaya yang belum lengkap; paket 08/12 menyempurnakan alur tersebut. Full retur dapat menyusul, tetapi jangan menerima transaksi berbayar tanpa jalur refund yang aman. Integrasi storefront tidak mengganti checkout lama sebelum mapping dan rekonsiliasi terbukti.

Deliverable paket pertama: peta alur aktual, 3–5 contoh transaksi disamarkan, inventaris sistem/data, daftar masalah berurutan berdasarkan dampak, baseline waktu, keputusan scope pilot dan acceptance checklist. Hasil ini mengubah asumsi menjadi backlog implementasi yang siap dikerjakan.

## 11. Referensi dan status

- [Aturan engineering](../../AGENTS.md)
- [Kebijakan pemeliharaan](../engineering/maintenance-policy.md)
- [Register kesiapan](../engineering/operational-readiness.md)
- [Spesifikasi pilot sebelumnya](README.md)
- [State machine kanonikal](<../../../catatan/sesi/2026-09-23 - MGBOS 0.3 — Business State Machines.md>)

Dokumen ini menambah rencana prioritas TeeStock tanpa mengganti kontrak transaksi yang berlaku. Tidak ada perubahan kode, migrasi, layanan eksternal atau deployment dalam penyusunan rencana ini.
