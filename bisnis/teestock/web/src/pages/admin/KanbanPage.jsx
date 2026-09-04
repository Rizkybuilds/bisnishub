import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Inbox, 
  Printer, 
  Flame, 
  PackageCheck, 
  Truck 
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { KanbanColumn } from '../../components/admin/KanbanColumn';

export function KanbanPage() {
  const { openNewOrderModal } = useOutletContext();
  const { orders, advanceOrderStatus } = useAdmin();

  const columns = [
    { id: 'pending', title: 'Order Masuk', icon: Inbox, colorClass: 'text-ts-mustard' },
    { id: 'dtf', title: 'Cetak DTF', icon: Printer, colorClass: 'text-ts-teal' },
    { id: 'press', title: 'Siap Press', icon: Flame, colorClass: 'text-ts-terracotta' },
    { id: 'pack', title: 'Packing & QC', icon: PackageCheck, colorClass: 'text-ts-olive' },
    { id: 'shipped', title: 'Selesai / Kirim', icon: Truck, colorClass: 'text-ts-green' }
  ];

  return (
    <div className="flex flex-col h-full min-w-0">
      <AdminTopbar
        title="Antrean Order & Produksi Kanban"
        subtitle="Lacak alur pesanan dari Shopee, TikTok, WA, dan Toko Web sampai siap kirim"
        onNewOrder={openNewOrderModal}
      />

      {/* Kanban Board */}
      <div className="p-8 overflow-x-auto flex-1 flex gap-5 items-start">
        {columns.map((col, idx) => {
          const colOrders = orders.filter(o => o.status === col.id);
          return (
            <KanbanColumn
              key={col.id}
              title={col.title}
              icon={col.icon}
              status={col.id}
              statusIndex={idx}
              totalStatuses={columns.length}
              colorClass={col.colorClass}
              orders={colOrders}
              onMove={advanceOrderStatus}
            />
          );
        })}
      </div>
    </div>
  );
}
