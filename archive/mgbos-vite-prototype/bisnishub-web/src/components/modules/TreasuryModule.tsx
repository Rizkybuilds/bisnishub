import React, { useState } from 'react'
import { BusinessId, Transaction, HppItem } from '../../types'
import { ArrowDownRight, ArrowUpRight, Plus, Calculator, ShieldCheck, AlertTriangle, AlertCircle, DollarSign, Wallet } from 'lucide-react'

interface TreasuryModuleProps {
  businessFilter: BusinessId
  transactions: Transaction[]
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void
}

export const TreasuryModule: React.FC<TreasuryModuleProps> = ({
  businessFilter,
  transactions,
  onAddTransaction,
}) => {
  const [showAddModal, setShowAddModal] = useState(false)
  
  // Quick Transaction Form State
  const [txType, setTxType] = useState<'income' | 'expense' | 'transfer'>('income')
  const [txBusiness, setTxBusiness] = useState<'teestock' | 'multigraph'>('teestock')
  const [txCategory, setTxCategory] = useState('Penjualan')
  const [txAmount, setTxAmount] = useState('')
  const [txDesc, setTxDesc] = useState('')
  const [txProof, setTxProof] = useState('')

  // Live HPP Calculator State (TeeStock NSA 24s default)
  const [blankCost, setBlankCost] = useState(38000)
  const [dtfCost, setDtfCost] = useState(10000)
  const [electricCost, setElectricCost] = useState(1500)
  const [packCost, setPackCost] = useState(3000) // MultiGraph package
  const [overheadCost, setOverheadCost] = useState(1500)
  const [sellingPrice, setSellingPrice] = useState(99000)
  const [defectBufferRate, setDefectBufferRate] = useState(0.05) // 5%
  const [paymentFeeRate, setPaymentFeeRate] = useState(0.015) // 1.5% Midtrans

  // Calculations
  const rawCogs = blankCost + dtfCost + electricCost + packCost + overheadCost
  const bufferDefect = Math.round(rawCogs * defectBufferRate)
  const totalCogs = rawCogs + bufferDefect
  const paymentFee = Math.round(sellingPrice * paymentFeeRate)
  const netProfit = sellingPrice - totalCogs - paymentFee
  const netMarginPercent = ((netProfit / sellingPrice) * 100).toFixed(1)

  // Filtered transactions
  const filteredTx = transactions.filter((t) =>
    businessFilter === 'all' ? true : t.businessId === businessFilter
  )

  const totalIncome = filteredTx
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = filteredTx
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const netCashflow = totalIncome - totalExpense

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val)
  }

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    if (!txAmount || isNaN(Number(txAmount))) return

    onAddTransaction({
      businessId: businessFilter === 'all' ? txBusiness : (businessFilter as any),
      type: txType,
      category: txCategory,
      amount: Number(txAmount),
      description: txDesc || 'Transaksi tanpa keterangan',
      date: new Date().toISOString().split('T')[0],
      proofRef: txProof || undefined,
    })

    setTxAmount('')
    setTxDesc('')
    setTxProof('')
    setShowAddModal(false)
  }

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Kas Masuk */}
        <div className="rounded-2xl border border-hub-border bg-hub-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-hub-muted uppercase tracking-wider">
              Total Kas Masuk
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <ArrowDownRight className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-white tracking-tight">
            {formatRupiah(totalIncome)}
          </div>
          <p className="mt-1 text-[11px] text-emerald-400/90 flex items-center gap-1">
            <span>Penjualan & DP maklon</span>
          </p>
        </div>

        {/* Total Kas Keluar */}
        <div className="rounded-2xl border border-hub-border bg-hub-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-hub-muted uppercase tracking-wider">
              Total Kas Keluar
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-white tracking-tight">
            {formatRupiah(totalExpense)}
          </div>
          <p className="mt-1 text-[11px] text-rose-400/90">
            Bahan baku Cititex, DTF & Kemasan
          </p>
        </div>

        {/* Net Cashflow */}
        <div className="rounded-2xl border border-hub-border bg-hub-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-hub-muted uppercase tracking-wider">
              Net Arus Kas (Surplus)
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div
            className={`mt-2 text-2xl font-bold tracking-tight ${
              netCashflow >= 0 ? 'text-white' : 'text-rose-400'
            }`}
          >
            {formatRupiah(netCashflow)}
          </div>
          <p className="mt-1 text-[11px] text-hub-muted">
            Saldo operasional terkonsolidasi
          </p>
        </div>
      </div>

      {/* Grid 2 Kolom: HPP Simulator vs Riwayat Transaksi */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: CFO Live HPP Simulator */}
        <div className="lg:col-span-5 rounded-3xl border border-hub-border bg-hub-card p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-hub-border pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teestock/15 text-teestock">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">CFO Live HPP Simulator</h3>
                <p className="text-[11px] text-hub-muted">BOM & Validasi Margin Bersih Min 35%</p>
              </div>
            </div>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300">
              Rule #2 CFO
            </span>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setBlankCost(38000)
                setDtfCost(10000)
                setPackCost(3000)
                setSellingPrice(99000)
              }}
              className="flex-1 rounded-xl border border-teestock/40 bg-teestock/10 py-1.5 text-xs font-semibold text-[#F8704A] hover:bg-teestock/20 transition-all"
            >
              Preset NSA 24s (Rp99k)
            </button>
            <button
              onClick={() => {
                setBlankCost(32000)
                setDtfCost(10000)
                setPackCost(3000)
                setSellingPrice(89000)
              }}
              className="flex-1 rounded-xl border border-hub-border bg-hub-bg py-1.5 text-xs font-semibold text-hub-muted hover:text-white transition-all"
            >
              Preset NSA 30s (Rp89k)
            </button>
          </div>

          {/* Input Sliders & Numbers */}
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Kaos Polos (NSA Cititex):</span>
              <input
                type="number"
                value={blankCost}
                onChange={(e) => setBlankCost(Number(e.target.value))}
                className="w-28 rounded-lg border border-hub-border bg-hub-bg px-2 py-1 text-right text-white font-mono"
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-300">Cetak DTF (A3 / Roll):</span>
              <input
                type="number"
                value={dtfCost}
                onChange={(e) => setDtfCost(Number(e.target.value))}
                className="w-28 rounded-lg border border-hub-border bg-hub-bg px-2 py-1 text-right text-white font-mono"
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-300">Packing MultiGraph (Poly+Stiker):</span>
              <input
                type="number"
                value={packCost}
                onChange={(e) => setPackCost(Number(e.target.value))}
                className="w-28 rounded-lg border border-hub-border bg-hub-bg px-2 py-1 text-right text-white font-mono"
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-300">Listrik Press 155°C + Overhead:</span>
              <input
                type="number"
                value={electricCost + overheadCost}
                onChange={(e) => {
                  setElectricCost(Math.round(Number(e.target.value) / 2))
                  setOverheadCost(Math.round(Number(e.target.value) / 2))
                }}
                className="w-28 rounded-lg border border-hub-border bg-hub-bg px-2 py-1 text-right text-white font-mono"
              />
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-hub-border">
              <span className="font-semibold text-white">Target Harga Jual:</span>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="w-28 rounded-lg border border-teestock/50 bg-hub-bg px-2 py-1 text-right text-teestock font-bold font-mono text-sm"
              />
            </div>
          </div>

          {/* Calculator Output Box */}
          <div className="rounded-2xl border border-hub-border bg-hub-bg/90 p-4 space-y-3">
            <div className="flex justify-between text-xs text-hub-muted">
              <span>HPP Riil + 5% Defect Buffer:</span>
              <span className="font-mono text-white">{formatRupiah(totalCogs)}</span>
            </div>
            <div className="flex justify-between text-xs text-hub-muted">
              <span>Fee Midtrans / QRIS (1.5%):</span>
              <span className="font-mono text-white">{formatRupiah(paymentFee)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-hub-border">
              <div>
                <span className="text-xs text-hub-muted block">Laba Bersih / Kaos:</span>
                <span className="text-lg font-bold text-white font-mono">
                  {formatRupiah(netProfit)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-hub-muted block">Net Margin:</span>
                <span
                  className={`text-xl font-extrabold font-mono ${
                    Number(netMarginPercent) >= 35
                      ? 'text-emerald-400'
                      : Number(netMarginPercent) >= 25
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {netMarginPercent}%
                </span>
              </div>
            </div>

            {/* Status Guardrail CFO */}
            <div className="mt-2 pt-2 border-t border-hub-border">
              {Number(netMarginPercent) >= 35 ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20">
                  <ShieldCheck className="h-4 w-4 flex-shrink-0" />
                  <span>Margin Sehat! Memenuhi standar kelayakan CFO (&ge;35%).</span>
                </div>
              ) : Number(netMarginPercent) >= 25 ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-500/10 px-3 py-2 rounded-xl border border-amber-500/20">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <span>Peringatan: Margin 25-35%. Hanya izinkan untuk promo terbatas.</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 bg-rose-500/10 px-3 py-2 rounded-xl border border-rose-500/20">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Ditolak CFO! Margin &lt;25% berisiko boncos saat promo atau retur.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Transaction Log */}
        <div className="lg:col-span-7 rounded-3xl border border-hub-border bg-hub-card p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-hub-border pb-4 mb-4">
              <div>
                <h3 className="font-bold text-white text-base">Riwayat Kas & Arus Modal</h3>
                <p className="text-[11px] text-hub-muted">
                  Menampilkan {filteredTx.length} transaksi ({businessFilter === 'all' ? 'Semua Bisnis' : businessFilter})
                </p>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 rounded-xl bg-teestock px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-teestock/25 hover:bg-teestock-light active:scale-95 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Catat Transaksi</span>
              </button>
            </div>

            {/* List Transaksi */}
            <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
              {filteredTx.length === 0 ? (
                <div className="py-12 text-center text-hub-muted text-xs">
                  Belum ada transaksi untuk filter ini.
                </div>
              ) : (
                filteredTx.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-hub-border/70 bg-hub-bg/50 hover:bg-hub-cardHover transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                          t.type === 'income'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {t.type === 'income' ? (
                          <ArrowDownRight className="h-4 w-4" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{t.description}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-hub-muted font-mono">{t.date}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                            {t.category}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-teestock">
                            {t.businessId}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`font-mono text-sm font-bold ${
                          t.type === 'income' ? 'text-emerald-400' : 'text-slate-200'
                        }`}
                      >
                        {t.type === 'income' ? '+' : '-'} {formatRupiah(t.amount)}
                      </span>
                      {t.proofRef && (
                        <span className="block text-[9px] text-hub-muted font-mono">
                          {t.proofRef}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-hub-border bg-hub-card p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Catat Arus Kas Baru</h3>
            <p className="text-xs text-hub-muted mb-4">
              Pencatatan langsung untuk menjaga akuntabilitas keuangan
            </p>

            <form onSubmit={handleSaveTransaction} className="space-y-4">
              {/* Type selector */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTxType('income')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    txType === 'income'
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                      : 'border-hub-border text-hub-muted'
                  }`}
                >
                  Pemasukan (+)
                </button>
                <button
                  type="button"
                  onClick={() => setTxType('expense')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    txType === 'expense'
                      ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                      : 'border-hub-border text-hub-muted'
                  }`}
                >
                  Pengeluaran (-)
                </button>
              </div>

              {/* Bisnis selector */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Pilar Bisnis
                </label>
                <select
                  value={txBusiness}
                  onChange={(e) => setTxBusiness(e.target.value as any)}
                  className="w-full rounded-xl border border-hub-border bg-hub-bg px-3 py-2 text-xs text-white"
                >
                  <option value="teestock">TeeStock Apparel</option>
                  <option value="multigraph">MultiGraph Printing</option>
                </select>
              </div>

              {/* Nominal */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Nominal (Rp)
                </label>
                <input
                  type="number"
                  placeholder="Contoh: 99000"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  required
                  className="w-full rounded-xl border border-hub-border bg-hub-bg px-3 py-2 text-sm text-white font-mono"
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Kategori
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Bahan Kaos / Jasa Cetak DTF / Kemasan"
                  value={txCategory}
                  onChange={(e) => setTxCategory(e.target.value)}
                  className="w-full rounded-xl border border-hub-border bg-hub-bg px-3 py-2 text-xs text-white"
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Deskripsi / Keterangan
                </label>
                <input
                  type="text"
                  placeholder="Order #1001 / Belanja 12 pcs NSA Cititex"
                  value={txDesc}
                  onChange={(e) => setTxDesc(e.target.value)}
                  required
                  className="w-full rounded-xl border border-hub-border bg-hub-bg px-3 py-2 text-xs text-white"
                />
              </div>

              {/* No Bukti */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  No. Ref / Bukti Transfer (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="QRIS-MIDTRANS-123 / NOTA-4412"
                  value={txProof}
                  onChange={(e) => setTxProof(e.target.value)}
                  className="w-full rounded-xl border border-hub-border bg-hub-bg px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-xl border border-hub-border py-2 text-xs font-semibold text-hub-muted hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-teestock py-2 text-xs font-bold text-white hover:bg-teestock-light shadow-lg shadow-teestock/20"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
