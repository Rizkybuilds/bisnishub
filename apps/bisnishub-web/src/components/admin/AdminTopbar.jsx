import React from 'react';
import { Plus, Lock } from 'lucide-react';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../common/ThemeToggle';

export function AdminTopbar({ title, subtitle, onNewOrder, onNewDesign }) {
  return (
    <header className="h-16 px-4 sm:px-8 border-b border-white/[0.08] bg-[#09090B]/90 backdrop-blur-2xl sticky top-0 z-30 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-black text-white tracking-tight uppercase">{title}</h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>Studio Live</span>
            </span>
          </div>
          {subtitle && <p className="text-[11px] text-zinc-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle compact={true} />
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent('bisnishub_lock_os'))}
          className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 transition-colors flex items-center gap-1 text-xs"
          title="Kunci Layar BisnisHub OS (Lock)"
        >
          <Lock className="w-3.5 h-3.5" />
          <span className="hidden md:inline text-[11px] font-mono">Kunci OS</span>
        </button>
        {onNewOrder && (
          <Button size="sm" variant="secondary" icon={Plus} onClick={onNewOrder} className="text-xs bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/15 rounded-xl">
            Input Order
          </Button>
        )}
        {onNewDesign && (
          <Button size="sm" variant="primary" icon={Plus} onClick={onNewDesign} className="text-xs bg-white text-zinc-950 hover:bg-zinc-200 font-bold rounded-xl shadow-sm">
            Tambah Desain
          </Button>
        )}
      </div>
    </header>
  );
}
