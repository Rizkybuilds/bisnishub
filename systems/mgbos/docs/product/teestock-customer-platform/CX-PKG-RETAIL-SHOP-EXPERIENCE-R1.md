---
canonical_id: proposed.mgbos.product.teestock-customer-platform.retail-shop-experience-r1
status: ACTIVE
version: 1.0.0
owner: Rizky
author: ChatGPT / AI Co-Founder & Product Strategy
approver: Rizky
scope: teestock-retail-shop-collection-pdp-cart-checkout-experience
document_class: product-experience-specification
normative_authority: CANONICAL_RETAIL_EXPERIENCE_SPECIFICATION
effective_from: 2026-10-20
product_activation: NOT_AUTHORIZED
implementation_authorization: NONE
deployment_authorization: NONE
merge_authorization: NONE
repository: Rizkybuilds/bisnishub
source_main_sha: 8c7731a13867f38b391ea2f38e9ae7b1f0a7e540
source_review_date: 2026-10-20
owner_adoption: ADOPTED_2026_10_20
runtime_validation: NOT_PERFORMED
user_research: NOT_PERFORMED
supersedes: null
depends_on:
  - bisnis/teestock/00-foundation/decision-register.md
  - bisnis/teestock/02-brand/brand-architecture.md
  - bisnis/teestock/03-commerce/catalog-merchandising-system.md
  - bisnis/teestock/03-commerce/product-taxonomy.md
  - bisnis/teestock/03-commerce/teestock-selects.md
  - bisnis/teestock/07-operations/operating-model.md
  - bisnis/teestock/10-product-tech/digital-product-vision.md
  - bisnis/teestock/10-product-tech/website-information-architecture.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-01-master-prd.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-02-customer-journeys-service-blueprint.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-03-experience-design-interaction-spec.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-04-commerce-checkout-experience.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-06-customer-account-service-experience.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-08-experience-quality-acceptance-contract.md
  - systems/mgbos/docs/product/teestock-customer-platform/cx-09-phased-delivery-product-validation-plan.md
---

# TEESTOCK — RETAIL SHOP EXPERIENCE DESIGN & PRODUCT RECONCILIATION R1

## 0. Executive Product Contract

**Disposition:** PRODUCT_DESIGN_SPECIFICATION_ACTIVE / OWNER_ADOPTED

### 0.1 Mandate

Dokumen ini memperdalam rancangan pengalaman retail TeeStock untuk:

- Public homepage.
- Shop landing.
- Collection dan product listing.
- Product search/filter/sort.
- Product detail page (PDP).
- Garment size dan variant selection.
- Cart.
- Checkout.
- Order confirmation.
- Post-purchase entry.

Tujuannya adalah membangun pengalaman apparel commerce yang memiliki identitas kuat, nyaman dipakai, cepat, aksesibel, dan tidak meningkatkan pekerjaan administratif founder secara tidak perlu.

Dokumen ini bukan pengganti CX-01, CX-03, CX-04, CX-06, atau CX-09.

Setiap usulan harus direkonsiliasi ke semantic owner masing-masing sebelum menjadi requirement kanonis.

### 0.2 Strategic direction

Retail curated graphic apparel adalah arah customer-facing yang diprioritaskan dalam perencanaan ini.

TeeStock Selects menjadi kendaraan utama untuk kurasi desain, TeeStock Originals untuk pengembangan IP internal, dan Essentials untuk apparel basics.

Custom dan Business tetap menjadi layanan sah yang dapat diakses dengan jelas.

### 0.3 Business and engineering separation

Empat kondisi tidak boleh disamakan:

1. **Product direction approved:** arah bisnis telah disepakati Owner.
2. **Product experience specified:** perilaku pelanggan telah dirancang.
3. **Technical readiness verified:** kemampuan operasional dan transaksi telah terbukti.
4. **Public feature released:** izin aktivasi telah diberikan dan perubahan telah diuji.

Penyelesaian tahap kedua tidak memberikan izin otomatis untuk tahap ketiga atau keempat.

### 0.4 Non-goals

Tidak membangun:

- Second ecommerce ledger.
- Unapproved customer database.
- Speculative marketplace engine.
- Public creator portal.
- Autonomous creator payout.
- AI-controlled pricing or refunds.
- Advanced 3D apparel customizer.
- Independent checkout for each label.
- Automatic retail launch.

---

# 1. Product Thesis and Experience Principles

## 1.1 North Star

**Discover effortlessly. Choose confidently. Purchase safely. Receive reliably.**

Customer harus dapat menemukan produk yang cocok tanpa mempelajari struktur internal TeeStock atau proses industri percetakan.

Kualitas pengalaman tidak ditentukan oleh jumlah animasi atau fitur yang terlihat.

Kualitas ditentukan oleh kemampuan pengguna menyelesaikan tugas dengan jelas dan nyaman.

## 1.2 Experience principles

### Principle XP-R1 — Product first

Produk dan manfaatnya mendahului penjelasan organisasi.

Pengunjung retail tidak perlu memahami Commerce, Originals, Services, dan Programs sebelum dapat melihat kaos.

### Principle XP-R2 — Editorial identity

TeeStock memiliki karakter visual dan kurasi.

Storytelling digunakan untuk membantu orang memahami desain, kreator, dan koleksi.

Storytelling tidak boleh menyembunyikan harga, ukuran, material, atau informasi pembelian.

### Principle XP-R3 — Truthful availability

Tidak ada tombol, label, harga, stok, atau status yang menyatakan sesuatu sudah tersedia tanpa dasar yang sah.

### Principle XP-R4 — Progressive complexity

Tampilkan informasi yang diperlukan pada tahap keputusan saat itu.

Jangan memaksa customer melihat seluruh konfigurasi internal apparel atau produksi.

### Principle XP-R5 — Fast by default

Fungsi utama Shop, listing, PDP, dan checkout tidak boleh tergantung pada animasi berat, AI, atau konten pihak ketiga yang tidak diperlukan.

