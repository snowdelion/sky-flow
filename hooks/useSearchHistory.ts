import { useCallback, useSyncExternalStore } from "react";

import type { UseSearchHistoryReturn } from "./useSearchHistory.types";

import type { HistoryItem } from "@/components/SearchSection/SearchHistory.types";
import { WeatherStore } from "@/lib/weather-store";
import type { CityData } from "@/types/api/CityData";

export const recentStore = new WeatherStore("weather-recent");
export const favoriteStore = new WeatherStore("weather-favorite");
const EMPTY_ARRAY: [] = [];

export function useSearchHistory(): UseSearchHistoryReturn {
  const recent = useSyncExternalStore(
    (listener) => recentStore.subscribe(listener),
    () => recentStore.getSnapshot(),
    () => EMPTY_ARRAY,
  );

  const favorites = useSyncExternalStore(
    (listener) => favoriteStore.subscribe(listener),
    () => favoriteStore.getSnapshot(),
    () => EMPTY_ARRAY,
  );

  const addCity = useCallback(
    (cityData: CityData, favorited?: boolean) => {
      const { lat, lon } = cityData;
      const isFavorited = favorites.some(
        (item) => item.latitude === lat && item.longitude === lon,
      );
      recentStore.update((prev: HistoryItem[]) => {
        const { city, country } = cityData;
        const id = `${city.toLowerCase()}-${country.toLowerCase()}`;

        const newItem: HistoryItem = {
          id,
          city: city.trim().toLowerCase(),
          country: country.trim().toLowerCase(),
          isFavorite: isFavorited || (!!favorited && favorited),
          timestamp: Date.now(),
          latitude: lat,
          longitude: lon,
        };

        const newData: HistoryItem[] = [
          newItem,
          ...prev.filter((item) => item.id !== id),
        ].slice(0, 8);

        return newData;
      });
    },
    [favorites],
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      const newData = recent.map((item: HistoryItem) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
      );
      recentStore.update(newData);

      const allFavorites = newData.filter((item) => item.isFavorite);
      favoriteStore.update([
        ...favorites.filter((item) => item.id !== id),
        ...allFavorites.filter((item) => item.id === id),
      ]);
    },
    [recent, favorites],
  );

  const removeCity = useCallback(
    (id: string) => {
      const newData = recent.filter((item: HistoryItem) => item.id !== id);

      recentStore.update(newData);
    },
    [recent],
  );

  const removeFavorite = useCallback(
    (id: string) => {
      const newFavorites = favorites.filter((item) => item.id !== id);
      favoriteStore.update(newFavorites);

      const newRecent = recent.map((item) =>
        item.id === id ? { ...item, isFavorite: false } : item,
      );
      recentStore.update(newRecent);
    },
    [recent, favorites],
  );

  return {
    recent,
    favorites,
    addCity,
    toggleFavorite,
    removeCity,
    removeFavorite,
  };
}
