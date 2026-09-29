import { customAtelierSchema } from '@mgbos/validation';
export function AtelierSummary({
  specification,
}: {
  specification: Record<string, unknown>;
}) {
  const parsed = customAtelierSchema.safeParse(specification);
  if (!parsed.success) return null;
  const spec = parsed.data;
  return (
    <div>
      <p>
        {spec.garment.type} · {spec.garment.fit} · {spec.garment.material} ·{' '}
        {spec.garment.color}
      </p>
      {spec.garment.gsm && <p>Berat kain: {spec.garment.gsm} GSM</p>}
      {spec.garment.blankPreference && (
        <p>Preferensi blank: {spec.garment.blankPreference}</p>
      )}
      <p>
        Ukuran:{' '}
        {spec.sizes
          ? Object.entries(spec.sizes)
              .map(([size, qty]) => `${size}: ${qty}`)
              .join(' · ')
          : 'Belum ditentukan'}
      </p>
      <ul>
        {spec.decorations.map((item) => (
          <li key={item.location}>
            {item.location} — {item.method}; {item.widthCm ?? '?'} ×{' '}
            {item.heightCm ?? '?'} cm
            {item.colors ? `; ${item.colors} warna` : ''}
            {item.artworkReference && <p>Artwork: {item.artworkReference}</p>}
            {item.notes && <p>{item.notes}</p>}
          </li>
        ))}
      </ul>
      {spec.customization && <p>Tambahan: {spec.customization}</p>}
    </div>
  );
}
