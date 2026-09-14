import type { Locale } from './i18n/config';
import type { MediaKind } from './tmdb/types';

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function withSlug(id: number, name?: string): string {
  const slug = name ? slugify(name) : '';
  return slug ? `${id}-${slug}` : String(id);
}

export const mediaSegment = (kind: MediaKind) => (kind === 'movie' ? 'movie' : 'tv-show');
export const mediaListSegment = (kind: MediaKind) => (kind === 'movie' ? 'movies' : 'tv-shows');

export const routes = {
  home: (lang: Locale) => `/${lang}`,
  media: (lang: Locale, kind: MediaKind, id: number, title?: string) =>
    `/${lang}/${mediaSegment(kind)}/${withSlug(id, title)}`,
  person: (lang: Locale, id: number, name?: string) => `/${lang}/person/${withSlug(id, name)}`,
  list: (lang: Locale, kind: MediaKind) => `/${lang}/${mediaListSegment(kind)}`,
  category: (lang: Locale, kind: MediaKind, category: string) =>
    `/${lang}/${mediaListSegment(kind)}/${category}`,
  genre: (lang: Locale, kind: MediaKind, genreId: number, name?: string) =>
    `/${lang}/${mediaListSegment(kind)}/genre/${withSlug(genreId, name)}`,
  trending: (lang: Locale) => `/${lang}/trending`,
  search: (lang: Locale) => `/${lang}/search`,
  random: (lang: Locale, kind: MediaKind) => `/${lang}/random/${mediaSegment(kind)}`,
  login: (lang: Locale, next?: string) => `/${lang}/login${next ? `?next=${encodeURIComponent(next)}` : ''}`,
  signup: (lang: Locale, next?: string) => `/${lang}/signup${next ? `?next=${encodeURIComponent(next)}` : ''}`,
  myList: (lang: Locale) => `/${lang}/my-list`,
  taste: (lang: Locale) => `/${lang}/taste`,
};

/** Reads the numeric id from a `123-some-slug` route segment. */
export function parseIdParam(param: string): number | null {
  const match = /^(\d+)(?:-|$)/.exec(param);
  return match ? Number(match[1]) : null;
}
