---
canonical_id: mgbos.architecture.permission-authorization-model
status: ACTIVE
version: 1.0
owner: Rizky
author: OpenAI / ChatGPT
approver: Rizky
scope: mgbos
document_class: canonical-specification
effective_from: 2026-09-29
authoritative_for:
  - mgbos authentication and authorization semantics
  - organization membership authority
  - human role semantics
  - capability authorization model
  - command authorization boundary
  - tenant isolation expectations
  - service principal direction
  - JARVIS and automation authority boundary
  - approval-vs-authorization separation
  - database privilege-vs-business-authority separation
last_reviewed: 2026-09-29
review_cadence: quarterly
depends_on:
  - ../../../../docs/governance/documentation-constitution.md
  - ../../../../docs/governance/canonical-source-map.md
  - ../../../../docs/architecture/master-system-blueprint.md
  - ../../../../docs/architecture/system-boundaries.md
  - ../../../../docs/architecture/architectural-laws.md
  - canonical-data-model.md
  - business-state-machines.md
  - business-invariants.md
  - command-event-model.md
  - README.md
supersedes: null
implementation_basis:
  - ../../supabase/migrations/
  - ../engineering/agent-system/permission-matrix.md
implementation_through: MGBOS-020
---

# MGBOS Permission & Authorization Model v1.0

## 1. Purpose

Dokumen ini mendefinisikan bagaimana MGBOS menentukan:

```text
WHO
may do
WHAT
inside
WHICH ORGANIZATION
under
WHICH CONDITIONS
```

Ia memisahkan secara eksplisit:

```text
Authentication
Membership
Role
Capability
Authorization
Approval
Business Validation
Database Privilege
```

Konsep-konsep tersebut saling berkaitan tetapi MUST NOT disamakan.

---

# 2. Core Principle

> **Identity proves who an actor is. Authorization determines what that actor may attempt. Business rules determine whether the attempt is valid.**

Canonical execution model:

```text
IDENTITY
   ↓
ORGANIZATION MEMBERSHIP
   ↓
ROLE / SERVICE PRINCIPAL
   ↓
CAPABILITY AUTHORIZATION
   ↓
POLICY / APPROVAL
   ↓
COMMAND
   ↓
BUSINESS VALIDATION
   ↓
TRANSACTION
```

---

# 3. Current Authorization Maturity

Current MGBOS authorization is primarily:

```text
RBAC
+
organization-scoped command checks
+
RLS/read isolation
```

Current human roles:

```text
OWNER
ADMIN
SALES
OPERATIONS
FINANCE
QC
```

This is:

```text
CURRENT
VALID
SUFFICIENT FOR PRESENT SCALE
```

It MUST NOT be discarded merely to build a more sophisticated permission engine.

---

# 4. Target Authorization Direction

Long-term target:

```text
Principal
   ↓
Organization Membership / Service Identity
   ↓
Role
   ↓
Capability Set
   ↓
Command
   ↓
Contextual Policy
```

Role becomes a convenient bundle of capabilities.

Role itself SHOULD NOT remain the only authorization primitive forever.

---

# 5. Authentication

Authentication answers:

> **Who is this actor?**

For human users, current authentication basis is:

```text
Supabase Auth
      ↓
auth.users
      ↓
app.users
```

`app.users.auth_user_id` links business identity to authenticated identity.

---

# 6. Business User Identity

`app.users` represents the MGBOS business actor profile.

Current states:

```text
ACTIVE
INACTIVE
SUSPENDED
```

A valid authentication session is insufficient if the business user is not ACTIVE.

---

# 7. Authentication Is Not Authorization

Successful login does NOT imply:

```text
may read all organizations
may create quotes
may record payments
may manage production
may approve pricing
```

Authentication only establishes actor identity.

---

# 8. Organization Membership

`organization_members` links:

```text
USER
  ↓
ORGANIZATION
  ↓
ROLE
```

Current membership states:

```text
ACTIVE
INACTIVE
INVITED
```

Only ACTIVE membership grants normal organizational authority.

---

# 9. Organization Is an Authority Boundary

A role exists within an organization.

Example:

```text
Rizky
OWNER
in MultiGraph Group
```

does not automatically imply OWNER authority in every future organization.

Canonical authorization always includes:

```text
organization_id
```

---

# 10. Membership Is Not Permission

An ACTIVE member proves:

```text
actor belongs to organization
```

It does NOT prove:

```text
actor may execute every command
```

Canonical:

```text
Membership
≠
Permission
```

---

# 11. Role Model

Current roles are organization-scoped master data:

```text
app.roles
```

with:

```text
code
name
description
organization_id
```

A membership points to one current role.

---

# 12. OWNER

Current semantic:

> Founder / highest operational business authority inside the organization.

OWNER currently has the broadest business authority.

Typical capabilities include:

```text
commercial
operations
finance
inventory
procurement
QC
exception approval
```

However even OWNER MUST obey:

```text
business invariants
database constraints
state machines
historical immutability
```

OWNER is not a bypass switch.

---

# 13. ADMIN

Current semantic:

> Broad operational administrator.

ADMIN currently participates in most normal operational capabilities.

