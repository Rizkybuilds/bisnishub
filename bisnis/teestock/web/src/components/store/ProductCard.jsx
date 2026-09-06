import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatRupiah } from '../../utils/formatters';
import { getColorHex } from '../../constants/colors';
import { getAvailableColors, getCardPreviewImage } from '../../utils/productImages';

export function ProductCard({ product, isBlank: isBlankProp, className = '' }) {
  const { isPartner, role, profile } = useAuth();
  const isBlank = isBlankProp !== undefined ? isBlankProp : product.series === 'blank';

  const availableColors = getAvailableColors(product);
  const initialColor = availableColors.length > 0 ? availableColors[0] : (isBlank ? 'White' : 'Hitam');

  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [activeImage, setActiveImage] = useState(() => getCardPreviewImage(product, initialColor));
  const [imgError, setImgError] = useState(false);

  const handleColorSelect = (e, colorName) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedColor(colorName);
    setImgError(false);
    setActiveImage(getCardPreviewImage(product, colorName));
  };

  // Price calculations
  const baseRetailPrice = product.priceRetail || product.price_retail || (isBlank ? 49000 : 99000);
  const isReseller = profile?.partner_tier === 'reseller';
  const partnerPrice = isReseller
    ? (product.priceReseller || product.price_reseller || (isBlank ? 42000 : 65000))
    : (product.priceDropship || product.price_dropship || (isBlank ? 45000 : 75000));

  const effectivePrice = isPartner && !isBlank ? partnerPrice : baseRetailPrice;
  const colorCount = availableColors.length;

  const maxVisibleSwatches = 5;
  const visibleSwatches = availableColors.slice(0, maxVisibleSwatches);
  const extraColorCount = colorCount > maxVisibleSwatches ? colorCount - maxVisibleSwatches : 0;

  const fallbackUrl = product.filePath || product.file_path || '';

  return (
    <Link
      to={`/produk/${product.sku}?color=${encodeURIComponent(selectedColor)}`}
      className={`group bg-ts-surface/75 backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden transition-all duration-200 flex flex-col hover:-translate-y-1 shadow-glass-card shadow-glass-inset ${
        isBlank ? 'hover:border-ts-teal/60' : 'hover:border-ts-terracotta/60'
      } ${className}`}
    >
      {/* Product Image Frame */}
      <div className="aspect-square bg-ts-hitam/70 overflow-hidden relative">
        <img
          src={imgError ? fallbackUrl : activeImage}
          alt={`${product.name} - ${selectedColor}`}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top-Left SKU Chip */}
        <span className="absolute top-2 left-2 sm:top-3 sm:left-3 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-bold bg-ts-hitam/90 text-white border border-white/10 shadow-sm">
          {product.sku}
        </span>

        {/* Top-Right Badge */}
        {isBlank ? (
          <span className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-ts-teal/25 text-teal-200 border border-ts-teal/40 flex items-center gap-1 shadow-sm">
            <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span>100% NSA</span>
          </span>
        ) : (
          <span className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-ts-terracotta/25 text-[#E2885E] border border-ts-terracotta/40 flex items-center gap-1 shadow-sm">
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-ts-mustard" />
            <span>DTF HD</span>
          </span>
        )}

        {/* Active Color Name Overlay on Image Bottom */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <span className="px-2 py-0.5 rounded-md bg-ts-hitam/80 backdrop-blur-md border border-white/15 text-[10px] font-medium text-white shadow-md flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full border border-white/30"
              style={{ backgroundColor: getColorHex(selectedColor) }}
            />
            <span className="truncate max-w-[90px] sm:max-w-[120px]">{selectedColor}</span>
          </span>
        </div>
      </div>

      {/* Card Content & Interactive Color Swatches */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
        <div className="space-y-1.5">
          <div className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider font-mono ${
            isBlank ? 'text-ts-teal' : 'text-ts-terracotta'
          }`}>
            {isBlank ? 'Kaos Polos NSA' : (product.seriesName || product.series)}
          </div>
          <h3 className={`text-xs sm:text-sm font-bold text-white transition-colors truncate ${
            isBlank ? 'group-hover:text-ts-teal' : 'group-hover:text-ts-terracotta'
          }`}>
            {product.name}
          </h3>
          {product.niche && (
            <div className="text-[10px] sm:text-[11px] text-ts-kremMuted truncate">{product.niche}</div>
          )}

          {/* Color Swatch Dots */}
          {visibleSwatches.length > 1 && (
            <div className="pt-1 flex items-center gap-1.5 flex-wrap">
              {visibleSwatches.map((colorName) => {
                const hex = getColorHex(colorName);
                const isSelected = selectedColor === colorName;
                return (
                  <button
                    key={colorName}
                    type="button"
                    title={`Pilih warna ${colorName}`}
                    onClick={(e) => handleColorSelect(e, colorName)}
                    className={`w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-ts-terracotta ring-offset-1 ring-offset-ts-hitam scale-110 shadow-sm z-10'
                        : 'ring-1 ring-white/20 hover:ring-white/60 hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: hex }}
                  />
                );
              })}
              {extraColorCount > 0 && (
                <span className="text-[9px] sm:text-[10px] font-mono text-ts-kremMuted hover:text-white pl-0.5">
                  +{extraColorCount}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Pricing Footer */}
        <div className="flex items-center justify-between pt-2 sm:pt-2.5 border-t border-white/[0.06]">
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
                  {isBlank ? 'Harga Satuan' : 'Harga Launching'}
                </span>
                <span className="font-mono text-xs sm:text-sm font-black text-ts-green">
                  {formatRupiah(effectivePrice)}
                </span>
              </div>
            )}
          </div>

          <span className={`text-[10px] font-bold px-2 sm:px-2.5 py-1 rounded-lg transition-colors ${
            isBlank
              ? 'bg-ts-teal/10 border border-ts-teal/30 text-teal-300 group-hover:bg-ts-teal group-hover:text-zinc-950'
              : 'bg-white/[0.05] border border-white/10 text-white group-hover:bg-ts-terracotta group-hover:text-white'
          }`}>
            Detail &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
