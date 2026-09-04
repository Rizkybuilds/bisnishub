import React from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export function AdminTopbar({ title, subtitle, onNewOrder, onNewDesign }) {
  return (
    <header className="h-16 px-8 border-b border-ts-border bg-ts-surface/90 backdrop-blur sticky top-0 z-30 flex items-center justify-between">
      <div>
        <h1 className="text-lg font-extrabold text-ts-krem tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-ts-muted">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {onNewOrder && (
          <Button size="sm" variant="secondary" icon={Plus} onClick={onNewOrder}>
            Input Order
          </Button>
        )}
        {onNewDesign && (
          <Button size="sm" variant="primary" icon={Plus} onClick={onNewDesign}>
            Tambah Desain
          </Button>
        )}
      </div>
    </header>
  );
}
