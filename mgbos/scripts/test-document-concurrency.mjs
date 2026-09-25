import assert from 'node:assert/strict';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:55431';
const SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

async function main() {
  console.log(
    'Testing MGBOS-004 Document Number Concurrency (100 parallel requests)...',
  );

  // Fetch TeeStock brand and organization
  const brandRes = await fetch(`${SUPABASE_URL}/rest/v1/brands?code=eq.TS`, {
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Accept-Profile': 'app',
    },
  });
  assert.equal(brandRes.status, 200, 'Failed to fetch TS brand');
  const brands = await brandRes.json();
  assert.ok(brands.length > 0, 'TS brand not found');
  const brandId = brands[0].id;
  const orgId = brands[0].organization_id;

  // Execute 100 parallel calls to generate_document_number
  const CONCURRENCY_COUNT = 100;
  const testDocType = 'CONCUR';
  const promises = [];

  for (let i = 0; i < CONCURRENCY_COUNT; i++) {
    promises.push(
      fetch(`${SUPABASE_URL}/rest/v1/rpc/generate_document_number`, {
        method: 'POST',
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Content-Profile': 'app',
        },
        body: JSON.stringify({
          p_organization_id: orgId,
          p_brand_id: brandId,
          p_document_type: testDocType,
          p_year: 2026,
          p_pad_length: 6,
        }),
      }).then(async (res) => {
        if (!res.ok) {
          throw new Error(
            `RPC call failed with status ${res.status}: ${await res.text()}`,
          );
        }
        return res.json();
      }),
    );
  }

  const results = await Promise.all(promises);
  assert.equal(
    results.length,
    CONCURRENCY_COUNT,
    'All 100 requests must complete',
  );

  const uniqueNumbers = new Set(results);
  assert.equal(
    uniqueNumbers.size,
    CONCURRENCY_COUNT,
    `Duplicate numbers detected! Expected ${CONCURRENCY_COUNT} unique, got ${uniqueNumbers.size}`,
  );

  // Validate format and continuity
  const sequences = results.map((num) => {
    const parts = num.split('-');
    assert.equal(parts.length, 4, `Invalid number format: ${num}`);
    assert.equal(parts[0], 'TS');
    assert.equal(parts[1], testDocType);
    assert.equal(parts[2], '2026');
    return parseInt(parts[3], 10);
  });

  sequences.sort((a, b) => a - b);
  assert.equal(sequences[0], 1, 'First sequence must be 1');
  assert.equal(
    sequences[sequences.length - 1],
    CONCURRENCY_COUNT,
    `Last sequence must be ${CONCURRENCY_COUNT}`,
  );

  console.log(
    `PASS: 100 concurrent requests generated 100 collision-free sequential numbers.`,
  );
  console.log(
    `Sample output: ${results[0]} ... ${results[results.length - 1]}`,
  );
}

main().catch((err) => {
  console.error('CONCURRENCY TEST FAILED:', err);
  process.exit(1);
});
