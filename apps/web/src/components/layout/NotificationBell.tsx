'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { api, type AppNotification } from '@/lib/api';
import { format } from '@/lib/i18n/config';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import { routes } from '@/lib/routes';
import { tmdbImage } from '@/lib/tmdb/images';

const POLL_MS = 5 * 60 * 1000;

export function NotificationBell() {
  const { lang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AppNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const load = useCallback(() => {
    api
      .notifications()
      .then((data) => {
        setItems(data.items);
        setUnread(data.unread);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    load();
    const timer = window.setInterval(load, POLL_MS);
    return () => window.clearInterval(timer);
  }, [load]);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && unread > 0) {
      setUnread(0);
      api.markNotificationsRead().catch(() => undefined);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label={unread > 0 ? `${t.notifications} (${unread})` : t.notifications}
        className="relative rounded-lg p-1.5 text-slate-300 transition hover:text-secondary"
      >
        <Bell className="h-5 w-5" aria-hidden />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink-500 px-1 text-[10px] font-black text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-11 right-0 z-50 w-80 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/95 shadow-2xl backdrop-blur-lg">
          <p className="border-b border-slate-800 px-4 py-3 text-sm font-bold text-white">{t.notifications}</p>
          {items.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-slate-400">{t.noNotifications}</p>
          ) : (
            <ul className="max-h-96 divide-y divide-slate-900 overflow-y-auto">
              {items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={routes.media(lang, item.mediaType, item.tmdbId, item.title)}
                    onClick={() => setOpen(false)}
                    className={`flex gap-3 px-4 py-3 transition hover:bg-slate-900 ${item.readAt ? '' : 'bg-secondary/5'}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tmdbImage(item.posterPath, 'w92') ?? '/movie-primary.svg'}
                      alt=""
                      className="h-14 w-10 shrink-0 rounded bg-slate-800 object-cover"
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-white">{item.title}</span>
                      <span className="block text-xs text-green-300">
                        {format(t.nowAvailableOn, { providers: item.data.providers.map((p) => p.name).join(', ') })}
                      </span>
                      <span className="block text-[11px] text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString(lang, { day: 'numeric', month: 'short' })}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
