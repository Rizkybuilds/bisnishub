'use client';

import { useState } from 'react';
import Link from 'next/link';

interface WorkshopJob {
  id: string;
  orderNumber: string;
  article: string;
  quantity: number;
  size: string;
  status: 'PRINT_QUEUE' | 'HEAT_PRESS' | 'QC_FINISHING' | 'READY_PACK';
  stageNote: string;
}

const SAMPLE_WORKSHOP_JOBS: WorkshopJob[] = [
  {
    id: 'job-1',
    orderNumber: 'ORD-2026-081',
    article: 'Slow Sunday — White Ink on Hitam Reaktif',
    quantity: 2,
    size: 'L, XL',
    status: 'HEAT_PRESS',
    stageNote: 'Film DTF curing selesai, antre di meja Press #1 (155°C 15s)',
  },
  {
    id: 'job-2',
    orderNumber: 'ORD-2026-082',
    article: 'Making Things — Graphic Tee Krem',
    quantity: 1,
    size: 'M',
    status: 'HEAT_PRESS',
    stageNote: 'Hot-peel dingin, siap proses second press kain 5s',
  },
  {
    id: 'job-3',
    orderNumber: 'ORD-2026-083',
    article: 'Ordinary Magic — Front Chest Pocket Logo',
    quantity: 4,
    size: 'S, M, L, L',
    status: 'PRINT_QUEUE',
    stageNote: 'File raster 300 DPI siap rip, menunggu giliran print roll 1',
  },
  {
    id: 'job-4',
    orderNumber: 'ORD-2026-084',
    article: 'Stay Curious — Typography Back Print',
    quantity: 2,
    size: 'M, XL',
    status: 'PRINT_QUEUE',
    stageNote: 'Underbase putih 80%, tinta warna vivid CMYK',
  },
  {
    id: 'job-5',
    orderNumber: 'ORD-2026-079',
    article: 'The Edit Signature — Kaos Hitam Pekat',
    quantity: 5,
    size: 'M, L, XL',
    status: 'QC_FINISHING',
    stageNote: 'Inspeksi daya rekat sablon tarik & potong benang rapi',
  },
  {
    id: 'job-6',
    orderNumber: 'ORD-2026-080',
    article: 'Custom Atelier Batch 01',
    quantity: 3,
    size: 'L, XXL',
    status: 'QC_FINISHING',
    stageNote: 'Lipat rapi garmen & tagging hangtag Edisi 001',
  },
  {
    id: 'job-7',
    orderNumber: 'ORD-2026-077',
    article: 'Minimalist Typo Tee — White Label Dropship',
    quantity: 8,
    size: 'S, M, L',
    status: 'READY_PACK',
    stageNote: 'Polymailer doff polos, resi J&T Express tertempel',
  },
  {
    id: 'job-8',
    orderNumber: 'ORD-2026-078',
    article: 'Bandung Heritage Studio Series',
    quantity: 4,
    size: 'L, XL',
    status: 'READY_PACK',
    stageNote: 'Siap pick-up kurir sore (SPX / SiCepat)',
  },
];

