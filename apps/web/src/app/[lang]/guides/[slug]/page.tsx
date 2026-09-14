import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findGuide, genreLabel, guideHeading, guideRegion, guideSlug, listGuides } from '@/lib/guides';
import { format, hasLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';
import { discover, getCountries, getGenres } from '@/lib/tmdb/api';
import { tmdbImage } from '@/lib/tmdb/images';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { RankedList } from '@/components/seo/RankedList';
import { AdSlot } from '@/components/ads/AdSlot';

export const revalidate = 3600;

// Rendered on first request, then cached.
export function generateStaticParams() {
  return [];
}

/** Guides with fewer titles than this are kept out of the index as thin content. */
const MIN_INDEXABLE_ITEMS = 8;

async function loadGuide(params: PageProps<'/[lang]/guides/[slug]'>['params']) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const guide = await findGuide(lang, slug);
  if (!guide) notFound();

  const region = guideRegion[lang];
  const today = new Date();
  const daysAgo = (days: number) => new Date(today.getTime() - days * 86_400_000).toISOString().slice(0, 10);
  const data = await discover(
    guide.kind,
    lang,
    guide.mode === 'new'
      ? {
          providers: guide.provider ? [guide.provider.id] : undefined,
          region: guide.provider ? region : undefined,
          // Catalogs add older titles too; a year back keeps service lists full, 90 days for general releases.
          releasedAfter: daysAgo(guide.provider ? 365 : 90),
          releasedBefore: today.toISOString().slice(0, 10),
          sortBy: guide.provider ? (guide.kind === 'movie' ? 'primary_release_date' : 'first_air_date') : 'popularity',
          minVotes: guide.provider ? 5 : 20,
        }
      : {
          genres: guide.genre ? [guide.genre.id] : undefined,
          providers: guide.provider ? [guide.provider.id] : undefined,
          region: guide.provider ? region : undefined,
          sortBy: 'vote_average',
          minVotes: guide.provider ? 80 : guide.kind === 'movie' ? 800 : 300,
        },
  );
  return { lang, guide, region, items: data.results.filter((item) => item.poster_path) };
}

export async function generateMetadata({ params }: PageProps<'/[lang]/guides/[slug]'>): Promise<Metadata> {
  const { lang, guide, items } = await loadGuide(params);
  const t = await getDictionary(lang);
  const heading = guideHeading(guide, lang, t, { withMonth: true });
  const year = new Date().getFullYear();
  const topTitles = items.slice(0, 3).map((item) => item.title).join(', ');

  // Genre names (and so slugs) are translated; point the other language at its own slug.
  const otherLang = lang === 'es' ? 'en' : 'es';
  const otherGenre = guide.genre
    ? ((await getGenres(guide.kind, otherLang)).find((genre) => genre.id === guide.genre!.id) ?? null)
    : null;

  return pageMetadata({
    lang,
    path: `/guides/${guide.slug}`,
    alternatePath: `/guides/${guideSlug(otherLang, guide.kind, otherGenre, guide.provider, guide.mode)}`,
    title: guide.mode === 'new' ? heading : `${heading} (${year})`,
    description: `${heading}: ${topTitles}${items.length > 3 ? '…' : ''} ${t.guidesDescription}`.slice(0, 160),
    image: tmdbImage(items[0]?.backdrop_path, 'w1280'),
    noIndex: items.length < MIN_INDEXABLE_ITEMS,
  });
}

export default async function GuidePage({ params }: PageProps<'/[lang]/guides/[slug]'>) {
  const { lang, guide, region, items } = await loadGuide(params);
  const [t, genres, countries, allGuides] = await Promise.all([
    getDictionary(lang),
    getGenres(guide.kind, lang),
    guide.provider ? getCountries(lang) : Promise.resolve([]),
    listGuides(lang),
  ]);

  const heading = guideHeading(guide, lang, t, { withMonth: true });
  const country = countries.find((item) => item.iso_3166_1 === region)?.native_name ?? region;
  const values = {
    count: items.length,
    kind: guide.kind === 'movie' ? t.kindMoviesPlural : t.kindTvPlural,
    genre: guide.genre ? genreLabel(lang, guide.genre) : '',
    provider: guide.provider?.name ?? '',
    country,
  };
  const intro =
    guide.mode === 'new'
      ? format(guide.provider ? t.guideIntroNewProvider : t.guideIntroNew, values)
      : guide.genre && guide.provider
      ? format(t.guideIntroGenreProvider, values)
      : guide.provider
        ? format(t.guideIntroProvider, values)
        : format(t.guideIntroGenre, values);

  // Related: the same genre on other services and the same service with other genres.
  const related = allGuides
    .filter((other) => other.slug !== guide.slug && other.kind === guide.kind)
    .filter(
      (other) =>
        (guide.mode === 'new' && other.mode === 'new') ||
        (guide.provider && other.mode === 'new' && other.provider?.id === guide.provider.id) ||
        (guide.genre && other.genre?.id === guide.genre.id) ||
        (guide.provider && other.provider?.id === guide.provider.id && (!guide.genre || !other.genre)),
    )
    .slice(0, 12);

  return (
    <article className="mx-auto max-w-4xl pb-12">
      <Breadcrumbs
        label={t.breadcrumb}
        items={[
          { name: t.home, href: routes.home(lang) },
          { name: t.guides, href: routes.guides(lang) },
          { name: heading, href: routes.guide(lang, guide.slug) },
        ]}
      />

      <header className="pt-6 pb-8">
        <h1 className="h1-guru">{heading}</h1>
        <p className="p-guru mt-4">{intro}</p>
        <p className="mt-3 text-xs text-slate-500">
          {format(t.guideUpdated, {
            date: new Date().toLocaleDateString(lang, { month: 'long', year: 'numeric' }),
          })}
          {guide.provider && ` · ${format(t.guideAvailabilityNote, { country })}`}
        </p>
      </header>

      {items.length > 0 ? (
        <RankedList items={items} lang={lang} genreNames={new Map(genres.map((g) => [g.id, g.name]))} name={heading} />
      ) : (
        <p className="p-guru py-10 text-center">{t.guideEmpty}</p>
      )}

      <AdSlot />

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="h2-guru mb-4">{t.relatedGuides}</h2>
          <ul className="flex flex-wrap gap-2">
            {related.map((other) => (
              <li key={other.slug}>
                <Link
                  href={routes.guide(lang, other.slug)}
                  className="block rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm text-slate-200 transition hover:border-secondary hover:text-white"
                >
                  {guideHeading(other, lang, t)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
