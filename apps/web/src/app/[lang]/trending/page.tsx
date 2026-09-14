import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/seo';
import { getTrendingAll } from '@/lib/tmdb/api';
import { tmdbImage } from '@/lib/tmdb/images';
import { PagedGridPage, parsePage } from '@/components/pages/PagedGridPage';

export async function generateMetadata({ params }: PageProps<'/[lang]/trending'>): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return pageMetadata({ lang, path: '/trending', title: t.trendingAll, description: t.siteDescription });
}

export default async function TrendingPage({ params, searchParams }: PageProps<'/[lang]/trending'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const page = parsePage((await searchParams).page);
  const [t, data] = await Promise.all([getDictionary(lang), getTrendingAll(lang, page)]);

  return (
    <PagedGridPage
      title={t.trendingAll}
      data={data}
      basePath={routes.trending(lang)}
      lang={lang}
      t={t}
      backdrop={tmdbImage(data.results[0]?.backdrop_path, 'original')}
    />
  );
}
