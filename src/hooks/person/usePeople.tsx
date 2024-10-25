import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { useAppDispatch } from '@hooks/store';
import { fetchTrendingPeople } from '@slice/person/trendingPeopleSlice';

/* TODO: this should be extended to fetch more people */
const usePeople = () => {
  const dispatch = useAppDispatch();

  const { people, loading, error } = useSelector(
    (state: RootState) => state.trendingPeople
  );

  useEffect(() => {
    if (people.length === 0 && loading === false) {
      dispatch(fetchTrendingPeople());
    }
  }, [dispatch, people.length, loading]);

  return { people, loading, error };
};

export default usePeople;
