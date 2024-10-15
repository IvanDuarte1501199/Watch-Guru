import { Genre } from '@appTypes/genres/genre';
import React from 'react';
import { Link } from 'react-router-dom';

type GenresSectionProps = {
  genres: Genre[];
};

const GenresSection: React.FC<GenresSectionProps> = ({ genres }) => {
  return (
    <section className="mb-4 md:mb-10">
      <h2 className="h2-guru pb-4 text-center">Genres</h2>
      <ul className="flex overflow-x-scroll pb-2 md:pb-0 md:overflow-x-hidden md:flex-wrap gap-4 md:justify-center">
        {genres &&
          genres.map((genre) => (
            /* separate no another component */
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
