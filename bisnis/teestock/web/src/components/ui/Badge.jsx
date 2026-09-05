import React from 'react';

export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: "bg-white/[0.04] border-white/[0.08] text-ts-krem/85",
    terracotta: "bg-ts-terracotta/15 text-[#E2885E] border-ts-terracotta/35 shadow-[0_0_12px_-3px_rgba(193,103,61,0.3)]",
    mustard: "bg-ts-mustard/15 text-[#ECC369] border-ts-mustard/35 shadow-[0_0_12px_-3px_rgba(217,164,65,0.3)]",
    olive: "bg-ts-olive/15 text-[#A5AB88] border-ts-olive/35",
    teal: "bg-ts-teal/15 text-[#7BB3AA] border-ts-teal/35 shadow-[0_0_12px_-3px_rgba(79,124,116,0.3)]",
    green: "bg-ts-green/15 text-[#34D399] border-ts-green/35 shadow-[0_0_12px_-3px_rgba(16,185,129,0.3)]",
    red: "bg-ts-red/15 text-[#F87171] border-ts-red/35",
    shopee: "bg-[#EE4D2D]/15 text-[#FF7E61] border-[#EE4D2D]/35",
    tiktok: "bg-white/10 text-white border-white/20",
    whatsapp: "bg-[#25D366]/15 text-[#4EFA8A] border-[#25D366]/35",
    web: "bg-ts-terracotta/15 text-[#E2885E] border-ts-terracotta/35",
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold border backdrop-blur-md ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}

