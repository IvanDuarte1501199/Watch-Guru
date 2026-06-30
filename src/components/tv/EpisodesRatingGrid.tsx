import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { translations } from '../../i18n/translations';

interface EpisodesRatingGridProps {
  seasons: any[];
  allEpisodes: Record<number, any[]>;
}

const EpisodesRatingGrid: React.FC<EpisodesRatingGridProps> = ({ seasons, allEpisodes }) => {
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);
  const t = translations[currentLanguage];

  // Filter out Specials (Season 0)
  const regularSeasons = seasons.filter(s => s.season_number > 0);
  
  if (regularSeasons.length === 0) return null;

  // Calculate maximum episodes in a single season to set rows count
  const maxEpisodes = Math.max(...regularSeasons.map(s => s.episode_count || 0), 0);

  if (maxEpisodes === 0) return null;

  // Color mapping based on rating (HSL dynamic gradient Red to Green)
  const getRatingStyle = (rating: number) => {
    if (!rating || rating === 0) {
      return {
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        borderColor: 'rgba(51, 65, 85, 0.2)',
        color: '#64748b',
      };
    }
    
    // Ratings typically span 5.0 to 9.5. Anything below 5.0 is red, anything above 9.5 is full green.
    const minVal = 5.0;
    const maxVal = 9.5;
    const percent = Math.min(Math.max((rating - minVal) / (maxVal - minVal), 0), 1);
    
    // Interpolate hue from 0 (Red) to 120 (Green)
    const hue = percent * 120;
    
    return {
      backgroundColor: `hsla(${hue}, 70%, 45%, 0.15)`,
      border: `1px solid hsla(${hue}, 70%, 45%, 0.35)`,
      color: `hsl(${hue}, 85%, 60%)`,
    };
  };

  // Helper to calculate average rating of a season
  const getSeasonAverage = (seasonNumber: number) => {
    const episodes = allEpisodes[seasonNumber] || [];
    const ratedEpisodes = episodes.filter(ep => ep.vote_average > 0);
    if (ratedEpisodes.length === 0) return '-';
    const sum = ratedEpisodes.reduce((acc, ep) => acc + ep.vote_average, 0);
    return (sum / ratedEpisodes.length).toFixed(1);
  };

  return (
    <div className="w-full bg-slate-950/20 border border-slate-800/80 rounded-xl p-4 md:p-6 backdrop-blur-sm overflow-hidden">
      {/* Scrollable Container */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {/* Ep column header */}
              <th className="p-2 text-center text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-800/80 w-12 min-w-[3rem]">
                Ep
              </th>
              {/* Seasons column headers */}
              {regularSeasons.map((s) => (
                <th 
                  key={s.id} 
                  className="p-2 text-center text-xs font-black uppercase tracking-wider text-secondary border-b border-slate-800/80 min-w-[3.5rem]"
                >
                  S{s.season_number}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxEpisodes }).map((_, idx) => {
              const episodeNumber = idx + 1;
              return (
                <tr key={episodeNumber} className="hover:bg-slate-900/20 transition-colors duration-150">
                  {/* Episode Number row header */}
                  <td className="p-1.5 text-center text-xs font-extrabold text-slate-500 border-r border-slate-900/60 w-12">
                    {episodeNumber}
                  </td>
                  {/* Ratings cells */}
                  {regularSeasons.map((s) => {
                    const episodesList = allEpisodes[s.season_number] || [];
                    const ep = episodesList.find(e => e.episode_number === episodeNumber);
                    const rating = ep ? ep.vote_average : 0;
                    
                    return (
                      <td key={s.id} className="p-1 text-center">
                        {ep ? (
                          <div 
                            title={`S${s.season_number}E${episodeNumber}: ${ep.name} (${rating.toFixed(1)})`}
                            style={getRatingStyle(rating)}
                            className="w-10 h-10 md:w-11 md:h-11 mx-auto flex flex-col items-center justify-center rounded-lg text-xs md:text-sm font-black transition-all duration-200 hover:brightness-125 hover:scale-105 cursor-help"
                          >
                            <span>{rating > 0 ? rating.toFixed(1) : '-'}</span>
                          </div>
                        ) : (
                          <div className="w-10 h-10 md:w-11 md:h-11 mx-auto" /> // Empty cell spacing
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            
            {/* Average row */}
            <tr className="border-t border-slate-800/80">
              <td className="p-3 text-center text-xs font-extrabold uppercase tracking-wide text-slate-400">
                Avg
              </td>
              {regularSeasons.map((s) => {
                const avg = getSeasonAverage(s.season_number);
                return (
                  <td key={s.id} className="p-2 text-center text-xs md:text-sm font-black text-white">
                    <div className="w-10 h-10 md:w-11 md:h-11 mx-auto flex items-center justify-center bg-slate-900/80 border border-slate-800 rounded-lg">
                      {avg}
                    </div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EpisodesRatingGrid;