### Principle XP-R6 — Recoverable actions

Pelanggan yang salah memilih ukuran, kehilangan koneksi, menemukan stok berubah, atau menghadapi pembayaran tidak pasti harus memperoleh penjelasan dan jalan pemulihan yang benar.

### Principle XP-R7 — Founder leverage

Pengalaman pelanggan yang baik tidak boleh menciptakan pekerjaan manual tersembunyi secara berlebihan.

### Principle XP-R8 — One coherent commerce

Produk Selects, Essentials, dan Originals menggunakan pengalaman pembelian yang konsisten, walaupun storytelling dan sumber IP berbeda.

---

# 2. Customer Segments & Jobs

## 2.1 Primary initial cohort

**Retail graphic apparel shopper.**

Customer mencari kaos dengan desain menarik, relevan secara personal, dan dapat dipakai untuk aktivitas sehari-hari.

Kebutuhan awal:

- Menemukan desain yang cocok.
- Menilai hasil visual.
- Memilih ukuran dan warna.
- Memahami kualitas garment.
- Mengetahui harga dan pengiriman.
- Melakukan pembelian tanpa negosiasi teknis.

## 2.2 Secondary customer cohorts

**Creator follower:** datang karena menyukai karya atau identitas kreator.

**Essentials buyer:** memprioritaskan fit, kualitas, material, dan pilihan basic apparel.

**Originals follower:** mengikuti konsep atau identitas kreatif milik TeeStock.

**Returning buyer:** ingin membeli desain/produk serupa tanpa mengulangi seluruh proses.

**Custom/Business buyer:** membutuhkan produk dengan spesifikasi yang belum terstandar atau kebutuhan organisasi.

## 2.3 Core jobs-to-be-done

| ID         | Job                 | Desired outcome                 |
| ---------- | ------------------- | ------------------------------- |
| RS-JTBD-01 | Find a design       | Produk relevan ditemukan        |
| RS-JTBD-02 | Compare products    | Perbedaan dapat dipahami        |
| RS-JTBD-03 | Choose garment      | Material/fit masuk akal         |
| RS-JTBD-04 | Select variant      | Ukuran/warna benar              |
| RS-JTBD-05 | Understand delivery | Tidak ada janji palsu           |
| RS-JTBD-06 | Complete purchase   | Transaksi benar dan recoverable |
| RS-JTBD-07 | Check order         | Status dapat dipercaya          |
| RS-JTBD-08 | Resolve a problem   | Dukungan jelas dan aman         |

---

# 3. Proposed Retail Information Hierarchy

## 3.1 Website role

Public website harus:

1. Memperkenalkan TeeStock.
2. Memperlihatkan produk.
3. Mengarahkan customer ke penawaran yang sesuai.
4. Membantu evaluasi produk.
5. Menyediakan tindakan nyata yang didukung.
6. Memfasilitasi layanan dan dukungan.

## 3.2 Global navigation

Usulan hierarki konseptual:

```text
HOME
SHOP
  SELECTS
  ESSENTIALS
  ORIGINALS PRODUCTS
  COLLECTIONS
CUSTOM
FOR BUSINESS
SUPPORT
```

**Catatan:** ini merupakan presentation priority, bukan keputusan final membuat route baru atau mengganti IA kanonis.

Collection, Creator, dan Independent Label dapat mempunyai landing page sendiri ketika konten dan status legalnya tersedia.

Tidak semuanya harus menjadi menu utama.

## 3.3 Proposed route concepts

| Experience     | Candidate path                           | Status                            |
| -------------- | ---------------------------------------- | --------------------------------- |
| Homepage       | `/`                                      | Existing route, proposed redesign |
| Shop           | `/shop`                                  | Proposed, not implemented claim   |
| Selects        | `/shop/selects`                          | Proposed route concept            |
| Essentials     | `/shop/essentials`                       | Proposed route concept            |
| Collections    | `/collections` or IA-approved equivalent | Undecided                         |
| Product detail | `/products/[slug]` or equivalent         | Undecided                         |
| Cart           | `/cart`                                  | Gated                             |
| Checkout       | `/checkout`                              | Gated                             |
| Order tracking | Approved protected customer route        | Gated                             |
| Custom         | `/custom`                                | Existing route                    |
| Business       | `/business`                              | Existing route                    |

Final routing requires existing-route, SEO, architecture, and redirect assessment.

Do not infer that these route concepts are authorized implementation filenames.

---

# 4. Homepage Experience Contract

## 4.1 Homepage objective

Within the initial interaction, visitors should understand that TeeStock sells curated apparel and can navigate to a relevant product or offering.

## 4.2 Proposed section sequence

```text
GLOBAL NAVIGATION
      ↓
RETAIL BRAND / COLLECTION HERO
      ↓
FEATURED CURATED PRODUCTS
      ↓
DISCOVER BY THEME OR COLLECTION
      ↓
TEEStock SELECTS / ORIGINALS DISCOVERY
      ↓
GARMENT / QUALITY CONFIDENCE
      ↓
CREATOR STORY WHEN APPROVED
      ↓
CUSTOM / BUSINESS SECONDARY ENTRY
      ↓
SUPPORT AND FOOTER
```

Sections are optional when there is insufficient factual content.

Do not create dummy creator cards or invented bestsellers to fill the layout.

## 4.3 Hero

Hero harus menjawab:

- Produk apa yang dijual?
- Apa identitas desainnya?
- Tindakan utama apa yang tersedia?

**Candidate concept:**

Headline: "Wear something that speaks."

Supporting copy: "Kaos grafis terkurasi dengan desain pilihan, koleksi original, dan perhatian pada kualitas produk."

Primary action: "Explore Designs".

Secondary action: "Discover TeeStock".

Copy ini merupakan konsep editorial, bukan final approved brand voice.

Jika Shop belum tersedia untuk transaksi, primary action dapat mengarah ke eligible product discovery atau approved collection preview—bukan checkout palsu.

## 4.4 Featured product selection

