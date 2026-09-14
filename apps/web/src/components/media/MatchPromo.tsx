import Link from 'next/link';
import { Heart, Users } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import { routes } from '@/lib/routes';

export function MatchPromo({ lang, t }: { lang: Locale; t: Dictionary }) {
  return (
    <section className="mx-auto mb-10 max-w-4xl md:mb-14">
      <Link
        href={routes.match(lang)}
        className="group relative flex flex-col items-center justify-between gap-4 overflow-hidden rounded-2xl border border-pink-400/20 bg-gradient-to-r from-pink-500/15 via-slate-950/80 to-secondary/15 p-6 shadow-2xl backdrop-blur-md transition hover:border-pink-400/50 md:flex-row md:p-8"
      >
        <div className="flex items-start gap-4">
          <div className="mt-1 rounded-xl border border-pink-400/30 bg-pink-500/10 p-3 text-pink-300">
            <Users className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-white md:text-2xl">{t.matchPromoTitle}</h2>
            <p className="mt-1 max-w-md text-sm text-slate-300 md:text-base">{t.matchPromoBody}</p>
          </div>
        </div>
        <span className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-secondary px-6 py-3 text-sm font-black whitespace-nowrap text-slate-950 transition group-hover:brightness-110 md:text-base">
          <Heart className="h-4 w-4 fill-slate-950" aria-hidden />
          {t.createRoom}
        </span>
      </Link>
    </section>
  );
}
