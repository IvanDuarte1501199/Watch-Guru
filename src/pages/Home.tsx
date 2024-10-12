import React from 'react';
import { Layout } from '@components/Layout';
import { GenericList } from '@components/common/GenericList';
import { MovieType } from '@appTypes/movies/movieProps';
import useMovies from '@hooks/movies/useMovies';
import useTvShows from '@hooks/tv/useTvShows';
import { TvShowType } from '@appTypes/tv/tvProps';
import useTrendingAll from '@hooks/useTrending';

const Home: React.FC = () => {
    const {
        trendingItems: trending,
        loading: trendingLoading,
        error: trendingError,
    } = useTrendingAll();
    const {
        tvShows: trendingTv,
        loading: tvLoading,
        error: tvError,
    } = useTvShows(TvShowType.Trending);
    const {
        movies: trendingMovies,
        loading: moviesLoading,
        error: moviesError,
    } = useMovies(MovieType.Trending);
    const {
        tvShows: airingToday,
        loading: isLoadingAiring,
        error: errorAiring,
    } = useTvShows(TvShowType.AiringToday);
    const {
        movies: upcomingMovies,
        loading: upcomingMoviesLoading,
        error: upcomingMoviesError,
    } = useMovies(MovieType.Upcoming);

    return (
        <Layout>
            <h1 className="h1-guru pb-6 pt-6 text-center uppercase">
                Welcome to your next binge-worthy recommendation!
            </h1>

            {/*  <h2 className='h2-guru mb-12 text-center'>Suggest me a random movie or tv show</h2> */}

            {/* TODO: Add a random movie or tv show */}
            {/* <section className='flex align-middle justify-center gap-10 mb-12'>
                <SuggestBox placeholder='Get random Movie recommendation' fromColor='blue-400' toColor='pink-800' />
                <SuggestBox placeholder='Get random Tv Show recommendation' fromColor='red-200' toColor='pink-600' />
            </section> */}

            {/* trending all */}
            {trending && trending.length > 0 && (
                <GenericList
                    title="Trending Tv Shows and Movies"
                    genericList={trending}
                />
            )}

            {/* trending tv shows */}
            {trendingTv && trendingTv.length > 0 && (
                <GenericList
                    title="Trending Tv Shows"
                    genericList={trendingTv}
                />
            )}

            {/* tendring movies */}
            {trendingMovies && trendingMovies.length > 0 && (
                <GenericList
                    title="Trending Movies"
                    genericList={trendingMovies}
                />
            )}

            {/* airing today */}
            {airingToday && airingToday.length > 0 && (
                <GenericList title="Airing Today" genericList={airingToday} />
            )}

            {/* upcoming movies */}
            {upcomingMovies && upcomingMovies.length > 0 && (
                <GenericList
                    title="Upcoming Movies"
                    genericList={upcomingMovies}
                />
            )}
        </Layout>
    );
};

export default Home;
