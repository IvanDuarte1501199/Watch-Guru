// RandomMovieOrTvInfo.tsx
import { MediaType } from '@appTypes/common/MediaType';
import { MovieProps } from '@appTypes/movies/movieProps';
import { TvProps } from '@appTypes/tv/tvProps';
import { Layout } from '@components/Layout';
import { useRandomMovieOrTv } from '@hooks/useRandomMovieOrTv';
import MoviePageSection from '@sections/movies/MoviePageSection';
import TvShowPageSection from '@sections/tv/TvShowPageSection';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RandomMovieOrTvInfo: React.FC = () => {
  const navigate = useNavigate();
  const type: MediaType = window.location.pathname.includes('random/movie') ? MediaType.Movie : MediaType.Tv;
  const { randomTvOrMovie, loading: loadingRandom, error: randomError } = useRandomMovieOrTv(type);

  useEffect(() => {
    if (randomError) {
      navigate('/404');
    }
  }, [randomError, navigate]);

  const isLoading = loadingRandom || !randomTvOrMovie;

  return (
    <Layout>
      {!isLoading && randomTvOrMovie && type === MediaType.Movie && (
        <MoviePageSection movie={randomTvOrMovie as MovieProps} />
      )}
      {!isLoading && randomTvOrMovie && type === MediaType.Tv && (
        <TvShowPageSection tvShow={randomTvOrMovie as TvProps} />
      )}
    </Layout>
  );
};

export default RandomMovieOrTvInfo;
