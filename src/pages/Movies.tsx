import React, { useEffect, useState } from 'react';
import { Layout } from '@components/common/Layout';
import { GenericList } from '@components/common/GenericList';
import useGenres from '@hooks/useGenres';
import useMovies from '@hooks/movies/useMovies';
import { MainTitle } from '@components/common/MainTitle';
import GenresSection from '@sections/GenresSection';
import { MovieType } from '@appTypes/movies/movieProps';
import useMediaByGenreId from '@hooks/useMediaByGenreId';
import FeaturedGenresSection from '@sections/FeaturedGenresSection';
import { MediaType } from '@appTypes/common/MediaType';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { translations } from '../i18n/translations';

const Movies: React.FC = () => {
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);
  const t = translations[currentLanguage];

  const { media: trendingMovies } = useMovies({ movieType: MovieType.Trending });
  const { media: nowPlayingMovies } = useMovies({ movieType: MovieType.NowPlaying });
  const { media: popularMovies } = useMovies({ movieType: MovieType.Popular });
  const { media: topRatedMovies } = useMovies({ movieType: MovieType.TopRated });
  const { media: upcomingMovies } = useMovies({ movieType: MovieType.Upcoming });
  const { moviesGenres } = useGenres();

  const [randomGenres, setRandomGenres] = useState<any[]>([]);

  useEffect(() => {
    if (moviesGenres.length > 0) {
      const shuffled = [...moviesGenres].sort(() => 0.5 - Math.random());
      setRandomGenres(shuffled.slice(0, 5));
    }
  }, [moviesGenres]);

  const { media: moviesByGenre1 } = useMediaByGenreId({
    genreId: randomGenres[0]?.id
  });
  const { media: moviesByGenre2 } = useMediaByGenreId({
    genreId: randomGenres[1]?.id
  });
  const { media: moviesByGenre3 } = useMediaByGenreId({
    genreId: randomGenres[2]?.id
  });

  /*   const { movies: marvelMovies } = useMoviesByKeywords({
      keywords: MovieAndTvKeywords.MARVEL,
    }); */

  const getGenreImageUrl = (genreId: number) => {
    const genreIdImageMap: Record<number, string> = {
      28: "action",
      12: "adventure",
      16: "animation",
      35: "comedy",
      80: "crime",
      99: "documentary",
      18: "drama",
      10751: "family",
      14: "fantasy",
      36: "history",
      27: "horror",
      10402: "music",
      9648: "mystery",
      10749: "romance",
      878: "science-fiction",
      10770: "tv-movie",
      53: "thriller",
      10752: "war",
      37: "western",
    };
    const filename = genreIdImageMap[genreId] || 'default';
    return `/genres/${filename}.jpg`;
  };

  const [backgroundImg, setBackgroundImg] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (trendingMovies.length > 0 && backgroundImg === undefined) {
      const randomIndex = Math.floor(Math.random() * trendingMovies.length);
      setBackgroundImg(`https://image.tmdb.org/t/p/original/${trendingMovies[randomIndex]?.backdrop_path}`);
    }
  }, [trendingMovies]);

  return (
    <Layout backgroundSrc={backgroundImg} className='mb-4 md:mb-8' searchType={MediaType.Movie}>
      <MainTitle>{t.movies}</MainTitle>

      {/* movies genres */}
      <GenresSection genres={moviesGenres} />

      {/* trending movies */}
      {trendingMovies && trendingMovies.length > 0 && (
        <GenericList title={t.trendingMovies} genericList={trendingMovies} showViewMore href="/movies/trending" />
      )}

      {/* moviesByGenre1 */}
      {moviesByGenre1 && moviesByGenre1.length > 0 && (
        <GenericList
          title={randomGenres[0]?.name}
          genericList={moviesByGenre1}
          showViewMore href={`/genres/${randomGenres[0]?.id}`}
        />
      )}

      <FeaturedGenresSection
        genres={randomGenres.map((genre) => ({
          id: genre.id,
          name: genre.name,
          image: getGenreImageUrl(genre.id),
          path: `/genres/${genre.id}`,
        }))}
      />

      {/* now playing movies */}
      {nowPlayingMovies && nowPlayingMovies.length > 0 && (
        <GenericList
          title={t.nowPlayingMovies}
          genericList={nowPlayingMovies}
          showViewMore href="/movies/now-playing"
        />
      )}

      {/* moviesByGenre2 */}
      {moviesByGenre2 && moviesByGenre2.length > 0 && (
        <GenericList
          title={randomGenres[1]?.name}
          genericList={moviesByGenre2}
          showViewMore href={`/genres/${randomGenres[1]?.id}`}
        />
      )}

      {/* popular movies */}
      {popularMovies && popularMovies.length > 0 && (
        <GenericList title={t.popularMovies} genericList={popularMovies} showViewMore href="/movies/popular" />
      )}

      {/* moviesByGenre3 */}
      {moviesByGenre3 && moviesByGenre3.length > 0 && (
        <GenericList
          title={randomGenres[2]?.name}
          genericList={moviesByGenre3}
          showViewMore href={`/genres/${randomGenres[2]?.id}`}
        />
      )}

      {/* top rated movies */}
      {topRatedMovies && topRatedMovies.length > 0 && (
        <GenericList title={t.topRatedMovies} genericList={topRatedMovies} showViewMore href="/movies/top-rated" />
      )}

      {/* upcoming movies */}
      {upcomingMovies && upcomingMovies.length > 0 && (
        <GenericList title={t.upcomingMovies} genericList={upcomingMovies} showViewMore href="/movies/upcoming" />
      )}

    </Layout>
  );
};

export default Movies;
