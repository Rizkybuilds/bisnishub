---
canonical_id: jarvis.architecture.data-privacy-retention
status: ACTIVE
version: 1.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: jarvis
document_class: canonical-specification
effective_from: 2026-09-29
authoritative_for:
  - jarvis data governance semantics
  - jarvis data classification
  - jarvis data ownership
  - jarvis data minimization
  - jarvis purpose limitation
  - jarvis data lineage
  - jarvis data egress
  - jarvis provider data eligibility
  - jarvis privacy boundaries
  - jarvis retention semantics
  - jarvis deletion semantics
  - jarvis archival semantics
  - jarvis derived-data handling
  - jarvis embedding/vector-data handling
  - jarvis model prompt and response retention
  - jarvis telemetry data handling
  - jarvis evaluation-dataset handling
  - jarvis backup-data semantics
  - jarvis legal-hold semantics
  - jarvis cross-business data isolation
last_reviewed: 2026-09-29
review_cadence: quarterly
depends_on:
  - ../charter.md
  - ../architecture.md
  - ../core-runtime.md
  - memory.md
  - entity-identity-resolution.md
  - model-gateway-routing.md
  - event-proactive-intelligence.md
  - observability-audit-incident.md
  - security-secrets-environment.md
  - ../../../../docs/governance/evidence-provenance-model.md
  - ../../../mgbos/docs/engineering/maintenance-policy.md
  - ../../../mgbos/docs/runbooks/backup-and-restore.md
supersedes: null
implementation_status: PARTIALLY_DEFINED_NOT_IMPLEMENTED
target_runtime_location: systems/jarvis/
canonical_data_classes:
  - PUBLIC
  - INTERNAL
  - CONFIDENTIAL
  - RESTRICTED
---

# JARVIS Data, Privacy & Retention Architecture v1.0

## 1. Purpose

Dokumen ini mendefinisikan bagaimana data boleh:

```text
enter JARVIS

be classified

be read

be copied

be transformed

be sent to providers

be remembered

be indexed

be logged

be backed up

be archived

and eventually be deleted
```

tanpa mengubah JARVIS menjadi shadow database dari seluruh bisnis.

---

# 2. Core Principle

> **Move the minimum data required for the purpose, preserve its ownership and provenance, and retain it only as long as there is a justified reason.**

---

# 3. Data Governance Is Not Only Security

Security asks:

```text
Can someone access this?
```

Data governance also asks:

```text
Why do we have it?

Who owns the authoritative version?

Why are we copying it?

Where else does it exist?

How long should the copy remain?

What happens when the source changes or is deleted?
```

---

# 4. Canonical Data Classes

JARVIS uses four baseline classes:

```text
PUBLIC

INTERNAL

CONFIDENTIAL

RESTRICTED
```

They describe sensitivity.

They do not describe business importance or action risk.

---

# 5. Data Class ≠ Risk Class

Canonical distinction:

```text
CONFIDENTIAL
→ sensitivity of data

R4
→ consequence of an action
```

A read-only action may handle highly sensitive data.

A public-data action may still be operationally high-risk.

---

# 6. Classification Uses Highest Material Sensitivity

When a record contains fields of several classes:

```text
effective classification
=
highest relevant class
```

unless a smaller projection removes the sensitive fields.

---

# 7. PUBLIC

Data explicitly safe for public disclosure.

Examples may include:

```text
published website content

public product descriptions

published marketing assets

public company information
```

---

# 8. PUBLIC Is Explicit

Data does not become PUBLIC merely because:

```text
it is not marked confidential.
```

When uncertain:

```text
treat as non-public.
```

---

# 9. INTERNAL

Operational information intended for trusted internal use.

Examples may include:

```text
internal SOPs

non-sensitive operational notes

internal planning

internal architecture documentation

routine aggregate operational metrics
```

---

# 10. INTERNAL Does Not Mean Internet-Public

It may be acceptable for approved internal tooling.

It should not be published externally without a reason.

---

# 11. CONFIDENTIAL

Information whose unauthorized disclosure could materially affect:

```text
customer privacy

business economics

vendor relationships

commercial strategy

internal operations
```

---

# 12. Typical CONFIDENTIAL Examples

Current MGBOS data likely includes:

```text
customer email

customer phone

customer address

customer legal information

vendor contact details

pricing economics

cost information

invoice details

payment history

business financial summaries
```

---

# 13. RESTRICTED

Information requiring the strongest handling because compromise could create major security, privacy, financial, or operational harm.

Examples:

```text
passwords

API keys

OAuth refresh tokens

service-role credentials

private keys

payment credentials

security recovery material

sensitive authentication material
```

---

# 14. Restricted Data and Models

Normal cognitive model context MUST NOT contain raw:

```text
credentials
private keys
service tokens
passwords
```

even if provider technically supports secure processing.

---

# 15. Sensitive ≠ Secret

Customer phone number:

```text
CONFIDENTIAL
```

is sensitive.

An API key:

```text
RESTRICTED
```

is a secret.

Different controls apply.

---

# 16. Classification Is Attached to Data

Classification should follow the data through:

```text
copy

projection

cache

memory

evidence

embedding

export

telemetry
```

unless explicitly reclassified after safe transformation.

---

# 17. Reclassification

Data MAY become less sensitive after legitimate transformation.

Example:

```text
raw customer records
        ↓
aggregate counts
        ↓
no recoverable identities
```

may justify lower classification.

---

# 18. Aggregation Does Not Automatically Mean Anonymous

Small groups or unique combinations may still reveal individuals/businesses.

Do not automatically classify aggregates as PUBLIC.

---

# 19. Data Ownership

Every durable data concept SHOULD have a semantic owner.

Canonical:

```text
MGBOS
→ business entities and transactional truth

JARVIS
→ orchestration/runtime state,
   governed memory,
   JARVIS evidence,
   execution metadata

External provider
→ provider-native facts it directly owns

Documents/object storage
→ source document content where designated
```

---

# 20. Owner ≠ Storage Location

A copy of an invoice in JARVIS context does not make JARVIS the invoice owner.

---

# 21. Canonical Owner

Canonical owner answers:

