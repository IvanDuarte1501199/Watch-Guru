import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, hasLocale } from '@/lib/i18n/config';
import { searchMulti } from '@/lib/tmdb/api';

const MAX_RESULTS = 8;

/** Autocomplete for the header search box. Proxies TMDB so the API key stays on the server. */
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim() ?? '';
  const langParam = request.nextUrl.searchParams.get('lang') ?? '';
  const lang = hasLocale(langParam) ? langParam : defaultLocale;

  if (query.length < 2 || query.length > 100) {
    return NextResponse.json({ results: [] });
  }

  try {
    const data = await searchMulti(query, lang);
    return NextResponse.json(
      { results: data.results.slice(0, MAX_RESULTS) },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
    );
  } catch (error) {
    console.error('Search failed', error);
    return NextResponse.json({ results: [] }, { status: 502 });
  }
}
