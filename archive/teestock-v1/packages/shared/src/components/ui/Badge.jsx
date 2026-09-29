import React from 'react';

export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: "bg-ts-surface border-ts-border text-ts-krem/85",
    terracotta: "bg-ts-terracotta/15 text-ts-terracotta dark:text-[#E2885E] border-ts-terracotta/35 shadow-[0_0_12px_-3px_rgba(193,103,61,0.2)]",
    mustard: "bg-ts-mustard/15 text-[#9A6A12] dark:text-[#ECC369] border-ts-mustard/35 shadow-[0_0_12px_-3px_rgba(217,164,65,0.2)]",
    olive: "bg-ts-olive/15 text-[#5D6345] dark:text-[#A5AB88] border-ts-olive/35",
    teal: "bg-ts-teal/15 text-[#2E5B53] dark:text-[#7BB3AA] border-ts-teal/35 shadow-[0_0_12px_-3px_rgba(79,124,116,0.2)]",
    green: "bg-ts-green/15 text-emerald-600 dark:text-[#34D399] border-ts-green/35 shadow-[0_0_12px_-3px_rgba(16,185,129,0.2)]",
    red: "bg-ts-red/15 text-red-600 dark:text-[#F87171] border-ts-red/35",
    shopee: "bg-[#EE4D2D]/15 text-[#D03816] dark:text-[#FF7E61] border-[#EE4D2D]/35",
    tiktok: "bg-ts-hitam/10 dark:bg-white/10 text-ts-krem dark:text-white border-ts-border dark:border-white/20",
    whatsapp: "bg-[#25D366]/15 text-emerald-600 dark:text-[#4EFA8A] border-[#25D366]/35",
    web: "bg-ts-terracotta/15 text-ts-terracotta dark:text-[#E2885E] border-ts-terracotta/35",
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold border backdrop-blur-md ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}

