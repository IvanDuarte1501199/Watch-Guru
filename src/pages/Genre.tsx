import React, { useState } from 'react';
import { Layout } from '@components/Layout';
import { useParams } from 'react-router-dom';
import useMediaByCategoryId from '@hooks/useDataByCategoryId';
import { Card } from '@components/common/Card';

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

  /* this is currently in development */
  /* I need separate de movies grid and the pagination to another componente */
  /* improve loading  */
  return (
    <Layout>
      {
        loading ? <></> :
          media && media.length > 0 && (
            <section className='mt-36 mb-24'>
              <span className='grid grid-cols-5 gap-4 mb-6'>
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
