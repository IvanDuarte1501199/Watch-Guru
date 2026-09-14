'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ListVideo, Star } from 'lucide-react';
import type { LibraryEntry, LibraryStatus, TitleInfo } from '@/lib/api';
import { format } from '@/lib/i18n/config';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import { routes } from '@/lib/routes';
import { useSession } from '@/lib/auth-client';
import type { MediaKind } from '@/lib/tmdb/types';
import { ListsManager } from '@/components/lists/ListsManager';
import { Loader } from '@/components/ui/Loader';
import { CafecitoButton } from '@/components/support/CafecitoButton';
import { CAFECITO_USER } from '@/lib/site';
import { LibraryCard } from './LibraryCard';
import { useLibraryIndex } from './LibraryIndexProvider';
import { statusOptions } from './statusOptions';

type Tab = LibraryStatus | 'rated' | 'lists';
type Sort = 'recent' | 'title' | 'rating' | 'release';

interface Toast {
  message: string;
  undo?: () => void;
}

const TAB_STORAGE_KEY = 'watchguru:my-list-tab';

const infoOf = (entry: LibraryEntry): TitleInfo => ({
  mediaType: entry.mediaType,
  tmdbId: entry.tmdbId,
  title: entry.title,
  posterPath: entry.posterPath,
  releaseDate: entry.releaseDate,
  genreIds: entry.genreIds,
});