Urutan dan isi harus berasal dari merchandising keputusan yang sah.

Possible modules:

- Featured designs.
- Latest approved arrivals.
- Selected collection.
- Approved creator collaboration.
- Originals capsule.

Tidak ada klaim "Bestseller", "Limited", "Exclusive" atau diskon tanpa dasar dan aturan merchandising yang berlaku.

## 4.5 Hero media

Utamakan satu visual yang benar-benar menjelaskan produk dan identitas.

Hindari autoplay video, carousel wajib, atau interaksi kompleks untuk memahami penawaran.

Jika memakai beberapa hero editorial, pengguna harus tetap dapat memahami konten tanpa memindahkan slide.

## 4.6 Homepage failure modes

| Situation                         | Required behavior                                                      |
| --------------------------------- | ---------------------------------------------------------------------- |
| No published collection           | Show approved brand/product information instead of empty featured grid |
| Shop not transactional            | No deceptive purchase CTA                                              |
| Media unavailable                 | Text and navigation remain understandable                              |
| Creator image/license unavailable | Do not publish affected media                                          |
| Slow client device                | Core navigation and content remain usable                              |
| JS enhancement fails              | Core public information remains accessible where technically feasible  |

---

# 5. Shop Landing Experience

## 5.1 Job

Shop adalah destinasi utama untuk menemukan produk, bukan dashboard internal.

## 5.2 Minimum content

- Clear Shop title.
- Approved assortment.
- Featured collection entry.
- Product listing entry.
- Basic category navigation.
- Availability and product status truth.
- Real support path.

## 5.3 Product discovery hierarchy

For a small initial catalog, prioritize:

1. Relevant product visibility.
2. Simple collection/thematic grouping.
3. Clearly labeled variants.
4. Product quality information.

Do not introduce a large filter panel when only a few products exist.

## 5.4 Small-catalog rule

For the initial proposed six-design experiment, complex search and filtering are not automatically required.

Editorial grouping and direct product discovery may outperform unnecessary controls.

Search, price sorting, and faceted filters should be introduced when assortment volume and user research demonstrate their value.

## 5.5 Merchandising versus search

**Merchandising** determines intentional product presentation.

**Search** helps retrieve relevant catalog items.

Search should not secretly fabricate products or treat unpublished variants as sellable.

---

# 6. Collection & Product Listing Experience

## 6.1 Collection identity

A collection is an editorial grouping of products.

It is not automatically a brand, product category, inventory owner, or separate commercial entity.

## 6.2 Collection page anatomy

Recommended structure:

1. Collection title.
2. Short collection story.
3. Supporting approved editorial image.
4. Visible eligible products.
5. Contextual product sorting or filters where useful.
6. Creator attribution, when applicable.
7. Related collections or clear return to Shop.

Long-form stories belong below or beside the products without obstructing basic shopping tasks.

## 6.3 Product card anatomy

Minimum candidate content:

| Field                 | Requirement                                                 |
| --------------------- | ----------------------------------------------------------- |
| Product media         | Accurate, accessible and approved                           |
| Product name          | Clear human-readable identity                               |
| Price                 | Approved current price context, or no price if not eligible |
| Available variants    | Do not show unsupported size/color claims                   |
| Collection or creator | Accurate attribution                                        |
| Product status        | Only when meaningful                                        |
| Primary interaction   | Open PDP, or authorized eligible action                     |

Product cards should not automatically offer Add to Cart when options, availability, or product eligibility require review on PDP.

## 6.4 Product images

Product photos should demonstrate:

- overall apparel appearance;
- garment color;
- print scale and placement;
- fit or worn appearance where available;
- relevant material/print detail.

Do not represent digitally generated mockups as photographs of a physical product.

Where images are illustrative, indicate the limitation through appropriate copy or context.

## 6.5 Filters

Possible filters:

- Size.
- Color.
- Fit.
- Product category.
- Price.
- Collection.

Creator/label filters may be justified later.

Filter options should match the published data and avoid dead-end combinations where practical.

## 6.6 Sort

Candidate sort modes:

- Featured.
- Newest.
- Price ascending/descending, if pricing is valid.
- Popular, only with a defined reliable ranking basis.

Do not mark "Popular" from unverified impressions.

## 6.7 Search result states

Differentiate:

- matching results;
- no matching results;
- currently unavailable products;
- query/system error;
- temporary data unavailability.

"No products match your filter" must not be shown when the underlying product service failed.

---

# 7. Product Detail Page — Core Design Contract

## 7.1 Product decision principle

PDP is the customer's primary decision surface.

The product must be understandable even if the visitor ignores secondary storytelling.

## 7.2 Proposed PDP information hierarchy

```text
PRODUCT GALLERY
PRODUCT NAME
PRICE / COMMERCIAL QUALIFICATION
COLOR / SIZE / VARIANT CHOICES
SIZE GUIDE
AVAILABILITY / PRODUCTION MODE
PRIMARY ACTION
MATERIAL / FIT / PRODUCT SPECS
DELIVERY / RETURN INFORMATION
ARTWORK / CREATOR / COLLECTION STORY
CARE INSTRUCTIONS
RELATED PRODUCTS
```

Exact mobile stacking and desktop columns belong to approved interaction design.

## 7.3 Product gallery

Required experience properties:

- Responsive images with preserved aspect ratio.
- Meaningful alt text.
- Gallery keyboard controls.
- Clear indication of additional images.
- No auto-switching image while users make a choice.
- Zoom/detail only if useful and accessible.
- Graceful image failure.

Changing garment color should not display a misleading image of another variant.

## 7.4 Product information

Candidate required facts before buying:

- Garment type.
- Fit.
- Material composition.
- Verified size measurements.
- Available colors/sizes.
- Print or decoration characteristics where important.
- Care instructions.
- Availability mode.
- Fulfillment expectation.
- Customer policy links.

Unknown or unverified facts cannot be filled by AI guesswork.

## 7.5 Variant selection

For apparel, propose visible size choices when the number of options is manageable.

