# Little Treat Kitchen OS (v1.0)

**Status:** standalone static PWA, operator-facing recipe handbook. Changes are isolated in \`apps/little-treat-kitchen\` and do not affect TeeStock, MGBOS or other apps.

## Features
- 30 base menus: 16 coffee recipes (12 / 14 / 16 / 22 oz), 9 banana recipes, 5 frozen dimsum recipes.
- 8 preparation recipes: two banana premixes, chocolate and palm caramel sauces, creamy mentai-style, coffee jelly, palm syrup, simple syrup.
- 5 SOP/checklist entries for opening, order handoff, closing, Han River calibration and safety.
- Search across menu names and ingredients, category filters, favorites on device, portion scaling, step checklists, copy and print.
- Optional install to home screen; offline fallback after the app is loaded once.

## Important limitations
- **No authentication, database or central staff changes:** do not store personal customer data, pricing secrets or supplier credentials.
- Recipes are structured transcriptions of Little Treat's 11-Nov-2026 coffee / banana / dimsum operator guides. They are **baseline procedures**, not guarantees of taste or safe cooking times.
- Coffee sugar level Less/More is labeled *simulasi*, not an authorized customer configuration. Confirm with owner and update after taste validation.
- Frozen dimsum supplier SKU and status (raw/precooked), actual Han River configuration, cook timing, and internal temperature must be checked before sales. For raw poultry/unknown status require at least 74°C at slowest-cooking position, following supplier instructions.
- The 14-day banana premix window is an internal dry-storage limit, not a guaranteed expiry date. Wet batter must be prepared at order time.
- House sauces are same-day, refrigerated, with leftovers discarded at end of shift, per initial Little Treat policy.
- Allergen declarations must come from the labels actually used.

## Run locally
Serve this folder with a static HTTP server, e.g.:
\`\`\`sh
python -m http.server 8080
\`\`\`
Open http://localhost:8080 and select a recipe.

## Deployment
Use Vercel static project with project root \`apps/little-treat-kitchen\` or GitHub Pages from the folder's contents.
No Supabase credentials or environment variables required.

## Future (only when needed)
Authenticated staff access, editable recipes with approval/version history, multi-device inventory counts and order integration. Those needs justify Supabase with RLS; not needed for a read-only recipe handbook.

## Source guides
- \`Little_Treat_Panduan_Kopi_16_Menu_4_Ukuran_v2.docx\`
- \`Little_Treat_Panduan_Operasional_Menu_Pisang_v1.docx\`
- \`Little_Treat_Panduan_Dimsum_Frozen_Han_River_v1.docx\`

Keep these manual references synchronized with updates to \`recipes.js\` during recipe changes.
