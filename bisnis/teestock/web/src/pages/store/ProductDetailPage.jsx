import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  ArrowLeft, 
  Check, 
  MessageSquare,
  Layers,
  Ruler,
  Clock,
  RotateCcw,
  Tag,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { GARMENT_TYPES, SIZES } from '../../constants/garments';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SizeCalculatorModal } from '../../components/store/SizeCalculatorModal';
import { StickyMobileBuyBar } from '../../components/store/StickyMobileBuyBar';
import { formatRupiah } from '../../utils/formatters';
import { sanitizePhoneNumber } from '../../utils/whatsappTemplates';
import { SEOHead } from '../../components/common/SEOHead';
import { BUNDLE_DEALS } from '../../constants/pricing';
import { ProductReviews } from '../../components/store/ProductReviews';

const COLOR_HEX_MAP = {
  "Hitam": "#111111",
  "Black": "#111111",
  "Putih": "#F8F8F8",
  "White": "#F8F8F8",
  "Charcoal": "#2B2B2B",
  "Navy": "#1B2A4A",
  "Maroon": "#5C1D24",
  "Sport Grey": "#A5A5A5",
  "Forest Green": "#224A30",
  "Royal Blue": "#1E40AF",
  "Red": "#B91C1C",
  "Merah": "#B91C1C",
  "Irish Green": "#15803D",
  "Daisy": "#FBBF24",
  "Heliconia": "#E11D48",
  "Sand": "#D4B996",
  "Orange": "#EA580C",
  "Mustard": "#D9A441",
  "Salmon": "#FA8072",
  "Aqua Sky": "#7AC5CD",
  "Gold": "#E5A823",
  "Dark Green": "#1B4D3E",
  "Neon Green": "#39FF14",
  "Carolina Blue": "#7BAFD4",
  "Lime": "#A3E635",
  "Light Pink": "#FBCFE8",
  "Sapphire": "#0284C7",
  "Purple": "#7E22CE",
  "Chestnut": "#854D0E",
  "Military Green": "#4D5645",
  "Butter": "#FEF08A",
  "Green Ash": "#A7F3D0",
  "Lilac": "#C084FC",
  "Dark Chocolate": "#382216",
  "Army": "#4B5320",
  "Black Camo": "#262626",
  "Forest Camo": "#2F3E2E",
  "Black Heather": "#2D3748",
  "Navy Heather": "#2A3A5E",
  "Red Heather": "#9B2C2C",
  "Dark Green Heather": "#234E32",
  "Burgundy Heather": "#6B1D2F",
  "Light Blue": "#93C5FD",
  "Black-Forest Camo": "#1A2E1A",
  "Black-Graphite": "#374151",
  "Black-White": "#1F2937",
  "Gold - Grey": "#D97706",
  "Orange - Charcoal": "#C2410C",
  "Royal Blue - Charcoal": "#1D4ED8",
  "White - Grey": "#E2E8F0",
  "White-Black": "#E5E7EB",
  "White-Red": "#FCA5A5",
  "White-Navy": "#93C5FD",
  "White-Forest Green": "#86EFAC",
  "White-Gold": "#FDE68A",
  "White-Maroon": "#FECDD3",
  "White-Royal Blue": "#BFDBFE",
  "White-Charcoal": "#D1D5DB",
  "Sport Grey-Black": "#9CA3AF",
  "Sport Grey-Navy": "#94A3B8",
  "Sport Grey-Maroon": "#9B7E84",
  "Sport Grey-Red": "#B87F86"
};

const COLOR_CATEGORIES = {
  basic: ["Hitam", "Black", "Putih", "White", "Charcoal", "Sport Grey", "Sport Grey-Black", "White-Black"],
  earthy: ["Sand", "Army", "Military Green", "Forest Green", "Dark Green", "Navy", "Maroon", "Dark Chocolate", "Chestnut"],
  vibrant: ["Daisy", "Mustard", "Orange", "Gold", "Royal Blue", "Red", "Merah", "Heliconia", "Sapphire", "Purple", "Lime", "Lilac", "Aqua Sky"]
};

