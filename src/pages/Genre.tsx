import React from 'react';
import { Layout } from '@components/common/Layout';
import { useParams, useLocation } from 'react-router-dom';
import useMediaByCategoryId from '@hooks/useDataByCategoryId';
import useGenres from '@hooks/useGenres';
import { MainTitle } from '@components/common/MainTitle';
import Pagination from '@components/common/Pagination';
import MediaGrid from '@components/shared/MediaGrid';
import Loader from '@components/common/Loader';

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
    const idNum = Number(genreId);
    const genreIdImageMap: Record<number, string> = {
      28: "action",
      12: "adventure",
      16: "animation",
      35: "comedy",
      80: "crime",
      99: "documentary",
      18: "drama",
      10751: "family",
      14: "fantasy",
      36: "history",
      27: "horror",
      10402: "music",
      9648: "mystery",
      10749: "romance",
      878: "science-fiction",
      10770: "tv-movie",
      53: "thriller",
      10752: "war",
      37: "western",
      
      10759: "action-&-adventure",
      10762: "kids",
      10763: "news",
      10764: "reality",
      10765: "sci-fi-&-fantasy",
      10766: "soap",
      10767: "talk",
      10768: "war-&-politics",
    };
    return genreIdImageMap[idNum] || '';
  };

  const bgPath = id ? getGenrePath(id) : '';

  return (
    <Layout backgroundSrc={bgPath ? `/genres/${bgPath}.jpg` : undefined}>
      {loading ? (
        <Loader />
      ) : (
        media && media.length > 0 && (
          <section className='mb-4 md:mb-8 animate-fade-in-page'>
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
