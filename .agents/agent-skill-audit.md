# Audit Agent & Skill BisnisHub

Tanggal: 2026-09-25. Lingkup: inventaris, routing, konflik instruksi, dan paket P0.
Snapshot ini bukan bukti kesiapan aplikasi atau registrasi Agent baru.

## Bukti dan batas pemeriksaan

- Working tree berisi perubahan tracked dan untracked sebelum audit. Baseline SHA-256 diambil untuk 1.151 file sumber yang terjangkau melalui inventaris Git dan `.agents/` sebelum perubahan.
- Sebelum paket ini: 38 Skill di `.agents/skills/`; setelahnya: 39 termasuk `agent-skill-maintainer`.
- `.agents/` semula berisi direktori `skills`; `.codex/` tidak ditemukan di root proyek. Ini tidak menyimpulkan tidak adanya konfigurasi Agent di luar proyek.
- Semua entrypoint diinventarisasi dan frontmatter dibaca; pemeriksaan isi terarah dilakukan pada routing UI, ERP, database, deployment, QA dan contoh AI. Supporting scripts/references lama belum diaudit menyeluruh atau dieksekusi.
- Root dan MGBOS `AGENTS.md`, README MGBOS, indeks sumber, laporan MGBOS-001 dan MGBOS-014 diperiksa langsung. Angka pengujian aplikasi dalam laporan tersebut tidak dijalankan ulang pada audit ini.

## Inventaris dan pemilik alur yang disarankan

| Kelompok | Skill yang ada | Batas pemakaian |
| --- | --- | --- |
| Pemeliharaan instruksi | `agent-skill-maintainer` (baru) | Agent, AGENTS.md, Skill dan konflik katalog |
| UI 21st | `21st-ai`, `21st-cli-use`, `21st-design-sync`, `21st-registry`, `21st-ui-build`, `21st-ui-explore`, `21st-ui-review` | Explore untuk pilihan, build untuk implementasi, review untuk audit; katalog/generasi/publikasi hanya sesuai kebutuhan |
| Desain | `design`, `brand`, `design-system`, `ui-styling`, `ui-ux-pro-max`, `banner-design`, `creative-director`, `slides` | Identitas, token, aksesibilitas atau artefak spesifik; jangan memuat semua untuk satu perubahan UI |
| Rekayasa | `cto`, `web-app-architect`, `fullstack-web-dev`, `api-backend-engineer`, `supabase-architect`, `integrated-erp-engine`, `git-deploy-ops`, `web-qa-testing`, `web-sec-perf` | Pilih berdasarkan hasil pekerjaan; bedakan saran arsitektur, implementasi, verifikasi dan rilis |
| Operasional dan keuangan | `cfo`, `coo`, `business-ops-engine`, `dtf-print-ops` | Pisahkan kebijakan bisnis dari implementasi transaksi; verifikasi asumsi terhadap sumber proyek |
| Pertumbuhan | `mentor-bisnis`, `cmo`, `content-strategist`, `copywriter-pro`, `marketing-promo-engine`, `performance-ads-specialist`, `retention-crm-expert` | Strategi, penulisan, akuisisi dan retensi sesuai permintaan |
| Integrasi AI dan komunikasi | `ai-automation-engine`, `ai-copilot-builder`, `whatsapp-automation` | Kontrak transaksi workspace harus mendahului otomasi |

Nama yang sama ditemukan di `.agents/skills/` proyek, `C:/Users/Rizky/.agents/skills/` dan `C:/Users/Rizky/.codex/skills/`: ketujuh Skill 21st pada tabel. Isi dan prioritas discovery antarinstalasi belum dibuktikan identik. Tidak ada salinan personal yang diubah atau dihapus.

## Konflik dan tindak lanjut

