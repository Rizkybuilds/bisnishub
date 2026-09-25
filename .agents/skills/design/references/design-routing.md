# Project design routing

Select by the requested output. Read the selected Skill before applying it; supporting specialists are optional and should answer a concrete gap.

| Request | Primary workflow | Optional support |
| --- | --- | --- |
| Compare visual directions | `21st-ui-explore` | `brand`, focused `ui-ux-pro-max` search |
| Implement a page or substantial component | `21st-ui-build` | `ui-styling`, `design-system` |
| Review UI or accessibility | `21st-ui-review` | Focused `ui-ux-pro-max` guidance |
| Fix a narrow CSS/layout issue | `ui-styling` | Existing tokens; no new design system |
| Define token roles or component states | `design-system` | `brand` if identity is undecided |
| Brand voice or identity | `brand` | `creative-director` for campaign direction |
| Banner or social asset | `banner-design` | `brand`, available `imagegen` for raster visuals |
| Logo or corporate identity mockup | `design` with relevant reference | Available `imagegen`; brand sources |
| HTML slide deck | `slides` | `design-system` for token alignment |
| PowerPoint or Google Slides | Available Presentations Skill | Brand/token sources |
| Reuse or find catalog code | `21st-cli-use` | Target application's component library |
| Hosted UI generation | `21st-ai` after access check | Existing design context |
| Publish theme or component | `21st-design-sync` or `21st-registry` | Only when publication is requested |

Logo, CIP and icon guides in this folder are references, not separately installed Skills. Do not call unavailable names such as `project-management`, `frontend-design` or `chrome-devtools` merely because an old template mentions them. Use exposed tools appropriate to the requested artifact.

Project sources govern brand, framework and token choices. Generated search guidance is a candidate recommendation, not a new source of truth. Do not create a competing master design file for a page in an established application.

Resolve helper paths relative to the selected Skill directory. Verify command options and destination before any generator or installer writes files. Do not assume a `.claude` directory exists.

End an exploration-only request with comparable previews. Continue implementation directly when the direction is already selected or the user authorized best judgment. Review-only tasks report findings; fix requests allow scoped fixes. None of these imply publishing, deployment or synchronization to personal Skill installations.
