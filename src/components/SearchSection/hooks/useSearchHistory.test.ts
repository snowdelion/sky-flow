import { renderHook, act } from "@testing-library/react";
import { beforeEach, describe, expect, it, type Mock } from "vitest";

import { createHistoryCity } from "@/testing/mocks/factories/historyData";
import type { CityData } from "@/types/location";

import {
  favoriteStore,
  recentStore,
  useSearchHistory,
} from "./useSearchHistory";

// --- 1. mocks ---
const setLastValidatedCity = vi.fn();
vi.mock("@/stores/useSearchStore", () => ({
  useSearchStore: Object.assign(
    (selector: Mock) =>
      selector({
        setLastValidatedCity,
      }),
    {
      getState: () => ({
        setLastValidatedCity,
      }),
    },
  ),
}));

// --- 2. city factories ---
const createCity = (
  city: string,
  country: string,
  code: string,
  region: string,
): CityData => ({
  status: "found",
  city,
  country,
  code,
  region,
  lat: 5,
  lon: 10,
});

const getTestCities = (): CityData[] =>
  [
    { city: "Tokyo", country: "Japan", code: "PPLC", region: "Tokyo" },
    {
      city: "Berlin",
      country: "Germany",
      code: "PPLC",
      region: "State of Berlin",
    },
    { city: "Warsaw", country: "Poland", code: "PPLC", region: "Masovian" },
    { city: "Minsk", country: "Belarus", code: "PPLC", region: "Minsk City" },
    { city: "Paris", country: "France", code: "PPLC", region: "Île-de-France" },
    { city: "Bern", country: "Switzerland", code: "PPLC", region: "Bern" },
    { city: "Rome", country: "Italy", code: "PPLC", region: "Lazio" },
    {
      city: "London",
      country: "United Kingdom",
      code: "PPLC",
      region: "England",
    },
    { city: "Stockholm", country: "Sweden", code: "PPLC", region: "Stockholm" },
  ].map(({ city, country, code, region }) =>
    createCity(city, country, code, region),
  );

// --- 3. tests ---
describe("useSearchHistory", () => {
  const warsawHistoryData = createHistoryCity().slice(0, 1);

  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
    recentStore.reset();
    favoriteStore.reset();
  });

  it("should get recent from localStorage", () => {
    window.localStorage.setItem(
      "weather-recent",
      JSON.stringify(warsawHistoryData),
    );
    recentStore.reset();

    const { result } = renderHook(() => useSearchHistory());

    expect(result.current.recent).toHaveLength(1);
    expect(result.current.recent[0].city).toBe("Warsaw");
    expect(result.current.recent[0].id).toBe("warsaw-poland-masovian");
  });

  it("should get favorites from localStorage", () => {
    window.localStorage.setItem(
      "weather-favorite",
      JSON.stringify([{ ...warsawHistoryData[0], isFavorite: true }]),
    );
    favoriteStore.reset();

    const { result } = renderHook(() => useSearchHistory());

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0].city).toBe("Warsaw");
    expect(result.current.favorites[0].id).toBe("warsaw-poland-masovian");
    expect(result.current.favorites[0].isFavorite).toBe(true);
  });

  it("should add a new city to the recent", () => {
    const cities = getTestCities();
    const { result } = renderHook(() => useSearchHistory());

    act(() => result.current.addCity(cities[0]));

    expect(result.current.recent).toHaveLength(1);
    expect(result.current.recent[0]).toMatchObject({
      id: "tokyo-tokyo-japan",
      city: "Tokyo",
      country: "Japan",
      isFavorite: false,
    });

    const saved = JSON.parse(
      window.localStorage.getItem("weather-recent") || "[]",
    );
    expect(saved).toHaveLength(1);
    expect(saved[0].id).toBe("tokyo-tokyo-japan");
    expect(setLastValidatedCity).toHaveBeenCalledTimes(1);
    expect(setLastValidatedCity).toHaveBeenCalledWith(cities[0]);
  });

  it("shouldn't duplicate the same city", () => {
    const cities = getTestCities();
    const { result } = renderHook(() => useSearchHistory());

    act(() => result.current.addCity(cities[0]));
    act(() => result.current.addCity(cities[0]));

    expect(result.current.recent).toHaveLength(1);
  });

  it("should have maximum 8 cities", () => {
    const cities = getTestCities();
    const { result } = renderHook(() => useSearchHistory());

    act(() => cities.forEach((cityData) => result.current.addCity(cityData)));

    expect(result.current.recent).toHaveLength(8);
    expect(result.current.recent[result.current.recent.length - 1].id).toBe(
      "berlin-state-of-berlin-germany",
    );
  });

  it("should toggle favorite", () => {
    const cities = getTestCities();
    const { result } = renderHook(() => useSearchHistory());

    act(() => result.current.addCity(cities[0]));
    const id = result.current.recent[0].id;
    act(() => result.current.toggleFavorite(id));

    expect(result.current.recent[0].isFavorite).toBe(true);
    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0].city).toBe("Tokyo");
    expect(result.current.favorites[0].isFavorite).toBe(true);

    act(() => result.current.toggleFavorite(id));

    expect(result.current.recent[0].isFavorite).toBe(false);
    expect(result.current.favorites).toHaveLength(0);
  });

  it("should remove city from recent", () => {
    const cities = getTestCities();
    const { result } = renderHook(() => useSearchHistory());

    act(() => result.current.addCity(cities[0]));
    const tokyoId = result.current.recent[0].id;
    expect(result.current.recent[0].id).toBe(tokyoId);
    act(() => result.current.addCity(cities[1]));

    expect(result.current.recent).toHaveLength(2);

    act(() => result.current.removeCity(tokyoId));

    expect(result.current.recent).toHaveLength(1);
    expect(result.current.recent[0].city).toBe("Berlin");
  });

  it("should remove from favorite in favorite tab", async () => {
    const cities = getTestCities();
    const { result } = renderHook(() => useSearchHistory());

    await act(() =>
      cities.slice(0, 3).map((cityData) => result.current.addCity(cityData)),
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
