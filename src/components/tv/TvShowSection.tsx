import SeasonAccordion from '@sections/tv/TvShowAccordionSeasons';
import React from 'react';

interface SeasonsAndEpisodesProps {
  seasons: any[];
  allEpisodes: Record<number, any[]>;
  loading: boolean;
  error: string | null;
}

const SeasonsAndEpisodes = ({ seasons, allEpisodes, loading, error }: SeasonsAndEpisodesProps) => (
  <div className="mt-10">
    <h3 className="text-2xl font-semibold mb-4">
      Seasons and Episodes ({seasons.length} seasons)
    </h3>
    {loading ? (
      <p>Loading all episodes...</p>
    ) : error ? (
      <p className="text-red-500">{error}</p>
    ) : (
      <SeasonAccordion seasons={seasons} allEpisodes={allEpisodes} />
    )}
  </div>
);

export default SeasonsAndEpisodes;
