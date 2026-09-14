import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, hasLocale } from '@/lib/i18n/config';
import { getWatchProviders } from '@/lib/tmdb/api';

const MAX_PROVIDERS = 40;

/** Streaming services in a region, for the taste onboarding. */
export async function GET(request: NextRequest) {
  const region = request.nextUrl.searchParams.get('region')?.toUpperCase() ?? '';
  const langParam = request.nextUrl.searchParams.get('lang') ?? '';
  const lang = hasLocale(langParam) ? langParam : defaultLocale;

  if (!/^[A-Z]{2}$/.test(region)) {
    return NextResponse.json({ providers: [] }, { status: 400 });
  }

  try {
    const providers = await getWatchProviders(region, lang);
    return NextResponse.json(
      { providers: providers.slice(0, MAX_PROVIDERS) },
      { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } },
    );
  } catch (error) {
    console.error('Provider lookup failed', error);
    return NextResponse.json({ providers: [] }, { status: 502 });
  }
}
