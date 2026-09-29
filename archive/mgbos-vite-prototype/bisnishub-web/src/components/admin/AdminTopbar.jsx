import React from 'react';
import { Plus, Lock, Menu, Search } from 'lucide-react';
import { Button } from '@bisnishub/shared/components/ui/Button';
import { ThemeToggle } from '@bisnishub/shared/components/common/ThemeToggle';

export function AdminTopbar({ 
  title, 
  subtitle, 
  onNewOrder, 
  onNewDesign,
  onOpenMobileMenu,
  onOpenCommandPalette
}) {
  const handleOpenMobile = () => {
    if (onOpenMobileMenu) {
      onOpenMobileMenu();
    } else {
      window.dispatchEvent(new CustomEvent('bisnishub_open_mobile_menu'));
    }
  };

  const handleOpenCmd = () => {
    if (onOpenCommandPalette) {
      onOpenCommandPalette();
    } else {
      window.dispatchEvent(new CustomEvent('bisnishub_open_cmd_palette'));
    }
  };

  return (
    <header className="h-16 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] bg-[#09090B]/90 backdrop-blur-2xl sticky top-0 z-30 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={handleOpenMobile}
          className="lg:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/10 transition-colors"
          aria-label="Buka Navigasi BisnisHub"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base lg:text-lg font-black text-white tracking-tight uppercase truncate">
              {title}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>Studio Live</span>
            </span>
          </div>
          {subtitle && (
            <p className="text-[11px] text-zinc-400 mt-0.5 truncate hidden sm:block max-w-md">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Command Palette Trigger Button */}
        <button
          type="button"
          onClick={handleOpenCmd}
          className="hidden sm:flex items-center gap-2 px-3 py-2 min-h-[40px] rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-zinc-400 hover:text-white transition-all group"
          title="Buka Command Palette (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300" />
          <span className="text-zinc-400 group-hover:text-zinc-200 hidden md:inline">Cari perintah...</span>
          <kbd className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 border border-white/10">
            Ctrl K
          </kbd>
        </button>

        {/* Mobile Search Icon Button */}
        <button
          type="button"
          onClick={handleOpenCmd}
          className="sm:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/10 transition-colors"
          title="Cari atau Perintah"
          aria-label="Cari atau Perintah"
        >
          <Search className="w-4 h-4" />
        </button>

        <ThemeToggle compact={true} />

        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent('bisnishub_lock_os'))}
          className="p-2 min-h-[40px] rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 transition-colors flex items-center gap-1.5 text-xs"
          title="Kunci Layar BisnisHub OS (Lock)"
        >
          <Lock className="w-3.5 h-3.5" />
          <span className="hidden lg:inline text-[11px] font-mono">Kunci OS</span>
        </button>

        {onNewOrder && (
          <Button 
            size="sm" 
            variant="secondary" 
            icon={Plus} 
            onClick={onNewOrder} 
            className="text-xs min-h-[40px] bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/15 rounded-xl font-semibold"
          >
            <span className="hidden sm:inline">Input Order</span>
            <span className="sm:hidden">+ Order</span>
          </Button>
        )}

        {onNewDesign && (
          <Button 
            size="sm" 
            variant="primary" 
            icon={Plus} 
            onClick={onNewDesign} 
            className="text-xs min-h-[40px] bg-white text-zinc-950 hover:bg-zinc-200 font-bold rounded-xl shadow-sm"
          >
            <span className="hidden sm:inline">Tambah Desain</span>
            <span className="sm:hidden">+ Desain</span>
          </Button>
        )}
      </div>
    </header>
  );
}
