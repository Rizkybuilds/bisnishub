import React from 'react';

/**
 * Official TeeStock Brand Logo Component
 * Renders the curated Folded T-Shirt Stack ('The Stock') mark & typography
 */
export function TeeStockLogoIcon({ className = "w-6 h-6", color = "currentColor" }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      stroke={color} 
      strokeWidth="4.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      {/* Crew Neck Collar */}
      <path d="M 38 25 C 43 32, 57 32, 62 25" />
      <path d="M 38 25 C 44 22, 56 22, 62 25" />
      
      {/* Outer T-Shirt Silhouette: Shoulders, Sleeves & Torso */}
      <path d="M 38 25 L 26 29 L 20 44 L 28 48 L 30 38 L 26 56" />
      <path d="M 62 25 L 74 29 L 80 44 L 72 48 L 70 38 L 74 56" />

      {/* Stacked Folds (The Stock) */}
      {/* Layer 1 */}
      <path d="M 26 56 C 24 57, 24 62, 27 63 L 73 63 C 76 62, 76 57, 74 56" />
      {/* Layer 2 */}
      <path d="M 27 63 C 24 64, 24 69, 27 70 L 73 70 C 76 69, 76 64, 73 63" />
      {/* Layer 3 (Base Fold) */}
      <path d="M 27 70 C 24 71, 24 77, 28 78 L 72 78 C 76 77, 76 71, 73 70" />
    </svg>
  );
}

export function TeeStockLogo({ 
  size = "md", 
  variant = "full", 
  className = "",
  badge = "APPAREL",
  glow = true
}) {
  const sizeMap = {
    sm: { box: "w-7 h-7", icon: "w-4.5 h-4.5", title: "text-sm", sub: "text-[8px]" },
    md: { box: "w-8 h-8 sm:w-9 sm:h-9", icon: "w-5 h-5 sm:w-6 sm:h-6", title: "text-base sm:text-lg", sub: "text-[9px] sm:text-[10px]" },
    lg: { box: "w-12 h-12", icon: "w-8 h-8", title: "text-xl sm:text-2xl", sub: "text-xs" },
    xl: { box: "w-16 h-16 sm:w-20 sm:h-20", icon: "w-10 h-10 sm:w-12 sm:h-12", title: "text-2xl sm:text-3xl", sub: "text-xs sm:text-sm" },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 group ${className}`}>
      {/* Icon Emblem Box */}
      <div className={`relative ${currentSize.box} rounded-xl bg-gradient-to-br from-ts-terracotta to-[#9E3B1B] flex items-center justify-center text-white border border-white/20 transition-transform duration-300 group-hover:scale-105 shadow-glow-terracotta shrink-0`}>
        <TeeStockLogoIcon className={`${currentSize.icon} text-white drop-shadow-sm`} />
        {glow && (
          <div className="absolute -inset-0.5 rounded-xl bg-ts-terracotta/30 blur-sm -z-10 group-hover:opacity-100 transition-opacity" />
        )}
      </div>

      {/* Typography Wordmark (if not mark-only) */}
      {variant !== 'mark' && (
        <div>
          <span className={`${currentSize.title} font-extrabold tracking-tight text-ts-krem group-hover:text-white transition-colors block leading-tight`}>
            TeeStock
          </span>
          <span className={`${currentSize.sub} font-bold text-ts-terracotta tracking-widest uppercase font-mono block -mt-0.5`}>
            {badge}
          </span>
        </div>
      )}
    </div>
  );
}
