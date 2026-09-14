import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, hasLocale, LOCALE_COOKIE, locales, type Locale } from '@/lib/i18n/config';

function preferredLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (saved && hasLocale(saved)) return saved;

  const accepted = request.headers.get('accept-language') ?? '';
  for (const part of accepted.split(',')) {
    const language = part.split(';')[0].trim().slice(0, 2).toLowerCase();
    if (hasLocale(language)) return language;
  }
  return defaultLocale;
}

/** Every page lives under a locale prefix; bare URLs (including the old SPA routes) get one added. */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split('/')[1] ?? '';
  if ((locales as readonly string[]).includes(firstSegment)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // og: generated social images; paths with an extension are static assets.
  matcher: ['/((?!api|_next|og(?:/|$)|.*\\..*).*)'],
};
