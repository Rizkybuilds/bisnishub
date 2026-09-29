import { beforeEach, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ from:vi.fn(), rpc:vi.fn() }));
vi.mock('@bisnishub/shared/services/supabase', () => ({supabase:mocks}));
import { cancelOrder, getOrders, updateOrderTracking } from '@bisnishub/shared/services/ordersApi';
import { deleteProcurement } from '@bisnishub/shared/services/procurementsApi';
beforeEach(() => vi.clearAllMocks());
function queryResult(result) {
  const query = { update:vi.fn(() => query), eq:vi.fn(() => query), select:vi.fn(() => query),
    order:vi.fn(async () => result), maybeSingle:vi.fn(async () => result) };
  mocks.from.mockReturnValue(query);
  return query;
}
it('does not show cached orders as live when reading the database fails',async () => {
  localStorage.setItem('teestock_orders_list',JSON.stringify([{id:'STALE'}]));
  queryResult({data:null,error:new Error('Connection failed')});
  await expect(getOrders()).rejects.toThrow('Connection failed');
});
it('keeps tracking unchanged when persistence is denied',async () => {
  queryResult({data:null,error:new Error('Permission denied')});
  await expect(updateOrderTracking('TS-TEST','NEW')).rejects.toThrow('Permission denied');
  expect(mocks.from).toHaveBeenCalledTimes(1);
});
it('rejects a tracking update that matched no visible order',async () => {
  queryResult({data:null,error:null});
  await expect(updateOrderTracking('TS-MISSING','NEW')).rejects.toThrow('tidak ditemukan');
});
it('uses the locked cancellation RPC and propagates its rejection',async () => {
  mocks.rpc.mockResolvedValue({error:new Error('Pesanan sudah dibayar')});
  await expect(cancelOrder('TS-TEST','Salah input')).rejects.toThrow('sudah dibayar');
  expect(mocks.rpc).toHaveBeenCalledWith('cancel_unpaid_order',{p_order_number:'TS-TEST',p_reason:'Salah input'});
  expect(mocks.from).not.toHaveBeenCalled();
});
it('does not attempt to delete posted procurement records',async () => {
  await expect(deleteProcurement('PO-TEST')).rejects.toThrow('Penghapusan dinonaktifkan');
  expect(mocks.from).not.toHaveBeenCalled();
});
