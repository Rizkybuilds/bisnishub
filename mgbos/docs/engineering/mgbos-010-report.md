# MGBOS-010 — Version-specific customer quotations

Implemented locally on 2026-09-25. No production deployment or external messaging.

## Delivered

Each quote version links to a dedicated authenticated document page at `/quotes/{quoteId}/versions/{versionId}`. The page offers direct PDF download, browser print/save-as-PDF and a copyable message summary. Documents include issuer identity, quote number/version/date, customer snapshot, line quantity/unit/price, supported customer specifications, discount, shipping, total, lead time, payment terms, validity and customer notes.

Rendering uses an explicit customer-facing allowlist. Internal HPP, profit, margin, owner approval reasons, vendor preferences and internal artwork references are not copied into the document. Quote notes are now explicitly labelled customer-facing in the entry form. Unknown specification schemas are omitted rather than dumping arbitrary JSON; the line description remains visible.

Drafts are labelled DRAF, superseded/noncurrent versions ARSIP and expired unaccepted offers KEDALUWARSA. Export does not mark a quote sent, accept it or send a message. An already accepted current version is not labelled expired solely because its offer deadline passed.

## Storage and architecture

`20260925100000_quote_issuer_snapshot.sql` captures brand and organization display names when new quote versions are inserted. The existing immutable-version guard protects these fields. Historical rows are not backfilled: pre-feature versions with no issuer snapshot must be revised before export. The migration was applied locally without a reset, recorded in migration history and database types regenerated.

Customer projection and renderers live in `apps/mgbos/src/lib/quotation/`; document routes are isolated from the internal application shell. Organization ownership and quote-read permission are checked before fetching the requested version. The PDF route uses private/no-store response headers. Documents are generated on demand, not uploaded or exposed through public share links.

`pdf-lib` supplies the Node PDF renderer. Its standard Helvetica font supports common Indonesian/Latin text; unsupported characters produce a clear error and can instead be printed using the browser. PDF layout wraps long text, repeats identity/version headers and numbers pages. Dates use the Jakarta business timezone. No bank account, tax calculation, legal entity number, customer acceptance or signature is invented.

## Verification

- Database: 148 assertions across 11 files passed, including issuer capture, preservation after brand rename and rejection of issuer edits.
- Projection/PDF tests cover private-field exclusion, snapshot values, draft/archive/expiry labels, accepted status, business dates, missing issuers, unknown specification schemas, multipage rendering and unsupported glyphs.
- Generated one-page and three-page synthetic fixtures; extracted text contains expected totals and no internal sentinel data. All four rendered pages inspected with no clipping/overlap. Fixtures are test artifacts under ignored `tmp/pdfs/`, not real customer quotations.
- `pnpm check`: formatting, lint, strict type checks, 111 tests across 20 files and both production builds passed.
- Production HTTP smoke on temporary ports 3111/3112: both app pages, Custom Atelier shell, health and 404 checks passed. Document guest redirects, PDF 401/404 with private/no-store headers, authenticated quote listing and issuer-column queries passed. No business data was created.
- 21st static review reported eight informational hardcoded-color notes on the dedicated print palette; white paper and dark text intentionally differ from the dark internal application shell. No automatic style changes applied.

## Boundaries

Existing MGBOS-009 limits remain: one requirement line, manual costs, no automatic tax or acceptance/order flow. PDF files are generated on demand, not digitally signed or stored as immutable binary archives; lifecycle notices reflect current status at export. Branding uses text identity, without invented logos or contact details. No full successful browser business-data creation and download journey or mobile print-dialog certification is claimed. The next slice is MGBOS-011 order contract snapshots.
