export type CreditsProps = {
  id: number;
  cast: CastProps[];
  crew: CrewProps[];
};

export type CastProps = {
  adult: boolean,
  gender: number,
  id: number,
  known_for_department: string,
  name: string,
  original_name: string,
  popularity: number,
  profile_path: string,
  cast_id: number,
  character: string,
  credit_id: string,
  order: number
};

export type CrewProps = {
  adult: boolean,
  gender: number,
  id: number,
  known_for_department: string,
  name: string,
  original_name: string,
  popularity: number,
  profile_path: string,
  cast_id: number,
  credit_id: string,
  department: string,
  job: string
};


