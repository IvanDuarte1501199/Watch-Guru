'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, type LibraryEntry, type LibraryStatus, type LibrarySummary } from '@/lib/api';
import { useSession } from '@/lib/auth-client';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import { routes } from '@/lib/routes';
import type { MediaSummary } from '@/lib/tmdb/types';
import { MediaGrid } from '@/components/media/MediaGrid';
import { ListsManager } from '@/components/lists/ListsManager';
import { Loader } from '@/components/ui/Loader';

type Tab = LibraryStatus | 'rated' | 'lists';

/** Library entries rendered with the regular media cards; the badge shows the user's own rating. */
function toMediaSummary(entry: LibraryEntry): MediaSummary {
  return {
    id: entry.tmdbId,
    media_type: entry.mediaType,
    title: entry.title,
    original_title: entry.title,
    overview: '',
    poster_path: entry.posterPath,
    backdrop_path: null,
    vote_average: entry.rating ?? 0,
    vote_count: 0,
    release_date: entry.releaseDate,
    genre_ids: entry.genreIds,
    popularity: 0,
  };
}

export function MyLibrary() {
  const { lang, t } = useI18n();
  const { data: session, isPending } = useSession();
  const [tab, setTab] = useState<Tab>('watchlist');
  const [summary, setSummary] = useState<LibrarySummary | null>(null);
  const [items, setItems] = useState<{ tab: Tab; entries: LibraryEntry[] } | null>(null);
  const signedIn = Boolean(session);

  useEffect(() => {
    if (!signedIn) return;
    api.librarySummary().then(setSummary).catch(() => undefined);
  }, [signedIn]);

  useEffect(() => {
    if (!signedIn || tab === 'lists') return;
    let cancelled = false;
    api
      .library(tab as LibraryStatus | 'rated')
      .then((entries) => !cancelled && setItems({ tab, entries }))
      .catch(() => !cancelled && setItems({ tab, entries: [] }));
    return () => {
      cancelled = true;
    };
  }, [signedIn, tab]);

  if (isPending) return <Loader label={t.loading} />;

  if (!signedIn) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <p className="p-guru">{t.loginToSeeList}</p>
        <Link href={routes.login(lang, routes.myList(lang))} className="rounded-lg bg-secondary px-5 py-2 font-bold text-slate-950">
          {t.login}
        </Link>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'watchlist', label: t.statusWatchlist },
    { id: 'watching', label: t.statusWatching },
    { id: 'watched', label: t.statusWatched },
    { id: 'rated', label: t.rated },
    { id: 'lists', label: t.myLists },
  ];
  const current = items?.tab === tab ? items.entries : null;

  return (
    <section className="animate-fade-in-up">
      <h1 className="h1-guru pt-4 pb-6 text-center md:pt-8">{t.myList}</h1>

      <div className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 md:mx-0 md:justify-center md:px-0" role="tablist">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition ${
              tab === item.id
                ? 'border-secondary bg-secondary text-slate-950'
                : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-secondary'
            }`}
          >
            {item.label}
            {summary && item.id !== 'lists' && <span className="ml-2 opacity-70">{summary[item.id]}</span>}
          </button>
        ))}
      </div>

      {tab === 'lists' ? (
        <ListsManager />
      ) : !current ? (
        <Loader label={t.loading} />
      ) : current.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="p-guru">{t.emptyList}</p>
          <Link href={routes.list(lang, 'movie')} className="font-semibold text-secondary hover:underline">
            {t.exploreCta} &rarr;
          </Link>
        </div>
      ) : (
        <MediaGrid items={current.map(toMediaSummary)} lang={lang} />
      )}
    </section>
  );
}
