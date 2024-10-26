import React from 'react';
import { Genre } from 'c:/Users/IvanD/Desktop/Proyectos/tv-shows-recommendations/src/types/genres/genre';

interface GenresListProps {
  genres: Genre[];
}

const GenresList: React.FC<GenresListProps> = ({ genres }) => {
  if (!genres || genres.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-2">Genres</h3>
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <span
            key={genre.id}
            className="bg-green-600 px-3 py-1 rounded-full text-sm font-semibold"
          >
            {genre.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default GenresList;
