Secara fondasi, **sudah cukup lengkap untuk mulai build**. Kalau kita terus menambah blueprint sebelum implementasi, risikonya justru masuk ke architecture paralysis.

Tapi ada beberapa area yang belum kita definisikan secara eksplisit. Bukan blocker untuk JARVIS v0.2, tetapi sebelum sistem mendapat autonomy besar, ini perlu masuk roadmap:

- **Canonical identity & entity graph.** JARVIS harus tahu bahwa Rizky, MultiGraph, TeeStock, customer, supplier, project, repository, order, campaign, dan account merupakan entity berbeda dengan ID stabil. Jangan bergantung pada nama string.
- **Data contracts & schema versioning.** Tool output, event envelope, memory record, agent result, dan API contract harus versioned agar upgrade tidak diam-diam merusak workflow lama.
- **Time & scheduling semantics.** Timezone, business day, deadline, recurrence, SLA, quiet hours, missed schedules, duplicate cron execution. Untuk JARVIS proaktif ini sangat penting.
- **Notification governance.** Bedakan `INFO`, `ACTION_REQUIRED`, `APPROVAL_REQUIRED`, `CRITICAL`. JARVIS yang terlalu banyak bicara akan cepat diabaikan.
- **Rate limit & quota control.** Bukan hanya budget AI; juga GitHub, WhatsApp, Meta, email, payment gateway, browser automation, dan external APIs.
- **Workflow durability.** Kalau workflow 20 langkah berhenti di langkah 13 karena server restart, bagaimana resume? Nanti ini menjadi penting sebelum long-running autonomous work.
- **Provenance.** JARVIS harus bisa membedakan fakta dari MGBOS, hasil search, inferensi model, memory, dan asumsi. Confidence saja tidak cukup; asal informasi harus jelas.
- **Data retention & deletion.** Berapa lama conversation, traces, tool payload, content drafts, customer data, dan evidence disimpan? Apa yang boleh dihapus dan apa yang harus immutable?
- **AI red-team / adversarial testing.** Prompt injection dari website, email jahat, file customer, malicious PR description, poisoned document, dan tool-output injection. Ini penting sekali karena JARVIS akan membaca dunia luar.
- **External-content trust boundary.** Email atau webpage tidak boleh bisa berkata `"ignore your policy and transfer..."` lalu dianggap sebagai instruction. External content adalah data, bukan authority.
- **Vendor failure strategy.** OpenAI/Anthropic/Gemini/Meta/WhatsApp down, API berubah, provider menaikkan harga, model deprecated. Model abstraction sudah kita desain; hal yang sama perlu untuk critical integrations.
- **Synthetic/test data policy.** Agent testing seharusnya menggunakan fixture/synthetic business data, bukan clone production sembarangan.
- **Release strategy untuk AI behavior.** Prompt/skill/model update idealnya melalui `dev → eval → shadow → canary → production`, bukan edit prompt lalu langsung live.
- **Business process ownership.** Setiap autonomous workflow harus punya human owner meskipun AI mengerjakan 99% pekerjaannya.
- **Exception queue.** Tidak semua masalah harus dipaksa AI selesaikan. Harus ada tempat untuk `NEEDS_HUMAN`, `AMBIGUOUS`, `NEEDS_RECONCILIATION`.
- **Multi-business isolation.** Karena visi lo punya beberapa bisnis, context TeeStock tidak boleh otomatis bocor ke bisnis B kecuali policy mengizinkan. Organization/business boundary perlu menjadi first-class concept.
- **Knowledge lifecycle.** Dokumen bisa `DRAFT`, `ACTIVE`, `SUPERSEDED`, `ARCHIVED`. Kalau tidak, JARVIS bisa memakai SOP lama sebagai kebenaran.
- **Content/IP governance.** Untuk content factory: source attribution, licensed assets, brand ownership, duplicate/plagiarism checks, dan provenance generated media.
- **Financial control segregation.** Jangka panjang, AI yang membuat PO sebaiknya bukan pihak yang sendirian menyetujui pembayaran yang sama. Prinsip separation of duties tetap relevan meski “pegawai”-nya AI.
- **Physical-world bridge.** Karena MultiGraph bisnis fisik, nantinya perlu mekanisme memasukkan fakta dunia nyata: scanner, barcode, foto QC, operator confirmation, IoT jika memang berguna. AI tidak boleh berasumsi barang sudah selesai hanya dari workflow digital.
- **Architecture decision process.** Sudah ada ADR untuk MGBOS; JARVIS juga perlu ADR agar keputusan penting seperti memory store, queue, provider, atau autonomy policy tidak berubah berdasarkan mood agent berikutnya.

