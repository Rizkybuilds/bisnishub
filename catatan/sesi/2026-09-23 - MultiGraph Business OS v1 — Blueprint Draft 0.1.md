---
title: "MultiGraph Business OS v1 — Blueprint Draft 0.1"
date: "2026-09-23"
bisnis: multigraph
kategori: operasional
status: active
tags:
  - bisnis/multigraph
  - mgbos
  - blueprint
  - arsitektur
---

# MultiGraph Business OS v1 — Blueprint Draft 0.1

## 1. North Star

**MGBOS adalah sistem operasi bisnis terpusat untuk mengelola customer, transaksi, vendor, produksi, keuangan, automation, dan intelligence seluruh MultiGraph Group.**

Tujuan akhirnya:

> **Satu founder bisa melihat, memahami, dan mengendalikan beberapa unit bisnis dari satu sistem.**

Struktur bisnisnya:

```text
MULTIGRAPH GROUP
│
├── MultiGraph
│   General / Business Printing
│
├── TeeStock
│   Apparel / Garment / Textile
│
│   ├── Curated Design
│   ├── Blank Apparel
│   ├── Custom Atelier
│   ├── Creator Collab
│   └── Reseller / Dropship
│
├── NeoPack
│   Packaging
│
├── Pack Point
│   Packaging
│
├── Squeegee Studios
│   Screen Printing
│
└── Future Business Units
```

Tetapi secara operasional:

```text
             MULTIGRAPH BUSINESS OS
                       │
 ┌─────────────────────┼─────────────────────┐
 │                     │                     │
Customer             Order                 Vendor
CRM                  Engine                Network
 │                     │                     │
 ├─────────────────────┼─────────────────────┤
 │                     │                     │
Pricing             Production            Finance
 │                     │                     │
 ├─────────────────────┼─────────────────────┤
 │                     │                     │
Automation           Data                  AI
                       │
                Founder Command
                    Center
```

Ini berarti brand berbeda boleh memiliki website, positioning, produk, harga, dan customer experience berbeda.

Tetapi **mesin bisnis di belakangnya tetap satu**.

---

# 2. Prinsip arsitektur

Ada beberapa keputusan fundamental yang menurut saya harus kita jadikan “konstitusi” MGBOS.

|Prinsip|Implementasi|
|---|---|
|**Single Source of Truth**|Database inti adalah sumber fakta bisnis|
|**Multi-brand by design**|Hampir semua transaksi mengetahui berasal dari brand mana|
|**Customer-centric**|Customer tetap satu walaupun bertransaksi dengan beberapa brand|
|**Vendor-first architecture**|Vendor bukan sekadar supplier, tetapi bagian dari production network|
|**Asset-light first**|Sistem harus mendukung produksi outsourced sejak awal|
|**Rules before AI**|Logic deterministik dipakai ketika aturan bisa dinyatakan jelas|
|**AI as intelligence**|AI memahami, menganalisis, merangkum dan merekomendasikan|
|**Human authority**|Keputusan berisiko tinggi tetap memiliki approval|
|**API/event ready**|Sistem mudah dihubungkan dengan automation dan aplikasi lain|
|**Audit everything**|Tindakan manusia, automation maupun AI dapat ditelusuri|

Prinsip terakhir sangat penting.

Kita harus bisa mengetahui:

```text
WHO
melakukan

WHAT
terhadap

WHICH DATA

WHEN

FROM WHERE

WHY
```

Termasuk ketika tindakan berasal dari AI.

---

# 3. Struktur data organisasi

Kita perlu membedakan beberapa konsep sejak awal.

### Organization

```text
MultiGraph Group
```

Entitas tertinggi.

### Brand

Contohnya:

```text
TeeStock
MultiGraph
NeoPack
Pack Point
Squeegee Studios
```

### Business Model / Service Line

Contoh TeeStock:

```text
TEESTOCK
│
├── Curated Design
├── Blank Apparel
├── Custom Atelier
├── Creator Collab
└── Reseller / Dropship
```

Jadi setiap transaksi nantinya bisa mempunyai:

```text
organization_id
brand_id
business_line_id
channel_id
```

Contoh:

```text
Organization:
MultiGraph Group

Brand:
TeeStock

Business Line:
Custom Atelier

Channel:
Website

Order:
TS-2026-00142
```

