import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { Lock } from 'lucide-react';
import { getList } from '@/lib/backend';
import { format, hasLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { routes } from '@/lib/routes';
import { pageMetadata, summarize } from '@/lib/seo';
import { tmdbImage } from '@/lib/tmdb/images';
import type { MediaSummary } from '@/lib/tmdb/types';
import { ShareListButton } from '@/components/lists/ShareListButton';
import { MediaGrid } from '@/components/media/MediaGrid';

const listId = (param: string) => /^([A-Za-z0-9]{10})(?:-|$)/.exec(param)?.[1] ?? null;

async function resolveList(params: PageProps<'/[lang]/list/[id]'>['params']) {
  const { lang, id } = await params;
  const parsedId = listId(id);
  if (!hasLocale(lang) || !parsedId) notFound();

  const list = await getList(parsedId);
  if (!list) notFound();

  const canonical = routes.userList(lang, list.id, list.title);
  if (canonical.split('/').pop() !== id) permanentRedirect(canonical);
  return { lang, list, canonical };
}

export async function generateMetadata({ params }: PageProps<'/[lang]/list/[id]'>): Promise<Metadata> {
  const { lang, list, canonical } = await resolveList(params);
  const t = await getDictionary(lang);
  const byline = format(t.listBy, { name: list.ownerName });
  return pageMetadata({
    lang,
    path: canonical.slice(lang.length + 1),
    alternatePath: `/list/${list.id}`,
    title: `${list.title} · ${byline}`,
    description: summarize(list.description || `${byline}: ${list.items.map((item) => item.title).join(', ')}`),
    image: tmdbImage(list.items[0]?.posterPath, 'w780'),
    noIndex: !list.isPublic || list.items.length === 0,
  });
}

export default async function ListPage({ params }: PageProps<'/[lang]/list/[id]'>) {
  const { lang, list } = await resolveList(params);
  const t = await getDictionary(lang);

  const items: MediaSummary[] = list.items.map((item) => ({
    id: item.tmdbId,
    media_type: item.mediaType,
    title: item.title,
    original_title: item.title,
    overview: '',
    poster_path: item.posterPath,
    backdrop_path: null,
    vote_average: 0,
    vote_count: 0,
    release_date: item.releaseDate,
    genre_ids: [],
    popularity: 0,
  }));

  return (
    <section className="animate-fade-in-up py-6 md:py-10">
      <header className="mx-auto mb-10 max-w-3xl text-center">
        <p className="mb-2 text-sm font-semibold tracking-wide text-secondary uppercase">
          {format(t.listBy, { name: list.ownerName })}
        </p>
        <h1 className="h1-guru">{list.title}</h1>
        {list.description && <p className="p-guru mt-3 whitespace-pre-line">{list.description}</p>}
        <p className="mt-3 text-sm text-slate-400">
          {list.items.length === 1 ? t.itemsCountOne : format(t.itemsCount, { count: list.items.length })}
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {list.isPublic && <ShareListButton title={list.title} />}
          {list.isOwner && (
            <Link href={routes.myList(lang)} className="text-sm font-semibold text-secondary hover:underline">
              {t.myLists} &rarr;
            </Link>
          )}
        </div>
        {!list.isPublic && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-sm text-amber-300">
            <Lock className="h-3.5 w-3.5" aria-hidden />
            {t.listPrivateNote}
          </p>
        )}
      </header>

      {items.length > 0 ? (
        <MediaGrid items={items} lang={lang} />
      ) : (
        <p className="p-guru py-10 text-center">{t.emptyListItems}</p>
      )}
    </section>
  );
}
