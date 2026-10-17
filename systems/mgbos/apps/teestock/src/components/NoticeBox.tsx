import type { ReactNode } from 'react';

export interface NoticeBoxProps {
  variant?: 'warning' | 'info';
  title?: string;
  children: ReactNode;
  className?: string;
  role?: string;
}

export function NoticeBox({
  variant = 'info',
  title,
  children,
  className = '',
  role = 'status',
}: NoticeBoxProps) {
  const variantClass =
    variant === 'warning' ? 'notice-box-warning' : 'notice-box-info';

  return (
    <div
      className={`notice-box ${variantClass} ${className}`.trim()}
      role={role}
    >
      {title && <span className="notice-title">{title}</span>}
      {children}
    </div>
  );
}
