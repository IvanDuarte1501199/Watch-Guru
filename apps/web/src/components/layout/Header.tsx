'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { LOCALE_COOKIE, locales, type Locale } from '@/lib/i18n/config';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import { routes } from '@/lib/routes';
import { SearchBox } from './SearchBox';
import { UserMenu } from './UserMenu';

function swapLocale(pathname: string, target: Locale): string {
  const segments = pathname.split('/');
  segments[1] = target;
  return segments.join('/') || `/${target}`;
}

/** Lets the proxy send bare URLs to the language the viewer picked last. */
function rememberLocale(target: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${target}; path=/; max-age=31536000; samesite=lax`;
}

export function Header() {
  const { lang, t } = useI18n();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { name: t.tvShows, href: routes.list(lang, 'tv') },
    { name: t.movies, href: routes.list(lang, 'movie') },
    { name: t.match, href: routes.match(lang) },
  ];

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full border-b transition-colors duration-300 ${
        scrolled || mobileSearchOpen
          ? 'border-slate-800/50 bg-slate-950/80 shadow-lg backdrop-blur-lg'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8 lg:px-12">
        <Link href={routes.home(lang)} className="flex shrink-0 items-center gap-2 transition duration-200 hover:scale-105">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="" className="h-9 w-9" />
          <span className="text-xl font-bold tracking-tight text-white">
            Watch<span className="text-secondary">Guru</span>
          </span>
        </Link>

        <div className="hidden w-full max-w-md md:block">
          <SearchBox />
        </div>

        <nav className="flex items-center gap-4 md:gap-8">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`hidden text-sm font-semibold tracking-wide transition duration-200 hover:text-secondary sm:block ${
                  active ? 'border-b-2 border-secondary pb-1 text-secondary' : 'text-slate-300'
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setMobileSearchOpen((open) => !open)}
            aria-label={mobileSearchOpen ? t.closeSearch : t.search}
            className="rounded-lg p-2 text-slate-300 hover:text-secondary md:hidden"
          >
            {mobileSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>

          <div
            className="flex rounded-full border border-slate-800 bg-slate-900/80 p-0.5 backdrop-blur-sm"
            role="group"
            aria-label={t.language}
          >
            {locales.map((locale) => (
              <Link
                key={locale}
                href={swapLocale(pathname, locale)}
                onClick={() => rememberLocale(locale)}
                hrefLang={locale}
                aria-current={locale === lang ? 'true' : undefined}
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase transition duration-200 ${
                  locale === lang ? 'bg-secondary text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {locale}
              </Link>
            ))}
          </div>

          <UserMenu />
        </nav>
      </div>

      {mobileSearchOpen && (
        <div className="border-t border-slate-800/50 px-4 pb-4 md:hidden">
          <nav className="flex gap-6 py-3 sm:hidden">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileSearchOpen(false)}
                className="text-sm font-semibold text-slate-300 hover:text-secondary"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <SearchBox autoFocus onNavigate={() => setMobileSearchOpen(false)} />
        </div>
      )}
    </header>
  );
}
