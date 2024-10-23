import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { useAppDispatch } from '@hooks/store';
import { fetchTrendingAll } from '@slice/trendingSlice';
import { MediaTypes } from '@appTypes/common/media';

interface UseMediaParams {
  mediaType: MediaTypes;
  page?: number;
}

const useMedia = ({ mediaType, page = 1 }: UseMediaParams) => {
  const dispatch = useAppDispatch();

  const trendingAllState = useSelector((state: RootState) => ({
    trending: state.trendingAll,
  }));

  useEffect(() => {
    const fetchMedia = () => {
      switch (mediaType) {
        case MediaTypes.Trending:
          if (trendingAllState.trending.response.results.length === 0 || page !== trendingAllState.trending.response.page) {
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
        return trendingAllState.trending;
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

export default useMedia;
