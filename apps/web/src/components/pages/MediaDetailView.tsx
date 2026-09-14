import { defaultWatchRegion, format, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { routes } from '@/lib/routes';
import { summarize } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';
import { getCountries, getSeasonEpisodes } from '@/lib/tmdb/api';
import { tmdbImage } from '@/lib/tmdb/images';
import type { MediaDetail } from '@/lib/tmdb/types';
import { JsonLd } from '@/components/JsonLd';
import { CastList } from '@/components/detail/CastList';
import { DetailHero } from '@/components/detail/DetailHero';
import { EpisodesRatingGrid } from '@/components/detail/EpisodesRatingGrid';
import { SeasonsSection } from '@/components/detail/SeasonsSection';
import { TrailerList } from '@/components/detail/TrailerList';
import { WhereToWatch } from '@/components/detail/WhereToWatch';
import { Backdrop } from '@/components/layout/Backdrop';
import { TitleActions } from '@/components/library/TitleActions';
import { TitleLibraryProvider } from '@/components/library/TitleLibraryProvider';
import { ShowMoreGrid } from '@/components/media/ShowMoreGrid';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { availabilitySentence } from '@/lib/availability';
import Link from 'next/link';

function structuredData(media: MediaDetail, lang: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': media.media_type === 'movie' ? 'Movie' : 'TVSeries',
    name: media.title,
    url: `${SITE_URL}${routes.media(lang, media.media_type, media.id, media.title)}`,
    image: tmdbImage(media.poster_path, 'w780') ?? undefined,
    description: summarize(media.overview, 300) || undefined,
    datePublished: media.release_date ?? undefined,
    genre: media.genres.map((genre) => genre.name),
    actor: media.cast.slice(0, 5).map((member) => ({ '@type': 'Person', name: member.name })),
    [media.media_type === 'movie' ? 'director' : 'creator']: media.creators.map((person) => ({
      '@type': 'Person',
      name: person.name,
      url: `${SITE_URL}${routes.person(lang, person.id, person.name)}`,
    })),
    aggregateRating:
      media.vote_count > 0
        ? { '@type': 'AggregateRating', ratingValue: media.vote_average.toFixed(1), bestRating: 10, ratingCount: media.vote_count }
        : undefined,
  };
}

interface MediaDetailViewProps {
  media: MediaDetail;
  lang: Locale;
  /** Rendered above the hero (used by the random recommendation page). */
  banner?: React.ReactNode;
}

export async function MediaDetailView({ media, lang, banner }: MediaDetailViewProps) {
  const isTv = media.media_type === 'tv';
  const [t, countries, episodes] = await Promise.all([
    getDictionary(lang),
    getCountries(lang),
    isTv ? getSeasonEpisodes(media.id, media.seasons.map((season) => season.season_number), lang) : null,
  ]);

  const countryNames = Object.fromEntries(countries.map((country) => [country.iso_3166_1, country.native_name]));
  const region = defaultWatchRegion[lang];
  const mainGenre = media.genres[0];

  return (
    <>
      <JsonLd data={structuredData(media, lang)} />
      <Backdrop src={tmdbImage(media.backdrop_path, 'w1280')} />
      <TitleLibraryProvider
        info={{
          mediaType: media.media_type,
          tmdbId: media.id,
          title: media.title,
          posterPath: media.poster_path,
          releaseDate: media.release_date,
          genreIds: media.genre_ids,
        }}
      >
        <div className="animate-fade-in">
          {banner ?? (
            <Breadcrumbs
              label={t.breadcrumb}
              items={[
                { name: t.home, href: routes.home(lang) },
                { name: isTv ? t.tvShows : t.movies, href: routes.list(lang, media.media_type) },
                ...(mainGenre
                  ? [{ name: mainGenre.name, href: routes.genre(lang, media.media_type, mainGenre.id, mainGenre.name) }]
                  : []),
                { name: media.title, href: routes.media(lang, media.media_type, media.id, media.title) },
              ]}
            />
          )}
          <DetailHero media={media} lang={lang} t={t}>
            <TitleActions />
            <p className="mb-3 max-w-2xl text-sm text-slate-300">
              {availabilitySentence(media.title, media.providers, region, countryNames[region] ?? region, t, lang)}
            </p>
            <WhereToWatch
              providers={media.providers}
              countryNames={countryNames}
              defaultCountry={region}
            />
          </DetailHero>

          {isTv && episodes && (
            <SeasonsSection
              seasons={media.seasons}
              episodes={episodes}
              ratingsGrid={<EpisodesRatingGrid seasons={media.seasons} episodes={episodes} t={t} />}
            />
          )}

          <CastList title={t.cast} cast={media.cast} lang={lang} />
          <TrailerList videos={media.videos} />
          <ShowMoreGrid title={isTv ? t.recommendedTvShows : t.recommendedMovies} items={media.recommendations} />
          {media.recommendations.length > 0 && (
            <p className="mb-12 text-center">
              <Link
                href={routes.similar(lang, media.media_type, media.id, media.title)}
                className="font-semibold text-secondary hover:underline"
              >
                {format(isTv ? t.similarTvShows : t.similarMovies, { title: media.title })} &rarr;
              </Link>
            </p>
          )}
        </div>
      </TitleLibraryProvider>
    </>
  );
}
