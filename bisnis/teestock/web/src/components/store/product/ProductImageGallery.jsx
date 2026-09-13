import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  X,
  Tag
} from 'lucide-react';
import { getColorHex } from '../../../constants/colors';
import { formatRupiah } from '../../../utils/formatters';

export function ProductImageGallery({
  product,
  gallery,
  activeGalleryIndex,
  previewImg,
  selectedColor,
  isSwatch,
  isGhostOrFolded,
  isModel,
  isBlank,
  is3600,
  currentPrice,
  onSelectThumbnail,
  onPrevImage,
  onNextImage,
  isLightboxOpen,
  setIsLightboxOpen
}) {
  const defaultImage = product ? (product.filePath || product.file_path) : '';

  return (
    <div className="space-y-4">
      {/* Main Image Showcase Container */}
      <div 
        className="w-full aspect-[3/4] bg-gradient-to-b from-ts-surface via-ts-surfaceHover/40 to-ts-surface border border-ts-border rounded-3xl overflow-hidden shadow-sm relative group cursor-zoom-in flex items-center justify-center select-none transition-colors duration-300"
        onClick={() => setIsLightboxOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsLightboxOpen(true); } }}
        aria-label="Perbesar foto produk untuk melihat detail sablon dan serat kain"
      >
        {/* Subtle Spotlight Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(255,255,255,0.04)_0%,transparent_75%)] pointer-events-none" />

        {/* Swatch Texture Macro or Product Photo */}
        {isSwatch ? (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 z-10 animate-fadeIn">
            <div className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-3xl overflow-hidden border-2 border-ts-border shadow-md ring-4 ring-ts-terracotta/20 bg-ts-surface">
              <img
                src={previewImg}
                alt={`${product.name} - Tekstur Serat Kain ${selectedColor}`}
                className="w-full h-full object-cover scale-105 transition-transform duration-500 group-hover:scale-125"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-3xl pointer-events-none" />
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-ts-surface/90 backdrop-blur-md text-[9px] font-mono font-bold text-ts-krem border border-ts-border">
                Macro 1:1
              </div>
            </div>
            <div className="space-y-1 max-w-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ts-terracotta/20 border border-ts-terracotta/40 text-ts-terracotta text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Macro Texture View</span>
              </div>
              <p className="text-xs sm:text-sm text-ts-krem font-bold">
                {is3600 ? 'Serat 100% Ring Spun Cotton 30s' : 'Serat 100% Combed Cotton 24s'}
              </p>
              <p className="text-[11px] text-ts-muted leading-relaxed">
                {is3600
                  ? 'Gramasi 150 g/m² • Rajutan Ring-Spun Halus & Lembut • Sangat Adem & Ringan'
                  : 'Gramasi 180 g/m² • Rajutan Tubular Halus • Penyerapan Keringat Maksimal'}
              </p>
            </div>
          </div>
        ) : (
          <img
            src={previewImg}
            alt={`${product.name} - ${selectedColor}`}
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

        {/* Top Right Badges */}
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

        {/* Prev & Next Chevrons */}
        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={onPrevImage}
              aria-label="Foto produk sebelumnya"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-10 sm:h-10 min-w-[44px] min-h-[44px] rounded-full bg-ts-hitam/75 hover:bg-ts-hitam text-white flex items-center justify-center border border-white/15 opacity-80 hover:opacity-100 transition-all shadow-lg cursor-pointer z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={onNextImage}
              aria-label="Foto produk selanjutnya"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-10 sm:h-10 min-w-[44px] min-h-[44px] rounded-full bg-ts-hitam/75 hover:bg-ts-hitam text-white flex items-center justify-center border border-white/15 opacity-80 hover:opacity-100 transition-all shadow-lg cursor-pointer z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Bottom Bar: Active Color Pill & Zoom Icon */}
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
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Thumbnails Carousel Strip */}
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
                  onClick={() => onSelectThumbnail(idx)}
                  className={`group relative w-14 h-18 sm:w-16 sm:h-22 aspect-[3/4] rounded-xl overflow-hidden border transition-all duration-200 shrink-0 cursor-pointer bg-ts-surface p-1 flex items-center justify-center ${
                    isActive
                      ? 'ring-2 ring-ts-terracotta border-transparent scale-105 shadow-sm z-10'
                      : 'border-ts-border hover:border-ts-terracotta/40 opacity-70 hover:opacity-100'
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

      {/* Wholesale Promo Card for Blanks */}
      {isBlank && (
        <div className="p-4 sm:p-5 bg-gradient-to-r from-ts-teal/15 via-ts-surface/90 to-ts-surface/90 border border-ts-teal/30 rounded-2xl flex items-center justify-between text-xs shadow-sm">
          <div className="space-y-1">
            <div className="font-extrabold text-ts-krem flex items-center gap-1.5 text-sm">
              <Tag className="w-4 h-4 text-ts-teal" />
              <span>{is3600 ? 'Harga Grosir & Partai (≥12 pcs)' : 'Harga Grosir Lusinan (≥12 pcs)'}</span>
            </div>
            <p className="text-[11px] text-ts-kremMuted">
              {is3600 
                ? 'Beli 12 pcs atau lebih dapat harga grosir, order ≥72 pcs otomatis harga partai.'
                : 'Beli 12 pcs atau lebih (bisa campur warna & size) otomatis dapat harga grosir reseller.'}
            </p>
          </div>
          <div className="text-right font-mono shrink-0 pl-3">
            <div className="text-[10px] text-ts-muted">Mulai</div>
            <div className="font-black text-base sm:text-lg text-ts-green">
              {formatRupiah(is3600 ? 29000 : (product.priceReseller || (currentPrice - 7000)))}
              <span className="text-[10px] font-normal text-ts-muted">/pcs</span>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
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
                onClick={onPrevImage}
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
                onClick={onNextImage}
                aria-label="Foto selanjutnya"
                className="absolute right-2 sm:right-4 z-10 w-12 h-12 min-w-[44px] min-h-[44px] rounded-full bg-ts-hitam/80 hover:bg-ts-hitam text-white flex items-center justify-center border border-white/20 transition cursor-pointer shadow-lg"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Lightbox Footer Thumbnails Strip */}
          {gallery.length > 1 && (
            <div 
              className="flex items-center justify-center gap-2 overflow-x-auto py-2 z-10 w-full max-w-xl mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {gallery.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectThumbnail(idx)}
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