export function ProductDetailPage() {
  const { sku } = useParams();
  const navigate = useNavigate();
  const { catalog } = useAdmin();
  const { addToCart, storeSettings } = useStore();

  const product = catalog.find(p => p.sku === sku);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Produk Tidak Ditemukan</h2>
        <p className="text-xs text-ts-muted">Desain atau produk polos dengan SKU {sku} tidak terdaftar di katalog kami.</p>
        <Link to="/katalog">
          <Button variant="primary">Kembali ke Katalog</Button>
        </Link>
      </div>
    );
  }

  const isBlank = product.series === 'blank';

  const [selectedGarmentKey, setSelectedGarmentKey] = useState('nsa_softstyle_30s');
  const selectedGarment = GARMENT_TYPES[selectedGarmentKey] || GARMENT_TYPES.nsa_softstyle_30s;
  
  // Available colors
  const colorList = isBlank && product.colors
    ? product.colors.split(',').map(c => c.trim()).filter(Boolean)
    : selectedGarment.colors.map(c => c.name);

  const [selectedColor, setSelectedColor] = useState(colorList[0] || 'Black');
  const [activeColorTab, setActiveColorTab] = useState('all'); // 'all', 'basic', 'earthy', 'vibrant'

  // Filtered color list based on active tab
  const filteredColors = useMemo(() => {
    if (activeColorTab === 'all') return colorList;
    const catList = COLOR_CATEGORIES[activeColorTab] || [];
    const matched = colorList.filter(c => catList.some(cat => c.toLowerCase().includes(cat.toLowerCase())));
    return matched.length > 0 ? matched : colorList;
  }, [colorList, activeColorTab]);

  // Available sizes
  const sizeList = isBlank && product.sizes
    ? product.sizes.split(',').map(s => s.trim()).filter(Boolean)
    : SIZES;

  const [selectedSize, setSelectedSize] = useState(sizeList[0] || 'L');
  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Dynamic image state with fallback
  const defaultImage = product.filePath || product.file_path;
  const [previewImg, setPreviewImg] = useState(defaultImage);

  // Sync state whenever sku changes
  useEffect(() => {
    if (colorList.length > 0) {
      const initialColor = colorList[0];
      setSelectedColor(initialColor);
      if (isBlank && product.cititexCatId) {
        const initialUrl = `https://cititex.com/api/uploads/category/album/front_side/${product.cititexCatId}-${encodeURIComponent(initialColor)}.jpg`;
        setPreviewImg(initialUrl);
      } else {
        setPreviewImg(defaultImage);
      }
    }
    if (sizeList.length > 0) {
      setSelectedSize(sizeList[0]);
    }
  }, [product.sku]);

  // Handle scroll for sticky mobile action bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 420) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Price adjustments & Partner Role detection
  const { role, profile, isPartner } = useAuth();
  const baseRetailPrice = product.priceRetail || product.price_retail || 99000;
  
  let effectiveBasePrice = baseRetailPrice;
  let partnerSavings = 0;
  let isPartnerDiscountApplied = false;

  if (isPartner && !isBlank) {
    const isReseller = profile?.partner_tier === 'reseller';
    const partnerBase = isReseller
      ? (product.priceReseller || product.price_reseller || 65000)
      : (product.priceDropship || product.price_dropship || 75000);
    
    effectiveBasePrice = partnerBase;
    partnerSavings = baseRetailPrice - partnerBase;
    isPartnerDiscountApplied = true;
  }

  let priceDelta = 0;
  if (!isBlank) {
    if (selectedGarmentKey === 'nsa_heavyweight_24s') priceDelta = 10000;
    else if (selectedGarmentKey === 'nsa_longsleeve') priceDelta = 12000;
    else if (selectedGarmentKey === 'nsa_hoodie') priceDelta = 85000;
    else if (selectedGarmentKey === 'nsa_polo') priceDelta = 30000;
  }
  const currentPrice = isBlank ? baseRetailPrice : (effectiveBasePrice + priceDelta);

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": previewImg ? [previewImg] : [],
    "description": product.description || "Kaos New States Apparel original dengan sablon DTF HD anti-pecah.",
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": "TeeStock Apparel"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://teestock.vercel.app/produk/${product.sku}`,
      "priceCurrency": "IDR",
      "price": currentPrice,
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock"
    }
  };

  const handleColorChange = (colName) => {
    setSelectedColor(colName);
    if (isBlank && product.cititexCatId) {
      const cititexUrl = `https://cititex.com/api/uploads/category/album/front_side/${product.cititexCatId}-${encodeURIComponent(colName)}.jpg`;
      setPreviewImg(cititexUrl);
    }
  };

  const handleAddToCart = () => {
    const garmentObj = isBlank ? { name: product.name } : selectedGarment;
    addToCart(product, garmentObj, selectedColor, selectedSize, qty, currentPrice);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  const handleBuyNow = () => {
    const garmentObj = isBlank ? { name: product.name } : selectedGarment;
    addToCart(product, garmentObj, selectedColor, selectedSize, qty, currentPrice);
    navigate('/keranjang');
  };

  const cleanWhatsapp = sanitizePhoneNumber(storeSettings?.storeWhatsapp || '085220274968');
  const handleBuyWhatsapp = () => {
    const waText = encodeURIComponent(
      `Halo TeeStock! Saya ingin pesan:\nProduk: ${product.name} (${product.sku})\nModel: ${isBlank ? product.name : selectedGarment.name}\nWarna: ${selectedColor}\nUkuran: ${selectedSize}\nJumlah: ${qty} pcs\nTotal: ${formatRupiah(currentPrice * qty)}`
    );
    window.open(`https://wa.me/${cleanWhatsapp}?text=${waText}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <SEOHead
        title={`${product.name} — Kaos NSA 24s Heavyweight Sablon DTF HD | TeeStock`}
        description={`${product.name}. Dicetak dengan sablon DTF HD di atas garmen New States Apparel (NSA) Heavyweight 24s / Softstyle 30s original tanpa jahitan samping.`}
        keywords={[product.name, product.seriesName || 'kaos distro', 'kaos nsa 24s heavyweight', 'kaos nsa softstyle 30s', 'sablon dtf satuan']}
        image={previewImg}
        canonicalPath={`/produk/${product.sku}`}
        type="product"
        schema={productSchema}
      />
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-ts-muted">
        <Link to="/katalog" className="hover:text-ts-terracotta flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Katalog
        </Link>
        <span>/</span>
        <span className="text-ts-kremMuted">{product.seriesName || product.series}</span>
        <span>/</span>
        <span className="text-white font-bold truncate max-w-xs">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Product Showcase & Image (5 Cols) */}
        <div className="lg:col-span-6 space-y-5">
          <div className="aspect-square bg-ts-surface/80 border border-white/[0.09] rounded-3xl overflow-hidden shadow-glass-card shadow-glass-inset relative group">
            <img
              src={previewImg}
              alt={`${product.name} - ${selectedColor}`}
              onError={() => setPreviewImg(defaultImage)}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
            />
            
            {/* Top SKU Chip */}
            <div className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-ts-hitam/85 backdrop-blur-md border border-white/10 font-mono text-xs font-bold text-ts-terracotta shadow-md">
              {product.sku}
            </div>

            {/* Top Right Original NSA Seal */}
            {isBlank ? (
              <div className="absolute top-4 right-4 px-3 py-1 rounded-xl bg-ts-surface/90 backdrop-blur-md border border-white/10 text-xs font-bold text-white flex items-center gap-1.5 shadow-md">
                <ShieldCheck className="w-3.5 h-3.5 text-ts-green" />
                <span>100% Original NSA</span>
              </div>
            ) : (
              <div className="absolute top-4 right-4 px-3 py-1 rounded-xl bg-ts-surface/90 backdrop-blur-md border border-white/10 text-xs font-bold text-white flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-ts-mustard" />
                <span>DTF HD Raster</span>
              </div>
            )}

            {/* Active Color Name Pill */}
            <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-xl bg-ts-hitam/85 backdrop-blur-md border border-white/15 text-xs font-semibold text-white flex items-center gap-2 shadow-lg">
              <span
                className="w-3 h-3 rounded-full border border-white/40 shrink-0"
                style={{ backgroundColor: COLOR_HEX_MAP[selectedColor] || '#333333' }}
              />
              <span>Warna: <strong className="text-white">{selectedColor}</strong></span>
            </div>
          </div>

          {/* Wholesale Lusinan Price Promo Card for Blanks */}
          {isBlank && (
            <div className="p-4 sm:p-5 bg-gradient-to-r from-ts-teal/15 via-ts-surface/90 to-ts-surface/90 border border-ts-teal/30 rounded-2xl flex items-center justify-between text-xs shadow-glass-inset">
              <div className="space-y-1">
                <div className="font-extrabold text-white flex items-center gap-1.5 text-sm">
                  <Tag className="w-4 h-4 text-ts-teal" />
                  <span>Harga Grosir Lusinan (&ge;12 pcs)</span>
                </div>
                <p className="text-[11px] text-ts-kremMuted">
                  Beli 12 pcs atau lebih (bisa campur warna &amp; size) otomatis dapat harga grosir reseller.
                </p>
              </div>
              <div className="text-right font-mono shrink-0 pl-3">
                <div className="text-[10px] text-ts-muted">Mulai</div>
                <div className="font-black text-base sm:text-lg text-ts-green">
                  {formatRupiah(product.priceReseller || (currentPrice - 7000))}
                  <span className="text-[10px] font-normal text-ts-muted">/pcs</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Spec & Purchasing Controls (7 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-ts-terracotta uppercase tracking-wider font-mono">
                {product.seriesName || product.series}
              </span>
              {product.niche && (
                <>
                  <span className="text-white/20">•</span>
                  <span className="text-xs font-medium text-ts-kremMuted">{product.niche}</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              {product.name}
            </h1>

            <div className="space-y-2 pt-1">
              {isPartnerDiscountApplied ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-3xl font-black text-ts-green">
                      {formatRupiah(currentPrice)}
                    </span>
                    <span className="text-sm text-ts-muted line-through font-mono">
                      {formatRupiah(baseRetailPrice + priceDelta)}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-ts-mustard/15 text-ts-mustard border border-ts-mustard/30 uppercase">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Harga Mitra ({profile?.partner_tier || 'Dropship'}) • Hemat {formatRupiah(partnerSavings)}/pcs</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="font-mono text-3xl font-black text-ts-green">
                      {formatRupiah(currentPrice)}
                    </span>
                    {!isBlank && (
                      <span className="text-base text-ts-muted line-through font-mono">
                        {formatRupiah(139000 + priceDelta)}
                      </span>
                    )}
                    {!isBlank && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-ts-terracotta/20 text-ts-terracotta border border-ts-terracotta/30">
                        Hemat 28%
                      </span>
                    )}
                    <span className="text-xs text-ts-muted font-mono">/ pcs</span>
                  </div>

                  {/* Partner Teaser for non-partners */}
                  {!isBlank && (
                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-ts-kremMuted">
                        <span className="text-ts-mustard font-bold">💼 Mau jual kembali?</span>
                        <span>Harga Mitra mulai <strong className="text-white font-mono">{formatRupiah(65000)}</strong></span>
                      </div>
                      <Link to="/partner" className="text-ts-terracotta hover:underline font-bold text-[11px] shrink-0 pl-2">
                        Info Mitra &rarr;
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-ts-kremMuted leading-relaxed">
            {product.description || (isBlank 
              ? "Kaos polos original New States Apparel (NSA) tanpa jahitan samping (tubular) standar ekspor internasional."
              : "Kaos print-on-demand premium dengan sablon DTF resolusi tinggi pada kaos katun New States Apparel impor.")}
          </p>

          {/* SLA Badge */}
          {isBlank ? (
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-ts-teal/10 border border-ts-teal/30 text-xs">
              <Truck className="w-5 h-5 shrink-0 text-ts-teal" />
              <div>
                <strong className="block font-bold text-white">⚡ Ready Stock &amp; Pengiriman H+1</strong>
                <span className="text-[11px] text-ts-kremMuted">Kaos Polos NSA ready di warehouse. Langsung dipacking dan dikirim besok.</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-ts-mustard/10 border border-ts-mustard/30 text-xs">
              <Clock className="w-5 h-5 shrink-0 text-ts-mustard" />
              <div>
                <strong className="block font-bold text-white">🛠️ Fresh POD • Cetak Presisi 155°C</strong>
                <span className="text-[11px] text-ts-kremMuted">Diproduksi khusus on-demand dengan double heat press suhu 155°C anti-retak.</span>
              </div>
            </div>
          )}

          <hr className="border-white/[0.06]" />

          {/* Model Garment Selector (Graphic Tees only) */}
          {!isBlank && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-white flex items-center justify-between">
                <span>Pilih Model Garmen Kaos NSA:</span>
                <span className="text-[11px] font-mono text-ts-mustard">{selectedGarment.name}</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(GARMENT_TYPES).filter(([k]) => k !== 'supplies').slice(0, 5).map(([k, g]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => {
                      setSelectedGarmentKey(k);
                      if (g.colors?.[0]) setSelectedColor(g.colors[0].name);
                    }}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all duration-200 cursor-pointer ${
                      selectedGarmentKey === k
                        ? 'bg-ts-terracotta/20 border-ts-terracotta text-white shadow-glow-terracotta ring-1 ring-ts-terracotta'
                        : 'bg-white/[0.03] border-white/[0.08] text-ts-kremMuted hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    <div>{g.name}</div>
                    <div className="text-[10px] text-ts-muted font-normal mt-0.5">
                      {k === 'nsa_softstyle_30s' ? 'Standar Distro' : `+${formatRupiah(k === 'nsa_heavyweight_24s' ? 10000 : k === 'nsa_longsleeve' ? 12000 : k === 'nsa_hoodie' ? 85000 : 30000)}`}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selector with Category Tabs (21st.dev style) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-2">
                <span>Pilihan Warna:</span>
                <span className="text-ts-mustard font-bold">{selectedColor}</span>
              </label>
              <span className="text-[11px] text-ts-muted font-mono">
                {colorList.length} Warna Resmi
              </span>
            </div>

            {/* Category Filter Pills */}
            {colorList.length > 8 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                {[
                  { id: 'all', label: 'Semua' },
                  { id: 'basic', label: 'Basic & Netral' },
                  { id: 'earthy', label: 'Earthy & Deep' },
                  { id: 'vibrant', label: 'Vibrant' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveColorTab(tab.id)}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      activeColorTab === tab.id
                        ? 'bg-white/[0.12] text-white border border-white/20'
                        : 'text-ts-muted hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            {/* Color Swatch Circle Grid */}
            <div className="p-3.5 bg-white/[0.02] border border-white/[0.08] rounded-2xl space-y-2">
              <div className="flex flex-wrap items-center gap-2.5 max-h-48 overflow-y-auto pr-1">
                {filteredColors.map(colName => {
                  const hex = COLOR_HEX_MAP[colName] || '#333333';
                  const isSelected = selectedColor === colName;
                  const swatchUrl = product.cititexCatId 
                    ? `https://cititex.com/api/uploads/category/album/color/${product.cititexCatId}-${encodeURIComponent(colName)}.jpg`
                    : null;

                  return (
                    <button
                      key={colName}
                      type="button"
                      onClick={() => handleColorChange(colName)}
                      title={colName}
                      className={`group relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden transition-all duration-200 shrink-0 cursor-pointer ${
                        isSelected
                          ? 'ring-2 ring-ts-terracotta ring-offset-2 ring-offset-ts-hitam scale-110 z-10 shadow-glow-terracotta'
                          : 'ring-1 ring-white/20 hover:ring-white/60 hover:scale-105 opacity-85 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: hex }}
                    >
                      {swatchUrl && (
                        <img
                          src={swatchUrl}
                          alt={colName}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      )}
                      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block z-30 px-2 py-0.5 rounded-md bg-ts-hitam text-[10px] font-bold text-white border border-white/20 whitespace-nowrap shadow-xl">
                        {colName}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-ts-muted italic pt-1">
                * Klik warna di atas untuk mengganti preview kaos secara langsung.
              </p>
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white">Ukuran Kaos:</label>
              <button
                type="button"
                onClick={() => setIsSizeModalOpen(true)}
                className="text-xs text-ts-mustard hover:text-white font-bold flex items-center gap-1.5 bg-white/[0.04] hover:bg-white/[0.08] px-3 py-1 rounded-lg border border-white/[0.1] transition-all cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5" /> Hitung Ukuran (TB/BB)
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {sizeList.map(sz => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`w-12 h-11 rounded-xl border font-mono text-xs font-extrabold transition-all duration-150 cursor-pointer ${
                    selectedSize === sz
                      ? 'bg-ts-terracotta text-white border-ts-terracotta shadow-glow-terracotta'
                      : 'bg-white/[0.03] border-white/[0.08] text-ts-kremMuted hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Bundling Promotion Banner (AOV Booster) */}
          {role !== 'reseller' && role !== 'dropship' && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-ts-terracotta/15 via-ts-mustard/10 to-transparent border border-ts-terracotta/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white flex items-center gap-1.5 uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-ts-mustard" />
                  Promo Paket Bundling
                </span>
                <span className="text-[10px] font-mono font-bold text-ts-terracotta bg-ts-terracotta/20 px-2 py-0.5 rounded border border-ts-terracotta/40">
                  HEMAT S.D RP 42.000
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {BUNDLE_DEALS.map((deal) => (
                  <button
                    key={deal.minQty}
                    type="button"
                    onClick={() => setQty(deal.minQty)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      qty === deal.minQty
                        ? 'bg-ts-terracotta text-white border-ts-terracotta shadow-glow-terracotta'
                        : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] text-ts-krem'
                    }`}
                  >
                    <div className="font-bold text-[11px] leading-tight flex items-center justify-between">
                      <span>{deal.title}</span>
                      {qty === deal.minQty && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div className="text-[10px] font-mono font-bold text-ts-mustard mt-1">
                      {formatRupiah(deal.pricePerItem * deal.minQty)}
                    </div>
                    <div className="text-[9px] text-ts-kremMuted mt-0.5">
                      {deal.badge}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & High-Conversion Action Buttons */}
          <div className="space-y-3.5 pt-4 border-t border-white/[0.08]">
            <div className="flex items-center gap-3">
              {/* Qty Stepper */}
              <div className="flex items-center border border-white/[0.1] rounded-xl bg-white/[0.03] p-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-8 h-9 rounded-lg hover:bg-white/[0.1] text-white font-bold text-base cursor-pointer transition-colors"
                >
                  -
                </button>
                <span className="w-10 text-center font-mono font-bold text-sm text-white">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty(qty + 1)}
                  className="w-8 h-9 rounded-lg hover:bg-white/[0.1] text-white font-bold text-base cursor-pointer transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <Button
                variant="primary"
                size="lg"
                className="flex-1 text-sm sm:text-base py-3 shadow-glow-terracotta"
                icon={isAdded ? Check : ShoppingBag}
                onClick={handleAddToCart}
              >
                {isAdded ? "Berhasil Masuk Troli!" : "Tambah ke Troli"}
              </Button>
            </div>

            {/* Dual CTA: Beli Web & Direct WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Button
                variant="cream"
                size="lg"
                className="w-full text-xs sm:text-sm py-3 font-extrabold"
                onClick={handleBuyNow}
              >
                Checkout Langsung Web
              </Button>
              <Button
                variant="whatsapp"
                size="lg"
                className="w-full text-xs sm:text-sm py-3 font-bold"
                icon={MessageSquare}
                onClick={handleBuyWhatsapp}
              >
                Pesan via WhatsApp (0% Fee)
              </Button>
            </div>

            {/* Guarantees */}
            <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-ts-muted border-t border-white/[0.06]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-ts-green shrink-0" />
                <span>100% Produk Asli NSA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-ts-terracotta shrink-0" />
                <span>Garansi Retur Jika Cacat</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof & Customer Reviews Section */}
      <div className="mt-12 sm:mt-16">
        <ProductReviews productName={product.name} sku={product.sku} />
      </div>

      {/* Interactive Size Calculator Modal */}
      <SizeCalculatorModal
        isOpen={isSizeModalOpen}
        onClose={() => setIsSizeModalOpen(false)}
        onSelectSize={(sz) => setSelectedSize(sz)}
        currentSize={selectedSize}
      />

      {/* Sticky Action Bar on Mobile Viewport */}
      <StickyMobileBuyBar
        product={product}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        price={currentPrice}
        onAddToCart={handleAddToCart}
        onBuyWhatsapp={handleBuyWhatsapp}
        isVisible={showStickyBar}
      />
    </div>
  );
}
