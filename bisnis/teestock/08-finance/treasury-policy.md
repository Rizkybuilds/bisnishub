---
title: "TeeStock Treasury Policy"
date: "2026-09-28"
bisnis: teestock
kategori: keuangan
status: active
tags:
  - bisnis/teestock
  - kategori/keuangan
  - teestock/canonical
  - teestock/finance
document_id: "TS-FIN-005"
version: "1.0"
category: "finance"
business: "teestock"
last_updated: "2026-09-28"
path: "08-finance/treasury-policy.md"
depends_on:
  - "TS-FIN-001"
  - "TS-FIN-002"
  - "TS-FIN-003"
  - "TS-FIN-004"
  - "TS-OPS-002"
  - "TS-OPS-005"
  - "TS-OPS-008"
  - "TS-PRG-001"
---


# TeeStock Treasury Policy v1.0

> [!important] **Canonical TeeStock Cash, Liquidity, Payment & Financial Control Framework  **
> Dokumen ini mendefinisikan cash ownership, bank-account architecture, collections, customer deposits, accounts receivable, supplier payments, payables, participant payouts, payment authority, reserve policy, liquidity management, cash forecasting, CapEx funding, fraud controls, treasury reconciliation, dan progressive automation untuk TeeStock.
>
> [!info] **Dependencies & Data Flow (SSOT)**
> [[bisnis/teestock/08-finance/financial-model|TS-FIN-001: TeeStock Financial Model]] • [[bisnis/teestock/08-finance/unit-economics|TS-FIN-002: TeeStock Unit Economics]] • [[bisnis/teestock/08-finance/pricing-framework|TS-FIN-003: TeeStock Pricing Framework]] • [[bisnis/teestock/08-finance/cost-accounting|TS-FIN-004: TeeStock Cost Accounting]] • [[bisnis/teestock/07-operations/sourcing-and-vendors|TS-OPS-002: TeeStock Sourcing & Vendors]] • [[bisnis/teestock/07-operations/inventory-system|TS-OPS-005: TeeStock Inventory System]] • [[bisnis/teestock/07-operations/returns-and-warranty|TS-OPS-008: TeeStock Returns & Warranty System]] • [[bisnis/teestock/06-programs/programs-overview|TS-PRG-001: TeeStock Programs Overview]]


---

# 1. Purpose

Treasury Policy menjawab:

> **Bagaimana TeeStock memastikan uang tersedia saat dibutuhkan, tidak terpakai tanpa kontrol, seluruh kewajiban dapat dibayar tepat waktu, dan pertumbuhan tidak menciptakan krisis likuiditas?**

Canonical principle:

> **Profit creates value. Liquidity keeps the business alive.**

---

# 2. Canonical Definition

> **TeeStock Treasury adalah control system yang mengelola cash inflows, cash outflows, bank balances, payment obligations, collections, reserves, liquidity forecasts, financial authority, dan cash risk sehingga TeeStock dapat memenuhi kewajiban, mendanai operasi, serta mengalokasikan modal dengan aman dan terukur.**

---

# 3. Treasury Is Not Accounting

Critical distinction:

```text
ACCOUNTING
explains what happened economically.

TREASURY
ensures cash is available, controlled, and moved correctly.
```

---

# 4. Core Treasury Questions

TeeStock harus selalu mampu menjawab:

```text
HOW MUCH CASH DO WE HAVE?

WHERE IS IT?

HOW MUCH IS ACTUALLY AVAILABLE?

WHAT MONEY IS RESTRICTED / COMMITTED?

WHAT MUST BE PAID?

WHEN MUST IT BE PAID?

WHO OWES US MONEY?

WHEN WILL CASH ARRIVE?

HOW MUCH CASH CAN WE SAFELY INVEST?

WHAT HAPPENS IF SALES DROP?
```

---

# 5. Cash Is a Controlled Asset

Canonical:

> **Company cash is business property, not founder spending balance.**

Personal and business money should remain operationally separated.

---

# 6. Cash Architecture

Recommended conceptual structure:

```text
TEEStock CASH
├── Operating Cash
├── Reserve Cash
├── Tax / Statutory Cash
└── Investment / CapEx Cash
```

Actual bank-account implementation can mature gradually.

---

# 7. Operating Cash

Used for normal:

```text
SUPPLIERS
PARTNERS
PAYROLL
SOFTWARE
LOGISTICS
OPERATING EXPENSE
```

---

# 8. Reserve Cash

Held to absorb:

```text
SALES VOLATILITY
SUPPLIER DISRUPTION
REFUNDS
EMERGENCY OPERATIONS
```

---

# 9. Tax / Statutory Cash

Amounts expected to be paid for tax/statutory obligations should not be treated as discretionary operating cash.

Exact treatment requires applicable tax/accounting policy.

---

# 10. Investment / CapEx Cash

Allocated for approved:

```text
MACHINERY
INFRASTRUCTURE
TECHNOLOGY
EXPANSION
```

---

