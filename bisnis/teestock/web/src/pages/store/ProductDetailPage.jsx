import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight,
  Check, 
  MessageSquare, 
  Layers, 
  Ruler, 
  Clock, 
  RotateCcw, 
  Tag, 
  ExternalLink, 
  ChevronRight,
  ChevronLeft,
  Building2, 
  Zap,
  Maximize2,
  X
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { GARMENT_TYPES, SIZES } from '../../constants/garments';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SizeCalculatorModal } from '../../components/store/SizeCalculatorModal';
import { formatRupiah } from '../../utils/formatters';
import { sanitizePhoneNumber } from '../../utils/whatsappTemplates';
import { SEOHead } from '../../components/common/SEOHead';
import { BUNDLE_DEALS, getSizeSurcharge, getBlankPricing } from '../../constants/pricing';
import { ProductReviews } from '../../components/store/ProductReviews';
import { getFulfillmentSLA } from '../../utils/garmentStockRouting';
import { COLOR_HEX_MAP, getColorHex } from '../../constants/colors';
import { getProductGallery, getFabricSwatchUrl } from '../../utils/productImages';

const COLOR_CATEGORIES = {
  basic: ["Hitam", "Black", "Putih", "White", "Charcoal", "Sport Grey", "Sport Grey-Black", "White-Black"],
  earthy: ["Sand", "Army", "Military Green", "Forest Green", "Dark Green", "Navy", "Maroon", "Dark Chocolate", "Chestnut"],
  vibrant: ["Daisy", "Mustard", "Orange", "Gold", "Royal Blue", "Red", "Merah", "Heliconia", "Sapphire", "Purple", "Lime", "Lilac", "Aqua Sky"]
};

function ProductAccordionItem({ title, icon: Icon, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/[0.08] rounded-2xl overflow-hidden bg-white/[0.02]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.04] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5 text-xs font-bold text-white">
          <Icon className="w-4 h-4 text-ts-terracotta shrink-0" />
          <span>{title}</span>
        </div>
        <span className="text-ts-muted text-xs font-mono">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-1 text-xs text-ts-kremMuted leading-relaxed border-t border-white/[0.04]">
          {children}
        </div>
      )}
    </div>
  );
}