```text
Where must we go to know
the authoritative current value?
```

---

# 22. Data Custodian

Infrastructure may store/process data without semantically owning it.

Example:

```text
PostgreSQL hosting
object-storage provider
backup provider
```

---

# 23. JARVIS Must Not Become Second MGBOS

Avoid:

```text
MGBOS customer
→ copied completely into JARVIS customer table
→ independently updated there
```

---

# 24. Preferred Pattern

```text
MGBOS
  │
  ▼
bounded projection / EntityRef
  │
  ▼
JARVIS context
```

---

# 25. Reference Before Copy

Where possible, store:

```text
source system
entity ID
evidence reference
```

rather than duplicating full business entities.

---

# 26. Copy Only When There Is a Reason

Legitimate reasons may include:

```text
runtime execution state

evidence snapshot

approved memory

cache

search index

audit requirement
```

---

# 27. Purpose Limitation

Every significant persistent JARVIS data class SHOULD have a purpose.

Examples:

```text
runtime execution
verification
memory
audit
security
evaluation
recovery
```

---

# 28. Do Not Collect “Just in Case”

Bad:

```text
copy all customer data into JARVIS
because it may be useful someday.
```

Good:

```text
retrieve exact customer fields
required for current workflow.
```

---

# 29. Data Minimization

Context Builder should prefer:

```text
minimum sufficient projection
```

instead of full source records.

---

# 30. Example — Customer Follow-Up

Potentially required:

```text
customer name

approved contact endpoint

invoice number

amount due

due date
```

Probably unnecessary:

```text
all historical addresses

unrelated orders

tax ID

other contact persons
```

---

# 31. Example — Morning Briefing

Model may need:

```text
aggregate finance signals

production exceptions

inventory risks
```

rather than complete transaction tables.

---

# 32. Data Projection

A projection is a purpose-built bounded view.

Example:

```ts
type FinancialBriefingProjection = {
  receivablesTotal: number
  overdueTotal: number
  cashReceivedToday: number
  exceptionIds: string[]
}
```

This can reduce privacy exposure dramatically.

---

# 33. Projection Does Not Become New Truth

The projection is:

```text
derived from MGBOS
```

and should include freshness/provenance.

---

# 34. Data Lineage

Material derived information SHOULD be traceable to its inputs.

Canonical:

```text
SOURCE
  ↓
PROJECTION
  ↓
DERIVATION
  ↓
OUTPUT
```

---

# 35. Lineage Questions

System should eventually answer:

```text
Where did this number come from?

Which source records?

At what time?

Which transformation?

Which model or calculation?
```

---

# 36. Derived Data

Derived data includes:

```text
summary

score

classification

forecast

recommendation

embedding

aggregate

AI interpretation
```

---

# 37. Derived Data Is Not Source Truth

Example:

```text
"customer likely to churn"
```

is derived analysis.

It is not a customer master fact.

---

# 38. Derived Data Needs Provenance

Material derived data SHOULD preserve:

```text
source refs

derivation method

version

time

confidence/limitations where relevant
```

---

# 39. Sensitivity Inheritance

Derived data normally inherits the highest relevant sensitivity of its inputs.

---

# 40. Transformation Can Reduce Sensitivity

Only when the transformation meaningfully removes sensitive information.

---

# 41. Redaction

Redaction removes information from a representation.

It does not modify authoritative source data unless specifically intended.

---

# 42. Masking

Examples:

```text
riz***@example.com

0812****9812
```

may be useful for:

```text
UI disambiguation

logs

approval surfaces
```

---

# 43. Tokenization / Pseudonymization

Stable internal identifiers may replace direct identifiers for analytics/evals where practical.

---

# 44. Pseudonymous ≠ Anonymous

If identity can be reconstructed through another mapping:

```text
still sensitive.
```

---

# 45. Personal Data

Architecture treats information that identifies or relates to an individual as privacy-sensitive.

Examples:

```text
name

email

phone

address

account identifier

communication history
```

Classification depends on context.

---

# 46. Customer Account vs Person Data

Company account information and personal contact information can coexist in the same business record.

Do not treat all B2B customer data as non-personal.

---

# 47. Current MGBOS Customer Data

Current schema includes fields such as:

```text
display name

legal name

primary email

primary phone

tax ID

customer contacts

addresses
```

and therefore JARVIS integrations must not assume customer records are low-sensitivity operational data.

---

# 48. Vendor Data

Vendor records may contain:

```text
contact person

phone

email

address

payment terms

notes
```

and should receive appropriate confidentiality.

---

# 49. Financial Data

Invoice/payment/cost/margin information should generally be treated as at least:

```text
CONFIDENTIAL
```

unless deliberately published/aggregated.

---

# 50. Authentication Data

Authentication identifiers and security metadata require stronger handling.

Actual secret credentials remain:

```text
RESTRICTED.
```

---

# 51. Notes / Free Text

Free-form fields are dangerous because users may enter:

```text
personal information

secrets

health information

financial details

unstructured customer history
```

---

# 52. Free-Text Rule

Do not assume:

```text
notes = INTERNAL
```

Classification may need to inherit from actual contents/context.

---

# 53. JSON Metadata

Flexible JSON fields can accumulate unexpected sensitive data.

Core durable concepts SHOULD be promoted into governed fields rather than hidden indefinitely inside metadata.

---

# 54. Data Flow

Canonical flow:

```text
AUTHORITATIVE SOURCE
        │
        ▼
BOUNDED QUERY / TOOL
        │
        ▼
CONTEXT BUILDER
        │
        ├── redact
        ├── minimize
        ├── classify
        └── label provenance
        │
        ▼
AGENT / SKILL / MODEL
```

---

# 55. Data Egress

Data Egress occurs whenever data leaves its current trust boundary.

Examples:

```text
external model provider

email provider

external API

web browser

external storage

third-party analytics
```

---

# 56. Egress Decision

Before external transfer:

```text
purpose valid?

data required?

classification known?

provider eligible?

minimum fields selected?

retention behavior understood?
```

---

# 57. PUBLIC Egress

May be sent to any:

```text
approved provider
```

compatible with the workflow.

