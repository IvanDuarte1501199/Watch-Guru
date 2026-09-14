import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';
import { routes } from '@/lib/routes';
import { genreImage } from '@/lib/site';
import type { Genre, MediaKind } from '@/lib/tmdb/types';

interface GenreSectionProps {
  title: string;
  genres: Genre[];
  kind: MediaKind;
  lang: Locale;
}

export function GenreChips({ title, genres, kind, lang }: GenreSectionProps) {
  if (genres.length === 0) return null;

  return (
    <section className="mb-8 md:mb-12">
      <h2 className="h2-guru pb-4 text-center">{title}</h2>
      <ul className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:justify-center md:overflow-visible md:px-0">
        {genres.map((genre) => (
          <li key={genre.id} className="shrink-0">
            <Link
              href={routes.genre(lang, kind, genre.id, genre.name)}
              className="block rounded-lg bg-tertiary px-4 py-2 text-sm font-medium whitespace-nowrap text-white shadow transition hover:bg-secondary hover:text-slate-950"
            >
              {genre.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function FeaturedGenres({ title, genres, kind, lang }: GenreSectionProps) {
  const withImages = genres.filter((genre) => genreImage(genre.id));
  if (withImages.length === 0) return null;

  return (
    <section className="mb-10 animate-fade-in md:mb-16">
      <h2 className="h2-guru mb-6 text-center">{title}</h2>
      <ul className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-5">
        {withImages.map((genre) => (
          <li key={genre.id}>
            <Link
              href={routes.genre(lang, kind, genre.id, genre.name)}
              className="group relative block aspect-video overflow-hidden rounded-xl shadow-md"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                loading="lazy"
                src={genreImage(genre.id)!}
                alt=""
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/60" />
              <span className="absolute inset-0 flex items-center justify-center p-2 text-center text-lg font-semibold text-white transition-transform duration-300 group-hover:scale-110 md:text-xl">
                {genre.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
