import type { HistoryItem } from "@/components/SearchSection/types/history";

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
  id: "warsaw-poland",
  city: "warsaw",
  country: "poland",
  isFavorite: false,
  timestamp: 1,
  latitude: 52.22977,
  longitude: 21.01178,
});

const getBerlinHistory = (): HistoryItem => ({
  id: "berlin-germany",
  city: "berlin",
  country: "germany",
  isFavorite: false,
  timestamp: 2,
  latitude: 52.52437,
  longitude: 13.41053,
});

const getMinskHistory = (): HistoryItem => ({
  id: "minsk-belarus",
  city: "minsk",
  country: "belarus",
  isFavorite: false,
  timestamp: 3,
  latitude: 53.9,
  longitude: 27.56667,
});
