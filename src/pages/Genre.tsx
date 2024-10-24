import React from 'react';
import { Layout } from '@components/Layout';
import { useParams, useLocation } from 'react-router-dom';
import useMediaByCategoryId from '@hooks/useDataByCategoryId';
import useGenres from '@hooks/useGenres';
import { MainTitle } from '@components/common/MainTitle';
import MediaGrid from '@components/MediaGrid';
import Pagination from '@components/common/Pagination';

const Genres: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const initialPage = Number(query.get('page')) || 1;

  const { media, loading, error, currentPage, totalPages } = useMediaByCategoryId(id, initialPage);

  const { moviesGenres, tvGenres } = useGenres();

  const getGenreName = (genreId: string) => {
    const genreObj = moviesGenres.find((g) => g.id == genreId) || tvGenres.find((g) => g.id == genreId);
    return genreObj?.name;
  };

  return (
    <Layout>
      {loading ? (
        <></>
      ) : (
        media && media.length > 0 && (
          <section className='mb-4 md:mb-8'>
            {id && <MainTitle>{getGenreName(id)}</MainTitle>}
            <MediaGrid media={media} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              path={`/genres/${id}`}
            />
          </section>
        )
      )}
    </Layout>
  );
};

export default Genres;
