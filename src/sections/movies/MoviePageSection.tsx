import { CreditsProps } from "@appTypes/credits/credits";
import { MovieProps } from "@appTypes/movies/movieProps";
import Credits from "@components/Credits";
import GenresList from "@components/GenreList";

interface MoviePageSectionProps {
  movie: MovieProps
  credits?: CreditsProps
}

const MoviePageSection = ({ movie, credits }: MoviePageSectionProps) => {
  return (
    <section className="relative">
      <div className="container mx-auto px-4 pt-4 md:pt-12 pb-8 md:pb-12 text-white">
        <div className="flex flex-col md:flex-row items-start">
          {movie?.poster_path && (
            <img
              loading="lazy"
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              alt={movie.title}
              className="w-full md:w-1/3 rounded-lg shadow-lg object-contain animate-fade-in-right"
            />
          )}

          <div className="md:ml-10 mt-6 md:mt-0 animate-fade-in-left">
            <h1 className="text-4xl font-bold mb-4">{movie?.title}</h1>

            {movie?.tagline && (
              <p className="italic text-lg text-gray-300 mb-4">
                "{movie.tagline}"
              </p>
            )}

            <p className="text-lg mb-4">{movie?.overview}</p>


            {movie?.genres && <GenresList genres={movie.genres} />}


            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              {movie?.release_date && <p className="text-lg">
                <strong>Release Date:</strong> {new Date(movie.release_date).toLocaleDateString()}
              </p>}
              <p className="text-lg">
                <strong>Rating:</strong> {movie?.vote_average} / 10
              </p>
              <p className="text-lg">
                <strong>Runtime:</strong> {movie?.runtime} minutes
              </p>
            </div>


            <Credits credits={credits} />

          </div>
        </div>
      </div>
    </section>
  );
};

export default MoviePageSection;