---

# 58. INTERNAL Egress

May be sent to approved operational/model providers according to organizational policy.

---

# 59. CONFIDENTIAL Egress

Requires:

```text
approved provider

legitimate task purpose

minimum necessary fields

appropriate security terms/configuration
```

---

# 60. RESTRICTED Egress

Default:

```text
DENY
```

to general cognitive model context.

Exceptions require explicit trusted system integration and governance.

---

# 61. Provider Eligibility Matrix

Future provider registry SHOULD express something like:

```text
Provider A
PUBLIC ✓
INTERNAL ✓
CONFIDENTIAL ✓
RESTRICTED ✗

Provider B
PUBLIC ✓
INTERNAL ✓
CONFIDENTIAL ✗
RESTRICTED ✗
```

Actual mappings belong to current provider policy/configuration.

---

# 62. Provider Eligibility Is Data-Class Specific

A provider approved for:

```text
PUBLIC marketing generation
```

is not automatically approved for:

```text
customer financial data.
```

---

# 63. Provider Retention Matters

Before sending confidential data, architecture SHOULD understand:

```text
provider retention

logging

training use

subprocessors

regional handling
```

where relevant.

---

# 64. Provider Configuration Matters

One provider may offer different handling under:

```text
consumer product

business API

enterprise account
```

Eligibility must be based on the actual integration mode.

---

# 65. No Assumed Provider Privacy

Do not assume:

```text
"API means no retention."
```

Verify current provider terms/configuration when production integration is selected.

---

# 66. Data Residency

If business, customer, or law later requires data to remain within specific regions:

```text
provider eligibility
+
storage configuration
```

must encode that requirement.

---

# 67. Data Residency Is Not Hardcoded Yet

Current architecture defines the capability to constrain residency.

It does not invent jurisdiction-specific requirements.

---

# 68. Cross-Business Isolation

Data belonging to:

```text
Organization A
```

must not automatically enter context for:

```text
Organization B.
```

---

# 69. Same Person Across Businesses

Entity Resolver may know two records concern the same person.

That does NOT authorize data sharing between organizations.

---

# 70. Group-Level Analytics

Future holding-level analysis requires explicit:

```text
group-level permission

purpose

projection

classification
```

---

# 71. Cross-Business Aggregation

Aggregate group analytics SHOULD minimize exposing one business's raw customer data to another.

---

# 72. Memory

JARVIS Memory stores selected durable context.

It is not a dumping ground for all historical source data.

---

# 73. Memory Admission

Before promotion, candidate memory SHOULD answer:

```text
Is this useful later?

Is it stable enough?

Is it allowed to persist?

Which entity?

Which source?

What sensitivity?

When should it expire/revalidate?
```

---

# 74. Working Memory

Working Memory is temporary execution context.

Preferred retention:

```text
EPHEMERAL.
```

---

# 75. Working Memory Should Expire

It should not quietly accumulate into permanent history.

---

# 76. Working Memory Is Not Conversation Archive

Conversation transcripts and durable memory are different concepts.

---

# 77. Episodic Memory

Stores selected historical episodes useful to future reasoning.

Not every event or conversation becomes episodic memory.

---

# 78. Semantic Memory

Stores selected stable knowledge/decisions/concepts.

It must preserve source/provenance and revalidation semantics.

---

# 79. Preference Memory

Stores legitimate user/business preferences.

It must not retain sensitive details simply because they appeared in conversation.

---

# 80. Evidence Memory

Stores or references material verification evidence.

Retention may be longer than ordinary contextual memory.

---

# 81. Memory Sensitivity

Memory inherits classification from the remembered content.

---

# 82. Memory Cannot Downgrade Privacy

Copying confidential customer data into Memory does not make it less confidential.

---

# 83. Legacy Root `memory/`

Current root:

```text
memory/
```

contains legacy assistant persistence such as:

```text
business_profile.json

history.json
```

---

# 84. Legacy Memory Status

Canonical declaration:

```text
root memory/
=
legacy assistant persistence
```

not:

```text
JARVIS canonical Memory runtime
```

---

# 85. Legacy Migration

Existing memory content SHOULD be:

```text
audited

classified

mapped

promoted selectively
```

rather than imported wholesale.

---

# 86. Conversation History

Raw conversational history should not automatically become durable operational memory.

---

# 87. Model Prompts

Model prompts can contain:

```text
customer data

business data

internal instructions

evidence excerpts
```

and therefore are data assets with classification.

---

# 88. Prompt Retention

Default architecture direction:

> **Do not retain full prompts indefinitely merely because the model was called.**

---

# 89. Operational Prompt Metadata

Usually sufficient to retain:

```text
request ID

prompt/template version

model

token counts

classification

source references
```

without retaining all raw content.

---

# 90. Raw Prompt Retention

Only when justified for:

```text
debugging

evaluation

incident investigation
```

and with explicit retention/access policy.

---

# 91. Model Responses

Raw model responses likewise should not automatically become long-term data.

---

# 92. Structured Output

Prefer retaining validated structured outputs required by the workflow.

---

# 93. Hidden Reasoning

Private hidden chain-of-thought is not a durable data requirement and should not be retained.

---

# 94. Telemetry

Logs, traces, metrics, and debug payloads are data.

They follow classification and retention rules.

---

# 95. Telemetry Minimization

Prefer:

```text
IDs

status

latency

error class

redacted metadata
```

over entire customer/provider payloads.

---

# 96. Debug Payloads

Temporary high-detail debugging MUST have:

```text
scope

owner

expiration

restricted access
```

---

# 97. Audit Data

Audit records may require longer retention than debug telemetry.

They should preserve accountability while minimizing unnecessary payload content.

---

# 98. Evidence

Evidence retention depends on:

```text
claim importance

transaction history

recovery need

business requirement

legal/compliance need
```

---

# 99. Evidence Snapshot

Sometimes evidence needs a snapshot because source may later change.

Example:

```text
exact approved quote version
```

---

# 100. Evidence Reference

Where stable source history already exists, a reference may be enough.

Avoid redundant full copies.

---

# 101. Embeddings

Embeddings are:

