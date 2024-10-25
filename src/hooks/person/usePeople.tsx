import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { useAppDispatch } from '@hooks/store';
import { fetchTrendingPeople } from '@slice/person/trendingPeopleSlice';

/* TODO: this should be extended to fetch more people */
const usePeople = () => {
  const dispatch = useAppDispatch();

  const { response, loading, error } = useSelector(
    (state: RootState) => state.trendingPeople
  );

  useEffect(() => {
    if (response.results.length === 0 && loading === false) {
      dispatch(fetchTrendingPeople());
    }
  }, [dispatch, response.results.length, loading]);

  return {
    people: response.results,
    loading,
    error,
    currentPage: response.page,
    totalPages: response.total_pages,
  };
};

export default usePeople;
