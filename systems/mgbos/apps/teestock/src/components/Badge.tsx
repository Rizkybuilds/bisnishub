import type { ReactNode } from 'react';

export interface BadgeProps {
  variant?: 'active' | 'unavailable' | 'notice';
  children: ReactNode;
  className?: string;
}

export function Badge({
  variant = 'active',
  children,
  className = '',
}: BadgeProps) {
  const variantClass = {
    active: 'badge-active',
    unavailable: 'badge-unavailable',
    notice: 'badge-notice',
  }[variant];

  return (
    <span className={`badge ${variantClass} ${className}`.trim()}>
      {children}
    </span>
  );
}
