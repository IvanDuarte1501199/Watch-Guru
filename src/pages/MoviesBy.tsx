import { MovieType } from '@appTypes/movies/movieProps';
import Pagination from '@components/common/Pagination';
import { Layout } from '@components/Layout';
import MediaGrid from '@components/MediaGrid';
import useMovies from '@hooks/movies/useMovies';
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

const MoviesBy: React.FC = () => {
  const { movieType } = useParams<{ movieType: string }>();

  const movieTypeMap: Record<string, MovieType> = {
    'trending': MovieType.Trending,
    'now-playing': MovieType.NowPlaying,
    'popular': MovieType.Popular,
    'top-rated': MovieType.TopRated,
    'upcoming': MovieType.Upcoming,
  };

  const selectedMovieType = movieTypeMap[movieType || 'trending'];

  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const initialPage = Number(query.get('page')) || 1;

  const { media, currentPage, totalPages, error, loading } = useMovies({ movieType: selectedMovieType, page: initialPage });

  return (
    <Layout>
      <h1 className='h1-guru uppercase text-center pt-4 md:pt-8 pb-4 md:pb-8'>{movieType?.replace('-', ' ')} Movies</h1>
      <section className='mb-4 md:mb-8'>
        <MediaGrid media={media} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          path={`/movies/${movieType}`}
        />
      </section>
    </Layout>
  );
};

export default MoviesBy;
