import Button from '@components/common/Button';
import { Layout } from '@components/Layout';
import MediaGrid from '@components/MediaGrid';
import { useMovie } from '@hooks/movies/useMovie';
import MoviePageSection from '@sections/movies/MoviePageSection';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const MovieInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showAllRecommendedMovies, setShowAllRecommendedMovies] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/404');
    }
  }, [id, navigate]);

  const { movie, recommendedMovies, loading, error } = useMovie(id!, true);
  const displayRecommendedMovies = showAllRecommendedMovies ? recommendedMovies : recommendedMovies.slice(0, 10);

  useEffect(() => {
    if (error) {
      navigate('/404');
    }
  }, [error, navigate]);

  useEffect(() => { console.log('movie', movie) }, [movie])

  /* improve loading and create 505 page */
  if (loading) return <p className="text-center">Loading movie details...</p>;
  return (
    <Layout>
      <MoviePageSection movie={movie} />
      {
        displayRecommendedMovies && displayRecommendedMovies.length > 0 && <><h2 className='h2-guru text-center uppercase mb-4 md:mb-8'>Recommended similars movies</h2>
          <MediaGrid media={displayRecommendedMovies} />
          {recommendedMovies.length > 10 && !showAllRecommendedMovies && (
            <Button onClick={() => setShowAllRecommendedMovies(true)} variant="secondary">
              View more
            </Button>
          )}</>
      }
    </Layout>
  );
};

export default MovieInfo;
