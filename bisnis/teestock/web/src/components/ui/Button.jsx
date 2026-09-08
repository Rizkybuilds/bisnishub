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
    primary: "bg-[#B35324] hover:bg-[#C1673D] text-white border border-white/15 shadow-sm focus:ring-[#B35324]",
    secondary: "bg-[#151413] hover:bg-[#201E1C] text-ts-krem border border-white/10 hover:border-white/20 focus:ring-white/20",
    cream: "bg-ts-krem hover:bg-white text-ts-hitam focus:ring-ts-krem font-bold shadow-sm",
    outline: "bg-transparent hover:bg-white/[0.04] text-ts-krem border border-white/10 hover:border-white/25 focus:ring-white/20",
    glow: "bg-[#B35324] hover:bg-[#C1673D] text-white font-bold border border-white/20 shadow-sm",
    shopee: "bg-[#EE4D2D] hover:bg-[#EE4D2D]/90 text-white font-bold shadow-sm border border-white/15",
    whatsapp: "bg-[#25D366] hover:bg-[#22bf5b] text-zinc-950 font-bold shadow-sm border border-white/15",
    danger: "bg-ts-red hover:bg-ts-red/90 text-white focus:ring-ts-red shadow-sm",
    ghost: "bg-transparent hover:bg-white/[0.05] text-ts-krem/80 hover:text-white",
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
