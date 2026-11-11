# Little Treat — Belanja & Keuangan v1 (Local-first)

**Status:** operator finance MVP, **single-browser only**, not multi-user, not production bookkeeping certified, and not a replacement for a professional accountant.

## Usage
- **Belanja → Daftar kebutuhan**: estimate planned shopping quantity, unit prices, priority, supplier. Planning entries do **not** move cash or affect profit.
- **Belanja → Catat pembelian**: record actual paid purchases. Categories: ingredients, packaging, equipment/assets, operating expenses; include delivery and acquisition expenses.
- **Keuangan → Catat penjualan**: record daily or per-order gross sales by channel, merchant-funded discount/refund, app/payment fees, product cost (HPP), and whether payout has actually been received.
- **Keuangan → Aset**: straight-line depreciation starts in the month equipment is put into use; residual value and lifetime entered by owner.
- **Keuangan → Ringkasan**: compare revenue / estimated profit to actual cash receipts / cash payments, select calendar month.
- **Backup**: export complete JSON for same-device recovery or portable archival, CSV for reconciliation in a spreadsheet.

## Financial logic in IDR
- Gross sales (omzet kotor): sale.gross.
- Net revenue (pendapatan setelah diskon/refund): gross – merchant-funded discounts – refunds.
- Expected/settled payout: net revenue – platform fees – other payment fees.
- Sales contribution: expected payout – HPP (cost of goods sold entered for orders).
- **Estimated operating profit**: sum contribution – operating-expense purchases in the same month – straight-line depreciation of equipment used in that month.
- **Cash flow**: payout actually received *in that month* – all actual paid purchases in that month (including ingredients, packaging, equipment, and operating expenses). This is a cash-movement proxy, not a closing cash balance.
- **Inventory purchases do not directly reduce profit**. They reduce cash and acquire stock. Their consumption must be included in the HPP field when products are sold.
- Equipment purchase reduces cash when paid; depreciation is *not* an additional cash payment. Straight-line monthly expense = (acquisition cost – estimated residual value) / useful-life months, beginning in service month. Monthly allocations are computed in decimals, rounded for display.

## Boundaries / caveats
- Data kept only in browser localStorage. It can disappear with cleared site data, private browsing, browser/profile change, or device loss; **export JSON backups**.
- No cross-device sync or authentication. Do not use finance on shared staff devices. Anyone with access to the same browser profile can read/change local data. Vercel deployment protection does **not** confer record-level employee roles.
- No balances carried forward, stock count or valuation method (FIFO/average), purchase-on-credit, receivables, multi-outlet support, accounting adjustments, tax/VAT, financing, reconciled bank statements or audited books.
- Manually entered HPP may be incomplete; the displayed profit is only an **estimate**. Enter true direct costs including consumed material and packaging, not just ingredient purchases.
- Payout must be recorded as *paid* only after the funds are received. Until that point, sale affects net revenue and estimated profit but not cash.
- Voiding a transaction requires a reason, preserves the original record, and excludes it from totals. The browser owner can still tamper with the JSON; this is **not** tamper-evident/audited storage.
- The reporting period uses the local Indonesia calendar month. This does not establish a fiscal or tax accounting policy.

## Recommended Supabase v2 — approval required
When the owner selects a dedicated Supabase organization/project, provision a separate Little Treat project (do **not** use \`mgbos-production\`), with Supabase Auth and RLS. Recommended tables:
- \`organizations\`, \`memberships\` (owner/admin/operator roles stored in DB, never user_metadata)
- \`purchase_plans\`, \`purchases\`, \`sales\`, \`asset_register\`
- \`inventory_items\`, \`stock_movements\`, \`bank_payouts\`, \`audit_events\`

Owner/admin may view and reconcile finance; staff may create limited expense/order drafts but must not view aggregated financial reports or edit approved entries. Multi-device, ledger immutability, supplier inventory receiving and bank reconciliation are separate, gated work packages. Use publishable key only in frontend and RLS for authorization. Do not deploy these until verified end to end.

## Security
- Avoid storing customer contact data, card details, marketplace passwords, government IDs or supplier agreements in this MVP.
- Treat exports as sensitive financial files: keep them under owner control and restrict cloud sharing.
- Current application source is on a publicly accessible GitHub repository, but local financial entries themselves are not pushed to GitHub or Vercel by this feature.


## Addendum v2 — Persediaan, penerimaan belanja, dan modal pemilik

1. **Bayar ≠ terima barang.** Saat membeli bahan/kemasan, tandai apakah sudah diterima. Pembayaran langsung mengurangi arus kas, tetapi stok baru bertambah jika barang benar-benar sampai. Jika belum, tekan **Terima stok** di riwayat pembelian setelah barang datang.
2. **Master barang** memakai kunci nama + satuan + kategori. Contoh: "Pisang kepok" dalam kg dan pcs adalah barang berbeda; pilih satuan konsisten. Nilai stok estimasi dihitung sebagai moving weighted-average cost dari pembelian/penerimaan.
3. **Saldo awal** dapat dicatat untuk barang yang sudah dimiliki sebelum aplikasi dipakai. Jangan memasukkan saldo awal barang yang sudah punya transaksi masuk, dan jangan mendobelkan pembelian.
4. **Pemakaian / waste** mengurangi stok fisik. Waste yang tercatat menjadi beban terpisah dalam estimasi laba bulan terkait. **HPP penjualan harus mengecualikan waste yang sudah dibebankan secara terpisah**, tetapi tetap mencakup bahan yang dipakai untuk menghasilkan barang terjual dan kemasan.
5. **Modal masuk / prive** menambah atau mengurangi arus kas, tetapi tidak memengaruhi omzet atau laba. Catat setoran awal usaha sebagai modal masuk supaya perubahan kas dapat dipahami.
6. **Ambang stok** dapat ditetapkan per jenis barang untuk membantu daftar belanja, tidak memesan barang secara otomatis.
7. **Backup lama** versi 1 dimigrasikan tanpa menghapus transaksi. Stok masa lalu tidak direkonstruksi otomatis dari pembelian historis untuk menghindari penghitungan ganda; mulai dengan saldo awal fisik jika diperlukan.

### Yang sengaja belum otomatis
- Rekonsiliasi marketplace/QRIS, data pesanan per produk, HPP dari resep, biaya bahan per batch, alokasi tenaga kerja, penyusutan fiskal, hutang/piutang, dan biaya modal.
- FEFO dan nomor batch, tanggal kedaluwarsa bahan frozen, pengingat persediaan saat pindah shift.
- Sinkronisasi antar-device, autentikasi karyawan dan pembatasan peran.

**Risiko:** seluruh catatan keuangan masih berada dalam localStorage pada origin preview yang sedang dibuka. Setiap deployment dengan hostname berbeda memiliki penyimpanan berbeda. Selalu ekspor JSON sebelum pindah browser, reset data situs, atau memakai preview baru. Jangan menganggap link preview sebagai layanan akuntansi multi-karyawan yang aman.
