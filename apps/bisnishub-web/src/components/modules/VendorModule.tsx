import React, { useState } from 'react'
import { Vendor } from '../../types'
import { INITIAL_VENDORS } from '../../mockData'
import { Truck, Phone, MapPin, CreditCard, Star, ExternalLink, Plus, Copy, Check } from 'lucide-react'

export const VendorModule: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const saved = localStorage.getItem('bh_vendors')
    return saved ? JSON.parse(saved) : INITIAL_VENDORS
  })
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  // New vendor form state
  const [name, setName] = useState('')
  const [category, setCategory] = useState<'garment' | 'dtf_print' | 'packaging' | 'expedition'>('garment')
  const [pic, setPic] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [pricingNotes, setPricingNotes] = useState('')
  const [bankAccount, setBankAccount] = useState('')

  const handleCopyBank = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleSaveVendor = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !phone) return

    const newV: Vendor = {
      id: `vnd-${Date.now()}`,
      name,
      category,
      pic: pic || 'PIC Sales',
      phone: phone.replace(/[^0-9]/g, ''),
      address: address || 'Alamat belum diatur',
      pricingNotes: pricingNotes || 'Belum ada catatan harga',
      bankAccount: bankAccount || 'Belum ada rekening',
      rating: 5,
      status: 'active'
    }

    const updated = [newV, ...vendors]
    setVendors(updated)
    localStorage.setItem('bh_vendors', JSON.stringify(updated))
    setShowAddModal(false)
    setName('')
    setPhone('')
    setAddress('')
    setPricingNotes('')
    setBankAccount('')
  }

  const filtered = vendors.filter((v) =>
    filterCategory === 'all' ? true : v.category === filterCategory
  )

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'garment':
        return <span className="rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/30 px-2 py-0.5 text-[10px] font-bold">Kaos Polos NSA</span>
      case 'dtf_print':
        return <span className="rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2 py-0.5 text-[10px] font-bold">DTF Roll 58cm</span>
      case 'packaging':
        return <span className="rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold">Kemasan / Stiker</span>
      case 'expedition':
        return <span className="rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 text-[10px] font-bold">Logistik / Resi</span>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hub-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Truck className="h-5 w-5 text-multigraph" />
            <span>Database Vendor & Mitra Maklon</span>
          </h2>
          <p className="text-xs text-hub-muted mt-0.5">
            Mitra rantai pasok terverifikasi untuk TeeStock & MultiGraph
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Category Filter */}
          <div className="flex rounded-xl bg-hub-card p-1 border border-hub-border text-xs">
            {['all', 'garment', 'dtf_print', 'packaging', 'expedition'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filterCategory === cat
                    ? 'bg-teestock text-white shadow-sm'
                    : 'text-hub-muted hover:text-white'
                }`}
              >
                {cat === 'all' ? 'Semua' : cat === 'garment' ? 'Garmen' : cat === 'dtf_print' ? 'DTF' : cat === 'packaging' ? 'Kemasan' : 'Kurir'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-multigraph px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-multigraph/20 hover:bg-emerald-600 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Tambah Vendor</span>
          </button>
        </div>
      </div>

      {/* Grid Vendor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((vendor) => (
          <div
            key={vendor.id}
            className="rounded-3xl border border-hub-border bg-hub-card p-5 shadow-lg hover:border-hub-border/80 transition-all space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{vendor.name}</h3>
                    {getCategoryBadge(vendor.category)}
                  </div>
                  <p className="text-xs text-hub-muted mt-1 flex items-center gap-1">
                    <span>PIC:</span> <strong className="text-slate-300 font-semibold">{vendor.pic}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-lg text-xs font-bold">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  <span>{vendor.rating}</span>
                </div>
              </div>

              {/* Pricing Notes */}
              <div className="mt-3 rounded-2xl bg-hub-bg/80 border border-hub-border/60 p-3 text-xs text-slate-300">
                <span className="text-[10px] font-bold text-teestock uppercase tracking-wider block mb-0.5">
                  Tarif & Ketentuan Maklon:
                </span>
                <p className="leading-relaxed text-xs">{vendor.pricingNotes}</p>
              </div>

              {/* Address & Bank Details */}
              <div className="mt-3 space-y-1.5 text-xs text-hub-muted">
                <div className="flex items-start gap-2">
                  <MapPin className="h-3.5 w-3.5 mt-0.5 text-slate-400 flex-shrink-0" />
                  <span className="text-[11px] leading-snug">{vendor.address}</span>
                </div>
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-hub-border/40">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                    <span className="text-[11px] font-mono text-slate-200">{vendor.bankAccount}</span>
                  </div>
                  <button
                    onClick={() => handleCopyBank(vendor.id, vendor.bankAccount)}
                    className="flex items-center gap-1 text-[10px] text-hub-muted hover:text-white transition-all"
                  >
                    {copiedId === vendor.id ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Disalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Salin Rek</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Action Button (WhatsApp) */}
            <div className="pt-2 border-t border-hub-border">
              <a
                href={`https://wa.me/${vendor.phone}?text=Halo%20${encodeURIComponent(vendor.pic)}%20saya%20Rizky%20dari%20TeeStock%2FMultiGraph`}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600/15 border border-emerald-500/30 py-2.5 text-xs font-bold text-emerald-400 hover:bg-emerald-600/25 transition-all"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Chat WhatsApp (+{vendor.phone})</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Vendor */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-hub-border bg-hub-card p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Tambah Vendor / Mitra Baru</h3>
            <p className="text-xs text-hub-muted mb-4">
              Simpan kontak dan rincian harga untuk referensi tim
            </p>

            <form onSubmit={handleSaveVendor} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Nama Vendor / Toko
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Cititex Tebet / Vendor DTF Roll"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-hub-border bg-hub-bg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Kategori Usaha
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full rounded-xl border border-hub-border bg-hub-bg px-3 py-2 text-xs text-white"
                >
                  <option value="garment">Garmen (Kaos Polos NSA)</option>
                  <option value="dtf_print">Percetakan DTF Roll 58cm</option>
                  <option value="packaging">Kemasan (Polymailer, Box, Stiker)</option>
                  <option value="expedition">Logistik / Kurir</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Nama PIC
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Mas Hendra"
                    value={pic}
                    onChange={(e) => setPic(e.target.value)}
                    className="w-full rounded-xl border border-hub-border bg-hub-bg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Nomor WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="628123456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full rounded-xl border border-hub-border bg-hub-bg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Catatan Tarif & Ketentuan Maklon
                </label>
                <textarea
                  placeholder="Contoh: Rp 28.000/meter untuk roll 58cm min 5m..."
                  value={pricingNotes}
                  onChange={(e) => setPricingNotes(e.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-hub-border bg-hub-bg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Alamat / Lokasi
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Senen Blok 3 Lt. 2 No. 44"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-hub-border bg-hub-bg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Nomor Rekening Bank
                </label>
                <input
                  type="text"
                  placeholder="Contoh: BCA 123-456-7890 a.n Nama"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  className="w-full rounded-xl border border-hub-border bg-hub-bg px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-xl border border-hub-border py-2 text-xs font-semibold text-hub-muted hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-multigraph py-2 text-xs font-bold text-white hover:bg-emerald-600 shadow-lg shadow-multigraph/20"
                >
                  Simpan Mitra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
