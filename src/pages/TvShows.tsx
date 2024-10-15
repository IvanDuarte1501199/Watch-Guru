import React from 'react';
import { Layout } from '@components/Layout';
import { GenericList } from '@components/common/GenericList';
import { MainTitle } from '@components/common/MainTitle';
import useGenres from '@hooks/useGenres';
import GenresSection from '@sections/GenresSection';
import FeaturedGenresSection from '@sections/FeaturedGenresSection';
import useTvShows from '@hooks/tv/useTvShows';
import { TvShowType } from '@appTypes/tv/tvProps';

const TvShows: React.FC = () => {
  const {
    tvShows: trendingTv,
    loading: tvLoading,
    error: tvError,
  } = useTvShows(TvShowType.Trending);
  const {
    tvShows: popularTv,
    loading: isLoadingPopular,
    error: errorPopular,
  } = useTvShows(TvShowType.Popular);
  const {
    tvShows: topRatedTv,
    loading: isLoadingTopRated,
    error: errorTopRated,
  } = useTvShows(TvShowType.TopRated);

  const {
    tvGenres,
    loading: genresLoading,
    error: genresError,
  } = useGenres();
  return (
    <Layout className='mb-4 md:mb-10'>
      <MainTitle>TV SHOWS</MainTitle>
      <GenresSection genres={tvGenres} />

      {trendingTv && trendingTv.length > 0 && (
        <GenericList title="Trending Tv Shows" genericList={trendingTv} />
      )}
      {/* <FeaturedGenresSection /> */}
      {popularTv && popularTv.length > 0 && (
        <GenericList title="Popular Tv Shows" genericList={popularTv} />
      )}

      {topRatedTv && topRatedTv.length > 0 && (
        <GenericList title="Top Rated Tv Shows" genericList={topRatedTv} />
      )}
    </Layout>
  );
};

export default TvShows;
