import { describe, it, expect } from 'vitest';

// Simple unit validation for safe cart parsing logic used in StoreContext
describe('Safe LocalStorage Cart Recovery (StoreContext Defensive Parsing)', () => {
  function getSafeCartFromStorage(storageValue) {
    try {
      if (!storageValue) return [];
      const parsed = JSON.parse(storageValue);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  it('mengembalikan array kosong jika localStorage bernilai null atau kosong', () => {
    expect(getSafeCartFromStorage(null)).toEqual([]);
    expect(getSafeCartFromStorage('')).toEqual([]);
  });

  it('menangani data korup/invalid JSON tanpa crash dan mengembalikan array kosong', () => {
    expect(getSafeCartFromStorage('invalid-json{{{')).toEqual([]);
    expect(getSafeCartFromStorage('undefined')).toEqual([]);
    expect(getSafeCartFromStorage('<xml>not json</xml>')).toEqual([]);
  });

  it('menolak data JSON yang bukan array (misal object atau primitive)', () => {
    expect(getSafeCartFromStorage('{"item": "tshirt"}')).toEqual([]);
    expect(getSafeCartFromStorage('"some string"')).toEqual([]);
    expect(getSafeCartFromStorage('12345')).toEqual([]);
    expect(getSafeCartFromStorage('true')).toEqual([]);
  });

  it('memuat data keranjang yang valid secara utuh jika berformat array', () => {
    const validCart = [
      { id: '1', name: 'Raw Identity Tee', qty: 2, price: 99000 },
      { id: '2', name: 'NSA 7200 Blank', qty: 1, price: 52000 }
    ];
    expect(getSafeCartFromStorage(JSON.stringify(validCart))).toEqual(validCart);
  });
});