ADMIN SHOULD NOT automatically inherit founder-only exceptional authority.

Example:

```text
below-floor pricing override
```

currently remains OWNER-only.

---

# 14. SALES

Current responsibility:

```text
customer
lead
requirement
quotation
commercial initiation
retail order initiation
inventory reservation where sales process requires it
```

SALES does not automatically own:

```text
payment recording
vendor bill payment
production administration
stock adjustment
QC
```

---

# 15. OPERATIONS

Current responsibility:

```text
production
vendor management
inventory
fulfillment
procurement operations
requirement operational refinement
```

OPERATIONS does not automatically own:

```text
formal payment recording
financial pricing override
```

---

# 16. FINANCE

Current responsibility:

```text
invoice
payment
vendor payable
financial records
selected procurement/fulfillment financial operations
```

FINANCE does not automatically gain:

```text
production administration
customer sales authority
pricing override
```

unless separately granted.

---

# 17. QC

Current responsibility is intentionally narrow:

```text
inspection
defect recording
QC-driven production transitions
```

QC does not represent generic Operations authority.

---

# 18. Current Role Philosophy

Current role model intentionally remains small.

MGBOS v1 SHOULD NOT create dozens of highly specialized roles prematurely.

Preferred:

```text
few understandable roles
+
explicit command checks
```

until real organizational scale demands more granularity.

---

# 19. Current Authorization Pattern

Current command implementations commonly resolve:

```text
organization
+
actor
+
active user
+
active membership
+
role
```

through helpers such as:

```text
quote_actor_role(...)
production_actor_role(...)
invoice_actor_role(...)
payment_actor_role(...)
shipment_actor_role(...)
inventory_actor_role(...)
procurement_actor_role(...)
```

Then command-specific role checks are applied.

---

# 20. Current Commercial Authority

Current implementation approximately authorizes:

```text
Lead transition:
OWNER / ADMIN / SALES

Lead conversion:
OWNER / ADMIN / SALES

Customer creation command:
OWNER / ADMIN / SALES

Requirement creation:
OWNER / ADMIN / SALES

Requirement new version:
OWNER / ADMIN / SALES / OPERATIONS

Requirement locking:
OWNER / ADMIN / SALES

Quote creation/revision:
OWNER / ADMIN / SALES

Quote send:
OWNER / ADMIN / SALES

Quote pricing override:
OWNER only

Retail order creation:
OWNER / ADMIN / SALES / OPERATIONS
```

---

# 21. Current Production Authority

Current:

```text
Create production job:
OWNER / ADMIN / OPERATIONS

Assign production job:
OWNER / ADMIN / OPERATIONS

General production transition:
OWNER / ADMIN / OPERATIONS
```

QC has narrower transition authority described separately.

---

# 22. Current QC Authority

QC may:

```text
record inspection
```

and currently participate in transitions from:

```text
AWAITING_QC
```

toward:

```text
READY_FOR_HANDOFF
REWORK
ON_HOLD
```

QC MUST NOT gain general production transition authority merely because it can affect inspection outcomes.

---

# 23. Current Invoice Authority

Current implementation:

```text
Create invoice:
OWNER / ADMIN / FINANCE / SALES

Issue invoice:
OWNER / ADMIN / FINANCE

Void invoice:
OWNER / ADMIN / FINANCE
```

This separation allows SALES to prepare commercial billing while formal issuance remains financial authority.

---

# 24. Current Payment Authority

Current:

```text
Record payment:
OWNER / ADMIN / FINANCE

Allocate payment:
OWNER / ADMIN / FINANCE

Reverse payment:
OWNER / ADMIN / FINANCE
```

Payment mutation is intentionally excluded from SALES and OPERATIONS.

---

# 25. Current Inventory Authority

Current:

```text
Create inventory item:
OWNER / ADMIN / OPERATIONS

Record inventory mutation:
OWNER / ADMIN / OPERATIONS

Reserve inventory:
OWNER / ADMIN / OPERATIONS / SALES

Release reservation:
OWNER / ADMIN / OPERATIONS

Consume reservation:
OWNER / ADMIN / OPERATIONS

Stock opname:
OWNER / ADMIN / OPERATIONS
```

This reflects a deliberate distinction:

```text
Sales may reserve stock
```

but:

```text
Sales may not physically adjust stock.
```

---

# 26. Current Shipment Authority

Current:

```text
Create delivery order:
OWNER / ADMIN / OPERATIONS / FINANCE

Dispatch shipment:
OWNER / ADMIN / OPERATIONS / FINANCE

Mark delivered:
OWNER / ADMIN / OPERATIONS / FINANCE

Cancel shipment:
OWNER / ADMIN / OPERATIONS
```

Whether FINANCE should remain involved in physical fulfillment is a future business-design question, but this is the current implementation.

---

# 27. Current Procurement Authority

Current:

```text
Create purchase order:
OWNER / ADMIN / OPERATIONS / FINANCE

Receive goods:
OWNER / ADMIN / OPERATIONS

Pay vendor bill:
OWNER / ADMIN / FINANCE
```

This correctly separates:

```text
purchase commitment
physical receipt
cash payment
```

