import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { 
  Shirt, 
  ShoppingBag, 
  Layers, 
  TrendingUp, 
  AlertTriangle, 
  ArrowRight,
  Flame, 
  Printer,
  DollarSign,
  Wallet,
  Coins
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatRupiah } from '../../utils/formatters';
import { SIZES } from '../../constants/garments';

export function DashboardPage() {
  const { openNewOrderModal } = useOutletContext();
  const { catalog, orders, inventory } = useAdmin();

  const activeOrders = orders.filter(o => o.status !== 'shipped');
  const dtfOrders = orders.filter(o => o.status === 'dtf');
  const pressOrders = orders.filter(o => o.status === 'press');

  // Calculate total physical stock
  let totalStock = 0;
  const lowStockItems = [];

  Object.entries(inventory).forEach(([gKey, colData]) => {
    if (gKey === 'supplies') return;
    Object.entries(colData || {}).forEach(([col, szData]) => {
      SIZES.forEach(sz => {
        const count = szData[sz] || 0;
        totalStock += count;
        if (count <= 2) {
          lowStockItems.push({ gKey, col, sz, count });
        }
      });
    });
  });

  // CFO Dynamic Financial Calculations
  const totalGrossRevenue = orders.reduce((sum, o) => sum + (o.price || 0), 0);
  const totalPlatformFees = orders.reduce((sum, o) => {
    if (o.fee !== undefined) return sum + o.fee;
    const isMarketplace = o.channel === 'shopee' || o.channel === 'tiktok';
    return sum + (isMarketplace ? Math.round((o.price || 0) * 0.085) : 0);
  }, 0);

  const totalCogs = orders.reduce((sum, o) => {
    const unitHpp = o.hpp || 64250;
    return sum + (unitHpp * (o.qty || 1));
  }, 0);

  const totalNetProfit = totalGrossRevenue - totalPlatformFees - totalCogs;
  const realizedMarginPct = totalGrossRevenue > 0 
    ? ((totalNetProfit / totalGrossRevenue) * 100).toFixed(1) 
    : 0;

  return (
    <div>
      <AdminTopbar
        title="Dashboard Ringkasan Bisnis"
        subtitle="Monitoring real-time inventori, pesanan aktif, dan antrean heat press"
        onNewOrder={openNewOrderModal}
      />

      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-ts-terracotta/20 text-ts-terracotta flex items-center justify-center shrink-0">
              <Shirt className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-ts-muted font-bold">Total SKU Aktif</div>
              <div className="font-mono text-2xl font-extrabold text-ts-krem mt-0.5">{catalog.length}</div>
              <div className="text-[10px] text-ts-green font-semibold">9 Series Desain</div>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-ts-mustard/20 text-ts-mustard flex items-center justify-center shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-ts-muted font-bold">Pesanan Diproses</div>
              <div className="font-mono text-2xl font-extrabold text-ts-krem mt-0.5">{activeOrders.length}</div>
              <div className="text-[10px] text-ts-mustard font-semibold">{pressOrders.length} Siap Press Heat</div>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-ts-olive/20 text-ts-olive flex items-center justify-center shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-ts-muted font-bold">Stok Kaos NSA (Cititex)</div>
              <div className="font-mono text-2xl font-extrabold text-ts-krem mt-0.5">{totalStock} <span className="text-sm font-normal text-ts-muted">pcs</span></div>
              <div className="text-[10px] text-ts-krem/70 font-semibold">Ready Stock Gudang</div>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-ts-green/20 text-ts-green flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-ts-muted font-bold">Realized Net Margin</div>
              <div className="font-mono text-2xl font-extrabold text-ts-green mt-0.5">{realizedMarginPct}%</div>
              <div className="text-[10px] text-ts-muted font-semibold">Setelah Biaya Fee & COGS</div>
            </div>
          </Card>
        </div>

        {/* CFO Financial Health Breakdown Panel */}
        <div className="bg-ts-surface border border-ts-border rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ts-borderDim pb-3">
            <div>
              <h3 className="text-sm font-bold text-ts-krem flex items-center gap-2">
                <Wallet className="w-4 h-4 text-ts-green" />
                <span>Ringkasan Keuangan Riil (P&amp;L Multi-Channel)</span>
              </h3>
              <p className="text-xs text-ts-muted mt-0.5">
                Kalkulasi otomatis pendapatan kotor, potongan komisi platform, dan modal HPP bahan
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-ts-hitam border border-ts-borderDim text-ts-muted">
                Basis Data: <strong>{orders.length} Pesanan</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-ts-hitam/60 border border-ts-borderDim p-4 rounded-xl space-y-1">
              <div className="text-xs text-ts-muted font-bold">Total Omset Kotor</div>
              <div className="font-mono text-xl font-extrabold text-ts-krem">
                {formatRupiah(totalGrossRevenue)}
              </div>
              <div className="text-[10px] text-ts-muted">Nilai transaksi belanja pembeli</div>
            </div>

            <div className="bg-ts-hitam/60 border border-ts-borderDim p-4 rounded-xl space-y-1">
              <div className="text-xs text-ts-muted font-bold">Potongan Fee E-Commerce</div>
              <div className="font-mono text-xl font-extrabold text-rose-400">
                -{formatRupiah(totalPlatformFees)}
              </div>
              <div className="text-[10px] text-rose-400/80">Shopee &amp; TikTok (Avg 8.5%)</div>
            </div>

            <div className="bg-ts-hitam/60 border border-ts-borderDim p-4 rounded-xl space-y-1">
              <div className="text-xs text-ts-muted font-bold">Total COGS / Modal Bahan</div>
              <div className="font-mono text-xl font-extrabold text-amber-400">
                -{formatRupiah(totalCogs)}
              </div>
              <div className="text-[10px] text-amber-400/80">NSA Cititex + DTF + Packaging</div>
            </div>

            <div className="bg-ts-hitam/60 border border-ts-green/40 p-4 rounded-xl space-y-1 bg-gradient-to-b from-ts-green/5 to-transparent">
              <div className="text-xs text-ts-green font-bold">Laba Bersih Realistis (Kas)</div>
              <div className="font-mono text-xl font-extrabold text-ts-green">
                +{formatRupiah(totalNetProfit)}
              </div>
              <div className="text-[10px] text-ts-green/80 font-bold">Margin Bersih: {realizedMarginPct}%</div>
            </div>
          </div>
        </div>

        {/* Quick Operations Callout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/admin/kanban"
            className="p-5 bg-gradient-to-r from-ts-surface to-ts-surfaceHover border border-ts-border rounded-2xl flex items-center justify-between hover:border-ts-terracotta transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-ts-terracotta/20 text-ts-terracotta flex items-center justify-center">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-ts-krem group-hover:text-ts-terracotta transition-colors">
                  Antrean Heat Press ({pressOrders.length} Pesanan)
                </h4>
                <p className="text-xs text-ts-muted mt-0.5">SOP 155°C, 15 detik, kupas dingin, second press.</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-ts-muted group-hover:text-ts-terracotta group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/admin/gangsheet"
            className="p-5 bg-gradient-to-r from-ts-surface to-ts-surfaceHover border border-ts-border rounded-2xl flex items-center justify-between hover:border-ts-mustard transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-ts-mustard/20 text-ts-mustard flex items-center justify-center">
                <Printer className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-ts-krem group-hover:text-ts-mustard transition-colors">
                  Gang Sheet DTF Planner ({dtfOrders.length} Siap Cetak Roll)
                </h4>
                <p className="text-xs text-ts-muted mt-0.5">Kalkulasi meteran roll 60 cm untuk kirim ke vendor.</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-ts-muted group-hover:text-ts-mustard group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-ts-surface border border-ts-border rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-ts-krem flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-ts-mustard" /> Peringatan Stok Kaos Menipis (Threshold &le; 2 pcs)
            </h3>
            <Link to="/admin/inventory" className="text-xs text-ts-terracotta hover:underline font-semibold">
              Buka Matriks Stok &rarr;
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {lowStockItems.length === 0 ? (
              <span className="text-xs text-ts-green font-semibold">
                ✅ Seluruh kombinasi warna &amp; ukuran kaos polos NSA berada di atas batas aman.
              </span>
            ) : (
              lowStockItems.slice(0, 8).map((item, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-ts-hitam border border-ts-red/40 text-xs flex items-center gap-2"
                >
                  <span className="text-ts-krem/90 font-medium">
                    {item.col} ({item.sz})
                  </span>
                  <span className="font-mono font-bold text-ts-red">
                    {item.count} pcs
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Orders Table with Financial Visibility */}
        <div className="bg-ts-surface border border-ts-border rounded-2xl overflow-hidden shadow-lg">
          <div className="p-5 border-b border-ts-borderDim flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-ts-krem">Pesanan Terbaru &amp; Margin Bersih</h3>
              <p className="text-xs text-ts-muted">Daftar transaksi multi-channel beserta net fee dan estimasi laba</p>
            </div>
            <Button size="sm" variant="secondary" onClick={openNewOrderModal}>
              + Order Manual
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-ts-hitam/60 border-b border-ts-border text-ts-muted font-bold tracking-wider uppercase">
                  <th className="py-3 px-4">No. Order</th>
                  <th className="py-3 px-4">Kanal</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Produk</th>
                  <th className="py-3 px-4">Spesifikasi</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Potongan Fee</th>
                  <th className="py-3 px-4 text-right">Total Transaksi</th>
                  <th className="py-3 px-4 text-right">Laba Bersih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ts-borderDim">
                {orders.slice(0, 8).map(order => {
                  const isMarketplace = order.channel === 'shopee' || order.channel === 'tiktok';
                  const fee = order.fee !== undefined ? order.fee : (isMarketplace ? Math.round((order.price || 0) * 0.085) : 0);
                  const hpp = (order.hpp || 64250) * (order.qty || 1);
                  const net = (order.price || 0) - fee - hpp;

                  return (
                    <tr key={order.id} className="hover:bg-ts-surfaceHover/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-ts-krem">
                        {order.id}
                        {order.trackingNo && (
                          <div className="text-[10px] text-ts-muted font-normal font-mono truncate max-w-[100px]">
                            {order.trackingNo}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={order.channel}>{(order.channel || 'DIRECT').toUpperCase()}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-ts-krem">{order.customer}</div>
                        <div className="text-[11px] text-ts-muted font-mono">{order.phone || '-'}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-ts-krem truncate max-w-[160px]">
                        {order.productName || order.sku}
                      </td>
                      <td className="py-3 px-4 text-ts-muted">
                        {order.garment} • {order.color} ({order.size}) x{order.qty}
                      </td>
                      <td className="py-3 px-4 font-bold text-ts-terracotta capitalize">
                        {order.status}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-rose-400">
                        -{formatRupiah(fee)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-ts-krem">
                        {formatRupiah(order.price)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-extrabold text-ts-green">
                        +{formatRupiah(net)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
