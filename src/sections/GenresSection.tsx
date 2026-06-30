import { Genre } from '@appTypes/genres/genre';
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { translations } from '../i18n/translations';

type GenresSectionProps = {
  genres: Genre[];
};

const GenresSection: React.FC<GenresSectionProps> = ({ genres }) => {
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);
  const t = translations[currentLanguage];

  return (
    <section className="mb-4 md:mb-8">
      <h2 className="h2-guru pb-4 text-center">{t.genresKey}</h2>
      <ul className="flex overflow-x-scroll pb-2 md:pb-0 md:overflow-x-hidden md:flex-wrap gap-4 md:justify-center">
        {genres &&
          genres.map((genre) => (
            /* separate no another component like GenreItem*/
            <li key={genre.id} className="flex flex-col items-center">
              <Link
                to={`/genres/${genre.id}`}
                className="bg-tertiary text-white text-nowrap md:text-wrap px-4 py-2 rounded-lg shadow hover:bg-secondary transition"
              >
                {genre.name}
              </Link>
            </li>
          ))}
      </ul>
    </section>
  );
};

export default GenresSection;
