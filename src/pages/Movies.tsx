import React from 'react';
import { Layout } from '@components/Layout';
import { GenericList } from '@components/common/GenericList';
import useGenres from '@hooks/useGenres';
import useMovies from '@hooks/movies/useMovies';
import { MainTitle } from '@components/common/MainTitle';
import GenresSection from '@sections/GenresSection';
import FeaturedGenresSection from '@sections/FeaturedGenresSection';
import { MovieType } from '@appTypes/movies/movieProps';

const Movies: React.FC = () => {
  const {
    movies: trendingMovies,
    loading: trendingMoviesLoading,
    error: trendingMoviesError,
  } = useMovies(MovieType.Trending);
  const {
    movies: nowPlayingMovies,
    loading: nowPlayingMoviesLoading,
    error: nowPlayingMoviesError,
  } = useMovies(MovieType.NowPlaying);
  const {
    movies: popularMovies,
    loading: popularMoviesLoading,
    error: popularMoviesError,
  } = useMovies(MovieType.Popular);
  const {
    movies: topRatedMovies,
    loading: topRatedMoviesLoading,
    error: topRatedMoviesError,
  } = useMovies(MovieType.TopRated);
  const {
    movies: upcomingMovies,
    loading: upcomingMoviesLoading,
    error: upcomingMoviesError,
  } = useMovies(MovieType.Upcoming);

  const {
    moviesGenres,
    loading: genresLoading,
    error: genresError,
  } = useGenres();

  return (
    <Layout className='mb-4 md:mb-10'>
      <MainTitle>MOVIES</MainTitle>

      {/* movies genres */}
      <GenresSection genres={moviesGenres} />

      {/* trending tv shows */}
      {trendingMovies && trendingMovies.length > 0 && (
        <GenericList title="Trending Movies" genericList={trendingMovies} />
      )}

      {/* now playing movies */}
      {nowPlayingMovies && nowPlayingMovies.length > 0 && (
        <GenericList
          title="Now Playing Movies"
          genericList={nowPlayingMovies}
        />
      )}

      {/* <FeaturedGenresSection /> */}

      {/* popular movies */}
      {popularMovies && popularMovies.length > 0 && (
        <GenericList title="Popular Movies" genericList={popularMovies} />
      )}

      {/* top rated movies */}
      {topRatedMovies && topRatedMovies.length > 0 && (
        <GenericList title="Top Rated Movies" genericList={topRatedMovies} />
      )}

      {/* upcoming movies */}
      {upcomingMovies && upcomingMovies.length > 0 && (
        <GenericList title="Upcoming Movies" genericList={upcomingMovies} />
      )}
    </Layout>
  );
};

export default Movies;
