import { TvProps } from "@appTypes/tv/tvProps";
import { useSeasonEpisodes } from "@hooks/tv/useSeasonEpisodes";
import Credits from "@components/shared/Credits";
import { CreditsProps } from "@appTypes/credits/credits";
import { useEffect, useState } from "react";
import BackgroudImg from "@components/shared/BackgroudImg";
import SeasonsAndEpisodes from "@components/tv/TvShowSection";
import TvShowPoster from "../../components/tv/TvShowPoster";
import TvShowDetails from "../../components/tv/TvShowDetails";

interface TvShowSectionProps {
  tvShow: TvProps;
  credits?: CreditsProps;
  showSeasons?: boolean;
}

const TvShowSection = ({ tvShow, credits, showSeasons = true }: TvShowSectionProps) => {
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
      {tvShow?.backdrop_path && (
        <BackgroudImg src={`https://image.tmdb.org/t/p/original/${tvShow.backdrop_path}`} />
      )}
      <div className="relative">
        <div className="container mx-auto px-4 pt-4 md:pt-12 pb-8 md:pb-12 text-white z-1">
          <div className="flex flex-col md:flex-row animate-fade-in-right gap-8 justify-between">
            {tvShow?.poster_path && (
              <TvShowPoster src={`https://image.tmdb.org/t/p/w500/${tvShow.poster_path}`} alt={tvShow.name} />
            )}
            <div>
              <TvShowDetails tvShow={tvShow} />
              <Credits credits={credits} />
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
