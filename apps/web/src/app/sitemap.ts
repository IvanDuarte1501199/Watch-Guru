import type { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n/config';
import { routes } from '@/lib/routes';
import { SITE_URL } from '@/lib/site';
import { getCategory, getGenres, movieCategories, tvCategories } from '@/lib/tmdb/api';
import type { MediaSummary } from '@/lib/tmdb/types';

export const revalidate = 86400;

/** Static sections plus the most popular titles, so search engines find detail pages quickly. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const add = (path: string, priority: number, changeFrequency: 'daily' | 'weekly') =>
    entries.push({ url: `${SITE_URL}${path}`, changeFrequency, priority });

  for (const lang of locales) {
    add(routes.home(lang), 1, 'daily');
    add(routes.list(lang, 'movie'), 0.9, 'daily');
    add(routes.list(lang, 'tv'), 0.9, 'daily');
    add(routes.trending(lang), 0.8, 'daily');
    add(routes.match(lang), 0.8, 'weekly');
    movieCategories.forEach((category) => add(routes.category(lang, 'movie', category), 0.7, 'daily'));
    tvCategories.forEach((category) => add(routes.category(lang, 'tv', category), 0.7, 'daily'));

    const [movieGenres, tvGenres, ...lists] = await Promise.all([
      getGenres('movie', lang),
      getGenres('tv', lang),
      getCategory('movie', 'popular', lang),
      getCategory('movie', 'top-rated', lang),
      getCategory('tv', 'popular', lang),
      getCategory('tv', 'top-rated', lang),
    ]);
    movieGenres.forEach((genre) => add(routes.genre(lang, 'movie', genre.id, genre.name), 0.6, 'weekly'));
    tvGenres.forEach((genre) => add(routes.genre(lang, 'tv', genre.id, genre.name), 0.6, 'weekly'));

    const seen = new Set<string>();
    lists
      .flatMap((list) => list.results)
      .forEach((item: MediaSummary) => {
        const path = routes.media(lang, item.media_type, item.id, item.title);
        if (seen.has(path)) return;
        seen.add(path);
        add(path, 0.5, 'weekly');
      });
  }

  return entries;
}
