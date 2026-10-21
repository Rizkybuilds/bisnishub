---
canonical_id: agents.protocols.index
status: PROPOSED
version: 1.0.0
owner: Rizky
author: ATLAS v2 / Head of Engineering
approver: Rizky
scope: repository-engineering
document_class: standard
effective_from: 2026-10-21

authoritative_for:
  - agent-to-agent (A2A) typed protocol schemas
  - business outcome brief (BOB) format
  - technical feasibility card (TFC) format
  - bounded work package (BWP) builder dispatch format

not_authoritative_for:
  - canonical execution roles (.agents/roles/)
  - risk classification (docs/governance/cross-system-risk-classification.md)

depends_on:
  - ../README.md
  - ../executives/README.md
  - ../contracts/README.md
  - ../../docs/engineering/engineering-ai-control-plane.md

supersedes: null
---

# BisnisHub Agent-to-Agent Protocols (`.agents/protocols/`)

## 1. Overview & Protocol Principles

Dalam arsitektur BH-MAOS, komunikasi antar-agent (khususnya antara **ORION**, **ATLAS**, dan **AI Builders**) **tidak pernah menggunakan teks percakapan bebas**. Komunikasi wajib dilakukan melalui pertukaran artefak berbasis skema data (*typed contracts*).

Prinsip dasar:
1. **Zero Hallucination:** Setiap pesan antar-agent divalidasi terhadap JSON Schema resmi.
2. **Deterministic Handoff:** Parameter eksplisit (Target Workspace, Exact SHA, Allowed Paths, Non-Goals) mengeliminasi interpretasi liar dari runtime AI.
3. **Audit Trail Immutability:** Setiap tiket komunikasi dapat ditelusuri kembali ke commit baseline dan persetujuan Owner.

---

## 2. Protocol Schemas

| Protocol | File | Pengirim ➔ Penerima | Tujuan |
|---|---|---|---|
| **BOB** | [`bob.schema.json`](bob.schema.json) | ORION ➔ ATLAS | **Business Outcome Brief:** Merumuskan tujuan bisnis, sasaran pertumbuhan, unit economics, dan SLA. |
| **TFC** | [`tfc.schema.json`](tfc.schema.json) | ATLAS ➔ Rizky / ORION | **Technical Feasibility Card:** Menilai kelayakan arsitektur, blast radius, trade-off 80/20, dan skor risiko. |
| **BWP** | [`bwp.schema.json`](bwp.schema.json) | ATLAS ➔ AI Builder | **Bounded Work Package:** Mengirim paket kerja terbatas (*Single Writer, Whitelisted Scope, Exact SHA*). |

---

## 3. Communication Lifecycle Flow

```text
ORION (Strategy)
      │
      ▼  [bob.schema.json]
ATLAS (Head Engineering)
      │
      ▼  [tfc.schema.json]
RIZKY (Founder Gate)
      │
      ▼  (Authorized)
ATLAS ➔ BUILDER (Antigravity/Codex)
         [bwp.schema.json]
```
