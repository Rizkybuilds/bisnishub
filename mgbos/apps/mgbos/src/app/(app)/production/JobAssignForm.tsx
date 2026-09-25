'use client';

import {
  useState,
  startTransition,
  useActionState,
  useRef,
  useEffect,
} from 'react';
import { assignProductionJobAction, ProductionActionResult } from './actions';

export function JobAssignForm({
  jobId,
  brands,
  defaultEstimatedCost,
}: {
  jobId: string;
  brands: Array<{ id: string; code: string; name: string }>;
  defaultEstimatedCost?: string;
}) {
  const [executorType, setExecutorType] = useState<'INTERNAL' | 'VENDOR'>(
    'INTERNAL',
  );

  const [state, action, pending] = useActionState(
    async (
      _prev: ProductionActionResult,
      formData: FormData,
    ): Promise<ProductionActionResult> => {
      const type = formData.get('executorType') as 'INTERNAL' | 'VENDOR';
      const assignedBrandId = String(
        formData.get('assignedBrandId') ?? '',
      ).trim();
      const vendorName = String(formData.get('vendorName') ?? '').trim();
      const assignedCost = String(formData.get('assignedCost') ?? '0').trim();
      const notes = String(formData.get('notes') ?? '').trim();

      return assignProductionJobAction({
        jobId,
        executorType: type,
        assignedBrandId:
          type === 'INTERNAL' && assignedBrandId ? assignedBrandId : null,
        vendorName: type === 'VENDOR' && vendorName ? vendorName : null,
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
          defaultValue={defaultEstimatedCost ?? '0'}
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

      <button
        className="btn-primary"
        disabled={pending}
        style={{ marginTop: '1rem' }}
      >
        {pending ? 'Menugaskan…' : '🚀 Tugaskan Pelaksana (Assign)'}
      </button>
    </form>
  );
}
