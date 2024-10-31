import { configureStore } from '@reduxjs/toolkit';
import genresReducer from '@slice/genres/genresSlice';
import popularMoviesReducer from '@slice/movies/popularMoviesSlice';
import nowPlayingMoviesReducer from '@slice/movies/nowPlayingMoviesSlice';
import topRatedMoviesReducer from '@slice/movies/topRatedMoviesSlice';
import upcomingMoviesReducer from '@slice/movies/upcomingMoviesSlice';
import trendingMoviesReducer from '@slice/movies/trendingMoviesSlice';
import airingTodayTvReducer from '@slice/tv/airingTodaySlice';
import onTheAirTvReducer from '@slice/tv/onTheAirSlice';
import popularTvReducer from '@slice/tv/popularTvSlice';
import topRatedTvReducer from '@slice/tv/topRatedTvSlice';
import trendingTvReducer from '@slice/tv/trendingTvSlice';
import trendingAllReducer from '@slice/trendingSlice';
import DataByGenreIdReducer from '@slice/genres/DataByGenreIdSlice';
import moviesByKeywordsReducer from '@slice/movies/moviesByKeywordsSlice';
import trendingPeopleReducer from '@slice/person/trendingPeopleSlice';
import countryReducer from '@slice/country/countrySlice';

export const store = configureStore({
  reducer: {
    genres: genresReducer,
    popularMovies: popularMoviesReducer,
    nowPlayingMovies: nowPlayingMoviesReducer,
    topRatedMovies: topRatedMoviesReducer,
    upcomingMovies: upcomingMoviesReducer,
    trendingMovies: trendingMoviesReducer,
    airingTodayTv: airingTodayTvReducer,
    onTheAirTv: onTheAirTvReducer,
    popularTv: popularTvReducer,
    topRatedTv: topRatedTvReducer,
    trendingTv: trendingTvReducer,
    trendingAll: trendingAllReducer,
    mediaByCategory: DataByGenreIdReducer,
    moviesByKeywords: moviesByKeywordsReducer,
    trendingPeople: trendingPeopleReducer,
    countries: countryReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
