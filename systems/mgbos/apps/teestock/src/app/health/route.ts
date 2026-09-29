export function GET() {
  return Response.json({
    status: 'ok',
    application: 'teestock',
    version: '0.5.4',
  });
}