Ini kelihatannya sederhana, tetapi keputusan ini akan sangat berguna ketika perusahaan membesar.

Lo nanti bisa bertanya:

> Berapa revenue MultiGraph Group?

atau:

> Berapa revenue TeeStock?

atau:

> Berapa margin Custom Atelier?

atau bahkan:

> Customer dari Instagram punya conversion rate berapa dibanding website?

Semua bisa dijawab dari struktur yang sama.

---

# 4. Core Business Domains

Saya melihat **9 domain inti** untuk MGBOS.

## A. Customer & CRM

Menyimpan seluruh relationship dengan customer.

```text
Customer
│
├── Profile
├── Contact
├── Company
├── Addresses
├── Leads
├── Conversations
├── Quotes
├── Orders
├── Payments
├── Complaints
└── Lifetime History
```

Satu customer bisa punya hubungan dengan beberapa brand.

Contoh:

```text
Customer: PT ABC

2026
└── TeeStock
    └── Custom uniform

2027
├── MultiGraph
│   └── Catalog printing
│
└── NeoPack
    └── Packaging
```

Jangan membuat customer baru untuk setiap brand.

Itulah yang nantinya memungkinkan **cross-selling intelligence**.

---

# 5. Lead → Order Engine

Ini akan menjadi jantung komersial MGBOS.

Canonical lifecycle-nya:

```text
NEW LEAD
   ↓
QUALIFICATION
   ↓
REQUIREMENT
   ↓
OPPORTUNITY
   ↓
QUOTATION
   ↓
NEGOTIATION
   ↓
ACCEPTED
   ↓
ORDER
   ↓
PAYMENT / DEPOSIT
   ↓
PRODUCTION
   ↓
QC
   ↓
FULFILLMENT
   ↓
COMPLETED
   ↓
AFTERSALES
   ↓
REPEAT / CROSS SELL
```

Dan ini berlaku ke hampir semua unit bisnis.

Yang berubah hanyalah detail produksinya.

Contoh TeeStock:

```text
50 custom t-shirts
↓
Garment selection
↓
Print method
↓
Artwork
↓
Vendor selection
↓
Production
```

MultiGraph:

```text
2,000 company brochures
↓
Paper
↓
Size
↓
Finishing
↓
Offset vendor
↓
Production
```

NeoPack:

```text
1,000 food boxes
↓
Material
↓
Dimension
↓
Print
↓
Lamination
↓
Diecut
↓
Production
```

Tetapi **order engine-nya tetap sama**.

Ini sangat penting untuk menghindari kita membangun software berbeda untuk setiap brand.

---

# 6. Product & Service Catalog

Jangan menganggap semua yang dijual sebagai SKU retail.

Printing mempunyai tiga tipe penawaran yang berbeda:

```text
STANDARD PRODUCT

Contoh:
Blank Tee Heavy Cotton Black XL
```

```text
CONFIGURABLE PRODUCT

Contoh:
Kaos
+ warna
+ ukuran
+ print area
+ print technique
```

```text
CUSTOM JOB

Contoh:
Buat packaging custom
berdasarkan ukuran, material,
quantity dan finishing tertentu.
```

Jadi catalog engine harus mendukung:

```text
Product
Service
Variant
Option
Attribute
Customization
Quantity tier
Production specification
```

Ini akan menjadi pondasi quotation engine.

---

# 7. Pricing Engine

Pricing jangan hanya berupa:

```text
cost × markup
```

Untuk printing, sebaiknya harga mempunyai struktur.

Contoh:

```text
BASE MATERIAL COST
+
PRINTING COST
+
FINISHING
+
PACKAGING
+
LOGISTICS
+
VENDOR COST
+
OPERATIONAL ALLOCATION
+
RISK BUFFER
=
TOTAL COST

TOTAL COST
+
TARGET MARGIN
=
SELLING PRICE
```

Kemudian business rules dapat menentukan:

```text
minimum margin
minimum order
quantity discount
customer tier
reseller price
campaign discount
creator commission
```

AI nantinya boleh **merekomendasikan harga**.

Tetapi pricing engine menentukan batas aman.

Contoh:

```text
Cost        Rp110.000
Floor price Rp145.000
Target      Rp165.000

AI recommendation:
Rp159.000

Reason:
High probability B2B conversion,
repeat customer,
quantity 100 pcs.
```

AI tidak boleh tiba-tiba menjual Rp120.000.

