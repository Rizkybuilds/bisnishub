import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Home, 
  ShoppingBag, 
  Layers, 
  Palette, 
  Truck, 
  MessageSquare, 
  AlertTriangle 
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { SEOHead } from '../../components/common/SEOHead';
import { useStore } from '../../context/StoreContext';
import { sanitizePhoneNumber } from '../../utils/whatsappTemplates';

export function NotFoundPage() {
  const navigate = useNavigate();
  const { storeSettings } = useStore();
  const cleanPhone = sanitizePhoneNumber(storeSettings?.storeWhatsapp || '085220274968');

  return (
    <div className="min-h-[70vh] flex flex-col justify-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
      <SEOHead
        title="404 — Halaman Tidak Ditemukan | TeeStock"
        description="Halaman yang Anda cari tidak ditemukan atau telah dipindahkan."
      />

      {/* Top Badge */}
      <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1 rounded-full bg-ts-terracotta/15 border border-ts-terracotta/30 text-xs font-mono font-bold text-ts-terracotta mx-auto mb-6">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>ERROR 404 // TAUTAN TIDAK DITEMUKAN</span>
      </div>

      {/* Hero 404 Display */}
      <h1 className="text-6xl sm:text-8xl font-black text-ts-krem tracking-tight uppercase font-mono">
        404
      </h1>
      <p className="mt-2 text-xl sm:text-2xl font-bold text-ts-krem">
        Oops! Halaman Ini Berada di Luar Radar Studio
      </p>
      <p className="mt-3 text-sm text-ts-kremMuted max-w-md mx-auto leading-relaxed">
        Tautan yang Anda tuju mungkin salah ketik, telah berakhir kuota rilisnya, atau telah dipindahkan ke direktori baru.
      </p>

      {/* Quick Navigation Cards */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        <Link 
          to="/katalog"
          className="p-4 rounded-xl bg-ts-surface border border-ts-border hover:border-ts-terracotta/50 hover:bg-ts-surface/80 transition-all group block"
        >
          <div className="w-8 h-8 rounded-lg bg-ts-terracotta/15 text-ts-terracotta flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-ts-krem group-hover:text-ts-terracotta transition-colors">
            Katalog Grafis
          </h3>
          <p className="text-xs text-ts-kremMuted mt-1">
            Koleksi kaos rilisan terbatas bahan NSA 24s.
          </p>
        </Link>

        <Link 
          to="/polos"
          className="p-4 rounded-xl bg-ts-surface border border-ts-border hover:border-ts-mustard/50 hover:bg-ts-surface/80 transition-all group block"
        >
          <div className="w-8 h-8 rounded-lg bg-ts-mustard/15 text-ts-mustard flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-ts-krem group-hover:text-ts-mustard transition-colors">
            The Blanks (Polos)
          </h3>
          <p className="text-xs text-ts-kremMuted mt-1">
            Kaos polos NSA Heavyweight & Softstyle original.
          </p>
        </Link>

        <Link 
          to="/custom-order"
          className="p-4 rounded-xl bg-ts-surface border border-ts-border hover:border-teal-500/50 hover:bg-ts-surface/80 transition-all group block"
        >
          <div className="w-8 h-8 rounded-lg bg-teal-500/15 text-teal-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Palette className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-ts-krem group-hover:text-teal-400 transition-colors">
            Studio Custom
          </h3>
          <p className="text-xs text-ts-kremMuted mt-1">
            Sablon DTF satuan in-house 155°C tanpa minimal.
          </p>
        </Link>

        <Link 
          to="/tracking"
          className="p-4 rounded-xl bg-ts-surface border border-ts-border hover:border-indigo-500/50 hover:bg-ts-surface/80 transition-all group block"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Truck className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-ts-krem group-hover:text-indigo-400 transition-colors">
            Lacak Pesanan
          </h3>
          <p className="text-xs text-ts-kremMuted mt-1">
            Pantau status proses sablon & resi paket kurir.
          </p>
        </Link>
      </div>

      {/* Main Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button 
          variant="outline" 
          icon={ArrowLeft}
          onClick={() => navigate(-1)}
        >
          Halaman Sebelumnya
        </Button>

        <Link to="/">
          <Button variant="primary" icon={Home}>
            Kembali ke Beranda
          </Button>
        </Link>

        <a
          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('Halo Tim TeeStock, saya mengalami kendala tautan halaman tidak ditemukan (404) di website.')}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="ghost" icon={MessageSquare} className="text-ts-kremMuted hover:text-ts-krem">
            Bantuan CS WhatsApp
          </Button>
        </a>
      </div>
    </div>
  );
}
