import React, { useState } from 'react'
import { BusinessId, Order, OrderStage } from '../../types'
import { INITIAL_ORDERS } from '../../mockData'
import { Package, Printer, CheckCircle2, ChevronRight, Clock, Flame, ShieldAlert, ArrowRight } from 'lucide-react'

interface OrdersKanbanModuleProps {
  businessFilter: BusinessId
}

export const OrdersKanbanModule: React.FC<OrdersKanbanModuleProps> = ({ businessFilter }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('bh_orders')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return Array.isArray(parsed) ? parsed.filter((o: Order) => !o.id?.startsWith('ord-10')) : []
      } catch (e) {
        return []
      }
    }
    return []
  })

  const [activePrintOrder, setActivePrintOrder] = useState<Order | null>(null)

  const STAGES: { id: OrderStage; label: string; color: string; desc: string }[] = [
    { id: 'NEW', label: 'Order Baru', color: 'border-sky-500/40 text-sky-400', desc: 'Menunggu penyiapan blank' },
    { id: 'MATERIAL_READY', label: 'Bahan Siap', color: 'border-indigo-500/40 text-indigo-400', desc: 'Kaos NSA siap dipress' },
    { id: 'HEAT_PRESS', label: 'Heat Press 155°C', color: 'border-orange-500/40 text-orange-400', desc: 'In-house press & cold peel' },
    { id: 'QC_PACK', label: 'QC & Kemas', color: 'border-emerald-500/40 text-emerald-400', desc: 'Kemasan unboxing MultiGraph' },
    { id: 'SHIPPED', label: 'Terkirim', color: 'border-slate-500/40 text-slate-400', desc: 'Resi terbit & diserahkan' }
  ]

  const filteredOrders = orders.filter((o) =>
    businessFilter === 'all' ? true : o.businessId === businessFilter
  )

  const advanceStage = (orderId: string, currentStage: OrderStage) => {
    const stageOrder: OrderStage[] = ['NEW', 'MATERIAL_READY', 'HEAT_PRESS', 'QC_PACK', 'SHIPPED']
    const currentIndex = stageOrder.indexOf(currentStage)
    if (currentIndex < stageOrder.length - 1) {
      const nextStage = stageOrder[currentIndex + 1]
      const updated = orders.map((o) => (o.id === orderId ? { ...o, stage: nextStage } : o))
      setOrders(updated)
      localStorage.setItem('bh_orders', JSON.stringify(updated))
    }
  }

  const handlePrintThermal = (order: Order) => {
    setActivePrintOrder(order)
    setTimeout(() => {
      window.print()
    }, 200)
  }

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hub-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Package className="h-5 w-5 text-teestock" />
            <span>Alur Pesanan & Kanban Fulfillment</span>
          </h2>
          <p className="text-xs text-hub-muted mt-0.5">
            SOP State Machine: Kaos NSA &rarr; Heat Press 155°C &rarr; MultiGraph Unboxing Packaging &rarr; Resi A6
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-hub-muted">
            Total Aktif: <strong className="text-white">{filteredOrders.length} Order</strong>
          </span>
        </div>
      </div>

      {/* Kanban Board Horizontal Scroll */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageOrders = filteredOrders.filter((o) => o.stage === stage.id)

          return (
            <div
              key={stage.id}
              className="flex flex-col rounded-3xl border border-hub-border bg-hub-card/80 p-4 min-w-[260px]"
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between border-b border-hub-border pb-3 mb-3">
                <div>
                  <h3 className={`text-xs font-bold uppercase tracking-wider ${stage.color}`}>
                    {stage.label}
                  </h3>
                  <span className="text-[10px] text-hub-muted block">{stage.desc}</span>
                </div>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-slate-300">
                  {stageOrders.length}
                </span>
              </div>

              {/* Order Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[520px] pr-1">
                {stageOrders.length === 0 ? (
                  <div className="py-8 text-center text-[11px] text-hub-muted/60">
                    Kosong
                  </div>
                ) : (
                  stageOrders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-2xl border border-hub-border bg-hub-bg p-3.5 shadow-sm space-y-3 hover:border-teestock/40 transition-all"
                    >
                      {/* Ref & Business */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-teestock">
                          {order.orderRef}
                        </span>
                        <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {order.businessId}
                        </span>
                      </div>

                      {/* Customer Info */}
                      <div>
                        <h4 className="text-xs font-bold text-white leading-tight">
                          {order.customerName}
                        </h4>
                        <p className="text-[11px] text-hub-muted truncate">
                          {order.shippingAddress}
                        </p>
                      </div>

                      {/* Items */}
                      <div className="rounded-xl bg-hub-card p-2 text-[11px] text-slate-300 space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span className="truncate pr-1">
                              {item.qty}x {item.name} ({item.size})
                            </span>
                            <span className="font-mono text-hub-muted">
                              {formatRupiah(item.price)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Notes if any */}
                      {order.notes && (
                        <div className="rounded-lg bg-orange-500/10 border border-orange-500/20 px-2 py-1 text-[10px] text-orange-300">
                          {order.notes}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center justify-between pt-2 border-t border-hub-border/60 gap-1.5">
                        <button
                          onClick={() => handlePrintThermal(order)}
                          title="Cetak Label Thermal A6"
                          className="flex items-center gap-1 rounded-lg border border-hub-border bg-hub-card px-2 py-1 text-[11px] font-semibold text-slate-300 hover:text-white hover:border-teestock/40 transition-all"
                        >
                          <Printer className="h-3 w-3 text-teestock" />
                          <span>Resi A6</span>
                        </button>

                        {order.stage !== 'SHIPPED' && (
                          <button
                            onClick={() => advanceStage(order.id, order.stage)}
                            className="flex items-center gap-1 rounded-lg bg-teestock/20 border border-teestock/40 px-2.5 py-1 text-[11px] font-bold text-[#F8704A] hover:bg-teestock/30 transition-all active:scale-95"
                          >
                            <span>Lanjut</span>
                            <ChevronRight className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Hidden Printable Thermal Shipping Label A6 (100mm x 150mm) */}
      {activePrintOrder && (
        <div id="thermal-print-container" className="hidden print:block font-sans text-black">
          {/* Header */}
          <div className="border-b-2 border-black pb-2 mb-2 flex justify-between items-start">
            <div>
              <h1 className="text-base font-extrabold tracking-tight">
                {activePrintOrder.businessId === 'teestock'
                  ? 'TEESTOCK RETAIL APPAREL'
                  : 'MULTIGRAPH PRINTING'}
              </h1>
              <p className="text-[9px]">Official Store Delivery & Unboxing Pack</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold font-mono border-2 border-black px-1.5 py-0.5">
                {activePrintOrder.courier.split(' ')[0]}
              </span>
            </div>
          </div>

          {/* Barcode & Ref Placeholder */}
          <div className="text-center my-2 p-1 border border-dashed border-black">
            <div className="h-8 bg-black/10 flex items-center justify-center font-mono text-sm tracking-widest font-bold">
              ||| ||||| |||| |||||||| ||||
            </div>
            <span className="text-[10px] font-mono font-bold block mt-0.5">
              {activePrintOrder.orderRef}
            </span>
          </div>

          {/* Recipient & Sender */}
          <div className="grid grid-cols-2 gap-2 text-[10px] border-b border-black pb-2 mb-2">
            <div>
              <span className="font-bold block text-[9px] uppercase">Penerima:</span>
              <p className="font-bold text-xs">{activePrintOrder.customerName}</p>
              <p className="text-[9px] leading-tight mt-0.5">{activePrintOrder.shippingAddress}</p>
              <p className="font-mono mt-1">Telp: {activePrintOrder.customerPhone}</p>
            </div>
            <div>
              <span className="font-bold block text-[9px] uppercase">Pengirim:</span>
              <p className="font-bold">TeeStock House</p>
              <p className="text-[9px] leading-tight">Jakarta Timur, DKI Jakarta</p>
              <p className="text-[9px] mt-1 text-gray-700">Garansi Tukar Baru 100%</p>
            </div>
          </div>

          {/* Item Checklist */}
          <div className="border-b border-black pb-2 mb-2">
            <span className="font-bold block text-[9px] uppercase mb-1">Daftar Isi Paket:</span>
            {activePrintOrder.items.map((it, idx) => (
              <div key={idx} className="flex justify-between text-[10px] font-mono">
                <span>[ ] {it.qty}x {it.name} ({it.size})</span>
                <span>{formatRupiah(it.price)}</span>
              </div>
            ))}
          </div>

          {/* Unboxing SOP MultiGraph Packaging Checklist */}
          <div className="text-[8px] leading-tight text-gray-800 space-y-0.5">
            <p className="font-bold">Checklist Kemasan Standar MultiGraph:</p>
            <p>[X] Kaos NSA Terlipat Rapi & Scented</p>
            <p>[X] Stiker Vinyl Unboxing Collector Vol #01</p>
            <p>[X] Care Card (Instruksi Cuci Sablon 155°C)</p>
            <p>[X] Polymailer Doff Tertutup Rapat</p>
          </div>
        </div>
      )}
    </div>
  )
}
