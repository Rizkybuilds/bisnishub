import { vi, beforeEach } from 'vitest';

// Unit tests must never use the production Supabase fallback endpoint.
vi.mock('@bisnishub/shared/services/supabase', () => {
  const query = () => {
    const result = new Proxy({}, { get: (_target,key) => {
      if (key === 'then') return (resolve,reject) => Promise.resolve({data:[],error:null}).then(resolve,reject);
      if (key === 'maybeSingle' || key === 'single') return async () => ({data:null,error:null});
      return () => result;
    }});
    return result;
  };
  return { supabase: { from:query, rpc:vi.fn(async () => ({data:null,error:null})) } };
});
const values = new Map();
vi.stubGlobal('localStorage', {
  getItem:key => values.get(key) ?? null,
  setItem:(key,value) => values.set(key,String(value)),
  removeItem:key => values.delete(key),
  clear:() => values.clear()
});
vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('Network disabled in unit tests'))));
beforeEach(() => values.clear());
