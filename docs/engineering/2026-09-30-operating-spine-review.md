# Review pengembangan MGBOS dan integrasi dokumentasi — 30 September 2026

## Keputusan

**REQUEST CHANGES. Jangan gabungkan seluruh working tree ke main sebelum temuan P1 dan gate yang gagal diselesaikan.**

Review ini dilakukan oleh satu executor (Codex), bukan independent review. Cakupan: PR #15 pada `b8ce841aa484e0c52b4f87615718407bb7dc7aaf` terhadap main `9aa8a698b9b9daab6103a9e4139cd08adbb09fb4`, ditambah perubahan lokal Phase 1 yang belum committed. Working tree berubah selama sesi; hasil CI PR tidak membuktikan perubahan lokal lulus. Tidak ada perubahan kode produk, reset database, atau deployment dalam tahap review.

Prioritas P1 berarti harus diperbaiki sebelum integrasi transaksi/operasional; P2 berarti koreksi penting untuk keandalan dan bukti historis. Temuan SQL di bawah berasal dari penelusuran kode, kecuali hasil eksekusi yang dinyatakan secara eksplisit.

## Temuan

### F1 — P1: Pemeriksaan otorisasi order menerima role NULL

- Lokasi: `systems/mgbos/supabase/migrations/20260930160000_authoritative_order_lifecycle.sql:64–67` dan helper pada baris 29–44.
- Helper SQL mengembalikan NULL ketika actor tidak mempunyai membership aktif. `IF v_role NOT IN ('OWNER','ADMIN')` kemudian bernilai NULL, bukan TRUE, sehingga tidak menolak.
- Pemicu: backend/service-role memanggil RPC dengan actor yang ada di `app.users` tetapi bukan anggota organisasi order, atau membership sudah dinonaktifkan setelah pemeriksaan aplikasi. Audit FK actor tetap dapat terpenuhi.
- Dampak: pertahanan otorisasi pada database gagal; actor tersebut dapat mengubah status order organisasi target. Ini bukan klaim akses RPC publik: grant saat ini dibatasi ke service_role, dan action aplikasi masih memeriksa sesi.
- Solusi: helper wajib melempar error saat membership tidak ditemukan, atau gunakan `v_role IS NULL OR v_role NOT IN (...)`. Terapkan pola fail-closed secara konsisten. Helper shipment lama juga mengembalikan NULL dan RPC pengiriman baru mempertahankan pola rentan yang sama.
- Regresi: existing user tanpa membership, membership INACTIVE, user INACTIVE, organisasi INACTIVE, actor organisasi lain, dan role terlarang harus gagal tanpa perubahan status/audit.
- Bukti tambahan: ekspresi SQL read-only pada PostgreSQL lokal mengonfirmasi `(NULL::text NOT IN ('OWNER','ADMIN')) IS NULL = true`.

### F2 — P1: Duplikasi item dalam satu permintaan melewati kuota pengiriman

- Lokasi: `systems/mgbos/supabase/migrations/20260930190000_fulfillment_readiness_guard.sql:178–189` dan `225–243`.
- Semua baris diperiksa sebelum satu pun shipment item diinsert. Setiap pemeriksaan membaca jumlah pengiriman lama yang sama; jumlah item duplikat dalam payload tidak dijumlahkan.
- Pemicu: sisa kuota 10, payload berisi item A sebanyak 6 dan item A sebanyak 6. Kedua pemeriksaan melihat `0 + 6 <= 10`, lalu dua baris diinsert dengan total 12.
- Dampak: pengiriman dapat melebihi jumlah pesanan. Schema aplikasi menerima array tanpa pemeriksaan keunikan; tabel shipment_items tidak memiliki unique constraint per pasangan shipment/item. Ini regresi dibanding loop lama yang melakukan insert di dalam loop pemeriksaan.
- Solusi: tolak ID item duplikat di schema dan RPC, atau agregasikan quantity per order_item_id sebelum pemeriksaan. Pertahankan penguncian order untuk serialisasi antarpermintaan.
- Regresi: duplikasi 6+6 untuk kuota 10 harus ditolak secara atomik; tidak boleh meninggalkan shipment header, item, atau audit.

### F3 — P1: Status siap kirim belum membuktikan QC pernah lulus

