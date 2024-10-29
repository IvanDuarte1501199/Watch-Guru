import React from 'react';
import { Layout } from '@components/common/Layout';
import { useParams, useLocation } from 'react-router-dom';
import useMediaByCategoryId from '@hooks/useDataByCategoryId';
import useGenres from '@hooks/useGenres';
import { MainTitle } from '@components/common/MainTitle';
import Pagination from '@components/common/Pagination';
import MediaGrid from '@components/shared/MediaGrid';
import BackgroudImg from '@components/shared/BackgroudImg';

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

  const getGenrePath = (genreId: string) => {
    const genreObj = moviesGenres.find((g) => g.id == genreId) || tvGenres.find((g) => g.id == genreId);
    return genreObj?.name.toLowerCase().replace(/\s+/g, '-');
  };

  return (
    <Layout>
      {id && <BackgroudImg src={`/genres/${getGenrePath(id)}.jpg`} />}
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
