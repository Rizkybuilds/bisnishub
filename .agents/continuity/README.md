---
canonical_id: agents.continuity.operational-registry
status: ACTIVE
version: 1.0
owner: Rizky
scope: repository-engineering
document_class: operational-registry
effective_from: 2026-10-05

authoritative_for:
  - vibe engineering continuity checkpoint operational purpose
  - vibe engineering continuity checkpoint restore precedence
  - vibe engineering continuity checkpoint update policy

depends_on:
  - ../../docs/engineering/vibe-engineering/README.md
  - ../../docs/engineering/vibe-engineering/session-protocol.md
  - ../../docs/governance/canonical-source-map.md
  - ../../AGENTS.md

machine_registries:
  - checkpoint.yaml

implementation_status: ACTIVE_ON_MERGE
---

# Vibe Engineering Continuity Registry

## 1. Operational Purpose

This directory provides a durable repository-backed continuity checkpoint for BisnisHub Vibe Engineering.

The continuity checkpoint (`checkpoint.yaml`) stores the last verified engineering snapshot across chat, session, or provider boundaries.

It exists to accelerate context restoration after chat loss, context compression, runtime switching, or long time gaps without relying on fragile conversational memory.

---

## 2. Core Snapshot Semantics

Canonical invariants:

```text
checkpoint.yaml is a snapshot
not live repository truth
```

```text
repository observation always wins
```

```text
checkpoint is read before chat memory
```

```text
checkpoint must never override newer repository evidence
```

```text
checkpoint contains no secrets
```

```text
checkpoint does not replace canonical contracts
```

The checkpoint records what was verified at a specific observed baseline commit. It does not speak for the live HEAD of the repository.

---

## 3. Restoration Precedence

When starting, recovering, or continuing a Vibe Engineering session, observe this strict precedence:

```text
ACTUAL REPOSITORY / GITHUB EVIDENCE
>
ACTIVE CANONICAL SOURCES
>
CONTINUITY CHECKPOINT
>
CHAT / MODEL MEMORY
```

The continuity checkpoint exists to accelerate restoration, not bypass it.

If actual repository reality or canonical governance differs from what is recorded in the checkpoint, current repository reality and canonical sources win unconditionally.

---

## 4. Checkpoint Update Policy

A durable continuity checkpoint SHOULD be refreshed after:

```text
VE_POST_MERGE.VERIFIED
```

for material engineering programs.

It MAY also be deliberately refreshed for a long-lived `BLOCKED` handoff when preserving the blocker and its context is materially useful across sessions.

Operational guidelines:

- **Do not commit after every turn**: A repository commit is not required after every conversational turn.
- **Do not create repository noise**: Conversational friction or ephemeral working hypotheses must not be committed to the checkpoint.
- **In-flight work restoration**: For active in-flight work, the restore procedure inspects:
  - open PRs;
  - PR head;
  - active branch / worktree;
  - live CI status;
  - active Implementation Contracts;
  - Engineering Reports and verification matrices
  directly from repository evidence.

---

## 5. Security and Privacy Boundaries

The continuity checkpoint:

- MUST NOT contain passwords, API keys, personal access tokens, private keys, or provider session IDs.
- MUST NOT record customer data, vendor credentials, or live production secrets.
- Records only public repository revision hashes, milestone identifiers, coordination summaries, and observed security postures.
