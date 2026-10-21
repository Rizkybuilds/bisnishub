---
canonical_id: agents.memory.index
status: PROPOSED
version: 1.0.0
owner: Rizky
author: ATLAS v2 / Head of Engineering
approver: Rizky
scope: repository-engineering
document_class: standard
effective_from: 2026-10-21

authoritative_for:
  - unified cognitive memory fabric architecture
  - memory record schema governance (.agents/memory/memory-record.schema.json)
  - data loss prevention (DLP) and secret hygiene policies for agent memory

not_authoritative_for:
  - canonical database models (governed by systems/mgbos/docs/architecture/)
  - financial ledgers and transaction history

depends_on:
  - ../README.md
  - ../executives/README.md
  - ../continuity/README.md
  - ../../docs/governance/documentation-constitution.md

supersedes: null
---

# BisnisHub Cognitive Memory Fabric (`.agents/memory/`)

## 1. Purpose & Memory Thesis

Dalam arsitektur BH-MAOS, **memori kognitif** adalah infrastruktur yang memungkinkan eksekutif AI (**ORION** dan **ATLAS**) mempertahankan kesinambungan konteks, hipotesis bisnis, dan pembelajaran operasional lintas sesi percakapan, tanpa melanggar prinsip *Repository Truth First*.

Memori agent bukanlah database transaksi (bukan pengganti Supabase) dan bukan penentu kebenaran kode (bukan pengganti Git HEAD). Memori agent adalah **indeks pemahaman konteks** yang mematuhi batasan privasi ketat.

---

## 2. The 3-Tier Cognitive Memory Model

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. EPISODIC WORKING MEMORY (Jangka Pendek / Sesi)          │
│    • Status worktree aktif, uncommitted diffs               │
│    • PR candidate baseline & lint/test status               │
│    • Checkpoint kontinuitas (.agents/continuity/)           │
├─────────────────────────────────────────────────────────────┤
│ 2. SEMANTIC DOMAIN MEMORY (Jangka Menengah / Pengetahuan)   │
│    • Graf invariant sistem MGBOS & entitas ERP              │
│    • DNA brand TeeStock, margin produk, HPP, persona pembeli│
│    • Hipotesis komersial & eksperimen pasar terverifikasi   │
├─────────────────────────────────────────────────────────────┤
│ 3. PROCEDURAL SKILL MEMORY (Jangka Panjang / Pola Eksekusi) │
│    • Playbook remediasi bug historis yang terbukti aman     │
│    • Heuristik prompt & routing task yang optimal           │
│    • Template contract yang lolos uji regresi               │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Four-Plane Privacy & Isolation Boundary

Setiap rekaman memori (`memory-record.schema.json`) diklasifikasikan ke dalam salah satu dari 4 bidang (*plane*):

1. **`PLANE_1_EPHEMERAL`:** Konteks sementara yang kedaluwarsa setelah sesi selesai.
2. **`PLANE_2_HYPOTHESIS`:** Hipotesis strategi ORION atau arsitektur ATLAS yang sedang diuji (belum menjadi kanonikal).
3. **`PLANE_3_CANONICAL_MIRROR`:** Pointer ke dokumen kanonikal repository (`main` branch) untuk retrieval cepat.
4. **`PLANE_4_PRIVATE_VAULT`:** Catatan privat founder (preferensi, batasan risiko pribadi) yang diisolasi ketat.

---

## 4. Data Loss Prevention (DLP) & Secret Hygiene

Aturan mutlak yang wajib dipatuhi:
- **Zero Secrets in Memory:** Dilarang keras menyimpan password, token GitHub, Supabase API keys, private keys, atau data finansial rekening bank mentah di dalam memori.
- **Zero Customer PII:** Nama pelanggan, nomor WhatsApp pribadi, dan bukti transfer asli tidak boleh masuk ke rekaman memori git.
- **Fail-Closed Sanitization:** Script pembersih otomatis menolak rekaman memori yang mengandung pola kredensial sensitif.
