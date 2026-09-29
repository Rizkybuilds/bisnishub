import React, { useState, useMemo } from 'react';
import { 
  HardDrive, 
  Folder, 
  Copy, 
  Check, 
  Terminal, 
  Download, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  FileText, 
  ExternalLink, 
  Laptop, 
  Database, 
  Clock, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  X, 
  RefreshCw,
  Zap,
  Tag
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { Card } from '@bisnishub/shared/components/ui/Card';
import { Button } from '@bisnishub/shared/components/ui/Button';
import { 
  STORAGE_ZONES, 
  DIRECTORY_TREE, 
  FILE_NAMING_PRESETS, 
  DEFAULT_DRIVE, 
  getSelectedDrive, 
  setSelectedDrive, 
  resolvePath, 
  getExplorerCommand, 
  generateFileName, 
  calculateStorageKpis, 
  generateSetupScript, 
  exportDirectoryCsv,
  formatDrive 
} from '../../services/storageApi';

export function StoragePage() {
  const { showToast } = useAdmin();

  // Active Drive Letter State (D:, E:, F:, etc.)
  const [currentDrive, setCurrentDrive] = useState(() => getSelectedDrive());

  // Active Tabs
  const [activeTab, setActiveTab] = useState('tree'); // 'tree' | 'naming' | 'powershell' | 'policy'

  // Directory Tree Filters
  const [zoneFilter, setZoneFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyCritical, setOnlyCritical] = useState(false);

  // Copied State Tracker
  const [copiedKey, setCopiedKey] = useState(null);

  // Interactive Naming Generator Form State
  const [namingDate, setNamingDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [namingBrand, setNamingBrand] = useState('TS');
  const [namingItem, setNamingItem] = useState('ART01_ORIGINS');
  const [namingSpec, setNamingSpec] = useState('300DPI_A3');
  const [namingExt, setNamingExt] = useState('png');
  const [namingDestPath, setNamingDestPath] = useState('02_TEESTOCK_PRODUCTION\\01_ARTICLES_CATALOG\\DROP_01_RAW_IDENTITY\\ART_01_ORIGINS\\02_PREFLIGHT_300DPI');

  // Storage KPIs
  const kpis = useMemo(() => calculateStorageKpis(currentDrive), [currentDrive]);

  // Filtered Directories
  const filteredDirectories = useMemo(() => {
    return DIRECTORY_TREE.filter(d => {
      if (zoneFilter !== 'all' && d.zoneId !== zoneFilter) return false;
      if (onlyCritical && !d.critical) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = (d.name || '').toLowerCase().includes(q);
        const matchPath = (d.relPath || '').toLowerCase().includes(q);
        const matchDesc = (d.desc || '').toLowerCase().includes(q);
        const matchFmt = (d.recommendedFormat || '').toLowerCase().includes(q);
        if (!matchName && !matchPath && !matchDesc && !matchFmt) return false;
      }
      return true;
    });
  }, [zoneFilter, onlyCritical, searchQuery]);

  // Generated File Name
  const liveFileName = useMemo(() => {
    return generateFileName({
      date: namingDate,
      brand: namingBrand,
      itemName: namingItem,
      spec: namingSpec,
      ext: namingExt
    });
  }, [namingDate, namingBrand, namingItem, namingSpec, namingExt]);

  // Live Full Destination Path
  const liveFullPath = useMemo(() => {
    return resolvePath(`${namingDestPath}\\${liveFileName}`, currentDrive);
  }, [namingDestPath, liveFileName, currentDrive]);

  // Switch Drive Letter
  const handleDriveChange = (newDrive) => {
    const formatted = setSelectedDrive(newDrive);
    setCurrentDrive(formatted);
    if (showToast) {
      showToast(`Drive aktif disetel ke ${formatted}\\`, 'success');
    }
  };

  // Copy with toast
  const handleCopy = (key, text, label = 'Teks berhasil disalin ke clipboard!') => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
      if (showToast) showToast(label, 'success');
    } catch (e) {
      if (showToast) showToast('Gagal menyalin teks ke clipboard', 'error');
    }
  };

  // Apply Naming Preset
  const handleApplyPreset = (preset) => {
    setNamingBrand(preset.brand);
    setNamingItem(preset.item);
    setNamingSpec(preset.spec);
    setNamingExt(preset.ext);
    if (preset.destRelPath) {
      setNamingDestPath(preset.destRelPath);
    }
    if (showToast) showToast(`Preset diterapkan: ${preset.label}`, 'info');
  };

  // Download PowerShell Script (.ps1)
  const handleDownloadPs1 = () => {
    try {
      const scriptContent = generateSetupScript(currentDrive);
      const blob = new Blob([scriptContent], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `setup_external_ssd_${currentDrive.replace(':', '')}.ps1`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      if (showToast) showToast(`Skrip setup_external_ssd_${currentDrive.replace(':', '')}.ps1 berhasil diunduh!`, 'success');
    } catch (e) {
      if (showToast) showToast('Gagal mengunduh skrip PowerShell', 'error');
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    try {
      exportDirectoryCsv(currentDrive);
      if (showToast) showToast(`Struktur direktori Drive ${currentDrive} berhasil diekspor ke CSV!`, 'success');
    } catch (e) {
      if (showToast) showToast('Gagal mengekspor CSV direktori', 'error');
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto text-slate-100">
      {/* Admin Topbar */}
      <AdminTopbar 
        title="External SSD 1TB (Drive D:\) Asset Vault"
        subtitle="Pusat Aset Master Desain, Gang Sheet DTF 58cm, Video 4K & Disaster Recovery Tanpa Beban Laptop"
        badge="Penyimpanan Terisolasi"
      />

      {/* Header Actions & Drive Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 -mt-2">
        {/* Drive Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-sky-400" />
            Drive Target:
          </span>
          {['D:', 'E:', 'F:'].map((drive) => (
            <button
              key={drive}
              onClick={() => handleDriveChange(drive)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all border ${
                currentDrive === drive
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sm'
                  : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10 hover:text-white'
              }`}
            >
              {drive}\ {drive === 'D:' ? '(Default)' : ''}
            </button>
          ))}
          <span className="hidden lg:inline text-xs text-slate-500 font-mono pl-1">
            • NVMe/SATA 1TB Master Storage
          </span>
        </div>

        {/* Global Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDownloadPs1}
            className="border-white/10 hover:bg-white/5 text-slate-300 hover:text-white"
          >
            <Terminal className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
            Unduh Skrip .ps1
          </Button>

          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportCsv}
            className="border-white/10 hover:bg-white/5 text-slate-300 hover:text-white"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            Ekspor CSV ({DIRECTORY_TREE.length})
          </Button>

          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setActiveTab('naming')}
            className="bg-[#F15A24] hover:bg-[#d94e1d] text-white shadow-lg shadow-[#F15A24]/20 font-medium"
          >
            <Tag className="w-4 h-4 mr-1.5" />
            Generator Nama File
          </Button>
        </div>
      </div>

      {/* 4 Executive KPI Ribbon Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Kapasitas Terkelola */}
        <Card className="p-4 bg-[#121215] border-white/[0.08] hover:border-sky-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Kapasitas Master SSD</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
              <HardDrive className="w-4 h-4 text-sky-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-white">
              {kpis.totalCapacityGb.toLocaleString('id-ID')} GB <span className="text-xs font-normal text-slate-400">(1 TB)</span>
            </div>
            {/* Visual allocation bar */}
            <div className="w-full bg-white/5 h-2 rounded-full mt-2 overflow-hidden flex">
              <div className="h-full bg-[#F15A24]" style={{ width: '45%' }} title="TeeStock: 450 GB" />
              <div className="h-full bg-sky-500" style={{ width: '12%' }} title="MultiGraph: 120 GB" />
              <div className="h-full bg-amber-500" style={{ width: '10%' }} title="System Backups: 100 GB" />
              <div className="h-full bg-rose-500" style={{ width: '5%' }} title="Inbox Hot Drop: 50 GB" />
              <div className="h-full bg-emerald-500" style={{ width: '5%' }} title="Financial Audit: 50 GB" />
              <div className="h-full bg-purple-500" style={{ width: '3%' }} title="Brand Identities: 30 GB" />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-mono">
              <span className="text-sky-300 font-semibold">{kpis.totalAllocatedGb} GB Teralokasi ({kpis.allocationPercent}%)</span>
              <span className="text-slate-500">{kpis.freeBufferGb} GB Buffer</span>
            </div>
          </div>
        </Card>

        {/* KPI 2: Total Direktori */}
        <Card className="p-4 bg-[#121215] border-white/[0.08] hover:border-[#F15A24]/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Direktori Terstruktur</span>
            <div className="w-8 h-8 rounded-lg bg-[#F15A24]/10 border border-[#F15A24]/20 flex items-center justify-center">
              <Folder className="w-4 h-4 text-[#F15A24]" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-white">
              {kpis.totalDirectories} Subdirektori
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
              <span className="text-[#F15A24] font-medium">{kpis.masterZones} Zona Master</span>
              <span>•</span>
              <span className="text-amber-400 font-medium">{kpis.criticalDirs} Folder Kritis</span>
            </div>
          </div>
        </Card>

        {/* KPI 3: Beban Laptop Lokal */}
        <Card className="p-4 bg-[#121215] border-white/[0.08] hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Beban Laptop C:\</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Laptop className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-emerald-400">
              0 MB File Raksasa
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>PSD, TIFF, 4K dialihkan ke {currentDrive}\</span>
            </div>
          </div>
        </Card>

        {/* KPI 4: Status Integrasi */}
        <Card className="p-4 bg-[#121215] border-white/[0.08] hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Status Drive Target</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Database className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-white font-mono">
              {currentDrive}\
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Terkonfigurasi & Siap Dipakai</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Tabs Navigation */}
      <div className="border-b border-white/[0.08] flex items-center justify-between gap-4 overflow-x-auto">
        <div className="flex items-center gap-1 -mb-px">
          <button
            onClick={() => setActiveTab('tree')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all shrink-0 ${
              activeTab === 'tree'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-white/20'
            }`}
          >
            <Folder className="w-4 h-4" />
            <span>Direktori Master ({filteredDirectories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('naming')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all shrink-0 ${
              activeTab === 'naming'
                ? 'border-[#F15A24] text-[#F15A24]'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-white/20'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Generator Nama File (Protocol)</span>
          </button>

          <button
            onClick={() => setActiveTab('powershell')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all shrink-0 ${
              activeTab === 'powershell'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-white/20'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Skrip Otomasi PowerShell</span>
          </button>

          <button
            onClick={() => setActiveTab('policy')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all shrink-0 ${
              activeTab === 'policy'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-white/20'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>Hot vs Cold Storage Policy</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DIREKTORI MASTER (7 ZONA) */}
      {activeTab === 'tree' && (
        <div className="space-y-6">
          {/* Controls & Filter Bar */}
          <div className="p-4 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text"
                  placeholder="Cari nama direktori, path, format (PSD/TIFF/PNG), atau deskripsi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/60 transition-colors"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Critical Only Toggle */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setOnlyCritical(!onlyCritical)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all border ${
                    onlyCritical
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 font-bold'
                      : 'bg-white/5 text-slate-400 border-transparent hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Hanya Folder Kritis
                </button>
              </div>
            </div>

            {/* Zone Filter Pills */}
            <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-slate-500 mr-1">Zona Master:</span>
              <button
                onClick={() => setZoneFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  zoneFilter === 'all'
                    ? 'bg-white text-black font-bold'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                Semua Zona ({DIRECTORY_TREE.length})
              </button>
              {STORAGE_ZONES.map((zone) => {
                const count = DIRECTORY_TREE.filter(d => d.zoneId === zone.id).length;
                const isActive = zoneFilter === zone.id;
                return (
                  <button
                    key={zone.id}
                    onClick={() => setZoneFilter(zone.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      isActive
                        ? `${zone.badgeColor} border-current font-bold shadow-sm`
                        : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {zone.name.split('_').slice(1).join(' ')} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Directory Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDirectories.map((dir, idx) => {
              const zone = STORAGE_ZONES.find(z => z.id === dir.zoneId) || {};
              const fullPath = resolvePath(dir.relPath, currentDrive);
              const explorerCmd = getExplorerCommand(dir.relPath, currentDrive);
              const isPathCopied = copiedKey === `path-${idx}`;
              const isCmdCopied = copiedKey === `cmd-${idx}`;

              return (
                <Card 
                  key={idx}
                  className="p-5 bg-[#121215] border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header: Zone Badge & Critical Tag */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${zone.badgeColor}`}>
                          {zone.badge || zone.name}
                        </span>
                        {dir.critical && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20">
                            ★ Kritis
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        Zona {zone.code}
                      </span>
                    </div>

                    {/* Folder Title */}
                    <h4 className="text-sm font-bold text-white font-mono flex items-center gap-1.5">
                      <Folder className="w-4 h-4 text-sky-400 shrink-0" />
                      <span className="truncate">{dir.name}</span>
                    </h4>

                    {/* Description */}
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {dir.desc}
                    </p>

                    {/* Windows Full Path Box */}
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Path Windows (Drive {currentDrive}\):
                      </span>
                      <code className="text-xs text-sky-300 font-mono break-all select-all block">
                        {fullPath}
                      </code>
                    </div>

                    {/* Recommended Formats */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                      <span className="text-[10px] text-slate-500 uppercase">Format:</span>
                      <span className="font-mono text-slate-300 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                        {dir.recommendedFormat}
                      </span>
                    </div>
                  </div>

                  {/* Actions: Salin Path & Run Explorer */}
                  <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(`cmd-${idx}`, explorerCmd, 'Perintah Explorer berhasil disalin (Tekan Win+R lalu paste)!')}
                      className="border-white/10 hover:bg-white/5 text-[11px] text-slate-300 hover:text-white"
                      title="Salin perintah untuk membuka folder ini via Windows Run (Win+R)"
                    >
                      {isCmdCopied ? (
                        <>
                          <Check className="w-3 h-3 mr-1 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">Cmd Disalin!</span>
                        </>
                      ) : (
                        <>
                          <ExternalLink className="w-3 h-3 mr-1 text-slate-400" />
                          <span>Win+R Explorer</span>
                        </>
                      )}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(`path-${idx}`, fullPath, `Path "${fullPath}" berhasil disalin!`)}
                      className="border-white/10 hover:bg-sky-500/10 hover:border-sky-500/30 text-[11px] text-slate-200 hover:text-sky-300"
                    >
                      {isPathCopied ? (
                        <>
                          <Check className="w-3 h-3 mr-1 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">Path Disalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1 text-sky-400" />
                          <span>Salin Path</span>
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: GENERATOR NAMA FILE (NAMING PROTOCOL) */}
      {activeTab === 'naming' && (
        <div className="space-y-6">
          {/* Protocol Rule Banner */}
          <div className="rounded-2xl border border-[#F15A24]/30 bg-gradient-to-r from-[#F15A24]/10 via-[#121215] to-purple-950/20 p-5 space-y-3 shadow-lg">
            <div className="flex items-center gap-2 text-[#F15A24] text-xs font-bold uppercase tracking-wider">
              <Terminal className="w-4 h-4" />
              <span>Aturan Baku Penamaan File (File Naming Protocol)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Seluruh file master desain, gang sheet roll DTF, footage video, invoice, dan backup yang masuk ke External SSD wajib mematuhi standar penamaan baku agar terindeks rapi, mudah dicari, dan bebas dari kebingungan versi:
            </p>
            <div className="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-white">
              YYYYMMDD_[BRAND]_[NAMA_ITEM]_[VERSI/RESOLUSI].[EXT]
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="p-4 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-3">
            <span className="text-xs font-semibold text-slate-400 block">
              Pilih Preset Cepat:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {FILE_NAMING_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  className="px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-slate-300 hover:bg-[#F15A24]/10 hover:border-[#F15A24]/40 hover:text-white transition-all flex items-center gap-1.5"
                >
                  <Zap className="w-3 h-3 text-[#F15A24]" />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Builder Form & Live Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form Inputs */}
            <div className="lg:col-span-6 p-5 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#F15A24]" />
                Parameter Nama File
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tanggal Pembuatan (YYYY-MM-DD)
                  </label>
                  <input
                    type="date"
                    value={namingDate}
                    onChange={(e) => setNamingDate(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#F15A24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kode Pilar Bisnis (Brand)
                  </label>
                  <select
                    value={namingBrand}
                    onChange={(e) => setNamingBrand(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#F15A24]"
                  >
                    <option value="TS">TS - TeeStock Apparel</option>
                    <option value="MG">MG - MultiGraph Printing</option>
                    <option value="SYS">SYS - System & Vault Backup</option>
                    <option value="FIN">FIN - Financial & Audit</option>
                    <option value="KK">KK - KasKita SaaS</option>
                    <option value="TB">TB - Titik Buta Media</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Item / Artikel / Subjek
                </label>
                <input
                  type="text"
                  placeholder="Contoh: ART01_ORIGINS atau GANGSHEET_58x150cm"
                  value={namingItem}
                  onChange={(e) => setNamingItem(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#F15A24]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Spesifikasi / Resolusi / Versi
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 300DPI_A3, MASTER, 4K60, 310GSM"
                    value={namingSpec}
                    onChange={(e) => setNamingSpec(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#F15A24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Ekstensi File (.ext)
                  </label>
                  <select
                    value={namingExt}
                    onChange={(e) => setNamingExt(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#F15A24]"
                  >
                    <option value="png">png - DTF Print 300 DPI Transparent</option>
                    <option value="psd">psd - Photoshop Master Layer</option>
                    <option value="tif">tif - TIFF Gang Sheet Roll</option>
                    <option value="ai">ai - Illustrator Vector Master</option>
                    <option value="pdf">pdf - Dokumen / Hangtag Cetak</option>
                    <option value="mov">mov - Raw Video 4K 60fps</option>
                    <option value="mp4">mp4 - Video Export Web/Social</option>
                    <option value="zip">zip - Arsip Kompresi Backup</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Folder Tujuan di Drive {currentDrive}\
                </label>
                <select
                  value={namingDestPath}
                  onChange={(e) => setNamingDestPath(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#F15A24]"
                >
                  {DIRECTORY_TREE.map((dir, i) => (
                    <option key={i} value={dir.relPath}>
                      {dir.relPath}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live Result Output */}
            <div className="lg:col-span-6 p-5 rounded-2xl bg-[#121215] border border-white/[0.08] flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    Hasil Naming Baku
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                    Terstandarisasi
                  </span>
                </div>

                {/* Output Filename */}
                <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Nama File Rekomendasi:
                  </span>
                  <div className="text-sm sm:text-base font-bold text-emerald-300 font-mono break-all select-all">
                    {liveFileName}
                  </div>
                  <div className="pt-2 flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy('filename', liveFileName, 'Nama file berhasil disalin!')}
                      className="border-white/10 text-xs text-slate-300 hover:text-white"
                    >
                      {copiedKey === 'filename' ? (
                        <>
                          <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                          <span className="text-emerald-400">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                          <span>Salin Nama File</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Full Windows Absolute Path */}
                <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Alamat Lengkap di External SSD (Drive {currentDrive}\):
                  </span>
                  <code className="text-xs text-sky-300 font-mono break-all select-all block leading-relaxed">
                    {liveFullPath}
                  </code>
                  <div className="pt-2 flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy('fullpath', liveFullPath, 'Path lengkap berhasil disalin!')}
                      className="border-white/10 text-xs text-slate-300 hover:text-white"
                    >
                      {copiedKey === 'fullpath' ? (
                        <>
                          <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                          <span className="text-emerald-400">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
                          <span>Salin Path Lengkap</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-snug">
                Tips: Simpan file langsung ke path di atas menggunakan tombol <strong>Save As</strong> di Photoshop / Illustrator saat ekspor preflight 300 DPI.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SKRIP OTOMASI POWERSHELL */}
      {activeTab === 'powershell' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  Skrip Otomasi Pembuatan Folder di Drive {currentDrive}\
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Jalankan skrip ini sekali saat pertama kali menyambungkan SSD baru untuk langsung membuat seluruh 24 folder secara otomatis.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy('script', generateSetupScript(currentDrive), 'Seluruh skrip PowerShell berhasil disalin!')}
                  className="border-white/10 text-xs text-slate-300 hover:text-white"
                >
                  {copiedKey === 'script' ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                      <span className="text-emerald-400">Skrip Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                      <span>Salin Skrip</span>
                    </>
                  )}
                </Button>

                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleDownloadPs1}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Unduh .ps1
                </Button>
              </div>
            </div>

            {/* Step by step guide */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs text-slate-300">
              <span className="font-bold text-amber-400 block">Cara Menjalankan di Windows Terminal / PowerShell:</span>
              <ol className="list-decimal list-inside space-y-1 text-slate-400">
                <li>Buka <strong>PowerShell</strong> atau <strong>Windows Terminal</strong> di laptop Anda.</li>
                <li>Tancapkan External SSD dan pastikan terbaca di Windows Explorer (misal Drive <code className="text-white">{currentDrive}\</code>).</li>
                <li>Jalankan perintah berikut:
                  <div className="my-1.5 p-2 bg-black/60 rounded border border-white/10 font-mono text-amber-300 select-all flex items-center justify-between">
                    <span>powershell -ExecutionPolicy Bypass -File tools/setup_external_ssd.ps1 -TargetDrive {currentDrive}</span>
                    <button 
                      onClick={() => handleCopy('cmd-run', `powershell -ExecutionPolicy Bypass -File tools/setup_external_ssd.ps1 -TargetDrive ${currentDrive}`, 'Perintah terminal disalin!')}
                      className="p-1 hover:text-white"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </li>
                <li>Skrip akan membuat seluruh 24 folder baku beserta file panduan di dalamnya dalam waktu kurang dari 2 detik!</li>
              </ol>
            </div>

            {/* Code Box */}
            <div className="relative rounded-xl bg-black/80 border border-white/10 p-4 font-mono text-xs text-slate-300 max-h-[420px] overflow-y-auto leading-relaxed">
              <pre>{generateSetupScript(currentDrive)}</pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: KEBIJAKAN HOT VS COLD STORAGE */}
      {activeTab === 'policy' && (
        <div className="space-y-6">
          {/* Policy Table */}
          <div className="p-5 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Laptop className="w-4 h-4 text-emerald-400" />
                Matriks Pembagian Penyimpanan: Laptop (C:\) vs. SSD (D:\) vs. Cloud
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Standar operasional untuk menjaga laptop kerja tetap kencang dan mencegah penumpukan file raksasa (&gt;50MB).
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-white/10 text-[11px] text-slate-400 uppercase tracking-wider font-mono">
                  <tr>
                    <th className="py-3 px-4">Lokasi Penyimpanan</th>
                    <th className="py-3 px-4">Jenis File yang Boleh Disimpan</th>
                    <th className="py-3 px-4">Ukuran Khas</th>
                    <th className="py-3 px-4">SOP Pemeliharaan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-bold text-sky-400 flex items-center gap-2">
                      <Laptop className="w-4 h-4 shrink-0" />
                      <span>Laptop Lokal (Drive C:\)</span>
                    </td>
                    <td className="py-3 px-4">
                      File kode web (`apps/bisnishub-web`, `bisnis/teestock/web`), catatan teks markdown Obsidian, dan maksimal 1 artwork yang sedang aktif dikerjakan hari ini.
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-400">&lt; 50 MB</td>
                    <td className="py-3 px-4 text-slate-400">
                      Wajib bersihkan folder <code>Downloads</code> dan kosongkan Recycle Bin setiap Jumat sore.
                    </td>
                  </tr>

                  <tr className="hover:bg-white/[0.02] bg-white/[0.01]">
                    <td className="py-3 px-4 font-bold text-[#F15A24] flex items-center gap-2">
                      <HardDrive className="w-4 h-4 shrink-0" />
                      <span>External SSD 1TB (Drive {currentDrive}\)</span>
                    </td>
                    <td className="py-3 px-4">
                      Semua master file Photoshop (PSD multi-layer), Illustrator (AI/EPS), file TIFF 300 DPI, roll gang sheet 58cm, video mentah 4K 60fps, dan nota invoice.
                    </td>
                    <td className="py-3 px-4 font-mono text-amber-400">50 MB – 15 GB</td>
                    <td className="py-3 px-4 text-slate-400">
                      Dicolokkan saat proses rendering video, preflight cetak gang sheet, atau ekspor mockups katalog.
                    </td>
                  </tr>

                  <tr className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-bold text-purple-400 flex items-center gap-2">
                      <Database className="w-4 h-4 shrink-0" />
                      <span>Cloud Storage (Supabase & Cloudinary)</span>
                    </td>
                    <td className="py-3 px-4">
                      Foto web-optimized JPG/WEBP untuk etalase storefront online pelanggan, bukti transfer struk pembayaran pembeli, dan database RLS.
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-400">100 KB – 500 KB</td>
                    <td className="py-3 px-4 text-slate-400">
                      Tersinkronisasi otomatis via CDN Cloudinary dan Supabase Storage bucket <code>public-mockups</code>.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Weekly Maintenance Checklist */}
          <div className="p-5 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Checklist Pemeliharaan Mingguan (Weekly Hygiene Checklist)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">1</span>
                  <span>Sortir 00_INBOX_DROPZONE</span>
                </div>
                <p className="text-[11px] text-slate-400 pl-7">
                  Pindahkan seluruh foto/video hasil transfer kamera/HP ke subfolder artikel yang sesuai, lalu kosongkan folder inbox dropzone.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">2</span>
                  <span>Arsip Gang Sheet Cetak</span>
                </div>
                <p className="text-[11px] text-slate-400 pl-7">
                  Pastikan gang sheet DTF 58 cm yang sudah dicetak oleh vendor diberi akhiran nama <code className="text-white">_DONE.tif</code> agar tidak tercetak ganda.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">3</span>
                  <span>Backup Obsidian Vault BisnisHub</span>
                </div>
                <p className="text-[11px] text-slate-400 pl-7">
                  Kompres folder vault ke format .zip dan salin ke <code className="text-white">{currentDrive}\99_SYSTEM_SNAPSHOTS_BACKUP\Obsidian_Vault_Backups</code>.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">4</span>
                  <span>Sanitasi Laptop C:\</span>
                </div>
                <p className="text-[11px] text-slate-400 pl-7">
                  Hapus file temporary rendering Adobe, bersihkan folder Downloads laptop, dan kosongkan Recycle Bin Windows.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
