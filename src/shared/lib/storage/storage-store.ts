import z from "zod";

export class StorageStore<T extends Record<string, unknown> | Array<unknown>> {
  private data: T;
  private listeners = new Set<() => void>();

  constructor(
    private storageKey: string,
    private limit: number,
    private schema: z.ZodType<T>,
    private defaultValue: T,
  ) {
    this.data = this.loadFromStorage();
  }

  private loadFromStorage(): T {
    try {
      const saved = localStorage.getItem(this.storageKey);
      const parsed = saved ? JSON.parse(saved) : [];
      const { success, data } = this.schema.safeParse(parsed);
      return success ? data : this.defaultValue;
    } catch {
      return this.defaultValue;
    }
  }

  getSnapshot(): T {
    return this.data;
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  update(newData: T | ((prev: T) => T)): void {
    const rawData =
      typeof newData === "function" ? newData(this.data) : newData;

    const validateData = Array.isArray(rawData)
      ? rawData.slice(0, this.limit)
      : rawData;

    const { success, data } = this.schema.safeParse(validateData);

    if (success) {
      this.data = data;
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
      this.listeners.forEach((l) => l());
    }
  }

  reset(): void {
    this.data = this.defaultValue;
    localStorage.removeItem(this.storageKey);
    this.listeners.forEach((listener) => listener());
  }
}
