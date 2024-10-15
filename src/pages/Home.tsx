import React from 'react';
import { Layout } from '@components/Layout';
import { GenericList } from '@components/common/GenericList';
import { MovieType } from '@appTypes/movies/movieProps';
import useMovies from '@hooks/movies/useMovies';
import useTvShows from '@hooks/tv/useTvShows';
import { TvShowType } from '@appTypes/tv/tvProps';
import useTrendingAll from '@hooks/useTrending';
import SuggestBox from '@components/SuggestBox';
import { Fade } from 'react-awesome-reveal';
import { MainTitle } from '@components/common/MainTitle';

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
    <Layout className='mb-4 md:mb-10'>
      <MainTitle>Welcome to your next binge-worthy recommendation!</MainTitle>


      {/*  <h2 className='h2-guru mb-12 text-center'>Suggest me a random movie or tv show</h2> */}

      {/* TODO: Add a random movie or tv show */}
      <p className='text-white text-center pb-2'>Currently in develop</p>
      <section className='flex flex-col md:flex-row align-middle justify-center gap-10 mb-12 '>
        <SuggestBox placeholder='Random Movie recommendation' icon='movie' />
        <SuggestBox placeholder='Random Tv Show recommendation' icon='tv-shows' />
      </section>

      {/* trending all */}
      {trending && trending.length > 0 && (
        <GenericList
          title="Trending Tv Shows and Movies"
          genericList={trending}
        />
      )}

      {/* trending tv shows */}
      {trendingTv && trendingTv.length > 0 && (
        <GenericList title="Trending Tv Shows" genericList={trendingTv} />
      )}

      {/* tendring movies */}
      {trendingMovies && trendingMovies.length > 0 && (
        <GenericList title="Trending Movies" genericList={trendingMovies} />
      )}

      {/* airing today */}
      {airingToday && airingToday.length > 0 && (
        <GenericList title="Airing Today" genericList={airingToday} />
      )}

      {/* upcoming movies */}
      {upcomingMovies && upcomingMovies.length > 0 && (
        <GenericList title="Upcoming Movies" genericList={upcomingMovies} />
      )}
    </Layout>
  );
};

export default Home;