| Prioritas | Temuan berbukti | Penanganan |
| --- | --- | --- |
| P0 | Root menyebut workspace sebagai foundation; MGBOS AGENTS menerapkan pengecualian business tables/auth dari tahap 001 secara umum, sementara README melaporkan tahap 001–014 lokal | Diperbaiki: lokasi workspace dibuat netral tahap, batas 001 diberi konteks historis, scope tahap berikutnya harus bersumber pada spesifikasi |
| P0 | Laporan 001 menyebut database lokal lulus tetapi hosted CI belum berjalan; keberadaan tahap selanjutnya tidak membuktikan gate lulus | Gate dipertahankan. Audit ini tidak mengonfirmasi CI terkini atau mengizinkan tahap fitur baru |
| P0/P1 | `integrated-erp-engine` memakai `ts_ledger_entries` dan status `pending_payment/pending/dtf/press/pack/shipped`; `supabase-architect` memakai prefix legacy dan contoh `NUMERIC(12,2)` | P0: root melarang membawa contoh legacy menjadi kontrak MGBOS. P1: pisahkan referensi legacy dan MGBOS dalam Skill terkait |
| P0/P1 | `git-deploy-ops` berisi `git add .`, push `main`, konfigurasi Vite dan target TeeStock | P0: root menegaskan batas staging/rilis dan otorisasi. P1: perbarui runbook berdasarkan workspace; jangan menyalin perintah ini ke MGBOS |
| P1 | `ai-automation-engine` dan `ai-copilot-builder` menyertakan tabel/status legacy | Pembatasan root berlaku; revisi rinci menunggu paket integritas kontrak |
| P1 | QA Skill berorientasi checkout frontend; kontrak MGBOS juga membutuhkan database, otorisasi, snapshot dan transisi | Perbarui skenario berdasarkan risiko, bukan kuota jumlah tes; bedakan tes didefinisikan dan dieksekusi |
| P2 | UI memiliki beberapa Skill dengan cakupan berdekatan dan salinan 21st lintas instalasi | Routing proyek diperjelas; konsolidasi isi dan sinkronisasi personal belum dilakukan |
| P2 | 25 Skill lama memakai `argument-hint`, yang tidak termasuk allowlist validator Skill Creator saat ini | Dicatat sebagai batas kompatibilitas validator, bukan otomatis cacat runtime. Tidak menghapus metadata tanpa memeriksa dukungan target |
| P2 | `design` merujuk `project-management`, yang tidak ditemukan dalam inventaris Skill proyek | Verifikasi ketersediaan saat digunakan; revisi referensi tersebut dalam paket desain bila tidak tersedia |

## Hasil paket P0

- [Instruksi root](../AGENTS.md): routing maintenance, pembatasan workspace, contoh legacy, pemilihan UI dan cakupan otorisasi.
- [Instruksi MGBOS](../mgbos/AGENTS.md): konteks batas tahap, syarat bukti gate dan pemeriksaan proporsional untuk perubahan instruksi.
- [Skill Maintainer](skills/agent-skill-maintainer/SKILL.md): audit, pemilihan artefak, pembaruan dan validasi dengan pemicu yang spesifik.
- Laporan ini: inventaris lengkap nama Skill proyek dan backlog konflik.

Tidak membuat runtime Agent Implementer/Reviewer pada paket ini. Peran tersebut merupakan paket berikutnya; Skill baru adalah prosedur pemeliharaan, bukan Agent terpisah.

## Validasi paket

