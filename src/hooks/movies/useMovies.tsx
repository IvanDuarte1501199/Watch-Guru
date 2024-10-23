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
  page?: number
}

const useMovies = ({ movieType, keywordId, page = 1 }: UseMoviesParams) => {
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
  const trendingMoviesState = useSelector(
    (state: RootState) => state.trendingMovies
  );
  const moviesByKeywordsState = useSelector(
    (state: RootState) => state.moviesByKeywords
  );

  useEffect(() => {
    switch (movieType) {
      case MovieType.Popular:
        if (popularMoviesState.response.results.length === 0 || page != popularMoviesState.response.page) {
          dispatch(fetchPopularMovies(page));
        }
        break;
      case MovieType.NowPlaying:
        if (nowPlayingMoviesState.response.results.length === 0 || page != nowPlayingMoviesState.response.page) {
          dispatch(fetchNowPlayingMovies(page));
        }
        break;
      case MovieType.TopRated:
        if (topRatedMoviesState.response.results.length === 0 || page != topRatedMoviesState.response.page) {
          dispatch(fetchTopRatedMovies(page));
        }
        break;
      case MovieType.Upcoming:
        if (upcomingMoviesState.response.results.length === 0 || page != upcomingMoviesState.response.page) {
          dispatch(fetchUpcomingMovies(page));
        }
        break;
      case MovieType.Trending:
        if (trendingMoviesState.response.results.length === 0 || page != trendingMoviesState.response.page) {
          dispatch(fetchTrendingMovies(page));
        }
        break;
      case MovieType.ByKeyword:
        if (moviesByKeywordsState.response.results.length === 0 || page != moviesByKeywordsState.response.page) {
          dispatch(fetchMoviesByKeyword(keywordId ?? ''));
        }
      default:
        break;
    }
  }, [
    dispatch,
    movieType,
    popularMoviesState.response.results.length,
    nowPlayingMoviesState.response.results.length,
    topRatedMoviesState.response.results.length,
    upcomingMoviesState.response.results.length,
    trendingMoviesState.response.results.length,
    moviesByKeywordsState.response.results.length,
    page
  ]);

  switch (movieType) {
    case MovieType.Popular:
      return {
        media: popularMoviesState.response.results,
        loading: popularMoviesState.loading,
        error: popularMoviesState.error,
        currentPage: popularMoviesState.response.page,
        totalPages: popularMoviesState.response.total_pages
      }
    case MovieType.NowPlaying:
      return {
        media: nowPlayingMoviesState.response.results,
        loading: nowPlayingMoviesState.loading,
        error: nowPlayingMoviesState.error,
        currentPage: nowPlayingMoviesState.response.page,
        totalPages: nowPlayingMoviesState.response.total_pages
      }
    case MovieType.TopRated:
      return {
        media: topRatedMoviesState.response.results,
        loading: topRatedMoviesState.loading,
        error: topRatedMoviesState.error,
        currentPage: topRatedMoviesState.response.page,
        totalPages: topRatedMoviesState.response.total_pages
      }
    case MovieType.Upcoming:
      return {
        media: upcomingMoviesState.response.results,
        loading: upcomingMoviesState.loading,
        error: upcomingMoviesState.error,
        currentPage: upcomingMoviesState.response.page,
        totalPages: upcomingMoviesState.response.total_pages
      }
    case MovieType.Trending:
      return {
        media: trendingMoviesState.response.results,
        loading: trendingMoviesState.loading,
        error: trendingMoviesState.error,
        currentPage: trendingMoviesState.response.page,
        totalPages: trendingMoviesState.response.total_pages
      }
    case MovieType.ByKeyword:
      return {
        media: moviesByKeywordsState.response.results,
        loading: moviesByKeywordsState.loading,
        error: moviesByKeywordsState.error,
        currentPage: moviesByKeywordsState.response.page,
        totalPages: moviesByKeywordsState.response.total_pages
      }
    default:
      return {
        media: [],
        loading: false,
        error: null,
        currentPage: 1,
        totalPages: 1,
      };

  }
};

export default useMovies;
