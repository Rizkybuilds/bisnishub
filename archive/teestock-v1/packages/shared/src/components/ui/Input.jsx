import React, { useId } from 'react';

export function Input({ label, error, helperText, className = '', id, ...props }) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-bold text-ts-krem/90 mb-1.5">
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : (helperText ? helperId : undefined)}
        className={`w-full bg-ts-hitam border ${
          error ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/50' : 'border-ts-border focus:border-ts-terracotta focus:ring-ts-terracotta'
        } rounded-lg px-3 py-2 text-sm text-ts-krem placeholder:text-[#9A968D] focus:outline-none focus:ring-1 transition-colors disabled:opacity-50 ${className}`}
        {...props}
      />
      {helperText && !error && <p id={helperId} className="text-[11px] text-ts-muted mt-1">{helperText}</p>}
      {error && <p id={errorId} role="alert" className="text-[11px] text-red-400 font-medium mt-1 animate-in fade-in duration-200">{error}</p>}
    </div>
  );
}

export function Select({ label, options = [], children, className = '', id, ...props }) {
  const generatedId = useId();
  const selectId = id || generatedId;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-bold text-ts-krem/90 mb-1.5">
          {label}
        </label>
      )}
      <select
        id={selectId}
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
