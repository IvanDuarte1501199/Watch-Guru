import React from 'react';
import GenreCard from '@components/genres/GenreCard';
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
  if (!genres || genres.length === 0) {
    return <></>;
  }
  return (
    <section className="mb-8 md:mb-16">
      <h2 className="h2-guru text-center mb-2">Featured Genres</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {genres && genres.length > 0 && genres.map((genre) => (
          <GenreCard {...genre} key={genre.id} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedGenresSection;
