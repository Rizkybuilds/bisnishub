import React from 'react'
import { BusinessId } from '../types'
import { BUSINESSES } from '../mockData'
import { Lock, ExternalLink, Sparkles, Building2 } from 'lucide-react'

interface NavbarProps {
  selectedBusiness: BusinessId
  onSelectBusiness: (b: BusinessId) => void
  onLock: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedBusiness,
  onSelectBusiness,
  onLock,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-hub-border bg-hub-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Left Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teestock to-multigraph shadow-lg shadow-teestock/20">
            <span className="font-extrabold text-white text-lg">BH</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight sm:text-lg">
                BisnisHub OS
              </h1>
              <span className="hidden sm:inline-flex items-center rounded-md bg-teestock/15 px-2 py-0.5 text-xs font-semibold text-teestock border border-teestock/30">
                Founder Suite
              </span>
            </div>
            <p className="text-[11px] text-hub-muted hidden sm:block">
              Command Center Multi-Venture (Rizky)
            </p>
          </div>
        </div>

        {/* Center: Business Switcher Pills */}
        <div className="flex items-center overflow-x-auto no-scrollbar gap-1.5 p-1 rounded-2xl bg-hub-card border border-hub-border max-w-[280px] sm:max-w-md">
          {BUSINESSES.map((b) => {
            const isSelected = selectedBusiness === b.id
            return (
              <button
                key={b.id}
                onClick={() => onSelectBusiness(b.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? `${b.badgeBg} border shadow-sm`
                    : 'text-hub-muted hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: b.color }}
                />
                <span className="hidden md:inline">{b.name.split(' ')[0]}</span>
                <span className="md:hidden">{b.id === 'all' ? 'Semua' : b.id.slice(0, 4)}</span>
              </button>
            )
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <a
            href="https://teestockapparel.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-hub-border bg-hub-card px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:border-teestock/50 transition-all"
          >
            <span>TeeStock Store</span>
            <ExternalLink className="h-3 w-3 text-teestock" />
          </a>

          <button
            onClick={onLock}
            title="Kunci Layar (Founder Privacy)"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-hub-border bg-hub-card text-hub-muted hover:text-white hover:border-rose-500/40 transition-all"
          >
            <Lock className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
