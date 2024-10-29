import { CreditsProps } from "@appTypes/credits/credits";
import { MovieProps } from "@appTypes/movies/movieProps";
import BackgroudImg from "@components/shared/BackgroudImg";
import Credits from "@components/shared/Credits";
import MovieDetails from "@components/movies/MovieDetails";
import MovieMetadata from "@components/movies/MovieMetadata";
import MoviePoster from "@components/movies/MoviePoster";

interface MoviePageSectionProps {
  movie: MovieProps;
  credits?: CreditsProps;
}

const MoviePageSection = ({ movie, credits }: MoviePageSectionProps) => (
  <>
    {movie.backdrop_path && (
      <BackgroudImg src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`} />
    )}
    <section className="relative">
      <div className="container mx-auto pt-4 md:pt-12 pb-8 md:pb-12 text-white">
        <div className="flex flex-col md:flex-row items-start gap-10 justify-between">
          {movie?.poster_path && (
            <MoviePoster src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} />
          )}
          <div className="flex flex-col items-start">
            <MovieDetails movie={movie} />
            <MovieMetadata
              releaseDate={movie?.release_date}
              rating={movie?.vote_average}
              runtime={movie?.runtime}
            />
            <Credits credits={credits} />

          </div>
        </div>
      </div>
    </section>
  </>
);

export default MoviePageSection;