# 11. One Cash Balance Is Not One Available Balance

Canonical:

```text
BANK BALANCE
-
RESTRICTED / RESERVED CASH
-
NEAR-TERM COMMITTED OBLIGATIONS
=
OPERATING LIQUIDITY
```

---

# 12. Available Cash

Management should distinguish:

```text
TOTAL CASH
vs
AVAILABLE CASH
```

---

# 13. Cash Ownership

Every bank/payment account must have clear legal/business ownership.

---

# 14. Business vs Personal Accounts

Canonical:

```text
BUSINESS REVENUE
→
BUSINESS ACCOUNT
```

Avoid routine use of personal accounts once business infrastructure permits proper separation.

---

# 15. Bank Account Registry

Treasury should maintain canonical registry:

```text
Account ID
Institution
Account Type
Currency
Business Owner
Purpose
Authorized Users
Status
```

---

# 16. Payment Channel Registry

Also track:

```text
BANK
PAYMENT GATEWAY
MARKETPLACE WALLET
E-WALLET
OTHER SETTLEMENT ACCOUNT
```

---

# 17. Cash Location

MGBOS should know where cash sits:

```text
BANK
PAYMENT GATEWAY
MARKETPLACE
PETTY CASH
```

---

# 18. Settlement Cash

Marketplace/payment gateway balances are not identical to settled bank cash.

---

# 19. Settlement Pipeline

Canonical:

```text
CUSTOMER PAYMENT
↓
PAYMENT PROVIDER
↓
SETTLEMENT
↓
BANK
```

---

# 20. Settlement Reconciliation

Treasury must compare:

```text
EXPECTED SETTLEMENT
vs
ACTUAL SETTLEMENT
```

---

# 21. Settlement Deductions

Potential:

```text
TRANSACTION FEES
REFUNDS
MARKETPLACE FEES
PROMOTION COST
WITHHOLDINGS
```

---

# 22. Collections

Collections is the process of turning receivables into cash.

---

# 23. Commerce Collections

Usually:

```text
PAYMENT BEFORE FULFILLMENT
```

for standard consumer orders.

---

# 24. Custom / Business Collections

Potential:

```text
DEPOSIT
MILESTONE PAYMENT
FINAL PAYMENT
CREDIT TERMS
```

depending account.

---

# 25. Deposit Policy

Deposit should reflect:

```text
IRREVERSIBLE COST
MATERIAL COMMITMENT
CAPACITY COMMITMENT
CUSTOMIZATION RISK
```

---

# 26. Deposit Is Risk Control

Not simply revenue acceleration.

---

# 27. Deposit Application

Deposit should link to:

```text
QUOTE
ORDER / PROJECT
CUSTOMER
PAYMENT
```

---

# 28. Deposit Balance

System should know:

```text
DEPOSIT RECEIVED
APPLIED
REMAINING
REFUNDABLE / NON-REFUNDABLE STATUS
```

according to agreement.

---

# 29. Credit Sales

Canonical:

> **Giving credit means TeeStock temporarily finances the customer.**

---

# 30. Credit Must Be Approved

No informal:

> “bayar belakangan aja.”

for material exposure.

---

# 31. Credit Eligibility

Potential:

```text
CUSTOMER HISTORY
BUSINESS CREDIBILITY
PAYMENT HISTORY
ORDER SIZE
MARGIN
RELATIONSHIP
```

---

# 32. Credit Limit

Each credit-approved account may have:

```text
MAX OUTSTANDING EXPOSURE
```

---

# 33. Credit Terms

Examples conceptually:

```text
DUE ON RECEIPT
NET 7
NET 14
NET 30
```

Only use terms TeeStock can financially support.

---

# 34. Credit Exposure

Canonical:

```text
UNPAID INVOICES
+
UNBILLED COMMITTED EXPOSURE
=
TOTAL CUSTOMER EXPOSURE
```

---

# 35. Credit Limit Check

Before accepting new credit order:

```text
CURRENT EXPOSURE
+
NEW ORDER
<=
APPROVED LIMIT
```

unless exception approved.

---

# 36. Aging Receivables

Recommended buckets:

```text
CURRENT
1–30 OVERDUE
31–60
61–90
90+
```

Exact reporting can evolve.

---

# 37. Collection Priority

Prioritize:

```text
LARGE VALUE
OLD BALANCE
HIGH RISK
CUSTOMER DEPENDENCY
```

---

# 38. Collection Workflow

Canonical:

```text
INVOICE ISSUED
↓
DUE SOON REMINDER
↓
DUE
↓
OVERDUE
↓
COLLECTION ACTION
↓
ESCALATION
```

---

# 39. Overdue Customer

Potential controls:

```text
NEW ORDER HOLD
CREDIT SUSPENSION
MANAGEMENT REVIEW
```

depending severity.

---

# 40. Bad Debt

Receivable deemed uncollectible must not remain forever as pretend asset.

Write-off requires appropriate evidence and approval.

---

# 41. Payables

