import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { useAppDispatch } from '@hooks/store';
import { fetchMediaByCategoryId } from '@slice/genres/DataByGenreIdSlice';
import useGenres from '@hooks/useGenres';

const useMediaByCategoryId = (categoryId?: string, page: number = 1) => {
  const dispatch = useAppDispatch();

  const { moviesGenres, loading: isGenresLoading } = useGenres();
  const mediaState = useSelector((state: RootState) => state.mediaByCategory);

  useEffect(() => {
    if (!isGenresLoading && moviesGenres.length > 0 && categoryId) {
      dispatch(fetchMediaByCategoryId({ categoryId, page }));
    }
  }, [dispatch, categoryId, moviesGenres, isGenresLoading, page]);

  return {
    media: mediaState.response.results,
    loading: mediaState.loading,
    error: mediaState.error,
    currentPage: mediaState.response.page,
    totalPages: mediaState.response.total_pages
  };
};

export default useMediaByCategoryId;
