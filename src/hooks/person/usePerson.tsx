import { useEffect, useState } from 'react';
import { PersonProps } from '@appTypes/person/personProps';
import { getPersonById, getPersonMoviesCredits, getPersonTvCredits } from '@services/personService';

export const usePerson = (id: string) => {
  const [person, setPerson] = useState<PersonProps>({} as PersonProps);
  const [moviesCredits, setMoviesCredits] = useState<any[]>([]);
  const [tvCredits, setTvCredits] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchPerson = async () => {
      if (!id) {
        setError('Person ID is missing');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const personData = await getPersonById(id);
        const movieCredits = await getPersonMoviesCredits(personData.id);
        setMoviesCredits(movieCredits);
        const tvCredits = await getPersonTvCredits(personData.id);
        setTvCredits(tvCredits);
        setPerson(personData);
      } catch (error) {
        setError('Failed to fetch person details');
      } finally {
        setLoading(false);
      }
    };

    fetchPerson();
  }, [id]);

  return { person, moviesCredits, tvCredits, loading, error };
};
