import React from 'react';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`ui-empty-state ${className}`.trim()}>
      {icon && <div className="ui-empty-state-icon">{icon}</div>}
      <h4 className="ui-empty-state-title">{title}</h4>
      {description && (
        <p className="ui-empty-state-description">{description}</p>
      )}
      {action && <div style={{ marginTop: '4px' }}>{action}</div>}
    </div>
  );
}
