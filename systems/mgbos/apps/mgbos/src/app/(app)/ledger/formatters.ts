export const rupiah = (value: string | bigint | number | null | undefined) => {
  if (value === null || value === undefined) return '-';
  try {
    return 'Rp ' + BigInt(value).toLocaleString('id-ID');
  } catch {
    return 'Rp 0';
  }
};

export const percent = (value: number | null | undefined) => {
  if (value === null || value === undefined || isNaN(value)) return '0.00%';
  return `${Number(value).toFixed(2)}%`;
};
