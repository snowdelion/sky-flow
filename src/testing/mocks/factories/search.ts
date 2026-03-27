import type { SearchDataItem } from "@/components/Weather/Search/types/SearchData";

import { CITY_BASE_DATA } from "../data/cities";

export const createResultsMocks = (
  overrides: Partial<SearchDataItem> = {},
): SearchDataItem[][] => {
  return Object.entries(CITY_BASE_DATA).map(([name, data]) => [
    ...Array(7).fill({
      region: data.first.region,
      code: data.first.code,
      id: data.first.id,
      city: name,
      country: data.first.country,
      latitude: data.first.lat,
      longitude: data.first.lon,
      temperature: data.first.temp,
      temperatureUnit: "°C",
      weatherCode: 0,
      ...overrides,
    }),
    {
      region: data.last.region,
      code: data.last.code,
      id: data.last.id,
      city: data.last.name,
      country: data.last.country,
      latitude: data.last.lat,
      longitude: data.last.lon,
      temperature: data.last.temp,
      temperatureUnit: "°C",
      weatherCode: 0,
      ...overrides,
    },
  ]);
};
