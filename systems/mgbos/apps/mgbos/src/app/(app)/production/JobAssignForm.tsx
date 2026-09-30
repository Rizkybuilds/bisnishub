'use client';

import {
  useState,
  startTransition,
  useActionState,
  useRef,
  useEffect,
} from 'react';
import {
  assignProductionJobAction,
  reassignProductionJobAction,
  ProductionActionResult,
} from './actions';

export interface VendorOption {
  id: string;
  code: string;
  name: string;
  category: string;
  status: string;
  leadTimeDays?: number;
  rateCards?: Array<{
    id: string;
    service_code: string;
    description: string;
    unit: string;
    unit_cost: string;
    min_order_quantity: number;
  }>;
}

export function JobAssignForm({
  jobId,
  brands,
  vendors = [],
  defaultEstimatedCost,
  isReassignment = false,
}: {
  jobId: string;
  brands: Array<{ id: string; code: string; name: string }>;
  vendors?: VendorOption[];
  defaultEstimatedCost?: string;
  isReassignment?: boolean;
}) {
  const [executorType, setExecutorType] = useState<'INTERNAL' | 'VENDOR'>(
    'INTERNAL',
  );
  const [selectedVendorId, setSelectedVendorId] = useState<string>(
    vendors[0]?.id ?? '',
  );
  const [customVendorMode, setCustomVendorMode] = useState<boolean>(
    vendors.length === 0,
  );
  const [assignedCostValue, setAssignedCostValue] = useState<string>(
    defaultEstimatedCost ?? '0',
  );

  const selectedVendor = vendors.find((v) => v.id === selectedVendorId);

  const [state, action, pending] = useActionState(
    async (
      _prev: ProductionActionResult,
      formData: FormData,
    ): Promise<ProductionActionResult> => {
      const type = formData.get('executorType') as 'INTERNAL' | 'VENDOR';
      const assignedBrandId = String(
        formData.get('assignedBrandId') ?? '',
      ).trim();
      const vendorId = String(formData.get('vendorId') ?? '').trim();
      const vendorName = String(formData.get('vendorName') ?? '').trim();
      const assignedCost = String(formData.get('assignedCost') ?? '0').trim();
      const notes = String(formData.get('notes') ?? '').trim();
      const reason = String(formData.get('reassignReason') ?? '').trim();

      if (isReassignment) {
        return reassignProductionJobAction({
          jobId,
          executorType: type,
          assignedBrandId:
            type === 'INTERNAL' && assignedBrandId ? assignedBrandId : null,
          vendorId: type === 'VENDOR' && vendorId ? vendorId : null,
          vendorName:
            type === 'VENDOR'
              ? vendorName || selectedVendor?.name || null
              : null,
          assignedCost: BigInt(assignedCost || '0'),
          notes: notes || null,
          reason: reason || 'Penugasan ulang oleh operator',
        });
      }

      return assignProductionJobAction({
        jobId,
        executorType: type,
        assignedBrandId:
          type === 'INTERNAL' && assignedBrandId ? assignedBrandId : null,
        vendorId: type === 'VENDOR' && vendorId ? vendorId : null,
        vendorName:
          type === 'VENDOR' ? vendorName || selectedVendor?.name || null : null,
        assignedCost: BigInt(assignedCost || '0'),
        notes: notes || null,
      });
    },
    {},
  );

  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state.error) errorRef.current?.focus();
  }, [state]);

  return (
    <form
      className="requirement-form"
      action={action}
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
      }}
      style={{
        marginTop: '1rem',
        border: '1px solid #334155',
        padding: '1rem',
        borderRadius: '8px',
      }}
    >
      <input type="hidden" name="jobId" value={jobId} />

      {state.error && (
        <p role="alert" tabIndex={-1} ref={errorRef} className="error-banner">
          {state.error}
        </p>
      )}

      {state.success && (
        <p role="status" style={{ color: '#22c55e', fontWeight: 600 }}>
          ✅ Job berhasil ditugaskan.
        </p>
      )}

      <div>
        <label>Tipe Pelaksana (Executor)</label>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '4px' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
            }}
          >
            <input
              type="radio"
              name="executorType"
              value="INTERNAL"
              checked={executorType === 'INTERNAL'}
              onChange={() => setExecutorType('INTERNAL')}
            />
            <span>Internal Holding (Brand Sinergi)</span>
          </label>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
            }}
          >
            <input
              type="radio"
              name="executorType"
              value="VENDOR"
              checked={executorType === 'VENDOR'}
              onChange={() => setExecutorType('VENDOR')}
            />
            <span>Mitra Vendor Eksternal</span>
          </label>
        </div>
      </div>

      {executorType === 'INTERNAL' ? (
        <div style={{ marginTop: '0.75rem' }}>
          <label htmlFor="assignedBrandId">Pilih Unit Brand Internal *</label>
          <select
            id="assignedBrandId"
            name="assignedBrandId"
            className="form-input"
            required
          >
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.code})
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div style={{ marginTop: '0.75rem' }}>
          {vendors.length > 0 && !customVendorMode ? (
            <div>
              <label htmlFor="vendorId">Pilih Mitra Vendor Terdaftar *</label>
              <select
                id="vendorId"
                name="vendorId"
                className="form-input"
                value={selectedVendorId}
                onChange={(e) => setSelectedVendorId(e.target.value)}
                required
              >
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.code}) · {v.category} · Lead time ~
                    {v.leadTimeDays ?? 3} hari
                  </option>
                ))}
              </select>

              <input
                type="hidden"
                name="vendorName"
                value={selectedVendor?.name ?? ''}
              />

              {/* Rate Card Reference Assistance (P0-03 Section 39) */}
              {selectedVendor?.rateCards &&
                selectedVendor.rateCards.length > 0 && (
                  <div
                    style={{
                      marginTop: '0.75rem',
                      background: '#020617',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #1e293b',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#38bdf8',
                        marginBottom: '6px',
                      }}
                    >
                      📋 Referensi Kartu Tarif Vendor (Rate Cards):
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                      }}
                    >
                      {selectedVendor.rateCards.map((rc) => (
                        <div
                          key={rc.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.8rem',
                            color: '#cbd5e1',
                            background: '#0f172a',
                            padding: '4px 8px',
                            borderRadius: '4px',
                          }}
                        >
                          <div>
                            <strong>{rc.service_code}</strong>: {rc.description}{' '}
                            &mdash;{' '}
                            <span style={{ color: '#4ade80' }}>
                              Rp {Number(rc.unit_cost).toLocaleString('id-ID')}{' '}
                              / {rc.unit}
                            </span>{' '}
                            <span
                              style={{ color: '#64748b', fontSize: '0.75rem' }}
                            >
                              (Min: {rc.min_order_quantity})
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setAssignedCostValue(rc.unit_cost)}
                            style={{
                              fontSize: '0.72rem',
                              padding: '3px 8px',
                              background: '#0284c7',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                            }}
                          >
                            Pakai Dasar Ini
                          </button>
                        </div>
                      ))}
                    </div>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        color: '#64748b',
                        marginTop: '6px',
                      }}
                    >
                      * Rate card sebagai bantuan kalkulasi; operator tetap
                      mengonfirmasi nilai komitmen akhir di bawah.
                    </div>
                  </div>
                )}

              <div style={{ marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setCustomVendorMode(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '0.75rem',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  + Atau input nama vendor kustom secara manual
                </button>
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor="vendorName">Nama Mitra Vendor Eksternal *</label>
              <input
                id="vendorName"
                name="vendorName"
                type="text"
                className="form-input"
                placeholder="cth. PT Mulia Garmen Blanks, Bintang DTF Subur"
                required
                minLength={2}
              />
              {vendors.length > 0 && (
                <div style={{ marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setCustomVendorMode(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#38bdf8',
                      fontSize: '0.75rem',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    &larr; Kembali ke daftar vendor terdaftar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '0.75rem' }}>
        <label htmlFor="assignedCost">
          Biaya Komitmen Pengerjaan (Rupiah) *
        </label>
        <input
          id="assignedCost"
          name="assignedCost"
          type="number"
          min="0"
          className="form-input"
          value={assignedCostValue}
          onChange={(e) => setAssignedCostValue(e.target.value)}
          required
        />
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
          Nilai ini akan dibukukan sebagai committed cost produksi.
        </span>
      </div>

      <div style={{ marginTop: '0.75rem' }}>
        <label htmlFor="notes">Catatan Instruksi untuk Pelaksana</label>
        <input
          id="notes"
          name="notes"
          type="text"
          className="form-input"
          placeholder="cth. Deadline pengerjaan 3 hari, file pre-flight siap di folder cetak"
        />
      </div>

      {isReassignment && (
        <div style={{ marginTop: '0.75rem' }}>
          <label
            htmlFor="reassignReason"
            style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#f59e0b',
              marginBottom: '4px',
            }}
          >
            Alasan Penugasan Ulang (Reassignment Reason) *
          </label>
          <input
            id="reassignReason"
            name="reassignReason"
            type="text"
            className="form-input"
            placeholder="cth. Vendor utama overcapacity / dialihkan ke vendor cadangan"
            required
            style={{
              borderColor: '#f59e0b',
            }}
          />
        </div>
      )}

      <button
        className="btn-primary"
        disabled={pending}
        style={{ marginTop: '1rem' }}
      >
        {pending
          ? isReassignment
            ? 'Menugaskan Ulang…'
            : 'Menugaskan…'
          : isReassignment
            ? '🔄 Konfirmasi Tugaskan Ulang (Reassign)'
            : '🚀 Tugaskan Pelaksana (Assign)'}
      </button>
    </form>
  );
}
