import React, { useEffect, useState } from 'react';
import { usePerson } from '@hooks/person/usePerson';
import { useParams } from 'react-router-dom';
import { Layout } from '@components/common/Layout';
import PersonSection from '@sections/person/PersonPageSection';
import Button from '@components/common/Button';
import MediaGrid from '@components/shared/MediaGrid';

const PersonInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [showAllMovies, setShowAllMovies] = useState(false);
  const [showAllTvShows, setShowAllTvShows] = useState(false);

  const {
    person,
    moviesCredits,
    tvCredits,
    loading: loadingPerson,
    error: personError,
  } = usePerson(id as string);

  const displayMovies = showAllMovies ? moviesCredits : moviesCredits.slice(0, 10);
  const displayTvShows = showAllTvShows ? tvCredits : tvCredits.slice(0, 10);

  const [backgroundImg, setBackgroundImg] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (moviesCredits.length > 0) {
      const randomIndex = Math.floor(Math.random() * 5);
      setBackgroundImg(`https://image.tmdb.org/t/p/original/${moviesCredits[randomIndex]?.backdrop_path}`);
    }
  }, [moviesCredits]);


  if (loadingPerson)
    return <p className="text-center">Loading person details...</p>;

  return (
    <Layout backgroundSrc={
      moviesCredits.length > 0
        ? backgroundImg
        : undefined
    }>
      {loadingPerson ? <></> : <><PersonSection person={person} />
        <h2 className='h2-guru text-center uppercase mb-4 md:mb-8'>Known for Movies</h2>
        {moviesCredits && moviesCredits.length > 0 && <><MediaGrid media={displayMovies} />
          {moviesCredits.length > 10 && !showAllMovies && (
            <Button onClick={() => setShowAllMovies(true)} variant="secondary">
              View more
            </Button>
          )}
        </>}
        {tvCredits && tvCredits.length > 0 && <><h2 className='h2-guru text-center uppercase mb-4 md:mb-8'>Known for TV Shows</h2>
          <MediaGrid media={displayTvShows} />
          {tvCredits.length > 10 && !showAllTvShows && (
            <Button onClick={() => setShowAllTvShows(true)} variant="secondary">
              View more
            </Button>
          )}
        </>}
      </>}
    </Layout>
  );
};

export default PersonInfo;
