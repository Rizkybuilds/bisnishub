# Customer quotation projection

Date: 2026-09-25
Status: ACCEPTED for MGBOS-010

## Decision

Render HTML, PDF and copyable messages from one explicit customer-data projection, never from complete internal quote rows. Keep authenticated document routes outside the internal app shell. Resolve quote ownership before version access; do not expose a public share token in this slice.

Capture issuer identity on newly created quote versions, retaining the existing immutable snapshot model. Do not rewrite old versions that lack this information; require a revision before export. Use a pure Node PDF renderer with a browser-print fallback for unsupported font glyphs. Exports are read-only and do not change the quote lifecycle.

## Consequences

Internal financial fields cannot enter the renderer through automatic object spreading. Documents can be regenerated for a historical version while clearly displaying its current draft/archive/expiry status. Binary archive storage, signatures, logos and delivery automation remain future work. Unit tests verify the projection boundary and rendered test PDFs undergo visual QA.
