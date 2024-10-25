import { MediaType } from '@appTypes/common/MediaType';
import { MovieProps } from '../movies/movieProps';
import { TvProps } from '../tv/tvProps';
import { Genre } from '@appTypes/genres/genre';

export type PersonProps = {
  id: number;
  name: string;
  profile_path: string | null;
  popularity: number;
  known_for: (MovieProps | TvProps)[];
  known_for_department: string;
  gender: number;
  media_type: MediaType;
  genres: Genre[];
  biography: string;
  place_of_birth: string
  birthday: string;
  homepage: string;
  also_known_as: string[];
};
