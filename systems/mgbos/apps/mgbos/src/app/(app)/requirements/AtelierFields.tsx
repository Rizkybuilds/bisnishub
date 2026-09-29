import {
  GARMENT_TYPES,
  GARMENT_FITS,
  GARMENT_SIZES,
  DECORATION_METHODS,
  DECORATION_LOCATIONS,
  type CustomAtelierSpecification,
} from '@mgbos/domain';
export function AtelierFields({
  prefix,
  specification,
}: {
  prefix: string;
  specification?: CustomAtelierSpecification;
}) {
  const field = (name: string) => prefix + '-atelier-' + name;
  return (
    <fieldset>
      <legend>Spesifikasi TeeStock Custom Atelier</legend>
      <p>
        Jumlah menggunakan PCS. Simpan revisi baru untuk mengubah spesifikasi
        yang sudah tercatat.
      </p>
      <div className="requirement-grid">
        <div>
          <label htmlFor={field('type')}>Jenis pakaian</label>
          <select
            className="form-input"
            id={field('type')}
            name="garmentType"
            defaultValue={specification?.garment.type}
          >
            {GARMENT_TYPES.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={field('fit')}>Fit</label>
          <select
            className="form-input"
            id={field('fit')}
            name="garmentFit"
            defaultValue={specification?.garment.fit}
          >
            {GARMENT_FITS.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={field('material')}>
            Bahan (mis. Cotton Combed 24s / 30s)
          </label>
          <input
            className="form-input"
            id={field('material')}
            name="material"
            required
            maxLength={120}
            defaultValue={specification?.garment.material}
          />
        </div>
        <div>
          <label htmlFor={field('color')}>Warna dasar</label>
          <input
            className="form-input"
            id={field('color')}
            name="baseColor"
            required
            maxLength={120}
            defaultValue={specification?.garment.color}
          />
        </div>
        <div>
          <label htmlFor={field('gsm')}>GSM (opsional)</label>
          <input
            className="form-input"
            id={field('gsm')}
            name="gsm"
            type="number"
            min="1"
            max="2000"
            step="1"
            defaultValue={specification?.garment.gsm ?? ''}
          />
        </div>
        <div>
          <label htmlFor={field('blank')}>
            Preferensi blank / merek (opsional)
          </label>
          <input
            className="form-input"
            id={field('blank')}
            name="blankPreference"
            maxLength={200}
            defaultValue={specification?.garment.blankPreference}
          />
        </div>
      </div>
      <h4>Rincian ukuran</h4>
      <p>
        Kosongkan semua ukuran jika belum diketahui. Jika diisi, total harus
        sama dengan jumlah pesanan. Kolom kosong dihitung nol.
      </p>
      <div className="requirement-grid">
        {GARMENT_SIZES.map((size) => (
          <div key={size}>
            <label htmlFor={field(size)}>{size}</label>
            <input
              className="form-input"
              id={field(size)}
              name={'size' + size}
              type="number"
              min="0"
              max="2147483647"
              step="1"
              defaultValue={specification?.sizes?.[size] ?? ''}
            />
          </div>
        ))}
      </div>
      <h4>Posisi dan metode dekorasi</h4>
      <p>
        Centang posisi yang digunakan. Dimensi dalam cm; artwork berupa
        referensi teks, bukan unggahan file.
      </p>
      {DECORATION_LOCATIONS.map((location, index) => {
        const item = specification?.decorations.find(
          (x) => x.location === location,
        );
        const name = 'decoration' + index;
        return (
          <details key={location} open={item ? true : undefined}>
            <summary>{location}</summary>
            <label>
              <input
                type="checkbox"
                name={name + 'Enabled'}
                defaultChecked={Boolean(item)}
              />{' '}
              Gunakan posisi {location}
            </label>
            <div className="requirement-grid">
              <div>
                <label htmlFor={field(name + 'Method')}>Metode</label>
                <select
                  className="form-input"
                  id={field(name + 'Method')}
                  name={name + 'Method'}
                  defaultValue={item?.method ?? 'DTF'}
                >
                  {DECORATION_METHODS.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </div>
              {(['widthCm', 'heightCm', 'colors'] as const).map((key) => (
                <div key={key}>
                  <label htmlFor={field(name + key)}>
                    {key === 'widthCm'
                      ? 'Lebar (cm)'
                      : key === 'heightCm'
                        ? 'Tinggi (cm)'
                        : 'Jumlah warna'}
                  </label>
                  <input
                    className="form-input"
                    id={field(name + key)}
                    name={name + key}
                    type="number"
                    min={key === 'colors' ? '1' : '0.01'}
                    max={key === 'colors' ? '100' : '300'}
                    step={key === 'colors' ? '1' : '0.01'}
                    defaultValue={item?.[key] ?? ''}
                  />
                </div>
              ))}
              <div>
                <label htmlFor={field(name + 'Artwork')}>
                  Referensi artwork (opsional)
                </label>
                <input
                  className="form-input"
                  id={field(name + 'Artwork')}
                  name={name + 'Artwork'}
                  maxLength={500}
                  defaultValue={item?.artworkReference}
                />
              </div>
              <div>
                <label htmlFor={field(name + 'Notes')}>
                  Catatan posisi / teknik
                </label>
                <textarea
                  className="form-input"
                  id={field(name + 'Notes')}
                  name={name + 'Notes'}
                  maxLength={2000}
                  defaultValue={item?.notes}
                />
              </div>
            </div>
          </details>
        );
      })}
      <label htmlFor={field('customization')}>
        Tambahan: label, hangtag, kemasan (opsional)
      </label>
      <textarea
        className="form-input"
        id={field('customization')}
        name="customization"
        maxLength={2000}
        defaultValue={specification?.customization}
      />
    </fieldset>
  );
}
