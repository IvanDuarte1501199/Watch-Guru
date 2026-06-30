import React, { useEffect, useState } from 'react';
import { usePerson } from '@hooks/person/usePerson';
import { useParams } from 'react-router-dom';
import { Layout } from '@components/common/Layout';
import PersonSection from '@sections/person/PersonPageSection';
import MediaGridList from '@components/shared/MediaGridList';
import ToggleSwitch from '@components/shared/ToggleSwitch';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { translations } from '../i18n/translations';
import Loader from '@components/common/Loader';

const PersonInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    person,
    moviesCredits,
    tvCredits,
    loading: loadingPerson,
  } = usePerson(id as string);
  const [backgroundImg, setBackgroundImg] = useState<string | undefined>(undefined);
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);
  const t = translations[currentLanguage];

  useEffect(() => {
    if (moviesCredits.length > 0) {
      const randomIndex = Math.floor(Math.random() * Math.min(moviesCredits.length, 5));
      setBackgroundImg(`https://image.tmdb.org/t/p/original/${moviesCredits[randomIndex]?.backdrop_path}`);
    }
  }, [moviesCredits]);

  return (
    <Layout backgroundSrc={moviesCredits.length > 0 ? backgroundImg : undefined}>
      {loadingPerson ? <Loader /> :
        <div className="animate-fade-in-page">
          <PersonSection person={person} />
          <ToggleSwitch labels={[t.movies, t.tvShows]}>
            <MediaGridList media={moviesCredits} label={currentLanguage === 'es' ? `Conocido por (Películas)` : `Known for Movies`} />
            <MediaGridList media={tvCredits} label={currentLanguage === 'es' ? `Conocido por (Series)` : `Known for TV Shows`} />
          </ToggleSwitch>
        </div>
      }
    </Layout>
  );
};

export default PersonInfo;
