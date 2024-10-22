import React, { useEffect, useState } from 'react';
import { Layout } from '@components/Layout';
import { GenericList } from '@components/common/GenericList';
import useGenres from '@hooks/useGenres';
import useMovies from '@hooks/movies/useMovies';
import { MainTitle } from '@components/common/MainTitle';
import GenresSection from '@sections/GenresSection';
import { MovieType } from '@appTypes/movies/movieProps';
import { MovieAndTvKeywords } from '@appTypes/constants/keywords';
import useMoviesByGenreId from '@hooks/movies/useMoviesByGenreId';
import useMoviesByKeywords from '@hooks/movies/useMoviesByKeywords';
import FeaturedGenresSection from '@sections/FeaturedGenresSection';

const Movies: React.FC = () => {
  const { movies: trendingMovies } = useMovies({ movieType: MovieType.Trending });
  const { movies: nowPlayingMovies } = useMovies({ movieType: MovieType.NowPlaying });
  const { movies: popularMovies } = useMovies({ movieType: MovieType.Popular });
  const { movies: topRatedMovies } = useMovies({ movieType: MovieType.TopRated });
  const { movies: upcomingMovies } = useMovies({ movieType: MovieType.Upcoming });
  const { moviesGenres } = useGenres();

  const [randomGenres, setRandomGenres] = useState<any[]>([]);

  useEffect(() => {
    if (moviesGenres.length > 0) {
      const shuffled = [...moviesGenres].sort(() => 0.5 - Math.random());
      setRandomGenres(shuffled.slice(0, 5));
    }
  }, [moviesGenres]);

  const { movies: moviesByGenre1 } = useMoviesByGenreId({
    genreId: randomGenres[0]?.id
  });
  const { movies: moviesByGenre2 } = useMoviesByGenreId({
    genreId: randomGenres[1]?.id
  });
  const { movies: moviesByGenre3 } = useMoviesByGenreId({
    genreId: randomGenres[2]?.id
  });

  const { movies: marvelMovies } = useMoviesByKeywords({
    keywords: MovieAndTvKeywords.MARVEL,
  });


  /* this is a temporally solution to get the genre images */
  const genreColorMap: { [key: string]: string } = {
    Action: 'ff0000',
    Adventure: '00ff00',
    Animation: 'ff6600',
    Comedy: 'ffff00',
    Crime: '8b0000',
    Documentary: '2f4f4f',
    Drama: '0000ff',
    Family: 'ffb6c1',
    Fantasy: 'dda0dd',
    History: 'cd853f',
    Horror: '000000',
    Music: 'ff1493',
    Mystery: '4b0082',
    Romance: 'ff69b4',
    'Science Fiction': '4682b4',
    'TV Movie': 'ffc0cb',
    Thriller: '708090',
    War: 'a52a2a',
    Western: 'deb887',
  };

  const getGenreImageUrl = (genreName: string) => {
    const color = genreColorMap[genreName] || 'cccccc';
    return `https://fakeimg.pl/200x200/${color}/?text=%20`;
  };


  useEffect(() => {
    console.log('moviesGenres', moviesGenres);
  }, [moviesGenres]);
  return (
    <Layout className='mb-4 md:mb-8'>
      <MainTitle>MOVIES</MainTitle>

      {/* movies genres */}
      <GenresSection genres={moviesGenres} />

      {/* trending tv shows */}
      {trendingMovies && trendingMovies.length > 0 && (
        <GenericList title="Trending Movies" genericList={trendingMovies} />
      )}

      {/* moviesByGenre1 */}
      {moviesByGenre1 && moviesByGenre1.length > 0 && (
        <GenericList
          title={randomGenres[0]?.name}
          genericList={moviesByGenre1}
        />
      )}

      <FeaturedGenresSection
        genres={randomGenres.map((genre) => ({
          id: genre.id,
          name: genre.name,
          image: getGenreImageUrl(genre.name),
          path: `/genres/${genre.id}`,
        }))}
      />

      {/* marvel */}
      {marvelMovies && marvelMovies.length > 0 && (
        <GenericList
          title="Marvel Movies"
          genericList={marvelMovies}
        />
      )}

      {/* now playing movies */}
      {nowPlayingMovies && nowPlayingMovies.length > 0 && (
        <GenericList
          title="Now Playing Movies"
          genericList={nowPlayingMovies}
        />
      )}

      {/* moviesByGenre2 */}
      {moviesByGenre2 && moviesByGenre2.length > 0 && (
        <GenericList
          title={randomGenres[1]?.name}
          genericList={moviesByGenre2}
        />
      )}

      {/* popular movies */}
      {popularMovies && popularMovies.length > 0 && (
        <GenericList title="Popular Movies" genericList={popularMovies} />
      )}

      {/* moviesByGenre3 */}
      {moviesByGenre3 && moviesByGenre3.length > 0 && (
        <GenericList
          title={randomGenres[2]?.name}
          genericList={moviesByGenre3}
        />
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
