import { Bookmark, Check, Eye, type LucideIcon } from 'lucide-react';
import type { LibraryStatus } from '@/lib/api';
import type { Dictionary } from '@/lib/i18n/get-dictionary';

export interface StatusOption {
  value: LibraryStatus;
  label: string;
  icon: LucideIcon;
  /** Tailwind classes for the active state. */
  activeClass: string;
}

export function statusOptions(t: Dictionary): StatusOption[] {
  return [
    { value: 'watchlist', label: t.statusWatchlist, icon: Bookmark, activeClass: 'bg-secondary text-slate-950' },
    { value: 'watching', label: t.statusWatching, icon: Eye, activeClass: 'bg-amber-400 text-slate-950' },
    { value: 'watched', label: t.statusWatched, icon: Check, activeClass: 'bg-green-400 text-slate-950' },
  ];
}
