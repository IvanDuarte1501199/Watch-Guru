import { MovieProps } from '@appTypes/movies/movieProps';
import { TvProps } from '@appTypes/tv/tvProps';
import { Layout } from '@components/Layout';
import { useRandomMovieOrTv } from '@hooks/useRandomMovieOrTv';
import { useTvShow } from '@hooks/tv/useTvShow';
import { useMovie } from '@hooks/movies/useMovie';
import MoviePageSection from '@sections/movies/MoviePageSection';
import TvShowPageSection from '@sections/tv/TvShowPageSection';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GenericItemProps } from '@appTypes/common/genericItemProps';

const RandomMovieOrTvInfo: React.FC = () => {
  const navigate = useNavigate();
  const type = window.location.pathname.includes('random/movie') ? 'movie' : 'tv';
  const { randomTvOrMovie, loading: loadingRandom, error: randomError } = useRandomMovieOrTv(type);

  const {
    data,
    loading,
    error
  } = type === 'tv'
      ? { data: useTvShow(randomTvOrMovie?.id as string).tvShow, loading: useTvShow(randomTvOrMovie?.id as string).loading, error: useTvShow(randomTvOrMovie?.id as string).error }
      : { data: useMovie(randomTvOrMovie?.id as string).movie, loading: useMovie(randomTvOrMovie?.id as string).loading, error: useMovie(randomTvOrMovie?.id as string).error };


  useEffect(() => {
    if (randomError) {
      navigate('/404');
    }
  }, [randomError, navigate]);

  if (loadingRandom || loading) {
    return <p className="text-center">Loading movie details...</p>;
  }

  return (
    <Layout>
      {type === 'movie' && data && !loading && <MoviePageSection movie={data as MovieProps} />}
      {type === 'tv' && data && !loading && <TvShowPageSection tvShow={data as TvProps} />}
    </Layout>
  );
};

export default RandomMovieOrTvInfo;
