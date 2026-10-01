---
canonical_id: agents.engineering.provider-enforcement-wiring
status: ACTIVE
version: 1.0
owner: Rizky
scope: repository-engineering
document_class: engineering-enforcement
effective_from: 2026-10-01

authoritative_for:
  - engineering provider enforcement wiring
  - trusted engineering runtime launcher
  - Codex gateway binding
  - Antigravity gateway binding
  - trusted gateway session lifecycle

depends_on:
  - ../gateway/README.md
  - ../principals/README.md
  - ../principals/registry.yaml
  - ../autonomy/grants.yaml
  - ../capabilities/registry.yaml
  - ../capabilities/role-grants.yaml
  - ../../docs/engineering/runtime-adapter-architecture.md

implementation_status: ACTIVE_ON_MERGE
---

# Provider Enforcement Wiring v1

## Purpose

This specification binds supported engineering runtimes to the BisnisHub Governed Engineering Tool Gateway.

Initial runtimes:

Codex → `engineering.runtime.primary`

Antigravity → `engineering.runtime.orchestrator`

Provider identity is an implementation binding.

It is not the authority identity.

## Trusted Launch Path

Governed sessions SHOULD start through:

`tools/engineering_gateway/launch.py`

The launcher:

- resolves the registered engineering principal;
- creates a private ephemeral gateway session;
- binds one active role;
- binds declared risk context;
- binds Work Package or acceptance evidence where applicable;
- injects the session location into the provider process;
- launches the runtime with the approved provider safety posture.

The model does not create its own trusted session.

## Session Storage

Trusted session state is stored outside the repository under the user's local BisnisHub state directory.

The session file MUST NOT be committed.

On supported POSIX systems the launcher SHOULD restrict the directory to owner-only access and session files to mode `0600`.

The launcher removes the session after the runtime exits unless explicit troubleshooting retention is requested.

## Codex Binding

Codex uses repository:

`.codex/config.toml`

with:

- `workspace-write` sandbox;
- `on-request` approval policy;
- user reviewer;
- network disabled for workspace shell execution;
- only the BisnisHub Engineering Gateway MCP server configured by the project;
- explicit gateway MCP tool allowlist.

The project MCP server receives only the gateway-session environment variable required to locate trusted session state.

## Antigravity Binding

Antigravity uses project-local:

`.agents/mcp_config.json`

and is launched with:

`agy --sandbox`

The launcher rejects:

`--dangerously-skip-permissions`

for governed execution.

The project MCP configuration exposes the same BisnisHub Engineering Gateway used by Codex.

## No Provider-Specific Authority

Neither:

`.codex/config.toml`

nor:

`.agents/mcp_config.json`

may define engineering business authority.

They are runtime adapters only.

## Gateway Tool Surface

V1 exposes:

`list_engineering_profiles`

`preflight_engineering_profile`

`execute_engineering_profile`

No provider-specific raw mutation tool is added by this control plane.

## Codex Direct Shell Boundary

Codex still possesses its native local execution surface.

Therefore project configuration also applies:

`workspace-write`

and:

`network_access = false`

to prevent repository-local shell execution from becoming an uncontrolled network mutation path.

The gateway is the preferred and governed path for registered engineering checks.

## Antigravity Direct Terminal Boundary

Governed Antigravity sessions are launched with `--sandbox`.

The launcher refuses its documented permission-bypass flag.

Gateway configuration does not grant additional host permissions.

## Remote Mutation

Provider wiring V1 does not expose remote mutation through the gateway.

Current engineering runtime principals also lack remote GitHub/deployment capabilities in their principal ceiling and autonomy grants.

Therefore:

GitHub merge

deployment

remote MGBOS database mutation

direct main push

remain unavailable through the governed gateway.

## Fail Closed

If:

- trusted session is missing;
- session path points inside the repository;
- principal attestation is invalid;
- provider binding mismatches;
- gateway cannot initialize;
- preflight is not ALLOW;

the execution path must stop.

Do not silently fall back to a more powerful direct tool.

## Security Limitation

This launcher is a local host trust boundary, not cryptographic workload identity.

An attacker with equivalent host-user control can bypass local policy files.

Production-grade privileged automation may later require OS isolation, managed provider policy, signed workload identity, or a dedicated execution service.

## Final Principle

> Runtime configuration narrows the surface.  
> Trusted session establishes identity.  
> Gateway policy establishes authority.  
> Provider brand establishes neither.