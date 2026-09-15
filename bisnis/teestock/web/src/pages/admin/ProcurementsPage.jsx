import React, { useState } from 'react';
import { 
  Plus, 
  PackageCheck, 
  Layers, 
  ScrollText, 
  Boxes, 
  Wallet, 
  Building2, 
  Search,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Input';
import { formatRupiah } from '../../utils/formatters';
import { GARMENT_TYPES, SIZES } from '../../constants/garments';

export function ProcurementsPage() {
  const { procurements, addProcurement, removeProcurement } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [itemType, setItemType] = useState('blank_tshirt');
  const [itemName, setItemName] = useState('');
  const [itemSku, setItemSku] = useState('');
  const [supplierName, setSupplierName] = useState('Distributor Resmi NSA');
  const [purchaseType, setPurchaseType] = useState('lusinan');
  const [qty, setQty] = useState(12);
  const [unitMeasure, setUnitMeasure] = useState('pcs');
  const [unitCost, setUnitCost] = useState(42000);
  const [shippingCost, setShippingCost] = useState(0);
  const [paymentSource, setPaymentSource] = useState('business_bank');
  const [notes, setNotes] = useState('');

  // Inventory Auto-Sync Selectors
  const [garmentKey, setGarmentKey] = useState('nsa_heavyweight_24s');
  const [color, setColor] = useState('Hitam');
  const [size, setSize] = useState('L');
  const [supplyId, setSupplyId] = useState('polymailer');
  const [dtfSku, setDtfSku] = useState('');
  const [keepOpen, setKeepOpen] = useState(false);

  // BOM Real-time Cost Calculation Preview
  const totalCost = (Number(qty || 0) * Number(unitCost || 0)) + Number(shippingCost || 0);
  const realUnitCost = Number(qty) > 0 ? Math.round(totalCost / Number(qty)) : 0;

  // Sync Helper for Blank Garment
  const updateGarmentSelection = (newKey, newCol, newSz) => {
    const targetKey = newKey || garmentKey;
    const gObj = GARMENT_TYPES[targetKey] || GARMENT_TYPES.nsa_heavyweight_24s;
    const availableColors = gObj?.colors?.map(c => c.name) || ['Hitam'];
    const targetCol = newCol !== undefined ? newCol : (availableColors.includes(color) ? color : availableColors[0]);
    const targetSz = newSz !== undefined ? newSz : size;

    setGarmentKey(targetKey);
    setColor(targetCol);
    setSize(targetSz);

    const generatedName = `${gObj.name} ${targetCol} ${targetSz}`;
    const cleanColor = targetCol.toUpperCase().replace(/\s+/g, '');
    const generatedSku = `${gObj.code || 'NSA'}-${cleanColor}-${targetSz}`;

    setItemName(generatedName);
    setItemSku(generatedSku);
    setUnitMeasure('pcs');
    if (gObj.baseCost) {
      setUnitCost(gObj.baseCost);
    }
  };

  // Sync Helper for Packaging & Supplies
  const updateSupplySelection = (newSupplyId) => {
    setSupplyId(newSupplyId);
    const sup = GARMENT_TYPES.supplies?.items?.find(s => s.id === newSupplyId);
    if (sup) {
      setItemName(sup.name);
      setItemSku(`MAT-${sup.id.toUpperCase()}`);
      setUnitMeasure(sup.unit || 'pcs');
      if (sup.id === 'polymailer') {
        setUnitCost(800);
        setSupplierName('MultiGraph Packaging & Printing');
      } else if (sup.id === 'sticker') {
        setUnitCost(600);
        setSupplierName('MultiGraph Printing');
      } else if (sup.id === 'care_card') {
        setUnitCost(400);
        setSupplierName('MultiGraph Printing');
      } else if (sup.id === 'hangtag') {
        setUnitCost(500);
        setSupplierName('MultiGraph Printing');
      } else if (sup.id === 'teflon_sheet') {
        setUnitCost(25000);
        setSupplierName('Vendor Alat Sablon');
      } else if (sup.id === 'lakban') {
        setUnitCost(15000);
        setSupplierName('Toko ATK');
      }
    }
  };

  const handleOpenNew = (presetType = 'blank_tshirt') => {
    setItemType(presetType);
    if (presetType === 'blank_tshirt') {
      const gObj = GARMENT_TYPES.nsa_heavyweight_24s;
      setGarmentKey('nsa_heavyweight_24s');
      setColor('Hitam');
      setSize('L');
      setItemName('NSA Heavyweight 24s Hitam L');
      setItemSku('NSA-24S-HITAM-L');
      setSupplierName('Distributor Resmi NSA');
      setPurchaseType('lusinan');
      setQty(12);
      setUnitMeasure('pcs');
      setUnitCost(gObj?.baseCost || 42000);
      setShippingCost(0);
    } else if (presetType === 'dtf_film') {
      setItemName('Roll Film DTF 58 cm x 10 m');
      setItemSku('DTF-ROLL-58CM');
      setSupplierName('Vendor DTF Partner');
      setPurchaseType('roll_meter');
      setQty(10);
      setUnitMeasure('meter');
      setUnitCost(30000);
      setShippingCost(0);
    } else if (presetType === 'packaging' || presetType === 'supplies') {
      setItemType('packaging');
      setSupplyId('polymailer');
      const sup = GARMENT_TYPES.supplies?.items?.find(s => s.id === 'polymailer');
      setItemName(sup?.name || 'Polymailer Hitam Doff 30x40');
      setItemSku('MAT-POLYMAILER');
      setSupplierName('MultiGraph Packaging & Printing');
      setPurchaseType('partai');
      setQty(48);
      setUnitMeasure('pcs');
      setUnitCost(800);
      setShippingCost(0);
    }
    setIsModalOpen(true);
  };

  // 1-Click Fast Presets (e.g. user scenario)
  const applyQuickPreset = (type) => {
    if (type === 'nsa24s_black_l') {
      setItemType('blank_tshirt');
      setGarmentKey('nsa_heavyweight_24s');
      setColor('Hitam');
      setSize('L');
      setItemName('NSA Heavyweight 24s Hitam L');
      setItemSku('NSA-24S-HITAM-L');
      setSupplierName('Distributor Resmi NSA');
      setPurchaseType('lusinan');
      setQty(12);
      setUnitMeasure('pcs');
      setUnitCost(42000);
      setShippingCost(0);
    } else if (type === 'nsa30s_white_l') {
      setItemType('blank_tshirt');
      setGarmentKey('nsa_softstyle_30s');
      setColor('Putih');
      setSize('L');
      setItemName('NSA Softstyle 30s Putih L');
      setItemSku('NSA-30S-PUTIH-L');
      setSupplierName('Distributor Resmi NSA');
      setPurchaseType('lusinan');
      setQty(12);
      setUnitMeasure('pcs');
      setUnitCost(37000);
      setShippingCost(0);
    } else if (type === 'sticker_35') {
      setItemType('packaging');
      setSupplyId('sticker');
      setItemName('Stiker Vinyl Unboxing 6x6 cm');
      setItemSku('MAT-STICKER');
      setSupplierName('MultiGraph Printing');
      setPurchaseType('partai');
      setQty(35);
      setUnitMeasure('pcs');
      setUnitCost(600);
      setShippingCost(0);
    } else if (type === 'polymailer_48') {
      setItemType('packaging');
      setSupplyId('polymailer');
      setItemName('Polymailer Hitam Doff 30x40');
      setItemSku('MAT-POLYMAILER');
      setSupplierName('MultiGraph Packaging & Printing');
      setPurchaseType('partai');
      setQty(48);
      setUnitMeasure('pcs');
      setUnitCost(800);
      setShippingCost(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemName.trim()) {
      alert('Mohon isi nama barang pengadaan');
      return;
    }

    await addProcurement({
      itemType,
      itemName: itemName.trim(),
      itemSku: itemSku.trim(),
      supplierName: supplierName.trim(),
      purchaseType,
      qty: Number(qty),
      unitMeasure,
      unitCost: Number(unitCost),
      shippingCost: Number(shippingCost),
      totalCost,
      realUnitCost,
      paymentSource,
      notes: notes.trim(),
      // Auto-sync inventory links
      garmentKey: itemType === 'blank_tshirt' ? garmentKey : null,
      color: itemType === 'blank_tshirt' ? color : null,
      size: itemType === 'blank_tshirt' ? size : null,
      supplyId: (itemType === 'packaging' || itemType === 'supplies') ? supplyId : null,
      dtfSku: itemType === 'dtf_film' ? (dtfSku.trim() || null) : null
    });

    if (!keepOpen) {
      setIsModalOpen(false);
      setNotes('');
    } else {
      setNotes('');
    }
  };

  // Metrics
  const totalProcurementSpend = procurements.reduce((sum, p) => sum + (p.totalCost || 0), 0);
  const blankProcurements = procurements.filter(p => p.itemType === 'blank_tshirt');
  const totalBlankPcs = blankProcurements.reduce((sum, p) => sum + (p.qty || 0), 0);
  const avgBlankCost = totalBlankPcs > 0 
    ? Math.round(blankProcurements.reduce((sum, p) => sum + p.totalCost, 0) / totalBlankPcs) 
    : 38000;
  const dtfMetersTotal = procurements
    .filter(p => p.itemType === 'dtf_film')
    .reduce((sum, p) => sum + (p.qty || 0), 0);

  // Filtered List
  const filtered = procurements.filter(p => {
    const matchType = filterType === 'all' || p.itemType === filterType;
    const matchQuery = !searchQuery || 
      p.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.procurementNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchQuery;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-ts-hitam">
      <AdminTopbar title="Pengadaan Bahan & BOM" />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header Title & Quick Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ts-borderDim pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-ts-terracotta/20 text-ts-terracotta border border-ts-terracotta/40">
                BOM &amp; INVENTORY
              </span>
              <h1 className="text-xl font-extrabold text-ts-krem tracking-wide">
                Pengadaan Bahan Baku &amp; Kemasan
              </h1>
            </div>
            <p className="text-xs text-ts-muted mt-1">
              Catat belanja Kaos NSA (satuan vs lusinan), Roll DTF meteran, dan kemasan. HPP satuan &amp; buku kas dihitung otomatis.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => handleOpenNew('packaging')}>
              + Kemasan (MultiGraph)
            </Button>
            <Button variant="secondary" size="sm" onClick={() => handleOpenNew('dtf_film')}>
              + Roll DTF
            </Button>
            <Button variant="primary" size="sm" onClick={() => handleOpenNew('blank_tshirt')}>
              <Plus className="w-4 h-4 mr-1" /> Catat Belanja Kaos
            </Button>
          </div>
        </div>

        {/* 4 Founder Procurement Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-ts-surface border-ts-border p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-ts-muted font-medium">Total Akumulasi Belanja</span>
              <div className="p-1.5 rounded-lg bg-ts-terracotta/20 text-ts-terracotta">
                <Boxes className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 font-mono font-bold text-xl text-ts-krem">
              {formatRupiah(totalProcurementSpend)}
            </div>
            <p className="text-[10px] text-ts-muted mt-1 font-mono">
              {procurements.length} Nota Pembelian Tercatat
            </p>
          </Card>

          <Card className="bg-ts-surface border-ts-border p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-ts-muted font-medium">Kaos NSA Diadakan</span>
              <div className="p-1.5 rounded-lg bg-ts-mustard/20 text-ts-mustard">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 font-mono font-bold text-xl text-ts-mustard">
              {totalBlankPcs} <span className="text-xs font-normal text-ts-muted">pcs</span>
            </div>
            <p className="text-[10px] text-ts-muted mt-1 font-mono">
              Moving Average: {formatRupiah(avgBlankCost)}/pcs
            </p>
          </Card>

          <Card className="bg-ts-surface border-ts-border p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-ts-muted font-medium">Roll Film DTF Masuk</span>
              <div className="p-1.5 rounded-lg bg-ts-teal/20 text-ts-teal">
                <ScrollText className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 font-mono font-bold text-xl text-ts-teal">
              {dtfMetersTotal} <span className="text-xs font-normal text-ts-muted">meter</span>
            </div>
            <p className="text-[10px] text-ts-muted mt-1 font-mono">
              Kapasitas ~{dtfMetersTotal * 4} Kaos A3
            </p>
          </Card>

          <Card className="bg-ts-surface border-ts-border p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-ts-muted font-medium">Sistem Pembukuan BOM</span>
              <div className="p-1.5 rounded-lg bg-ts-green/20 text-ts-green">
                <PackageCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 font-mono font-bold text-sm text-ts-green">
              Moving Average Cost
            </div>
            <p className="text-[10px] text-ts-muted mt-1 font-mono">
              Biaya Kemasan Terbagi Rata
            </p>
          </Card>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-ts-surface/60 p-3 rounded-xl border border-ts-borderDim">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'Semua Pengadaan' },
              { id: 'blank_tshirt', label: '👕 Kaos NSA' },
              { id: 'dtf_film', label: '🖨️ Roll DTF' },
              { id: 'packaging', label: '📦 Kemasan & Stiker' },
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
              placeholder="Cari PO / barang / vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-ts-hitam/80 border border-ts-border rounded-lg text-xs text-ts-krem placeholder-ts-muted focus:outline-none focus:border-ts-terracotta"
            />
          </div>
        </div>

        {/* Procurements Table */}
        <Card className="bg-ts-surface border-ts-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ts-hitam/60 border-b border-ts-borderDim text-ts-muted uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">No. PO &amp; Tanggal</th>
                  <th className="py-3 px-4">Bahan / Item</th>
                  <th className="py-3 px-4">Vendor / Supplier</th>
                  <th className="py-3 px-4 text-center">Tipe Beli</th>
                  <th className="py-3 px-4 text-center">Jumlah</th>
                  <th className="py-3 px-4 text-right">Harga Beli + Ongkir</th>
                  <th className="py-3 px-4 text-right">HPP Riil Satuan</th>
                  <th className="py-3 px-4 text-center">Sumber Dana</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ts-borderDim/50 text-ts-krem">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-8 text-center text-ts-muted">
                      Belum ada riwayat pengadaan yang cocok dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  filtered.map(p => (
                    <tr key={p.id} className="hover:bg-ts-surfaceHover/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-ts-krem">{p.procurementNo}</div>
                        <div className="text-[10px] text-ts-muted">
                          {new Date(p.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-ts-krem">{p.itemName}</div>
                        {p.itemSku && (
                          <span className="font-mono text-[10px] px-1 rounded bg-ts-hitam/60 text-ts-muted border border-ts-border">
                            {p.itemSku}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-ts-krem/90">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Building2 className="w-3.5 h-3.5 text-ts-muted shrink-0" />
                          <span>{p.supplierName}</span>
                          {p.supplierName && p.supplierName.toLowerCase().includes('multigraph') && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-ts-terracotta/20 text-ts-terracotta border border-ts-terracotta/30 shrink-0">
                              🏢 Sinergi Internal
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono capitalize">
                        <Badge variant="outline" className="text-[10px]">
                          {p.purchaseType}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-ts-mustard">
                        {p.qty} {p.unitMeasure}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono">
                        <div className="font-bold text-ts-krem">{formatRupiah(p.totalCost)}</div>
                        {p.shippingCost > 0 && (
                          <div className="text-[10px] text-rose-400">
                            +Ongkir {formatRupiah(p.shippingCost)}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                          {formatRupiah(p.realUnitCost)}/{p.unitMeasure}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {p.paymentSource === 'personal_pocket' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Wallet className="w-3 h-3" /> Dompet Pribadi
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-ts-teal/10 text-ts-teal border border-ts-teal/20">
                            <Building2 className="w-3 h-3" /> Bank TeeStock
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => {
                            if (confirm(`Hapus data pengadaan ${p.procurementNo}?`)) {
                              removeProcurement(p.id);
                            }
                          }}
                          className="p-1 rounded text-ts-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Hapus Pengadaan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Modal Input Pengadaan Baru */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Catat Belanja / Pengadaan Bahan (BOM)"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quick Preset Buttons */}
          <div className="bg-ts-surfaceHover/50 p-2.5 rounded-xl border border-ts-borderDim space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-ts-muted">
              <span className="font-semibold flex items-center gap-1 text-ts-krem">
                <Sparkles className="w-3.5 h-3.5 text-ts-mustard" />
                Input Cepat Sesuai Belanja Rutin:
              </span>
              <span>1-Klik isi otomatis</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => applyQuickPreset('nsa24s_black_l')}
                className="px-2.5 py-1 rounded-lg bg-ts-hitam/80 hover:bg-ts-hitam text-[11px] font-mono font-medium text-ts-krem border border-ts-border transition-colors hover:border-ts-terracotta"
              >
                👕 NSA 24s Hitam L (12 pcs)
              </button>
              <button
                type="button"
                onClick={() => applyQuickPreset('nsa30s_white_l')}
                className="px-2.5 py-1 rounded-lg bg-ts-hitam/80 hover:bg-ts-hitam text-[11px] font-mono font-medium text-ts-krem border border-ts-border transition-colors hover:border-ts-terracotta"
              >
                👕 NSA 30s Putih L (12 pcs)
              </button>
              <button
                type="button"
                onClick={() => applyQuickPreset('polymailer_48')}
                className="px-2.5 py-1 rounded-lg bg-ts-hitam/80 hover:bg-ts-hitam text-[11px] font-mono font-medium text-ts-krem border border-ts-border transition-colors hover:border-ts-mustard"
              >
                📦 Polymailer (48 pcs)
              </button>
              <button
                type="button"
                onClick={() => applyQuickPreset('sticker_35')}
                className="px-2.5 py-1 rounded-lg bg-ts-hitam/80 hover:bg-ts-hitam text-[11px] font-mono font-medium text-ts-krem border border-ts-border transition-colors hover:border-ts-mustard"
              >
                🏷️ Stiker (35 pcs)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Kategori Bahan"
              value={itemType}
              onChange={(e) => handleOpenNew(e.target.value)}
            >
              <option value="blank_tshirt">👕 Kaos Polos NSA (Garmen)</option>
              <option value="dtf_film">🖨️ Roll Film DTF Meteran</option>
              <option value="packaging">📦 Kemasan (Polymailer, Stiker, Label)</option>
              <option value="supplies">⚡ Perlengkapan &amp; Listrik</option>
            </Select>

            <Select
              label="Tipe Pola Pembelian"
              value={purchaseType}
              onChange={(e) => setPurchaseType(e.target.value)}
            >
              <option value="satuan">Beli Satuan / Ecer (JIT Order)</option>
              <option value="lusinan">Beli Lusinan (12-24 pcs Grosir)</option>
              <option value="partai">Beli Partai Besar (≥72 pcs)</option>
              <option value="roll_meter">Beli Roll Meteran</option>
            </Select>
          </div>

          {/* Conditional Selectors for Blank Garment Auto-Sync */}
          {itemType === 'blank_tshirt' && (
            <div className="bg-ts-terracotta/10 border border-ts-terracotta/30 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ts-krem flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-ts-terracotta" />
                  Spesifikasi Kaos Polos NSA (Sinkronisasi Stok Otomatis)
                </span>
                <span className="text-[10px] font-mono text-ts-terracotta font-bold">
                  AUTO-SYNC INVENTORY
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Select
                  label="Model Garmen NSA"
                  value={garmentKey}
                  onChange={(e) => updateGarmentSelection(e.target.value, undefined, size)}
                >
                  {Object.entries(GARMENT_TYPES)
                    .filter(([k]) => k !== 'supplies')
                    .map(([k, g]) => (
                      <option key={k} value={k}>{g.name}</option>
                    ))}
                </Select>

                <Select
                  label="Warna Kaos"
                  value={color}
                  onChange={(e) => updateGarmentSelection(garmentKey, e.target.value, size)}
                >
                  {(GARMENT_TYPES[garmentKey]?.colors || []).map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </Select>

                <Select
                  label="Ukuran (Size)"
                  value={size}
                  onChange={(e) => updateGarmentSelection(garmentKey, color, e.target.value)}
                >
                  {SIZES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>
              </div>

              <div className="flex items-center gap-2 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <div>
                  <span className="font-bold">✨ Stok Terhubung:</span> Stok kaos{' '}
                  <span className="font-bold text-white underline">{GARMENT_TYPES[garmentKey]?.name} {color} {size}</span>{' '}
                  akan otomatis bertambah <span className="font-mono font-bold text-ts-mustard">+{qty} pcs</span> di Matriks Gudang saat disimpan.
                </div>
              </div>
            </div>
          )}

          {/* Conditional Selectors for Packaging Auto-Sync */}
          {(itemType === 'packaging' || itemType === 'supplies') && (
            <div className="bg-ts-mustard/10 border border-ts-mustard/30 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ts-krem flex items-center gap-1.5">
                  <Boxes className="w-3.5 h-3.5 text-ts-mustard" />
                  Pilih Kemasan / Material (Otomatis Masuk Stok MultiGraph/Studio)
                </span>
                <span className="text-[10px] font-mono text-ts-mustard font-bold">
                  AUTO-SYNC PACKAGING
                </span>
              </div>
              <div>
                <Select
                  label="Jenis Kemasan / Perlengkapan"
                  value={supplyId}
                  onChange={(e) => updateSupplySelection(e.target.value)}
                >
                  {GARMENT_TYPES.supplies?.items?.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.unit})
                    </option>
                  ))}
                </Select>
              </div>

              <div className="flex items-center gap-2 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <div>
                  <span className="font-bold">✨ Stok Terhubung:</span> Stok kemasan{' '}
                  <span className="font-bold text-white underline">
                    {GARMENT_TYPES.supplies?.items?.find(s => s.id === supplyId)?.name || supplyId}
                  </span>{' '}
                  akan otomatis bertambah <span className="font-mono font-bold text-ts-mustard">+{qty} {unitMeasure}</span> di tab Kemasan saat disimpan.
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <Input
                label="Nama Barang / Deskripsi Pengadaan"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              />
            </div>
            <Input
              label="SKU Terkait (Opsional)"
              placeholder="cth: NSA-24S-HITAM-L"
              value={itemSku}
              onChange={(e) => setItemSku(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Vendor / Supplier"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              required
            />
            <Select
              label="Sumber Dana Pembayaran"
              value={paymentSource}
              onChange={(e) => setPaymentSource(e.target.value)}
            >
              <option value="business_bank">🏦 Rekening Khusus TeeStock (Kas Bisnis)</option>
              <option value="personal_pocket">👛 Dompet Pribadi Founder (Injeksi Modal)</option>
            </Select>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <Input
              label="Jumlah (Qty)"
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              required
            />
            <Select
              label="Satuan"
              value={unitMeasure}
              onChange={(e) => setUnitMeasure(e.target.value)}
            >
              <option value="pcs">pcs</option>
              <option value="meter">meter</option>
              <option value="roll">roll</option>
              <option value="lembar">lembar</option>
            </Select>
            <Input
              label="Harga Beli Satuan (Rp)"
              type="number"
              value={unitCost}
              onChange={(e) => setUnitCost(e.target.value)}
              required
            />
            <Input
              label="Ongkir Vendor (Rp)"
              type="number"
              value={shippingCost}
              onChange={(e) => setShippingCost(e.target.value)}
            />
          </div>

          <Input
            label="Catatan Tambahan (Opsional)"
            placeholder="cth: Pembelian batch 1 warna hitam dan charcoal"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          {/* CFO Calculation Preview Card */}
          <div className="bg-ts-hitam/60 border border-ts-borderDim rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-ts-muted flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-ts-mustard" />
                Kalkulasi Otomatis Moving Average &amp; BOM:
              </span>
              <span className="font-mono text-ts-mustard font-bold">
                {qty} {unitMeasure}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="bg-ts-surface p-2 rounded-lg border border-ts-borderDim">
                <div className="text-[10px] text-ts-muted">Total Bayar Kas</div>
                <div className="font-mono font-bold text-ts-krem text-sm">
                  {formatRupiah(totalCost)}
                </div>
              </div>
              <div className="bg-ts-surface p-2 rounded-lg border border-ts-borderDim">
                <div className="text-[10px] text-ts-muted">HPP Satuan Bersih</div>
                <div className="font-mono font-bold text-emerald-400 text-sm">
                  {formatRupiah(realUnitCost)}/{unitMeasure}
                </div>
              </div>
              <div className="bg-ts-surface p-2 rounded-lg border border-ts-borderDim">
                <div className="text-[10px] text-ts-muted">Efek ke Buku Kas</div>
                <div className="font-mono font-bold text-xs text-ts-terracotta">
                  CASH_OUT (Belanja)
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-ts-borderDim">
            <label className="flex items-center gap-2 text-xs text-ts-muted cursor-pointer select-none">
              <input
                type="checkbox"
                checked={keepOpen}
                onChange={(e) => setKeepOpen(e.target.checked)}
                className="rounded border-ts-border text-ts-terracotta focus:ring-ts-terracotta bg-ts-hitam"
              />
              <span>Simpan &amp; Lanjut Input Barang Lain (Mode Cepat Nota Belanja)</span>
            </label>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit" variant="primary">
                Simpan Pengadaan &amp; Update Stok
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
