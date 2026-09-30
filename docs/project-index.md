# Indeks proyek BisnisHub

Lokasi diperiksa 30 September 2026. Indeks ini adalah locator, bukan sertifikasi produksi.

| Sistem / sumber | Lokasi | Batas dan status |
| --- | --- | --- |
| MGBOS | [systems/mgbos](../systems/mgbos/README.md) | Next.js, pnpm workspace dan Supabase lokal sendiri; fokus aktif pada [Phase 1 Operating Spine](../systems/mgbos/docs/implementation/phase-1-operating-spine/README.md) |
| JARVIS | [charter dan spesifikasi](../systems/jarvis/docs/charter.md) | Arsitektur tertulis; runtime pre-launch diselaraskan ke JARVIS Lite (read-only copilot) |
| KasKita | `systems/kaskita/apps/mobile/`, `systems/kaskita/supabase/` | Expo/npm dan database independen |
| Asisten Python | [tools/assistant](../tools/assistant/README.md) | CLI existing; persona/memory milik tool, ekspor ke catatan root |
| TeeStock V1 / shared | [archive/teestock-v1](../archive/teestock-v1/README.md) | Retired; admin dihapus pada `05e8b18`; tanpa alias runtime |
| Prototype MGBOS Vite | `archive/mgbos-vite-prototype/` | Retired; referensi saja |

## Navigasi dan authority

- Aturan repository: [directory ownership](engineering/repository-layout.md) dan [ADR-001](decisions/001-repository-organization.md).
- Authority dokumen: [constitution](governance/documentation-constitution.md) dan [canonical source map](governance/canonical-source-map.md).
- Operating model: [Solo-Founder Operating System](operating-model/solo-founder-operating-system.md) (prinsip *founder-by-exception* dan alokasi beban).
- Roadmap peluncuran: [Solo-Founder Launch Roadmap](roadmaps/solo-founder-launch-roadmap.md) (sekuens eksekusi paralel September → akhir November 2026).
- MGBOS: baca AGENTS workspace dan spesifikasi milik sistem sebelum implementasi.
- JARVIS: baca charter dan kontrak yang relevan; jangan menganggap dokumen ACTIVE sebagai bukti runtime tersedia.
- Business knowledge: `bisnis/multigraph/`, `bisnis/teestock/`, `bisnis/rizkybuild/`; Titik Buta dan KasKita tetap independen.
- `catatan/sesi/` mempertahankan sejarah. Sumber transitional tetap mengikuti source map; cleanup tidak otomatis mempromosikan atau menghapus spesifikasi.

Peta lokasi tidak mengizinkan deployment, aktivasi ulang archive, atau mutasi database.
