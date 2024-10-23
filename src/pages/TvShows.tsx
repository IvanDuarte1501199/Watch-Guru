import React, { useEffect, useState } from 'react';
import { Layout } from '@components/Layout';
import { GenericList } from '@components/common/GenericList';
import { MainTitle } from '@components/common/MainTitle';
import useGenres from '@hooks/useGenres';
import GenresSection from '@sections/GenresSection';
import useTvShows from '@hooks/tv/useTvShows';
import { TvShowType } from '@appTypes/tv/tvProps';
import FeaturedGenresSection from '@sections/FeaturedGenresSection';
import useMediaByGenreId from '@hooks/useMediaByGenreId';
import { MediaType } from '@appTypes/common/MediaType';

const TvShows: React.FC = () => {
  const {
    media: trendingTv,
  } = useTvShows({ tvShowType: TvShowType.Trending });
  const {
    media: popularTv,
  } = useTvShows({ tvShowType: TvShowType.Popular });
  const {
    media: topRatedTv,
  } = useTvShows({ tvShowType: TvShowType.TopRated });

  const { tvGenres } = useGenres();

  const [randomGenres, setRandomGenres] = useState<any[]>([]);

  useEffect(() => {
    if (tvGenres.length > 0) {
      const shuffled = [...tvGenres].sort(() => 0.5 - Math.random());
      setRandomGenres(shuffled.slice(0, 5));
    }
  }, [tvGenres]);

  const { media: tvShowsByGenre1 } = useMediaByGenreId({
    genreId: randomGenres[0]?.id,
    mediaType: MediaType.Tv
  });
  const { media: tvShowsByGenre2 } = useMediaByGenreId({
    genreId: randomGenres[1]?.id,
    mediaType: MediaType.Tv
  });
  const { media: tvShowsByGenre3 } = useMediaByGenreId({
    genreId: randomGenres[2]?.id,
    mediaType: MediaType.Tv
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

  return (
    <Layout className='mb-4 md:mb-8'>
      <MainTitle>TV SHOWS</MainTitle>
      <GenresSection genres={tvGenres} />

      {trendingTv && trendingTv.length > 0 && (
        <GenericList title="Trending Tv Shows" genericList={trendingTv} showViewMore href="/tv-shows/trending" />
      )}

      {/* tvShowsByGenre1 */}
      {tvShowsByGenre1 && tvShowsByGenre1.length > 0 && (
        <GenericList
          title={randomGenres[0]?.name}
          genericList={tvShowsByGenre1}
          showViewMore href={`/genres/${randomGenres[0]?.id}`}
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
      {popularTv && popularTv.length > 0 && (
        <GenericList title="Popular Tv Shows" genericList={popularTv} showViewMore href="/tv-shows/popular" />
      )}

      {/* tvShowsByGenre2 */}
      {tvShowsByGenre2 && tvShowsByGenre2.length > 0 && (
        <GenericList
          title={randomGenres[1]?.name}
          genericList={tvShowsByGenre2}
          showViewMore href={`/genres/${randomGenres[1]?.id}`}
        />
      )}

      {topRatedTv && topRatedTv.length > 0 && (
        <GenericList title="Top Rated Tv Shows" genericList={topRatedTv} showViewMore href="/tv-shows/top-rated" />
      )}

      {/* tvShowsByGenre3 */}
      {tvShowsByGenre3 && tvShowsByGenre3.length > 0 && (
        <GenericList
          title={randomGenres[2]?.name}
          genericList={tvShowsByGenre3}
          showViewMore href={`/genres/${randomGenres[2]?.id}`}
        />
      )}
    </Layout>
  );
};

export default TvShows;