---

# 28. Role Matrix — Current Baseline

| Capability Area      | OWNER | ADMIN | SALES | OPERATIONS | FINANCE |      QC |
| -------------------- | ----: | ----: | ----: | ---------: | ------: | ------: |
| Lead/customer        |     ✓ |     ✓ |     ✓ |          — |       — |       — |
| Requirement create   |     ✓ |     ✓ |     ✓ |          — |       — |       — |
| Requirement revise   |     ✓ |     ✓ |     ✓ |          ✓ |       — |       — |
| Quote                |     ✓ |     ✓ |     ✓ |          — |       — |       — |
| Pricing override     |     ✓ |     — |     — |          — |       — |       — |
| Retail order         |     ✓ |     ✓ |     ✓ |          ✓ |       — |       — |
| Production           |     ✓ |     ✓ |     — |          ✓ |       — | limited |
| Vendor               |     ✓ |     ✓ |     — |          ✓ |       — |       — |
| QC                   |     ✓ |     ✓ |     — |          ✓ |       — |       ✓ |
| Invoice preparation  |     ✓ |     ✓ |     ✓ |          — |       ✓ |       — |
| Formal invoice       |     ✓ |     ✓ |     — |          — |       ✓ |       — |
| Payment              |     ✓ |     ✓ |     — |          — |       ✓ |       — |
| Inventory reserve    |     ✓ |     ✓ |     ✓ |          ✓ |       — |       — |
| Inventory adjustment |     ✓ |     ✓ |     — |          ✓ |       — |       — |
| Shipment             |     ✓ |     ✓ |     — |          ✓ |       ✓ |       — |
| Purchase order       |     ✓ |     ✓ |     — |          ✓ |       ✓ |       — |
| Goods receipt        |     ✓ |     ✓ |     — |          ✓ |       — |       — |
| Vendor payment       |     ✓ |     ✓ |     — |          — |       ✓ |       — |

This table documents current implementation semantics.

It is not intended to be the final capability registry.

---

# 29. Role-Based Authorization Limitation

Current pattern:

```text
if role in ('OWNER','ADMIN','FINANCE')
```

is practical today.

But as JARVIS and more workers appear, this becomes too coarse.

Example:

A future:

```text
Finance Agent
```

might need:

```text
invoice.read
cashflow.read
payment.recommend
```

but MUST NOT automatically receive:

```text
payment.record
payment.reverse
vendor_bill.pay
```

Therefore capability semantics are required.

---

# 30. Capability

A Capability represents:

> **one bounded permission to perform or request a specific class of operation.**

Examples:

```text
mgbos.order.read
mgbos.quote.create
mgbos.quote.send
mgbos.quote.override_price
mgbos.production.assign
mgbos.payment.record
mgbos.payment.reverse
mgbos.inventory.reserve
mgbos.inventory.adjust
```

---

# 31. Capability Naming

Canonical target format:

```text
mgbos.<resource>.<action>
```

This aligns permission identity with command/tool identity.

Example:

```text
Capability:
mgbos.payment.record

Command:
mgbos.payment.record

JARVIS Tool:
mgbos.payment.record
```

They share semantic identity while remaining different technical layers.

---

# 32. Role as Capability Bundle

Target mental model:

```text
ROLE
  ↓
CAPABILITY SET
```

Example:

```text
FINANCE

mgbos.invoice.read
mgbos.invoice.create
mgbos.invoice.issue
mgbos.payment.read
mgbos.payment.record
mgbos.payment.allocate
mgbos.vendor_bill.read
mgbos.vendor_bill.pay
```

A role is therefore organizational convenience.

Capabilities are authorization primitives.

---

# 33. Capability Registry Status

Current full capability registry:

```text
NOT YET IMPLEMENTED
```

Current command-specific role checks remain authoritative.

Do not introduce a permission database solely because this document defines the target abstraction.

---

# 34. Capability Migration Strategy

Evolution SHOULD be incremental:

```text
CURRENT role checks
      ↓
document logical capability names
      ↓
map existing roles to capabilities
      ↓
use capabilities for new service principals
      ↓
centralize checks when duplication creates real cost
```

No big-bang rewrite.

---

# 35. Authorization Decision

Target logical authorization function:

```text
authorize(
  principal,
  organization,
  capability,
  resource,
  context
)
```

returns:

```text
ALLOW
DENY
REQUIRES_APPROVAL
```

Approval semantics remain governed separately.

---

# 36. Authorization Is Deny-by-Default

If no explicit authority can be established:

```text
DENY
```

is the correct result.

The system MUST NOT infer permission from:

```text
job title
agent intelligence
tool availability
database access
similar previous action
```

---

# 37. Least Authority

Every principal receives only the authority required for its job.

Examples:

```text
Sales
→ reserve stock
→ not adjust physical stock

QC
→ inspect
→ not pay vendor

JARVIS CFO
→ analyze cash
→ not automatically move money
```

---

# 38. Authentication vs Membership vs Authorization

Canonical distinction:

```text
Authentication
→ Who are you?

Membership
→ Which organization do you belong to?

Role
→ What organizational responsibility do you have?

Capability
→ What action may you attempt?

Business Rule
→ Is that attempted action valid?
```

