import React from 'react'
import { Layout } from '@components/Layout'
import { GenericList } from '@components/common/GenericList'
import useTrendingData from '@hooks/useTrending'
import { useTrendingMovies, useUpcomingMovies } from '@hooks/movies/useMovies'
import { useTrendingTv, useAiringToday } from '@hooks/tv/useTvShows'
import SuggestBox from '@components/SuggestBox'

const Home: React.FC = () => {
    const { trending, isLoading: trendingLoading, error: trendingError } = useTrendingData();
    const { tvShows: trendingTv, loading: tvLoading, error: tvError } = useTrendingTv();
    const { movies: trendingMovies, loading: moviesLoading, error: moviesError } = useTrendingMovies();
    const { tvShows: airingToday, loading: isLoadingAiring, error: errorAiring } = useAiringToday();
    const { movies: upcomingMovies, loading: upcomingMoviesLoading, error: upcomingMoviesError } = useUpcomingMovies();

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
            {trending && trending.length > 0 && <GenericList
                title="Trending Tv Shows and Movies"
                genericList={trending}
            />}

            {/* trending tv shows */}
            {trendingTv && trendingTv.length > 0 && <GenericList
                title="Trending Tv Shows"
                genericList={trendingTv}
            />}

            {/* tendring movies */}
            {trendingMovies && trendingMovies.length > 0 && <GenericList
                title="Trending Movies"
                genericList={trendingMovies}
            />}

            {/* airing today */}
            {airingToday && airingToday.length > 0 && <GenericList
                title="Airing Today"
                genericList={airingToday}
            />}

            {/* upcoming movies */}
            {upcomingMovies && upcomingMovies.length > 0 && <GenericList
                title="Upcoming Movies"
                genericList={upcomingMovies}
            />}



        </Layout>
    )
}

export default Home
