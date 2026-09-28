import React from 'react';
import { Package, Sparkles } from 'lucide-react';

interface ModulePlaceholderPageProps {
  title: string;
  category: string;
  description: string;
  sliceId: string;
}

export const ModulePlaceholderPage: React.FC<ModulePlaceholderPageProps> = ({
  title,
  category,
  description,
  sliceId,
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
          {category}
        </div>
        <h2 className="text-xl font-bold text-slate-100 mt-1">{title}</h2>
        <p className="text-xs text-slate-400 mt-1">{description}</p>
      </div>

      <div className="p-8 rounded-xl border border-dashed border-slate-800 bg-slate-900/30 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 mx-auto flex items-center justify-center text-slate-400">
          <Package className="w-6 h-6 text-emerald-400" />
        </div>
        <div className="max-w-md mx-auto space-y-1">
          <h3 className="text-sm font-semibold text-slate-200">Modul Siap Terhubung ke Domain Core</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Halaman ini telah terdaftar di MGBOS Navigation Shell dan siap dihubungkan pada paket kerja berikutnya ({sliceId}).
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 font-mono">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>Spec: MGBOS 0.5.1 — {sliceId}</span>
        </div>
      </div>
    </div>
  );
};
