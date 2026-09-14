import Link from 'next/link';
import { Star } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import { routes } from '@/lib/routes';
import { SITE_URL } from '@/lib/site';
import { tmdbImage } from '@/lib/tmdb/images';
import type { MediaSummary } from '@/lib/tmdb/types';
import { JsonLd } from '@/components/JsonLd';

interface RankedListProps {
  items: MediaSummary[];
  lang: Locale;
  genreNames: Map<number, string>;
  /** Name of the list, for ItemList structured data. */
  name: string;
}

/** Numbered, text-rich ranking (crawlable titles and synopses) with ItemList structured data. */
export function RankedList({ items, lang, genreNames, name }: RankedListProps) {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name,
          numberOfItems: items.length,
          itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${SITE_URL}${routes.media(lang, item.media_type, item.id, item.title)}`,
            name: item.title,
          })),
        }}
      />
      <ol className="space-y-4">
        {items.map((item, index) => {
          const poster = tmdbImage(item.poster_path, 'w185');
          const href = routes.media(lang, item.media_type, item.id, item.title);
          const genres = item.genre_ids
            .map((id) => genreNames.get(id))
            .filter(Boolean)
            .slice(0, 3)
            .join(' · ');
          return (
            <li
              key={`${item.media_type}-${item.id}`}
              className="flex gap-4 rounded-xl border border-slate-800/80 bg-slate-950/50 p-3 transition hover:border-secondary/40 md:p-4"
            >
              <span className="w-8 shrink-0 pt-1 text-center text-2xl font-black text-secondary md:w-10 md:text-3xl">
                {index + 1}
              </span>
              <Link href={href} className="w-20 shrink-0 md:w-24" tabIndex={-1} aria-hidden>
                {poster ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={poster}
                    alt=""
                    loading={index < 3 ? 'eager' : 'lazy'}
                    width={185}
                    height={278}
                    className="aspect-[2/3] w-full rounded-lg bg-slate-900 object-cover"
                  />
                ) : (
                  <div className="aspect-[2/3] w-full rounded-lg bg-slate-900" />
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg leading-tight font-bold text-white">
                  <Link href={href} className="hover:text-secondary">
                    {item.title}
                  </Link>
                  {item.release_date && (
                    <span className="ml-2 text-sm font-medium text-slate-400">({item.release_date.slice(0, 4)})</span>
                  )}
                </h3>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-slate-400">
                  {item.vote_average > 0 && (
                    <span className="flex items-center gap-1 font-bold text-yellow-400">
                      <Star className="h-3.5 w-3.5 fill-yellow-400" aria-hidden />
                      {item.vote_average.toFixed(1)}
                    </span>
                  )}
                  {genres && <span>{genres}</span>}
                </p>
                {item.overview && (
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-300">{item.overview}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}
