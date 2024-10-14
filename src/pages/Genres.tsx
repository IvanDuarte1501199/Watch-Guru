import React, { useState } from 'react';
import { Layout } from '@components/Layout';
import { useParams } from 'react-router-dom';
import useMediaByCategoryId from '@hooks/useDataByCategoryId';
import { Card } from '@components/common/Card';

const Genres: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState(1);

  const { media, loading, error, currentPage, totalPages } = useMediaByCategoryId(id, page);

  /* separate pagination logic to a compo*/
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

  return (
    <Layout>
      {media && media.length > 0 && (
        <section className='mt-36 mb-24'>
          <span className='grid grid-cols-5 gap-4 mb-6'>
            {media.map((media) => (
              <Card {...media} key={media.id} />
            ))}
          </span>
          <div className="text-white flex gap-12 item-center justify-center">
            <button disabled={currentPage === 1} onClick={handlePrevPage}>Anterior</button>
            <button disabled={currentPage === totalPages} onClick={handleNextPage}>Siguiente</button>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Genres;
