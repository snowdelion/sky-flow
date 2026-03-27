import type { HistoryItem } from "@/components/Weather/Search/types/history";

export const createHistoryCity = (
  overrides: Partial<HistoryItem> = {},
): HistoryItem[] => {
  return [
    {
      ...getWarsawHistory(),
      ...overrides,
    },
    {
      ...getBerlinHistory(),
      ...overrides,
    },
    {
      ...getMinskHistory(),
      ...overrides,
    },
  ];
};

const getWarsawHistory = (): HistoryItem => ({
  id: "warsaw-poland-masovian",
  code: "PPLC",
  city: "Warsaw",
  region: "Masovian",
  country: "Poland",
  displayName: "Warsaw, Poland",
  isFavorite: false,
  timestamp: 1,
  latitude: 52.22977,
  longitude: 21.01178,
});

const getBerlinHistory = (): HistoryItem => ({
  city: "Berlin",
  code: "PPLC",
  country: "Germany",
  displayName: "Berlin, Germany",
  id: "berlin-germany-state-of-berlin",
  isFavorite: false,
  latitude: 52.52437,
  longitude: 13.41053,
  region: "State of Berlin",
  timestamp: 2,
});

const getMinskHistory = (): HistoryItem => ({
  city: "Minsk",
  code: "PPLC",
  country: "Belarus",
  displayName: "Minsk, Belarus",
  id: "minsk-belarus-minsk-city",
  isFavorite: false,
  latitude: 53.9,
  longitude: 27.56667,
  region: "Minsk City",
  timestamp: 3,
});
