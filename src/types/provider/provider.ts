export interface ProviderProps {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority?: number;
}

export interface CountryProviders {
  link: string;
  flatrate?: ProviderProps[];
  buy?: ProviderProps[];
  rent?: ProviderProps[];
  ads?: ProviderProps[];
}