All required layers must succeed.

---

# 39. Authorization vs Approval

Authorization asks:

> Is this principal allowed to initiate this type of action?

Approval asks:

> Does this particular action require another authority before execution?

Example:

```text
SALES
has capability:
mgbos.quote.send

but

margin below floor
requires:
OWNER approval
```

Sales remains authorized to work with quote.

The exceptional action still requires approval.

---

# 40. Approval Does Not Grant General Permission

If OWNER approves one pricing exception:

```text
approval applies to that specific quote/version
```

It does NOT mean SALES gains permanent:

```text
mgbos.quote.override_price
```

authority.

---

# 41. Approval Does Not Waive Business Invariants

Even OWNER-approved action still passes:

```text
state validity
money arithmetic
historical integrity
organization isolation
```

Approval is not:

```text
bypass_all_validation()
```

---

# 42. Authorization vs Risk

Permission and risk are distinct.

A principal may be authorized for a capability while a particular execution still has high risk.

Future flow:

```text
CAPABILITY AUTHORIZED
        ↓
RISK CLASSIFICATION
        ↓
AUTONOMY / APPROVAL POLICY
```

Root risk semantics belong to cross-system governance.

---

# 43. Resource Scope

Capabilities MAY require resource scope.

Examples:

```text
all organization customers
one brand
one business line
one assigned production job
one warehouse/location
```

Current implementation is primarily organization-level.

Finer resource scoping SHOULD be introduced only when business need exists.

---

# 44. Brand Scope

Organization membership does not automatically require brand isolation today.

But future brands MAY need:

```text
brand-scoped role/capability
```

Example:

```text
TeeStock Sales
```

should potentially avoid modifying another brand's commercial operations.

This remains a future authorization extension.

---

# 45. Business-Line Scope

Similar principle applies to business lines.

Do not introduce business-line ACLs until real staffing/operational boundaries require them.

---

# 46. Row Level Security

RLS provides database-level row access control.

Current MGBOS uses RLS in several domains to enforce organization membership on reads.

RLS is an important defense layer.

It is NOT the complete business authorization model.

---

# 47. RLS and Command Authorization Serve Different Purposes

RLS asks:

```text
may database principal access this row?
```

Command authorization asks:

```text
may business actor perform this business operation?
```

Both may be required.

---

# 48. RLS Must Not Be the Sole Guard for Sensitive Mutation

For critical transaction commands:

```text
payment
quote
production
inventory
procurement
shipment
```

business authorization MUST exist at the command boundary.

RLS alone is insufficient.

---

# 49. Current Direct Authenticated Access

Some earlier master-data/customer tables currently allow authenticated organization members to perform direct insert/update under RLS.

This is:

```text
CURRENT IMPLEMENTATION
```

but it MUST NOT be generalized to critical transactional domains.

---

# 50. Direct Master-Data Mutation Direction

For low-risk master data, direct RLS-protected mutation MAY remain acceptable.

As requirements become more complex, important mutations SHOULD migrate behind explicit commands.

Decision should be based on:

```text
business consequence
validation complexity
audit requirement
authorization complexity
```

---

# 51. Database Privilege Is Not Business Authority

A technical database identity such as:

```text
service_role
```

may have broad database privilege.

That does NOT mean every process holding it is authorized for every business operation.

Canonical:

```text
DATABASE PRIVILEGE
≠
BUSINESS PERMISSION
```

---

# 52. Service Role

Current `service_role` is:

> trusted server-side infrastructure authority.

It can bypass or exceed ordinary client-level database restrictions.

Therefore it MUST remain inside trusted execution infrastructure.

---

# 53. Service Role Must Not Reach Browser

Privileged credentials MUST NOT be shipped into:

```text
browser bundle
public frontend
customer device
AI prompt
```

---

# 54. Service Role Must Not Become an Authorization Shortcut

Bad:

```text
server has service_role
→ therefore request is allowed
```

Correct:

```text
server has service_role
        ↓
identify actor
        ↓
organization
        ↓
capability
        ↓
business authorization
        ↓
execute
```

---

# 55. Current SECURITY DEFINER Functions

Many current mutation commands use:

```text
SECURITY DEFINER
```

This is acceptable where functions explicitly verify:

```text
organization
actor
membership
role
business state
```

The function's elevated technical privilege does not remove its responsibility to enforce business authorization.

---

# 56. Human Principal

Canonical target principal type:

```text
HUMAN
```

Human principal contains stable identity associated with:

```text
app.users
```

and organizational membership.

---

# 57. Service Principal

Future non-human runtime components require:

```text
SERVICE PRINCIPAL
```

Examples:

```text
JARVIS runtime
n8n production
marketplace integration
payment reconciliation worker
outbox dispatcher
```

These MUST NOT be modeled permanently as fake human users.

---

# 58. Service Principal Status

Current generalized service-principal model:

```text
NOT YET IMPLEMENTED
```

It should be introduced when the first genuine non-human command caller needs durable identity.

---

# 59. Service Principal Identity

Future service identity SHOULD include concepts such as:

```text
principal_id
principal_type
organization scope
capability set
environment
status
credential reference
```

Credentials themselves do not belong in the principal record.

---

# 60. Service Principal Must Be Bounded

Bad:

```text
jarvis-service
→ OWNER equivalent
```

Correct:

```text
jarvis-cfo
→ finance.read
→ invoice.read
→ cashflow.read
→ payment.prepare

not:
payment.record unless explicitly approved
```

---

# 61. JARVIS Authority

JARVIS has:

```text
reasoning authority
```

only within its assigned task.

JARVIS does NOT gain business authority because:

```text
it knows the business
it selected the tool
the founder uses it frequently
```

---

# 62. JARVIS Command Flow

Target:

```text
JARVIS
   ↓
Tool Policy
   ↓
Capability Check
   ↓
Approval if required
   ↓
MGBOS Command
   ↓
MGBOS Authorization
   ↓
Business Validation
```

There are intentionally multiple guards.

---

# 63. MGBOS Revalidates JARVIS

Even if JARVIS policy says:

```text
ALLOW
```

MGBOS MUST still validate:

```text
principal
organization
command authorization
business state
invariants
```

JARVIS does not become a trusted bypass path.

---

# 64. JARVIS Read Authority

Read capabilities SHOULD also be bounded.

Examples:

```text
mgbos.finance.summary.read
mgbos.customer.read
mgbos.production.exceptions.read
```

Avoid:

```text
JARVIS
→ unrestricted SELECT * across all business data
```

---

# 65. n8n Authority

n8n is a service/orchestration principal.

It should receive only capabilities required by specific workflows.

Example:

```text
Lead follow-up workflow:
lead.read
followup.create

not:
payment.reverse
```

---

# 66. n8n Credential Possession Is Not Permission

Even if n8n stores trusted server credentials:

```text
workflow
```

must still call an authorized command boundary.

Do not use n8n credentials to bypass business controls.

---

# 67. External Integration Principal

External systems SHOULD NOT directly hold broad MGBOS database authority.

Pattern:

```text
Provider
   ↓
Integration Boundary
   ↓
Verified External Identity
   ↓
Service Principal / Command
   ↓
MGBOS
```

---

# 68. `on_behalf_of`

Delegated execution must distinguish:

```text
EXECUTOR
```

from:

```text
AUTHORIZER
```

Example:

```text
executor:
JARVIS

on_behalf_of:
Rizky
```

when Rizky explicitly approved an action.

---

# 69. `on_behalf_of` Must Not Be Caller-Controlled Arbitrarily

A runtime MUST NOT simply submit:

```text
on_behalf_of = OWNER
```

to acquire authority.

Delegation must reference trusted approval/authorization evidence.

---

# 70. Delegated Authority Must Be Narrow

Approval for:

```text
send this quote
```

MUST NOT become delegation for:

```text
send any quote
record payment
change inventory
```

Scope is part of delegation.

---

# 71. Time-Bounded Delegation

Future elevated/temporary authority SHOULD support expiry where appropriate.

Example:

```text
capability:
mgbos.vendor.read

valid_until:
2026-10-01
```

Do not build temporal permission infrastructure until a real need appears.

---

# 72. Environment Boundary

Authorization differs by environment.

A principal permitted in:

```text
LOCAL / TEST
```

does not automatically receive:

```text
PRODUCTION
```

authority.

---

# 73. Production Uses Strongest Authority Rules

Production SHOULD have:

```text
least privilege
explicit principals
auditable grants
controlled secrets
strong approval for sensitive actions
```

Development convenience MUST NOT define production authorization.

---

# 74. Engineering Agents Are Outside Business Authorization

Engineering agents may have repository authority.

They MUST NOT inherit MGBOS runtime business permission.

Example:

```text
Engineer
can edit payment implementation
```

does not imply:

```text
Engineer
can record real customer payment
```

---

# 75. Runtime Agents Are Outside Engineering Authorization

Likewise:

```text
CFO Agent
```

may eventually have finance capabilities.

It does not gain:

```text
Git push
migration write
production deploy
```

authority.

---

# 76. Separation of Duties

Some business capabilities SHOULD remain separated when consequence justifies it.

Examples:

```text
prepare
vs
approve

request
vs
pay

execute
vs
verify
```

Current solo-founder stage may collapse some responsibilities into Rizky.

Architecture MUST preserve the possibility of separation as the team grows.

---

# 77. Solo-Founder Reality

Because MGBOS currently supports a solo-founder/very-small-team environment:

```text
OWNER
```

may legitimately hold many responsibilities.

This is not a reason to remove role/capability boundaries.

Those boundaries enable future delegation safely.

---

# 78. OWNER Is Ultimate Business Role, Not Ultimate Technical Root

OWNER business authority does not mean:

```text
database superuser
secret manager root
deployment administrator
```

must always be the same credential.

Business authority and infrastructure privilege remain separable.

---

# 79. Authorization Result

Canonical target outcomes:

```text
ALLOW
DENY
REQUIRES_APPROVAL
```

Business validation may separately return:

```text
INVALID_STATE
INVARIANT_VIOLATION
NOT_FOUND
CONFLICT
```