Treasury should know all upcoming obligations.

---

# 42. Payable Sources

Potential:

```text
SUPPLIER INVOICE
PARTNER INVOICE
SOFTWARE
PAYROLL
RENT
TAX
CREATOR PAYOUT
AFFILIATE PAYOUT
REFUND
```

---

# 43. Payable Record

Minimum:

```text
Payable ID
Payee
Source
Amount
Due Date
Status
Payment Method
```

---

# 44. Payment Calendar

MGBOS should eventually provide:

```text
TODAY
THIS WEEK
NEXT 30 DAYS
```

obligations.

---

# 45. Pay at the Right Time

Canonical:

> **Do not pay unnecessarily early. Do not pay irresponsibly late.**

---

# 46. Supplier Payment

Should consider:

```text
DUE DATE
CASH POSITION
EARLY PAYMENT BENEFIT
SUPPLIER RELATIONSHIP
```

---

# 47. Early Payment Discount

Use when:

```text
DISCOUNT VALUE
>
VALUE OF HOLDING CASH
```

and liquidity remains safe.

---

# 48. Late Payment Cost

Can include:

```text
LATE FEE
SUPPLY INTERRUPTION
TRUST DAMAGE
LOSS OF CREDIT TERMS
```

---

# 49. Critical Suppliers

Certain supplier payments may receive higher priority because interruption threatens operations.

---

# 50. Payable Prioritization

Potential hierarchy:

```text
STATUTORY / CRITICAL
↓
PAYROLL / PEOPLE
↓
CRITICAL SUPPLY
↓
CONTRACTUAL DUE
↓
DISCRETIONARY
```

subject to actual obligations.

---

# 51. Participant Payouts

Creator/Affiliate payouts must follow validated ledger.

---

# 52. Payout Eligibility

Canonical:

```text
EARNING VALIDATED
+
RETURN / FRAUD HOLD CLEARED
+
MINIMUM CONDITIONS MET
=
PAYABLE
```

---

# 53. Payout Schedule

Can be:

```text
WEEKLY
BIWEEKLY
MONTHLY
```

depending program economics.

Keep predictable.

---

# 54. Do Not Pay from Spreadsheet Guess

Payout should reconcile:

```text
TRANSACTION
→ EARNING
→ PAYOUT
```

---

# 55. Payout Liability

Unpaid validated earnings remain obligation.

---

# 56. Customer Refunds

Refunds deserve high operational priority after approval.

---

# 57. Refund Cash Planning

High return period/campaign can create unexpected cash outflow.

Reserve accordingly.

---

# 58. Refund Queue

Track:

```text
APPROVED
PROCESSING
FAILED
COMPLETED
```

---

# 59. Payment Authority

Canonical:

> **No material cash movement without defined authority.**

---

# 60. Authority Dimensions

Can depend on:

```text
AMOUNT
TRANSACTION TYPE
PAYEE
RISK
BUDGET STATUS
```

---

# 61. Approval Matrix

Conceptually:

```text
LOW VALUE
authorized operator

MEDIUM VALUE
manager

HIGH VALUE
founder / leadership
```

Exact thresholds belong in [[bisnis/teestock/13-metrics-experiments/decision-thresholds|decision-thresholds.md]].

---

# 62. Request vs Approval vs Execution

Canonical controls:

```text
REQUEST
↓
APPROVE
↓
EXECUTE
↓
RECONCILE
```

---

# 63. Small-Team Reality

Founder may perform multiple steps initially.

Still preserve system records for each logical action.

---

# 64. Maker-Checker

As team grows:

```text
ONE PERSON CREATES
ANOTHER APPROVES
```

for material payments.

---

# 65. Dual Approval

May be required later for:

```text
LARGE PAYMENTS
NEW BENEFICIARY
BANK DETAIL CHANGE
```

---

# 66. New Beneficiary Risk

High fraud risk.

Require verification before first payment.

---

# 67. Bank Detail Change

Canonical:

> **Never trust payment-detail changes solely from an email/chat message.**

Use independent verification for material payments.

---

# 68. Supplier Bank Verification

Potential:

```text
KNOWN CONTACT
CONTRACT / INVOICE
SECONDARY VERIFICATION
```

---

# 69. Payment Fraud Risks

Potential:

```text
FAKE INVOICE
ACCOUNT TAKEOVER
SUPPLIER IMPERSONATION
PAYMENT REDIRECTION
DUPLICATE PAYMENT
```

---

# 70. Duplicate Payment Control

System should detect:

```text
SAME PAYEE
SAME INVOICE
SAME AMOUNT
```

where possible.

---

# 71. Invoice Authenticity

Payment should reconcile to valid source.

---

# 72. Three-Way Match

For procurement:

```text
PURCHASE ORDER
+
GOODS RECEIPT
+
SUPPLIER INVOICE
```

before payment where applicable.

---

# 73. Service/Partner Match

Potential:

```text
WORK ORDER
+
COMPLETION / ACCEPTANCE
+
INVOICE
```

