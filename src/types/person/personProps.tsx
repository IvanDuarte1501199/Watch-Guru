import { MediaType } from '@appTypes/common/MediaType';
import { MovieProps } from '../movies/movieProps';
import { TvProps } from '../tv/tvProps';

export type PersonProps = {
  id: number;
  name: string;
  profile_path: string | null;
  popularity: number;
  known_for: (MovieProps | TvProps)[];
  known_for_department: string;
  gender: number;
  media_type: MediaType;
};
