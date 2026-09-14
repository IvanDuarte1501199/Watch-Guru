'use client';

import { Children, useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n/DictionaryProvider';

interface CarouselProps {
  children: React.ReactNode;
  /** Width classes for each slide, e.g. `w-[42%] md:w-[23%]`. */
  itemClassName: string;
  label: string;
}

/** Lightweight scroll-snap carousel: swipe on touch, arrow buttons on desktop. */
export function Carousel({ children, itemClassName, label }: CarouselProps) {
  const { t } = useI18n();
  const trackRef = useRef<HTMLUListElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateButtons = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanScrollPrev(track.scrollLeft > 4);
    setCanScrollNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateButtons();
    window.addEventListener('resize', updateButtons);
    return () => window.removeEventListener('resize', updateButtons);
  }, [updateButtons]);

  const scroll = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: 'smooth' });
  };

  const buttonClass =
    'absolute top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-700/80 bg-slate-950/90 text-white shadow-xl backdrop-blur transition hover:border-secondary hover:text-secondary disabled:pointer-events-none disabled:opacity-0 md:flex';

  return (
    <div className="relative">
      <ul
        ref={trackRef}
        onScroll={updateButtons}
        aria-label={label}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pt-1 pb-3 md:mx-0 md:scroll-px-0 md:gap-4 md:px-0"
      >
        {Children.map(children, (child) => (
          <li className={`shrink-0 snap-start ${itemClassName}`}>{child}</li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => scroll(-1)}
        disabled={!canScrollPrev}
        aria-label={t.previous}
        className={`${buttonClass} -left-5`}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        disabled={!canScrollNext}
        aria-label={t.next}
        className={`${buttonClass} -right-5`}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
