export function GET() {
  return Response.json({
    status: 'ok',
    application: 'mgbos',
    version: '0.5.4',
  });
}
