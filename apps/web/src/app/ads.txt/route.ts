import { ADSENSE_CLIENT } from '@/lib/site';

/** Authorized sellers file for AdSense; 404 while ads are not configured. */
export function GET() {
  if (!ADSENSE_CLIENT) return new Response('Not found', { status: 404 });
  const publisher = ADSENSE_CLIENT.replace(/^ca-/, '');
  return new Response(`google.com, ${publisher}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=86400' },
  });
}