export function ProductDetailPage() {
  const { sku } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { catalog, loadingCatalog, addToCart, storeSettings } = useStore();
  const { role, profile, isPartner } = useAuth();

  const product = catalog.find(p => p.sku === sku);
  const isBlank = product?.series === 'blank';

  const [selectedGarmentKey, setSelectedGarmentKey] = useState('nsa_softstyle_30s');
  const selectedGarment = GARMENT_TYPES[selectedGarmentKey] || GARMENT_TYPES.nsa_softstyle_30s;
  
  // Available colors
  const colorList = useMemo(() => {
    if (!product) return selectedGarment.colors.map(c => c.name);
    if (isBlank && product.colors) {
      return product.colors.split(',').map(c => c.trim()).filter(Boolean);
    }
    if (product.colors) {
      return product.colors.split(',').map(c => c.trim()).filter(Boolean);
    }
    return selectedGarment.colors.map(c => c.name);
  }, [isBlank, product?.colors, selectedGarmentKey]);

  const queryColor = searchParams.get('color');

  const [selectedColor, setSelectedColor] = useState(() => {
    if (queryColor) {
      const match = colorList.find(c => c.toLowerCase() === queryColor.toLowerCase());
      if (match) return match;
    }
    return colorList[0] || (isBlank ? 'White' : 'Hitam');
  });

  const [activeColorTab, setActiveColorTab] = useState('all'); // 'all', 'basic', 'earthy', 'vibrant'

  // Dynamic multi-photo gallery for current active color
  const gallery = useMemo(() => {
    if (!product) return [];
    return getProductGallery(product, selectedColor);
  }, [product, selectedColor]);

  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  // Filtered color list based on active tab
  const filteredColors = useMemo(() => {
    if (activeColorTab === 'all') return colorList;
    const catList = COLOR_CATEGORIES[activeColorTab] || [];
    const matched = colorList.filter(c => catList.some(cat => c.toLowerCase().includes(cat.toLowerCase())));
    return matched.length > 0 ? matched : colorList;
  }, [colorList, activeColorTab]);

  // 8 Warna khusus NSA 7200 yang tersedia hingga ukuran 5XL
  const SIZES_5XL_COLORS = ['black', 'white', 'navy', 'maroon', 'red', 'royal blue', 'forest green', 'carolina blue', 'caroline blue'];

  // Available sizes dengan filtering dinamis per warna
  const sizeList = useMemo(() => {
    if (isBlank && (product?.sku === 'TS-BLK-7200' || product?.name?.includes('7200'))) {
      const is5XL = SIZES_5XL_COLORS.includes(String(selectedColor).trim().toLowerCase());
      return is5XL 
        ? ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL']
        : ['S', 'M', 'L', 'XL', '2XL', '3XL'];
    }
    if (isBlank && product?.sizes) {
      return product.sizes.split(',').map(s => s.trim()).filter(Boolean);
    }
    return SIZES;
  }, [isBlank, product, selectedColor]);

  const [selectedSize, setSelectedSize] = useState(sizeList[0] || 'L');

  // Pastikan jika ganti warna dan ukuran lama tidak ada (misal 5XL ke warna 3XL), auto-switch ke ukuran terdekat
  useEffect(() => {
    if (sizeList.length > 0 && !sizeList.includes(selectedSize)) {
      setSelectedSize(sizeList[sizeList.length - 1] || 'L');
    }
  }, [sizeList, selectedSize]);
  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Dynamic image state with fallback
  const defaultImage = product ? (product.filePath || product.file_path) : '';
  const [previewImg, setPreviewImg] = useState(() => (gallery[0] ? gallery[0].url : defaultImage));

  // Sync state ONLY when SKU changes (not on every re-render)
  useEffect(() => {
    if (!product) return;
    let initialCol = colorList[0] || (isBlank ? 'White' : 'Hitam');
    if (queryColor) {
      const match = colorList.find(c => c.toLowerCase() === queryColor.toLowerCase());
      if (match) initialCol = match;
    }
    setSelectedColor(initialCol);
    if (sizeList.length > 0) {
      setSelectedSize(sizeList[0]);
    }
  }, [product?.sku]);

  // Sync gallery and preview image whenever selectedColor or gallery changes
  useEffect(() => {
    setActiveGalleryIndex(0);
    if (gallery.length > 0) {
      setPreviewImg(gallery[0].url);
    } else {
      setPreviewImg(defaultImage);
    }
  }, [selectedColor, gallery, defaultImage]);

  // Image handlers for thumbnail & lightbox navigation
  const handleSelectThumbnail = (idx) => {
    setActiveGalleryIndex(idx);
    if (gallery[idx]) {
      setPreviewImg(gallery[idx].url);
    }
  };

  const handlePrevImage = (e) => {
    if (e?.stopPropagation) e.stopPropagation();
    const len = gallery.length || 1;
    const newIdx = (activeGalleryIndex - 1 + len) % len;
    handleSelectThumbnail(newIdx);
  };

  const handleNextImage = (e) => {
    if (e?.stopPropagation) e.stopPropagation();
    const len = gallery.length || 1;
    const newIdx = (activeGalleryIndex + 1) % len;
    handleSelectThumbnail(newIdx);
  };

  // Lightbox keyboard navigation (Escape to close, Arrow keys to navigate) - Must be before early returns
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowLeft' && gallery.length > 1) {
        handlePrevImage();
      }
      if (e.key === 'ArrowRight' && gallery.length > 1) {
        handleNextImage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, gallery.length, activeGalleryIndex]);

  // Dynamic Hybrid Stock & Fulfillment SLA (Studio Buffer vs Vendor JIT)
  const garmentIdentifier = isBlank ? (product?.name || '') : (selectedGarment?.name || selectedGarmentKey);
  const fulfillmentSLA = useMemo(() => {
    return getFulfillmentSLA(garmentIdentifier, selectedColor, selectedSize, isBlank);
  }, [garmentIdentifier, selectedColor, selectedSize, isBlank]);

  // Safe early return if product not found (placed AFTER all hooks)
  if (!product) {
    if (loadingCatalog) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-ts-terracotta"></div>
          <p className="text-sm text-ts-kremMuted">Memuat data produk...</p>
        </div>
      );
    }
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

  const is7200 = isBlank && (product.sku === 'TS-BLK-7200' || product.name?.includes('7200'));
  const blankPricing = is7200
    ? getBlankPricing(product, selectedColor, role, selectedSize)
    : null;

  const activeGalleryItem = gallery[activeGalleryIndex];
  const isSwatch = activeGalleryItem?.type === 'swatch' || String(previewImg).includes('swatch');
  const isGhostOrFolded = activeGalleryItem?.type === 'front' || 
    activeGalleryItem?.type === 'back' || 
    activeGalleryItem?.type === 'left' || 
    activeGalleryItem?.type === 'right' || 
    activeGalleryItem?.type === 'folded' || 
    String(previewImg).includes('ghost-') || 
    String(previewImg).includes('folded');
  const isModel = activeGalleryItem?.type === 'model' || String(previewImg).includes('model-');

  const baseRetailPrice = is7200 
    ? (blankPricing.isWhite ? 49000 : 52000)
    : (product.priceRetail || product.price_retail || 99000);
  
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
  } else if (isPartner && is7200) {
    const resellerBase = blankPricing.isWhite ? 41000 : 44000;
    effectiveBasePrice = resellerBase;
    partnerSavings = baseRetailPrice - resellerBase;
    isPartnerDiscountApplied = true;
  }

  let priceDelta = 0;
  if (!isBlank) {
    if (selectedGarmentKey === 'nsa_heavyweight_24s') priceDelta = 10000;
    else if (selectedGarmentKey === 'nsa_longsleeve') priceDelta = 12000;
    else if (selectedGarmentKey === 'nsa_hoodie') priceDelta = 85000;
    else if (selectedGarmentKey === 'nsa_polo') priceDelta = 30000;
  }

  // Size surcharge for oversized garments (2XL +Rp 5k, 3XL +Rp 10k, 4XL +Rp 15k, 5XL +Rp 20k)
  const sizeSurcharge = getSizeSurcharge(selectedSize);
  const currentPrice = is7200
    ? (effectiveBasePrice + sizeSurcharge)
    : (isBlank 
      ? (baseRetailPrice + sizeSurcharge) 
      : (effectiveBasePrice + priceDelta + sizeSurcharge));

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
      "url": `https://teestockapparel.vercel.app/produk/${product.sku}`,
      "priceCurrency": "IDR",
      "price": currentPrice,
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock"
    }
  };

  const handleColorChange = (colName) => {
    setSelectedColor(colName);
    setActiveGalleryIndex(0);
    if (isBlank && product.cititexCatId) {
      const blankGarmentUrl = `https://cititex.com/api/uploads/category/album/front_side/${product.cititexCatId}-${encodeURIComponent(colName)}.jpg`;
      setPreviewImg(blankGarmentUrl);
    } else if (product.variantImages && product.variantImages[colName]?.[0]) {
      const vImg = product.variantImages[colName][0];
      setPreviewImg(typeof vImg === 'string' ? vImg : vImg.url);
    } else {
      setPreviewImg(defaultImage);
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
        <Link to={isBlank ? "/polos" : "/katalog"} className="hover:text-ts-terracotta flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> {isBlank ? "Kaos Polos NSA" : "Katalog Grafis"}
        </Link>
        <span>/</span>
        <span className="text-ts-kremMuted">{product.seriesName || product.series}</span>
        <span>/</span>
        <span className="text-white font-bold truncate max-w-xs">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Product Showcase & Image (5 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div 
            className="w-full aspect-[3/4] bg-gradient-to-b from-[#1c1b1a] via-[#141312] to-[#0c0b0a] border border-white/[0.09] rounded-3xl overflow-hidden shadow-2xl relative group cursor-zoom-in flex items-center justify-center select-none"
            onClick={() => setIsLightboxOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsLightboxOpen(true); } }}
            aria-label="Perbesar foto produk untuk melihat detail sablon dan serat kain"
          >
            {/* Subtle Studio Spotlight Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(255,255,255,0.04)_0%,transparent_75%)] pointer-events-none" />

            {/* Main Product Image / Swatch Inspector */}
            {isSwatch ? (
              <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 z-10 animate-fadeIn">
                <div className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl ring-4 ring-ts-terracotta/20 bg-ts-hitam">
                  <img
                    src={previewImg}
                    alt={`${product.name} - Tekstur Serat Kain ${selectedColor}`}
                    className="w-full h-full object-cover scale-105 transition-transform duration-500 group-hover:scale-125"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-3xl pointer-events-none" />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-ts-hitam/80 backdrop-blur-md text-[9px] font-mono font-bold text-white border border-white/10">
                    Macro 1:1
                  </div>
                </div>
                <div className="space-y-1 max-w-xs">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ts-terracotta/20 border border-ts-terracotta/40 text-ts-terracotta text-xs font-mono font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Macro Texture View</span>
                  </div>
                  <p className="text-xs sm:text-sm text-ts-krem font-bold">Serat 100% Combed Cotton 24s</p>
                  <p className="text-[11px] text-ts-muted leading-relaxed">
                    Gramasi 180 g/m² • Rajutan Tubular Halus • Penyerapan Keringat Maksimal
                  </p>
                </div>
              </div>
            ) : (
              <img
                src={previewImg}
                alt={`${product.name} - ${selectedColor}`}
                onError={() => setPreviewImg(defaultImage)}
                className={`transition-all duration-500 group-hover:scale-105 select-none ${
                  isGhostOrFolded
                    ? 'w-full h-full object-contain p-4 sm:p-6 drop-shadow-[0_16px_32px_rgba(0,0,0,0.75)]'
                    : isModel
                    ? 'w-full h-full object-contain p-2 sm:p-4 rounded-2xl drop-shadow-md'
                    : isBlank
                    ? 'w-full h-full object-contain p-4 sm:p-6 drop-shadow-[0_16px_32px_rgba(0,0,0,0.75)]'
                    : 'w-full h-full object-cover'
                }`}
              />
            )}
            
            {/* Top SKU Chip */}
            <div className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-ts-hitam/85 backdrop-blur-md border border-white/10 font-mono text-xs font-bold text-ts-terracotta shadow-md pointer-events-none">
              {product.sku}
            </div>

            {/* Top Right Original NSA Seal */}
            {isBlank ? (
              <div className="absolute top-4 right-4 px-3 py-1 rounded-xl bg-ts-surface/90 backdrop-blur-md border border-white/10 text-xs font-bold text-white flex items-center gap-1.5 shadow-md pointer-events-none">
                <ShieldCheck className="w-3.5 h-3.5 text-ts-green" />
                <span>100% Original NSA</span>
              </div>
            ) : (
              <div className="absolute top-4 right-4 px-3 py-1 rounded-xl bg-ts-surface/90 backdrop-blur-md border border-white/10 text-xs font-bold text-white flex items-center gap-1.5 shadow-md pointer-events-none">
                <Sparkles className="w-3.5 h-3.5 text-ts-mustard" />
                <span>DTF HD Raster</span>
              </div>
            )}

            {/* Prev / Next Chevrons on Main Photo (if multi-photo) */}
            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  aria-label="Foto produk sebelumnya"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-10 sm:h-10 min-w-[44px] min-h-[44px] rounded-full bg-ts-hitam/75 hover:bg-ts-hitam text-white flex items-center justify-center border border-white/15 opacity-80 hover:opacity-100 transition-all shadow-lg cursor-pointer z-10"
                  title="Foto sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  aria-label="Foto produk selanjutnya"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-10 sm:h-10 min-w-[44px] min-h-[44px] rounded-full bg-ts-hitam/75 hover:bg-ts-hitam text-white flex items-center justify-center border border-white/15 opacity-80 hover:opacity-100 transition-all shadow-lg cursor-pointer z-10"
                  title="Foto selanjutnya"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Bottom Bar: Active Color Pill, Photo Label & Zoom Button */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none gap-2 z-10">
              <div className="px-3 py-1.5 rounded-xl bg-ts-hitam/85 backdrop-blur-md border border-white/15 text-xs font-semibold text-white flex items-center gap-2 shadow-lg">
                <span
                  className="w-3 h-3 rounded-full border border-white/40 shrink-0"
                  style={{ backgroundColor: getColorHex(selectedColor) }}
                />
                <span className="truncate max-w-[120px]">Warna: <strong className="text-white">{selectedColor}</strong></span>
              </div>

              <div className="flex items-center gap-1.5 pointer-events-auto">
                {gallery[activeGalleryIndex]?.label && (
                  <div className="px-2.5 py-1 rounded-lg bg-ts-hitam/85 backdrop-blur-md border border-white/15 text-[10px] font-mono text-ts-krem font-medium shadow-md truncate max-w-[130px] hidden xs:block">
                    {gallery[activeGalleryIndex].label}
                  </div>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsLightboxOpen(true);
                  }}
                  aria-label="Perbesar foto produk"
                  className="p-2 min-w-[36px] min-h-[36px] rounded-xl bg-ts-hitam/85 hover:bg-ts-hitam text-ts-krem hover:text-white backdrop-blur-md border border-white/15 transition shadow-md flex items-center justify-center cursor-pointer"
                  title="Perbesar foto (DTF Raster & Serat Kain)"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Multi-Photo Thumbnail Strip */}
          {gallery.length > 1 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-ts-kremMuted px-1">
                <span>Galeri Foto Produk ({gallery.length} Sudut / Detail)</span>
                <span className="font-mono text-[10px] text-ts-terracotta font-semibold">
                  {activeGalleryIndex + 1} dari {gallery.length}
                </span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-thin">
                {gallery.map((item, idx) => {
                  const isActive = activeGalleryIndex === idx;
                  const typeLabel = 
                    item.type === 'front' ? 'Depan' :
                    item.type === 'back' ? 'Belakang' :
                    item.type === 'left' ? 'Kiri' :
                    item.type === 'right' ? 'Kanan' :
                    item.type === 'folded' ? 'Lipat' :
                    item.type === 'model' ? 'Model' :
                    item.type === 'swatch' ? 'Kain' :
                    item.type === 'guide' ? 'Spek' : 'Detail';

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectThumbnail(idx)}
                      className={`group relative w-14 h-18 sm:w-16 sm:h-22 aspect-[3/4] rounded-xl overflow-hidden border transition-all duration-200 shrink-0 cursor-pointer bg-[#141312] p-1 flex items-center justify-center ${
                        isActive
                          ? 'ring-2 ring-ts-terracotta border-transparent scale-105 shadow-glow-terracotta z-10'
                          : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                      }`}
                      title={item.label}
                    >
                      <img
                        src={item.url}
                        alt={item.label}
                        className={`w-full h-full ${item.type === 'swatch' ? 'object-cover rounded-md' : 'object-contain'}`}
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-ts-hitam/90 backdrop-blur-sm text-[8px] sm:text-[9px] font-mono text-center text-white py-0.5 px-0.5 truncate block">
                        {typeLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

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
              : "Kaos print-on-demand premium dengan sablon DTF resolusi tinggi pada kaos katun New States Apparel original.")}
          </p>

          {/* Dynamic Hybrid Fulfillment SLA Badge */}
          <div className={`flex items-start gap-3 p-3.5 rounded-2xl border text-xs transition-all ${
            fulfillmentSLA.isStudioStock 
              ? 'bg-emerald-500/10 border-emerald-500/30' 
              : 'bg-sky-500/10 border-sky-500/30'
          }`}>
            <div className={`p-2 rounded-xl shrink-0 ${
              fulfillmentSLA.isStudioStock ? 'bg-emerald-500/20 text-emerald-400' : 'bg-sky-500/20 text-sky-400'
            }`}>
              {fulfillmentSLA.isStudioStock ? (
                <Zap className="w-4 h-4 animate-pulse" />
              ) : (
                <Building2 className="w-4 h-4" />
              )}
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <strong className="font-bold text-white text-xs">
                  {fulfillmentSLA.heading}
                </strong>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${fulfillmentSLA.badgeClass}`}>
                  {fulfillmentSLA.tagText}
                </span>
              </div>
              <p className="text-[11px] text-ts-kremMuted leading-relaxed">
                {fulfillmentSLA.subtext}
              </p>
            </div>
          </div>

          {/* Blank Apparel: Interactive Upsell to Custom DTF Printing */}
          {isBlank && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-ts-terracotta/20 via-ts-mustard/15 to-ts-surface border border-ts-terracotta/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-ts-mustard animate-pulse" />
                  <span className="text-xs font-black text-white uppercase tracking-wider font-mono">
                    Mau Kaos Ini Disablon Desain Sendiri?
                  </span>
                </div>
                <p className="text-xs text-ts-kremMuted">
                  Tambah sablon DTF HD di bahan <strong className="text-white">{product.name}</strong> ini mulai <strong className="text-ts-mustard font-mono">+Rp 25.000</strong>. Tanpa minimum order!
                </p>
              </div>
              <Link
                to={`/custom-order?blank=${encodeURIComponent(product.sku)}&name=${encodeURIComponent(product.name)}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-ts-terracotta hover:bg-ts-terracotta/90 text-white transition shadow-sm shrink-0"
              >
                <span>Custom Sablon</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="group" aria-label="Pilihan model garmen kaos NSA">
                {Object.entries(GARMENT_TYPES).filter(([k]) => k !== 'supplies').slice(0, 5).map(([k, g]) => (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={selectedGarmentKey === k}
                    aria-label={`Model garmen ${g.name}`}
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
              <div className="flex flex-wrap items-center gap-2.5">
                {filteredColors.map(colName => {
                  const hex = COLOR_HEX_MAP[colName] || '#333333';
                  const isSelected = selectedColor === colName;
                  const fabricSwatch = getFabricSwatchUrl(product, colName);
                  const swatchUrl = fabricSwatch || (product.cititexCatId 
                    ? `https://cititex.com/api/uploads/category/album/color/${product.cititexCatId}-${encodeURIComponent(colName)}.jpg`
                    : null);

                  return (
                    <button
                      key={colName}
                      type="button"
                      onClick={() => handleColorChange(colName)}
                      title={colName}
                      aria-label={`Pilih warna ${colName}`}
                      aria-pressed={isSelected}
                      className="group relative min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0 cursor-pointer p-0.5"
                    >
                      <span
                        className={`block w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden transition-all duration-200 ${
                          isSelected
                            ? 'ring-2 ring-ts-terracotta ring-offset-2 ring-offset-ts-hitam scale-110 shadow-glow-terracotta z-10'
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
                      </span>
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
                className="text-xs text-ts-mustard hover:text-white font-bold flex items-center gap-1.5 bg-ts-mustard/10 hover:bg-ts-mustard/20 px-3 py-1 rounded-lg border border-ts-mustard/30 transition-all cursor-pointer shadow-sm"
              >
                <Ruler className="w-3.5 h-3.5 text-ts-mustard" />
                <span>Hitung Ukuran (TB/BB)</span>
                <span className="text-[10px] bg-ts-mustard/25 text-ts-mustard px-1.5 py-0.5 rounded font-mono font-black">⭐ Akurat</span>
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Pilihan ukuran kaos">
              {sizeList.map(sz => {
                const surcharge = getSizeSurcharge(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    aria-label={`Pilih ukuran ${sz}${surcharge > 0 ? `, tambahan biaya ${formatRupiah(surcharge)}` : ''}`}
                    aria-pressed={selectedSize === sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`min-w-[50px] px-2.5 h-12 rounded-xl border font-mono text-xs font-bold transition-all duration-150 cursor-pointer flex flex-col items-center justify-center ${
                      selectedSize === sz
                        ? 'bg-ts-terracotta text-white border-ts-terracotta'
                        : 'bg-white/[0.03] border-white/[0.08] text-ts-kremMuted hover:bg-white/[0.08] hover:text-white'
                    }`}
                  >
                    <span>{sz}</span>
                    {surcharge > 0 && (
                      <span className={`text-[8px] font-mono leading-none mt-0.5 ${
                        selectedSize === sz ? 'text-white/80' : 'text-ts-mustard'
                      }`}>
                        +{formatRupiah(surcharge).replace(',00', '')}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-ts-kremMuted flex items-center gap-1.5 pt-0.5">
              <span className="text-ts-mustard">🧍‍♂️</span>
              <span>Model di foto: <strong className="text-white">TB 175 cm · BB 68 kg</strong> memakai <strong>Size L</strong> (Fitting Boxy Pas).</span>
            </p>
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
                        ? 'bg-ts-terracotta text-white border-ts-terracotta'
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
              <div aria-live="polite" className="flex-1">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full text-sm sm:text-base py-3 font-bold"
                  icon={isAdded ? Check : ShoppingBag}
                  onClick={handleAddToCart}
                >
                  {isAdded ? "Berhasil Masuk Troli!" : "Tambah ke Troli"}
                </Button>
              </div>
            </div>

            {/* Action CTAs: Direct Web Checkout & WhatsApp Support */}
            <div className="space-y-2 pt-1">
              <Button
                variant="cream"
                size="lg"
                className="w-full text-xs sm:text-sm py-3 font-extrabold shadow-md"
                onClick={handleBuyNow}
              >
                Checkout Langsung Web &rarr;
              </Button>
              <div className="text-center pt-0.5">
                <button
                  type="button"
                  onClick={handleBuyWhatsapp}
                  className="inline-flex items-center gap-1.5 text-xs text-ts-kremMuted hover:text-emerald-400 transition-colors py-1 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ragu soal ukuran atau butuh pesanan khusus? <strong className="text-white underline decoration-emerald-500/50">Chat WhatsApp Admin</strong></span>
                </button>
              </div>
            </div>

            {/* Collapsible Product Information & Guarantee Accordion */}
            <div className="pt-4 border-t border-white/[0.08] space-y-2">
              <ProductAccordionItem title="Spesifikasi Garmen NSA & Sablon DTF 155°C" icon={ShieldCheck} defaultOpen={true}>
                {isBlank ? (
                  <span>100% Katun New States Apparel (NSA) Original Cititex. Pola rajutan tubular knit tanpa sambungan samping, kerah rib 2.2 cm kokoh anti-melar, siap pakai langsung atau disablon custom.</span>
                ) : (
                  <span>100% Katun New States Apparel (NSA) Heavyweight 24s gramasi 180 g/m² (atau Softstyle 30s). Pola tubular knit tanpa sambungan samping. Dicetak dengan sablon DTF High-Density curing suhu 155°C dengan tinta elastis tahan cuci berkali-kali.</span>
                )}
              </ProductAccordionItem>

              <ProductAccordionItem title="Jadwal Produksi & SLA Pengiriman" icon={Truck}>
                Warna studio reguler (Hitam, Putih): Dipress in-house &amp; dikirim H+0 / H+1.<br />
                Warna non-reguler / size jumbo: Ditarik dari gudang pusat H+1, pengiriman H+2 via J&amp;T, SiCepat, atau JNE dengan nomor resi otomatis.
              </ProductAccordionItem>

              <ProductAccordionItem title="Garansi Kepuasan 100% & Bebas Tukar Ukuran" icon={RotateCcw}>
                Garansi 100% ganti baru jika sablon cacat/pecah, bahan berlubang, atau salah kirim ukuran dalam 30 hari sejak barang diterima. Hubungi kami via WhatsApp untuk klaim instan.
              </ProductAccordionItem>

              <div className="flex justify-end pt-1">
                <Link
                  to="/care"
                  className="text-[11px] text-ts-mustard hover:text-white font-bold transition-colors flex items-center gap-1"
                >
                  <span>Panduan Perawatan &amp; Garansi Lengkap</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
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

      {/* Product Image Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Tampilan penuh foto produk"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Lightbox Header */}
          <div className="flex items-center justify-between z-10 w-full max-w-6xl mx-auto" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-ts-terracotta font-bold">{product.sku}</span>
                <span className="text-white/30">•</span>
                <span className="text-xs text-ts-kremMuted">Warna: <strong className="text-white">{selectedColor}</strong></span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-xs sm:max-w-md">
                {product.name}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              {gallery.length > 1 && (
                <span className="text-xs font-mono text-ts-kremMuted hidden sm:inline">
                  {activeGalleryIndex + 1} / {gallery.length}
                </span>
              )}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                aria-label="Tutup tampilan penuh"
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Center Image with Nav Buttons */}
          <div 
            className="relative flex-1 flex items-center justify-center w-full max-w-6xl mx-auto my-2 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {gallery.length > 1 && (
              <button
                type="button"
                onClick={handlePrevImage}
                aria-label="Foto sebelumnya"
                className="absolute left-2 sm:left-4 z-10 w-12 h-12 min-w-[44px] min-h-[44px] rounded-full bg-ts-hitam/80 hover:bg-ts-hitam text-white flex items-center justify-center border border-white/20 transition cursor-pointer shadow-lg"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <div className="relative flex items-center justify-center max-h-[74vh] sm:max-h-[80vh] p-4 sm:p-8 rounded-3xl bg-gradient-to-b from-white/[0.04] via-white/[0.02] to-transparent border border-white/10 shadow-2xl backdrop-blur-sm">
              <img
                src={previewImg}
                alt={`${product.name} - ${selectedColor}`}
                className={`max-h-[66vh] sm:max-h-[72vh] max-w-full object-contain select-none transition-transform duration-300 ${
                  isSwatch
                    ? 'rounded-2xl ring-2 ring-white/20'
                    : isGhostOrFolded
                    ? 'drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)]'
                    : 'rounded-2xl drop-shadow-xl'
                }`}
              />
            </div>

            {gallery.length > 1 && (
              <button
                type="button"
                onClick={handleNextImage}
                aria-label="Foto selanjutnya"
                className="absolute right-2 sm:right-4 z-10 w-12 h-12 min-w-[44px] min-h-[44px] rounded-full bg-ts-hitam/80 hover:bg-ts-hitam text-white flex items-center justify-center border border-white/20 transition cursor-pointer shadow-lg"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Lightbox Footer: Thumbnails Strip */}
          {gallery.length > 1 && (
            <div 
              className="flex items-center justify-center gap-2 overflow-x-auto py-2 z-10 w-full max-w-xl mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {gallery.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectThumbnail(idx)}
                  className={`relative w-12 h-16 sm:w-14 sm:h-18 aspect-[3/4] rounded-xl overflow-hidden border transition shrink-0 cursor-pointer bg-[#141312] p-1 flex items-center justify-center ${
                    activeGalleryIndex === idx
                      ? 'ring-2 ring-ts-terracotta border-transparent scale-105'
                      : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                  title={item.label}
                >
                  <img
                    src={item.url}
                    alt={item.label}
                    className={`w-full h-full ${item.type === 'swatch' ? 'object-cover rounded-md' : 'object-contain'}`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
