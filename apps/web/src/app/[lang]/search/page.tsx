import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { format, hasLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';
import { discover, getGenres, movieSortOptions, searchMulti, tvSortOptions } from '@/lib/tmdb/api';
import type { MediaKind, MediaSummary, PersonSummary } from '@/lib/tmdb/types';
import { MediaGrid } from '@/components/media/MediaGrid';
import { PeopleRail } from '@/components/media/PeopleRail';
import { parsePage } from '@/components/pages/PagedGridPage';
import { DiscoverFilters } from '@/components/search/DiscoverFilters';
import { Pagination } from '@/components/ui/Pagination';

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export async function generateMetadata({ params, searchParams }: PageProps<'/[lang]/search'>): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  const query = first((await searchParams).q)?.trim();
  return pageMetadata({
    lang,
    path: '/search',
    title: query ? format(t.resultsFor, { query }) : t.advancedSearch,
    description: t.siteDescription,
    // Filter/result combinations are endless; keep them out of the index.
    noIndex: Boolean(query) || Object.keys(await searchParams).length > 0,
  });
}

export default async function SearchPage({ params, searchParams }: PageProps<'/[lang]/search'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const query = await searchParams;
  const text = first(query.q)?.trim() ?? '';
  const page = parsePage(query.page);
  const t = await getDictionary(lang);

  const buildHref = (pageNumber: number) => {
    const next = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      const single = first(value);
      if (single && key !== 'page') next.set(key, single);
    }
    if (pageNumber > 1) next.set('page', String(pageNumber));
    const search = next.toString();
    return search ? `${routes.search(lang)}?${search}` : routes.search(lang);
  };

  if (text) {
    const data = await searchMulti(text, lang, page);
    const media = data.results.filter((item): item is MediaSummary & { kind: 'media' } => item.kind === 'media');
    const people = data.results.filter((item): item is PersonSummary & { kind: 'person'; media_type: 'person' } => item.kind === 'person');

    return (
      <section className="animate-fade-in-up">
        <h1 className="h1-guru pt-4 pb-8 text-center md:pt-8">{format(t.resultsFor, { query: text })}</h1>
        {data.results.length === 0 && <p className="p-guru py-8 text-center">{t.noResults}</p>}
        <PeopleRail title={t.person} people={people} lang={lang} />
        <MediaGrid items={media} lang={lang} />
        <Pagination currentPage={data.page} totalPages={data.total_pages} hrefForPage={buildHref} t={t} />
      </section>
    );
  }

  const kind: MediaKind = first(query.type) === 'tv' ? 'tv' : 'movie';
  const sortOptions = kind === 'movie' ? movieSortOptions : tvSortOptions;
  const requestedSort = first(query.sort) ?? 'popularity';
  const sort = (sortOptions as readonly string[]).includes(requestedSort) ? requestedSort : 'popularity';
  const order = first(query.order) === 'asc' ? 'asc' : 'desc';
  const selectedGenres = (first(query.genres) ?? '')
    .split(',')
    .map(Number)
    .filter((id) => Number.isInteger(id) && id > 0);

  const [genres, data] = await Promise.all([
    getGenres(kind, lang),
    discover(kind, lang, { genres: selectedGenres, sortBy: sort, order, page }),
  ]);

  return (
    <section className="animate-fade-in-up">
      <h1 className="h1-guru pt-4 pb-8 text-center md:pt-8">{t.advancedSearch}</h1>
      <DiscoverFilters
        kind={kind}
        genres={genres}
        selectedGenres={selectedGenres}
        sort={sort}
        order={order}
        sortOptions={sortOptions}
      />
      {data.results.length > 0 ? (
        <MediaGrid items={data.results} lang={lang} />
      ) : (
        <p className="p-guru py-8 text-center">{t.noResults}</p>
      )}
      <Pagination currentPage={data.page} totalPages={data.total_pages} hrefForPage={buildHref} t={t} />
    </section>
  );
}
