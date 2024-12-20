import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { useAppDispatch } from '@hooks/store';
import { fetchTrendingAll } from '@slice/trendingSlice';
import { MediaTypes } from '@appTypes/common/media';

interface UseMediasParams {
  mediaType: MediaTypes;
  page?: number;
}

const useMedias = ({ mediaType, page = 1 }: UseMediasParams) => {
  const dispatch = useAppDispatch();

  const trendingAllState = useSelector((state: RootState) => state.trendingAll);

  useEffect(() => {
    const fetchMedia = () => {
      switch (mediaType) {
        case MediaTypes.Trending:
          if (trendingAllState.response.results.length === 0 || page !== trendingAllState.response.page) {
            dispatch(fetchTrendingAll(page));
          }
          break;
        default:
          break;
      }
    };

    fetchMedia();
  }, [dispatch, mediaType, page, trendingAllState]);

  const getCurrentMediaState = () => {
    switch (mediaType) {
      case MediaTypes.Trending:
        return trendingAllState;
      default:
        return {
          response: { results: [], page: 1, total_pages: 1 },
          loading: false,
          error: null,
        };
    }
  };

  const { response, loading, error } = getCurrentMediaState();

  return {
    media: response.results,
    loading,
    error,
    currentPage: response.page,
    totalPages: response.total_pages,
  };
};

export default useMedias;
