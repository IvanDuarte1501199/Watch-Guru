import 'server-only';
import { format, type Locale } from './i18n/config';
import type { Dictionary } from './i18n/get-dictionary';
import { slugify } from './routes';
import { getGenres } from './tmdb/api';
import type { Genre, MediaKind } from './tmdb/types';

/*
 * SEO guides: "best <genre> <movies|shows> [on <service>]" pages generated from
 * TMDB data. Slugs are localized so each language matches how people search.
 */

export interface GuideProvider {
  id: number;
  slug: string;
  name: string;
}

export const guideProviders: GuideProvider[] = [
  { id: 8, slug: 'netflix', name: 'Netflix' },
  { id: 119, slug: 'prime-video', name: 'Prime Video' },
  { id: 337, slug: 'disney-plus', name: 'Disney+' },
  { id: 1899, slug: 'max', name: 'Max' },
  { id: 350, slug: 'apple-tv-plus', name: 'Apple TV+' },
  { id: 531, slug: 'paramount-plus', name: 'Paramount+' },
];

/** Country whose catalog the guides describe, per language. */
export const guideRegion: Record<Locale, string> = { es: 'MX', en: 'US' };

/** Genres people actually search together with a streaming service. */
const providerGenres: Record<MediaKind, number[]> = {
  movie: [28, 35, 18, 27, 878, 53, 10749, 16, 99, 80],
  tv: [18, 35, 80, 10765, 16, 10759, 9648, 99],
};

/** Genres that don't make a useful "best of" list. */
const excludedGenres = new Set([10770, 10763, 10767, 10766]);

export interface Guide {
  slug: string;
  kind: MediaKind;
  genre: Genre | null;
  provider: GuideProvider | null;
}

export function guideSlug(lang: Locale, kind: MediaKind, genre: Genre | null, provider: GuideProvider | null) {
  if (lang === 'es') {
    const parts = ['mejores', kind === 'movie' ? 'peliculas' : 'series'];
    if (genre) parts.push('de', slugify(genre.name));
    if (provider) parts.push('en', provider.slug);
    return parts.join('-');
  }
  const parts = ['best'];
  if (genre) parts.push(slugify(genre.name));
  parts.push(kind === 'movie' ? 'movies' : 'tv-shows');
  if (provider) parts.push('on', provider.slug);
  return parts.join('-');
}

export async function listGuides(lang: Locale): Promise<Guide[]> {
  const guides: Guide[] = [];
  for (const kind of ['movie', 'tv'] as const) {
    const genres = (await getGenres(kind, lang)).filter((genre) => !excludedGenres.has(genre.id) && slugify(genre.name));
    for (const genre of genres) guides.push({ kind, genre, provider: null, slug: guideSlug(lang, kind, genre, null) });
    for (const provider of guideProviders) {
      guides.push({ kind, genre: null, provider, slug: guideSlug(lang, kind, null, provider) });
      for (const genre of genres.filter((item) => providerGenres[kind].includes(item.id))) {
        guides.push({ kind, genre, provider, slug: guideSlug(lang, kind, genre, provider) });
      }
    }
  }
  return guides;
}

export async function findGuide(lang: Locale, slug: string): Promise<Guide | null> {
  return (await listGuides(lang)).find((guide) => guide.slug === slug) ?? null;
}

/** Genre names read naturally mid-sentence in Spanish ("películas de terror"). */
export function genreLabel(lang: Locale, genre: Genre): string {
  return lang === 'es' ? genre.name.toLocaleLowerCase('es') : genre.name;
}

export function guideHeading(guide: Guide, lang: Locale, t: Dictionary): string {
  const values = {
    kind: guide.kind === 'movie' ? t.kindMoviesPlural : t.kindTvPlural,
    genre: guide.genre ? genreLabel(lang, guide.genre) : '',
    provider: guide.provider?.name ?? '',
  };
  if (guide.genre && guide.provider) return format(t.guideTitleGenreProvider, values);
  if (guide.provider) return format(t.guideTitleProvider, values);
  return format(t.guideTitleGenre, values);
}
