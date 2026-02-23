import type { HistoryItem } from "@/components/SearchSection/SearchHistory.types";

export class WeatherStore {
  private data: HistoryItem[] = [];
  private listeners = new Set<() => void>();
  private storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem(this.storageKey);
      const parsed = saved ? JSON.parse(saved) : [];
      if (Array.isArray(parsed)) {
        this.data = parsed;
      } else {
        this.data = [];
      }
    } catch {
      this.data = [];
    }
  }

  getSnapshot(): HistoryItem[] {
    return this.data;
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  update(
    newData: HistoryItem[] | ((prev: HistoryItem[]) => HistoryItem[]),
  ): void {
    if (typeof newData === "function") {
      this.data = newData(this.data);
    } else {
      this.data = newData;
    }
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    this.listeners.forEach((listener) => listener());
  }

  reset(): void {
    this.loadFromStorage();
    this.listeners.forEach((listener) => listener());
  }
}
