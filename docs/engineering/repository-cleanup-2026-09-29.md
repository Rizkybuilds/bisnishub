# Directory cleanup evidence — 29 September 2026

Scope: finish the physical repository boundaries for MGBOS and JARVIS work.
Continuation baseline: `05e8b185cbff3424b5973e3a7de03483504cb113`, branch
`codex/mgbos-directory-relocation`. Risk R1: root routing and repository checks.
This is self-review, not independent agent evaluation.

## Current layout

- Official MGBOS: `systems/mgbos/`; toolchain, app identities and SQL unchanged.
- JARVIS specifications: `systems/jarvis/docs/`; preserved owner documentation,
  not a claim of implemented runtime.
- Independent KasKita: `systems/kaskita/`; the remaining unconsumed shared type
  file moved from business knowledge to `systems/kaskita/shared/types.ts`.
- Python CLI: `tools/assistant/`; prompts and memory move together. Root `.env`
  resolution is explicit; session export still targets root `catatan/sesi/`.
- Retired storefront/shared/SQL/tests: `archive/teestock-v1/`. Owner had already
  removed the admin in baseline commit `05e8b18`; cleanup does not restore it.
- Historical business documents and HTML planning/catalog tools stay in
  `bisnis/teestock/archive/`. Session notes remain in `catatan/`.
- Disk setup utility: `scripts/setup/`; historical seed/shared verifier archived.
  None of these utilities was executed against external storage or databases.

Root runtime/install aliases for legacy apps are removed. Vercel remains
fail-closed through the retirement script; no hosting target is silently activated.
The obsolete local Supabase junction was removed as a link only, without
traversing or deleting its target. It was ignored by Git and is not recreated
by cloning or reverting tracked files.

## Evidence

- 171 relocated tracked files retain exact Git blobs and modes, including SQL,
  assets, lockfiles, persona/profile/history files and the KasKita type file.
  Two previously tracked `.21st` reference files were explicitly retained even
  though their new location matches an ignore rule.
- All 23 MGBOS migrations match baseline in both index and working tree.
- Repository boundary check passes. Four regression tests cover accepted layout,
  old roots/business runtime, archive aliases and missing/wrong workspace routing.
- Governance structural validation passes; all 17 Python governance/layout tests
  pass. Three existing `argument-hint` compatibility warnings remain.
- Assistant offline regression passes from repository and tool working directories:
  persona/profile reads, memory save, root session export, environment location,
  and CLI import. Provider is stubbed; no API calls or real session writes.
- Local production HTTP smoke passes for both MGBOS applications, Custom Atelier,
  health endpoints and missing routes. Earlier relocation application check passed
  with 230 tests and both production builds; new owner architecture prose was
  subsequently added and is not certified by that earlier format check.
- Local pgTAP invocation could not connect to port 55432 because the local stack
  was unavailable. No reset was run. Disposable hosted database replay remains
  required for the final integration revision.

## Preservation and integration boundary

Owner architecture edits already committed at baseline and untracked JARVIS
documents are outside this cleanup's staged scope. Six initial untracked files
were checksum-verified unchanged at initial staging; owner subsequently edited
some of those files and added another document. All remain outside the staged
cleanup, with their latest working content preserved. No business/session source was deleted.

The prepared repository-integrity workflow does not itself prove hosted CI ran
or make its check required in GitHub. PR #12 guard preparation was merged after
its hosted checks passed; the later directory/documentation branch is a separate
integration. Do not label this cleanup deployed or merged into main without
checking the actual revision and CI.

Semantic document promotion and the optional internal `apps/mgbos` → `backoffice`
rename are separate reviewed changes. Existing owner specifications must be
audited for authority and references before implementing the larger architecture.

## Recovery

Revert the focused cleanup commit together with its routing changes, preserving
newer owner edits. Restore tracked content through Git; move ignored local
metadata separately after checking exact absolute paths. Do not reactivate
legacy aliases, run archived SQL or reset databases as a directory rollback.
