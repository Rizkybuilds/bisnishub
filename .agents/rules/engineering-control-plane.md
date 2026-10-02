---
trigger: always_on
description: "Apply the thin BisnisHub Engineering Control Plane adapter to Antigravity engineering work in this repository."
---

# BisnisHub Engineering Control Plane — Antigravity Adapter

This file is an Antigravity workspace rule.

It is a thin runtime adapter, not an independent governance source.

Canonical repository governance always takes precedence.

## Repository authority

For material engineering work, use these repository sources as applicable:

- `AGENTS.md`
- the target system's `AGENTS.md`
- `docs/engineering/engineering-ai-control-plane.md`
- `docs/engineering/runtime-adapter-architecture.md`
- `.agents/roles/contracts.json`
- `.agents/expertise/registry.yaml`
- `.agents/routing/task-types.yaml`
- `.agents/contracts/README.md`
- applicable system-owned architecture and engineering specifications

Do not redefine their semantics in this file.

## Resolve workspace before work

Identify the real target before proposing or editing implementation.

For MGBOS:

`systems/mgbos/`

is authoritative.

Do not treat archived implementations as active runtime merely because they contain similar code.

## Context economy

Load only the canonical sources, Expertise, and Skills needed by the actual task.

Do not load every specialist by default.

## Material work

Before a material implementation:

1. Resolve target system.
2. Resolve primary task type.
3. Identify all material concerns.
4. Compute or preserve the highest applicable risk.
5. Resolve required roles and Expertise.
6. Read applicable canonical sources.
7. Establish or consume an Implementation Contract.
8. Establish or consume one bounded Work Package before writing.

For routine R0/R1 work, use proportionate process.

## One active role

One execution has one active role at a time:

- Planner
- Engineer
- Auditor
- QA
- Release Operator

Switching roles does not create independent review.

## One writer

For implementation:

ONE WRITER = ONE BRANCH = ONE WORKTREE = ONE BOUNDED WORK PACKAGE.

Do not let multiple agents write overlapping mutable scope concurrently.

## Expertise

Expertise describes what must be understood.

It does not grant:

- permission
- tools
- role
- approval
- autonomy

Required Expertise must come from `.agents/expertise/registry.yaml`.

## Skills

Use project Skills from `.agents/skills/` on demand.

Select the minimum relevant Skill set.

A Skill does not grant deployment, production database access, merge authority, or external business authority.

## Risk

Use only repository canonical R0-R5 semantics.

Highest applicable risk wins.

Never lower risk because:

- the diff is small;
- the implementation is local;
- an AI model is confident;
- the request sounds simple.

Unknown consequential risk fails closed.

## Scope

Do not silently expand scope.

If implementation requires materially broader files, capabilities, authority, or risk than the Work Package allows:

SCOPE_EXPANSION_REQUIRED.

Update planning/contracts before continuing.

## Evidence

Tie implementation, review, and QA claims to an exact revision.

For dirty work use the accepted base revision plus a scoped diff fingerprint.

Do not claim:

- tests executed when they were only defined;
- hosted CI from local execution;
- deployment from build success;
- operational acceptance from deployment;
- independent review from self-review.

## Handoff

Material handoff should use canonical artifacts:

Planner → Implementation Contract

Engineer → Engineering Report

Auditor → Assurance Report

QA → Verification Matrix

Release Operator → Release Packet

Do not rely only on conversational memory.

## Independent assurance

When routing requires independent assurance and the current Antigravity execution is also the implementer, record:

SELF_REVIEW

and leave the independent-assurance requirement unresolved.

Do not fabricate independence by changing role labels.

## External and production actions

Availability of a browser, shell, MCP server, GitHub access, database client, or deployment tool does not grant authority to use it for consequential external actions.

Apply repository permissions and release gates.

## Stop conditions

Stop the affected flow when applicable:

- CANONICAL_CONFLICT
- UNKNOWN_HIGH_RISK
- SCOPE_EXPANSION_REQUIRED
- REQUIRED_SOURCE_MISSING
- PERMISSION_UNCLEAR
- ENVIRONMENT_UNVERIFIED
- FINANCIAL_INVARIANT_AMBIGUOUS
- REQUIRED_EVIDENCE_UNAVAILABLE
- SECURITY_BOUNDARY_UNCLEAR
- UNRELATED_WORK_COLLISION

Continue unrelated authorized work when safe.

## Provider boundary

Do not create Antigravity-specific versions of repository risk, role, Expertise, contract, or business semantics.

Antigravity is an execution environment.

BisnisHub governance remains provider-neutral.