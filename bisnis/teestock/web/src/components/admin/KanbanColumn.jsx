import React from 'react';
import { KanbanCard } from './KanbanCard';

export function KanbanColumn({
  title,
  icon: Icon,
  status,
  statusIndex,
  totalStatuses,
  colorClass,
  orders = [],
  onMove
}) {
  return (
    <div className="flex-1 min-w-[280px] max-w-[340px] bg-ts-surface border border-ts-border rounded-2xl flex flex-col max-h-[calc(100vh-140px)]">
      {/* Column Header */}
      <div className="p-4 border-b border-ts-borderDim flex items-center justify-between bg-ts-hitam/30 rounded-t-2xl">
        <div className="flex items-center gap-2">
          {Icon && <Icon className={`w-4 h-4 ${colorClass}`} />}
          <h3 className="text-xs font-bold text-ts-krem uppercase tracking-wider">{title}</h3>
        </div>
        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-ts-hitam border border-ts-border text-ts-krem">
          {orders.length}
        </span>
      </div>

      {/* Cards Scroll Area */}
      <div className="p-3 overflow-y-auto flex-1 space-y-3">
        {orders.length === 0 ? (
          <div className="py-12 text-center text-xs text-ts-muted border-2 border-dashed border-ts-borderDim rounded-xl">
            Tidak ada pesanan di tahap ini
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
