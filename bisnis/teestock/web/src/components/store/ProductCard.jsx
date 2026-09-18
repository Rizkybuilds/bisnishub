import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatRupiah } from '../../utils/formatters';
import { getColorHex } from '../../constants/colors';
import { getAvailableColors, getCardPreviewImage } from '../../utils/productImages';
import { TiltCard } from './interactive/TiltCard';

export function ProductCard({ product, isBlank: isBlankProp, className = '' }) {
  const { isPartner, role, profile } = useAuth();
  const isBlank = isBlankProp !== undefined ? isBlankProp : product.series === 'blank';

  const availableColors = getAvailableColors(product);
  const initialColor = availableColors.length > 0 ? availableColors[0] : (isBlank ? 'White' : 'Hitam');

  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [activeImage, setActiveImage] = useState(() => getCardPreviewImage(product, initialColor));
  const [imgError, setImgError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleColorSelect = (e, colorName) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedColor(colorName);
    setImgError(false);
    setImageLoaded(false);
    setActiveImage(getCardPreviewImage(product, colorName));
  };

  // Price calculations
  const is3600 = isBlank && (product.sku === 'TS-BLK-3600' || product.name?.includes('3600'));
  const is7200 = isBlank && (product.sku === 'TS-BLK-7200' || product.name?.includes('7200'));
  const isWhite = selectedColor?.toLowerCase() === 'white';

  let baseRetailPrice;
  if (is3600) {
    baseRetailPrice = isWhite ? 34000 : 37000;
  } else if (is7200) {
    baseRetailPrice = isWhite ? 49000 : 52000;
  } else {
    baseRetailPrice = product.priceRetail || product.price_retail || (isBlank ? 49000 : 99000);
  }

  const isReseller = profile?.partner_tier === 'reseller';
  let partnerPrice;
  if (isReseller) {
    if (is3600) partnerPrice = isWhite ? 32000 : 35000;
    else if (is7200) partnerPrice = isWhite ? 41000 : 44000;
    else partnerPrice = product.priceReseller || product.price_reseller || (isBlank ? 42000 : 65000);
  } else {
    if (is3600) partnerPrice = isWhite ? 32000 : 35000;
    else if (is7200) partnerPrice = isWhite ? 41000 : 44000;
    else partnerPrice = product.priceDropship || product.price_dropship || (isBlank ? 45000 : 75000);
  }

  const effectivePrice = isPartner && !isBlank ? partnerPrice : baseRetailPrice;
  const colorCount = availableColors.length;

  const maxVisibleSwatches = 5;
  const visibleSwatches = availableColors.slice(0, maxVisibleSwatches);
  const extraColorCount = colorCount > maxVisibleSwatches ? colorCount - maxVisibleSwatches : 0;

  const fallbackUrl = product.filePath || product.file_path || '';

  const productUrl = `/produk/${product.sku}?color=${encodeURIComponent(selectedColor)}`;

  return (
    <TiltCard maxTilt={5} scale={1.01} className={`h-full ${className}`}>
      <div
        className="group bg-ts-surface border border-ts-border rounded-2xl overflow-hidden transition-all duration-300 ease-out flex flex-col hover:scale-[1.02] hover:-translate-y-1 hover:border-ts-borderHover shadow-sm hover:shadow-glow-terracotta-sm relative h-full"
      >
      {/* Product Image Frame */}
      <Link
        to={productUrl}
        aria-label={`Lihat detail produk ${product.name} varian ${selectedColor}`}
        className={`aspect-[3/4] bg-ts-surfaceHover/40 overflow-hidden relative flex items-center justify-center ${
          isBlank ? 'p-3 sm:p-4' : ''
        }`}
      >
        {/* Skeleton saat gambar loading */}
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-ts-surface z-[1]" />
        )}
        <img
          src={imgError ? fallbackUrl : activeImage}
          alt={`${product.name} - ${selectedColor}`}
          onError={() => setImgError(true)}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full transition-all duration-300 group-hover:scale-105 ${
            !imageLoaded ? 'opacity-0' : 'opacity-100'
          } ${
            isBlank 
              ? 'object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)] dark:drop-shadow-[0_8px_16px_rgba(0,0,0,0.65)]' 
              : 'object-cover'
          }`}
          loading="lazy"
          decoding="async"
        />

        {/* Top-Left SKU Chip */}
        <span className="absolute top-2 left-2 sm:top-3 sm:left-3 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-bold bg-ts-surfaceCard/90 text-ts-krem border border-ts-border shadow-sm backdrop-blur-md">
          {product.sku}
        </span>

        {/* Top-Right Badge */}
        {isBlank ? (
          <span className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 sm:px-2.5 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-bold bg-ts-surfaceCard/90 backdrop-blur-md text-ts-teal border border-ts-teal/30 flex items-center gap-1 shadow-sm">
            <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-ts-teal" />
            <span className="tracking-wide">100% NSA</span>
          </span>
        ) : (
          <span className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 sm:px-2.5 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-bold bg-ts-surfaceCard/90 backdrop-blur-md text-ts-terracotta border border-ts-terracotta/30 flex items-center gap-1 shadow-sm">
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-ts-terracotta" />
            <span className="tracking-wide">STUDIO LAB</span>
          </span>
        )}

        {/* Active Color Name Overlay & SLA on Image Bottom */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none gap-1">
          <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-ts-surfaceCard/90 backdrop-blur-md border border-ts-border text-[9px] sm:text-[10px] font-medium text-ts-krem shadow-md flex items-center gap-1 sm:gap-1.5 shrink-0">
            <span
              className="w-2 h-2 rounded-full border border-ts-border shrink-0"
              style={{ backgroundColor: getColorHex(selectedColor) }}
            />
            <span className="truncate max-w-[65px] sm:max-w-[110px]">{selectedColor}</span>
          </span>

          {/* Dynamic SLA chip */}
          <span className={`px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-mono font-bold border backdrop-blur-md shadow-sm shrink-0 ${
            ['hitam', 'black', 'putih', 'white'].includes(selectedColor.toLowerCase())
              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
              : 'bg-sky-950/80 border-sky-500/40 text-sky-300'
          }`}>
            {['hitam', 'black', 'putih', 'white'].includes(selectedColor.toLowerCase()) ? (
              <>⚡ H+0<span className="hidden sm:inline"> Studio</span></>
            ) : (
              <>📦 H+1<span className="hidden sm:inline"> Gudang</span></>
            )}
          </span>
        </div>
      </Link>

      {/* Card Content & Interactive Color Swatches */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
        <div className="space-y-1 sm:space-y-1.5">
          <div className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider font-mono ${
            isBlank ? 'text-ts-teal' : 'text-ts-terracotta'
          }`}>
            {isBlank ? (is3600 ? 'Kaos Polos NSA 3600 (30s)' : is7200 ? 'Kaos Polos NSA 7200 (24s)' : 'Kaos Polos NSA') : (product.seriesName || product.series)}
          </div>
          <Link to={productUrl} className="block group/title">
            <h3 className={`text-xs sm:text-sm font-bold text-ts-krem transition-colors truncate ${
              isBlank ? 'group-hover/title:text-ts-teal' : 'group-hover/title:text-ts-terracotta'
            }`}>
              {product.name}
            </h3>
          </Link>
          {product.niche && (
            <div className="text-[10px] sm:text-[11px] text-ts-kremMuted truncate">{product.niche}</div>
          )}

          {/* Color Swatch Dots with Accessible Tap Area */}
          {visibleSwatches.length > 1 && (
            <div className="pt-1 flex items-center gap-1.5 flex-wrap" role="group" aria-label="Pilihan varian warna">
              {visibleSwatches.map((colorName) => {
                const hex = getColorHex(colorName);
                const isSelected = selectedColor === colorName;
                return (
                  <button
                    key={colorName}
                    type="button"
                    title={`Warna: ${colorName}`}
                    aria-label={`Pilih warna ${colorName}`}
                    aria-pressed={isSelected}
                    onClick={(e) => handleColorSelect(e, colorName)}
                    className="min-w-[36px] min-h-[36px] p-1.5 -m-1 rounded-full cursor-pointer flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ts-terracotta"
                  >
                    <span
                      className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-all duration-200 inline-block shadow-sm ${
                        isSelected
                          ? 'ring-2 ring-ts-terracotta ring-offset-2 ring-offset-ts-hitam scale-110 shadow-glow-terracotta-sm z-10'
                          : 'ring-1 ring-ts-border hover:ring-ts-borderHover hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  </button>
                );
              })}
              {extraColorCount > 0 && (
                <span className="text-[9px] sm:text-[10px] font-mono text-ts-kremMuted pl-0.5">
                  +{extraColorCount}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Pricing Footer */}
        <div className="flex items-center justify-between pt-2 sm:pt-2.5 border-t border-ts-border">
          <div>
            {isPartner && !isBlank ? (
              <div>
                <span className="text-[9px] text-ts-mustard font-bold uppercase tracking-wider block font-mono">
                  Harga Mitra ({role})
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono text-xs sm:text-sm font-black text-ts-mustard">
                    {formatRupiah(effectivePrice)}
                  </span>
                  <span className="text-[10px] line-through text-ts-muted font-mono hidden sm:inline">
                    {formatRupiah(baseRetailPrice)}
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <span className="text-[9px] text-ts-muted block font-mono">
                  {isBlank ? 'Harga Satuan' : 'Harga Resmi'}
                </span>
                <div className="flex items-baseline gap-1 sm:gap-1.5">
                  <span className="font-mono text-base sm:text-lg font-bold text-ts-krem">
                    {formatRupiah(product.pricePromo && product.pricePromo < effectivePrice ? product.pricePromo : effectivePrice)}
                  </span>
                  {product.pricePromo && product.pricePromo < effectivePrice && (
                    <span className="text-sm line-through text-ts-kremMuted font-mono hidden sm:inline">
                      {formatRupiah(effectivePrice)}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <Link
            to={productUrl}
            aria-label={`Pilih produk ${product.name}`}
            className="text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer bg-ts-surfaceHover border border-ts-border text-ts-krem hover:bg-zinc-950 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 dark:hover:border-white shadow-sm shrink-0 min-h-[36px] items-center justify-center"
          >
            <span>Pilih</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  </TiltCard>
);
}
