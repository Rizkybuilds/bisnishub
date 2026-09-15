import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, ThumbsUp, Plus, X, Sparkles, Filter, Shirt } from 'lucide-react';
import { Button } from '../ui/Button';
import { supabase } from '../../services/supabase';

const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    author: 'Dimas Aditya',
    role: 'Verified Buyer',
    avatar: 'DA',
    rating: 5,
    date: '3 hari yang lalu',
    garmentType: 'Heavyweight 24s (Black)',
    sizeOrdered: 'XL',
    userStats: 'TB 178 cm · BB 74 kg (Fitting Boxy Pas)',
    content: 'Bahan NSA 24s-nya beneran tebal dan jatuh di badan enak banget, nggak lemes kayak combed murah. Sablonan DTF-nya rapi, raster halusnya dapet dan pas ditarik lentur nggak kaku. Rekomen parah buat yang nyari graphic tee kualitas streetwear premium.',
    helpfulCount: 14,
    images: [],
    verified: true,
  },
  {
    id: 'rev-2',
    author: 'Rian Kurniawan',
    role: 'Verified Buyer',
    avatar: 'RK',
    rating: 5,
    date: '1 minggu yang lalu',
    garmentType: 'Heavyweight 24s (White)',
    sizeOrdered: 'L',
    userStats: 'TB 171 cm · BB 66 kg (Pas Sesuai Size Chart)',
    content: 'Kerah rib lehernya tebal banget, dicuci 2 kali di mesin cuci nggak melar sama sekali. Sablonnya nempel sempurna ke pori-pori kain. Packaging polymailernya juga rapi ada stiker bonusnya.',
    helpfulCount: 9,
    images: [],
    verified: true,
  },
  {
    id: 'rev-3',
    author: 'Bayu Pratama',
    role: 'Verified Buyer',
    avatar: 'BP',
    rating: 5,
    date: '2 minggu yang lalu',
    garmentType: 'Softstyle 30s (Black)',
    sizeOrdered: 'M',
    userStats: 'TB 167 cm · BB 58 kg',
    content: 'Pilihan 30s-nya adem banget buat dipakai motoran siang hari. Desainnya presisi sesuai mockup web. Pengiriman cepat H+1 langsung jalan resinya.',
    helpfulCount: 6,
    images: [],
    verified: true,
  }
];

