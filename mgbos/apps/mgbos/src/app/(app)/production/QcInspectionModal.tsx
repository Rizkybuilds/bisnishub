'use client';

import {
  useState,
  startTransition,
  useActionState,
  useRef,
  useEffect,
} from 'react';
import { recordQcInspectionAction, ProductionActionResult } from './actions';

export function QcInspectionModal({ jobId }: { jobId: string }) {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<'PASS' | 'REWORK' | 'REJECTED'>('PASS');
  const [defectCount, setDefectCount] = useState<number>(0);

  const [state, action, pending] = useActionState(
    async (
      _prev: ProductionActionResult,
      formData: FormData,
    ): Promise<ProductionActionResult> => {
      const resVal = String(formData.get('result') ?? 'PASS') as
        'PASS' | 'REWORK' | 'REJECTED';
      const sampleSize = Number(formData.get('sampleSize') ?? 1);
      const defCount = Number(formData.get('defectCount') ?? 0);
      const defectCategory = String(
        formData.get('defectCategory') ?? '',
      ).trim();
      const defectSeverity = String(
        formData.get('defectSeverity') ?? '',
      ).trim();
      const reworkInstructions = String(
        formData.get('reworkInstructions') ?? '',
      ).trim();
      const notes = String(formData.get('notes') ?? '').trim();

      const checklistSnapshot = {
        fabric_check: formData.get('chk_fabric') === 'on',
        alignment_check: formData.get('chk_alignment') === 'on',
        adhesion_check: formData.get('chk_adhesion') === 'on',
        color_check: formData.get('chk_color') === 'on',
        label_check: formData.get('chk_label') === 'on',
      };

      const res = await recordQcInspectionAction({
        productionJobId: jobId,
        result: resVal,
        sampleSize,
        defectCount: defCount,
        defectCategory: defectCategory || null,
        defectSeverity: defectSeverity || null,
        checklistSnapshot,
        reworkInstructions: reworkInstructions || null,
        notes: notes || null,
      });

      if (res.success) {
        setOpen(false);
      }
      return res;
    },
    {},
  );

  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state.error) errorRef.current?.focus();
  }, [state]);

  const showDefectFields = result === 'REWORK' || defectCount > 0;

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="btn-primary"
        style={{
          padding: '8px 16px',
          fontSize: '0.9rem',
          background: '#0284c7',
          borderColor: '#0284c7',
        }}
      >
        {open ? 'Tutup Formulir QC' : '🔍 Lakukan Inspeksi QC Digital'}
      </button>

      {open && (
        <form
          className="requirement-form"
          action={action}
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            startTransition(() => action(data));
          }}
          style={{
            marginTop: '1.25rem',
            border: '1px solid #38bdf8',
            padding: '1.5rem',
            borderRadius: '8px',
            background: 'rgba(56, 189, 248, 0.03)',
          }}
        >
          <h3 style={{ margin: '0 0 1rem', color: '#38bdf8' }}>
            Lembar Kerja Digital QC Inspection
          </h3>

          {state.error && (
            <p
              role="alert"
              tabIndex={-1}
              ref={errorRef}
              className="error-banner"
            >
              {state.error}
            </p>
          )}

          <div>
            <label style={{ fontWeight: 600 }}>
              Keputusan Hasil Akhir QC *
            </label>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '6px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="result"
                  value="PASS"
                  checked={result === 'PASS'}
                  onChange={() => setResult('PASS')}
                />
                <span style={{ color: '#4ade80', fontWeight: 700 }}>
                  ✅ LOLOS (PASS)
                </span>
              </label>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="result"
                  value="REWORK"
                  checked={result === 'REWORK'}
                  onChange={() => setResult('REWORK')}
                />
                <span style={{ color: '#fb923c', fontWeight: 700 }}>
                  ⚠️ PERBAIKAN (REWORK)
                </span>
              </label>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="result"
                  value="REJECTED"
                  checked={result === 'REJECTED'}
                  onChange={() => setResult('REJECTED')}
                />
                <span style={{ color: '#f87171', fontWeight: 700 }}>
                  ❌ TOLAK (REJECTED)
                </span>
              </label>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginTop: '1rem',
            }}
          >
            <div>
              <label htmlFor="sampleSize">
                Jumlah Sample yang Diperiksa (Pcs) *
              </label>
              <input
                id="sampleSize"
                name="sampleSize"
                type="number"
                min="1"
                defaultValue="5"
                className="form-input"
                required
              />
            </div>
            <div>
              <label htmlFor="defectCount">
                Jumlah Barang Cacat / Defect *
              </label>
              <input
                id="defectCount"
                name="defectCount"
                type="number"
                min="0"
                value={defectCount}
                onChange={(e) => setDefectCount(Number(e.target.value))}
                className="form-input"
                required
              />
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label
              style={{ fontWeight: 600, display: 'block', marginBottom: '6px' }}
            >
              Checklist Standar Mutu Fisik
            </label>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                background: '#0f172a',
                padding: '10px 14px',
                borderRadius: '6px',
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                <input type="checkbox" name="chk_fabric" defaultChecked />
                <span>
                  Kain &amp; Garmen: Bebas lubang, noda minyak, dan benang sisa
                  rapuh
                </span>
              </label>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                <input type="checkbox" name="chk_alignment" defaultChecked />
                <span>
                  Presisi Posisi: Sablon/bordir senter dengan margin toleransi
                  maksimal &le; 5mm
                </span>
              </label>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                <input type="checkbox" name="chk_adhesion" defaultChecked />
                <span>
                  Uji Adhesi Tinta: Tidak pecah saat ditarik, tidak ada white
                  fringing
                </span>
              </label>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                <input type="checkbox" name="chk_color" defaultChecked />
                <span>
                  Akurasi Warna: Sesuai mockup digital yang disetujui pelanggan
                </span>
              </label>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                <input type="checkbox" name="chk_label" defaultChecked />
                <span>
                  Labeling: Tag ukuran dan brand terpasang rapi dan benar
                </span>
              </label>
            </div>
          </div>

          {showDefectFields && (
            <div
              style={{
                marginTop: '1rem',
                padding: '1rem',
                background: '#1c1917',
                border: '1px solid #78350f',
                borderRadius: '6px',
              }}
            >
              <h4 style={{ margin: '0 0 0.75rem', color: '#f59e0b' }}>
                Rincian Cacat &amp; Instruksi Rework Wajib
              </h4>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                }}
              >
                <div>
                  <label htmlFor="defectCategory">
                    Kategori Cacat / Defect *
                  </label>
                  <select
                    id="defectCategory"
                    name="defectCategory"
                    className="form-input"
                    required
                  >
                    <option value="PRINT_MISALIGNMENT">
                      PRINT_MISALIGNMENT (Sablon Miring / Geser)
                    </option>
                    <option value="ADHESION">
                      ADHESION (Lem Kurang Matang / Mengelupas)
                    </option>
                    <option value="COLOR_SHIFT">
                      COLOR_SHIFT (Penyimpangan Warna / Kusam)
                    </option>
                    <option value="FABRIC">
                      FABRIC (Cacat Kain / Benang Loncat / Bolong)
                    </option>
                    <option value="SIZING">
                      SIZING (Ukuran Tidak Sesuai Pola / Salah Size)
                    </option>
                    <option value="FINISHING_PACKAGING">
                      FINISHING_PACKAGING (Salah Lipat / Label Terbalik)
                    </option>
                    <option value="OTHER">OTHER (Lainnya)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="defectSeverity">Tingkat Keparahan *</label>
                  <select
                    id="defectSeverity"
                    name="defectSeverity"
                    className="form-input"
                    required
                  >
                    <option value="MINOR">
                      MINOR (Dapat Diperbaiki Cepat Tanpa Ganti Bahan)
                    </option>
                    <option value="MAJOR">
                      MAJOR (Membutuhkan Press Ulang / Gantian Sablon)
                    </option>
                    <option value="CRITICAL">
                      CRITICAL (Garmen Rusak Total / Wajib Bahan Baru)
                    </option>
                  </select>
                </div>
              </div>

              {result === 'REWORK' && (
                <div style={{ marginTop: '0.75rem' }}>
                  <label htmlFor="reworkInstructions">
                    Instruksi Rework untuk Operator *
                  </label>
                  <textarea
                    id="reworkInstructions"
                    name="reworkInstructions"
                    rows={2}
                    className="form-input"
                    placeholder="cth. Press ulang dengan sheet teflon 5 detik 160C, atau print ulang sisi depan 5 pcs size L"
                    required
                    minLength={5}
                  />
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: '0.75rem' }}>
            <label htmlFor="notes">Catatan Tambahan Inspektur</label>
            <input
              id="notes"
              name="notes"
              type="text"
              className="form-input"
              placeholder="cth. Suhu ruang finishing 27C, sampel diambil acak dari box A dan B"
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px',
              marginTop: '1.25rem',
            }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-secondary"
            >
              Batal
            </button>
            <button className="btn-primary" disabled={pending}>
              {pending
                ? 'Mencatat QC…'
                : '✅ Simpan &amp; Lanjutkan Alur Kerja'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
