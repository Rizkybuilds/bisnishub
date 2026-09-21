import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate, useSearchParams, useNavigationType } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '@bisnishub/shared/context/StoreContext';
import { useAuth } from '@bisnishub/shared/context/AuthContext';
import { GARMENT_TYPES, SIZES } from '@bisnishub/shared/constants/garments';
import { Button } from '@bisnishub/shared/components/ui/Button';
import { SizeCalculatorModal } from '../../components/store/SizeCalculatorModal';
import { formatRupiah } from '@bisnishub/shared/utils/formatters';
import { sanitizePhoneNumber } from '@bisnishub/shared/utils/whatsappTemplates';
import { SEOHead } from '@bisnishub/shared/components/common/SEOHead';
import { getSizeSurcharge, getBlankPricing, isProductBlank } from '@bisnishub/shared/constants/pricing';
import { ProductReviews } from '../../components/store/ProductReviews';
import { getFulfillmentSLA } from '@bisnishub/shared/utils/garmentStockRouting';
import { getProductGallery } from '@bisnishub/shared/utils/productImages';
import { ProductImageGallery } from '../../components/store/product/ProductImageGallery';
import { ProductPurchasePanel } from '../../components/store/product/ProductPurchasePanel';
import { ProductSpecsAccordion } from '../../components/store/product/ProductSpecsAccordion';
import { StickyMobileBuyBar } from '../../components/store/StickyMobileBuyBar';

export const SIZES_5XL_COLORS = ['black', 'white', 'navy', 'maroon', 'red', 'royal blue', 'forest green', 'carolina blue', 'caroline blue'];

export const COLOR_CATEGORIES = {
  basic: ["Hitam", "Black", "Putih", "White", "Charcoal", "Sport Grey", "Sport Grey-Black", "White-Black"],
  earthy: ["Sand", "Army", "Military Green", "Forest Green", "Dark Green", "Navy", "Maroon", "Dark Chocolate", "Chestnut"],
  vibrant: ["Daisy", "Mustard", "Orange", "Gold", "Royal Blue", "Red", "Merah", "Heliconia", "Sapphire", "Purple", "Lime", "Lilac", "Aqua Sky"]
};

/**
 * Pure helper for calculating PDP prices, partner savings, and size surcharges
 */
export function calculatePDPPrice({
  product,
  isBlank = false,
  selectedGarmentKey = 'nsa_heavyweight_24s',
  selectedColor = 'Hitam',
  selectedSize = 'L',
  qty = 1,
  role = 'retail',
  profile = null,
  isPartner = false
}) {
  if (!product) {
    return {
      currentPrice: 99000,
      baseRetailPrice: 99000,
      effectiveBasePrice: 99000,
      priceDelta: 0,
      sizeSurcharge: 0,
      partnerSavings: 0,
      isPartnerDiscountApplied: false
    };
  }

  const blankPricing = isBlank
    ? getBlankPricing(product, selectedColor, role, selectedSize, qty)
    : null;

  const baseRetailPrice = isBlank
    ? (blankPricing?.unitPrice || 45000)
    : (product.pricePromo && product.pricePromo > 0 ? product.pricePromo : (product.priceRetail || product.price_retail || 99000));

  let effectiveBasePrice = baseRetailPrice;
  let partnerSavings = 0;
  let isPartnerDiscountApplied = false;

  if (isPartner && !isBlank) {
    const isReseller = profile?.partner_tier === 'reseller';
    const partnerBase = isReseller
      ? (product.priceReseller || product.price_reseller || 65000)
      : (product.priceDropship || product.price_dropship || 75000);

    effectiveBasePrice = partnerBase;
    partnerSavings = Math.max(0, baseRetailPrice - partnerBase);
    isPartnerDiscountApplied = true;
  } else if (isPartner && isBlank) {
    const resellerBase = blankPricing?.unitPrice || baseRetailPrice;
    effectiveBasePrice = resellerBase;
    partnerSavings = Math.max(0, baseRetailPrice - resellerBase);
    isPartnerDiscountApplied = partnerSavings > 0;
  } else if (isBlank && qty >= 12) {
    effectiveBasePrice = blankPricing?.unitPrice || baseRetailPrice;
    partnerSavings = Math.max(0, baseRetailPrice - (blankPricing?.unitPrice || baseRetailPrice));
    isPartnerDiscountApplied = partnerSavings > 0;
  }

  let priceDelta = 0;
  if (!isBlank) {
    if (selectedGarmentKey === 'nsa_heavyweight_24s') priceDelta = 0;
    else if (selectedGarmentKey === 'nsa_softstyle_30s') priceDelta = 0;
    else if (selectedGarmentKey === 'nsa_longsleeve') priceDelta = 12000;
    else if (selectedGarmentKey === 'nsa_hoodie') priceDelta = 85000;
    else if (selectedGarmentKey === 'nsa_polo') priceDelta = 30000;
  }

  const isLongSleeve = (isBlank && (product.sku === 'TS-BLK-7280' || product.name?.includes('7280') || product.name?.includes('Long Sleeve'))) ||
    (!isBlank && selectedGarmentKey === 'nsa_longsleeve');
  const sizeSurcharge = getSizeSurcharge(selectedSize, isLongSleeve);
  const currentPrice = effectiveBasePrice + (isBlank ? 0 : priceDelta) + sizeSurcharge;

  return {
    currentPrice,
    baseRetailPrice,
    effectiveBasePrice,
    priceDelta,
    sizeSurcharge,
    partnerSavings,
    isPartnerDiscountApplied
  };
}