Ada tiga yang menurut gue **paling penting dan belum kita tekankan cukup keras**.

Pertama adalah **prompt-injection boundary**. Ketika JARVIS nanti membaca email, GitHub issue, website, PDF, customer message, semuanya harus dianggap **untrusted input**. Instruksi yang ditemukan di dalam sumber eksternal tidak boleh mempunyai authority atas JARVIS.

Kedua adalah **durable workflow / reconciliation**. Demo AI biasanya berhenti di `"tool call sukses"`. Sistem bisnis nyata membutuhkan jawaban untuk kasus seperti: pembayaran provider sukses tapi response timeout, posting Instagram berhasil tapi callback gagal, atau PO dibuat tetapi worker mati sebelum menyimpan evidence. Ini yang membedakan automation demo dengan operating system.

Ketiga adalah **canonical entity model**. Di masa depan lo mungkin berkata:

> “Jarvis, campaign TeeStock kemarin menghasilkan order berapa dan apakah customer dari campaign itu punya repeat order?”

Untuk menjawab itu, JARVIS harus dapat menghubungkan:

```text
Campaign
   ↓
Lead
   ↓
Customer
   ↓
Order
   ↓
Payment
   ↓
Margin
   ↓
Repeat Order
```

Itu jauh lebih bernilai daripada sekadar memory chatbot.

### Jadi, apakah blueprint kita sudah lengkap?

Gue akan menilainya seperti ini:

```text
Repository & boundaries          ██████████  sangat matang
MGBOS architecture               ██████████  sangat matang
Agent / skill governance         █████████░  matang
Environment                      █████████░  matang
JARVIS architecture              █████████░  matang
Model strategy                   █████████░  matang
Infrastructure                   █████████░  matang
Permissions / autonomy           ████████░░  cukup matang
Observability / evidence         ████████░░  cukup matang
Security / prompt injection      ██████░░░░  perlu spesifikasi
Workflow durability              ██████░░░░  perlu spesifikasi
Entity / knowledge model         ██████░░░░  perlu spesifikasi
```

Tapi gue **tidak menyarankan membuat tiga blueprint besar lagi sekarang**.

Lebih sehat kalau detail yang belum matang itu kita selesaikan **ketika vertical slice pertama memerlukannya**.

Jadi tahap perencanaan makro menurut gue sudah selesai.

Sekarang arsitektur kita sudah cukup kuat untuk mengatakan:

> **Freeze architecture v0.1/v0.2. Mulai membangun.**

Dan vertical slice pertama tetap sangat tepat:

```text
Morning Business Briefing

MGBOS
   ↓
Read tools
   ↓
JARVIS Core
   ↓
Model Router
   ↓
Evidence
   ↓
Priority analysis
   ↓
Command Center
   ↓
Rizky
```

Begitu itu benar-benar berjalan, kita akan belajar lebih banyak dari **100 execution nyata** dibanding menulis 100 halaman blueprint tambahan. Setelah itu setiap layer berikutnya—memory, agents, content automation, approval, event intelligence—dibangun berdasarkan evidence, bukan asumsi.