```text
derived numerical indexes
```

used to improve semantic retrieval.

---

# 102. Embeddings Are Not Truth

Canonical source remains the source content.

---

# 103. Embeddings Inherit Sensitivity

Vector representation of confidential data is still derived from confidential data.

Treat it accordingly.

---

# 104. Vector Database Is Not Privacy Escape Hatch

Moving text into vectors does not make it anonymous or safe for unrestricted access.

---

# 105. Embedding Metadata

Index SHOULD retain:

```text
source reference

source version

classification

organization scope

embedding model/version
```

---

# 106. Source Deletion and Embeddings

When source data must be deleted:

```text
corresponding embeddings/index entries
```

must also become deletion targets.

---

# 107. Source Change

If source materially changes:

```text
stale embeddings
```

should be invalidated/rebuilt as required.

---

# 108. Re-Embedding

Changing embedding model may require complete index rebuild.

It does not change canonical source data.

---

# 109. Cache

Cache is a temporary derived copy.

---

# 110. Cache Must Have Expiry

Every sensitive cache SHOULD have:

```text
TTL
or
explicit invalidation.
```

---

# 111. Cache Is Not Backup

Do not rely on caches for recovery.

---

# 112. Cache Is Not Memory

Do not infer durable preference/knowledge from cache persistence.

---

# 113. Business Data Cache

Financial/current operational data SHOULD avoid aggressive long-lived caching unless freshness semantics are explicit.

---

# 114. Export

Exports create a new data copy.

Examples:

```text
CSV

PDF

spreadsheet

download

report
```

---

# 115. Export Classification

Export inherits the sensitivity of its contents.

---

# 116. Export Is a Capability

Sensitive bulk export SHOULD be treated as a governed capability.

---

# 117. Bulk Export

Cross-organization or broad personal-data export can have high blast radius.

Permission/risk governance applies.

---

# 118. Export Retention

Generated temporary exports SHOULD not live indefinitely by default.

---

# 119. Downloaded Local Copies

Once data is exported, centralized deletion control becomes weaker.

This is another reason to minimize unnecessary exports.

---

# 120. Evaluation Datasets

AI evaluation requires representative test data.

Default preference:

```text
synthetic

sanitized

purpose-built
```

---

# 121. Production Data in Evals

Real production examples may be valuable for regression tests.

But promotion into an eval dataset requires:

```text
clear purpose

minimization

classification

access scope

retention policy
```

---

# 122. Eval Dataset Is a New Copy

Do not treat:

```text
"it's only for testing"
```

as exemption from privacy governance.

---

# 123. Eval Dataset Anonymization

Remove direct identifiers when they are irrelevant to evaluated behavior.

---

# 124. Keep Necessary Difficulty

Sanitization should not destroy the behavior being tested.

---

# 125. Eval Dataset Lineage

Preserve enough metadata to know:

```text
source class

sanitization status

purpose

version
```

without unnecessarily retaining source identities.

---

# 126. Feedback Data

Human approvals, corrections, edits, and outcomes may become improvement signals.

---

# 127. Feedback ≠ Training Permission

Operational feedback does not automatically authorize unrestricted model training or third-party sharing.

---

# 128. Feedback Promotion

Useful feedback may become:

```text
eval fixture

Skill improvement

prompt improvement

routing signal
```

through explicit governance.

---

# 129. Retention

Retention answers:

> **How long does this particular copy need to exist for its purpose?**

---

# 130. No Universal Retention Period

Different classes have different needs.

Examples:

```text
Working Memory
→ very short

debug logs
→ short

business transaction history
→ long

audit
→ potentially long

backup
→ defined recovery window
```

---

# 131. Retention Policy Components

Every durable dataset SHOULD eventually identify:

```text
owner

purpose

classification

retention rule

deletion behavior

backup behavior

legal-hold behavior
```

---

# 132. Retention Classes

Recommended semantic categories:

```text
EPHEMERAL

SHORT_LIVED

OPERATIONAL

HISTORICAL

POLICY_REQUIRED

HOLD
```

Exact time durations belong to dataset-specific policy.

---

# 133. EPHEMERAL

Expected to exist only during/around active processing.

Examples:

```text
temporary context

temporary files

intermediate model payloads
```

---

# 134. SHORT_LIVED

Useful for short operational/debugging windows.

Examples:

```text
temporary exports

rich debug traces

transient provider payloads
```

---

# 135. OPERATIONAL

Required for normal system operation/recovery.

Examples:

```text
workflow execution records

recent incidents

operational audit
```

---

# 136. HISTORICAL

Preserved because history itself has durable business value.

Examples:

```text
transaction history

approved quote versions

payment history

important business decisions
```

---

# 137. POLICY_REQUIRED

Retention driven by explicit:

```text
business

contractual

legal

security
```

requirement.

---

# 138. HOLD

Deletion is temporarily suspended due to an explicit preservation requirement.

---

# 139. HOLD Is an Overlay

A record may be:

```text
HISTORICAL
+
HOLD
```

rather than HOLD replacing its normal class.

---

# 140. Legal Hold

Legal Hold concept means:

> Prevent destruction of identified data while a legitimate preservation requirement exists.

---

# 141. Legal Hold Does Not Broaden Access

Preserved data remains subject to existing security/classification.

---

# 142. Legal Hold Must Be Scoped

Avoid:

```text
hold everything forever.
```

Specify relevant:

```text
entity

dataset

date range

case/reason
```

---

# 143. Legal Hold Release

When hold ends, normal retention policy resumes.

---

# 144. Transactional History

MGBOS historical records should not be casually hard-deleted.

Existing governance already protects historical transaction integrity.

---

# 145. Archival

Archive means:

```text
move from active operational use
while preserving valid history.
```

---

# 146. Archive ≠ Delete

Archived customer/vendor/account still exists historically.

---

# 147. Customer Status

Current MGBOS already supports states such as:

```text
ACTIVE

INACTIVE

ARCHIVED
```

for customer accounts.

This lifecycle is not equivalent to physical deletion.

---

# 148. Deletion

Deletion means removing data from normal active storage where policy allows.

---

# 149. Deletion ≠ Archive

