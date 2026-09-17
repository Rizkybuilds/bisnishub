import React from 'react';

/**
 * Official TeeStock Brand Logo Component
 * Renders the authentic Folded Heavyweight T-Shirt Stack ('The Stock') mark & typography
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
      {/* Crewneck Collar: Double Rib Arc */}
      <path d="M 38 16 C 42 18.8, 46 19.8, 50 19.8 C 54 19.8, 58 18.8, 62 16" />
      <path d="M 39 19.5 C 42.5 27, 46 29, 50 29 C 54 29, 57.5 27, 61 19.5" strokeWidth="4" />
      <path d="M 35 23 C 38.5 32, 44 34, 50 34 C 56 34, 61.5 32, 65 23" />

      {/* Shoulders */}
      <path d="M 38 16 L 22 21" />
      <path d="M 62 16 L 78 21" />

      {/* Left Sleeve: Outer Edge & Inward Cuff Hem */}
      <path d="M 22 21 L 13.5 43.5 L 24 48" />
      <path d="M 26.5 31.5 L 26.5 47.5" strokeWidth="3.8" />

      {/* Right Sleeve: Outer Edge & Inward Cuff Hem */}
      <path d="M 78 21 L 86.5 43.5 L 76 48" />
      <path d="M 73.5 31.5 L 73.5 47.5" strokeWidth="3.8" />

      {/* Torso & Fold 1 (Top Fold) */}
      <path d="M 26.5 47.5 C 26.5 53, 23 57, 19.5 60.5 C 17 63, 17 66.5, 20.5 68 L 79.5 68 C 83 66.5, 83 63, 80.5 60.5 C 77 57, 73.5 53, 73.5 47.5" />

      {/* Chest Crease Accent */}
      <path d="M 35 60 C 42 59.2, 58 59.2, 65 60" strokeWidth="3.2" />

      {/* Fold 2 (Middle Pill Fold) */}
      <path d="M 20.5 68 C 17 69.8, 17 74.2, 20.5 76 L 79.5 76 C 83 74.2, 83 69.8, 79.5 68" />

      {/* Fold 3 (Base Pill Fold) */}
      <path d="M 20.5 76 C 17 78, 17 83, 21.5 84.5 C 26 85.8, 40 85, 50 85 C 60 85, 74 85.8, 78.5 84.5 C 83 83, 83 78, 79.5 76" />
    </svg>
  );
}

export function TeeStockLogo({ 
  size = "md", 
  variant = "full", 
  className = "",
  badge = "RETAIL APPAREL HOUSE",
  glow = true
}) {
  const sizeMap = {
    sm: { box: "w-7 h-7", icon: "w-4.5 h-4.5", title: "text-sm", sub: "text-[7px]" },
    md: { box: "w-8 h-8 sm:w-9 sm:h-9", icon: "w-5 h-5 sm:w-6 sm:h-6", title: "text-base sm:text-lg", sub: "text-[8px] sm:text-[9px]" },
    lg: { box: "w-12 h-12", icon: "w-8 h-8", title: "text-xl sm:text-2xl", sub: "text-[10px] sm:text-xs" },
    xl: { box: "w-16 h-16 sm:w-20 sm:h-20", icon: "w-10 h-10 sm:w-12 sm:h-12", title: "text-2xl sm:text-3xl", sub: "text-xs sm:text-sm" },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 group ${className}`}>
      {/* Icon Emblem Box */}
      <div className={`relative ${currentSize.box} rounded-xl bg-gradient-to-br from-ts-terracotta to-[#A84323] flex items-center justify-center text-white border border-white/15 transition-transform duration-300 group-hover:scale-105 shadow-sm shrink-0`}>
        <TeeStockLogoIcon className={`${currentSize.icon} text-white drop-shadow-sm`} />
      </div>

      {/* Typography Wordmark (if not mark-only) */}
      {variant !== 'mark' && (
        <div>
          <span className={`${currentSize.title} font-display font-black tracking-[-0.04em] text-ts-krem group-hover:text-white transition-colors block leading-tight`}>
            TeeStock
          </span>
          <span className={`${currentSize.sub} font-bold text-ts-terracotta tracking-[0.16em] uppercase font-mono block -mt-0.5`}>
            {badge}
          </span>
        </div>
      )}
    </div>
  );
}
