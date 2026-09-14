import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { getGenres } from '@/lib/tmdb/api';
import type { Genre } from '@/lib/tmdb/types';
import { MatchRoom } from '@/components/match/MatchRoom';

/** Genres that don't make sense to pick for a group movie night. */
const HIDDEN_GENRES = new Set([10763, 10767, 10770]);

export async function generateMetadata({ params }: PageProps<'/[lang]/match/[code]'>): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return { title: t.matchTitle, description: t.joinRoomSubtitle, robots: { index: false, follow: false } };
}

export default async function MatchRoomPage({ params }: PageProps<'/[lang]/match/[code]'>) {
  const { lang, code } = await params;
  if (!hasLocale(lang) || !/^[A-Za-z0-9]{4,12}$/.test(code)) notFound();

  const [movie, tv] = await Promise.all([getGenres('movie', lang), getGenres('tv', lang)]);
  const visible = (list: Genre[]) => list.filter((genre) => !HIDDEN_GENRES.has(genre.id));
  const byName = (a: Genre, b: Genre) => a.name.localeCompare(b.name, lang);

  // Rooms with both kinds use movie genres plus the TV-only ones.
  const both = [...visible(movie), ...visible(tv).filter((genre) => !movie.some((item) => item.id === genre.id))];

  return (
    <MatchRoom
      code={code.toUpperCase()}
      genres={{ movie: visible(movie).sort(byName), tv: visible(tv).sort(byName), both: both.sort(byName) }}
    />
  );
}