- `quick_validate.py` untuk Skill baru: PASS. PyYAML disediakan di direktori sementara karena Python host belum memilikinya; dependensi aplikasi tidak diubah.
- YAML 39 entrypoint dapat dibaca; semua nama sesuai folder dan description berupa string. Ini bukan sertifikasi perilaku 38 Skill lama.
- Review manual pemicu: "audit Skill proyek" dan "perbarui AGENTS MGBOS" sesuai; "buat halaman invoice" memakai specialist aplikasi, bukan Maintainer; "salin skema TeeStock ke MGBOS" memerlukan pemeriksaan kontrak workspace terlebih dahulu.
- Review manual batas tindakan: perubahan instruksi tidak memberi izin deploy atau push; status README tidak meluluskan gate; validator tidak menjadi alasan menghapus metadata lama.
- Pemeriksaan skenario ini adalah review instruksi, bukan evaluasi Agent independen. Tidak ada pengujian aplikasi, database reset, CI hosted atau deployment yang dilakukan.
- Pemeriksaan baseline mendeteksi perubahan pada dua AGENTS yang diedit dalam paket ini, serta perubahan bersamaan pada `mgbos/supabase/tests/vendor_network_and_qc.test.sql` yang tidak ditulis oleh pekerjaan ini. File tersebut dibiarkan utuh; preservasi global tidak diklaim sepenuhnya lulus.
- `git diff --check` keseluruhan repo melaporkan trailing whitespace pada perubahan lama `🏠 BisnisHub Command Center.md` (baris 133, 140, 145). Catatan tersebut di luar scope dan tidak diperbaiki. Empat artefak paket diperiksa terpisah karena sebagian masih untracked.

## Urutan berikutnya

1. P1 selesai untuk instruksi: ERP, database, backend, QA dan deployment diperbarui pada kelanjutan di bawah. Ini tidak meluluskan gate aplikasi.
2. P1: definisikan Agent Implementer/Reviewer bila diminta, memakai format runtime yang terverifikasi.
3. P2 UI selesai untuk routing dan entrypoint; supporting references lama tetap perlu diperiksa saat dipakai. Berikutnya: operasional dan keuangan, lalu integrasi AI dan marketing sesuai kebutuhan.

## Kelanjutan P1 — 2026-09-25

Bagian temuan di atas mempertahankan snapshot sebelum perbaikan. Status terkini untuk lima Skill berikut menggantikan backlog perbaikan instruksi terkait:

| Skill | Perubahan |
| --- | --- |
| [integrated-erp-engine](skills/integrated-erp-engine/SKILL.md) | Cabang legacy/MGBOS, state machine terpisah, snapshot, uang integer, biaya dan efek stok/ledger sesuai kontrak; menghapus asumsi universal persentase dan vendor |
| [supabase-architect](skills/supabase-architect/SKILL.md) | Target database eksplisit, otorisasi menyeluruh, batas fungsi privileged, migrasi baru, tipe hasil introspeksi; mengganti contoh guest INSERT tanpa batas dan fallback produksi |
| [api-backend-engineer](skills/api-backend-engineer/SKILL.md) | Kontrak caller dipertahankan, nilai otoritatif server, konfigurasi sandbox eksplisit, idempotensi atomik, event terlambat/berulang dan audit yang disaring |
| [web-qa-testing](skills/web-qa-testing/SKILL.md) | Matriks risiko UI/domain/database/otorisasi dan batas bukti; membedakan tes ditulis, dijalankan, CI dan deploy |
| [git-deploy-ops](skills/git-deploy-ops/SKILL.md) | Target/proyek diverifikasi, staging terpilih, rilis sesuai otorisasi, snapshot restore-test untuk legacy production SQL dan recovery yang mempertahankan histori |

Root AGENTS diperbarui agar menunjuk kelima Skill sebagai alur yang sudah dipisahkan; contoh legacy pada dua Skill AI masih menjadi backlog. Tidak mengubah aplikasi, SQL, dependensi proyek, konfigurasi deployment, salinan Skill personal atau aturan gate MGBOS.

Baseline baru diambil sebelum P1. Frontmatter lama termasuk `argument-hint` dipertahankan; description QA dan deployment disesuaikan dengan cakupan baru. Validator bawaan tidak menerima `argument-hint`, sehingga hasil validasi file asli harus dilaporkan sebagai keterbatasan kompatibilitas, bukan PASS penuh. Pemeriksaan tambahan dapat menggunakan salinan sementara tanpa field itu; hasil tersebut tidak membuktikan dukungan runtime terhadap field aslinya.

Review skenario dilakukan secara manual: order MGBOS tidak memakai status legacy; migrasi legacy tidak ditulis ke database MGBOS; webhook duplikat memerlukan efek atomik; kegagalan Docker tetap BLOCKED; persiapan PR tidak otomatis merilis ke produksi. Belum dilakukan evaluasi Agent independen atau pengujian aplikasi.

