import React, { useState } from 'react';
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
  Tag
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { GARMENT_TYPES, SIZES } from '../../constants/garments';
import { Button } from '../../components/ui/Button';
import { SizeCalculatorModal } from '../../components/store/SizeCalculatorModal';
import { formatRupiah } from '../../utils/formatters';

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

export function ProductDetailPage() {
  const { sku } = useParams();
  const navigate = useNavigate();
  const { catalog } = useAdmin();
  const { addToCart } = useStore();

  const product = catalog.find(p => p.sku === sku);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-ts-krem">Produk Tidak Ditemukan</h2>
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
  const [colorSearch, setColorSearch] = useState('');

  // Available sizes
  const sizeList = isBlank && product.sizes
    ? product.sizes.split(',').map(s => s.trim()).filter(Boolean)
    : SIZES;

  const [selectedSize, setSelectedSize] = useState(sizeList[0] || 'L');
  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);

  // Dynamic image state with fallback
  const defaultImage = product.filePath || product.file_path;
  const [previewImg, setPreviewImg] = useState(defaultImage);

  // Sync state whenever sku changes
  React.useEffect(() => {
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

  // Price adjustments
  const basePrice = product.priceRetail || product.price_retail || 99000;
  let priceDelta = 0;
  if (!isBlank) {
    if (selectedGarmentKey === 'nsa_heavyweight_24s') priceDelta = 10000;
    else if (selectedGarmentKey === 'nsa_longsleeve') priceDelta = 12000;
    else if (selectedGarmentKey === 'nsa_hoodie') priceDelta = 85000;
    else if (selectedGarmentKey === 'nsa_polo') priceDelta = 30000;
  }
  const currentPrice = isBlank ? basePrice : (basePrice + priceDelta);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-ts-muted">
        <Link to="/katalog" className="hover:text-ts-terracotta flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Katalog
        </Link>
        <span>/</span>
        <span>{product.seriesName || product.series}</span>
        <span>/</span>
        <span className="text-ts-krem font-bold">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Product Mockup / Official Photo Image */}
        <div className="space-y-4">
          <div className="aspect-square bg-ts-surface border border-ts-border rounded-3xl overflow-hidden shadow-2xl relative group">
            <img
              src={previewImg}
              alt={`${product.name} - ${selectedColor}`}
              onError={() => setPreviewImg(defaultImage)}
              className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-ts-hitam/80 backdrop-blur border border-ts-border font-mono text-xs font-bold text-ts-terracotta">
              {product.sku}
            </div>
            {isBlank && (
              <div className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-ts-surface/90 backdrop-blur border border-ts-border text-[11px] font-bold text-ts-krem flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-ts-green" />
                <span>100% Original NSA</span>
              </div>
            )}

            {/* Active Color Name Pill on Bottom-Left */}
            <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-xl bg-ts-hitam/85 backdrop-blur border border-ts-border text-xs font-semibold text-ts-krem flex items-center gap-2 shadow-lg">
              <span
                className="w-3 h-3 rounded-full border border-white/40 shrink-0"
                style={{ backgroundColor: COLOR_HEX_MAP[selectedColor] || '#333333' }}
              />
              <span>Warna: <strong className="text-white">{selectedColor}</strong></span>
            </div>
          </div>

          {/* Wholesale Lusinan Price Promo Card for Blanks */}
          {isBlank && (
            <div className="p-4 bg-gradient-to-r from-ts-teal/15 via-ts-surface to-ts-surface border border-ts-teal/30 rounded-2xl flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="font-extrabold text-ts-krem flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-ts-teal" />
                  <span>Harga Grosir Lusinan (&ge;12 pcs)</span>
                </div>
                <p className="text-[11px] text-ts-muted">
                  Beli 12 pcs atau lebih (bisa campur warna &amp; size) otomatis dapat harga grosir reseller.
                </p>
              </div>
              <div className="text-right font-mono shrink-0 pl-3">
                <div className="text-[10px] text-ts-muted">Hanya</div>
                <div className="font-black text-sm text-ts-green">
                  {formatRupiah(product.priceReseller || (currentPrice - 7000))}
                  <span className="text-[10px] font-normal text-ts-muted">/pcs</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Spec & Purchasing Options */}
        <div className="space-y-6">
          <div>
            <div className="text-xs font-bold text-ts-terracotta uppercase tracking-wider">
              {product.seriesName || product.series} {product.niche ? `• ${product.niche}` : ''}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ts-krem mt-1 tracking-tight">
              {product.name}
            </h1>
            <div className="font-mono text-2xl font-extrabold text-ts-green mt-3">
              {formatRupiah(currentPrice)}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-ts-muted leading-relaxed">
            {product.description || (isBlank 
              ? "Kaos polos original New States Apparel (NSA) tanpa jahitan samping (tubular) standar ekspor internasional."
              : "Kaos print-on-demand premium dengan sablon DTF resolusi tinggi pada kaos katun New States Apparel impor.")}
          </p>

          {/* Shipping Dispatch SLA Badge */}
          {isBlank ? (
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-ts-teal/10 border border-ts-teal/30 text-xs text-ts-teal">
              <Truck className="w-5 h-5 shrink-0 text-ts-teal" />
              <div>
                <strong className="block font-bold text-ts-krem">⚡ Pengiriman Cepat 24 Jam Kerja</strong>
                <span className="text-[11px] text-ts-muted">Stok Kaos Polos NSA ready di warehouse. Langsung dipacking dan dikirim H+1.</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-ts-mustard/10 border border-ts-mustard/30 text-xs text-ts-mustard">
              <Clock className="w-5 h-5 shrink-0 text-ts-mustard" />
              <div>
                <strong className="block font-bold text-ts-krem">🛠️ Estimasi Cetak &amp; Kirim: 1-2 Hari Kerja</strong>
                <span className="text-[11px] text-ts-muted">Diproduksi fresh on-demand dengan double heat press presisi suhu 155°C.</span>
              </div>
            </div>
          )}

          <hr className="border-ts-borderDim" />

          {/* Model Garment Selector (Only for graphic tees; for blanks, show specs) */}
          {isBlank ? (
            <div className="p-4 bg-ts-surface/80 border border-ts-border rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-ts-krem flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-ts-mustard" />
                  Spesifikasi Asli Garmen NSA:
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-ts-hitam text-ts-terracotta border border-ts-border">
                  Model #{product.cititexCatId || '3600'}
                </span>
              </div>
              <p className="text-xs text-ts-muted">
                {product.niche}. 100% Produk Garmen Impor Asli New States Apparel (NSA). Bahan rajutan ring spun cotton halus, adem, dan awet untuk pemakaian harian maupun sablon DTF &amp; bordir.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-bold text-ts-krem flex items-center justify-between">
                <span>Pilihan Model Bahan Kaos NSA:</span>
                <span className="text-[11px] font-normal text-ts-muted">{selectedGarment.name}</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(GARMENT_TYPES).filter(([k]) => k !== 'supplies').slice(0, 5).map(([k, g]) => (
                  <button
                    key={k}
                    onClick={() => {
                      setSelectedGarmentKey(k);
                      if (g.colors?.[0]) setSelectedColor(g.colors[0].name);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                      selectedGarmentKey === k
                        ? 'bg-ts-terracotta/15 border-ts-terracotta text-white shadow-sm'
                        : 'bg-ts-surface border-ts-border text-ts-krem/80 hover:bg-ts-surfaceHover'
                    }`}
                  >
                    <div>{g.name}</div>
                    <div className="text-[10px] text-ts-muted font-normal mt-0.5">
                      {k === 'nsa_softstyle_30s' ? 'Standar' : `+${formatRupiah(k === 'nsa_heavyweight_24s' ? 10000 : k === 'nsa_longsleeve' ? 12000 : k === 'nsa_hoodie' ? 85000 : 30000)}`}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-ts-krem flex items-center gap-2">
                <span>Pilihan Warna:</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-ts-hitam border border-ts-border font-bold text-white text-[11px]">
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white/40"
                    style={{ backgroundColor: COLOR_HEX_MAP[selectedColor] || '#333333' }}
                  />
                  {selectedColor}
                </span>
              </label>
              <span className="text-[11px] text-ts-muted font-medium">
                {colorList.length} Pilihan Warna Resmi
              </span>
            </div>

            {isBlank ? (
              /* Cititex-style Circular Swatches Grid with Real Fabric Photos & Tooltips */
              <div className="p-3.5 bg-ts-surface/90 border border-ts-border rounded-2xl space-y-2">
                <div className="flex flex-wrap items-center gap-2 max-h-56 overflow-y-auto pr-1">
                  {colorList.map(colName => {
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
                        className={`group relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden transition-all duration-150 shrink-0 ${
                          isSelected
                            ? 'ring-2 ring-ts-terracotta ring-offset-2 ring-offset-ts-hitam scale-110 z-10 shadow-lg'
                            : 'ring-1 ring-ts-border hover:ring-ts-krem/70 hover:scale-105 opacity-90 hover:opacity-100'
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
                        {/* Hover mini tooltip */}
                        <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block z-30 px-2 py-0.5 rounded-md bg-ts-hitam text-[10px] font-bold text-ts-krem border border-ts-border whitespace-nowrap shadow-xl">
                          {colName}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-ts-muted italic pt-1">
                  * Klik lingkaran warna di atas untuk mengubah foto variasi secara langsung.
                </p>
              </div>
            ) : (
              /* Graphic Tee Garment Colors */
              <div className="flex flex-wrap items-center gap-2 max-h-48 overflow-y-auto pr-1">
                {colorList.map(colName => {
                  const hex = COLOR_HEX_MAP[colName] || '#333333';
                  const isSelected = selectedColor === colName;
                  return (
                    <button
                      key={colName}
                      onClick={() => handleColorChange(colName)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-ts-hitam border-ts-terracotta text-white ring-1 ring-ts-terracotta'
                          : 'bg-ts-surface border-ts-border text-ts-krem/80 hover:bg-ts-surfaceHover'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                        style={{ backgroundColor: hex }}
                      />
                      <span>{colName}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Size Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-ts-krem">Ukuran Kaos:</label>
              <button
                type="button"
                onClick={() => setIsSizeModalOpen(true)}
                className="text-xs text-ts-terracotta hover:underline font-bold flex items-center gap-1.5 bg-ts-surface px-2.5 py-1 rounded-lg border border-ts-border hover:border-ts-terracotta transition-colors"
              >
                <Ruler className="w-3.5 h-3.5" /> Hitung Ukuran (TB/BB)
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {sizeList.map(sz => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`w-11 h-10 rounded-xl border font-mono text-xs font-extrabold transition-all ${
                    selectedSize === sz
                      ? 'bg-ts-terracotta text-white border-ts-terracotta shadow-md'
                      : 'bg-ts-surface border-ts-border text-ts-krem/80 hover:bg-ts-surfaceHover'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-3 pt-4 border-t border-ts-borderDim">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-ts-border rounded-xl bg-ts-surface p-1">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-8 h-8 rounded-lg hover:bg-ts-hitam text-ts-krem font-bold text-sm"
                >
                  -
                </button>
                <span className="w-10 text-center font-mono font-bold text-sm text-ts-krem">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-8 h-8 rounded-lg hover:bg-ts-hitam text-ts-krem font-bold text-sm"
                >
                  +
                </button>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                icon={isAdded ? Check : ShoppingBag}
                onClick={handleAddToCart}
              >
                {isAdded ? "Ditambahkan ke Keranjang!" : "Tambah ke Keranjang"}
              </Button>
            </div>

            <Button
              variant="cream"
              size="lg"
              className="w-full"
              onClick={handleBuyNow}
            >
              Beli Sekarang &amp; Checkout
            </Button>

            {/* Guarantees & Trust Badges */}
            <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-ts-muted border-t border-ts-borderDim/50">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-ts-green shrink-0" />
                <span>100% Kaos Asli NSA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-ts-terracotta shrink-0" />
                <span>Garansi Retur Jika Cacat</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Size Calculator & Chart Modal */}
      <SizeCalculatorModal
        isOpen={isSizeModalOpen}
        onClose={() => setIsSizeModalOpen(false)}
        onSelectSize={(sz) => setSelectedSize(sz)}
        currentSize={selectedSize}
      />
    </div>
  );
}

