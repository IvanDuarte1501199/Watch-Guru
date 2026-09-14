import Link from 'next/link';
import { Film, Sparkles, Tv } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import { routes } from '@/lib/routes';
import { PersonalizeHint } from './PersonalizeHint';

export function MagicSuggest({ lang, t }: { lang: Locale; t: Dictionary }) {
  return (
    <section className="mx-auto my-8 max-w-4xl animate-fade-in md:my-12">
      <div className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-r from-slate-900/90 via-slate-950/90 to-slate-900/90 p-6 shadow-2xl backdrop-blur-md md:flex-row md:p-8">
        <div className="pointer-events-none absolute -top-24 -left-24 h-48 w-48 rounded-full bg-secondary/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 -bottom-24 h-48 w-48 rounded-full bg-tertiary/10 blur-3xl" />

        <div className="z-10 flex items-start gap-4">
          <div className="mt-1 animate-pulse rounded-xl border border-secondary/20 bg-secondary/10 p-3 text-secondary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-white md:text-2xl">{t.dontKnowWhatToWatch}</h2>
            <p className="mt-1 max-w-md text-sm text-slate-400 md:text-base">{t.magicSuggestBody}</p>
            <PersonalizeHint />
          </div>
        </div>

        <div className="z-10 flex w-full flex-col gap-3 sm:flex-row md:w-auto">
          <Link
            href={routes.random(lang, 'movie')}
            className="flex items-center justify-center gap-2.5 rounded-xl bg-secondary px-6 py-3 text-sm font-bold text-slate-950 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-secondary/90 hover:shadow-secondary/20 md:text-base"
          >
            <Film className="h-4 w-4" />
            {t.randomMovie}
          </Link>
          <Link
            href={routes.random(lang, 'tv')}
            className="flex items-center justify-center gap-2.5 rounded-xl border border-slate-800/80 bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:border-slate-700/80 md:text-base"
          >
            <Tv className="h-4 w-4" />
            {t.randomTvShow}
          </Link>
        </div>
      </div>
    </section>
  );
}
