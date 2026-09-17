import React, { useState } from 'react'
import { HardDrive, Folder, FileText, Copy, Check, ExternalLink, ShieldCheck, Terminal } from 'lucide-react'

export const ExternalSsdModule: React.FC = () => {
  const [copiedPath, setCopiedPath] = useState<string | null>(null)

  const handleCopy = (path: string) => {
    navigator.clipboard.writeText(path)
    setCopiedPath(path)
    setTimeout(() => setCopiedPath(null), 2000)
  }

  const ssdFolders = [
    {
      path: 'D:\\00_INBOX_DROPZONE',
      name: '00_INBOX_DROPZONE',
      desc: 'Transit kilat transfer foto & video mentah dari kamera/HP sebelum disortir ke drop masing-masing.',
      badge: 'Hot Drop'
    },
    {
      path: 'D:\\01_BRAND_MASTER_IDENTITIES\\TEESTOCK',
      name: '01_BRAND_MASTER_IDENTITIES / TEESTOCK',
      desc: 'Master vector logo "The Tee & The Stock", palet Terracotta #D95D39, font lisensi, dan brand guide PDF.',
      badge: 'Master Asset'
    },
    {
      path: 'D:\\02_TEESTOCK_PRODUCTION\\01_ARTICLES_CATALOG\\DROP_01_RAW_IDENTITY',
      name: '02_TEESTOCK_PRODUCTION / ARTICLES_CATALOG',
      desc: 'Arsip artikel kaos Drop #01: PSD layer mentah, PNG transparan 300 DPI 1:1, dan mockups katalog web.',
      badge: 'Apparel Core'
    },
    {
      path: 'D:\\02_TEESTOCK_PRODUCTION\\02_GANG_SHEETS_DTF_58CM',
      name: '02_TEESTOCK_PRODUCTION / GANG_SHEETS_DTF_58CM',
      desc: 'File roll cetak DTF meteran lebar 58 cm. Safe margin 1.5 cm di sisi kiri/kanan. Format TIFF/PNG 300 DPI.',
      badge: 'Print Ready'
    },
    {
      path: 'D:\\03_MULTIGRAPH_COLLATERAL\\01_TEESTOCK_PACKAGING_PRINTS',
      name: '03_MULTIGRAPH_COLLATERAL / PACKAGING_PRINTS',
      desc: 'File siap cetak hangtag Art Carton 310gsm, stiker vinyl unboxing die-cut, polymailer sablon, dan care card A6.',
      badge: 'Packaging'
    },
    {
      path: 'D:\\04_LEGAL_INVOICE_FINANCIAL',
      name: '04_LEGAL_INVOICE_FINANCIAL',
      desc: 'Scan nota belanja Cititex, kwitansi DTF meteran, rekening koran bank, dan bukti pajak tahunan.',
      badge: 'Financial Audit'
    },
    {
      path: 'D:\\99_SYSTEM_SNAPSHOTS_BACKUP',
      name: '99_SYSTEM_SNAPSHOTS_BACKUP',
      desc: 'Arsip backup mingguan Obsidian Vault BisnisHub dan export data PostgreSQL Supabase.',
      badge: 'Disaster Recovery'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-hub-border pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-sky-400" />
              <span>External SSD 1TB (Drive D:\) Asset Vault</span>
            </h2>
            <p className="text-xs text-hub-muted mt-0.5">
              Penyimpanan terisolasi untuk master PSD, AI, Video 4K, dan Gang Sheet DTF 58 cm
            </p>
          </div>

          <span className="flex items-center gap-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Drive D:\ Aktif & Terkonfigurasi</span>
          </span>
        </div>
      </div>

      {/* Naming Convention Rule Box */}
      <div className="rounded-3xl border border-teestock/30 bg-teestock/5 p-5 space-y-2">
        <div className="flex items-center gap-2 text-teestock text-xs font-bold uppercase tracking-wider">
          <Terminal className="h-4 w-4" />
          <span>Aturan Baku Penamaan File (File Naming Protocol)</span>
        </div>
        <p className="text-xs text-slate-300 font-mono bg-hub-bg/80 p-2.5 rounded-xl border border-hub-border">
          YYYYMMDD_[BRAND]_[NAMA_ITEM]_[VERSI/RESOLUSI].[EXT]
        </p>
        <p className="text-[11px] text-hub-muted">
          Contoh: <code className="text-slate-300">20260920_TS_ART01_ORIGINS_300DPI_A3.png</code> atau{' '}
          <code className="text-slate-300">20260922_MG_GANGSHEET_58x150cm_V1.tif</code>
        </p>
      </div>

      {/* Directory Cards */}
      <div className="space-y-3">
        {ssdFolders.map((folder, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-hub-border bg-hub-card hover:border-hub-border/80 transition-all gap-3"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-sky-400 flex-shrink-0 mt-0.5">
                <Folder className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white font-mono">{folder.name}</h4>
                  <span className="rounded-md bg-slate-800 text-[10px] text-slate-300 px-2 py-0.5 font-semibold">
                    {folder.badge}
                  </span>
                </div>
                <p className="text-xs text-hub-muted mt-1 leading-relaxed">{folder.desc}</p>
                <span className="text-[10px] font-mono text-slate-400 mt-1 block">
                  Path: {folder.path}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                onClick={() => handleCopy(folder.path)}
                className="flex items-center gap-1.5 rounded-xl border border-hub-border bg-hub-bg px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:border-sky-400/40 transition-all"
              >
                {copiedPath === folder.path ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Path Disalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Salin Path Windows</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
