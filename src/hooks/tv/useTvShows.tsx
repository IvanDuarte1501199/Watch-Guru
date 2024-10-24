import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { useAppDispatch } from '@hooks/store';
import { TvShowType } from '@appTypes/tv/tvProps';
import { fetchPopularTv } from '@slice/tv/popularTvSlice';
import { fetchAiringToday } from '@slice/tv/airingTodaySlice';
import { fetchOnTheAir } from '@slice/tv/onTheAirSlice';
import { fetchTopRatedTv } from '@slice/tv/topRatedTvSlice';
import { fetchTrendingTv } from '@slice/tv/trendingTvSlice';

interface UseTvParams {
  tvShowType: TvShowType;
  page?: number;
}

const useTvShows = ({ tvShowType, page = 1 }: UseTvParams) => {
  const dispatch = useAppDispatch();

  const popularTv = useSelector((state: RootState) => state.popularTv);
  const airingToday = useSelector((state: RootState) => state.airingTodayTv);
  const onTheAirTv = useSelector((state: RootState) => state.onTheAirTv);
  const topRatedTv = useSelector((state: RootState) => state.topRatedTv);
  const trendingTv = useSelector((state: RootState) => state.trendingTv);

  useEffect(() => {
    const fetchTvShows = () => {
      switch (tvShowType) {
        case TvShowType.Popular:
          if (popularTv.response.results.length === 0 || page !== popularTv.response.page) {
            dispatch(fetchPopularTv(page));
          }
          break;
        case TvShowType.AiringToday:
          if (airingToday.response.results.length === 0 || page !== airingToday.response.page) {
            dispatch(fetchAiringToday(page));
          }
          break;
        case TvShowType.OnTheAir:
          if (onTheAirTv.response.results.length === 0 || page !== onTheAirTv.response.page) {
            dispatch(fetchOnTheAir(page));
          }
          break;
        case TvShowType.TopRated:
          if (topRatedTv.response.results.length === 0 || page !== topRatedTv.response.page) {
            dispatch(fetchTopRatedTv(page));
          }
          break;
        case TvShowType.Trending:
          if (trendingTv.response.results.length === 0 || page !== trendingTv.response.page) {
            dispatch(fetchTrendingTv(page));
          }
          break;
        default:
          break;
      }
    };

    fetchTvShows();
  }, [dispatch, tvShowType, page, popularTv, airingToday, onTheAirTv, topRatedTv, trendingTv]);

  const getCurrentTvState = () => {
    switch (tvShowType) {
      case TvShowType.Popular:
        return popularTv;
      case TvShowType.AiringToday:
        return airingToday;
      case TvShowType.OnTheAir:
        return onTheAirTv;
      case TvShowType.TopRated:
        return topRatedTv;
      case TvShowType.Trending:
        return trendingTv;
      default:
        return {
          response: { results: [], page: 1, total_pages: 1 },
          loading: false,
          error: null,
        };
    }
  };

  const { response, loading, error } = getCurrentTvState();

  return {
    media: response.results,
    loading,
    error,
    currentPage: response.page,
    totalPages: response.total_pages,
  };
};

export default useTvShows;
