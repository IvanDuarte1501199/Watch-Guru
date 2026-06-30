import React, { useState } from 'react';
import { Collapse } from 'react-collapse';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { translations } from '../../i18n/translations';
import { ChevronDown } from 'lucide-react';

interface SeasonAccordionProps {
  seasons: any[];
  allEpisodes: Record<number, any[]>;
}

const SeasonAccordion: React.FC<SeasonAccordionProps> = ({ seasons, allEpisodes }) => {
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);
  const t = translations[currentLanguage];

  return (
    <div className="space-y-2">
      {seasons.map((season) => {
        const [isOpen, setIsOpen] = useState(false);
        const episodeText = season.episode_count === 1 ? t.episodeSingular : t.episodesPlural;

        return (
          <div key={season.id} className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-sm">
            <div
              className={`flex justify-between items-center cursor-pointer py-4 px-4 hover:bg-slate-900/60 transition-colors duration-300 ${isOpen ? 'border-b border-slate-800/80 bg-slate-900/50' : ''}`}
              onClick={() => setIsOpen(!isOpen)}
            >
              <h4 className="text-base md:text-lg font-bold text-white tracking-tight">
                {season.name} <span className="text-sm font-semibold text-slate-400 ml-1">({season.episode_count} {episodeText})</span>
              </h4>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 transition-all duration-300 transform ${isOpen ? 'rotate-180 text-secondary' : 'hover:text-white'}`}
              />
            </div>
            <Collapse isOpened={isOpen}>
              <div className="bg-slate-950/40 p-4">
                <ul className="space-y-3">
                  {allEpisodes[season.season_number]?.map((episode) => {
                    const capitalizedEpisodeLabel = t.episodeSingular.charAt(0).toUpperCase() + t.episodeSingular.slice(1);
                    return (
                      <li key={episode.id} className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl shadow-inner hover:border-slate-800 transition-colors duration-200">
                        <h5 className="text-base font-bold text-white">
                          {capitalizedEpisodeLabel} {episode.episode_number}: {episode.name}
                        </h5>
                        <p className="text-xs text-slate-400 mt-1">{t.airDate} {episode.air_date || t.notAvailableShort}</p>
                        {episode.overview && <p className="text-sm text-slate-300 mt-2 leading-relaxed">{episode.overview}</p>}
                      </li>
                    );
                  }) || <li className="text-slate-400 text-sm text-center py-4">{t.noEpisodes}</li>}
                </ul>
              </div>
            </Collapse>
          </div>
        );
      })}
    </div>
  );
};

export default SeasonAccordion;
