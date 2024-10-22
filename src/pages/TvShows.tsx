import React from 'react';
import { Layout } from '@components/Layout';
import { GenericList } from '@components/common/GenericList';
import { MainTitle } from '@components/common/MainTitle';
import useGenres from '@hooks/useGenres';
import GenresSection from '@sections/GenresSection';
import useTvShows from '@hooks/tv/useTvShows';
import { TvShowType } from '@appTypes/tv/tvProps';

const TvShows: React.FC = () => {
  const {
    tvShows: trendingTv,
  } = useTvShows(TvShowType.Trending);
  const {
    tvShows: popularTv,
  } = useTvShows(TvShowType.Popular);
  const {
    tvShows: topRatedTv,
  } = useTvShows(TvShowType.TopRated);

  const {
    tvGenres,
  } = useGenres();
  return (
    <Layout className='mb-4 md:mb-8'>
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
