import { MediaType } from '@appTypes/common/MediaType';
import { Genre } from '@appTypes/genres/genre';

export type PersonProps = {
  id: number;
  name: string;
  profile_path: string | null;
  popularity: number;
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
