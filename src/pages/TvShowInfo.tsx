import React from 'react';
import { useTvShow } from '@hooks/tv/useTvShow';
import { useParams } from 'react-router-dom';
import { Layout } from '@components/Layout';
import TvShowSection from '@sections/tv/TvShowPageSection';
const TvShowInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    tvShow,
    loading: loadingShow,
    error: showError,
  } = useTvShow(id as string);

  if (loadingShow)
    return <p className="text-center">Loading TV show details...</p>;
  if (showError) return <p className="text-center text-red-500">{showError}</p>;

  return (
    <Layout>
      <TvShowSection tvShow={tvShow} />
    </Layout>
  );
};

export default TvShowInfo;
