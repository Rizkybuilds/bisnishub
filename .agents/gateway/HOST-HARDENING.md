---
canonical_id: agents.engineering.host-hardening
status: ACTIVE
version: 1.0
owner: Rizky
scope: repository-engineering
document_class: engineering-enforcement
effective_from: 2026-10-01

authoritative_for:
  - engineering development-workstation hardening
  - trusted runtime session lifecycle
  - workspace concurrency guard
  - provider environment minimization
  - engineering AI emergency kill switch
  - privileged-runner activation boundary

depends_on:
  - README.md
  - host-policy.yaml
  - ../principals/README.md
  - ../capabilities/registry.yaml
  - ../autonomy/grants.yaml
  - ../../docs/engineering/engineering-ai-control-plane.md

implementation_status: ACTIVE_ON_MERGE
---

# Engineering Host Hardening & Bypass Resistance v1

## Purpose

CP-006C hardens the host boundary around governed engineering runtimes.

It converts the recommended path:

Runtime → Policy → Gateway

into:

Trusted Launcher → Bound Workspace → Trusted Session → Provider Sandbox → Gateway → Policy → Execution.

## Operational Scope

V1 supports:

development workstation engineering.

V1 does not certify:

privileged production automation.

The privileged runner profile remains explicitly disabled.

## Development Workstation

The development workstation may be used for:

- planning;
- bounded implementation;
- local verification;
- audit;
- QA;
- release preparation.

It must not be treated as a sealed production execution environment.

## Privileged Runner

`privileged-runner` exists as a future host profile.

Its V1 state is:

DISABLED.

Enabling it requires a separate governance change with stronger isolation, workload identity, network policy, credential brokering, recovery and operational evidence.

## Trusted Session

Every governed runtime starts through the trusted launcher.

The launcher creates an ephemeral session containing:

- principal attestation;
- active role;
- effective engineering risk context;
- workspace identity;
- repository revision;
- dirty-worktree fingerprint;
- Work Package reference when applicable;
- acceptance reference when applicable;
- approval evidence when applicable;
- creation timestamp;
- expiry timestamp.

The model does not create this session.

## Session Lifetime

V1 development sessions expire after at most twelve hours.

Normal launcher exit removes the session immediately.

Expiry exists to prevent abandoned session files from becoming durable authority.

## Session Location

Trusted session state lives outside the repository.

Default host state root:

`~/.bisnishub/`

or platform equivalent.

Repository content must not contain live authority-bearing session state.

## Workspace Identity

The launcher binds each session to one Git workspace root.

The Gateway rejects a session whose workspace does not match the repository from which the Gateway is running.

## One Active Session Per Workspace

V1 deliberately chooses:

ONE GOVERNED SESSION
PER WORKSPACE

rather than only One Writer.

This is stricter than the architectural minimum.

It avoids ambiguity during the initial operational phase.

Parallel work requires separate Git worktrees.

## Engineer Startup

Engineer session must start:

- from a clean worktree;
- on a named non-main branch;
- with a Work Package reference.

This prevents normal governed implementation from starting directly on `main`.

## Planner Startup

Planner starts from a clean workspace.

Planner may operate on main because planning does not constitute implementation authority.

## Auditor and QA

Auditor and QA may inspect a dirty workspace because their purpose may be to inspect exact uncommitted implementation evidence.

They still require their own governed session after the Engineer session has ended.

## Release Operator

Release Operator starts:

- clean;
- on a named non-main branch.

Release preparation remains separate from actual release authority.

## Environment Minimization

The provider process receives only a small host environment allowlist.

Raw secrets are deliberately excluded.

Examples excluded:

- OPENAI_API_KEY;
- GITHUB_TOKEN;
- GH_TOKEN;
- DATABASE_URL;
- SUPABASE service credentials;
- Vercel token;
- cloud access keys.

Provider authentication SHOULD use the provider's normal local credential store/login rather than exposing broad raw secrets to agent-directed execution.

## Credential Principle

Agent-directed code should not receive a credential merely because the parent shell happened to contain it.

Canonical:

HOST HAS SECRET
≠
AGENT MAY READ SECRET.

## Codex

Codex continues to use:

- `workspace-write`;
- `on-request`;
- user approval;
- workspace network disabled.

The trusted launcher additionally rejects known attempts to override governed posture with full access or approval bypass.

## Antigravity

Antigravity governed launch always includes:

`--sandbox`.

The launcher rejects:

`--dangerously-skip-permissions`.

## Emergency Kill Switch

Host state contains an optional:

`engineering-gateway/kill-switch.json`.

If state is:

DISABLED

new governed runtime sessions must not start.

This is an emergency suspension mechanism.

It does not rewrite autonomy grants or historical evidence.

## Workspace Lock

A lock file is created outside the repository for every active governed session.

A second governed session targeting the same workspace fails closed.

Normal exit removes the lock.

A stale lock after abnormal process termination requires operator inspection before manual removal.

## Network

Current gateway capabilities are local-only.

Remote mutation profiles remain disabled.

Codex child command network remains disabled by project sandbox policy.

Antigravity runs its terminal workload in sandbox mode.

## Native Tool Bypass

Development workstation hardening reduces but does not mathematically eliminate every bypass available to the human owner of the machine.

A user with full host authority can still manually run ordinary host tools outside the governed launcher.

Therefore:

development workstation
≠
sealed privileged runner.

## Consequential Automation

Automatic remote actions such as:

- merge;
- deploy;
- production database access;
- external business mutation;

must not be introduced merely by adding another CLI command.

They require a separate registered capability and trusted execution path.

## Failure Mode

Unclear host state fails closed.

Examples:

- expired session;
- stale workspace lock;
- unverified principal;
- unknown risk;
- missing Work Package;
- disabled kill switch;
- unsupported provider override;
- unavailable Gateway.

Correct result:

BLOCK / DENY

not fallback to direct execution.

## Operational MVP Boundary

After CP-006C is enforced and validation is green, the Engineering Control Plane may be considered operational for normal local BisnisHub development.

That declaration does not authorize privileged remote automation.

## Final Principle

> The development workstation is trusted enough to build systems, not trusted enough to bypass the systems it is building.