import { MediaTypes } from '@appTypes/common/media';
import Pagination from '@components/common/Pagination';
import { Layout } from '@components/Layout';
import MediaGrid from '@components/MediaGrid';
import useMedia from '@hooks/useMedia';
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

const MediaBy: React.FC = () => {
  const { mediaType } = useParams<{ mediaType: string }>();

  const tvShowTypesMap: Record<string, MediaTypes> = {
    'trending': MediaTypes.Trending,
  };

  const selectedTvShowType = tvShowTypesMap[mediaType || 'trending'];

  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const initialPage = Number(query.get('page')) || 1;

  const { media, currentPage, totalPages, error, loading } = useMedia({ mediaType: selectedTvShowType, page: initialPage });
  return (
    <Layout>
      <h1 className='h1-guru uppercase text-center pt-4 md:pt-8 pb-4 md:pb-8'>{selectedTvShowType?.replace('-', ' ')} MOVIES AND TV SHOWS</h1>
      <section className='mb-4 md:mb-8'>
        <MediaGrid media={media} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          path={`/${selectedTvShowType}`}
        />
      </section>
    </Layout>
  );
};

export default MediaBy;