Do not merge these categories into generic:

```text
ERROR
```

where diagnostic precision matters.

---

# 80. Denial Is a Valid System Outcome

A denied command is not a system failure.

Example:

```text
SALES
→ payment.reverse

DENY
```

means authorization is working correctly.

---

# 81. Authorization Failure Must Not Leak Sensitive Data

The system SHOULD avoid revealing sensitive target existence across organization boundaries.

Example:

```text
Not authorized / not found in scope
```

may be preferable to confirming existence of another organization's record.

---

# 82. Authorization Logging

Sensitive authorization decisions SHOULD eventually be observable.

Useful data includes:

```text
principal
organization
capability
result
resource
timestamp
reason/policy
```

Do not log secrets.

---

# 83. Capability Registry — Future Shape

Conceptual registry:

```yaml
capability_id: mgbos.payment.record
resource: payment
action: record
mutation: true
risk_class: TBD
requires_business_command: true
```

This is a target representation.

No database table is mandated yet.

---

# 84. Role Mapping — Future Shape

Conceptual:

```yaml
role: FINANCE
capabilities:
  - mgbos.invoice.read
  - mgbos.invoice.create
  - mgbos.invoice.issue
  - mgbos.payment.read
  - mgbos.payment.record
  - mgbos.payment.allocate
  - mgbos.payment.reverse
  - mgbos.vendor_bill.read
  - mgbos.vendor_bill.pay
```

---

# 85. Capability Override

Future system MAY support specific allow/deny overrides.

But do not introduce per-user ACL complexity until actual need appears.

Default architecture should remain:

```text
ROLE
→ CAPABILITY SET
```

with exceptional overrides only when justified.

---

# 86. Explicit Deny

If future capability inheritance becomes complex, explicit deny SHOULD win over inherited allow where security demands predictable behavior.

Example:

```text
role allows vendor.read
principal override denies vendor.read

→ DENY
```

This remains target semantics.

---

# 87. Capability Does Not Contain Business Rules

Permission:

```text
mgbos.payment.record
```

means:

> actor may request payment recording.

It does NOT mean:

> any payment request must succeed.

MGBOS still checks:

```text
amount
invoice
allocation
state
organization
```

---

# 88. Capability Does Not Contain Autonomy

Capability:

```text
mgbos.payment.record
```

does not answer whether JARVIS may execute it automatically.

Autonomy is separate governance.

---

# 89. Capability Does Not Contain Approval State

An actor may possess a capability while a specific transaction still requires approval.

Keep:

```text
permission
approval
risk
```

separate.

---

# 90. Permission Changes Are Security-Relevant Changes

Changes such as:

```text
SALES can record payment
QC can adjust inventory
JARVIS gets vendor bill payment
```

are not ordinary UI changes.

They SHOULD receive explicit security/business review.

---

# 91. Permission Versioning Direction

As capability architecture matures, permission bundles SHOULD become versioned/configuration-controlled rather than hidden only in scattered code.

Current role checks may remain code/database-function-based until centralization is justified.

---

# 92. Revocation

Authority must be revocable.

Examples:

```text
user SUSPENDED
membership INACTIVE
service principal DISABLED
capability removed
credential revoked
```

Revocation SHOULD prevent future authorized execution promptly.

---

# 93. Existing Sessions and Revocation

Authentication/session architecture SHOULD eventually consider how quickly:

```text
SUSPENDED user
```

loses effective authority even if an old token still exists.

This belongs to detailed auth/session implementation, but the semantic requirement is canonical.

---

# 94. Historical Attribution Survives Revocation

If a user becomes inactive:

```text
past audit history
```

must remain attributed to that user.

Identity history MUST NOT disappear because access was revoked.

---

# 95. Least Data Access

Authorization should limit not only mutations but reads.

A principal should receive only data needed for its job.

Future AI contexts especially SHOULD follow:

```text
minimum necessary context
```

rather than broad data dumps.

---

# 96. Sensitive Financial Reads

As organization grows, detailed financial visibility MAY require narrower capability than ordinary operational membership.

Current small-team implementation may expose broader organization-level reads.

This is a known future hardening area.

---

# 97. Customer Data

Customer data should be accessed only for legitimate organizational/business purpose.

Cross-business/customer-data access MUST NOT be granted merely because a system shares the same repository.

---

# 98. RLS and Capability Convergence

Long-term desired layering:

```text
RLS
→ row/tenant defense

Capability Authorization
→ operation permission

Business Command
→ domain validation

Audit
→ accountability
```

Each layer has a distinct purpose.

---

# 99. Permission Enforcement Locations

Authorization MAY be enforced at several layers:

```text
gateway
application service
database function
RLS
tool gateway
```

But there MUST be one clearly authoritative business authorization decision path for each consequential command.

Duplicated checks SHOULD agree.

---

# 100. Client-Side Authorization Is Advisory

Frontend may hide buttons.

Example:

```text
SALES
does not see
"Reverse Payment"
```

Good UX.

But security MUST NOT depend on hidden buttons.

Server-side authorization remains mandatory.

---

# 101. Tool-Level Authorization

