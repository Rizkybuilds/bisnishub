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

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between pb-4 border-b border-ts-border mb-4 ${className}`}>
      <div>
        <h3 className="text-base font-bold text-ts-krem tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-ts-muted mt-0.5 leading-relaxed">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

