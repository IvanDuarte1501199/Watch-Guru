'use client';

import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { format } from '@/lib/i18n/config';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import type { Episode, Season } from '@/lib/tmdb/types';
import { useTitleLibrary } from '@/components/library/TitleLibraryProvider';

interface SeasonsSectionProps {
  seasons: Season[];
  episodes: Record<number, Episode[]>;
  /** Server-rendered ratings heatmap, shown when the "Ratings" tab is active. */
  ratingsGrid: React.ReactNode;
}

const today = () => new Date().toISOString().slice(0, 10);

export function SeasonsSection({ seasons, episodes, ratingsGrid }: SeasonsSectionProps) {
  const { t, lang } = useI18n();
  const library = useTitleLibrary();
  const [view, setView] = useState<'list' | 'grid'>('list');

  if (seasons.length === 0) return null;

  const tracking = Boolean(library?.signedIn && library.ready);
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
            // Only aired episodes can be marked in bulk.
            const aired = seasonEpisodes.filter((episode) => episode.air_date && episode.air_date <= today());
            const watchedCount = library
              ? seasonEpisodes.filter((episode) => library.isEpisodeWatched(season.season_number, episode.episode_number)).length
              : 0;
            const seasonComplete = aired.length > 0 && watchedCount >= aired.length;

            return (
              <details
                key={season.id}
                className="group overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 transition-colors duration-300 group-open:border-b group-open:border-slate-800/80 group-open:bg-slate-900/50 hover:bg-slate-900/60 [&::-webkit-details-marker]:hidden">
                  <h3 className="text-base font-bold tracking-tight text-white md:text-lg">
                    {season.name}{' '}
                    <span className="ml-1 text-sm font-semibold text-slate-400">
                      ({season.episode_count === 1 ? t.episodeCountOne : format(t.episodeCount, { count: season.episode_count })})
                    </span>
                  </h3>
                  <span className="flex shrink-0 items-center gap-3">
                    {tracking && watchedCount > 0 && (
                      <span className={`text-xs font-bold ${seasonComplete ? 'text-green-400' : 'text-secondary'}`}>
                        {format(t.watchedEpisodes, { watched: watchedCount, total: seasonEpisodes.length })}
                      </span>
                    )}
                    <ChevronDown className="h-5 w-5 text-slate-400 transition-transform duration-300 group-open:rotate-180 group-open:text-secondary" />
                  </span>
                </summary>

                <div className="bg-slate-950/40 p-4">
                  {library && aired.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        library.setEpisodesWatched(
                          season.season_number,
                          aired.map((episode) => episode.episode_number),
                          !seasonComplete,
                        )
                      }
                      className="mb-3 flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-200 transition hover:border-secondary hover:text-secondary"
                    >
                      <Check className="h-3.5 w-3.5" aria-hidden />
                      {seasonComplete ? t.unmarkSeason : t.markSeasonWatched}
                    </button>
                  )}

                  <ul className="space-y-3">
                    {seasonEpisodes.length === 0 && (
                      <li className="py-4 text-center text-sm text-slate-400">{t.noEpisodes}</li>
                    )}
                    {seasonEpisodes.map((episode) => {
                      const watched = library?.isEpisodeWatched(season.season_number, episode.episode_number) ?? false;
                      return (
                        <li
                          key={episode.id}
                          className={`flex gap-3 rounded-xl border p-4 transition-colors ${watched ? 'border-secondary/30 bg-secondary/5' : 'border-slate-800/60 bg-slate-900/40'}`}
                        >
                          {library && (
                            <button
                              type="button"
                              role="checkbox"
                              aria-checked={watched}
                              aria-label={format(t.markEpisode, { episode: episode.episode_number })}
                              onClick={() =>
                                library.setEpisodesWatched(season.season_number, [episode.episode_number], !watched)
                              }
                              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition ${
                                watched
                                  ? 'border-secondary bg-secondary text-slate-950'
                                  : 'border-slate-600 text-transparent hover:border-secondary'
                              }`}
                            >
                              <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
                            </button>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-4">
                              <h4 className="text-base font-bold text-white">
                                {t.episode} {episode.episode_number}: {episode.name}
                              </h4>
                              {episode.vote_average > 0 && (
                                <span className="shrink-0 text-sm font-bold text-yellow-400">
                                  ★ {episode.vote_average.toFixed(1)}
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-xs text-slate-400">
                              {t.airDate}{' '}
                              {episode.air_date
                                ? new Date(episode.air_date).toLocaleDateString(lang, { timeZone: 'UTC' })
                                : t.notAvailableShort}
                            </p>
                            {episode.overview && (
                              <p className="mt-2 text-sm leading-relaxed text-slate-300">{episode.overview}</p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </details>
            );
          })}
        </div>
      )}
    </section>
  );
}
