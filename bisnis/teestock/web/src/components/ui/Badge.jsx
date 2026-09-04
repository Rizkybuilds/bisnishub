import React from 'react';

export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: "bg-ts-surface border-ts-border text-ts-krem/80",
    terracotta: "bg-ts-terracotta/20 text-[#E2885E] border-ts-terracotta/40",
    mustard: "bg-ts-mustard/20 text-[#ECC369] border-ts-mustard/40",
    olive: "bg-ts-olive/20 text-[#9DA383] border-ts-olive/40",
    teal: "bg-ts-teal/20 text-[#7BB3AA] border-ts-teal/40",
    green: "bg-ts-green/20 text-[#34D399] border-ts-green/40",
    red: "bg-ts-red/20 text-[#F87171] border-ts-red/40",
    shopee: "bg-[#EE4D2D]/20 text-[#FF6E4E] border-[#EE4D2D]/40",
    tiktok: "bg-white/10 text-white border-white/20",
    whatsapp: "bg-[#25D366]/20 text-[#4EFA8A] border-[#25D366]/40",
    web: "bg-ts-terracotta/20 text-[#E2885E] border-ts-terracotta/40",
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}
