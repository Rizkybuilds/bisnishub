import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Package,
  Plus,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const todayMetrics = [
    { label: 'New Leads', value: '4', change: '+2 today', tone: 'emerald' },
    { label: 'Quotes Pending', value: '6', change: 'Rp 42.5M val', tone: 'blue' },
    { label: 'Active Orders', value: '8', change: 'All on track', tone: 'slate' },
    { label: 'Production at Risk', value: '2', change: 'Deadline < 24h', tone: 'amber' },
    { label: 'Payments Due', value: '3', change: 'Rp 14.8M bal', tone: 'rose' },
  ];

  const attentionItems = [
    {
      id: 'TS-Q-2026-0021',
      title: 'Quotation PT Nusantara Indah',
      desc: 'Nilai Rp 6.500.000 — Belum ada follow up selama 3 hari',
      badge: 'Follow-up Due',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
    {
      id: 'TS-ORD-2026-0018',
      title: 'Order 100 Kaos Event BCA',
      desc: 'Deadline kirim besok — Produksi sablon baru 70%',
      badge: 'At Risk',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    },
    {
      id: 'TS-INV-2026-0012',
      title: 'Invoice DP 50% Atelier',
      desc: 'DP Rp 4.500.000 belum diverifikasi — Produksi tertahan',
      badge: 'Waiting Payment',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    },
    {
      id: 'TS-JOB-2026-0034',
      title: 'Job DTF Gang Sheet #12',
      desc: 'Hasil QC posisi print miring 3mm — Rework diperlukan',
      badge: 'QC Rework',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    },
  ];

  const todayTasks = [
    { title: 'Follow-up Budi Santoso (PT ABC) via WhatsApp', category: 'Sales', time: '10:00' },
    { title: 'Konfirmasi kapasitas Vendor DTF Roll 58cm', category: 'Ops', time: '13:00' },
    { title: 'Pre-flight check artwork 300 DPI untuk TS-O-0019', category: 'Pre-Press', time: '14:30' },
    { title: 'Inspeksi QC receiving bahan kain NSA 3600 Black', category: 'QC', time: '16:00' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>FOUNDER COMMAND CENTER v0</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">Selamat Sore, Founder Rizky</h2>
          <p className="text-xs text-slate-400 mt-1">
            Status operasional TeeStock Custom Atelier & MultiGraph Holding terpantau aman dan terkendali.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-900/30 transition-all">
            <Plus className="w-3.5 h-3.5" />
            <span>New Custom Inquiry</span>
          </button>
        </div>
      </div>

      {/* Today's Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {todayMetrics.map((m) => (
          <div key={m.label} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="text-[11px] font-medium text-slate-400 truncate">{m.label}</div>
            <div className="text-2xl font-black text-slate-100 my-1">{m.value}</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{m.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout: Needs Attention & Today's Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Needs Attention Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Needs Attention (Prioritas Operasional)
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">4 items memerlukan aksi</span>
          </div>

          <div className="space-y-2.5">
            {attentionItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 transition-all flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-300">{item.id}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-100">{item.title}</h4>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>

                <button className="flex-shrink-0 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Tasks Column (1 Col) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Today's Action Tasks
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">4/4 pending</span>
          </div>

          <div className="rounded-xl bg-slate-900/80 border border-slate-800/90 divide-y divide-slate-800/80">
            {todayTasks.map((t, idx) => (
              <div key={idx} className="p-3.5 flex items-start gap-3 hover:bg-slate-850/40 transition-colors">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-slate-200 leading-snug">{t.title}</div>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700/60 font-medium">
                      {t.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {t.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pilot Quick Links Box */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs space-y-2">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Package className="w-4 h-4" />
              <span>Pilot Custom Atelier v0.1</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Semua modul di navigasi samping sudah siap menerima integrasi workflow dari Lead sampai Actual Margin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
