import React from 'react';

export function Card({ children, className = '', hover = false, glow = false, ...props }) {
  return (
    <div
      className={`relative bg-ts-surface border border-ts-border rounded-2xl p-5 sm:p-6 transition-all duration-300 shadow-sm ${
        hover ? 'hover:border-ts-borderHover hover:bg-ts-surfaceHover hover:-translate-y-0.5' : ''
      } ${
        glow ? 'border-ts-terracotta/40 shadow-glow-terracotta' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

