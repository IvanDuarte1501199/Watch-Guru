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

  const tvStates = useSelector((state: RootState) => ({
    popular: state.popularTv,
    airingToday: state.airingTodayTv,
    onTheAir: state.onTheAirTv,
    topRated: state.topRatedTv,
    trending: state.trendingTv,
  }));

  useEffect(() => {
    const fetchTvShows = () => {
      switch (tvShowType) {
        case TvShowType.Popular:
          if (tvStates.popular.response.results.length === 0 || page !== tvStates.popular.response.page) {
            dispatch(fetchPopularTv(page));
          }
          break;
        case TvShowType.AiringToday:
          if (tvStates.airingToday.response.results.length === 0 || page !== tvStates.airingToday.response.page) {
            dispatch(fetchAiringToday(page));
          }
          break;
        case TvShowType.OnTheAir:
          if (tvStates.onTheAir.response.results.length === 0 || page !== tvStates.onTheAir.response.page) {
            dispatch(fetchOnTheAir(page));
          }
          break;
        case TvShowType.TopRated:
          if (tvStates.topRated.response.results.length === 0 || page !== tvStates.topRated.response.page) {
            dispatch(fetchTopRatedTv(page));
          }
          break;
        case TvShowType.Trending:
          if (tvStates.trending.response.results.length === 0 || page !== tvStates.trending.response.page) {
            dispatch(fetchTrendingTv(page));
          }
          break;
        default:
          break;
      }
    };

    fetchTvShows();
  }, [dispatch, tvShowType, page, tvStates]);

  const getCurrentTvState = () => {
    switch (tvShowType) {
      case TvShowType.Popular:
        return tvStates.popular;
      case TvShowType.AiringToday:
        return tvStates.airingToday;
      case TvShowType.OnTheAir:
        return tvStates.onTheAir;
      case TvShowType.TopRated:
        return tvStates.topRated;
      case TvShowType.Trending:
        return tvStates.trending;
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
