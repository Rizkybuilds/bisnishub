import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RefreshCw, MessageSquare } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-ts-surface border-t border-ts-border mt-20">
      {/* Guarantees */}
      <div className="border-b border-ts-borderDim py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-ts-terracotta/20 text-ts-terracotta flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-ts-krem">100% Cotton NSA</h4>
              <p className="text-xs text-ts-muted mt-0.5">Jaminan keaslian bahan New State Apparel impor.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-ts-mustard/20 text-ts-mustard flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-ts-krem">Sablon DTF Awet</h4>
              <p className="text-xs text-ts-muted mt-0.5">Tinta pekat HD raster elastis, tidak retak saat dicuci.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-ts-olive/20 text-ts-olive flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-ts-krem">Kirim Seluruh RI</h4>
              <p className="text-xs text-ts-muted mt-0.5">Packing aman polymailer tebal + hangtag distro.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-ts-teal/20 text-ts-teal flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-ts-krem">Konsultasi Desain</h4>
              <p className="text-xs text-ts-muted mt-0.5">Bantuan penawaran cepat satuan atau komunitas via WhatsApp.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-ts-terracotta flex items-center justify-center font-bold text-white text-sm">
              TS
            </div>
            <span className="text-lg font-extrabold text-ts-krem">TeeStock Apparel</span>
          </div>
          <p className="text-xs text-ts-muted max-w-md leading-relaxed">
            Brand kaos print-on-demand premium yang mengangkat identitas profesi, hobi, dan fase hidup lewat estetika desain grafis berkelas di atas kaos polos New State Apparel.
          </p>
          <div className="text-xs text-ts-krem/70">
            Workshop & Meja Press: Tangerang / Jakarta • Indonesia
          </div>
        </div>

        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-ts-krem mb-3">Jelajahi Series</h5>
          <ul className="space-y-2 text-xs text-ts-muted">
            <li><Link to="/katalog?series=profesi" className="hover:text-ts-terracotta transition-colors">TeeStock Profesi</Link></li>
            <li><Link to="/katalog?series=komunitas" className="hover:text-ts-terracotta transition-colors">TeeStock Komunitas / Aktif</Link></li>
            <li><Link to="/katalog?series=fase" className="hover:text-ts-terracotta transition-colors">TeeStock Fase Hidup</Link></li>
            <li><Link to="/katalog?series=lokal" className="hover:text-ts-terracotta transition-colors">TeeStock Lokal</Link></li>
            <li><Link to="/katalog?series=fandom" className="hover:text-ts-terracotta transition-colors">TeeStock Retro & Fandom</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-ts-krem mb-3">Layanan & Bantuan</h5>
          <ul className="space-y-2 text-xs text-ts-muted">
            <li><Link to="/custom-order" className="hover:text-ts-terracotta transition-colors">Pesan Kaos Custom</Link></li>
            <li><Link to="/tracking" className="hover:text-ts-terracotta transition-colors">Cek Status Pesanan</Link></li>
            <li><a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="hover:text-ts-terracotta transition-colors">WhatsApp Customer Support</a></li>
            <li><Link to="/admin" className="hover:text-ts-terracotta transition-colors">Pusat Operasional Internal</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ts-borderDim py-6 text-center text-xs text-ts-muted">
        © {new Date().getFullYear()} TeeStock Apparel. Built for Indonesian Streetwear & Print-on-Demand.
      </div>
    </footer>
  );
}
