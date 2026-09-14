'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import { routes } from '@/lib/routes';
import { tmdbImage } from '@/lib/tmdb/images';
import type { SearchResult } from '@/lib/tmdb/types';

function resultHref(lang: Parameters<typeof routes.home>[0], result: SearchResult) {
  return result.kind === 'person'
    ? routes.person(lang, result.id, result.name)
    : routes.media(lang, result.media_type, result.id, result.title);
}

export function SearchBox({ autoFocus = false, onNavigate }: { autoFocus?: boolean; onNavigate?: () => void }) {
  const { lang, t } = useI18n();
  const router = useRouter();
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);

  const trimmed = query.trim();

  useEffect(() => {
    if (trimmed.length < 2) return;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}&lang=${lang}`, {
          signal: controller.signal,
        });
        if (!response.ok) return;
        const data = (await response.json()) as { results: SearchResult[] };
        setResults(data.results);
        setHighlighted(-1);
      } catch {
        // Aborted or offline: keep the previous results.
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed, lang]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const visibleResults = trimmed.length < 2 ? [] : results;

  const reset = () => {
    setQuery('');
    setResults([]);
    setOpen(false);
    onNavigate?.();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setHighlighted((index) => Math.min(index + 1, visibleResults.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlighted((index) => Math.max(index - 1, -1));
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const selected = visibleResults[highlighted];
    if (selected) {
      router.push(resultHref(lang, selected));
    } else if (trimmed) {
      router.push(`${routes.search(lang)}?q=${encodeURIComponent(trimmed)}`);
    } else {
      return;
    }
    reset();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form role="search" onSubmit={handleSubmit} className="group relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-secondary"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          autoFocus={autoFocus}
          autoComplete="off"
          aria-label={t.search}
          aria-expanded={open && visibleResults.length > 0}
          aria-controls={listId}
          role="combobox"
          placeholder={t.searchPlaceholder}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="block w-full rounded-lg border border-slate-800/80 bg-slate-900/60 py-2 pr-4 pl-10 text-sm text-white placeholder-slate-400 backdrop-blur-md transition-all duration-300 focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none"
        />
      </form>

      {open && visibleResults.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute top-12 left-0 z-50 max-h-96 w-full divide-y divide-slate-900/50 overflow-y-auto rounded-xl border border-slate-800/80 bg-slate-950/95 py-1.5 shadow-2xl backdrop-blur-lg"
        >
          {visibleResults.map((result, index) => {
            const image =
              result.kind === 'person' ? tmdbImage(result.profile_path, 'w92') : tmdbImage(result.poster_path, 'w92');
            const name = result.kind === 'person' ? result.name : result.title;
            const typeLabel = result.kind === 'person' ? t.person : result.media_type === 'tv' ? t.tvShow : t.movie;
            return (
              <li key={`${result.media_type}-${result.id}`} role="option" aria-selected={index === highlighted}>
                <Link
                  href={resultHref(lang, result)}
                  onClick={reset}
                  className={`flex items-center gap-4 p-2.5 transition-colors ${index === highlighted ? 'bg-slate-900' : 'hover:bg-slate-900'}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image ?? (result.kind === 'person' ? '/user.svg' : '/movie-primary.svg')}
                    alt=""
                    className="h-14 w-10 rounded border border-slate-800 bg-slate-800 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{name}</p>
                    <p className="mt-0.5 text-xs font-medium text-slate-400">{typeLabel}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
