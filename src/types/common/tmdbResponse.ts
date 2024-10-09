import { GenericItemProps } from "./genericItemProps";

export interface TmdbResponse {
    page: number;
    results: GenericItemProps[];
    total_results: number;
    total_pages: number;
}