import { createHistoryCity } from "@/testing/mocks/factories/historyData";
import { HistoryItem } from "@/types/history";

import { WeatherStore } from "./weather-store";

describe("WeatherStore", () => {
  const storageKey = "test-key";
  const historyData = createHistoryCity();

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should load empty array", () => {
    const store = new WeatherStore(storageKey);
    expect(store.getSnapshot()).toEqual([]);
  });

  it("should save city and notify subscribers", () => {
    const store = new WeatherStore(storageKey);
    const listener = vi.fn();

    store.subscribe(listener);
    store.update(historyData);

    expect(store.getSnapshot()).toEqual(historyData);
    expect(localStorage.getItem(storageKey)).toContain("Warsaw");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("should handle wrong JSON data", () => {
    const store = new WeatherStore(storageKey);
    const listener = vi.fn();

    store.subscribe(listener);
    store.update([...historyData, { city: "invalid data" } as HistoryItem]);

    expect(store.getSnapshot().length).toBe(1);
    expect(store.getSnapshot()).toEqual(historyData);
  });
});
