import React from 'react';
import { Link } from 'react-router-dom';

type GenresSectionProps = {
    genres: { id: number; name: string }[];
};

const GenresSection: React.FC<GenresSectionProps> = ({ genres }) => {
    return (
        <section className="mb-10">
            <h2 className="h2-guru pb-4 text-center">Genres</h2>
            <ul className="flex flex-wrap gap-4 justify-center">
                {genres &&
                    genres.map((genre) => (
                        <li
                            key={genre.id}
                            className="flex flex-col items-center"
                        >
                            <Link
                                to={`/genres/${genre.id}`}
                                className="bg-tertiary text-white px-4 py-2 rounded-lg shadow hover:bg-secondary transition"
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
