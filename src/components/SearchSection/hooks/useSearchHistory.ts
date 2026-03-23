import { useCallback, useMemo, useSyncExternalStore } from "react";

import { WeatherStore } from "@/components/SearchSection/lib/weather-store";
import type {
  HistoryData,
  HistoryItem,
} from "@/components/SearchSection/types/history";
import { useSearchStore } from "@/stores/useSearchStore";
import { isFoundCity, isNotFoundCity, type CityData } from "@/types/location";
import { formatCityDisplay } from "@/utils/formatters";

export const recentStore = new WeatherStore("weather-recent", 8);
export const favoriteStore = new WeatherStore("weather-favorite", 100);
const EMPTY_ARRAY: HistoryData = [];

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
    if (!isFoundCity(cityData) || isNotFoundCity(cityData)) return;
    useSearchStore.getState().setLastValidatedCity(cityData);

    const { city, country, lat, lon, region, code } = cityData;

    const currentFavorites = favoriteStore.getSnapshot();
    const isFavorited = currentFavorites.some(
      (item) => item.latitude === lat && item.longitude === lon,
    );

    const displayName = formatCityDisplay(cityData);
    const id = generateCityId(city, region, country);

    recentStore.update((prev) => {
      const newitem: HistoryItem = {
        id,
        city: city.trim(),
        country: country?.trim(),
        region,
        code,
        displayName,
        isFavorite: isFavorited || !!favorited,
        timestamp: Date.now(),
        latitude: lat,
        longitude: lon,
      };

      return [newitem, ...prev.filter((item) => item.id !== newitem.id)];
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

const generateCityId = (
  city: string,
  region?: string,
  country?: string,
): string => {
  const baseId = city.toLowerCase();
  const regionId = region
    ? `${baseId}-${region.toLowerCase().replace(/\s+/g, "-")}`
    : baseId;
  const id = country
    ? `${regionId}-${country.toLowerCase().replace(/\s+/g, "-")}`
    : regionId;

  return id;
};

interface UseSearchHistoryReturn {
  recent: HistoryData;
  favorites: HistoryData;
  addCity: (cityData: CityData, favorited?: boolean) => void;
  toggleFavorite: (id: string) => void;
  removeCity: (id: string) => void;
  removeFavorite: (id: string) => void;
}
