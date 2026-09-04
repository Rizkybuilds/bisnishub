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
  Ruler
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { GARMENT_TYPES, SIZES } from '../../constants/garments';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { formatRupiah } from '../../utils/formatters';

export function ProductDetailPage() {
  const { sku } = useParams();
  const navigate = useNavigate();
  const { catalog } = useAdmin();
  const { addToCart } = useStore();

  const product = catalog.find(p => p.sku === sku);

  const [selectedGarmentKey, setSelectedGarmentKey] = useState('nsa_softstyle_30s');
  const selectedGarment = GARMENT_TYPES[selectedGarmentKey] || GARMENT_TYPES.nsa_softstyle_30s;
  const [selectedColor, setSelectedColor] = useState(selectedGarment.colors[0]?.name || 'Hitam');
  const [selectedSize, setSelectedSize] = useState('L');
  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-ts-krem">Produk Tidak Ditemukan</h2>
        <p className="text-xs text-ts-muted">Desain dengan SKU {sku} tidak terdaftar di katalog kami.</p>
        <Link to="/katalog">
          <Button variant="primary">Kembali ke Katalog</Button>
        </Link>
      </div>
    );
  }

  // Price adjustments according to garment type
  const basePrice = product.priceRetail || product.price_retail || 99000;
  let priceDelta = 0;
  if (selectedGarmentKey === 'nsa_heavyweight_24s') priceDelta = 10000;
  else if (selectedGarmentKey === 'nsa_longsleeve') priceDelta = 12000;
  else if (selectedGarmentKey === 'nsa_hoodie') priceDelta = 85000;
  else if (selectedGarmentKey === 'nsa_polo') priceDelta = 30000;

  const currentPrice = basePrice + priceDelta;

  const handleAddToCart = () => {
    addToCart(product, selectedGarment, selectedColor, selectedSize, qty);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedGarment, selectedColor, selectedSize, qty);
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
        {/* Left: Product Mockup Image */}
        <div className="space-y-4">
          <div className="aspect-square bg-ts-surface border border-ts-border rounded-3xl overflow-hidden shadow-2xl relative">
            <img
              src={product.filePath || product.file_path}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-ts-hitam/80 backdrop-blur border border-ts-border font-mono text-xs font-bold text-ts-terracotta">
              {product.sku}
            </div>
          </div>
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
            {product.description || "Kaos print-on-demand premium dengan sablon DTF resolusi tinggi pada kaos katun New State Apparel impor."}
          </p>

          <hr className="border-ts-borderDim" />

          {/* Model Garment Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-ts-krem flex items-center justify-between">
              <span>Pilihan Model Bahan Kaos NSA:</span>
              <span className="text-[11px] font-normal text-ts-muted">{selectedGarment.name}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(GARMENT_TYPES).filter(([k]) => k !== 'supplies').map(([k, g]) => (
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

          {/* Color Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-ts-krem flex items-center justify-between">
              <span>Warna Kaos: <strong className="text-ts-terracotta">{selectedColor}</strong></span>
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {selectedGarment.colors.map(col => (
                <button
                  key={col.name}
                  onClick={() => setSelectedColor(col.name)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                    selectedColor === col.name
                      ? 'bg-ts-hitam border-ts-terracotta text-white ring-1 ring-ts-terracotta'
                      : 'bg-ts-surface border-ts-border text-ts-krem/80 hover:bg-ts-surfaceHover'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                    style={{ backgroundColor: col.hex }}
                  />
                  <span>{col.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-ts-krem">Ukuran Kaos:</label>
              <button
                onClick={() => setIsSizeModalOpen(true)}
                className="text-[11px] text-ts-terracotta hover:underline font-semibold flex items-center gap-1"
              >
                <Ruler className="w-3 h-3" /> Panduan Ukuran NSA
              </button>
            </div>
            <div className="flex items-center gap-2">
              {SIZES.map(sz => (
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
              Beli Sekarang & Checkout
            </Button>
          </div>
        </div>
      </div>

      {/* Size Chart Modal */}
      <Modal
        isOpen={isSizeModalOpen}
        onClose={() => setIsSizeModalOpen(false)}
        title="Panduan Ukuran Kaos Polos New State Apparel (NSA)"
      >
        <div className="space-y-4 text-xs">
          <p className="text-ts-muted">
            Ukuran standar internasional (toleransi &plusmn;1-2 cm). Bahan 100% Ring Spun Cotton tanpa jahitan samping.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-ts-hitam border-b border-ts-border font-mono text-ts-muted">
                  <th className="p-2">Size</th>
                  <th className="p-2">Lebar Dada (cm)</th>
                  <th className="p-2">Panjang Badan (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ts-borderDim font-mono">
                <tr><td className="p-2 font-bold text-ts-terracotta">S</td><td className="p-2">47 cm</td><td className="p-2">66 cm</td></tr>
                <tr><td className="p-2 font-bold text-ts-terracotta">M</td><td className="p-2">50 cm</td><td className="p-2">69 cm</td></tr>
                <tr><td className="p-2 font-bold text-ts-terracotta">L</td><td className="p-2">53 cm</td><td className="p-2">72 cm</td></tr>
                <tr><td className="p-2 font-bold text-ts-terracotta">XL</td><td className="p-2">56 cm</td><td className="p-2">74 cm</td></tr>
                <tr><td className="p-2 font-bold text-ts-terracotta">XXL</td><td className="p-2">59 cm</td><td className="p-2">76 cm</td></tr>
                <tr><td className="p-2 font-bold text-ts-terracotta">3XL</td><td className="p-2">62 cm</td><td className="p-2">79 cm</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </div>
  );
}
