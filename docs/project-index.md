# Indeks proyek BisnisHub

Diperiksa dari struktur dan manifest lokal pada 2026-09-27. Owner keputusan repo: Rizky. Penanggung jawab teknis/operasional per sistem perlu ditetapkan sebelum rilis; tabel ini tidak mengklaim layanan telah terverifikasi live.

| Sistem            | Lokasi                      | Batas dependency/data                                                                  | Status berdasarkan repo                                     |
| ----------------- | --------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| MGBOS resmi       | [mgbos](../mgbos/README.md) | pnpm workspace; `mgbos/packages/`; `mgbos/supabase/` terisolasi                        | Next.js; gate ada, readiness dinilai per revisi             |
| TeeStock lama (retired) | `bisnis/teestock/archive/web/` | SQL dan Supabase di `bisnis/teestock/archive/`; arsip referensi | Tidak dijalankan atau dideploy; konfirmasi owner 2026-09-28 |
| Admin existing    | `apps/bisnishub-web/`       | npm lockfile sendiri; paket/data legacy terkait TeeStock                               | Implementasi existing, bukan aplikasi MGBOS Next.js         |
| MGBOS prototype (retired) | `archive/mgbos-vite-prototype/`               | npm lockfile sendiri; kontrak legacy                                                   | Arsip referensi; tidak dijalankan/dideploy sebagai aplikasi aktif          |
| KasKita           | `bisnis/kaskita/mobile/`    | npm lockfile sendiri; `bisnis/kaskita/supabase/`                                       | Expo; proyek independen dari holding percetakan             |
| Shared legacy     | `packages/shared/`          | Layanan/UI untuk aplikasi existing/prototipe; bukan `@mgbos/domain`                    | Perubahan harus memeriksa seluruh consumer                  |
| Asisten Python    | `main.py`, `agent.py`       | `requirements.txt`; membaca `prompts/` dan `memory/` relatif file                      | Tool existing; runtime/layanan eksternal belum diverifikasi |

## Dokumen bisnis

Folder yang tersedia: `bisnis/multigraph/`, `bisnis/teestock/`, `bisnis/rizkybuild/`, `bisnis/titik-buta/`, `bisnis/kaskita/`. Titik Buta dan KasKita tetap proyek independen. Jangan membuat folder atau aplikasi baru hanya karena nama brand muncul di roadmap.

`catatan/sesi/` menyimpan histori diskusi dan beberapa sumber spesifikasi yang masih dirujuk MGBOS. Jangan memindahkan atau mengganti status sumber tersebut hanya demi merapikan navigasi. Keputusan baru ditulis di dokumen pemiliknya dan ditautkan dari catatan.

## Routing pekerjaan

- Implementasi MGBOS: baca root AGENTS, `mgbos/AGENTS.md`, README, spesifikasi dan test terkait.
- Legacy storefront/admin/prototype: periksa manifest, consumer shared, konfigurasi hosting dan target data aktual. Aturan MGBOS tidak otomatis menggantikan kontrak legacy.
- Skill/peran: `.agents/skills/agent-skill-maintainer/SKILL.md`; nama skill khusus proyek menggunakan prefix seperti `mgbos-`.
- Bisnis: pilih folder bisnis dan specialist sesuai kebutuhan; jangan mengubah kode dari permintaan diskusi strategi.
- Pengaturan bersama: [aturan direktori](engineering/repository-layout.md) dan [keputusan migrasi](decisions/001-repository-organization.md).

README adalah pintu masuk; indeks ini adalah peta lokasi; spesifikasi/detail teknis tetap dimiliki proyek. Data target di sini tidak mengizinkan deployment atau mutasi database.

Target berikutnya adalah `systems/`, sesuai [ADR-001](decisions/001-repository-organization.md) dan [rencana migrasi](engineering/repository-migration-plan.md). Tabel lokasi aktif di atas belum berubah; penetapan target bukan pemindahan fisik.
