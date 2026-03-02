import { renderHook, act } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import type { CityData } from "@/types/location";

import {
  favoriteStore,
  recentStore,
  useSearchHistory,
} from "./useSearchHistory";

const createCity = (city: string, country: string): CityData => ({
  city,
  country,
  lat: 5,
  lon: 10,
});

const TEST_CITIES = [
  { city: "Tokyo", country: "Japan" },
  { city: "Berlin", country: "Germany" },
  { city: "Warsaw", country: "Poland" },
  { city: "Minsk", country: "Belarus" },
  { city: "Paris", country: "France" },
  { city: "Bern", country: "Switzerland" },
  { city: "Rome", country: "Italy" },
  { city: "London", country: "United Kingdom" },
  { city: "Stockholm", country: "Sweden" },
].map(({ city, country }) => createCity(city, country));

describe("useSearchHistory", () => {
  beforeEach(() => {
    window.localStorage.clear();
    recentStore.reset();
    favoriteStore.reset();
  });

  it("should get recent from localStorage", () => {
    const mockData = [
      {
        id: "warsaw-poland",
        city: "Warsaw",
        country: "Poland",
        isFavorite: false,
        timestamp: 123,
        latitude: 52,
        longitude: 21,
      },
    ];

    window.localStorage.setItem("weather-recent", JSON.stringify(mockData));
    recentStore.reset();

    const { result } = renderHook(() => useSearchHistory());

    expect(result.current.recent).toHaveLength(1);
    expect(result.current.recent[0].city).toBe("Warsaw");
    expect(result.current.recent[0].id).toBe("warsaw-poland");
  });

  it("should get favorites from localStorage", () => {
    const mockData = [
      {
        id: "warsaw-poland",
        city: "Warsaw",
        country: "Poland",
        isFavorite: true,
        timestamp: 123,
        latitude: 52,
        longitude: 21,
      },
    ];

    window.localStorage.setItem("weather-favorite", JSON.stringify(mockData));
    favoriteStore.reset();

    const { result } = renderHook(() => useSearchHistory());

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0].city).toBe("Warsaw");
    expect(result.current.favorites[0].id).toBe("warsaw-poland");
    expect(result.current.favorites[0].isFavorite).toBe(true);
  });

  it("should add a new city to the recent", () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => result.current.addCity(TEST_CITIES[0]));

    expect(result.current.recent).toHaveLength(1);
    expect(result.current.recent[0]).toMatchObject({
      id: "tokyo-japan",
      city: "tokyo",
      country: "japan",
      isFavorite: false,
    });

    const saved = JSON.parse(
      window.localStorage.getItem("weather-recent") || "[]",
    );
    expect(saved).toHaveLength(1);
    expect(saved[0].id).toBe("tokyo-japan");
  });

  it("shouldn't duplicate the same city", () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => result.current.addCity(TEST_CITIES[0]));
    act(() => result.current.addCity(TEST_CITIES[0]));

    expect(result.current.recent).toHaveLength(1);
  });

  it("should have maximum 8 cities", () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() =>
      TEST_CITIES.forEach((cityData) => result.current.addCity(cityData)),
    );

    expect(result.current.recent).toHaveLength(8);
    expect(result.current.recent[result.current.recent.length - 1].id).toBe(
      "berlin-germany",
    );
  });

  it("should toggle favorite", () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => result.current.addCity(TEST_CITIES[0]));
    const id = result.current.recent[0].id;
    act(() => result.current.toggleFavorite(id));

    expect(result.current.recent[0].isFavorite).toBe(true);
    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0].city).toBe("tokyo");
    expect(result.current.favorites[0].isFavorite).toBe(true);

    act(() => result.current.toggleFavorite(id));

    expect(result.current.recent[0].isFavorite).toBe(false);
    expect(result.current.favorites).toHaveLength(0);
  });

  it("should remove city from recent", () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => result.current.addCity(TEST_CITIES[0]));
    const tokyoId = result.current.recent[0].id;
    expect(result.current.recent[0].id).toBe(tokyoId);
    act(() => result.current.addCity(TEST_CITIES[1]));

    expect(result.current.recent).toHaveLength(2);

    act(() => result.current.removeCity(tokyoId));

    expect(result.current.recent).toHaveLength(1);
    expect(result.current.recent[0].city).toBe("berlin");
  });

  it("should remove from favorite in favorite tab", () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() =>
      TEST_CITIES.slice(0, 3).map((cityData) =>
        result.current.addCity(cityData),
      ),
    );
    const tokyoId = result.current.recent[0].id;
    const berlinId = result.current.recent[1].id;
    const warsawId = result.current.recent[2].id;
    act(() => result.current.toggleFavorite(tokyoId));
    act(() => result.current.toggleFavorite(berlinId));
    act(() => result.current.toggleFavorite(warsawId));
    act(() => result.current.removeFavorite(berlinId));

    expect(result.current.recent).toHaveLength(3);
    expect(result.current.favorites).toHaveLength(2);
    expect(result.current.recent[0].isFavorite).toBe(true);
    expect(result.current.recent[1].isFavorite).toBe(false);
    expect(result.current.recent[2].isFavorite).toBe(true);
  });

  it("should handle corrupted localStorage", () => {
    window.localStorage.setItem("weather-recent", "broken json");
    recentStore.reset();
    const { result } = renderHook(() => useSearchHistory());

    expect(result.current.recent).toEqual([]);
  });
});
