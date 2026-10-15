import React from 'react';

export interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  eyebrow,
  badge,
  actions,
  className = '',
}: PageHeaderProps) {
  return (
    <div className={`ui-page-header ${className}`.trim()}>
      {eyebrow && <div className="ui-page-header-eyebrow">{eyebrow}</div>}
      <div className="ui-page-header-top">
        <div className="ui-page-header-title-row">
          <h1 className="ui-page-header-title">{title}</h1>
          {badge}
        </div>
        {actions && <div className="ui-page-header-actions">{actions}</div>}
      </div>
      {description && (
        <p className="ui-page-header-description">{description}</p>
      )}
    </div>
  );
}
