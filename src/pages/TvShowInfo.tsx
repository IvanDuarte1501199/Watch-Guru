import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@components/common/Layout';
import TvShowSection from '@sections/tv/TvShowPageSection';
import Button from '@components/common/Button';
import { useMedia } from '@hooks/useMedia';
import { MediaType } from '@appTypes/common/MediaType';
import { TvProps } from '@appTypes/tv/tvProps';
import MediaGrid from '@components/shared/MediaGrid';
import TeaserList from '@components/shared/TesaerList';

const TvShowInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showAllRecommendedTvShows, setShowAllRecommendedTvShows] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/500');
    }
  }, [id, navigate]);

  const {
    media: tvShow,
    recommendedItems: recommendedTvShows,
    mediaCredits: tvShowCredits,
    mediaTeasers,
    loading: loadingShow,
    error,
  } = useMedia({ type: MediaType.Tv, id: id!, getCredits: true, getRecommended: true, getTeasers: true });

  useEffect(() => {
    if (error) {
      navigate('/500');
    }
  }, [error, navigate]);

  const displayRecommendedTvShows = showAllRecommendedTvShows ? recommendedTvShows : recommendedTvShows.slice(0, 10);

  return (
    <Layout backgroundSrc={tvShow?.backdrop_path ? `https://image.tmdb.org/t/p/original/${tvShow.backdrop_path}` : undefined}>
      {loadingShow ? <><p className="text-center">Loading TV show details...</p></>
        : <><TvShowSection tvShow={tvShow as TvProps} credits={tvShowCredits} />
          {mediaTeasers && mediaTeasers.length > 0 && <TeaserList teasers={mediaTeasers} />}

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
