# Browser QA Evidence — MGBOS UXR-01 (PR #53)

- **Target PR:** [#53](https://github.com/Rizkybuilds/bisnishub/pull/53)
- **Candidate Head SHA:** `9a76750b3213236a3bd4cf09579e2c763ea0c747`
- **Base SHA:** `a8a0e5342165cd65fa2549284728b6e9f131405c`
- **QA Acceptance Gate:** [Issue #55](https://github.com/Rizkybuilds/bisnishub/issues/55)
- **Environment:** Local test environment (Node 22.23.2, Next.js 16.3.6 production build, local Supabase test instance :55431, Chrome headless CDP)
- **Synthetic Test Identities:**
  - `founder@multigraph.id` (`OWNER`, MultiGraph Group holding, brand TS)
  - `sales.qa@multigraph.id` (`SALES`, MultiGraph Group holding, brand TS)
  - `qc.qa@multigraph.id` (`QC`, MultiGraph Group holding, brand TS)

---

## Screenshot Artifacts

1. **`01_owner_login_initial.png`**: Login page before authentication.
2. **`02_owner_dashboard_1440.png`**: Authenticated OWNER dashboard at 1440x900 (14 shortcuts, TS brand context, 0 overflow).
3. **`03_owner_dashboard_1024.png`**: Authenticated OWNER dashboard at 1024x768 (responsive 2-col/3-col layout, 0 overflow).
4. **`04_owner_leads_1440.png`**: Route `/leads` with active link highlighted in sidebar.
5. **`05_owner_orders_1440.png`**: Route `/orders` with active link highlighted in sidebar.
6. **`06_owner_exceptions_1440.png`**: Route `/exceptions` with active link highlighted in sidebar.
7. **`07_owner_brand_switch_mg.png`**: Brand switched to `MG` (Library Desain omitted from sidebar).
8. **`08_owner_keyboard_focus.png`**: Keyboard Tab navigation showing visible focus ring.
9. **`09_after_owner_logout.png`**: Real form logout redirecting cleanly to `/login`.
10. **`10_sales_dashboard_1440.png`**: Authenticated SALES dashboard (Exceptions shortcut omitted).
11. **`11_sales_direct_exceptions_denial.png`**: Direct route to `/exceptions` by SALES resulting in server denial.
12. **`12_qc_dashboard_1440.png`**: Authenticated QC dashboard (Quotes shortcut omitted).
13. **`13_qc_direct_quotes_denial.png`**: Direct route to `/quotes` by QC resulting in server denial.

---

## Detailed Execution Trace

See [`comprehensive_browser_qa_report.json`](./comprehensive_browser_qa_report.json) for timestamped execution logs.
