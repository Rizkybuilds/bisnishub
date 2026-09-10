import React, { useState, useEffect, useMemo } from 'react';
import { Target, Zap, DollarSign, TrendingUp, CheckCircle, Award, Sparkles, ChevronRight, HelpCircle } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';

const STORAGE_KEY = 'teestock_founder_bep_config';

export function FounderBepSimulator({ orders = [] }) {
  // Config state
  const [fixedCost, setFixedCost] = useState(500000); // Listrik studio, internet, tools
  const [founderSalaryTarget, setFounderSalaryTarget] = useState(3500000); // Target take-home pay founder
  const [netMarginPerShirt, setNetMarginPerShirt] = useState(35000); // Margin bersih rata-rata per kaos grafis
  const [isEditing, setIsEditing] = useState(false);

  // Load saved preferences
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fixedCost) setFixedCost(Number(parsed.fixedCost));
        if (parsed.founderSalaryTarget) setFounderSalaryTarget(Number(parsed.founderSalaryTarget));
        if (parsed.netMarginPerShirt) setNetMarginPerShirt(Number(parsed.netMarginPerShirt));
      }
    } catch (_) {}
  }, []);

  const saveConfig = (newFixed, newSalary, newMargin) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        fixedCost: newFixed,
        founderSalaryTarget: newSalary,
        netMarginPerShirt: newMargin
      }));
    } catch (_) {}
  };

  // Calculations
  const totalTargetMargin = fixedCost + founderSalaryTarget;
  const bepOperationalPcs = Math.ceil(fixedCost / (netMarginPerShirt || 1));
  const targetMonthlyPcs = Math.ceil(totalTargetMargin / (netMarginPerShirt || 1));
  const targetDailyPcs = (targetMonthlyPcs / 30).toFixed(1);
  const roundedDailyPcs = Math.ceil(targetMonthlyPcs / 30);

  // Real-time monthly sales count
  const currentMonthPcs = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return orders
      .filter(o => {
        if (o.status === 'cancelled') return false;
        const d = new Date(o.date || o.created_at);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, o) => sum + (Number(o.qty) || 1), 0);
  }, [orders]);

  // Progress metrics
  const progressPercent = Math.min(100, Math.round((currentMonthPcs / (targetMonthlyPcs || 1)) * 100));
  const isOperationalBepReached = currentMonthPcs >= bepOperationalPcs;
  const isSalaryGoalReached = currentMonthPcs >= targetMonthlyPcs;
  const surplusPcs = Math.max(0, currentMonthPcs - targetMonthlyPcs);
  const surplusProfit = surplusPcs * netMarginPerShirt;

  return (
    <div className="bg-ts-surface border border-ts-border rounded-2xl p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ts-borderDim">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-ts-terracotta/20 text-ts-terracotta border border-ts-terracotta/30">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-ts-krem">Simulator Target Gaji & BEP Harian Founder</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-ts-mustard/20 text-ts-mustard px-2 py-0.5 rounded border border-ts-mustard/30">
                CFO Intelligence
              </span>
            </div>
            <p className="text-xs text-ts-muted">
              Kalkulasi titik impas biaya studio dan target kaos per hari agar target gaji bulanan founder tercapai.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs font-semibold text-ts-terracotta hover:text-white px-3 py-1.5 rounded-lg border border-ts-terracotta/30 hover:bg-ts-terracotta/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          {isEditing ? 'Selesai Atur' : '⚙️ Sesuaikan Angka'}
        </button>
      </div>

      {/* Edit Config Sliders / Inputs */}
      {isEditing && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-ts-hitam/60 border border-ts-borderDim animate-in fade-in duration-200">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-ts-muted flex items-center justify-between">
              <span>Biaya Tetap Studio (Listrik/Wifi)</span>
              <span className="text-ts-krem font-mono">{formatRupiah(fixedCost)}</span>
            </label>
            <input
              type="range"
              min={200000}
              max={2000000}
              step={50000}
              value={fixedCost}
              onChange={(e) => {
                const val = Number(e.target.value);
                setFixedCost(val);
                saveConfig(val, founderSalaryTarget, netMarginPerShirt);
              }}
              className="w-full accent-ts-terracotta cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-ts-muted flex items-center justify-between">
              <span>Target Gaji Bersih Pribadi</span>
              <span className="text-ts-terracotta font-mono font-bold">{formatRupiah(founderSalaryTarget)}</span>
            </label>
            <input
              type="range"
              min={1000000}
              max={15000000}
              step={250000}
              value={founderSalaryTarget}
              onChange={(e) => {
                const val = Number(e.target.value);
                setFounderSalaryTarget(val);
                saveConfig(fixedCost, val, netMarginPerShirt);
              }}
              className="w-full accent-ts-terracotta cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-ts-muted flex items-center justify-between">
              <span>Margin Bersih Rata-Rata / Kaos</span>
              <span className="text-ts-mustard font-mono">{formatRupiah(netMarginPerShirt)}</span>
            </label>
            <input
              type="range"
              min={20000}
              max={60000}
              step={1000}
              value={netMarginPerShirt}
              onChange={(e) => {
                const val = Number(e.target.value);
                setNetMarginPerShirt(val);
                saveConfig(fixedCost, founderSalaryTarget, val);
              }}
              className="w-full accent-ts-terracotta cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Primary KPI Display Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Target Kaos Harian */}
        <div className="p-4 rounded-xl bg-ts-hitam/50 border border-ts-borderDim relative overflow-hidden">
          <div className="text-[11px] font-semibold text-ts-muted uppercase tracking-wider">Target Jual Harian</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-mono text-3xl font-black text-ts-terracotta">{roundedDailyPcs}</span>
            <span className="text-xs text-ts-muted">pcs / hari</span>
          </div>
          <div className="text-[10px] text-ts-muted mt-1">
            Hitungan matematis: {targetDailyPcs} pcs/hari
          </div>
          <div className="absolute right-3 top-3 text-ts-terracotta/20">
            <Zap className="w-8 h-8" />
          </div>
        </div>

        {/* Card 2: Target Kaos Bulanan */}
        <div className="p-4 rounded-xl bg-ts-hitam/50 border border-ts-borderDim relative overflow-hidden">
          <div className="text-[11px] font-semibold text-ts-muted uppercase tracking-wider">Target Bulanan Total</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-mono text-3xl font-black text-ts-krem">{targetMonthlyPcs}</span>
            <span className="text-xs text-ts-muted">pcs / bulan</span>
          </div>
          <div className="text-[10px] text-ts-muted mt-1">
            Target margin: {formatRupiah(totalTargetMargin)}
          </div>
          <div className="absolute right-3 top-3 text-ts-krem/15">
            <Target className="w-8 h-8" />
          </div>
        </div>

        {/* Card 3: BEP Operasional Studio */}
        <div className="p-4 rounded-xl bg-ts-hitam/50 border border-ts-borderDim relative overflow-hidden">
          <div className="text-[11px] font-semibold text-ts-muted uppercase tracking-wider">BEP Operasional Saja</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-mono text-3xl font-black text-ts-mustard">{bepOperationalPcs}</span>
            <span className="text-xs text-ts-muted">pcs / bulan</span>
          </div>
          <div className="text-[10px] text-ts-muted mt-1 flex items-center gap-1">
            {isOperationalBepReached ? (
              <span className="text-ts-green font-bold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Listrik & Wifi Aman!
              </span>
            ) : (
              <span className="text-ts-mustard">
                Butuh {Math.max(0, bepOperationalPcs - currentMonthPcs)} pcs lagi untuk tutup biaya
              </span>
            )}
          </div>
          <div className="absolute right-3 top-3 text-ts-mustard/15">
            <DollarSign className="w-8 h-8" />
          </div>
        </div>

        {/* Card 4: Realisasi Bulan Ini */}
        <div className="p-4 rounded-xl bg-ts-hitam/50 border border-ts-borderDim relative overflow-hidden">
          <div className="text-[11px] font-semibold text-ts-muted uppercase tracking-wider">Terjual Bulan Ini</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-mono text-3xl font-black text-white">{currentMonthPcs}</span>
            <span className="text-xs text-ts-muted">pcs ({progressPercent}%)</span>
          </div>
          <div className="text-[10px] text-ts-muted mt-1">
            {isSalaryGoalReached ? (
              <span className="text-ts-green font-bold">
                🎉 Gaji Rp {Number(founderSalaryTarget / 1000000).toFixed(1)}jt Tercapai! (+{surplusPcs} pcs bonus)
              </span>
            ) : (
              <span>Kurang {Math.max(0, targetMonthlyPcs - currentMonthPcs)} pcs menuju target gaji</span>
            )}
          </div>
          <div className="absolute right-3 top-3 text-white/10">
            <TrendingUp className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Progress Bar & Visual Milestone */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-ts-muted font-medium">Progres Menuju Gaji Founder Penuh:</span>
          <span className="font-mono font-bold text-ts-terracotta">{progressPercent}%</span>
        </div>

        <div className="h-3 w-full bg-ts-hitam rounded-full overflow-hidden border border-ts-borderDim p-0.5 flex">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isSalaryGoalReached
                ? 'bg-gradient-to-r from-ts-mustard via-ts-terracotta to-ts-green'
                : isOperationalBepReached
                  ? 'bg-gradient-to-r from-ts-mustard to-ts-terracotta'
                  : 'bg-ts-mustard'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Milestones Markers */}
        <div className="flex justify-between text-[10px] text-ts-muted font-mono pt-1">
          <span>0 pcs</span>
          <span className={isOperationalBepReached ? 'text-ts-mustard font-bold' : ''}>
            BEP Listrik ({bepOperationalPcs} pcs)
          </span>
          <span className={isSalaryGoalReached ? 'text-ts-green font-bold' : ''}>
            Target Gaji ({targetMonthlyPcs} pcs)
          </span>
        </div>
      </div>

      {/* Actionable Executive Takeaway */}
      <div className="p-3.5 rounded-xl bg-ts-terracotta/10 border border-ts-terracotta/20 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-ts-terracotta shrink-0" />
          <span className="text-ts-krem">
            <strong>Fokus Harian Founder:</strong> Cukup pastikan rata-rata <strong className="text-ts-terracotta underline font-mono">{roundedDailyPcs} kaos</strong> terjual setiap hari, maka seluruh tagihan operasional studio lunas dan Anda mengantongi gaji bersih <strong className="text-white font-mono">{formatRupiah(founderSalaryTarget)}</strong> setiap akhir bulan!
          </span>
        </div>
      </div>
    </div>
  );
}
