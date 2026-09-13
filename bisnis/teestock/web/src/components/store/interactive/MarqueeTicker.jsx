import React from 'react';
import { Sparkles, Flame, ShieldCheck, Zap, Layers, Truck } from 'lucide-react';

const DEFAULT_ITEMS = [
  { icon: Flame, text: 'DROP #01 LIVE // RAW IDENTITY', highlight: true },
  { icon: ShieldCheck, text: '100% NSA HEAVYWEIGHT 24S (180 GSM)' },
  { icon: Zap, text: 'STUDIO HEAT PRESS 155°C IN-HOUSE' },
  { icon: Layers, text: '0 JAHITAN SAMPING // TUBULAR KNIT' },
  { icon: Sparkles, text: 'CUSTOM SABLON SATUAN TANPA MINIMAL ORDER' },
  { icon: ShieldCheck, text: 'GARANSI 100% RETUR PRODUKSI & SIZE' },
];

export function MarqueeTicker({ 
  items = DEFAULT_ITEMS, 
  reverse = false, 
  speedClass = 'animate-marquee',
  speed = null,
  className = '' 
}) {
  const displayItems = [...items, ...items, ...items, ...items];

  return (
    <div 
      className={`relative w-full overflow-hidden border-y border-ts-border bg-ts-surface/70 backdrop-blur-md py-2.5 sm:py-3 select-none group ${className}`}
      aria-label="TeeStock Ticker Promo & Kualitas"
    >
      {/* Left/Right Edge Fades */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-ts-hitam to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-ts-hitam to-transparent z-10 pointer-events-none" />

      {/* Track */}
      <div 
        className={`flex items-center gap-6 sm:gap-8 whitespace-nowrap will-change-transform ${reverse ? 'animate-marquee-reverse' : speedClass} group-hover:[animation-play-state:paused]`}
        style={speed ? { animationDuration: `${speed}s` } : undefined}
      >
        {displayItems.map((item, idx) => {
          const text = typeof item === 'string' ? item : (item.text || '');
          const IconComponent = (typeof item === 'object' && item.icon) ? item.icon : Sparkles;
          const isHighlight = typeof item === 'object' ? Boolean(item.highlight) : false;

          return (
            <div 
              key={idx} 
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-bold tracking-wider"
            >
              <span className={`p-1 rounded-md ${
                isHighlight 
                  ? 'bg-ts-terracotta/20 text-ts-terracotta' 
                  : 'bg-ts-surfaceHover text-ts-muted'
              }`}>
                <IconComponent className="w-3.5 h-3.5 shrink-0" />
              </span>
              <span className={isHighlight ? 'text-ts-terracotta font-black' : 'text-ts-krem'}>
                {text}
              </span>
              <span className="text-ts-border mx-2 text-xs opacity-60">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
