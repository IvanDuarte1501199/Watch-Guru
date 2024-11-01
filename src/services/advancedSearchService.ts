import { MediaType } from "@appTypes/common/MediaType";
import tmdbApi from "./tmdbApi";
import { TmdbGenericResponse } from "@appTypes/common/tmdbResponse";

interface AdvancedSearchParams {
  sort_by: string;
  with_genres?: string;
  page: number;
  include_adult: boolean;
  [key: string]: any;
}

export const advancedSearch = async (
  mediaType: MediaType,
  params: AdvancedSearchParams
) => {
  const endpoint = mediaType === MediaType.Movie ? '/discover/movie' : '/discover/tv';
  console.log('params', params);
  try {
    const response = await tmdbApi.get<TmdbGenericResponse>(endpoint, { params });
    console.log('response.data', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in advanced search:', error);
    throw error;
  }
};
