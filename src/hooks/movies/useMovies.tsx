import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { useAppDispatch } from '@hooks/store';
import { fetchPopularMovies } from '@slice/movies/popularMoviesSlice';
import { fetchNowPlayingMovies } from '@slice/movies/nowPlayingMoviesSlice';
import { fetchTopRatedMovies } from '@slice/movies/topRatedMoviesSlice';
import { fetchUpcomingMovies } from '@slice/movies/upcomingMoviesSlice';
import { fetchTrendingMovies } from '@slice/movies/trendingMoviesSlice';
import { fetchMoviesByKeyword } from '@slice/movies/moviesByKeywordsSlice';
import { MovieType } from '@appTypes/movies/movieProps';

interface UseMoviesParams {
  movieType: MovieType;
  keywordId?: string;
  page?: number;
}

const useMovies = ({ movieType, keywordId, page = 1 }: UseMoviesParams) => {
  const dispatch = useAppDispatch();

  const movieStates = useSelector((state: RootState) => ({
    popular: state.popularMovies,
    nowPlaying: state.nowPlayingMovies,
    topRated: state.topRatedMovies,
    upcoming: state.upcomingMovies,
    trending: state.trendingMovies,
    byKeyword: state.moviesByKeywords,
  }));

  useEffect(() => {
    const fetchMovies = () => {
      switch (movieType) {
        case MovieType.Popular:
          if (movieStates.popular.response.results.length === 0 || page !== movieStates.popular.response.page) {
            dispatch(fetchPopularMovies(page));
          }
          break;
        case MovieType.NowPlaying:
          if (movieStates.nowPlaying.response.results.length === 0 || page !== movieStates.nowPlaying.response.page) {
            dispatch(fetchNowPlayingMovies(page));
          }
          break;
        case MovieType.TopRated:
          if (movieStates.topRated.response.results.length === 0 || page !== movieStates.topRated.response.page) {
            dispatch(fetchTopRatedMovies(page));
          }
          break;
        case MovieType.Upcoming:
          if (movieStates.upcoming.response.results.length === 0 || page !== movieStates.upcoming.response.page) {
            dispatch(fetchUpcomingMovies(page));
          }
          break;
        case MovieType.Trending:
          if (movieStates.trending.response.results.length === 0 || page !== movieStates.trending.response.page) {
            dispatch(fetchTrendingMovies(page));
          }
          break;
        case MovieType.ByKeyword:
          if (movieStates.byKeyword.response.results.length === 0 || page !== movieStates.byKeyword.response.page) {
            dispatch(fetchMoviesByKeyword(keywordId ?? ''));
          }
          break;
        default:
          break;
      }
    };

    fetchMovies();
  }, [dispatch, movieType, page, keywordId, movieStates]);

  const getCurrentMovieState = () => {
    switch (movieType) {
      case MovieType.Popular:
        return movieStates.popular;
      case MovieType.NowPlaying:
        return movieStates.nowPlaying;
      case MovieType.TopRated:
        return movieStates.topRated;
      case MovieType.Upcoming:
        return movieStates.upcoming;
      case MovieType.Trending:
        return movieStates.trending;
      case MovieType.ByKeyword:
        return movieStates.byKeyword;
      default:
        return {
          response: { results: [], page: 1, total_pages: 1 },
          loading: false,
          error: null,
        };
    }
  };

  const { response, loading, error } = getCurrentMovieState();

  return {
    media: response.results,
    loading,
    error,
    currentPage: response.page,
    totalPages: response.total_pages,
  };
};

export default useMovies;
