import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { AppDispatch, RootState } from '@store/index';
import { fetchRandomByType } from '@slice/randomMovieOrTvSlice';
import { GenericItemProps } from '@appTypes/common/genericItemProps';
import { MediaType } from '@appTypes/common/MediaType';

export const useRandomMovieOrTv = (type: MediaType) => {
  const dispatch: AppDispatch = useDispatch();

  const { randomTvOrMovie, loading, error } = useSelector(
    (state: RootState) => state.RandomMovieOrTvInfo
  );

  /* let loadingEffect = true; */

  useEffect(() => {
    if (type && !loading /* && !loadingEffect */) {
      dispatch(fetchRandomByType(type));
    }
    /* loadingEffect = false */
  }, [dispatch, type]);


  return {
    randomTvOrMovie: randomTvOrMovie as GenericItemProps,
    loading,
    error,
  };
};
