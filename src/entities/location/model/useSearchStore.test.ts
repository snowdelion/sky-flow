import { act } from "@testing-library/react";

import { DEFAULT_CITY_DATA } from "@/pages-flat/weather/model/constants";
import { createCityData } from "@/shared/lib/testing";

import { useSearchStore } from "./useSearchStore";

describe("useSearchStore", () => {
  const { berlinCityData } = createCityData();

  beforeEach(() => {
    useSearchStore.getState().reset();
  });

  it("should set input value", async () => {
    act(() => useSearchStore.getState().setInputValue("Berlin"));
    expect(useSearchStore.getState().inputValue).toBe("Berlin");
  });

  it("should toggle dropdown", () => {
    act(() => useSearchStore.getState().setIsOpen(true));
    expect(useSearchStore.getState().isOpen).toBe(true);
  });

  it("should toggle current tab", () => {
    act(() => useSearchStore.getState().setCurrentTab("favorites"));
    expect(useSearchStore.getState().currentTab).toBe("favorites");
    act(() => useSearchStore.getState().setCurrentTab("recent"));
    expect(useSearchStore.getState().currentTab).toBe("recent");
  });

  it("should save last validated city", () => {
    expect(useSearchStore.getState().lastValidatedCity).toEqual(
      DEFAULT_CITY_DATA,
    );
    act(() => useSearchStore.getState().setLastValidatedCity(berlinCityData));
    expect(useSearchStore.getState().lastValidatedCity).toEqual(berlinCityData);

    const notFoundCityData = {
      status: "not-found" as const,
      city: "notfound123",
    };
    act(() => useSearchStore.getState().setLastValidatedCity(notFoundCityData));
    expect(useSearchStore.getState().lastValidatedCity).toEqual(berlinCityData);
  });

  it("should activate hydration", async () => {
    expect(useSearchStore.getState()._hasHydrated).toBe(false);
    await useSearchStore.persist.rehydrate();
    expect(useSearchStore.getState()._hasHydrated).toBe(true);
  });

  it("should reset store", () => {
    act(() => {
      useSearchStore.getState().setInputValue("Berlin");
      useSearchStore.getState().setIsOpen(true);
      useSearchStore.getState().reset();
    });

    expect(useSearchStore.getState().inputValue).toBe("");
    expect(useSearchStore.getState().isOpen).toBe(false);
  });

  it("should partialize save units to localStorage", () => {
    window.localStorage.clear();

    useSearchStore.setState({
      lastValidatedCity: berlinCityData,
      isOpen: true,
    });

    const storage = JSON.parse(
      window.localStorage.getItem("weather-search") as string,
    );

    expect(storage).toEqual({
      state: { lastValidatedCity: berlinCityData },
      version: 1,
    });
    expect(storage).not.toHaveProperty("isOpen");
  });
});
