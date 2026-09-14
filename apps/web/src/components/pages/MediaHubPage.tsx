import { format, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { routes } from '@/lib/routes';
import { rotatingPick } from '@/lib/site';
import { discover, getCategory, getGenres } from '@/lib/tmdb/api';
import { tmdbImage } from '@/lib/tmdb/images';
import type { MediaKind } from '@/lib/tmdb/types';
import { Backdrop } from '@/components/layout/Backdrop';
import { FeaturedGenres, GenreChips } from '@/components/media/GenreSections';
import { MediaRail } from '@/components/media/MediaRail';

/** Landing page for /movies and /tv-shows. */
export async function MediaHubPage({ kind, lang }: { kind: MediaKind; lang: Locale }) {
  const isMovie = kind === 'movie';
  const [t, genres, trending, popular, topRated, extra] = await Promise.all([
    getDictionary(lang),
    getGenres(kind, lang),
    getCategory(kind, 'trending', lang),
    getCategory(kind, 'popular', lang),
    getCategory(kind, 'top-rated', lang),
    getCategory(kind, isMovie ? 'now-playing' : 'on-the-air', lang),
  ]);
  const upcoming = isMovie ? await getCategory('movie', 'upcoming', lang) : null;

  const featured = rotatingPick(genres, 5, isMovie ? 0 : 3);
  const [byGenreA, byGenreB, byGenreC] = await Promise.all(
    featured.slice(0, 3).map((genre) => discover(kind, lang, { genres: [genre.id] })),
  );
  const genreLabel = isMovie ? t.moviesOfGenre : t.tvShowsOfGenre;

  const genreRail = (index: number, data: typeof byGenreA | undefined) =>
    featured[index] && data ? (
      <MediaRail
        title={format(genreLabel, { genre: featured[index].name })}
        items={data.results}
        lang={lang}
        href={routes.genre(lang, kind, featured[index].id, featured[index].name)}
        viewMoreLabel={t.viewAll}
      />
    ) : null;

  return (
    <>
      <Backdrop src={tmdbImage(trending.results[0]?.backdrop_path, 'w1280')} />
      <h1 className="h1-guru animate-fade-in pt-6 pb-6 text-center uppercase">{isMovie ? t.movies : t.tvShows}</h1>

      <GenreChips title={t.genres} genres={genres} kind={kind} lang={lang} />

      <MediaRail
        title={isMovie ? t.trendingMovies : t.trendingTvShows}
        items={trending.results}
        lang={lang}
        href={routes.category(lang, kind, 'trending')}
        viewMoreLabel={t.viewAll}
      />
      {genreRail(0, byGenreA)}
      <FeaturedGenres title={t.featuredGenres} genres={featured} kind={kind} lang={lang} />
      <MediaRail
        title={isMovie ? t.nowPlayingMovies : t.onTheAirTvShows}
        items={extra.results}
        lang={lang}
        href={routes.category(lang, kind, isMovie ? 'now-playing' : 'on-the-air')}
        viewMoreLabel={t.viewAll}
      />
      {genreRail(1, byGenreB)}
      <MediaRail
        title={isMovie ? t.popularMovies : t.popularTvShows}
        items={popular.results}
        lang={lang}
        href={routes.category(lang, kind, 'popular')}
        viewMoreLabel={t.viewAll}
      />
      {genreRail(2, byGenreC)}
      <MediaRail
        title={isMovie ? t.topRatedMovies : t.topRatedTvShows}
        items={topRated.results}
        lang={lang}
        href={routes.category(lang, kind, 'top-rated')}
        viewMoreLabel={t.viewAll}
      />
      {upcoming && (
        <MediaRail
          title={t.upcomingMovies}
          items={upcoming.results}
          lang={lang}
          href={routes.category(lang, 'movie', 'upcoming')}
          viewMoreLabel={t.viewAll}
        />
      )}
    </>
  );
}