---

# 74. Payment Exception

Mismatch creates hold.

---

# 75. Urgent Payment

Urgency must not bypass verification.

---

# 76. Petty Cash

If used:

keep:

```text
LIMITED
RECORDED
RECONCILED
```

---

# 77. Cash Payments

Prefer traceable digital/business payment where practical.

---

# 78. Cash Withdrawal

Should have:

```text
PURPOSE
AMOUNT
OWNER
RECONCILIATION
```

---

# 79. Employee Reimbursement

Requires:

```text
BUSINESS PURPOSE
RECEIPT / EVIDENCE
APPROVAL
```

where required.

---

# 80. Expense Advance

Advance should be reconciled after activity.

---

# 81. Corporate Card

Future:

assign:

```text
OWNER
LIMIT
PURPOSE
```

---

# 82. Subscription Control

Recurring software charges should be registered.

---

# 83. Subscription Registry

Track:

```text
SERVICE
OWNER
AMOUNT
BILLING CYCLE
RENEWAL DATE
PAYMENT ACCOUNT
```

---

# 84. Zombie Subscriptions

Periodically eliminate unused recurring expenses.

---

# 85. Reserve Policy

TeeStock should build liquidity reserve as scale grows.

---

# 86. Reserve Objective

Protect against:

```text
SALES DOWNTURN
SUPPLY INTERRUPTION
REFUND SPIKE
OPERATIONAL INCIDENT
```

---

# 87. Reserve Target

Should eventually be expressed as:

```text
MONTHS / WEEKS OF CORE OPERATING OUTFLOW
```

Exact threshold should come from real cost structure.

---

# 88. Early-Stage Reserve

Even before ideal reserve exists:

maintain explicit visibility of how thin liquidity is.

---

# 89. Reserve Is Not Idle Money

It purchases:

```text
RESILIENCE
NEGOTIATING POWER
DECISION TIME
```

---

# 90. Reserve Use

Should require material event/approved reason.

---

# 91. Reserve Replenishment

After draw:

create plan to restore reserve.

---

# 92. Liquidity

Canonical:

> **Liquidity is TeeStock's ability to meet obligations when they become due.**

---

# 93. Liquidity View

At minimum:

```text
AVAILABLE CASH
+
NEAR-TERM RELIABLE COLLECTIONS
-
NEAR-TERM OBLIGATIONS
```

---

# 94. Do Not Count Uncertain Revenue

Pipeline ≠ cash.

---

# 95. Do Not Count Unsold Inventory as Cash

Inventory may eventually convert to cash.

It is not current liquidity.

---

# 96. Liquidity Buffer

Maintain headroom above immediate obligations.

---

# 97. Liquidity Thresholds

Potential statuses:

```text
HEALTHY
WATCH
TIGHT
CRITICAL
```

Exact numbers belong in Decision Thresholds.

---

# 98. Watch State

Could trigger:

```text
SPEND REVIEW
PO DELAY
COLLECTION FOCUS
HIRING PAUSE
```

---

# 99. Critical State

Could trigger:

```text
NONESSENTIAL SPEND FREEZE
FOUNDER REVIEW
CAPITAL ACTION
PAYMENT PRIORITIZATION
```

---

# 100. Cash Forecast

Canonical:

```text
OPENING CASH
+
EXPECTED INFLOWS
-
EXPECTED OUTFLOWS
=
FORECAST ENDING CASH
```

---

# 101. Rolling Forecast

Recommended mature horizon:

```text
13 WEEKS
```

---

# 102. Why 13 Weeks

Enough to see:

```text
PAYROLL
SUPPLIERS
INVENTORY
CAMPAIGNS
CAPEX
COLLECTIONS
```

while remaining operationally actionable.

---

# 103. Forecast Granularity

Near weeks:

```text
DETAILED
```

Far weeks:

```text
MORE AGGREGATED
```

---

# 104. Forecast Inflows

Potential:

```text
EXPECTED SETTLEMENT
AR COLLECTION
CUSTOMER DEPOSIT
OTHER APPROVED CASH IN
```

---

# 105. Forecast Outflows

Potential:

```text
SUPPLIERS
PARTNERS
PAYROLL
SOFTWARE
MARKETING
REFUNDS
PAYOUTS
CAPEX
TAX
```

---

# 106. Forecast Confidence

Classify:

```text
CONFIRMED
HIGH CONFIDENCE
ESTIMATED
```

where useful.

---

# 107. Forecast vs Actual

Every cycle:

```text
FORECAST
vs
ACTUAL
```

to improve prediction.

---

# 108. Forecast Variance

Potential:

```text
COLLECTION LATE
SALES MISS
UNPLANNED PURCHASE
REFUND SPIKE
CAPEX
```

---

# 109. Cash Scenario Planning

Recommended:

```text
BASE
DOWNSIDE
STRESS
```

---

# 110. Downside Scenario

Can assume:

