import { MovieProps } from "@appTypes/movies/movieProps";
import { TvProps } from "@appTypes/tv/tvProps";
import { GenericItemProps } from "./genericItemProps";

export interface TmdbMovieResponse {
    page: number;
    results: MovieProps[];
    total_results: number;
    total_pages: number;
}

export interface TmdbTvShowResponse {
    page: number;
    results: TvProps[];
    total_results: number;
    total_pages: number;
}

export interface TmdbGenericResponse {
    page: number;
    results: GenericItemProps[];
    total_results: number;
    total_pages: number;
}

