import React from 'react';
import { Link } from 'react-router-dom';

const featuredGenres = [
    { id: 1, name: 'Horror', image: '/horror.jpg', path: '/genres/horror' },
    { id: 2, name: 'Cartoons', image: '/cartoons.jpg', path: '/genres/cartoons' },
    { id: 3, name: 'Comedy', image: '/comedy.jpg', path: '/genres/comedy' },
    { id: 4, name: 'Dramas', image: '/dramas.jpg', path: '/genres/dramas' },
    { id: 5, name: 'Sci-Fi', image: '/scifi.jpg', path: '/genres/scifi' },
];

const FeaturedGenresSection: React.FC = () => {
    return (
        <section className="mb-10">
            <h2 className="h2-guru text-center mb-2">Featured Genres</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {featuredGenres.map((genre) => (
                    <Link
                        key={genre.id}
                        to={genre.path}
                        className="relative overflow-hidden rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105"
                    >
                        <img
                            loading='lazy'
                            src={genre.image}
                            alt={genre.name}
                            className="w-full h-full object-cover transition-transform duration-300"
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-50">
                            <h3 className="p-guru text-center transition-transform duration-300 transform hover:-translate-y-2">
                                {genre.name}
                            </h3>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default FeaturedGenresSection;