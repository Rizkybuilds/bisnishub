import React from 'react';

export function Input({ label, error, helperText, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-bold text-ts-krem/90 mb-1.5">{label}</label>}
      <input
        className={`w-full bg-ts-hitam border border-ts-border rounded-lg px-3 py-2 text-sm text-ts-krem placeholder:text-ts-muted/60 focus:outline-none focus:border-ts-terracotta focus:ring-1 focus:ring-ts-terracotta transition-colors disabled:opacity-50 ${className}`}
        {...props}
      />
      {helperText && !error && <p className="text-[11px] text-ts-muted mt-1">{helperText}</p>}
      {error && <p className="text-[11px] text-ts-red mt-1">{error}</p>}
    </div>
  );
}

export function Select({ label, options = [], children, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-bold text-ts-krem/90 mb-1.5">{label}</label>}
      <select
        className={`w-full bg-ts-hitam border border-ts-border rounded-lg px-3 py-2 text-sm text-ts-krem focus:outline-none focus:border-ts-terracotta focus:ring-1 focus:ring-ts-terracotta transition-colors ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
        {children}
      </select>
    </div>
  );
}
