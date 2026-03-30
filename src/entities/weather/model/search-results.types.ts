export interface SearchResult {
  region?: string;
  code?: string;
  city: string;
  country?: string;
  id: number;
  lat: number;
  lon: number;
  temperature: number;
  temperatureUnit: string;
  weatherCode: number;
}

export type SearchResults = SearchResult[];
