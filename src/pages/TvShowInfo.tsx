import React, { useEffect } from 'react';
import { useTvShow } from '@hooks/tv/useTvShow';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@components/Layout';
import TvShowSection from '@sections/tv/TvShowPageSection';
import MediaGrid from '@components/MediaGrid';
const TvShowInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    tvShow,
    recommendedTvShows,
    loading: loadingShow,
    error,
  } = useTvShow(id as string || '', true);

  useEffect(() => {
    if (error) {
      /* this should redirect to 500 page */
      navigate('/404');
    }
  }, [error, navigate]);

  if (loadingShow)
    return <p className="text-center">Loading TV show details...</p>;

  return (
    <Layout>
      <TvShowSection tvShow={tvShow} />
      {
        recommendedTvShows && recommendedTvShows.length > 0 && <><h2 className='h2-guru text-center uppercase mb-8 md:mb-12'>Recommended movies</h2>
          <MediaGrid media={recommendedTvShows.slice(0, 10)} /></>
      }
    </Layout>
  );
};

export default TvShowInfo;
