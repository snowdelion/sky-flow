import type { Units } from "@/entities/weather";

export interface SettingsStore {
  units: Units;
  selectedDayIndex: number;

  setUnits: (update: Partial<Units> | ((prev: Units) => Units)) => void;
  setSelectedDayIndex: (day: number) => void;
  reset: () => void;
}
