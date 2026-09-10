import React from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export function AdminTopbar({ title, subtitle, onNewOrder, onNewDesign }) {
  return (
    <header className="h-16 px-4 sm:px-8 border-b border-white/[0.08] bg-ts-surface/95 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-black text-white tracking-tight uppercase">{title}</h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[9px] font-mono text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Studio Live</span>
            </span>
          </div>
          {subtitle && <p className="text-[11px] text-ts-kremMuted mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {onNewOrder && (
          <Button size="sm" variant="secondary" icon={Plus} onClick={onNewOrder} className="text-xs">
            Input Order
          </Button>
        )}
        {onNewDesign && (
          <Button size="sm" variant="primary" icon={Plus} onClick={onNewDesign} className="text-xs shadow-glow-terracotta-sm">
            Tambah Desain
          </Button>
        )}
      </div>
    </header>
  );
}
