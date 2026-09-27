---
name: mgbos-change-planner
description: Plan a bounded MGBOS engineering change from canonical contracts, risks, dependencies and acceptance evidence. Use for change planning and task decomposition in mgbos/, not legacy feature implementation or general business strategy.
---

# MGBOS Change Planner

Read root and MGBOS AGENTS, the [Planner contract](../../roles/planner.md) and [risk classification](../../../mgbos/docs/engineering/agent-system/risk-classification.md). Inputs are the user's outcome, current branch/diff and applicable canonical sources; missing evidence is an explicit plan dependency.

1. Audit working-tree status and target paths. Resolve ambiguous MGBOS/legacy scope from files and request context before prescribing architecture. Official MGBOS is `mgbos/`, not root `apps/mgbos/` or root Supabase.
2. Inspect the relevant source index, ADR, domain state machine, server action/RPC, migration and tests. Separate current implementation from intended behavior. If canonical notes are unavailable or disagree, identify the exact gap and avoid inventing tables/statuses.
3. Define the smallest useful slice, allowed files, exclusions and acceptance criteria. Map affected money, organization/role permissions, immutable snapshots, retries, transactional audit/outbox and independent lifecycle contracts. Route the appropriate specialist for implementation.
4. Classify risk; list prerequisites, local/CI checks and recovery implications. A prior report does not satisfy a current gate. Missing prerequisite evidence can permit maintenance or remediation within scope, not expansion of the blocked business flow.
5. Deliver a reviewable plan with objective, source references, scope, risk, dependencies, verification matrix and Engineer handoff. Tests not executed are marked not-run. Planning does not authorize code changes, provider installation, deployment or remote database access.

Done when the Engineer can implement the slice without guessing its workspace, invariant owners or acceptance evidence. Keep routine plans concise; do not create parallel specs that duplicate canonical business rules.