The selected size must be clearly distinguishable visually and programmatically.

Unavailable sizes must not behave as valid selections.

Color changes must update all dependent valid information, including imagery, availability and eligible price changes.

## 7.6 Size confidence

Size guide must be reachable directly near size selection.

Possible elements:

- Garment measurements.
- Fit classification.
- How to measure.
- Model sizing details, only when factual.
- Measurement tolerance or qualification from the approved business specification.

Do not fabricate model height, weight, sample sizes, or measurements.

## 7.7 Availability semantics

Customer-visible availability must be derived from authoritative eligibility:

- Ready stock.
- Made to order.
- Preorder.
- Sold out.
- Unavailable.
- Status unknown.

Any customer-facing time estimate must be based on an approved, current commitment model.

Cart inclusion does not automatically mean inventory is reserved.

## 7.8 Creator attribution

For relevant Selects products, show:

- Creator identity permitted by the agreement.
- Approved attribution.
- Artwork/design story where available.
- Optional creator profile when it contains verified content.

Do not imply the creator owns the entire TeeStock product or that TeeStock owns the creator's copyright without evidence.

## 7.9 Originals identity

Originals may use a richer collection story but should retain consistent size, price, delivery, and purchase interactions.

The presence of a label name does not require a separate cart or checkout.

## 7.10 PDP CTA states

| Product condition         | Proposed customer action              |
| ------------------------- | ------------------------------------- |
| Not commercially approved | Information only                      |
| Preview/coming later      | Approved informational action         |
| Ready stock and eligible  | Add to cart, after relevant gates     |
| MTO and eligible          | Add to cart with clear mode/terms     |
| Preorder and eligible     | Approved preorder action with terms   |
| Sold out                  | Disabled purchase, valid alternatives |
| Availability unknown      | No binding purchase until revalidated |
| Rights restricted         | No unauthorized new sale              |

Product status is not determined by styling alone.

---

# 8. Cart Experience — Transactional Stage

## 8.1 Cart objective

Help the customer verify intended product choices and understand the amount before moving to checkout.

## 8.2 Cart item information

Each item should show:

- Product identity.
- Chosen color/size.
- Quantity.
- Current applicable price basis.
- Relevant fulfillment mode.
- Ability to edit or remove.
- Important eligibility changes.

## 8.3 Price validation

Cart prices can be provisional.

Final authoritative terms must be revalidated before binding commitment.

Any material price or fee change must be made visible.

## 8.4 Mixed fulfillment

If cart contains ready-stock and made-to-order products, explain differences in processing expectations.

Do not imply split shipment or combined shipment is supported without actual eligibility.

If mixed checkout is unsupported, handle this before a binding transaction with a clear recovery route.

## 8.5 Cart persistence

Recover cart from normal navigation interruptions where safely supported.

Customer-local cart state does not become order truth.

Cart restoration must revalidate product, variant, pricing, stock and rights.

## 8.6 Cart error handling

Typical cases:

- Product unpublished.
- Size unavailable.
- Quantity too large.
- Price changed.
- Stock changed.
- Session expired.
- Product service unavailable.

Every error should identify the affected item and next action.

---

# 9. Checkout Experience — Transactional Stage

## 9.1 Activation condition

Checkout is unavailable until the applicable CX-04, CX-08, MGBOS, payment, R4/R5, provider and operational gates pass.

This section specifies target customer behavior, not an approved launch.

## 9.2 Checkout sequence

Recommended candidate sequence:

1. Cart review.
2. Contact/identity handling.
3. Delivery destination.
4. Approved delivery options.
5. Payment option.
6. Final amount and terms review.
7. Deliberate commitment.
8. Pending / verified / failure / recovery experience.

The number of screens or steps should be based on task research and implementation constraints, not visual preference.

## 9.3 Guest checkout

Guest checkout is a preferred low-friction product direction only when approved identity, privacy, payment and customer recovery policies permit it.

Do not require an account solely to display ordinary retail information.

Account linkage and post-purchase order access still require appropriate verification.

## 9.4 Contact and address forms

Collect only information genuinely needed for transaction and delivery.

Use:

- Clear visible labels.
- Relevant input types.
- Correct error placement.
- Helpful field instructions.
- Correction without re-entering unrelated data.
- Privacy notices where required.

Never make all fields optional or mandatory by default; each field must have a justified purpose.

## 9.5 Total review

Before final commitment, display the authoritative transaction summary:

- Items and selected variants.
- Quantities.
- Item/subtotal calculations.
- Applicable discounts.
- Shipping.
- Taxes/fees where applicable.
- Total amount due.
- Applicable cancellation and return terms.
- Delivery qualification.

Unknown required charges should block an unsupported binding commitment rather than appear after payment.

## 9.6 Payment truth

Payment presentation must distinguish:

- Not started.
- Awaiting action.
- Pending confirmation.
- Confirmed.
- Failed.
- Canceled.
- Unknown or reconciliation required.

Browser redirect alone is not authoritative confirmation.

## 9.7 Duplicate and timeout recovery

Double-click, refresh, mobile network interruption, provider callback loss, retry and duplicate webhook must be handled according to approved command semantics.

The customer should not be encouraged to blindly resubmit a payment whose outcome is unknown.

The frontend cannot provide idempotency on its own.

## 9.8 Failure fallback

If payment/provider is unavailable, explain the condition and preserve permitted customer context.

Do not create orders or financial commitments through an ungoverned chat workaround.

---

# 10. Post-Purchase Experience

## 10.1 Confirmation

Only after authoritative confirmation, display:

- True order reference.
- Verified payment outcome.
- Items and variants.
- Next operational expectation.
- Support path.
- Delivery information where available.

## 10.2 Order status

Show customer-friendly interpretations of authoritative data, not duplicated lifecycle states.

Do not display internal vendor notes, confidential production costs, private customer information, or unauthorized organization data.

## 10.3 Processing updates

Customer may need to know:

- Order accepted.
- Payment awaiting confirmation.
- Preparing / producing, if supported.
- QC or fulfillment progress where authorized.
- Shipped with verified carrier details.
- Delivered where supported by reliable evidence.
- Problem requiring action.

If a stage is unknown, show uncertainty honestly.

## 10.4 Reorder

Reordering should revalidate:

- Current product eligibility.
- Artwork usage rights.
- Price.
- Inventory and capacity.
- Delivery policy.
- Customer authority where relevant.

A previous order does not guarantee future availability or the same price.

## 10.5 Support and returns

The customer must be able to find real support.

Self-service refund/return submission does not imply automatic refund approval.

Eligibility and financial effects remain with the governing policy and command owner.

---

# 11. Interaction State Contract

## 11.1 Standard states

Critical interactive components require meaningful handling of:

- Initial.
- Loading.
- Ready.
- Empty.
- Invalid.
- Unavailable.
- Pending.
- Success.
- Error.
- Unknown/reconciliation.
- Disabled with reason, when applicable.

State labels are conceptual UI categories, not approved backend enums.

## 11.2 State communication

An error message should contain:

1. What happened.
2. What was affected.
3. What the customer can do.
4. Whether an action might already have succeeded.

Avoid generic messages like "Something went wrong" when precise, safe guidance is available.

## 11.3 Core copy examples

**Out of stock:** "Ukuran ini sedang tidak tersedia. Pilih ukuran lain atau lihat desain lainnya."

**Made to order:** "Produk ini dibuat setelah pesanan dikonfirmasi. Perkiraan pemrosesan mengikuti informasi yang ditampilkan sebelum pembayaran."

**Payment pending:** "Pembayaran sedang diperiksa. Jangan mengulangi pembayaran sebelum statusnya dipastikan."

**Unverified availability:** "Ketersediaan belum dapat dipastikan. Pembelian belum bisa dilanjutkan."

**Artwork preview:** "Gambar ini merupakan ilustrasi tampilan produk. Detail akhir mengikuti spesifikasi produk yang disetujui."

Copy final harus mengikuti TeeStock Voice & Copy System, kondisi layanan nyata, serta legal/customer commerce policy.

---

# 12. Accessibility Contract

## 12.1 General accessibility

Product design aims to conform to applicable WCAG 2.2 AA requirements through governed CX-08 acceptance.

Important areas:

- Keyboard navigation.
- Visible focus.
- Accessible labels.
- Consistent headings.
- Text contrast.
- Touch targets.
- Form errors and correction.
- Reduced motion.
- Screen-reader announcements.
- Accessible carousels/galleries where present.
- Valid focus return after dialogs/drawers.

Automated scanning alone is insufficient to establish accessibility.

## 12.2 Size selector

Size selection should have keyboard-operable, semantically clear controls.

Selection must not be communicated solely through color.

Unavailable options must be distinguishable and explained.

## 12.3 Cart and checkout

Financial submissions must provide an appropriate means to check, correct, confirm, or reverse according to applicable accessibility requirements and transaction policy.

A design-stage confirmation screen does not prove that payment cancellation is supported.

## 12.4 Mobile adaptation

Mobile flows should preserve:

- Clear product imagery.
- Readable product facts.
- Usable size selection.
- Accessible cart.
- Keyboard-safe form input.
- Visible errors.
- Context-preserving navigation.
- Essential actions that remain usable without hover.

Do not hide essential product information in mouse-only interactions.

---

# 13. Performance & Lightweight Experience

## 13.1 Product requirement

TeeStock should provide a premium experience without forcing customers to download capabilities unrelated to their current task.

## 13.2 Performance measurement

Inherit CX-08's current measurement methodology and gate requirements.

External Core Web Vitals reference targets:

- LCP: 2.5 seconds or less.
- INP: 200 milliseconds or less.
- CLS: 0.1 or less.

These are web performance reference targets at the relevant p75 measurement level, not measured TeeStock results.

## 13.3 Performance-first design

Recommended implementation principles for later engineering assessment:

- Responsive image delivery.
- Correct image dimensions/aspect-ratio reservation.
- Avoid unnecessary JavaScript for static catalog content.
- Progressive feature loading.
- Defer nonessential widgets.
- Avoid aggressive video/autoplay.
- Keep AI and advanced builder bundles isolated.
- Minimize unnecessary third-party scripts.
- Preserve speed on lower-power phones and unstable networks.

No exact implementation mechanism is authorized here.

## 13.4 Performance evidence

Pre-release:

- Reproducible lab testing.
- Device/browser matrix.
- Route-specific budgets.
- Cold and warm navigation checks.
- Interaction and image-loading behavior.
- Regression comparison against existing baseline.

Post-release:

- Field measurements only when sufficient legitimate data exists.
- Segment where appropriate.
- Do not claim lab values as field p75 results.

---

# 14. Creator, Originals & Brand Presentation

## 14.1 Selects

Primary product focus is the garment and curated artwork.

Approved creator attribution enhances the product story.

## 14.2 Originals

Show internally developed collections as products within Commerce.

Do not make customers use separate checkout systems merely because an item originates from Originals.

## 14.3 Independent Labels

Independent labels can gain increasing presentation autonomy when permitted by brand governance.

No independent label domain, social account, or checkout is required for early retail testing.

## 14.4 Collaboration rights

Do not publish artwork or creator media without applicable rights.

Attribution, excerpts, portraits and social/profile links should follow the agreement and content policy.

---

# 15. Founder & Backstage Integration

## 15.1 No duplicative work

A successful standard retail purchase should be transformed into governed operational information without requiring founder re-entry into an unrelated spreadsheet or chat thread.

## 15.2 Founder attention principle

Attention should focus on:

- Missing stock.
- Failed eligibility.
- Production errors.
- QC problems.
- Shipment issues.
- Payment discrepancies.
- Customer complaints.
- Rights or royalty disputes.
- Material capacity decisions.

Routine browsing and validated standard checkout should not create unnecessary manual tickets.

