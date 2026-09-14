const ALLOWED_ORIGINS = [
  'https://teestockapparel.vercel.app',
  'https://teestock.vercel.app',
  'https://teestock.id',
  'http://localhost:5173',
  'http://localhost:3000',
];

export function getCorsHeaders(req?: Request) {
  const origin = req ? req.headers.get('Origin') : null;
  const isAllowed = origin && (ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.vercel.app'));
  const allowOrigin = isAllowed ? origin : 'https://teestockapparel.vercel.app';

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  };
}

export const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://teestockapparel.vercel.app',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};