---

# 8. Vendor Network — salah satu modul terpenting

Karena strategi awal kita **asset-light**, menurut saya ini justru salah satu competitive advantage yang perlu dibangun serius.

Vendor bukan hanya:

```text
Vendor A
Phone
Address
```

Kita perlu mempunyai **Vendor Capability Graph**.

Contohnya:

```text
Vendor ABC
│
├── Capability
│   ├── DTF
│   ├── DTG
│   └── Embroidery
│
├── Material support
├── Minimum quantity
├── Pricing
├── Location
├── Lead time
├── Production capacity
├── Quality score
├── On-time score
├── Defect rate
├── Historical orders
└── Payment terms
```

Lama-kelamaan MGBOS mengetahui:

```text
Vendor A
Cheap
Quality medium
Fast

Vendor B
Expensive
Quality excellent
Slow

Vendor C
Medium price
High reliability
Fast
```

Sehingga routing produksi bisa semakin pintar.

---

# 9. Vendor Selection Engine

Nantinya sebuah job dapat dievaluasi seperti:

```text
Capability match      30%
Price                  20%
Quality                20%
Lead time              15%
Reliability            10%
Distance                5%
```

Kemudian menghasilkan:

```text
JOB TS-1084

Recommended vendors:

Vendor C
Score 91

Vendor B
Score 87

Vendor A
Score 72
```

Tetapi kita jangan mulai dari AI.

Awalnya bisa deterministic scoring.

AI kemudian membantu ketika requirement customer tidak terstruktur.

---

# 10. Production Operations

Setelah order diterima, order akan menghasilkan satu atau beberapa:

**Production Jobs.**

Contoh:

```text
ORDER
TS-00192

50 Hoodies
│
├── JOB 1
│   Garment supply
│   Vendor A
│
├── JOB 2
│   Screen printing
│   Squeegee Studios
│
└── JOB 3
    Packaging
    Vendor C
```

Ini penting karena satu order tidak selalu dikerjakan satu vendor.

Lifecycle job:

```text
Pending
↓
Assigned
↓
Accepted
↓
Production
↓
QC
↓
Ready
↓
Delivered
```

Dan setiap job mempunyai:

```text
deadline
cost
vendor
specification
files
status
notes
quality result
```

---

# 11. Quality Control

Untuk bisnis seperti ini, QC jangan menjadi notes bebas.

Kita perlu data.

Contoh:

```text
QC CHECK

Color accuracy      PASS
Print position      PASS
Size tolerance      PASS
Stitching           PASS
Packaging           FAIL

Result:
REWORK
```

Dengan begitu suatu hari kita bisa mengetahui:

> Vendor mana yang defect rate-nya paling tinggi?

> Jenis produksi apa yang sering menyebabkan complaint?

> Apakah vendor murah sebenarnya lebih mahal setelah menghitung rework?

Ini intelligence yang sangat berharga.

---

# 12. Finance Layer

V1 belum perlu menjadi software accounting lengkap.

Tetapi setiap transaksi uang harus mempunyai **financial event**.

Contoh:

```text
Quotation
Rp10.000.000

↓

Order confirmed

↓

Customer deposit
+Rp5.000.000

↓

Vendor DP
-Rp2.000.000

↓

Vendor balance
-Rp2.500.000

↓

Customer final payment
+Rp5.000.000
```

Maka MGBOS bisa mengetahui:

```text
Revenue
COGS
Gross Profit
Gross Margin
Outstanding Receivable
Outstanding Payable
Cash Collected
```

Per:

```text
Group
Brand
Business line
Order
Customer
Vendor
```

Ini jauh lebih berguna daripada hanya melihat omzet.

---

# 13. Event-Driven Architecture

Setiap perubahan penting menghasilkan **business event**.

Contohnya:

```text
lead.created
lead.qualified

quote.created
quote.sent
quote.accepted
quote.expired

order.created

payment.received

vendor.assigned

production.started
production.delayed

qc.failed
qc.passed

shipment.dispatched

order.completed

complaint.created
```

Kenapa ini penting?

Karena automation cukup mendengarkan event.

Contoh:

```text
quote.sent
     ↓
wait 2 days
     ↓
not accepted?
     ↓
send follow-up
```

Atau:

```text
production.delayed
       ↓
check deadline
       ↓
high risk?
       ↓
notify founder
```

