import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { routes } from '@/lib/routes';
import { tmdbImage } from '@/lib/tmdb/images';
import type { MediaSummary } from '@/lib/tmdb/types';
import { QuickStatusButton } from '@/components/library/QuickStatusButton';
import { RatingBadge } from '@/components/ui/RatingBadge';

export function MediaCard({ item, lang }: { item: MediaSummary; lang: Locale }) {
  const poster = tmdbImage(item.poster_path, 'w342');
  const year = item.release_date ? item.release_date.slice(0, 4) : null;

  return (
    <article className="group relative aspect-[2/3] overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950 shadow-md transition-all duration-300 hover:border-secondary/40 hover:shadow-2xl hover:shadow-secondary/5">
      <Link href={routes.media(lang, item.media_type, item.id, item.title)} className="block h-full w-full">
        {poster ? (
          // eslint-disable-next-line @next/next/no-img-element -- TMDB's CDN already serves resized images
          <img
            loading="lazy"
            src={poster}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 p-6 text-center">
            <span className="text-base font-bold tracking-tight text-slate-300">{item.title}</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="absolute inset-x-0 bottom-0 z-10 flex translate-y-1 flex-col gap-1 p-3 transition-transform duration-300 group-hover:translate-y-0 md:p-4">
          <h3 className="line-clamp-2 text-sm leading-snug font-bold tracking-wide text-white transition-colors duration-200 group-hover:text-secondary">
            {item.title}
          </h3>
          {year && <span className="text-xs font-semibold text-slate-400">{year}</span>}
        </div>

        {item.vote_average > 0 && (
          <span className="absolute top-3 left-3 z-20">
            <RatingBadge rating={item.vote_average} />
          </span>
        )}
      </Link>

      {/* Outside the link: interactive controls can't be nested inside an anchor. */}
      <QuickStatusButton
        info={{
          mediaType: item.media_type,
          tmdbId: item.id,
          title: item.title,
          posterPath: item.poster_path,
          releaseDate: item.release_date,
          genreIds: item.genre_ids,
        }}
      />
    </article>
  );
}
