import React, { useEffect } from 'react';
import {
  ShoppingBag,
  LayoutGrid,
  Palette,
  Users,
  MessageCircle,
  ExternalLink,
  Flame,
  ArrowUpRight,
  Music2,
  Instagram,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { sanitizePhoneNumber } from '../../utils/whatsappTemplates';
import { NewsletterCapture } from '../../components/store/NewsletterCapture';
import { SEOHead } from '../../components/common/SEOHead';
import { TeeStockLogoIcon } from '../../components/common/TeeStockLogo';

// ─── Component ────────────────────────────────────────────────────
export function BioLinkPage() {
  const { storeSettings } = useStore();
  const shopeeUrl = storeSettings?.shopeeUrl || 'https://shopee.co.id/teestock.id';
  const rawPhone = storeSettings?.storeWhatsapp || '085220274968';
  const cleanPhone = sanitizePhoneNumber(rawPhone);

  const bioLinks = [
    {
      id: 'drop',
      label: 'DROP #01: RAW IDENTITY',
      subtitle: 'Koleksi Grafis Perdana · Kuota 24 Pcs Early Bird',
      href: '/katalog?utm_source=biolink&utm_medium=social&utm_campaign=drop01',
      internal: true,
      accent: true,
      icon: Flame,
    },
    {
      id: 'shopee',
      label: 'Shopee Official Store',
      subtitle: 'Klaim Bebas Ongkir & Garansi Retur Se-Indonesia',
      href: `${shopeeUrl}?utm_source=biolink&utm_medium=social&utm_campaign=shopee`,
      internal: false,
      icon: ShoppingBag,
    },
    {
      id: 'katalog',
      label: 'Katalog Grafis & Blank NSA',
      subtitle: 'Website resmi TeeStock Apparel House',
      href: '/?utm_source=biolink&utm_medium=social&utm_campaign=website',
      internal: true,
      icon: LayoutGrid,
    },
    {
      id: 'custom',
      label: 'TeeStock Atelier (Custom & Merch)',
      subtitle: 'Sablon Satuan, Komunitas & Official Creator Merch',
      href: '/custom-order?utm_source=biolink&utm_medium=social&utm_campaign=studio',
      internal: true,
      icon: Palette,
    },
    {
      id: 'reseller',
      label: 'Kemitraan Dropship White-Label',
      subtitle: 'Tanpa modal, materi promosi siap pakai, margin 37-48%',
      href: `https://wa.me/${cleanPhone}?text=${encodeURIComponent('Halo TeeStock, saya tertarik jadi reseller/dropshipper. Boleh info lebih lanjut?')}&utm_source=biolink&utm_medium=social&utm_campaign=reseller`,
      internal: false,
      icon: Users,
    },
  ];

  const socialLinks = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      href: `https://wa.me/${cleanPhone}?text=Halo%20TeeStock!`,
      icon: MessageCircle,
      color: 'hover:bg-emerald-500/20 hover:border-emerald-500/40 hover:text-emerald-400',
    },
    {
      id: 'tiktok',
      label: 'TikTok',
      href: 'https://tiktok.com/@teestock.id',
      icon: Music2,
      color: 'hover:bg-pink-500/20 hover:border-pink-500/40 hover:text-pink-400',
    },
    {
      id: 'instagram',
      label: 'Instagram',
      href: 'https://instagram.com/teestock.id',
      icon: Instagram,
      color: 'hover:bg-purple-500/20 hover:border-purple-500/40 hover:text-purple-400',
    },
  ];

  const visibleLinks = bioLinks.filter(link => !link.hidden);

  return (
    <div className="min-h-screen bg-ts-hitam text-ts-krem flex items-start justify-center px-4 py-8 sm:py-12">
      <SEOHead
        title="TeeStock Apparel | Link Resmi Bio Instagram & TikTok"
        description="Wear Your Identity, Stock Your Story. Koleksi eksklusif Drop #01, Official Shopee Store, Jasa Kaos Custom, dan Peluang Kemitraan Dropship TeeStock."
        canonicalPath="/bio"
      />
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-gradient-to-b from-ts-terracotta/15 via-ts-mustard/8 to-transparent blur-[100px] rounded-full" />
      </div>

      <div className="w-full max-w-md space-y-6 animate-in fade-in duration-700">
        {/* ─── Profile Header ─────────────────────────────────── */}
        <header className="text-center space-y-3">
          {/* Logo / Avatar */}
          <div className="relative mx-auto w-20 h-20 rounded-2xl bg-[#141312] border border-white/10 flex items-center justify-center group">
            <TeeStockLogoIcon className="w-11 h-11 text-ts-terracotta transition-transform duration-300 group-hover:scale-105" />
            {/* Online studio dot */}
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-ts-green border-2 border-ts-hitam" />
            </span>
          </div>

          {/* Brand Name */}
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight text-white">
              TeeStock
            </h1>
            <p className="text-xs text-ts-kremMuted font-mono uppercase tracking-wider mt-0.5">
              Curated Apparel &amp; Merch House
            </p>
          </div>

          {/* Tagline */}
          <p className="text-xs text-ts-muted">
            "Wear Your Identity, Stock Your Story"
          </p>
        </header>

        {/* ─── Main Links ─────────────────────────────────────── */}
        <nav className="space-y-3" aria-label="Bio links">
          {visibleLinks.map((link, index) => {
            const Icon = link.icon;
            const isExternal = !link.internal;

            const baseClasses = `
              group relative w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl
              border
              transition-all duration-200 ease-out
              hover:-translate-y-0.5 active:translate-y-0
              focus:outline-none focus:ring-1 focus:ring-ts-terracotta
            `;

            const accentClasses = link.accent
              ? 'bg-[#181614] border-ts-terracotta/40 hover:border-ts-terracotta'
              : 'bg-[#141312] border-white/[0.08] hover:border-white/20';

            const content = (
              <>
                <span className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
                  link.accent 
                    ? 'bg-ts-terracotta/30 text-ts-terracotta' 
                    : 'bg-white/[0.06] text-ts-kremMuted group-hover:text-ts-krem'
                }`}>
                  <Icon className="w-4.5 h-4.5" />
                </span>
                <span className="flex-1 text-left min-w-0">
                  <span className={`block text-sm font-semibold leading-snug ${
                    link.accent ? 'text-white' : 'text-ts-krem'
                  }`}>
                    {link.label}
                  </span>
                  {link.subtitle && (
                    <span className="block text-[11px] text-ts-muted mt-0.5 leading-tight">
                      {link.subtitle}
                    </span>
                  )}
                </span>
                <span className="flex-shrink-0 text-ts-muted group-hover:text-ts-kremMuted transition-colors">
                  {isExternal ? <ExternalLink className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </span>
              </>
            );

            // Internal links use anchor with relative path, external links open new tab
            if (link.internal) {
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`${baseClasses} ${accentClasses}`}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  {content}
                </a>
              );
            }

            return (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${baseClasses} ${accentClasses}`}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {content}
              </a>
            );
          })}
        </nav>

        {/* ─── Social Links ───────────────────────────────────── */}
        <div className="flex items-center justify-center gap-3 pt-2">
          {socialLinks.map(social => {
            const Icon = social.icon;
            return (
              <a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-lg
                  bg-white/[0.04] border border-white/[0.08]
                  text-ts-kremMuted text-xs font-medium
                  transition-all duration-300
                  ${social.color}
                `}
                aria-label={social.label}
              >
                <Icon className="w-4 h-4" />
                <span>{social.label}</span>
              </a>
            );
          })}
        </div>

        {/* ─── Newsletter Capture (VIP Drop Alert) ─────────── */}
        <div className="pt-2 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm space-y-2">
          <div className="text-center">
            <span className="text-xs font-bold text-white block">Klaim Voucher Diskon 10%</span>
            <span className="text-[11px] text-ts-kremMuted block mt-0.5">Dapatkan kode promo perdana &amp; notifikasi rilis Drop #02</span>
          </div>
          <NewsletterCapture source="biolink" compact={true} />
        </div>

        {/* ─── Footer ─────────────────────────────────────────── */}
        <footer className="text-center pt-4 pb-6 space-y-3">
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-ts-muted/60">
            <span className="w-8 h-px bg-white/[0.08]" />
            <span className="uppercase tracking-widest font-mono">TeeStock © 2026</span>
            <span className="w-8 h-px bg-white/[0.08]" />
          </div>
          <p className="text-[10px] text-ts-muted/40">
            100% Original NSA · DTF HD Premium · Produksi Mandiri
          </p>
        </footer>
      </div>
    </div>
  );
}
