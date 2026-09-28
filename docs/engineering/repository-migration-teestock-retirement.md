# Kelanjutan migrasi dan retirement TeeStock — 28 September 2026

Owner meminta dua commit dokumentasi disimpan ke GitHub sekaligus melanjutkan migrasi folder. Owner kemudian mengonfirmasi: "Sudah dipensiunkan; pertahankan sebagai arsip" untuk storefront/Supabase TeeStock lama.

## Scope dan preservasi

- Dua commit `15ec154` dan `ba4a6d2` menyimpan 33 dokumen bisnis; dipublikasikan melalui PR #8 tanpa perubahan isi.
- Perubahan migrasi yang sudah ada dipertahankan: prototype ke `archive/mgbos-vite-prototype/`, materi TeeStock lama ke `bisnis/teestock/archive/`, blueprint baru tetap pada folder bernomor.
- Audit awal membandingkan 175 file sumber yang hilang dari lokasi lama dengan lokasi arsip: 172 identik (dengan toleransi CRLF/LF). Tiga file Playwright/E2E sudah berbeda sebelum pekerjaan ini dan dipertahankan, tidak ditimpa versi HEAD.
- Environment lokal yang sebelumnya tracked tetap berada di disk arsip tetapi tidak dipublikasikan ulang. Ignore untuk environment, metadata hosting, dependency dan cache tetap berlaku.
- SQL TeeStock hanya berpindah lokasi. SQL MGBOS tidak dipindahkan atau diubah. Tidak ada remote database reset, seed, maupun deployment.

## Penyesuaian consumer

- Root `dev`/`build` kini mengarah ke workspace MGBOS resmi. Alias storefront/prototype lama dikeluarkan dari runtime root.
- Root Vercel build/install ditolak dengan pesan retirement. Ini tidak menghapus deployment remote existing, dan tidak otomatis menerbitkan MGBOS.
- Dua script database admin membaca SQL historis dari lokasi arsip. Shared verifier mengikuti lokasi sumber arsip.
- Navigasi, aturan agent dan routing skill menyatakan archive sebagai referensi, bukan runtime aktif.
- Junction root `supabase` tetap tercatat sebagai obsolete dan dilarang digunakan; tidak ditelusuri, dihapus, atau direlink.

## Batas tahap berikutnya

Admin/shared, MGBOS, KasKita dan asisten Python tidak dipindahkan dalam tahap ini. Relokasi MGBOS memerlukan guard yang mendukung perpindahan tanpa menghilangkan baseline migrasi, lalu seluruh acceptance lokal/CI sesuai rencana. Retirement TeeStock tidak membuktikan kesiapan pengganti untuk produksi.

Riwayat dan rujukan dalam dokumen historis tidak ditulis ulang secara massal. Worktree lain dan branch yang menyimpan commit unik dipertahankan.

## Bukti

Hasil pengujian lokal dan hosted CI dicatat pada deskripsi PR revisi final. Perbandingan SQL/file tidak berarti browser E2E atau status layanan produksi telah diverifikasi. Root deployment guard harus keluar dengan status gagal yang disengaja; test SQL admin menggunakan PGlite lokal, bukan database produksi.
