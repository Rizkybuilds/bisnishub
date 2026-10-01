# Permission matrix

Defaults below are process boundaries. Actual enforcement depends on the runtime's tool permissions, Git hosting and environment access. A skill, role, PR comment or generated plan is never new authorization. User scope may narrow these defaults.

Machine-readable engineering capability and role-permission encoding lives in
`.agents/capabilities/registry.yaml` and `.agents/capabilities/role-grants.yaml`.

This document remains the human semantic permission policy.
The machine registries apply it; they do not supersede it.

If the human policy and machine encoding conflict, treat the affected permission as unresolved and fail closed until the conflict is reconciled.

| Action                                                   | Planner              | Engineer                   | Auditor                | QA                         | Release Operator                            |
| -------------------------------------------------------- | -------------------- | -------------------------- | ---------------------- | -------------------------- | ------------------------------------------- |
| Inspect scoped repository and sanitized evidence         | Yes                  | Yes                        | Yes                    | Yes                        | Yes                                         |
| Write plan/review/release evidence                       | Plan                 | Implementation notes       | Review                 | Test evidence              | Release packet                              |
| Edit application or migration source                     | No                   | Authorized scope only      | No in review-only mode | Test artifacts only        | No                                          |
| Execute local non-destructive checks                     | Read-only inspection | Yes                        | Read-only inspection   | Yes                        | Read-only inspection                        |
| Disposable local MGBOS database reset                    | No                   | Reproducibility scope only | No                     | Reproducibility scope only | No                                          |
| Push a feature branch / create PR                        | No default           | Only when authorized       | No default             | No default                 | Only when authorized                        |
| Merge / deploy / publish / send external messages        | No default           | No default                 | No default             | No default                 | Specific authorization and applicable gates |
| Delete branches / close PRs                              | No default           | No default                 | No default             | No default                 | Explicit scope and safety evidence          |
| Push directly to main                                    | Prohibited           | Prohibited                 | Prohibited             | Prohibited                 | Prohibited                                  |
| Remote/production DB mutation or root Supabase for MGBOS | Prohibited           | Prohibited                 | Prohibited             | Prohibited                 | Prohibited                                  |
| Expose secrets or customer data in artifacts             | Prohibited           | Prohibited                 | Prohibited             | Prohibited                 | Prohibited                                  |

Local database commands must run within `systems/mgbos/` and verify target identity. Worktree isolation does not create an isolated database: check for a shared local stack before any destructive reproducibility run. Routine instruction maintenance never needs database reset.

Use existing authorization without requesting it again. Where an external action lacks authorization, finish the concrete, reviewable preparation first and ask only for that action. Missing tools, environment identity or required evidence remains a blocker regardless of approval. Reviewers cannot waive money, access, historical integrity or recovery gates.
