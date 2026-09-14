import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { format } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import { routes } from '@/lib/routes';
import { CafecitoButton } from '@/components/support/CafecitoButton';

export function Footer({ lang, t }: { lang: Locale; t: Dictionary }) {
  return (
    <footer className="relative z-10 mt-auto w-full border-t border-slate-800/60 bg-slate-950/80 py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 md:flex-row md:items-start md:justify-between md:px-8 lg:px-12">
        <div className="space-y-2">
          <Link href={routes.home(lang)} className="text-lg font-bold text-white">
            Watch<span className="text-secondary">Guru</span>
          </Link>
          <p className="text-sm text-slate-400">{format(t.footerRights, { year: new Date().getFullYear() })}</p>
          <p className="text-sm text-slate-400">
            {t.footerDevelopedBy} <span className="font-semibold text-slate-300">Iván Duarte</span>
          </p>
          <CafecitoButton label={t.supportCafecito} className="mt-2" />
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
          <Link href={routes.list(lang, 'movie')} className="hover:text-secondary">
            {t.movies}
          </Link>
          <Link href={routes.list(lang, 'tv')} className="hover:text-secondary">
            {t.tvShows}
          </Link>
          <Link href={routes.trending(lang)} className="hover:text-secondary">
            {t.trendingAll}
          </Link>
          <Link href={routes.guides(lang)} className="hover:text-secondary">
            {t.guides}
          </Link>
          <Link href={routes.match(lang)} className="hover:text-secondary">
            {t.match}
          </Link>
          <Link href={routes.search(lang)} className="hover:text-secondary">
            {t.advancedSearch}
          </Link>
          <Link href={routes.privacy(lang)} className="hover:text-secondary">
            {t.privacy}
          </Link>
          <Link href={routes.terms(lang)} className="hover:text-secondary">
            {t.terms}
          </Link>
        </nav>

        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex max-w-xs items-start gap-3 text-xs text-slate-500 hover:text-slate-400"
        >
          {/* TMDB's terms require this attribution on apps that use its API. */}
          <span className="shrink-0 rounded bg-gradient-to-r from-[#90cea1] to-[#01b4e4] px-1.5 py-0.5 font-black text-[#0d253f]">
            TMDB
          </span>
          <span>{t.tmdbAttribution}</span>
        </a>
      </div>
    </footer>
  );
}
