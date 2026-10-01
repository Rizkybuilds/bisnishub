---
canonical_id: agents.engineering.principal-autonomy-model
status: ACTIVE
version: 1.0
owner: Rizky
scope: repository-engineering
document_class: registry-guide
effective_from: 2026-10-01

authoritative_for:
  - engineering principal identity
  - engineering runtime identity binding
  - engineering autonomy grant machine encoding
  - engineering autonomy grant lifecycle
  - engineering principal capability ceilings

depends_on:
  - ../../docs/governance/autonomy-levels.md
  - ../../docs/governance/approval-policy.md
  - ../../docs/governance/cross-system-risk-classification.md
  - ../../docs/engineering/engineering-ai-control-plane.md
  - ../capabilities/README.md
  - ../capabilities/registry.yaml
  - ../capabilities/role-grants.yaml

machine_registries:
  - registry.yaml
  - ../autonomy/grants.yaml

implementation_status: ACTIVE_ON_MERGE
---

# Engineering Principal & Autonomy Grant Model v1

## Purpose

This model gives the Engineering Control Plane a stable machine identity for executors and a capability-specific autonomy grant registry.

It implements the canonical autonomy tuple:

```text id="nphq84"
PRINCIPAL
+
CAPABILITY
+
RESOURCE SCOPE
+
ENVIRONMENT
+
POLICY
=
AUTONOMY GRANT
```

without turning model/provider identity into authority.

## Principal

Principal answers:

> Which governed engineering executor is attempting this action?

Principal is not:

```text id="wxexfc"
model name
provider name
role
Skill
tool
conversation
```

Initial engineering principals are semantic runtime identities.

## Provider Independence

Canonical principal:

```text id="g3a96l"
engineering.runtime.primary
```

may currently be implemented using Codex.

If the implementation later changes:

```text id="hy028a"
Codex
→ another runtime
```

the principal may remain stable if its authority semantics and administrative identity remain the same.

Provider migration alone should not require rewriting governance identity.

## Role Is Not Principal

One engineering principal may execute different roles over time:

```text id="j6d4uy"
Planner
Engineer
Auditor
QA
Release Operator
```

subject to role policy.

Switching roles does not create a new principal.

## Principal Does Not Prove Independence

Two role labels do not create independent assurance.

Two provider labels also do not automatically create independent assurance.

Initial engineering runtime principals are explicitly:

```text id="qt4prh"
independent_assurance_eligible: false
```

They may perform useful review.

They may not satisfy an `INDEPENDENT_REQUIRED` gate.

A future independent reviewer principal requires explicit registration and factual separation.

## Principal Capability Ceiling

Principal registry defines a maximum capability surface.

Canonical:

```text id="90tm9s"
REGISTERED CAPABILITY
∩
PRINCIPAL CAPABILITY CEILING
∩
ROLE PERMISSION
∩
AUTONOMY GRANT
∩
SCOPE
∩
ENVIRONMENT
∩
APPROVAL
∩
HOST PERMISSION
```

Only the intersection may execute.

Principal capability ceiling is not current permission.

## Current Remote-Action Direction

Initial runtime principals do not receive GitHub mutation or deployment capabilities in their principal ceiling.

Therefore initial principals cannot execute:

```text id="qjiocb"
feature branch push
PR creation
PR merge
branch deletion
deployment
```

even if the active role registry contains a conditional path for those capabilities.

Those capabilities require a later explicit principal-ceiling expansion and autonomy grant.

## Autonomy Grant

Autonomy belongs to:

```text id="lacvoc"
principal
+
capability
+
scope
+
environment
```

not globally to a runtime.

Correct:

```text id="lrgi2u"
engineering.runtime.primary

engineering.source.write.scoped

repository-local

approved Work Package scope

L2
```

Incorrect:

```text id="o2nq8j"
Codex = L2
```

## Grant Lifecycle

Grant states:

```text id="6l1jro"
ACTIVE
SUSPENDED
REVOKED
EXPIRED
```

`ACTIVE` may participate in permission resolution.

`SUSPENDED` blocks affected execution until reviewed.

`REVOKED` no longer grants autonomy.

`EXPIRED` no longer grants autonomy.

Historical records should remain traceable.

## Initial Baseline Grants

V1 may bootstrap existing safe local engineering behavior at L0-L2.

The bootstrap does not permit consequential remote actions.

Initial grants may cover:

```text id="hgd0st"
repository inspection

planning

bounded source preparation

local checks

review artifacts

QA artifacts

release packet preparation
```

They do not cover merge/deploy or remote database mutation.

## Initial Governance Baseline

Initial L0-L2 grant creation may use:

```text id="ojn61a"
INITIAL_GOVERNANCE_BASELINE
```

as its basis because the repository is establishing the first explicit machine representation of already intended bounded engineering behavior.

This basis may not create L3 or L4 authority.

## Promotion Grants

New L3/L4 authority must use:

```text id="nxvgc2"
PROMOTION_DECISION
```

and reference applicable promotion/evaluation evidence plus an accountable owner decision.

AI cannot create its own promotion decision.

## Configuration Regression

A grant may remain administratively ACTIVE while runtime behavioral qualification becomes stale.

The runtime adapter/tool layer should then lower or suspend effective autonomy according to applicable governance.

Grant existence alone does not erase regression evidence.

## Scope Modes

V1 supports:

```text id="sr9flb"
ANY
EXACT
PREFIX
```

for autonomy resource scope.

`PREFIX` is particularly useful for repository paths.

## Multiple Grants

V1 avoids ambiguous additive authority.

For the same:

```text id="q9nq0t"
principal
+
capability
+
environment
```

there should be at most one current non-historical grant.

A broader permission should be replaced/revised intentionally rather than created through overlapping grants.

## Risk Ceiling

An autonomy grant may specify:

```text id="ar42fs"
risk_ceiling
```

This does not reduce capability risk.

It limits which effective-risk contexts the grant covers.

Example:

```text id="2me078"
engineering.source.write.scoped
L2
risk_ceiling: R5
```

means the principal may prepare source changes for an R5 financial implementation within a bounded Work Package.

It does not grant runtime financial execution authority.

## Approval

Autonomy grant and action approval remain distinct.

Example:

```text id="vpqf6h"
L3 grant exists

+
no valid action approval

=
NEED_APPROVAL
```

## Trusted Principal Assertion

The model must not be allowed to self-declare:

```text id="7ls2z6"
I am engineering.runtime.primary
```

and receive authority.

Principal identity must be injected by trusted runtime/launcher context.

Preflight therefore consumes:

```text id="443sf7"
principal attestation
```

separately from the action request.

## V1 Trust Boundary

V1 attestation is an integration contract, not a cryptographic identity protocol.

The trusted launcher/host must protect the attestation channel from model modification.

A future execution gateway may add signed attestations where the threat model requires it.

## Initial Independent Assurance Posture

Neither initial engineering runtime principal may satisfy independent assurance.

Canonical initial state:

```text id="0r63ut"
engineering.runtime.primary
→ independent_assurance_eligible: false

engineering.runtime.orchestrator
→ independent_assurance_eligible: false
```

This prevents architecture from claiming independence merely because Codex and Antigravity are different products.

## Final Principle

> **Provider executes the principal. The principal receives bounded authority. The model itself owns no authority.**