'use client';
import { startTransition, useActionState, useEffect, useRef } from 'react';
import { AtelierFields } from './AtelierFields';
import { customAtelierSchema } from '@mgbos/validation';
import { requirementAction, type RequirementActionState } from './actions';
import type { VersionRow } from './data';
export interface Choice {
  id: string;
  label: string;
}
export function RequirementForm({
  operation,
  requirementId,
  version,
  leads = [],
  customers = [],
  targetStatus,
  atelier = false,
}: {
  operation: 'create' | 'revise' | 'lock' | 'transition';
  requirementId?: string;
  version?: VersionRow;
  leads?: Choice[];
  customers?: Choice[];
  targetStatus?: string;
  atelier?: boolean;
}) {
  const [state, action, pending] = useActionState<
    RequirementActionState,
    FormData
  >(requirementAction, {});
  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (state.error) errorRef.current?.focus();
    else if (state.success) formRef.current?.reset();
  }, [state]);
  const existingAtelier = customAtelierSchema.safeParse(version?.specification);
  const useAtelier = atelier || existingAtelier.success;
  const prefix =
    operation +
    (useAtelier ? '-atelier' : '') +
    '-' +
    (version?.id ?? requirementId ?? 'new') +
    '-' +
    (targetStatus ?? '');
  const fields = operation === 'create' || operation === 'revise';
  const labels: Record<string, string> = {
    READY: 'Tandai siap',
    NEEDS_INFORMATION: 'Minta informasi',
    CANCELLED: 'Batalkan requirement',
  };
  return (
    <form
      ref={formRef}
      action={action}
      className="requirement-form"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        // Dispatch explicitly: failed validation must not reset uncontrolled inputs.
        startTransition(() => action(data));
      }}
    >
      <input type="hidden" name="operation" value={operation} />
      <input
        type="hidden"
        name="specificationMode"
        value={useAtelier ? 'atelier' : 'generic'}
      />
      <input type="hidden" name="requirementId" value={requirementId ?? ''} />
      <input type="hidden" name="versionId" value={version?.id ?? ''} />
      <input type="hidden" name="targetStatus" value={targetStatus ?? ''} />
      {state.error && (
        <p ref={errorRef} tabIndex={-1} className="error-banner" role="alert">
          {state.error}
        </p>
      )}
      {state.success && <p role="status">Perubahan berhasil disimpan.</p>}
      {operation === 'create' && (
        <>
          <label htmlFor={prefix + 'title'}>Judul kebutuhan</label>
          <input
            className="form-input"
            id={prefix + 'title'}
            name="title"
            required
            minLength={2}
            maxLength={255}
          />
          <label htmlFor={prefix + 'lead'}>Inquiry terkait (opsional)</label>
          <select className="form-input" id={prefix + 'lead'} name="leadId">
            <option value="">Tanpa inquiry</option>
            {leads.map((x) => (
              <option key={x.id} value={x.id}>
                {x.label}
              </option>
            ))}
          </select>
          <label htmlFor={prefix + 'customer'}>Pelanggan (opsional)</label>
          <select
            className="form-input"
            id={prefix + 'customer'}
            name="customerAccountId"
          >
            <option value="">Belum ditentukan</option>
            {customers.map((x) => (
              <option key={x.id} value={x.id}>
                {x.label}
              </option>
            ))}
          </select>
        </>
      )}
      {fields && (
        <>
          <label htmlFor={prefix + 'summary'}>Ringkasan spesifikasi</label>
          <textarea
            className="form-input"
            id={prefix + 'summary'}
            name="summary"
            rows={4}
            required
            minLength={2}
            defaultValue={version?.summary}
          />
          <div className="requirement-grid">
            <div>
              <label htmlFor={prefix + 'qty'}>Jumlah</label>
              <input
                className="form-input"
                id={prefix + 'qty'}
                name="quantity"
                type="number"
                required={useAtelier}
                min="1"
                max="2147483647"
                step="1"
                defaultValue={version?.quantity ?? ''}
              />
            </div>
            <div>
              <label htmlFor={prefix + 'unit'}>Satuan</label>
              <input
                className="form-input"
                id={prefix + 'unit'}
                name="unit"
                required
                maxLength={24}
                readOnly={useAtelier}
                defaultValue={version?.unit ?? 'PCS'}
              />
            </div>
            <div>
              <label htmlFor={prefix + 'budget'}>
                Anggaran total (Rp, opsional)
              </label>
              <input
                className="form-input"
                id={prefix + 'budget'}
                name="targetBudget"
                inputMode="numeric"
                pattern="[0-9]+"
                defaultValue={version?.target_budget ?? ''}
              />
            </div>
            <div>
              <label htmlFor={prefix + 'date'}>Target selesai (opsional)</label>
              <input
                className="form-input"
                id={prefix + 'date'}
                name="targetDate"
                type="date"
                defaultValue={version?.target_date ?? ''}
              />
            </div>
          </div>
        </>
      )}
      {fields && useAtelier && (
        <AtelierFields
          prefix={prefix}
          specification={
            existingAtelier.success ? existingAtelier.data : undefined
          }
        />
      )}
      {operation === 'lock' && (
        <>
          <p>
            Versi ini akan dikunci permanen. Perubahan selanjutnya harus dibuat
            sebagai versi baru.
          </p>
          <label htmlFor={prefix + 'reason'}>Alasan penguncian</label>
          <input
            className="form-input"
            id={prefix + 'reason'}
            name="reason"
            required
            minLength={2}
          />
        </>
      )}
      {targetStatus === 'CANCELLED' && (
        <label>
          <input type="checkbox" required /> Saya memastikan kebutuhan ini
          dibatalkan. Riwayat tetap tersimpan.
        </label>
      )}
      <button className="btn-primary" disabled={pending}>
        {pending
          ? 'Menyimpan…'
          : operation === 'create'
            ? 'Simpan kebutuhan'
            : operation === 'revise'
              ? 'Simpan versi baru'
              : operation === 'lock'
                ? 'Kunci versi'
                : (labels[targetStatus ?? ''] ?? 'Ubah status')}
      </button>
    </form>
  );
}
