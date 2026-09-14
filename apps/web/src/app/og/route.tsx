import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

const WIDTH = 1200;
const HEIGHT = 630;

/** Branded social card for pages without artwork of their own: /og?title=...&subtitle=... */
export function GET(request: NextRequest) {
  const title = (request.nextUrl.searchParams.get('title') ?? 'WatchGuru').slice(0, 110);
  const subtitle = (request.nextUrl.searchParams.get('subtitle') ?? '').slice(0, 160);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: 'linear-gradient(135deg, #08042c 0%, #0f172a 55%, #1e3a5f 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 40, fontWeight: 800 }}>
          <span>Watch</span>
          <span style={{ color: '#5fb3cd' }}>Guru</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: title.length > 60 ? 58 : 72, fontWeight: 800, lineHeight: 1.1 }}>{title}</div>
          {subtitle && (
            <div style={{ marginTop: 24, fontSize: 30, color: '#cbd5e1', lineHeight: 1.35 }}>{subtitle}</div>
          )}
        </div>
        <div style={{ display: 'flex', height: 8, width: 240, borderRadius: 8, background: 'linear-gradient(90deg, #ec4899, #5fb3cd)' }} />
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=604800, immutable' },
    },
  );
}
