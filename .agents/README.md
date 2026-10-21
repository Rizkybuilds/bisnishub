---
canonical_id: agents.index
status: ACTIVE
version: 2.0.0
owner: Rizky
author: ATLAS v2 / Head of Engineering
approver: Rizky
scope: repository-engineering
document_class: index
effective_from: 2026-10-21

authoritative_for:
  - agents directory navigation and subsystem layout
  - bisnishub multi-agent operating system (bh-maos) architecture map

not_authoritative_for:
  - canonical roles and permissions (.agents/roles/)
  - risk classification (docs/governance/cross-system-risk-classification.md)

depends_on:
  - ../AGENTS.md
  - ../docs/engineering/engineering-ai-control-plane.md
  - ../docs/governance/canonical-source-map.md
  - ../docs/governance/documentation-constitution.md

supersedes: null
---

# BisnisHub Multi-Agent Operating System (BH-MAOS) — `.agents/`

Selamat datang di direktori kontrol AI terpadu BisnisHub (**BH-MAOS**). Direktori ini mengelola seluruh arsitektur kognitif, eksekutif AI, protokol pertukaran artefak, memori, aturan runtime, dan jaminan keamanan *fail-closed* untuk pengembangan sistem dan strategi bisnis.

---

## 1. Arsitektur Tiga Lapis (Three-Tier Topology)

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ 1. COGNITIVE EXECUTIVE TIER (.agents/executives/)                        │
│    • ORION v2: Chief Strategy Officer (Commercial Brain, Drops, Margins) │
│    • ATLAS v2: Head of Engineering (Systems Spine, Blast Radius, CI/CD)  │
├──────────────────────────────────────────────────────────────────────────┤
│ 2. PROTOCOL & MEMORY FABRIC (.agents/protocols/ & .agents/memory/)       │
│    • Typed A2A Schemas: BOB (Strategy) ➔ TFC (Architecture) ➔ BWP (Code) │
│    • 3-Tier Memory: Episodic (Session), Semantic (Domain), Procedural    │
├──────────────────────────────────────────────────────────────────────────┤
│ 3. GOVERNANCE & CONTROL PLANE KERNEL                                     │
│    • roles/        : 5 Canonical Execution Roles (Planner, Engineer, ...)│
│    • capabilities/ : 19 Managed Capabilities & Role Grants               │
│    • expertise/    : 21 Specialist Knowledge Domains (EXP-001..EXP-021)  │
│    • contracts/    : Machine Schemas for Execution Envelopes             │
│    • adapters/     : Provider Runtime Adapters (Antigravity, Codex)      │
│    • rules/        : Always-On Runtime Execution Rules                   │
│    • skills/       : 43+ Repeatable Project Workflow Skills              │
│    • evals/        : Behavioral Regression & Safety Baselines            │
│    • continuity/   : Persisted Session Continuity Checkpoints            │
│    • autonomy/     : Governed Autonomy Levels (L0 - L4)                  │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Navigasi Direktori Sub-Sistem

| Direktori | Fungsi Utama | Otoritas Dokumen |
|---|---|---|
| [`executives/`](executives/README.md) | **Eksekutif Kognitif:** Paket resmi ATLAS (Engineering) dan ORION (Strategy). | Non-normative cognitive wrappers. |
| [`protocols/`](protocols/README.md) | **Protokol Antar-Agent (A2A):** Skema typed BOB, TFC, BWP untuk handoff bebas halusinasi. | Standar pertukaran artefak. |
| [`memory/`](memory/README.md) | **Memori Kognitif:** 3-Tier persistent memory fabric dengan guardrail DLP. | Manajemen konteks & privasi. |
| [`roles/`](roles/contracts.json) | **Role Kanonikal:** Kontrak 5 peran inti (`planner`, `engineer`, `auditor`, `qa`, `release-operator`). | Otoritas peran eksekusi. |
| [`capabilities/`](capabilities/README.md) | **Capability Model:** 19 izin teknis terkelola dan matriks hak akses (*role-grants*). | Batasan izin & mutasi. |
| [`expertise/`](expertise/README.md) | **Expertise Registry:** 21 domain pengetahuan spesialis (`EXP-001` s/d `EXP-021`). | Pemahaman domain on-demand. |
| [`contracts/`](contracts/README.md) | **Kontrak Eksekusi:** JSON schema untuk Work Package, Laporan Engineer, dan Assurance. | Integritas slice kerja builder. |
| [`adapters/`](adapters/README.md) | **Runtime Adapters:** Konfigurasi runtime untuk Antigravity dan Codex. | Boundary adapter provider. |
| [`rules/`](rules/engineering-control-plane.md) | **Aturan Runtime:** Rule `always_on` Antigravity yang memuat S.P.I.N.E. discipline. | Runtime instruction adapter. |
| [`skills/`](skills/) | **Project Skills:** 43+ skill eksekusi alur kerja spesifik (frontend, backend, ERP, dsb). | Eksekusi tugas berulang. |
| [`evals/`](evals/README.md) | **Behavioral Evals:** Suite evaluasi regresi perilaku runtime terhadap baseline. | Baseline validasi perilaku. |
| [`continuity/`](continuity/README.md) | **Kontinuitas:** Checkpoint snapshot untuk pemulihan konteks lintas sesi. | Pemulihan sesi & crash recovery. |
| [`autonomy/`](autonomy/README.md) | **Level Otonomi:** Klasifikasi otonomi L0 (Full Supervision) hingga L4 (Autonomous). | Batas eskalasi & persetujuan. |

---

## 3. Aturan Mutlak Penggunaan

1. **Repository Truth Outranks AI Memory:** Sesi chat, ingatan LLM, dan asumsi tidak pernah mengalahkan status Git HEAD nyata.
2. **Human Sovereignty:** Rizky adalah pemilik tunggal repository, aset bisnis, dan kunci rilis. Seluruh eksekutif AI dan builder beroperasi sebagai penasihat dan pelaksana yang patuh.
3. **No Fake PASS:** Pengujian yang gagal, tidak dijalankan, atau diblokir wajib dilaporkan apa adanya.
