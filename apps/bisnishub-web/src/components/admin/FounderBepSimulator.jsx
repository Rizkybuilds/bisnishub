import React, { useState, useEffect, useMemo } from 'react';
import { Target, Zap, DollarSign, TrendingUp, CheckCircle, Sparkles } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';

const STORAGE_KEY = 'teestock_founder_bep_config';

export function FounderBepSimulator({ orders = [] }) {
  // Config state
  const [fixedCost, setFixedCost] = useState(1000000); // Listrik studio, internet, tools
  const [founderSalaryTarget, setFounderSalaryTarget] = useState(5000000); // Default 5 Jt (Range 1-10 Jt)
  const [netMarginPerShirt, setNetMarginPerShirt] = useState(35000); // Margin bersih rata-rata per kaos grafis
  const [isEditing, setIsEditing] = useState(false);

  // Quick salary presets (1 Jt - 10 Jt)
  const salaryPresets = [1000000, 3000000, 5000000, 7500000, 10000000];

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

  const handleSelectPreset = (val) => {
    setFounderSalaryTarget(val);
    saveConfig(fixedCost, val, netMarginPerShirt);
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
    <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/5 text-white border border-white/10 shrink-0">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-white tracking-tight uppercase">
                Target Gaji Founder &amp; BEP Harian
              </h3>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-white/10 text-white px-2 py-0.5 rounded border border-white/15">
                CFO Engine
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Simulasi target kaos per hari agar target gaji bersih founder (Rp 1–10 Jt) &amp; operasional tercapai.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs font-semibold text-zinc-300 hover:text-white px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all self-start sm:self-auto"
        >
          {isEditing ? 'Selesai Atur' : '⚙️ Sesuaikan Biaya'}
        </button>
      </div>

      {/* Quick Salary Presets (1 - 10 Jt) */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-mono text-zinc-400 font-semibold flex items-center justify-between">
          <span>Pilih Target Gaji Founder (Prive Bersih/Bulan):</span>
          <span className="text-white font-mono font-bold text-xs">{formatRupiah(founderSalaryTarget)} / bulan</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-0.5">
          {salaryPresets.map(preset => (
            <button
              key={preset}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
                founderSalaryTarget === preset
                  ? 'bg-white text-zinc-950 shadow-sm shadow-white/10 border border-white'
                  : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/10'
              }`}
            >
              {preset >= 1000000 ? `Rp ${(preset / 1000000).toFixed(preset % 1000000 === 0 ? 0 : 1)} Jt` : formatRupiah(preset)}
            </button>
          ))}
        </div>
      </div>

      {/* Edit Config Sliders / Inputs */}
      {isEditing && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-black/40 border border-white/[0.08] animate-in fade-in duration-200 text-xs">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-400 flex items-center justify-between">
              <span>Biaya Tetap Studio (Listrik/Wifi)</span>
              <span className="text-white font-mono">{formatRupiah(fixedCost)}</span>
            </label>
            <input
              type="range"
              min={200000}
              max={2500000}
              step={50000}
              value={fixedCost}
              onChange={(e) => {
                const val = Number(e.target.value);
                setFixedCost(val);
                saveConfig(val, founderSalaryTarget, netMarginPerShirt);
              }}
              className="w-full accent-white cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-400 flex items-center justify-between">
              <span>Target Gaji Bersih Pribadi</span>
              <span className="text-white font-mono font-bold">{formatRupiah(founderSalaryTarget)}</span>
            </label>
            <input
              type="range"
              min={1000000}
              max={10000000}
              step={500000}
              value={founderSalaryTarget}
              onChange={(e) => {
                const val = Number(e.target.value);
                setFounderSalaryTarget(val);
                saveConfig(fixedCost, val, netMarginPerShirt);
              }}
              className="w-full accent-white cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-400 flex items-center justify-between">
              <span>Margin Bersih Rata-Rata / Kaos</span>
              <span className="text-white font-mono">{formatRupiah(netMarginPerShirt)}</span>
            </label>
            <input
              type="range"
              min={20000}
              max={50000}
              step={1000}
              value={netMarginPerShirt}
              onChange={(e) => {
                const val = Number(e.target.value);
                setNetMarginPerShirt(val);
                saveConfig(fixedCost, founderSalaryTarget, val);
              }}
              className="w-full accent-white cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Primary KPI Display Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Target Kaos Harian */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.08] relative overflow-hidden">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Target Jual Harian</div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="font-mono text-2xl font-black text-white">{roundedDailyPcs}</span>
            <span className="text-[10px] text-zinc-400">pcs / hari</span>
          </div>
          <div className="text-[10px] text-zinc-500 mt-1 font-mono">
            {targetDailyPcs} pcs/hari presisi
          </div>
        </div>

        {/* Card 2: Target Kaos Bulanan */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.08] relative overflow-hidden">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Target Bulanan Total</div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="font-mono text-2xl font-black text-white">{targetMonthlyPcs}</span>
            <span className="text-[10px] text-zinc-400">pcs / bln</span>
          </div>
          <div className="text-[10px] text-zinc-500 mt-1 font-mono">
            Margin: {formatRupiah(totalTargetMargin)}
          </div>
        </div>

        {/* Card 3: BEP Operasional Studio */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.08] relative overflow-hidden">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">BEP Operasional Studio</div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="font-mono text-2xl font-black text-zinc-200">{bepOperationalPcs}</span>
            <span className="text-[10px] text-zinc-400">pcs / bln</span>
          </div>
          <div className="text-[10px] mt-1 font-mono">
            {isOperationalBepReached ? (
              <span className="text-white font-bold flex items-center gap-1">
                ✓ Listrik &amp; Wifi Aman
              </span>
            ) : (
              <span className="text-zinc-500">
                Sisa {Math.max(0, bepOperationalPcs - currentMonthPcs)} pcs
              </span>
            )}
          </div>
        </div>

        {/* Card 4: Realisasi Bulan Ini */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.08] relative overflow-hidden">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Terjual Bulan Ini</div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="font-mono text-2xl font-black text-white">{currentMonthPcs}</span>
            <span className="text-[10px] text-zinc-400">pcs ({progressPercent}%)</span>
          </div>
          <div className="text-[10px] mt-1 font-mono">
            {isSalaryGoalReached ? (
              <span className="text-white font-bold">
                🎉 Gaji Tercapai! (+{surplusPcs} bonus)
              </span>
            ) : (
              <span className="text-zinc-500">
                Kurang {Math.max(0, targetMonthlyPcs - currentMonthPcs)} pcs
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400 font-medium">Progres Menuju Gaji Founder {formatRupiah(founderSalaryTarget)}:</span>
          <span className="font-mono font-bold text-white">{progressPercent}%</span>
        </div>

        <div className="h-2.5 w-full bg-black/60 rounded-full overflow-hidden border border-white/10 p-0.5 flex">
          <div
            className="h-full rounded-full transition-all duration-500 bg-white"
            style={{ width: `${Math.min(100, Math.max(4, progressPercent))}%` }}
          />
        </div>

        <div className="flex justify-between text-[10px] text-zinc-500 font-mono pt-0.5">
          <span>0 pcs</span>
          <span className={isOperationalBepReached ? 'text-zinc-300 font-bold' : ''}>
            BEP Biaya ({bepOperationalPcs} pcs)
          </span>
          <span className={isSalaryGoalReached ? 'text-white font-bold' : ''}>
            Target Gaji ({targetMonthlyPcs} pcs)
          </span>
        </div>
      </div>

      {/* Actionable Executive Takeaway */}
      <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-white shrink-0" />
          <span className="text-zinc-300">
            <strong>Fokus Harian:</strong> Cukup pastikan rata-rata <strong className="text-white font-mono underline">{roundedDailyPcs} pcs kaos</strong> terjual per hari, tagihan studio tertutup dan Anda membawa pulang gaji bersih <strong className="text-white font-mono">{formatRupiah(founderSalaryTarget)}</strong>/bulan!
          </span>
        </div>
      </div>
    </div>
  );
}