```text
LOWER SALES
SLOWER COLLECTIONS
HIGHER RETURNS
```

---

# 111. Stress Scenario

Answers:

> How long can TeeStock operate if meaningful disruption occurs?

---

# 112. Cash Runway

When net burn exists:

```text
AVAILABLE CASH
/
NET CASH BURN
```

as directional metric.

---

# 113. Burn Rate

Separate:

```text
OPERATING BURN
GROWTH INVESTMENT
CAPEX
INVENTORY BUILD
```

---

# 114. Growth Can Create Cash Burn

Even profitable growth can consume cash through:

```text
INVENTORY
RECEIVABLES
CAPACITY
```

---

# 115. Inventory Purchase Control

Large inventory buy is treasury decision as well as sourcing decision.

---

# 116. Inventory Buy Gate

Consider:

```text
DEMAND EVIDENCE
AVAILABLE CASH
RESERVE IMPACT
PAYBACK
STOCK RISK
```

---

# 117. Purchase Commitment

PO consumes future liquidity before payment occurs.

---

# 118. Committed Cash

Treasury should include:

```text
OPEN PURCHASE ORDERS
APPROVED WORK ORDERS
CONTRACTUAL OBLIGATIONS
```

in future cash view.

---

# 119. CapEx

Large asset spending requires treasury review.

---

# 120. CapEx Funding Questions

```text
HOW MUCH CASH?

WHEN PAID?

WHAT RESERVE REMAINS?

WHAT WORKING CAPITAL IS NEEDED AFTER PURCHASE?

WHEN DOES PAYBACK START?
```

---

# 121. CapEx Price Is Not Total Cash Requirement

New machine may also need:

```text
INSTALLATION
SPACE
POWER
MATERIAL
LABOR
MAINTENANCE
```

---

# 122. CapEx Approval

Requires:

```text
BUSINESS CASE
CASH CAPACITY
APPROVAL
```

---

# 123. Staged CapEx

Prefer milestones/pilots where possible.

---

# 124. Debt

If future borrowing is used:

track:

```text
PRINCIPAL
INTEREST
MATURITY
COVENANTS
PAYMENT SCHEDULE
```

---

# 125. Debt Is Not Revenue

Canonical.

---

# 126. Debt Capacity

Borrowing should reflect ability to service debt under downside scenarios.

---

# 127. Owner Capital

Founder injection should be recorded as:

```text
EQUITY / OWNER FUNDING
or
LOAN
```

according to legal/accounting form.

---

# 128. Owner Withdrawal

Must remain clearly recorded.

Do not mix personal withdrawal with operating expenses.

---

# 129. Dividend / Distribution

Only after:

```text
CASH CAPACITY
OBLIGATIONS
RESERVE
```

are considered and legal/accounting requirements are met.

---

# 130. Treasury and Pricing

Long credit terms or high cash exposure can justify pricing differences.

---

# 131. Treasury and Sales

Sales should not offer:

```text
CREDIT
DEPOSIT WAIVER
LONG PAYMENT TERM
```

outside approved authority.

---

# 132. Treasury and Procurement

Procurement should not commit major cash without liquidity visibility.

---

# 133. Treasury and Marketing

Large campaign budgets require cash allocation before launch.

---

# 134. Treasury and Originals

Collection launch must budget:

```text
SAMPLES
INVENTORY
CREATIVE
MARKETING
FULFILLMENT
```

without threatening core liquidity.

---

# 135. Treasury and Programs

Creator/affiliate payouts are obligations, not optional marketing expenses after validation.

---

# 136. Treasury and Returns

Return/refund rates affect cash reserve requirements.

---

# 137. Treasury and Payroll

Payroll is predictable high-priority obligation.

---

# 138. Treasury and Taxes

Tax/statutory obligations require dedicated visibility and professional compliance.

---

# 139. Treasury Calendar

Potential:

```text
DAILY
Cash position

WEEKLY
Collections + payments + forecast

MONTHLY
Reserve + working capital + reconciliation

QUARTERLY
Capital allocation
```

---

# 140. Daily Cash Position

Should know:

```text
BANK
PAYMENT PROVIDER
IMMEDIATE PAYMENTS
```

---

# 141. Weekly Treasury Review

Focus:

```text
13-WEEK CASH
AR
AP
LARGE PAYMENTS
INVENTORY COMMITMENTS
REFUNDS
```

---

# 142. Monthly Treasury Review

Focus:

```text
LIQUIDITY
RESERVE
WORKING CAPITAL
CASH CONVERSION
CAPEX
```

---

# 143. Treasury Reconciliation

All cash accounts should be periodically reconciled.

---

# 144. Bank Reconciliation

Canonical:

```text
SYSTEM BALANCE
vs
BANK BALANCE
```

---

# 145. Payment Gateway Reconciliation

```text
EXPECTED TRANSACTIONS
vs
SETTLED AMOUNTS
```

---

# 146. Marketplace Reconciliation

Should identify:

```text
SALES
FEES
REFUNDS
WITHHOLDINGS
SETTLEMENT
```

