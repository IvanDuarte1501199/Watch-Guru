export const locales = ['es', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'es';

export const LOCALE_COOKIE = 'NEXT_LOCALE';

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** Language sent to TMDB for each locale. */
export const tmdbLanguage: Record<Locale, string> = {
  es: 'es-ES',
  en: 'en-US',
};

/** Country used for "where to watch" before we know the viewer's own. */
export const defaultWatchRegion: Record<Locale, string> = {
  es: 'MX',
  en: 'US',
};

/** Replaces `{name}` placeholders in a dictionary string. */
export function format(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
