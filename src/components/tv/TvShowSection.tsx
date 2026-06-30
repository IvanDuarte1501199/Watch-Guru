import SeasonAccordion from '@sections/tv/TvShowAccordionSeasons';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { translations } from '../../i18n/translations';
import EpisodesRatingGrid from './EpisodesRatingGrid';

interface SeasonsAndEpisodesProps {
  seasons: any[];
  allEpisodes: Record<number, any[]>;
  loading: boolean;
  error: string | null;
}

const SeasonsAndEpisodes = ({ seasons, allEpisodes, loading, error }: SeasonsAndEpisodesProps) => {
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);
  const t = translations[currentLanguage];
  const [activeView, setActiveView] = useState<'list' | 'grid'>('list');

  return (
    <div className="mt-10">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <h3 className="text-2xl font-bold text-white tracking-tight">
          {t.seasonsAndEpisodes} <span className="text-sm text-slate-400 font-semibold ml-1">({seasons.length} {seasons.length === 1 ? t.seasonSingular : t.seasonsPlural})</span>
        </h3>
        
        {/* Toggle View */}
        <div className="flex bg-slate-900/80 border border-slate-800/85 p-0.5 rounded-xl backdrop-blur-sm self-start sm:self-auto">
          <button
            onClick={() => setActiveView('list')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${activeView === 'list' ? 'bg-secondary text-slate-950 shadow-md font-extrabold' : 'text-slate-400 hover:text-white'}`}
          >
            {currentLanguage === 'es' ? 'Lista' : 'List'}
          </button>
          <button
            onClick={() => setActiveView('grid')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${activeView === 'grid' ? 'bg-secondary text-slate-950 shadow-md font-extrabold' : 'text-slate-400 hover:text-white'}`}
          >
            {currentLanguage === 'es' ? 'Calificaciones' : 'Ratings'}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-slate-400">
          {currentLanguage === 'es' ? "Cargando todos los episodios..." : "Loading all episodes..."}
        </p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : activeView === 'list' ? (
        <SeasonAccordion seasons={seasons} allEpisodes={allEpisodes} />
      ) : (
        <EpisodesRatingGrid seasons={seasons} allEpisodes={allEpisodes} />
      )}
    </div>
  );
};

export default SeasonsAndEpisodes;
