import React from 'react'
import { DollarSign, Truck, Package, Megaphone, HardDrive } from 'lucide-react'

export type TabId = 'treasury' | 'vendors' | 'orders' | 'marketing' | 'storage'

interface NavigationProps {
  activeTab: TabId
  onSelectTab: (tab: TabId) => void
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onSelectTab }) => {
  const navItems: { id: TabId; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'treasury', label: 'Kas & HPP', icon: DollarSign, badge: 'CFO' },
    { id: 'vendors', label: 'Vendor & Maklon', icon: Truck, badge: 'COO' },
    { id: 'orders', label: 'Alur Pesanan', icon: Package, badge: 'Ops' },
    { id: 'marketing', label: 'Marketing Hub', icon: Megaphone, badge: 'CMO' },
    { id: 'storage', label: 'External SSD', icon: HardDrive, badge: '1TB' },
  ]

  return (
    <>
      {/* Desktop Horizontal Tabs */}
      <div className="hidden md:flex items-center gap-2 border-b border-hub-border bg-hub-card/40 px-6 py-2.5">
        <div className="mx-auto flex max-w-7xl w-full items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-hub-card text-white border border-hub-border shadow-md shadow-black/20 border-b-teestock border-b-2'
                    : 'text-hub-muted hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-teestock' : 'text-hub-muted'}`} />
                <span>{item.label}</span>
                <span className="rounded-md bg-hub-border/60 px-1.5 py-0.5 text-[10px] font-mono text-hub-muted">
                  {item.badge}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Mobile Bottom Bar (Thumb friendly > 44px touch targets) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-hub-border bg-hub-bg/95 backdrop-blur-lg px-2 py-1.5">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all min-h-[48px] ${
                  isActive
                    ? 'text-teestock font-semibold bg-teestock/10'
                    : 'text-hub-muted hover:text-slate-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] mt-1 tracking-tight truncate max-w-full">
                  {item.id === 'treasury' ? 'Kas/HPP' : item.id === 'vendors' ? 'Vendor' : item.id === 'orders' ? 'Pesanan' : item.id === 'marketing' ? 'Konten' : 'SSD 1TB'}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
