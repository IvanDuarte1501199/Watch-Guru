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

const useTvShows = (tvShowType: TvShowType) => {
  const dispatch = useAppDispatch();

  const { tvShows, loading, error } = useSelector((state: RootState) => {
    switch (tvShowType) {
      case TvShowType.Popular:
        return state.popularTv;
      case TvShowType.AiringToday:
        return state.airingTodayTv;
      case TvShowType.OnTheAir:
        return state.onTheAirTv;
      case TvShowType.TopRated:
        return state.topRatedTv;
      case TvShowType.Trending:
        return state.trendingTv;
      default:
        throw new Error('Invalid TV show type');
    }
  });

  useEffect(() => {
    switch (tvShowType) {
      case TvShowType.Popular:
        if (tvShows.length === 0) {
          dispatch(fetchPopularTv());
        }
        break;
      case TvShowType.AiringToday:
        if (tvShows.length === 0) {
          dispatch(fetchAiringToday());
        }
        break;
      case TvShowType.OnTheAir:
        if (tvShows.length === 0) {
          dispatch(fetchOnTheAir());
        }
        break;
      case TvShowType.TopRated:
        if (tvShows.length === 0) {
          dispatch(fetchTopRatedTv());
        }
        break;
      case TvShowType.Trending:
        if (tvShows.length === 0) {
          dispatch(fetchTrendingTv());
        }
        break;
    }
  }, [dispatch, tvShowType, tvShows.length]);

  return { tvShows, loading, error };
};

export default useTvShows;
