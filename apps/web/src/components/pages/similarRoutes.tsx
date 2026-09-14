import type { Metadata } from 'next';
import Link from 'next/link';
import { format } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';
import { getGenres, getRecommendations } from '@/lib/tmdb/api';
import { tmdbImage } from '@/lib/tmdb/images';
import type { MediaKind } from '@/lib/tmdb/types';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { RankedList } from '@/components/seo/RankedList';
import { resolveDetail } from './detailRoutes';

type DetailParams = Promise<{ lang: string; id: string }>;

const MIN_INDEXABLE_ITEMS = 6;

async function loadSimilar(kind: MediaKind, params: DetailParams) {
  const { lang, media, canonical } = await resolveDetail(kind, params, '/similar');
  const items = (await getRecommendations(kind, media.id, lang)).slice(0, 30);
  return { lang, media, canonical, items };
}

export async function similarMetadata(kind: MediaKind, params: DetailParams): Promise<Metadata> {
  const { lang, media, canonical, items } = await loadSimilar(kind, params);
  const t = await getDictionary(lang);
  const heading = format(kind === 'movie' ? t.similarMovies : t.similarTvShows, { title: media.title });
  const examples = items
    .slice(0, 4)
    .map((item) => item.title)
    .join(', ');

  return pageMetadata({
    lang,
    path: `${canonical.slice(lang.length + 1)}/similar`,
    alternatePath: `/${kind === 'movie' ? 'movie' : 'tv-show'}/${media.id}/similar`,
    title: heading,
    description: `${heading}: ${examples}. ${format(t.similarIntro, { title: media.title })}`.slice(0, 160),
    image: tmdbImage(media.backdrop_path, 'w1280'),
    noIndex: items.length < MIN_INDEXABLE_ITEMS,
  });
}

export async function renderSimilar(kind: MediaKind, params: DetailParams) {
  const { lang, media, canonical, items } = await loadSimilar(kind, params);
  const [t, genres] = await Promise.all([getDictionary(lang), getGenres(kind, lang)]);
  const heading = format(kind === 'movie' ? t.similarMovies : t.similarTvShows, { title: media.title });

  return (
    <article className="mx-auto max-w-4xl pb-12">
      <Breadcrumbs
        label={t.breadcrumb}
        items={[
          { name: t.home, href: routes.home(lang) },
          { name: kind === 'movie' ? t.movies : t.tvShows, href: routes.list(lang, kind) },
          { name: media.title, href: canonical },
          { name: heading, href: routes.similar(lang, kind, media.id, media.title) },
        ]}
      />
      <header className="pt-6 pb-8">
        <h1 className="h1-guru">{heading}</h1>
        <p className="p-guru mt-4">
          {format(t.similarIntro, { title: media.title })}{' '}
          <Link href={canonical} className="font-semibold text-secondary hover:underline">
            {media.title}
          </Link>
        </p>
      </header>
      {items.length > 0 ? (
        <RankedList items={items} lang={lang} genreNames={new Map(genres.map((g) => [g.id, g.name]))} name={heading} />
      ) : (
        <p className="p-guru py-10 text-center">{t.noItems}</p>
      )}
    </article>
  );
}
