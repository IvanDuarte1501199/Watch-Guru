import React, { useEffect, useState } from 'react';
import { useTvShow } from '@hooks/tv/useTvShow';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@components/Layout';
import TvShowSection from '@sections/tv/TvShowPageSection';
import MediaGrid from '@components/MediaGrid';
import Button from '@components/common/Button';

const TvShowInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showAllRecommendedTvShows, setShowAllRecommendedTvShows] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/404');
    }
  }, [id, navigate]);

  const {
    tvShow,
    recommendedTvShows,
    tvShowCredits,
    loading: loadingShow,
    error,
  } = useTvShow(id as string || '', true, true);

  useEffect(() => {
    if (error) {
      /* this should redirect to 500 page */
      navigate('/404');
    }
  }, [error, navigate]);

  const displayRecommendedTvShows = showAllRecommendedTvShows ? recommendedTvShows : recommendedTvShows.slice(0, 10);

  return (
    <Layout>
      {loadingShow ? <><p className="text-center">Loading TV show details...</p></>
        : <><TvShowSection tvShow={tvShow} credits={tvShowCredits} />
          {
            displayRecommendedTvShows && displayRecommendedTvShows.length > 0 && <><h2 className='h2-guru text-center uppercase mb-4 md:mb-8'>Recommended similars tv shows</h2>
              <MediaGrid media={displayRecommendedTvShows} />
              {recommendedTvShows.length > 10 && !showAllRecommendedTvShows && (
                <Button onClick={() => setShowAllRecommendedTvShows(true)} variant="secondary">
                  View more
                </Button>
              )}</>
          }</>
      }
    </Layout>
  );
};

export default TvShowInfo;
