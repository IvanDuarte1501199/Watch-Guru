import { MovieProps } from "@appTypes/movies/movieProps";
import MovieDetails from "@components/movies/MovieDetails";
import MovieMetadata from "@components/movies/MovieMetadata";
import MoviePoster from "@components/movies/MoviePoster";
import { CountryProviders } from "@appTypes/provider/provider";
import ProvidersInfo from "@components/provider/ProvidersInfo";

interface MoviePageSectionProps {
  movie: MovieProps;
  providers?: CountryProviders;
}

const MoviePageSection = ({ movie, providers }: MoviePageSectionProps) => (
  <>
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
            {/* Enlace de visualización */}
            {providers && providers.link && (
              <p className="p-guru mb-4">
                Watch here:{" "}
                <a href={providers.link} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-tertiary underline">
                  {providers.link}
                </a>
              </p>
            )}
            <ProvidersInfo providers={providers || {} as CountryProviders} />
          </div>
        </div>
      </div>
    </section>
  </>
);

export default MoviePageSection;
