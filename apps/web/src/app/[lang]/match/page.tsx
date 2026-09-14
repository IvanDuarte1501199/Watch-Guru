import type { Metadata } from 'next';
import { hasLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { pageMetadata } from '@/lib/seo';
import { MatchLanding } from '@/components/match/MatchLanding';

export async function generateMetadata({ params }: PageProps<'/[lang]/match'>): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return pageMetadata({ lang, path: '/match', title: t.matchTitle, description: t.matchDescription });
}

export default function MatchPage() {
  return <MatchLanding />;
}