- Lokasi: `systems/mgbos/supabase/migrations/20260930190000_fulfillment_readiness_guard.sql:98–114,154–170`, serta `20260930180000_production_assignment_lifecycle.sql:548–553`.
- Readiness guard mencari QC REWORK/REJECTED yang belum diselesaikan. Jika tidak ada inspeksi sama sekali, tidak ada blocker. Sementara itu command transisi job masih mengizinkan AWAITING_QC → READY_FOR_HANDOFF langsung tanpa hasil inspeksi.
- Pemicu: advance job ke READY_FOR_HANDOFF lewat command status, tanpa record QC, kemudian buat delivery order.
- Dampak: pengiriman dapat diloloskan tanpa bukti pemeriksaan mutu, meskipun migrasi menyebut COMPLETED with PASS QC dan backlog meminta QC-cleared quantity.
- Solusi: transisi siap handoff harus mengonsumsi bukti QC yang valid; readiness pengiriman wajib memeriksa hasil QC yang authoritative untuk job yang memang memerlukan QC. Jika suatu jenis pekerjaan tidak memerlukan QC, gunakan aturan pengecualian eksplisit.
- Regresi: READY_FOR_HANDOFF tanpa inspeksi ditolak; PASS yang valid diterima; REWORK/REJECTED lebih baru dari PASS ditolak. Tetapkan ordering deterministik jika timestamp inspeksi sama.

### F4 — P1: Empat suite database baru gagal sebelum menguji kontrak

- Lokasi: `systems/mgbos/supabase/tests/order_lifecycle.test.sql:24–25`, `vendor_assignment.test.sql:25`, `assignment_lifecycle.test.sql:35`, `fulfillment_readiness.test.sql:21`.
- Eksekusi database lokal: keempat berkas tersebut menjalankan **0 assertion** karena setup gagal. Order lifecycle menggunakan `CREATE TEMP TABLE ... AS INSERT ...`, vendor test menulis kolom organizations.name yang tidak ada, dan fixture CUSTOM_B2B tidak memenuhi check_order_type_sources.
- Masalah lanjutan: fulfillment_readiness.test.sql:240 memakai literal regex `/.../` yang bukan sintaks string PostgreSQL. Beberapa query dinamis order_lifecycle juga merujuk `org`/`owner_actor` tanpa FROM test_ctx.
- Dampak: daftar acceptance criteria dan tes aplikasi yang hijau memberi rasa aman tanpa benar-benar menguji RPC baru.
- Solusi: gunakan fixture sesuai skema atau command canonical; CTAS harus SELECT atau gunakan CTE INSERT RETURNING; betulkan nama kolom; quote regex dan gunakan assertion pgTAP yang sesuai. Jangan mengubah constraint produk agar fixture yang salah bisa masuk.
- Regresi: semua assertion yang direncanakan harus benar-benar dieksekusi, kemudian tambah kasus F1–F3 dan F5–F6.
- Dua suite existing juga gagal pada lingkungan lokal saat review: fast_retail_ordering (idempotent payload conflict) dan leads_pipeline (assertion 2). Penyebab regresi versus perbedaan data lokal belum dipastikan; jangan menyatakan semuanya disebabkan patch baru.

### F5 — P2: Urutan penguncian assignment dan job dapat deadlock

- Lokasi: `systems/mgbos/supabase/migrations/20260930180000_production_assignment_lifecycle.sql:42–57` berhadapan dengan `522–526,571–576`.
- accept/decline/cancel mengunci assignment lalu job. transition_production_job_status mengunci job lalu assignment.
- Pemicu: transaksi A menerima assignment dan menahan lock assignment; transaksi B mengubah status job dan menahan lock job. A menunggu job, B menunggu assignment.
- Dampak: PostgreSQL membatalkan salah satu transaksi dengan deadlock, sehingga aksi operasional gagal secara sporadis. Lock tidak menghilangkan race jika urutannya berbeda.
- Solusi: samakan urutan lock menjadi parent job → assignment di seluruh command. Baca referensi job lebih dahulu, lock parent, lalu baca ulang dan lock assignment serta validasi tenancy/state.
- Regresi: uji dua koneksi paralel untuk accept versus transition/cancel/reassign; pastikan tidak ada deadlock dan hanya state akhir yang sah.