---

# 147. Cash Difference

Any unexplained difference is exception.

---

# 148. Treasury Exception Types

Potential:

```text
UNKNOWN CASH MOVEMENT
DUPLICATE PAYMENT
FAILED PAYMENT
LATE COLLECTION
LOW LIQUIDITY
UNEXPECTED FEE
SETTLEMENT MISMATCH
```

---

# 149. Exception Queue

Future MGBOS:

```text
NEEDS RECONCILIATION
NEEDS APPROVAL
NEEDS COLLECTION
NEEDS PAYMENT
NEEDS INVESTIGATION
```

---

# 150. Fraud Controls

Treasury should be designed on assumption that mistakes and fraud can happen.

---

# 151. Least Privilege

Users get only financial access needed for role.

---

# 152. Bank Access

Separate:

```text
VIEW
CREATE PAYMENT
APPROVE
```

where banking supports it.

---

# 153. Credential Control

Financial credentials should not be shared casually.

---

# 154. MFA

Use strong authentication on bank/payment systems.

---

# 155. Offboarding

Immediately revoke financial access when role ends.

---

# 156. Payment Evidence

Store appropriate:

```text
BANK REFERENCE
PAYMENT RECEIPT
TRANSACTION ID
```

---

# 157. Duplicate Invoice

System should prevent payment of same invoice twice.

---

# 158. Invoice Number Reuse

Flag suspicious duplicates.

---

# 159. Beneficiary Whitelist

Future treasury can maintain approved beneficiaries.

---

# 160. New Beneficiary Approval

High-risk action requiring verification.

---

# 161. Payment Batch

At scale, routine payments may be grouped into scheduled batches.

---

# 162. Payment Batch Benefits

```text
BETTER CONTROL
FEWER INTERRUPTIONS
EASIER APPROVAL
```

---

# 163. Emergency Payments

Separate flow for genuinely urgent situations.

---

# 164. Emergency Does Not Mean Uncontrolled

Still require minimum verification.

---

# 165. Treasury Data Model

Core entities:

```text
CASH ACCOUNT
CASH TRANSACTION
PAYMENT
COLLECTION
PAYABLE
RECEIVABLE
SETTLEMENT
PAYOUT
REFUND
CASH FORECAST
RESERVE
APPROVAL
```

---

# 166. Cash Account Entity

Represents money location.

---

# 167. Cash Transaction Entity

Represents actual movement.

---

# 168. Payment Entity

Outgoing business payment.

---

# 169. Collection Entity

Incoming expected/received customer payment.

---

# 170. Settlement Entity

Aggregated transfer from payment provider/channel.

---

# 171. Reserve Entity

Represents internally protected liquidity allocation.

---

# 172. Cash Forecast Entity

Stores expected future cash movement.

---

# 173. Approval Entity

Records authorization.

---

# 174. Treasury Data Lineage

Canonical:

```text
BUSINESS EVENT
↓
PAYABLE / RECEIVABLE
↓
APPROVAL
↓
CASH TRANSACTION
↓
RECONCILIATION
↓
FINANCIAL REPORT
```

---

# 175. Treasury Events

Potential:

```text
payment.requested
payment.approved
payment.completed
collection.received
invoice.overdue
settlement.received
cash_forecast.updated
liquidity.threshold_breached
```

---

# 176. MGBOS Treasury Dashboard

Potential:

```text
AVAILABLE CASH
RESERVE
AR DUE
AP DUE
THIS WEEK NET CASH
13-WEEK LOW POINT
OVERDUE AR
LARGE COMMITMENTS
```

---

# 177. Cash Waterfall

Useful future visualization:

```text
OPENING CASH
+ COLLECTIONS
- PROCUREMENT
- OPEX
- REFUNDS
- PAYOUTS
- CAPEX
=
ENDING CASH
```

---

# 178. Liquidity Forecast

MGBOS should identify future:

```text
CASH LOW POINT
```

not only current cash.

---

# 179. Automation Opportunities

Potential:

```text
Payment Reminders
Receivable Aging
Payable Calendar
Settlement Reconciliation
Payout Scheduling
Cash Forecast
Liquidity Alerts
```

---

# 180. Automatic Collection Reminder

Safe deterministic workflow.

---

# 181. Automatic Payable Reminder

Safe.

---

# 182. Payment Automation

Execution requires stricter controls than reminders.

---

# 183. Auto-Payout

Can become safe after:

```text
VALIDATED EARNING
+
APPROVED PAYOUT BATCH
+
FRAUD / RETURN CONDITIONS CLEARED
```

---

# 184. Automatic Payment

Only for:

```text
LOW-RISK
PREDICTABLE
PREAPPROVED
```

obligations with limits.

---

# 185. Cash Forecast Automation

Can pull from:

```text
AR
AP
OPEN PO
PAYROLL
SUBSCRIPTIONS
FORECAST SALES
```

---

# 186. AI Role

AI may assist with:

```text
Cash Forecast Explanation
Collection Prioritization
Payment Schedule Summary
Liquidity Risk Analysis
Scenario Modeling
```

---

# 187. AI Treasury Boundary

AI should not independently:

```text
MOVE LARGE CASH
CHANGE BENEFICIARY
GRANT CREDIT
APPROVE CAPEX
WRITE OFF RECEIVABLE
```

without deterministic authority.

---

# 188. AI Cash Narrative

Example future output:

> Cash remains sufficient today, but projected minimum balance falls below reserve target in week 6 due to inventory purchases and delayed B2B collections.

---

# 189. AI Collection Support

Can prioritize receivables by:

```text
VALUE
AGE
RISK
HISTORY
```

and draft reminders.

---

# 190. AI Payment Prioritization

May recommend tradeoffs.

Final decision remains governed by policy.

---

# 191. Treasury Maturity Model

```text
LEVEL 0
Founder checks bank balance

LEVEL 1
Cash ledger + payable calendar

LEVEL 2
AR/AP + authority + reserve

LEVEL 3
13-week forecast + reconciliation

LEVEL 4
Integrated treasury automation

LEVEL 5
AI-assisted exception-based liquidity management
```

---

# 192. Level 0

Anti-goal:

> “Masih ada saldo, berarti aman.”

---

# 193. Level 1

Minimum:

```text
BANK BALANCE
PAYMENTS DUE
COLLECTIONS
```

---

# 194. Level 2

Adds:

```text
AR
AP
APPROVAL
RESERVE
PAYOUT LIABILITY
```

---

# 195. Level 3

Adds:

```text
13-WEEK FORECAST
SETTLEMENT RECONCILIATION
WORKING CAPITAL
```

---

# 196. Level 4

Adds:

```text
AUTOMATED REMINDERS
PAYOUT BATCHES
CASH ALERTS
INTEGRATED COMMITMENTS
```

---

# 197. Level 5

System manages normal treasury workflows and escalates:

```text
LIQUIDITY RISK
LARGE PAYMENT
FRAUD SIGNAL
CASH FORECAST BREACH
```

---

# 198. Current Recommended Stage

TeeStock should target:

```text
LEVEL 1
→
LEVEL 2
```

first.

---

# 199. V1 Required Treasury Truth

Priority:

```text
CASH ACCOUNTS
AR
AP
CUSTOMER DEPOSITS
REFUNDS
PAYOUTS
PAYMENT APPROVAL
```

---

# 200. V1 Weekly Cash View

At minimum:

```text
CURRENT CASH
+
EXPECTED COLLECTION
-
PAYMENTS DUE
=
SHORT-TERM CASH OUTLOOK
```

---

# 201. V1 Bank Structure

Keep simple:

```text
PRIMARY OPERATING ACCOUNT
+
RESERVE / TAX SEPARATION
```

as business maturity allows.

Avoid unnecessary account complexity.

---

# 202. V1 Credit

Default:

```text
PREPAID
```

for most customers.

Grant credit selectively.

---

# 203. V1 Deposits

Use for Custom/Business where TeeStock commits material or production before delivery.

---

# 204. V1 Payables

Maintain due-date calendar.

---

# 205. V1 Program Payouts

Prefer scheduled batch payouts rather than ad hoc individual transfers.

---

# 206. V1 Reserve

Begin explicit reserve tracking even if target is not yet fully funded.

---

# 207. V1 Avoid

Do not immediately build:

```text
complex treasury management system
automated large payments
advanced FX hedging
multiple unnecessary bank accounts
AI-controlled fund movement
```

---

# 208. V2 Expansion

Possible:

```text
13-WEEK CASH FORECAST
CREDIT LIMIT
AUTOMATED COLLECTION REMINDERS
PAYMENT BATCHING
SETTLEMENT RECONCILIATION
```

---

# 209. V3 Expansion

Possible:

```text
MULTI-ACCOUNT TREASURY
CAPEX FORECAST
WORKING-CAPITAL OPTIMIZATION
PAYOUT AUTOMATION
```

---

# 210. V4 Expansion

Possible:

```text
PREDICTIVE LIQUIDITY
DYNAMIC RESERVE
AUTOMATED LOW-RISK PAYMENTS
AI CASH SCENARIOS
```

---

# 211. Payment Gate

Before payment:

```text
VALID BUSINESS PURPOSE
+
SOURCE DOCUMENT
+
APPROPRIATE APPROVAL
+
BENEFICIARY VERIFIED
```

---

# 212. Credit Gate

Before granting credit:

```text
CUSTOMER APPROVED
+
LIMIT DEFINED
+
TERMS DEFINED
+
CASH IMPACT ACCEPTABLE
```

---

# 213. Inventory Commitment Gate

Before material buy:

```text
DEMAND EVIDENCE
+
LIQUIDITY
+
RESERVE IMPACT
+
APPROVAL
```

---

# 214. CapEx Gate

Before major investment:

