import type { MetadataRoute } from 'next';
import { getPublicLists } from '@/lib/backend';
import { listGuides } from '@/lib/guides';
import { locales } from '@/lib/i18n/config';
import { routes } from '@/lib/routes';
import { SITE_URL } from '@/lib/site';
import { getCategory, getGenres, getTrendingPeople, movieCategories, tvCategories } from '@/lib/tmdb/api';
import type { MediaKind, MediaSummary } from '@/lib/tmdb/types';

export const revalidate = 86400;

/** How many TMDB list pages (20 titles each) to include per list. */
const TITLE_PAGES = 5;
/** Titles that also get their "similar to" page listed. */
const SIMILAR_PAGES_FOR_TOP = 40;

/** Static sections, guides and the most popular titles, so search engines find detail pages quickly. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const seen = new Set<string>();
  const add = (path: string, priority: number, changeFrequency: 'daily' | 'weekly', lastModified?: string) => {
    if (seen.has(path)) return;
    seen.add(path);
    entries.push({ url: `${SITE_URL}${path}`, changeFrequency, priority, lastModified });
  };

  for (const lang of locales) {
    add(routes.home(lang), 1, 'daily');
    add(routes.list(lang, 'movie'), 0.9, 'daily');
    add(routes.list(lang, 'tv'), 0.9, 'daily');
    add(routes.guides(lang), 0.9, 'weekly');
    add(routes.trending(lang), 0.8, 'daily');
    add(routes.match(lang), 0.8, 'weekly');
    add(routes.privacy(lang), 0.2, 'weekly');
    add(routes.terms(lang), 0.2, 'weekly');
    movieCategories.forEach((category) => add(routes.category(lang, 'movie', category), 0.7, 'daily'));
    tvCategories.forEach((category) => add(routes.category(lang, 'tv', category), 0.7, 'daily'));

    const [movieGenres, tvGenres, guides, people] = await Promise.all([
      getGenres('movie', lang),
      getGenres('tv', lang),
      listGuides(lang),
      getTrendingPeople(lang),
    ]);
    guides.forEach((guide) =>
      guide.mode === 'new'
        ? add(routes.guide(lang, guide.slug), 0.8, 'daily')
        : add(routes.guide(lang, guide.slug), guide.provider && guide.genre ? 0.6 : 0.8, 'weekly'),
    );
    movieGenres.forEach((genre) => add(routes.genre(lang, 'movie', genre.id, genre.name), 0.6, 'weekly'));
    tvGenres.forEach((genre) => add(routes.genre(lang, 'tv', genre.id, genre.name), 0.6, 'weekly'));
    people.forEach((person) => add(routes.person(lang, person.id, person.name), 0.4, 'weekly'));

    const sources: [MediaKind, 'popular' | 'top-rated'][] = [
      ['movie', 'popular'],
      ['movie', 'top-rated'],
      ['tv', 'popular'],
      ['tv', 'top-rated'],
    ];
    const pages = await Promise.all(
      sources.flatMap(([kind, category]) =>
        Array.from({ length: TITLE_PAGES }, (_, index) =>
          getCategory(kind, category, lang, index + 1).catch(() => null),
        ),
      ),
    );
    const titles: MediaSummary[] = pages.flatMap((page) => page?.results ?? []);

    titles.forEach((item) => add(routes.media(lang, item.media_type, item.id, item.title), 0.5, 'weekly'));
    [...titles]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, SIMILAR_PAGES_FOR_TOP)
      .forEach((item) => add(routes.similar(lang, item.media_type, item.id, item.title), 0.4, 'weekly'));
  }

  const publicLists = await getPublicLists();
  for (const lang of locales) {
    for (const list of publicLists) add(routes.userList(lang, list.id, list.title), 0.5, 'weekly', list.updatedAt);
  }

  return entries;
}
