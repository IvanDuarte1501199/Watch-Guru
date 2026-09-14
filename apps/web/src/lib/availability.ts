import { format } from './i18n/config';
import type { Dictionary } from './i18n/get-dictionary';
import type { ProvidersByCountry } from './tmdb/types';

/** Resold add-on channels ("Max Amazon Channel") duplicate the main service. */
const ADD_ON_CHANNEL = /\bchannels?\b/i;

/** Streaming (flat-rate) service names for a title in one country. */
export function streamingProviderNames(providers: ProvidersByCountry, region: string): string[] {
  return (providers[region]?.flatrate ?? [])
    .map((provider) => provider.provider_name)
    .filter((name) => !ADD_ON_CHANNEL.test(name));
}

/** "X is streaming on Netflix and Max (Mexico)." — a crawlable answer to "where to watch X". */
export function availabilitySentence(
  title: string,
  providers: ProvidersByCountry,
  region: string,
  country: string,
  t: Dictionary,
  lang: string,
): string {
  const names = streamingProviderNames(providers, region).slice(0, 4);
  if (names.length === 0) return format(t.notStreamingIn, { title, country });
  const list = new Intl.ListFormat(lang, { style: 'long', type: 'conjunction' }).format(names);
  return format(t.availableOn, { title, providers: list, country });
}
