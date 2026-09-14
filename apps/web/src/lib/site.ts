export const SITE_NAME = 'WatchGuru';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

/** Public contact address shown on the legal pages. Optional. */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || null;

/** Cafecito username for the support button; the button is hidden when unset. */
export const CAFECITO_USER = process.env.NEXT_PUBLIC_CAFECITO_USER || null;

/** AdSense publisher id (`ca-pub-…`). Ads, ads.txt and the consent banner stay off when unset. */
export const ADSENSE_CLIENT = /^ca-pub-\d+$/.test(process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? '')
  ? process.env.NEXT_PUBLIC_ADSENSE_CLIENT!
  : null;

/** Background images bundled in /public/genres, keyed by TMDB genre id. */
const genreImages: Record<number, string> = {
  28: 'action',
  12: 'adventure',
  16: 'animation',
  35: 'comedy',
  80: 'crime',
  99: 'documentary',
  18: 'drama',
  10751: 'family',
  14: 'fantasy',
  36: 'history',
  27: 'horror',
  10402: 'music',
  9648: 'mystery',
  10749: 'romance',
  878: 'science-fiction',
  10770: 'tv-movie',
  53: 'thriller',
  10752: 'war',
  37: 'western',
  10759: 'action-&-adventure',
  10762: 'kids',
  10763: 'news',
  10764: 'reality',
  10765: 'sci-fi-&-fantasy',
  10766: 'soap',
  10767: 'talk',
  10768: 'war-&-politics',
};

export function genreImage(genreId: number): string | null {
  const file = genreImages[genreId];
  return file ? `/genres/${encodeURIComponent(file)}.jpg` : null;
}

/** Deterministic pick of `count` items that rotates every hour, so cached pages still vary. */
export function rotatingPick<T>(items: T[], count: number, salt = 0): T[] {
  if (items.length <= count) return items;
  const hour = Math.floor(Date.now() / 3_600_000) + salt;
  const start = hour % items.length;
  const step = (count - 1) * 3 < items.length ? 3 : 1;
  return Array.from({ length: count }, (_, i) => items[(start + i * step) % items.length]);
}
