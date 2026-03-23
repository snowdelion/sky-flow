import {
  type HistoryData,
  HistoryDataSchema,
} from "@/components/SearchSection/types/history";

export class WeatherStore {
  private data: HistoryData = [];
  private listeners = new Set<() => void>();
  private storageKey: string;
  private limit: number;

  constructor(storageKey: string, limit: number) {
    this.storageKey = storageKey;
    this.limit = limit;
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem(this.storageKey);
      const parsed = saved ? JSON.parse(saved) : [];

      const result = HistoryDataSchema.safeParse(parsed);
      this.data = result.success ? result.data : [];
    } catch {
      this.data = [];
    }
  }

  getSnapshot(): HistoryData {
    return this.data;
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  update(newData: HistoryData | ((prev: HistoryData) => HistoryData)): void {
    const rawData =
      typeof newData === "function" ? newData(this.data) : newData;
    const result = HistoryDataSchema.safeParse(rawData.slice(0, this.limit));

    this.data = result.success ? result.data : this.data;
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    this.listeners.forEach((listener) => listener());
  }

  reset(): void {
    this.loadFromStorage();
    this.listeners.forEach((listener) => listener());
  }
}
