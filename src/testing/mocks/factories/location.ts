import type { GeoData, GeoDataItem } from "@/types/api/GeoData";

export const createGeoData = (
  overrides: Partial<GeoDataItem> = {},
): GeoData => {
  return {
    results: [{ ...getBerlinGeo(), ...overrides }],
  };
};

const getBerlinGeo = (): GeoDataItem => ({
  latitude: 52.52437,
  longitude: 13.41053,
  timezone: "Europe/Berlin",
  name: "Berlin",
  country: "Germany",
  admin1: "State of Berlin",
  feature_code: "PPLC",
  id: 2950159,
});
