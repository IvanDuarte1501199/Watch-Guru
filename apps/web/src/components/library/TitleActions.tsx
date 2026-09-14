'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bookmark, Check, Eye, Sparkles } from 'lucide-react';
import type { LibraryStatus } from '@/lib/api';
import { format } from '@/lib/i18n/config';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import { routes } from '@/lib/routes';
import { StarRating } from './StarRating';
import { useTitleLibrary } from './TitleLibraryProvider';

export function TitleActions() {
  const { lang, t } = useI18n();
  const pathname = usePathname();
  const library = useTitleLibrary();
  if (!library) return null;

  const { entry, stats, signedIn, ready, setStatus, setRating } = library;

  const statuses: { value: LibraryStatus; label: string; icon: typeof Bookmark }[] = [
    { value: 'watchlist', label: t.statusWatchlist, icon: Bookmark },
    { value: 'watching', label: t.statusWatching, icon: Eye },
    { value: 'watched', label: t.statusWatched, icon: Check },
  ];

  const votes = stats?.count === 1 ? t.guruVotesOne : format(t.guruVotes, { count: stats?.count ?? 0 });

  return (
    <section className="mb-6 w-full max-w-2xl rounded-xl border border-slate-800/80 bg-slate-950/40 p-4 backdrop-blur-sm md:p-5">
      <div className="flex flex-wrap gap-2">
        {statuses.map(({ value, label, icon: Icon }) => {
          const active = entry?.status === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              disabled={signedIn && !ready}
              onClick={() => setStatus(active ? null : value)}
              className={`flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-semibold transition disabled:opacity-50 ${
                active
                  ? 'border-secondary bg-secondary text-slate-950'
                  : 'border-slate-700 bg-slate-900/70 text-slate-200 hover:border-secondary hover:text-white'
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? 'fill-slate-950/20' : ''}`} aria-hidden />
              {label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-semibold tracking-wide text-slate-400 uppercase">{t.yourRating}</p>
          <StarRating value={entry?.rating ?? null} onChange={setRating} disabled={signedIn && !ready} />
        </div>

        <div className="text-right">
          <p className="flex items-center justify-end gap-1.5 text-xs font-semibold tracking-wide text-slate-400 uppercase">
            <Sparkles className="h-3.5 w-3.5 text-secondary" aria-hidden />
            {t.guruScore}
          </p>
          {stats?.average ? (
            <p className="text-2xl font-black text-white">
              {stats.average.toFixed(1)}
              <span className="text-sm font-semibold text-slate-400"> / 10 · {votes}</span>
            </p>
          ) : (
            <p className="text-sm text-slate-400">{t.noGuruVotes}</p>
          )}
        </div>
      </div>

      {!signedIn && (
        <p className="mt-4 text-sm text-slate-400">
          <Link href={routes.login(lang, pathname)} className="font-semibold text-secondary hover:underline">
            {t.loginToSave}
          </Link>
        </p>
      )}
    </section>
  );
}
