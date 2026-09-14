import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { categoryTitle } from '@/lib/categories';
import { format, hasLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { parseIdParam, routes, slugify } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';
import { genreImage } from '@/lib/site';
import { discover, getCategory, getGenres, isCategory } from '@/lib/tmdb/api';
import { tmdbImage } from '@/lib/tmdb/images';
import type { MediaKind } from '@/lib/tmdb/types';
import { MediaHubPage } from './MediaHubPage';
import { PagedGridPage, parsePage } from './PagedGridPage';

/*
 * Shared implementations for the movie and TV list routes, which only differ
 * in media kind. Route files under app/[lang] are thin wrappers around these.
 */

type LangParams = Promise<{ lang: string }>;
type CategoryParams = Promise<{ lang: string; category: string }>;
type GenreParams = Promise<{ lang: string; id: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function requireLocale(lang: string): Locale {
  if (!hasLocale(lang)) notFound();
  return lang;
}

/* Hub ----------------------------------------------------------------- */

export async function hubMetadata(kind: MediaKind, params: LangParams): Promise<Metadata> {
  const lang = requireLocale((await params).lang);
  const t = await getDictionary(lang);
  const title = kind === 'movie' ? t.movies : t.tvShows;
  return pageMetadata({ lang, path: `/${kind === 'movie' ? 'movies' : 'tv-shows'}`, title, description: t.siteDescription });
}

export async function renderHub(kind: MediaKind, params: LangParams) {
  const lang = requireLocale((await params).lang);
  return <MediaHubPage kind={kind} lang={lang} />;
}

/* Category ------------------------------------------------------------ */

export async function categoryMetadata(kind: MediaKind, params: CategoryParams): Promise<Metadata> {
  const { lang: rawLang, category } = await params;
  const lang = requireLocale(rawLang);
  if (!isCategory(kind, category)) notFound();
  const t = await getDictionary(lang);
  const title = categoryTitle(kind, category, t);
  return pageMetadata({
    lang,
    path: routes.category(lang, kind, category).slice(lang.length + 1),
    title,
    description: `${title} · ${t.siteDescription}`,
  });
}

export async function renderCategory(kind: MediaKind, params: CategoryParams, searchParams: SearchParams) {
  const { lang: rawLang, category } = await params;
  const lang = requireLocale(rawLang);
  if (!isCategory(kind, category)) notFound();
  const page = parsePage((await searchParams).page);

  const [t, data] = await Promise.all([getDictionary(lang), getCategory(kind, category, lang, page)]);
  return (
    <PagedGridPage
      title={categoryTitle(kind, category, t)}
      data={data}
      basePath={routes.category(lang, kind, category)}
      lang={lang}
      t={t}
      backdrop={tmdbImage(data.results[0]?.backdrop_path, 'w1280')}
      breadcrumbs={[
        { name: t.home, href: routes.home(lang) },
        { name: kind === 'movie' ? t.movies : t.tvShows, href: routes.list(lang, kind) },
        { name: categoryTitle(kind, category, t), href: routes.category(lang, kind, category) },
      ]}
    />
  );
}

/* Genre --------------------------------------------------------------- */

async function resolveGenre(kind: MediaKind, params: GenreParams) {
  const { lang: rawLang, id } = await params;
  const lang = requireLocale(rawLang);
  const genreId = parseIdParam(id);
  if (genreId === null) notFound();

  const genre = (await getGenres(kind, lang)).find((item) => item.id === genreId);
  if (!genre) notFound();

  const canonical = routes.genre(lang, kind, genre.id, genre.name);
  if (`${genre.id}-${slugify(genre.name)}` !== id && slugify(genre.name)) permanentRedirect(canonical);
  return { lang, genre, canonical };
}

export async function genreMetadata(kind: MediaKind, params: GenreParams): Promise<Metadata> {
  const { lang, genre, canonical } = await resolveGenre(kind, params);
  const t = await getDictionary(lang);
  const title = format(kind === 'movie' ? t.moviesOfGenre : t.tvShowsOfGenre, { genre: genre.name });
  return pageMetadata({
    lang,
    path: canonical.slice(lang.length + 1),
    alternatePath: `/${kind === 'movie' ? 'movies' : 'tv-shows'}/genre/${genre.id}`,
    title,
    description: `${title} · ${t.siteDescription}`,
  });
}

export async function renderGenre(kind: MediaKind, params: GenreParams, searchParams: SearchParams) {
  const { lang, genre, canonical } = await resolveGenre(kind, params);
  const page = parsePage((await searchParams).page);
  const [t, data] = await Promise.all([getDictionary(lang), discover(kind, lang, { genres: [genre.id], page })]);

  return (
    <PagedGridPage
      title={format(kind === 'movie' ? t.moviesOfGenre : t.tvShowsOfGenre, { genre: genre.name })}
      data={data}
      basePath={canonical}
      lang={lang}
      t={t}
      backdrop={genreImage(genre.id) ?? tmdbImage(data.results[0]?.backdrop_path, 'w1280')}
      breadcrumbs={[
        { name: t.home, href: routes.home(lang) },
        { name: kind === 'movie' ? t.movies : t.tvShows, href: routes.list(lang, kind) },
        { name: genre.name, href: canonical },
      ]}
    />
  );
}