/**
 * Pure helper to resolve valid size list
 */
export function resolveSizeList({ product, isBlank = false, selectedColor = 'Hitam' }) {
  if (!product) return SIZES;
  const is3600 = isBlank && (product?.sku === 'TS-BLK-3600' || product?.name?.includes('3600') || product?.template === 'softstyle_30s');
  if (is3600) {
    return ['S', 'M', 'L', 'XL', '2XL'];
  }
  const is7200 = isBlank && (product?.sku === 'TS-BLK-7200' || product?.name?.includes('7200'));
  if (is7200) {
    const is5XL = SIZES_5XL_COLORS.includes(String(selectedColor).trim().toLowerCase());
    return is5XL
      ? ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL']
      : ['S', 'M', 'L', 'XL', '2XL', '3XL'];
  }
  if (isBlank && product?.sizes) {
    return product.sizes.split(',').map(s => s.trim()).filter(Boolean);
  }
  return SIZES;
}

/**
 * Pure helper for color category filtering
 */
export function filterColorsByCategory({ colorList = [], activeColorTab = 'all' }) {
  if (activeColorTab === 'all') return colorList;
  const catList = COLOR_CATEGORIES[activeColorTab] || [];
  const matched = colorList.filter(c => catList.some(cat => c.toLowerCase().includes(cat.toLowerCase())));
  return matched.length > 0 ? matched : colorList;
}

