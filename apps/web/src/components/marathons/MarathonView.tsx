'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { Bookmark, BookmarkCheck, Check, Clock, ListPlus, Star, Tv } from 'lucide-react';
import type { LibraryStatus, TitleInfo } from '@/lib/api';
import { useSession } from '@/lib/auth-client';
import { format } from '@/lib/i18n/config';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import type { MarathonItem, ProviderInfo } from '@/lib/marathons/load';
import {
  applyFilters,
  defaultFilters,
  erasAreGrouped,
  formatDuration,
  topProvider,
  totalMinutes,
  type MarathonFilters,
} from '@/lib/marathons/view';
import { routes } from '@/lib/routes';
import { tmdbImage } from '@/lib/tmdb/images';
import { detectCountry } from '@/lib/watch-region';
import { useLibraryIndex } from '@/components/library/LibraryIndexProvider';

interface Group {
  id: string;
  label: string;
}

interface MarathonViewProps {
  items: MarathonItem[];
  providers: Record<number, ProviderInfo>;
  eras: Group[];
  eraLabel: string;
  arcs: Group[];
  accent: string;
  defaultRegion: string;
}

const ADD_CONCURRENCY = 3;

const infoOf = (item: MarathonItem): TitleInfo => ({
  mediaType: item.kind,
  tmdbId: item.id,
  title: item.title,
  posterPath: item.posterPath,
  releaseDate: item.releaseDate,
  genreIds: item.genreIds,
});

