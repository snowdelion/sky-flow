import type { SearchDataItem } from "@/components/SearchSection/types/SearchData";

import { CITY_BASE_DATA } from "../data/cities";

export const createResultsMocks = (
  overrides: Partial<SearchDataItem> = {},
): SearchDataItem[][] => {
  return Object.entries(CITY_BASE_DATA).map(([name, data]) => [
    ...Array(7).fill({
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
      id: data.last.id,
      city: data.last.city,
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
