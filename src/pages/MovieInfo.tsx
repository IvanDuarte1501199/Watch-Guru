import { Layout } from '@components/Layout';
import { useMovie } from '@hooks/movies/useMovie';
import MoviePageSection from '@sections/movies/MoviePageSection';
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const MovieInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate('/404');
    }
  }, [id, navigate]);

  const { movie, loading, error } = useMovie(id!);

  useEffect(() => {
    if (error) {
      navigate('/404');
    }
  }, [error, navigate]);

  /* improve loading and create 505 page */
  if (loading) return <p className="text-center">Loading movie details...</p>;
  return (
    <Layout>
      <MoviePageSection movie={movie} />
    </Layout>
  );
};

export default MovieInfo;
