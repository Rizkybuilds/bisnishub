---
canonical_id: agents.engineering.capability-permission-registry
status: ACTIVE
version: 1.0
owner: Rizky
scope: repository-engineering
document_class: registry-guide
effective_from: 2026-10-01

authoritative_for:
  - engineering capability identity
  - engineering capability namespace
  - engineering capability machine metadata
  - engineering role permission machine encoding
  - engineering capability compatibility aliases

depends_on:
  - ../../docs/engineering/engineering-ai-control-plane.md
  - ../../docs/governance/cross-system-risk-classification.md
  - ../../docs/governance/autonomy-levels.md
  - ../../docs/governance/approval-policy.md
  - ../roles/contracts.json
  - ../../systems/mgbos/docs/engineering/agent-system/permission-matrix.md

machine_registries:
  - registry.yaml
  - role-grants.yaml

implementation_status: ACTIVE_MACHINE_ENFORCED
---

# Engineering Capability & Permission Registry v1

## Purpose

This registry makes engineering authority machine-readable without turning tool availability into permission.

Canonical evaluation order is:

```text
IDENTITY
  ↓
ACTIVE ROLE
  ↓
CAPABILITY
  ↓
ROLE PERMISSION
  ↓
SCOPE
  ↓
ENVIRONMENT
  ↓
RISK
  ↓
AUTONOMY
  ↓
APPROVAL
  ↓
TOOL AVAILABILITY
  ↓
EXECUTION
  ↓
VERIFICATION
  ↓
EVIDENCE
```

No lower layer may bypass a higher one.

## Engineering Capability

Engineering Capability describes a governed engineering operation.

Examples:

```text
engineering.repository.read

engineering.source.write.scoped

engineering.github.feature_branch.push

engineering.release.deploy
```

It describes the logical operation.

It does not describe which CLI, MCP server, GitHub integration, or provider performs it.

## Engineering Capability vs JARVIS Capability

Engineering capabilities belong to the Engineering Control Plane.

JARVIS capabilities belong to JARVIS runtime architecture.

Example:

```text
engineering.repository.read
```

means engineering inspection of repository material.

It is not the same authority domain as:

```text
github.repository.read
```

inside future JARVIS runtime capability architecture.

Likewise:

```text
engineering.database.local.reset_disposable
```

does not grant:

```text
mgbos.payment.record
```

or any other business capability.

Engineering authority never becomes business authority automatically.

## Capability vs Tool

A runtime may possess:

```text
shell
GitHub MCP
browser
database CLI
deployment CLI
```

while still lacking permission for a corresponding consequential action.

Canonical:

```text
TOOL AVAILABLE
≠
CAPABILITY GRANTED
```

## Capability vs Role

Role answers:

> Which responsibility mode is active?

Capability answers:

> Which logical engineering operation is being attempted?

Permission answers:

> May this role exercise that capability in this context?

These remain distinct.

## Capability vs Autonomy

Capability registration does not create an autonomy grant.

An entry containing:

```text
autonomy_ceiling: L3
```

means repository policy does not normally permit that capability above L3.

It does not mean any runtime currently has L3.

Actual autonomy still follows the canonical tuple:

```text
PRINCIPAL
+
CAPABILITY
+
RESOURCE SCOPE
+
ENVIRONMENT
+
POLICY
```

## Capability vs Approval

Permission may allow a role to request or perform a capability while approval policy still requires action-specific authorization.

Example:

```text
Release Operator
+
engineering.github.pull_request.merge
```

may be conditionally eligible.

Actual merge still requires applicable release gates and explicit action authority.

## Approval Trust Boundary

The capability registry is machine enforced, role permission is machine evaluated, and autonomy grants are machine evaluated.

However, self-asserted approval JSON is NOT trusted authorization evidence. An approval claim object documents structure and binds to an action fingerprint, but does not independently prove authentic authorization.

Approval-required execution remains fail-closed (`NEED_APPROVAL` / `APPROVAL_EVIDENCE_UNVERIFIED`) until trusted evidence verification exists. No self-asserted approval can produce an `ALLOW` decision.

## Permission States

Machine role grants use:

```text
GRANTED

CONDITIONAL

DENIED

PROHIBITED
```

`GRANTED` means the role policy allows the operation when all normal scope, environment, risk, and contract constraints are satisfied.

It does not bypass tool permissions or autonomy policy.

`CONDITIONAL` means additional explicit conditions must be satisfied before execution.

Typical conditions include:

```text
explicit action authorization

accepted Work Package

verified target identity

release gates

recovery evidence
```

`DENIED` means the capability does not belong to the currently active role.

The work may require another role or another authority path.

`PROHIBITED` means the Engineering Control Plane must not execute the capability regardless of role label.

## Default Deny

Unregistered role-capability combinations are:

```text
DENIED
```

