# Aturan direktori dan dokumentasi

Berlaku untuk organisasi repo, bukan pengganti aturan bisnis masing-masing sistem. Lokasi yang saat ini dapat dijalankan tercatat di [indeks proyek](../project-index.md).

## Pembagian sumber

| Lokasi                              | Pemilik dan fungsi                                                                                    |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Root README / AGENTS                | Navigasi, batas bersama dan routing; hindari menyalin semua spesifikasi                               |
| `docs/governance/`                  | Konstitusi dokumentasi, canonical source map, dan tata kelola lintas sistem                          |
| `docs/operating-model/`             | Model operasi solo-founder, alokasi beban kerja, dan prinsip founder-by-exception                    |
| `docs/roadmaps/`                    | Roadmap kanonikal eksekusi lintas sistem menuju peluncuran terkendali                                |
| `docs/engineering/`                 | Kebijakan lintas proyek                                                                               |
| `docs/decisions/`                   | Keputusan tingkat repository                                                                          |
| `<proyek>/docs/`                    | Arsitektur, ADR, spesifikasi, runbook dan bukti milik sistem                                          |
| `.agents/skills/`                   | Entry skill proyek; prefix menjelaskan scope khusus, bukan salinan per provider                       |
| `.agents/roles/` / `.agents/evals/` | Kontrak peran dan baseline perilaku; kontrak saat ini khusus MGBOS, bukan izin lintas proyek          |
| `bisnis/<nama>/`                    | Brand, riset, marketing, SOP dan keuangan milik bisnis                                                |
| `catatan/`                          | Riwayat, ide dan bahan diskusi; sumber lama yang masih kanonikal dipertahankan sampai migrasi rujukan |
| `templates/`                        | Template reusable, bukan hasil pengerjaan suatu proyek                                                |
| `assets/`                           | Aset lintas proyek; aset khusus aplikasi tetap dekat consumer                                         |
| `scripts/`                          | Perintah pemeliharaan dan pemeriksaan repo                                                            |
| `tools/`                            | Program dengan lifecycle sendiri; asisten Python berada di `tools/assistant/`      |
| `tools/assistant/prompts/`, `tools/assistant/memory/`               | Data/input asisten Python existing; dibaca `agent.py`, bukan pengganti AGENTS atau skill              |
| `scratch/`                          | Artefak existing yang belum dipromosikan; jangan jalankan skrip data tanpa audit target               |
| `.temp/`                            | Scratch baru yang diabaikan Git; bukan lokasi satu-satunya hasil kerja penting                        |

Persona dan memory asisten mengikuti direktori tool; ekspor sesi tetap ke `catatan/sesi/` root. Jangan menyamakan `memory/` dalam repo dengan memori personal runtime agent.

## Dokumentasi dan penamaan

Simpan satu keputusan resmi di tempat pemiliknya. Catatan sesi menautkan keputusan tersebut, bukan membuat versi kedua yang bisa berbeda. Gunakan tautan Markdown relatif untuk dokumen engineering agar terbaca di GitHub; Obsidian wikilinks dapat dipertahankan untuk navigasi vault. Frontmatter dokumen bisnis mengikuti konvensi vault; frontmatter SKILL mengikuti schema skill.

Direktori kode baru memakai lowercase-kebab-case. Jangan mengganti nama catatan, canvas atau aset lama secara massal: backlink, embed dan consumer harus diperiksa. Simpan output build/cache secara lokal melalui ignore yang sesuai; jangan hapus file tracked hanya karena namanya tampak sementara.

## Dependency dan database

Target migrasi software adalah `systems/`, menggantikan usulan `projects/`. Lokasi aktif tetap mengikuti indeks proyek sampai masing-masing tahap [rencana migrasi](repository-migration-plan.md) selesai. `bisnis/` diarahkan menjadi pengetahuan bisnis; tidak ada aplikasi aktif di dalamnya. Jangan membuat folder kosong untuk runtime JARVIS atau sistem lain yang belum diimplementasikan.

Satu Git repo dapat memuat beberapa workspace instalasi. Saat ini MGBOS tetap memakai pnpm/lockfile sendiri; aplikasi existing memakai npm/lockfile masing-masing. Tidak ada root pnpm workspace baru pada tahap ini.

Shared code mengikuti consumer dan kontrak pemiliknya. `archive/teestock-v1/packages/shared/` adalah arsip legacy; `systems/mgbos/packages/` milik MGBOS. Jangan mengekstrak paket global tanpa kebutuhan nyata lintas sistem.

Database dan credentials mengikuti sistem, bukan root repo. Root Supabase legacy tidak boleh menjadi fallback MGBOS. Worktree Git juga tidak otomatis mengisolasi stack database lokal.

## Worktree dan integrasi

Worktree adalah checkout sementara branch dari repo yang sama. Ia dapat berada di luar folder utama; itu bukan proyek atau repo baru. Semua sumber tetap dilacak dalam commit dan masuk ke checkout utama melalui integrasi branch yang ditinjau. Jangan menyalin file lintas checkout secara manual atau menghapus checkout yang masih dipakai.

Perubahan pada branch belum otomatis tersedia di branch lain. Catat lokasi kerja, branch, commit dan status integrasi dalam laporan. Konfigurasi provider tetap menunjuk aturan bersama; jangan menyalin kebijakan yang berbeda ke tiap provider.

## KasKita setelah tahap 3

`systems/kaskita/apps/mobile/` dan `systems/kaskita/supabase/` adalah lokasi runtime aktif KasKita. `bisnis/kaskita/` tetap berisi pengetahuan bisnis. Sistem lainnya tidak otomatis ikut berpindah.

## Status 29 September 2026

MGBOS berada di `systems/mgbos/`. Dokumentasi JARVIS berada di `systems/jarvis/docs/`; belum ada runtime terverifikasi. Asisten Python berada di `tools/assistant/`, terpisah dari JARVIS. Admin lama sudah dihapus oleh owner; sisa storefront/shared/SQL ada di root archive. `scripts/setup/` menyimpan alat setup disk yang tidak dijalankan dalam cleanup. Jalankan `npm run check:repository` untuk memeriksa boundary direktori dan alias aktif.
