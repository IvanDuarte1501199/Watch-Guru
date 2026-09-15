import type { MediaKind } from '../tmdb/types';

/** The subset of a marathon item the filters and totals work with. */
export interface ViewItem {
  key: string;
  kind: MediaKind;
  chrono: number;
  releaseDate: string | null;
  runtime: number | null;
  era: string | null;
  arcs: string[];
  essential: boolean;
  providers: Record<string, number[]>;
}

export type MarathonOrder = 'chrono' | 'release';

export interface MarathonFilters {
  order: MarathonOrder;
  kind: MediaKind | 'all';
  era: string | null;
  arc: string | null;
  essentialOnly: boolean;
  hideWatched: boolean;
}

export const defaultFilters: MarathonFilters = {
  order: 'chrono',
  kind: 'all',
  era: null,
  arc: null,
  essentialOnly: false,
  hideWatched: false,
};

/** Unreleased titles (no date yet) go last in release order. */
const releaseValue = (item: ViewItem) => item.releaseDate || '9999';

export function applyFilters<T extends ViewItem>(items: T[], filters: MarathonFilters, isWatched: (item: T) => boolean): T[] {
  return items
    .filter(
      (item) =>
        (filters.kind === 'all' || item.kind === filters.kind) &&
        (!filters.era || item.era === filters.era) &&
        (!filters.arc || item.arcs.includes(filters.arc)) &&
        (!filters.essentialOnly || item.essential) &&
        (!filters.hideWatched || !isWatched(item)),
    )
    .sort((a, b) =>
      filters.order === 'chrono'
        ? a.chrono - b.chrono
        : releaseValue(a).localeCompare(releaseValue(b)) || a.chrono - b.chrono,
    );
}

/** Era headings only help when each era forms one block in the current order. */
export function erasAreGrouped(items: ViewItem[]): boolean {
  const seen = new Set<string>();
  let previous: string | null = null;
  for (const item of items) {
    if (!item.era || item.era === previous) continue;
    if (seen.has(item.era)) return false;
    seen.add(item.era);
    previous = item.era;
  }
  return seen.size > 1;
}

export const totalMinutes = (items: ViewItem[]) => items.reduce((sum, item) => sum + (item.runtime ?? 0), 0);

/** "62 h", or "45 min" for short selections. */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  return `${Math.round(minutes / 60)} h`;
}

/** The subscription service that carries the most of `items` in `country`. */
export function topProvider(items: ViewItem[], country: string): { providerId: number; count: number } | null {
  const counts = new Map<number, number>();
  for (const item of items) {
    for (const id of item.providers[country] ?? []) counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  let best: { providerId: number; count: number } | null = null;
  for (const [providerId, count] of counts) {
    if (!best || count > best.count) best = { providerId, count };
  }
  return best;
}
