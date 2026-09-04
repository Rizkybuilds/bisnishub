import React from 'react';

export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`bg-ts-surface border border-ts-border rounded-xl p-5 transition-all ${
        hover ? 'hover:border-ts-muted/60 hover:bg-ts-surfaceHover/80' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between pb-4 border-b border-ts-borderDim mb-4 ${className}`}>
      <div>
        <h3 className="text-base font-bold text-ts-krem">{title}</h3>
        {subtitle && <p className="text-xs text-ts-muted mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
