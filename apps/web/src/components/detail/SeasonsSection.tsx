'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { format } from '@/lib/i18n/config';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import type { Episode, Season } from '@/lib/tmdb/types';

interface SeasonsSectionProps {
  seasons: Season[];
  episodes: Record<number, Episode[]>;
  /** Server-rendered ratings heatmap, shown when the "Ratings" tab is active. */
  ratingsGrid: React.ReactNode;
}

export function SeasonsSection({ seasons, episodes, ratingsGrid }: SeasonsSectionProps) {
  const { t, lang } = useI18n();
  const [view, setView] = useState<'list' | 'grid'>('list');

  if (seasons.length === 0) return null;

  const tabClass = (active: boolean) =>
    `rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all duration-200 ${
      active ? 'bg-secondary text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
    }`;

  return (
    <section className="mb-10 md:mb-16">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="h2-guru">
          {t.seasonsAndEpisodes}{' '}
          <span className="ml-1 text-sm font-semibold text-slate-400">
            ({seasons.length === 1 ? t.seasonCountOne : format(t.seasonCount, { count: seasons.length })})
          </span>
        </h2>
        <div className="flex self-start rounded-xl border border-slate-800 bg-slate-900/80 p-0.5 sm:self-auto" role="tablist">
          <button type="button" role="tab" aria-selected={view === 'list'} onClick={() => setView('list')} className={tabClass(view === 'list')}>
            {t.list}
          </button>
          <button type="button" role="tab" aria-selected={view === 'grid'} onClick={() => setView('grid')} className={tabClass(view === 'grid')}>
            {t.ratings}
          </button>
        </div>
      </div>

      {view === 'grid' ? (
        ratingsGrid
      ) : (
        <div className="space-y-2">
          {seasons.map((season) => {
            const seasonEpisodes = episodes[season.season_number] ?? [];
            return (
              <details
                key={season.id}
                className="group overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-4 transition-colors duration-300 group-open:border-b group-open:border-slate-800/80 group-open:bg-slate-900/50 hover:bg-slate-900/60 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-base font-bold tracking-tight text-white md:text-lg">
                    {season.name}{' '}
                    <span className="ml-1 text-sm font-semibold text-slate-400">
                      ({season.episode_count === 1 ? t.episodeCountOne : format(t.episodeCount, { count: season.episode_count })})
                    </span>
                  </h3>
                  <ChevronDown className="h-5 w-5 text-slate-400 transition-transform duration-300 group-open:rotate-180 group-open:text-secondary" />
                </summary>
                <ul className="space-y-3 bg-slate-950/40 p-4">
                  {seasonEpisodes.length === 0 && (
                    <li className="py-4 text-center text-sm text-slate-400">{t.noEpisodes}</li>
                  )}
                  {seasonEpisodes.map((episode) => (
                    <li key={episode.id} className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="text-base font-bold text-white">
                          {t.episode} {episode.episode_number}: {episode.name}
                        </h4>
                        {episode.vote_average > 0 && (
                          <span className="shrink-0 text-sm font-bold text-yellow-400">★ {episode.vote_average.toFixed(1)}</span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-slate-400">
                        {t.airDate}{' '}
                        {episode.air_date
                          ? new Date(episode.air_date).toLocaleDateString(lang, { timeZone: 'UTC' })
                          : t.notAvailableShort}
                      </p>
                      {episode.overview && <p className="mt-2 text-sm leading-relaxed text-slate-300">{episode.overview}</p>}
                    </li>
                  ))}
                </ul>
              </details>
            );
          })}
        </div>
      )}
    </section>
  );
}
