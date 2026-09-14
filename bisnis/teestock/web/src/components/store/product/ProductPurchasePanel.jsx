import React from 'react';
import { 
  Check, 
  ShoppingBag, 
  MessageSquare, 
  Sparkles, 
  Tag, 
  Layers, 
  Ruler, 
  Clock, 
  Building2, 
  ShieldCheck,
  Zap,
  Package,
  RotateCcw
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { GARMENT_TYPES } from '../../../constants/garments';
import { getColorHex } from '../../../constants/colors';
import { getSizeSurcharge, BUNDLE_DEALS } from '../../../constants/pricing';
import { formatRupiah } from '../../../utils/formatters';

const COLOR_CATEGORIES = {
  basic: ["Hitam", "Black", "Putih", "White", "Charcoal", "Sport Grey", "Sport Grey-Black", "White-Black"],
  earthy: ["Sand", "Army", "Military Green", "Forest Green", "Dark Green", "Navy", "Maroon", "Dark Chocolate", "Chestnut"],
  vibrant: ["Daisy", "Mustard", "Orange", "Gold", "Royal Blue", "Red", "Merah", "Heliconia", "Sapphire", "Purple", "Lime", "Lilac", "Aqua Sky"]
};

export function ProductPurchasePanel({
  product,
  isBlank,
  is3600,
  is7200,
  currentPrice,
  baseRetailPrice,
  priceDelta,
  isPartnerDiscountApplied,
  partnerSavings,
  profile,
  selectedGarmentKey,
  setSelectedGarmentKey,
  selectedColor,
  setSelectedColor,
  colorList,
  activeColorTab,
  setActiveColorTab,
  filteredColors,
  selectedSize,
  setSelectedSize,
  sizeList,
  qty,
  setQty,
  isAdded,
  handleAddToCart,
  handleBuyNow,
  handleBuyWhatsapp,
  onOpenSizeModal,
  fulfillmentSLA
}) {
  return (
    <div className="space-y-6">
      {/* Series & Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-ts-terracotta uppercase tracking-wider font-mono">
            {product.seriesName || product.series}
          </span>
          {product.niche && (
            <>
              <span className="text-ts-border font-bold">•</span>
              <span className="text-xs font-medium text-ts-kremMuted">{product.niche}</span>
            </>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-ts-krem tracking-tight leading-tight">
          {product.name}
        </h1>

        {/* Pricing Display */}
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
            </div>
          )}
        </div>
      </div>

      {/* Bundle Deals Banner (Graphic T-Shirts Only) */}
      {!isBlank && (
        <div className="p-3.5 rounded-2xl bg-ts-surface border border-ts-border space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-ts-krem flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-ts-mustard" />
              Promo Bundling Koleksi
            </span>
            <span className="text-[10px] font-mono text-ts-terracotta font-semibold">Otomatis di Keranjang</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {BUNDLE_DEALS.map((deal, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-ts-surfaceHover border border-ts-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ts-krem">{deal.title}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-ts-terracotta/20 text-ts-terracotta font-semibold">
                    {deal.badge}
                  </span>
                </div>
                <p className="text-[11px] text-ts-kremMuted">{deal.tagline}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Garment Switcher (Graphic Products Only) */}
      {!isBlank && (
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-ts-kremMuted flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-ts-muted" />
            Pilihan Garmen New States Apparel
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {Object.entries(GARMENT_TYPES)
              .filter(([k]) => ['nsa_softstyle_30s', 'nsa_heavyweight_24s', 'nsa_longsleeve'].includes(k))
              .map(([key, garment]) => {
                const isSelected = selectedGarmentKey === key;
                const gsmBadge = key === 'nsa_softstyle_30s' ? '150 GSM' : '180 GSM';
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedGarmentKey(key)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-ts-terracotta bg-ts-terracotta/10 text-ts-krem ring-1 ring-ts-terracotta/50 shadow-sm'
                        : 'border-ts-border bg-ts-surface text-ts-kremMuted hover:border-ts-borderHover'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-ts-krem">{garment.name}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-ts-surfaceHover text-ts-krem border border-ts-border font-bold">
                          {gsmBadge}
                        </span>
                        {key === 'nsa_heavyweight_24s' && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-ts-mustard/20 text-ts-mustard border border-ts-mustard/30 font-bold">
                            Favorite
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-[11px] text-ts-muted mt-1 leading-snug">{garment.tagline}</p>
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* Color Selection Palette */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <label className="font-bold uppercase tracking-wider text-ts-kremMuted">
            Pilihan Warna ({colorList.length} Pilihan)
          </label>
          <span className="font-semibold text-ts-krem">{selectedColor}</span>
        </div>

        {/* Category Tabs for blanks with many colors */}
        {colorList.length > 8 && (
          <div className="flex gap-1.5 border-b border-ts-border pb-2 text-[11px]">
            {['all', 'basic', 'earthy', 'vibrant'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveColorTab(tab)}
                className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-colors cursor-pointer ${
                  activeColorTab === tab
                    ? 'bg-ts-surfaceHover text-ts-krem font-bold'
                    : 'text-ts-muted hover:text-ts-krem'
                }`}
              >
                {tab === 'all' ? 'Semua' : tab}
              </button>
            ))}
          </div>
        )}

        {/* Color Swatches Grid */}
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
          {filteredColors.map((colorName) => {
            const isSelected = selectedColor === colorName;
            const hex = getColorHex(colorName);
            return (
              <button
                key={colorName}
                type="button"
                onClick={() => setSelectedColor(colorName)}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'border-ts-terracotta bg-ts-terracotta/15 text-ts-krem ring-1 ring-ts-terracotta/50'
                    : 'border-ts-border bg-ts-surface text-ts-kremMuted hover:border-ts-borderHover'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-ts-border shrink-0 shadow-sm"
                  style={{ backgroundColor: hex }}
                />
                <span className="truncate max-w-[100px]">{colorName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Selection Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <label className="font-bold uppercase tracking-wider text-ts-kremMuted">
            Pilihan Ukuran
          </label>
          <button
            type="button"
            onClick={onOpenSizeModal}
            className="text-ts-mustard hover:text-ts-krem font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Size Chart & Panduan</span>
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {sizeList.map((size) => {
            const isSelected = selectedSize === size;
            const surcharge = getSizeSurcharge(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`py-2.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'border-ts-terracotta bg-ts-terracotta/15 text-ts-krem ring-1 ring-ts-terracotta font-bold'
                    : 'border-ts-border bg-ts-surface text-ts-kremMuted hover:border-ts-borderHover'
                }`}
              >
                <span className="block text-sm font-mono">{size}</span>
                {surcharge > 0 && (
                  <span className="block text-[9px] font-mono text-ts-mustard mt-0.5">
                    +{formatRupiah(surcharge).replace('Rp ', '')}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stock SLA Routing Badge */}
      {fulfillmentSLA && (
        <div className="p-3 rounded-xl bg-ts-surface border border-ts-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-ts-teal shrink-0" />
            <div>
              <p className="font-semibold text-ts-krem text-xs">{fulfillmentSLA.slaLabel || 'Siap Kirim H+0 / H+1'}</p>
              <p className="text-[11px] text-ts-muted">{fulfillmentSLA.sourceLabel || 'Stok buffer studio aktif'}</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-ts-teal/15 text-ts-teal font-bold uppercase">
            {fulfillmentSLA.isStudioBuffer ? 'Buffer Ready' : 'JIT Vendor'}
          </span>
        </div>
      )}

      {/* Quantity & High-Conversion Action Buttons */}
      <div className="space-y-3.5 pt-2">
        <div className="flex items-center gap-3">
          {/* Stepper */}
          <div className="flex items-center border border-ts-border rounded-xl bg-ts-surface p-1 shrink-0">
            <button
              type="button"
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-8 h-9 rounded-lg hover:bg-ts-surfaceHover text-ts-krem font-bold text-base cursor-pointer transition-colors"
            >
              -
            </button>
            <span className="w-10 text-center font-mono font-bold text-sm text-ts-krem">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty(qty + 1)}
              className="w-8 h-9 rounded-lg hover:bg-ts-surfaceHover text-ts-krem font-bold text-base cursor-pointer transition-colors"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <div className="flex-1">
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

        {/* Direct Checkout & WhatsApp Support */}
        <div className="space-y-2 pt-1">
          <Button
            variant="cream"
            size="lg"
            className="w-full text-xs sm:text-sm py-3 font-extrabold shadow-sm"
            onClick={handleBuyNow}
          >
            Checkout Langsung Web &rarr;
          </Button>
          <div className="text-center pt-0.5">
            <button
              type="button"
              onClick={handleBuyWhatsapp}
              className="inline-flex items-center gap-1.5 text-xs text-ts-kremMuted hover:text-emerald-500 transition-colors py-1 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
              <span>Ragu soal ukuran atau butuh pesanan khusus? <strong className="text-ts-krem underline decoration-emerald-500/50">Chat WhatsApp Admin</strong></span>
            </button>
          </div>
        </div>

        {/* TeeStock Craft Mark Trust Badges */}
        <div className="p-4 rounded-2xl bg-ts-surface border border-ts-border space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-bold text-ts-krem flex items-center gap-1.5 uppercase text-[11px]">
              <ShieldCheck className="w-4 h-4 text-ts-terracotta" />
              TeeStock Craft Mark // Garansi Standar Garmen
            </span>
            <span className="text-[10px] font-mono text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              ORIGINAL
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-ts-kremMuted font-mono">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-ts-terracotta" />
              <span>NSA 24s 180 GSM Katun</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-ts-teal" />
              <span>0 Samping (Tubular)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-ts-mustard" />
              <span>Kerah Rib 2.2 cm Kokoh</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-ts-terracotta" />
              <span>Double Press 155°C Studio</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-ts-mustard" />
              <span>Free Vinyl Sticker Pack</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>100% Garansi Ganti Baru</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