### F6 — P1: Retry reassignment membatalkan assignment yang baru dibuat

- Lokasi: `systems/mgbos/supabase/migrations/20260930180000_production_assignment_lifecycle.sql:469–495`.
- RPC selalu mencari assignment aktif, membatalkannya, lalu membuat assignment baru. Tidak ada identitas request maupun expected previous assignment.
- Pemicu: reassignment A→B berhasil tetapi respons hilang. Retry payload yang sama membatalkan B dan menciptakan C; jika B sudah ACCEPTED, penerimaan itu ikut dibatalkan selama job belum masuk produksi.
- Dampak: riwayat, identitas SPK, dan acceptance vendor berubah akibat retry transport, bukan keputusan baru pengguna.
- Solusi: request_id unik dengan fingerprint payload dan hasil tersimpan secara atomik; tambahkan expected_assignment_id untuk menolak keputusan terhadap state yang sudah berubah. Retry identik harus mengembalikan ID assignment yang sama.
- Regresi: ulangi request setelah respons hilang; jumlah assignment/audit tidak bertambah. Replay dengan payload berbeda harus ditolak. Request lama setelah vendor menerima tidak boleh membatalkan acceptance.

### F7 — P2: Cetak ulang SPK historis menggunakan nama vendor terkini

- Lokasi: `systems/mgbos/packages/domain/src/workOrder.ts:260–269`; loader `apps/mgbos/src/lib/workOrder/load.server.ts` mengambil vendor master saat dokumen dibuka.
- Pemicu: assignment menyimpan vendor_name ketika pekerjaan dibuat, lalu master vendor diubah. Builder memilih `v?.name` lebih dahulu daripada `assignment.vendorName`, termasuk pada dokumen historis.
- Dampak: penerima tugas dalam cetak ulang bukti lama berubah mengikuti master terkini. Snapshot yang sudah disimpan menjadi tidak efektif.
- Solusi: gunakan snapshot assignment untuk identitas historis. Bedakan informasi kontak terkini dari snapshot dokumen; bila dokumen harus reproducible, simpan versi payload penerbitan secara eksplisit.
- Regresi: ubah nama master vendor sesudah assignment, lalu cetak ulang assignment historis; nama penerima lama tetap sama.

### F8 — P2: PR dokumentasi masih gagal gate judul

- PR: https://github.com/Rizkybuilds/bisnishub/pull/15, head `b8ce841aa484e0c52b4f87615718407bb7dc7aaf`.
- Check pr-gate gagal karena judul `update 2026-09-20 11-24` tidak memenuhi Conventional Commits. Tahap berikutnya belum terbukti lulus.
- Solusi: gunakan judul yang menjelaskan scope, misalnya `docs: organize MGBOS and JARVIS operating plans`, lalu jalankan ulang gate. Jangan melemahkan branch protection. Periksa kembali isolasi scope karena PR turut mengubah `.prettierignore` dan dokumen lintas bisnis.
- application, database, agent-governance, migration-immutability, repository-integrity pada head PR tersebut sukses. Hasil ini **tidak mencakup** 4 migrasi dan implementasi lokal yang belum committed.

## Bukti pemeriksaan

| Pemeriksaan | Hasil saat review | Batas |
| --- | --- | --- |
| Vitest | 58 berkas, 333 tes lulus | Unit/domain/action mock; bukan pembuktian RPC real |
| Typecheck workspace | Lulus | Bukan bukti transaksi/database |
| ESLint | Lulus | Tidak mendeteksi kesalahan logika SQL |
| SQL money lint | Lulus | Hanya pemeriksaan tipe uang yang dicakup script |
| pnpm check | Gagal format pada 24 berkas | Pipeline berhenti sebelum build; build/smoke baru belum diverifikasi |
| Database lokal | FAIL; 26 berkas, 378 assertion dieksekusi, 6 berkas bermasalah | Database existing, bukan fresh replay |
| Schema lokal | 4 migrasi 20260930160000–190000 tercatat sudah applied | Tidak di-reset/di-migrate oleh reviewer |
| Document reference validator | 39 dokumen lulus | Validasi declared local paths, bukan konsistensi seluruh isi |
| Governance validator | Lulus struktural, 3 warning kompatibilitas existing | Bukan evaluasi perilaku agent |
| Governance Python tests | 22 lulus sebelum perubahan paralel terbaru | Tidak mengesahkan snapshot yang lebih baru |
| Repository layout | Lulus saat awal pemeriksaan | Tidak membuktikan JARVIS runtime ada |

