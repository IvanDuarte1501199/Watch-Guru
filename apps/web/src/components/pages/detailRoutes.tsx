import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { streamingProviderNames } from '@/lib/availability';
import { defaultWatchRegion, format, hasLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { parseIdParam, routes } from '@/lib/routes';
import { pageMetadata, summarize } from '@/lib/seo';
import { getMovie, getTvShow } from '@/lib/tmdb/api';
import { tmdbImage } from '@/lib/tmdb/images';
import type { MediaDetail, MediaKind } from '@/lib/tmdb/types';
import { MediaDetailView } from './MediaDetailView';

type DetailParams = Promise<{ lang: string; id: string }>;

export async function loadMedia(kind: MediaKind, id: number, lang: Locale): Promise<MediaDetail | null> {
  return kind === 'movie' ? getMovie(id, lang) : getTvShow(id, lang);
}

/** Loads the title and redirects `/movie/550` or an outdated slug to the canonical URL. */
export async function resolveDetail(kind: MediaKind, params: DetailParams, suffix = '') {
  const { lang, id } = await params;
  if (!hasLocale(lang)) notFound();
  const mediaId = parseIdParam(id);
  if (mediaId === null) notFound();

  const media = await loadMedia(kind, mediaId, lang);
  if (!media) notFound();

  const canonical = routes.media(lang, kind, media.id, media.title);
  if (canonical.split('/').pop() !== id) permanentRedirect(`${canonical}${suffix}`);
  return { lang, media, canonical };
}

export async function detailMetadata(kind: MediaKind, params: DetailParams): Promise<Metadata> {
  const { lang, media, canonical } = await resolveDetail(kind, params);
  const t = await getDictionary(lang);
  const year = media.release_date?.slice(0, 4);

  // Lead with where to watch: it's what most people searching a title want.
  const providers = streamingProviderNames(media.providers, defaultWatchRegion[lang]).slice(0, 3);
  const description = summarize(
    [providers.length ? `${media.title}: ${providers.join(', ')}.` : '', media.overview].filter(Boolean).join(' '),
  );

  return pageMetadata({
    lang,
    path: canonical.slice(lang.length + 1),
    alternatePath: `/${kind === 'movie' ? 'movie' : 'tv-show'}/${media.id}`,
    title: year
      ? format(t.detailMetaTitle, { title: media.title, year })
      : format(t.detailMetaTitleNoYear, { title: media.title }),
    description,
    image: tmdbImage(media.backdrop_path, 'w1280') ?? tmdbImage(media.poster_path, 'w780'),
  });
}

export async function renderDetail(kind: MediaKind, params: DetailParams) {
  const { lang, media } = await resolveDetail(kind, params);
  return <MediaDetailView media={media} lang={lang} />;
}
