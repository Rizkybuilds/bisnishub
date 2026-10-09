import React from 'react';

export interface StatCardProps {
  title: string;
  value: React.ReactNode;
  description?: React.ReactNode;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  badge,
  icon,
  className = '',
}: StatCardProps) {
  return (
    <div className={`ui-stat-card ${className}`.trim()}>
      <div className="ui-stat-card-header">
        <span className="ui-stat-card-title">{title}</span>
        {badge || icon}
      </div>
      <div className="ui-stat-card-value">{value}</div>
      {description && (
        <div className="ui-stat-card-description">{description}</div>
      )}
    </div>
  );
}
