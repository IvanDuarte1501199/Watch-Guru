import React, { useState } from 'react';
import { Collapse } from 'react-collapse';

interface SeasonAccordionProps {
  seasons: any[];
  allEpisodes: Record<number, any[]>;
}

const SeasonAccordion: React.FC<SeasonAccordionProps> = ({ seasons, allEpisodes }) => {
  return (
    <div>
      {seasons.map((season) => {
        const [isOpen, setIsOpen] = useState(false);

        return (
          <div key={season.id}>
            <div
              className={`flex justify-between items-center cursor-pointer py-4 ${!isOpen && 'border-b'} border-white bg-gray-700`}
              onClick={() => setIsOpen(!isOpen)}
            >
              <h4 className="text-lg font-semibold"> {season.name} ({season.episode_count} episodes)</h4>
              <span className={`arrow ${isOpen ? 'arrow-up' : ''}`}>
                {isOpen ? '-' : '+'}</span>
            </div>
            <Collapse isOpened={isOpen} theme={{ collapse: 'foo', content: 'bar' }}>
              <div className="">
                <ul className="space-y-2">
                  {allEpisodes[season.season_number]?.map((episode) => (
                    <li key={episode.id} className="bg-gray-800 p-2 rounded-lg">
                      <h5 className="text-lg font-semibold">
                        Episode {episode.episode_number}: {episode.name}
                      </h5>
                      <p className="text-sm">Air Date: {episode.air_date || 'N/A'}</p>
                      <p className="text-sm">{episode.overview || ''}</p>
                    </li>
                  )) || <li>No episodes available</li>}
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
