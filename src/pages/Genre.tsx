import React, { useState } from 'react';
import { Layout } from '@components/Layout';
import { useParams, useLocation } from 'react-router-dom';
import useMediaByCategoryId from '@hooks/useDataByCategoryId';
import useGenres from '@hooks/useGenres';
import { MainTitle } from '@components/common/MainTitle';
import { useNavigate } from 'react-router-dom';
import Pagination from '@components/common/Pagination'; // Importa el nuevo componente
import MediaGrid from '@components/mediaGrid';

const Genres: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const initialPage = Number(query.get('page')) || 1;

  const [page, setPage] = useState(initialPage);
  const { media, loading, error, currentPage, totalPages } = useMediaByCategoryId(id, page);

  const updateQuery = (newPage: number) => {
    const newQuery = new URLSearchParams(location.search);
    newQuery.set('page', newPage.toString());
    navigate({
      pathname: location.pathname,
      search: newQuery.toString(),
    });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateQuery(newPage);
  };

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
          <section className='mb-24'>
            {id && <MainTitle>{getGenreName(id)}</MainTitle>}
            <MediaGrid media={media} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </section>
        )
      )}
    </Layout>
  );
};

export default Genres;
