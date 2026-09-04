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
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ts-hitam active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2.5",
  };

  const variantStyles = {
    primary: "bg-ts-terracotta hover:bg-ts-terracotta/90 text-white focus:ring-ts-terracotta shadow-sm",
    secondary: "bg-ts-surface hover:bg-ts-surfaceHover text-ts-krem border border-ts-border focus:ring-ts-border",
    cream: "bg-ts-krem hover:bg-white text-ts-hitam focus:ring-ts-krem font-bold",
    outline: "bg-transparent hover:bg-ts-surface text-ts-krem border border-ts-border hover:border-ts-muted",
    danger: "bg-ts-red hover:bg-ts-red/90 text-white focus:ring-ts-red",
    ghost: "bg-transparent hover:bg-ts-surface text-ts-krem/80 hover:text-white",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </button>
  );
}
