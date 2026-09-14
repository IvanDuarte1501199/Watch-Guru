'use client';

import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import type { LibraryEntry, LibraryStatus } from '@/lib/api';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import { routes } from '@/lib/routes';
import { tmdbImage } from '@/lib/tmdb/images';
import { StarRating } from './StarRating';
import { statusOptions } from './statusOptions';

interface LibraryCardProps {
  entry: LibraryEntry;
  onStatus: (status: LibraryStatus | null) => void;
  onRate: (rating: number | null) => void;
  onRemove: () => void;
}

/** A title in My list with its controls always visible: status, rating and remove. */
export function LibraryCard({ entry, onStatus, onRate, onRemove }: LibraryCardProps) {
  const { lang, t } = useI18n();
  const poster = tmdbImage(entry.posterPath, 'w342');
  const href = routes.media(lang, entry.mediaType, entry.tmdbId, entry.title);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/70 shadow-md transition hover:border-slate-700">
      <Link href={href} className="group relative block aspect-[2/3] overflow-hidden bg-slate-900">
        {poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt={entry.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full items-center justify-center p-4 text-center font-bold text-slate-300">{entry.title}</span>
        )}
        <span className="absolute top-2 left-2 rounded-full bg-slate-950/80 px-2 py-0.5 text-[10px] font-bold tracking-wide text-slate-300 uppercase backdrop-blur">
          {entry.mediaType === 'tv' ? t.tvShow : t.movie}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-2.5">
        <div className="min-w-0">
          <Link href={href} className="line-clamp-1 text-sm font-bold text-white hover:text-secondary" title={entry.title}>
            {entry.title}
          </Link>
          {entry.releaseDate && <p className="text-xs text-slate-500">{entry.releaseDate.slice(0, 4)}</p>}
        </div>

        <div className="grid grid-cols-3 gap-1" role="group" aria-label={t.statusWatchlist}>
          {statusOptions(t).map(({ value, label, icon: Icon, activeClass }) => {
            const active = entry.status === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                title={label}
                onClick={() => onStatus(active ? null : value)}
                className={`flex h-8 items-center justify-center rounded-lg border text-xs font-semibold transition ${
                  active ? `border-transparent ${activeClass}` : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden />
                <span className="sr-only">{label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-auto flex items-center justify-between gap-1">
          <StarRating value={entry.rating} onChange={onRate} size="sm" />
          <button
            type="button"
            onClick={onRemove}
            aria-label={t.removeFromLibrary}
            title={t.removeFromLibrary}
            className="shrink-0 rounded-lg p-1.5 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </article>
  );
}
