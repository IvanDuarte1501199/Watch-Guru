import React, { useState } from 'react';
import { Layout } from '@components/Layout';
import { useParams } from 'react-router-dom';
import useMediaByCategoryId from '@hooks/useDataByCategoryId';
import { Card } from '@components/common/Card';
import useGenres from '@hooks/useGenres';
import { MainTitle } from '@components/common/MainTitle';



const Genres: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState(1);

  const { media, loading, error, currentPage, totalPages } = useMediaByCategoryId(id, page);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };


  /* move to util file */
  const {
    moviesGenres,
    tvGenres,
  } = useGenres();
  const getGenreName = (genreId: string) => {
    console.log(moviesGenres)
    console.log(tvGenres)
    console.log(genreId)
    const genreObj = moviesGenres.find((g) => g.id == genreId) || tvGenres.find((g) => g.id == genreId);
    console.log(genreObj)
    return genreObj?.name;
  };



  /* this is currently in development */
  /* I need separate de movies grid and the pagination to another componente */
  /* improve loading  */
  return (
    <Layout>
      {
        loading ? <></> :
          media && media.length > 0 && (
            <section className='mb-24'>
              {id && <MainTitle>{getGenreName(id)}</MainTitle>}
              <span className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6'>
                {media.map((media) => (
                  <Card key={media.id} {...media} />
                ))}
              </span>
              <div className="text-white flex gap-12 item-center justify-center">
                <button disabled={currentPage === 1} onClick={handlePrevPage}>Anterior</button>
                <p className="text-white p-guru">{currentPage} - {totalPages}</p>
                <button disabled={currentPage === totalPages} onClick={handleNextPage}>Siguiente</button>
              </div>
            </section>
          )}
    </Layout>
  );
};

export default Genres;
