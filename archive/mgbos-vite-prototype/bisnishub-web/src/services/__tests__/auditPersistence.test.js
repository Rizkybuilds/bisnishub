import { it, expect, vi, beforeEach } from 'vitest';
const mocks = vi.hoisted(() => ({ insert: vi.fn(), rpc: vi.fn() }));
vi.mock('@bisnishub/shared/services/supabase', () => ({ supabase: { from: () => ({insert:mocks.insert}), rpc:mocks.rpc } }));
vi.mock('@bisnishub/shared/services/supabase.js', () => ({ supabase: { from: () => ({insert:mocks.insert}), rpc:mocks.rpc } }));
import { recordCashTransaction } from '@bisnishub/shared/services/ledgerApi';
import { saveProcurement } from '@bisnishub/shared/services/procurementsApi';
import { updateOrderStatus } from '@bisnishub/shared/services/ordersApi';
beforeEach(() => { vi.clearAllMocks(); });
it('does not report a rejected ledger write as successful',async () => {
 mocks.insert.mockResolvedValue({error:new Error('Permission denied')});
 await expect(recordCashTransaction({amount:100})).rejects.toThrow('Permission denied');
});
it('does not continue procurement after the database rejects it',async () => {
 mocks.insert.mockResolvedValue({error:new Error('Permission denied')});
 await expect(saveProcurement({qty:1,unitCost:100})).rejects.toThrow('Permission denied');
 expect(mocks.insert).toHaveBeenCalledTimes(1);
});
it('propagates insufficient stock without falling back to a local status update',async () => {
 mocks.rpc.mockResolvedValue({error:new Error('Insufficient stock')});
 await expect(updateOrderStatus('TS-ORDER','dtf',[{sku:'NSA-7200-HITAM-L',qty:2}])).rejects.toThrow('Insufficient stock');
});
