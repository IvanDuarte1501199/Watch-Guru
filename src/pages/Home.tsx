import React, { useEffect, useState } from 'react';
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
import useGenres from '@hooks/useGenres';
import { MediaType } from '@appTypes/common/MediaType';
import useMediaByGenreId from '@hooks/useMediaByGenreId';

const Home: React.FC = () => {
  const {
    media: trending,
  } = useMedia({ mediaType: MediaTypes.Trending });
  const {
    media: popularMovies,
  } = useMovies({ movieType: MovieType.Popular });
  const {
    media: trendingTv,
  } = useTvShows({ tvShowType: TvShowType.Trending });
  const {
    media: topRated,
  } = useTvShows({ tvShowType: TvShowType.TopRated });
  const {
    media: upcomingMovies,
  } = useMovies({ movieType: MovieType.Upcoming });


  const { tvGenres, moviesGenres } = useGenres();

  const [randomTvShowsGenres, setRandomTvShowsGenres] = useState<any[]>([]);
  const [randomMoviesGenres, setRandomMoviesGenres] = useState<any[]>([]);

  useEffect(() => {
    if (tvGenres.length > 0) {
      const shuffled = [...tvGenres].sort(() => 0.5 - Math.random());
      setRandomTvShowsGenres(shuffled.slice(0, 2));
    }
    if (moviesGenres.length > 0) {
      const shuffled = [...moviesGenres].sort(() => 0.5 - Math.random());
      setRandomMoviesGenres(shuffled.slice(0, 2));
    }
  }, [tvGenres]);

  const { media: tvShowsByGenre1 } = useMediaByGenreId({
    genreId: randomTvShowsGenres[0]?.id,
    mediaType: MediaType.Tv
  });

  const { media: tvShowsByGenre2 } = useMediaByGenreId({
    genreId: randomTvShowsGenres[1]?.id,
    mediaType: MediaType.Tv
  });

  const { media: moviesByGenre1 } = useMediaByGenreId({
    genreId: randomMoviesGenres[0]?.id
  });

  const { media: moviesByGenre2 } = useMediaByGenreId({
    genreId: randomMoviesGenres[1]?.id
  });

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
          title="Trending movies and tv shows"
          genericList={trending}
          showViewMore href="/trending"
          viewMoreText='View more'
        />
      )}

      {/* popular movies */}
      {popularMovies && popularMovies.length > 0 && (
        <GenericList title="Popular movies" genericList={popularMovies} showViewMore href="/movies/popular" />
      )}

      {/* moviesByGenre1 */}
      {moviesByGenre1 && moviesByGenre1.length > 0 && (
        <GenericList
          title={`${randomMoviesGenres[0]?.name} movies`}
          genericList={moviesByGenre1}
          showViewMore href={`/genres/${randomMoviesGenres[0]?.id}`}
        />
      )}

      {/* trending tv shows */}
      {trendingTv && trendingTv.length > 0 && (
        <GenericList title="Trending tv shows" genericList={trendingTv} showViewMore href="/tv-shows/trending" />
      )}

      {/* tvShowsByGenre1 */}
      {tvShowsByGenre1 && tvShowsByGenre1.length > 0 && (
        <GenericList
          title={`${randomTvShowsGenres[0]?.name} tv shows`}
          genericList={tvShowsByGenre1}
          showViewMore href={`/genres/${randomTvShowsGenres[0]?.id}`}
        />
      )}

      {/* upcoming movies */}
      {upcomingMovies && upcomingMovies.length > 0 && (
        <GenericList title="Upcoming movies" genericList={upcomingMovies} showViewMore href="/movies/upcoming" />
      )}


      {/* moviesByGenre2 */}
      {moviesByGenre2 && moviesByGenre2.length > 0 && (
        <GenericList
          title={`${randomMoviesGenres[1]?.name} movies`}
          genericList={moviesByGenre2}
          showViewMore href={`/genres/${randomMoviesGenres[1]?.id}`}
        />
      )}

      {/* top rated tv show */}
      {topRated && topRated.length > 0 && (
        <GenericList title="Top rated tv shows" genericList={topRated} showViewMore href="/tv-shows/top-rated" />
      )}

      {/* tvShowsByGenre2 */}
      {tvShowsByGenre2 && tvShowsByGenre2.length > 0 && (
        <GenericList
          title={`${randomTvShowsGenres[1]?.name} tv shows`}
          genericList={tvShowsByGenre2}
          showViewMore href={`/genres/${randomTvShowsGenres[1]?.id}`}
        />
      )}

    </Layout>
  );
};

export default Home;
