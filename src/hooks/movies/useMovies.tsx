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

  const popularMovies = useSelector((state: RootState) => state.popularMovies);
  const nowPlayingMovies = useSelector((state: RootState) => state.nowPlayingMovies);
  const topRatedMovies = useSelector((state: RootState) => state.topRatedMovies);
  const upcomingMovies = useSelector((state: RootState) => state.upcomingMovies);
  const trendingMovies = useSelector((state: RootState) => state.trendingMovies);
  const moviesByKeyword = useSelector((state: RootState) => state.moviesByKeywords);

  useEffect(() => {
    const fetchMovies = () => {
      switch (movieType) {
        case MovieType.Popular:
          if (popularMovies.response.results.length === 0 || page !== popularMovies.response.page) {
            dispatch(fetchPopularMovies(page));
          }
          break;
        case MovieType.NowPlaying:
          if (nowPlayingMovies.response.results.length === 0 || page !== nowPlayingMovies.response.page) {
            dispatch(fetchNowPlayingMovies(page));
          }
          break;
        case MovieType.TopRated:
          if (topRatedMovies.response.results.length === 0 || page !== topRatedMovies.response.page) {
            dispatch(fetchTopRatedMovies(page));
          }
          break;
        case MovieType.Upcoming:
          if (upcomingMovies.response.results.length === 0 || page !== upcomingMovies.response.page) {
            dispatch(fetchUpcomingMovies(page));
          }
          break;
        case MovieType.Trending:
          if (trendingMovies.response.results.length === 0 || page !== trendingMovies.response.page) {
            dispatch(fetchTrendingMovies(page));
          }
          break;
        case MovieType.ByKeyword:
          if (moviesByKeyword.response.results.length === 0 || page !== moviesByKeyword.response.page) {
            dispatch(fetchMoviesByKeyword(keywordId ?? ''));
          }
          break;
        default:
          break;
      }
    };

    fetchMovies();
  }, [dispatch, movieType, page, keywordId, popularMovies,
    nowPlayingMovies,
    topRatedMovies,
    upcomingMovies,
    trendingMovies,
    moviesByKeyword]);

  const getCurrentMovieState = () => {
    switch (movieType) {
      case MovieType.Popular:
        return popularMovies;
      case MovieType.NowPlaying:
        return nowPlayingMovies;
      case MovieType.TopRated:
        return topRatedMovies;
      case MovieType.Upcoming:
        return upcomingMovies;
      case MovieType.Trending:
        return trendingMovies;
      case MovieType.ByKeyword:
        return moviesByKeyword;
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
