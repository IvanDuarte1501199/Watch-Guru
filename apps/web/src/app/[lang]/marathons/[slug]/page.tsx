import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Clock, Film, Tv } from 'lucide-react';
import { defaultWatchRegion, format, hasLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { findMarathon, marathons } from '@/lib/marathons/data';
import { loadMarathon, loadMarathonCards } from '@/lib/marathons/load';
import { formatDuration, totalMinutes } from '@/lib/marathons/view';
import { routes } from '@/lib/routes';
import { pageMetadata, summarize } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';
import { tmdbImage } from '@/lib/tmdb/images';
import { JsonLd } from '@/components/JsonLd';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { MarathonCardLink } from '@/components/marathons/MarathonCardLink';
import { MarathonView } from '@/components/marathons/MarathonView';
import { Carousel } from '@/components/ui/Carousel';

export const revalidate = 86400;

// Rendered on first request, then cached.
export function generateStaticParams() {
  return [];
}

async function resolve(params: PageProps<'/[lang]/marathons/[slug]'>['params']) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const marathon = findMarathon(slug);
  if (!marathon) notFound();
  return { lang, marathon };
}

export async function generateMetadata({ params }: PageProps<'/[lang]/marathons/[slug]'>): Promise<Metadata> {
  const { lang, marathon } = await resolve(params);
  const [t, [card]] = await Promise.all([getDictionary(lang), loadMarathonCards([marathon], lang)]);
  return pageMetadata({
    lang,
    path: `/marathons/${marathon.slug}`,
    title: format(t.marathonMetaTitle, { name: marathon.name[lang], year: new Date().getFullYear() }),
    description: summarize(marathon.intro[lang]),
    image: tmdbImage(card.backdropPath, 'w1280'),
  });
}

export default async function MarathonPage({ params }: PageProps<'/[lang]/marathons/[slug]'>) {
  const { lang, marathon } = await resolve(params);
  const [t, { items, providers }, cards] = await Promise.all([
    getDictionary(lang),
    loadMarathon(marathon, lang),
    loadMarathonCards(marathons, lang),
  ]);

  const name = marathon.name[lang];
  const heading = format(t.marathonHeading, { name });
  const cover = items.find((item) => `${item.kind}:${item.id}` === marathon.cover)?.backdropPath;
  const movies = items.filter((item) => item.kind === 'movie').length;
  const series = items.length - movies;
  const others = cards.filter((card) => card.slug !== marathon.slug);

  return (
    <div style={{ '--accent': marathon.accent } as React.CSSProperties} className="pb-16">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: heading,
          itemListOrder: 'https://schema.org/ItemListOrderAscending',
          numberOfItems: items.length,
          itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${SITE_URL}${routes.media(lang, item.kind, item.id, item.title)}`,
            name: item.title,
          })),
        }}
      />
      <Breadcrumbs
        label={t.breadcrumb}
        items={[
          { name: t.home, href: routes.home(lang) },
          { name: t.marathons, href: routes.marathons(lang) },
          { name, href: routes.marathon(lang, marathon.slug) },
        ]}
      />

      <header className="relative mt-4 mb-6 overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950">
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={tmdbImage(cover, 'w1280')!} alt="" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-[50%_25%] opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        <div className="absolute -bottom-32 -left-20 h-72 w-96 rounded-full bg-[var(--accent)] opacity-25 blur-3xl" />

        <div className="relative flex max-w-2xl flex-col gap-4 p-6 pt-24 md:p-10 md:pt-32">
          <span className="flex items-center gap-2 self-start rounded-full border border-white/15 bg-slate-950/60 px-3 py-1 text-xs font-bold tracking-[0.14em] text-white uppercase backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            {t.marathonEyebrow}
          </span>
          <h1 className="text-4xl leading-[0.95] font-black tracking-tight text-balance text-white md:text-6xl">{heading}</h1>
          <p className="text-base text-slate-300 md:text-lg">{marathon.tagline[lang]}</p>
          <ul className="flex flex-wrap gap-2 pt-1 text-sm font-semibold text-slate-200">
            <li className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 backdrop-blur">
              <Clock className="h-4 w-4 text-secondary" aria-hidden />
              {format(t.marathonDuration, { duration: formatDuration(totalMinutes(items)) })}
            </li>
            {movies > 0 && (
              <li className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 backdrop-blur">
                <Film className="h-4 w-4 text-secondary" aria-hidden />
                {movies === 1 ? t.marathonMovieOne : format(t.marathonMoviesCount, { count: movies })}
              </li>
            )}
            {series > 0 && (
              <li className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 backdrop-blur">
                <Tv className="h-4 w-4 text-secondary" aria-hidden />
                {series === 1 ? t.marathonSeriesOne : format(t.marathonSeriesCount, { count: series })}
              </li>
            )}
          </ul>
        </div>
      </header>

      <div className="mb-8 max-w-3xl space-y-3">
        <p className="p-guru">{marathon.intro[lang]}</p>
        {marathon.note && <p className="text-sm text-slate-400">{marathon.note[lang]}</p>}
      </div>

      <MarathonView
        items={items}
        providers={providers}
        eras={marathon.eras.map((era) => ({ id: era.id, label: era.label[lang] }))}
        eraLabel={marathon.eraLabel[lang]}
        arcs={marathon.arcs.map((arc) => ({ id: arc.id, label: arc.label[lang] }))}
        accent={marathon.accent}
        defaultRegion={defaultWatchRegion[lang]}
      />

      <section className="mt-16">
        <h2 className="h2-guru mb-4">{t.marathonOthers}</h2>
        <Carousel label={t.marathonOthers} itemClassName="w-[260px]">
          {others.map((card) => (
            <MarathonCardLink key={card.slug} card={card} lang={lang} t={t} />
          ))}
        </Carousel>
      </section>
    </div>
  );
}
