---
canonical_id: agents.engineering.governed-tool-gateway
status: ACTIVE
version: 1.0
owner: Rizky
scope: repository-engineering
document_class: engineering-enforcement
effective_from: 2026-10-01

authoritative_for:
  - engineering governed tool gateway semantics
  - engineering tool dispatch enforcement
  - gateway execution profiles
  - gateway execution receipts
  - engineering MCP gateway boundary

depends_on:
  - ../../docs/engineering/engineering-ai-control-plane.md
  - ../../docs/governance/cross-system-risk-classification.md
  - ../../docs/governance/autonomy-levels.md
  - ../../docs/governance/approval-policy.md
  - ../capabilities/registry.yaml
  - ../capabilities/role-grants.yaml
  - ../capabilities/conditions.yaml
  - ../principals/registry.yaml
  - ../autonomy/grants.yaml

implementation_status: ACTIVE_ON_MERGE
---

# BisnisHub Governed Engineering Tool Gateway v1

## Purpose

The Engineering Tool Gateway provides a deterministic enforcement boundary between AI engineering runtimes and executable engineering actions.

Canonical path:

```text
Runtime
→ Gateway
→ Permission Preflight
→ Dispatch
→ Receipt
→ Verification
→ Evidence
```

The runtime does not receive execution merely because it requested a tool.

## Core Rule

```text
TOOL REQUEST
≠
TOOL AUTHORITY
```

And:

```text
PREFLIGHT ALLOW
≠
EXECUTION SUCCESS
```

Execution and verification remain separate facts.

## Provider Neutrality

The gateway does not belong to Codex or Antigravity.

It exposes a provider-neutral MCP interface.

Current runtime bindings may include:

```text
Codex
Antigravity
```

but provider identity does not own permission semantics.

## MCP Boundary

The initial gateway runs as a local MCP stdio server.

The MCP server exposes only bounded gateway tools.

It does not expose:

```text
raw shell
arbitrary argv
generic HTTP
generic GitHub mutation
raw SQL
deployment escape hatch
```

## Principal Identity

Principal identity is not supplied by the model.

The gateway receives a trusted session document created by the launcher/host.

The session contains a principal attestation.

The model cannot gain authority by saying:

```text
I am engineering.runtime.primary.
```

## Active Role

Role also comes from trusted gateway session state.

The gateway does not let an individual tool call silently switch:

```text
Engineer
→ Release Operator
```

Role changes require a new trusted session context.

## Effective Risk

Risk context comes from the governed engineering session.

A tool call cannot lower:

```text
R5
→ R2
```

by supplying a cheaper label.

The permission resolver always preserves capability and environment risk floors.

## Autonomy

Autonomy is resolved from:

```text
.agents/autonomy/grants.yaml
```

The model does not supply its own L-level.

## Approval

Where approval is required, the resolver verifies approval claim structure and ensures the claim is bound to the exact action fingerprint. Changing material action parameters invalidates reuse of unrelated approval claims.

However, approval claim structure and fingerprint consistency are distinct from trusted approval evidence. Because a trusted approval evidence verifier is not implemented, V1 intentionally fails closed: even structurally valid positive approval claims (`status: APPROVED`) evaluate to `NEED_APPROVAL` with `reason_code = APPROVAL_EVIDENCE_UNVERIFIED`. The launcher similarly rejects `--approval-file` to prevent self-asserted approval claims from authorizing governed execution.

## Fixed Profiles

Gateway V1 uses only pre-registered fixed execution profiles.

A profile defines:

```text
capability
environment
cwd
resource scope
fixed argv
timeout
non-destructive status
role-specific evidence requirements
```

The caller supplies only the profile ID.

The caller does not supply arbitrary command text.

## Initial V1 Capability

Initial gateway execution supports only:

```text
engineering.check.local.execute
```

for approved local repository checks.

This deliberately excludes consequential remote operations.

## No Remote Mutation V1

V1 does not implement:

```text
engineering.github.feature_branch.push
engineering.github.pull_request.create
engineering.github.pull_request.close
engineering.github.branch.delete
engineering.github.pull_request.merge
engineering.release.deploy
engineering.database.mgbos.remote.mutate
```

Absence of a handler is intentional defense in depth.

## No Production Profiles V1

No V1 gateway execution profile targets:

```text
production
remote-mgbos
github-remote
```

## Raw Shell Prohibition

The gateway uses:

```text
subprocess.run([...], shell=False)
```

with fixed argv.

No tool accepts:

```text
command: "..."
```

from the model.

## Environment

Child commands receive a minimal environment allowlist.

The gateway does not deliberately forward:

```text
GITHUB_TOKEN
GH_TOKEN
DATABASE_URL
SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
```

or arbitrary process environment.

Credentials should remain outside model-controlled process context.

## Evidence

