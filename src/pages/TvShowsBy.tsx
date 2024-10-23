import { TvShowType } from '@appTypes/tv/tvProps';
import Pagination from '@components/common/Pagination';
import { Layout } from '@components/Layout';
import MediaGrid from '@components/MediaGrid';
import useTvShows from '@hooks/tv/useTvShows';
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

const TvShowsBy: React.FC = () => {
  const { tvShowType } = useParams<{ tvShowType: string }>();

  const tvShowTypesMap: Record<string, TvShowType> = {
    'trending': TvShowType.Trending,
    'airing-today': TvShowType.AiringToday,
    'on-the-air': TvShowType.OnTheAir,
    'top-rated': TvShowType.TopRated,
    'popular': TvShowType.Popular,
  };

  const selectedTvShowType = tvShowTypesMap[tvShowType || 'trending'];

  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const initialPage = Number(query.get('page')) || 1;

  const { media, currentPage, totalPages, error, loading } = useTvShows({ tvShowType: selectedTvShowType, page: initialPage });

  return (
    <Layout>
      <h1 className='h1-guru uppercase text-center pt-4 md:pt-8 pb-4 md:pb-8'>{selectedTvShowType?.replace('-', ' ')} TV SHOWS</h1>
      <section className='mb-4 md:mb-8'>
        <MediaGrid media={media} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          path={`/tv-shows/${tvShowType}`}
        />
      </section>
    </Layout>
  );
};

export default TvShowsBy;