Future JARVIS Tool Gateway SHOULD reject unavailable capabilities before MGBOS is called.

This saves cost and limits unnecessary attempts.

But MGBOS still revalidates.

Defense in depth:

```text
JARVIS Policy
      ↓
Tool Permission
      ↓
MGBOS Authorization
      ↓
Business Invariant
```

---

# 102. No Authority Through Prompt

Text such as:

```text
"You are CFO, you may approve all payments."
```

does not create permission.

Prompts are instructions for reasoning behavior.

Permissions require authoritative runtime policy.

---

# 103. No Authority Through Skill

A skill declaring:

```text
allowed_tools:
- mgbos.payment.record
```

does not grant the runtime that capability by itself.

Skill contract may narrow usage.

Runtime policy grants actual authority.

---

# 104. No Authority Through Agent Name

Naming an agent:

```text
OWNER_AGENT
SUPER_ADMIN_AGENT
CFO_AGENT
```

does not grant business permission.

Identity and capability mapping must establish authority.

---

# 105. No Authority Through Credential Leakage

If an agent accidentally receives a powerful credential:

```text
technical ability
```

does not become legitimate business permission.

Credential exposure is a security incident.

Not authorization.

---

# 106. No Implicit Founder Authority for AI

Because Rizky owns the business does not mean every AI acting for Rizky automatically inherits OWNER.

Explicit delegation is required for consequential mutation.

This is foundational for safe future autonomy.

---

# 107. High-Level Principal Model

Target:

```text
PRINCIPAL
├── HUMAN
│    └── Organization Membership
│          └── Role
│               └── Capabilities
│
└── SERVICE
     └── Organization Scope
          └── Capabilities
               └── Environment Scope
```

JARVIS and n8n belong under SERVICE.

---

# 108. Future Approval Relationship

Target:

```text
Principal requests capability
        ↓
Authorized?
        ↓ yes
Requires approval?
        ├── no → command
        └── yes
              ↓
          approval evidence
              ↓
            command
```

Detailed Approval Policy belongs to dedicated governance documentation.

---

# 109. Future Risk Relationship

Target:

```text
CAPABILITY
   ↓
RISK CLASS
   ↓
AUTONOMY POLICY
   ↓
APPROVAL POLICY
```

Permission remains independent from risk.

---

# 110. Known Current Gaps

Current authorization gaps include:

```text
1. Role checks are repeated across domain functions.

2. No canonical runtime capability registry exists yet.

3. Service principals are not yet modeled explicitly.

4. JARVIS/n8n business identity has not yet been implemented.

5. Some earlier customer/master-data mutation remains directly accessible to authenticated members through RLS.

6. Read permissions remain relatively coarse at organization level.

7. Role → capability mapping is implicit in code rather than one machine-readable registry.

8. Approval and permission semantics are not yet centralized.

9. Brand/business-line scoped permission does not yet exist.

10. Permission-change audit/administration is not yet a dedicated subsystem.
```

These are expected maturity gaps.

---

# 111. What We Should NOT Build Yet

Do NOT immediately build:

```text
ABAC engine
policy DSL
hundreds of permissions
nested role inheritance
dynamic rule engine
complex temporary grants
enterprise IAM platform
```

Current scale does not justify it.

---

# 112. Immediate Target

Near-term architecture should remain:

```text
RBAC
+
explicit commands
+
organization isolation
+
least privilege
```

while documenting stable capability IDs for future runtime use.

---

# 113. First Capability Registry Use Case

The first real need for capability registry will likely come from:

```text
JARVIS Tool Runtime
```

because runtime AI requires finer permission than:

```text
role = FINANCE
```

Example:

```text
CFO Agent:
mgbos.finance.summary.read
mgbos.invoice.read
mgbos.payment.read

but not:
mgbos.payment.record
```

---

# 114. JARVIS Read-Only First

The first JARVIS vertical slice:

```text
Morning Business Briefing
```

SHOULD use only read capabilities.

This proves:

```text
identity
query authorization
evidence
tool routing
```

before mutation authority is introduced.

---

# 115. Mutation Promotion

Future AI mutation authority should be introduced capability by capability.

Example:

```text
Stage 1
payment.read

Stage 2
payment.prepare

Stage 3
payment.record with human approval

Stage 4
possibly bounded automatic execution
only if governance permits
```

There is no global:

```text
JARVIS WRITE = TRUE
```

switch.

---

# 116. Kill/Disable Direction

Service principals SHOULD eventually be individually disableable.

Example:

```text
jarvis-runtime = DISABLED
```

must prevent future command execution without disabling MGBOS itself.

Detailed kill-switch governance belongs to future governance documentation.

---

# 117. Permission Testing Standard

Critical authorization tests SHOULD verify:

```text
allowed role succeeds

disallowed role fails

inactive user fails

inactive membership fails

inactive organization fails

cross-organization resource fails

business rule still rejects authorized-but-invalid operation
```

---

# 118. Service Principal Testing

When implemented, service-principal tests SHOULD verify:

```text
allowed capability

missing capability

wrong organization

wrong environment

revoked principal

delegated approval scope

no human impersonation
```

---

# 119. Authorization Test Is Not Enough