Ini membuat automation tetap rapi walaupun bisnis semakin kompleks.

---

# 14. Automation Layer

Untuk sekarang, n8n bisa berfungsi sebagai **automation orchestration layer**.

Tetapi business state sebaiknya jangan hidup di n8n.

Artinya:

```text
DATABASE
=
business truth

MGBOS
=
business logic

n8n
=
workflow automation
```

Bukan:

```text
n8n workflow
=
database + logic + state + everything
```

Kalau seluruh logic terkunci di workflow automation, nanti sulit dipelihara.

---

# 15. AI Intelligence Layer

AI-nya saya bagi menjadi tiga tingkatan.

### Level 1 — Understand

AI membantu mengubah unstructured information menjadi structured data.

Customer WhatsApp:

> “Mas saya mau bikin kaos oversize sekitar 80 pcs hitam, mungkin pakai sablon depan belakang buat acara bulan depan.”

AI menghasilkan:

```text
Category: Apparel
Product: Oversized T-shirt
Quantity: ~80
Color: Black
Decoration: Front + Back
Deadline: Next month
Intent: Custom production
Missing:
- size breakdown
- artwork
- print dimensions
```

Ini **sangat berguna**.

### Level 2 — Recommend

AI:

> Recommended vendor: Vendor C.

> Recommended follow-up: tanyakan artwork dan size breakdown.

> Order memiliki risiko deadline sedang.

> Customer kemungkinan B2B/event order.

### Level 3 — Act

AI bisa melakukan:

```text
create task
draft quotation
send internal notification
generate purchase order
schedule follow-up
```

Tetapi untuk v1, tindakan sensitif harus memakai approval.

---

# 16. Authority Model

Ini saya ingin kita jadikan aturan permanen:

```text
DATABASE
= FACTS

RULE ENGINE
= POLICY

AUTOMATION
= EXECUTION

AI
= INTELLIGENCE

HUMAN
= AUTHORITY
```

Khususnya untuk:

```text
payment
refund
large discount
vendor commitment
purchase
price override
financial transfer
legal document
```

AI tidak menjalankannya secara bebas.

---

# 17. Founder Command Center

Ini akhirnya menjadi interface utama lo.

Bukan sekadar kumpulan grafik.

Saya membayangkan homepage MGBOS seperti:

```text
MULTIGRAPH GROUP
23 September 2026

TODAY

Revenue                 Rp8.4M
Gross Profit             Rp2.6M
Cash Collected           Rp6.1M

New Leads                    17
Quotes Sent                   8
Orders                         6

Production Active            23
At Risk                       3


NEEDS ATTENTION

TS-1092
Vendor deadline tomorrow
Production only 60% complete

MG-2031
Rp8.5M quotation
No response for 3 days

TS-1104
Payment overdue


AI BUSINESS BRIEF

• Lead volume increased this week.
• Custom Atelier conversion improved.
• Vendor ABC defect rate increased.
• Black XL stock approaching minimum.


RECOMMENDED ACTIONS

→ Follow up PT ABC
→ Contact Vendor ABC
→ Reassign TS-1092 if production does not move today
```

Dan kemudian lo bisa chat dengan bisnis lo sendiri:

> “Apa yang membutuhkan perhatian gue?”

> “Kenapa gross margin turun?”

> “Tampilkan semua quotation > Rp5 juta yang belum closing.”

> “Vendor mana yang paling reliable untuk DTF?”

> “Berapa profit Custom Atelier bulan ini?”

> “Customer mana yang layak ditawarkan packaging?”

Itulah yang nantinya membuat MGBOS benar-benar terasa **cerdas**.

---

# 18. Canonical Data Model

Secara kasar, pusat database kita nantinya akan mempunyai kelompok entity seperti berikut:

```text
ORGANIZATION
Brand
BusinessLine
Channel

IDENTITY
User
Role
Permission

CUSTOMER
Customer
Company
Contact
Address
Conversation

SALES
Lead
Opportunity
Requirement
Quote
QuoteItem

CATALOG
Product
Service
Variant
Option
PriceRule

ORDER
Order
OrderItem

VENDOR
Vendor
VendorCapability
VendorPrice
VendorScore

PRODUCTION
ProductionJob
JobSpecification
JobStatus
QCInspection

PROCUREMENT
PurchaseOrder
PurchaseOrderItem

FINANCE
Payment
Expense
FinancialEvent

FULFILLMENT
Shipment

SUPPORT
Complaint

SYSTEM
Task
Notification
Document
Attachment
AuditLog
BusinessEvent

AI
AIExecution
AIRecommendation
Approval
```

