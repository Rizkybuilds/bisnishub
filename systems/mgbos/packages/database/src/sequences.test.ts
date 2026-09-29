import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  requestNextDocumentSequence,
  requestGenerateDocumentNumber,
} from './sequences';

describe('Document Sequence client functions', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('requests next document sequence and parses response correctly', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => 42,
    });
    vi.stubGlobal('fetch', mockFetch);

    const seq = await requestNextDocumentSequence(
      { supabaseUrl: 'http://localhost:55431', apiKey: 'test-api-key' },
      {
        organizationId: '123e4567-e89b-12d3-a456-426614174000',
        brandId: '123e4567-e89b-12d3-a456-426614174001',
        documentType: 'L',
        year: 2026,
      },
    );

    expect(seq).toBe(42);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const firstCall = mockFetch.mock.calls[0];
    expect(firstCall).toBeDefined();
    const [url, options] = firstCall!;
    expect(url).toBe(
      'http://localhost:55431/rest/v1/rpc/next_document_sequence',
    );
    expect(options.method).toBe('POST');
    expect(options.headers['Content-Profile']).toBe('app');
    expect(options.headers.Authorization).toBe('Bearer test-api-key');
  });

  it('throws an error when requestNextDocumentSequence encounters a failure', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: async () => 'Database error',
    });
    vi.stubGlobal('fetch', mockFetch);

    await expect(
      requestNextDocumentSequence(
        { supabaseUrl: 'http://localhost:55431', apiKey: 'test-api-key' },
        {
          organizationId: '123e4567-e89b-12d3-a456-426614174000',
          brandId: '123e4567-e89b-12d3-a456-426614174001',
          documentType: 'L',
        },
      ),
    ).rejects.toThrow('Failed to generate sequence: 500');
  });

  it('requests formatted document number and parses response correctly', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => 'TS-L-2026-000001',
    });
    vi.stubGlobal('fetch', mockFetch);

    const docNumber = await requestGenerateDocumentNumber(
      { supabaseUrl: 'http://localhost:55431', apiKey: 'test-api-key' },
      {
        organizationId: '123e4567-e89b-12d3-a456-426614174000',
        brandId: '123e4567-e89b-12d3-a456-426614174001',
        documentType: 'L',
        year: 2026,
        padLength: 6,
      },
    );

    expect(docNumber).toBe('TS-L-2026-000001');
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const secondCall = mockFetch.mock.calls[0];
    expect(secondCall).toBeDefined();
    const [url, options] = secondCall!;
    expect(url).toBe(
      'http://localhost:55431/rest/v1/rpc/generate_document_number',
    );
    expect(options.method).toBe('POST');
    expect(options.headers['Content-Profile']).toBe('app');
  });

  it('throws an error when requestGenerateDocumentNumber fails', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      text: async () => 'Brand not found',
    });
    vi.stubGlobal('fetch', mockFetch);

    await expect(
      requestGenerateDocumentNumber(
        { supabaseUrl: 'http://localhost:55431', apiKey: 'test-api-key' },
        {
          organizationId: '123e4567-e89b-12d3-a456-426614174000',
          brandId: '123e4567-e89b-12d3-a456-426614174001',
          documentType: 'L',
        },
      ),
    ).rejects.toThrow('Failed to generate document number: 400');
  });
});
