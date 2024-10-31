export interface ProviderProps {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority?: number;
}

export type CountryAvailability = {
  link: string;
  flatrate?: ProviderProps[];
  rent?: ProviderProps[];
  buy?: ProviderProps[];
};


export type MovieAvailability = {
  id: number;
  results: Record<string, CountryAvailability>;
};
