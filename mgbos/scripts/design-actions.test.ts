import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ context: vi.fn(), invalidate: vi.fn() }));
vi.mock('../apps/mgbos/src/app/(app)/designs/data', () => ({
  designContext: mocks.context,
}));
vi.mock('next/cache', () => ({ revalidatePath: mocks.invalidate }));
import { saveDesign } from '../apps/mgbos/src/app/(app)/designs/actions';

const input = {
  requestId: '00000000-0000-4000-8000-000000000001',
  assetId: null,
  expected: 0,
  data: {
    code: 'DEMO-TEST',
    title: 'Studio Hours',
    theme: 'CREATIVE',
    placement: 'FRONT',
    story: '',
  },
};
const session = {
  organization: { id: 'trusted-org' },
  user: { id: 'trusted-actor' },
  role: { code: 'OWNER' },
};
describe('design application command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.context.mockResolvedValue({
      session,
      endpoint: 'http://127.0.0.1:55431/rest/v1/',
      headers: {},
    });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify('saved-id'))),
    );
  });
  it('rejects invalid input before database access', async () => {
    expect((await saveDesign({})).error).toBeTruthy();
    expect(fetch).not.toHaveBeenCalled();
  });
  it('derives actor and organization from session, not user payload', async () => {
    expect(
      await saveDesign({ ...input, p_org: 'attacker', p_actor: 'attacker' }),
    ).toEqual({ id: 'saved-id' });
    const args = vi.mocked(fetch).mock.calls[0]?.[1];
    expect(JSON.parse(String(args?.body))).toMatchObject({
      p_org: 'trusted-org',
      p_actor: 'trusted-actor',
    });
  });
  it('rejects SALES even when read context has been forged in a test', async () => {
    mocks.context.mockResolvedValue({
      session: { ...session, role: { code: 'SALES' } },
    });
    await expect(saveDesign(input)).rejects.toThrow('Akses ditolak');
    expect(fetch).not.toHaveBeenCalled();
  });
  it('reports stale versions without invalidating successful cache', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({ message: 'Design changed; reload before revising' }),
        { status: 400 },
      ),
    );
    expect((await saveDesign(input)).error).toContain('Desain telah berubah');
    expect(mocks.invalidate).not.toHaveBeenCalled();
  });
});
