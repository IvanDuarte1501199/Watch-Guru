import React, { useEffect, useState } from 'react';
import { usePerson } from '@hooks/person/usePerson';
import { useParams } from 'react-router-dom';
import { Layout } from '@components/common/Layout';
import PersonSection from '@sections/person/PersonPageSection';
import MediaGridList from '@components/shared/MediaGridList';
import ToggleSwitch from '@components/shared/ToggleSwitch';

const PersonInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    person,
    moviesCredits,
    tvCredits,
    loading: loadingPerson,
  } = usePerson(id as string);
  const [backgroundImg, setBackgroundImg] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (moviesCredits.length > 0) {
      const randomIndex = Math.floor(Math.random() * Math.min(moviesCredits.length, 5));
      setBackgroundImg(`https://image.tmdb.org/t/p/original/${moviesCredits[randomIndex]?.backdrop_path}`);
    }
  }, [moviesCredits]);

  return (
    <Layout backgroundSrc={moviesCredits.length > 0 ? backgroundImg : undefined}>
      {loadingPerson ? <></> :
        <>
          <PersonSection person={person} />
          <ToggleSwitch labels={['Movies', 'TV Shows']}>
            <MediaGridList media={moviesCredits} label="Known for Movies" />
            <MediaGridList media={tvCredits} label="Known for TV Shows" />
          </ToggleSwitch>
        </>
      }
    </Layout>
  );
};

export default PersonInfo;
