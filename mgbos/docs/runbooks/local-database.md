# Local Supabase runbook

Run from mgbos/, with Node/pnpm versions from README and a running Docker-compatible runtime.
The CLI is pinned as a project dev dependency. No global Supabase CLI is required.

1. pnpm install --frozen-lockfile
2. pnpm db:start
3. pnpm db:reset (destroys only local MGBOS development data)
4. pnpm db:test
5. pnpm db:types
6. pnpm db:stop when finished (preserves local data)

Project ID: mgbos-foundation. API 55431, database 55432, shadow database 55430, Studio 55433.
Auth signup is disabled. No application auth flow exists yet. Storage has no business buckets.
app/internal schemas are not exposed through the API. No business tables or permissions are added.
Only default Supabase services plus the infrastructure schema migration are expected.

Create new timestamped SQL migrations here; do not copy legacy migrations or edit applied SQL.
Review SQL, reset the local database, run tests, then regenerate types.
Generated types are derived from a real database and must never be fabricated.
Before MGBOS-002, certify all of these checks on this host or in CI.
If Docker is missing, report the database gate as blocked rather than silently skipping it.

Reference: [Supabase local development](https://supabase.com/docs/guides/local-development).
