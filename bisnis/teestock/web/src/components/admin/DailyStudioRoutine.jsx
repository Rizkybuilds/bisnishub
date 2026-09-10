import React, { useState, useEffect } from 'react';
import { Clock, CheckSquare, Square, Flame, PackageCheck, Printer, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';

const ROUTINE_TASKS = [
  {
    id: 'batch_1',
    period: '09:00 - 10:30',
    title: 'Batch 1: Konsolidasi Order & Bahan Baku',
    badge: '🌅 Pagi',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    items: [
      { id: 't1_1', text: 'Cek pesanan masuk baru di Kanban & filter yang butuh cetak DTF' },
      { id: 't1_2', text: 'Periksa ketersediaan kaos New States Apparel (tarik distributor jika kurang)' },
      { id: 't1_3', text: 'Susun gang sheet roll 58 cm & kirim file 300 DPI ke vendor DTF' }
    ]
  },
  {
    id: 'batch_2',
    period: '13:30 - 15:30',
    title: 'Batch 2: Produksi Heat Press In-House (155°C)',
    badge: '☀️ Siang',
    badgeColor: 'bg-ts-terracotta/20 text-ts-terracotta border-ts-terracotta/30',
    items: [
      { id: 't2_1', text: 'Ambil film DTF dari vendor (cek ketajaman warna & kehalusan serbuk lem)' },
      { id: 't2_2', text: 'Panaskan mesin Heat Press ke suhu standar 155°C (tunggu stabil 15 menit)' },
      { id: 't2_3', text: 'Press 1 (15 detik, tekanan 4-5 bar) -> Dinginkan sepenuhnya (Cold Peel)' },
      { id: 't2_4', text: 'Press 2 Finishing (5 detik lapisi teflon sheet untuk mengunci pori katun)' },
      { id: 't2_5', text: 'QC Visual: uji elastisitas sablon & cek kerapian jahitan garmen' }
    ]
  },
  {
    id: 'batch_3',
    period: '16:00 - 17:00',
    title: 'Batch 3: Packing Polymailer & Pickup Kurir',
    badge: '🌆 Sore',
    badgeColor: 'bg-ts-teal/20 text-teal-300 border-ts-teal/30',
    items: [
      { id: 't3_1', text: 'Lipat kaos rapi, selipkan Care Card A6 + stiker unboxing bonus' },
      { id: 't3_2', text: 'Masukkan ke polymailer tebal & cetak label resi thermal A6 (100x150 mm)' },
      { id: 't3_3', text: 'Serahkan paket ke kurir ekspedisi (J&T / SiCepat / JNE)' },
      { id: 't3_4', text: 'Pindahkan status ke "Selesai/Kirim" di Kanban & kirim update WhatsApp resi' }
    ]
  }
];

export function DailyStudioRoutine() {
  const todayKey = `teestock_routine_${new Date().toISOString().slice(0, 10)}`;
  const [completedMap, setCompletedMap] = useState({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(todayKey);
      if (saved) {
        setCompletedMap(JSON.parse(saved));
      }
    } catch (_) {}
  }, [todayKey]);

  const toggleTask = (taskId) => {
    const updated = {
      ...completedMap,
      [taskId]: !completedMap[taskId]
    };
    setCompletedMap(updated);
    try {
      localStorage.setItem(todayKey, JSON.stringify(updated));
    } catch (_) {}
  };

  const handleReset = () => {
    if (window.confirm('Reset seluruh checklist rutinitas hari ini?')) {
      setCompletedMap({});
      try {
        localStorage.removeItem(todayKey);
      } catch (_) {}
    }
  };

  const allTaskIds = ROUTINE_TASKS.flatMap(b => b.items.map(it => it.id));
  const totalTasks = allTaskIds.length;
  const completedCount = allTaskIds.filter(id => !!completedMap[id]).length;
  const progress = Math.round((completedCount / totalTasks) * 100);

  return (
    <div className="bg-ts-surface border border-ts-border rounded-2xl p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ts-borderDim">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-ts-olive/20 text-ts-olive border border-ts-olive/30">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-ts-krem">SOP Rutinitas Studio Harian (Batching Time-Block)</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-ts-olive/20 text-ts-olive px-2 py-0.5 rounded border border-ts-olive/30">
                COO Workflow
              </span>
            </div>
            <p className="text-xs text-ts-muted">
              Cetak dan press kaos secara masal per batch untuk menghemat daya listrik dan mencegah burnout.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span className="text-xs font-mono text-ts-muted">
            {completedCount} / {totalTasks} selesai ({progress}%)
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] text-ts-muted hover:text-white px-2.5 py-1 rounded bg-ts-hitam/60 border border-ts-borderDim hover:border-ts-muted transition-colors flex items-center gap-1"
            title="Reset checklist untuk hari ini"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Mini Progress */}
      <div className="h-2 w-full bg-ts-hitam rounded-full overflow-hidden border border-ts-borderDim">
        <div
          className="h-full bg-gradient-to-r from-ts-olive via-ts-terracotta to-ts-green transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Time-Block Batches */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {ROUTINE_TASKS.map((batch) => {
          const batchDoneCount = batch.items.filter(it => !!completedMap[it.id]).length;
          const isBatchComplete = batchDoneCount === batch.items.length;

          return (
            <div
              key={batch.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                isBatchComplete
                  ? 'bg-ts-green/5 border-ts-green/30'
                  : 'bg-ts-hitam/40 border-ts-borderDim'
              }`}
            >
              <div className="space-y-3">
                {/* Batch Header */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${batch.badgeColor}`}>
                    {batch.badge} {batch.period}
                  </span>
                  {isBatchComplete && (
                    <span className="text-ts-green text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-ts-krem line-clamp-2">
                  {batch.title}
                </h4>

                {/* Checklist items */}
                <div className="space-y-2 pt-1">
                  {batch.items.map((item) => {
                    const isChecked = !!completedMap[item.id];
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleTask(item.id)}
                        className="flex items-start gap-2 text-left w-full group cursor-pointer"
                      >
                        <span className="mt-0.5 text-ts-muted group-hover:text-ts-terracotta transition-colors shrink-0">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-ts-green" />
                          ) : (
                            <Square className="w-4 h-4 text-ts-borderDim group-hover:text-ts-muted" />
                          )}
                        </span>
                        <span className={`text-[11px] leading-snug transition-all ${
                          isChecked ? 'line-through text-ts-muted/60' : 'text-ts-krem/90 group-hover:text-white'
                        }`}>
                          {item.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Heat Press Parameters Quick Reminder (for Batch 2) */}
              {batch.id === 'batch_2' && (
                <div className="mt-4 pt-3 border-t border-ts-borderDim/50 text-[10px] font-mono text-ts-muted flex items-center justify-between">
                  <span className="flex items-center gap-1 text-ts-terracotta font-bold">
                    <Flame className="w-3 h-3 text-ts-terracotta" /> 155°C
                  </span>
                  <span>Press 1: 15s</span>
                  <span>Cold Peel</span>
                  <span>Press 2: 5s</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