## 15.3 Physical operations

The website cannot perform pressing, packing, vendor pickup, or courier drop-off.

The system should make physical work easier to prepare, prioritize, track and verify.

## 15.4 Exception trust

Do not claim "zero exceptions" unless the relevant detectors, data coverage and operational checks are actually present.

Unknown data coverage must be visible to authorized operators.

---

# 16. Product Design & Operational Scenario Matrix

## 16.1 Normal scenarios

| ID       | Scenario                       | Expected product outcome                                       |
| -------- | ------------------------------ | -------------------------------------------------------------- |
| RS-AC-01 | Visitor lands on homepage      | Understands retail offering and finds valid Shop entry         |
| RS-AC-02 | Customer browses Selects       | Discovers curated products without internal taxonomy confusion |
| RS-AC-03 | Customer views Originals       | Understands internally created collection concept              |
| RS-AC-04 | Customer opens product         | Sees material, fit, variants, price basis and availability     |
| RS-AC-05 | Customer selects color         | Sees matching eligible visual and variant data                 |
| RS-AC-06 | Customer selects size          | Selection is clear and accessible                              |
| RS-AC-07 | Customer views size guide      | Can compare verified measurements                              |
| RS-AC-08 | Customer views creator product | Attribution is correct and permitted                           |
| RS-AC-09 | Customer views MTO product     | Understands fulfillment difference                             |
| RS-AC-10 | Customer navigates mobile      | Essential tasks remain accessible                              |

## 16.2 Failure scenarios

| ID       | Scenario                               | Expected product outcome                      |
| -------- | -------------------------------------- | --------------------------------------------- |
| RS-AC-11 | Shop not enabled                       | No fake checkout or purchase CTA              |
| RS-AC-12 | No products match filters              | Clear zero-results recovery                   |
| RS-AC-13 | Catalog service fails                  | Service error not confused with empty catalog |
| RS-AC-14 | Product image unavailable              | Product facts and navigation remain usable    |
| RS-AC-15 | Invalid size/color combination         | Purchase eligibility blocked                  |
| RS-AC-16 | Availability unknown                   | No false in-stock assertion                   |
| RS-AC-17 | Product rights expire                  | Ineligible product not sold                   |
| RS-AC-18 | Price changes in cart                  | Authoritative amount revalidated              |
| RS-AC-19 | Stock changes during checkout          | No uncontrolled overselling                   |
| RS-AC-20 | Payment callback is delayed            | No false paid status                          |
| RS-AC-21 | Customer resubmits purchase            | No duplicated authorized effect               |
| RS-AC-22 | Customer opens another account's order | Access denied without information leak        |
| RS-AC-23 | Supplier fails after order             | Traceable exception and customer recovery     |
| RS-AC-24 | QC fails                               | No false fulfillment-ready confirmation       |
| RS-AC-25 | Shipment status unavailable            | Unknown shown honestly                        |
| RS-AC-26 | AI unavailable                         | Normal Shop and support still work            |

## 16.3 Accessibility and performance scenarios

| ID       | Scenario                              | Expected outcome                                 |
| -------- | ------------------------------------- | ------------------------------------------------ |
| RS-AC-27 | Keyboard-only user selects variant    | Fully operable with visible focus                |
| RS-AC-28 | Screen reader encounters invalid form | Correct field error communicated                 |
| RS-AC-29 | Reduced-motion user browses Shop      | No essential forced animation                    |
| RS-AC-30 | Mobile browser interrupts checkout    | Safe recovery without false order/payment state  |
| RS-AC-31 | Product gallery loads slowly          | Layout remains stable                            |
| RS-AC-32 | Optional recommendation fails         | Product purchase essentials unaffected           |
| RS-AC-33 | Unsupported viewport/input            | Defined fallback or explicit compatibility issue |

## 16.4 Acceptance evidence rule

All scenarios remain **NOT_EXECUTED** until an actual test with exact source, environment, steps, expected outcome and observed result exists.

Descriptions alone are not test evidence.

---

# 17. Product Research & Usability Plan

## 17.1 Research questions

- Do customers understand TeeStock primarily as an apparel retail brand?
- Can they distinguish curated design from custom printing?
- Can they confidently select sizes?
- Do they understand made-to-order fulfillment?
- Can they find prices and essential product facts?
- Is the collection story useful or distracting?
- Can they distinguish unavailable products from purchasable ones?
- Does the design reduce support questions?
- Does it create avoidable founder work?

## 17.2 Representative participants

Candidate segments:

- First-time online apparel buyers.
- Mobile-first graphic tee shoppers.
- Customers with sizing concerns.
- People discovering apparel through creator content.
- Returning apparel buyers.
- Customers who also need Custom/Business.

Research must distinguish these cohorts rather than claiming a single small set represents every market.

## 17.3 Prototype tasks

Minimum suggested tasks:

1. Find a graphic tee in a preferred theme.
2. Compare two products.
3. Select a size using the guide.
4. Explain what made-to-order means.
5. Find total cost and delivery expectation.
6. Correct a mistaken variant selection.
7. Recover from unavailable stock.
8. Find the Custom service.
9. Find help for a hypothetical wrong-size delivery.

Prototype testing must not claim actual provider payments or inventory.

## 17.4 Research evidence

For each task capture:

- Participant/cohort code.
- Task and fixture version.
- Completion outcome.
- Observed friction.
- Assistance required.
- Critical misunderstanding.
- Product recommendation.
- Confidence/limitations.

Do not set arbitrary pass percentages without sample size and decision context.

---

# 18. Product Metrics & Founder Leverage

## 18.1 Customer experience indicators

- Shop entry comprehension.
- Product discovery task success.
- PDP factual comprehension.
- Size-selection error.
- Cart correction frequency.
- Checkout completion when activated.
- Payment recovery incidents.
- Support contacts per fulfilled order.
- Returns/size-related complaints.

## 18.2 Founder operating indicators

