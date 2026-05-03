import z from "zod";
import { StorageStore } from "../storage-store";

// --- 1. schema ---
const TestSchema = z.object({
  id: z.number(),
  city: z.string(),
});

type TestItem = z.infer<typeof TestSchema>;
type TestData = TestItem[];
const DEFAULT_VALUE: TestData = [];

// --- 2. setup ---
const setup = (limit: number = 8) => {
  const storageKey = `test-key-${Math.random()}`;
  const store = new StorageStore<TestData>(
    storageKey,
    limit,
    z.array(TestSchema),
    DEFAULT_VALUE,
  );
  const listener = vi.fn();

  return {
    storageKey,
    store,
    listener,
  };
};

// --- 3. tests ---
describe("StorageStore", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should load default value", () => {
    const { store } = setup();
    expect(store.getSnapshot()).toEqual([]);
  });

  it("should save city and notify subscribers", () => {
    const { store, storageKey, listener } = setup();
    const testData: TestData = [{ id: 1, city: "Warsaw" }];

    store.subscribe(listener);
    store.update(testData);

    const snapshot = store.getSnapshot();

    expect(snapshot).toEqual(testData);
    expect(localStorage.getItem(storageKey)).toContain("Warsaw");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("should handle wrong JSON data", () => {
    const { store, listener } = setup();
    store.subscribe(listener);

    store.update([{ id: "1", city: NaN }] as unknown as TestData);
    expect(store.getSnapshot()).toEqual(DEFAULT_VALUE);
    expect(listener).not.toHaveBeenCalled();
  });

  it("should limit to 2", () => {
    const { store } = setup(1);

    store.update([
      { id: 1, city: "Warsaw" },
      { id: 2, city: "Berlin" },
    ]);

    const snapshot = store.getSnapshot();
    expect(snapshot.length).toBe(1);
    expect(snapshot[0].city).toBe("Warsaw");
  });
});
