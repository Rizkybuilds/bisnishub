import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { HomePage } from './pages/HomePage';
import { ModulePlaceholderPage } from './pages/ModulePlaceholderPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          {/* Home / Command Center */}
          <Route index element={<HomePage />} />

          {/* Sales Pipeline */}
          <Route
            path="sales/leads"
            element={
              <ModulePlaceholderPage
                title="Leads & Inquiries"
                category="Sales Pipeline"
                description="Pengelolaan inquiry calon pelanggan dari WhatsApp, Instagram DM, dan Website."
                sliceId="MGBOS-006"
              />
            }
          />
          <Route
            path="sales/customers"
            element={
              <ModulePlaceholderPage
                title="Customer 360"
                category="Sales Pipeline"
                description="Database pelanggan holding lintas brand: PT / Perusahaan dan Kontak Penanggung Jawab."
                sliceId="MGBOS-005"
              />
            }
          />
          <Route
            path="sales/quotes"
            element={
              <ModulePlaceholderPage
                title="Quotations & Costing"
                category="Sales Pipeline"
                description="Pembuatan dan pengiriman penawaran harga resmi dengan kalkulasi estimasi HPP internal."
                sliceId="MGBOS-009"
              />
            }
          />

          {/* Operations */}
          <Route
            path="ops/orders"
            element={
              <ModulePlaceholderPage
                title="Order Contracts"
                category="Operations"
                description="Pesanan terkonfirmasi, pembekuan snapshot kontrak komersial, dan target deadline pengiriman."
                sliceId="MGBOS-011"
              />
            }
          />
          <Route
            path="ops/production"
            element={
              <ModulePlaceholderPage
                title="Production Jobs & QC"
                category="Operations"
                description="Routing pekerjaan produksi ke vendor (bahan polos, cetak sablon/DTF, kemasan) dan hasil inspeksi QC."
                sliceId="MGBOS-012"
              />
            }
          />
          <Route
            path="ops/vendors"
            element={
              <ModulePlaceholderPage
                title="Vendor Network"
                category="Operations"
                description="Jejaring mitra produksi terkurasi, kapabilitas teknis, SLA pengerjaan, dan skor keandalan."
                sliceId="MGBOS-013"
              />
            }
          />

          {/* Finance */}
          <Route
            path="finance/invoices"
            element={
              <ModulePlaceholderPage
                title="Invoices & Receivables"
                category="Finance"
                description="Penagihan komersial, termin pembayaran (DP 50% / Pelunasan), dan sisa piutang pelanggan."
                sliceId="MGBOS-014"
              />
            }
          />
          <Route
            path="finance/payments"
            element={
              <ModulePlaceholderPage
                title="Payments & Cash Flow"
                category="Finance"
                description="Pencatatan mutasi kas masuk, verifikasi transfer bank, dan alokasi pembayaran invoice."
                sliceId="MGBOS-015"
              />
            }
          />

          {/* Work & Actions */}
          <Route
            path="work/tasks"
            element={
              <ModulePlaceholderPage
                title="Tasks & Approvals"
                category="Work"
                description="Antrean tugas harian founder, jadwal follow-up, dan persetujuan aksi berisiko tinggi."
                sliceId="MGBOS-016"
              />
            }
          />
          <Route
            path="settings"
            element={
              <ModulePlaceholderPage
                title="Multi-Brand Settings"
                category="System"
                description="Konfigurasi organisasi MultiGraph Holding, unit bisnis, channel, dan hak akses staf."
                sliceId="MGBOS-002"
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
