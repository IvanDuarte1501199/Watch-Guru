import React from 'react';
import GenreCard from '@components/genres/GenreCard';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { translations } from '../i18n/translations';

export interface FeaturedGenresProps {
  id: number;
  name: string;
  image: string;
  path: string;
}

interface FeaturedGenresSectionProps {
  genres: FeaturedGenresProps[];
}

const FeaturedGenresSection: React.FC<FeaturedGenresSectionProps> = ({ genres }) => {
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);
  const t = translations[currentLanguage];

  if (!genres || genres.length === 0) {
    return <></>;
  }
  return (
    <section className="mb-8 md:mb-16 animate-fade-in">
      <h2 className="h2-guru text-center mb-6">{t.featuredGenres}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {genres && genres.length > 0 && genres.map((genre) => (
          <GenreCard {...genre} key={genre.id} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedGenresSection;
