import { Layout } from '@components/Layout';
import { useMovie } from '@hooks/movies/useMovie';
import React from 'react';
import { useParams } from 'react-router-dom';

const MovieInfo: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) {
        return <p>Movie ID is missing.</p>;
    }

    const { movie, loading, error } = useMovie(id);

    if (loading) return <p className="text-center">Loading movie details...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <Layout>
            <div className="relative">
                {/* Background image */}
                {movie?.backdrop_path && (
                    <div
                        className="absolute top-0 left-0 w-full h-full -z-10 bg-cover bg-center opacity-40"
                        style={{
                            backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`,
                        }}
                    ></div>
                )}

                <div className="container mx-auto px-4 py-20 text-white">
                    <div className="flex flex-col md:flex-row">
                        {movie?.poster_path && (
                            <img
                                loading='lazy'
                                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                                alt={movie.title}
                                className="w-full md:w-1/3 rounded-lg shadow-lg"
                            />
                        )}

                        <div className="md:ml-10 mt-6 md:mt-0">
                            <h1 className="text-4xl font-bold mb-4">{movie?.title}</h1>

                            {movie?.tagline && (
                                <p className="italic text-lg text-gray-300 mb-4">
                                    "{movie.tagline}"
                                </p>
                            )}

                            <p className="text-lg mb-6">{movie?.overview}</p>

                            {movie?.genres && movie.genres.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-xl font-semibold mb-2">Genres</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {movie.genres.map((genre: any) => (
                                            <span
                                                key={genre.id}
                                                className="bg-blue-600 px-3 py-1 rounded-full text-sm font-semibold"
                                            >
                                                {genre.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <p className="text-lg">
                                    <strong>Release Date:</strong> {movie?.release_date}
                                </p>
                                <p className="text-lg">
                                    <strong>Rating:</strong> {movie?.vote_average} / 10
                                </p>
                                <p className="text-lg">
                                    <strong>Runtime:</strong> {movie?.runtime} minutes
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default MovieInfo;