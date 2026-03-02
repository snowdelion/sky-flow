import { z } from "zod";

import type { HistoryItem } from "@/types/history";

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

      const result = z.array(HistoryItemSchema).safeParse(parsed);
      this.data = result.success ? result.data : [];
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
    const rawData =
      typeof newData === "function" ? newData(this.data) : newData;
    const validatedData = Array.isArray(rawData)
      ? rawData.filter((item) => HistoryItemSchema.safeParse(item).success)
      : [];

    this.data = validatedData;
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    this.listeners.forEach((listener) => listener());
  }

  reset(): void {
    this.loadFromStorage();
    this.listeners.forEach((listener) => listener());
  }
}

const HistoryItemSchema = z.object({
  id: z
    .string()
    .includes("-")
    .transform((value) => value.toLowerCase()),

  city: z.string().trim().min(2),
  country: z.string().trim().min(2),
  isFavorite: z.boolean(),
  timestamp: z.number().positive(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});
