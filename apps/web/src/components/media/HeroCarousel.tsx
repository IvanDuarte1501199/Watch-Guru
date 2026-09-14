'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Bookmark, CirclePlay, Star } from 'lucide-react';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import { routes } from '@/lib/routes';
import { tmdbImage } from '@/lib/tmdb/images';
import type { MediaSummary } from '@/lib/tmdb/types';
import { useLibraryIndex } from '@/components/library/LibraryIndexProvider';
import { statusOptions } from '@/components/library/statusOptions';

export interface HeroItem extends MediaSummary {
  genreNames: string[];
}

const SWIPE_THRESHOLD = 50;

const rank = (index: number) => String(index + 1).padStart(2, '0');

/** Today's top titles: a featured slide plus a ranked list that doubles as navigation. */
export function HeroCarousel({ items }: { items: HeroItem[] }) {
  const { lang, t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const library = useLibraryIndex();
  const [active, setActive] = useState(0);
  // Bumped on every manual pick so the progress bar restarts even on the same slide.
  const [cycle, setCycle] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);
  const listRef = useRef<HTMLOListElement>(null);

  // On narrow screens the ranking is a horizontal strip: keep the active row in view
  // without scrolling the page itself.
  useEffect(() => {
    const list = listRef.current;
    const row = list?.children[active] as HTMLElement | undefined;
    if (!list || !row || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: row.offsetLeft - 16, behavior: 'smooth' });
  }, [active]);

  if (items.length === 0) return null;

  const go = (index: number) => {
    setActive((index + items.length) % items.length);
    setCycle((value) => value + 1);
  };

  const current = items[active];
  const href = routes.media(lang, current.media_type, current.id, current.title);
  const entry = library?.get(current.media_type, current.id);
  const status = statusOptions(t).find((option) => option.value === entry?.status);
  const StatusIcon = status?.icon ?? Bookmark;

  const toggleWatchlist = () => {
    if (!library) return;
    if (!library.signedIn) {
      router.push(routes.login(lang, pathname));
      return;
    }
    if (entry?.status && entry.status !== 'watchlist') {
      router.push(href);
      return;
    }
    library
      .update(
        {
          mediaType: current.media_type,
          tmdbId: current.id,
          title: current.title,
          posterPath: current.poster_path,
          releaseDate: current.release_date || null,
          genreIds: current.genre_ids,
        },
        { status: entry?.status ? null : 'watchlist' },
      )
      .catch(() => undefined);
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t.heroTopLabel}
      className="relative mb-12 grid gap-4 lg:h-[580px] lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      // Keyboard focus pauses; a tap on a row shouldn't stop autoplay for good.
      onFocus={(event) => event.target.matches(':focus-visible') && setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="relative h-[440px] overflow-hidden rounded-3xl border border-slate-400/15 bg-slate-950 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] sm:h-[500px] lg:h-full"
        onTouchStart={(event) => {
          touchStart.current = event.touches[0].clientX;
        }}
        onTouchEnd={(event) => {
          if (touchStart.current === null) return;
          const delta = event.changedTouches[0].clientX - touchStart.current;
          touchStart.current = null;
          if (Math.abs(delta) > SWIPE_THRESHOLD) go(active + (delta < 0 ? 1 : -1));
        }}
      >
        {items.map((item, index) => {
          const backdrop = tmdbImage(item.backdrop_path, 'w1280');
          return (
            backdrop && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${item.media_type}-${item.id}`}
                src={backdrop}
                alt=""
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                className={`absolute inset-0 h-full w-full object-cover object-[50%_30%] transition-[opacity,transform] ease-out motion-reduce:transition-none ${
                  index === active ? 'scale-105 opacity-100 duration-[800ms,6500ms]' : 'scale-100 opacity-0 duration-[800ms,0ms]'
                }`}
              />
            )
          );
        })}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 via-40% to-transparent to-70%" />

        <div
          key={active}
          className="absolute inset-x-5 bottom-5 flex animate-fade-in-up flex-col gap-2 sm:inset-x-10 sm:bottom-9 sm:flex-row sm:items-end sm:gap-6"
          aria-live="polite"
        >
          <span
            aria-hidden
            className="shrink-0 text-7xl leading-[0.74] font-black tracking-[-0.06em] text-transparent [-webkit-text-stroke:1.5px_var(--color-secondary)] sm:text-[150px] sm:[-webkit-text-stroke:2px_var(--color-secondary)] lg:text-[200px]"
          >
            {rank(active)}
          </span>
          <div className="flex min-w-0 flex-col gap-2.5 sm:gap-3 sm:pb-1">
            <p className="text-xs font-semibold text-slate-300 sm:text-[13px]">
              {[current.media_type === 'tv' ? t.tvShow : t.movie, current.release_date?.slice(0, 4), ...current.genreNames]
                .filter(Boolean)
                .join(' · ')}
            </p>
            <h2 className="text-3xl leading-none font-black tracking-tight text-balance text-white sm:text-4xl lg:text-5xl">
              <Link href={href} className="text-white transition-colors hover:text-secondary">
                {current.title}
              </Link>
            </h2>
            {current.overview && (
              <p className="line-clamp-2 max-w-xl text-sm leading-relaxed text-pretty text-slate-300 sm:text-[15px] lg:line-clamp-3">
                {current.overview}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 sm:gap-3">
              <Link
                href={`${href}#where-to-watch`}
                className="flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-extrabold text-slate-950 shadow-[0_10px_30px_-8px_rgba(95,179,205,0.6)] transition hover:-translate-y-px hover:brightness-110 sm:px-5 sm:py-3 sm:text-[15px]"
              >
                <CirclePlay className="h-[18px] w-[18px]" strokeWidth={2.2} aria-hidden />
                {t.heroWhereToWatch}
              </Link>
              {library && (
                <button
                  type="button"
                  onClick={toggleWatchlist}
                  aria-pressed={Boolean(entry?.status)}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition sm:px-5 sm:py-3 sm:text-[15px] ${
                    status ? `border-transparent ${status.activeClass}` : 'border-white/20 bg-white/10 text-white hover:bg-white/15'
                  }`}
                >
                  <StatusIcon className="h-[18px] w-[18px]" strokeWidth={2.2} aria-hidden />
                  {status?.label ?? t.statusWatchlist}
                </button>
              )}
              {current.vote_average > 0 && (
                <span className="ml-1 flex items-center gap-1.5 text-base font-extrabold text-yellow-400 sm:text-[17px]">
                  <Star className="h-4 w-4 fill-current" aria-hidden />
                  {current.vote_average.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <ol ref={listRef} className="no-scrollbar relative -mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:justify-between lg:overflow-visible lg:rounded-3xl lg:border lg:border-slate-800/80 lg:bg-slate-950/55 lg:p-3">
        {items.map((item, index) => {
          const selected = index === active;
          const poster = tmdbImage(item.poster_path, 'w185');
          return (
            <li key={`${item.media_type}-${item.id}`} className="w-64 shrink-0 snap-start lg:w-auto">
              <button
                type="button"
                onClick={() => go(index)}
                aria-current={selected}
                aria-label={`${rank(index)}. ${item.title}`}
                className={`relative flex w-full items-center gap-3 overflow-hidden rounded-2xl px-3 py-2.5 text-left transition-colors lg:gap-4 lg:pr-4 ${
                  selected
                    ? 'bg-slate-800/70 shadow-[inset_0_0_0_1px_rgba(95,179,205,0.3)]'
                    : 'bg-slate-950/50 hover:bg-slate-900/80 lg:bg-transparent'
                }`}
              >
                <span
                  aria-hidden
                  className={`w-11 shrink-0 text-3xl leading-none font-black tracking-tighter tabular-nums lg:w-14 lg:text-[40px] ${
                    selected ? 'text-secondary' : 'text-transparent [-webkit-text-stroke:1.5px_#475569]'
                  }`}
                >
                  {rank(index)}
                </span>
                {poster && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={poster} alt="" loading="lazy" className="h-[72px] w-12 shrink-0 rounded-lg object-cover lg:h-20 lg:w-[54px]" />
                )}
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="line-clamp-2 text-sm leading-tight font-bold text-white lg:text-base">{item.title}</span>
                  <span className="flex items-center gap-2 text-xs text-slate-400 lg:text-[13px]">
                    {item.vote_average > 0 && (
                      <span className="flex items-center gap-1 font-bold text-yellow-400">
                        <Star className="h-3 w-3 fill-current" aria-hidden />
                        {item.vote_average.toFixed(1)}
                      </span>
                    )}
                    {[item.media_type === 'tv' ? t.tvShow : t.movie, item.release_date?.slice(0, 4)].filter(Boolean).join(' · ')}
                  </span>
                </span>
                {selected && items.length > 1 && (
                  <span
                    key={cycle}
                    aria-hidden
                    onAnimationEnd={() => go(active + 1)}
                    style={{ animationPlayState: paused ? 'paused' : 'running' }}
                    className="absolute inset-x-3 bottom-0 h-0.5 origin-left animate-hero-progress rounded-full bg-secondary motion-reduce:hidden"
                  />
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
