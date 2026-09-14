'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Check, ListPlus, Plus } from 'lucide-react';
import { api, type TitleInfo, type UserListSummary } from '@/lib/api';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import { routes } from '@/lib/routes';

/** "Add to list" popover for a title: toggle membership in your lists or create a new one. */
export function AddToListButton({ info, signedIn }: { info: TitleInfo; signedIn: boolean }) {
  const { lang, t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lists, setLists] = useState<UserListSummary[] | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    api
      .lists(info)
      .then((loaded) => !cancelled && setLists(loaded))
      .catch(() => !cancelled && setLists([]));

    const close = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => {
      cancelled = true;
      document.removeEventListener('mousedown', close);
    };
  }, [open, info]);

  const toggleOpen = () => {
    if (!signedIn) {
      router.push(routes.login(lang, pathname));
      return;
    }
    setOpen((value) => !value);
  };

  const toggle = async (list: UserListSummary) => {
    const has = list.hasTitle;
    setLists((current) => current?.map((item) => (item.id === list.id ? { ...item, hasTitle: !has } : item)) ?? null);
    try {
      if (has) await api.removeFromList(list.id, info.mediaType, info.tmdbId);
      else await api.addToList(list.id, info);
    } catch {
      setLists((current) => current?.map((item) => (item.id === list.id ? { ...item, hasTitle: has } : item)) ?? null);
    }
  };

  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    const title = newTitle.trim();
    if (!title || busy) return;
    setBusy(true);
    try {
      const list = await api.createList({ title });
      await api.addToList(list.id, info);
      setLists((current) => [{ ...list, itemCount: 1, posters: [], hasTitle: true }, ...(current ?? [])]);
      setNewTitle('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={toggleOpen}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/70 px-3.5 py-2 text-sm font-semibold text-slate-200 transition hover:border-secondary hover:text-white"
      >
        <ListPlus className="h-4 w-4" aria-hidden />
        {t.addToList}
      </button>

      {open && (
        <div className="absolute top-12 left-0 z-40 w-72 rounded-xl border border-slate-700 bg-slate-950/95 p-2 shadow-2xl backdrop-blur-lg">
          <ul className="max-h-64 overflow-y-auto">
            {lists === null && <li className="px-3 py-2 text-sm text-slate-400">{t.loading}</li>}
            {lists?.map((list) => (
              <li key={list.id}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={list.hasTitle}
                  onClick={() => toggle(list)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-900"
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                      list.hasTitle ? 'border-secondary bg-secondary text-slate-950' : 'border-slate-600'
                    }`}
                  >
                    {list.hasTitle && <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />}
                  </span>
                  <span className="truncate">{list.title}</span>
                </button>
              </li>
            ))}
          </ul>
          <form onSubmit={create} className="mt-2 flex gap-2 border-t border-slate-800 pt-2">
            <input
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              maxLength={80}
              aria-label={t.newList}
              placeholder={t.newList}
              className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:border-secondary focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy || !newTitle.trim()}
              aria-label={t.create}
              className="rounded-lg bg-secondary px-2.5 text-slate-950 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" aria-hidden />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
