import React from 'react';
import GenreCard from '@components/genres/GenreCard';

const featuredGenres = [
  { id: 1, name: 'Horror', image: '/horror.jpg', path: '/genres/28' },
  {
    id: 2,
    name: 'Cartoons',
    image: '/cartoons.jpg',
    path: '/genres/cartoons',
  },
  { id: 3, name: 'Comedy', image: '/comedy.jpg', path: '/genres/28' },
  { id: 4, name: 'Dramas', image: '/dramas.jpg', path: '/genres/28' },
  { id: 5, name: 'Sci-Fi', image: '/scifi.jpg', path: '/genres/28' },
];

const FeaturedGenresSection: React.FC = () => {

  return (
    <section className="mb-10">
      <h2 className="h2-guru text-center mb-2">Featured Genres</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {featuredGenres.map((genre) => (
          <GenreCard {...genre} key={genre.id} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedGenresSection;
