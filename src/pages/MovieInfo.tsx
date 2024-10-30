import { MediaType } from '@appTypes/common/MediaType';
import { MovieProps } from '@appTypes/movies/movieProps';
import Button from '@components/common/Button';
import { Layout } from '@components/common/Layout';
import MediaGrid from '@components/shared/MediaGrid';
import TeaserList from '@components/shared/TesaerList';
import { useMedia } from '@hooks/useMedia';
import MoviePageSection from '@sections/movies/MoviePageSection';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const MovieInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showAllRecommendedMovies, setShowAllRecommendedMovies] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/500');
    }
  }, [id, navigate]);

  const { media: movie, mediaCredits: movieCredits, recommendedItems: recommendedMovies, mediaTeasers, loading, error } =
    useMedia({ type: MediaType.Movie, id: id!, getCredits: true, getRecommended: true, getTeasers: true });

  useEffect(() => {
    if (error) {
      navigate('/500');
    }
  }, [error, navigate]);

  const displayRecommendedMovies = showAllRecommendedMovies ? recommendedMovies : recommendedMovies.slice(0, 10);

  return (
    <Layout backgroundSrc={movie?.backdrop_path ? `https://image.tmdb.org/t/p/original/${movie.backdrop_path}` : undefined}>
      {loading ? <></> :
        <>
          <MoviePageSection movie={movie as MovieProps} credits={movieCredits} />
          {mediaTeasers && mediaTeasers.length > 0 && <TeaserList teasers={mediaTeasers} />}
          {
            displayRecommendedMovies && displayRecommendedMovies.length > 0 && <><h2 className='h2-guru text-center uppercase mb-4 md:mb-8'>Recommended similars movies</h2>
              <MediaGrid media={displayRecommendedMovies} />
              {recommendedMovies.length > 10 && !showAllRecommendedMovies && (
                <Button onClick={() => setShowAllRecommendedMovies(true)} variant="secondary">
                  View more
                </Button>
              )}</>
          }
        </>
      }
    </Layout>
  );
};

export default MovieInfo;
