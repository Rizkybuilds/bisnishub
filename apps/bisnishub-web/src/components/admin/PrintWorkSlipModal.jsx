import React from 'react';
import { Printer, FolderArchive, Layers, Eye, CheckCircle2, Flame, AlertCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { formatDate } from '../../utils/formatters';
import { useAdmin } from '../../context/AdminContext';
import { getCardPreviewImage } from '../../utils/productImages';
import { PRINT_PRESETS } from '../../constants/pricing';

/**
 * Pemetaan lokasi rak fisik & map penyimpanan film DTF berdasarkan SKU dan seri produk
 */
export function getFilmStorageBin(sku = '', series = '') {
  const cleanSku = String(sku || '').toUpperCase().trim();
  const cleanSeries = String(series || '').toLowerCase().trim();

  if (cleanSku.startsWith('TS-STM') || cleanSeries === 'statement') {
    return { binId: 'BIN-A', binName: 'Rak A — Map Binder 01 (Statement)', slot: `SLOT-${cleanSku}` };
  }
  if (cleanSku.startsWith('TS-SUB') || cleanSeries === 'subculture') {
    return { binId: 'BIN-B', binName: 'Rak B — Map Binder 02 (Subculture)', slot: `SLOT-${cleanSku}` };
  }
  if (cleanSku.startsWith('TS-OUT') || cleanSeries === 'outlaw') {
    return { binId: 'BIN-C', binName: 'Rak C — Map Binder 03 (Outlaw & Racing)', slot: `SLOT-${cleanSku}` };
  }
  if (cleanSku.startsWith('TS-PRO') || cleanSku.startsWith('TS-LOK') || cleanSeries === 'creator') {
    return { binId: 'BIN-D', binName: 'Rak D — Map Binder 04 (Creator Collab)', slot: `SLOT-${cleanSku}` };
  }
  if (cleanSku.startsWith('TS-CUST') || cleanSeries === 'custom') {
    return { binId: 'BIN-X', binName: 'Folder X — Antrean Cetak Custom Order', slot: `CUSTOM-${cleanSku}` };
  }
  return { binId: 'BIN-GEN', binName: 'Rak E — Map Binder 05 (Katalog Umum)', slot: `SLOT-${cleanSku || 'ITEM'}` };
}

export function PrintWorkSlipModal({ isOpen, onClose, order }) {
  const { catalog } = useAdmin();

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const primaryItem = (order.items && order.items.length > 0) ? order.items[0] : null;
  const primarySku = primaryItem?.sku || primaryItem?.product_sku || order.sku || '';
  const product = catalog?.find(p => p.sku === primarySku || p.sku === order.sku) || null;

  const isBlankOrder = order.sku?.startsWith('TS-BLK') || 
    order.productName?.toLowerCase().includes('kaos polos') || 
    order.productName?.toLowerCase().includes('blank') ||
    product?.series === 'blank';

  const previewMockup = product ? getCardPreviewImage(product, order.color) : (order.preview_url || order.mockup_url || '');
  const binInfo = getFilmStorageBin(primarySku, product?.series);
  const printPresetKey = product?.printPreset || product?.print_preset || 'back_a3_plus';
  const matchedPreset = PRINT_PRESETS.find(p => p.id === printPresetKey) || PRINT_PRESETS[0];

  const hasBackPrint = printPresetKey.includes('back');
  const hasFrontPrint = printPresetKey.includes('front') || printPresetKey === 'custom';
  const isFrontLogo = printPresetKey.includes('front_a6');
  const isFrontA4 = printPresetKey.includes('front_a4');
  const isBackA3Plus = printPresetKey.includes('back_a3_plus') || (!hasFrontPrint && !isBlankOrder);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Tiket Kerja Produksi — ${order.id}`} maxWidth="max-w-3xl">
      <div className="space-y-4">
        {/* Printable Card Area */}
        <div id="printable-work-slip" className="bg-white text-gray-900 p-6 rounded-2xl border border-gray-300 font-sans space-y-4 print:p-0 print:border-none">
          {/* Header */}
          <div className="border-b-2 border-gray-900 pb-3 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black tracking-tight uppercase">TeeStock Apparel</h2>
                <span className="text-[9px] bg-black text-white font-mono px-2 py-0.5 rounded font-bold uppercase">
                  Studio Depok
                </span>
              </div>
              <p className="text-[10px] text-gray-600 font-bold tracking-wider uppercase mt-0.5">
                Slip Kerja Produksi, Panduan Posisi Press & Pengarsipan Film
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-black text-white text-xs font-mono font-bold px-2 py-0.5 rounded uppercase">
                {order.channel || 'DIRECT'}
              </span>
              <div className="text-xs font-mono font-black mt-1 text-gray-900">{order.id}</div>
              <div className="text-[10px] text-gray-500">{formatDate(order.date || new Date())}</div>
            </div>
          </div>

          {/* Customer & Shipping Spec */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-3 rounded-xl border border-gray-200">
            <div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Pemesan:</div>
              <div className="font-bold text-sm text-gray-900">{order.customer}</div>
              <div className="font-mono text-gray-600 text-xs">{order.phone || '-'}</div>
              <div className="text-[11px] text-gray-600 truncate">{order.city || order.customer_city || 'Wilayah Pengiriman'}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Catatan / Resi Kurir:</div>
              <div className="font-mono text-xs font-bold text-gray-800">{order.trackingNo || 'Antrean / Belum Cetak Resi'}</div>
              {order.notes && <div className="text-[11px] text-gray-700 italic mt-0.5 bg-amber-50 p-1.5 rounded border border-amber-200">{order.notes}</div>}
            </div>
          </div>

          {/* Garment & Order Items */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-1 flex justify-between">
              <span>Spesifikasi Garmen NSA ({order.qty || 1} pcs total):</span>
              <span className="text-gray-500 font-mono text-[10px]">SKU: {primarySku}</span>
            </div>
            {order.items && order.items.length > 1 ? (
              <div className="space-y-1.5 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-[10px] text-gray-500 uppercase bg-gray-50">
                      <th className="py-1 px-2">Item / Desain</th>
                      <th className="py-1 px-2">Garmen NSA</th>
                      <th className="py-1 px-2">Warna & Size</th>
                      <th className="py-1 px-2 text-right">Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-sans">
                    {order.items.map((it, idx) => (
                      <tr key={idx} className="py-1 hover:bg-gray-50/50">
                        <td className="py-1.5 px-2 font-bold text-gray-800">{it.name || it.product_name}</td>
                        <td className="py-1.5 px-2 text-gray-600">{it.garment}</td>
                        <td className="py-1.5 px-2 text-gray-600 font-medium">{it.color} (<span className="font-bold text-gray-900">{it.size}</span>)</td>
                        <td className="py-1.5 px-2 text-right font-mono font-bold text-gray-900">{it.qty} pcs</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-50/80 p-2.5 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center pb-1.5 border-b border-gray-200">
                  <span className="text-xs font-bold text-gray-900">{order.productName || order.sku}</span>
                  <span className="text-xs font-mono font-black bg-gray-200 text-gray-900 px-2 py-0.5 rounded">
                    Qty: {order.qty || 1} pcs
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs pt-1.5">
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase">Tipe Garmen:</span>
                    <strong className="text-gray-900">{order.garment || 'NSA Heavyweight 24s'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase">Warna:</span>
                    <strong className="text-gray-900">{order.color || 'Hitam'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase">Ukuran:</span>
                    <strong className="text-gray-900 text-sm font-mono font-black">{order.size || 'L'}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Film Storage & Bin Location Finder (HANYA PRODUK GRAFIS) */}
          {!isBlankOrder && (
            <div className="bg-emerald-50/80 border border-emerald-300 rounded-xl p-3 text-xs text-emerald-950 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-black flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-emerald-900">
                  <FolderArchive className="w-4 h-4 text-emerald-700" />
                  SOP Pengambilan Film DTF di Rak Studio:
                </div>
                <span className="font-mono text-[10px] font-black bg-emerald-700 text-white px-2 py-0.5 rounded uppercase">
                  {binInfo.binId}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white/80 p-2 rounded-lg border border-emerald-200 text-[11px]">
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase">Lokasi Rak / Map:</span>
                  <strong className="text-emerald-950 font-bold">{binInfo.binName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase">Label Slot Lembar:</span>
                  <strong className="text-emerald-950 font-mono font-bold">{binInfo.slot}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase">Ukuran Cetak:</span>
                  <strong className="text-emerald-950 font-bold">{matchedPreset.shortName || 'A3+ Punggung'}</strong>
                </div>
              </div>
              <div className="text-[10px] text-emerald-800 flex items-center gap-1 font-medium">
                <span>💡</span>
                <span><strong>SOP Simpan:</strong> Selalu lapisi kertas pembatas (baking paper) antar lembar film dan simpan dalam ruangan sejuk/kering (suhu &lt;25°C).</span>
              </div>
            </div>
          )}

          {/* Visual Placement Guide & Mockup Preview (HANYA PRODUK GRAFIS) */}
          {!isBlankOrder && (
            <div className="border border-gray-300 rounded-xl p-3.5 space-y-3 bg-white">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <div className="font-black flex items-center gap-1.5 text-xs text-gray-900 uppercase tracking-wide">
                  <Eye className="w-4 h-4 text-amber-600" />
                  Panduan Visual Posisi Sablon & Mockup Produk
                </div>
                <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-300">
                  Preset: {matchedPreset.name}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Kolom 1: Foto Mockup Asli Kaos */}
                <div className="md:col-span-5 flex flex-col items-center justify-center p-2 bg-gray-50 rounded-xl border border-gray-200 text-center">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                    Foto Mockup Garmen ({order.color || 'Hitam'}):
                  </span>
                  {previewMockup ? (
                    <div className="relative w-36 h-44 sm:w-40 sm:h-48 flex items-center justify-center bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                      <img 
                        src={previewMockup} 
                        alt={order.productName || 'Mockup Kaos'} 
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                  ) : (
                    <div className="w-36 h-44 flex flex-col items-center justify-center bg-gray-100 rounded-lg border border-dashed border-gray-300 text-gray-400 p-3 text-[10px]">
                      <span>Mockup tidak tersedia</span>
                      <span className="text-[9px] text-gray-400 mt-1">Gunakan diagram posisi</span>
                    </div>
                  )}
                  <span className="text-[10px] text-gray-600 font-mono mt-1.5 font-bold">
                    {order.productName || order.sku}
                  </span>
                </div>

                {/* Kolom 2: Diagram Skema T-Shirt & Titik Sablon */}
                <div className="md:col-span-7 space-y-2.5">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    {/* Skema Tampak Depan */}
                    <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200 flex flex-col items-center">
                      <span className="text-[10px] font-black uppercase text-gray-700 mb-1">Tampak Depan (Front)</span>
                      <div className="relative w-28 h-32 bg-white border border-gray-300 rounded-t-lg rounded-b-md shadow-inner flex flex-col items-center">
                        {/* Kerah Depan */}
                        <div className="w-10 h-3 border-b-2 border-x-2 border-gray-400 rounded-b-full bg-gray-100" />
                        
                        {/* Box Sablon Depan */}
                        {isFrontLogo ? (
                          <div className="absolute top-7 left-4 w-7 h-7 bg-amber-500/20 border-2 border-dashed border-amber-600 rounded flex items-center justify-center text-[7px] font-black text-amber-900">
                            Logo
                          </div>
                        ) : isFrontA4 ? (
                          <div className="absolute top-8 w-14 h-16 bg-amber-500/20 border-2 border-dashed border-amber-600 rounded flex items-center justify-center text-[8px] font-black text-amber-900">
                            A4 Depan
                          </div>
                        ) : (
                          <div className="absolute top-12 text-[8px] text-gray-400 italic">
                            Tanpa Sablon
                          </div>
                        )}
                      </div>
                      <div className="text-[9px] text-gray-600 mt-1.5 font-medium leading-tight">
                        {isFrontLogo ? 'Logo Dada Kiri: 8 cm dari tengah, sejajar ketiak' : isFrontA4 ? 'Dada A4: 3-4 jari di bawah kerah' : 'Depan polos'}
                      </div>
                    </div>

                    {/* Skema Tampak Belakang */}
                    <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200 flex flex-col items-center">
                      <span className="text-[10px] font-black uppercase text-gray-700 mb-1">Tampak Belakang (Back)</span>
                      <div className="relative w-28 h-32 bg-white border border-gray-300 rounded-t-lg rounded-b-md shadow-inner flex flex-col items-center">
                        {/* Kerah Belakang */}
                        <div className="w-10 h-1.5 border-b-2 border-gray-400 rounded-b-sm bg-gray-200" />
                        
                        {/* Box Sablon Punggung */}
                        {isBackA3Plus ? (
                          <div className="absolute top-6 w-18 h-22 bg-rose-500/20 border-2 border-dashed border-rose-600 rounded flex items-center justify-center text-[9px] font-black text-rose-900 text-center px-1">
                            A3+ HERO PUNGGUNG
                          </div>
                        ) : hasBackPrint ? (
                          <div className="absolute top-7 w-16 h-18 bg-rose-500/20 border-2 border-dashed border-rose-600 rounded flex items-center justify-center text-[8px] font-black text-rose-900">
                            A3 Punggung
                          </div>
                        ) : (
                          <div className="absolute top-12 text-[8px] text-gray-400 italic">
                            Tanpa Sablon
                          </div>
                        )}
                      </div>
                      <div className="text-[9px] text-gray-600 mt-1.5 font-medium leading-tight">
                        {isBackA3Plus ? 'Punggung A3+: 4 jari (10–12 cm) di bawah kerah' : 'Punggung polos'}
                      </div>
                    </div>
                  </div>

                  {/* Panduan Penggaris / Jari Cepat */}
                  <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-2 text-[10px] text-amber-950 space-y-1">
                    <div className="font-bold flex items-center gap-1 text-amber-900">
                      <span>📏</span>
                      <span>Aturan Jarak Fisik Penempatan Film di Atas Kaos:</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] text-gray-700">
                      <div>• <strong>Punggung A3+:</strong> 10–12 cm (4 jari dewasa) di bawah kerah.</div>
                      <div>• <strong>Dada Tengah A4:</strong> 7–8 cm (3 jari dewasa) di bawah kerah.</div>
                      <div>• <strong>Logo Saku Kiri:</strong> 7–9 cm dari garis tengah, sejajar ketiak.</div>
                      <div>• <strong>Leher Belakang:</strong> 2.5–3 cm (1 jari) di bawah jahitan leher.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Machine Heat Press SOP Box */}
          {isBlankOrder ? (
            <div className="bg-blue-50 border border-blue-300 rounded-xl p-3 text-xs text-blue-950 space-y-1">
              <div className="font-bold flex items-center gap-1 text-[11px] uppercase tracking-wide">
                📦 Instruksi Kaos Polos NSA (Tanpa Cetak DTF):
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>• Kategori: <strong>Blank Apparel Original NSA</strong></div>
                <div>• Quality Check: <strong>Bebas Noda, Serat Rata, Jahitan Rapi</strong></div>
                <div>• Penanganan: <strong>Langsung Lipat & Masukkan Ziplock</strong></div>
                <div>• Pelengkap: <strong>Sisipkan Hangtag & Stiker TeeStock</strong></div>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50/90 border border-amber-300 rounded-xl p-3 text-xs text-amber-950 space-y-1.5">
              <div className="font-black flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-amber-900">
                <Flame className="w-4 h-4 text-amber-700" />
                Parameter Mesin Heat Press In-House:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white/80 p-2 rounded-lg border border-amber-200 text-[11px]">
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase">1. Suhu Press:</span>
                  <strong className="text-gray-900 font-bold">155°C – 160°C</strong>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase">2. Durasi Press 1:</span>
                  <strong className="text-gray-900 font-bold">15 Detik (Firm)</strong>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase">3. Pengupasan:</span>
                  <strong className="text-rose-700 font-bold">Cold Peel (Wajib Dingin)</strong>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase">4. Finishing Press:</span>
                  <strong className="text-emerald-700 font-bold">5 Detik + Sheet Teflon</strong>
                </div>
              </div>
              <div className="text-[10px] text-amber-800 font-medium">
                ⚠️ <strong>PERINGATAN:</strong> Jangan kupas saat plastik film masih hangat. Tunggu 30–45 detik hingga dingin agar lem menempel sempurna pada serat katun NSA.
              </div>
            </div>
          )}

          {/* QC & Packaging Checklist */}
          <div className="space-y-1.5 pt-1 text-xs">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">QC & Packaging Checklist:</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px] text-gray-700 font-medium bg-gray-50 p-2 rounded-lg border border-gray-200">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 border border-gray-400 rounded inline-block bg-white"></span>
                <span>Cek Jahitan NSA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 border border-gray-400 rounded inline-block bg-white"></span>
                <span>{isBlankOrder ? 'Kesesuaian Warna/Size' : 'Uji Rekat Sablon'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 border border-gray-400 rounded inline-block bg-white"></span>
                <span>Thank You Card & Stiker</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 border border-gray-400 rounded inline-block bg-white"></span>
                <span>Polymailer Rapi</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="border-t border-dashed border-gray-300 pt-2 text-center text-[10px] text-gray-500">
            TeeStock Apparel • Your Design, Your Stock • Dicetak presisi in-house studio
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.08]">
          <Button variant="secondary" onClick={onClose}>
            Tutup
          </Button>
          <Button variant="primary" icon={Printer} onClick={handlePrint}>
            Cetak Tiket Kerja & Panduan Press
          </Button>
        </div>
      </div>
    </Modal>
  );
}
