import { MovieProps } from "../movies/movieProps";
import { TvProps } from "../tv/tvProps";

export type PersonProps = {
    id: number;
    name: string;
    profile_path: string | null;
    popularity: number;
    known_for: (MovieProps | TvProps)[];
    known_for_department: string;
    gender: number; // 0 = Not specified, 1 = Female, 2 = Male
};