For example:

```text
FINANCE can record payment
```

test must not stop there.

It should also prove:

```text
FINANCE cannot over-allocate payment
```

Authorization and business validity are separate layers.

---

# 120. Permission Change Checklist

Before expanding authority ask:

```text
Who needs this capability?

Why?

Which organization?

Read or mutation?

What business state can it affect?

What risk does it carry?

Does it require approval?

What evidence is created?

Can it be revoked?

Does this accidentally create cross-domain authority?

Could a narrower capability solve the need?
```

---

# 121. Anti-Patterns

### Role Equals Unlimited Authority

```text
ADMIN
→ can do anything
```

without boundaries.

### Membership Equals Permission

```text
active member
→ all commands
```

### Service Role Equals Business Authorization

```text
has Supabase service key
→ may mutate anything
```

### Fake Human Agent

```text
JARVIS logs in as Rizky
```

to inherit OWNER authority.

### Prompt-Based Permission

```text
"You are allowed to pay invoices."
```

### Tool-Based Permission

```text
tool exists
→ agent may use it
```

### Client-Side Security

```text
button hidden
→ secure
```

### Broad AI Database Access

```text
JARVIS
→ all tables
```

### Cross-Business Leakage

```text
same repo
→ same permissions
```

All violate this specification.

---

# 122. Canonical Responsibility Matrix

| Concept            | Answers                               | Canonical Owner              |
| ------------------ | ------------------------------------- | ---------------------------- |
| Authentication     | Who are you?                          | Auth system                  |
| User               | Who is the business actor?            | MGBOS                        |
| Membership         | Which organization?                   | MGBOS                        |
| Role               | Organizational responsibility         | MGBOS                        |
| Capability         | What operation may be attempted?      | MGBOS authorization          |
| Risk               | How consequential?                    | Cross-system governance      |
| Approval           | Who must approve this instance?       | Governance / business policy |
| Command            | What change is requested?             | MGBOS                        |
| Business Rule      | Is the requested change valid?        | MGBOS domain                 |
| Database Privilege | What can technical credential access? | Infrastructure               |
| Autonomy           | How independently may AI execute?     | Cross-system governance      |

---

# 123. Canonical Authorization Formula

Conceptually:

```text
ALLOW EXECUTION
=
Authenticated Principal
AND
Active Principal
AND
Valid Organization Scope
AND
Active Membership / Service Scope
AND
Capability Authorized
AND
Required Approval Present
AND
Command Preconditions Valid
AND
Business Invariants Pass
```

Failure of any mandatory term prevents successful mutation.

---

# 124. Current → Target Evolution

```text
CURRENT

Human User
   ↓
Organization Membership
   ↓
Role
   ↓
Command-specific role check
   ↓
Business rules


TARGET

Principal
   ↓
Organization Scope
   ↓
Role / Service Identity
   ↓
Capability
   ↓
Risk / Approval Policy
   ↓
Command
   ↓
Business Rules
   ↓
Evidence
```

Target extends current authorization.

It does not invalidate working RBAC.

---

# 125. Architectural Invariants

1. Authentication does not grant business permission.
2. Membership does not grant every capability.
3. Roles are organizational bundles, not unlimited authority.
4. Capabilities represent bounded actions.
5. Authorization is deny-by-default.
6. Organization scope accompanies every material command.
7. Business authorization and business validation remain separate.
8. Approval does not grant permanent permission.
9. Approval does not bypass invariants.
10. Risk and permission remain separate.
11. Database privilege is not business authority.
12. `service_role` remains trusted infrastructure only.
13. Privileged credentials never belong in public clients.
14. JARVIS does not inherit founder authority implicitly.
15. n8n does not inherit global mutation authority.
16. Runtime services require explicit non-human identity.
17. Engineering authority does not imply business authority.
18. Runtime business authority does not imply repository authority.
19. Capability presence does not imply autonomy.
20. Prompts, skills, agent names, and tool availability cannot create authorization.
21. Revocation must be possible.
22. Historical attribution survives revocation.
23. Read access follows least necessary scope.
24. Client-side controls are not authoritative security.
25. Permission architecture grows only when actual organizational need requires it.

---

# 126. Relationship to Other Specifications

```text
Canonical Data Model
→ WHAT entities exist

Business State Machines
→ HOW lifecycle changes

Business Invariants
→ WHAT must remain true

Command & Event Model
→ WHAT operation requests a change

Permission & Authorization Model
→ WHO may request that operation

Risk / Autonomy / Approval
→ HOW independently it may execute
```

---

# 127. North Star

MGBOS permission architecture succeeds when the system can answer:

```text
Who is this actor?

Which organization are they operating in?

Are they human or service?

Which capability are they requesting?

Do they actually have it?

Does this specific action need approval?

Who approved it?

Is the business action itself valid?

Which authoritative command executed it?

Can authority be revoked without breaking the system?
```

without answering:

```text
"Well... the process had the service key."
```

---

# 128. Final Principle

> **Authority must be explicit, bounded, revocable, and independent from intelligence.**

MGBOS should make delegation easier as the organization grows, while making accidental authority expansion progressively harder.