```text
BUSINESS CASE
+
CASH FORECAST
+
RESERVE AFTER PURCHASE
+
APPROVAL
```

---

# 215. Reserve Draw Gate

Use reserve only with:

```text
QUALIFYING NEED
+
AUTHORIZED DECISION
```

---

# 216. Payout Gate

Before participant payout:

```text
VALIDATED EARNING
+
PAYABLE STATUS
+
APPROVED BATCH
```

---

# 217. Refund Gate

Before cash refund:

```text
APPROVED RESOLUTION
+
CORRECT AMOUNT
+
ORIGINAL TRANSACTION LINK
```

---

# 218. Treasury Failure Modes

## Bank Balance = Free Cash

Ignores commitments.

## Personal and Business Cash Mixed

Destroys financial clarity.

## Credit Granted Casually

Creates hidden financing risk.

## Supplier Paid Without Source Document

Fraud/error risk.

## Paying Too Early

Consumes liquidity unnecessarily.

## Paying Too Late

Damages operations and trust.

## No Refund Reserve

Return spike creates cash shock.

## Payout from Spreadsheet

Participant liability errors.

## Large Inventory Buy Without Cash Forecast

Liquidity trap.

---

# 219. What Treasury Must Not Become

## Founder Wallet

Company money belongs to company operations.

## Approval Bureaucracy

Controls should be proportional to risk.

## Bank-Balance Dashboard Only

Future obligations matter.

## Cash Hoarding Without Strategy

Cash should protect and enable value creation.

## AI Autonomous Bank Manager

Movement of money requires strict authority.

---

# 220. Treasury Success Definition

Treasury succeeds when TeeStock can answer:

```text
HOW MUCH CASH
do we have?

HOW MUCH
is really available?

WHAT
must be paid?

WHEN
is it due?

WHO
owes us money?

WHEN
will it arrive?

WHAT
cash is reserved?

WHAT
future commitments exist?

WHAT IS OUR
lowest projected cash point?

CAN WE SAFELY
buy inventory, hire, or invest?

WHO
can move money?

WHY
was each payment made?
```

---

# 221. Canonical Treasury Summary

```text
COLLECTION
brings cash in.

PAYABLE
defines obligation.

PAYMENT
moves cash out.

RESERVE
protects resilience.

FORECAST
reveals future liquidity.

AUTHORITY
protects control.

RECONCILIATION
proves cash truth.

MGBOS
turns cash management into a controlled operating system.
```

---

# 222. Canonical Treasury Principles

```text
PROFIT CREATES VALUE. LIQUIDITY KEEPS THE BUSINESS ALIVE.

BUSINESS CASH IS NOT PERSONAL CASH.

BANK BALANCE IS NOT AVAILABLE CASH.

PIPELINE IS NOT CASH.

INVENTORY IS NOT CASH.

CREDIT IS CAPITAL ALLOCATION.

COMMITMENT BEFORE CASH OUT STILL MATTERS.

NO MATERIAL PAYMENT WITHOUT AUTHORITY.

VERIFY BENEFICIARY BEFORE PAYMENT.

PAY ON TIME, NOT JUST EARLY.

RESERVE BEFORE AGGRESSIVE EXPANSION.

FORECAST BEFORE COMMITMENT.

RECONCILE EVERY CASH SYSTEM.

AUTOMATE REMINDERS BEFORE AUTOMATING MONEY MOVEMENT.

AI MAY ADVISE. AUTHORITY MOVES CASH.
```

---

# 223. Dependency

Dokumen berikut harus follow Treasury Policy:

1. [[bisnis/teestock/09-marketing/go-to-market|go-to-market.md]]
2. [[bisnis/teestock/09-marketing/audience-segmentation|audience-segmentation.md]]
3. [[bisnis/teestock/09-marketing/content-engine|content-engine.md]]
4. [[bisnis/teestock/09-marketing/channel-strategy|channel-strategy.md]]
5. [[bisnis/teestock/09-marketing/retention-and-community|retention-and-community.md]]
6. [[bisnis/teestock/10-product-tech/automation-architecture|automation-architecture.md]]
7. [[bisnis/teestock/11-data-mgbos/canonical-data-model|canonical-data-model.md]]
8. [[bisnis/teestock/11-data-mgbos/event-model|event-model.md]]
9. [[bisnis/teestock/11-data-mgbos/mgbos-integration|mgbos-integration.md]]
10. [[bisnis/teestock/13-metrics-experiments/kpi-framework|kpi-framework.md]]
11. [[bisnis/teestock/13-metrics-experiments/decision-thresholds|decision-thresholds.md]]
12. [[bisnis/teestock/14-roadmap/master-roadmap|master-roadmap.md]]

TeeStock Treasury boleh berkembang menjadi automated, predictive, multi-account treasury system, tetapi automation hanya boleh dibangun setelah cash accounts, payment authority, AR/AP, participant payouts, reserve policy, reconciliations, dan forecasting sudah menjadi reliable financial truth.