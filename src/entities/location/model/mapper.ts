import type { GeoResponseDto } from "../api/dto";

export const mapToGeoData = (data: GeoResponseDto) => {
  const result = data.results.map((item) => ({
    region: item.admin1,
    code: item.feature_code,
    city: item.name,
    country: item.country,
    lat: item.latitude,
    lon: item.longitude,
    timezone: item.timezone,
    id: item.id,
  }));

  return { results: result };
};
