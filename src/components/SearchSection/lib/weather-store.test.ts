import type { Mock } from "vitest";

import { createHistoryCity } from "@/testing/mocks/factories/historyData";
import { HistoryItem } from "@/types/history";

import { WeatherStore } from "./weather-store";

const setup = (): SetupReturn => {
  const historyData = createHistoryCity().slice(0, 1);
  const storageKey = `test-key-${Math.random()}`;
  const store = new WeatherStore(storageKey);
  const listener = vi.fn();

  return {
    storageKey,
    historyData,
    store,
    listener,
    subscribe: () => store.subscribe(listener),
    update: (data: HistoryItem[] = historyData) => store.update(data),
  };
};

describe("WeatherStore", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should load empty array", () => {
    const { store } = setup();
    expect(store.getSnapshot()).toEqual([]);
  });

  it("should save city and notify subscribers", () => {
    const { store, subscribe, update, historyData, storageKey, listener } =
      setup();

    subscribe(listener);
    update();

    expect(store.getSnapshot()).toEqual(historyData);
    expect(localStorage.getItem(storageKey)).toContain("Warsaw");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("should handle wrong JSON data", () => {
    const { store, listener, subscribe, update, historyData } = setup();

    subscribe(listener);
    update([...historyData, { city: "invalid data" } as HistoryItem]);

    expect(store.getSnapshot().length).toBe(1);
    expect(store.getSnapshot()).toEqual(historyData);
  });
});

interface SetupReturn {
  storageKey: string;
  historyData: HistoryItem[];
  store: WeatherStore;
  listener: Mock;
  subscribe: (listener: Mock) => () => boolean;
  update: (historyData?: HistoryItem[]) => void;
}