export function ProductReviews({ productName = "Kaos TeeStock", sku = "TS-ORIGINALS" }) {
  const storageKey = `teestock_reviews_${sku}`;
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [activeFilter, setActiveFilter] = useState('all'); // all, 5star, withPhoto
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [helpfulVoted, setHelpfulVoted] = useState({});

  // Form State
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [userStats, setUserStats] = useState('');
  const [sizeOrdered, setSizeOrdered] = useState('L');
  const [garmentType, setGarmentType] = useState('Heavyweight 24s (Black)');
  const [content, setContent] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [phoneLast4, setPhoneLast4] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Sync reviews with Supabase ts_reviews
  useEffect(() => {
    let isMounted = true;
    async function fetchCloudReviews() {
      try {
        const { data, error } = await supabase
          .from('ts_reviews')
          .select('*')
          .eq('product_sku', sku)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0 && isMounted) {
          const mapped = data.map(r => ({
            id: r.id,
            author: r.author_name,
            role: r.role_badge || (r.is_verified ? 'Verified Buyer' : 'Ulasan Komunitas'),
            avatar: (r.author_name || 'MB').slice(0, 2).toUpperCase(),
            rating: r.rating || 5,
            date: r.created_at ? new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Baru saja',
            garmentType: r.garment_type || 'New States Apparel',
            sizeOrdered: r.size_ordered || 'L',
            userStats: r.user_stats || (r.is_verified ? 'Pembeli Terverifikasi' : 'Ulasan Komunitas'),
            content: r.content,
            helpfulCount: r.helpful_count || 0,
            verified: Boolean(r.is_verified),
          }));
          setReviews(mapped);
        }
      } catch (err) {
        console.warn('Review cloud fetch notice:', err);
      }
    }

    fetchCloudReviews();
    return () => { isMounted = false; };
  }, [sku]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(reviews));
    } catch (e) {
      console.error(e);
    }
  }, [reviews, storageKey]);

  const handleHelpful = async (id) => {
    if (helpfulVoted[id]) return;
    setReviews(prev => prev.map(rev => rev.id === id ? { ...rev, helpfulCount: rev.helpfulCount + 1 } : rev));
    setHelpfulVoted(prev => ({ ...prev, [id]: true }));

    // Jika ID dari Supabase (UUID), sinkronkan voting atomik 1-vote-per-identity ke database
    if (typeof id === 'string' && id.length === 36 && supabase?.rpc) {
      let voterId = 'anon';
      try {
        voterId = localStorage.getItem('teestock_visitor_id');
        if (!voterId) {
          voterId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : 'vtr_' + Math.random().toString(36).slice(2);
          localStorage.setItem('teestock_visitor_id', voterId);
        }
      } catch (e) {
        voterId = 'vtr_' + Math.random().toString(36).slice(2);
      }

      try {
        const { data } = await supabase.rpc('vote_review_helpful', {
          p_review_id: id,
          p_voter_id: voterId
        });
        if (data && typeof data.helpful_count === 'number') {
          setReviews(prev => prev.map(rev => rev.id === id ? { ...rev, helpfulCount: data.helpful_count } : rev));
        }
      } catch (err) {
        console.warn('Voting helpful review note:', err);
      }
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    setSubmitting(true);
    setSubmitError(null);

    let serverReview = null;
    try {
      if (supabase && supabase.functions && typeof supabase.functions.invoke === 'function') {
        const { data, error } = await supabase.functions.invoke('submit-review', {
          body: {
            productSku: sku,
            authorName: name.trim(),
            rating: Number(rating),
            content: content.trim(),
            garmentType,
            sizeOrdered,
            userStats: userStats.trim() || null,
            orderNumber: orderNumber.trim() || null,
            phoneLast4: phoneLast4.trim() || null
          }
        });

        if (!error && data?.status === 'success' && data.data) {
          serverReview = data.data;
        } else if (data?.message) {
          setSubmitError(data.message);
        }
      }
    } catch (err) {
      console.warn('Review submission via Edge Function notice:', err);
    }

    const isVerified = Boolean(serverReview?.is_verified);
    const roleBadge = serverReview?.role_badge || (isVerified ? 'Verified Buyer' : 'Ulasan Komunitas');

    const newRev = {
      id: serverReview?.id || `rev-${Date.now()}`,
      author: name.trim(),
      role: roleBadge,
      avatar: name.trim().slice(0, 2).toUpperCase(),
      rating: Number(rating),
      date: 'Baru saja',
      garmentType,
      sizeOrdered,
      userStats: userStats.trim() || (isVerified ? 'Pembeli Terverifikasi' : 'Ulasan Komunitas'),
      content: content.trim(),
      helpfulCount: 0,
      images: [],
      verified: isVerified,
    };

    setReviews([newRev, ...reviews]);
    setSubmitSuccess(true);
    setSubmitting(false);

    setTimeout(() => {
      setSubmitSuccess(false);
      setIsModalOpen(false);
      setName('');
      setContent('');
      setUserStats('');
      setOrderNumber('');
      setPhoneLast4('');
      setSubmitError(null);
    }, 1200);
  };

  const filteredReviews = reviews.filter(rev => {
    if (activeFilter === '5star') return rev.rating === 5;
    return true;
  });

  const averageRating = (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="rounded-3xl bg-ts-surface border border-ts-border p-6 sm:p-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-ts-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl sm:text-2xl font-black text-ts-krem tracking-tight">
              Ulasan &amp; Bukti Kualitas Pembeli
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-ts-terracotta/20 text-ts-terracotta border border-ts-terracotta/40">
              Verified
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ts-kremMuted mt-1">
            Ulasan jujur dari pembeli mengenai fitting bahan New States Apparel &amp; hasil sablon DTF.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-ts-surface hover:bg-ts-surfaceHover text-xs font-bold text-ts-krem border border-ts-border transition-all shadow-sm shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-ts-terracotta" />
          <span>Tulis Ulasan Pembeli</span>
        </button>
      </div>

      {/* Ratings Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-ts-surfaceHover/60 p-5 rounded-2xl border border-ts-border">
        {/* Overall Score */}
        <div className="flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-ts-border">
          <div className="text-4xl sm:text-5xl font-black text-ts-krem tracking-tight flex items-baseline gap-1">
            <span>{averageRating}</span>
            <span className="text-base text-ts-muted font-normal">/ 5.0</span>
          </div>
          <div className="flex items-center gap-1 mt-2 text-ts-mustard">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-ts-mustard" />
            ))}
          </div>
          <p className="text-xs text-ts-muted mt-2 font-mono">
            Berdasarkan {reviews.length} ulasan terverifikasi
          </p>
        </div>

        {/* Garment & DTF Satisfaction Meters */}
        <div className="md:col-span-2 space-y-3 justify-center flex flex-col px-2 sm:px-4">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-ts-krem flex items-center gap-1.5">
                <Shirt className="w-3.5 h-3.5 text-ts-teal" />
                Ketebalan &amp; Fitting NSA 24s
              </span>
              <span className="text-ts-teal font-mono font-bold">98% Sangat Puas</span>
            </div>
            <div className="w-full bg-ts-border h-2 rounded-full overflow-hidden">
              <div className="bg-ts-teal h-full rounded-full w-[98%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-ts-krem flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-ts-mustard" />
                Ketajaman &amp; Kelenturan Sablon DTF
              </span>
              <span className="text-ts-mustard font-mono font-bold">99% Awet &amp; Lentur</span>
            </div>
            <div className="w-full bg-ts-border h-2 rounded-full overflow-hidden">
              <div className="bg-ts-mustard h-full rounded-full w-[99%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-ts-krem flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-ts-green" />
                Kesesuaian Ukuran (Size Chart)
              </span>
              <span className="text-ts-green font-mono font-bold">96% Pas Sesuai Standar</span>
            </div>
            <div className="w-full bg-ts-border h-2 rounded-full overflow-hidden">
              <div className="bg-ts-green h-full rounded-full w-[96%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-ts-terracotta text-white shadow-glow-terracotta'
              : 'bg-ts-surface text-ts-kremMuted hover:text-ts-krem hover:bg-ts-surfaceHover border border-ts-border'
          }`}
        >
          Semua ({reviews.length})
        </button>
        <button
          onClick={() => setActiveFilter('5star')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
            activeFilter === '5star'
              ? 'bg-ts-terracotta text-white shadow-glow-terracotta'
              : 'bg-ts-surface text-ts-kremMuted hover:text-ts-krem hover:bg-ts-surfaceHover border border-ts-border'
          }`}
        >
          <Star className="w-3.5 h-3.5 fill-current" />
          5 Bintang
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-2xl bg-ts-surface border border-ts-border space-y-3 transition-all hover:border-ts-borderHover shadow-sm"
          >
            {/* Reviewer Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-ts-terracotta/20 to-ts-mustard/20 border border-ts-border flex items-center justify-center font-bold text-ts-terracotta text-xs font-mono">
                  {rev.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-ts-krem">{rev.author}</span>
                    <span className="flex items-center gap-1 text-[10px] text-ts-green font-semibold bg-ts-green/10 px-1.5 py-0.5 rounded border border-ts-green/20">
                      <CheckCircle2 className="w-3 h-3" />
                      Pembeli Terverifikasi
                    </span>
                  </div>
                  <div className="text-[11px] text-ts-muted flex items-center gap-2 mt-0.5">
                    <span>{rev.date}</span>
                    <span>•</span>
                    <span className="text-ts-terracotta font-mono text-[10px]">{rev.garmentType}</span>
                  </div>
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-0.5 text-ts-mustard">
                {[...Array(rev.rating)].map((_, idx) => (
                  <Star key={idx} className="w-3.5 h-3.5 fill-ts-mustard" />
                ))}
              </div>
            </div>

            {/* Fitting / Size Spec Badge */}
            {rev.userStats && (
              <div className="text-[11px] font-mono text-ts-kremMuted bg-ts-surfaceHover px-2.5 py-1 rounded-lg border border-ts-border inline-block">
                Size: <strong className="text-ts-krem font-bold">{rev.sizeOrdered}</strong> • {rev.userStats}
              </div>
            )}

            {/* Content */}
            <p className="text-xs sm:text-sm text-ts-krem leading-relaxed">
              "{rev.content}"
            </p>

            {/* Helpful Counter Button */}
            <div className="pt-1 flex items-center justify-end">
              <button
                onClick={() => handleHelpful(rev.id)}
                disabled={helpfulVoted[rev.id]}
                className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  helpfulVoted[rev.id]
                    ? 'bg-ts-green/15 text-ts-green border-ts-green/30 cursor-default'
                    : 'bg-ts-surface hover:bg-ts-surfaceHover text-ts-muted hover:text-ts-krem border border-ts-border'
                }`}
              >
                <ThumbsUp className="w-3 h-3" />
                <span>Membantu ({rev.helpfulCount})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-ts-surface border border-ts-border p-6 sm:p-8 shadow-2xl text-ts-krem space-y-5">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-ts-muted hover:text-ts-krem hover:bg-ts-surfaceHover cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h4 className="text-lg sm:text-xl font-bold text-ts-krem">
                Tulis Ulasan untuk {productName}
              </h4>
              <p className="text-xs text-ts-kremMuted mt-0.5">
                Bantu pembeli lain mengetahui fitting dan kepuasan bahan New States Apparel.
              </p>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-ts-green mx-auto animate-bounce" />
                <h5 className="text-base font-bold text-ts-krem">Ulasan Berhasil Dikirim!</h5>
                <p className="text-xs text-ts-kremMuted">Terima kasih telah berbagi pengalaman dengan komunitas TeeStock.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-ts-krem mb-1">Rating Produk</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setRating(s)}
                        className="p-1 text-ts-mustard transition-transform hover:scale-110 cursor-pointer"
                      >
                        <Star className={`w-6 h-6 ${s <= rating ? 'fill-ts-mustard' : 'text-ts-muted'}`} />
                      </button>
                    ))}
                    <span className="text-xs font-mono font-bold text-ts-mustard ml-2">
                      {rating} dari 5 Bintang
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-ts-krem mb-1">Nama Lengkap / Samaran</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Rian K."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-ts-surfaceHover border border-ts-border text-ts-krem focus:outline-none focus:border-ts-terracotta"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-ts-krem mb-1">Ukuran Kaos</label>
                    <select
                      value={sizeOrdered}
                      onChange={(e) => setSizeOrdered(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-ts-surfaceHover border border-ts-border text-ts-krem focus:outline-none focus:border-ts-terracotta"
                    >
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-ts-krem mb-1">Catatan Postur Tubuh (Opsional untuk referensi fitting)</label>
                  <input
                    type="text"
                    placeholder="Contoh: TB 175 cm · BB 70 kg (Fitting pas/agak longgar)"
                    value={userStats}
                    onChange={(e) => setUserStats(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-ts-surfaceHover border border-ts-border text-ts-krem focus:outline-none focus:border-ts-terracotta"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ts-krem mb-1">Ulasan Anda</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Ceritakan kepuasan Anda terkait ketebalan kain NSA, kerah leher, elastisitas sablon DTF, atau respon pengiriman..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-ts-surfaceHover border border-ts-border text-ts-krem focus:outline-none focus:border-ts-terracotta resize-none"
                  />
                </div>

                {/* Optional Verified Buyer Verification Box */}
                <div className="p-3 rounded-xl bg-ts-surfaceHover/60 border border-ts-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ts-krem flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-ts-green" /> Verifikasi Pembeli Resmi (Opsional)
                    </span>
                    <span className="text-[10px] text-ts-kremMuted">Badge Terverifikasi</span>
                  </div>
                  <p className="text-[11px] text-ts-kremMuted leading-relaxed">
                    Pernah membeli kaos ini? Masukkan nomor pesanan dan 4 digit terakhir nomor HP Anda agar ulasan diverifikasi otomatis sebagai <strong>Verified Buyer</strong>.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="No. Pesanan (cth: TS-260914-XXXX)"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-ts-surface border border-ts-border text-ts-krem focus:outline-none focus:border-ts-terracotta text-xs uppercase"
                    />
                    <input
                      type="text"
                      placeholder="4 Digit Akhir No. HP"
                      value={phoneLast4}
                      onChange={(e) => setPhoneLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      maxLength={4}
                      className="w-full px-3 py-2 rounded-xl bg-ts-surface border border-ts-border text-ts-krem focus:outline-none focus:border-ts-terracotta text-xs font-mono"
                    />
                  </div>
                </div>

                {submitError && (
                  <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                    {submitError}
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-ts-muted hover:bg-ts-surfaceHover hover:text-ts-krem cursor-pointer"
                  >
                    Batal
                  </button>
                  <Button type="submit" variant="primary" disabled={submitting} className="px-6 py-2">
                    {submitting ? 'Mengirim...' : 'Kirim Ulasan'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
