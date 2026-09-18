import React, { useState, useMemo } from 'react';
import { 
  Megaphone, 
  Video, 
  Instagram, 
  Smartphone, 
  Calendar, 
  Sparkles, 
  Hash, 
  Copy, 
  Check, 
  Plus, 
  Search, 
  Download, 
  Edit3, 
  Trash2, 
  X, 
  FileText, 
  Flame, 
  Layers, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Filter, 
  AlertCircle,
  HelpCircle,
  Share2,
  RefreshCw,
  Eye
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  getContentPlans, 
  saveContentPlan, 
  deleteContentPlan, 
  updatePlanStatus, 
  resetDefaultContentPlans, 
  calculateMarketingKpis, 
  exportContentCalendarCsv, 
  PILLARS_4E, 
  CHANNELS_CONFIG, 
  SWIPE_FILES 
} from '../../services/marketingApi';

export function MarketingPage() {
  const { showToast } = useAdmin();

  // Content Plans State
  const [plans, setPlans] = useState(() => getContentPlans());
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar' | 'swipe' | 'seo'
  
  // Filters
  const [channelFilter, setChannelFilter] = useState('all');
  const [pillarFilter, setPillarFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Swipe File Sub-filter
  const [swipeCategory, setSwipeCategory] = useState('all');

  // Copy Feedback State
  const [copiedId, setCopiedId] = useState(null);

  // SEO Banner Visibility
  const [showSeoGuide, setShowSeoGuide] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    channel: 'tiktok',
    pillar: 'educate',
    targetDate: new Date().toISOString().slice(0, 10),
    hookCopy: '',
    caption: '',
    seoKeywords: '',
    status: 'draft',
    businessId: 'teestock'
  });

  // Calculate KPIs
  const kpis = useMemo(() => calculateMarketingKpis(plans), [plans]);

  // Filtered Content Plans
  const filteredPlans = useMemo(() => {
    return plans.filter(p => {
      if (channelFilter !== 'all' && p.channel !== channelFilter) return false;
      if (pillarFilter !== 'all' && p.pillar !== pillarFilter) return false;
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = (p.title || '').toLowerCase().includes(q);
        const matchHook = (p.hookCopy || '').toLowerCase().includes(q);
        const matchKeywords = (p.seoKeywords || '').toLowerCase().includes(q);
        const matchCaption = (p.caption || '').toLowerCase().includes(q);
        if (!matchTitle && !matchHook && !matchKeywords && !matchCaption) return false;
      }
      return true;
    });
  }, [plans, channelFilter, pillarFilter, statusFilter, searchQuery]);

  // Filtered Swipe Files
  const filteredSwipes = useMemo(() => {
    if (swipeCategory === 'all') return SWIPE_FILES;
    return SWIPE_FILES.filter(s => s.category === swipeCategory);
  }, [swipeCategory]);

  // Handle Copy to Clipboard
  const handleCopy = (id, text, label = 'Teks berhasil disalin ke clipboard!') => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
      if (showToast) showToast(label, 'success');
    } catch (e) {
      if (showToast) showToast('Gagal menyalin teks ke clipboard', 'error');
    }
  };

  // Open Modal for Create or Edit
  const handleOpenModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        title: plan.title || '',
        channel: plan.channel || 'tiktok',
        pillar: plan.pillar || 'educate',
        targetDate: plan.targetDate || new Date().toISOString().slice(0, 10),
        hookCopy: plan.hookCopy || '',
        caption: plan.caption || '',
        seoKeywords: plan.seoKeywords || '',
        status: plan.status || 'draft',
        businessId: plan.businessId || 'teestock'
      });
    } else {
      setEditingPlan(null);
      setFormData({
        title: '',
        channel: 'tiktok',
        pillar: 'educate',
        targetDate: new Date().toISOString().slice(0, 10),
        hookCopy: '',
        caption: '',
        seoKeywords: '',
        status: 'draft',
        businessId: 'teestock'
      });
    }
    setIsModalOpen(true);
  };

  // Submit Plan Form
  const handleSubmitPlan = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      if (showToast) showToast('Judul konten wajib diisi', 'warning');
      return;
    }
    if (!formData.hookCopy.trim()) {
      if (showToast) showToast('Hook 3-detik pertama wajib diisi', 'warning');
      return;
    }
    if (!formData.caption.trim()) {
      if (showToast) showToast('Naskah caption wajib diisi', 'warning');
      return;
    }

    const payload = {
      ...formData,
      id: editingPlan ? editingPlan.id : undefined
    };

    const updated = saveContentPlan(payload);
    setPlans(updated);
    setIsModalOpen(false);

    if (showToast) {
      showToast(
        editingPlan ? 'Rencana konten berhasil diperbarui!' : 'Rencana konten baru berhasil ditambahkan ke kalender!',
        'success'
      );
    }
  };

  // Delete Plan
  const handleDeletePlan = (id) => {
    if (window.confirm('Hapus rencana konten ini dari kalender?')) {
      const updated = deleteContentPlan(id);
      setPlans(updated);
      if (showToast) showToast('Rencana konten berhasil dihapus', 'info');
    }
  };

  // Advance Plan Status
  const handleCycleStatus = (plan) => {
    let nextStatus = 'ready';
    if (plan.status === 'draft') nextStatus = 'ready';
    else if (plan.status === 'ready') nextStatus = 'published';
    else if (plan.status === 'published') nextStatus = 'draft';

    const updated = updatePlanStatus(plan.id, nextStatus);
    setPlans(updated);
    if (showToast) {
      const statusLabels = { ready: 'Siap Rilis / Produksi', published: 'Sudah Tayang (Live)', draft: 'Draft' };
      showToast(`Status konten diubah ke: ${statusLabels[nextStatus]}`, 'success');
    }
  };

  // Reset to Defaults
  const handleResetDefaults = () => {
    if (window.confirm('Reset kalender konten ke rencana standar awal TeeStock?')) {
      const reset = resetDefaultContentPlans();
      setPlans(reset);
      if (showToast) showToast('Kalender konten direset ke rencana bawaan CMO', 'info');
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    try {
      exportContentCalendarCsv(filteredPlans);
      if (showToast) showToast(`Berhasil mengekspor ${filteredPlans.length} rencana konten ke CSV!`, 'success');
    } catch (e) {
      if (showToast) showToast('Gagal mengekspor CSV kalender konten', 'error');
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto text-slate-100">
      {/* Topbar Header */}
      <AdminTopbar 
        title="Marketing Hub & Social SEO Engine"
        subtitle="Kalender Konten Pilar 4E, Amunisi Swipe File CMO & Optimasi Algoritma Penjualan Organik"
        badge="CMO Growth Engine"
      />

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 -mt-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F15A24]/10 text-[#F15A24] border border-[#F15A24]/20">
            <Megaphone className="w-3.5 h-3.5" />
            Holding MultiGraph & TeeStock
          </span>
          <span className="text-xs text-slate-400 font-mono hidden md:inline">
            4E Formula • Organic Conversion
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleResetDefaults}
            className="border-white/10 hover:bg-white/5 text-slate-300 hover:text-white"
            title="Reset data konten ke draf bawaan CMO"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
            Reset Draf
          </Button>

          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportCsv}
            className="border-white/10 hover:bg-white/5 text-slate-300 hover:text-white"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            Ekspor CSV ({filteredPlans.length})
          </Button>

          <Button 
            variant="primary" 
            size="sm"
            onClick={() => handleOpenModal()}
            className="bg-[#F15A24] hover:bg-[#d94e1d] text-white shadow-lg shadow-[#F15A24]/20 font-medium"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Tambah Konten Baru
          </Button>
        </div>
      </div>

      {/* 4 Executive KPI Ribbon Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Content */}
        <Card className="p-4 bg-[#121215] border-white/[0.08] hover:border-[#F15A24]/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Rencana Konten</span>
            <div className="w-8 h-8 rounded-lg bg-[#F15A24]/10 border border-[#F15A24]/20 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-[#F15A24]" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-white">{kpis.totalPlans} Artikel</div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
              <span className="text-amber-400 font-medium">{kpis.draftCount} Draft</span>
              <span>•</span>
              <span className="text-sky-400 font-medium">{kpis.readyCount} Siap</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">{kpis.publishedCount} Tayang</span>
            </div>
          </div>
        </Card>

        {/* KPI 2: Keseimbangan 4E */}
        <Card className="p-4 bg-[#121215] border-white/[0.08] hover:border-sky-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Keseimbangan Pilar 4E</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
              <Layers className="w-4 h-4 text-sky-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-white">
              {kpis.pillarPercentages.entertain}% : {kpis.pillarPercentages.educate}% : {kpis.pillarPercentages.emotion}% : {kpis.pillarPercentages.promote}%
            </div>
            <div className="flex items-center gap-1.5 mt-2 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-pink-500 transition-all" 
                style={{ width: `${kpis.pillarPercentages.entertain}%` }} 
                title={`Entertain: ${kpis.pillarPercentages.entertain}%`}
              />
              <div 
                className="h-full bg-sky-500 transition-all" 
                style={{ width: `${kpis.pillarPercentages.educate}%` }} 
                title={`Educate: ${kpis.pillarPercentages.educate}%`}
              />
              <div 
                className="h-full bg-amber-500 transition-all" 
                style={{ width: `${kpis.pillarPercentages.emotion}%` }} 
                title={`Emotion: ${kpis.pillarPercentages.emotion}%`}
              />
              <div 
                className="h-full bg-emerald-500 transition-all" 
                style={{ width: `${kpis.pillarPercentages.promote}%` }} 
                title={`Promote: ${kpis.pillarPercentages.promote}%`}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span className="text-pink-400">Ent {kpis.pillarCounts.entertain}</span>
              <span className="text-sky-400">Edu {kpis.pillarCounts.educate}</span>
              <span className="text-amber-400">Emo {kpis.pillarCounts.emotion}</span>
              <span className="text-emerald-400">Pro {kpis.pillarCounts.promote}</span>
            </div>
          </div>
        </Card>

        {/* KPI 3: Kanal Distribusi */}
        <Card className="p-4 bg-[#121215] border-white/[0.08] hover:border-pink-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Kanal Distribusi</span>
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
              <Share2 className="w-4 h-4 text-pink-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-white">
              {kpis.channelCounts.tiktok + kpis.channelCounts.instagram + kpis.channelCounts.whatsapp} Slot
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
              <span className="text-pink-400 font-medium">TikTok ({kpis.channelCounts.tiktok})</span>
              <span>•</span>
              <span className="text-purple-400 font-medium">IG ({kpis.channelCounts.instagram})</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">WA ({kpis.channelCounts.whatsapp})</span>
            </div>
          </div>
        </Card>

        {/* KPI 4: Swipe Files */}
        <Card className="p-4 bg-[#121215] border-white/[0.08] hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Swipe File Teruji</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold tracking-tight text-white">{kpis.swipeFileCount} Naskah Siap Pakai</div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Direct Response Copywriting CMO</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Social SEO Banner & Checklist */}
      {showSeoGuide && (
        <div className="relative overflow-hidden rounded-2xl border border-sky-500/20 bg-gradient-to-r from-sky-950/40 via-[#121215] to-purple-950/30 p-5 shadow-lg">
          <button 
            onClick={() => setShowSeoGuide(false)}
            className="absolute top-4 right-4 text-slate-500 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
            title="Sembunyikan panduan SEO"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-sky-400" />
            </div>
            <div className="space-y-2 max-w-4xl">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Social SEO Checklist (Algoritma TikTok & Instagram Search 2026)
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30">
                  Ranking #1 Search
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Algoritma saat ini mengutamakan konten yang menjawab pertanyaan spesifik pencari (Search Intent). Sebelum publish video atau foto, pastikan 4 pilar SEO berikut terpenuhi:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>1. In-Video Text</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Teks hook wajib muncul di layar dalam 3 detik pertama (dibaca oleh OCR TikTok).
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>2. Spoken Keywords</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Ucapkan kata kunci utama secara lantang (algoritma transkrip audio ke teks pencarian).
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>3. First 2 Lines Caption</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Kalimat 1 & 2 caption wajib menyertakan keyword utama sebelum tombol "more / baca selengkapnya".
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>4. 5 Targeted Hashtags</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Gunakan formula: 2 broad (#streetwear, #kaospria) + 2 niche (#kaosboxy, #dtfprint) + 1 brand (#teestock).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="border-b border-white/[0.08] flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 -mb-px">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'calendar'
                ? 'border-[#F15A24] text-[#F15A24]'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-white/20'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Kalender Konten 4E ({plans.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('swipe')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'swipe'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-white/20'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>CMO Swipe Files ({SWIPE_FILES.length})</span>
          </button>
        </div>

        {!showSeoGuide && (
          <button 
            onClick={() => setShowSeoGuide(true)}
            className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 pb-2"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Tampilkan SEO Checklist</span>
          </button>
        )}
      </div>

      {/* TAB 1: KALENDER KONTEN 4E */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          {/* Controls & Filter Bar */}
          <div className="p-4 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text"
                  placeholder="Cari judul konten, hook 3-detik, kata kunci SEO, atau caption..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F15A24]/60 transition-colors"
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

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 self-start md:self-auto overflow-x-auto pb-1 md:pb-0">
                <span className="text-xs text-slate-500 font-medium mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Status:
                </span>
                {['all', 'draft', 'ready', 'published'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      statusFilter === st
                        ? 'bg-white text-black font-bold'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {st === 'all' ? 'Semua' : st === 'ready' ? 'Siap Rilis' : st === 'published' ? 'Tayang' : 'Draft'}
                  </button>
                ))}
              </div>
            </div>

            {/* Channels & 4E Pillar Filter Pills */}
            <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
              {/* Channel Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-500 mr-1">Saluran:</span>
                <button
                  onClick={() => setChannelFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    channelFilter === 'all'
                      ? 'bg-[#F15A24] text-white shadow-sm'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  Semua Kanal
                </button>
                <button
                  onClick={() => setChannelFilter('tiktok')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                    channelFilter === 'tiktok'
                      ? 'bg-pink-500 text-white shadow-sm'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <Video className="w-3 h-3 text-pink-400" />
                  TikTok Video
                </button>
                <button
                  onClick={() => setChannelFilter('instagram')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                    channelFilter === 'instagram'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <Instagram className="w-3 h-3 text-purple-400" />
                  Instagram Reels
                </button>
                <button
                  onClick={() => setChannelFilter('whatsapp')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                    channelFilter === 'whatsapp'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  <Smartphone className="w-3 h-3 text-emerald-400" />
                  WhatsApp Status/Broadcast
                </button>
              </div>

              {/* 4E Pillar Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-500 mr-1">Pilar 4E:</span>
                <button
                  onClick={() => setPillarFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    pillarFilter === 'all'
                      ? 'bg-white/20 text-white font-bold'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  Semua Pilar
                </button>
                {Object.keys(PILLARS_4E).map((key) => {
                  const pil = PILLARS_4E[key];
                  const isActive = pillarFilter === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setPillarFilter(key)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                        isActive
                          ? `${pil.badgeColor} border-current font-bold shadow-sm`
                          : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {pil.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content List Grid */}
          {filteredPlans.length === 0 ? (
            <Card className="p-12 text-center bg-[#121215] border-white/[0.08]">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-slate-500 mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-white">Tidak ada rencana konten ditemukan</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Coba sesuaikan kata kunci pencarian atau ubah filter pilar dan saluran konten.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setChannelFilter('all'); setPillarFilter('all'); setStatusFilter('all'); setSearchQuery(''); }}
                className="mt-4 border-white/10 text-xs"
              >
                Reset Semua Filter
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPlans.map((plan) => {
                const pilar = PILLARS_4E[plan.pillar] || PILLARS_4E.educate;
                const channel = CHANNELS_CONFIG[plan.channel] || CHANNELS_CONFIG.tiktok;
                const isReady = plan.status === 'ready';
                const isPublished = plan.status === 'published';

                return (
                  <Card 
                    key={plan.id}
                    className="p-5 bg-[#121215] border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Card Header: Channel, Pillar, Date & Status */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {/* Channel Badge */}
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${channel.badgeColor}`}>
                            {plan.channel === 'tiktok' ? <Video className="w-3 h-3" /> :
                             plan.channel === 'instagram' ? <Instagram className="w-3 h-3" /> :
                             <Smartphone className="w-3 h-3" />}
                            {channel.label.split(' ')[0]}
                          </span>

                          {/* 4E Pillar Badge */}
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${pilar.badgeColor}`}>
                            {pilar.label}
                          </span>

                          {/* Date */}
                          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {plan.targetDate}
                          </span>
                        </div>

                        {/* Status Button (Cycles status on click) */}
                        <button
                          onClick={() => handleCycleStatus(plan)}
                          title="Klik untuk mengubah status konten"
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border transition-all ${
                            isPublished
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                              : isReady
                              ? 'bg-sky-500/10 text-sky-400 border-sky-500/30 hover:bg-sky-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-400' : isReady ? 'bg-sky-400' : 'bg-amber-400'}`} />
                          <span>{isPublished ? 'Tayang' : isReady ? 'Siap Rilis' : 'Draft'}</span>
                        </button>
                      </div>

                      {/* Content Title */}
                      <h4 className="text-sm font-bold text-white leading-snug">
                        {plan.title}
                      </h4>

                      {/* Hook 3 Detik Box */}
                      <div className="rounded-xl bg-black/40 border border-white/[0.06] p-3 space-y-1">
                        <span className="text-[10px] font-bold text-[#F15A24] uppercase tracking-wider flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          Hook 3 Detik Pertama:
                        </span>
                        <p className="text-xs text-slate-200 italic font-medium leading-relaxed">
                          "{plan.hookCopy}"
                        </p>
                      </div>

                      {/* Caption Preview */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Naskah Caption & CTA:
                        </span>
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.04]">
                          {plan.caption}
                        </p>
                      </div>

                      {/* Social SEO Keywords */}
                      {plan.seoKeywords && (
                        <div className="flex flex-wrap items-center gap-1 pt-1">
                          <Hash className="w-3 h-3 text-sky-400 shrink-0" />
                          {plan.seoKeywords.split(',').map((kw, i) => (
                            <span 
                              key={i} 
                              className="px-2 py-0.5 rounded text-[10px] bg-sky-500/10 text-sky-300 border border-sky-500/20 font-mono"
                            >
                              {kw.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Actions Footer */}
                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenModal(plan)}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                          title="Edit Rencana Konten"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePlan(plan.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                          title="Hapus Rencana Konten"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopy(plan.id, `${plan.hookCopy}\n\n${plan.caption}\n\nKeywords: ${plan.seoKeywords}`, 'Naskah hook & caption berhasil disalin!')}
                        className="border-white/10 hover:bg-white/5 text-xs text-slate-300 hover:text-white"
                      >
                        {copiedId === plan.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 mr-1.5 text-[#F15A24]" />
                            <span>Salin Naskah</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CMO SWIPE FILES */}
      {activeTab === 'swipe' && (
        <div className="space-y-6">
          {/* Header Description & Sub-filters */}
          <div className="p-4 rounded-2xl bg-[#121215] border border-white/[0.08] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  CMO Direct-Response Swipe Files
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Arsip naskah penjualan teruji: 3-second attention hooks, handling keberatan pelanggan, dan script WhatsApp closing rate tinggi.
                </p>
              </div>

              {/* Sub-category Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: 'Semua Amunisi' },
                  { id: 'video_hook', label: 'Hook Video 3-Detik' },
                  { id: 'objection', label: 'Objection Handling' },
                  { id: 'whatsapp', label: 'Script WhatsApp' },
                  { id: 'vip_launch', label: 'VIP Launch Drop' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSwipeCategory(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      swipeCategory === tab.id
                        ? 'bg-amber-400 text-black shadow-md'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Swipe Files Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSwipes.map((sw) => {
              const isCopied = copiedId === sw.id;
              return (
                <Card 
                  key={sw.id}
                  className="p-5 bg-[#121215] border-white/[0.08] hover:border-amber-400/30 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-400/10 text-amber-300 border border-amber-400/20">
                        {sw.categoryLabel}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase">
                        CMO Cabinet
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white leading-snug">
                      {sw.title}
                    </h4>

                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] text-xs text-slate-200 leading-relaxed">
                      {sw.text}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(sw.id, sw.text, `Naskah "${sw.title}" berhasil disalin!`)}
                      className="border-white/10 hover:bg-amber-400/10 hover:border-amber-400/30 text-xs text-slate-300 hover:text-amber-300 transition-colors"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Naskah Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                          <span>Salin Naskah Ini</span>
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

      {/* MODAL: TAMBAH / EDIT RENCANA KONTEN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#121215] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#F15A24]/10 border border-[#F15A24]/20 flex items-center justify-center">
                  <Megaphone className="w-4 h-4 text-[#F15A24]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingPlan ? 'Edit Rencana Konten' : 'Tambah Rencana Konten Baru'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Formula 4E Content Pillars & Social SEO Hook
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitPlan} className="space-y-4">
              {/* Row 1: Channel & Pillar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Saluran Distribusi (Media)
                  </label>
                  <select
                    value={formData.channel}
                    onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#F15A24]"
                  >
                    <option value="tiktok">TikTok Video (9:16)</option>
                    <option value="instagram">Instagram Reels / Carousel</option>
                    <option value="whatsapp">WhatsApp Status / Broadcast</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Pilar Konten 4E
                  </label>
                  <select
                    value={formData.pillar}
                    onChange={(e) => setFormData({ ...formData, pillar: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#F15A24]"
                  >
                    <option value="entertain">Entertain (30%) - Humor & Parodi</option>
                    <option value="educate">Educate (30%) - Spesifikasi & Tips</option>
                    <option value="emotion">Emotion / BTS (25%) - Kisah & Workshop</option>
                    <option value="promote">Promote (15%) - Drop Rilis & Voucher</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Target Date & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Tanggal Target Rilis
                  </label>
                  <input
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#F15A24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Status Produksi
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#F15A24]"
                  >
                    <option value="draft">Draft (Konsep Ide)</option>
                    <option value="ready">Siap Rilis / Produksi</option>
                    <option value="published">Sudah Tayang (Live)</option>
                  </select>
                </div>
              </div>

              {/* Judul Konten */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Judul Rencana Konten *
                </label>
                <input
                  type="text"
                  placeholder="Misal: BTS Heat Press 155°C & Suara Squelch Cold Peel"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F15A24]"
                  required
                />
              </div>

              {/* Hook 3 Detik */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#F15A24] flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" />
                    Hook 3 Detik Pertama (Penentu Retensi Video) *
                  </label>
                  <span className="text-[10px] text-slate-500">Kunci Stop-Scroll</span>
                </div>
                <textarea
                  rows={2}
                  placeholder='Contoh: "Banyak yang jual kaos distro 50 ribuan tapi baru 3x cuci lehernya melar kayak daster..."'
                  value={formData.hookCopy}
                  onChange={(e) => setFormData({ ...formData, hookCopy: e.target.value })}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F15A24]"
                  required
                />
              </div>

              {/* Caption & CTA */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Naskah Caption & Call-to-Action (CTA) *
                </label>
                <textarea
                  rows={4}
                  placeholder="Tuliskan naskah caption lengkap beserta hashtag dan ajakan bertindak (Link di bio, komen, dll)..."
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F15A24]"
                  required
                />
              </div>

              {/* Kata Kunci Social SEO */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-sky-400 flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5" />
                    Kata Kunci Social SEO (Dipisah Tanda Koma)
                  </label>
                  <span className="text-[10px] text-slate-500">TikTok & IG Search</span>
                </div>
                <input
                  type="text"
                  placeholder="Contoh: proses sablon dtf, heat press 155 derajat, kaos boxy katun murni"
                  value={formData.seoKeywords}
                  onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="border-white/10 text-slate-300 hover:text-white"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="bg-[#F15A24] hover:bg-[#d94e1d] text-white font-semibold"
                >
                  {editingPlan ? 'Simpan Perubahan' : 'Terbitkan ke Kalender'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
