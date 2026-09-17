import React, { useState, useEffect } from 'react';
import { 
  X, 
  Layers, 
  Package, 
  Printer, 
  Truck, 
  Sparkles, 
  Plus, 
  Trash2, 
  Calculator, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  FileSpreadsheet,
  Ruler,
  Scissors,
  Info,
  LayoutGrid
} from 'lucide-react';
import { GARMENT_TYPES, SIZES } from '../../constants/garments';
import { formatRupiah } from '../../utils/formatters';
import { useAdmin } from '../../context/AdminContext';

export function ProcurementIntakeModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialTab = 'wholesale_tshirt', 
  initialDesign = null 
}) {
  if (!isOpen) return null;

  const { multiUnitBalances, catalog } = useAdmin();

  // Active Intake Mode: 'wholesale_tshirt' | 'sticker_outsource' | 'packaging_supplies' | 'dtf_roll'
  const [activeTab, setActiveTab] = useState(initialTab || 'wholesale_tshirt');

  // Shared Form State
  const [paymentSource, setPaymentSource] = useState('business_bank');
  const [recordCashTx, setRecordCashTx] = useState(true);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TAB 5: DESIGN LICENSE STATE
  const [licenseItemName, setLicenseItemName] = useState('');
  const [licenseSku, setLicenseSku] = useState('');
  const [licenseSupplier, setLicenseSupplier] = useState('Etsy Digital Download');
  const [licenseCost, setLicenseCost] = useState(150000);
  const [licenseAmortization, setLicenseAmortization] = useState(25);

  // =========================================================================
  // TAB 1: WHOLESALE MIX T-SHIRT MATRIX STATE (72 pcs / Campur Ukuran & Warna)
  // =========================================================================
  const [garmentKey, setGarmentKey] = useState('nsa_heavyweight_24s');
  const [garmentSupplier, setGarmentSupplier] = useState('Distributor Resmi NSA / Cititex');
  const [garmentPricePerPcs, setGarmentPricePerPcs] = useState(40000);
  const [garmentShippingCost, setGarmentShippingCost] = useState(45000);

  // Colors included in the matrix
  const defaultColors = ['Hitam', 'Putih', 'Navy', 'Forest Green'];
  const [colorRows, setColorRows] = useState(defaultColors);
  const [newColorInput, setNewColorInput] = useState('');

  // Matrix quantities: { "Hitam": { "S": 6, "M": 12, "L": 12, "XL": 6 }, "Putih": { ... } }
  const [matrixData, setMatrixData] = useState({
    Hitam: { S: 6, M: 12, L: 12, XL: 6 },
    Putih: { S: 6, M: 12, L: 12, XL: 6 }
  });

  const handleCellChange = (color, size, value) => {
    const parsed = parseInt(value, 10);
    const qty = isNaN(parsed) || parsed < 0 ? 0 : parsed;
    setMatrixData(prev => ({
      ...prev,
      [color]: {
        ...(prev[color] || {}),
        [size]: qty
      }
    }));
  };

  const handleAddColorRow = () => {
    const colName = newColorInput.trim();
    if (!colName) return;
    if (!colorRows.includes(colName)) {
      setColorRows(prev => [...prev, colName]);
      setMatrixData(prev => ({ ...prev, [colName]: {} }));
    }
    setNewColorInput('');
  };

  const handleRemoveColorRow = (colorToRemove) => {
    setColorRows(prev => prev.filter(c => c !== colorToRemove));
    setMatrixData(prev => {
      const copy = { ...prev };
      delete copy[colorToRemove];
      return copy;
    });
  };

  // Wholesale Matrix Totals
  let totalWholesalePcs = 0;
  const wholesaleBreakdown = [];
  colorRows.forEach(col => {
    const colData = matrixData[col] || {};
    SIZES.forEach(sz => {
      const count = Number(colData[sz]) || 0;
      if (count > 0) {
        totalWholesalePcs += count;
        wholesaleBreakdown.push({
          garmentKey,
          color: col,
          size: sz,
          qty: count
        });
      }
    });
  });

  const wholesaleSubtotal = totalWholesalePcs * Number(garmentPricePerPcs || 0);
  const wholesaleTotalInvoiced = wholesaleSubtotal + Number(garmentShippingCost || 0);
  const wholesaleLandedCost = totalWholesalePcs > 0 
    ? Math.round(wholesaleTotalInvoiced / totalWholesalePcs) 
    : Number(garmentPricePerPcs || 0);
  const shippingPerPcs = totalWholesalePcs > 0 ? Math.round(Number(garmentShippingCost || 0) / totalWholesalePcs) : 0;

  // =========================================================================
  // TAB 2: OUTSOURCE STICKER A3+ CALCULATOR (MultiGraph belum jalan)
  // =========================================================================
  const [stickerVendorName, setStickerVendorName] = useState('Percetakan Senen / Snapy A3+');
  const [stickerName, setStickerName] = useState('Stiker Vinyl Unboxing Pack TeeStock (5x5 cm)');
  const [sheetQty, setSheetQty] = useState(10); // 10 lembar A3+
  const [costPerSheet, setCostPerSheet] = useState(15000); // Rp 15.000 / lembar (incl laminasi & die-cut)
  const [yieldPerSheet, setYieldPerSheet] = useState(24); // 24 pcs per lembar A3+
  const [stickerShippingCost, setStickerShippingCost] = useState(12000); // Ojol kurir Rp 12.000

  const totalStickerYieldPcs = Math.max(1, Number(sheetQty || 0) * Number(yieldPerSheet || 0));
  const stickerSubtotal = Number(sheetQty || 0) * Number(costPerSheet || 0);
  const stickerTotalCost = stickerSubtotal + Number(stickerShippingCost || 0);
  const stickerRealCostPerPcs = Math.round(stickerTotalCost / totalStickerYieldPcs);

  // =========================================================================
  // TAB 3: PACKAGING & SUPPLIES (Polymailer Lusinan / Pack)
  // =========================================================================
  const [supplyType, setSupplyType] = useState('polymailer');
  const [supplySupplier, setSupplySupplier] = useState('Distributor Plastik & Kemasan Grosir');
  const [supplyUnitType, setSupplyUnitType] = useState('lusin'); // 'lusin' | 'pack_100' | 'pcs'
  const [supplyUnitCount, setSupplyUnitCount] = useState(2); // e.g. 2 lusin
  const [supplyTotalBill, setSupplyTotalBill] = useState(28000);
  const [supplyShippingCost, setSupplyShippingCost] = useState(10000);

  const packagingMultiplier = supplyUnitType === 'lusin' ? 12 : supplyUnitType === 'pack_100' ? 100 : 1;
  const totalPackagingPcs = Math.max(1, Number(supplyUnitCount || 0) * packagingMultiplier);
  const packagingTotalCost = Number(supplyTotalBill || 0) + Number(supplyShippingCost || 0);
  const packagingLandedCost = Math.round(packagingTotalCost / totalPackagingPcs);

  // =========================================================================
  // TAB 4: DTF ROLL METERAN
  // =========================================================================
  const [dtfSupplier, setDtfSupplier] = useState('Vendor DTF Partner Meteran');
  const [dtfMeters, setDtfMeters] = useState(10);
  const [dtfCostPerMeter, setDtfCostPerMeter] = useState(30000);
  const [dtfShippingCost, setDtfShippingCost] = useState(15000);

  const dtfSubtotal = Number(dtfMeters || 0) * Number(dtfCostPerMeter || 0);
  const dtfTotalCost = dtfSubtotal + Number(dtfShippingCost || 0);
  const dtfLandedPerMeter = Number(dtfMeters) > 0 ? Math.round(dtfTotalCost / Number(dtfMeters)) : Number(dtfCostPerMeter);

  // DTF Design Dimension & Yield Calculator State
  const [dtfCalcWidth, setDtfCalcWidth] = useState(28); // Lebar cm
  const [dtfCalcHeight, setDtfCalcHeight] = useState(40); // Tinggi cm
  const [dtfSelectedPreset, setDtfSelectedPreset] = useState('a3');

  // Industri DTF: Lebar Roll Efektif 58 cm, Panjang 100 cm = 5.800 cm² kotor.
  // Faktor efisiensi layout gang sheet (terpotong gap gunting 1.5 cm & sisa pinggir) = 82%.
  // Buffer defect / spillage gagal heat-press = 5% (1.05).
  const DTF_GROSS_AREA = 5800; // cm²
  const DTF_EFFICIENCY = 0.82; // 82% area efektif
  const DTF_DEFECT_FACTOR = 1.05; // 5% defect buffer
  const dtfEffectiveArea = DTF_GROSS_AREA * DTF_EFFICIENCY; // 4.756 cm²
  const dtfEffectiveRatePerCm2 = dtfEffectiveArea > 0 
    ? (dtfLandedPerMeter / dtfEffectiveArea) * DTF_DEFECT_FACTOR 
    : 0;

  // Presets Apparel Standar
  const DTF_PRESETS = [
    { 
      id: 'a3', 
      name: 'A3 Backprint (Punggung)', 
      w: 28, 
      h: 40, 
      area: 1120, 
      gangYieldPerMeter: 2, 
      desc: '2 pcs/meter (sisa ruang muat 2 logo saku)',
      allocatedCost: Math.round(dtfLandedPerMeter * 0.42) // mengambil ~42 cm panjang roll
    },
    { 
      id: 'a4', 
      name: 'A4 Front (Dada Sedang)', 
      w: 20, 
      h: 28, 
      area: 560, 
      gangYieldPerMeter: 4, 
      desc: '4 pcs/meter (2 baris x 2 kolom)',
      allocatedCost: Math.round(dtfLandedPerMeter / 4) 
    },
    { 
      id: 'a5', 
      name: 'A5 Graphic (Dada Ringkas)', 
      w: 14, 
      h: 20, 
      area: 280, 
      gangYieldPerMeter: 8, 
      desc: '8 pcs/meter (4 baris x 2 kolom)',
      allocatedCost: Math.round(dtfLandedPerMeter / 8) 
    },
    { 
      id: 'a6', 
      name: 'A6 Pocket Logo (Dada Kiri)', 
      w: 9, 
      h: 9, 
      area: 81, 
      gangYieldPerMeter: 25, 
      desc: '25 - 30 pcs/meter (grid 6 x 4-5 baris)',
      allocatedCost: Math.round(dtfLandedPerMeter / 25) 
    },
    { 
      id: 'neck', 
      name: 'Label Kerah / Neck Tag', 
      w: 5, 
      h: 5, 
      area: 25, 
      gangYieldPerMeter: 50, 
      desc: '45 - 50 pcs/meter (pengisi rongga kosong)',
      allocatedCost: Math.round(dtfLandedPerMeter / 50) 
    },
  ];

  // Multi-Design Allocated to DTF Roll State
  const [allocatedDtfDesigns, setAllocatedDtfDesigns] = useState([]);
  const [selectedCatalogSku, setSelectedCatalogSku] = useState('');
  const [customDtfName, setCustomDtfName] = useState('');
  const [customDtfSku, setCustomDtfSku] = useState('');
  const [selectedDtfPreset, setSelectedDtfPreset] = useState('a3');
  const [allocatedQty, setAllocatedQty] = useState(4);

  // Sync initial tab and design if provided
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
    if (initialDesign && initialDesign.sku) {
      const exists = allocatedDtfDesigns.some(d => d.sku === initialDesign.sku);
      if (!exists) {
        const presetId = initialDesign.preset?.includes('a4') ? 'a4' : 'a3';
        const pObj = DTF_PRESETS.find(p => p.id === presetId) || DTF_PRESETS[0];
        setAllocatedDtfDesigns([
          {
            id: `alloc-${Date.now()}`,
            sku: initialDesign.sku,
            name: initialDesign.name,
            sizeId: pObj.id,
            sizeLabel: pObj.name,
            qty: 4,
            metersPerPiece: 1 / pObj.gangYieldPerMeter,
            allocatedCost: pObj.allocatedCost
          }
        ]);
        setDtfMeters(Math.max(2, Math.ceil(4 / pObj.gangYieldPerMeter)));
      }
    }
  }, [isOpen, initialTab, initialDesign]);

  const handleAddAllocatedDesign = () => {
    let sku = '';
    let name = '';

    if (selectedCatalogSku === 'custom' || !selectedCatalogSku) {
      if (!customDtfName.trim()) {
        alert('Mohon isi nama atau judul desain');
        return;
      }
      sku = customDtfSku.trim().toUpperCase() || `TS-DSN-${Date.now().toString().slice(-4)}`;
      name = customDtfName.trim();
    } else {
      const found = catalog?.find(p => p.sku === selectedCatalogSku);
      if (!found) return;
      sku = found.sku;
      name = found.name;
    }

    const pObj = DTF_PRESETS.find(p => p.id === selectedDtfPreset) || DTF_PRESETS[0];
    const qty = Math.max(1, Number(allocatedQty) || 1);

    setAllocatedDtfDesigns(prev => {
      const existingIdx = prev.findIndex(d => d.sku === sku && d.sizeId === pObj.id);
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          qty: next[existingIdx].qty + qty
        };
        return next;
      }
      return [
        ...prev,
        {
          id: `alloc-${Date.now()}-${Math.random()}`,
          sku,
          name,
          sizeId: pObj.id,
          sizeLabel: pObj.name,
          qty,
          metersPerPiece: 1 / pObj.gangYieldPerMeter,
          allocatedCost: pObj.allocatedCost
        }
      ];
    });

    // Reset inputs
    setCustomDtfName('');
    setCustomDtfSku('');
    setAllocatedQty(4);
  };

  const handleRemoveAllocatedDesign = (id) => {
    setAllocatedDtfDesigns(prev => prev.filter(d => d.id !== id));
  };

  // Calculations for Multi-Design Gang Sheet
  const totalAllocatedSheets = allocatedDtfDesigns.reduce((sum, d) => sum + (Number(d.qty) || 0), 0);
  const totalMetersRequired = allocatedDtfDesigns.reduce((sum, d) => sum + ((Number(d.qty) || 0) * (d.metersPerPiece || 0.5)), 0);
  const remainingRollMeters = Number(dtfMeters) - totalMetersRequired;

  // Custom cm Dimension Calculation
  const dtfCustomArea = (Number(dtfCalcWidth) || 0) * (Number(dtfCalcHeight) || 0);
  const dtfCustomCostPerPcs = Math.ceil((dtfCustomArea * dtfEffectiveRatePerCm2) / 100) * 100;
  const estYieldPerMeterCustom = dtfCustomArea > 0 ? Math.floor(dtfEffectiveArea / dtfCustomArea) : 0;


  // =========================================================================
  // FORM SUBMIT HANDLER
  // =========================================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (activeTab === 'wholesale_tshirt') {
        if (totalWholesalePcs <= 0) {
          alert("Silakan isi minimal 1 kombinasi warna dan ukuran kaos pada tabel matriks!");
          setIsSubmitting(false);
          return;
        }

        const gObj = GARMENT_TYPES[garmentKey] || GARMENT_TYPES.nsa_heavyweight_24s;
        
        // Build itemsBreakdown with individual landed costs
        const enrichedBreakdown = wholesaleBreakdown.map(item => ({
          ...item,
          unitCost: Number(garmentPricePerPcs),
          landedUnitCost: wholesaleLandedCost
        }));

        await onSave({
          itemType: 'blank_tshirt',
          itemName: `${gObj.name} (Wholesale Mix ${totalWholesalePcs} pcs)`,
          itemSku: `${gObj.code || 'NSA'}-MIX-BATCH`,
          supplierName: garmentSupplier.trim() || 'Distributor Resmi NSA',
          purchaseType: 'lusinan',
          qty: totalWholesalePcs,
          unitMeasure: 'pcs',
          unitCost: Number(garmentPricePerPcs),
          shippingCost: Number(garmentShippingCost),
          totalCost: wholesaleTotalInvoiced,
          realUnitCost: wholesaleLandedCost,
          paymentSource,
          recordCashTx,
          notes: notes.trim() || `Wholesale mix ${totalWholesalePcs} pcs (${(totalWholesalePcs/12).toFixed(1)} lusin). Landed cost HPP: ${formatRupiah(wholesaleLandedCost)}/pcs (termasuk ongkir ${formatRupiah(garmentShippingCost)}).`,
          garmentKey,
          itemsBreakdown: enrichedBreakdown
        });

      } else if (activeTab === 'sticker_outsource') {
        await onSave({
          itemType: 'sticker_vendor',
          supplyId: 'sticker',
          itemName: stickerName.trim(),
          itemSku: 'MAT-STICKER-VP',
          supplierName: stickerVendorName.trim() || 'Percetakan Luar A3+',
          purchaseType: 'lembaran_a3',
          qty: totalStickerYieldPcs,
          unitMeasure: 'pcs',
          unitCost: stickerRealCostPerPcs,
          shippingCost: Number(stickerShippingCost),
          totalCost: stickerTotalCost,
          realUnitCost: stickerRealCostPerPcs,
          paymentSource,
          recordCashTx,
          vendorType: 'external_vendor',
          yieldCalculation: {
            sheetQty: Number(sheetQty),
            costPerSheet: Number(costPerSheet),
            yieldPerSheet: Number(yieldPerSheet),
            totalYieldPcs: totalStickerYieldPcs
          },
          notes: notes.trim() || `Outsource cetak luar: ${sheetQty} lembar A3+ (@ Rp ${Number(costPerSheet).toLocaleString('id-ID')}) muat ${yieldPerSheet} pcs/lbr = ${totalStickerYieldPcs} pcs stiker jadi. HPP riil: ${formatRupiah(stickerRealCostPerPcs)}/pcs. (MultiGraph belum jalan, preparing komputer & printer).`
        });

      } else if (activeTab === 'packaging_supplies') {
        const supplyLabel = supplyType === 'polymailer' ? 'Polymailer Doff 30x40 cm' :
          supplyType === 'hangtag' ? 'Hangtag 310gsm Tebal' :
          supplyType === 'care_card' ? 'Care Card A6' :
          supplyType === 'thermal_label' ? 'Label Thermal A6' : 'Kemasan Unboxing';

        await onSave({
          itemType: 'packaging',
          supplyId: supplyType,
          itemName: `${supplyLabel} (${supplyUnitCount} ${supplyUnitType})`,
          itemSku: `MAT-${supplyType.toUpperCase()}`,
          supplierName: supplySupplier.trim() || 'Grosir Kemasan',
          purchaseType: supplyUnitType,
          qty: totalPackagingPcs,
          unitMeasure: 'pcs',
          unitCost: packagingLandedCost,
          shippingCost: Number(supplyShippingCost),
          totalCost: packagingTotalCost,
          realUnitCost: packagingLandedCost,
          paymentSource,
          recordCashTx,
          notes: notes.trim() || `Beli ${supplyUnitCount} ${supplyUnitType} = ${totalPackagingPcs} pcs fisik. Total: ${formatRupiah(packagingTotalCost)} (HPP riil: ${formatRupiah(packagingLandedCost)}/lembar).`
        });

      } else if (activeTab === 'dtf_roll') {
        const hasAllocations = allocatedDtfDesigns.length > 0;
        const totalSheets = allocatedDtfDesigns.reduce((sum, d) => sum + Number(d.qty), 0);
        
        let itemName = `Roll Film DTF 58 cm x ${dtfMeters} m`;
        if (hasAllocations) {
          if (allocatedDtfDesigns.length === 1) {
            itemName = `Cetak DTF: ${allocatedDtfDesigns[0].name} (${allocatedDtfDesigns[0].qty} lbr)`;
          } else {
            itemName = `Cetak DTF Gang Sheet ${dtfMeters}m (${totalSheets} lbr mix ${allocatedDtfDesigns.length} desain)`;
          }
        }

        const itemsBreakdown = hasAllocations
          ? allocatedDtfDesigns.map(d => ({
              sku: d.sku,
              name: d.name,
              size: d.sizeLabel,
              qty: Number(d.qty),
              unitCost: d.allocatedCost || Math.round(dtfTotalCost / Math.max(1, totalSheets)),
              category: 'graphic'
            }))
          : null;

        const defaultNotes = hasAllocations
          ? `Cetak DTF ${dtfMeters}m di ${dtfSupplier}. Alokasi: ` + allocatedDtfDesigns.map(d => `${d.qty}x ${d.sku} [${d.sizeLabel}]`).join(', ') + `. Landed: ${formatRupiah(dtfLandedPerMeter)}/m.`
          : `Cetak DTF meteran ${dtfMeters} meter. Total biaya: ${formatRupiah(dtfTotalCost)} (Landed cost: ${formatRupiah(dtfLandedPerMeter)}/meter).`;

        await onSave({
          itemType: 'dtf_film',
          dtfSku: hasAllocations && allocatedDtfDesigns.length === 1 ? allocatedDtfDesigns[0].sku : 'DTF-ROLL-58CM',
          itemName,
          supplierName: dtfSupplier.trim() || 'Vendor DTF Partner',
          purchaseType: 'roll_meter',
          qty: Number(dtfMeters),
          unitMeasure: 'meter',
          unitCost: Number(dtfCostPerMeter),
          shippingCost: Number(dtfShippingCost),
          totalCost: dtfTotalCost,
          realUnitCost: dtfLandedPerMeter,
          paymentSource,
          recordCashTx,
          itemsBreakdown,
          notes: notes.trim() || defaultNotes
        });
      } else if (activeTab === 'design_license') {
        if (!licenseItemName.trim()) {
          alert("Nama judul desain lisensi wajib diisi!");
          setIsSubmitting(false);
          return;
        }

        const cost = Number(licenseCost) || 0;
        const amort = Math.max(1, Number(licenseAmortization) || 25);
        const perShirt = Math.round(cost / amort);

        await onSave({
          itemType: 'design_license',
          itemSku: licenseSku.trim(),
          itemName: `Lisensi Desain: ${licenseItemName.trim()}`,
          supplierName: licenseSupplier.trim() || 'Etsy Digital Download',
          purchaseType: 'satuan',
          qty: 1,
          unitMeasure: 'lisensi',
          unitCost: cost,
          shippingCost: 0,
          totalCost: cost,
          realUnitCost: cost,
          paymentSource,
          recordCashTx,
          notes: notes.trim() || `Beli lisensi komersial via ${licenseSupplier}, amortisasi ${amort} pcs @ ${formatRupiah(perShirt)}/kaos.`
        });
      }

      onClose();
    } catch (err) {
      alert("Terjadi kesalahan saat mencatat pengadaan: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#121215] border border-white/[0.12] rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="p-5 sm:p-6 border-b border-white/[0.08] flex items-center justify-between bg-black/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-white" /> SMART PROCUREMENT INTAKE
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                MultiGraph Holding &bull; TeeStock
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight mt-1">
              Catat Belanja Bahan &amp; Pengadaan Stok Gudang
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Input fleksibel grosir kaos campur ukuran, kalkulator stiker percetakan luar, dan konversi satuan kemasan.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Intake Modes Capsule Pill Switcher (21st.dev Style) */}
        <div className="p-3 sm:px-6 bg-black/20 border-b border-white/[0.06] overflow-x-auto">
          <div className="flex items-center gap-1.5 p-1 bg-black/40 border border-white/[0.08] rounded-2xl w-fit">
            {[
              { id: 'wholesale_tshirt', label: '👕 1. Grosir Kaos Polos (Matrix)', desc: 'Mix Ukuran & Warna' },
              { id: 'sticker_outsource', label: '🏷️ 2. Stiker A3+ (Vendor Luar)', desc: 'Lembaran ke Pcs Jadi' },
              { id: 'packaging_supplies', label: '📦 3. Polymailer & Kemasan', desc: 'Lusin / Pack 100 / Pcs' },
              { id: 'dtf_roll', label: '🖨️ 4. Roll DTF Meteran', desc: 'Roll Lebar 58cm' },
              { id: 'design_license', label: '🎨 5. Lisensi Desain', desc: 'Beli Putih (Etsy/Freelance)' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs transition-all whitespace-nowrap text-left ${
                  activeTab === tab.id
                    ? 'bg-white text-zinc-950 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <div className="font-semibold">{tab.label}</div>
                <div className={`text-[9px] font-mono ${activeTab === tab.id ? 'text-zinc-600' : 'text-zinc-500'}`}>
                  {tab.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* ========================================================================= */}
          {/* TAB 1: WHOLESALE T-SHIRT MATRIX                                           */}
          {/* ========================================================================= */}
          {activeTab === 'wholesale_tshirt' && (
            <div className="space-y-5">
              {/* Garment Model & Supplier Header */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black/30 p-4 rounded-2xl border border-white/[0.06]">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Pilih Model Kaos Polos NSA
                  </label>
                  <select
                    value={garmentKey}
                    onChange={(e) => {
                      const newKey = e.target.value;
                      setGarmentKey(newKey);
                      const base = GARMENT_TYPES[newKey]?.baseCost || 40000;
                      setGarmentPricePerPcs(base);
                    }}
                    className="w-full bg-[#1A1A1F] border border-white/[0.12] rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-white"
                  >
                    {Object.entries(GARMENT_TYPES).filter(([k]) => k !== 'supplies').map(([k, g]) => (
                      <option key={k} value={k}>
                        {g.name} — HPP Acuan: {formatRupiah(g.baseCost || 40000)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Nama Distributor / Toko Bahan
                  </label>
                  <input
                    type="text"
                    value={garmentSupplier}
                    onChange={(e) => setGarmentSupplier(e.target.value)}
                    placeholder="Contoh: Cititex Rawamangun / Toko Bahan NSA"
                    className="w-full bg-[#1A1A1F] border border-white/[0.12] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              {/* Wholesale Spreadsheet Matrix Input */}
              <div className="space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-zinc-400" />
                      Matriks Belanja Grosir Campur (Warna &amp; Ukuran)
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Ketik jumlah pieces pada kotak ukuran yang dibeli. Kosongkan jika tidak ada.
                    </p>
                  </div>

                  {/* Add Custom Color Row */}
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="Tambah warna baru..."
                      value={newColorInput}
                      onChange={(e) => setNewColorInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddColorRow(); } }}
                      className="bg-black/50 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white placeholder-zinc-500 focus:outline-none w-36"
                    />
                    <button
                      type="button"
                      onClick={handleAddColorRow}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-zinc-950 hover:bg-zinc-200 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah</span>
                    </button>
                  </div>
                </div>

                {/* Matrix Table */}
                <div className="overflow-x-auto border border-white/[0.08] rounded-2xl bg-black/40">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-white/[0.03] border-b border-white/[0.08] text-zinc-400 uppercase font-mono text-[10px]">
                        <th className="py-2.5 px-4 font-bold">Warna Garmen</th>
                        {SIZES.map(sz => (
                          <th key={sz} className="py-2.5 px-2 text-center font-bold min-w-[50px]">{sz}</th>
                        ))}
                        <th className="py-2.5 px-3 text-right font-bold">Subtotal Pcs</th>
                        <th className="py-2.5 px-2 text-center w-8"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      {colorRows.map(col => {
                        const colData = matrixData[col] || {};
                        const rowTotal = SIZES.reduce((sum, sz) => sum + (Number(colData[sz]) || 0), 0);

                        return (
                          <tr key={col} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-2 px-4 font-bold text-white whitespace-nowrap">
                              {col}
                            </td>
                            {SIZES.map(sz => (
                              <td key={sz} className="py-2 px-1 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  placeholder="0"
                                  value={colData[sz] === undefined || colData[sz] === 0 ? '' : colData[sz]}
                                  onChange={(e) => handleCellChange(col, sz, e.target.value)}
                                  className="w-12 text-center bg-[#1A1A1F] border border-white/10 focus:border-white rounded-lg py-1 font-mono text-xs text-white font-bold focus:outline-none"
                                />
                              </td>
                            ))}
                            <td className="py-2 px-3 text-right font-mono font-bold text-white whitespace-nowrap">
                              {rowTotal} pcs
                            </td>
                            <td className="py-2 px-2 text-center">
                              {colorRows.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveColorRow(col)}
                                  className="text-zinc-600 hover:text-rose-400 p-1 transition-colors"
                                  title={`Hapus baris ${col}`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-white/[0.04] border-t border-white/10 font-mono font-bold text-white">
                        <td className="py-3 px-4 uppercase text-[10px] text-zinc-400">
                          Total Per Ukuran:
                        </td>
                        {SIZES.map(sz => {
                          const colSum = colorRows.reduce((sum, col) => sum + (Number(matrixData[col]?.[sz]) || 0), 0);
                          return (
                            <td key={sz} className="py-3 px-2 text-center text-xs">
                              {colSum > 0 ? colSum : '-'}
                            </td>
                          );
                        })}
                        <td className="py-3 px-3 text-right text-sm font-black text-white">
                          {totalWholesalePcs} pcs
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Financial Calculation & Landed Cost Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black/30 p-4 rounded-2xl border border-white/[0.06] space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 block">
                    Harga Beli Kaos per Pcs (NSA)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs">Rp</span>
                    <input
                      type="number"
                      step="500"
                      value={garmentPricePerPcs}
                      onChange={(e) => setGarmentPricePerPcs(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#1A1A1F] border border-white/[0.12] rounded-xl text-xs font-mono font-bold text-white focus:outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-zinc-500 block font-mono">
                    Subtotal: {formatRupiah(wholesaleSubtotal)}
                  </span>
                </div>

                <div className="bg-black/30 p-4 rounded-2xl border border-white/[0.06] space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 block flex items-center justify-between">
                    <span>Ongkir Ekspedisi / Cargo</span>
                    <span className="text-[10px] font-mono text-zinc-500">Lalamove/Dakota</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs">Rp</span>
                    <input
                      type="number"
                      step="1000"
                      value={garmentShippingCost}
                      onChange={(e) => setGarmentShippingCost(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#1A1A1F] border border-white/[0.12] rounded-xl text-xs font-mono font-bold text-white focus:outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-zinc-500 block font-mono">
                    Beban ongkir per pcs: +{formatRupiah(shippingPerPcs)}
                  </span>
                </div>

                <div className="bg-white/[0.04] p-4 rounded-2xl border border-white/20 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold block">
                    🎯 Landed Cost (HPP Riil Gudang)
                  </span>
                  <div className="text-xl font-mono font-black text-white">
                    {formatRupiah(wholesaleLandedCost)} <span className="text-xs font-normal text-zinc-400">/ pcs</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-tight pt-1">
                    Total tagihan: <strong>{formatRupiah(wholesaleTotalInvoiced)}</strong> untuk <strong>{totalWholesalePcs} pcs</strong> ({(totalWholesalePcs/12).toFixed(1)} lusin).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: OUTSOURCE STICKER A3+ CALCULATOR (MultiGraph belum jalan)           */}
          {/* ========================================================================= */}
          {activeTab === 'sticker_outsource' && (
            <div className="space-y-5">
              {/* Notice Banner: MultiGraph belum operasional mandiri */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-4 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-white shrink-0 mt-0.5">
                  <Printer className="w-4 h-4 text-zinc-300" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-white block">
                    Status Operasional: Cetak Outsource ke Percetakan Digital Luar
                  </span>
                  <p className="text-zinc-400 mt-0.5 leading-relaxed">
                    Unit <strong>MultiGraph</strong> belum operasional mandiri (saat ini sedang mempersiapkan CAPEX komputer &amp; mesin cetak/plotter).
                    Stiker unboxing pack TeeStock dicetak per <strong>Lembar A3+</strong> ke vendor luar (Senen / Snapy), lalu dipotong die-cut menjadi stiker jadi.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Nama Vendor Percetakan Luar
                  </label>
                  <input
                    type="text"
                    value={stickerVendorName}
                    onChange={(e) => setStickerVendorName(e.target.value)}
                    placeholder="Contoh: Snapy / Percetakan A3+ Senen"
                    className="w-full bg-[#1A1A1F] border border-white/[0.12] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Nama / Keterangan Desain Stiker
                  </label>
                  <input
                    type="text"
                    value={stickerName}
                    onChange={(e) => setStickerName(e.target.value)}
                    placeholder="Contoh: Stiker Vinyl Logo 5x5 cm Die-Cut"
                    className="w-full bg-[#1A1A1F] border border-white/[0.12] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* A3+ Sheet-to-Pcs Yield Inputs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/30 p-4 rounded-2xl border border-white/[0.06]">
                <div>
                  <label className="text-[11px] font-bold text-zinc-400 block mb-1">
                    Jml Lembar A3+
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={sheetQty}
                    onChange={(e) => setSheetQty(e.target.value)}
                    className="w-full bg-[#1A1A1F] border border-white/[0.12] rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none"
                  />
                  <span className="text-[9px] text-zinc-500 mt-0.5 block">Lembar kertas A3+</span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-400 block mb-1">
                    Harga / Lembar A3+
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-[10px]">Rp</span>
                    <input
                      type="number"
                      step="500"
                      value={costPerSheet}
                      onChange={(e) => setCostPerSheet(e.target.value)}
                      className="w-full pl-7 pr-2 py-2 bg-[#1A1A1F] border border-white/[0.12] rounded-xl text-xs font-mono font-bold text-white focus:outline-none"
                    />
                  </div>
                  <span className="text-[9px] text-zinc-500 mt-0.5 block">Termasuk laminasi &amp; cut</span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-400 block mb-1">
                    Isi Pcs per Lembar
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={yieldPerSheet}
                    onChange={(e) => setYieldPerSheet(e.target.value)}
                    className="w-full bg-[#1A1A1F] border border-white/[0.12] rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none"
                  />
                  <span className="text-[9px] text-zinc-500 mt-0.5 block">Yield stiker per lembar</span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-400 block mb-1">
                    Ongkir Ojol / Kurir
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-[10px]">Rp</span>
                    <input
                      type="number"
                      step="1000"
                      value={stickerShippingCost}
                      onChange={(e) => setStickerShippingCost(e.target.value)}
                      className="w-full pl-7 pr-2 py-2 bg-[#1A1A1F] border border-white/[0.12] rounded-xl text-xs font-mono font-bold text-white focus:outline-none"
                    />
                  </div>
                  <span className="text-[9px] text-zinc-500 mt-0.5 block">Biaya jemput/kirim</span>
                </div>
              </div>

              {/* Yield Output Result Banner */}
              <div className="bg-white/[0.04] p-4 rounded-2xl border border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-bold block">
                    Hasil Cetak Stiker Jadi (Yield Gudang)
                  </span>
                  <div className="text-2xl font-mono font-black text-white mt-0.5">
                    {totalStickerYieldPcs} pcs <span className="text-xs font-normal text-zinc-400">({sheetQty} lembar A3+ &times; {yieldPerSheet} pcs)</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Total bayar: <strong>{formatRupiah(stickerTotalCost)}</strong> (Cetak: {formatRupiah(stickerSubtotal)} + Ongkir: {formatRupiah(stickerShippingCost)})
                  </p>
                </div>

                <div className="text-right sm:border-l sm:border-white/10 sm:pl-6">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-bold block">
                    🎯 HPP Riil per Pcs Stiker
                  </span>
                  <div className="text-2xl font-mono font-black text-white mt-0.5">
                    {formatRupiah(stickerRealCostPerPcs)}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 block">
                    Biaya HPP paket unboxing
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: PACKAGING & SUPPLIES (Polymailer 2 Lusin / 1 Pack 100)              */}
          {/* ========================================================================= */}
          {activeTab === 'packaging_supplies' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Jenis Kemasan / Material Unboxing
                  </label>
                  <select
                    value={supplyType}
                    onChange={(e) => setSupplyType(e.target.value)}
                    className="w-full bg-[#1A1A1F] border border-white/[0.12] rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none"
                  >
                    <option value="polymailer">📦 Polymailer Doff 30x40 cm (Hitam)</option>
                    <option value="hangtag">🏷️ Hangtag Ivory 310gsm Tebal</option>
                    <option value="care_card">📄 Care Card Petunjuk Cuci A6</option>
                    <option value="thermal_label">🏷️ Label Thermal Pengiriman A6 (100x150mm)</option>
                    <option value="teflon_sheet">🛡️ Sheet Teflon Pelindung Heat Press</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Supplier Kemasan / Grosir ATK
                  </label>
                  <input
                    type="text"
                    value={supplySupplier}
                    onChange={(e) => setSupplySupplier(e.target.value)}
                    placeholder="Contoh: Grosir Plastik Tanah Abang / Toko ATK"
                    className="w-full bg-[#1A1A1F] border border-white/[0.12] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Multi-Unit Converter */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-black/30 p-4 rounded-2xl border border-white/[0.06]">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Satuan Pembelian
                  </label>
                  <select
                    value={supplyUnitType}
                    onChange={(e) => setSupplyUnitType(e.target.value)}
                    className="w-full bg-[#1A1A1F] border border-white/[0.12] rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-medium"
                  >
                    <option value="lusin">Lusin (1 lusin = 12 pcs)</option>
                    <option value="pack_100">Pack / Ikat (1 pack = 100 pcs)</option>
                    <option value="pcs">Satuan Eceran (Pcs)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Jumlah Dibeli ({supplyUnitType === 'lusin' ? 'Lusin' : supplyUnitType === 'pack_100' ? 'Pack' : 'Pcs'})
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={supplyUnitCount}
                    onChange={(e) => setSupplyUnitCount(e.target.value)}
                    className="w-full bg-[#1A1A1F] border border-white/[0.12] rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none"
                  />
                  <span className="text-[10px] text-zinc-500 mt-1 block">
                    Total fisik gudang: <strong>{totalPackagingPcs} pcs</strong>
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Harga Total Belanja Nota
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs">Rp</span>
                    <input
                      type="number"
                      step="1000"
                      value={supplyTotalBill}
                      onChange={(e) => setSupplyTotalBill(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#1A1A1F] border border-white/[0.12] rounded-xl text-xs font-mono font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping & Landed Cost */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-black/30 p-4 rounded-2xl border border-white/[0.06]">
                  <label className="text-xs font-bold text-zinc-400 block mb-1">
                    Ongkir Kurir / Ekspedisi Kemasan
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs">Rp</span>
                    <input
                      type="number"
                      step="1000"
                      value={supplyShippingCost}
                      onChange={(e) => setSupplyShippingCost(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#1A1A1F] border border-white/[0.12] rounded-xl text-xs font-mono font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="bg-white/[0.04] p-4 rounded-2xl border border-white/20">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-bold block">
                    🎯 HPP Riil per Lembar / Pcs
                  </span>
                  <div className="text-2xl font-mono font-black text-white mt-0.5">
                    {formatRupiah(packagingLandedCost)} <span className="text-xs font-normal text-zinc-400">/ pcs</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1">
                    Total tagihan: {formatRupiah(packagingTotalCost)} untuk {totalPackagingPcs} pcs ({supplyUnitCount} {supplyUnitType}).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: DTF ROLL METERAN                                                    */}
          {/* ========================================================================= */}
          {activeTab === 'dtf_roll' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Vendor Sablon DTF Meteran
                  </label>
                  <input
                    type="text"
                    value={dtfSupplier}
                    onChange={(e) => setDtfSupplier(e.target.value)}
                    placeholder="Contoh: Vendor DTF Senen / Partner DTF Roll"
                    className="w-full bg-[#1A1A1F] border border-white/[0.12] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Panjang Roll (Meter) &bull; Lebar Standar 58 cm
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={dtfMeters}
                    onChange={(e) => setDtfMeters(e.target.value)}
                    className="w-full bg-[#1A1A1F] border border-white/[0.12] rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-black/30 p-4 rounded-2xl border border-white/[0.06]">
                  <label className="text-xs font-bold text-zinc-400 block mb-1">
                    Harga per Meter DTF
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs">Rp</span>
                    <input
                      type="number"
                      step="1000"
                      value={dtfCostPerMeter}
                      onChange={(e) => setDtfCostPerMeter(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#1A1A1F] border border-white/[0.12] rounded-xl text-xs font-mono font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="bg-black/30 p-4 rounded-2xl border border-white/[0.06]">
                  <label className="text-xs font-bold text-zinc-400 block mb-1">
                    Ongkos Kirim Roll
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs">Rp</span>
                    <input
                      type="number"
                      step="1000"
                      value={dtfShippingCost}
                      onChange={(e) => setDtfShippingCost(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#1A1A1F] border border-white/[0.12] rounded-xl text-xs font-mono font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="bg-white/[0.04] p-4 rounded-2xl border border-white/20">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-bold block">
                    🎯 Landed Cost / Meter
                  </span>
                  <div className="text-2xl font-mono font-black text-white mt-0.5">
                    {formatRupiah(dtfLandedPerMeter)}
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-0.5 block font-mono">
                    Total: {formatRupiah(dtfTotalCost)} ({dtfMeters} meter)
                  </span>
                </div>
              </div>

              {/* Advisory Insight Banner */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-white shrink-0 mt-0.5">
                  <Scissors className="w-4 h-4 text-zinc-300" />
                </div>
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">
                      Best Practice Alokasi HPP DTF (Meteran vs Satuan cm)
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-white/10 text-white border border-white/15">
                      Faktor Efisiensi 82% + Defect Buffer 5%
                    </span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed text-[11px]">
                    <strong>Jebakan cm Murni:</strong> 1 meter roll DTF (58&times;100 cm = 5.800 cm&sup2;) tidak pernah terisi 100% rapat. Wajib ada celah potong gunting (1.5 cm) dan sisa pinggir roll (efisiensi nyata ~82%). Jika hanya dihitung perkalian murni P &times; L tanpa memperhitungkan waste gap, <strong>HPP akan undercount (terlalu murah) dan kas holding bocor</strong>.
                  </p>
                </div>
              </div>

              {/* Grid Section: Presets & Custom Simulator */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <LayoutGrid className="w-3.5 h-3.5 text-zinc-400" />
                    1. Standar Preset Ukuran Apparel (Paling Praktis untuk Ritel)
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-mono">Klik kartu untuk coba simulasi</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {DTF_PRESETS.map((preset) => {
                    const isSelected = dtfSelectedPreset === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setDtfSelectedPreset(preset.id);
                          setDtfCalcWidth(preset.w);
                          setDtfCalcHeight(preset.h);
                        }}
                        className={`text-left p-3 rounded-2xl border transition-all ${
                          isSelected
                            ? 'bg-white text-zinc-950 border-white shadow-lg'
                            : 'bg-black/30 text-zinc-300 border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-mono font-bold uppercase ${isSelected ? 'text-zinc-700' : 'text-zinc-400'}`}>
                            {preset.w}&times;{preset.h} cm
                          </span>
                          <span className={`text-[9px] font-mono font-black px-1.5 py-0.5 rounded ${
                            isSelected ? 'bg-black/10 text-zinc-950' : 'bg-white/5 text-zinc-400'
                          }`}>
                            {preset.area} cm&sup2;
                          </span>
                        </div>
                        <div className={`text-xs font-bold mt-1 truncate ${isSelected ? 'text-zinc-950' : 'text-white'}`}>
                          {preset.name}
                        </div>
                        <div className={`text-sm font-mono font-black mt-2 ${isSelected ? 'text-zinc-950' : 'text-white'}`}>
                          {formatRupiah(preset.allocatedCost)}
                          <span className={`text-[10px] font-normal block ${isSelected ? 'text-zinc-700' : 'text-zinc-500'}`}>
                            / pcs ({preset.gangYieldPerMeter} pcs/m)
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Dimension Simulator */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Ruler className="w-3.5 h-3.5 text-zinc-400" />
                    2. Simulator Desain Kustom Satuan cm (P &times; L Berbobot Waste)
                  </h4>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Tarif Efektif: <strong className="text-white">Rp {dtfEffectiveRatePerCm2.toFixed(1)}</strong> / cm&sup2;
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-400 block mb-1">
                      Lebar Desain (cm)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="58"
                      value={dtfCalcWidth}
                      onChange={(e) => {
                        setDtfCalcWidth(e.target.value);
                        setDtfSelectedPreset('');
                      }}
                      className="w-full bg-[#1A1A1F] border border-white/[0.12] rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none"
                    />
                    <span className="text-[9px] text-zinc-500 mt-0.5 block">Max 58 cm (lebar roll)</span>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-zinc-400 block mb-1">
                      Tinggi / Panjang (cm)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={dtfCalcHeight}
                      onChange={(e) => {
                        setDtfCalcHeight(e.target.value);
                        setDtfSelectedPreset('');
                      }}
                      className="w-full bg-[#1A1A1F] border border-white/[0.12] rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none"
                    />
                    <span className="text-[9px] text-zinc-500 mt-0.5 block">Panjang vertikal kaos</span>
                  </div>

                  <div className="bg-black/30 p-3 rounded-xl border border-white/[0.06]">
                    <span className="text-[10px] font-mono text-zinc-400 block uppercase">
                      Luas &amp; Kapasitas 1m
                    </span>
                    <div className="text-sm font-mono font-bold text-white mt-0.5">
                      {dtfCustomArea} cm&sup2;
                    </div>
                    <span className="text-[10px] text-zinc-400 block mt-0.5 font-mono">
                      Muat &plusmn;<strong>{estYieldPerMeterCustom} pcs</strong> / meter
                    </span>
                  </div>

                  <div className="bg-white/[0.04] p-3 rounded-xl border border-white/20">
                    <span className="text-[10px] font-mono text-zinc-400 block uppercase font-bold">
                      🎯 HPP Sablon Riil
                    </span>
                    <div className="text-lg font-mono font-black text-white mt-0.5">
                      {formatRupiah(dtfCustomCostPerPcs)}
                    </div>
                    <span className="text-[10px] text-zinc-500 block font-mono">
                      / pcs (tercover waste)
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 3: Multi-Design Allocator to Gang Sheet Roll (Menambah Stok Fisik Gudang) */}
              <div className="p-4 rounded-2xl bg-[#16161A] border border-white/[0.12] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-400" />
                      3. Rincian Desain yang Dicetak (Otomatis Masuk Stok Fisik)
                    </h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Pilih desain dari katalog atau input desain baru. Setiap lembar yang dicatat di sini otomatis menambah stok siap press di menu <strong>Inventori</strong>.
                    </p>
                  </div>
                  {totalAllocatedSheets > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        {totalAllocatedSheets} Lembar Siap Press
                      </span>
                    </div>
                  )}
                </div>

                {/* Input Add Design Row */}
                <div className="bg-black/40 p-3.5 rounded-xl border border-white/[0.06] space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                    
                    {/* Design Select / Input */}
                    <div className="sm:col-span-5">
                      <label className="text-[11px] font-bold text-zinc-300 block mb-1">
                        Pilih Desain Kaos
                      </label>
                      <select
                        value={selectedCatalogSku}
                        onChange={(e) => {
                          setSelectedCatalogSku(e.target.value);
                          if (e.target.value !== 'custom' && e.target.value) {
                            const found = catalog?.find(p => p.sku === e.target.value);
                            if (found) {
                              const pId = found.printPreset?.includes('a4') ? 'a4' : 'a3';
                              setSelectedDtfPreset(pId);
                            }
                          }
                        }}
                        className="w-full bg-[#1A1A1F] border border-white/[0.12] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
                      >
                        <option value="">-- Pilih dari Master Katalog --</option>
                        {catalog && catalog.filter(p => !p.sku?.startsWith('TS-BLK')).map(p => (
                          <option key={p.sku} value={p.sku}>
                            [{p.sku}] {p.name} ({p.printPreset || 'A3+'})
                          </option>
                        ))}
                        <option value="custom">+ Input Desain Baru / Kustom Manual</option>
                      </select>
                    </div>

                    {/* Size Preset */}
                    <div className="sm:col-span-4">
                      <label className="text-[11px] font-bold text-zinc-300 block mb-1">
                        Ukuran Cetak Sablon
                      </label>
                      <select
                        value={selectedDtfPreset}
                        onChange={(e) => setSelectedDtfPreset(e.target.value)}
                        className="w-full bg-[#1A1A1F] border border-white/[0.12] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
                      >
                        {DTF_PRESETS.map(preset => (
                          <option key={preset.id} value={preset.id}>
                            {preset.name} ({preset.gangYieldPerMeter} pcs/m)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Qty Lembar */}
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-zinc-300 block mb-1">
                        Jumlah Lembar
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={allocatedQty}
                        onChange={(e) => setAllocatedQty(e.target.value)}
                        className="w-full bg-[#1A1A1F] border border-white/[0.12] rounded-xl px-2.5 py-2 text-xs font-mono font-bold text-white focus:outline-none text-center"
                      />
                    </div>

                    {/* Add Button */}
                    <div className="sm:col-span-1">
                      <button
                        type="button"
                        onClick={handleAddAllocatedDesign}
                        className="w-full py-2 bg-white text-zinc-950 font-bold text-xs rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center"
                        title="Tambahkan desain ke roll ini"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* If custom selected, show name & sku input */}
                  {selectedCatalogSku === 'custom' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-white/[0.06]">
                      <input
                        type="text"
                        placeholder="Nama Desain Baru (cth: Graphic Kopi Senja)"
                        value={customDtfName}
                        onChange={(e) => setCustomDtfName(e.target.value)}
                        className="bg-[#1A1A1F] border border-white/[0.12] rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="Kode SKU (cth: TS-KOP-001)"
                        value={customDtfSku}
                        onChange={(e) => setCustomDtfSku(e.target.value)}
                        className="bg-[#1A1A1F] border border-white/[0.12] rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                  )}
                </div>

                {/* List of Allocated Designs Table */}
                {allocatedDtfDesigns.length > 0 ? (
                  <div className="border border-white/[0.08] rounded-xl overflow-hidden bg-black/30">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-white/[0.04] border-b border-white/[0.08] text-zinc-400 font-mono text-[10px] uppercase">
                        <tr>
                          <th className="py-2.5 px-3">Desain / SKU</th>
                          <th className="py-2.5 px-3">Ukuran Sablon</th>
                          <th className="py-2.5 px-3 text-center">Jumlah Lembar</th>
                          <th className="py-2.5 px-3 text-right">Kebutuhan Roll</th>
                          <th className="py-2.5 px-3 text-right">HPP Alokasi/Lembar</th>
                          <th className="py-2.5 px-3 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.05] text-zinc-200">
                        {allocatedDtfDesigns.map((item) => {
                          const itemMeters = (Number(item.qty) * (item.metersPerPiece || 0.5)).toFixed(2);
                          return (
                            <tr key={item.id} className="hover:bg-white/[0.02]">
                              <td className="py-2 px-3">
                                <div className="font-bold text-white">{item.name}</div>
                                <span className="text-[10px] font-mono text-zinc-400">{item.sku}</span>
                              </td>
                              <td className="py-2 px-3 text-zinc-300">
                                {item.sizeLabel}
                              </td>
                              <td className="py-2 px-3 text-center font-mono font-bold text-emerald-400">
                                {item.qty} lembar
                              </td>
                              <td className="py-2 px-3 text-right font-mono text-zinc-400">
                                ~{itemMeters} meter
                              </td>
                              <td className="py-2 px-3 text-right font-mono text-white font-semibold">
                                {formatRupiah(item.allocatedCost)}
                              </td>
                              <td className="py-2 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveAllocatedDesign(item.id)}
                                  className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                  title="Hapus Alokasi"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {/* Capacity & Roll Alignment Bar */}
                    <div className="p-3 bg-black/50 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                      <div className="space-y-0.5">
                        <div className="text-zinc-300">
                          Total Lembar: <strong className="text-white">{totalAllocatedSheets} lembar film</strong> &bull; Terpakai: <strong className="text-white">~{totalMetersRequired.toFixed(1)} meter</strong> dari {dtfMeters}m roll
                        </div>
                        {remainingRollMeters >= 0 ? (
                          <div className="text-[11px] text-emerald-400">
                            ✅ Kapasitas roll cukup (Sisa ruang ~{remainingRollMeters.toFixed(1)} meter bisa untuk stiker/necktag)
                          </div>
                        ) : (
                          <div className="text-[11px] text-rose-400">
                            ⚠️ Kebutuhan roll (~{totalMetersRequired.toFixed(1)}m) melebihi panjang roll ({dtfMeters}m)!
                          </div>
                        )}
                      </div>

                      {Math.ceil(totalMetersRequired) !== Number(dtfMeters) && totalMetersRequired > 0 && (
                        <button
                          type="button"
                          onClick={() => setDtfMeters(Math.max(1, Math.ceil(totalMetersRequired)))}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 text-[11px] font-bold flex items-center gap-1 shrink-0"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Set Panjang Roll Jadi {Math.max(1, Math.ceil(totalMetersRequired))} Meter</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-dashed border-white/10 text-center text-zinc-500 text-xs">
                    Belum ada desain yang dialokasikan ke roll ini. Anda bisa memilih desain dari katalog di atas untuk langsung menambah stok lembaran film per SKU, atau biarkan kosong jika hanya ingin mencatat roll borongan meteran umum.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: DESIGN LICENSE INTAKE                                              */}
          {/* ========================================================================= */}
          {activeTab === 'design_license' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black/30 p-4 rounded-2xl border border-white/[0.06]">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Nama Judul Desain
                  </label>
                  <input
                    type="text"
                    value={licenseItemName}
                    onChange={(e) => setLicenseItemName(e.target.value)}
                    placeholder="Contoh: Coffee First, Code Later"
                    className="w-full bg-[#1A1A1F] border border-white/[0.12] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Kode SKU Terkait (Opsional)
                  </label>
                  <input
                    type="text"
                    value={licenseSku}
                    onChange={(e) => setLicenseSku(e.target.value)}
                    placeholder="Contoh: TS-PRO-001 (jika sudah ada)"
                    className="w-full bg-[#1A1A1F] border border-white/[0.12] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-black/30 p-4 rounded-2xl border border-white/[0.06]">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Platform Lisensi / Vendor
                  </label>
                  <select
                    value={licenseSupplier}
                    onChange={(e) => setLicenseSupplier(e.target.value)}
                    className="w-full bg-[#1A1A1F] border border-white/[0.12] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white font-medium"
                  >
                    <option value="Etsy Digital Download">Etsy Digital Download</option>
                    <option value="Creative Market">Creative Market</option>
                    <option value="Fiverr Freelance">Fiverr Freelance</option>
                    <option value="Fastwork Indonesia">Fastwork Indonesia</option>
                    <option value="Freelancer Buyout">Freelancer Buyout</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Biaya Beli Lisensi (Rp)
                  </label>
                  <input
                    type="number"
                    value={licenseCost}
                    onChange={(e) => setLicenseCost(e.target.value)}
                    className="w-full bg-[#1A1A1F] border border-white/[0.12] rounded-xl px-3 py-2 text-xs text-white font-mono font-bold focus:outline-none focus:border-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Target Amortisasi (Pcs)
                  </label>
                  <input
                    type="number"
                    value={licenseAmortization}
                    onChange={(e) => setLicenseAmortization(e.target.value)}
                    className="w-full bg-[#1A1A1F] border border-white/[0.12] rounded-xl px-3 py-2 text-xs text-white font-mono font-bold focus:outline-none focus:border-white"
                    required
                  />
                </div>
              </div>

              {/* Calculation Summary Card */}
              <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/25 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    Kalkulasi Amortisasi Beban Desain
                  </span>
                  <span className="text-[10px] font-mono text-sky-300">CFO Unit Economics</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="bg-black/30 p-2.5 rounded-xl border border-sky-500/20">
                    <span className="text-[10px] text-zinc-400 block">Total Pengeluaran Kas:</span>
                    <span className="text-sm font-mono font-bold text-white">{formatRupiah(Number(licenseCost) || 0)}</span>
                  </div>
                  <div className="bg-black/30 p-2.5 rounded-xl border border-sky-500/20">
                    <span className="text-[10px] text-zinc-400 block">Beban per Kaos:</span>
                    <span className="text-sm font-mono font-bold text-sky-300">
                      {formatRupiah(Math.round((Number(licenseCost) || 0) / Math.max(1, Number(licenseAmortization) || 25)))} / kaos
                    </span>
                  </div>
                  <div className="bg-black/30 p-2.5 rounded-xl border border-sky-500/20">
                    <span className="text-[10px] text-zinc-400 block">Klasifikasi Aset:</span>
                    <span className="text-sm font-mono font-bold text-emerald-400">Intangible Asset (Lisensi)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* BOTTOM CONTROLS: PAYMENT SOURCE, CASH LEDGER INTEGRATION, & NOTES         */}
          {/* ========================================================================= */}
          {(() => {
            const activeTotalCost = 
              activeTab === 'wholesale_tshirt' ? wholesaleTotalInvoiced :
              activeTab === 'sticker_outsource' ? stickerTotalCost :
              activeTab === 'packaging_supplies' ? packagingTotalCost :
              activeTab === 'dtf_roll' ? dtfTotalCost :
              Number(licenseCost) || 0;

            const selectedSourceBalance = paymentSource === 'business_bank'
              ? multiUnitBalances?.teestock?.balance || 0
              : paymentSource === 'multigraph_bank'
                ? multiUnitBalances?.multigraph?.balance || 0
                : paymentSource === 'holding_treasury'
                  ? multiUnitBalances?.holding?.balance || 0
                  : null;

            const isProcurementOverdraft = recordCashTx && selectedSourceBalance !== null && activeTotalCost > selectedSourceBalance;

            return (
              <div className="pt-4 border-t border-white/[0.08] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">
                      Sumber Dana Pembayaran (Buku Kas)
                    </label>
                    <select
                      value={paymentSource}
                      onChange={(e) => setPaymentSource(e.target.value)}
                      className="w-full bg-[#1A1A1F] border border-white/[0.12] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none font-medium"
                    >
                      <option value="business_bank">
                        🏦 BCA Bisnis TeeStock ({formatRupiah(multiUnitBalances?.teestock?.balance || 0)})
                      </option>
                      <option value="multigraph_bank">
                        📦 BCA Maklon MultiGraph ({formatRupiah(multiUnitBalances?.multigraph?.balance || 0)})
                      </option>
                      <option value="holding_treasury">
                        🏛️ Holding Reserve Treasury ({formatRupiah(multiUnitBalances?.holding?.balance || 0)})
                      </option>
                      <option value="personal_pocket">
                        💼 Dompet Pribadi Founder (Suntik Modal Tambahan)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-300 block mb-1">
                      Catatan Tambahan / Nomor Resi Ekspedisi
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Contoh: Resi Dakota DA-8912, nota terlampir fisik"
                      className="w-full bg-[#1A1A1F] border border-white/[0.12] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Overdraft Warning Banner */}
                {isProcurementOverdraft && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Peringatan CFO: Saldo Kas Rekening Tidak Cukup!</span>
                      <span>
                        Saldo rekening asal saat ini hanya <strong>{formatRupiah(selectedSourceBalance)}</strong>. Pembayaran nota sebesar <strong>{formatRupiah(activeTotalCost)}</strong> akan menyebabkan saldo kas defisit sebesar -{formatRupiah(activeTotalCost - selectedSourceBalance)}.
                      </span>
                    </div>
                  </div>
                )}

                {/* Toggle Auto-Record in Cash Ledger */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/40 border border-white/[0.08]">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      id="recordCashTx"
                      checked={recordCashTx}
                      onChange={(e) => setRecordCashTx(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 text-white focus:ring-0 focus:ring-offset-0 bg-[#1A1A1F]"
                    />
                    <label htmlFor="recordCashTx" className="text-xs font-bold text-white cursor-pointer select-none">
                      Otomatis catat mutasi pengeluaran kas di Buku Kas (CASH_OUT)
                    </label>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {recordCashTx ? '✅ Buku Kas Sinkron' : '⚠️ Hanya Update Stok Fisik'}
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs font-black bg-white text-zinc-950 hover:bg-zinc-200 transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 text-zinc-950" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Pengadaan & Update Stok'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
