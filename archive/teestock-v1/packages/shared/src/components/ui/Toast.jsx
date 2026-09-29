import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-ts-green shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-ts-red shrink-0" />,
    info: <Info className="w-5 h-5 text-ts-mustard shrink-0" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-ts-surface border border-ts-border px-4 py-3 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-200 max-w-md">
      {icons[type] || icons.info}
      <p className="text-xs font-semibold text-ts-krem flex-1">{message}</p>
      {onClose && (
        <button onClick={onClose} className="text-ts-muted hover:text-ts-krem p-0.5 transition-colors cursor-pointer" aria-label="Tutup notifikasi">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
