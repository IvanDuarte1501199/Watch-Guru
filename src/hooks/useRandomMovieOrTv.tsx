import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { AppDispatch, RootState } from '@store/index';
import { fetchRandomByType } from '@slice/randomMovieOrTvSlice';
import { GenericItemProps } from '@appTypes/common/genericItemProps';

export const useRandomMovieOrTv = (type: 'movie' | 'tv') => {
  const dispatch: AppDispatch = useDispatch();

  const { randomTvOrMovie, loading, error } = useSelector(
    (state: RootState) => state.RandomMovieOrTvInfo
  );

  useEffect(() => {
    if (type && !loading) {
      dispatch(fetchRandomByType(type));
    }
  }, [dispatch, type]);


  return {
    randomTvOrMovie: randomTvOrMovie as GenericItemProps,
    loading,
    error,
  };
};
