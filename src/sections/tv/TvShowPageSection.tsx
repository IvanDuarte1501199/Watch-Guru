import { TvProps } from "@appTypes/tv/tvProps";
import { useSeasonEpisodes } from "@hooks/tv/useSeasonEpisodes";
import { useEffect, useState } from "react";
import SeasonsAndEpisodes from "@components/tv/TvShowSection";
import TvShowPoster from "../../components/tv/TvShowPoster";
import TvShowDetails from "../../components/tv/TvShowDetails";
import ProvidersInfo from "@components/provider/ProvidersInfo";
import { MovieAvailability } from "@appTypes/provider/provider";

interface TvShowSectionProps {
  tvShow: TvProps;
  showSeasons?: boolean;
  providers?: MovieAvailability;
}

const TvShowSection = ({ tvShow, showSeasons = true, providers }: TvShowSectionProps) => {
  const [shouldFetchEpisodes, setShouldFetchEpisodes] = useState(showSeasons);

  useEffect(() => {
    setShouldFetchEpisodes(showSeasons);
  }, [showSeasons]);

  const {
    allEpisodes,
    loading: loadingEpisodes,
    error: episodesError,
  } = shouldFetchEpisodes
      ? useSeasonEpisodes(tvShow?.id as string, tvShow?.seasons || [])
      : { allEpisodes: [], loading: false, error: null };

  return (
    <>
      <div className="relative">
        <div className="container mx-auto px-4 pt-4 md:pt-12 pb-8 md:pb-12 text-white">
          <div className="flex flex-col md:flex-row animate-fade-in-right gap-8">
            {tvShow?.poster_path && (
              <TvShowPoster src={`https://image.tmdb.org/t/p/w500/${tvShow.poster_path}`} alt={tvShow.name} />
            )}
            <div>
              <TvShowDetails tvShow={tvShow} />
              <ProvidersInfo providers={providers || {} as MovieAvailability} />
            </div>
          </div>

          {showSeasons && (
            <SeasonsAndEpisodes
              seasons={tvShow?.seasons || []}
              allEpisodes={allEpisodes}
              loading={loadingEpisodes}
              error={episodesError}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default TvShowSection;
