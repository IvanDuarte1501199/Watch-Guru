import React, { useEffect } from 'react';
import { Layout } from '@components/Layout';
import { GenericList } from '@components/common/GenericList';
import { MovieType } from '@appTypes/movies/movieProps';
import useMovies from '@hooks/movies/useMovies';
import useTvShows from '@hooks/tv/useTvShows';
import { TvShowType } from '@appTypes/tv/tvProps';
import useTrendingAll from '@hooks/useTrending';
import SuggestBox from '@components/SuggestBox';
import { MainTitle } from '@components/common/MainTitle';

const Home: React.FC = () => {
  const {
    trendingItems: trending,
  } = useTrendingAll();
  const {
    tvShows: trendingTv,
  } = useTvShows(TvShowType.Trending);
  const {
    movies: trendingMovies,
  } = useMovies({ movieType: MovieType.Trending });
  const {
    tvShows: airingToday,
  } = useTvShows(TvShowType.AiringToday);
  const {
    movies: upcomingMovies,
  } = useMovies({ movieType: MovieType.Upcoming });

  return (
    <Layout className='mb-4 md:mb-8'>
      <MainTitle>Welcome to your next binge-worthy recommendation!</MainTitle>

      {/*  <h2 className='h2-guru mb-12 text-center'>Suggest me a random movie or tv show</h2> */}
      <section className='flex flex-col md:flex-row align-middle justify-center gap-10 mb-12 '>
        <SuggestBox placeholder='Random Movie suggest' icon='movie' href='/random/movie' />
        <SuggestBox placeholder='Random Tv Show suggest' icon='tv-shows' href='/random/tv-show' />
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