Every attempted execution generates a receipt.

Even a denied or blocked preflight may produce:

```text
execution_status = NOT_EXECUTED
```

with the preflight reason.

Successful process launch generates:

```text
preflight.json
stdout.txt
stderr.txt
receipt.json
```

under:

```text
.agent-gateway-runs/
```

These artifacts are ignored by Git by default.

## Local Check Verification

For V1 fixed check profiles:

```text
exit code 0
→ verification_status PASS

non-zero
→ FAIL

timeout
→ BLOCKED
```

This verifies the check process outcome.

It does not imply:

```text
deployment
operational acceptance
business success
```

## Revision Binding and Workspace Fingerprint V2

Execution authority is tightly bound to exact repository revision state:

1. **Content-Sensitive Fingerprint V2 (`bisnishub-workspace-fingerprint-v2`)**:
   Hashing extends beyond git status text. The digest deterministically combines:
   - machine-stable zero-delimited git status (`--porcelain=v1 -z --untracked-files=all`);
   - tracked binary git diff relative to HEAD (`git diff --binary --full-index --no-ext-diff --no-textconv HEAD --`);
   - untracked file entries (`git ls-files --others --exclude-standard -z`) with incremental content hashing for regular files and link target hashing for symbolic links (without following external targets).

2. **Session Revision Immutability**:
   A governed session binds immutably to its workspace path, branch, and HEAD. If branch or HEAD changes, preflight fails closed.
   However, worktree dirty state and dirty fingerprints may legitimately evolve during source editing within the same session.

3. **Actual Preflight Binding**:
   Action fingerprints and preflight evaluations evaluate actual current workspace state at preflight time, rather than stale session-start dirty snapshots.

4. **Preflight-to-Dispatch TOCTOU Guard**:
   Immediately before dispatching a profile process, the gateway captures dispatch workspace state and compares path, branch, HEAD, dirty flag, and dirty fingerprint against the preflight snapshot. If any value changed:
   - `execution_status = NOT_EXECUTED`
   - `verification_status = BLOCKED`
   - `workspace_guard_status = BLOCKED`
   - `workspace_guard_reason = WORKSPACE_CHANGED_AFTER_PREFLIGHT`
   The profile process is not executed.

5. **Post-Execution Non-Destructive Guard**:
   After process completion, post-execution workspace is captured. For `non_destructive: true` profiles, any change between dispatch and post workspace results in:
   - `workspace_guard_status = VIOLATED`
   - `workspace_guard_reason = NON_DESTRUCTIVE_PROFILE_CHANGED_WORKSPACE`
   - `verification_status = FAIL` (overriding exit code 0).

6. **Execution Receipt V2**:
   Receipts record complete lifecycle workspace evidence across `session_workspace`, `preflight_workspace`, `dispatch_workspace`, and `post_workspace`, alongside `workspace_guard_status`, `workspace_guard_reason`, and `workspace_guard_detail`.

7. **Workstation Trust Boundary**:
   These guards mitigate race conditions and stale evidence on the development host, but do not make the workstation cryptographically sealed or race-free. The development workstation is not a sealed privileged runner:

   ```text
   development workstation ≠ sealed privileged runner
   ```


## Work Package Relevance

Engineer execution of local checks requires trusted Work Package context.

QA execution requires acceptance-criteria context.

Missing required context fails closed.

## Source Editing

V1 does not proxy normal editor/source-write operations.

Source writes remain governed through:

```text
Work Package
One Writer Rule
isolated worktree
provider sandbox
role permission
```

A future gateway phase may introduce structured source-write mediation if it produces real enforcement value.

## Host Enforcement Requirement

Gateway policy is effective only when the runtime host does not simultaneously expose bypass tools.

Governed runtime configuration should prefer:

```text
Gateway MCP
+
bounded workspace editor
```

and remove or constrain:

```text
direct GitHub mutation
direct deployment
remote DB tools
unrestricted consequential shell
```

## Tool Surface Principle

A runtime should discover only the tools it may legitimately consider.

Preferred:

```text
POLICY
→ bounded tool surface
```

not:

```text
all powerful tools
→ prompt says don't misuse them
```

## Remote Action Expansion

A future remote capability handler may only be added after:

```text
capability registry
role permission
principal ceiling
autonomy grant
approval semantics
target verification
postcondition verification
recovery semantics
negative tests
```

are all defined.

## Gateway Failure

If gateway policy cannot be resolved:

```text
BLOCK
```

is correct.

Do not fall back to direct shell or direct provider access.

## Gateway Unavailable

If the governed gateway is unavailable for an action whose policy requires it:

```text
TOOL_UNAVAILABLE
```

is correct.

The runtime must not improvise an escape hatch.

## Final Principle

> **The model requests. Governance decides. The gateway executes. Evidence proves what happened.**
