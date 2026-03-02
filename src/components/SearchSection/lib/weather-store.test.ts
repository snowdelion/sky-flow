import { HistoryItem } from "@/types/history";

import { WeatherStore } from "./weather-store";

describe("WeatherStore", () => {
  const storageKey = "test-key";
  const mockNewData: HistoryItem = {
    id: "minsk-belarus",
    city: "Minsk",
    country: "Belarus",
    isFavorite: false,
    timestamp: 1,
    latitude: 53.9,
    longitude: 27.56667,
  };

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
    store.update([mockNewData] as HistoryItem[]);

    expect(store.getSnapshot()).toEqual([mockNewData]);
    expect(localStorage.getItem(storageKey)).toContain("Minsk");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("should handle wrong JSON data", () => {
    const store = new WeatherStore(storageKey);
    const listener = vi.fn();

    store.subscribe(listener);
    store.update([
      mockNewData,
      { city: "invalid data" },
    ] as unknown as HistoryItem[]);

    expect(store.getSnapshot().length).toBe(1);
    expect(store.getSnapshot()).toEqual([mockNewData]);
  });
});
