import { NextResponse, type NextRequest } from 'next/server';

/**
 * Viewer's country from the hosting platform's geo-IP header (Vercel sets
 * `x-vercel-ip-country`). Detail pages stay statically cached and ask for
 * this from the browser instead of reading headers during render.
 */
export function GET(request: NextRequest) {
  const header = request.headers.get('x-vercel-ip-country') ?? request.headers.get('cf-ipcountry');
  const country = header && /^[A-Z]{2}$/.test(header) ? header : null;
  return NextResponse.json({ country }, { headers: { 'Cache-Control': 'private, no-store' } });
}
