import { MediaType } from '@appTypes/common/MediaType';
import { MovieProps } from '@appTypes/movies/movieProps';
import Button from '@components/common/Button';
import { Layout } from '@components/common/Layout';
import Credits from '@components/shared/Credits';
import MediaGrid from '@components/shared/MediaGrid';
import TeaserList from '@components/shared/TesaerList';
import { useMedia } from '@hooks/useMedia';
import useMediaProvider from '@hooks/useMediaProvider';
import MoviePageSection from '@sections/movies/MoviePageSection';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { translations } from '../i18n/translations';
import Loader from '@components/common/Loader';

const MovieInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showAllRecommendedMovies, setShowAllRecommendedMovies] = useState(false);
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);
  const t = translations[currentLanguage];

  useEffect(() => {
    if (!id) {
      navigate('/500');
    }
  }, [id, navigate]);

  const { media: movie, mediaCredits: movieCredits, recommendedItems: recommendedMovies, mediaTeasers, loading, error } =
    useMedia({ type: MediaType.Movie, id: id!, getCredits: true, getRecommended: true, getTeasers: true });

  const { mediasProviders } = useMediaProvider({
    id: id!,
    type: MediaType.Movie,
  });

  useEffect(() => {
    if (error) {
      navigate('/500');
    }
  }, [error, navigate]);
  const displayRecommendedMovies = showAllRecommendedMovies ? recommendedMovies : recommendedMovies.slice(0, 10);

  return (
    <Layout backgroundSrc={movie?.backdrop_path ? `https://image.tmdb.org/t/p/original/${movie.backdrop_path}` : undefined}>
      {loading ? <Loader /> :
        <div className="animate-fade-in-page">
          <MoviePageSection movie={movie as MovieProps} providers={mediasProviders} />
          <Credits credits={movieCredits} />
          {mediaTeasers && mediaTeasers.length > 0 && <TeaserList teasers={mediaTeasers} />}
          {
            displayRecommendedMovies && displayRecommendedMovies.length > 0 && <>
              <h2 className='h2-guru text-center uppercase mb-4 md:mb-8'>{t.recommendedMovies}</h2>
              <MediaGrid media={displayRecommendedMovies} />
              {recommendedMovies.length > 10 && !showAllRecommendedMovies && (
                <Button onClick={() => setShowAllRecommendedMovies(true)} variant="secondary">
                  {t.viewMore}
                </Button>
              )}
            </>
          }
        </div>
      }
    </Layout>
  );
};

export default MovieInfo;
