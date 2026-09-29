import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  disabled = false,
  ...props
}) {
  const baseStyles = "relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ts-hitam active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer overflow-hidden";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4.5 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };

  const variantStyles = {
    primary: "bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 border border-zinc-950 dark:border-white font-bold shadow-sm focus:ring-zinc-400 dark:focus:ring-white",
    terracotta: "bg-ts-terracotta hover:bg-ts-terracotta/90 text-white border border-ts-terracotta shadow-sm focus:ring-ts-terracotta",
    secondary: "bg-ts-surface hover:bg-ts-surfaceHover text-ts-krem border border-ts-border hover:border-ts-borderHover focus:ring-ts-border shadow-sm",
    cream: "bg-ts-krem hover:opacity-90 text-ts-hitam focus:ring-ts-krem font-bold shadow-sm",
    outline: "bg-transparent hover:bg-ts-surfaceHover text-ts-krem border border-ts-border hover:border-ts-borderHover focus:ring-ts-border",
    glow: "bg-white hover:bg-zinc-100 text-zinc-950 font-bold border border-white shadow-glow-white",
    shopee: "bg-[#EE4D2D] hover:bg-[#EE4D2D]/90 text-white font-bold shadow-sm border border-[#EE4D2D]",
    whatsapp: "bg-[#25D366] hover:bg-[#22bf5b] text-zinc-950 font-bold shadow-sm border border-[#25D366]",
    danger: "bg-ts-red hover:bg-ts-red/90 text-white focus:ring-ts-red shadow-sm",
    ghost: "bg-transparent hover:bg-ts-surfaceHover text-ts-kremMuted hover:text-ts-krem",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />}
      <span>{children}</span>
    </button>
  );
}
