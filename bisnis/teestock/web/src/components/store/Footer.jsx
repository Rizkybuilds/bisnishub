import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RefreshCw, MessageSquare, Zap } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { sanitizePhoneNumber } from '../../utils/whatsappTemplates';
import { NewsletterCapture } from './NewsletterCapture';
import { TeeStockLogo } from '../common/TeeStockLogo';

export function Footer() {
  const { storeSettings } = useStore();
  const cleanWhatsapp = sanitizePhoneNumber(storeSettings?.storeWhatsapp || '085220274968');

  return (
    <footer className="bg-ts-surface border-t border-ts-border mt-20 relative transition-colors">
      {/* Guarantees Bar */}
      <div className="border-b border-ts-border py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-ts-surfaceHover text-ts-terracotta flex items-center justify-center shrink-0 border border-ts-border">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-ts-krem uppercase font-mono">100% Garmen NSA</h4>
              <p className="text-xs text-ts-kremMuted mt-0.5">Jaminan keaslian bahan New States Apparel Original Cititex.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-ts-surfaceHover text-ts-mustard flex items-center justify-center shrink-0 border border-ts-border">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-ts-krem uppercase font-mono">Double Press 155°C</h4>
              <p className="text-xs text-ts-kremMuted mt-0.5">Tinta pekat HD raster elastis, tidak retak saat dicuci berulang.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-ts-surfaceHover text-ts-teal flex items-center justify-center shrink-0 border border-ts-border">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-ts-krem uppercase font-mono">Kirim Cepat H+1</h4>
              <p className="text-xs text-ts-kremMuted mt-0.5">Packing aman polymailer doff tahan cuaca + stiker distro.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-ts-surfaceHover text-ts-green flex items-center justify-center shrink-0 border border-ts-border">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-ts-krem uppercase font-mono">Direct WA (0% Fee)</h4>
              <p className="text-xs text-ts-kremMuted mt-0.5">Konsultasi cepat satuan atau custom partai via WhatsApp.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Bar in Footer */}
      <div className="border-b border-ts-border py-8 bg-ts-surfaceHover/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left max-w-lg">
            <h4 className="text-sm sm:text-base font-extrabold text-ts-krem">
              Daftar Notifikasi Drop &amp; Dapatkan Diskon 10%
            </h4>
            <p className="text-xs text-ts-kremMuted mt-1">
              Jadilah yang pertama tahu saat Drop #02 rilis. Plus voucher diskon pertama langsung aktif.
            </p>
          </div>
          <div className="w-full md:w-80">
            <NewsletterCapture source="footer_bar" compact={true} />
          </div>
        </div>
      </div>

      {/* Main Footer Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2 space-y-4">
          <TeeStockLogo size="md" badge="APPAREL HOUSE" />
          <p className="text-xs text-ts-kremMuted max-w-md leading-relaxed">
            Brand distro print-on-demand modern yang mengangkat identitas profesi, hobi, dan fase hidup lewat estetika desain grafis berkelas di atas kaos polos New States Apparel.
          </p>
          <div className="text-xs text-ts-muted font-mono">
            Central Studio Workshop: Citayam &bull; Satellite Hub: Bogor &bull; 100% Online D2C
          </div>

          {/* Social Links */}
          <div className="pt-2 flex items-center gap-3">
            <a
              href="https://instagram.com/teestock.id"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium border border-ts-border bg-ts-surfaceHover/50 text-ts-kremMuted hover:text-ts-terracotta hover:border-ts-terracotta/40 transition-all flex items-center gap-1.5"
            >
              <span>Instagram</span>
              <span className="text-[10px] text-ts-muted">@teestock.id</span>
            </a>
            <a
              href="https://tiktok.com/@teestock.id"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium border border-ts-border bg-ts-surfaceHover/50 text-ts-kremMuted hover:text-ts-terracotta hover:border-ts-terracotta/40 transition-all flex items-center gap-1.5"
            >
              <span>TikTok</span>
              <span className="text-[10px] text-ts-muted">@teestock.id</span>
            </a>
            <a
              href="https://shopee.co.id/teestock.id"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium border border-ts-border bg-ts-surfaceHover/50 text-ts-kremMuted hover:text-ts-terracotta hover:border-ts-terracotta/40 transition-all flex items-center gap-1.5"
            >
              <span>Shopee</span>
              <span className="text-[10px] text-ts-muted">teestock.id</span>
            </a>
          </div>
        </div>

        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-ts-krem mb-3 font-mono">Jelajahi Series</h5>
          <ul className="space-y-2 text-xs text-ts-kremMuted">
            <li><Link to="/katalog?series=profesi" className="hover:text-ts-terracotta transition-colors">TeeStock Profesi</Link></li>
            <li><Link to="/katalog?series=komunitas" className="hover:text-ts-terracotta transition-colors">TeeStock Komunitas / Aktif</Link></li>
            <li><Link to="/katalog?series=fase" className="hover:text-ts-terracotta transition-colors">TeeStock Fase Hidup</Link></li>
            <li><Link to="/katalog?series=lokal" className="hover:text-ts-terracotta transition-colors">TeeStock Lokal</Link></li>
            <li><Link to="/katalog?series=blank" className="hover:text-ts-teal transition-colors">Koleksi Kaos Polos NSA</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-ts-krem mb-3 font-mono">Layanan &amp; Bantuan</h5>
          <ul className="space-y-2 text-xs text-ts-kremMuted">
            <li><Link to="/care" className="hover:text-ts-terracotta transition-colors">Garansi &amp; Panduan Ukuran</Link></li>
            <li><Link to="/custom-order" className="hover:text-ts-terracotta transition-colors">Pesan Kaos Custom</Link></li>
            <li><Link to="/tracking" className="hover:text-ts-terracotta transition-colors">Cek Status Pesanan</Link></li>
            <li><a href={`https://wa.me/${cleanWhatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-ts-terracotta transition-colors">WhatsApp Customer Support</a></li>
            <li><Link to="/garansi" className="hover:text-ts-terracotta transition-colors">Garansi Retur 100%</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ts-border py-6 text-center text-xs text-ts-muted">
        &copy; {new Date().getFullYear()} TeeStock Apparel. Built for Indonesian Streetwear &amp; Print-on-Demand.
      </div>
    </footer>
  );
}
