'use client';

import { useState } from 'react';
import { formatLeadStatus, getLeadStatusBadgeColor } from '@mgbos/domain';
import { LeadDetailModal, type LeadDetailData } from './LeadDetailModal';

export function LeadListTable({
  leads,
  activeBrandCode,
}: {
  leads: LeadDetailData[];
  activeBrandCode: string;
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [brandFilter, setBrandFilter] = useState<'ALL' | 'ACTIVE'>('ALL');
  const [selectedLead, setSelectedLead] = useState<LeadDetailData | null>(null);

  const filtered = leads.filter((lead) => {
    // Status filter
    if (statusFilter !== 'ALL' && lead.status !== statusFilter) {
      return false;
    }

    // Brand filter
    if (brandFilter === 'ACTIVE') {
      if (lead.brands?.code !== activeBrandCode) {
        return false;
      }
    }

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchNumber = lead.lead_number.toLowerCase().includes(q);
      const matchTitle = lead.title.toLowerCase().includes(q);
      const matchContact =
        lead.contact_name?.toLowerCase().includes(q) || false;
      const matchCompany =
        lead.company_name?.toLowerCase().includes(q) || false;
      const matchPhone = lead.phone?.toLowerCase().includes(q) || false;
      if (
        !matchNumber &&
        !matchTitle &&
        !matchContact &&
        !matchCompany &&
        !matchPhone
      ) {
        return false;
      }
    }

    return true;
  });

  return (
    <div>
      {/* Filters Bar */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: '16px',
        }}
      >
        <div style={{ flex: '1 1 240px' }}>
          <input
            type="text"
            placeholder="Cari nomor lead, judul, kontak, WhatsApp..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: '#020617',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#f8fafc',
              fontSize: '0.875rem',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Status:</span>
          {['ALL', 'NEW', 'QUALIFIED', 'DISQUALIFIED', 'CONVERTED'].map(
            (st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: statusFilter === st ? '#38bdf8' : '#1e293b',
                  color: statusFilter === st ? '#0f172a' : '#cbd5e1',
                }}
              >
                {st === 'ALL' ? 'Semua' : st}
              </button>
            ),
          )}
        </div>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Brand:</span>
          <button
            type="button"
            onClick={() => setBrandFilter('ALL')}
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: brandFilter === 'ALL' ? '#38bdf8' : '#1e293b',
              color: brandFilter === 'ALL' ? '#0f172a' : '#cbd5e1',
            }}
          >
            Semua Brand
          </button>
          <button
            type="button"
            onClick={() => setBrandFilter('ACTIVE')}
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: brandFilter === 'ACTIVE' ? '#4ade80' : '#1e293b',
              color: brandFilter === 'ACTIVE' ? '#052e16' : '#cbd5e1',
            }}
          >
            {activeBrandCode} Saja
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.875rem',
            textAlign: 'left',
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: '1px solid #334155',
                color: '#94a3b8',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
              }}
            >
              <th style={{ padding: '10px 12px' }}>Nomor Lead</th>
              <th style={{ padding: '10px 12px' }}>
                Kebutuhan &amp; Inbound Inquiry
              </th>
              <th style={{ padding: '10px 12px' }}>Kontak &amp; Perusahaan</th>
              <th style={{ padding: '10px 12px' }}>Channel</th>
              <th style={{ padding: '10px 12px' }}>Kuantiti &amp; Nilai</th>
              <th style={{ padding: '10px 12px' }}>Status &amp; Skor</th>
              <th style={{ padding: '10px 12px', textAlign: 'right' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    padding: '32px 12px',
                    textAlign: 'center',
                    color: '#94a3b8',
                  }}
                >
                  Tidak ada lead yang cocok dengan filter.
                </td>
              </tr>
            ) : (
              filtered.map((lead) => {
                const badge = getLeadStatusBadgeColor(lead.status);
                return (
                  <tr
                    key={lead.id}
                    style={{
                      borderBottom: '1px solid #1e293b',
                      cursor: 'pointer',
                    }}
                    onClick={() => setSelectedLead(lead)}
                  >
                    {/* Nomor Lead */}
                    <td style={{ padding: '12px', verticalAlign: 'top' }}>
                      <div
                        style={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: '#38bdf8',
                          fontSize: '0.85rem',
                        }}
                      >
                        {lead.lead_number}
                      </div>
                      <div
                        style={{
                          fontSize: '0.7rem',
                          color: '#94a3b8',
                          marginTop: '2px',
                        }}
                      >
                        {lead.brands?.name}
                      </div>
                    </td>

                    {/* Title & Inquiry */}
                    <td
                      style={{
                        padding: '12px',
                        verticalAlign: 'top',
                        maxWidth: '280px',
                      }}
                    >
                      <div style={{ fontWeight: 600, color: '#f8fafc' }}>
                        {lead.title}
                      </div>
                      {lead.raw_inquiry && (
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: '#94a3b8',
                            marginTop: '4px',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.3,
                          }}
                        >
                          {lead.raw_inquiry}
                        </div>
                      )}
                    </td>

                    {/* Kontak & Perusahaan */}
                    <td style={{ padding: '12px', verticalAlign: 'top' }}>
                      <div style={{ color: '#cbd5e1', fontWeight: 500 }}>
                        {lead.contact_name || '-'}
                      </div>
                      {lead.company_name && (
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          {lead.company_name}
                        </div>
                      )}
                      {lead.phone && (
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: '#38bdf8',
                            marginTop: '2px',
                          }}
                        >
                          {lead.phone}
                        </div>
                      )}
                    </td>

                    {/* Channel */}
                    <td style={{ padding: '12px', verticalAlign: 'top' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          background: '#1e293b',
                          color: '#e2e8f0',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          border: '1px solid #334155',
                        }}
                      >
                        {lead.channels?.code || 'DIRECT'}
                      </span>
                    </td>

                    {/* Kuantiti & Budget */}
                    <td style={{ padding: '12px', verticalAlign: 'top' }}>
                      <div style={{ color: '#f8fafc', fontWeight: 600 }}>
                        {lead.estimated_quantity
                          ? `${lead.estimated_quantity} pcs`
                          : '-'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#4ade80' }}>
                        {lead.estimated_budget
                          ? `Rp ${lead.estimated_budget.toLocaleString('id-ID')}`
                          : '-'}
                      </div>
                    </td>

                    {/* Status & Skor */}
                    <td style={{ padding: '12px', verticalAlign: 'top' }}>
                      <div style={{ display: 'inline-block' }}>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: badge.bg,
                            color: badge.text,
                            border: `1px solid ${badge.border}`,
                          }}
                        >
                          {formatLeadStatus(lead.status)}
                        </span>
                      </div>
                      {lead.qualification_score != null && (
                        <div
                          style={{
                            fontSize: '0.7rem',
                            color: '#94a3b8',
                            marginTop: '4px',
                          }}
                        >
                          Skor: <strong>{lead.qualification_score}</strong>/100
                        </div>
                      )}
                    </td>

                    {/* Action */}
                    <td
                      style={{
                        padding: '12px',
                        verticalAlign: 'top',
                        textAlign: 'right',
                      }}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLead(lead);
                        }}
                        style={{
                          background: '#1e293b',
                          border: '1px solid #334155',
                          color: '#38bdf8',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                      >
                        Detail &rarr;
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          isOpen={Boolean(selectedLead)}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
}
