# KasKita directory migration — 29 September 2026

Base: `510987d`. Branch: `codex/kaskita-system-migration`. This stage moves the independent KasKita runtime, not MGBOS or TeeStock. Business documents remain under `bisnis/kaskita/`.

## Changes and preservation

- `bisnis/kaskita/mobile/` → `systems/kaskita/apps/mobile/`.
- `bisnis/kaskita/supabase/` → `systems/kaskita/supabase/`.
- All 36 tracked source/config/asset/SQL files were verified unchanged before/after the move. The original raw SHA-256 manifest also verified the local Supabase metadata file. Dependency and Expo cache directories moved with the app; no local metadata was published.
- Package name, lockfile, dependency versions, app identity, entrypoint, asset paths and Supabase project configuration are unchanged. SQL was not applied or reset.
- Root navigation, business README, project index and agent routing now identify the new location. Historical source paths in the migration plan/ADR remain historical.
- A dedicated `KasKita / kaskita-android` workflow runs clean npm install, TypeScript and Android export on affected PRs and main pushes. Existing required checks remain enabled.

## Evidence and limitations

Before the move, TypeScript passed and Android export completed (602 modules, 1.5 MB Hermes bundle). After the move, clean-install, typecheck and Android export results are recorded on the PR, together with current governance and hosted CI evidence.

No Android device/emulator or `adb` is available in this environment. Device interaction smoke is **not verified**. iOS and web export are not claimed. Successful export proves build/module resolution, not user flows, production database access or release readiness. No credentials, remote database changes or deployment are part of this stage.

Governance structural validation retains the existing `argument-hint` compatibility warnings; it does not constitute an independent behavioral agent evaluation.

## Recovery and remaining work

Rollback both directories together with the workflow/navigation changes on a dedicated branch, preserving local environment/cache/metadata and checking running processes first. Do not reset databases to roll back directory paths.

MGBOS remains at `mgbos/`; its migration requires preparation of the migration-history guard and separate acceptance checks. KasKita device smoke remains an operational acceptance item before a mobile release.
