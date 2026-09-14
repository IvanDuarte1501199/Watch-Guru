'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import type { MediaSummary } from '@/lib/tmdb/types';
import { ShowMoreGrid } from '@/components/media/ShowMoreGrid';

export function PersonCredits({ movies, tvShows }: { movies: MediaSummary[]; tvShows: MediaSummary[] }) {
  const { t } = useI18n();
  const [tab, setTab] = useState<'movies' | 'tv'>(movies.length > 0 || tvShows.length === 0 ? 'movies' : 'tv');

  const tabs = [
    { id: 'movies' as const, label: t.movies, count: movies.length },
    { id: 'tv' as const, label: t.tvShows, count: tvShows.length },
  ].filter((item) => item.count > 0);

  if (tabs.length === 0) return null;

  return (
    <div>
      <div className="mb-6 flex justify-center gap-8 md:mb-8" role="tablist">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={`h2-guru text-2xl transition hover:text-secondary md:text-3xl ${tab === item.id ? 'text-secondary underline underline-offset-8' : 'text-slate-500'}`}
          >
            {item.label} <span className="text-base text-slate-500">({item.count})</span>
          </button>
        ))}
      </div>
      {tab === 'movies' ? (
        <ShowMoreGrid key="movies" title={t.knownForMovies} items={movies} />
      ) : (
        <ShowMoreGrid key="tv" title={t.knownForTvShows} items={tvShows} />
      )}
    </div>
  );
}