export function ProductDetailPage() {
  const { sku } = useParams();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const [searchParams] = useSearchParams();
  const { catalog, loadingCatalog, addToCart, storeSettings } = useStore();
  const { role, profile, isPartner } = useAuth();

  const product = catalog.find(p => p.sku === sku);
  const isBlank = isProductBlank(product);
  const is3600 = Boolean(isBlank && (product?.sku === 'TS-BLK-3600' || product?.name?.includes('3600') || product?.template === 'softstyle_30s'));
  const is7200 = Boolean(isBlank && !is3600);

  const [selectedGarmentKey, setSelectedGarmentKey] = useState(
    product?.template === 'softstyle_30s' ? 'nsa_softstyle_30s' : 'nsa_heavyweight_24s'
  );
  const selectedGarment = GARMENT_TYPES[selectedGarmentKey] || GARMENT_TYPES.nsa_heavyweight_24s;
  
  // Available colors
  const colorList = useMemo(() => {
    if (!product) return selectedGarment.colors.map(c => c.name);
    if (product.colors) {
      return product.colors.split(',').map(c => c.trim()).filter(Boolean);
    }
    return selectedGarment.colors.map(c => c.name);
  }, [product, selectedGarment]);

  const queryColor = searchParams.get('color');

  const [selectedColor, setSelectedColor] = useState(() => {
    if (queryColor) {
      const match = colorList.find(c => c.toLowerCase() === queryColor.toLowerCase());
      if (match) return match;
    }
    return colorList[0] || (isBlank ? 'White' : 'Hitam');
  });

  const [activeColorTab, setActiveColorTab] = useState('all');

  // Dynamic multi-photo gallery
  const gallery = useMemo(() => {
    if (!product) return [];
    return getProductGallery(product, selectedColor);
  }, [product, selectedColor]);

  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  // Filtered color list based on category tab
  const filteredColors = useMemo(() => {
    return filterColorsByCategory({ colorList, activeColorTab });
  }, [colorList, activeColorTab]);

  // Size list with dynamic 5XL availability for NSA 7200
  const sizeList = useMemo(() => {
    return resolveSizeList({ product, isBlank, selectedColor });
  }, [isBlank, product, selectedColor]);

  const [selectedSize, setSelectedSize] = useState(sizeList[0] || 'L');

  // Auto-switch size if old size unavailable in newly selected color
  useEffect(() => {
    if (sizeList.length > 0 && !sizeList.includes(selectedSize)) {
      setSelectedSize(sizeList[sizeList.length - 1] || 'L');
    }
  }, [sizeList, selectedSize]);

  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const defaultImage = product ? (product.filePath || product.file_path) : '';
  const [previewImg, setPreviewImg] = useState(() => (gallery[0] ? gallery[0].url : defaultImage));

  // Sync state when SKU changes
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
    setSelectedGarmentKey(
      product?.template === 'softstyle_30s' ? 'nsa_softstyle_30s' : 'nsa_heavyweight_24s'
    );
  }, [product?.sku]);

  // Route Scroll Best-Practice:
  // When opening product detail (PUSH), immediately scroll to top photo gallery area.
  // If navigating back via history (POP), ScrollRestoration preserves the user's last position.
  useEffect(() => {
    if (navigationType !== 'POP') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [sku, navigationType]);

  // Sync preview image whenever color or gallery changes
  useEffect(() => {
    setActiveGalleryIndex(0);
    if (gallery.length > 0) {
      setPreviewImg(gallery[0].url);
    } else {
      setPreviewImg(defaultImage);
    }
  }, [selectedColor, gallery, defaultImage]);

  // Gallery navigation handlers
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

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowLeft' && gallery.length > 1) handlePrevImage();
      if (e.key === 'ArrowRight' && gallery.length > 1) handleNextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, gallery.length, activeGalleryIndex]);

  // Fulfillment SLA
  const garmentIdentifier = isBlank ? (product?.name || '') : (selectedGarment?.name || selectedGarmentKey);
  const fulfillmentSLA = useMemo(() => {
    return getFulfillmentSLA(garmentIdentifier, selectedColor, selectedSize, isBlank);
  }, [garmentIdentifier, selectedColor, selectedSize, isBlank]);

  // Early return if not found
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
        <h2 className="text-2xl font-bold text-ts-krem">Produk Tidak Ditemukan</h2>
        <p className="text-xs text-ts-muted">Desain atau produk polos dengan SKU {sku} tidak terdaftar di katalog kami.</p>
        <Link to="/katalog">
          <Button variant="primary">Kembali ke Katalog</Button>
        </Link>
      </div>
    );
  }

  const blankPricing = isBlank
    ? getBlankPricing(product, selectedColor, role, selectedSize, qty)
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

  const {
    currentPrice,
    baseRetailPrice,
    effectiveBasePrice,
    priceDelta,
    sizeSurcharge,
    partnerSavings,
    isPartnerDiscountApplied
  } = useMemo(() => {
    return calculatePDPPrice({
      product,
      isBlank,
      selectedGarmentKey,
      selectedColor,
      selectedSize,
      qty,
      role,
      profile,
      isPartner
    });
  }, [product, isBlank, selectedGarmentKey, selectedColor, selectedSize, qty, role, profile, isPartner]);

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
        keywords={[product.name, product.seriesName || 'teestock originals', 'kaos nsa 24s heavyweight', 'kaos nsa softstyle 30s', 'sablon dtf satuan']}
        image={previewImg}
        canonicalPath={`/produk/${product.sku}`}
        type="product"
        schema={productSchema}
      />

      {/* Breadcrumb Navigation & Back Route with Scroll Restoration */}
      <div className="flex items-center gap-2 text-xs text-ts-muted">
        <button
          type="button"
          onClick={() => {
            if (window.history.length > 2) {
              navigate(-1);
            } else {
              navigate(isBlank ? '/polos' : '/katalog');
            }
          }}
          className="hover:text-ts-terracotta flex items-center gap-1 transition-colors cursor-pointer"
          title="Kembali ke posisi terakhir di katalog"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> {isBlank ? "Kaos Polos NSA" : "Katalog Grafis"}
        </button>
        <span>/</span>
        <span className="text-ts-kremMuted">{product.seriesName || product.series}</span>
        <span>/</span>
        <span className="text-ts-krem font-bold truncate max-w-xs">{product.name}</span>
      </div>

      {/* 2-Column Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Gallery Showcase */}
        <div id="product-gallery-area" className="lg:col-span-6 space-y-4 scroll-mt-24">
          <ProductImageGallery
            product={product}
            gallery={gallery}
            activeGalleryIndex={activeGalleryIndex}
            previewImg={previewImg}
            selectedColor={selectedColor}
            isSwatch={isSwatch}
            isGhostOrFolded={isGhostOrFolded}
            isModel={isModel}
            isBlank={isBlank}
            is3600={is3600}
            currentPrice={currentPrice}
            onSelectThumbnail={handleSelectThumbnail}
            onPrevImage={handlePrevImage}
            onNextImage={handleNextImage}
            isLightboxOpen={isLightboxOpen}
            setIsLightboxOpen={setIsLightboxOpen}
          />
        </div>

        {/* Right Column: Purchasing Controls & Accordion */}
        <div className="lg:col-span-6 space-y-6">
          <ProductPurchasePanel
            product={product}
            isBlank={isBlank}
            is3600={is3600}
            is7200={is7200}
            currentPrice={currentPrice}
            baseRetailPrice={baseRetailPrice}
            priceDelta={priceDelta}
            isPartnerDiscountApplied={isPartnerDiscountApplied}
            partnerSavings={partnerSavings}
            profile={profile}
            selectedGarmentKey={selectedGarmentKey}
            setSelectedGarmentKey={setSelectedGarmentKey}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            colorList={colorList}
            activeColorTab={activeColorTab}
            setActiveColorTab={setActiveColorTab}
            filteredColors={filteredColors}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            sizeList={sizeList}
            qty={qty}
            setQty={setQty}
            isAdded={isAdded}
            handleAddToCart={handleAddToCart}
            handleBuyNow={handleBuyNow}
            handleBuyWhatsapp={handleBuyWhatsapp}
            onOpenSizeModal={() => setIsSizeModalOpen(true)}
            fulfillmentSLA={fulfillmentSLA}
          />

          <ProductSpecsAccordion
            is3600={is3600}
            isBlank={isBlank}
            selectedSize={selectedSize}
            sizeList={sizeList}
            onOpenSizeModal={() => setIsSizeModalOpen(true)}
          />
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="mt-12 sm:mt-16">
        <ProductReviews productName={product.name} sku={product.sku} />
      </div>

      {/* Size Calculator Modal */}
      <SizeCalculatorModal
        isOpen={isSizeModalOpen}
        onClose={() => setIsSizeModalOpen(false)}
        onSelectSize={(sz) => setSelectedSize(sz)}
        currentSize={selectedSize}
        availableSizes={sizeList}
      />

      {/* Sticky Mobile Conversion Buy Bar */}
      <StickyMobileBuyBar
        product={product}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        price={currentPrice}
        previewImg={previewImg}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onBuyWhatsapp={handleBuyWhatsapp}
        isAdded={isAdded}
        isVisible={true}
      />
    </div>
  );
}
