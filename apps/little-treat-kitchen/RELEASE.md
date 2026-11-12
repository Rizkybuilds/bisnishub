# P0 Release Runbook — Little Treat Kitchen OS

The GitHub Pages site **at the repository root** is the operator app:
https://rizkybuilds.github.io/bisnishub/

Source of truth: `main:apps/little-treat-kitchen/`. Production:
`gh-pages:/`. No Vercel deployment is required.

## Exact GitHub Pages allowlist

Only these static files may be copied to the `gh-pages` root:

- `index.html`
- `ops.html`
- `ops.js`
- `ops.css`
- `ops-visual.css`
- `ops-config.js`
- `recipes.js`
- `menu-costing.js`
- `icon.svg`
- `.nojekyll` (empty file on publishing branch)

No test scripts, `legacy.html`, old `finance.js`, SQL, user-entered financial data,
`service_role` or secret keys are part of this public bundle.

## Before publishing

1. Confirm the canonical app source is on `main`. Run the nine Node test
   files listed in README; all must pass on Node 22.
2. Verify Supabase `lt_members` membership and RLS remains enabled,
   dedicated project `little-treat-kitchen` is healthy, and the public key
   stays an `sb_publishable_` key. Never ship Supabase service credentials.
3. Copy the **exact allowlist** from the tested `main` tree to `gh-pages`
   root. Review and commit the diff. Avoid unrelated repo changes.
4. After Pages rebuild, verify HTTP 200 for the root, `ops.js`,
   `menu-costing.js`, `recipes.js`, `ops-config.js` and both CSS files.
   Confirm HTML content references exist; compare published SHA/blob content
   to the tested source. No hidden demo or `localStorage` finance fallback.
5. Test owner login/logout and reload, denied unauthorized login,
   recovery from expired token, staff role restrictions, mobile navigation,
   read-only recipe search and HPP missing-data states on real Android.
6. For real write flows, use a dedicated test setup or transactional rollback.
   Test duplicate-submit and lost-response handling; never create fake
   purchases, orders or payouts in the owner's production records.

## Safety and rollback

- `gh-pages` is a deliberately small static release, not a source branch.
  Do not merge the entire BisnisHub repository into it.
- Record the prior `gh-pages` commit before any release. Roll back by
  restoring its previous tested file tree (no force pushes necessary).
- The backend schema is managed separately. Releasing frontend **does not**
  approve changing RLS, prices, live inventory, payments or commercial
  readiness. Keeping products inactive is intentional.
- On a browser showing stale assets, hard-refresh after publication.
- GitHub Pages origin is public; only auth-protected database responses are private.

## Operational gates (unverified until observed)

- Two-device owner + staff browser E2E.
- Supplier material receipts and valid actual HPP.
- Physical recipe/batch/food safety validation and packaging QA.
- End-to-end order, handoff, stock decrement, payout reconciliation and closing.