export function ExecutiveDashboardWidgets() {
  // Workshop Filter State
  const [selectedStage, setSelectedStage] = useState<string>('ALL');

  // Interactive Margin & Intake Simulator State
  const [orderType, setOrderType] = useState<'retail' | 'creator' | 'reseller'>('retail');
  const [orderQty, setOrderQty] = useState<number>(3);
  const [fabricType, setFabricType] = useState<'combed24s' | 'heavy20s'>('combed24s');

  const unitPrice =
    orderType === 'retail' ? 99000 : orderType === 'creator' ? 119000 : 75000;
  const blankHpp = fabricType === 'combed24s' ? 35000 : 42000;
  const dtfHpp = 20000;
  const packingHpp = 5000;
  const creatorRoyalty = orderType === 'creator' ? 24000 : 0;
  const totalUnitHpp = blankHpp + dtfHpp + packingHpp + creatorRoyalty;

  const grossRevenue = unitPrice * orderQty;
  const totalProductionCost = totalUnitHpp * orderQty;
  const netProfit = grossRevenue - totalProductionCost;
  const netMarginPercent =
    grossRevenue > 0 ? Math.round((netProfit / grossRevenue) * 100) : 0;

  const filteredJobs =
    selectedStage === 'ALL'
      ? SAMPLE_WORKSHOP_JOBS
      : SAMPLE_WORKSHOP_JOBS.filter((j) => j.status === selectedStage);

  return (
    <div className="nextlevel-widgets-wrap">
      {/* 1. Quick WhatsApp Intake & Dynamic Profit Margin Simulator */}
      <section className="nextlevel-card nextlevel-intake-card" aria-label="Interactive Order Simulator">
        <div className="nextlevel-card-header">
          <div>
            <div className="nextlevel-eyebrow">
              <span className="pulse-dot-green" aria-hidden="true" />
              SIMULATOR INTAKE CEPAT // DIRECT POS
            </div>
            <h3 className="nextlevel-card-title">Kalkulasi Margin Pesanan WhatsApp Masuk</h3>
            <p className="nextlevel-card-desc">
              Hitung otomatis HPP garmen, biaya sablon DTF, dan laba bersih riil sebelum mengunci pesanan ke sistem.
            </p>
          </div>
          <Link href="/orders" className="nextlevel-btn-primary">
            <span>+ Buka Form Pesanan Lengkap</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="nextlevel-simulator-grid">
          {/* Controls Column */}
          <div className="nextlevel-sim-controls">
            <div className="nextlevel-field-group">
              <label className="nextlevel-field-label">Model Pesanan / Channel:</label>
              <div className="nextlevel-toggle-group">
                <button
                  type="button"
                  className={'nextlevel-toggle-btn' + (orderType === 'retail' ? ' active' : '')}
                  onClick={() => setOrderType('retail')}
                >
                  Ritel Langsung
                  <small>Rp 99.000/pcs</small>
                </button>
                <button
                  type="button"
                  className={'nextlevel-toggle-btn' + (orderType === 'creator' ? ' active' : '')}
                  onClick={() => setOrderType('creator')}
                >
                  Kreator Merch
                  <small>Royalti Rp 24k</small>
                </button>
                <button
                  type="button"
                  className={'nextlevel-toggle-btn' + (orderType === 'reseller' ? ' active' : '')}
                  onClick={() => setOrderType('reseller')}
                >
                  Reseller / Dropship
                  <small>Grosir Rp 75k</small>
                </button>
              </div>
            </div>

            <div className="nextlevel-field-group">
              <div className="nextlevel-field-header-row">
                <label className="nextlevel-field-label" htmlFor="order-qty-range">
                  Volume Pesanan:
                </label>
                <span className="nextlevel-field-val-badge">{orderQty} Pcs</span>
              </div>
              <input
                id="order-qty-range"
                type="range"
                min="1"
                max="50"
                value={orderQty}
                onChange={(e) => setOrderQty(Number(e.target.value))}
                className="nextlevel-range-slider"
              />
              <div className="nextlevel-range-ticks">
                <span>1 pcs (Satuan)</span>
                <span>12 pcs (1 Lusin)</span>
                <span>24 pcs</span>
                <span>50 pcs</span>
              </div>
            </div>

            <div className="nextlevel-field-group">
              <label className="nextlevel-field-label">Pilihan Bahan Kain Blank:</label>
              <div className="nextlevel-toggle-group">
                <button
                  type="button"
                  className={'nextlevel-toggle-btn' + (fabricType === 'combed24s' ? ' active' : '')}
                  onClick={() => setFabricType('combed24s')}
                >
                  Cotton Combed 24s
                  <small>HPP Blank Rp 35.000</small>
                </button>
                <button
                  type="button"
                  className={'nextlevel-toggle-btn' + (fabricType === 'heavy20s' ? ' active' : '')}
                  onClick={() => setFabricType('heavy20s')}
                >
                  Heavyweight 20s
                  <small>HPP Blank Rp 42.000</small>
                </button>
              </div>
            </div>
          </div>

          {/* Result Matrix Column */}
          <div className="nextlevel-sim-result">
            <div className="nextlevel-result-header">
              <span className="nextlevel-result-tag">RINGKASAN EKONOMI UNIT PESANAN</span>
              <div className="nextlevel-profit-highlight">
                <span className="nextlevel-profit-sub">Estimasi Laba Bersih Bersih:</span>
                <div className="nextlevel-profit-amount">
                  Rp {netProfit.toLocaleString('id-ID')}
                  <span className="nextlevel-margin-pill">{netMarginPercent}% Margin</span>
                </div>
              </div>
            </div>

            <div className="nextlevel-breakdown-table">
              <div className="nextlevel-breakdown-row">
                <span>Total Omzet Kotor ({orderQty} pcs × Rp {unitPrice.toLocaleString('id-ID')}):</span>
                <strong>Rp {grossRevenue.toLocaleString('id-ID')}</strong>
              </div>
              <div className="nextlevel-breakdown-row">
                <span>HPP Kain Blank ({orderQty} pcs × Rp {blankHpp.toLocaleString('id-ID')}):</span>
                <span className="text-warning">- Rp {(blankHpp * orderQty).toLocaleString('id-ID')}</span>
              </div>
              <div className="nextlevel-breakdown-row">
                <span>Sablon DTF Dual-Press ({orderQty} pcs × Rp {dtfHpp.toLocaleString('id-ID')}):</span>
                <span className="text-warning">- Rp {(dtfHpp * orderQty).toLocaleString('id-ID')}</span>
              </div>
              <div className="nextlevel-breakdown-row">
                <span>Finishing &amp; Polymailer ({orderQty} pcs × Rp {packingHpp.toLocaleString('id-ID')}):</span>
                <span className="text-warning">- Rp {(packingHpp * orderQty).toLocaleString('id-ID')}</span>
              </div>
              {orderType === 'creator' && (
                <div className="nextlevel-breakdown-row">
                  <span>Royalti Kreator Bersih ({orderQty} pcs × Rp 24.000):</span>
                  <span className="text-warning">- Rp {(creatorRoyalty * orderQty).toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="nextlevel-breakdown-divider" />
              <div className="nextlevel-breakdown-row total-cogs-row">
                <span>Total Modal HPP Produksi:</span>
                <span className="text-muted">Rp {totalProductionCost.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="nextlevel-sim-footer">
              <span className="nextlevel-hint">
                ✓ Sesuai standar akuntansi MGBOS (Atomic ledger, integer money, no floating point error).
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive DTF Production Floor & Live Batch Monitor */}
      <section className="nextlevel-card" aria-label="Interactive Workshop Floor Monitor">
        <div className="nextlevel-card-header">
          <div>
            <div className="nextlevel-eyebrow">
              <span className="pulse-dot-cyan" aria-hidden="true" />
              LANTAI WORKSHOP &amp; DTF LIVE KANBAN
            </div>
            <h3 className="nextlevel-card-title">Monitoring Antrean Sablon DTF &amp; Finishing</h3>
            <p className="nextlevel-card-desc">
              Pantau status pemrosesan artikel secara real-time dari rip artwork hingga siap packing polymailer.
            </p>
          </div>
          <div className="nextlevel-hardware-status">
            <span className="hardware-pill online" title="Suhu kalibrasi optimal">
              <span className="hardware-dot" /> Heat Press #1: 155°C Siap
            </span>
            <span className="hardware-pill online" title="Nozzle head lancar">
              <span className="hardware-dot" /> Printer DTF: Online
            </span>
          </div>
        </div>

        {/* Capacity Progress Bar */}
        <div className="nextlevel-capacity-bar-wrap">
          <div className="nextlevel-capacity-labels">
            <span>Kapasitas Harian Terpakai: <strong>29 / 50 Pcs (58%)</strong></span>
            <span>Sisa Kapasitas Workshop: <strong>21 Pcs</strong></span>
          </div>
          <div className="nextlevel-capacity-track">
            <div className="nextlevel-capacity-fill" style={{ width: '58%' }} />
          </div>
        </div>

        {/* Stage Filter Buttons */}
        <div className="nextlevel-stage-tabs">
          <button
            type="button"
            className={'nextlevel-stage-tab' + (selectedStage === 'ALL' ? ' active' : '')}
            onClick={() => setSelectedStage('ALL')}
          >
            Semua Antrean <span className="tab-count">{SAMPLE_WORKSHOP_JOBS.length}</span>
          </button>
          <button
            type="button"
            className={'nextlevel-stage-tab' + (selectedStage === 'PRINT_QUEUE' ? ' active' : '')}
            onClick={() => setSelectedStage('PRINT_QUEUE')}
          >
            🖨️ Antrean Print DTF <span className="tab-count">6 pcs</span>
          </button>
          <button
            type="button"
            className={'nextlevel-stage-tab' + (selectedStage === 'HEAT_PRESS' ? ' active' : '')}
            onClick={() => setSelectedStage('HEAT_PRESS')}
          >
            🔥 Meja Press 155°C <span className="tab-count">3 pcs</span>
          </button>
          <button
            type="button"
            className={'nextlevel-stage-tab' + (selectedStage === 'QC_FINISHING' ? ' active' : '')}
            onClick={() => setSelectedStage('QC_FINISHING')}
          >
            🔍 QC &amp; Finishing <span className="tab-count">8 pcs</span>
          </button>
          <button
            type="button"
            className={'nextlevel-stage-tab' + (selectedStage === 'READY_PACK' ? ' active' : '')}
            onClick={() => setSelectedStage('READY_PACK')}
          >
            📦 Siap Kirim (Packing) <span className="tab-count">12 pcs</span>
          </button>
        </div>

        {/* Live Batch Cards List */}
        <div className="nextlevel-jobs-grid">
          {filteredJobs.map((job) => (
            <div key={job.id} className="nextlevel-job-card">
              <div className="job-card-top">
                <span className="job-ord-num">{job.orderNumber}</span>
                <span className={'job-status-badge ' + job.status.toLowerCase().replace('_', '-')}>
                  {job.status === 'PRINT_QUEUE' && 'Print DTF'}
                  {job.status === 'HEAT_PRESS' && 'Press 155°C'}
                  {job.status === 'QC_FINISHING' && 'QC & Finishing'}
                  {job.status === 'READY_PACK' && 'Siap Kirim'}
                </span>
              </div>
              <strong className="job-article-title">{job.article}</strong>
              <div className="job-meta-row">
                <span>Ukuran: <strong>{job.size}</strong></span>
                <span>Jumlah: <strong>{job.quantity} pcs</strong></span>
              </div>
              <p className="job-stage-note">{job.stageNote}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
