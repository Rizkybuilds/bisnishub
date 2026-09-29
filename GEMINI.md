# BisnisHub provider routing

Read [AGENTS.md](AGENTS.md), the [project index](docs/project-index.md), and the
[documentation constitution](docs/governance/documentation-constitution.md).
These shared instructions govern repository work for every provider.

- MGBOS implementation: `systems/mgbos/`; read its AGENTS, README and applicable contracts.
- JARVIS design: `systems/jarvis/docs/`; specifications do not imply a running agent platform.
- Business knowledge: `bisnis/`; session history: `catatan/`.
- Existing Python CLI: `tools/assistant/`; it is separate from JARVIS.
- Retired implementations: root `archive/`; no deployment or SQL execution.

Provider-specific runtime agents are not registered by this document. Do not
infer available tools, authority, pricing, production parameters or business
states from legacy examples. Resolve these from the owning system's contracts.
Preserve concurrent edits; run scoped checks and distinguish design, code,
executed tests and operational evidence.

[Historical instructions](archive/teestock-v1/docs/2026-09-29-gemini-instructions.md)
are reference only and do not override this routing.