## Urutan penyelesaian

1. Pisahkan bukti dan integrasi PR dokumentasi dari working tree fitur yang masih aktif berubah. Jangan stage seluruh folder tanpa daftar eksplisit.
2. Perbaiki fixture database agar tes baru benar-benar berjalan.
3. Perbaiki otorisasi fail-closed, kuota pengiriman, QC evidence, dan idempotency reassignment; sertakan negative-path tests.
4. Samakan urutan lock dan pertahankan snapshot SPK historis.
5. Karena empat migrasi baru sudah applied pada database lokal, gunakan migrasi korektif baru sesuai aturan workspace; jangan diam-diam mengedit sejarah yang sudah applied.
6. Rapikan format pada berkas terkait, jalankan full check, database replay pada lingkungan disposable yang sesuai, pgTAP, dan production HTTP smoke; pastikan CI hijau pada SHA yang akan digabung.

## Efisiensi dan batas audit

Loader SPK melakukan beberapa read berurutan. Sesudah validasi organisasi pada job, fetch order, brand, assignment, dan item yang independen bisa dibatch untuk mengurangi latensi. Ini optimasi sekunder: ukur dahulu dan pertahankan filter organisasi serta allowlist data vendor.

Review berfokus pada boundary transaksi yang berubah dan kesiapan integrasi. Belum dilakukan audit semantik baris demi baris seluruh puluhan ribu baris spesifikasi JARVIS, pengujian browser lengkap, fresh database replay, concurrency test dua koneksi, atau verifikasi deployment. Temuan statis F1–F3/F5–F7 belum direproduksi end-to-end; skenario dan tes regresi di atas disediakan agar perbaikannya terukur. Dokumen ACTIVE dan test mock bukan bukti runtime/operational acceptance.

## Identitas snapshot penutupan review

UTC: 2026-09-30T09:51:52.667513+00:00

HEAD: `b8ce841aa484e0c52b4f87615718407bb7dc7aaf`

Fingerprint SHA-256 manifest 52 berkas MGBOS modified/untracked: `329028270bbad969b73ebdbb2991a5727f92885505dcf89df6409e5f296d185d`. Hash berikut merekam kondisi penutupan review; bukan klaim bahwa semua pemeriksaan awal dijalankan pada snapshot identik.

