import assert from 'node:assert/strict';
const cases = [
  ['http://127.0.0.1:3101/', 'MultiGraph Business OS'],
  ['http://127.0.0.1:3102/', 'TeeStock'],
  ['http://127.0.0.1:3102/custom-atelier', 'Custom Atelier'],
];
for (const [url, text] of cases) {
  const response = await fetch(url);
  assert.equal(response.status, 200, url);
  assert.ok((await response.text()).includes(text), url);
}
for (const [port, app] of [
  [3101, 'mgbos'],
  [3102, 'teestock'],
]) {
  const health = await fetch(`http://127.0.0.1:${port}/health`);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), {
    status: 'ok',
    application: app,
    version: '0.5.4',
  });
  assert.equal(
    (await fetch(`http://127.0.0.1:${port}/missing-route`)).status,
    404,
  );
}
console.log(
  'PASS: both app pages, Custom Atelier, health endpoints, and 404 responses.',
);
