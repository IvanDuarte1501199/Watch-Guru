import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { useAppDispatch } from '@hooks/store';
import { fetchPopularMovies } from '@slice/movies/popularMoviesSlice';
import { fetchNowPlayingMovies } from '@slice/movies/nowPlayingMoviesSlice';
import { fetchTopRatedMovies } from '@slice/movies/topRatedMoviesSlice';
import { fetchUpcomingMovies } from '@slice/movies/upcomingMoviesSlice';
import { fetchTrendingMovies } from '@slice/movies/trendingMoviesSlice';
import { MovieType } from '@appTypes/movies/movieProps';
import { fetchMoviesByKeyword } from '@slice/movies/moviesByKeywordsSlice';

interface UseMoviesParams {
  movieType: MovieType;
  keywordId?: string;
}

const useMovies = ({ movieType, keywordId }: UseMoviesParams) => {
  const dispatch = useAppDispatch();

  const popularMoviesState = useSelector(
    (state: RootState) => state.popularMovies
  );
  const nowPlayingMoviesState = useSelector(
    (state: RootState) => state.nowPlayingMovies
  );
  const topRatedMoviesState = useSelector(
    (state: RootState) => state.topRatedMovies
  );
  const upcomingMoviesState = useSelector(
    (state: RootState) => state.upcomingMovies
  );
  const trendingMovies = useSelector(
    (state: RootState) => state.trendingMovies
  );
  const moviesByKeywords = useSelector(
    (state: RootState) => state.moviesByKeywords
  );

  useEffect(() => {
    switch (movieType) {
      case MovieType.Popular:
        if (popularMoviesState.movies.length === 0) {
          dispatch(fetchPopularMovies());
        }
        break;
      case MovieType.NowPlaying:
        if (nowPlayingMoviesState.movies.length === 0) {
          dispatch(fetchNowPlayingMovies());
        }
        break;
      case MovieType.TopRated:
        if (topRatedMoviesState.movies.length === 0) {
          dispatch(fetchTopRatedMovies());
        }
        break;
      case MovieType.Upcoming:
        if (upcomingMoviesState.movies.length === 0) {
          dispatch(fetchUpcomingMovies());
        }
        break;
      case MovieType.Trending:
        if (trendingMovies.movies.length === 0) {
          dispatch(fetchTrendingMovies());
        }
        break;
      case MovieType.ByKeyword:
        if (moviesByKeywords.movies.length === 0) {
          dispatch(fetchMoviesByKeyword(keywordId ?? ''));
        }
      default:
        break;
    }
  }, [
    dispatch,
    movieType,
    popularMoviesState.movies.length,
    nowPlayingMoviesState.movies.length,
    topRatedMoviesState.movies.length,
    upcomingMoviesState.movies.length,
    trendingMovies.movies.length,
    moviesByKeywords.movies.length,
  ]);

  switch (movieType) {
    case MovieType.Popular:
      return { ...popularMoviesState };
    case MovieType.NowPlaying:
      return { ...nowPlayingMoviesState };
    case MovieType.TopRated:
      return { ...topRatedMoviesState };
    case MovieType.Upcoming:
      return { ...upcomingMoviesState };
    case MovieType.Trending:
      return { ...trendingMovies };
    case MovieType.ByKeyword:
      return { ...moviesByKeywords };
    default:
      return { movies: [], loading: false, error: null };
  }
};

export default useMovies;
