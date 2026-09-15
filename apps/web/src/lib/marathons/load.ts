import 'server-only';
import type { Locale } from '../i18n/config';
import { getMovie, getTvShow } from '../tmdb/api';
import type { MediaDetail, MediaKind } from '../tmdb/types';
import { entryKey, type Marathon, type MarathonEntry } from './data';

/** Everything the marathon page needs about one title, flattened for the client. */
export interface MarathonItem {
  key: string;
  kind: MediaKind;
  id: number;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  overview: string;
  rating: number;
  genreIds: number[];
  /** Minutes; for series, an estimate over every episode. */
  runtime: number | null;
  seasons: number | null;
  /** 0-based position in the in-universe order. */
  chrono: number;
  era: string | null;
  arcs: string[];
  essential: boolean;
  when: string | null;
  /** Subscription services by country: `{ AR: [337, 8] }`. */
  providers: Record<string, number[]>;
}

export interface ProviderInfo {
  name: string;
  logoPath: string;
}

export interface MarathonCard {
  slug: string;
  name: string;
  tagline: string;
  accent: string;
  count: number;
  movies: number;
  series: number;
  backdropPath: string | null;
  posters: string[];
}

const ANIMATION_GENRE = 16;
const CONCURRENCY = 8;

/** Runs `task` over `items` with a small concurrency cap, so a cold cache doesn't burst TMDB. */
async function mapLimited<T, R>(items: T[], task: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await task(items[index]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, worker));
  return results;
}

function fetchDetail(item: { kind: MediaKind; id: number }, lang: Locale): Promise<MediaDetail | null> {
  // Same requests as the title pages, so both share Next's data cache.
  return (item.kind === 'movie' ? getMovie(item.id, lang) : getTvShow(item.id, lang)).catch(() => null);
}

function runtimeOf(detail: MediaDetail): number | null {
  if (detail.media_type === 'movie') return detail.runtime || null;
  if (!detail.number_of_episodes) return null;
  const known = detail.episode_run_time.filter((minutes) => minutes > 0);
  const perEpisode = known.length
    ? known.reduce((sum, minutes) => sum + minutes, 0) / known.length
    : detail.genres.some((genre) => genre.id === ANIMATION_GENRE)
      ? 24
      : 50;
  return Math.round(detail.number_of_episodes * perEpisode);
}

function toItem(entry: MarathonEntry, chrono: number, detail: MediaDetail, lang: Locale, catalog: Map<number, ProviderInfo>): MarathonItem {
  const providers: Record<string, number[]> = {};
  for (const [country, offers] of Object.entries(detail.providers)) {
    const ids = (offers.flatrate ?? []).map((provider) => {
      catalog.set(provider.provider_id, { name: provider.provider_name, logoPath: provider.logo_path });
      return provider.provider_id;
    });
    if (ids.length) providers[country] = ids;
  }

  return {
    key: entryKey(entry),
    kind: entry.kind,
    id: entry.id,
    title: detail.title,
    posterPath: detail.poster_path,
    backdropPath: detail.backdrop_path,
    releaseDate: detail.release_date || null,
    overview: detail.overview,
    rating: detail.vote_average,
    genreIds: detail.genre_ids,
    runtime: runtimeOf(detail),
    seasons: detail.media_type === 'tv' ? detail.number_of_seasons || null : null,
    chrono,
    era: entry.era ?? null,
    arcs: entry.arcs,
    essential: entry.essential,
    when: entry.when?.[lang] ?? null,
    providers,
  };
}

export async function loadMarathon(marathon: Marathon, lang: Locale) {
  const details = await mapLimited(marathon.entries, (entry) => fetchDetail(entry, lang));
  const catalog = new Map<number, ProviderInfo>();
  const items = marathon.entries.flatMap((entry, index) => {
    const detail = details[index];
    return detail ? [toItem(entry, index, detail, lang, catalog)] : [];
  });
  return { items, providers: Object.fromEntries(catalog) as Record<number, ProviderInfo> };
}

/** Light summary for hub and home cards: only the cover and poster titles are fetched. */
export async function loadMarathonCards(list: Marathon[], lang: Locale): Promise<MarathonCard[]> {
  return Promise.all(
    list.map(async (marathon) => {
      const [cover, ...posters] = await mapLimited([marathon.cover, ...marathon.posters], (key) => {
        const [kind, id] = key.split(':');
        return fetchDetail({ kind: kind as MediaKind, id: Number(id) }, lang);
      });
      const movies = marathon.entries.filter((entry) => entry.kind === 'movie').length;
      return {
        slug: marathon.slug,
        name: marathon.name[lang],
        tagline: marathon.tagline[lang],
        accent: marathon.accent,
        count: marathon.entries.length,
        movies,
        series: marathon.entries.length - movies,
        backdropPath: cover?.backdrop_path ?? null,
        posters: posters.map((detail) => detail?.poster_path).filter((path): path is string => Boolean(path)),
      };
    }),
  );
}
