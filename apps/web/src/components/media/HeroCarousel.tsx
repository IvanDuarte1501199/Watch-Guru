'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import { routes } from '@/lib/routes';
import { tmdbImage } from '@/lib/tmdb/images';
import type { MediaSummary } from '@/lib/tmdb/types';

export interface HeroItem extends MediaSummary {
  genreNames: string[];
}

const AUTOPLAY_MS = 6000;

export function HeroCarousel({ items }: { items: HeroItem[] }) {
  const { lang, t } = useI18n();
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: index * track.clientWidth, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (paused || items.length < 2) return;
    const timer = window.setInterval(() => goTo((active + 1) % items.length), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [active, paused, items.length, goTo]);

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    setActive(Math.round(track.scrollLeft / track.clientWidth));
  };

  if (items.length === 0) return null;

  return (
    <section
      className="relative mb-12"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-2xl"
      >
        {items.map((item, index) => {
          const backdrop = tmdbImage(item.backdrop_path, 'w1280');
          return (
            <Link
              key={`${item.media_type}-${item.id}`}
              href={routes.media(lang, item.media_type, item.id, item.title)}
              className="group relative block w-full shrink-0 snap-start overflow-hidden rounded-2xl border border-slate-900 bg-slate-950"
              aria-hidden={index !== active}
              tabIndex={index === active ? 0 : -1}
            >
              <div className="relative h-[300px] sm:h-[380px] md:h-[450px] lg:h-[500px]">
                {backdrop && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={backdrop}
                    alt={item.title}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : 'auto'}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              </div>

              <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end gap-3 p-6 pt-20 md:p-10">
                {item.genreNames.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.genreNames.map((genre) => (
                      <span
                        key={genre}
                        className="rounded-full border border-secondary/20 bg-secondary/10 px-3 py-1 text-[11px] font-bold tracking-wider text-secondary uppercase backdrop-blur-md md:text-xs"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
                <h2 className="text-2xl leading-none font-black tracking-tight text-white transition-colors duration-200 group-hover:text-secondary md:text-4xl lg:text-5xl">
                  {item.title}
                </h2>
                {item.overview && (
                  <p className="mt-1 line-clamp-2 max-w-3xl text-sm leading-relaxed text-slate-300 md:line-clamp-3 md:text-base">
                    {item.overview}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-3 border-t border-slate-900/60 pt-3">
                  {item.release_date && (
                    <span className="rounded-lg border border-slate-800/80 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-slate-300">
                      {item.release_date.slice(0, 4)}
                    </span>
                  )}
                  <span className="rounded-lg border border-slate-800/80 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-slate-300">
                    {item.media_type === 'tv' ? t.tvShow : t.movie}
                  </span>
                  {item.vote_average > 0 && (
                    <span className="flex items-center gap-1.5 rounded-lg border border-yellow-500/20 bg-yellow-500/10 px-3 py-1.5 text-xs font-bold text-yellow-400">
                      ★ {item.vote_average.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`${index + 1} / ${items.length}`}
            aria-current={index === active}
            className={`h-1.5 rounded-full transition-all duration-300 ${index === active ? 'w-6 bg-secondary' : 'w-1.5 bg-slate-600 hover:bg-slate-400'}`}
          />
        ))}
      </div>
    </section>
  );
}
