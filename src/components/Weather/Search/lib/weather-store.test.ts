import type { Mock } from "vitest";

import type {
  HistoryData,
  HistoryItem,
} from "@/components/Weather/Search/types/history";
import { createHistoryCity } from "@/testing/mocks/factories/historyData";

import { WeatherStore } from "./weather-store";

const setup = (): SetupReturn => {
  const historyData = createHistoryCity().slice(0, 1);
  const storageKey = `test-key-${Math.random()}`;
  const store = new WeatherStore(storageKey, 8);
  const listener = vi.fn();

  return {
    storageKey,
    historyData,
    store,
    listener,
    subscribe: () => store.subscribe(listener),
    update: (
      data: HistoryData = historyData,
      overrides: Partial<HistoryItem> = {},
    ) => store.update([{ ...data[0], ...overrides }]),
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

    update(historyData);

    const snapshot = store.getSnapshot();

    expect(snapshot).toEqual(historyData);
    expect(snapshot[0].city).toBe("Warsaw");
    expect(localStorage.getItem(storageKey)).toContain(
      "warsaw-poland-masovian",
    );
    expect(snapshot[0].displayName).toBe("Warsaw, Poland");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("should handle wrong JSON data", () => {
    const { store, listener, subscribe, update } = setup();

    subscribe(listener);
    update([
      {
        id: 1,
        city: ["invalid data"],
        country: NaN,
        isFavorite: { wrong: "data" },
        latitude: "1",
        longitude: "2",
        timestamp: "3",
      } as unknown as HistoryItem,
    ]);

    expect(store.getSnapshot().length).toBe(0);
    expect(store.getSnapshot()).toEqual([]);
  });
});

interface SetupReturn {
  storageKey: string;
  historyData: HistoryItem[];
  store: WeatherStore;
  listener: Mock;
  subscribe: (listener: Mock) => () => void;
  update: (historyData?: HistoryData, overrides?: Partial<HistoryItem>) => void;
}