export function MyLibrary() {
  const { lang, t } = useI18n();
  const { isPending } = useSession();
  const library = useLibraryIndex();
  const [tab, setTab] = useState<Tab>('watchlist');
  const [kind, setKind] = useState<MediaKind | 'all'>('all');
  const [sort, setSort] = useState<Sort>('recent');
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  // Remember the last tab and always start from fresh data.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(TAB_STORAGE_KEY) as Tab | null;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring a browser-only preference
      if (saved) setTab(saved);
    } catch {
      // Storage unavailable: keep the default tab.
    }
  }, []);

  const refresh = library?.refresh;
  useEffect(() => {
    void refresh?.();
  }, [refresh]);

  const entries = useMemo(() => [...(library?.entries.values() ?? [])], [library?.entries]);

  const counts = useMemo(
    () => ({
      watchlist: entries.filter((entry) => entry.status === 'watchlist').length,
      watching: entries.filter((entry) => entry.status === 'watching').length,
      watched: entries.filter((entry) => entry.status === 'watched').length,
      rated: entries.filter((entry) => entry.rating !== null).length,
    }),
    [entries],
  );

  const visible = useMemo(() => {
    const filtered = entries.filter(
      (entry) =>
        (tab === 'rated' ? entry.rating !== null : entry.status === tab) && (kind === 'all' || entry.mediaType === kind),
    );
    const collator = new Intl.Collator(lang);
    return filtered.sort((a, b) => {
      switch (sort) {
        case 'title':
          return collator.compare(a.title, b.title);
        case 'rating':
          return (b.rating ?? 0) - (a.rating ?? 0);
        case 'release':
          return (b.releaseDate ?? '').localeCompare(a.releaseDate ?? '');
        default:
          return b.updatedAt.localeCompare(a.updatedAt);
      }
    });
  }, [entries, tab, kind, sort, lang]);

  if (isPending || !library) return <Loader label={t.loading} />;

  if (!library.signedIn) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <p className="p-guru">{t.loginToSeeList}</p>
        <Link href={routes.login(lang, routes.myList(lang))} className="rounded-lg bg-secondary px-5 py-2 font-bold text-slate-950">
          {t.login}
        </Link>
      </div>
    );
  }

  const showToast = (next: Toast) => {
    window.clearTimeout(toastTimer.current);
    setToast(next);
    toastTimer.current = window.setTimeout(() => setToast(null), 5000);
  };

  const selectTab = (next: Tab) => {
    setTab(next);
    try {
      window.localStorage.setItem(TAB_STORAGE_KEY, next);
    } catch {
      // Not critical.
    }
  };

  const options = statusOptions(t);

  const changeStatus = (entry: LibraryEntry, status: LibraryStatus | null) => {
    const previous = { status: entry.status, rating: entry.rating };
    library.update(infoOf(entry), { status }).catch(() => undefined);
    showToast({
      message: status ? format(t.movedTo, { status: options.find((o) => o.value === status)!.label }) : t.removedFromLibrary,
      undo: () => library.update(infoOf(entry), previous).catch(() => undefined),
    });
  };

  const remove = (entry: LibraryEntry) => {
    const previous = { status: entry.status, rating: entry.rating };
    library.update(infoOf(entry), { status: null, rating: null }).catch(() => undefined);
    showToast({
      message: t.removedFromLibrary,
      undo: () => library.update(infoOf(entry), previous).catch(() => undefined),
    });
  };

  const changeRating = (entry: LibraryEntry, rating: number | null) => {
    const previous = entry.rating;
    library.update(infoOf(entry), { rating }).catch(() => undefined);
    if (rating) {
      showToast({
        message: format(t.ratedToast, { stars: (rating / 2).toFixed(1) }),
        undo: () => library.update(infoOf(entry), { rating: previous }).catch(() => undefined),
      });
    }
  };

  const tabs: { id: Tab; label: string; icon: typeof Star; count?: number }[] = [
    ...options.map((option) => ({ id: option.value as Tab, label: option.label, icon: option.icon, count: counts[option.value] })),
    { id: 'rated', label: t.rated, icon: Star, count: counts.rated },
    { id: 'lists', label: t.myLists, icon: ListVideo },
  ];

  const emptyMessage = { watchlist: t.emptyWatchlist, watching: t.emptyWatching, watched: t.emptyWatched, rated: t.emptyRated };

  return (
    <section className="animate-fade-in-up pb-16">
      <h1 className="h1-guru pt-4 pb-6 text-center md:pt-8">{t.myList}</h1>

      {/* Sticky tab bar so switching sections never needs scrolling back up. */}
      <div className="sticky top-16 z-20 -mx-4 mb-6 border-b border-slate-800/60 bg-primary/90 px-4 py-3 backdrop-blur-lg md:mx-0 md:rounded-2xl md:border md:px-3">
        <div className="no-scrollbar flex gap-2 overflow-x-auto md:justify-center" role="tablist">
          {tabs.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => selectTab(id)}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition ${
                tab === id
                  ? 'border-secondary bg-secondary text-slate-950'
                  : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-secondary'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
              {count !== undefined && (
                <span className={`rounded-full px-1.5 text-xs ${tab === id ? 'bg-slate-950/20' : 'bg-slate-800'}`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {tab === 'lists' ? (
        <ListsManager />
      ) : (
        <>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex rounded-xl border border-slate-800 bg-slate-900/60 p-0.5" role="group">
              {(['all', 'movie', 'tv'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={kind === value}
                  onClick={() => setKind(value)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    kind === value ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {value === 'all' ? t.filterAll : value === 'movie' ? t.movies : t.tvShows}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              {t.sortLabel}
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as Sort)}
                className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-white focus:border-secondary focus:outline-none"
              >
                <option value="recent">{t.sortRecent}</option>
                <option value="title">{t.sortTitle}</option>
                <option value="rating">{t.sortMyRating}</option>
                <option value="release">{t.sortRelease}</option>
              </select>
            </label>
          </div>

          {!library.loaded ? (
            <Loader label={t.loading} />
          ) : visible.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <p className="p-guru max-w-md">{emptyMessage[tab]}</p>
              <Link href={routes.list(lang, 'movie')} className="font-semibold text-secondary hover:underline">
                {t.exploreCta} &rarr;
              </Link>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {visible.map((entry) => (
                <li key={`${entry.mediaType}-${entry.tmdbId}`} className="animate-fade-in">
                  <LibraryCard
                    entry={entry}
                    onStatus={(status) => changeStatus(entry, status)}
                    onRate={(rating) => changeRating(entry, rating)}
                    onRemove={() => remove(entry)}
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {CAFECITO_USER && (
        <div className="mt-12 flex flex-col items-center gap-3 text-center text-sm text-slate-400">
          <p>{t.supportCafecitoHint}</p>
          <CafecitoButton label={t.supportCafecito} />
        </div>
      )}

      {toast && (
        <div
          role="status"
          className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md animate-fade-in-up items-center justify-between gap-4 rounded-xl border border-slate-700 bg-slate-900/95 px-4 py-3 text-sm text-white shadow-2xl backdrop-blur-lg"
        >
          <span>{toast.message}</span>
          {toast.undo && (
            <button
              type="button"
              onClick={() => {
                toast.undo?.();
                setToast(null);
              }}
              className="shrink-0 font-bold text-secondary hover:underline"
            >
              {t.undo}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
