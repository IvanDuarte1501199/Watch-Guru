import { MovieType } from '@appTypes/movies/movieProps';
import Pagination from '@components/common/Pagination';
import { Layout } from '@components/common/Layout';
import useMovies from '@hooks/movies/useMovies';
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import MediaGrid from '@components/shared/MediaGrid';

const MoviesBy: React.FC = () => {
  const { movieType } = useParams<{ movieType: string }>();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const initialPage = Number(query.get('page')) || 1;

  const movieTypeMap: Record<string, MovieType> = {
    'trending': MovieType.Trending,
    'now-playing': MovieType.NowPlaying,
    'popular': MovieType.Popular,
    'top-rated': MovieType.TopRated,
    'upcoming': MovieType.Upcoming,
  };
  const selectedMovieType = movieTypeMap[movieType || 'trending'];

  const { media, currentPage, totalPages, error, loading } = useMovies({ movieType: selectedMovieType, page: initialPage });

  return (
    <Layout>
      {loading ? (
        <p className="text-center text-lg py-8">Loading...</p>
      ) : error ? (
        <p className="text-center text-lg text-red-500 py-8">An error occurred. Please try again later.</p>
      ) : media && media.length > 0 ? (
        <>
          <h1 className="h1-guru uppercase text-center pt-4 md:pt-8 pb-4 md:pb-8">
            {movieType?.replace('-', ' ')} Movies
          </h1>
          <section className="mb-4 md:mb-8">
            <MediaGrid media={media} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              path={`/movies/${movieType}`}
            />
          </section>
        </>
      ) : (
        <p className="text-center text-lg py-8">No movies available at the moment.</p>
      )}
    </Layout>
  );
};

export default MoviesBy;