- Manual touches per standard order.
- Founder minutes per fulfilled order.
- Manual data re-entry events.
- Stock mismatch interventions.
- Production exception count.
- QC rework.
- Customer status inquiries.
- Recovery/reconciliation hours.

## 18.3 Business outcomes

- Completed paid retail orders.
- Contribution per order.
- Contribution per design/collection.
- Returns-adjusted economics.
- Repeat customer behavior.
- Creator liability accuracy, where relevant.
- Cost of acquisition and channel performance when measurable.

No invented baseline is allowed.

## 18.4 AI and automation evaluation

Any optional AI feature must demonstrate measurable improvement net of:

- provider and token cost;
- human monitoring;
- correction/rework;
- support escalation;
- security/privacy risk;
- maintenance overhead.

AI is not a precondition for ordinary shopping.

---

# 19. Phased Product Design Scope

## `RS-D0` — Concept & Research

Scope:

- Shop experience design.
- Homepage hierarchy.
- Collection and PDP prototypes.
- Realistic content fixtures.
- Garment/size presentation study.
- Nontransactional user research.

No live transaction authority.

## `RS-D1` — Truthful Retail Discovery Candidate

Scope, if separately authorized:

- Valid Shop landing.
- Approved published product information.
- Collection/PDP browsing.
- Accessible navigation.
- Product preview/status truth.
- Clear supported next actions.

This does not imply paid order acceptance.

## `RS-D2` — Eligible Retail Transaction Candidate

Scope, after all gates:

- Valid product/variant.
- Cart.
- Customer and delivery details.
- Final terms review.
- Approved payment.
- Canonical order.
- Confirmation and safe recovery.

Requires independent finance, authorization, inventory, security, and operational assurance.

## `RS-D3` — Operational Learning

Scope:

- Founder workload evidence.
- Conversion and customer-friction analysis.
- Product/collection performance.
- Support and returns insights.
- Controlled creator collaboration learning.
- Improvements to standard order fulfillment.

## `RS-D4` — Advanced Retail Experience

Optional, evidence-gated:

- Selective personalization.
- Creator discovery depth.
- Repeat purchase tools.
- Verified marketplace integration.
- Mature Independent Label experiences.
- Evaluated AI shopping support.

`RS-D0..D4` are proposed design planning labels. They are not new MGBOS release states or replacements for CX-S0..S3.

---

# 20. Canonical Reconciliation Map

## 20.1 Existing CX ownership

| Document | Responsibility                                                     |
| -------- | ------------------------------------------------------------------ |
| CX-01    | Product mandate, priorities, master requirements                   |
| CX-02    | Customer journeys and service handoffs                             |
| CX-03    | Screen interaction, visual behavior, mobile/accessibility patterns |
| CX-04    | Retail listing, PDP, cart, checkout and transaction UX             |
| CX-05    | Custom and Business experience                                     |
| CX-06    | Customer account, status, support and returns experience           |
| CX-07    | External channels and provider experience                          |
| CX-08    | Quality requirements, tests and evidence                           |
| CX-09    | Product delivery sequencing and validation                         |

## 20.2 Adoption approach

Do not copy this entire document verbatim into every CX owner.

Instead:

1. Reconcile product positioning and cohort priority with CX-01.
2. Reconcile retail storyboards with CX-02.
3. Integrate approved interaction deltas into CX-03.
4. Integrate approved PDP/cart/checkout deltas into CX-04.
5. Preserve CX-05 Custom/Business semantics.
6. Integrate post-purchase and guest recovery findings into CX-06.
7. Preserve CX-07 provider gates.
8. Integrate accepted test fixtures into CX-08.
9. Reconcile design-first sequencing with CX-09 and approved business roadmap.

## 20.3 Requirement preservation

Preserve:

- `CX1-FR-001..046`.
- `CX1-NFR-001..015`.
- Existing child FR/BR/AC namespaces.
- Existing journey references.
- `CX-PKG-TRACE-R1.csv`.
- Existing stage crosswalk until approved revision.

New IDs, revised priorities, or deletions require a reasoned semantic change and traceability update.

## 20.4 R2 research relationship

PR #77 contains R2 deepening documents that already address significant portions of premium product experience and retail checkout.

Use:

- DP-02 for storyboard depth.
- DP-03 for interaction patterns.
- DP-05 for retail commerce detail.
- DP-08 for quality evidence.
- DP-09 for phased delivery.

This document captures retail-first emphasis and the remaining integrative design decisions, not an alternative canonical CX-04 specification.

---

# 21. Owner Decision Register — Proposed

### `RS-DEC-01` — Retail homepage emphasis

**Recommendation:** Curated graphic apparel should be the primary public product emphasis, with Custom/Business accessible as separate services.

**Status:** ADOPTED_BY_OWNER (2026-10-20).

### `RS-DEC-02` — Discovery before payment activation

**Recommendation:** Permit planning of a nontransactional retail discovery experience ahead of independently assured direct checkout.

**Status:** ADOPTED_BY_OWNER (2026-10-20).

### `RS-DEC-03` — Small assortment before complexity

**Recommendation:** Validate a controlled curated assortment without requiring full filtering, creator portal, marketplace synchronization, or AI recommendation.

**Status:** ADOPTED_BY_OWNER (2026-10-20).

### `RS-DEC-04` — One shared customer commerce experience

**Recommendation:** Selects, Essentials, and eligible Originals products should reuse a consistent shopping and transactional experience.

**Status:** ADOPTED_BY_OWNER (2026-10-20; consistent with current Commerce architecture).

### `RS-DEC-05` — Preserve existing CX semantic owners

**Recommendation:** Integrate accepted refinements into CX-00..09 through controlled documentation reconciliation rather than building competing PRDs.

**Status:** ADOPTED_BY_OWNER (2026-10-20).

No proposed decision is to be silently treated as an approved change to the canonical Decision Register.

---

# 22. Known Unknowns & Blocking Dependencies

## 22.1 Product unknowns

