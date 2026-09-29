---
name: web-sec-perf
description: Audit or improve web security and measured performance in the selected BisnisHub application. Use Next.js command, session and caching boundaries for MGBOS; preserve clearly scoped Vite and React legacy guidance.
argument-hint: "[security, performance, lcp, seo, owasp, or audit]"
---

# Web Security and Performance

Audit or improve the explicitly targeted application. Read root AGENTS and inspect its framework/configuration first. Review-only requests produce findings; apply fixes when requested and keep them within scope.

## MGBOS: Next.js

Read `systems/mgbos/AGENTS.md`, the relevant app package/configuration, server actions, auth/validation packages and schema policies. Check the actual implementation rather than assuming framework defaults prove safety.

- Audit server commands for authentication, server-derived organization/actor, authorization, validation and state guards. Check direct RPC/RLS/grants and privileged function boundaries too; UI visibility is not access control. Route transaction semantics to `mgbos-business-integrity-auditor`.
- Keep credentials server-only, using the existing config boundaries. Never place service-role, payment server or AI keys in `NEXT_PUBLIC_*`, browser bundles, logs or generated artifacts. Public Supabase configuration still requires correct RLS and permissions.
- Check session/cookie handling, CSRF/origin protection for the actual mutation surface, redirects, uploads, XSS and tenant-specific caching. Do not cache private ERP data as a public response. Validate both authorized and denied paths.
- Derive CSP and security headers from actual Next.js rendering, scripts, assets and approved integrations. Do not copy a universal `unsafe-inline` policy or disable camera uploads/checkout features accidentally. Test required flows with the proposed headers; generic headers are not evidence of security.
- Use App Router/server components and route-level loading boundaries already in the app. Measure before adding client components or dynamic imports. Do not introduce React Router into MGBOS. Verify current installed Next.js image/font APIs before edits.
- Measure a repeatable production build with device/network context. Inspect LCP asset loading, CLS sizing and INP work; compare before/after observations. Preserve image quality and accessibility; avoid blanket conversion or invented percentage savings. Treat lab results and field data as different evidence.
- SEO metadata, sitemap and indexing apply to public storefront pages. Internal authenticated ERP pages must not be exposed/indexed merely to improve SEO scores.

## Legacy: Vite/React

Only for an explicitly selected legacy target, consult [legacy examples](references/legacy-examples.md) after reading its router, env and hosting files. The previous `VITE_*`, React Router and hosting snippets are context, not MGBOS implementation guidance. The historical CSP is not a secure default; rederive and test it. Secret keys must never use either `VITE_*` or `NEXT_PUBLIC_*` prefixes.

## Completion

Findings include path, trigger, impact and evidence; changes include focused regression checks and measured performance results where relevant. Follow applicable workspace checks and report missing evidence. No production scan, deployment, global config change or remote database mutation is implied by an audit request.