Do not use:

```text
ARCHIVED
```

as a false claim that data was deleted.

---

# 150. Deletion ≠ Anonymization

Deleting identifiers and keeping anonymized aggregates is a different transformation.

---

# 151. Deletion Eligibility

Before deleting:

```text
is retention period complete?

is business history required?

is a hold active?

does another dataset depend on it?

does authoritative system permit deletion?
```

---

# 152. Deletion Workflow

Canonical direction:

```text
REQUEST / POLICY TRIGGER
        ↓
LOCATE
        ↓
CLASSIFY
        ↓
CHECK RETENTION / HOLD
        ↓
DELETE / ANONYMIZE / ARCHIVE
        ↓
PROPAGATE TO DERIVED COPIES
        ↓
VERIFY
        ↓
RECORD DELETION RECEIPT
```

---

# 153. Derived-Copy Deletion

Deletion workflow may need to address:

```text
JARVIS Memory

embeddings

cache

temporary exports

eval datasets

telemetry samples
```

when applicable.

---

# 154. Deletion Propagation Is Not Instant Everywhere

Distributed systems/backups may require eventual deletion.

Architecture must report status honestly.

---

# 155. Deletion Receipt

Preserve minimal non-sensitive evidence that:

```text
request was processed

scope

time

outcome
```

without retaining the deleted data itself.

---

# 156. Tombstone

Where references must remain stable, a minimal tombstone MAY preserve:

```text
entity ID

deleted/retired status

deletion timestamp
```

without personal content.

---

# 157. Referential Integrity

Some business records cannot simply disappear because historical transactions reference them.

Use:

```text
archival

restricted historical identity

anonymization
```

where appropriate.

---

# 158. Deletion vs Business Integrity

Privacy deletion cannot be implemented as:

```text
hard-delete everything
and break invoices/payments/history.
```

Need explicit dataset-specific semantics.

---

# 159. Source Deletion

If authoritative source removes/anonymizes data, JARVIS must not keep a richer shadow copy indefinitely without separate justification.

---

# 160. Memory Retraction

Affected durable Memory may require:

```text
delete

retract

anonymize

rebind
```

depending on content.

---

# 161. Evidence Retention Conflict

Evidence may be needed for:

```text
financial history

audit

security

dispute resolution
```

even when other convenience copies are deleted.

Dataset-specific policy decides.

---

# 162. Backups

Backup exists for:

```text
recovery
```

not for indefinite analytics or historical browsing.

---

# 163. Backup Retention ≠ Source Retention

A deleted primary record may temporarily remain inside historical backups according to backup-retention policy.

---

# 164. Current MGBOS Backup Target

Current policy target states:

```text
daily backup

30-day daily retention

pre-risk-change snapshot
```

with stronger frequency/PITR if future RPO requires it.

---

# 165. Backup Target Is Not Operational Evidence

Current documentation explicitly does NOT establish that automated production backup is active.

---

# 166. Backup Data Sensitivity

Backup inherits sensitivity of all included data.

It often represents:

```text
high-concentration risk.
```

---

# 167. Backup Protection

Backups should have:

```text
encryption

restricted access

separate storage

retention control
```

appropriate to sensitivity.

---

# 168. Backup and Secrets

Database/object backup does not automatically back up:

```text
secret-manager data

provider credentials

external configuration
```

These have separate recovery paths.

---

# 169. Backup Expiration

Expired backup copies should be removed according to backup policy.

---

# 170. Backup Is Not Legal Hold

Normal backup rotation should not be used as accidental preservation mechanism.

---

# 171. Hold and Backup

If legally/business-required preservation must include backup-era data, scope should be designed deliberately.

---

# 172. Restore and Deletion

Restoring an older backup can reintroduce data previously deleted from primary systems.

---

# 173. Post-Restore Deletion Reconciliation

After restore, runtime SHOULD reconcile:

```text
deletion records

revocations

retention changes
```

that occurred after the backup snapshot.

---

# 174. Restore Must Not Resurrect Secrets

Revoked credentials must remain revoked even if old config backup contains references.

---

# 175. Object Storage

Documents/artwork/uploads may contain highly variable sensitivity.

Each object SHOULD eventually have:

```text
owner

classification

source entity

retention
```

metadata where useful.

---

# 176. Uploaded Documents

A PDF named:

```text
invoice.pdf
```

must not automatically be classified from filename alone.

Use workflow/source context.

---

# 177. Attachments

Email/customer attachments can contain unexpected:

```text
identity data

financial details

contracts

malicious instructions
```

Treat them as external/untrusted content plus their applicable data class.

---

# 178. Document Extraction

Extracted text inherits the source document's sensitivity unless transformation justifies otherwise.

---

# 179. Search Index

Full-text/search indexes are derived copies.

They must follow:

```text
organization scope

access controls

deletion propagation
```

---

# 180. Search Results

Search layer must not leak existence/content of resources the caller cannot access.

---

# 181. Knowledge Base

Knowledge ingestion requires distinguishing:

```text
public knowledge

internal documentation

customer-specific data

business-specific data
```

---

# 182. Not All Documents Belong in Global Retrieval

Customer-specific docs should not be indexed into an unrestricted organization-wide semantic pool by default.

---

# 183. Organization-Scoped Retrieval

Indexes SHOULD preserve tenant/business scope where applicable.

---

# 184. Provider Copy

Third-party providers may temporarily or durably retain copies depending on contract/configuration.

This must be considered part of data-flow analysis.

---

# 185. Shadow SaaS Copies

Avoid casually uploading:

```text
customer exports

database dumps

financial spreadsheets
```

to miscellaneous SaaS/AI tools outside governed integrations.

---

# 186. Personal Devices

Downloading confidential data onto unmanaged devices increases copy count and deletion difficulty.

Operational practice should minimize unnecessary local copies.

---

# 187. Screenshots

Screenshots can leak:

```text
customer identity

credentials

financial information

internal URLs
```

Treat them as data artifacts, not harmless images.

---

# 188. Approval UX

Decision Packages should display sufficient data to make the decision.

Not every underlying sensitive field.

---

# 189. Notification Privacy

