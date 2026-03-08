export interface GeoData {
  results: GeoDataItem[];
}

export interface GeoDataItem {
  latitude: number;
  longitude: number;
  timezone: string;
  name: string;
  country: string;
  id: number;
}
