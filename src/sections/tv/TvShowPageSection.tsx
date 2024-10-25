import { TvProps } from "@appTypes/tv/tvProps";
import { useSeasonEpisodes } from "@hooks/tv/useSeasonEpisodes";
import SeasonAccordion from "./TvShowAccordionSeasons";

interface TvShowSectionProps {
  tvShow: TvProps;
}

const TvShowSection = ({ tvShow }: TvShowSectionProps) => {
  const {
    allEpisodes,
    loading: loadingEpisodes,
    error: episodesError,
  } = useSeasonEpisodes(tvShow?.id as string, tvShow?.seasons || []);

  return (
    <div className="relative">
      <div className="container mx-auto px-4 pt-6 pb-16 text-white">
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
          <h3 className="text-2xl font-semibold mb-4">Seasons and Episodes</h3>
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