Push/lock-screen notifications SHOULD minimize sensitive content.

---

# 190. Error Messages

Customer-facing or low-trust error responses SHOULD not reveal:

```text
database details

internal IDs unnecessarily

secret values

provider configuration
```

---

# 191. Analytics

Business analytics should prefer:

```text
aggregates

pseudonymous identifiers

bounded dimensions
```

when individual details are not needed.

---

# 192. Model Training

JARVIS architecture does NOT automatically authorize using operational data for third-party model training.

---

# 193. Internal Fine-Tuning / Training

Future internal training requires a separate:

```text
dataset purpose

classification review

retention policy

evaluation

governance
```

---

# 194. Model Provider Training Settings

Provider-specific data usage must be verified at integration time.

Do not assume from historical provider behavior.

---

# 195. Synthetic Data

Synthetic data is preferred for:

```text
development

tests

demos

evaluation
```

when real production data is unnecessary.

---

# 196. Synthetic ≠ Automatically Safe

Synthetic datasets should not accidentally contain copied real identities.

---

# 197. Sanitized Production Data

Sanitization must remove or transform sensitive attributes according to purpose.

Simply replacing a customer name may not be enough.

---

# 198. Development Data

LOCAL developers should not routinely pull full production databases.

---

# 199. Staging Data

Existing MGBOS policy already directs staging to use:

```text
synthetic data
```

with real copies requiring:

```text
clear need
masking
limited access
```

---

# 200. Data Quality

Privacy minimization must not silently destroy business correctness.

Example:

```text
payment verification
```

may require exact identifiers.

Use them in trusted deterministic systems rather than unnecessarily expose them to models.

---

# 201. Access Logging

Sensitive datasets may need read-access audit.

This is separate from business mutation audit.

---

# 202. Access Does Not Imply Copy Permission

A principal allowed to view confidential records may not automatically be allowed to:

```text
bulk export

send to external model

store in Memory
```

---

# 203. Purpose-Specific Capabilities

Future useful separation:

```text
customer.read

customer.export

customer.model_context

customer.memory_promote
```

if real governance needs demand it.

---

# 204. Data Egress Is a Capability Dimension

Tool availability alone does not authorize sending all visible context to it.

---

# 205. Data Classification and Models

Model Router filters candidate models based on:

```text
data classification

provider eligibility

environment

task
```

---

# 206. Data Classification and Agents

Agent context policy defines which classifications it may receive.

---

# 207. Data Classification and Skills

Skill declares required data/context classes.

It does not broaden permission.

---

# 208. Data Classification and Memory

Memory promotion policy evaluates sensitivity and retention before persistence.

---

# 209. Data Classification and Evidence

Evidence store may contain sensitive snapshots.

Evidence access follows classification.

---

# 210. Data Classification and Telemetry

Telemetry is not automatically INTERNAL.

If it includes confidential content:

```text
it becomes confidential.
```

---

# 211. Data Classification and Backups

Backup classification is at least the highest material sensitivity contained.

---

# 212. Data Classification and Exports

Generated report classification inherits content.

---

# 213. Data Classification and Cache

Cache cannot lower access restrictions.

---

# 214. Data Classification and Events

Event payload should carry only necessary fields.

Event consumer can re-read protected current state.

---

# 215. Event Payload PII

Avoid putting unnecessary full customer records into domain events.

Prefer stable entity IDs.

---

# 216. Model Context Budget Is Also Privacy Control

Smaller relevant context means:

```text
less exposure

less retention

less attack surface

lower cost
```

---

# 217. Data Lifecycle

Canonical conceptual lifecycle:

```text
COLLECT
  ↓
CLASSIFY
  ↓
USE
  ↓
DERIVE / REFERENCE
  ↓
RETAIN
  ↓
ARCHIVE
  ↓
DELETE / ANONYMIZE
```

with:

```text
HOLD
```

able to suspend deletion.

---

# 218. Data Inventory

Mature JARVIS SHOULD maintain an inventory of important datasets.

At minimum:

```text
dataset

owner

system

classification

purpose

retention

provider exposure
```

---

# 219. Data Inventory Is Metadata

It does not need to copy actual records.

---

# 220. Initial Inventory

First datasets likely include:

```text
MGBOS projections

JARVIS execution state

JARVIS evidence

JARVIS Memory

model-call metadata

telemetry

evaluation datasets

event inbox
```

---

# 221. Data Flow Registry

Future useful artifact:

```text
source
→ consumer
→ provider
→ retention
```

for important flows.

---

# 222. Example — Morning Briefing Flow

```text
MGBOS
  ↓
bounded business projections
  ↓
JARVIS Working Context
  ↓
approved model provider
  ↓
structured findings
  ↓
briefing
```

JARVIS does NOT need full customer tables.

---

# 223. Morning Briefing Data Classification

Likely effective class:

```text
CONFIDENTIAL
```

if financial/business/customer-sensitive signals are included.

---

# 224. Morning Briefing Retention

Prefer retaining:

```text
final structured briefing

evidence refs

execution metadata
```

instead of every raw source payload/model prompt indefinitely.

---

# 225. Morning Briefing Privacy Gate

Before first production use, verify:

```text
projection minimizes personal data

model/provider eligible

no credentials included

telemetry redacted

retention defined
```

---

# 226. First Runtime Memory Gate

Before enabling durable Memory:

```text
Memory schema includes source

classification

entity

created_at

expiry/revalidation semantics

deletion/retraction path
```

---

# 227. First Embedding Gate

Before introducing vector search:

```text
source ownership clear

classification preserved

tenant scope enforced

deletion propagation supported

embedding model tracked

rebuild procedure exists
```

---

# 228. First Production Eval Dataset Gate

Before storing production examples:

```text
purpose documented

direct identifiers removed where unnecessary

classification assigned

access limited

retention defined
```

---

# 229. First Confidential Provider Gate

Before external provider receives confidential data:

```text
provider identity known

integration mode known

data-use/retention handling reviewed

minimum fields confirmed

security configuration verified

routing policy configured
```

---

# 230. First Deletion Workflow Gate

Before promising deletion capability:

