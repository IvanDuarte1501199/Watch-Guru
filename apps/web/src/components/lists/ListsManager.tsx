'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Globe, Lock, Trash2 } from 'lucide-react';
import { api, type UserListSummary } from '@/lib/api';
import { format } from '@/lib/i18n/config';
import { useI18n } from '@/lib/i18n/DictionaryProvider';
import { routes } from '@/lib/routes';
import { tmdbImage } from '@/lib/tmdb/images';
import { Loader } from '@/components/ui/Loader';

function PosterCollage({ posters }: { posters: string[] }) {
  return (
    <div className="grid aspect-video grid-cols-4 overflow-hidden rounded-t-xl bg-slate-900">
      {Array.from({ length: 4 }, (_, index) => {
        const poster = tmdbImage(posters[index], 'w185');
        return poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={index} src={poster} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div key={index} className="h-full w-full bg-gradient-to-br from-slate-800 to-slate-900" />
        );
      })}
    </div>
  );
}

export function ListsManager() {
  const { lang, t } = useI18n();
  const [lists, setLists] = useState<UserListSummary[] | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .lists()
      .then(setLists)
      .catch(() => setLists([]));
  }, []);

  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || busy) return;
    setBusy(true);
    try {
      const list = await api.createList({ title: title.trim(), description: description.trim() });
      setLists((current) => [{ ...list, itemCount: 0, posters: [], hasTitle: false }, ...(current ?? [])]);
      setTitle('');
      setDescription('');
    } finally {
      setBusy(false);
    }
  };

  const togglePublic = async (list: UserListSummary) => {
    setLists((current) => current?.map((item) => (item.id === list.id ? { ...item, isPublic: !list.isPublic } : item)) ?? null);
    await api.updateList(list.id, { isPublic: !list.isPublic }).catch(() =>
      setLists((current) => current?.map((item) => (item.id === list.id ? list : item)) ?? null),
    );
  };

  const remove = async (list: UserListSummary) => {
    if (!window.confirm(format(t.confirmDeleteList, { title: list.title }))) return;
    await api.deleteList(list.id);
    setLists((current) => current?.filter((item) => item.id !== list.id) ?? null);
  };

  const inputClass =
    'rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-white placeholder-slate-500 focus:border-secondary focus:outline-none';

  return (
    <div>
      <p className="p-guru mb-4 text-center">{t.listsHint}</p>
      <form onSubmit={create} className="mx-auto mb-10 flex max-w-2xl flex-col gap-2 sm:flex-row">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={80}
          required
          aria-label={t.newList}
          placeholder={t.listNamePlaceholder}
          className={`${inputClass} sm:w-64`}
        />
        <input
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={500}
          aria-label={t.listDescriptionPlaceholder}
          placeholder={t.listDescriptionPlaceholder}
          className={`${inputClass} flex-1`}
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-secondary px-5 py-2.5 font-bold text-slate-950 disabled:opacity-60"
        >
          {t.create}
        </button>
      </form>

      {lists === null ? (
        <Loader label={t.loading} />
      ) : lists.length === 0 ? (
        <p className="p-guru py-10 text-center">{t.noListsYet}</p>
      ) : (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {lists.map((list) => (
            <li key={list.id} className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60">
              <Link href={routes.userList(lang, list.id, list.title)} className="group block">
                <PosterCollage posters={list.posters} />
                <div className="p-4 pb-2">
                  <h3 className="truncate text-lg font-bold text-white group-hover:text-secondary">{list.title}</h3>
                  <p className="text-sm text-slate-400">
                    {list.itemCount === 1 ? t.itemsCountOne : format(t.itemsCount, { count: list.itemCount })}
                  </p>
                </div>
              </Link>
              <div className="flex items-center justify-between px-4 pb-4">
                <button
                  type="button"
                  onClick={() => togglePublic(list)}
                  title={list.isPublic ? t.makePrivate : t.makePublic}
                  className="flex items-center gap-1.5 rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300 hover:border-secondary"
                >
                  {list.isPublic ? <Globe className="h-3.5 w-3.5" aria-hidden /> : <Lock className="h-3.5 w-3.5" aria-hidden />}
                  {list.isPublic ? t.publicList : t.privateList}
                </button>
                <button
                  type="button"
                  onClick={() => remove(list)}
                  aria-label={t.deleteList}
                  className="rounded-lg p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
