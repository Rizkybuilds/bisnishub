import {
  ATELIER_SCHEMA,
  GARMENT_SIZES,
  DECORATION_LOCATIONS,
} from '@mgbos/domain';
export function atelierSpecificationFromForm(form: FormData) {
  const text = (name: string) => {
    const value = form.get(name);
    return typeof value === 'string' ? value.trim() : '';
  };
  const number = (name: string) =>
    text(name) === '' ? null : Number(text(name));
  const hasSizes = GARMENT_SIZES.some((size) => text('size' + size) !== '');
  return {
    schemaCode: ATELIER_SCHEMA,
    garment: {
      type: text('garmentType'),
      fit: text('garmentFit'),
      material: text('material'),
      color: text('baseColor'),
      gsm: number('gsm'),
      blankPreference: text('blankPreference'),
    },
    sizes: hasSizes
      ? Object.fromEntries(
          GARMENT_SIZES.map((size) => [size, number('size' + size) ?? 0]),
        )
      : null,
    decorations: DECORATION_LOCATIONS.flatMap((location, index) => {
      const name = 'decoration' + index;
      return form.get(name + 'Enabled') === 'on'
        ? [
            {
              location,
              method: text(name + 'Method'),
              widthCm: number(name + 'widthCm'),
              heightCm: number(name + 'heightCm'),
              colors: number(name + 'colors'),
              artworkReference: text(name + 'Artwork'),
              notes: text(name + 'Notes'),
            },
          ]
        : [];
    }),
    customization: text('customization'),
  };
}
