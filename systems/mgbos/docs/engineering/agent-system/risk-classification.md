# Risk classification

Choose the highest applicable class from the actual diff and affected contracts. Filename or change size alone is insufficient. Governance edits can alter permissions even without application code.

| Class | Examples                                                                              | Required evidence                                                                                                                                                                     |
| ----- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R0    | Wording, links, routing without permission changes                                    | Focused diff, skill/frontmatter/link validation, relevant scenario review                                                                                                             |
| R1    | Governance scripts/CI, instruction permissions, non-transactional behavior            | R0 plus positive/negative guard tests; application checks if app code changes; review of bypass and permission effects                                                                |
| R2    | Money, authorization, state transitions, AI tools, migrations or external integration | R1 plus canonical-source audit; application commands, denied roles, cross-org, integer boundaries, retries, atomicity and concurrency as relevant; applicable full app/database gates |
| R3    | Operational release, recovery or privileged environment changes                       | R2 as applicable plus exact target, authorization, staging, backup/restore, monitoring owner and recovery evidence                                                                    |

R2 does not require every unrelated test; justify omissions against the affected invariants. R3 classification does not authorize prohibited remote database work. The current control-plane implementation is R1: its CI and instructions affect future engineering decisions, while business behavior stays unchanged.

For schema work, test both upgrade from prior data and clean replay on an identified disposable local target. For behavior-only planning record the intended tests as not run. Any critical unknown affecting money, access, history or recovery blocks release of that flow until resolved.