```text
canonical source located

derived copies inventoried

Memory handled

indexes handled

cache handled

exports/telemetry scope understood

backup semantics documented

verification implemented
```

---

# 231. Data Retention Does Not Mean Keep Everything

Storage being cheap is not a retention rationale.

---

# 232. AI Future Use Is Not Automatic Retention Rationale

Bad:

```text
keep all conversations forever
because future AI might learn something.
```

---

# 233. More Data Can Reduce System Quality

Unbounded history creates:

```text
stale context

privacy risk

search noise

higher costs

contradictions
```

---

# 234. Data Quality Through Deletion

Deleting stale/irrelevant derived data can improve JARVIS reliability.

---

# 235. Retention Review

Datasets SHOULD periodically be reviewed for:

```text
purpose still valid?

retention still justified?

provider still used?

old exports remain?

old debug data remains?
```

---

# 236. Orphan Data

Data without known:

```text
owner

purpose

source

retention
```

should be treated as governance debt.

---

# 237. Orphan Embeddings

Vectors whose source no longer exists or is inaccessible should be cleaned up.

---

# 238. Orphan Files

Uploads no longer referenced by active/historical business records need explicit retention handling.

---

# 239. Orphan Credentials

Covered primarily by Security Architecture but data inventory should not contain dead secret references indefinitely.

---

# 240. Backup Restore and Privacy

Restoring backup must preserve:

```text
current access rules

deletion requirements

revocations
```

not simply rewind governance.

---

# 241. Disaster Recovery Priority

Recovery should prioritize:

```text
business integrity

identity

authoritative data

required evidence
```

over convenience caches/vector indexes that can be rebuilt.

---

# 242. Rebuildable Data

Examples:

```text
cache

search index

embeddings

derived dashboards
```

often need not have the same backup priority as source data.

---

# 243. Recovery Tiering

Conceptually:

```text
TIER 1
authoritative business data

TIER 2
audit/evidence/workflow state

TIER 3
documents/object storage

TIER 4
rebuildable derived indexes/cache
```

Exact DR policy belongs to infrastructure/recovery governance.

---

# 244. Data Breach / Exposure

Unauthorized disclosure of confidential/restricted data may become:

```text
Security Incident
```

under Observability & Incident Architecture.

---

# 245. Exposure Investigation

Need ability to answer:

```text
what data?

which people/businesses?

which provider?

which period?

which execution?

which credential/principal?
```

---

# 246. Data Lineage Supports Incident Response

Without lineage, impact analysis becomes guesswork.

---

# 247. Privacy by Design

Privacy controls SHOULD happen before:

```text
model call

log write

export

memory promotion
```

not only through cleanup afterward.

---

# 248. Default Data Philosophy

```text
reference > copy

project > dump

aggregate > raw when sufficient

synthetic > production when sufficient

expire > retain indefinitely

revalidate > trust stale copy
```

---

# 249. Architecture Anti-Patterns

Prohibited patterns include:

```text
copy all MGBOS data into JARVIS

send entire DB row to model by default

store raw prompts forever

store every conversation as Memory

store credentials in Memory

assume embeddings are anonymous

assume aggregation is always public

retain data because storage is cheap

use production customer data in tests by default

upload customer exports to arbitrary AI services

delete source but keep uncontrolled vector copies

restore backup and resurrect deletion without reconciliation

call archived data "deleted"

treat backup retention as business retention

let one business retrieve another business's customer context
```

---

# 250. Current State Declaration

As of 2026-09-29:

```text
JARVIS Data/Privacy Architecture
ACTIVE specification

Canonical data classes
DEFINED

JARVIS Dataset Registry
NOT IMPLEMENTED

Data Flow Registry
NOT IMPLEMENTED

JARVIS Retention Engine
NOT IMPLEMENTED

JARVIS Deletion Orchestration
NOT IMPLEMENTED

JARVIS Vector Store
NOT IMPLEMENTED

JARVIS Production Memory
NOT IMPLEMENTED

Provider Confidential-Data Policy
NOT YET OPERATIONALLY CONFIGURED

Root memory/
LEGACY ASSISTANT PERSISTENCE

MGBOS Daily Backup + 30-Day Retention
POLICY TARGET

MGBOS Automated Production Backup
NOT VERIFIED
```

---

# 251. Canonicalization Effect

Before this document, relevant semantics were distributed across:

```text
JARVIS Architecture notes

Memory design

Governance notes

Security design

MGBOS maintenance policy

Backup runbook
```

After activation:

```text
jarvis.architecture.data-privacy-retention
```

becomes canonical owner for JARVIS data classification, privacy, movement, and retention semantics.

MGBOS remains owner of its business-data model and transaction history.

---

# 252. Architectural Invariants

1. Data has an owner even when copied elsewhere.
2. Storage location does not redefine semantic ownership.
3. JARVIS does not become a second MGBOS.
4. Reference is preferred over unnecessary copy.
5. Data collection requires a purpose.
6. Context follows minimum-sufficient-data principle.
7. Classification follows data through derived copies.
8. Derived data is not canonical source truth.
9. Derived data preserves provenance.
10. Aggregation does not automatically make data public.
11. Pseudonymization does not automatically make data anonymous.
12. Customer contact data is privacy-sensitive.
13. Financial/business economics are confidential by default unless intentionally published.
14. Credentials and secrets are restricted.
15. Raw secrets never belong in model context.
16. Provider eligibility is data-class specific.
17. Fallback provider may not lower privacy guarantees.
18. Cross-business entity linkage does not grant cross-business data access.
19. Working Memory is ephemeral.
20. Not every conversation becomes durable Memory.
21. Memory inherits source sensitivity.
22. Root `memory/` is legacy, not canonical JARVIS Memory.
23. Raw prompts/responses are not retained indefinitely by default.
24. Telemetry follows privacy governance.
25. Embeddings inherit source sensitivity.
26. Vector databases are not sources of truth.
27. Source deletion propagates to derived indexes where applicable.
28. Caches require expiry/invalidation.
29. Exports create governed copies.
30. Evaluation datasets are not exempt from privacy controls.
31. Synthetic/sanitized data is preferred for development/evaluation.
32. Operational feedback does not automatically authorize model training.
33. No universal retention duration exists.
34. Retention is dataset- and purpose-specific.
35. Archive is not deletion.
36. Deletion is not anonymization.
37. Legal hold suspends deletion but does not broaden access.
38. Transaction history cannot be casually destroyed for convenience.
39. Backup retention is distinct from business-data retention.
40. Backup is for recovery, not indefinite analytics.
41. Deleted primary data may temporarily remain in controlled backups.
42. Restore processes must reconcile later deletion/revocation state.
43. Rebuildable indexes need not receive source-data recovery priority.
44. Sensitive egress must be intentional.
45. Provider retention/data-use behavior must be understood before confidential production use.
46. Orphan data is governance debt.
47. Data-flow lineage supports security, privacy, debugging, and deletion.
48. Privacy controls should occur before persistence/egress where possible.
49. Written retention policy is not proof that deletion/backup controls are operational.
50. Data complexity must grow from real business purpose, not future speculation.

