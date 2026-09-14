import React from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';

export function HomeStudioManifesto({ cleanWhatsapp }) {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="p-5 sm:p-10 rounded-2xl sm:rounded-3xl bg-ts-surface border border-ts-border relative overflow-hidden space-y-6 sm:space-y-8 shadow-sm transition-colors duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ts-border pb-5 sm:pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ts-surfaceHover border border-ts-border text-ts-terracotta text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE STUDIO MANIFESTO // IN-HOUSE CRAFT</span>
            </div>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-ts-krem tracking-tight uppercase leading-snug">
              Obsessive Craft. <br className="hidden sm:inline" />
              Zero Compromise.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-ts-kremMuted max-w-md leading-relaxed">
            TeeStock menolak garmen tipis yang kehilangan bentuk setelah dicuci. Kami merancang setiap potong di atas katun berbobot dan menyelesaikannya secara presisi di studio kami sendiri.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5">
          {/* Pillar 1: Heavyweight Cotton */}
          <div className="p-4 sm:p-5 rounded-2xl bg-ts-surfaceHover/30 border border-ts-border space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-ts-terracotta uppercase tracking-wider font-bold">01 // GARMEN</span>
              <h3 className="text-sm sm:text-base font-bold text-ts-krem">180 GSM Heavyweight Tubular</h3>
              <p className="text-xs text-ts-kremMuted leading-relaxed">
                Katun 100% ringspun New States Apparel tanpa jahitan samping. Memberi siluet bahu yang tegap, tidak melintir, dan tidak menerawang di bawah sinar matahari.
              </p>
            </div>
            <span className="text-[10px] font-mono text-ts-muted border-t border-ts-border pt-2.5 block">
              Standard: NSA 7200 Series
            </span>
          </div>

          {/* Pillar 2: Dual Heat Curing */}
          <div className="p-4 sm:p-5 rounded-2xl bg-ts-surfaceHover/30 border border-ts-border space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-ts-mustard uppercase tracking-wider font-bold">02 // SABLON</span>
              <h3 className="text-sm sm:text-base font-bold text-ts-krem">155°C Dual-Heat Curing</h3>
              <p className="text-xs text-ts-kremMuted leading-relaxed">
                Bukan sablon massal asal jadi. Setiap lembar dipress dua kali di suhu 155°C dengan tekanan 4 bar agar tinta elastis mengunci sempurna ke pori serat kain.
              </p>
            </div>
            <span className="text-[10px] font-mono text-ts-muted border-t border-ts-border pt-2.5 block">
              Standard: In-House Double Press
            </span>
          </div>

          {/* Pillar 3: Unboxing Experience */}
          <div className="p-4 sm:p-5 rounded-2xl bg-ts-surfaceHover/30 border border-ts-border space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-teal-600 dark:text-teal-300 uppercase tracking-wider font-bold">03 // PENGALAMAN</span>
              <h3 className="text-sm sm:text-base font-bold text-ts-krem">The Unboxing Standard</h3>
              <p className="text-xs text-ts-kremMuted leading-relaxed">
                Bebas label leher kertas yang gatal. Polymailer charcoal doff kedap air, aroma studio segar, 2x limited vinyl sticker pack, dan kartu garansi founder.
              </p>
            </div>
            <span className="text-[10px] font-mono text-ts-muted border-t border-ts-border pt-2.5 block">
              Standard: Zero-Itch Protocol
            </span>
          </div>
        </div>

        {/* Workshop Origin Transparency Footer */}
        <div className="pt-4 border-t border-ts-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-ts-terracotta/20 text-ts-terracotta font-bold flex items-center justify-center font-mono text-xs border border-ts-terracotta/30 shrink-0">
              TS
            </div>
            <div>
              <span className="block text-xs font-bold text-ts-krem uppercase font-mono">TeeStock Central Studio</span>
              <span className="block text-[10px] text-ts-muted">Central Studio &amp; Fulfillment: Depok • Kirim ke Seluruh Indonesia</span>
            </div>
          </div>

          <a
            href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent("Halo TeeStock Studio! Saya ingin tanya produk / custom order.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold bg-ts-surfaceHover hover:bg-ts-border text-ts-krem border border-ts-border transition-all cursor-pointer text-center"
          >
            <MessageSquare className="w-3.5 h-3.5 text-ts-green" />
            <span>DISKUSI VIA WHATSAPP</span>
          </a>
        </div>
      </div>
    </section>
  );
}
