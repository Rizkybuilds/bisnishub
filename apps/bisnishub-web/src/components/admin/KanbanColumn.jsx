import React from 'react';
import { KanbanCard } from './KanbanCard';
import { formatRupiah } from '@bisnishub/shared/utils/formatters';

export function KanbanColumn({
  title,
  icon: Icon,
  status,
  statusIndex,
  totalStatuses,
  colorClass,
  badgeBg,
  orders = [],
  onMove
}) {
  const colTotal = orders.reduce((sum, o) => sum + Number(o.price || o.total_amount || 0), 0);
  const totalPcs = orders.reduce((sum, o) => sum + Number(o.qty || 1), 0);

  return (
    <div className="flex-1 min-w-[300px] max-w-[360px] bg-[#121215] border border-white/[0.08] hover:border-white/[0.14] transition-all duration-200 rounded-2xl flex flex-col max-h-[calc(100vh-170px)] shadow-xl">
      {/* Column Header */}
      <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02] rounded-t-2xl">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl border ${badgeBg || 'bg-white/[0.04] border-white/[0.08]'}`}>
            {Icon && <Icon className={`w-4 h-4 ${colorClass || 'text-white'}`} />}
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">{title}</h3>
            <span className="text-[10px] text-zinc-400 font-mono">
              {formatRupiah(colTotal)} • {totalPcs} pcs
            </span>
          </div>
        </div>
        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-[#09090B] border border-white/[0.1] text-white">
          {orders.length}
        </span>
      </div>

      {/* Cards Scroll Area */}
      <div className="p-3 overflow-y-auto flex-1 space-y-3 custom-scrollbar">
        {orders.length === 0 ? (
          <div className="py-14 text-center text-xs text-zinc-500 border-2 border-dashed border-white/[0.06] rounded-xl flex flex-col items-center justify-center space-y-2 select-none">
            <span className="text-2xl opacity-40">📭</span>
            <span>Tidak ada pesanan di tahap ini</span>
          </div>
        ) : (
          orders.map(order => (
            <KanbanCard
              key={order.id}
              order={order}
              onMove={onMove}
              currentStatusIdx={statusIndex}
              totalStatuses={totalStatuses}
            />
          ))
        )}
      </div>
    </div>
  );
}