export function MarathonView({ items, providers, eras, eraLabel, arcs, accent, defaultRegion }: MarathonViewProps) {
  const { lang, t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const library = useLibraryIndex();
  const { isPending: sessionPending } = useSession();
  const [filters, setFilters] = useState<MarathonFilters>(defaultFilters);
  const [region, setRegion] = useState(defaultRegion);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    detectCountry().then((country) => country && setRegion(country));
  }, []);

  const statusOf = (item: MarathonItem): LibraryStatus | null => library?.get(item.kind, item.id)?.status ?? null;
  const signedIn = Boolean(library?.signedIn);

  const visible = applyFilters(items, filters, (item) => statusOf(item) === 'watched');
  // Progress and totals ignore "hide watched", so hiding titles doesn't reset the bar.
  const scope = applyFilters(items, { ...filters, hideWatched: false }, () => false);
  const watchedCount = scope.filter((item) => statusOf(item) === 'watched').length;
  const missing = scope.filter((item) => !statusOf(item));
  const top = topProvider(scope, region);
  const kinds = useMemo(() => new Set(items.map((item) => item.kind)), [items]);
  const eraNames = new Map(eras.map((era) => [era.id, era.label]));
  const showEras = !filters.era && erasAreGrouped(visible);

  const update = <K extends keyof MarathonFilters>(key: K, value: MarathonFilters[K]) =>
    setFilters((current) => ({ ...current, [key]: value }));

  /** True when the action can't run yet: sends guests to login, ignores clicks while the session loads. */
  const requireLogin = () => {
    if (signedIn) return false;
    if (sessionPending) return true;
    router.push(routes.login(lang, pathname));
    return true;
  };

  const setStatus = (item: MarathonItem, status: LibraryStatus | null) => {
    if (requireLogin() || !library) return;
    library.update(infoOf(item), { status }).catch(() => undefined);
  };

  const addMissing = async () => {
    if (requireLogin() || !library || adding) return;
    setAdding(true);
    const queue = [...missing];
    await Promise.all(
      Array.from({ length: ADD_CONCURRENCY }, async () => {
        for (let item = queue.shift(); item; item = queue.shift()) {
          await library.update(infoOf(item), { status: 'watchlist' }).catch(() => undefined);
        }
      }),
    );
    setAdding(false);
  };

  const chip = (active: boolean) =>
    `shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition md:text-sm ${
      active ? 'border-secondary bg-secondary text-slate-950' : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500 hover:text-white'
    }`;
  const segment = (active: boolean) =>
    `rounded-lg px-3 py-1.5 text-xs font-bold transition md:text-sm ${active ? 'bg-secondary text-slate-950 shadow' : 'text-slate-300 hover:text-white'}`;
  const toggle = (active: boolean) =>
    `flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition md:text-sm ${
      active ? 'border-secondary/60 bg-secondary/15 text-secondary' : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500'
    }`;

  const provider = top ? providers[top.providerId] : null;
  const progress = scope.length ? Math.round((watchedCount / scope.length) * 100) : 0;

  return (
    <section style={{ '--accent': accent } as React.CSSProperties}>
      {/* On larger screens the filters stay reachable while scrolling; on phones they'd cover the list. */}
      <div className="z-20 -mx-4 mb-6 md:sticky md:top-16 flex flex-col gap-3 border-b border-slate-800/60 bg-primary/90 px-4 py-3 backdrop-blur-lg md:mx-0 md:rounded-2xl md:border md:px-4">
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <div role="group" aria-label={t.marathonOrderLabel} className="flex rounded-xl border border-slate-800 bg-slate-950/70 p-1">
            <button type="button" aria-pressed={filters.order === 'chrono'} onClick={() => update('order', 'chrono')} className={segment(filters.order === 'chrono')}>
              {t.marathonOrderChrono}
            </button>
            <button type="button" aria-pressed={filters.order === 'release'} onClick={() => update('order', 'release')} className={segment(filters.order === 'release')}>
              {t.marathonOrderRelease}
            </button>
          </div>

          {kinds.size > 1 && (
            <div role="group" className="flex rounded-xl border border-slate-800 bg-slate-950/70 p-1">
              {(['all', 'movie', 'tv'] as const).map((kind) => (
                <button key={kind} type="button" aria-pressed={filters.kind === kind} onClick={() => update('kind', kind)} className={segment(filters.kind === kind)}>
                  {kind === 'all' ? t.marathonKindAll : kind === 'movie' ? t.movies : t.tvShows}
                </button>
              ))}
            </div>
          )}

          <button type="button" aria-pressed={filters.essentialOnly} onClick={() => update('essentialOnly', !filters.essentialOnly)} className={toggle(filters.essentialOnly)}>
            <Star className={`h-4 w-4 ${filters.essentialOnly ? 'fill-current' : ''}`} aria-hidden />
            {t.marathonEssential}
          </button>
          {signedIn && (
            <button type="button" aria-pressed={filters.hideWatched} onClick={() => update('hideWatched', !filters.hideWatched)} className={toggle(filters.hideWatched)}>
              <Check className="h-4 w-4" aria-hidden />
              {t.marathonHideWatched}
            </button>
          )}
        </div>

        {eras.length > 1 && (
          <div className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
            <span className="shrink-0 pr-1 text-xs font-bold tracking-wider text-slate-500 uppercase">{eraLabel}</span>
            <button type="button" aria-pressed={!filters.era} onClick={() => update('era', null)} className={chip(!filters.era)}>
              {t.marathonAll}
            </button>
            {eras.map((era) => (
              <button key={era.id} type="button" aria-pressed={filters.era === era.id} onClick={() => update('era', filters.era === era.id ? null : era.id)} className={chip(filters.era === era.id)}>
                {era.label}
              </button>
            ))}
          </div>
        )}

        {arcs.length > 1 && (
          <div className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
            <span className="shrink-0 pr-1 text-xs font-bold tracking-wider text-slate-500 uppercase">{t.marathonArcLabel}</span>
            <button type="button" aria-pressed={!filters.arc} onClick={() => update('arc', null)} className={chip(!filters.arc)}>
              {t.marathonAll}
            </button>
            {arcs.map((arc) => (
              <button key={arc.id} type="button" aria-pressed={filters.arc === arc.id} onClick={() => update('arc', filters.arc === arc.id ? null : arc.id)} className={chip(filters.arc === arc.id)}>
                {arc.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mb-8 grid gap-3 md:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
          <Clock className="h-6 w-6 shrink-0 text-secondary" aria-hidden />
          <div>
            <p className="text-lg font-black text-white">{format(t.marathonTitlesCount, { count: scope.length })}</p>
            <p className="text-sm text-slate-400">{format(t.marathonDuration, { duration: formatDuration(totalMinutes(scope)) })}</p>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-2 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
          {signedIn ? (
            <>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-bold text-white">{format(t.marathonProgress, { watched: watchedCount, total: scope.length })}</p>
                <span className="text-sm font-black text-secondary">{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-tertiary to-secondary transition-[width] duration-500" style={{ width: `${progress}%` }} />
              </div>
              <button
                type="button"
                onClick={addMissing}
                disabled={adding || missing.length === 0}
                className="mt-1 flex items-center gap-2 self-start text-xs font-bold text-secondary transition hover:text-white disabled:cursor-default disabled:text-slate-500 md:text-sm"
              >
                <ListPlus className="h-4 w-4" aria-hidden />
                {adding ? t.marathonAdding : missing.length === 0 ? t.marathonAllAdded : format(t.marathonAddAll, { count: missing.length })}
              </button>
            </>
          ) : (
            <p className="text-sm text-slate-300">
              <Link href={routes.login(lang, pathname)} className="font-bold text-secondary hover:underline">
                {t.login}
              </Link>{' '}
              · {t.marathonLoginForProgress}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
          {provider ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={tmdbImage(provider.logoPath, 'w92')!} alt="" className="h-10 w-10 shrink-0 rounded-xl" />
              <div>
                <p className="text-sm font-bold text-white">
                  {format(t.marathonProviderSummary, { count: top!.count, total: scope.length, provider: provider.name })}
                </p>
                <p className="text-xs text-slate-400">{region}</p>
              </div>
            </>
          ) : (
            <>
              <Tv className="h-6 w-6 shrink-0 text-slate-500" aria-hidden />
              <p className="text-sm text-slate-400">{t.marathonNoProviders}</p>
            </>
          )}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="p-guru">{t.marathonEmpty}</p>
          <button type="button" onClick={() => setFilters(defaultFilters)} className="font-semibold text-secondary hover:underline">
            {t.clearFilters}
          </button>
        </div>
      ) : (
        <ol className="relative flex flex-col gap-3 pb-4 md:gap-4">
          <span aria-hidden className="absolute top-2 bottom-2 left-[19px] w-px bg-gradient-to-b from-[var(--accent)] via-slate-700 to-transparent md:left-[23px]" />
          {visible.map((item, index) => {
            const status = statusOf(item);
            const watched = status === 'watched';
            const showEra = showEras && item.era && item.era !== visible[index - 1]?.era;
            const href = routes.media(lang, item.kind, item.id, item.title);
            const poster = tmdbImage(item.posterPath, 'w185');
            const itemProviders = (item.providers[region] ?? []).slice(0, 2).map((id) => providers[id]).filter(Boolean);
            const released = item.releaseDate && item.releaseDate <= new Date().toISOString().slice(0, 10);
            const length =
              item.kind === 'tv' && item.seasons
                ? item.seasons === 1
                  ? t.marathonSeasonOne
                  : format(t.marathonSeasonsCount, { count: item.seasons })
                : item.runtime
                  ? formatDuration(item.runtime)
                  : null;

            return (
              <Fragment key={item.key}>
                {showEra && (
                  <li className="relative z-10 pt-3 pl-12 md:pl-16">
                    <span className="inline-flex rounded-full border border-[color-mix(in_oklab,var(--accent)_45%,transparent)] bg-slate-950 px-3 py-1 text-xs font-black tracking-wider text-white uppercase">
                      {eraNames.get(item.era!)}
                    </span>
                  </li>
                )}
                <li className="relative flex gap-3 md:gap-5">
                  <span
                    aria-hidden
                    className={`relative z-10 mt-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-black tabular-nums md:h-12 md:w-12 md:text-base ${
                      watched ? 'border-green-400 bg-green-400 text-slate-950' : 'border-[var(--accent)] bg-slate-950 text-white'
                    }`}
                  >
                    {watched ? <Check className="h-5 w-5" strokeWidth={3} /> : index + 1}
                  </span>

                  <article
                    className={`flex min-w-0 flex-1 gap-3 rounded-2xl border p-3 transition md:gap-4 md:p-4 ${
                      watched ? 'border-slate-800/50 bg-slate-950/30' : 'border-slate-800/80 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <Link href={href} className="relative shrink-0 self-start">
                      {poster ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={poster}
                          alt={item.title}
                          loading="lazy"
                          className={`aspect-[2/3] w-16 rounded-lg object-cover transition md:w-20 ${watched ? 'opacity-50 grayscale-[40%]' : ''}`}
                        />
                      ) : (
                        <span className="block aspect-[2/3] w-16 rounded-lg bg-slate-800 md:w-20" />
                      )}
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {item.when && filters.order === 'chrono' && (
                          <span className="rounded-md bg-secondary/15 px-2 py-0.5 text-[11px] font-bold text-secondary">{item.when}</span>
                        )}
                        {item.essential && (
                          <span className="flex items-center gap-1 rounded-md bg-amber-400/15 px-2 py-0.5 text-[11px] font-bold text-amber-300">
                            <Star className="h-3 w-3 fill-current" aria-hidden />
                            {t.marathonEssentialBadge}
                          </span>
                        )}
                        <span className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">{item.kind === 'tv' ? t.tvShow : t.movie}</span>
                      </div>

                      <h3 className="text-base leading-snug font-bold md:text-lg">
                        <Link href={href} className={`transition hover:text-secondary ${watched ? 'text-slate-400' : 'text-white'}`}>
                          {item.title}
                        </Link>
                      </h3>

                      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400 md:text-sm">
                        <span>{released ? item.releaseDate!.slice(0, 4) : t.marathonComingSoon}</span>
                        {length && <span>· {length}</span>}
                        {item.rating > 0 && (
                          <span className="flex items-center gap-1 font-semibold text-yellow-400">
                            · <Star className="h-3 w-3 fill-current" aria-hidden />
                            {item.rating.toFixed(1)}
                          </span>
                        )}
                      </p>

                      {item.overview && <p className="hidden text-sm leading-relaxed text-slate-400 md:line-clamp-2">{item.overview}</p>}

                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setStatus(item, watched ? null : 'watched')}
                          aria-pressed={watched}
                          className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition ${
                            watched ? 'border-transparent bg-green-400 text-slate-950' : 'border-slate-700 text-slate-200 hover:border-green-400 hover:text-green-300'
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                          {watched ? t.statusWatched : t.marathonMarkWatched}
                        </button>
                        {!watched && (
                          <button
                            type="button"
                            onClick={() => setStatus(item, status === 'watchlist' ? null : 'watchlist')}
                            aria-pressed={status === 'watchlist'}
                            disabled={status === 'watching'}
                            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition ${
                              status === 'watchlist' || status === 'watching'
                                ? 'border-transparent bg-secondary text-slate-950'
                                : 'border-slate-700 text-slate-200 hover:border-secondary hover:text-secondary'
                            }`}
                          >
                            {status ? <BookmarkCheck className="h-3.5 w-3.5" aria-hidden /> : <Bookmark className="h-3.5 w-3.5" aria-hidden />}
                            {status === 'watching' ? t.statusWatching : t.statusWatchlist}
                          </button>
                        )}
                        {itemProviders.length > 0 && (
                          <span className="ml-auto flex items-center gap-1.5">
                            {itemProviders.map((info) => (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img key={info.name} src={tmdbImage(info.logoPath, 'w92')!} alt={info.name} title={info.name} className="h-7 w-7 rounded-lg" />
                            ))}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                </li>
              </Fragment>
            );
          })}
        </ol>
      )}
    </section>
  );
}
