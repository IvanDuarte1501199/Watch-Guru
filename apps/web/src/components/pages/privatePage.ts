import type { Metadata } from 'next';
import { hasLocale } from '@/lib/i18n/config';
import { getDictionary, type Dictionary } from '@/lib/i18n/get-dictionary';

/** Metadata for account pages: localized title, kept out of search results. */
export async function privatePageMetadata(
  params: Promise<{ lang: string }>,
  titleKey: keyof Dictionary,
): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return { title: t[titleKey], robots: { index: false, follow: false } };
}
