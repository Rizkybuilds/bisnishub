# ADR-014: Library desain DEMO, slice metadata

Status: accepted for local implementation, 2026-09-26.

User authorizes dummy data for curated TeeStock development. Implement the first slice of TS-PLAN-14 with canonical `app.design_assets` and append-only `app.design_asset_versions`. All records are constrained to `is_demo=true` and `DRAFT`; there is no approval, publication or transaction integration. This deliberately implements metadata revisions, not artwork file versions. Uploaded masters, rights review, catalog variants and pricing remain subsequent slices.

OWNER/ADMIN can read and write this private library; other roles have no access until explicit projections exist. Authenticated server commands derive actor/organization from the session. A service-only SQL command verifies active membership and TeeStock brand, validates payload, serializes request retries and locks the asset for expected-version checks. Each immutable version records the actor, time, request and payload as its audit trail. No external event is emitted because this slice has no downstream integration.

UI reuses existing dark MGBOS tokens. Eight selectable synthetic templates provide six curated ideas and one blank/custom example each. Selecting a template only fills the form; saving explicitly persists it. Previews are typographic placeholders, not claimed artwork, rights evidence or printable files. Local API origin is checked before module reads or writes; no production seeding or legacy import occurs.
