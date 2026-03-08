import type { SearchDataItem } from "@/components/SearchSection/types/SearchData";

// --- 1.1 search results factories ---
export const createResultsMocks = (
  overrides: Partial<SearchDataItem> = {},
): SearchDataItem[] => {
  return [
    ...Array(7).fill({
      ...getFirstSearchResults(),
      ...overrides,
    }),

    {
      ...getLastSearchResults(),
      ...overrides,
    },
  ];
};

// --- 1.2 search results items ---
const getFirstSearchResults = (): SearchDataItem => ({
  city: "Berlin",
  country: "Germany",
  id: 2950159,
  latitude: 52.52437,
  longitude: 13.41053,
  temperature: 11.5,
  temperatureUnit: "°C",
  weatherCode: 3,
});

const getLastSearchResults = (): SearchDataItem => ({
  city: "East Berlin",
  country: "United States",
  id: 4557666,
  latitude: 39.9376,
  longitude: -76.97859,
  temperature: 11,
  temperatureUnit: "°C",
  weatherCode: 3,
});
