import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { format, type Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import type { MarathonCard } from '@/lib/marathons/load';
import { routes } from '@/lib/routes';
import { tmdbImage } from '@/lib/tmdb/images';

/** Fan of three posters over the franchise backdrop, tinted with the franchise color. */
export function MarathonCardLink({ card, lang, t, className = '' }: { card: MarathonCard; lang: Locale; t: Dictionary; className?: string }) {
  const [left, center, right] = card.posters;
  const counts = [
    card.movies === 1 ? t.marathonMovieOne : card.movies > 1 ? format(t.marathonMoviesCount, { count: card.movies }) : null,
    card.series === 1 ? t.marathonSeriesOne : card.series > 1 ? format(t.marathonSeriesCount, { count: card.series }) : null,
  ].filter(Boolean);

  const poster = (path: string | undefined, position: string) =>
    path && (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={tmdbImage(path, 'w342')!}
        alt=""
        loading="lazy"
        className={`absolute top-6 left-1/2 aspect-[2/3] w-[104px] rounded-xl object-cover shadow-[0_18px_40px_-12px_rgba(0,0,0,0.9)] ring-1 ring-white/10 transition-transform duration-500 ease-out ${position}`}
      />
    );

  return (
    <Link
      href={routes.marathon(lang, card.slug)}
      style={{ '--accent': card.accent } as React.CSSProperties}
      className={`group relative flex h-[380px] flex-col justify-end overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950 p-5 transition duration-300 hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--accent)_55%,transparent)] ${className}`}
    >
      {card.backdropPath && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={tmdbImage(card.backdropPath, 'w780')!}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-35 blur-[2px] transition duration-700 group-hover:scale-105 group-hover:opacity-45"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/20" />
      <div className="absolute -bottom-24 left-1/2 h-48 w-64 -translate-x-1/2 rounded-full bg-[var(--accent)] opacity-25 blur-3xl transition-opacity duration-500 group-hover:opacity-40" />

      <div aria-hidden className="absolute inset-x-0 top-0 h-56">
        {poster(left, '-translate-x-[118%] translate-y-4 -rotate-[10deg] group-hover:-translate-x-[132%] group-hover:-rotate-[14deg]')}
        {poster(right, 'translate-x-[18%] translate-y-4 rotate-[10deg] group-hover:translate-x-[32%] group-hover:rotate-[14deg]')}
        {poster(center, 'z-10 -translate-x-1/2 group-hover:-translate-y-1.5 group-hover:scale-105')}
      </div>

      <div className="relative flex flex-col gap-1.5">
        <p className="text-[11px] font-bold tracking-[0.14em] text-[var(--accent)] uppercase [filter:brightness(1.25)]">
          {format(t.marathonTitlesCount, { count: card.count })}
          {counts.length > 1 && <span className="font-semibold text-slate-400 normal-case"> · {counts.join(' · ')}</span>}
        </p>
        <h3 className="text-2xl leading-tight font-black tracking-tight text-white">{card.name}</h3>
        <p className="line-clamp-2 text-sm text-slate-300">{card.tagline}</p>
        <span className="mt-2 flex items-center gap-1.5 text-sm font-bold text-white transition-colors group-hover:text-secondary">
          {t.marathonCta}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
