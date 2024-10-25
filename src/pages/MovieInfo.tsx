import { Layout } from '@components/Layout';
import MediaGrid from '@components/MediaGrid';
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

  const { movie, recommendedMovies, loading, error } = useMovie(id!, true);

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
      {
        recommendedMovies && recommendedMovies.length > 0 && <><h2 className='h2-guru text-center uppercase mb-8 md:mb-12'>Recommended movies</h2>
          <MediaGrid media={recommendedMovies.slice(0, 10)} /></>
      }
    </Layout>
  );
};

export default MovieInfo;
