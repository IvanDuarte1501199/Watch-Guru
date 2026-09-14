import Link from 'next/link';
import { CalendarDays, Clock, Layers, Star } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import { format } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import { routes } from '@/lib/routes';
import { tmdbImage } from '@/lib/tmdb/images';
import type { MediaDetail } from '@/lib/tmdb/types';

interface DetailHeroProps {
  media: MediaDetail;
  lang: Locale;
  t: Dictionary;
  children?: React.ReactNode;
}

function formatRuntime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  return hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
}

export function DetailHero({ media, lang, t, children }: DetailHeroProps) {
  const poster = tmdbImage(media.poster_path, 'w500');
  const releaseDate = media.release_date
    ? new Date(media.release_date).toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
    : null;
  const runtime = media.media_type === 'movie' ? media.runtime : (media.episode_run_time[0] ?? null);

  return (
    <section className="relative pt-4 pb-8 md:pt-12 md:pb-12">
      <div className="flex flex-col items-start gap-8 md:flex-row md:gap-10">
        {poster && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt={media.title}
            fetchPriority="high"
            className="mx-auto w-2/3 max-w-xs animate-fade-in-right rounded-xl object-contain shadow-2xl sm:w-1/2 md:mx-0 md:w-1/3 md:max-w-sm"
          />
        )}

        <div className="flex w-full min-w-0 animate-fade-in-left flex-col items-start">
          <h1 className="mb-2 text-3xl font-bold md:text-5xl">{media.title}</h1>
          {media.original_title && media.original_title !== media.title && (
            <p className="mb-2 text-sm text-slate-400">{media.original_title}</p>
          )}
          {media.tagline && <p className="mb-4 text-lg text-slate-300 italic">“{media.tagline}”</p>}

          <ul className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-slate-200">
            {releaseDate && (
              <li className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-secondary" aria-hidden />
                {releaseDate}
              </li>
            )}
            {media.vote_average > 0 && (
              <li className="flex items-center gap-2" title={t.rating}>
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" aria-hidden />
                <span>
                  <strong>{media.vote_average.toFixed(1)}</strong> / 10
                  <span className="ml-1 text-xs text-slate-400">({media.vote_count.toLocaleString(lang)})</span>
                </span>
              </li>
            )}
            {runtime ? (
              <li className="flex items-center gap-2" title={t.runtime}>
                <Clock className="h-5 w-5 text-secondary" aria-hidden />
                {formatRuntime(runtime)}
              </li>
            ) : null}
            {media.media_type === 'tv' && media.number_of_seasons > 0 && (
              <li className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-secondary" aria-hidden />
                {media.number_of_seasons === 1
                  ? t.seasonCountOne
                  : format(t.seasonCount, { count: media.number_of_seasons })}
              </li>
            )}
          </ul>

          {media.overview && (
            <>
              <h2 className="h2-guru pb-2">{t.overview}</h2>
              <p className="mb-6 max-w-3xl text-base leading-relaxed text-slate-200 md:text-lg">{media.overview}</p>
            </>
          )}

          {media.genres.length > 0 && (
            <ul className="mb-8 flex flex-wrap gap-2" aria-label={t.genres}>
              {media.genres.map((genre) => (
                <li key={genre.id}>
                  <Link
                    href={routes.genre(lang, media.media_type, genre.id, genre.name)}
                    className="block rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-sm font-semibold text-secondary transition hover:bg-secondary hover:text-slate-950"
                  >
                    {genre.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {children}
        </div>
      </div>
    </section>
  );
}
