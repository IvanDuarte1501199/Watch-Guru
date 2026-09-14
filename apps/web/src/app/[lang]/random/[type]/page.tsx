import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { personalPick } from '@/lib/backend';
import { hasLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { pageMetadata } from '@/lib/seo';
import { getRandomMediaId } from '@/lib/tmdb/api';
import type { MediaKind } from '@/lib/tmdb/types';
import { RandomBanner } from '@/components/detail/RandomBanner';
import { loadMedia } from '@/components/pages/detailRoutes';
import { MediaDetailView } from '@/components/pages/MediaDetailView';

// A new pick on every visit.
export const dynamic = 'force-dynamic';

const kinds: Record<string, MediaKind> = { movie: 'movie', 'tv-show': 'tv' };

export async function generateMetadata({ params }: PageProps<'/[lang]/random/[type]'>): Promise<Metadata> {
  const { lang, type } = await params;
  if (!hasLocale(lang) || !kinds[type]) return {};
  const t = await getDictionary(lang);
  return pageMetadata({
    lang,
    path: `/random/${type}`,
    title: kinds[type] === 'movie' ? t.randomMovie : t.randomTvShow,
    description: t.magicSuggestBody,
    noIndex: true,
  });
}

export default async function RandomPage({ params }: PageProps<'/[lang]/random/[type]'>) {
  const { lang, type } = await params;
  const kind = kinds[type];
  if (!hasLocale(lang) || !kind) notFound();

  const personalId = await personalPick(kind);
  const personal = personalId ? await loadMedia(kind, personalId, lang) : null;
  if (personal) {
    return <MediaDetailView media={personal} lang={lang} banner={<RandomBanner personalized />} />;
  }

  // A title can disappear from TMDB between the discover call and the lookup; retry a couple of times.
  for (let attempt = 0; attempt < 3; attempt++) {
    const id = await getRandomMediaId(kind, lang);
    const media = id ? await loadMedia(kind, id, lang) : null;
    if (media) return <MediaDetailView media={media} lang={lang} banner={<RandomBanner />} />;
  }
  throw new Error('Could not find a random title');
}
