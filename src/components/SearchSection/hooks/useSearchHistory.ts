import { useCallback, useMemo, useSyncExternalStore } from "react";

import { WeatherStore } from "@/components/SearchSection/lib/weather-store";
import type { HistoryItem } from "@/types/history";
import type { CityData } from "@/types/location";

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

  const addCity = useCallback((cityData: CityData, favorited?: boolean) => {
    const { lat, lon, city, country } = cityData;
    const id = `${city.toLowerCase()}-${country.toLowerCase()}`;

    const currentFavorites = favoriteStore.getSnapshot();
    const isFavorited = currentFavorites.some(
      (item) => item.latitude === lat && item.longitude === lon,
    );

    recentStore.update((prev) => {
      const newitem: HistoryItem = {
        id,
        city: city.toLowerCase().trim(),
        country: country.toLowerCase().trim(),
        isFavorite: isFavorited || !!favorited,
        timestamp: Date.now(),
        latitude: lat,
        longitude: lon,
      };

      return [newitem, ...prev.filter((item) => item.id !== id)].slice(0, 8);
    });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    recentStore.update((prev) => {
      const newData = prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
      );

      const targetItem = newData.find((item) => item.id === id);
      if (targetItem) {
        favoriteStore.update((prev) => {
          if (targetItem.isFavorite)
            return [targetItem, ...prev.filter((item) => item.id !== id)];
          return prev.filter((item) => item.id !== id);
        });
      }

      return newData;
    });
  }, []);

  const removeCity = useCallback(
    (id: string) =>
      recentStore.update((prev) => prev.filter((item) => item.id !== id)),
    [],
  );

  const removeFavorite = useCallback((id: string) => {
    favoriteStore.update((prev) => prev.filter((item) => item.id !== id));
    recentStore.update((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: false } : item,
      ),
    );
  }, []);

  return useMemo(
    () => ({
      recent,
      favorites,
      addCity,
      toggleFavorite,
      removeCity,
      removeFavorite,
    }),
    [recent, favorites, addCity, toggleFavorite, removeCity, removeFavorite],
  );
}

interface UseSearchHistoryReturn {
  recent: HistoryItem[];
  favorites: HistoryItem[];
  addCity: (cityData: CityData, favorited?: boolean) => void;
  toggleFavorite: (id: string) => void;
  removeCity: (id: string) => void;
  removeFavorite: (id: string) => void;
}
