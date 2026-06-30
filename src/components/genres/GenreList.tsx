import React from 'react';
import { Genre } from '@appTypes/genres/genre';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { translations } from '../../i18n/translations';

interface GenresListProps {
  genres: Genre[];
}

const GenresList: React.FC<GenresListProps> = ({ genres }) => {
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);
  const t = translations[currentLanguage];

  if (!genres || genres.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="h2-guru text-xl font-semibold mb-2">{t.genresKey}</h2>
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
