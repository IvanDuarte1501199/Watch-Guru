import React, { useEffect } from 'react';
import { Layout } from '@components/Layout';
import { fetchPopularMovies } from '@slice/movies/popularMoviesSlice';
import { AppDispatch, RootState } from '@store/index';
import { useDispatch, useSelector } from 'react-redux';
import { GenericList } from '@components/common/GenericList';

const SandBox: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    movies: popularMovies,
    loading,
    error,
  } = useSelector((state: RootState) => state.popularMovies);

  useEffect(() => {
    dispatch(fetchPopularMovies());
  }, [dispatch]);

  return (
    <Layout>
      <h1 className="h1-guru pb-6 pt-6 text-center uppercase">
        Welcome to your next binge-worthy recommendation!
      </h1>
      {popularMovies.length} {loading ? 'loading' : 'no loading'}{' '}
      {error ? 'error' : 'no error'}
      {popularMovies && popularMovies.length > 0 && (
        <h2 className="h2-guru mb-12 text-center">Popular Movies</h2>
      )}
      {popularMovies && popularMovies.length > 0 && (
        <GenericList title="Popular Movies" genericList={popularMovies} />
      )}
    </Layout>
  );
};

export default SandBox;