Ini masih **logical model**, belum database schema.

Jadi belum saatnya kita menentukan tabel final.

---

# 19. Apa yang masuk MGBOS v1

Ini bagian penting supaya kita **tidak overengineering**.

Target v1 menurut saya hanya:

```text
MULTI BRAND FOUNDATION
        +
CUSTOMER / CRM
        +
LEAD
        +
REQUIREMENT
        +
QUOTATION
        +
ORDER
        +
VENDOR
        +
PRODUCTION JOB
        +
PAYMENT
        +
BASIC QC
        +
AUTOMATION
        +
FOUNDER DASHBOARD
        +
AI ASSISTANT BASIC
```

Belum perlu:

```text
full ERP
full accounting
HRIS
payroll
complex warehouse
manufacturing MRP
advanced forecasting
autonomous agents
complex BI warehouse
mobile app
vendor marketplace
```

Itu nanti.

---

# 20. TeeStock sebagai Pilot Business

MGBOS tidak kita bangun secara teoritis.

**TeeStock menjadi test bed pertama.**

Jadi:

```text
MultiGraph Business OS
           │
           ▼
       TEESTOCK
           │
           ▼
Real Customer
Real Vendor
Real Order
Real Payment
Real Production
```

Kita belajar dari real operation.

Kemudian ketika stabil:

```text
TeeStock
   ↓

MultiGraph
   ↓

NeoPack
   ↓

Squeegee
   ↓

Other brands
```

Core engine tidak berubah banyak.

Yang ditambahkan hanyalah domain-specific configuration.

---

# 21. Roadmap MGBOS

Saya membayangkan evolusinya seperti ini:

```text
MGBOS 0.1
Business Blueprint
        ↓
MGBOS 0.2
Canonical Data Model
        ↓
MGBOS 0.3
Order Lifecycle + State Machines
        ↓
MGBOS 0.4
System Architecture
        ↓
MGBOS 0.5
TeeStock MVP
        ↓
MGBOS 0.6
Automation Layer
        ↓
MGBOS 0.7
AI Intelligence
        ↓
MGBOS 1.0
Production Operating System
```

Kita **tidak coding sebelum 0.3/0.4 cukup matang**.

Itu akan menghemat banyak rewrite.

---

# 22. Definition of Success untuk v1

MGBOS v1 sudah berhasil kalau suatu hari lo bisa membuka satu layar dan mengetahui:

> **Siapa yang mau beli?**

> **Apa yang mereka mau?**

> **Sudah dikasih harga atau belum?**

> **Order mana yang masuk?**

> **Berapa uang yang masuk?**

> **Siapa yang mengerjakan produksinya?**

> **Produksinya sudah sampai mana?**

> **Order mana yang bermasalah?**

> **Berapa margin sebenarnya?**

> **Apa yang harus gue kerjakan sekarang?**

Kalau sembilan pertanyaan itu bisa dijawab dengan data yang reliable, kita sudah mempunyai **Business OS yang nyata**, bahkan sebelum AI yang canggih masuk.

---

## Keputusan arsitektur pertama kita

Menurut saya, blueprint awal ini membawa kita ke satu keputusan penting:

> **MGBOS bukan software untuk TeeStock. TeeStock adalah tenant/business unit pertama yang menggunakan MGBOS.**

Dengan begitu ketika MultiGraph, NeoPack atau Squeegee Studios aktif, kita tidak membuat sistem baru.

Kita cukup:

```text
ADD BRAND
+
ADD PRODUCTS/SERVICES
+
ADD WORKFLOWS
+
ADD VENDORS
```

dan seluruh CRM, sales engine, order engine, finance, automation, reporting, serta AI infrastructure langsung bisa dipakai.

**Tahap berikutnya yang paling tepat adalah MGBOS 0.2: Canonical Data Model.** Di tahap itu kita akan menggambar secara detail hubungan `Customer → Lead → Requirement → Quote → Order → Order Item → Production Job → Vendor → Payment → QC`, termasuk bagaimana lima model bisnis TeeStock masuk ke struktur yang sama. Itu akan menjadi tulang punggung teknis seluruh sistem.