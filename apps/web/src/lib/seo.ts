import type { Metadata } from 'next';
import { locales, type Locale } from './i18n/config';
import { SITE_NAME, SITE_URL } from './site';

interface PageMetadataInput {
  lang: Locale;
  /** Path after the locale prefix, e.g. `/movies/popular`. Empty string for home. */
  path: string;
  title?: string;
  description?: string;
  image?: string | null;
  /** Path to use for the other locales when it differs (e.g. slugs are translated). */
  alternatePath?: string;
  noIndex?: boolean;
  /** Use the title as-is, without the "| WatchGuru" suffix. */
  absoluteTitle?: boolean;
}

const localeTags: Record<Locale, string> = { es: 'es_ES', en: 'en_US' };

export function pageMetadata({
  lang,
  path,
  title,
  description,
  image,
  alternatePath,
  noIndex,
  absoluteTitle,
}: PageMetadataInput): Metadata {
  const canonical = `${SITE_URL}/${lang}${path}`;
  const languages = Object.fromEntries(
    locales.map((locale) => [locale, `${SITE_URL}/${locale}${locale === lang ? path : (alternatePath ?? path)}`]),
  );
  // Pages without artwork get a branded card with their title.
  const socialImage =
    image ?? `${SITE_URL}/og?${new URLSearchParams({ title: title ?? SITE_NAME, subtitle: description ?? '' })}`;

  return {
    title: absoluteTitle && title ? { absolute: title } : title,
    description,
    alternates: { canonical, languages: { ...languages, 'x-default': languages.es } },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: localeTags[lang],
      url: canonical,
      title: title ?? SITE_NAME,
      description,
      images: [image ? { url: image } : { url: socialImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: title ?? SITE_NAME,
      description,
      images: [socialImage],
    },
    robots: noIndex ? { index: false, follow: true } : undefined,
  };
}

/** Trims an overview to a meta-description friendly length. */
export function summarize(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
}
