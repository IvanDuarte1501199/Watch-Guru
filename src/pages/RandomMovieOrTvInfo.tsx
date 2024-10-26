import { MediaType } from '@appTypes/common/MediaType';
import { MovieProps } from '@appTypes/movies/movieProps';
import { TvProps } from '@appTypes/tv/tvProps';
import Button from '@components/common/Button';
import { Layout } from '@components/Layout';
import MediaGrid from '@components/MediaGrid';
import { useRandomMovieOrTv } from '@hooks/useRandomMovieOrTv';
import MoviePageSection from '@sections/movies/MoviePageSection';
import TvShowPageSection from '@sections/tv/TvShowPageSection';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RandomMovieOrTvInfo: React.FC = () => {
  const navigate = useNavigate();
  const type: MediaType = window.location.pathname.includes('random/movie') ? MediaType.Movie : MediaType.Tv;
  const { randomItem: randomTvOrMovie, recommendedItems, itemsCredits, loading: loadingRandom, error: randomError } = useRandomMovieOrTv(type, true, true);
  const [showAllRecommendedItems, setShowAllRecommendedItems] = useState(false);

  useEffect(() => {
    if (randomError) {
      navigate('/404');
    }
  }, [randomError, navigate]);

  const isLoading = loadingRandom || !randomTvOrMovie;
  const displayRecommendedItems = showAllRecommendedItems ? recommendedItems : recommendedItems.slice(0, 10);


  return (
    <Layout>
      {!isLoading && randomTvOrMovie && type === MediaType.Movie && (
        <MoviePageSection movie={randomTvOrMovie as MovieProps} credits={itemsCredits} />
      )}
      {!isLoading && randomTvOrMovie && type === MediaType.Tv && (
        <TvShowPageSection tvShow={randomTvOrMovie as TvProps} credits={itemsCredits} />
      )}
      {
        displayRecommendedItems && displayRecommendedItems.length > 0 && <><h2 className='h2-guru text-center uppercase mb-4 md:mb-8'>Recommended similars</h2>
          <MediaGrid media={displayRecommendedItems} />
          {recommendedItems.length > 10 && !showAllRecommendedItems && (
            <Button onClick={() => setShowAllRecommendedItems(true)} variant="secondary">
              View more
            </Button>
          )}</>
      }
    </Layout>
  );
};

export default RandomMovieOrTvInfo;
