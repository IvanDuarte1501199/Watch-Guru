import { defaultWatchRegion, type Locale } from '@/lib/i18n/config';
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
import { ShowMoreGrid } from '@/components/media/ShowMoreGrid';

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

  return (
    <>
      <JsonLd data={structuredData(media, lang)} />
      <Backdrop src={tmdbImage(media.backdrop_path, 'original')} />
      <div className="animate-fade-in">
        {banner}
        <DetailHero media={media} lang={lang} t={t}>
          <WhereToWatch providers={media.providers} countryNames={countryNames} defaultCountry={defaultWatchRegion[lang]} />
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
      </div>
    </>
  );
}
