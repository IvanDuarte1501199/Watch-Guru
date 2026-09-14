import { notFound } from 'next/navigation';
import { defaultWatchRegion, hasLocale } from '@/lib/i18n/config';
import { getCountries, getGenres } from '@/lib/tmdb/api';
import type { Genre } from '@/lib/tmdb/types';
import { privatePageMetadata } from '@/components/pages/privatePage';
import { TasteForm } from '@/components/taste/TasteForm';

/** TV-only genres worth asking about; the rest overlap with movie genres. */
const TV_ONLY_GENRES = new Set([10762, 10764, 10766]);
/** Not useful as a taste signal. */
const HIDDEN_GENRES = new Set([10770]);

export function generateMetadata({ params }: PageProps<'/[lang]/taste'>) {
  return privatePageMetadata(params, 'myTaste');
}

export default async function TastePage({ params }: PageProps<'/[lang]/taste'>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const [movieGenres, tvGenres, countries] = await Promise.all([
    getGenres('movie', lang),
    getGenres('tv', lang),
    getCountries(lang),
  ]);

  const genres: Genre[] = [
    ...movieGenres.filter((genre) => !HIDDEN_GENRES.has(genre.id)),
    ...tvGenres.filter((genre) => TV_ONLY_GENRES.has(genre.id)),
  ].sort((a, b) => a.name.localeCompare(b.name, lang));

  const countryOptions = countries
    .map((country) => ({ code: country.iso_3166_1, name: country.native_name }))
    .sort((a, b) => a.name.localeCompare(b.name, lang));

  return <TasteForm genres={genres} countries={countryOptions} defaultRegion={defaultWatchRegion[lang]} />;
}
