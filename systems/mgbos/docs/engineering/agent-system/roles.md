# Roles

The [machine-readable catalog](../../../../../.agents/roles/contracts.json) is a project-owned schema validated by repository tooling. It specifies intent and default capabilities, not executable permission grants.

| Role             | Input                                   | Required output                                      | Contract                                                             |
| ---------------- | --------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------- |
| Planner          | Goal, sources, current evidence         | Scope, risk, acceptance and test matrix              | [Planner](../../../../../.agents/roles/planner.md)                   |
| Engineer         | Authorized slice and base revision      | Scoped diff, rationale, checks and limitations       | [Engineer](../../../../../.agents/roles/engineer.md)                 |
| Auditor          | Requirement, base/head and raw evidence | Findings with triggers/impact, coverage and blockers | [Auditor](../../../../../.agents/roles/auditor.md)                   |
| QA               | Revision, risk and acceptance           | Reproducible results and unverified gates            | [QA](../../../../../.agents/roles/qa.md)                             |
| Release Operator | Reviewed candidate and target           | Go/no-go packet and recovery plan                    | [Release Operator](../../../../../.agents/roles/release-operator.md) |

One runtime may take multiple roles sequentially. Switching labels is not independent review and cannot enlarge user authorization. Use [permissions](permission-matrix.md) and [evidence](evidence-model.md) for every role. Roles complement specialist skills; they do not replace canonical business contracts.