---

# 253. Canonical Mental Model

```text
                AUTHORITATIVE DATA
                       │
                       ▼
                BOUNDED PROJECTION
                       │
                       ▼
                CONTEXT BUILDER
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
      CLASSIFY      MINIMIZE      REDACT
          │            │            │
          └────────────┼────────────┘
                       ▼
               JARVIS REASONING
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
       OUTPUT        MEMORY       EVIDENCE
                        │
                        ▼
                 RETENTION POLICY

If external provider is required:

CONTEXT
  ↓
EGRESS POLICY
  ↓
PROVIDER ELIGIBILITY
  ↓
MINIMUM NECESSARY DATA
  ↓
PROVIDER
```

---

# 254. No-Shadow-Database Model

Desired:

```text
MGBOS
  │
  ├── Customer
  ├── Order
  ├── Invoice
  └── Payment
        │
        ▼
bounded JARVIS references/projections
        │
        ├── execution context
        ├── evidence refs
        └── selected Memory
```

Not:

```text
MGBOS
  ↓
copy everything
  ↓
JARVIS Database #2
  ↓
independent stale customer/order/payment truth
```

---

# 255. Data Minimization Example

Instead of:

```text
Customer Full Record
+
All Orders
+
All Messages
+
All Addresses
+
All Payments
→ Model
```

prefer:

```text
Customer ID

Display name

Relevant invoice

Approved contact channel

Current outstanding balance

Required evidence
→ Model
```

for the specific task.

---

# 256. Retention Mental Model

```text
Does this copy still serve
a legitimate purpose?

         │
    ┌────┴────┐
    │         │
   YES        NO
    │         │
    ▼         ▼
 RETAIN    HOLD?
             │
        ┌────┴────┐
        │         │
       YES        NO
        │         │
        ▼         ▼
    PRESERVE    DELETE /
                ANONYMIZE
```

---

# 257. Founder-by-Exception Data Governance

The founder should not manually decide retention for every log and vector.

The system should eventually encode normal policy such that:

```text
ordinary ephemeral data
→ expires automatically

operational records
→ retain by policy

historical business truth
→ preserve

stale cache/vector data
→ rebuild/delete automatically

legal/security exception
→ surface only when judgment needed
```

---

# 258. First Implementation Sequence

Recommended:

```text
1. DataClass contract

2. classification on Tool/Context contracts

3. bounded Morning Briefing projections

4. provider data-eligibility rules

5. telemetry redaction

6. Memory classification + retention metadata

7. dataset inventory

8. cache/temporary artifact expiry

9. deletion/retraction primitives

10. embeddings only after deletion propagation exists

11. provider-data-flow inventory as integrations expand
```

---

# 259. Phase 1 Definition of Done

Morning Briefing privacy layer is ready when:

```text
business projections are bounded

no unnecessary PII is sent

data class is explicit

model provider is eligible

prompt payload contains no secret

telemetry is redacted

evidence references source data

retention of outputs is defined
```

---

# 260. Memory Definition of Done

Before durable JARVIS Memory:

```text
source/provenance required

entity binding supported

classification stored

scope stored

created_at stored

revalidation/expiry supported

retraction/deletion supported

Memory never becomes transactional truth
```

---

# 261. Embedding Definition of Done

Before production vector retrieval:

```text
tenant scope tested

classification preserved

source IDs preserved

source-version handling exists

deletion propagation exists

re-embedding procedure exists

vector access cannot bypass source authorization
```

---

# 262. Data Deletion Definition of Done

A deletion-capable system can answer:

```text
Which canonical records exist?

Which derived copies?

Which Memory entries?

Which embeddings?

Which temporary exports?

Which telemetry/evidence is legitimately retained?

Which backups may still contain historical copies?

How is deletion verified?
```

---

# 263. North Star

Before JARVIS persists or sends sensitive data, it should eventually be able to answer:

```text
What data is this?

Who owns the canonical version?

Which organization does it belong to?

Why do I need it?

What is its classification?

Do I need the whole record?

Can I use a smaller projection?

Where am I sending it?

Is that provider eligible?

How long will this copy remain?

Will it enter Memory?

Will it be embedded?

Will it appear in telemetry?

How can it later be deleted or retracted?

Will a backup temporarily preserve it?

Can the authoritative source still be re-read instead of copying it?
```

---

# 264. Final Principle

> **A mature JARVIS should know less data by default, but understand the right data better.**

The dangerous architecture is:

```text
COPY EVERYTHING
     ↓
KEEP FOREVER
     ↓
SEND TO EVERY MODEL
     ↓
HOPE ACCESS CONTROL IS ENOUGH
```

The desired architecture is:

```text
AUTHORITATIVE SOURCE
       ↓
PURPOSE
       ↓
MINIMUM DATA
       ↓
CLASSIFICATION
       ↓
BOUNDED USE
       ↓
PROVENANCE
       ↓
DEFINED RETENTION
       ↓
DELETE / ARCHIVE WHEN JUSTIFIED
```

That lets BisnisHub accumulate intelligence without accumulating uncontrolled copies of every customer, conversation, credential, document, and transaction in the ecosystem.