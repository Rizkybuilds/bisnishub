import React, { useState } from 'react'
import { BusinessId, ContentPlan } from '../../types'
import { INITIAL_CONTENT_PLANS } from '../../mockData'
import { Megaphone, Copy, Check, Sparkles, MessageCircle, Video, Instagram, Smartphone } from 'lucide-react'

interface MarketingModuleProps {
  businessFilter: BusinessId
}

export const MarketingModule: React.FC<MarketingModuleProps> = ({ businessFilter }) => {
  const [plans, setPlans] = useState<ContentPlan[]>(() => {
    const saved = localStorage.getItem('bh_content')
    return saved ? JSON.parse(saved) : INITIAL_CONTENT_PLANS
  })

  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filtered = plans.filter((p) =>
    businessFilter === 'all' ? true : p.businessId === businessFilter
  )

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Pre-loaded Swipe File Copywriting by CMO
  const swipeFiles = [
    {
      id: 'sw-01',
      title: 'Hook TikTok/Reels: Perbandingan NSA vs Kaos Pasaran',
      text: 'Banyak yang jual kaos distro 50 ribuan tapi 3x cuci lehernya melar kayak daster. Di TeeStock, kita pakai NSA Heavyweight 24s 100% cotton combed + sablon DTF 155°C. Ini buktinya waktu ditarik kencang...'
    },
    {
      id: 'sw-02',
      title: 'Script WA: Follow-up Keranjang Belum Bayar (Abandonment)',
      text: 'Halo Kak! 🙏 Kami lihat Kakak tadi sempat memilih kaos TeeStock tapi transaksinya belum selesai. Kuota early bird Batch #01 tersisa 7 pcs lagi nih kak. Mau kami bantu amankan size-nya sebelum sold out?'
    },
    {
      id: 'sw-03',
      title: 'Script WA: Konfirmasi Pembayaran & Garansi Tukar Baru',
      text: 'Pembayaran Kakak sudah kami terima ya! Kaos sekarang sedang masuk antrean heat press 155°C dan disiapkan oleh tim produksi. Paket Kakak dilindungi Garansi Tukar Baru 100% jika ada cacat sablon atau jahitan. Ditunggu kedatangan unboxing pack-nya ya kak! ✨'
    },
    {
      id: 'sw-04',
      title: 'Objection Handling: "Kaosnya tebal panas gak bro?"',
      text: 'Tenang bro, NSA 24s itu gramasi 180-190 gsm dengan benang 100% serat katun alami tanpa campuran polyester. Jadi bahannya kokoh & jatuh rapi di badan (boxy fit), tapi pori-pori katunnya tetap dingin dan nyerap keringat maksimal di iklim tropis.'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-hub-border pb-4">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-teestock" />
          <span>Marketing Hub & Swipe File Copywriting</span>
        </h2>
        <p className="text-xs text-hub-muted mt-0.5">
          Amunisi konversi penjualan direct-response dari CMO Dewan Co-Founders
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Kalender Konten Aktif */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Video className="h-4 w-4 text-teestock" />
            <span>Kalender Konten & Hook Video</span>
          </h3>

          <div className="space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-hub-border bg-hub-card p-4 space-y-3 hover:border-teestock/30 transition-all shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.channel === 'tiktok' ? (
                      <span className="rounded-md bg-pink-500/10 text-pink-400 border border-pink-500/30 px-2 py-0.5 text-[10px] font-bold">
                        TikTok Video
                      </span>
                    ) : item.channel === 'instagram' ? (
                      <span className="rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2 py-0.5 text-[10px] font-bold">
                        Instagram Reel
                      </span>
                    ) : (
                      <span className="rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold">
                        WhatsApp Script
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-hub-muted">{item.targetDate}</span>
                  </div>

                  <span className="text-[10px] uppercase font-bold text-teestock bg-teestock/10 px-2 py-0.5 rounded-full">
                    {item.status}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white">{item.title}</h4>

                {/* Hook Box */}
                <div className="rounded-xl bg-hub-bg border border-hub-border/70 p-2.5 text-xs text-slate-300">
                  <span className="text-[10px] font-bold text-teestock uppercase tracking-wider block mb-1">
                    Hook 3 Detik Pertama:
                  </span>
                  <p className="italic">{item.hookCopy}</p>
                </div>

                {/* Caption */}
                <div className="text-xs text-hub-muted leading-relaxed">
                  <p className="line-clamp-2">{item.caption}</p>
                </div>

                {/* Copy Caption Button */}
                <div className="pt-2 border-t border-hub-border/60 flex justify-end">
                  <button
                    onClick={() => handleCopy(item.id, `${item.hookCopy}\n\n${item.caption}`)}
                    className="flex items-center gap-1 text-xs font-semibold text-teestock hover:text-[#F8704A] transition-all"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Salin Hook & Caption</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Swipe File Amunisi Sales */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Swipe File Naskah Konversi Tinggi (CMO)</span>
          </h3>

          <div className="space-y-3">
            {swipeFiles.map((sw) => (
              <div
                key={sw.id}
                className="rounded-2xl border border-hub-border bg-hub-card p-4 space-y-2 hover:border-amber-400/30 transition-all shadow-md"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{sw.title}</h4>
                  <button
                    onClick={() => handleCopy(sw.id, sw.text)}
                    className="flex items-center gap-1 rounded-lg border border-hub-border bg-hub-bg px-2 py-1 text-[10px] font-semibold text-slate-300 hover:text-white hover:border-amber-400/40 transition-all"
                  >
                    {copiedId === sw.id ? (
                      <Check className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <Copy className="h-3 w-3 text-amber-400" />
                    )}
                    <span>{copiedId === sw.id ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-hub-bg/60 p-2.5 rounded-xl border border-hub-border/50">
                  {sw.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
