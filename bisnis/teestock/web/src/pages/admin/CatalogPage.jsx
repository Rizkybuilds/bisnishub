import React, { useState } from 'react';
import { Search, Filter, Upload, Image as ImageIcon } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { formatRupiah } from '../../utils/formatters';
import { SERIES } from '../../constants/series';
import { uploadToCloudinary } from '../../services/cloudinary';

export function CatalogPage() {
  const { catalog, saveProduct, showToast } = useAdmin();
  const [search, setSearch] = useState('');
  const [seriesFilter, setSeriesFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [editingSku, setEditingSku] = useState(null);
  const [formSku, setFormSku] = useState('');
  const [formName, setFormName] = useState('');
  const [formSeries, setFormSeries] = useState('profesi');
  const [formNiche, setFormNiche] = useState('');
  const [formFilePath, setFormFilePath] = useState('');
  const [formPriceRetail, setFormPriceRetail] = useState(99000);
  const [formPriceReseller, setFormPriceReseller] = useState(75000);
  const [formCostBlank, setFormCostBlank] = useState(38000);
  const [formCostDtf, setFormCostDtf] = useState(12750);

  const filteredCatalog = catalog.filter(p => {
    const matchQ = !search || 
      p.sku.toLowerCase().includes(search.toLowerCase()) || 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.niche && p.niche.toLowerCase().includes(search.toLowerCase()));
    const matchS = seriesFilter === 'all' || p.series === seriesFilter;
    return matchQ && matchS;
  });

  const handleOpenAdd = () => {
    setEditingSku(null);
    setFormSku(`TS-${formSeries.substring(0,3).toUpperCase()}-${String(catalog.length + 1).padStart(3, '0')}`);
    setFormName('');
    setFormNiche('');
    setFormFilePath('');
    setFormPriceRetail(99000);
    setFormPriceReseller(75000);
    setFormCostBlank(38000);
    setFormCostDtf(12750);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingSku(p.sku);
    setFormSku(p.sku);
    setFormName(p.name);
    setFormSeries(p.series || 'profesi');
    setFormNiche(p.niche || '');
    setFormFilePath(p.filePath || p.file_path || '');
    setFormPriceRetail(p.priceRetail || p.price_retail || 99000);
    setFormPriceReseller(p.priceReseller || p.price_reseller || 75000);
    setFormCostBlank(p.costBlank || 38000);
    setFormCostDtf(p.costDtf || 12750);
    setIsModalOpen(true);
  };

  const handleCloudinaryUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    showToast("Mengunggah foto ke Cloudinary CDN...", "info");
    try {
      const res = await uploadToCloudinary(file);
      setFormFilePath(res.url);
      showToast("✅ Foto mockup berhasil diunggah ke Cloudinary!");
    } catch (err) {
      alert("Gagal unggah foto: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formSku.trim() || !formName.trim()) {
      alert("SKU dan Nama Desain wajib diisi");
      return;
    }

    const seriesObj = SERIES.find(s => s.id === formSeries);
    const payload = {
      sku: formSku.trim(),
      name: formName.trim(),
      series: formSeries,
      seriesName: seriesObj?.name || 'TeeStock',
      niche: formNiche.trim(),
      filePath: formFilePath.trim(),
      priceRetail: Number(formPriceRetail),
      priceReseller: Number(formPriceReseller),
      costBlank: Number(formCostBlank),
      costDtf: Number(formCostDtf),
      status: 'active'
    };

    saveProduct(payload);
    setIsModalOpen(false);
  };

  // Live COGS calc for modal
  const cogsTotal = Number(formCostBlank) + Number(formCostDtf) + 2000 + 4500 + 2000 + 5000;
  const netProfitRetail = (Number(formPriceRetail) * 0.935) - cogsTotal;
  const marginRetail = ((netProfitRetail / Number(formPriceRetail)) * 100).toFixed(1);

  return (
    <div>
      <AdminTopbar
        title="Master Katalog & PIM"
        subtitle="Kelola desain resmi, kalkulasi HPP otomatis, tier harga, dan aset Cloudinary CDN"
        onNewDesign={handleOpenAdd}
      />

      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-ts-surface border border-ts-border p-4 rounded-2xl">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-ts-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari SKU, nama desain, niche..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-ts-hitam border border-ts-border rounded-xl pl-9 pr-4 py-2 text-xs text-ts-krem focus:outline-none focus:border-ts-terracotta"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-ts-muted shrink-0" />
            <select
              value={seriesFilter}
              onChange={(e) => setSeriesFilter(e.target.value)}
              className="bg-ts-hitam border border-ts-border rounded-xl px-3 py-2 text-xs text-ts-krem focus:outline-none focus:border-ts-terracotta"
            >
              <option value="all">Semua Series ({catalog.length})</option>
              {SERIES.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Catalog Table */}
        <div className="bg-ts-surface border border-ts-border rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-ts-hitam/60 border-b border-ts-border text-ts-muted font-bold tracking-wider uppercase">
                  <th className="py-3.5 px-4">Mockup</th>
                  <th className="py-3.5 px-4">SKU & Desain</th>
                  <th className="py-3.5 px-4">Series / Niche</th>
                  <th className="py-3.5 px-4">COGS (HPP)</th>
                  <th className="py-3.5 px-4">Harga Retail</th>
                  <th className="py-3.5 px-4">Laba Bersih</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ts-borderDim">
                {filteredCatalog.map(p => {
                  const hpp = (p.costBlank || 38000) + (p.costDtf || 12750) + 2000 + 4500 + 2000 + 5000;
                  const retail = p.priceRetail || p.price_retail || 99000;
                  const profit = (retail * 0.935) - hpp;
                  const margin = ((profit / retail) * 100).toFixed(1);

                  return (
                    <tr key={p.sku} className="hover:bg-ts-surfaceHover/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="w-12 h-12 rounded-lg bg-ts-hitam border border-ts-border overflow-hidden flex items-center justify-center shrink-0">
                          {p.filePath || p.file_path ? (
                            <img
                              src={p.filePath || p.file_path}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-ts-muted" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-xs font-bold text-ts-terracotta">{p.sku}</span>
                        <div className="font-bold text-sm text-ts-krem mt-0.5">{p.name}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="terracotta">{p.seriesName || p.series}</Badge>
                        <div className="text-[11px] text-ts-muted mt-1">{p.niche || '-'}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-ts-muted">
                        {formatRupiah(hpp)}
                      </td>
                      <td className="py-3 px-4 font-mono font-extrabold text-ts-krem">
                        {formatRupiah(retail)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-mono font-extrabold text-ts-green">
                          {formatRupiah(Math.round(profit))}
                        </div>
                        <span className="text-[10px] text-ts-green font-bold bg-ts-green/10 px-1.5 py-0.2 rounded">
                          {margin}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Button size="sm" variant="secondary" onClick={() => handleOpenEdit(p)}>
                          Edit
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Add/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSku ? `Edit Desain: ${editingSku}` : "Tambah Desain Baru ke PIM"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Kode SKU"
              value={formSku}
              onChange={(e) => setFormSku(e.target.value)}
              required
            />
            <Select
              label="Kategori Series"
              value={formSeries}
              onChange={(e) => setFormSeries(e.target.value)}
            >
              {SERIES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Nama Judul Desain"
              placeholder="Contoh: Commit & Pray"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              required
            />
            <Input
              label="Target Niche / Sub-kultur"
              placeholder="Contoh: Programmer, Barista"
              value={formNiche}
              onChange={(e) => setFormNiche(e.target.value)}
            />
          </div>

          {/* Cloudinary Upload */}
          <div className="p-3 bg-ts-hitam/60 border border-ts-border rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-ts-krem">Foto Mockup / Link Preview</label>
              <label className="cursor-pointer text-[11px] font-bold text-ts-terracotta hover:underline flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? "Mengunggah..." : "Upload ke Cloudinary CDN"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCloudinaryUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
            <Input
              placeholder="https://res.cloudinary.com/... atau link Google Drive"
              value={formFilePath}
              onChange={(e) => setFormFilePath(e.target.value)}
            />
          </div>

          {/* Pricing & Cost Structure */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Harga Retail Konsumen (Rp)"
              type="number"
              value={formPriceRetail}
              onChange={(e) => setFormPriceRetail(e.target.value)}
            />
            <Input
              label="Harga Khusus Reseller (Rp)"
              type="number"
              value={formPriceReseller}
              onChange={(e) => setFormPriceReseller(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="HPP Kaos Polos NSA (Rp)"
              type="number"
              value={formCostBlank}
              onChange={(e) => setFormCostBlank(e.target.value)}
            />
            <Input
              label="HPP Cetak DTF A3 (Rp)"
              type="number"
              value={formCostDtf}
              onChange={(e) => setFormCostDtf(e.target.value)}
            />
          </div>

          {/* Live COGS Preview Box */}
          <div className="p-3.5 rounded-xl bg-ts-surfaceHover border border-ts-border text-xs space-y-1">
            <div className="flex justify-between text-ts-muted">
              <span>Total COGS Produksi & Packing:</span>
              <span className="font-mono font-bold text-ts-krem">{formatRupiah(cogsTotal)}</span>
            </div>
            <div className="flex justify-between text-ts-green font-bold">
              <span>Proyeksi Laba Bersih Retail (Potong Fee 6.5%):</span>
              <span className="font-mono">{formatRupiah(Math.round(netProfitRetail))} ({marginRetail}%)</span>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-ts-borderDim">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Simpan ke Master PIM
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
