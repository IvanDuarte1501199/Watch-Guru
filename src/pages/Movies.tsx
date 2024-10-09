import React from 'react'
import { Layout } from '@components/Layout'
import { GenericList } from '@components/common/GenericList'
import useGenres from '@hooks/useGenres'
import { useTrendingMovies, useNowPlayingMovies, usePopularMovies, useTopRatedMovies, useUpcomingMovies } from '@hooks/movies/useMovies'
import { MainTitle } from '@components/common/MainTitle'
import GenresSection from '@sections/GenresSection'
import FeaturedGenresSection from '@sections/FeaturedGenresSection'

const Movies: React.FC = () => {
    const { movies: trendingMovies, loading: trendingMoviesLoading, error: trendingMoviesError } = useTrendingMovies();
    const { movies: nowPlayingMovies, loading: nowPlayingMoviesLoading, error: nowPlayingMoviesError } = useNowPlayingMovies();
    const { movies: popularMovies, loading: popularMoviesLoading, error: popularMoviesError } = usePopularMovies();
    const { movies: topRatedMovies, loading: topRatedMoviesLoading, error: topRatedMoviesError } = useTopRatedMovies();
    const { movies: upcomingMovies, loading: upcomingMoviesLoading, error: upcomingMoviesError } = useUpcomingMovies();

    const { moviesGenres, isLoading: genresLoading, error: genresError } = useGenres();

    return (
        <Layout>
            <MainTitle>MOVIES</MainTitle>

            {/* movies genres */}
            <GenresSection genres={moviesGenres} />

            {/* trending tv shows */}
            {trendingMovies && trendingMovies.length > 0 && <GenericList
                title="Trending Movies"
                genericList={trendingMovies}
            />}

            {/* now playing movies */}
            {nowPlayingMovies && nowPlayingMovies.length > 0 && <GenericList
                title="Now Playing Movies"
                genericList={nowPlayingMovies}
            />}

            <FeaturedGenresSection />

            {/* popular movies */}
            {popularMovies && popularMovies.length > 0 && <GenericList
                title="Popular Movies"
                genericList={popularMovies}
            />}

            {/* top rated movies */}
            {topRatedMovies && topRatedMovies.length > 0 && <GenericList
                title="Top Rated Movies"
                genericList={topRatedMovies}
            />}

            {/* upcoming movies */}
            {upcomingMovies && upcomingMovies.length > 0 && <GenericList
                title="Upcoming Movies"
                genericList={upcomingMovies}
            />}
        </Layout>
    )
}

export default Movies;