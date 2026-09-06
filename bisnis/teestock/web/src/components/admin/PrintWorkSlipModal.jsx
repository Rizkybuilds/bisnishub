import React from 'react';
import { Printer, CheckSquare, Sparkles } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { formatDate, formatRupiah } from '../../utils/formatters';

export function PrintWorkSlipModal({ isOpen, onClose, order }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const isBlankOrder = order.sku?.startsWith('TS-BLK') || 
    order.productName?.toLowerCase().includes('kaos polos') || 
    order.productName?.toLowerCase().includes('blank');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Tiket Kerja Produksi — ${order.id}`} maxWidth="max-w-lg">
      <div className="space-y-4">
        {/* Printable Card Area */}
        <div id="printable-work-slip" className="bg-white text-gray-900 p-6 rounded-xl border border-gray-300 font-sans space-y-4 print:p-0 print:border-none">
          {/* Header */}
          <div className="border-b-2 border-gray-900 pb-3 flex justify-between items-start">
            <div>
              <h2 className="text-xl font-black tracking-tight uppercase">TeeStock Apparel</h2>
              <p className="text-[10px] text-gray-600 font-medium tracking-wide uppercase">Slip Kerja Produksi & Quality Control</p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-black text-white text-xs font-mono font-bold px-2 py-0.5 rounded uppercase">
                {order.channel || 'DIRECT'}
              </span>
              <div className="text-[11px] font-mono font-bold mt-1">{order.id}</div>
              <div className="text-[10px] text-gray-500">{formatDate(order.date || new Date())}</div>
            </div>
          </div>

          {/* Customer Spec */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Pemesan:</div>
              <div className="font-bold text-sm text-gray-900">{order.customer}</div>
              <div className="font-mono text-gray-600 text-xs">{order.phone || '-'}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Catatan / Resi:</div>
              <div className="font-mono text-xs font-bold text-gray-800">{order.trackingNo || 'Non-Resi / Antrean'}</div>
              {order.notes && <div className="text-[11px] text-gray-600 italic mt-0.5">{order.notes}</div>}
            </div>
          </div>

          {/* Garment & Print Spec */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-1">
              Spesifikasi Produk:
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
              <span className="text-xs font-bold text-gray-800">{order.productName || order.sku}</span>
              <span className="text-xs font-mono font-bold bg-gray-200 px-2 py-0.5 rounded">Qty: {order.qty || 1} pcs</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs pt-1">
              <div>
                <span className="text-[10px] text-gray-500 block">Blank NSA:</span>
                <strong className="text-gray-900">{order.garment || 'NSA Softstyle 30s'}</strong>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 block">Warna:</span>
                <strong className="text-gray-900">{order.color || 'Hitam'}</strong>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 block">Ukuran:</span>
                <strong className="text-gray-900 text-sm font-mono">{order.size || 'L'}</strong>
              </div>
            </div>
          </div>

          {/* Machine SOP / Blank Inspection Box */}
          {isBlankOrder ? (
            <div className="bg-blue-50 border border-blue-300 rounded-lg p-3 text-xs text-blue-950 space-y-1">
              <div className="font-bold flex items-center gap-1 text-[11px] uppercase tracking-wide">
                📦 Instruksi Kaos Polos NSA (Tanpa Cetak DTF):
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>• Kategori: <strong>Blank Apparel Original NSA (New States Apparel)</strong></div>
                <div>• Quality Check: <strong>Bebas Noda, Serat Rata, Jahitan Rapi</strong></div>
                <div>• Penanganan: <strong>Langsung Lipat & Masukkan Ziplock</strong></div>
                <div>• Pelengkap: <strong>Sisipkan Hangtag & Stiker TeeStock</strong></div>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 text-xs text-amber-950 space-y-1">
              <div className="font-bold flex items-center gap-1 text-[11px] uppercase tracking-wide">
                🔥 Parameter Heat Press Mandiri:
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>• Suhu: <strong>155°C – 160°C</strong></div>
                <div>• Waktu: <strong>15 Detik</strong> (Medium-Firm)</div>
                <div>• Pengupasan: <strong>Kupas Dingin (Cold Peel)</strong></div>
                <div>• Press ke-2: <strong>5 Detik (Lapisi Teflon)</strong></div>
              </div>
            </div>
          )}

          {/* QC Checklist */}
          <div className="space-y-1.5 pt-1 text-xs">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">QC & Packaging Checklist:</div>
            <div className="grid grid-cols-2 gap-1 text-[11px] text-gray-700 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 border border-gray-400 rounded inline-block"></span> Cek Jahitan Kaos NSA
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 border border-gray-400 rounded inline-block"></span> {isBlankOrder ? 'Cek Kesesuaian Warna & Size' : 'Uji Rekat Sablon DTF'}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 border border-gray-400 rounded inline-block"></span> Thank You Card & Stiker
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 border border-gray-400 rounded inline-block"></span> Polymailer Rapi
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="border-t border-dashed border-gray-300 pt-2 text-center text-[10px] text-gray-500">
            TeeStock Apparel • Your Design, Your Stock • dicetak secara lean solo founder
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2 border-t border-ts-borderDim">
          <Button variant="secondary" onClick={onClose}>
            Tutup
          </Button>
          <Button variant="primary" icon={Printer} onClick={handlePrint}>
            Cetak Slip Kerja (Print)
          </Button>
        </div>
      </div>
    </Modal>
  );
}
