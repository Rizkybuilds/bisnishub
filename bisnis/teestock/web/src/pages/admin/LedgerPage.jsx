import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  Plus, 
  Minus, 
  Building2, 
  Search, 
  ShieldCheck
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { formatRupiah } from '../../utils/formatters';

export function LedgerPage() {
  const { cashTransactions, recordCashTransaction, ledgerSummary, founderWealth } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('injection'); // injection | prive | custom
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [amount, setAmount] = useState(1000000);
  const [category, setCategory] = useState('personal_injection');
  const [sourceAccount, setSourceAccount] = useState('dompet_pribadi');
  const [destinationAccount, setDestinationAccount] = useState('bank_teestock');
  const [description, setDescription] = useState('');
  const [txType, setTxType] = useState('CASH_IN');

  const handleOpenAction = (mode) => {
    setModalMode(mode);
    if (mode === 'injection') {
      setTxType('CASH_IN');
      setCategory('personal_injection');
      setSourceAccount('dompet_pribadi');
      setDestinationAccount('bank_teestock');
      setDescription('Injeksi modal tambahan founder ke rekening operasional TeeStock');
      setAmount(1000000);
    } else if (mode === 'prive') {
      setTxType('CASH_OUT');
      setCategory('owner_prive');
      setSourceAccount('bank_teestock');
      setDestinationAccount('rekening_pribadi_founder');
      setDescription('Penarikan prive / gaji pemilik dari laba bersih usaha');
      setAmount(500000);
    } else {
      setTxType('CASH_OUT');
      setCategory('operational');
      setSourceAccount('bank_teestock');
      setDestinationAccount('PLN / Kuota / Operasional');
      setDescription('Biaya operasional bulanan');
      setAmount(150000);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() || Number(amount) <= 0) {
      alert('Mohon isi nominal dan keterangan transaksi');
      return;
    }

    await recordCashTransaction({
      transactionNo: `TX-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().slice(0, 10),
      type: txType,
      category,
      amount: Number(amount),
      sourceAccount,
      destinationAccount,
      description: description.trim(),
      isPersonalWallet: sourceAccount === 'dompet_pribadi' || destinationAccount === 'rekening_pribadi_founder'
    });

    setIsModalOpen(false);
  };

  const filteredTxs = cashTransactions.filter(tx => {
    const matchType = 
      filterType === 'all' || 
      (filterType === 'in' && tx.type === 'CASH_IN') ||
      (filterType === 'out' && tx.type === 'CASH_OUT') ||
      (filterType === 'injection' && tx.category === 'personal_injection') ||
      (filterType === 'prive' && tx.category === 'owner_prive');

    const matchQuery = !searchQuery || 
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.transactionNo.toLowerCase().includes(searchQuery.toLowerCase());

    return matchType && matchQuery;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-ts-hitam">
      <AdminTopbar title="Buku Kas & Modal Founder" />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ts-borderDim pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                FINANCIAL DISCIPLINE
              </span>
              <h1 className="text-xl font-extrabold text-ts-krem tracking-wide">
                Buku Kas Satu Pintu &amp; Pemisahan Dompet Pribadi
              </h1>
            </div>
            <p className="text-xs text-ts-muted mt-1">
              Catatan mutasi kas masuk, kas keluar, modal disetor founder, dan penarikan laba (prive) agar keuangan bisnis 100% transparan.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => handleOpenAction('prive')}>
              <Minus className="w-3.5 h-3.5 mr-1 text-rose-400" /> Tarik Prive / Gaji
            </Button>
            <Button variant="primary" size="sm" onClick={() => handleOpenAction('injection')}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Setor Modal Pribadi
            </Button>
          </div>
        </div>

        {/* 4 Financial Liquidity Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-ts-surface border-ts-border p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-ts-muted font-medium">Saldo Kas Operasional (Bank)</span>
              <div className="p-1.5 rounded-lg bg-ts-teal/20 text-ts-teal">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 font-mono font-bold text-xl text-ts-teal">
              {formatRupiah(founderWealth.netCashLiquidity)}
            </div>
            <p className="text-[10px] text-ts-muted mt-1 font-mono">
              Likuiditas Kas Siap Belanja Bahan
            </p>
          </Card>

          <Card className="bg-ts-surface border-ts-border p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-ts-muted font-medium">Modal Pribadi Disetor</span>
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 font-mono font-bold text-xl text-amber-400">
              {formatRupiah(founderWealth.totalInjected)}
            </div>
            <p className="text-[10px] text-ts-muted mt-1 font-mono">
              Injeksi Ekuitas Founder Terverifikasi
            </p>
          </Card>

          <Card className="bg-ts-surface border-ts-border p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-ts-muted font-medium">Prive / Gaji Founder Diambil</span>
              <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 font-mono font-bold text-xl text-rose-400">
              {formatRupiah(founderWealth.totalPrive)}
            </div>
            <p className="text-[10px] text-ts-muted mt-1 font-mono">
              Tarik Laba ke Dompet Pribadi
            </p>
          </Card>

          <Card className="bg-ts-surface border-ts-border p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-ts-muted font-medium">Modal Bersih Tertanam</span>
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 font-mono font-bold text-xl text-emerald-400">
              {formatRupiah(founderWealth.netFounderEquity)}
            </div>
            <p className="text-[10px] text-ts-muted mt-1 font-mono">
              Modal Disetor dikurangi Prive
            </p>
          </Card>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-ts-surface/60 p-3 rounded-xl border border-ts-borderDim">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'Semua Mutasi' },
              { id: 'in', label: '📥 Kas Masuk' },
              { id: 'out', label: '📤 Kas Keluar' },
              { id: 'injection', label: '💼 Modal Founder' },
              { id: 'prive', label: '💸 Prive Pemilik' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filterType === f.id
                    ? 'bg-ts-terracotta text-white shadow-sm'
                    : 'bg-ts-surface text-ts-krem/70 hover:text-white hover:bg-ts-surfaceHover border border-ts-border'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-ts-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari mutasi / keterangan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-ts-hitam/80 border border-ts-border rounded-lg text-xs text-ts-krem placeholder-ts-muted focus:outline-none focus:border-ts-terracotta"
            />
          </div>
        </div>

        {/* Cash Ledger Table */}
        <Card className="bg-ts-surface border-ts-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ts-hitam/60 border-b border-ts-borderDim text-ts-muted uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">No. Mutasi &amp; Tanggal</th>
                  <th className="py-3 px-4">Kategori Transaksi</th>
                  <th className="py-3 px-4">Keterangan / Deskripsi</th>
                  <th className="py-3 px-4 text-center">Rekening Sumber</th>
                  <th className="py-3 px-4 text-center">Rekening Tujuan</th>
                  <th className="py-3 px-4 text-right">Nominal Arus Kas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ts-borderDim/50 text-ts-krem">
                {filteredTxs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-ts-muted">
                      Belum ada mutasi kas yang cocok dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredTxs.map(tx => {
                    const isIn = tx.type === 'CASH_IN';
                    return (
                      <tr key={tx.id} className="hover:bg-ts-surfaceHover/60 transition-colors">
                        <td className="py-3.5 px-4 font-mono">
                          <div className="font-bold text-ts-krem">{tx.transactionNo}</div>
                          <div className="text-[10px] text-ts-muted">{tx.date}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border ${
                            tx.category === 'personal_injection' 
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : tx.category === 'owner_prive'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              : tx.category === 'procurement'
                              ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                              : isIn
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-ts-hitam/60 text-ts-muted border-ts-border'
                          }`}>
                            {tx.category === 'personal_injection' ? '💼 Injeksi Modal' :
                             tx.category === 'owner_prive' ? '💸 Prive Founder' :
                             tx.category === 'procurement' ? '📦 Belanja Bahan' :
                             tx.category === 'sales_order' ? '🛒 Penjualan Order' : '⚡ Operasional'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-ts-krem">{tx.description}</div>
                          {tx.relatedId && (
                            <span className="font-mono text-[10px] text-ts-muted">Ref: {tx.relatedId}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-[11px] text-ts-krem/80">
                          {tx.sourceAccount === 'dompet_pribadi' ? '👛 Dompet Pribadi' : 
                           tx.sourceAccount === 'bank_teestock' ? '🏦 Bank TeeStock' : tx.sourceAccount}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-[11px] text-ts-krem/80">
                          {tx.destinationAccount === 'rekening_pribadi_founder' ? '👛 Rekening Pribadi' :
                           tx.destinationAccount === 'bank_teestock' ? '🏦 Bank TeeStock' : tx.destinationAccount}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-sm">
                          <span className={isIn ? 'text-emerald-400' : 'text-rose-400'}>
                            {isIn ? '+' : '-'}{formatRupiah(tx.amount)}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Modal Input Transaksi Kas */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalMode === 'injection' ? 'Setor Modal Pribadi ke TeeStock' :
          modalMode === 'prive' ? 'Tarik Gaji / Prive Founder dari Bisnis' : 'Catat Transaksi Kas'
        }
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nominal Transaksi (Rp)"
            type="number"
            min="1000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Rekening Sumber"
              value={sourceAccount}
              onChange={(e) => setSourceAccount(e.target.value)}
              required
            />
            <Input
              label="Rekening Tujuan"
              value={destinationAccount}
              onChange={(e) => setDestinationAccount(e.target.value)}
              required
            />
          </div>

          <Input
            label="Keterangan / Alasan Mutasi"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="bg-ts-hitam/60 border border-ts-borderDim rounded-xl p-3 text-xs text-ts-muted">
            {modalMode === 'injection' ? (
              <p>💡 <strong>Injeksi Modal:</strong> Uang ini berasal dari dana pribadi Anda dan disetor ke kas TeeStock. Tercatat sebagai tambahan ekuitas bersih pemilik.</p>
            ) : modalMode === 'prive' ? (
              <p>💡 <strong>Prive Founder:</strong> Mengambil sebagian keuntungan bersih bisnis untuk keperluan pribadi secara tertib tanpa merusak modal kerja operasional.</p>
            ) : (
              <p>💡 Transaksi ini akan memperbarui saldo likuiditas kas operasional secara seketika.</p>
            )}
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-ts-borderDim">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Simpan Transaksi Kas
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
