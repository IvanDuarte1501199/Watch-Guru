import { notFound, permanentRedirect } from 'next/navigation';
import { hasLocale } from '@/lib/i18n/config';
import { parseIdParam, routes } from '@/lib/routes';
import { getGenres } from '@/lib/tmdb/api';

/** Legacy `/genres/:id` URLs from the old SPA, which didn't say whether the genre was for movies or TV. */
export default async function LegacyGenrePage({ params }: PageProps<'/[lang]/genres/[id]'>) {
  const { lang, id } = await params;
  const genreId = parseIdParam(id);
  if (!hasLocale(lang) || genreId === null) notFound();

  const [movieGenres, tvGenres] = await Promise.all([getGenres('movie', lang), getGenres('tv', lang)]);
  const movieGenre = movieGenres.find((genre) => genre.id === genreId);
  if (movieGenre) permanentRedirect(routes.genre(lang, 'movie', movieGenre.id, movieGenre.name));
  const tvGenre = tvGenres.find((genre) => genre.id === genreId);
  if (tvGenre) permanentRedirect(routes.genre(lang, 'tv', tvGenre.id, tvGenre.name));
  notFound();
}