Engineering authority is never inferred from:

```text
model intelligence

Skill name

tool availability

provider

prompt wording

repository access
```

## Risk

Every capability has a baseline risk.

Effective risk remains:

```text
max(
  capability baseline,
  task risk,
  concern risk,
  affected business capability risk,
  environment risk,
  data sensitivity,
  blast radius,
  reversibility,
  policy escalation
)
```

Capability baseline is therefore a floor, not necessarily the final classification.

Example:

```text
engineering.source.write.scoped
baseline R2
```

but changing authoritative payment implementation may still require:

```text
effective R5
```

because the affected capability and consequence are R5.

## Environment

Supported environment describes where a capability may logically apply.

It does not prove the runtime is connected to that environment.

If environment identity is unclear for consequential action:

```text
ENVIRONMENT_UNVERIFIED
```

applies.

## Scope

Capabilities that write source remain constrained by Work Package scope.

`engineering.source.write.scoped` never means:

```text
write anywhere in repository
```

It means:

```text
write only accepted mutable paths
inside the active Work Package.
```

## Repository Read

`engineering.repository.read` covers scoped repository and sanitized engineering evidence inspection.

It does not authorize:

```text
secret extraction

customer-data disclosure

cross-system sensitive export
```

## Local Checks

`engineering.check.local.execute` covers non-destructive local engineering checks.

It does not authorize arbitrary consequential shell execution.

The command must remain relevant to the accepted engineering scope.

## Disposable Local Database

`engineering.database.local.reset_disposable` is deliberately narrow.

It requires:

```text
MGBOS local environment

verified target identity

reproducibility/QA purpose

no unrelated shared local workload collision
```

A worktree is not proof of an isolated database.

## Remote Repository Mutation

Operations such as:

```text
feature branch push

pull request creation

pull request closure

branch deletion

merge
```

mutate Git hosting state.

They therefore remain distinct from local source preparation.

## Release

Release Operator owns preparation and assessment.

Actual merge/deploy remains independently authorized.

Canonical:

```text
READY_FOR_AUTHORIZED_RELEASE
≠
AUTHORIZED_TO_RELEASE
```

## Hard Prohibitions

Current MGBOS Engineering Control Plane explicitly prohibits:

```text
direct push to main

remote/production MGBOS database mutation

using root Supabase authority for MGBOS

exposing secrets

exposing customer data in engineering artifacts
```

These appear as explicit prohibited capabilities so a future runtime cannot interpret their absence as permission ambiguity.

## External Business Actions

This registry intentionally does not create generic engineering capabilities such as:

```text
engineering.customer_message.send
```

Business/external actions belong to their owning business/runtime capability domains.

If engineering work needs to trigger a real customer, vendor, finance, content, or other business action, it requires that separate authority domain.

## Publish

The current human permission matrix groups terms such as `publish` with other consequential external actions.

V1 does not invent a generic `engineering.publish` capability because the semantic target is ambiguous.

A concrete capability should be added only when the real consumer and authority boundary are known.

## Legacy Role Capability Aliases

Current `.agents/roles/contracts.json` predates this registry and contains labels such as:

```text
read-repository
write-plan
write-scoped-files
run-local-checks
write-review
write-test-artifacts
write-release-plan
```

`registry.yaml` maps those labels to canonical engineering capability IDs.

They remain compatibility aliases until CP-005B migrates the role catalog and validators atomically.

Aliases MUST NOT create additional permission.

## Machine Permission Source

`role-grants.yaml` is the machine representation of the existing MGBOS engineering permission matrix.

The human policy source remains:

```text
systems/mgbos/docs/engineering/agent-system/permission-matrix.md
```

If the two disagree before machine enforcement catches it:

```text
PERMISSION_CONFLICT
```

and the more permissive interpretation must not be used.

## Host Permissions

A runtime host may impose stricter controls than this registry.

Example:

```text
registry says CONDITIONAL

GitHub token is read-only
```

Effective result:

```text
DENIED BY HOST
```

The registry never escalates host access.

## Runtime Permission

Runtime adapters should eventually resolve permission before exposing consequential tools where possible.

Preferred:

```text
ROLE
→ CAPABILITY
→ PERMISSION
→ bounded tool surface
```

rather than:

```text
give every tool
→ hope model remembers restrictions
```

## Promotion Evidence

CP-004C promotion packages may reference these canonical engineering capability IDs.

However capability registration still does not make an autonomy grant.

Qualification may only produce:

```text
ELIGIBLE_FOR_OWNER_REVIEW

NOT_ELIGIBLE

BLOCKED

STALE
```

Actual autonomy change remains an authoritative governance decision.

## Final Principle

> **Capability says what can logically be attempted. Permission says who may attempt it. Autonomy says how independently it may happen. Approval says whether this instance may proceed. Tooling only determines whether execution is technically possible.**