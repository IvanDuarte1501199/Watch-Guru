import type { Dictionary } from '@/lib/i18n/get-dictionary';
import type { Episode, Season } from '@/lib/tmdb/types';

interface EpisodesRatingGridProps {
  seasons: Season[];
  episodes: Record<number, Episode[]>;
  t: Dictionary;
}

/** Ratings span roughly 5.0–9.5 in practice; interpolate red → green across that range. */
function ratingStyle(rating: number): React.CSSProperties {
  if (!rating) {
    return { backgroundColor: 'rgba(15, 23, 42, 0.4)', border: '1px solid rgba(51, 65, 85, 0.2)', color: '#64748b' };
  }
  const percent = Math.min(Math.max((rating - 5) / 4.5, 0), 1);
  const hue = percent * 120;
  return {
    backgroundColor: `hsla(${hue}, 70%, 45%, 0.15)`,
    border: `1px solid hsla(${hue}, 70%, 45%, 0.35)`,
    color: `hsl(${hue}, 85%, 60%)`,
  };
}

function seasonAverage(episodes: Episode[]): string {
  const rated = episodes.filter((episode) => episode.vote_average > 0);
  if (rated.length === 0) return '-';
  return (rated.reduce((sum, episode) => sum + episode.vote_average, 0) / rated.length).toFixed(1);
}

export function EpisodesRatingGrid({ seasons, episodes, t }: EpisodesRatingGridProps) {
  const regularSeasons = seasons.filter((season) => season.season_number > 0);
  const maxEpisodes = Math.max(0, ...regularSeasons.map((season) => episodes[season.season_number]?.length ?? 0));
  if (regularSeasons.length === 0 || maxEpisodes === 0) return null;

  const cellClass = 'mx-auto flex h-10 w-10 items-center justify-center rounded-lg text-xs md:h-11 md:w-11 md:text-sm';

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/20 p-4 backdrop-blur-sm md:p-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-12 min-w-12 border-b border-slate-800/80 p-2 text-center text-xs font-bold text-slate-500 uppercase">
                Ep
              </th>
              {regularSeasons.map((season) => (
                <th
                  key={season.id}
                  scope="col"
                  className="min-w-14 border-b border-slate-800/80 p-2 text-center text-xs font-black text-secondary uppercase"
                >
                  {t.seasonShort}{season.season_number}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxEpisodes }, (_, index) => index + 1).map((episodeNumber) => (
              <tr key={episodeNumber} className="transition-colors duration-150 hover:bg-slate-900/20">
                <th scope="row" className="w-12 border-r border-slate-900/60 p-1.5 text-center text-xs font-extrabold text-slate-500">
                  {episodeNumber}
                </th>
                {regularSeasons.map((season) => {
                  const episode = episodes[season.season_number]?.find((item) => item.episode_number === episodeNumber);
                  return (
                    <td key={season.id} className="p-1 text-center">
                      {episode ? (
                        <div
                          title={`${t.seasonShort}${season.season_number}${t.episodeShort}${episodeNumber}: ${episode.name} (${episode.vote_average.toFixed(1)})`}
                          style={ratingStyle(episode.vote_average)}
                          className={`${cellClass} cursor-help font-black transition-all duration-200 hover:scale-105 hover:brightness-125`}
                        >
                          {episode.vote_average > 0 ? episode.vote_average.toFixed(1) : '-'}
                        </div>
                      ) : (
                        <div className={cellClass} />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="border-t border-slate-800/80">
              <th scope="row" className="p-3 text-center text-xs font-extrabold text-slate-400 uppercase">
                {t.average}
              </th>
              {regularSeasons.map((season) => (
                <td key={season.id} className="p-2 text-center">
                  <div className={`${cellClass} border border-slate-800 bg-slate-900/80 font-black text-white`}>
                    {seasonAverage(episodes[season.season_number] ?? [])}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
