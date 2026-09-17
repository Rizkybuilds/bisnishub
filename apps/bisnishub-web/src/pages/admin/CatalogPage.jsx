import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Plus, 
  Shirt, 
  AlertTriangle,
  ShoppingBag,
  Handshake,
  Palette,
  Sparkles,
  CheckCircle2,
  Info,
  DollarSign,
  ShieldCheck,
  Sliders,
  Layers,
  Tag,
  Percent,
  Check,
  RefreshCw,
  Edit3,
  X,
  Star,
  Camera
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { formatRupiah } from '../../utils/formatters';
import { SERIES } from '../../constants/series';
import { uploadToCloudinary } from '../../services/cloudinary';
import { 
  DTF_SERVICE_RATES, 
  GARMENT_OPTIONS, 
  DESIGN_TIERS, 
  CURATED_COLORS, 
  calculateCatalogAutoPrice,
  UNIT_COST_STANDARDS,
  PRINT_PLACEMENTS,
  PRINT_PRESETS,
  isProductBlank 
} from '../../constants/pricing';

export function CatalogPage() {
  const { catalog, saveProduct, deleteProduct, clearAllCatalogProducts, showToast, addProcurement } = useAdmin();
  const [search, setSearch] = useState('');
  const [seriesFilter, setSeriesFilter] = useState('all');
  const [modelFilter, setModelFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingColor, setUploadingColor] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [recordProcurementBridge, setRecordProcurementBridge] = useState(true);

  // Form State - Core Product
  const [editingSku, setEditingSku] = useState(null);
  const [formSku, setFormSku] = useState('');
  const [formName, setFormName] = useState('');
  const [formSeries, setFormSeries] = useState('profesi');
  const [formNiche, setFormNiche] = useState('');
  const [formFilePath, setFormFilePath] = useState('');

  // Auto-Pricing & Specification Customization States (Piagam 17 Sept 2026)
  const [formPrintPreset, setFormPrintPreset] = useState('back_a3_plus');
  const [formPrintPlacements, setFormPrintPlacements] = useState({ front: 'none', back: 'a3_plus', sleeve: 'none' });
  const [formPrintSize, setFormPrintSize] = useState('a3_plus');
  const [formPrimaryGarment, setFormPrimaryGarment] = useState('nsa_heavyweight_24s');
  const [formCompatibleGarments, setFormCompatibleGarments] = useState(['nsa_heavyweight_24s', 'nsa_softstyle_30s']);
  const [formCuratedColors, setFormCuratedColors] = useState(['Hitam', 'Krem', 'Charcoal', 'Forest Green']);
  const [formVariantImages, setFormVariantImages] = useState({}); // { [colorName]: imageUrl }
  const [formDesignTier, setFormDesignTier] = useState('tier2_signature');
  const [formDesignValue, setFormDesignValue] = useState(16000);
  const [formResellerDiscount, setFormResellerDiscount] = useState(25);
  const [formManualOverride, setFormManualOverride] = useState(false);

  // Manual fallback inputs (only when formManualOverride === true)
  const [formPriceRetail, setFormPriceRetail] = useState(99000);
  const [formPriceReseller, setFormPriceReseller] = useState(74250);
  const [formCostBlank, setFormCostBlank] = useState(42000);
  const [formCostDtf, setFormCostDtf] = useState(14500);

  // Form State - Curated Design Sourcing Model
  const [formDesignSource, setFormDesignSource] = useState('flat_fee'); // 'flat_fee' | 'creator_collab' | 'in_house'
  const [formDesignCost, setFormDesignCost] = useState(150000);
  const [formAmortizationTarget, setFormAmortizationTarget] = useState(25);
  const [formLicenseSource, setFormLicenseSource] = useState('Etsy');
  const [formCreatorName, setFormCreatorName] = useState('');
  const [formCreatorHandle, setFormCreatorHandle] = useState('');
  const [formRoyaltyAmount, setFormRoyaltyAmount] = useState(20000);
  const [formCreatorPayoutAccount, setFormCreatorPayoutAccount] = useState('');

  const filteredCatalog = catalog.filter(p => {
    const matchQ = !search || 
      p.sku.toLowerCase().includes(search.toLowerCase()) || 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.niche && p.niche.toLowerCase().includes(search.toLowerCase())) ||
      (p.creatorName && p.creatorName.toLowerCase().includes(search.toLowerCase())) ||
      (p.creatorHandle && p.creatorHandle.toLowerCase().includes(search.toLowerCase())) ||
      (p.licenseSource && p.licenseSource.toLowerCase().includes(search.toLowerCase()));

    const matchS = seriesFilter === 'all' || p.series === seriesFilter;

    const pModel = p.designSource || p.design_source || 
      (p.creatorName || p.creator_name ? 'creator_collab' : (p.licenseSource || p.designCost ? 'flat_fee' : 'in_house'));
    const matchM = modelFilter === 'all' || pModel === modelFilter;

    return matchQ && matchS && matchM;
  });

  // Live reactive auto-pricing calculation (Zero-Manual Input)
  const isBlankForm = formSeries === 'blank' || formSku?.startsWith('TS-BLK-');
  const autoPrice = calculateCatalogAutoPrice({
    garmentId: formPrimaryGarment,
    printPreset: isBlankForm ? 'none' : formPrintPreset,
    printPlacements: isBlankForm ? { front: 'none', back: 'none', sleeve: 'none' } : formPrintPlacements,
    printSizeId: isBlankForm ? 'none' : formPrintSize,
    designValue: isBlankForm ? 0 : formDesignValue,
    resellerDiscountPercent: formResellerDiscount,
    isWhite: false
  });

  // Effective values: Reactive Auto by default, or manual override if enabled
  const activeRetailPrice = formManualOverride ? (Number(formPriceRetail) || 0) : autoPrice.retailPrice;
  const activeResellerPrice = formManualOverride ? (Number(formPriceReseller) || 0) : autoPrice.resellerPrice;
  const activeCostBlank = formManualOverride ? (Number(formCostBlank) || 0) : autoPrice.garmentVendorCost;
  const activeCostDtf = formManualOverride ? (Number(formCostDtf) || 0) : autoPrice.dtfFilmCost;

  // Preset selector
  const handleSelectPreset = (preset) => {
    setFormPrintPreset(preset.id);
    if (preset.placements) {
      setFormPrintPlacements({ ...preset.placements });
      const mainSize = preset.placements.back !== 'none' 
        ? preset.placements.back 
        : (preset.placements.front !== 'none' ? preset.placements.front : 'a3_plus');
      setFormPrintSize(mainSize);
    }
  };

  // Custom placement zone changer
  const handlePlacementChange = (zone, value) => {
    const updated = {
      ...formPrintPlacements,
      [zone]: value
    };
    setFormPrintPlacements(updated);
    const mainSize = updated.back !== 'none' 
      ? updated.back 
      : (updated.front !== 'none' ? updated.front : 'a3_plus');
    setFormPrintSize(mainSize);

    // Check if updated matches any preset
    const matched = PRINT_PRESETS.find(p => 
      p.placements &&
      p.placements.front === updated.front &&
      p.placements.back === updated.back &&
      p.placements.sleeve === updated.sleeve
    );
    setFormPrintPreset(matched ? matched.id : 'custom');
  };

  // Curated color toggler
  const toggleCuratedColor = (colorIdOrName) => {
    const colorObj = CURATED_COLORS.find(c => c.id === colorIdOrName || c.name === colorIdOrName);
    const targetId = colorObj ? colorObj.id : colorIdOrName;

    const isSelected = formCuratedColors.some(c => c === targetId || (colorObj && c === colorObj.name));

    if (isSelected) {
      if (formCuratedColors.length > 1) {
        setFormCuratedColors(formCuratedColors.filter(c => c !== targetId && (!colorObj || c !== colorObj.name)));
      } else {
        showToast("Minimal pilih 1 warna rekomendasi", "warning");
      }
    } else {
      setFormCuratedColors([...formCuratedColors, targetId]);
    }
  };

  // Per-color mockup image handlers
  const handleColorImageUpload = async (colorName, file) => {
    if (!file) return;
    setUploadingColor(colorName);
    showToast(`Mengunggah mockup warna ${colorName} ke Cloudinary CDN...`, "info");
    try {
      const res = await uploadToCloudinary(file);
      setFormVariantImages(prev => ({
        ...prev,
        [colorName]: res.url
      }));
      if (!formFilePath) {
        setFormFilePath(res.url);
      }
      showToast(`✅ Mockup warna ${colorName} berhasil diunggah!`);
    } catch (err) {
      alert(`Gagal upload mockup warna ${colorName}: ` + err.message);
    } finally {
      setUploadingColor(null);
    }
  };

  const handleColorImageUrlChange = (colorName, url) => {
    setFormVariantImages(prev => {
      const updated = { ...prev };
      if (url.trim()) {
        updated[colorName] = url.trim();
      } else {
        delete updated[colorName];
      }
      return updated;
    });
  };

  const handleRemoveColorImage = (colorName) => {
    setFormVariantImages(prev => {
      const updated = { ...prev };
      delete updated[colorName];
      return updated;
    });
  };

  const handleSetMainImage = (url) => {
    setFormFilePath(url);
    showToast("✅ Ditetapkan sebagai Foto Mockup Utama!");
  };

  // Compatible garments toggler
  const toggleCompatibleGarment = (garmentId) => {
    if (formCompatibleGarments.includes(garmentId)) {
      if (formCompatibleGarments.length > 1) {
        setFormCompatibleGarments(formCompatibleGarments.filter(g => g !== garmentId));
      } else {
        showToast("Minimal pilih 1 model garmen yang kompatibel", "warning");
      }
    } else {
      setFormCompatibleGarments([...formCompatibleGarments, garmentId]);
    }
  };

  const handleOpenAdd = () => {
    setEditingSku(null);
    setFormSku(`TS-${formSeries.substring(0,3).toUpperCase()}-${String(catalog.length + 1).padStart(3, '0')}`);
    setFormName('');
    setFormNiche('');
    setFormFilePath('');

    // Customization & Auto-pricing defaults (Anchor Rp 99.000)
    setFormPrintPreset('back_a3_plus');
    setFormPrintPlacements({ front: 'none', back: 'a3_plus', sleeve: 'none' });
    setFormPrintSize('a3_plus');
    setFormPrimaryGarment('nsa_heavyweight_24s');
    setFormCompatibleGarments(['nsa_heavyweight_24s', 'nsa_softstyle_30s']);
    setFormCuratedColors(['Hitam', 'Krem', 'Charcoal', 'Forest Green']);
    setFormVariantImages({});
    setUploadingColor(null);
    setFormDesignTier('tier2_signature');
    setFormDesignValue(16000);
    setFormResellerDiscount(25);
    setFormManualOverride(false);

    setFormPriceRetail(99000);
    setFormPriceReseller(74250);
    setFormCostBlank(42000);
    setFormCostDtf(14500);

    // Design sourcing defaults
    setFormDesignSource('flat_fee');
    setFormDesignCost(150000);
    setFormAmortizationTarget(25);
    setFormLicenseSource('Etsy');
    setFormCreatorName('');
    setFormCreatorHandle('');
    setFormRoyaltyAmount(20000);
    setFormCreatorPayoutAccount('');
    setRecordProcurementBridge(true);

    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    const isBlank = isProductBlank(p);
    setEditingSku(p.sku);
    setFormSku(p.sku);
    setFormName(p.name);
    setFormSeries(p.series || (isBlank ? 'blank' : 'profesi'));
    setFormNiche(p.niche || '');
    setFormFilePath(p.filePath || p.file_path || '');

    // Restore customization & auto-pricing specs
    const printPreset = isBlank ? 'none' : (p.printPreset || p.print_preset || 'back_a3_plus');
    const defaultPlacements = isBlank ? { front: 'none', back: 'none', sleeve: 'none' } : (p.printPlacements || p.print_placements || (
      p.printSize ? (
        p.printSize === 'a3_plus_a6' ? { front: 'logo', back: 'a3_plus', sleeve: 'none' } :
        p.printSize === 'a4' ? { front: 'a4', back: 'none', sleeve: 'none' } :
        p.printSize === 'logo' || p.printSize === 'a6' ? { front: 'logo', back: 'none', sleeve: 'none' } :
        { front: 'none', back: p.printSize, sleeve: 'none' }
      ) : { front: 'none', back: 'a3_plus', sleeve: 'none' }
    ));
    const mainSize = defaultPlacements.back !== 'none' 
      ? defaultPlacements.back 
      : (defaultPlacements.front !== 'none' ? defaultPlacements.front : (p.printSize || 'a3_plus'));

    const compGarments = Array.isArray(p.compatibleGarments || p.compatible_garments) && (p.compatibleGarments || p.compatible_garments).length > 0
      ? (p.compatibleGarments || p.compatible_garments)
      : ['nsa_heavyweight_24s', 'nsa_softstyle_30s'];
    const curColorsRaw = Array.isArray(p.curatedColors || p.curated_colors) && (p.curatedColors || p.curated_colors).length > 0
      ? (p.curatedColors || p.curated_colors)
      : (p.colors ? p.colors.split(',').map(s => s.trim()).filter(Boolean) : ['Hitam', 'Krem', 'Charcoal', 'Forest Green']);
    const curColors = curColorsRaw.map(colorVal => {
      const match = CURATED_COLORS.find(c => c.id === colorVal || c.name === colorVal);
      return match ? match.id : colorVal;
    });
    const vImages = p.variantImages || p.variant_images || (p.storyBehind?.variantImages) || {};
    const dTier = isBlank ? 'tier1_essential' : (p.designTier || p.design_tier || 'tier2_signature');
    const dVal = isBlank ? 0 : (p.designValue ?? p.design_value ?? 16000);
    const rDisc = isBlank ? 0 : (p.resellerDiscountPercent ?? p.reseller_discount_percent ?? 25);

    setFormPrintPreset(printPreset);
    setFormPrintPlacements(defaultPlacements);
    setFormPrintSize(mainSize);
    setFormPrimaryGarment(p.primaryGarment || p.primary_garment || 'nsa_heavyweight_24s');
    setFormCompatibleGarments(compGarments);
    setFormCuratedColors(curColors);
    setFormVariantImages(typeof vImages === 'object' && vImages !== null ? vImages : {});
    setUploadingColor(null);
    setFormDesignTier(dTier);
    setFormDesignValue(dVal);
    setFormResellerDiscount(rDisc);
    setFormManualOverride(false);

    setFormPriceRetail(p.priceRetail || p.price_retail || (isBlank ? 45000 : 99000));
    setFormPriceReseller(p.priceReseller || p.price_reseller || (isBlank ? 43000 : 74250));
    setFormCostBlank(p.costBlank ?? p.cost_blank ?? 42000);
    setFormCostDtf(p.costDtf ?? p.cost_dtf ?? (isBlank ? 0 : 14500));

    const dSource = p.designSource || p.design_source || 
      (p.creatorName || p.creator_name ? 'creator_collab' : (p.licenseSource || p.designCost ? 'flat_fee' : 'in_house'));
    setFormDesignSource(dSource);
    setFormDesignCost(p.designCost ?? p.design_cost ?? 150000);
    setFormAmortizationTarget(p.amortizationTarget ?? p.amortization_target ?? 25);
    setFormLicenseSource(p.licenseSource ?? p.license_source ?? 'Etsy');
    setFormCreatorName(p.creatorName ?? p.creator_name ?? '');
    setFormCreatorHandle(p.creatorHandle ?? p.creator_handle ?? '');
    setFormRoyaltyAmount(p.royaltyAmount ?? p.royalty_amount ?? 20000);
    setFormCreatorPayoutAccount(p.creatorPayoutAccount ?? p.creator_payout_account ?? '');
    setRecordProcurementBridge(false);

    setIsModalOpen(true);
  };

  const handleDelete = (sku, name) => {
    if (window.confirm(`Hapus desain "${name}" (${sku}) dari Master Katalog & PIM?`)) {
      deleteProduct(sku);
    }
  };

  const handleClearAll = () => {
    if (window.confirm(`⚠️ PERINGATAN:\n\nApakah Anda yakin ingin membersihkan SEMUA data desain di Master Katalog?\n\nKatalog akan dikosongkan 100% sehingga Anda dapat memulai pengaturan dan pengujian live dari awal.`)) {
      clearAllCatalogProducts();
    }
  };

  const handleCloudinaryUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    showToast("Mengunggah foto ke Cloudinary CDN...", "info");
    try {
      const res = await uploadToCloudinary(file);
      setFormFilePath(res.url);
      showToast("✅ Foto mockup berhasil diunggah ke Cloudinary!");
    } catch (err) {
      alert("Gagal unggah foto: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formSku.trim() || !formName.trim()) {
      alert("SKU dan Nama Desain wajib diisi");
      return;
    }

    setIsSaving(true);
    showToast("Mengunggah desain ke Supabase Cloud...", "info");

    const seriesObj = SERIES.find(s => s.id === formSeries);
    const resolvedMainImage = formFilePath.trim() || Object.values(formVariantImages).find(url => typeof url === 'string' && url.trim().length > 0) || '';
    const mainPrintSize = formPrintPlacements.back !== 'none' 
      ? formPrintPlacements.back 
      : (formPrintPlacements.front !== 'none' ? formPrintPlacements.front : 'a3_plus');

    const payload = {
      sku: formSku.trim(),
      name: formName.trim(),
      series: formSeries,
      seriesName: seriesObj?.name || 'TeeStock',
      niche: formNiche.trim(),
      filePath: resolvedMainImage,
      priceRetail: Number(activeRetailPrice),
      priceReseller: Number(activeResellerPrice),
      costBlank: Number(activeCostBlank),
      costDtf: Number(activeCostDtf),
      // Auto-pricing & Customization Metadata (Multi-placement & Color Mockups)
      printPreset: formPrintPreset,
      printPlacements: formPrintPlacements,
      printSize: mainPrintSize,
      variantImages: formVariantImages,
      primaryGarment: formPrimaryGarment,
      compatibleGarments: formCompatibleGarments,
      curatedColors: formCuratedColors,
      colors: formCuratedColors.join(', '),
      designTier: formDesignTier,
      designValue: Number(formDesignValue),
      resellerDiscountPercent: Number(formResellerDiscount),
      // Curated Sourcing Economics
      designSource: formDesignSource,
      designCost: formDesignSource === 'flat_fee' ? Number(formDesignCost) : 0,
      amortizationTarget: formDesignSource === 'flat_fee' ? Number(formAmortizationTarget) : 25,
      licenseSource: formDesignSource === 'flat_fee' ? formLicenseSource.trim() : '',
      creatorName: formDesignSource === 'creator_collab' ? formCreatorName.trim() : '',
      creatorHandle: formDesignSource === 'creator_collab' ? formCreatorHandle.trim() : '',
      royaltyAmount: formDesignSource === 'creator_collab' ? Number(formRoyaltyAmount) : 0,
      creatorPayoutAccount: formDesignSource === 'creator_collab' ? formCreatorPayoutAccount.trim() : '',
      status: 'active'
    };

    try {
      await saveProduct(payload);

      // Automated Bridge: Catat pengeluaran beli lisensi ke Pengadaan & Buku Kas jika dicentang (hanya produk baru)
      if (!editingSku && formDesignSource === 'flat_fee' && recordProcurementBridge && Number(formDesignCost) > 0) {
        try {
          await addProcurement({
            itemType: 'design_license',
            itemSku: payload.sku,
            itemName: `Lisensi Desain: ${payload.name} (${payload.sku})`,
            supplierName: payload.licenseSource || 'Etsy Digital Download',
            purchaseType: 'satuan',
            qty: 1,
            unitMeasure: 'lisensi',
            unitCost: Number(formDesignCost),
            shippingCost: 0,
            totalCost: Number(formDesignCost),
            realUnitCost: Number(formDesignCost),
            paymentSource: 'business_bank',
            notes: `Beli putih komersial via ${payload.licenseSource || 'Etsy'}, amortisasi ${payload.amortizationTarget || 25} pcs @ ${formatRupiah(Math.round(Number(formDesignCost) / Math.max(1, Number(formAmortizationTarget))))}/kaos.`,
            recordCashTx: true
          });
          showToast(`📦 Nota Pengadaan & mutasi kas lisensi [${payload.sku}] otomatis diterbitkan!`);
        } catch (procErr) {
          console.warn("Gagal otomatis mencatat pengadaan lisensi:", procErr);
        }
      }

      setIsModalOpen(false);
      showToast(`🎉 Sukses! Desain [${payload.sku}] terupload ke Supabase Cloud & live di etalase.`);
    } catch (err) {
      console.error("Gagal simpan produk:", err);
      alert(`Gagal menyimpan produk ke Supabase: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Live Unit Economics & CFO Calculations for Modal
  const isBlankModal = formSeries === 'blank' || formSku?.startsWith('TS-BLK-');
  const costPackaging = isBlankModal ? 0 : 3500; // Polymailer, hangtag, sticker pack
  const costOps = isBlankModal ? 0 : 1000; // Listrik & depresiasi heat press
  const costBlankNum = Number(activeCostBlank) || 0;
  const costDtfNum = isBlankModal ? 0 : (Number(activeCostDtf) || 0);
  const costDefectBuffer = isBlankModal ? 0 : Math.round((costBlankNum + costDtfNum) * 0.05); // 5% buffer reject hanya sablon
  const physicalCogs = costBlankNum + costDtfNum + costPackaging + costOps + costDefectBuffer;

  let designBurden = 0;
  if (!isBlankModal) {
    if (formDesignSource === 'flat_fee') {
      const target = Math.max(1, Number(formAmortizationTarget) || 1);
      designBurden = Math.round((Number(formDesignCost) || 0) / target);
    } else if (formDesignSource === 'creator_collab') {
      designBurden = Number(formRoyaltyAmount) || 0;
    }
  }

  const totalCogsReal = physicalCogs + designBurden;
  const retailPriceNum = Number(activeRetailPrice) || 0;
  const gatewayFee = isBlankModal ? 0 : Math.round(retailPriceNum * 0.02); // 2% payment gateway
  const netProfitRetail = retailPriceNum - totalCogsReal - gatewayFee;
  const marginRetail = retailPriceNum > 0 ? ((netProfitRetail / retailPriceNum) * 100).toFixed(1) : 0;

  return (
    <div>
      <AdminTopbar
        title="Master Katalog & PIM"
        subtitle="Kelola desain resmi, model lisensi (Beli Putih vs Kolab Kreator), HPP riil, dan aset Cloudinary"
        onNewDesign={handleOpenAdd}
      />

      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-ts-surface border border-ts-border p-4 rounded-2xl">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-ts-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari SKU, nama desain, kreator, lisensi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-ts-hitam border border-ts-border rounded-xl pl-9 pr-4 py-2 text-xs text-ts-krem focus:outline-none focus:border-ts-terracotta"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="w-4 h-4 text-ts-muted shrink-0" />
              <select
                value={seriesFilter}
                onChange={(e) => setSeriesFilter(e.target.value)}
                className="bg-ts-hitam border border-ts-border rounded-xl px-3 py-2 text-xs text-ts-krem focus:outline-none focus:border-ts-terracotta"
              >
                <option value="all">Semua Series ({catalog.length})</option>
                {SERIES.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>

              <select
                value={modelFilter}
                onChange={(e) => setModelFilter(e.target.value)}
                className="bg-ts-hitam border border-ts-border rounded-xl px-3 py-2 text-xs text-ts-krem focus:outline-none focus:border-ts-terracotta"
              >
                <option value="all">Semua Model Lisensi</option>
                <option value="flat_fee">📦 Beli Putih (Flat-Fee)</option>
                <option value="creator_collab">🤝 Kolab Kreator (Royalti)</option>
                <option value="in_house">🎨 In-House (Bebas Royalti)</option>
              </select>
            </div>

            {catalog.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                title="Hapus seluruh data desain di Master PIM"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Bersihkan Data Demo</span>
              </button>
            )}
          </div>
        </div>

        {/* Catalog Table */}
        <div className="bg-ts-surface border border-ts-border rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-ts-hitam/60 border-b border-ts-border text-ts-muted font-bold tracking-wider uppercase">
                  <th className="py-3.5 px-4">Mockup</th>
                  <th className="py-3.5 px-4">SKU & Desain</th>
                  <th className="py-3.5 px-4">Model Pengadaan</th>
                  <th className="py-3.5 px-4">Series / Niche</th>
                  <th className="py-3.5 px-4">HPP Nyata</th>
                  <th className="py-3.5 px-4">Harga Retail</th>
                  <th className="py-3.5 px-4">Laba Bersih</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ts-borderDim">
                {filteredCatalog.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <div className="max-w-md mx-auto space-y-3 px-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 mx-auto">
                          <Shirt className="w-6 h-6 text-zinc-400" />
                        </div>
                        <div className="font-bold text-sm text-white">
                          Master Katalog Bersih (0 Produk)
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          Daftarkan desain baru dengan model lisensi Beli Putih (Etsy/Freelancer) atau Kolaborasi Kreator (Royalti).
                        </p>
                        <div className="pt-2">
                          <Button
                            size="sm"
                            variant="primary"
                            icon={Plus}
                            onClick={handleOpenAdd}
                          >
                            + Tambah Desain Baru
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCatalog.map(p => {
                    const isBlank = isProductBlank(p);
                    const cBlank = Number(p.costBlank ?? p.cost_blank ?? 38000);
                    const cDtf = isBlank ? 0 : Number(p.costDtf ?? p.cost_dtf ?? 12750);
                    const cPackaging = isBlank ? 0 : 3500;
                    const cOps = isBlank ? 0 : 1000;
                    const cDefect = isBlank ? 0 : Math.round((cBlank + cDtf) * 0.05);
                    const physicalHpp = cBlank + cDtf + cPackaging + cOps + cDefect;

                    const pModel = p.designSource || p.design_source || 
                      (p.creatorName || p.creator_name ? 'creator_collab' : (p.licenseSource || p.designCost ? 'flat_fee' : 'in_house'));

                    let dBurden = 0;
                    if (!isBlank) {
                      if (pModel === 'flat_fee') {
                        const dCost = Number(p.designCost ?? p.design_cost ?? 0);
                        const dTarget = Math.max(1, Number(p.amortizationTarget ?? p.amortization_target ?? 25));
                        dBurden = Math.round(dCost / dTarget);
                      } else if (pModel === 'creator_collab') {
                        dBurden = Number(p.royaltyAmount ?? p.royalty_amount ?? 0);
                      }
                    }

                    const totalRealHpp = physicalHpp + dBurden;
                    const retail = Number(p.priceRetail ?? p.price_retail ?? (isBlank ? 45000 : 99000));
                    const gateway = isBlank ? 0 : Math.round(retail * 0.02);
                    const profit = retail - totalRealHpp - gateway;
                    const margin = retail > 0 ? ((profit / retail) * 100).toFixed(1) : 0;

                    return (
                      <tr key={p.sku} className="hover:bg-ts-surfaceHover/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="w-12 h-12 rounded-lg bg-ts-hitam border border-ts-border overflow-hidden flex items-center justify-center shrink-0">
                            {p.filePath || p.file_path ? (
                              <img
                                src={p.filePath || p.file_path}
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-ts-muted" />
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-xs font-bold text-ts-terracotta">{p.sku}</span>
                          <div className="font-bold text-sm text-ts-krem mt-0.5">{p.name}</div>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[9px] font-mono text-zinc-300 uppercase border border-zinc-700/60">
                              {isBlank ? 'Kaos Polos Blank' :
                               p.printPreset === 'back_a3_plus' ? 'Punggung A3+' :
                               p.printPreset === 'front_a6_back_a3_plus' ? 'Dada A6 + Punggung A3+' :
                               p.printPreset === 'front_a4' ? 'Depan A4' :
                               p.printPreset === 'front_a4_back_a3' ? 'Depan A4 + Punggung A3' :
                               p.printPreset === 'front_a6_back_a3_plus_sleeve' ? 'Combo 3 Titik' :
                               `DTF ${p.printSize || p.print_size || 'A3+'}`}
                            </span>
                            {p.variantImages && Object.keys(p.variantImages).length > 0 && (
                              <span className="px-1.5 py-0.5 rounded bg-sky-500/10 text-[9px] font-mono text-sky-400 border border-sky-500/30 flex items-center gap-1">
                                <Camera className="w-2.5 h-2.5" />
                                <span>{Object.keys(p.variantImages).length} Mockup</span>
                              </span>
                            )}
                            {p.colors && (
                              <span className="text-[10px] text-zinc-400 font-medium truncate max-w-[150px]" title={p.colors}>
                                🎨 {p.colors}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {isBlank ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                <Shirt className="w-3 h-3" /> Kaos Polos NSA
                              </span>
                              <div className="text-[10px] text-zinc-400 font-mono">
                                Margin Tetap: +Rp 3.000/pcs
                              </div>
                            </div>
                          ) : pModel === 'flat_fee' ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30">
                                <ShoppingBag className="w-3 h-3" /> Beli Putih ({p.licenseSource || p.license_source || 'Etsy'})
                              </span>
                              <div className="text-[10px] text-zinc-400 font-mono">
                                Amortisasi: +{formatRupiah(dBurden)}/pcs ({p.amortizationTarget || p.amortization_target || 25} pcs)
                              </div>
                            </div>
                          ) : pModel === 'creator_collab' ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                                <Handshake className="w-3 h-3" /> Kolab: {p.creatorName || p.creator_name || 'Kreator'}
                              </span>
                              <div className="text-[10px] text-purple-400 font-mono">
                                {p.creatorHandle || p.creator_handle || '@kreator'} • Royalti: +{formatRupiah(dBurden)}/pcs
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-700/40 text-zinc-300 border border-zinc-600/40">
                                <Palette className="w-3 h-3" /> In-House
                              </span>
                              <div className="text-[10px] text-zinc-400 font-mono">
                                Beban Desain: Rp 0
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="terracotta">{p.seriesName || p.series}</Badge>
                          <div className="text-[11px] text-ts-muted mt-1">{p.niche || '-'}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-mono font-bold text-ts-krem">
                            {formatRupiah(totalRealHpp)}
                          </div>
                          <div className="text-[10px] text-ts-muted">
                            {isBlank ? 'Modal Vendor NSA Cititex' : `Fisik ${formatRupiah(physicalHpp)} ${dBurden > 0 ? `+ Desain ${formatRupiah(dBurden)}` : ''}`}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-extrabold text-ts-krem">
                          {formatRupiah(retail)}
                        </td>
                        <td className="py-3 px-4">
                          <div className={`font-mono font-extrabold ${profit >= 0 ? 'text-ts-green' : 'text-rose-400'}`}>
                            {profit >= 0 ? `+${formatRupiah(Math.round(profit))}` : formatRupiah(Math.round(profit))}
                          </div>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isBlank
                              ? 'text-ts-green bg-ts-green/10 border border-ts-green/20'
                              : Number(margin) >= 35 ? 'text-ts-green bg-ts-green/10 border border-ts-green/20' :
                                Number(margin) >= 25 ? 'text-amber-400 bg-amber-400/10 border border-amber-400/20' :
                                'text-rose-400 bg-rose-400/10 border border-rose-400/20'
                          }`}>
                            {isBlank ? `+${formatRupiah(Math.round(profit))} (${margin}%)` : `${margin}%`}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Button size="sm" variant="secondary" onClick={() => handleOpenEdit(p)}>
                              Edit
                            </Button>
                            <button
                              onClick={() => handleDelete(p.sku, p.name)}
                              className="p-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/25 hover:text-rose-300 transition-colors cursor-pointer"
                              title="Hapus Desain dari Master PIM"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Add/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSku ? `Edit Desain: ${editingSku}` : "Tambah Desain Baru ke Master PIM"}
      >
        <form onSubmit={handleSave} className="space-y-4 max-h-[80vh] overflow-y-auto pr-1">
          {/* Section: SKU & Judul */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Kode SKU"
              value={formSku}
              onChange={(e) => setFormSku(e.target.value)}
              required
            />
            <Select
              label="Kategori Series"
              value={formSeries}
              onChange={(e) => setFormSeries(e.target.value)}
            >
              {SERIES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Nama Judul Desain"
              placeholder="Contoh: Coffee First, Code Later"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              required
            />
            <Input
              label="Target Niche / Sub-kultur"
              placeholder="Contoh: Programmer, Barista"
              value={formNiche}
              onChange={(e) => setFormNiche(e.target.value)}
            />
          </div>

          {/* Section 1: Penempatan & Ukuran Area Sablon DTF (Multi-Titik) */}
          <div className="space-y-3.5 p-3.5 bg-ts-hitam/70 border border-ts-border rounded-xl">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-ts-krem flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-ts-terracotta" />
                <span>Penempatan &amp; Ukuran Sablon DTF (Multi-Titik)</span>
              </label>
              <span className="text-[10px] text-ts-muted">Dada, Punggung, dan Lengan/Bahu</span>
            </div>

            {/* Quick Preset Capsules */}
            <div>
              <div className="text-[11px] font-semibold text-zinc-300 mb-1.5 flex items-center justify-between">
                <span>Preset Kombinasi Populer:</span>
                <span className="text-[10px] text-ts-terracotta font-mono font-bold">
                  {PRINT_PRESETS.find(p => p.id === formPrintPreset)?.badge || 'Kustom'}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRINT_PRESETS.map((preset) => {
                  const isSelected = formPrintPreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                        isSelected
                          ? 'bg-ts-terracotta/15 border-ts-terracotta text-white shadow-sm ring-1 ring-ts-terracotta/30'
                          : 'bg-ts-surface/60 border-ts-border text-ts-muted hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs">{preset.shortName}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-ts-terracotta shrink-0" />}
                      </div>
                      <p className="text-[9px] text-zinc-400 line-clamp-2 leading-tight">
                        {preset.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Zone Selectors (Front, Back, Sleeve) */}
            <div className="p-3 bg-ts-surface/70 border border-ts-border/70 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between border-b border-ts-border/40 pb-1.5">
                <span className="text-[11px] font-bold text-ts-krem">Rincian Zona Cetak per Sisi:</span>
                <span className="text-[10px] text-zinc-400">Atur per zona untuk kombinasi custom</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Sisi Depan */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-300 flex items-center justify-between">
                    <span>Sisi Depan</span>
                    <span className="text-[10px] text-ts-muted font-mono">
                      {autoPrice.frontRate > 0 ? `+${formatRupiah(autoPrice.frontRate)}` : 'Nol'}
                    </span>
                  </label>
                  <select
                    value={formPrintPlacements.front || 'none'}
                    onChange={(e) => handlePlacementChange('front', e.target.value)}
                    className="w-full bg-ts-hitam border border-ts-border rounded-lg px-2.5 py-1.5 text-xs text-ts-krem focus:outline-none focus:border-ts-terracotta"
                  >
                    {PRINT_PLACEMENTS.front.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} {item.rate > 0 ? `(+${formatRupiah(item.rate)})` : '(Rp 0)'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sisi Belakang */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-300 flex items-center justify-between">
                    <span>Sisi Belakang</span>
                    <span className="text-[10px] text-ts-muted font-mono">
                      {autoPrice.backRate > 0 ? `+${formatRupiah(autoPrice.backRate)}` : 'Nol'}
                    </span>
                  </label>
                  <select
                    value={formPrintPlacements.back || 'none'}
                    onChange={(e) => handlePlacementChange('back', e.target.value)}
                    className="w-full bg-ts-hitam border border-ts-border rounded-lg px-2.5 py-1.5 text-xs text-ts-krem focus:outline-none focus:border-ts-terracotta"
                  >
                    {PRINT_PLACEMENTS.back.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} {item.rate > 0 ? `(+${formatRupiah(item.rate)})` : '(Rp 0)'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sisi Lengan / Bahu */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-300 flex items-center justify-between">
                    <span>Lengan / Bahu</span>
                    <span className="text-[10px] text-ts-muted font-mono">
                      {autoPrice.sleeveRate > 0 ? `+${formatRupiah(autoPrice.sleeveRate)}` : 'Nol'}
                    </span>
                  </label>
                  <select
                    value={formPrintPlacements.sleeve || 'none'}
                    onChange={(e) => handlePlacementChange('sleeve', e.target.value)}
                    className="w-full bg-ts-hitam border border-ts-border rounded-lg px-2.5 py-1.5 text-xs text-ts-krem focus:outline-none focus:border-ts-terracotta"
                  >
                    {PRINT_PLACEMENTS.sleeve.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} {item.rate > 0 ? `(+${formatRupiah(item.rate)})` : '(Rp 0)'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Live DTF Rate & Film Cost Accumulation */}
              <div className="pt-2 border-t border-ts-border/40 flex flex-wrap items-center justify-between text-[11px] gap-2">
                <div className="flex items-center gap-1.5 text-zinc-300 font-mono">
                  <span>Total Jasa DTF:</span>
                  <strong className="text-ts-terracotta font-bold">{formatRupiah(autoPrice.dtfRate)}</strong>
                  <span className="text-zinc-500">
                    ({[
                      autoPrice.frontRate > 0 ? `Depan ${formatRupiah(autoPrice.frontRate)}` : null,
                      autoPrice.backRate > 0 ? `Belakang ${formatRupiah(autoPrice.backRate)}` : null,
                      autoPrice.sleeveRate > 0 ? `Lengan ${formatRupiah(autoPrice.sleeveRate)}` : null
                    ].filter(Boolean).join(' + ') || 'Rp 0'})
                  </span>
                </div>
                <div className="text-zinc-400 font-mono">
                  Estimasi Modal Film: ~<strong className="text-zinc-200">{formatRupiah(autoPrice.dtfFilmCost)}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Garmen Baseline & Kompatibilitas */}
          <div className="space-y-3 p-3.5 bg-ts-hitam/70 border border-ts-border rounded-xl">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-ts-krem flex items-center gap-1.5">
                <Shirt className="w-3.5 h-3.5 text-ts-terracotta" />
                <span>Model Garmen Baseline & Kompatibilitas</span>
              </label>
              <span className="text-[10px] text-ts-muted">Standar Vendor Cititex NSA</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-zinc-300 block mb-1">Garmen Acuan Utama (Baseline)</label>
                <select
                  value={formPrimaryGarment}
                  onChange={(e) => setFormPrimaryGarment(e.target.value)}
                  className="w-full bg-ts-hitam border border-ts-border rounded-xl px-3 py-2 text-xs text-ts-krem focus:outline-none focus:border-ts-terracotta"
                >
                  {GARMENT_OPTIONS.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} — Retail {formatRupiah(g.retailPriceColor)} (Modal {formatRupiah(g.vendorCostColor)})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-zinc-300 block mb-1">Model Kompatibel (Bisa Dipilih Pembeli)</label>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {GARMENT_OPTIONS.map((g) => {
                    const isChecked = formCompatibleGarments.includes(g.id);
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => toggleCompatibleGarment(g.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all cursor-pointer flex items-center gap-1 ${
                          isChecked
                            ? 'bg-ts-krem/15 border-ts-krem/50 text-ts-krem shadow-sm'
                            : 'bg-ts-hitam/40 border-ts-border/60 text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 text-ts-krem shrink-0" />}
                        <span>{g.shortName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Kurasi Palet Warna Cocok */}
          <div className="space-y-2.5 p-3.5 bg-ts-hitam/70 border border-ts-border rounded-xl">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-ts-krem flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-ts-terracotta" />
                <span>Kurasi Warna Cocok (Curated Swatches)</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFormCuratedColors(CURATED_COLORS.map(c => c.id))}
                  className="text-[10px] text-ts-muted hover:text-ts-krem underline cursor-pointer"
                >
                  Pilih Semua
                </button>
                <span className="text-zinc-600">•</span>
                <button
                  type="button"
                  onClick={() => setFormCuratedColors(['Hitam', 'Krem', 'Charcoal', 'Forest Green'])}
                  className="text-[10px] text-ts-terracotta hover:underline cursor-pointer"
                >
                  Preset Gelap & Earth
                </button>
              </div>
            </div>
            <p className="text-[10px] text-zinc-400">
              Pilih warna kain yang cocok dengan estetika grafis desain ini. Hanya warna terpilih yang dapat dibeli oleh konsumen di etalase toko.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
              {CURATED_COLORS.map((c) => {
                const isSelected = formCuratedColors.some(val => val === c.id || val === c.name);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCuratedColor(c.id)}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'bg-ts-surfaceHover border-ts-krem/40 text-white shadow-sm ring-1 ring-white/10'
                        : 'bg-ts-hitam/40 border-ts-border/50 text-zinc-500 hover:border-zinc-700'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 border shadow-inner"
                      style={{ backgroundColor: c.hex, borderColor: c.border }}
                    />
                    <span className="text-[11px] truncate flex-1 font-medium">{c.name.split('(')[0].trim()}</span>
                    {isSelected && <Check className="w-3 h-3 text-ts-terracotta shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Kualitas & Nilai Desain */}
          <div className="space-y-2.5 p-3.5 bg-ts-hitam/70 border border-ts-border rounded-xl">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-ts-krem flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-ts-terracotta" />
                <span>Kualitas Desain &amp; Alokasi Nilai Artwork</span>
              </label>
              <span className="text-[10px] text-ts-muted">Nilai tambah karya di atas HPP fisik</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DESIGN_TIERS.filter(t => t.id !== 'custom').map((tier) => {
                const isSelected = formDesignTier === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => {
                      setFormDesignTier(tier.id);
                      setFormDesignValue(tier.value);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-sm ring-1 ring-amber-500/30'
                        : 'bg-ts-surface/60 border-ts-border text-ts-muted hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">{tier.name.split('(')[0].trim()}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    </div>
                    <div className="text-[11px] font-mono font-bold text-amber-300">
                      +{formatRupiah(tier.value)}
                    </div>
                    <p className="text-[9px] text-zinc-400 mt-0.5 line-clamp-2 leading-tight">
                      {tier.desc}
                    </p>
                  </button>
                );
              })}
            </div>
            {formDesignTier === 'custom' && (
              <div className="pt-2">
                <Input
                  label="Nominal Nilai Desain Kustom (Rp)"
                  type="number"
                  value={formDesignValue}
                  onChange={(e) => setFormDesignValue(Number(e.target.value) || 0)}
                  placeholder="Contoh: 20000"
                />
              </div>
            )}
          </div>

          {/* Section: Model Pengadaan Desain (Curated Sourcing Model) */}
          <div className="space-y-3 p-3.5 bg-ts-hitam/70 border border-ts-border rounded-xl">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-ts-krem flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-ts-terracotta" />
                <span>Model Pengadaan & Hak Cipta Desain</span>
              </label>
              <span className="text-[10px] text-ts-muted">Menentukan beban HPP & alokasi royalti</span>
            </div>

            {/* 3 Model Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormDesignSource('flat_fee')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  formDesignSource === 'flat_fee'
                    ? 'bg-sky-500/15 border-sky-500/50 text-white shadow-sm'
                    : 'bg-ts-surface/60 border-ts-border text-ts-muted hover:border-zinc-700 hover:text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <ShoppingBag className={`w-4 h-4 ${formDesignSource === 'flat_fee' ? 'text-sky-400' : 'text-zinc-400'}`} />
                  <span className="text-xs font-bold">Beli Putih</span>
                </div>
                <p className="text-[10px] leading-tight text-zinc-400">
                  Flat-Fee (Etsy / Freelance). Diamortisasi per kuota pcs.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFormDesignSource('creator_collab')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  formDesignSource === 'creator_collab'
                    ? 'bg-purple-500/15 border-purple-500/50 text-white shadow-sm'
                    : 'bg-ts-surface/60 border-ts-border text-ts-muted hover:border-zinc-700 hover:text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Handshake className={`w-4 h-4 ${formDesignSource === 'creator_collab' ? 'text-purple-400' : 'text-zinc-400'}`} />
                  <span className="text-xs font-bold">Kolab Kreator</span>
                </div>
                <p className="text-[10px] leading-tight text-zinc-400">
                  Bagi hasil royalti tunai per kaos terjual. Zero modal upfront.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFormDesignSource('in_house')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  formDesignSource === 'in_house'
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-sm'
                    : 'bg-ts-surface/60 border-ts-border text-ts-muted hover:border-zinc-700 hover:text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Palette className={`w-4 h-4 ${formDesignSource === 'in_house' ? 'text-emerald-400' : 'text-zinc-400'}`} />
                  <span className="text-xs font-bold">In-House</span>
                </div>
                <p className="text-[10px] leading-tight text-zinc-400">
                  Karya tim internal / public domain. Beban desain Rp 0.
                </p>
              </button>
            </div>

            {/* Dynamic Inputs Based on Model */}
            {formDesignSource === 'flat_fee' && (
              <div className="pt-2 space-y-2.5 border-t border-ts-border/60">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <Input
                    label="Biaya Beli Desain (Rp)"
                    type="number"
                    value={formDesignCost}
                    onChange={(e) => setFormDesignCost(e.target.value)}
                    placeholder="Contoh: 150000"
                    required
                  />
                  <Input
                    label="Target Amortisasi (Pcs)"
                    type="number"
                    value={formAmortizationTarget}
                    onChange={(e) => setFormAmortizationTarget(e.target.value)}
                    placeholder="Contoh: 25"
                    required
                  />
                  <Select
                    label="Platform Lisensi"
                    value={formLicenseSource}
                    onChange={(e) => setFormLicenseSource(e.target.value)}
                  >
                    <option value="Etsy">Etsy Digital Download</option>
                    <option value="Creative Market">Creative Market</option>
                    <option value="Fiverr">Fiverr Freelance</option>
                    <option value="Fastwork">Fastwork Indonesia</option>
                    <option value="Freelancer Buyout">Freelancer Buyout</option>
                  </Select>
                </div>
                <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-[11px] text-sky-300 flex items-start gap-2">
                  <Info className="w-4 h-4 shrink-0 text-sky-400 mt-0.5" />
                  <div>
                    <span className="font-bold">Logika Amortisasi Flat-Fee:</span> Biaya beli {formatRupiah(Number(formDesignCost) || 0)} dibagi {formAmortizationTarget || 25} pcs = beban <strong className="font-mono text-white">+{formatRupiah(designBurden)} / kaos</strong>. Setelah kuota {formAmortizationTarget || 25} pcs laku, desain lunas (Rp 0) dan keuntungan melonjak 100% jadi profit murni!
                  </div>
                </div>

                {/* Automated Bridge: Catat ke Pengadaan & Buku Kas */}
                <label className="flex items-start sm:items-center gap-2.5 p-3 rounded-xl bg-sky-500/10 border border-sky-500/25 cursor-pointer hover:bg-sky-500/15 transition-all">
                  <input
                    type="checkbox"
                    checked={recordProcurementBridge}
                    onChange={(e) => setRecordProcurementBridge(e.target.checked)}
                    className="mt-0.5 sm:mt-0 rounded text-sky-500 focus:ring-sky-500 h-4 w-4 bg-black/40 border-white/20"
                  />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-sky-200 flex items-center gap-1.5">
                      <span>Otomatis catat pengeluaran beli lisensi ({formatRupiah(Number(formDesignCost) || 0)}) ke Faktur Pengadaan &amp; Buku Kas</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed">
                      Menerbitkan nota PO aset digital di menu Pengadaan &amp; memotong saldo Kas Operasional TeeStock (BCA Bisnis) tanpa entri manual ganda.
                    </p>
                  </div>
                </label>
              </div>
            )}

            {formDesignSource === 'creator_collab' && (
              <div className="pt-2 space-y-2.5 border-t border-ts-border/60">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <Input
                    label="Nama Lengkap Kreator"
                    value={formCreatorName}
                    onChange={(e) => setFormCreatorName(e.target.value)}
                    placeholder="Contoh: Ardiansyah"
                    required
                  />
                  <Input
                    label="Akun Sosmed Kreator"
                    value={formCreatorHandle}
                    onChange={(e) => setFormCreatorHandle(e.target.value)}
                    placeholder="Contoh: @ardi_sketch"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <Input
                    label="Royalti per Kaos Terjual (Rp)"
                    type="number"
                    value={formRoyaltyAmount}
                    onChange={(e) => setFormRoyaltyAmount(e.target.value)}
                    placeholder="Contoh: 20000 atau 25000"
                    required
                  />
                  <Input
                    label="Rekening Payout Kreator"
                    value={formCreatorPayoutAccount}
                    onChange={(e) => setFormCreatorPayoutAccount(e.target.value)}
                    placeholder="Contoh: BCA 87201928 a/n Ardi"
                  />
                </div>
                <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[11px] text-purple-200 flex items-start gap-2">
                  <Info className="w-4 h-4 shrink-0 text-purple-400 mt-0.5" />
                  <div>
                    <span className="font-bold">Zero Upfront Cash Risk:</span> Kas TeeStock tidak terbebani di awal. Beban royalti <strong className="font-mono text-white">+{formatRupiah(designBurden)} / kaos</strong> hanya dibayarkan ke {formCreatorName || 'kreator'} saat produk terjual.
                  </div>
                </div>
              </div>
            )}

            {formDesignSource === 'in_house' && (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                <div>
                  <span className="font-bold">In-House Asset:</span> Desain internal brand atau typographic quote bebas lisensi. Beban desain <strong className="font-mono text-white">Rp 0</strong> per kaos. 100% margin dinikmati TeeStock.
                </div>
              </div>
            )}
          </div>

          {/* Section: Mockup & Per-Color Mockup Manager */}
          <div className="p-4 bg-ts-hitam/70 border border-ts-border rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-ts-border/60 pb-2">
              <label className="text-xs font-bold text-ts-krem flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-ts-terracotta" />
                <span>Foto Mockup &amp; Galeri per Varian Warna</span>
              </label>
              <span className="text-[10px] text-ts-muted">Mobile-First Dynamic Swatch Switcher</span>
            </div>

            {/* Foto Mockup Utama (Default Hero Cover) */}
            <div className="p-3 bg-ts-surface/70 border border-ts-border/70 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-ts-krem block">Foto Mockup Utama (Cover Katalog)</span>
                  <span className="text-[10px] text-zinc-400">Tampil pertama kali di etalase toko dan thumbnail katalog</span>
                </div>
                <label className="cursor-pointer text-[11px] font-bold text-ts-terracotta hover:underline flex items-center gap-1 bg-ts-terracotta/10 px-2.5 py-1 rounded-lg border border-ts-terracotta/30">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading ? "Mengunggah..." : "Upload Cover ke Cloudinary"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCloudinaryUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex items-center gap-3">
                {formFilePath ? (
                  <div className="w-14 h-14 rounded-xl border border-ts-border overflow-hidden bg-black shrink-0 relative group">
                    <img src={formFilePath} alt="Cover Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-xl border border-dashed border-zinc-700 flex items-center justify-center bg-ts-hitam shrink-0">
                    <ImageIcon className="w-5 h-5 text-zinc-600" />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    placeholder="https://res.cloudinary.com/... atau paste link mockup utama"
                    value={formFilePath}
                    onChange={(e) => setFormFilePath(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Per-Color Mockup Manager */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-ts-krem flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-sky-400" />
                    <span>Mockup Khusus per Warna Kain ({formCuratedColors.length} Warna Terpilih)</span>
                  </span>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    Foto akan otomatis berganti seketika saat pembeli mengklik warna kain di etalase produk.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {formCuratedColors.map((rawColor) => {
                  const colorObj = CURATED_COLORS.find(c => c.name === rawColor || c.id === rawColor);
                  const colorName = colorObj ? colorObj.id : rawColor;
                  const colorMeta = colorObj || {
                    name: colorName,
                    hex: '#27272A',
                    border: '#52525B'
                  };
                  const colorImageUrl = formVariantImages[colorName] || formVariantImages[rawColor] || '';
                  const isMainPhoto = Boolean(colorImageUrl && formFilePath === colorImageUrl);
                  const isUploadingThis = uploadingColor === colorName;

                  return (
                    <div
                      key={colorName}
                      className={`p-3 rounded-xl border transition-all ${
                        colorImageUrl
                          ? 'bg-ts-surface/90 border-ts-border'
                          : 'bg-ts-surface/40 border-ts-border/60 border-dashed'
                      }`}
                    >
                      {/* Color Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full border shadow-inner shrink-0"
                            style={{ backgroundColor: colorMeta.hex, borderColor: colorMeta.border }}
                          />
                          <span className="text-xs font-bold text-ts-krem">{colorName}</span>
                        </div>
                        {isMainPhoto && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 text-[9px] flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-amber-300" /> Foto Utama
                          </span>
                        )}
                      </div>

                      {/* Color Mockup Content */}
                      <div className="flex items-start gap-2.5">
                        {colorImageUrl ? (
                          <div className="w-16 h-16 rounded-xl border border-ts-border overflow-hidden bg-black shrink-0 relative group shadow-sm">
                            <img src={colorImageUrl} alt={colorName} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-xl border border-dashed border-zinc-700 flex flex-col items-center justify-center bg-ts-hitam/60 text-zinc-500 shrink-0">
                            <Camera className="w-4 h-4 mb-0.5 text-zinc-600" />
                            <span className="text-[8px] text-zinc-500">Kosong</span>
                          </div>
                        )}

                        <div className="flex-1 space-y-1.5 min-w-0">
                          <input
                            type="text"
                            placeholder={`URL Mockup ${colorName}...`}
                            value={colorImageUrl}
                            onChange={(e) => handleColorImageUrlChange(colorName, e.target.value)}
                            className="w-full bg-ts-hitam border border-ts-border rounded-lg px-2 py-1 text-[10px] text-ts-krem font-mono focus:outline-none focus:border-ts-terracotta"
                          />

                          <div className="flex flex-wrap items-center gap-2 pt-0.5">
                            <label className="cursor-pointer px-2 py-1 rounded-lg bg-ts-hitam border border-ts-border hover:border-ts-terracotta text-ts-krem text-[10px] font-medium flex items-center gap-1">
                              <Upload className="w-3 h-3 text-ts-terracotta" />
                              <span>{isUploadingThis ? "Mengunggah..." : "Upload"}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleColorImageUpload(colorName, e.target.files?.[0])}
                                disabled={isUploadingThis}
                                className="hidden"
                              />
                            </label>

                            {colorImageUrl && !isMainPhoto && (
                              <button
                                type="button"
                                onClick={() => handleSetMainImage(colorImageUrl)}
                                className="text-[10px] text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-0.5 cursor-pointer"
                                title="Jadikan foto utama"
                              >
                                <Star className="w-3 h-3" />
                                <span>Set Cover</span>
                              </button>
                            )}

                            {colorImageUrl && (
                              <button
                                type="button"
                                onClick={() => handleRemoveColorImage(colorName)}
                                className="text-[10px] text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-0.5 cursor-pointer ml-auto"
                                title="Hapus foto warna ini"
                              >
                                <X className="w-3 h-3" />
                                <span>Hapus</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section: Auto-Pricing Engine & Reseller Setting (Zero-Manual Input) */}
          <div className="p-4 rounded-2xl bg-ts-surface border border-ts-border space-y-3 shadow-md">
            <div className="flex items-center justify-between border-b border-ts-border/60 pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-ts-terracotta" />
                <span className="font-bold text-xs text-ts-krem">Auto-Pricing Engine &amp; Skema Reseller</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                  Zero Manual Typing
                </span>
              </div>
              <button
                type="button"
                onClick={() => setFormManualOverride(!formManualOverride)}
                className="text-[11px] text-ts-muted hover:text-ts-krem flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Edit3 className="w-3 h-3" />
                <span>{formManualOverride ? "Kembali ke Otomatis" : "Override Manual"}</span>
              </button>
            </div>

            {/* Dynamic 4-Component Formula Banner */}
            <div className="p-3 rounded-xl bg-ts-hitam/80 border border-ts-border/70 text-xs space-y-1.5">
              <div className="text-[11px] text-zinc-400 flex items-center justify-between">
                <span>Formula Resmi Piagam Kesepakatan:</span>
                <span className="font-mono text-zinc-300">Kaos + Sablon DTF + Kemasan + Nilai Desain</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  Kaos {formatRupiah(autoPrice.garmentRetail)}
                </span>
                <span className="text-zinc-500">+</span>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  DTF {formatRupiah(autoPrice.dtfRate)}
                </span>
                <span className="text-zinc-500">+</span>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  Kemasan Rp 3.000
                </span>
                <span className="text-zinc-500">+</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Desain +{formatRupiah(autoPrice.designValue)}
                </span>
                <span className="text-zinc-500">=</span>
                <span className="px-2.5 py-0.5 rounded bg-ts-terracotta/20 text-ts-terracotta font-extrabold border border-ts-terracotta/40">
                  {formatRupiah(activeRetailPrice)}
                </span>
              </div>
            </div>

            {/* Reseller Discount % Setting */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-ts-hitam/50 p-3 rounded-xl border border-ts-border/40 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-ts-krem flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5 text-sky-400" />
                    <span>Diskon Reseller (%)</span>
                  </label>
                  <span className="font-mono font-bold text-xs text-sky-300">{formResellerDiscount}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="10"
                    max="40"
                    step="1"
                    value={formResellerDiscount}
                    onChange={(e) => setFormResellerDiscount(Number(e.target.value))}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={formResellerDiscount}
                    onChange={(e) => setFormResellerDiscount(Number(e.target.value))}
                    className="w-14 bg-ts-hitam border border-ts-border rounded-lg px-2 py-1 text-xs text-center font-mono text-ts-krem"
                  />
                </div>
                <p className="text-[10px] text-zinc-400">
                  Standar kemitraan katalog: <strong>25%</strong> dari harga retail resmi.
                </p>
              </div>

              <div className="bg-ts-hitam/50 p-3 rounded-xl border border-ts-border/40 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] text-ts-muted block">Harga Resmi Reseller Bayar:</span>
                  <div className="text-base font-extrabold font-mono text-sky-400 mt-0.5">
                    {formatRupiah(activeResellerPrice)}
                  </div>
                </div>
                <div className="text-[10px] text-zinc-400 font-mono pt-1.5 border-t border-ts-border/40 mt-1 flex justify-between">
                  <span>Untung Reseller: <strong className="text-emerald-400">+{formatRupiah(activeRetailPrice - activeResellerPrice)}</strong></span>
                  <span>Laba Studio: <strong className="text-sky-300">+{formatRupiah(activeResellerPrice - autoPrice.physicalCogs)}</strong></span>
                </div>
              </div>
            </div>

            {/* Manual Override Fields (Conditional) */}
            {formManualOverride && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Mode Override Manual Aktif (Penyesuaian Angka Psikologis)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Input
                    label="Retail (Rp)"
                    type="number"
                    value={formPriceRetail}
                    onChange={(e) => setFormPriceRetail(e.target.value)}
                  />
                  <Input
                    label="Reseller (Rp)"
                    type="number"
                    value={formPriceReseller}
                    onChange={(e) => setFormPriceReseller(e.target.value)}
                  />
                  <Input
                    label="Modal Garmen (Rp)"
                    type="number"
                    value={formCostBlank}
                    onChange={(e) => setFormCostBlank(e.target.value)}
                  />
                  <Input
                    label="Modal DTF (Rp)"
                    type="number"
                    value={formCostDtf}
                    onChange={(e) => setFormCostDtf(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Live COGS & CFO Guardrail Preview Box */}
          <div className="p-4 rounded-2xl bg-ts-surfaceHover/80 border border-ts-border text-xs space-y-2.5 shadow-inner">
            <div className="flex items-center justify-between border-b border-ts-border/60 pb-2">
              <span className="font-bold text-ts-krem flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-ts-terracotta" />
                Kalkulasi Unit Economics Live (Per Kaos)
              </span>
              <span className="font-mono text-[11px] text-ts-muted">Formula CFO & COO</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="bg-ts-hitam/50 p-2 rounded-xl border border-ts-border/40">
                <span className="text-ts-muted block">{isBlankModal ? 'Modal Vendor NSA:' : 'HPP Fisik (Garmen+DTF):'}</span>
                <span className="font-mono font-bold text-ts-krem">{formatRupiah(costBlankNum + costDtfNum)}</span>
              </div>
              <div className="bg-ts-hitam/50 p-2 rounded-xl border border-ts-border/40">
                <span className="text-ts-muted block">{isBlankModal ? 'Packaging & Sablon:' : 'Packaging + Ops + Defect:'}</span>
                <span className="font-mono font-bold text-ts-krem">{isBlankModal ? 'Rp 0 (Blank)' : formatRupiah(costPackaging + costOps + costDefectBuffer)}</span>
              </div>
              <div className="bg-ts-hitam/50 p-2 rounded-xl border border-ts-border/40">
                <span className="text-ts-muted block">Beban Desain ({formDesignSource === 'creator_collab' ? 'Royalti' : 'Amortisasi'}):</span>
                <span className="font-mono font-bold text-ts-terracotta">{isBlankModal ? 'Rp 0 (Blank)' : formatRupiah(designBurden)}</span>
              </div>
              <div className="bg-ts-hitam/50 p-2 rounded-xl border border-ts-border/40">
                <span className="text-ts-muted block">Payment Gateway (2%):</span>
                <span className="font-mono font-bold text-ts-muted">{formatRupiah(gatewayFee)}</span>
              </div>
            </div>

            <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-ts-border/60">
              <div>
                <span className="text-ts-muted">Total Beban Real per Kaos: </span>
                <span className="font-mono font-extrabold text-ts-krem">{formatRupiah(totalCogsReal + gatewayFee)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-ts-muted">Laba Bersih Retail:</span>
                <span className={`font-mono font-extrabold text-sm ${netProfitRetail >= 0 ? 'text-ts-green' : 'text-rose-400'}`}>
                  {netProfitRetail >= 0 ? `+${formatRupiah(Math.round(netProfitRetail))}` : formatRupiah(Math.round(netProfitRetail))}
                </span>
                <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${
                  isBlankModal
                    ? 'text-ts-green bg-ts-green/10 border-ts-green/30'
                    : Number(marginRetail) >= 35 ? 'text-ts-green bg-ts-green/10 border-ts-green/30' :
                      Number(marginRetail) >= 25 ? 'text-amber-400 bg-amber-400/10 border-amber-400/30' :
                      'text-rose-400 bg-rose-400/10 border-rose-400/30'
                }`}>
                  {isBlankModal ? `+${formatRupiah(Math.round(netProfitRetail))} (${marginRetail}%)` : `${marginRetail}%`}
                </span>
              </div>
            </div>

            {/* CFO Guardrail Indicator Alert */}
            <div className={`p-2 rounded-xl text-[11px] flex items-center gap-2 font-medium ${
              isBlankModal
                ? 'bg-ts-green/10 text-ts-green border border-ts-green/20'
                : Number(marginRetail) >= 35 
                ? 'bg-ts-green/10 text-ts-green border border-ts-green/20' 
                : Number(marginRetail) >= 25 
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' 
                : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
            }`}>
              {isBlankModal ? (
                <>
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-ts-green" />
                  <span>✅ <strong>Kaos Polos NSA:</strong> Margin tetap ritel flat +{formatRupiah(Math.round(netProfitRetail))}/pcs ({marginRetail}%) sesuai Piagam Kesepakatan. Zero beban sablon & garansi retur vendor.</span>
                </>
              ) : Number(marginRetail) >= 35 ? (
                <>
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-ts-green" />
                  <span>✅ <strong>Lolos Guardrail CFO:</strong> Net margin &ge; 35%. Unit economics sangat sehat untuk ekspansi brand & ads.</span>
                </>
              ) : Number(marginRetail) >= 25 ? (
                <>
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>⚠️ <strong>Margin Cukup (25% - 35%):</strong> Di atas batas bahaya, namun perhatikan volume penjualan & diskon promosi.</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>⛔ <strong>Di Bawah Floor CFO (&lt; 25%):</strong> Berisiko menekan kas! Sarankan naikkan harga retail atau kurangi beban royalti.</span>
                </>
              )}
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-ts-borderDim">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isSaving}>
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={isSaving}>
              {isSaving ? "Mengunggah ke Supabase..." : "Simpan ke Master PIM"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
