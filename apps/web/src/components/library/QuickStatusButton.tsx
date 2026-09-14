'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Bookmark, Trash2 } from 'lucide-react';
import type { LibraryStatus, TitleInfo } from '@/lib/api';
import { format } from '@/lib/i18n/config';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import { routes } from '@/lib/routes';
import { useLibraryIndex } from './LibraryIndexProvider';
import { statusOptions } from './statusOptions';

/** Bookmark on posters: save a title to a list status without opening its page. */
export function QuickStatusButton({ info }: { info: TitleInfo }) {
  const { lang, t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const library = useLibraryIndex();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!library) return null;

  const entry = library.get(info.mediaType, info.tmdbId);
  const options = statusOptions(t);
  const active = options.find((option) => option.value === entry?.status);
  const ActiveIcon = active?.icon ?? Bookmark;

  const choose = (status: LibraryStatus | null) => {
    setOpen(false);
    library.update(info, { status }).catch(() => undefined);
  };

  const toggle = () => {
    if (!library.signedIn) {
      router.push(routes.login(lang, pathname));
      return;
    }
    // First tap on an unsaved title saves it straight to "Want to watch".
    if (!entry?.status && !open) {
      choose('watchlist');
      return;
    }
    setOpen((value) => !value);
  };

  return (
    // Spans the whole card so the menu can use the poster area without being clipped.
    <div ref={containerRef} className="pointer-events-none absolute inset-0 z-30">
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={entry?.status ? format(t.libraryStatusOf, { title: info.title }) : `${t.quickAdd}: ${info.title}`}
        title={active?.label ?? t.quickAdd}
        className={`pointer-events-auto absolute top-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-full border shadow-lg backdrop-blur-md transition hover:scale-110 ${
          active ? `border-transparent ${active.activeClass}` : 'border-slate-600/80 bg-slate-950/70 text-white hover:border-secondary'
        }`}
      >
        <ActiveIcon className="h-4 w-4" strokeWidth={2.5} aria-hidden />
      </button>

      {open && (
        <div
          role="menu"
          className="pointer-events-auto absolute inset-x-2 top-14 overflow-hidden rounded-xl border border-slate-700 bg-slate-950/95 py-1 shadow-2xl backdrop-blur-lg"
        >
          {options.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              role="menuitemradio"
              aria-checked={entry?.status === value}
              onClick={() => choose(value)}
              className={`flex w-full items-center gap-2 px-2.5 py-2 text-left text-xs sm:text-sm transition hover:bg-slate-900 ${
                entry?.status === value ? 'font-bold text-secondary' : 'text-slate-200'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </button>
          ))}
          {entry && (
            <button
              type="button"
              role="menuitem"
              onClick={() => choose(null)}
              className="flex w-full items-center gap-2 border-t border-slate-800 px-2.5 py-2 text-left text-xs sm:text-sm text-red-300 hover:bg-slate-900"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
              {t.removeFromLibrary}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
