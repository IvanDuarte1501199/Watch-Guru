import React from 'react';
import { Layout } from '@components/Layout';
import { GenericList } from '@components/common/GenericList';
import { MovieType } from '@appTypes/movies/movieProps';
import useMovies from '@hooks/movies/useMovies';
import useTvShows from '@hooks/tv/useTvShows';
import { TvShowType } from '@appTypes/tv/tvProps';
import useMedia from '@hooks/useMedia';
import SuggestBox from '@components/SuggestBox';
import { MainTitle } from '@components/common/MainTitle';
import { MediaTypes } from '@appTypes/common/media';

const Home: React.FC = () => {
  const {
    media: trending,
  } = useMedia({ mediaType: MediaTypes.Trending });
  const {
    media: trendingTv,
  } = useTvShows({ tvShowType: TvShowType.Trending });
  const {
    media: trendingMovies,
  } = useMovies({ movieType: MovieType.Trending });
  const {
    media: airingToday,
  } = useTvShows({ tvShowType: TvShowType.AiringToday });
  const {
    media: upcomingMovies,
  } = useMovies({ movieType: MovieType.Upcoming });

  return (
    <Layout className='mb-4 md:mb-8'>
      <MainTitle>Welcome to your next binge-worthy recommendation!</MainTitle>

      <h2 className='h2-guru mb-4 text-center'>Suggest me a random movie or tv show</h2>
      <section className='flex flex-col md:flex-row align-middle justify-center gap-10 mb-12 '>
        <SuggestBox placeholder='Random MOVIE suggest' icon='movie' href='/random/movie' />
        <SuggestBox placeholder='Random TV SHOW suggest' icon='tv-shows' href='/random/tv-show' />
      </section>


      {/* trending all */}
      {trending && trending.length > 0 && (
        <GenericList
          title="Trending Movies and Tv Shows"
          genericList={trending}
          showViewMore href="/trending"
        />
      )}

      {/* trending tv shows */}
      {trendingTv && trendingTv.length > 0 && (
        <GenericList title="Trending Tv Shows" genericList={trendingTv} showViewMore href="/tv-shows/trending" />
      )}

      {/* tendring movies */}
      {trendingMovies && trendingMovies.length > 0 && (
        <GenericList title="Trending Movies" genericList={trendingMovies} showViewMore href="/movies/trending" />
      )}

      {/* airing today */}
      {airingToday && airingToday.length > 0 && (
        <GenericList title="Airing Today" genericList={airingToday} showViewMore href="/tv-shows/airing-today" />
      )}

      {/* upcoming movies */}
      {upcomingMovies && upcomingMovies.length > 0 && (
        <GenericList title="Upcoming Movies" genericList={upcomingMovies} showViewMore href="/movies/upcoming" />
      )}
    </Layout>
  );
};

export default Home;