Hasil pemeriksaan P1:

- Lima file asli ditolak validator hanya karena field lama `argument-hint`; lima salinan sementara tanpa field tersebut lulus pemeriksaan struktur. File sumber tetap mempertahankan metadata tersebut.
- YAML, identitas nama, tautan Markdown, whitespace dan conflict markers tujuh artefak pekerjaan lulus pemeriksaan terarah.
- Perbandingan baseline mendeteksi perubahan bersamaan di `mgbos/supabase/tests/commercial_invoicing.test.sql` dan `mgbos/supabase/migrations/20260925140000_commercial_invoicing.sql`. Pekerjaan ini tidak menulis kedua file tersebut dan tidak mengembalikannya. Tidak mengklaim preservasi global sepenuhnya lulus.

## Kelanjutan P2 UI — 2026-09-25

Tujuh entrypoint diselaraskan: `21st-ui-explore`, `21st-ui-build`, `21st-ui-review`, `design`, `design-system`, `ui-styling`, dan `ui-ux-pro-max`. [Routing desain](skills/design/references/design-routing.md) serta root AGENTS mengikuti pembagian yang sama.

- Explore menyajikan pilihan; build melaksanakan arah yang sudah dipilih; review-only melaporkan temuan tanpa mengubah file. Permintaan memperbaiki memungkinkan koreksi dalam scope.
- Design system hanya mengubah kontrak token/komponen yang dibutuhkan. Halaman baru memakai sumber desain aplikasi yang sudah ada. Hasil pencarian menjadi usulan, bukan sumber kebenaran otomatis.
- Styling mengikuti library dan versi yang benar-benar terpasang; tidak otomatis menjalankan initializer atau mengganti konfigurasi CSS.
- UX menjadi sumber pencarian terarah. Tidak ada keharusan membuat MASTER baru atau memasang Python hanya agar pekerjaan UI dapat berjalan.
- Design router tidak lagi memanggil Skill yang tidak tersedia, memakai jalur `.claude`, mewajibkan provider gambar tertentu, atau memaksa publikasi/konfirmasi tambahan. Format artefak mengikuti permintaan.
- Jika 21st tidak tersedia, pekerjaan lokal yang feasible tetap berjalan dengan keterbatasan referensi dilaporkan. Penggunaan hosted generation memerlukan pemeriksaan kemampuan akun.
- Script, data, aset, dan referensi rinci lama dipertahankan. Contoh host/provider/versi di dalamnya belum divalidasi menyeluruh; entrypoint mewajibkan verifikasi sebelum penggunaan. Pekerjaan ini tidak menjalankan generator atau mengubah UI aplikasi.

Validasi:

- Empat entrypoint lulus `quick_validate.py` langsung: tiga `21st-ui-*` dan `ui-ux-pro-max`.
- `design`, `design-system` dan `ui-styling` ditolak hanya karena field lama `argument-hint`; salinan sementara tanpa field tersebut lulus. Metadata sumber tetap dipertahankan dan dukungan runtime field tersebut belum dibuktikan.
- Frontmatter, tautan Markdown dan whitespace diperiksa. Pemeriksaan skenario manual mencakup review-only, implementasi arah terpilih, halaman dalam design system lama, 21st unavailable, dan format PowerPoint versus HTML. Ini bukan evaluasi Agent independen.
- Baseline P2 mencakup 956 path, termasuk enam salinan personal untuk tiga Skill `21st-ui-*`. Pemeriksaan sebelum pembaruan laporan hanya menemukan delapan file Skill/referensi yang memang ditargetkan; pemeriksaan akhir juga mencakup root AGENTS dan laporan ini.

Agent runtime Implementer/Reviewer belum dibuat. Paket berikutnya yang tidak memerlukan konfigurasi runtime baru adalah penyelarasan `cfo`, `coo`, `business-ops-engine` dan `dtf-print-ops`.