- Actual first assortment.
- Product photography and physical samples.
- Brand copy approved for launch.
- Customer target audience research.
- Verified size charts.
- Specific garment specifications.
- Applicable creator licenses.
- Actual stock/availability.

## 22.2 Commerce unknowns

- Final approved consumer prices.
- Shipping rates and eligible destinations.
- Payment provider eligibility.
- Customer support operating policy.
- Refund and cancellation workflows.
- Exact live checkout readiness.
- Current production/vendor capacity.

## 22.3 Technical unknowns

- Reusable current catalog runtime capabilities.
- Approved retail order command.
- Validated inventory reservation and replay.
- Financial-integrity migration readiness.
- Identity and guest order protection.
- Provider callbacks and reconciliation.
- Production and fulfillment integration.
- Live performance and accessibility evidence.

These must be evaluated by the applicable owner before activating affected functionality.

---

# 23. Documentation Source Register

## 23.1 Canonical repository inputs

- `bisnis/teestock/02-brand/brand-architecture.md`
- `bisnis/teestock/03-commerce/catalog-merchandising-system.md`
- `bisnis/teestock/03-commerce/product-taxonomy.md`
- `bisnis/teestock/03-commerce/teestock-selects.md`
- `bisnis/teestock/10-product-tech/website-information-architecture.md`
- `bisnis/teestock/10-product-tech/digital-product-vision.md`
- `systems/mgbos/docs/product/teestock-customer-platform/cx-01-master-prd.md`
- `systems/mgbos/docs/product/teestock-customer-platform/cx-02-customer-journeys-service-blueprint.md`
- `systems/mgbos/docs/product/teestock-customer-platform/cx-03-experience-design-interaction-spec.md`
- `systems/mgbos/docs/product/teestock-customer-platform/cx-04-commerce-checkout-experience.md`
- `systems/mgbos/docs/product/teestock-customer-platform/cx-06-customer-account-service-experience.md`
- `systems/mgbos/docs/product/teestock-customer-platform/cx-08-experience-quality-acceptance-contract.md`
- `systems/mgbos/docs/product/teestock-customer-platform/cx-09-phased-delivery-product-validation-plan.md`

## 23.2 PR #77 research inputs

Under:

`systems/mgbos/docs/product/teestock-customer-platform/local-intake/2026-10-19/`

Relevant source proposals:

- `CX-PKG-DP02-SIGNATURE-EXPERIENCE-STORYBOARDS-R2.md`
- `CX-PKG-DP03-EXPERIENCE-DESIGN-INTERACTION-R2.md`
- `CX-PKG-DP05-COMMERCE-CHECKOUT-EXPERIENCE-R2.md`
- `CX-PKG-DP08-EXPERIENCE-QUALITY-ACCEPTANCE-R2.md`
- `CX-PKG-DP09-PHASED-DELIVERY-PRODUCT-VALIDATION-R2.md`
- `retail-commerce-operating-blueprint.md`

These are imported noncanonical sources pending independent review.

## 23.3 External research

- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/
- W3C Understanding Error Prevention: https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html
- Google web.dev Core Web Vitals: https://web.dev/articles/vitals
- Baymard Product Page UX 2026: https://baymard.com/research-articles/current-state-ecommerce-product-page-ux
- Baymard Product Listing Page UX: https://baymard.com/blog/product-listing-page-plp-ux
- Baymard Mobile Ecommerce Research: https://baymard.com/research/mcommerce-usability

External research supports design methodology. It does not prove TeeStock customer preferences or implemented capability.

---

# 24. Author Review & Release Conditions

## 24.1 Checks performed

At source/design level:

- Main revision verified.
- PR #77 HEAD verified.
- Existing IA and catalog hierarchy reviewed.
- Existing Shop/PDP concepts compared.
- Existing CX and R2 ownership checked.
- Current homepage implementation inspected.
- Proposed retail journey separated from payment authorization.
- Product statuses and failure semantics checked for consistency.
- Founder workload included.
- Accessibility and performance research consulted.
- New design labels kept separate from existing requirement IDs.
- No new root entity, API, SQL command, or provider entitlement introduced.

## 24.2 Checks not performed

- Independent semantic QA of this new document.
- Actual usability testing with customers.
- Repository validators against the pasted file.
- Financial R5 implementation assurance.
- Production capacity testing.
- Live browser acceptance.
- Actual storefront performance field measurement.
- Approval of product priorities or route implementation.
- SHA-256 equality verification of all PR #77 imported sources.

## 24.3 Ready-for-governance-review criteria

The document can be submitted for independent product and engineering review when:

1. File integrity and exact version are recorded.
2. PR #77 intake discrepancies are resolved or explicitly accepted with proper limitations.
3. Product direction is matched to the Owner's formal decision.
4. Canonical source conflicts are listed and owned.
5. Requirement preservation and traceability are checked.
6. Independent UX/product review challenges the proposed journeys.
7. Documentation validators pass on the actual candidate.
8. No implicit implementation authority is claimed.

## 24.4 Activation rule

Only after formal decision and governance review should accepted deltas be integrated into the owning CX documents.

The product experience specification does not become an implementation work package without separate Engineering HQ feasibility, approval and bounded scope.

---

# 25. Final Product Principle

TeeStock should look and feel like an apparel brand, not a database or printing-service administration portal.

Customer-facing complexity should remain low even as internal capability grows.

Every additional feature should justify itself through:

- Better product discovery.
- Greater customer confidence.
- Easier legitimate purchase.
- More reliable post-order experience.
- Reduced founder administrative burden.
- Sustainable business economics.

**Premium appearance is valuable. Trusted behavior is essential.**

---

**END — CX-PKG-RETAIL-SHOP-EXPERIENCE-R1 v0.1.0**

**STATUS:** ACTIVE  
**CANONICAL AUTHORITY:** ACTIVE_RETAIL_EXPERIENCE_SPECIFICATION  
**IMPLEMENTATION AUTHORIZATION:** NONE  
**NEXT GATE:** Controlled CX documentation reconciliation into parent CX specifications.