| Berkas | SHA-256 |
| --- | --- |
| `systems/mgbos/apps/mgbos/src/app/(app)/leads/LeadDetailModal.tsx` | `58b9913c02e7860a807feb9904172408f122234c98e380daa8bb9d319ca901dd` |
| `systems/mgbos/apps/mgbos/src/app/(app)/leads/LeadListTable.tsx` | `dc6e9b3ee2366630c13659a675343544d8062a6bec37bf1c989fce921776d677` |
| `systems/mgbos/apps/mgbos/src/app/(app)/leads/page.tsx` | `2b9dd557d2bfc5fed11445e14f486ae4905b0d778be1168f3de6cbe60bb03e4f` |
| `systems/mgbos/apps/mgbos/src/app/(app)/orders/OrderStatusActions.tsx` | `6cb3337902aa287e4ab63afeae7377689f0be8cdc1b4272ced0463bcdc74fa30` |
| `systems/mgbos/apps/mgbos/src/app/(app)/orders/[orderId]/page.tsx` | `60901d11f35c701bdb7ca628fe1d7a03b074fd13074814ebcf98be2322ffca6f` |
| `systems/mgbos/apps/mgbos/src/app/(app)/orders/actions.ts` | `30ab60cd6cd1a011b06b6555ce9e3e2ad19df99dab4756c234fc37b7ab99f008` |
| `systems/mgbos/apps/mgbos/src/app/(app)/production/AssignmentStatusActions.tsx` | `e36463ff8180701a015d2106a11e66abeaee93f9b1ce33032630256ee3dd2b83` |
| `systems/mgbos/apps/mgbos/src/app/(app)/production/JobAssignForm.tsx` | `8af443706232f233402ec6fa9923bcc28b4d1a9799bd5784cfa58a4ffd3885ab` |
| `systems/mgbos/apps/mgbos/src/app/(app)/production/[jobId]/page.tsx` | `5e0c73a46b16af87a3b6de9899f16d3a8358713ca96bb5a8271c56298f1935f6` |
| `systems/mgbos/apps/mgbos/src/app/(app)/production/actions.ts` | `e47e8b777dcc41591fbfa50ea4a0e481b184afc47b23feffd496bee78b834e4e` |
| `systems/mgbos/apps/mgbos/src/app/(app)/requirements/RequirementForm.tsx` | `d3ee15a5e5e87e9b97c52ea00bc383310903c6860b90940b982eaa1d053a80df` |
| `systems/mgbos/apps/mgbos/src/app/(app)/requirements/page.tsx` | `ce22f8e56f0786085770e7eaa51ac34e73b759391833525347acfeee7f3acc4f` |
| `systems/mgbos/apps/mgbos/src/app/(documents)/production/[jobId]/spk/WorkOrderActions.tsx` | `afa854d08eeff007f7dda53fbf3c07894838fb4a1be3f136e531b5cf29d3d471` |
| `systems/mgbos/apps/mgbos/src/app/(documents)/production/[jobId]/spk/page.tsx` | `87050c8b9fd6ef79af0e064c79d5aa0d0063e7058821948da745b1fcb0ef9b32` |
| `systems/mgbos/apps/mgbos/src/app/(documents)/production/[jobId]/spk/spk.css` | `4b3e9a9ed688f1e2dcb94be8c0657fe7e4938401537a5b963f219886ab275a86` |
| `systems/mgbos/apps/mgbos/src/lib/workOrder/load.server.ts` | `785e56912d221355ddf00be17f9acb329f272cdb898da0b36d99a0e8d7fd50f6` |
| `systems/mgbos/package.json` | `b0de78e3eaa9f5cf62a5625fe00a6c42fe7ac628f6ed71db3b1b51ada6b039f4` |
| `systems/mgbos/packages/auth/src/order-permissions.test.ts` | `50227711d0c36991ca77d6335754c5bc7ae9745884a7d902d333bb2e1bd06b2a` |
| `systems/mgbos/packages/domain/src/index.ts` | `28c3bfabda6b133f525a69a825e912867d38e8566f6cc60be15839386183f355` |
| `systems/mgbos/packages/domain/src/lead.test.ts` | `715cfac60832f31c6a431a2741261ab82a9389dd52ab018eb83832f17e88b9be` |
| `systems/mgbos/packages/domain/src/lead.ts` | `810e996ec4e572c9f85bf8f61640a2111428ad503808c89ddd1a509acb7fe2de` |
| `systems/mgbos/packages/domain/src/leadRequirementContinuation.test.ts` | `aec360e2b1650fd15dbe90181b3ca73f5231561b2abf63ccc930b7769dd31dad` |
| `systems/mgbos/packages/domain/src/order.ts` | `22c33137702c2ccd562bd9556b6b352b8db2c93ee3b1c39329a4afab833c8f2f` |
| `systems/mgbos/packages/domain/src/orderLifecycle.test.ts` | `c79a1f6abef97f985fc0db3eb0b0bb410f625848df63af4d55ce912e06496d71` |
| `systems/mgbos/packages/domain/src/production.test.ts` | `f6d61253510a58bae0ec45dc8fda131d158e9bf38c393655629610bd4ae4e4c4` |
| `systems/mgbos/packages/domain/src/production.ts` | `adb68e2274b2377f6cce68721615c079d92ebd771f3bd0936be71ed32641a0e0` |
| `systems/mgbos/packages/domain/src/productionAssignmentLifecycle.test.ts` | `090d0c78474764687a14b5f5da77d63f0272ee501d07a3a3e956ccca75447a62` |
| `systems/mgbos/packages/domain/src/shipment.test.ts` | `77233fb3c301f57d7890f87d52f018833d71a7114850a137cffc2aa95078fae5` |
| `systems/mgbos/packages/domain/src/shipment.ts` | `e3a0e68552c574931d0cbc6c8a82232aef0662fbf03e0a64050b7f8cf72950b3` |
| `systems/mgbos/packages/domain/src/workOrder.test.ts` | `65844e8ff58e020a4b4253936e0d86440d0821f9c92549f673cffd34187ecbd0` |
| `systems/mgbos/packages/domain/src/workOrder.ts` | `f82519a857d148e4a81b057c2977b9cb6f2f7652be97a2d22a0589880a095ebf` |
| `systems/mgbos/packages/validation/src/order.test.ts` | `c327e3d9c0e48ffc765e0a2570dad2e7d6b2875c71e63969437359f5e0e5a52e` |
| `systems/mgbos/packages/validation/src/order.ts` | `2bb8aee154607d95207684cfb809a6ab079f49be8ac8e90bd633d0e7f7ba17b2` |
| `systems/mgbos/packages/validation/src/production.test.ts` | `8eaf7b82d517aecf57058778eafe8d100537b40591d594269a6a9092c18ac281` |
| `systems/mgbos/packages/validation/src/production.ts` | `6eb190c17d14a32e35f230e58e08fc989df24018d67e79e155db2f938c915b8e` |
| `systems/mgbos/scripts/assignment-lifecycle-actions.test.ts` | `3599df95e3aa17df62e8788e55569b38a6bf2b6d98224fa126ca77963db876e9` |
| `systems/mgbos/scripts/empty-server-only.js` | `e39b3ba3a03ebd05f8c6b74b30c8d64aadcb46bfb86828e8f9772ce65319d25d` |
| `systems/mgbos/scripts/fulfillment-readiness-actions.test.ts` | `129f6ca63eaaa99a5f3f0bedf3a93e29024addd1880c946ef8fb5b709a169ee8` |
| `systems/mgbos/scripts/order-lifecycle-actions.test.ts` | `5083eb319d87ab0b925cdc972e2870073918d2e3bb659d4c7cbcc6ce15c2abcb` |
| `systems/mgbos/scripts/vendor-assignment-actions.test.ts` | `4136a4e21fbb92463bc271013c7560636f26227d0bccb74111577fea6f3d8ffe` |
| `systems/mgbos/scripts/verify-e2e-flow.mjs` | `e5bd85b69d483e4b79efae6d04d8bb1087b46f88b3e48534e29754e441a429f9` |
| `systems/mgbos/scripts/verify-happy-path-e2e.mjs` | `fce8fcf46787833091a7f51d39fd877266a69f3a97a5c6ad2c61ba6747861b98` |
| `systems/mgbos/scripts/work-order-artifact.test.ts` | `3c4dd83f19046cd6820ce43738826df453481d7c2598db98b99656f7fbbd0f84` |
| `systems/mgbos/supabase/migrations/20260930160000_authoritative_order_lifecycle.sql` | `99aff016db260df489571e68650273aa4898daed787724a41df788808445eb0c` |
| `systems/mgbos/supabase/migrations/20260930170000_vendor_backed_production_assignment.sql` | `701e03eb5f013a0e4af43a394b528b44dc19fa0c0665ee27c6ca239f26cb8ddd` |
| `systems/mgbos/supabase/migrations/20260930180000_production_assignment_lifecycle.sql` | `f7c188615bb06c1b7187ab6b2c7cadf0b9d1e143bafc8d3d6e71b9771768fd49` |
| `systems/mgbos/supabase/migrations/20260930190000_fulfillment_readiness_guard.sql` | `6f0f144f34cd437d8f53d66d24436dfe774ef93d28af0436b1226810eaec7dea` |
| `systems/mgbos/supabase/tests/assignment_lifecycle.test.sql` | `d2be07b457fe2a6a7196cf73f609e73458d9a2697638a3c74466d900a0d372a2` |
| `systems/mgbos/supabase/tests/fulfillment_readiness.test.sql` | `f86d506cbc30cb8cad9bfc39c5c5d51900b34646cd284f29feb191da9b8c8874` |
| `systems/mgbos/supabase/tests/order_lifecycle.test.sql` | `2c29535b2370c0ca885bcb28a0fd231700b03eec5053c2e0624d82a97433466a` |
| `systems/mgbos/supabase/tests/vendor_assignment.test.sql` | `e73e893ccfe5b68686d5d12a253523cfc255624abf844689a91aa882b861df4e` |
| `systems/mgbos/vitest.config.ts` | `08591e814cc81fa8db13590708135ae03dc1a9a92f66a77c9964bc4a8d83bb51` |
