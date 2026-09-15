import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Coins, 
  CheckCircle2, 
  UploadCloud, 
  Send
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { formatRupiah } from '../../utils/formatters';
import { sanitizePhoneNumber } from '../../utils/whatsappTemplates';
import { supabase } from '../../services/supabase';
import { useStore } from '../../context/StoreContext';
import { SEOHead } from '../../components/common/SEOHead';

export function CreatorPage() {
  const { storeSettings } = useStore();
  const cleanWhatsapp = sanitizePhoneNumber(storeSettings?.storeWhatsapp || '085220274968');

  // Interactive Royalty Estimator
  const [estimatedSales, setEstimatedSales] = useState(40);
  const royaltyPerPcs = 25000;
  const estimatedEarning = estimatedSales * royaltyPerPcs;

  // Form Submission State
  const [creatorName, setCreatorName] = useState('');
  const [creatorEmail, setCreatorEmail] = useState('');
  const [creatorWhatsapp, setCreatorWhatsapp] = useState('');
  const [socialHandle, setSocialHandle] = useState('');
  const [designTitle, setDesignTitle] = useState('');
  const [nicheCategory, setNicheCategory] = useState('Kopi & Kafe');
  const [driveLink, setDriveLink] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  const nicheOptions = [
    '☕ Kopi & Kafe',
    '💻 Tech, Coding & Developer',
    '🐱 Anak Bulu (Kucing/Anjing)',
    '😂 Humor & Sarkasme Santai',
    '🖋️ Tipografi & Statement',
    '🏔️ Outdoor & Nature',
    '🛹 Urban & Musik Indie',
    '🎨 Seni Ilustrasi Abstrak'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!creatorName.trim() || !creatorWhatsapp.trim() || !designTitle.trim() || !driveLink.trim()) {
      setFormError('Mohon lengkapi seluruh kolom bertanda bintang (*).');
      return;
    }

    if (!agreedTerms) {
      setFormError('Anda wajib menyetujui pernyataan keaslian karya dan hak cipta.');
      return;
    }

    setSubmitting(true);

    try {
      // Try saving to Supabase ts_creator_submissions
      const { error } = await supabase
        .from('ts_creator_submissions')
        .insert([
          {
            creator_name: creatorName.trim(),
            creator_email: creatorEmail.trim(),
            creator_whatsapp: creatorWhatsapp.trim(),
            design_title: designTitle.trim(),
            niche_category: nicheCategory,
            master_drive_link: driveLink.trim(),
            agreed_to_terms: agreedTerms,
            status: 'pending'
          }
        ]);

      if (error) {
        console.warn('Supabase submission insert warning:', error);
        // If table doesn't exist yet, we still proceed to success and offer WA notification
      }

      setSubmittedSuccess(true);
    } catch (err) {
      console.warn('Submission caught error:', err);
      setSubmittedSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  const getWaMessage = () => {
    const text = `Halo Admin TeeStock! Saya baru saja mengirim submission desain karya:\n\n` +
      `• Nama Kreator: ${creatorName}\n` +
      `• Judul Desain: ${designTitle}\n` +
      `• Kategori: ${nicheCategory}\n` +
      `• Link Master GDrive: ${driveLink}\n\n` +
      `Mohon dibantu review kurasi untuk katalog TeeStock ya. Terima kasih!`;
    return `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-ts-bg text-ts-krem py-8 sm:py-16">
      <SEOHead
        title="Panggung Kreator // TeeStock Curated Apparel House"
        description="Panggung bagi ilustrator dan kreator lokal. Jual karya desainmu di atas katun New States Apparel tanpa modal, dapat royalti Rp 25.000 per kaos."
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-20">
        
        {/* Hero Section: Value Proposition */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ts-surface border border-ts-border text-xs text-ts-terracotta font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CREATOR LAUNCHPAD // ZERO RISK</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-ts-krem tracking-tight leading-tight">
            Panggung untuk Karyamu. <br className="hidden sm:inline" />
            <span className="text-ts-terracotta">Tanpa Modal &amp; Bebas Ribet.</span>
          </h1>

          <p className="text-sm sm:text-base text-ts-kremMuted max-w-2xl mx-auto leading-relaxed">
            Kamu fokus menggambar dan bercerita. Biar TeeStock yang mengurus belanja kain New States Apparel (NSA), cetak DTF 155°C, packing rapi, hingga kirim ke tangan pendukungmu.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-4 text-xs font-mono text-ts-kremMuted">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Royalti Bersih Rp 25.000/pcs</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Hak Cipta 100% Milikmu</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Dicetak di Katun NSA 24s</span>
          </div>
        </div>

        {/* 3 Steps Process */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <Card className="p-6 bg-ts-surface border-ts-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-ts-terracotta/20 text-ts-terracotta flex items-center justify-center font-black font-mono">
              01
            </div>
            <h3 className="font-bold text-base text-ts-krem">Submit Karyamu</h3>
            <p className="text-xs text-ts-kremMuted leading-relaxed">
              Kirimkan file PNG transparan 300 DPI melalui form di bawah. Lolos kurasi cepat dalam 1x24 jam.
            </p>
          </Card>

          <Card className="p-6 bg-ts-surface border-ts-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-black font-mono">
              02
            </div>
            <h3 className="font-bold text-base text-ts-krem">Kami Produksi &amp; Kirim</h3>
            <p className="text-xs text-ts-kremMuted leading-relaxed">
              Tiap ada pesanan, kami press di in-house studio kami pada suhu 155°C dan kirim langsung dari Depok ke seluruh Indonesia.
            </p>
          </Card>

          <Card className="p-6 bg-ts-surface border-ts-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-black font-mono">
              03
            </div>
            <h3 className="font-bold text-base text-ts-krem">Terima Royalti Bulanan</h3>
            <p className="text-xs text-ts-kremMuted leading-relaxed">
              Dapatkan royalti bersih Rp 25.000 per kaos terjual yang ditransfer otomatis ke rekeningmu tiap awal bulan.
            </p>
          </Card>
        </div>

        {/* Interactive Royalty Simulator */}
        <Card className="p-6 sm:p-8 bg-ts-surface border-ts-border shadow-elevation space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ts-border pb-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-500">
                <Coins className="w-4 h-4" />
                <span>SIMULATOR ROYALTIF KREATOR</span>
              </div>
              <h2 className="text-xl font-bold text-ts-krem mt-1">Berapa Potensi Penghasilan Karyamu?</h2>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs font-mono text-ts-kremMuted block">Estimasi Royalti Masuk</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-500 font-mono">
                {formatRupiah(estimatedEarning)}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs font-mono text-ts-kremMuted">
              <span>Target Penjualan Kaos: <strong className="text-ts-krem text-sm">{estimatedSales} pcs / bulan</strong></span>
              <span>Royalti: Rp 25.000 / pcs</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              step="5"
              value={estimatedSales}
              onChange={(e) => setEstimatedSales(Number(e.target.value))}
              className="w-full h-2 bg-ts-surfaceHover rounded-lg appearance-none cursor-pointer accent-ts-terracotta"
            />
            <div className="flex justify-between text-[10px] font-mono text-ts-kremMuted">
              <span>10 pcs ({formatRupiah(250000)})</span>
              <span>50 pcs ({formatRupiah(1250000)})</span>
              <span>100 pcs ({formatRupiah(2500000)})</span>
              <span>200 pcs ({formatRupiah(5000000)})</span>
            </div>
          </div>
        </Card>

        {/* Submission Form Section */}
        <div id="submit-form" className="max-w-2xl mx-auto space-y-6 scroll-mt-20">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-ts-krem">Formulir Kirim Desain</h2>
            <p className="text-xs sm:text-sm text-ts-kremMuted">
              Isi data karyamu di bawah ini. Tim kurator kami akan mereview dan mengonfirmasimu via WhatsApp.
            </p>
          </div>

          {submittedSuccess ? (
            <Card className="p-8 bg-ts-surface border-emerald-500/40 text-center space-y-4 shadow-elevation">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-ts-krem">Karya Berhasil Dikirimkan!</h3>
              <p className="text-xs sm:text-sm text-ts-kremMuted leading-relaxed max-w-md mx-auto">
                Terima kasih telah mempercayakan karyamu kepada TeeStock. Kami akan melakukan pre-flight check (300 DPI &amp; komposisi) dalam 1x24 jam.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                <a href={getWaMessage()} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" icon={Send} className="w-full sm:w-auto">
                    Konfirmasi via WhatsApp
                  </Button>
                </a>
                <Button variant="secondary" onClick={() => setSubmittedSuccess(false)} className="w-full sm:w-auto">
                  Kirim Desain Lain
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-6 sm:p-8 bg-ts-surface border-ts-border shadow-elevation">
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                {formError && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Nama Kreator / Moniker *"
                    placeholder="Contoh: Budi Studio / SenimanKucing"
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                    required
                  />
                  <Input
                    label="Nomor WhatsApp *"
                    placeholder="Contoh: 08123456789"
                    value={creatorWhatsapp}
                    onChange={(e) => setCreatorWhatsapp(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Email (Opsional)"
                    type="email"
                    placeholder="nama@gmail.com"
                    value={creatorEmail}
                    onChange={(e) => setCreatorEmail(e.target.value)}
                  />
                  <Input
                    label="Akun Instagram / X / Portofolio"
                    placeholder="@senimankeren"
                    value={socialHandle}
                    onChange={(e) => setSocialHandle(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-ts-kremMuted block">Kategori Niche Karya *</label>
                  <select
                    value={nicheCategory}
                    onChange={(e) => setNicheCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ts-bg border border-ts-border text-ts-krem text-xs focus:outline-none focus:border-ts-terracotta transition-all"
                  >
                    {nicheOptions.map((niche) => (
                      <option key={niche} value={niche}>{niche}</option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Judul Desain Karya *"
                  placeholder="Contoh: Kopi Tubruk & Filosofi Lembur"
                  value={designTitle}
                  onChange={(e) => setDesignTitle(e.target.value)}
                  required
                />

                <div className="space-y-1.5">
                  <Input
                    label="Link Google Drive File Master (PNG 300 DPI Transparan) *"
                    placeholder="https://drive.google.com/drive/folders/..."
                    value={driveLink}
                    onChange={(e) => setDriveLink(e.target.value)}
                    required
                  />
                  <span className="text-[11px] text-ts-kremMuted block">
                    Pastikan akses link diatur ke <em>"Anyone with the link can view"</em>.
                  </span>
                </div>

                {/* S&K Box */}
                <div className="p-3.5 rounded-xl bg-ts-bg border border-ts-border space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-ts-krem leading-relaxed">
                    <input
                      type="checkbox"
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="mt-0.5 rounded border-ts-border text-ts-terracotta focus:ring-0 cursor-pointer"
                    />
                    <span>
                      Saya menjamin bahwa karya ini adalah <strong>100% orisinal ciptaan saya sendiri</strong>, bukan hasil plagiasi, comotan internet, atau pelanggaran HAKI. Saya setuju menerima royalti bersih Rp 25.000 per pcs terjual.
                    </span>
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  icon={UploadCloud}
                  loading={submitting}
                  className="w-full justify-center text-xs sm:text-sm font-bold mt-2"
                >
                  Kirim Karya untuk Dikurasi
                </Button>
              </form>
            </Card>
          )}
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto space-y-4 border-t border-ts-border pt-10">
          <h3 className="text-base font-bold text-ts-krem text-center">Pertanyaan yang Sering Diajukan Kreator</h3>
          <div className="space-y-3 text-xs">
            <Card className="p-4 bg-ts-surface border-ts-border space-y-1">
              <span className="font-bold text-ts-krem block">Apakah hak cipta karya saya tetap milik saya?</span>
              <p className="text-ts-kremMuted leading-relaxed">
                Ya, 100%! Hak cipta moral dan kepemilikan karya tetap milik Anda sepenuhnya. TeeStock hanya memegang hak lisensi cetak ritel di media kaos selama Anda memilih untuk menampilkannya di katalog kami.
              </p>
            </Card>
            <Card className="p-4 bg-ts-surface border-ts-border space-y-1">
              <span className="font-bold text-ts-krem block">Kapan dan bagaimana royalti dicairkan?</span>
              <p className="text-ts-kremMuted leading-relaxed">
                Royalti dihitung secara transparan dan dicairkan setiap tanggal 5 awal bulan melalui transfer bank ke rekening Anda, dengan batas penarikan minimum Rp 100.000.
              </p>
            </Card>
            <Card className="p-4 bg-ts-surface border-ts-border space-y-1">
              <span className="font-bold text-ts-krem block">Apakah saya harus membayar biaya pendaftaran?</span>
              <p className="text-ts-kremMuted leading-relaxed">
                Sama sekali tidak. Menjadi kreator di TeeStock 100% gratis tanpa biaya apapun.
              </p>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}
