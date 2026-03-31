import type { GeoItemDto, GeoResponseDto } from "@/entities/location";

export const createGeoData = (
  overrides: Partial<GeoItemDto> = {},
): GeoResponseDto => {
  return {
    results: [{ ...getBerlinGeo(), ...overrides }],
  };
};

const getBerlinGeo = (): GeoItemDto => ({
  latitude: 52.52437,
  longitude: 13.41053,
  timezone: "Europe/Berlin",
  name: "Berlin",
  country: "Germany",
  admin1: "State of Berlin",
  feature_code: "PPLC",
  id: 2950159,
});
