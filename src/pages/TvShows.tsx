import React, { useEffect, useState } from 'react';
import { Layout } from '@components/common/Layout';
import { GenericList } from '@components/common/GenericList';
import { MainTitle } from '@components/common/MainTitle';
import useGenres from '@hooks/useGenres';
import GenresSection from '@sections/GenresSection';
import useTvShows from '@hooks/tv/useTvShows';
import { TvShowType } from '@appTypes/tv/tvProps';
import FeaturedGenresSection from '@sections/FeaturedGenresSection';
import useMediaByGenreId from '@hooks/useMediaByGenreId';
import { MediaType } from '@appTypes/common/MediaType';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { translations } from '../i18n/translations';

const TvShows: React.FC = () => {
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);
  const t = translations[currentLanguage];

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

  const getGenreImageUrl = (genreId: number) => {
    const genreIdImageMap: Record<number, string> = {
      10759: "action-&-adventure",
      16: "animation",
      35: "comedy",
      80: "crime",
      99: "documentary",
      18: "drama",
      10751: "family",
      10762: "kids",
      9648: "mystery",
      10763: "news",
      10764: "reality",
      10765: "sci-fi-&-fantasy",
      10766: "soap",
      10767: "talk",
      10768: "war-&-politics",
      37: "western",
    };
    const filename = genreIdImageMap[genreId] || 'default';
    return `/genres/${filename}.jpg`;
  };

  const [backgroundImg, setBackgroundImg] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (trendingTv.length > 0 && backgroundImg === undefined) {
      const randomIndex = Math.floor(Math.random() * trendingTv.length);
      setBackgroundImg(`https://image.tmdb.org/t/p/original/${trendingTv[randomIndex]?.backdrop_path}`);
    }
  }, [trendingTv]);


  return (
    <Layout backgroundSrc={backgroundImg} className='mb-4 md:mb-8' searchType={MediaType.Tv}>
      <MainTitle>{t.tvShows}</MainTitle>
      <GenresSection genres={tvGenres} />

      {trendingTv && trendingTv.length > 0 && (
        <GenericList title={t.trendingTvShows} genericList={trendingTv} showViewMore href="/tv-shows/trending" />
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
          image: getGenreImageUrl(genre.id),
          path: `/genres/${genre.id}`,
        }))}
      />
      {popularTv && popularTv.length > 0 && (
        <GenericList title={t.popularTvShows} genericList={popularTv} showViewMore href="/tv-shows/popular" />
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
        <GenericList title={t.topRatedTvShows} genericList={topRatedTv} showViewMore href="/tv-shows/top-rated" />
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
