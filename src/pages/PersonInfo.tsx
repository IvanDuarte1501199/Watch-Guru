import React, { useState } from 'react';
import { usePerson } from '@hooks/person/usePerson';
import { useParams } from 'react-router-dom';
import { Layout } from '@components/Layout';
import PersonSection from '@sections/person/PersonPageSection';
import MediaGrid from '@components/MediaGrid';
import Button from '@components/common/Button';

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

  if (loadingPerson)
    return <p className="text-center">Loading person details...</p>;

  const displayMovies = showAllMovies ? moviesCredits : moviesCredits.slice(0, 10);
  const displayTvShows = showAllTvShows ? tvCredits : tvCredits.slice(0, 10);

  return (
    <Layout>
      <PersonSection person={person} />
      <h2 className='h2-guru text-center uppercase mb-4 md:mb-8'>Known for Movies</h2>
      <MediaGrid media={displayMovies} />
      {moviesCredits.length > 10 && !showAllMovies && (
        <Button onClick={() => setShowAllMovies(true)} variant="secondary">
          Ver Más
        </Button>
      )}
      <h2 className='h2-guru text-center uppercase mb-4 md:mb-8'>Known for TV Shows</h2>
      <MediaGrid media={displayTvShows} />
      {tvCredits.length > 10 && !showAllTvShows && (
        <Button onClick={() => setShowAllTvShows(true)} variant="secondary">
          Ver Más
        </Button>
      )}
    </Layout>
  );
};

export default PersonInfo;
