'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import type { Genre, MediaKind } from '@/lib/tmdb/types';

interface DiscoverFiltersProps {
  kind: MediaKind;
  genres: Genre[];
  selectedGenres: number[];
  sort: string;
  order: 'asc' | 'desc';
  sortOptions: readonly string[];
}

const sortLabelKeys: Record<string, keyof Dictionary> = {
  popularity: 'popularity',
  primary_release_date: 'releaseDate',
  first_air_date: 'releaseDate',
  vote_average: 'voteAverage',
  vote_count: 'voteCount',
  revenue: 'revenue',
};

export function DiscoverFilters({ kind, genres, selectedGenres, sort, order, sortOptions }: DiscoverFiltersProps) {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const update = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    next.delete('page');
    next.delete('q');
    startTransition(() => router.push(`${pathname}?${next.toString()}`, { scroll: false }));
  };

  const toggleGenre = (id: number) => {
    const nextGenres = selectedGenres.includes(id)
      ? selectedGenres.filter((genre) => genre !== id)
      : [...selectedGenres, id];
    update({ genres: nextGenres.join(',') || null });
  };

  const selectClass =
    'rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-secondary focus:outline-none';

  return (
    <div className={`mb-8 flex flex-col gap-6 transition-opacity ${pending ? 'opacity-60' : ''}`}>
      <div className="mx-auto flex rounded-xl border border-slate-800 bg-slate-900/80 p-1" role="tablist">
        {(['movie', 'tv'] as const).map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={kind === value}
            onClick={() => update({ type: value, genres: null, sort: null })}
            className={`rounded-lg px-5 py-2 text-base font-bold transition ${kind === value ? 'bg-secondary text-slate-950' : 'text-slate-300 hover:text-white'}`}
          >
            {value === 'movie' ? t.movies : t.tvShows}
          </button>
        ))}
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-slate-300">{t.filterByGenre}</legend>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => {
            const active = selectedGenres.includes(genre.id);
            return (
              <button
                key={genre.id}
                type="button"
                aria-pressed={active}
                onClick={() => toggleGenre(genre.id)}
                className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
                  active
                    ? 'border-secondary bg-secondary text-slate-950'
                    : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-secondary hover:text-white'
                }`}
              >
                {genre.name}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
          {t.orderBy}
          <select value={sort} onChange={(event) => update({ sort: event.target.value })} className={selectClass}>
            {sortOptions.map((option) => (
              <option key={option} value={option}>
                {t[sortLabelKeys[option]] ?? option}
              </option>
            ))}
          </select>
        </label>
        <select
          value={order}
          aria-label={t.orderBy}
          onChange={(event) => update({ order: event.target.value })}
          className={selectClass}
        >
          <option value="desc">{t.descending}</option>
          <option value="asc">{t.ascending}</option>
        </select>
        {(selectedGenres.length > 0 || sort !== 'popularity' || order !== 'desc') && (
          <button
            type="button"
            onClick={() => update({ genres: null, sort: null, order: null })}
            className="text-sm font-semibold text-secondary hover:underline"
          >
            {t.clearFilters}
          </button>
        )}
      </div>
    </div>
  );
}
