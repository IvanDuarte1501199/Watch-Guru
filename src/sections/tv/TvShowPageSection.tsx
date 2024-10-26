import { TvProps } from "@appTypes/tv/tvProps";
import { useSeasonEpisodes } from "@hooks/tv/useSeasonEpisodes";
import SeasonAccordion from "./TvShowAccordionSeasons";
import Credits from "@components/Credits";
import { CreditsProps } from "@appTypes/credits/credits";
import GenresList from "@components/GenreList";

interface TvShowSectionProps {
  tvShow: TvProps;
  credits?: CreditsProps
}

const TvShowSection = ({ tvShow, credits }: TvShowSectionProps) => {
  const {
    allEpisodes,
    loading: loadingEpisodes,
    error: episodesError,
  } = useSeasonEpisodes(tvShow?.id as string, tvShow?.seasons || []);

  return (
    <div className="relative">
      <div className="container mx-auto px-4 pt-4 md:pt-12 pb-8 md:pb-12 text-white">
        <div className="flex flex-col md:flex-row animate-fade-in-right">
          {/* Poster image */}
          {tvShow?.poster_path && (
            <img
              loading="lazy"
              src={`https://image.tmdb.org/t/p/w500/${tvShow.poster_path}`}
              alt={tvShow.name}
              className="w-full md:w-1/3 rounded-lg shadow-lg"
            />
          )}

          {/* Details */}
          <div className="md:ml-10 mt-6 md:mt-0 animate-fade-in-left">
            <h1 className="text-4xl font-bold mb-4">{tvShow?.name}</h1>
            <p className="text-lg mb-6">{tvShow?.overview}</p>
            {/* Genres */}
            {tvShow?.genres && <GenresList genres={tvShow.genres} />}

            <Credits credits={credits} />
          </div>
        </div>

        {/* Seasons and Episodes */}
        <div className="mt-10">
          <h3 className="text-2xl font-semibold mb-4">Seasons and Episodes ({tvShow?.seasons.length} seasons)</h3>
          {loadingEpisodes ? (
            <p>Loading all episodes...</p>
          ) : episodesError ? (
            <p className="text-red-500">{episodesError}</p>
          ) : (
            <SeasonAccordion
              seasons={tvShow?.seasons || []}
              allEpisodes={allEpisodes}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TvShowSection;
