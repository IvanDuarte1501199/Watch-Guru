import { configureStore } from '@reduxjs/toolkit';
import genresReducer from '../slice/genres/genresSlice';
import popularMoviesReducer from '../slice/movies/popularMoviesSlice';
import nowPlayingMoviesReducer from '../slice/movies/nowPlayingMoviesSlice';
import topRatedMoviesReducer from '../slice/movies/topRatedMoviesSlice';
import upcomingMoviesReducer from '../slice/movies/upcomingMoviesSlice';
import trendingMoviesReducer from '../slice/movies/trendingMoviesSlice';
import airingTodayTvSlice from '../slice/tv/airingTodaySlice';
import onTheAirTvSlice from '../slice/tv/onTheAirSlice';
import popularTvSlice from '../slice/tv/popularTvSlice';
import topRatedTvSlice from '../slice/tv/topRatedTvSlice';
import trendingTvSlice from '../slice/tv/trendingTvSlice';
import trendingAllSlice from '../slice/trendingSlice';

export const store = configureStore({
  reducer: {
    genres: genresReducer,
    popularMovies: popularMoviesReducer,
    nowPlayingMovies: nowPlayingMoviesReducer,
    topRatedMovies: topRatedMoviesReducer,
    upcomingMovies: upcomingMoviesReducer,
    trendingMovies: trendingMoviesReducer,
    airingTodayTv: airingTodayTvSlice,
    onTheAirTv: onTheAirTvSlice,
    popularTv: popularTvSlice,
    topRatedTv: topRatedTvSlice,
    trendingTv: trendingTvSlice,
    trendingAll: trendingAllSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
