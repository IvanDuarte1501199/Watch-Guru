import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { useAppDispatch } from '@hooks/store';
import { PeopleTypes } from '@appTypes/person/peopleTypes';
import { fetchTrendingPeople } from '@slice/person/trendingPeopleSlice';

interface UsePeopleParams {
  peopleType: PeopleTypes;
  keywordId?: string;
  page?: number;
}

const usePeople = ({ peopleType, keywordId, page = 1 }: UsePeopleParams) => {
  const dispatch = useAppDispatch();

  const trendingPeople = useSelector((state: RootState) => state.trendingPeople);

  useEffect(() => {
    const fetchPeople = () => {
      switch (peopleType) {
        case PeopleTypes.Trending:
          console.log(trendingPeople);
          if (trendingPeople.response.results.length === 0 || page !== trendingPeople.response.page) {
            dispatch(fetchTrendingPeople());
          }
          break;
        default:
          break;
      }
    };

    fetchPeople();
  }, [dispatch, peopleType, page, keywordId, trendingPeople]);

  const getCurrentPeopleState = () => {
    switch (peopleType) {
      case PeopleTypes.Trending:
        return trendingPeople;
      default:
        return {
          response: { results: [], page: 1, total_pages: 1 },
          loading: false,
          error: null,
        };
    }
  };

  const { response, loading, error } = getCurrentPeopleState();

  return {
    people: response.results,
    loading,
    error,
    currentPage: response.page,
    totalPages: response.total_pages,
  };
};

export default usePeople;
