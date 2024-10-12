import React, { useState } from 'react';
import { useTvShow } from '@hooks/tv/useTvShow';
import { useSeasonEpisodes } from '@hooks/tv/useSeasonEpisodes';
import { useParams } from 'react-router-dom';
import { Layout } from '@components/Layout';
const TvShowInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    tvShow,
    loading: loadingShow,
    error: showError,
  } = useTvShow(id as string);

  const {
    allEpisodes,
    loading: loadingEpisodes,
    error: episodesError,
  } = useSeasonEpisodes(id as string, tvShow?.seasons || []);

  const [expandedSeasons, setExpandedSeasons] = useState<number[]>([]);

  const toggleSeason = (seasonNumber: number) => {
    setExpandedSeasons((prevExpanded) =>
      prevExpanded.includes(seasonNumber)
        ? prevExpanded.filter((num) => num !== seasonNumber)
        : [...prevExpanded, seasonNumber]
    );
  };

  if (loadingShow)
    return <p className="text-center">Loading TV show details...</p>;
  if (showError) return <p className="text-center text-red-500">{showError}</p>;

  return (
    <Layout>
      <div className="relative">
        {/* background image */}
        {tvShow?.backdrop_path && (
          <div
            className="absolute top-0 left-0 w-full h-full -z-10 bg-cover bg-center opacity-40"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original/${tvShow.backdrop_path})`,
            }}
          ></div>
        )}

        <div className="container mx-auto px-4 pt-6 pb-16 text-white">
          <div className="flex flex-col md:flex-row">
            {/* poster image */}
            {tvShow?.poster_path && (
              <img
                loading="lazy"
                src={`https://image.tmdb.org/t/p/w500/${tvShow.poster_path}`}
                alt={tvShow.name}
                className="w-full md:w-1/3 rounded-lg shadow-lg"
              />
            )}

            {/* details */}
            <div className="md:ml-10 mt-6 md:mt-0">
              <h1 className="text-4xl font-bold mb-4">{tvShow?.name}</h1>
              {/* description */}
              <p className="text-lg mb-6">{tvShow?.overview}</p>
              {/* genres */}
              {tvShow?.genres && tvShow.genres.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {tvShow.genres.map((genre: any) => (
                      <span
                        key={genre.id}
                        className="bg-green-600 px-3 py-1 rounded-full text-sm font-semibold"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Seasons and Episodes */}
          <div className="mt-10">
            <h3 className="text-2xl font-semibold mb-4">
              Seasons and Episodes
            </h3>

            {loadingEpisodes ? (
              <p>Loading all episodes...</p>
            ) : episodesError ? (
              <p className="text-red-500">{episodesError}</p>
            ) : (
              tvShow?.seasons.map((season) => (
                <div key={season.id} className="mb-8">
                  <h4
                    className="text-xl font-bold mb-2 cursor-pointer hover:underline"
                    onClick={() => toggleSeason(season.season_number)}
                  >
                    {season.name} ({season.episode_count} episodes)
                  </h4>

                  {/* TODO: fix this, it's not working, use a ref to toggle the height or a libary */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      expandedSeasons.includes(season.season_number)
                        ? 'max-h-screen'
                        : 'max-h-0'
                    }`}
                  >
                    <ul className="space-y-2 ml-4">
                      {allEpisodes[season.season_number]?.map((episode) => (
                        <li
                          key={episode.id}
                          className="bg-gray-800 p-2 rounded-lg"
                        >
                          <h5 className="text-lg font-semibold">
                            Episode {episode.episode_number}: {episode.name}
                          </h5>
                          <p className="text-sm">
                            Air Date: {episode.air_date || 'N/A'}
                          </p>
                          <p className="text-sm">{episode.overview || ''}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TvShowInfo;
